/**
 * pmo.ts — dữ liệu mẫu & công thức của module PMO (Quản trị dự án sản xuất).
 *
 * Theo PRD PMO System v1.0 (MVP): 7 khối, 6 phase, 3 gate, 9 KPI (Phụ lục A),
 * rule health (F1.3), ECV 70/100 (F7.1), 12 cảnh báo (Phụ lục B).
 * Toàn bộ số liệu là mẫu, sinh tất định từ hash (cùng mã → cùng số) — chưa có API.
 */

// ==========================================================================
// Danh mục
// ==========================================================================
export const KHOI = ['G1', 'G2', 'G3', 'G4', 'BFSI', 'YT', 'GPDV'] as const;
export type Khoi = (typeof KHOI)[number];

/** Loại dự án quyết định Ban điều hành & người duyệt gate: BT bình thường · QT quan trọng · CL chiến lược. */
export type ProjType = 'BT' | 'QT' | 'CL';
export const PROJ_TYPE_LABEL: Record<ProjType, string> = { BT: 'Bình thường', QT: 'Quan trọng', CL: 'Chiến lược' };

export const PHASES = [
  { no: 1, name: 'Khởi động' },
  { no: 2, name: 'Discovery' },
  { no: 3, name: 'Thiết kế chi tiết' },
  { no: 4, name: 'Phát triển' },
  { no: 5, name: 'SIT/UAT' },
  { no: 6, name: 'Deploy/Close' },
] as const;

export type Health = 'green' | 'yellow' | 'red';
export const HEALTH_LABEL: Record<Health, string> = { green: 'Xanh', yellow: 'Vàng', red: 'Đỏ' };
export const HEALTH_CLS: Record<Health, string> = {
  green: 'bg-emerald-600 text-white border-emerald-700',
  yellow: 'bg-amber-400 text-slate-900 border-amber-500',
  red: 'bg-rose-600 text-white border-rose-700',
};
export const HEALTH_DOT: Record<Health, string> = { green: 'bg-emerald-500', yellow: 'bg-amber-400', red: 'bg-rose-500' };

// ==========================================================================
// 9 KPI (Phụ lục A)
// ==========================================================================
export type KpiCode = 'velocity' | 'doneVsTime' | 'wpBlocked' | 'carriedOver' | 'defectDensity' | 'budgetBurn' | 'dodRate' | 'crPending' | 'riskScore';
export interface KpiDef {
  code: KpiCode;
  no: number;
  label: string;
  formula: string;
  source: string;
  unit: '%' | 'pt' | 'n' | 'ratio';
  /** Giá trị cao hơn là tốt hơn (true) hay xấu hơn (false). */
  higherBetter: boolean;
  yellow: number;
  red: number;
  /** Thuộc nhóm "critical" của rule health: 1 KPI đỏ trong nhóm → dự án đỏ. */
  critical?: boolean;
}
export const KPI_DEFS: KpiDef[] = [
  { code: 'velocity', no: 1, label: 'Velocity', formula: 'SP Done (pass DoD) / sprint, trung bình 3 sprint so với plan', source: 'F4.2', unit: '%', higherBetter: true, yellow: 90, red: 75 },
  { code: 'doneVsTime', no: 2, label: '% Done vs Time', formula: '(SP Done / SP baseline) − (ngày đã qua / tổng ngày P4)', source: 'F3.2, F4.2', unit: 'pt', higherBetter: true, yellow: -5, red: -10 },
  { code: 'wpBlocked', no: 3, label: 'WP Blocked', formula: 'Số WP blocked > 1 ngày', source: 'F4.3', unit: 'n', higherBetter: false, yellow: 2, red: 4, critical: true },
  { code: 'carriedOver', no: 4, label: 'Carried Over %', formula: 'SP không done / SP planned của sprint', source: 'F4.2', unit: '%', higherBetter: false, yellow: 15, red: 25 },
  { code: 'defectDensity', no: 5, label: 'Defect Density', formula: 'Bug (≠ Rejected) / WP Done trong release', source: 'F5.1', unit: 'ratio', higherBetter: false, yellow: 0.3, red: 0.5 },
  { code: 'budgetBurn', no: 6, label: 'Budget Burn Δ', formula: '% cost đã dùng − % ECV', source: 'F7.2', unit: 'pt', higherBetter: false, yellow: 5, red: 10, critical: true },
  { code: 'dodRate', no: 7, label: 'DoD Rate', formula: 'WP pass DoD lần đầu / WP submit', source: 'F4.2', unit: '%', higherBetter: true, yellow: 90, red: 75 },
  { code: 'crPending', no: 8, label: 'CR Pending', formula: 'Số CR chưa quyết định > 48h', source: 'F9.2', unit: 'n', higherBetter: false, yellow: 2, red: 4 },
  { code: 'riskScore', no: 9, label: 'Risk Score', formula: 'Σ P×I của risk Open', source: 'F9.1', unit: 'n', higherBetter: false, yellow: 8, red: 12, critical: true },
];

