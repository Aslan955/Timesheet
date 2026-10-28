/**
 * Module Tuyển dụng (bám code iMIS hiện tại) — kiểu dữ liệu, enum, luật thuần, dữ liệu mẫu.
 *
 * Nguồn đặc tả: RecruitmentEnums.cs, RecruitmentUi.cs, RecruitmentSla.cs, RecruitmentRequestKpi.cs,
 * RecruitmentCodeHelper.cs, RecruitmentRequest/CandidateValidator.cs, imis-vi.xml.
 */

// ==========================================================================
// Enum
// ==========================================================================
/** 21 vòng tuyển dụng — giá trị số = thứ tự. Nhãn giữ NGUYÊN tiếng Anh (thuật ngữ đội TA). */
export const STAGES = [
  'New', 'Applied', 'Not Interested', 'TA Screen_Consider', 'TA Screen_Passed', 'TA Screen_Rejected', 'HM Screen_Passed', 'HM Screen_Rejected',
  'Intv 1_Schedule', 'Intv 1_Passed', 'Intv 1_Failed', 'Intv 2_Schedule', 'Intv 2_Passed', 'Intv 2_Failed', 'Intv Pass _ No Offer',
  'Offering', 'Offer Accepted', 'Offer Rejected', 'Onboarded', 'Pending', 'Cancelled Onboard',
] as const;
export type Stage = (typeof STAGES)[number];

export type Tone = 'gray' | 'red' | 'amber' | 'green' | 'blue' | 'orange' | 'purple';
export const stageTone = (s: Stage): Tone => {
  if (s === 'New' || s === 'Not Interested' || s === 'Pending') return 'gray';
  if (s.endsWith('Rejected') || s.endsWith('Failed') || s === 'Cancelled Onboard') return 'red';
  if (s === 'Offering' || s === 'Intv Pass _ No Offer') return 'amber';
  if (s === 'Offer Accepted' || s === 'Onboarded') return 'green';
  return 'blue';
};
export const HIRED_STAGES: Stage[] = ['Offer Accepted', 'Onboarded'];
export const WISHLIST_STAGES: Stage[] = ['New', 'Applied', 'TA Screen_Consider', 'TA Screen_Passed', 'HM Screen_Passed', 'Intv 1_Schedule', 'Intv 1_Passed', 'Intv 2_Schedule', 'Intv 2_Passed', 'Intv Pass _ No Offer', 'Offering', 'Pending'];

export const REQUEST_STATUSES = ['Chờ phê duyệt', 'Đang tuyển', 'Chờ nhận việc', 'Hoàn thành', 'Tạm dừng', 'Hủy'] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];
/** Nhóm kết thúc → bắt buộc Ngày kết thúc. */
export const ENDING_STATUSES: RequestStatus[] = ['Chờ nhận việc', 'Hoàn thành', 'Hủy'];
/** Mẫu số Tỷ lệ hoàn thành. */
export const FILL_RATE_STATUSES: RequestStatus[] = ['Đang tuyển', 'Chờ nhận việc', 'Hoàn thành'];
export const statusTone = (s: RequestStatus | ''): Tone =>
  ({ 'Chờ phê duyệt': 'blue', 'Đang tuyển': 'green', 'Chờ nhận việc': 'purple', 'Tạm dừng': 'amber', 'Hủy': 'red', 'Hoàn thành': 'gray' } as Record<string, Tone>)[s] || 'gray';

export const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'] as const;
export type Priority = (typeof PRIORITIES)[number];
/** Combobox trên form chỉ cho chọn 2 mức này (được để trống). */
export const FORM_PRIORITIES: Priority[] = ['Critical', 'High'];
export const priorityTone = (p: Priority | ''): Tone => ({ Critical: 'red', High: 'orange', Medium: 'amber', Low: 'gray' } as Record<string, Tone>)[p] || 'gray';

export type Sla = '' | 'New' | 'Near Deadline' | 'Overdue';
export const slaTone = (s: Sla): Tone => (s === 'New' ? 'green' : s === 'Near Deadline' ? 'amber' : s === 'Overdue' ? 'red' : 'gray');

export type HrStatus = 'None' | 'Probation' | 'OfficialEmployee' | 'LeftInProbation';
export const HR_STATUS_LABEL: Record<HrStatus, string> = {
  None: 'Chưa có hồ sơ HCNS',
  Probation: 'Đang thử việc',
  OfficialEmployee: 'Official Employee',
  LeftInProbation: 'Left in Probation',
};
export const hrTone = (s: HrStatus): Tone => (s === 'OfficialEmployee' ? 'green' : s === 'LeftInProbation' ? 'red' : s === 'Probation' ? 'blue' : 'gray');

/** Class badge ERP theo tone. */
export const TONE_CLS: Record<Tone, string> = {
  gray: 'bg-slate-100 text-slate-600 border-slate-300',
  red: 'bg-rose-50 text-rose-700 border-rose-300',
  amber: 'bg-amber-50 text-amber-700 border-amber-300',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  blue: 'bg-[#eaf2fc] text-[#1f5fa8] border-[#b9d3f0]',
  orange: 'bg-orange-50 text-orange-700 border-orange-300',
  purple: 'bg-violet-50 text-violet-700 border-violet-300',
};

// ==========================================================================
// Danh mục dùng chung (RecruitmentCatalogItem) + Khối (Organization cấp 1) + TA
// ==========================================================================
export type CatalogType = 'Source' | 'University' | 'Major' | 'Level' | 'Position' | 'Skill' | 'Location';
export interface CatalogItem {
  id: string;
  type: CatalogType;
  name: string;
  code: string;
  priority: number;
  /** "Đang sử dụng" — hiển thị trong ô chọn */
  isActive: boolean;
  /** Chỉ danh mục Địa điểm phỏng vấn */
  mapLink: string;
}

/** 7 mục con menu "Danh mục tuyển dụng" — đúng thứ tự imisNavigationProvider. */
export const CATALOG_MENU: { type: CatalogType; label: string }[] = [
  { type: 'Source', label: 'Nguồn ứng viên' },
  { type: 'University', label: 'Trường đại học' },
  { type: 'Major', label: 'Chuyên ngành' },
  { type: 'Level', label: 'Level ứng tuyển' },
  { type: 'Position', label: 'Vị trí' },
  { type: 'Skill', label: 'Kỹ năng' },
  { type: 'Location', label: 'Địa điểm phỏng vấn' },
];

export interface Block {
  id: string;
  name: string;
  shortName: string;
}
export const BLOCKS: Block[] = [
  { id: 'b1', name: 'Khối G1', shortName: 'G1' },
  { id: 'b2', name: 'Khối G2', shortName: 'G2' },
  { id: 'b3', name: 'Khối G3', shortName: 'G3' },
  { id: 'b4', name: 'Khối G4', shortName: 'G4' },
  { id: 'b5', name: 'Khối BFSI', shortName: 'BFSI' },
  { id: 'b6', name: 'Khối Staffing', shortName: 'Staffing' },
  { id: 'b7', name: 'Back Office', shortName: 'BO' },
];
export const blockShort = (name: string) => BLOCKS.find((b) => b.name === name)?.shortName || name;

/** Nhân sự role TA — hiển thị theo UserName (account). */
export const TA_OPTIONS = ['MenTT', 'NhuPTK', 'HienNPM', 'HangLT', 'XuanDTT', 'LyTH1', 'HungNV4', 'SenNT'];
/** Người dùng đang đăng nhập (prototype). */
export const CURRENT_TA = 'MenTT';

