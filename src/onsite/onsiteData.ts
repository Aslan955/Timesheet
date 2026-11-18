/**
 * Dữ liệu + hàm nghiệp vụ onsite dùng chung cho 3 màn — luồng đơn theo code iMIS, cách tính tiền theo đề xuất mới:
 *  - Quản lý Đơn từ › Đơn công tác  (TotalRequests/OnsiteRequestComponent.razor + TotalRequestsService)
 *  - PayRoll › Báo cáo Onsite        — ĐỀ XUẤT: HCNS duyệt & chốt onsite theo tháng tại đây
 *  - PayRoll › Payroll               — ĐỀ XUẤT: chỉ đọc số đã chốt, không tự tính / gắn đơn
 *  Mức hỗ trợ theo Phụ lục 03 (Hà Nội: < 30km 100.000 đ, ≥ 30km 180.000 đ / ngày công).
 * Tên người / dự án đều là dữ liệu giả lập.
 */

// ───────────────────────── Kiểu dữ liệu ─────────────────────────
export type HodSt = 'DRAFT' | 'REQUESTED' | 'APPROVED_PM' | 'APPROVED' | 'REJECTED_PM' | 'REJECTED';
export type PmoSt = null | 'APPROVED' | 'REJECTED';
export type RoleKey = 'emp' | 'pm' | 'hod' | 'pmo' | 'hr' | 'admin';
export type SiteZone = 'HN_LT30' | 'HN_GE30' | 'OUT_HN';
export type Contract = 'Thử việc' | 'Chính thức' | 'Thực tập' | 'Cộng tác viên';

export interface Slot { date: string; start: string; end: string; hours: number; coef: number }
export interface LogItem { at: string; by: string; action: string; detail: string }
export interface OnsiteRec {
  id: string; code: string; projectId: string; employeeId: string;
  hodStatus: HodSt; hodApprovedAt?: string; hodApprovedBy?: string;
  status: PmoSt; approvedAt?: string; approveBy?: string;
  createdAt: string; createdBy: string; creatorId: string;
  isLocked: boolean;
  /** Đã chốt ở Báo cáo Onsite (kỳ chốt OC-yyyy-mm) — thay cho việc gắn SalaryApprovalId khi duyệt lương. */
  closingId?: string;
  address: string;
  /** Phụ lục 03: địa bàn / khoảng cách từ trụ sở quyết định mức hỗ trợ. */
  zone: SiteZone;
  regType: 0 | 1 | 2; description: string; hodId: string; attachment?: string;
  note?: string; slots: Slot[]; history: LogItem[];
}
/** Bản ghi lương đã lưu khi duyệt kỳ (Salary): chỉ giữ các cột onsite, chép từ kỳ chốt onsite. */
export interface SalarySnap { employeeId: string; unitsLT30: number; unitsGE30: number; carryAmount: number; units: number; allowance: number }
export interface Period {
  id: string; year: number; month: number;
  /** SalaryApproval.StatusId: chưa duyệt / PAY_APPROVED / từ chối */
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED';
  approvedAt?: string; locked: boolean;
  /** Bảng lương đã lưu lúc duyệt kỳ — null khi chưa duyệt (màn Payroll tính thử trực tiếp). */
  saved?: SalarySnap[];
}

