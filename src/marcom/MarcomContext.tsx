/**
 * MarCom store (mock) — nhân sự (đồng bộ từ hồ sơ iMIS), cấu hình box sinh nhật + 2 email tự động, lịch sử gửi,
 * nhật ký đổi ngày onboard. "Gửi" là mock: ghi vào lịch sử, chưa gửi thật.
 */
import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  BannerFit, MarcomEmployee, MailLog, MailKind, OnboardChange, PhotoSource,
  buildEmployees, buildMailLogs, buildOnboardChanges, birthdayThisYear, startOfDay,
} from './marcomData';

export interface MailConfig {
  enabled: boolean;
  sendTime: string; // HH:mm
  subject: string;
  body: string;
  /** Ảnh nhân sự trong thiệp: lấy tự động từ hồ sơ Employee của người nhận (trường Ảnh đại diện). */
  usePhoto: boolean;
  photoShape: 'circle' | 'rounded';
  /** Hồ sơ Employee chưa có ảnh: dùng ảnh mặc định hoặc gửi thiệp không kèm ảnh. */
  noPhoto: 'default' | 'omit';
  /** Khung thiệp / ảnh nền MarCom cung cấp (tuỳ chọn) — ảnh nhân sự được ghép lên khung này. */
  frameUrl: string | null;
  frameName: string | null;
  /** Banner cuối mail (mail sinh nhật) — MarCom cung cấp, tuỳ chọn. */
  footerUrl?: string | null;
  footerName?: string | null;
}

export type BoxLayout = 'cards' | 'list' | 'banner';

/** Banner MarCom đăng lên trang chủ — chạy slide cùng box sinh nhật. */
export interface HomeBanner {
  id: string;
  name: string; // tên file / tên chương trình
  url: string; // ảnh banner
  link: string; // bấm vào banner mở trang này (để trống = không bấm được)
  active: boolean;
}
export type BoxTheme = 'pink' | 'blue' | 'green' | 'purple' | 'orange';

/** Box trang chủ (slide Sinh nhật, Chào mừng thành viên mới, banner) — MarCom tự thiết kế; slide sinh nhật đăng thêm được lên Microsoft Teams. */
export interface BoxConfig {
  // Kênh hiển thị
  showOnHome: boolean;
  postToTeams: boolean;
  teamsTeam: string;
  teamsChannel: string;
  teamsPostTime: string; // HH:mm — đăng bài mỗi ngày (tài khoản đăng cố định: Bot iMIS dành cho MarCom)
  teamsMentionAll: boolean; // @mention cả team ở dòng tiêu đề
  /** Bài đăng Teams = tin nhắn văn bản (tiêu đề + nội dung có biến) + ảnh thiệp tự ghép từ ảnh Employee. */
  teamsHeader: string;
  teamsBody: string; // biến: {{thang}} {{soluong}} {{soluong_chu}} {{danhsach}} {{team}}; **chữ đậm**
  teamsAttachCard: boolean;
  cardBgUrl: string | null; // nền thiệp MarCom cung cấp (để trống = mẫu mặc định)
  cardBgName: string | null;
  // Thiết kế slide Sinh nhật
  layout: BoxLayout;
  theme: BoxTheme;
  bgUrl: string | null; // ảnh nền MarCom cung cấp (bố cục Banner)
  bgName: string | null;
  title: string; // biến: {Count} — đồng bộ code iMIS 05/11
  showDivision: boolean;
  showPosition: boolean;
  photoShape: 'circle' | 'rounded';
  greeting: string;
  signature: string;
  // Không có sinh nhật trong ngày
  emptyMode: 'hide' | 'default';
  emptyText: string;
  // Slide "Chào mừng thành viên mới" — nhân sự của đợt onboard tuần này
  welcomeEnabled: boolean;
  welcomeTitle: string; // biến: {Count} — đồng bộ code iMIS 05/11
  welcomeGreeting: string; // chữ thường
  // CR-20261105-001 thiết kế riêng 05/11 — bộ thiết kế slide Chào mừng, tách khỏi slide Sinh nhật
  welcomeLayout: BoxLayout;
  welcomeTheme: BoxTheme;
  welcomeBgUrl: string | null; // ảnh nền bố cục Banner
  welcomeBgName: string | null;
  welcomePhotoShape: 'circle' | 'rounded';
  welcomeShowDivision: boolean;
  welcomeShowPosition: boolean;
  welcomeSignature: string;
  /** Vị trí slide Chào mừng trong danh sách đầy đủ [banner + Sinh nhật + Chào mừng] (0 = đầu tiên) — CR, như BirthdaySlideIndex. */
  welcomeSlideIndex: number;
  // Slide trang chủ: Sinh nhật + Chào mừng thành viên mới + các banner, mỗi mục slideSeconds giây, di chuột vào thì dừng
  banners: HomeBanner[];
  slideSeconds: number;
  // đồng bộ code iMIS 05/11 — BannerFit (object-fit ảnh banner, mặc định contain) + BirthdaySlideIndex (số banner đứng trước slide sinh nhật)
  bannerFit: BannerFit;
  birthdaySlideIndex: number;
}

