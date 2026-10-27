/**
 * EmployeePage — "Employees" (Human Resources). Giao diện theo bộ khung ERP của màn Dự án kinh doanh.
 *
 *  • Danh sách nhân sự: ô số liệu theo trạng thái (bấm để lọc) · bảng nhân sự (lọc Khối / Trạng thái, tìm kiếm) · bấm 1 dòng → hồ sơ.
 *    [Thêm nhân viên] [Import nhân viên] (HR) — import ngay trên màn: tải file mẫu, chọn file, xem trước Thêm mới / Cập nhật / Lỗi.
 *    [Xuất Excel ▾] — chọn cột dữ liệu cần xuất (nhớ lựa chọn), xuất danh sách đang lọc hoặc tất cả.
 *  • Hồ sơ nhân viên:
 *      Thanh tiêu đề: [Quay lại] … Vai trò · [Xuất hồ sơ] [Sửa] [Xoá]; dải thông tin Mã NV · Trạng thái · Hợp đồng · Cập nhật
 *      Khung "Nhân viên": ảnh 3×4 + Mã NV, Họ và tên, UserName, Email công ty, Khối, Phòng ban, Vị trí, Level
 *      Tab Thông tin nhân sự: Công việc · Thông tin cá nhân · Học vấn & kinh nghiệm · Giấy tờ, thuế & ngân hàng ·
 *                             Hợp đồng & tài liệu (chỉ hiện Loại hợp đồng) · Ghi chú
 *      Tab Lịch sử: mọi lần tạo / sửa (kèm nội dung thay đổi) / hợp đồng / tài liệu
 *  • Dữ liệu nhân sự dùng chung với màn Contracts (useEmployees / setEmployees).
 *  • Sửa trực tiếp trên màn chi tiết (không popup) → [Huỷ sửa] [Lưu thay đổi].
 *  • Vai trò: Nhân sự (HR) — xem đủ, sửa, xoá, xuất hồ sơ, thêm hợp đồng / tài liệu / ảnh;
 *             Quản lý trực tiếp — chỉ xem, số CCCD / MST / BHXH / tài khoản bị che; Nhân viên — chỉ xem hồ sơ của mình.
 */
import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import * as XLSX from 'xlsx';
import {
  AlertTriangle, Briefcase, Calendar, Check, ChevronDown, Camera, Download, FileSignature, FileSpreadsheet, FileText, GraduationCap, Hash, History, IdCard,
  LayoutList, Lock, NotebookPen, Paperclip, Pencil, Plus, Save, Search, Table2, Trash2, Upload, User, UserPlus, X,
} from 'lucide-react';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, KpiBox, Panel, Tag, erp } from './erp/Erp';
import { DIVISIONS } from '../business/BusinessProjectContext';

// ==========================================================================
// Dữ liệu
// ==========================================================================
type Role = 'HR' | 'QL' | 'NV';
const ROLE_LABEL: Record<Role, string> = { HR: 'Nhân sự (HR)', QL: 'Quản lý trực tiếp', NV: 'Nhân viên (bản thân)' };
const ROLE_USER: Record<Role, string> = { HR: 'hr.lan', QL: 'quanly', NV: 'nhanvien' };

export const STATUSES = ['Đang làm việc', 'Thử việc', 'Nghỉ thai sản', 'Đã nghỉ việc'] as const;
export type EmpStatus = (typeof STATUSES)[number];
export const STATUS_CLS: Record<EmpStatus, string> = {
  'Đang làm việc': 'bg-emerald-50 text-emerald-700 border-emerald-300',
  'Thử việc': 'bg-amber-50 text-amber-700 border-amber-300',
  'Nghỉ thai sản': 'bg-violet-50 text-violet-700 border-violet-300',
  'Đã nghỉ việc': 'bg-slate-100 text-slate-600 border-slate-300',
};
export const LEVELS = ['Intern', 'Fresher', 'Junior', 'Middle', 'Senior', 'Lead', 'Manager'];
export const POSITIONS = ['Developer', 'QC', 'BA', 'PM', 'DevOps', 'Designer', 'HR', 'Kế toán'];
export const DEPARTMENTS = ['Staffing', 'Delivery', 'Sản xuất', 'Kinh doanh', 'Hành chính – Nhân sự', 'Tài chính – Kế toán'];
export const COMPANIES = ['AEQUITAS', 'VTX GROUP'];
/** Tài khoản đăng nhập hệ thống chưa gán nhân viên (UserName chọn từ danh sách tài khoản). */
const FREE_ACCOUNTS = ['tuanna', 'huongpt', 'longnh', 'trangdt', 'quangvm', 'hainv'];
/** Quản lý không thuộc danh sách nhân sự mẫu (BOD / GĐK). */
export const EXTRA_MANAGERS = ['NGUYỄN QUANG HUY'];
/** Loại hợp đồng lao động (theo iHRP) · số tháng (0 = không thời hạn) · ký hiệu dùng trong Số HĐ. */
export const CONTRACT_TYPES = ['Thử việc', 'Xác định thời hạn 12 tháng', 'Xác định thời hạn 24 tháng', 'Xác định thời hạn 36 tháng', 'Không xác định thời hạn'];
export const CONTRACT_META: Record<string, { months: number; abbr: string }> = {
  'Thử việc': { months: 2, abbr: 'TV' },
  'Xác định thời hạn 12 tháng': { months: 12, abbr: 'XĐ12' },
  'Xác định thời hạn 24 tháng': { months: 24, abbr: 'XĐ24' },
  'Xác định thời hạn 36 tháng': { months: 36, abbr: 'XĐ36' },
  'Không xác định thời hạn': { months: 0, abbr: 'KXĐ' },
};
export const WORK_TIMES = ['Giờ hành chính (8h/ngày, T2–T6)', 'Ca kíp', 'Bán thời gian', 'Linh hoạt'];
export const WORKPLACES = ['Văn phòng Hà Nội', 'Văn phòng TP. Hồ Chí Minh', 'Văn phòng Đà Nẵng', 'Onsite tại khách hàng'];
/** Lương cơ bản gốc mẫu theo Level (VNĐ). */
const BASE_SALARY: Record<string, number> = { Intern: 5_000_000, Fresher: 9_000_000, Junior: 14_000_000, Middle: 22_000_000, Senior: 32_000_000, Lead: 42_000_000, Manager: 55_000_000 };

export interface EmpAllowance {
  id: string;
  name: string;
  amount: number; // VNĐ / tháng
}
export interface EmpContract {
  id: string;
  no: string;
  type: string;
  signDate: string; // YYYY-MM-DD
  from: string;
  to: string; // '' = không thời hạn
  note: string;
  /** Mô tả công việc · Nơi làm việc · Thời gian làm việc */
  jobDesc?: string;
  workplace?: string;
  workTime?: string;
  /** Người ký (đại diện công ty) · chức danh · nơi ký · theo giấy uỷ quyền */
  signer?: string;
  signerTitle?: string;
  signPlace?: string;
  authorization?: string;
  /** Lương cơ bản gốc (VNĐ) · mức hưởng (%) — lương cơ bản = gốc × mức hưởng */
  baseSalary?: number;
  rate?: number;
  allowances?: EmpAllowance[];
  /** Bảo hiểm tham gia */
  insurance?: { bhxh: boolean; bhyt: boolean; bhtn: boolean };
  files?: EmpFile[];
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}
export interface EmpFile {
  id: string;
  name: string;
  size: number;
  at: string;
  by: string;
}
interface EmpLog {
  at: string;
  by: string;
  action: string;
  changes?: string[];
}
export interface Employee {
  id: string;
  code: string;
  /** Họ và tên đệm (Surname). */
  surname: string;
  /** Tên (Name). */
  givenName: string;
  /** Họ và tên = Họ và tên đệm + Tên (tự ghép, không sửa tay). */
  fullName: string;
  userName: string;
  companyEmail: string;
  division: string;
  department: string;
  position: string;
  level: string;
  // Công việc
  company: string;
  manager: string;
  joinDate: string;
  officialDate: string;
  status: EmpStatus;
  leaveDate: string;
  techStack: string;
  autoAttendance: boolean;
  staffing: boolean;
  // Cá nhân
  gender: string;
  birthDate: string;
  maritalStatus: string;
  vehicle: string;
  phone: string;
  personalEmail: string;
  currentAddress: string;
  permanentAddress: string;
  /** Số người phụ thuộc (giảm trừ gia cảnh). */
  dependents: string;
  // Học vấn
  education: string;
  school: string;
  major: string;
  gradYear: string;
  /** Số năm kinh nghiệm làm việc. */
  experience: string;
  // Giấy tờ, thuế, ngân hàng
  idNo: string;
  idDate: string;
  idPlace: string;
  taxCode: string;
  socialInsNo: string;
  bankAccount: string;
  bankName: string;
  /** Ghi chú tự do (cuối trang). */
  note: string;
  contracts: EmpContract[];
  files: EmpFile[];
  /** Ảnh 3×4 (data URL) — bỏ trống thì hiện chữ viết tắt. */
  photo?: string;
  history: EmpLog[];
  updatedAt: string;
  updatedBy: string;
}

export const uid = () => Math.random().toString(36).slice(2, 9);
export const nowIso = () => new Date().toISOString();

/** Dữ liệu mẫu — họ tên, giấy tờ, tài khoản đều là giả lập. */
const mk = (
  code: string,
  fullName: string,
  userName: string,
  division: string,
  department: string,
  position: string,
  level: string,
  joinDate: string,
  status: EmpStatus,
  extra: Partial<Employee> = {},
): Employee => {
  const official = status === 'Thử việc' ? '' : addMonths(joinDate, 2);
  const created = `${joinDate}T02:00:00.000Z`;
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  const emp: Employee = {
    id: code,
    code,
    surname: words.slice(0, -1).join(' '),
    givenName: words[words.length - 1] || '',
    fullName,
    userName,
    companyEmail: `${userName}@aequitas.com.vn`,
    division,
    department,
    position,
    level,
    company: 'AEQUITAS',
    manager: 'NGUYỄN QUANG HUY',
    joinDate,
    officialDate: official,
    status,
    leaveDate: '',
    techStack: '',
    autoAttendance: false,
    staffing: department === 'Staffing',
    gender: 'Nam',
    birthDate: '1995-01-01',
    maritalStatus: 'Độc thân',
    vehicle: '',
    phone: '',
    personalEmail: '',
    currentAddress: '',
    permanentAddress: '',
    dependents: '0',
    education: 'Cử nhân',
    school: '',
    major: '',
    gradYear: '',
    experience: '',
    idNo: '',
    idDate: '',
    idPlace: 'Cục CS QLHC về TTXH',
    taxCode: '',
    socialInsNo: '',
    bankAccount: '',
    bankName: '',
    note: '',
    contracts: [],
    files: [],
    history: [{ at: created, by: 'hr.lan', action: 'Tạo hồ sơ nhân viên' }],
    updatedAt: created,
    updatedBy: 'hr.lan',
    ...extra,
  };
  if (!extra.contracts) emp.contracts = seedContracts(emp);
  return emp;
};

/** Số HĐ theo mẫu iHRP: Mã NV / Năm hiệu lực / Ký hiệu loại HĐ (trùng thì thêm -2, -3…). */
export const contractNo = (code: string, type: string, from: string, existing: string[] = []) => {
  const base = `${code}/${(from || today()).slice(0, 4)}/${CONTRACT_META[type]?.abbr || 'HĐ'}`;
  let no = base;
  for (let i = 2; existing.includes(no); i++) no = `${base}-${i}`;
  return no;
};
/** Ngày hết hiệu lực mặc định theo loại HĐ ('' với HĐ không xác định thời hạn). */
export const contractEnd = (type: string, from: string) => {
  const m = CONTRACT_META[type]?.months ?? 12;
  return m && from ? addDays(addMonths(from, m), -1) : '';
};
/** Loại HĐ tiếp theo khi tái ký: Thử việc → 12 tháng → 24 tháng → Không xác định thời hạn (tối đa 2 lần HĐ xác định thời hạn). */
export const nextContractType = (type: string) =>
  type === 'Thử việc' ? 'Xác định thời hạn 12 tháng' : type === 'Xác định thời hạn 12 tháng' ? 'Xác định thời hạn 24 tháng' : 'Không xác định thời hạn';