// ───────────────────────── Danh mục giả lập ─────────────────────────
export const USERS: Record<RoleKey, { id: string; name: string; label: string }> = {
  emp: { id: 'u-emp', name: 'Nguyễn Văn Bình', label: 'Nhân viên thường' },
  pm: { id: 'u-pm', name: 'Trần Minh Quân', label: 'PM (A.26.014 / S.26.007)' },
  hod: { id: 'u-hod', name: 'Phạm Thu Hà', label: 'HOD Khối Delivery 1' },
  pmo: { id: 'u-pmo', name: 'Lê Hoàng Long', label: 'PMO' },
  hr: { id: 'u-hr', name: 'Đỗ Mai Anh', label: 'HR' },
  admin: { id: 'u-admin', name: 'Administrator', label: 'Admin' },
};
export const HODS = [
  { id: 'u-hod', name: 'Phạm Thu Hà', org: 'Khối Delivery 1' },
  { id: 'u-hod2', name: 'Ngô Đức Mạnh', org: 'Khối Delivery 2' },
];
export const PROJECTS = [
  { id: 'P1', code: 'A.26.014.NHA', name: 'Triển khai Core Banking – Ngân hàng A', pmId: 'u-pm', pmName: 'Trần Minh Quân', org: 'Khối Delivery 1', active: true, members: ['E1', 'E2', 'E5'] },
  { id: 'P2', code: 'S.26.007.DLB', name: 'Hệ thống vận hành lưới điện B', pmId: 'u-pm', pmName: 'Trần Minh Quân', org: 'Khối Delivery 1', active: true, members: ['E1', 'E3', 'E5', 'E6'] },
  { id: 'P3', code: 'X.26.003.CDV', name: 'Cổng dịch vụ công Bộ C', pmId: 'u-pm2', pmName: 'Vũ Đức Thành', org: 'Khối Delivery 2', active: true, members: ['E4', 'E2'] },
  { id: 'P5', code: 'X.26.009.TCE', name: 'Tư vấn chuyển đổi số Tập đoàn E', pmId: 'u-hod', pmName: 'Phạm Thu Hà', org: 'Khối Delivery 2', active: true, members: ['E4', 'E2'] },
  { id: 'P4', code: 'H.25.011.ADD', name: 'Nâng cấp hạ tầng D (đã đóng mã)', pmId: 'u-pm2', pmName: 'Vũ Đức Thành', org: 'Khối Delivery 2', active: false, members: ['E4'] },
];
export const EMPLOYEES = [
  { id: 'E1', code: 'V01021', name: 'Nguyễn Văn Bình', dept: 'Khối Delivery 1', contract: 'Chính thức' as Contract, userId: 'u-emp' as string | undefined },
  { id: 'E2', code: 'V01088', name: 'Hoàng Thị Lan', dept: 'Khối Delivery 1', contract: 'Chính thức' as Contract },
  { id: 'E3', code: 'V01102', name: 'Đặng Quốc Việt', dept: 'Khối Delivery 1', contract: 'Thử việc' as Contract },
  { id: 'E4', code: 'V01135', name: 'Bùi Thanh Tùng', dept: 'Khối Delivery 2', contract: 'Chính thức' as Contract },
  { id: 'E5', code: 'V01177', name: 'Phan Ngọc Mai', dept: 'Khối Delivery 1', contract: 'Chính thức' as Contract },
  { id: 'E6', code: 'V01203', name: 'Lý Minh Khoa', dept: 'Khối Delivery 1', contract: 'Thực tập' as Contract },
];
/** Đơn nghỉ phép đã duyệt — kiểm tra trùng lịch và trừ giờ khi tính phụ cấp. */
export const LEAVES = [
  { employeeId: 'E2', start: '2026-11-20T08:00', end: '2026-11-20T17:30', totalHours: 8, label: 'Nghỉ phép năm' },
  { employeeId: 'E3', start: '2026-10-14T13:30', end: '2026-10-14T17:30', totalHours: 4, label: 'Nghỉ phép năm (chiều)' },
];

// ───────────────────────── Hàm nghiệp vụ ─────────────────────────
// Khai báo function (hoisted) vì INIT_RECORDS bên dưới gọi calcHours lúc nạp module.
export function toMin(t: string) { const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); }
/** OnsiteCRUComponent.CalculateRowHours: trừ nghỉ trưa 12:00–13:30, làm tròn 0.1; hệ số = giờ/8 (tối đa 1). */
export function calcHours(start: string, end: string) {
  const s = toMin(start), e = toMin(end), L1 = 12 * 60, L2 = 13 * 60 + 30;
  let raw = 0;
  if (!start || !end || e <= s) raw = 0;
  else if (e <= L2 && s >= L1) raw = 0;
  else if (s < L1 && e > L2) raw = (e - s) / 60 - 1.5;
  else if (s < L1 && e > L1) raw = (L1 - s) / 60;
  else if (s < L2 && e > L2) raw = (e - L2) / 60;
  else raw = (e - s) / 60;
  const hours = Math.round(Math.max(0, raw) * 10) / 10;
  return { hours, coef: hours < 8 ? Math.round((hours / 8) * 100) / 100 : 1 };
}
/** SalaryService.GetLeaveHoursOnDate */
export function leaveHoursOnDate(start: string, end: string, total: number, date: string) {
  const sd = start.slice(0, 10), ed = end.slice(0, 10);
  if (date < sd || date > ed) return 0;
  if (sd === ed) return total > 0 ? total : 8;
  if (date > sd && date < ed) return 8;
  if (date === sd) return toMin(start.slice(11, 16)) >= 12 * 60 ? 4 : 8;
  if (date === ed) return toMin(end.slice(11, 16)) <= 13 * 60 ? 4 : 8;
  return 8;
}
export const overlap = (a: Slot, b: Slot) => a.date === b.date && toMin(a.start) < toMin(b.end) && toMin(b.start) < toMin(a.end);

export const fmtD = (d?: string) => (d ? `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}` : '');
export const fmtDT = (d?: string) => (d ? `${fmtD(d)} ${d.slice(11, 16)}` : '');
export const nowIso = () => { const d = new Date(); const p = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };
export const startDate = (r: OnsiteRec) => r.slots.map((s) => s.date).sort()[0];
export const endDate = (r: OnsiteRec) => r.slots.map((s) => s.date).sort().slice(-1)[0];
/** Onsite.Month = tháng của ngày bắt đầu (OnsiteService.CreateAsync). */
export const monthOf = (r: OnsiteRec) => Number(startDate(r).slice(5, 7));
export const proj = (id: string) => PROJECTS.find((p) => p.id === id)!;
export const emp = (id: string) => EMPLOYEES.find((e) => e.id === id)!;
export const dow = (d: string) => ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][new Date(d + 'T00:00').getDay()];
export const money = (n: number) => Math.round(n).toLocaleString('vi-VN');
export const periodName = (p: { month: number; year: number }) => `${String(p.month).padStart(2, '0')}/${p.year}`;
export const log = (at: string, by: string, action: string, detail: string): LogItem => ({ at, by, action, detail });