export interface MarcomConfig {
  birthday: MailConfig;
  welcome: MailConfig;
  box: BoxConfig;
}

/** Banner mẫu (ảnh vẽ sẵn, 1600×300 — tỉ lệ 16:3 của khung trang chủ) — MarCom thay bằng banner thật ở Cấu hình › Box sinh nhật.
 *  Chữ đặt trong vùng an toàn giữa (x 400–1600) vì khung hẹp sẽ cắt bớt hai bên. */
const sampleBanner = (tag: string, title: string, sub: string, cta: string, c1: string, c2: string, c3: string) => {
  const dots = Array.from({ length: 48 }, (_, i) => `<circle cx="${1380 + (i % 12) * 22}" cy="${104 + Math.floor(i / 12) * 22}" r="2.2" fill="#fff" opacity=".22"/>`).join('');
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="300" viewBox="0 0 2000 375">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset=".55" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient>
<radialGradient id="glow" cx=".75" cy=".2" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="w" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".18"/></linearGradient>
</defs>
<rect width="2000" height="375" fill="url(#g)"/>
<rect width="2000" height="375" fill="url(#glow)"/>
<path d="M0 315 C380 255 700 375 1100 305 S1700 235 2000 285 V375 H0 Z" fill="#fff" opacity=".07"/>
<path d="M0 345 C420 300 820 370 1240 335 S1780 300 2000 325 V375 H0 Z" fill="#fff" opacity=".09"/>
<path d="M1180 0 L1420 0 L1120 375 L880 375 Z" fill="url(#w)"/>
<path d="M1460 0 L1560 0 L1260 375 L1160 375 Z" fill="url(#w)" opacity=".7"/>
<circle cx="1640" cy="40" r="120" fill="#fff" opacity=".06"/>
${dots}
<rect x="400" y="110" rx="15" ry="15" width="${tag.length * 11 + 36}" height="30" fill="#fff" opacity=".2"/>
<text x="418" y="131" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="2" fill="#fff">${tag}</text>
<text x="398" y="200" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="50" font-weight="800" fill="#fff">${title}</text>
<text x="400" y="244" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="22" fill="#fff" opacity=".88">${sub}</text>
<rect x="1430" y="162" rx="24" ry="24" width="${cta.length * 12 + 64}" height="48" fill="#fff"/>
<text x="${1430 + (cta.length * 12 + 64) / 2}" y="193" text-anchor="middle" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="19" font-weight="800" fill="${c1}">${cta} →</text>
</svg>`,
  )}`;
};
const SAMPLE_BANNERS: HomeBanner[] = [
  {
    id: 'bn-1',
    name: 'Town hall quý IV',
    url: sampleBanner('SỰ KIỆN', 'Town hall quý IV/2026', 'Thứ Sáu 30/10 · 15:00 · Hội trường tầng 15 &amp; trực tuyến Teams', 'Xem lịch', '#011b64', '#1f5fa8', '#0ea5e9'),
    link: '',
    active: true,
  },
  {
    id: 'bn-2',
    name: 'Chương trình đào tạo',
    url: sampleBanner('ĐÀO TẠO', 'Tuần lễ học tập VTX', 'Đăng ký các khoá kỹ năng mềm &amp; công nghệ trước 05/11', 'Đăng ký', '#065f46', '#0f8f6c', '#65a30d'),
    link: '',
    active: true,
  },
];

