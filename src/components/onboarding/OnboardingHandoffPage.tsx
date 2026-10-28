/**
 * HR › Onboarding Request — HCNS tiếp nhận yêu cầu TA gửi từ popup Gửi mail ("Gửi thông tin sang HCNS"):
 * Duyệt (tạo hồ sơ nhân sự, tài khoản, checklist) / Từ chối, checklist onboard, xác nhận nhận việc.
 *
 * Khung ERP của module Tài chính: ErpTitleBar + KPI + Panel/bảng kẻ ô + stepper + FolderTabs + lịch sử.
 */
import React, { useMemo, useState } from 'react';
import {
  AlertCircle, AlertTriangle, CheckCircle2, ClipboardCheck, ClipboardList, FileSpreadsheet, History, Info, Loader2, Mail, Paperclip,
  RotateCcw, Search, UserCheck, Users, XCircle,
} from 'lucide-react';
import { ErpPage, ErpTitleBar, Panel, Btn, erp, Tag, FieldTable, FolderTabs, KpiBox, FormRow } from '../erp/Erp';
import { Modal, TAG, useToast } from '../../marcom/MarcomUi';
import { useOnboarding } from '../../onboarding/OnboardingContext';
import { useRc } from '../../recruitment/rc/RcContext';
import {
  OnbRecord, OnbStatus, ONB_STATUSES, ONB_STATUS_REAL, HandoffData, HANDOFF_LABELS, CONTRACT_TYPES, departmentsOf, HR_POSITIONS, HR_LEVELS, STAFF_NAMES,
  missingForApprove, taskOf, fieldText, money, probationSalary, dmy, dmyhm, daysUntil, isRefer, ChecklistOwner,
} from '../../onboarding/onboardingData';
import { OnbStatusTag, DaysTag, OnbStepper, ChangeList, CatalogSelect } from './onbUi';
import { OnbProgressPanel, ProgressTag, pendingTaskNames } from './OnbProgressPanel';

type KpiKey = '' | OnbStatus | 'soon' | 'closed';
const isClosed = (r: OnbRecord) => r.status === 'Huỷ onboard' || r.status === 'HCNS từ chối';
const isSoon = (r: OnbRecord) => {
  const d = daysUntil(r.data.startDate);
  return (r.status === 'Chờ HCNS duyệt' || r.status === 'Đang onboard') && d != null && d >= 0 && d <= 7;
};

type Decision = '' | 'approve' | 'reject';
type View = { mode: 'list' } | { mode: 'detail'; id: string; open?: Decision };

export const OnboardingHandoffPage: React.FC<{ onNavigate?: (menuTitle: string) => void }> = ({ onNavigate }) => {
  const [view, setView] = useState<View>({ mode: 'list' });
  const { toast, toastNode } = useToast();

  return (
    <ErpPage>
      {view.mode === 'list' ? (
        <ListView onOpen={(id, open) => setView({ mode: 'detail', id, open })} toast={toast} />
      ) : (
        <DetailView key={view.id} id={view.id} initialModal={view.open || ''} onBack={() => setView({ mode: 'list' })} toast={toast} onNavigate={onNavigate} />
      )}
      {toastNode}
    </ErpPage>
  );
};