/** HodStatusName (TotalRequestsService): APPROVED_PM hiển thị "Requested", REJECTED_PM hiển thị "Rejected". */
export const HOD_LABEL: Record<HodSt, string> = { DRAFT: 'Draft', REQUESTED: 'Requested', APPROVED_PM: 'Requested', APPROVED: 'Approved', REJECTED_PM: 'Rejected', REJECTED: 'Rejected' };

const full = (d: string, s = '08:00', e = '17:30'): Slot => ({ date: d, start: s, end: e, ...calcHours(s, e) });

// ───────────────────────── Dữ liệu mẫu ─────────────────────────
export const INIT_PERIODS: Period[] = [
  { id: 'SA-2026-09', year: 2026, month: 9, status: 'APPROVED', approvedAt: '2026-10-05T10:00', locked: true,
    saved: [{ employeeId: 'E4', unitsLT30: 5, unitsGE30: 0, carryAmount: 0, units: 5, allowance: 500_000 }] },
  { id: 'SA-2026-10', year: 2026, month: 10, status: 'APPROVED', approvedAt: '2026-11-05T09:30', locked: false,
    saved: [{ employeeId: 'E1', unitsLT30: 5, unitsGE30: 0, carryAmount: 0, units: 5, allowance: 500_000 }] },
  { id: 'SA-2026-11', year: 2026, month: 11, status: 'REQUESTED', locked: false },
];