// đồng bộ code iMIS 05/11 — tiêu đề / nội dung / bật (IsActive=1) lấy đúng seed SeedMarcomNotificationTemplates.sql
const DEFAULT_CONFIG: MarcomConfig = {
  birthday: {
    enabled: true,
    sendTime: '09:00',
    subject: 'Chúc mừng sinh nhật {EmployeeName}! 🎂',
    body: '<p>Thân gửi {EmployeeName},</p><p>Nhân dịp sinh nhật của bạn, VTX Group xin gửi tới bạn lời chúc mừng sinh nhật chân thành nhất!<br>Chúc bạn một tuổi mới thật nhiều sức khỏe, niềm vui và luôn giữ được nhiệt huyết trong công việc tại khối {Division}.</p><p>Cảm ơn bạn vì những đóng góp tuyệt vời cho tập thể.</p><p>Thân mến,<br>VTX Group · MarCom</p>',
    usePhoto: true,
    photoShape: 'circle',
    noPhoto: 'default',
    frameUrl: null,
    frameName: null,
  },
  welcome: {
    enabled: true,
    sendTime: '10:00',
    subject: 'Welcome on board, {EmployeeName}! 🎉',
    body: '<p>Thân gửi {EmployeeName},</p><p>Chào mừng bạn chính thức gia nhập đại gia đình VTX Group từ ngày {OnboardDate} với vị trí {Position} – khối {Division}.</p><p>Chúng tôi rất vui được đồng hành cùng bạn. Chúc bạn có những ngày đầu thật thuận lợi, nhanh chóng hòa nhập và tỏa sáng!</p><p>Thân mến,<br>VTX Group · MarCom</p>',
    usePhoto: true,
    photoShape: 'circle',
    noPhoto: 'default',
    frameUrl: null,
    frameName: null,
  },
  box: {
    showOnHome: true,
    postToTeams: true,
    teamsTeam: 'VTX Group Community',
    teamsChannel: 'General',
    teamsPostTime: '08:30',
    teamsMentionAll: true,
    teamsHeader: '🥳 HAPPY BIRTHDAY 🥳',
    teamsBody: `Tháng {{thang}} lại có thêm những chiếc bánh sinh nhật ngọt ngào dành cho các thành viên nhà VTX!

🎉 Cùng gửi lời chúc mừng sinh nhật đến {{soluong_chu}} gương mặt đặc biệt hôm nay nhé!
{{danhsach}}

Chúc các bạn tuổi mới **sức khỏe dồi dào, niềm vui nhân đôi, công việc hanh thông và thành công rực rỡ**! 🚀

Mong rằng chặng đường phía trước sẽ luôn có những cơ hội mới, những trải nghiệm thú vị và thật nhiều khoảnh khắc đáng nhớ cùng đại gia đình VTX.

Cùng thả thật nhiều lời chúc và gửi chút năng lượng tích cực đến các bạn nào! 🎁🎈

💙 **Happy Birthday! Keep shining, keep growing, and make every moment count!**`,
    teamsAttachCard: true,
    cardBgUrl: null,
    cardBgName: null,
    layout: 'cards',
    theme: 'pink',
    bgUrl: null,
    bgName: null,
    title: 'Chúc mừng sinh nhật {Count} thành viên 🎉', // đồng bộ code iMIS 05/11 (MarcomDefaults)
    showDivision: true,
    showPosition: false,
    photoShape: 'circle',
    greeting: 'Chúc mừng sinh nhật! Chúc bạn tuổi mới thật nhiều sức khỏe, hạnh phúc và thành công.',
    signature: 'VTX Group · MarCom',
    emptyMode: 'hide',
    emptyText: 'Hôm nay chưa có sinh nhật nào — chúc cả nhà một ngày làm việc thật hiệu quả! ✨',
    welcomeEnabled: false,
    welcomeTitle: 'Chào mừng {Count} thành viên mới', // đồng bộ code iMIS 05/11 — biến {Count}
    welcomeGreeting: 'Chào mừng bạn đã gia nhập đại gia đình!',
    // CR-20261105-001 thiết kế riêng 05/11 — mặc định khác slide sinh nhật để dễ phân biệt (xanh dương, hiện cả Vị trí)
    welcomeLayout: 'cards',
    welcomeTheme: 'blue',
    welcomeBgUrl: null,
    welcomeBgName: null,
    welcomePhotoShape: 'circle',
    welcomeShowDivision: true,
    welcomeShowPosition: true,
    welcomeSignature: 'VTX Group · MarCom',
    welcomeSlideIndex: 1, // ngay sau slide sinh nhật (CR)
    banners: SAMPLE_BANNERS,
    slideSeconds: 5,
    bannerFit: 'contain', // đồng bộ code iMIS 05/11
    birthdaySlideIndex: 0, // đồng bộ code iMIS 05/11 — mặc định DB = 0 (slide sinh nhật đứng đầu)
  },
};

