/**
 * ContractsPage — "Contracts" (Human Resources) · Hợp đồng lao động, xây theo tài liệu iHRP (mục 3.1.1, 3.3).
 *
 *  Tab 1. Danh sách hợp đồng lao động — lọc theo NV / cơ cấu / tình trạng / số HĐ / loại HĐ / hiệu lực / hết hạn,
 *         ☑ Lấy HĐ mới nhất · Xoá (chọn nhiều) · Gửi mail · Import HĐ (xem trước Insert / Update / Lỗi) · Xuất Excel ·
 *         Xuất DL Import (đúng mẫu import) · bấm Sửa → tab 2.
 *  Tab 2. Hợp đồng lao động (theo nhân viên) — chọn NV (gõ mã / tên) → thông tin NV · form HĐ (Loại HĐ*, Số HĐ tự sinh,
 *         Hiệu lực*, Hết hiệu lực*, Mô tả công việc, Nơi làm việc, Thời gian làm việc, Người ký (mặc định theo Thiết lập),
 *         Chức danh, Ngày ký, Nơi ký, Giấy uỷ quyền, File, Lương cơ bản gốc × Mức hưởng %, Phụ cấp, Bảo hiểm, Ghi chú)
 *         · bảng HĐ của NV: In HĐ · Sửa · Sao chép · Xoá.
 *  Tab 3. Hết hạn & Tái ký — HĐ kết thúc trong khoảng ngày (HĐ mới nhất, NV còn làm) → chọn → nhập "Hợp đồng mới" → Tái ký
 *         hàng loạt (loại HĐ tự động: Thử việc → 12 tháng → 24 tháng → Không xác định thời hạn) · Gửi email nhắc · Xuất.
 *  Tab 4. Thiết lập người ký HĐ — Công ty*, Khối, Phòng ban, Loại NV, Ngày hiệu lực*, Loại HĐ* (chọn nhiều), Người ký*.
 *
 *  Quy tắc (theo iHRP): trường * bắt buộc · không cho 2 HĐ của 1 NV có thời gian hiệu lực giao nhau · HĐ chính thức đầu tiên
 *  có ngày hiệu lực ≠ Ngày vào chính thức → hỏi cập nhật · HĐ chính thức đầu tiên sau HĐ thử việc → ghi nhận quá trình làm việc
 *  từ ngày hiệu lực (ghi vào lịch sử hồ sơ) và chuyển trạng thái Thử việc → Đang làm việc.
 *  Dữ liệu dùng chung với màn Employees (hồ sơ NV chỉ hiện Loại hợp đồng). Sửa trực tiếp trên màn, không popup. ĐVT: VNĐ.
 */
import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import * as XLSX from 'xlsx';
import {
  AlertTriangle, Bell, CalendarClock, Check, ClipboardList, Copy, Download, FileSignature, FileSpreadsheet, Mail, Paperclip, Pencil,
  Plus, Printer, RefreshCw, RotateCcw, Save, Search, Settings2, Table2, Trash2, Upload, UserSearch, X,
} from 'lucide-react';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, KpiBox, Panel, Tag, erp } from './erp/Erp';
import { DIVISIONS } from '../business/BusinessProjectContext';
import {
  CONTRACT_META, CONTRACT_TYPES, COMPANIES, CheckBox, DEPARTMENTS, DateInput, EXTRA_MANAGERS, EmpAllowance, EmpContract, EmpFile, Employee,
  InfoGrid, POSITIONS, StatusTag, WORKPLACES, WORK_TIMES, addDays, contractEnd, contractNo, contractState, currentContract, dmy, getEmployees,
  nextContractType, norm, nowIso, parseDateCell, setEmployees, takeNavPayload, today, uid, useEmployees,
} from './EmployeePage';

const CRUMBS = ['Human Resources', 'Hợp đồng lao động'];
const ME = 'hr.lan';
const money = (n?: number) => (n ? Math.round(n).toLocaleString('en-US') : '');
const parseMoney = (s: string) => Number(String(s).replace(/[^\d]/g, '')) || 0;
const salaryOf = (c: EmpContract) => Math.round(((c.baseSalary || 0) * (c.rate ?? 100)) / 100);
const allowTotal = (c: EmpContract) => (c.allowances || []).reduce((s, a) => s + (a.amount || 0), 0);
const daysBetween = (a: string, b: string) => Math.round((new Date(`${b}T00:00:00`).getTime() - new Date(`${a}T00:00:00`).getTime()) / 86400000);
const isOfficial = (type: string) => type !== 'Thử việc';
const ALLOWANCE_NAMES = ['Phụ cấp ăn trưa', 'Phụ cấp điện thoại', 'Phụ cấp xăng xe', 'Phụ cấp trách nhiệm', 'Phụ cấp onsite', 'Phụ cấp nhà ở'];
const EMP_TYPES = ['Chính thức', 'Thử việc', 'Staffing'];
const empTypeOf = (e: Employee) => (e.status === 'Thử việc' ? 'Thử việc' : e.department === 'Staffing' ? 'Staffing' : 'Chính thức');

// ==========================================================================
// Thiết lập người ký HĐ (kho riêng, dùng chung giữa các tab)
// ==========================================================================
interface SignerSetting {
  id: string;
  company: string;
  division: string; // '' = tất cả
  department: string;
  empType: string;
  from: string; // ngày hiệu lực
  types: string[];
  signer: string;
  signerTitle: string;
  authorization: string;
}
let SIGNERS: SignerSetting[] = [
  { id: 's1', company: 'AEQUITAS', division: '', department: '', empType: '', from: '2022-01-01', types: CONTRACT_TYPES.filter((t) => t !== 'Thử việc'), signer: 'NGUYỄN QUANG HUY', signerTitle: 'Tổng Giám đốc', authorization: '' },
  { id: 's2', company: 'AEQUITAS', division: '', department: '', empType: '', from: '2024-01-01', types: ['Thử việc'], signer: 'LÊ THU HƯƠNG', signerTitle: 'Giám đốc Nhân sự', authorization: 'Giấy uỷ quyền số 05/2024/UQ-AEQ ngày 02/01/2024' },
  { id: 's3', company: 'AEQUITAS', division: 'BFSI', department: 'Staffing', empType: '', from: '2025-01-01', types: [...CONTRACT_TYPES], signer: 'PHAN VĂN TÙNG', signerTitle: 'Giám đốc khối BFSI', authorization: 'Giấy uỷ quyền số 12/2025/UQ-AEQ ngày 06/01/2025' },
  { id: 's4', company: 'VTX GROUP', division: '', department: '', empType: '', from: '2022-01-01', types: [...CONTRACT_TYPES], signer: 'NGUYỄN QUANG HUY', signerTitle: 'Chủ tịch HĐQT', authorization: '' },
];
const SIG_SUBS = new Set<() => void>();
const setSigners = (fn: (l: SignerSetting[]) => SignerSetting[]) => {
  SIGNERS = fn(SIGNERS);
  SIG_SUBS.forEach((f) => f());
};
const useSigners = () => useSyncExternalStore((cb) => (SIG_SUBS.add(cb), () => void SIG_SUBS.delete(cb)), () => SIGNERS);
const SIGNER_PEOPLE = ['NGUYỄN QUANG HUY', 'LÊ THU HƯƠNG', 'PHAN VĂN TÙNG'];
const signerOptions = (list: Employee[]) =>
  [...new Set([...SIGNER_PEOPLE, ...EXTRA_MANAGERS, ...list.filter((e) => e.level === 'Manager' && e.status !== 'Đã nghỉ việc').map((e) => e.fullName)])];

/** Người ký mặc định: thiết lập khớp công ty / khối / phòng ban / loại NV / loại HĐ, có hiệu lực tới ngày ký — cụ thể nhất, mới nhất. */
const findSigner = (e: Employee, type: string, date: string, settings = SIGNERS) =>
  settings
    .filter(
      (s) =>
        s.company === e.company &&
        (!s.division || s.division === e.division) &&
        (!s.department || s.department === e.department) &&
        (!s.empType || s.empType === empTypeOf(e)) &&
        s.types.includes(type) &&
        s.from <= (date || today()),
    )
    .sort((a, b) => [b.division, b.department, b.empType].filter(Boolean).length - [a.division, a.department, a.empType].filter(Boolean).length || b.from.localeCompare(a.from))[0];

// ==========================================================================
// Kiểm tra & lưu hợp đồng
// ==========================================================================
const overlaps = (a: EmpContract, b: EmpContract) => a.from <= (b.to || '9999-12-31') && b.from <= (a.to || '9999-12-31');
const validateContract = (c: EmpContract, others: EmpContract[]): Record<string, string> => {
  const err: Record<string, string> = {};
  if (!c.type) err.type = 'Bắt buộc';
  if (!c.from) err.from = 'Bắt buộc';
  if (c.type !== 'Không xác định thời hạn' && !c.to) err.to = 'Bắt buộc';
  if (c.from && c.to && c.to < c.from) err.to = 'Trước ngày hiệu lực';
  if (!c.no.trim()) err.no = 'Bắt buộc';
  else if (others.some((o) => o.no.toLowerCase() === c.no.trim().toLowerCase())) err.no = 'Số HĐ đã tồn tại';
  const hit = c.from && others.find((o) => overlaps(c, o));
  if (hit) err.from = `Giao thời gian hiệu lực với HĐ ${hit.no} (${dmy(hit.from)} → ${hit.to ? dmy(hit.to) : 'không thời hạn'})`;
  if (c.rate !== undefined && (c.rate < 0 || c.rate > 100)) err.rate = 'Từ 0 đến 100%';
  return err;
};
const CONTRACT_LABELS: [keyof EmpContract, string][] = [
  ['type', 'Loại HĐ'], ['no', 'Số HĐ'], ['from', 'Hiệu lực từ'], ['to', 'Hiệu lực đến'], ['signDate', 'Ngày ký'], ['jobDesc', 'Mô tả công việc'],
  ['workplace', 'Nơi làm việc'], ['workTime', 'Thời gian làm việc'], ['signer', 'Người ký'], ['signerTitle', 'Chức danh người ký'],
  ['signPlace', 'Nơi ký'], ['authorization', 'Giấy uỷ quyền'], ['baseSalary', 'Lương cơ bản gốc'], ['rate', 'Mức hưởng (%)'], ['note', 'Ghi chú'],
];
const show = (k: keyof EmpContract, v: unknown) => (k === 'from' || k === 'to' || k === 'signDate' ? dmy(String(v || '')) || '—' : k === 'baseSalary' ? money(Number(v)) || '—' : String(v ?? '') || '—');
const diffContract = (a: EmpContract, b: EmpContract) => {
  const out = CONTRACT_LABELS.filter(([k]) => (a[k] ?? '') !== (b[k] ?? '')).map(([k, l]) => `${l}: ${show(k, a[k])} → ${show(k, b[k])}`);
  if (JSON.stringify(a.allowances || []) !== JSON.stringify(b.allowances || [])) out.push('Phụ cấp: đã cập nhật');
  if (JSON.stringify(a.insurance || {}) !== JSON.stringify(b.insurance || {})) out.push('Bảo hiểm: đã cập nhật');
  return out;
};
const contractLine = (c: EmpContract) => `${c.no} · ${c.type} · ${dmy(c.from)} → ${c.to ? dmy(c.to) : 'không thời hạn'}`;

/** Ghi danh sách HĐ mới của 1 NV vào kho chung + lịch sử hồ sơ. */
const commitContracts = (empId: string, contracts: EmpContract[], logs: { action: string; changes?: string[] }[], patch: Partial<Employee> = {}) => {
  const at = nowIso();
  setEmployees((l) =>
    l.map((x) => (x.id === empId ? { ...x, ...patch, contracts, history: [...x.history, ...logs.map((g) => ({ at, by: ME, ...g }))], updatedAt: at, updatedBy: ME } : x)),
  );
};