export const INIT_RECORDS: OnsiteRec[] = [
  {
    id: 'r1', code: 'ONS_20261001_0001', projectId: 'P1', employeeId: 'E1', hodStatus: 'APPROVED', hodApprovedAt: '2026-10-02T09:12', hodApprovedBy: 'Phạm Thu Hà',
    status: 'APPROVED', approvedAt: '2026-10-02T09:12', approveBy: 'Phạm Thu Hà', createdAt: '2026-10-01T08:40', createdBy: 'Trần Minh Quân', creatorId: 'u-pm',
    isLocked: false, closingId: 'OC-2026-10', address: 'Hội sở Ngân hàng A, Hà Nội', zone: 'HN_LT30', regType: 1, description: 'UAT phân hệ tiền gửi', hodId: 'u-hod',
    slots: ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'].map((d) => full(d)),
    history: [log('2026-10-01T08:40', 'Trần Minh Quân', 'Gửi yêu cầu', 'Tạo đơn và gửi yêu cầu (chờ HOD duyệt)'), log('2026-10-02T09:12', 'Phạm Thu Hà', 'Duyệt', 'Đã được phê duyệt cấp 2 (HOD/Admin)'), log('2026-11-04T17:00', 'Đỗ Mai Anh', 'Chốt onsite', 'Chốt ở Báo cáo Onsite tháng 10/2026')],
  },
  {
    id: 'r2', code: 'ONS_20261012_0001', projectId: 'P2', employeeId: 'E3', hodStatus: 'APPROVED', hodApprovedAt: '2026-11-08T14:20', hodApprovedBy: 'Phạm Thu Hà',
    status: 'APPROVED', approvedAt: '2026-11-08T14:20', approveBy: 'Phạm Thu Hà', createdAt: '2026-10-12T10:05', createdBy: 'Trần Minh Quân', creatorId: 'u-pm',
    isLocked: false, address: 'Trung tâm điều độ B, Sóc Sơn, Hà Nội', zone: 'HN_GE30', regType: 0, description: 'Khảo sát hiện trạng trạm biến áp', hodId: 'u-hod',
    slots: [full('2026-10-13'), full('2026-10-14'), full('2026-10-15')],
    history: [log('2026-10-12T10:05', 'Trần Minh Quân', 'Gửi yêu cầu', 'Tạo đơn và gửi yêu cầu (chờ HOD duyệt)'), log('2026-11-08T14:20', 'Phạm Thu Hà', 'Duyệt', 'HOD duyệt muộn — sau khi đã chốt onsite tháng 10/2026 (04/11)')],
  },
  {
    id: 'r3', code: 'ONS_20261028_0001', projectId: 'P1', employeeId: 'E1', hodStatus: 'APPROVED', hodApprovedAt: '2026-10-30T16:45', hodApprovedBy: 'Lê Hoàng Long',
    status: 'APPROVED', approvedAt: '2026-10-30T16:45', approveBy: 'Lê Hoàng Long', createdAt: '2026-10-28T09:00', createdBy: 'Trần Minh Quân', creatorId: 'u-pm',
    isLocked: false, address: 'Hội sở Ngân hàng A, Hà Nội', zone: 'HN_LT30', regType: 1, description: 'Go-live phân hệ cho vay', hodId: 'u-hod',
    slots: [full('2026-11-02', '08:30', '17:30'), full('2026-11-03'), full('2026-11-04'), full('2026-11-05'), full('2026-11-06')],
    history: [log('2026-10-28T09:00', 'Trần Minh Quân', 'Gửi yêu cầu', 'Tạo đơn và gửi yêu cầu (chờ HOD duyệt)'), log('2026-10-30T16:45', 'Lê Hoàng Long', 'Duyệt', 'Đã được phê duyệt cấp 2 (HOD/Admin) bởi PMO')],
  },
  {
    id: 'r4', code: 'ONS_20261116_0001', projectId: 'P1', employeeId: 'E2', hodStatus: 'REQUESTED', status: null, createdAt: '2026-11-16T11:20', createdBy: 'Trần Minh Quân', creatorId: 'u-pm',
    isLocked: false, address: 'Chi nhánh Ngân hàng A, Đà Nẵng', zone: 'OUT_HN', regType: 0, description: 'Đào tạo người dùng cuối (dữ liệu cũ: Requested chờ PM)', hodId: 'u-hod', attachment: 'ke-hoach-dao-tao.pdf',
    slots: [full('2026-11-18'), full('2026-11-19'), full('2026-11-20'), full('2026-11-23', '08:00', '12:00')],
    history: [log('2026-11-16T11:20', 'Trần Minh Quân', 'Gửi yêu cầu', 'Dữ liệu cũ — tạo theo luồng trước, chờ PM duyệt')],
  },
  {
    id: 'r5', code: 'ONS_20261113_0001', projectId: 'P3', employeeId: 'E4', hodStatus: 'APPROVED_PM', status: null, createdAt: '2026-11-13T08:15', createdBy: 'Vũ Đức Thành', creatorId: 'u-pm2',
    isLocked: false, address: 'Trụ sở Bộ C, Hà Nội', zone: 'HN_LT30', regType: 0, description: 'Hỗ trợ vận hành cổng', hodId: 'u-hod2',
    slots: [full('2026-11-23'), full('2026-11-24')],
    history: [log('2026-11-13T08:15', 'Vũ Đức Thành', 'Gửi yêu cầu', 'Tạo đơn và gửi yêu cầu (chờ HOD duyệt)')],
  },
  {
    id: 'r6', code: 'ONS_20261105_0002', projectId: 'P2', employeeId: 'E5', hodStatus: 'REJECTED', status: 'REJECTED', approvedAt: '2026-11-06T09:00', approveBy: 'Phạm Thu Hà', hodApprovedAt: '2026-11-06T09:00', hodApprovedBy: 'Phạm Thu Hà',
    createdAt: '2026-11-05T13:30', createdBy: 'Trần Minh Quân', creatorId: 'u-pm', isLocked: false, address: 'Trung tâm điều độ B, Sóc Sơn, Hà Nội', zone: 'HN_GE30', regType: 0, description: 'Cài đặt máy chủ', hodId: 'u-hod',
    note: 'Lịch đã có đội hạ tầng phụ trách, không cần đi.', slots: [full('2026-11-10'), full('2026-11-11')],
    history: [log('2026-11-05T13:30', 'Trần Minh Quân', 'Gửi yêu cầu', 'Tạo đơn và gửi yêu cầu (chờ HOD duyệt)'), log('2026-11-06T09:00', 'Phạm Thu Hà', 'Từ chối', 'Đã bị từ chối cấp 2 (HOD/Admin) bởi Phạm Thu Hà, lý do: Lịch đã có đội hạ tầng phụ trách, không cần đi.')],
  },
  {
    id: 'r7', code: 'ONS_20261117_0001', projectId: 'P2', employeeId: 'E1', hodStatus: 'DRAFT', status: null, createdAt: '2026-11-17T08:05', createdBy: 'Trần Minh Quân', creatorId: 'u-pm',
    isLocked: false, address: 'Trung tâm điều độ B, Sóc Sơn, Hà Nội', zone: 'HN_GE30', regType: 0, description: 'Nghiệm thu giai đoạn 1', hodId: 'u-hod',
    slots: [full('2026-11-25'), full('2026-11-26')], history: [log('2026-11-17T08:05', 'Trần Minh Quân', 'Lưu nháp', 'Tạo bản nháp')],
  },
  {
    id: 'r8', code: 'ONS_20260918_0001', projectId: 'P3', employeeId: 'E4', hodStatus: 'APPROVED', hodApprovedAt: '2026-09-19T10:00', hodApprovedBy: 'Ngô Đức Mạnh',
    status: 'APPROVED', approvedAt: '2026-09-19T10:00', approveBy: 'Ngô Đức Mạnh', createdAt: '2026-09-18T09:00', createdBy: 'Vũ Đức Thành', creatorId: 'u-pm2',
    isLocked: false, closingId: 'OC-2026-09', address: 'Trụ sở Bộ C, Hà Nội', zone: 'HN_LT30', regType: 1, description: 'Triển khai đợt 1', hodId: 'u-hod2',
    slots: ['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25'].map((d) => full(d)),
    history: [log('2026-09-18T09:00', 'Vũ Đức Thành', 'Gửi yêu cầu', 'Tạo đơn và gửi yêu cầu'), log('2026-09-19T10:00', 'Ngô Đức Mạnh', 'Duyệt', 'Đã được phê duyệt cấp 2 (HOD/Admin)'), log('2026-10-04T16:00', 'Đỗ Mai Anh', 'Chốt onsite', 'Chốt ở Báo cáo Onsite tháng 09/2026')],
  },
  {
    id: 'r9', code: 'ONS_20261102_0001', projectId: 'P1', employeeId: 'E5', hodStatus: 'APPROVED', hodApprovedAt: '2026-11-02T15:00', hodApprovedBy: 'Phạm Thu Hà',
    status: 'APPROVED', approvedAt: '2026-11-02T15:00', approveBy: 'Phạm Thu Hà', createdAt: '2026-11-02T08:00', createdBy: 'Trần Minh Quân', creatorId: 'u-pm',
    isLocked: true, address: 'Hội sở Ngân hàng A, Hà Nội', zone: 'HN_LT30', regType: 0, description: 'Hỗ trợ kick-off với khách hàng (nửa ngày)', hodId: 'u-hod',
    slots: [full('2026-11-03', '08:00', '12:00')],
    history: [log('2026-11-02T08:00', 'Trần Minh Quân', 'Gửi yêu cầu', 'Tạo đơn và gửi yêu cầu'), log('2026-11-02T15:00', 'Phạm Thu Hà', 'Duyệt', 'Đã được phê duyệt cấp 2 (HOD/Admin)'), log('2026-11-10T09:00', 'Lê Hoàng Long', 'Khoá', 'Khoá bản ghi (màn /Onsite)')],
  },
  {
    id: 'r10', code: 'ONS_20261112_0001', projectId: 'P2', employeeId: 'E3', hodStatus: 'APPROVED', hodApprovedAt: '2026-11-12T11:00', hodApprovedBy: 'Phạm Thu Hà',
    status: 'APPROVED', approvedAt: '2026-11-12T11:00', approveBy: 'Phạm Thu Hà', createdAt: '2026-11-12T08:30', createdBy: 'Trần Minh Quân', creatorId: 'u-pm',
    isLocked: false, address: 'Trung tâm điều độ B, Sóc Sơn, Hà Nội', zone: 'HN_GE30', regType: 0, description: 'Trực chuyển đổi hệ thống (thứ 7)', hodId: 'u-hod',
    slots: [full('2026-11-14')],
    history: [log('2026-11-12T08:30', 'Trần Minh Quân', 'Gửi yêu cầu', 'Tạo đơn và gửi yêu cầu'), log('2026-11-12T11:00', 'Phạm Thu Hà', 'Duyệt', 'Đã được phê duyệt cấp 2 (HOD/Admin)')],
  },
  {
    id: 'r11', code: 'ONS_20261113_0002', projectId: 'P1', employeeId: 'E5', hodStatus: 'APPROVED', hodApprovedAt: '2026-11-14T10:10', hodApprovedBy: 'Phạm Thu Hà',
    status: 'APPROVED', approvedAt: '2026-11-14T10:10', approveBy: 'Phạm Thu Hà', createdAt: '2026-11-13T16:00', createdBy: 'Trần Minh Quân', creatorId: 'u-pm',
    isLocked: false, address: 'Hội sở Ngân hàng A, Hà Nội', zone: 'HN_LT30', regType: 0, description: 'Hỗ trợ đối soát cuối ngày (6 giờ)', hodId: 'u-hod',
    slots: [full('2026-11-16', '09:00', '16:30')],
    history: [log('2026-11-13T16:00', 'Trần Minh Quân', 'Gửi yêu cầu', 'Tạo đơn và gửi yêu cầu'), log('2026-11-14T10:10', 'Phạm Thu Hà', 'Duyệt', 'Đã được phê duyệt cấp 2 (HOD/Admin)')],
  },
  {
    id: 'r12', code: 'ONS_20261026_0001', projectId: 'P1', employeeId: 'E2', hodStatus: 'REJECTED', status: 'REJECTED', hodApprovedAt: '2026-11-10T08:30', hodApprovedBy: 'Phạm Thu Hà',
    approvedAt: '2026-11-10T08:30', approveBy: 'Phạm Thu Hà', createdAt: '2026-10-26T09:00', createdBy: 'Trần Minh Quân', creatorId: 'u-pm',
    isLocked: false, address: 'Hội sở Ngân hàng A, Hà Nội', zone: 'HN_LT30', regType: 0, description: 'Hỗ trợ chạy song song', hodId: 'u-hod',
    note: 'Khách hàng huỷ lịch, nhân sự làm việc từ xa.', slots: [full('2026-10-27'), full('2026-10-28')],
    history: [log('2026-10-26T09:00', 'Trần Minh Quân', 'Gửi yêu cầu', 'Tạo đơn và gửi yêu cầu'), log('2026-11-06T09:00', 'Phạm Thu Hà', 'Duyệt', 'Đã được phê duyệt cấp 2 (HOD/Admin)'), log('2026-11-10T08:30', 'Phạm Thu Hà', 'Từ chối', 'Đã bị từ chối cấp 2 (HOD/Admin) bởi Phạm Thu Hà, lý do: Khách hàng huỷ lịch, nhân sự làm việc từ xa.')],
  },
  {
    id: 'r13', code: 'ONS_20261106_0001', projectId: 'P1', employeeId: 'E2', hodStatus: 'APPROVED', hodApprovedAt: '2026-11-07T09:40', hodApprovedBy: 'Phạm Thu Hà',
    status: 'APPROVED', approvedAt: '2026-11-07T09:40', approveBy: 'Phạm Thu Hà', createdAt: '2026-11-06T14:00', createdBy: 'Trần Minh Quân', creatorId: 'u-pm',
    isLocked: false, address: 'Hội sở Ngân hàng A, Hà Nội', zone: 'HN_LT30', regType: 0, description: 'Kiểm thử tích hợp', hodId: 'u-hod',
    slots: [full('2026-11-09'), full('2026-11-10')],
    history: [log('2026-11-06T14:00', 'Trần Minh Quân', 'Gửi yêu cầu', 'Tạo đơn và gửi yêu cầu'), log('2026-11-07T09:40', 'Phạm Thu Hà', 'Duyệt', 'Đã được phê duyệt cấp 2 (HOD/Admin)')],
  },
  {
    id: 'r14', code: 'ONS_20261117_0002', projectId: 'P2', employeeId: 'E5', hodStatus: 'APPROVED_PM', status: null, createdAt: '2026-11-17T09:20', createdBy: 'Trần Minh Quân', creatorId: 'u-pm',
    isLocked: false, address: 'Trung tâm điều độ B, Sóc Sơn, Hà Nội', zone: 'HN_GE30', regType: 0, description: 'Hỗ trợ nghiệm thu giai đoạn 1', hodId: 'u-hod',
    slots: [full('2026-11-24'), full('2026-11-25', '08:00', '15:00')],
    history: [log('2026-11-17T09:20', 'Trần Minh Quân', 'Gửi yêu cầu', 'Tạo đơn và gửi yêu cầu (chờ HOD duyệt)')],
  },
  {
    id: 'r15', code: 'ONS_20261110_0001', projectId: 'P2', employeeId: 'E6', hodStatus: 'APPROVED', hodApprovedAt: '2026-11-11T10:30', hodApprovedBy: 'Phạm Thu Hà',
    status: 'APPROVED', approvedAt: '2026-11-11T10:30', approveBy: 'Phạm Thu Hà', createdAt: '2026-11-10T09:00', createdBy: 'Trần Minh Quân', creatorId: 'u-pm',
    isLocked: false, address: 'Trung tâm điều độ B, Sóc Sơn, Hà Nội', zone: 'HN_GE30', regType: 0, description: 'Hỗ trợ cài đặt (thực tập sinh)', hodId: 'u-hod',
    slots: [full('2026-11-12'), full('2026-11-13')],
    history: [log('2026-11-10T09:00', 'Trần Minh Quân', 'Gửi yêu cầu', 'Tạo đơn và gửi yêu cầu (chờ HOD duyệt)'), log('2026-11-11T10:30', 'Phạm Thu Hà', 'Duyệt', 'Đã được phê duyệt cấp 2 (HOD/Admin)')],
  },
];