export const kpiColor = (d: KpiDef, v: number): Health => {
  if (d.higherBetter) return v < d.red ? 'red' : v < d.yellow ? 'yellow' : 'green';
  return v >= d.red ? 'red' : v >= d.yellow ? 'yellow' : 'green';
};
export const fmtKpi = (d: KpiDef, v: number) => {
  if (d.unit === '%') return `${Math.round(v)}%`;
  if (d.unit === 'pt') return `${v > 0 ? '+' : ''}${Math.round(v)}%`;
  if (d.unit === 'ratio') return v.toFixed(2);
  return String(Math.round(v));
};
export const fmtThreshold = (d: KpiDef) => {
  const f = (v: number) => (d.unit === 'ratio' ? v.toFixed(1) : d.unit === 'n' ? `${v}` : `${v}%`);
  const op = d.higherBetter ? '<' : d.unit === 'n' ? '≥' : '>';
  return `Vàng ${op}${f(d.yellow)} · Đỏ ${op}${f(d.red)}`;
};

/** Rule health F1.3: Đỏ nếu ≥1 KPI đỏ trong nhóm critical hoặc ≥3 KPI đỏ; Vàng nếu ≥2 vàng hoặc 1 đỏ ngoài nhóm; còn lại Xanh. */
export const healthOf = (kpis: Record<KpiCode, number>): { health: Health; drivers: KpiDef[] } => {
  const colored = KPI_DEFS.map((d) => ({ d, c: kpiColor(d, kpis[d.code]) }));
  const reds = colored.filter((x) => x.c === 'red');
  const yellows = colored.filter((x) => x.c === 'yellow');
  if (reds.some((x) => x.d.critical) || reds.length >= 3) return { health: 'red', drivers: reds.map((x) => x.d) };
  if (yellows.length >= 2 || reds.length === 1) return { health: 'yellow', drivers: [...reds, ...yellows].map((x) => x.d) };
  return { health: 'green', drivers: [] };
};

// ==========================================================================
// Thực thể
// ==========================================================================
export type BlockReason = 'Requirement chưa rõ' | 'Dependency nội bộ' | 'Dependency khách' | 'Môi trường' | 'Nhân sự' | 'Khác';
export interface WpBlock {
  wp: string;
  name: string;
  reason: BlockReason;
  owner: string;
  hours: number; // số giờ làm việc đã bị chặn
}
export interface Risk {
  code: string;
  desc: string;
  p: 1 | 2 | 3;
  i: 1 | 2 | 3;
  owner: string;
  status: 'Open' | 'Mitigating' | 'Closed' | 'Occurred';
  lastReview: string; // YYYY-MM-DD
}
export interface SprintWp {
  wp: string;
  name: string;
  owner: string;
  sp: number;
  status: 'To Do' | 'In Progress' | 'Review' | 'Done' | 'Blocked';
  reopen: number;
}
export interface PmoProject {
  id: string;
  code: string; // {KHỐI}-{YYYY}-{seq}
  name: string;
  khoi: Khoi;
  type: ProjType;
  client: string;
  pm: string;
  contractValue: number; // VNĐ
  start: string;
  end: string;
  phase: 1 | 2 | 3 | 4 | 5 | 6;
  phaseDue: string; // ngày dự kiến kết thúc phase hiện tại
  nextGate: 'Scope Freeze' | 'Release Close' | 'Go-live' | 'Close';
  checklistPct: number; // % checklist phase hiện tại
  kpis: Record<KpiCode, number>;
  trend: Record<KpiCode, number[]>; // 8 tuần
  health: Health;
  drivers: KpiDef[];
  ecv: number; // VNĐ đã ghi nhận
  ecvPlan: number; // VNĐ theo plan đến tuần này
  costUsed: number; // VNĐ
  budget: number; // VNĐ
  presaleMargin: number; // % margin định giá
  blocked: WpBlock[];
  risks: Risk[];
  sprint: { seq: number; start: string; end: string; spPlanned: number; spDone: number; velocity: number[]; wps: SprintWp[] };
  alertsOpen: number;
  lastSync: string;
}