// ==========================================================================
// DANH SÁCH
// ==========================================================================
const ListView: React.FC<{
  onOpen: (id: string, open?: Decision) => void;
  toast: (m: string) => void;
}> = ({ onOpen, toast }) => {
  const { records } = useOnboarding();
  const rc = useRc();
  const reqCode = (id: string) => rc.request(id)?.code || id;
  const candCode = (id: string) => rc.candidate(id)?.code || id;
  const [kpi, setKpi] = useState<KpiKey>('');
  const [q, setQ] = useState('');
  const [block, setBlock] = useState('');
  const [status, setStatus] = useState('');

  const counts = useMemo(
    () => ({
      pending: records.filter((r) => r.status === 'Chờ HCNS duyệt').length,
      rejected: records.filter((r) => r.status === 'HCNS từ chối').length,
      cancelled: records.filter((r) => r.status === 'Huỷ onboard').length,
      onboarding: records.filter((r) => r.status === 'Đang onboard').length,
      soon: records.filter(isSoon).length,
      done: records.filter((r) => r.status === 'Đã onboard').length,
      closed: records.filter(isClosed).length,
    }),
    [records],
  );

  const rows = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return records
      .filter((r) => (kpi === '' ? true : kpi === 'soon' ? isSoon(r) : kpi === 'closed' ? isClosed(r) : r.status === kpi))
      .filter((r) => !status || r.status === status)
      .filter((r) => !block || r.block === block)
      .filter((r) => !kw || [r.id, r.data.fullName, r.candidateEmail, reqCode(r.requestId), r.data.position, r.taPic].some((s) => s.toLowerCase().includes(kw)))
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [records, kpi, q, block, status]);

  const blocks = [...new Set(records.map((r) => r.block))].sort();
  const kpis: { label: string; value: number; key: KpiKey; tone: 'good' | 'bad' | 'neutral'; sub: string }[] = [
    { label: 'Chờ HCNS duyệt', value: counts.pending, key: 'Chờ HCNS duyệt', tone: counts.pending ? 'bad' : 'neutral', sub: 'Onboarding Request · Pending' },
    { label: 'Đang onboard', value: counts.onboarding, key: 'Đang onboard', tone: 'neutral', sub: 'Đã duyệt · chuẩn bị nhận việc' },
    { label: 'Nhận việc ≤ 7 ngày', value: counts.soon, key: 'soon', tone: counts.soon ? 'bad' : 'neutral', sub: 'Chưa xong thủ tục cần ưu tiên' },
    { label: 'Đã onboard', value: counts.done, key: 'Đã onboard', tone: 'good', sub: 'Stage Onboarded' },
    { label: 'HCNS từ chối', value: counts.rejected, key: 'HCNS từ chối', tone: 'neutral', sub: 'Rejected · TA gửi lại = yêu cầu mới' },
    { label: 'TA báo huỷ onboard', value: counts.cancelled, key: 'Huỷ onboard', tone: 'neutral', sub: 'Mail “Báo hủy Onboard sang HCNS”' },
  ];

  const waiting = counts.pending;

  return (
    <>
      <ErpTitleBar
        crumbs={['Nhân sự', 'Onboarding Request']}
        title="Onboarding Request — tiếp nhận từ Tuyển dụng"
        actions={
          <Btn icon={FileSpreadsheet} onClick={() => toast(`Đã xuất ${rows.length} yêu cầu ra Excel (mô phỏng)`)}>
            Xuất Excel
          </Btn>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <KpiBox key={k.label} label={k.label} value={k.value} valueText={String(k.value)} tone={k.tone} sub={k.sub} onClick={() => setKpi(kpi === k.key ? '' : k.key)} active={kpi === k.key} />
        ))}
      </div>

      {waiting > 0 && (
        <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-rose-50 border border-rose-300 rounded-[4px] text-[12.5px] text-rose-800">
          <AlertCircle size={15} className="shrink-0" />
          <span className="flex-1">
            Bạn có <b>{waiting}</b> yêu cầu onboarding <b>chờ duyệt</b> từ Tuyển dụng.
          </span>
          <Btn className="h-7" onClick={() => setKpi('Chờ HCNS duyệt')}>
            Lọc danh sách
          </Btn>
        </div>
      )}

      <Panel
        title="Danh sách phiếu bàn giao"
        icon={ClipboardList}
        noPad
        actions={
          <>
            <span className="relative">
              <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Mã phiếu, ứng viên, yêu cầu…" className={`${erp.input} h-7 w-56 pl-7 text-[12px]`} />
            </span>
            <select value={block} onChange={(e) => setBlock(e.target.value)} className={`${erp.input} h-7 w-28 text-[12px] cursor-pointer`}>
              <option value="">Mọi khối</option>
              {blocks.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${erp.input} h-7 w-36 text-[12px] cursor-pointer`}>
              <option value="">Mọi trạng thái</option>
              {ONB_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </>
        }
        footer={`${rows.length} / ${records.length} yêu cầu · Nguồn: TA gửi “Gửi thông tin sang HCNS” ở popup Gửi mail`}
      >
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                {['Mã phiếu', 'Ứng viên', 'Vị trí · Level', 'Bộ phận', 'Ngày nhận việc', 'TA PIC', 'Lần gửi', 'Trạng thái', 'Kiểm tra hồ sơ', 'Tiến độ onboard', 'Gửi lúc', 'Thao tác'].map((h) => (
                  <th key={h} className={`${erp.th} text-left`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={12} className={`${erp.td} text-center text-slate-400 py-6`}>
                    Không có phiếu phù hợp bộ lọc.
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const missing = missingForApprove(r);
                const done = r.checklist.filter((c) => c.done).length;
                return (
                  <tr key={r.id} className={`${erp.tr} cursor-pointer`} onClick={() => onOpen(r.id)}>
                    <td className={`${erp.td} ${erp.code} whitespace-nowrap`}>{r.id}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      <p className="font-semibold text-slate-800">{r.data.fullName}</p>
                      <p className="text-[11px] text-slate-500">
                        {candCode(r.candidateId)} · {reqCode(r.requestId)}
                      </p>
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      <p>{r.data.position}</p>
                      <p className="text-[11px] text-slate-500">{r.data.level || <span className="text-rose-600">thiếu level</span>}</p>
                    </td>
                    <td className={`${erp.td} max-w-[180px] truncate`} title={r.data.department}>
                      {r.data.department || <span className="text-rose-600">—</span>}
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      {dmy(r.data.startDate)} <DaysTag iso={r.data.startDate} muted={isClosed(r) || r.status === 'Đã onboard'} />
                    </td>
                    <td className={erp.td}>{r.taPic}</td>
                    <td className={erp.td}>{r.version > 1 ? <Tag cls={TAG.amber}>Cập nhật ×{r.version - 1}</Tag> : <span className="text-slate-500">Lần đầu</span>}</td>
                    <td className={erp.td}>
                      <OnbStatusTag status={r.status} />
                    </td>
                    <td className={erp.td}>
                      {r.status === 'Chờ HCNS duyệt' ? (
                        missing.length ? (
                          <span title={missing.join(', ')}>
                            <Tag cls={TAG.rose}>Thiếu {missing.length} trường</Tag>
                          </span>
                        ) : (
                          <Tag cls={TAG.green}>Đủ hồ sơ</Tag>
                        )
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className={erp.td}>
                      {r.status === 'Đang onboard' ? (
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                          <ProgressTag record={r} />
                          <span className="text-[11px] text-slate-500 tabular-nums">Checklist {done}/{r.checklist.length}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className={`${erp.td} whitespace-nowrap text-slate-600`}>{dmyhm(r.sentAt)}</td>
                    <td className={`${erp.td} whitespace-nowrap`} onClick={(e) => e.stopPropagation()}>
                      <button type="button" onClick={() => onOpen(r.id)} className="text-[#1f5fa8] underline cursor-pointer mr-2">
                        Xem
                      </button>
                      {r.status === 'Chờ HCNS duyệt' && (
                        <>
                          <button type="button" onClick={() => onOpen(r.id, 'approve')} className="text-emerald-700 font-bold underline cursor-pointer mr-2">
                            Duyệt
                          </button>
                          <button type="button" onClick={() => onOpen(r.id, 'reject')} className="text-rose-600 font-bold underline cursor-pointer">
                            Từ chối
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
};

// ==========================================================================
// CHI TIẾT PHIẾU
// ==========================================================================
type Tab = 'info' | 'checklist' | 'history' | 'mails';

const DetailView: React.FC<{
  id: string;
  onBack: () => void;
  toast: (m: string) => void;
  initialModal?: Decision;
  onNavigate?: (menuTitle: string) => void;
}> = ({ id, onBack, toast, initialModal = '', onNavigate }) => {
  const { find, hrApprove, hrReject, toggleChecklist, confirmOnboarded, hrSave } = useOnboarding();
  const rc = useRc();
  const r = find(id);
  const [tab, setTab] = useState<Tab>('info');
  const [modal, setModal] = useState<Decision>(initialModal);
  if (!r) return null;

  const missing = missingForApprove(r);
  const done = r.checklist.filter((c) => c.done).length;
  const d = daysUntil(r.data.startDate);
  const changedLabels = new Set(r.lastChanges.map((c) => c.field));

  // ---- Nút thao tác theo trạng thái
  const actions: React.ReactNode[] = [];
  if (r.status === 'Chờ HCNS duyệt') {
    actions.push(
      <Btn key="reject" variant="danger" icon={XCircle} onClick={() => setModal('reject')}>
        Từ chối
      </Btn>,
      <Btn key="approve" variant="primary" icon={ClipboardCheck} onClick={() => setModal('approve')}>
        Duyệt & tạo hồ sơ
      </Btn>,
    );
  }
  if (r.status === 'Đang onboard')
    actions.push(
      <Btn
        key="onb"
        variant="success"
        icon={UserCheck}
        disabled={d != null && d > 0}
        title={d != null && d > 0 ? 'Chưa tới ngày nhận việc' : undefined}
        onClick={() => {
          confirmOnboarded(r.id);
          toast(`${r.data.fullName} đã nhận việc — Stage Onboarded`);
        }}
      >
        Xác nhận đã nhận việc
      </Btn>,
    );

  // ---- Dải hướng dẫn bước hiện tại
  const bar = (tone: 'info' | 'warn' | 'bad' | 'muted' | 'violet', content: React.ReactNode) => {
    const cls = { info: 'bg-[#eef4fb] text-[#1e3a5f]', warn: 'bg-amber-50 text-amber-800', bad: 'bg-rose-50 text-rose-800', muted: 'bg-slate-50 text-slate-600', violet: 'bg-violet-50 text-violet-800' }[tone];
    const Icon = tone === 'muted' ? Info : tone === 'info' ? AlertCircle : AlertTriangle;
    return (
      <div className={`flex flex-wrap items-start gap-2 px-4 py-2 text-[12.5px] ${cls}`}>
        <Icon size={15} className="shrink-0 mt-0.5" />
        <span className="flex-1 min-w-[240px]">{content}</span>
      </div>
    );
  };
  let notice: React.ReactNode = null;
  if (r.status === 'Chờ HCNS duyệt') {
    notice = (
        <>
          {r.lastChanges.length > 0 &&
            bar(
              'warn',
              <>
                TA vừa <b>gửi cập nhật</b> lúc {dmyhm(r.sentAt)} — {r.lastChanges.length} trường thay đổi: {r.lastChanges.map((c) => c.field).join(', ')}.
              </>,
            )}
          {bar(
            missing.length ? 'bad' : 'info',
            missing.length ? (
              <>
                Phiếu chờ bạn duyệt. Cần bổ sung trước khi duyệt: <b>{missing.join(', ')}</b> (nhập ngay trong hộp “Duyệt & tạo hồ sơ”).
              </>
            ) : (
              <>Phiếu đủ thông tin — bấm <b>Duyệt & tạo hồ sơ</b> để tạo hồ sơ nhân sự, tài khoản và checklist onboard.</>
            ),
          )}
        </>
      );
  } else if (r.status === 'Đang onboard') {
    const pend = pendingTaskNames(r);
    notice = bar(
      pend.length ? 'warn' : 'info',
      <>
        {r.account.status === 'Đang tạo' && <Loader2 size={13} className="inline animate-spin mr-1" />}
        Hồ sơ <b>{r.account.employeeCode}</b>
        {r.account.userName && <> · user iMIS <b>{r.account.userName}</b></>}
        {r.account.companyEmail && <> · {r.account.companyEmail}</>}.{' '}
        {pend.length ? <>Đang chờ: {pend.join('; ')}.</> : <>Đã hoàn thành đủ 4 việc sau duyệt.</>} Checklist {done}/{r.checklist.length}. Nhận việc {dmy(r.data.startDate)}
        {d != null && d > 0 ? ` (còn ${d} ngày)` : ''} — tới ngày, Stage tự lên Onboarded (job 00:15).
      </>,
    );
  } else if (r.status === 'Huỷ onboard') {
    notice = bar(
      'muted',
      <>
        TA đã gửi <b>Báo hủy Onboard sang HCNS</b>: {r.cancelReason}. Onboarding Request → <b>Rejected</b>, Stage lượt ứng tuyển → Offer Rejected.
        {r.account.status === 'Đã tạo' && <> Hồ sơ {r.account.employeeCode} đã có tài khoản — <b>cần HR xử lý hồ sơ/tài khoản đã tạo</b>.</>} TA gửi lại “Gửi thông tin sang HCNS” = gửi lần đầu (Pending mới).
      </>,
    );
  } else if (r.status === 'HCNS từ chối') {
    notice = bar(
      'bad',
      <>
        HCNS từ chối lúc {dmyhm(r.decidedAt || '')} ({r.decidedBy}){r.returnReason ? `: ${r.returnReason}` : ''}. Stage ứng viên không đổi. TA gửi lại “Gửi thông tin sang HCNS” → mail [Cập nhật] và tạo yêu cầu Pending mới.
      </>,
    );
  } else if (r.status === 'Đã onboard') {
    notice = bar('info', <>Ứng viên đã nhận việc ngày {dmy(r.data.startDate)} — mã nhân sự {r.account.employeeCode}. Thông tin HCNS hiện ở hồ sơ ứng viên (trạng thái “Đang thử việc”).</>);
  }

  const mark = (label: string, value: React.ReactNode): React.ReactNode => {
    if (!changedLabels.has(label)) return value;
    const ch = r.lastChanges.find((c) => c.field === label)!;
    return (
      <span className="inline-flex flex-wrap items-center gap-1.5">
        {value}
        <span title={`Trước: ${ch.from || '(trống)'}`}>
          <Tag cls={TAG.amber}>Mới đổi</Tag>
        </span>
        <span className="text-[11px] text-slate-400 line-through">{ch.from}</span>
      </span>
    );
  };
  const f = (k: keyof HandoffData) => mark(HANDOFF_LABELS[k], fieldText(k, r.data));

  return (
    <>
      <ErpTitleBar
        onBack={onBack}
        title={
          <>
            {r.id} · {r.data.fullName}
            <OnbStatusTag status={r.status} />
            <span className="text-[11px] font-normal text-slate-400">({ONB_STATUS_REAL[r.status]})</span>
          </>
        }
        actions={
          <>
            {actions}
          </>
        }
        meta={[
          { label: 'Ứng viên', value: rc.candidate(r.candidateId)?.code || r.candidateId },
          { label: 'Yêu cầu', value: `${rc.request(r.requestId)?.code || r.requestId} · ${r.block}` },
          { label: 'Vị trí', value: `${r.data.position} · ${r.data.level || '—'}` },
          {
            label: 'Nhận việc',
            value: (
              <span className="inline-flex items-center gap-1.5">
                {dmy(r.data.startDate)} <DaysTag iso={r.data.startDate} muted={isClosed(r) || r.status === 'Đã onboard'} />
              </span>
            ),
          },
          { label: 'TA PIC', value: [r.taPic, r.taPic2].filter(Boolean).join(', ') },
          { label: 'Gửi lần', value: `${r.version} · ${dmyhm(r.sentAt)}` },
        ]}
        notice={notice}
      />

      <Panel title="Tiến trình bàn giao & onboard" icon={ClipboardCheck}>
        <OnbStepper record={r} />
      </Panel>

      {r.status !== 'HCNS từ chối' && <OnbProgressPanel record={r} toast={toast} onOpenEmployee={() => onNavigate?.('Employees')} />}

      <div className="bg-white border border-slate-300 rounded-[4px] overflow-hidden">
        <div className="pt-1.5 bg-[#f3f6fa]">
          <FolderTabs<Tab>
            value={tab}
            onChange={setTab}
            tabs={[
              { key: 'info', label: 'Thông tin bàn giao', icon: Users },
              { key: 'checklist', label: `Checklist onboard (${done}/${r.checklist.length || 11})`, icon: ClipboardList },
              { key: 'history', label: `Lịch sử (${r.history.length})`, icon: History },
              { key: 'mails', label: `Mail đã gửi (${r.mails.length})`, icon: Mail },
            ]}
          />
        </div>
        <div className="p-3">
          {tab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Panel title="Ứng viên & vị trí">
                <FieldTable
                  rows={[
                    { label: 'Họ tên ứng viên', value: f('fullName') },
                    { label: 'Email cá nhân', value: r.candidateEmail },
                    { label: 'Điện thoại', value: r.candidatePhone },
                    { label: 'Nguồn', value: r.candidateSource },
                    { label: 'Ngày bắt đầu làm việc', value: f('startDate') },
                    { label: 'Vị trí chức danh', value: f('position') },
                    { label: 'Level', value: f('level') },
                    { label: 'Tech Stack', value: f('techStack') },
                    { label: 'Bộ phận', value: f('department') },
                    { label: 'Quản lý trực tiếp', value: f('manager') },
                    { label: 'Địa điểm làm việc', value: f('workLocation') },
                  ]}
                />
              </Panel>
              <Panel title="Đãi ngộ & phê duyệt offer">
                <FieldTable
                  rows={[
                    { label: 'Lương chính thức (Gross)', value: f('officialSalary'), num: true, strong: true },
                    { label: 'Thời gian thử việc', value: f('probationMonths') },
                    { label: 'Tỉ lệ lương thử việc', value: f('probationPercent') },
                    { label: 'Lương thử việc (tự tính)', value: money(probationSalary(r.data)), num: true },
                    { label: 'Người phê duyệt Offer', value: f('approver') },
                    {
                      label: 'Bằng chứng phê duyệt',
                      value: r.data.evidenceFile ? (
                        mark(
                          'Bằng chứng phê duyệt',
                          <span className="inline-flex items-center gap-1 text-[#1f5fa8] underline cursor-pointer">
                            <Paperclip size={12} /> {r.data.evidenceFile}
                          </span>,
                        )
                      ) : (
                        ''
                      ),
                    },
                    { label: 'CV', value: r.data.cvLink ? <span className="text-[#1f5fa8] underline break-all">{r.data.cvLink}</span> : r.cvFile ? `File đính kèm: ${r.cvFile}` : '' },
                    { label: 'Refer', value: isRefer(r.candidateSource) && r.data.referBonus !== '' ? `${money(r.data.referBonus)} – Người nhận: ${r.data.referRecipient || '—'}` : '' },
                    { label: 'Ghi chú của TA', value: f('note') },
                  ]}
                />
              </Panel>
              <HrPanel record={r} onSave={(p) => { hrSave(r.id, p); toast('Đã lưu thông tin HCNS'); }} />
              {r.lastChanges.length > 0 && (
                <Panel title={`Thay đổi ở lần gửi ${r.version}`} icon={RotateCcw}>
                  <ChangeList changes={r.lastChanges} />
                </Panel>
              )}
            </div>
          )}

          {tab === 'checklist' && <ChecklistTab record={r} onToggle={(itemId) => toggleChecklist(r.id, itemId)} />}

          {tab === 'history' && (
            <table className={erp.table}>
              <thead>
                <tr>
                  {['Thời gian', 'Người thực hiện', 'Vai trò', 'Thao tác', 'Nội dung'].map((h) => (
                    <th key={h} className={`${erp.th} text-left`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...r.history].reverse().map((h, i) => (
                  <tr key={i} className={erp.tr}>
                    <td className={`${erp.td} whitespace-nowrap`}>{dmyhm(h.at)}</td>
                    <td className={erp.td}>{h.by}</td>
                    <td className={erp.td}>
                      <Tag cls={h.role === 'TA' ? TAG.blue : h.role === 'HCNS' ? TAG.violet : TAG.slate}>{h.role}</Tag>
                    </td>
                    <td className={`${erp.td} font-semibold`}>{h.action}</td>
                    <td className={erp.td}>
                      {h.note && <p className="text-slate-700">{h.note}</p>}
                      {h.changes && h.changes.length > 0 && <ChangeList changes={h.changes} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === 'mails' && (
            <table className={erp.table}>
              <thead>
                <tr>
                  {['Thời gian', 'Loại', 'Tiêu đề', 'Đến', 'CC', 'Đính kèm'].map((h) => (
                    <th key={h} className={`${erp.th} text-left`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...r.mails].reverse().map((m, i) => (
                  <tr key={i} className={erp.tr}>
                    <td className={`${erp.td} whitespace-nowrap`}>{dmyhm(m.at)}</td>
                    <td className={erp.td}>
                      <Tag cls={m.kind === 'Báo huỷ onboard' ? TAG.rose : m.kind === 'Cập nhật thông tin onboard' ? TAG.amber : m.kind === 'Form onboarding cho ứng viên' ? TAG.green : TAG.blue}>{m.kind}</Tag>
                    </td>
                    <td className={erp.td}>{m.subject}</td>
                    <td className={`${erp.td} font-mono text-[12px]`}>{m.to}</td>
                    <td className={erp.td}>{m.cc.join(', ') || <span className="text-slate-400">—</span>}</td>
                    <td className={erp.td}>{m.attachments.join(', ') || <span className="text-slate-400">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ApproveModal
        open={modal === 'approve'}
        record={r}
        onClose={() => setModal('')}
        onApprove={(p) => {
          hrApprove(r.id, p);
          setModal('');
          setTab('checklist');
          toast(`Đã duyệt ${r.id} — đang tạo hồ sơ & tài khoản`);
        }}
      />
      <RejectModal
        open={modal === 'reject'}
        record={r}
        onClose={() => setModal('')}
        onReject={(reason) => {
          hrReject(r.id, reason);
          setModal('');
          toast(`Đã từ chối ${r.id}`);
        }}
      />
    </>
  );
};

/** Ô để trống (không hiện "—") cho tới khi đã tạo xong. */
const blank = (v: React.ReactNode) => (v === '' || v == null ? <span /> : v);

/** Khối HCNS xử lý — HCNS sửa Loại HĐ / ghi chú khi phiếu chưa duyệt. */
const HrPanel: React.FC<{ record: OnbRecord; onSave: (p: { contractType: string; hrNote: string }) => void }> = ({ record: r, onSave }) => {
  const editable = r.status === 'Chờ HCNS duyệt';
  const [ct, setCt] = useState(r.contractType);
  const [note, setNote] = useState(r.hrNote);
  const dirty = ct !== r.contractType || note !== r.hrNote;
  const acc = r.account;
  return (
    <Panel
      title="HCNS xử lý"
      icon={UserCheck}
      className="lg:col-span-1"
      actions={
        editable && (
          <Btn className="h-7" variant="primary" disabled={!dirty} onClick={() => onSave({ contractType: ct, hrNote: note })}>
            Lưu
          </Btn>
        )
      }
    >
      {editable ? (
        <div className="space-y-2.5">
          <FormRow label="Loại hợp đồng" hint="Không chặn duyệt — Tuyển dụng không gửi trường này">
            <CatalogSelect value={ct} options={CONTRACT_TYPES} onChange={setCt} />
          </FormRow>
          <FormRow label="Ghi chú HCNS">
            <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
          </FormRow>
        </div>
      ) : (
        <FieldTable
          rows={[
            { label: 'Loại hợp đồng', value: r.contractType },
            { label: 'Ghi chú HCNS', value: r.hrNote },
            { label: 'Người duyệt', value: r.decidedBy && (r.status === 'Đang onboard' || r.status === 'Đã onboard') ? `${r.decidedBy} · ${dmyhm(r.decidedAt || '')}` : '' },
            {
              label: 'Hồ sơ nhân sự',
              value: blank(taskOf(r, 'employee').status === 'Đã hoàn thành' && acc.employeeCode ? <b>{acc.employeeCode}</b> : ''),
            },
            { label: 'User iMIS', value: blank(taskOf(r, 'imisAccount').status === 'Đã hoàn thành' ? acc.userName || '' : '') },
            { label: 'Email công ty (M365)', value: blank(acc.companyEmail || '') },
            {
              label: 'Bàn giao đăng nhập',
              value: blank(taskOf(r, 'itAccount').status === 'Đã hoàn thành' && taskOf(r, 'itAccount').deliveryChannel ? `${taskOf(r, 'itAccount').deliveryChannel} · ${taskOf(r, 'itAccount').deliveredBy}` : ''),
            },
          ]}
        />
      )}
    </Panel>
  );
};

const OWNERS: ChecklistOwner[] = ['Phòng ban', 'IT', 'HCTH'];

const ChecklistTab: React.FC<{ record: OnbRecord; onToggle: (id: string) => void }> = ({ record: r, onToggle }) => {
  if (!r.checklist.length)
    return (
      <div className="flex items-center gap-2 px-3 py-6 justify-center text-[13px] text-slate-500">
        <Info size={15} /> Checklist onboard (11 mục: Phòng ban 4 · IT 4 · HCTH 3) được tạo khi HCNS duyệt phiếu.
      </div>
    );
  const canTick = r.status === 'Đang onboard';
  let n = 0;
  return (
    <table className={erp.table}>
      <thead>
        <tr>
          {['#', 'Hạng mục', 'Trạng thái', 'Người xác nhận', 'Thời gian'].map((h) => (
            <th key={h} className={`${erp.th} text-left`}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {OWNERS.map((o) => {
          const items = r.checklist.filter((c) => c.owner === o);
          const ok = items.filter((c) => c.done).length;
          return (
            <React.Fragment key={o}>
              <tr className="bg-[#f3f6fa]">
                <td colSpan={5} className={`${erp.td} font-bold text-[#1e3a5f]`}>
                  {o} <span className="font-normal text-slate-500">· {ok}/{items.length}</span>
                </td>
              </tr>
              {items.map((c) => (
                <tr key={c.id} className={erp.tr}>
                  <td className={`${erp.td} w-10 text-center text-slate-400`}>{++n}</td>
                  <td className={erp.td}>{c.item}</td>
                  <td className={erp.td}>
                    {canTick ? (
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={c.done} onChange={() => onToggle(c.id)} className="w-4 h-4 accent-[#0f8f6c] cursor-pointer" />
                        {c.done ? <span className="text-emerald-700 font-semibold">Hoàn thành</span> : <span className="text-slate-500">Chưa xong</span>}
                      </label>
                    ) : c.done ? (
                      <Tag cls={TAG.green} icon={CheckCircle2}>
                        Hoàn thành
                      </Tag>
                    ) : (
                      <Tag cls={TAG.slate}>Chưa xong</Tag>
                    )}
                  </td>
                  <td className={erp.td}>{c.doneBy || <span className="text-slate-400">—</span>}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{c.doneAt ? dmyhm(c.doneAt) : <span className="text-slate-400">—</span>}</td>
                </tr>
              ))}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

// ==========================================================================
// HỘP THOẠI
// ==========================================================================
const ApproveModal: React.FC<{
  open: boolean;
  record: OnbRecord;
  onClose: () => void;
  onApprove: (p: { data: Partial<HandoffData>; contractType: string; hrNote: string }) => void;
}> = ({ open, record: r, onClose, onApprove }) => {
  const [data, setData] = useState<Partial<HandoffData>>({});
  const [ct, setCt] = useState('');
  const [note, setNote] = useState('');
  // nạp lại mỗi lần mở
  const [openedFor, setOpenedFor] = useState('');
  if (open && openedFor !== `${r.id}-${r.version}`) {
    setOpenedFor(`${r.id}-${r.version}`);
    setData({ startDate: r.data.startDate, department: r.data.department, position: r.data.position, level: r.data.level, manager: r.data.manager });
    setCt(r.contractType);
    setNote(r.hrNote);
  }
  if (!open && openedFor) setOpenedFor('');
  const merged = { data: { ...r.data, ...data }, contractType: ct };
  const missing = missingForApprove(merged);
  const set = (k: keyof HandoffData, v: string) => setData((d) => ({ ...d, [k]: v }));
  const depts = departmentsOf(r.block);

  return (
    <Modal
      open={open}
      onClose={onClose}
      width="max-w-2xl"
      title={`Duyệt & tạo hồ sơ — ${r.id} · ${r.data.fullName}`}
      footer={
        <>
          <Btn onClick={onClose}>Huỷ</Btn>
          <Btn variant="primary" icon={ClipboardCheck} disabled={missing.length > 0} onClick={() => onApprove({ data, contractType: ct, hrNote: note })}>
            Duyệt & tạo hồ sơ
          </Btn>
        </>
      }
    >
      <div className="space-y-3">
        <FieldTable
          labelWidth="34%"
          rows={[
            { label: 'Ứng viên', value: `${r.data.fullName} · ${r.candidateEmail}` },
            { label: 'Lương chính thức / thử việc', value: `${fieldText('officialSalary', r.data)} · ${fieldText('probationMonths', r.data)} × ${fieldText('probationPercent', r.data)}` },
            { label: 'Người phê duyệt Offer', value: r.data.approver + (r.data.evidenceFile ? ` · bằng chứng: ${r.data.evidenceFile}` : ' · (không có bằng chứng)') },
          ]}
        />
        <div className="border border-slate-300 rounded-[4px] p-3 space-y-2.5">
          <p className="text-[12px] font-bold uppercase tracking-wide text-[#1e3a5f]">Thông tin bắt buộc để tạo hồ sơ</p>
          <FormRow label="Ngày onboard" required error={!merged.data.startDate ? 'Bắt buộc' : undefined}>
            <input type="date" value={merged.data.startDate} onChange={(e) => set('startDate', e.target.value)} className={erp.inputFull} />
          </FormRow>
          <FormRow label="Phòng ban" required error={!merged.data.department ? 'Bắt buộc' : undefined}>
            <CatalogSelect value={merged.data.department} options={depts} onChange={(v) => set('department', v)} />
          </FormRow>
          <FormRow label="Vị trí" required error={!merged.data.position ? 'Bắt buộc' : undefined}>
            <CatalogSelect value={merged.data.position} options={HR_POSITIONS} onChange={(v) => set('position', v)} />
          </FormRow>
          <FormRow label="Cấp bậc" required error={!merged.data.level ? 'Bắt buộc' : undefined}>
            <CatalogSelect value={merged.data.level} options={HR_LEVELS} onChange={(v) => set('level', v)} />
          </FormRow>
          <FormRow label="Quản lý trực tiếp" required error={!merged.data.manager ? 'Bắt buộc' : undefined}>
            <CatalogSelect value={merged.data.manager} options={STAFF_NAMES} onChange={(v) => set('manager', v)} />
          </FormRow>
          <FormRow label="Loại hợp đồng" hint="Không bắt buộc khi duyệt">
            <CatalogSelect value={ct} options={CONTRACT_TYPES} onChange={setCt} />
          </FormRow>
          <FormRow label="Ghi chú HCNS">
            <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
          </FormRow>
        </div>
        <div className="bg-[#eef4fb] border border-[#b9d3f0] rounded-[4px] px-3 py-2 text-[12px] text-[#1e3a5f]">
          <p className="font-bold mb-1">An employee profile will be created and the onboarding form will be emailed. Khi duyệt, hệ thống sẽ:</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Tạo hồ sơ nhân sự (Employees, trạng thái Thử việc) + hợp đồng tự sinh, cộng phép.</li>
            <li>Chạy job tạo tài khoản đăng nhập iMIS.</li>
            <li>Gửi Microsoft Forms thông tin cá nhân tới {r.candidateEmail} — chờ nhân sự submit.</li>
            <li>Gửi mail it@company.vn cấp tài khoản Microsoft 365 & đăng nhập — chờ IT xác nhận.</li>
            <li>Tạo 11 mục checklist (Phòng ban 4 · IT 4 · HCTH 3).</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

/** Từ chối (Reject) — lý do không bắt buộc, tối đa 500 ký tự, nối vào Notes "[Từ chối] user lúc … – Lý do: …". */
const RejectModal: React.FC<{ open: boolean; record: OnbRecord; onClose: () => void; onReject: (reason: string) => void }> = ({ open, record: r, onClose, onReject }) => {
  const [reason, setReason] = useState('');
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Từ chối yêu cầu onboarding — ${r.id} · ${r.data.fullName}`}
      footer={
        <>
          <Btn onClick={onClose}>Huỷ</Btn>
          <Btn
            variant="danger"
            icon={XCircle}
            onClick={() => {
              onReject(reason.trim());
              setReason('');
            }}
          >
            Từ chối
          </Btn>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-[12px] text-slate-600">Yêu cầu chuyển sang <b>Rejected</b>. Stage ứng viên giữ nguyên; TA có thể gửi lại thông tin sang HCNS (tạo yêu cầu Pending mới).</p>
        <FormRow label="Lý do" hint={`${reason.length}/500 ký tự · không bắt buộc`}>
          <textarea rows={3} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
        </FormRow>
      </div>
    </Modal>
  );
};
