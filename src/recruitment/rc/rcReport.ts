/**
 * Báo cáo theo khối (/recruitment/report) — luật thuần, bám RecruitmentReportPeriod / Scope / StatusGroups /
 * Progress / Funnel / Calculator.cs. Ngày dạng 'YYYY-MM-DD' nên so sánh chuỗi là so sánh ngày.
 */
import { RcRequest, RcApplication, MailLog, Stage, HIRED_STAGES, WISHLIST_STAGES, RequestStatus, diffDays } from './rcData';

// ==========================================================================
// Kỳ (QĐ 22) — tuần 1..6 trong tháng, bắt đầu thứ Hai
// ==========================================================================
export type PeriodType = 'Năm' | 'Tháng' | 'Quý' | 'Nửa năm' | 'Tuần' | 'Tuỳ chọn';
export const PERIOD_TYPES: PeriodType[] = ['Năm', 'Tháng', 'Quý', 'Nửa năm', 'Tuần', 'Tuỳ chọn'];

const pad = (n: number) => String(n).padStart(2, '0');
export const iso = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
const daysIn = (y: number, m: number) => new Date(y, m, 0).getDate();
const mondayOffset = (y: number, m: number) => (new Date(y, m - 1, 1).getDay() + 6) % 7;

export const weekOfMonth = (dateIso: string) => {
  const y = +dateIso.slice(0, 4), m = +dateIso.slice(5, 7), d = +dateIso.slice(8, 10);
  return Math.floor((d - 1 + mondayOffset(y, m)) / 7) + 1;
};
export const weeksInMonth = (y: number, m: number) => weekOfMonth(iso(y, m, daysIn(y, m)));
export const weekRange = (y: number, m: number, w: number) => {
  const off = mondayOffset(y, m);
  const week = Math.min(Math.max(w, 1), weeksInMonth(y, m));
  return { from: iso(y, m, Math.max(1, 7 * (week - 1) - off + 1)), to: iso(y, m, Math.min(daysIn(y, m), 7 * week - off)) };
};

export interface ReportFilter {
  periodType: PeriodType;
  year: number;
  month: number;
  quarter: number;
  half: number;
  week: number;
  from: string;
  to: string;
  scope: Scope;
  skill: string;
  level: string;
  staffing: '' | 'Nội Bộ' | 'Staffing';
  block: string;
  statusGroups: StatusGroup[];
  code: string;
}

export const resolvePeriod = (f: ReportFilter): { from: string; to: string; days: number } => {
  const { year: y } = f;
  let from: string, to: string;
  switch (f.periodType) {
    case 'Tháng': from = iso(y, f.month, 1); to = iso(y, f.month, daysIn(y, f.month)); break;
    case 'Quý': { const m = (f.quarter - 1) * 3 + 1; from = iso(y, m, 1); to = iso(y, m + 2, daysIn(y, m + 2)); break; }
    case 'Nửa năm': { const m = f.half === 1 ? 1 : 7; from = iso(y, m, 1); to = iso(y, m + 5, daysIn(y, m + 5)); break; }
    case 'Tuần': ({ from, to } = weekRange(y, f.month, f.week)); break;
    case 'Tuỳ chọn': from = f.from || iso(y, 1, 1); to = f.to || iso(y, 12, 31); if (from > to) [from, to] = [to, from]; break;
    default: from = iso(y, 1, 1); to = iso(y, 12, 31);
  }
  return { from, to, days: diffDays(from, to) + 1 };
};

// ==========================================================================
// Nhóm trạng thái (QĐ 1, 2) + Phạm vi kỳ (QĐ 4)
// ==========================================================================
export type StatusGroup = 'Chờ phê duyệt' | 'Đang tuyển' | 'Hoàn thành' | 'Chờ nhận việc' | 'Tạm dừng' | 'Hủy';
export const STATUS_GROUPS: StatusGroup[] = ['Chờ phê duyệt', 'Đang tuyển', 'Hoàn thành', 'Chờ nhận việc', 'Tạm dừng', 'Hủy'];
// Tên nhóm trùng tên trạng thái request
export const groupOf = (s: RequestStatus | ''): StatusGroup | null => (s ? (s as StatusGroup) : null);
export const isClosed = (s: RequestStatus | '') => s === 'Hoàn thành' || s === 'Tạm dừng' || s === 'Hủy';
/** KPI / Tiến độ: Đang tuyển + Chờ nhận việc (rộng hơn nhóm lọc "Đang tuyển"). */
export const isRecruiting = (s: RequestStatus | '') => s === 'Đang tuyển' || s === 'Chờ nhận việc';

