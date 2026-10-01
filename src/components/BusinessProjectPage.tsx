/**
 * BusinessProjectPage — "Dự án kinh doanh" (PAKD).
 *
 * Bước 1 của luồng kinh doanh mới: khai báo THÔNG TIN DỰ ÁN.
 *   • Danh sách dự án  → xem / tạo mới.
 *   • Form khai báo     → thông tin mã, cơ hội kinh doanh, tài chính tổng.
 *   • Chi tiết dự án    → bố cục theo màn PAKD Detail (mã, thông tin cơ hội, tài chính).
 * Các giai đoạn KH01 → KH05 hiển thị dạng stepper ngang dưới thông tin dự án.
 * Dưới cùng là SỐ LIỆU THEO THÁNG (import Excel — BizMonthlyImportModal), 2 tab: Kế hoạch / Thực tế
 * (kế toán import). Chỉ tiêu (dọc) × tháng (ngang); chỉ Chi tách SX / KD; lọc theo năm.
 *
 * Quy trình: Chờ duyệt mã → Chưa có PAKD → PAKD chờ duyệt (GĐK → CFO) → Đang thực hiện → Kết thúc.
 *   Danh sách hiển thị Hạn lập PAKD, Phiên bản PAKD, nút thao tác theo vai trò (chọn PM / GĐK / CFO),
 *   và nhóm cột Thông tin về hợp đồng.
 * Đầu màn danh sách: Sổ theo dõi dự án (ProjectTracker) — lọc Năm / Khối, giá trị HĐ ký so với mục tiêu.
 * Hợp đồng: bấm vào trạng thái "Chưa ký" / "Đã ký" → ContractModal (Cập nhật ký hợp đồng);
 * đã ký thì hiện thêm khung Thông tin hợp đồng (phụ lục, tài liệu đính kèm).
 *
 * Giao diện: khung kiểu phần mềm kế toán (src/components/erp/Erp.tsx).
 * Dữ liệu: src/business/BusinessProjectContext.tsx. Đơn vị: VNĐ.
 */
import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Save,
  Star,
  X,
  Trash2,
  FileUp,
  History,
  LayoutList,
  AlertCircle,
  Wallet,
  Building2,
  Hash,
  Check,
  Flag,
  Search,
  FileSpreadsheet,
  Table2,
  UserCog,
  ClipboardCheck,
  XCircle,
  CheckCircle2,
  Send,
  FileSignature,
  FileText,
  Paperclip,
} from 'lucide-react';
import {
  BizPhase,
  BizProject,
  BizProjectInput,
  BizStatus,
  BIZ_STATUSES,
  BizRole,
  BIZ_ROLES,
  PakdState,
  latestPakd,
  pendingRole,
  addDays,
  DIVISIONS,
  PROJECT_TYPES,
  useBusinessProjects,
  plannedCost,
  grossProfit,
  grossMargin,
  nextMasterCode,
  blankPhases,
  BizMonthRow,
  BizAttachment,
  BizContract,
  FIN_METRICS,
  FinKind,
  latestActualMonth,
  sumRows,
} from '../business/BusinessProjectContext';
import { BizMonthlyImportModal, fmtMonth } from './BizMonthlyImportModal';
import { LedgerDetailModal, LedgerDrill, drillCls } from './LedgerDetailModal';
import { AttachmentList, ContractModal } from './ContractModal';
import { ProjectTracker } from './ProjectTracker';
import { Btn, ErpPage, ErpTitleBar, FieldTable, FolderTabs, FormRow, Panel, Segmented, Tag, erp } from './erp/Erp';

const CURRENT_USER = 'namnv';
const CRUMBS = ['Project Management', 'Dự án kinh doanh'];

const money = (n: number) => Math.round(n || 0).toLocaleString('en-US');
const num = (n: number) => (n ? Math.round(n).toLocaleString('en-US') : '–');
const dmy = (iso: string) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '—');
const dt = (iso: string) => new Date(iso).toLocaleString('vi-VN');

const STATUS_CLS: Record<BizStatus, string> = {
  'Chờ duyệt mã': 'bg-slate-100 text-slate-600 border-slate-300',
  'Chưa có PAKD': 'bg-rose-50 text-rose-700 border-rose-300',
  'PAKD chờ duyệt': 'bg-amber-50 text-amber-700 border-amber-300',
  'Đang thực hiện': 'bg-blue-50 text-blue-700 border-blue-300',
  'Kết thúc': 'bg-emerald-50 text-emerald-700 border-emerald-300',
};
const StatusBadge: React.FC<{ status: BizStatus }> = ({ status }) => <Tag cls={STATUS_CLS[status]}>{status}</Tag>;
const KeyBadge = () => (
  <Tag cls="bg-amber-50 text-amber-700 border-amber-300" icon={Star}>
    KEY
  </Tag>
);

type View = { mode: 'list' } | { mode: 'detail'; id: string } | { mode: 'form'; id?: string };

export const BusinessProjectPage: React.FC = () => {
  const { projects, createProject, updateProject, deleteProject, importMonthly, saveContract, setAttachments, approveCode, submitPakd, decidePakd, finishProject } =
    useBusinessProjects();
  const [view, setView] = useState<View>({ mode: 'list' });
  const [role, setRole] = useState<BizRole>('CFO');
  const actor = `${CURRENT_USER} (${role})`;
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const decide = (p: BizProject, approve: boolean, note: string) => {
    decidePakd(p.id, approve, role, actor, note);
    const v = latestPakd(p)!.version;
    flash(!approve ? `${role} đã từ chối PAKD V${v} — trả về PM` : role === 'GĐK' ? `GĐK đã duyệt PAKD V${v} — chuyển CFO` : `CFO đã duyệt PAKD V${v} — dự án chuyển "Đang thực hiện"`);
  };
  const signContract = (p: BizProject, c: Omit<BizContract, 'updatedAt' | 'updatedBy'>) => {
    saveContract(p.id, c, CURRENT_USER);
    flash(`${p.contract ? 'Đã cập nhật hợp đồng' : 'Đã xác nhận ký hợp đồng'} ${c.number} — ${p.masterCode}`);
  };

  const current = view.mode !== 'list' && 'id' in view && view.id ? projects.find((p) => p.id === view.id) : undefined;

  return (
    <ErpPage>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-5 right-5 z-[120] bg-[#1e3a5f] text-white px-4 py-2.5 rounded-[4px] shadow-lg border border-[#16304f] flex items-center gap-2 text-[12px] font-semibold max-w-md"
          >
            <Check size={14} className="text-emerald-300 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {view.mode === 'list' && (
        <ProjectList
          projects={projects}
          role={role}
          onRoleChange={setRole}
          onView={(p) => setView({ mode: 'detail', id: p.id })}
          onCreate={() => setView({ mode: 'form' })}
          onDecide={decide}
          onSaveContract={signContract}
        />
      )}

      {view.mode === 'detail' && current && (
        <ProjectDetail
          project={current}
          onBack={() => setView({ mode: 'list' })}
          onEdit={() => setView({ mode: 'form', id: current.id })}
          role={role}
          onRoleChange={setRole}
          onApproveCode={() => {
            const deadline = addDays(new Date().toISOString().slice(0, 10), 7);
            approveCode(current.id, actor, deadline);
            flash(`Đã duyệt mã ${current.masterCode} — hạn lập PAKD ${dmy(deadline)}`);
          }}
          onSubmitPakd={() => {
            submitPakd(current.id, actor);
            flash(`Đã nộp PAKD V${current.pakd.length + 1} — chờ GĐK duyệt`);
          }}
          onDecide={(approve, note) => decide(current, approve, note)}
          onFinish={() => {
            if (!window.confirm(`Kết thúc dự án "${current.name}"?`)) return;
            finishProject(current.id, actor);
            flash('Đã kết thúc dự án');
          }}
          onAttachments={(files, note) => setAttachments(current.id, files, CURRENT_USER, note)}
          onSaveContract={(c) => signContract(current, c)}
          onImport={(kind, rows, fileName, summary) => {
            importMonthly(current.id, kind, rows, fileName, CURRENT_USER);
            flash(`${summary} — Version ${current.version + 1}`);
          }}
          onDelete={() => {
            if (!window.confirm(`Xoá dự án "${current.name}"?`)) return;
            deleteProject(current.id);
            setView({ mode: 'list' });
            flash('Đã xoá dự án');
          }}
        />
      )}

      {view.mode === 'form' && (
        <ProjectForm
          initial={current}
          projects={projects}
          onCancel={() => setView(current ? { mode: 'detail', id: current.id } : { mode: 'list' })}
          onSubmit={(data) => {
            if (current) {
              updateProject(current.id, data, CURRENT_USER);
              setView({ mode: 'detail', id: current.id });
              flash(`Đã cập nhật dự án — Version ${current.version + 1}`);
            } else {
              const p = createProject(data, CURRENT_USER);
              setView({ mode: 'detail', id: p.id });
              flash('Đã tạo dự án. Bước tiếp theo: import kế hoạch theo tháng.');
            }
          }}
        />
      )}
    </ErpPage>
  );
};

// ==========================================================================
// Quy trình PAKD — hiển thị Hạn lập / Phiên bản / nút thao tác
// ==========================================================================
const todayIso = () => new Date().toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

