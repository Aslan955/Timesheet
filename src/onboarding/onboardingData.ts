/**
 * Bàn giao onboard (TA → HCNS) — kiểu dữ liệu, danh mục, dữ liệu mẫu.
 *
 * Bám code thật (iMIS):
 *  - Phiếu = 1 lần TA "Gửi thông tin sang HCNS" (RecruitmentHcnsHandoff) + Onboarding Request sinh kèm.
 *  - 17 trường form HCNS giữ đúng nghĩa/ràng buộc của RecruitmentSendMailPopup.razor.
 *  - Trạng thái thật của Onboarding Request: Pending / Approved / Rejected.
 *
 * Đề xuất mới trong prototype (chưa có trong code):
 *  - Phiếu có trạng thái theo dõi được ở cả hai phía (TA thấy HCNS đã duyệt chưa, ai duyệt).
 *  - HCNS "Trả lại TA bổ sung" (không phải từ chối hẳn).
 *  - Lương / thử việc / địa điểm / người duyệt / bằng chứng / refer đi theo phiếu sang HCNS (code thật chỉ nằm trong mail).
 *  - Checklist onboard + trạng thái tạo tài khoản hiển thị ngay trên phiếu.
 */

export type OnbStatus = 'Chờ HCNS duyệt' | 'Đang onboard' | 'Đã onboard' | 'Cancel offer' | 'Huỷ onboard' | 'HCNS từ chối';

export const ONB_STATUSES: OnbStatus[] = ['Chờ HCNS duyệt', 'Đang onboard', 'Đã onboard', 'Cancel offer', 'Huỷ onboard', 'HCNS từ chối'];

/** Ánh xạ sang trạng thái Onboarding Request trong code thật (hiện cạnh nhãn để BA đối chiếu). */
export const ONB_STATUS_REAL: Record<OnbStatus, string> = {
  'Chờ HCNS duyệt': 'Pending',
  'Đang onboard': 'Approved',
  'Đã onboard': 'Approved · Stage Onboarded',
  'Cancel offer': 'Rejected (HCNS cancel offer)',
  'Huỷ onboard': 'Rejected (TA báo huỷ)',
  'HCNS từ chối': 'Rejected',
};

export type OnbRole = 'TA' | 'HCNS' | 'Ứng viên' | 'IT' | 'MarCom';

// ==========================================================================
// 17 trường TA bàn giao
// ==========================================================================
export interface HandoffData {
  startDate: string; // 1. Ngày bắt đầu làm việc (yyyy-mm-dd)
  fullName: string; // 2
  position: string; // 3. Vị trí chức danh (danh mục HR)
  techStack: string; // 4. danh mục Skill
  level: string; // 5. danh mục Level HR
  department: string; // 6. Bộ phận — cây con của khối trong Yêu cầu
  manager: string; // 7. Quản lý trực tiếp (nhân sự)
  workLocation: string; // 8. 10 địa điểm cố định
  officialSalary: number | ''; // 9. Gross
  probationMonths: number | ''; // 10. 0–12
  probationPercent: number | ''; // 11. bắt buộc khi số tháng > 0
  approver: string; // 12. Người phê duyệt offer (nhân sự)
  evidenceFile: string; // 13. Bằng chứng phê duyệt (tuỳ chọn) — đính kèm mail
  cvLink: string; // 14. bắt buộc trừ khi hồ sơ có file CV
  referBonus: number | ''; // 15. chỉ khi Nguồn = Refer
  referRecipient: string; // 16. chỉ khi Nguồn = Refer, bắt buộc là nhân sự
  note: string; // 17
}

export type HandoffKey = keyof HandoffData;

export const HANDOFF_LABELS: Record<HandoffKey, string> = {
  startDate: 'Ngày bắt đầu làm việc',
  fullName: 'Họ tên ứng viên',
  position: 'Vị trí chức danh',
  techStack: 'Tech Stack',
  level: 'Level',
  department: 'Bộ phận',
  manager: 'Quản lý trực tiếp',
  workLocation: 'Địa điểm làm việc',
  officialSalary: 'Lương chính thức (Gross)',
  probationMonths: 'Thời gian thử việc',
  probationPercent: 'Tỉ lệ lương thử việc',
  approver: 'Người phê duyệt Offer',
  evidenceFile: 'Bằng chứng phê duyệt',
  cvLink: 'Link CV',
  referBonus: 'Mức thưởng refer',
  referRecipient: 'Người nhận tiền refer',
  note: 'Ghi chú',
};

export const HANDOFF_KEYS = Object.keys(HANDOFF_LABELS) as HandoffKey[];

export const emptyHandoff = (): HandoffData => ({
  startDate: '',
  fullName: '',
  position: '',
  techStack: '',
  level: '',
  department: '',
  manager: '',
  workLocation: '',
  officialSalary: '',
  probationMonths: 2,
  probationPercent: 85,
  approver: '',
  evidenceFile: '',
  cvLink: '',
  referBonus: '',
  referRecipient: '',
  note: '',
});

// ==========================================================================
// Danh mục (HR) — cùng nguồn form Onboarding Request
// ==========================================================================
export const WORK_LOCATIONS = ['HN - HO', 'HN - VCB', 'HN - VTB', 'HN - MBB', 'HN - SST', 'HN - VNI', 'HN - BIDV', 'HN - VTS', 'HN - LPB', 'HCM - HDB'];

export const HR_POSITIONS = [
  'Software Developer', 'Business Analyst', 'Data Analyst', 'Data Engineer', 'DevOps Engineer', 'Tester',
  'Product Designer', 'UI/UX Designer', 'Project Manager', 'Delivery Manager', 'IT Support', 'Accountant', 'Techlead',
];

/** Level HR — không có Manager/Head/Chief/Director (code thật để trống cho HR điền). */
export const HR_LEVELS = ['Intern', 'Fresher', 'Junior', 'Middle', 'Senior', 'Lead'];

