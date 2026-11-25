/**
 * PayRoll › Payroll (/Payroll) — mô phỏng ĐÚNG logic code hiện tại (nhánh plan/qa-ba-docs, 17/11/2026).
 * Nguồn: SalaryService.cs (SS), SalaryApprovalService.cs (SAS), MailService.cs (MS), Components/Salary/*.
 * Không đề xuất, không sửa bất thường — tái hiện nguyên hành vi. NGOẠI TRỪ onsite (ĐỀ XUẤT luồng mới):
 *  PC onsite lấy số các dòng đã chốt ở PayRoll › Báo cáo Onsite (Phụ lục 03, kho src/onsite/*) — HR bấm Chốt là vào ngay;
 *  Payroll không tự tính / gắn đơn. Duyệt kỳ lương ⇒ tháng onsite đó khoá, dòng chưa chốt chuyển sang kỳ sau.
 * NV onsite ↔ NV payroll map theo mã NV (EMPLOYEES.code = UserProfile.StaffId). Tên người, email, ngân hàng là giả.
 */
import { ClosingLine, EMPLOYEES, INIT_CLOSINGS, OnsiteClosing, closingIdOf, payrollFromClosing } from '../../onsite/onsiteData';

// ═════════════════════════════ Số thập phân chính xác (thay cho decimal C#) ═════════════════════════════
/** Số thập phân cố định 20 chữ số lẻ trên BigInt — đủ để làm tròn giống decimal C# (28 chữ số có nghĩa). */
export type Dec = bigint;
const SCALE = 10n ** 20n;
const FRAC = 20;
export const D = (x: number | string): Dec => {
  let s = typeof x === 'number' ? (Number.isInteger(x) ? x.toFixed(0) : x.toFixed(12)) : x.trim();
  const neg = s.startsWith('-');
  if (neg) s = s.slice(1);
  const [i, f = ''] = s.split('.');
  const v = BigInt(i || '0') * SCALE + BigInt((f + '0'.repeat(FRAC)).slice(0, FRAC) || '0');
  return neg ? -v : v;
};
/** n / d làm tròn nửa xa 0. */
const divRound = (n: bigint, d: bigint): bigint => {
  const q = n / d;
  const r = n % d;
  const ar = r < 0n ? -r : r;
  const ad = d < 0n ? -d : d;
  if (2n * ar >= ad) return q + ((n < 0n) !== (d < 0n) ? -1n : 1n);
  return q;
};
export const add = (...xs: Dec[]): Dec => xs.reduce((t, v) => t + v, 0n);
export const mul = (a: Dec, b: Dec): Dec => divRound(a * b, SCALE);
export const div = (a: Dec, b: Dec): Dec => divRound(a * SCALE, b);
/** RoundMoney = Math.Round(x, 0, MidpointRounding.AwayFromZero) — SS:1209-1210. */
export const round0 = (a: Dec): Dec => divRound(a, SCALE) * SCALE;
export const maxD = (a: Dec, b: Dec): Dec => (a > b ? a : b);
export const minD = (a: Dec, b: Dec): Dec => (a < b ? a : b);
export const N = (a: Dec): number => {
  const neg = a < 0n;
  const v = neg ? -a : a;
  const s = `${v / SCALE}.${(v % SCALE).toString().padStart(FRAC, '0')}`;
  return (neg ? -1 : 1) * Number(s);
};
const RM = (a: Dec) => N(round0(a));