const SIGNER = { signer: 'NGUYỄN QUANG HUY', signerTitle: 'Tổng Giám đốc', signPlace: 'Hà Nội' };
/** Dữ liệu mẫu: chuỗi HĐ Thử việc → 12 tháng → 24 tháng → Không thời hạn, đến hợp đồng đang hiệu lực hôm nay. */
const seedContracts = (e: Employee): EmpContract[] => {
  const out: EmpContract[] = [];
  let from = e.joinDate;
  let type = 'Thử việc';
  const base = BASE_SALARY[e.level] || 14_000_000;
  while (from && from <= today() && out.length < 6) {
    const to = contractEnd(type, from);
    const tv = type === 'Thử việc';
    out.push({
      id: uid(),
      no: contractNo(e.code, type, from, out.map((c) => c.no)),
      type,
      signDate: from,
      from,
      to,
      note: '',
      jobDesc: `${e.position} — ${e.department}`,
      workplace: WORKPLACES[0],
      workTime: WORK_TIMES[0],
      ...SIGNER,
      baseSalary: base,
      rate: tv ? 85 : 100,
      allowances: tv ? [] : [{ id: uid(), name: 'Phụ cấp ăn trưa', amount: 730_000 }, { id: uid(), name: 'Phụ cấp điện thoại', amount: 300_000 }],
      insurance: { bhxh: !tv, bhyt: !tv, bhtn: !tv },
      files: [],
      createdAt: `${from}T02:00:00.000Z`,
      createdBy: 'hr.lan',
    });
    if (!to || to >= today()) break;
    from = addDays(to, 1);
    type = nextContractType(type);
  }
  return out;
};

const SEED: Employee[] = [
  mk('V00556', 'HOÀNG MINH KHÔI', 'khoihm', 'BFSI', 'Staffing', 'QC', 'Senior', '2025-03-26', 'Đang làm việc', {
    manager: 'NGUYỄN QUANG HUY',
    birthDate: '1995-07-16',
    phone: '0912345678',
    personalEmail: 'khoi.hoang95@example.com',
    currentAddress: 'Ngõ 12 Trần Đại Nghĩa, Hai Bà Trưng, Hà Nội',
    permanentAddress: 'Số 25, tổ dân phố 3, phường Lam Hạ, TP Phủ Lý, Hà Nam',
    vehicle: '90B1-123.45 (Honda Vision)',
    school: 'Trường Đại học Kinh tế quốc dân',
    major: 'Hệ thống thông tin quản lý',
    gradYear: '2019',
    experience: '6',
    techStack: 'Selenium, Postman, JMeter',
    note: 'Đang onsite tại khách hàng Ngân hàng 010 (dự án Core Banking Mobile).\nĐăng ký học chứng chỉ ISTQB Advanced, dự kiến thi 12/2026.',
    idNo: '035095000001',
    idDate: '2022-02-28',
    taxCode: '8640000001',
    socialInsNo: '0123000001',
    bankAccount: '100000000001',
    bankName: 'VietinBank',
    contracts: [],
    history: [
      { at: '2025-03-26T02:00:00.000Z', by: 'hr.lan', action: 'Tạo hồ sơ nhân viên' },
      { at: '2025-05-26T03:00:00.000Z', by: 'hr.lan', action: 'Sửa hồ sơ', changes: ['Ngày vào chính thức: — → 26/05/2025', 'Trạng thái: Thử việc → Đang làm việc'] },
      { at: '2026-10-12T08:15:00.000Z', by: 'hr.lan', action: 'Sửa hồ sơ', changes: ['Level: Middle → Senior', 'Staffing: Không → Có'] },
    ],
    updatedAt: '2026-10-12T08:15:00.000Z',
    updatedBy: 'hr.lan',
  }),
  mk('V00412', 'TRẦN THỊ MAI ANH', 'anhttm', 'G1', 'Delivery', 'BA', 'Lead', '2023-08-01', 'Đang làm việc', {
    gender: 'Nữ', birthDate: '1992-03-09', maritalStatus: 'Đã kết hôn', dependents: '2', phone: '0987000412', school: 'Học viện Công nghệ Bưu chính Viễn thông', major: 'Công nghệ thông tin', gradYear: '2014', experience: '12', bankName: 'Vietcombank', bankAccount: '0011000000412', idNo: '001192000412', taxCode: '8100000412',
  }),
  mk('V00478', 'LÊ VĂN ĐỨC', 'duclv', 'G1', 'Sản xuất', 'Developer', 'Middle', '2024-02-19', 'Đang làm việc', {
    birthDate: '1997-11-02', techStack: 'Java, Spring Boot, Oracle', school: 'Đại học Bách khoa Hà Nội', major: 'Khoa học máy tính', gradYear: '2019', experience: '5', bankName: 'Techcombank', bankAccount: '19030000478',
  }),
  mk('V00501', 'PHẠM THU HÀ', 'hapt', 'G2', 'Delivery', 'PM', 'Manager', '2024-06-03', 'Nghỉ thai sản', {
    gender: 'Nữ', birthDate: '1990-05-21', maritalStatus: 'Đã kết hôn', dependents: '1', school: 'Đại học FPT', major: 'Kỹ thuật phần mềm', gradYear: '2012', experience: '13', bankName: 'BIDV',
  }),
  mk('V00523', 'NGUYỄN ĐÌNH PHONG', 'phongnd', 'G3', 'Sản xuất', 'DevOps', 'Senior', '2024-10-14', 'Đang làm việc', {
    birthDate: '1993-08-30', techStack: 'Kubernetes, Terraform, AWS', autoAttendance: true, bankName: 'MB Bank',
  }),
  mk('V00540', 'ĐỖ HẢI YẾN', 'yendh', 'G4', 'Kinh doanh', 'BA', 'Junior', '2025-01-06', 'Đang làm việc', { gender: 'Nữ', birthDate: '1999-12-12' }),
  mk('V00561', 'VŨ ĐĂNG KHOA', 'khoavd', 'BFSI', 'Staffing', 'Developer', 'Senior', '2025-04-21', 'Đang làm việc', { techStack: '.NET, Angular, SQL Server', autoAttendance: true }),
  mk('V00588', 'BÙI NGỌC LINH', 'linhbn', 'GPDV', 'Delivery', 'Designer', 'Middle', '2025-09-29', 'Đang làm việc', { gender: 'Nữ', techStack: 'Figma, Illustrator' }),
  mk('V00602', 'ĐẶNG QUỐC BẢO', 'baodq', 'BFSI', 'Staffing', 'Developer', 'Junior', '2026-09-07', 'Thử việc', { techStack: 'React, Node.js' }),
  mk('V00610', 'NGÔ THỊ THANH', 'thanhnt', 'G1', 'Hành chính – Nhân sự', 'HR', 'Middle', '2026-09-21', 'Thử việc', { gender: 'Nữ' }),
  mk('V00377', 'TRỊNH CÔNG MINH', 'minhtc', 'G2', 'Sản xuất', 'Developer', 'Senior', '2022-05-16', 'Đã nghỉ việc', { leaveDate: '2026-06-30', techStack: 'PHP, Laravel' }),
];

// Kho dữ liệu nhân sự dùng chung (Employees ↔ Contracts); giữ khi chuyển màn (prototype, chưa có API).
let STORE: Employee[] = SEED;
const SUBS = new Set<() => void>();
export const getEmployees = () => STORE;
export const setEmployees = (fn: (l: Employee[]) => Employee[]) => {
  STORE = fn(STORE);
  SUBS.forEach((f) => f());
};
export const useEmployees = () =>
  useSyncExternalStore(
    (cb) => (SUBS.add(cb), () => void SUBS.delete(cb)),
    () => STORE,
  );
/** Chuyển sang màn khác trong ứng dụng (App lắng nghe sự kiện này); payload đọc ở màn đích. */
let NAV_PAYLOAD: { employeeId?: string } | null = null;
export const navigateTo = (item: string, payload?: { employeeId?: string }) => {
  NAV_PAYLOAD = payload || null;
  window.dispatchEvent(new CustomEvent('imis:navigate', { detail: { item } }));
};
export const takeNavPayload = () => {
  const p = NAV_PAYLOAD;
  NAV_PAYLOAD = null;
  return p;
};

