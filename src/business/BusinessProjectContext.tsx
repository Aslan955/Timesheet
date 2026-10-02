/**
 * BusinessProjectContext — dữ liệu dùng chung cho module "Dự án kinh doanh" (PAKD).
 *
 * Luồng mới:
 *   1. Người dùng tạo dự án → khai báo THÔNG TIN DỰ ÁN (màn BusinessProjectPage).
 *   2. Import KẾ HOẠCH THEO THÁNG của dự án từ file Excel (`plan`) — mỗi tháng gồm
 *      Doanh thu dự kiến · Thu dự kiến · Chi dự kiến (tách SX / KD) · Khối lượng công việc.
 *   3. Kế toán import SỐ THỰC TẾ THEO THÁNG (`actual`) — cùng cấu trúc với kế hoạch.
 *   4. Kế toán import SỔ CHI TIẾT toàn công ty (`ledger`): Dòng tiền thu (sổ tiền gửi ngân hàng) và
 *      Chi thực tế (theo mã dự án). Mỗi dòng ghép vào dự án theo mã → cộng dồn thành Thu thực tế /
 *      Chi thực tế SX, KD của dự án trong tháng; bấm vào con số để xem các dòng chi tiết.
 *   → Màn "Báo cáo hiệu quả dự án" so sánh kế hoạch vs thực tế (BizReportPage).
 *
 * Mã dự án: Master = <mã KH>.<số thứ tự 3 chữ số>, Mã KD = Master.1, Mã SX = Master.2.
 * Đơn vị tiền: VNĐ (cả thông tin dự án và kế hoạch theo tháng).
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PakdFormData, pakdMonthlyPlan, pakdTotals } from './pakd';

export const DIVISIONS = ['G1', 'G2', 'G3', 'G4', 'BFSI', 'GPDV'];
export const PROJECT_TYPES = ['Fixed Cost', 'Time & Material', 'ODC', 'Cho thuê lao động', 'Nội bộ'];

/**
 * Vòng đời dự án:
 *   AM tạo yêu cầu mở mã → Chờ duyệt mã → (GĐK duyệt → hệ thống sinh Mã dự án / Mã KD / Mã SX) → Chưa có PAKD
 *   (GĐK tự tạo yêu cầu → mã được cấp ngay, bỏ bước duyệt mã)
 *   → (GĐK lập & nộp PAKD) → PAKD chờ duyệt → (Kế toán / CFO duyệt) → Đang thực hiện → Kết thúc.
 * Sau PAKD_DAYS ngày kể từ ngày cấp mã mà chưa từng nộp PAKD → tự động "Đóng".
 *   Kế toán (CFO) có thể mở lại → "Chưa có PAKD" với hạn PAKD_DAYS ngày mới.
 * PAKD bị từ chối → quay về "Chưa có PAKD" để lập & nộp phiên bản mới (V2, V3…);
 *   dự án đã nộp PAKD thì không còn bị tự động đóng.
 */
export type BizStatus = 'Chờ duyệt mã' | 'Chưa có PAKD' | 'PAKD chờ duyệt' | 'Đang thực hiện' | 'Kết thúc' | 'Đóng';
export const BIZ_STATUSES: BizStatus[] = ['Chờ duyệt mã', 'Chưa có PAKD', 'PAKD chờ duyệt', 'Đang thực hiện', 'Kết thúc', 'Đóng'];
/** Số ngày (kể từ ngày cấp mã / mở lại) để nộp PAKD trước khi dự án bị đóng. */
export const PAKD_DAYS = 30;

/** Vai trò trong quy trình (chưa có đăng nhập — chọn trên màn để thao tác thử). */
export type BizRole = 'AM' | 'GĐK' | 'PM' | 'CFO';
export const BIZ_ROLES: { key: BizRole; label: string }[] = [
  { key: 'AM', label: 'AM (tạo yêu cầu cấp mã)' },
  { key: 'GĐK', label: 'GĐK (duyệt mã, lập PAKD)' },
  { key: 'CFO', label: 'Kế toán (CFO)' },
];

/** 1 phiên bản PAKD nộp duyệt. Người duyệt: Kế toán (CFO). */
export type PakdState = 'Chờ CFO' | 'Đã duyệt' | 'Từ chối';
export interface PakdVersion {
  version: number;
  submittedAt: string; // YYYY-MM-DD
  submittedBy: string;
  state: PakdState;
  decidedAt?: string; // ngày duyệt / từ chối cuối cùng
  decidedBy?: string;
  note?: string;
}
/** Vai trò đang phải duyệt phiên bản này (nếu còn chờ). */
export const pendingRole = (v?: PakdVersion): BizRole | null => (v?.state === 'Chờ CFO' ? 'CFO' : null);
export const latestPakd = (p: Pick<BizProject, 'pakd'>) => p.pakd[p.pakd.length - 1] as PakdVersion | undefined;

// ==========================================================================
// Sổ theo dõi dự án — giá trị hợp đồng ký so với mục tiêu năm của từng khối
// ==========================================================================
/** Mục tiêu giá trị hợp đồng ký theo năm → khối (VNĐ). */
export type SignTargets = Record<string, Record<string, number>>;
const SEED_TARGETS: SignTargets = {
  '2026': { G1: 1_500_000_000_000, G2: 70_000_000_000, G3: 20_000_000_000, G4: 150_000_000_000, BFSI: 500_000_000_000, GPDV: 2_000_000_000 },
};
/** Ngày ký HĐ: theo thông tin hợp đồng; dự án đã ký nhưng chưa nhập HĐ thì lấy ngày dự kiến ký / ngày bắt đầu. */
export const signedDate = (p: Pick<BizProject, 'contract' | 'contractSigned' | 'expectedSignDate' | 'startDate'>) =>
  p.contract?.signDate || (p.contractSigned ? p.expectedSignDate || p.startDate : '');
/** Giá trị HĐ đã ký: theo hợp đồng, chưa nhập HĐ thì lấy doanh thu dự kiến. */
export const signedValue = (p: Pick<BizProject, 'contract' | 'expectedRevenue'>) => p.contract?.value ?? p.expectedRevenue;

export interface BizHistory {
  at: string;
  by: string;
  action: string;
  note?: string;
}

/** Giai đoạn kế hoạch kinh doanh KH01 → KH05. */
export interface BizPhase {
  code: string; // KH01..KH05
  name: string;
  start: string; // YYYY-MM-DD
  end: string;
  objective: string;
  output: string;
  pic: string; // người phụ trách
}

export const DEFAULT_PHASES: Pick<BizPhase, 'code' | 'name' | 'objective' | 'output'>[] = [
  { code: 'KH01', name: 'Lập kế hoạch', objective: 'Xác định cơ hội, phạm vi sơ bộ', output: 'Kế hoạch tiếp cận khách hàng' },
  { code: 'KH02', name: 'Khảo sát & giải pháp', objective: 'Khảo sát yêu cầu, đề xuất giải pháp', output: 'Hồ sơ giải pháp kỹ thuật' },
  { code: 'KH03', name: 'Chào giá', objective: 'Lập dự toán, chào giá / dự thầu', output: 'Báo giá / hồ sơ dự thầu' },
  { code: 'KH04', name: 'Ký kết hợp đồng', objective: 'Đàm phán, ký hợp đồng', output: 'Hợp đồng đã ký' },
  { code: 'KH05', name: 'Triển khai HĐ', objective: 'Thực hiện HĐ', output: 'Nghiệm thu giai đoạn tổng thể Hợp đồng' },
];