// ═════════════════════════════ Ngày giờ (giờ địa phương, không UTC) ═════════════════════════════
/** 'YYYY-MM-DD' hoặc 'YYYY-MM-DDTHH:mm[:ss]' → ms (giờ địa phương). */
export const ms = (s: string): number => {
  const [d, t = '00:00:00'] = s.split('T');
  const [y, m, dd] = d.split('-').map(Number);
  const [hh = 0, mi = 0, ss = 0] = t.split(':').map(Number);
  return new Date(y, m - 1, dd, hh, mi, ss).getTime();
};
const pad = (n: number) => String(n).padStart(2, '0');
export const isoOf = (dt: Date) => `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
export const nowIso = () => isoOf(new Date());
export const dateOnly = (s: string) => s.slice(0, 10);
export const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
/** dd/MM/yyyy */
export const fmtD = (s?: string | null) => (s ? `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}` : '');
/** dd/MM/yyyy HH:mm */
export const fmtDT = (s?: string | null) => (s ? `${fmtD(s)} ${s.length > 10 ? s.slice(11, 16) : '00:00'}` : '');
export const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();
/** Số ngày T2–T6 trong tháng, KHÔNG trừ ngày lễ (SS:258-263). */
export const workDaysInMonth = (y: number, m: number) => {
  let c = 0;
  for (let d = 1; d <= daysInMonth(y, m); d++) {
    const w = new Date(y, m - 1, d).getDay();
    if (w !== 0 && w !== 6) c++;
  }
  return c;
};
const addMonths = (y: number, m: number, k: number) => {
  const t = y * 12 + (m - 1) + k;
  return { y: Math.floor(t / 12), m: (t % 12) + 1 };
};

// ═════════════════════════════ Hằng số (đều hard-code trong SS — mục 2.7 đặc tả) ═════════════════════════════
export const PAY_REQUESTED = 18;
export const PAY_APPROVED = 19;
export const PAY_REJECTED = 20;
export type PeriodStatusId = 18 | 19 | 20;
export const STATUS_NAME: Record<PeriodStatusId, string> = { 18: 'Requested', 19: 'Approved', 20: 'Rejected' };
/** StatusIds đơn nghỉ (imisConsts.cs:47-48); StatusOTIds.APPROVED = 2 (OT, bonus, backpay). */
export const ST_REQUESTED = 13;
export const ST_APPROVED = 14;
export const ST_REJECTED = 7;
export const OT_APPROVED = 2;

export enum ContractType {
  INTERN = 0,
  PROBATION = 1,
  FIXED_TERM = 2,
  INDEFINITE_TERM = 3,
  SERVICE_AGREEMENT = 4,
}
export const CONTRACT_LABEL: Record<number, string> = { 0: 'Học việc (INTERN)', 1: 'Thử việc (PROBATION)', 2: 'Xác định thời hạn (FIXED_TERM)', 3: 'Không xác định thời hạn (INDEFINITE_TERM)', 4: 'Cộng tác viên (SERVICE_AGREEMENT)' };

export const HOURS_PER_DAY = 8; // SS:569
/** Hệ số OT giờ — SS:571-580. */
export const OT_MULT = { NormalDayOt: '1.5', NormalNight1Ot: '2.0', NormalNight2Ot: '2.1', WeekendDayOt: '2.0', WeekendNightOt: '2.7', HolidayDayOt: '3.0', HolidayNightOt: '3.9' } as const;
export type OtKey = keyof typeof OT_MULT;
export const INS_EMPLOYEE = '0.105'; // 8% BHXH + 1,5% BHYT + 1% BHTN — không trần (SS:1246)
export const INS_COMPANY = '0.215'; // SS:1247
export const UNION_COMPANY = '0.02'; // SS:1248
export const PERSONAL_DEDUCTION = 15_500_000; // SS:1269
export const DEPENDENT_DEDUCTION = 6_200_000; // SS:1269
export const TAX_BRACKETS: { limit: number; rate: string }[] = [
  { limit: 10_000_000, rate: '0.05' },
  { limit: 30_000_000, rate: '0.10' },
  { limit: 60_000_000, rate: '0.20' },
  { limit: 100_000_000, rate: '0.30' },
  { limit: Infinity, rate: '0.35' },
]; // SS:1054-1081
export const STAFFING_DEPT = 'Staffing';

// ═════════════════════════════ Kiểu dữ liệu ═════════════════════════════
export interface SalaryApproval {
  Id: number;
  Year: number;
  Month: number;
  StatusId: PeriodStatusId;
  ApprovedBy: string | null; // tên người duyệt HOẶC người từ chối
  ApprovedAt: string | null;
  CreatorName: string;
  CreationTime: string;
  IsLocked: boolean;
  IsDeleted: boolean;
}
export interface UserProfile {
  Id: string;
  UserId: number | null;
  StaffId: string;
  FullName: string;
  Position: string;
  Division: string; // tên Khối ('' = thiếu)
  Department: string;
  Company: string;
  Email: string;
  BankAccount: string;
  BankName: string;
  StartDate: string | null;
  ResignationDate: string | null;
  IsDeleted?: boolean;
}
export interface Contract {
  ContractType: ContractType | null;
  InsuranceStartDate: string | null;
}
export interface SalaryHistory {
  Id: number;
  EmployeeId: string;
  EffectiveDate: string;
  GrossIncome: number;
  InsuranceSalary: number | null;
  LunchAllowance: number | null;
  TransportationAllowance: number | null;
  MobileAllowance: number | null;
  AccommodationAllowance: number | null;
  EstimatedPerformanceBonus: number | null;
  Contracts: Contract | null;
  IsDeleted?: boolean;
}
/** Bảng công tháng (TimesheetManagement) — đã chia sẵn 2 đợt lương. */
export interface MonthTimesheet {
  EmployeeId: string;
  Year: number;
  Month: number;
  IsLocked: boolean;
  TotalPayableWork: number | null;
  TotalPayableWork1: number | null;
  TotalPayableWork2: number | null;
}
export type HourlyOverTime = {
  Id: number;
  EmployeeId: string;
  Date: string;
  HRApproveDate: string | null;
  HRStatusId: number;
  OvertimeHours: number | null;
} & Partial<Record<OtKey, number | null>>;
export interface PackageOverTime {
  Id: number;
  EmployeeId: string;
  Name: string;
  StartDate: string;
  HRApproveDate: string | null;
  HRStatusId: number;
  PackageAmount: number;
}
export interface EmployeeBonus {
  Id: number;
  EmployeeId: string;
  Year: number;
  Month: number;
  PMOStatusId: number; // bước duyệt BOD (cấp cuối)
  PackageAmount: number | null;
}
export interface BackPay {
  Id: number;
  EmployeeId: string;
  Year: number;
  Month: number;
  StatusId: number;
  PackageAmount: number | null;
  IsDeleted?: boolean;
}
export interface Holiday {
  Id: number;
  Name: string;
  StartDate: string | null;
  BonusPaymentDate: string | null;
  HasHolidayBonus: boolean;
  BonusIntern: number | null;
  BonusProbation: number | null;
  BonusOfficial: number | null;
  IsDeleted?: boolean;
}
export interface Dependent {
  Id: number;
  UserProfileId: string;
  Name: string;
  IsCalculated: boolean;
  StartDate: string | null;
  EndDate: string | null;
  IsDeleted?: boolean;
}
export interface LeaveRequest {
  Id: number;
  EmployeeId: string;
  StartDate: string; // có giờ
  EndDate: string;
  TotalHours: number;
  Status: number; // 13 chờ / 14 duyệt / 7 từ chối
  Note: string;
  IsDeleted?: boolean;
}
export const IMPORT_FIELDS = ['DeviceAllowance', 'ParkingAllowance', 'OtherAllowances', 'ProjectBonus', 'BusinessBonus', 'ReferralBonus', 'BusinessTripAllowance', 'OtherBonuses', 'TaxAdjustment'] as const;
export type ImportField = (typeof IMPORT_FIELDS)[number];
export type SalaryOtherAllowanceImport = {
  Id: number;
  Year: string; // "YYYY"
  Month: string; // "YYYY-MM"
  EmployeeCode: string;
  EmployeeId: string | null;
  ImportFileName: string;
  ImportedAt: string;
} & Record<ImportField, number>;
export interface StaffWorklog {
  EmployeeId: string;
  WorkDate: string;
  IsStaff: boolean;
  ProjectCode: string;
}

/** Dòng lương — trùng tên trường entity Salary.cs (PascalCase để đối chiếu code). */
export interface Salary {
  Id: number;
  IsDeleted: boolean;
  IsLocked: boolean; // không code nào bật lên true
  CollectDate: string | null;
  EmployeeId: string;
  UserId: number | null;
  StaffId: string;
  FullName: string;
  Position: string;
  Division: string;
  Department: string;
  Company: string;
  Email: string;
  BankAccount: string;
  BankName: string;
  Status: string;
  ProjectCode: string | null;
  Month: string;
  Year: string;
  StartDate: string | null;
  ResignationDate: string | null;
  FileIncomplete: string;
  SalaryLevel: number;
  BasicSalary: number;
  LunchAllowance: number;
  FuelAllowance: number;
  PhoneAllowance: number;
  HousingAllowance: number;
  PerformanceBonusEstimated: number;
  SalaryLevel2: number;
  BasicSalary2: number;
  LunchAllowance2: number;
  FuelAllowance2: number;
  PhoneAllowance2: number;
  HousingAllowance2: number;
  PerformanceBonusEstimated2: number;
  SalaryBased1: number;
  SalaryBased2: number;
  WorkDaysInMonth: number;
  WorkDaysType1: number;
  WorkDaysType2: number;
  TotalWorkDays: number;
  SalaryBasedOnWorkDays: number;
  OvertimeHours: number;
  OvertimePay: number;
  OvertimePayPackage: number;
  /** ĐỀ XUẤT: 6 trường onsite chép từ dòng kỳ chốt (ClosingLine) — số cuối, không tự tính. */
  OnsiteDays: number; // số ngày trong detail
  OnsiteShiftsWithCoef1: number; // = units — "Ngày công onsite được hưởng"
  OnsiteAllowance: number; // = amount (đã gồm bổ sung tháng trước)
  OnsiteUnitsLT30: number;
  OnsiteUnitsGE30: number;
  OnsiteCarryAmount: number;
  DeviceAllowance: number;
  ParkingAllowance: number;
  OtherAllowances: number;
  BusinessTripAllowance: number;
  ProjectBonus: number;
  BusinessBonus: number;
  ReferralBonus: number;
  TaxAdjustment: number;
  OtherBonuses: number;
  HolidayBonus: number;
  BackPay: number;
  AnnualLeavePay: number;
  TotalIncome: number;
  SocialInsurance: number;
  TradeUnionFee: number;
  DependentsCount: number;
  TaxExemptIncome: number;
  TaxingLunch: number;
  TaxableIncome: number;
  TaxCalculatedIncome: number;
  PersonalIncomeTax: number;
  NonTaxDeductions: number;
  OtherDeductions: number;
  NetReceived: number;
  NetReceivedPart1: number;
  NetReceivedPart2: number;
  CompanyInsurance: number;
  UnionFeeCompany: number;
  CompanyCost: number;
  /** Không có code ghi ⇒ luôn 0 (mail dòng 13, 20). */
  YearEndBonus: number;
  AdvanceDeductions: number;
  TradeUnionContributionRecovery: number;
}

export interface SalaryDb {
  periods: SalaryApproval[];
  users: UserProfile[];
  histories: SalaryHistory[];
  timesheets: MonthTimesheet[];
  hourlyOTs: HourlyOverTime[];
  packageOTs: PackageOverTime[];
  bonuses: EmployeeBonus[];
  backpays: BackPay[];
  holidays: Holiday[];
  dependents: Dependent[];
  leaves: LeaveRequest[];
  imports: SalaryOtherAllowanceImport[];
  worklogs: StaffWorklog[];
  salaries: Salary[];
  /** Nhật ký phía server (log, BusinessLogEvent) — chỉ để xem trên prototype. */
  log: { at: string; text: string }[];
}

// ═════════════════════════════ Quyền (PermissionNames.cs:298-305, PayrollUiPermissions.cs:70-105) ═════════════════════════════
export type Perm = 'Read' | 'Create' | 'Edit' | 'Approve' | 'ViewAll' | 'ViewDivision';
export const PERM_LABEL: Record<Perm, string> = {
  Read: 'Payroll.Read',
  Create: 'Payroll.Create',
  Edit: 'Payroll.Edit',
  Approve: 'Payroll.Approve',
  ViewAll: 'Payroll.View.All',
  ViewDivision: 'Payroll.View.Division',
};
export interface Profile {
  key: string;
  label: string;
  perms: Perm[];
  isAdmin: boolean;
  /** UserProfile.Id của người đăng nhập (phạm vi "bản thân") */
  meId: string;
  meName: string;
}
/** 10 hồ sơ quyền theo ma trận 4.3 đặc tả UI. */
export const PROFILES: Profile[] = [
  { key: 'none', label: 'Không có Payroll.Read', perms: [], isAdmin: false, meId: 'e05', meName: 'Lý Minh Khoa' },
  { key: 'read', label: 'Read (chỉ bản thân)', perms: ['Read'], isAdmin: false, meId: 'e05', meName: 'Lý Minh Khoa' },
  { key: 'div', label: 'Read + View.Division', perms: ['Read', 'ViewDivision'], isAdmin: false, meId: 'e01', meName: 'Nguyễn Văn Bình' },
  { key: 'all', label: 'Read + View.All', perms: ['Read', 'ViewAll'], isAdmin: false, meId: 'u-acc', meName: 'Kế toán Mẫu' },
  { key: 'create', label: 'Read + View.All + Create', perms: ['Read', 'ViewAll', 'Create'], isAdmin: false, meId: 'u-hr2', meName: 'HR Tạo kỳ' },
  { key: 'edit', label: 'Read + View.All + Edit', perms: ['Read', 'ViewAll', 'Edit'], isAdmin: false, meId: 'u-hr3', meName: 'HR Sửa' },
  { key: 'approve', label: 'Read + View.All + Approve', perms: ['Read', 'ViewAll', 'Approve'], isAdmin: false, meId: 'u-cfo', meName: 'Người duyệt lương' },
  { key: 'hr', label: 'HR đủ quyền (Read+Create+Edit+Approve+View.All)', perms: ['Read', 'Create', 'Edit', 'Approve', 'ViewAll'], isAdmin: false, meId: 'u-hr', meName: 'Lý Trịnh Hương (HR)' },
  { key: 'admin', label: 'Admin (không grant Create/Edit)', perms: ['Read'], isAdmin: true, meId: 'u-admin', meName: 'admin' },
  { key: 'noall', label: 'Read + Create/Edit/Approve, THIẾU View.All', perms: ['Read', 'Create', 'Edit', 'Approve'], isAdmin: false, meId: 'e04', meName: 'Bùi Thanh Tùng' },
];
export const profileOf = (key: string) => PROFILES.find((p) => p.key === key) || PROFILES[7];
const has = (p: Profile, ...ps: Perm[]) => ps.some((x) => p.perms.includes(x));

export interface UiFlags {
  viewAll: boolean;
  canRead: boolean;
  canCreatePeriod: boolean;
  canApprove: boolean;
  canManagePeriod: boolean;
  canWriteRecords: boolean;
  canImport: boolean;
}
/** PayrollUiPermissions.From (PUP:70-105). */
export const uiFlags = (p: Profile): UiFlags => {
  const viewAll = p.isAdmin || has(p, 'ViewAll');
  return {
    viewAll,
    canRead: p.isAdmin || has(p, 'Read'),
    canCreatePeriod: viewAll && has(p, 'Create'), // Admin không bypass Create
    canApprove: p.isAdmin || (viewAll && has(p, 'Approve')),
    canManagePeriod: p.isAdmin || (viewAll && has(p, 'Create', 'Edit', 'Approve')),
    canWriteRecords: p.isAdmin || (viewAll && has(p, 'Create', 'Edit', 'Approve')),
    canImport: viewAll && has(p, 'Create', 'Edit'), // Admin không bypass Create/Edit
  };
};
export type ScopeKind = 'all' | 'division' | 'self';
export const scopeOf = (p: Profile): ScopeKind => (p.isAdmin || has(p, 'ViewAll') ? 'all' : has(p, 'ViewDivision') ? 'division' : 'self');
export const SCOPE_LABEL: Record<ScopeKind, string> = { all: 'Toàn công ty', division: 'Khối của mình + bản thân', self: 'Chỉ bản thân' };
/** EmployeeDataScope.BuildPayroll — null = thấy tất cả. */
export const visibleEmployeeIds = (db: SalaryDb, p: Profile): Set<string> | null => {
  const k = scopeOf(p);
  if (k === 'all') return null;
  const ids = new Set<string>([p.meId]);
  if (k === 'division') {
    const me = db.users.find((u) => u.Id === p.meId);
    if (me?.Division) db.users.filter((u) => u.Division === me.Division).forEach((u) => ids.add(u.Id));
  }
  return ids;
};

// ═════════════════════════════ Thông điệp (imis-vi.xml) ═════════════════════════════
export const MSG = {
  MonthExists: (m: number, y: number) => `Bảng lương tháng ${pad(m)}/${y} đã tồn tại.`, // VI:4
  PeriodLocked: 'Kỳ lương đã bị khoá. Cần mở khoá trước khi thay đổi dữ liệu.', // VI:333
  SendMailNotApproved: 'Chỉ gửi được phiếu lương khi kỳ lương đã được duyệt.', // VI:334
  NoWrite: 'Bạn không có quyền thay đổi dữ liệu lương.', // VI:335
  NeedViewAll: 'Thao tác này áp dụng cho toàn công ty, cần quyền Lương — Xem dữ liệu lương toàn công ty.', // VI:336
  NoPermission: 'Bạn không có quyền xem dữ liệu bảng lương này.', // VI:337
  PeriodNotFound: 'Không tìm thấy kỳ lương.', // VI:2377
  ApproveError: 'Không duyệt được kỳ lương. Chưa có dữ liệu nào được lưu, vui lòng thử lại hoặc liên hệ quản trị viên.', // VI:2379
  RejectError: 'Không từ chối được kỳ lương. Dữ liệu chưa bị thay đổi, vui lòng thử lại hoặc liên hệ quản trị viên.', // VI:2380
  AbpAuth: (perms: string) => `Required permissions are not granted. At least one of these permissions must be granted: ${perms}`,
};

export class ServiceError extends Error {
  /** friendly = UserFriendlyException; auth = AbpAuthorizationException; crash = exception không được bắt */
  constructor(message: string, public kind: 'friendly' | 'auth' | 'crash' = 'friendly') {
    super(message);
  }
}

// ═════════════════════════════ Tiện ích dữ liệu ═════════════════════════════
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
const eqCode = (a?: string | null, b?: string | null) => !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();
const isBlank = (s?: string | null) => !s || !s.trim();
export const monthStr = (y: number, m: number) => `${y}-${pad(m)}`;
export const periodLabel = (y: number, m: number) => `${pad(m)}/${y}`;
const pushLog = (db: SalaryDb, at: string, text: string) => db.log.unshift({ at, text });

/** Dòng lương rỗng — mọi tiền/công = 0 (decimal mặc định). */
export const emptySalary = (): Salary => ({
  Id: 0, IsDeleted: false, IsLocked: false, CollectDate: null,
  EmployeeId: '', UserId: null, StaffId: '', FullName: '', Position: '', Division: '', Department: '', Company: '', Email: '', BankAccount: '', BankName: '',
  Status: '', ProjectCode: null, Month: '', Year: '', StartDate: null, ResignationDate: null, FileIncomplete: '',
  SalaryLevel: 0, BasicSalary: 0, LunchAllowance: 0, FuelAllowance: 0, PhoneAllowance: 0, HousingAllowance: 0, PerformanceBonusEstimated: 0,
  SalaryLevel2: 0, BasicSalary2: 0, LunchAllowance2: 0, FuelAllowance2: 0, PhoneAllowance2: 0, HousingAllowance2: 0, PerformanceBonusEstimated2: 0,
  SalaryBased1: 0, SalaryBased2: 0, WorkDaysInMonth: 0, WorkDaysType1: 0, WorkDaysType2: 0, TotalWorkDays: 0, SalaryBasedOnWorkDays: 0,
  OvertimeHours: 0, OvertimePay: 0, OvertimePayPackage: 0, OnsiteDays: 0, OnsiteShiftsWithCoef1: 0, OnsiteAllowance: 0, OnsiteUnitsLT30: 0, OnsiteUnitsGE30: 0, OnsiteCarryAmount: 0,
  DeviceAllowance: 0, ParkingAllowance: 0, OtherAllowances: 0, BusinessTripAllowance: 0, ProjectBonus: 0, BusinessBonus: 0, ReferralBonus: 0, TaxAdjustment: 0,
  OtherBonuses: 0, HolidayBonus: 0, BackPay: 0, AnnualLeavePay: 0, TotalIncome: 0, SocialInsurance: 0, TradeUnionFee: 0, DependentsCount: 0,
  TaxExemptIncome: 0, TaxingLunch: 0, TaxableIncome: 0, TaxCalculatedIncome: 0, PersonalIncomeTax: 0, NonTaxDeductions: 0, OtherDeductions: 0,
  NetReceived: 0, NetReceivedPart1: 0, NetReceivedPart2: 0, CompanyInsurance: 0, UnionFeeCompany: 0, CompanyCost: 0,
  YearEndBonus: 0, AdvanceDeductions: 0, TradeUnionContributionRecovery: 0,
});

// ═════════════════════════════ Hàm tính thuần ═════════════════════════════
/** GetStatusFromContractType — SS:1965-1981. "Nghỉ việc" so với HÔM NAY (now), không so với kỳ. */
export function statusFromContract(contractType: ContractType | null | undefined, insured: boolean, resignationDate: string | null, now: string): string {
  if (contractType === null || contractType === undefined) return '';
  if (resignationDate && ms(dateOnly(resignationDate)) <= ms(dateOnly(now))) return 'Nghỉ việc';
  switch (contractType) {
    case ContractType.INTERN:
      return 'Học việc';
    case ContractType.PROBATION:
      return 'Thử việc';
    case ContractType.SERVICE_AGREEMENT:
      return 'Cộng tác viên';
    case ContractType.FIXED_TERM:
    case ContractType.INDEFINITE_TERM:
      return insured ? 'Chính thức, BH' : 'Chính thức';
    default:
      return '';
  }
}

/** CalculateNewPersonalIncomeTax — luỹ tiến 5 bậc, RoundMoney cuối (SS:1054-1081). */
export function progressiveTax(taxCalculatedIncome: number): number {
  const x = D(taxCalculatedIncome);
  let tax = 0n;
  let prev = 0n;
  for (const b of TAX_BRACKETS) {
    const lim = b.limit === Infinity ? null : D(b.limit);
    if (lim === null || x <= lim) {
      tax += mul(x - prev, D(b.rate));
      break;
    }
    tax += mul(lim - prev, D(b.rate));
    prev = lim;
  }
  return RM(tax);
}

/** RecalculateSalary — khối tổng hợp, đúng thứ tự SS:1222-1318. Sửa trực tiếp object. */
export function recalculateSalary(s: Salary): Salary {
  s.TotalIncome = RM(
    add(
      D(s.SalaryBasedOnWorkDays), D(s.OvertimePay), D(s.OvertimePayPackage), D(s.OnsiteAllowance),
      D(s.DeviceAllowance), D(s.ParkingAllowance), D(s.OtherAllowances), D(s.BusinessTripAllowance),
      D(s.ProjectBonus), D(s.BusinessBonus), D(s.ReferralBonus), D(s.HolidayBonus), D(s.OtherBonuses),
      D(s.TaxAdjustment), D(s.BackPay), D(s.AnnualLeavePay),
    ),
  );
  const isInsured = s.Status === 'Chính thức, BH';
  const isOfficial = isInsured || s.Status === 'Chính thức';
  s.SocialInsurance = isInsured ? RM(mul(D(s.BasicSalary), D(INS_EMPLOYEE))) : 0;
  s.CompanyInsurance = isInsured ? RM(mul(D(s.BasicSalary), D(INS_COMPANY))) : 0;
  s.UnionFeeCompany = isInsured ? RM(mul(D(s.BasicSalary), D(UNION_COMPANY))) : 0;

  let unionFee = 0;
  if (isOfficial) {
    const avg = s.SalaryLevel2 > 0 ? div(add(D(s.SalaryLevel), D(s.SalaryLevel2)), D(2)) : D(s.SalaryLevel);
    unionFee = avg < D(10_000_000) ? 50_000 : avg >= D(20_000_000) ? 140_000 : 100_000;
  }
  s.TradeUnionFee = unionFee;

  s.TaxExemptIncome = RM(add(D(s.OvertimePay), D(s.ParkingAllowance), D(s.BusinessTripAllowance)));
  s.TaxableIncome = N(maxD(round0(D(s.TotalIncome) - (isOfficial ? D(s.TaxingLunch) : 0n) - D(s.TaxExemptIncome)), 0n));
  s.TaxCalculatedIncome = isOfficial
    ? N(maxD(D(s.TaxableIncome) - D(s.SocialInsurance) - D(PERSONAL_DEDUCTION) - D(s.DependentsCount) * BigInt(DEPENDENT_DEDUCTION), 0n))
    : s.TaxableIncome;

  const taxBase = s.TaxableIncome;
  let pit = 0;
  if (taxBase <= 0) pit = 0;
  else if (s.Status === 'Nghỉ việc') pit = taxBase >= 5_000_000 ? RM(mul(D(taxBase), D('0.10'))) : 0;
  else if (s.Status === 'Thử việc') pit = taxBase >= 2_000_000 ? RM(mul(D(taxBase), D('0.10'))) : 0;
  else pit = progressiveTax(s.TaxCalculatedIncome);
  s.PersonalIncomeTax = pit;

  s.NetReceived = RM(D(s.TotalIncome) - D(s.SocialInsurance) - D(s.TradeUnionFee) - D(s.PersonalIncomeTax) - D(s.NonTaxDeductions) - D(s.OtherDeductions));
  s.NetReceivedPart1 = (s.Department || '').trim().toLowerCase() === STAFFING_DEPT.toLowerCase() ? RM(mul(D(s.NetReceived), D('0.60'))) : s.NetReceived;
  s.NetReceivedPart2 = N(D(s.NetReceived) - D(s.NetReceivedPart1));
  s.CompanyCost = N(add(D(s.TotalIncome), D(s.CompanyInsurance), D(s.UnionFeeCompany)));
  return s;
}

/** Giờ nghỉ phép trong ngày d (GetLeaveHoursOnDate). */
export function leaveHoursOnDate(start: string, end: string, totalHours: number, date: string): number {
  const d = ms(date);
  const sD = ms(dateOnly(start));
  const eD = ms(dateOnly(end));
  if (d < sD || d > eD) return 0;
  if (sD === eD) return totalHours > 0 ? totalHours : 8;
  if (d > sD && d < eD) return 8;
  const hm = (s: string) => (s.length > 10 ? s.slice(11, 16) : '00:00');
  if (d === sD) return hm(start) >= '12:00' ? 4 : 8;
  if (d === eD) return hm(end) <= '13:00' ? 4 : 8;
  return 8;
}

// ───────────── Onsite: số đã chốt ở Báo cáo Onsite (ĐỀ XUẤT) ─────────────
/** Map NV onsite → mã NV payroll: EMPLOYEES.code (kho onsite) = UserProfile.StaffId. */
export const onsiteStaffIdOf = (onsiteEmployeeId: string): string | null => EMPLOYEES.find((e) => e.id === onsiteEmployeeId)?.code ?? null;
/** Gắn dòng kỳ chốt cho người payroll theo mã NV; dòng không khớp ai trả về `unmapped`. */
export function mapClosingLines(users: UserProfile[], lines: ClosingLine[]): { byUser: Map<string, ClosingLine>; unmapped: ClosingLine[] } {
  const byUser = new Map<string, ClosingLine>();
  const unmapped: ClosingLine[] = [];
  lines.forEach((l) => {
    const u = users.find((x) => !x.IsDeleted && eqCode(x.StaffId, onsiteStaffIdOf(l.employeeId)));
    if (u) byUser.set(u.Id, l);
    else unmapped.push(l);
  });
  return { byUser, unmapped };
}
/** Kho kỳ chốt onsite của phiên: ctx.closings (từ useOnsite), mặc định dữ liệu mẫu INIT_CLOSINGS. */
export const closingsOf = (ctx: { closings?: OnsiteClosing[] }) => ctx.closings ?? INIT_CLOSINGS;
export interface OnsiteSourceInfo {
  closingId: string;
  /** Số người / tiền của các dòng đã chốt ở Báo cáo Onsite. */
  lines: number;
  total: number;
}
/** Số onsite đã chốt của tháng (y, m) — hiển thị trên trang Detail. */
export function onsiteSourceInfo(closings: OnsiteClosing[], y: number, m: number): OnsiteSourceInfo {
  const { lines } = payrollFromClosing(closings, y, m);
  return { closingId: closingIdOf(y, m), lines: lines.length, total: lines.reduce((t, l) => t + l.amount, 0) };
}

/** Ứng viên lương (QuerySalaryCandidates, SS:689-717). */
export function salaryCandidates(db: SalaryDb, year: number, month: number): UserProfile[] {
  const startOfMonth = ms(ymd(year, month, 1));
  const endOfMonth = ms(ymd(year, month, daysInMonth(year, month)));
  return db.users.filter(
    (u) => !u.IsDeleted && !!u.StartDate && ms(dateOnly(u.StartDate)) <= endOfMonth && (u.ResignationDate === null || ms(u.ResignationDate) >= startOfMonth),
  );
}
export const hasSalaryDataIssue = (u: UserProfile) => isBlank(u.StaffId) || isBlank(u.Division);

/** Đơn OT giờ / gói được HR duyệt thuộc kỳ (SS:811-847). */
const inPayrollWindow = (approve: string | null, statusId: number, date: string, s: number, e: number) =>
  !!approve && statusId === OT_APPROVED && ((ms(approve) >= s && ms(approve) < e && ms(date) < e) || (ms(approve) < s && ms(date) >= s && ms(date) < e));

/**
 * CreateSalaryRecordsCoreAsync — phần TÍNH (không guard, không ghi). Đúng thứ tự B1…B14 (SS:354-650).
 * @param closing kỳ chốt onsite của tháng (y, m) lấy từ kho onsite — PC onsite = số các dòng đã chốt (chưa chốt dòng nào ⇒ 0).
 * @param filterIds listEmployee — chỉ áp khi (isReCollect || isSendMail) và không rỗng.
 */
export function calcPeriod(db: SalaryDb, year: number, month: number, now: string, closing: OnsiteClosing | null | undefined, filterIds?: string[] | null, isReCollect = false) {
  if (month < 1 || month > 12) throw new ServiceError("System.ArgumentOutOfRangeException: Valid values are between 1 and 12, inclusive. (Parameter 'month')", 'crash');
  const WDM = workDaysInMonth(year, month);
  const startOfMonth = ms(ymd(year, month, 1));
  const nm = addMonths(year, month, 1);
  const startOfNextMonth = ms(ymd(nm.y, nm.m, 1));
  const yStr = String(year);
  const mStr = monthStr(year, month);

  const timesheets = db.timesheets.filter((t) => t.Year === year && t.Month === month && t.IsLocked);
  let users = salaryCandidates(db, year, month);
  if (filterIds && filterIds.length) users = users.filter((u) => filterIds.includes(u.Id));
  const blocked = users.filter(hasSalaryDataIssue);
  users = users.filter((u) => !hasSalaryDataIssue(u));
  const packageOTs = db.packageOTs.filter((p) => inPayrollWindow(p.HRApproveDate, p.HRStatusId, p.StartDate, startOfMonth, startOfNextMonth));
  const hourlyOTs = db.hourlyOTs.filter((h) => inPayrollWindow(h.HRApproveDate, h.HRStatusId, h.Date, startOfMonth, startOfNextMonth));
  const bonus = db.bonuses.filter((b) => b.Month === month && b.Year === year && b.PMOStatusId === OT_APPROVED);
  const backpay = db.backpays.filter((b) => !b.IsDeleted && b.Month === month && b.Year === year && b.StatusId === OT_APPROVED);
  const onsiteLines = closing?.saved || [];
  const { byUser: onsite, unmapped: onsiteUnmapped } = mapClosingLines(db.users, onsiteLines);
  const holidays = db.holidays.filter((h) => !h.IsDeleted && h.HasHolidayBonus && !!h.BonusPaymentDate && Number(h.BonusPaymentDate.slice(0, 4)) === year && Number(h.BonusPaymentDate.slice(5, 7)) === month);
  const histories = db.histories.filter((h) => !h.IsDeleted);
  const existing = db.salaries.filter((s) => !s.IsDeleted && s.Year === yStr && s.Month === mStr);
  const deps = new Map<string, number>();
  db.dependents
    .filter((d) => !d.IsDeleted && d.IsCalculated && (d.StartDate === null || ms(d.StartDate) < startOfNextMonth) && (d.EndDate === null || ms(d.EndDate) >= startOfMonth))
    .forEach((d) => deps.set(d.UserProfileId, (deps.get(d.UserProfileId) || 0) + 1));
  // Khoản khác import: key = mã NV trim không phân biệt hoa thường, trùng lấy Id LỚN nhất (SS:1385-1397)
  const imports = new Map<string, SalaryOtherAllowanceImport>();
  db.imports
    .filter((x) => x.Year === yStr && x.Month === mStr && !isBlank(x.EmployeeCode))
    .sort((a, b) => a.Id - b.Id)
    .forEach((x) => imports.set(x.EmployeeCode.trim().toLowerCase(), x));
  // Mã dự án staffing (SS:1326-1379)
  const lastDay = ymd(year, month, daysInMonth(year, month));
  const staffing = new Map<string, string>();
  const byEmp = new Map<string, Set<string>>();
  db.worklogs
    .filter((w) => w.IsStaff && dateOnly(w.WorkDate) >= ymd(year, month, 1) && dateOnly(w.WorkDate) <= lastDay)
    .forEach((w) => byEmp.set(w.EmployeeId, (byEmp.get(w.EmployeeId) || new Set()).add(w.ProjectCode)));
  byEmp.forEach((set, k) => staffing.set(k, [...set].sort().join(', ')));

  const rows: Salary[] = [];
  const mailRows: Salary[] = [];
  for (const user of users) {
    // B1
    const ex = existing.find((s) => s.EmployeeId === user.Id || eqCode(s.StaffId, user.StaffId)) || null;
    const imp = isBlank(user.StaffId) ? null : imports.get(user.StaffId.trim().toLowerCase()) || null;
    // B2
    const s = emptySalary();
    Object.assign(s, {
      StaffId: user.StaffId, UserId: user.UserId, EmployeeId: user.Id, FullName: user.FullName, Position: user.Position, Department: user.Department,
      Division: user.Division, Email: user.Email, BankAccount: user.BankAccount, BankName: user.BankName, Company: user.Company,
      Month: mStr, Year: yStr, ProjectCode: staffing.get(user.Id) ?? ex?.ProjectCode ?? null, WorkDaysInMonth: WDM,
      StartDate: user.StartDate, ResignationDate: user.ResignationDate, FileIncomplete: ex?.FileIncomplete ?? '',
      DeviceAllowance: imp?.DeviceAllowance ?? ex?.DeviceAllowance ?? 0,
      ParkingAllowance: imp?.ParkingAllowance ?? ex?.ParkingAllowance ?? 0,
      OtherAllowances: imp?.OtherAllowances ?? ex?.OtherAllowances ?? 0,
      BusinessTripAllowance: imp?.BusinessTripAllowance ?? ex?.BusinessTripAllowance ?? 0,
      ProjectBonus: imp?.ProjectBonus ?? ex?.ProjectBonus ?? 0,
      BusinessBonus: imp?.BusinessBonus ?? ex?.BusinessBonus ?? 0,
      ReferralBonus: imp?.ReferralBonus ?? ex?.ReferralBonus ?? 0,
      TaxAdjustment: imp?.TaxAdjustment ?? ex?.TaxAdjustment ?? 0,
      AnnualLeavePay: ex?.AnnualLeavePay ?? 0,
      NonTaxDeductions: ex?.NonTaxDeductions ?? 0,
      OtherDeductions: ex?.OtherDeductions ?? 0,
      DependentsCount: deps.get(user.Id) || 0,
    } as Partial<Salary>);
    // B3
    const hs = histories.filter((h) => h.EmployeeId === user.Id && ms(h.EffectiveDate) < startOfNextMonth).sort((a, b) => ms(a.EffectiveDate) - ms(b.EffectiveDate));
    const latest = hs[hs.length - 1] || null;
    const previous =
      latest && ms(latest.EffectiveDate) > startOfMonth
        ? hs.filter((h) => ms(h.EffectiveDate) < ms(latest.EffectiveDate)).sort((a, b) => ms(b.EffectiveDate) - ms(a.EffectiveDate))[0] || null
        : null;
    // B4
    const totalBonus = bonus.filter((b) => b.EmployeeId === user.Id && b.PackageAmount !== null).reduce((t, b) => t + (b.PackageAmount ?? 0), 0);
    s.OtherBonuses = totalBonus !== 0 || imp !== null ? totalBonus + (imp?.OtherBonuses ?? 0) : ex?.OtherBonuses ?? 0;
    // B5
    const mine = backpay.filter((r) => r.PackageAmount !== null && r.EmployeeId === user.Id);
    const thu = mine.filter((r) => (r.PackageAmount as number) >= 0).reduce((t, r) => t + (r.PackageAmount as number), 0);
    const chi = mine.filter((r) => (r.PackageAmount as number) < 0).reduce((t, r) => t + (r.PackageAmount as number), 0);
    s.BackPay = thu + chi;
    // B6
    const contract = latest?.Contracts || null;
    const insured = !!contract && !!contract.InsuranceStartDate && ms(contract.InsuranceStartDate) < startOfNextMonth;
    const status = statusFromContract(contract?.ContractType, insured, user.ResignationDate, now);
    if (latest) {
      s.Status = status;
      // B7
      const h1 = previous || latest;
      s.SalaryLevel = h1.GrossIncome;
      s.BasicSalary = h1.InsuranceSalary ?? 0;
      s.LunchAllowance = h1.LunchAllowance ?? 0;
      s.FuelAllowance = h1.TransportationAllowance ?? 0;
      s.PhoneAllowance = h1.MobileAllowance ?? 0;
      s.HousingAllowance = h1.AccommodationAllowance ?? 0;
      s.PerformanceBonusEstimated = h1.EstimatedPerformanceBonus ?? 0;
      if (previous) {
        s.SalaryLevel2 = latest.GrossIncome;
        s.BasicSalary2 = latest.InsuranceSalary ?? 0;
        s.LunchAllowance2 = latest.LunchAllowance ?? 0;
        s.FuelAllowance2 = latest.TransportationAllowance ?? 0;
        s.PhoneAllowance2 = latest.MobileAllowance ?? 0;
        s.HousingAllowance2 = latest.AccommodationAllowance ?? 0;
        s.PerformanceBonusEstimated2 = latest.EstimatedPerformanceBonus ?? 0;
      }
      s.SalaryBased1 = s.BasicSalary + s.LunchAllowance + s.FuelAllowance + s.PhoneAllowance + s.HousingAllowance + s.PerformanceBonusEstimated;
      s.SalaryBased2 = s.BasicSalary2 + s.LunchAllowance2 + s.FuelAllowance2 + s.PhoneAllowance2 + s.HousingAllowance2 + s.PerformanceBonusEstimated2;
      // B8 thưởng lễ
      s.HolidayBonus = 0;
      for (const h of holidays) {
        if (!h.StartDate || (user.StartDate && ms(dateOnly(user.StartDate)) >= ms(dateOnly(h.StartDate))) || (h.BonusPaymentDate && user.ResignationDate && ms(user.ResignationDate) < ms(h.BonusPaymentDate))) continue;
        let ct: ContractType | null | undefined;
        if (ms(h.StartDate) >= ms(latest.EffectiveDate)) ct = latest.Contracts?.ContractType;
        else if (previous && ms(h.StartDate) >= ms(previous.EffectiveDate)) ct = previous.Contracts?.ContractType;
        else continue;
        if (ct === ContractType.SERVICE_AGREEMENT) continue;
        s.HolidayBonus +=
          ct === ContractType.INTERN ? h.BonusIntern ?? 0 : ct === ContractType.PROBATION ? h.BonusProbation ?? 0 : ct === ContractType.FIXED_TERM || ct === ContractType.INDEFINITE_TERM ? h.BonusOfficial ?? 0 : 0;
      }
      // B9 OT giờ
      let otPay = 0n;
      for (const ot of hourlyOTs.filter((o) => o.EmployeeId === user.Id)) {
        const od = ot.Date;
        const wdOT = workDaysInMonth(Number(od.slice(0, 4)), Number(od.slice(5, 7)));
        const applicable = [...hs].reverse().find((h) => ms(h.EffectiveDate) <= ms(od)) || latest;
        const hourRate = div(div(D(applicable.GrossIncome), D(wdOT)), D(8));
        s.OvertimeHours += ot.OvertimeHours ?? 0;
        for (const k of Object.keys(OT_MULT) as OtKey[]) otPay += mul(mul(D(ot[k] ?? 0), hourRate), D(OT_MULT[k]));
      }
      s.OvertimePay = RM(otPay);
    } else {
      s.Status = status; // mọi trường gói lương = 0, không thưởng lễ, không OT giờ
    }
    // B10 công
    const ts = timesheets.find((t) => t.EmployeeId.toLowerCase() === user.Id.toLowerCase());
    if (ts) {
      s.TotalWorkDays = ts.TotalPayableWork ?? 0;
      s.WorkDaysType1 = ts.TotalPayableWork1 ?? 0;
      s.WorkDaysType2 = ts.TotalPayableWork2 ?? 0;
      s.SalaryBasedOnWorkDays = RM(add(mul(D(s.WorkDaysType1), div(D(s.SalaryBased1), D(WDM))), mul(D(s.WorkDaysType2), div(D(s.SalaryBased2), D(WDM)))));
      s.TaxingLunch = RM(mul(div(D(s.LunchAllowance), D(WDM)), round0(D(ts.TotalPayableWork ?? 0))));
    }
    // B11 OT gói
    s.OvertimePayPackage = packageOTs.filter((p) => p.EmployeeId === user.Id).reduce((t, p) => t + p.PackageAmount, 0);
    // B12 onsite — ĐỀ XUẤT: chép số đã chốt ở Báo cáo Onsite
    const os = onsite.get(user.Id);
    s.OnsiteDays = os?.detail.length ?? 0;
    s.OnsiteShiftsWithCoef1 = os?.units ?? 0;
    s.OnsiteAllowance = os?.amount ?? 0;
    s.OnsiteUnitsLT30 = os?.unitsLT30 ?? 0;
    s.OnsiteUnitsGE30 = os?.unitsGE30 ?? 0;
    s.OnsiteCarryAmount = os?.carryAmount ?? 0;
    // B13
    recalculateSalary(s);
    // B14
    rows.push(s);
    mailRows.push(ex && !isReCollect ? ex : s);
  }
  return { rows, mailRows, blocked, onsiteUnmapped, workDaysInMonth: WDM };
}

// ═════════════════════════════ Lớp service (guard + ghi) ═════════════════════════════
export interface Ctx {
  profile: Profile;
  now: string;
  /** Kỳ chốt onsite từ kho onsite (useOnsite().closings); bỏ trống ⇒ INIT_CLOSINGS. */
  closings?: OnsiteClosing[];
}
const closingFor = (ctx: Ctx, y: number, m: number) => closingsOf(ctx).find((c) => c.id === closingIdOf(y, m)) ?? null;
const isLockedInDb = (db: SalaryDb, y: number, m: number) => db.periods.some((x) => !x.IsDeleted && x.Year === y && x.Month === m && x.IsLocked);

export interface MailItem {
  to: string;
  subject: string;
  row: Salary;
  feedbackDeadline: string;
}
/** FeedbackDeadline = hôm nay + 1, định dạng ddMMyyyy (MS:388-398). */
export const feedbackDeadline = (now: string) => {
  const d = new Date(ms(dateOnly(now)));
  d.setDate(d.getDate() + 1);
  return `${pad(d.getDate())}${pad(d.getMonth() + 1)}${d.getFullYear()}`;
};

/** SS.CreateSalaryRecordsAsync — guard theo thứ tự 2.1, ghi DB, gửi mail. Trả db mới. */
export function createSalaryRecords(
  db0: SalaryDb,
  ctx: Ctx,
  year: number,
  month: number,
  flags: { isApprove?: boolean; isSendMail?: boolean; isReCollect?: boolean; listEmployee?: string[] | null } = {},
): { db: SalaryDb; rows: Salary[]; mails: MailItem[]; reusedExisting: boolean } {
  const { isApprove = false, isSendMail = false, isReCollect = false, listEmployee = null } = flags;
  const p = ctx.profile;
  if (!p.perms.includes('Read')) throw new ServiceError(MSG.AbpAuth('Payroll.Read'), 'auth');
  const anyFlag = isApprove || isSendMail || isReCollect;
  if (anyFlag && !uiFlags(p).viewAll) throw new ServiceError(MSG.NeedViewAll);
  if (anyFlag) {
    if (!(p.isAdmin || has(p, 'Create', 'Edit', 'Approve'))) throw new ServiceError(MSG.NoWrite);
    if (isApprove && !(p.isAdmin || has(p, 'Approve'))) throw new ServiceError(MSG.NoWrite);
    if (isLockedInDb(db0, year, month)) throw new ServiceError(MSG.PeriodLocked);
    if (isSendMail && !isApprove && !db0.periods.some((x) => !x.IsDeleted && x.Year === year && x.Month === month && x.StatusId === PAY_APPROVED))
      throw new ServiceError(MSG.SendMailNotApproved);
  }
  const db = clone(db0);
  const yStr = String(year);
  const mStr = monthStr(year, month);
  const vis = visibleEmployeeIds(db, p);
  const scopeFilter = (rows: Salary[]) => (vis ? rows.filter((r) => vis.has(r.EmployeeId)) : rows);

  // Chống trùng khi duyệt: kỳ đã có dòng Salary ⇒ trả danh sách đang có, không tính, không ghi (SS:243-254)
  if (isApprove && !isReCollect) {
    const ex = db.salaries.filter((s) => !s.IsDeleted && s.Month === mStr && s.Year === yStr);
    if (ex.length) return { db, rows: scopeFilter(ex), mails: [], reusedExisting: true };
  }
  const useFilter = !!listEmployee && listEmployee.length > 0 && (isReCollect || isSendMail);
  const { rows, mailRows, blocked, onsiteUnmapped } = calcPeriod(db, year, month, ctx.now, closingFor(ctx, year, month), useFilter ? listEmployee : null, isReCollect);
  if (onsiteUnmapped.length && (isApprove || isReCollect))
    pushLog(db, ctx.now, `WARN onsite ${mStr}: ${onsiteUnmapped.length} dòng kỳ chốt không khớp mã NV payroll: ${onsiteUnmapped.map((l) => onsiteStaffIdOf(l.employeeId) ?? l.employeeId).join(', ')}`);
  if (blocked.length) pushLog(db, ctx.now, `WARN CreateSalaryRecordsAsync ${mStr}: bỏ qua ${blocked.length} nhân viên thiếu Mã NV/Khối: ${blocked.map((u) => u.FullName).join(', ')}`);

  let nextId = Math.max(0, ...db.salaries.map((s) => s.Id)) + 1;
  if (isApprove) {
    for (const r of rows) {
      r.Id = nextId++;
      r.CollectDate = ctx.now;
      db.salaries.push(r);
    }
  }
  if (isReCollect) {
    for (const r of rows) {
      const old = db.salaries.find((s) => !s.IsDeleted && s.EmployeeId === r.EmployeeId && s.Month === r.Month && s.Year === r.Year);
      if (old) {
        // MapExcept: chép mọi thuộc tính trừ Id, audit, IsDeleted, IsLocked (SS:1181-1200)
        const keep = { Id: old.Id, IsDeleted: old.IsDeleted, IsLocked: old.IsLocked };
        Object.assign(old, r, keep, { CollectDate: ctx.now });
      } else {
        r.Id = nextId++;
        r.CollectDate = ctx.now;
        db.salaries.push(r);
      }
    }
    pushLog(db, ctx.now, `Thu thập lại ${periodLabel(year, month)}: ${rows.length} dòng ${useFilter ? '(theo dòng chọn)' : '(TOÀN KỲ — danh sách chọn rỗng)'}`);
  }
  let mails: MailItem[] = [];
  if (isSendMail) {
    mails = mailRows
      .filter((r) => !isBlank(r.Email))
      .map((r) => ({ to: r.Email, subject: `Monthly Payslip – ${r.Month}`, row: r, feedbackDeadline: feedbackDeadline(ctx.now) }));
    pushLog(db, ctx.now, `EmailSalarySummaryAsync ${mStr}: xếp hàng gửi nền ${mails.length} phiếu lương (không lưu trạng thái "đã gửi")`);
  }
  return { db, rows: scopeFilter(rows), mails, reusedExisting: false };
}

// ───────────── Vòng đời kỳ lương (SalaryApprovalService) ─────────────
type SvcResp = { succeeded: boolean; message: string };

/** SAS.CreateAsync (SAS:72-120). Không validate tháng/năm. */
export function svcCreatePeriod(db0: SalaryDb, ctx: Ctx, year: number, month: number): { db: SalaryDb } & SvcResp {
  const p = ctx.profile;
  if (!has(p, 'Create')) throw new ServiceError(MSG.AbpAuth('Payroll.Create'), 'auth'); // [AbpAuthorize] — Admin không bypass
  if (!uiFlags(p).viewAll) return { db: db0, succeeded: false, message: MSG.NeedViewAll };
  if (db0.periods.some((x) => !x.IsDeleted && x.Month === month && x.Year === year && x.StatusId !== PAY_REJECTED))
    return { db: db0, succeeded: false, message: MSG.MonthExists(month, year) };
  const db = clone(db0);
  const id = Math.max(0, ...db.periods.map((x) => x.Id)) + 1;
  db.periods.push({ Id: id, Year: year, Month: month, StatusId: PAY_REQUESTED, ApprovedBy: null, ApprovedAt: null, CreatorName: p.meName, CreationTime: ctx.now, IsLocked: false, IsDeleted: false });
  return { db, succeeded: true, message: '' };
}

const ensureCanApprove = (p: Profile) => {
  if (!(p.isAdmin || has(p, 'Approve'))) throw new ServiceError(MSG.NoWrite);
  if (!uiFlags(p).viewAll) throw new ServiceError(MSG.NeedViewAll);
};
const ensureCanManage = (p: Profile) => {
  if (!(p.isAdmin || has(p, 'Create', 'Edit', 'Approve'))) throw new ServiceError(MSG.NoWrite);
  if (!uiFlags(p).viewAll) throw new ServiceError(MSG.NeedViewAll);
};

/** SAS.ApproveInitial (SAS:129-222): false = không đủ điều kiện; lỗi hệ thống ⇒ ném Payroll_Approve_Error. */
export function svcApprove(db0: SalaryDb, ctx: Ctx, id: number): { db: SalaryDb; ok: boolean; reusedExisting: boolean } {
  ensureCanApprove(ctx.profile);
  const e0 = db0.periods.find((x) => x.Id === id && !x.IsDeleted);
  if (!e0 || (e0.StatusId !== PAY_REQUESTED && e0.StatusId !== PAY_REJECTED) || e0.IsLocked) return { db: db0, ok: false, reusedExisting: false };
  // Duyệt lại kỳ Rejected khi đã có kỳ khác cùng tháng (≠ Rejected) ⇒ đâm unique index UX_SalaryApproval_Year_Month ⇒ rollback
  if (db0.periods.some((x) => x.Id !== id && !x.IsDeleted && x.Year === e0.Year && x.Month === e0.Month && x.StatusId !== PAY_REJECTED)) {
    throw new ServiceError(MSG.ApproveError);
  }
  try {
    // CreateSalaryRecordsAsync đọc kỳ qua read-only repo ⇒ thấy trạng thái CHƯA flush (vẫn 18/20)
    const r = createSalaryRecords(db0, ctx, e0.Year, e0.Month, { isApprove: true });
    const db = r.db;
    const e = db.periods.find((x) => x.Id === id)!;
    const src = onsiteSourceInfo(closingsOf(ctx), e.Year, e.Month);
    e.ApprovedBy = ctx.profile.meName;
    e.ApprovedAt = ctx.now;
    e.StatusId = PAY_APPROVED;
    pushLog(
      db,
      ctx.now,
      `Duyệt kỳ ${periodLabel(e.Year, e.Month)}: ${r.reusedExisting ? `kỳ ĐÃ có ${r.rows.length} dòng Salary ⇒ giữ nguyên, không tính` : `ghi ${db.salaries.filter((s) => !s.IsDeleted && s.Month === monthStr(e.Year, e.Month)).length} dòng Salary`}; PC onsite lấy từ kỳ chốt ${src.closingId} (${src.lines} người, ${src.total.toLocaleString('vi-VN')} đ) — không gắn đơn`,
    );
    return { db, ok: true, reusedExisting: r.reusedExisting };
  } catch (err) {
    if (err instanceof ServiceError && err.kind !== 'crash') throw err;
    throw new ServiceError(MSG.ApproveError);
  }
}

/** SAS.RejectInitial (SAS:231-297): ghi đè ApprovedBy/At, bỏ note, xoá mềm Salary chưa khoá. Onsite không gắn đơn ⇒ không gỡ gì. */
export function svcReject(db0: SalaryDb, ctx: Ctx, id: number, _note: string): { db: SalaryDb; ok: boolean; deletedRows: number } {
  ensureCanApprove(ctx.profile);
  const e0 = db0.periods.find((x) => x.Id === id && !x.IsDeleted);
  if (!e0 || (e0.StatusId !== PAY_REQUESTED && e0.StatusId !== PAY_APPROVED) || e0.IsLocked) return { db: db0, ok: false, deletedRows: 0 };
  const db = clone(db0);
  const e = db.periods.find((x) => x.Id === id)!;
  e.ApprovedBy = ctx.profile.meName;
  e.ApprovedAt = ctx.now;
  e.StatusId = PAY_REJECTED;
  const yStr = String(e.Year);
  const mStr = monthStr(e.Year, e.Month);
  let deletedRows = 0;
  db.salaries.forEach((s) => {
    if (!s.IsDeleted && s.Year === yStr && s.Month === mStr && !s.IsLocked) {
      s.IsDeleted = true;
      deletedRows++;
    }
  });
  pushLog(db, ctx.now, `Từ chối kỳ ${periodLabel(e.Year, e.Month)}: xoá mềm ${deletedRows} dòng Salary; ghi chú KHÔNG lưu`);
  return { db, ok: true, deletedRows };
}

/** SAS.LockDataAsync (SAS:313-338) — mọi trạng thái; rồi tự từ chối đơn nghỉ chờ duyệt giao tháng. */
export function svcLock(db0: SalaryDb, ctx: Ctx, id: number): { db: SalaryDb; autoRejected: number[] } & SvcResp {
  ensureCanManage(ctx.profile);
  const e0 = db0.periods.find((x) => x.Id === id && !x.IsDeleted);
  if (!e0) return { db: db0, succeeded: false, message: MSG.PeriodNotFound, autoRejected: [] };
  const db = clone(db0);
  const e = db.periods.find((x) => x.Id === id)!;
  e.IsLocked = true;
  // RejectPendingInLockedPayrollPeriodAsync: kỳ "đã chốt" = StatusId==19 || IsLocked (LeavePayrollLock.cs:16-17)
  const ms0 = ms(ymd(e.Year, e.Month, 1));
  const nm = addMonths(e.Year, e.Month, 1);
  const ms1 = ms(ymd(nm.y, nm.m, 1));
  const autoRejected: number[] = [];
  db.leaves.forEach((l) => {
    if (!l.IsDeleted && l.Status === ST_REQUESTED && ms(l.StartDate) < ms1 && ms(l.EndDate) >= ms0) {
      l.Status = ST_REJECTED;
      l.Note = 'Tự từ chối: kỳ lương đã khoá';
      autoRejected.push(l.Id);
    }
  });
  pushLog(db, ctx.now, `Khoá kỳ ${periodLabel(e.Year, e.Month)} (trạng thái ${STATUS_NAME[e.StatusId]}); tự từ chối ${autoRejected.length} đơn nghỉ chờ duyệt giao tháng`);
  return { db, succeeded: true, message: 'Đã khoá kỳ lương.', autoRejected };
}

/** SAS.UnlockDataAsync (SAS:344-383) — không khôi phục đơn nghỉ đã tự từ chối. */
export function svcUnlock(db0: SalaryDb, ctx: Ctx, id: number): { db: SalaryDb } & SvcResp {
  ensureCanManage(ctx.profile);
  const e0 = db0.periods.find((x) => x.Id === id && !x.IsDeleted);
  if (!e0) return { db: db0, succeeded: false, message: MSG.PeriodNotFound };
  const db = clone(db0);
  const e = db.periods.find((x) => x.Id === id)!;
  const was = e.IsLocked;
  e.IsLocked = false;
  pushLog(db, ctx.now, `WARN + BusinessLogEvent(Payroll/Unlock): ${ctx.profile.meName} mở khoá kỳ lương #${e.Id} (${periodLabel(e.Year, e.Month)}), IsLocked ${was} → false`);
  return { db, succeeded: true, message: 'Đã mở khoá kỳ lương.' };
}

