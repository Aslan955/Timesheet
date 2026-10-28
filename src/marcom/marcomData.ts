/**
 * MarCom — dữ liệu mẫu + logic dùng chung cho các màn Sinh nhật / Welcome Onboard / Email tự động.
 * Ảnh nhân sự lấy từ hồ sơ Employee (không có kho ảnh riêng).
 *
 * Dữ liệu sinh theo NGÀY HIỆN TẠI để demo lúc nào mở cũng có:
 *  - vài nhân sự sinh nhật đúng hôm nay, trong tuần, trong tháng;
 *  - nhân sự onboard rải quanh đợt Welcome (thứ 3) của tuần hiện tại / tuần trước / tuần sau.
 * Tên nhân sự là tên giả, không dùng dữ liệu thật.
 */

/** Trạng thái hồ sơ Employee (phần liên quan MarCom). */
export type EmployeeStatus = 'Working' | 'Resigned' | 'Cancel Onboard';
export const EMPLOYEE_STATUS_LABEL: Record<EmployeeStatus, string> = {
  Working: 'Đang làm việc',
  Resigned: 'Đã nghỉ việc',
  'Cancel Onboard': 'Cancel Onboard',
};

export interface MarcomEmployee {
  id: string;
  code: string;
  name: string;
  division: string; // Division (Khối)
  position: string;
  email: string;
  dob: string; // YYYY-MM-DD
  photoUrl: string | null; // null = chưa có ảnh trên hồ sơ
  photoUpdatedAt: string | null; // YYYY-MM-DD
  /** Ngày onboard (ngày vào làm thực tế / dự kiến). Nhân sự cũ cũng có, chỉ nhân sự mới dùng cho Welcome. */
  onboardDate: string;
  isNewHire: boolean;
  status: EmployeeStatus;
  /** = status 'Working'. false (nghỉ việc / Cancel Onboard) → không hiện box sinh nhật, không gửi mail, không vào đợt Welcome. */
  active: boolean;
  /** Lý do huỷ khi status = 'Cancel Onboard' (HCNS nhập). */
  cancelReason?: string;
  /** Nguồn ảnh MarCom dùng: 'upload' khi đã có ảnh tải lên, ngược lại 'employee'; photoUrl = ảnh hiệu lực. */
  photoSource?: PhotoSource;
  /** Ảnh gốc trên hồ sơ Employee. */
  employeePhotoUrl?: string | null;
  /** Ảnh MarCom tải lên. */
  uploadedPhotoUrl?: string | null;
  uploadedPhotoName?: string | null;
}

export type PhotoSource = 'employee' | 'upload';

/** Dung lượng tối đa mọi ảnh MarCom tải lên (ảnh chúc mừng, banner, ảnh nền, nền thiệp). */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Tạm ẩn kênh đăng bài Microsoft Teams (UI + logic khoá ảnh) — đổi true để bật lại. */
export const TEAMS_POST_ENABLED = false;

export type MailKind = 'birthday' | 'welcome';
export type MailStatus = 'sent' | 'failed' | 'skipped' | 'test';

export interface MailLog {
  id: string;
  kind: MailKind;
  employeeId: string;
  employeeName: string;
  to: string;
  sentAt: string; // ISO
  status: MailStatus;
  note?: string;
}

export interface OnboardChange {
  id: string;
  at: string; // ISO
  employeeId: string;
  employeeName: string;
  from: string;
  to: string; // '' = Cancel Onboard (trạng thái Employee chuyển 'Cancel Onboard')
  by: string;
  reason: string;
}