// ==========================================================================
// Yêu cầu tuyển dụng
// ==========================================================================
export interface RcRequest {
  id: string;
  code: string; // R-yyyy-<Khối>-NNN (tự sinh, không sinh lại khi sửa)
  priority: Priority | '';
  status: RequestStatus | '';
  block: string; // tên khối
  position: string;
  skill: string;
  level: string;
  taPics: string[]; // tối đa 2 (TaPicId, TaPic2Id)
  taSupport: string;
  dateReceived: string;
  endDate: string;
  deadline: string;
  headcount: number | '';
  note: string;
  isStaffing: boolean;
  salary: number | '';
  workLocation: string;
  contractType: string;
  contractDuration: string;
  jobDescription: string;
  equipment: string;
  createdBy: string;
  createdAt: string;
}

export const emptyRequest = (): RcRequest => ({
  id: '',
  code: '',
  priority: '',
  status: '',
  block: '',
  position: '',
  skill: '',
  level: '',
  taPics: [],
  taSupport: '',
  dateReceived: todayIso(),
  endDate: '',
  deadline: '',
  headcount: '',
  note: '',
  isStaffing: false,
  salary: '',
  workLocation: '',
  contractType: '',
  contractDuration: '',
  jobDescription: '',
  equipment: '',
  createdBy: '',
  createdAt: '',
});

export const genRequestCode = (block: string, dateReceived: string, existing: RcRequest[]) => {
  const year = (dateReceived || todayIso()).slice(0, 4);
  const prefix = `R-${year}-${blockShort(block) || 'NA'}-`;
  const max = existing.filter((r) => r.code.startsWith(prefix)).reduce((m, r) => Math.max(m, parseInt(r.code.slice(prefix.length), 10) || 0), 0);
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
};

/** SLA: chỉ khi Đang tuyển + có Ngày nhận. < 14 New · ≤ 30 Near Deadline · > 30 Overdue. */
export const SLA_NEAR = 14;
export const SLA_OVERDUE = 30;
export const daysRunning = (r: Pick<RcRequest, 'status' | 'dateReceived'>, asOf = todayIso()): number | null =>
  r.status !== 'Đang tuyển' || !r.dateReceived ? null : Math.max(0, diffDays(r.dateReceived, asOf));
export const slaOf = (days: number | null): Sla => (days == null ? '' : days < SLA_NEAR ? 'New' : days <= SLA_OVERDUE ? 'Near Deadline' : 'Overdue');

export const validateRequest = (r: RcRequest): Record<string, string> => {
  const e: Record<string, string> = {};
  const need = (k: keyof RcRequest, label: string, empty: boolean) => empty && (e[k] = `Vui lòng nhập "${label}"`);
  need('status', 'Tình trạng', !r.status);
  need('block', 'Khối', !r.block);
  need('position', 'Vị trí', !r.position);
  need('skill', 'Skill', !r.skill);
  need('level', 'Level', !r.level);
  need('taPics', 'TA PIC', r.taPics.length === 0);
  need('dateReceived', 'Ngày nhận', !r.dateReceived);
  if (r.status && ENDING_STATUSES.includes(r.status as RequestStatus) && !r.endDate) e.endDate = 'Tình trạng đã kết thúc — vui lòng nhập "Ngày kết thúc"';
  need('headcount', 'SL cần', r.headcount === '');
  if (r.headcount !== '' && Number(r.headcount) < 1) e.headcount = '"SL cần" phải lớn hơn hoặc bằng 1';
  return e;
};

// ==========================================================================
// Ứng viên + lượt ứng tuyển
// ==========================================================================
export interface RcApplication {
  id: string;
  candidateId: string;
  requestId: string;
  stage: Stage;
  appliedDate: string;
  stageChangedAt: string;
  addedBy: string;
}

export interface HrInfo {
  status: HrStatus;
  employeeCode?: string;
  employeeName?: string;
  startDate?: string;
  officialDate?: string;
  resignDate?: string;
  matchedByEmail?: boolean;
}

export interface RcCandidate {
  id: string;
  code: string; // UV + 5 số (mới) — hồ sơ cũ ƯV-yyNNNN
  inputDate: string;
  fullName: string;
  appliedPosition: string;
  dob: string;
  email: string;
  phone: string;
  taInput: string;
  address: string;
  linkedin: string;
  source: string;
  referrerName: string;
  university: string;
  major: string;
  currentPosition: string;
  currentCompany: string;
  techStack: string;
  skills: string[];
  cvFile: string;
  cvLink: string;
  note: string;
  /** Vòng TỔNG của hồ sơ — độc lập với Stage từng lượt. */
  stage: Stage;
  hr: HrInfo;
  createdBy: string;
}

export const emptyCandidate = (): RcCandidate => ({
  id: '',
  code: '',
  inputDate: todayIso(),
  fullName: '',
  appliedPosition: '',
  dob: '',
  email: '',
  phone: '',
  taInput: '',
  address: '',
  linkedin: '',
  source: '',
  referrerName: '',
  university: '',
  major: '',
  currentPosition: '',
  currentCompany: '',
  techStack: '',
  skills: [],
  cvFile: '',
  cvLink: '',
  note: '',
  stage: 'New',
  hr: { status: 'None' },
  createdBy: '',
});

export const genCandidateCode = (existing: RcCandidate[]) => {
  const max = existing.filter((c) => /^UV\d{5}$/.test(c.code)).reduce((m, c) => Math.max(m, parseInt(c.code.slice(2), 10)), 0);
  return `UV${String(max + 1).padStart(5, '0')}`;
};

export const isReferSource = (source: string) => source.trim().toLowerCase() === 'refer';
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validate form (5 trường bắt buộc + email + Refer). */
export const validateCandidate = (c: RcCandidate): Record<string, string> => {
  const e: Record<string, string> = {};
  const need = (k: keyof RcCandidate, label: string, empty: boolean) => empty && (e[k] = `Vui lòng nhập "${label}"`);
  need('inputDate', 'Ngày tiếp nhận', !c.inputDate);
  need('fullName', 'Họ và tên', !c.fullName.trim());
  need('email', 'Email', !c.email.trim());
  if (c.email.trim() && !EMAIL_RE.test(c.email.trim())) e.email = 'Email không đúng định dạng';
  need('source', 'Nguồn ứng viên', !c.source);
  need('taInput', 'TA Input', !c.taInput);
  if (isReferSource(c.source) && !c.referrerName.trim()) e.referrerName = 'Nguồn là "Refer" — vui lòng nhập tên Người refer';
  return e;
};

/** Hai lượt mới nhất (Yêu cầu 1 / Yêu cầu 2 trên lưới). */
export const latestApps = (apps: RcApplication[], candidateId: string) =>
  apps.filter((a) => a.candidateId === candidateId).sort((a, b) => (b.stageChangedAt || b.appliedDate).localeCompare(a.stageChangedAt || a.appliedDate));

// ==========================================================================
// Nhật ký + mail
// ==========================================================================
export interface BizLog {
  id: string;
  entity: 'candidate' | 'request';
  entityId: string;
  at: string;
  by: string;
  action: string;
  changes?: { field: string; from: string; to: string }[];
}

export const MAIL_KINDS = [
  'Mời phỏng vấn - Vòng 1',
  'Mời phỏng vấn - Vòng 1 (Staffing)',
  'Mời phỏng vấn - Vòng 2',
  'Mời phỏng vấn - Vòng 2 (Staffing)',
  'Offer Letter',
  'Offer Letter (Staffing)',
  'Thư cảm ơn - fail CV',
  'Thư cảm ơn - fail phỏng vấn',
  'Gửi thông tin sang HCNS',
  'Báo hủy Onboard sang HCNS',
] as const;
export type MailKind = (typeof MAIL_KINDS)[number] | 'Cập nhật thông tin onboard sang HCNS' | 'Đã huỷ lịch phỏng vấn';

