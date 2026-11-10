/**
 * MarCom store (mock) — nhân sự (đồng bộ từ hồ sơ iMIS), cấu hình box sinh nhật + 2 email tự động, lịch sử gửi,
 * nhật ký đổi ngày onboard. "Gửi" là mock: ghi vào lịch sử, chưa gửi thật.
 */
import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  MarcomEmployee, MailLog, MailKind, OnboardChange, PhotoSource,
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

/** Box sinh nhật — MarCom tự thiết kế, đăng lên trang chủ iMIS và/hoặc kênh Microsoft Teams. */
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
  // Thiết kế
  layout: BoxLayout;
  theme: BoxTheme;
  bgUrl: string | null; // ảnh nền MarCom cung cấp (bố cục Banner)
  bgName: string | null;
  title: string; // biến: {{soluong}}
  showDivision: boolean;
  showPosition: boolean;
  photoShape: 'circle' | 'rounded';
  greeting: string;
  signature: string;
  // Không có sinh nhật trong ngày
  emptyMode: 'hide' | 'default';
  emptyText: string;
  // Slide trang chủ: box sinh nhật + các banner, mỗi mục slideSeconds giây, di chuột vào thì dừng
  banners: HomeBanner[];
  slideSeconds: number;
}

export interface MarcomConfig {
  birthday: MailConfig;
  welcome: MailConfig;
  box: BoxConfig;
}

/** Banner mẫu (ảnh vẽ sẵn, 2000×230 — tỉ lệ khung trang chủ) — MarCom thay bằng banner thật ở Cấu hình › Box sinh nhật.
 *  Chữ đặt trong vùng an toàn giữa (x 400–1600) vì khung hẹp sẽ cắt bớt hai bên. */
const sampleBanner = (tag: string, title: string, sub: string, cta: string, c1: string, c2: string, c3: string) => {
  const dots = Array.from({ length: 48 }, (_, i) => `<circle cx="${1380 + (i % 12) * 22}" cy="${40 + Math.floor(i / 12) * 22}" r="2.2" fill="#fff" opacity=".22"/>`).join('');
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="230" viewBox="0 0 2000 230">
<defs>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset=".55" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient>
<radialGradient id="glow" cx=".75" cy=".2" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="w" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".18"/></linearGradient>
</defs>
<rect width="2000" height="230" fill="url(#g)"/>
<rect width="2000" height="230" fill="url(#glow)"/>
<path d="M0 190 C380 130 700 250 1100 180 S1700 110 2000 160 V230 H0 Z" fill="#fff" opacity=".07"/>
<path d="M0 215 C420 170 820 240 1240 205 S1780 170 2000 195 V230 H0 Z" fill="#fff" opacity=".09"/>
<path d="M1180 0 L1420 0 L1240 230 L1000 230 Z" fill="url(#w)"/>
<path d="M1460 0 L1560 0 L1380 230 L1280 230 Z" fill="url(#w)" opacity=".7"/>
<circle cx="1640" cy="40" r="120" fill="#fff" opacity=".06"/>
${dots}
<rect x="400" y="44" rx="15" ry="15" width="${tag.length * 11 + 36}" height="30" fill="#fff" opacity=".2"/>
<text x="418" y="65" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="15" font-weight="800" letter-spacing="2" fill="#fff">${tag}</text>
<text x="398" y="132" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="50" font-weight="800" fill="#fff">${title}</text>
<text x="400" y="174" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="22" fill="#fff" opacity=".88">${sub}</text>
<rect x="1430" y="100" rx="24" ry="24" width="${cta.length * 12 + 64}" height="48" fill="#fff"/>
<text x="${1430 + (cta.length * 12 + 64) / 2}" y="131" text-anchor="middle" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="19" font-weight="800" fill="${c1}">${cta} →</text>
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

const DEFAULT_CONFIG: MarcomConfig = {
  birthday: {
    enabled: true,
    sendTime: '09:00',
    subject: 'Chúc mừng sinh nhật {{fullname}}! 🎂',
    body: `Thân gửi {{fullname}},

Nhân dịp sinh nhật của bạn, VTX Group xin gửi tới bạn lời chúc mừng sinh nhật chân thành nhất!
Chúc bạn một tuổi mới thật nhiều sức khỏe, niềm vui và luôn giữ được nhiệt huyết trong công việc tại khối {{khoi}}.

Cảm ơn bạn vì những đóng góp tuyệt vời cho tập thể.

Thân mến,
VTX Group · MarCom`,
    usePhoto: true,
    photoShape: 'circle',
    noPhoto: 'default',
    frameUrl: null,
    frameName: null,
  },
  welcome: {
    enabled: true,
    sendTime: '10:00',
    subject: 'Welcome on board, {{fullname}}! 🎉',
    body: `Thân gửi {{fullname}},

Chào mừng bạn chính thức gia nhập đại gia đình VTX Group từ ngày {{ngayonboard}} với vị trí {{vitri}} – khối {{khoi}}.

Chúng tôi rất vui được đồng hành cùng bạn. Chúc bạn có những ngày đầu thật thuận lợi, nhanh chóng hòa nhập và tỏa sáng!

Thân mến,
VTX Group · MarCom`,
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
    title: 'Chúc mừng sinh nhật {{soluong}} thành viên 🎉',
    showDivision: true,
    showPosition: false,
    photoShape: 'circle',
    greeting: 'Chúc mừng sinh nhật! Chúc bạn tuổi mới thật nhiều sức khỏe, hạnh phúc và thành công.',
    signature: 'VTX Group · MarCom',
    emptyMode: 'hide',
    emptyText: 'Hôm nay chưa có sinh nhật nào — chúc cả nhà một ngày làm việc thật hiệu quả! ✨',
    banners: SAMPLE_BANNERS,
    slideSeconds: 5,
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
      resend: (logId) =>
        setLogs((l) => {
          const src = l.find((x) => x.id === logId);
          if (!src) return l;
          return [{ ...src, id: `R${Date.now()}`, sentAt: new Date().toISOString(), status: 'sent', note: 'Gửi lại thủ công' }, ...l];
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