export type Scope = 'Request hoạt động trong kỳ' | 'Request nhận trong kỳ' | 'Request đóng trong kỳ' | 'Tất cả (bỏ qua kỳ)';
export const SCOPES: Scope[] = ['Request hoạt động trong kỳ', 'Request nhận trong kỳ', 'Request đóng trong kỳ', 'Tất cả (bỏ qua kỳ)'];

export const inScope = (scope: Scope, r: RcRequest, from: string, to: string) => {
  if (scope === 'Tất cả (bỏ qua kỳ)') return true;
  if (!r.dateReceived) return false;
  const rec = r.dateReceived, end = r.endDate || '';
  if (scope === 'Request nhận trong kỳ') return rec >= from && rec <= to;
  if (scope === 'Request đóng trong kỳ') return !!end && end >= from && end <= to;
  if (rec > to) return false;
  if (!isClosed(r.status)) return true;
  return end ? end >= from : rec >= from;
};

// ==========================================================================
// Số ngày chạy job (QĐ 7) + Tiến độ (QĐ 8)
// ==========================================================================
export const daysRunningOf = (r: RcRequest, today: string): number | null => {
  if (!r.dateReceived) return null;
  if (r.endDate) return diffDays(r.dateReceived, r.endDate);
  if (isClosed(r.status)) return null;
  return diffDays(r.dateReceived, today);
};

export type Progress =
  | 'Đóng – đúng hạn' | 'Đóng – trễ hạn' | 'Đóng – đã tuyển đủ' | 'Đóng – hủy/tạm dừng'
  | 'Chưa có deadline' | 'Overdue' | 'Near Deadline' | 'Đúng tiến độ' | 'Chờ phê duyệt' | '';

export const progressOf = (r: RcRequest, today: string): Progress => {
  if (r.status === 'Hoàn thành') {
    if (!r.deadline || !r.endDate) return 'Đóng – đã tuyển đủ';
    return r.endDate <= r.deadline ? 'Đóng – đúng hạn' : 'Đóng – trễ hạn';
  }
  if (r.status === 'Hủy' || r.status === 'Tạm dừng') return 'Đóng – hủy/tạm dừng';
  if (!isRecruiting(r.status)) return (r.status || '') as Progress;
  if (!r.deadline) return 'Chưa có deadline';
  if (today > r.deadline) return 'Overdue';
  if (r.dateReceived) {
    // elapsed ≥ 2/3 × total, nhân chéo số nguyên
    if (diffDays(r.dateReceived, today) * 3 >= diffDays(r.dateReceived, r.deadline) * 2) return 'Near Deadline';
  }
  return 'Đúng tiến độ';
};

export const PROGRESS_TONE: Record<string, 'green' | 'red' | 'amber' | 'blue' | 'gray'> = {
  'Đóng – đúng hạn': 'green', 'Đóng – trễ hạn': 'red', 'Đóng – đã tuyển đủ': 'green', 'Đóng – hủy/tạm dừng': 'gray',
  'Chưa có deadline': 'gray', Overdue: 'red', 'Near Deadline': 'amber', 'Đúng tiến độ': 'blue',
};

// ==========================================================================
// Phễu luỹ kế (suy từ Stage hiện tại của lượt + mail đã gửi)
// ==========================================================================
export const MILESTONES = ['CV Apply', 'Pass Screening', 'Pass HM', 'Pass Interview', 'Offer', 'Accepted', 'Onboard'] as const;
const STAGE_MILESTONE: Record<Stage, number> = {
  New: -1, 'Not Interested': -1,
  Applied: 0, 'TA Screen_Consider': 0, 'TA Screen_Rejected': 0, Pending: 0,
  'TA Screen_Passed': 1, 'HM Screen_Rejected': 1,
  'HM Screen_Passed': 2, 'Intv 1_Schedule': 2, 'Intv 1_Failed': 2, 'Intv 2_Failed': 2,
  'Intv 1_Passed': 3, 'Intv 2_Schedule': 3, 'Intv 2_Passed': 3, 'Intv Pass _ No Offer': 3,
  Offering: 4, 'Offer Rejected': 4,
  'Offer Accepted': 5, 'Cancelled Onboard': 5,
  Onboarded: 6,
};

/** Mốc cao nhất của lượt = max(mốc theo Stage, mốc theo mail đã gửi thành công). */
export const highestMilestone = (a: RcApplication, mails: MailLog[]) => {
  const ok = mails.filter((m) => m.applicationId === a.id && m.ok && !m.cancelled);
  const has = (...kinds: string[]) => ok.some((m) => kinds.includes(m.kind));
  const byMail = has('Gửi thông tin sang HCNS', 'Cập nhật thông tin onboard sang HCNS') ? 5
    : has('Offer Letter', 'Offer Letter (Staffing)') ? 4
    : has('Mời phỏng vấn - Vòng 2', 'Mời phỏng vấn - Vòng 2 (Staffing)') ? 3
    : has('Mời phỏng vấn - Vòng 1', 'Mời phỏng vấn - Vòng 1 (Staffing)') ? 2 : -1;
  return Math.max(STAGE_MILESTONE[a.stage] ?? -1, byMail);
};