// ==========================================================================
// Hash tất định
// ==========================================================================
export const rand = (...keys: (string | number)[]) => {
  let h = 2166136261;
  for (const ch of keys.join('|')) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (h % 10000) / 10000;
};
export const between = (lo: number, hi: number, ...k: (string | number)[]) => lo + (hi - lo) * rand(...k);
export const pick = <T,>(arr: readonly T[], ...k: (string | number)[]) => arr[Math.floor(rand(...k) * arr.length)];
export const addDays = (d: string, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};
export const TODAY = '2026-10-09';
export const dmy = (d: string) => (d ? `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}` : '');
export const fmtVnd = (v: number) => `${Math.round(v).toLocaleString('vi-VN')} ₫`;
export const fmtTy = (v: number) => {
  const a = Math.abs(v);
  if (a >= 1e9) return `${(v / 1e9).toFixed(a >= 1e10 ? 0 : 1).replace(/\.0$/, '')} tỷ`;
  if (a >= 1e6) return `${Math.round(v / 1e6)} tr`;
  return Math.round(v).toLocaleString('vi-VN');
};
export const pct = (a: number, b: number) => (b ? (a / b) * 100 : 0);

// ==========================================================================
// Dự án mẫu
// ==========================================================================
interface Seed {
  khoi: Khoi;
  seq: number;
  name: string;
  client: string;
  pm: string;
  type: ProjType;
  value: number;
  start: string;
  end: string;
  phase: PmoProject['phase'];
  /** Ép màu để bộ mẫu có đủ xanh/vàng/đỏ: 'bad' → KPI xấu, 'warn' → vài KPI vàng. */
  mood?: 'bad' | 'warn';
}
const SEEDS: Seed[] = [
  { khoi: 'G1', seq: 3, name: 'Cổng dịch vụ công tỉnh Hà Nam', client: 'UBND Hà Nam', pm: 'Nguyễn Văn Hùng', type: 'QT', value: 18_500_000_000, start: '2026-02-02', end: '2026-12-31', phase: 4 },
  { khoi: 'G1', seq: 7, name: 'Hệ thống một cửa điện tử Nam Định', client: 'Sở TT&TT Nam Định', pm: 'Trần Thị Mai', type: 'BT', value: 6_200_000_000, start: '2026-05-04', end: '2027-01-31', phase: 3, mood: 'warn' },
  { khoi: 'G2', seq: 2, name: 'ERP Tổng công ty Xi măng', client: 'VICEM', pm: 'Lê Quang Dũng', type: 'CL', value: 42_000_000_000, start: '2025-11-03', end: '2026-12-15', phase: 4, mood: 'bad' },
  { khoi: 'G2', seq: 5, name: 'Quản lý kho thông minh', client: 'Thép Hòa Phát', pm: 'Phạm Minh Tuấn', type: 'BT', value: 4_800_000_000, start: '2026-06-01', end: '2026-11-30', phase: 4 },
  { khoi: 'G3', seq: 1, name: 'Hệ thống giám sát dữ liệu tập trung', client: 'EVN', pm: 'Đỗ Văn Châu', type: 'QT', value: 12_500_000_000, start: '2026-01-05', end: '2026-10-31', phase: 5 },
  { khoi: 'G3', seq: 4, name: 'Nền tảng IoT nhà máy điện', client: 'PVPower', pm: 'Ngô Thu Tùng', type: 'BT', value: 7_300_000_000, start: '2026-04-06', end: '2026-12-31', phase: 4, mood: 'warn' },
  { khoi: 'G4', seq: 2, name: 'Học bạ số toàn tỉnh', client: 'Sở GD&ĐT Bắc Ninh', pm: 'Vũ Thị Lan', type: 'BT', value: 5_100_000_000, start: '2026-03-02', end: '2026-11-15', phase: 4 },
  { khoi: 'G4', seq: 6, name: 'Thư viện số đại học', client: 'ĐH Bách Khoa', pm: 'Hoàng Anh Đức', type: 'BT', value: 3_400_000_000, start: '2026-07-01', end: '2027-02-28', phase: 2 },
  { khoi: 'BFSI', seq: 14, name: 'Core Banking Mobile Upgrade', client: 'VPBank', pm: 'Bùi Thanh Hà', type: 'CL', value: 38_000_000_000, start: '2026-01-12', end: '2026-12-20', phase: 4, mood: 'bad' },
  { khoi: 'BFSI', seq: 17, name: 'Cổng thanh toán QR liên ngân hàng', client: 'NAPAS', pm: 'Lý Hoàng Nam', type: 'QT', value: 15_800_000_000, start: '2026-04-01', end: '2027-03-31', phase: 3 },
  { khoi: 'BFSI', seq: 19, name: 'Hệ thống bảo hiểm số', client: 'Bảo Việt', pm: 'Đinh Thu Trang', type: 'BT', value: 9_600_000_000, start: '2026-06-15', end: '2027-01-15', phase: 4, mood: 'warn' },
  { khoi: 'YT', seq: 3, name: 'Bệnh án điện tử EMR', client: 'BV Bạch Mai', pm: 'Nguyễn Thị Hồng', type: 'CL', value: 26_000_000_000, start: '2026-02-16', end: '2027-02-15', phase: 4 },
  { khoi: 'YT', seq: 5, name: 'Quản lý xét nghiệm LIS', client: 'BV Chợ Rẫy', pm: 'Trương Văn Sơn', type: 'BT', value: 5_900_000_000, start: '2026-05-18', end: '2026-12-31', phase: 4, mood: 'warn' },
  { khoi: 'GPDV', seq: 8, name: 'Vận hành dịch vụ CNTT Viettel Post', client: 'Viettel Post', pm: 'Mai Đức Thắng', type: 'QT', value: 11_200_000_000, start: '2026-01-02', end: '2026-12-31', phase: 4 },
  { khoi: 'GPDV', seq: 11, name: 'Helpdesk & ITSM tập đoàn', client: 'Masan', pm: 'Cao Thị Yến', type: 'BT', value: 4_300_000_000, start: '2026-08-03', end: '2027-03-31', phase: 2 },
];