interface MarcomContextValue {
  /** Nhân sự theo hồ sơ Employee (ảnh Employee) — dùng cho Welcome Onboard. */
  employees: MarcomEmployee[];
  /** Nhân sự kèm ảnh chúc mừng của lần sinh nhật sắp tới / hôm nay — chỉ dùng cho sinh nhật: box, Teams, mail. */
  birthdayEmployees: MarcomEmployee[];
  /** Nhân sự kèm ảnh chúc mừng của sinh nhật năm `year` (ảnh tải lên chỉ dùng cho đúng lần sinh nhật đó). */
  photoForYear: (e: MarcomEmployee, year: number) => MarcomEmployee;
  config: MarcomConfig;
  logs: MailLog[];
  changes: OnboardChange[];
  /** Mốc dữ liệu đồng bộ gần nhất từ hồ sơ nhân sự (mock = lúc mở trang / lúc có thay đổi). */
  syncedAt: Date;
  updateMailConfig: (kind: MailKind, patch: Partial<MailConfig>) => void;
  updateBoxConfig: (patch: Partial<BoxConfig>) => void;
  sendTest: (kind: MailKind, employee: MarcomEmployee, to: string) => void;
  resend: (logId: string) => void;
  refresh: () => void;
  /** Tải ảnh lên cho sinh nhật năm `forYear` của nhân sự (mock S3) → nguồn ảnh tự chuyển sang 'upload'. */
  uploadPhoto: (employeeId: string, file: File, forYear: number) => void;
  /** Xoá ảnh tải lên → quay về ảnh Employee. */
  removePhoto: (employeeId: string) => void;
}

const MarcomContext = createContext<MarcomContextValue | null>(null);

export const MarcomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees] = useState<MarcomEmployee[]>(() => buildEmployees());
  const [logs, setLogs] = useState<MailLog[]>(() => buildMailLogs(employees));
  const [config, setConfig] = useState<MarcomConfig>(DEFAULT_CONFIG);
  // Ngày onboard / Cancel Onboard do HCNS cập nhật trên Employee — ở đây chỉ đọc sang (mock: lịch sử mẫu)
  const [changes] = useState<OnboardChange[]>(() => buildOnboardChanges(employees));
  const [syncedAt, setSyncedAt] = useState(() => new Date());
  // Ảnh tải lên lưu đến khi xoá, nhưng chỉ dùng cho sinh nhật năm forYear
  const [uploads, setUploads] = useState<Record<string, { url: string; name: string; forYear: number }>>({});

  const photoForYear = useMemo(
    () => (e: MarcomEmployee, year: number): MarcomEmployee => {
      const up = uploads[e.id]?.forYear === year ? uploads[e.id] : undefined;
      const source: PhotoSource = up ? 'upload' : 'employee';
      return {
        ...e,
        photoUrl: up ? up.url : e.photoUrl,
        photoSource: source,
        employeePhotoUrl: e.photoUrl,
        uploadedPhotoUrl: up?.url ?? null,
        uploadedPhotoName: up?.name ?? null,
      };
    },
    [uploads],
  );
  // Lần sinh nhật đang áp dụng: năm nay nếu chưa qua (gồm hôm nay), ngược lại năm sau
  const birthdayEmployees = useMemo(() => {
    const today = startOfDay(new Date());
    return employees.map((e) => photoForYear(e, today.getFullYear() + (birthdayThisYear(e) < today ? 1 : 0)));
  }, [employees, photoForYear]);

  const value = useMemo<MarcomContextValue>(
    () => ({
      employees,
      birthdayEmployees,
      photoForYear,
      config,
      logs,
      changes,
      syncedAt,
      updateMailConfig: (kind, patch) => setConfig((c) => ({ ...c, [kind]: { ...c[kind], ...patch } })),
      updateBoxConfig: (patch) => setConfig((c) => ({ ...c, box: { ...c.box, ...patch } })),
      sendTest: (kind, employee, to) =>
        setLogs((l) => [
          { id: `T${Date.now()}`, kind, employeeId: employee.id, employeeName: employee.name, to, sentAt: new Date().toISOString(), status: 'test', note: 'Gửi thử' },
          ...l,
        ]),
      // đồng bộ code iMIS 05/11 — gửi lại ghi dòng Thành công mới, không có ghi chú "Gửi lại thủ công"
      resend: (logId) =>
        setLogs((l) => {
          const src = l.find((x) => x.id === logId);
          if (!src) return l;
          return [{ ...src, id: `R${Date.now()}`, sentAt: new Date().toISOString(), status: 'sent', note: undefined }, ...l];
        }),
      refresh: () => setSyncedAt(new Date()),
      uploadPhoto: (id, file, forYear) => setUploads((m) => ({ ...m, [id]: { url: URL.createObjectURL(file), name: file.name, forYear } })),
      removePhoto: (id) =>
        setUploads((m) => {
          if (m[id]) URL.revokeObjectURL(m[id].url);
          const { [id]: _removed, ...rest } = m;
          return rest;
        }),
    }),
    [employees, birthdayEmployees, photoForYear, config, logs, changes, syncedAt],
  );

  return <MarcomContext.Provider value={value}>{children}</MarcomContext.Provider>;
};

export const useMarcom = () => {
  const ctx = useContext(MarcomContext);
  if (!ctx) throw new Error('useMarcom phải nằm trong MarcomProvider');
  return ctx;
};
