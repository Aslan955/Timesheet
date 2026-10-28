/**
 * Yêu cầu tuyển dụng (/recruitment/request) — bám code iMIS:
 * RecruitmentRequestComponent.razor (lưới + KPI 11 ô), RecruitmentRequestDetailComponent.razor (form trái + Ứng viên đã gán phải),
 * RecruitmentRequestKpi / RecruitmentSla / RecruitmentRequestValidator. Giao diện theo khung ERP module Tài chính.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { ArrowUpDown, Briefcase, Check, Columns3, Eye, FileSpreadsheet, Filter, Pencil, Plus, ShieldCheck, Trash2, UserPlus, Users, X } from 'lucide-react';
import { ErpPage, ErpTitleBar, Panel, Btn, erp } from '../erp/Erp';
import { useToast } from '../../marcom/MarcomUi';
import { useRc, RequestStats } from '../../recruitment/rc/RcContext';
import {
  RcRequest, RequestStatus, Sla, REQUEST_STATUSES, ENDING_STATUSES, FILL_RATE_STATUSES, FORM_PRIORITIES, TA_OPTIONS, BLOCKS, CatalogType,
  emptyRequest, validateRequest, daysRunning, slaOf, diffDays, todayIso, dmy, money, norm,
} from '../../recruitment/rc/rcData';
import { StatusBadge, PriorityBadge, SlaBadge, StageBadge, HrBadge, GridToolbar, SearchBox, Pager, useConfirm, FormField, Dash } from './rcUi';

type Perm = 'Manage' | 'Read';
type View = { mode: 'list' } | { mode: 'detail'; id: string | null; edit: boolean };

const PermSelect: React.FC<{ perm: Perm; onChange: (p: Perm) => void }> = ({ perm, onChange }) => (
  <label className="flex items-center gap-1.5 text-[12px] text-slate-600 border border-slate-300 rounded-[3px] bg-slate-50 pl-2" title="Demo quyền Recruitment.Request.*">
    <ShieldCheck size={13} className="text-slate-500" /> Quyền
    <select value={perm} onChange={(e) => onChange(e.target.value as Perm)} className="h-8 px-1.5 bg-white border-l border-slate-300 text-[12px] font-semibold text-[#1e3a5f] outline-none cursor-pointer">
      <option value="Manage">Manage (Read + Ghi)</option>
      <option value="Read">Chỉ Read</option>
    </select>
  </label>
);

export const RcRequestPage: React.FC<{ onNavigate?: (menuTitle: string) => void }> = ({ onNavigate }) => {
  const rc = useRc();
  const [perm, setPerm] = useState<Perm>('Manage');
  const [view, setView] = useState<View>({ mode: 'list' });
  const { toast, toastNode } = useToast();
  const { ask, confirmNode } = useConfirm();

  // Mở thẳng bản ghi khi màn khác chuyển sang
  useEffect(() => {
    if (rc.focus?.screen === 'request') {
      const f = rc.focus;
      setView({ mode: 'detail', id: f.mode === 'create' ? null : f.id, edit: f.mode === 'edit' || f.mode === 'create' });
      rc.setFocus(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const del = async (r: RcRequest, after?: () => void) => {
    if (!(await ask(`Xoá yêu cầu tuyển dụng "${r.code}"?`))) return;
    rc.deleteRequest(r.id);
    toast(`Đã xoá yêu cầu ${r.code}`);
    after?.();
  };

  return (
    <ErpPage>
      {view.mode === 'list' ? (
        <RequestList
          perm={perm}
          onPerm={setPerm}
          onCreate={() => setView({ mode: 'detail', id: null, edit: true })}
          onOpen={(id, edit) => setView({ mode: 'detail', id, edit: edit && perm === 'Manage' })}
          onDelete={(r) => del(r)}
          toast={toast}
        />
      ) : (
        <RequestDetail
          key={`${view.id ?? 'new'}`}
          id={view.id}
          startEdit={view.edit}
          perm={perm}
          onPerm={setPerm}
          onBack={() => setView({ mode: 'list' })}
          onOpen={(id) => setView({ mode: 'detail', id, edit: false })}
          onDelete={(r) => del(r, () => setView({ mode: 'list' }))}
          onNavigate={onNavigate}
          toast={toast}
          ask={ask}
        />
      )}
      {toastNode}
      {confirmNode}
    </ErpPage>
  );
};

// ==========================================================================
// DANH SÁCH
// ==========================================================================
interface Row {
  r: RcRequest;
  days: number | null;
  sla: Sla;
  st: RequestStats;
}
type ColKey =
  | 'stt' | 'code' | 'position' | 'priority' | 'status' | 'staffing' | 'sla' | 'days' | 'dateReceived' | 'deadline'
  | 'block' | 'skill' | 'level' | 'taPic' | 'headcount' | 'hired' | 'remaining' | 'wishlist' | 'actions';
interface Col {
  key: ColKey;
  label: string;
  val?: (x: Row) => string | number;
  num?: boolean;
  date?: boolean;
  center?: boolean;
  w?: number;
}
const COLS: Col[] = [
  { key: 'stt', label: 'STT', w: 52 },
  { key: 'code', label: 'Mã yêu cầu', val: (x) => x.r.code, w: 168 },
  { key: 'position', label: 'Vị trí', val: (x) => x.r.position, w: 170 },
  { key: 'priority', label: 'Mức ưu tiên', val: (x) => x.r.priority },
  { key: 'status', label: 'Tình trạng', val: (x) => x.r.status, w: 150 },
  { key: 'staffing', label: 'Staffing', val: (x) => (x.r.isStaffing ? 'Có' : ''), center: true },
  { key: 'sla', label: 'SLA', val: (x) => x.sla },
  { key: 'days', label: 'Ngày chạy', val: (x) => x.days ?? '', num: true },
  { key: 'dateReceived', label: 'Ngày nhận', val: (x) => x.r.dateReceived, date: true, center: true },
  { key: 'deadline', label: 'Deadline', val: (x) => x.r.deadline, date: true },
  { key: 'block', label: 'Khối', val: (x) => x.r.block },
  { key: 'skill', label: 'Skill', val: (x) => x.r.skill },
  { key: 'level', label: 'Level', val: (x) => x.r.level },
  { key: 'taPic', label: 'TA PIC', val: (x) => x.r.taPics.join(', ') },
  { key: 'headcount', label: 'SL cần', val: (x) => x.r.headcount, num: true },
  { key: 'hired', label: 'SL tuyển được', val: (x) => x.st.hired, num: true },
  { key: 'remaining', label: 'SL còn lại', val: (x) => x.st.remaining ?? '', num: true },
  { key: 'wishlist', label: 'SL Wishlist', val: (x) => x.st.wishlist, num: true },
  { key: 'actions', label: 'Thao tác', w: 96 },
];
const cellText = (c: Col, x: Row) => {
  const v = c.val ? c.val(x) : '';
  return c.date ? dmy(String(v)) : String(v);
};

// ---- KPI (RecruitmentRequestKpi) ----
const SENIOR_WORDS = ['senior', 'lead', 'manager', 'director'];
const words = (s: string) => norm(s).split(/[^a-z0-9]+/).filter(Boolean);
const isSeniorPlus = (r: RcRequest) => words(r.level).some((w) => SENIOR_WORDS.includes(w)) || words(r.skill).includes('pm');
const isRecruiting = (r: RcRequest) => r.status === 'Đang tuyển';
const isOverdue = (r: RcRequest, asOf: string) => isRecruiting(r) && !!r.deadline && asOf > r.deadline;
const isAtRisk = (r: RcRequest, asOf: string) => {
  if (!isRecruiting(r) || !r.dateReceived || !r.deadline || isOverdue(r, asOf)) return false;
  const elapsed = diffDays(r.dateReceived, asOf);
  const total = diffDays(r.dateReceived, r.deadline);
  return elapsed >= 0 && elapsed * 3 >= total * 2;
};
const pct = (n: number, d: number) => (d <= 0 ? '—' : `${((n / d) * 100).toFixed(1).replace('.', ',')}%`);

type KTone = 'plain' | 'rate' | 'blue' | 'amber' | 'red';
const KTONE: Record<KTone, string> = { plain: 'border-t-slate-400', rate: 'border-t-violet-500', blue: 'border-t-[#1f5fa8]', amber: 'border-t-amber-500', red: 'border-t-rose-600' };
const Kpi: React.FC<{ label: string; value: React.ReactNode; tone: KTone; tip: string; sub?: string }> = ({ label, value, tone, tip, sub }) => (
  <div title={tip} className={`flex flex-col bg-white border border-slate-300 border-t-[3px] ${KTONE[tone]} rounded-[4px] min-w-0 cursor-help`}>
    <p className="px-3 pt-2 h-[34px] text-[11px] font-semibold uppercase tracking-wide text-slate-500 leading-[14px] line-clamp-2">{label}</p>
    <p className="px-3 h-[30px] flex items-center text-[20px] font-bold text-slate-900 tabular-nums whitespace-nowrap">{value}</p>
    <div className="mt-auto px-3 py-1 border-t border-slate-100 bg-slate-50/70 text-[11px] text-slate-500 tabular-nums truncate min-h-[24px]">{sub || ' '}</div>
  </div>
);

const RequestList: React.FC<{
  perm: Perm;
  onPerm: (p: Perm) => void;
  onCreate: () => void;
  onOpen: (id: string, edit: boolean) => void;
  onDelete: (r: RcRequest) => void;
  toast: (m: string) => void;
}> = ({ perm, onPerm, onCreate, onOpen, onDelete, toast }) => {
  const rc = useRc();
  const asOf = todayIso();
  const [keyword, setKeyword] = useState('');
  const [colFilter, setColFilter] = useState<Partial<Record<ColKey, string>>>({});
  const [sort, setSort] = useState<{ key: ColKey; dir: 1 | -1 }>({ key: 'code', dir: -1 });
  const [hidden, setHidden] = useState<Set<ColKey>>(new Set());
  const [chooser, setChooser] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const all: Row[] = useMemo(
    () => rc.requests.map((r) => {
      const days = daysRunning(r, asOf);
      return { r, days, sla: slaOf(days), st: rc.stats(r.id) };
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rc.requests, rc.applications, rc.candidates],
  );

  const hasColFilter = (Object.values(colFilter) as (string | undefined)[]).some((v) => !!v && v.trim() !== '');
  const rows = useMemo(() => {
    const kw = norm(keyword);
    let out = all.filter((x) => !kw || [x.r.code, x.r.position, x.r.level, x.r.block, x.r.skill].some((s) => norm(s).includes(kw)));
    COLS.forEach((c) => {
      const f = colFilter[c.key];
      if (f && f.trim()) out = out.filter((x) => norm(cellText(c, x)).includes(norm(f)));
    });
    const sc = COLS.find((c) => c.key === sort.key);
    if (sc?.val) {
      out = [...out].sort((a, b) => {
        const va = sc.val!(a);
        const vb = sc.val!(b);
        if (va === '' && vb !== '') return 1;
        if (vb === '' && va !== '') return -1;
        const cmp = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'vi', { numeric: true });
        return cmp * sort.dir;
      });
    }
    return out;
  }, [all, keyword, colFilter, sort]);

  useEffect(() => setPage(1), [keyword, colFilter, size]);
  const pageRows = rows.slice((page - 1) * size, page * size);
  const cols = COLS.filter((c) => !hidden.has(c.key));

  // KPI tính trên các dòng đang hiển thị sau lọc
  const k = useMemo(() => {
    const sum = (list: Row[], f: (x: Row) => number) => list.reduce((s, x) => s + f(x), 0);
    const rem = (x: Row) => x.st.remaining ?? 0;
    const rec = rows.filter((x) => isRecruiting(x.r));
    const hired = sum(rows, (x) => x.st.hired);
    const seniorHired = sum(rows.filter((x) => isSeniorPlus(x.r)), (x) => x.st.hired);
    const remaining = sum(rec, rem);
    const seniorRemaining = sum(rec.filter((x) => isSeniorPlus(x.r)), rem);
    const atRisk = sum(rec.filter((x) => isAtRisk(x.r, asOf)), rem);
    const overdueRows = rec.filter((x) => isOverdue(x.r, asOf));
    const onb = sum(rows, (x) => x.st.onboarded);
    const official = sum(rows, (x) => x.st.official);
    const fillRows = rows.filter((x) => FILL_RATE_STATUSES.includes(x.r.status as RequestStatus));
    const fillHired = sum(fillRows, (x) => x.st.hired);
    const fillCand = sum(fillRows, (x) => x.st.candidateCount);
    return {
      hired, seniorHired, remaining, seniorRemaining, atRisk, overdue: sum(overdueRows, rem), onb, official, fillHired, fillCand,
      total: rows.length, active: rec.length, overdueReq: overdueRows.length,
    };
  }, [rows, asOf]);

  const exportXlsx = () => {
    const ex = cols.filter((c) => c.key !== 'actions');
    const header = ex.map((c) => c.label);
    const data = rows.map((x, i) => ex.map((c) => (c.key === 'stt' ? i + 1 : c.key === 'staffing' ? (x.r.isStaffing ? '✓' : '') : cellText(c, x))));
    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Yeu cau tuyen dung');
    XLSX.writeFile(wb, `YeuCauTuyenDung-${todayIso().replace(/-/g, '')}.xlsx`);
    toast(`Đã xuất ${rows.length} dòng`);
  };

  const renderCell = (c: Col, x: Row, idx: number) => {
    const r = x.r;
    switch (c.key) {
      case 'stt':
        return <span className="text-slate-400">{idx + 1}</span>;
      case 'code':
        return (
          <button type="button" onClick={() => onOpen(r.id, false)} className={`${erp.code} underline cursor-pointer whitespace-nowrap`}>
            {r.code}
          </button>
        );
      case 'priority':
        return <PriorityBadge priority={r.priority} />;
      case 'status':
        return <StatusBadge status={r.status} />;
      case 'staffing':
        return r.isStaffing ? <Check size={14} className="text-emerald-600 inline" /> : null;
      case 'sla':
        return <SlaBadge sla={x.sla} />;
      case 'days':
        return x.days == null ? <Dash /> : x.days;
      case 'dateReceived':
      case 'deadline':
        return cellText(c, x) || <Dash />;
      case 'remaining':
        return x.st.remaining == null ? <Dash /> : <span className={x.st.remaining < 0 ? 'text-rose-600 font-semibold' : ''}>{x.st.remaining}</span>;
      case 'taPic':
        return r.taPics.join(', ') || <Dash />;
      case 'actions':
        return (
          <span className="inline-flex items-center gap-0.5">
            <IconBtn title="Xem" onClick={() => onOpen(r.id, false)} icon={Eye} />
            {perm === 'Manage' && <IconBtn title="Sửa" onClick={() => onOpen(r.id, true)} icon={Pencil} />}
            {perm === 'Manage' && <IconBtn title="Xoá" danger onClick={() => onDelete(r)} icon={Trash2} />}
          </span>
        );
      default: {
        const t = cellText(c, x);
        return t === '' ? <Dash /> : t;
      }
    }
  };

  const stickyCls = (c: Col) =>
    c.key === 'stt' ? 'sticky left-0 z-[2]' : c.key === 'code' ? 'sticky left-[52px] z-[2]' : c.key === 'position' ? 'sticky left-[220px] z-[2] shadow-[1px_0_0_#cbd5e1]' : c.key === 'actions' ? 'sticky right-0 z-[2] shadow-[-1px_0_0_#cbd5e1]' : '';
  const sticky = (c: Col) => (hidden.has('stt') || hidden.has('code') ? (c.key === 'actions' ? stickyCls(c) : '') : stickyCls(c));

  return (
    <>
      <ErpTitleBar
        crumbs={['Trang chủ', 'Tuyển dụng', 'Yêu cầu tuyển dụng']}
        title="Yêu cầu tuyển dụng"
        actions={
          <>
            <PermSelect perm={perm} onChange={onPerm} />
            {perm === 'Manage' && (
              <Btn variant="primary" icon={Plus} onClick={onCreate}>
                Thêm yêu cầu
              </Btn>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 2xl:grid-cols-[8fr_3fr] gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">Số lượng tuyển (Headcount)</p>
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-2">
            <Kpi label="Đã tuyển" value={k.hired} tone="plain" tip="Σ SL tuyển được (Offer Accepted + Onboarded) của mọi dòng đang hiển thị" />
            <Kpi label="% Senior+ đã tuyển" value={pct(k.seniorHired, k.hired)} tone="rate" sub={`${k.seniorHired}/${k.hired}`} tip="Σ Hired của dòng Senior+ (Level có senior/lead/manager/director hoặc Skill có pm) ÷ Đã tuyển" />
            <Kpi label="Còn lại" value={k.remaining} tone="blue" tip="Σ (SL cần − SL tuyển được) của dòng Đang tuyển — cộng cả số âm" />
            <Kpi label="% Senior+ đang tuyển" value={pct(k.seniorRemaining, k.remaining)} tone="rate" sub={`${k.seniorRemaining}/${k.remaining}`} tip="Còn lại của dòng Senior+ ÷ Còn lại" />
            <Kpi label="Rủi ro" value={k.atRisk} tone="amber" tip="Σ Còn lại của dòng Đang tuyển, chưa quá hạn, đã chạy ≥ 2/3 khoảng Ngày nhận → Deadline" />
            <Kpi label="Quá hạn" value={k.overdue} tone="red" tip="Σ Còn lại của dòng Đang tuyển có hôm nay > Deadline" />
            <Kpi label="Tỷ lệ pass thử việc" value={pct(k.official, k.onb)} tone="rate" sub={`${k.official}/${k.onb}`} tip="Số lượt Onboarded có ứng viên đã chính thức (HCNS) ÷ số lượt Onboarded" />
            <Kpi label="Tỷ lệ hoàn thành" value={pct(k.fillHired, k.fillCand)} tone="rate" sub={`${k.fillHired}/${k.fillCand}`} tip="Σ Hired ÷ Σ số ứng viên đã gán, chỉ dòng Đang tuyển / Chờ nhận việc / Hoàn thành" />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">Request</p>
          <div className="grid grid-cols-3 gap-2">
            <Kpi label="Total Requests" value={k.total} tone="plain" tip="Số yêu cầu đang hiển thị" />
            <Kpi label="Active Requests" value={k.active} tone="blue" tip="Số yêu cầu Đang tuyển" />
            <Kpi label="Overdue Requests" value={k.overdueReq} tone="red" tip="Số yêu cầu Đang tuyển đã quá Deadline" />
          </div>
        </div>
      </div>

      <Panel
        title="Danh sách yêu cầu tuyển dụng"
        icon={Briefcase}
        noPad
        actions={
          <>
            {keyword && <FilterChip label="Đang lọc" onClear={() => setKeyword('')} />}
            {hasColFilter && <FilterChip label="Đang lọc theo cột" onClear={() => setColFilter({})} />}
          </>
        }
      >
        <GridToolbar
          left={
            <Btn icon={FileSpreadsheet} className="h-7" onClick={exportXlsx}>
              Xuất dữ liệu (XLSX)
            </Btn>
          }
          right={
            <>
              <SearchBox value={keyword} onSearch={setKeyword} placeholder="Mã, vị trí, khối, skill, level, TA..." />
              <span className="relative">
                <Btn icon={Columns3} className="h-7" onClick={() => setChooser((v) => !v)}>
                  Chọn cột
                </Btn>
                {chooser && (
                  <div className="absolute right-0 top-8 z-30 w-56 max-h-80 overflow-y-auto bg-white border border-slate-300 rounded-[4px] shadow-lg p-2 text-[12px]">
                    {COLS.filter((c) => c.key !== 'actions').map((c) => (
                      <label key={c.key} className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-slate-50 cursor-pointer">
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
                        {c.label}
                      </label>
                    ))}
                  </div>
                )}
              </span>
              <Btn icon={Filter} className="h-7" disabled={!hasColFilter} onClick={() => setColFilter({})}>
                Xóa lọc cột
              </Btn>
            </>
          }
        />
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                {cols.map((c) => (
                  <th
                    key={c.key}
                    style={c.w ? { minWidth: c.w, width: c.w } : undefined}
                    className={`${erp.th} ${sticky(c)} ${c.num ? 'text-right' : 'text-left'} ${c.val ? 'cursor-pointer select-none hover:bg-[#dde5f0]' : ''}`}
                    onClick={() => c.val && setSort((s) => ({ key: c.key, dir: s.key === c.key ? (s.dir === 1 ? -1 : 1) : 1 }))}
                  >
                    <span className="inline-flex items-center gap-1">
                      {c.label}
                      {c.val && (sort.key === c.key ? <span className="text-[#1f5fa8]">{sort.dir === 1 ? '▲' : '▼'}</span> : <ArrowUpDown size={10} className="text-slate-400" />)}
                    </span>
                  </th>
                ))}
              </tr>
              <tr>
                {cols.map((c) => (
                  <th key={c.key} className={`bg-[#f3f6fa] border border-slate-300 px-1 py-1 ${sticky(c)}`}>
                    {c.val ? (
                      <input
                        value={colFilter[c.key] || ''}
                        onChange={(e) => setColFilter((f) => ({ ...f, [c.key]: e.target.value }))}
                        className="w-full min-w-[56px] h-6 px-1.5 border border-slate-300 rounded-[3px] text-[11.5px] font-normal bg-white outline-none focus:border-[#1f5fa8]"
                      />
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={cols.length} className={`${erp.td} text-center text-slate-500 py-8`}>
                    {rc.requests.length === 0 ? (
                      'Chưa có yêu cầu tuyển dụng nào.'
                    ) : (
                      <span className="inline-flex items-center gap-3">
                        Không tìm thấy yêu cầu phù hợp.
                        <Btn className="h-7" onClick={() => { setKeyword(''); setColFilter({}); }}>
                          Xóa bộ lọc
                        </Btn>
                      </span>
                    )}
                  </td>
                </tr>
              )}
              {pageRows.map((x, i) => (
                <tr key={x.r.id} className="group hover:bg-[#eaf2fc]">
                  {cols.map((c) => (
                    <td
                      key={c.key}
                      className={`${erp.td} ${sticky(c)} ${sticky(c) ? 'bg-white group-hover:bg-[#eaf2fc]' : ''} ${c.num ? erp.num : ''} ${c.center ? 'text-center' : ''} ${c.key === 'actions' ? 'whitespace-nowrap' : ''}`}
                    >
                      {renderCell(c, x, i)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50">
                  {cols.map((c) => (
                    <td key={c.key} className={`${erp.td} text-[11.5px] text-slate-500 ${sticky(c)} ${sticky(c) ? 'bg-slate-50' : ''}`}>
                      {c.key === 'code' ? `Count = ${rows.length}` : ''}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <Pager total={rows.length} page={page} size={size} onPage={setPage} onSize={setSize} />
      </Panel>
    </>
  );
};

const FilterChip: React.FC<{ label: string; onClear: () => void }> = ({ label, onClear }) => (
  <button type="button" onClick={onClear} className="inline-flex items-center gap-1 h-6 px-2 rounded-full border border-[#b9d3f0] bg-[#eaf2fc] text-[11.5px] font-semibold text-[#1f5fa8] cursor-pointer hover:bg-[#dbe9fa]">
    {label} <X size={11} />
  </button>
);

const IconBtn: React.FC<{ title: string; icon: React.ElementType; onClick: () => void; danger?: boolean }> = ({ title, icon: Icon, onClick, danger }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`inline-flex items-center justify-center w-7 h-7 rounded-[3px] border border-transparent cursor-pointer hover:border-slate-300 hover:bg-white ${danger ? 'text-rose-500 hover:text-rose-700' : 'text-slate-500 hover:text-[#1f5fa8]'}`}
  >
    <Icon size={14} />
  </button>
);

// ==========================================================================
// CHI TIẾT / TẠO / SỬA
// ==========================================================================
const MAX_TA = 2;
const PICKER_LIMIT = 50;

const RequestDetail: React.FC<{
  id: string | null;
  startEdit: boolean;
  perm: Perm;
  onPerm: (p: Perm) => void;
  onBack: () => void;
  onOpen: (id: string) => void;
  onDelete: (r: RcRequest) => void;
  onNavigate?: (menuTitle: string) => void;
  toast: (m: string) => void;
  ask: (text: string) => Promise<boolean>;
}> = ({ id, startEdit, perm, onPerm, onBack, onOpen, onDelete, onNavigate, toast, ask }) => {
  const rc = useRc();
  const saved = id ? rc.request(id) : undefined;
  const isCreate = id === null;
  const [editing, setEditing] = useState(isCreate || (startEdit && perm === 'Manage'));
  const [draft, setDraft] = useState<RcRequest>(() => (saved ? { ...saved } : emptyRequest()));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Quyền Read: thoát chế độ sửa
  useEffect(() => {
    if (perm === 'Read' && editing && !isCreate) setEditing(false);
  }, [perm, editing, isCreate]);
  // Đang xem: đồng bộ theo bản đã lưu
  useEffect(() => {
    if (!editing && saved) setDraft({ ...saved });
  }, [saved, editing]);

  if (!isCreate && !saved)
    return (
      <>
        <ErpTitleBar onBack={onBack} backLabel="Quay lại danh sách" crumbs={['Trang chủ', 'Tuyển dụng', 'Yêu cầu tuyển dụng']} />
        <Panel title="Yêu cầu tuyển dụng">
          <p className="text-[13px] text-slate-500 py-4 text-center">Không tìm thấy yêu cầu tuyển dụng</p>
        </Panel>
      </>
    );

  const set = <K extends keyof RcRequest>(k: K, v: RcRequest[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setErrors((e) => {
      if (!e[k as string]) return e;
      const n = { ...e };
      delete n[k as string];
      return n;
    });
  };

  const toggleStaffing = (on: boolean) =>
    setDraft((d) => (on ? { ...d, isStaffing: true } : { ...d, isStaffing: false, salary: '', workLocation: '', contractType: '', contractDuration: '', jobDescription: '', equipment: '' }));

  const addTa = (ta: string) => {
    if (!ta) return;
    if (draft.taPics.length >= MAX_TA) {
      toast(`Chỉ chọn tối đa ${MAX_TA} TA PIC.`);
      return;
    }
    set('taPics', [...draft.taPics, ta]);
  };

  const save = () => {
    const e = validateRequest(draft);
    if (new Set(draft.taPics).size !== draft.taPics.length) e.taPics = 'Hai TA PIC không được trùng nhau';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    const out = rc.saveRequest(draft);
    setSaving(false);
    toast(isCreate ? `Đã thêm yêu cầu ${out.code}` : 'Đã lưu thay đổi');
    if (isCreate) onOpen(out.id);
    else setEditing(false);
  };

  const cancel = () => {
    if (isCreate) return onBack();
    setDraft(saved ? { ...saved } : emptyRequest());
    setErrors({});
    setEditing(false);
  };

  const ending = !!draft.status && ENDING_STATUSES.includes(draft.status as RequestStatus);
  const days = daysRunning(draft);
  const sla = slaOf(days);
  const err = (k: string) => (editing ? errors[k] : undefined);
  const inv = (k: string) => (err(k) ? '!border-rose-400 bg-rose-50/40' : '');

  // Ô chọn danh mục: giữ giá trị cũ đã tắt (hậu tố "(ngưng dùng)")
  const catSelect = (k: 'position' | 'skill' | 'level', type: CatalogType, ph: string) => (
    <select value={draft[k]} onChange={(e) => set(k, e.target.value)} className={`${erp.inputFull} cursor-pointer ${inv(k)}`}>
      <option value="">{ph}</option>
      {rc.options(type, [draft[k]]).map((o) => (
        <option key={o} value={o}>
          {o}
          {rc.isDeactivated(type, o) ? ' (ngưng dùng)' : ''}
        </option>
      ))}
    </select>
  );
  const plainSelect = (k: keyof RcRequest, opts: readonly string[], ph: string, onChange?: (v: string) => void) => {
    const v = String(draft[k] ?? '');
    const list = v && !opts.includes(v) ? [v, ...opts] : opts;
    return (
      <select value={v} onChange={(e) => (onChange ? onChange(e.target.value) : set(k, e.target.value as never))} className={`${erp.inputFull} cursor-pointer ${inv(k)}`}>
        <option value="">{ph}</option>
        {list.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  };
  const text = (v: React.ReactNode) => <div className="min-h-8 flex items-center text-[13px] text-slate-800">{v === '' || v == null ? <Dash /> : v}</div>;

  const title = isCreate ? 'Thêm yêu cầu' : (
    <>
      <span className="font-mono">{saved!.code}</span>
      <StatusBadge status={saved!.status} />
      {saved!.isStaffing && <span className="text-[11px] font-semibold px-1.5 py-px rounded-[3px] border border-emerald-300 bg-emerald-50 text-emerald-700">Staffing</span>}
    </>
  );

  return (
    <>
      <ErpTitleBar
        onBack={onBack}
        backLabel="Quay lại danh sách"
        crumbs={['Trang chủ', 'Tuyển dụng', 'Yêu cầu tuyển dụng', isCreate ? 'Thêm yêu cầu' : saved!.code]}
        title={title}
        actions={
          <>
            <PermSelect perm={perm} onChange={onPerm} />
            {!editing && perm === 'Manage' && saved && (
              <>
                <Btn variant="primary" icon={Pencil} onClick={() => setEditing(true)}>
                  Sửa
                </Btn>
                <Btn variant="danger" icon={Trash2} onClick={() => onDelete(saved)}>
                  Xoá
                </Btn>
              </>
            )}
            {editing && (
              <>
                <Btn onClick={cancel}>Hủy</Btn>
                <Btn variant="primary" icon={Check} onClick={save} disabled={saving}>
                  {saving ? 'Đang lưu...' : isCreate ? 'Thêm' : 'Lưu thay đổi'}
                </Btn>
              </>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-start">
        {/* ============ TRÁI: Thông tin yêu cầu ============ */}
        <Panel title="Thông tin yêu cầu" icon={Briefcase}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3.5">
            <FormField label="Mức ưu tiên" error={err('priority')}>
              {editing ? plainSelect('priority', FORM_PRIORITIES, 'Chọn Priority') : text(<PriorityBadge priority={draft.priority} />)}
            </FormField>
            <FormField label="Tình trạng" required={editing} error={err('status')}>
              {editing ? plainSelect('status', REQUEST_STATUSES, 'Chọn tình trạng') : text(<StatusBadge status={draft.status} />)}
            </FormField>
            <FormField label="Khối" required={editing} error={err('block')}>
              {editing ? plainSelect('block', BLOCKS.map((b) => b.name), 'Chọn khối') : text(draft.block)}
            </FormField>
            <FormField label="Vị trí" required={editing} error={err('position')}>
              {editing ? catSelect('position', 'Position', 'Chọn vị trí') : text(draft.position)}
            </FormField>
            <FormField label="Skill" required={editing} error={err('skill')}>
              {editing ? catSelect('skill', 'Skill', 'Chọn kỹ năng') : text(draft.skill)}
            </FormField>
            <FormField label="Level" required={editing} error={err('level')}>
              {editing ? catSelect('level', 'Level', 'Chọn level') : text(draft.level)}
            </FormField>
            <FormField label="TA PIC" required={editing} error={err('taPics')} hint={editing ? `Tối đa ${MAX_TA} người` : undefined}>
              {editing ? (
                <div className={`min-h-8 flex flex-wrap items-center gap-1 px-1.5 py-1 border border-slate-300 rounded-[3px] bg-white ${inv('taPics')}`}>
                  {draft.taPics.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 h-6 pl-2 pr-1 rounded-[3px] bg-[#eaf2fc] border border-[#b9d3f0] text-[12px] font-semibold text-[#1f5fa8]">
                      {t}
                      <button type="button" title="Bỏ" onClick={() => set('taPics', draft.taPics.filter((x) => x !== t))} className="p-0.5 rounded hover:bg-white cursor-pointer">
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                  <select value="" onChange={(e) => addTa(e.target.value)} className="flex-1 min-w-[110px] h-6 text-[12px] text-slate-500 bg-transparent outline-none cursor-pointer">
                    <option value="">{draft.taPics.length ? '' : 'Chọn TA PIC'}</option>
                    {TA_OPTIONS.filter((t) => !draft.taPics.includes(t)).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                text(draft.taPics.join(', '))
              )}
            </FormField>
            <FormField label="TA Support">{editing ? plainSelect('taSupport', TA_OPTIONS, 'Chọn TA Support') : text(draft.taSupport)}</FormField>
            <FormField label="Ngày nhận" required={editing} error={err('dateReceived')}>
              {editing ? <input type="date" value={draft.dateReceived} onChange={(e) => set('dateReceived', e.target.value)} className={`${erp.inputFull} ${inv('dateReceived')}`} /> : text(dmy(draft.dateReceived))}
            </FormField>
            {ending && (
              <FormField label="Ngày kết thúc" required={editing} error={err('endDate')}>
                {editing ? <input type="date" value={draft.endDate} onChange={(e) => set('endDate', e.target.value)} className={`${erp.inputFull} ${inv('endDate')}`} /> : text(dmy(draft.endDate))}
              </FormField>
            )}
            <FormField label="Deadline">
              {editing ? <input type="date" value={draft.deadline} onChange={(e) => set('deadline', e.target.value)} className={erp.inputFull} /> : text(dmy(draft.deadline))}
            </FormField>
            <FormField label="SL cần" required={editing} error={err('headcount')}>
              {editing ? (
                <input
                  type="number"
                  min={1}
                  placeholder="Nhập số lượng"
                  value={draft.headcount}
                  onChange={(e) => set('headcount', e.target.value === '' ? '' : Number(e.target.value))}
                  className={`${erp.inputFull} text-right tabular-nums ${inv('headcount')}`}
                />
              ) : (
                text(draft.headcount)
              )}
            </FormField>
            <FormField label="Ghi chú" className="md:col-span-2">
              {editing ? (
                <textarea rows={3} value={draft.note} onChange={(e) => set('note', e.target.value)} placeholder="Ghi chú thêm về yêu cầu..." className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
              ) : (
                text(draft.note)
              )}
            </FormField>
            <FormField label="Staffing" className="md:col-span-2">
              <label className={`inline-flex items-center gap-2 h-8 text-[13px] ${editing ? 'cursor-pointer' : ''}`}>
                <input type="checkbox" checked={draft.isStaffing} disabled={!editing} onChange={(e) => toggleStaffing(e.target.checked)} className="w-4 h-4 accent-[#1f5fa8]" />
                Yêu cầu Staffing
              </label>
            </FormField>
          </div>

          {draft.isStaffing && (
            <div className="mt-3 border border-slate-300 rounded-[4px] bg-[#f7f9fc] p-3">
              <p className="text-[12px] font-bold uppercase tracking-wide text-[#1e3a5f] mb-2.5">Thông tin Staffing</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3.5">
                <FormField label="Mức lương" hint={editing ? money(draft.salary) : undefined}>
                  {editing ? (
                    <input type="number" min={0} placeholder="Nhập mức lương" value={draft.salary} onChange={(e) => set('salary', e.target.value === '' ? '' : Number(e.target.value))} className={`${erp.inputFull} text-right tabular-nums`} />
                  ) : (
                    text(money(draft.salary))
                  )}
                </FormField>
                <FormField label="Địa điểm làm việc">{editing ? <input value={draft.workLocation} onChange={(e) => set('workLocation', e.target.value)} className={erp.inputFull} /> : text(draft.workLocation)}</FormField>
                <FormField label="Loại hợp đồng">{editing ? <input value={draft.contractType} onChange={(e) => set('contractType', e.target.value)} className={erp.inputFull} /> : text(draft.contractType)}</FormField>
                <FormField label="Thời hạn hợp đồng">
                  {editing ? <input value={draft.contractDuration} onChange={(e) => set('contractDuration', e.target.value)} placeholder="VD: 12 tháng, không xác định thời hạn" className={erp.inputFull} /> : text(draft.contractDuration)}
                </FormField>
                <FormField label="JD (Link/Text)" className="md:col-span-2">
                  {editing ? (
                    <textarea rows={3} value={draft.jobDescription} onChange={(e) => set('jobDescription', e.target.value)} placeholder="Link hoặc mô tả JD" className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
                  ) : (
                    text(draft.jobDescription)
                  )}
                </FormField>
                <FormField label="Thiết bị yêu cầu" className="md:col-span-2">
                  {editing ? (
                    <input maxLength={500} value={draft.equipment} onChange={(e) => set('equipment', e.target.value)} placeholder="Nhập thiết bị yêu cầu (tối đa 500 ký tự)..." className={erp.inputFull} />
                  ) : (
                    text(draft.equipment)
                  )}
                </FormField>
              </div>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
            <ReadChip label="Mã yêu cầu" value={isCreate ? <span className="italic text-slate-500">(tự sinh khi lưu)</span> : <span className="font-mono text-[#1f5fa8]">{saved!.code}</span>} />
            <ReadChip label="Ngày chạy" value={days == null ? <Dash /> : `${days} ngày`} />
            <ReadChip label="SLA" value={<SlaBadge sla={sla} />} />
          </div>
        </Panel>

        {/* ============ PHẢI: Ứng viên đã gán ============ */}
        <AssignedPanel saved={isCreate ? undefined : saved} draftStatus={draft.status} perm={perm} onNavigate={onNavigate} toast={toast} ask={ask} />
      </div>
    </>
  );
};

const ReadChip: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[3px] border border-slate-300 bg-slate-50">
    <span className="text-slate-500">{label}:</span>
    <span className="font-semibold text-slate-800">{value}</span>
  </span>
);

const AssignedPanel: React.FC<{
  saved?: RcRequest;
  draftStatus: RcRequest['status'];
  perm: Perm;
  onNavigate?: (menuTitle: string) => void;
  toast: (m: string) => void;
  ask: (text: string) => Promise<boolean>;
}> = ({ saved, draftStatus, perm, onNavigate, toast, ask }) => {
  const rc = useRc();
  const [picker, setPicker] = useState(false);
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const timer = useRef<number>();

  useEffect(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDebounced(q), 300);
    return () => window.clearTimeout(timer.current);
  }, [q]);
  // Đổi tình trạng khỏi Đang tuyển khi đang sửa → đóng picker
  useEffect(() => {
    if (draftStatus !== 'Đang tuyển') setPicker(false);
  }, [draftStatus]);

  const apps = saved ? rc.appsOfRequest(saved.id) : [];
  const canAssign = perm === 'Manage' && saved?.status === 'Đang tuyển';
  const assignedIds = new Set(apps.map((a) => a.candidateId));
  const kw = norm(debounced);
  const kwDigits = /^[\d\s.]+$/.test(kw) ? kw.replace(/\D/g, '') : '';
  const matches = rc.candidates
    .filter((c) => !assignedIds.has(c.id))
    .filter((c) => !kw || [c.fullName, c.email, c.code].some((s) => norm(s).includes(kw)) || (!!kwDigits && c.phone.replace(/\D/g, '').includes(kwDigits)))
    .slice(0, PICKER_LIMIT);

  const doAssign = (candidateId: string, name: string) => {
    if (!saved) return;
    const e = rc.assign(candidateId, saved.id);
    toast(e || `Đã gán ${name}`);
  };
  const openCandidate = (id: string) => {
    rc.setFocus({ screen: 'candidate', id });
    onNavigate?.('Quản lý ứng viên');
  };

  return (
    <Panel
      title={`Ứng viên đã gán · ${apps.length}`}
      icon={Users}
      actions={
        canAssign && (
          <Btn className="h-7" variant={picker ? 'default' : 'primary'} icon={picker ? X : UserPlus} onClick={() => setPicker((v) => !v)}>
            {picker ? 'Đóng' : 'Gán ứng viên'}
          </Btn>
        )
      }
    >
      {!saved ? (
        <p className="text-[13px] text-slate-500 py-3">Lưu yêu cầu trước, sau đó mới gán được ứng viên.</p>
      ) : (
        <div className="space-y-2.5">
          <p className="text-[11.5px] text-slate-400 italic">Gán và gỡ ở đây có hiệu lực ngay, không chờ nút Lưu của form bên trái.</p>

          {picker && canAssign && (
            <div className="border border-[#b9d3f0] bg-[#f5f9fe] rounded-[4px] p-2 space-y-1.5">
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && matches[0] && doAssign(matches[0].id, matches[0].fullName)}
                placeholder="Tìm ứng viên theo tên, email..."
                className={erp.inputFull}
              />
              {matches.length >= PICKER_LIMIT && (
                <p className="text-[11.5px] px-2 py-1 rounded-[3px] bg-amber-50 border border-amber-300 text-amber-800">Chỉ hiện {PICKER_LIMIT} ứng viên đầu tiên — gõ thêm để thu hẹp.</p>
              )}
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-200 bg-white border border-slate-200 rounded-[3px]">
                {matches.length === 0 ? (
                  <p className="text-[12px] text-slate-400 text-center py-3">Không có ứng viên phù hợp</p>
                ) : (
                  matches.map((c) => (
                    <button key={c.id} type="button" onClick={() => doAssign(c.id, c.fullName)} className="w-full text-left px-2.5 py-1.5 hover:bg-[#eaf2fc] cursor-pointer">
                      <p className="text-[12.5px] font-semibold text-slate-800">{c.fullName}</p>
                      <p className="text-[11px] text-slate-500">
                        {c.email} · <span className="font-mono">{c.code}</span>
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {apps.length === 0 ? (
            <p className="text-[13px] text-slate-500 text-center py-6 border border-dashed border-slate-300 rounded-[4px]">Chưa có ứng viên nào được gán.</p>
          ) : (
            <ul className="space-y-1.5">
              {apps.map((a) => {
                const c = rc.candidate(a.candidateId);
                if (!c) return null;
                return (
                  <li key={a.id} className="flex items-start gap-2 border border-slate-200 rounded-[4px] px-2.5 py-2 bg-white hover:border-slate-300">
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-baseline gap-1.5">
                        <button type="button" onClick={() => openCandidate(c.id)} className="text-[13px] font-semibold text-[#1f5fa8] hover:underline cursor-pointer">
                          {c.fullName}
                        </button>
                        <button type="button" onClick={() => openCandidate(c.id)} className="font-mono text-[11px] text-slate-400 hover:underline cursor-pointer">
                          {c.code}
                        </button>
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {[c.email, c.phone, dmy(a.appliedDate), `by: ${a.addedBy}`].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <StageBadge stage={a.stage} />
                      {c.hr.status !== 'None' && (
                        <span title="Trạng thái HCNS">
                          <HrBadge status={c.hr.status} />
                        </span>
                      )}
                      {perm === 'Manage' && (
                        <button
                          type="button"
                          title="Bỏ gán"
                          onClick={async () => {
                            if (!(await ask(`Xác nhận gỡ "${c.fullName}" khỏi yêu cầu này?`))) return;
                            rc.unassign(a.id);
                            toast(`Đã bỏ gán ${c.fullName}`);
                          }}
                          className="w-6 h-6 inline-flex items-center justify-center rounded-[3px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </Panel>
  );
};
