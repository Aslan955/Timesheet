/**
 * ProjectFinancePage — "Cập nhật Tài chính Dự án" (dạng Form View theo tháng).
 *
 * Năm chức năng (tab):
 *  1. Doanh thu   — nhập doanh thu phát sinh trong kỳ (đã nghiệm thu & xuất hoá đơn),
 *                   so sánh doanh thu thực tế vs kế hoạch.
 *  2. Chi phí     — nhập chi phí thực tế, so sánh với chi phí kế hoạch.
 *  3. Vận hành khối — nhập chi phí vận hành chung của khối, tự động phân bổ về các dự án.
 *  4. Chi phí vận hành chi tiết — danh sách các khoản chi phí vận hành của khối.
 *  5. Dòng tiền   — cập nhật dòng tiền thu/chi từng dự án; lưới Dòng thu / Dòng chi /
 *                   Chênh lệch thu-chi / Luỹ kế kỳ trước / Luỹ kế dòng tiền (đúng mẫu).
 *
 * Đơn vị hiển thị: triệu VNĐ.
 */
import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Building2,
  ArrowLeft,
  ChevronRight,
  Grid,
  Save,
  Info,
  CheckCircle2,
  Layers,
  BarChart3,
  Eye,
  X,
  FileSpreadsheet,
  Search,
  Filter,
  ListFilter,
  Download,
  ArrowUpDown,
  FilterX,
  History,
  Upload,
  FileUp,
  DownloadCloud,
  FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFinancePlans } from '../finance/FinancePlanContext';
import { OVERHEAD_DETAIL } from '../finance/overheadDetail';

const YEAR = 2026;
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

// ==========================================================================
// Dữ liệu mẫu
// ==========================================================================
interface ProjectMeta {
  id: string;
  code: string;
  name: string;
  khoi: string;
  headcount: number;
}

const PROJECTS: ProjectMeta[] = [
  { id: 'P1', code: 'V.25.S.FX.DRA.12', name: 'Tripeo AI Travel Buddy', khoi: 'Giải pháp - Dịch vụ', headcount: 6 },
  { id: 'P2', code: '038.360.2', name: 'Điều phối', khoi: 'G3', headcount: 4 },
  { id: 'P3', code: '022.060.2', name: '022.GSDT (26-28)', khoi: 'G1', headcount: 10 },
  { id: 'P4', code: '100.000.2', name: 'Dự án nội bộ G1', khoi: 'G1', headcount: 5 },
  { id: 'P5', code: 'X.25.NB.ADB', name: 'X.25.NB.ADB', khoi: 'Health Care', headcount: 8 },
  { id: 'P6', code: '010.540.2', name: 'Hợp đồng cho thuê lại lao động', khoi: 'BFSI', headcount: 3 },
];

const KHOI_LIST = Array.from(new Set(PROJECTS.map((p) => p.khoi)));

interface Finance {
  revenuePlan: number[]; // doanh thu kế hoạch (12 tháng)
  revenueActual: number[]; // doanh thu thực tế (nghiệm thu & xuất HĐ)
  costPlan: number[]; // chi phí kế hoạch
  costActual: number[]; // chi phí thực tế trực tiếp
  cashIn: number[]; // dòng tiền thu thực nhận
  cashOut: number[]; // dòng tiền chi thực chi
  carryPrev: number; // luỹ kế dòng tiền đầu năm (kỳ trước chuyển sang)
}

// Sinh mảng 12 tháng: rải đều theo kế hoạch, thực tế chỉ có tới currentMonth.
const CURRENT_MONTH = 8; // dữ liệu thực tế cập nhật tới hết tháng 8/2026
const spread = (annual: number, ratioActual = 1) =>
  MONTHS.map((m) => (m <= CURRENT_MONTH ? Math.round((annual / 12) * ratioActual) : 0));
const planSpread = (annual: number) => MONTHS.map(() => Math.round(annual / 12));

const seedFinance = (revPlan: number, costPlan: number, revRatio: number, costRatio: number, carry: number): Finance => ({
  revenuePlan: planSpread(revPlan),
  revenueActual: spread(revPlan, revRatio),
  costPlan: planSpread(costPlan),
  costActual: spread(costPlan, costRatio),
  cashIn: spread(revPlan, revRatio * 0.85), // thu tiền về thường chậm hơn nghiệm thu
  cashOut: spread(costPlan, costRatio * 0.95),
  carryPrev: carry,
});

const INITIAL_FINANCE: Record<string, Finance> = {
  P1: seedFinance(3600, 2400, 0.95, 1.02, 120),
  P2: seedFinance(1800, 1500, 0.88, 0.9, -40),
  P3: seedFinance(9600, 6000, 1.05, 0.98, 300),
  P4: seedFinance(1200, 1400, 0.7, 1.1, 0),
  P5: seedFinance(4800, 3200, 0.92, 0.96, 80),
  P6: seedFinance(2400, 1800, 1.0, 1.0, 50),
};

// Chi phí vận hành chung của khối (triệu/tháng) — sẽ phân bổ về dự án.
const INITIAL_OVERHEAD: Record<string, number[]> = KHOI_LIST.reduce((acc, k) => {
  const base = k === 'G1' ? 200 : k === 'Health Care' ? 150 : 100;
  acc[k] = MONTHS.map((m) => (m <= CURRENT_MONTH ? base : 0));
  return acc;
}, {} as Record<string, number[]>);

type Basis = 'revenue' | 'cost' | 'count' | 'headcount';
// Chỉ dùng 1 tiêu thức phân bổ: theo chi phí thực tế.
const BASIS_LABEL: Partial<Record<Basis, string>> = {
  cost: 'Theo chi phí thực tế',
};

