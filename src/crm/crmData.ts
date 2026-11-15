/**
 * CRM — Nền tảng quản lý khách hàng (Phòng Đối ngoại), phiên bản 1.
 *  • Module 01 — Danh bạ & hồ sơ khách hàng (cơ quan + đầu mối, tương tác, cam kết, dự án, ghi chú nhạy cảm)
 *  • Module 02 — Lịch ngoại giao 12 tháng + thư viện lịch chung + sổ cái quà tặng
 *  • Module 03 — Hệ thống cảnh báo sớm (nhắc trước 7 ngày, overview đầu tháng, trạng thái xử lý)
 * Phân quyền theo ma trận mục 2.2 (Chủ tịch / TGĐ / BP Đối ngoại · Giám đốc khối · Nhân sự khối).
 * Toàn bộ người, số điện thoại, ngày sinh… là dữ liệu giả lập.
 */
import { lunarToSolar } from './lunar';

// ==========================================================================
// Danh mục
// ==========================================================================
export const CRM_DIVISIONS = ['G1', 'G2', 'G3', 'G4', 'BFSI'] as const;
export type CrmDivision = (typeof CRM_DIVISIONS)[number];

export const ORG_LEVELS = ['Trung ương', 'Tỉnh/Thành phố', 'Tập đoàn/Ngân hàng lớn'] as const;
export type OrgLevel = (typeof ORG_LEVELS)[number];

export const TIERS = ['Tier 1', 'Tier 2', 'Tier 3'] as const;
export type Tier = (typeof TIERS)[number];
export const TIER_HINT: Record<Tier, string> = { 'Tier 1': 'Chiến lược', 'Tier 2': 'Quan trọng', 'Tier 3': 'Tiềm năng' };

export const PROJECT_ROLES = ['Decision Maker', 'Influencer', 'General Contact'] as const;
export type ProjectRole = (typeof PROJECT_ROLES)[number];
export const PROJECT_ROLE_VI: Record<ProjectRole, string> = {
  'Decision Maker': 'Người quyết định',
  Influencer: 'Tham mưu, có ảnh hưởng, đầu mối phối hợp',
  'General Contact': 'Liên hệ chung',
};

export const INTERACTION_TYPES = ['Gặp trực tiếp', 'Họp trực tuyến', 'Điện thoại', 'Email', 'Sự kiện', 'Khác'] as const;
export type InteractionType = (typeof INTERACTION_TYPES)[number];

/** Lĩnh vực của cơ quan → gắn ngày truyền thống ngành trong thư viện lịch chung. */
export const SECTORS = ['Tài chính', 'Ngân hàng', 'Y tế', 'Giáo dục', 'Công an', 'Quốc phòng', 'Bưu chính - Viễn thông', 'Báo chí - Truyền thông', 'Khoa học - Công nghệ', 'Doanh nghiệp', 'Quản lý nhà nước'] as const;
export type Sector = (typeof SECTORS)[number];

// ==========================================================================
// Người dùng & vai trò
// ==========================================================================
export type CrmRole = 'chairman' | 'ceo' | 'dn' | 'gdk' | 'nsk';
export const ROLE_LABEL: Record<CrmRole, string> = {
  chairman: 'Chủ tịch HĐQT',
  ceo: 'Tổng Giám đốc',
  dn: 'BP Đối ngoại',
  gdk: 'Giám đốc khối',
  nsk: 'Nhân sự khối',
};
export interface CrmUser {
  id: string;
  name: string;
  role: CrmRole;
  division?: CrmDivision; // GĐK / NSK
  email: string;
}
export const CRM_USERS: CrmUser[] = [
  { id: 'u-ct', name: 'Lê Hoài Thanh', role: 'chairman', email: 'chutich@aequitas.vn' },
  { id: 'u-tgd', name: 'Phạm Minh Đức', role: 'ceo', email: 'tgd@aequitas.vn' },
  { id: 'u-dn', name: 'Vũ Thu Trang', role: 'dn', email: 'doingoai@aequitas.vn' },
  { id: 'u-dn2', name: 'Lương Gia Hân', role: 'dn', email: 'doingoai2@aequitas.vn' },
  { id: 'u-g1', name: 'Nguyễn Quốc Bảo', role: 'gdk', division: 'G1', email: 'gdk.g1@aequitas.vn' },
  { id: 'u-g2', name: 'Trần Hải Nam', role: 'gdk', division: 'G2', email: 'gdk.g2@aequitas.vn' },
  { id: 'u-g3', name: 'Đỗ Minh Khang', role: 'gdk', division: 'G3', email: 'gdk.g3@aequitas.vn' },
  { id: 'u-g4', name: 'Hoàng Lan Anh', role: 'gdk', division: 'G4', email: 'gdk.g4@aequitas.vn' },
  { id: 'u-bfsi', name: 'Phan Thanh Tùng', role: 'gdk', division: 'BFSI', email: 'gdk.bfsi@aequitas.vn' },
  { id: 'u-g1a', name: 'Bùi Thu Hà', role: 'nsk', division: 'G1', email: 'ha.bt@aequitas.vn' },
  { id: 'u-g1b', name: 'Đặng Văn Long', role: 'nsk', division: 'G1', email: 'long.dv@aequitas.vn' },
  { id: 'u-g2a', name: 'Ngô Minh Châu', role: 'nsk', division: 'G2', email: 'chau.nm@aequitas.vn' },
  { id: 'u-g3a', name: 'Lý Quang Huy', role: 'nsk', division: 'G3', email: 'huy.lq@aequitas.vn' },
  { id: 'u-g4a', name: 'Mai Thanh Tâm', role: 'nsk', division: 'G4', email: 'tam.mt@aequitas.vn' },
  { id: 'u-bfsia', name: 'Cao Ngọc Linh', role: 'nsk', division: 'BFSI', email: 'linh.cn@aequitas.vn' },
  { id: 'u-bfsib', name: 'Trịnh Đức Anh', role: 'nsk', division: 'BFSI', email: 'anh.td@aequitas.vn' },
];
export const userById = (id: string) => CRM_USERS.find((u) => u.id === id);
export const userName = (id: string) => userById(id)?.name || id;
export const userLabel = (u: CrmUser) => `${u.name} — ${ROLE_LABEL[u.role]}${u.division ? ` ${u.division}` : ''}`;
export const gdkOf = (d: CrmDivision) => CRM_USERS.find((u) => u.role === 'gdk' && u.division === d);

