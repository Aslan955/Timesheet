/**
 * Phân hệ "Quy trình" — ĐƠN (lượt chạy quy trình) do người dùng tạo theo quy trình đã thiết lập.
 *  - Bước 1: người tạo điền biểu mẫu bước 1, chọn người xử lý bước 2, gửi.
 *  - Mỗi bước sau: người xử lý điền trường của bước (nếu có), ghi ý kiến, chọn người xử lý bước kế tiếp, Phê duyệt / Từ chối.
 *  - Quy trình "không giới hạn bước": người xử lý bước cuối được chuyển tiếp thêm người.
 *  - Đơn chụp lại các bước của quy trình lúc tạo (sửa quy trình sau không ảnh hưởng đơn đang chạy).
 * Bản prototype: chọn "Đang dùng với tài khoản" để thử vai người tạo / người duyệt.
 */
import { useSyncExternalStore } from 'react';
import { PROC_PEOPLE, PROC_UNITS, getProcesses, uidP, type ProcStep, type Process } from './processStore';

export type ReqStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'recalled';
export type RunStatus = 'waiting' | 'pending' | 'approved' | 'rejected' | 'skipped';
export const REQ_STATUS: Record<ReqStatus, { label: string; cls: string }> = {
  draft: { label: 'Nháp', cls: 'bg-slate-50 text-slate-600 border-slate-300' },
  pending: { label: 'Đang xử lý', cls: 'bg-amber-50 text-amber-700 border-amber-300' },
  approved: { label: 'Đã duyệt', cls: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  rejected: { label: 'Từ chối', cls: 'bg-rose-50 text-rose-700 border-rose-300' },
  recalled: { label: 'Đã thu hồi', cls: 'bg-slate-100 text-slate-500 border-slate-300' },
};

export type FieldValue = string | number | string[] | { rows: Record<string, string | number>[] } | null;
export interface StepRun {
  stepId: string;
  name: string;
  def: ProcStep; // bản chụp bước (trường thông tin)
  assignee: string | null;
  status: RunStatus;
  startedAt: string | null;
  deadline: string | null;
  actedAt: string | null;
  comment: string;
  data: Record<string, FieldValue>; // fieldId → giá trị
  extra?: boolean; // bước chuyển tiếp thêm (quy trình không giới hạn bước)
}
export interface ReqLog {
  at: string;
  by: string;
  action: string;
  comment?: string;
}
export interface ProcRequest {
  id: string;
  code: string;
  processId: string;
  processCode: string;
  processName: string;
  version: string;
  icon: string;
  color: string;
  quickSteps: string[];
  unlimitedSteps: boolean;
  showStep1: boolean;
  title: string;
  creator: string;
  createdAt: string;
  submittedAt: string | null;
  status: ReqStatus;
  current: number; // chỉ số bước đang xử lý
  runs: StepRun[];
  related: string[];
  history: ReqLog[];
}

// ==========================================================================
// Người dùng (prototype)
// ==========================================================================
export const UNIT_OF: Record<string, string> = Object.fromEntries(PROC_PEOPLE.map((p, i) => [p, PROC_UNITS[i % PROC_UNITS.length]]));
let USER = PROC_PEOPLE[0];
const USER_SUBS = new Set<() => void>();
export const getUser = () => USER;
export const setUser = (u: string) => {
  USER = u;
  USER_SUBS.forEach((f) => f());
};
export const useUser = () => useSyncExternalStore((cb) => (USER_SUBS.add(cb), () => void USER_SUBS.delete(cb)), () => USER);
/** Người dùng có được tạo đơn theo quy trình này không. */
export const canUse = (p: Process, user: string) =>
  p.active && (p.permMode === 'all' || (p.permMode === 'units' && p.permUnits.includes(UNIT_OF[user])) || (p.permMode === 'people' && p.permPeople.includes(user)));

// ==========================================================================
// Tiện ích
// ==========================================================================
export const nowIso = () => new Date().toISOString();
export const addDaysIso = (iso: string, d: number) => new Date(new Date(iso).getTime() + d * 86400000).toISOString();
export const deadlineOf = (def: ProcStep, from: string) => (def.deadlineDays ? addDaysIso(from, def.deadlineDays) : null);
export const isOverdue = (r: ProcRequest) => {
  const run = r.runs[r.current];
  return r.status === 'pending' && !!run?.deadline && run.deadline < nowIso();
};
export const currentRun = (r: ProcRequest) => (r.status === 'pending' ? r.runs[r.current] : undefined);
/** Mã đơn: viết tắt quy trình + năm + số thứ tự (VD DNTT-2026-0012). */
export const abbr = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .split(/\s+/)
    .filter((w) => /^[a-z]/i.test(w))
    .map((w) => w[0].toUpperCase())
    .join('')
    .slice(0, 5) || 'DON';
export const nextReqCode = (p: Pick<Process, 'name'>, list: ProcRequest[]) => {
  const y = new Date().getFullYear();
  const pre = `${abbr(p.name)}-${y}-`;
  const n = Math.max(0, ...list.filter((r) => r.code.startsWith(pre)).map((r) => Number(r.code.slice(pre.length)) || 0)) + 1;
  return `${pre}${String(n).padStart(4, '0')}`;
};
/** Tạo đơn mới (nháp) từ quy trình. */
export const newRequest = (p: Process, creator: string, list: ProcRequest[]): ProcRequest => {
  const t = nowIso();
  return {
    id: uidP('r'),
    code: nextReqCode(p, list),
    processId: p.id,
    processCode: p.code,
    processName: p.name,
    version: p.version,
    icon: p.icon,
    color: p.color,
    quickSteps: [...p.quickSteps],
    unlimitedSteps: p.unlimitedSteps,
    showStep1: p.showStep1,
    title: '',
    creator,
    createdAt: t,
    submittedAt: null,
    status: 'draft',
    current: 0,
    runs: p.steps.map((s, i) => ({
      stepId: s.id,
      name: s.name,
      def: structuredClone(s),
      assignee: i === 0 ? creator : null,
      status: i === 0 ? 'pending' : 'waiting',
      startedAt: i === 0 ? t : null,
      deadline: null,
      actedAt: null,
      comment: '',
      data: {},
    })),
    related: [...p.related],
    history: [{ at: t, by: creator, action: 'Tạo đơn (nháp)' }],
  };
};

// ==========================================================================
// Dữ liệu mẫu
// ==========================================================================
const seed = (): ProcRequest[] => {
  const procs = getProcesses();
  const byCode = (c: string) => procs.find((p) => p.code === c)!;
  const list: ProcRequest[] = [];
  const day = (n: number, h = 9) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(h, 15, 0, 0);
    return d.toISOString();
  };
  /** Đơn mẫu: người tạo, ngày gửi, dữ liệu bước 1, người xử lý từng bước, số bước đã duyệt, kết thúc. */
  const mk = (code: string, creator: string, sentDaysAgo: number, title: string, d1: (r: ProcRequest) => void, assignees: string[], done: number, end?: 'approved' | 'rejected' | 'recalled', note = '') => {
    const p = byCode(code);
    const r = newRequest(p, creator, list);
    const sent = day(sentDaysAgo);
    r.createdAt = sent;
    r.submittedAt = sent;
    r.title = title;
    d1(r);
    r.history = [{ at: sent, by: creator, action: 'Gửi đơn', comment: '' }];
    r.runs[0] = { ...r.runs[0], status: 'approved', startedAt: sent, actedAt: sent };
    let t = sent;
    r.runs.forEach((run, i) => {
      if (i === 0) return;
      run.assignee = assignees[i - 1] || null;
      if (i <= done) {
        run.startedAt = t;
        run.deadline = deadlineOf(run.def, t);
        t = addDaysIso(t, 0.6);
        run.actedAt = t;
        run.status = 'approved';
        run.comment = i === 1 ? 'Đồng ý, chuyển bước tiếp theo.' : 'Đã kiểm tra, đồng ý.';
        r.history.push({ at: t, by: run.assignee!, action: `Phê duyệt bước ${i + 1}: ${run.name}`, comment: run.comment });
      } else if (i === done + 1 && !end) {
        run.status = 'pending';
        run.startedAt = t;
        run.deadline = deadlineOf(run.def, t);
        r.current = i;
      } else if (i === done + 1 && end === 'rejected') {
        run.startedAt = t;
        t = addDaysIso(t, 0.5);
        run.actedAt = t;
        run.status = 'rejected';
        run.comment = note;
        r.current = i;
        r.history.push({ at: t, by: run.assignee!, action: `Từ chối ở bước ${i + 1}: ${run.name}`, comment: note });
      }
    });
    r.status = end || (done >= r.runs.length - 1 ? 'approved' : 'pending');
    if (end === 'approved' || (!end && done >= r.runs.length - 1)) {
      r.status = 'approved';
      r.current = r.runs.length - 1;
      r.history.push({ at: t, by: r.runs[r.runs.length - 1].assignee || '', action: 'Hoàn tất — đơn đã được phê duyệt' });
    }
    if (end === 'recalled') {
      r.runs[1].status = 'skipped';
      r.history.push({ at: addDaysIso(sent, 0.2), by: creator, action: 'Thu hồi đơn', comment: note });
    }
    list.push(r);
    return r;
  };
  const f = (r: ProcRequest, label: string) => r.runs[0].def.fields.find((x) => x.label === label)?.id || '';
  const setF = (r: ProcRequest, label: string, v: FieldValue) => (r.runs[0].data[f(r, label)] = v);

  // Đề nghị thanh toán (4 bước)
  const tt = (r: ProcRequest, nd: string, rows: { text: string; amount: number }[], ben: string) => {
    setF(r, 'Số đề nghị', r.code);
    setF(r, 'Người đề nghị', r.creator);
    setF(r, 'Phòng ban', UNIT_OF[r.creator]);
    setF(r, 'Nội dung thanh toán', nd);
    setF(r, 'Chi tiết khoản chi', { rows: rows.map((x) => ({ nd: x.text, st: x.amount })) });
    setF(r, 'Hạng mục chi phí', 'Chi phí văn phòng');
    setF(r, 'Hạn thanh toán', new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
    setF(r, 'Đơn vị thụ hưởng', ben);
    setF(r, 'Chứng từ kèm theo', ['hoa-don-GTGT.pdf']);
  };
  mk('QT-001', PROC_PEOPLE[0], 2, 'Thanh toán chi phí in ấn tài liệu hội thảo', (r) => tt(r, 'Thanh toán in ấn 300 bộ tài liệu hội thảo khách hàng tháng 10', [{ text: 'In tài liệu 300 bộ', amount: 9_000_000 }, { text: 'Thiết kế', amount: 2_500_000 }], 'Công ty In Ánh Dương (mẫu)'), [PROC_PEOPLE[1], PROC_PEOPLE[9], PROC_PEOPLE[12]], 1);
  mk('QT-001', PROC_PEOPLE[3], 1, 'Thanh toán thuê phòng họp sự kiện', (r) => tt(r, 'Thuê phòng họp + âm thanh cho sự kiện ra mắt sản phẩm', [{ text: 'Thuê phòng 1 ngày', amount: 15_000_000 }, { text: 'Âm thanh ánh sáng', amount: 6_000_000 }], 'Khách sạn Hoà Bình (mẫu)'), [PROC_PEOPLE[0], PROC_PEOPLE[9], PROC_PEOPLE[12]], 0);
  mk('QT-001', PROC_PEOPLE[5], 9, 'Thanh toán văn phòng phẩm quý IV', (r) => tt(r, 'Văn phòng phẩm quý IV/2026', [{ text: 'Giấy, bút, sổ', amount: 4_200_000 }], 'Cửa hàng VPP Minh Tâm (mẫu)'), [PROC_PEOPLE[1], PROC_PEOPLE[9], PROC_PEOPLE[12]], 3);
  // Tạm ứng
  mk('QT-002', PROC_PEOPLE[0], 6, 'Tạm ứng công tác Đà Nẵng', (r) => {
    setF(r, 'Người tạm ứng', r.creator);
    setF(r, 'Lý do tạm ứng', 'Công tác triển khai dự án tại Đà Nẵng 3 ngày');
    setF(r, 'Số tiền tạm ứng', 8_000_000);
  }, [PROC_PEOPLE[1], PROC_PEOPLE[9]], 1, 'rejected', 'Đề nghị bổ sung kế hoạch công tác được duyệt rồi gửi lại.');
  mk('QT-002', PROC_PEOPLE[7], 3, 'Tạm ứng mua vật tư lắp đặt', (r) => {
    setF(r, 'Người tạm ứng', r.creator);
    setF(r, 'Lý do tạm ứng', 'Mua vật tư lắp đặt thiết bị cho khách hàng');
    setF(r, 'Số tiền tạm ứng', 12_500_000);
  }, [PROC_PEOPLE[0], PROC_PEOPLE[9]], 0);
  // Phê duyệt dự án
  mk('QT-003', PROC_PEOPLE[2], 4, 'Dự án triển khai hệ thống kho cho khách hàng X (mẫu)', (r) => {
    setF(r, 'Tên dự án', 'Triển khai hệ thống quản lý kho');
    setF(r, 'Khách hàng', 'Khách hàng X (mẫu)');
    setF(r, 'Giá trị hợp đồng dự kiến', 1_250_000_000);
    setF(r, 'Tỷ suất lợi nhuận dự kiến (%)', 22);
  }, [PROC_PEOPLE[4], PROC_PEOPLE[0], PROC_PEOPLE[12]], 1);
  // OT
  mk('QT-005', PROC_PEOPLE[0], 12, 'Làm thêm giờ chốt số liệu cuối tháng', (r) => {
    setF(r, 'Số giờ', 4);
    setF(r, 'Nội dung công việc', 'Chốt số liệu báo cáo tháng 9');
  }, [PROC_PEOPLE[4], PROC_PEOPLE[1]], 2);
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

// ==========================================================================
// Kho dữ liệu
// ==========================================================================
let REQS: ProcRequest[] | null = null;
const SUBS = new Set<() => void>();
const ensure = () => (REQS ??= seed());
export const getRequests = () => ensure();
export const updateRequests = (fn: (l: ProcRequest[]) => ProcRequest[]) => {
  REQS = fn(ensure());
  SUBS.forEach((f) => f());
};
export const useRequests = () => useSyncExternalStore((cb) => (SUBS.add(cb), () => void SUBS.delete(cb)), ensure);
export const saveRequest = (r: ProcRequest) => updateRequests((l) => (l.some((x) => x.id === r.id) ? l.map((x) => (x.id === r.id ? r : x)) : [r, ...l]));

// ==========================================================================
// Xử lý đơn
// ==========================================================================
/** Gửi đơn: bước 1 hoàn tất, giao bước 2 cho người được chọn. */
export const submitRequest = (r: ProcRequest, next: string): ProcRequest => {
  const t = nowIso();
  const runs = r.runs.map((x, i) =>
    i === 0 ? { ...x, status: 'approved' as RunStatus, actedAt: t } : i === 1 ? { ...x, assignee: next, status: 'pending' as RunStatus, startedAt: t, deadline: deadlineOf(x.def, t) } : { ...x, status: 'waiting' as RunStatus, assignee: null, startedAt: null, deadline: null, actedAt: null, comment: '' },
  );
  return { ...r, runs, status: 'pending', current: 1, submittedAt: t, history: [...r.history, { at: t, by: r.creator, action: `Gửi đơn — chuyển ${next} xử lý bước 2: ${r.runs[1]?.name}` }] };
};
/** Phê duyệt bước hiện tại. next = người xử lý bước kế tiếp; forward = chuyển tiếp thêm người (bước cuối, quy trình không giới hạn bước). */
export const approveStep = (r: ProcRequest, user: string, comment: string, data: Record<string, FieldValue>, next?: string, forward?: string): ProcRequest => {
  const t = nowIso();
  const i = r.current;
  const runs = r.runs.map((x) => ({ ...x }));
  runs[i] = { ...runs[i], status: 'approved', actedAt: t, comment, data: { ...runs[i].data, ...data } };
  const history = [...r.history, { at: t, by: user, action: `Phê duyệt bước ${i + 1}: ${runs[i].name}`, comment }];
  const last = i === runs.length - 1;
  if (last && forward) {
    const def: ProcStep = { id: uidP('s'), name: 'Xử lý bổ sung', desc: '', deadlineDays: null, fields: [] };
    runs.push({ stepId: def.id, name: `Xử lý bổ sung (${forward})`, def, assignee: forward, status: 'pending', startedAt: t, deadline: null, actedAt: null, comment: '', data: {}, extra: true });
    history.push({ at: t, by: user, action: `Chuyển tiếp thêm ${forward} xử lý` });
    return { ...r, runs, current: i + 1, history };
  }
  if (last) return { ...r, runs, status: 'approved', history: [...history, { at: t, by: user, action: 'Hoàn tất — đơn đã được phê duyệt' }] };
  runs[i + 1] = { ...runs[i + 1], assignee: next || null, status: 'pending', startedAt: t, deadline: deadlineOf(runs[i + 1].def, t) };
  history.push({ at: t, by: user, action: `Chuyển ${next} xử lý bước ${i + 2}: ${runs[i + 1].name}` });
  return { ...r, runs, current: i + 1, history };
};
export const rejectStep = (r: ProcRequest, user: string, comment: string, data: Record<string, FieldValue>): ProcRequest => {
  const t = nowIso();
  const i = r.current;
  const runs = r.runs.map((x, k) => (k === i ? { ...x, status: 'rejected' as RunStatus, actedAt: t, comment, data: { ...x.data, ...data } } : x));
  return { ...r, runs, status: 'rejected', history: [...r.history, { at: t, by: user, action: `Từ chối ở bước ${i + 1}: ${runs[i].name}`, comment }] };
};
/** Người tạo thu hồi đơn đang xử lý. */
export const recallRequest = (r: ProcRequest, comment: string): ProcRequest => {
  const t = nowIso();
  const runs = r.runs.map((x, k) => (k === r.current ? { ...x, status: 'skipped' as RunStatus } : x));
  return { ...r, runs, status: 'recalled', history: [...r.history, { at: t, by: r.creator, action: 'Thu hồi đơn', comment }] };
};