export const blankPhases = (): BizPhase[] => DEFAULT_PHASES.map((p) => ({ ...p, start: '', end: '', pic: '' }));

/**
 * Số liệu 1 tháng của dự án (import từ Excel) — dùng chung cho KẾ HOẠCH và THỰC TẾ.
 * Tiền: VNĐ, KLCV: SP. Chỉ Chi tách theo dự án sản xuất (SX) / kinh doanh (KD);
 * Doanh thu, Thu (dòng tiền thu) và KLCV là 1 số của cả dự án.
 */
export type FinMetric = 'revenue' | 'cashIn' | 'costSx' | 'costKd' | 'workload';
export type FinKind = 'plan' | 'actual';
export const FIN_METRICS: Record<FinKind, { key: FinMetric; label: string }[]> = {
  plan: [
    { key: 'revenue', label: 'Doanh thu dự kiến' },
    { key: 'cashIn', label: 'Thu dự kiến' },
    { key: 'costSx', label: 'Chi dự kiến - SX' },
    { key: 'costKd', label: 'Chi dự kiến - KD' },
    { key: 'workload', label: 'Khối lượng công việc (SP)' },
  ],
  actual: [
    { key: 'revenue', label: 'Doanh thu thực tế' },
    { key: 'cashIn', label: 'Thu thực tế' },
    { key: 'costSx', label: 'Chi thực tế - SX' },
    { key: 'costKd', label: 'Chi thực tế - KD' },
    { key: 'workload', label: 'Khối lượng công việc thực tế (SP)' },
  ],
};
export type BizMonthRow = { month: string } & Record<FinMetric, number>; // month: YYYY-MM

export interface BizPlanImport {
  fileName: string;
  at: string;
  by: string;
}

// ==========================================================================
// Sổ chi tiết kế toán (toàn công ty)
// ==========================================================================
/** 1 dòng "Báo cáo dòng tiền thu trong kỳ" (sổ tiền gửi ngân hàng). */
export interface CashInEntry {
  id: string;
  date: string; // Ngày hạch toán YYYY-MM-DD
  month: string; // YYYY-MM (lấy theo ngày hạch toán)
  description: string; // Diễn giải
  amount: number; // Số tiền
  partner: string; // Tên đối tượng
  projectCode: string; // Mã công trình
  projectName: string; // Tên công trình
  unitCode: string; // Mã đơn vị
  unitName: string; // Tên đơn vị
}
/** 1 dòng "Chi thực tế" theo mã dự án. */
export interface CostEntry {
  id: string;
  projectCode: string; // Mã dự án (Mã tổng / Mã SX / Mã PAKD)
  month: string; // YYYY-MM
  costSx: number; // Chi sản xuất (đ)
  costKd: number; // Chi kinh doanh (đ)
  note: string; // Ghi chú
}
export type LedgerKind = 'cashIn' | 'cost';
export interface LedgerImportLog {
  kind: LedgerKind;
  fileName: string;
  months: string[];
  lines: number;
  at: string;
  by: string;
}
export interface Ledger {
  cashIn: CashInEntry[];
  cost: CostEntry[];
  imports: LedgerImportLog[];
}

/** Các mã nhận diện 1 dự án trong sổ kế toán: Mã tổng, Mã PAKD (.1), Mã SX (.2). */
export const projectCodes = (p: Pick<BizProject, 'masterCode' | 'businessCode' | 'productionCode'>) =>
  [p.masterCode, p.businessCode, p.productionCode].map((c) => c.trim().toLowerCase()).filter(Boolean);
export const matchProject = (projects: BizProject[], code: string) => {
  const c = code.trim().toLowerCase();
  return c ? projects.find((p) => projectCodes(p).includes(c)) : undefined;
};

/** Danh sách tháng YYYY-MM từ ngày bắt đầu → ngày kết thúc (tính cả 2 đầu). */
export const monthsBetween = (start: string, end: string): string[] => {
  if (!start || !end || end < start) return [];
  const out: string[] = [];
  let y = +start.slice(0, 4);
  let m = +start.slice(5, 7);
  const ey = +end.slice(0, 4);
  const em = +end.slice(5, 7);
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    if (++m > 12) {
      m = 1;
      y++;
    }
  }
  return out;
};

export const sumRows = (rows: BizMonthRow[], k: FinMetric) => rows.reduce((s, r) => s + (r[k] || 0), 0);

/** Tháng "chốt số" = tháng mới nhất có số thực tế (rỗng nếu chưa có). */
export const latestActualMonth = (projects: Pick<BizProject, 'actual'>[]) =>
  projects.reduce((m, p) => p.actual.reduce((mm, r) => (r.month > mm ? r.month : mm), m), '');

export interface BizProject {
  id: string;
  name: string;
  isKey: boolean;
  version: number;
  status: BizStatus;

  masterCode: string;
  businessCode: string;
  productionCode: string;
  businessPm: string;
  productionPm: string;
  /** Mã outsource (tối đa MAX_OUTSOURCE): Mã tổng.3, .4 — mỗi mã có PM phụ trách. */
  outsourceCodes?: BizOutsource[];

  division: string;
  projectType: string;
  customerName: string;
  customerCode: string;
  businessDirector: string;
  salesDirector: string;
  creator: string;
  am: string[];
  startDate: string; // YYYY-MM-DD
  endDate: string;

  expectedRevenue: number;
  plannedBusinessCost: number;
  plannedProductionCost: number;
  contractSigned: boolean;
  expectedSignDate?: string; // Thời điểm dự kiến ký HĐ
  codeIssuedAt?: string; // YYYY-MM-DD — ngày cấp mã (GĐK duyệt / GĐK tự tạo)
  pakdDeadline?: string; // Hạn lập PAKD = ngày cấp mã (hoặc mở lại) + PAKD_DAYS
  closedAt?: string; // YYYY-MM-DD — ngày dự án bị đóng
  pakdForm?: PakdFormData; // Nội dung PAKD lập trên hệ thống (AM / GĐK nhập trong hạn PAKD_DAYS ngày)
  pakd: PakdVersion[]; // các phiên bản PAKD đã nộp
  contract?: BizContract; // thông tin ký hợp đồng (cập nhật trên màn chi tiết)
  attachments?: BizAttachment[]; // tài liệu đính kèm của dự án (PAKD, báo giá, biên bản…)
  note?: string;

  phases: BizPhase[];
  currentPhase: string; // code của giai đoạn hiện tại

