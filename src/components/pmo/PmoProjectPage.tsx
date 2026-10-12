/**
 * PmoProjectPage — PMO-05 Danh sách & hồ sơ dự án (F1.1) và PMO-06 Chi tiết dự án.
 *
 * Chế độ danh sách (PMO-05):
 *   bộ lọc một hàng (Khối, Loại, Phase, Health, tìm mã/tên/khách/PM) + bảng dự án.
 *   "Tạo dự án từ ERP" → thêm dòng nhập inline ngay đầu bảng (không popup): đủ trường bắt buộc mới lưu,
 *   mã tự sinh {KHỐI}-{YYYY}-{seq}. Dự án mới lưu trong STORE cấp module (chỉ hiện ở màn này, chi tiết rút gọn: thông tin + checklist P1).
 *   Bấm dòng → chế độ chi tiết trong cùng trang.
 *
 * Chế độ chi tiết (PMO-06):
 *   thanh tiêu đề: "Quay lại" bên trái · "Mở Cockpit" / "Trình gate" bên phải · meta hợp đồng + Ban điều hành theo loại.
 *   header cố định: Health · dải 6 phase · ECV đã ghi nhận / % HĐ.
 *   8 tab: Tổng quan (F1.1, F1.3, F2.1, F2.2) · Kế hoạch (F3.1, F3.2) · Thực thi (F4.2, F4.3) ·
 *          Chất lượng · Tài chính · Rủi ro/CR · Nguồn lực (PmoProjectTabsB) · Lịch sử (F12.3).
 *   Mọi thao tác sửa đều inline trên dòng; thay đổi trong phiên được ghi vào audit log của phiên (tab Lịch sử).
 */
import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  CalendarRange,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileSpreadsheet,
  Filter,
  Gauge,
  GitCompare,
  History,
  LayoutDashboard,
  ListTree,
  Pencil,
  Plus,
  Search,
  Send,
  ShieldAlert,
  Timer,
  Unlock,
  Upload,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import {
  HEALTH_DOT,
  HEALTH_LABEL,
  KHOI,
  KPI_DEFS,
  Khoi,
  KpiCode,
  OWNERS,
  PHASES,
  PMO_PROJECTS,
  PmoProject,
  ProjType,
  PROJ_TYPE_LABEL,
  TODAY,
  addDays,
  between,
  blockedDays,
  dmy,
  fmtKpi,
  fmtThreshold,
  fmtTy,
  fmtVnd,
  healthOf,
  kpiColor,
  pct,
  rand,
} from '../../pmo/pmo';
import {
  AUDIT_LOG,
  AuditEntry,
  ChecklistItem,
  Feature,
  PAST_WEEKS,
  PEOPLE,
  PHASE_CHECKLIST,
  Release,
  WP_TYPES,
  Wp,
  WpType,
  projectDetail,
  weekLabel,
  weekNo,
} from '../../pmo/pmoData';
import { usePmo } from '../../pmo/PmoContext';
import { Btn, ErpPage, ErpTitleBar, FieldTable, FolderTabs, Panel, Tag, erp } from '../erp/Erp';
import { HealthBadge, PhaseStrip, Spark, TypeTag } from './PmoBits';
import { FinanceTab, QualityTab, ResourceTab, RiskCrTab } from './PmoProjectTabsB';

// ==========================================================================
// Trạng thái phiên (giữ khi đổi màn)
// ==========================================================================
interface NewProject {
  id: string;
  code: string;
  name: string;
  khoi: Khoi;
  type: ProjType;
  client: string;
  pm: string;
  contractValue: number;
  start: string;
  end: string;
  erpRef: string;
  createdAt: string;
}
interface CheckRow extends ChecklistItem {
  reason: string; // lý do bỏ trống (mục không bắt buộc)
}
interface GateSubmit {
  gate: string;
  at: string;
  by: string;
  approver: string;
}
interface WbsVersion {
  ver: number;
  at: string;
  file: string;
  rows: number;
  errors: number;
  by: string;
  status: 'Hiệu lực' | 'Chờ CR' | 'Thay thế';
}
interface Unblock {
  note: string;
  at: string;
  by: string;
}
type HistEntity = AuditEntry['entity'] | 'Checklist' | 'WBS' | 'Blocked' | 'Ghi chú health';
interface HistEntry extends Omit<AuditEntry, 'entity'> {
  entity: HistEntity;
}

const STORE = {
  created: [] as NewProject[],
  checklist: new Map<string, CheckRow[]>(),
  gate: new Map<string, GateSubmit | null>(),
  note: new Map<string, { text: string; at: string } | null>(),
  features: new Map<string, Feature[]>(),
  wbs: new Map<string, WbsVersion[]>(),
  unblocked: new Map<string, Record<string, Unblock>>(),
  audit: [] as HistEntry[],
};

/** useState có ghi lại vào STORE theo khoá (component phải được key theo dự án). */
function useStored<T>(map: Map<string, T>, key: string, init: () => T) {
  const [v, setV] = useState<T>(() => (map.has(key) ? (map.get(key) as T) : init()));
  const set = (fn: (cur: T) => T) =>
    setV((cur) => {
      const n = fn(cur);
      map.set(key, n);
      return n;
    });
  return [v, set] as const;
}

const now = () => `${TODAY} ${new Date().toTimeString().slice(0, 5)}`;
let auditSeq = 1;
const logAudit = (actor: string, entity: HistEntity, entityId: string, action: string, before: string, after: string) =>
  STORE.audit.unshift({ id: `SS${String(auditSeq++).padStart(4, '0')}`, at: now(), actor, entity, entityId, action, before, after, ip: '10.20.1.15' });

// ==========================================================================
// Quy tắc dùng chung
// ==========================================================================
const SEL = `${erp.input} h-7 text-[12px]`;
/** dd/mm/yy — ngày gọn cho bảng danh sách. */
const dmyShort = (d: string) => dmy(d).replace(/\/20(\d\d)$/, '/$1');
const IN = `${erp.input} h-7 text-[12px]`;

const FilterCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex items-center gap-1.5 min-w-0">
    <span className="text-[12px] text-slate-600 whitespace-nowrap">{label}</span>
    {children}
  </label>
);

const days = (a: string, b: string) => (new Date(b).getTime() - new Date(a).getTime()) / 864e5;

/** Người duyệt gate theo loại dự án (F2.2) — tuần tự. */
const APPROVERS: Record<ProjType, string> = { BT: 'GĐSX', QT: 'GĐSX → GĐK', CL: 'GĐSX → GĐK → TCT' };
/** Ban điều hành theo loại (F1.1). */
const BOARD_LABEL: Record<ProjType, string> = {
  BT: 'PM + TL + QC',
  QT: 'PM + TL + QC + GĐ khối',
  CL: 'PM + TL + QC + GĐ khối + PMO Director + C-level + Client Executive',
};
const boardOf = (khoi: Khoi, type: ProjType, pm: string, client: string) => {
  const ppl = PEOPLE.filter((x) => x.khoi === khoi);
  const rows = [
    { role: 'PM', name: pm, duty: 'Điều hành hằng ngày, trình gate' },
    { role: 'Tech Lead', name: ppl.find((x) => x.job === 'TL')?.name || '—', duty: 'Kiến trúc, estimate, DoD kỹ thuật' },
    { role: 'QC', name: ppl.find((x) => x.job === 'QA')?.name || '—', duty: 'Quality gate, nghiệm thu nội bộ' },
  ];
  if (type !== 'BT') rows.push({ role: 'GĐ khối', name: `GĐK khối ${khoi}`, duty: 'Duyệt gate bước 2, CR tính phí' });
  if (type === 'CL')
    rows.push(
      { role: 'PMO Director', name: 'Nguyễn Hữu Phúc', duty: 'Giám sát quy trình, báo cáo TCT' },
      { role: 'C-level', name: 'Phó TGĐ Sản xuất', duty: 'Duyệt gate bước 3' },
      { role: 'Client Executive', name: `Đại diện ${client}`, duty: 'Đầu mối cấp cao phía khách' },
    );
  return rows;
};

const checkStats = (rows: CheckRow[]) => {
  const req = rows.filter((r) => r.required);
  const reqDone = req.filter((r) => r.done).length;
  const allDone = rows.filter((r) => r.done).length;
  const optNoReason = rows.filter((r) => !r.required && !r.done && !r.reason.trim()).length;
  const reqPct = req.length ? Math.round((reqDone / req.length) * 100) : 100;
  return { reqTotal: req.length, reqDone, allDone, total: rows.length, pct: rows.length ? Math.round((allDone / rows.length) * 100) : 0, reqPct, optNoReason, canSubmit: reqPct === 100 && optNoReason === 0 };
};

const STATUS_CLS: Record<string, string> = {
  Done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'In Progress': 'bg-sky-50 text-sky-700 border-sky-200',
  Review: 'bg-violet-50 text-violet-700 border-violet-200',
  'To Do': 'bg-slate-50 text-slate-600 border-slate-200',
  Blocked: 'bg-rose-50 text-rose-700 border-rose-200',
  'Đã close': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Đang chạy': 'bg-sky-50 text-sky-700 border-sky-200',
  'Kế hoạch': 'bg-slate-50 text-slate-600 border-slate-200',
};
const H_TEXT = { green: 'text-emerald-700', yellow: 'text-amber-700', red: 'text-rose-700' } as const;

