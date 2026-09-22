/**
 * PayrollApprovalPage — "Duyệt Bảng Lương Khối".
 *
 * Luồng: Hành chính (HR) tính lương & gửi bảng lương từng khối →
 * Giám đốc khối vào xem bảng lương khối mình và Duyệt / Từ chối (kèm lý do).
 *
 * 6 khối = 6 tab (kiểu danh sách Employees mẫu). Mỗi khối 1 bảng lương theo kỳ.
 * Quy ước màu: số để đen, chỉ TỔNG / Thực nhận dùng màu nhấn; badge trạng thái có màu.
 * Đơn vị: VNĐ.
 */
import React, { useMemo, useState } from 'react';
import {
  Grid,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  FileSpreadsheet,
  Users,
  Wallet,
  Clock,
  ShieldCheck,
  X,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const KHOIS = ['G1', 'G2', 'G3', 'G4', 'BFSI', 'GPDV'] as const;
type Khoi = (typeof KHOIS)[number];
const STANDARD_DAYS = 22;
const fmt = (n: number) => (n ? Math.round(n).toLocaleString('vi-VN') : '–');

// Lương cơ bản theo chức danh (VNĐ)
const TITLE_BASE: Record<string, number> = {
  'Giám đốc khối': 45_000_000,
  'Trưởng nhóm': 30_000_000,
  'Kỹ sư chính': 24_000_000,
  'Kỹ sư': 17_000_000,
  'Chuyên viên': 15_000_000,
  'Nhân viên': 12_000_000,
  'Thực tập sinh': 6_000_000,
};

interface Person { code: string; name: string; title: string; }
const ROSTER: Record<Khoi, Person[]> = {
  G1: [
    { code: 'V00556', name: 'Hà Tiến Giang', title: 'Giám đốc khối' },
    { code: 'V00667', name: 'Nguyễn Thịnh Trịnh', title: 'Trưởng nhóm' },
    { code: 'V00375', name: 'Nguyễn Minh Khánh', title: 'Kỹ sư chính' },
    { code: 'V00587', name: 'Nguyễn Thị Mến', title: 'Kỹ sư' },
    { code: 'V00883', name: 'Phạm Thị Thảo', title: 'Chuyên viên' },
    { code: 'V00690', name: 'Nguyễn Thị Hạnh', title: 'Nhân viên' },
  ],
  G2: [
    { code: 'V00101', name: 'Nguyễn Văn Hưng', title: 'Trưởng nhóm' },
    { code: 'V00243', name: 'Ngô Thị Thanh Phương', title: 'Kỹ sư chính' },
    { code: 'V00196', name: 'Nguyễn Đình Thành', title: 'Kỹ sư' },
    { code: 'V00643', name: 'Nguyễn Văn Điểm', title: 'Chuyên viên' },
    { code: 'V01082', name: 'Trần Thị Vân', title: 'Nhân viên' },
  ],
  G3: [
    { code: 'V01116', name: 'Phạm Lê Vũ', title: 'Trưởng nhóm' },
    { code: 'V00176', name: 'Cao Thành Hiếu', title: 'Kỹ sư chính' },
    { code: 'V01012', name: 'Lê Thanh Tùng', title: 'Kỹ sư' },
    { code: 'V00568', name: 'Ngô Đình Phong', title: 'Chuyên viên' },
    { code: 'V00201', name: 'Đỗ Thu Hà', title: 'Thực tập sinh' },
  ],
  G4: [
    { code: 'V00311', name: 'Vũ Minh Đức', title: 'Trưởng nhóm' },
    { code: 'V00312', name: 'Hoàng Văn Kiên', title: 'Kỹ sư' },
    { code: 'V00313', name: 'Ngô Thị Lan', title: 'Chuyên viên' },
    { code: 'V00314', name: 'Bùi Nam Anh Tuấn', title: 'Nhân viên' },
  ],
  BFSI: [
    { code: 'V00401', name: 'Lê Việt Hà', title: 'Giám đốc khối' },
    { code: 'V00402', name: 'Phạm Hữu Trường', title: 'Kỹ sư chính' },
    { code: 'V00403', name: 'Nghiêm Viết Tuấn', title: 'Kỹ sư' },
    { code: 'V00404', name: 'Nguyễn Quỳnh Nga', title: 'Chuyên viên' },
  ],
  GPDV: [
    { code: 'V00501', name: 'Bùi Huỳnh Nhật Hiếu', title: 'Trưởng nhóm' },
    { code: 'V00502', name: 'Nguyễn Quốc Phú', title: 'Kỹ sư chính' },
    { code: 'V00503', name: 'Bùi Ngọc Thanh Trúc', title: 'Kỹ sư' },
    { code: 'V00504', name: 'Bùi Quang Tuyển', title: 'Chuyên viên' },
    { code: 'V00505', name: 'Tiêu Ngọc Linh', title: 'Nhân viên' },
  ],
};

interface Payslip {
  code: string;
  name: string;
  title: string;
  workDays: number;
  basic: number;
  allowance: number; // phụ cấp
  ot: number; // OT/thưởng
  gross: number;
  insurance: number; // BHXH/BHYT/BHTN 10.5%
  tax: number; // thuế TNCN (đơn giản hoá)
  net: number; // thực nhận
}

const buildPayslip = (p: Person, i: number): Payslip => {
  const basic = TITLE_BASE[p.title] || 12_000_000;
  const workDays = STANDARD_DAYS - (i % 3); // 22/21/20
  const allowance = 2_000_000 + (i % 4) * 500_000;
  const ot = (i % 5) * 800_000;
  const earnedBasic = Math.round((basic * workDays) / STANDARD_DAYS);
  const gross = earnedBasic + allowance + ot;
  const insurance = Math.round(basic * 0.105);
  const taxable = gross - insurance - 11_000_000; // giảm trừ bản thân
  const tax = taxable > 0 ? Math.round(taxable * 0.1) : 0;
  const net = gross - insurance - tax;
  return { code: p.code, name: p.name, title: p.title, workDays, basic, allowance, ot, gross, insurance, tax, net };
};

const PAYSLIPS: Record<Khoi, Payslip[]> = KHOIS.reduce((acc, k) => {
  acc[k] = ROSTER[k].map(buildPayslip);
  return acc;
}, {} as Record<Khoi, Payslip[]>);

type PayStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
interface BlockState {
  status: PayStatus;
  by?: string;
  at?: string;
  reason?: string;
}
const INITIAL_STATE: Record<Khoi, BlockState> = {
  G1: { status: 'PENDING' },
  G2: { status: 'PENDING' },
  G3: { status: 'APPROVED', by: 'Trần B (GĐ Khối G3)', at: '19/09/2026 10:12' },
  G4: { status: 'PENDING' },
  BFSI: { status: 'REJECTED', by: 'Lê Việt Hà (GĐ Khối BFSI)', at: '18/09/2026 16:40', reason: 'Sai phụ cấp trách nhiệm 2 nhân sự, đề nghị HR tính lại.' },
  GPDV: { status: 'PENDING' },
};

const now = () => new Date().toLocaleString('vi-VN');

const STATUS_BADGE: Record<PayStatus, { label: string; cls: string }> = {
  PENDING: { label: 'CHỜ DUYỆT', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  APPROVED: { label: 'ĐÃ DUYỆT', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  REJECTED: { label: 'TỪ CHỐI', cls: 'bg-rose-100 text-rose-700 border-rose-200' },
};

export const PayrollApprovalPage: React.FC = () => {
  const [khoi, setKhoi] = useState<Khoi>('G1');
  const [month, setMonth] = useState(8);
  const [year] = useState(2026);
  const [state, setState] = useState<Record<Khoi, BlockState>>(INITIAL_STATE);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<Payslip | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2800);
  };

  const bs = state[khoi];
  const slips = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PAYSLIPS[khoi].filter((s) => !q || `${s.code} ${s.name} ${s.title}`.toLowerCase().includes(q));
  }, [khoi, search]);

  const totals = useMemo(() => {
    const t = { gross: 0, insurance: 0, tax: 0, net: 0 };
    slips.forEach((s) => { t.gross += s.gross; t.insurance += s.insurance; t.tax += s.tax; t.net += s.net; });
    return t;
  }, [slips]);

  const setKhoiStatus = (patch: BlockState) => setState((prev) => ({ ...prev, [khoi]: patch }));

  const approve = () => {
    setKhoiStatus({ status: 'APPROVED', by: `Giám đốc khối ${khoi}`, at: now() });
    showToast(`✅ Đã duyệt bảng lương khối ${khoi} kỳ ${month}/${year}.`);
  };
  const doReject = () => {
    if (!rejectReason.trim()) { showToast('⚠️ Vui lòng nhập lý do từ chối.'); return; }
    setKhoiStatus({ status: 'REJECTED', by: `Giám đốc khối ${khoi}`, at: now(), reason: rejectReason.trim() });
    showToast(`⛔ Đã từ chối bảng lương khối ${khoi}. HR sẽ nhận thông báo tính lại.`);
    setRejectOpen(false);
    setRejectReason('');
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-50/50 min-h-screen space-y-4 font-sans">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            className="fixed top-6 right-6 z-[120] bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center gap-3 text-xs font-bold max-w-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#0fa57c] animate-ping shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb + tiêu đề */}
      <div className="pb-2 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
        <div>
          <div className="flex items-center text-xs text-slate-500 gap-1.5 font-medium">
            <Grid size={13} className="text-slate-400" />
            <span>Human Resources</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span>Payroll</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-900 font-bold">Duyệt bảng lương khối</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-1 flex items-center gap-2.5">
            <span>Duyệt Bảng Lương Khối</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-600 border border-indigo-200">Giám đốc khối</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">HR đã tính & gửi bảng lương. GĐ khối xem và Duyệt / Từ chối. Đơn vị: <strong>VNĐ</strong>.</p>
        </div>
        {/* Điều hướng kỳ lương */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-1 rounded-xl shadow-xs">
          <button onClick={() => setMonth((m) => Math.max(1, m - 1))} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"><ChevronLeft size={16} /></button>
          <span className="px-3 text-xs font-bold text-slate-700 font-mono min-w-[110px] text-center">Kỳ lương {String(month).padStart(2, '0')}/{year}</span>
          <button onClick={() => setMonth((m) => Math.min(12, m + 1))} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* Tabs 6 khối */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs px-2 pt-2">
        <div className="flex items-center gap-1 flex-wrap border-b border-slate-100">
          {KHOIS.map((k) => {
            const active = k === khoi;
            const st = state[k];
            return (
              <button
                key={k}
                onClick={() => setKhoi(k)}
                className={`px-4 py-2.5 text-sm font-bold rounded-t-lg -mb-px border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                  active ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{k}</span>
                <span className="text-[10px] font-black text-slate-400">({PAYSLIPS[k].length})</span>
                <span className={`w-2 h-2 rounded-full ${st.status === 'APPROVED' ? 'bg-emerald-500' : st.status === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI + trạng thái + hành động */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3">
        <Kpi icon={<Users size={12} />} label="Số nhân sự" value={String(slips.length)} unit="người" />
        <Kpi icon={<Wallet size={12} />} label="Tổng thu nhập" value={fmt(totals.gross)} />
        <Kpi icon={<ShieldCheck size={12} />} label="Tổng khấu trừ" value={fmt(totals.insurance + totals.tax)} />
        <Kpi icon={<Wallet size={12} />} label="Tổng thực nhận" value={fmt(totals.net)} />
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs px-4 py-3 flex flex-col justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1"><Clock size={12} /> Trạng thái</p>
          <span className={`self-start px-2.5 py-1 rounded-lg text-[11px] font-black border ${STATUS_BADGE[bs.status].cls}`}>{STATUS_BADGE[bs.status].label}</span>
          {bs.by && <p className="text-[10px] text-slate-400 font-medium mt-1">{bs.by} · {bs.at}</p>}
        </div>
      </div>

      {/* Banner lý do từ chối */}
      {bs.status === 'REJECTED' && bs.reason && (
        <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-2xl flex items-start gap-2.5">
          <Info size={16} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-rose-700 uppercase">Lý do từ chối — gửi lại HR tính lại</span>
            <p className="text-xs font-semibold text-rose-900 mt-0.5">{bs.reason}</p>
          </div>
        </div>
      )}

      {/* Bảng lương */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3 flex-wrap">
          {bs.status === 'PENDING' ? (
            <>
              <button onClick={approve} className="flex items-center text-xs text-[#0fa57c] font-bold hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition-all cursor-pointer active:scale-95">
                <CheckCircle2 size={15} className="mr-1.5" /> Duyệt bảng lương
              </button>
              <button onClick={() => setRejectOpen(true)} className="flex items-center text-xs text-rose-600 font-bold hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-all cursor-pointer active:scale-95">
                <XCircle size={15} className="mr-1.5" /> Từ chối
              </button>
            </>
          ) : (
            <button onClick={() => setKhoiStatus({ status: 'PENDING' })} className="flex items-center text-xs text-slate-600 font-bold hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer">
              ↩︎ Mở lại để duyệt
            </button>
          )}

          <div className="relative w-64 ml-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm mã NV, tên, chức danh..." className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white" />
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden md:inline text-[11px] text-slate-400 font-semibold">Khối <strong className="text-slate-600">{khoi}</strong> · Kỳ {String(month).padStart(2, '0')}/{year}</span>
            <button onClick={() => showToast('📥 Đã xuất bảng lương ra file XLSX.')} className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer">
              <FileSpreadsheet size={14} className="text-slate-400" /> Export to XLSX
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1180px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3 w-10 text-center">#</th>
                <th className="px-4 py-3 min-w-[90px]">Mã NV</th>
                <th className="px-4 py-3 min-w-[170px]">Họ tên</th>
                <th className="px-4 py-3 min-w-[120px]">Chức danh</th>
                <th className="px-3 py-3 text-center">Công</th>
                <th className="px-4 py-3 text-right">Lương cơ bản</th>
                <th className="px-4 py-3 text-right">Phụ cấp</th>
                <th className="px-4 py-3 text-right">OT / Thưởng</th>
                <th className="px-4 py-3 text-right">Tổng thu nhập</th>
                <th className="px-4 py-3 text-right">BHXH (10.5%)</th>
                <th className="px-4 py-3 text-right">Thuế TNCN</th>
                <th className="px-4 py-3 text-right min-w-[120px]">Thực nhận</th>
                <th className="px-3 py-3 text-center w-16">Xem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {slips.map((s, i) => (
                <tr key={s.code} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 text-center font-mono font-bold text-slate-300">{i + 1}</td>
                  <td className="px-4 py-3 font-mono font-bold text-blue-600">{s.code}</td>
                  <td className="px-4 py-3 font-bold text-slate-700">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600">{s.title}</td>
                  <td className="px-3 py-3 text-center font-mono text-slate-600">{s.workDays}/{STANDARD_DAYS}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-800">{fmt(s.basic)}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-800">{fmt(s.allowance)}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-800">{fmt(s.ot)}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">{fmt(s.gross)}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-800">{fmt(s.insurance)}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-800">{fmt(s.tax)}</td>
                  <td className="px-4 py-3 text-right font-mono font-black text-indigo-700">{fmt(s.net)}</td>
                  <td className="px-3 py-3 text-center">
                    <button onClick={() => setDetail(s)} className="p-1.5 text-sky-500 hover:bg-sky-50 rounded-lg cursor-pointer" title="Xem phiếu lương"><Eye size={16} /></button>
                  </td>
                </tr>
              ))}
              {slips.length === 0 && (
                <tr><td colSpan={13} className="py-10 text-center text-slate-400">Không có nhân sự phù hợp.</td></tr>
              )}
            </tbody>
            {slips.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200 text-xs font-black text-indigo-700">
                  <td className="px-4 py-3" colSpan={8}>
                    <span className="inline-flex items-center gap-1.5 text-slate-700"><Users size={13} className="text-slate-400" /> Tổng khối {khoi}: {slips.length} nhân sự</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{fmt(totals.gross)}</td>
                  <td className="px-4 py-3 text-right font-mono">{fmt(totals.insurance)}</td>
                  <td className="px-4 py-3 text-right font-mono">{fmt(totals.tax)}</td>
                  <td className="px-4 py-3 text-right font-mono">{fmt(totals.net)}</td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* ===== MODAL: phiếu lương chi tiết ===== */}
      <AnimatePresence>
        {detail && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetail(null)} className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10">
              <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider">Phiếu lương · Kỳ {String(month).padStart(2, '0')}/{year}</h3>
                  <p className="text-[11px] text-slate-300 font-semibold">{detail.name} ({detail.code}) · {detail.title} · Khối {khoi}</p>
                </div>
                <button onClick={() => setDetail(null)} className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
              </div>
              <div className="p-6 text-xs space-y-1.5">
                <PayRow label={`Lương cơ bản (${detail.workDays}/${STANDARD_DAYS} công)`} value={Math.round((detail.basic * detail.workDays) / STANDARD_DAYS)} />
                <PayRow label="Phụ cấp" value={detail.allowance} />
                <PayRow label="OT / Thưởng" value={detail.ot} />
                <PayRow label="Tổng thu nhập (Gross)" value={detail.gross} strong />
                <div className="h-px bg-slate-100 my-2" />
                <PayRow label="BHXH / BHYT / BHTN (10.5%)" value={-detail.insurance} />
                <PayRow label="Thuế TNCN" value={-detail.tax} />
                <div className="h-px bg-slate-100 my-2" />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-black text-slate-800">Thực nhận (Net)</span>
                  <span className="text-lg font-black font-mono text-indigo-700">{fmt(detail.net)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== MODAL: lý do từ chối ===== */}
      <AnimatePresence>
        {rejectOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRejectOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl z-10">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800">Từ chối bảng lương khối {khoi}</h3>
                <button onClick={() => setRejectOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"><X size={18} /></button>
              </div>
              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-500">Nêu rõ lý do để HR điều chỉnh và tính lại bảng lương.</p>
                <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} placeholder="VD: Sai phụ cấp trách nhiệm, thiếu OT của 2 nhân sự..." className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 focus:bg-white" />
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => setRejectOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer">Huỷ</button>
                  <button onClick={doReject} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"><XCircle size={14} /> Gửi từ chối</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================================================
const Kpi: React.FC<{ icon: React.ReactNode; label: string; value: string; unit?: string }> = ({ icon, label, value, unit }) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs px-4 py-3">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">{icon} {label}</p>
    <p className="text-lg font-black font-mono text-indigo-700">{value}</p>
    <p className="text-[10px] text-slate-400 font-medium">{unit || 'VNĐ'}</p>
  </div>
);

const PayRow: React.FC<{ label: string; value: number; strong?: boolean }> = ({ label, value, strong }) => (
  <div className="flex items-center justify-between">
    <span className={`${strong ? 'font-black text-slate-800' : 'text-slate-600'}`}>{label}</span>
    <span className={`font-mono ${strong ? 'font-black text-slate-800' : value < 0 ? 'text-rose-600' : 'text-slate-800'}`}>{value < 0 ? `- ${fmt(-value)}` : fmt(value)}</span>
  </div>
);