export const DEPARTMENTS_BY_BLOCK: Record<string, string[]> = {
  G1: ['G1 · Phòng Phát triển phần mềm 1', 'G1 · Phòng Core Banking'],
  G2: ['G2 · Phòng Dữ liệu & Phân tích', 'G2 · Phòng Delivery'],
  G3: ['G3 · Phòng Hạ tầng', 'G3 · Phòng Hỗ trợ CNTT'],
  G4: ['G4 · Phòng Phát triển phần mềm 4', 'G4 · Phòng Tài chính - Kế toán'],
  BFSI: ['BFSI · Phòng Giải pháp', 'BFSI · Phòng DevOps & Cloud', 'BFSI · Phòng Phân tích nghiệp vụ'],
};

/** Phòng ban theo khối của Yêu cầu (khối lưu dạng "Khối G1"). */
export const departmentsOf = (block: string) => DEPARTMENTS_BY_BLOCK[block.replace(/^Khối\s+/, '')] || Object.values(DEPARTMENTS_BY_BLOCK).flat();

export interface Staff {
  code: string;
  name: string;
  title: string;
}
export const STAFF: Staff[] = [
  { code: 'NV0102', name: 'Trịnh Văn Hưng', title: 'Giám đốc khối G1' },
  { code: 'NV0118', name: 'Phạm Thị Lan', title: 'Trưởng phòng Dữ liệu' },
  { code: 'NV0125', name: 'Đỗ Quốc Việt', title: 'Techlead Core Banking' },
  { code: 'NV0131', name: 'Lương Minh Đức', title: 'Giám đốc khối BFSI' },
  { code: 'NV0144', name: 'Nguyễn Hải Đăng', title: 'Trưởng phòng DevOps' },
  { code: 'NV0157', name: 'Vương Thị Hạnh', title: 'Kế toán trưởng' },
  { code: 'NV0163', name: 'Cao Tiến Dũng', title: 'Delivery Manager G4' },
  { code: 'NV0170', name: 'Hồ Tú Anh', title: 'Technical Recruiter' },
  { code: 'NV0001', name: 'Tạ Quang Minh', title: 'CEO' },
  { code: 'NV0008', name: 'Mai Thanh Tâm', title: 'Giám đốc Nhân sự' },
];
export const STAFF_NAMES = STAFF.map((s) => s.name);

export const CONTRACT_TYPES = ['Thử việc', 'HĐLĐ xác định thời hạn 12 tháng', 'HĐLĐ không xác định thời hạn', 'Cộng tác viên'];

/** Hộp thư HCNS: SystemConfig Recruitment.HcnsHandoffTo → fallback Email:HR. */
export const HCNS_MAILBOX = 'hcns@company.vn';

// ==========================================================================
// Checklist onboard — 11 mục tạo khi HCNS duyệt (OnboardingRequestCruService)
// ==========================================================================
export type ChecklistOwner = 'Phòng ban' | 'IT' | 'HCTH';
export interface ChecklistItem {
  id: string;
  owner: ChecklistOwner;
  item: string;
  done: boolean;
  doneBy?: string;
  doneAt?: string;
}
export const CHECKLIST_TEMPLATE: { owner: ChecklistOwner; item: string }[] = [
  { owner: 'Phòng ban', item: 'Địa điểm làm việc' },
  { owner: 'Phòng ban', item: 'Thiết bị' },
  { owner: 'Phòng ban', item: 'Chỗ ngồi' },
  { owner: 'Phòng ban', item: 'Giới thiệu môi trường làm việc' },
  { owner: 'IT', item: 'Confirm thiết bị' },
  { owner: 'IT', item: 'Tạo email công ty' },
  { owner: 'IT', item: 'Tạo user / pass' },
  { owner: 'IT', item: 'Phân quyền hệ thống' },
  { owner: 'HCTH', item: 'Thẻ xe' },
  { owner: 'HCTH', item: 'Thẻ thang máy' },
  { owner: 'HCTH', item: 'Sổ, bút, cốc nước' },
];
export const buildChecklist = (doneCount = 0, by = 'HCNS', at = ''): ChecklistItem[] =>
  CHECKLIST_TEMPLATE.map((t, i) => ({ id: `ck${i + 1}`, ...t, done: i < doneCount, ...(i < doneCount ? { doneBy: by, doneAt: at } : {}) }));

// ==========================================================================
// Phiếu bàn giao
// ==========================================================================
export interface FieldChange {
  field: string;
  from: string;
  to: string;
}
export interface OnbHistory {
  at: string; // ISO
  by: string;
  role: OnbRole | 'Hệ thống';
  action: string;
  note?: string;
  changes?: FieldChange[];
}
export interface OnbMail {
  at: string;
  kind:
    | 'Gửi thông tin sang HCNS' | 'Cập nhật thông tin onboard' | 'Báo huỷ onboard' | 'HCNS từ chối'
    | 'Form onboarding cho ứng viên' | 'Nhắc điền form thông tin' | 'Mail IT cấp tài khoản' | 'IT trả thông tin tài khoản' | 'Thông báo MarCom'
    | 'Email onboard cho ứng viên' | 'Cancel offer';
  subject: string;
  to: string;
  cc: string[];
  attachments: string[];
}
export interface OnbAccount {
  status: 'Chưa tạo' | 'Đang tạo' | 'Đã tạo';
  employeeCode?: string;
  userName?: string;
  companyEmail?: string;
}

