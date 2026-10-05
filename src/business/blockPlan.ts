/**
 * blockPlan — hàm thuần cho màn "Lập kế hoạch khối" (BlockPlanPage) và form import của nó.
 *
 * 4 dòng nhập của mỗi dự án:
 *   revenue  Doanh thu dự kiến
 *   cost     Chi dự kiến  (= costSx + costKd; khi nhập 1 số → tách SX/KD theo tỷ lệ chi phí kế hoạch của dự án)
 *   cashIn   Dòng tiền thu
 *   workload Khối lượng công việc (SP)
 */
import { BizMonthRow, BizProject, monthsBetween } from './BusinessProjectContext';
import { pakdMonthlyPlan } from './pakd';
import { PlanCells, emptyMonth, projectMonthsInYear } from './BlockPlanContext';

export type GridMetric = 'revenue' | 'cost' | 'cashIn' | 'workload';
export const GRID_METRICS: { key: GridMetric; label: string; short: string; cls: string; money: boolean }[] = [
  { key: 'revenue', label: 'Doanh thu dự kiến', short: 'Doanh thu', cls: 'text-emerald-800', money: true },
  { key: 'cost', label: 'Chi dự kiến', short: 'Chi', cls: 'text-rose-800', money: true },
  { key: 'cashIn', label: 'Dòng tiền thu', short: 'Dòng tiền thu', cls: 'text-[#1f5fa8]', money: true },
  { key: 'workload', label: 'Khối lượng công việc (SP)', short: 'KLCV', cls: 'text-indigo-800', money: false },
];

export const metricValue = (r: BizMonthRow | undefined, k: GridMetric) => (!r ? 0 : k === 'cost' ? (r.costSx || 0) + (r.costKd || 0) : r[k] || 0);

/** Tỷ lệ Chi SX trên tổng chi kế hoạch của dự án (dùng để tách 1 số Chi thành SX / KD). */
const sxRatio = (p: Pick<BizProject, 'plannedProductionCost' | 'plannedBusinessCost'>, cur?: BizMonthRow) => {
  const curTotal = (cur?.costSx || 0) + (cur?.costKd || 0);
  if (curTotal > 0) return (cur!.costSx || 0) / curTotal;
  const total = (p.plannedProductionCost || 0) + (p.plannedBusinessCost || 0);
  return total > 0 ? (p.plannedProductionCost || 0) / total : 1;
};

/** Ghi 1 giá trị vào ô (dự án, tháng, chỉ tiêu) — trả về bản sao mới của cells. */
export const setCell = (cells: PlanCells, p: BizProject, month: string, k: GridMetric, value: number): PlanCells => {
  const cur = cells[p.id]?.[month] || emptyMonth(month);
  const next: BizMonthRow = { ...cur };
  const v = Math.max(0, Math.round(value || 0));
  if (k === 'cost') {
    const sx = Math.round(v * sxRatio(p, cur));
    next.costSx = sx;
    next.costKd = v - sx;
  } else next[k] = v;
  return { ...cells, [p.id]: { ...(cells[p.id] || {}), [month]: next } };
};

/** Rải đều `total` cho n tháng; tiền làm tròn tới nghìn, phần dư dồn tháng cuối để tổng khớp tuyệt đối. */
export const spreadEven = (total: number, n: number, money: boolean) => {
  if (n <= 0) return [] as number[];
  const unit = money && total >= 1_000_000 ? 1_000 : 1;
  const each = Math.floor(total / n / unit) * unit;
  return Array.from({ length: n }, (_, i) => (i === n - 1 ? total - each * (n - 1) : each));
};

/**
 * Đọc số người dùng gõ. Nhận:
 *   "1200000" · "1,200,000" · "1.200.000"      → 1 200 000
 *   "1.2 tỷ" / "1,2 ty"  → 1 200 000 000        "500tr" / "500 triệu" → 500 000 000
 *   "35k" / "35 nghìn"   → 35 000               "" / "-"  → 0
 * Trả về null nếu không đọc được.
 */
export const parseAmount = (raw: string): number | null => {
  const t = raw
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/(vnd|dong|d|sp)$/, '');
  if (!t || t === '-' || t === '–') return 0;
  const m = t.match(/^(-?[\d.,]+)(ty|tr|trieu|m|k|nghin|n)?$/);
  if (!m) return null;
  const unit = m[2];
  let num = m[1];
  let mult = 1;
  if (unit) {
    mult = unit === 'ty' ? 1e9 : unit === 'tr' || unit === 'trieu' || unit === 'm' ? 1e6 : 1e3;
    num = num.replace(',', '.');
    if ((num.match(/\./g) || []).length > 1) return null;
  } else if (/^-?\d{1,3}([.,]\d{3})+$/.test(num)) num = num.replace(/[.,]/g, '');
  else num = num.replace(/,/g, '');
  const v = Number(num);
  if (!isFinite(v) || v < 0) return null;
  return Math.round(v * mult);
};

