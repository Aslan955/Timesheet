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

export type OnbStatus = 'Chờ HCNS duyệt' | 'Đang onboard' | 'Đã onboard' | 'Huỷ onboard' | 'HCNS từ chối';

export const ONB_STATUSES: OnbStatus[] = ['Chờ HCNS duyệt', 'Đang onboard', 'Đã onboard', 'Huỷ onboard', 'HCNS từ chối'];

/** Ánh xạ sang trạng thái Onboarding Request trong code thật (hiện cạnh nhãn để BA đối chiếu). */
export const ONB_STATUS_REAL: Record<OnbStatus, string> = {
  'Chờ HCNS duyệt': 'Pending',
  'Đang onboard': 'Approved',
  'Đã onboard': 'Approved · Stage Onboarded',
  'Huỷ onboard': 'Rejected (TA báo huỷ)',
  'HCNS từ chối': 'Rejected',
};

export type OnbRole = 'TA' | 'HCNS';

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
  kind: 'Gửi thông tin sang HCNS' | 'Cập nhật thông tin onboard' | 'Báo huỷ onboard' | 'Form onboarding cho ứng viên' | 'Nhắc điền form thông tin' | 'Mail IT cấp tài khoản';
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
// Tiến độ sau khi HCNS duyệt (ĐỀ XUẤT — code thật chỉ có job tạo user + 1 mail form)
// ==========================================================================
export type TaskStatus = 'Chưa bắt đầu' | 'Đang thực hiện' | 'Đã hoàn thành';
export type TaskKey = 'employee' | 'imisAccount' | 'personalForm' | 'itAccount';
export const TASK_ORDER: TaskKey[] = ['employee', 'imisAccount', 'personalForm', 'itAccount'];
export const TASK_DEFS: Record<TaskKey, { name: string; owner: string; done: string }> = {
  employee: { name: 'Tạo hồ sơ nhân sự (Employees)', owner: 'Hệ thống', done: 'Tạo ngay khi HCNS duyệt — trạng thái Thử việc' },
  imisAccount: { name: 'Tạo tài khoản đăng nhập iMIS', owner: 'Hệ thống', done: 'Job tạo user iMIS chạy xong, gán vào hồ sơ' },
  personalForm: { name: 'Form thông tin cá nhân (Microsoft Forms)', owner: 'Nhân sự mới', done: 'Nhân sự submit form — dữ liệu đổ vào hồ sơ Employees' },
  itAccount: { name: 'Mail IT cấp tài khoản Microsoft 365 & đăng nhập', owner: 'IT', done: 'IT xác nhận đã cấp đủ các mục' },
};
/** Các mục IT phải xác nhận. */
export const IT_ITEMS = ['Tài khoản Microsoft 365 (email công ty)', 'Tài khoản đăng nhập máy tính / domain', 'Phân quyền hệ thống (Jira, VPN, thư mục dùng chung…)'];
export const IT_MAILBOX = 'it@company.vn';
/** Kênh IT bàn giao thông tin đăng nhập — ngoài iMIS, iMIS KHÔNG lưu mật khẩu. */
export const DELIVERY_CHANNELS = ['Temporary Access Pass (TAP) qua SMS tới SĐT cá nhân', 'Mật khẩu tạm qua SMS (bắt buộc đổi khi đăng nhập)', 'Bàn giao trực tiếp ngày nhận việc'];
export const IT_STAFF = ['TuanNV (IT)', 'HoangLM (IT)', 'IT Helpdesk'];
export const MS_FORM_LINK = 'https://forms.office.com/r/vtx-onboarding-info';
/** Các trường nhân sự điền trên Microsoft Forms (đổ về hồ sơ Employees). */
export const FORM_FIELDS: { key: string; label: string }[] = [
  { key: 'birthDate', label: 'Ngày sinh' },
  { key: 'idNo', label: 'Số CCCD' },
  { key: 'idDate', label: 'Ngày cấp' },
  { key: 'idPlace', label: 'Nơi cấp' },
  { key: 'permanentAddress', label: 'Địa chỉ thường trú' },
  { key: 'currentAddress', label: 'Địa chỉ hiện tại' },
  { key: 'taxCode', label: 'Mã số thuế cá nhân' },
  { key: 'socialInsNo', label: 'Số sổ BHXH' },
  { key: 'bankAccount', label: 'Số tài khoản' },
  { key: 'bankName', label: 'Ngân hàng' },
];