/** Cột "Hạn lập PAKD": còn bao nhiêu ngày / ngày nộp / ngày duyệt. */
const pakdDeadlineCell = (p: BizProject): { text: string; sub?: string; cls?: string } => {
  const last = latestPakd(p);
  if (p.status === 'Chờ duyệt mã') return { text: '—', cls: 'text-slate-400' };
  if (p.status === 'Chưa có PAKD') {
    const sub = last?.state === 'Từ chối' ? `V${last.version} bị từ chối ${dmy(last.decidedAt || '')}` : undefined;
    if (!p.pakdDeadline) return { text: 'Chưa đặt hạn', sub, cls: 'text-slate-400' };
    const d = daysBetween(todayIso(), p.pakdDeadline);
    if (d > 0) return { text: `Còn ${d} ngày`, sub, cls: d <= 3 ? 'text-amber-700 font-semibold' : '' };
    return { text: d === 0 ? 'Hết hạn hôm nay' : `Quá hạn ${-d} ngày`, sub, cls: 'text-rose-600 font-semibold' };
  }
  if (!last) return { text: '—', cls: 'text-slate-400' };
  if (last.state === 'Chờ GĐK' || last.state === 'Chờ CFO')
    return { text: last.version === 1 ? 'Nộp' : `Nộp v${last.version},`, sub: dmy(last.submittedAt) };
  return { text: 'Duyệt', sub: dmy(last.decidedAt || '') };
};

/** Cột "Phiên bản PAKD": "V1, chờ CFO" / "V2, chờ GĐK" / "V1, đã duyệt". */
const pakdVersionText = (p: BizProject) => {
  const last = latestPakd(p);
  return last ? `V${last.version}, ${last.state.charAt(0).toLowerCase()}${last.state.slice(1)}` : '—';
};

type RowAction = { label: string; kind: 'view' | 'decide' } | null;
/** Nút thao tác theo trạng thái + vai trò đang xem. */
const rowAction = (p: BizProject, role: BizRole): RowAction => {
  switch (p.status) {
    case 'Chờ duyệt mã':
      return { label: role === 'GĐK' ? 'Duyệt mã' : 'Xem', kind: 'view' };
    case 'Chưa có PAKD':
      return { label: 'Lập PAKD', kind: 'view' };
    case 'PAKD chờ duyệt':
      return pendingRole(latestPakd(p)) === role ? { label: 'Duyệt', kind: 'decide' } : { label: 'Xem', kind: 'view' };
    case 'Đang thực hiện':
      return { label: 'Cập nhật', kind: 'view' };
    default:
      return null;
  }
};

const RoleSelect: React.FC<{ role: BizRole; onChange: (r: BizRole) => void }> = ({ role, onChange }) => (
  <label className="flex items-center gap-1.5 text-[12px] text-slate-600 border border-slate-300 rounded-[3px] bg-slate-50 pl-2">
    <UserCog size={13} className="text-slate-500" /> Vai trò
    <select value={role} onChange={(e) => onChange(e.target.value as BizRole)} className="h-8 px-1.5 bg-white border-l border-slate-300 text-[12px] font-semibold text-[#1e3a5f] outline-none cursor-pointer">
      {BIZ_ROLES.map((r) => (
        <option key={r.key} value={r.key}>
          {r.label}
        </option>
      ))}
    </select>
  </label>
);

/** Hộp thoại GĐK / CFO duyệt hoặc từ chối PAKD. */
const PakdDecisionModal: React.FC<{ project: BizProject; role: BizRole; onClose: () => void; onDecide: (approve: boolean, note: string) => void }> = ({
  project: p,
  role,
  onClose,
  onDecide,
}) => {
  const [note, setNote] = useState('');
  const [needNote, setNeedNote] = useState(false);
  const last = latestPakd(p)!;
  const gp = grossProfit(p);
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40" />
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 12 }}
        className="relative bg-white w-full max-w-xl rounded-[4px] border border-slate-400 shadow-2xl z-10"
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e3a5f] text-white rounded-t-[3px]">
          <h3 className="text-[14px] font-bold flex items-center gap-2">
            <ClipboardCheck size={16} /> {role} duyệt PAKD — V{last.version}
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="p-3 space-y-3">
          <FieldTable
            labelWidth="45%"
            rows={[
              { label: 'Dự án', value: `${p.masterCode} — ${p.name}` },
              { label: 'Người nộp / ngày nộp', value: `${last.submittedBy} · ${dmy(last.submittedAt)}` },
              { label: 'Doanh thu PAKD (VNĐ)', value: money(p.expectedRevenue), num: true, strong: true },
              { label: 'Chi phí kế hoạch (VNĐ)', value: money(plannedCost(p)), num: true },
              { label: 'LN gộp kế hoạch (VNĐ)', value: `${money(gp)} (${grossMargin(p).toFixed(1)}%)`, num: true },
              { label: 'Kế hoạch theo tháng', value: p.plan.length ? `${p.plan.length} tháng` : <span className="text-rose-600">Chưa import</span> },
            ]}
          />
          <FormRow label="Ý kiến" required={needNote} error={needNote && !note.trim() ? 'Nhập lý do từ chối' : undefined}>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Ý kiến phê duyệt / lý do từ chối" className={`${erp.inputFull} h-auto py-1.5`} />
          </FormRow>
          <p className="text-[11px] text-slate-500">
            {role === 'GĐK' ? 'GĐK duyệt → chuyển CFO duyệt.' : 'CFO duyệt → PAKD được duyệt, dự án chuyển "Đang thực hiện".'} Từ chối → trả về PM lập phiên bản mới.
          </p>
        </div>
        <div className="flex justify-end gap-1.5 px-3 py-2 border-t border-slate-300 bg-slate-50 rounded-b-[3px]">
          <Btn onClick={onClose}>Huỷ</Btn>
          <Btn
            variant="danger"
            icon={XCircle}
            onClick={() => {
              if (!note.trim()) return setNeedNote(true);
              onDecide(false, note.trim());
            }}
          >
            Từ chối
          </Btn>
          <Btn variant="success" icon={CheckCircle2} onClick={() => onDecide(true, note.trim())}>
            Duyệt
          </Btn>
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================================================
// Danh sách
// ==========================================================================
const LIST_HEAD = ['TT', 'Mã dự án', 'Tên dự án', 'Tên khách hàng', 'Khối', 'Loại dự án', 'Thời điểm dự kiến ký HĐ', 'PM Kinh doanh', 'PM sản xuất', 'Trạng thái', 'Hạn lập PAKD', 'Phiên bản PAKD', 'Doanh thu PAKD', 'Thao tác'];

