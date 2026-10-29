/**
 * Phân hệ "Quy trình" — ĐƠN (lượt chạy quy trình) do người dùng tạo theo quy trình đã thiết lập.
 *  - Bước 1: người tạo điền biểu mẫu bước 1, chọn người xử lý bước 2, gửi.
 *  - Mỗi bước sau: người xử lý điền trường của bước (nếu có), ghi ý kiến, chọn người xử lý bước kế tiếp, Phê duyệt / Từ chối.
 *  - Quy trình "không giới hạn bước": người xử lý bước cuối được chuyển tiếp thêm người.
 *  - Đơn chụp lại các bước của quy trình lúc tạo (sửa quy trình sau không ảnh hưởng đơn đang chạy).
 * Bản prototype: chọn "Đang dùng với tài khoản" để thử vai người tạo / người duyệt.
 */
import { useSyncExternalStore } from 'react';
import { PROC_PEOPLE, PROC_UNITS, getProcesses, renderTitle, uidP, type ProcStep, type Process } from './processStore';

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
  /** Mẫu tiêu đề của quy trình lúc tạo đơn — có thì tiêu đề tự ghép từ giá trị trường */
  titleTpl?: string;
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
    titleTpl: p.titleTpl || '',
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
  const mk = (code: string, creator: string, sentDaysAgo: number, d1: (r: ProcRequest) => void, assignees: string[], done: number, end?: 'approved' | 'rejected' | 'recalled', note = '') => {
    const p = byCode(code);
    const r = newRequest(p, creator, list);
    const sent = day(sentDaysAgo);
    r.createdAt = sent;
    r.submittedAt = sent;
    d1(r);
    r.title = r.titleTpl ? renderTitle(r.titleTpl, r.runs[0].def.fields, r.runs[0].data) : p.name;
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
  /** Bảng: dòng khai báo theo tên cột */
  const setT = (r: ProcRequest, label: string, rows: Record<string, string | number>[]) => {
    const fd = r.runs[0].def.fields.find((x) => x.label === label);
    const cols = fd?.cfg?.columns || [];
    setF(r, label, { rows: rows.map((row) => Object.fromEntries(Object.entries(row).map(([k, v]) => [cols.find((c) => c.name === k)?.id || k, v]))) });
  };
  const P = PROC_PEOPLE;
  const DUAN = ['PRJ-001 · Hệ thống quản lý kho (mẫu)', 'PRJ-002 · Cổng thông tin khách hàng (mẫu)', 'PRJ-003 · Ứng dụng di động bán hàng (mẫu)', 'NỘI BỘ · Chi phí chung công ty'];
  const inDays = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
  const bank = (r: ProcRequest, who: string, acc: string) => {
    setF(r, 'Tổ chức/Cá nhân nhận tiền', who);
    setF(r, 'Số tài khoản', acc);
    setF(r, 'Ngân hàng', 'Ngân hàng TMCP Mẫu — CN Hà Nội');
  };
  const appr4 = [P[1], P[9], P[12], P[4]];

  // 1. Tạm ứng — 2 đơn đã duyệt (dùng cho quyết toán) + 1 đơn đang xử lý
  const tu1 = mk('QT-001', P[0], 20, (r) => {
    setF(r, 'Người đề nghị', [r.creator]);
    setF(r, 'Mục đích tạm ứng', 'công tác triển khai PRJ-001 tại Đà Nẵng');
    setF(r, 'Hạn thanh toán', inDays(-18));
    setF(r, 'Ngày hoàn ứng', inDays(5));
    bank(r, r.creator, '0011000000001');
    setT(r, 'Bảng kê tạm ứng', [
      { 'Nội dung tạm ứng': 'Vé máy bay khứ hồi Hà Nội – Đà Nẵng', 'Loại tiền': 'VND', 'Số tiền': 6_200_000, 'Mã dự án': DUAN[0], 'Hóa đơn, chứng từ, tài liệu khác kèm theo (nếu có)': 'ke-hoach-cong-tac.pdf' },
      { 'Nội dung tạm ứng': 'Khách sạn 3 đêm', 'Loại tiền': 'VND', 'Số tiền': 4_500_000, 'Mã dự án': DUAN[0] },
      { 'Nội dung tạm ứng': 'Công tác phí', 'Loại tiền': 'VND', 'Số tiền': 1_800_000, 'Mã dự án': DUAN[0] },
    ]);
  }, appr4, 4);
  mk('QT-001', P[0], 15, (r) => {
    setF(r, 'Người đề nghị', [r.creator]);
    setF(r, 'Mục đích tạm ứng', 'mua vật tư lắp đặt thiết bị cho khách hàng');
    setF(r, 'Hạn thanh toán', inDays(-13));
    setF(r, 'Ngày hoàn ứng', inDays(10));
    bank(r, r.creator, '0011000000001');
    setT(r, 'Bảng kê tạm ứng', [{ 'Nội dung tạm ứng': 'Vật tư lắp đặt (dây, ống, giá đỡ)', 'Loại tiền': 'VND', 'Số tiền': 7_800_000, 'Mã dự án': DUAN[0], 'Hóa đơn, chứng từ, tài liệu khác kèm theo (nếu có)': 'bao-gia-vat-tu.pdf' }]);
  }, appr4, 4);
  mk('QT-001', P[7], 2, (r) => {
    setF(r, 'Người đề nghị', [r.creator]);
    setF(r, 'Mục đích tạm ứng', 'tiếp khách đối tác dự án PRJ-003');
    setF(r, 'Hạn thanh toán', inDays(3));
    setF(r, 'Ngày hoàn ứng', inDays(20));
    bank(r, r.creator, '0011000000008');
    setT(r, 'Bảng kê tạm ứng', [{ 'Nội dung tạm ứng': 'Chi phí tiếp khách', 'Loại tiền': 'VND', 'Số tiền': 5_000_000, 'Mã dự án': DUAN[2], 'Hóa đơn, chứng từ, tài liệu khác kèm theo (nếu có)': 'ke-hoach-tiep-khach.docx' }]);
  }, [P[0], P[9], P[12], P[4]], 2);

  // 2. Quyết toán tạm ứng — quyết toán đơn tạm ứng công tác Đà Nẵng
  mk('QT-002', P[0], 1, (r) => {
    setF(r, 'Người đề nghị', [r.creator]);
    setF(r, 'Mục đích quyết toán', 'công tác triển khai PRJ-001 tại Đà Nẵng');
    setF(r, 'Danh sách đề nghị tạm ứng được quyết toán', [tu1.id]);
    setT(r, 'Bảng chi tiết quyết toán', [
      { 'Khoản chi': 'Vé máy bay khứ hồi', 'Số tiền đề nghị thanh toán': 5_950_000, 'Mã dự án': DUAN[0], 'Hóa đơn, chứng từ, tài liệu kèm theo': 've-may-bay.pdf' },
      { 'Khoản chi': 'Khách sạn 3 đêm', 'Số tiền đề nghị thanh toán': 4_200_000, 'Mã dự án': DUAN[0], 'Hóa đơn, chứng từ, tài liệu kèm theo': 'hoa-don-khach-san.pdf' },
      { 'Khoản chi': 'Công tác phí', 'Số tiền đề nghị thanh toán': 1_800_000, 'Mã dự án': DUAN[0] },
    ]);
    bank(r, r.creator, '0011000000001');
  }, appr4, 1);

  // 3. Thanh toán
  mk('QT-003', P[3], 1, (r) => {
    setF(r, 'Người đề nghị', [r.creator]);
    setF(r, 'Mục đích thanh toán', 'in ấn tài liệu hội thảo khách hàng tháng 10');
    bank(r, 'Công ty In Ánh Dương (mẫu)', '1234500000');
    setF(r, 'Hạn thanh toán', inDays(7));
    setT(r, 'Bảng chi tiết đề nghị thanh toán', [
      { 'Khoản chi': 'In tài liệu 300 bộ', 'Loại tiền': 'VND', 'Số tiền thanh toán': 9_000_000, 'Mã dự án': DUAN[3], 'Hóa đơn, chứng từ, tài liệu đính kèm': 'hoa-don-GTGT.pdf' },
      { 'Khoản chi': 'Thiết kế', 'Loại tiền': 'VND', 'Số tiền thanh toán': 2_500_000, 'Mã dự án': DUAN[3] },
    ]);
  }, [P[1], P[9], P[12], P[4]], 1);
  mk('QT-003', P[5], 9, (r) => {
    setF(r, 'Người đề nghị', [r.creator]);
    setF(r, 'Mục đích thanh toán', 'văn phòng phẩm quý IV/2026');
    bank(r, 'Cửa hàng VPP Minh Tâm (mẫu)', '9876500000');
    setF(r, 'Hạn thanh toán', inDays(-2));
    setT(r, 'Bảng chi tiết đề nghị thanh toán', [{ 'Khoản chi': 'Giấy, bút, sổ', 'Loại tiền': 'VND', 'Số tiền thanh toán': 4_200_000, 'Mã dự án': DUAN[3], 'Hóa đơn, chứng từ, tài liệu đính kèm': 'hoa-don-vpp.pdf' }]);
  }, appr4, 4);

  // 4. Xuất hoá đơn
  mk('QT-004', P[2], 1, (r) => {
    setF(r, 'Người đề nghị', [r.creator]);
    setF(r, 'Tên đơn vị', 'Công ty TNHH Khách hàng X (mẫu)');
    setF(r, 'Mã số thuế', '0100000001');
    setF(r, 'Địa chỉ', 'Số 1 phố Mẫu, Hà Nội');
    setF(r, 'Email', 'ketoan@khachhangx.example; giamdoc@khachhangx.example');
    setF(r, 'Ngày hóa đơn', inDays(2));
    setT(r, 'Bảng kê chi tiết', [{ 'Nội dung xuất hóa đơn': 'Triển khai phần mềm quản lý kho — giai đoạn 1', 'Loại tiền': 'VND', 'Đơn vị tính': 'Gói', 'Số lượng': 1, 'Đơn giá trước VAT': 250_000_000, 'Thuế suất': 8, 'Dự án': DUAN[0] }]);
  }, [P[4], P[9], P[12], P[9]], 0);

  // 5. Phát hành bảo lãnh
  mk('QT-005', P[2], 3, (r) => {
    setF(r, 'Người đề nghị', [r.creator]);
    setF(r, 'Khách hàng', 'Công ty TNHH Khách hàng X (mẫu)');
    setF(r, 'Mã số thuế', '0100000001');
    setF(r, 'Địa chỉ', 'Số 1 phố Mẫu, Hà Nội');
    setF(r, 'Loại bảo lãnh', 'Bảo lãnh thực hiện hợp đồng');
    setF(r, 'Ngày phát hành', inDays(4));
    setT(r, 'Thông tin phát hành bảo lãnh', [{ 'Tên gói thầu': 'Gói thầu số 02 — Phần mềm quản lý kho', 'Tên hạng mục công việc': 'Triển khai & đào tạo', 'Hiệu lực bảo lãnh': '12 tháng kể từ ngày phát hành', 'Giá trị': 1_200_000_000, 'Giá trị bảo lãnh': 120_000_000, 'Dự án': DUAN[0], 'Mẫu thư': 'mau-thu-bao-lanh.docx' }]);
  }, [P[4], P[11], P[12], P[4], P[9]], 2);

  // 7. Mua hàng hoá, dịch vụ
  mk('QT-007', P[8], 0.5, (r) => {
    setF(r, 'Người đề xuất', [r.creator]);
    setF(r, 'Mục đích mua sắm', 'Trang bị máy tính cho nhân sự mới khối G2');
    setF(r, 'Thời gian mua sắm dự kiến', inDays(10));
    setT(r, 'Danh mục hàng hóa cần mua', [{ 'Tên hàng hóa, dịch vụ': 'Máy tính xách tay', 'Thông số kỹ thuật': 'Core i7, 16GB RAM, SSD 512GB', 'Xuất xứ': 'Trung Quốc', 'Đơn vị tính': 'Chiếc', 'Số lượng': 3, 'Loại tiền': 'VND', 'Đơn giá tham khảo': 24_500_000 }]);
    setT(r, 'So sánh Vendor', [
      { 'Tên nhà cung cấp': 'Nhà cung cấp A (mẫu)', 'Mã số thuế': '0100000002', 'Tổng giá trị NCC báo giá': 73_500_000, 'Ưu điểm': 'Giao nhanh, bảo hành 24 tháng', 'Nhược điểm': 'Giá cao hơn 3%', 'Đề xuất': 'Chọn', 'Lý do chọn/Không chọn': 'Bảo hành tốt', 'Báo giá': 'bao-gia-A.pdf' },
      { 'Tên nhà cung cấp': 'Nhà cung cấp B (mẫu)', 'Mã số thuế': '0100000003', 'Tổng giá trị NCC báo giá': 71_200_000, 'Ưu điểm': 'Giá thấp', 'Nhược điểm': 'Giao sau 3 tuần', 'Đề xuất': 'Không chọn', 'Lý do chọn/Không chọn': 'Không kịp tiến độ', 'Báo giá': 'bao-gia-B.pdf' },
    ]);
  }, [P[1], P[6], P[12]], 0);

  // 8. Làm thêm giờ
  mk('QT-008', P[0], 12, (r) => {
    setF(r, 'Người đề xuất', [r.creator]);
    setF(r, 'Hình thức OT', 'Theo giờ');
    setF(r, 'Lý do làm thêm giờ', 'Chốt số liệu báo cáo tài chính tháng 9');
    setF(r, 'Mục tiêu công việc', 'Hoàn thành báo cáo trước hạn nộp');
    setF(r, 'Hiệu quả kỳ vọng', 'Nộp báo cáo đúng hạn');
    setF(r, 'KPI hoặc sản phẩm công việc gắn kèm', 'Bộ báo cáo tài chính tháng 9');
    setF(r, 'Tài liệu đính kèm', ['ke-hoach-OT.xlsx']);
    setT(r, 'Ngân sách OT', [{ 'Nhân viên': P[0], 'Từ': inDays(-14), 'Đến': inDays(-13), 'Loại tiền': 'VND', 'Số tiền': 1_200_000, 'Dự án': DUAN[3] }, { 'Nhân viên': P[9], 'Từ': inDays(-14), 'Đến': inDays(-13), 'Loại tiền': 'VND', 'Số tiền': 900_000, 'Dự án': DUAN[3] }]);
  }, [P[4], P[2], P[6], P[1], P[9], P[12]], 6);
  mk('QT-008', P[4], 5, (r) => {
    setF(r, 'Người đề xuất', [r.creator]);
    setF(r, 'Hình thức OT', 'Theo ngày');
    setF(r, 'Lý do làm thêm giờ', 'Hỗ trợ go-live hệ thống cho khách hàng cuối tuần');
    setF(r, 'Mục tiêu công việc', 'Go-live thành công');
    setF(r, 'Hiệu quả kỳ vọng', 'Không gián đoạn vận hành của khách hàng');
    setF(r, 'KPI hoặc sản phẩm công việc gắn kèm', 'Biên bản go-live');
    setF(r, 'Tài liệu đính kèm', ['ke-hoach-golive.pdf']);
    setT(r, 'Ngân sách OT', [{ 'Nhân viên': P[4], 'Từ': inDays(-3), 'Đến': inDays(-2), 'Loại tiền': 'VND', 'Số tiền': 3_000_000, 'Dự án': DUAN[0] }]);
  }, [P[0], P[2], P[6], P[1], P[9], P[12]], 1, 'rejected', 'Đề nghị bổ sung xác nhận lịch go-live của khách hàng.');

  // 11. Khen thưởng
  mk('QT-011', P[6], 2, (r) => {
    setF(r, 'Người đề xuất', [r.creator]);
    setF(r, 'Tên đợt khen thưởng', 'Khen thưởng dự án PRJ-001 về đích sớm');
    setF(r, 'Khối/Phòng ban', 'Khối Sản xuất (G2)');
    setF(r, 'Hình thức khen thưởng', 'Tiền mặt');
    setF(r, 'Tổng giá trị', 15_000_000);
    setF(r, 'Đối tượng khen thưởng', 'Cá nhân và tập thể');
    setF(r, 'Căn cứ', 'Quy chế khen thưởng hiện hành của công ty');
    setF(r, 'Lý do', 'Hoàn thành dự án trước hạn 2 tuần, khách hàng đánh giá tốt');
    setT(r, 'Danh sách khen thưởng', [{ 'Tên nhân viên/Phòng ban/Bộ phận': 'Nhóm dự án PRJ-001', 'Chức vụ': 'Tập thể', 'Số tiền': 10_000_000, 'Dự án': DUAN[0] }, { 'Tên nhân viên/Phòng ban/Bộ phận': P[4], 'Chức vụ': 'Quản lý dự án', 'Số tiền': 5_000_000, 'Dự án': DUAN[0] }]);
  }, [P[4], P[1], P[9], P[12], P[4]], 1);
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