export interface MailLog {
  id: string;
  candidateId: string;
  applicationId: string;
  kind: MailKind;
  subject: string;
  to: string;
  cc: string[];
  attachments: string[];
  body: string;
  sentAt: string;
  sentBy: string;
  ok: boolean;
  error?: string;
  /** Lịch phỏng vấn Outlook (để huỷ lịch). */
  eventId?: string;
  cancelled?: boolean;
  /** Dữ liệu Offer đã gửi (RecruitmentOffer) — nguồn prefill form HCNS. */
  offer?: OfferInfo;
}

export interface OfferInfo {
  position: string;
  department: string;
  reportTo: string;
  workLocation: string;
  startDate: string;
  probationMonths: number | '';
  salary: number | '';
  probationPercent: number | '';
  directors: string[];
}

// ==========================================================================
// Ngày giờ
// ==========================================================================
const pad = (n: number) => String(n).padStart(2, '0');
export const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
export const nowIso = () => new Date().toISOString();
export const diffDays = (fromIso: string, toIso: string) =>
  Math.round((new Date(`${toIso.slice(0, 10)}T00:00:00`).getTime() - new Date(`${fromIso.slice(0, 10)}T00:00:00`).getTime()) / 86400000);
export const dmy = (iso: string) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : '');
export const dmyhm = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
export const money = (v: number | '') => (v === '' ? '' : `${Number(v).toLocaleString('vi-VN')} ₫`);
/** Bỏ dấu + thường hoá (NormalizeLookup). */
export const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
export const suggestCode = (name: string) =>
  name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toUpperCase();

// ==========================================================================
// Dữ liệu mẫu
// ==========================================================================
const cat = (type: CatalogType, names: string[], extra: Partial<Record<string, Partial<CatalogItem>>> = {}): CatalogItem[] =>
  names.map((name, i) => ({ id: `${type}-${i + 1}`, type, name, code: suggestCode(name), priority: i + 1, isActive: true, mapLink: '', ...(extra[name] || {}) }));

export const SEED_CATALOG: CatalogItem[] = [
  ...cat('Source', ['LinkedIn', 'Refer', 'TopCV', 'ITViec', 'VietnamWorks', 'Synodus Web', 'Headhunt', 'Facebook', 'Khác'], { 'Synodus Web': { code: 'SYNODUS_WEB' }, Facebook: { isActive: false } }),
  ...cat('University', ['ĐH Bách khoa Hà Nội', 'ĐH Công nghệ - ĐHQGHN', 'Học viện Công nghệ BCVT', 'ĐH Kinh tế Quốc dân', 'ĐH FPT', 'ĐH Bách khoa TP.HCM', 'Học viện Ngân hàng', 'Khác']),
  ...cat('Major', ['Công nghệ thông tin', 'Khoa học máy tính', 'Kỹ thuật phần mềm', 'Hệ thống thông tin', 'Tài chính - Ngân hàng', 'Kế toán', 'Quản trị kinh doanh', 'Thiết kế đồ hoạ']),
  ...cat('Level', ['Intern', 'Fresher', 'Junior', 'Middle', 'Senior', 'Lead', 'Manager', 'Head', 'Director']),
  ...cat('Position', ['Software Developer', 'Business Analyst', 'Data Analyst', 'Data Engineer', 'DevOps Engineer', 'Tester', 'Product Designer', 'Project Manager', 'Delivery Manager', 'IT Support', 'Accountant', 'Techlead']),
  ...cat('Skill', ['Java', '.NET', 'NodeJS', 'Python', 'ReactJS', 'Angular', 'BA', 'DA', 'DE', 'DevOps', 'Test', 'UIUX', 'PM', 'DM', 'ITsupport', 'Tax Accountant']),
  ...cat('Location', ['Trụ sở Hà Nội - Tầng 9, Toà Sông Đà', 'Văn phòng HCM - Quận 3', 'Online - Microsoft Teams'], {
    'Trụ sở Hà Nội - Tầng 9, Toà Sông Đà': { mapLink: 'https://maps.app.goo.gl/hn-song-da' },
    'Văn phòng HCM - Quận 3': { mapLink: 'https://maps.app.goo.gl/hcm-q3' },
  }),
];

/** Phòng họp Outlook (Graph) — cho form mời phỏng vấn. */
export const MEETING_ROOMS: { name: string; capacity: number; address: string; busy?: string }[] = [
  { name: 'P.901 - Hà Nội', capacity: 8, address: 'Tầng 9, Toà Sông Đà' },
  { name: 'P.902 - Hà Nội', capacity: 4, address: 'Tầng 9, Toà Sông Đà', busy: '14:00–15:30' },
  { name: 'P.Board - Hà Nội', capacity: 16, address: 'Tầng 9, Toà Sông Đà' },
  { name: 'P.301 - HCM', capacity: 6, address: 'Quận 3, TP.HCM' },
];

/** Nhân sự (người phỏng vấn, Giám đốc khối, báo cáo cho). */
export const EMPLOYEES = ['Trịnh Văn Hưng', 'Phạm Thị Lan', 'Đỗ Quốc Việt', 'Lương Minh Đức', 'Nguyễn Hải Đăng', 'Vương Thị Hạnh', 'Cao Tiến Dũng', 'Hồ Tú Anh', 'Tạ Quang Minh'];
/** Mailbox CC mặc định (Recruitment.RecruitmentMailboxCc). */
export const RECRUITMENT_MAILBOX = 'tuyendung@vtxgroup.vn';