// ---------------------------------------------------------------------------
// Ngày giờ
// ---------------------------------------------------------------------------
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d: Date, n: number) => {
  const r = startOfDay(d);
  r.setDate(r.getDate() + n);
  return r;
};
export const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const fromKey = (k: string) => {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const fmtDate = (k: string | Date) => {
  const d = typeof k === 'string' ? fromKey(k) : k;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};
export const fmtDayMonth = (k: string | Date) => fmtDate(k).slice(0, 5);
export const WEEKDAY_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
export const WEEKDAY_LONG = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
export const weekdayOf = (k: string | Date) => (typeof k === 'string' ? fromKey(k) : k).getDay();
export const fmtTime = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
export const fmtDateTime = (iso: string) => `${fmtDate(new Date(iso))} ${fmtTime(iso)}`;

/** Đã qua mốc giờ "HH:mm" của ngày hôm nay chưa. */
export const isPastTimeToday = (hhmm: string, now = new Date()) => {
  const [h, m] = hhmm.split(':').map(Number);
  return now.getHours() * 60 + now.getMinutes() >= h * 60 + m;
};

// ---------------------------------------------------------------------------
// Logic đợt Welcome Onboard
//   Đợt Welcome = thứ 3 hằng tuần. Nhân sự thuộc đợt thứ 3 GẦN NHẤT KỂ TỪ ngày onboard (tính cả chính thứ 3 đó):
//     onboard T2/T3  → đợt thứ 3 tuần này
//     onboard T4..CN → đợt thứ 3 tuần sau
//   ⇔ đợt thứ 3 ngày T gồm nhân sự onboard từ thứ 4 tuần trước (T-6) đến hết thứ 3 (T).
// ---------------------------------------------------------------------------
export const batchTuesdayOf = (k: string | Date) => {
  const d = startOfDay(typeof k === 'string' ? fromKey(k) : k);
  return addDays(d, (2 - d.getDay() + 7) % 7);
};
export const batchWindow = (tuesday: Date) => ({ from: addDays(tuesday, -6), to: startOfDay(tuesday) });

/** Hạn chốt danh sách gửi MarCom: 17:00 thứ 2 trước đợt (đề xuất). */
export const batchDeadline = (tuesday: Date) => {
  const d = addDays(tuesday, -1);
  d.setHours(17, 0, 0, 0);
  return d;
};

export type BatchPhase = 'upcoming' | 'collecting' | 'locked' | 'done';
export const batchPhase = (tuesday: Date, now = new Date()): BatchPhase => {
  const endOfTuesday = addDays(tuesday, 1);
  if (now >= endOfTuesday) return 'done';
  if (now >= batchDeadline(tuesday)) return 'locked';
  if (now >= batchWindow(tuesday).from) return 'collecting';
  return 'upcoming';
};

/** Nhân sự mới thuộc diện Welcome: xếp đợt theo ngày onboard.
 *  - Hoãn = HCNS đổi sang ngày onboard mới → tự xếp lại đợt.
 *  - Cancel Onboard = trạng thái Employee chuyển sang 'Cancel Onboard' → KHÔNG vào đợt Welcome nào, không gửi mail Welcome. */
export const inWelcomeBatch = (e: MarcomEmployee) => e.isNewHire && e.status === 'Working';
export const isCancelOnboard = (e: MarcomEmployee) => e.isNewHire && e.status === 'Cancel Onboard';

// ---------------------------------------------------------------------------
// Ảnh đại diện mẫu (SVG nội tuyến, không phụ thuộc mạng)
// ---------------------------------------------------------------------------
const PALETTE: [string, string][] = [
  ['#0fa57c', '#34d399'],
  ['#3197e5', '#7dd3fc'],
  ['#9b51e0', '#c4b5fd'],
  ['#f59e0b', '#fde68a'],
  ['#e11d48', '#fda4af'],
  ['#0891b2', '#67e8f9'],
  ['#4f46e5', '#a5b4fc'],
  ['#ea580c', '#fdba74'],
];
const initials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return ((parts[parts.length - 2]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '')).toUpperCase();
};
export const makeAvatar = (name: string, seed: number) => {
  const [a, b] = PALETTE[seed % PALETTE.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="240" height="240" fill="url(#g)"/><circle cx="120" cy="96" r="44" fill="#fff" fill-opacity=".28"/><path d="M40 240c8-52 42-78 80-78s72 26 80 78z" fill="#fff" fill-opacity=".28"/><text x="120" y="112" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="46" font-weight="800" fill="#fff">${initials(name)}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// ---------------------------------------------------------------------------
// Sinh dữ liệu mẫu
// ---------------------------------------------------------------------------
/** Division (Khối) — cùng bộ khối với module Kinh doanh (G1–G4, BFSI, GPDV) + khối hỗ trợ. */
export const DIVISIONS = ['G1', 'G2', 'G3', 'G4', 'BFSI', 'GPDV', 'Back Office'];
const POSITIONS: Record<string, string[]> = {
  G1: ['Developer', 'Senior Developer', 'Tech Lead', 'Tester'],
  G2: ['Developer', 'Business Analyst', 'Project Manager', 'DevOps Engineer'],
  G3: ['Developer', 'QA Engineer', 'Tech Lead'],
  G4: ['Business Analyst', 'Developer', 'Project Manager'],
  BFSI: ['Account Manager', 'Presales', 'Business Analyst'],
  GPDV: ['Developer', 'Tester', 'Project Manager'],
  'Back Office': ['HR Executive', 'Kế toán viên', 'MarCom Executive', 'PMO Officer'],
};
const NAMES = [
  'Nguyễn Minh Anh', 'Trần Quốc Bảo', 'Lê Thu Hà', 'Phạm Đức Huy', 'Hoàng Gia Linh', 'Vũ Thành Nam', 'Đặng Khánh Vy',
  'Bùi Tuấn Kiệt', 'Đỗ Mai Phương', 'Ngô Hải Đăng', 'Dương Ngọc Trâm', 'Lý Hoàng Long', 'Phan Thảo My', 'Trịnh Văn Quân',
  'Đinh Bảo Ngọc', 'Mai Xuân Trường', 'Tạ Hồng Nhung', 'Lương Đức Thịnh', 'Hồ Thanh Tâm', 'Châu Minh Khôi', 'Kiều Lan Chi',
  'Cao Nhật Minh', 'Tô Phương Thảo', 'Quách Anh Tuấn', 'Lâm Diệu Linh', 'Võ Trọng Nghĩa', 'Âu Bích Ngân', 'Hà Quang Vinh',
  'Triệu Yến Nhi', 'Nghiêm Hữu Phước', 'Thái Kim Oanh', 'Doãn Tiến Dũng', 'Giang Thu Trang', 'Mạc Đình Phong', 'Ninh Hạnh Dung',
  'Khúc Việt Hoàng', 'Lã Minh Thư', 'Viên Công Sơn', 'Từ Ngọc Diệp', 'Ông Bá Lộc',
];
const NEW_HIRE_NAMES = [
  'Phùng Gia Hân', 'Lục Minh Đức', 'Tăng Bảo Châu', 'Bạch Quốc Việt', 'Hứa Thanh Vân', 'Kha Nhật Huy', 'Văn Thùy Dương',
  'Thân Đức Anh', 'Cù Hải Yến', 'Chu Minh Hiếu', 'Ứng Khả Tú', 'La Tuấn Phong', 'Diệp Ánh Tuyết', 'Sầm Hoàng Phúc',
  'Vương Ngọc Hân', 'Lê Hoài An', 'Trương Mỹ Linh',
];

const slug = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .split(/\s+/);
const emailOf = (name: string) => {
  const p = slug(name);
  return `${p[p.length - 1]}.${p.slice(0, -1).map((s) => s[0]).join('')}@aequitas.vn`;
};

/** Sinh danh sách nhân sự mẫu theo ngày tham chiếu (mặc định hôm nay). */
export const buildEmployees = (ref = new Date()): MarcomEmployee[] => {
  const today = startOfDay(ref);
  const y = today.getFullYear();
  const m = today.getMonth();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const list: MarcomEmployee[] = [];

  // Ngày-tháng sinh: 3 người đúng hôm nay, ~10 người trong tháng này, còn lại rải đều cả năm
  const dobFor = (i: number): string => {
    const year = 1984 + ((i * 7) % 17);
    if (i < 3) return toKey(new Date(year, m, today.getDate()));
    if (i < 13) {
      const day = ((i * 5 + 2) % daysInMonth) + 1;
      return toKey(new Date(year, m, day === today.getDate() ? Math.min(day + 1, daysInMonth) : day));
    }
    return toKey(new Date(year, (m + 1 + i) % 12, ((i * 11) % 28) + 1));
  };

  NAMES.forEach((name, i) => {
    const division = DIVISIONS[i % DIVISIONS.length];
    const positions = POSITIONS[division];
    const noPhoto = i === 9 || i === 27 || i === 34;
    list.push({
      id: `E${String(i + 1).padStart(3, '0')}`,
      code: `SYN${String(1020 + i * 3).padStart(5, '0')}`,
      name,
      division,
      position: positions[i % positions.length],
      email: emailOf(name),
      dob: dobFor(i),
      photoUrl: noPhoto ? null : makeAvatar(name, i),
      photoUpdatedAt: noPhoto ? null : toKey(addDays(today, -((i * 13) % 300) - 3)),
      onboardDate: toKey(new Date(2018 + (i % 7), (i * 3) % 12, ((i * 7) % 27) + 1)),
      isNewHire: false,
      status: i === 12 ? 'Resigned' : 'Working', // 1 người sinh nhật trong tháng nhưng đã nghỉ việc → bị loại
      active: i !== 12,
    });
  });

  // Nhân sự mới — rải quanh đợt Welcome tuần này
  const tue = batchTuesdayOf(today);
  const offsets: number[] = [
    -10, -8, -7, -7, // đợt trước (đã Welcome)
    -5, -1, 0, 0, 0, 0, 0, 0, // đợt này: thứ 5 tuần trước, thứ 2, thứ 3 x6
    1, 1, 3, // đợt sau: thứ 4 x2, thứ 6
    0, -1, // Cancel Onboard: dự kiến onboard thứ 3 / thứ 2 đợt này nhưng đã huỷ
  ];
  const CANCEL_REASONS = ['Ứng viên từ chối offer, nhận việc nơi khác', 'Ứng viên không đến nhận việc, không liên lạc được'];
  NEW_HIRE_NAMES.forEach((name, j) => {
    const i = NAMES.length + j;
    const off = offsets[j];
    const date = addDays(tue, off);
    const division = DIVISIONS[(j * 3) % DIVISIONS.length];
    const positions = POSITIONS[division];
    const noPhoto = j === 6 || j === 12;
    const cancelIdx = j - (NEW_HIRE_NAMES.length - CANCEL_REASONS.length); // 2 người cuối: Cancel Onboard
    const cancelled = cancelIdx >= 0;
    list.push({
      id: `E${String(i + 1).padStart(3, '0')}`,
      code: `SYN${String(1400 + j).padStart(5, '0')}`,
      name,
      division,
      position: positions[j % positions.length],
      email: emailOf(name),
      dob: toKey(new Date(1996 + (j % 6), (m + 4 + j) % 12, ((j * 9) % 27) + 1)),
      photoUrl: noPhoto ? null : makeAvatar(name, i),
      photoUpdatedAt: noPhoto ? null : toKey(addDays(date, -4)),
      onboardDate: toKey(date),
      isNewHire: true,
      status: cancelled ? 'Cancel Onboard' : 'Working',
      active: !cancelled,
      cancelReason: cancelled ? CANCEL_REASONS[cancelIdx] : undefined,
    });
  });
  return list;
};

/** Lịch sử gửi mail mẫu: sinh nhật/onboard đã qua trong tháng → đã gửi; 1 lỗi, 1 bỏ qua. */
export const buildMailLogs = (employees: MarcomEmployee[], ref = new Date()): MailLog[] => {
  const today = startOfDay(ref);
  const logs: MailLog[] = [];
  const at = (d: Date, hh: number, mm: number) => {
    const r = new Date(d);
    r.setHours(hh, mm, 0, 0);
    return r.toISOString();
  };
  employees.forEach((e, idx) => {
    const bday = birthdayThisYear(e, today);
    const passed = bday < today || (bday.getTime() === today.getTime() && isPastTimeToday('09:00', ref));
    // Mail sinh nhật các ngày đã qua trong năm; idx 9 = hôm đó đang tắt tự động → không có bản ghi ("Không gửi")
    if (passed && idx !== 9) {
      if (e.status === 'Resigned') {
        logs.push({ id: `L-b-${e.id}`, kind: 'birthday', employeeId: e.id, employeeName: e.name, to: e.email, sentAt: at(bday, 9, 0), status: 'skipped', note: 'Nhân sự đã nghỉ việc' });
      } else {
        const failed = idx === 5;
        // idx 7: lần đầu lỗi, tự thử lại thành công sau 10 phút → lịch sử ghi cả 2 bản ghi
        if (idx === 7) {
          logs.push({ id: `L-bf-${e.id}`, kind: 'birthday', employeeId: e.id, employeeName: e.name, to: e.email, sentAt: at(bday, 9, 0), status: 'failed', note: 'Máy chủ mail tạm thời không phản hồi (421)' });
          logs.push({ id: `L-b-${e.id}`, kind: 'birthday', employeeId: e.id, employeeName: e.name, to: e.email, sentAt: at(bday, 9, 10), status: 'sent', note: 'Gửi thành công khi tự thử lại' });
        } else logs.push({
          id: `L-b-${e.id}`, kind: 'birthday', employeeId: e.id, employeeName: e.name, to: e.email, sentAt: at(bday, 9, failed ? 0 : 1), status: failed ? 'failed' : 'sent',
          note: failed ? 'Mailbox không tồn tại (550 5.1.1)' : undefined,
        });
      }
    }
    if (e.status === 'Cancel Onboard') return;
    if (e.isNewHire) {
      const od = fromKey(e.onboardDate);
      if (od < today || (od.getTime() === today.getTime() && isPastTimeToday('10:00', ref))) {
        logs.push({ id: `L-w-${e.id}`, kind: 'welcome', employeeId: e.id, employeeName: e.name, to: e.email, sentAt: at(od, 10, 0), status: 'sent' });
      }
    }
  });
  return logs.sort((a, b) => b.sentAt.localeCompare(a.sentAt));
};

/**
 * Lịch sử thay đổi onboard mẫu — HCNS cập nhật trên Employee, màn Welcome chỉ đồng bộ sang để xếp đợt:
 *  - 1 người lùi từ thứ 3 sang thứ 4 → tự chuyển sang đợt thứ 3 tuần sau (đúng ví dụ trong yêu cầu);
 *  - các hồ sơ Cancel Onboard.
 */
export const buildOnboardChanges = (employees: MarcomEmployee[], ref = new Date()): OnboardChange[] => {
  const tue = batchTuesdayOf(ref);
  const at = (daysAgo: number, hh: number) => {
    const d = addDays(ref, -daysAgo);
    d.setHours(hh, 15, 0, 0);
    return d.toISOString();
  };
  const out: OnboardChange[] = [];
  const moved = employees.find((e) => e.isNewHire && e.status === 'Working' && e.onboardDate === toKey(addDays(tue, 1)));
  if (moved) out.push({ id: `C-${moved.id}`, at: at(1, 16), employeeId: moved.id, employeeName: moved.name, from: toKey(tue), to: moved.onboardDate, by: 'HCNS · Employee', reason: 'Ứng viên xin lùi 1 ngày do bàn giao việc cũ' });
  employees
    .filter((e) => e.isNewHire && e.status === 'Cancel Onboard')
    .forEach((e, i) => out.push({ id: `C-${e.id}`, at: at(2 + i, 10), employeeId: e.id, employeeName: e.name, from: e.onboardDate, to: '', by: 'HCNS · Employee', reason: e.cancelReason ?? '' }));
  return out.sort((a, b) => b.at.localeCompare(a.at));
};

/** Sinh nhật (ngày-tháng) của nhân sự rơi vào năm hiện tại. */
const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
/** Ngày sinh nhật trong năm y — sinh 29/02 mà năm y không nhuận thì chúc ngày 28/02. */
export const birthdayInYear = (e: MarcomEmployee, y: number) => {
  const d = fromKey(e.dob);
  const day = d.getMonth() === 1 && d.getDate() === 29 && !isLeapYear(y) ? 28 : d.getDate();
  return new Date(y, d.getMonth(), day);
};
export const birthdayThisYear = (e: MarcomEmployee, ref = new Date()) => birthdayInYear(e, ref.getFullYear());
export const isBirthdayToday = (e: MarcomEmployee, ref = new Date()) => birthdayThisYear(e, ref).getTime() === startOfDay(ref).getTime();

/** Thay biến {{...}} trong mẫu email. */
export const fillTemplate = (tpl: string, e: MarcomEmployee) =>
  tpl
    .replace(/\{\{fullname\}\}/g, e.name)
    .replace(/\{\{khoi\}\}/g, e.division)
    .replace(/\{\{vitri\}\}/g, e.position)
    .replace(/\{\{ngayonboard\}\}/g, fmtDate(e.onboardDate))
    .replace(/\{\{ngaysinh\}\}/g, fmtDayMonth(e.dob));

export const MAIL_PLACEHOLDERS: { key: string; desc: string; kinds: MailKind[] }[] = [
  { key: '{{fullname}}', desc: 'Họ và tên (Full name)', kinds: ['birthday', 'welcome'] },
  { key: '{{khoi}}', desc: 'Division (Khối)', kinds: ['birthday', 'welcome'] },
  { key: '{{vitri}}', desc: 'Vị trí', kinds: ['birthday', 'welcome'] },
  { key: '{{ngaysinh}}', desc: 'Ngày sinh (dd/MM)', kinds: ['birthday'] },
  { key: '{{ngayonboard}}', desc: 'Ngày onboard', kinds: ['welcome'] },
];

/** Tải ảnh: data URI / object URL → file. */
export const downloadPhoto = (e: MarcomEmployee) => {
  if (!e.photoUrl) return;
  const a = document.createElement('a');
  a.href = e.photoUrl;
  const upExt = e.photoSource === 'upload' ? e.uploadedPhotoName?.split('.').pop() : undefined;
  a.download = `${e.code}_${slug(e.name).join('-')}.${upExt ?? (e.photoUrl.startsWith('data:image/svg') ? 'svg' : 'png')}`;
  a.click();
};
