/**
 * Thiết lập email Onboarding — mẫu email gửi ứng viên theo đối tượng (Nội bộ / Staffing):
 *  - Chung: khi HCNS Accept → email link form thông tin cá nhân.
 *  - Nội bộ: ngày onboard → email tài khoản (email cá nhân) + email Welcome Kit (email công ty).
 *  - Staffing: trước ngày onboard 3 ngày → email bộ tài liệu; 07:00 ngày onboard → email tài khoản.
 * Mỗi mẫu: thời điểm gửi, người nhận, tiêu đề, nội dung (biến {…}), tệp đính kèm, bật / tắt.
 */
import type { OnbRecord } from './onboardingData';

export type OnbMailAudience = 'Chung' | 'Nội bộ' | 'Staffing';
export const ONB_MAIL_AUDIENCES: OnbMailAudience[] = ['Chung', 'Nội bộ', 'Staffing'];
export type OnbMailTrigger = 'accept' | 'before' | 'onboardDay';
export const ONB_MAIL_TRIGGERS: { key: OnbMailTrigger; label: string }[] = [
  { key: 'accept', label: 'Ngay khi HCNS Accept' },
  { key: 'before', label: 'Trước ngày onboard' },
  { key: 'onboardDay', label: 'Ngày onboard' },
];
export type OnbMailTo = 'personal' | 'company';
export const ONB_MAIL_TO: { key: OnbMailTo; label: string }[] = [
  { key: 'personal', label: 'Email cá nhân ứng viên' },
  { key: 'company', label: 'Email công ty (IT cấp)' },
];

export interface OnbMailAttachment {
  id: string;
  name: string;
  size: number;
  /** object URL khi tải lên trong phiên (prototype) */
  url?: string;
}

export interface OnbMailTemplate {
  key: string;
  name: string;
  audience: OnbMailAudience;
  trigger: OnbMailTrigger;
  /** Số ngày trước ngày onboard (trigger = before) */
  daysBefore: number;
  /** Giờ gửi HH:mm (trigger before / onboardDay) */
  time: string;
  to: OnbMailTo;
  /** CC, cách nhau dấu phẩy */
  cc: string;
  subject: string;
  /** Nội dung — xuống dòng giữ nguyên, biến dạng {HoTen} */
  body: string;
  attachments: OnbMailAttachment[];
  active: boolean;
  /** Mẫu hệ thống (không xoá, chỉ tắt) */
  system?: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

/** Biến dùng trong tiêu đề / nội dung. */
export const ONB_MAIL_VARS: { key: string; label: string; sample: string }[] = [
  { key: 'HoTen', label: 'Họ tên ứng viên', sample: 'Trần Minh Anh' },
  { key: 'ViTri', label: 'Vị trí', sample: 'Software Developer' },
  { key: 'Level', label: 'Level', sample: 'Middle' },
  { key: 'PhongBan', label: 'Bộ phận', sample: 'G4 · Phòng Phát triển phần mềm 4' },
  { key: 'Khoi', label: 'Khối', sample: 'Khối G4' },
  { key: 'QuanLy', label: 'Quản lý trực tiếp', sample: 'Cao Tiến Dũng' },
  { key: 'DiaDiem', label: 'Địa điểm làm việc', sample: 'HN - HO' },
  { key: 'CongTy', label: 'Công ty', sample: 'AEQUITAS' },
  { key: 'NgayOnboard', label: 'Ngày onboard', sample: '23/11/2026' },
  { key: 'LinkForm', label: 'Link form thông tin', sample: 'https://imis.aequitas.com.vn/onboard/form/onb-2026-099' },
  { key: 'EmailCaNhan', label: 'Email cá nhân', sample: 'minhanh.demo@gmail.com' },
  { key: 'EmailCongTy', label: 'Email công ty', sample: 'anhtm@aequitas.com.vn' },
  { key: 'TenTaiKhoan', label: 'Tên tài khoản', sample: 'anhtm' },
  { key: 'MatKhau', label: 'Mật khẩu tạm', sample: 'Kxyzq#482M' },
  { key: 'HCNS', label: 'Người phụ trách HCNS', sample: 'Nguyễn Thị Mai' },
];
export const sampleVars = () => Object.fromEntries(ONB_MAIL_VARS.map((v) => [v.key, v.sample]));

export const fillTemplate = (text: string, vars: Record<string, string>) => text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] || '' : m));