/** In hợp đồng (bản xem in — trình duyệt in / lưu PDF). */
const printContract = (e: Employee, c: EmpContract) => {
  const row = (k: string, v: string) => `<tr><td class="k">${k}</td><td>${v || '…………………………'}</td></tr>`;
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>HĐLĐ ${c.no}</title>
<style>body{font-family:'Times New Roman',serif;font-size:14px;line-height:1.55;margin:40px 60px;color:#111}h1{text-align:center;font-size:20px;margin:6px 0 2px}
.c{text-align:center}.sub{text-align:center;font-style:italic;margin-bottom:18px}table{width:100%;border-collapse:collapse;margin:6px 0 12px}td{padding:3px 4px;vertical-align:top}
td.k{width:220px;color:#333}h2{font-size:15px;margin:16px 0 4px}.sig{display:flex;justify-content:space-between;margin-top:40px;text-align:center}.sig div{width:45%}
@media print{body{margin:20mm}}</style></head><body>
<p class="c"><b>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br><b><u>Độc lập – Tự do – Hạnh phúc</u></b></p>
<h1>HỢP ĐỒNG LAO ĐỘNG</h1><p class="sub">Số: ${c.no} · ${c.type}</p>
<h2>Bên A — Người sử dụng lao động</h2><table>${row('Công ty', e.company)}${row('Người đại diện', c.signer || '')}${row('Chức vụ', c.signerTitle || '')}${c.authorization ? row('Theo', c.authorization) : ''}</table>
<h2>Bên B — Người lao động</h2><table>${row('Họ và tên', e.fullName)}${row('Mã nhân viên', e.code)}${row('Ngày sinh', dmy(e.birthDate))}${row('Số CCCD', e.idNo)}${row('Địa chỉ thường trú', e.permanentAddress)}</table>
<h2>Điều 1. Thời hạn và công việc</h2><table>${row('Loại hợp đồng', c.type)}${row('Thời hạn', `Từ ${dmy(c.from)} đến ${c.to ? dmy(c.to) : 'không xác định thời hạn'}`)}${row('Chức danh / công việc', c.jobDesc || `${e.position} — ${e.department}`)}${row('Nơi làm việc', c.workplace || '')}${row('Thời gian làm việc', c.workTime || '')}</table>
<h2>Điều 2. Tiền lương và phụ cấp</h2><table>${row('Lương cơ bản gốc', `${money(c.baseSalary)} VNĐ/tháng`)}${row('Mức hưởng', `${c.rate ?? 100}%`)}${row('Lương cơ bản', `${money(salaryOf(c))} VNĐ/tháng`)}${(c.allowances || []).map((a) => row(a.name, `${money(a.amount)} VNĐ/tháng`)).join('')}</table>
<h2>Điều 3. Bảo hiểm</h2><p>Tham gia: ${[c.insurance?.bhxh && 'BHXH', c.insurance?.bhyt && 'BHYT', c.insurance?.bhtn && 'BHTN'].filter(Boolean).join(', ') || 'Không'} theo quy định hiện hành.</p>
${c.note ? `<h2>Ghi chú</h2><p>${c.note}</p>` : ''}
<p style="margin-top:18px">Hợp đồng lập tại ${c.signPlace || '…………'}, ngày ${dmy(c.signDate) || '…………'}, thành 02 bản có giá trị như nhau, mỗi bên giữ 01 bản.</p>
<div class="sig"><div><b>NGƯỜI LAO ĐỘNG</b><br><i>(Ký, ghi rõ họ tên)</i><br><br><br><br>${e.fullName}</div><div><b>NGƯỜI SỬ DỤNG LAO ĐỘNG</b><br><i>(Ký, đóng dấu)</i><br><br><br><br>${c.signer || ''}</div></div>
<script>window.onload=()=>setTimeout(()=>window.print(),300)</script></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  const w = window.open(url, '_blank');
  if (!w) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `HDLD_${c.no.replace(/\//g, '-')}.html`;
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

// ==========================================================================
// UI dùng chung
// ==========================================================================
const Field: React.FC<{ label: string; req?: boolean; err?: string; children: React.ReactNode; className?: string }> = ({ label, req, err, children, className = '' }) => (
  <label className={`flex flex-col gap-0.5 min-w-0 ${className}`}>
    <span className="text-[11.5px] font-medium text-slate-600">
      {label}
      {req && <span className="text-rose-600 ml-0.5">*</span>}
    </span>
    {children}
    {err && <span className="text-[11px] text-rose-600 leading-tight">{err}</span>}
  </label>
);
const sel = `${erp.inputFull}`;
const Select: React.FC<{ value: string; onChange: (v: string) => void; options: readonly string[]; empty?: string; className?: string; err?: boolean }> = ({ value, onChange, options, empty = 'Tất cả', className = '', err }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={`${sel} ${!value ? 'text-slate-400' : ''} ${err ? '!border-rose-400' : ''} ${className}`}>
    <option value="">{empty}</option>
    {options.map((o) => (
      <option key={o} value={o} className="text-slate-800">
        {o}
      </option>
    ))}
  </select>
);
const Range: React.FC<{ from: string; to: string; onFrom: (v: string) => void; onTo: (v: string) => void }> = ({ from, to, onFrom, onTo }) => (
  <span className="grid grid-cols-[1fr_auto_1fr] items-center gap-1">
    <DateInput value={from} onChange={onFrom} />
    <span className="text-slate-400">→</span>
    <DateInput value={to} onChange={onTo} />
  </span>
);
const MoneyInput: React.FC<{ value?: number; onChange: (n: number) => void; className?: string; placeholder?: string }> = ({ value, onChange, className = '', placeholder = '0' }) => (
  <input value={money(value)} onChange={(e) => onChange(parseMoney(e.target.value))} inputMode="numeric" placeholder={placeholder} className={`${erp.inputFull} text-right tabular-nums ${className}`} />
);
const th = `${erp.th} text-center whitespace-nowrap`;
const StateTag: React.FC<{ c: EmpContract }> = ({ c }) => {
  const s = contractState(c);
  return <Tag cls={s.cls}>{s.text}</Tag>;
};
const Toast: React.FC<{ msg: string }> = ({ msg }) => (msg ? <div className="fixed top-4 right-4 z-50 rounded-[4px] bg-[#1e3a5f] text-white text-[12.5px] px-4 py-2 shadow-lg max-w-[520px]">{msg}</div> : null);

// ==========================================================================
// Trang
// ==========================================================================
type TabKey = 'list' | 'emp' | 'expire' | 'signer';

export const ContractsPage: React.FC = () => {
  const list = useEmployees();
  const [tab, setTab] = useState<TabKey>('list');
  const [empId, setEmpId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const flash = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(''), 3200);
  };
  // Mở từ hồ sơ nhân viên (nút "Quản lý hợp đồng")
  useEffect(() => {
    const p = takeNavPayload();
    if (p?.employeeId) {
      setEmpId(p.employeeId);
      setTab('emp');
    }
  }, []);
  const openEmp = (id: string, contractId: string | null = null) => {
    setEmpId(id);
    setEditId(contractId);
    setTab('emp');
  };

  // Số liệu đầu trang
  const t = today();
  const active = list.filter((e) => e.status !== 'Đã nghỉ việc');
  const latest = (e: Employee) => [...e.contracts].sort((a, b) => b.from.localeCompare(a.from))[0];
  const valid = active.filter((e) => {
    const c = currentContract(e);
    return c && (!c.to || c.to >= t);
  }).length;
  const soon = active.filter((e) => {
    const c = latest(e);
    return c?.to && c.to >= t && c.to <= addDays(t, 30);
  }).length;
  const expired = active.filter((e) => {
    const c = latest(e);
    return c?.to && c.to < t;
  }).length;
  const none = active.filter((e) => !e.contracts.length).length;

  const TITLES: Record<TabKey, string> = {
    list: 'Danh sách hợp đồng lao động',
    emp: 'Hợp đồng lao động',
    expire: 'Hết hạn & Tái ký hợp đồng',
    signer: 'Thiết lập người ký hợp đồng',
  };
  return (
    <ErpPage>
      <Toast msg={toast} />
      <ErpTitleBar crumbs={CRUMBS} title={TITLES[tab]} />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiBox label="Hợp đồng đang hiệu lực" value={valid} valueText={String(valid)} tone="good" sub={`${active.length} nhân viên đang làm việc`} onClick={() => setTab('list')} />
        <KpiBox label="Sắp hết hạn (30 ngày)" value={soon} valueText={String(soon)} tone="neutral" sub="Bấm để tái ký" onClick={() => setTab('expire')} active={false} />
        <KpiBox label="Đã hết hạn, chưa tái ký" value={expired} valueText={String(expired)} tone="bad" sub="Cần xử lý" onClick={() => setTab('expire')} />
        <KpiBox label="Nhân viên chưa có HĐ" value={none} valueText={String(none)} tone="neutral" sub="Chọn NV để thêm HĐ" onClick={() => setTab('emp')} />
      </div>
      <FolderTabs
        tabs={[
          { key: 'list', label: 'Danh sách hợp đồng', icon: Table2 },
          { key: 'emp', label: 'Hợp đồng theo nhân viên', icon: FileSignature },
          { key: 'expire', label: `Hết hạn & Tái ký${soon + expired ? ` (${soon + expired})` : ''}`, icon: CalendarClock },
          { key: 'signer', label: 'Thiết lập người ký', icon: Settings2 },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === 'list' && <ContractList list={list} onEdit={openEmp} flash={flash} />}
      {tab === 'emp' && <EmployeeContracts list={list} empId={empId} setEmpId={(id) => (setEmpId(id), setEditId(null))} editId={editId} setEditId={setEditId} flash={flash} />}
      {tab === 'expire' && <RenewTab list={list} onOpen={openEmp} flash={flash} />}
      {tab === 'signer' && <SignerTab list={list} flash={flash} />}
    </ErpPage>
  );
};

// ==========================================================================
// Tab 1 — Danh sách hợp đồng lao động
// ==========================================================================
type Row = { e: Employee; c: EmpContract };
const LIST_COLS = ['Mã NV', 'Tên nhân viên', 'Khối', 'Phòng ban', 'Chức danh', 'Số HĐ', 'Loại HĐ', 'Ngày ký', 'Hiệu lực từ', 'Đến ngày', 'Lương cơ bản (VNĐ)', 'Người ký', 'Tình trạng', 'Ghi chú'];

const ContractList: React.FC<{ list: Employee[]; onEdit: (empId: string, contractId: string) => void; flash: (m: string) => void }> = ({ list, onEdit, flash }) => {
  const blankF = { q: '', company: '', division: '', department: '', position: '', status: 'working' as 'working' | 'left' | 'all', no: '', type: '', fromA: '', fromB: '', toA: '', toB: '', latest: true };
  const [f, setF] = useState(blankF);
  const set = <K extends keyof typeof blankF>(k: K, v: (typeof blankF)[K]) => setF((x) => ({ ...x, [k]: v }));
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [confirmDel, setConfirmDel] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const rows: Row[] = useMemo(() => {
    const n = norm(f.q);
    return list
      .filter((e) => (f.status === 'all' ? true : f.status === 'left' ? e.status === 'Đã nghỉ việc' : e.status !== 'Đã nghỉ việc'))
      .filter((e) => (!n || norm(e.code).includes(n) || norm(e.fullName).includes(n)) && (!f.company || e.company === f.company) && (!f.division || e.division === f.division) && (!f.department || e.department === f.department) && (!f.position || e.position === f.position))
      .flatMap((e) => {
        const cs = [...e.contracts].sort((a, b) => b.from.localeCompare(a.from));
        return (f.latest ? cs.slice(0, 1) : cs).map((c) => ({ e, c }));
      })
      .filter(({ c }) => (!f.no || norm(c.no).includes(norm(f.no))) && (!f.type || c.type === f.type))
      .filter(({ c }) => (!f.fromA || c.from >= f.fromA) && (!f.fromB || c.from <= f.fromB) && (!f.toA || (c.to && c.to >= f.toA)) && (!f.toB || (c.to && c.to <= f.toB)))
      .sort((a, b) => a.e.code.localeCompare(b.e.code) || b.c.from.localeCompare(a.c.from));
  }, [list, f]);
  const allOn = rows.length > 0 && rows.every((r) => picked.has(r.c.id));
  const toggle = (id: string) => setPicked((s) => (s.has(id) ? new Set([...s].filter((x) => x !== id)) : new Set([...s, id])));
  const pickedRows = rows.filter((r) => picked.has(r.c.id));

  const del = () => {
    const byEmp = new Map<string, EmpContract[]>();
    pickedRows.forEach((r) => byEmp.set(r.e.id, [...(byEmp.get(r.e.id) || []), r.c]));
    byEmp.forEach((cs, id) => {
      const e = getEmployees().find((x) => x.id === id)!;
      commitContracts(id, e.contracts.filter((c) => !cs.some((d) => d.id === c.id)), cs.map((c) => ({ action: 'Xoá hợp đồng', changes: [contractLine(c)] })));
    });
    flash(`Đã xoá ${pickedRows.length} hợp đồng`);
    setPicked(new Set());
    setConfirmDel(false);
  };
  const exportXlsx = () => {
    const aoa = [['STT', ...LIST_COLS], ...rows.map(({ e, c }, i) => [i + 1, e.code, e.fullName, e.division, e.department, e.position, c.no, c.type, dmy(c.signDate), dmy(c.from), c.to ? dmy(c.to) : 'Không thời hạn', salaryOf(c) || '', c.signer || '', contractState(c).text, c.note])];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), 'HopDong');
    XLSX.writeFile(wb, `danh-sach-hop-dong_${today().replace(/-/g, '')}.xlsx`);
  };

  return (
    <div className="space-y-3">
      <Panel
        title="Điều kiện tìm kiếm"
        icon={Search}
        actions={
          <Btn icon={RotateCcw} className="h-7" onClick={() => setF(blankF)}>
            Làm mới
          </Btn>
        }
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-2">
          <Field label="Mã / Tên nhân viên">
            <input value={f.q} onChange={(e) => set('q', e.target.value)} placeholder="Gõ mã NV hoặc họ tên" className={erp.inputFull} />
          </Field>
          <Field label="Công ty">
            <Select value={f.company} onChange={(v) => set('company', v)} options={COMPANIES} />
          </Field>
          <Field label="Khối">
            <Select value={f.division} onChange={(v) => set('division', v)} options={DIVISIONS} />
          </Field>
          <Field label="Phòng ban">
            <Select value={f.department} onChange={(v) => set('department', v)} options={DEPARTMENTS} />
          </Field>
          <Field label="Chức danh">
            <Select value={f.position} onChange={(v) => set('position', v)} options={POSITIONS} />
          </Field>
          <Field label="Số hợp đồng">
            <input value={f.no} onChange={(e) => set('no', e.target.value)} placeholder="vd: V00412/2024" className={erp.inputFull} />
          </Field>
          <Field label="Loại hợp đồng">
            <Select value={f.type} onChange={(v) => set('type', v)} options={CONTRACT_TYPES} />
          </Field>
          <Field label="Tình trạng nhân viên">
            <span className="flex items-center gap-3 h-8 text-[12.5px]">
              {(
                [
                  ['working', 'Đang làm việc'],
                  ['left', 'Thôi việc'],
                  ['all', 'Tất cả'],
                ] as const
              ).map(([k, l]) => (
                <label key={k} className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" checked={f.status === k} onChange={() => set('status', k)} className="accent-[#1f5fa8]" /> {l}
                </label>
              ))}
            </span>
          </Field>
          <Field label="Hiệu lực từ ngày" className="lg:col-span-2">
            <Range from={f.fromA} to={f.fromB} onFrom={(v) => set('fromA', v)} onTo={(v) => set('fromB', v)} />
          </Field>
          <Field label="Hết hạn từ ngày">
            <Range from={f.toA} to={f.toB} onFrom={(v) => set('toA', v)} onTo={(v) => set('toB', v)} />
          </Field>
          <Field label=" ">
            <label className="flex items-center gap-2 h-8 text-[12.5px] cursor-pointer">
              <CheckBox checked={f.latest} onChange={(v) => set('latest', v)} /> Lấy hợp đồng mới nhất
            </label>
          </Field>
        </div>
      </Panel>

      {showImport && <ContractImport list={list} onClose={() => setShowImport(false)} flash={flash} />}

      <Panel
        title="Danh sách hợp đồng lao động"
        icon={Table2}
        noPad
        actions={
          <>
            <Btn variant="danger" icon={Trash2} className="h-7" disabled={!pickedRows.length} onClick={() => setConfirmDel(true)}>
              Xoá{pickedRows.length ? ` (${pickedRows.length})` : ''}
            </Btn>
            <Btn icon={Mail} className="h-7" disabled={!pickedRows.length} onClick={() => (flash(`Đã gửi email thông tin hợp đồng tới ${new Set(pickedRows.map((r) => r.e.id)).size} nhân viên (mô phỏng)`), setPicked(new Set()))}>
              Gửi mail
            </Btn>
            <Btn icon={Upload} className={`h-7 ${showImport ? '!bg-[#eef4fb] !border-[#1f5fa8] !text-[#1f5fa8]' : ''}`} onClick={() => setShowImport((v) => !v)}>
              Nhập dữ liệu
            </Btn>
            <Btn icon={FileSpreadsheet} className="h-7" onClick={exportXlsx}>
              Xuất dữ liệu
            </Btn>
            <Btn icon={Download} className="h-7" onClick={() => exportImportFile(rows)} title="Xuất đúng mẫu import để chỉnh sửa rồi nhập lại">
              Xuất DL Import
            </Btn>
          </>
        }
        footer={`${rows.length} hợp đồng${f.latest ? ' (hợp đồng mới nhất của mỗi nhân viên)' : ''} · Bấm biểu tượng bút để sửa trên màn Hợp đồng theo nhân viên`}
      >
        {confirmDel && (
          <div className="flex flex-wrap items-center gap-3 px-3 py-2 bg-rose-50 border-b border-rose-200 text-[12.5px] text-rose-700">
            <AlertTriangle size={14} className="shrink-0" />
            <span className="flex-1">
              Xoá <b>{pickedRows.length}</b> hợp đồng đã chọn? Không khôi phục được.
            </span>
            <Btn className="h-7" onClick={() => setConfirmDel(false)}>
              Không xoá
            </Btn>
            <Btn variant="danger" icon={Trash2} className="h-7 !bg-rose-600 !text-white !border-rose-700 hover:!bg-rose-700" onClick={del}>
              Xoá hợp đồng
            </Btn>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1700px]`}>
            <thead>
              <tr>
                <th className={`${th} border-t-0 border-l-0 w-9`}>
                  <span className="flex justify-center">
                    <CheckBox checked={allOn} onChange={(v) => setPicked(v ? new Set(rows.map((r) => r.c.id)) : new Set())} />
                  </span>
                </th>
                <th className={`${th} border-t-0 w-12`}>Sửa</th>
                <th className={`${th} border-t-0 w-12`}>STT</th>
                {LIST_COLS.map((h) => (
                  <th key={h} className={`${th} border-t-0 last:border-r-0`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ e, c }, i) => (
                <tr key={c.id} className={`${erp.tr} ${picked.has(c.id) ? '!bg-[#eaf2fc]' : ''}`}>
                  <td className={`${erp.td} border-l-0 text-center`}>
                    <span className="flex justify-center">
                      <CheckBox checked={picked.has(c.id)} onChange={() => toggle(c.id)} />
                    </span>
                  </td>
                  <td className={`${erp.td} text-center`}>
                    <button type="button" title="Sửa hợp đồng" onClick={() => onEdit(e.id, c.id)} className="p-1 text-amber-600 hover:text-amber-700 cursor-pointer">
                      <Pencil size={14} />
                    </button>
                  </td>
                  <td className={`${erp.td} text-center text-slate-500`}>{i + 1}</td>
                  <td className={`${erp.td} ${erp.code} font-semibold whitespace-nowrap`}>{e.code}</td>
                  <td className={`${erp.td} font-semibold whitespace-nowrap`}>{e.fullName}</td>
                  <td className={`${erp.td} text-center`}>{e.division}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{e.department}</td>
                  <td className={erp.td}>{e.position}</td>
                  <td className={`${erp.td} font-mono text-[12px] whitespace-nowrap`}>{c.no}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{c.type}</td>
                  <td className={`${erp.td} text-center`}>{dmy(c.signDate)}</td>
                  <td className={`${erp.td} text-center`}>{dmy(c.from)}</td>
                  <td className={`${erp.td} text-center whitespace-nowrap`}>{c.to ? dmy(c.to) : <span className="text-slate-500">Không thời hạn</span>}</td>
                  <td className={`${erp.td} ${erp.num}`}>{money(salaryOf(c)) || '—'}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{c.signer || '—'}</td>
                  <td className={erp.td}>
                    <StateTag c={c} />
                  </td>
                  <td className={`${erp.td} border-r-0 text-slate-600 max-w-[220px] truncate`} title={c.note}>
                    {c.note || '—'}
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={LIST_COLS.length + 3} className="px-3 py-10 text-center text-[12.5px] text-slate-400">
                    Không có hợp đồng phù hợp điều kiện tìm kiếm.
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
// Import hợp đồng (khung ngay trên màn, không popup) — theo mục "Nhập dữ liệu" iHRP
// ==========================================================================
const IMP_COLS: { key: string; label: string; req?: boolean }[] = [
  { key: 'code', label: 'Mã NV', req: true },
  { key: 'type', label: 'Loại HĐ', req: true },
  { key: 'no', label: 'Số HĐ' },
  { key: 'signDate', label: 'Ngày ký' },
  { key: 'from', label: 'Hiệu lực từ', req: true },
  { key: 'to', label: 'Hiệu lực đến' },
  { key: 'jobDesc', label: 'Mô tả công việc' },
  { key: 'workplace', label: 'Nơi làm việc' },
  { key: 'workTime', label: 'Thời gian làm việc' },
  { key: 'signer', label: 'Người ký' },
  { key: 'signerTitle', label: 'Chức danh người ký' },
  { key: 'baseSalary', label: 'Lương cơ bản gốc' },
  { key: 'rate', label: 'Mức hưởng (%)' },
  { key: 'bhxh', label: 'BHXH' },
  { key: 'bhyt', label: 'BHYT' },
  { key: 'bhtn', label: 'BHTN' },
  { key: 'note', label: 'Ghi chú' },
];
const yes = (v: unknown) => ['co', 'x', '1', 'true', 'yes'].includes(norm(v));
const toImportRow = (e: Employee, c: EmpContract) => [
  e.code, c.type, c.no, dmy(c.signDate), dmy(c.from), dmy(c.to), c.jobDesc || '', c.workplace || '', c.workTime || '', c.signer || '', c.signerTitle || '',
  c.baseSalary || '', c.rate ?? 100, c.insurance?.bhxh ? 'Có' : 'Không', c.insurance?.bhyt ? 'Có' : 'Không', c.insurance?.bhtn ? 'Có' : 'Không', c.note || '',
];
const exportImportFile = (rows: Row[], sample = false) => {
  const head = IMP_COLS.map((c) => (c.req ? `${c.label} *` : c.label));
  const data = rows.map(({ e, c }) => toImportRow(e, c));
  const ws = XLSX.utils.aoa_to_sheet([head, ...data]);
  ws['!cols'] = IMP_COLS.map((c) => ({ wch: Math.max(12, c.label.length + 4) }));
  const guide = XLSX.utils.aoa_to_sheet([
    ['HƯỚNG DẪN IMPORT HỢP ĐỒNG LAO ĐỘNG'],
    [],
    ['1. Mỗi dòng là 1 hợp đồng. Cột * bắt buộc: Mã NV, Loại HĐ, Hiệu lực từ. Hiệu lực đến bắt buộc trừ HĐ không xác định thời hạn (để trống → tự tính theo loại HĐ).'],
    ['2. Số HĐ trùng với HĐ đã có của nhân viên → cập nhật (Update); để trống hoặc số mới → thêm mới (Insert, Số HĐ tự sinh nếu trống).'],
    ['3. Không cho 2 HĐ của cùng nhân viên có thời gian hiệu lực giao nhau (kể cả giữa các dòng trong file).'],
    ['4. Ngày ghi dd/mm/yyyy. Lương ghi số (VNĐ). BHXH / BHYT / BHTN ghi Có hoặc Không. Người ký để trống → lấy theo Thiết lập người ký.'],
    [`5. Loại HĐ: ${CONTRACT_TYPES.join(' · ')}`],
  ]);
  guide['!cols'] = [{ wch: 130 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'HopDong');
  XLSX.utils.book_append_sheet(wb, guide, 'HuongDan');
  XLSX.writeFile(wb, sample ? 'Mau_import_hop_dong.xlsx' : `xuat-dl-import-hop-dong_${today().replace(/-/g, '')}.xlsx`);
};

type ImpRow = { line: number; e?: Employee; c: EmpContract; mode: 'insert' | 'update' | 'error'; errors: string[]; changes: string[] };
const parseContractFile = (wb: XLSX.WorkBook, list: Employee[]): { rows: ImpRow[]; error?: string } => {
  const ws = wb.Sheets[wb.SheetNames.find((n) => norm(n).includes('hop')) || wb.SheetNames[0]];
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, raw: true, defval: '' });
  const hi = aoa.slice(0, 10).findIndex((r) => r.filter((c) => IMP_COLS.some((k) => norm(k.label) === norm(c))).length >= 3);
  if (hi < 0) return { rows: [], error: 'Không tìm thấy dòng tiêu đề. Hãy dùng file mẫu (Mã NV, Loại HĐ, Hiệu lực từ…).' };
  const head = aoa[hi].map((c) => IMP_COLS.find((k) => norm(k.label) === norm(c))?.key || '');
  const byCode = new Map(list.map((e) => [e.code.toLowerCase(), e]));
  const pending = new Map<string, EmpContract[]>(); // HĐ đã nhận trong file theo NV (để kiểm tra giao nhau giữa các dòng)
  const rows: ImpRow[] = [];
  aoa.slice(hi + 1).forEach((r, i) => {
    if (r.every((x) => String(x ?? '').trim() === '')) return;
    const v: Record<string, unknown> = {};
    head.forEach((k, j) => k && (v[k] = r[j]));
    const errors: string[] = [];
    const e = byCode.get(String(v.code || '').trim().toLowerCase());
    if (!String(v.code || '').trim()) errors.push('Thiếu Mã NV');
    else if (!e) errors.push(`Mã NV "${v.code}" không có trên hệ thống`);
    const type = CONTRACT_TYPES.find((tp) => norm(tp) === norm(v.type)) || '';
    if (!type) errors.push(v.type ? `Loại HĐ "${v.type}" không đúng danh mục` : 'Thiếu Loại HĐ');
    const d = (k: string) => {
      const x = parseDateCell(v[k]);
      if (x === null) errors.push(`${IMP_COLS.find((c) => c.key === k)!.label}: "${v[k]}" không phải ngày`);
      return x || '';
    };
    const from = d('from');
    const signDate = d('signDate');
    let to = d('to');
    if (!to && type) to = contractEnd(type, from);
    const no0 = String(v.no || '').trim();
    const old = e && no0 ? e.contracts.find((c) => c.no.toLowerCase() === no0.toLowerCase()) : undefined;
    const signerDef = e && type ? findSigner(e, type, signDate || from) : undefined;
    const c: EmpContract = {
      ...(old || { id: uid(), files: [], allowances: [], createdAt: nowIso(), createdBy: ME }),
      type,
      from,
      to: type === 'Không xác định thời hạn' && !String(v.to || '').trim() ? '' : to,
      signDate: signDate || from,
      no: no0 || (e && type && from ? contractNo(e.code, type, from, [...e.contracts.map((x) => x.no), ...(pending.get(e.id) || []).map((x) => x.no)]) : ''),
      jobDesc: String(v.jobDesc ?? old?.jobDesc ?? ''),
      workplace: String(v.workplace || old?.workplace || WORKPLACES[0]),
      workTime: String(v.workTime || old?.workTime || WORK_TIMES[0]),
      // Người ký: theo file → giữ như HĐ đang cập nhật → theo Thiết lập người ký (HĐ thêm mới)
      signer: String(v.signer || (old ? old.signer || '' : signerDef?.signer || '')),
      signerTitle: String(v.signerTitle || (v.signer ? '' : old ? old.signerTitle || '' : signerDef?.signerTitle || '')),
      authorization: v.signer ? '' : old ? old.authorization || '' : signerDef?.authorization || '',
      signPlace: old?.signPlace || 'Hà Nội',
      baseSalary: v.baseSalary !== '' && v.baseSalary !== undefined ? parseMoney(String(v.baseSalary)) : old?.baseSalary,
      rate: v.rate !== '' && v.rate !== undefined ? Number(v.rate) : old?.rate ?? (type === 'Thử việc' ? 85 : 100),
      insurance: { bhxh: v.bhxh !== undefined && v.bhxh !== '' ? yes(v.bhxh) : !!old?.insurance?.bhxh, bhyt: v.bhyt !== undefined && v.bhyt !== '' ? yes(v.bhyt) : !!old?.insurance?.bhyt, bhtn: v.bhtn !== undefined && v.bhtn !== '' ? yes(v.bhtn) : !!old?.insurance?.bhtn },
      note: String(v.note ?? old?.note ?? ''),
      updatedAt: nowIso(),
      updatedBy: ME,
    };
    if (e && type && from) {
      const others = [...e.contracts.filter((x) => x.id !== c.id), ...(pending.get(e.id) || [])];
      Object.entries(validateContract(c, others)).forEach(([k, m]) => errors.push(`${CONTRACT_LABELS.find(([kk]) => kk === k)?.[1] || k}: ${m}`));
    } else if (!from && !errors.some((x) => x.startsWith('Hiệu lực từ'))) errors.push('Thiếu Hiệu lực từ');
    const mode: ImpRow['mode'] = errors.length ? 'error' : old ? 'update' : 'insert';
    if (mode !== 'error' && e) pending.set(e.id, [...(pending.get(e.id) || []), c]);
    rows.push({ line: hi + 2 + i, e, c, mode, errors, changes: old && mode === 'update' ? diffContract(old, c) : [] });
  });
  return { rows };
};

const ContractImport: React.FC<{ list: Employee[]; onClose: () => void; flash: (m: string) => void }> = ({ list, onClose, flash }) => {
  const [file, setFile] = useState<{ name: string; wb: XLSX.WorkBook } | null>(null);
  const [err, setErr] = useState('');
  const [skip, setSkip] = useState<Set<number>>(new Set());
  const ref = useRef<HTMLInputElement>(null);
  const res = useMemo(() => (file ? parseContractFile(file.wb, list) : null), [file, list]);
  const chosen = (res?.rows || []).filter((r) => r.mode !== 'error' && !skip.has(r.line));
  const cnt = (m: ImpRow['mode']) => (res?.rows || []).filter((r) => r.mode === m).length;
  const read = (f: File) => {
    setErr('');
    const r = new FileReader();
    r.onload = () => {
      try {
        setFile({ name: f.name, wb: XLSX.read(r.result, { type: 'array', cellDates: true }) });
        setSkip(new Set());
      } catch {
        setErr('Không đọc được file.');
      }
    };
    r.readAsArrayBuffer(f);
  };
  const save = () => {
    const byEmp = new Map<string, ImpRow[]>();
    chosen.forEach((r) => byEmp.set(r.e!.id, [...(byEmp.get(r.e!.id) || []), r]));
    byEmp.forEach((rs, id) => {
      const e = getEmployees().find((x) => x.id === id)!;
      let cs = [...e.contracts];
      rs.forEach((r) => (cs = r.mode === 'update' ? cs.map((x) => (x.id === r.c.id ? r.c : x)) : [...cs, r.c]));
      commitContracts(id, cs, rs.map((r) => ({ action: r.mode === 'update' ? 'Cập nhật hợp đồng (import)' : 'Thêm hợp đồng (import)', changes: [file!.name, contractLine(r.c), ...r.changes] })));
    });
    flash(`Số dòng thực thi: ${chosen.length} · Lỗi: ${cnt('error')} · Insert: ${chosen.filter((r) => r.mode === 'insert').length} · Update: ${chosen.filter((r) => r.mode === 'update').length}`);
    onClose();
  };
  const TAGS: Record<ImpRow['mode'], [string, string]> = {
    insert: ['Insert', 'bg-emerald-50 text-emerald-700 border-emerald-300'],
    update: ['Update', 'bg-sky-50 text-sky-700 border-sky-300'],
    error: ['Lỗi', 'bg-rose-50 text-rose-700 border-rose-300'],
  };
  return (
    <Panel
      title="Nhập dữ liệu hợp đồng"
      icon={Upload}
      noPad
      actions={
        <>
          <Btn icon={Download} className="h-7" onClick={() => exportImportFile([], true)}>
            Tải template
          </Btn>
          <Btn icon={X} className="h-7" onClick={onClose}>
            Đóng
          </Btn>
        </>
      }
      footer="Chọn file → xem dữ liệu → bỏ chọn dòng không muốn lưu → Lưu. Dòng lỗi không được lưu. Số HĐ trùng HĐ đã có → cập nhật."
    >
      <input
        ref={ref}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(ev) => {
          const f = ev.target.files?.[0];
          ev.target.value = '';
          if (f) read(f);
        }}
      />
      <div className="flex flex-wrap items-center gap-3 p-3 border-b border-slate-200">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex-1 min-w-[300px] flex items-center gap-3 px-4 py-2.5 rounded-[4px] border-2 border-dashed border-slate-300 bg-slate-50 hover:border-[#1f5fa8] hover:bg-[#f5f9fd] cursor-pointer text-left"
        >
          <FileSpreadsheet size={18} className="text-[#1f5fa8] shrink-0" />
          <span>
            <span className="block font-semibold text-slate-800">{file ? file.name : 'Chọn file Excel hợp đồng'}</span>
            <span className="block text-[11.5px] text-slate-500">{file ? 'Bấm để chọn file khác' : '.xlsx / .xls / .csv theo template'}</span>
          </span>
        </button>
        {res && !res.error && (
          <span className="flex flex-wrap items-center gap-2 text-[12.5px]">
            <span>
              Số dòng: <b>{res.rows.length}</b>
            </span>
            {(['insert', 'update', 'error'] as const).map((m) => (cnt(m) ? <Tag key={m} cls={TAGS[m][1]}>{`${TAGS[m][0]}: ${cnt(m)}`}</Tag> : null))}
            <Btn variant="primary" icon={Save} className="h-7" disabled={!chosen.length} onClick={save}>
              Lưu {chosen.length} dòng
            </Btn>
          </span>
        )}
      </div>
      {(err || res?.error) && (
        <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border-b border-rose-200 text-[12.5px] text-rose-700">
          <AlertTriangle size={14} /> {err || res?.error}
        </div>
      )}
      {res && !res.error && (
        <div className="max-h-[320px] overflow-auto">
          <table className={`${erp.table} min-w-[1100px]`}>
            <thead className="sticky top-0 z-10">
              <tr>
                {['', 'Dòng', 'Kết quả', 'Mã NV', 'Họ và tên', 'Loại HĐ', 'Số HĐ', 'Hiệu lực', 'Lương CB', 'Lỗi / Nội dung cập nhật'].map((h, i) => (
                  <th key={i} className={`${erp.th} text-left border-t-0 first:border-l-0 last:border-r-0`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {res.rows.map((r) => (
                <tr key={r.line} className={`${r.mode === 'error' ? 'bg-rose-50/50' : erp.tr} align-top`}>
                  <td className={`${erp.td} border-l-0 w-9`}>
                    {r.mode !== 'error' && <CheckBox checked={!skip.has(r.line)} onChange={() => setSkip((s) => (s.has(r.line) ? new Set([...s].filter((x) => x !== r.line)) : new Set([...s, r.line])))} />}
                  </td>
                  <td className={`${erp.td} text-center text-slate-500 w-14`}>{r.line}</td>
                  <td className={erp.td}>
                    <Tag cls={TAGS[r.mode][1]}>{TAGS[r.mode][0]}</Tag>
                  </td>
                  <td className={`${erp.td} ${erp.code} font-semibold`}>{r.e?.code || '—'}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{r.e?.fullName || '—'}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{r.c.type || '—'}</td>
                  <td className={`${erp.td} font-mono text-[12px] whitespace-nowrap`}>{r.c.no || '—'}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>
                    {dmy(r.c.from)} → {r.c.to ? dmy(r.c.to) : 'KXĐ'}
                  </td>
                  <td className={`${erp.td} ${erp.num}`}>{money(salaryOf(r.c)) || '—'}</td>
                  <td className={`${erp.td} border-r-0 text-[12px] min-w-[300px]`}>
                    {r.errors.map((m, i) => (
                      <p key={i} className="text-rose-700">
                        • {m}
                      </p>
                    ))}
                    {r.mode === 'update' && (r.changes.length ? r.changes.map((m, i) => <p key={i} className="text-slate-600">• {m}</p>) : <p className="text-slate-400">Không có thay đổi</p>)}
                    {r.mode === 'insert' && <span className="text-slate-400">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
};

// ==========================================================================
// Tab 2 — Hợp đồng lao động theo nhân viên
// ==========================================================================
const EmployeePicker: React.FC<{ list: Employee[]; value: Employee | undefined; onPick: (id: string) => void }> = ({ list, value, onPick }) => {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const hits = useMemo(() => {
    const n = norm(q);
    return (n ? list.filter((e) => norm(e.code).includes(n) || norm(e.fullName).includes(n) || norm(e.userName).includes(n)) : list).slice(0, 8);
  }, [list, q]);
  return (
    <div className="relative w-full max-w-[460px]">
      <UserSearch size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={q}
        onChange={(e) => (setQ(e.target.value), setOpen(true))}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && hits[0]) {
            onPick(hits[0].id);
            setQ('');
            setOpen(false);
          }
        }}
        placeholder={value ? `${value.code} — ${value.fullName} · gõ để chọn NV khác` : 'Gõ mã NV hoặc họ tên rồi Enter…'}
        className={`${erp.inputFull} pl-7`}
      />
      {open && hits.length > 0 && (
        <ul className="absolute z-30 left-0 right-0 top-full mt-0.5 bg-white border border-slate-300 rounded-[4px] shadow-lg max-h-72 overflow-auto text-[12.5px]">
          {hits.map((e) => (
            <li key={e.id}>
              <button
                type="button"
                onMouseDown={(ev) => ev.preventDefault()}
                onClick={() => (onPick(e.id), setQ(''), setOpen(false))}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-[#eef4fb] text-left cursor-pointer"
              >
                <span className="font-mono font-semibold text-[#1f5fa8] w-16">{e.code}</span>
                <span className="font-semibold text-slate-800 flex-1 truncate">{e.fullName}</span>
                <span className="text-slate-500 text-[11.5px] whitespace-nowrap">
                  {e.division} · {e.department}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const blankContract = (e: Employee, type?: string, from?: string): EmpContract => {
  const tp = type || (e.contracts.length ? nextContractType([...e.contracts].sort((a, b) => b.from.localeCompare(a.from))[0].type) : 'Thử việc');
  const last = [...e.contracts].sort((a, b) => b.from.localeCompare(a.from))[0];
  const f = from || (last?.to ? addDays(last.to, 1) : e.contracts.length ? today() : e.joinDate || today());
  const sg = findSigner(e, tp, f);
  return {
    id: uid(),
    no: contractNo(e.code, tp, f, e.contracts.map((c) => c.no)),
    type: tp,
    signDate: f,
    from: f,
    to: contractEnd(tp, f),
    note: '',
    jobDesc: `${e.position} — ${e.department}`,
    workplace: last?.workplace || WORKPLACES[0],
    workTime: last?.workTime || WORK_TIMES[0],
    signer: sg?.signer || '',
    signerTitle: sg?.signerTitle || '',
    authorization: sg?.authorization || '',
    signPlace: 'Hà Nội',
    baseSalary: last?.baseSalary,
    rate: tp === 'Thử việc' ? 85 : 100,
    allowances: tp === 'Thử việc' ? [] : (last?.allowances || []).map((a) => ({ ...a, id: uid() })),
    insurance: { bhxh: isOfficial(tp), bhyt: isOfficial(tp), bhtn: isOfficial(tp) },
    files: [],
  };
};

const EmployeeContracts: React.FC<{
  list: Employee[];
  empId: string | null;
  setEmpId: (id: string) => void;
  editId: string | null;
  setEditId: (id: string | null) => void;
  flash: (m: string) => void;
}> = ({ list, empId, setEmpId, editId, setEditId, flash }) => {
  const emp = list.find((e) => e.id === empId);
  const [form, setForm] = useState<EmpContract | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [askOfficial, setAskOfficial] = useState<EmpContract | null>(null);
  const [delId, setDelId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const editing = !!(form && emp?.contracts.some((c) => c.id === form.id));
  const sigList = useSigners();

  // Đổi NV / chọn HĐ cần sửa → nạp form
  useEffect(() => {
    if (!emp) return setForm(null);
    const c = editId ? emp.contracts.find((x) => x.id === editId) : undefined;
    setForm(c ? { ...c, allowances: (c.allowances || []).map((a) => ({ ...a })), insurance: { bhxh: false, bhyt: false, bhtn: false, ...c.insurance } } : blankContract(emp));
    setErrors({});
    setAskOfficial(null);
  }, [empId, editId]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (patch: Partial<EmpContract>) => {
    setForm((f) => {
      if (!f || !emp) return f;
      const n = { ...f, ...patch };
      // Đổi loại HĐ / ngày hiệu lực → tính lại ngày hết hạn, số HĐ (khi thêm mới), người ký mặc định, mức hưởng / BH
      if ('type' in patch || 'from' in patch) {
        n.to = contractEnd(n.type, n.from);
        if (!editing) n.no = contractNo(emp.code, n.type, n.from, emp.contracts.map((c) => c.no));
      }
      if ('type' in patch) {
        n.rate = n.type === 'Thử việc' ? 85 : f.rate === 85 ? 100 : f.rate;
        if (!editing) n.insurance = { bhxh: isOfficial(n.type), bhyt: isOfficial(n.type), bhtn: isOfficial(n.type) };
      }
      if (('type' in patch || 'signDate' in patch) && (!f.signer || f.signer === findSigner(emp, f.type, f.signDate, sigList)?.signer)) {
        const sg = findSigner(emp, n.type, n.signDate || n.from, sigList);
        if (sg) Object.assign(n, { signer: sg.signer, signerTitle: sg.signerTitle, authorization: sg.authorization });
      }
      return n;
    });
    setErrors((e) => {
      const x = { ...e };
      Object.keys(patch).forEach((k) => delete x[k]);
      return x;
    });
  };

  if (!emp)
    return (
      <Panel title="Chọn nhân viên" icon={UserSearch}>
        <div className="flex flex-col items-center gap-3 py-8">
          <EmployeePicker list={list} value={undefined} onPick={setEmpId} />
          <p className="text-[12.5px] text-slate-500">Gõ mã nhân viên hoặc họ tên rồi bấm Enter để hiện thông tin và các hợp đồng của nhân viên.</p>
        </div>
      </Panel>
    );

  const others = form ? emp.contracts.filter((c) => c.id !== form.id) : [];
  const sorted = [...emp.contracts].sort((a, b) => b.from.localeCompare(a.from));
  const cur = currentContract(emp);
  const doSave = (c: EmpContract, updateOfficial: boolean) => {
    const old = emp.contracts.find((x) => x.id === c.id);
    const firstOfficial = isOfficial(c.type) && !others.some((o) => isOfficial(o.type) && o.from < c.from);
    const hadProbation = others.some((o) => o.type === 'Thử việc' && o.from < c.from);
    const logs: { action: string; changes?: string[] }[] = [old ? { action: 'Sửa hợp đồng', changes: [c.no, ...diffContract(old, c)] } : { action: 'Thêm hợp đồng', changes: [contractLine(c)] }];
    const patch: Partial<Employee> = {};
    if (updateOfficial) {
      patch.officialDate = c.from;
      logs.push({ action: 'Cập nhật ngày vào chính thức', changes: [`Ngày vào chính thức: ${dmy(emp.officialDate) || '—'} → ${dmy(c.from)} (theo HĐ chính thức đầu tiên ${c.no})`] });
    }
    if (!old && firstOfficial && hadProbation) {
      logs.push({ action: 'Tự sinh quá trình làm việc', changes: [`Từ ngày ${dmy(c.from)} — ${emp.position}, ${emp.department} (HĐ chính thức đầu tiên sau thử việc)`] });
      if (emp.status === 'Thử việc' && c.from <= today()) patch.status = 'Đang làm việc';
    }
    const stamped = { ...c, no: c.no.trim(), updatedAt: nowIso(), updatedBy: ME, createdAt: c.createdAt || nowIso(), createdBy: c.createdBy || ME };
    commitContracts(emp.id, old ? emp.contracts.map((x) => (x.id === c.id ? stamped : x)) : [...emp.contracts, stamped], logs, patch);
    flash(old ? `Đã cập nhật hợp đồng ${c.no}` : `Đã thêm hợp đồng ${c.no}${patch.status ? ' · NV chuyển sang Đang làm việc' : ''}`);
    setAskOfficial(null);
    setEditId(null);
    setForm(blankContract({ ...emp, ...patch, contracts: old ? emp.contracts : [...emp.contracts, stamped] }));
  };
  const save = () => {
    if (!form) return;
    const err = validateContract(form, others);
    setErrors(err);
    if (Object.keys(err).length) return flash(`Còn ${Object.keys(err).length} ô chưa hợp lệ — xem các ô viền đỏ`);
    const firstOfficial = isOfficial(form.type) && !others.some((o) => isOfficial(o.type) && o.from < form.from);
    if (firstOfficial && form.from !== emp.officialDate) return setAskOfficial(form);
    doSave(form, false);
  };
  const remove = (c: EmpContract) => {
    commitContracts(emp.id, emp.contracts.filter((x) => x.id !== c.id), [{ action: 'Xoá hợp đồng', changes: [contractLine(c)] }]);
    flash(`Đã xoá hợp đồng ${c.no}`);
    setDelId(null);
    if (form?.id === c.id) setEditId(null);
  };
  const copy = (c: EmpContract) => {
    const from = c.to ? addDays(c.to, 1) : today();
    const base = blankContract(emp, c.type, from);
    setEditId(null);
    setForm({ ...c, ...base, type: c.type, jobDesc: c.jobDesc, workplace: c.workplace, workTime: c.workTime, baseSalary: c.baseSalary, rate: c.rate, allowances: (c.allowances || []).map((a) => ({ ...a, id: uid() })), insurance: { bhxh: false, bhyt: false, bhtn: false, ...c.insurance }, note: c.note, files: [] });
    flash(`Đã sao chép ${c.no} — kiểm tra ngày hiệu lực rồi bấm Lưu`);
  };
  const e = errors;
  const f = form!;
  const lab = 'bg-[#f3f6fa] border-b border-r border-slate-200 px-3 flex items-center text-[12.5px] font-medium text-slate-600 whitespace-nowrap min-h-[40px]';
  const val = 'border-b border-slate-200 px-2.5 py-1.5 flex flex-col justify-center min-w-0';
  const req = <span className="text-rose-600 ml-0.5">*</span>;
  const cell = (label: React.ReactNode, node: React.ReactNode, err?: string, right = false) => (
    <>
      <div className={`${lab} ${right ? 'lg:border-l' : ''}`}>{label}</div>
      <div className={`${val} ${!right ? 'lg:border-r lg:border-slate-200' : ''}`}>
        {node}
        {err && <span className="text-[11px] text-rose-600 mt-0.5 leading-tight">{err}</span>}
      </div>
    </>
  );

  return (
    <div className="space-y-3">
      {/* Khung chọn nhân viên */}
      <Panel title="Nhân viên" icon={UserSearch} noPad actions={<EmployeePicker list={list} value={emp} onPick={setEmpId} />}>
        <InfoGrid
          labelW={[130, 150]}
          left={[
            { label: 'Mã nhân viên', value: <span className="font-mono font-bold text-[#1f5fa8] text-[15px]">{emp.code}</span> },
            { label: 'Công ty', value: emp.company },
            { label: 'Phòng ban', value: emp.department },
            { label: 'Ngày vào làm', value: dmy(emp.joinDate) },
          ]}
          right={[
            { label: 'Họ và tên', value: <span className="font-bold uppercase">{emp.fullName}</span> },
            { label: 'Khối', value: emp.division },
            { label: 'Chức danh', value: `${emp.position} · ${emp.level}` },
            { label: 'Ngày vào chính thức', value: dmy(emp.officialDate) },
          ]}
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-1.5 text-[12px] text-slate-600 bg-slate-50">
          <span>
            Trạng thái: <StatusTag status={emp.status} />
          </span>
          <span>
            Loại HĐ hiện tại: <b className="text-slate-800">{cur?.type || 'Chưa có'}</b>
          </span>
          <span>
            Số HĐ đã ký: <b className="text-slate-800">{emp.contracts.length}</b>
          </span>
        </div>
      </Panel>

      {/* Form hợp đồng */}
      {form && (
        <Panel
          title={editing ? `Sửa hợp đồng ${f.no}` : 'Thêm mới hợp đồng lao động'}
          icon={editing ? Pencil : Plus}
          noPad
          actions={
            <>
              <Btn icon={RefreshCw} className="h-7" onClick={() => (setEditId(null), setForm(blankContract(emp)), setErrors({}), setAskOfficial(null))}>
                Làm mới
              </Btn>
              {editing && (
                <Btn icon={Printer} className="h-7" onClick={() => printContract(emp, f)}>
                  In HĐ
                </Btn>
              )}
              <Btn variant="primary" icon={Save} className="h-7" onClick={save}>
                Lưu
              </Btn>
            </>
          }
        >
          {askOfficial && (
            <div className="flex flex-wrap items-center gap-3 px-3 py-2 bg-amber-50 border-b border-amber-200 text-[12.5px] text-amber-900">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="flex-1 min-w-[280px]">
                Đây là <b>hợp đồng chính thức đầu tiên</b> của nhân viên, ngày hiệu lực <b>{dmy(askOfficial.from)}</b> khác Ngày vào chính thức{' '}
                <b>{dmy(emp.officialDate) || '(chưa có)'}</b>. Cập nhật Ngày vào chính thức theo hợp đồng?
              </span>
              <Btn className="h-7" onClick={() => doSave(askOfficial, false)}>
                Lưu, giữ nguyên ngày
              </Btn>
              <Btn variant="primary" icon={Check} className="h-7" onClick={() => doSave(askOfficial, true)}>
                Cập nhật & lưu
              </Btn>
            </div>
          )}
          <div className="grid grid-cols-[140px_minmax(0,1fr)] lg:grid-cols-[140px_minmax(0,1fr)_150px_minmax(0,1fr)] -mb-px">
            {cell(<>Loại hợp đồng{req}</>, <Select value={f.type} onChange={(v) => set({ type: v })} options={CONTRACT_TYPES} empty="— Chọn loại HĐ —" err={!!e.type} />, e.type)}
            {cell(
              'Số hợp đồng',
              <input value={f.no} onChange={(ev) => set({ no: ev.target.value })} className={`${erp.inputFull} font-mono ${e.no ? '!border-rose-400' : ''}`} title="Tự sinh theo Mã NV / Năm / Loại HĐ — sửa được" />,
              e.no,
              true,
            )}
            {cell(<>Ngày hiệu lực{req}</>, <DateInput value={f.from} onChange={(v) => set({ from: v })} className={e.from ? '!border-rose-400' : ''} />, e.from)}
            {cell(
              <>Ngày hết hiệu lực{f.type !== 'Không xác định thời hạn' && req}</>,
              f.type === 'Không xác định thời hạn' ? <span className="text-[12.5px] text-slate-500 h-8 flex items-center">Không xác định thời hạn</span> : <DateInput value={f.to} onChange={(v) => set({ to: v })} className={e.to ? '!border-rose-400' : ''} />,
              e.to,
              true,
            )}
            {cell('Mô tả công việc', <textarea value={f.jobDesc || ''} onChange={(ev) => set({ jobDesc: ev.target.value })} rows={2} className={`${erp.inputFull} h-auto py-1 resize-y`} />)}
            {cell('Nơi làm việc', <Select value={f.workplace || ''} onChange={(v) => set({ workplace: v })} options={WORKPLACES} empty="— Chọn —" />, undefined, true)}
            {cell('Thời gian làm việc', <Select value={f.workTime || ''} onChange={(v) => set({ workTime: v })} options={WORK_TIMES} empty="— Chọn —" />)}
            {cell('Ngày ký', <DateInput value={f.signDate} onChange={(v) => set({ signDate: v })} />, undefined, true)}
            {cell(
              'Người ký',
              <>
                <input list="signer-people" value={f.signer || ''} onChange={(ev) => set({ signer: ev.target.value.toUpperCase() })} placeholder="Theo thiết lập người ký" className={erp.inputFull} />
                <datalist id="signer-people">
                  {signerOptions(list).map((p) => (
                    <option key={p} value={p} />
                  ))}
                </datalist>
                {(() => {
                  const sg = findSigner(emp, f.type, f.signDate || f.from, sigList);
                  return sg && sg.signer !== f.signer ? (
                    <button type="button" className="self-start mt-0.5 text-[11px] text-[#1f5fa8] hover:underline cursor-pointer" onClick={() => set({ signer: sg.signer, signerTitle: sg.signerTitle, authorization: sg.authorization })}>
                      Dùng theo thiết lập: {sg.signer}
                    </button>
                  ) : sg ? (
                    <span className="text-[11px] text-slate-400 mt-0.5">Theo thiết lập người ký</span>
                  ) : (
                    <span className="text-[11px] text-amber-700 mt-0.5">Chưa có thiết lập người ký phù hợp</span>
                  );
                })()}
              </>,
            )}
            {cell('Chức danh người ký', <input value={f.signerTitle || ''} onChange={(ev) => set({ signerTitle: ev.target.value })} className={erp.inputFull} />, undefined, true)}
            {cell('Nơi ký', <input value={f.signPlace || ''} onChange={(ev) => set({ signPlace: ev.target.value })} className={erp.inputFull} />)}
            {cell('Theo giấy uỷ quyền', <input value={f.authorization || ''} onChange={(ev) => set({ authorization: ev.target.value })} className={erp.inputFull} />, undefined, true)}
            {cell(
              'File đính kèm',
              <span className="flex flex-wrap items-center gap-1.5">
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept=".doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={(ev) => {
                    const fs = [...(ev.target.files || [])];
                    ev.target.value = '';
                    set({ files: [...(f.files || []), ...fs.map((x) => ({ id: uid(), name: x.name, size: x.size, at: nowIso(), by: ME }) as EmpFile)] });
                  }}
                />
                <Btn icon={Paperclip} className="h-7" onClick={() => fileRef.current?.click()}>
                  Đính kèm
                </Btn>
                {(f.files || []).map((x) => (
                  <span key={x.id} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] bg-slate-100 border border-slate-200 text-[11.5px]">
                    {x.name}
                    <button type="button" className="text-slate-400 hover:text-rose-600 cursor-pointer" onClick={() => set({ files: (f.files || []).filter((y) => y.id !== x.id) })}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
                <span className="text-[11px] text-slate-400">.doc .xls .jpg .pdf</span>
              </span>,
            )}
            {cell('Ghi chú', <textarea value={f.note} onChange={(ev) => set({ note: ev.target.value })} rows={2} className={`${erp.inputFull} h-auto py-1 resize-y`} />, undefined, true)}
          </div>
          {/* Lương và phụ cấp · Bảo hiểm */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] border-t border-slate-200 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            <div className="p-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-2">Thông tin lương và phụ cấp (VNĐ / tháng)</p>
              <div className="grid grid-cols-3 gap-2">
                <Field label="Lương cơ bản gốc">
                  <MoneyInput value={f.baseSalary} onChange={(n) => set({ baseSalary: n })} />
                </Field>
                <Field label="Mức hưởng (%)" err={e.rate}>
                  <input type="number" min={0} max={100} value={f.rate ?? 100} onChange={(ev) => set({ rate: Number(ev.target.value) })} className={`${erp.inputFull} text-right tabular-nums`} />
                </Field>
                <Field label="Lương cơ bản">
                  <input value={money(salaryOf(f))} readOnly tabIndex={-1} className={`${erp.inputFull} text-right tabular-nums !bg-slate-100 font-semibold`} title="= Lương cơ bản gốc × Mức hưởng" />
                </Field>
              </div>
              <table className={`${erp.table} mt-2`}>
                <thead>
                  <tr>
                    <th className={`${erp.th} text-left`}>Phụ cấp</th>
                    <th className={`${erp.th} text-right w-40`}>Số tiền</th>
                    <th className={`${erp.th} w-9`} />
                  </tr>
                </thead>
                <tbody>
                  {(f.allowances || []).map((a) => {
                    const up = (p: Partial<EmpAllowance>) => set({ allowances: (f.allowances || []).map((x) => (x.id === a.id ? { ...x, ...p } : x)) });
                    return (
                      <tr key={a.id}>
                        <td className="border border-slate-200 p-0.5">
                          <input list="allow-names" value={a.name} onChange={(ev) => up({ name: ev.target.value })} className={`${erp.inputFull} !border-transparent focus:!border-[#1f5fa8]`} />
                        </td>
                        <td className="border border-slate-200 p-0.5">
                          <MoneyInput value={a.amount} onChange={(n) => up({ amount: n })} className="!border-transparent focus:!border-[#1f5fa8]" />
                        </td>
                        <td className="border border-slate-200 text-center">
                          <button type="button" className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer" onClick={() => set({ allowances: (f.allowances || []).filter((x) => x.id !== a.id) })}>
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {!(f.allowances || []).length && (
                    <tr>
                      <td colSpan={3} className="border border-slate-200 px-2.5 py-2 text-center text-[12px] text-slate-400">
                        Chưa có phụ cấp
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className={erp.totalRow}>
                    <td className={erp.td}>Tổng thu nhập (lương cơ bản + phụ cấp)</td>
                    <td className={`${erp.td} ${erp.num}`}>{money(salaryOf(f) + allowTotal(f)) || '0'}</td>
                    <td className={erp.td} />
                  </tr>
                </tfoot>
              </table>
              <datalist id="allow-names">
                {ALLOWANCE_NAMES.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
              <Btn icon={Plus} className="h-7 mt-2" onClick={() => set({ allowances: [...(f.allowances || []), { id: uid(), name: '', amount: 0 }] })}>
                Thêm phụ cấp
              </Btn>
            </div>
            <div className="p-3">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-2">Thông tin bảo hiểm</p>
              <div className="flex flex-col gap-2 text-[12.5px]">
                {(
                  [
                    ['bhxh', 'Bảo hiểm xã hội (BHXH)'],
                    ['bhyt', 'Bảo hiểm y tế (BHYT)'],
                    ['bhtn', 'Bảo hiểm thất nghiệp (BHTN)'],
                  ] as const
                ).map(([k, l]) => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <CheckBox checked={!!f.insurance?.[k]} onChange={(v) => set({ insurance: { bhxh: false, bhyt: false, bhtn: false, ...f.insurance, [k]: v } })} />
                    {l}
                  </label>
                ))}
              </div>
              <p className="mt-2 text-[11.5px] text-slate-400">Thường tick khi ký hợp đồng chính thức đầu tiên (từ thử việc lên chính thức).</p>
            </div>
          </div>
        </Panel>
      )}

      {/* Bảng HĐ của nhân viên */}
      <Panel title={`Hợp đồng của nhân viên (${emp.contracts.length})`} icon={ClipboardList} noPad>
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1100px]`}>
            <thead>
              <tr>
                {['STT', 'In HĐ', 'Sửa', 'Sao chép', 'Loại hợp đồng', 'Số hợp đồng', 'Ngày ký', 'Từ ngày', 'Đến ngày', 'Lương cơ bản', 'Người ký', 'Tình trạng', 'Ghi chú', 'Xoá'].map((h) => (
                  <th key={h} className={`${th} border-t-0 first:border-l-0 last:border-r-0`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => (
                <tr key={c.id} className={`${erp.tr} ${form?.id === c.id ? '!bg-[#fff6d6]' : ''}`}>
                  <td className={`${erp.td} text-center text-slate-500 border-l-0 w-12`}>{i + 1}</td>
                  {(
                    [
                      [Printer, 'In hợp đồng', () => printContract(emp, c), 'text-[#e0883a]'],
                      [Pencil, 'Sửa hợp đồng', () => setEditId(c.id), 'text-amber-600'],
                      [Copy, 'Sao chép thành HĐ mới', () => copy(c), 'text-emerald-600'],
                    ] as const
                  ).map(([Icon, t, fn, cls], j) => (
                    <td key={j} className={`${erp.td} text-center w-16`}>
                      <button type="button" title={t} onClick={fn} className={`p-1 ${cls} hover:opacity-80 cursor-pointer`}>
                        <Icon size={14} />
                      </button>
                    </td>
                  ))}
                  <td className={`${erp.td} whitespace-nowrap`}>{c.type}</td>
                  <td className={`${erp.td} font-mono text-[12px] whitespace-nowrap`}>{c.no}</td>
                  <td className={`${erp.td} text-center`}>{dmy(c.signDate)}</td>
                  <td className={`${erp.td} text-center`}>{dmy(c.from)}</td>
                  <td className={`${erp.td} text-center whitespace-nowrap`}>{c.to ? dmy(c.to) : 'Không thời hạn'}</td>
                  <td className={`${erp.td} ${erp.num}`}>{money(salaryOf(c)) || '—'}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{c.signer || '—'}</td>
                  <td className={erp.td}>
                    <StateTag c={c} />
                  </td>
                  <td className={`${erp.td} text-slate-600 max-w-[200px] truncate`} title={c.note}>
                    {c.note || '—'}
                  </td>
                  <td className={`${erp.td} border-r-0 text-center whitespace-nowrap w-24`}>
                    {delId === c.id ? (
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-rose-700">
                        Xoá?
                        <button type="button" className="font-bold underline cursor-pointer" onClick={() => remove(c)}>
                          Có
                        </button>
                        <button type="button" className="underline text-slate-500 cursor-pointer" onClick={() => setDelId(null)}>
                          Không
                        </button>
                      </span>
                    ) : (
                      <button type="button" className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer" title="Xoá hợp đồng" onClick={() => setDelId(c.id)}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!sorted.length && (
                <tr>
                  <td colSpan={14} className="px-3 py-8 text-center text-[12.5px] text-slate-400">
                    Nhân viên chưa có hợp đồng — nhập thông tin ở khung trên rồi bấm Lưu.
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
// Tab 3 — Hết hạn & Tái ký hợp đồng
// ==========================================================================
const RenewTab: React.FC<{ list: Employee[]; onOpen: (empId: string, contractId: string) => void; flash: (m: string) => void }> = ({ list, onOpen, flash }) => {
  const t = today();
  const [f, setF] = useState({ from: addDays(t, -60), to: addDays(t, 60), company: '', division: '', department: '', type: '' });
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [nc, setNc] = useState({ type: '', workTime: '', signDate: t, signer: '', signerTitle: '', signPlace: 'Hà Nội', authorization: '' });
  const sigList = useSigners();
  const rows = useMemo(
    () =>
      list
        .filter((e) => e.status !== 'Đã nghỉ việc')
        .map((e) => ({ e, c: [...e.contracts].sort((a, b) => b.from.localeCompare(a.from))[0] }))
        .filter((r): r is Row => !!r.c && !!r.c.to)
        .filter(({ e, c }) => c.to >= f.from && c.to <= f.to && (!f.company || e.company === f.company) && (!f.division || e.division === f.division) && (!f.department || e.department === f.department) && (!f.type || c.type === f.type))
        .sort((a, b) => a.c.to.localeCompare(b.c.to)),
    [list, f],
  );
  const chosen = rows.filter((r) => picked.has(r.e.id));
  const allOn = rows.length > 0 && rows.every((r) => picked.has(r.e.id));
  const renew = () => {
    chosen.forEach(({ e, c }) => {
      const type = nc.type || nextContractType(c.type);
      const from = addDays(c.to, 1);
      const sg = findSigner(e, type, nc.signDate || from, sigList);
      const n: EmpContract = {
        ...c,
        id: uid(),
        type,
        from,
        to: contractEnd(type, from),
        no: contractNo(e.code, type, from, e.contracts.map((x) => x.no)),
        signDate: nc.signDate || from,
        workTime: nc.workTime || c.workTime,
        signer: nc.signer || sg?.signer || c.signer,
        signerTitle: nc.signerTitle || (nc.signer ? '' : sg?.signerTitle) || c.signerTitle,
        signPlace: nc.signPlace || c.signPlace,
        authorization: nc.authorization || (nc.signer ? '' : sg?.authorization) || '',
        rate: type === 'Thử việc' ? c.rate : c.rate === 85 ? 100 : c.rate,
        insurance: isOfficial(type) ? { bhxh: true, bhyt: true, bhtn: true } : c.insurance,
        allowances: (c.allowances || []).map((a) => ({ ...a, id: uid() })),
        files: [],
        note: `Tái ký từ HĐ ${c.no}`,
        createdAt: nowIso(),
        createdBy: ME,
      };
      const firstOfficial = isOfficial(type) && !e.contracts.some((o) => isOfficial(o.type));
      const logs = [{ action: 'Tái ký hợp đồng', changes: [`${c.no} → ${contractLine(n)}`] }];
      const patch: Partial<Employee> = {};
      if (firstOfficial) {
        patch.officialDate = from;
        if (e.status === 'Thử việc') patch.status = 'Đang làm việc';
        logs.push({ action: 'Tự sinh quá trình làm việc', changes: [`Từ ngày ${dmy(from)} (HĐ chính thức đầu tiên sau thử việc) · Ngày vào chính thức = ${dmy(from)}`] });
      }
      commitContracts(e.id, [...e.contracts, n], logs, patch);
    });
    flash(`Đã tái ký ${chosen.length} hợp đồng`);
    setPicked(new Set());
  };
  const exportXlsx = () => {
    const aoa = [
      ['STT', 'Mã NV', 'Tên nhân viên', 'Khối', 'Phòng ban', 'Chức danh', 'Loại HĐ', 'Số HĐ', 'Hiệu lực từ', 'Hết hạn', 'Còn lại (ngày)', 'HĐ đề xuất'],
      ...rows.map(({ e, c }, i) => [i + 1, e.code, e.fullName, e.division, e.department, e.position, c.type, c.no, dmy(c.from), dmy(c.to), daysBetween(t, c.to), nextContractType(c.type)]),
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), 'HetHanHD');
    XLSX.writeFile(wb, `het-han-hop-dong_${t.replace(/-/g, '')}.xlsx`);
  };
  return (
    <div className="space-y-3">
      <Panel title="Thông tin tìm kiếm" icon={Search}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-2">
          <Field label="Kết thúc (hết hạn) từ ngày" className="lg:col-span-2">
            <Range from={f.from} to={f.to} onFrom={(v) => setF({ ...f, from: v })} onTo={(v) => setF({ ...f, to: v })} />
          </Field>
          <Field label="Công ty">
            <Select value={f.company} onChange={(v) => setF({ ...f, company: v })} options={COMPANIES} />
          </Field>
          <Field label="Loại hợp đồng">
            <Select value={f.type} onChange={(v) => setF({ ...f, type: v })} options={CONTRACT_TYPES.filter((x) => x !== 'Không xác định thời hạn')} />
          </Field>
          <Field label="Khối">
            <Select value={f.division} onChange={(v) => setF({ ...f, division: v })} options={DIVISIONS} />
          </Field>
          <Field label="Phòng ban">
            <Select value={f.department} onChange={(v) => setF({ ...f, department: v })} options={DEPARTMENTS} />
          </Field>
        </div>
      </Panel>

      <Panel
        title="Danh sách hết hạn hợp đồng"
        icon={Bell}
        noPad
        actions={
          <>
            <Btn icon={Mail} className="h-7" disabled={!chosen.length} onClick={() => (flash(`Đã gửi email nhắc tái ký tới ${chosen.length} nhân viên và quản lý trực tiếp (mô phỏng)`), setPicked(new Set()))}>
              Gửi email
            </Btn>
            <Btn icon={FileSpreadsheet} className="h-7" onClick={exportXlsx}>
              Xuất dữ liệu
            </Btn>
          </>
        }
        footer="Hợp đồng mới nhất của nhân viên đang làm việc, hết hạn trong khoảng ngày đã chọn. Chọn nhân viên rồi nhập thông tin Hợp đồng mới bên dưới để tái ký."
      >
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1200px]`}>
            <thead>
              <tr>
                <th className={`${th} border-t-0 border-l-0 w-9`}>
                  <span className="flex justify-center">
                    <CheckBox checked={allOn} onChange={(v) => setPicked(v ? new Set(rows.map((r) => r.e.id)) : new Set())} />
                  </span>
                </th>
                {['STT', 'Mã NV', 'Tên nhân viên', 'Khối', 'Phòng ban', 'Chức danh', 'Loại HĐ', 'Số HĐ', 'Hiệu lực từ', 'Hết hạn', 'Còn lại', 'HĐ đề xuất'].map((h) => (
                  <th key={h} className={`${th} border-t-0 last:border-r-0`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ e, c }, i) => {
                const d = daysBetween(t, c.to);
                return (
                  <tr key={e.id} className={`${erp.tr} ${picked.has(e.id) ? '!bg-[#eaf2fc]' : ''}`}>
                    <td className={`${erp.td} border-l-0`}>
                      <span className="flex justify-center">
                        <CheckBox checked={picked.has(e.id)} onChange={() => setPicked((s) => (s.has(e.id) ? new Set([...s].filter((x) => x !== e.id)) : new Set([...s, e.id])))} />
                      </span>
                    </td>
                    <td className={`${erp.td} text-center text-slate-500`}>{i + 1}</td>
                    <td className={`${erp.td} ${erp.code} font-semibold`}>
                      <button type="button" className="hover:underline cursor-pointer" onClick={() => onOpen(e.id, c.id)} title="Mở hợp đồng của nhân viên">
                        {e.code}
                      </button>
                    </td>
                    <td className={`${erp.td} font-semibold whitespace-nowrap`}>{e.fullName}</td>
                    <td className={`${erp.td} text-center`}>{e.division}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{e.department}</td>
                    <td className={erp.td}>{e.position}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{c.type}</td>
                    <td className={`${erp.td} font-mono text-[12px] whitespace-nowrap`}>{c.no}</td>
                    <td className={`${erp.td} text-center`}>{dmy(c.from)}</td>
                    <td className={`${erp.td} text-center font-semibold`}>{dmy(c.to)}</td>
                    <td className={`${erp.td} text-center whitespace-nowrap`}>
                      {d < 0 ? <Tag cls="bg-rose-50 text-rose-700 border-rose-300">Quá hạn {-d} ngày</Tag> : d <= 30 ? <Tag cls="bg-amber-50 text-amber-700 border-amber-300">Còn {d} ngày</Tag> : <span className="text-slate-600">Còn {d} ngày</span>}
                    </td>
                    <td className={`${erp.td} border-r-0 whitespace-nowrap text-[#1f5fa8]`}>{nc.type || nextContractType(c.type)}</td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={13} className="px-3 py-10 text-center text-[12.5px] text-slate-400">
                    Không có hợp đồng hết hạn trong khoảng ngày đã chọn.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title="Hợp đồng mới"
        icon={FileSignature}
        actions={
          <Btn variant="primary" icon={Save} className="h-7" disabled={!chosen.length} onClick={renew}>
            Tái ký {chosen.length ? `${chosen.length} nhân viên` : ''}
          </Btn>
        }
        footer="Hợp đồng mới có hiệu lực từ ngày kế tiếp ngày hết hạn HĐ cũ; giữ nguyên lương, phụ cấp, nơi làm việc của HĐ cũ. Để trống Người ký → lấy theo Thiết lập người ký."
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-2">
          <Field label="Loại hợp đồng mới">
            <Select value={nc.type} onChange={(v) => setNc({ ...nc, type: v })} options={CONTRACT_TYPES.filter((x) => x !== 'Thử việc')} empty="Tự động theo HĐ cũ" />
          </Field>
          <Field label="Thời gian làm việc">
            <Select value={nc.workTime} onChange={(v) => setNc({ ...nc, workTime: v })} options={WORK_TIMES} empty="Giữ như HĐ cũ" />
          </Field>
          <Field label="Ngày ký">
            <DateInput value={nc.signDate} onChange={(v) => setNc({ ...nc, signDate: v })} />
          </Field>
          <Field label="Nơi ký">
            <input value={nc.signPlace} onChange={(e) => setNc({ ...nc, signPlace: e.target.value })} className={erp.inputFull} />
          </Field>
          <Field label="Người ký">
            <input list="signer-people-renew" value={nc.signer} onChange={(e) => setNc({ ...nc, signer: e.target.value.toUpperCase() })} placeholder="Theo thiết lập người ký" className={erp.inputFull} />
            <datalist id="signer-people-renew">
              {signerOptions(list).map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </Field>
          <Field label="Chức danh">
            <input value={nc.signerTitle} onChange={(e) => setNc({ ...nc, signerTitle: e.target.value })} className={erp.inputFull} />
          </Field>
          <Field label="Theo giấy uỷ quyền" className="lg:col-span-2">
            <input value={nc.authorization} onChange={(e) => setNc({ ...nc, authorization: e.target.value })} className={erp.inputFull} />
          </Field>
        </div>
      </Panel>
    </div>
  );
};

// ==========================================================================
// Tab 4 — Thiết lập người ký hợp đồng
// ==========================================================================
const SignerTab: React.FC<{ list: Employee[]; flash: (m: string) => void }> = ({ list, flash }) => {
  const rows = useSigners();
  const blank = (): SignerSetting => ({ id: uid(), company: COMPANIES[0], division: '', department: '', empType: '', from: today(), types: [], signer: '', signerTitle: '', authorization: '' });
  const [form, setForm] = useState<SignerSetting>(blank);
  const [err, setErr] = useState<Record<string, string>>({});
  const [delId, setDelId] = useState<string | null>(null);
  const editing = rows.some((r) => r.id === form.id);
  const set = (p: Partial<SignerSetting>) => (setForm((f) => ({ ...f, ...p })), setErr((e) => { const x = { ...e }; Object.keys(p).forEach((k) => delete x[k]); return x; }));
  const allTypes = form.types.length === CONTRACT_TYPES.length;
  const save = () => {
    const e: Record<string, string> = {};
    if (!form.company) e.company = 'Bắt buộc';
    if (!form.from) e.from = 'Bắt buộc';
    if (!form.types.length) e.types = 'Chọn ít nhất 1 loại hợp đồng';
    if (!form.signer.trim()) e.signer = 'Bắt buộc';
    setErr(e);
    if (Object.keys(e).length) return;
    setSigners((l) => (editing ? l.map((x) => (x.id === form.id ? form : x)) : [...l, form]));
    flash(editing ? 'Đã cập nhật thiết lập người ký' : 'Đã thêm thiết lập người ký');
    setForm(blank());
  };
  const exportXlsx = () => {
    const aoa = [['STT', 'Công ty', 'Khối', 'Phòng ban', 'Loại nhân viên', 'Loại hợp đồng', 'Người ký', 'Chức danh', 'Theo giấy uỷ quyền', 'Ngày hiệu lực'], ...rows.map((r, i) => [i + 1, r.company, r.division || 'Tất cả', r.department || 'Tất cả', r.empType || 'Tất cả', r.types.length === CONTRACT_TYPES.length ? 'Tất cả' : r.types.join('; '), r.signer, r.signerTitle, r.authorization, dmy(r.from)])];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), 'NguoiKy');
    XLSX.writeFile(wb, 'thiet-lap-nguoi-ky-hop-dong.xlsx');
  };
  return (
    <div className="space-y-3">
      <Panel
        title={editing ? 'Sửa thiết lập người ký' : 'Thêm mới thiết lập người ký'}
        icon={editing ? Pencil : Plus}
        actions={
          <>
            <Btn icon={RefreshCw} className="h-7" onClick={() => (setForm(blank()), setErr({}))}>
              Làm mới
            </Btn>
            <Btn variant="primary" icon={Save} className="h-7" onClick={save}>
              Lưu
            </Btn>
          </>
        }
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-2">
          <Field label="Công ty" req err={err.company}>
            <Select value={form.company} onChange={(v) => set({ company: v })} options={COMPANIES} empty="— Chọn —" err={!!err.company} />
          </Field>
          <Field label="Khối">
            <Select value={form.division} onChange={(v) => set({ division: v })} options={DIVISIONS} />
          </Field>
          <Field label="Phòng ban">
            <Select value={form.department} onChange={(v) => set({ department: v })} options={DEPARTMENTS} />
          </Field>
          <Field label="Loại nhân viên">
            <Select value={form.empType} onChange={(v) => set({ empType: v })} options={EMP_TYPES} />
          </Field>
          <Field label="Ngày hiệu lực" req err={err.from}>
            <DateInput value={form.from} onChange={(v) => set({ from: v })} />
          </Field>
          <Field label="Người ký" req err={err.signer}>
            <input list="signer-people-setup" value={form.signer} onChange={(e) => set({ signer: e.target.value.toUpperCase() })} placeholder="Gõ để tìm người ký" className={`${erp.inputFull} ${err.signer ? '!border-rose-400' : ''}`} />
            <datalist id="signer-people-setup">
              {signerOptions(list).map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </Field>
          <Field label="Chức danh người ký">
            <input value={form.signerTitle} onChange={(e) => set({ signerTitle: e.target.value })} className={erp.inputFull} />
          </Field>
          <Field label="Theo giấy uỷ quyền">
            <input value={form.authorization} onChange={(e) => set({ authorization: e.target.value })} className={erp.inputFull} />
          </Field>
          <Field label="Loại hợp đồng" req err={err.types} className="col-span-2 lg:col-span-4">
            <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5 py-1 text-[12.5px]">
              {CONTRACT_TYPES.map((tp) => (
                <label key={tp} className="flex items-center gap-1.5 cursor-pointer">
                  <CheckBox checked={form.types.includes(tp)} onChange={(v) => set({ types: v ? CONTRACT_TYPES.filter((x) => form.types.includes(x) || x === tp) : form.types.filter((x) => x !== tp) })} />
                  {tp}
                </label>
              ))}
              <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                <CheckBox checked={allTypes} onChange={(v) => set({ types: v ? [...CONTRACT_TYPES] : [] })} />
                Tất cả
              </label>
            </span>
          </Field>
        </div>
      </Panel>

      <Panel
        title={`Danh sách thiết lập người ký (${rows.length})`}
        icon={Settings2}
        noPad
        actions={
          <Btn icon={FileSpreadsheet} className="h-7" onClick={exportXlsx}>
            Xuất dữ liệu
          </Btn>
        }
        footer="Khi tạo hợp đồng, người ký được lấy theo thiết lập khớp Công ty / Khối / Phòng ban / Loại NV / Loại HĐ có hiệu lực đến ngày ký — ưu tiên thiết lập cụ thể nhất, mới nhất."
      >
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1150px]`}>
            <thead>
              <tr>
                {['STT', 'Công ty', 'Khối', 'Phòng ban', 'Loại NV', 'Loại hợp đồng', 'Người ký', 'Chức danh', 'Theo giấy uỷ quyền', 'Ngày hiệu lực', 'Sửa', 'Xoá'].map((h) => (
                  <th key={h} className={`${th} border-t-0 first:border-l-0 last:border-r-0`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className={`${erp.tr} ${form.id === r.id ? '!bg-[#fff6d6]' : ''}`}>
                  <td className={`${erp.td} text-center text-slate-500 border-l-0 w-12`}>{i + 1}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{r.company}</td>
                  <td className={`${erp.td} text-center whitespace-nowrap`}>{r.division || <span className="text-slate-400">Tất cả</span>}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{r.department || <span className="text-slate-400">Tất cả</span>}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{r.empType || <span className="text-slate-400">Tất cả</span>}</td>
                  <td className={`${erp.td} text-[12px]`}>
                    {r.types.length === CONTRACT_TYPES.length ? (
                      <Tag cls="bg-slate-100 text-slate-600 border-slate-300">Tất cả</Tag>
                    ) : (
                      <span className="flex flex-wrap gap-1">
                        {r.types.map((tp) => (
                          <Tag key={tp} cls="bg-sky-50 text-sky-700 border-sky-200">
                            {tp.replace('Xác định thời hạn ', 'XĐ ')}
                          </Tag>
                        ))}
                      </span>
                    )}
                  </td>
                  <td className={`${erp.td} font-semibold whitespace-nowrap`}>{r.signer}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{r.signerTitle || '—'}</td>
                  <td className={`${erp.td} text-[12px] text-slate-600`}>{r.authorization || '—'}</td>
                  <td className={`${erp.td} text-center`}>{dmy(r.from)}</td>
                  <td className={`${erp.td} text-center`}>
                    <button type="button" className="p-1 text-amber-600 cursor-pointer" title="Sửa" onClick={() => (setForm({ ...r, types: [...r.types] }), setErr({}))}>
                      <Pencil size={14} />
                    </button>
                  </td>
                  <td className={`${erp.td} border-r-0 text-center whitespace-nowrap`}>
                    {delId === r.id ? (
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-rose-700">
                        Xoá?
                        <button type="button" className="font-bold underline cursor-pointer" onClick={() => (setSigners((l) => l.filter((x) => x.id !== r.id)), setDelId(null), flash('Đã xoá thiết lập người ký'))}>
                          Có
                        </button>
                        <button type="button" className="underline text-slate-500 cursor-pointer" onClick={() => setDelId(null)}>
                          Không
                        </button>
                      </span>
                    ) : (
                      <button type="button" className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer" title="Xoá" onClick={() => setDelId(r.id)}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};
