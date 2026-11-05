/**
 * Ticket nội bộ — kho dữ liệu (prototype, lưu trong bộ nhớ trình duyệt).
 *  - Phòng ban nhận ticket, danh mục 2 cấp, SLA theo mức ưu tiên (giờ làm việc T2–T6, 8:00–12:00 · 13:00–17:00).
 *  - Vòng đời: Mới → Đã giao → Đang xử lý ⇄ Chờ người yêu cầu → Đã giải quyết → Đã đóng (người yêu cầu xác nhận
 *    hoặc tự đóng sau 3 ngày làm việc); mở lại trong 7 ngày; huỷ khi chưa xử lý.
 *  - Mail Outlook mô phỏng: mỗi sự kiện gửi mail (tiêu đề có mã ticket + nút "Mở ticket"); trả lời mail thành bình luận;
 *    mail gửi vào hộp thư phòng ban thành ticket mới.
 */
import { useSyncExternalStore } from 'react';
import { PROC_PEOPLE, emailOf } from '../process/processStore';

// ==========================================================================
// Kiểu dữ liệu
// ==========================================================================
export type TkStatus = 'new' | 'assigned' | 'in_progress' | 'waiting' | 'resolved' | 'closed' | 'cancelled';
export type TkPriority = 'low' | 'normal' | 'high' | 'urgent';
export type TkRule = 'manual' | 'round_robin' | 'least_load';
export interface TkDept {
  id: string;
  code: string;
  name: string;
  mailbox: string;
  leader: string;
  members: string[]; // nhóm xử lý (gồm cả trưởng nhóm)
  rule: TkRule;
  active: boolean;
}
export interface TkCategory {
  id: string;
  deptId: string;
  group: string; // danh mục cấp 1
  name: string; // danh mục cấp 2
  priority: TkPriority; // ưu tiên mặc định
  confidential: boolean;
  slaHours?: number; // SLA xử lý riêng (giờ làm việc) — bỏ trống = theo mức ưu tiên
  active: boolean;
}
export interface TkSla {
  priority: TkPriority;
  response: number; // giờ làm việc
  resolve: number;
}
export interface TkComment {
  id: string;
  at: number;
  by: string;
  html: string;
  internal: boolean;
  source: 'web' | 'mail';
}
export interface TkEvent {
  id: string;
  at: number;
  by: string;
  text: string;
}
export interface TkFile {
  name: string;
  size: number;
}
export interface Ticket {
  id: string;
  code: string;
  title: string;
  html: string;
  deptId: string;
  categoryId: string;
  priority: TkPriority;
  status: TkStatus;
  requester: string;
  assignee: string;
  watchers: string[];
  source: 'web' | 'mail';
  confidential: boolean;
  createdAt: number;
  wantedDate: string; // yyyy-mm-dd, người yêu cầu mong muốn
  dueResponse: number;
  dueResolve: number;
  firstResponseAt: number | null;
  resolvedAt: number | null;
  closedAt: number | null;
  waitingSince: number | null;
  resolution: string;
  rating: number | null;
  ratingNote: string;
  reopenCount: number;
  files: TkFile[];
  comments: TkComment[];
  events: TkEvent[];
}
export interface TkMail {
  id: string;
  ticketId: string | null;
  at: number;
  dir: 'out' | 'in';
  from: string; // tên người / hộp thư
  to: string[]; // tên người hoặc địa chỉ hộp thư
  subject: string;
  html: string;
  kind: string;
}

export const STATUS_LABEL: Record<TkStatus, string> = {
  new: 'Mới',
  assigned: 'Đã giao',
  in_progress: 'Đang xử lý',
  waiting: 'Chờ người yêu cầu',
  resolved: 'Đã giải quyết',
  closed: 'Đã đóng',
  cancelled: 'Đã huỷ',
};
export const STATUS_CLS: Record<TkStatus, string> = {
  new: 'bg-sky-50 text-sky-700 border-sky-200',
  assigned: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  waiting: 'bg-violet-50 text-violet-700 border-violet-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-300',
  cancelled: 'bg-slate-50 text-slate-400 border-slate-200',
};
export const STATUS_ORDER: TkStatus[] = ['new', 'assigned', 'in_progress', 'waiting', 'resolved', 'closed', 'cancelled'];
export const OPEN_STATUSES: TkStatus[] = ['new', 'assigned', 'in_progress', 'waiting'];
export const isOpen = (t: Ticket) => OPEN_STATUSES.includes(t.status);
export const isDone = (t: Ticket) => t.status === 'resolved' || t.status === 'closed' || t.status === 'cancelled';
export const PRIORITY_LABEL: Record<TkPriority, string> = { low: 'Thấp', normal: 'Trung bình', high: 'Cao', urgent: 'Khẩn cấp' };
export const PRIORITY_CLS: Record<TkPriority, string> = {
  low: 'bg-slate-50 text-slate-600 border-slate-200',
  normal: 'bg-sky-50 text-sky-700 border-sky-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  urgent: 'bg-rose-50 text-rose-700 border-rose-300',
};
export const PRIORITIES: TkPriority[] = ['urgent', 'high', 'normal', 'low'];
export const RULE_LABEL: Record<TkRule, string> = { manual: 'Trưởng nhóm giao tay', round_robin: 'Tự giao xoay vòng', least_load: 'Tự giao người ít việc nhất' };
export const SYSTEM = 'Hệ thống';
export const AUTO_CLOSE_DAYS = 3; // ngày làm việc
export const REOPEN_DAYS = 7; // ngày lịch