/** SAS.DeletePayrollAsync (SAS:385-433) — xoá mềm MỌI Salary theo Year/Month chuỗi (kể cả của kỳ khác cùng tháng). */
export function svcDelete(db0: SalaryDb, ctx: Ctx, id: number): { db: SalaryDb; deletedRows: number } & SvcResp {
  ensureCanManage(ctx.profile);
  const e0 = db0.periods.find((x) => x.Id === id && !x.IsDeleted);
  if (!e0) return { db: db0, succeeded: false, message: 'Payroll record not found!', deletedRows: 0 };
  if (e0.IsLocked) return { db: db0, succeeded: false, message: 'Cannot delete a locked payroll!', deletedRows: 0 };
  const db = clone(db0);
  const e = db.periods.find((x) => x.Id === id)!;
  const yStr = String(e.Year);
  const mStr = monthStr(e.Year, e.Month);
  let deletedRows = 0;
  db.salaries.forEach((s) => {
    if (!s.IsDeleted && s.Year === yStr && s.Month === mStr) {
      s.IsDeleted = true;
      deletedRows++;
    }
  });
  e.IsDeleted = true;
  pushLog(db, ctx.now, `Xoá kỳ ${periodLabel(e.Year, e.Month)} (${STATUS_NAME[e.StatusId]}): xoá mềm ${deletedRows} dòng Salary; KHÔNG xoá bảng import khoản khác`);
  return { db, succeeded: true, message: '', deletedRows };
}

