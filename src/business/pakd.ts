/**
 * pakd.ts — dữ liệu & tính toán "Lập phương án kinh doanh (PAKD)" theo mẫu Excel
 * "Gửi Nam - 02.10.26 - Lập PAKD.xlsx". Mỗi sheet là 1 trạng thái dự án:
 *
 *  • ĐÃ KÝ (sheet "Lập PAKD")
 *      1. Thông tin dự án: Số HĐ · Ngày ký trên HĐ · Ngày ký thực tế · Giá trị HĐ
 *      2. Tiến độ & phạm vi (theo HĐ): Bắt đầu · Kết thúc (tháng) · Số tháng · Phạm vi công việc
 *      3. Nghiệm thu, ghi nhận doanh thu & thu tiền (theo mốc)
 *      4. Chi phí (6 nhóm: SX, KD, Dự phòng SX/KD, Thưởng SX/KD)
 *      Dashboard: Doanh thu KH · Lợi nhuận · Biên LN · Luỹ kế dòng tiền · Tóm tắt chi phí theo nhóm
 *
 *  • CHƯA KÝ (sheet "Lập PAKD (2)")
 *      1. Thông tin dự án: Thời điểm dự kiến ký · Giá trị HĐ dự kiến · Xác suất thành công ·
 *         Phạm vi công việc · Đánh giá rủi ro
 *      3. Mốc kế hoạch & mục tiêu: Giai đoạn · Từ · Đến · Tổng mức đầu tư (SX / KD) · Kết quả đầu ra
 *      Dashboard: Doanh thu KH · Lợi nhuận · Biên LN · Dòng tiền chi theo tháng · Tóm tắt chi phí theo tháng
 *
 * ĐVT nhập liệu: VNĐ. Tháng lưu dạng YYYY-MM, hiển thị MM/YYYY.
 */
import type { BizMonthRow } from './BusinessProjectContext';

export type PakdContractState = 'Đã ký' | 'Chưa ký';
export const COST_GROUPS = ['Sản xuất', 'Kinh doanh', 'Dự phòng sản xuất', 'Dự phòng kinh doanh', 'Thưởng sản xuất', 'Thưởng kinh doanh'] as const;
export type CostGroup = (typeof COST_GROUPS)[number];
/** Nhóm chi phí thuộc khối sản xuất (còn lại là kinh doanh). */
export const isSxGroup = (g: CostGroup) => g === 'Sản xuất' || g === 'Dự phòng sản xuất' || g === 'Thưởng sản xuất';
/** Biên lợi nhuận tối thiểu ("Khung tối thiểu" trong mẫu). */
export const MIN_MARGIN = 0.2;
/** Cảnh báo lệch giá trị HĐ so với doanh thu PAKD. */
export const MAX_DEVIATION = 0.02;

export interface PakdMilestone {
  id: string;
  name: string; // Mốc
  month: string; // Thời điểm (YYYY-MM)
  percent: number; // % giá trị HĐ
  payRate: number; // Tỷ lệ được thanh toán (%)
  submitMonth: string; // Thời gian gửi hồ sơ (YYYY-MM)
  condition: string; // Điều kiện nghiệm thu
  waitDays: number; // Thời gian chờ (ngày)
}
/**
 * Một khoản mục chi phí, lập kế hoạch theo tháng (thời điểm = các tháng thực hiện dự án):
 * amounts[YYYY-MM] = giá trị chi trong tháng (VNĐ).
 */
export interface PakdCost {
  id: string;
  group: CostGroup;
  item: string; // Khoản mục chi phí
  amounts: Record<string, number>; // Kế hoạch chi theo tháng
  output: string; // Kết quả đầu ra
  files: string[]; // File đính kèm (tên file)
  /** @deprecated dữ liệu cũ (1 thời điểm / 1 giá trị) — tự chuyển sang amounts khi mở form. */
  month?: string;
  amount?: number;
}
export interface PakdPhase {
  id: string;
  name: string; // Giai đoạn
  from: string;
  to: string;
  sx: number; // Tổng mức đầu tư — sản xuất
  kd: number; // — kinh doanh
  output: string;
  files: string[];
}
export interface PakdFormData {
  contractState: PakdContractState;
  // Đã ký
  contractNo: string;
  contractDate: string; // ngày ký trên HĐ (YYYY-MM-DD)
  actualSignDate: string; // ngày ký thực tế
  contractValue: number;
  startMonth: string;
  endMonth: string;
  milestones: PakdMilestone[];
  costs: PakdCost[];
  // Chưa ký
  expectedSignMonth: string;
  expectedValue: number;
  probability: number; // %
  risk: string;
  phases: PakdPhase[];
  // Chung
  scope: string;
  savedAt?: string;
  savedBy?: string;
}