// ───────────────────────── Phụ lục 03 — mức hỗ trợ onsite Hà Nội ─────────────────────────
/** Phụ lục 03 áp dụng cho ngày onsite từ 01/11/2026 (đã xác nhận). Trước đó: 100.000 đ/ngày cho mọi đơn. */
export const RULE_FROM = '2026-11';
export const OLD_RATE = 100_000;
export const RATE: Record<SiteZone, number> = { HN_LT30: 100_000, HN_GE30: 180_000, OUT_HN: 0 };
export const ZONE_LABEL: Record<SiteZone, string> = {
  HN_LT30: 'Hà Nội — cách trụ sở dưới 30km', HN_GE30: 'Hà Nội — cách trụ sở từ 30km', OUT_HN: 'Ngoài Hà Nội (không thuộc Phụ lục 03)',
};
export const ZONE_SHORT: Record<SiteZone, string> = { HN_LT30: '< 30km', HN_GE30: '≥ 30km', OUT_HN: 'Ngoài HN' };
export const ELIGIBLE_CONTRACTS: Contract[] = ['Thử việc', 'Chính thức'];
export const HCNS_MAIL = 'hcns@vtxgroup.vn';

/** Mức hỗ trợ / ngày công của một đơn cho một ngày onsite; rate = 0 kèm lý do khi không được hưởng. */
export function rateOf(r: OnsiteRec, date: string): { rate: number; why?: string } {
  if (date.slice(0, 7) < RULE_FROM) return { rate: OLD_RATE, why: 'Trước ngày áp dụng Phụ lục 03 — mức cũ 100.000 đ' };
  const c = emp(r.employeeId).contract;
  if (!ELIGIBLE_CONTRACTS.includes(c)) return { rate: 0, why: `Hợp đồng ${c} — chỉ HĐ thử việc / chính thức được hỗ trợ` };
  if (r.zone === 'OUT_HN') return { rate: 0, why: 'Ngoài Hà Nội — không thuộc Phụ lục 03' };
  return { rate: RATE[r.zone] };
}
/** Mức áp cho đơn (theo ngày đầu) — dùng hiển thị trên grid / form. */
export const recRate = (r: OnsiteRec) => rateOf(r, startDate(r));

