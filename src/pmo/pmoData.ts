/**
 * pmoData.ts — dữ liệu mẫu mở rộng cho các màn PMO còn lại (PMO-03 → PMO-19).
 *
 * Mọi số liệu sinh tất định bằng hash (cùng mã → cùng số), dựa trên PMO_PROJECTS trong pmo.ts.
 * Gồm: nhân sự & allocation 12 tuần, rate card & overhead, cấu hình khối, chi tiết dự án
 * (feature → WP, release, checklist phase, bug, CR, sổ ECV, cost theo tuần, lịch sử gate, baseline),
 * cảnh báo (Phụ lục B), báo cáo, tích hợp, user-role, audit log, timesheet, yêu cầu nguồn lực, điều chuyển.
 */
import { KHOI, KPI_DEFS, Khoi, OWNERS, PHASES, PMO_PROJECTS, PmoProject, TODAY, WP_NAMES, addDays, between, pick, rand } from './pmo';

// ==========================================================================
// Thời gian
// ==========================================================================
/** Thứ Hai của tuần chứa ngày d. */
export const mondayOf = (d: string) => {
  const x = new Date(d);
  const w = x.getDay() || 7;
  x.setDate(x.getDate() - w + 1);
  return x.toISOString().slice(0, 10);
};
export const THIS_WEEK = mondayOf(TODAY); // 2026-10-05
/** 12 tuần tới (allocation, capacity). */
export const NEXT_WEEKS = Array.from({ length: 12 }, (_, i) => addDays(THIS_WEEK, i * 7));
/** 12 tuần đã qua, tính cả tuần này (cost, ECV, xu hướng). */
export const PAST_WEEKS = Array.from({ length: 12 }, (_, i) => addDays(THIS_WEEK, (i - 11) * 7));
export const weekLabel = (w: string) => `${w.slice(8, 10)}/${w.slice(5, 7)}`;
/** Số tuần ISO (gần đúng) để hiển thị "W41". */
export const weekNo = (w: string) => {
  const d = new Date(w);
  const start = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - start.getTime()) / 864e5 + start.getDay() + 1) / 7);
};

// ==========================================================================
// Nhân sự
// ==========================================================================
export const LEVELS = ['Fresher', 'Junior', 'Middle', 'Senior', 'Lead'] as const;
export type Level = (typeof LEVELS)[number];
export type JobRole = 'PM' | 'BA' | 'DEV' | 'QA' | 'TL';
export interface Person {
  code: string;
  name: string;
  khoi: Khoi; // khối gốc
  level: Level;
  job: JobRole;
  skill: string;
}
const HO = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô', 'Dương', 'Lý'];
const DEM = ['Văn', 'Thị', 'Minh', 'Thu', 'Hữu', 'Quang', 'Thanh', 'Hoàng', 'Ngọc', 'Đức'];
const TEN = ['An', 'Bình', 'Châu', 'Dũng', 'Giang', 'Hà', 'Hải', 'Hiếu', 'Hùng', 'Khánh', 'Lan', 'Linh', 'Long', 'Mai', 'Nam', 'Phong', 'Quân', 'Sơn', 'Tâm', 'Thảo', 'Trang', 'Tú', 'Tùng', 'Việt', 'Yến'];
const SKILLS: Record<JobRole, string[]> = {
  PM: ['Agile/Scrum', 'PMP'],
  BA: ['BA nghiệp vụ công', 'BA ngân hàng', 'BA y tế'],
  DEV: ['.NET', 'Java', 'ReactJS', 'NodeJS', 'Flutter', 'Python'],
  QA: ['Manual test', 'Automation (Selenium)', 'Performance test'],
  TL: ['Solution Architect', '.NET Lead', 'Java Lead'],
};
const JOB_MIX: JobRole[] = ['DEV', 'DEV', 'DEV', 'DEV', 'BA', 'QA', 'QA', 'TL'];

export const PEOPLE: Person[] = KHOI.flatMap((k, ki) =>
  Array.from({ length: 7 }, (_, i) => {
    const key = `${k}-${i}`;
    const job = JOB_MIX[(i + ki) % JOB_MIX.length];
    const level: Level = job === 'TL' ? 'Lead' : pick(['Fresher', 'Junior', 'Middle', 'Middle', 'Senior', 'Senior'] as const, key, 'lv');
    return {
      code: `NV${String(1000 + ki * 20 + i)}`,
      name: `${pick(HO, key, 'h')} ${pick(DEM, key, 'd')} ${TEN[(ki * 7 + i * 3) % TEN.length]}`,
      khoi: k,
      level,
      job,
      skill: pick(SKILLS[job], key, 'sk'),
    };
  }),
);
export const personByCode = (code: string) => PEOPLE.find((p) => p.code === code);

// ==========================================================================
// Allocation theo tuần (F8.1) — đơn vị 10%
// ==========================================================================
export interface AllocCell {
  projectId: string;
  pct: number;
}
/** allocation[personCode][week] = các dự án và % trong tuần. */
export const ALLOCATION: Record<string, Record<string, AllocCell[]>> = Object.fromEntries(
  PEOPLE.map((p) => {
    const own = PMO_PROJECTS.filter((x) => x.khoi === p.khoi);
    const main = own.length ? pick(own, p.code, 'm').id : PMO_PROJECTS[0].id;
    const second = rand(p.code, 'two') < 0.45 ? pick(PMO_PROJECTS, p.code, 's').id : '';
    const benchFrom = rand(p.code, 'bench') < 0.12 ? Math.floor(between(0, 6, p.code, 'bf')) : 99;
    const over = rand(p.code, 'over') < 0.1;
    const weeks = Object.fromEntries(
      NEXT_WEEKS.map((w, wi) => {
        const cells: AllocCell[] = [];
        if (wi >= benchFrom) cells.push({ projectId: main, pct: wi - benchFrom < 2 ? 40 : 30 });
        else {
          const a = second ? 60 + Math.round(between(0, 2, p.code, 'a', wi)) * 10 : over && wi < 4 ? 80 : 100;
          cells.push({ projectId: main, pct: a });
          if (second && second !== main) cells.push({ projectId: second, pct: over && wi < 5 ? 60 : 100 - a });
          else if (over && wi < 4) cells.push({ projectId: pick(PMO_PROJECTS, p.code, 'o').id, pct: 40 });
        }
        return [w, cells];
      }),
    );
    return [p.code, weeks];
  }),
);
export const allocTotal = (code: string, week: string) => (ALLOCATION[code]?.[week] || []).reduce((s, c) => s + c.pct, 0);

// ==========================================================================
// Rate card & overhead (F7.3) — chỉ Finance sửa; PMO không nhận lương cá nhân
// ==========================================================================
export interface RateRow {
  khoi: Khoi;
  level: Level;
  rate: number; // VNĐ / giờ (blended: gross + phúc lợi)
  effectiveFrom: string;
}
const BASE_RATE: Record<Level, number> = { Fresher: 115_000, Junior: 170_000, Middle: 255_000, Senior: 355_000, Lead: 470_000 };
const KHOI_MUL: Record<Khoi, number> = { G1: 0.95, G2: 1, G3: 1, G4: 0.92, BFSI: 1.15, YT: 1.05, GPDV: 0.9 };
export const RATE_CARD: RateRow[] = KHOI.flatMap((k) =>
  LEVELS.flatMap((lv) => [
    { khoi: k, level: lv, rate: Math.round((BASE_RATE[lv] * KHOI_MUL[k] * 0.96) / 1000) * 1000, effectiveFrom: '2026-04-01' },
    { khoi: k, level: lv, rate: Math.round((BASE_RATE[lv] * KHOI_MUL[k]) / 1000) * 1000, effectiveFrom: '2026-07-01' },
  ]),
);
export const rateOf = (khoi: Khoi, level: Level, at = TODAY) =>
  RATE_CARD.filter((r) => r.khoi === khoi && r.level === level && r.effectiveFrom <= at).sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom))[0]?.rate || 0;
