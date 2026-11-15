/**
 * Báo cáo tổng kết khi đóng dự án — so sánh Kế hoạch / Thực tế:
 * doanh thu, chi phí (theo khoản), lãi / lỗ, dòng tiền, thời gian hoàn thành; xuất Excel.
 * Kế hoạch = số kế hoạch theo tháng đã import; dự án chưa có kế hoạch tháng ⇒ lấy PAKD đã duyệt.
 */
import * as XLSX from 'xlsx';
import { BizCloseRequest, BizProject, PAKD_STEP_LABEL, closeStateLabel, plannedCost, sumRows, totalCost } from './BusinessProjectContext';

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
}
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
}

const iso = () => new Date().toISOString().slice(0, 10);
const days = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00`) - Date.parse(`${a}T00:00:00`)) / 86_400_000);

export const closeSummary = (p: BizProject, asOf = iso()): CloseSummary => {
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
  const ac = aSx + aKd + aCh + aMg + aAl;
  const aCash = sumRows(a, 'cashIn');
  const m = (x: number, rev: number) => (rev ? (x / rev) : null);

  const lines: CloseLine[] = [
    { key: 'rev', group: 'pl', label: 'Doanh thu', plan: pr, actual: ar, level: 0, bold: true },
    { key: 'cost', group: 'pl', label: 'Tổng chi phí', plan: pc, actual: ac, level: 0, bold: true, lowerBetter: true },
    { key: 'sx', group: 'pl', label: 'Chi phí sản xuất (mã SX .2)', plan: pSx, actual: aSx, level: 1, lowerBetter: true },
    { key: 'kd', group: 'pl', label: 'Chi phí kinh doanh (mã KD .1)', plan: pKd, actual: aKd, level: 1, lowerBetter: true },
    { key: 'chung', group: 'pl', label: 'Chi phí chung', plan: null, actual: aCh, level: 1, lowerBetter: true },
    { key: 'profit', group: 'pl', label: 'Lãi / (Lỗ) gộp', plan: pr - pc, actual: ar - ac, level: 0, bold: true, noRatio: true },
    { key: 'margin', group: 'pl', label: 'Tỷ suất lợi nhuận gộp', plan: m(pr - pc, pr), actual: m(ar - ac, ar) ?? 0, level: 0, pct: true },
    { key: 'in', group: 'cash', label: 'Tiền thu về', plan: pCash, actual: aCash, level: 0 },
    { key: 'out', group: 'cash', label: 'Tiền chi ra', plan: pc, actual: ac, level: 0, lowerBetter: true },
    { key: 'net', group: 'cash', label: 'Dòng tiền thuần (Thu − Chi)', plan: pCash - pc, actual: aCash - ac, level: 0, bold: true, noRatio: true },
    { key: 'ar', group: 'cash', label: 'Công nợ phải thu (Doanh thu − Tiền thu)', plan: pr - pCash, actual: ar - aCash, level: 0, lowerBetter: true, noRatio: true },
  ];

  const keys = [...new Set([...p.plan.map((r) => r.month), ...a.map((r) => r.month)])].sort();
  let cum = 0;
  const months: CloseMonth[] = keys.map((month) => {
    const pl = p.plan.find((r) => r.month === month);
    const ac0 = a.find((r) => r.month === month);
    const net = ac0 ? ac0.cashIn - totalCost(ac0) : 0;
    cum += net;
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
    };
  });

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
    net: { plan: pCash - pc, actual: aCash - ac },
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

const dmy = (d: string) => (d ? d.slice(0, 10).split('-').reverse().join('/') : '');
const mmyy = (m: string) => `${m.slice(5, 7)}/${m.slice(0, 4)}`;
const dtv = (s: string) => new Date(s).toLocaleString('vi-VN');

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

/** Xuất báo cáo tổng kết ra Excel (2 sheet: Tổng kết · Theo tháng). */
export const exportCloseReport = (p: BizProject, s: CloseSummary) => {
  const pct = (x: number | null) => (x === null ? '' : Math.round(x * 1000) / 10);
  const rows: (string | number | null)[][] = [
    ['BÁO CÁO TỔNG KẾT DỰ ÁN'],
    [],
    ['Mã dự án', p.masterCode],
    ['Tên dự án', p.name],
    ['Khách hàng', p.customerName],
    ['Khối', p.division],
    ['AM', p.am.join(', ')],
    ['Giám đốc khối', p.businessDirector],
    ['Số hợp đồng', p.contract?.number || ''],
    ['Giá trị hợp đồng (VNĐ)', p.contract?.value ?? p.expectedRevenue],
    ['Trạng thái đóng', p.closeRequest ? closeStateLabel(p.closeRequest) : p.status === 'Kết thúc' ? 'Đã đóng' : 'Chưa yêu cầu'],
    ['Số liệu thực tế đến tháng', s.lastActualMonth ? mmyy(s.lastActualMonth) : 'Chưa có'],
    ['Nguồn kế hoạch', s.planSource === 'monthly' ? 'Kế hoạch theo tháng' : 'PAKD đã duyệt'],
    ['Ngày lập báo cáo', dmy(iso())],
    [],
    ['A. KẾT QUẢ KINH DOANH & DÒNG TIỀN (VNĐ)'],
    ['Chỉ tiêu', 'Kế hoạch', 'Thực tế', 'Chênh lệch (TT − KH)', '% Thực tế / Kế hoạch'],
  ];
  const add = (g: string) =>
    s.lines
      .filter((l) => l.group === g)
      .forEach((l) => {
        if (l.pct) rows.push([l.label, pct(l.plan), pct(l.actual), l.plan === null ? '' : pct(l.actual - l.plan), '']);
        else rows.push([`${l.level ? '   ' : ''}${l.label}`, l.plan, l.actual, l.plan === null ? null : l.actual - l.plan, l.plan && !l.noRatio ? pct(l.actual / l.plan) : '']);
      });
  add('pl');
  rows.push(['Dòng tiền']);
  add('cash');
  rows.push([], ['B. THỜI GIAN HOÀN THÀNH'], ['Chỉ tiêu', 'Kế hoạch', 'Thực tế', 'Chênh lệch (ngày)']);
  rows.push(['Ngày bắt đầu', dmy(s.time.planStart), dmy(s.time.planStart), 0]);
  rows.push(['Ngày kết thúc', dmy(s.time.planEnd), dmy(s.time.actualEnd), s.time.lateDays]);
  rows.push(['Số ngày thực hiện', s.time.planDays, s.time.actualDays, s.time.actualDays - s.time.planDays]);
  rows.push(['Đánh giá', '', timeText(s.time)]);
  if (p.closeRequest) {
    rows.push([], ['C. QUY TRÌNH DUYỆT ĐÓNG DỰ ÁN'], ['Bước', 'Người thực hiện', 'Thời điểm', 'Kết quả', 'Ghi chú']);
    closeTrack(p.closeRequest).forEach((t) =>
      rows.push([t.label, 'by' in t ? t.by || '' : '', 'at' in t && t.at ? dtv(t.at) : '', t.state === 'done' ? (t.step === 'Yêu cầu' ? 'Đã gửi' : 'Đã duyệt') : t.state === 'reject' ? 'Từ chối' : t.state === 'skip' ? 'Bỏ qua' : t.state === 'current' ? 'Đang chờ' : 'Chưa đến', 'note' in t ? t.note || '' : '']),
    );
  }
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 44 }, { wch: 20 }, { wch: 20 }, { wch: 22 }, { wch: 22 }];
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }];
  // Định dạng số tiền
  Object.keys(ws).forEach((k) => {
    const c = ws[k] as XLSX.CellObject;
    if (k[0] !== '!' && c && c.t === 'n' && Math.abs(Number(c.v)) >= 1000) c.z = '#,##0';
  });

  const head = ['Tháng', 'Doanh thu KH', 'Doanh thu TT', 'Chi phí KH', 'Chi phí TT', 'Tiền thu KH', 'Tiền thu TT', 'Dòng tiền thuần TT', 'Luỹ kế dòng tiền TT'];
  const body = s.months.map((m) => [mmyy(m.month), m.planRevenue, m.actualRevenue, m.planCost, m.actualCost, m.planCash, m.actualCash, m.net, m.cumNet]);
  const tot = (k: keyof CloseMonth) => s.months.reduce((a, m) => a + (m[k] as number), 0);
  body.push(['Tổng cộng', tot('planRevenue'), tot('actualRevenue'), tot('planCost'), tot('actualCost'), tot('planCash'), tot('actualCash'), tot('net'), s.months[s.months.length - 1]?.cumNet || 0]);
  const ws2 = XLSX.utils.aoa_to_sheet([head, ...body]);
  ws2['!cols'] = head.map((h, i) => ({ wch: i ? 18 : 12 }));
  Object.keys(ws2).forEach((k) => {
    const c = ws2[k] as XLSX.CellObject;
    if (k[0] !== '!' && c && c.t === 'n') c.z = '#,##0';
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Tong ket');
  XLSX.utils.book_append_sheet(wb, ws2, 'Theo thang');
  XLSX.writeFile(wb, `TongKet_${(p.masterCode || p.id).replace(/\./g, '-')}.xlsx`);
};