// ==========================================================================
// Luồng sau khi HCNS Accept (4 bên: HCNS · Ứng viên · IT · MarCom)
//  1. Accept → tạo hồ sơ Employees + gửi link form thông tin cá nhân cho ứng viên
//  2. Ứng viên submit form → đổ dữ liệu vào Employees, ĐỒNG THỜI gửi yêu cầu IT (Họ tên, Khối, Cấp trên trực tiếp, Công ty)
//  3. IT trả thông tin tài khoản: email, tên tài khoản, mật khẩu → ghi vào hồ sơ, báo MarCom
//  4. MarCom chuẩn bị Welcome Onboard
// ==========================================================================
export type TaskStatus = 'Chưa bắt đầu' | 'Đang thực hiện' | 'Đã hoàn thành';
export type TaskKey = 'employee' | 'personalForm' | 'itAccount' | 'marcom' | 'onboardMail';
export const TASK_ORDER: TaskKey[] = ['employee', 'personalForm', 'itAccount', 'marcom', 'onboardMail'];
/** Giờ gửi email onboard tới ứng viên vào ngày onboard. */
export const ONBOARD_MAIL_HOUR = '08';
export const onboardMailAt = (startDate: string) => `${startDate}T${ONBOARD_MAIL_HOUR}:00:00`;
export const TASK_DEFS: Record<TaskKey, { name: string; owner: string; done: string }> = {
  employee: { name: 'Tạo nhân viên trong Employees', owner: 'Hệ thống', done: 'Tạo ngay khi HCNS Accept — trạng thái Thử việc' },
  personalForm: { name: 'Form thông tin cá nhân trước onboard', owner: 'Ứng viên', done: 'Ứng viên submit form — dữ liệu đổ vào hồ sơ Employees' },
  itAccount: { name: 'IT cấp tài khoản', owner: 'Phòng IT', done: 'IT trả email, tên tài khoản, mật khẩu' },
  marcom: { name: 'Welcome Onboard', owner: 'Phòng MarCom', done: 'MarCom xác nhận đã chuẩn bị Welcome' },
  onboardMail: { name: `Email onboard gửi ứng viên ${ONBOARD_MAIL_HOUR}:00 ngày onboard`, owner: 'Hệ thống', done: 'Gửi xong → phiếu chuyển Đã onboard' },
};
export const IT_MAILBOX = 'it@company.vn';
export const MARCOM_MAILBOX = 'marcom@company.vn';
export const IT_STAFF = ['Đỗ Văn Khánh (IT)', 'Hoàng Minh Long (IT)', 'IT Helpdesk'];
export const MARCOM_STAFF = ['Vũ Thu Trang (MarCom)', 'Lê Ngọc Ánh (MarCom)'];
export const COMPANIES = ['AEQUITAS', 'VTX GROUP'];
export const COMPANY_DOMAIN = 'aequitas.com.vn';
const COMPANY_DOMAINS: Record<string, string> = { AEQUITAS: 'aequitas.com.vn', 'VTX GROUP': 'vtxgroup.com.vn' };
export const domainOf = (company: string) => COMPANY_DOMAINS[company] || COMPANY_DOMAIN;
/** Gợi ý tên tài khoản: tên + chữ cái đầu họ đệm (Lê Quang Huy → huylq). */
export const accountNameOf = (fullName: string) => {
  const parts = fullName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().split(/\s+/).filter(Boolean);
  return parts.length ? `${parts[parts.length - 1]}${parts.slice(0, -1).map((x) => x[0]).join('')}` : 'newuser';
};
/** Mật khẩu tạm ngẫu nhiên (bắt buộc đổi ở lần đăng nhập đầu). */
export const genPassword = () => {
  const pick = (set: string, n: number) => Array.from({ length: n }, () => set[Math.floor(Math.random() * set.length)]).join('');
  return `${pick('ABCDEFGHJKLMNPQRSTUVWXYZ', 1)}${pick('abcdefghijkmnpqrstuvwxyz', 4)}#${pick('23456789', 3)}${pick('ABCDEFGHJKLMNPQRSTUVWXYZ', 1)}`;
};
/** Link form thông tin cá nhân gửi ứng viên (mỗi phiếu 1 mã). */
export const formLinkOf = (id: string) => `https://imis.${COMPANY_DOMAIN}/onboard/form/${id.toLowerCase()}`;

/** Các trường ứng viên điền trên form (đổ về hồ sơ Employees). */
export type FormFieldDef = { key: string; label: string; group: string; type?: 'date' | 'select' | 'tel'; options?: string[]; required?: boolean; full?: boolean };
export const FORM_FIELDS: FormFieldDef[] = [
  { key: 'birthDate', label: 'Ngày sinh', group: 'Thông tin cơ bản', type: 'date', required: true },
  { key: 'gender', label: 'Giới tính', group: 'Thông tin cơ bản', type: 'select', options: ['Nam', 'Nữ', 'Khác'], required: true },
  { key: 'maritalStatus', label: 'Tình trạng hôn nhân', group: 'Thông tin cơ bản', type: 'select', options: ['Độc thân', 'Đã kết hôn'] },
  { key: 'phone', label: 'Số điện thoại', group: 'Thông tin cơ bản', type: 'tel', required: true },
  { key: 'idNo', label: 'Số CCCD', group: 'Giấy tờ & thuế', required: true },
  { key: 'idDate', label: 'Ngày cấp', group: 'Giấy tờ & thuế', type: 'date', required: true },
  { key: 'idPlace', label: 'Nơi cấp', group: 'Giấy tờ & thuế', required: true },
  { key: 'taxCode', label: 'Mã số thuế cá nhân', group: 'Giấy tờ & thuế' },
  { key: 'socialInsNo', label: 'Số sổ BHXH', group: 'Giấy tờ & thuế' },
  { key: 'permanentAddress', label: 'Địa chỉ thường trú', group: 'Địa chỉ', required: true, full: true },
  { key: 'currentAddress', label: 'Địa chỉ hiện tại', group: 'Địa chỉ', required: true, full: true },
  { key: 'bankAccount', label: 'Số tài khoản', group: 'Ngân hàng nhận lương', required: true },
  { key: 'bankName', label: 'Ngân hàng', group: 'Ngân hàng nhận lương', required: true },
  { key: 'education', label: 'Trình độ', group: 'Học vấn', type: 'select', options: ['Trung cấp', 'Cao đẳng', 'Cử nhân', 'Kỹ sư', 'Thạc sĩ', 'Tiến sĩ'] },
  { key: 'school', label: 'Trường', group: 'Học vấn' },
  { key: 'major', label: 'Chuyên ngành', group: 'Học vấn' },
];
export const FORM_GROUPS = [...new Set(FORM_FIELDS.map((f) => f.group))];

/** Yêu cầu gửi IT (tự gửi khi ứng viên submit form). */
export interface ItRequest {
  fullName: string;
  block: string;
  manager: string;
  company: string;
  sentAt: string;
}
/** Thông tin IT trả về. */
export interface ItReturn {
  email: string;
  accountName: string;
  password: string;
  by: string;
  at: string;
  note?: string;
}