// ==========================================================================
// Mẫu email (NotificationTemplates — màn chung, lọc RECRUITMENT_*)
// ==========================================================================
export interface MailTemplate {
  code: string;
  name: string;
  title: string;
  content: string;
  parameters: string;
  channel: 'Email';
  active: boolean;
}
export const SEED_TEMPLATES: MailTemplate[] = [
  { code: 'RECRUITMENT_INTERVIEW_R1', name: 'Tuyển dụng - Mời phỏng vấn vòng 1', title: '[VTX Group] Interview Invitation ({CandidateName} - {Position})', parameters: 'CandidateName, Position, InterviewDate, InterviewTime, InterviewLocation, ContactPerson, MapLink', channel: 'Email', active: true,
    content: '<p>Dear {CandidateName},</p><p>Thank you for your interest in the <b>{Position}</b> position. We would like to invite you to the {InterviewRound} interview:</p><ul><li>Time: {InterviewTime}, {InterviewDate}</li><li>Location: {InterviewLocation} (please check the map here: {MapLink})</li><li>Meeting room: {MeetingRoom}</li><li>Interviewers: {Interviewers}</li></ul><p>Contact: {ContactPerson}</p>' },
  { code: 'RECRUITMENT_INTERVIEW_R2', name: 'Tuyển dụng - Mời phỏng vấn vòng 2', title: '[VTX Group] Interview Invitation ({CandidateName} - {Position})', parameters: 'CandidateName, Position, InterviewDate, InterviewTime, InterviewLocation, ContactPerson, MapLink', channel: 'Email', active: true,
    content: '<p>Dear {CandidateName},</p><p>Congratulations on passing round 1. We would like to invite you to the second interview for <b>{Position}</b> at {InterviewTime}, {InterviewDate} — {InterviewLocation}.</p><p>Contact: {ContactPerson}</p>' },
  { code: 'RECRUITMENT_INTERVIEW_R1_STAFFING', name: 'Tuyển dụng - Mời phỏng vấn vòng 1 (Staffing)', title: '[VTX Group - Aequitas] Interview Invitation ({CandidateName} - {Position})', parameters: 'CandidateName, Position, InterviewDate, InterviewTime, InterviewLocation, ContactPerson, MapLink', channel: 'Email', active: true,
    content: '<p>Dear {CandidateName},</p><p>VTX Group - Aequitas invites you to the interview for <b>{Position}</b> ...</p>' },
  { code: 'RECRUITMENT_INTERVIEW_R2_STAFFING', name: 'Tuyển dụng - Mời phỏng vấn vòng 2 (Staffing)', title: '[VTX Group - Aequitas] Interview Invitation ({CandidateName} - {Position})', parameters: 'CandidateName, Position, InterviewDate, InterviewTime, InterviewLocation, ContactPerson, MapLink', channel: 'Email', active: true,
    content: '<p>Dear {CandidateName},</p><p>Round 2 interview for <b>{Position}</b> ...</p>' },
  { code: 'RECRUITMENT_OFFER_LETTER', name: 'Tuyển dụng - Thư mời nhận việc (Offer Letter)', title: 'Employment Offer Mr./Ms. {CandidateName} – {Position} at VTX Group', parameters: 'CandidateName, Position, Department, StartDate, OfficialSalary', channel: 'Email', active: true,
    content: '<p>Dear Mr./Ms. {CandidateName},</p><p>We are pleased to offer you the position of <b>{Position}</b>, Division: {Department}, starting {StartDate}. Official salary: {OfficialSalary} ({OfficialSalaryInWordsEn}). {ProbationBlock}</p>' },
  { code: 'RECRUITMENT_THANKYOU_CV', name: 'Tuyển dụng - Thư cảm ơn (từ chối hồ sơ CV)', title: 'VTX Thank you', parameters: 'CandidateName, Position', channel: 'Email', active: true,
    content: '<p>Dear {CandidateName},</p><p>Thank you for applying for {Position}. After careful review, we regret ...</p><p>{TaName}</p>' },
  { code: 'RECRUITMENT_THANKYOU_INTERVIEW', name: 'Tuyển dụng - Thư cảm ơn (sau phỏng vấn)', title: 'VTX Thank you', parameters: 'CandidateName, Position', channel: 'Email', active: true,
    content: '<p>Dear {CandidateName},</p><p>Thank you for taking the time to interview for {Position} ...</p><p>{TaName}</p>' },
  { code: 'RECRUITMENT_HCNS_HANDOFF', name: 'Tuyển dụng - Bàn giao nhân sự mới sang HCNS', title: '[Tuyển dụng → HCNS] Bàn giao nhân sự mới: {CandidateName} - {Position}', parameters: 'TaPicName, StartDate, CandidateName, Position, TechStack, Level, Department, ManagerName, WorkLocation, OfficialSalary, ProbationMonths, ProbationSalaryPercent, Approver, ApprovalEvidence, CvLink, ReferInfo, Note', channel: 'Email', active: true,
    content:
      '<p>Kính gửi Phòng Hành chính - Nhân sự,</p><p>Bộ phận Tuyển dụng gửi thông tin ứng viên chờ onboard như sau:</p><ol>' +
      '<li>TA PIC ứng viên: <b>{TaPicName}</b></li><li>Ngày bắt đầu làm việc: <b>{StartDate}</b></li><li>Họ tên ứng viên: <b>{CandidateName}</b></li>' +
      '<li>Vị trí chức danh: {Position}</li><li>Tech Stack: {TechStack}</li><li>Level: {Level}</li><li>Bộ phận: {Department}</li><li>Quản lý trực tiếp: {ManagerName}</li>' +
      '<li>Địa điểm làm việc: {WorkLocation}</li><li>Lương chính thức (Gross): {OfficialSalary}</li><li>Thời gian thử việc: {ProbationMonths} tháng</li>' +
      '<li>Tỉ lệ lương thử việc: {ProbationSalaryPercent}%</li><li>Người phê duyệt Offer: {Approver}</li><li>Bằng chứng phê duyệt: {ApprovalEvidence}</li>' +
      '<li>Link CV: {CvLink}</li><li>Thông tin refer: {ReferInfo}</li><li>Ghi chú: {Note}</li></ol><p>Trân trọng,<br/>Bộ phận Tuyển dụng / VTX Group</p>' },
  { code: 'RECRUITMENT_CANCEL_ONBOARD', name: 'Tuyển dụng - Báo hủy Onboard', title: '[iMIS] Báo hủy Onboard - Ứng viên {CandidateName}', parameters: '', channel: 'Email', active: false,
    content: '(Chưa có seed — code dùng nội dung dự phòng viết cứng)' },
];

const req = (p: Partial<RcRequest> & Pick<RcRequest, 'id' | 'code'>): RcRequest => ({ ...emptyRequest(), createdBy: 'MenTT', createdAt: '2026-08-01T09:00:00', ...p });

export const SEED_REQUESTS: RcRequest[] = [
  req({ id: 'rq1', code: 'R-2026-G1-001', priority: 'Critical', status: 'Đang tuyển', block: 'Khối G1', position: 'Software Developer', skill: 'Java', level: 'Senior', taPics: ['MenTT', 'NhuPTK'], taSupport: 'SenNT', dateReceived: '2026-08-12', deadline: '2026-10-31', headcount: 3, note: 'Ưu tiên ứng viên có kinh nghiệm banking.' }),
  req({ id: 'rq2', code: 'R-2026-BFSI-001', priority: 'High', status: 'Đang tuyển', block: 'Khối BFSI', position: 'Business Analyst', skill: 'BA', level: 'Fresher', taPics: ['HungNV4'], taSupport: 'SenNT', dateReceived: '2026-10-08', deadline: '2026-11-30', headcount: 2 }),
  req({ id: 'rq3', code: 'R-2026-G2-001', priority: '', status: 'Đang tuyển', block: 'Khối G2', position: 'Data Analyst', skill: 'DA', level: 'Senior', taPics: ['HienNPM'], taSupport: 'HangLT', dateReceived: '2026-07-20', deadline: '2026-09-30', headcount: 2 }),
  req({ id: 'rq4', code: 'R-2026-G1-002', priority: '', status: 'Tạm dừng', block: 'Khối G1', position: 'Product Designer', skill: 'UIUX', level: 'Junior', taPics: ['XuanDTT'], taSupport: 'LyTH1', dateReceived: '2026-07-01', headcount: 1 }),
  req({ id: 'rq5', code: 'R-2026-G3-001', priority: '', status: 'Chờ phê duyệt', block: 'Khối G3', position: 'IT Support', skill: 'ITsupport', level: 'Fresher', taPics: ['LyTH1'], dateReceived: '2026-10-15', headcount: 1 }),
  req({ id: 'rq6', code: 'R-2026-G2-002', priority: 'High', status: 'Đang tuyển', block: 'Khối G2', position: 'Delivery Manager', skill: 'DM', level: 'Manager', taPics: ['SenNT'], taSupport: 'HungNV4', dateReceived: '2026-09-10', deadline: '2026-10-25', headcount: 1 }),
  req({ id: 'rq7', code: 'R-2026-G4-001', priority: '', status: 'Chờ nhận việc', block: 'Khối G4', position: 'Accountant', skill: 'Tax Accountant', level: 'Junior', taPics: ['HangLT'], taSupport: 'NhuPTK', dateReceived: '2026-08-20', endDate: '2026-10-15', headcount: 1, note: 'Đã có offer.' }),
  req({ id: 'rq8', code: 'R-2026-BFSI-002', priority: 'Critical', status: 'Đang tuyển', block: 'Khối BFSI', position: 'DevOps Engineer', skill: 'DevOps', level: 'Senior', taPics: ['XuanDTT'], taSupport: 'LyTH1', dateReceived: '2026-09-25', deadline: '2026-11-15', headcount: 2 }),
  req({ id: 'rq9', code: 'R-2026-G4-002', priority: '', status: 'Đang tuyển', block: 'Khối G4', position: 'Software Developer', skill: 'NodeJS', level: 'Middle', taPics: ['NhuPTK', 'HienNPM'], taSupport: '', dateReceived: '2026-10-01', deadline: '2026-12-15', headcount: 2 }),
  req({
    id: 'rq10', code: 'R-2026-Staffing-001', priority: 'High', status: 'Đang tuyển', block: 'Khối Staffing', position: 'Tester', skill: 'Test', level: 'Middle', taPics: ['MenTT'], taSupport: 'SenNT', dateReceived: '2026-10-05', deadline: '2026-11-05', headcount: 3,
    isStaffing: true, salary: 22000000, workLocation: 'Onsite khách hàng - Cầu Giấy, Hà Nội', contractType: 'HĐLĐ', contractDuration: '12 tháng', jobDescription: 'https://drive.google.com/jd-tester-staffing', equipment: 'Laptop core i5, RAM 16GB',
  }),
  req({ id: 'rq11', code: 'R-2026-G3-002', priority: '', status: 'Hoàn thành', block: 'Khối G3', position: 'Techlead', skill: '.NET', level: 'Lead', taPics: ['MenTT'], dateReceived: '2026-05-04', endDate: '2026-07-20', headcount: 1 }),
  req({ id: 'rq12', code: 'R-2026-G1-003', priority: '', status: 'Hủy', block: 'Khối G1', position: 'Project Manager', skill: 'PM', level: 'Senior', taPics: ['SenNT'], dateReceived: '2026-06-02', endDate: '2026-06-30', headcount: 1, note: 'Khối huỷ nhu cầu.' }),
];