const ymd = (iso: string, addDays: number) => {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  d.setDate(d.getDate() + addDays);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
/** Thời điểm gửi (ISO local) theo ngày onboard; trigger accept ⇒ ''. */
export const scheduledAt = (t: Pick<OnbMailTemplate, 'trigger' | 'daysBefore' | 'time'>, startDate: string) =>
  t.trigger === 'accept' || !startDate ? '' : `${ymd(startDate, t.trigger === 'before' ? -Math.max(0, t.daysBefore) : 0)}T${t.time || '08:00'}:00`;

/** "Ngay khi HCNS Accept" / "Trước 3 ngày · 08:00" / "Ngày onboard · 07:00". */
export const timingText = (t: Pick<OnbMailTemplate, 'trigger' | 'daysBefore' | 'time'>) =>
  t.trigger === 'accept' ? 'Ngay khi HCNS Accept' : t.trigger === 'before' ? `Trước ${t.daysBefore} ngày onboard · ${t.time}` : `Ngày onboard · ${t.time}`;

/** Mẫu áp dụng cho 1 đối tượng (gồm mẫu Chung), đang bật. */
export const templatesFor = (all: OnbMailTemplate[], type: string, trigger?: OnbMailTrigger) =>
  all.filter((t) => t.active && (t.audience === 'Chung' || t.audience === (type || 'Nội bộ')) && (!trigger || t.trigger === trigger));

/** Biến của 1 phiếu onboard. */
export const varsOf = (r: OnbRecord, extra: { formLink?: string; password?: string; hcns?: string } = {}): Record<string, string> => {
  const it = r.tasks?.find((t) => t.key === 'itAccount')?.itRet;
  return {
    HoTen: r.data.fullName,
    ViTri: r.data.position,
    Level: r.data.level,
    PhongBan: r.data.department,
    Khoi: r.block,
    QuanLy: r.data.manager,
    DiaDiem: r.data.workLocation,
    CongTy: r.company,
    NgayOnboard: r.data.startDate ? r.data.startDate.split('-').reverse().join('/') : '',
    LinkForm: extra.formLink || r.tasks?.find((t) => t.key === 'personalForm')?.formLink || '',
    EmailCaNhan: r.candidateEmail,
    EmailCongTy: r.account.companyEmail || it?.email || '(IT chưa cấp)',
    TenTaiKhoan: r.account.userName || it?.accountName || '(IT chưa cấp)',
    MatKhau: extra.password || it?.password || '(IT chưa cấp)',
    HCNS: extra.hcns || r.decidedBy || '',
  };
};

export const fmtSize = (n: number) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

const att = (name: string, size: number): OnbMailAttachment => ({ id: `att-${name}`, name, size });

export const SEED_ONB_TEMPLATES: OnbMailTemplate[] = [
  {
    key: 'FORM_LINK',
    name: 'Form thông tin cá nhân',
    audience: 'Chung',
    trigger: 'accept',
    daysBefore: 0,
    time: '08:00',
    to: 'personal',
    cc: 'hcns@company.vn',
    subject: 'Chào mừng {HoTen} — vui lòng điền thông tin cá nhân trước ngày nhận việc {NgayOnboard}',
    body:
      'Chào {HoTen},\n\nChúc mừng bạn đã chính thức nhận lời mời làm việc tại {CongTy} ở vị trí {ViTri} ({PhongBan}).\n\nĐể chuẩn bị hồ sơ và tài khoản cho ngày nhận việc {NgayOnboard}, bạn vui lòng điền thông tin cá nhân tại đường dẫn sau:\n{LinkForm}\n\nThông tin gồm: thông tin cơ bản, CCCD, mã số thuế, địa chỉ, tài khoản nhận lương và học vấn.\n\nNếu cần hỗ trợ, bạn vui lòng phản hồi email này.\n\nTrân trọng,\n{HCNS} — Phòng Hành chính Nhân sự',
    attachments: [],
    active: true,
    system: true,
  },
  {
    key: 'INTERNAL_ACCOUNT',
    name: 'Thông tin tài khoản (Nội bộ)',
    audience: 'Nội bộ',
    trigger: 'onboardDay',
    daysBefore: 0,
    time: '08:00',
    to: 'personal',
    cc: 'hcns@company.vn',
    subject: '[{CongTy}] Thông tin tài khoản làm việc của {HoTen}',
    body:
      'Chào {HoTen},\n\nChào mừng bạn đến với {CongTy} trong ngày làm việc đầu tiên!\n\nThông tin tài khoản của bạn:\n- Email công ty: {EmailCongTy}\n- Tên tài khoản: {TenTaiKhoan}\n- Mật khẩu tạm: {MatKhau}\n\nVui lòng đổi mật khẩu ở lần đăng nhập đầu tiên. Hướng dẫn đăng nhập các hệ thống được đính kèm.\n\nQuản lý trực tiếp của bạn: {QuanLy}. Địa điểm làm việc: {DiaDiem}.\n\nTrân trọng,\n{HCNS} — Phòng Hành chính Nhân sự',
    attachments: [att('Huong_dan_dang_nhap_he_thong.pdf', 412_000)],
    active: true,
    system: true,
  },
  {
    key: 'INTERNAL_WELCOME_KIT',
    name: 'Bộ Welcome Kit (Nội bộ)',
    audience: 'Nội bộ',
    trigger: 'onboardDay',
    daysBefore: 0,
    time: '08:00',
    to: 'company',
    cc: 'hcns@company.vn, marcom@company.vn',
    subject: 'Welcome to {CongTy} — Bộ Welcome Kit dành cho {HoTen}',
    body:
      'Chào {HoTen},\n\nBan lãnh đạo và tập thể {CongTy} chào mừng bạn gia nhập {PhongBan}!\n\nĐính kèm là bộ Welcome Kit gồm: giới thiệu công ty, sổ tay nhân viên, nội quy lao động và các kênh liên lạc nội bộ. Bạn vui lòng đọc trong tuần đầu tiên.\n\nChúc bạn có những ngày làm việc đầu tiên thật hứng khởi.\n\nTrân trọng,\nPhòng Hành chính Nhân sự & MarCom',
    attachments: [att('Welcome_Kit.pdf', 3_850_000), att('So_tay_nhan_vien.pdf', 1_240_000), att('Noi_quy_lao_dong.pdf', 680_000)],
    active: true,
    system: true,
  },
  {
    key: 'STAFFING_DOCS',
    name: 'Bộ tài liệu Staffing',
    audience: 'Staffing',
    trigger: 'before',
    daysBefore: 3,
    time: '08:00',
    to: 'personal',
    cc: 'hcns@company.vn',
    subject: '[{CongTy}] Bộ tài liệu chuẩn bị onboard ngày {NgayOnboard} — {HoTen}',
    body:
      'Chào {HoTen},\n\nCòn 3 ngày nữa là ngày bạn bắt đầu làm việc ({NgayOnboard}) tại {DiaDiem}.\n\nĐính kèm là bộ tài liệu chuẩn bị onboard dành cho nhân sự Staffing: quy định làm việc tại khách hàng, cam kết bảo mật thông tin và hướng dẫn ngày đầu tiên. Bạn vui lòng đọc, ký cam kết bảo mật và mang theo bản cứng vào ngày onboard.\n\nĐầu mối hỗ trợ: {QuanLy}.\n\nTrân trọng,\n{HCNS} — Phòng Hành chính Nhân sự',
    attachments: [att('Bo_tai_lieu_Staffing.pdf', 2_100_000), att('Quy_dinh_lam_viec_tai_khach_hang.pdf', 540_000), att('Cam_ket_bao_mat_NDA.docx', 96_000)],
    active: true,
    system: true,
  },
  {
    key: 'STAFFING_ACCOUNT',
    name: 'Thông tin tài khoản (Staffing)',
    audience: 'Staffing',
    trigger: 'onboardDay',
    daysBefore: 0,
    time: '07:00',
    to: 'personal',
    cc: 'hcns@company.vn',
    subject: '[{CongTy}] Thông tin tài khoản ngày làm việc đầu tiên — {HoTen}',
    body:
      'Chào {HoTen},\n\nHôm nay là ngày làm việc đầu tiên của bạn. Thông tin tài khoản:\n- Email công ty: {EmailCongTy}\n- Tên tài khoản: {TenTaiKhoan}\n- Mật khẩu tạm: {MatKhau}\n\nVui lòng đổi mật khẩu ở lần đăng nhập đầu tiên. Địa điểm làm việc: {DiaDiem}; đầu mối: {QuanLy}.\n\nTrân trọng,\n{HCNS} — Phòng Hành chính Nhân sự',
    attachments: [att('Huong_dan_dang_nhap_he_thong.pdf', 412_000)],
    active: true,
    system: true,
  },
];