export const OWNERS = ['Nguyễn Văn An', 'Trần Thu Khánh', 'Phạm Văn Tùng', 'Đặng Hữu Thảo', 'Đỗ Văn Anh', 'Lê Thị Bình'];
export const WP_NAMES = ['Đăng nhập SSO', 'API tra cứu hồ sơ', 'Màn hình phê duyệt', 'Tích hợp thanh toán', 'Báo cáo tổng hợp', 'Đồng bộ danh mục', 'Phân quyền người dùng', 'Xuất file Excel', 'Nhật ký audit', 'Dashboard điều hành', 'Import dữ liệu cũ', 'Thông báo email'];
const RISK_DESCS = ['Khách chậm cung cấp dữ liệu mẫu', 'Thiếu nhân sự .NET senior tháng 11', 'API đối tác chưa có môi trường test', 'Phạm vi SRS còn 3 mục chưa chốt', 'Hạ tầng khách chưa sẵn sàng cho SIT', 'Yêu cầu bảo mật bổ sung từ khách', 'Nhân sự chủ chốt nghỉ dài ngày'];
const REASONS: BlockReason[] = ['Requirement chưa rõ', 'Dependency nội bộ', 'Dependency khách', 'Môi trường', 'Nhân sự', 'Khác'];

const trendOf = (end: number, spread: number, ...k: (string | number)[]) => Array.from({ length: 8 }, (_, i) => end + (between(-spread, spread, ...k, i) * (7 - i)) / 7);