export const CATALOG_LABEL = (t: CatalogType) => CATALOG_MENU.find((m) => m.type === t)?.label || t;

const cand = (p: Partial<RcCandidate> & Pick<RcCandidate, 'id' | 'code' | 'fullName' | 'email'>): RcCandidate => ({ ...emptyCandidate(), createdBy: 'MenTT', ...p });

export const SEED_CANDIDATES: RcCandidate[] = [
  cand({ id: 'c1', code: 'UV00001', inputDate: '2026-08-14', fullName: 'Nguyễn Minh Khôi', email: 'khoi.nm@gmail.com', phone: '0987 654 321', appliedPosition: 'Software Developer', taInput: 'MenTT', source: 'LinkedIn', university: 'ĐH Bách khoa Hà Nội', major: 'Khoa học máy tính', currentPosition: 'Senior Backend Developer', currentCompany: 'FPT Software', techStack: 'Java, Spring Boot, PostgreSQL', skills: ['Java'], cvFile: 'CV_NguyenMinhKhoi.pdf', stage: 'Intv 1_Schedule', note: 'Có kinh nghiệm core banking 3 năm.' }),
  cand({ id: 'c2', code: 'UV00002', inputDate: '2026-09-28', fullName: 'Trần Thị Hải Yến', email: 'yen.tth@gmail.com', phone: '0912 333 444', appliedPosition: 'DevOps Engineer', taInput: 'XuanDTT', source: 'Refer', referrerName: 'Hồ Tú Anh', university: 'Học viện Công nghệ BCVT', major: 'Công nghệ thông tin', currentPosition: 'DevOps Engineer', currentCompany: 'Viettel', techStack: 'Kubernetes, Terraform, AWS', skills: ['DevOps'], cvFile: 'CV_TranThiHaiYen.pdf', stage: 'Offering' }),
  cand({ id: 'c3', code: 'UV00003', inputDate: '2026-08-20', fullName: 'Phạm Đức Long', email: 'long.pd@outlook.com', phone: '0904 556 778', appliedPosition: 'Software Developer', taInput: 'MenTT', source: 'ITViec', university: 'ĐH Công nghệ - ĐHQGHN', major: 'Kỹ thuật phần mềm', currentPosition: 'Java Developer', currentCompany: 'MISA', techStack: 'Java, Microservices', skills: ['Java'], stage: 'TA Screen_Passed' }),
  cand({ id: 'c4', code: 'UV00004', inputDate: '2026-10-10', fullName: 'Đỗ Thảo Nguyên', email: 'nguyen.dt@gmail.com', phone: '0938 120 456', appliedPosition: 'Business Analyst', taInput: 'HungNV4', source: 'TopCV', university: 'ĐH Kinh tế Quốc dân', major: 'Hệ thống thông tin', currentPosition: 'BA Intern', currentCompany: 'CMC', techStack: 'BPMN, SQL', skills: ['BA'], stage: 'New' }),
  cand({ id: 'c5', code: 'ƯV-260005', inputDate: '2026-07-22', fullName: 'Vũ Hoàng Nam', email: 'nam.vh@gmail.com', phone: '0905 667 120', appliedPosition: 'Data Analyst', taInput: 'HienNPM', source: 'Headhunt', university: 'ĐH Kinh tế Quốc dân', major: 'Tài chính - Ngân hàng', currentPosition: 'Senior Data Analyst', currentCompany: 'Techcombank', techStack: 'SQL, Power BI, Python', skills: ['DA', 'Python'], cvFile: 'CV_VuHoangNam.pdf', stage: 'Onboarded', hr: { status: 'Probation', employeeCode: 'NV0398', employeeName: 'Vũ Hoàng Nam', startDate: '2026-09-07' } }),
  cand({ id: 'c6', code: 'UV00006', inputDate: '2026-08-25', fullName: 'Lê Quang Huy', email: 'huy.lq@gmail.com', phone: '0903 112 845', appliedPosition: 'Software Developer', taInput: 'MenTT', source: 'ITViec', university: 'ĐH Bách khoa Hà Nội', major: 'Công nghệ thông tin', currentPosition: 'Senior Java Developer', currentCompany: 'NashTech', techStack: 'Java, Kafka', skills: ['Java'], cvFile: 'CV_LeQuangHuy.pdf', stage: 'Offer Accepted' }),
  cand({ id: 'c7', code: 'UV00007', inputDate: '2026-10-09', fullName: 'Ngô Thanh Hà', email: 'ha.nt@gmail.com', phone: '0978 220 316', appliedPosition: 'Business Analyst', taInput: 'HungNV4', source: 'Refer', referrerName: 'Hồ Tú Anh', university: 'Học viện Ngân hàng', major: 'Tài chính - Ngân hàng', currentPosition: 'Fresher BA', currentCompany: 'Tự do', techStack: 'Excel, SQL', skills: ['BA'], cvLink: 'https://drive.google.com/file/d/ngothanhha-cv', stage: 'Offer Accepted' }),
  cand({ id: 'c8', code: 'UV00008', inputDate: '2026-09-27', fullName: 'Đặng Minh Tuấn', email: 'tuan.dm@outlook.com', phone: '0936 778 901', appliedPosition: 'DevOps Engineer', taInput: 'XuanDTT', source: 'LinkedIn', university: 'ĐH FPT', major: 'Kỹ thuật phần mềm', currentPosition: 'Senior DevOps', currentCompany: 'VNG', techStack: 'K8s, GitLab CI, GCP', skills: ['DevOps'], cvFile: 'CV_DangMinhTuan.pdf', stage: 'Offer Accepted' }),
  cand({ id: 'c9', code: 'UV00009', inputDate: '2026-08-22', fullName: 'Phan Thu Hà', email: 'ha.pt@gmail.com', phone: '0965 441 207', appliedPosition: 'Accountant', taInput: 'HangLT', source: 'TopCV', university: 'Học viện Ngân hàng', major: 'Kế toán', currentPosition: 'Kế toán viên', currentCompany: 'Deloitte', techStack: 'MISA, Excel', skills: ['Tax Accountant'], cvFile: 'CV_PhanThuHa.docx', stage: 'Offer Accepted', hr: { status: 'Probation', employeeCode: 'NV0412', employeeName: 'Phan Thu Hà', startDate: '2026-10-26' } }),
  cand({ id: 'c10', code: 'UV00010', inputDate: '2026-10-02', fullName: 'Bùi Gia Bảo', email: 'bao.bg@gmail.com', phone: '0911 095 338', appliedPosition: 'Software Developer', taInput: 'NhuPTK', source: 'Synodus Web', university: 'ĐH Bách khoa TP.HCM', major: 'Khoa học máy tính', currentPosition: 'NodeJS Developer', currentCompany: 'Tiki', techStack: 'NodeJS, NestJS, MongoDB', skills: ['NodeJS'], cvFile: 'CV_BuiGiaBao.pdf', stage: 'Offer Accepted' }),
  cand({ id: 'c11', code: 'UV00011', inputDate: '2026-07-05', fullName: 'Hoàng Anh Thư', email: 'thu.ha@gmail.com', phone: '0988 300 452', appliedPosition: 'Product Designer', taInput: 'XuanDTT', source: 'Facebook', university: 'ĐH FPT', major: 'Thiết kế đồ hoạ', currentPosition: 'UI Designer', currentCompany: 'Base.vn', techStack: 'Figma', skills: ['UIUX'], stage: 'Offer Rejected' }),
  cand({ id: 'c12', code: 'UV00012', inputDate: '2026-10-06', fullName: 'Lý Minh Châu', email: 'chau.lm@gmail.com', phone: '0977 451 230', appliedPosition: 'Tester', taInput: 'MenTT', source: 'TopCV', university: 'ĐH Công nghệ - ĐHQGHN', major: 'Hệ thống thông tin', currentPosition: 'Manual Tester', currentCompany: 'Luvina', techStack: 'Selenium, Postman', skills: ['Test'], stage: 'Intv 2_Schedule' }),
  cand({ id: 'c13', code: 'UV00013', inputDate: '2026-10-07', fullName: 'Trịnh Bảo Ngọc', email: 'ngoc.tb@gmail.com', phone: '0969 876 012', appliedPosition: 'Tester', taInput: 'MenTT', source: 'VietnamWorks', university: 'Học viện Công nghệ BCVT', major: 'Công nghệ thông tin', currentPosition: 'QA Engineer', currentCompany: 'Rikkeisoft', techStack: 'Cypress, JMeter', skills: ['Test'], stage: 'Intv 1_Failed' }),
  cand({ id: 'c14', code: 'UV00014', inputDate: '2026-09-15', fullName: 'Cao Văn Thắng', email: 'thang.cv@gmail.com', phone: '0981 234 999', appliedPosition: 'Delivery Manager', taInput: 'SenNT', source: 'Headhunt', university: 'ĐH Bách khoa Hà Nội', major: 'Công nghệ thông tin', currentPosition: 'Delivery Manager', currentCompany: 'CMC Global', techStack: 'Agile, Scrum', skills: ['DM', 'PM'], stage: 'HM Screen_Passed' }),
  cand({ id: 'c15', code: 'UV00015', inputDate: '2026-10-16', fullName: 'Mai Phương Linh', email: 'linh.mp@gmail.com', phone: '0912 778 664', appliedPosition: '', taInput: 'LyTH1', source: 'LinkedIn', university: 'ĐH Kinh tế Quốc dân', major: 'Quản trị kinh doanh', currentPosition: 'IT Helpdesk', currentCompany: 'Vinschool', techStack: 'Windows Server, AD', skills: ['ITsupport'], stage: 'New', note: 'Chờ yêu cầu IT Support được duyệt.' }),
  cand({ id: 'c16', code: 'ƯV-250031', inputDate: '2025-11-20', fullName: 'Đinh Quốc Trung', email: 'trung.dq@gmail.com', phone: '0904 990 113', appliedPosition: 'Techlead', taInput: 'MenTT', source: 'Refer', referrerName: 'Đỗ Quốc Việt', university: 'ĐH Bách khoa Hà Nội', major: 'Khoa học máy tính', currentPosition: 'Techlead .NET', currentCompany: 'TMA', techStack: '.NET, Azure', skills: ['.NET'], stage: 'Onboarded', hr: { status: 'OfficialEmployee', employeeCode: 'NV0355', employeeName: 'Đinh Quốc Trung', startDate: '2026-06-01', officialDate: '2026-08-01' } }),
];