  plan: BizMonthRow[];
  planImport?: BizPlanImport;
  actual: BizMonthRow[]; // kế toán import
  actualImport?: BizPlanImport;
  createdAt: string;
  updatedAt: string;
  history: BizHistory[];
}

export type BizProjectInput = Omit<
  BizProject,
  'id' | 'version' | 'plan' | 'planImport' | 'actual' | 'actualImport' | 'contract' | 'attachments' | 'pakd' | 'createdAt' | 'updatedAt' | 'history'
>;

// ==========================================================================
// Hợp đồng (Cập nhật ký hợp đồng)
// ==========================================================================
/** Tệp đính kèm — lưu tạm trong phiên làm việc (url = object URL của trình duyệt). */
export interface BizAttachment {
  id: string;
  name: string;
  size: number;
  url?: string;
}
/** Phụ lục điều chỉnh hợp đồng. */
export interface BizAddendum {
  id: string;
  number: string; // Số phụ lục
  signDate: string; // Ngày ký
  content: string; // Nội dung điều chỉnh
  files: BizAttachment[]; // File phụ lục
}
export interface BizContract {
  number: string; // Số hợp đồng
  signDate: string; // Ngày ký
  value: number; // Giá trị hợp đồng (VNĐ)
  from: string; // Thời hạn thực hiện — từ
  to: string; // — đến
  deviationReason: string; // Lý do lệch so với giá trị đã khai báo (Doanh thu dự kiến)
  files: BizAttachment[]; // Hợp đồng và các tài liệu đính kèm
  addenda: BizAddendum[];
  updatedAt: string;
  updatedBy: string;
}

export const plannedCost = (p: Pick<BizProject, 'plannedBusinessCost' | 'plannedProductionCost'>) =>
  (p.plannedBusinessCost || 0) + (p.plannedProductionCost || 0);
export const grossProfit = (p: Pick<BizProject, 'expectedRevenue' | 'plannedBusinessCost' | 'plannedProductionCost'>) =>
  (p.expectedRevenue || 0) - plannedCost(p);
export const grossMargin = (p: Pick<BizProject, 'expectedRevenue' | 'plannedBusinessCost' | 'plannedProductionCost'>) =>
  p.expectedRevenue ? (grossProfit(p) / p.expectedRevenue) * 100 : 0;

/** Gợi ý mã Master tiếp theo cho mã khách hàng (số thứ tự lớn nhất + 1). */
/** Mã KD = Master.1, Mã SX = Master.2. */
export interface BizOutsource {
  code: string;
  pm: string;
  createdAt: string;
  createdBy: string;
}
/** Số mã outsource tối đa của một dự án. */
export const MAX_OUTSOURCE = 2;
/** Mã outsource kế tiếp còn trống: Mã tổng.3, Mã tổng.4. */
export const nextOutsourceCode = (p: Pick<BizProject, 'masterCode' | 'outsourceCodes'>) => {
  if (!p.masterCode) return '';
  const used = new Set((p.outsourceCodes || []).map((o) => o.code));
  for (let i = 3; i < 3 + MAX_OUTSOURCE; i++) if (!used.has(`${p.masterCode}.${i}`)) return `${p.masterCode}.${i}`;
  return '';
};

export const codesFrom = (master: string) => ({ masterCode: master, businessCode: master ? `${master}.1` : '', productionCode: master ? `${master}.2` : '' });

export const nextMasterCode = (projects: BizProject[], customerCode: string) => {
  const cc = customerCode.trim();
  if (!cc) return '';
  const max = projects
    .filter((p) => p.masterCode.startsWith(cc + '.'))
    .map((p) => parseInt(p.masterCode.slice(cc.length + 1), 10))
    .filter((n) => !isNaN(n))
    .reduce((m, n) => Math.max(m, n), 0);
  return `${cc}.${String(max + 1).padStart(3, '0')}`;
};

const now = () => new Date().toISOString();

const seedPhases = (rows: [string, string, string][]): BizPhase[] =>
  DEFAULT_PHASES.map((p, i) => ({ ...p, start: rows[i][0], end: rows[i][1], pic: rows[i][2] }));

// Rải đều tổng cho n tháng (tiền làm tròn tới triệu VNĐ), phần dư dồn vào tháng cuối để tổng khớp tuyệt đối.
const spread = (total: number, n: number) => {
  const unit = total >= 100_000_000 ? 1_000_000 : 1;
  const each = Math.floor(total / n / unit) * unit;
  return Array.from({ length: n }, (_, i) => (i === n - 1 ? total - each * (n - 1) : each));
};
// Kế hoạch mẫu: rải đều theo tháng; thu tiền về trễ 1 tháng so với doanh thu.
const seedPlan = (start: string, end: string, rev: number, costSx: number, costKd: number, sp: number): BizMonthRow[] => {
  const months = monthsBetween(start, end);
  const n = months.length;
  const r = spread(rev, n);
  const cSx = spread(costSx, n);
  const cKd = spread(costKd, n);
  const w = spread(sp, n);
  return months.map((month, i) => ({
    month,
    revenue: r[i],
    cashIn: i === 0 ? 0 : r[i - 1] + (i === n - 1 ? r[i] : 0),
    costSx: cSx[i],
    costKd: cKd[i],
    workload: w[i],
  }));
};

// Số thực tế mẫu đến tháng chốt: = kế hoạch × tỷ lệ thực hiện, dao động nhẹ theo tháng.
const SEED_CUTOFF = '2026-08';
type Ratios = { revenue: number; cashIn: number; cost: number; workload: number };
const seedActual = (plan: BizMonthRow[], k: Ratios): BizMonthRow[] =>
  plan
    .filter((r) => r.month <= SEED_CUTOFF)
    .map((r, i) => {
      const wave = (x: number) => Math.round((x * (1 + 0.06 * Math.sin(i * 1.7 + 1))) / 1000) * 1000;
      return {
        month: r.month,
        revenue: wave(r.revenue * k.revenue),
        cashIn: wave(r.cashIn * k.cashIn),
        costSx: wave(r.costSx * k.cost),
        costKd: wave(r.costKd * k.cost),
        workload: Math.round(r.workload * k.workload),
      };
    });

