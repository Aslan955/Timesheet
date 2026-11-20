/**
 * Báo cáo tổng kết khi đóng dự án — so sánh Kế hoạch / Thực tế:
 * doanh thu, chi phí (theo khoản), lãi / lỗ, dòng tiền, thời gian hoàn thành.
 * Kế hoạch = số kế hoạch theo tháng đã import; dự án chưa có kế hoạch tháng ⇒ lấy PAKD đã duyệt.
 */
import { BizCloseRequest, BizProject, CloseExtraCost, CloseExtraKey, PAKD_STEP_LABEL, plannedCost, sumRows, totalCost } from './BusinessProjectContext';

export type CloseGroup = 'pl' | 'cash';
export interface CloseLine {
  key: string;
  group: CloseGroup;
  label: string;
  plan: number | null; // null ⇒ kế hoạch không có khoản này
  actual: number;
  level: 0 | 1;
  bold?: boolean;
  pct?: boolean; // tỷ lệ % (plan / actual là số thập phân)
  lowerBetter?: boolean;
  /** Không tính % TT / KH (chỉ tiêu có thể âm: lãi / lỗ, dòng tiền thuần, công nợ). */
  noRatio?: boolean;
  /** Khoản Kế toán nhập ở bước duyệt đóng dự án */
  extra?: CloseExtraKey;
}
export interface CloseMonth {
  month: string;
  planRevenue: number;
  actualRevenue: number;
  planCost: number;
  actualCost: number;
  planCash: number;
  actualCash: number;
  net: number; // dòng tiền thuần thực tế trong tháng = thu − chi
  cumNet: number; // luỹ kế
  cumPlanCash: number; // tiền thu luỹ kế kế hoạch đến hết tháng
  cumActualCash: number; // tiền thu luỹ kế thực tế đến hết tháng
  /** Thu luỹ kế TT ÷ KH (null: tháng chưa có số thực tế hoặc KH luỹ kế = 0) */
  cashRatio: number | null;
}
/** Tốc độ dòng tiền về: TB cộng các tháng của (Thu luỹ kế TT ÷ Thu luỹ kế KH); ≥ 100% ⇒ Nhanh, < 100% ⇒ Chậm. */
export interface CashSpeed {
  avg: number | null;
  label: 'Nhanh' | 'Chậm' | 'Chưa đánh giá';
  months: number; // số tháng được tính
  fast: number; // số tháng luỹ kế về ≥ kế hoạch
  slow: number;
}
export const CASH_SPEED_RULE = 'Mỗi tháng: % = Tiền thu luỹ kế thực tế ÷ Tiền thu luỹ kế kế hoạch đến hết tháng (tháng KH luỹ kế = 0 không tính). Tốc độ = trung bình cộng % các tháng có số thực tế: ≥ 100% ⇒ Nhanh, < 100% ⇒ Chậm.';
export interface CloseTime {
  planStart: string;
  planEnd: string;
  actualEnd: string; // ngày đóng (đã đóng) / hôm nay (đang yêu cầu)
  planDays: number;
  actualDays: number;
  /** > 0 trễ, < 0 sớm (ngày) */
  lateDays: number;
}
export interface CloseSummary {
  planSource: 'monthly' | 'pakd';
  lines: CloseLine[];
  months: CloseMonth[];
  time: CloseTime;
  lastActualMonth: string;
  revenue: { plan: number; actual: number };
  cost: { plan: number; actual: number };
  profit: { plan: number; actual: number };
  margin: { plan: number | null; actual: number | null };
  net: { plan: number; actual: number };
  cashSpeed: CashSpeed;
  /** Tổng sổ CP quản lý phân bổ (Kế toán import) — gợi ý khi nhập Chi phí quản lý */
  mgmtLedger: number;
  hasExtra: boolean;
}