const build = (s: Seed): PmoProject => {
  const id = `${s.khoi}-2026-${String(s.seq).padStart(3, '0')}`;
  const m = s.mood;
  // 9 KPI: mood 'bad' → vài KPI đỏ (trong đó có critical), 'warn' → vài vàng
  const kpis: Record<KpiCode, number> = {
    velocity: m === 'bad' ? between(70, 82, id, 'v') : m === 'warn' ? between(84, 92, id, 'v') : between(92, 108, id, 'v'),
    doneVsTime: m === 'bad' ? between(-14, -6, id, 'd') : m === 'warn' ? between(-7, -2, id, 'd') : between(-3, 5, id, 'd'),
    wpBlocked: m === 'bad' ? Math.round(between(4, 6, id, 'b')) : m === 'warn' ? Math.round(between(1, 3, id, 'b')) : Math.round(between(0, 1.4, id, 'b')),
    carriedOver: m === 'bad' ? between(22, 32, id, 'c') : m === 'warn' ? between(12, 20, id, 'c') : between(3, 13, id, 'c'),
    defectDensity: m === 'bad' ? between(0.35, 0.6, id, 'q') : m === 'warn' ? between(0.2, 0.34, id, 'q') : between(0.05, 0.26, id, 'q'),
    budgetBurn: m === 'bad' ? between(8, 16, id, 'bb') : m === 'warn' ? between(3, 7, id, 'bb') : between(-6, 4, id, 'bb'),
    dodRate: m === 'bad' ? between(72, 86, id, 'dod') : m === 'warn' ? between(86, 93, id, 'dod') : between(91, 100, id, 'dod'),
    crPending: m === 'bad' ? Math.round(between(2, 4, id, 'cr')) : m === 'warn' ? Math.round(between(0, 2, id, 'cr')) : Math.round(between(0, 1.3, id, 'cr')),
    riskScore: m === 'bad' ? Math.round(between(10, 16, id, 'r')) : m === 'warn' ? Math.round(between(6, 10, id, 'r')) : Math.round(between(2, 7, id, 'r')),
  };
  if (s.phase < 4) {
    // chưa vào P4: chưa có sprint → KPI sprint = tốt
    kpis.velocity = 100;
    kpis.carriedOver = 0;
    kpis.doneVsTime = 0;
    kpis.defectDensity = 0;
  }
  const trend = Object.fromEntries(KPI_DEFS.map((d) => [d.code, trendOf(kpis[d.code], d.unit === 'ratio' ? 0.1 : d.unit === 'n' ? 2 : 6, id, d.code)])) as Record<KpiCode, number[]>;
  const { health, drivers } = healthOf(kpis);

  // ECV theo tiến độ thời gian; plan đi trước/sau tuỳ mood
  const total = (new Date(s.end).getTime() - new Date(s.start).getTime()) / 864e5;
  const elapsed = Math.min(total, Math.max(0, (new Date(TODAY).getTime() - new Date(s.start).getTime()) / 864e5));
  const timePct = elapsed / total;
  const ecvPlan = s.value * Math.min(0.95, timePct * 0.9);
  const ecv = ecvPlan * (m === 'bad' ? between(0.72, 0.86, id, 'e') : m === 'warn' ? between(0.86, 0.96, id, 'e') : between(0.95, 1.08, id, 'e'));
  const presaleMargin = between(22, 34, id, 'pm');
  const budget = s.value * (1 - presaleMargin / 100);
  const costUsed = budget * (ecv / s.value + kpis.budgetBurn / 100);

  const blocked: WpBlock[] = Array.from({ length: kpis.wpBlocked }, (_, i) => ({
    wp: `${id.slice(0, 2)}-WP-${String(10 + Math.floor(between(1, 80, id, 'bw', i))).padStart(3, '0')}`,
    name: pick(WP_NAMES, id, 'bn', i),
    reason: pick(REASONS, id, 'br', i),
    owner: pick(OWNERS, id, 'bo', i),
    hours: Math.round(between(6, 40, id, 'bh', i)),
  }));
  const nRisk = 3 + Math.round(between(1, 4, id, 'nr'));
  const risks: Risk[] = Array.from({ length: nRisk }, (_, i) => ({
    code: `R-${String(i + 1).padStart(2, '0')}`,
    desc: RISK_DESCS[(Math.floor(between(0, 7, id, 'rd')) + i) % RISK_DESCS.length],
    p: (1 + Math.floor(between(0, 3, id, 'rp', i))) as 1 | 2 | 3,
    i: (1 + Math.floor(between(0, 3, id, 'ri', i))) as 1 | 2 | 3,
    owner: pick(OWNERS, id, 'ro', i),
    status: pick(['Open', 'Open', 'Mitigating', 'Closed'] as const, id, 'rs', i),
    lastReview: addDays(TODAY, -Math.round(between(0, 20, id, 'rl', i))),
  }));

  const sprintSeq = s.phase >= 4 ? 4 + Math.floor(between(0, 8, id, 'ss')) : 0;
  const spPlanned = Math.round(between(34, 60, id, 'sp'));
  const spDone = Math.round(spPlanned * (1 - kpis.carriedOver / 100) * (0.6 + 0.4 * between(0, 1, id, 'sd')));
  const wps: SprintWp[] = Array.from({ length: 7 }, (_, i) => ({
    wp: `${id.slice(0, 2)}-WP-${String(100 + sprintSeq * 7 + i).padStart(3, '0')}`,
    name: WP_NAMES[(i * 3 + s.seq) % WP_NAMES.length],
    owner: pick(OWNERS, id, 'wo', i),
    sp: Math.round(between(3, 13, id, 'ws', i)),
    status: i < Math.min(2, blocked.length) && m ? 'Blocked' : pick(['Done', 'Done', 'In Progress', 'Review', 'To Do'] as const, id, 'wst', i),
    reopen: rand(id, 'wr', i) < 0.2 ? 1 : 0,
  }));
  const phaseDue = addDays(TODAY, Math.round(between(-6, 40, id, 'pd')));
  const nextGate: PmoProject['nextGate'] = s.phase <= 2 ? 'Scope Freeze' : s.phase <= 4 ? 'Release Close' : s.phase === 5 ? 'Go-live' : 'Close';

  return {
    id,
    code: id,
    name: s.name,
    khoi: s.khoi,
    type: s.type,
    client: s.client,
    pm: s.pm,
    contractValue: s.value,
    start: s.start,
    end: s.end,
    phase: s.phase,
    phaseDue,
    nextGate,
    checklistPct: Math.round(between(m === 'bad' ? 40 : 60, 100, id, 'ck')),
    kpis,
    trend,
    health,
    drivers,
    ecv,
    ecvPlan,
    costUsed,
    budget,
    presaleMargin,
    blocked,
    risks,
    sprint: {
      seq: sprintSeq,
      start: addDays(TODAY, -Math.round(between(2, 11, id, 'sst'))),
      end: addDays(TODAY, Math.round(between(2, 11, id, 'sen'))),
      spPlanned,
      spDone,
      velocity: Array.from({ length: 6 }, (_, i) => Math.round(spPlanned * (kpis.velocity / 100) * between(0.85, 1.12, id, 'vel', i))),
      wps,
    },
    alertsOpen: (health === 'red' ? 2 : 0) + (health === 'yellow' ? 1 : 0) + (kpis.wpBlocked >= 2 ? 1 : 0) + (kpis.crPending >= (health === 'green' ? 2 : 1) ? 1 : 0) + (kpis.budgetBurn > 10 ? 1 : 0),
    lastSync: '09:42',
  };
};