// ==========================================================================
// Giờ làm việc (T2–T6, 8:00–12:00 · 13:00–17:00) — dùng tính hạn SLA
// ==========================================================================
const SHIFTS: [number, number][] = [
  [8, 12],
  [13, 17],
];
const HOUR = 3600_000;
const dayStart = (ms: number) => {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
const isWorkDay = (ms: number) => {
  const w = new Date(ms).getDay();
  return w !== 0 && w !== 6;
};
/** Cộng số giờ làm việc vào một thời điểm. */
export const addWorkHours = (from: number, hours: number) => {
  let left = hours * HOUR;
  let t = from;
  for (let guard = 0; guard < 400; guard++) {
    const d0 = dayStart(t);
    if (isWorkDay(d0)) {
      for (const [a, b] of SHIFTS) {
        const s = d0 + a * HOUR;
        const e = d0 + b * HOUR;
        if (t >= e) continue;
        const start = Math.max(t, s);
        if (start + left <= e) return start + left;
        left -= e - start;
        t = e;
      }
    }
    t = d0 + 24 * HOUR + 1; // sang ngày sau (cộng 1ms tránh lệch giờ mùa hè)
    t = dayStart(t);
  }
  return t;
};
/** Số giờ làm việc giữa 2 thời điểm. */
export const workHoursBetween = (a: number, b: number) => {
  if (b <= a) return 0;
  let sum = 0;
  for (let d = dayStart(a); d <= b; d = dayStart(d + 25 * HOUR)) {
    if (!isWorkDay(d)) continue;
    for (const [x, y] of SHIFTS) {
      const s = Math.max(a, d + x * HOUR);
      const e = Math.min(b, d + y * HOUR);
      if (e > s) sum += e - s;
    }
  }
  return sum / HOUR;
};

// ==========================================================================
// Kho dữ liệu
// ==========================================================================
interface State {
  depts: TkDept[];
  cats: TkCategory[];
  sla: TkSla[];
  tickets: Ticket[];
  mails: TkMail[];
  seq: number;
  rr: Record<string, number>; // vị trí xoay vòng của từng phòng
}
let CLOCK: number | null = null; // dựng dữ liệu mẫu theo thời điểm trong quá khứ
export const now = () => CLOCK ?? Date.now();
let uidN = 0;
const uid = (p: string) => `${p}${(++uidN).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

let S: State = {
  depts: [
    { id: 'd-it', code: 'IT', name: 'Phòng IT', mailbox: 'it@congty.vn', leader: 'Đỗ Văn Khánh', members: ['Đỗ Văn Khánh', 'Dương Minh Long', 'Phan Văn Nam'], rule: 'least_load', active: true },
    { id: 'd-hcns', code: 'HCNS', name: 'Phòng Hành chính – Nhân sự', mailbox: 'hcns@congty.vn', leader: 'Trần Thị Bình', members: ['Trần Thị Bình', 'Ngô Thị Lan'], rule: 'round_robin', active: true },
    { id: 'd-kt', code: 'KT', name: 'Phòng Kế toán', mailbox: 'ketoan@congty.vn', leader: 'Lê Hoàng Cường', members: ['Lê Hoàng Cường', 'Lý Thu Mai'], rule: 'manual', active: true },
    { id: 'd-hc', code: 'HC', name: 'Hành chính – Văn phòng', mailbox: 'hanhchinh@congty.vn', leader: 'Vũ Thị Giang', members: ['Vũ Thị Giang', 'Trịnh Thị Oanh'], rule: 'round_robin', active: true },
  ],
  cats: [
    { id: 'c-it-1', deptId: 'd-it', group: 'Thiết bị', name: 'Máy tính / laptop hỏng', priority: 'high', confidential: false, active: true },
    { id: 'c-it-2', deptId: 'd-it', group: 'Thiết bị', name: 'Cấp thiết bị mới', priority: 'normal', confidential: false, active: true },
    { id: 'c-it-3', deptId: 'd-it', group: 'Tài khoản & quyền', name: 'Cấp / thu hồi quyền phần mềm', priority: 'normal', confidential: false, active: true },
    { id: 'c-it-4', deptId: 'd-it', group: 'Tài khoản & quyền', name: 'Quên mật khẩu, khoá tài khoản', priority: 'high', confidential: false, slaHours: 2, active: true },
    { id: 'c-it-5', deptId: 'd-it', group: 'Mạng & phần mềm', name: 'Mạng, VPN, wifi', priority: 'high', confidential: false, active: true },
    { id: 'c-it-6', deptId: 'd-it', group: 'Mạng & phần mềm', name: 'Cài đặt phần mềm', priority: 'low', confidential: false, active: true },
    { id: 'c-hcns-1', deptId: 'd-hcns', group: 'Giấy tờ', name: 'Xin giấy xác nhận công tác', priority: 'normal', confidential: false, active: true },
    { id: 'c-hcns-2', deptId: 'd-hcns', group: 'Chế độ', name: 'Bảo hiểm xã hội / y tế', priority: 'normal', confidential: false, active: true },
    { id: 'c-hcns-3', deptId: 'd-hcns', group: 'Chế độ', name: 'Hợp đồng lao động', priority: 'normal', confidential: false, active: true },
    { id: 'c-hcns-4', deptId: 'd-hcns', group: 'Lương & khiếu nại', name: 'Thắc mắc lương', priority: 'high', confidential: true, active: true },
    { id: 'c-kt-1', deptId: 'd-kt', group: 'Chứng từ', name: 'Xuất / điều chỉnh hoá đơn', priority: 'normal', confidential: false, active: true },
    { id: 'c-kt-2', deptId: 'd-kt', group: 'Tạm ứng', name: 'Tạm ứng / hoàn ứng', priority: 'normal', confidential: false, active: true },
    { id: 'c-hc-1', deptId: 'd-hc', group: 'Văn phòng', name: 'Văn phòng phẩm', priority: 'low', confidential: false, active: true },
    { id: 'c-hc-2', deptId: 'd-hc', group: 'Văn phòng', name: 'Đặt phòng họp, xe', priority: 'normal', confidential: false, active: true },
    { id: 'c-hc-3', deptId: 'd-hc', group: 'Cơ sở vật chất', name: 'Sửa chữa điện, nước, điều hoà', priority: 'high', confidential: false, active: true },
  ],
  sla: [
    { priority: 'urgent', response: 1, resolve: 4 },
    { priority: 'high', response: 2, resolve: 8 },
    { priority: 'normal', response: 4, resolve: 16 },
    { priority: 'low', response: 8, resolve: 40 },
  ],
  tickets: [],
  mails: [],
  seq: 0,
  rr: {},
};
const SUBS = new Set<() => void>();
const emit = () => SUBS.forEach((f) => f());
const set = (fn: (s: State) => State) => {
  S = fn(S);
  emit();
};
export const getTk = () => S;
export const useTk = () => useSyncExternalStore((cb) => (SUBS.add(cb), () => void SUBS.delete(cb)), () => S);

// ── Người dùng (prototype: đổi tài khoản để thử các vai) ──
let USER = 'Phạm Thu Dung';
const USER_SUBS = new Set<() => void>();
export const TK_PEOPLE = PROC_PEOPLE;
export const getTkUser = () => USER;
export const setTkUser = (u: string) => {
  USER = u;
  USER_SUBS.forEach((f) => f());
};
export const useTkUser = () => useSyncExternalStore((cb) => (USER_SUBS.add(cb), () => void USER_SUBS.delete(cb)), () => USER);

// ── Ticket đang mở (link "Mở ticket" trong mail → nhảy thẳng tới chi tiết) ──
let OPEN: string | null = null;
const OPEN_SUBS = new Set<() => void>();
export const useOpenTicket = () => useSyncExternalStore((cb) => (OPEN_SUBS.add(cb), () => void OPEN_SUBS.delete(cb)), () => OPEN);
export const openTicket = (id: string | null, page?: string) => {
  OPEN = id;
  OPEN_SUBS.forEach((f) => f());
  if (page) window.dispatchEvent(new CustomEvent('imis:navigate', { detail: { item: page } }));
};

// ==========================================================================
// Tra cứu
// ==========================================================================
export const deptById = (id: string) => S.depts.find((d) => d.id === id);
export const catById = (id: string) => S.cats.find((c) => c.id === id);
export const catLabel = (id: string) => {
  const c = catById(id);
  return c ? `${c.group} › ${c.name}` : '—';
};
export const deptsOf = (user: string) => S.depts.filter((d) => d.members.includes(user));
export const isHandler = (t: Ticket, user: string) => !!deptById(t.deptId)?.members.includes(user);
export const isLeader = (deptId: string, user: string) => deptById(deptId)?.leader === user;
/** Được xem đầy đủ nội dung (ticket bảo mật: chỉ người yêu cầu + người được giao). */
export const canSeeContent = (t: Ticket, user: string) =>
  t.requester === user || t.assignee === user || t.watchers.includes(user) || (isHandler(t, user) && !t.confidential);
/** Được thấy ticket trong danh sách. */
export const canSeeTicket = (t: Ticket, user: string) => canSeeContent(t, user) || (t.confidential && isLeader(t.deptId, user));
export const slaOf = (p: TkPriority) => S.sla.find((x) => x.priority === p) || S.sla[2];
const dueFor = (start: number, catId: string, p: TkPriority) => {
  const sla = slaOf(p);
  const c = catById(catId);
  return { dueResponse: addWorkHours(start, sla.response), dueResolve: addWorkHours(start, c?.slaHours ?? sla.resolve) };
};
export const loadOf = (person: string) => S.tickets.filter((t) => t.assignee === person && isOpen(t)).length;

/** Trạng thái SLA để tô màu: đúng hạn / sắp hết hạn (còn < 20%) / quá hạn / tạm dừng. */
export type SlaState = 'ok' | 'soon' | 'overdue' | 'paused' | 'met' | 'breached' | 'none';
export const slaState = (t: Ticket, at = now()): SlaState => {
  if (t.status === 'cancelled') return 'none';
  if (t.resolvedAt && (t.status === 'resolved' || t.status === 'closed')) return t.resolvedAt <= t.dueResolve ? 'met' : 'breached';
  if (t.status === 'waiting') return 'paused';
  if (at > t.dueResolve) return 'overdue';
  const total = t.dueResolve - t.createdAt;
  return t.dueResolve - at < total * 0.2 ? 'soon' : 'ok';
};
export const responseLate = (t: Ticket, at = now()) => (t.firstResponseAt ? t.firstResponseAt > t.dueResponse : isOpen(t) && t.status !== 'waiting' && at > t.dueResponse);

// ==========================================================================
// Mail mô phỏng (Microsoft 365 / Outlook)
// ==========================================================================
export const subjectOf = (t: Ticket) => `[${t.code}] ${t.title}`;
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plain = (html: string) => {
  const d = typeof document !== 'undefined' ? document.createElement('div') : null;
  if (!d) return html.replace(/<[^>]+>/g, ' ');
  d.innerHTML = html;
  return (d.textContent || '').replace(/\s+/g, ' ').trim();
};
const mailOut = (t: Ticket, to: string[], kind: string, lead: string, extra = '') => {
  const list = [...new Set(to.filter((p) => p && p !== SYSTEM))];
  if (!list.length) return null;
  const dept = deptById(t.deptId);
  // ticket bảo mật: mail chỉ có tiêu đề + link, không kèm nội dung
  const body = t.confidential
    ? `<p>${esc(lead)}</p><p><i>Ticket bảo mật — mở ticket trên iMIS để xem nội dung.</i></p>`
    : `<p>${esc(lead)}</p>${extra}<table><tr><td>Phòng xử lý</td><td><b>${esc(dept?.name || '')}</b></td></tr><tr><td>Danh mục</td><td>${esc(catLabel(t.categoryId))}</td></tr><tr><td>Ưu tiên</td><td>${PRIORITY_LABEL[t.priority]}</td></tr><tr><td>Trạng thái</td><td>${STATUS_LABEL[t.status]}</td></tr><tr><td>Người yêu cầu</td><td>${esc(t.requester)}</td></tr><tr><td>Người xử lý</td><td>${esc(t.assignee || 'Chưa giao')}</td></tr></table>`;
  const m: TkMail = { id: uid('m'), ticketId: t.id, at: now(), dir: 'out', from: `iMIS Ticket <${dept?.mailbox || 'ticket@congty.vn'}>`, to: list, subject: subjectOf(t), html: body, kind };
  return m;
};
export const mailAddr = (who: string) => (who.includes('@') ? who : emailOf(who) ? `${who} <${emailOf(who)}>` : who);

// ==========================================================================
// Thao tác
// ==========================================================================
const ev = (by: string, text: string): TkEvent => ({ id: uid('e'), at: now(), by, text });
/** Ghi 1 ticket + các mail kèm theo. */
const commit = (t: Ticket, mails: (TkMail | null)[] = [], extra?: Partial<State>) =>
  set((s) => ({
    ...s,
    ...extra,
    tickets: s.tickets.some((x) => x.id === t.id) ? s.tickets.map((x) => (x.id === t.id ? t : x)) : [t, ...s.tickets],
    mails: [...(mails.filter(Boolean) as TkMail[]), ...s.mails],
  }));
const get = (id: string) => {
  const t = S.tickets.find((x) => x.id === id);
  if (!t) throw new Error('Không tìm thấy ticket');
  return structuredClone(t);
};
const handlersOf = (t: Ticket) => deptById(t.deptId)?.members || [];
const followers = (t: Ticket) => [t.requester, ...t.watchers];

/** Chọn người xử lý theo quy tắc của phòng. */
const autoPick = (deptId: string): { who: string; rr?: Record<string, number> } => {
  const d = deptById(deptId);
  if (!d || d.rule === 'manual' || !d.members.length) return { who: '' };
  if (d.rule === 'least_load') {
    const who = [...d.members].sort((a, b) => loadOf(a) - loadOf(b) || d.members.indexOf(a) - d.members.indexOf(b))[0];
    return { who };
  }
  const i = (S.rr[deptId] ?? -1) + 1;
  return { who: d.members[i % d.members.length], rr: { ...S.rr, [deptId]: i } };
};

export interface NewTicket {
  title: string;
  html: string;
  deptId: string;
  categoryId: string;
  priority: TkPriority;
  wantedDate: string;
  watchers: string[];
  files: TkFile[];
  requester: string;
  source?: 'web' | 'mail';
}
export const createTicket = (f: NewTicket) => {
  const at = now();
  const year = new Date(at).getFullYear();
  const seq = S.seq + 1;
  const cat = catById(f.categoryId);
  const t: Ticket = {
    id: uid('t'),
    code: `TK-${year}-${String(seq).padStart(5, '0')}`,
    title: f.title.trim(),
    html: f.html,
    deptId: f.deptId,
    categoryId: f.categoryId,
    priority: f.priority,
    status: 'new',
    requester: f.requester,
    assignee: '',
    watchers: f.watchers.filter((w) => w !== f.requester),
    source: f.source || 'web',
    confidential: !!cat?.confidential,
    createdAt: at,
    wantedDate: f.wantedDate,
    ...dueFor(at, f.categoryId, f.priority),
    firstResponseAt: null,
    resolvedAt: null,
    closedAt: null,
    waitingSince: null,
    resolution: '',
    rating: null,
    ratingNote: '',
    reopenCount: 0,
    files: f.files,
    comments: [],
    events: [],
  };
  if (t.confidential) t.watchers = [];
  t.events.push(ev(f.requester, f.source === 'mail' ? `Tạo ticket từ mail gửi tới ${deptById(f.deptId)?.mailbox}` : 'Tạo ticket'));
  const mails: (TkMail | null)[] = [mailOut(t, [t.requester], 'ack', `Đã tiếp nhận yêu cầu của bạn. Hạn xử lý dự kiến: ${fmtDT(t.dueResolve)}.`)];
  const pick = autoPick(t.deptId);
  if (pick.who) {
    t.assignee = pick.who;
    t.status = 'assigned';
    t.events.push(ev(SYSTEM, `Tự giao cho ${pick.who} (${RULE_LABEL[deptById(t.deptId)!.rule].toLowerCase()})`));
    mails.push(mailOut(t, [pick.who], 'assigned', `Bạn được giao xử lý ticket mới từ ${t.requester}.`, t.confidential ? '' : `<blockquote>${t.html}</blockquote>`));
  } else {
    mails.push(mailOut(t, handlersOf(t), 'new', `Phòng có ticket mới từ ${t.requester}, chưa giao người xử lý.`, t.confidential ? '' : `<blockquote>${t.html}</blockquote>`));
  }
  commit(t, mails, { seq, rr: pick.rr ?? S.rr });
  return t;
};

const touchResponse = (t: Ticket, by: string) => {
  if (!t.firstResponseAt && by !== t.requester && isHandler(t, by)) t.firstResponseAt = now();
};
/** Rời trạng thái "Chờ người yêu cầu" → cộng thời gian chờ vào hạn SLA. */
const resume = (t: Ticket) => {
  if (t.status !== 'waiting' || !t.waitingSince) return;
  const h = workHoursBetween(t.waitingSince, now());
  t.dueResolve = addWorkHours(t.dueResolve, h);
  if (!t.firstResponseAt) t.dueResponse = addWorkHours(t.dueResponse, h);
  t.waitingSince = null;
};

export const assignTicket = (id: string, who: string, by: string) => {
  const t = get(id);
  const old = t.assignee;
  t.assignee = who;
  if (t.status === 'new' || (t.status === 'assigned' && !who)) t.status = who ? 'assigned' : 'new';
  t.events.push(ev(by, who ? (old ? `Chuyển người xử lý: ${old} → ${who}` : `Giao cho ${who}`) : `Bỏ giao ${old}`));
  commit(t, [who && who !== by ? mailOut(t, [who], 'assigned', `${by} giao cho bạn xử lý ticket này.`) : null]);
};
export const takeTicket = (id: string, by: string) => {
  const t = get(id);
  const was = t.assignee;
  t.assignee = by;
  resume(t);
  t.status = 'in_progress';
  touchResponse(t, by);
  t.events.push(ev(by, was && was !== by ? `Nhận xử lý thay ${was}` : 'Nhận xử lý'));
  commit(t, [mailOut(t, followers(t), 'progress', `${by} đã nhận xử lý yêu cầu của bạn.`)]);
};
export const commentTicket = (id: string, by: string, html: string, internal: boolean, source: 'web' | 'mail' = 'web') => {
  const t = get(id);
  t.comments.push({ id: uid('c'), at: now(), by, html, internal, source });
  const mails: (TkMail | null)[] = [];
  if (!internal) {
    touchResponse(t, by);
    // người yêu cầu trả lời khi đang chờ → tiếp tục xử lý, SLA chạy lại
    if (t.status === 'waiting' && (by === t.requester || t.watchers.includes(by))) {
      resume(t);
      t.status = 'in_progress';
      t.events.push(ev(SYSTEM, 'Người yêu cầu đã phản hồi → tiếp tục xử lý'));
    }
    const to = [t.requester, t.assignee, ...t.watchers].filter((p) => p !== by);
    mails.push(mailOut(t, to.length ? to : handlersOf(t).filter((p) => p !== by), 'comment', `${by} vừa bình luận${source === 'mail' ? ' (trả lời qua mail)' : ''}:`, `<blockquote>${html}</blockquote>`));
  }
  commit(t, mails);
};
export const askRequester = (id: string, by: string, html: string) => {
  const t = get(id);
  t.comments.push({ id: uid('c'), at: now(), by, html, internal: false, source: 'web' });
  touchResponse(t, by);
  t.status = 'waiting';
  t.waitingSince = now();
  t.events.push(ev(by, 'Chờ người yêu cầu bổ sung thông tin (tạm dừng SLA)'));
  commit(t, [mailOut(t, followers(t), 'waiting', `${by} cần bạn bổ sung thông tin. Trả lời mail này hoặc bình luận trên ticket để tiếp tục.`, `<blockquote>${html}</blockquote>`)]);
};
export const resolveTicket = (id: string, by: string, resolution: string) => {
  const t = get(id);
  resume(t);
  touchResponse(t, by);
  t.status = 'resolved';
  t.resolvedAt = now();
  t.resolution = resolution;
  if (!t.assignee) t.assignee = by;
  t.events.push(ev(by, 'Đánh dấu đã giải quyết'));
  commit(t, [mailOut(t, followers(t), 'resolved', `Yêu cầu đã được giải quyết. Vui lòng xác nhận và đánh giá; sau ${AUTO_CLOSE_DAYS} ngày làm việc không phản hồi, ticket tự đóng.`, `<p><b>Kết quả:</b> ${esc(resolution)}</p>`)]);
};
export const confirmTicket = (id: string, by: string, rating: number | null, note: string) => {
  const t = get(id);
  t.status = 'closed';
  t.closedAt = now();
  t.rating = rating;
  t.ratingNote = note;
  t.events.push(ev(by, rating ? `Xác nhận đã xong · đánh giá ${rating}/5` : 'Xác nhận đã xong'));
  commit(t, [mailOut(t, [t.assignee], 'closed', `${by} đã xác nhận đóng ticket${rating ? `, đánh giá ${rating}/5` : ''}.`, note ? `<blockquote>${esc(note)}</blockquote>` : '')]);
};
export const canReopen = (t: Ticket, at = now()) => (t.status === 'resolved' || (t.status === 'closed' && !!t.closedAt && at - t.closedAt <= REOPEN_DAYS * 24 * HOUR));
export const reopenTicket = (id: string, by: string, reason: string) => {
  const t = get(id);
  t.status = t.assignee ? 'in_progress' : 'new';
  t.reopenCount += 1;
  t.resolvedAt = null;
  t.closedAt = null;
  t.rating = null;
  t.dueResolve = addWorkHours(now(), slaOf(t.priority).resolve);
  t.comments.push({ id: uid('c'), at: now(), by, html: esc(reason), internal: false, source: 'web' });
  t.events.push(ev(by, 'Mở lại ticket'));
  commit(t, [mailOut(t, [t.assignee || '', ...(t.assignee ? [] : handlersOf(t))], 'reopen', `${by} mở lại ticket: ${reason}`)]);
};
export const cancelTicket = (id: string, by: string, reason: string) => {
  const t = get(id);
  t.status = 'cancelled';
  t.closedAt = now();
  t.events.push(ev(by, `Huỷ ticket${reason ? `: ${reason}` : ''}`));
  commit(t, [mailOut(t, [t.assignee || '', ...t.watchers], 'cancel', `${by} đã huỷ ticket.`)]);
};
export const forwardTicket = (id: string, by: string, deptId: string, categoryId: string, reason: string) => {
  const t = get(id);
  const from = deptById(t.deptId)?.name;
  t.deptId = deptId;
  t.categoryId = categoryId;
  t.confidential = !!catById(categoryId)?.confidential;
  t.assignee = '';
  t.status = 'new';
  t.waitingSince = null;
  const at = now();
  Object.assign(t, dueFor(at, categoryId, t.priority));
  t.firstResponseAt = null;
  t.events.push(ev(by, `Chuyển tiếp từ ${from} sang ${deptById(deptId)?.name}${reason ? `: ${reason}` : ''}`));
  const pick = autoPick(deptId);
  const mails: (TkMail | null)[] = [mailOut(t, [t.requester], 'forward', `Ticket được chuyển sang ${deptById(deptId)?.name} xử lý.`)];
  if (pick.who) {
    t.assignee = pick.who;
    t.status = 'assigned';
    t.events.push(ev(SYSTEM, `Tự giao cho ${pick.who}`));
    mails.push(mailOut(t, [pick.who], 'assigned', `Bạn được giao ticket chuyển từ ${from}.`));
  } else mails.push(mailOut(t, handlersOf(t), 'new', `Phòng nhận ticket chuyển từ ${from}, chưa giao người xử lý.`));
  commit(t, mails, { rr: pick.rr ?? S.rr });
};
export const changePriority = (id: string, by: string, p: TkPriority) => {
  const t = get(id);
  const old = t.priority;
  t.priority = p;
  const d = dueFor(t.createdAt, t.categoryId, p);
  t.dueResolve = d.dueResolve;
  if (!t.firstResponseAt) t.dueResponse = d.dueResponse;
  t.events.push(ev(by, `Đổi ưu tiên: ${PRIORITY_LABEL[old]} → ${PRIORITY_LABEL[p]} (tính lại hạn SLA)`));
  commit(t);
};
export const setDue = (id: string, by: string, due: number) => {
  const t = get(id);
  t.dueResolve = due;
  t.events.push(ev(by, `Đổi hạn xử lý: ${fmtDT(due)}`));
  commit(t, [mailOut(t, [t.assignee, t.requester], 'due', `${by} đổi hạn xử lý thành ${fmtDT(due)}.`)]);
};
export const addWatcher = (id: string, by: string, who: string) => {
  const t = get(id);
  if (t.watchers.includes(who) || who === t.requester) return;
  t.watchers.push(who);
  t.events.push(ev(by, `Thêm người theo dõi: ${who}`));
  commit(t, [mailOut(t, [who], 'watch', `${by} thêm bạn vào danh sách theo dõi ticket.`)]);
};
export const removeWatcher = (id: string, by: string, who: string) => {
  const t = get(id);
  t.watchers = t.watchers.filter((w) => w !== who);
  t.events.push(ev(by, `Bỏ người theo dõi: ${who}`));
  commit(t);
};

// ── Mail đến (mô phỏng Outlook → hệ thống) ──
const CODE_RE = /\[(TK-\d{4}-\d{5})\]/;
/** Trả lời mail thông báo → thành bình luận của ticket (nhận ra nhờ mã trong tiêu đề). */
export const replyByMail = (mail: TkMail, from: string, text: string) => {
  const code = mail.subject.match(CODE_RE)?.[1];
  const t = S.tickets.find((x) => x.code === code);
  if (!t) throw new Error('Không nhận ra mã ticket trong tiêu đề mail');
  const html = esc(text).replace(/\n/g, '<br>');
  const inMail: TkMail = { id: uid('m'), ticketId: t.id, at: now(), dir: 'in', from, to: [deptById(t.deptId)?.mailbox || ''], subject: `RE: ${mail.subject}`, html, kind: 'reply' };
  set((s) => ({ ...s, mails: [inMail, ...s.mails] }));
  commentTicket(t.id, from, html, false, 'mail');
  return t;
};
/** Mail gửi vào hộp thư phòng ban → ticket mới. */
export const mailToDept = (from: string, mailbox: string, subject: string, text: string) => {
  const d = S.depts.find((x) => x.mailbox === mailbox && x.active);
  if (!d) throw new Error(`Hộp thư ${mailbox} không nhận ticket`);
  const cat = S.cats.find((c) => c.deptId === d.id && c.active && !c.confidential);
  const html = esc(text).replace(/\n/g, '<br>');
  const t = createTicket({ title: subject || '(Không tiêu đề)', html, deptId: d.id, categoryId: cat?.id || '', priority: cat?.priority || 'normal', wantedDate: '', watchers: [], files: [], requester: from, source: 'mail' });
  const inMail: TkMail = { id: uid('m'), ticketId: t.id, at: t.createdAt, dir: 'in', from, to: [mailbox], subject, html, kind: 'new-mail' };
  set((s) => ({ ...s, mails: [inMail, ...s.mails] }));
  return t;
};

/** Ticket "Đã giải quyết" quá 3 ngày làm việc không xác nhận → tự đóng. */
export const sweepAutoClose = () => {
  const at = now();
  S.tickets
    .filter((t) => t.status === 'resolved' && t.resolvedAt && workHoursBetween(t.resolvedAt, at) >= AUTO_CLOSE_DAYS * 8)
    .forEach((t0) => {
      const t = structuredClone(t0);
      t.status = 'closed';
      t.closedAt = at;
      t.events.push(ev(SYSTEM, `Tự đóng sau ${AUTO_CLOSE_DAYS} ngày làm việc không có xác nhận`));
      commit(t);
    });
};

// ── Cấu hình ──
export const saveDept = (d: TkDept) => set((s) => ({ ...s, depts: s.depts.some((x) => x.id === d.id) ? s.depts.map((x) => (x.id === d.id ? d : x)) : [...s.depts, d] }));
export const saveCat = (c: TkCategory) => set((s) => ({ ...s, cats: s.cats.some((x) => x.id === c.id) ? s.cats.map((x) => (x.id === c.id ? c : x)) : [...s.cats, c] }));
export const deleteCat = (id: string) => set((s) => ({ ...s, cats: s.cats.filter((c) => c.id !== id) }));
export const saveSla = (sla: TkSla[]) => set((s) => ({ ...s, sla }));
export const newId = uid;

// ==========================================================================
// Định dạng
// ==========================================================================
const p2 = (n: number) => String(n).padStart(2, '0');
export const fmtDT = (ms: number | null) => {
  if (!ms) return '—';
  const d = new Date(ms);
  return `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
};
export const fmtD = (ms: number | null) => (ms ? fmtDT(ms).slice(0, 10) : '—');
/** "còn 3 giờ" / "quá 2 ngày" theo giờ làm việc. */
export const leftText = (due: number, at = now()) => {
  const late = at > due;
  const h = late ? workHoursBetween(due, at) : workHoursBetween(at, due);
  const v = h >= 8 ? `${Math.round(h / 8)} ngày` : h >= 1 ? `${Math.round(h)} giờ` : `${Math.max(1, Math.round(h * 60))} phút`;
  return late ? `quá ${v}` : `còn ${v}`;
};
export const plainText = plain;