/** SAS.GetByPeriodAsync — FirstOrDefault KHÔNG ORDER BY (SAS:455-461): lấy bản ghi đầu theo thứ tự lưu. */
export function getByPeriod(db: SalaryDb, ctx: Ctx, year: number, month: number): SalaryApproval | null {
  const p = ctx.profile;
  const hasApprove = p.isAdmin || has(p, 'Read', 'ViewAll', 'ViewDivision');
  return db.periods.find((c) => !c.IsDeleted && c.Year === year && c.Month === month && (hasApprove || c.CreatorName === p.meName)) || null;
}

/** SAS.GetGridDataForAdminAsync — mọi kỳ chưa xoá, Năm ↓, Tháng ↓. */
export function periodGrid(db: SalaryDb): SalaryApproval[] {
  return db.periods.filter((x) => !x.IsDeleted).sort((a, b) => b.Year - a.Year || b.Month - a.Month);
}

export interface DataIssue {
  EmployeeId: string;
  StaffId: string;
  FullName: string;
  Department: string;
  MissingStaffId: boolean;
  MissingDivision: boolean;
}
/** SS.GetSalaryDataIssuesAsync (SS:735-801). */
export function salaryDataIssues(db: SalaryDb, ctx: Ctx, year: number, month: number): DataIssue[] {
  if (month < 1 || month > 12 || year < 1 || year > 9999) return [];
  const vis = visibleEmployeeIds(db, ctx.profile);
  const users = salaryCandidates(db, year, month).filter((u) => !vis || vis.has(u.Id));
  const res: DataIssue[] = users.filter(hasSalaryDataIssue).map((u) => ({
    EmployeeId: u.Id, StaffId: (u.StaffId || '').trim(), FullName: u.FullName, Department: u.Department, MissingStaffId: isBlank(u.StaffId), MissingDivision: isBlank(u.Division),
  }));
  const yStr = String(year);
  const mStr = monthStr(year, month);
  db.salaries
    .filter((s) => !s.IsDeleted && s.Year === yStr && s.Month === mStr && (isBlank(s.StaffId) || isBlank(s.Division)) && (!vis || vis.has(s.EmployeeId)))
    .forEach((s) => {
      const exi = res.find((r) => r.EmployeeId === s.EmployeeId);
      if (exi) {
        exi.MissingStaffId ||= isBlank(s.StaffId);
        exi.MissingDivision ||= isBlank(s.Division);
      } else res.push({ EmployeeId: s.EmployeeId, StaffId: (s.StaffId || '').trim(), FullName: s.FullName, Department: s.Department, MissingStaffId: isBlank(s.StaffId), MissingDivision: isBlank(s.Division) });
    });
  return res.sort((a, b) => a.Department.localeCompare(b.Department) || a.FullName.localeCompare(b.FullName));
}