export const uid = () => Math.random().toString(36).slice(2, 9);
export const newMilestone = (name = ''): PakdMilestone => ({ id: uid(), name, month: '', percent: 0, payRate: 100, submitMonth: '', condition: '', waitDays: 30 });
export const newCost = (group: CostGroup = 'Sản xuất', item = ''): PakdCost => ({ id: uid(), group, item, amounts: {}, output: '', files: [] });
/** Chuyển dữ liệu chi phí cũ (month / amount) sang kế hoạch theo tháng. */
export const normalizeCost = (c: PakdCost): PakdCost =>
  c.amounts ? c : { ...c, amounts: c.month && c.amount ? { [c.month]: c.amount } : {} };
/** Tổng kế hoạch của 1 khoản mục. */
export const costTotal = (c: PakdCost) =>
  c.amounts ? Object.values(c.amounts).reduce((s, v) => s + (v || 0), 0) : c.amount || 0;
/** Khoản mục mẫu (theo file Excel): sản xuất trước, kinh doanh sau. */
export const DEFAULT_COSTS = (): PakdCost[] => [
  newCost('Sản xuất', 'Chi phí lương'),
  newCost('Sản xuất', 'Thuê ngoài / mua sắm'),
  newCost('Dự phòng sản xuất', 'Dự phòng'),
  newCost('Thưởng sản xuất', 'Thưởng'),
  newCost('Kinh doanh', 'Chi phí lương'),
  newCost('Kinh doanh', 'Tiếp khách, công tác'),
  newCost('Dự phòng kinh doanh', 'Dự phòng'),
  newCost('Thưởng kinh doanh', 'Thưởng'),
];
/** Chia đều tổng cho các tháng (làm tròn tới nghìn đồng, phần dư dồn vào tháng cuối). */
export const spreadEven = (total: number, months: string[]): Record<string, number> => {
  if (!months.length) return {};
  const each = Math.floor(total / months.length / 1000) * 1000;
  return Object.fromEntries(months.map((m, i) => [m, i === months.length - 1 ? total - each * (months.length - 1) : each]));
};
export const newPhase = (): PakdPhase => ({ id: uid(), name: '', from: '', to: '', sx: 0, kd: 0, output: '', files: [] });

/** Form trống (gợi ý sẵn 4 mốc nghiệm thu như mẫu). */
export const emptyPakd = (signed: boolean, value = 0): PakdFormData => ({
  contractState: signed ? 'Đã ký' : 'Chưa ký',
  contractNo: '',
  contractDate: '',
  actualSignDate: '',
  contractValue: signed ? value : 0,
  startMonth: '',
  endMonth: '',
  milestones: ['Tạm ứng khi có hợp đồng', 'Nghiệm thu giai đoạn 1', 'Nghiệm thu giai đoạn 2', 'Quyết toán, bảo hành'].map((n) => newMilestone(n)),
  costs: DEFAULT_COSTS(),
  expectedSignMonth: '',
  expectedValue: signed ? 0 : value,
  probability: 50,
  risk: '',
  phases: [newPhase()],
  scope: '',
});

// --------------------------------------------------------------------------
// Tháng
// --------------------------------------------------------------------------
export const addMonths = (ym: string, n: number) => {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};
export const monthsBetween = (a: string, b: string) => {
  if (!a || !b) return 0;
  const [y1, m1] = a.split('-').map(Number);
  const [y2, m2] = b.split('-').map(Number);
  return (y2 - y1) * 12 + (m2 - m1) + 1;
};
export const monthRange = (a: string, b: string) => {
  const n = monthsBetween(a, b);
  return n > 0 ? Array.from({ length: n }, (_, i) => addMonths(a, i)) : [];
};
export const my = (ym?: string) => (ym ? `${ym.slice(5, 7)}/${ym.slice(0, 4)}` : '—');

// --------------------------------------------------------------------------
// Tính toán
// --------------------------------------------------------------------------
/** Giá trị mốc = % × giá trị HĐ; giá trị thu = giá trị mốc × tỷ lệ thanh toán. */
export const msValue = (f: PakdFormData, m: PakdMilestone) => (f.contractValue * (m.percent || 0)) / 100;
export const msCash = (f: PakdFormData, m: PakdMilestone) => (msValue(f, m) * (m.payRate || 0)) / 100;
/** Tháng thu tiền = tháng gửi hồ sơ (hoặc thời điểm mốc) + thời gian chờ. */
export const msCashMonth = (m: PakdMilestone) => {
  const base = m.submitMonth || m.month;
  return base ? addMonths(base, Math.round((m.waitDays || 0) / 30)) : '';
};

export const pakdRevenue = (f: PakdFormData) => (f.contractState === 'Đã ký' ? f.contractValue : f.expectedValue) || 0;