const app = (id: string, candidateId: string, requestId: string, stage: Stage, appliedDate: string, stageChangedAt = '', addedBy = 'MenTT'): RcApplication => ({
  id, candidateId, requestId, stage, appliedDate, stageChangedAt: stageChangedAt || appliedDate, addedBy,
});

export const SEED_APPLICATIONS: RcApplication[] = [
  app('a1', 'c1', 'rq1', 'Intv 1_Schedule', '2026-08-15', '2026-10-18'),
  app('a2', 'c1', 'rq9', 'TA Screen_Consider', '2026-10-03', '', 'NhuPTK'),
  app('a3', 'c2', 'rq8', 'Offering', '2026-09-29', '2026-10-19', 'XuanDTT'),
  app('a4', 'c3', 'rq1', 'TA Screen_Passed', '2026-08-21', '2026-09-02'),
  app('a5', 'c4', 'rq2', 'New', '2026-10-10', '', 'HungNV4'),
  app('a6', 'c5', 'rq3', 'Onboarded', '2026-07-23', '2026-09-07', 'HienNPM'),
  app('a7', 'c6', 'rq1', 'Offer Accepted', '2026-08-26', '2026-10-20'),
  app('a8', 'c7', 'rq2', 'Offer Accepted', '2026-10-09', '2026-10-16', 'HungNV4'),
  app('a9', 'c8', 'rq8', 'Offer Accepted', '2026-09-28', '2026-10-14', 'XuanDTT'),
  app('a10', 'c9', 'rq7', 'Offer Accepted', '2026-08-23', '2026-10-12', 'HangLT'),
  app('a11', 'c10', 'rq9', 'Offer Accepted', '2026-10-02', '2026-10-17', 'NhuPTK'),
  app('a12', 'c11', 'rq4', 'Offer Rejected', '2026-07-06', '2026-10-13', 'XuanDTT'),
  app('a13', 'c12', 'rq10', 'Intv 2_Schedule', '2026-10-07', '2026-10-20'),
  app('a14', 'c13', 'rq10', 'Intv 1_Failed', '2026-10-08', '2026-10-17'),
  app('a15', 'c14', 'rq6', 'HM Screen_Passed', '2026-09-16', '2026-10-05', 'SenNT'),
  app('a16', 'c16', 'rq11', 'Onboarded', '2026-05-10', '2026-06-01'),
];