// ==========================================================================
// Hồ sơ khách hàng
// ==========================================================================
export interface Contact {
  id: string;
  name: string;
  title: string; // Chức vụ
  phone: string;
  role: ProjectRole;
  birthday: string; // YYYY-MM-DD
  emailWork: string;
  emailPersonal: string;
  assistantName: string;
  assistantPhone: string;
  primary: boolean;
}
export interface Interaction {
  id: string;
  date: string;
  type: InteractionType;
  contactIds: string[];
  summary: string; // ghi chú nhanh / meeting notes
  by: string;
}
export interface Commitment {
  id: string;
  content: string;
  dueDate: string;
  ownerId: string;
  done: boolean;
  doneAt?: string;
}
export const PROJECT_STAGES = ['Tiếp cận', 'Đề xuất', 'Đàm phán', 'Đang triển khai', 'Hoàn thành', 'Tạm dừng'] as const;
export type ProjectStage = (typeof PROJECT_STAGES)[number];
export interface CustomerProject {
  id: string;
  name: string;
  code: string;
  stage: ProjectStage;
  value: number; // giá trị dự kiến (VNĐ)
  note: string;
}
export interface Customer {
  id: string;
  code: string; // KH-0001
  name: string; // Tên cơ quan, đơn vị
  level: OrgLevel;
  sector: Sector;
  division: CrmDivision; // khối phụ trách
  tier: Tier;
  ownerIds: string[]; // nhân sự khối phụ trách
  foundingDate: string; // ngày thành lập cơ quan (MM-DD hoặc YYYY-MM-DD) — tuỳ chọn
  address: string;
  contacts: Contact[];
  interactions: Interaction[];
  commitments: Commitment[];
  projects: CustomerProject[];
  /** Ghi chú nhạy cảm: quan điểm riêng, lưu ý đặc thù — chỉ Chủ tịch & BP Đối ngoại */
  sensitiveNote: string;
  archived: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

// ==========================================================================
// Lịch
// ==========================================================================
export type EventKind = 'birthday' | 'founding' | 'industry' | 'holiday' | 'external' | 'division';
export const EVENT_KIND_LABEL: Record<EventKind, string> = {
  birthday: 'Sinh nhật',
  founding: 'Ngày thành lập cơ quan',
  industry: 'Ngày truyền thống ngành',
  holiday: 'Lễ chung',
  external: 'Sự kiện đối ngoại',
  division: 'Lịch riêng của khối',
};
export const EVENT_KIND_COLOR: Record<EventKind, string> = {
  birthday: '#d6457a',
  founding: '#2a78d6',
  industry: '#8b5cf6',
  holiday: '#e0a100',
  external: '#0f8f6c',
  division: '#eb6834',
};
/** Mốc trong thư viện lịch chung (ĐN nhập 1 lần) hoặc lịch riêng của khối — lặp hằng năm. */
export interface LibraryEvent {
  id: string;
  name: string;
  kind: 'industry' | 'holiday' | 'division';
  calendar: 'solar' | 'lunar';
  day: number;
  month: number;
  sector?: Sector; // ngày truyền thống ngành → áp cho khách cùng lĩnh vực
  division?: CrmDivision; // lịch riêng của khối
  note: string;
  createdBy: string;
}
/** Sự kiện đối ngoại (hội nghị, lễ ký kết, đoàn công tác, triển lãm) — 1 lần. */
export interface ExternalEvent {
  id: string;
  name: string;
  type: 'Hội nghị' | 'Lễ ký kết' | 'Đoàn công tác' | 'Triển lãm' | 'Khác';
  date: string;
  location: string;
  division: CrmDivision; // khối tổ chức
  guestCustomerIds: string[]; // danh sách khách mời
  note: string;
  createdBy: string;
}

// ==========================================================================
// Nhắc việc & quà tặng
// ==========================================================================
export type ReminderStatus = 'Chưa xử lý' | 'Đã chúc' | 'Đã gửi quà' | 'Bỏ qua';
export const REMINDER_STATUSES: ReminderStatus[] = ['Chưa xử lý', 'Đã chúc', 'Đã gửi quà', 'Bỏ qua'];
export interface ReminderState {
  key: string; // `${occurrenceId}`
  status: ReminderStatus;
  reason?: string;
  by: string;
  at: string;
}
export interface Gift {
  id: string;
  date: string;
  customerId: string;
  contactId?: string;
  occasion: string;
  item: string;
  value: number;
  quantity: number;
  givenBy: string;
  division: CrmDivision;
  note: string;
  occurrenceKey?: string;
}

export interface AuditLog {
  id: string;
  at: string;
  by: string;
  action: 'Xem' | 'Tạo' | 'Sửa' | 'Lưu trữ' | 'Khôi phục' | 'Xuất dữ liệu' | 'Nhập dữ liệu' | 'Phân quyền' | 'Nhắc việc';
  target: string;
  detail?: string;
}

/** Đề xuất quyền: GĐK đề xuất cho nhân sự khối → Chủ tịch / BP ĐN duyệt. */
export interface PermissionRequest {
  id: string;
  userId: string; // nhân sự được đề xuất
  customerIds: string[]; // khách được phân công
  proposedBy: string;
  proposedAt: string;
  status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
  decidedBy?: string;
  decidedAt?: string;
  note: string;
}

// ==========================================================================
// Phân quyền (mục 2.2)
// ==========================================================================
export const isTop = (u: CrmUser) => u.role === 'chairman' || u.role === 'ceo' || u.role === 'dn';
/** Ghi chú nhạy cảm: chỉ Chủ tịch và BP Đối ngoại (TGĐ không xem). */
export const canSensitive = (u: CrmUser) => u.role === 'chairman' || u.role === 'dn';
export const canSeeCustomer = (u: CrmUser, c: Customer) => isTop(u) || (u.role === 'gdk' && c.division === u.division) || (u.role === 'nsk' && c.ownerIds.includes(u.id));
export const canEditCustomer = (u: CrmUser, c: Customer) => isTop(u) || (u.role === 'gdk' && c.division === u.division);
export const canCreateCustomer = (u: CrmUser) => isTop(u) || u.role === 'gdk';
export const canArchiveCustomer = canEditCustomer;
/** Ngày sinh: NSK được xem + sửa. */
export const canEditBirthday = (u: CrmUser, c: Customer) => canEditCustomer(u, c) || (u.role === 'nsk' && c.ownerIds.includes(u.id));
/** Tương tác, dự án, nhiệm vụ: NSK được X S T (không lưu trữ). */
export const canWorkLog = (u: CrmUser, c: Customer) => canSeeCustomer(u, c);
export const canImport = (u: CrmUser) => isTop(u) || u.role === 'gdk';
export const canExport = (u: CrmUser) => isTop(u) || u.role === 'gdk';
export const canManageLibrary = (u: CrmUser) => u.role === 'dn' || u.role === 'chairman';
export const canDecidePermission = (u: CrmUser) => isTop(u);
export const canProposePermission = (u: CrmUser) => u.role === 'gdk';
export const scopeText = (u: CrmUser) =>
  isTop(u) ? 'Toàn bộ 5 khối' : u.role === 'gdk' ? `Khối ${u.division}` : `Khách hàng được phân công (khối ${u.division})`;

// ==========================================================================
// Ngày giờ
// ==========================================================================
const p2 = (n: number) => String(n).padStart(2, '0');
export const isoOf = (d: Date) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
export const todayIso = () => isoOf(new Date());
export const addDaysIso = (iso: string, n: number) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return isoOf(d);
};
export const daysBetween = (a: string, b: string) => Math.round((new Date(`${b}T00:00:00`).getTime() - new Date(`${a}T00:00:00`).getTime()) / 86400000);
export const dmy = (iso: string) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '');
export const dm = (iso: string) => (iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}` : '');
export const fmtMoney = (n: number) => (n ? Math.round(n).toLocaleString('en-US') : '0');
export const nowIso = () => new Date().toISOString();
export const uid = (p = 'id') => `${p}-${Math.random().toString(36).slice(2, 9)}`;
export const ageOf = (birthday: string, on = todayIso()) => (birthday ? Number(on.slice(0, 4)) - Number(birthday.slice(0, 4)) - (on.slice(5) < birthday.slice(5, 10) ? 1 : 0) : null);

// ==========================================================================
// Mốc lịch → các lần xảy ra trong năm (occurrence)
// ==========================================================================
export interface Occurrence {
  id: string; // khoá duy nhất cho nhắc việc
  date: string; // YYYY-MM-DD (dương lịch)
  kind: EventKind;
  title: string;
  sub: string;
  customerId?: string;
  contactId?: string;
  division?: CrmDivision; // khối liên quan (lễ chung: không có)
  ownerIds: string[]; // người nhận nhắc (NSK phụ trách) — GĐK khối tự nhận
  lunar?: string; // "10/3 âm lịch"
  tier?: Tier;
  externalId?: string;
  libraryId?: string;
}
const solarOf = (calendar: 'solar' | 'lunar', day: number, month: number, year: number) =>
  calendar === 'solar' ? `${year}-${p2(month)}-${p2(day)}` : lunarToSolar(day, month, year) || `${year}-${p2(month)}-${p2(day)}`;

/** Tất cả mốc của năm `year` (sinh nhật, thành lập, ngày ngành, lễ chung, lịch khối, sự kiện đối ngoại). */
export const occurrencesOf = (year: number, customers: Customer[], library: LibraryEvent[], externals: ExternalEvent[]): Occurrence[] => {
  const out: Occurrence[] = [];
  const live = customers.filter((c) => !c.archived);
  live.forEach((c) => {
    c.contacts.forEach((ct) => {
      if (!ct.birthday) return;
      const date = `${year}-${ct.birthday.slice(5, 10)}`;
      if (date.endsWith('02-29') && year % 4) return;
      out.push({
        id: `bd|${ct.id}|${year}`,
        date,
        kind: 'birthday',
        title: `Sinh nhật ${ct.name}`,
        sub: `${ct.title} · ${c.name}${ageOf(ct.birthday, date) ? ` · tròn ${ageOf(ct.birthday, date)} tuổi` : ''}`,
        customerId: c.id,
        contactId: ct.id,
        division: c.division,
        ownerIds: c.ownerIds,
        tier: c.tier,
      });
    });
    if (c.foundingDate) {
      const md = c.foundingDate.slice(-5);
      out.push({
        id: `fd|${c.id}|${year}`,
        date: `${year}-${md}`,
        kind: 'founding',
        title: `Ngày thành lập ${c.name}`,
        sub: c.foundingDate.length > 5 ? `Thành lập ${dmy(c.foundingDate)} · ${year - Number(c.foundingDate.slice(0, 4))} năm` : 'Kỷ niệm ngày thành lập',
        customerId: c.id,
        division: c.division,
        ownerIds: c.ownerIds,
        tier: c.tier,
      });
    }
  });
  library.forEach((e) => {
    const date = solarOf(e.calendar, e.day, e.month, year);
    const lunar = e.calendar === 'lunar' ? `${e.day}/${e.month} âm lịch` : undefined;
    if (e.kind === 'industry' && e.sector) {
      // Ngày ngành: 1 nhắc cho mỗi khách cùng lĩnh vực
      live
        .filter((c) => c.sector === e.sector)
        .forEach((c) =>
          out.push({
            id: `in|${e.id}|${c.id}|${year}`,
            date,
            kind: 'industry',
            title: e.name,
            sub: `${c.name} · ngành ${e.sector}`,
            customerId: c.id,
            division: c.division,
            ownerIds: c.ownerIds,
            lunar,
            tier: c.tier,
            libraryId: e.id,
          }),
        );
    } else
      out.push({
        id: `lb|${e.id}|${year}`,
        date,
        kind: e.kind,
        title: e.name,
        sub: e.kind === 'division' ? `Lịch riêng khối ${e.division}${e.note ? ` · ${e.note}` : ''}` : e.note || 'Lễ chung toàn công ty',
        division: e.division,
        ownerIds: [],
        lunar,
        libraryId: e.id,
      });
  });
  externals
    .filter((x) => x.date.startsWith(String(year)))
    .forEach((x) =>
      out.push({
        id: `ex|${x.id}`,
        date: x.date,
        kind: 'external',
        title: x.name,
        sub: `${x.type} · ${x.location} · ${x.guestCustomerIds.length} khách mời · khối ${x.division} tổ chức`,
        division: x.division,
        ownerIds: [...new Set(customers.filter((c) => x.guestCustomerIds.includes(c.id)).flatMap((c) => c.ownerIds))],
        externalId: x.id,
      }),
    );
  return out.sort((a, b) => a.date.localeCompare(b.date) || a.kind.localeCompare(b.kind));
};

/** Mốc mà người dùng được nhận / xem (mục 4.3: NSK & GĐK của khách đó; ĐN & Chủ tịch xem tổng). */
export const occurrenceVisible = (u: CrmUser, o: Occurrence, customers: Customer[]) => {
  if (isTop(u)) return true;
  if (o.kind === 'holiday') return true;
  if (o.customerId) {
    const c = customers.find((x) => x.id === o.customerId);
    return !!c && canSeeCustomer(u, c);
  }
  if (o.kind === 'division') return o.division === u.division;
  if (o.kind === 'external') return u.role === 'gdk' ? o.division === u.division || o.ownerIds.some((id) => userById(id)?.division === u.division) : o.ownerIds.includes(u.id) || o.division === u.division;
  return false;
};

/** Khách lâu chưa tiếp xúc (mặc định > 90 ngày). */
export const STALE_DAYS = 90;
export const lastContactOf = (c: Customer) => c.interactions.reduce((m, x) => (x.date > m ? x.date : m), '');
export const REMIND_BEFORE = 7;

// ==========================================================================
// Dữ liệu mẫu (giả lập)
// ==========================================================================
const PEOPLE = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường', 'Phạm Thị Dung', 'Hoàng Văn Em', 'Vũ Thị Giang', 'Đặng Văn Hải', 'Bùi Thị Hoa', 'Đỗ Văn Khánh',
  'Hồ Thị Lan', 'Ngô Văn Minh', 'Dương Thị Ngọc', 'Lý Văn Phúc', 'Trịnh Thị Quỳnh', 'Mai Văn Sơn', 'Đinh Thị Thảo', 'Lưu Văn Thắng', 'Tạ Thị Uyên',
  'Phan Văn Việt', 'Cao Thị Xuân', 'Kiều Văn Yên', 'Âu Thị Ánh', 'Châu Văn Bách', 'Doãn Thị Cúc', 'Giáp Văn Đạt', 'Hà Thị Hằng', 'Khúc Văn Kiên',
  'La Thị Linh', 'Mạc Văn Nam', 'Ninh Thị Oanh', 'Ông Văn Phong', 'Quách Thị Quế', 'Tôn Văn Tài', 'Văn Thị Vân', 'Yên Văn Bảo', 'Lâm Thị Diệp',
];
const TITLES_GOV = ['Cục trưởng', 'Phó Cục trưởng', 'Chánh Văn phòng', 'Trưởng phòng', 'Phó Trưởng phòng', 'Giám đốc Trung tâm'];
const TITLES_PROV = ['Giám đốc Sở', 'Phó Giám đốc Sở', 'Chánh Văn phòng', 'Trưởng phòng'];
const TITLES_CORP = ['Tổng Giám đốc', 'Phó Tổng Giám đốc', 'Giám đốc Khối CNTT', 'Giám đốc Trung tâm Dữ liệu', 'Trưởng ban'];

const ORGS: { name: string; level: OrgLevel; sector: Sector; division: CrmDivision; tier: Tier; founding: string; address: string }[] = [
  { name: 'Cục Công nghệ thông tin – Bộ Mẫu Tài chính', level: 'Trung ương', sector: 'Tài chính', division: 'G1', tier: 'Tier 1', founding: '1995-03-15', address: 'Số 1 phố Mẫu, Hà Nội' },
  { name: 'Tổng cục Mẫu Hải quan', level: 'Trung ương', sector: 'Tài chính', division: 'G1', tier: 'Tier 1', founding: '1945-09-10', address: 'Số 2 phố Mẫu, Hà Nội' },
  { name: 'Kho bạc Nhà nước Mẫu', level: 'Trung ương', sector: 'Tài chính', division: 'G1', tier: 'Tier 2', founding: '1990-04-01', address: 'Số 3 phố Mẫu, Hà Nội' },
  { name: 'Sở Tài chính Thành phố Mẫu A', level: 'Tỉnh/Thành phố', sector: 'Tài chính', division: 'G1', tier: 'Tier 3', founding: '', address: 'Thành phố Mẫu A' },
  { name: 'Cục Chuyển đổi số – Bộ Mẫu Y tế', level: 'Trung ương', sector: 'Y tế', division: 'G2', tier: 'Tier 1', founding: '2008-06-20', address: 'Số 4 phố Mẫu, Hà Nội' },
  { name: 'Bệnh viện Đa khoa Trung ương Mẫu', level: 'Trung ương', sector: 'Y tế', division: 'G2', tier: 'Tier 2', founding: '1911-11-28', address: 'Số 5 phố Mẫu, Hà Nội' },
  { name: 'Sở Y tế Tỉnh Mẫu B', level: 'Tỉnh/Thành phố', sector: 'Y tế', division: 'G2', tier: 'Tier 3', founding: '', address: 'Tỉnh Mẫu B' },
  { name: 'Sở Giáo dục và Đào tạo Thành phố Mẫu C', level: 'Tỉnh/Thành phố', sector: 'Giáo dục', division: 'G2', tier: 'Tier 2', founding: '', address: 'Thành phố Mẫu C' },
  { name: 'Cục Viễn thông Mẫu', level: 'Trung ương', sector: 'Bưu chính - Viễn thông', division: 'G3', tier: 'Tier 1', founding: '2003-12-05', address: 'Số 6 phố Mẫu, Hà Nội' },
  { name: 'Văn phòng UBND Tỉnh Mẫu D', level: 'Tỉnh/Thành phố', sector: 'Quản lý nhà nước', division: 'G3', tier: 'Tier 2', founding: '', address: 'Tỉnh Mẫu D' },
  { name: 'Sở Khoa học và Công nghệ Tỉnh Mẫu E', level: 'Tỉnh/Thành phố', sector: 'Khoa học - Công nghệ', division: 'G3', tier: 'Tier 3', founding: '', address: 'Tỉnh Mẫu E' },
  { name: 'Đài Truyền hình Mẫu', level: 'Trung ương', sector: 'Báo chí - Truyền thông', division: 'G3', tier: 'Tier 2', founding: '1970-09-07', address: 'Số 7 phố Mẫu, Hà Nội' },
  { name: 'Tập đoàn Điện lực Mẫu', level: 'Tập đoàn/Ngân hàng lớn', sector: 'Doanh nghiệp', division: 'G4', tier: 'Tier 1', founding: '1994-06-10', address: 'Số 8 phố Mẫu, Hà Nội' },
  { name: 'Tổng Công ty Bưu chính Mẫu', level: 'Tập đoàn/Ngân hàng lớn', sector: 'Bưu chính - Viễn thông', division: 'G4', tier: 'Tier 2', founding: '2005-01-01', address: 'Số 9 phố Mẫu, Hà Nội' },
  { name: 'Tập đoàn Dầu khí Mẫu', level: 'Tập đoàn/Ngân hàng lớn', sector: 'Doanh nghiệp', division: 'G4', tier: 'Tier 1', founding: '1975-09-03', address: 'Số 10 phố Mẫu, Hà Nội' },
  { name: 'Cục Mẫu An ninh mạng', level: 'Trung ương', sector: 'Công an', division: 'G4', tier: 'Tier 2', founding: '', address: 'Hà Nội' },
  { name: 'Ngân hàng TMCP Mẫu Việt', level: 'Tập đoàn/Ngân hàng lớn', sector: 'Ngân hàng', division: 'BFSI', tier: 'Tier 1', founding: '1988-07-01', address: 'Số 11 phố Mẫu, Hà Nội' },
  { name: 'Ngân hàng TMCP Mẫu Đông Á', level: 'Tập đoàn/Ngân hàng lớn', sector: 'Ngân hàng', division: 'BFSI', tier: 'Tier 1', founding: '1993-05-26', address: 'Số 12 phố Mẫu, TP. Hồ Chí Minh' },
  { name: 'Ngân hàng Nông nghiệp Mẫu', level: 'Tập đoàn/Ngân hàng lớn', sector: 'Ngân hàng', division: 'BFSI', tier: 'Tier 2', founding: '1988-03-26', address: 'Số 13 phố Mẫu, Hà Nội' },
  { name: 'Tổng Công ty Bảo hiểm Mẫu', level: 'Tập đoàn/Ngân hàng lớn', sector: 'Tài chính', division: 'BFSI', tier: 'Tier 2', founding: '1965-01-15', address: 'Số 14 phố Mẫu, Hà Nội' },
  { name: 'Công ty Chứng khoán Mẫu', level: 'Tập đoàn/Ngân hàng lớn', sector: 'Tài chính', division: 'BFSI', tier: 'Tier 3', founding: '2000-11-11', address: 'Số 15 phố Mẫu, Hà Nội' },
];
const OWNERS: Record<CrmDivision, string[]> = { G1: ['u-g1a', 'u-g1b'], G2: ['u-g2a'], G3: ['u-g3a'], G4: ['u-g4a'], BFSI: ['u-bfsia', 'u-bfsib'] };
const NOTES = [
  'Trao đổi định hướng chuyển đổi số năm tới, khách quan tâm nền tảng dữ liệu dùng chung.',
  'Báo cáo tiến độ dự án; khách đề nghị bổ sung tài liệu kỹ thuật trước ngày 15.',
  'Gặp xã giao, mời tham dự hội thảo công nghệ của công ty.',
  'Họp kỹ thuật làm rõ yêu cầu bảo mật và phân quyền dữ liệu.',
  'Khách phản hồi tích cực về bản demo, cần báo giá chính thức.',
  'Gọi điện hỏi thăm, hẹn lịch làm việc với lãnh đạo tuần sau.',
];
const COMMITS = [
  'Gửi đề xuất giải pháp và báo giá',
  'Bố trí đoàn kỹ thuật khảo sát hiện trạng',
  'Gửi biên bản họp và kế hoạch triển khai',
  'Tổ chức buổi demo cho lãnh đạo',
  'Hoàn thiện hồ sơ kỹ thuật bổ sung',
];
const PROJECT_NAMES = ['Nền tảng dữ liệu dùng chung', 'Hệ thống quản lý văn bản điều hành', 'Cổng dịch vụ công trực tuyến', 'Kho dữ liệu & báo cáo điều hành', 'Hệ thống giám sát an toàn thông tin', 'Ngân hàng số thế hệ mới'];

/** Sinh dữ liệu mẫu ổn định (theo chỉ số), ngày tương đối với hôm nay để luôn có nhắc việc. */
export const buildCrmSeed = () => {
  const t = todayIso();
  const year = Number(t.slice(0, 4));
  let pi = 0;
  const customers: Customer[] = ORGS.map((o, i) => {
    const titles = o.level === 'Trung ương' ? TITLES_GOV : o.level === 'Tỉnh/Thành phố' ? TITLES_PROV : TITLES_CORP;
    const nContacts = o.tier === 'Tier 1' ? 3 : 2;
    const contacts: Contact[] = Array.from({ length: nContacts }, (_, j) => {
      const name = PEOPLE[pi++ % PEOPLE.length];
      // Sinh nhật: rải đều, vài người trong 1–30 ngày tới để có nhắc việc
      const bdBase = j === 0 && i % 3 === 0 ? addDaysIso(t, (i * 5) % 28 + 1) : j === 1 && i % 4 === 1 ? addDaysIso(t, -((i % 5) + 2)) : `${year}-${p2(((i * 7 + j * 5) % 12) + 1)}-${p2(((i * 11 + j * 3) % 27) + 1)}`;
      const birthYear = 1962 + ((i * 3 + j * 7) % 22);
      return {
        id: `ct-${i}-${j}`,
        name,
        title: titles[(i + j) % titles.length],
        phone: `090${(1000000 + i * 1373 + j * 97).toString().slice(0, 7)}`.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3'),
        role: j === 0 ? 'Decision Maker' : j === 1 ? 'Influencer' : 'General Contact',
        birthday: `${birthYear}-${bdBase.slice(5, 10)}`,
        emailWork: `${name.split(' ').pop()!.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd')}.${i}${j}@coquan-mau.gov.vn`,
        emailPersonal: j === 0 ? `lienhe.${i}${j}@mail-mau.vn` : '',
        assistantName: j === 0 && o.level !== 'Tập đoàn/Ngân hàng lớn' ? PEOPLE[(pi + 17) % PEOPLE.length] : '',
        assistantPhone: j === 0 && o.level !== 'Tập đoàn/Ngân hàng lớn' ? `091${(2000000 + i * 211).toString().slice(0, 7)}`.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3') : '',
        primary: j === 0,
      };
    });
    const owners = OWNERS[o.division].slice(0, i % 2 === 0 ? OWNERS[o.division].length : 1);
    const lastGap = i % 6 === 5 ? 120 + i : 5 + ((i * 13) % 60);
    const interactions: Interaction[] = Array.from({ length: 2 + (i % 3) }, (_, k) => ({
      id: `it-${i}-${k}`,
      date: addDaysIso(t, -(lastGap + k * 37)),
      type: INTERACTION_TYPES[(i + k) % 5],
      contactIds: [contacts[k % contacts.length].id],
      summary: NOTES[(i + k) % NOTES.length],
      by: k % 2 ? gdkOf(o.division)!.id : owners[0],
    }));
    const commitments: Commitment[] = Array.from({ length: 1 + (i % 2) }, (_, k) => ({
      id: `cm-${i}-${k}`,
      content: COMMITS[(i + k) % COMMITS.length],
      dueDate: addDaysIso(t, k === 0 ? (i % 4 === 0 ? -(3 + i) : 4 + i) : 20 + i),
      ownerId: owners[k % owners.length],
      done: k === 1 && i % 3 === 0,
    }));
    const projects: CustomerProject[] =
      i % 3 === 2
        ? []
        : [
            {
              id: `pj-${i}`,
              name: PROJECT_NAMES[i % PROJECT_NAMES.length],
              code: i % 2 ? `0${20 + i}.${100 + i}` : '',
              stage: PROJECT_STAGES[i % 4],
              value: (5 + (i % 7) * 4) * 1_000_000_000,
              note: '',
            },
          ];
    return {
      id: `kh-${i + 1}`,
      code: `KH-${String(i + 1).padStart(4, '0')}`,
      name: o.name,
      level: o.level,
      sector: o.sector,
      division: o.division,
      tier: o.tier,
      ownerIds: owners,
      foundingDate: o.founding ? (i % 5 === 0 ? `${o.founding.slice(0, 4)}-${addDaysIso(t, 10 + i).slice(5)}` : o.founding) : '',
      address: o.address,
      contacts,
      interactions,
      commitments,
      projects,
      sensitiveNote:
        o.tier === 'Tier 1'
          ? 'Lãnh đạo ưu tiên giải pháp trong nước, quan tâm tiến độ hơn giá. Tránh lịch làm việc sáng thứ Hai.'
          : '',
      archived: false,
      createdAt: `${year - 1}-0${(i % 9) + 1}-15T02:00:00.000Z`,
      createdBy: 'u-dn',
      updatedAt: `${year}-0${(i % 9) + 1}-20T02:00:00.000Z`,
    };
  });

  const library: LibraryEvent[] = [
    { id: 'lb-1', name: 'Tết Dương lịch', kind: 'holiday', calendar: 'solar', day: 1, month: 1, note: 'Lễ chung toàn công ty', createdBy: 'u-dn' },
    { id: 'lb-2', name: 'Tết Nguyên đán', kind: 'holiday', calendar: 'lunar', day: 1, month: 1, note: 'Chúc Tết toàn bộ khách hàng', createdBy: 'u-dn' },
    { id: 'lb-3', name: 'Giỗ Tổ Hùng Vương', kind: 'holiday', calendar: 'lunar', day: 10, month: 3, note: '', createdBy: 'u-dn' },
    { id: 'lb-4', name: 'Quốc tế Phụ nữ 8/3', kind: 'holiday', calendar: 'solar', day: 8, month: 3, note: 'Chúc mừng lãnh đạo, đầu mối nữ', createdBy: 'u-dn' },
    { id: 'lb-5', name: 'Ngày Giải phóng miền Nam 30/4', kind: 'holiday', calendar: 'solar', day: 30, month: 4, note: '', createdBy: 'u-dn' },
    { id: 'lb-6', name: 'Quốc khánh 2/9', kind: 'holiday', calendar: 'solar', day: 2, month: 9, note: '', createdBy: 'u-dn' },
    { id: 'lb-7', name: 'Ngày Phụ nữ Việt Nam 20/10', kind: 'holiday', calendar: 'solar', day: 20, month: 10, note: 'Chúc mừng lãnh đạo, đầu mối nữ', createdBy: 'u-dn' },
    { id: 'lb-8', name: 'Tết Trung thu', kind: 'holiday', calendar: 'lunar', day: 15, month: 8, note: '', createdBy: 'u-dn' },
    { id: 'lb-11', name: 'Ngày Thầy thuốc Việt Nam', kind: 'industry', calendar: 'solar', day: 27, month: 2, sector: 'Y tế', note: '', createdBy: 'u-dn' },
    { id: 'lb-12', name: 'Ngày truyền thống ngành Ngân hàng', kind: 'industry', calendar: 'solar', day: 6, month: 5, sector: 'Ngân hàng', note: '', createdBy: 'u-dn' },
    { id: 'lb-13', name: 'Ngày Khoa học và Công nghệ Việt Nam', kind: 'industry', calendar: 'solar', day: 18, month: 5, sector: 'Khoa học - Công nghệ', note: '', createdBy: 'u-dn' },
    { id: 'lb-14', name: 'Ngày Báo chí Cách mạng Việt Nam', kind: 'industry', calendar: 'solar', day: 21, month: 6, sector: 'Báo chí - Truyền thông', note: '', createdBy: 'u-dn' },
    { id: 'lb-15', name: 'Ngày truyền thống ngành Bưu điện', kind: 'industry', calendar: 'solar', day: 15, month: 8, sector: 'Bưu chính - Viễn thông', note: '', createdBy: 'u-dn' },
    { id: 'lb-16', name: 'Ngày truyền thống Công an nhân dân', kind: 'industry', calendar: 'solar', day: 19, month: 8, sector: 'Công an', note: '', createdBy: 'u-dn' },
    { id: 'lb-17', name: 'Ngày truyền thống ngành Tài chính', kind: 'industry', calendar: 'solar', day: 28, month: 8, sector: 'Tài chính', note: '', createdBy: 'u-dn' },
    { id: 'lb-18', name: 'Ngày Doanh nhân Việt Nam', kind: 'industry', calendar: 'solar', day: 13, month: 10, sector: 'Doanh nghiệp', note: '', createdBy: 'u-dn' },
    { id: 'lb-19', name: 'Ngày Nhà giáo Việt Nam', kind: 'industry', calendar: 'solar', day: 20, month: 11, sector: 'Giáo dục', note: '', createdBy: 'u-dn' },
    { id: 'lb-20', name: 'Ngày thành lập Quân đội nhân dân', kind: 'industry', calendar: 'solar', day: 22, month: 12, sector: 'Quốc phòng', note: '', createdBy: 'u-dn' },
    { id: 'lb-31', name: 'Tổng kết năm khối G1 với khách hàng', kind: 'division', calendar: 'solar', day: Number(addDaysIso(t, 12).slice(8, 10)), month: Number(addDaysIso(t, 12).slice(5, 7)), division: 'G1', note: 'Gặp mặt cuối năm', createdBy: 'u-g1' },
    { id: 'lb-32', name: 'Tri ân khách hàng BFSI', kind: 'division', calendar: 'solar', day: 15, month: 12, division: 'BFSI', note: '', createdBy: 'u-bfsi' },
  ];

  const externals: ExternalEvent[] = [
    { id: 'ex-1', name: 'Hội nghị Chuyển đổi số ngành Tài chính', type: 'Hội nghị', date: addDaysIso(t, 5), location: 'Trung tâm Hội nghị Mẫu, Hà Nội', division: 'G1', guestCustomerIds: ['kh-1', 'kh-2', 'kh-3'], note: 'Công ty là nhà tài trợ bạc', createdBy: 'u-dn' },
    { id: 'ex-2', name: 'Lễ ký kết hợp tác ngân hàng số', type: 'Lễ ký kết', date: addDaysIso(t, 18), location: 'Trụ sở Ngân hàng TMCP Mẫu Việt', division: 'BFSI', guestCustomerIds: ['kh-17'], note: '', createdBy: 'u-dn' },
    { id: 'ex-3', name: 'Triển lãm Công nghệ Y tế số', type: 'Triển lãm', date: addDaysIso(t, 26), location: 'Trung tâm Triển lãm Mẫu', division: 'G2', guestCustomerIds: ['kh-5', 'kh-6', 'kh-7'], note: '', createdBy: 'u-dn' },
    { id: 'ex-4', name: 'Đoàn công tác khảo sát Tập đoàn Điện lực Mẫu', type: 'Đoàn công tác', date: addDaysIso(t, -20), location: 'Hà Nội', division: 'G4', guestCustomerIds: ['kh-13'], note: '', createdBy: 'u-g4' },
  ];

  const gifts: Gift[] = [
    { id: 'gf-1', date: `${year}-02-12`, customerId: 'kh-1', contactId: 'ct-0-0', occasion: 'Tết Nguyên đán', item: 'Hộp quà Tết cao cấp', value: 2_500_000, quantity: 1, givenBy: 'u-g1a', division: 'G1', note: '' },
    { id: 'gf-2', date: `${year}-02-12`, customerId: 'kh-17', contactId: 'ct-36-0', occasion: 'Tết Nguyên đán', item: 'Hộp quà Tết cao cấp', value: 2_500_000, quantity: 2, givenBy: 'u-bfsia', division: 'BFSI', note: '' },
    { id: 'gf-3', date: `${year}-02-27`, customerId: 'kh-5', occasion: 'Ngày Thầy thuốc Việt Nam', item: 'Lẵng hoa chúc mừng', value: 1_200_000, quantity: 1, givenBy: 'u-g2a', division: 'G2', note: '' },
    { id: 'gf-4', date: `${year}-05-06`, customerId: 'kh-18', occasion: 'Ngày truyền thống ngành Ngân hàng', item: 'Lẵng hoa chúc mừng', value: 1_500_000, quantity: 1, givenBy: 'u-bfsib', division: 'BFSI', note: '' },
    { id: 'gf-5', date: `${year}-08-28`, customerId: 'kh-2', occasion: 'Ngày truyền thống ngành Tài chính', item: 'Tranh sơn mài', value: 4_000_000, quantity: 1, givenBy: 'u-g1', division: 'G1', note: 'Chủ tịch trực tiếp trao' },
    { id: 'gf-6', date: `${year}-10-13`, customerId: 'kh-13', occasion: 'Ngày Doanh nhân Việt Nam', item: 'Hoa + thiệp chúc mừng', value: 900_000, quantity: 1, givenBy: 'u-g4a', division: 'G4', note: '' },
  ];
  // id liên hệ trong quà mẫu theo chỉ số người
  const fix = (g: Gift) => ({ ...g, contactId: g.contactId ? customers.find((c) => c.id === g.customerId)?.contacts[0]?.id : undefined });

  const audit: AuditLog[] = [
    { id: 'au-1', at: `${year}-${t.slice(5, 7)}-01T01:00:00.000Z`, by: 'u-dn', action: 'Xuất dữ liệu', target: 'Danh sách tổng khách hàng', detail: `${customers.length} khách hàng` },
    { id: 'au-2', at: `${year}-${t.slice(5, 7)}-02T03:10:00.000Z`, by: 'u-g1', action: 'Sửa', target: 'KH-0001', detail: 'Cập nhật chức vụ đầu mối' },
    { id: 'au-3', at: `${year}-${t.slice(5, 7)}-03T07:30:00.000Z`, by: 'u-ct', action: 'Xem', target: 'KH-0017', detail: 'Xem ghi chú nhạy cảm' },
  ];
  const requests: PermissionRequest[] = [
    { id: 'rq-1', userId: 'u-g1b', customerIds: ['kh-3', 'kh-4'], proposedBy: 'u-g1', proposedAt: addDaysIso(t, -2) + 'T02:00:00.000Z', status: 'Chờ duyệt', note: 'Bổ sung phụ trách khách Kho bạc và Sở Tài chính' },
  ];
  return { customers, library, externals, gifts: gifts.map(fix), audit, requests, reminders: [] as ReminderState[] };
};