export const OVERHEAD: Record<Khoi, number> = { G1: 18, G2: 20, G3: 20, G4: 17, BFSI: 24, YT: 22, GPDV: 16 };

// ==========================================================================
// Cấu hình khối (PMO-18)
// ==========================================================================
export interface KhoiConfig {
  khoi: Khoi;
  ecvInternalPct: number; // tỉ lệ ECV khi nghiệm thu nội bộ (mặc định 70)
  foundationMinPct: number; // tỉ lệ WP nền tối thiểu (OQ-019)
  foundationMaxPct: number;
  crAbsorbSpPct: number; // ngưỡng SP để PM tự duyệt CR hấp thụ (OQ-017)
  sprintWeeks: number;
  gateSlaDays: number;
  /** Ngưỡng 9 KPI: mặc định lấy từ Phụ lục A. */
  thresholds: Record<string, { yellow: number; red: number }>;
}
export const KHOI_CONFIG: KhoiConfig[] = KHOI.map((k) => ({
  khoi: k,
  ecvInternalPct: 70,
  foundationMinPct: k === 'BFSI' || k === 'YT' ? 25 : k === 'GPDV' ? 20 : 15,
  foundationMaxPct: 30,
  crAbsorbSpPct: 5,
  sprintWeeks: 2,
  gateSlaDays: 2,
  thresholds: Object.fromEntries(KPI_DEFS.map((d) => [d.code, { yellow: d.yellow, red: d.red }])),
}));

/** Template checklist mặc định theo phase (F2.1). */
export const PHASE_CHECKLIST: Record<number, { code: string; name: string; required: boolean }[]> = {
  1: [
    { code: 'P1-01', name: 'Quyết định giao dự án, gán PM', required: true },
    { code: 'P1-02', name: 'Kick-off nội bộ', required: true },
    { code: 'P1-03', name: 'Ban điều hành theo loại dự án', required: true },
  ],
  2: [
    { code: 'P2-01', name: 'BRD signed', required: true },
    { code: 'P2-02', name: 'SRS baseline ≥90%', required: true },
    { code: 'P2-03', name: 'WBS đủ owner / release / SP', required: true },
    { code: 'P2-04', name: 'Master Plan', required: true },
    { code: 'P2-05', name: 'Risk Register', required: true },
    { code: 'P2-06', name: 'HLD Discovery 6 artifact', required: true },
    { code: 'P2-07', name: 'Test Strategy', required: true },
    { code: 'P2-08', name: 'Bảng phân bổ giá trị đã duyệt', required: true },
    { code: 'P2-09', name: 'Biên bản họp khách hàng', required: false },
  ],
  3: [
    { code: 'P3-01', name: 'SRS chi tiết', required: true },
    { code: 'P3-02', name: 'API contract', required: true },
    { code: 'P3-03', name: 'DB design', required: true },
    { code: 'P3-04', name: 'Test Plan', required: true },
    { code: 'P3-05', name: 'Automation framework', required: true },
    { code: 'P3-06', name: 'Prototype UI được khách góp ý', required: false },
  ],
  4: [
    { code: 'P4-01', name: 'Release close report mỗi release', required: true },
    { code: 'P4-02', name: 'Quality Gate pass hoặc waiver', required: true },
    { code: 'P4-03', name: 'Demo cuối release với khách', required: true },
    { code: 'P4-04', name: 'Cập nhật tài liệu kỹ thuật', required: false },
  ],
  5: [
    { code: 'P5-01', name: 'SIT exit (QA Lead sign-off)', required: true },
    { code: 'P5-02', name: 'UAT sign-off', required: true },
    { code: 'P5-03', name: 'Performance report', required: true },
    { code: 'P5-04', name: 'Security report', required: true },
  ],
  6: [
    { code: 'P6-01', name: 'Hypercare', required: true },
    { code: 'P6-02', name: 'Bàn giao vận hành', required: true },
    { code: 'P6-03', name: 'Lessons learned', required: true },
  ],
};

// ==========================================================================
// Chi tiết dự án (PMO-06)
// ==========================================================================
export type WpType = 'CRUD' | 'API' | 'Integration' | 'Architecture' | 'NFR' | 'Test';
export const WP_TYPES: WpType[] = ['CRUD', 'API', 'Integration', 'Architecture', 'NFR', 'Test'];
export type WpStatus = 'To Do' | 'In Progress' | 'Review' | 'Done' | 'Blocked';
export interface Wp {
  code: string;
  name: string;
  feature: string;
  type: WpType;
  sp: number;
  release: string;
  owner: string;
  status: WpStatus;
  dodPass: boolean;
  jira: string;
}
export type Acceptance = 'Đang làm' | 'Nghiệm thu nội bộ' | 'Khách nghiệm thu' | 'Khách reject';
export interface Feature {
  code: string;
  name: string;
  foundation: boolean; // nhóm WP nền (Architecture, CI/CD, NFR, Security, Migration, Deployment)
  allocValue: number;
  release: string;
  acceptance: Acceptance;
  ecv: number;
  cost: number;
  wps: Wp[];
}
export interface Release {
  code: string;
  start: string;
  end: string;
  goal: string;
  status: 'Đã close' | 'Đang chạy' | 'Kế hoạch';
  spPlanned: number;
  spDone: number;
  capacity: number;
  quality: { critHighOpen: number; regression: number; automation: number; dod: number; waiver?: string };
}
export interface ChecklistItem {
  code: string;
  name: string;
  required: boolean;
  done: boolean;
  evidence: string;
  doneBy?: string;
  doneAt?: string;
}
export interface Bug {
  key: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  phaseFound: 'SIT' | 'UAT' | 'Sprint' | 'Hypercare' | '';
  release: string;
  wp: string;
  origin: 'Code' | 'Requirement' | 'Design' | 'Môi trường';
  owner: string;
  ownerConfirmed: boolean;
  status: 'Open' | 'In Progress' | 'Retest' | 'Closed' | 'Rejected';
  reopen: number;
  createdAt: string;
}
export interface ChangeRequest {
  code: string;
  title: string;
  source: 'Khách' | 'Nội bộ';
  classification: 'In-scope' | 'Out-of-scope';
  wps: string[];
  spDelta: number;
  costDelta: number;
  daysDelta: number;
  proposal: 'Tính phí' | 'Hấp thụ' | 'Từ chối';
  step: 'Nhận' | 'Phân loại' | 'Impact' | 'Phê duyệt' | 'Thực hiện' | 'Đóng';
  createdAt: string;
  decidedAt?: string;
}
export interface EcvEvent {
  at: string;
  feature: string;
  event: '+70% nội bộ pass' | '+30% khách nghiệm thu' | '−70% khách reject' | 'WP nền theo tỉ lệ';
  delta: number;
  by: string;
  evidence: string;
}
export interface GateEvent {
  gate: string;
  submittedAt: string;
  decidedAt: string;
  decision: 'Pass' | 'Từ chối' | 'Chờ duyệt';
  approvers: string;
  note: string;
}
export interface Baseline {
  version: number;
  at: string;
  reason: string;
  by: string;
}
export interface ProjectDetail {
  features: Feature[];
  wps: Wp[];
  releases: Release[];
  checklist: ChecklistItem[];
  bugs: Bug[];
  crs: ChangeRequest[];
  ecvLedger: EcvEvent[];
  weekly: { week: string; cost: number; costCum: number; ecvCum: number; ecvPlanCum: number }[];
  gates: GateEvent[];
  baselines: Baseline[];
  team: { person: Person; pct: number; role: string }[];
  allocMethod: 'Tỉ lệ SP' | 'Giờ kế hoạch × rate' | 'Nhập tay';
}