export const fmtNum = (n: number) => (n ? Math.round(n).toLocaleString('en-US') : '');
/** Số ngắn cho trục biểu đồ: 1.2 tỷ · 350 triệu · 35 nghìn. */
export const fmtShort = (v: number) => {
  const a = Math.abs(v);
  if (a >= 1e12) return `${(v / 1e12).toFixed(a >= 1e13 ? 0 : 1).replace(/\.0$/, '')} nghìn tỷ`;
  if (a >= 1e9) return `${(v / 1e9).toFixed(a >= 1e10 ? 0 : 1).replace(/\.0$/, '')} tỷ`;
  if (a >= 1e6) return `${Math.round(v / 1e6)} triệu`;
  if (a >= 1e3) return `${Math.round(v / 1e3)} nghìn`;
  return `${Math.round(v)}`;
};

/** Tổng 1 chỉ tiêu của dự án trong các tháng cho trước. */
export const sumMetric = (cells: PlanCells, pid: string, months: string[], k: GridMetric) =>
  months.reduce((s, m) => s + metricValue(cells[pid]?.[m], k), 0);

/**
 * Lấy kế hoạch từ PAKD của dự án cho các tháng trong năm:
 *   • Dự án đã lập PAKD trên hệ thống → kế hoạch theo tháng sinh từ PAKD.
 *   • Chưa có → rải đều Doanh thu dự kiến / Chi phí SX / Chi phí KD cho toàn bộ thời gian dự án,
 *     Dòng tiền thu = Doanh thu lệch 1 tháng.
 * Không đụng tới Khối lượng công việc.
 */
export const fillFromPakd = (cells: PlanCells, p: BizProject, year: string): PlanCells => {
  const months = projectMonthsInYear(p, year);
  if (!months.length) return cells;
  let src: Map<string, BizMonthRow>;
  if (p.pakdForm) src = new Map(pakdMonthlyPlan(p.pakdForm).map((r) => [r.month, r]));
  else {
    const all = monthsBetween(p.startDate, p.endDate);
    const n = all.length;
    const rev = spreadEven(p.expectedRevenue || 0, n, true);
    const sx = spreadEven(p.plannedProductionCost || 0, n, true);
    const kd = spreadEven(p.plannedBusinessCost || 0, n, true);
    src = new Map(
      all.map((m, i) => [
        m,
        { month: m, revenue: rev[i], cashIn: (i > 0 ? rev[i - 1] : 0) + (i === n - 1 ? rev[i] : 0), costSx: sx[i], costKd: kd[i], workload: 0 },
      ]),
    );
  }
  const mine = { ...(cells[p.id] || {}) };
  months.forEach((m) => {
    const s = src.get(m);
    const cur = mine[m] || emptyMonth(m);
    mine[m] = {
      ...cur,
      revenue: Math.round(s?.revenue || 0),
      cashIn: Math.round(s?.cashIn || 0),
      costSx: Math.round(s?.costSx || 0),
      costKd: Math.round(s?.costKd || 0),
    };
  });
  return { ...cells, [p.id]: mine };
};

/**
 * Dòng tiền thu = Doanh thu của tháng trước (thu tiền sau 1 tháng); tháng cuối dự án thu nốt doanh thu tháng đó.
 * Tháng đầu năm lấy doanh thu tháng 12 năm trước từ kế hoạch đã có của dự án (nếu có).
 */
export const cashFromRevenue = (cells: PlanCells, p: BizProject, year: string): PlanCells => {
  const months = projectMonthsInYear(p, year);
  if (!months.length) return cells;
  const all = monthsBetween(p.startDate, p.endDate);
  const last = all[all.length - 1];
  const planByMonth = new Map(p.plan.map((r) => [r.month, r]));
  const revenueOf = (m: string) => (cells[p.id]?.[m] ? cells[p.id][m].revenue || 0 : planByMonth.get(m)?.revenue || 0);
  const prevMonth = (m: string) => {
    const y = +m.slice(0, 4);
    const mm = +m.slice(5, 7);
    return mm === 1 ? `${y - 1}-12` : `${y}-${String(mm - 1).padStart(2, '0')}`;
  };
  const mine = { ...(cells[p.id] || {}) };
  months.forEach((m) => {
    const prev = prevMonth(m);
    const v = (all.includes(prev) ? revenueOf(prev) : 0) + (m === last ? revenueOf(m) : 0);
    mine[m] = { ...(mine[m] || emptyMonth(m)), cashIn: Math.round(v) };
  });
  return { ...cells, [p.id]: mine };
};

/** Các ô khác nhau giữa 2 bộ số liệu (để tô màu "đã sửa"). */
export const cellChanged = (a: PlanCells, b: PlanCells, pid: string, month: string, k: GridMetric) =>
  metricValue(a[pid]?.[month], k) !== metricValue(b[pid]?.[month], k);