export interface OnbTask {
  key: TaskKey;
  status: TaskStatus;
  startedAt?: string;
  doneAt?: string;
  doneBy?: string;
  /** Dòng mô tả kết quả / đang chờ gì */
  detail?: string;
  reminders?: number;
  /** Form: link đã gửi + dữ liệu ứng viên đã submit */
  formLink?: string;
  formData?: Record<string, string>;
  /** IT */
  itReq?: ItRequest;
  itRet?: ItReturn;
}
export const taskOf = (r: Pick<OnbRecord, 'tasks'>, k: TaskKey): OnbTask => r.tasks?.find((t) => t.key === k) || { key: k, status: 'Chưa bắt đầu' };
export const tasksDone = (r: Pick<OnbRecord, 'tasks'>) => TASK_ORDER.filter((k) => taskOf(r, k).status === 'Đã hoàn thành').length;

export interface OnbRecord {
  id: string; // ONB-yyyy-NNN
  candidateId: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateSource: string;
  cvFile: string;
  requestId: string;
  block: string;
  /** Công ty ký HĐ (gửi kèm yêu cầu IT) */
  company: string;
  taPic: string;
  taPic2: string;
  data: HandoffData;
  /** Trường đổi ở lần gửi gần nhất (để HCNS thấy ngay) */
  lastChanges: FieldChange[];
  version: number; // số lần TA gửi
  status: OnbStatus;
  sentAt: string;
  sentBy: string;
  // HCNS
  contractType: string;
  hrNote: string;
  decidedBy?: string;
  decidedAt?: string;
  returnReason?: string;
  cancelReason?: string;
  /** HCNS Cancel offer (ứng viên báo không nhận việc) */
  cancelledBy?: string;
  cancelledAt?: string;
  account: OnbAccount;
  checklist: ChecklistItem[];
  /** Tiến độ sau khi duyệt (rỗng khi chưa duyệt) */
  tasks?: OnbTask[];
  mails: OnbMail[];
  history: OnbHistory[];
}

// ==========================================================================
// Helper
// ==========================================================================
export const money = (v: number | '' | undefined) => (v === '' || v == null ? '' : `${Number(v).toLocaleString('vi-VN')} ₫`);
export const dmy = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
};
export const dmyhm = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};
export const todayIso = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
/** Số ngày từ hôm nay tới ngày onboard (âm = đã qua). */
export const daysUntil = (iso: string) => {
  if (!iso) return null;
  const a = new Date(`${todayIso()}T00:00:00`).getTime();
  const b = new Date(`${iso.slice(0, 10)}T00:00:00`).getTime();
  return Math.round((b - a) / 86400000);
};

export const isRefer = (source: string) => source.trim().toLowerCase() === 'refer';

/** Hiển thị 1 trường dạng chuỗi (dùng cho diff, mail, bảng). */
export const fieldText = (k: HandoffKey, d: HandoffData): string => {
  const v = d[k];
  if (v === '' || v == null) return '';
  if (k === 'startDate') return dmy(String(v));
  if (k === 'officialSalary' || k === 'referBonus') return money(v as number);
  if (k === 'probationMonths') return `${v} tháng`;
  if (k === 'probationPercent') return `${v}%`;
  return String(v);
};

export const probationSalary = (d: HandoffData) =>
  d.officialSalary === '' || d.probationPercent === '' ? '' : Math.round((Number(d.officialSalary) * Number(d.probationPercent)) / 100);

/** Kiểm trường bắt buộc phía TA — trả về { key: thông báo }. */
export const validateHandoff = (d: HandoffData, opts: { hasCvFile: boolean; refer: boolean }): Partial<Record<HandoffKey, string>> => {
  const e: Partial<Record<HandoffKey, string>> = {};
  const req: HandoffKey[] = ['startDate', 'fullName', 'position', 'techStack', 'level', 'department', 'manager', 'workLocation', 'officialSalary', 'probationMonths', 'approver'];
  req.forEach((k) => {
    if (d[k] === '' || d[k] == null || (typeof d[k] === 'string' && !(d[k] as string).trim())) e[k] = 'Bắt buộc';
  });
  if (d.officialSalary !== '' && Number(d.officialSalary) <= 0) e.officialSalary = 'Phải lớn hơn 0';
  if (d.probationMonths !== '' && (Number(d.probationMonths) < 0 || Number(d.probationMonths) > 12)) e.probationMonths = 'Từ 0 đến 12 tháng';
  if (Number(d.probationMonths) > 0 && d.probationPercent === '') e.probationPercent = 'Bắt buộc khi có thử việc';
  if (d.probationPercent !== '' && (Number(d.probationPercent) < 0 || Number(d.probationPercent) > 100)) e.probationPercent = 'Từ 0 đến 100%';
  if (!opts.hasCvFile && !d.cvLink.trim()) e.cvLink = 'Bắt buộc (hồ sơ chưa có file CV)';
  if (opts.refer && d.referBonus !== '' && !d.referRecipient) e.referRecipient = 'Chọn nhân sự nhận tiền refer';
  return e;
};

/** Trường bắt buộc phía HCNS trước khi duyệt (OnboardingRequestRules.MissingApprovalFields) — Loại HĐ không chặn. */
export const missingForApprove = (r: Pick<OnbRecord, 'data' | 'contractType'>): string[] => {
  const m: string[] = [];
  if (!r.data.startDate) m.push('Ngày onboard');
  if (!r.data.department) m.push('Phòng ban');
  if (!r.data.position) m.push('Vị trí');
  if (!r.data.level) m.push('Cấp bậc');
  if (!r.data.manager) m.push('Quản lý trực tiếp');
  return m;
};

export const diffHandoff = (prev: HandoffData, next: HandoffData): FieldChange[] =>
  HANDOFF_KEYS.filter((k) => fieldText(k, prev) !== fieldText(k, next)).map((k) => ({ field: HANDOFF_LABELS[k], from: fieldText(k, prev), to: fieldText(k, next) }));