const FEATURE_NAMES = ['Quản lý hồ sơ', 'Cổng thông tin', 'Thanh toán trực tuyến', 'Báo cáo điều hành', 'Tích hợp hệ thống lõi', 'Ứng dụng di động', 'Quản lý danh mục', 'Phân quyền & bảo mật', 'Thông báo đa kênh'];
const FOUNDATION_NAMES = ['Kiến trúc & CI/CD', 'NFR, bảo mật & migration'];
const BUG_TITLES = ['Sai định dạng ngày khi xuất Excel', 'Không lưu được khi mất mạng', 'Phân trang trả về trùng bản ghi', 'Timeout khi tra cứu > 10.000 hồ sơ', 'Sai làm tròn số tiền', 'Thông báo email gửi 2 lần', 'Không hiển thị đúng quyền phòng ban', 'Lỗi font khi in PDF', 'Đăng nhập SSO bị lặp vòng'];
const CR_TITLES = ['Bổ sung báo cáo theo đơn vị cấp xã', 'Đổi luồng duyệt 2 cấp', 'Thêm xác thực OTP', 'Tích hợp thêm cổng thanh toán', 'Bổ sung API cho đối tác', 'Thay đổi mẫu biểu in'];

const DETAIL_CACHE = new Map<string, ProjectDetail>();