// ==========================================================================
// Dữ liệu mẫu — dựng bằng chính các thao tác trên, theo mốc thời gian trong quá khứ
// ==========================================================================
const seed = () => {
  const base = Date.now();
  // mốc giờ làm việc lùi lại n giờ làm việc từ hiện tại
  const back = (h: number) => {
    let t = base;
    let left = h;
    while (left > 0) {
      t -= HOUR / 2;
      const d = new Date(t);
      const hh = d.getHours() + d.getMinutes() / 60;
      if (isWorkDay(dayStart(t)) && ((hh >= 8 && hh < 12) || (hh >= 13 && hh < 17))) left -= 0.5;
    }
    return t;
  };
  const at = (h: number, fn: () => void) => {
    CLOCK = back(h);
    fn();
  };
  const last = () => S.tickets[0];
  const mk = (h: number, f: Partial<NewTicket> & { title: string; categoryId: string; requester: string }, steps: [number, (t: Ticket) => void][] = []) => {
    let t!: Ticket;
    at(h, () => {
      const c = catById(f.categoryId)!;
      t = createTicket({ html: '', deptId: c.deptId, priority: c.priority, wantedDate: '', watchers: [], files: [], ...f } as NewTicket);
    });
    steps.forEach(([hh, fn]) => at(hh, () => fn(S.tickets.find((x) => x.id === t.id)!)));
    return last();
  };
  const P = (s: string) => `<p>${s}</p>`;
  mk(70, { title: 'Laptop không lên nguồn sau khi cập nhật Windows', categoryId: 'c-it-1', requester: 'Phạm Thu Dung', html: P('Sáng nay cập nhật Windows xong thì máy tắt và không bật lại được. Máy Dell Latitude, mã tài sản TS-0142. Cần máy gấp để họp khách hàng chiều mai.'), files: [{ name: 'anh-loi-man-hinh.jpg', size: 245_000 }] }, [
    [68, (t) => takeTicket(t.id, t.assignee)],
    [67, (t) => commentTicket(t.id, t.assignee, P('Anh mang máy lên phòng IT tầng 15 giúp em, em kiểm tra ổ cứng. Trong lúc chờ em cấp máy dự phòng.'), false)],
    [62, (t) => commentTicket(t.id, t.assignee, P('Ổ SSD lỗi, đã thay mới và cài lại Windows. Dữ liệu trên OneDrive vẫn còn.'), true)],
    [60, (t) => resolveTicket(t.id, t.assignee, 'Thay SSD mới, cài lại Windows và phần mềm, đồng bộ lại OneDrive.')],
    [58, (t) => confirmTicket(t.id, t.requester, 5, 'Hỗ trợ rất nhanh, cảm ơn em.')],
  ]);
  mk(46, { title: 'Cấp quyền Jira và Confluence cho nhân viên mới', categoryId: 'c-it-3', requester: 'Hoàng Minh Đức', html: P('Nhân viên mới Nguyễn Hữu Tài (Khối Kinh doanh G1) onboard thứ Hai tuần sau, cần quyền Jira dự án CRM-VTX và Confluence space Kinh doanh.'), watchers: ['Bùi Thanh Hương'] }, [
    [44, (t) => takeTicket(t.id, t.assignee)],
    [43, (t) => askRequester(t.id, t.assignee, P('Anh cho em xin email công ty của bạn Tài và quyền cần là xem hay chỉnh sửa ạ?'))],
  ]);
  mk(30, { title: 'VPN không kết nối được khi làm việc tại nhà', categoryId: 'c-it-5', requester: 'Đặng Quốc Huy', html: P('Từ hôm qua FortiClient báo lỗi "credential or SSLVPN configuration is wrong". Mật khẩu vẫn đăng nhập email bình thường.') }, [
    [29, (t) => takeTicket(t.id, t.assignee)],
    [28, (t) => commentTicket(t.id, t.assignee, P('Em đã reset hồ sơ VPN của anh, anh thử đăng nhập lại giúp em.'), false)],
  ]);
  mk(12, { title: 'Cài đặt Power BI Desktop', categoryId: 'c-it-6', requester: 'Bùi Thanh Hương', html: P('Cần Power BI Desktop để làm báo cáo doanh thu quý 4.') });
  mk(1.5, { title: 'Khoá tài khoản email do nhập sai mật khẩu', categoryId: 'c-it-4', requester: 'Nguyễn Văn An', html: P('Tài khoản email bị khoá, không đăng nhập được Outlook trên điện thoại và máy tính.'), priority: 'urgent' }, [[1, (t) => takeTicket(t.id, t.assignee)]]);
  mk(3, { title: 'Wifi tầng 14 chập chờn khu vực phòng họp', categoryId: 'c-it-5', requester: 'Ngô Thị Lan', html: P('Wifi ở 3 phòng họp tầng 14 rớt liên tục, ảnh hưởng họp online với khách.') });
  mk(22, { title: 'Xin giấy xác nhận công tác để làm visa', categoryId: 'c-hcns-1', requester: 'Phạm Thu Dung', html: P('Em cần giấy xác nhận công tác (tiếng Anh) để nộp hồ sơ visa Nhật, đi công tác ngày 20/11.'), wantedDate: '2026-11-10' }, [
    [20, (t) => takeTicket(t.id, t.assignee)],
    [12, (t) => resolveTicket(t.id, t.assignee, 'Đã ký giấy xác nhận song ngữ, bạn nhận bản gốc tại phòng HCNS tầng 15.')],
  ]);
  mk(16, { title: 'Điều chỉnh thông tin sổ BHXH sai ngày sinh', categoryId: 'c-hcns-2', requester: 'Đỗ Văn Khánh', html: P('Sổ BHXH ghi ngày sinh 12/05 nhưng CCCD là 21/05. Nhờ HCNS làm thủ tục điều chỉnh.'), files: [{ name: 'cccd-2-mat.pdf', size: 512_000 }] }, [[15, (t) => takeTicket(t.id, t.assignee)]]);
  mk(26, { title: 'Thắc mắc khoản trừ trong bảng lương tháng 10', categoryId: 'c-hcns-4', requester: 'Dương Minh Long', html: P('Bảng lương tháng 10 có khoản trừ 1.200.000 đ không rõ lý do, nhờ chị kiểm tra giúp.') }, [[24, (t) => takeTicket(t.id, t.assignee)]]);
  mk(5, { title: 'Hỏi thủ tục gia hạn hợp đồng lao động', categoryId: 'c-hcns-3', requester: 'Phan Văn Nam', html: P('Hợp đồng của em hết hạn cuối tháng 12, em cần chuẩn bị gì để tái ký?') });
  mk(40, { title: 'Điều chỉnh hoá đơn sai mã số thuế khách hàng', categoryId: 'c-kt-1', requester: 'Hoàng Minh Đức', html: P('Hoá đơn số 0001245 xuất cho Công ty ABC ghi sai MST (0101234567 → 0101234576). Khách cần hoá đơn điều chỉnh trước kỳ kê khai.'), priority: 'high' }, [
    [34, (t) => assignTicket(t.id, 'Lý Thu Mai', 'Lê Hoàng Cường')],
    [33, (t) => takeTicket(t.id, 'Lý Thu Mai')],
  ]);
  mk(14, { title: 'Hoàn ứng chi phí công tác Đà Nẵng', categoryId: 'c-kt-2', requester: 'Đặng Quốc Huy', html: P('Gửi kế toán hồ sơ hoàn ứng chuyến công tác Đà Nẵng 28–30/10, tổng 8.450.000 đ, đã tạm ứng 5.000.000 đ.'), files: [{ name: 'bang-ke-chi-phi.xlsx', size: 38_000 }, { name: 'hoa-don.pdf', size: 1_240_000 }] });
  mk(6, { title: 'Điều hoà phòng họp lớn tầng 15 chảy nước', categoryId: 'c-hc-3', requester: 'Trần Thị Bình', html: P('Điều hoà phòng họp lớn nhỏ nước xuống bàn, chiều nay có họp HĐQT.'), priority: 'urgent' }, [[5.5, (t) => takeTicket(t.id, t.assignee)]]);
  mk(54, { title: 'Văn phòng phẩm tháng 11 cho phòng Kinh doanh', categoryId: 'c-hc-1', requester: 'Bùi Thanh Hương', html: P('2 hộp bút bi xanh, 5 ram giấy A4, 10 sổ tay, 3 hộp ghim.') }, [
    [50, (t) => takeTicket(t.id, t.assignee)],
    [41, (t) => resolveTicket(t.id, t.assignee, 'Đã giao đủ văn phòng phẩm cho phòng Kinh doanh.')],
  ]);
  mk(35, { title: 'Đặt xe đưa đón khách tại sân bay Nội Bài', categoryId: 'c-hc-2', requester: 'Nguyễn Văn An', html: P('Đón 3 khách từ Singapore, chuyến SQ176 hạ cánh 14:30 thứ Năm, đưa về khách sạn Lotte.') }, [
    [34, (t) => takeTicket(t.id, t.assignee)],
    [33, (t) => commentTicket(t.id, t.assignee, P('Đã đặt xe 7 chỗ, tài xế anh Hùng 0900 000 321.'), false)],
    [32, (t) => resolveTicket(t.id, t.assignee, 'Đã đặt xe 7 chỗ, gửi thông tin tài xế cho anh.')],
    [31, (t) => confirmTicket(t.id, t.requester, 4, '')],
  ]);
  mk(6, { title: 'Máy in tầng 15 báo kẹt giấy liên tục', categoryId: 'c-hc-3', requester: 'Lý Thu Mai', html: P('Máy in Canon khu Kế toán báo kẹt giấy dù không có giấy kẹt.') }, [
    [5, (t) => forwardTicket(t.id, 'Vũ Thị Giang', 'd-it', 'c-it-1', 'Lỗi phần cứng máy in, chuyển IT kiểm tra')],
  ]);
  CLOCK = null;
  sweepAutoClose();
};
seed();