export interface DetailState {
  hasPeriod: boolean;
  status: PeriodStatusId | null;
  isLocked: boolean;
  periodId: number | null;
  source: 'saved' | 'calc' | 'none';
  rows: Salary[];
  issues: DataIssue[];
  crash: string | null;
  /** ĐỀ XUẤT: tình trạng kỳ chốt Báo cáo Onsite cùng tháng. */
  onsite: OnsiteSourceInfo;
}
/** Trang B nạp dữ liệu (SSL:546-619). */
export function loadDetail(db: SalaryDb, ctx: Ctx, year: number, month: number): DetailState {
  const per = getByPeriod(db, ctx, year, month);
  const st: DetailState = { hasPeriod: !!per, status: per?.StatusId ?? null, isLocked: per ? per.IsLocked : true, periodId: per?.Id ?? null, source: 'none', rows: [], issues: [], crash: null, onsite: onsiteSourceInfo(closingsOf(ctx), year, month) };
  if (!uiFlags(ctx.profile).canRead) return st;
  try {
    if (!per || per.StatusId === PAY_APPROVED) {
      const vis = visibleEmployeeIds(db, ctx.profile);
      st.rows = db.salaries.filter((s) => !s.IsDeleted && s.Year === String(year) && s.Month === monthStr(year, month) && (!vis || vis.has(s.EmployeeId)));
      st.source = 'saved';
    } else {
      st.rows = createSalaryRecords(db, ctx, year, month).rows;
      st.source = 'calc';
    }
  } catch (err) {
    st.crash = (err as Error).message;
  }
  st.issues = salaryDataIssues(db, ctx, year, month);
  return st;
}