/** Cộng n ngày vào ngày YYYY-MM-DD. */
export const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Dự án mẫu phục vụ báo cáo — các khối khác nhau, tỷ lệ thực hiện khác nhau.
const seedProject = (
  id: string,
  name: string,
  masterCode: string,
  division: string,
  customer: string,
  start: string,
  end: string,
  money: [revenue: number, costSx: number, costKd: number, workload: number],
  k: Ratios,
  pm: [business: string, production: string],
): BizProject => {
  const [rev, costSx, costKd, sp] = money;
  const plan = seedPlan(start, end, rev, costSx, costKd, sp);
  const at = `${start}T08:00:00.000Z`;
  const importedAt = '2026-09-05T09:00:00.000Z';
  return {
    id,
    name,
    isKey: false,
    version: 3,
    status: 'Đang thực hiện',
    expectedSignDate: start,
    pakd: [{ version: 1, submittedAt: addDays(start, -20), submittedBy: pm[0], state: 'Đã duyệt', decidedAt: addDays(start, -12), decidedBy: 'CFO' }],
    masterCode,
    businessCode: `${masterCode}.1`,
    productionCode: `${masterCode}.2`,
    businessPm: pm[0],
    productionPm: pm[1],
    division,
    projectType: 'Fixed Cost',
    customerName: customer,
    customerCode: masterCode.split('.')[0],
    businessDirector: pm[0],
    salesDirector: pm[0],
    creator: 'namnv',
    am: [pm[0]],
    startDate: start,
    endDate: end,
    expectedRevenue: rev,
    plannedBusinessCost: costKd,
    plannedProductionCost: costSx,
    contractSigned: true,
    contract: {
      number: `HĐ-${masterCode.replace('.', '/')}/2026`,
      signDate: start,
      value: rev,
      from: start,
      to: end,
      deviationReason: '',
      files: [
        {
          id: `file-${masterCode}`,
          name: `HopDong_${masterCode}.pdf`,
          size: 2150000,
        },
      ],
      addenda: [],
      updatedAt: at,
      updatedBy: 'namnv',
    },
    phases: blankPhases(),
    currentPhase: 'KH05',
    plan,
    planImport: { fileName: `KeHoach_${masterCode}.xlsx`, at, by: 'namnv' },
    actual: seedActual(plan, k),
    actualImport: { fileName: `ThucTe_${masterCode}_T08-2026.xlsx`, at: importedAt, by: 'ketoan' },
    createdAt: at,
    updatedAt: importedAt,
    history: [
      { at, by: 'namnv', action: 'Tạo dự án', note: 'Version 1' },
      { at, by: 'namnv', action: 'Import kế hoạch', note: `KeHoach_${masterCode}.xlsx · Version 2` },
      { at: importedAt, by: 'ketoan', action: 'Import thực tế', note: `ThucTe_${masterCode}_T08-2026.xlsx · Version 3` },
    ],
  };
};