export const projectDetail = (p: PmoProject): ProjectDetail => {
  const hit = DETAIL_CACHE.get(p.id);
  if (hit) return hit;
  const id = p.id;
  const short = id.split('-')[0].slice(0, 2);
  const nRel = p.type === 'BT' ? 3 : 4;
  const p4Start = addDays(p.start, Math.round(((new Date(p.end).getTime() - new Date(p.start).getTime()) / 864e5) * 0.25));
  const relLen = Math.round(((new Date(p.end).getTime() - new Date(p4Start).getTime()) / 864e5) * 0.85 / nRel);

  const releases: Release[] = Array.from({ length: nRel }, (_, i) => {
    const start = addDays(p4Start, i * relLen);
    const end = addDays(start, relLen - 1);
    const status: Release['status'] = p.phase < 4 ? 'Kế hoạch' : end < TODAY ? 'Đã close' : start <= TODAY ? 'Đang chạy' : 'Kế hoạch';
    const spPlanned = Math.round(between(80, 140, id, 'rsp', i));
    const capacity = Math.round(spPlanned * between(0.88, 1.15, id, 'cap', i));
    return {
      code: `R${i + 1}`,
      start,
      end,
      goal: `${FEATURE_NAMES[(i * 2 + 1) % FEATURE_NAMES.length]}, ${FEATURE_NAMES[(i * 2 + 2) % FEATURE_NAMES.length]}`,
      status,
      spPlanned,
      spDone: status === 'Đã close' ? spPlanned : status === 'Đang chạy' ? Math.round(spPlanned * between(0.35, 0.7, id, 'rsd', i)) : 0,
      capacity,
      quality: {
        critHighOpen: status === 'Đã close' ? 0 : Math.round(between(0, p.health === 'red' ? 4 : 1.6, id, 'qch', i)),
        regression: Math.round(between(p.health === 'red' ? 88 : 94, 99, id, 'qrg', i)),
        automation: Math.round(between(p.health === 'red' ? 58 : 68, 82, id, 'qau', i)),
        dod: Math.round(p.kpis.dodRate),
        waiver: status === 'Đã close' && rand(id, 'wv', i) < 0.25 ? '1 bug High có workaround, khách chấp nhận' : undefined,
      },
    };
  });
  if (p.type !== 'BT')
    releases.push({ code: 'RBuf', start: addDays(releases[releases.length - 1].end, 1), end: addDays(releases[releases.length - 1].end, Math.round(relLen * 0.4)), goal: 'Release buffer (≥10% thời lượng P4)', status: 'Kế hoạch', spPlanned: 0, spDone: 0, capacity: 30, quality: { critHighOpen: 0, regression: 0, automation: 0, dod: 0 } });

  const nFeat = 5 + Math.floor(between(0, 3, id, 'nf'));
  const fdMin = (KHOI_CONFIG.find((c) => c.khoi === p.khoi)?.foundationMinPct ?? 15) / 100;
  const foundationPct = between(fdMin + 0.01, fdMin + 0.06, id, 'fdp');
  const featWeights = Array.from({ length: nFeat }, (_, i) => between(0.6, 1.4, id, 'fw', i));
  const wsum = featWeights.reduce((a, b) => a + b, 0);
  let wpSeq = 1;
  const features: Feature[] = [
    ...featWeights.map((w, i) => ({ name: FEATURE_NAMES[(i + p.name.length) % FEATURE_NAMES.length], foundation: false, value: p.contractValue * (1 - foundationPct) * (w / wsum), i })),
    ...FOUNDATION_NAMES.map((name, j) => ({ name, foundation: true, value: (p.contractValue * foundationPct) / 2, i: nFeat + j })),
  ].map(({ name, foundation, value, i }) => {
    const code = `F${String(i + 1).padStart(2, '0')}`;
    const relIdx = foundation ? 0 : Math.min(nRel - 1, Math.floor((i / nFeat) * nRel));
    const rel = releases[relIdx];
    const nWp = 3 + Math.floor(between(0, 4, id, 'nwp', i));
    const wps: Wp[] = Array.from({ length: nWp }, (_, j) => {
      const wrel = foundation ? releases[Math.min(nRel - 1, j)].code : rel.code;
      const wrelObj = releases.find((r) => r.code === wrel)!;
      const status: WpStatus =
        wrelObj.status === 'Đã close' ? 'Done' : wrelObj.status === 'Đang chạy' ? pick(['Done', 'Done', 'In Progress', 'Review', 'To Do', 'Blocked'] as const, id, 'ws', i, j) : 'To Do';
      return {
        code: `${short}-WP-${String(wpSeq++).padStart(3, '0')}`,
        name: `${WP_NAMES[(i * 5 + j) % WP_NAMES.length]}${foundation ? '' : ` · ${name.split(' ')[0]}`}`,
        feature: code,
        type: foundation ? pick(['Architecture', 'NFR', 'Integration'] as const, id, 'wt', i, j) : pick(['CRUD', 'CRUD', 'API', 'Integration', 'Test'] as const, id, 'wt', i, j),
        sp: pick([2, 3, 5, 5, 8, 8, 13], id, 'wsp', i, j),
        release: wrel,
        owner: rand(id, 'nown', i, j) < 0.06 && p.phase <= 2 ? '' : pick(OWNERS, id, 'wo', i, j),
        status,
        dodPass: status === 'Done' && rand(id, 'dod', i, j) < p.kpis.dodRate / 100 + 0.05,
        jira: `${short}${p.code.slice(-3)}-${100 + wpSeq}`,
      };
    });
    const allDone = wps.every((w) => w.status === 'Done');
    const acceptance: Acceptance = foundation
      ? 'Đang làm'
      : allDone
        ? rand(id, 'acc', i) < 0.6
          ? 'Khách nghiệm thu'
          : rand(id, 'rej', i) < 0.15
            ? 'Khách reject'
            : 'Nghiệm thu nội bộ'
        : 'Đang làm';
    const doneRatio = wps.filter((w) => w.status === 'Done').length / wps.length;
    const ecv = foundation ? value * Math.min(0.7, doneRatio * 0.7) : acceptance === 'Khách nghiệm thu' ? value : acceptance === 'Nghiệm thu nội bộ' ? value * 0.7 : 0;
    const cost = value * (1 - p.presaleMargin / 100) * (doneRatio * between(0.85, 1.25, id, 'fc', i) + (acceptance === 'Đang làm' ? 0.15 : 0));
    return { code, name, foundation, allocValue: value, release: rel.code, acceptance, ecv, cost, wps };
  });
  // Khớp tổng ECV feature với ECV dự án (Cockpit/Portfolio dùng cùng một con số)
  const fsum = features.reduce((s, f) => s + f.ecv, 0);
  if (fsum > 0) features.forEach((f) => (f.ecv *= p.ecv / fsum));
  else {
    const fd = features.filter((f) => f.foundation);
    fd.forEach((f) => (f.ecv = p.ecv / fd.length));
  }
  const wps = features.flatMap((f) => f.wps);

  const phaseItems = PHASE_CHECKLIST[p.phase] || [];
  const doneN = Math.round((p.checklistPct / 100) * phaseItems.length);
  const checklist: ChecklistItem[] = phaseItems.map((it, i) => {
    const done = i < doneN;
    return { ...it, done, evidence: done ? `https://sharepoint/${id}/${it.code}.pdf` : '', doneBy: done ? p.pm : undefined, doneAt: done ? addDays(TODAY, -Math.round(between(1, 25, id, 'ck', i))) : undefined };
  });

  const nBug = p.phase >= 4 ? 8 + Math.floor(between(0, 10, id, 'nb')) : 0;
  const bugs: Bug[] = Array.from({ length: nBug }, (_, i) => {
    const w = pick(wps, id, 'bw', i);
    const sev = pick(p.health === 'red' ? (['Critical', 'High', 'High', 'Medium', 'Low'] as const) : (['High', 'Medium', 'Medium', 'Low', 'Low'] as const), id, 'bs', i);
    const missing = rand(id, 'bm', i) < 0.12;
    return {
      key: `${short}${p.code.slice(-3)}-B${300 + i}`,
      title: pick(BUG_TITLES, id, 'bt', i),
      severity: sev,
      phaseFound: missing ? '' : pick(['Sprint', 'Sprint', 'SIT', 'UAT'] as const, id, 'bp', i),
      release: missing && rand(id, 'bmr', i) < 0.5 ? '' : w.release,
      wp: w.code,
      origin: pick(['Code', 'Code', 'Requirement', 'Design', 'Môi trường'] as const, id, 'bo', i),
      owner: w.owner,
      ownerConfirmed: rand(id, 'boc', i) < 0.7,
      status: pick(['Open', 'In Progress', 'Retest', 'Closed', 'Closed', 'Closed', 'Rejected'] as const, id, 'bst', i),
      reopen: rand(id, 'br', i) < 0.2 ? 1 + Math.floor(between(0, 2, id, 'brn', i)) : 0,
      createdAt: addDays(TODAY, -Math.round(between(1, 60, id, 'bc', i))),
    };
  });

  const nCr = 2 + Math.floor(between(0, 4, id, 'ncr')) + p.kpis.crPending;
  const crs: ChangeRequest[] = Array.from({ length: nCr }, (_, i) => {
    const pending = i < p.kpis.crPending;
    const sp = Math.round(between(3, 30, id, 'csp', i));
    const outScope = rand(id, 'cos', i) < 0.55;
    return {
      code: `CR-${String(100 + i + p.code.length).padStart(3, '0')}`,
      title: pick(CR_TITLES, id, 'ct', i),
      source: rand(id, 'csrc', i) < 0.8 ? 'Khách' : 'Nội bộ',
      classification: outScope ? 'Out-of-scope' : 'In-scope',
      wps: [pick(wps, id, 'cw1', i).code, pick(wps, id, 'cw2', i).code],
      spDelta: sp,
      costDelta: sp * 8 * 260_000 * 1.2,
      daysDelta: Math.round(sp / 4),
      proposal: outScope ? 'Tính phí' : sp > 10 ? 'Tính phí' : 'Hấp thụ',
      step: pending ? pick(['Impact', 'Phê duyệt', 'Phê duyệt'] as const, id, 'cst', i) : pick(['Thực hiện', 'Đóng', 'Đóng'] as const, id, 'cst', i),
      createdAt: addDays(TODAY, pending ? -Math.round(between(2, 6, id, 'cca', i)) : -Math.round(between(10, 90, id, 'cca', i))),
      decidedAt: pending ? undefined : addDays(TODAY, -Math.round(between(5, 9, id, 'cda', i))),
    };
  });

  const ecvLedger: EcvEvent[] = features
    .flatMap((f) => {
      const ev: EcvEvent[] = [];
      const base = addDays(TODAY, -Math.round(between(5, 120, id, 'ecv', f.code)));
      const k = fsum > 0 ? p.ecv / fsum : 1;
      if (f.foundation && f.ecv > 0) ev.push({ at: base, feature: `${f.code} ${f.name}`, event: 'WP nền theo tỉ lệ', delta: f.ecv, by: 'QA Lead', evidence: 'DoD checklist' });
      if (!f.foundation && f.acceptance === 'Nghiệm thu nội bộ') ev.push({ at: base, feature: `${f.code} ${f.name}`, event: '+70% nội bộ pass', delta: f.ecv, by: 'QA Lead', evidence: 'DoD 100%, 0 bug C/H' });
      if (!f.foundation && f.acceptance === 'Khách nghiệm thu') {
        ev.push({ at: base, feature: `${f.code} ${f.name}`, event: '+70% nội bộ pass', delta: f.ecv * 0.7, by: 'QA Lead', evidence: 'DoD 100%, 0 bug C/H' });
        ev.push({ at: addDays(base, 9), feature: `${f.code} ${f.name}`, event: '+30% khách nghiệm thu', delta: f.ecv * 0.3, by: 'BA Lead', evidence: `BB-${f.code}.pdf` });
      }
      if (!f.foundation && f.acceptance === 'Khách reject') {
        ev.push({ at: base, feature: `${f.code} ${f.name}`, event: '+70% nội bộ pass', delta: f.allocValue * 0.7 * k, by: 'QA Lead', evidence: 'DoD 100%, 0 bug C/H' });
        ev.push({ at: addDays(base, 7), feature: `${f.code} ${f.name}`, event: '−70% khách reject', delta: -f.allocValue * 0.7 * k, by: 'BA Lead', evidence: 'Email khách + CR khắc phục' });
      }
      return ev;
    })
    .sort((a, b) => b.at.localeCompare(a.at));

  const ecvTotal = features.reduce((s, f) => s + f.ecv, 0);
  let cc = 0;
  let ec = 0;
  const weekly = PAST_WEEKS.map((w, i) => {
    const share = (i + 1) / PAST_WEEKS.length;
    const cost = (p.costUsed / PAST_WEEKS.length) * 0.55 * between(0.75, 1.25, id, 'wc', i);
    cc += cost;
    ec = Math.max(ec, ecvTotal * 0.45 + ecvTotal * 0.55 * Math.pow(share, 1.3) * between(0.9, 1.05, id, 'we', i));
    return { week: w, cost, costCum: p.costUsed * 0.45 + cc, ecvCum: Math.min(ec, ecvTotal), ecvPlanCum: p.ecvPlan * (0.5 + 0.5 * share) };
  });

  const gates: GateEvent[] = [];
  if (p.phase > 2) gates.push({ gate: 'Scope Freeze', submittedAt: addDays(p4Start, -20), decidedAt: addDays(p4Start, -18), decision: 'Pass', approvers: p.type === 'BT' ? 'GĐSX' : p.type === 'QT' ? 'GĐSX → GĐK' : 'GĐSX → GĐK → TCT', note: 'Khóa baseline v1' });
  releases
    .filter((r) => r.status === 'Đã close')
    .forEach((r) => gates.push({ gate: `Release Close ${r.code}`, submittedAt: addDays(r.end, -1), decidedAt: r.end, decision: 'Pass', approvers: 'GĐSX', note: r.quality.waiver ? `Waiver: ${r.quality.waiver}` : 'Quality Gate pass' }));
  if (rand(id, 'gr') < 0.4 && gates.length) gates.splice(1, 0, { gate: 'Release Close R1', submittedAt: addDays(releases[0].end, -3), decidedAt: addDays(releases[0].end, -2), decision: 'Từ chối', approvers: 'GĐSX', note: 'Còn 2 bug High mở, chưa có waiver' });

  const baselines: Baseline[] = p.phase > 2 ? [{ version: 1, at: addDays(p4Start, -18), reason: 'Scope Freeze pass', by: 'Hệ thống' }] : [];
  crs.filter((c) => c.step === 'Đóng' && c.proposal === 'Tính phí').forEach((c, i) => baselines.push({ version: i + 2, at: c.decidedAt || TODAY, reason: `${c.code} duyệt (+${c.spDelta} SP)`, by: p.pm }));

  const team = PEOPLE.filter((x) => (ALLOCATION[x.code]?.[THIS_WEEK] || []).some((c) => c.projectId === id)).map((person) => ({
    person,
    pct: (ALLOCATION[person.code][THIS_WEEK] || []).filter((c) => c.projectId === id).reduce((s, c) => s + c.pct, 0),
    role: person.job,
  }));

  const d: ProjectDetail = {
    features,
    wps,
    releases,
    checklist,
    bugs,
    crs,
    ecvLedger,
    weekly,
    gates,
    baselines,
    team,
    allocMethod: pick(['Tỉ lệ SP', 'Tỉ lệ SP', 'Giờ kế hoạch × rate', 'Nhập tay'] as const, id, 'am'),
  };
  DETAIL_CACHE.set(id, d);
  return d;
};

