/**
 * Quản lý ứng viên (/recruitment/candidate) — bám RecruitmentCandidateIndexComponent.razor:
 * KPI 4 ô bấm lọc, lưới 20 cột (Yêu cầu/Vòng/TA Owner theo 2 lượt mới nhất), sửa Ghi chú tại chỗ,
 * nhập/xuất Excel. Trang chi tiết ở RcCandidateDetail.tsx.
 */
import React, { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { Columns3, Eye, FileSpreadsheet, FileUp, Filter, Mail, Plus, ShieldCheck, Users, X } from 'lucide-react';
import { ErpPage, ErpTitleBar, Panel, Btn, KpiBox, erp } from '../erp/Erp';
import { useToast } from '../../marcom/MarcomUi';
import { useRc } from '../../recruitment/rc/RcContext';
import { RcCandidate, RcApplication, RcRequest, HR_STATUS_LABEL, dmy, norm } from '../../recruitment/rc/rcData';
import { StageSelect, HrBadge, GridToolbar, SearchBox, Pager, Dash } from './rcUi';
import { RcImportModal } from './RcImportModal';
import { RcSendMailModal } from './RcSendMailModal';
import { RcCandidateDetail, DetailMode } from './RcCandidateDetail';

export type Perm = 'full' | 'read';

type KpiKey = '' | 'assigned' | 'unassigned' | 'offering';
type View = { mode: 'list' } | { mode: DetailMode; id?: string };

export const RcCandidatePage: React.FC<{ onNavigate?: (menuTitle: string) => void }> = ({ onNavigate }) => {
  const { focus, setFocus } = useRc();
  const [view, setView] = useState<View>({ mode: 'list' });
  const [perm, setPerm] = useState<Perm>('full');
  const [mailFor, setMailFor] = useState<string | null>(null);
  const { toast, toastNode } = useToast();

  useEffect(() => {
    if (focus?.screen === 'candidate') {
      setView(focus.mode === 'create' ? { mode: 'create' } : { mode: focus.mode === 'edit' ? 'edit' : 'view', id: focus.id });
      setFocus(null);
    }
  }, [focus, setFocus]);

  const openRequest = (requestId: string) => {
    setFocus({ screen: 'request', id: requestId });
    onNavigate?.('Yêu cầu tuyển dụng');
  };

  return (
    <ErpPage>
      {view.mode === 'list' ? (
        <CandidateList
          perm={perm}
          onPerm={setPerm}
          onOpen={(id) => setView({ mode: 'view', id })}
          onCreate={() => setView({ mode: 'create' })}
          onMail={setMailFor}
          onOpenRequest={openRequest}
          toast={toast}
        />
      ) : (
        <RcCandidateDetail
          key={`${view.mode}-${view.id || 'new'}`}
          id={view.id}
          mode={view.mode}
          perm={perm}
          onBack={() => setView({ mode: 'list' })}
          onOpen={(id, mode) => setView(mode === 'create' ? { mode: 'create' } : { mode, id })}
          onMail={setMailFor}
          onOpenRequest={openRequest}
          toast={toast}
        />
      )}
      {mailFor && <RcSendMailModal candidateId={mailFor} onClose={() => setMailFor(null)} onDone={(m) => toast(m)} />}
      {toastNode}
    </ErpPage>
  );
};

export const PermSelect: React.FC<{ perm: Perm; onChange: (p: Perm) => void }> = ({ perm, onChange }) => (
  <label className="flex items-center gap-1.5 text-[12px] text-slate-600 border border-slate-300 rounded-[3px] bg-slate-50 pl-2" title="Giả lập quyền (prototype chưa có đăng nhập)">
    <ShieldCheck size={13} className="text-slate-500" /> Quyền
    <select value={perm} onChange={(e) => onChange(e.target.value as Perm)} className="h-8 px-1.5 bg-white border-l border-slate-300 text-[12px] font-semibold text-[#1e3a5f] outline-none cursor-pointer">
      <option value="full">Đủ quyền</option>
      <option value="read">Chỉ xem</option>
    </select>
  </label>
);

// ==========================================================================
// DANH SÁCH
// ==========================================================================
interface Row {
  c: RcCandidate;
  a1?: RcApplication;
  a2?: RcApplication;
  r1?: RcRequest;
  r2?: RcRequest;
  apps: RcApplication[];
}

interface Col {
  key: string;
  caption: string;
  width?: number;
  hidden?: boolean;
  noSort?: boolean;
  noFilter?: boolean;
  align?: 'center' | 'right';
  text: (r: Row, i: number) => string;
  render?: (r: Row, i: number) => React.ReactNode;
}

const KPI_TIPS: Record<KpiKey, string> = {
  '': 'Bấm để bỏ lọc',
  assigned: 'Bấm để lọc ứng viên đã được gán vào ít nhất một yêu cầu tuyển dụng',
  unassigned: 'Bấm để lọc ứng viên chưa gán vào yêu cầu tuyển dụng nào',
  offering: 'Bấm để lọc ứng viên có lượt ứng tuyển đang ở vòng Offering',
};

const CandidateList: React.FC<{
  perm: Perm;
  onPerm: (p: Perm) => void;
  onOpen: (id: string) => void;
  onCreate: () => void;
  onMail: (id: string) => void;
  onOpenRequest: (requestId: string) => void;
  toast: (m: string) => void;
}> = ({ perm, onPerm, onOpen, onCreate, onMail, onOpenRequest, toast }) => {
  const { candidates, applications, request, setAppStage, setCandidateStage, updateNote } = useRc();
  const canEdit = perm === 'full';
  const [kw, setKw] = useState('');
  const [kpi, setKpi] = useState<KpiKey>('');
  const [colFilter, setColFilter] = useState<Record<string, string>>({});
  const [hidden, setHidden] = useState<Set<string>>(() => new Set(['officialDate', 'resignDate']));
  const [chooser, setChooser] = useState(false);
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 }>({ key: 'fullName', dir: 1 });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [noteEdit, setNoteEdit] = useState<{ id: string; text: string } | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  const rows: Row[] = useMemo(
    () =>
      candidates.map((c) => {
        const apps = applications
          .filter((a) => a.candidateId === c.id)
          .sort((a, b) => (b.stageChangedAt || b.appliedDate).localeCompare(a.stageChangedAt || a.appliedDate));
        const [a1, a2] = apps;
        return { c, apps, a1, a2, r1: a1 && request(a1.requestId), r2: a2 && request(a2.requestId) };
      }),
    [candidates, applications, request],
  );

  const columns: Col[] = useMemo(
    () => [
      { key: 'stt', caption: 'STT', width: 48, noSort: true, noFilter: true, align: 'center', text: (_, i) => String(i + 1) },
      {
        key: 'fullName', caption: 'Họ và tên', width: 170, text: (r) => r.c.fullName,
        render: (r) => (
          <button type="button" onClick={() => onOpen(r.c.id)} className="text-[#1f5fa8] font-semibold hover:underline cursor-pointer text-left">
            {r.c.fullName}
          </button>
        ),
      },
      { key: 'phone', caption: 'SĐT', width: 110, text: (r) => r.c.phone },
      { key: 'email', caption: 'Email', width: 180, text: (r) => r.c.email },
      { key: 'appliedPosition', caption: 'Vị trí ứng tuyển', width: 140, noSort: true, text: (r) => r.c.appliedPosition },
      { key: 'req1', caption: 'Yêu cầu 1', width: 140, text: (r) => r.r1?.code || '', render: (r) => <ReqLink req={r.r1} onOpen={onOpenRequest} /> },
      {
        key: 'stage1', caption: 'Vòng 1', width: 160, text: (r) => r.a1?.stage || r.c.stage,
        render: (r) => (
          <StageSelect
            value={r.a1?.stage || r.c.stage}
            disabled={!canEdit}
            onChange={(s) => (r.a1 ? setAppStage(r.a1.id, s) : setCandidateStage(r.c.id, s))}
          />
        ),
      },
      { key: 'ta1', caption: 'TA Owner 1', width: 100, text: (r) => r.r1?.taPics[0] || '', render: (r) => r.r1?.taPics[0] || <Dash /> },
      { key: 'req2', caption: 'Yêu cầu 2', width: 140, text: (r) => r.r2?.code || '', render: (r) => <ReqLink req={r.r2} onOpen={onOpenRequest} /> },
      {
        key: 'stage2', caption: 'Vòng 2', width: 160, text: (r) => r.a2?.stage || '',
        render: (r) => (r.a2 ? <StageSelect value={r.a2.stage} disabled={!canEdit} onChange={(s) => setAppStage(r.a2!.id, s)} /> : <Dash />),
      },
      { key: 'ta2', caption: 'TA Owner 2', width: 100, text: (r) => r.r2?.taPics[0] || '', render: (r) => r.r2?.taPics[0] || <Dash /> },
      { key: 'hr', caption: 'Trạng thái HCNS', width: 140, text: (r) => (r.c.hr.status === 'None' ? '' : HR_STATUS_LABEL[r.c.hr.status]), render: (r) => <HrBadge status={r.c.hr.status} /> },
      { key: 'officialDate', caption: 'Ngày chính thức', width: 110, align: 'center', text: (r) => dmy(r.c.hr.officialDate || '') },
      { key: 'resignDate', caption: 'Ngày nghỉ việc', width: 110, align: 'center', text: (r) => dmy(r.c.hr.resignDate || '') },
      { key: 'inputDate', caption: 'Ngày ứng tuyển', width: 110, align: 'center', text: (r) => dmy(r.c.inputDate) },
      { key: 'source', caption: 'Nguồn ứng viên', width: 120, text: (r) => r.c.source },
      { key: 'taInput', caption: 'TA Input', width: 90, text: (r) => r.c.taInput },
      {
        key: 'note', caption: 'Ghi chú', width: 440, noSort: true, noFilter: true, text: (r) => r.c.note,
        render: (r) =>
          noteEdit?.id === r.c.id ? (
            <textarea
              autoFocus
              rows={2}
              value={noteEdit.text}
              onChange={(e) => setNoteEdit({ id: r.c.id, text: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setNoteEdit(null);
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  saveNote();
                }
              }}
              onBlur={saveNote}
              className={`${erp.inputFull} h-auto py-1 text-[12px] resize-none`}
            />
          ) : (
            <div
              onDoubleClick={() => canEdit && setNoteEdit({ id: r.c.id, text: r.c.note })}
              title={canEdit ? 'Nháy đúp để sửa' : undefined}
              className={`whitespace-pre-wrap min-h-[18px] ${canEdit ? 'cursor-text' : ''}`}
            >
              {r.c.note || <Dash />}
            </div>
          ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canEdit, noteEdit, onOpen, onOpenRequest],
  );

  function saveNote() {
    if (!noteEdit) return;
    const c = candidates.find((x) => x.id === noteEdit.id);
    if (c && c.note !== noteEdit.text) {
      updateNote(noteEdit.id, noteEdit.text);
      toast('Đã lưu ghi chú');
    }
    setNoteEdit(null);
  }

  const visibleCols = columns.filter((c) => !hidden.has(c.key));

  // Từ khoá + lọc cột (KPI tính trên tập này — không bị ảnh hưởng bởi lát cắt KPI đang bật)
  const base = useMemo(() => {
    const k = norm(kw);
    return rows.filter((r) => {
      if (k) {
        const hay = [
          r.c.fullName, r.c.email, r.c.phone, r.c.currentCompany, r.c.techStack, r.c.taInput,
          ...r.apps.flatMap((a) => {
            const rq = request(a.requestId);
            return rq ? [rq.position, ...rq.taPics] : [];
          }),
        ];
        if (!hay.some((h) => norm(h || '').includes(k))) return false;
      }
      return (Object.entries(colFilter) as [string, string][]).every(([key, v]) => {
        if (!v.trim()) return true;
        const col = columns.find((c) => c.key === key);
        return !col || norm(col.text(r, 0)).includes(norm(v));
      });
    });
  }, [rows, kw, colFilter, columns, request]);

  const counts = {
    total: base.length,
    assigned: base.filter((r) => r.apps.length > 0).length,
    unassigned: base.filter((r) => r.apps.length === 0).length,
    offering: base.filter((r) => r.apps.some((a) => a.stage === 'Offering')).length,
  };

  const filtered = useMemo(() => {
    const list = base.filter((r) =>
      kpi === 'assigned' ? r.apps.length > 0 : kpi === 'unassigned' ? r.apps.length === 0 : kpi === 'offering' ? r.apps.some((a) => a.stage === 'Offering') : true,
    );
    const col = columns.find((c) => c.key === sort.key);
    return col ? [...list].sort((a, b) => col.text(a, 0).localeCompare(col.text(b, 0), 'vi') * sort.dir) : list;
  }, [base, kpi, sort, columns]);

  useEffect(() => setPage(1), [kw, kpi, colFilter, size]);
  const pageRows = filtered.slice((page - 1) * size, page * size);
  const hasColFilter = (Object.values(colFilter) as string[]).some((v) => v.trim());

  const exportXlsx = () => {
    const src = selected.size ? filtered.filter((r) => selected.has(r.c.id)) : filtered;
    const cols = visibleCols.filter((c) => c.key !== 'stt');
    const aoa = [cols.map((c) => c.caption), ...src.map((r, i) => cols.map((c) => c.text(r, i)))];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh sach ung vien');
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, '0');
    XLSX.writeFile(wb, `DanhSach-UngVien-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}.xlsx`);
    toast(`Đã xuất ${src.length} dòng`);
  };

  const pageIds = pageRows.map((r) => r.c.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  const kpis: { key: KpiKey; label: string; value: number; tone: 'neutral' | 'good' | 'bad' }[] = [
    { key: '', label: 'Tổng ứng viên', value: counts.total, tone: 'good' },
    { key: 'assigned', label: 'Đã gán yêu cầu', value: counts.assigned, tone: 'neutral' },
    { key: 'unassigned', label: 'Chưa gán', value: counts.unassigned, tone: 'bad' },
    { key: 'offering', label: 'Đang offer', value: counts.offering, tone: 'bad' },
  ];

  return (
    <>
      <ErpTitleBar
        crumbs={['Trang chủ', 'Tuyển dụng', 'Quản lý ứng viên']}
        title="Quản lý ứng viên"
        actions={
          <>
            <PermSelect perm={perm} onChange={onPerm} />
            {perm === 'full' && (
              <Btn variant="primary" icon={Plus} onClick={onCreate}>
                Thêm ứng viên
              </Btn>
            )}
          </>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} title={kpi === k.key && k.key ? KPI_TIPS[''] : KPI_TIPS[k.key]}>
            <KpiBox
              label={k.label}
              value={k.value}
              valueText={String(k.value)}
              tone={k.tone}
              onClick={() => setKpi(k.key === '' || kpi === k.key ? '' : k.key)}
              active={k.key === '' ? kpi === '' : kpi === k.key}
            />
          </div>
        ))}
      </div>

      <Panel
        title="Danh sách ứng viên"
        icon={Users}
        noPad
        actions={
          <>
            {(kw || kpi) && (
              <button type="button" onClick={() => { setKw(''); setKpi(''); }} className="inline-flex items-center gap-1 h-6 px-2 rounded-[3px] border border-[#b9d3f0] bg-[#eaf2fc] text-[11.5px] font-semibold text-[#1f5fa8] cursor-pointer">
                Đang lọc <X size={11} />
              </button>
            )}
            {hasColFilter && (
              <button type="button" onClick={() => setColFilter({})} className="inline-flex items-center gap-1 h-6 px-2 rounded-[3px] border border-amber-300 bg-amber-50 text-[11.5px] font-semibold text-amber-700 cursor-pointer">
                Đang lọc theo cột <X size={11} />
              </button>
            )}
          </>
        }
      >
        <GridToolbar
          left={
            <>
              {perm === 'full' && (
                <Btn className="h-7" icon={FileSpreadsheet} onClick={exportXlsx} title="Xuất file theo bộ lọc hiện tại">
                  {selected.size ? `Xuất ${selected.size} dòng đã chọn` : 'Xuất dữ liệu (XLSX)'}
                </Btn>
              )}
              {perm === 'full' && (
                <Btn className="h-7" icon={FileUp} onClick={() => setImportOpen(true)}>
                  Nhập
                </Btn>
              )}
            </>
          }
          right={
            <>
              <SearchBox value={kw} onSearch={setKw} placeholder="Tên, email, SĐT, công ty, tech stack, vị trí, TA..." width="w-80" />
              <span className="relative">
                <Btn className="h-7" icon={Columns3} onClick={() => setChooser((v) => !v)}>
                  Chọn cột
                </Btn>
                {chooser && (
                  <div className="absolute right-0 top-8 z-30 w-56 max-h-80 overflow-y-auto bg-white border border-slate-300 rounded-[4px] shadow-lg p-2 text-[12px]">
                    {columns.map((c) => (
                      <label key={c.key} className="flex items-center gap-2 px-1 py-0.5 hover:bg-slate-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!hidden.has(c.key)}
                          onChange={() =>
                            setHidden((h) => {
                              const n = new Set(h);
                              n.has(c.key) ? n.delete(c.key) : n.add(c.key);
                              return n;
                            })
                          }
                        />
                        {c.caption}
                      </label>
                    ))}
                  </div>
                )}
              </span>
              <Btn className="h-7" icon={Filter} disabled={!hasColFilter} onClick={() => setColFilter({})}>
                Xóa lọc cột
              </Btn>
            </>
          }
        />

        <div className="overflow-x-auto">
          <table className={`${erp.table} table-fixed`} style={{ minWidth: visibleCols.reduce((s, c) => s + (c.width || 120), 40 + 80) }}>
            <thead>
              <tr>
                <th className={`${erp.th} w-[40px] sticky left-0 z-10`}>
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={() =>
                      setSelected((s) => {
                        const n = new Set(s);
                        allPageSelected ? pageIds.forEach((id) => n.delete(id)) : pageIds.forEach((id) => n.add(id));
                        return n;
                      })
                    }
                  />
                </th>
                {visibleCols.map((c) => (
                  <th
                    key={c.key}
                    style={{ width: c.width }}
                    onClick={() => !c.noSort && setSort((s) => ({ key: c.key, dir: s.key === c.key ? (s.dir === 1 ? -1 : 1) : 1 }))}
                    className={`${erp.th} text-left ${c.noSort ? '' : 'cursor-pointer select-none hover:bg-[#dde5f0]'}`}
                  >
                    {c.caption}
                    {sort.key === c.key && <span className="ml-1 text-[10px]">{sort.dir === 1 ? '▲' : '▼'}</span>}
                  </th>
                ))}
                <th className={`${erp.th} w-[80px] text-center sticky right-0 z-10`}>Thao tác</th>
              </tr>
              <tr>
                <th className="border border-slate-200 bg-white sticky left-0 z-10" />
                {visibleCols.map((c) => (
                  <th key={c.key} className="border border-slate-200 bg-white p-0.5">
                    {!c.noFilter && (
                      <input
                        value={colFilter[c.key] || ''}
                        onChange={(e) => setColFilter((f) => ({ ...f, [c.key]: e.target.value }))}
                        placeholder="Lọc…"
                        className="w-full h-6 px-1.5 border border-slate-200 rounded-[2px] text-[11.5px] font-normal outline-none focus:border-[#1f5fa8]"
                      />
                    )}
                  </th>
                ))}
                <th className="border border-slate-200 bg-white sticky right-0 z-10" />
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={visibleCols.length + 2} className={`${erp.td} text-center text-slate-500 py-8`}>
                    Không tìm thấy ứng viên nào phù hợp{' '}
                    {(kw || kpi || hasColFilter) && (
                      <Btn className="h-7 ml-2" onClick={() => { setKw(''); setKpi(''); setColFilter({}); }}>
                        Xóa bộ lọc
                      </Btn>
                    )}
                  </td>
                </tr>
              )}
              {pageRows.map((r, i) => (
                <tr key={r.c.id} className={erp.tr}>
                  <td className={`${erp.td} text-center sticky left-0 bg-white`}>
                    <input
                      type="checkbox"
                      checked={selected.has(r.c.id)}
                      onChange={() =>
                        setSelected((s) => {
                          const n = new Set(s);
                          n.has(r.c.id) ? n.delete(r.c.id) : n.add(r.c.id);
                          return n;
                        })
                      }
                    />
                  </td>
                  {visibleCols.map((c) => (
                    <td key={c.key} className={`${erp.td} ${c.align === 'center' ? 'text-center' : c.align === 'right' ? 'text-right' : ''} ${c.key === 'note' ? '' : 'truncate'}`}>
                      {c.render ? c.render(r, (page - 1) * size + i) : c.text(r, (page - 1) * size + i) || <Dash />}
                    </td>
                  ))}
                  <td className={`${erp.td} text-center sticky right-0 bg-white whitespace-nowrap`}>
                    <button type="button" title="Xem" onClick={() => onOpen(r.c.id)} className="p-1 rounded-[3px] text-slate-500 hover:text-[#1f5fa8] hover:bg-slate-100 cursor-pointer">
                      <Eye size={15} />
                    </button>
                    <button type="button" title="Gửi mail" onClick={() => onMail(r.c.id)} className="p-1 rounded-[3px] text-slate-500 hover:text-[#1f5fa8] hover:bg-slate-100 cursor-pointer">
                      <Mail size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager total={filtered.length} page={page} size={size} onPage={setPage} onSize={setSize} />
      </Panel>

      <RcImportModal open={importOpen} onClose={() => setImportOpen(false)} onDone={toast} />
    </>
  );
};

const ReqLink: React.FC<{ req?: RcRequest; onOpen: (id: string) => void }> = ({ req, onOpen }) =>
  req ? (
    <button type="button" onClick={() => onOpen(req.id)} className={`${erp.code} hover:underline cursor-pointer`}>
      {req.code}
    </button>
  ) : (
    <Dash />
  );