// ───────────────────────── Chốt onsite (Báo cáo Onsite › Approve) ─────────────────────────
/** Kỳ chốt onsite theo tháng — chốt ở Báo cáo Onsite; Payroll chỉ đọc số đã chốt. */
export interface ClosingDay { date: string; hours: number; leave: number; valid: number; unit: number; rate: number; amount: number; carry: boolean; recIds: string[] }
export interface ClosingLine {
  employeeId: string;
  /** Ngày công trong tháng theo mức */
  unitsLT30: number; unitsGE30: number;
  /** Ngày công tháng trước duyệt muộn, chốt bổ sung vào tháng này */
  carryUnits: number; carryAmount: number;
  /** Ngày onsite không được tính tiền (ngoài HN, HĐ không đủ điều kiện, chưa đủ 1 ngày công) */
  noPayDays: number;
  units: number; amount: number; detail: ClosingDay[];
}
export interface OnsiteClosing {
  id: string; year: number; month: number;
  status: 'OPEN' | 'APPROVED';
  approvedAt?: string; approvedBy?: string;
  /** Số đã chốt — Payroll đọc thẳng. */
  saved?: ClosingLine[];
}
export const closingName = (c: { month: number; year: number }) => `${String(c.month).padStart(2, '0')}/${c.year}`;
export const closingIdOf = (y: number, m: number) => `OC-${y}-${String(m).padStart(2, '0')}`;
/** HCNS và Admin được chốt / mở lại chốt (đã xác nhận — quyền mới Report_Onsite.Approve). */
export const canCloseOnsite = (role: RoleKey) => role === 'hr' || role === 'admin';

