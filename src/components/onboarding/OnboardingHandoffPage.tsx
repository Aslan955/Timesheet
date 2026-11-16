/**
 * HR › Onboarding Request — luồng 4 phòng ban:
 *  - Tuyển dụng (TA): gửi email "Gửi thông tin sang HCNS" → ứng viên hiện ở màn này (Chờ HCNS Accept).
 *  - HCNS: chọn 1 hoặc nhiều ứng viên → Accept / Reject. Accept = tạo nhân viên trong Employees + gửi link form thông tin cá nhân.
 *  - Ứng viên: điền form, Submit → dữ liệu đổ vào Employees, đồng thời gửi yêu cầu IT (Họ và tên, Khối, Cấp trên trực tiếp, Công ty).
 *  - IT: trả email, tên tài khoản, mật khẩu → ghi vào hồ sơ, tự báo MarCom.
 *  - MarCom: chuẩn bị Welcome Onboard.
 * Bộ lọc ngày onboard: tuần này, tuần sau, tháng này, tháng trước, tháng tự chọn.
 */
import React, { useMemo, useState } from 'react';
import {
  AlertCircle, CalendarRange, CheckCircle2, ClipboardCheck, ClipboardList, Copy, FileSpreadsheet, Hand, History, Info, KeyRound, Mail, Paperclip,
  Pencil, RotateCcw, Search, ShieldCheck, UserCheck, Users, X, XCircle,
} from 'lucide-react';
import { ErpPage, ErpTitleBar, Panel, Btn, erp, Tag, FieldTable, FolderTabs, KpiBox, FormRow } from '../erp/Erp';
import { Modal, TAG, useToast } from '../../marcom/MarcomUi';
import { useOnboarding } from '../../onboarding/OnboardingContext';
import { useRc } from '../../recruitment/rc/RcContext';
import {
  OnbRecord, HandoffData, HANDOFF_LABELS, EMPLOYEE_TYPES, CONTRACT_TYPES, COMPANIES, departmentsOf, HR_POSITIONS, HR_LEVELS, STAFF_NAMES, DATE_RANGES, DateRangeKey,
  missingForApprove, taskOf, fieldText, money, probationSalary, dmy, dmyhm, daysUntil, isRefer, ChecklistOwner, stepIndex, rangeOf, inRange, todayIso,
  IT_MAILBOX, MARCOM_MAILBOX, IT_STAFF, START_DATE_REASONS, OnbMail, validateHandoff, diffHandoff,
} from '../../onboarding/onboardingData';
import { OnbStatusTag, DaysTag, OnbStepper, ChangeList, CatalogSelect, FormField } from './onbUi';
import { OnbProgressPanel, ProgressTag, WaitTag, Secret, ItReturnModal, MarcomDoneModal, TASK_STATUS_CLS } from './OnbProgressPanel';
import { CandidateFormPage } from './CandidateFormPage';
import { RcHcnsFields } from '../recruitment/RcHcnsForm';
import type { RcCandidate, RcRequest } from '../../recruitment/rc/rcData';
import { templatesFor, timingText } from '../../onboarding/onbMailTemplates';

type Nav = (menuTitle: string) => void;
type Toast = (m: string) => void;
type Role = 'hcns' | 'it' | 'marcom';
type StepKey = '' | 'pending' | 'form' | 'it' | 'marcom' | 'ready' | 'done' | 'closed';

const isClosed = (r: OnbRecord) => r.status === 'Huỷ onboard' || r.status === 'HCNS từ chối' || r.status === 'Cancel offer';
const stepKeyOf = (r: OnbRecord): StepKey => {
  if (r.status === 'Chờ HCNS duyệt') return 'pending';
  if (r.status === 'Đã onboard') return 'done';
  if (isClosed(r)) return 'closed';
  const i = stepIndex(r);
  return i === 2 ? 'form' : i === 3 ? 'it' : taskOf(r, 'marcom').status === 'Đã hoàn thành' ? 'ready' : 'marcom';
};

type View = { mode: 'list' } | { mode: 'detail'; id: string };

export const OnboardingHandoffPage: React.FC<{ onNavigate?: Nav }> = ({ onNavigate }) => {
  const { records } = useOnboarding();
  const [view, setView] = useState<View>({ mode: 'list' });
  const [role, setRole] = useState<Role>('hcns');
  const [range, setRange] = useState<DateRangeKey>('');
  const [month, setMonth] = useState(() => todayIso().slice(0, 7));
  const [formFor, setFormFor] = useState('');
  const { toast, toastNode } = useToast();
  const formRec = records.find((r) => r.id === formFor);

  const span = rangeOf(range, month);
  const inSpan = records.filter((r) => inRange(r.data.startDate, span));
  const itWaiting = inSpan.filter((r) => (taskOf(r, 'itAccount').status === 'Đang thực hiện' && !isClosed(r)) || r.itCancel?.status === 'Chờ IT huỷ').length;
  const mcWaiting = inSpan.filter((r) => taskOf(r, 'marcom').status === 'Đang thực hiện' && !isClosed(r)).length;
  const hcnsWaiting = inSpan.filter((r) => r.status === 'Chờ HCNS duyệt').length;

  return (
    <ErpPage>
      {view.mode === 'list' ? (
        <>
          <ErpTitleBar
            crumbs={['Nhân sự', 'Onboarding Request']}
            title="Onboarding Request"
            actions={
              <>
                {onNavigate && (
                  <Btn icon={Mail} onClick={() => onNavigate('Thiết lập email Onboarding')} data-testid="open-mail-settings">
                    Thiết lập email
                  </Btn>
                )}
                <Btn icon={FileSpreadsheet} onClick={() => toast(`Đã xuất ${inSpan.length} ứng viên ra Excel (mô phỏng)`)}>
                  Xuất Excel
                </Btn>
              </>
            }
          />
          <FlowStrip />
          <DateFilter range={range} month={month} onRange={setRange} onMonth={setMonth} span={span} count={inSpan.length} total={records.length} />
          <div className="bg-white border border-slate-300 rounded-[4px] overflow-hidden">
            <div className="pt-1.5 bg-[#f3f6fa]">
              <FolderTabs<Role>
                value={role}
                onChange={setRole}
                tabs={[
                  { key: 'hcns', label: <>HCNS · Tiếp nhận ứng viên {hcnsWaiting > 0 && <Count n={hcnsWaiting} />}</>, icon: UserCheck },
                  { key: 'it', label: <>IT · Cấp tài khoản {itWaiting > 0 && <Count n={itWaiting} />}</>, icon: KeyRound },
                  { key: 'marcom', label: <>MarCom · Welcome Onboard {mcWaiting > 0 && <Count n={mcWaiting} />}</>, icon: Hand },
                ]}
              />
            </div>
            <div className="p-3 space-y-3">
              {role === 'hcns' && <HcnsList rows={inSpan} onOpen={(id) => setView({ mode: 'detail', id })} toast={toast} />}
              {role === 'it' && <ItList rows={inSpan} onOpen={(id) => setView({ mode: 'detail', id })} toast={toast} />}
              {role === 'marcom' && <MarcomList rows={inSpan} onOpen={(id) => setView({ mode: 'detail', id })} toast={toast} onNavigate={onNavigate} />}
            </div>
          </div>
        </>
      ) : (
        <DetailView key={view.id} id={view.id} onBack={() => setView({ mode: 'list' })} toast={toast} onNavigate={onNavigate} onOpenForm={setFormFor} />
      )}
      {formRec && <CandidateFormPage record={formRec} onClose={() => setFormFor('')} onSubmitted={() => toast(`${formRec.data.fullName} đã submit form — đã cập nhật Employees và gửi yêu cầu tới IT`)} />}
      {toastNode}
    </ErpPage>
  );
};

const Count: React.FC<{ n: number }> = ({ n }) => <span className="ml-1 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full bg-rose-600 text-white text-[10.5px] font-bold">{n}</span>;