// ==========================================================================
// Helpers hiển thị
// ==========================================================================
const fmt = (n: number) => {
  if (!n) return '–';
  return Math.round(n).toLocaleString('vi-VN');
};
const sum = (arr: number[]) => arr.reduce((s, x) => s + x, 0);

type Tab = 'revenue' | 'cost' | 'overhead' | 'overheadDetail' | 'cashflow';

// Giá trị đặc biệt cho lựa chọn "Tất cả dự án trong khối".
const ALL_PROJECTS = '__ALL__';

// ==========================================================================
// Component
// ==========================================================================
export const ProjectFinancePage: React.FC = () => {
  const [finance, setFinance] = useState<Record<string, Finance>>(INITIAL_FINANCE);
  
  const overhead = useMemo(() => {
    const res: Record<string, number[]> = {};
    KHOI_LIST.forEach(k => {
      const arr = Array(12).fill(0);
      const items = OVERHEAD_DETAIL[k] || [];
      items.forEach(it => {
        const [mm, yyyy] = it.month.split('/').map(Number);
        if (yyyy === YEAR && mm >= 1 && mm <= 12) {
          arr[mm - 1] += (it.amount / 1_000_000);
        }
      });
      res[k] = arr;
    });
    return res;
  }, []);

  const [basisByKhoi, setBasisByKhoi] = useState<Record<string, Basis>>(
    KHOI_LIST.reduce((a, k) => ((a[k] = 'cost'), a), {} as Record<string, Basis>),
  );

  const [detailView, setDetailView] = useState<'none' | 'revenue'>('none');
  const [tab, setTab] = useState<Tab>('revenue');
  const [khoi, setKhoi] = useState<string>('G1');
  const projectsInKhoi = useMemo(() => PROJECTS.filter((p) => p.khoi === khoi), [khoi]);
  const [projectId, setProjectId] = useState<string>('P3');

  const isAll = projectId === ALL_PROJECTS;
  const project = isAll ? undefined : PROJECTS.find((p) => p.id === projectId);

  // Doanh thu kế hoạch (PAKD) lấy từ "Kế hoạch thu" do GĐ khối lập (nếu có).
  const { getPlanMonthly, getWorkloadMonthly } = useFinancePlans();

  // Khối lượng công việc (%) theo kế hoạch: 1 dự án → của dự án đó; toàn khối → trung bình các dự án.
  const workloadRow = useMemo(() => {
    if (isAll) {
      const arr = MONTHS.map(() => 0);
      let n = 0;
      projectsInKhoi.forEach((p) => {
        const w = getWorkloadMonthly(p.code, YEAR);
        if (w) { n += 1; w.forEach((v, i) => (arr[i] += v)); }
      });
      return n ? arr.map((v) => Math.round(v / n)) : undefined;
    }
    return project ? getWorkloadMonthly(project.code, YEAR) : undefined;
  }, [isAll, projectsInKhoi, getWorkloadMonthly, project]);

  // Doanh thu kế hoạch hiệu lực của 1 dự án: ưu tiên kế hoạch thu, fallback seed.
  const effRevenuePlan = (pid: string) => {
    const p = PROJECTS.find((x) => x.id === pid)!;
    return getPlanMonthly(p.code, YEAR) ?? finance[pid].revenuePlan;
  };

  // fin: dữ liệu của 1 dự án, hoặc tổng hợp toàn khối khi chọn "Tất cả".
  const fin = useMemo<Finance>(() => {
    if (isAll) {
      const agg: Finance = {
        revenuePlan: MONTHS.map(() => 0),
        revenueActual: MONTHS.map(() => 0),
        costPlan: MONTHS.map(() => 0),
        costActual: MONTHS.map(() => 0),
        cashIn: MONTHS.map(() => 0),
        cashOut: MONTHS.map(() => 0),
        carryPrev: 0,
      };
      projectsInKhoi.forEach((p) => {
        const f = finance[p.id];
        const rp = effRevenuePlan(p.id);
        MONTHS.forEach((_, i) => {
          agg.revenuePlan[i] += rp[i];
          agg.revenueActual[i] += f.revenueActual[i];
          agg.costPlan[i] += f.costPlan[i];
          agg.costActual[i] += f.costActual[i];
          agg.cashIn[i] += f.cashIn[i];
          agg.cashOut[i] += f.cashOut[i];
        });
        agg.carryPrev += f.carryPrev;
      });
      return agg;
    }
    const base = finance[projectId];
    const rp = getPlanMonthly(project!.code, YEAR);
    return rp ? { ...base, revenuePlan: rp } : base;
  }, [finance, projectId, isAll, projectsInKhoi, getPlanMonthly, project]);

  // Đối tượng hiển thị cho tiêu đề form.
  const displayProject: ProjectMeta = isAll
    ? { id: ALL_PROJECTS, code: `Tất cả (${projectsInKhoi.length} dự án)`, name: `Khối ${khoi}`, khoi, headcount: 0 }
    : project!;

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2600);
  };

  const changeKhoi = (k: string) => {
    setKhoi(k);
    // Giữ chế độ "Tất cả" nếu đang chọn; ngược lại về dự án đầu tiên của khối.
    if (projectId !== ALL_PROJECTS) {
      const first = PROJECTS.find((p) => p.khoi === k);
      if (first) setProjectId(first.id);
    }
  };

  // Cập nhật 1 ô của 1 field trong finance của dự án hiện tại
  const setCell = (field: keyof Finance, monthIdx: number, value: number) => {
    setFinance((prev) => {
      const cur = prev[projectId];
      if (field === 'carryPrev') {
        return { ...prev, [projectId]: { ...cur, carryPrev: value } };
      }
      const arr = [...(cur[field] as number[])];
      arr[monthIdx] = value;
      return { ...prev, [projectId]: { ...cur, [field]: arr } };
    });
  };

  // ---- Phân bổ chi phí khối về dự án theo tiêu thức ----
  const basis = basisByKhoi[khoi];
  const allocation = useMemo(() => {
    // Trả về: { [projectId]: number[12] } phần chi phí khối phân bổ mỗi tháng
    const result: Record<string, number[]> = {};
    projectsInKhoi.forEach((p) => (result[p.id] = MONTHS.map(() => 0)));
    MONTHS.forEach((_, mi) => {
      const pool = overhead[khoi]?.[mi] || 0;
      if (pool <= 0) return;
      const weights = projectsInKhoi.map((p) => {
        if (basis === 'revenue') return finance[p.id].revenueActual[mi];
        if (basis === 'cost') return finance[p.id].costActual[mi];
        if (basis === 'headcount') return p.headcount;
        return 1; // count
      });
      const totalW = sum(weights);
      projectsInKhoi.forEach((p, pi) => {
        const w = totalW > 0 ? weights[pi] / totalW : 1 / projectsInKhoi.length;
        result[p.id][mi] = Math.round(pool * w);
      });
    });
    return result;
  }, [projectsInKhoi, overhead, khoi, basis, finance]);

  const allocForProject = useMemo(() => {
    if (isAll) {
      const a = MONTHS.map(() => 0);
      projectsInKhoi.forEach((p) => (allocation[p.id] || []).forEach((v, i) => (a[i] += v)));
      return a;
    }
    return allocation[projectId] || MONTHS.map(() => 0);
  }, [allocation, projectId, isAll, projectsInKhoi]);

  if (detailView === 'revenue') {
    return (
      <div className="p-4 sm:p-6 bg-slate-50/50 min-h-screen space-y-4 font-sans">
        <ImportDetailView onBack={() => setDetailView('none')} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-slate-50/50 min-h-screen space-y-4 font-sans">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            className="fixed top-6 right-6 z-[100] bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center gap-3 text-xs font-bold"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#0fa57c] animate-ping" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb + tiêu đề */}
      <div className="pb-3 border-b border-slate-200/80">
        <div className="flex items-center text-xs text-slate-500 mb-1 gap-1.5 font-medium">
          <Grid size={13} className="text-slate-400" />
          <span>Home</span>
          <ChevronRight size={12} className="text-slate-300" />
          <span>Quản lý dự án</span>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-900 font-bold">Thông tin tài chính</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
          <span>Thông Tin Tài Chính Dự Án</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Cập nhật thực tế theo tháng và đối chiếu với kế hoạch.
        </p>
      </div>

      {/* Thanh chọn Khối + Dự án + Tab */}
      <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-[auto_260px_auto_1fr] items-center gap-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Khối</span>
          <select
            value={khoi}
            onChange={(e) => changeKhoi(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
          >
            {KHOI_LIST.map((k) => (
              <option key={k} value={k}>
                {k} ({PROJECTS.filter((p) => p.khoi === k).length} dự án)
              </option>
            ))}
          </select>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dự án</span>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            disabled={tab === 'overhead' || tab === 'overheadDetail'}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
          >
            <option value={ALL_PROJECTS}>▦ Tất cả dự án trong khối ({projectsInKhoi.length})</option>
            {projectsInKhoi.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {([
            { id: 'revenue', label: 'Doanh thu', icon: TrendingUp },
            { id: 'cost', label: 'Chi phí', icon: TrendingDown },
            { id: 'overhead', label: 'Vận hành khối', icon: Building2 },
            { id: 'overheadDetail', label: 'Chi phí vận hành chi tiết', icon: FileText },
            { id: 'cashflow', label: 'Dòng tiền', icon: Wallet },
          ] as { id: Tab; label: string; icon: any }[]).map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  tab === t.id ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nội dung tab */}
      {tab === 'revenue' && (
        <RevenueForm project={displayProject} fin={fin} readOnly={isAll} setCell={setCell} onSave={() => showToast('💾 Đã lưu doanh thu thực tế.')} onViewDetail={() => setDetailView('revenue')} />
      )}
      {tab === 'cost' && (
        <CostForm
          project={displayProject}
          fin={fin}
          alloc={allocForProject}
          readOnly={isAll}
          setCell={setCell}
          onSave={() => showToast('💾 Đã lưu chi phí thực tế.')}
        />
      )}
      {tab === 'overhead' && (
        <OverheadForm
          khoi={khoi}
          projects={projectsInKhoi}
          overhead={overhead[khoi]}
          basis={basis}
          allocation={allocation}
          onViewDetail={() => setTab('overheadDetail')}
        />
      )}
      {tab === 'overheadDetail' && <OverheadDetailView khoi={khoi} />}
      {tab === 'cashflow' && (
        <CashflowForm project={displayProject} fin={fin} readOnly={isAll} workload={workloadRow} setCell={setCell} onSave={() => showToast('💾 Đã lưu dòng tiền.')} />
      )}
    </div>
  );
};

// ==========================================================================
// Ô nhập số (editable)
// ==========================================================================
const EditCell: React.FC<{ value: number; onChange: (v: number) => void; tone?: 'in' | 'out' }> = ({ value, onChange, tone }) => (
  <input
    inputMode="numeric"
    value={value ? value.toLocaleString('vi-VN') : ''}
    onChange={(e) => {
      const n = Number(e.target.value.replace(/[^\d-]/g, ''));
      onChange(isNaN(n) ? 0 : n);
    }}
    placeholder="–"
    className="w-full text-right font-mono text-xs px-1.5 py-1 rounded-md bg-white border border-slate-200 outline-none focus:border-blue-500 focus:bg-blue-50/40 text-slate-800"
  />
);

// Khung bảng form-view chung
const GridShell: React.FC<{
  title: string;
  subtitle?: string;
  onSave?: () => void;
  children: React.ReactNode;
  legend?: React.ReactNode;
  readOnly?: boolean;
  actions?: React.ReactNode;
}> = ({ title, subtitle, onSave, children, legend, readOnly, actions }) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
          {title}
          {readOnly && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-500 border border-slate-200">
              Tổng hợp toàn khối · chỉ xem
            </span>
          )}
        </h3>
        {subtitle && <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>}
      </div>
      {!readOnly && !actions && onSave && (
        <button
          onClick={onSave}
          className="px-3.5 py-1.5 bg-[#0fa57c] hover:bg-[#0c8e6b] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Save size={14} /> Lưu cập nhật
        </button>
      )}
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[1200px]">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
            <th className="px-4 py-3 sticky left-0 bg-slate-50 z-10 min-w-[200px]">Nội dung</th>
            {MONTHS.map((m) => (
              <th key={m} className="px-2 py-3 text-right min-w-[86px]">
                T{m}
              </th>
            ))}
            <th className="px-3 py-3 text-right min-w-[100px] bg-slate-100 text-slate-600">Cả năm</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">{children}</tbody>
      </table>
    </div>
    {legend && <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-500">{legend}</div>}
  </div>
);

// Hàng chỉ đọc (computed / plan)
const ReadRow: React.FC<{
  label: React.ReactNode;
  values: number[];
  bold?: boolean;
  tone?: (v: number) => string;
  total?: number;
  suffix?: string;
}> = ({ label, values, bold, total, suffix = '' }) => (
  <tr className={bold ? 'bg-slate-50/50' : ''}>
    <td className={`px-4 py-2.5 sticky left-0 bg-inherit z-10 ${bold ? 'font-black text-slate-800' : 'font-semibold text-slate-600'}`}>
      {label}
    </td>
    {values.map((v, i) => (
      <td key={i} className="px-2 py-2.5 text-right font-mono text-slate-800">
        {fmt(v)}{v ? suffix : ''}
      </td>
    ))}
    <td className="px-3 py-2.5 text-right font-mono font-black bg-indigo-50/60 text-indigo-700">
      {fmt(total ?? sum(values))}{suffix}
    </td>
  </tr>
);

// Hàng nhập liệu (readOnly = hiển thị dạng chỉ đọc khi xem tổng hợp toàn khối)
const EditRow: React.FC<{
  label: React.ReactNode;
  values: number[];
  onChange: (monthIdx: number, v: number) => void;
  tone?: 'in' | 'out';
  readOnly?: boolean;
}> = ({ label, values, onChange, tone, readOnly }) => {
  return (
    <tr>
      <td className="px-4 py-2 sticky left-0 bg-white z-10 font-bold text-slate-700">{label}</td>
      {values.map((v, i) => (
        <td key={i} className={readOnly ? 'px-2 py-2.5 text-right font-mono text-slate-800' : 'px-1.5 py-1.5'}>
          {readOnly ? fmt(v) : <EditCell value={v} onChange={(nv) => onChange(i, nv)} tone={tone} />}
        </td>
      ))}
      <td className="px-3 py-2 text-right font-mono font-black bg-indigo-50/60 text-indigo-700">{fmt(sum(values))}</td>
    </tr>
  );
};

const diffTone = (v: number) => (v > 0 ? 'text-emerald-600' : v < 0 ? 'text-rose-600' : 'text-slate-400');

// ==========================================================================
// TAB 1 — Doanh thu
// ==========================================================================
const RevenueForm: React.FC<{
  project: ProjectMeta;
  fin: Finance;
  setCell: (f: keyof Finance, i: number, v: number) => void;
  onSave: () => void;
  readOnly?: boolean;
  onViewDetail: () => void;
}> = ({ project, fin, setCell, onSave, readOnly, onViewDetail }) => {
  const [showImport, setShowImport] = useState(false);
  const diff = MONTHS.map((_, i) => fin.revenueActual[i] - fin.revenuePlan[i]);
  const pct = MONTHS.map((_, i) => (fin.revenuePlan[i] > 0 ? (fin.revenueActual[i] / fin.revenuePlan[i]) * 100 : 0));
  const totalPlan = sum(fin.revenuePlan);
  const totalActual = sum(fin.revenueActual);
  const totalPct = totalPlan > 0 ? (totalActual / totalPlan) * 100 : 0;

  return (
    <>
      <SummaryStrip
        items={[
          { label: 'Doanh thu KH', value: fmt(totalPlan), tone: 'default' },
          { label: 'Doanh thu TT', value: fmt(totalActual), tone: 'success' },
          { label: 'Chênh lệch', value: fmt(totalActual - totalPlan), tone: totalActual - totalPlan >= 0 ? 'success' : 'danger' },
          { label: '% hoàn thành', value: `${totalPct.toFixed(0)}%`, tone: totalPct >= 100 ? 'success' : 'warning' },
        ]}
      />
      <GridShell
        title={`Doanh thu — ${project.code}`}
        subtitle="Doanh thu thực tế = giá trị đã nghiệm thu & xuất hoá đơn trong kỳ."
        readOnly={readOnly}
        legend="Chênh lệch = Thực tế − Kế hoạch. Xanh: đạt/vượt kế hoạch, đỏ: hụt kế hoạch."
        actions={
          !readOnly && (
            <>
              <button onClick={onViewDetail} className="px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
                <Eye size={14} /> Xem chi tiết
              </button>
              <button onClick={() => setShowImport(true)} className="px-3.5 py-1.5 bg-[#0fa57c] hover:bg-[#0c8e6b] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
                <FileSpreadsheet size={14} /> Import doanh thu thực tế
              </button>
            </>
          )
        }
      >
        <ReadRow label="Doanh thu kế hoạch" values={fin.revenuePlan} />
        <EditRow label="Doanh thu thực tế" values={fin.revenueActual} onChange={(i, v) => setCell('revenueActual', i, v)} tone="in" readOnly={true} />
        <ReadRow label="Chênh lệch TT − KH" values={diff} tone={diffTone} bold />
        <ReadRow label="% hoàn thành KH" values={pct.map((p) => Math.round(p))} tone={(v) => (v >= 100 ? 'text-emerald-600' : v > 0 ? 'text-amber-600' : 'text-slate-400')} total={Math.round(totalPct)} />
      </GridShell>

      <AnimatePresence>
        {showImport && <ImportFileModal isOpen={showImport} onClose={() => setShowImport(false)} onImport={onSave} />}
      </AnimatePresence>
    </>
  );
};

// ==========================================================================
// TAB 2 — Chi phí
// ==========================================================================
const CostForm: React.FC<{
  project: ProjectMeta;
  fin: Finance;
  alloc: number[];
  setCell: (f: keyof Finance, i: number, v: number) => void;
  onSave: () => void;
  readOnly?: boolean;
}> = ({ project, fin, alloc, setCell, onSave, readOnly }) => {
  const totalActual = MONTHS.map((_, i) => fin.costActual[i] + alloc[i]);
  const diff = MONTHS.map((_, i) => fin.costPlan[i] - totalActual[i]); // KH - TT (dương = tiết kiệm)
  const tPlan = sum(fin.costPlan);
  const tActual = sum(totalActual);

  return (
    <>
      <SummaryStrip
        items={[
          { label: 'Chi phí KH', value: fmt(tPlan), tone: 'default' },
          { label: 'Chi phí TT trực tiếp', value: fmt(sum(fin.costActual)), tone: 'default' },
          { label: 'Phân bổ từ khối', value: fmt(sum(alloc)), tone: 'warning' },
          { label: 'Chênh lệch KH − TT', value: fmt(tPlan - tActual), tone: tPlan - tActual >= 0 ? 'success' : 'danger' },
        ]}
      />
      <GridShell
        title={`Chi phí — ${project.code}`}
        subtitle="Chi phí thực tế trực tiếp + chi phí phân bổ từ khối, so với kế hoạch."
        readOnly={readOnly}
        legend="Chênh lệch = Kế hoạch − Thực tế. Xanh: trong định mức (tiết kiệm), đỏ: vượt chi."
      >
        <ReadRow label="Chi phí kế hoạch" values={fin.costPlan} />
        <EditRow label="Chi phí thực tế trực tiếp" values={fin.costActual} onChange={(i, v) => setCell('costActual', i, v)} tone="out" readOnly={true} />
        <ReadRow label="Phân bổ CP vận hành khối" values={alloc} tone={() => 'text-amber-600'} />
        <ReadRow label="Tổng chi phí thực tế" values={totalActual} bold tone={() => 'text-rose-600'} />
        <ReadRow label="Chênh lệch KH − TT" values={diff} tone={diffTone} bold />
      </GridShell>
    </>
  );
};

// ==========================================================================
// TAB 3 — Vận hành khối (phân bổ)
// ==========================================================================
const OverheadForm: React.FC<{
  khoi: string;
  projects: ProjectMeta[];
  overhead: number[];
  basis: Basis;
  allocation: Record<string, number[]>;
  onViewDetail: () => void;
}> = ({ khoi, projects, overhead, allocation, onViewDetail }) => {
  const [showImport, setShowImport] = useState(false);

  return (
    <>
      <GridShell
        title={`Chi phí vận hành chung — Khối ${khoi}`}
        subtitle={`Dữ liệu lấy từ chi phí vận hành chi tiết, hệ thống tự phân bổ về ${projects.length} dự án theo chi phí thực tế.`}
        actions={
          <>
            <button onClick={onViewDetail} className="px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <Eye size={14} /> Xem chi tiết
            </button>
            <button onClick={() => setShowImport(true)} className="px-3.5 py-1.5 bg-[#0fa57c] hover:bg-[#0c8e6b] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <Upload size={14} /> Import chi phí vận hành
            </button>
          </>
        }
        legend={
          <span className="flex items-center gap-1.5">
            <Info size={12} className="text-blue-500" /> Phân bổ theo chi phí thực tế. Tổng các dòng phân bổ mỗi tháng luôn bằng chi phí vận hành khối tháng đó.
          </span>
        }
      >
        <ReadRow
          label={
            <button onClick={onViewDetail} className="inline-flex items-center gap-1.5 text-slate-700 hover:text-blue-600 cursor-pointer" title="Xem chi tiết chi phí vận hành khối">
              <span>Σ Chi phí vận hành khối {khoi}</span>
              <Eye size={13} className="text-blue-500" />
            </button>
          }
          values={overhead}
        />
        <tr>
          <td colSpan={14} className="px-4 py-2 bg-slate-100/70 text-[10px] font-black text-slate-400 uppercase tracking-wider sticky left-0">
            ↳ Phân bổ về dự án
          </td>
        </tr>
        {projects.map((p) => (
          <ReadRow
            key={p.id}
            label={
              <span className="flex flex-col">
                <span className="font-mono text-[11px] text-blue-600">{p.code}</span>
                <span className="text-[10px] text-slate-400 font-normal">{p.name}</span>
              </span>
            }
            values={allocation[p.id]}
            tone={() => 'text-amber-600'}
          />
        ))}
      </GridShell>
      
      <AnimatePresence>
        {showImport && <OverheadImportModal isOpen={showImport} onClose={() => setShowImport(false)} onImport={() => alert('Đã import thành công!')} />}
      </AnimatePresence>
    </>
  );
};

// ==========================================================================
// TAB 4 — Dòng tiền (đúng mẫu)
// ==========================================================================
const CashflowForm: React.FC<{
  project: ProjectMeta;
  fin: Finance;
  setCell: (f: keyof Finance, i: number, v: number) => void;
  onSave: () => void;
  readOnly?: boolean;
  workload?: number[];
}> = ({ project, fin, setCell, onSave, readOnly, workload }) => {
  const net = MONTHS.map((_, i) => fin.cashIn[i] - fin.cashOut[i]); // chênh lệch thu - chi
  // Luỹ kế: kỳ trước[m] = luỹ kế dòng tiền[m-1] (m=1 -> carryPrev)
  const carryPrev: number[] = [];
  const running: number[] = [];
  let acc = fin.carryPrev;
  MONTHS.forEach((_, i) => {
    carryPrev[i] = acc;
    acc = acc + net[i];
    running[i] = acc;
  });

  return (
    <>
      <SummaryStrip
        items={[
          { label: 'Tổng thu', value: fmt(sum(fin.cashIn)), tone: 'success' },
          { label: 'Tổng chi', value: fmt(sum(fin.cashOut)), tone: 'danger' },
          { label: 'Dòng tiền thuần', value: fmt(sum(net)), tone: sum(net) >= 0 ? 'success' : 'danger' },
          { label: 'Luỹ kế cuối kỳ', value: fmt(running[11]), tone: running[11] >= 0 ? 'success' : 'danger' },
        ]}
      />
      <GridShell
        title={`Dòng tiền — ${project.code}`}
        subtitle="Cập nhật dòng tiền thu/chi thực nhận từng tháng của dự án."
        readOnly={readOnly}
        legend="Chênh lệch thu-chi = Dòng thu − Dòng chi. Luỹ kế dòng tiền = Luỹ kế kỳ trước + Chênh lệch trong kỳ."
      >
        <EditRow label="Dòng thu" values={fin.cashIn} onChange={(i, v) => setCell('cashIn', i, v)} tone="in" readOnly={true} />
        <EditRow label="Dòng chi" values={fin.cashOut} onChange={(i, v) => setCell('cashOut', i, v)} tone="out" readOnly={true} />
        <ReadRow label="Chênh lệch thu - chi" values={net} tone={diffTone} bold />
        <tr>
          <td className="px-4 py-2.5 sticky left-0 bg-inherit z-10 font-semibold text-slate-600">
            Luỹ kế kỳ trước
          </td>
          {carryPrev.map((v, i) => (
            <td key={i} className={i === 0 && !readOnly ? "px-2 py-1" : "px-2 py-2.5 text-right font-mono text-slate-800"}>
              {i === 0 && !readOnly ? (
                <div className="flex justify-end">
                  <div className="w-[72px]">
                    <EditCell value={fin.carryPrev} onChange={(nv) => setCell('carryPrev', 0, nv)} />
                  </div>
                </div>
              ) : (
                <span className="text-slate-500">{fmt(v)}</span>
              )}
            </td>
          ))}
          <td className="px-3 py-2.5 text-right font-mono font-black bg-indigo-50/60 text-indigo-700">
            {fmt(fin.carryPrev)}
          </td>
        </tr>
        <ReadRow label="Luỹ kế dòng tiền" values={running} bold tone={(v) => (v >= 0 ? 'text-emerald-600' : 'text-rose-600')} total={running[11]} />
        {workload && <ReadRow label="Khối lượng công việc (%)" values={workload} suffix="%" total={sum(workload)} />}
      </GridShell>
    </>
  );
};

// ==========================================================================
// Dải KPI tóm tắt
// ==========================================================================
const SummaryStrip: React.FC<{ items: { label: string; value: string; tone: 'default' | 'success' | 'danger' | 'warning' }[] }> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((s, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs px-4 py-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
            <BarChart3 size={11} /> {s.label}
          </p>
          <p className="text-xl font-black font-mono text-indigo-700">{s.value}</p>
          <p className="text-[10px] text-slate-400 font-medium">{s.value.includes('%') ? 'so với kế hoạch' : 'triệu VNĐ'}</p>
        </div>
      ))}
    </div>
  );
};