/** Chi phí theo nhóm (Đã ký) hoặc SX/KD (Chưa ký, từ mốc kế hoạch). */
export const pakdCostByGroup = (f: PakdFormData): Record<CostGroup, number> => {
  const out = Object.fromEntries(COST_GROUPS.map((g) => [g, 0])) as Record<CostGroup, number>;
  if (f.contractState === 'Đã ký') f.costs.forEach((c) => (out[c.group] += costTotal(c)));
  else
    f.phases.forEach((p) => {
      out['Sản xuất'] += p.sx || 0;
      out['Kinh doanh'] += p.kd || 0;
    });
  return out;
};
export const pakdTotals = (f: PakdFormData) => {
  const g = pakdCostByGroup(f);
  const cost = COST_GROUPS.reduce((s, k) => s + g[k], 0);
  const sx = COST_GROUPS.filter(isSxGroup).reduce((s, k) => s + g[k], 0);
  const revenue = pakdRevenue(f);
  const profit = revenue - cost;
  return { revenue, cost, sx, kd: cost - sx, profit, margin: revenue ? profit / revenue : 0, byGroup: g };
};

/** Kế hoạch theo tháng sinh từ PAKD (dùng cho báo cáo hiệu quả / số liệu theo tháng). */
export const pakdMonthlyPlan = (f: PakdFormData): BizMonthRow[] => {
  const map = new Map<string, BizMonthRow>();
  const row = (m: string) => {
    if (!map.has(m)) map.set(m, { month: m, revenue: 0, cashIn: 0, costSx: 0, costKd: 0, workload: 0 });
    return map.get(m)!;
  };
  if (f.contractState === 'Đã ký') {
    f.milestones.forEach((m) => {
      if (m.month) row(m.month).revenue += msValue(f, m);
      const cm = msCashMonth(m);
      if (cm) row(cm).cashIn += msCash(f, m);
    });
    f.costs.forEach((c) =>
      Object.entries(normalizeCost(c).amounts).forEach(([m, v]) => {
        if (!v) return;
        if (isSxGroup(c.group)) row(m).costSx += v;
        else row(m).costKd += v;
      }),
    );
  } else {
    // Chưa ký: chi phí từng giai đoạn chia đều cho các tháng Từ → Đến.
    f.phases.forEach((p) => {
      const ms = monthRange(p.from, p.to || p.from);
      ms.forEach((m) => {
        row(m).costSx += (p.sx || 0) / ms.length;
        row(m).costKd += (p.kd || 0) / ms.length;
      });
    });
  }
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
};

/** Luỹ kế dòng tiền theo tháng: LKDT = Dòng thu − Dòng chi + Số dư kỳ trước. */
export const cashflowSeries = (f: PakdFormData) => {
  const plan = pakdMonthlyPlan(f);
  if (!plan.length) return [];
  const months = monthRange(plan[0].month, plan[plan.length - 1].month);
  let bal = 0;
  return months.map((m) => {
    const r = plan.find((x) => x.month === m);
    const inn = r?.cashIn || 0;
    const out = (r?.costSx || 0) + (r?.costKd || 0);
    bal += inn - out;
    return { month: m, inn, out, sx: r?.costSx || 0, kd: r?.costKd || 0, balance: bal };
  });
};

/** Kiểm tra các trường bắt buộc (*) trước khi gửi duyệt. Trả về danh sách lỗi. */
export const validatePakd = (f: PakdFormData): string[] => {
  const e: string[] = [];
  if (!f.scope.trim()) e.push('Nhập Phạm vi công việc');
  if (f.contractState === 'Đã ký') {
    if (!f.contractValue) e.push('Nhập Giá trị hợp đồng');
    if (!f.startMonth || !f.endMonth) e.push('Nhập Bắt đầu / Kết thúc thực hiện (tháng)');
    else if (f.endMonth < f.startMonth) e.push('Kết thúc phải sau Bắt đầu');
    const pct = f.milestones.reduce((s, m) => s + (m.percent || 0), 0);
    if (Math.abs(pct - 100) > 0.01) e.push(`Tổng % các mốc nghiệm thu phải bằng 100% (hiện ${pct}%)`);
    if (!f.costs.some((c) => costTotal(c) > 0)) e.push('Lập kế hoạch chi phí: nhập giá trị cho ít nhất một khoản mục / tháng');
    if (f.costs.some((c) => costTotal(c) > 0 && !c.item.trim())) e.push('Nhập tên khoản mục cho các dòng chi phí có giá trị');
  } else {
    if (!f.expectedSignMonth) e.push('Nhập Thời điểm dự kiến ký');
    if (!f.expectedValue) e.push('Nhập Giá trị hợp đồng dự kiến');
    if (!f.risk.trim()) e.push('Nhập Đánh giá rủi ro');
    if (!f.phases.some((p) => p.name.trim() && (p.sx || p.kd))) e.push('Nhập ít nhất một mốc kế hoạch có tổng mức đầu tư');
  }
  return e;
};
