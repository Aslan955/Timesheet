/**
 * bizReport — tính toán cho "Báo cáo hiệu quả dự án" (BizReportPage).
 *
 * Nguồn số liệu (theo tháng, VNĐ):
 *   • Kế hoạch: project.plan   (import trên màn chi tiết dự án)
 *   • Thực tế : project.actual (bộ phận kế toán import hằng tháng)
 *
 * 4 chỉ tiêu so sánh:
 *   Doanh thu = revenue · Chi phí = costSx + costKd · Dòng tiền thu = cashIn · KLCV = workload
 *
 * Kỳ so sánh: [Từ tháng, min(Đến tháng, Chốt số đến)] — kế hoạch chỉ tính tới tháng chốt số
 * để so cùng kỳ với thực tế. "Chốt số đến" = tháng mới nhất có số thực tế.
 */
import { BizMonthRow, BizProject, monthsBetween } from './BusinessProjectContext';

export type ReportMetric = 'revenue' | 'cost' | 'cashIn' | 'workload';
export const REPORT_METRICS: { key: ReportMetric; label: string; money: boolean }[] = [
  { key: 'revenue', label: 'Doanh thu', money: true },
  { key: 'cost', label: 'Chi phí', money: true },
  { key: 'cashIn', label: 'Dòng tiền thu', money: true },
  { key: 'workload', label: 'Khối lượng công việc', money: false },
];
/** Chi phí: vượt kế hoạch là xấu → đảo chiều màu tốt / xấu. */
export const lowerIsBetter = (k: ReportMetric) => k === 'cost';

export const metricOf = (r: BizMonthRow, k: ReportMetric) => (k === 'cost' ? r.costSx + r.costKd : r[k]);

export type Totals = Record<ReportMetric, number>;
const zero = (): Totals => ({ revenue: 0, cost: 0, cashIn: 0, workload: 0 });

export const sumRange = (rows: BizMonthRow[], from: string, to: string): Totals => {
  const t = zero();
  rows.forEach((r) => {
    if (r.month < from || r.month > to) return;
    REPORT_METRICS.forEach(({ key }) => (t[key] += metricOf(r, key)));
  });
  return t;
};

export const addTotals = (a: Totals, b: Totals): Totals => {
  const t = zero();
  REPORT_METRICS.forEach(({ key }) => (t[key] = a[key] + b[key]));
  return t;
};

export const margin = (t: Totals) => (t.revenue ? (t.revenue - t.cost) / t.revenue : null);
export const ratio = (actual: number, plan: number) => (plan ? actual / plan : null);

// ==========================================================================
// Sức khoẻ dự án
// ==========================================================================
export type Health = 'Tốt' | 'Theo dõi' | 'Cần chú ý' | 'Chưa phát sinh';
export const HEALTHS: Health[] = ['Tốt', 'Cần chú ý', 'Theo dõi', 'Chưa phát sinh'];

/** Ngưỡng theo sheet "Tổng quan cả khối"; KLCV chưa tính (chờ chốt ngưỡng). */
export const HEALTH_RULES: Record<Health, string> = {
  'Tốt': 'Doanh thu ≥ 95% KH, Chi phí ≤ 100% KH, Dòng tiền thu ≥ 95% KH',
  'Cần chú ý': 'Doanh thu ≤ 85% KH, hoặc Chi phí ≥ 130% KH, hoặc Dòng tiền thu ≤ 65% KH',
  'Theo dõi': 'Các trường hợp còn lại (vd Doanh thu 85–95%, Chi phí 100–130%, Dòng tiền 65–95%)',
  'Chưa phát sinh': 'Chưa có số thực tế trong kỳ báo cáo',
};

export const healthOf = (plan: Totals, actual: Totals, hasActual: boolean): Health => {
  if (!hasActual) return 'Chưa phát sinh';
  const rev = ratio(actual.revenue, plan.revenue);
  const cost = ratio(actual.cost, plan.cost);
  const cash = ratio(actual.cashIn, plan.cashIn);
  if ((rev !== null && rev <= 0.85) || (cost !== null && cost >= 1.3) || (cash !== null && cash <= 0.65)) return 'Cần chú ý';
  if ((rev === null || rev >= 0.95) && (cost === null || cost <= 1) && (cash === null || cash >= 0.95)) return 'Tốt';
  return 'Theo dõi';
};

export interface ProjectPerf {
  project: BizProject;
  plan: Totals;
  actual: Totals;
  health: Health;
}

/** Kế hoạch & thực tế của 1 dự án trong kỳ [from, min(to, cutoff)]. */
export const projectPerf = (p: BizProject, from: string, to: string, cutoff: string): ProjectPerf => {
  const end = cutoff && cutoff < to ? cutoff : to;
  const plan = sumRange(p.plan, from, end);
  const actual = sumRange(p.actual, from, end);
  const hasActual = p.actual.some((r) => r.month >= from && r.month <= end);
  return { project: p, plan, actual, health: healthOf(plan, actual, hasActual) };
};

// ==========================================================================
// Theo tháng
// ==========================================================================
export interface MonthPoint {
  month: string;
  plan: number;
  actual: number | null; // null = sau tháng chốt số
}

/** Chuỗi tháng [from, to] của 1 chỉ tiêu, cộng dồn trên nhiều dự án. */
export const monthlySeries = (projects: BizProject[], k: ReportMetric, from: string, to: string, cutoff: string): MonthPoint[] =>
  monthsBetween(`${from}-01`, `${to}-01`).map((month) => {
    const pick = (rows: BizMonthRow[]) => rows.filter((r) => r.month === month).reduce((s, r) => s + metricOf(r, k), 0);
    return {
      month,
      plan: projects.reduce((s, p) => s + pick(p.plan), 0),
      actual: cutoff && month <= cutoff ? projects.reduce((s, p) => s + pick(p.actual), 0) : null,
    };
  });

/** Tháng đầu / cuối có số liệu (kế hoạch hoặc thực tế) của dự án. */
export const projectMonthRange = (p: BizProject): [string, string] => {
  const all = [...p.plan, ...p.actual].map((r) => r.month).sort();
  return all.length ? [all[0], all[all.length - 1]] : [p.startDate.slice(0, 7), p.endDate.slice(0, 7)];
};