const ProjectList: React.FC<{
  projects: BizProject[];
  role: BizRole;
  onRoleChange: (r: BizRole) => void;
  onView: (p: BizProject) => void;
  onCreate: () => void;
  onDecide: (p: BizProject, approve: boolean, note: string) => void;
  onSaveContract: (p: BizProject, c: Omit<BizContract, 'updatedAt' | 'updatedBy'>) => void;
}> = ({ projects, role, onRoleChange, onView, onCreate, onDecide, onSaveContract }) => {
  const [q, setQ] = useState('');
  const [division, setDivision] = useState('');
  const [status, setStatus] = useState('');
  const [contractFilter, setContractFilter] = useState<'all' | 'signed' | 'unsigned'>('all');
  const years = useMemo(() => {
    const ys = new Set([String(new Date().getFullYear())]);
    projects.forEach((p) => [p.expectedSignDate, p.contract?.signDate, p.startDate].forEach((d) => d && ys.add(d.slice(0, 4))));
    return [...ys].sort();
  }, [projects]);
  const [year, setYear] = useState(() => String(new Date().getFullYear()));
  const [deciding, setDeciding] = useState<BizProject | null>(null);
  const [contractOf, setContractOf] = useState<BizProject | null>(null);

  const rows = useMemo(() => {
    const n = q.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (!division || p.division === division) &&
        (!status || p.status === status) &&
        (contractFilter === 'all' || (contractFilter === 'signed' ? p.contractSigned : !p.contractSigned)) &&
        (!n || [p.masterCode, p.name, p.customerCode, p.customerName, p.businessPm, p.productionPm].some((v) => (v || '').toLowerCase().includes(n))),
    );
  }, [projects, q, division, status, contractFilter]);

  const rev = rows.reduce((s, p) => s + p.expectedRevenue, 0);
  const contractRev = rows.reduce((s, p) => s + (p.contract?.value ?? (p.contractSigned ? p.expectedRevenue : 0)), 0);
  const count = (st: BizStatus) => projects.filter((p) => p.status === st).length;
  const signedProjects = useMemo(() => projects.filter((p) => p.contractSigned), [projects]);
  const unsignedProjects = useMemo(() => projects.filter((p) => !p.contractSigned), [projects]);
  const signedCount = signedProjects.length;
  const unsignedCount = unsignedProjects.length;

  const exportXlsx = () => {
    const data = [
      [...LIST_HEAD.slice(0, -1), 'Giá trị hợp đồng ký', 'Số hợp đồng', 'Ngày ký', 'Ngày hết hạn', 'Tệp', 'Trạng thái'],
      ...rows.map((p, i) => {
        const dl = pakdDeadlineCell(p);
        return [
          i + 1,
          p.masterCode,
          p.name,
          p.customerName,
          p.division,
          p.projectType,
          dmy(p.expectedSignDate || ''),
          p.businessPm,
          p.productionPm,
          p.status,
          [dl.text, dl.sub].filter(Boolean).join(' '),
          pakdVersionText(p),
          p.expectedRevenue,
          p.contractSigned ? (p.contract?.value ?? p.expectedRevenue) : '',
          p.contract?.number || '',
          p.contract?.signDate ? dmy(p.contract.signDate) : p.contractSigned && p.expectedSignDate ? dmy(p.expectedSignDate) : '',
          p.contract?.to ? dmy(p.contract.to) : p.contractSigned && p.endDate ? dmy(p.endDate) : '',
          p.contract?.files?.length ? `${p.contract.files.length} tệp` : '',
          p.contractSigned ? 'Đã ký' : 'Chưa ký',
        ];
      }),
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data), 'DuAn');
    XLSX.writeFile(wb, 'du-an-kinh-doanh.xlsx');
  };

  const th = `${erp.th} text-center whitespace-normal leading-tight align-middle`;

  return (
    <>
      <ErpTitleBar
        crumbs={CRUMBS}
        title="Sổ theo dõi dự án"
        actions={
          <>
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Năm
              <select value={year} onChange={(e) => setYear(e.target.value)} className={`${erp.input} w-28`}>
                <option value="">Tất cả</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Khối
              <select value={division} onChange={(e) => setDivision(e.target.value)} className={`${erp.input} w-32`}>
                <option value="">Tất cả</option>
                {DIVISIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <RoleSelect role={role} onChange={onRoleChange} />
            <Btn variant="primary" icon={Plus} onClick={onCreate}>
              Cấp mã dự án
            </Btn>
          </>
        }
      />

      <ProjectTracker projects={projects} year={year} division={division} />

      <Panel
        title="Danh sách dự án"
        icon={Table2}
        noPad
        actions={
          <>
            <div className="relative w-60">
              <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã, tên dự án, khách hàng, PM..." className={`${erp.inputFull} h-7 pl-7`} />
            </div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${erp.input} h-7 w-40`}>
              <option value="">Tất cả trạng thái</option>
              {BIZ_STATUSES.map((s) => (
                <option key={s}>
                  {s} ({count(s)})
                </option>
              ))}
            </select>
            <select value={contractFilter} onChange={(e) => setContractFilter(e.target.value as 'all' | 'signed' | 'unsigned')} className={`${erp.input} h-7 w-36`}>
              <option value="all">Tất cả hợp đồng</option>
              <option value="signed">Đã ký ({signedCount})</option>
              <option value="unsigned">Chưa ký ({unsignedCount})</option>
            </select>
            <Btn icon={FileSpreadsheet} onClick={exportXlsx} className="h-7">
              Xuất Excel
            </Btn>
          </>
        }
        footer={`${rows.length} / ${projects.length} dự án · Đang xem với vai trò ${role} · Bấm vào dòng để xem chi tiết, bấm "Đã ký / Chưa ký" để cập nhật hợp đồng`}
      >
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1920px]`}>
            <thead>
              <tr>
                {LIST_HEAD.map((h) => (
                  <th key={h} rowSpan={2} className={`${th} border-t-0 first:border-l-0 ${h === 'Tên dự án' ? 'min-w-[200px]' : h === 'Tên khách hàng' ? 'min-w-[170px]' : ''}`}>
                    {h}
                  </th>
                ))}
                <th colSpan={6} className={`${th} border-t-0 border-r-0 bg-[#f4f7fb]`}>
                  Thông tin hợp đồng đã ký
                </th>
              </tr>
              <tr>
                {['Giá trị hợp đồng ký', 'Số hợp đồng', 'Ngày ký', 'Ngày hết hạn', 'Tệp', 'Trạng thái'].map((h) => (
                  <th key={h} className={`${th} last:border-r-0 whitespace-nowrap px-3 bg-[#f8fafc]`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => {
                const dl = pakdDeadlineCell(p);
                const act = rowAction(p, role);
                return (
                  <tr key={p.id} onClick={() => onView(p)} className={`${erp.tr} cursor-pointer`}>
                    <td className={`${erp.td} text-center text-slate-500 border-l-0`}>{i + 1}</td>
                    <td className={`${erp.td} ${erp.code} font-semibold whitespace-nowrap`}>{p.masterCode}</td>
                    <td className={erp.td}>
                      <span className="font-semibold text-slate-800">{p.name}</span> {p.isKey && <KeyBadge />}
                    </td>
                    <td className={erp.td}>{p.customerName}</td>
                    <td className={`${erp.td} text-center`}>{p.division}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{p.projectType}</td>
                    <td className={`${erp.td} text-center whitespace-nowrap`}>{dmy(p.expectedSignDate || '')}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{p.businessPm || '—'}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{p.productionPm || '—'}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      <StatusBadge status={p.status} />
                    </td>
                    <td className={`${erp.td} whitespace-nowrap leading-tight ${dl.cls || ''}`}>
                      {dl.text}
                      {dl.sub && <span className="block text-[11px] text-slate-500 font-normal">{dl.sub}</span>}
                    </td>
                    <td className={`${erp.td} whitespace-nowrap ${latestPakd(p)?.state === 'Từ chối' ? 'text-rose-600' : ''}`}>{pakdVersionText(p)}</td>
                    <td className={`${erp.td} ${erp.num}`}>{money(p.expectedRevenue)}</td>
                    <td className={`${erp.td} text-center whitespace-nowrap`}>
                      {act && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            act.kind === 'decide' ? setDeciding(p) : onView(p);
                          }}
                          className={`text-[12px] underline underline-offset-2 cursor-pointer ${act.kind === 'decide' ? 'text-rose-600 font-bold' : 'text-[#1f5fa8] hover:text-[#184c88]'}`}
                        >
                          {act.label}
                        </button>
                      )}
                    </td>
                    <td className={`${erp.td} ${erp.num} whitespace-nowrap font-medium ${p.contractSigned ? 'text-slate-800' : 'text-slate-400'}`}>
                      {p.contractSigned ? money(p.contract?.value ?? p.expectedRevenue) : '—'}
                    </td>
                    <td className={`${erp.td} whitespace-nowrap font-mono text-[12px] text-slate-700`}>
                      {p.contract?.number || (p.contractSigned ? '—' : '')}
                    </td>
                    <td className={`${erp.td} text-center whitespace-nowrap text-slate-600`}>
                      {p.contract?.signDate ? dmy(p.contract.signDate) : p.contractSigned && p.expectedSignDate ? dmy(p.expectedSignDate) : (p.contractSigned ? '—' : '')}
                    </td>
                    <td className={`${erp.td} text-center whitespace-nowrap text-slate-600`}>
                      {p.contract?.to ? dmy(p.contract.to) : p.contractSigned && p.endDate ? dmy(p.endDate) : (p.contractSigned ? '—' : '')}
                    </td>
                    <td className={`${erp.td} text-center whitespace-nowrap`}>
                      {p.contract?.files && p.contract.files.length > 0 ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setContractOf(p);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-[#1f5fa8] hover:text-[#184c88] hover:underline"
                          title={p.contract.files.map((f) => f.name).join(', ')}
                        >
                          <Paperclip size={12} className="shrink-0 text-slate-500" />
                          <span>{p.contract.files.length} tệp</span>
                        </button>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className={`${erp.td} text-center whitespace-nowrap border-r-0`}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setContractOf(p);
                        }}
                        className={`text-[12px] underline underline-offset-2 cursor-pointer font-medium ${
                          p.contractSigned ? 'text-emerald-700 hover:text-emerald-800' : 'text-[#1f5fa8] hover:text-[#184c88]'
                        }`}
                      >
                        {p.contractSigned ? 'Đã ký' : 'Chưa ký'}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={20} className={`${erp.td} text-center text-slate-400 py-6`}>
                    Không có dự án phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className={erp.totalRow}>
                  <td className={`${erp.td} border-l-0`} colSpan={12}>
                    Tổng cộng ({rows.length} dự án)
                  </td>
                  <td className={`${erp.td} ${erp.num}`}>{money(rev)}</td>
                  <td className={`${erp.td}`} />
                  <td className={`${erp.td} ${erp.num}`}>{money(contractRev)}</td>
                  <td className={`${erp.td} border-r-0`} colSpan={5} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Panel>

      <AnimatePresence>
        {deciding && (
          <PakdDecisionModal
            key="decide"
            project={deciding}
            role={role}
            onClose={() => setDeciding(null)}
            onDecide={(approve, note) => {
              onDecide(deciding, approve, note);
              setDeciding(null);
            }}
          />
        )}
        {contractOf && (
          <ContractModal
            key="contract"
            project={contractOf}
            onClose={() => setContractOf(null)}
            onSave={(c) => {
              onSaveContract(contractOf, c);
              setContractOf(null);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ==========================================================================
// Quy trình & phê duyệt PAKD (màn chi tiết)
// ==========================================================================
const WORKFLOW: BizStatus[] = ['Chờ duyệt mã', 'Chưa có PAKD', 'PAKD chờ duyệt', 'Đang thực hiện', 'Kết thúc'];

const WorkflowPanel: React.FC<{
  project: BizProject;
  role: BizRole;
  onApproveCode: () => void;
  onSubmit: () => void;
  onDecide: () => void;
  onFinish: () => void;
}> = ({ project: p, role, onApproveCode, onSubmit, onDecide, onFinish }) => {
  const idx = WORKFLOW.indexOf(p.status);
  const last = latestPakd(p);
  const dl = pakdDeadlineCell(p);
  const actions: React.ReactNode[] = [];
  if (p.status === 'Chờ duyệt mã')
    actions.push(
      role === 'GĐK' ? (
        <Btn key="code" variant="primary" icon={CheckCircle2} className="h-7" onClick={onApproveCode}>
          Duyệt mã
        </Btn>
      ) : (
        <span key="code" className="text-[12px] text-slate-500">Chờ GĐK duyệt mã</span>
      ),
    );
  if (p.status === 'Chưa có PAKD')
    actions.push(
      role === 'PM' ? (
        <Btn key="sub" variant="success" icon={Send} className="h-7" disabled={!p.plan.length} title={p.plan.length ? undefined : 'Import kế hoạch theo tháng trước khi nộp'} onClick={onSubmit}>
          Nộp PAKD {p.pakd.length ? `V${p.pakd.length + 1}` : ''}
        </Btn>
      ) : (
        <span key="sub" className="text-[12px] text-slate-500">Chờ PM lập & nộp PAKD</span>
      ),
    );
  if (p.status === 'PAKD chờ duyệt')
    actions.push(
      pendingRole(last) === role ? (
        <Btn key="dec" variant="primary" icon={ClipboardCheck} className="h-7" onClick={onDecide}>
          Duyệt / Từ chối
        </Btn>
      ) : (
        <span key="dec" className="text-[12px] text-slate-500">Chờ {pendingRole(last)} duyệt</span>
      ),
    );
  if (p.status === 'Đang thực hiện')
    actions.push(
      <Btn key="fin" icon={Flag} className="h-7" onClick={onFinish}>
        Kết thúc dự án
      </Btn>,
    );

  return (
    <Panel title="Quy trình & phê duyệt PAKD" icon={ClipboardCheck} noPad actions={actions}>
      <div className="flex border-b border-slate-300 overflow-x-auto">
        {WORKFLOW.map((st, i) => (
          <div
            key={st}
            className={`flex-1 min-w-[150px] px-3 py-2 text-[12px] border-r border-slate-200 last:border-r-0 flex items-center gap-2 ${
              i < idx ? 'bg-emerald-50 text-emerald-800' : i === idx ? 'bg-[#eaf2fc] text-[#1f5fa8] font-bold' : 'bg-white text-slate-400'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                i < idx ? 'bg-emerald-600 text-white' : i === idx ? 'bg-[#1f5fa8] text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {i < idx ? <Check size={11} strokeWidth={3} /> : i + 1}
            </span>
            {st}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <FieldTable
          rows={[
            { label: 'Trạng thái', value: <StatusBadge status={p.status} /> },
            { label: 'Hạn lập PAKD', value: <span className={dl.cls}>{[dl.text, dl.sub].filter(Boolean).join(' ')}</span> },
            { label: 'Phiên bản PAKD', value: pakdVersionText(p) },
            { label: 'Dự kiến ký HĐ', value: dmy(p.expectedSignDate || '') },
          ]}
        />
        <div className="lg:col-span-2 border-l border-slate-200">
          <table className={erp.table}>
            <thead>
              <tr>
                {['Phiên bản', 'Ngày nộp', 'Người nộp', 'Kết quả', 'Ngày duyệt', 'Ý kiến'].map((h) => (
                  <th key={h} className={`${erp.th} text-left border-t-0 last:border-r-0`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...p.pakd].reverse().map((v) => (
                <tr key={v.version} className={erp.tr}>
                  <td className={`${erp.td} font-semibold`}>V{v.version}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{dmy(v.submittedAt)}</td>
                  <td className={erp.td}>{v.submittedBy}</td>
                  <td className={erp.td}>
                    <Tag cls={PAKD_CLS[v.state]}>{v.state}</Tag>
                  </td>
                  <td className={`${erp.td} whitespace-nowrap`}>{v.decidedAt ? `${dmy(v.decidedAt)} · ${v.decidedBy}` : '—'}</td>
                  <td className={`${erp.td} text-slate-600 border-r-0`}>{v.note || '—'}</td>
                </tr>
              ))}
              {!p.pakd.length && (
                <tr>
                  <td colSpan={6} className={`${erp.td} text-center text-slate-400 border-r-0`}>
                    Chưa nộp PAKD. {p.status === 'Chưa có PAKD' && 'PM import kế hoạch theo tháng (khung bên dưới) rồi bấm "Nộp PAKD".'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>
  );
};

const PAKD_CLS: Record<PakdState, string> = {
  'Chờ GĐK': 'bg-amber-50 text-amber-700 border-amber-300',
  'Chờ CFO': 'bg-amber-50 text-amber-700 border-amber-300',
  'Đã duyệt': 'bg-emerald-50 text-emerald-700 border-emerald-300',
  'Từ chối': 'bg-rose-50 text-rose-700 border-rose-300',
};

// ==========================================================================
// Giai đoạn KH01 → KH05 — stepper ngang
// ==========================================================================
const PhaseStepper: React.FC<{ phases: BizPhase[]; current: string }> = ({ phases, current }) => {
  const curIdx = Math.max(0, phases.findIndex((p) => p.code === current));
  const [sel, setSel] = useState(curIdx);
  const ph = phases[sel] || phases[curIdx];

  return (
    <Panel
      title="Thông tin các giai đoạn (KH01 → KH05)"
      icon={Flag}
      actions={
        <span className="text-[12px] text-slate-600">
          Giai đoạn hiện tại:{' '}
          <strong className="text-[#1f5fa8]">
            {phases[curIdx]?.code} — {phases[curIdx]?.name}
          </strong>
        </span>
      }
    >
      <div className="overflow-x-auto pb-1">
        <ol className="grid min-w-[760px]" style={{ gridTemplateColumns: `repeat(${phases.length}, minmax(0, 1fr))` }}>
          {phases.map((p, i) => {
            const state = i < curIdx ? 'done' : i === curIdx ? 'current' : 'todo';
            return (
              <li key={p.code} className="flex flex-col items-center">
                <div className="relative w-full h-7 flex items-center justify-center">
                  {i > 0 && <span className={`absolute left-0 right-1/2 top-1/2 -translate-y-1/2 h-[2px] ${i <= curIdx ? 'bg-emerald-600' : 'bg-slate-300'}`} />}
                  {i < phases.length - 1 && <span className={`absolute left-1/2 right-0 top-1/2 -translate-y-1/2 h-[2px] ${i < curIdx ? 'bg-emerald-600' : 'bg-slate-300'}`} />}
                  <span
                    className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                      state === 'done' ? 'bg-emerald-600 text-white' : state === 'current' ? 'bg-white border-[3px] border-[#1f5fa8] ring-4 ring-[#1f5fa8]/15' : 'bg-white border-2 border-slate-300'
                    }`}
                  >
                    {state === 'done' && <Check size={13} strokeWidth={3} />}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSel(i)}
                  className={`mt-2 mx-1 w-[calc(100%-8px)] text-left rounded-[3px] border px-3 py-2 cursor-pointer ${
                    state === 'current' ? 'border-[#1f5fa8] bg-[#eaf2fc]' : 'border-slate-300 bg-white hover:bg-slate-50'
                  } ${sel === i ? 'outline outline-2 outline-offset-1 outline-[#1f5fa8]/40' : ''}`}
                >
                  <p className={`text-[11px] font-bold ${state === 'todo' ? 'text-slate-400' : state === 'current' ? 'text-[#1f5fa8]' : 'text-emerald-700'}`}>{p.code}</p>
                  <p className="text-[13px] font-semibold text-slate-800 truncate" title={p.name}>
                    {p.name}
                  </p>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {ph && (
        <table className={`${erp.table} mt-3`}>
          <thead>
            <tr>
              {['Giai đoạn', 'Bắt đầu', 'Kết thúc', 'Mục tiêu', 'Đầu ra'].map((h) => (
                <th key={h} className={`${erp.th} text-left`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`${erp.td} font-semibold whitespace-nowrap`}>
                {ph.code} — {ph.name}
              </td>
              <td className={`${erp.td} whitespace-nowrap`}>{dmy(ph.start)}</td>
              <td className={`${erp.td} whitespace-nowrap`}>{dmy(ph.end)}</td>
              <td className={erp.td}>{ph.objective || '—'}</td>
              <td className={erp.td}>{ph.output || '—'}</td>
            </tr>
          </tbody>
        </table>
      )}
    </Panel>
  );
};

// ==========================================================================
// Số liệu dự án theo tháng — Kế hoạch / Thực tế (import Excel) — ĐVT VNĐ
// ==========================================================================
// Dòng hiển thị: "Chi" = SX + KD, kèm 2 dòng con. `drill`: ở tab Thực tế, bấm con số → xem dòng sổ kế toán.
type FinRow = {
  label: Record<FinKind, string>;
  get: (r: BizMonthRow) => number;
  labelCls: string;
  sub?: boolean;
  drill?: Pick<LedgerDrill, 'kind' | 'part'>;
};
const FIN_ROWS: FinRow[] = [
  { label: { plan: 'Doanh thu dự kiến', actual: 'Doanh thu thực tế' }, get: (r) => r.revenue, labelCls: 'text-emerald-800' },
  { label: { plan: 'Thu dự kiến', actual: 'Thu thực tế' }, get: (r) => r.cashIn, labelCls: 'text-emerald-800', drill: { kind: 'cashIn' } },
  { label: { plan: 'Chi dự kiến', actual: 'Chi thực tế' }, get: (r) => r.costSx + r.costKd, labelCls: 'text-rose-800', drill: { kind: 'cost' } },
  { label: { plan: 'Chi cho dự án sản xuất (SX)', actual: 'Chi cho dự án sản xuất (SX)' }, get: (r) => r.costSx, labelCls: 'text-rose-700', sub: true, drill: { kind: 'cost', part: 'sx' } },
  { label: { plan: 'Chi cho dự án kinh doanh (KD)', actual: 'Chi cho dự án kinh doanh (KD)' }, get: (r) => r.costKd, labelCls: 'text-rose-700', sub: true, drill: { kind: 'cost', part: 'kd' } },
  { label: { plan: 'Khối lượng công việc (SP)', actual: 'Khối lượng công việc (SP)' }, get: (r) => r.workload, labelCls: 'text-indigo-800' },
];

/** Con số trong bảng; có onClick thì bấm được để xem chi tiết sổ kế toán. */
const DrillNum: React.FC<{ value: number; onClick?: (v: number) => void }> = ({ value, onClick }) =>
  onClick && value ? (
    <button type="button" onClick={() => onClick(value)} className={`font-[inherit] ${drillCls}`} title="Xem chi tiết sổ kế toán">
      {num(value)}
    </button>
  ) : (
    <>{num(value)}</>
  );

const KIND_TEXT: Record<FinKind, { tab: string; importBtn: string; empty: string }> = {
  plan: { tab: 'Kế hoạch', importBtn: 'Import kế hoạch', empty: 'Dự án chưa có kế hoạch theo tháng' },
  actual: { tab: 'Thực tế (kế toán)', importBtn: 'Import thực tế', empty: 'Kế toán chưa import số thực tế' },
};

const FinanceSection: React.FC<{
  project: BizProject;
  onImport: (kind: FinKind, rows: BizMonthRow[], fileName: string, summary: string) => void;
}> = ({ project: p, onImport }) => {
  const [kind, setKind] = useState<FinKind>('plan');
  const [showImport, setShowImport] = useState(false);
  const [drill, setDrill] = useState<LedgerDrill | null>(null);
  const data = p[kind];
  const info = kind === 'plan' ? p.planImport : p.actualImport;
  const text = KIND_TEXT[kind];
  const years = useMemo(() => Array.from(new Set(data.map((r) => r.month.slice(0, 4)))).sort(), [data]);
  const [year, setYear] = useState<string>('all');
  const allYears = year === 'all' || !years.includes(year);
  const rows = allYears ? data : data.filter((r) => r.month.startsWith(year));
  const totalLabel = allYears ? (kind === 'plan' ? 'Cả dự án' : 'Luỹ kế') : `Năm ${year}`;
  const cutoff = latestActualMonth([p]);

  const canDrill = (fr: FinRow) => kind === 'actual' && !!fr.drill;
  const openDrill = (fr: FinRow, from: string, to: string, expected: number) =>
    setDrill({ ...fr.drill!, projects: [p], from, to, title: `${p.masterCode} — ${p.name}`, expected });

  const reconcile = [
    { label: 'Doanh thu dự kiến', plan: sumRows(p.plan, 'revenue'), info: p.expectedRevenue, infoLabel: 'Doanh thu dự kiến' },
    { label: 'Chi dự kiến - SX', plan: sumRows(p.plan, 'costSx'), info: p.plannedProductionCost, infoLabel: 'Chi phí sản xuất KH' },
    { label: 'Chi dự kiến - KD', plan: sumRows(p.plan, 'costKd'), info: p.plannedBusinessCost, infoLabel: 'Chi phí kinh doanh KH' },
  ];

  return (
    <Panel
      title="Số liệu dự án theo tháng"
      icon={Table2}
      noPad
      actions={
        data.length > 0 && (
          <Btn variant="success" icon={FileUp} onClick={() => setShowImport(true)} className="h-7">
            {text.importBtn}
          </Btn>
        )
      }
      footer={
        <>
          ĐVT: VNĐ · KLCV: SP
          {kind === 'actual' && cutoff && <> · Chốt số đến {fmtMonth(cutoff)}</>}
          {info && (
            <>
              {' '}
              · Import từ <strong className="text-slate-600">{info.fileName}</strong> bởi {info.by} lúc {dt(info.at)}
            </>
          )}
          {kind === 'actual' && data.length > 0 && <> · Bấm vào con số Thu / Chi thực tế để xem chi tiết sổ kế toán</>}
        </>
      }
    >
      <div className="pt-2 bg-[#f3f6fa]">
        <FolderTabs
          tabs={(['plan', 'actual'] as const).map((k) => ({ key: k, label: `${KIND_TEXT[k].tab} (${p[k].length} tháng)` }))}
          value={kind}
          onChange={setKind}
        />
      </div>

      {data.length === 0 ? (
        <div className="m-3 flex flex-col items-center justify-center text-center py-10 border border-dashed border-slate-300 rounded-[4px] bg-slate-50">
          <FileUp size={26} className="text-slate-400 mb-2" />
          <p className="text-[13px] font-semibold text-slate-700">{text.empty}</p>
          <p className="text-[12px] text-slate-500 mt-1 max-w-md">
            Import file Excel, tháng nằm ngang từ {fmtMonth(p.startDate.slice(0, 7))} → {fmtMonth(p.endDate.slice(0, 7))}; chỉ tiêu nằm dọc:{' '}
            {FIN_METRICS[kind].map((m) => m.label).join(', ')}.
          </p>
          <Btn variant="success" icon={FileUp} onClick={() => setShowImport(true)} className="mt-3">
            {text.importBtn}
          </Btn>
        </div>
      ) : (
        <div className="p-3 space-y-3">
          {kind === 'plan' && (
            <table className={erp.table}>
              <thead>
                <tr>
                  <th className={`${erp.th} text-left`}>Đối chiếu với thông tin dự án</th>
                  <th className={`${erp.th} text-right`}>Tổng kế hoạch tháng</th>
                  <th className={`${erp.th} text-right`}>Thông tin dự án</th>
                  <th className={`${erp.th} text-right`}>Chênh lệch</th>
                  <th className={`${erp.th} text-center`}>Kết quả</th>
                </tr>
              </thead>
              <tbody>
                {reconcile.map((r) => {
                  const diff = Math.round(r.plan - r.info);
                  return (
                    <tr key={r.label} className={erp.tr}>
                      <td className={erp.td}>
                        {r.label} <span className="text-slate-400">↔ {r.infoLabel}</span>
                      </td>
                      <td className={`${erp.td} ${erp.num}`}>{money(r.plan)}</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(r.info)}</td>
                      <td className={`${erp.td} ${erp.num} ${diff ? 'text-amber-700 font-semibold' : 'text-slate-400'}`}>
                        {diff ? `${diff > 0 ? '+' : ''}${money(diff)}` : '0'}
                      </td>
                      <td className={`${erp.td} text-center`}>
                        {diff ? <Tag cls="bg-amber-50 text-amber-700 border-amber-300">Lệch</Tag> : <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-300">Khớp</Tag>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {years.length > 1 && (
            <div className="flex items-center gap-2 text-[12px] text-slate-600">
              <span>Năm:</span>
              <Segmented
                options={[{ key: 'all', label: `Tất cả (${data.length} tháng)` }, ...years.map((y) => ({ key: y, label: y }))]}
                value={allYears ? 'all' : year}
                onChange={setYear}
              />
            </div>
          )}

          <div className="overflow-x-auto border border-slate-300">
            <table className={`${erp.table} [&_td]:border-slate-200`}>
              <thead>
                <tr>
                  <th className={`${erp.th} sticky left-0 z-20 text-left min-w-[240px] border-t-0 border-l-0`}>Chỉ tiêu</th>
                  <th className={`${erp.th} sticky left-[240px] z-20 text-right min-w-[160px] bg-[#dfe6f0] border-t-0`}>{totalLabel}</th>
                  {rows.map((r) => (
                    <th key={r.month} className={`${erp.th} text-right min-w-[130px] border-t-0 last:border-r-0`}>
                      T{+r.month.slice(5, 7)}/{r.month.slice(0, 4)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FIN_ROWS.map((fr) => (
                  <tr key={fr.label.plan} className={erp.tr}>
                    <td className={`${erp.td} sticky left-0 z-10 bg-white border-l-0 ${fr.sub ? 'pl-7 text-[12px]' : 'font-semibold'} ${fr.labelCls}`}>
                      {fr.sub && <span className="text-slate-300 mr-1.5">└</span>}
                      {fr.label[kind]}
                    </td>
                    <td className={`${erp.td} ${erp.num} sticky left-[240px] z-10 bg-[#f6f8fb] ${fr.sub ? 'text-[12px]' : 'font-bold'}`}>
                      <DrillNum
                        value={rows.reduce((s, r) => s + fr.get(r), 0)}
                        onClick={canDrill(fr) ? (v) => openDrill(fr, rows[0].month, rows[rows.length - 1].month, v) : undefined}
                      />
                    </td>
                    {rows.map((r) => (
                      <td key={r.month} className={`${erp.td} ${erp.num} last:border-r-0 ${fr.sub ? 'text-[12px] text-slate-500' : ''}`}>
                        <DrillNum value={fr.get(r)} onClick={canDrill(fr) ? (v) => openDrill(fr, r.month, r.month, v) : undefined} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showImport && (
          <BizMonthlyImportModal
            key="monthly-import"
            kind={kind}
            project={p}
            onClose={() => setShowImport(false)}
            onApply={(rows, fileName, summary) => {
              onImport(kind, rows, fileName, summary);
              setShowImport(false);
              setYear('all');
            }}
          />
        )}
        {drill && <LedgerDetailModal key="ledger-detail" {...drill} onClose={() => setDrill(null)} />}
      </AnimatePresence>
    </Panel>
  );
};

// ==========================================================================
// Thông tin hợp đồng (sau khi ký)
// ==========================================================================
const Files: React.FC<{ files: BizAttachment[] }> = ({ files }) =>
  files.length ? (
    <span className="flex flex-wrap gap-x-3 gap-y-0.5">
      {files.map((f) =>
        f.url ? (
          <a key={f.id} href={f.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#1f5fa8] hover:underline">
            <FileText size={12} /> {f.name}
          </a>
        ) : (
          <span key={f.id} className="inline-flex items-center gap-1">
            <FileText size={12} /> {f.name}
          </span>
        ),
      )}
    </span>
  ) : (
    <span className="text-slate-400">Chưa có tệp</span>
  );

const ContractPanel: React.FC<{ project: BizProject; onEdit: () => void }> = ({ project: p, onEdit }) => {
  const c = p.contract!;
  const diff = c.value - p.expectedRevenue;
  return (
    <Panel
      title="Thông tin hợp đồng"
      icon={FileSignature}
      noPad
      actions={
        <Btn icon={Pencil} className="h-7" onClick={onEdit}>
          Cập nhật
        </Btn>
      }
      footer={`Cập nhật bởi ${c.updatedBy} lúc ${dt(c.updatedAt)}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <FieldTable
          rows={[
            { label: 'Số hợp đồng', value: <span className="font-semibold">{c.number}</span> },
            { label: 'Ngày ký', value: dmy(c.signDate) },
            { label: 'Thời hạn thực hiện', value: `${dmy(c.from)} → ${dmy(c.to)}` },
            { label: 'Tệp tài liệu', value: <Files files={c.files} /> },
          ]}
        />
        <FieldTable
          labelWidth="50%"
          rows={[
            { label: 'Giá trị hợp đồng (VNĐ)', value: money(c.value), num: true, strong: true },
            { label: 'Giá trị đã khai báo (VNĐ)', value: money(p.expectedRevenue), num: true },
            {
              label: 'Chênh lệch',
              value: <span className={diff ? 'text-amber-700 font-semibold' : 'text-slate-400'}>{diff ? `${diff > 0 ? '+' : ''}${money(diff)}` : '0'}</span>,
              num: true,
            },
            { label: 'Lý do lệch', value: c.deviationReason },
          ]}
        />
      </div>
      <div className="border-t border-slate-300">
        <p className="px-3 py-1.5 text-[12px] font-bold text-[#1e3a5f] bg-[#f3f6fa] border-b border-slate-300">Phụ lục điều chỉnh ({c.addenda.length})</p>
        <table className={erp.table}>
          <thead>
            <tr>
              {['STT', 'Số phụ lục', 'Ngày ký', 'Nội dung điều chỉnh', 'File phụ lục'].map((h) => (
                <th key={h} className={`${erp.th} text-left border-t-0 first:border-l-0 last:border-r-0`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.addenda.map((a, i) => (
              <tr key={a.id} className={erp.tr}>
                <td className={`${erp.td} text-center text-slate-500 w-12 border-l-0`}>{i + 1}</td>
                <td className={`${erp.td} font-semibold whitespace-nowrap`}>{a.number}</td>
                <td className={`${erp.td} whitespace-nowrap`}>{dmy(a.signDate)}</td>
                <td className={erp.td}>{a.content || '—'}</td>
                <td className={`${erp.td} border-r-0`}>
                  <Files files={a.files} />
                </td>
              </tr>
            ))}
            {!c.addenda.length && (
              <tr>
                <td colSpan={5} className={`${erp.td} text-center text-slate-400 border-x-0`}>
                  Chưa có phụ lục điều chỉnh.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
};

// ==========================================================================
// Chi tiết
// ==========================================================================
const ProjectDetail: React.FC<{
  project: BizProject;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onImport: (kind: FinKind, rows: BizMonthRow[], fileName: string, summary: string) => void;
  onSaveContract: (c: Omit<BizContract, 'updatedAt' | 'updatedBy'>) => void;
  onAttachments: (files: BizAttachment[], note: string) => void;
  role: BizRole;
  onRoleChange: (r: BizRole) => void;
  onApproveCode: () => void;
  onSubmitPakd: () => void;
  onDecide: (approve: boolean, note: string) => void;
  onFinish: () => void;
}> = ({ project: p, onBack, onEdit, onDelete, onImport, onSaveContract, onAttachments, role, onRoleChange, onApproveCode, onSubmitPakd, onDecide, onFinish }) => {
  const files = p.attachments || [];
  const [deciding, setDeciding] = useState(false);
  const [tab, setTab] = useState<'overview' | 'history'>('overview');
  const [showContract, setShowContract] = useState(false);
  const gp = grossProfit(p);

  return (
    <>
      <ErpTitleBar
        crumbs={[...CRUMBS, p.masterCode]}
        title={
          <>
            {p.name} {p.isKey && <KeyBadge />}
          </>
        }
        actions={
          <>
            <RoleSelect role={role} onChange={onRoleChange} />
            <Btn icon={ArrowLeft} onClick={onBack}>
              Quay lại
            </Btn>
            <Btn variant="primary" icon={Pencil} onClick={onEdit}>
              Sửa
            </Btn>
            <Btn variant="danger" icon={Trash2} onClick={onDelete}>
              Xoá
            </Btn>
          </>
        }
        meta={[
          { label: 'Mã Master', value: <span className={erp.code}>{p.masterCode}</span> },
          { label: 'Version', value: `v${p.version}` },
          { label: 'Trạng thái', value: <StatusBadge status={p.status} /> },
          { label: 'Khối', value: p.division },
          { label: 'PAKD', value: pakdVersionText(p) },
          { label: 'Cập nhật', value: dt(p.updatedAt) },
        ]}
      />

      <FolderTabs
        tabs={[
          { key: 'overview', label: 'Thông tin dự án', icon: LayoutList },
          { key: 'history', label: `Lịch sử (${p.history.length})`, icon: History },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'overview' && (
        <>
          <WorkflowPanel project={p} role={role} onApproveCode={onApproveCode} onSubmit={onSubmitPakd} onDecide={() => setDeciding(true)} onFinish={onFinish} />
          <Panel title="Mã dự án" icon={Hash} noPad>
            <table className={erp.table}>
              <thead>
                <tr>
                  {['Loại mã', 'Mã', 'PM phụ trách'].map((h) => (
                    <th key={h} className={`${erp.th} text-left border-t-0 first:border-l-0 last:border-r-0`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {[
                  ['Mã Master (mã tổng)', p.masterCode, '—'],
                  ['Mã kinh doanh (PAKD)', p.businessCode, p.businessPm],
                  ['Mã sản xuất', p.productionCode, p.productionPm],
                ].map(([k, c, pm]) => (
                  <tr key={k} className={erp.tr}>
                    <td className={`${erp.td} bg-[#f3f6fa] text-slate-600 w-[30%] border-l-0`}>{k}</td>
                    <td className={`${erp.td} ${erp.code} font-bold`}>{c}</td>
                    <td className={`${erp.td} border-r-0`}>{pm || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Panel title="Thông tin cơ hội kinh doanh" icon={Building2} noPad>
              <FieldTable
                rows={[
                  { label: 'Khối', value: p.division },
                  { label: 'Loại dự án', value: p.projectType },
                  { label: 'Tên khách hàng', value: p.customerName },
                  { label: 'Mã khách hàng', value: <span className="font-mono">{p.customerCode}</span> },
                  { label: 'Giám đốc kinh doanh', value: p.businessDirector },
                  { label: 'Giám đốc khối', value: p.salesDirector },
                  { label: 'Người tạo', value: p.creator },
                  { label: 'AM', value: p.am.join(', ') },
                  { label: 'Thời gian', value: `${dmy(p.startDate)} → ${dmy(p.endDate)}` },
                  ...(p.note ? [{ label: 'Ghi chú', value: p.note }] : []),
                ]}
              />
            </Panel>
            <Panel title="Tài chính (VNĐ)" icon={Wallet} noPad>
              <FieldTable
                labelWidth="50%"
                rows={[
                  { label: 'Doanh thu dự kiến', value: money(p.expectedRevenue), num: true, strong: true },
                  { label: 'Chi phí kế hoạch', value: money(plannedCost(p)), num: true },
                  { label: '   └ Chi phí kinh doanh kế hoạch', value: money(p.plannedBusinessCost), num: true },
                  { label: '   └ Chi phí sản xuất kế hoạch', value: money(p.plannedProductionCost), num: true },
                  {
                    label: 'Lợi nhuận gộp kế hoạch',
                    value: <span className={gp < 0 ? 'text-rose-600' : 'text-emerald-700'}>{money(gp)}</span>,
                    num: true,
                    strong: true,
                  },
                  { label: 'Biên lợi nhuận gộp', value: `${grossMargin(p).toFixed(1)}%`, num: true },
                  {
                    label: 'Hợp đồng',
                    value: (
                      <button
                        type="button"
                        onClick={() => setShowContract(true)}
                        className="inline-flex items-center gap-1.5 cursor-pointer group"
                        title={p.contractSigned ? 'Xem / cập nhật hợp đồng' : 'Cập nhật ký hợp đồng'}
                      >
                        {p.contractSigned ? (
                          <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-300 group-hover:border-emerald-500" icon={FileSignature}>
                            Đã ký
                          </Tag>
                        ) : (
                          <Tag cls="bg-slate-100 text-slate-600 border-slate-300 group-hover:border-[#1f5fa8] group-hover:text-[#1f5fa8]" icon={FileSignature}>
                            Chưa ký
                          </Tag>
                        )}
                        <span className="text-[12px] text-[#1f5fa8] group-hover:underline">
                          {p.contract ? `Số ${p.contract.number}` : p.contractSigned ? 'Bổ sung thông tin HĐ' : 'Cập nhật ký hợp đồng'}
                        </span>
                      </button>
                    ),
                  },
                  {
                    label: `Tài liệu đính kèm (${files.length})`,
                    value: (
                      <AttachmentList
                        compact
                        files={files}
                        label="Đính kèm tài liệu"
                        onAdd={(added) => onAttachments([...files, ...added], `Thêm ${added.map((f) => f.name).join(', ')}`)}
                        onRemove={(id) =>
                          onAttachments(
                            files.filter((f) => f.id !== id),
                            `Xoá ${files.find((f) => f.id === id)?.name}`,
                          )
                        }
                      />
                    ),
                  },
                ]}
              />
            </Panel>
          </div>

          {p.contract && <ContractPanel project={p} onEdit={() => setShowContract(true)} />}
          <PhaseStepper key={p.id + p.version} phases={p.phases} current={p.currentPhase} />
          <FinanceSection project={p} onImport={onImport} />
        </>
      )}

      <AnimatePresence>
        {deciding && (
          <PakdDecisionModal
            key="decide"
            project={p}
            role={role}
            onClose={() => setDeciding(false)}
            onDecide={(approve, note) => {
              onDecide(approve, note);
              setDeciding(false);
            }}
          />
        )}
        {showContract && (
          <ContractModal
            key="contract"
            project={p}
            onClose={() => setShowContract(false)}
            onSave={(c) => {
              onSaveContract(c);
              setShowContract(false);
            }}
          />
        )}
      </AnimatePresence>

      {tab === 'history' && (
        <Panel title="Lịch sử thay đổi" icon={History} noPad>
          <table className={erp.table}>
            <thead>
              <tr>
                {['STT', 'Thời gian', 'Người thực hiện', 'Thao tác', 'Ghi chú'].map((h) => (
                  <th key={h} className={`${erp.th} text-left border-t-0 first:border-l-0 last:border-r-0`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...p.history].reverse().map((h, i) => (
                <tr key={i} className={erp.tr}>
                  <td className={`${erp.td} text-center text-slate-500 border-l-0 w-12`}>{i + 1}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{dt(h.at)}</td>
                  <td className={erp.td}>{h.by}</td>
                  <td className={`${erp.td} font-semibold`}>{h.action}</td>
                  <td className={`${erp.td} text-slate-600 border-r-0`}>{h.note || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </>
  );
};

// ==========================================================================
// Form tạo / sửa
// ==========================================================================
const inputCls = erp.inputFull;
/** Ô nhập trong bảng (kiểu bảng tính): không viền, nền đổi khi focus. */
const cellInput = 'w-full h-8 px-2 bg-transparent text-[13px] outline-none focus:bg-[#eaf2fc] focus:ring-1 focus:ring-inset focus:ring-[#1f5fa8]';

const MoneyInput: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <div className="relative">
    <input
      inputMode="numeric"
      value={value ? value.toLocaleString('en-US') : ''}
      onChange={(e) => onChange(Number(e.target.value.replace(/[^\d]/g, '')) || 0)}
      placeholder="0"
      className={`${inputCls} text-right pr-12 tabular-nums`}
    />
    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400">VNĐ</span>
  </div>
);

const FormGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-2.5">{children}</div>;

const emptyInput = (): BizProjectInput => ({
  name: '',
  isKey: false,
  status: 'Chờ duyệt mã',
  expectedSignDate: '',
  pakdDeadline: '',
  masterCode: '',
  businessCode: '',
  productionCode: '',
  businessPm: '',
  productionPm: '',
  division: '',
  projectType: '',
  customerName: '',
  customerCode: '',
  businessDirector: '',
  salesDirector: '',
  creator: CURRENT_USER,
  am: [],
  startDate: '',
  endDate: '',
  expectedRevenue: 0,
  plannedBusinessCost: 0,
  plannedProductionCost: 0,
  contractSigned: false,
  note: '',
  phases: blankPhases(),
  currentPhase: 'KH01',
});

const toInput = (p: BizProject): BizProjectInput => {
  const { id, version, plan, planImport, actual, actualImport, contract, attachments, createdAt, updatedAt, history, ...rest } = p;
  return rest;
};

const ProjectForm: React.FC<{
  initial?: BizProject;
  projects: BizProject[];
  onCancel: () => void;
  onSubmit: (data: BizProjectInput) => void;
}> = ({ initial, projects, onCancel, onSubmit }) => {
  const [f, setF] = useState<BizProjectInput>(() => (initial ? toInput(initial) : emptyInput()));
  const [amText, setAmText] = useState(() => f.am.join(', '));
  // Khi tạo mới, mã Master tự sinh theo mã KH cho tới khi người dùng tự sửa.
  const [autoCode, setAutoCode] = useState(!initial);
  const [touched, setTouched] = useState(false);

  const set = <K extends keyof BizProjectInput>(k: K, v: BizProjectInput[K]) => setF((prev) => ({ ...prev, [k]: v }));

  const setPhase = (i: number, k: keyof BizPhase, v: string) =>
    setF((prev) => ({ ...prev, phases: prev.phases.map((p, j) => (j === i ? { ...p, [k]: v } : p)) }));

  const setMaster = (master: string) =>
    setF((prev) => ({ ...prev, masterCode: master, businessCode: master ? `${master}.1` : '', productionCode: master ? `${master}.2` : '' }));

  const setCustomerCode = (cc: string) => {
    set('customerCode', cc);
    if (autoCode) setMaster(nextMasterCode(projects.filter((p) => p.id !== initial?.id), cc));
  };

  const errors = useMemo(() => {
    const e: Partial<Record<keyof BizProjectInput, string>> = {};
    if (!f.name.trim()) e.name = 'Nhập tên dự án';
    if (!f.customerCode.trim()) e.customerCode = 'Nhập mã khách hàng';
    if (!f.customerName.trim()) e.customerName = 'Nhập tên khách hàng';
    if (!f.division) e.division = 'Chọn khối';
    if (!f.projectType) e.projectType = 'Chọn loại dự án';
    if (!f.masterCode.trim()) e.masterCode = 'Nhập mã Master';
    else if (projects.some((p) => p.id !== initial?.id && p.masterCode === f.masterCode.trim())) e.masterCode = 'Mã Master đã tồn tại';
    if (!f.startDate) e.startDate = 'Chọn ngày bắt đầu';
    if (!f.endDate) e.endDate = 'Chọn ngày kết thúc';
    else if (f.startDate && f.endDate < f.startDate) e.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    if (!f.expectedRevenue) e.expectedRevenue = 'Nhập doanh thu dự kiến';
    const badPhase = f.phases.find((p) => p.start && p.end && p.end < p.start);
    if (badPhase) e.phases = `${badPhase.code}: ngày kết thúc phải sau ngày bắt đầu`;
    return e;
  }, [f, projects, initial]);

  const errCount = Object.keys(errors).length;
  const err = (k: keyof BizProjectInput) => (touched ? errors[k] : undefined);

  const submit = () => {
    setTouched(true);
    if (errCount) return;
    onSubmit({
      ...f,
      name: f.name.trim(),
      masterCode: f.masterCode.trim(),
      am: amText.split(',').map((s) => s.trim()).filter(Boolean),
    });
  };

  const cost = plannedCost(f);
  const gp = grossProfit(f);

  return (
    <>
      <ErpTitleBar
        crumbs={[...CRUMBS, initial ? `Sửa ${initial.masterCode}` : 'Tạo dự án']}
        title={initial ? `Sửa dự án — ${initial.name}` : 'Khai báo thông tin dự án'}
        actions={
          <>
            <Btn icon={X} onClick={onCancel}>
              Huỷ
            </Btn>
            <Btn variant="success" icon={Save} onClick={submit}>
              {initial ? 'Lưu thay đổi' : 'Tạo dự án'}
            </Btn>
          </>
        }
        meta={initial ? [{ label: 'Version hiện tại', value: `v${initial.version}` }, { label: 'Lưu sẽ tạo', value: `v${initial.version + 1}` }] : undefined}
      />

      {touched && errCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-rose-50 border border-rose-300 text-[12px] font-semibold text-rose-700">
          <AlertCircle size={14} /> Còn {errCount} trường chưa hợp lệ — kiểm tra các ô đánh dấu đỏ.
        </div>
      )}

      <Panel title="Thông tin chung" icon={LayoutList}>
        <FormGrid>
          <FormRow label="Mã Master" required error={err('masterCode')} hint={autoCode ? 'Tự sinh theo mã khách hàng — có thể sửa' : 'Mã KD = Master.1, Mã SX = Master.2'}>
            <input
              value={f.masterCode}
              onChange={(e) => {
                setAutoCode(false);
                setMaster(e.target.value);
              }}
              placeholder="VD: 022.688"
              className={`${inputCls} font-mono font-bold text-[#1f5fa8]`}
            />
          </FormRow>
          <FormRow label="Tên dự án" required error={err('name')}>
            <input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="VD: 022.NSG" className={inputCls} />
          </FormRow>
          <FormRow label="Mã kinh doanh">
            <input value={f.businessCode} disabled className={`${inputCls} font-mono`} />
          </FormRow>
          <FormRow label="PM kinh doanh">
            <input value={f.businessPm} onChange={(e) => set('businessPm', e.target.value)} className={inputCls} />
          </FormRow>
          <FormRow label="Mã sản xuất">
            <input value={f.productionCode} disabled className={`${inputCls} font-mono`} />
          </FormRow>
          <FormRow label="PM sản xuất">
            <input value={f.productionPm} onChange={(e) => set('productionPm', e.target.value)} className={inputCls} />
          </FormRow>
          <FormRow label="Trạng thái">
            <select value={f.status} onChange={(e) => set('status', e.target.value as BizStatus)} className={inputCls}>
              {BIZ_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Dự án KEY">
            <span className="flex items-center gap-2 h-8 text-[13px]">
              <input type="checkbox" checked={f.isKey} onChange={(e) => set('isKey', e.target.checked)} className="w-4 h-4 accent-amber-500" />
              <Star size={13} className="fill-amber-400 text-amber-500" /> Đánh dấu là dự án trọng điểm
            </span>
          </FormRow>
        </FormGrid>
      </Panel>

      <Panel title="Thông tin cơ hội kinh doanh" icon={Building2}>
        <FormGrid>
          <FormRow label="Khối" required error={err('division')}>
            <select value={f.division} onChange={(e) => set('division', e.target.value)} className={inputCls}>
              <option value="">— Chọn khối —</option>
              {DIVISIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Loại dự án" required error={err('projectType')}>
            <select value={f.projectType} onChange={(e) => set('projectType', e.target.value)} className={inputCls}>
              <option value="">— Chọn loại dự án —</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Mã khách hàng" required error={err('customerCode')}>
            <input value={f.customerCode} onChange={(e) => setCustomerCode(e.target.value)} placeholder="VD: 022" className={`${inputCls} font-mono`} />
          </FormRow>
          <FormRow label="Tên khách hàng" required error={err('customerName')}>
            <input value={f.customerName} onChange={(e) => set('customerName', e.target.value)} className={inputCls} />
          </FormRow>
          <FormRow label="Giám đốc kinh doanh">
            <input value={f.businessDirector} onChange={(e) => set('businessDirector', e.target.value)} className={inputCls} />
          </FormRow>
          <FormRow label="Giám đốc khối">
            <input value={f.salesDirector} onChange={(e) => set('salesDirector', e.target.value)} className={inputCls} />
          </FormRow>
          <FormRow label="AM" hint="Nhiều người cách nhau bằng dấu phẩy">
            <input value={amText} onChange={(e) => setAmText(e.target.value)} placeholder="Nguyễn Văn A, Trần Thị B" className={inputCls} />
          </FormRow>
          <FormRow label="Người tạo">
            <input value={f.creator} disabled className={inputCls} />
          </FormRow>
          <FormRow label="Ngày bắt đầu" required error={err('startDate')}>
            <input type="date" value={f.startDate} onChange={(e) => set('startDate', e.target.value)} className={inputCls} />
          </FormRow>
          <FormRow label="Ngày kết thúc" required error={err('endDate')}>
            <input type="date" value={f.endDate} min={f.startDate} onChange={(e) => set('endDate', e.target.value)} className={inputCls} />
          </FormRow>
          <FormRow label="Dự kiến ký HĐ" hint="Thời điểm dự kiến ký hợp đồng">
            <input type="date" value={f.expectedSignDate || ''} onChange={(e) => set('expectedSignDate', e.target.value)} className={inputCls} />
          </FormRow>
          <FormRow label="Hạn lập PAKD" hint={initial ? undefined : 'Mặc định đặt khi GĐK duyệt mã (7 ngày)'}>
            <input type="date" value={f.pakdDeadline || ''} onChange={(e) => set('pakdDeadline', e.target.value)} className={inputCls} />
          </FormRow>
        </FormGrid>
      </Panel>

      <Panel
        title="Các giai đoạn (KH01 → KH05)"
        icon={Flag}
        noPad
        footer={err('phases') ? <span className="text-rose-600 font-semibold">{err('phases')}</span> : 'Chọn "Hiện tại" để đánh dấu giai đoạn đang thực hiện; các giai đoạn trước đó được coi là đã hoàn thành.'}
      >
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1000px]`}>
            <thead>
              <tr>
                {['Hiện tại', 'Mã', 'Tên giai đoạn', 'Bắt đầu', 'Kết thúc', 'Phụ trách', 'Mục tiêu', 'Đầu ra'].map((h) => (
                  <th key={h} className={`${erp.th} text-left border-t-0 first:border-l-0 last:border-r-0`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {f.phases.map((p, i) => (
                <tr key={p.code} className={f.currentPhase === p.code ? 'bg-[#eaf2fc]' : ''}>
                  <td className={`${erp.td} text-center w-16 border-l-0`}>
                    <input type="radio" name="currentPhase" checked={f.currentPhase === p.code} onChange={() => set('currentPhase', p.code)} className="w-4 h-4 accent-[#1f5fa8] cursor-pointer" />
                  </td>
                  <td className={`${erp.td} ${erp.code} font-bold w-16`}>{p.code}</td>
                  <td className="border border-slate-200 p-0 w-52">
                    <input value={p.name} onChange={(e) => setPhase(i, 'name', e.target.value)} className={cellInput} />
                  </td>
                  <td className="border border-slate-200 p-0 w-36">
                    <input type="date" value={p.start} onChange={(e) => setPhase(i, 'start', e.target.value)} className={cellInput} />
                  </td>
                  <td className="border border-slate-200 p-0 w-36">
                    <input type="date" value={p.end} min={p.start} onChange={(e) => setPhase(i, 'end', e.target.value)} className={cellInput} />
                  </td>
                  <td className="border border-slate-200 p-0 w-44">
                    <input value={p.pic} onChange={(e) => setPhase(i, 'pic', e.target.value)} className={cellInput} />
                  </td>
                  <td className="border border-slate-200 p-0">
                    <input value={p.objective} onChange={(e) => setPhase(i, 'objective', e.target.value)} className={cellInput} />
                  </td>
                  <td className="border border-slate-200 border-r-0 p-0">
                    <input value={p.output} onChange={(e) => setPhase(i, 'output', e.target.value)} className={cellInput} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Tài chính tổng dự án (VNĐ)" icon={Wallet}>
        <FormGrid>
          <FormRow label="Doanh thu dự kiến" required error={err('expectedRevenue')}>
            <MoneyInput value={f.expectedRevenue} onChange={(v) => set('expectedRevenue', v)} />
          </FormRow>
          <FormRow label="Hợp đồng" hint={initial ? 'Cập nhật ký hợp đồng trên màn chi tiết dự án' : 'Sau khi tạo dự án, cập nhật ký hợp đồng trên màn chi tiết'}>
            <span className="flex items-center h-8">
              {f.contractSigned ? <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-300">Đã ký</Tag> : <Tag cls="bg-slate-100 text-slate-600 border-slate-300">Chưa ký</Tag>}
            </span>
          </FormRow>
          <FormRow label="Chi phí kinh doanh KH">
            <MoneyInput value={f.plannedBusinessCost} onChange={(v) => set('plannedBusinessCost', v)} />
          </FormRow>
          <FormRow label="Chi phí sản xuất KH">
            <MoneyInput value={f.plannedProductionCost} onChange={(v) => set('plannedProductionCost', v)} />
          </FormRow>
          <FormRow label="Ghi chú" className="xl:col-span-2">
            <textarea value={f.note || ''} onChange={(e) => set('note', e.target.value)} rows={2} className={`${inputCls} h-auto py-1.5`} />
          </FormRow>
        </FormGrid>
        <div className="mt-3 max-w-xl">
          <FieldTable
            labelWidth="55%"
            rows={[
              { label: 'Chi phí kế hoạch (tự tính)', value: money(cost), num: true },
              { label: 'Lợi nhuận gộp kế hoạch (tự tính)', value: <span className={gp < 0 ? 'text-rose-600' : 'text-emerald-700'}>{money(gp)}</span>, num: true, strong: true },
              { label: 'Biên lợi nhuận gộp', value: `${grossMargin(f).toFixed(1)}%`, num: true },
            ]}
          />
        </div>
      </Panel>
    </>
  );
};