/** Dải mô tả luồng 4 phòng ban. */
const FlowStrip: React.FC = () => {
  const steps = [
    { who: 'Tuyển dụng', what: 'Gửi email chuyển ứng viên', cls: 'bg-sky-50 border-sky-200 text-sky-800' },
    { who: 'HCNS', what: 'Accept / Reject (chọn nhiều)', cls: 'bg-violet-50 border-violet-200 text-violet-800' },
    { who: 'Ứng viên', what: 'Điền form thông tin cá nhân', cls: 'bg-blue-50 border-blue-200 text-blue-800' },
    { who: 'IT', what: 'Trả email, tài khoản, mật khẩu', cls: 'bg-amber-50 border-amber-200 text-amber-800' },
    { who: 'MarCom', what: 'Chuẩn bị Welcome Onboard', cls: 'bg-rose-50 border-rose-200 text-rose-800' },
    { who: 'Hệ thống', what: 'Email theo đối tượng (Nội bộ / Staffing)', cls: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  ];
  return (
    <div className="flex flex-wrap items-stretch gap-1.5 text-[12px]">
      {steps.map((s, i) => (
        <React.Fragment key={s.who}>
          {i > 0 && <span className="self-center text-slate-400">→</span>}
          <span className={`px-2.5 py-1 rounded-[4px] border ${s.cls}`}>
            <b>{s.who}</b> · {s.what}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

/** Bộ lọc ngày onboard. */
const DateFilter: React.FC<{
  range: DateRangeKey;
  month: string;
  onRange: (k: DateRangeKey) => void;
  onMonth: (m: string) => void;
  span: [string, string] | null;
  count: number;
  total: number;
}> = ({ range, month, onRange, onMonth, span, count, total }) => (
  <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-[4px]" data-testid="date-filter">
    <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f]">
      <CalendarRange size={14} /> Ngày onboard
    </span>
    <div className="inline-flex flex-wrap border border-slate-300 rounded-[3px] overflow-hidden bg-white">
      {DATE_RANGES.map((o, i) => (
        <button
          key={o.key || 'all'}
          type="button"
          onClick={() => onRange(o.key)}
          data-range={o.key || 'all'}
          className={`h-7 px-3 text-[12px] cursor-pointer whitespace-nowrap ${i > 0 ? 'border-l border-slate-300' : ''} ${range === o.key ? 'bg-[#1f5fa8] text-white font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
    {range === 'month' && <input type="month" value={month} onChange={(e) => onMonth(e.target.value)} className={`${erp.input} h-7 w-36 text-[12px]`} data-testid="month-pick" />}
    <span className="ml-auto text-[12px] text-slate-500">
      {span ? (
        <>
          {dmy(span[0])} – {dmy(span[1])} ·{' '}
        </>
      ) : null}
      <b className="text-slate-700">{count}</b> / {total} ứng viên
    </span>
  </div>
);

/** Nhãn Đối tượng: Staffing (xanh lá) / Nội bộ (xám) — bản ghi cũ chưa có ⇒ Nội bộ. */
const EmployeeTypeTag: React.FC<{ type?: string }> = ({ type }) => (
  <Tag cls={type === 'Staffing' ? TAG.green : TAG.slate}>{type || 'Nội bộ'}</Tag>
);

// ==========================================================================
// HCNS — danh sách, chọn nhiều Accept / Reject
// ==========================================================================
const HcnsList: React.FC<{ rows: OnbRecord[]; onOpen: (id: string) => void; toast: Toast }> = ({ rows: all, onOpen, toast }) => {
  const { hrApproveMany, hrRejectMany } = useOnboarding();
  const rc = useRc();
  const reqCode = (id: string) => rc.request(id)?.code || id;
  const [step, setStep] = useState<StepKey>('');
  const [q, setQ] = useState('');
  const [block, setBlock] = useState('');
  const [company, setCompany] = useState('');
  const [etype, setEtype] = useState('');
  const [sel, setSel] = useState<string[]>([]);
  const [modal, setModal] = useState<'' | 'accept' | 'reject'>('');
  const [cancelId, setCancelId] = useState('');
  const cancelRec = all.find((r) => r.id === cancelId);

  const count = (k: StepKey) => all.filter((r) => stepKeyOf(r) === k).length;
  const rows = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return all
      .filter((r) => !step || stepKeyOf(r) === step)
      .filter((r) => !block || r.block === block)
      .filter((r) => !company || r.company === company)
      .filter((r) => !etype || (r.data.employeeType || 'Nội bộ') === etype)
      .filter((r) => !kw || [r.id, r.data.fullName, r.candidateEmail, reqCode(r.requestId), r.data.position, r.taPic, r.data.manager].some((s) => s.toLowerCase().includes(kw)))
      .sort((a, b) => (a.status === 'Chờ HCNS duyệt' ? 0 : 1) - (b.status === 'Chờ HCNS duyệt' ? 0 : 1) || a.data.startDate.localeCompare(b.data.startDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, step, q, block, company, etype]);

  const selectable = rows.filter((r) => r.status === 'Chờ HCNS duyệt');
  const selected = sel.filter((id) => selectable.some((r) => r.id === id));
  const allOn = selectable.length > 0 && selectable.every((r) => selected.includes(r.id));
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const blocks = [...new Set(all.map((r) => r.block))].sort();
  const selRecs = all.filter((r) => selected.includes(r.id));

  const kpis: { label: string; key: StepKey; tone: 'good' | 'bad' | 'neutral'; sub: string }[] = [
    { label: 'Chờ HCNS Accept', key: 'pending', tone: count('pending') ? 'bad' : 'neutral', sub: 'TA vừa chuyển sang' },
    { label: 'Chờ ứng viên điền form', key: 'form', tone: 'neutral', sub: 'Đã gửi link form' },
    { label: 'Chờ IT cấp tài khoản', key: 'it', tone: count('it') ? 'bad' : 'neutral', sub: `Yêu cầu tới ${IT_MAILBOX}` },
    { label: 'Chờ MarCom Welcome', key: 'marcom', tone: 'neutral', sub: `Đã báo ${MARCOM_MAILBOX}` },
    { label: 'Chờ email ngày onboard', key: 'ready', tone: 'good', sub: 'Theo Thiết lập email' },
    { label: 'Đã onboard', key: 'done', tone: 'good', sub: 'Đã gửi email onboard' },
    { label: 'Reject / Cancel offer', key: 'closed', tone: 'neutral', sub: 'HCNS reject · cancel offer' },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {kpis.map((k) => (
          <KpiBox key={k.key} label={k.label} value={count(k.key)} valueText={String(count(k.key))} tone={k.tone} sub={k.sub} onClick={() => setStep(step === k.key ? '' : k.key)} active={step === k.key} />
        ))}
      </div>

      {selected.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-[#eaf2fc] border border-[#b9d3f0] rounded-[4px] text-[12.5px] text-[#1e3a5f]" data-testid="bulk-bar">
          <CheckCircle2 size={15} />
          <span className="flex-1">
            Đã chọn <b>{selected.length}</b> ứng viên: {selRecs.map((r) => r.data.fullName).join(', ')}
          </span>
          <Btn variant="success" icon={ClipboardCheck} onClick={() => setModal('accept')} data-testid="bulk-accept">
            Accept ({selected.length})
          </Btn>
          <Btn variant="danger" icon={XCircle} onClick={() => setModal('reject')} data-testid="bulk-reject">
            Reject ({selected.length})
          </Btn>
          <Btn icon={X} onClick={() => setSel([])}>
            Bỏ chọn
          </Btn>
        </div>
      ) : count('pending') > 0 ? (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-300 rounded-[4px] text-[12.5px] text-amber-800">
          <AlertCircle size={15} className="shrink-0" />
          <span className="flex-1">
            Có <b>{count('pending')}</b> ứng viên Tuyển dụng vừa chuyển sang chờ bạn <b>Accept / Reject</b>. Tích chọn 1 hoặc nhiều dòng để xử lý cùng lúc.
          </span>
          <Btn className="h-7" onClick={() => setStep('pending')}>
            Lọc chờ Accept
          </Btn>
        </div>
      ) : null}

      <Panel
        title="Ứng viên chuyển từ Tuyển dụng"
        icon={ClipboardList}
        noPad
        actions={
          <>
            <span className="relative">
              <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Mã phiếu, ứng viên, cấp trên…" className={`${erp.input} h-7 w-52 pl-7 text-[12px]`} />
            </span>
            <select value={block} onChange={(e) => setBlock(e.target.value)} className={`${erp.input} h-7 w-28 text-[12px] cursor-pointer`}>
              <option value="">Mọi khối</option>
              {blocks.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <select value={etype} onChange={(e) => setEtype(e.target.value)} className={`${erp.input} h-7 w-32 text-[12px] cursor-pointer`} data-testid="filter-employee-type">
              <option value="">Mọi đối tượng</option>
              {EMPLOYEE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select value={company} onChange={(e) => setCompany(e.target.value)} className={`${erp.input} h-7 w-32 text-[12px] cursor-pointer`}>
              <option value="">Mọi công ty</option>
              {COMPANIES.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </>
        }
        footer={`${rows.length} / ${all.length} ứng viên · Nguồn: email TA “Gửi thông tin sang HCNS” ở popup Gửi mail của Tuyển dụng`}
      >
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${erp.th} w-8 text-center`}>
                  <input
                    type="checkbox"
                    checked={allOn}
                    disabled={!selectable.length}
                    title="Chọn tất cả ứng viên chờ Accept"
                    onChange={() => setSel(allOn ? [] : selectable.map((r) => r.id))}
                    className="w-4 h-4 accent-[#1f5fa8] cursor-pointer"
                    data-testid="select-all"
                  />
                </th>
                {['Mã phiếu', 'Ứng viên', 'Đối tượng', 'Vị trí · Level', 'Khối · Công ty', 'Cấp trên trực tiếp', 'Ngày onboard', 'Trạng thái', 'Bước hiện tại', 'Tiến độ', 'TA gửi', 'Thao tác'].map((h) => (
                  <th key={h} className={`${erp.th} text-left`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={13} className={`${erp.td} text-center text-slate-400 py-6`}>
                    Không có ứng viên phù hợp bộ lọc.
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const pending = r.status === 'Chờ HCNS duyệt';
                const missing = missingForApprove(r);
                const on = selected.includes(r.id);
                return (
                  <tr key={r.id} className={`${erp.tr} cursor-pointer ${on ? '!bg-[#eaf2fc]' : ''}`} onClick={() => onOpen(r.id)} data-testid={`row-${r.id}`}>
                    <td className={`${erp.td} text-center`} onClick={(e) => e.stopPropagation()}>
                      {pending && <input type="checkbox" checked={on} onChange={() => toggle(r.id)} className="w-4 h-4 accent-[#1f5fa8] cursor-pointer" data-testid={`sel-${r.id}`} />}
                    </td>
                    <td className={`${erp.td} ${erp.code} whitespace-nowrap`}>{r.id}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      <p className="font-semibold text-slate-800">{r.data.fullName}</p>
                      <p className="text-[11px] text-slate-500">{r.candidateEmail}</p>
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`} data-testid={`etype-${r.id}`}>
                      <EmployeeTypeTag type={r.data.employeeType} />
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      <p>{r.data.position}</p>
                      <p className="text-[11px] text-slate-500">{r.data.level || <span className="text-rose-600">thiếu level</span>}</p>
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      <p>{r.block}</p>
                      <p className="text-[11px] text-slate-500">{r.company}</p>
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>{r.data.manager || <span className="text-rose-600">—</span>}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      {dmy(r.data.startDate)} <DaysTag iso={r.data.startDate} muted={isClosed(r) || r.status === 'Đã onboard'} />
                    </td>
                    <td className={erp.td}>
                      <OnbStatusTag status={r.status} />
                      {pending && missing.length > 0 && (
                        <span className="ml-1" title={`Thiếu: ${missing.join(', ')}`}>
                          <Tag cls={TAG.rose}>Thiếu {missing.length}</Tag>
                        </span>
                      )}
                    </td>
                    <td className={erp.td}>
                      <WaitTag record={r} />
                    </td>
                    <td className={erp.td}>{r.tasks?.length ? <ProgressTag record={r} /> : <span className="text-slate-400">—</span>}</td>
                    <td className={`${erp.td} whitespace-nowrap text-slate-600`}>
                      <p>{dmyhm(r.sentAt)}</p>
                      <p className="text-[11px] text-slate-500">
                        {r.taPic}
                        {r.version > 1 && ` · cập nhật ×${r.version - 1}`}
                      </p>
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`} onClick={(e) => e.stopPropagation()}>
                      <button type="button" onClick={() => onOpen(r.id)} className="text-[#1f5fa8] underline cursor-pointer mr-2">
                        Xem
                      </button>
                      {r.status === 'Đang onboard' && (
                        <button type="button" onClick={() => setCancelId(r.id)} className="text-rose-600 font-bold underline cursor-pointer" data-testid={`cancel-${r.id}`}>
                          Cancel offer
                        </button>
                      )}
                      {pending && (
                        <>
                          <button type="button" onClick={() => (setSel([r.id]), setModal('accept'))} className="text-emerald-700 font-bold underline cursor-pointer mr-2">
                            Accept
                          </button>
                          <button type="button" onClick={() => (setSel([r.id]), setModal('reject'))} className="text-rose-600 font-bold underline cursor-pointer">
                            Reject
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

      <BulkAcceptModal
        open={modal === 'accept'}
        records={selRecs}
        onClose={() => setModal('')}
        onOpen={(id) => (setModal(''), onOpen(id))}
        onConfirm={() => {
          const res = hrApproveMany(selected);
          setModal('');
          setSel([]);
          toast(
            `Đã Accept ${res.done.length} ứng viên — đã tạo nhân viên trong Employees và gửi link form` + (res.skipped.length ? ` · bỏ qua ${res.skipped.length} phiếu thiếu thông tin` : ''),
          );
        }}
      />
      {cancelRec && <CancelOfferModal record={cancelRec} onClose={() => setCancelId('')} toast={toast} />}
      <RejectModal
        open={modal === 'reject'}
        records={selRecs}
        onClose={() => setModal('')}
        onReject={(reason) => {
          hrRejectMany(selected, reason);
          setModal('');
          setSel([]);
          toast(`Đã Reject ${selRecs.length} ứng viên — đã báo lại Tuyển dụng`);
        }}
      />
    </>
  );
};

// ==========================================================================
// IT — yêu cầu cấp tài khoản
// ==========================================================================
const ItList: React.FC<{ rows: OnbRecord[]; onOpen: (id: string) => void; toast: Toast }> = ({ rows: all, onOpen, toast }) => {
  const [tab, setTab] = useState<'wait' | 'done' | 'all'>('wait');
  const [open, setOpen] = useState('');
  const reqs = all.filter((r) => !isClosed(r) && taskOf(r, 'itAccount').status !== 'Chưa bắt đầu');
  const waiting = reqs.filter((r) => taskOf(r, 'itAccount').status === 'Đang thực hiện');
  const done = reqs.filter((r) => taskOf(r, 'itAccount').status === 'Đã hoàn thành');
  const rows = (tab === 'wait' ? waiting : tab === 'done' ? done : reqs).sort((a, b) => a.data.startDate.localeCompare(b.data.startDate));
  const rec = all.find((r) => r.id === open);
  const cancels = all.filter((r) => r.itCancel).sort((a, b) => (a.itCancel!.status === 'Chờ IT huỷ' ? 0 : 1) - (b.itCancel!.status === 'Chờ IT huỷ' ? 0 : 1) || b.itCancel!.requestedAt.localeCompare(a.itCancel!.requestedAt));
  const [cancelOf, setCancelOf] = useState('');
  const cancelRec = all.find((r) => r.id === cancelOf);
  return (
    <>
      {cancels.length > 0 && (
        <Panel title={`Yêu cầu huỷ tài khoản — ứng viên Cancel offer (${cancels.filter((r) => r.itCancel!.status === 'Chờ IT huỷ').length} chờ xử lý)`} icon={XCircle} noPad>
          <div className="overflow-x-auto">
            <table className={erp.table}>
              <thead>
                <tr>
                  {['Mã phiếu', 'Họ và tên', 'Khối · Công ty', 'Cần huỷ', 'Email', 'Tên tài khoản', 'Lý do Cancel offer', 'Nhận yêu cầu', 'Trạng thái', 'Thao tác'].map((h) => (
                    <th key={h} className={`${erp.th} text-left`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cancels.map((r) => {
                  const c = r.itCancel!;
                  return (
                    <tr key={r.id} className={erp.tr} data-testid={`it-cancel-row-${r.id}`}>
                      <td className={`${erp.td} ${erp.code} whitespace-nowrap`}>{r.id}</td>
                      <td className={`${erp.td} whitespace-nowrap font-semibold text-slate-800`}>{r.data.fullName}</td>
                      <td className={`${erp.td} whitespace-nowrap`}>
                        {r.block} · {r.company}
                      </td>
                      <td className={`${erp.td} whitespace-nowrap`}>{c.kind === 'account' ? 'Tài khoản đã cấp' : 'Yêu cầu cấp tài khoản'}</td>
                      <td className={`${erp.td} font-mono text-[12px]`}>{c.email || <span className="text-slate-400">—</span>}</td>
                      <td className={`${erp.td} font-mono text-[12px]`}>{c.accountName || <span className="text-slate-400">—</span>}</td>
                      <td className={`${erp.td} text-[12px] max-w-[240px]`}>{r.cancelReason || '—'}</td>
                      <td className={`${erp.td} whitespace-nowrap text-slate-600`}>{dmyhm(c.requestedAt)}</td>
                      <td className={erp.td}>
                        <Tag cls={c.status === 'Đã huỷ' ? TAG.green : TAG.rose}>{c.status === 'Đã huỷ' ? (c.kind === 'account' ? 'Đã huỷ tài khoản' : 'Đã huỷ yêu cầu') : 'Chờ IT huỷ'}</Tag>
                        {c.doneAt && <p className="text-[11px] text-slate-500">{c.doneBy} · {dmyhm(c.doneAt)}</p>}
                      </td>
                      <td className={`${erp.td} whitespace-nowrap`}>
                        {c.status === 'Chờ IT huỷ' && (
                          <button type="button" onClick={() => setCancelOf(r.id)} className="text-rose-600 font-bold underline cursor-pointer mr-2" data-testid={`it-cancel-${r.id}`}>
                            {c.kind === 'account' ? 'Đã huỷ tài khoản' : 'Đã huỷ yêu cầu'}
                          </button>
                        )}
                        <button type="button" onClick={() => onOpen(r.id)} className="text-slate-500 underline cursor-pointer">
                          Phiếu
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
      {cancelRec && <ItCancelModal record={cancelRec} onClose={() => setCancelOf('')} toast={toast} />}
      <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-slate-600">
        <ShieldCheck size={15} className="text-[#1f5fa8]" />
        <span className="flex-1">
          Yêu cầu tự gửi tới <b>{IT_MAILBOX}</b> khi ứng viên submit form (gồm Họ và tên, Khối, Cấp trên trực tiếp, Công ty). IT trả <b>email, tên tài khoản, mật khẩu</b> → ghi vào Employees và tự báo MarCom.
        </span>
      </div>
      <Panel
        title="Yêu cầu cấp tài khoản"
        icon={KeyRound}
        noPad
        actions={
          <div className="inline-flex border border-slate-300 rounded-[3px] overflow-hidden bg-white">
            {(
              [
                ['wait', `Chờ xử lý (${waiting.length})`],
                ['done', `Đã trả (${done.length})`],
                ['all', `Tất cả (${reqs.length})`],
              ] as const
            ).map(([k, l], i) => (
              <button key={k} type="button" onClick={() => setTab(k)} className={`h-7 px-3 text-[12px] cursor-pointer ${i ? 'border-l border-slate-300' : ''} ${tab === k ? 'bg-[#1f5fa8] text-white font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                {l}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                {['Mã phiếu', 'Họ và tên', 'Khối', 'Cấp trên trực tiếp', 'Công ty', 'Ngày onboard', 'Nhận yêu cầu', 'Trạng thái', 'Email', 'Tên tài khoản', 'Mật khẩu', 'Thao tác'].map((h) => (
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
                    {tab === 'wait' ? 'Không có yêu cầu nào đang chờ IT.' : 'Không có dữ liệu.'}
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const t = taskOf(r, 'itAccount');
                const req = t.itReq;
                return (
                  <tr key={r.id} className={erp.tr} data-testid={`it-row-${r.id}`}>
                    <td className={`${erp.td} ${erp.code} whitespace-nowrap`}>{r.id}</td>
                    <td className={`${erp.td} whitespace-nowrap font-semibold text-slate-800`}>{req?.fullName || r.data.fullName}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{req?.block || r.block}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{req?.manager || r.data.manager}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{req?.company || r.company}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      {dmy(r.data.startDate)} <DaysTag iso={r.data.startDate} muted={r.status === 'Đã onboard'} />
                    </td>
                    <td className={`${erp.td} whitespace-nowrap text-slate-600`}>{req ? dmyhm(req.sentAt) : '—'}</td>
                    <td className={erp.td}>
                      <Tag cls={TASK_STATUS_CLS[t.status]}>{t.status === 'Đã hoàn thành' ? 'Đã trả' : 'Chờ IT'}</Tag>
                    </td>
                    <td className={`${erp.td} font-mono text-[12px]`}>{t.itRet?.email || <span className="text-slate-400">—</span>}</td>
                    <td className={`${erp.td} font-mono text-[12px]`}>{t.itRet?.accountName || <span className="text-slate-400">—</span>}</td>
                    <td className={erp.td}>{t.itRet ? <Secret value={t.itRet.password} onCopy={() => toast('Đã sao chép mật khẩu')} /> : <span className="text-slate-400">—</span>}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      {t.status === 'Đang thực hiện' ? (
                        <button type="button" onClick={() => setOpen(r.id)} className="text-emerald-700 font-bold underline cursor-pointer mr-2" data-testid={`it-return-${r.id}`}>
                          Trả thông tin
                        </button>
                      ) : (
                        <button type="button" onClick={() => setOpen(r.id)} className="text-[#1f5fa8] underline cursor-pointer mr-2">
                          Xem
                        </button>
                      )}
                      <button type="button" onClick={() => onOpen(r.id)} className="text-slate-500 underline cursor-pointer">
                        Phiếu
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
      {rec && <ItReturnModal open record={rec} onClose={() => setOpen('')} toast={toast} />}
    </>
  );
};

// ==========================================================================
// MarCom — Welcome Onboard
// ==========================================================================
const MarcomList: React.FC<{ rows: OnbRecord[]; onOpen: (id: string) => void; toast: Toast; onNavigate?: Nav }> = ({ rows: all, onOpen, toast, onNavigate }) => {
  const [open, setOpen] = useState('');
  const rows = all.filter((r) => !isClosed(r) && taskOf(r, 'marcom').status !== 'Chưa bắt đầu').sort((a, b) => a.data.startDate.localeCompare(b.data.startDate));
  const waiting = rows.filter((r) => taskOf(r, 'marcom').status === 'Đang thực hiện').length;
  const rec = all.find((r) => r.id === open);
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-slate-600">
        <Hand size={15} className="text-rose-600" />
        <span className="flex-1">
          Nhân sự mới đã có tài khoản IT — hệ thống tự báo <b>{MARCOM_MAILBOX}</b>. MarCom chuẩn bị Welcome (email chào mừng, welcome kit) rồi bấm xác nhận.
        </span>
        {onNavigate && (
          <Btn icon={Hand} onClick={() => onNavigate('Welcome Onboard')}>
            Mở màn Welcome Onboard
          </Btn>
        )}
      </div>
      <Panel title={`Nhân sự mới cần Welcome (${waiting} chờ)`} icon={Hand} noPad>
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                {['Mã phiếu', 'Họ và tên', 'Vị trí', 'Khối · Phòng ban', 'Cấp trên trực tiếp', 'Công ty', 'Ngày onboard', 'Email công ty', 'Trạng thái', 'Thao tác'].map((h) => (
                  <th key={h} className={`${erp.th} text-left`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={10} className={`${erp.td} text-center text-slate-400 py-6`}>
                    Chưa có nhân sự mới nào cần Welcome trong khoảng thời gian này.
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const t = taskOf(r, 'marcom');
                return (
                  <tr key={r.id} className={erp.tr}>
                    <td className={`${erp.td} ${erp.code} whitespace-nowrap`}>{r.id}</td>
                    <td className={`${erp.td} whitespace-nowrap font-semibold text-slate-800`}>{r.data.fullName}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{r.data.position}</td>
                    <td className={`${erp.td} max-w-[220px] truncate`} title={r.data.department}>
                      {r.block} · {r.data.department}
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>{r.data.manager}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{r.company}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      {dmy(r.data.startDate)} <DaysTag iso={r.data.startDate} muted={r.status === 'Đã onboard'} />
                    </td>
                    <td className={`${erp.td} font-mono text-[12px]`}>{r.account.companyEmail}</td>
                    <td className={erp.td}>
                      <Tag cls={TASK_STATUS_CLS[t.status]}>{t.status === 'Đã hoàn thành' ? 'Đã chuẩn bị' : 'Chờ MarCom'}</Tag>
                      {t.doneBy && <p className="text-[11px] text-slate-500">{t.doneBy}</p>}
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      {t.status === 'Đang thực hiện' && (
                        <button type="button" onClick={() => setOpen(r.id)} className="text-emerald-700 font-bold underline cursor-pointer mr-2">
                          Xác nhận
                        </button>
                      )}
                      <button type="button" onClick={() => onOpen(r.id)} className="text-[#1f5fa8] underline cursor-pointer">
                        Phiếu
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
      {rec && <MarcomDoneModal open record={rec} onClose={() => setOpen('')} toast={toast} />}
    </>
  );
};

// ==========================================================================
// CHI TIẾT PHIẾU
// ==========================================================================
type Tab = 'info' | 'checklist' | 'history' | 'mails';

const DetailView: React.FC<{ id: string; onBack: () => void; toast: Toast; onNavigate?: Nav; onOpenForm: (id: string) => void }> = ({ id, onBack, toast, onNavigate, onOpenForm }) => {
  const { find, hrApprove, hrReject, toggleChecklist, hrSave } = useOnboarding();
  const r = find(id);
  const [tab, setTab] = useState<Tab>('info');
  const [mailView, setMailView] = useState<OnbMail | null>(null);
  const [itCancelOpen, setItCancelOpen] = useState(false);
  const [modal, setModal] = useState<'' | 'approve' | 'reject' | 'cancel' | 'date' | 'edit'>('');
  if (!r) return null;

  const done = r.checklist.filter((c) => c.done).length;
  const changedLabels = new Set(r.lastChanges.map((c) => c.field));
  const formTask = taskOf(r, 'personalForm');
  const itTask = taskOf(r, 'itAccount');

  const actions: React.ReactNode[] = [];
  const editBtn = (
    <Btn key="edit" icon={Pencil} onClick={() => setModal('edit')} data-testid="detail-edit">
      Sửa
    </Btn>
  );
  if (r.status === 'Chờ HCNS duyệt') {
    actions.push(
      <Btn key="reject" variant="danger" icon={XCircle} onClick={() => setModal('reject')}>
        Reject
      </Btn>,
      editBtn,
      <Btn key="approve" variant="success" icon={ClipboardCheck} onClick={() => setModal('approve')} data-testid="detail-accept">
        Accept
      </Btn>,
    );
  }
  if (r.status === 'Đang onboard') {
    if (formTask.status === 'Đang thực hiện')
      actions.push(
        <Btn
          key="copy"
          icon={Copy}
          onClick={() => {
            void navigator.clipboard?.writeText(formTask.formLink || '').catch(() => undefined);
            toast('Đã sao chép link form');
          }}
        >
          Sao chép link form
        </Btn>,
        <Btn key="form" variant="primary" icon={ClipboardList} onClick={() => onOpenForm(r.id)}>
          Mở link form (ứng viên)
        </Btn>,
      );
    actions.push(
      editBtn,
      <Btn key="cancel" variant="danger" icon={XCircle} onClick={() => setModal('cancel')} data-testid="detail-cancel-offer">
        Cancel offer
      </Btn>,
    );
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
          </>
        }
        actions={<>{actions}</>}
      />

      <Panel title="Tiến trình onboard" icon={ClipboardCheck}>
        <OnbStepper record={r} />
      </Panel>

      {(r.status === 'Đang onboard' || r.status === 'Đã onboard' || ((r.status === 'Huỷ onboard' || r.status === 'Cancel offer') && (r.tasks || []).length > 0)) && (
        <OnbProgressPanel record={r} toast={toast} onOpenEmployee={() => onNavigate?.('Employees')} onOpenForm={() => onOpenForm(r.id)} onOpenWelcome={onNavigate ? () => onNavigate('Welcome Onboard') : undefined} />
      )}

      {r.itCancel && (
        <div className={`flex flex-wrap items-center gap-3 px-3 py-2 rounded-[4px] border text-[12.5px] ${r.itCancel.status === 'Đã huỷ' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'}`} data-testid="it-cancel-notice">
          <XCircle size={15} className="shrink-0" />
          <span className="flex-1 min-w-[240px]">
            {r.itCancel.status === 'Đã huỷ' ? (
              <>
                IT đã {r.itCancel.kind === 'account' ? <>huỷ tài khoản <b className="font-mono">{r.itCancel.email}</b></> : 'huỷ yêu cầu cấp tài khoản'} — {r.itCancel.doneBy} · {dmyhm(r.itCancel.doneAt || '')}
                {r.itCancel.note ? ` · ${r.itCancel.note}` : ''}.
              </>
            ) : (
              <>
                Đã email {IT_MAILBOX} lúc {dmyhm(r.itCancel.requestedAt)} đề nghị {r.itCancel.kind === 'account' ? <>huỷ tài khoản <b className="font-mono">{r.itCancel.email}</b>{r.itCancel.accountName ? ` (${r.itCancel.accountName})` : ''}</> : 'huỷ yêu cầu cấp tài khoản'} — chờ IT xác nhận.
              </>
            )}
          </span>
          {r.itCancel.status === 'Chờ IT huỷ' && (
            <Btn variant="danger" icon={XCircle} className="h-7" onClick={() => setItCancelOpen(true)} data-testid="detail-it-cancel">
              IT xác nhận đã huỷ
            </Btn>
          )}
        </div>
      )}
      {itCancelOpen && <ItCancelModal record={r} onClose={() => setItCancelOpen(false)} toast={toast} />}

      {itTask.itRet && (
        <Panel title={r.itCancel?.status === 'Đã huỷ' && r.itCancel.kind === 'account' ? 'Tài khoản IT đã cấp (đã huỷ)' : 'Tài khoản IT đã cấp'} icon={KeyRound}>
          <FieldTable
            labelWidth="30%"
            rows={[
              { label: 'Email', value: <span className="font-mono">{itTask.itRet.email}</span> },
              { label: 'Tên tài khoản', value: <span className="font-mono">{itTask.itRet.accountName}</span> },
              { label: 'Mật khẩu', value: <Secret value={itTask.itRet.password} onCopy={() => toast('Đã sao chép mật khẩu')} /> },
              { label: 'Người cấp', value: `${itTask.itRet.by} · ${dmyhm(itTask.itRet.at)}` },
            ]}
          />
        </Panel>
      )}

      <div className="bg-white border border-slate-300 rounded-[4px] overflow-hidden">
        <div className="pt-1.5 bg-[#f3f6fa]">
          <FolderTabs<Tab>
            value={tab}
            onChange={setTab}
            tabs={[
              { key: 'info', label: 'Thông tin bàn giao', icon: Users },
              { key: 'checklist', label: `Checklist onboard (${done}/${r.checklist.length || 11})`, icon: ClipboardList },
              { key: 'history', label: `Lịch sử (${r.history.length})`, icon: History },
              { key: 'mails', label: `Email (${r.mails.length})`, icon: Mail },
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
                    { label: 'Đối tượng', value: mark(HANDOFF_LABELS.employeeType, <EmployeeTypeTag type={r.data.employeeType} />) },
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
                        <span className="inline-flex items-center gap-1 text-[#1f5fa8] underline cursor-pointer">
                          <Paperclip size={12} /> {r.data.evidenceFile}
                        </span>
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
              <HrPanel record={r} onSave={(p) => (hrSave(r.id, p), toast('Đã lưu thông tin HCNS'))} />
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
                      <Tag cls={{ TA: TAG.blue, HCNS: TAG.violet, 'Ứng viên': TAG.green, IT: TAG.amber, MarCom: TAG.rose, 'Hệ thống': TAG.slate }[h.role]}>{h.role}</Tag>
                    </td>
                    <td className={`${erp.td} font-semibold`}>{h.action}</td>
                    <td className={erp.td}>
                      {h.note && <p className="text-slate-700 break-all">{h.note}</p>}
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
                      <Tag
                        cls={
                          m.kind === 'Báo huỷ onboard' || m.kind === 'HCNS từ chối'
                            ? TAG.rose
                            : m.kind === 'Cập nhật thông tin onboard' || m.kind === 'Mail IT cấp tài khoản'
                              ? TAG.amber
                              : m.kind === 'Form onboarding cho ứng viên' || m.kind === 'IT trả thông tin tài khoản'
                                ? TAG.green
                                : TAG.blue
                        }
                      >
                        {m.template || m.kind}
                      </Tag>
                    </td>
                    <td className={erp.td}>
                      {m.body ? (
                        <button type="button" onClick={() => setMailView(m)} className="text-left text-[#1f5fa8] hover:underline cursor-pointer" title="Xem nội dung email">
                          {m.subject}
                        </button>
                      ) : (
                        m.subject
                      )}
                    </td>
                    <td className={`${erp.td} font-mono text-[12px]`}>{m.to}</td>
                    <td className={erp.td}>{m.cc.join(', ') || <span className="text-slate-400">—</span>}</td>
                    <td className={erp.td}>{m.attachments.join(', ') || <span className="text-slate-400">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Modal open={!!mailView} onClose={() => setMailView(null)} title={mailView?.template || mailView?.kind || ''} width="max-w-2xl" footer={<Btn onClick={() => setMailView(null)}>Đóng</Btn>}>
            {mailView && (
              <div className="space-y-2.5">
                <FieldTable
                  labelWidth="18%"
                  rows={[
                    { label: 'Thời gian', value: dmyhm(mailView.at) },
                    { label: 'Đến', value: <span className="font-mono">{mailView.to}</span> },
                    { label: 'CC', value: mailView.cc.join(', ') },
                    { label: 'Tiêu đề', value: <b>{mailView.subject}</b> },
                    { label: 'Đính kèm', value: mailView.attachments.length ? <span className="inline-flex flex-wrap gap-1.5">{mailView.attachments.map((a) => <span key={a} className="inline-flex items-center gap-1 px-1.5 py-px border border-slate-300 rounded-[3px] bg-slate-50 text-[12px]"><Paperclip size={11} /> {a}</span>)}</span> : '' },
                  ]}
                />
                <div className="border border-slate-200 rounded-[3px] px-3 py-2.5 text-[13px] leading-relaxed whitespace-pre-line bg-white">{mailView.body}</div>
              </div>
            )}
          </Modal>
        </div>
      </div>

      <ApproveModal
        open={modal === 'approve'}
        record={r}
        onClose={() => setModal('')}
        onApprove={(p) => {
          hrApprove(r.id, p);
          setModal('');
          toast(`Đã Accept ${r.data.fullName} — đã tạo nhân viên trong Employees và gửi link form`);
        }}
      />
      {modal === 'cancel' && <CancelOfferModal record={r} onClose={() => setModal('')} toast={toast} />}
      {modal === 'date' && <ChangeStartDateModal record={r} onClose={() => setModal('')} toast={toast} />}
      {modal === 'edit' && <EditCandidateModal record={r} onClose={() => setModal('')} toast={toast} />}
      <RejectModal
        open={modal === 'reject'}
        records={[r]}
        onClose={() => setModal('')}
        onReject={(reason) => {
          hrReject(r.id, reason);
          setModal('');
          toast(`Đã Reject ${r.data.fullName}`);
        }}
      />
    </>
  );
};

/** Ô để trống (không hiện "—") cho tới khi đã tạo xong. */
const blank = (v: React.ReactNode) => (v === '' || v == null ? <span /> : v);

/** Khối HCNS xử lý — sửa Loại HĐ / Công ty / ghi chú khi phiếu chưa Accept. */
const HrPanel: React.FC<{ record: OnbRecord; onSave: (p: { contractType: string; company: string; hrNote: string }) => void }> = ({ record: r, onSave }) => {
  const editable = r.status === 'Chờ HCNS duyệt';
  const [ct, setCt] = useState(r.contractType);
  const [co, setCo] = useState(r.company);
  const [note, setNote] = useState(r.hrNote);
  const dirty = ct !== r.contractType || note !== r.hrNote || co !== r.company;
  const acc = r.account;
  return (
    <Panel
      title="HCNS xử lý"
      icon={UserCheck}
      actions={
        editable && (
          <Btn className="h-7" variant="primary" disabled={!dirty} onClick={() => onSave({ contractType: ct, company: co, hrNote: note })}>
            Lưu
          </Btn>
        )
      }
    >
      {editable ? (
        <div className="space-y-2.5">
          <FormRow label="Công ty" hint="Gửi kèm yêu cầu IT">
            <CatalogSelect value={co} options={COMPANIES} onChange={setCo} />
          </FormRow>
          <FormRow label="Loại hợp đồng" hint="Không chặn Accept">
            <CatalogSelect value={ct} options={CONTRACT_TYPES} onChange={setCt} />
          </FormRow>
          <FormRow label="Ghi chú HCNS">
            <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
          </FormRow>
        </div>
      ) : (
        <FieldTable
          rows={[
            { label: 'Công ty', value: r.company },
            { label: 'Loại hợp đồng', value: r.contractType },
            { label: 'Ghi chú HCNS', value: r.hrNote },
            { label: 'Người Accept', value: r.decidedBy && (r.status === 'Đang onboard' || r.status === 'Đã onboard') ? `${r.decidedBy} · ${dmyhm(r.decidedAt || '')}` : '' },
            { label: 'Nhân viên (Employees)', value: blank(acc.employeeCode ? <b>{acc.employeeCode}</b> : '') },
            { label: 'Tên tài khoản', value: blank(acc.userName || '') },
            { label: 'Email công ty', value: blank(acc.companyEmail || '') },
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
        <Info size={15} /> Checklist onboard (11 mục: Phòng ban 4 · IT 4 · HCTH 3) được tạo khi HCNS Accept.
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
const AcceptEffects: React.FC<{ emails: string[] }> = ({ emails }) => (
  <div className="bg-[#eef4fb] border border-[#b9d3f0] rounded-[4px] px-3 py-2 text-[12px] text-[#1e3a5f]">
    <p className="font-bold mb-1">Khi Accept, hệ thống sẽ:</p>
    <ul className="list-disc pl-4 space-y-0.5">
      <li>Tạo nhân viên trong Employees (trạng thái Thử việc).</li>
      <li>Gửi email kèm link form thông tin cá nhân tới {emails.length === 1 ? emails[0] : `${emails.length} ứng viên`}.</li>
      <li>Khi ứng viên submit form: đổ dữ liệu vào Employees và gửi yêu cầu tới {IT_MAILBOX} (Họ và tên, Khối, Cấp trên trực tiếp, Công ty).</li>
      <li>Khi IT trả email, tên tài khoản, mật khẩu: tự báo {MARCOM_MAILBOX} chuẩn bị Welcome Onboard.</li>
      <MailPlan />
      <li>Gửi xong các email ngày onboard → phiếu chuyển Đã onboard.</li>
    </ul>
  </div>
);
/** Lịch email gửi ứng viên theo đối tượng — lấy từ màn Thiết lập email Onboarding. */
const MailPlan: React.FC = () => {
  const { mailTemplates } = useOnboarding();
  return (
    <>
      {(['Nội bộ', 'Staffing'] as const).map((t) => (
        <li key={t}>
          <b>{t}</b>:{' '}
          {templatesFor(mailTemplates, t)
            .filter((x) => x.trigger !== 'accept')
            .map((x) => `${x.name} (${timingText(x)} → ${x.to === 'company' ? 'email công ty' : 'email cá nhân'})`)
            .join(' · ') || 'chưa bật email nào'}
          .
        </li>
      ))}
    </>
  );
};

/** Accept 1 phiếu — cho bổ sung trường bắt buộc. */
const ApproveModal: React.FC<{
  open: boolean;
  record: OnbRecord;
  onClose: () => void;
  onApprove: (p: { data: Partial<HandoffData>; contractType: string; company: string; hrNote: string }) => void;
}> = ({ open, record: r, onClose, onApprove }) => {
  const [data, setData] = useState<Partial<HandoffData>>({});
  const [ct, setCt] = useState('');
  const [co, setCo] = useState('');
  const [note, setNote] = useState('');
  const [openedFor, setOpenedFor] = useState('');
  if (open && openedFor !== `${r.id}-${r.version}`) {
    setOpenedFor(`${r.id}-${r.version}`);
    setData({ startDate: r.data.startDate, department: r.data.department, position: r.data.position, level: r.data.level, manager: r.data.manager });
    setCt(r.contractType || 'Thử việc');
    setCo(r.company);
    setNote(r.hrNote);
  }
  if (!open && openedFor) setOpenedFor('');
  const merged = { data: { ...r.data, ...data }, contractType: ct };
  const missing = missingForApprove(merged);
  const set = (k: keyof HandoffData, v: string) => setData((d) => ({ ...d, [k]: v }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      width="max-w-2xl"
      title={`Accept ứng viên — ${r.data.fullName}`}
      footer={
        <>
          <Btn onClick={onClose}>Huỷ</Btn>
          <Btn variant="success" icon={ClipboardCheck} disabled={missing.length > 0 || !co} onClick={() => onApprove({ data, contractType: ct, company: co, hrNote: note })} data-testid="accept-confirm">
            Accept
          </Btn>
        </>
      }
    >
      <div className="space-y-3">
        <FieldTable
          labelWidth="34%"
          rows={[
            { label: 'Ứng viên', value: `${r.data.fullName} · ${r.candidateEmail}` },
            { label: 'Đối tượng', value: <EmployeeTypeTag type={r.data.employeeType} /> },
            { label: 'Lương chính thức / thử việc', value: `${fieldText('officialSalary', r.data)} · ${fieldText('probationMonths', r.data)} × ${fieldText('probationPercent', r.data)}` },
          ]}
        />
        <div className="border border-slate-300 rounded-[4px] p-3 space-y-2.5">
          <p className="text-[12px] font-bold uppercase tracking-wide text-[#1e3a5f]">Thông tin tạo nhân viên & gửi IT</p>
          <FormRow label="Ngày onboard" required error={!merged.data.startDate ? 'Bắt buộc' : undefined}>
            <input type="date" value={merged.data.startDate} onChange={(e) => set('startDate', e.target.value)} className={erp.inputFull} />
          </FormRow>
          <FormRow label="Công ty" required error={!co ? 'Bắt buộc' : undefined}>
            <CatalogSelect value={co} options={COMPANIES} onChange={setCo} />
          </FormRow>
          <FormRow label="Phòng ban" required error={!merged.data.department ? 'Bắt buộc' : undefined}>
            <CatalogSelect value={merged.data.department} options={departmentsOf(r.block)} onChange={(v) => set('department', v)} />
          </FormRow>
          <FormRow label="Vị trí" required error={!merged.data.position ? 'Bắt buộc' : undefined}>
            <CatalogSelect value={merged.data.position} options={HR_POSITIONS} onChange={(v) => set('position', v)} />
          </FormRow>
          <FormRow label="Cấp bậc" required error={!merged.data.level ? 'Bắt buộc' : undefined}>
            <CatalogSelect value={merged.data.level} options={HR_LEVELS} onChange={(v) => set('level', v)} />
          </FormRow>
          <FormRow label="Cấp trên trực tiếp" required error={!merged.data.manager ? 'Bắt buộc' : undefined}>
            <CatalogSelect value={merged.data.manager} options={STAFF_NAMES} onChange={(v) => set('manager', v)} />
          </FormRow>
          <FormRow label="Loại hợp đồng">
            <CatalogSelect value={ct} options={CONTRACT_TYPES} onChange={setCt} />
          </FormRow>
          <FormRow label="Ghi chú HCNS">
            <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
          </FormRow>
        </div>
        <AcceptEffects emails={[r.candidateEmail]} />
      </div>
    </Modal>
  );
};

/** Accept nhiều ứng viên — phiếu thiếu trường bắt buộc bị bỏ qua (mở phiếu để bổ sung). */
const BulkAcceptModal: React.FC<{ open: boolean; records: OnbRecord[]; onClose: () => void; onConfirm: () => void; onOpen: (id: string) => void }> = ({ open, records, onClose, onConfirm, onOpen }) => {
  const ready = records.filter((r) => !missingForApprove(r).length);
  const blocked = records.filter((r) => missingForApprove(r).length);
  return (
    <Modal
      open={open}
      onClose={onClose}
      width="max-w-3xl"
      title={`Accept ${records.length} ứng viên`}
      footer={
        <>
          <Btn onClick={onClose}>Huỷ</Btn>
          <Btn variant="success" icon={ClipboardCheck} disabled={!ready.length} onClick={onConfirm} data-testid="bulk-accept-confirm">
            Accept {ready.length} ứng viên
          </Btn>
        </>
      }
    >
      <div className="space-y-3">
        <table className={erp.table}>
          <thead>
            <tr>
              {['Ứng viên', 'Khối · Công ty', 'Cấp trên trực tiếp', 'Ngày onboard', 'Kiểm tra'].map((h) => (
                <th key={h} className={`${erp.th} text-left`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => {
              const m = missingForApprove(r);
              return (
                <tr key={r.id} className={erp.tr}>
                  <td className={erp.td}>
                    <p className="font-semibold">{r.data.fullName}</p>
                    <p className="text-[11px] text-slate-500">{r.data.position}</p>
                  </td>
                  <td className={`${erp.td} whitespace-nowrap`}>
                    {r.block} · {r.company}
                  </td>
                  <td className={erp.td}>{r.data.manager || '—'}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{dmy(r.data.startDate)}</td>
                  <td className={erp.td}>
                    {m.length ? (
                      <span className="inline-flex flex-wrap items-center gap-1.5">
                        <Tag cls={TAG.rose}>Thiếu: {m.join(', ')}</Tag>
                        <button type="button" className="text-[#1f5fa8] underline cursor-pointer text-[12px]" onClick={() => onOpen(r.id)}>
                          Mở phiếu bổ sung
                        </button>
                      </span>
                    ) : (
                      <Tag cls={TAG.green}>Đủ thông tin</Tag>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {blocked.length > 0 && (
          <p className="text-[12px] text-rose-700">
            {blocked.length} ứng viên thiếu thông tin bắt buộc sẽ <b>không</b> được Accept lần này — mở phiếu để bổ sung rồi Accept riêng.
          </p>
        )}
        <AcceptEffects emails={ready.map((r) => r.candidateEmail)} />
      </div>
    </Modal>
  );
};

/** Reject 1 hoặc nhiều ứng viên — lý do không bắt buộc, tối đa 500 ký tự; báo lại TA. */
const RejectModal: React.FC<{ open: boolean; records: OnbRecord[]; onClose: () => void; onReject: (reason: string) => void }> = ({ open, records, onClose, onReject }) => {
  const [reason, setReason] = useState('');
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={records.length === 1 ? `Reject ứng viên — ${records[0]?.data.fullName}` : `Reject ${records.length} ứng viên`}
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
            data-testid="reject-confirm"
          >
            Reject
          </Btn>
        </>
      }
    >
      <div className="space-y-3">
        {records.length > 1 && <p className="text-[12.5px] text-slate-700">{records.map((r) => r.data.fullName).join(', ')}</p>}
        <p className="text-[12px] text-slate-600">Phiếu chuyển sang <b>HCNS từ chối</b> và gửi email báo lại Tuyển dụng; TA có thể gửi lại thông tin (tạo yêu cầu mới).</p>
        <FormRow label="Lý do" hint={`${reason.length}/500 ký tự · không bắt buộc`}>
          <textarea rows={3} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
        </FormRow>
      </div>
    </Modal>
  );
};

/** Sửa toàn bộ thông tin ứng viên (17 trường bàn giao + email/điện thoại) — HCNS, khi phiếu chưa onboard. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EditCandidateModal: React.FC<{ record: OnbRecord; onClose: () => void; toast: Toast }> = ({ record: r, onClose, toast }) => {
  const { hrEdit } = useOnboarding();
  const rc = useRc();
  const [data, setData] = useState<HandoffData>(() => ({ ...r.data }));
  const [email, setEmail] = useState(r.candidateEmail);
  const [phone, setPhone] = useState(r.candidatePhone);
  const [reason, setReason] = useState('');
  const [tried, setTried] = useState(false);
  const base = rc.candidate(r.candidateId);
  const cand = { ...(base || {}), source: r.candidateSource, cvFile: r.cvFile, referrerName: base?.referrerName || '', taInput: base?.taInput || r.taPic } as RcCandidate;
  const req = (rc.request(r.requestId) || { block: r.block, taPics: [r.taPic] }) as RcRequest;
  const errors = validateHandoff(data, { hasCvFile: !!r.cvFile, refer: isRefer(r.candidateSource) });
  const dateMoved = data.startDate !== r.data.startDate;
  if (dateMoved && data.startDate && data.startDate < todayIso()) errors.startDate = 'Không chọn ngày đã qua';
  const emailErr = !email.trim() ? 'Bắt buộc' : !EMAIL_RE.test(email.trim()) ? 'Email không hợp lệ' : '';
  const phoneErr = !phone.trim() ? 'Bắt buộc' : !/^[0-9+ ().-]{8,15}$/.test(phone.trim()) ? 'Số điện thoại không hợp lệ' : '';
  const reasonErr = dateMoved && !reason.trim() ? 'Bắt buộc khi đổi ngày onboard' : '';
  const changes = diffHandoff(r.data, data).length + (email.trim() !== r.candidateEmail ? 1 : 0) + (phone.trim() !== r.candidatePhone ? 1 : 0);
  const accepted = r.status === 'Đang onboard';
  const save = () => {
    if (Object.keys(errors).length || emailErr || phoneErr || reasonErr) return setTried(true);
    if (!changes) {
      onClose();
      return toast('Không có thay đổi');
    }
    const n = hrEdit(r.id, { data: { ...data, fullName: data.fullName.trim() }, candidateEmail: email.trim(), candidatePhone: phone.trim() }, reason.trim());
    rc.setCandidateType(r.candidateId, data.employeeType, 'Onboarding Request');
    onClose();
    toast(`Đã lưu ${n} thay đổi thông tin ${data.fullName.trim()}`);
  };
  return (
    <Modal
      open
      onClose={onClose}
      width="max-w-4xl"
      title={`Sửa thông tin ứng viên — ${r.id}`}
      footer={
        <>
          <span className={`mr-auto text-[12px] ${tried && (Object.keys(errors).length || emailErr || phoneErr || reasonErr) ? 'text-rose-600' : 'text-slate-500'}`}>
            {tried && (Object.keys(errors).length || emailErr || phoneErr || reasonErr) ? 'Vui lòng kiểm tra các trường báo đỏ' : changes ? `${changes} trường thay đổi` : 'Chưa có thay đổi'}
          </span>
          <Btn onClick={onClose}>Đóng</Btn>
          <Btn variant="primary" icon={CheckCircle2} onClick={save} data-testid="edit-save">
            Lưu thay đổi
          </Btn>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex items-start gap-2 px-3 py-2 rounded-[4px] bg-[#eef4fb] text-[#1e3a5f] text-[12.5px]">
          <Info size={15} className="shrink-0 mt-0.5" />
          <span>
            Thay đổi được ghi vào Lịch sử và báo Tuyển dụng ({r.taPic}).
            {r.account.employeeCode && <> Hồ sơ {r.account.employeeCode} trong Employees cập nhật theo.</>}
            {accepted && <> Đổi ngày onboard sẽ dời lịch các email onboard và báo ứng viên / IT / MarCom.</>}
          </span>
        </div>
        <div className="grid grid-cols-12 gap-x-4 gap-y-3">
          <FormField label="Email cá nhân" required error={tried ? emailErr : undefined} className="col-span-12 sm:col-span-6">
            <input value={email} onChange={(e) => setEmail(e.target.value)} className={erp.inputFull} data-testid="edit-email" />
          </FormField>
          <FormField label="Điện thoại" required error={tried ? phoneErr : undefined} className="col-span-12 sm:col-span-6">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={erp.inputFull} data-testid="edit-phone" />
          </FormField>
        </div>
        <RcHcnsFields
          draft={{ data, hasOffer: true }}
          cand={cand}
          req={req}
          skillOptions={rc.options('Skill', [data.techStack])}
          onChange={(p) => setData((x) => ({ ...x, ...p }))}
          errors={errors}
          showErr={tried}
        />
        {dateMoved && (
          <FormField label={`Lý do đổi ngày onboard (${dmy(r.data.startDate)} → ${dmy(data.startDate)})`} required error={tried ? reasonErr : undefined}>
            <select value={START_DATE_REASONS.includes(reason) ? reason : reason ? 'Khác' : ''} onChange={(e) => setReason(e.target.value === 'Khác' ? ' ' : e.target.value)} className={`${erp.inputFull} cursor-pointer`} data-testid="edit-date-reason">
              <option value="">-- Chọn lý do --</option>
              {[...START_DATE_REASONS, 'Khác'].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            {reason && !START_DATE_REASONS.includes(reason) && (
              <input value={reason.trimStart()} onChange={(e) => setReason(e.target.value || ' ')} placeholder="Ghi rõ lý do" className={`${erp.inputFull} mt-1.5`} />
            )}
          </FormField>
        )}
      </div>
    </Modal>
  );
};

/** Sửa ngày onboard — ứng viên xin đổi ngày nhận việc; HCNS cập nhật, hệ thống dời lịch & báo các bên. */
const ChangeStartDateModal: React.FC<{ record: OnbRecord; onClose: () => void; toast: Toast }> = ({ record: r, onClose, toast }) => {
  const { changeStartDate } = useOnboarding();
  const [date, setDate] = useState(r.data.startDate);
  const [pick, setPick] = useState('');
  const [other, setOther] = useState('');
  const [tried, setTried] = useState(false);
  const reason = (pick === 'Khác' ? other : pick).trim();
  const today = todayIso();
  const accepted = r.status === 'Đang onboard';
  const it = accepted && taskOf(r, 'itAccount').status !== 'Chưa bắt đầu';
  const mc = accepted && taskOf(r, 'marcom').status !== 'Chưa bắt đầu';
  const dateErr = !date ? 'Bắt buộc' : date === r.data.startDate ? 'Chọn ngày khác ngày hiện tại' : date < today ? 'Không chọn ngày đã qua' : '';
  const reasonErr = !reason ? 'Bắt buộc' : '';
  const d = date && !dateErr ? daysUntil(date) : null;
  return (
    <Modal
      open
      onClose={onClose}
      title={`Sửa ngày onboard — ${r.data.fullName}`}
      footer={
        <>
          <Btn onClick={onClose}>Đóng</Btn>
          <Btn
            variant="primary"
            icon={CalendarRange}
            onClick={() => {
              if (dateErr || reasonErr) return setTried(true);
              changeStartDate(r.id, date, reason);
              onClose();
              toast(`Đã đổi ngày onboard ${r.data.fullName}: ${dmy(r.data.startDate)} → ${dmy(date)}`);
            }}
            data-testid="start-date-confirm"
          >
            Lưu ngày mới
          </Btn>
        </>
      }
    >
      <div className="space-y-3">
        <FieldTable
          labelWidth="34%"
          rows={[
            { label: 'Ngày onboard hiện tại', value: <b>{dmy(r.data.startDate)}</b> },
            ...((r.dateChanges || []).length ? [{ label: 'Đã đổi trước đó', value: (r.dateChanges || []).map((c) => `${dmy(c.from)} → ${dmy(c.to)}`).join(' · ') }] : []),
          ]}
        />
        <FormRow label="Ngày onboard mới" required error={tried ? dateErr : undefined} hint={d != null ? (d === 0 ? 'Hôm nay' : `Còn ${d} ngày`) : undefined}>
          <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className={erp.inputFull} data-testid="start-date-input" />
        </FormRow>
        <FormRow label="Lý do" required error={tried ? reasonErr : undefined}>
          <select value={pick} onChange={(e) => setPick(e.target.value)} className={`${erp.inputFull} cursor-pointer`} data-testid="start-date-reason">
            <option value="">-- Chọn lý do --</option>
            {[...START_DATE_REASONS, 'Khác'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </FormRow>
        {pick === 'Khác' && (
          <FormRow label="Ghi rõ lý do" required>
            <textarea rows={2} maxLength={300} value={other} onChange={(e) => setOther(e.target.value)} className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
          </FormRow>
        )}
        <div className="border border-slate-200 bg-slate-50 rounded-[4px] px-3 py-2">
          <p className="text-[12px] font-bold text-slate-700 mb-1">Khi lưu, hệ thống sẽ:</p>
          <ul className="list-disc pl-5 text-[12px] text-slate-600 space-y-0.5">
            {accepted && <li>Dời lịch các email onboard (bộ tài liệu, tài khoản, Welcome Kit) theo ngày mới và gửi email xác nhận ngày mới tới {r.candidateEmail}.</li>}
            {r.account.employeeCode && <li>Cập nhật ngày vào làm của hồ sơ {r.account.employeeCode} trong Employees.</li>}
            {it && <li>Báo IT ({IT_MAILBOX}) hạn cấp tài khoản mới.</li>}
            {mc && <li>Báo MarCom ({MARCOM_MAILBOX}) dời Welcome Onboard.</li>}
            <li>Báo Tuyển dụng ({r.taPic}); ghi lịch sử thay đổi.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

/** IT xác nhận đã huỷ tài khoản / huỷ yêu cầu cấp tài khoản sau Cancel offer. */
const ItCancelModal: React.FC<{ record: OnbRecord; onClose: () => void; toast: Toast }> = ({ record: r, onClose, toast }) => {
  const { itCancelDone } = useOnboarding();
  const [by, setBy] = useState(IT_STAFF[0]);
  const [note, setNote] = useState('');
  const c = r.itCancel!;
  const acc = c.kind === 'account';
  return (
    <Modal
      open
      onClose={onClose}
      title={`${acc ? 'Huỷ tài khoản' : 'Huỷ yêu cầu cấp tài khoản'} — ${r.data.fullName}`}
      footer={
        <>
          <Btn onClick={onClose}>Đóng</Btn>
          <Btn
            variant="danger"
            icon={CheckCircle2}
            onClick={() => {
              itCancelDone(r.id, by, note.trim());
              onClose();
              toast(acc ? `IT đã huỷ tài khoản ${c.email || ''} — đã báo HCNS và Tuyển dụng` : 'IT đã huỷ yêu cầu cấp tài khoản — đã báo HCNS');
            }}
            data-testid="it-cancel-confirm"
          >
            {acc ? 'Xác nhận đã huỷ tài khoản' : 'Xác nhận đã huỷ yêu cầu'}
          </Btn>
        </>
      }
    >
      <div className="space-y-3">
        <FieldTable
          labelWidth="34%"
          rows={[
            { label: 'Ứng viên', value: `${r.data.fullName} · ${r.block} · ${r.company}` },
            { label: 'Lý do Cancel offer', value: r.cancelReason || '' },
            ...(acc ? [{ label: 'Email công ty', value: <span className="font-mono">{c.email}</span> }, { label: 'Tên tài khoản', value: <span className="font-mono">{c.accountName}</span> }] : []),
            { label: 'HCNS yêu cầu lúc', value: dmyhm(c.requestedAt) },
          ]}
        />
        <FormRow label="Người thực hiện" required>
          <CatalogSelect value={by} options={IT_STAFF} onChange={setBy} />
        </FormRow>
        <FormRow label="Ghi chú">
          <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={acc ? 'VD: Đã xoá mailbox, thu hồi license' : 'VD: Đã đóng ticket cấp tài khoản'} className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
        </FormRow>
        <p className="text-[12px] text-slate-500">Xác nhận sẽ gửi email báo HCNS ({'hcns@company.vn'}) và Tuyển dụng ({r.taPic}).</p>
      </div>
    </Modal>
  );
};

/** Cancel offer — ứng viên báo không onboard; HCNS chuyển trạng thái để huỷ onboard. */
const CancelOfferModal: React.FC<{ record: OnbRecord; onClose: () => void; toast: Toast }> = ({ record: r, onClose, toast }) => {
  const { cancelOffer } = useOnboarding();
  const [reason, setReason] = useState('');
  const [tried, setTried] = useState(false);
  const it = taskOf(r, 'itAccount').status !== 'Chưa bắt đầu';
  const mc = taskOf(r, 'marcom').status !== 'Chưa bắt đầu';
  const err = !reason.trim() ? 'Bắt buộc' : '';
  return (
    <Modal
      open
      onClose={onClose}
      title={`Cancel offer — ${r.data.fullName}`}
      footer={
        <>
          <Btn onClick={onClose}>Đóng</Btn>
          <Btn
            variant="danger"
            icon={XCircle}
            onClick={() => {
              if (err) return setTried(true);
              cancelOffer(r.id, reason.trim());
              onClose();
              toast(`Đã Cancel offer ${r.data.fullName} — đã huỷ onboard`);
            }}
            data-testid="cancel-offer-confirm"
          >
            Cancel offer
          </Btn>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-[12.5px] text-slate-700">
          Ứng viên báo không onboard ngày <b>{dmy(r.data.startDate)}</b>. Chuyển trạng thái <b>Cancel offer</b> sẽ huỷ onboard ứng viên này:
        </p>
        <ul className="list-disc pl-5 text-[12px] text-slate-600 space-y-0.5">
          <li>Huỷ lịch các email onboard chưa gửi; dừng các việc đang chờ.</li>
          {r.account.employeeCode && <li>Xoá hồ sơ {r.account.employeeCode} khỏi Employees.</li>}
          {it ? (
            <li>
              Email {IT_MAILBOX} đề nghị <b>{r.account.status === 'Đã tạo' ? `huỷ tài khoản ${r.account.companyEmail || ''}` : 'huỷ yêu cầu cấp tài khoản'}</b>; IT xác nhận đã huỷ ở tab IT.
            </li>
          ) : (
            <li>IT chưa nhận yêu cầu cấp tài khoản (ứng viên chưa submit form) — không cần báo IT.</li>
          )}
          {mc && <li>Báo MarCom huỷ Welcome Onboard.</li>}
          <li>Báo Tuyển dụng ({r.taPic}); lượt ứng tuyển chuyển Offer Rejected.</li>
        </ul>
        <FormRow label="Lý do" required error={tried ? err : undefined} hint={`${reason.length}/500 ký tự`}>
          <textarea rows={3} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="VD: Ứng viên nhận offer công ty khác" className={`${erp.inputFull} h-auto py-1.5 resize-none`} data-testid="cancel-reason" />
        </FormRow>
      </div>
    </Modal>
  );
};