// ==========================================================================
// Cảnh báo (F6.4 · Phụ lục B)
// ==========================================================================
export interface AlertRule {
  code: string;
  condition: string;
  severity: 'Đỏ' | 'Vàng';
  recipients: string;
}
export const ALERT_RULES: AlertRule[] = [
  { code: 'AL-01', condition: 'Health đổi sang Đỏ', severity: 'Đỏ', recipients: 'PM, GĐSX, GĐK' },
  { code: 'AL-02', condition: 'Health đổi sang Vàng', severity: 'Vàng', recipients: 'PM, GĐSX' },
  { code: 'AL-03', condition: 'WP blocked > 1 ngày', severity: 'Vàng', recipients: 'PM' },
  { code: 'AL-04', condition: 'WP blocked > 2 ngày', severity: 'Đỏ', recipients: 'PM, GĐSX' },
  { code: 'AL-05', condition: 'CR chưa quyết định > 48h', severity: 'Vàng', recipients: 'PM' },
  { code: 'AL-06', condition: 'Gate còn 3 ngày, checklist < 80%', severity: 'Vàng', recipients: 'PM, GĐSX' },
  { code: 'AL-07', condition: 'Gate/CR/waiver chờ duyệt quá SLA', severity: 'Đỏ', recipients: 'Người duyệt + cấp trên' },
  { code: 'AL-08', condition: 'Bug Critical mở > 8h', severity: 'Đỏ', recipients: 'PM, QA Lead' },
  { code: 'AL-09', condition: 'Budget Burn Δ > 10%', severity: 'Đỏ', recipients: 'PM, GĐSX, GĐK' },
  { code: 'AL-10', condition: 'ECV chậm plan > 10% (tuần)', severity: 'Vàng', recipients: 'GĐSX, GĐK' },
  { code: 'AL-11', condition: 'Allocation > 100% hoặc bench > 2 tuần', severity: 'Vàng', recipients: 'GĐSX' },
  { code: 'AL-12', condition: 'Sync Jira/HR lỗi > 1 giờ', severity: 'Đỏ', recipients: 'Admin' },
];
export type AlertStatus = 'Mới' | 'Đang xử lý' | 'Đóng';
export interface Alert {
  id: string;
  rule: string;
  projectId: string;
  message: string;
  severity: 'Đỏ' | 'Vàng';
  openedAt: string; // YYYY-MM-DD HH:mm
  status: AlertStatus;
  handler: string;
  note: string;
}
export const ALERTS_SEED: Alert[] = (() => {
  const out: Alert[] = [];
  let n = 1;
  const add = (rule: string, p: PmoProject, message: string, daysAgo: number, status: AlertStatus = 'Mới') => {
    const r = ALERT_RULES.find((x) => x.code === rule)!;
    out.push({
      id: `A${String(n++).padStart(4, '0')}`,
      rule,
      projectId: p.id,
      message,
      severity: r.severity,
      openedAt: `${addDays(TODAY, -daysAgo)} ${String(8 + (n % 9)).padStart(2, '0')}:${String((n * 7) % 60).padStart(2, '0')}`,
      status,
      handler: status === 'Mới' ? '' : p.pm,
      note: status === 'Đang xử lý' ? 'Đã họp với khách, chờ phản hồi' : status === 'Đóng' ? 'Điều kiện hết — đóng tự động' : '',
    });
  };
  PMO_PROJECTS.forEach((p, i) => {
    if (p.health === 'red') add('AL-01', p, `Health đỏ do ${p.drivers.map((d) => d.label).join(', ')}`, 1 + (i % 3), i % 2 ? 'Đang xử lý' : 'Mới');
    if (p.health === 'yellow') add('AL-02', p, `Health vàng do ${p.drivers.map((d) => d.label).join(', ')}`, 2 + (i % 4));
    p.blocked.filter((b) => b.hours > 16).forEach((b) => add('AL-04', p, `${b.wp} ${b.name} blocked ${(b.hours / 8).toFixed(1)} ngày · ${b.reason}`, 0));
    p.blocked.filter((b) => b.hours > 8 && b.hours <= 16).forEach((b) => add('AL-03', p, `${b.wp} ${b.name} blocked ${(b.hours / 8).toFixed(1)} ngày`, 0, 'Đang xử lý'));
    if (p.kpis.crPending > 0) add('AL-05', p, `${p.kpis.crPending} CR chưa quyết định > 48h`, 1);
    if (p.kpis.budgetBurn > 10) add('AL-09', p, `Budget Burn Δ +${p.kpis.budgetBurn.toFixed(0)}%`, 3);
    if (p.ecv < p.ecvPlan * 0.9) add('AL-10', p, `ECV chậm plan ${(100 - (p.ecv / p.ecvPlan) * 100).toFixed(0)}%`, 4);
    if (p.checklistPct < 80 && i % 3 === 0) add('AL-06', p, `${p.nextGate} còn 3 ngày, checklist ${p.checklistPct}%`, 0);
    if (i % 5 === 1) add('AL-02', p, 'Health vàng do Carried Over %, DoD Rate', 18, 'Đóng');
  });
  add('AL-07', PMO_PROJECTS[8], 'CR-112 chờ GĐK duyệt quá SLA (4/2 ngày)', 0);
  add('AL-08', PMO_PROJECTS[2], 'Bug VI002-B305 Critical mở 11 giờ', 0);
  add('AL-11', PMO_PROJECTS[5], '2 người allocation > 100% tuần 12/10', 1);
  add('AL-12', PMO_PROJECTS[0], 'Sync HR lỗi 3 lần liên tiếp (timeout)', 0, 'Đang xử lý');
  return out;
})();