// ───────────────────────── Quyền tạo đơn onsite (đề xuất) ─────────────────────────
/** Chỉ PM dự án, HOD, HR, Admin được tạo đơn; nhân viên thường và PMO không tự tạo (code hiện cho cả PMO). */
export const ONSITE_CREATE_ROLES: RoleKey[] = ['pm', 'hod', 'hr', 'admin'];
export const canCreateOnsite = (role: RoleKey) => ONSITE_CREATE_ROLES.includes(role);
/** Dự án được chọn khi tạo: PM chỉ dự án mình làm PM; HOD dự án thuộc khối mình hoặc dự án khối khác mà mình làm PM; HR / Admin mọi dự án còn hoạt động. */
export function creatableProjects(role: RoleKey, userId: string) {
  const hodOrg = HODS.find((h) => h.id === userId)?.org;
  return PROJECTS.filter((p) => p.active && (
    role === 'pm' ? p.pmId === userId
      : role === 'hod' ? p.org === hodOrg || p.pmId === userId
        : role === 'hr' || role === 'admin'));
}

/** Chi tiết ngày của kỳ chốt mẫu đã chốt (đủ 8h, mức cũ 100.000 đ — trước ngày áp dụng Phụ lục 03). */
const seedDays = (dates: string[], recId: string): ClosingDay[] =>
  dates.map((date) => ({ date, hours: 8, leave: 0, valid: 8, unit: 1, rate: 100_000, amount: 100_000, carry: false, recIds: [recId] }));

export const INIT_CLOSINGS: OnsiteClosing[] = [
  { id: 'OC-2026-09', year: 2026, month: 9, status: 'APPROVED', approvedAt: '2026-10-04T16:00', approvedBy: 'Đỗ Mai Anh',
    saved: [{ employeeId: 'E4', unitsLT30: 5, unitsGE30: 0, carryUnits: 0, carryAmount: 0, noPayDays: 0, units: 5, amount: 500_000, detail: seedDays(['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25'], 'r8') }] },
  { id: 'OC-2026-10', year: 2026, month: 10, status: 'APPROVED', approvedAt: '2026-11-04T17:00', approvedBy: 'Đỗ Mai Anh',
    saved: [{ employeeId: 'E1', unitsLT30: 5, unitsGE30: 0, carryUnits: 0, carryAmount: 0, noPayDays: 0, units: 5, amount: 500_000, detail: seedDays(['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09'], 'r1') }] },
  { id: 'OC-2026-11', year: 2026, month: 11, status: 'OPEN' },
];

const ymOf = (y: number, m: number) => `${y}-${String(m).padStart(2, '0')}`;
export const recMonth = (r: OnsiteRec) => startDate(r).slice(0, 7);