const iso = () => new Date().toISOString().slice(0, 10);
const days = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00`) - Date.parse(`${a}T00:00:00`)) / 86_400_000);

/**
 * extra: 3 khoản Kế toán nhập (chi phí tài chính / quản lý / khác) — lấy từ yêu cầu đóng đã duyệt, hoặc số đang nhập (xem trước).
 * Có extra ⇒ Tổng chi phí = SX + KD + chung + VHC phân bổ + 3 khoản (CP quản lý nhập thay cho sổ CP quản lý phân bổ).
 */
export const closeSummary = (p: BizProject, asOf = iso(), extraIn?: Partial<Pick<CloseExtraCost, CloseExtraKey>> | null): CloseSummary => {
  const extra = extraIn === null ? undefined : extraIn || p.closeRequest?.extraCost;
  const monthly = p.plan.length > 0;
  const pr = monthly ? sumRows(p.plan, 'revenue') : p.expectedRevenue;
  const pSx = monthly ? sumRows(p.plan, 'costSx') : p.plannedProductionCost;
  const pKd = monthly ? sumRows(p.plan, 'costKd') : p.plannedBusinessCost;
  const pc = monthly ? pSx + pKd : plannedCost(p);
  const pCash = monthly ? sumRows(p.plan, 'cashIn') : p.expectedRevenue;
  const a = p.actual;
  const sum = (k: 'costChung' | 'costMgmt' | 'costAlloc') => a.reduce((s, r) => s + (r[k] || 0), 0);
  const ar = sumRows(a, 'revenue');
  const aSx = sumRows(a, 'costSx');
  const aKd = sumRows(a, 'costKd');
  const aCh = sum('costChung');
  const aMg = sum('costMgmt');
  const aAl = sum('costAlloc');
  const ex = extra ? { finance: extra.finance || 0, mgmt: extra.mgmt || 0, other: extra.other || 0 } : null;
  const ac = aSx + aKd + aCh + aAl + (ex ? ex.finance + ex.mgmt + ex.other : aMg);
  const aCash = sumRows(a, 'cashIn');
  const m = (x: number, rev: number) => (rev ? (x / rev) : null);

  const lines: CloseLine[] = [
    { key: 'rev', group: 'pl', label: 'Doanh thu', plan: pr, actual: ar, level: 0, bold: true },
    { key: 'cost', group: 'pl', label: 'Tổng chi phí', plan: pc, actual: ac, level: 0, bold: true, lowerBetter: true },
    { key: 'sx', group: 'pl', label: 'Chi phí sản xuất (mã SX .2)', plan: pSx, actual: aSx, level: 1, lowerBetter: true },
    { key: 'kd', group: 'pl', label: 'Chi phí kinh doanh (mã KD .1)', plan: pKd, actual: aKd, level: 1, lowerBetter: true },
    { key: 'chung', group: 'pl', label: 'Chi phí chung', plan: null, actual: aCh, level: 1, lowerBetter: true },
    ...(ex
      ? ([
          { key: 'finance', group: 'pl', label: 'Chi phí tài chính', plan: null, actual: ex.finance, level: 1, lowerBetter: true, extra: 'finance' },
          { key: 'mgmt', group: 'pl', label: 'Chi phí quản lý', plan: null, actual: ex.mgmt, level: 1, lowerBetter: true, extra: 'mgmt' },
          { key: 'other', group: 'pl', label: 'Chi phí khác', plan: null, actual: ex.other, level: 1, lowerBetter: true, extra: 'other' },
        ] as CloseLine[])
      : []),
    { key: 'profit', group: 'pl', label: 'Lợi nhuận gộp', plan: pr - pc, actual: ar - ac, level: 0, bold: true, noRatio: true },
    { key: 'margin', group: 'pl', label: 'Tỷ suất lợi nhuận gộp', plan: m(pr - pc, pr), actual: m(ar - ac, ar) ?? 0, level: 0, pct: true },
    { key: 'in', group: 'cash', label: 'Tiền thu về', plan: pCash, actual: aCash, level: 0 },
    { key: 'out', group: 'cash', label: 'Tiền chi ra', plan: pc, actual: ac, level: 0, lowerBetter: true },
    { key: 'net', group: 'cash', label: 'Dòng tiền thuần (Thu − Chi)', plan: pCash - pc, actual: aCash - ac, level: 0, bold: true, noRatio: true },
    { key: 'ar', group: 'cash', label: 'Công nợ phải thu (Doanh thu − Tiền thu)', plan: pr - pCash, actual: ar - aCash, level: 0, lowerBetter: true, noRatio: true },
  ];

  const keys = [...new Set([...p.plan.map((r) => r.month), ...a.map((r) => r.month)])].sort();
  let cum = 0;
  let cumP = 0;
  let cumA = 0;
  const lastA = a.reduce((mm, r) => (r.month > mm ? r.month : mm), '');
  const months: CloseMonth[] = keys.map((month) => {
    const pl = p.plan.find((r) => r.month === month);
    const ac0 = a.find((r) => r.month === month);
    const net = ac0 ? ac0.cashIn - totalCost(ac0) : 0;
    cum += net;
    cumP += pl?.cashIn || 0;
    cumA += ac0?.cashIn || 0;
    const cashRatio = month <= lastA && cumP > 0 ? cumA / cumP : null;
    return {
      month,
      planRevenue: pl?.revenue || 0,
      actualRevenue: ac0?.revenue || 0,
      planCost: pl ? totalCost(pl) : 0,
      actualCost: ac0 ? totalCost(ac0) : 0,
      planCash: pl?.cashIn || 0,
      actualCash: ac0?.cashIn || 0,
      net,
      cumNet: cum,
      cumPlanCash: cumP,
      cumActualCash: cumA,
      cashRatio,
    };
  });
  const rated = months.filter((x) => x.cashRatio !== null);
  const avg = rated.length ? rated.reduce((t, x) => t + x.cashRatio!, 0) / rated.length : null;
  const cashSpeed: CashSpeed = {
    avg,
    label: avg === null ? 'Chưa đánh giá' : avg >= 1 ? 'Nhanh' : 'Chậm',
    months: rated.length,
    fast: rated.filter((x) => x.cashRatio! >= 1).length,
    slow: rated.filter((x) => x.cashRatio! < 1).length,
  };

  const planStart = p.startDate || p.contract?.from || '';
  const planEnd = p.endDate || p.contract?.to || '';
  const actualEnd = p.status === 'Kết thúc' && p.closedAt ? p.closedAt : asOf;
  const time: CloseTime = {
    planStart,
    planEnd,
    actualEnd,
    planDays: planStart && planEnd ? days(planStart, planEnd) + 1 : 0,
    actualDays: planStart ? days(planStart, actualEnd) + 1 : 0,
    lateDays: planEnd ? days(planEnd, actualEnd) : 0,
  };

  return {
    planSource: monthly ? 'monthly' : 'pakd',
    lines,
    months,
    time,
    lastActualMonth: a.reduce((mm, r) => (r.month > mm ? r.month : mm), ''),
    revenue: { plan: pr, actual: ar },
    cost: { plan: pc, actual: ac },
    profit: { plan: pr - pc, actual: ar - ac },
    margin: { plan: m(pr - pc, pr), actual: m(ar - ac, ar) },
    mgmtLedger: aMg,
    hasExtra: !!ex,
    net: { plan: pCash - pc, actual: aCash - ac },
    cashSpeed,
  };
};

/** Chênh lệch tốt / xấu theo chiều của chỉ tiêu. */
export const lineTone = (l: CloseLine): 'good' | 'bad' | 'neutral' => {
  if (l.plan === null) return 'neutral';
  const d = l.actual - l.plan;
  if (Math.abs(d) < 1e-9) return 'neutral';
  return (l.lowerBetter ? d < 0 : d > 0) ? 'good' : 'bad';
};

export const timeText = (t: CloseTime) => (t.lateDays > 0 ? `Trễ ${t.lateDays} ngày` : t.lateDays < 0 ? `Sớm ${-t.lateDays} ngày` : 'Đúng hạn');


/** Các bước duyệt hiển thị (Yêu cầu → GĐ khối → Kế toán → BOD) kèm người / thời điểm. */
export const closeTrack = (c?: BizCloseRequest) => {
  const steps = ['Yêu cầu', 'GĐK', 'CFO', 'BOD'] as const;
  return steps.map((s) => {
    const label = s === 'Yêu cầu' ? 'Yêu cầu đóng' : PAKD_STEP_LABEL[s];
    if (!c) return { step: s, label, state: 'todo' as const };
    // Lấy lần ghi gần nhất của bước (tính từ lần gửi cuối)
    const hit = [...c.log].reverse().find((x) => x.step === s);
    if (hit) return { step: s, label, state: hit.approve ? ('done' as const) : ('reject' as const), by: hit.by, at: hit.at, note: hit.note };
    if (s === 'GĐK' && c.role !== 'AM') return { step: s, label, state: 'skip' as const };
    const cur = c.state === `Chờ ${s}`;
    return { step: s, label, state: cur ? ('current' as const) : ('todo' as const) };
  });
};