/** Tiến trình 5 bước của phiếu. */
export const ONB_STEPS = [
  { code: '01', name: 'Chuyển ứng viên', owner: 'Tuyển dụng' },
  { code: '02', name: 'Accept / Reject', owner: 'HCNS' },
  { code: '03', name: 'Điền form thông tin', owner: 'Ứng viên' },
  { code: '04', name: 'Cấp tài khoản', owner: 'IT' },
  { code: '05', name: `Welcome & email onboard ${ONBOARD_MAIL_HOUR}:00`, owner: 'MarCom · Hệ thống' },
];
const ok = (r: OnbRecord, k: TaskKey) => taskOf(r, k).status === 'Đã hoàn thành';
export const stepIndex = (r: OnbRecord): number => {
  if (r.status === 'Đã onboard') return 5;
  if (r.status === 'Chờ HCNS duyệt') return 1;
  if (r.status === 'Đang onboard') return !ok(r, 'personalForm') ? 2 : !ok(r, 'itAccount') ? 3 : 4;
  return -1; // huỷ / từ chối / cancel offer
};
/** Bước đang chờ — hiện ở lưới. */
export const waitingOf = (r: OnbRecord): { text: string; owner: string } | null => {
  const i = stepIndex(r);
  if (i < 1 || i > 4) return null;
  if (i === 4) return ok(r, 'marcom') ? { text: `Chờ email onboard ${ONBOARD_MAIL_HOUR}:00`, owner: 'Hệ thống' } : { text: 'Chờ MarCom Welcome', owner: 'MarCom' };
  return { 1: { text: 'Chờ HCNS Accept', owner: 'HCNS' }, 2: { text: 'Chờ ứng viên điền form', owner: 'Ứng viên' }, 3: { text: 'Chờ IT cấp tài khoản', owner: 'IT' } }[i as 1];
};

// ==========================================================================
// Bộ lọc ngày onboard
// ==========================================================================
export type DateRangeKey = '' | 'thisWeek' | 'nextWeek' | 'thisMonth' | 'lastMonth' | 'month';
export const DATE_RANGES: { key: DateRangeKey; label: string }[] = [
  { key: '', label: 'Tất cả' },
  { key: 'thisWeek', label: 'Tuần này' },
  { key: 'nextWeek', label: 'Tuần sau' },
  { key: 'thisMonth', label: 'Tháng này' },
  { key: 'lastMonth', label: 'Tháng trước' },
  { key: 'month', label: 'Tháng tự chọn' },
];
const isoOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
/** Khoảng [từ, đến] (yyyy-mm-dd) — tuần tính Thứ 2 → Chủ nhật. month = 'yyyy-mm' cho Tháng tự chọn. */
export const rangeOf = (key: DateRangeKey, month = ''): [string, string] | null => {
  const t = new Date(`${todayIso()}T00:00:00`);
  const monday = new Date(t);
  monday.setDate(t.getDate() - ((t.getDay() + 6) % 7));
  const week = (n: number): [string, string] => {
    const a = new Date(monday);
    a.setDate(monday.getDate() + 7 * n);
    const b = new Date(a);
    b.setDate(a.getDate() + 6);
    return [isoOf(a), isoOf(b)];
  };
  const mon = (y: number, m: number): [string, string] => [isoOf(new Date(y, m, 1)), isoOf(new Date(y, m + 1, 0))];
  switch (key) {
    case 'thisWeek': return week(0);
    case 'nextWeek': return week(1);
    case 'thisMonth': return mon(t.getFullYear(), t.getMonth());
    case 'lastMonth': return mon(t.getFullYear(), t.getMonth() - 1);
    case 'month': {
      if (!/^\d{4}-\d{2}$/.test(month)) return null;
      const [y, m] = month.split('-').map(Number);
      return mon(y, m - 1);
    }
    default: return null;
  }
};
export const inRange = (iso: string, r: [string, string] | null) => !r || (!!iso && iso >= r[0] && iso <= r[1]);

// ==========================================================================
// Dữ liệu mẫu (giả lập) — ngày onboard tính theo hôm nay để bộ lọc tuần / tháng luôn có dữ liệu
// ==========================================================================
const baseData = (p: Partial<HandoffData>): HandoffData => ({ ...emptyHandoff(), ...p });
const dayFromToday = (n: number) => {
  const d = new Date(`${todayIso()}T00:00:00`);
  d.setDate(d.getDate() + n);
  return isoOf(d);
};
/** Ngày trong tuần (0 = Thứ 2) của tuần hiện tại + w tuần. */
const weekDay = (w: number, dow: number) => {
  const d = new Date(`${todayIso()}T00:00:00`);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + w * 7 + dow);
  return isoOf(d);
};
/** Ngày `day` của tháng hiện tại + m tháng. */
const monthDay = (m: number, day: number) => {
  const t = new Date(`${todayIso()}T00:00:00`);
  return isoOf(new Date(t.getFullYear(), t.getMonth() + m, day));
};
const at = (iso: string, hm: string) => `${iso}T${hm}:00`;

type SeedIn = Pick<OnbRecord, 'id' | 'candidateId' | 'candidateEmail' | 'candidatePhone' | 'candidateSource' | 'cvFile' | 'requestId' | 'block' | 'company' | 'taPic' | 'data'> &
  Partial<OnbRecord>;
const seed = (r: SeedIn): OnbRecord => {
  const sentAt = r.sentAt || at(dayFromToday(-3), '09:30');
  const subject = `[Tuyển dụng → HCNS] Bàn giao nhân sự mới: ${r.data.fullName} - ${r.data.position}`;
  return {
    taPic2: '',
    lastChanges: [],
    version: 1,
    status: 'Chờ HCNS duyệt',
    sentAt,
    sentBy: r.taPic,
    contractType: '',
    hrNote: '',
    account: { status: 'Chưa tạo' },
    checklist: [],
    mails: [{ at: sentAt, kind: 'Gửi thông tin sang HCNS', subject, to: HCNS_MAILBOX, cc: [r.taPic], attachments: r.cvFile ? [r.cvFile] : [] }],
    history: [{ at: sentAt, by: r.taPic, role: 'TA', action: 'Gửi thông tin sang HCNS (email)', note: 'Ứng viên hiện ở màn Onboarding Request · Stage → Offer Accepted' }],
    ...r,
  } as OnbRecord;
};

