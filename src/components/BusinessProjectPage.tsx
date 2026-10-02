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
 * Quy trình: AM tạo yêu cầu → Chờ duyệt mã (GĐK duyệt; GĐK tự tạo thì cấp mã ngay) → Chưa có PAKD
 *   → PAKD chờ duyệt (Kế toán / CFO) → Đang thực hiện → Kết thúc. Quá 30 ngày chưa nộp PAKD → Đóng (CFO mở lại).
 *   Danh sách hiển thị Hạn lập PAKD, Phiên bản PAKD, nút thao tác theo vai trò (chọn AM / GĐK / PM / CFO),
 *   và nhóm cột Thông tin về hợp đồng.
 * Đầu màn danh sách: Sổ theo dõi dự án (ProjectTracker) — lọc Năm / Khối, giá trị HĐ ký so với mục tiêu.
 * Hợp đồng: bấm vào trạng thái "Chưa ký" / "Đã ký" → ContractModal (Cập nhật ký hợp đồng);
 * đã ký thì hiện thêm khung Thông tin hợp đồng (phụ lục, tài liệu đính kèm).
 *
 * Giao diện: khung kiểu phần mềm kế toán (src/components/erp/Erp.tsx).
 * Dữ liệu: src/business/BusinessProjectContext.tsx. Đơn vị: VNĐ.
 */
import React, { useEffect, useMemo, useState } from 'react';
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
  ListChecks,
  AlertCircle,
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
  FileSignature,
  FileText,
  Paperclip,
  Send,
  RotateCcw,
  Info,
} from 'lucide-react';
import {
  BizPhase,
  BizProject,
  BizProjectInput,
  BizStatus,
  BIZ_STATUSES,
  BizRole,
  BIZ_ROLES,
  latestPakd,
  signedDate,
  pendingRole,
  addDays,
  PAKD_DAYS,
  DIVISIONS,
  PROJECT_TYPES,
  useBusinessProjects,
  plannedCost,
  grossProfit,
  grossMargin,
  nextMasterCode,
  codesFrom,
  MAX_OUTSOURCE,
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
import { WorkflowDrawer, useWorkflowDrawer } from './WorkflowDrawer';
import { PakdForm } from './PakdForm';
import type { PakdFormData } from '../business/pakd';
import { Btn, ErpPage, ErpTitleBar, FieldTable, FolderTabs, FormRow, Panel, Segmented, Tag, erp } from './erp/Erp';

const CURRENT_USER = 'namnv';
const CRUMBS = ['Quản trị dự án & Tài chính', 'Danh sách dự án'];

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
  'Đóng': 'bg-slate-200 text-slate-700 border-slate-400',
};
const StatusBadge: React.FC<{ status: BizStatus }> = ({ status }) => <Tag cls={STATUS_CLS[status]}>{status}</Tag>;
const KeyBadge = () => (
  <Tag cls="bg-amber-50 text-amber-700 border-amber-300" icon={Star}>
    KEY
  </Tag>
);

/** Màn rộng (≥ 1280px): ngăn quy trình đẩy nội dung sang trái; màn hẹp: ngăn nổi đè lên nội dung. */
const useWide = () => {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
};

type View = { mode: 'list' } | { mode: 'detail'; id: string } | { mode: 'form'; id?: string };