// ==========================================================================
// Checklist phase (F2.1) — dùng cho cả dự án có sẵn và dự án mới (P1)
// ==========================================================================
const Checklist: React.FC<{ rows: CheckRow[]; onChange: (rows: CheckRow[]) => void; locked: boolean; actor: string; code: string }> = ({ rows, onChange, locked, actor, code }) => {
  const upd = (i: number, patch: Partial<CheckRow>) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const toggle = (i: number) => {
    const r = rows[i];
    if (locked || (!r.done && !r.evidence.trim())) return;
    upd(i, { done: !r.done, doneBy: !r.done ? actor : undefined, doneAt: !r.done ? TODAY : undefined, reason: !r.done ? '' : r.reason });
    logAudit(actor, 'Checklist', `${code} · ${r.code}`, r.done ? 'Bỏ tick checklist' : 'Tick checklist', r.done ? 'Hoàn thành' : 'Chưa', r.done ? 'Chưa' : `Hoàn thành · ${r.evidence}`);
  };
  return (
    <div className="overflow-x-auto">
      <table className={`${erp.table} min-w-[980px]`}>
        <thead>
          <tr>
            <th className={`${erp.th} border-t-0 border-l-0 w-16`}>Mã</th>
            <th className={`${erp.th} border-t-0 text-left`}>Hạng mục</th>
            <th className={`${erp.th} border-t-0 text-center w-20`}>Bắt buộc</th>
            <th className={`${erp.th} border-t-0 text-center w-16`}>Xong</th>
            <th className={`${erp.th} border-t-0 text-left w-[260px]`}>Evidence (link)</th>
            <th className={`${erp.th} border-t-0 text-left w-40`}>Người tick</th>
            <th className={`${erp.th} border-t-0 text-center w-24`}>Ngày</th>
            <th className={`${erp.th} border-t-0 border-r-0 text-left w-[220px]`}>Lý do bỏ trống</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const needReason = !r.required && !r.done;
            return (
              <tr key={r.code} className={erp.tr}>
                <td className={`${erp.td} border-l-0 ${erp.code}`}>{r.code}</td>
                <td className={`${erp.td} ${r.done ? 'text-slate-800' : 'text-slate-700'}`}>{r.name}</td>
                <td className={`${erp.td} text-center`}>{r.required ? <Tag cls="bg-rose-50 text-rose-700 border-rose-200">Bắt buộc</Tag> : <span className="text-slate-400 text-[11px]">Không</span>}</td>
                <td className={`${erp.td} text-center`}>
                  <input
                    type="checkbox"
                    checked={r.done}
                    disabled={locked || (!r.done && !r.evidence.trim())}
                    onChange={() => toggle(i)}
                    title={!r.done && !r.evidence.trim() ? 'Nhập link evidence trước khi tick' : ''}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer disabled:cursor-not-allowed"
                  />
                </td>
                <td className={erp.td}>
                  {locked || r.done ? (
                    r.evidence ? (
                      <a href={r.evidence} target="_blank" rel="noreferrer" className="text-[#1f5fa8] hover:underline text-[12px] break-all" onClick={(e) => e.preventDefault()}>
                        {r.evidence.replace(/^https?:\/\//, '')}
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )
                  ) : (
                    <input value={r.evidence} onChange={(e) => upd(i, { evidence: e.target.value })} placeholder="https://… (bắt buộc trước khi tick)" className={`${IN} w-full`} />
                  )}
                </td>
                <td className={`${erp.td} whitespace-nowrap`}>{r.doneBy || <span className="text-slate-400">—</span>}</td>
                <td className={`${erp.td} text-center tabular-nums`}>{r.doneAt ? dmy(r.doneAt) : <span className="text-slate-400">—</span>}</td>
                <td className={`${erp.td} border-r-0`}>
                  {needReason ? (
                    locked ? (
                      <span className="text-[12px] text-slate-600">{r.reason || '—'}</span>
                    ) : (
                      <input
                        value={r.reason}
                        onChange={(e) => upd(i, { reason: e.target.value })}
                        placeholder="Bắt buộc nhập nếu bỏ trống"
                        className={`${IN} w-full ${!r.reason.trim() ? 'border-amber-400 bg-amber-50/40' : ''}`}
                      />
                    )
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const ChecklistProgress: React.FC<{ rows: CheckRow[] }> = ({ rows }) => {
  const s = checkStats(rows);
  return (
    <span className="flex items-center gap-2 text-[12px] text-slate-600">
      <span className="w-28 h-2 bg-slate-200 rounded-sm overflow-hidden">
        <span className={`block h-full ${s.reqPct === 100 ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${s.pct}%` }} />
      </span>
      <b className="text-slate-900">{s.pct}%</b> · bắt buộc{' '}
      <b className={s.reqPct === 100 ? 'text-emerald-700' : 'text-amber-700'}>
        {s.reqDone}/{s.reqTotal}
      </b>
    </span>
  );
};

// ==========================================================================
// Tab Tổng quan (F1.1, F1.3, F2.1, F2.2)
// ==========================================================================
const ContractPanel: React.FC<{ p: Pick<PmoProject, 'code' | 'name' | 'khoi' | 'type' | 'client' | 'pm' | 'contractValue' | 'start' | 'end'>; erpRef: string; ecv: number }> = ({ p, erpRef, ecv }) => {
  const dur = Math.round(days(p.start, p.end));
  return (
    <Panel title="Thông tin hợp đồng" icon={ClipboardCheck} noPad footer="Đổi loại dự án, PM, giá trị HĐ được ghi audit (ai/khi nào/trước–sau). Giá trị HĐ gốc khoá khi ECV > 0 — thay đổi phải qua CR tạo phụ lục HĐ.">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <FieldTable
          labelWidth="38%"
          rows={[
            { label: 'Mã dự án', value: <span className={erp.code}>{p.code}</span> },
            { label: 'Tên dự án', value: p.name, strong: true },
            { label: 'Khối', value: p.khoi },
            { label: 'Khách hàng', value: p.client },
            { label: 'Loại dự án', value: <TypeTag t={p.type} /> },
            { label: 'PM', value: p.pm },
          ]}
        />
        <FieldTable
          labelWidth="38%"
          rows={[
            { label: 'Giá trị HĐ', value: <>{fmtVnd(p.contractValue)}{ecv > 0 && <span className="ml-1.5 text-[11px] text-slate-500 font-normal">(khoá)</span>}</>, strong: true },
            { label: 'Đơn vị tiền', value: 'VNĐ' },
            { label: 'Bắt đầu theo HĐ', value: dmy(p.start) },
            { label: 'Kết thúc theo HĐ', value: dmy(p.end) },
            { label: 'Thời lượng', value: `${dur} ngày (~${(dur / 30).toFixed(1).replace('.', ',')} tháng)` },
            { label: 'Tham chiếu ERP', value: <span className={erp.code}>{erpRef}</span> },
          ]}
        />
      </div>
    </Panel>
  );
};

const BoardPanel: React.FC<{ khoi: Khoi; type: ProjType; pm: string; client: string }> = ({ khoi, type, pm, client }) => (
  <Panel title="Ban điều hành" icon={Users} noPad footer={`Loại ${type} · ${BOARD_LABEL[type]} — đọc từ cấu hình khối. Người duyệt gate: ${APPROVERS[type]}.`}>
    <table className={erp.table}>
      <thead>
        <tr>
          <th className={`${erp.th} border-t-0 border-l-0 text-left w-36`}>Vai trò</th>
          <th className={`${erp.th} border-t-0 text-left`}>Người</th>
          <th className={`${erp.th} border-t-0 border-r-0 text-left`}>Trách nhiệm</th>
        </tr>
      </thead>
      <tbody>
        {boardOf(khoi, type, pm, client).map((b) => (
          <tr key={b.role} className={erp.tr}>
            <td className={`${erp.td} border-l-0 font-semibold text-slate-700`}>{b.role}</td>
            <td className={`${erp.td} whitespace-nowrap`}>{b.name}</td>
            <td className={`${erp.td} border-r-0 text-slate-600`}>{b.duty}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Panel>
);

const GateStatusLine: React.FC<{ submitted: GateSubmit | null; rows: CheckRow[]; gate: string }> = ({ submitted, rows, gate }) => {
  const s = checkStats(rows);
  if (submitted)
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 text-sky-800 text-[12px]">
        <Send size={13} /> Đã trình gate <b>{submitted.gate}</b> lúc {dmy(submitted.at.slice(0, 10))} {submitted.at.slice(11)} — chờ <b>{submitted.approver.split(' → ')[0]}</b> duyệt
        {submitted.approver.includes('→') && <span className="text-sky-700">(luồng tuần tự {submitted.approver})</span>} · SLA 2 ngày làm việc. Checklist khoá đến khi có quyết định.
      </div>
    );
  if (s.canSubmit)
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-[12px]">
        <Check size={13} /> Checklist bắt buộc đủ 100% — có thể trình gate {gate}.
      </div>
    );
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-800 text-[12px]">
      <AlertTriangle size={13} /> Chưa thể trình gate {gate}:{' '}
      {[s.reqTotal > s.reqDone && `còn ${s.reqTotal - s.reqDone} mục bắt buộc chưa xong`, s.optNoReason > 0 && `${s.optNoReason} mục không bắt buộc bỏ trống chưa có lý do`].filter(Boolean).join(', ')}.
    </div>
  );
};

const OverviewTab: React.FC<{ p: PmoProject; rows: CheckRow[]; setRows: (r: CheckRow[]) => void; submitted: GateSubmit | null; onSubmit: () => void }> = ({ p, rows, setRows, submitted, onSubmit }) => {
  const s = checkStats(rows);
  const [note, setNote] = useStored(STORE.note, p.id, () => null);
  const [draft, setDraft] = useState(note?.text || '');
  const hist = useMemo(
    () =>
      PAST_WEEKS.slice(-8).map((w, i) => {
        const k = Object.fromEntries(KPI_DEFS.map((d) => [d.code, p.trend[d.code][i]])) as Record<KpiCode, number>;
        return { w, ...healthOf(k) };
      }),
    [p],
  );
  const saveNote = () => {
    const t = draft.trim();
    logAudit(p.pm, 'Ghi chú health', p.code, 'Ghi chú giải trình health', note?.text || '—', t || '(xoá)');
    setNote(() => (t ? { text: t, at: now() } : null));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-3">
        <ContractPanel p={p} erpRef={`ERP-HĐ-${p.code.slice(-8)}`} ecv={p.ecv} />
        <BoardPanel khoi={p.khoi} type={p.type} pm={p.pm} client={p.client} />
      </div>

      <Panel
        title={`Checklist P${p.phase} ${PHASES[p.phase - 1].name}`}
        icon={ListTree}
        noPad
        actions={
          <>
            <ChecklistProgress rows={rows} />
            <Btn variant="primary" icon={Send} disabled={!s.canSubmit || !!submitted} onClick={onSubmit} className="h-7">
              Trình gate {p.nextGate}
            </Btn>
          </>
        }
        footer="Không cho chuyển phase thủ công — phase chỉ chuyển khi gate được duyệt (F2.2). Tick một mục cần có link evidence; mục không bắt buộc bỏ trống phải ghi lý do. Không sửa checklist sau khi gate pass."
      >
        <GateStatusLine submitted={submitted} rows={rows} gate={p.nextGate} />
        <div className="border-t border-slate-200">
          <Checklist rows={rows} onChange={setRows} locked={!!submitted} actor={p.pm} code={p.code} />
        </div>
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-3">
        <Panel
          title="Health breakdown · 9 KPI"
          icon={Gauge}
          noPad
          actions={
            <span className="flex items-center gap-2 text-[12px] text-slate-600">
              <HealthBadge h={p.health} small />
              {p.drivers.length ? `do ${p.drivers.map((d) => `#${d.no} ${d.label}`).join(', ')}` : '9/9 KPI đạt'}
            </span>
          }
          footer="Rule F1.3: Đỏ nếu ≥1 KPI đỏ trong nhóm critical {#3, #6, #9} hoặc ≥3 KPI đỏ; Vàng nếu ≥2 KPI vàng hoặc 1 KPI đỏ ngoài nhóm; còn lại Xanh. PM không tự chọn màu."
        >
          <div className="overflow-x-auto">
            <table className={`${erp.table} min-w-[640px]`}>
              <thead>
                <tr>
                  <th className={`${erp.th} border-t-0 border-l-0 w-10`}>#</th>
                  <th className={`${erp.th} border-t-0 text-left`}>KPI</th>
                  <th className={`${erp.th} border-t-0 text-right w-20`}>Giá trị</th>
                  <th className={`${erp.th} border-t-0 text-left`}>Ngưỡng</th>
                  <th className={`${erp.th} border-t-0 text-center w-20`}>4 tuần</th>
                  <th className={`${erp.th} border-t-0 border-r-0 text-center w-20`}>Màu</th>
                </tr>
              </thead>
              <tbody>
                {KPI_DEFS.map((d) => {
                  const v = p.kpis[d.code];
                  const c = kpiColor(d, v);
                  return (
                    <tr key={d.code} className={erp.tr} title={`${d.formula} · Nguồn ${d.source}`}>
                      <td className={`${erp.td} border-l-0 text-center text-slate-500`}>{d.no}</td>
                      <td className={erp.td}>
                        {d.label} {d.critical && <span className="ml-1 text-[10px] font-bold text-rose-600 uppercase">critical</span>}
                      </td>
                      <td className={`${erp.td} ${erp.num} font-bold ${H_TEXT[c]}`}>{fmtKpi(d, v)}</td>
                      <td className={`${erp.td} text-[11.5px] text-slate-600 whitespace-nowrap`}>{fmtThreshold(d)}</td>
                      <td className={`${erp.td} text-center`}>
                        <span className="inline-flex">
                          <Spark values={p.trend[d.code].slice(-4)} color={c} w={56} h={16} />
                        </span>
                      </td>
                      <td className={`${erp.td} border-r-0 text-center`}>
                        <span className="inline-flex items-center gap-1 text-[11.5px]">
                          <span className={`w-2.5 h-2.5 rounded-full ${HEALTH_DOT[c]}`} /> {HEALTH_LABEL[c]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-3 min-w-0">
          <Panel title="Lịch sử health 8 tuần" icon={History} noPad footer="Màu từng tuần tính lại từ 9 KPI của tuần đó theo cùng rule.">
            <div className="grid grid-cols-8 gap-0.5 p-2">
              {hist.map((x) => (
                <div key={x.w} className="flex flex-col items-center gap-0.5 min-w-0" title={x.drivers.length ? `Do ${x.drivers.map((d) => d.label).join(', ')}` : '9/9 KPI đạt'}>
                  <span className="text-[10px] text-slate-500 tabular-nums">T{weekNo(x.w)}</span>
                  <span className={`w-full h-6 rounded-[2px] ${HEALTH_DOT[x.health]}`} />
                  <span className="text-[10px] text-slate-400 tabular-nums">{weekLabel(x.w)}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Ghi chú giải trình của PM" icon={Pencil} footer="Ghi chú chỉ để giải trình với cấp trên — không làm đổi màu health.">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder="Ví dụ: Budget Burn Δ tăng do onboarding 2 dev mới tuần 40, dự kiến về ngưỡng sau sprint kế tiếp…"
              className={`${erp.inputFull} h-auto py-1.5 text-[12px] resize-y`}
            />
            <div className="flex items-center justify-between gap-2 mt-1.5">
              <span className="text-[11px] text-slate-500">{note ? `Đã lưu ${dmy(note.at.slice(0, 10))} ${note.at.slice(11)} bởi ${p.pm}` : 'Chưa có ghi chú'}</span>
              <Btn icon={Check} className="h-7" disabled={draft.trim() === (note?.text || '')} onClick={saveNote}>
                Lưu ghi chú
              </Btn>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// Tab Kế hoạch (F3.1, F3.2)
// ==========================================================================
const wpMissing = (w: Wp) => [!w.owner && 'owner', !w.release && 'release', !w.sp && 'SP'].filter(Boolean) as string[];

const EXCEL_COLS = ['A · Mã WP', 'B · Tên công việc', 'C · Feature', 'D · Loại', 'E · Story Point', 'F · Release', 'G · Người phụ trách', 'H · Ghi chú'];
const MAP_FIELDS = [
  { key: 'code', label: 'Mã WP', col: 0, required: true },
  { key: 'name', label: 'Tên WP', col: 1, required: true },
  { key: 'feature', label: 'Feature cha', col: 2, required: true },
  { key: 'type', label: 'Loại WP', col: 3, required: true },
  { key: 'sp', label: 'SP', col: 4, required: true },
  { key: 'release', label: 'Release', col: 5, required: true },
  { key: 'owner', label: 'Owner', col: 6, required: true },
  { key: 'dod', label: 'DoD template', col: -1, required: false },
];

const ImportWizard: React.FC<{ p: PmoProject; locked: boolean; nextVer: number; onDone: (v: WbsVersion) => void; onClose: () => void }> = ({ p, locked, nextVer, onDone, onClose }) => {
  const d = projectDetail(p);
  const [step, setStep] = useState(1);
  const [file, setFile] = useState('');
  const [map, setMap] = useState<Record<string, number>>(() => Object.fromEntries(MAP_FIELDS.map((f) => [f.key, f.col])));
  const relCodes = d.releases.map((r) => r.code);
  const preview = d.wps.slice(0, 10).map((w, i) => {
    const r = { row: i + 2, code: w.code, name: w.name, feature: w.feature, type: i === 3 ? 'Backend' : (w.type as string), sp: i === 5 ? '' : String(w.sp), release: i === 7 ? 'R9' : w.release, owner: i === 2 ? '' : w.owner };
    const errs: string[] = [];
    const warns: string[] = [];
    if (!r.sp) errs.push('Thiếu SP');
    if (!WP_TYPES.includes(r.type as WpType)) errs.push(`Loại WP "${r.type}" không hợp lệ`);
    if (!relCodes.includes(r.release)) errs.push(`Release ${r.release} không tồn tại`);
    if (!r.owner) warns.push('Thiếu owner');
    return { ...r, errs, warns };
  });
  const nErr = preview.filter((r) => r.errs.length).length;
  const totalRows = d.wps.length;
  const unmapped = MAP_FIELDS.filter((f) => f.required && map[f.key] < 0);

  return (
    <div className="border-b border-slate-200 bg-[#f5f9ff]">
      <div className="flex flex-wrap items-center gap-1 px-3 py-1.5 border-b border-slate-200 text-[12px]">
        <FileSpreadsheet size={13} className="text-[#1f5fa8]" />
        <b className="text-[#1e3a5f] mr-2">Import WBS từ Excel</b>
        {['Chọn file mẫu', 'Map cột', 'Preview & kiểm lỗi'].map((s, i) => (
          <span key={s} className={`flex items-center gap-1 ${step === i + 1 ? 'text-[#1f5fa8] font-bold' : step > i + 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
            {i > 0 && <ChevronRight size={12} className="text-slate-400" />}
            <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] text-white ${step === i + 1 ? 'bg-[#1f5fa8]' : step > i + 1 ? 'bg-emerald-600' : 'bg-slate-300'}`}>{i + 1}</span>
            {s}
          </span>
        ))}
        <button type="button" onClick={onClose} className="ml-auto text-slate-500 hover:text-rose-600 cursor-pointer" title="Đóng">
          <X size={14} />
        </button>
      </div>

      {step === 1 && (
        <div className="px-3 py-2 space-y-1.5 text-[12px]">
          <div className="flex flex-wrap items-center gap-2">
            <Btn icon={Download} className="h-7">
              Tải file mẫu WBS_Template_PMO_v3.xlsx
            </Btn>
            <label className="inline-flex items-center gap-1.5 h-7 px-2.5 border border-slate-300 rounded-[3px] bg-white cursor-pointer hover:bg-slate-50">
              <Upload size={13} /> Chọn file…
              <input type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => setFile(e.target.files?.[0]?.name || '')} />
            </label>
            <button type="button" onClick={() => setFile(`WBS_${p.code}_v${nextVer}.xlsx`)} className="text-[#1f5fa8] hover:underline cursor-pointer">
              (dùng file mẫu giả lập)
            </button>
            {file && (
              <span className="text-slate-700">
                Đã chọn: <b>{file}</b>
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">Hỗ trợ template WBS đang dùng (sheet "WBS", dòng 1 là tiêu đề). Import lại tạo phiên bản mới, không ghi đè lịch sử.</p>
          <div className="flex justify-end">
            <Btn variant="primary" className="h-7" disabled={!file} onClick={() => setStep(2)}>
              Tiếp: Map cột
            </Btn>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="px-3 py-2 text-[12px]">
          <table className={`${erp.table} max-w-[620px]`}>
            <thead>
              <tr>
                <th className={`${erp.th} text-left`}>Trường PMO</th>
                <th className={`${erp.th} text-left`}>Cột trong Excel</th>
                <th className={`${erp.th} text-center w-24`}>Bắt buộc</th>
              </tr>
            </thead>
            <tbody>
              {MAP_FIELDS.map((f) => (
                <tr key={f.key} className={erp.tr}>
                  <td className={erp.td}>{f.label}</td>
                  <td className={`${erp.td} py-1`}>
                    <select value={map[f.key]} onChange={(e) => setMap({ ...map, [f.key]: Number(e.target.value) })} className={`${SEL} w-56 ${f.required && map[f.key] < 0 ? 'border-rose-400' : ''}`}>
                      <option value={-1}>— Không map —</option>
                      {EXCEL_COLS.map((c, i) => (
                        <option key={c} value={i}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`${erp.td} text-center`}>{f.required ? <span className="text-rose-600 font-bold">*</span> : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className={`text-[11px] ${unmapped.length ? 'text-rose-700' : 'text-slate-500'}`}>
              {unmapped.length ? `Chưa map: ${unmapped.map((f) => f.label).join(', ')}` : 'Đã tự nhận diện theo tiêu đề cột; kiểm tra lại trước khi tiếp tục.'}
            </span>
            <span className="flex gap-1.5">
              <Btn className="h-7" onClick={() => setStep(1)}>
                Quay lại
              </Btn>
              <Btn variant="primary" className="h-7" disabled={unmapped.length > 0} onClick={() => setStep(3)}>
                Tiếp: Preview
              </Btn>
            </span>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-[12px]">
          <div className="overflow-x-auto">
            <table className={`${erp.table} min-w-[960px]`}>
              <thead>
                <tr>
                  <th className={`${erp.th} border-l-0 w-14`}>Dòng</th>
                  <th className={erp.th}>Mã WP</th>
                  <th className={`${erp.th} text-left`}>Tên</th>
                  <th className={erp.th}>Feature</th>
                  <th className={erp.th}>Loại</th>
                  <th className={`${erp.th} text-right`}>SP</th>
                  <th className={erp.th}>Release</th>
                  <th className={erp.th}>Owner</th>
                  <th className={`${erp.th} border-r-0 text-left`}>Kết quả kiểm tra</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((r) => (
                  <tr key={r.row} className={r.errs.length ? 'bg-rose-50/60' : erp.tr}>
                    <td className={`${erp.td} border-l-0 text-center text-slate-500`}>{r.row}</td>
                    <td className={`${erp.td} ${erp.code}`}>{r.code}</td>
                    <td className={erp.td}>{r.name}</td>
                    <td className={`${erp.td} text-center`}>{r.feature}</td>
                    <td className={`${erp.td} text-center ${!WP_TYPES.includes(r.type as WpType) ? 'text-rose-700 font-bold' : ''}`}>{r.type}</td>
                    <td className={`${erp.td} ${erp.num} ${!r.sp ? 'bg-rose-100' : ''}`}>{r.sp || '—'}</td>
                    <td className={`${erp.td} text-center ${!relCodes.includes(r.release) ? 'text-rose-700 font-bold' : ''}`}>{r.release}</td>
                    <td className={`${erp.td} ${!r.owner ? 'bg-amber-50' : ''}`}>{r.owner || '—'}</td>
                    <td className={`${erp.td} border-r-0`}>
                      {r.errs.length ? (
                        <span className="text-rose-700">Lỗi: {r.errs.join('; ')}</span>
                      ) : r.warns.length ? (
                        <span className="text-amber-700">Cảnh báo: {r.warns.join('; ')}</span>
                      ) : (
                        <span className="text-emerald-700">Hợp lệ</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5">
            <span className="text-[11px] text-slate-600">
              File <b>{file}</b>: {totalRows} dòng · hiển thị 10 dòng đầu · <b className="text-rose-700">{nErr} dòng lỗi</b> sẽ bị bỏ qua.
              {locked && <b className="text-amber-700"> Sau Scope Freeze: phiên bản mới ở trạng thái "Chờ CR", chưa áp dụng vào baseline.</b>}
            </span>
            <span className="flex gap-1.5">
              <Btn className="h-7" onClick={() => setStep(2)}>
                Quay lại
              </Btn>
              <Btn
                variant="primary"
                icon={Upload}
                className="h-7"
                onClick={() => onDone({ ver: nextVer, at: now(), file, rows: totalRows - nErr, errors: nErr, by: p.pm, status: locked ? 'Chờ CR' : 'Hiệu lực' })}
              >
                Nhập {totalRows - nErr} dòng → tạo WBS v{nextVer}
              </Btn>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/** Gantt đơn giản bằng div: release (sprint 2 tuần chia vạch), RBuf màu khác, vạch hôm nay. */
const ReleaseGantt: React.FC<{ p: PmoProject; releases: Release[] }> = ({ p, releases }) => {
  const lo = p.start;
  const hi = [p.end, ...releases.map((r) => r.end)].sort().slice(-1)[0];
  const span = days(lo, hi) || 1;
  const pos = (d: string) => Math.max(0, Math.min(100, (days(lo, d) / span) * 100));
  const months: string[] = [];
  for (let d = new Date(lo.slice(0, 7) + '-01'); d.toISOString().slice(0, 10) <= hi; d.setUTCMonth(d.getUTCMonth() + 1)) months.push(d.toISOString().slice(0, 10));
  const todayIn = TODAY >= lo && TODAY <= hi;
  const rows: { code: string; start: string; end: string; kind: 'pre' | 'rel' | 'buf'; status?: string }[] = [
    { code: 'P1–P3', start: p.start, end: releases[0]?.start || p.start, kind: 'pre' },
    ...releases.map((r) => ({ code: r.code, start: r.start, end: r.end, kind: r.code === 'RBuf' ? ('buf' as const) : ('rel' as const), status: r.status })),
  ];
  const Track: React.FC<{ children?: React.ReactNode; h?: string }> = ({ children, h = 'h-5' }) => (
    <div className={`relative flex-1 ${h}`}>
      {months.map((m) => (
        <span key={m} className="absolute top-0 bottom-0 border-l border-slate-200" style={{ left: `${pos(m)}%` }} />
      ))}
      {todayIn && <span className="absolute top-0 bottom-0 border-l-2 border-rose-500 z-10" style={{ left: `${pos(TODAY)}%` }} />}
      {children}
    </div>
  );
  return (
    <div className="px-3 py-2 overflow-x-auto">
      <div className="min-w-[720px] space-y-1">
        <div className="flex items-end">
          <span className="w-[92px] shrink-0 text-[11px] text-slate-500">Release</span>
          <div className="relative flex-1 h-4">
            {months.map((m) => (
              <span key={m} className="absolute text-[10px] text-slate-500 tabular-nums pl-0.5" style={{ left: `${pos(m)}%` }}>
                {m.slice(5, 7)}/{m.slice(2, 4)}
              </span>
            ))}
            {todayIn && (
              <span className="absolute -top-0.5 text-[10px] font-bold text-rose-600 -translate-x-1/2 bg-white px-0.5 z-10" style={{ left: `${pos(TODAY)}%` }}>
                Hôm nay
              </span>
            )}
          </div>
        </div>
        {rows.map((r) => {
          const l = pos(r.start);
          const w = Math.max(0.8, pos(r.end) - l);
          const len = days(r.start, r.end);
          const ticks = r.kind === 'rel' ? Array.from({ length: Math.max(0, Math.ceil(len / 14) - 1) }, (_, i) => ((i + 1) * 14) / len) : [];
          const cls = r.kind === 'pre' ? 'bg-slate-300 text-slate-700' : r.kind === 'buf' ? 'bg-amber-200 text-amber-900 border border-dashed border-amber-500' : r.status === 'Đã close' ? 'bg-emerald-500 text-white' : r.status === 'Đang chạy' ? 'bg-[#1f5fa8] text-white' : 'bg-sky-200 text-sky-900';
          return (
            <div key={r.code} className="flex items-center">
              <span className="w-[92px] shrink-0 text-[11.5px] font-semibold text-slate-700">
                {r.code}
                {r.kind === 'rel' && <span className="font-normal text-slate-400"> · {Math.ceil(len / 14)} sprint</span>}
              </span>
              <Track>
                <div className={`absolute top-0.5 bottom-0.5 rounded-[2px] overflow-hidden flex items-center ${cls}`} style={{ left: `${l}%`, width: `${w}%` }} title={`${r.code}: ${dmy(r.start)} → ${dmy(r.end)}`}>
                  {ticks.map((t, i) => (
                    <span key={i} className="absolute top-0 bottom-0 border-l border-white/70" style={{ left: `${t * 100}%` }} />
                  ))}
                  <span className="relative px-1 text-[10px] whitespace-nowrap tabular-nums">
                    {dmy(r.start).slice(0, 5)}–{dmy(r.end).slice(0, 5)}
                  </span>
                </div>
              </Track>
            </div>
          );
        })}
        <div className="flex items-center gap-3 pt-1 pl-[92px] text-[10.5px] text-slate-500">
          <span className="flex items-center gap-1"><span className="w-3 h-2 bg-emerald-500 rounded-sm" /> Đã close</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 bg-[#1f5fa8] rounded-sm" /> Đang chạy</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 bg-sky-200 rounded-sm" /> Kế hoạch</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 bg-amber-200 border border-dashed border-amber-500 rounded-sm" /> RBuf</span>
          <span className="flex items-center gap-1"><span className="w-3 h-2 bg-slate-300 rounded-sm" /> P1–P3</span>
          <span>Vạch trắng = ranh giới sprint 2 tuần</span>
        </div>
      </div>
    </div>
  );
};

const BaselineCompare: React.FC<{ p: PmoProject }> = ({ p }) => {
  const d = projectDetail(p);
  const maxV = d.baselines.length;
  const [a, setA] = useState(String(d.baselines[0]?.version ?? ''));
  const [b, setB] = useState('cur');
  if (!maxV)
    return <p className="px-3 py-4 text-center text-slate-400 italic text-[12px]">Chưa có baseline — baseline v1 tự tạo khi gate Scope Freeze pass; re-baseline chỉ sau CR được duyệt.</p>;
  const idx = (v: string) => (v === 'cur' ? maxV + 1 : Number(v));
  const snap = (r: Release, v: string) => {
    const back = maxV + 1 - idx(v);
    return { sp: Math.round(r.spPlanned * (1 - back * 0.05 * rand(p.id, r.code, 'bsp'))), end: addDays(r.end, -Math.round(back * between(0, 8, p.id, r.code, 'bend'))) };
  };
  const rels = d.releases;
  const opts = [...d.baselines.map((x) => ({ k: String(x.version), l: `v${x.version} · ${dmy(x.at)} · ${x.reason}` })), { k: 'cur', l: 'Kế hoạch hiện tại' }];
  const tot = (v: string) => rels.reduce((s, r) => s + snap(r, v).sp, 0);
  return (
    <>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
        <FilterCell label="Phiên bản A">
          <select value={a} onChange={(e) => setA(e.target.value)} className={`${SEL} max-w-[280px]`}>
            {opts.map((o) => (
              <option key={o.k} value={o.k}>
                {o.l}
              </option>
            ))}
          </select>
        </FilterCell>
        <FilterCell label="so với B">
          <select value={b} onChange={(e) => setB(e.target.value)} className={`${SEL} max-w-[280px]`}>
            {opts.map((o) => (
              <option key={o.k} value={o.k}>
                {o.l}
              </option>
            ))}
          </select>
        </FilterCell>
        {a === b && <span className="text-[11px] text-amber-700">Chọn 2 phiên bản khác nhau.</span>}
      </div>
      <div className="overflow-x-auto">
        <table className={`${erp.table} min-w-[640px]`}>
          <thead>
            <tr>
              <th className={`${erp.th} border-t-0 border-l-0`}>Release</th>
              <th className={`${erp.th} border-t-0 text-right`}>SP (A)</th>
              <th className={`${erp.th} border-t-0 text-right`}>SP (B)</th>
              <th className={`${erp.th} border-t-0 text-right`}>Δ SP</th>
              <th className={`${erp.th} border-t-0 text-center`}>Kết thúc (A)</th>
              <th className={`${erp.th} border-t-0 text-center`}>Kết thúc (B)</th>
              <th className={`${erp.th} border-t-0 border-r-0 text-right`}>Trượt (ngày)</th>
            </tr>
          </thead>
          <tbody>
            {rels.map((r) => {
              const x = snap(r, a);
              const y = snap(r, b);
              const ds = y.sp - x.sp;
              const dd = Math.round(days(x.end, y.end));
              return (
                <tr key={r.code} className={erp.tr}>
                  <td className={`${erp.td} border-l-0 font-semibold text-center`}>{r.code}</td>
                  <td className={`${erp.td} ${erp.num}`}>{x.sp}</td>
                  <td className={`${erp.td} ${erp.num}`}>{y.sp}</td>
                  <td className={`${erp.td} ${erp.num} font-semibold ${ds > 0 ? 'text-amber-700' : ds < 0 ? 'text-sky-700' : 'text-slate-400'}`}>{ds > 0 ? `+${ds}` : ds || '—'}</td>
                  <td className={`${erp.td} text-center tabular-nums`}>{dmy(x.end)}</td>
                  <td className={`${erp.td} text-center tabular-nums`}>{dmy(y.end)}</td>
                  <td className={`${erp.td} border-r-0 ${erp.num} font-semibold ${dd > 7 ? 'text-rose-700' : dd > 0 ? 'text-amber-700' : 'text-slate-400'}`}>{dd > 0 ? `+${dd}` : dd || '—'}</td>
                </tr>
              );
            })}
            <tr className={erp.totalRow}>
              <td className={`${erp.td} border-l-0 text-center`}>Tổng</td>
              <td className={`${erp.td} ${erp.num}`}>{tot(a)}</td>
              <td className={`${erp.td} ${erp.num}`}>{tot(b)}</td>
              <td className={`${erp.td} ${erp.num}`}>{tot(b) - tot(a) > 0 ? '+' : ''}{tot(b) - tot(a)}</td>
              <td className={erp.td} colSpan={2} />
              <td className={`${erp.td} border-r-0`} />
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

const PlanTab: React.FC<{ p: PmoProject }> = ({ p }) => {
  const d = projectDetail(p);
  const locked = p.phase > 2;
  const [features, setFeatures] = useStored(STORE.features, p.id, () => d.features.map((f) => ({ ...f, wps: f.wps.map((w) => ({ ...w })) })));
  const [open, setOpen] = useState<Set<string>>(() => new Set([features[0]?.code, ...features.filter((f) => f.wps.some((w) => wpMissing(w).length)).map((f) => f.code)].filter(Boolean) as string[]));
  const [edit, setEdit] = useState<Wp | null>(null);
  const [importing, setImporting] = useState(false);
  const [versions, setVersions] = useStored(STORE.wbs, p.id, () => [
    { ver: 1, at: `${d.baselines[0]?.at || addDays(p.start, 21)} 10:00`, file: `WBS_${p.code}.xlsx (bản gốc)`, rows: d.wps.length, errors: 0, by: p.pm, status: 'Hiệu lực' as const },
  ]);
  const relCodes = d.releases.filter((r) => r.code !== 'RBuf').map((r) => r.code);
  const allWps = features.flatMap((f) => f.wps);
  const missingN = allWps.filter((w) => wpMissing(w).length).length;

  const toggle = (code: string) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(code) ? n.delete(code) : n.add(code);
      return n;
    });
  const saveEdit = () => {
    if (!edit) return;
    const old = allWps.find((w) => w.code === edit.code)!;
    const diff = (['name', 'type', 'sp', 'release', 'owner'] as const).filter((k) => old[k] !== edit[k]);
    if (diff.length) {
      setFeatures((fs) => fs.map((f) => (f.code === edit.feature ? { ...f, wps: f.wps.map((w) => (w.code === edit.code ? { ...edit } : w)) } : f)));
      logAudit(p.pm, 'WBS', `${p.code} · ${edit.code}`, 'Sửa WP', diff.map((k) => `${k}: ${old[k] || '—'}`).join('; '), diff.map((k) => `${k}: ${edit[k] || '—'}`).join('; '));
    }
    setEdit(null);
  };
  const imported = (v: WbsVersion) => {
    setVersions((cur) => [...cur.map((x) => (v.status === 'Hiệu lực' && x.status === 'Hiệu lực' ? { ...x, status: 'Thay thế' as const } : x)), v]);
    logAudit(p.pm, 'WBS', p.code, `Import WBS → v${v.ver}`, `v${v.ver - 1}`, `v${v.ver} · ${v.rows} dòng, bỏ ${v.errors} dòng lỗi · ${v.status}`);
    setImporting(false);
  };
  const loads = d.releases.map((r) => ({ r, load: r.capacity ? (r.spPlanned / r.capacity) * 100 : 0 }));
  const p4Len = d.releases.length ? days(d.releases[0].start, d.releases[d.releases.length - 1].end) : 0;
  const buf = d.releases.find((r) => r.code === 'RBuf');
  const bufPct = buf && p4Len ? (days(buf.start, buf.end) / p4Len) * 100 : 0;

  return (
    <div className="space-y-3">
      <Panel
        title={
          <>
            WBS · Feature → WP{' '}
            <span className="font-normal normal-case text-slate-500 tracking-normal">
              · {features.length} feature · {allWps.length} WP · {allWps.reduce((s, w) => s + (w.sp || 0), 0)} SP
            </span>
          </>
        }
        icon={ListTree}
        noPad
        actions={
          <>
            {missingN > 0 && (
              <Tag cls="bg-amber-50 text-amber-700 border-amber-200" icon={AlertTriangle}>
                {missingN} WP thiếu owner/release/SP
              </Tag>
            )}
            <Btn className="h-7" onClick={() => setOpen(open.size === features.length ? new Set() : new Set(features.map((f) => f.code)))}>
              {open.size === features.length ? 'Thu tất cả' : 'Mở tất cả'}
            </Btn>
            <Btn icon={FileSpreadsheet} className="h-7" onClick={() => setImporting(!importing)}>
              Import WBS từ Excel
            </Btn>
          </>
        }
        footer="WP bắt buộc: mã, tên, feature, release, SP, loại WP, owner, DoD. Loại WP bắt buộc từ MVP (đầu vào đo năng suất theo loại). Đồng bộ xuống Jira Epic/Story theo wp_code."
      >
        {locked && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-800 text-[12px] border-b border-amber-200">
            <ShieldAlert size={13} /> Sau Scope Freeze, thay đổi phải qua CR — bảng WP đã khoá sửa trực tiếp (baseline v{d.baselines[d.baselines.length - 1]?.version ?? 1}).
          </div>
        )}
        {importing && <ImportWizard p={p} locked={locked} nextVer={versions.length + 1} onDone={imported} onClose={() => setImporting(false)} />}
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1000px]`}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 w-[120px] text-left`}>Mã</th>
                <th className={`${erp.th} border-t-0 text-left`}>Tên</th>
                <th className={`${erp.th} border-t-0 w-32`}>Loại WP</th>
                <th className={`${erp.th} border-t-0 text-right w-16`}>SP</th>
                <th className={`${erp.th} border-t-0 w-24`}>Release</th>
                <th className={`${erp.th} border-t-0 w-44 text-left`}>Owner</th>
                <th className={`${erp.th} border-t-0 w-28`}>Trạng thái</th>
                <th className={`${erp.th} border-t-0 border-r-0 w-24`}></th>
              </tr>
            </thead>
            <tbody>
              {features.map((f) => {
                const isOpen = open.has(f.code);
                const sp = f.wps.reduce((s, w) => s + (w.sp || 0), 0);
                const miss = f.wps.filter((w) => wpMissing(w).length).length;
                return (
                  <React.Fragment key={f.code}>
                    <tr className="bg-[#eef3fa] hover:bg-[#e3ecf8] cursor-pointer" onClick={() => toggle(f.code)}>
                      <td className={`${erp.td} border-l-0 font-mono font-bold text-[#1e3a5f]`}>
                        <span className="inline-flex items-center gap-1">
                          {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                          {f.code}
                        </span>
                      </td>
                      <td className={`${erp.td} font-semibold text-slate-800`}>
                        {f.name} {f.foundation && <Tag cls="ml-1 bg-slate-100 text-slate-600 border-slate-300">Nền</Tag>}
                        <span className="ml-2 text-[11px] font-normal text-slate-500">giá trị phân bổ {fmtTy(f.allocValue)}</span>
                      </td>
                      <td className={`${erp.td} text-center text-slate-500 text-[11.5px]`}>{f.wps.length} WP</td>
                      <td className={`${erp.td} ${erp.num} font-bold`}>{sp}</td>
                      <td className={`${erp.td} text-center whitespace-nowrap`}>{f.foundation ? <span className="text-[11.5px] text-slate-500">Mọi release</span> : f.release}</td>
                      <td className={erp.td} colSpan={2}>
                        {miss > 0 && (
                          <span className="text-amber-700 text-[11.5px] inline-flex items-center gap-1">
                            <AlertTriangle size={12} /> {miss} WP thiếu thông tin
                          </span>
                        )}
                      </td>
                      <td className={`${erp.td} border-r-0`} />
                    </tr>
                    {isOpen &&
                      f.wps.map((w) => {
                        const editing = edit?.code === w.code;
                        const miss2 = wpMissing(w);
                        const e = editing ? edit! : w;
                        return (
                          <tr key={w.code} className={editing ? 'bg-[#fffbea]' : erp.tr}>
                            <td className={`${erp.td} border-l-0 pl-6 ${erp.code}`}>{w.code}</td>
                            <td className={erp.td}>
                              {editing ? <input value={e.name} onChange={(ev) => setEdit({ ...e, name: ev.target.value })} className={`${IN} w-full`} /> : w.name}
                            </td>
                            <td className={`${erp.td} text-center`}>
                              {editing ? (
                                <select value={e.type} onChange={(ev) => setEdit({ ...e, type: ev.target.value as WpType })} className={`${SEL} w-full`}>
                                  {WP_TYPES.map((t) => (
                                    <option key={t}>{t}</option>
                                  ))}
                                </select>
                              ) : (
                                w.type
                              )}
                            </td>
                            <td className={`${erp.td} ${erp.num} ${!w.sp && !editing ? 'bg-amber-50' : ''}`}>
                              {editing ? (
                                <input
                                  value={e.sp || ''}
                                  onChange={(ev) => setEdit({ ...e, sp: Number(ev.target.value.replace(/\D/g, '')) || 0 })}
                                  className={`${IN} w-14 text-right ${!e.sp ? 'border-amber-400' : ''}`}
                                />
                              ) : (
                                w.sp || '—'
                              )}
                            </td>
                            <td className={`${erp.td} text-center ${!w.release && !editing ? 'bg-amber-50' : ''}`}>
                              {editing ? (
                                <select value={e.release} onChange={(ev) => setEdit({ ...e, release: ev.target.value })} className={`${SEL} w-full ${!e.release ? 'border-amber-400' : ''}`}>
                                  <option value="">—</option>
                                  {relCodes.map((r) => (
                                    <option key={r}>{r}</option>
                                  ))}
                                </select>
                              ) : (
                                w.release || '—'
                              )}
                            </td>
                            <td className={`${erp.td} whitespace-nowrap ${!w.owner && !editing ? 'bg-amber-50' : ''}`}>
                              {editing ? (
                                <select value={e.owner} onChange={(ev) => setEdit({ ...e, owner: ev.target.value })} className={`${SEL} w-full ${!e.owner ? 'border-amber-400' : ''}`}>
                                  <option value="">— Chưa gán —</option>
                                  {OWNERS.map((o) => (
                                    <option key={o}>{o}</option>
                                  ))}
                                </select>
                              ) : (
                                w.owner || <span className="text-amber-700">Chưa gán</span>
                              )}
                            </td>
                            <td className={`${erp.td} text-center`}>
                              <Tag cls={STATUS_CLS[w.status]}>{w.status}</Tag>
                            </td>
                            <td className={`${erp.td} border-r-0 text-center whitespace-nowrap`}>
                              {editing ? (
                                <span className="inline-flex gap-1">
                                  <button type="button" onClick={saveEdit} className="p-1 rounded-[3px] text-emerald-700 hover:bg-emerald-50 cursor-pointer" title="Lưu">
                                    <Check size={14} />
                                  </button>
                                  <button type="button" onClick={() => setEdit(null)} className="p-1 rounded-[3px] text-slate-500 hover:bg-slate-100 cursor-pointer" title="Huỷ">
                                    <X size={14} />
                                  </button>
                                </span>
                              ) : locked ? (
                                miss2.length ? <span className="text-[11px] text-amber-700">thiếu {miss2.join(', ')}</span> : <span className="text-slate-300 text-[11px]">khoá</span>
                              ) : (
                                <span className="inline-flex items-center gap-1">
                                  {miss2.length > 0 && <span className="text-[11px] text-amber-700" title={`Thiếu ${miss2.join(', ')}`}>⚠</span>}
                                  <button type="button" onClick={() => setEdit({ ...w })} className="p-1 rounded-[3px] text-[#1f5fa8] hover:bg-[#eaf2fc] cursor-pointer" title="Sửa">
                                    <Pencil size={13} />
                                  </button>
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 px-3 py-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-slate-600">
          <b className="text-[#1e3a5f]">Phiên bản WBS:</b>
          {versions
            .slice()
            .reverse()
            .map((v) => (
              <span key={v.ver} className="inline-flex items-center gap-1">
                <Tag cls={v.status === 'Hiệu lực' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : v.status === 'Chờ CR' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200'}>
                  v{v.ver} · {v.status}
                </Tag>
                <span className="text-slate-500">
                  {dmy(v.at.slice(0, 10))} · {v.file} · {v.rows} dòng{v.errors ? `, bỏ ${v.errors} lỗi` : ''}
                </span>
              </span>
            ))}
        </div>
      </Panel>

      <Panel
        title="Master Plan & Release Plan"
        icon={CalendarRange}
        noPad
        footer={
          <>
            Sprint sinh tự động 2 tuần/sprint. Baseline tự tạo khi Scope Freeze pass; re-baseline chỉ sau CR duyệt (tối đa 10 phiên bản).{' '}
            {p.type !== 'BT' && (
              <b className={bufPct >= 10 ? 'text-emerald-700' : 'text-rose-700'}>
                RBuf {bufPct.toFixed(0)}% thời lượng P4 (yêu cầu ≥10% với QT/CL).
              </b>
            )}
          </>
        }
      >
        <ReleaseGantt p={p} releases={d.releases} />
        <div className="overflow-x-auto border-t border-slate-200">
          <table className={`${erp.table} min-w-[920px]`}>
            <thead>
              <tr>
                <th className={`${erp.th} border-l-0`}>Release</th>
                <th className={erp.th}>Từ – đến</th>
                <th className={`${erp.th} text-left`}>Mục tiêu</th>
                <th className={`${erp.th} text-right`}>SP planned</th>
                <th className={`${erp.th} text-right`}>Capacity</th>
                <th className={`${erp.th} text-right`}>Tải</th>
                <th className={`${erp.th} text-right`}>SP done</th>
                <th className={`${erp.th} border-r-0`}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {loads.map(({ r, load }) => {
                const over = r.spPlanned > r.capacity;
                return (
                  <tr key={r.code} className={erp.tr}>
                    <td className={`${erp.td} border-l-0 text-center font-semibold`}>{r.code}</td>
                    <td className={`${erp.td} text-center tabular-nums whitespace-nowrap`}>
                      {dmy(r.start)} – {dmy(r.end)}
                    </td>
                    <td className={erp.td}>{r.goal}</td>
                    <td className={`${erp.td} ${erp.num}`}>{r.spPlanned || '—'}</td>
                    <td className={`${erp.td} ${erp.num}`}>{r.capacity}</td>
                    <td className={`${erp.td} ${erp.num} font-semibold ${over ? 'text-rose-700' : load > 90 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {r.spPlanned ? `${load.toFixed(0)}%` : '—'}
                      {over && (
                        <Tag cls="ml-1 bg-rose-50 text-rose-700 border-rose-200" icon={AlertTriangle}>
                          Quá tải +{r.spPlanned - r.capacity} SP
                        </Tag>
                      )}
                    </td>
                    <td className={`${erp.td} ${erp.num}`}>{r.spDone || '—'}</td>
                    <td className={`${erp.td} border-r-0 text-center`}>
                      <Tag cls={STATUS_CLS[r.status]}>{r.status}</Tag>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="So sánh baseline" icon={GitCompare} noPad footer="Chênh lệch SP và ngày kết thúc release giữa 2 phiên bản — dữ liệu snapshot giả lập.">
        <BaselineCompare p={p} />
      </Panel>
    </div>
  );
};

// ==========================================================================
// Tab Thực thi (F4.2, F4.3)
// ==========================================================================
const BLOCK_REASONS = ['Requirement chưa rõ', 'Dependency nội bộ', 'Dependency khách', 'Môi trường', 'Nhân sự', 'Khác'] as const;

const ExecTab: React.FC<{ p: PmoProject }> = ({ p }) => {
  const sp = p.sprint;
  const [resolved, setResolved] = useStored(STORE.unblocked, p.id, () => ({}) as Record<string, Unblock>);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [noteTxt, setNoteTxt] = useState('');

  if (!sp.seq)
    return (
      <Panel title="Sprint hiện tại" icon={Timer}>
        <p className="py-4 text-center text-slate-400 italic text-[12px]">Dự án đang ở P{p.phase} — chưa chạy sprint. Sprint bắt đầu từ P4 (Phát triển).</p>
      </Panel>
    );

  const avg3 = Math.round(sp.velocity.slice(-3).reduce((a, b) => a + b, 0) / 3);
  const co = p.kpis.carriedOver;
  const dod = p.kpis.dodRate;
  const maxV = Math.max(...sp.velocity, sp.spPlanned) * 1.1;
  const H = 72;
  const blockedCodes = new Set(p.blocked.map((b) => b.wp));
  const key = (i: number) => `${p.blocked[i].wp}#${i}`;
  const closeBlock = (i: number) => {
    if (!noteTxt.trim()) return;
    const b = p.blocked[i];
    setResolved((cur) => ({ ...cur, [key(i)]: { note: noteTxt.trim(), at: now(), by: p.pm } }));
    logAudit(p.pm, 'Blocked', `${p.code} · ${b.wp}`, 'Gỡ block', `Blocked · ${b.reason}`, `Đã gỡ · ${noteTxt.trim()}`);
    setOpenKey(null);
    setNoteTxt('');
  };
  const dist = BLOCK_REASONS.map((r) => ({ r, n: p.blocked.filter((b) => b.reason === r).length, d: p.blocked.filter((b) => b.reason === r).reduce((s, b) => s + blockedDays(b.hours), 0) }));
  const maxN = Math.max(1, ...dist.map((x) => x.n));
  const openBlocks = p.blocked.filter((_, i) => !resolved[key(i)]).length;

  const stat = (l: string, v: React.ReactNode, s: string, tone: 'good' | 'warn' | 'bad' | 'neutral' = 'neutral') => (
    <div className="px-3 py-2 border-r border-slate-200 last:border-r-0 min-w-0">
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">{l}</p>
      <p className={`text-[17px] font-bold tabular-nums leading-tight ${tone === 'good' ? 'text-emerald-700' : tone === 'warn' ? 'text-amber-700' : tone === 'bad' ? 'text-rose-700' : 'text-slate-900'}`}>{v}</p>
      <p className="text-[11px] text-slate-500 truncate">{s}</p>
    </div>
  );

  return (
    <div className="space-y-3">
      <Panel title={`Sprint ${sp.seq} · ${dmy(sp.start)} → ${dmy(sp.end)}`} icon={Timer} noPad>
        <div className="grid grid-cols-2 md:grid-cols-5 border-b border-slate-200">
          {stat('SP planned', sp.spPlanned, `${sp.wps.length} WP trong sprint`)}
          {stat('SP done', sp.spDone, `${pct(sp.spDone, sp.spPlanned).toFixed(0)}% planned`, sp.spDone >= sp.spPlanned * 0.85 ? 'good' : 'warn')}
          {stat('Carried-over', `${Math.round(co)}%`, 'ngưỡng vàng 15% · đỏ 25%', co >= 25 ? 'bad' : co >= 15 ? 'warn' : 'good')}
          {stat('DoD first-pass', `${Math.round(dod)}%`, 'pass DoD lần đầu / WP submit', dod < 75 ? 'bad' : dod < 90 ? 'warn' : 'good')}
          {stat('Velocity TB 3 sprint', `${avg3} SP`, `plan ${sp.spPlanned} SP/sprint · ${pct(avg3, sp.spPlanned).toFixed(0)}%`, avg3 >= sp.spPlanned * 0.9 ? 'good' : avg3 >= sp.spPlanned * 0.75 ? 'warn' : 'bad')}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr]">
          <div className="px-3 pt-2 pb-2 border-b xl:border-b-0 xl:border-r border-slate-200">
            <p className="text-[11px] font-semibold text-slate-600 mb-1">Velocity 6 sprint gần nhất (SP done pass DoD)</p>
            <div className="relative flex items-end gap-2" style={{ height: H + 16 }}>
              <div className="absolute left-0 right-0 border-t-2 border-dashed border-[#1f5fa8]/70 z-10" style={{ bottom: 14 + (sp.spPlanned / maxV) * H }}>
                <span className="absolute right-0 -top-4 text-[10px] text-[#1f5fa8] font-semibold bg-white px-0.5">plan {sp.spPlanned}</span>
              </div>
              {sp.velocity.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full min-w-0" title={`Sprint ${sp.seq - 5 + i}: ${v} SP`}>
                  <span className="text-[10px] text-slate-600 tabular-nums">{v}</span>
                  <div className={`w-full max-w-[36px] rounded-t-[2px] ${v >= sp.spPlanned * 0.9 ? 'bg-emerald-500' : v >= sp.spPlanned * 0.75 ? 'bg-amber-400' : 'bg-rose-500'}`} style={{ height: (v / maxV) * H }} />
                  <span className="text-[10px] text-slate-400 h-[14px] leading-[14px]">S{sp.seq - 5 + i}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className={`${erp.table} min-w-[560px]`}>
              <thead>
                <tr>
                  <th className={`${erp.th} border-t-0 border-l-0`}>WP</th>
                  <th className={`${erp.th} border-t-0 text-left`}>Tên</th>
                  <th className={`${erp.th} border-t-0 text-left`}>Owner</th>
                  <th className={`${erp.th} border-t-0 text-right w-12`}>SP</th>
                  <th className={`${erp.th} border-t-0 w-24`}>Trạng thái</th>
                  <th className={`${erp.th} border-t-0 w-20`}>Blocked?</th>
                  <th className={`${erp.th} border-t-0 border-r-0 w-16`}>Reopen</th>
                </tr>
              </thead>
              <tbody>
                {sp.wps.map((w) => {
                  const bl = w.status === 'Blocked' || blockedCodes.has(w.wp);
                  return (
                    <tr key={w.wp} className={erp.tr}>
                      <td className={`${erp.td} border-l-0 ${erp.code}`}>{w.wp}</td>
                      <td className={erp.td}>{w.name}</td>
                      <td className={`${erp.td} whitespace-nowrap`}>{w.owner}</td>
                      <td className={`${erp.td} ${erp.num}`}>{w.sp}</td>
                      <td className={`${erp.td} text-center`}>
                        <Tag cls={STATUS_CLS[w.status]}>{w.status}</Tag>
                      </td>
                      <td className={`${erp.td} text-center`}>{bl ? <Tag cls="bg-rose-50 text-rose-700 border-rose-200">Có</Tag> : <span className="text-slate-400">—</span>}</td>
                      <td className={`${erp.td} border-r-0 text-center ${w.reopen ? 'text-rose-700 font-bold' : 'text-slate-400'}`}>{w.reopen || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-[3fr_1fr] gap-3">
        <Panel
          title={
            <>
              WP bị chặn <span className={`ml-1 px-1.5 rounded-[3px] text-white text-[11px] ${openBlocks ? 'bg-rose-600' : 'bg-emerald-600'}`}>{openBlocks}</span>
            </>
          }
          icon={AlertTriangle}
          noPad
          footer="SLA giải quyết 1 ngày làm việc (8 giờ/ngày): >1 ngày cảnh báo PM (vàng), >2 ngày cảnh báo GĐSX (đỏ). Gỡ block bắt buộc ghi chú cách xử lý."
        >
          <div className="overflow-x-auto">
            <table className={`${erp.table} min-w-[820px]`}>
              <thead>
                <tr>
                  <th className={`${erp.th} border-t-0 border-l-0`}>WP</th>
                  <th className={`${erp.th} border-t-0 text-left`}>Tên</th>
                  <th className={`${erp.th} border-t-0 text-left`}>Nguyên nhân</th>
                  <th className={`${erp.th} border-t-0 text-left`}>Người xử lý</th>
                  <th className={`${erp.th} border-t-0 text-right w-24`}>Đã chặn</th>
                  <th className={`${erp.th} border-t-0 w-28`}>SLA</th>
                  <th className={`${erp.th} border-t-0 border-r-0 w-[220px]`}></th>
                </tr>
              </thead>
              <tbody>
                {p.blocked.map((b, i) => {
                  const k = key(i);
                  const dd = blockedDays(b.hours);
                  const res = resolved[k];
                  const isOpen = openKey === k;
                  return (
                    <tr key={k} className={res ? 'bg-slate-50 text-slate-400' : isOpen ? 'bg-[#fffbea]' : erp.tr}>
                      <td className={`${erp.td} border-l-0 ${erp.code}`}>{b.wp}</td>
                      <td className={erp.td}>{b.name}</td>
                      <td className={erp.td}>{b.reason}</td>
                      <td className={`${erp.td} whitespace-nowrap`}>{b.owner}</td>
                      <td className={`${erp.td} ${erp.num}`}>
                        {dd.toFixed(1)} ngày <span className="text-[10.5px] text-slate-400">({b.hours}h)</span>
                      </td>
                      <td className={`${erp.td} text-center`}>
                        {res ? (
                          <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-200">Đã gỡ</Tag>
                        ) : dd > 2 ? (
                          <Tag cls="bg-rose-50 text-rose-700 border-rose-200">Quá 2 ngày</Tag>
                        ) : dd > 1 ? (
                          <Tag cls="bg-amber-50 text-amber-700 border-amber-200">Quá 1 ngày</Tag>
                        ) : (
                          <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-200">Trong SLA</Tag>
                        )}
                      </td>
                      <td className={`${erp.td} border-r-0`}>
                        {res ? (
                          <span className="text-[11.5px]">
                            {dmy(res.at.slice(0, 10))} {res.at.slice(11)} · {res.note}
                          </span>
                        ) : isOpen ? (
                          <span className="flex items-center gap-1">
                            <input
                              autoFocus
                              value={noteTxt}
                              onChange={(e) => setNoteTxt(e.target.value)}
                              onKeyDown={(e) => (e.key === 'Enter' ? closeBlock(i) : e.key === 'Escape' ? setOpenKey(null) : null)}
                              placeholder="Ghi chú cách xử lý…"
                              className={`${IN} flex-1 min-w-0 ${!noteTxt.trim() ? 'border-amber-400' : ''}`}
                            />
                            <Btn variant="success" className="h-7 px-2" disabled={!noteTxt.trim()} onClick={() => closeBlock(i)}>
                              Đóng
                            </Btn>
                            <button type="button" onClick={() => setOpenKey(null)} className="p-1 text-slate-500 hover:text-rose-600 cursor-pointer" title="Huỷ">
                              <X size={14} />
                            </button>
                          </span>
                        ) : (
                          <Btn icon={Unlock} className="h-7" onClick={() => (setOpenKey(k), setNoteTxt(''))}>
                            Gỡ block
                          </Btn>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {!p.blocked.length && (
                  <tr>
                    <td colSpan={7} className="px-3 py-5 text-center text-slate-400 italic">
                      Không có WP nào đang bị chặn.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Phân bố nguyên nhân block" icon={Filter} footer="Đầu vào cải tiến quy trình (BA clarification SLA, vendor…).">
          <div className="space-y-1.5">
            {dist.map((x) => (
              <div key={x.r} className="text-[12px]">
                <div className="flex justify-between">
                  <span className="text-slate-700">{x.r}</span>
                  <span className="tabular-nums text-slate-600">
                    <b className="text-slate-900">{x.n}</b>
                    {x.n > 0 && <span className="text-slate-400"> · {x.d.toFixed(1)} ngày</span>}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-sm overflow-hidden">
                  <div className="h-full bg-rose-400" style={{ width: `${(x.n / maxN) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
};

// ==========================================================================
// Tab Lịch sử (F12.3)
// ==========================================================================
const HistoryTab: React.FC<{ p: PmoProject; submitted: GateSubmit | null }> = ({ p, submitted }) => {
  const d = projectDetail(p);
  const [ent, setEnt] = useState('');
  const [q, setQ] = useState('');
  const gates = [
    ...d.gates.map((g) => ({ ...g, session: false })),
    ...(submitted ? [{ gate: submitted.gate, submittedAt: submitted.at.slice(0, 10), decidedAt: '', decision: 'Chờ duyệt' as const, approvers: submitted.approver, note: 'Trình trong phiên này', session: true }] : []),
  ].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const log = useMemo(
    () => [...STORE.audit.filter((a) => a.entityId.startsWith(p.code)), ...AUDIT_LOG.filter((a) => a.entityId.startsWith(p.code))].sort((a, b) => b.at.localeCompare(a.at)),
    // STORE.audit đổi theo thao tác; tính lại mỗi lần mở tab
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p.code, submitted],
  );
  const ents = [...new Set(log.map((a) => a.entity))];
  const rows = log.filter((a) => (!ent || a.entity === ent) && (!q || `${a.actor} ${a.action} ${a.entityId} ${a.before} ${a.after}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-3 items-start">
        <Panel title="Timeline gate" icon={BadgeCheck} noPad footer="Gate pass ghi audit: người duyệt, thời điểm, phiên bản checklist. Không sửa checklist sau khi pass.">
          {gates.length ? (
            <ol className="px-3 py-2 space-y-0">
              {gates.map((g, i) => (
                <li key={i} className="relative pl-5 pb-2 last:pb-0">
                  {i < gates.length - 1 && <span className="absolute left-[5px] top-3 bottom-0 border-l border-slate-300" />}
                  <span className={`absolute left-0 top-1 w-[11px] h-[11px] rounded-full border-2 border-white ring-1 ${g.decision === 'Pass' ? 'bg-emerald-500 ring-emerald-300' : g.decision === 'Từ chối' ? 'bg-rose-500 ring-rose-300' : 'bg-sky-500 ring-sky-300'}`} />
                  <div className="flex flex-wrap items-center gap-x-2 text-[12px]">
                    <b className="text-slate-800">{g.gate}</b>
                    <Tag cls={g.decision === 'Pass' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : g.decision === 'Từ chối' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-sky-50 text-sky-700 border-sky-200'}>{g.decision}</Tag>
                    <span className="text-slate-500 tabular-nums">
                      trình {dmy(g.submittedAt)}
                      {g.decidedAt && ` · quyết ${dmy(g.decidedAt)}`}
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-600">
                    Người duyệt: {g.approvers} · {g.note}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="px-3 py-4 text-center text-slate-400 italic text-[12px]">Chưa có gate nào được trình.</p>
          )}
        </Panel>
        <Panel title="Baseline" icon={GitCompare} noPad footer="Baseline v1 tự tạo khi Scope Freeze pass; mỗi re-baseline ghi ai / khi nào / lý do.">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 w-16`}>Phiên bản</th>
                <th className={`${erp.th} border-t-0 w-24`}>Ngày</th>
                <th className={`${erp.th} border-t-0 text-left`}>Lý do</th>
                <th className={`${erp.th} border-t-0 border-r-0 text-left`}>Người tạo</th>
              </tr>
            </thead>
            <tbody>
              {d.baselines
                .slice()
                .reverse()
                .map((b) => (
                  <tr key={b.version} className={erp.tr}>
                    <td className={`${erp.td} border-l-0 text-center font-bold`}>v{b.version}</td>
                    <td className={`${erp.td} text-center tabular-nums`}>{dmy(b.at)}</td>
                    <td className={erp.td}>{b.reason}</td>
                    <td className={`${erp.td} border-r-0 whitespace-nowrap`}>{b.by}</td>
                  </tr>
                ))}
              {!d.baselines.length && (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-slate-400 italic">
                    Chưa có baseline (dự án chưa qua Scope Freeze).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Panel>
      </div>

      <Panel
        title={
          <>
            Audit log dự án <span className="font-normal normal-case text-slate-500 tracking-normal">· {rows.length} bản ghi</span>
          </>
        }
        icon={History}
        noPad
        footer="Log không sửa/xoá được, lưu tối thiểu 5 năm. Mới nhất ở trên. Bản ghi mã SS… phát sinh trong phiên làm việc này."
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
          <FilterCell label="Đối tượng">
            <select value={ent} onChange={(e) => setEnt(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              {ents.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </FilterCell>
          <FilterCell label="Tìm">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="người, hành động, giá trị…" className={`${IN} w-56`} />
          </FilterCell>
        </div>
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[960px]`}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 w-32`}>Thời điểm</th>
                <th className={`${erp.th} border-t-0 text-left`}>Người</th>
                <th className={`${erp.th} border-t-0 text-left`}>Đối tượng</th>
                <th className={`${erp.th} border-t-0 text-left`}>Hành động</th>
                <th className={`${erp.th} border-t-0 text-left`}>Trước</th>
                <th className={`${erp.th} border-t-0 text-left`}>Sau</th>
                <th className={`${erp.th} border-t-0 border-r-0 w-24`}>IP</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id} className={erp.tr}>
                  <td className={`${erp.td} border-l-0 tabular-nums whitespace-nowrap`}>
                    {dmy(a.at.slice(0, 10))} {a.at.slice(11)}
                  </td>
                  <td className={`${erp.td} whitespace-nowrap`}>{a.actor}</td>
                  <td className={erp.td}>
                    <Tag cls="bg-slate-50 text-slate-600 border-slate-200">{a.entity}</Tag> <span className="text-[11.5px] text-slate-600">{a.entityId.replace(`${p.code} · `, '')}</span>
                  </td>
                  <td className={erp.td}>{a.action}</td>
                  <td className={`${erp.td} text-slate-500`}>{a.before}</td>
                  <td className={`${erp.td} font-semibold text-slate-800`}>{a.after}</td>
                  <td className={`${erp.td} border-r-0 text-center text-[11px] text-slate-400 tabular-nums`}>{a.ip}</td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={7} className="px-3 py-5 text-center text-slate-400 italic">
                    Không có bản ghi nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};

// ==========================================================================
// PMO-06 Chi tiết dự án
// ==========================================================================
type TabKey = 'overview' | 'plan' | 'exec' | 'quality' | 'finance' | 'risk' | 'resource' | 'history';
const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { key: 'plan', label: 'Kế hoạch', icon: CalendarRange },
  { key: 'exec', label: 'Thực thi', icon: Timer },
  { key: 'quality', label: 'Chất lượng', icon: BadgeCheck },
  { key: 'finance', label: 'Tài chính', icon: Wallet },
  { key: 'risk', label: 'Rủi ro/CR', icon: ShieldAlert },
  { key: 'resource', label: 'Nguồn lực', icon: Users },
  { key: 'history', label: 'Lịch sử', icon: History },
];
let lastTab: TabKey = 'overview';

const ProjectDetailView: React.FC<{ p: PmoProject; onBack: () => void; onNavigate?: (item: string) => void }> = ({ p, onBack, onNavigate }) => {
  const { setFocusId } = usePmo();
  const [tab, setTabState] = useState<TabKey>(lastTab);
  const setTab = (t: TabKey) => {
    lastTab = t;
    setTabState(t);
  };
  const [rows, setRowsStored] = useStored(STORE.checklist, p.id, () => projectDetail(p).checklist.map((c) => ({ ...c, reason: '' })));
  const setRows = (r: CheckRow[]) => setRowsStored(() => r);
  const [submitted, setSubmitted] = useStored(STORE.gate, p.id, () => null);
  const s = checkStats(rows);
  const ecvPct = pct(p.ecv, p.contractValue);
  const ecvPlanPct = pct(p.ecvPlan, p.contractValue);

  const submit = () => {
    if (!s.canSubmit || submitted) return;
    const g: GateSubmit = { gate: p.nextGate, at: now(), by: p.pm, approver: APPROVERS[p.type] };
    setSubmitted(() => g);
    logAudit(p.pm, 'Gate', `${p.code} · ${p.nextGate}`, 'Trình gate', `Checklist P${p.phase} ${s.pct}%`, `Chờ ${APPROVERS[p.type]} duyệt`);
  };

  return (
    <ErpPage>
      <ErpTitleBar
        onBack={onBack}
        backLabel="Quay lại danh sách"
        title={
          <>
            <span className={erp.code}>{p.code}</span> {p.name} <TypeTag t={p.type} />
          </>
        }
        actions={
          <>
            <Btn
              icon={Gauge}
              onClick={() => {
                setFocusId(p.id);
                onNavigate?.('Project Cockpit');
              }}
            >
              Mở Cockpit
            </Btn>
            <Btn variant="primary" icon={Send} disabled={!s.canSubmit || !!submitted} onClick={submit} title={!s.canSubmit ? 'Checklist bắt buộc chưa đủ 100%' : ''}>
              {submitted ? 'Đã trình gate' : `Trình gate ${p.nextGate}`}
            </Btn>
          </>
        }
        meta={[
          { label: 'Khối', value: p.khoi },
          { label: 'Khách', value: p.client },
          { label: 'PM', value: p.pm },
          { label: 'Hợp đồng', value: `${dmy(p.start)} → ${dmy(p.end)}` },
          { label: 'Giá trị HĐ', value: `${fmtTy(p.contractValue)} VNĐ` },
          { label: 'Ban điều hành', value: BOARD_LABEL[p.type] },
        ]}
        notice={submitted ? <GateStatusLine submitted={submitted} rows={rows} gate={p.nextGate} /> : undefined}
      />

      {/* Header cố định */}
      <div className="sticky top-0 z-20 bg-white border border-slate-300 rounded-[4px] grid grid-cols-1 md:grid-cols-[auto_1fr_auto]">
        <div className="px-3 py-1.5 border-b md:border-b-0 md:border-r border-slate-200 flex items-center gap-2">
          <HealthBadge h={p.health} />
          <span className="text-[11px] text-slate-500 leading-tight max-w-[180px]" title={p.drivers.map((d) => `#${d.no} ${d.label}`).join(', ')}>
            {p.drivers.length ? `do ${p.drivers.map((d) => `#${d.no}`).join(', ')}` : '9/9 KPI đạt'}
          </span>
        </div>
        <div className="px-3 py-1.5 border-b md:border-b-0 md:border-r border-slate-200 min-w-0 flex flex-wrap items-center gap-x-3 gap-y-1">
          <div className="overflow-x-auto">
            <PhaseStrip phase={p.phase} short />
          </div>
          <span className="text-[11px] text-slate-500">
            Gate kế tiếp <b className="text-slate-700">{p.nextGate}</b> · hạn {dmy(p.phaseDue)} · checklist <b className={s.reqPct === 100 ? 'text-emerald-700' : 'text-amber-700'}>{s.pct}%</b>
          </span>
        </div>
        <div className="px-3 py-1.5 flex items-center gap-2">
          <span className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">ECV đã ghi nhận</span>
          <b className="text-[15px] tabular-nums text-slate-900">{fmtTy(p.ecv)}</b>
          <span className={`text-[12px] font-semibold tabular-nums ${ecvPct >= ecvPlanPct ? 'text-emerald-700' : 'text-rose-700'}`}>
            {ecvPct.toFixed(0)}% HĐ
          </span>
          <span className="text-[11px] text-slate-400 tabular-nums">plan {ecvPlanPct.toFixed(0)}%</span>
        </div>
      </div>

      <div>
        <FolderTabs tabs={TABS} value={tab} onChange={setTab} />
        <div className="pt-3">
          {tab === 'overview' && <OverviewTab p={p} rows={rows} setRows={setRows} submitted={submitted} onSubmit={submit} />}
          {tab === 'plan' && <PlanTab p={p} />}
          {tab === 'exec' && <ExecTab p={p} />}
          {tab === 'quality' && <QualityTab project={p} />}
          {tab === 'finance' && <FinanceTab project={p} />}
          {tab === 'risk' && <RiskCrTab project={p} />}
          {tab === 'resource' && <ResourceTab project={p} />}
          {tab === 'history' && <HistoryTab p={p} submitted={submitted} />}
        </div>
      </div>
    </ErpPage>
  );
};

/** Chi tiết rút gọn cho dự án vừa tạo từ ERP: thông tin + checklist P1. */
const NewProjectDetail: React.FC<{ np: NewProject; onBack: () => void }> = ({ np, onBack }) => {
  const [rows, setRowsStored] = useStored(STORE.checklist, np.id, () => PHASE_CHECKLIST[1].map((it) => ({ ...it, done: false, evidence: '', reason: '' })));
  const s = checkStats(rows);
  return (
    <ErpPage>
      <ErpTitleBar
        onBack={onBack}
        backLabel="Quay lại danh sách"
        title={
          <>
            <span className={erp.code}>{np.code}</span> {np.name} <TypeTag t={np.type} /> <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-200">Mới tạo</Tag>
          </>
        }
        meta={[
          { label: 'Khối', value: np.khoi },
          { label: 'Khách', value: np.client },
          { label: 'PM', value: np.pm },
          { label: 'Hợp đồng', value: `${dmy(np.start)} → ${dmy(np.end)}` },
          { label: 'Giá trị HĐ', value: `${fmtTy(np.contractValue)} VNĐ` },
          { label: 'Ban điều hành', value: BOARD_LABEL[np.type] },
        ]}
      />
      <div className="bg-white border border-slate-300 rounded-[4px] px-3 py-1.5 flex flex-wrap items-center gap-3">
        <Tag cls="bg-slate-100 text-slate-600 border-slate-300">Health chưa tính</Tag>
        <PhaseStrip phase={1} short />
        <span className="text-[11px] text-slate-500">Health tính từ khi có dữ liệu KPI (đêm đầu tiên sau khi đồng bộ Jira). ECV: 0 ₫.</span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-3">
        <ContractPanel p={np} erpRef={np.erpRef || '—'} ecv={0} />
        <BoardPanel khoi={np.khoi} type={np.type} pm={np.pm} client={np.client} />
      </div>
      <Panel
        title="Checklist P1 Khởi động"
        icon={ListTree}
        noPad
        actions={<ChecklistProgress rows={rows} />}
        footer="Không cho chuyển phase thủ công. Hoàn tất checklist P1 để bắt đầu Discovery; gate đầu tiên là Scope Freeze (cuối P2)."
      >
        {s.reqPct === 100 && <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 text-[12px] border-b border-slate-200">Checklist P1 bắt buộc đã đủ 100%.</div>}
        <Checklist rows={rows} onChange={(r) => setRowsStored(() => r)} locked={false} actor={np.pm} code={np.code} />
      </Panel>
    </ErpPage>
  );
};

// ==========================================================================
// PMO-05 Danh sách dự án
// ==========================================================================
/** Hợp đồng đã ký trên ERP chưa có dự án (mẫu) — chọn để điền sẵn. */
const ERP_PENDING = [
  { ref: 'HĐ-2026/118', khoi: 'G1' as Khoi, name: 'Số hoá hồ sơ đất đai Thái Bình', client: 'Sở TN&MT Thái Bình', value: 8_400_000_000, start: '2026-11-02', end: '2027-08-31' },
  { ref: 'HĐ-2026/121', khoi: 'BFSI' as Khoi, name: 'Hệ thống chấm điểm tín dụng', client: 'MB Bank', value: 21_500_000_000, start: '2026-11-16', end: '2027-10-30' },
  { ref: 'HĐ-2026/124', khoi: 'YT' as Khoi, name: 'Kết nối liên thông đơn thuốc', client: 'BV Đa khoa Đà Nẵng', value: 6_750_000_000, start: '2026-12-01', end: '2027-06-30' },
];
const PM_LIST = [...new Set(PMO_PROJECTS.map((p) => p.pm))].sort();

interface Draft {
  erpRef: string;
  khoi: string;
  name: string;
  client: string;
  value: string;
  start: string;
  end: string;
  type: string;
  pm: string;
}
const EMPTY: Draft = { erpRef: '', khoi: '', name: '', client: '', value: '', start: '', end: '', type: '', pm: '' };

const genCode = (khoi: string, created: NewProject[]) => {
  if (!khoi) return '';
  const yyyy = TODAY.slice(0, 4);
  const prefix = `${khoi}-${yyyy}-`;
  const seqs = [...PMO_PROJECTS.map((p) => p.code), ...created.map((p) => p.code)].filter((c) => c.startsWith(prefix)).map((c) => Number(c.slice(prefix.length)));
  return `${prefix}${String((seqs.length ? Math.max(...seqs) : 0) + 1).padStart(3, '0')}`;
};

export const PmoProjectPage: React.FC<{ onNavigate?: (item: string) => void }> = ({ onNavigate }) => {
  const { projects } = usePmo();
  const [created, setCreated] = useState<NewProject[]>(() => STORE.created);
  const [sel, setSel] = useState<string | null>(null);
  const [khoi, setKhoi] = useState('');
  const [type, setType] = useState('');
  const [phase, setPhase] = useState('');
  const [health, setHealth] = useState('');
  const [q, setQ] = useState('');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [tried, setTried] = useState(false);
  const [flash, setFlash] = useState('');

  const match = (x: { code: string; name: string; client: string; pm: string }) => !q || `${x.code} ${x.name} ${x.client} ${x.pm}`.toLowerCase().includes(q.trim().toLowerCase());
  const rows = useMemo(
    () => projects.filter((p) => (!khoi || p.khoi === khoi) && (!type || p.type === type) && (!phase || String(p.phase) === phase) && (!health || p.health === health) && match(p)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projects, khoi, type, phase, health, q],
  );
  const newRows = created.filter((p) => (!khoi || p.khoi === khoi) && (!type || p.type === type) && (!phase || phase === '1') && !health && match(p));

  const selP = sel ? projects.find((p) => p.id === sel) : undefined;
  const selN = sel ? created.find((p) => p.id === sel) : undefined;
  if (selP) return <ProjectDetailView key={selP.id} p={selP} onBack={() => setSel(null)} onNavigate={onNavigate} />;
  if (selN) return <NewProjectDetail key={selN.id} np={selN} onBack={() => setSel(null)} />;

  // ---- dòng tạo mới ----
  const val = draft ? Number(draft.value.replace(/\D/g, '')) : 0;
  const missing = draft
    ? ([
        ['khoi', 'Khối'],
        ['name', 'Tên'],
        ['client', 'Khách hàng'],
        ['value', 'Giá trị HĐ'],
        ['start', 'Ngày bắt đầu'],
        ['end', 'Ngày kết thúc'],
        ['type', 'Loại'],
        ['pm', 'PM'],
      ] as const).filter(([k]) => (k === 'value' ? !val : !draft[k].trim()))
    : [];
  const dateErr = draft && draft.start && draft.end && draft.end <= draft.start ? 'Ngày kết thúc phải sau ngày bắt đầu' : '';
  const bad = (k: keyof Draft) => tried && missing.some(([m]) => m === k);
  const code = draft ? genCode(draft.khoi, created) : '';
  const pickErp = (ref: string) => {
    const c = ERP_PENDING.find((x) => x.ref === ref);
    if (!draft) return;
    setDraft(c ? { ...draft, erpRef: c.ref, khoi: c.khoi, name: c.name, client: c.client, value: String(c.value), start: c.start, end: c.end } : { ...draft, erpRef: '' });
  };
  const save = () => {
    setTried(true);
    if (!draft || missing.length || dateErr) return;
    const np: NewProject = {
      id: code,
      code,
      name: draft.name.trim(),
      khoi: draft.khoi as Khoi,
      type: draft.type as ProjType,
      client: draft.client.trim(),
      pm: draft.pm,
      contractValue: val,
      start: draft.start,
      end: draft.end,
      erpRef: draft.erpRef,
      createdAt: now(),
    };
    STORE.created = [np, ...STORE.created];
    setCreated(STORE.created);
    logAudit('Finance (ERP)', 'Hợp đồng', np.code, 'Tạo dự án từ ERP', '—', `${np.name} · ${fmtVnd(val)} · ${np.type} · PM ${np.pm}`);
    setDraft(null);
    setTried(false);
    setFlash(`Đã tạo ${np.code} — ${np.name}`);
  };
  const usedErp = new Set(created.map((c) => c.erpRef));
  const total = rows.length + newRows.length;

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', 'Dự án']}
        title="Danh sách dự án"
        actions={
          <Btn
            variant="primary"
            icon={Plus}
            disabled={!!draft}
            onClick={() => {
              setDraft({ ...EMPTY });
              setTried(false);
              setFlash('');
            }}
          >
            Tạo dự án từ ERP
          </Btn>
        }
        notice={flash ? <div className="px-4 py-1.5 bg-emerald-50 text-emerald-800 text-[12px] flex items-center gap-1.5"><Check size={13} /> {flash}</div> : undefined}
      />

      <Panel
        title={
          <>
            Dự án <span className="font-normal normal-case text-slate-500 tracking-normal">· {total} dự án</span>
          </>
        }
        icon={LayoutDashboard}
        noPad
        footer="Mã dự án sinh tự động {KHỐI}-{YYYY}-{seq}. Hợp đồng nhận từ ERP; GĐSX gán PM và loại dự án. Bấm vào dòng để mở hồ sơ chi tiết."
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
          <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300">
            <Filter size={13} className="text-[#1f5fa8]" /> Lọc
          </span>
          <FilterCell label="Khối">
            <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              {KHOI.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </FilterCell>
          <FilterCell label="Loại">
            <select value={type} onChange={(e) => setType(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              {(['BT', 'QT', 'CL'] as ProjType[]).map((t) => (
                <option key={t} value={t}>
                  {t} · {PROJ_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </FilterCell>
          <FilterCell label="Phase">
            <select value={phase} onChange={(e) => setPhase(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              {PHASES.map((ph) => (
                <option key={ph.no} value={ph.no}>
                  P{ph.no} {ph.name}
                </option>
              ))}
            </select>
          </FilterCell>
          <FilterCell label="Health">
            <select value={health} onChange={(e) => setHealth(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              <option value="red">Đỏ</option>
              <option value="yellow">Vàng</option>
              <option value="green">Xanh</option>
            </select>
          </FilterCell>
          <label className="relative flex items-center">
            <Search size={13} className="absolute left-2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã, tên, khách, PM…" className={`${IN} pl-7 w-60`} />
          </label>
          {(khoi || type || phase || health || q) && (
            <button type="button" onClick={() => (setKhoi(''), setType(''), setPhase(''), setHealth(''), setQ(''))} className="text-[12px] text-[#1f5fa8] hover:underline cursor-pointer">
              Bỏ lọc
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1180px]`}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 text-left w-[130px]`}>Mã</th>
                <th className={`${erp.th} border-t-0 text-left`}>Tên dự án · khách hàng</th>
                <th className={`${erp.th} border-t-0 w-14`}>Khối</th>
                <th className={`${erp.th} border-t-0 w-28`}>Loại</th>
                <th className={`${erp.th} border-t-0 text-left`}>PM</th>
                <th className={`${erp.th} border-t-0 text-right w-20`}>Giá trị HĐ</th>
                <th className={`${erp.th} border-t-0 w-[150px]`}>Thời gian HĐ</th>
                <th className={`${erp.th} border-t-0`}>Phase</th>
                <th className={`${erp.th} border-t-0 w-16`}>Health</th>
                <th className={`${erp.th} border-t-0 border-r-0 text-left`}>Gate kế tiếp</th>
              </tr>
            </thead>
            <tbody>
              {draft && (
                <>
                  <tr className="bg-[#fffbea]">
                    <td colSpan={10} className={`${erp.td} border-l-0 border-r-0 py-1`}>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
                        <b className="text-[#1e3a5f]">Tạo dự án từ hợp đồng ERP</b>
                        <FilterCell label="Hợp đồng đã ký">
                          <select value={draft.erpRef} onChange={(e) => pickErp(e.target.value)} className={`${SEL} w-[300px]`}>
                            <option value="">— Chọn để điền sẵn (tuỳ chọn) —</option>
                            {ERP_PENDING.map((c) => (
                              <option key={c.ref} value={c.ref} disabled={usedErp.has(c.ref)}>
                                {c.ref} · {c.client} · {fmtTy(c.value)}
                                {usedErp.has(c.ref) ? ' (đã tạo)' : ''}
                              </option>
                            ))}
                          </select>
                        </FilterCell>
                        <span className="text-slate-500">Đơn vị tiền: VNĐ · trường có * là bắt buộc · mã tự sinh theo khối.</span>
                        {tried && (missing.length > 0 || dateErr) && (
                          <span className="text-rose-700 font-semibold">
                            {missing.length > 0 && `Thiếu: ${missing.map(([, l]) => l).join(', ')}. `}
                            {dateErr}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr className="bg-[#fffbea]">
                    <td className={`${erp.td} border-l-0 ${erp.code} text-[12px]`}>{code || <span className="text-slate-400 font-sans">chọn khối…</span>}</td>
                    <td className={`${erp.td} py-1`}>
                      <span className="flex gap-1">
                        <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Tên dự án *" className={`${IN} flex-[3] min-w-0 ${bad('name') ? 'border-rose-400' : ''}`} />
                        <input value={draft.client} onChange={(e) => setDraft({ ...draft, client: e.target.value })} placeholder="Khách hàng *" className={`${IN} flex-[2] min-w-0 ${bad('client') ? 'border-rose-400' : ''}`} />
                      </span>
                    </td>
                    <td className={`${erp.td} py-1`}>
                      <select value={draft.khoi} onChange={(e) => setDraft({ ...draft, khoi: e.target.value })} className={`${SEL} w-full ${bad('khoi') ? 'border-rose-400' : ''}`}>
                        <option value="">Khối *</option>
                        {KHOI.map((k) => (
                          <option key={k}>{k}</option>
                        ))}
                      </select>
                    </td>
                    <td className={`${erp.td} py-1`}>
                      <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value })} className={`${SEL} w-full ${bad('type') ? 'border-rose-400' : ''}`}>
                        <option value="">Loại *</option>
                        {(['BT', 'QT', 'CL'] as ProjType[]).map((t) => (
                          <option key={t} value={t}>
                            {t} · {PROJ_TYPE_LABEL[t]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={`${erp.td} py-1`}>
                      <select value={draft.pm} onChange={(e) => setDraft({ ...draft, pm: e.target.value })} className={`${SEL} w-full ${bad('pm') ? 'border-rose-400' : ''}`}>
                        <option value="">PM *</option>
                        {PM_LIST.map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </td>
                    <td className={`${erp.td} py-1`}>
                      <input
                        value={val ? val.toLocaleString('vi-VN') : ''}
                        onChange={(e) => setDraft({ ...draft, value: e.target.value.replace(/\D/g, '') })}
                        placeholder="Giá trị HĐ *"
                        inputMode="numeric"
                        title={val ? fmtTy(val) : ''}
                        className={`${IN} w-full text-right ${bad('value') ? 'border-rose-400' : ''}`}
                      />
                    </td>
                    <td className={`${erp.td} py-1`}>
                      <span className="flex items-center gap-1">
                        <input type="date" value={draft.start} onChange={(e) => setDraft({ ...draft, start: e.target.value })} className={`${IN} w-[118px] px-1 ${bad('start') || dateErr ? 'border-rose-400' : ''}`} />
                        <span className="text-slate-400">→</span>
                        <input type="date" value={draft.end} onChange={(e) => setDraft({ ...draft, end: e.target.value })} className={`${IN} w-[118px] px-1 ${bad('end') || dateErr ? 'border-rose-400' : ''}`} />
                      </span>
                    </td>
                    <td className={`${erp.td} text-center`}>
                      <PhaseStrip phase={1} compact />
                    </td>
                    <td className={`${erp.td} text-center text-[11px] text-slate-400`}>—</td>
                    <td className={`${erp.td} border-r-0 py-1`}>
                      <span className="flex gap-1">
                        <Btn variant="success" icon={Check} className="h-7 px-2" onClick={save}>
                          Lưu
                        </Btn>
                        <Btn className="h-7 px-2" onClick={() => (setDraft(null), setTried(false))}>
                          Huỷ
                        </Btn>
                      </span>
                    </td>
                  </tr>
                </>
              )}
              {newRows.map((p) => (
                <tr key={p.id} className={`${erp.tr} cursor-pointer`} onClick={() => setSel(p.id)}>
                  <td className={`${erp.td} border-l-0 ${erp.code} whitespace-nowrap`}>{p.code}</td>
                  <td className={`${erp.td} font-semibold text-slate-800`}>
                    {p.name} <Tag cls="ml-1 bg-emerald-50 text-emerald-700 border-emerald-200">Mới</Tag>
                    <span className="block text-[11px] font-normal text-slate-500">{p.client}</span>
                  </td>
                  <td className={`${erp.td} text-center`}>{p.khoi}</td>
                  <td className={`${erp.td} text-center`}>
                    <TypeTag t={p.type} />
                  </td>
                  <td className={`${erp.td} whitespace-nowrap`}>{p.pm}</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmtTy(p.contractValue)}</td>
                  <td className={`${erp.td} text-center tabular-nums whitespace-nowrap`}>
                    {dmyShort(p.start)} → {dmyShort(p.end)}
                  </td>
                  <td className={`${erp.td} text-center`}>
                    <span className="inline-flex">
                      <PhaseStrip phase={1} compact />
                    </span>
                  </td>
                  <td className={`${erp.td} text-center text-[11px] text-slate-400`}>Chưa tính</td>
                  <td className={`${erp.td} border-r-0 whitespace-nowrap`}>Scope Freeze (cuối P2)</td>
                </tr>
              ))}
              {rows.map((p) => {
                const due = Math.round(days(TODAY, p.phaseDue));
                return (
                  <tr key={p.id} className={`${erp.tr} cursor-pointer`} onClick={() => setSel(p.id)}>
                    <td className={`${erp.td} border-l-0 ${erp.code} whitespace-nowrap`}>{p.code}</td>
                    <td className={`${erp.td} font-semibold text-slate-800`}>
                      {p.name}
                      <span className="block text-[11px] font-normal text-slate-500">{p.client}</span>
                    </td>
                    <td className={`${erp.td} text-center`}>{p.khoi}</td>
                    <td className={`${erp.td} text-center`}>
                      <TypeTag t={p.type} />
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>{p.pm}</td>
                    <td className={`${erp.td} ${erp.num}`}>{fmtTy(p.contractValue)}</td>
                    <td className={`${erp.td} text-center tabular-nums whitespace-nowrap`} title={`${dmy(p.start)} → ${dmy(p.end)}`}>
                      {dmyShort(p.start)} → {dmyShort(p.end)}
                    </td>
                    <td className={`${erp.td} text-center`}>
                      <span className="inline-flex">
                        <PhaseStrip phase={p.phase} compact />
                      </span>
                    </td>
                    <td className={`${erp.td} text-center`}>
                      <HealthBadge h={p.health} small />
                    </td>
                    <td className={`${erp.td} border-r-0 whitespace-nowrap`}>
                      {p.nextGate} <span className={`text-[11px] tabular-nums ${due < 0 ? 'text-rose-700 font-semibold' : due <= 7 ? 'text-amber-700' : 'text-slate-500'}`}>· {dmy(p.phaseDue).slice(0, 5)}</span>
                    </td>
                  </tr>
                );
              })}
              {!total && !draft && (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-slate-400 italic">
                    Không có dự án nào khớp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </ErpPage>
  );
};