export const SEED_MAIL_LOGS: MailLog[] = [
  {
    id: 'm1', candidateId: 'c1', applicationId: 'a1', kind: 'Mời phỏng vấn - Vòng 1', subject: '[VTX Group] Thư mời phỏng vấn vòng 1 - Software Developer', to: 'khoi.nm@gmail.com', cc: ['MenTT'],
    attachments: [], body: 'Kính gửi anh Nguyễn Minh Khôi, ... thời gian 14:00 23/10/2026, Teams.', sentAt: '2026-10-18T10:05:00', sentBy: 'MenTT', ok: true, eventId: 'evt-1',
  },
  {
    id: 'm2', candidateId: 'c2', applicationId: 'a3', kind: 'Offer Letter', subject: '[VTX Group] Thư mời nhận việc - DevOps Engineer', to: 'yen.tth@gmail.com', cc: ['XuanDTT'],
    attachments: ['Offer Letter - Tran Thi Hai Yen.docx'], body: 'Kính gửi chị Trần Thị Hải Yến, ...', sentAt: '2026-10-19T15:30:00', sentBy: 'XuanDTT', ok: true,
    offer: { position: 'DevOps Engineer', department: 'Khối BFSI', reportTo: 'Nguyễn Hải Đăng', workLocation: 'Trụ sở Hà Nội - Tầng 9, Toà Sông Đà', startDate: '2026-11-09', probationMonths: 2, salary: 40000000, probationPercent: 90, directors: ['Lương Minh Đức'] },
  },
  {
    id: 'm3', candidateId: 'c13', applicationId: 'a14', kind: 'Thư cảm ơn - fail phỏng vấn', subject: '[VTX Group] Cảm ơn bạn đã tham gia phỏng vấn', to: 'ngoc.tb@gmail.com', cc: [],
    attachments: [], body: 'Kính gửi chị Trịnh Bảo Ngọc, ...', sentAt: '2026-10-17T16:00:00', sentBy: 'MenTT', ok: false, error: 'Graph API 429 — gửi lại sau.',
  },
];