// ==========================================================================
// Ngày tháng & định dạng
// ==========================================================================
export function addDays(iso: string, n: number) {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function addMonths(iso: string, n: number) {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate())); // 31/01 + 1 tháng = 28/02, không tràn sang tháng 3
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export const dmy = (iso: string) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : '');
const dmyhm = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
/** Ngày hôm nay theo giờ máy (giờ Việt Nam) — toISOString() là giờ UTC, trước 7h sáng sẽ lùi 1 ngày. */
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
const initials = (name: string) => {
  const w = name.trim().split(/\s+/).filter(Boolean);
  return w.length ? (w.length === 1 ? w[0][0] : w[0][0] + w[w.length - 1][0]).toUpperCase() : '?';
};
/** Che số nhạy cảm cho vai trò không phải HR: giữ 3 số cuối. */
const mask = (v: string) => (v ? `${'•'.repeat(Math.max(4, v.length - 3))}${v.slice(-3)}` : '');
const fileSize = (n: number) => (n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export const contractState = (c: EmpContract): { text: string; cls: string } => {
  const t = today();
  if (c.from > t) return { text: 'Chưa hiệu lực', cls: 'bg-sky-50 text-sky-700 border-sky-300' };
  if (c.to && c.to < t) return { text: 'Hết hạn', cls: 'bg-slate-100 text-slate-500 border-slate-300' };
  if (c.to && c.to <= addDays(t, 30)) return { text: 'Sắp hết hạn', cls: 'bg-amber-50 text-amber-700 border-amber-300' };
  return { text: 'Còn hiệu lực', cls: 'bg-emerald-50 text-emerald-700 border-emerald-300' };
};

// ==========================================================================
// Cấu hình trường — dùng chung cho xem / sửa / so sánh lịch sử / xuất hồ sơ
// ==========================================================================
type FieldKey = Exclude<keyof Employee, 'id' | 'contracts' | 'files' | 'photo' | 'history' | 'updatedAt' | 'updatedBy'>;
interface FieldDef {
  key: FieldKey;
  label: string;
  type?: 'text' | 'date' | 'select' | 'bool' | 'textarea' | 'number';
  /** Danh sách chọn cố định; trường có danh sách động (UserName, Quản lý) lấy ở màn chi tiết. */
  options?: readonly string[];
  /** Tự tính, không sửa tay (Họ và tên). */
  readonly?: boolean;
  min?: number;
  max?: number;
  /** Đơn vị hiển thị sau số (vd "năm"). */
  unit?: string;
  required?: boolean;
  /** Chỉ HR xem đủ; vai trò khác thấy số đã che. */
  sensitive?: boolean;
  placeholder?: string;
}
const HEAD_FIELDS: FieldDef[] = [
  { key: 'code', label: 'Mã NV', required: true },
  { key: 'fullName', label: 'Họ và tên', required: true, readonly: true },
  { key: 'surname', label: 'Họ và tên đệm', required: true, placeholder: 'vd: NGUYỄN VĂN' },
  { key: 'givenName', label: 'Tên', required: true, placeholder: 'vd: AN' },
  { key: 'userName', label: 'UserName', type: 'select', required: true },
  { key: 'companyEmail', label: 'Email công ty' },
  { key: 'division', label: 'Khối', type: 'select', options: DIVISIONS },
  { key: 'department', label: 'Phòng ban', type: 'select', options: DEPARTMENTS },
  { key: 'position', label: 'Vị trí', type: 'select', options: POSITIONS },
  { key: 'level', label: 'Level', type: 'select', options: LEVELS },
];
interface SectionDef {
  title: string;
  fields?: FieldDef[];
  /** Khung chia 2 nhóm có tiêu đề nhỏ (Giấy tờ & thuế | Ngân hàng). */
  groups?: { title: string; fields: FieldDef[] }[];
}
const SECTIONS: SectionDef[] = [
  {
    title: 'Công việc',
    fields: [
      { key: 'company', label: 'Công ty', type: 'select', options: COMPANIES },
      { key: 'manager', label: 'Quản lý trực tiếp', type: 'select' },
      { key: 'joinDate', label: 'Ngày vào làm', type: 'date' },
      { key: 'officialDate', label: 'Ngày vào chính thức', type: 'date' },
      { key: 'status', label: 'Trạng thái', type: 'select', options: STATUSES },
      { key: 'leaveDate', label: 'Ngày nghỉ việc', type: 'date' },
      { key: 'techStack', label: 'TechStack', placeholder: 'vd: Java, React, Oracle' },
      { key: 'autoAttendance', label: 'Chấm công tự động', type: 'bool' },
      { key: 'staffing', label: 'Staffing', type: 'bool' },
    ],
  },
  {
    title: 'Thông tin cá nhân',
    fields: [
      { key: 'gender', label: 'Giới tính', type: 'select', options: ['Nam', 'Nữ', 'Khác'] },
      { key: 'phone', label: 'Điện thoại' },
      { key: 'birthDate', label: 'Ngày sinh', type: 'date' },
      { key: 'personalEmail', label: 'Email cá nhân' },
      { key: 'maritalStatus', label: 'Tình trạng hôn nhân', type: 'select', options: ['Độc thân', 'Đã kết hôn', 'Khác'] },
      { key: 'currentAddress', label: 'Địa chỉ hiện tại' },
      { key: 'vehicle', label: 'Thông tin xe', placeholder: 'Biển số, loại xe' },
      { key: 'permanentAddress', label: 'Địa chỉ thường trú' },
      { key: 'dependents', label: 'Số người phụ thuộc', type: 'number', min: 0, max: 20, unit: 'người', placeholder: '0' },
    ],
  },
  {
    title: 'Học vấn & kinh nghiệm',
    fields: [
      { key: 'education', label: 'Trình độ', type: 'select', options: ['Trung cấp', 'Cao đẳng', 'Cử nhân', 'Kỹ sư', 'Thạc sĩ', 'Tiến sĩ'] },
      { key: 'gradYear', label: 'Năm tốt nghiệp', type: 'number', min: 1970, max: 2100, placeholder: 'vd: 2019' },
      { key: 'school', label: 'Trường' },
      { key: 'experience', label: 'Kinh nghiệm làm việc', type: 'number', min: 0, max: 50, unit: 'năm', placeholder: 'Số năm' },
      { key: 'major', label: 'Chuyên ngành' },
    ],
  },
  {
    title: 'Giấy tờ, thuế & ngân hàng',
    groups: [
      {
        title: 'Giấy tờ & thuế',
        fields: [
          { key: 'idNo', label: 'Số CCCD', sensitive: true },
          { key: 'idDate', label: 'Ngày cấp', type: 'date' },
          { key: 'idPlace', label: 'Nơi cấp' },
          { key: 'taxCode', label: 'Mã số thuế', sensitive: true },
          { key: 'socialInsNo', label: 'Số sổ BHXH', sensitive: true },
        ],
      },
      {
        title: 'Ngân hàng',
        fields: [
          { key: 'bankAccount', label: 'Số tài khoản', sensitive: true },
          { key: 'bankName', label: 'Ngân hàng', placeholder: 'vd: VietinBank – CN Hà Nội' },
        ],
      },
    ],
  },
];
/** Ghi chú — khung riêng, rộng hết trang, nằm cuối tab Thông tin nhân sự. */
const NOTE_FIELD: FieldDef = { key: 'note', label: 'Ghi chú', type: 'textarea', placeholder: 'Nhập ghi chú về nhân viên...' };
const ALL_FIELDS: FieldDef[] = [...HEAD_FIELDS, ...SECTIONS.flatMap((s) => s.fields || s.groups!.flatMap((g) => g.fields)), NOTE_FIELD];

const showValue = (f: FieldDef, v: Employee[FieldKey]) =>
  f.type === 'bool' ? (v ? 'Có' : 'Không') : f.type === 'date' ? dmy(String(v || '')) : v !== '' && v !== undefined && f.unit ? `${v} ${f.unit}` : String(v ?? '');

/** So sánh 2 bản hồ sơ → danh sách thay đổi (ghi lịch sử). Số nhạy cảm không ghi giá trị. */
const diff = (a: Employee, b: Employee) =>
  ALL_FIELDS.filter((f) => f.key !== 'surname' && f.key !== 'givenName' && a[f.key] !== b[f.key]).map((f) =>
    f.sensitive || f.type === 'textarea' ? `${f.label}: đã cập nhật` : `${f.label}: ${showValue(f, a[f.key]) || '—'} → ${showValue(f, b[f.key]) || '—'}`,
  );

const validate = (e: Employee, all: Employee[]): Record<string, string> => {
  const err: Record<string, string> = {};
  ALL_FIELDS.filter((f) => f.required && !String(e[f.key] ?? '').trim()).forEach((f) => (err[f.key] = 'Bắt buộc'));
  if (e.code && all.some((x) => x.id !== e.id && x.code.toLowerCase() === e.code.trim().toLowerCase())) err.code = 'Mã NV đã tồn tại';
  if (e.companyEmail && !/^\S+@\S+\.\S+$/.test(e.companyEmail)) err.companyEmail = 'Email không hợp lệ';
  if (e.personalEmail && !/^\S+@\S+\.\S+$/.test(e.personalEmail)) err.personalEmail = 'Email không hợp lệ';
  if (e.phone && !/^0\d{9}$/.test(e.phone.replace(/\s/g, ''))) err.phone = 'Gồm 10 số, bắt đầu bằng 0';
  if (e.idNo && !/^\d{12}$/.test(e.idNo)) err.idNo = 'CCCD gồm 12 số';
  if (e.taxCode && !/^\d{10}(\d{3})?$/.test(e.taxCode)) err.taxCode = 'MST gồm 10 hoặc 13 số';
  if (e.userName && all.some((x) => x.id !== e.id && x.userName === e.userName)) err.userName = 'UserName đã gán cho nhân viên khác';
  if (e.gradYear && !/^(19|20)\d{2}$/.test(e.gradYear)) err.gradYear = 'Năm dạng YYYY';
  if (e.experience && !(Number(e.experience) >= 0 && Number(e.experience) <= 50)) err.experience = 'Từ 0 đến 50 năm';
  if (e.dependents && !/^\d{1,2}$/.test(e.dependents)) err.dependents = 'Số nguyên từ 0 đến 20';
  else if (Number(e.dependents) > 20) err.dependents = 'Số nguyên từ 0 đến 20';
  if (e.officialDate && e.joinDate && e.officialDate < e.joinDate) err.officialDate = 'Trước ngày vào làm';
  if (e.status === 'Đã nghỉ việc' && !e.leaveDate) err.leaveDate = 'Nhập ngày nghỉ việc';
  if (e.leaveDate && e.joinDate && e.leaveDate < e.joinDate) err.leaveDate = 'Trước ngày vào làm';
  return err;
};

// ==========================================================================
// UI dùng chung (cùng bộ khung ERP với màn Dự án kinh doanh)
// ==========================================================================
const CRUMBS = ['Human Resources', 'Employees'];

export const StatusTag: React.FC<{ status: EmpStatus }> = ({ status }) => <Tag cls={STATUS_CLS[status]}>{status}</Tag>;
/** Ô checkbox: chế độ xem chỉ hiển thị (không bấm được), chế độ sửa bấm để chọn / bỏ chọn. */
export const CheckBox: React.FC<{ checked: boolean; onChange?: (v: boolean) => void; title?: string }> = ({ checked, onChange, title }) => (
  <label className={`relative inline-flex items-center ${onChange ? 'cursor-pointer' : 'cursor-default'}`} title={title}>
    <input type="checkbox" checked={checked} disabled={!onChange} onChange={(e) => onChange?.(e.target.checked)} className="peer sr-only" />
    <span
      className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#1f5fa8]/30 ${
        checked ? 'bg-[#1f5fa8] border-[#1f5fa8] text-white' : 'bg-white border-slate-400'
      } ${onChange && !checked ? 'hover:border-[#1f5fa8]' : ''}`}
    >
      {checked && <Check size={12} strokeWidth={3} />}
    </span>
  </label>
);

/**
 * Lưới thông tin 2 cột dạng bảng (nhãn | giá trị | nhãn | giá trị) — như "Thông tin chi tiết dự án":
 * các hàng hai bên thẳng hàng, nhãn nền xám một dòng.
 */
export type InfoItem = { label: React.ReactNode; value: React.ReactNode };
export const InfoGrid: React.FC<{ left: InfoItem[]; right: InfoItem[]; labelW?: [number, number] }> = ({ left, right, labelW = [150, 168] }) => {
  const n = Math.max(left.length, right.length);
  const lab = 'bg-[#f3f6fa] border-b border-r border-slate-200 px-3 py-2 flex items-center text-[13px] font-medium text-slate-600 whitespace-nowrap';
  const val = 'border-b border-slate-200 px-3 py-1.5 flex flex-col items-start justify-center min-h-[40px] text-[13px] text-slate-800 min-w-0 [&>input]:w-full [&>select]:w-full [&>textarea]:w-full';
  const show = (v: React.ReactNode) => (v === '' || v === null || v === undefined ? <span className="text-slate-400">—</span> : v);
  return (
    <div
      className="grid -mb-px [grid-template-columns:var(--c1)_minmax(0,1fr)] lg:[grid-template-columns:var(--c1)_minmax(0,1fr)_var(--c2)_minmax(0,1fr)]"
      style={{ ['--c1' as string]: `${labelW[0]}px`, ['--c2' as string]: `${labelW[1]}px` }}
    >
      {Array.from({ length: n }, (_, i) => (
        <React.Fragment key={i}>
          {[left[i], right[i]].map((it, j) =>
            it ? (
              <React.Fragment key={j}>
                <div className={`${lab} ${j === 1 ? 'lg:border-l' : ''}`}>
                  <span>{it.label}</span>
                </div>
                <div className={`${val} ${j === 0 ? 'lg:border-r lg:border-slate-200' : ''}`}>{show(it.value)}</div>
              </React.Fragment>
            ) : (
              <React.Fragment key={j}>
                <div className={`${lab} hidden lg:flex ${j === 1 ? 'lg:border-l' : ''}`} />
                <div className={`${val} hidden lg:flex`} />
              </React.Fragment>
            ),
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/** Ô ngày dạng dd/mm/yyyy (lưu YYYY-MM-DD). Gõ "26/03/2025", "26032025" hoặc bấm biểu tượng lịch. */
export const DateInput: React.FC<{ value: string; onChange: (iso: string) => void; className?: string; disabled?: boolean }> = ({ value, onChange, className = '', disabled }) => {
  const [text, setText] = useState<string | null>(null);
  const pick = useRef<HTMLInputElement>(null);
  const parse = (t: string): string | null => {
    if (!t.trim()) return '';
    const d = t.replace(/\D/g, '');
    const m = t.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/) || (d.length === 8 ? [t, d.slice(0, 2), d.slice(2, 4), d.slice(4)] : null);
    if (!m) return null;
    const [dd, mm, yy] = [+m[1], +m[2], +m[3]];
    const dt = new Date(yy, mm - 1, dd);
    return dt.getMonth() === mm - 1 && dt.getDate() === dd ? `${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}` : null;
  };
  const bad = text !== null && parse(text) === null;
  return (
    <div className="relative w-full">
      <input
        value={text ?? dmy(value)}
        disabled={disabled}
        placeholder="dd/mm/yyyy"
        onChange={(ev) => {
          setText(ev.target.value);
          const iso = parse(ev.target.value);
          if (iso !== null) onChange(iso);
        }}
        onBlur={() => setText(null)}
        className={`${erp.inputFull} pr-7 tabular-nums ${bad ? '!border-rose-400' : ''} ${className}`}
        title={bad ? 'Nhập đúng dạng dd/mm/yyyy' : 'dd/mm/yyyy — gõ hoặc bấm biểu tượng lịch'}
      />
      {!disabled && (
        <button type="button" tabIndex={-1} onClick={() => pick.current?.showPicker?.()} className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-[#1f5fa8] cursor-pointer">
          <Calendar size={14} />
        </button>
      )}
      <input ref={pick} type="date" value={value} onChange={(ev) => onChange(ev.target.value)} className="absolute right-0 bottom-0 w-0 h-0 opacity-0 pointer-events-none" tabIndex={-1} aria-hidden />
    </div>
  );
};

/** Giá trị 1 trường: chế độ xem hoặc ô nhập (sửa trực tiếp). */
const fieldNode = (
  f: FieldDef,
  emp: Employee,
  editing: boolean,
  role: Role,
  error: string | undefined,
  onChange: (k: FieldKey, v: string | boolean) => void,
  dyn: Partial<Record<FieldKey, string[]>> = {},
): React.ReactNode => {
  const v = emp[f.key];
  if (!editing) {
    if (f.type === 'bool') return <CheckBox checked={!!v} title={v ? 'Có' : 'Không'} />;
    if (!v) return '';
    if (f.sensitive && role === 'QL')
      return (
        <span className="flex items-center gap-1.5 text-slate-500 tracking-wider tabular-nums" title="Chỉ Nhân sự (HR) xem đầy đủ">
          {mask(String(v))} <Lock size={12} className="text-slate-400" />
        </span>
      );
    if (f.key === 'code') return <span className="font-mono font-bold text-[#1f5fa8] text-[16px]">{String(v)}</span>;
    if (f.key === 'fullName') return <span className="font-bold text-slate-900 uppercase text-[14px]">{String(v)}</span>;
    if (f.key === 'companyEmail' || f.key === 'personalEmail') return <span className="text-[#1f5fa8]">{String(v)}</span>;
    if (f.sensitive || f.key === 'phone') return <span className="tabular-nums">{String(v)}</span>;
    if (f.type === 'date') return <span className="tabular-nums">{dmy(String(v))}</span>;
    if (f.type === 'number') return <span className="tabular-nums">{showValue(f, v)}</span>;
    return String(v);
  }
  const err = error ? '!border-rose-400 focus:!ring-rose-200' : '';
  let input: React.ReactNode;
  if (f.type === 'bool')
    input = <CheckBox checked={!!v} onChange={(c) => onChange(f.key, c)} title={f.label} />;
  else if (f.readonly)
    input = (
      <input
        value={String(v ?? '')}
        readOnly
        tabIndex={-1}
        placeholder="Tự ghép từ Họ và tên đệm + Tên"
        title="Tự ghép từ Họ và tên đệm + Tên"
        className={`${erp.inputFull} !bg-slate-100 text-slate-600 cursor-not-allowed ${err}`}
      />
    );
  else if (f.type === 'select') {
    const opts = [...new Set([...(dyn[f.key] || f.options || []), ...(v ? [String(v)] : [])])];
    input = (
      <select value={String(v ?? '')} onChange={(e) => onChange(f.key, e.target.value)} className={`${erp.inputFull} ${!v ? 'text-slate-400' : ''} ${err}`}>
        <option value="" disabled={f.required}>
          — Chọn {f.label.toLowerCase()} —
        </option>
        {opts.map((o) => (
          <option key={o} value={o} className="text-slate-800">
            {o}
          </option>
        ))}
      </select>
    );
  } else if (f.type === 'number')
    input = (
      <span className="flex items-center gap-2 w-full">
        <input
          type="number"
          inputMode="numeric"
          min={f.min}
          max={f.max}
          value={String(v ?? '')}
          onChange={(e) => onChange(f.key, e.target.value)}
          placeholder={f.placeholder}
          className={`${erp.inputFull} tabular-nums ${err}`}
        />
        {f.unit && <span className="shrink-0 text-[12px] text-slate-500">{f.unit}</span>}
      </span>
    );
  else if (f.type === 'date') input = <DateInput value={String(v ?? '')} onChange={(iso) => onChange(f.key, iso)} className={err} />;
  else if (f.type === 'textarea')
    input = <textarea value={String(v ?? '')} onChange={(e) => onChange(f.key, e.target.value)} rows={2} className={`${erp.inputFull} h-auto py-1 resize-y ${err}`} placeholder={f.placeholder} />;
  else
    input = (
      <input
        value={String(v ?? '')}
        onChange={(e) => onChange(f.key, f.key === 'surname' || f.key === 'givenName' ? e.target.value.toUpperCase() : e.target.value)}
        placeholder={f.placeholder}
        className={`${erp.inputFull} ${f.key === 'code' ? 'font-mono' : ''} ${err}`}
      />
    );
  return (
    <>
      {input}
      {error && <span className="block text-[11px] text-rose-600 mt-0.5">{error}</span>}
    </>
  );
};
const label = (f: FieldDef, editing: boolean) => (
  <>
    {f.label}
    {editing && f.required && <span className="text-rose-600 ml-0.5">*</span>}
  </>
);

// ==========================================================================
// Trang
// ==========================================================================
export const EmployeePage: React.FC = () => {
  const list = useEmployees();
  const setList = setEmployees;
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [role, setRole] = useState<Role>('HR');
  const [toast, setToast] = useState('');
  const flash = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(''), 2600);
  };
  const log = (e: Employee, action: string, changes?: string[]): Employee => {
    const at = nowIso();
    const by = ROLE_USER[role];
    return { ...e, history: [...e.history, { at, by, action, changes }], updatedAt: at, updatedBy: by };
  };
  const emp = list.find((x) => x.id === openId);
  const blank = (): Employee => ({
    ...mk('', '', '', DIVISIONS[0], DEPARTMENTS[0], POSITIONS[0], LEVELS[2], today(), 'Thử việc'),
    id: `new-${uid()}`,
    companyEmail: '',
    contracts: [],
    history: [],
    birthDate: '',
    staffing: false,
  });

  return (
    <ErpPage>
      {toast && <div className="fixed top-4 right-4 z-50 rounded-[4px] bg-[#1e3a5f] text-white text-[12.5px] px-4 py-2 shadow-lg">{toast}</div>}
      {creating ? (
        <EmployeeDetail
          key="new"
          initial={blank()}
          isNew
          role="HR"
          setRole={() => undefined}
          all={list}
          onBack={() => setCreating(false)}
          onSave={(e) => {
            const saved = log({ ...e, id: e.code }, 'Tạo hồ sơ nhân viên');
            setList((l) => [saved, ...l]);
            setCreating(false);
            setOpenId(saved.id);
            flash(`Đã tạo hồ sơ ${saved.code} — ${saved.fullName}`);
          }}
          onChange={() => undefined}
          onDelete={() => undefined}
          flash={flash}
        />
      ) : emp ? (
        <EmployeeDetail
          key={emp.id}
          initial={emp}
          role={role}
          setRole={setRole}
          all={list}
          onBack={() => setOpenId(null)}
          onSave={(e, changes) => {
            setList((l) => l.map((x) => (x.id === e.id ? log(e, 'Sửa hồ sơ', changes) : x)));
            flash(changes.length ? `Đã lưu ${changes.length} thay đổi` : 'Không có thay đổi');
          }}
          onChange={(e, action, changes) => {
            setList((l) => l.map((x) => (x.id === e.id ? log(e, action, changes) : x)));
            flash(action);
          }}
          onDelete={() => {
            setList((l) => l.filter((x) => x.id !== emp.id));
            setOpenId(null);
            flash(`Đã xoá hồ sơ ${emp.code} — ${emp.fullName}`);
          }}
          flash={flash}
        />
      ) : (
        <EmployeeList
          list={list}
          role={role}
          setRole={setRole}
          onOpen={setOpenId}
          onCreate={() => setCreating(true)}
          onImport={(added, updated, fileName) => {
            const up = new Map<string, { emp: Employee; changes: string[] }>(updated.map((u) => [u.emp.id, u]));
            setList((l) => [
              ...added.map((e) => log(e, 'Tạo hồ sơ nhân viên (import)', [fileName])),
              ...l.map((x) => {
                const u = up.get(x.id);
                return u ? log(u.emp, 'Cập nhật từ file import', [fileName, ...u.changes]) : x;
              }),
            ]);
            flash(`Đã import ${fileName}: thêm mới ${added.length}, cập nhật ${updated.length} nhân viên`);
          }}
        />
      )}
    </ErpPage>
  );
};

/** Hợp đồng đang áp dụng (mới nhất đã có hiệu lực). */
export const currentContract = (e: Employee) => [...e.contracts].filter((c) => c.from <= today()).sort((a, b) => b.from.localeCompare(a.from))[0];

// ==========================================================================
// Danh sách
// ==========================================================================
const LIST_HEAD = ['TT', 'Mã NV', 'Họ và tên', 'UserName', 'Email công ty', 'Khối', 'Phòng ban', 'Vị trí', 'Level', 'Quản lý trực tiếp', 'Ngày vào làm', 'Loại hợp đồng', 'Trạng thái'];

const EmployeeList: React.FC<{
  list: Employee[];
  role: Role;
  setRole: (r: Role) => void;
  onOpen: (id: string) => void;
  onCreate: () => void;
  onImport: (added: Employee[], updated: { emp: Employee; changes: string[] }[], fileName: string) => void;
}> = ({ list, role, setRole, onOpen, onCreate, onImport }) => {
  const [showImport, setShowImport] = useState(false);
  const [q, setQ] = useState('');
  const [div, setDiv] = useState('');
  const [st, setSt] = useState<EmpStatus | ''>('');
  // Lọc Khối + tìm kiếm (dùng cho cả bảng và số đếm trên ô số liệu); trạng thái lọc sau cùng.
  const base = useMemo(() => {
    const n = q.trim().toLowerCase();
    return list
      .filter((e) => !div || e.division === div)
      .filter((e) => !n || [e.code, e.fullName, e.userName, e.companyEmail, e.position, e.department, e.manager].some((v) => v.toLowerCase().includes(n)))
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [list, q, div]);
  const rows = base.filter((e) => !st || e.status === st);
  const count = (s: EmpStatus) => base.filter((e) => e.status === s).length;

  const th = `${erp.th} text-center whitespace-normal leading-tight align-middle`;
  const kpi: { label: string; value: number; tone: 'good' | 'bad' | 'neutral'; s: EmpStatus | ''; sub: string }[] = [
    { label: 'Tổng nhân sự', value: base.length, tone: 'neutral', s: '', sub: div ? `Khối ${div}` : 'Toàn công ty' },
    { label: 'Đang làm việc', value: count('Đang làm việc'), tone: 'good', s: 'Đang làm việc', sub: `${base.length ? Math.round((count('Đang làm việc') / base.length) * 100) : 0}% tổng nhân sự` },
    { label: 'Thử việc', value: count('Thử việc'), tone: 'neutral', s: 'Thử việc', sub: 'Chờ ký HĐ chính thức' },
    { label: 'Nghỉ thai sản', value: count('Nghỉ thai sản'), tone: 'neutral', s: 'Nghỉ thai sản', sub: 'Tạm nghỉ, giữ hồ sơ' },
  ];

  return (
    <>
      <ErpTitleBar
        crumbs={CRUMBS}
        title="Danh sách nhân sự"
        actions={
          <>
            {role === 'HR' && (
              <>
                <Btn icon={Upload} onClick={() => setShowImport((v) => !v)} className={showImport ? '!bg-[#eef4fb] !border-[#1f5fa8] !text-[#1f5fa8]' : ''}>
                  Import nhân viên
                </Btn>
                <Btn variant="primary" icon={UserPlus} onClick={onCreate}>
                  Thêm nhân viên
                </Btn>
              </>
            )}
          </>
        }
      />

      {showImport && role === 'HR' && (
        <ImportPanel
          list={list}
          onClose={() => setShowImport(false)}
          onImport={(added, updated, fileName) => {
            onImport(added, updated, fileName);
            setShowImport(false);
          }}
        />
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {kpi.map((k) => (
          <KpiBox
            key={k.label}
            label={k.label}
            value={k.value}
            valueText={String(k.value)}
            tone={k.tone}
            sub={k.sub}
            onClick={() => setSt(k.s && st === k.s ? '' : k.s)}
            active={!!k.s && st === k.s}
          />
        ))}
      </div>

      <Panel
        title="Danh sách nhân sự"
        icon={Table2}
        noPad
        actions={
          <>
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Khối
              <select value={div} onChange={(e) => setDiv(e.target.value)} className={`${erp.input} h-7 w-28`}>
                <option value="">Tất cả</option>
                {DIVISIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <div className="relative w-64">
              <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã NV, họ tên, email, vị trí, quản lý..." className={`${erp.inputFull} h-7 pl-7`} />
            </div>
            <select value={st} onChange={(e) => setSt(e.target.value as EmpStatus | '')} className={`${erp.input} h-7 w-44`}>
              <option value="">Tất cả trạng thái</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s} ({count(s)})
                </option>
              ))}
            </select>
            {role !== 'NV' && <ExportMenu rows={rows} all={list} role={role} />}
          </>
        }
        footer={`${rows.length} / ${list.length} nhân viên · Bấm vào dòng để xem hồ sơ`}
      >
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1500px]`}>
            <thead>
              <tr>
                {LIST_HEAD.map((h) => (
                  <th key={h} className={`${th} border-t-0 first:border-l-0 last:border-r-0 ${h === 'Họ và tên' ? 'min-w-[190px]' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((e, i) => {
                const c = currentContract(e);
                return (
                  <tr key={e.id} onClick={() => onOpen(e.id)} className={`${erp.tr} cursor-pointer`}>
                    <td className={`${erp.td} text-center text-slate-500 border-l-0`}>{i + 1}</td>
                    <td className={`${erp.td} ${erp.code} font-semibold whitespace-nowrap`}>{e.code}</td>
                    <td className={`${erp.td} font-semibold text-slate-800 whitespace-nowrap`}>{e.fullName}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{e.userName}</td>
                    <td className={`${erp.td} whitespace-nowrap text-[#1f5fa8]`}>{e.companyEmail}</td>
                    <td className={`${erp.td} text-center`}>{e.division}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{e.department}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{e.position}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{e.level}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{e.manager || '—'}</td>
                    <td className={`${erp.td} text-center whitespace-nowrap`}>{dmy(e.joinDate)}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{c ? c.type : <span className="text-slate-400">Chưa có</span>}</td>
                    <td className={`${erp.td} whitespace-nowrap border-r-0`}>
                      <StatusTag status={e.status} />
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={LIST_HEAD.length} className="px-3 py-10 text-center text-[12.5px] text-slate-400">
                    Không có nhân viên phù hợp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
};

// ==========================================================================
// Cột dữ liệu dùng chung cho Xuất Excel (chọn cột) và Import nhân viên
// ==========================================================================
/** Tên cột của hệ thống gốc (tiếng Anh) — file import dùng tiêu đề tiếng Việt hoặc tiếng Anh đều được. */
const EN_LABEL: Partial<Record<FieldKey, string>> = {
  code: 'Employee Code', userName: 'Username', givenName: 'Name', surname: 'Surname', fullName: 'FullName', gender: 'Gender',
  phone: 'Phone Number', maritalStatus: 'MaritalStatus', birthDate: 'Date of Birth', personalEmail: 'Personal Email', company: 'Company',
  companyEmail: 'Company Email', division: 'Division', department: 'Department', position: 'Position', level: 'Level', manager: 'Manager',
  techStack: 'Tech Stack', status: 'Employee Status', leaveDate: 'Resignation Date', joinDate: 'Start Date', officialDate: 'Official Start Date',
  autoAttendance: 'Auto Attendance', staffing: 'Staffing', vehicle: 'Vehicle Info', note: 'Notes', idNo: 'Identification Number',
  idDate: 'Issue Date', idPlace: 'Place Of Issue', taxCode: 'Tax Code', permanentAddress: 'Permanent Address', currentAddress: 'Current Address', dependents: 'Number of Dependents',
  socialInsNo: 'Social Insurance Number', education: 'Education Level', school: 'University', major: 'Major', gradYear: 'Year of Graduation',
  experience: 'Work Experience', bankAccount: 'BankAccount', bankName: 'BankName',
};
export const norm = (s: unknown) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

interface ColDef {
  id: string;
  label: string;
  group: string;
  get: (e: Employee, role: Role, i: number) => string | number;
  field?: FieldDef;
  sensitive?: boolean;
}
const fieldCol = (f: FieldDef, group: string): ColDef => ({
  id: f.key,
  label: f.label,
  group,
  field: f,
  sensitive: f.sensitive,
  get: (e, role) => {
    const v = e[f.key];
    if (f.sensitive && role === 'QL') return mask(String(v || ''));
    if (f.type === 'number') return v === '' || v === undefined ? '' : Number(v);
    if (f.type === 'bool') return v ? 'Có' : 'Không';
    if (f.type === 'date') return dmy(String(v || ''));
    return String(v ?? '');
  },
});
/** Thứ tự cột: theo các khung trên hồ sơ. */
const COLS: ColDef[] = [
  { id: 'tt', label: 'TT', group: 'Chung', get: (_e, _r, i) => i + 1 },
  ...HEAD_FIELDS.map((f) => fieldCol(f, 'Nhân viên')),
  ...SECTIONS.flatMap((s) => (s.fields || s.groups!.flatMap((g) => g.fields)).map((f) => fieldCol(f, s.title))),
  fieldCol(NOTE_FIELD, 'Ghi chú'),
  { id: 'cType', label: 'Loại hợp đồng', group: 'Hợp đồng', get: (e) => currentContract(e)?.type || '' },
];
const COL_GROUPS = [...new Set(COLS.map((c) => c.group))];
const DEFAULT_COLS = ['tt', 'code', 'fullName', 'userName', 'companyEmail', 'division', 'department', 'position', 'level', 'manager', 'joinDate', 'cType', 'status'];
const EXPORT_KEY = 'employee-export-cols';
const loadCols = (): string[] => {
  try {
    const v = JSON.parse(localStorage.getItem(EXPORT_KEY) || 'null');
    if (Array.isArray(v) && v.length) return v.filter((x) => COLS.some((c) => c.id === x));
  } catch {
    /* trình duyệt chặn lưu trữ → dùng mặc định */
  }
  return DEFAULT_COLS;
};

// ==========================================================================
// Xuất Excel — chọn cột dữ liệu cần xuất
// ==========================================================================
const ExportMenu: React.FC<{ rows: Employee[]; all: Employee[]; role: Role }> = ({ rows, all, role }) => {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<string[]>(loadCols);
  const [scope, setScope] = useState<'filtered' | 'all'>('filtered');
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (r) setPos({ top: r.bottom + 4, right: Math.max(8, window.innerWidth - r.right) });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    const close = (ev: MouseEvent) => !ref.current?.contains(ev.target as Node) && setOpen(false);
    const esc = (ev: KeyboardEvent) => ev.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);
  const save = (ids: string[]) => {
    setSel(ids);
    try {
      localStorage.setItem(EXPORT_KEY, JSON.stringify(ids));
    } catch {
      /* bỏ qua */
    }
  };
  const toggle = (id: string) => save(sel.includes(id) ? sel.filter((x) => x !== id) : COLS.filter((c) => sel.includes(c.id) || c.id === id).map((c) => c.id));
  const toggleGroup = (g: string) => {
    const ids = COLS.filter((c) => c.group === g).map((c) => c.id);
    const allOn = ids.every((id) => sel.includes(id));
    save(COLS.filter((c) => (allOn ? sel.includes(c.id) && !ids.includes(c.id) : sel.includes(c.id) || ids.includes(c.id))).map((c) => c.id));
  };
  const doExport = () => {
    const cols = COLS.filter((c) => sel.includes(c.id));
    const data = scope === 'all' ? [...all].sort((a, b) => a.code.localeCompare(b.code)) : rows;
    const aoa = [cols.map((c) => c.label), ...data.map((e, i) => cols.map((c) => c.get(e, role, i)))];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = cols.map((c) => ({ wch: Math.min(48, Math.max(6, c.label.length + 2, ...data.slice(0, 50).map((e, i) => String(c.get(e, role, i)).length + 1))) }));
    ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: data.length, c: cols.length - 1 } }) };
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'NhanSu');
    XLSX.writeFile(wb, `danh-sach-nhan-su_${today().replace(/-/g, '')}.xlsx`);
    setOpen(false);
  };
  const box = (on: boolean, partial = false) => (
    <span className={`w-3.5 h-3.5 shrink-0 rounded-[3px] border flex items-center justify-center ${on || partial ? 'bg-[#1f5fa8] border-[#1f5fa8] text-white' : 'bg-white border-slate-400'}`}>
      {on ? <Check size={10} strokeWidth={3.5} /> : partial ? <span className="w-1.5 h-[2px] bg-white rounded" /> : null}
    </span>
  );
  return (
    <div ref={ref}>
      <div ref={btnRef}>
      <Btn icon={FileSpreadsheet} onClick={() => setOpen((o) => !o)} className={`h-7 ${open ? '!bg-[#eef4fb] !border-[#1f5fa8]' : ''}`}>
        Xuất Excel <ChevronDown size={13} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </Btn>
      </div>
      {open && pos && (
        <div
          style={{ top: pos.top, right: pos.right, maxHeight: `calc(100vh - ${pos.top + 12}px)` }}
          className="fixed z-50 w-[620px] max-w-[calc(100vw-1rem)] flex flex-col bg-white border border-slate-300 rounded-[4px] shadow-xl text-[12.5px]"
        >
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-gradient-to-b from-[#f7f9fc] to-[#edf1f6] border-b border-slate-300">
            <span className="text-[12px] font-bold uppercase tracking-wide text-[#1e3a5f] flex items-center gap-1.5">
              <span className="w-[3px] h-3.5 bg-[#1f5fa8] rounded-sm" />
              Chọn cột dữ liệu cần xuất
            </span>
            <span className="flex items-center gap-2 text-[12px]">
              <button type="button" className="text-[#1f5fa8] hover:underline cursor-pointer" onClick={() => save(COLS.map((c) => c.id))}>
                Chọn tất cả
              </button>
              <span className="text-slate-300">|</span>
              <button type="button" className="text-[#1f5fa8] hover:underline cursor-pointer" onClick={() => save(DEFAULT_COLS)}>
                Mặc định
              </button>
              <span className="text-slate-300">|</span>
              <button type="button" className="text-slate-500 hover:underline cursor-pointer" onClick={() => save([])}>
                Bỏ chọn
              </button>
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto grid grid-cols-2 gap-x-4 gap-y-2.5 px-3 py-2.5">
            {COL_GROUPS.map((g) => {
              const cols = COLS.filter((c) => c.group === g);
              const n = cols.filter((c) => sel.includes(c.id)).length;
              return (
                <div key={g} className="min-w-0">
                  <button type="button" onClick={() => toggleGroup(g)} className="w-full flex items-center gap-1.5 pb-1 mb-1 border-b border-slate-200 text-left cursor-pointer">
                    {box(n === cols.length, n > 0 && n < cols.length)}
                    <span className="text-[11px] font-bold uppercase tracking-wide text-slate-600 flex-1">{g}</span>
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      {n}/{cols.length}
                    </span>
                  </button>
                  {cols.map((c) => (
                    <button key={c.id} type="button" onClick={() => toggle(c.id)} className="w-full flex items-center gap-1.5 py-[3px] pl-1 rounded-[3px] hover:bg-[#eef4fb] text-left cursor-pointer">
                      {box(sel.includes(c.id))}
                      <span className="text-slate-700 truncate">{c.label}</span>
                      {c.sensitive && role === 'QL' && (
                        <span className="ml-auto pr-1 text-slate-400" title="Xuất dạng che số — chỉ HR xuất đầy đủ">
                          <Lock size={11} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3 px-3 py-2 border-t border-slate-200 bg-slate-50">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" checked={scope === 'filtered'} onChange={() => setScope('filtered')} className="accent-[#1f5fa8]" />
              Danh sách đang lọc ({rows.length})
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" checked={scope === 'all'} onChange={() => setScope('all')} className="accent-[#1f5fa8]" />
              Tất cả nhân viên ({all.length})
            </label>
            <span className="ml-auto flex items-center gap-1.5">
              <Btn className="h-7" onClick={() => setOpen(false)}>
                Đóng
              </Btn>
              <Btn variant="primary" icon={Download} className="h-7" disabled={!sel.length} onClick={doExport}>
                Xuất {sel.length} cột
              </Btn>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================================================
// Import nhân viên — khung import ngay trên màn danh sách (không popup)
// ==========================================================================
/** Cột nhập được từ file (bỏ cột tính tự động / dẫn xuất). */
const IMPORT_FIELDS: FieldDef[] = ALL_FIELDS;
const IMPORT_REQUIRED: FieldKey[] = ['code', 'userName', 'surname', 'givenName'];

type ImportRow = {
  line: number;
  emp: Employee;
  mode: 'new' | 'update' | 'skip' | 'error';
  errors: string[];
  warns: string[];
  changes: string[];
};

export const parseDateCell = (v: unknown): string | null => {
  if (v === '' || v === null || v === undefined) return '';
  if (v instanceof Date && !isNaN(v.getTime())) return `${v.getFullYear()}-${String(v.getMonth() + 1).padStart(2, '0')}-${String(v.getDate()).padStart(2, '0')}`;
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    return d ? `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}` : null;
  }
  const t = String(v).trim();
  let m = t.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (m) {
    const [dd, mm, yy] = [+m[1], +m[2], +m[3]];
    const dt = new Date(yy, mm - 1, dd);
    return dt.getMonth() === mm - 1 && dt.getDate() === dd ? `${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}` : null;
  }
  m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
};
const parseBool = (v: unknown): boolean | null => {
  const n = norm(v);
  if (!n) return null;
  if (['co', 'x', '1', 'true', 'yes', 'y', 'bat', 'on'].includes(n)) return true;
  if (['khong', '0', 'false', 'no', 'n', 'tat', 'off'].includes(n)) return false;
  return null;
};

/** Đọc file → danh sách dòng kèm kết quả kiểm tra. */
const parseImport = (wb: XLSX.WorkBook, list: Employee[], updateExisting: boolean): { rows: ImportRow[]; cols: FieldDef[]; error?: string } => {
  const sheet = wb.Sheets[wb.SheetNames.find((n) => norm(n).includes('nhan') || norm(n).includes('employee')) || wb.SheetNames[0]];
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: true, defval: '' });
  const lookup = new Map<string, FieldDef>();
  IMPORT_FIELDS.forEach((f) => {
    lookup.set(norm(f.label), f);
    if (EN_LABEL[f.key]) lookup.set(norm(EN_LABEL[f.key]), f);
  });
  lookup.set(norm('Họ'), HEAD_FIELDS.find((f) => f.key === 'surname')!);
  // Dòng tiêu đề: dòng đầu tiên (trong 10 dòng) có ≥ 3 cột nhận ra được
  const hi = aoa.slice(0, 10).findIndex((r) => r.filter((c) => lookup.has(norm(c))).length >= 3);
  if (hi < 0) return { rows: [], cols: [], error: 'Không tìm thấy dòng tiêu đề cột. Hãy dùng file mẫu (cột Mã NV, UserName, Họ và tên đệm, Tên…).' };
  const head = aoa[hi].map((c) => lookup.get(norm(c)) || null);
  const cols = head.filter((f): f is FieldDef => !!f);
  const missing = IMPORT_REQUIRED.filter((k) => !cols.some((f) => f.key === k) && !(k !== 'code' && k !== 'userName' && cols.some((f) => f.key === 'fullName')));
  if (missing.length) return { rows: [], cols, error: `File thiếu cột bắt buộc: ${missing.map((k) => ALL_FIELDS.find((f) => f.key === k)!.label).join(', ')}.` };

  const byCode = new Map(list.map((e) => [e.code.toLowerCase(), e]));
  const seen = new Map<string, number>();
  const accounts = new Set([...list.map((x) => x.userName), ...FREE_ACCOUNTS]);
  const managers = new Set([...EXTRA_MANAGERS, ...list.map((x) => x.fullName)]);
  const rows: ImportRow[] = [];
  aoa.slice(hi + 1).forEach((r, idx) => {
    if (r.every((c) => String(c ?? '').trim() === '')) return;
    const line = hi + 2 + idx;
    const errors: string[] = [];
    const warns: string[] = [];
    const vals: Partial<Record<FieldKey, string | boolean>> = {};
    head.forEach((f, j) => {
      if (!f || f.readonly) return;
      const raw = r[j];
      if (raw === '' || raw === null || raw === undefined || String(raw).trim() === '') return; // ô trống → giữ nguyên
      if (f.type === 'date') {
        const d = parseDateCell(raw);
        if (d === null) errors.push(`${f.label}: "${raw}" không phải ngày (dd/mm/yyyy)`);
        else vals[f.key] = d;
      } else if (f.type === 'bool') {
        const b = parseBool(raw);
        if (b === null) errors.push(`${f.label}: "${raw}" — ghi Có / Không`);
        else vals[f.key] = b;
      } else if (f.type === 'number') {
        const n = Number(String(raw).replace(',', '.'));
        if (isNaN(n)) errors.push(`${f.label}: "${raw}" không phải số`);
        else vals[f.key] = String(n);
      } else if (f.type === 'select' && f.options) {
        const hit = f.options.find((o) => norm(o) === norm(raw));
        if (!hit) errors.push(`${f.label}: "${raw}" không có trong danh mục`);
        else vals[f.key] = hit;
      } else {
        let s = String(raw).trim();
        if (f.key === 'surname' || f.key === 'givenName' || f.key === 'manager') s = s.toUpperCase();
        if (f.key === 'userName') s = s.toLowerCase();
        vals[f.key] = s;
      }
    });
    // Chỉ có cột "Họ và tên" → tự tách Họ và tên đệm / Tên
    const fnIdx = head.findIndex((f) => f?.key === 'fullName');
    if (fnIdx >= 0 && !vals.surname && !vals.givenName && String(r[fnIdx] ?? '').trim()) {
      const w = String(r[fnIdx]).trim().toUpperCase().split(/\s+/);
      vals.surname = w.slice(0, -1).join(' ');
      vals.givenName = w[w.length - 1];
    }
    const code = String(vals.code || '').trim();
    const existing = code ? byCode.get(code.toLowerCase()) : undefined;
    const base: Employee = existing
      ? { ...existing }
      : { ...mk(code, '', '', DIVISIONS[0], DEPARTMENTS[0], POSITIONS[0], LEVELS[2], today(), 'Thử việc'), contracts: [], history: [], companyEmail: '', birthDate: '', staffing: false };
    const emp: Employee = { ...base, ...vals } as Employee;
    emp.fullName = `${emp.surname} ${emp.givenName}`.replace(/\s+/g, ' ').trim();
    if (!existing && vals.userName && !vals.companyEmail) emp.companyEmail = `${vals.userName}@aequitas.com.vn`;
    emp.id = existing ? existing.id : emp.code;

    if (!code) errors.push('Thiếu Mã NV');
    if (code) {
      if (seen.has(code.toLowerCase())) errors.push(`Trùng Mã NV với dòng ${seen.get(code.toLowerCase())}`);
      else seen.set(code.toLowerCase(), line);
    }
    const others = list.filter((x) => x.id !== emp.id);
    Object.entries(validate(emp, others)).forEach(([k, msg]) => {
      if (!msg || k === 'code' || k === 'fullName') return; // Mã NV kiểm tra riêng; Họ và tên tự ghép
      const lb = ALL_FIELDS.find((f) => f.key === k)?.label || k;
      errors.push(msg === 'Bắt buộc' ? `Thiếu ${lb}` : `${lb}: ${msg}`);
    });
    if (rows.some((x) => x.mode !== 'error' && x.emp.userName && x.emp.userName === emp.userName)) errors.push('UserName trùng với dòng khác trong file');
    if (emp.userName && !accounts.has(emp.userName)) warns.push(`UserName "${emp.userName}" chưa có trong danh sách tài khoản — sẽ cần tạo tài khoản`);
    if (vals.manager && !managers.has(String(vals.manager))) warns.push(`Quản lý "${vals.manager}" chưa có trong danh sách nhân sự`);

    const changes = existing ? diff(existing, emp) : [];
    const mode: ImportRow['mode'] = errors.length ? 'error' : existing ? (updateExisting ? 'update' : 'skip') : 'new';
    rows.push({ line, emp, mode, errors, warns, changes });
  });
  return { rows, cols };
};

const downloadTemplate = () => {
  const cols = IMPORT_FIELDS.filter((f) => !f.readonly);
  const sample: Record<string, string | number> = {
    code: 'V00630', userName: 'tuanna', surname: 'NGUYỄN ANH', givenName: 'TUẤN', companyEmail: 'tuanna@aequitas.com.vn', division: 'G1',
    department: 'Sản xuất', position: 'Developer', level: 'Junior', company: 'AEQUITAS', manager: 'TRẦN THỊ MAI ANH', joinDate: '03/11/2026',
    officialDate: '', status: 'Thử việc', leaveDate: '', techStack: 'Java, React', autoAttendance: 'Có', staffing: 'Không', gender: 'Nam',
    phone: '0912000630', birthDate: '15/08/2000', personalEmail: 'tuan.nguyen@example.com', maritalStatus: 'Độc thân', currentAddress: 'Cầu Giấy, Hà Nội',
    vehicle: '', permanentAddress: 'Nam Định', dependents: 0, education: 'Kỹ sư', gradYear: 2022, school: 'Đại học Bách khoa Hà Nội', experience: 2,
    major: 'Công nghệ thông tin', idNo: '036200000630', idDate: '10/05/2021', idPlace: 'Cục CS QLHC về TTXH', taxCode: '8000000630',
    socialInsNo: '', bankAccount: '1900000630', bankName: 'Techcombank', note: '',
  };
  const ws = XLSX.utils.aoa_to_sheet([cols.map((f) => (IMPORT_REQUIRED.includes(f.key) ? `${f.label} *` : f.label)), cols.map((f) => sample[f.key] ?? '')]);
  ws['!cols'] = cols.map((f) => ({ wch: Math.max(12, f.label.length + 4) }));
  const lists = cols.filter((f) => f.type === 'select' && f.options);
  const n = Math.max(...lists.map((f) => f.options!.length));
  const dm = XLSX.utils.aoa_to_sheet([lists.map((f) => f.label), ...Array.from({ length: n }, (_, i) => lists.map((f) => f.options![i] || ''))]);
  dm['!cols'] = lists.map(() => ({ wch: 24 }));
  const guide = XLSX.utils.aoa_to_sheet([
    ['HƯỚNG DẪN IMPORT NHÂN VIÊN'],
    [],
    ['1. Mỗi dòng ở sheet NhanVien là 1 nhân viên. Cột có dấu * là bắt buộc khi thêm mới: Mã NV, UserName, Họ và tên đệm, Tên.'],
    ['2. Họ và tên được hệ thống tự ghép = Họ và tên đệm + Tên. File chỉ có cột "Họ và tên" thì hệ thống tự tách (từ cuối là Tên).'],
    ['3. Mã NV đã có trên hệ thống → cập nhật hồ sơ đó (khi chọn "Cập nhật nhân viên đã có"); ô để trống thì giữ nguyên dữ liệu cũ.'],
    ['4. Ngày ghi dạng dd/mm/yyyy. Chấm công tự động / Staffing ghi Có hoặc Không. Năm tốt nghiệp, Kinh nghiệm làm việc (năm) ghi số.'],
    ['5. Các cột chọn (Khối, Phòng ban, Vị trí, Level, Trạng thái, Giới tính…) ghi đúng giá trị trong sheet DanhMuc.'],
    ['6. Tiêu đề cột dùng tiếng Việt như file mẫu hoặc tiếng Anh như hệ thống cũ (Employee Code, Username, Name, Surname…) đều được.'],
    ['7. File xuất từ nút "Xuất Excel" (chọn cột) cũng import lại được.'],
  ]);
  guide['!cols'] = [{ wch: 120 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'NhanVien');
  XLSX.utils.book_append_sheet(wb, dm, 'DanhMuc');
  XLSX.utils.book_append_sheet(wb, guide, 'HuongDan');
  XLSX.writeFile(wb, 'Mau_import_nhan_vien.xlsx');
};

const MODE_TAG: Record<ImportRow['mode'], [string, string]> = {
  new: ['Thêm mới', 'bg-emerald-50 text-emerald-700 border-emerald-300'],
  update: ['Cập nhật', 'bg-sky-50 text-sky-700 border-sky-300'],
  skip: ['Bỏ qua — Mã NV đã có', 'bg-slate-100 text-slate-500 border-slate-300'],
  error: ['Lỗi', 'bg-rose-50 text-rose-700 border-rose-300'],
};

const ImportPanel: React.FC<{
  list: Employee[];
  onClose: () => void;
  onImport: (added: Employee[], updated: { emp: Employee; changes: string[] }[], fileName: string) => void;
}> = ({ list, onClose, onImport }) => {
  const [file, setFile] = useState<{ name: string; wb: XLSX.WorkBook } | null>(null);
  const [updateExisting, setUpdateExisting] = useState(true);
  const [filter, setFilter] = useState<ImportRow['mode'] | ''>('');
  const [readErr, setReadErr] = useState('');
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const result = useMemo(() => (file ? parseImport(file.wb, list, updateExisting) : null), [file, list, updateExisting]);
  const count = (m: ImportRow['mode']) => result?.rows.filter((r) => r.mode === m).length || 0;
  const ok = count('new') + count('update');
  const read = (f: File) => {
    setReadErr('');
    if (!/\.(xlsx|xls|csv)$/i.test(f.name)) return setReadErr('Chỉ nhận file Excel (.xlsx, .xls) hoặc .csv');
    const r = new FileReader();
    r.onload = () => {
      try {
        setFile({ name: f.name, wb: XLSX.read(r.result, { type: 'array', cellDates: true }) });
        setFilter('');
      } catch {
        setReadErr('Không đọc được file — kiểm tra lại định dạng.');
      }
    };
    r.readAsArrayBuffer(f);
  };
  const shown = (result?.rows || []).filter((r) => !filter || r.mode === filter);
  return (
    <Panel
      title="Import nhân viên"
      icon={Upload}
      noPad
      actions={
        <>
          <Btn icon={Download} className="h-7" onClick={downloadTemplate}>
            Tải file mẫu
          </Btn>
          <Btn icon={X} className="h-7" onClick={onClose}>
            Đóng
          </Btn>
        </>
      }
      footer="File mẫu gồm 3 sheet: NhanVien (nhập dữ liệu) · DanhMuc (giá trị hợp lệ của các cột chọn) · HuongDan. Cột có dấu * là bắt buộc khi thêm mới."
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(ev) => {
          const f = ev.target.files?.[0];
          ev.target.value = '';
          if (f) read(f);
        }}
      />
      {/* Bước 1: chọn file */}
      <div className="flex flex-wrap items-stretch gap-3 p-3 border-b border-slate-200">
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(ev) => (ev.preventDefault(), setDrag(true))}
          onDragLeave={() => setDrag(false)}
          onDrop={(ev) => {
            ev.preventDefault();
            setDrag(false);
            const f = ev.dataTransfer.files?.[0];
            if (f) read(f);
          }}
          className={`flex-1 min-w-[320px] flex items-center gap-3 px-4 py-3 rounded-[4px] border-2 border-dashed cursor-pointer transition-colors ${
            drag ? 'border-[#1f5fa8] bg-[#eef4fb]' : 'border-slate-300 bg-slate-50 hover:border-[#1f5fa8] hover:bg-[#f5f9fd]'
          }`}
        >
          <span className="w-9 h-9 shrink-0 rounded-full bg-white border border-slate-300 flex items-center justify-center text-[#1f5fa8]">
            <FileSpreadsheet size={17} />
          </span>
          <span className="min-w-0">
            {file ? (
              <>
                <span className="block font-semibold text-slate-800 truncate">{file.name}</span>
                <span className="block text-[11.5px] text-slate-500">Bấm hoặc kéo file khác vào đây để chọn lại</span>
              </>
            ) : (
              <>
                <span className="block font-semibold text-slate-800">Chọn file Excel danh sách nhân viên</span>
                <span className="block text-[11.5px] text-slate-500">Bấm để chọn hoặc kéo thả file .xlsx / .xls / .csv vào đây</span>
              </>
            )}
          </span>
        </div>
        <div className="flex flex-col justify-center gap-1.5 text-[12.5px] text-slate-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <CheckBox checked={updateExisting} onChange={setUpdateExisting} />
            Cập nhật nhân viên đã có (trùng Mã NV)
          </label>
          <span className="text-[11.5px] text-slate-500 pl-6">Bỏ chọn: dòng trùng Mã NV sẽ được bỏ qua, chỉ thêm mới.</span>
        </div>
      </div>
      {(readErr || result?.error) && (
        <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border-b border-rose-200 text-[12.5px] text-rose-700">
          <AlertTriangle size={14} className="shrink-0" /> {readErr || result?.error}
        </div>
      )}
      {/* Bước 2: kiểm tra & xem trước */}
      {result && !result.error && (
        <>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-2 bg-[#f7f9fc] border-b border-slate-200 text-[12.5px]">
            <span>
              <b>{result.rows.length}</b> dòng · nhận <b>{result.cols.length}</b> cột
            </span>
            {(['new', 'update', 'skip', 'error'] as ImportRow['mode'][]).map((m) =>
              count(m) ? (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFilter(filter === m ? '' : m)}
                  className={`inline-flex items-center gap-1 cursor-pointer rounded-[3px] ${filter === m ? 'ring-2 ring-[#1f5fa8]/40' : ''}`}
                  title="Bấm để lọc"
                >
                  <Tag cls={MODE_TAG[m][1]}>
                    {MODE_TAG[m][0].split(' — ')[0]}: {count(m)}
                  </Tag>
                </button>
              ) : null,
            )}
            {filter && (
              <button type="button" className="text-[#1f5fa8] hover:underline cursor-pointer" onClick={() => setFilter('')}>
                Hiện tất cả
              </button>
            )}
            <span className="ml-auto flex items-center gap-1.5">
              {count('error') > 0 && <span className="text-[12px] text-rose-600">Dòng lỗi sẽ không được import — sửa file rồi chọn lại.</span>}
              <Btn
                variant="primary"
                icon={Upload}
                className="h-7"
                disabled={!ok}
                onClick={() =>
                  onImport(
                    result.rows.filter((r) => r.mode === 'new').map((r) => r.emp),
                    result.rows.filter((r) => r.mode === 'update').map((r) => ({ emp: r.emp, changes: r.changes })),
                    file!.name,
                  )
                }
              >
                Import {ok} nhân viên
              </Btn>
            </span>
          </div>
          <div className="max-h-[360px] overflow-auto">
            <table className={`${erp.table} min-w-[1100px]`}>
              <thead className="sticky top-0 z-10">
                <tr>
                  {['Dòng', 'Kết quả', 'Mã NV', 'Họ và tên', 'UserName', 'Khối', 'Phòng ban', 'Vị trí', 'Level', 'Trạng thái', 'Lỗi / Nội dung cập nhật'].map((h) => (
                    <th key={h} className={`${erp.th} text-left border-t-0 first:border-l-0 last:border-r-0`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.line} className={`${r.mode === 'error' ? 'bg-rose-50/50' : erp.tr} align-top`}>
                    <td className={`${erp.td} text-center text-slate-500 border-l-0 w-14`}>{r.line}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      <Tag cls={MODE_TAG[r.mode][1]}>{MODE_TAG[r.mode][0]}</Tag>
                    </td>
                    <td className={`${erp.td} ${erp.code} font-semibold whitespace-nowrap`}>{r.emp.code || '—'}</td>
                    <td className={`${erp.td} font-semibold whitespace-nowrap`}>{r.emp.fullName || '—'}</td>
                    <td className={erp.td}>{r.emp.userName || '—'}</td>
                    <td className={`${erp.td} text-center`}>{r.emp.division}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{r.emp.department}</td>
                    <td className={erp.td}>{r.emp.position}</td>
                    <td className={erp.td}>{r.emp.level}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      <StatusTag status={r.emp.status} />
                    </td>
                    <td className={`${erp.td} border-r-0 text-[12px] min-w-[320px]`}>
                      {r.errors.map((m, i) => (
                        <p key={i} className="text-rose-700">
                          • {m}
                        </p>
                      ))}
                      {r.warns.map((m, i) => (
                        <p key={i} className="text-amber-700">
                          • {m}
                        </p>
                      ))}
                      {r.mode === 'update' &&
                        (r.changes.length ? (
                          r.changes.map((m, i) => (
                            <p key={i} className="text-slate-600">
                              • {m}
                            </p>
                          ))
                        ) : (
                          <p className="text-slate-400">Không có thay đổi</p>
                        ))}
                      {r.mode === 'new' && !r.warns.length && <span className="text-slate-400">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Panel>
  );
};

/** Ảnh 3×4 trên hồ sơ — chưa có ảnh thì hiện chữ viết tắt họ + tên. */
const Avatar: React.FC<{ emp: Employee }> = ({ emp }) =>
  emp.photo ? (
    <img src={emp.photo} alt="Ảnh 3×4" className="w-[112px] h-[140px] rounded-[4px] object-cover border border-[#bcd3f0]" />
  ) : (
    <div className="w-[112px] h-[140px] rounded-[4px] bg-gradient-to-b from-[#eef4fb] to-[#e1ebf7] border border-[#bcd3f0] grid place-items-center text-[32px] font-bold text-[#1f5fa8]">{initials(emp.fullName)}</div>
  );

// ==========================================================================
// Hồ sơ nhân viên
// ==========================================================================
type Tab = 'info' | 'history';

const EmployeeDetail: React.FC<{
  initial: Employee;
  isNew?: boolean;
  role: Role;
  setRole: (r: Role) => void;
  all: Employee[];
  onBack: () => void;
  onSave: (e: Employee, changes: string[]) => void;
  /** Thay đổi không qua chế độ Sửa (hợp đồng, tài liệu, ảnh) — ghi lịch sử ngay. */
  onChange: (e: Employee, action: string, changes?: string[]) => void;
  onDelete: () => void;
  flash: (m: string) => void;
}> = ({ initial, isNew, role, setRole, all, onBack, onSave, onChange, onDelete, flash }) => {
  const [editing, setEditing] = useState(!!isNew);
  const [draft, setDraft] = useState<Employee>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<Tab>('info');
  const [confirmDel, setConfirmDel] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  // Hồ sơ đổi từ ngoài (hợp đồng, tài liệu, ảnh…) → cập nhật bản đang xem khi không sửa.
  useEffect(() => {
    if (!editing) setDraft(initial);
  }, [initial, editing]);

  const isHR = role === 'HR';
  const e = draft;
  const set = (k: FieldKey, v: string | boolean) => {
    setDraft((d) => {
      const next = { ...d, [k]: v } as Employee;
      if (k === 'surname' || k === 'givenName') next.fullName = `${next.surname} ${next.givenName}`.replace(/\s+/g, ' ').trim();
      if (k === 'userName' && v && (!d.companyEmail || d.companyEmail === `${d.userName}@aequitas.com.vn`)) next.companyEmail = `${v}@aequitas.com.vn`;
      return next;
    });
    const clear = k === 'surname' || k === 'givenName' ? [k, 'fullName'] : k === 'userName' ? [k, 'companyEmail'] : [k];
    if (clear.some((c) => errors[c])) setErrors((x) => ({ ...x, ...Object.fromEntries(clear.map((c) => [c, ''])) }));
  };
  /** Ảnh 3×4: đang sửa / thêm mới → vào bản nháp (lưu cùng hồ sơ); đang xem → lưu ngay, ghi lịch sử. */
  const setPhoto = (photo: string | undefined, name = '') => {
    if (editing) return setDraft((d) => ({ ...d, photo }));
    onChange({ ...e, photo }, photo ? 'Cập nhật ảnh 3×4' : 'Xoá ảnh 3×4', name ? [name] : undefined);
  };
  // Danh sách chọn động: UserName (tài khoản chưa gán NV khác) · Quản lý trực tiếp (Lead / Manager và BOD / GĐK)
  const dyn = useMemo<Partial<Record<FieldKey, string[]>>>(() => {
    const others = all.filter((x) => x.id !== initial.id);
    const taken = new Set(others.map((x) => x.userName));
    return {
      userName: [...new Set([...all.map((x) => x.userName), ...FREE_ACCOUNTS])].filter((u) => u && !taken.has(u)).sort(),
      manager: [...new Set([...EXTRA_MANAGERS, ...others.filter((x) => (x.level === 'Lead' || x.level === 'Manager') && x.status !== 'Đã nghỉ việc').map((x) => x.fullName)])],
    };
  }, [all, initial.id]);
  const save = () => {
    const clean = { ...draft, code: draft.code.trim(), userName: draft.userName.trim(), companyEmail: draft.companyEmail.trim() };
    const err = validate(clean, all);
    setErrors(err);
    const n = Object.values(err).filter(Boolean).length;
    if (n) return flash(`Còn ${n} ô chưa hợp lệ — xem các ô viền đỏ`);
    onSave(clean, isNew ? [] : [...diff(initial, clean), ...(clean.photo !== initial.photo ? [clean.photo ? 'Ảnh 3×4: đã cập nhật' : 'Ảnh 3×4: đã xoá'] : [])]);
    if (!isNew) setEditing(false);
  };
  const cancel = () => {
    if (isNew) return onBack();
    setDraft(initial);
    setErrors({});
    setEditing(false);
  };
  const exportXlsx = () => {
    const rows: (string | number)[][] = [['HỒ SƠ NHÂN VIÊN'], [`${e.code} — ${e.fullName}`], [`Xuất ngày ${dmy(today())} bởi ${ROLE_USER[role]}`], []];
    const push = (title: string, fs: FieldDef[]) => {
      rows.push([title.toUpperCase()]);
      fs.forEach((f) => rows.push([f.label, f.sensitive && role === 'QL' ? mask(String(e[f.key] || '')) : showValue(f, e[f.key])]));
      rows.push([]);
    };
    push('Nhân viên', HEAD_FIELDS);
    SECTIONS.forEach((s) => (s.fields ? push(s.title, s.fields) : s.groups!.forEach((g) => push(g.title, g.fields))));
    push('Ghi chú', [NOTE_FIELD]);
    rows.push(['HỢP ĐỒNG LAO ĐỘNG'], ['Loại hợp đồng', currentContract(e)?.type || 'Chưa có']);
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 26 }, { wch: 48 }, { wch: 12 }, { wch: 12 }, { wch: 16 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hồ sơ');
    XLSX.writeFile(wb, `HoSo_${e.code}.xlsx`);
  };

  const node = (f: FieldDef, editable = editing) => fieldNode(f, e, editable, role, errors[f.key], set, dyn);
  const items = (fs: FieldDef[], side?: 0 | 1, editable?: (f: FieldDef) => boolean): InfoItem[] =>
    fs
      .filter((_, i) => side === undefined || i % 2 === side)
      .map((f) => ({ label: label(f, editing && (editable ? editable(f) : true)), value: node(f, editing && (editable ? editable(f) : true)) }));
  const cur = currentContract(e);
  const SECTION_ICON: Record<string, React.ElementType> = { 'Công việc': Briefcase, 'Thông tin cá nhân': User, 'Học vấn & kinh nghiệm': GraduationCap, 'Giấy tờ, thuế & ngân hàng': IdCard };

  return (
    <div className="space-y-3">
      <ErpTitleBar
        title={isNew ? 'Thêm nhân viên' : editing ? 'Sửa hồ sơ nhân viên' : undefined}
        crumbs={isNew || editing ? CRUMBS : undefined}
        onBack={editing ? undefined : onBack}
        actions={
          <>
            {editing ? (
              <>
                <Btn icon={X} onClick={cancel}>
                  {isNew ? 'Huỷ' : 'Huỷ sửa'}
                </Btn>
                <Btn variant="primary" icon={Save} onClick={save}>
                  {isNew ? 'Tạo hồ sơ' : 'Lưu thay đổi'}
                </Btn>
              </>
            ) : (
              <>
                {role !== 'NV' && (
                  <Btn icon={Download} onClick={exportXlsx}>
                    Xuất hồ sơ
                  </Btn>
                )}
                {isHR && (
                  <>
                    <Btn variant="primary" icon={Pencil} onClick={() => (setEditing(true), setTab('info'), setConfirmDel(false))}>
                      Sửa
                    </Btn>
                    <Btn variant="danger" icon={Trash2} onClick={() => setConfirmDel(true)}>
                      Xoá
                    </Btn>
                  </>
                )}
              </>
            )}
          </>
        }
        meta={
          isNew
            ? undefined
            : [
                { label: 'Mã NV', value: <span className="font-mono">{initial.code}</span> },
                { label: 'Trạng thái', value: <StatusTag status={initial.status} /> },
                { label: 'Hợp đồng', value: cur ? cur.type : 'Chưa có' },
                { label: 'Cập nhật', value: `${dmyhm(initial.updatedAt)} bởi ${initial.updatedBy}` },
              ]
        }
        notice={
          confirmDel ? (
            <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-rose-50 text-[12.5px] text-rose-700">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="flex-1 min-w-[240px]">
                Xoá hồ sơ <b>{initial.code} — {initial.fullName}</b>? Hồ sơ, hợp đồng và tài liệu đính kèm sẽ bị xoá, không khôi phục được.
              </span>
              <Btn onClick={() => setConfirmDel(false)} className="h-7">
                Không xoá
              </Btn>
              <Btn variant="danger" icon={Trash2} onClick={onDelete} className="h-7 !bg-rose-600 !text-white !border-rose-700 hover:!bg-rose-700">
                Xoá hồ sơ
              </Btn>
            </div>
          ) : role === 'QL' ? (
            <div className="flex items-center gap-2.5 px-4 py-1.5 bg-slate-50 text-[12px] text-slate-500">
              <Lock size={13} className="shrink-0" /> Đang xem với vai trò Quản lý trực tiếp — số CCCD, mã số thuế, sổ BHXH, tài khoản ngân hàng được che; chỉ Nhân sự (HR) xem đầy đủ.
            </div>
          ) : role === 'NV' ? (
            <div className="flex items-center gap-2.5 px-4 py-1.5 bg-slate-50 text-[12px] text-slate-500">
              <Lock size={13} className="shrink-0" /> Hồ sơ của bạn (chỉ xem). Cần điều chỉnh thông tin, liên hệ phòng Nhân sự.
            </div>
          ) : null
        }
      />

      {/* Nhân viên */}
      <Panel title="Nhân viên" icon={Hash} noPad>
        <div className="flex">
          <div className="shrink-0 flex flex-col items-center justify-center gap-1 px-4 py-2 border-r border-slate-200 bg-[#fafbfd]">
            {isHR ? (
              <>
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(ev) => {
                    const f = ev.target.files?.[0];
                    ev.target.value = '';
                    if (!f) return;
                    if (!f.type.startsWith('image/')) return flash('Chỉ nhận file ảnh (.jpg, .png, .webp)');
                    if (f.size > 5 * 1048576) return flash('Ảnh tối đa 5 MB');
                    const r = new FileReader();
                    r.onload = () => setPhoto(String(r.result), f.name);
                    r.readAsDataURL(f);
                  }}
                />
                <button
                  type="button"
                  onClick={() => photoRef.current?.click()}
                  className="group relative rounded-[4px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1f5fa8]/40"
                  title={e.photo ? 'Bấm để đổi ảnh 3×4' : 'Bấm để tải ảnh 3×4 lên'}
                >
                  <Avatar emp={e} />
                  <span className="absolute inset-0 rounded-[4px] flex flex-col items-center justify-center gap-1 bg-[#1e3a5f]/85 text-white text-[11.5px] font-semibold opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
                    <Camera size={20} />
                    {e.photo ? 'Đổi ảnh' : 'Tải ảnh lên'}
                  </span>
                  {!e.photo && (
                    <span className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-[#1f5fa8] text-white flex items-center justify-center shadow group-hover:opacity-0 transition-opacity">
                      <Camera size={13} />
                    </span>
                  )}
                </button>
                {e.photo ? (
                  <button type="button" onClick={() => setPhoto(undefined)} className="text-[11px] text-rose-600 hover:underline cursor-pointer">
                    Xoá ảnh
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500">Ảnh 3×4 · bấm để tải lên</span>
                )}
              </>
            ) : (
              <>
                <Avatar emp={e} />
                <span className="text-[11px] text-slate-500">Ảnh 3×4</span>
              </>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <InfoGrid left={items(HEAD_FIELDS, 0, (f) => f.key !== 'code' || !!isNew)} right={items(HEAD_FIELDS, 1)} labelW={[130, 130]} />
          </div>
        </div>
      </Panel>

      {!isNew && (
        <FolderTabs
          tabs={[
            { key: 'info', label: 'Thông tin nhân sự', icon: LayoutList },
            { key: 'history', label: `Lịch sử (${e.history.length})`, icon: History },
          ]}
          value={tab}
          onChange={(k) => !editing && setTab(k)}
        />
      )}

      {tab === 'info' && (
        <div className="space-y-3">
          {SECTIONS.map((s) => (
            <Panel key={s.title} title={s.title} icon={SECTION_ICON[s.title]} noPad>
              {s.fields ? (
                <InfoGrid left={items(s.fields, 0)} right={items(s.fields, 1)} />
              ) : (
                <InfoGrid
                  left={s.groups![0].fields.map((f) => ({ label: label(f, editing), value: node(f) }))}
                  right={s.groups![1].fields.map((f) => ({ label: label(f, editing), value: node(f) }))}
                />
              )}
            </Panel>
          ))}

          {!isNew && (
            <Panel title="Hợp đồng & tài liệu" icon={FileSignature} noPad>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {/* Hợp đồng lao động */}
                <div className="px-3 py-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">Hợp đồng lao động</p>
                  <div className="flex items-start gap-2.5">
                    <span className={`mt-0.5 w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${cur ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      <FileSignature size={15} />
                    </span>
                    <div className="min-w-0 flex-1 text-[12.5px]">
                      {cur ? (
                        <dl className="grid grid-cols-[100px_1fr] gap-x-2 pt-1.5">
                          <dt className="text-slate-500">Loại hợp đồng</dt>
                          <dd className="font-semibold text-slate-800">{cur.type}</dd>
                        </dl>
                      ) : (
                        <p className="pt-1.5 text-slate-500">Chưa có hợp đồng trong hệ thống</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Tài liệu đính kèm */}
                <div className="px-3 py-2.5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">Tài liệu đính kèm ({e.files.length})</p>
                  {e.files.length > 0 && (
                    <ul className="mb-2 border border-slate-200 rounded-[3px] divide-y divide-slate-100">
                      {e.files.map((f) => (
                        <li key={f.id} className="flex items-center gap-2 px-2.5 py-1.5 text-[12.5px]">
                          <FileText size={14} className="text-[#1f5fa8] shrink-0" />
                          <span className="flex-1 min-w-0 truncate text-slate-800" title={f.name}>
                            {f.name}
                          </span>
                          <span className="text-[11px] text-slate-400 whitespace-nowrap tabular-nums">
                            {fileSize(f.size)} · {dmy(f.at.slice(0, 10))}
                          </span>
                          {isHR && (
                            <button
                              type="button"
                              className="p-0.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Xoá tài liệu"
                              onClick={() => onChange({ ...e, files: e.files.filter((x) => x.id !== f.id) }, 'Xoá tài liệu', [f.name])}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {isHR ? (
                    <>
                      <input
                        ref={fileRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(ev) => {
                          const fs = [...(ev.target.files || [])];
                          ev.target.value = '';
                          if (!fs.length) return;
                          const added = fs.map((f) => ({ id: uid(), name: f.name, size: f.size, at: nowIso(), by: ROLE_USER[role] }));
                          onChange({ ...e, files: [...e.files, ...added] }, 'Đính kèm tài liệu', added.map((f) => f.name));
                        }}
                      />
                      <Btn icon={Paperclip} className="h-7" onClick={() => fileRef.current?.click()} disabled={editing}>
                        Đính kèm tài liệu
                      </Btn>
                      <p className="mt-1.5 text-[11.5px] text-slate-400">CV, CCCD, bằng cấp... (.pdf, .doc, .jpg)</p>
                    </>
                  ) : (
                    !e.files.length && <p className="text-[12.5px] text-slate-400">Chưa có tài liệu.</p>
                  )}
                </div>
              </div>
            </Panel>
          )}

          <Panel title="Ghi chú" icon={NotebookPen}>
            {editing ? (
              <textarea
                value={e.note}
                onChange={(ev) => set('note', ev.target.value)}
                rows={4}
                maxLength={2000}
                placeholder={NOTE_FIELD.placeholder}
                className={`${erp.inputFull} h-auto py-1.5 resize-y leading-relaxed`}
              />
            ) : e.note ? (
              <p className="text-[13px] text-slate-800 whitespace-pre-wrap leading-relaxed">{e.note}</p>
            ) : (
              <p className="text-[12.5px] text-slate-400">{isHR ? 'Chưa có ghi chú — bấm Sửa để thêm.' : 'Chưa có ghi chú.'}</p>
            )}
            {editing && <p className="mt-1 text-right text-[11px] text-slate-400 tabular-nums">{e.note.length}/2000</p>}
          </Panel>
        </div>
      )}


      {tab === 'history' && (
        <Panel title="Lịch sử thay đổi" icon={History} noPad>
          <table className={erp.table}>
            <thead>
              <tr>
                {['STT', 'Thời gian', 'Người thực hiện', 'Thao tác', 'Nội dung thay đổi'].map((h) => (
                  <th key={h} className={`${erp.th} text-left border-t-0 first:border-l-0 last:border-r-0`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...e.history].reverse().map((h, i) => (
                <tr key={i} className={`${erp.tr} align-top`}>
                  <td className={`${erp.td} text-center text-slate-500 border-l-0 w-12`}>{i + 1}</td>
                  <td className={`${erp.td} whitespace-nowrap w-40`}>{dmyhm(h.at)}</td>
                  <td className={`${erp.td} w-36`}>{h.by}</td>
                  <td className={`${erp.td} font-semibold w-48`}>{h.action}</td>
                  <td className={`${erp.td} text-slate-600 border-r-0`}>
                    {h.changes?.length ? (
                      <ul className="space-y-0.5">
                        {h.changes.map((c, j) => (
                          <li key={j}>• {c}</li>
                        ))}
                      </ul>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
};