export interface OnbTask {
  key: TaskKey;
  status: TaskStatus;
  startedAt?: string;
  doneAt?: string;
  doneBy?: string;
  /** Dòng mô tả kết quả / đang chờ gì */
  detail?: string;
  reminders?: number;
  /** IT: các mục đã xác nhận */
  itDone?: string[];
  /** IT: kênh + người bàn giao thông tin đăng nhập */
  deliveryChannel?: string;
  deliveredBy?: string;
  /** Form: dữ liệu nhân sự đã submit */
  formData?: Record<string, string>;
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
  { code: '01', name: 'TA bàn giao', owner: 'TA' },
  { code: '02', name: 'HCNS duyệt', owner: 'HCNS' },
  { code: '03', name: 'Tạo hồ sơ & tài khoản', owner: 'Hệ thống' },
  { code: '04', name: 'Chuẩn bị onboard', owner: 'Phòng ban · IT · HCTH' },
  { code: '05', name: 'Nhận việc', owner: 'HCNS' },
];
export const stepIndex = (r: OnbRecord): number => {
  if (r.status === 'Đã onboard') return 5;
  if (r.status === 'Chờ HCNS duyệt') return 1;
  if (r.status === 'Đang onboard') {
    const ok = (k: TaskKey) => taskOf(r, k).status === 'Đã hoàn thành';
    if (!ok('employee') || !ok('imisAccount')) return 2;
    return ok('personalForm') && ok('itAccount') && r.checklist.every((c) => c.done) ? 4 : 3;
  }
  return -1; // huỷ / từ chối
};

// ==========================================================================
// Dữ liệu mẫu
// ==========================================================================
const baseData = (p: Partial<HandoffData>): HandoffData => ({ ...emptyHandoff(), ...p });