/** Phiếu đã Accept: dựng sẵn tiến độ tới bước `upTo` (1 = vừa Accept, 2 = đã submit form, 3 = IT đã trả, 4 = MarCom xong, 5 = đã gửi email onboard). */
const accepted = (r: SeedIn, code: string, upTo: 1 | 2 | 3 | 4 | 5, acc: { user: string; pass: string }, decidedAt: string): OnbRecord => {
  const base = seed(r);
  const link = formLinkOf(r.id);
  const t1 = decidedAt;
  const t2 = at(dayFromToday(-2), '20:15');
  const t3 = at(dayFromToday(-1), '10:40');
  const t4 = at(dayFromToday(0), '08:50');
  const email = `${acc.user}@${domainOf(r.company)}`;
  const itReq: ItRequest = { fullName: r.data.fullName, block: r.block, manager: r.data.manager, company: r.company, sentAt: t2 };
  const tasks: OnbTask[] = [
    { key: 'employee', status: 'Đã hoàn thành', startedAt: t1, doneAt: t1, doneBy: 'Hệ thống', detail: `Mã NV ${code} · Thử việc` },
    upTo >= 2
      ? { key: 'personalForm', status: 'Đã hoàn thành', startedAt: t1, doneAt: t2, doneBy: r.data.fullName, formLink: link, formData: { birthDate: '1997-05-20', gender: 'Nam', phone: r.candidatePhone }, detail: 'Đã nhận form — đã cập nhật hồ sơ Employees' }
      : { key: 'personalForm', status: 'Đang thực hiện', startedAt: t1, formLink: link, reminders: 0, detail: `Đã gửi link form tới ${r.candidateEmail} — chờ ứng viên submit` },
    upTo >= 3
      ? { key: 'itAccount', status: 'Đã hoàn thành', startedAt: t2, doneAt: t3, doneBy: IT_STAFF[0], itReq, itRet: { email, accountName: acc.user, password: acc.pass, by: IT_STAFF[0], at: t3 }, detail: `${email} · tài khoản ${acc.user}` }
      : upTo === 2
        ? { key: 'itAccount', status: 'Đang thực hiện', startedAt: t2, itReq, detail: `Đã gửi yêu cầu tới ${IT_MAILBOX} — chờ IT trả thông tin tài khoản` }
        : { key: 'itAccount', status: 'Chưa bắt đầu', detail: 'Tự gửi IT khi ứng viên submit form' },
    upTo >= 4
      ? { key: 'marcom', status: 'Đã hoàn thành', startedAt: t3, doneAt: t4, doneBy: MARCOM_STAFF[0], detail: 'Đã chuẩn bị Welcome Onboard' }
      : upTo === 3
        ? { key: 'marcom', status: 'Đang thực hiện', startedAt: t3, detail: `Đã báo ${MARCOM_MAILBOX} — chờ MarCom chuẩn bị Welcome` }
        : { key: 'marcom', status: 'Chưa bắt đầu', detail: 'Tự báo MarCom khi IT trả tài khoản' },
    upTo >= 5
      ? { key: 'onboardMail', status: 'Đã hoàn thành', startedAt: t1, doneAt: onboardMailAt(r.data.startDate), doneBy: 'Hệ thống', detail: `Đã gửi tới ${r.candidateEmail}` }
      : { key: 'onboardMail', status: 'Đang thực hiện', startedAt: t1, detail: `Lên lịch ${ONBOARD_MAIL_HOUR}:00 ${dmy(r.data.startDate)} tới ${r.candidateEmail}` },
  ];
  const mails: OnbMail[] = [
    ...base.mails,
    { at: t1, kind: 'Form onboarding cho ứng viên', subject: 'Chào mừng bạn gia nhập — vui lòng điền thông tin cá nhân trước ngày nhận việc', to: r.candidateEmail, cc: [HCNS_MAILBOX], attachments: [] },
    ...(upTo >= 2 ? [{ at: t2, kind: 'Mail IT cấp tài khoản' as const, subject: `[Onboarding] Yêu cầu cấp tài khoản: ${r.data.fullName} – ${r.block} – ${r.company}`, to: IT_MAILBOX, cc: [HCNS_MAILBOX], attachments: [] }] : []),
    ...(upTo >= 3
      ? [
          { at: t3, kind: 'IT trả thông tin tài khoản' as const, subject: `[IT] Đã cấp tài khoản cho ${r.data.fullName}`, to: HCNS_MAILBOX, cc: [IT_MAILBOX], attachments: [] },
          { at: t3, kind: 'Thông báo MarCom' as const, subject: `[Onboarding] Nhân sự mới ${r.data.fullName} nhận việc ${dmy(r.data.startDate)} — chuẩn bị Welcome`, to: MARCOM_MAILBOX, cc: [HCNS_MAILBOX], attachments: [] },
        ]
      : []),
    ...(upTo >= 5 ? [{ at: onboardMailAt(r.data.startDate), kind: 'Email onboard cho ứng viên' as const, subject: `Chào mừng ${r.data.fullName} — hôm nay là ngày đầu tiên của bạn`, to: r.candidateEmail, cc: [HCNS_MAILBOX], attachments: [] }] : []),
  ];
  const history: OnbHistory[] = [
    ...base.history,
    { at: t1, by: HCNS_NAME, role: 'HCNS', action: 'Accept ứng viên', note: `Tạo hồ sơ ${code} · gửi link form tới ${r.candidateEmail}` },
    ...(upTo >= 2 ? [{ at: t2, by: r.data.fullName, role: 'Ứng viên' as const, action: 'Submit form thông tin cá nhân', note: `Đổ dữ liệu vào hồ sơ ${code} · gửi yêu cầu IT` }] : []),
    ...(upTo >= 3 ? [{ at: t3, by: IT_STAFF[0], role: 'IT' as const, action: 'Trả thông tin tài khoản', note: `${email} · ${acc.user}` }] : []),
    ...(upTo >= 4 ? [{ at: t4, by: MARCOM_STAFF[0], role: 'MarCom' as const, action: 'Đã chuẩn bị Welcome Onboard' }] : []),
    ...(upTo >= 5 ? [{ at: onboardMailAt(r.data.startDate), by: 'Hệ thống', role: 'Hệ thống' as const, action: `Gửi email onboard tới ${r.candidateEmail} → Đã onboard` }] : []),
  ];
  return {
    ...base,
    status: 'Đang onboard',
    contractType: 'Thử việc',
    decidedBy: HCNS_NAME,
    decidedAt: t1,
    account: upTo >= 3 ? { status: 'Đã tạo', employeeCode: code, userName: acc.user, companyEmail: email } : { status: 'Đang tạo', employeeCode: code },
    checklist: buildChecklist(upTo >= 3 ? 4 : 0, HCNS_NAME, t3),
    tasks,
    mails,
    history,
  };
};