/** Export: dòng đã lưu trong phạm vi; rỗng ⇒ tính thử (SS:1760-1769). Bỏ qua lọc / dòng chọn trên grid. */
export function exportRows(db: SalaryDb, ctx: Ctx, year: number, month: number): { rows: Salary[]; computed: boolean; fileName: string } {
  const vis = visibleEmployeeIds(db, ctx.profile);
  let rows = db.salaries.filter((s) => !s.IsDeleted && s.Year === String(year) && s.Month === monthStr(year, month) && (!vis || vis.has(s.EmployeeId)));
  let computed = false;
  if (!rows.length) {
    rows = createSalaryRecords(db, ctx, year, month).rows;
    computed = true;
  }
  return { rows, computed, fileName: `BangLuong_${pad(month)}_${year}.xlsx` };
}

// ───────────── Import "Các khoản khác" (SS:1412-1654) ─────────────
export interface ImportFileRow {
  code: string;
  values: Partial<Record<ImportField, number>>;
}
export interface ImportFile {
  name: string;
  sizeKb: number;
  rows: ImportFileRow[];
  note: string;
}
export interface ImportResult {
  Success: boolean;
  UpdatedCount: number;
  Errors: string[];
}
export function svcImport(db0: SalaryDb, ctx: Ctx, year: number, month: number, file: ImportFile): { db: SalaryDb; result: ImportResult; recalculated: string[] } {
  const p = ctx.profile;
  if (!has(p, 'Create', 'Edit')) throw new ServiceError(MSG.AbpAuth('Payroll.Create, Payroll.Edit'), 'auth');
  if (!uiFlags(p).viewAll) throw new ServiceError(MSG.NeedViewAll);
  if (isLockedInDb(db0, year, month)) throw new ServiceError(MSG.PeriodLocked);
  const db = clone(db0);
  const yStr = String(year);
  const mStr = monthStr(year, month);
  const result: ImportResult = { Success: true, UpdatedCount: 0, Errors: [] };
  const inserted = new Set<number>();
  const updated = new Set<number>();
  const recalculated: string[] = [];
  let nextId = Math.max(0, ...db.imports.map((x) => x.Id)) + 1;
  const approvedBonus = (empId: string) => db.bonuses.filter((b) => b.Month === month && b.Year === year && b.PMOStatusId === OT_APPROVED && b.PackageAmount !== null && b.EmployeeId === empId).reduce((t, b) => t + (b.PackageAmount ?? 0), 0);
  file.rows.forEach((r, i) => {
    const line = i + 2;
    if (isBlank(r.code)) return result.Errors.push(`Dòng ${line}: Mã NV trống.`);
    const code = r.code.trim();
    const user = db.users.find((u) => !u.IsDeleted && eqCode(u.StaffId, code));
    if (!user) return result.Errors.push(`Dòng ${line}: Không tìm thấy nhân viên có mã '${code}'.`);
    const v = (k: ImportField) => r.values[k] ?? 0;
    // upsert bảng import — trùng mã lấy Id NHỎ nhất (SS:1518), khác preview lấy Id lớn nhất
    let rec = db.imports.filter((x) => x.Year === yStr && x.Month === mStr && eqCode(x.EmployeeCode, code)).sort((a, b) => a.Id - b.Id)[0];
    if (!rec) {
      rec = { Id: nextId++, Year: yStr, Month: mStr, EmployeeCode: code, EmployeeId: null, ImportFileName: '', ImportedAt: '', DeviceAllowance: 0, ParkingAllowance: 0, OtherAllowances: 0, ProjectBonus: 0, BusinessBonus: 0, ReferralBonus: 0, BusinessTripAllowance: 0, OtherBonuses: 0, TaxAdjustment: 0 };
      db.imports.push(rec);
      inserted.add(rec.Id);
    } else if (!inserted.has(rec.Id)) updated.add(rec.Id);
    rec.EmployeeId = user.Id;
    IMPORT_FIELDS.forEach((k) => (rec[k] = v(k)));
    rec.ImportFileName = file.name;
    rec.ImportedAt = ctx.now;
    // Kỳ đã có dòng Salary ⇒ ghi thẳng + CHỈ RecalculateSalary (không tính lại công/OT; giữ PC onsite đã lưu từ kỳ chốt)
    const sal = db.salaries.find((s) => !s.IsDeleted && s.Year === yStr && s.Month === mStr && eqCode(s.StaffId, code));
    if (sal) {
      (['DeviceAllowance', 'ParkingAllowance', 'OtherAllowances', 'ProjectBonus', 'BusinessBonus', 'ReferralBonus', 'BusinessTripAllowance', 'TaxAdjustment'] as ImportField[]).forEach((k) => ((sal as any)[k] = v(k)));
      sal.OtherBonuses = v('OtherBonuses') + approvedBonus(sal.EmployeeId);
      recalculateSalary(sal);
      if (!recalculated.includes(code)) recalculated.push(code);
    }
  });
  result.UpdatedCount = inserted.size + updated.size;
  if (result.UpdatedCount) pushLog(db, ctx.now, `Import "${file.name}" kỳ ${periodLabel(year, month)}: ${result.UpdatedCount} dòng import; RecalculateSalary cho dòng đã lưu: ${recalculated.join(', ') || '(không có — kỳ chưa có dòng Salary)'}`);
  return { db, result, recalculated };
}

