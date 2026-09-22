/**
 * CompanyOverviewPage — "Báo cáo Toàn cảnh Thu Chi Công ty".
 *
 * Dành cho Tổng Giám đốc / Kế toán: so sánh 6 khối (G1, G2, G3, G4, BFSI, GPDV)
 * theo dạng 6 cột + cột Toàn công ty. Các hàng là chỉ tiêu tài chính.
 *
 * Quy ước màu (ít màu): các con số để màu đen; chỉ TỔNG (cột Toàn công ty,
 * KPI tổng) dùng màu nhấn.
 *
 * Đơn vị: triệu VNĐ.
 */
import React, { useMemo, useState } from 'react';
import { Grid, ChevronRight, TrendingUp, TrendingDown, Wallet, Layers, Crown, BarChart3, FileSpreadsheet } from 'lucide-react';
import { useFinancePlans, sum12 } from '../finance/FinancePlanContext';

const YEARS = [2025, 2026, 2027];
const fmt = (n: number) => (n ? Math.round(n).toLocaleString('vi-VN') : '–');
const pct = (n: number) => `${Math.round(n)}%`;

// Màu nhấn duy nhất cho TỔNG
const TOTAL = 'text-indigo-700';

const KHOIS: { key: string; label: string }[] = [
  { key: 'G1', label: 'G1' },
  { key: 'G2', label: 'G2' },
  { key: 'G3', label: 'G3' },
  { key: 'G4', label: 'G4' },
  { key: 'BFSI', label: 'BFSI' },
  { key: 'Giải pháp - Dịch vụ', label: 'GPDV' },
];

// Tỷ lệ thực hiện (minh hoạ) theo khối: [tỷ lệ doanh thu, tỷ lệ chi phí]
const RATIO: Record<string, [number, number]> = {
  G1: [0.92, 1.02],
  G2: [0.8, 0.95],
  G3: [1.05, 0.98],
  G4: [0.7, 1.1],
  BFSI: [1.0, 1.0],
  'Giải pháp - Dịch vụ': [0.95, 1.03],
};

interface Metrics {
  key: string;
  label: string;
  revPlan: number;
  revActual: number;
  costPlan: number;
  costActual: number;
  profitPlan: number;
  profitActual: number;
  workload: number;
  projects: number;
}