// ==========================================================================
// Senior+ (RecruitmentRequestKpi.IsSeniorPlus)
// ==========================================================================
const strip = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase();
const hasWord = (text: string, words: string[]) => strip(text || '').split(/[^a-z0-9]+/).some((w) => words.includes(w));
export const isSeniorPlus = (level: string, skill: string) => hasWord(level, ['senior', 'lead', 'manager', 'director']) || hasWord(skill, ['pm']);

// ==========================================================================
// Tính báo cáo
// ==========================================================================
export interface ReportRow {
  requestId: string;
  block: string;
  code: string;
  position: string;
  skill: string;
  level: string;
  taPics: string;
  staffing: string;
  status: string;
  dateReceived: string;
  deadline: string;
  endDate: string;
  daysRunning: number | null;
  progress: Progress;
  headcount: number;
  filled: number;
  remaining: number;
  fillRate: number | null;
  candidates: number;
  wishlist: number;
  cv: number;
  passScr: number;
  passHm: number;
  passItv: number;
  offer: number;
  accepted: number;
  onboard: number;
  passScrRate: number | null;
  passItvRate: number | null;
  acceptRate: number | null;
  cvToOnboard: number | null;
  note: string;
}

export const percent = (n: number, d: number) => (d > 0 ? n / d : null);
const avg = (xs: (number | null)[]) => {
  const v = xs.filter((x): x is number => x != null);
  return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null;
};

export interface ReportResult {
  period: { from: string; to: string; days: number };
  rows: ReportRow[];
  total: ReportRow & { jobs: number; recruiting: number; overdue: number; near: number; avgDays: number | null };
  kpi: { onboardInPeriod: number; seniorInPeriod: number; avgTimeToFill: number | null; avgDaysRunning: number | null; daysJobs: number };
  months: { month: number; onboard: number; senior: number }[];
  warn: { missingDeadline: number; closedMissingEnd: number; onboardEstimated: number };
}