// ═════════════════════════════ Lớp UI handler (toast giống SalaryComponent / SSL) ═════════════════════════════
export type ToastType = 'success' | 'warning' | 'error' | 'info';
export interface Outcome {
  db: SalaryDb;
  toast: { type: ToastType; text: string };
  /** true = popup đóng / màn tải lại */
  done: boolean;
  mails?: MailItem[];
  crash?: boolean;
  importResult?: ImportResult;
}
const errOut = (db: SalaryDb, e: unknown): Outcome => {
  if (e instanceof ServiceError && e.kind === 'crash') throw e;
  return { db, toast: { type: 'error', text: (e as Error).message }, done: false };
};
/** SalaryPopupComponent.HandleValidSubmit (SPC:86-110). */
export function uiCreatePeriod(db: SalaryDb, ctx: Ctx, year: number, month: number): Outcome {
  try {
    const r = svcCreatePeriod(db, ctx, year, month);
    if (r.succeeded) return { db: r.db, toast: { type: 'success', text: 'Add successfully!' }, done: true };
    return { db, toast: { type: 'warning', text: r.message || 'Add error!' }, done: false };
  } catch (e) {
    return errOut(db, e);
  }
}
/** SC.cs:178-191 — ghi chú bắt buộc ở popup nhưng KHÔNG gửi xuống service. */
export function uiApprove(db: SalaryDb, ctx: Ctx, id: number, _note: string): Outcome {
  try {
    const r = svcApprove(db, ctx, id);
    if (!r.ok) return { db, toast: { type: 'error', text: 'Approve Salary failed!' }, done: false };
    return { db: r.db, toast: { type: 'success', text: 'Approve Salary successfully!' }, done: true };
  } catch (e) {
    return errOut(db, e);
  }
}
export function uiReject(db: SalaryDb, ctx: Ctx, id: number, note: string): Outcome {
  try {
    const r = svcReject(db, ctx, id, note);
    if (!r.ok) return { db, toast: { type: 'error', text: 'Reject Salary failed!' }, done: false };
    return { db: r.db, toast: { type: 'success', text: 'Reject Salary successfully!' }, done: true };
  } catch (e) {
    return errOut(db, e);
  }
}
export function uiLock(db: SalaryDb, ctx: Ctx, id: number): Outcome {
  try {
    const r = svcLock(db, ctx, id);
    return r.succeeded ? { db: r.db, toast: { type: 'success', text: 'Lock successfully!' }, done: true } : { db, toast: { type: 'error', text: r.message }, done: false };
  } catch (e) {
    return errOut(db, e);
  }
}
export function uiUnlock(db: SalaryDb, ctx: Ctx, id: number): Outcome {
  try {
    const r = svcUnlock(db, ctx, id);
    return r.succeeded ? { db: r.db, toast: { type: 'success', text: 'Unlock successfully!' }, done: true } : { db, toast: { type: 'error', text: r.message }, done: false };
  } catch (e) {
    return errOut(db, e);
  }
}
export function uiDelete(db: SalaryDb, ctx: Ctx, id: number): Outcome {
  try {
    const r = svcDelete(db, ctx, id);
    return r.succeeded ? { db: r.db, toast: { type: 'success', text: 'Delete Payroll successfully!' }, done: true } : { db, toast: { type: 'error', text: r.message }, done: false };
  } catch (e) {
    return errOut(db, e);
  }
}
/** Lưới kỳ: gửi phiếu lương CẢ KỲ (không truyền listEmployee) — SC.cs:168-176. */
export function uiSendMailPeriod(db: SalaryDb, ctx: Ctx, year: number, month: number): Outcome {
  try {
    const r = createSalaryRecords(db, ctx, year, month, { isSendMail: true });
    return { db: r.db, toast: { type: 'success', text: 'Send Salary successfully!' }, done: true, mails: r.mails };
  } catch (e) {
    return errOut(db, e);
  }
}
/** Trang B: bắt buộc chọn ≥ 1 dòng (SSL:631-659). selected = null khi chưa từng tick. */
export function uiSendMailDetail(db: SalaryDb, ctx: Ctx, year: number, month: number, selected: string[] | null): Outcome {
  const ids = [...new Set(selected ?? [])];
  if (!ids.length) return { db, toast: { type: 'warning', text: 'Please select at least one employee to send mail.' }, done: false };
  try {
    const r = createSalaryRecords(db, ctx, year, month, { isSendMail: true, listEmployee: ids });
    return { db: r.db, toast: { type: 'success', text: 'Send emails successfully!' }, done: true, mails: r.mails };
  } catch (e) {
    return errOut(db, e);
  }
}
/**
 * Re-Collect (SSL:661-687). `SelectedDataItems.OfType<Salary>()` nằm NGOÀI try:
 * chưa từng tick dòng nào (null) ⇒ ArgumentNullException chưa bắt ⇒ sập circuit Blazor.
 * Đã tick rồi bỏ hết (rỗng) ⇒ service bỏ lọc ⇒ tính lại CẢ KỲ.
 */
export function recollectPrecheck(selected: string[] | null): string | null {
  return selected === null ? "System.ArgumentNullException: Value cannot be null. (Parameter 'source') — tại ShowPopupReColelct (SalarySumarryListComponent.razor:664)" : null;
}
export function uiRecollect(db: SalaryDb, ctx: Ctx, year: number, month: number, selected: string[]): Outcome {
  try {
    const r = createSalaryRecords(db, ctx, year, month, { isReCollect: true, listEmployee: selected });
    return { db: r.db, toast: { type: 'success', text: 'Recollect successfully!' }, done: true };
  } catch (e) {
    return errOut(db, e);
  }
}
/** Kết quả import trên UI (SSL:713-772). */
export function uiImport(db: SalaryDb, ctx: Ctx, year: number, month: number, file: ImportFile): Outcome {
  try {
    const { db: db2, result } = svcImport(db, ctx, year, month, file);
    const n = result.UpdatedCount;
    const m = result.Errors.length;
    if (!m && result.Success) return { db: db2, toast: { type: 'success', text: `Import thành công! Đã cập nhật ${n} nhân viên.` }, done: true, importResult: result };
    if (m && n) return { db: db2, toast: { type: 'warning', text: `Import hoàn thành một phần. Đã cập nhật ${n} nhân viên, nhưng phát hiện ${m} lỗi.` }, done: false, importResult: result };
    if (m) return { db: db2, toast: { type: 'error', text: 'Import thất bại! Vui lòng kiểm tra danh sách lỗi.' }, done: false, importResult: result };
    return { db: db2, toast: { type: 'error', text: 'Import thất bại!' }, done: false, importResult: result };
  } catch (e) {
    return errOut(db, e);
  }
}

// ═════════════════════════════ Dữ liệu mẫu (giả) ═════════════════════════════
const COMPANY = 'Công ty Mẫu';
const BANK = 'Ngân hàng TMCP Mẫu';
const u = (Id: string, StaffId: string, FullName: string, Position: string, Division: string, Department: string, StartDate: string, ResignationDate: string | null = null, UserId: number | null = null): UserProfile => ({
  Id, UserId, StaffId, FullName, Position, Division, Department, Company: COMPANY,
  Email: StaffId ? `${StaffId.toLowerCase()}@congty-mau.local` : `${Id}@congty-mau.local`,
  BankAccount: `1900${Id.replace(/\D/g, '').padStart(6, '0')}`, BankName: BANK, StartDate, ResignationDate,
});
/** 6 NV onsite (E1–E6) có cùng họ tên + mã NV ở payroll: E1→e01, E2→e02, E3→e03 (thử việc), E4→e04, E5→e06, E6→e05 (học việc).
 *  NV007, NV008, e09, NV010 không có trong kho onsite. */
export const SEED_USERS: UserProfile[] = [
  u('e01', 'V01021', 'Nguyễn Văn Bình', 'Senior Developer', 'Khối Delivery 1', 'Development', '2023-03-01', null, 101),
  u('e02', 'V01088', 'Hoàng Thị Lan', 'Delivery Manager', 'Khối Delivery 1', 'Delivery', '2022-07-01', null, 102),
  u('e03', 'V01102', 'Đặng Quốc Việt', 'QA Engineer', 'Khối Delivery 1', 'QA', '2026-09-15', null, 103),
  u('e04', 'V01135', 'Bùi Thanh Tùng', 'Business Analyst', 'Khối Delivery 2', 'BA', '2026-03-01', null, 104),
  u('e05', 'V01203', 'Lý Minh Khoa', 'Intern Developer', 'Khối Delivery 1', 'Development', '2026-06-01', null, 105),
  u('e06', 'V01177', 'Phan Ngọc Mai', 'Developer', 'Khối Delivery 1', 'Development', '2024-01-01', null, 106),
  u('e07', 'NV007', 'Đặng Quốc Khánh', 'Onsite Engineer', 'Khối Staffing', 'Staffing', '2025-06-01', null, 107),
  u('e08', 'NV008', 'Bùi Thanh Mai', 'Sales Executive', 'Khối Kinh doanh', 'Sales', '2025-01-01', '2026-10-20', 108),
  u('e09', '', 'Ngô Thị Hạnh', 'Sales Admin', 'Khối Kinh doanh', 'Sales', '2026-10-05', null, null),
  u('e10', 'NV010', 'Đỗ Văn Tùng', 'Marketing Executive', '', 'Marketing', '2026-08-01', null, 110),
];
const ct = (t: ContractType, ins: string | null = null): Contract => ({ ContractType: t, InsuranceStartDate: ins });
const h = (Id: number, EmployeeId: string, EffectiveDate: string, gross: number, ins: number, lunch: number, fuel: number, phone: number, house: number, epb: number, c: Contract | null): SalaryHistory => ({
  Id, EmployeeId, EffectiveDate, GrossIncome: gross, InsuranceSalary: ins, LunchAllowance: lunch, TransportationAllowance: fuel, MobileAllowance: phone, AccommodationAllowance: house, EstimatedPerformanceBonus: epb, Contracts: c,
});
export const SEED_HISTORIES: SalaryHistory[] = [
  h(1, 'e01', '2025-01-01', 40_000_000, 30_000_000, 730_000, 1_000_000, 500_000, 0, 7_770_000, ct(ContractType.INDEFINITE_TERM, '2024-01-01')),
  h(2, 'e02', '2025-01-01', 80_000_000, 60_000_000, 730_000, 1_000_000, 500_000, 2_000_000, 15_770_000, ct(ContractType.INDEFINITE_TERM, '2023-01-01')),
  h(3, 'e03', '2026-09-15', 12_000_000, 10_000_000, 730_000, 0, 0, 0, 1_270_000, ct(ContractType.PROBATION)),
  h(4, 'e04', '2026-03-01', 15_000_000, 12_000_000, 730_000, 300_000, 200_000, 0, 1_770_000, ct(ContractType.FIXED_TERM, '2026-11-01')),
  h(5, 'e05', '2026-06-01', 5_000_000, 5_000_000, 0, 0, 0, 0, 0, ct(ContractType.INTERN)),
  h(6, 'e06', '2025-01-01', 18_000_000, 14_000_000, 730_000, 500_000, 300_000, 0, 2_470_000, ct(ContractType.INDEFINITE_TERM, '2024-03-01')),
  h(7, 'e06', '2026-10-15', 22_000_000, 17_000_000, 730_000, 500_000, 300_000, 0, 3_470_000, ct(ContractType.INDEFINITE_TERM, '2024-03-01')),
  h(8, 'e07', '2025-06-01', 25_000_000, 20_000_000, 730_000, 500_000, 300_000, 0, 3_470_000, ct(ContractType.INDEFINITE_TERM, '2025-06-01')),
  h(9, 'e08', '2025-01-01', 16_000_000, 13_000_000, 730_000, 300_000, 200_000, 0, 1_770_000, ct(ContractType.FIXED_TERM, '2025-01-01')),
  h(10, 'e09', '2026-10-05', 9_000_000, 9_000_000, 0, 0, 0, 0, 0, ct(ContractType.PROBATION)),
  h(11, 'e10', '2026-08-01', 14_000_000, 12_000_000, 730_000, 0, 0, 0, 1_270_000, ct(ContractType.PROBATION)),
];
/** Bảng công tháng đã khoá. Kỳ 10/2026 theo mục 8.1; kỳ 08, 09 đủ công. */
const SEED_TS_10: [string, number, number][] = [
  ['e01', 22, 0], ['e02', 22, 0], ['e03', 20, 0], ['e04', 19, 0], ['e05', 22, 0], ['e06', 10, 12], ['e07', 21.5, 0], ['e08', 14, 0], ['e09', 18, 0], ['e10', 22, 0],
];
function seedTimesheets(): MonthTimesheet[] {
  const out: MonthTimesheet[] = [];
  for (const [y, m] of [[2026, 8], [2026, 9]]) {
    const wd = workDaysInMonth(y, m);
    for (const usr of SEED_USERS) {
      if (!usr.StartDate || ms(usr.StartDate) > ms(ymd(y, m, daysInMonth(y, m)))) continue;
      const full = usr.Id === 'e03' && m === 9 ? 12 : wd; // V01102 vào làm 15/09
      out.push({ EmployeeId: usr.Id, Year: y, Month: m, IsLocked: true, TotalPayableWork: full, TotalPayableWork1: full, TotalPayableWork2: 0 });
    }
  }
  SEED_TS_10.forEach(([e, w1, w2]) => out.push({ EmployeeId: e, Year: 2026, Month: 10, IsLocked: true, TotalPayableWork: w1 + w2, TotalPayableWork1: w1, TotalPayableWork2: w2 }));
  return out;
}