/** Một đơn có vào kỳ chốt tháng (y, m) không: đơn trong tháng, hoặc đơn tháng trước duyệt muộn sau khi tháng đó đã chốt. */
export function evalClosing(r: OnsiteRec, closings: OnsiteClosing[], y: number, m: number) {
  const ym = ymOf(y, m), id = closingIdOf(y, m), rm = recMonth(r);
  if (r.closingId && r.closingId !== id) return { ok: false, carry: false, why: `Đã chốt ở kỳ ${r.closingId.slice(3).split('-').reverse().join('/')}` };
  if (r.hodStatus !== 'APPROVED' || r.status !== 'APPROVED') return { ok: false, carry: false, why: `Chưa được HOD duyệt (${HOD_LABEL[r.hodStatus]})` };
  if (rm > ym) return { ok: false, carry: false, why: 'Thuộc tháng sau' };
  if (rm === ym) return { ok: true, carry: false, why: 'Onsite trong tháng' };
  const own = closings.find((c) => c.id === closingIdOf(Number(rm.slice(0, 4)), Number(rm.slice(5, 7))));
  if (!own || own.status !== 'APPROVED') return { ok: false, carry: false, why: `Tháng ${rm.slice(5)}/${rm.slice(0, 4)} chưa chốt — đơn thuộc kỳ chốt của tháng đó` };
  return { ok: true, carry: true, why: `Duyệt muộn sau khi đã chốt tháng ${rm.slice(5)}/${rm.slice(0, 4)} ⇒ chốt bổ sung vào kỳ này` };
}

/** Tính bảng chốt: gộp (nhân viên, ngày) → trừ giờ phép → đủ 8h = 1 ngày công, chưa đủ 1 ngày công thì không tính tiền
 *  (áp cho mọi ngày, kể cả ngày trước RULE_FROM tính bổ sung) → × mức hỗ trợ cao nhất trong ngày. */
export function computeClosing(records: OnsiteRec[], closings: OnsiteClosing[], y: number, m: number): ClosingLine[] {
  const inc = records.filter((r) => evalClosing(r, closings, y, m).ok);
  const byEmp = new Map<string, Map<string, { hours: number; rate: number; carry: boolean; recIds: string[]; paid: boolean }>>();
  inc.forEach((r) => {
    const days = byEmp.get(r.employeeId) || new Map();
    const carry = recMonth(r) !== ymOf(y, m);
    r.slots.forEach((s) => {
      const { rate } = rateOf(r, s.date);
      const d = days.get(s.date) || { hours: 0, rate: 0, carry, recIds: [], paid: false };
      if (rate > 0) { d.hours += s.hours; d.rate = Math.max(d.rate, rate); d.paid = true; }
      d.recIds.push(r.id);
      days.set(s.date, d);
    });
    byEmp.set(r.employeeId, days);
  });
  return [...byEmp.entries()].map(([eid, days]) => {
    const detail: ClosingDay[] = [...days.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, d]) => {
      const leave = LEAVES.filter((l) => l.employeeId === eid).reduce((s, l) => s + leaveHoursOnDate(l.start, l.end, l.totalHours, date), 0);
      const valid = Math.min(d.hours, Math.max(0, 8 - leave));
      const unit = !d.paid ? 0 : valid >= 8 ? 1 : 0;
      return { date, hours: d.hours, leave, valid, unit, rate: d.rate, amount: unit * d.rate, carry: d.carry, recIds: d.recIds };
    });
    const cur = detail.filter((d) => !d.carry), car = detail.filter((d) => d.carry);
    const sum = (a: ClosingDay[], f: (d: ClosingDay) => number) => a.reduce((s, d) => s + f(d), 0);
    return {
      employeeId: eid,
      unitsLT30: sum(cur.filter((d) => d.rate > 0 && d.rate < RATE.HN_GE30), (d) => d.unit),
      unitsGE30: sum(cur.filter((d) => d.rate >= RATE.HN_GE30), (d) => d.unit),
      carryUnits: sum(car, (d) => d.unit), carryAmount: sum(car, (d) => d.amount),
      noPayDays: detail.filter((d) => d.amount === 0).length,
      units: sum(detail, (d) => d.unit), amount: sum(detail, (d) => d.amount), detail,
    };
  }).sort((a, b) => emp(a.employeeId).code.localeCompare(emp(b.employeeId).code));
}

// ───────────────────────── Payroll ─────────────────────────
/** Phụ cấp onsite trong bảng lương = số đã chốt ở Báo cáo Onsite cùng tháng (không tự tính, không gắn đơn). */
export function payrollFromClosing(closings: OnsiteClosing[], y: number, m: number): { closing?: OnsiteClosing; lines: ClosingLine[] } {
  const c = closings.find((x) => x.id === closingIdOf(y, m));
  return { closing: c, lines: c?.status === 'APPROVED' ? c.saved || [] : [] };
}

// ───────────────────────── Báo cáo Onsite: trạng thái đơn ─────────────────────────
export type ReportStatus = 'Approved' | 'Requested' | 'Rejected' | 'Draft';
/** OnsiteReportComponent.GetStatusName */
export function reportStatus(status: PmoSt, hod: HodSt): ReportStatus {
  if (status === 'APPROVED') return 'Approved';
  if (hod === 'REQUESTED' || hod === 'APPROVED_PM') return 'Requested';
  if (status === 'REJECTED' || hod === 'REJECTED' || hod === 'REJECTED_PM') return 'Rejected';
  return 'Draft';
}