export const computeReport = (
  f: ReportFilter, requests: RcRequest[], apps: RcApplication[], mails: MailLog[], today: string, lockedBlock: string | null,
): ReportResult => {
  const period = resolvePeriod(f);
  const blockOk = (r: RcRequest) => (lockedBlock ? r.block === lockedBlock : !f.block || r.block === f.block);
  const attrOk = (r: RcRequest) =>
    blockOk(r) && (!f.skill || r.skill === f.skill) && (!f.level || r.level === f.level) &&
    (!f.staffing || (f.staffing === 'Staffing') === r.isStaffing);

  const jobs = requests.filter((r) =>
    attrOk(r) &&
    (f.statusGroups.length === 0 || (groupOf(r.status) != null && f.statusGroups.includes(groupOf(r.status)!))) &&
    inScope(f.scope, r, period.from, period.to) &&
    (!f.code.trim() || r.code.toLowerCase().includes(f.code.trim().toLowerCase())));

  const rows: ReportRow[] = jobs.map((r) => {
    const mine = apps.filter((a) => a.requestId === r.id);
    const need = Math.max(0, Number(r.headcount) || 0);
    const hired = mine.filter((a) => HIRED_STAGES.includes(a.stage)).length;
    const filled = Math.min(Math.max(hired, 0), need);
    const row: ReportRow = {
      requestId: r.id, block: r.block, code: r.code, position: r.position, skill: r.skill, level: r.level, taPics: r.taPics.join(', '),
      staffing: r.isStaffing ? 'Staffing' : 'Nội Bộ', status: r.status, dateReceived: r.dateReceived, deadline: r.deadline, endDate: r.endDate,
      daysRunning: daysRunningOf(r, today), progress: progressOf(r, today), headcount: need, filled, remaining: need - filled,
      fillRate: percent(filled, need), candidates: mine.length, wishlist: mine.filter((a) => WISHLIST_STAGES.includes(a.stage)).length,
      cv: 0, passScr: 0, passHm: 0, passItv: 0, offer: 0, accepted: 0, onboard: 0,
      passScrRate: null, passItvRate: null, acceptRate: null, cvToOnboard: null, note: r.note,
    };
    for (const a of mine) {
      const top = highestMilestone(a, mails);
      if (top >= 0) row.cv++;
      if (top >= 1) row.passScr++;
      if (top >= 2) row.passHm++;
      if (top >= 3) row.passItv++;
      if (top >= 4) row.offer++;
      if (top >= 5) row.accepted++;
      if (top >= 6) row.onboard++;
    }
    row.passScrRate = percent(row.passScr, row.cv);
    row.passItvRate = percent(row.passItv, row.passHm);
    row.acceptRate = percent(row.accepted, row.offer);
    row.cvToOnboard = percent(row.onboard, row.cv);
    return row;
  });

  // QĐ 5: Khối A→Z rồi Ngày nhận tăng dần (trống xếp cuối)
  rows.sort((a, b) =>
    (a.block ? 0 : 1) - (b.block ? 0 : 1) || a.block.localeCompare(b.block, 'vi') ||
    (a.dateReceived ? 0 : 1) - (b.dateReceived ? 0 : 1) || a.dateReceived.localeCompare(b.dateReceived) || a.code.localeCompare(b.code));

  const sum = (k: keyof ReportRow) => rows.reduce((s, r) => s + (r[k] as number), 0);
  const total = {
    ...({} as ReportRow),
    requestId: '', block: 'Tổng', code: '', position: '', skill: '', level: '', taPics: '', staffing: '', status: '', dateReceived: '', deadline: '', endDate: '',
    progress: '' as Progress, note: '',
    jobs: rows.length,
    recruiting: rows.filter((r) => isRecruiting(r.status as RequestStatus)).length,
    overdue: rows.filter((r) => r.progress === 'Overdue').length,
    near: rows.filter((r) => r.progress === 'Near Deadline').length,
    avgDays: avg(rows.map((r) => r.daysRunning)),
    daysRunning: avg(rows.map((r) => r.daysRunning)),
    headcount: sum('headcount'), filled: sum('filled'), remaining: sum('remaining'), candidates: sum('candidates'), wishlist: sum('wishlist'),
    cv: sum('cv'), passScr: sum('passScr'), passHm: sum('passHm'), passItv: sum('passItv'), offer: sum('offer'), accepted: sum('accepted'), onboard: sum('onboard'),
  } as ReportResult['total'];
  total.fillRate = percent(total.filled, total.headcount);
  total.passScrRate = percent(total.passScr, total.cv);
  total.passItvRate = percent(total.passItv, total.passHm);
  total.acceptRate = percent(total.accepted, total.offer);
  total.cvToOnboard = percent(total.onboard, total.cv);

  // Tập người onboard: chỉ lọc Khối / Skill / Level / Staffing — không áp Trạng thái, Phạm vi kỳ; bảng tháng không áp Từ–Đến
  const reqById = new Map(requests.filter(attrOk).map((r) => [r.id, r]));
  const months = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, onboard: 0, senior: 0 }));
  const kpi: ReportResult['kpi'] = {
    onboardInPeriod: 0, seniorInPeriod: 0,
    avgTimeToFill: avg(rows.filter((r) => r.status === 'Hoàn thành').map((r) => r.daysRunning)),
    avgDaysRunning: total.avgDays, daysJobs: rows.filter((r) => r.daysRunning != null).length,
  };
  let estimated = 0;
  for (const a of apps) {
    const r = reqById.get(a.requestId);
    if (a.stage !== 'Onboarded' || !r) continue;
    // Prototype không có ngày onboard thật → lấy ngày đổi Stage (ước lượng, như bước cuối của luật ForReport)
    const d = (a.stageChangedAt || a.appliedDate).slice(0, 10);
    estimated++;
    const senior = isSeniorPlus(r.level, r.skill);
    if (d >= period.from && d <= period.to) { kpi.onboardInPeriod++; if (senior) kpi.seniorInPeriod++; }
    if (+d.slice(0, 4) === f.year) { const m = months[+d.slice(5, 7) - 1]; m.onboard++; if (senior) m.senior++; }
  }

  return {
    period, rows, total, kpi, months,
    warn: {
      missingDeadline: rows.filter((r) => !r.deadline).length,
      closedMissingEnd: rows.filter((r) => isClosed(r.status as RequestStatus) && !r.endDate).length,
      onboardEstimated: estimated,
    },
  };
};

export const defaultFilter = (today: string): ReportFilter => {
  const y = +today.slice(0, 4), m = +today.slice(5, 7);
  return {
    periodType: 'Tháng', year: y, month: m, quarter: Math.floor((m - 1) / 3) + 1, half: m <= 6 ? 1 : 2, week: weekOfMonth(today),
    from: iso(y, m, 1), to: iso(y, m, daysIn(y, m)), scope: 'Request hoạt động trong kỳ',
    skill: '', level: '', staffing: '', block: '', statusGroups: ['Đang tuyển', 'Chờ nhận việc'], code: '',
  };
};