const SEED: BizProject[] = [
  {
    id: 'BP-1',
    name: '022.NSG',
    isKey: true,
    version: 2,
    status: 'PAKD chờ duyệt',
    expectedSignDate: '2026-11-15',
    pakdDeadline: '2026-09-30',
    pakd: [{ version: 1, submittedAt: '2026-09-29', submittedBy: 'Nguyễn Đằng Giang', state: 'Chờ CFO' }],
    masterCode: '022.688',
    businessCode: '022.688.1',
    productionCode: '022.688.2',
    businessPm: 'Nguyễn Đằng Giang',
    productionPm: 'Phạm Hữu Trường',
    division: 'G1',
    projectType: 'Fixed Cost',
    customerName: '022',
    customerCode: '022',
    businessDirector: 'Lê Hoài Thanh',
    salesDirector: 'Lê Hoài Thanh',
    creator: '',
    am: ['Nguyễn Đằng Giang', 'Nguyễn Thị Huyền'],
    startDate: '2026-12-01',
    endDate: '2028-12-12',
    expectedRevenue: 145_000_000_000,
    plannedBusinessCost: 18_966_430_357,
    plannedProductionCost: 48_371_000_000,
    contractSigned: false,
    phases: seedPhases([
      ['2026-01-12', '2026-03-31', 'Phạm Hữu Trường'],
      ['2026-04-01', '2026-06-30', 'Nguyễn Đằng Giang'],
      ['2026-07-01', '2026-08-31', 'Lê Hoài Thanh'],
      ['2026-09-01', '2026-11-30', 'Nguyễn Thị Huyền'],
      ['2026-12-01', '2027-12-01', 'Phạm Hữu Trường'],
    ]),
    currentPhase: 'KH05',
    plan: seedPlan('2026-12-01', '2028-12-12', 145_000_000_000, 48_371_000_000, 18_966_430_357, 1_200),
    planImport: { fileName: 'KeHoach_022.688.xlsx', at: '2026-09-15T10:30:00.000Z', by: 'namnv' },
    actual: [],
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-15T10:30:00.000Z',
    history: [
      { at: '2026-09-01T09:00:00.000Z', by: 'namnv', action: 'Tạo dự án', note: 'Version 1' },
      { at: '2026-09-15T10:30:00.000Z', by: 'namnv', action: 'Cập nhật', note: 'Version 2' },
    ],
  },
  {
    id: 'BP-2',
    name: 'Hệ thống giám sát dữ liệu tập trung',
    isKey: false,
    version: 1,
    status: 'Đang thực hiện',
    expectedSignDate: '2026-02-25',
    pakd: [{ version: 1, submittedAt: '2026-02-10', submittedBy: 'Trần Minh Đức', state: 'Đã duyệt', decidedAt: '2026-02-18', decidedBy: 'CFO' }],
    masterCode: '038.360',
    businessCode: '038.360.1',
    productionCode: '038.360.2',
    businessPm: 'Trần Minh Đức',
    productionPm: 'Vũ Thị Lan',
    division: 'G3',
    projectType: 'Time & Material',
    customerName: 'Tổng công ty 038',
    customerCode: '038',
    businessDirector: 'Đỗ Quang Huy',
    salesDirector: 'Hoàng Văn Nam',
    creator: 'namnv',
    am: ['Trần Minh Đức'],
    startDate: '2026-03-01',
    endDate: '2027-02-28',
    expectedRevenue: 12_500_000_000,
    plannedBusinessCost: 1_200_000_000,
    plannedProductionCost: 7_800_000_000,
    contractSigned: true,
    contract: {
      number: 'HĐ-038/2026/TM',
      signDate: '2026-02-25',
      value: 12_500_000_000,
      from: '2026-03-01',
      to: '2027-02-28',
      deviationReason: '',
      files: [
        {
          id: 'file-038',
          name: 'HopDong_038.360.pdf',
          size: 1850000,
        },
      ],
      addenda: [],
      updatedAt: '2026-02-25T09:00:00.000Z',
      updatedBy: 'namnv',
    },
    phases: seedPhases([
      ['2025-10-01', '2025-11-15', 'Trần Minh Đức'],
      ['2025-11-16', '2025-12-31', 'Vũ Thị Lan'],
      ['2026-01-02', '2026-01-31', 'Hoàng Văn Nam'],
      ['2026-02-01', '2026-02-28', 'Đỗ Quang Huy'],
      ['2026-03-01', '2027-02-28', 'Vũ Thị Lan'],
    ]),
    currentPhase: 'KH05',
    plan: seedPlan('2026-03-01', '2027-02-28', 12_500_000_000, 7_800_000_000, 1_200_000_000, 300),
    planImport: { fileName: 'KeHoach_038.360.xlsx', at: '2026-02-20T08:00:00.000Z', by: 'namnv' },
    actual: seedActual(seedPlan('2026-03-01', '2027-02-28', 12_500_000_000, 7_800_000_000, 1_200_000_000, 300), {
      revenue: 0.96,
      cashIn: 0.9,
      cost: 1.04,
      workload: 0.95,
    }),
    actualImport: { fileName: 'ThucTe_038.360_T08-2026.xlsx', at: '2026-09-05T09:00:00.000Z', by: 'ketoan' },
    createdAt: '2026-02-20T08:00:00.000Z',
    updatedAt: '2026-02-20T08:00:00.000Z',
    history: [{ at: '2026-02-20T08:00:00.000Z', by: 'namnv', action: 'Tạo dự án', note: 'Version 1' }],
  },
  {
    id: 'BP-3',
    name: 'Core Banking Mobile Upgrade',
    isKey: true,
    version: 1,
    status: 'Chưa có PAKD',
    expectedSignDate: '2026-10-20',
    pakdDeadline: '2026-10-03',
    pakd: [],
    masterCode: '010.541',
    businessCode: '010.541.1',
    productionCode: '010.541.2',
    businessPm: 'Lý Thu Hà',
    productionPm: 'Ngô Bá Khá',
    division: 'BFSI',
    projectType: 'Fixed Cost',
    customerName: 'Ngân hàng 010',
    customerCode: '010',
    businessDirector: 'Phan Anh Tuấn',
    salesDirector: 'Phan Anh Tuấn',
    creator: 'namnv',
    am: ['Lý Thu Hà', 'Mai Văn Tùng'],
    startDate: '2026-10-01',
    endDate: '2027-09-30',
    expectedRevenue: 38_000_000_000,
    plannedBusinessCost: 4_100_000_000,
    plannedProductionCost: 21_600_000_000,
    contractSigned: false,
    phases: seedPhases([
      ['2026-06-01', '2026-07-15', 'Lý Thu Hà'],
      ['2026-07-16', '2026-08-31', 'Ngô Bá Khá'],
      ['2026-09-01', '2026-10-15', 'Phan Anh Tuấn'],
      ['2026-10-16', '2026-10-31', 'Mai Văn Tùng'],
      ['2026-11-01', '2027-09-30', 'Ngô Bá Khá'],
    ]),
    currentPhase: 'KH03',
    plan: [],
    actual: [],
    createdAt: '2026-09-25T14:00:00.000Z',
    updatedAt: '2026-09-25T14:00:00.000Z',
    history: [{ at: '2026-09-25T14:00:00.000Z', by: 'namnv', action: 'Tạo dự án', note: 'Version 1' }],
  },
  // prettier-ignore
  ...[
    seedProject('BP-4', 'Nền tảng chuyển đổi số quốc gia', '022.061', 'G1', 'Bộ 022', '2026-01-01', '2027-12-31', [1_000_000_000_000, 520_000_000_000, 90_000_000_000, 24_000], { revenue: 1.02, cashIn: 0.97, cost: 0.92, workload: 1 }, ['Nguyễn Đằng Giang', 'Phạm Hữu Trường']),
    seedProject('BP-5', 'ERP Tập đoàn 022', '022.070', 'G1', 'Tập đoàn 022', '2026-01-01', '2027-06-30', [250_000_000_000, 150_000_000_000, 25_000_000_000, 6_000], { revenue: 0.78, cashIn: 0.6, cost: 1.12, workload: 0.85 }, ['Lê Hoài Thanh', 'Nguyễn Thị Huyền']),
    seedProject('BP-6', 'Hệ thống bán lẻ đa kênh', '045.112', 'G2', 'Bán lẻ 045', '2026-02-01', '2026-12-31', [48_000_000_000, 27_500_000_000, 5_100_000_000, 1_100], { revenue: 0.9, cashIn: 0.8, cost: 1.05, workload: 0.92 }, ['Bùi Quang Minh', 'Đặng Thu Trang']),
    seedProject('BP-7', 'Data Lake phân tích khách hàng', '045.118', 'G2', 'Bán lẻ 045', '2026-01-01', '2026-10-31', [6_500_000_000, 3_400_000_000, 650_000_000, 150], { revenue: 0.98, cashIn: 0.96, cost: 0.95, workload: 1 }, ['Bùi Quang Minh', 'Hoàng Gia Bảo']),
    seedProject('BP-8', 'Nền tảng IoT nhà máy', '061.020', 'G4', 'Sản xuất 061', '2026-01-01', '2027-03-31', [120_000_000_000, 68_000_000_000, 10_000_000_000, 2_800], { revenue: 0.92, cashIn: 0.9, cost: 1.35, workload: 1.1 }, ['Trịnh Văn Long', 'Phí Thị Mai']),
    seedProject('BP-9', 'Hệ thống chấm điểm tín dụng', '010.530', 'BFSI', 'Ngân hàng 010', '2026-01-01', '2026-12-31', [520_000_000_000, 280_000_000_000, 48_000_000_000, 11_000], { revenue: 1, cashIn: 0.99, cost: 0.9, workload: 0.98 }, ['Lý Thu Hà', 'Ngô Bá Khá']),
    // Mã khớp với file mẫu của kế toán (Mẫu dòng tiền thu / Chi thực tế 02.2026)
    seedProject('BP-11', 'HDBank Staffing', '818.111', 'BFSI', 'CÔNG TY CỔ PHẦN GALAXY TECHNOLOGY SERVICES', '2026-01-01', '2026-12-31', [4_800_000_000, 3_600_000_000, 240_000_000, 240], { revenue: 0.97, cashIn: 0.93, cost: 0.98, workload: 1 }, ['Lý Thu Hà', 'Ngô Bá Khá']),
    seedProject('BP-12', 'LPB Staffing', '868.222', 'BFSI', 'CÔNG TY CỔ PHẦN ATOMI DIGITAL', '2026-01-01', '2026-12-31', [1_200_000_000, 850_000_000, 60_000_000, 96], { revenue: 1, cashIn: 0.96, cost: 0.95, workload: 1 }, ['Lý Thu Hà', 'Mai Văn Tùng']),
    seedProject('BP-13', 'Digilend', '993.993', 'GPDV', 'CÔNG TY CỔ PHẦN CÔNG NGHỆ TÀI CHÍNH DIGILEND', '2026-01-01', '2026-12-31', [600_000_000, 420_000_000, 30_000_000, 48], { revenue: 0.95, cashIn: 0.9, cost: 1.02, workload: 1 }, ['Vương Đình Khôi', 'Tạ Minh Châu']),
    {
      ...seedProject('BP-14', 'Cổng thanh toán điện tử tỉnh', '022.072', 'G1', 'Sở Tài chính 022', '2026-11-01', '2027-10-31', [15_000_000_000, 8_000_000_000, 1_500_000_000, 360], { revenue: 1, cashIn: 1, cost: 1, workload: 1 }, ['Nguyễn Đằng Giang', 'Phạm Hữu Trường']),
      status: 'Chờ duyệt mã' as BizStatus,
      expectedSignDate: '2026-10-25',
      pakd: [],
      plan: [],
      planImport: undefined,
      actual: [],
      actualImport: undefined,
      contractSigned: false,
      version: 1,
      history: [{ at: '2026-09-28T08:00:00.000Z', by: 'Nguyễn Đằng Giang', action: 'Tạo dự án', note: 'Version 1 · chờ GĐK duyệt mã' }],
    },
    {
      ...seedProject('BP-15', 'Chuyển đổi số kho bạc', '045.120', 'G2', 'Kho bạc 045', '2026-12-01', '2027-11-30', [26_000_000_000, 14_300_000_000, 2_600_000_000, 520], { revenue: 1, cashIn: 1, cost: 1, workload: 1 }, ['Bùi Quang Minh', 'Đặng Thu Trang']),
      status: 'PAKD chờ duyệt' as BizStatus,
      expectedSignDate: '2026-11-20',
      pakdDeadline: '2026-09-18',
      pakd: [
        { version: 1, submittedAt: '2026-09-15', submittedBy: 'Bùi Quang Minh', state: 'Từ chối', decidedAt: '2026-09-20', decidedBy: 'CFO', note: 'Biên LN gộp thấp, rà soát lại chi phí thuê ngoài' },
        { version: 2, submittedAt: '2026-09-26', submittedBy: 'Bùi Quang Minh', state: 'Chờ CFO' },
      ] as PakdVersion[],
      actual: [],
      actualImport: undefined,
      contractSigned: false,
    },
    {
      ...seedProject('BP-16', 'Triển khai ERP giai đoạn 1', '061.015', 'G4', 'Sản xuất 061', '2025-10-01', '2026-06-30', [4_500_000_000, 2_600_000_000, 400_000_000, 120], { revenue: 1, cashIn: 1, cost: 0.97, workload: 1 }, ['Trịnh Văn Long', 'Phí Thị Mai']),
      status: 'Kết thúc' as BizStatus,
    },
    seedProject('BP-10', 'Dịch vụ vận hành hạ tầng', '077.004', 'GPDV', 'Tổng công ty 077', '2026-01-01', '2026-12-31', [500_000_000, 300_000_000, 50_000_000, 12], { revenue: 0.88, cashIn: 0.75, cost: 1, workload: 0.9 }, ['Vương Đình Khôi', 'Tạ Minh Châu']),
  ],
];