export const SEED_RECORDS: OnbRecord[] = [
  {
    id: 'ONB-2026-038',
    candidateId: 'c6',
    candidateEmail: 'huy.lq@gmail.com',
    candidatePhone: '0903 112 845',
    candidateSource: 'ITViec',
    cvFile: 'CV_LeQuangHuy.pdf',
    requestId: 'rq1',
    block: 'Khối G1',
    taPic: 'MenTT',
    taPic2: 'NhuPTK',
    data: baseData({
      startDate: '2026-11-03', fullName: 'Lê Quang Huy', position: 'Software Developer', techStack: 'Java', level: 'Senior',
      department: 'G1 · Phòng Core Banking', manager: 'Đỗ Quốc Việt', workLocation: 'HN - VCB', officialSalary: 38000000,
      probationMonths: 2, probationPercent: 85, approver: 'Trịnh Văn Hưng', evidenceFile: 'Phe_duyet_offer_LeQuangHuy.pdf', note: 'Ứng viên cần laptop cấu hình cao (dev Java).',
    }),
    lastChanges: [],
    version: 1,
    status: 'Chờ HCNS duyệt',
    sentAt: '2026-10-20T09:42:00',
    sentBy: 'MenTT',
    contractType: '',
    hrNote: '',
    account: { status: 'Chưa tạo' },
    checklist: [],
    mails: [{ at: '2026-10-20T09:42:00', kind: 'Gửi thông tin sang HCNS', subject: '[Tuyển dụng → HCNS] Bàn giao nhân sự mới: Lê Quang Huy - Software Developer', to: HCNS_MAILBOX, cc: ['MenTT', 'NhuPTK'], attachments: ['Phe_duyet_offer_LeQuangHuy.pdf'] }],
    history: [
      { at: '2026-10-20T09:42:00', by: 'MenTT', role: 'TA', action: 'Gửi thông tin sang HCNS', note: 'Stage lượt R-2026-G1-001 → Offer Accepted' },
    ],
  },
  {
    id: 'ONB-2026-039',
    candidateId: 'c7',
    candidateEmail: 'ha.nt@gmail.com',
    candidatePhone: '0978 220 316',
    candidateSource: 'Refer',
    cvFile: '',
    requestId: 'rq2',
    block: 'Khối BFSI',
    taPic: 'HungNV4',
    taPic2: '',
    data: baseData({
      startDate: '2026-11-10', fullName: 'Ngô Thanh Hà', position: 'Business Analyst', techStack: 'BA', level: 'Fresher',
      department: 'BFSI · Phòng Phân tích nghiệp vụ', manager: 'Lương Minh Đức', workLocation: 'HN - BIDV', officialSalary: 14000000,
      probationMonths: 2, probationPercent: 85, approver: 'Lương Minh Đức', cvLink: 'https://drive.google.com/file/d/ngothanhha-cv', referBonus: 3000000, referRecipient: 'Hồ Tú Anh',
    }),
    lastChanges: [
      { field: 'Ngày bắt đầu làm việc', from: '03/11/2026', to: '10/11/2026' },
      { field: 'Lương chính thức (Gross)', from: '13.000.000 ₫', to: '14.000.000 ₫' },
    ],
    version: 2,
    status: 'Chờ HCNS duyệt',
    sentAt: '2026-10-21T08:15:00',
    sentBy: 'HungNV4',
    contractType: 'Thử việc',
    hrNote: '',
    account: { status: 'Chưa tạo' },
    checklist: [],
    mails: [
      { at: '2026-10-16T14:05:00', kind: 'Gửi thông tin sang HCNS', subject: '[Tuyển dụng → HCNS] Bàn giao nhân sự mới: Ngô Thanh Hà - Business Analyst', to: HCNS_MAILBOX, cc: ['HungNV4'], attachments: [] },
      { at: '2026-10-21T08:15:00', kind: 'Cập nhật thông tin onboard', subject: '[Cập nhật] [Tuyển dụng → HCNS] Bàn giao nhân sự mới: Ngô Thanh Hà - Business Analyst', to: HCNS_MAILBOX, cc: ['HungNV4'], attachments: [] },
    ],
    history: [
      { at: '2026-10-16T14:05:00', by: 'HungNV4', role: 'TA', action: 'Gửi thông tin sang HCNS' },
      { at: '2026-10-17T10:20:00', by: 'Nguyễn Thị Mai', role: 'HCNS', action: 'Bổ sung Loại hợp đồng', changes: [{ field: 'Loại hợp đồng', from: '', to: 'Thử việc' }] },
      {
        at: '2026-10-21T08:15:00', by: 'HungNV4', role: 'TA', action: 'Gửi cập nhật thông tin onboard', note: 'Ứng viên xin lùi ngày nhận việc 1 tuần; BOD duyệt tăng lương.',
        changes: [
          { field: 'Ngày bắt đầu làm việc', from: '03/11/2026', to: '10/11/2026' },
          { field: 'Lương chính thức (Gross)', from: '13.000.000 ₫', to: '14.000.000 ₫' },
        ],
      },
    ],
  },
  {
    id: 'ONB-2026-035',
    candidateId: 'c8',
    candidateEmail: 'tuan.dm@outlook.com',
    candidatePhone: '0936 778 901',
    candidateSource: 'LinkedIn',
    cvFile: 'CV_DangMinhTuan.pdf',
    requestId: 'rq8',
    block: 'Khối BFSI',
    taPic: 'XuanDTT',
    taPic2: '',
    data: baseData({
      startDate: '2026-11-02', fullName: 'Đặng Minh Tuấn', position: 'DevOps Engineer', techStack: 'DevOps', level: 'Senior',
      department: 'BFSI · Phòng DevOps & Cloud', manager: 'Nguyễn Hải Đăng', workLocation: 'HN - HO', officialSalary: 42000000,
      probationMonths: 2, probationPercent: 100, approver: 'Lương Minh Đức', evidenceFile: 'Offer_DangMinhTuan_ban_nhap.png',
    }),
    lastChanges: [],
    version: 1,
    status: 'HCNS từ chối',
    sentAt: '2026-10-14T16:30:00',
    sentBy: 'XuanDTT',
    contractType: '',
    hrNote: '',
    decidedBy: 'Nguyễn Thị Mai',
    decidedAt: '2026-10-15T09:10:00',
    returnReason: 'Bằng chứng phê duyệt là bản nháp, chưa có xác nhận của GĐ khối. Tỉ lệ thử việc 100% khác chính sách (85%) — cần bổ sung phê duyệt ngoại lệ.',
    account: { status: 'Chưa tạo' },
    checklist: [],
    mails: [{ at: '2026-10-14T16:30:00', kind: 'Gửi thông tin sang HCNS', subject: '[Tuyển dụng → HCNS] Bàn giao nhân sự mới: Đặng Minh Tuấn - DevOps Engineer', to: HCNS_MAILBOX, cc: ['XuanDTT'], attachments: ['Offer_DangMinhTuan_ban_nhap.png', 'CV_DangMinhTuan.pdf'] }],
    history: [
      { at: '2026-10-14T16:30:00', by: 'XuanDTT', role: 'TA', action: 'Gửi thông tin sang HCNS' },
      { at: '2026-10-15T09:10:00', by: 'Nguyễn Thị Mai', role: 'HCNS', action: 'Từ chối yêu cầu onboarding', note: 'Bằng chứng phê duyệt là bản nháp, chưa có xác nhận của GĐ khối. Tỉ lệ thử việc 100% khác chính sách (85%) — cần bổ sung phê duyệt ngoại lệ.' },
    ],
  },
  {
    id: 'ONB-2026-033',
    candidateId: 'c9',
    candidateEmail: 'ha.pt@gmail.com',
    candidatePhone: '0965 441 207',
    candidateSource: 'TopCV',
    cvFile: 'CV_PhanThuHa.docx',
    requestId: 'rq7',
    block: 'Khối G4',
    taPic: 'HangLT',
    taPic2: '',
    data: baseData({
      startDate: '2026-10-26', fullName: 'Phan Thu Hà', position: 'Accountant', techStack: 'Tax Accountant', level: 'Junior',
      department: 'G4 · Phòng Tài chính - Kế toán', manager: 'Vương Thị Hạnh', workLocation: 'HN - HO', officialSalary: 16500000,
      probationMonths: 2, probationPercent: 85, approver: 'Vương Thị Hạnh', evidenceFile: 'Duyet_offer_PhanThuHa.msg',
    }),
    lastChanges: [],
    version: 1,
    status: 'Đang onboard',
    sentAt: '2026-10-12T10:00:00',
    sentBy: 'HangLT',
    contractType: 'Thử việc',
    hrNote: 'Đã gửi form thông tin cá nhân, chờ ứng viên điền.',
    decidedBy: 'Nguyễn Thị Mai',
    decidedAt: '2026-10-15T15:40:00',
    account: { status: 'Đã tạo', employeeCode: 'NV0412', userName: 'hapt', companyEmail: 'hapt@company.vn' },
    checklist: buildChecklist(6, 'Nguyễn Thị Mai', '2026-10-19T11:00:00'),
    tasks: [
      { key: 'employee', status: 'Đã hoàn thành', startedAt: '2026-10-15T15:40:00', doneAt: '2026-10-15T15:40:00', doneBy: 'Hệ thống', detail: 'Mã NV NV0412 · Thử việc' },
      { key: 'imisAccount', status: 'Đã hoàn thành', startedAt: '2026-10-15T15:40:00', doneAt: '2026-10-15T15:52:00', doneBy: 'Hệ thống', detail: 'User iMIS: hapt' },
      { key: 'personalForm', status: 'Đang thực hiện', startedAt: '2026-10-15T15:41:00', detail: 'Đã gửi link form tới ha.pt@gmail.com — chờ nhân sự submit', reminders: 1 },
      { key: 'itAccount', status: 'Đang thực hiện', startedAt: '2026-10-15T15:41:00', detail: 'Đã gửi mail tới it@company.vn — IT đã xác nhận 1/3 mục', itDone: ['Tài khoản Microsoft 365 (email công ty)'] },
    ],
    mails: [
      { at: '2026-10-12T10:00:00', kind: 'Gửi thông tin sang HCNS', subject: '[Tuyển dụng → HCNS] Bàn giao nhân sự mới: Phan Thu Hà - Accountant', to: HCNS_MAILBOX, cc: ['HangLT'], attachments: ['Duyet_offer_PhanThuHa.msg', 'CV_PhanThuHa.docx'] },
      { at: '2026-10-15T15:41:00', kind: 'Form onboarding cho ứng viên', subject: 'Chào mừng bạn gia nhập — vui lòng hoàn thiện thông tin onboarding', to: 'ha.pt@gmail.com', cc: [], attachments: [] },
    ],
    history: [
      { at: '2026-10-12T10:00:00', by: 'HangLT', role: 'TA', action: 'Gửi thông tin sang HCNS' },
      { at: '2026-10-15T15:40:00', by: 'Nguyễn Thị Mai', role: 'HCNS', action: 'Duyệt & tạo hồ sơ nhân sự', note: 'Loại HĐ: Thử việc' },
      { at: '2026-10-15T15:52:00', by: 'Hệ thống', role: 'Hệ thống', action: 'Tạo tài khoản: hapt@company.vn · Mã NV NV0412' },
    ],
  },
  {
    id: 'ONB-2026-036',
    candidateId: 'c10',
    candidateEmail: 'bao.bg@gmail.com',
    candidatePhone: '0911 095 338',
    candidateSource: 'Website',
    cvFile: 'CV_BuiGiaBao.pdf',
    requestId: 'rq9',
    block: 'Khối G4',
    taPic: 'NhuPTK',
    taPic2: 'HienNPM',
    data: baseData({
      startDate: '2026-11-16', fullName: 'Bùi Gia Bảo', position: 'Software Developer', techStack: 'NodeJS', level: 'Middle',
      department: 'G4 · Phòng Phát triển phần mềm 4', manager: 'Cao Tiến Dũng', workLocation: 'HCM - HDB', officialSalary: 26000000,
      probationMonths: 2, probationPercent: 85, approver: 'Cao Tiến Dũng',
    }),
    lastChanges: [],
    version: 1,
    status: 'Đang onboard',
    sentAt: '2026-10-17T11:20:00',
    sentBy: 'NhuPTK',
    contractType: 'Thử việc',
    hrNote: '',
    decidedBy: 'Nguyễn Thị Mai',
    decidedAt: '2026-10-21T08:30:00',
    account: { status: 'Đang tạo', employeeCode: 'NV0420' },
    checklist: buildChecklist(0),
    tasks: [
      { key: 'employee', status: 'Đã hoàn thành', startedAt: '2026-10-21T08:30:00', doneAt: '2026-10-21T08:30:00', doneBy: 'Hệ thống', detail: 'Mã NV NV0420 · Thử việc' },
      { key: 'imisAccount', status: 'Đang thực hiện', startedAt: '2026-10-21T08:30:00', detail: 'Job tạo user iMIS đang chạy…' },
      { key: 'personalForm', status: 'Đang thực hiện', startedAt: '2026-10-21T08:31:00', detail: 'Đã gửi link form tới bao.bg@gmail.com — chờ nhân sự submit', reminders: 0 },
      { key: 'itAccount', status: 'Đang thực hiện', startedAt: '2026-10-21T08:31:00', detail: 'Đã gửi mail tới it@company.vn — chờ IT xác nhận', itDone: [] },
    ],
    mails: [{ at: '2026-10-17T11:20:00', kind: 'Gửi thông tin sang HCNS', subject: '[Tuyển dụng → HCNS] Bàn giao nhân sự mới: Bùi Gia Bảo - Software Developer', to: HCNS_MAILBOX, cc: ['NhuPTK', 'HienNPM'], attachments: ['CV_BuiGiaBao.pdf'] }],
    history: [
      { at: '2026-10-17T11:20:00', by: 'NhuPTK', role: 'TA', action: 'Gửi thông tin sang HCNS' },
      { at: '2026-10-21T08:30:00', by: 'Nguyễn Thị Mai', role: 'HCNS', action: 'Duyệt & tạo hồ sơ nhân sự', note: 'Loại HĐ: Thử việc' },
    ],
  },
  {
    id: 'ONB-2026-031',
    candidateId: 'c5',
    candidateEmail: 'nam.vh@gmail.com',
    candidatePhone: '0905 667 120',
    candidateSource: 'Headhunt',
    cvFile: 'CV_VuHoangNam.pdf',
    requestId: 'rq3',
    block: 'Khối G2',
    taPic: 'HienNPM',
    taPic2: '',
    data: baseData({
      startDate: '2026-09-07', fullName: 'Vũ Hoàng Nam', position: 'Data Analyst', techStack: 'DA', level: 'Senior',
      department: 'G2 · Phòng Dữ liệu & Phân tích', manager: 'Phạm Thị Lan', workLocation: 'HN - HO', officialSalary: 40000000,
      probationMonths: 2, probationPercent: 85, approver: 'Tạ Quang Minh', evidenceFile: 'BOD_duyet_offer_VuHoangNam.pdf',
    }),
    lastChanges: [],
    version: 1,
    status: 'Đã onboard',
    sentAt: '2026-08-25T09:00:00',
    sentBy: 'HienNPM',
    contractType: 'Thử việc',
    hrNote: '',
    decidedBy: 'Nguyễn Thị Mai',
    decidedAt: '2026-08-27T10:00:00',
    account: { status: 'Đã tạo', employeeCode: 'NV0398', userName: 'namvh', companyEmail: 'namvh@company.vn' },
    checklist: buildChecklist(11, 'Nguyễn Thị Mai', '2026-09-04T17:00:00'),
    tasks: [
      { key: 'employee', status: 'Đã hoàn thành', startedAt: '2026-08-27T10:00:00', doneAt: '2026-08-27T10:00:00', doneBy: 'Hệ thống', detail: 'Mã NV NV0398 · Thử việc' },
      { key: 'imisAccount', status: 'Đã hoàn thành', startedAt: '2026-08-27T10:00:00', doneAt: '2026-08-27T10:12:00', doneBy: 'Hệ thống', detail: 'User iMIS: namvh' },
      { key: 'personalForm', status: 'Đã hoàn thành', startedAt: '2026-08-27T10:01:00', doneAt: '2026-08-29T20:15:00', doneBy: 'Vũ Hoàng Nam', detail: 'Đã nhận 10/10 trường — đã cập nhật hồ sơ Employees' },
      { key: 'itAccount', status: 'Đã hoàn thành', startedAt: '2026-08-27T10:01:00', doneAt: '2026-09-03T09:30:00', doneBy: 'IT (it@company.vn)', detail: 'namvh@company.vn · đủ 3/3 mục · bàn giao: Bàn giao trực tiếp ngày nhận việc (HoangLM (IT))', itDone: [...IT_ITEMS], deliveryChannel: 'Bàn giao trực tiếp ngày nhận việc', deliveredBy: 'HoangLM (IT)' },
    ],
    mails: [{ at: '2026-08-25T09:00:00', kind: 'Gửi thông tin sang HCNS', subject: '[Tuyển dụng → HCNS] Bàn giao nhân sự mới: Vũ Hoàng Nam - Data Analyst', to: HCNS_MAILBOX, cc: ['HienNPM'], attachments: ['BOD_duyet_offer_VuHoangNam.pdf', 'CV_VuHoangNam.pdf'] }],
    history: [
      { at: '2026-08-25T09:00:00', by: 'HienNPM', role: 'TA', action: 'Gửi thông tin sang HCNS' },
      { at: '2026-08-27T10:00:00', by: 'Nguyễn Thị Mai', role: 'HCNS', action: 'Duyệt & tạo hồ sơ nhân sự' },
      { at: '2026-09-07T00:15:00', by: 'Hệ thống', role: 'Hệ thống', action: 'Đã tới ngày onboard → Stage Onboarded' },
    ],
  },
  {
    id: 'ONB-2026-029',
    candidateId: 'c11',
    candidateEmail: 'thu.ha@gmail.com',
    candidatePhone: '0988 300 452',
    candidateSource: 'Facebook',
    cvFile: 'CV_HoangAnhThu.pdf',
    requestId: 'rq4',
    block: 'Khối G1',
    taPic: 'XuanDTT',
    taPic2: '',
    data: baseData({
      startDate: '2026-10-19', fullName: 'Hoàng Anh Thư', position: 'Product Designer', techStack: 'UIUX', level: 'Junior',
      department: 'G1 · Phòng Phát triển phần mềm 1', manager: 'Trịnh Văn Hưng', workLocation: 'HN - HO', officialSalary: 15000000,
      probationMonths: 2, probationPercent: 85, approver: 'Trịnh Văn Hưng',
    }),
    lastChanges: [],
    version: 1,
    status: 'Huỷ onboard',
    sentAt: '2026-10-05T10:10:00',
    sentBy: 'XuanDTT',
    contractType: 'Thử việc',
    hrNote: '',
    cancelReason: 'Ứng viên nhận offer công ty khác, báo không nhận việc.',
    account: { status: 'Chưa tạo' },
    checklist: [],
    mails: [
      { at: '2026-10-05T10:10:00', kind: 'Gửi thông tin sang HCNS', subject: '[Tuyển dụng → HCNS] Bàn giao nhân sự mới: Hoàng Anh Thư - Product Designer', to: HCNS_MAILBOX, cc: ['XuanDTT'], attachments: ['CV_HoangAnhThu.pdf'] },
      { at: '2026-10-13T15:00:00', kind: 'Báo huỷ onboard', subject: '[iMIS] Báo hủy Onboard - Ứng viên Hoàng Anh Thư', to: HCNS_MAILBOX, cc: ['XuanDTT'], attachments: [] },
    ],
    history: [
      { at: '2026-10-05T10:10:00', by: 'XuanDTT', role: 'TA', action: 'Gửi thông tin sang HCNS' },
      { at: '2026-10-13T15:00:00', by: 'XuanDTT', role: 'TA', action: 'Báo huỷ onboard', note: 'Ứng viên nhận offer công ty khác, báo không nhận việc. Stage → Offer Rejected.' },
    ],
  },
];