export const PMO_PROJECTS: PmoProject[] = SEEDS.map(build);

/** Margin thực = (ECV − cost) / ECV. */
export const marginOf = (p: Pick<PmoProject, 'ecv' | 'costUsed'>) => (p.ecv ? ((p.ecv - p.costUsed) / p.ecv) * 100 : 0);
export const riskScore = (r: Risk) => r.p * r.i;

/** SLA giờ làm việc: 8h/ngày. */
export const blockedDays = (hours: number) => hours / 8;

// ==========================================================================
// Hàng đợi phê duyệt (F2.2, F9.2, F5.2, F8.1, F8.2)
// ==========================================================================
export type InboxKind = 'Gate' | 'CR' | 'Waiver' | 'Nguồn lực' | 'Điều chuyển' | 'Phân bổ giá trị';
export type InboxStatus = 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
export interface InboxItem {
  id: string;
  kind: InboxKind;
  projectId: string;
  title: string;
  detail: string;
  submittedBy: string;
  submittedAt: string; // YYYY-MM-DD
  slaDays: number; // ngày làm việc
  approver: string; // role phải duyệt bước hiện tại
  step?: string; // ví dụ "Bước 2/3 · GĐK"
  status: InboxStatus;
  decidedAt?: string;
  reason?: string;
  /** Tác động để người duyệt thấy ngay (CR/điều chuyển). */
  impact?: { label: string; value: string }[];
}