// ==========================================================================
// MODAL IMPORT DOANH THU TỪ EXCEL
// ==========================================================================
const ImportFileModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
}> = ({ isOpen, onClose, onImport }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Upload className="text-[#0fa57c]" size={20} />
            Import Doanh Thu Thực Tế
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 bg-white flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-slate-700">1. Tải file mẫu import</p>
            <p className="text-xs text-slate-500">Vui lòng tải và sử dụng định dạng chuẩn để nhập dữ liệu doanh thu chính xác.</p>
            <button className="w-fit px-4 py-2 mt-1 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer">
              <DownloadCloud size={16} /> Tải file mẫu (.xlsx)
            </button>
          </div>
          
          <div className="h-px bg-slate-100 w-full" />
          
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-slate-700">2. Chọn file excel import</p>
            <label className="mt-1 flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp size={24} className="text-slate-400 mb-2" />
                <p className="text-xs text-slate-500 font-medium text-center px-4">
                  {fileName ? (
                    <span className="text-[#0fa57c] font-bold flex items-center gap-1 justify-center"><FileText size={14}/> {fileName}</span>
                  ) : (
                    <span>Nhấn để chọn hoặc kéo thả file excel vào đây</span>
                  )}
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".xlsx, .xls, .csv" 
                onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
              />
            </label>
          </div>
        </div>
        
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
            Hủy bỏ
          </button>
          <button 
            onClick={() => {
              if (!fileName) {
                alert('Vui lòng chọn file excel trước khi thực hiện import!');
                return;
              }
              onImport();
              onClose();
            }}
            className="px-5 py-2 bg-[#0fa57c] hover:bg-[#0c8e6b] text-white text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Upload size={16} /> Thực hiện Import
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================================================
// MODAL CHI TIẾT IMPORT DOANH THU
// ==========================================================================
const MOCK_IMPORT_DETAILS = [
  { id: 1, date: '15/08/2026', desc: 'Doanh thu HĐ tư vấn ADB đợt 1', amount: 2358608000, target: 'Ngân hàng Phát triển Châu Á', projCode: 'X.25.NB.ADB', projName: 'Dự án tư vấn y tế', unitCode: 'BFSI', unitName: 'BFSI', version: 'v21', user: 'admin' },
  { id: 2, date: '10/08/2026', desc: 'Nghiệm thu phần mềm', amount: 405541000, target: 'Bệnh viện Vinmec', projCode: 'X.25.NB.ADB', projName: 'Dự án tư vấn y tế', unitCode: 'G1', unitName: 'Khối G1', version: 'v12', user: 'admin' },
  { id: 3, date: '02/08/2026', desc: 'Doanh thu bảo trì tháng 8', amount: 7626841000, target: 'Bệnh viện Bạch Mai', projCode: 'X.25.NB.ADB', projName: 'Dự án tư vấn y tế', unitCode: 'G2', unitName: 'Khối G2', version: 'v20', user: 'Đào Thị A' },
  { id: 4, date: '25/07/2026', desc: 'Khảo sát và thiết kế', amount: 14467733000, target: 'Bộ Y tế', projCode: 'X.25.NB.ADB', projName: 'Dự án tư vấn y tế', unitCode: 'BO', unitName: 'Back Office', version: 'v15', user: 'Đào Thị A' },
  { id: 5, date: '20/07/2026', desc: 'Triển khai hạ tầng', amount: 703024000, target: 'Sở Y tế Hà Nội', projCode: 'X.25.NB.ADB', projName: 'Dự án tư vấn y tế', unitCode: 'G4', unitName: 'Khối G4', version: 'v15', user: 'Đào Thị A' },
];

const ImportDetailView: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl w-full h-[calc(100vh-80px)] flex flex-col overflow-hidden border border-slate-200">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer mr-1">
            <ArrowLeft size={18} />
          </button>
          <FileSpreadsheet className="text-[#0fa57c]" size={20} />
          <h2 className="text-lg font-black text-slate-800">Chi Tiết Import Doanh Thu</h2>
        </div>
      </div>
      
      <div className="p-4 bg-white flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer">
              <Download size={14} /> Xuất Excel theo bộ lọc
            </button>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer">
                <History size={14} /> Lịch sử import
              </button>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Tìm theo tên, mã tổng, gói thầu" 
                  className="pl-3 pr-8 py-1.5 w-64 text-xs font-medium bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold" />
              </div>
              <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer">
                <ListFilter size={14} /> Chọn cột
              </button>
              <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer">
                <FilterX size={14} /> Xóa lọc cột
              </button>
            </div>
          </div>
          
          {/* Table */}
          <div className="border border-slate-200 rounded-lg overflow-auto flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr className="text-[11px] font-bold text-slate-600 border-b border-slate-200">
                  <th className="px-3 py-2.5 border-r border-slate-200 text-center w-10">#</th>
                  {['Ngày hạch toán', 'Diễn giải', 'Số tiền', 'Tên đối tượng', 'Mã công trình', 'Tên công trình', 'Mã khối', 'Tên khối', 'Version', 'Người thực hiện'].map((col, i) => (
                    <th key={col} className="px-3 py-2.5 border-r border-slate-200 last:border-r-0">
                      <div className="flex items-center justify-between gap-2">
                        <span>{col}</span>
                        <div className="flex items-center gap-1 text-slate-400">
                          {i === 0 || i === 2 ? <ArrowUpDown size={12} className="cursor-pointer hover:text-blue-600" /> : null}
                          <Filter size={12} className="cursor-pointer hover:text-blue-600" />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                {MOCK_IMPORT_DETAILS.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-3 py-2.5 border-r border-slate-200 text-center font-medium">{idx + 1}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200 font-bold text-slate-700">{row.date}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200">{row.desc}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200 font-bold text-orange-600 text-right">{row.amount.toLocaleString('vi-VN')}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200">{row.target}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200 font-bold text-blue-600">{row.projCode}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200">{row.projName}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200 font-bold text-blue-600">{row.unitCode}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200">{row.unitName}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200 text-center">
                      <span className="font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{row.version}</span>
                    </td>
                    <td className="px-3 py-2.5">{row.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

// ==========================================================================
// MODAL CHI TIẾT CHI PHÍ VẬN HÀNH KHỐI
// ==========================================================================
const OverheadDetailView: React.FC<{
  onBack?: () => void;
  khoi: string;
}> = ({ onBack, khoi }) => {
  const [search, setSearch] = useState('');
  
  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (OVERHEAD_DETAIL[khoi] || []).filter((it) => {
      return !q || `${it.desc} ${it.unit} ${it.month}`.toLowerCase().includes(q);
    });
  }, [khoi, search]);
  
  const total = items.reduce((s, x) => s + x.amount, 0);

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full h-[calc(100vh-80px)] flex flex-col overflow-hidden border border-slate-200">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer mr-1">
              <ArrowLeft size={18} />
            </button>
          )}
          <Building2 className="text-blue-500" size={20} />
          <h2 className="text-lg font-black text-slate-800">Chi Tiết Chi Phí Vận Hành Khối {khoi}</h2>
        </div>
      </div>
      
      <div className="p-4 bg-white flex flex-col gap-4 flex-1 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer">
              <Download size={14} /> Xuất Excel theo bộ lọc
            </button>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer">
                <History size={14} /> Lịch sử import
              </button>
              <div className="relative">
                <input 
                  type="text" 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Tìm diễn giải, mã đơn vị..." 
                  className="pl-3 pr-8 py-1.5 w-64 text-xs font-medium bg-white border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold" />
              </div>
              <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer">
                <ListFilter size={14} /> Chọn cột
              </button>
              <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer">
                <FilterX size={14} /> Xóa lọc cột
              </button>
            </div>
          </div>
          
          {/* Table */}
          <div className="border border-slate-200 rounded-lg overflow-auto flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
              <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr className="text-[11px] font-bold text-slate-600 border-b border-slate-200">
                  <th className="px-3 py-2.5 border-r border-slate-200 text-center w-10">#</th>
                  {['Diễn giải', 'Số tiền', 'Mã đơn vị', 'Tháng', 'Version', 'Người import'].map((col) => (
                    <th key={col} className={`px-3 py-2.5 border-r border-slate-200 last:border-r-0 ${col === 'Số tiền' ? 'text-right' : col === 'Tháng' || col === 'Version' ? 'text-center' : ''}`}>
                      <div className={`flex items-center gap-2 ${col === 'Số tiền' ? 'justify-end' : col === 'Tháng' || col === 'Version' ? 'justify-center' : 'justify-between'}`}>
                        <span>{col}</span>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Filter size={12} className="cursor-pointer hover:text-blue-600" />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                {items.map((row, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-3 py-2.5 border-r border-slate-200 text-center font-medium">{idx + 1}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200">{row.desc}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200 font-bold text-orange-600 text-right">{row.amount.toLocaleString('vi-VN')}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200 font-bold text-blue-600">{row.unit}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200 text-center font-mono">{row.month}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200 text-center">
                      <span className="font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{row.version || 'v1'}</span>
                    </td>
                    <td className="px-3 py-2.5">{row.user || 'admin'}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">Không có khoản chi phí phù hợp.</td></tr>
                )}
              </tbody>
              {items.length > 0 && (
                <tfoot className="bg-slate-50 sticky bottom-0 z-10 shadow-[0_-1px_2px_rgba(0,0,0,0.05)]">
                  <tr className="text-indigo-700 font-black text-xs">
                    <td className="px-3 py-2.5 border-r border-slate-200" />
                    <td className="px-3 py-2.5 border-r border-slate-200">Tổng cộng ({items.length} khoản)</td>
                    <td className="px-3 py-2.5 border-r border-slate-200 text-right">{total.toLocaleString('vi-VN')}</td>
                    <td className="px-3 py-2.5 border-r border-slate-200" />
                    <td className="px-3 py-2.5 border-r border-slate-200" />
                    <td className="px-3 py-2.5 border-r border-slate-200" />
                    <td className="px-3 py-2.5" />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
    </div>
  );
};

// ==========================================================================
// MODAL IMPORT CHI PHÍ VẬN HÀNH
// ==========================================================================
const OverheadImportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
}> = ({ isOpen, onClose, onImport }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Upload className="text-[#0fa57c]" size={20} />
            Import Chi Phí Vận Hành
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 bg-white flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-slate-700">1. Tải file mẫu import</p>
            <p className="text-xs text-slate-500">Vui lòng tải và sử dụng định dạng chuẩn để nhập dữ liệu chi phí vận hành chính xác.</p>
            <button className="w-fit px-4 py-2 mt-1 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer">
              <DownloadCloud size={16} /> Tải file mẫu (.xlsx)
            </button>
          </div>
          
          <div className="h-px bg-slate-100 w-full" />
          
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-slate-700">2. Chọn file excel import</p>
            <label className="mt-1 flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp size={24} className="text-slate-400 mb-2" />
                <p className="text-xs text-slate-500 font-medium text-center px-4">
                  {fileName ? (
                    <span className="text-[#0fa57c] font-bold flex items-center gap-1 justify-center"><FileText size={14}/> {fileName}</span>
                  ) : (
                    <span>Nhấn để chọn hoặc kéo thả file excel vào đây</span>
                  )}
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".xlsx, .xls, .csv" 
                onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
              />
            </label>
          </div>
        </div>
        
        <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
            Hủy bỏ
          </button>
          <button 
            onClick={() => {
              if (!fileName) {
                alert('Vui lòng chọn file excel trước khi thực hiện import!');
                return;
              }
              onImport();
              onClose();
            }}
            className="px-5 py-2 bg-[#0fa57c] hover:bg-[#0c8e6b] text-white text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Upload size={16} /> Thực hiện Import
          </button>
        </div>
      </motion.div>
    </div>
  );
};