// ==========================================================================
// Báo cáo (F6.2)
// ==========================================================================
export type ReportType = 'Weekly Status' | 'Sprint Close' | 'Release Report';
export type ReportStatus = 'Nháp AI' | 'PM đã sửa' | 'Đã gửi' | 'Gửi muộn';
export interface Report {
  id: string;
  projectId: string;
  type: ReportType;
  period: string;
  status: ReportStatus;
  createdAt: string;
  sentAt?: string;
  sentTo: string[];
}
export const REPORTS_SEED: Report[] = PMO_PROJECTS.flatMap((p, i) => {
  const rows: Report[] = [];
  const to = [p.pm, `GĐSX ${p.khoi}`, ...(p.type !== 'BT' ? [`GĐK ${p.khoi}`] : []), ...(p.type === 'CL' ? ['PMO Director'] : [])];
  for (let w = 0; w < 4; w++) {
    const fri = addDays(THIS_WEEK, 4 - w * 7);
    const status: ReportStatus = w === 0 ? (i % 3 === 0 ? 'PM đã sửa' : 'Nháp AI') : rand(p.id, 'late', w) < 0.15 ? 'Gửi muộn' : 'Đã gửi';
    rows.push({ id: `RP-${p.code}-W${weekNo(fri)}`, projectId: p.id, type: 'Weekly Status', period: `Tuần ${weekNo(fri)} (${weekLabel(addDays(fri, -4))}–${weekLabel(fri)})`, status, createdAt: `${fri} 12:00`, sentAt: status === 'Đã gửi' ? `${fri} 16:${String(10 + w * 7).padStart(2, '0')}` : status === 'Gửi muộn' ? `${addDays(fri, 3)} 09:15` : undefined, sentTo: to });
  }
  if (p.phase >= 4) rows.push({ id: `RP-${p.code}-S${p.sprint.seq - 1}`, projectId: p.id, type: 'Sprint Close', period: `Sprint ${p.sprint.seq - 1}`, status: 'Đã gửi', createdAt: `${addDays(p.sprint.start, -1)} 17:00`, sentAt: `${p.sprint.start} 10:20`, sentTo: to });
  const d = projectDetail(p);
  d.releases.filter((r) => r.status === 'Đã close').forEach((r) => rows.push({ id: `RP-${p.code}-${r.code}`, projectId: p.id, type: 'Release Report', period: `Release ${r.code}`, status: 'Đã gửi', createdAt: `${r.end} 17:00`, sentAt: `${addDays(r.end, 1)} 11:00`, sentTo: to }));
  return rows;
});

// ==========================================================================
// Tích hợp (F12.2, F4.1)
// ==========================================================================
export interface Integration {
  key: 'Jira' | 'HR' | 'Finance/ERP' | 'SSO' | 'Email/Teams';
  direction: string;
  data: string;
  schedule: string;
  status: 'OK' | 'Cảnh báo' | 'Lỗi';
  lastRun: string;
  lastOk: string;
  failStreak: number;
  records24h: number;
  mode: string;
}
export const INTEGRATIONS: Integration[] = [
  { key: 'Jira', direction: '2 chiều', data: 'Epic/Story/Sprint/Fix Version · status · worklog · bug', schedule: 'Webhook + poll 15 phút', status: 'OK', lastRun: '09:42', lastOk: '09:42', failStreak: 0, records24h: 4826, mode: 'API (jira.vtx.vn)' },
  { key: 'HR', direction: 'HR → PMO', data: 'Nhân sự, level, khối gốc · rate card', schedule: 'Hằng tuần (nhân sự) · hằng quý (rate)', status: 'Lỗi', lastRun: '09:30', lastOk: '08/10 22:00', failStreak: 3, records24h: 0, mode: 'Import CSV (OQ-011 chưa có API)' },
  { key: 'Finance/ERP', direction: '2 chiều', data: 'Hợp đồng ký → tạo dự án · phụ lục CR · ECV tháng', schedule: 'Theo sự kiện + hằng tháng', status: 'OK', lastRun: '08:00', lastOk: '08:00', failStreak: 0, records24h: 12, mode: 'API ERP' },
  { key: 'SSO', direction: 'SSO → PMO', data: 'Đăng nhập · group → role', schedule: 'Thời gian thực', status: 'OK', lastRun: '09:44', lastOk: '09:44', failStreak: 0, records24h: 1290, mode: 'OIDC (Azure AD)' },
  { key: 'Email/Teams', direction: 'PMO → người dùng', data: 'Cảnh báo · digest 8:00 · báo cáo', schedule: 'Theo sự kiện + 8:00', status: 'Cảnh báo', lastRun: '09:40', lastOk: '09:40', failStreak: 0, records24h: 318, mode: 'SMTP + Teams webhook (2 email trả về)' },
];
export interface SyncLog {
  at: string;
  system: Integration['key'];
  entity: string;
  direction: '→' | '←';
  status: 'OK' | 'Lỗi' | 'Xung đột';
  detail: string;
}
export const SYNC_LOGS: SyncLog[] = [
  { at: '09:42', system: 'Jira', entity: 'BF014-118 status', direction: '←', status: 'OK', detail: 'In Progress → Review' },
  { at: '09:41', system: 'Jira', entity: 'VI002-B305', direction: '←', status: 'OK', detail: 'Bug mới · Critical · Linked WP VI-WP-017' },
  { at: '09:38', system: 'Jira', entity: 'G1003-109 SP', direction: '←', status: 'Xung đột', detail: 'SP sửa ở cả PMO (5) và Jira (8) trong 15 phút → giữ bản PMO (trường kế hoạch)' },
  { at: '09:30', system: 'HR', entity: 'nhan_su_w41.csv', direction: '←', status: 'Lỗi', detail: 'Timeout SFTP lần 3 — đã cảnh báo Admin (AL-12)' },
  { at: '09:15', system: 'Jira', entity: 'YT003-121 assignee', direction: '←', status: 'Xung đột', detail: 'Assignee sửa ở cả hai bên → giữ bản Jira (trường thực thi)' },
  { at: '09:00', system: 'HR', entity: 'nhan_su_w41.csv', direction: '←', status: 'Lỗi', detail: 'Timeout SFTP lần 2' },
  { at: '08:30', system: 'HR', entity: 'nhan_su_w41.csv', direction: '←', status: 'Lỗi', detail: 'Timeout SFTP lần 1' },
  { at: '08:00', system: 'Finance/ERP', entity: 'HĐ 038.412', direction: '←', status: 'OK', detail: 'Hợp đồng mới → tạo dự án GPDV-2026-012' },
  { at: '08:00', system: 'Email/Teams', entity: 'Digest 8:00', direction: '→', status: 'OK', detail: '86 người nhận, 2 email trả về' },
  { at: '07:45', system: 'Jira', entity: 'Sprint 9 (BF014)', direction: '→', status: 'OK', detail: 'Tạo sprint từ Release Plan' },
];