// --------------------------------------------------------------------------
// Dữ liệu bổ sung cho Báo cáo theo khối: trải đều các tháng 2026, nhiều khối / trạng thái / vòng.
// Sinh tất định (không random) để lần nào mở cũng ra cùng số.
// --------------------------------------------------------------------------
{
  type Spec = {
    block: string; pos: string; skill: string; level: string; ta: string; status: RequestStatus; recv: string; deadline?: string; end?: string;
    hc: number; staffing?: boolean; stages: Stage[]; onboardAt?: string[];
  };
  const SPECS: Spec[] = [
    { block: 'Khối G1', pos: 'Software Developer', skill: 'Java', level: 'Senior', ta: 'MenTT', status: 'Hoàn thành', recv: '2026-01-12', deadline: '2026-03-15', end: '2026-03-10', hc: 2,
      stages: ['Onboarded', 'Onboarded', 'Intv 2_Failed', 'TA Screen_Rejected', 'Not Interested'], onboardAt: ['2026-03-30', '2026-04-06'] },
    { block: 'Khối G1', pos: 'Software Developer', skill: 'NodeJS', level: 'Middle', ta: 'NhuPTK', status: 'Hoàn thành', recv: '2026-02-03', deadline: '2026-03-20', end: '2026-04-02', hc: 1,
      stages: ['Onboarded', 'Offer Rejected', 'Intv 1_Failed', 'HM Screen_Rejected'], onboardAt: ['2026-04-20'] },
    { block: 'Khối G1', pos: 'Tester', skill: 'Test', level: 'Junior', ta: 'MenTT', status: 'Đang tuyển', recv: '2026-09-02', deadline: '2026-10-10', hc: 3,
      stages: ['Onboarded', 'Offer Accepted', 'Intv 2_Passed', 'Intv 1_Passed', 'TA Screen_Passed', 'Applied', 'New'], onboardAt: ['2026-10-05'] },
    { block: 'Khối G2', pos: 'Data Analyst', skill: 'DA', level: 'Junior', ta: 'HienNPM', status: 'Hoàn thành', recv: '2026-03-05', deadline: '2026-05-05', end: '2026-05-02', hc: 2,
      stages: ['Onboarded', 'Onboarded', 'Offer Rejected', 'Intv 1_Failed'], onboardAt: ['2026-05-18', '2026-05-25'] },
    { block: 'Khối G2', pos: 'Business Analyst', skill: 'BA', level: 'Senior', ta: 'HangLT', status: 'Đang tuyển', recv: '2026-08-18', deadline: '2026-10-05', hc: 2,
      stages: ['Offering', 'Intv 2_Schedule', 'Intv 1_Passed', 'HM Screen_Passed', 'TA Screen_Consider'] },
    { block: 'Khối G2', pos: 'Project Manager', skill: 'PM', level: 'Senior', ta: 'SenNT', status: 'Hoàn thành', recv: '2026-04-06', deadline: '2026-06-30', end: '2026-06-12', hc: 1,
      stages: ['Onboarded', 'Intv Pass _ No Offer', 'Intv 1_Failed'], onboardAt: ['2026-07-06'] },
    { block: 'Khối G3', pos: 'Techlead', skill: '.NET', level: 'Lead', ta: 'MenTT', status: 'Đang tuyển', recv: '2026-07-14', deadline: '2026-10-31', hc: 1,
      stages: ['Intv 2_Passed', 'Intv 1_Passed', 'TA Screen_Passed', 'Applied'] },
    { block: 'Khối G3', pos: 'Software Developer', skill: '.NET', level: 'Middle', ta: 'LyTH1', status: 'Hoàn thành', recv: '2026-05-11', deadline: '2026-07-10', end: '2026-07-24', hc: 2,
      stages: ['Onboarded', 'Onboarded', 'Offer Accepted', 'Intv 2_Failed'], onboardAt: ['2026-08-10', '2026-08-17'] },
    { block: 'Khối G3', pos: 'IT Support', skill: 'ITsupport', level: 'Fresher', ta: 'LyTH1', status: 'Tạm dừng', recv: '2026-06-08', hc: 1,
      stages: ['TA Screen_Passed', 'Applied', 'Pending'] },
    { block: 'Khối G4', pos: 'Accountant', skill: 'Tax Accountant', level: 'Senior', ta: 'HangLT', status: 'Hoàn thành', recv: '2026-02-16', deadline: '2026-04-15', end: '2026-04-14', hc: 1,
      stages: ['Onboarded', 'Intv 2_Failed', 'TA Screen_Rejected'], onboardAt: ['2026-05-04'] },
    { block: 'Khối G4', pos: 'Accountant', skill: 'Tax Accountant', level: 'Junior', ta: 'NhuPTK', status: 'Đang tuyển', recv: '2026-09-21', deadline: '2026-11-20', hc: 2,
      stages: ['Intv 1_Schedule', 'HM Screen_Passed', 'TA Screen_Passed', 'Applied', 'New'] },
    { block: 'Khối BFSI', pos: 'DevOps Engineer', skill: 'DevOps', level: 'Middle', ta: 'XuanDTT', status: 'Hoàn thành', recv: '2026-01-26', deadline: '2026-03-31', end: '2026-03-27', hc: 3,
      stages: ['Onboarded', 'Onboarded', 'Onboarded', 'Offer Rejected', 'Intv 2_Failed', 'Not Interested'], onboardAt: ['2026-04-13', '2026-04-20', '2026-05-04'] },
    { block: 'Khối BFSI', pos: 'Business Analyst', skill: 'BA', level: 'Middle', ta: 'HungNV4', status: 'Chờ nhận việc', recv: '2026-08-03', deadline: '2026-10-15', hc: 2,
      stages: ['Onboarded', 'Offer Accepted', 'Intv 2_Failed', 'Intv 1_Failed'], onboardAt: ['2026-10-12'] },
    { block: 'Khối BFSI', pos: 'Software Developer', skill: 'Java', level: 'Senior', ta: 'XuanDTT', status: 'Đang tuyển', recv: '2026-10-12', deadline: '2026-12-31', hc: 2,
      stages: ['Applied', 'TA Screen_Consider', 'TA Screen_Passed', 'New', 'New'] },
    { block: 'Khối Staffing', pos: 'Tester', skill: 'Test', level: 'Middle', ta: 'MenTT', status: 'Hoàn thành', recv: '2026-06-22', deadline: '2026-08-10', end: '2026-08-05', hc: 2, staffing: true,
      stages: ['Onboarded', 'Onboarded', 'Intv 1_Failed'], onboardAt: ['2026-08-24', '2026-09-01'] },
    { block: 'Khối Staffing', pos: 'Software Developer', skill: 'Java', level: 'Senior', ta: 'SenNT', status: 'Đang tuyển', recv: '2026-09-28', deadline: '2026-10-20', hc: 3, staffing: true,
      stages: ['Offering', 'Intv 2_Schedule', 'Intv 1_Passed', 'Intv 1_Schedule', 'TA Screen_Passed'] },
    { block: 'Back Office', pos: 'Accountant', skill: 'Tax Accountant', level: 'Junior', ta: 'HangLT', status: 'Hủy', recv: '2026-03-23', end: '2026-05-08', hc: 1,
      stages: ['TA Screen_Passed', 'Applied'] },
  ];
  // Thêm ~34 request sinh tất định: nhiều khối/level/skill, đủ trạng thái, có job thiếu Deadline, nhiều TA, onboard dồn tháng 9–10
  {
    const BL = ['Khối G1', 'Khối G2', 'Khối G3', 'Khối G4', 'Khối BFSI', 'Khối Staffing', 'Back Office'];
    const POS: [string, string][] = [['Software Developer', 'Java'], ['Software Developer', 'NodeJS'], ['Business Analyst', 'BA'], ['Tester', 'Test'], ['DevOps Engineer', 'DevOps'],
      ['Data Analyst', 'DA'], ['Project Manager', 'PM'], ['Techlead', '.NET'], ['Product Designer', 'UIUX'], ['Accountant', 'Tax Accountant']];
    const LV = ['Fresher', 'Junior', 'Middle', 'Senior', 'Lead', 'Manager'];
    const TAS = ['MenTT', 'NhuPTK', 'HienNPM', 'HangLT', 'XuanDTT', 'LyTH1', 'HungNV4', 'SenNT'];
    const ST: RequestStatus[] = ['Đang tuyển', 'Đang tuyển', 'Đang tuyển', 'Chờ nhận việc', 'Hoàn thành', 'Hoàn thành', 'Chờ phê duyệt', 'Tạm dừng', 'Hủy'];
    const PIPE: Stage[][] = [
      ['Offer Accepted', 'Intv 2_Passed', 'Intv 1_Passed', 'HM Screen_Passed', 'TA Screen_Passed', 'Applied'],
      ['Onboarded', 'Offering', 'Intv 2_Schedule', 'Intv 1_Failed', 'TA Screen_Consider', 'New'],
      ['Intv 1_Schedule', 'TA Screen_Passed', 'TA Screen_Rejected', 'Applied'],
      ['Onboarded', 'Onboarded', 'Offer Rejected', 'Intv 2_Failed', 'HM Screen_Rejected'],
      ['Applied', 'New', 'Not Interested'],
    ];
    const iso = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    for (let i = 0; i < 34; i++) {
      const status = ST[i % ST.length];
      const closed = status === 'Hoàn thành' || status === 'Hủy' || status === 'Tạm dừng';
      const rm = 1 + ((i * 5) % 10);                      // tháng nhận 1..10
      const rd = 1 + ((i * 7) % 27);
      const recv = iso(2026, rm, rd);
      const dlM = Math.min(12, rm + 2), dlD = 1 + ((i * 11) % 27);
      const deadline = i % 9 === 4 ? undefined : iso(2026, dlM, dlD);       // một số job thiếu Deadline
      const endM = Math.min(10, rm + 1 + (i % 3));
      const end = status === 'Hoàn thành' || status === 'Hủy' ? iso(2026, endM, 1 + ((i * 3) % 27)) : undefined;
      const [pos, skill] = POS[i % POS.length];
      const pipe = PIPE[i % PIPE.length];
      const onb = pipe.filter((x) => x === 'Onboarded').length;
      SPECS.push({
        block: BL[i % BL.length], pos, skill, level: LV[(i * 2) % LV.length], ta: TAS[i % TAS.length], status: closed && status === 'Tạm dừng' ? status : status,
        recv, deadline, end, hc: 1 + (i % 4), staffing: i % 7 === 3,
        stages: pipe, onboardAt: Array.from({ length: onb }, (_, k) => iso(2026, Math.min(10, 4 + ((i + k * 3) % 7)), Math.min(22, 3 + ((i * 5 + k * 9) % 19)))),
      });
    }
  }
  const SURNAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô'];
  const MIDDLES = ['Minh', 'Thu', 'Quốc', 'Hải', 'Ngọc', 'Gia', 'Bảo', 'Thanh', 'Đức', 'Phương'];
  const GIVENS = ['An', 'Bình', 'Cường', 'Dũng', 'Giang', 'Hà', 'Khánh', 'Linh', 'Mai', 'Nam', 'Phúc', 'Quân', 'Sơn', 'Trang', 'Việt'];
  const SOURCES = ['LinkedIn', 'TopCV', 'ITViec', 'Headhunt', 'Facebook'];
  let n = 0, c = 0;
  for (const sp of SPECS) {
    n++;
    const rid = `rx${n}`;
    const short = BLOCKS.find((b) => b.name === sp.block)?.shortName || sp.block;
    SEED_REQUESTS.push(req({
      id: rid, code: `R-${sp.recv.slice(0, 4)}-${short}-${String(100 + n)}`, priority: n % 3 === 0 ? 'High' : '', status: sp.status, block: sp.block, position: sp.pos,
      skill: sp.skill, level: sp.level, taPics: [sp.ta], dateReceived: sp.recv, deadline: sp.deadline || '', endDate: sp.end || '', headcount: sp.hc,
      isStaffing: !!sp.staffing, note: sp.status === 'Hủy' ? 'Khối huỷ nhu cầu.' : '',
    }));
    let ob = 0;
    sp.stages.forEach((stage) => {
      c++;
      const cid = `cx${c}`;
      const full = `${SURNAMES[c % 10]} ${MIDDLES[(c * 3) % 10]} ${GIVENS[c % 15]}`;
      const applied = new Date(new Date(sp.recv).getTime() + (3 + (c % 9)) * 86400000).toISOString().slice(0, 10);
      SEED_CANDIDATES.push(cand({
        id: cid, code: `UV${String(200 + c).padStart(5, '0')}`, inputDate: applied, fullName: full, email: `test.uv${c}@example.com`,
        phone: `09${String(10000000 + c * 7919).slice(0, 8)}`, appliedPosition: sp.pos, taInput: sp.ta, source: SOURCES[c % 5], stage,
      }));
      const changed = stage === 'Onboarded' ? (sp.onboardAt?.[ob++] || applied) : '';
      SEED_APPLICATIONS.push(app(`ax${c}`, cid, rid, stage, applied, changed, sp.ta));
    });
  }
}

export const SEED_LOGS: BizLog[] = [
  { id: 'l1', entity: 'candidate', entityId: 'c1', at: '2026-08-14T09:10:00', by: 'MenTT', action: 'Tạo hồ sơ ứng viên' },
  { id: 'l2', entity: 'candidate', entityId: 'c1', at: '2026-08-15T10:00:00', by: 'MenTT', action: 'Gán yêu cầu tuyển dụng', changes: [{ field: 'Yêu cầu tuyển dụng', from: '', to: 'R-2026-G1-001' }] },
  { id: 'l3', entity: 'candidate', entityId: 'c1', at: '2026-10-18T10:05:00', by: 'MenTT', action: 'Đổi vòng tuyển dụng', changes: [{ field: 'Vòng (R-2026-G1-001)', from: 'HM Screen_Passed', to: 'Intv 1_Schedule' }] },
];