export const BusinessProjectPage: React.FC = () => {
  const { projects, createProject, updateProject, deleteProject, importMonthly, saveContract, setAttachments, approveCode, reopenProject, submitPakd, savePakdForm, decidePakd, finishProject } =
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
    flash(!approve ? `Kế toán đã từ chối PAKD V${v} — trả về GĐK lập lại` : `Kế toán đã duyệt PAKD V${v} — dự án chuyển "Đang thực hiện"`);
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
            const { deadline, code } = approveCode(current.id, actor);
            flash(`Đã duyệt — hệ thống cấp mã ${code} (KD ${code}.1 · SX ${code}.2), hạn lập PAKD ${dmy(deadline)}`);
          }}
          onReopen={() => {
            const deadline = reopenProject(current.id, actor);
            flash(`Đã mở lại dự án ${current.masterCode} — hạn lập PAKD ${dmy(deadline)}`);
          }}
          onSubmitPakd={() => {
            submitPakd(current.id, actor);
            flash(`Đã nộp PAKD V${current.pakd.length + 1} — chờ Kế toán (CFO) duyệt`);
          }}
          onSavePakd={(form, submit) => {
            savePakdForm(current.id, form, actor, submit);
            flash(submit ? `Đã gửi PAKD V${current.pakd.length + 1} — chờ Kế toán (CFO) duyệt` : 'Đã lưu nháp PAKD');
          }}
          actor={actor}
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
          key={current?.id || 'new'}
          initial={current}
          projects={projects}
          role={role}
          onRoleChange={setRole}
          actor={actor}
          onCancel={() => setView(current ? { mode: 'detail', id: current.id } : { mode: 'list' })}
          onSubmit={(data, files) => {
            if (current) {
              updateProject(current.id, data, CURRENT_USER);
              const before = (current.attachments || []).map((x) => x.id).join();
              if (files.map((x) => x.id).join() !== before) setAttachments(current.id, files, CURRENT_USER, `Cập nhật tài liệu đính kèm (${files.length} tệp)`);
              setView({ mode: 'detail', id: current.id });
              flash(`Đã cập nhật dự án — Version ${current.version + 1}`);
            } else {
              // AM tạo → chờ GĐK duyệt mã; GĐK tự tạo → mã được cấp ngay, hạn PAKD = hôm nay + PAKD_DAYS.
              const issued = role === 'GĐK';
              const d = todayIso();
              const code = issued ? nextMasterCode(projects, data.customerCode) : '';
              const p = createProject(
                issued
                  ? { ...data, ...codesFrom(code), status: 'Chưa có PAKD', codeIssuedAt: d, pakdDeadline: addDays(d, PAKD_DAYS) }
                  : { ...data, ...codesFrom(''), status: 'Chờ duyệt mã', codeIssuedAt: undefined, pakdDeadline: '' },
                actor,
              );
              if (files.length) setAttachments(p.id, files, CURRENT_USER, `Đính kèm ${files.map((x) => x.name).join(', ')}`);
              setView({ mode: 'detail', id: p.id });
              flash(issued ? `Đã cấp mã ${code} — GĐK lập PAKD trước ${dmy(addDays(d, PAKD_DAYS))}` : 'Đã gửi yêu cầu mở mã dự án — chờ GĐK duyệt');
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
  if (p.status === 'Đóng') return { text: 'Đã đóng', sub: dmy(p.closedAt || p.pakdDeadline || ''), cls: 'text-slate-600 font-semibold' };
  if (p.status === 'Chưa có PAKD') {
    const sub = last?.state === 'Từ chối' ? `V${last.version} bị từ chối ${dmy(last.decidedAt || '')}` : undefined;
    // Bị Kế toán từ chối → trả về cập nhật lại PAKD (hạn 30 ngày chỉ áp dụng lần đầu).
    if (last?.state === 'Từ chối') return { text: `Làm lại V${last.version + 1}`, sub, cls: 'text-amber-700 font-semibold' };
    if (!p.pakdDeadline) return { text: 'Chưa đặt hạn', sub, cls: 'text-slate-400' };
    const d = daysBetween(todayIso(), p.pakdDeadline);
    if (d > 0) return { text: `Còn ${d} ngày`, sub, cls: d <= 3 ? 'text-amber-700 font-semibold' : '' };
    return { text: d === 0 ? 'Hết hạn hôm nay' : `Quá hạn ${-d} ngày`, sub, cls: 'text-rose-600 font-semibold' };
  }
  if (!last) return { text: '—', cls: 'text-slate-400' };
  if (last.state === 'Chờ CFO')
    return { text: last.version === 1 ? 'Nộp' : `Nộp v${last.version},`, sub: dmy(last.submittedAt) };
  return { text: 'Duyệt', sub: dmy(last.decidedAt || '') };
};

/** Cột "Phiên bản PAKD": "V1, chờ CFO" / "V1, đã duyệt" / "V2, từ chối". */
const pakdVersionText = (p: BizProject) => {
  const last = latestPakd(p);
  return last ? `V${last.version}, ${last.state.charAt(0).toLowerCase()}${last.state.slice(1)}` : '—';
};

/** Năm của dự án dùng cho bộ lọc Năm: năm ký HĐ (đã ký) → năm dự kiến ký HĐ → năm tạo yêu cầu. */
const projectYear = (p: BizProject) => (signedDate(p) || p.expectedSignDate || p.createdAt || '').slice(0, 4);

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
    case 'Đóng':
      return { label: role === 'CFO' ? 'Mở lại' : 'Xem', kind: 'view' };
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
            Kế toán (CFO) duyệt → PAKD được duyệt, dự án chuyển "Đang thực hiện". Từ chối → trả về GĐK lập phiên bản mới.
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
const LIST_HEAD = ['TT', 'Mã dự án', 'Tên dự án', 'Tên khách hàng', 'Khối', 'Loại dự án', 'Thời điểm dự kiến ký HĐ', 'Giá trị hợp đồng dự kiến', 'PM Kinh doanh', 'PM sản xuất', 'Trạng thái', 'Hạn lập PAKD', 'Phiên bản PAKD', 'Thao tác'];

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
  const { targets } = useBusinessProjects();
  const years = useMemo(() => {
    const ys = new Set([String(new Date().getFullYear())]);
    projects.forEach((p) => ys.add(projectYear(p)));
    Object.keys(targets).forEach((y) => ys.add(y)); // năm đã có mục tiêu kinh doanh (kể cả chưa có dự án)
    return [...ys].filter(Boolean).sort();
  }, [projects, targets]);
  const [year, setYear] = useState(() => String(new Date().getFullYear()));
  const [deciding, setDeciding] = useState<BizProject | null>(null);
  const [contractOf, setContractOf] = useState<BizProject | null>(null);

  // Lọc theo Năm · Khối · Tìm kiếm (dùng chung cho danh sách và số đếm trong các ô lọc).
  const base = useMemo(() => {
    const n = q.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (!year || projectYear(p) === year) &&
        (!division || p.division === division) &&
        (!n || [p.masterCode, p.name, p.customerCode, p.customerName, p.businessPm, p.productionPm].some((v) => (v || '').toLowerCase().includes(n))),
    );
  }, [projects, q, year, division]);
  const byStatus = (p: BizProject) => !status || p.status === status;
  const rows = useMemo(() => base.filter(byStatus), [base, status]);

  const rev = rows.reduce((s, p) => s + p.expectedRevenue, 0);
  const contractRev = rows.reduce((s, p) => s + (p.contract?.value ?? (p.contractSigned ? p.expectedRevenue : 0)), 0);
  // Số đếm trong ô lọc: theo các bộ lọc còn lại (để chọn vào là ra đúng số đó).
  const count = (st: BizStatus) => base.filter((p) => p.status === st).length;

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
          p.expectedRevenue,
          p.businessPm,
          p.productionPm,
          p.status,
          [dl.text, dl.sub].filter(Boolean).join(' '),
          pakdVersionText(p),
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
            <RoleSelect role={role} onChange={onRoleChange} />
            {(role === 'AM' || role === 'GĐK') && (
              <Btn variant="primary" icon={Plus} onClick={onCreate} title={role === 'GĐK' ? 'GĐK tạo → mã được cấp ngay' : 'AM tạo → chờ GĐK duyệt mã'}>
                Cấp mã dự án
              </Btn>
            )}
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
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Năm
              <select value={year} onChange={(e) => setYear(e.target.value)} className={`${erp.input} h-7 w-24`}>
                <option value="">Tất cả</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Khối
              <select value={division} onChange={(e) => setDivision(e.target.value)} className={`${erp.input} h-7 w-28`}>
                <option value="">Tất cả</option>
                {DIVISIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <div className="relative w-60">
              <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã, tên dự án, khách hàng, PM..." className={`${erp.inputFull} h-7 pl-7`} />
            </div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${erp.input} h-7 w-40`}>
              <option value="">Tất cả trạng thái</option>
              {BIZ_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s} ({count(s)})
                </option>
              ))}
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
                    <td className={`${erp.td} ${erp.code} font-semibold whitespace-nowrap`}>{p.masterCode || <span className="text-slate-400 font-normal font-sans text-[12px]">Chờ cấp mã</span>}</td>
                    <td className={erp.td}>
                      <span className="font-semibold text-slate-800">{p.name}</span> {p.isKey && <KeyBadge />}
                    </td>
                    <td className={erp.td}>{p.customerName}</td>
                    <td className={`${erp.td} text-center`}>{p.division}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{p.projectType}</td>
                    <td className={`${erp.td} text-center whitespace-nowrap`}>{dmy(p.expectedSignDate || '')}</td>
                    <td className={`${erp.td} ${erp.num}`}>{money(p.expectedRevenue)}</td>
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
                  <td className={`${erp.td} border-l-0`} colSpan={7}>
                    Tổng cộng ({rows.length} dự án)
                  </td>
                  <td className={`${erp.td} ${erp.num}`}>{money(rev)}</td>
                  <td className={`${erp.td}`} colSpan={6} />
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

// Quy trình & phê duyệt PAKD (màn chi tiết): xem WorkflowDrawer.tsx — ngăn kéo dọc bên phải.

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
  /** Tăng lên mỗi lần bấm "Lập PAKD" ở ngăn quy trình → mở import kế hoạch. */
  importRequest?: number;
}> = ({ project: p, onImport, importRequest }) => {
  const [kind, setKind] = useState<FinKind>('plan');
  const [showImport, setShowImport] = useState(false);
  useEffect(() => {
    if (!importRequest) return;
    setKind('plan');
    setShowImport(true);
  }, [importRequest]);
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

/**
 * Bảng "Mã dự án": Mã tổng (không gắn PM) · Mã kinh doanh · Mã sản xuất · tối đa MAX_OUTSOURCE mã outsource
 * (Mã tổng.3, .4) — mỗi mã outsource chọn PM phụ trách, có thể xoá.
 */
const CodeTable: React.FC<{ project: BizProject; actor: string }> = ({ project: p, actor }) => {
  const { projects, addOutsourceCode, setOutsourcePm, removeOutsourceCode } = useBusinessProjects();
  const outs = p.outsourceCodes || [];
  const pms = useMemo(
    () => peopleOf(projects, (x) => [x.businessPm, x.productionPm, ...(x.outsourceCodes || []).map((o) => o.pm)]),
    [projects],
  );
  const canAdd = !!p.masterCode && outs.length < MAX_OUTSOURCE;
  const td = `${erp.td} bg-[#f3f6fa] text-slate-600 w-[30%] border-l-0`;
  const pmSelect = (value: string, onChange: (v: string) => void) => (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`${erp.input} h-7 w-full max-w-[280px]`}>
      <option value="">— Chọn PM outsource —</option>
      {pms.map((n) => (
        <option key={n}>{n}</option>
      ))}
    </select>
  );
  return (
    <Panel
      title="Mã dự án"
      icon={Hash}
      noPad
      actions={
        p.masterCode ? (
          <Btn icon={Plus} className="h-7" disabled={!canAdd} onClick={() => addOutsourceCode(p.id, '', actor)} title={canAdd ? 'Tạo mã outsource' : `Tối đa ${MAX_OUTSOURCE} mã outsource`}>
            Tạo mã outsource ({outs.length}/{MAX_OUTSOURCE})
          </Btn>
        ) : undefined
      }
    >
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
          {/* Mã tổng không gắn PM — chỉ mã kinh doanh / sản xuất / outsource có PM phụ trách. */}
          <tr className={erp.tr}>
            <td className={td}>Mã dự án (mã tổng)</td>
            <td className={`${erp.td} ${erp.code} font-bold`}>{p.masterCode || 'Chờ cấp mã'}</td>
            <td className={`${erp.td} border-r-0`} />
          </tr>
          <tr className={erp.tr}>
            <td className={td}>Mã kinh doanh (PAKD)</td>
            <td className={`${erp.td} ${erp.code} font-bold`}>{p.businessCode}</td>
            <td className={`${erp.td} border-r-0`}>{p.businessPm || '—'}</td>
          </tr>
          <tr className={erp.tr}>
            <td className={td}>Mã sản xuất</td>
            <td className={`${erp.td} ${erp.code} font-bold`}>{p.productionCode}</td>
            <td className={`${erp.td} border-r-0`}>{p.productionPm || '—'}</td>
          </tr>
          {outs.map((o, i) => (
            <tr key={o.code} className={erp.tr}>
              <td className={td}>Mã outsource {outs.length > 1 ? i + 1 : ''}</td>
              <td className={`${erp.td} ${erp.code} font-bold`}>{o.code}</td>
              <td className={`${erp.td} border-r-0 py-1`}>
                <div className="flex items-center gap-2">
                  {pmSelect(o.pm, (v) => setOutsourcePm(p.id, o.code, v, actor))}
                  <button
                    type="button"
                    onClick={() => removeOutsourceCode(p.id, o.code, actor)}
                    className="ml-auto p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Xoá mã outsource"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {!outs.length && (
            <tr className={erp.tr}>
              <td className={td}>Mã outsource</td>
              <td className={`${erp.td} text-slate-400 italic`} colSpan={2}>
                {p.masterCode ? `Chưa có — bấm "Tạo mã outsource" (tối đa ${MAX_OUTSOURCE} mã)` : 'Tạo sau khi được cấp mã dự án'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Panel>
  );
};

/**
 * Thanh thao tác của bước hiện tại — luôn hiện dưới thanh tiêu đề (kể cả khi đã ẩn bảng quy trình bên phải):
 * GĐK duyệt mã · AM / GĐK lập PAKD · Kế toán (CFO) duyệt PAKD · Kế toán mở lại dự án đã đóng.
 * Vai trò không có quyền thao tác chỉ thấy thông báo đang chờ ai.
 */
const StepActionBar: React.FC<{
  project: BizProject;
  role: BizRole;
  onApproveCode: () => void;
  onLapPakd: () => void;
  onDecide: () => void;
  onReopen: () => void;
}> = ({ project: p, role, onApproveCode, onLapPakd, onDecide, onReopen }) => {
  const last = latestPakd(p);
  const left = p.pakdDeadline ? Math.ceil((new Date(`${p.pakdDeadline}T00:00:00`).getTime() - new Date(new Date().toDateString()).getTime()) / 86_400_000) : null;
  let text: React.ReactNode = null;
  let action: React.ReactNode = null;
  let waitingFor = '';
  if (p.status === 'Chờ duyệt mã') {
    if (role === 'GĐK') {
      text = <>Yêu cầu mở mã dự án đang chờ <b>Giám đốc khối</b> duyệt. Duyệt xong hệ thống sinh Mã dự án / Mã KD / Mã SX và bắt đầu đếm {PAKD_DAYS} ngày lập PAKD.</>;
      action = (
        <Btn variant="primary" icon={CheckCircle2} onClick={onApproveCode}>
          Duyệt mã dự án
        </Btn>
      );
    } else waitingFor = 'Giám đốc khối duyệt mã dự án';
  } else if (p.status === 'Chưa có PAKD') {
    if (role === 'GĐK' || role === 'AM') {
      text = (
        <>
          {last?.state === 'Từ chối' ? <>PAKD V{last.version} bị từ chối{last.note ? ` (${last.note})` : ''} — cần lập lại. </> : 'Dự án cần lập phương án kinh doanh (PAKD). '}
          Hạn lập: <b>{dmy(p.pakdDeadline || '')}</b>
          {left !== null && <> ({left >= 0 ? `còn ${left} ngày` : `quá hạn ${-left} ngày`})</>}
        </>
      );
      action = (
        <Btn variant="success" icon={Send} onClick={onLapPakd}>
          {p.pakd.length ? `Lập lại PAKD V${p.pakd.length + 1}` : 'Lập PAKD'}
        </Btn>
      );
    } else waitingFor = `AM / Giám đốc khối lập PAKD (hạn ${dmy(p.pakdDeadline || '')})`;
  } else if (p.status === 'PAKD chờ duyệt') {
    if (role === 'CFO') {
      text = <>PAKD V{last?.version} đang chờ <b>Kế toán (CFO)</b> duyệt.</>;
      action = (
        <Btn variant="primary" icon={ClipboardCheck} onClick={onDecide}>
          Duyệt / Từ chối PAKD
        </Btn>
      );
    } else waitingFor = `Kế toán (CFO) duyệt PAKD V${last?.version ?? ''}`;
  } else if (p.status === 'Đóng') {
    if (role === 'CFO') {
      text = <>Dự án đã đóng do quá hạn lập PAKD. Kế toán có thể mở lại để khối lập PAKD.</>;
      action = (
        <Btn icon={RotateCcw} onClick={onReopen}>
          Mở lại dự án
        </Btn>
      );
    } else waitingFor = 'Kế toán (CFO) mở lại dự án';
  }
  if (!text && !waitingFor) return null;
  if (!text)
    return (
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-[4px] border border-slate-300 bg-slate-50 text-[12.5px] text-slate-600">
        <Info size={14} className="text-slate-400 shrink-0" />
        <span>
          Đang chờ <b className="text-slate-800">{waitingFor}</b>.
        </span>
        <span className="text-slate-400">Đổi “Vai trò” ở góc trên nếu bạn là người thực hiện bước này.</span>
      </div>
    );
  return (
    <div className="flex flex-wrap items-center gap-3 px-3 py-2 rounded-[4px] border border-amber-300 bg-amber-50 text-[12.5px] text-amber-900">
      <AlertCircle size={15} className="text-amber-600 shrink-0" />
      <span className="flex-1 min-w-[240px]">{text}</span>
      {action}
    </div>
  );
};

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
  onReopen: () => void;
  onSubmitPakd: () => void;
  onSavePakd: (form: PakdFormData, submit: boolean) => void;
  actor: string;
  onDecide: (approve: boolean, note: string) => void;
  onFinish: () => void;
}> = ({ project: p, onBack, onEdit, onDelete, onImport, onSaveContract, onAttachments, role, onRoleChange, onApproveCode, onReopen, onSubmitPakd, onSavePakd, actor, onDecide, onFinish }) => {
  const files = p.attachments || [];
  const [deciding, setDeciding] = useState(false);
  const [tab, setTab] = useState<'overview' | 'history'>('overview');
  const [showContract, setShowContract] = useState(false);
  const drawer = useWorkflowDrawer();
  const wide = useWide();
  /** "Lập PAKD": về tab thông tin và cuộn tới form "Lập phương án kinh doanh". */
  const lapPakd = () => {
    setTab('overview');
    setTimeout(() => document.getElementById('pakd-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  return (
    <div className="transition-[margin] duration-200" style={{ marginRight: drawer.open && wide ? drawer.width : 0 }}>
      <WorkflowDrawer
        project={p}
        role={role}
        open={drawer.open}
        width={drawer.width}
        onOpenChange={drawer.setOpen}
        onWidthChange={drawer.setWidth}
        onApproveCode={onApproveCode}
        onReopen={onReopen}
        onSubmit={onSubmitPakd}
        onDecide={() => setDeciding(true)}
        onFinish={onFinish}
        onLapPakd={lapPakd}
        onEditInfo={onEdit}
      />
      <ErpTitleBar
        crumbs={[...CRUMBS, p.masterCode || 'Yêu cầu mở mã']}
        title={
          <>
            {p.name} {p.isKey && <KeyBadge />}
          </>
        }
        actions={
          <>
            <RoleSelect role={role} onChange={onRoleChange} />
            <Btn icon={ListChecks} onClick={() => drawer.setOpen(!drawer.open)} title={drawer.open ? 'Ẩn quy trình' : 'Mở quy trình'}>
              {drawer.open ? 'Ẩn quy trình' : 'Quy trình'}
            </Btn>
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
          { label: 'Mã dự án', value: p.masterCode ? <span className={erp.code}>{p.masterCode}</span> : <span className="text-slate-400">Chờ GĐK duyệt</span> },
          { label: 'Version', value: `v${p.version}` },
          { label: 'Trạng thái', value: <StatusBadge status={p.status} /> },
          { label: 'Khối', value: p.division },
          { label: 'PAKD', value: pakdVersionText(p) },
          { label: 'Cập nhật', value: dt(p.updatedAt) },
        ]}
      />

      <StepActionBar project={p} role={role} onApproveCode={onApproveCode} onLapPakd={lapPakd} onDecide={() => setDeciding(true)} onReopen={onReopen} />

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
          <CodeTable project={p} actor={actor} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <Panel title="Thông tin chi tiết dự án" icon={Building2} noPad className="xl:col-span-2">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <FieldTable
                  rows={[
                    { label: 'Khối', value: p.division },
                    { label: 'Loại dự án', value: p.projectType },
                    { label: 'Tên khách hàng', value: p.customerName },
                    { label: 'Mã khách hàng', value: <span className="font-mono">{p.customerCode}</span> },
                    { label: 'Thời gian', value: `${dmy(p.startDate)} → ${dmy(p.endDate)}` },
                  ]}
                />
                <FieldTable
                  rows={[
                    { label: 'Giám đốc kinh doanh', value: p.businessDirector },
                    { label: 'Giám đốc khối', value: p.salesDirector },
                    { label: 'AM', value: p.am.join(', ') },
                    { label: 'Người tạo', value: p.creator },
                    ...(p.note ? [{ label: 'Ghi chú', value: p.note }] : []),
                  ]}
                />
              </div>
            </Panel>

            <Panel title="Hợp đồng & tài liệu" icon={FileSignature} noPad>
              <div className="divide-y divide-slate-200">
                {/* Hợp đồng */}
                <div className="px-3 py-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">Hợp đồng</p>
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
                        p.contractSigned ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <FileSignature size={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      {p.contractSigned ? (
                        <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-300">Đã ký</Tag>
                      ) : (
                        <Tag cls="bg-slate-100 text-slate-600 border-slate-300">Chưa ký</Tag>
                      )}
                      <p className="text-[12.5px] text-slate-700 mt-1 truncate">
                        {p.contract ? (
                          <>
                            Số <span className="font-semibold">{p.contract.number}</span> · ký {dmy(p.contract.signDate)}
                          </>
                        ) : p.contractSigned ? (
                          'Chưa có thông tin chi tiết hợp đồng'
                        ) : (
                          'Chưa có thông tin ký hợp đồng'
                        )}
                      </p>
                      {p.contract && (
                        <p className="text-[12px] text-slate-500">
                          Thời hạn {dmy(p.contract.from)} → {dmy(p.contract.to)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Btn icon={p.contract ? Pencil : FileSignature} className="h-7 mt-2 w-full justify-center" onClick={() => setShowContract(true)}>
                    {p.contract ? 'Xem / cập nhật hợp đồng' : p.contractSigned ? 'Bổ sung thông tin HĐ' : 'Cập nhật ký hợp đồng'}
                  </Btn>
                </div>
                {/* Tài liệu đính kèm */}
                <div className="px-3 py-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">Tài liệu đính kèm ({files.length})</p>
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
                </div>
              </div>
            </Panel>
          </div>

          {/* PAKD: hiện sau khi GĐK duyệt mã — AM / GĐK nhập trong hạn PAKD_DAYS ngày */}
          {p.status !== 'Chờ duyệt mã' && <PakdForm key={p.id} project={p} role={role} actor={actor} onSave={onSavePakd} />}

          {p.contract && <ContractPanel project={p} onEdit={() => setShowContract(true)} />}
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
    </div>
  );
};

// ==========================================================================
// Form tạo / sửa
// ==========================================================================
const inputCls = erp.inputFull;
/** Ô nhập trong bảng (kiểu bảng tính): không viền, nền đổi khi focus. */



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

/** Danh sách khách hàng = các khách hàng đã có trong dự án (mã → tên). */
const customerList = (projects: BizProject[]) => {
  const m = new Map<string, string>();
  projects.forEach((p) => p.customerCode && !m.has(p.customerCode) && m.set(p.customerCode, p.customerName));
  return [...m.entries()].map(([code, name]) => ({ code, name })).sort((a, b) => a.code.localeCompare(b.code));
};

/** Danh sách người theo vai trò, lấy từ các dự án đã có (chưa có danh mục nhân sự riêng). */
const peopleOf = (projects: BizProject[], pick: (p: BizProject) => (string | undefined)[]) =>
  [...new Set(projects.flatMap((p) => pick(p)).map((x) => (x || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi'));

/**
 * Màn tạo dự án (Yêu cầu mở mã) / Sửa dự án — dựng giống màn chi tiết dự án, các ô nhập ngay tại chỗ:
 *   Thanh tiêu đề (Tên dự án · Dự án trọng điểm) · Mã dự án (mã tự sinh sau khi GĐK duyệt, chọn PM KD / PM SX)
 *   · Thông tin chi tiết dự án · Hợp đồng & tài liệu · Lập PAKD (mở sau khi GĐK duyệt mã).
 * AM tạo → Gửi GĐK duyệt; GĐK tạo → hệ thống cấp mã ngay, bắt đầu đếm PAKD_DAYS ngày lập PAKD.
 */
const ProjectForm: React.FC<{
  initial?: BizProject;
  projects: BizProject[];
  role: BizRole;
  onRoleChange: (r: BizRole) => void;
  actor: string;
  onCancel: () => void;
  onSubmit: (data: BizProjectInput, files: BizAttachment[]) => void;
}> = ({ initial, projects, role, onRoleChange, actor, onCancel, onSubmit }) => {
  const [f, setF] = useState<BizProjectInput>(() => (initial ? toInput(initial) : emptyInput()));
  const [files, setFiles] = useState<BizAttachment[]>(() => initial?.attachments || []);
  const [touched, setTouched] = useState(false);
  const directors = useMemo(() => peopleOf(projects, (p) => [p.businessDirector, p.salesDirector]), [projects]);
  const amPeople = useMemo(() => peopleOf(projects, (p) => [...(p.am || []), p.businessPm]), [projects]);
  const bizPms = useMemo(() => peopleOf(projects, (p) => [p.businessPm]), [projects]);
  const prodPms = useMemo(() => peopleOf(projects, (p) => [p.productionPm]), [projects]);
  const [extraCustomers, setExtraCustomers] = useState<{ code: string; name: string }[]>([]);
  const [adding, setAdding] = useState(false);
  const [nc, setNc] = useState({ code: '', name: '' });
  const set = <K extends keyof BizProjectInput>(k: K, v: BizProjectInput[K]) => setF((prev) => ({ ...prev, [k]: v }));
  const isEdit = !!initial;
  const willIssue = !isEdit && role === 'GĐK';

  const customers = useMemo(() => {
    const base = customerList(projects);
    extraCustomers.forEach((c) => !base.some((b) => b.code === c.code) && base.push(c));
    if (f.customerCode && !base.some((b) => b.code === f.customerCode)) base.push({ code: f.customerCode, name: f.customerName });
    return base.sort((a, b) => a.code.localeCompare(b.code));
  }, [projects, extraCustomers, f.customerCode, f.customerName]);
  const pickCustomer = (code: string) => {
    const c = customers.find((x) => x.code === code);
    setF((prev) => ({ ...prev, customerCode: c?.code || '', customerName: c?.name || '' }));
  };
  const ncErr = !nc.code.trim() ? 'Nhập mã khách hàng' : customers.some((c) => c.code === nc.code.trim()) ? 'Mã khách hàng đã tồn tại' : !nc.name.trim() ? 'Nhập tên khách hàng' : '';
  const addCustomer = () => {
    if (ncErr) return;
    const c = { code: nc.code.trim(), name: nc.name.trim() };
    setExtraCustomers((prev) => [...prev, c]);
    setF((prev) => ({ ...prev, customerCode: c.code, customerName: c.name }));
    setNc({ code: '', name: '' });
    setAdding(false);
  };

  const errors = useMemo(() => {
    const e: Partial<Record<keyof BizProjectInput, string>> = {};
    if (!f.name.trim()) e.name = 'Nhập tên dự án';
    if (!f.division) e.division = 'Chọn khối';
    if (!f.projectType) e.projectType = 'Chọn loại dự án';
    if (!f.customerCode.trim()) e.customerCode = 'Chọn khách hàng';
    if (f.startDate && f.endDate && f.endDate < f.startDate) e.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    return e;
  }, [f]);
  const errList = Object.values(errors);
  const err = (k: keyof BizProjectInput) => (touched ? errors[k] : undefined);
  const submit = () => {
    setTouched(true);
    if (errList.length) return;
    onSubmit({ ...f, name: f.name.trim() }, files);
  };

  // ---- ô nhập dùng trong bảng ----
  const cell = (k: keyof BizProjectInput) =>
    `${erp.inputFull} h-8 ${err(k) ? '!border-rose-400 bg-rose-50/40' : ''}`;
  const req = (label: string) => (
    <>
      {label} <span className="text-rose-500">*</span>
    </>
  );
  const errText = (k: keyof BizProjectInput) => err(k) && <p className="text-[11.5px] text-rose-600 mt-0.5">{err(k)}</p>;
  const personSelect = (k: 'businessDirector' | 'salesDirector' | 'businessPm' | 'productionPm', list: string[], ph: string) => (
    <select value={f[k]} onChange={(e) => set(k, e.target.value)} className={cell(k)}>
      <option value="">{ph}</option>
      {[...new Set([...list, f[k]].filter(Boolean))].map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  );
  const td = `${erp.td} bg-[#f3f6fa] text-slate-600 w-[30%] border-l-0`;
  const auto = <span className="text-slate-400 italic font-sans font-normal text-[12.5px]">Tự sinh sau khi GĐK duyệt</span>;

  return (
    <>
      <ErpTitleBar
        crumbs={[...CRUMBS, isEdit ? `Sửa ${initial!.masterCode || 'yêu cầu mở mã'}` : 'Yêu cầu mở mã dự án']}
        title={
          <span className="flex flex-wrap items-center gap-2 w-full">
            <input
              value={f.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Nhập tên dự án *"
              autoFocus={!isEdit}
              className={`min-w-[280px] w-[min(560px,60vw)] h-9 px-2.5 rounded-[3px] border text-[17px] font-bold text-[#1e3a5f] placeholder:text-slate-400 placeholder:font-semibold focus:outline-none focus:ring-2 focus:ring-[#1f5fa8]/30 ${
                err('name') ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'
              }`}
            />
            <button
              type="button"
              onClick={() => set('isKey', !f.isKey)}
              title="Đánh dấu dự án trọng điểm"
              className={`inline-flex items-center gap-1 h-7 px-2 rounded-[3px] border text-[12px] font-semibold cursor-pointer ${
                f.isKey ? 'bg-amber-50 border-amber-400 text-amber-700' : 'bg-white border-slate-300 text-slate-500 hover:border-amber-400'
              }`}
            >
              <Star size={13} className={f.isKey ? 'fill-amber-400 text-amber-500' : ''} /> {f.isKey ? 'Dự án trọng điểm (KEY)' : 'Đánh dấu KEY'}
            </button>
          </span>
        }
        actions={
          <>
            {!isEdit && <RoleSelect role={role} onChange={onRoleChange} />}
            <Btn icon={X} onClick={onCancel}>
              Huỷ
            </Btn>
            <Btn variant="success" icon={isEdit ? Save : Send} onClick={submit}>
              {isEdit ? 'Lưu thay đổi' : willIssue ? 'Tạo & cấp mã' : 'Gửi GĐK duyệt'}
            </Btn>
          </>
        }
        meta={[
          { label: 'Mã dự án', value: f.masterCode ? <span className={erp.code}>{f.masterCode}</span> : <span className="text-slate-400">Chờ GĐK duyệt</span> },
          { label: 'Version', value: isEdit ? `v${initial!.version} → v${initial!.version + 1}` : 'Mới' },
          { label: 'Trạng thái', value: isEdit ? <StatusBadge status={initial!.status} /> : <Tag cls="bg-slate-100 text-slate-600 border-slate-300">Đang soạn</Tag> },
          { label: 'Khối', value: f.division || '—' },
          { label: 'Người tạo', value: f.creator || actor },
        ]}
      />

      {!isEdit && (
        <div className="flex flex-wrap items-center gap-3 px-3 py-2 rounded-[4px] border border-emerald-600/60 bg-emerald-50/60 text-[12.5px] text-slate-700">
          <Info size={15} className="text-emerald-700 shrink-0" />
          <span className="flex-1 min-w-[240px]">
            <b className="text-[#1e3a5f]">Hướng dẫn quy trình: </b>
            {willIssue
              ? 'Giám đốc khối tạo → hệ thống cấp mã ngay (bỏ bước duyệt mã)'
              : 'AM gửi yêu cầu → Giám đốc khối duyệt → hệ thống cấp Mã dự án / Mã KD / Mã SX'}
            {` → AM / GĐK lập PAKD trong ${PAKD_DAYS} ngày → Kế toán (CFO) duyệt; bị từ chối thì trả về lập lại.`}
          </span>
        </div>
      )}

      {touched && errList.length > 0 && (
        <div className="flex items-start gap-2 px-3 py-2 rounded-[4px] bg-rose-50 border border-rose-300 text-[12px] text-rose-700">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>
            <b>Còn {errList.length} thông tin cần bổ sung:</b> {errList.join(' · ')}
          </span>
        </div>
      )}

      {/* Mã dự án */}
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
            <tr className={erp.tr}>
              <td className={td}>Mã dự án (mã tổng)</td>
              <td className={`${erp.td} ${erp.code} font-bold`}>{f.masterCode || auto}</td>
              <td className={`${erp.td} border-r-0`} />
            </tr>
            <tr className={erp.tr}>
              <td className={td}>Mã kinh doanh (PAKD)</td>
              <td className={`${erp.td} ${erp.code} font-bold`}>{f.businessCode || auto}</td>
              <td className={`${erp.td} border-r-0 py-1`}>
                <div className="max-w-[320px]">{personSelect('businessPm', bizPms, '— Chọn PM kinh doanh —')}</div>
              </td>
            </tr>
            <tr className={erp.tr}>
              <td className={td}>Mã sản xuất</td>
              <td className={`${erp.td} ${erp.code} font-bold`}>{f.productionCode || auto}</td>
              <td className={`${erp.td} border-r-0 py-1`}>
                <div className="max-w-[320px]">{personSelect('productionPm', prodPms, '— Chọn PM sản xuất —')}</div>
              </td>
            </tr>
            <tr className={erp.tr}>
              <td className={td}>Mã outsource</td>
              <td className={`${erp.td} text-slate-400 italic border-r-0`} colSpan={2}>
                {isEdit ? `${(initial!.outsourceCodes || []).map((o) => o.code).join(', ') || 'Chưa có'} — tạo / sửa trên màn chi tiết dự án` : 'Tạo sau khi được cấp mã dự án (tối đa 2 mã)'}
              </td>
            </tr>
          </tbody>
        </table>
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <Panel title="Thông tin chi tiết dự án" icon={Building2} noPad className="xl:col-span-2">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <FieldTable
              rows={[
                {
                  label: req('Khối'),
                  value: (
                    <>
                      <select value={f.division} onChange={(e) => set('division', e.target.value)} className={cell('division')}>
                        <option value="">— Chọn khối —</option>
                        {DIVISIONS.map((d) => (
                          <option key={d}>{d}</option>
                        ))}
                      </select>
                      {errText('division')}
                    </>
                  ),
                },
                {
                  label: req('Loại dự án'),
                  value: (
                    <>
                      <select value={f.projectType} onChange={(e) => set('projectType', e.target.value)} className={cell('projectType')}>
                        <option value="">— Chọn loại dự án —</option>
                        {PROJECT_TYPES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                      {errText('projectType')}
                    </>
                  ),
                },
                {
                  label: req('Tên khách hàng'),
                  value: (
                    <>
                      <div className="flex items-center gap-1.5">
                        <select value={f.customerCode} onChange={(e) => pickCustomer(e.target.value)} className={`${cell('customerCode')} flex-1 min-w-0`}>
                          <option value="">— Chọn khách hàng —</option>
                          {customers.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setAdding((v) => !v)}
                          className="shrink-0 inline-flex items-center gap-0.5 text-[12px] font-semibold text-[#1f7ae0] hover:underline cursor-pointer"
                          title="Thêm khách hàng mới"
                        >
                          <Plus size={13} /> Mới
                        </button>
                      </div>
                      {errText('customerCode')}
                      {adding && (
                        <div className="mt-1.5 p-2 rounded-[4px] border border-[#bcd3f0] bg-[#f4f8fd] space-y-1.5">
                          <div className="flex gap-1.5">
                            <input value={nc.code} onChange={(e) => setNc((v) => ({ ...v, code: e.target.value }))} placeholder="Mã KH" className={`${erp.inputFull} h-8 w-24 font-mono`} />
                            <input value={nc.name} onChange={(e) => setNc((v) => ({ ...v, name: e.target.value }))} placeholder="Tên khách hàng" className={`${erp.inputFull} h-8 flex-1`} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Btn variant="primary" icon={Plus} className="h-7" disabled={!!ncErr} title={ncErr || undefined} onClick={addCustomer}>
                              Thêm
                            </Btn>
                            <Btn className="h-7" onClick={() => setAdding(false)}>
                              Huỷ
                            </Btn>
                            {ncErr && (nc.code || nc.name) && <span className="text-[11.5px] text-rose-600">{ncErr}</span>}
                          </div>
                        </div>
                      )}
                    </>
                  ),
                },
                { label: 'Mã khách hàng', value: f.customerCode ? <span className="font-mono">{f.customerCode}</span> : <span className="text-slate-400 text-[12.5px]">Theo khách hàng</span> },
                {
                  label: 'Thời gian',
                  value: (
                    <>
                      <div className="flex items-center gap-1.5">
                        <input type="date" value={f.startDate} onChange={(e) => set('startDate', e.target.value)} className={`${cell('startDate')} min-w-0`} />
                        <span className="text-slate-400">→</span>
                        <input type="date" value={f.endDate} onChange={(e) => set('endDate', e.target.value)} className={`${cell('endDate')} min-w-0`} />
                      </div>
                      {errText('endDate')}
                    </>
                  ),
                },
              ]}
            />
            <FieldTable
              rows={[
                { label: 'Giám đốc kinh doanh', value: personSelect('businessDirector', directors, '— Chọn GĐKD —') },
                { label: 'Giám đốc khối', value: personSelect('salesDirector', directors, '— Chọn GĐ khối —') },
                {
                  label: 'AM',
                  value: (
                    <>
                      <select value="" onChange={(e) => e.target.value && set('am', [...f.am, e.target.value])} className={`${erp.inputFull} h-8`}>
                        <option value="">{f.am.length ? '— Thêm AM —' : '— Chọn AM —'}</option>
                        {amPeople
                          .filter((n) => !f.am.includes(n))
                          .map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                      </select>
                      {f.am.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {f.am.map((n) => (
                            <span key={n} className="inline-flex items-center gap-1 pl-2 pr-1 py-[1px] rounded-[3px] bg-[#eaf2fc] border border-[#bcd3f0] text-[12px] text-[#1e3a5f]">
                              {n}
                              <button type="button" title={`Bỏ ${n}`} onClick={() => set('am', f.am.filter((x) => x !== n))} className="p-0.5 rounded hover:bg-[#d3e3f7] text-slate-500 cursor-pointer">
                                <X size={11} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  ),
                },
                { label: 'Người tạo', value: f.creator || actor },
                {
                  label: 'Ghi chú',
                  value: <input value={f.note || ''} onChange={(e) => set('note', e.target.value)} placeholder="Ghi chú (nếu có)" className={`${erp.inputFull} h-8`} />,
                },
              ]}
            />
          </div>
        </Panel>

        <Panel title="Hợp đồng & tài liệu" icon={FileSignature} noPad>
          <div className="divide-y divide-slate-200">
            <div className="px-3 py-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">Hợp đồng</p>
              <div className="flex items-start gap-2.5">
                <span className={`mt-0.5 w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${f.contractSigned ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  <FileSignature size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  {f.contractSigned ? <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-300">Đã ký</Tag> : <Tag cls="bg-slate-100 text-slate-600 border-slate-300">Chưa ký</Tag>}
                  <p className="text-[12.5px] text-slate-600 mt-1">
                    {initial?.contract ? `Số ${initial.contract.number} · ký ${dmy(initial.contract.signDate)}` : 'Cập nhật ký hợp đồng trên màn chi tiết sau khi dự án được cấp mã.'}
                  </p>
                </div>
              </div>
            </div>
            <div className="px-3 py-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">Tài liệu đính kèm ({files.length})</p>
              <AttachmentList compact files={files} label="Đính kèm tài liệu" onAdd={(added) => setFiles((x) => [...x, ...added])} onRemove={(id) => setFiles((x) => x.filter((y) => y.id !== id))} />
            </div>
          </div>
        </Panel>
      </div>

      {!isEdit && (
        <Panel title="Lập phương án kinh doanh (PAKD)" icon={ClipboardCheck}>
          <div className="flex items-center gap-2.5 text-[12.5px] text-slate-500 py-3 justify-center text-center">
            <Info size={15} className="text-slate-400 shrink-0" />
            <span>
              {willIssue
                ? `Phần nhập PAKD mở ngay sau khi tạo — Giám đốc khối / AM có ${PAKD_DAYS} ngày kể từ ngày cấp mã để lập PAKD.`
                : `Phần nhập PAKD mở sau khi Giám đốc khối duyệt mã — AM / Giám đốc khối có ${PAKD_DAYS} ngày kể từ ngày duyệt để lập PAKD.`}
            </span>
          </div>
        </Panel>
      )}

      <div className="flex justify-end gap-2">
        <Btn icon={X} onClick={onCancel}>
          Huỷ
        </Btn>
        <Btn variant="success" icon={isEdit ? Save : Send} onClick={submit}>
          {isEdit ? 'Lưu thay đổi' : willIssue ? 'Tạo & cấp mã' : 'Gửi GĐK duyệt'}
        </Btn>
      </div>
    </>
  );
};