// ==========================================================================
// Người dùng & role (F12.1)
// ==========================================================================
export type SysRole = 'PM' | 'GĐSX' | 'GĐK' | 'TCT' | 'Finance' | 'QA Lead' | 'BA Lead' | 'Tech Lead' | 'Member' | 'Admin';
export const SYS_ROLES: SysRole[] = ['PM', 'GĐSX', 'GĐK', 'TCT', 'Finance', 'QA Lead', 'BA Lead', 'Tech Lead', 'Member', 'Admin'];
export interface UserRole {
  id: string;
  user: string;
  email: string;
  role: SysRole;
  khoi: string; // '' = mọi khối
  projectId: string; // '' = mọi dự án trong phạm vi
  source: 'SSO group' | 'Thủ công';
  group: string;
}
const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .split(' ')
    .reverse()
    .map((w, i) => (i === 0 ? w : w[0]))
    .join('');
export const USER_ROLES: UserRole[] = (() => {
  const rows: UserRole[] = [];
  let n = 1;
  const add = (user: string, role: SysRole, khoi: string, projectId: string, source: UserRole['source'] = 'SSO group') =>
    rows.push({ id: `UR${n++}`, user, email: `${slug(user)}@vtx.vn`, role, khoi, projectId, source, group: source === 'SSO group' ? `PMO_${role.replace(/\s|Đ/g, (c) => (c === 'Đ' ? 'D' : '_')).toUpperCase()}${khoi ? `_${khoi}` : ''}` : '—' });
  PMO_PROJECTS.forEach((p) => add(p.pm, 'PM', p.khoi, p.id));
  const gdsx = ['Trịnh Văn Long', 'Phan Thị Hạnh', 'Đỗ Minh Quân', 'Lưu Thanh Bình', 'Kiều Văn Hòa', 'Tạ Thị Nga', 'Hồ Quốc Việt'];
  const gdk = ['Nguyễn Hữu Phúc', 'Trần Quang Khải', 'Lê Thị Thu', 'Phạm Đức Anh', 'Võ Minh Tâm', 'Đặng Thị Hương', 'Bùi Văn Lộc'];
  KHOI.forEach((k, i) => {
    add(gdsx[i], 'GĐSX', k, '');
    add(gdk[i], 'GĐK', k, '');
  });
  add('Nguyễn Văn Hùng', 'GĐSX', 'G2', '', 'Thủ công'); // ví dụ: PM ở G1 đồng thời GĐSX ở G2
  add('Vũ Hoàng Sơn', 'TCT', '', '');
  add('Mạc Thị Thanh', 'TCT', '', '');
  add('Lâm Thu Hà', 'Finance', '', '');
  add('Quách Văn Đạt', 'Finance', '', '');
  add('Ninh Thị Mai', 'QA Lead', 'BFSI', '');
  add('Tôn Thất Bảo', 'BA Lead', 'YT', '');
  add('Đoàn Minh Trí', 'Tech Lead', 'G3', 'G3-2026-001', 'Thủ công');
  add('admin', 'Admin', '', '', 'Thủ công');
  return rows;
})();

// ==========================================================================
// Audit log (F12.3)
// ==========================================================================
export interface AuditEntry {
  id: string;
  at: string; // YYYY-MM-DD HH:mm
  actor: string;
  entity: 'Hợp đồng' | 'Phân bổ giá trị' | 'Nghiệm thu/ECV' | 'Gate' | 'CR' | 'Rate card' | 'Allocation' | 'Điều chuyển' | 'Timesheet' | 'Cấu hình';
  entityId: string;
  action: string;
  before: string;
  after: string;
  ip: string;
}
export const AUDIT_LOG: AuditEntry[] = (() => {
  const rows: AuditEntry[] = [];
  let n = 1;
  const ip = (k: string) => `10.20.${Math.floor(between(1, 30, k, 'a'))}.${Math.floor(between(2, 250, k, 'b'))}`;
  const add = (daysAgo: number, hh: string, actor: string, entity: AuditEntry['entity'], entityId: string, action: string, before: string, after: string) =>
    rows.push({ id: `AU${String(n++).padStart(5, '0')}`, at: `${addDays(TODAY, -daysAgo)} ${hh}`, actor, entity, entityId, action, before, after, ip: ip(`${n}`) });
  PMO_PROJECTS.forEach((p, i) => {
    const d = projectDetail(p);
    d.gates.forEach((g) => add(Math.max(0, Math.round((new Date(TODAY).getTime() - new Date(g.decidedAt).getTime()) / 864e5)), '15:20', `GĐSX ${p.khoi}`, 'Gate', `${p.code} · ${g.gate}`, g.decision === 'Pass' ? 'Duyệt gate' : 'Từ chối gate', 'Chờ duyệt', g.decision));
    d.ecvLedger.slice(0, 3).forEach((e) => add(Math.max(0, Math.round((new Date(TODAY).getTime() - new Date(e.at).getTime()) / 864e5)), '10:05', e.by, 'Nghiệm thu/ECV', `${p.code} · ${e.feature}`, e.event, '—', `${e.delta > 0 ? '+' : ''}${Math.round(e.delta / 1e6).toLocaleString('vi-VN')} triệu`));
    if (i % 4 === 0) add(2 + i, '09:12', p.pm, 'Timesheet', `${p.code} · tuần ${weekNo(addDays(THIS_WEEK, -7))}`, 'Mở lại timesheet đã khóa', 'Khóa', 'Mở (PM duyệt)');
    if (i % 5 === 2) add(6 + i, '14:40', `GĐSX ${p.khoi}`, 'Hợp đồng', p.code, 'Đổi PM', 'Phạm Văn Đông', p.pm);
  });
  add(1, '16:30', 'Lâm Thu Hà', 'Rate card', 'BFSI · Senior', 'Cập nhật rate quý 4', '391.000 ₫/h', '408.000 ₫/h');
  add(3, '11:00', 'Nguyễn Hữu Phúc', 'Cấu hình', 'G1 · ngưỡng KPI #6', 'Sửa ngưỡng', 'Vàng 5% · Đỏ 10%', 'Vàng 5% · Đỏ 8%');
  add(4, '10:20', 'Lê Thị Thu', 'Phân bổ giá trị', 'G3-2026-004', 'Duyệt bảng phân bổ', 'Chờ duyệt', 'Đã duyệt (WP nền 18%)');
  add(5, '17:05', 'Đặng Thị Hương', 'Điều chuyển', 'TR-011', 'Duyệt điều chuyển', 'Chờ GĐK nhận', 'Đã duyệt');
  add(5, '17:06', 'Hệ thống', 'Allocation', 'NV1043 · W42–W51', 'Cập nhật theo điều chuyển TR-011', 'G3-2026-004 100%', 'YT-2026-003 50% · G3-2026-004 50%');
  add(8, '09:00', 'Bùi Thanh Hà', 'CR', 'BFSI-2026-014 · CR-104', 'Quyết định CR', 'Phê duyệt', 'Tính phí (+18 SP, phụ lục HĐ 02)');
  add(8, '09:01', 'Quách Văn Đạt', 'Hợp đồng', 'BFSI-2026-014', 'Cập nhật giá trị HĐ theo phụ lục', '37.380.000.000 ₫', '38.000.000.000 ₫');
  return rows.sort((a, b) => b.at.localeCompare(a.at));
})();