const HCNS_NAME = 'Nguyễn Thị Mai';

export const SEED_RECORDS: OnbRecord[] = [
  // ---- Chờ HCNS Accept / Reject
  seed({
    id: 'ONB-2026-041', candidateId: 'c6', candidateEmail: 'huy.lq@gmail.com', candidatePhone: '0903 112 845', candidateSource: 'ITViec', cvFile: 'CV_LeQuangHuy.pdf',
    requestId: 'rq1', block: 'Khối G1', company: 'AEQUITAS', taPic: 'MenTT', taPic2: 'NhuPTK', sentAt: at(dayFromToday(-4), '09:42'),
    data: baseData({
      startDate: weekDay(0, 3), fullName: 'Lê Quang Huy', position: 'Software Developer', techStack: 'Java', level: 'Senior',
      department: 'G1 · Phòng Core Banking', manager: 'Đỗ Quốc Việt', workLocation: 'HN - VCB', officialSalary: 38000000,
      probationMonths: 2, probationPercent: 85, approver: 'Trịnh Văn Hưng', evidenceFile: 'Phe_duyet_offer_LeQuangHuy.pdf', note: 'Ứng viên cần laptop cấu hình cao (dev Java).',
    }),
  }),
  seed({
    id: 'ONB-2026-042', candidateId: 'c7', candidateEmail: 'ha.nt@gmail.com', candidatePhone: '0978 220 316', candidateSource: 'Refer', cvFile: '',
    requestId: 'rq2', block: 'Khối BFSI', company: 'AEQUITAS', taPic: 'HungNV4', sentAt: at(dayFromToday(-2), '08:15'), version: 2, contractType: 'Thử việc',
    data: baseData({
      startDate: weekDay(1, 0), fullName: 'Ngô Thanh Hà', position: 'Business Analyst', techStack: 'BA', level: 'Fresher',
      department: 'BFSI · Phòng Phân tích nghiệp vụ', manager: 'Lương Minh Đức', workLocation: 'HN - BIDV', officialSalary: 14000000,
      probationMonths: 2, probationPercent: 85, approver: 'Lương Minh Đức', cvLink: 'https://drive.google.com/file/d/ngothanhha-cv', referBonus: 3000000, referRecipient: 'Hồ Tú Anh',
    }),
    lastChanges: [{ field: 'Lương chính thức (Gross)', from: '13.000.000 ₫', to: '14.000.000 ₫' }],
  }),
  seed({
    id: 'ONB-2026-043', candidateId: 'c2', candidateEmail: 'yen.tth@gmail.com', candidatePhone: '0912 333 444', candidateSource: 'Refer', cvFile: 'CV_TranThiHaiYen.pdf',
    requestId: 'rq8', block: 'Khối BFSI', company: 'VTX GROUP', taPic: 'XuanDTT', sentAt: at(dayFromToday(-1), '15:05'),
    data: baseData({
      startDate: weekDay(1, 2), fullName: 'Trần Thị Hải Yến', position: 'DevOps Engineer', techStack: 'DevOps', level: 'Middle',
      department: 'BFSI · Phòng DevOps & Cloud', manager: 'Nguyễn Hải Đăng', workLocation: 'HN - HO', officialSalary: 30000000,
      probationMonths: 2, probationPercent: 85, approver: 'Lương Minh Đức', referBonus: 5000000, referRecipient: 'Hồ Tú Anh',
    }),
  }),
  seed({
    id: 'ONB-2026-044', candidateId: 'c14', candidateEmail: 'thang.cv@gmail.com', candidatePhone: '0981 234 999', candidateSource: 'Headhunt', cvFile: '',
    requestId: 'rq6', block: 'Khối G2', company: 'AEQUITAS', taPic: 'SenNT', sentAt: at(dayFromToday(0), '08:20'),
    data: baseData({
      startDate: monthDay(1, 1), fullName: 'Cao Văn Thắng', position: 'Delivery Manager', techStack: 'DM', level: '',
      department: 'G2 · Phòng Delivery', manager: 'Phạm Thị Lan', workLocation: 'HN - HO', officialSalary: 55000000,
      probationMonths: 2, probationPercent: 100, approver: 'Tạ Quang Minh', cvLink: 'https://drive.google.com/file/d/caovanthang-cv',
    }),
  }),
  // ---- Đã Accept — đang chạy luồng
  accepted(
    seed({
      id: 'ONB-2026-036', candidateId: 'c10', candidateEmail: 'bao.bg@gmail.com', candidatePhone: '0911 095 338', candidateSource: 'Synodus Web', cvFile: 'CV_BuiGiaBao.pdf',
      requestId: 'rq9', block: 'Khối G4', company: 'AEQUITAS', taPic: 'NhuPTK', sentAt: at(dayFromToday(-6), '11:20'),
      data: baseData({
        startDate: weekDay(1, 0), fullName: 'Bùi Gia Bảo', position: 'Software Developer', techStack: 'NodeJS', level: 'Middle',
        department: 'G4 · Phòng Phát triển phần mềm 4', manager: 'Cao Tiến Dũng', workLocation: 'HN - HO', officialSalary: 26000000,
        probationMonths: 2, probationPercent: 85, approver: 'Cao Tiến Dũng',
      }),
    }),
    'NV0420', 1, { user: 'baobg', pass: '' }, at(dayFromToday(-3), '08:30'),
  ),
  accepted(
    seed({
      id: 'ONB-2026-033', candidateId: 'c9', candidateEmail: 'ha.pt@gmail.com', candidatePhone: '0965 441 207', candidateSource: 'TopCV', cvFile: 'CV_PhanThuHa.docx',
      requestId: 'rq7', block: 'Khối G4', company: 'AEQUITAS', taPic: 'HangLT', sentAt: at(dayFromToday(-8), '10:00'),
      data: baseData({
        startDate: weekDay(0, 4), fullName: 'Phan Thu Hà', position: 'Accountant', techStack: 'Tax Accountant', level: 'Junior',
        department: 'G4 · Phòng Tài chính - Kế toán', manager: 'Vương Thị Hạnh', workLocation: 'HN - HO', officialSalary: 16000000,
        probationMonths: 2, probationPercent: 85, approver: 'Vương Thị Hạnh',
      }),
    }),
    'NV0412', 2, { user: 'hapt', pass: '' }, at(dayFromToday(-5), '15:40'),
  ),
  accepted(
    seed({
      id: 'ONB-2026-034', candidateId: 'c3', candidateEmail: 'long.pd@outlook.com', candidatePhone: '0904 556 778', candidateSource: 'ITViec', cvFile: '',
      requestId: 'rq1', block: 'Khối G1', company: 'VTX GROUP', taPic: 'MenTT', sentAt: at(dayFromToday(-9), '14:10'),
      data: baseData({
        startDate: weekDay(0, 2), fullName: 'Phạm Đức Long', position: 'Software Developer', techStack: 'Java', level: 'Middle',
        department: 'G1 · Phòng Phát triển phần mềm 1', manager: 'Trịnh Văn Hưng', workLocation: 'HN - HO', officialSalary: 28000000,
        probationMonths: 2, probationPercent: 85, approver: 'Trịnh Văn Hưng', cvLink: 'https://drive.google.com/file/d/phamduclong-cv',
      }),
    }),
    'NV0416', 3, { user: 'longpd', pass: 'Tmp#7Kq2vX' }, at(dayFromToday(-7), '09:15'),
  ),
  // ---- Đã onboard tháng trước
  {
    ...accepted(
      seed({
        id: 'ONB-2026-031', candidateId: 'c5', candidateEmail: 'nam.vh@gmail.com', candidatePhone: '0905 667 120', candidateSource: 'Headhunt', cvFile: 'CV_VuHoangNam.pdf',
        requestId: 'rq3', block: 'Khối G2', company: 'AEQUITAS', taPic: 'HienNPM', sentAt: at(monthDay(-1, 1), '09:00'),
        data: baseData({
          startDate: monthDay(-1, 12), fullName: 'Vũ Hoàng Nam', position: 'Data Analyst', techStack: 'DA', level: 'Senior',
          department: 'G2 · Phòng Dữ liệu & Phân tích', manager: 'Phạm Thị Lan', workLocation: 'HN - VNI', officialSalary: 35000000,
          probationMonths: 2, probationPercent: 85, approver: 'Phạm Thị Lan', evidenceFile: 'BOD_duyet_offer_VuHoangNam.pdf',
        }),
      }),
      'NV0398', 5, { user: 'namvh', pass: 'Tmp#4Hd8mR' }, at(monthDay(-1, 3), '10:00'),
    ),
    status: 'Đã onboard',
    checklist: buildChecklist(11, HCNS_NAME, at(monthDay(-1, 11), '17:00')),
  },
  // ---- Đã đóng
  {
    ...seed({
      id: 'ONB-2026-035', candidateId: 'c8', candidateEmail: 'tuan.dm@outlook.com', candidatePhone: '0936 778 901', candidateSource: 'LinkedIn', cvFile: 'CV_DangMinhTuan.pdf',
      requestId: 'rq8', block: 'Khối BFSI', company: 'AEQUITAS', taPic: 'XuanDTT', sentAt: at(dayFromToday(-10), '16:30'),
      data: baseData({
        startDate: monthDay(0, 24), fullName: 'Đặng Minh Tuấn', position: 'DevOps Engineer', techStack: 'DevOps', level: 'Senior',
        department: 'BFSI · Phòng DevOps & Cloud', manager: 'Nguyễn Hải Đăng', workLocation: 'HN - HO', officialSalary: 42000000,
        probationMonths: 2, probationPercent: 85, approver: 'Lương Minh Đức',
      }),
    }),
    status: 'HCNS từ chối',
    decidedBy: HCNS_NAME,
    decidedAt: at(dayFromToday(-9), '10:05'),
    returnReason: 'Mức lương vượt khung đã duyệt cho vị trí — cần BOD phê duyệt lại.',
  },
  {
    ...accepted(
      seed({
        id: 'ONB-2026-029', candidateId: 'c11', candidateEmail: 'thu.ha@gmail.com', candidatePhone: '0988 300 452', candidateSource: 'Facebook', cvFile: 'CV_HoangAnhThu.pdf',
        requestId: 'rq4', block: 'Khối G1', company: 'AEQUITAS', taPic: 'XuanDTT', sentAt: at(monthDay(-1, 5), '10:10'),
        data: baseData({
          startDate: monthDay(-1, 19), fullName: 'Hoàng Anh Thư', position: 'Product Designer', techStack: 'UIUX', level: 'Junior',
          department: 'G1 · Phòng Phát triển phần mềm 1', manager: 'Trịnh Văn Hưng', workLocation: 'HN - HO', officialSalary: 15000000,
          probationMonths: 2, probationPercent: 85, approver: 'Trịnh Văn Hưng',
        }),
      }),
      'NV0405', 1, { user: 'thuha', pass: '' }, at(monthDay(-1, 7), '09:00'),
    ),
    status: 'Cancel offer',
    cancelReason: 'Ứng viên báo không nhận việc (nhận offer công ty khác).',
    cancelledBy: HCNS_NAME,
    cancelledAt: at(monthDay(-1, 13), '15:00'),
  },
];