/** Trạng thái dữ liệu nguồn trước khi có kỳ lương nào. */
export function baseDb(): SalaryDb {
  return {
    periods: [],
    users: clone(SEED_USERS),
    histories: clone(SEED_HISTORIES),
    timesheets: seedTimesheets(),
    hourlyOTs: [
      { Id: 1, EmployeeId: 'e01', Date: '2026-10-07', HRApproveDate: '2026-10-25T09:00:00', HRStatusId: OT_APPROVED, OvertimeHours: 4, NormalDayOt: 4 },
      { Id: 2, EmployeeId: 'e01', Date: '2026-10-10', HRApproveDate: '2026-10-25T09:00:00', HRStatusId: OT_APPROVED, OvertimeHours: 8, WeekendDayOt: 8 },
      { Id: 3, EmployeeId: 'e06', Date: '2026-10-08', HRApproveDate: '2026-10-25T09:00:00', HRStatusId: OT_APPROVED, OvertimeHours: 3, NormalNight1Ot: 3 },
      { Id: 4, EmployeeId: 'e06', Date: '2026-10-20', HRApproveDate: '2026-10-25T09:00:00', HRStatusId: OT_APPROVED, OvertimeHours: 2, HolidayDayOt: 2 },
      { Id: 5, EmployeeId: 'e04', Date: '2026-10-14', HRApproveDate: null, HRStatusId: 1, OvertimeHours: 2, NormalDayOt: 2 },
      { Id: 6, EmployeeId: 'e05', Date: '2026-10-30', HRApproveDate: '2026-11-02T10:00:00', HRStatusId: OT_APPROVED, OvertimeHours: 2, NormalDayOt: 2 },
    ],
    packageOTs: [{ Id: 1, EmployeeId: 'e04', Name: 'Gói OT go-live dự án BA-26', StartDate: '2026-10-01', HRApproveDate: '2026-10-20T15:00:00', HRStatusId: OT_APPROVED, PackageAmount: 2_000_000 }],
    bonuses: [
      { Id: 1, EmployeeId: 'e01', Year: 2026, Month: 10, PMOStatusId: OT_APPROVED, PackageAmount: 1_000_000 },
      { Id: 2, EmployeeId: 'e02', Year: 2026, Month: 10, PMOStatusId: 1, PackageAmount: 500_000 },
    ],
    backpays: [
      { Id: 1, EmployeeId: 'e07', Year: 2026, Month: 10, StatusId: OT_APPROVED, PackageAmount: 1_500_000 },
      { Id: 2, EmployeeId: 'e07', Year: 2026, Month: 10, StatusId: OT_APPROVED, PackageAmount: -500_000 },
      { Id: 3, EmployeeId: 'e03', Year: 2026, Month: 10, StatusId: 1, PackageAmount: 300_000 },
    ],
    holidays: [
      { Id: 1, Name: 'Quốc khánh 2/9', StartDate: '2026-09-02', BonusPaymentDate: '2026-10-25', HasHolidayBonus: true, BonusIntern: 200_000, BonusProbation: 300_000, BonusOfficial: 500_000 },
      { Id: 2, Name: 'Giỗ Tổ Hùng Vương', StartDate: '2026-04-26', BonusPaymentDate: '2026-04-20', HasHolidayBonus: true, BonusIntern: 100_000, BonusProbation: 200_000, BonusOfficial: 300_000 },
    ],
    dependents: [
      { Id: 1, UserProfileId: 'e01', Name: 'Con 1', IsCalculated: true, StartDate: '2024-01-01', EndDate: null },
      { Id: 2, UserProfileId: 'e02', Name: 'Con 1', IsCalculated: true, StartDate: '2023-01-01', EndDate: null },
      { Id: 3, UserProfileId: 'e02', Name: 'Mẹ', IsCalculated: true, StartDate: null, EndDate: null },
      { Id: 4, UserProfileId: 'e06', Name: 'Con 1', IsCalculated: true, StartDate: '2025-05-01', EndDate: null },
      { Id: 5, UserProfileId: 'e04', Name: 'Con 1', IsCalculated: false, StartDate: '2026-01-01', EndDate: null },
    ],
    leaves: [
      { Id: 1, EmployeeId: 'e02', StartDate: '2026-10-13T08:00:00', EndDate: '2026-10-13T12:00:00', TotalHours: 4, Status: ST_APPROVED, Note: 'Nghỉ phép nửa ngày sáng' },
      { Id: 2, EmployeeId: 'e03', StartDate: '2026-10-08T08:00:00', EndDate: '2026-10-09T17:30:00', TotalHours: 16, Status: ST_APPROVED, Note: 'Nghỉ không lương 2 ngày' },
      { Id: 3, EmployeeId: 'e04', StartDate: '2026-10-21T08:00:00', EndDate: '2026-10-23T17:30:00', TotalHours: 24, Status: ST_APPROVED, Note: 'Nghỉ không lương 3 ngày' },
      { Id: 4, EmployeeId: 'e05', StartDate: '2026-10-28T08:00:00', EndDate: '2026-10-28T17:30:00', TotalHours: 8, Status: ST_REQUESTED, Note: 'Nghỉ phép (đang chờ duyệt)' },
    ],
    imports: [
      { Id: 1, Year: '2026', Month: '2026-10', EmployeeCode: 'V01021', EmployeeId: 'e01', ImportFileName: 'cac_khoan_khac_10_2026.xlsx', ImportedAt: '2026-11-04T10:00:00', DeviceAllowance: 300_000, ParkingAllowance: 0, OtherAllowances: 0, ProjectBonus: 0, BusinessBonus: 0, ReferralBonus: 0, BusinessTripAllowance: 0, OtherBonuses: 500_000, TaxAdjustment: 0 },
      { Id: 2, Year: '2026', Month: '2026-10', EmployeeCode: 'NV007', EmployeeId: 'e07', ImportFileName: 'cac_khoan_khac_10_2026.xlsx', ImportedAt: '2026-11-04T10:00:00', DeviceAllowance: 0, ParkingAllowance: 200_000, OtherAllowances: 0, ProjectBonus: 2_000_000, BusinessBonus: 0, ReferralBonus: 0, BusinessTripAllowance: 1_000_000, OtherBonuses: 0, TaxAdjustment: 0 },
    ],
    worklogs: [
      { EmployeeId: 'e07', WorkDate: '2026-10-05', IsStaff: true, ProjectCode: 'STF-2605' },
      { EmployeeId: 'e07', WorkDate: '2026-10-19', IsStaff: true, ProjectCode: 'STF-2601' },
      { EmployeeId: 'e07', WorkDate: '2026-09-15', IsStaff: true, ProjectCode: 'STF-2601' },
    ],
    salaries: [],
    log: [],
  };
}

export const HR_CTX = (now: string, closings?: OnsiteClosing[]): Ctx => ({ profile: profileOf('hr'), now, closings });

/**
 * Dữ liệu ban đầu theo mục 8.3: 08/2026 Approved + khoá; 09/2026 Approved chưa khoá; 10/2026 Requested.
 * Kỳ 08, 09 được sinh bằng chính luồng duyệt ở thời điểm quá khứ (dòng Salary; PC onsite 09 lấy từ kỳ chốt OC-2026-09).
 */
export function seedDb(): SalaryDb {
  let db = baseDb();
  const step = (now: string, f: (d: SalaryDb, c: Ctx) => SalaryDb) => (db = f(db, HR_CTX(now, INIT_CLOSINGS)));
  step('2026-09-01T08:30:00', (d, c) => svcCreatePeriod(d, c, 2026, 8).db);
  step('2026-09-05T09:00:00', (d, c) => svcApprove(d, c, 1).db);
  step('2026-09-10T17:00:00', (d, c) => svcLock(d, c, 1).db);
  step('2026-10-01T08:30:00', (d, c) => svcCreatePeriod(d, c, 2026, 9).db);
  step('2026-10-05T09:00:00', (d, c) => svcApprove(d, c, 2).db);
  step('2026-11-03T09:00:00', (d, c) => svcCreatePeriod(d, c, 2026, 10).db);
  db.periods.forEach((p) => {
    if (p.Id === 1) p.ApprovedBy = 'Người duyệt lương';
    if (p.Id === 2) p.ApprovedBy = 'Người duyệt lương';
  });
  db.log = [{ at: '2026-11-03T09:00:00', text: 'Dữ liệu mẫu: 08/2026 đã duyệt + khoá, 09/2026 đã duyệt, 10/2026 mới tạo (Requested).' }];
  return db;
}

/** File mẫu chọn thay cho ô chọn file (.xlsx) — mô phỏng. */
export const SAMPLE_IMPORT_FILES: ImportFile[] = [
  { name: 'cac_khoan_khac_bo_sung.xlsx', sizeKb: 9.4, note: 'Hợp lệ 2 dòng', rows: [{ code: 'V01102', values: { OtherAllowances: 500_000 } }, { code: 'nv008 ', values: { ReferralBonus: 1_000_000 } }] },
  { name: 'cac_khoan_khac_co_loi.xlsx', sizeKb: 10.1, note: '1 dòng đúng + 2 dòng lỗi', rows: [{ code: 'V01088', values: { BusinessBonus: 3_000_000 } }, { code: '', values: { DeviceAllowance: 200_000 } }, { code: 'NV999', values: { ParkingAllowance: 100_000 } }] },
  { name: 'cac_khoan_khac_sai_ma.xlsx', sizeKb: 8.7, note: 'Toàn bộ lỗi', rows: [{ code: 'NV998', values: { OtherAllowances: 100_000 } }, { code: ' ', values: {} }] },
  { name: 'cac_khoan_khac_ghi_de_V01021.xlsx', sizeKb: 8.9, note: 'Ghi đè V01021 (Thưởng khác 2tr)', rows: [{ code: 'V01021', values: { DeviceAllowance: 300_000, OtherBonuses: 2_000_000 } }] },
];

// ═════════════════════════════ Định dạng ═════════════════════════════
/** StringHelper.FormatCurrency: vi-VN, phân nghìn dấu chấm, kèm " ₫"; có lẻ ⇒ #,0.## */
export const fmtCurrency = (v: number | null | undefined) => {
  const n = v ?? 0;
  return `${n.toLocaleString('vi-VN', { maximumFractionDigits: 2 })} ₫`;
};
/** N0 (en-US mặc định của DevExpress footer) */
export const fmtN0 = (v: number) => Math.round(v).toLocaleString('en-US');
export const fmtN2 = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtNum = (v: number) => String(v);