// Sổ chi tiết mẫu = tách Thu / Chi thực tế mẫu của từng tháng thành nhiều dòng (tổng khớp tuyệt đối).
const splitAmount = (total: number, weights: number[]) => {
  const parts = weights.map((w) => Math.round((total * w) / 1000) * 1000);
  parts[0] += total - parts.reduce((a, b) => a + b, 0);
  return parts.filter((x) => x !== 0);
};
const COST_SX_NOTES = ['Lương nhân sự sản xuất', 'BHXH, BHYT, KPCĐ', 'Thuê ngoài gia công phần mềm', 'Mua bản quyền / thiết bị', 'Công tác phí triển khai'];
const COST_KD_NOTES = ['Chi phí tiếp khách, hội nghị', 'Hoa hồng / chi phí bán hàng'];
const seedLedger = (projects: BizProject[]): Ledger => {
  const cashIn: CashInEntry[] = [];
  const cost: CostEntry[] = [];
  projects.forEach((p) =>
    p.actual.forEach((r, i) => {
      const [y, m] = r.month.split('-');
      const prevM = +m === 1 ? `12.${+y - 1}` : `${+m - 1}.${y}`;
      splitAmount(r.cashIn, [0.7, 0.3]).forEach((amount, j) =>
        cashIn.push({
          id: `CI-${p.id}-${r.month}-${j}`,
          date: `${r.month}-${String(8 + j * 9 + (i % 5)).padStart(2, '0')}`,
          month: r.month,
          description: j === 0 ? `Thu tiền doanh thu ${p.name} tháng ${prevM}` : `Thu tiền nghiệm thu đợt ${i + 1} - Hợp đồng ${p.masterCode}/2026/HĐ`,
          amount,
          partner: p.customerName.toUpperCase(),
          projectCode: p.productionCode,
          projectName: p.name,
          unitCode: p.division,
          unitName: p.division,
        }),
      );
      splitAmount(r.costSx, [0.55, 0.2, 0.12, 0.08, 0.05]).forEach((v, j) =>
        cost.push({ id: `CO-${p.id}-${r.month}-sx${j}`, projectCode: p.productionCode, month: r.month, costSx: v, costKd: 0, note: COST_SX_NOTES[j] }),
      );
      splitAmount(r.costKd, [0.65, 0.35]).forEach((v, j) =>
        cost.push({ id: `CO-${p.id}-${r.month}-kd${j}`, projectCode: p.productionCode, month: r.month, costSx: 0, costKd: v, note: COST_KD_NOTES[j] }),
      );
    }),
  );
  const at = '2026-09-05T09:00:00.000Z';
  const months = [...new Set(cashIn.map((e) => e.month))].sort();
  return {
    cashIn,
    cost,
    imports: [
      { kind: 'cashIn', fileName: 'Mau_dong_tien_thu_T01-T08.2026.xlsx', months, lines: cashIn.length, at, by: 'ketoan' },
      { kind: 'cost', fileName: 'Chi_thuc_te_T01-T08.2026.xlsx', months, lines: cost.length, at, by: 'ketoan' },
    ],
  };
};

interface Ctx {
  projects: BizProject[];
  ledger: Ledger;
  /**
   * Import sổ chi tiết kế toán (toàn công ty). Dữ liệu các tháng có trong file thay thế dữ liệu cũ
   * của loại sổ đó; Thu / Chi thực tế của dự án liên quan được tính lại = tổng các dòng.
   */
  importLedger: (kind: LedgerKind, entries: CashInEntry[] | CostEntry[], months: string[], fileName: string, by: string) => void;
  createProject: (data: BizProjectInput, by: string) => BizProject;
  updateProject: (id: string, data: BizProjectInput, by: string, note?: string) => void;
  deleteProject: (id: string) => void;
  /** Ghi số liệu theo tháng (kế hoạch hoặc thực tế) bằng dữ liệu import; tăng version. */
  importMonthly: (id: string, kind: FinKind, rows: BizMonthRow[], fileName: string, by: string) => void;
  /** Cập nhật ký hợp đồng → dự án chuyển "Đã ký"; tăng version. */
  saveContract: (id: string, contract: Omit<BizContract, 'updatedAt' | 'updatedBy'>, by: string) => void;
  /** Quy trình: duyệt mã / nộp PAKD / duyệt – từ chối PAKD / kết thúc dự án. */
  /** GĐK duyệt mã → hệ thống sinh Mã dự án / KD / SX, hạn PAKD = hôm nay + PAKD_DAYS. */
  approveCode: (id: string, by: string) => { deadline: string; code: string };
  /** Kế toán mở lại dự án đã đóng → Chưa có PAKD, hạn PAKD mới. Trả về hạn PAKD. */
  reopenProject: (id: string, by: string) => string;
  submitPakd: (id: string, by: string) => void;
  /** Lưu nháp / gửi duyệt PAKD lập trên hệ thống. Gửi duyệt → cập nhật số liệu dự án + kế hoạch theo tháng. */
  savePakdForm: (id: string, form: PakdFormData, by: string, submit: boolean) => void;
  decidePakd: (id: string, approve: boolean, role: BizRole, by: string, note: string) => void;
  finishProject: (id: string, by: string) => void;
  /** Thêm / xoá tài liệu đính kèm của dự án (ghi lịch sử, không tăng version). */
  setAttachments: (id: string, files: BizAttachment[], by: string, note: string) => void;
  /** Tạo mã outsource (tối đa MAX_OUTSOURCE). Trả về mã mới hoặc '' nếu đã đủ / chưa có mã tổng. */
  addOutsourceCode: (id: string, pm: string, by: string) => string;
  /** Đổi PM phụ trách mã outsource. */
  setOutsourcePm: (id: string, code: string, pm: string, by: string) => void;
  /** Xoá mã outsource. */
  removeOutsourceCode: (id: string, code: string, by: string) => void;
  /** Mục tiêu giá trị hợp đồng ký theo năm / khối. */
  targets: SignTargets;
  setYearTargets: (year: string, byDivision: Record<string, number>) => void;
}