export const CompanyOverviewPage: React.FC = () => {
  const { getBlock } = useFinancePlans();
  const [year, setYear] = useState(2026);

  const data: Metrics[] = useMemo(() => {
    return KHOIS.map(({ key, label }) => {
      const b = getBlock(key, year);
      const revPlan = b ? b.projects.reduce((s, p) => s + sum12(p.revenue), 0) : 0;
      const costPlan = b ? b.projects.reduce((s, p) => s + sum12(p.expense), 0) : 0;
      const workload = b ? b.projects.reduce((s, p) => s + (p.workload || 0), 0) : 0;
      const projects = b ? b.projects.length : 0;
      const [rr, cr] = RATIO[key] || [1, 1];
      const revActual = Math.round(revPlan * rr);
      const costActual = Math.round(costPlan * cr);
      return {
        key, label, revPlan, revActual, costPlan, costActual,
        profitPlan: revPlan - costPlan,
        profitActual: revActual - costActual,
        workload, projects,
      };
    });
  }, [getBlock, year]);

  const totals = useMemo(() => {
    const t: Metrics = { key: 'ALL', label: 'TOÀN CÔNG TY', revPlan: 0, revActual: 0, costPlan: 0, costActual: 0, profitPlan: 0, profitActual: 0, workload: 0, projects: 0 };
    data.forEach((d) => {
      t.revPlan += d.revPlan; t.revActual += d.revActual; t.costPlan += d.costPlan; t.costActual += d.costActual;
      t.profitPlan += d.profitPlan; t.profitActual += d.profitActual; t.workload += d.workload; t.projects += d.projects;
    });
    return t;
  }, [data]);

  const revComplete = totals.revPlan > 0 ? (totals.revActual / totals.revPlan) * 100 : 0;
  const maxRev = Math.max(...data.map((d) => Math.max(d.revPlan, d.revActual)), 1);

  return (
    <div className="p-4 sm:p-6 bg-slate-50/50 min-h-screen space-y-4 font-sans">
      {/* Breadcrumb + tiêu đề */}
      <div className="pb-2 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
        <div>
          <div className="flex items-center text-xs text-slate-500 gap-1.5 font-medium">
            <Grid size={13} className="text-slate-400" />
            <span>Quản lý dự án</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-900 font-bold">Toàn cảnh thu chi công ty</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-1 flex items-center gap-2.5">
            <span>Báo Cáo Toàn Cảnh Thu Chi Công Ty</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-600 border border-amber-200 inline-flex items-center gap-1">
              <Crown size={11} /> Tổng Giám đốc
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">So sánh 6 khối · Đơn vị: <strong>triệu VNĐ</strong></p>
        </div>
        <div className="flex items-center gap-2.5">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer shadow-xs"
          >
            {YEARS.map((y) => <option key={y} value={y}>Năm {y}</option>)}
          </select>
          <button className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer">
            <FileSpreadsheet size={14} className="text-slate-400" /> Export XLSX
          </button>
        </div>
      </div>

      {/* KPI toàn công ty (đây là các số TỔNG → dùng màu nhấn) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Kpi icon={<TrendingUp size={12} />} label="Doanh thu KH" value={fmt(totals.revPlan)} />
        <Kpi icon={<TrendingUp size={12} />} label="Doanh thu TT" value={fmt(totals.revActual)} />
        <Kpi icon={<TrendingDown size={12} />} label="Chi phí TT" value={fmt(totals.costActual)} />
        <Kpi icon={<Wallet size={12} />} label="Lợi nhuận TT" value={fmt(totals.profitActual)} />
        <Kpi icon={<BarChart3 size={12} />} label="% hoàn thành thu" value={pct(revComplete)} unit="so với KH" />
      </div>

      {/* Bảng so sánh 6 khối */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
          <Layers size={15} className="text-slate-400" />
          <h3 className="text-sm font-black text-slate-800">Bảng so sánh chỉ tiêu theo khối</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[980px]">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                <th className="px-4 py-3 sticky left-0 bg-slate-100/80 z-10 min-w-[220px]">Chỉ tiêu</th>
                {data.map((d) => (
                  <th key={d.key} className="px-3 py-3 text-right min-w-[104px]">{d.label}</th>
                ))}
                <th className={`px-4 py-3 text-right min-w-[120px] bg-indigo-50 ${TOTAL}`}>TOÀN CÔNG TY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              <GroupRow label="A. DOANH THU" cols={data.length} />
              <Row label="Doanh thu kế hoạch" data={data} total={totals} pick={(d) => d.revPlan} />
              <Row label="Doanh thu thực tế" data={data} total={totals} pick={(d) => d.revActual} strong />
              <Row label="% hoàn thành KH" data={data} total={totals} pick={(d) => (d.revPlan > 0 ? (d.revActual / d.revPlan) * 100 : 0)} fmtFn={pct} totalValue={revComplete} />

              <GroupRow label="B. CHI PHÍ" cols={data.length} />
              <Row label="Chi phí kế hoạch" data={data} total={totals} pick={(d) => d.costPlan} />
              <Row label="Chi phí thực tế" data={data} total={totals} pick={(d) => d.costActual} strong />
              <Row label="Chênh lệch KH − TT" data={data} total={totals} pick={(d) => d.costPlan - d.costActual} />

              <GroupRow label="C. LỢI NHUẬN" cols={data.length} />
              <Row label="Lợi nhuận kế hoạch" data={data} total={totals} pick={(d) => d.profitPlan} />
              <Row label="Lợi nhuận thực tế" data={data} total={totals} pick={(d) => d.profitActual} strong />
              <Row label="Biên lợi nhuận TT" data={data} total={totals} pick={(d) => (d.revActual > 0 ? (d.profitActual / d.revActual) * 100 : 0)} fmtFn={pct} totalValue={totals.revActual > 0 ? (totals.profitActual / totals.revActual) * 100 : 0} />

              <GroupRow label="D. QUY MÔ" cols={data.length} />
              <Row label="Khối lượng công việc" data={data} total={totals} pick={(d) => d.workload} />
              <Row label="Số dự án" data={data} total={totals} pick={(d) => d.projects} />
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60 text-[11px] text-slate-500">
          Kế hoạch lấy từ khai báo GĐ khối · Thực tế minh hoạ theo tỷ lệ thực hiện từng khối.
        </div>
      </div>

      {/* Biểu đồ so sánh Doanh thu KH vs TT theo khối */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-black text-slate-800 flex items-center gap-2"><BarChart3 size={15} className="text-slate-400" /> Doanh thu Kế hoạch vs Thực tế theo khối</h3>
          <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-slate-300 inline-block" /> Kế hoạch</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" /> Thực tế</span>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3 items-end" style={{ height: 200 }}>
          {data.map((d) => {
            const hPlan = Math.round((d.revPlan / maxRev) * 160);
            const hAct = Math.round((d.revActual / maxRev) * 160);
            return (
              <div key={d.key} className="flex flex-col items-center justify-end gap-1.5 h-full">
                <div className="flex items-end gap-1 h-[160px]">
                  <div className="w-6 rounded-t bg-slate-300 relative" style={{ height: hPlan }} title={`KH: ${fmt(d.revPlan)}`}>
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500 whitespace-nowrap">{fmt(d.revPlan)}</span>
                  </div>
                  <div className="w-6 rounded-t bg-indigo-500 relative" style={{ height: hAct }} title={`TT: ${fmt(d.revActual)}`}>
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-700 whitespace-nowrap">{fmt(d.revActual)}</span>
                  </div>
                </div>
                <span className="text-[11px] font-black text-slate-600">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// Thành phần phụ
// ==========================================================================
const Kpi: React.FC<{ icon: React.ReactNode; label: string; value: string; unit?: string }> = ({ icon, label, value, unit }) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs px-4 py-3">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">{icon} {label}</p>
    <p className={`text-xl font-black font-mono ${TOTAL}`}>{value}</p>
    <p className="text-[10px] text-slate-400 font-medium">{unit || 'triệu VNĐ'}</p>
  </div>
);

const GroupRow: React.FC<{ label: string; cols: number }> = ({ label, cols }) => (
  <tr className="bg-slate-100 border-y border-slate-200 font-black text-slate-600">
    <td className="px-4 py-2 sticky left-0 z-10 bg-slate-100">{label}</td>
    <td colSpan={cols + 1} />
  </tr>
);

interface RowProps {
  label: string;
  data: Metrics[];
  total: Metrics;
  pick: (d: Metrics) => number;
  fmtFn?: (n: number) => string;
  strong?: boolean;
  totalValue?: number;
}
const Row: React.FC<RowProps> = ({ label, data, total, pick, fmtFn = fmt, strong, totalValue }) => (
  <tr className="hover:bg-slate-50/60">
    <td className={`px-4 py-2.5 sticky left-0 bg-white z-10 ${strong ? 'font-black text-slate-800' : 'font-semibold text-slate-600'}`}>{label}</td>
    {data.map((d) => (
      <td key={d.key} className={`px-3 py-2.5 text-right font-mono text-slate-800 ${strong ? 'font-black' : ''}`}>
        {fmtFn(pick(d))}
      </td>
    ))}
    <td className={`px-4 py-2.5 text-right font-mono font-black bg-indigo-50/60 ${TOTAL}`}>
      {fmtFn(totalValue ?? pick(total))}
    </td>
  </tr>
);
