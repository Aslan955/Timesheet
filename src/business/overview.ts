/**
 * overview.ts — số liệu cho màn "Tổng quan" (module Quản trị dự án & Tài chính),
 * theo mẫu "Gửi Nam - 02.10.26 - Tổng quan.xlsx".
 *
 *  • Mục tiêu / Kế hoạch năm
 *      Kế hoạch năm  = tổng "HĐ ký mới" ở màn Mục tiêu kinh doanh của năm (hồ sơ chưa bị từ chối);
 *                      năm chưa có hồ sơ → mục tiêu ký HĐ theo khối (Sổ theo dõi dự án).
 *      Đã xác lập    = tổng giá trị HĐ dự kiến của các dự án đã lập PAKD, ký trong năm.
 *      Hoàn thành    = tổng giá trị HĐ đã ký trong năm.
 *  • Công nợ phải thu (tại ngày chốt số = cuối tháng mới nhất có số thực tế)
 *      Công nợ = doanh thu ghi nhận luỹ kế − tiền đã thu luỹ kế. Tiền thu trừ dần vào doanh thu cũ nhất (FIFO).
 *      Hạn thanh toán = cuối tháng ghi nhận doanh thu + PAYMENT_TERM_DAYS ngày → quá hạn 1-30 / 31-60 / > 60 ngày.
 *  • Doanh thu, chi phí, lợi nhuận: số thực tế trong năm (đến tháng chốt số) so với kế hoạch cùng kỳ.
 *  • Dòng tiền ròng = tiền thu − tiền chi (thực tế).
 *  • Vấn đề tồn đọng: hệ thống tự phát hiện theo quy tắc (RULES) — mức độ Cao / Trung bình / Thấp.
 */
import { BizMonthRow, BizProject, latestActualMonth, latestPakd } from './BusinessProjectContext';

export const PAYMENT_TERM_DAYS = 30;
export const MIN_MARGIN = 0.2;