const BusinessProjectContext = createContext<Ctx | null>(null);

export const BusinessProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<BizProject[]>(SEED);
  const [ledger, setLedger] = useState<Ledger>(() => seedLedger(SEED));
  const [targets, setTargets] = useState<SignTargets>(SEED_TARGETS);
  const setYearTargets = (year: string, byDivision: Record<string, number>) => setTargets((prev) => ({ ...prev, [year]: byDivision }));

  const createProject = (data: BizProjectInput, by: string) => {
    const at = now();
    const p: BizProject = {
      ...data,
      id: `BP-${Date.now()}`,
      version: 1,
      pakd: [],
      plan: [],
      actual: [],
      createdAt: at,
      updatedAt: at,
      history: [{ at, by, action: 'Tạo dự án', note: 'Version 1' }],
    };
    setProjects((prev) => [p, ...prev]);
    return p;
  };

  const updateProject = (id: string, data: BizProjectInput, by: string, note?: string) => {
    const at = now();
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...data,
              version: p.version + 1,
              updatedAt: at,
              history: [...p.history, { at, by, action: 'Cập nhật', note: note || `Version ${p.version + 1}` }],
            }
          : p,
      ),
    );
  };

  const deleteProject = (id: string) => setProjects((prev) => prev.filter((p) => p.id !== id));

  const today = () => now().slice(0, 10);
  /** Cập nhật 1 dự án + ghi lịch sử. */
  const patch = (id: string, fn: (p: BizProject) => Partial<BizProject>, by: string, action: string, note?: string) => {
    const at = now();
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...fn(p), updatedAt: at, history: [...p.history, { at, by, action, note }] } : p)));
  };

  const dmyOf = (d: string) => d.split('-').reverse().join('/');
  const approveCode = (id: string, by: string) => {
    const pakdDeadline = addDays(today(), PAKD_DAYS);
    const p0 = projects.find((p) => p.id === id);
    const code = p0?.masterCode || nextMasterCode(projects, p0?.customerCode || '');
    patch(
      id,
      () => ({ status: 'Chưa có PAKD', codeIssuedAt: today(), pakdDeadline, ...codesFrom(code) }),
      by,
      'Duyệt mã dự án',
      `Cấp mã ${code} · Hạn lập PAKD: ${dmyOf(pakdDeadline)}`,
    );
    return { deadline: pakdDeadline, code };
  };

  const reopenProject = (id: string, by: string) => {
    const pakdDeadline = addDays(today(), PAKD_DAYS);
    patch(id, () => ({ status: 'Chưa có PAKD', pakdDeadline, closedAt: undefined }), by, 'Mở lại dự án', `Hạn lập PAKD mới: ${dmyOf(pakdDeadline)}`);
    return pakdDeadline;
  };

  /** Tự động đóng dự án đã cấp mã quá PAKD_DAYS ngày mà chưa từng nộp PAKD. */
  useEffect(() => {
    const t = today();
    const overdue = projects.filter((p) => p.status === 'Chưa có PAKD' && p.pakd.length === 0 && p.pakdDeadline && p.pakdDeadline < t);
    if (!overdue.length) return;
    const at = now();
    const ids = new Set(overdue.map((p) => p.id));
    setProjects((prev) =>
      prev.map((p) =>
        ids.has(p.id) && p.status === 'Chưa có PAKD'
          ? {
              ...p,
              status: 'Đóng',
              closedAt: t,
              updatedAt: at,
              history: [...p.history, { at, by: 'Hệ thống', action: 'Tự động đóng dự án', note: `Quá ${PAKD_DAYS} ngày kể từ ngày cấp mã chưa nộp PAKD (hạn ${dmyOf(p.pakdDeadline!)})` }],
            }
          : p,
      ),
    );
  }, [projects]);

  const submitPakd = (id: string, by: string) =>
    patch(
      id,
      (p) => ({ status: 'PAKD chờ duyệt', pakd: [...p.pakd, { version: p.pakd.length + 1, submittedAt: today(), submittedBy: by, state: 'Chờ CFO' }] }),
      by,
      'Nộp PAKD',
      'Chờ Kế toán (CFO) duyệt',
    );

  const savePakdForm = (id: string, form: PakdFormData, by: string, submit: boolean) => {
    const f: PakdFormData = { ...form, savedAt: now(), savedBy: by };
    if (!submit) return patch(id, () => ({ pakdForm: f }), by, 'Lưu nháp PAKD');
    const t = pakdTotals(f);
    const signed = f.contractState === 'Đã ký';
    const plan = pakdMonthlyPlan(f);
    patch(
      id,
      (p) => ({
        pakdForm: f,
        status: 'PAKD chờ duyệt',
        pakd: [...p.pakd, { version: p.pakd.length + 1, submittedAt: today(), submittedBy: by, state: 'Chờ CFO' }],
        expectedRevenue: t.revenue,
        plannedProductionCost: t.sx,
        plannedBusinessCost: t.kd,
        contractSigned: signed,
        expectedSignDate: signed ? f.actualSignDate || f.contractDate || p.expectedSignDate : f.expectedSignMonth ? `${f.expectedSignMonth}-01` : p.expectedSignDate,
        ...(signed && f.startMonth ? { startDate: `${f.startMonth}-01` } : {}),
        ...(signed && f.endMonth ? { endDate: `${f.endMonth}-28` } : {}),
        ...(plan.length ? { plan, planImport: { fileName: 'PAKD lập trên hệ thống', at: now(), by } } : {}),
        ...(signed
          ? {
              contract: {
                ...(p.contract || { deviationReason: '', files: [], addenda: [] }),
                number: f.contractNo || p.contract?.number || '',
                signDate: f.actualSignDate || f.contractDate || p.contract?.signDate || '',
                value: f.contractValue,
                from: f.startMonth ? `${f.startMonth}-01` : p.contract?.from || '',
                to: f.endMonth ? `${f.endMonth}-28` : p.contract?.to || '',
                updatedAt: now(),
                updatedBy: by,
              },
            }
          : {}),
      }),
      by,
      'Nộp PAKD',
      `${signed ? 'Đã ký' : 'Chưa ký'} · Doanh thu ${Math.round(t.revenue).toLocaleString('en-US')} · Chi phí ${Math.round(t.cost).toLocaleString('en-US')} · Chờ Kế toán (CFO) duyệt`,
    );
  };

  const decidePakd = (id: string, approve: boolean, role: BizRole, by: string, note: string) =>
    patch(
      id,
      (p) => {
        const last = latestPakd(p)!;
        const next: PakdVersion = !approve
          ? { ...last, state: 'Từ chối', decidedAt: today(), decidedBy: role, note }
          : { ...last, state: 'Đã duyệt', decidedAt: today(), decidedBy: role, note: note || last.note };
        return {
          pakd: [...p.pakd.slice(0, -1), next],
          status: !approve ? 'Chưa có PAKD' : 'Đang thực hiện',
        };
      },
      by,
      `${role} ${approve ? 'duyệt' : 'từ chối'} PAKD`,
      note || undefined,
    );

  const finishProject = (id: string, by: string) => patch(id, () => ({ status: 'Kết thúc' }), by, 'Kết thúc dự án');

  const addOutsourceCode = (id: string, pm: string, by: string) => {
    const p0 = projects.find((p) => p.id === id);
    const code = p0 && (p0.outsourceCodes || []).length < MAX_OUTSOURCE ? nextOutsourceCode(p0) : '';
    if (!code) return '';
    patch(
      id,
      (p) => ({ outsourceCodes: [...(p.outsourceCodes || []), { code, pm, createdAt: now(), createdBy: by }].sort((a, b) => a.code.localeCompare(b.code)) }),
      by,
      'Tạo mã outsource',
      `${code}${pm ? ` · PM ${pm}` : ''}`,
    );
    return code;
  };
  const setOutsourcePm = (id: string, code: string, pm: string, by: string) =>
    patch(id, (p) => ({ outsourceCodes: (p.outsourceCodes || []).map((o) => (o.code === code ? { ...o, pm } : o)) }), by, 'Cập nhật PM outsource', `${code} · ${pm || 'bỏ PM'}`);
  const removeOutsourceCode = (id: string, code: string, by: string) =>
    patch(id, (p) => ({ outsourceCodes: (p.outsourceCodes || []).filter((o) => o.code !== code) }), by, 'Xoá mã outsource', code);

  const setAttachments = (id: string, files: BizAttachment[], by: string, note: string) => {
    const at = now();
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, attachments: files, updatedAt: at, history: [...p.history, { at, by, action: 'Cập nhật tài liệu đính kèm', note }] } : p,
      ),
    );
  };

  const saveContract = (id: string, contract: Omit<BizContract, 'updatedAt' | 'updatedBy'>, by: string) => {
    const at = now();
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              contractSigned: true,
              contract: { ...contract, updatedAt: at, updatedBy: by },
              version: p.version + 1,
              updatedAt: at,
              history: [
                ...p.history,
                {
                  at,
                  by,
                  action: p.contract ? 'Cập nhật hợp đồng' : 'Ký hợp đồng',
                  note: `HĐ ${contract.number} · ${contract.addenda.length} phụ lục · Version ${p.version + 1}`,
                },
              ],
            }
          : p,
      ),
    );
  };

  const importMonthly = (id: string, kind: FinKind, rows: BizMonthRow[], fileName: string, by: string) => {
    const at = now();
    const sorted = [...rows].sort((a, b) => a.month.localeCompare(b.month));
    const action = kind === 'plan' ? 'Import kế hoạch' : 'Import thực tế';
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...(kind === 'plan' ? { plan: sorted, planImport: { fileName, at, by } } : { actual: sorted, actualImport: { fileName, at, by } }),
              version: p.version + 1,
              updatedAt: at,
              history: [...p.history, { at, by, action, note: `${fileName} · ${rows.length} tháng · Version ${p.version + 1}` }],
            }
          : p,
      ),
    );
  };

  const importLedger = (kind: LedgerKind, entries: CashInEntry[] | CostEntry[], months: string[], fileName: string, by: string) => {
    const at = now();
    const inMonths = (e: { month: string }) => months.includes(e.month);
    const old: (CashInEntry | CostEntry)[] = kind === 'cashIn' ? ledger.cashIn : ledger.cost;
    const next = [...old.filter((e) => !inMonths(e)), ...entries];
    setLedger((prev) => ({
      ...prev,
      [kind]: next,
      imports: [{ kind, fileName, months, lines: entries.length, at, by }, ...prev.imports],
    }));

    // Dự án bị ảnh hưởng: có dòng trong file mới, hoặc từng có dòng ở các tháng này (import lại để sửa)
    const touched = new Set(
      [...old.filter(inMonths), ...entries].map((e) => matchProject(projects, e.projectCode)?.id).filter((id): id is string => !!id),
    );
    const total = (lines: (CashInEntry | CostEntry)[], k: 'amount' | 'costSx' | 'costKd') =>
      lines.reduce((a, e) => a + ('amount' in e ? (k === 'amount' ? e.amount : 0) : k === 'amount' ? 0 : e[k]), 0);
    setProjects((prev) =>
      prev.map((p) => {
        if (!touched.has(p.id)) return p;
        const codes = projectCodes(p);
        const mine = next.filter((e) => inMonths(e) && codes.includes(e.projectCode.trim().toLowerCase()));
        const rows = new Map<string, BizMonthRow>(p.actual.map((r) => [r.month, { ...r }]));
        months.forEach((m) => {
          const lines = mine.filter((e) => e.month === m);
          const row = rows.get(m) || { month: m, revenue: 0, cashIn: 0, costSx: 0, costKd: 0, workload: 0 };
          if (kind === 'cashIn') row.cashIn = total(lines, 'amount');
          else {
            row.costSx = total(lines, 'costSx');
            row.costKd = total(lines, 'costKd');
          }
          if (lines.length || rows.has(m)) rows.set(m, row);
        });
        const label = kind === 'cashIn' ? 'Dòng tiền thu' : 'Chi thực tế';
        return {
          ...p,
          actual: [...rows.values()].sort((a, b) => a.month.localeCompare(b.month)),
          updatedAt: at,
          history: [...p.history, { at, by, action: `Cập nhật ${label} từ sổ kế toán`, note: `${fileName} · ${mine.length} dòng` }],
        };
      }),
    );
  };

  return (
    <BusinessProjectContext.Provider value={{ projects, ledger, importLedger, createProject, updateProject, deleteProject, importMonthly, saveContract, setAttachments, addOutsourceCode, setOutsourcePm, removeOutsourceCode, approveCode, reopenProject, submitPakd, savePakdForm, decidePakd, finishProject, targets, setYearTargets }}>
      {children}
    </BusinessProjectContext.Provider>
  );
};

export const useBusinessProjects = () => {
  const ctx = useContext(BusinessProjectContext);
  if (!ctx) throw new Error('useBusinessProjects must be used within BusinessProjectProvider');
  return ctx;
};