// ==========================================================================
// Timesheet theo WP (F4.4)
// ==========================================================================
export interface TsRow {
  id: string;
  projectId: string;
  wp: string;
  wpName: string;
  tag: 'Normal' | 'Rework';
  hours: number[]; // T2..T6
  note: string;
}
/** Timesheet tuần của 1 người (mẫu): log vào WP của các dự án được allocate. */
export const timesheetOf = (code: string, week: string): TsRow[] => {
  const cells = ALLOCATION[code]?.[week] || ALLOCATION[code]?.[THIS_WEEK] || [];
  return cells.flatMap((c, ci) => {
    const p = PMO_PROJECTS.find((x) => x.id === c.projectId);
    if (!p) return [];
    const d = projectDetail(p);
    const open = d.wps.filter((w) => w.status !== 'To Do');
    const pool = open.length ? open : d.wps;
    const nRow = c.pct >= 60 ? 2 : 1;
    return Array.from({ length: nRow }, (_, j) => {
      const w = pick(pool, code, week, ci, j);
      const daily = ((8 * c.pct) / 100) / nRow;
      const isPast = week < THIS_WEEK;
      return {
        id: `${code}-${week}-${ci}-${j}`,
        projectId: p.id,
        wp: w.code,
        wpName: w.name,
        tag: w.status === 'Done' ? 'Rework' : 'Normal',
        hours: Array.from({ length: 5 }, (_, k) => (isPast || k < 4 ? Math.round(daily * between(0.75, 1.15, code, week, ci, j, k) * 4) / 4 : 0)),
        note: '',
      } as TsRow;
    });
  });
};
/** Timesheet bị khóa sau thứ Ba tuần kế tiếp. */
export const isLocked = (week: string) => addDays(week, 8) < TODAY;

// ==========================================================================
// Yêu cầu nguồn lực (F8.1) & điều chuyển liên khối (F8.2)
// ==========================================================================
export interface ResourceRequest {
  id: string;
  projectId: string;
  level: Level;
  skill: string;
  pct: number;
  from: string;
  to: string;
  status: 'Chờ GĐSX' | 'Đã gán' | 'Từ chối';
  assigned?: string;
  createdBy: string;
  createdAt: string;
}
export const RESOURCE_REQUESTS: ResourceRequest[] = [
  { id: 'RQ-041', projectId: 'BFSI-2026-017', level: 'Senior', skill: '.NET', pct: 100, from: '2026-11-03', to: '2026-12-31', status: 'Chờ GĐSX', createdBy: 'Lý Hoàng Nam', createdAt: '2026-10-08' },
  { id: 'RQ-040', projectId: 'G2-2026-002', level: 'Middle', skill: 'Automation (Selenium)', pct: 50, from: '2026-10-19', to: '2026-12-15', status: 'Chờ GĐSX', createdBy: 'Lê Quang Dũng', createdAt: '2026-10-07' },
  { id: 'RQ-038', projectId: 'YT-2026-003', level: 'Senior', skill: 'BA y tế', pct: 50, from: '2026-10-15', to: '2027-01-15', status: 'Đã gán', assigned: 'NV1043', createdBy: 'Nguyễn Thị Hồng', createdAt: '2026-09-30' },
  { id: 'RQ-036', projectId: 'G1-2026-003', level: 'Junior', skill: 'ReactJS', pct: 100, from: '2026-10-05', to: '2026-12-31', status: 'Đã gán', assigned: 'NV1002', createdBy: 'Nguyễn Văn Hùng', createdAt: '2026-09-25' },
  { id: 'RQ-033', projectId: 'GPDV-2026-011', level: 'Lead', skill: 'Solution Architect', pct: 30, from: '2026-09-15', to: '2026-10-31', status: 'Từ chối', createdBy: 'Cao Thị Yến', createdAt: '2026-09-10' },
];
export interface Transfer {
  id: string;
  person: string; // mã NV
  fromKhoi: Khoi;
  toProject: string;
  pct: number;
  from: string;
  to: string;
  reason: string;
  status: 'Chờ GĐK cho' | 'Chờ GĐK nhận' | 'Đã duyệt' | 'Từ chối' | 'Đã trả người';
  createdAt: string;
  steps: { step: string; by: string; decision: string; at: string }[];
}
export const TRANSFERS: Transfer[] = [
  { id: 'TR-013', person: 'NV1043', fromKhoi: 'G3', toProject: 'YT-2026-003', pct: 50, from: '2026-10-15', to: '2027-01-15', reason: 'EMR thiếu BA có kinh nghiệm HIS', status: 'Chờ GĐK cho', createdAt: '2026-10-03', steps: [] },
  { id: 'TR-012', person: 'NV1084', fromKhoi: 'BFSI', toProject: 'G2-2026-002', pct: 100, from: '2026-10-12', to: '2026-12-15', reason: 'ERP thiếu Senior .NET cho R3', status: 'Chờ GĐK nhận', createdAt: '2026-10-01', steps: [{ step: 'GĐK khối cho (BFSI)', by: 'Phạm Đức Anh', decision: 'Đồng ý', at: '2026-10-02' }] },
  { id: 'TR-011', person: 'NV1062', fromKhoi: 'G4', toProject: 'YT-2026-005', pct: 50, from: '2026-09-21', to: '2026-12-31', reason: 'LIS cần QA automation', status: 'Đã duyệt', createdAt: '2026-09-14', steps: [{ step: 'GĐK khối cho (G4)', by: 'Võ Minh Tâm', decision: 'Đồng ý', at: '2026-09-15' }, { step: 'GĐK khối nhận (YT)', by: 'Đặng Thị Hương', decision: 'Đồng ý', at: '2026-09-17' }] },
  { id: 'TR-009', person: 'NV1101', fromKhoi: 'GPDV', toProject: 'BFSI-2026-014', pct: 100, from: '2026-07-01', to: '2026-09-30', reason: 'Hỗ trợ SIT Core Banking', status: 'Đã trả người', createdAt: '2026-06-20', steps: [{ step: 'GĐK khối cho (GPDV)', by: 'Bùi Văn Lộc', decision: 'Đồng ý', at: '2026-06-21' }, { step: 'GĐK khối nhận (BFSI)', by: 'Phạm Đức Anh', decision: 'Đồng ý', at: '2026-06-23' }] },
  { id: 'TR-008', person: 'NV1021', fromKhoi: 'G2', toProject: 'G1-2026-003', pct: 50, from: '2026-08-01', to: '2026-10-31', reason: 'Cổng DVC cần Java Lead', status: 'Từ chối', createdAt: '2026-07-25', steps: [{ step: 'GĐK khối cho (G2)', by: 'Trần Quang Khải', decision: 'Từ chối — ERP đang thiếu người', at: '2026-07-27' }] },
];

/** Capacity SP / người-ngày theo level (cấu hình). */
export const SP_PER_DAY: Record<Level, number> = { Fresher: 0.4, Junior: 0.6, Middle: 0.9, Senior: 1.1, Lead: 0.8 };
/** Ngày nghỉ lễ ảnh hưởng capacity (holiday chung). */
export const HOLIDAYS = ['2027-01-01'];
export const phaseName = (n: number) => PHASES[n - 1]?.name || '';