const DAY = 86_400_000;
const toDate = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00`);
export const isoOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const endOfMonth = (ym: string) => isoOf(new Date(+ym.slice(0, 4), +ym.slice(5, 7), 0));
export const addDaysIso = (iso: string, n: number) => isoOf(new Date(toDate(iso).getTime() + n * DAY));
export const daysBetween = (a: string, b: string) => Math.round((toDate(b).getTime() - toDate(a).getTime()) / DAY);
export const todayIso = () => isoOf(new Date());

/** Năm tính "ký HĐ" của dự án: ngày ký trên HĐ → ngày dự kiến ký → ngày bắt đầu. */
export const signYear = (p: BizProject) => (p.contract?.signDate || p.expectedSignDate || p.startDate || '').slice(0, 4);
export const hasPakd = (p: BizProject) => p.pakd.length > 0;

// --------------------------------------------------------------------------
// Doanh thu / chi phí / dòng tiền trong kỳ
// --------------------------------------------------------------------------
export interface Fin {
  revenue: number;
  cost: number;
  cashIn: number;
  profit: number;
  net: number; // dòng tiền ròng = thu − chi
}
export const emptyFin = (): Fin => ({ revenue: 0, cost: 0, cashIn: 0, profit: 0, net: 0 });
export const finOf = (rows: BizMonthRow[], from: string, to: string): Fin => {
  const f = emptyFin();
  rows.forEach((r) => {
    if (r.month < from || r.month > to) return;
    f.revenue += r.revenue;
    f.cost += r.costSx + r.costKd;
    f.cashIn += r.cashIn;
  });
  f.profit = f.revenue - f.cost;
  f.net = f.cashIn - f.cost;
  return f;
};
export const addFin = (a: Fin, b: Fin): Fin => ({
  revenue: a.revenue + b.revenue,
  cost: a.cost + b.cost,
  cashIn: a.cashIn + b.cashIn,
  profit: a.profit + b.profit,
  net: a.net + b.net,
});
export const marginOf = (f: Fin) => (f.revenue ? f.profit / f.revenue : null);

// --------------------------------------------------------------------------
// Công nợ phải thu
// --------------------------------------------------------------------------
export interface Receivable {
  total: number;
  inTerm: number;
  overdue: number;
  b30: number; // quá hạn 1-30 ngày
  b60: number; // 31-60 ngày
  b60p: number; // > 60 ngày
  /** Hạn thanh toán của khoản quá hạn lâu nhất (để tính hạn xử lý). */
  oldestDue?: string;
}
export const emptyRec = (): Receivable => ({ total: 0, inTerm: 0, overdue: 0, b30: 0, b60: 0, b60p: 0 });
export const addRec = (a: Receivable, b: Receivable): Receivable => ({
  total: a.total + b.total,
  inTerm: a.inTerm + b.inTerm,
  overdue: a.overdue + b.overdue,
  b30: a.b30 + b.b30,
  b60: a.b60 + b.b60,
  b60p: a.b60p + b.b60p,
  oldestDue: [a.oldestDue, b.oldestDue].filter(Boolean).sort()[0],
});

/** Công nợ của 1 dự án tại cuối tháng asOfMonth. */
export const receivableOf = (p: BizProject, asOfMonth: string): Receivable => {
  const rows = p.actual.filter((r) => r.month <= asOfMonth).sort((a, b) => a.month.localeCompare(b.month));
  let cash = rows.reduce((s, r) => s + r.cashIn, 0);
  const out = emptyRec();
  const asOf = endOfMonth(asOfMonth);
  rows.forEach((r) => {
    const paid = Math.min(cash, r.revenue);
    cash -= paid;
    const open = r.revenue - paid;
    if (open <= 0) return;
    const due = addDaysIso(endOfMonth(r.month), PAYMENT_TERM_DAYS);
    const late = daysBetween(due, asOf);
    out.total += open;
    if (late <= 0) out.inTerm += open;
    else {
      out.overdue += open;
      if (late <= 30) out.b30 += open;
      else if (late <= 60) out.b60 += open;
      else out.b60p += open;
      if (!out.oldestDue || due < out.oldestDue) out.oldestDue = due;
    }
  });
  return out;
};

// --------------------------------------------------------------------------
// Vấn đề tồn đọng
// --------------------------------------------------------------------------
export type Severity = 'Cao' | 'Trung bình' | 'Thấp';
export const SEVERITIES: Severity[] = ['Cao', 'Trung bình', 'Thấp'];
export const SEVERITY_RANK: Record<Severity, number> = { Cao: 0, 'Trung bình': 1, Thấp: 2 };
export type IssueStatus = 'Chưa xử lý' | 'Đang xử lý' | 'Đã xử lý';
export const ISSUE_STATUSES: IssueStatus[] = ['Chưa xử lý', 'Đang xử lý', 'Đã xử lý'];

export interface Issue {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  code: string;
  division: string;
  type: string;
  severity: Severity;
  due: string; // hạn xử lý (YYYY-MM-DD)
  overdueDays: number; // > 0: đã quá hạn xử lý
  owner: string;
}

/** Mô tả quy tắc phát hiện vấn đề (hiển thị ở chú thích). */
export const RULES = [
  'Công nợ quá hạn > 60 ngày: Cao · 31-60 ngày: Trung bình (hạn xử lý = hạn thanh toán + 60 ngày; bỏ qua khoản < 0,5% giá trị HĐ)',
  'Chi phí thực tế ≥ 130% kế hoạch cùng kỳ: Cao · ≥ 110%: Trung bình',
  'Dòng tiền thu ≤ 65% kế hoạch: Cao · Doanh thu ≤ 85% kế hoạch: Trung bình',
  'Dự án Pending (quá hạn PAKD): Cao · Hạn lập PAKD còn ≤ 7 ngày / PAKD bị từ chối: Trung bình · PAKD chờ duyệt quá 5 ngày: Trung bình, còn lại Thấp',
  'Quá thời điểm dự kiến ký mà chưa ký HĐ / dự án lỗ: Trung bình · Biên LN thực tế < 20%: Thấp · Chờ duyệt mã quá 3 ngày: Thấp',
];

const tr = (n: number) => `${Math.round(n / 1e6).toLocaleString('en-US')} tr`;
const pct = (x: number) => `${Math.round(x * 100)}%`;

export const detectIssues = (projects: BizProject[], cutoffMonth: string, today = todayIso()): Issue[] => {
  const out: Issue[] = [];
  const reviewDue = cutoffMonth ? addDaysIso(endOfMonth(cutoffMonth), 15) : today; // hạn rà soát số liệu tháng chốt
  const year = cutoffMonth.slice(0, 4);
  projects.forEach((p) => {
    const add = (type: string, severity: Severity, title: string, due: string, owner: string) =>
      out.push({
        id: `${p.id}-${type}`,
        title,
        projectId: p.id,
        projectName: p.name,
        code: p.masterCode,
        division: p.division,
        type,
        severity,
        due,
        overdueDays: Math.max(0, daysBetween(due, today)),
        owner: owner || '—',
      });
    const pmKd = p.businessPm || p.am[0] || '';
    const pmSx = p.productionPm || '';

    // Công nợ
    if (cutoffMonth && p.actual.length) {
      const r = receivableOf(p, cutoffMonth);
      const minor = Math.max(10e6, 0.005 * (p.contract?.value ?? p.expectedRevenue ?? 0)); // bỏ qua khoản nhỏ lẻ
      if (r.b60p + r.b60 < minor) {
        /* không đáng kể */
      } else if (r.b60p > 0) add('Công nợ', 'Cao', `Công nợ quá hạn trên 60 ngày ${tr(r.b60p)}`, addDaysIso(r.oldestDue!, 60), pmKd);
      else if (r.b60 > 0) add('Công nợ', 'Trung bình', `Công nợ quá hạn 31-60 ngày ${tr(r.b60)}`, addDaysIso(r.oldestDue!, 60), pmKd);
    }

    // Thực hiện so với kế hoạch cùng kỳ (năm của tháng chốt số)
    if (p.status === 'Đang thực hiện' && p.actual.some((r) => r.month.startsWith(year))) {
      const from = `${year}-01`;
      const plan = finOf(p.plan, from, cutoffMonth);
      const act = finOf(p.actual, from, cutoffMonth);
      if (plan.cost > 0) {
        const k = act.cost / plan.cost;
        if (k >= 1.3) add('Chi phí', 'Cao', `Chi phí vượt kế hoạch (${pct(k)} KH cùng kỳ)`, reviewDue, pmSx);
        else if (k >= 1.1) add('Chi phí', 'Trung bình', `Chi phí vượt kế hoạch (${pct(k)} KH cùng kỳ)`, reviewDue, pmSx);
      }
      if (plan.cashIn > 0 && act.cashIn / plan.cashIn <= 0.65)
        add('Dòng tiền', 'Cao', `Dòng tiền thu thấp (${pct(act.cashIn / plan.cashIn)} KH cùng kỳ)`, reviewDue, pmKd);
      if (plan.revenue > 0 && act.revenue / plan.revenue <= 0.85)
        add('Doanh thu', 'Trung bình', `Doanh thu chậm (${pct(act.revenue / plan.revenue)} KH cùng kỳ)`, reviewDue, pmKd);
      const m = marginOf(act);
      if (m !== null && m < 0) add('Hiệu quả', 'Trung bình', `Dự án đang lỗ — biên lợi nhuận ${(m * 100).toFixed(1)}%`, reviewDue, pmKd);
      else if (m !== null && m < MIN_MARGIN) add('Hiệu quả', 'Thấp', `Biên lợi nhuận thực tế ${(m * 100).toFixed(1)}% (< 20%)`, reviewDue, pmKd);
    }

    // Quy trình PAKD / mã / hợp đồng
    const last = latestPakd(p);
    if (p.status === 'Chưa có PAKD' && p.pakdDeadline) {
      const left = daysBetween(today, p.pakdDeadline);
      if (last?.state === 'Từ chối') add('PAKD', 'Trung bình', `PAKD V${last.version} bị từ chối — cần lập lại`, p.pakdDeadline, pmKd || p.salesDirector);
      else if (left <= 7) add('PAKD', 'Trung bình', left < 0 ? 'Quá hạn lập PAKD' : `Còn ${left} ngày đến hạn lập PAKD`, p.pakdDeadline, pmKd || p.salesDirector);
    }
    if (p.status === 'PAKD chờ duyệt' && last?.state === 'Chờ CFO') {
      const due = addDaysIso(last.submittedAt, 5);
      add('Phê duyệt', daysBetween(due, today) > 0 ? 'Trung bình' : 'Thấp', `PAKD V${last.version} chờ Kế toán (CFO) duyệt`, due, 'Kế toán (CFO)');
    }
    if (p.status === 'Pending' && p.pakdDeadline)
      add('PAKD', 'Cao', `Dự án Pending — quá hạn PAKD ${p.pakd.length ? '(chưa được Kế toán duyệt)' : '(chưa có PAKD)'}`, p.pakdDeadline, 'Kế toán (CFO)');
    if (p.status === 'Chờ duyệt mã') {
      const due = addDaysIso(p.createdAt, 3);
      if (daysBetween(due, today) > 0) add('Phê duyệt', 'Thấp', 'Yêu cầu mở mã chờ Giám đốc khối duyệt', due, p.salesDirector);
    }
    if (!p.contractSigned && p.expectedSignDate && ['Đang thực hiện', 'PAKD chờ duyệt', 'Chưa có PAKD'].includes(p.status) && p.expectedSignDate < today)
      add('Hợp đồng', 'Trung bình', 'Quá thời điểm dự kiến ký nhưng chưa ký HĐ', p.expectedSignDate, pmKd);
  });
  return out.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || b.overdueDays - a.overdueDays || a.due.localeCompare(b.due));
};

/** Tháng chốt số dùng cho năm đang xem: min(tháng chốt toàn công ty, 12/năm). */
export const cutoffFor = (projects: BizProject[], year: string) => {
  const c = latestActualMonth(projects);
  if (!c) return '';
  return c.slice(0, 4) > year ? `${year}-12` : c;
};