const P = (khoi: Khoi, seq: number) => `${khoi}-2026-${String(seq).padStart(3, '0')}`;
export const INBOX_SEED: InboxItem[] = [
  {
    id: 'GT-026',
    kind: 'Gate',
    projectId: P('G3', 1),
    title: 'Gate Go-live — Release cuối',
    detail: 'Checklist P5 100% · Quality Gate pass · UAT sign-off đính kèm biên bản 03/10',
    submittedBy: 'Đỗ Văn Châu (PM)',
    submittedAt: '2026-10-07',
    slaDays: 2,
    approver: 'GĐSX',
    step: 'Bước 1/2 · GĐSX → GĐK',
    status: 'Chờ duyệt',
    impact: [
      { label: 'ECV sau gate', value: '+1,8 tỷ (WP nền lên 100%)' },
      { label: 'Bug C/H mở', value: '0' },
    ],
  },
  {
    id: 'GT-027',
    kind: 'Gate',
    projectId: P('G4', 6),
    title: 'Gate Scope Freeze',
    detail: 'Checklist P2 còn 2 mục không bắt buộc trống (có lý do) · WBS 48 WP, 100% có owner/SP',
    submittedBy: 'Hoàng Anh Đức (PM)',
    submittedAt: '2026-10-08',
    slaDays: 2,
    approver: 'GĐSX',
    status: 'Chờ duyệt',
    impact: [
      { label: 'Khóa baseline', value: 'WBS · Master Plan · Phân bổ giá trị' },
      { label: 'WP nền', value: '18% giá trị HĐ (ngưỡng G4 15%)' },
    ],
  },
  {
    id: 'CR-112',
    kind: 'CR',
    projectId: P('BFSI', 14),
    title: 'CR-112 · Bổ sung xác thực sinh trắc học eKYC',
    detail: 'Nguồn: khách · Out-of-scope · Đề xuất: tính phí',
    submittedBy: 'Bùi Thanh Hà (PM)',
    submittedAt: '2026-10-05',
    slaDays: 2,
    approver: 'GĐK',
    step: 'Có tính phí → GĐK + Finance',
    status: 'Chờ duyệt',
    impact: [
      { label: 'WP ảnh hưởng', value: '4 WP (BF-WP-031, 032, 040, 041)' },
      { label: 'Effort delta', value: '+34 SP' },
      { label: 'Cost delta', value: '+620 triệu' },
      { label: 'Timeline delta', value: '+12 ngày (R3)' },
      { label: 'Margin sau CR', value: '27,1% → 26,4%' },
    ],
  },
  {
    id: 'CR-115',
    kind: 'CR',
    projectId: P('G2', 2),
    title: 'CR-115 · Đổi luồng duyệt phiếu xuất kho 2 cấp',
    detail: 'Nguồn: khách · In-scope (diễn giải lại SRS) · Đề xuất: hấp thụ',
    submittedBy: 'Lê Quang Dũng (PM)',
    submittedAt: '2026-10-06',
    slaDays: 2,
    approver: 'GĐSX',
    step: 'Hấp thụ trên ngưỡng 5% SP → GĐSX',
    status: 'Chờ duyệt',
    impact: [
      { label: 'WP ảnh hưởng', value: '2 WP' },
      { label: 'Effort delta', value: '+9 SP (6,4% SP release)' },
      { label: 'Timeline delta', value: '0 ngày (dùng RBuf)' },
    ],
  },
  {
    id: 'WV-008',
    kind: 'Waiver',
    projectId: P('YT', 5),
    title: 'Waiver Quality Gate R2 · 1 bug High còn mở',
    detail: 'Bug LIS-412 (in nhãn mẫu lệch 2mm) đã có workaround, khách chấp nhận bằng email 06/10 · hạn xử lý 20/10',
    submittedBy: 'Trương Văn Sơn (PM)',
    submittedAt: '2026-10-08',
    slaDays: 2,
    approver: 'GĐSX',
    status: 'Chờ duyệt',
    impact: [
      { label: 'Tiêu chí khác', value: 'Regression 97% · Automation 74% · DoD 92%' },
      { label: 'Nếu duyệt', value: 'Close R2, ECV feature R2 +70%' },
    ],
  },
  {
    id: 'RQ-041',
    kind: 'Nguồn lực',
    projectId: P('BFSI', 17),
    title: 'Xin 1 Senior .NET · 100% · 03/11 → 31/12',
    detail: 'Cho release R2 (cổng QR) · hệ thống gợi ý: Đặng Hữu Thảo (còn 60%), Phạm Văn Tùng (còn 100% từ 10/11)',
    submittedBy: 'Lý Hoàng Nam (PM)',
    submittedAt: '2026-10-08',
    slaDays: 3,
    approver: 'GĐSX',
    status: 'Chờ duyệt',
  },
  {
    id: 'TR-013',
    kind: 'Điều chuyển',
    projectId: P('YT', 3),
    title: 'Điều chuyển Trần Thu Khánh (G3 → YT) · 50% · 15/10 → 15/01',
    detail: 'Lý do: EMR thiếu BA có kinh nghiệm HIS; allocation hiện tại 50% (G3-2026-001 kết thúc 31/10)',
    submittedBy: 'GĐSX khối YT',
    submittedAt: '2026-10-03',
    slaDays: 3,
    approver: 'GĐK khối cho (G3)',
    step: 'Bước 1/2 · GĐK G3 → GĐK YT',
    status: 'Chờ duyệt',
    impact: [
      { label: 'Tác động G3', value: 'G3-2026-004 giảm 0,5 người từ 15/10' },
      { label: 'Cost', value: 'Tính vào YT-2026-003, rate khối G3' },
    ],
  },
  {
    id: 'AL-005',
    kind: 'Phân bổ giá trị',
    projectId: P('GPDV', 11),
    title: 'Bảng phân bổ giá trị hợp đồng (trước Scope Freeze)',
    detail: 'Phương pháp: theo tỉ lệ SP · chênh lệch so với phương pháp (a): 0% · WP nền 21% (ngưỡng GPDV 20%)',
    submittedBy: 'Cao Thị Yến (PM)',
    submittedAt: '2026-10-09',
    slaDays: 2,
    approver: 'GĐK',
    status: 'Chờ duyệt',
  },
  {
    id: 'GT-024',
    kind: 'Gate',
    projectId: P('G1', 3),
    title: 'Gate Release Close — R2',
    detail: 'Quality Gate pass · Release Report đã sinh',
    submittedBy: 'Nguyễn Văn Hùng (PM)',
    submittedAt: '2026-10-01',
    slaDays: 2,
    approver: 'GĐSX',
    status: 'Đã duyệt',
    decidedAt: '2026-10-02',
  },
  {
    id: 'CR-109',
    kind: 'CR',
    projectId: P('G1', 7),
    title: 'CR-109 · Thêm báo cáo thống kê theo xã',
    detail: 'Nguồn: khách · Out-of-scope · Đề xuất: tính phí',
    submittedBy: 'Trần Thị Mai (PM)',
    submittedAt: '2026-09-29',
    slaDays: 2,
    approver: 'GĐK',
    status: 'Từ chối',
    decidedAt: '2026-10-01',
    reason: 'Chưa có xác nhận phạm vi từ khách; PM bổ sung biên bản làm việc rồi trình lại',
  },
];

/** Số ngày làm việc (T2–T6) từ ngày a đến ngày b. */
export const workDays = (a: string, b: string) => {
  let n = 0;
  const d = new Date(a);
  const e = new Date(b);
  while (d < e) {
    d.setDate(d.getDate() + 1);
    const w = d.getDay();
    if (w !== 0 && w !== 6) n++;
  }
  return n;
};
