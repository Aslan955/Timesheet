/**
 * BusinessProjectContext — dữ liệu dùng chung cho module "Dự án kinh doanh" (PAKD).
 *
 * Luồng mới:
 *   1. Người dùng tạo dự án → khai báo THÔNG TIN DỰ ÁN (màn BusinessProjectPage).
 *   2. Import KẾ HOẠCH THEO THÁNG của dự án từ file Excel (`plan`) — mỗi tháng gồm
 *      Doanh thu dự kiến · Thu dự kiến · Chi dự kiến (tách SX / KD) · Khối lượng công việc.
 *   3. Kế toán import SỐ THỰC TẾ THEO THÁNG (`actual`) — cùng cấu trúc với kế hoạch.
 *   4. Kế toán import SỔ CHI TIẾT toàn công ty (`ledger`): Dòng tiền thu (sổ tiền gửi ngân hàng) và
 *      Chi thực tế (theo mã dự án). Mỗi dòng ghép vào dự án theo mã → cộng dồn thành Thu thực tế /
 *      Chi thực tế SX, KD, Chi phí chung của dự án trong tháng; bấm vào con số để xem các dòng chi tiết.
 *      Chi phí thực tế của dự án = Sản xuất + CP bán hàng + Chi phí chung (sổ Chi thực tế)
 *                                 + Chi phí quản lý (sổ Chi phí quản lý) + Chi phí phân bổ (sổ Chi phí vận hành).
 *   → Màn "Báo cáo hiệu quả dự án" so sánh kế hoạch vs thực tế (BizReportPage).
 *
 * Mã dự án: Master = <mã KH>.<số thứ tự 3 chữ số>, Mã KD = Master.1, Mã SX = Master.2.
 * Đơn vị tiền: VNĐ (cả thông tin dự án và kế hoạch theo tháng).
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PakdFormData, pakdMonthlyPlan, pakdTotals, syncContractToPakd } from './pakd';

export const DIVISIONS = ['G1', 'G2', 'G3', 'G4', 'BFSI', 'GPDV'];
export const PROJECT_TYPES = ['Fixed Cost', 'Time & Material', 'ODC', 'Cho thuê lao động', 'Nội bộ'];

/**
 * Vòng đời dự án:
 *   AM / SM (Giám đốc kinh doanh) / GĐK tạo dự án → Chờ duyệt mã → (GĐK duyệt → hệ thống sinh Mã dự án / KD / SX) → Chưa có PAKD
 *   (GĐK tự tạo → mã được cấp ngay, bỏ bước duyệt)
 *   → (lập & nộp PAKD trong PAKD_DAYS ngày) → PAKD chờ duyệt → (GĐ khối → Kế toán (CFO) → BOD duyệt → V1) → Đang thực hiện → Đóng (Kết thúc dự án)
 *   → (cấp mã bảo hành .3) → Bảo hành (lập PAKD bảo hành V(n+1), duyệt như bản đầu, không hạn 30 ngày) → Đang thực hiện (giai đoạn bảo hành) → Đóng.
 *   Bản ghi dự án IMIS của mã đang hoạt động theo trạng thái dự án (recordStatusOf); Đóng ⇒ Closed + Jira pending; mở lại ⇒ Jira reopen.
 * Chuỗi duyệt PAKD (mọi bản: đầu, điều chỉnh, bảo hành): Chờ GĐ khối → Chờ Kế toán → Chờ BOD → Đã duyệt.
 *   Lập = duyệt luôn bước của vai cao nhất (BOD ⇒ Đã duyệt; CFO ⇒ chờ BOD; GĐK ⇒ chờ CFO; SM / AM ⇒ chờ GĐ khối).
 *   Người duyệt sửa được bản đang ở chân mình ("Gửi" = duyệt bước đó). Từ chối (bắt buộc lý do) ⇒ cấp liền trước duyệt lại;
 *   GĐ khối từ chối ⇒ SM / AM sửa và gửi lại. BOD duyệt thẳng được bản đang chờ Kế toán.
 * Hết PAKD_DAYS ngày mà PAKD chưa qua bước Kế toán → tự động "Pending" (mở lại → hạn PAKD_DAYS ngày mới).
 * Dự án đã duyệt: bấm "Sửa" → sửa trực tiếp thông tin cơ bản trên màn chi tiết (AM / SM / GĐK); "Sửa PAKD" ngay trên khung PAKD → bản điều chỉnh đi lại chuỗi duyệt;
 *   mỗi lần BOD duyệt sinh phiên bản mới V2, V3…
 * Mã con: KD .1 · SX .2 · bảo hành [Mã tổng].3 (tối đa 1, chỉ khi Đóng, GĐK duyệt, không xoá) · outsource [Mã SX].1…5 (GĐK duyệt; số đã xoá được dùng lại).
 */
export type BizStatus = 'Chờ duyệt mã' | 'Chưa có PAKD' | 'PAKD chờ duyệt' | 'Reject' | 'Đang thực hiện' | 'Kết thúc' | 'Bảo hành' | 'Pending';
export const BIZ_STATUSES: BizStatus[] = ['Chờ duyệt mã', 'Chưa có PAKD', 'PAKD chờ duyệt', 'Reject', 'Đang thực hiện', 'Kết thúc', 'Bảo hành', 'Pending'];
/** Nhãn hiển thị — khoá 'Kết thúc' hiện là "Đóng" (giữ khoá cũ vì WorkflowDrawer / ProjectTracker so sánh literal). */
export const bizStatusLabel = (s: BizStatus) => (s === 'Kết thúc' ? 'Đóng' : s);
/** Dự án đã Đóng (không tính "Bảo hành" — đang lập / duyệt PAKD bảo hành). */
export const isProjectClosed = (p: Pick<BizProject, 'status'>) => p.status === 'Kết thúc';
/** Đã cấp mã bảo hành ⇒ dự án ở giai đoạn bảo hành (chạy trên mã .3). */
export const inWarrantyPhase = (p: Pick<BizProject, 'warranty'>) => p.warranty?.state === 'Đã cấp mã';
/** Bản ghi dự án KD / SX / outsource Closed: dự án Đóng / Bảo hành, hoặc đã sang giai đoạn bảo hành. */
export const mainCodesClosed = (p: Pick<BizProject, 'status' | 'warranty'>) => p.status === 'Kết thúc' || p.status === 'Bảo hành' || inWarrantyPhase(p);
/** Vai trò được tạo dự án / sửa thông tin cơ bản. */
export const canCreateProject = (role: BizRole) => role === 'AM' || role === 'SM' || role === 'GĐK';
/** Vai trò được lập PAKD (bản đầu, điều chỉnh, bảo hành) — trạng thái sau khi gửi theo vai cao nhất. */
export const canLapPakd = (role: BizRole) => role === 'AM' || role === 'SM' || role === 'GĐK' || role === 'CFO' || role === 'BOD';
/** Vai trò xem được khối PAKD: người lập + người duyệt. */
export const canViewPakd = canLapPakd;
/** Đã chốt 04/11: mở lại dự án Pending / Đóng như CanReopen — CFO, GĐKD (SM), GĐ khối (quản trị không có trong bộ chọn vai). */
export const canReopen = (role: BizRole) => role === 'CFO' || role === 'SM' || role === 'GĐK';
/** Đã chốt 04/11: dự án Pending khoá duyệt / từ chối / sửa / gửi PAKD — phải Mở lại trước. */
export const isPakdLocked = (p: Pick<BizProject, 'status'>) => p.status === 'Pending';
export const PAKD_LOCKED_TIP = 'Dự án đang Pending — Mở lại trước';
/** Số phiên bản PAKD kế tiếp = số bản đã được duyệt + 1 (V1, V2, V3… sinh khi BOD duyệt). */
export const nextPakdVersion = (p: Pick<BizProject, 'pakd'>) => p.pakd.filter((v) => v.state === 'Đã duyệt').length + 1;
/** Số ngày (kể từ ngày cấp mã / mở lại) để PAKD qua bước Kế toán, quá hạn → Pending. */
export const PAKD_DAYS = 30;
/** Chỉ xoá được dự án khi Giám đốc khối chưa duyệt (trạng thái "Chờ duyệt mã"). Đã duyệt / đã cấp mã thì không xoá được. */
export const canDeleteProject = (p: Pick<BizProject, 'status'>) => p.status === 'Chờ duyệt mã';

/** Vai trò trong quy trình (chưa có đăng nhập — chọn trên màn để thao tác thử). */
export type BizRole = 'AM' | 'GĐK' | 'SM' | 'PM' | 'CFO' | 'BOD';
export const BIZ_ROLES: { key: BizRole; label: string }[] = [
  { key: 'AM', label: 'AM (tạo yêu cầu cấp mã, lập PAKD)' },
  { key: 'SM', label: 'Giám đốc kinh doanh (SM)' },
  { key: 'GĐK', label: 'GĐK (duyệt mã, duyệt PAKD bước 1)' },
  { key: 'CFO', label: 'Kế toán (CFO)' },
  { key: 'BOD', label: 'BOD (duyệt PAKD bước cuối)' },
];

/** Bước duyệt PAKD: GĐ khối → Kế toán (CFO) → BOD. */
export type PakdStep = 'GĐK' | 'CFO' | 'BOD';
export const PAKD_STEP_LABEL: Record<PakdStep, string> = { GĐK: 'GĐ khối', CFO: 'Kế toán', BOD: 'BOD' };
/** 1 phiên bản PAKD nộp duyệt. */
export type PakdState = 'Chờ GĐK' | 'Chờ CFO' | 'Chờ BOD' | 'Đã duyệt' | 'Từ chối';
export interface PakdVersion {
  version: number;
  submittedAt: string; // YYYY-MM-DD
  submittedBy: string;
  state: PakdState;
  /** Bước đã từ chối (state = 'Từ chối'); thiếu ⇒ coi như GĐ khối từ chối. */
  rejectedStep?: PakdStep;
  decidedAt?: string; // ngày duyệt / từ chối cuối cùng
  decidedBy?: string;
  note?: string;
  /** Bản điều chỉnh PAKD sau khi dự án đã được duyệt. */
  adjust?: boolean;
  /** PAKD bảo hành — lập ở trạng thái "Bảo hành" sau khi cấp mã .3. */
  warranty?: boolean;
}
/** Vai trò được lập bản điều chỉnh PAKD khi dự án đang thực hiện. */
export const canAdjustPakd = canLapPakd;
export const latestPakd = (p: Pick<BizProject, 'pakd'>) => p.pakd[p.pakd.length - 1] as PakdVersion | undefined;
export const isPakdPending = (v?: PakdVersion) => v?.state === 'Chờ GĐK' || v?.state === 'Chờ CFO' || v?.state === 'Chờ BOD';
/** Bước đang chờ duyệt. */
const WAIT: Record<PakdStep, PakdState> = { GĐK: 'Chờ GĐK', CFO: 'Chờ CFO', BOD: 'Chờ BOD' };
export const pendingStep = (v?: PakdVersion): PakdStep | null => (v?.state === 'Chờ GĐK' ? 'GĐK' : v?.state === 'Chờ CFO' ? 'CFO' : v?.state === 'Chờ BOD' ? 'BOD' : null);
const rejectedStepOf = (v: PakdVersion): PakdStep => v.rejectedStep || 'GĐK';
const PREV_STEP: Record<PakdStep, PakdStep | null> = { GĐK: null, CFO: 'GĐK', BOD: 'CFO' };
/** Vai trò phải quyết định bản này: chờ bước X ⇒ X; bị trả về ⇒ cấp liền trước duyệt lại; GĐ khối từ chối ⇒ không ai (SM / AM sửa). */
export const pendingRole = (v?: PakdVersion): BizRole | null =>
  !v ? null : isPakdPending(v) ? pendingStep(v) : v.state === 'Từ chối' ? PREV_STEP[rejectedStepOf(v)] : null;
/** Bản bị trả về chờ cấp liền trước duyệt lại (BOD / Kế toán từ chối). */
export const isPakdReturned = (v?: PakdVersion) => v?.state === 'Từ chối' && !!PREV_STEP[rejectedStepOf(v)];
/** Được Duyệt / Từ chối: đúng vai đang chờ, hoặc BOD duyệt thẳng bản chờ Kế toán. */
export const canDecidePakd = (v: PakdVersion | undefined, role: BizRole) => !!v && (pendingRole(v) === role || (role === 'BOD' && v.state === 'Chờ CFO'));
/** Duyệt ⇒ trạng thái kế tiếp (bị trả về ⇒ quay lại chờ bước đã từ chối). */
export const pakdApproveTo = (v: PakdVersion, role: BizRole): PakdState =>
  v.state === 'Từ chối' ? WAIT[rejectedStepOf(v)] : v.state === 'Chờ GĐK' ? 'Chờ CFO' : v.state === 'Chờ CFO' && role !== 'BOD' ? 'Chờ BOD' : 'Đã duyệt';
/** Từ chối ⇒ bước ghi nhận từ chối (BOD từ chối bản chờ Kế toán tính là bước Kế toán). */
export const pakdRejectStep = (v: PakdVersion): PakdStep => (v.state === 'Từ chối' ? PREV_STEP[rejectedStepOf(v)] || 'GĐK' : pendingStep(v) || 'GĐK');
/** Lập / gửi lại = duyệt luôn bước của vai cao nhất. */
export const pakdEntryState = (role: BizRole): PakdState => (role === 'BOD' ? 'Đã duyệt' : role === 'CFO' ? 'Chờ BOD' : role === 'GĐK' ? 'Chờ CFO' : 'Chờ GĐK');
/** Sửa bản đang làm: chưa có ⇒ người lập; chờ bước X ⇒ vai X; bị trả về ⇒ cấp liền trước; GĐ khối từ chối ⇒ SM / AM. */
export const canEditPakdVersion = (v: PakdVersion | undefined, role: BizRole) =>
  !v ? canLapPakd(role) : v.state === 'Từ chối' && !isPakdReturned(v) ? role === 'SM' || role === 'AM' : (isPakdPending(v) || isPakdReturned(v)) && pendingRole(v) === role;
/** Người duyệt sửa ở chân mình ⇒ "Gửi" = duyệt bước đó (giữ bản, không thêm bản mới). */
export const isApproverEdit = (v: PakdVersion | undefined, role: BizRole) => !!v && (isPakdPending(v) || isPakdReturned(v)) && canEditPakdVersion(v, role);
/** Trạng thái sau khi bấm "Gửi". */
export const pakdSubmitTarget = (v: PakdVersion | undefined, role: BizRole): PakdState => (isApproverEdit(v, role) ? pakdApproveTo(v!, role) : pakdEntryState(role));
/** Nhãn trạng thái bản PAKD: "Chờ GĐ khối duyệt" / "Kế toán từ chối"… */
export const pakdStateLabel = (v?: PakdVersion) =>
  !v ? 'Chưa có PAKD' : isPakdPending(v) ? `Chờ ${PAKD_STEP_LABEL[pendingStep(v)!]} duyệt` : v.state === 'Từ chối' ? `${PAKD_STEP_LABEL[rejectedStepOf(v)]} từ chối` : v.state;
/** Nhãn đích sau khi gửi / duyệt. */
export const pakdTargetLabel = (s: PakdState) => pakdStateLabel({ state: s } as PakdVersion);
/** Bản đang chờ ai: "GĐ khối duyệt" / "Kế toán duyệt lại" / "SM / AM sửa và gửi lại". */
export const pakdWaitingText = (v?: PakdVersion) =>
  !v ? '' : isPakdPending(v) ? `${PAKD_STEP_LABEL[pendingStep(v)!]} duyệt` : isPakdReturned(v) ? `${PAKD_STEP_LABEL[pendingRole(v) as PakdStep]} duyệt lại` : v.state === 'Từ chối' ? 'SM / AM sửa và gửi lại' : '';
/** Bản PAKD đang làm của chu kỳ hiện tại (bản đầu / điều chỉnh / bảo hành chưa duyệt xong); không có ⇒ undefined. */
export const workingPakd = (p: Pick<BizProject, 'pakd' | 'status'>): PakdVersion | undefined => {
  const last = latestPakd(p);
  if (!last || last.state === 'Đã duyệt') return undefined;
  if (p.status === 'Bảo hành') return last.warranty ? last : undefined;
  if (p.status === 'Đang thực hiện') return last.adjust ? last : undefined;
  return p.status === 'Kết thúc' ? undefined : last;
};
/** Trạng thái dự án theo bản PAKD: đã duyệt ⇒ Đang thực hiện; bảo hành ⇒ Bảo hành; điều chỉnh ⇒ giữ Đang thực hiện; bản đầu ⇒ PAKD chờ duyệt / Reject. */
export const statusAfterPakd = (p: Pick<BizProject, 'status'>, v: PakdVersion): BizStatus =>
  v.state === 'Đã duyệt' || v.adjust ? 'Đang thực hiện' : v.warranty ? 'Bảo hành' : p.status === 'Pending' ? 'Pending' : v.state === 'Từ chối' ? 'Reject' : 'PAKD chờ duyệt';
/** Đã qua bước Kế toán: có bản đã duyệt, bản đang chờ BOD hoặc BOD từ chối. */
export const passedAccountant = (p: Pick<BizProject, 'pakd'>) => {
  const last = latestPakd(p);
  return p.pakd.some((v) => v.state === 'Đã duyệt') || last?.state === 'Chờ BOD' || (last?.state === 'Từ chối' && last.rejectedStep === 'BOD');
};

// ==========================================================================
// Sổ theo dõi dự án — giá trị hợp đồng ký so với mục tiêu năm của từng khối
// ==========================================================================
/** Mục tiêu giá trị hợp đồng ký theo năm → khối (VNĐ). */
export type SignTargets = Record<string, Record<string, number>>;
const SEED_TARGETS: SignTargets = {
  '2026': { G1: 1_500_000_000_000, G2: 70_000_000_000, G3: 20_000_000_000, G4: 150_000_000_000, BFSI: 500_000_000_000, GPDV: 2_000_000_000 },
};
/** Ngày ký HĐ: theo thông tin hợp đồng; dự án đã ký nhưng chưa nhập HĐ thì lấy ngày dự kiến ký / ngày bắt đầu. */
export const signedDate = (p: Pick<BizProject, 'contract' | 'contractSigned' | 'expectedSignDate' | 'startDate'>) =>
  p.contract?.signDate || (p.contractSigned ? p.expectedSignDate || p.startDate : '');
/** Giá trị HĐ đã ký: theo hợp đồng, chưa nhập HĐ thì lấy doanh thu dự kiến. */
export const signedValue = (p: Pick<BizProject, 'contract' | 'expectedRevenue'>) => p.contract?.value ?? p.expectedRevenue;

export interface BizHistory {
  at: string;
  by: string;
  action: string;
  note?: string;
}

/** Giai đoạn kế hoạch kinh doanh KH01 → KH05. */
export interface BizPhase {
  code: string; // KH01..KH05
  name: string;
  start: string; // YYYY-MM-DD
  end: string;
  objective: string;
  output: string;
  pic: string; // người phụ trách
}

export const DEFAULT_PHASES: Pick<BizPhase, 'code' | 'name' | 'objective' | 'output'>[] = [
  { code: 'KH01', name: 'Lập kế hoạch', objective: 'Xác định cơ hội, phạm vi sơ bộ', output: 'Kế hoạch tiếp cận khách hàng' },
  { code: 'KH02', name: 'Khảo sát & giải pháp', objective: 'Khảo sát yêu cầu, đề xuất giải pháp', output: 'Hồ sơ giải pháp kỹ thuật' },
  { code: 'KH03', name: 'Chào giá', objective: 'Lập dự toán, chào giá / dự thầu', output: 'Báo giá / hồ sơ dự thầu' },
  { code: 'KH04', name: 'Ký kết hợp đồng', objective: 'Đàm phán, ký hợp đồng', output: 'Hợp đồng đã ký' },
  { code: 'KH05', name: 'Triển khai HĐ', objective: 'Thực hiện HĐ', output: 'Nghiệm thu giai đoạn tổng thể Hợp đồng' },
];

export const blankPhases = (): BizPhase[] => DEFAULT_PHASES.map((p) => ({ ...p, start: '', end: '', pic: '' }));

/**
 * Số liệu 1 tháng của dự án (import từ Excel) — dùng chung cho KẾ HOẠCH và THỰC TẾ.
 * Tiền: VNĐ, KLCV: SP. Chỉ Chi tách theo dự án sản xuất (SX) / kinh doanh (KD);
 * Doanh thu, Thu (dòng tiền thu) và KLCV là 1 số của cả dự án.
 */
export type FinMetric = 'revenue' | 'cashIn' | 'costSx' | 'costKd' | 'workload';
export type FinKind = 'plan' | 'actual';
export const FIN_METRICS: Record<FinKind, { key: FinMetric; label: string }[]> = {
  plan: [
    { key: 'revenue', label: 'Doanh thu dự kiến' },
    { key: 'cashIn', label: 'Thu dự kiến' },
    { key: 'costSx', label: 'Chi dự kiến - SX' },
    { key: 'costKd', label: 'Chi dự kiến - KD' },
    { key: 'workload', label: 'Khối lượng công việc (SP)' },
  ],
  actual: [
    { key: 'revenue', label: 'Doanh thu thực tế' },
    { key: 'cashIn', label: 'Thu thực tế' },
    { key: 'costSx', label: 'Chi thực tế - SX' },
    { key: 'costKd', label: 'Chi thực tế - KD' },
    { key: 'workload', label: 'Khối lượng công việc thực tế (SP)' },
  ],
};
/**
 * 1 dòng số liệu tháng. Riêng số thực tế có thêm 2 khoản chi phí do Kế toán tính ngoài và import
 * theo dự án: costAlloc = chi phí vận hành (khối) phân bổ — sổ "Chi phí vận hành"; costMgmt = chi phí quản lý — sổ "Chi phí quản lý".
 * Chi phí thực tế của dự án = costSx + costKd + costChung (sổ Chi thực tế) + costAlloc + costMgmt — xem totalCost().
 */
export type BizMonthRow = {
  month: string; // YYYY-MM
  /** Chi phí chung thực tế (cột "Chi phí chung" của sổ Chi thực tế). Kế hoạch không có. */
  costChung?: number;
  costAlloc?: number;
  costMgmt?: number;
} & Record<FinMetric, number>;
/** Tổng chi phí 1 tháng = Chi SX + Chi KD + Chi phí chung + Chi phí quản lý + Chi phí phân bổ (kế hoạch chỉ có SX + KD). */
export const totalCost = (r: Pick<BizMonthRow, 'costSx' | 'costKd' | 'costChung' | 'costAlloc' | 'costMgmt'>) =>
  (r.costSx || 0) + (r.costKd || 0) + (r.costChung || 0) + (r.costMgmt || 0) + (r.costAlloc || 0);

export interface BizPlanImport {
  fileName: string;
  at: string;
  by: string;
}

// ==========================================================================
// Sổ chi tiết kế toán (toàn công ty)
// ==========================================================================
/** 1 dòng "Báo cáo dòng tiền thu trong kỳ" (sổ tiền gửi ngân hàng). */
export interface CashInEntry {
  id: string;
  /** Phiên bản import: mỗi lần import 1 file = 1 phiên bản (v1, v2…), các dòng trong file mang cùng số. */
  ver: number;
  date: string; // Ngày hạch toán YYYY-MM-DD
  month: string; // YYYY-MM (lấy theo ngày hạch toán)
  description: string; // Diễn giải
  amount: number; // Số tiền
  partner: string; // Tên đối tượng
  projectCode: string; // Mã công trình
  projectName: string; // Tên công trình
  unitCode: string; // Mã đơn vị
  unitName: string; // Tên đơn vị
}
/** 1 dòng "Chi thực tế" theo mã dự án. */
export interface CostEntry {
  id: string;
  ver: number;
  projectCode: string; // Mã dự án (Mã tổng / Mã SX / Mã PAKD)
  month: string; // YYYY-MM
  costSx: number; // Chi sản xuất (đ)
  costKd: number; // Chi kinh doanh (đ)
  costChung: number; // Chi phí chung (đ)
  note: string; // Ghi chú
}
/** 1 dòng sổ "Chi phí vận hành" / "Chi phí quản lý" theo mã dự án (Kế toán phân bổ bên ngoài rồi import): 1 số tiền. */
export interface AllocEntry {
  id: string;
  ver: number;
  projectCode: string;
  month: string; // YYYY-MM
  value: number; // Số tiền phân bổ cho dự án trong tháng (đ)
  note: string;
}
export type LedgerEntry = CashInEntry | CostEntry | AllocEntry;
/** 5 sổ chi tiết kế toán import: Doanh thu thực tế · Dòng tiền thu · Chi thực tế · Chi phí vận hành · Chi phí quản lý. */
export type LedgerKind = 'revenue' | 'cashIn' | 'cost' | 'opex' | 'mgmt';
export const LEDGER_LABEL: Record<LedgerKind, string> = { revenue: 'Doanh thu thực tế', cashIn: 'Dòng tiền thu', cost: 'Chi thực tế', opex: 'Chi phí vận hành', mgmt: 'Chi phí quản lý' };
/** Sổ dạng "theo mã dự án + tháng" (không có ngày hạch toán): Chi thực tế (2 cột tiền), Chi phí vận hành / quản lý (1 cột tiền). */
export const isCostLike = (k: LedgerKind) => k === 'cost' || k === 'opex' || k === 'mgmt';
/** Các cột tiền của 1 dòng sổ: [Số tiền, 0, 0] (doanh thu / thu / vận hành / quản lý) · [Chi SX, Chi KD, Chi phí chung]. */
export const entryAmounts = (e: LedgerEntry): [number, number, number] =>
  'amount' in e ? [e.amount, 0, 0] : 'value' in e ? [e.value, 0, 0] : [e.costSx, e.costKd, e.costChung || 0];
export const entryTotal = (e: LedgerEntry) => entryAmounts(e).reduce((a, b) => a + b, 0);
export interface LedgerImportLog {
  kind: LedgerKind;
  ver: number;
  fileName: string;
  months: string[];
  lines: number;
  at: string;
  by: string;
}
export interface Ledger {
  /** "Báo cáo doanh thu phát sinh trong kỳ" (sổ chi tiết tài khoản) — cùng cột với dòng tiền thu, không có Mã / Tên đơn vị. */
  revenue: CashInEntry[];
  cashIn: CashInEntry[];
  cost: CostEntry[];
  opex: AllocEntry[];
  mgmt: AllocEntry[];
  imports: LedgerImportLog[];
}

/** Các mã nhận diện 1 dự án trong sổ kế toán: Mã tổng, Mã PAKD (.1), Mã SX (.2), Mã bảo hành (.3, khi đã được cấp). */
// Mã ghép sổ kế toán: KD / SX / bảo hành + mã outsource đã có hiệu lực (kể cả đã xoá mềm — như code thật).
export const projectCodes = (p: Pick<BizProject, 'masterCode' | 'businessCode' | 'productionCode' | 'warranty' | 'outsourceCodes'>) =>
  [
    p.masterCode,
    p.businessCode,
    p.productionCode,
    p.warranty?.code || '',
    ...(p.outsourceCodes || []).filter((o) => o.state === 'Có hiệu lực').map((o) => o.code),
  ].map((c) => (c || '').trim().toLowerCase()).filter(Boolean);
export const matchProject = (projects: BizProject[], code: string) => {
  const c = code.trim().toLowerCase();
  return c ? projects.find((p) => projectCodes(p).includes(c)) : undefined;
};

/** Danh sách tháng YYYY-MM từ ngày bắt đầu → ngày kết thúc (tính cả 2 đầu). */
export const monthsBetween = (start: string, end: string): string[] => {
  if (!start || !end || end < start) return [];
  const out: string[] = [];
  let y = +start.slice(0, 4);
  let m = +start.slice(5, 7);
  const ey = +end.slice(0, 4);
  const em = +end.slice(5, 7);
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    if (++m > 12) {
      m = 1;
      y++;
    }
  }
  return out;
};

export const sumRows = (rows: BizMonthRow[], k: FinMetric) => rows.reduce((s, r) => s + (r[k] || 0), 0);

/** Tháng "chốt số" = tháng mới nhất có số thực tế (rỗng nếu chưa có). */
export const latestActualMonth = (projects: Pick<BizProject, 'actual'>[]) =>
  projects.reduce((m, p) => p.actual.reduce((mm, r) => (r.month > mm ? r.month : mm), m), '');

export interface BizProject {
  id: string;
  name: string;
  isKey: boolean;
  version: number;
  status: BizStatus;

  masterCode: string;
  businessCode: string;
  productionCode: string;
  businessPm: string;
  productionPm: string;
  /** Mã outsource (tối đa MAX_OUTSOURCE mã chưa xoá): Mã SX.1…5 — mỗi mã có nội dung thuê ngoài + PM phụ trách. */
  outsourceCodes?: BizOutsource[];
  /** Trạng thái đẩy Jira theo mã (mã có hiệu lực ⇒ sinh dự án + Jira); thiếu ⇒ "Đã tạo". */
  jira?: Record<string, JiraState>;
  /** PM outsource (chọn khi tạo dự án) — gán mặc định cho mã outsource khi được tạo. */
  outsourcePm?: string;
  /** Mã bảo hành (tối đa 1, Mã tổng.3) — yêu cầu → GĐK duyệt cấp mã. */
  warranty?: BizWarranty;

  division: string;
  projectType: string;
  customerName: string;
  customerCode: string;
  businessDirector: string;
  salesDirector: string;
  creator: string;
  am: string[];
  startDate: string; // YYYY-MM-DD
  endDate: string;

  expectedRevenue: number;
  plannedBusinessCost: number;
  plannedProductionCost: number;
  contractSigned: boolean;
  expectedSignDate?: string; // Thời điểm dự kiến ký HĐ
  codeIssuedAt?: string; // YYYY-MM-DD — ngày cấp mã (GĐK duyệt / GĐK tự tạo)
  pakdDeadline?: string; // Hạn lập PAKD = ngày cấp mã (hoặc mở lại) + PAKD_DAYS
  closedAt?: string; // YYYY-MM-DD — ngày dự án chuyển Pending / Đóng
  pakdForm?: PakdFormData; // Nội dung PAKD lập trên hệ thống (AM / GĐK nhập trong hạn PAKD_DAYS ngày)
  pakdDraft?: PakdFormData; // Bản điều chỉnh PAKD (GĐK / SM sửa khi dự án đang thực hiện) — nháp / chờ Kế toán duyệt
  pakd: PakdVersion[]; // các phiên bản PAKD đã nộp
  contract?: BizContract; // thông tin ký hợp đồng (cập nhật trên màn chi tiết)
  attachments?: BizAttachment[]; // tài liệu đính kèm của dự án (PAKD, báo giá, biên bản…)
  note?: string;

  phases: BizPhase[];
  currentPhase: string; // code của giai đoạn hiện tại

  plan: BizMonthRow[];
  planImport?: BizPlanImport;
  actual: BizMonthRow[]; // kế toán import
  actualImport?: BizPlanImport;
  createdAt: string;
  updatedAt: string;
  history: BizHistory[];
}

export type BizProjectInput = Omit<
  BizProject,
  'id' | 'version' | 'plan' | 'planImport' | 'actual' | 'actualImport' | 'contract' | 'attachments' | 'pakd' | 'createdAt' | 'updatedAt' | 'history'
>;

// ==========================================================================
// Hợp đồng (Cập nhật ký hợp đồng)
// ==========================================================================
/** Tệp đính kèm — lưu tạm trong phiên làm việc (url = object URL của trình duyệt). */
export interface BizAttachment {
  id: string;
  name: string;
  size: number;
  url?: string;
}
/** Phụ lục điều chỉnh hợp đồng. */
export interface BizAddendum {
  id: string;
  number: string; // Số phụ lục
  signDate: string; // Ngày ký
  content: string; // Nội dung điều chỉnh
  files: BizAttachment[]; // File phụ lục
}
export interface BizContract {
  number: string; // Số hợp đồng
  signDate: string; // Ngày ký
  value: number; // Giá trị hợp đồng (VNĐ)
  from: string; // Thời hạn thực hiện — từ
  to: string; // — đến
  deviationReason: string; // Lý do lệch so với giá trị đã khai báo (Doanh thu dự kiến)
  files: BizAttachment[]; // Hợp đồng và các tài liệu đính kèm
  addenda: BizAddendum[];
  updatedAt: string;
  updatedBy: string;
}

export const plannedCost = (p: Pick<BizProject, 'plannedBusinessCost' | 'plannedProductionCost'>) =>
  (p.plannedBusinessCost || 0) + (p.plannedProductionCost || 0);
export const grossProfit = (p: Pick<BizProject, 'expectedRevenue' | 'plannedBusinessCost' | 'plannedProductionCost'>) =>
  (p.expectedRevenue || 0) - plannedCost(p);
export const grossMargin = (p: Pick<BizProject, 'expectedRevenue' | 'plannedBusinessCost' | 'plannedProductionCost'>) =>
  p.expectedRevenue ? (grossProfit(p) / p.expectedRevenue) * 100 : 0;

/** Gợi ý mã Master tiếp theo cho mã khách hàng (số thứ tự lớn nhất + 1). */
/** Mã KD = Master.1, Mã SX = Master.2, Mã bảo hành = Master.3, Mã outsource = Mã SX.1…5. */
export type JiraState = 'Đã tạo' | 'Đang gửi';
export const jiraOf = (p: Pick<BizProject, 'jira'>, code: string): JiraState => p.jira?.[code] || 'Đã tạo';
/** Trạng thái mã outsource: GĐK tạo ⇒ có hiệu lực ngay; vai khác tạo ⇒ chờ GĐK duyệt. */
export type OutsourceState = 'Chờ HOD duyệt' | 'Có hiệu lực' | 'Từ chối';
export interface BizOutsource {
  code: string;
  /** Nội dung thuê ngoài (bắt buộc). */
  content: string;
  pm: string;
  state: OutsourceState;
  createdAt: string;
  createdBy: string;
  decidedAt?: string;
  decidedBy?: string;
  rejectReason?: string;
  /** Xoá mềm — số được trả lại cho mã mới. */
  deletedAt?: string;
  deletedBy?: string;
}
/** Số mã outsource tối đa (chưa xoá, kể cả chờ duyệt / từ chối) của một dự án. */
export const MAX_OUTSOURCE = 5;
/** Mã outsource chưa xoá (gồm Chờ duyệt / Từ chối). */
export const liveOutsource = (p: Pick<BizProject, 'outsourceCodes'>) => (p.outsourceCodes || []).filter((o) => !o.deletedAt);
export const pendingOutsource = (p: Pick<BizProject, 'outsourceCodes'>) => liveOutsource(p).filter((o) => o.state === 'Chờ HOD duyệt');
/** Điều kiện tạo mã outsource: dự án đã có mã, mã KD / SX chưa Closed. */
export const canRequestOutsource = (p: Pick<BizProject, 'productionCode' | 'status' | 'warranty'>) => !!p.productionCode && p.status !== 'Chờ duyệt mã' && !mainCodesClosed(p);
/** Mã outsource kế tiếp = Mã SX.N, N nhỏ nhất còn trống trong 1..MAX_OUTSOURCE (mã từ chối vẫn chiếm số, mã đã xoá trả số). */
export const nextOutsourceCode = (p: Pick<BizProject, 'productionCode' | 'status' | 'warranty' | 'outsourceCodes'>) => {
  if (!canRequestOutsource(p)) return '';
  const used = new Set(liveOutsource(p).map((o) => o.code));
  for (let i = 1; i <= MAX_OUTSOURCE; i++) if (!used.has(`${p.productionCode}.${i}`)) return `${p.productionCode}.${i}`;
  return '';
};

/** Trạng thái mã bảo hành: chờ GĐK duyệt → đã cấp mã (không xoá được); bị từ chối thì ô tích về trống. */
export type WarrantyState = 'Chờ HOD duyệt' | 'Đã cấp mã' | 'Từ chối';
export interface BizWarranty {
  state: WarrantyState;
  /** Mã đã cấp (Mã tổng.3); rỗng khi chưa cấp. */
  code: string;
  /** PM bảo hành — trống ⇒ mặc định Giám đốc khối của dự án. */
  pm: string;
  requestedAt: string;
  requestedBy: string;
  decidedAt?: string;
  decidedBy?: string;
  rejectReason?: string;
  /** Ngày KD / SX / outsource Closed (lần Kết thúc trước khi cấp .3) — Projects.ClosedDate của các mã đó, giữ khi .3 đóng / mở lại. */
  mainClosedAt?: string;
}
/** Mã bảo hành cố định = Mã tổng.3. */
export const warrantyCodeOf = (master: string) => (master ? `${master}.3` : '');
/** Ô "Tạo mã bảo hành" đang tích (khoá, không bỏ tích): có yêu cầu chờ duyệt hoặc đã cấp mã. */
export const warrantyActive = (w?: BizWarranty) => w?.state === 'Chờ HOD duyệt' || w?.state === 'Đã cấp mã';
/** Điều kiện tạo mã bảo hành: dự án đã có mã và đang Đóng (KD / SX / outsource đã Closed). */
export const canRequestWarranty = (p: Pick<BizProject, 'masterCode' | 'status'>) => !!p.masterCode && p.status === 'Kết thúc';

/** Trạng thái bản ghi dự án (IMIS project) của 1 mã. */
export type CodeRecordStatus = 'Open' | 'In Progress' | 'On-hold' | 'Closed';
/** Đã chốt 04/11: ánh xạ trạng thái dự án kinh doanh ⇒ trạng thái bản ghi dự án IMIS của mã đang hoạt động. */
export const recordStatusOf = (s: BizStatus): CodeRecordStatus => (s === 'Đang thực hiện' ? 'In Progress' : s === 'Kết thúc' ? 'Closed' : s === 'Pending' ? 'On-hold' : 'Open');
/** Mã đang hoạt động (xem lifecycleCodes) theo recordStatusOf; giai đoạn bảo hành ⇒ KD / SX / outsource giữ Closed. */
export const codeRecordStatus = (p: Pick<BizProject, 'status' | 'warranty'>, code: string): CodeRecordStatus =>
  inWarrantyPhase(p) && code !== p.warranty!.code ? 'Closed' : recordStatusOf(p.status);
/** Projects.ClosedDate của 1 mã (D39): mã Closed ⇒ ngày đóng; KD / SX / outsource giai đoạn bảo hành ⇒ ngày Kết thúc trước khi cấp .3. */
export const codeClosedDate = (p: Pick<BizProject, 'status' | 'warranty' | 'closedAt'>, code: string) =>
  codeRecordStatus(p, code) !== 'Closed' ? undefined : inWarrantyPhase(p) && code !== p.warranty!.code ? p.warranty!.mainClosedAt ?? p.closedAt : p.closedAt;
/** Ghi chú lịch sử "Mã IMIS: {mã} ⇒ {trạng thái}" khi đổi trạng thái dự án làm đổi bản ghi mã; không đổi ⇒ ''. */
export const recordChangeNote = (before: BizProject, after: BizProject) => {
  const codes = lifecycleCodes(after);
  if (!codes.length || before.status === after.status) return '';
  const st = recordStatusOf(after.status);
  return lifecycleCodes(before).join() === codes.join() && recordStatusOf(before.status) === st ? '' : `Mã IMIS: ${codes.join(', ')} ⇒ ${st}`;
};
/** Mã đóng / mở lại cùng dự án: giai đoạn bảo hành ⇒ chỉ mã .3; còn lại KD, SX, outsource có hiệu lực. */
export const lifecycleCodes = (p: Pick<BizProject, 'businessCode' | 'productionCode' | 'outsourceCodes' | 'warranty'>) =>
  inWarrantyPhase(p) ? [p.warranty!.code] : [p.businessCode, p.productionCode, ...liveOutsource(p).filter((o) => o.state === 'Có hiệu lực').map((o) => o.code)].filter(Boolean);
/** Vai trò được tạo / xoá mã con (outsource, bảo hành): SM / GĐK / Kế toán; AM chỉ xem. */
export const canManageSubCodes = (role: BizRole) => role === 'SM' || role === 'GĐK' || role === 'CFO';

export const codesFrom = (master: string) => ({ masterCode: master, businessCode: master ? `${master}.1` : '', productionCode: master ? `${master}.2` : '' });

export const nextMasterCode = (projects: BizProject[], customerCode: string) => {
  const cc = customerCode.trim();
  if (!cc) return '';
  const max = projects
    .filter((p) => p.masterCode.startsWith(cc + '.'))
    .map((p) => parseInt(p.masterCode.slice(cc.length + 1), 10))
    .filter((n) => !isNaN(n))
    .reduce((m, n) => Math.max(m, n), 0);
  return `${cc}.${String(max + 1).padStart(3, '0')}`;
};

const now = () => new Date().toISOString();

const seedPhases = (rows: [string, string, string][]): BizPhase[] =>
  DEFAULT_PHASES.map((p, i) => ({ ...p, start: rows[i][0], end: rows[i][1], pic: rows[i][2] }));

// Rải đều tổng cho n tháng (tiền làm tròn tới triệu VNĐ), phần dư dồn vào tháng cuối để tổng khớp tuyệt đối.
const spread = (total: number, n: number, unit = total >= 100_000_000 ? 1_000_000 : 1) => {
  const each = Math.floor(total / n / unit) * unit;
  return Array.from({ length: n }, (_, i) => (i === n - 1 ? total - each * (n - 1) : each));
};
// Kế hoạch mẫu: rải đều theo tháng; thu tiền về trễ 1 tháng so với doanh thu.
const seedPlan = (start: string, end: string, rev: number, costSx: number, costKd: number, sp: number): BizMonthRow[] => {
  const months = monthsBetween(start, end);
  const n = months.length;
  const r = spread(rev, n);
  const cSx = spread(costSx, n);
  const cKd = spread(costKd, n);
  const w = spread(sp, n, 10_000); // KLCV làm tròn tới 10.000
  return months.map((month, i) => ({
    month,
    revenue: r[i],
    cashIn: i === 0 ? 0 : r[i - 1] + (i === n - 1 ? r[i] : 0),
    costSx: cSx[i],
    costKd: cKd[i],
    workload: w[i],
  }));
};

// Số thực tế mẫu đến tháng chốt: = kế hoạch × tỷ lệ thực hiện, dao động nhẹ theo tháng.
const SEED_CUTOFF = '2026-08';
type Ratios = { revenue: number; cashIn: number; cost: number; workload: number };
const seedActual = (plan: BizMonthRow[], k: Ratios): BizMonthRow[] =>
  plan
    .filter((r) => r.month <= SEED_CUTOFF)
    .map((r, i) => {
      const wave = (x: number) => Math.round((x * (1 + 0.06 * Math.sin(i * 1.7 + 1))) / 1000) * 1000;
      return {
        month: r.month,
        revenue: wave(r.revenue * k.revenue),
        cashIn: wave(r.cashIn * k.cashIn),
        costSx: wave(r.costSx * k.cost),
        costKd: wave(r.costKd * k.cost),
        costChung: wave(r.costSx * k.cost * 0.04), // chi phí chung ≈ 4% chi SX (điện nước, thuê VP, văn phòng phẩm)
        // Kế toán tính ngoài và import theo dự án: CP vận hành khối phân bổ ≈ 3%, CP quản lý ≈ 2% chi trực tiếp
        costAlloc: Math.round((wave(r.costSx * k.cost) + wave(r.costKd * k.cost)) * 0.03 / 1000) * 1000,
        costMgmt: Math.round((wave(r.costSx * k.cost) + wave(r.costKd * k.cost)) * 0.02 / 1000) * 1000,
        workload: Math.round((r.workload * k.workload) / 10_000) * 10_000,
      };
    });

/** Cộng n ngày vào ngày YYYY-MM-DD. */
export const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Dự án mẫu phục vụ báo cáo — các khối khác nhau, tỷ lệ thực hiện khác nhau.
const seedProject = (
  id: string,
  name: string,
  masterCode: string,
  division: string,
  customer: string,
  start: string,
  end: string,
  money: [revenue: number, costSx: number, costKd: number, workload: number],
  k: Ratios,
  pm: [business: string, production: string],
): BizProject => {
  const [rev, costSx, costKd, sp] = money;
  const plan = seedPlan(start, end, rev, costSx, costKd, sp);
  const at = `${start}T08:00:00.000Z`;
  const importedAt = '2026-09-05T09:00:00.000Z';
  return {
    id,
    name,
    isKey: false,
    version: 3,
    status: 'Đang thực hiện',
    expectedSignDate: start,
    pakd: [{ version: 1, submittedAt: addDays(start, -20), submittedBy: pm[0], state: 'Đã duyệt', decidedAt: addDays(start, -12), decidedBy: 'BOD' }],
    masterCode,
    businessCode: `${masterCode}.1`,
    productionCode: `${masterCode}.2`,
    businessPm: pm[0],
    productionPm: pm[1],
    division,
    projectType: 'Fixed Cost',
    customerName: customer,
    customerCode: masterCode.split('.')[0],
    businessDirector: pm[0],
    salesDirector: pm[0],
    creator: 'namnv',
    am: [pm[0]],
    startDate: start,
    endDate: end,
    expectedRevenue: rev,
    plannedBusinessCost: costKd,
    plannedProductionCost: costSx,
    contractSigned: true,
    contract: {
      number: `HĐ-${masterCode.replace('.', '/')}/2026`,
      signDate: start,
      value: rev,
      from: start,
      to: end,
      deviationReason: '',
      files: [
        {
          id: `file-${masterCode}`,
          name: `HopDong_${masterCode}.pdf`,
          size: 2150000,
        },
      ],
      addenda: [],
      updatedAt: at,
      updatedBy: 'namnv',
    },
    phases: blankPhases(),
    currentPhase: 'KH05',
    plan,
    planImport: { fileName: `KeHoach_${masterCode}.xlsx`, at, by: 'namnv' },
    actual: seedActual(plan, k),
    actualImport: { fileName: `ThucTe_${masterCode}_T08-2026.xlsx`, at: importedAt, by: 'ketoan' },
    createdAt: at,
    updatedAt: importedAt,
    history: [
      { at, by: 'namnv', action: 'Tạo dự án', note: 'Version 1' },
      { at, by: 'namnv', action: 'Import kế hoạch', note: `KeHoach_${masterCode}.xlsx · Version 2` },
      { at: importedAt, by: 'ketoan', action: 'Import thực tế', note: `ThucTe_${masterCode}_T08-2026.xlsx · Version 3` },
    ],
  };
};

// Dự án seed + ghi đè trường + lịch sử bổ sung.
const seedWith = (p: BizProject, extra: Partial<BizProject>, more: BizHistory[] = []): BizProject => ({ ...p, ...extra, history: [...p.history, ...more] });

// Lịch sử Kết thúc dự án: Đóng + Closed các mã + Jira pending.
const closeHistory = (at: string, by: string, codes: string[]): BizHistory[] => [
  { at, by, action: 'Kết thúc dự án', note: `Dự án ⇒ Đóng · Mã IMIS: ${codes.join(', ')} ⇒ Closed` },
  { at, by: 'Hệ thống', action: 'Đồng bộ Jira', note: `Đã gửi Jira pending: mã ${codes.join(', ')}` },
];
// Lịch sử cấp mã bảo hành: .3 Open + Jira create + dự án chuyển Bảo hành + nháp PAKD bảo hành V(n+1).
const issueHistory = (at: string, by: string, code: string, pm: string, v: number): BizHistory[] => [
  { at, by, action: 'Duyệt mã bảo hành', note: `${code} · PM ${pm || '—'} · Dự án ⇒ Bảo hành · Mã IMIS: ${code} ⇒ Open` },
  { at, by: 'Hệ thống', action: 'Đồng bộ Jira', note: `Đã gửi Jira create: mã ${code}` },
  { at, by: 'Hệ thống', action: 'Tạo PAKD bảo hành', note: `V${v} Nháp — chép từ bản áp dụng V${v - 1} · không áp hạn ${PAKD_DAYS} ngày` },
];

const SEED: BizProject[] = [
  {
    id: 'BP-1',
    name: '022.NSG',
    isKey: true,
    version: 2,
    status: 'PAKD chờ duyệt',
    expectedSignDate: '2026-11-15',
    pakdDeadline: '2026-09-30',
    pakd: [{ version: 1, submittedAt: '2026-09-29', submittedBy: 'Nguyễn Đằng Giang', state: 'Chờ CFO' }],
    masterCode: '022.688',
    businessCode: '022.688.1',
    productionCode: '022.688.2',
    businessPm: 'Nguyễn Đằng Giang',
    productionPm: 'Phạm Hữu Trường',
    division: 'G1',
    projectType: 'Fixed Cost',
    customerName: '022',
    customerCode: '022',
    businessDirector: 'Lê Hoài Thanh',
    salesDirector: 'Lê Hoài Thanh',
    creator: '',
    am: ['Nguyễn Đằng Giang', 'Nguyễn Thị Huyền'],
    startDate: '2026-12-01',
    endDate: '2028-12-12',
    expectedRevenue: 145_000_000_000,
    plannedBusinessCost: 18_966_430_357,
    plannedProductionCost: 48_371_000_000,
    contractSigned: false,
    phases: seedPhases([
      ['2026-01-12', '2026-03-31', 'Phạm Hữu Trường'],
      ['2026-04-01', '2026-06-30', 'Nguyễn Đằng Giang'],
      ['2026-07-01', '2026-08-31', 'Lê Hoài Thanh'],
      ['2026-09-01', '2026-11-30', 'Nguyễn Thị Huyền'],
      ['2026-12-01', '2027-12-01', 'Phạm Hữu Trường'],
    ]),
    currentPhase: 'KH05',
    plan: seedPlan('2026-12-01', '2028-12-12', 145_000_000_000, 48_371_000_000, 18_966_430_357, 120_000_000),
    planImport: { fileName: 'KeHoach_022.688.xlsx', at: '2026-09-15T10:30:00.000Z', by: 'namnv' },
    actual: [],
    createdAt: '2026-09-01T09:00:00.000Z',
    updatedAt: '2026-09-15T10:30:00.000Z',
    history: [
      { at: '2026-09-01T09:00:00.000Z', by: 'namnv', action: 'Tạo dự án', note: 'Version 1' },
      { at: '2026-09-15T10:30:00.000Z', by: 'namnv', action: 'Cập nhật', note: 'Version 2' },
    ],
  },
  {
    id: 'BP-2',
    name: 'Hệ thống giám sát dữ liệu tập trung',
    isKey: false,
    version: 1,
    status: 'Đang thực hiện',
    expectedSignDate: '2026-02-25',
    pakd: [{ version: 1, submittedAt: '2026-02-10', submittedBy: 'Trần Minh Đức', state: 'Đã duyệt', decidedAt: '2026-02-18', decidedBy: 'BOD' }],
    masterCode: '038.360',
    businessCode: '038.360.1',
    productionCode: '038.360.2',
    businessPm: 'Trần Minh Đức',
    productionPm: 'Vũ Thị Lan',
    division: 'G3',
    projectType: 'Time & Material',
    customerName: 'Tổng công ty 038',
    customerCode: '038',
    businessDirector: 'Đỗ Quang Huy',
    salesDirector: 'Hoàng Văn Nam',
    creator: 'namnv',
    am: ['Trần Minh Đức'],
    startDate: '2026-03-01',
    endDate: '2027-02-28',
    expectedRevenue: 12_500_000_000,
    plannedBusinessCost: 1_200_000_000,
    plannedProductionCost: 7_800_000_000,
    contractSigned: true,
    contract: {
      number: 'HĐ-038/2026/TM',
      signDate: '2026-02-25',
      value: 12_500_000_000,
      from: '2026-03-01',
      to: '2027-02-28',
      deviationReason: '',
      files: [
        {
          id: 'file-038',
          name: 'HopDong_038.360.pdf',
          size: 1850000,
        },
      ],
      addenda: [],
      updatedAt: '2026-02-25T09:00:00.000Z',
      updatedBy: 'namnv',
    },
    phases: seedPhases([
      ['2025-10-01', '2025-11-15', 'Trần Minh Đức'],
      ['2025-11-16', '2025-12-31', 'Vũ Thị Lan'],
      ['2026-01-02', '2026-01-31', 'Hoàng Văn Nam'],
      ['2026-02-01', '2026-02-28', 'Đỗ Quang Huy'],
      ['2026-03-01', '2027-02-28', 'Vũ Thị Lan'],
    ]),
    currentPhase: 'KH05',
    plan: seedPlan('2026-03-01', '2027-02-28', 12_500_000_000, 7_800_000_000, 1_200_000_000, 30_000_000),
    planImport: { fileName: 'KeHoach_038.360.xlsx', at: '2026-02-20T08:00:00.000Z', by: 'namnv' },
    actual: seedActual(seedPlan('2026-03-01', '2027-02-28', 12_500_000_000, 7_800_000_000, 1_200_000_000, 30_000_000), {
      revenue: 0.96,
      cashIn: 0.9,
      cost: 1.04,
      workload: 0.95,
    }),
    actualImport: { fileName: 'ThucTe_038.360_T08-2026.xlsx', at: '2026-09-05T09:00:00.000Z', by: 'ketoan' },
    createdAt: '2026-02-20T08:00:00.000Z',
    updatedAt: '2026-02-20T08:00:00.000Z',
    history: [{ at: '2026-02-20T08:00:00.000Z', by: 'namnv', action: 'Tạo dự án', note: 'Version 1' }],
  },
  {
    id: 'BP-3',
    name: 'Core Banking Mobile Upgrade',
    isKey: true,
    version: 1,
    status: 'Chưa có PAKD',
    expectedSignDate: '2026-10-20',
    pakdDeadline: '2026-10-03',
    pakd: [],
    masterCode: '010.541',
    businessCode: '010.541.1',
    productionCode: '010.541.2',
    businessPm: 'Lý Thu Hà',
    productionPm: 'Ngô Bá Khá',
    division: 'BFSI',
    projectType: 'Fixed Cost',
    customerName: 'Ngân hàng 010',
    customerCode: '010',
    businessDirector: 'Phan Anh Tuấn',
    salesDirector: 'Phan Anh Tuấn',
    creator: 'namnv',
    am: ['Lý Thu Hà', 'Mai Văn Tùng'],
    startDate: '2026-10-01',
    endDate: '2027-09-30',
    expectedRevenue: 38_000_000_000,
    plannedBusinessCost: 4_100_000_000,
    plannedProductionCost: 21_600_000_000,
    contractSigned: false,
    phases: seedPhases([
      ['2026-06-01', '2026-07-15', 'Lý Thu Hà'],
      ['2026-07-16', '2026-08-31', 'Ngô Bá Khá'],
      ['2026-09-01', '2026-10-15', 'Phan Anh Tuấn'],
      ['2026-10-16', '2026-10-31', 'Mai Văn Tùng'],
      ['2026-11-01', '2027-09-30', 'Ngô Bá Khá'],
    ]),
    currentPhase: 'KH03',
    plan: [],
    actual: [],
    createdAt: '2026-09-25T14:00:00.000Z',
    updatedAt: '2026-09-25T14:00:00.000Z',
    history: [{ at: '2026-09-25T14:00:00.000Z', by: 'namnv', action: 'Tạo dự án', note: 'Version 1' }],
  },
  // prettier-ignore
  ...[
    seedWith(
      seedProject('BP-4', 'Nền tảng chuyển đổi số quốc gia', '022.061', 'G1', 'Bộ 022', '2026-01-01', '2027-12-31', [1_000_000_000_000, 520_000_000_000, 90_000_000_000, 2_400_000_000], { revenue: 1.02, cashIn: 0.97, cost: 0.92, workload: 1 }, ['Nguyễn Đằng Giang', 'Phạm Hữu Trường']),
      {
        outsourceCodes: [{ code: '022.061.2.1', content: 'Thuê ngoài kiểm thử hiệu năng', pm: 'Phạm Hữu Trường', state: 'Có hiệu lực', createdAt: '2026-03-10T08:00:00.000Z', createdBy: 'Nguyễn Đằng Giang (GĐK)', decidedAt: '2026-03-10T08:00:00.000Z', decidedBy: 'Nguyễn Đằng Giang (GĐK)' }],
        jira: { '022.061.2.1': 'Đang gửi' },
      },
      [{ at: '2026-03-10T08:00:00.000Z', by: 'Nguyễn Đằng Giang (GĐK)', action: 'Tạo mã outsource', note: '022.061.2.1 · PM Phạm Hữu Trường · Nội dung: Thuê ngoài kiểm thử hiệu năng · Có hiệu lực' }],
    ),
    seedProject('BP-5', 'ERP Tập đoàn 022', '022.070', 'G1', 'Tập đoàn 022', '2026-01-01', '2027-06-30', [250_000_000_000, 150_000_000_000, 25_000_000_000, 600_000_000], { revenue: 0.78, cashIn: 0.6, cost: 1.12, workload: 0.85 }, ['Lê Hoài Thanh', 'Nguyễn Thị Huyền']),
    seedProject('BP-6', 'Hệ thống bán lẻ đa kênh', '045.112', 'G2', 'Bán lẻ 045', '2026-02-01', '2026-12-31', [48_000_000_000, 27_500_000_000, 5_100_000_000, 110_000_000], { revenue: 0.9, cashIn: 0.8, cost: 1.05, workload: 0.92 }, ['Bùi Quang Minh', 'Đặng Thu Trang']),
    // Demo: dự án Đóng, yêu cầu mã bảo hành đang chờ GĐK duyệt
    seedWith(
      seedProject('BP-7', 'Data Lake phân tích khách hàng', '045.118', 'G2', 'Bán lẻ 045', '2026-01-01', '2026-10-31', [6_500_000_000, 3_400_000_000, 650_000_000, 15_000_000], { revenue: 0.98, cashIn: 0.96, cost: 0.95, workload: 1 }, ['Bùi Quang Minh', 'Hoàng Gia Bảo']),
      { status: 'Kết thúc', closedAt: '2026-10-27', warranty: { state: 'Chờ HOD duyệt', code: '', pm: 'Hoàng Gia Bảo', requestedAt: '2026-10-28T09:00:00.000Z', requestedBy: 'namnv (SM)' } },
      [
        ...closeHistory('2026-10-27T16:00:00.000Z', 'namnv (SM)', ['045.118.1', '045.118.2']),
        { at: '2026-10-28T09:00:00.000Z', by: 'namnv (SM)', action: 'Yêu cầu mã bảo hành', note: '045.118.3 · Chờ HOD duyệt' },
      ],
    ),
    seedProject('BP-8', 'Nền tảng IoT nhà máy', '061.020', 'G4', 'Sản xuất 061', '2026-01-01', '2027-03-31', [120_000_000_000, 68_000_000_000, 10_000_000_000, 280_000_000], { revenue: 0.92, cashIn: 0.9, cost: 1.35, workload: 1.1 }, ['Trịnh Văn Long', 'Phí Thị Mai']),
    // Demo: 1 mã outsource chờ GĐK duyệt + 1 mã bị từ chối
    seedWith(
      seedProject('BP-9', 'Hệ thống chấm điểm tín dụng', '010.530', 'BFSI', 'Ngân hàng 010', '2026-01-01', '2026-12-31', [520_000_000_000, 280_000_000_000, 48_000_000_000, 1_100_000_000], { revenue: 1, cashIn: 0.99, cost: 0.9, workload: 0.98 }, ['Lý Thu Hà', 'Ngô Bá Khá']),
      {
        outsourceCodes: [
          { code: '010.530.2.1', content: 'Thuê ngoài phát triển module eKYC', pm: 'Ngô Bá Khá', state: 'Từ chối', createdAt: '2026-09-02T08:00:00.000Z', createdBy: 'namnv (SM)', decidedAt: '2026-09-03T09:00:00.000Z', decidedBy: 'Lý Thu Hà (GĐK)', rejectReason: 'Nhân sự nội bộ đáp ứng được' },
          { code: '010.530.2.2', content: 'Thuê ngoài tích hợp CIC', pm: 'Lý Thu Hà', state: 'Chờ HOD duyệt', createdAt: '2026-10-30T10:00:00.000Z', createdBy: 'namnv (CFO)' },
        ],
      },
      [
        { at: '2026-09-02T08:00:00.000Z', by: 'namnv (SM)', action: 'Tạo mã outsource', note: '010.530.2.1 · PM Ngô Bá Khá · Nội dung: Thuê ngoài phát triển module eKYC · Chờ HOD duyệt' },
        { at: '2026-09-03T09:00:00.000Z', by: 'Lý Thu Hà (GĐK)', action: 'Từ chối mã outsource', note: '010.530.2.1 · Nhân sự nội bộ đáp ứng được' },
        { at: '2026-10-30T10:00:00.000Z', by: 'namnv (CFO)', action: 'Tạo mã outsource', note: '010.530.2.2 · PM Lý Thu Hà · Nội dung: Thuê ngoài tích hợp CIC · Chờ HOD duyệt' },
      ],
    ),
    // Mã khớp với file mẫu của kế toán (Mẫu dòng tiền thu / Chi thực tế 02.2026)
    seedProject('BP-11', 'HDBank Staffing', '818.111', 'BFSI', 'CÔNG TY CỔ PHẦN GALAXY TECHNOLOGY SERVICES', '2026-01-01', '2026-12-31', [4_800_000_000, 3_600_000_000, 240_000_000, 24_000_000], { revenue: 0.97, cashIn: 0.93, cost: 0.98, workload: 1 }, ['Lý Thu Hà', 'Ngô Bá Khá']),
    seedProject('BP-12', 'LPB Staffing', '868.222', 'BFSI', 'CÔNG TY CỔ PHẦN ATOMI DIGITAL', '2026-01-01', '2026-12-31', [1_200_000_000, 850_000_000, 60_000_000, 9_600_000], { revenue: 1, cashIn: 0.96, cost: 0.95, workload: 1 }, ['Lý Thu Hà', 'Mai Văn Tùng']),
    seedProject('BP-13', 'Digilend', '993.993', 'GPDV', 'CÔNG TY CỔ PHẦN CÔNG NGHỆ TÀI CHÍNH DIGILEND', '2026-01-01', '2026-12-31', [600_000_000, 420_000_000, 30_000_000, 4_800_000], { revenue: 0.95, cashIn: 0.9, cost: 1.02, workload: 1 }, ['Vương Đình Khôi', 'Tạ Minh Châu']),
    {
      ...seedProject('BP-14', 'Cổng thanh toán điện tử tỉnh', '022.072', 'G1', 'Sở Tài chính 022', '2026-11-01', '2027-10-31', [15_000_000_000, 8_000_000_000, 1_500_000_000, 36_000_000], { revenue: 1, cashIn: 1, cost: 1, workload: 1 }, ['Nguyễn Đằng Giang', 'Phạm Hữu Trường']),
      status: 'Chờ duyệt mã' as BizStatus,
      expectedSignDate: '2026-10-25',
      pakd: [],
      plan: [],
      planImport: undefined,
      actual: [],
      actualImport: undefined,
      contractSigned: false,
      version: 1,
      history: [{ at: '2026-09-28T08:00:00.000Z', by: 'Nguyễn Đằng Giang', action: 'Tạo dự án', note: 'Version 1 · chờ GĐK duyệt mã' }],
    },
    {
      ...seedProject('BP-15', 'Chuyển đổi số kho bạc', '045.120', 'G2', 'Kho bạc 045', '2026-12-01', '2027-11-30', [26_000_000_000, 14_300_000_000, 2_600_000_000, 52_000_000], { revenue: 1, cashIn: 1, cost: 1, workload: 1 }, ['Bùi Quang Minh', 'Đặng Thu Trang']),
      status: 'PAKD chờ duyệt' as BizStatus,
      expectedSignDate: '2026-11-20',
      pakdDeadline: '2026-09-18',
      pakd: [
        { version: 1, submittedAt: '2026-09-15', submittedBy: 'Bùi Quang Minh', state: 'Từ chối', rejectedStep: 'CFO', decidedAt: '2026-09-20', decidedBy: 'CFO', note: 'Biên LN gộp thấp, rà soát lại chi phí thuê ngoài' },
        { version: 2, submittedAt: '2026-09-26', submittedBy: 'Bùi Quang Minh', state: 'Chờ CFO' },
      ] as PakdVersion[],
      actual: [],
      actualImport: undefined,
      contractSigned: false,
    },
    // Demo: dự án Bảo hành — mã .3 Open, KD / SX Closed; PAKD bảo hành V2 (SM lập, GĐK đã duyệt) chờ Kế toán duyệt
    seedWith(
      seedProject('BP-16', 'Triển khai ERP giai đoạn 1', '061.015', 'G4', 'Sản xuất 061', '2025-10-01', '2026-06-30', [4_500_000_000, 2_600_000_000, 400_000_000, 12_000_000], { revenue: 1, cashIn: 1, cost: 0.97, workload: 1 }, ['Trịnh Văn Long', 'Phí Thị Mai']),
      {
        status: 'Bảo hành',
        closedAt: '2026-10-05',
        warranty: { state: 'Đã cấp mã', code: '061.015.3', pm: 'Phí Thị Mai', requestedAt: '2026-10-06T08:00:00.000Z', requestedBy: 'namnv (SM)', decidedAt: '2026-10-07T10:00:00.000Z', decidedBy: 'Trịnh Văn Long (GĐK)', mainClosedAt: '2026-10-05' },
        pakd: [
          { version: 1, submittedAt: '2025-09-11', submittedBy: 'Trịnh Văn Long', state: 'Đã duyệt', decidedAt: '2025-09-19', decidedBy: 'BOD' },
          { version: 2, submittedAt: '2026-10-20', submittedBy: 'namnv (SM)', state: 'Chờ CFO', decidedAt: '2026-10-22', decidedBy: 'GĐK', warranty: true },
        ],
      },
      [
        ...closeHistory('2026-10-05T16:00:00.000Z', 'namnv (SM)', ['061.015.1', '061.015.2']),
        { at: '2026-10-06T08:00:00.000Z', by: 'namnv (SM)', action: 'Yêu cầu mã bảo hành', note: '061.015.3 · Chờ HOD duyệt' },
        ...issueHistory('2026-10-07T10:00:00.000Z', 'Trịnh Văn Long (GĐK)', '061.015.3', 'Phí Thị Mai', 2),
        { at: '2026-10-20T09:00:00.000Z', by: 'namnv (SM)', action: 'Nộp PAKD bảo hành', note: 'V2 · Chờ GĐ khối duyệt' },
        { at: '2026-10-22T09:00:00.000Z', by: 'Trịnh Văn Long (GĐK)', action: 'GĐK duyệt bảo hành PAKD', note: 'V2 · Chờ Kế toán duyệt' },
      ],
    ),
    // Demo: Đang thực hiện — giai đoạn bảo hành (PAKD bảo hành V2 đã duyệt; .3 Open, KD / SX Closed)
    seedWith(
      seedProject('BP-18', 'Hệ thống quản lý văn bản điện tử', '077.010', 'GPDV', 'Tổng công ty 077', '2025-06-01', '2026-03-31', [900_000_000, 520_000_000, 80_000_000, 2_400_000], { revenue: 1, cashIn: 0.95, cost: 0.98, workload: 1 }, ['Vương Đình Khôi', 'Tạ Minh Châu']),
      {
        warranty: { state: 'Đã cấp mã', code: '077.010.3', pm: 'Tạ Minh Châu', requestedAt: '2026-04-02T08:00:00.000Z', requestedBy: 'Vương Đình Khôi (GĐK)', decidedAt: '2026-04-02T08:00:00.000Z', decidedBy: 'Vương Đình Khôi (GĐK)', mainClosedAt: '2026-04-01' },
        pakd: [
          { version: 1, submittedAt: '2025-05-12', submittedBy: 'Vương Đình Khôi', state: 'Đã duyệt', decidedAt: '2025-05-20', decidedBy: 'BOD' },
          { version: 2, submittedAt: '2026-04-10', submittedBy: 'Vương Đình Khôi (GĐK)', state: 'Đã duyệt', decidedAt: '2026-04-15', decidedBy: 'BOD', warranty: true },
        ],
      },
      [
        ...closeHistory('2026-04-01T16:00:00.000Z', 'Vương Đình Khôi (GĐK)', ['077.010.1', '077.010.2']),
        ...issueHistory('2026-04-02T08:00:00.000Z', 'Vương Đình Khôi (GĐK)', '077.010.3', 'Tạ Minh Châu', 2),
        { at: '2026-04-10T09:00:00.000Z', by: 'Vương Đình Khôi (GĐK)', action: 'Nộp PAKD bảo hành', note: 'V2 · Chờ Kế toán duyệt' },
        { at: '2026-04-13T10:00:00.000Z', by: 'ketoan (CFO)', action: 'CFO duyệt bảo hành PAKD', note: 'V2 · Chờ BOD duyệt' },
        { at: '2026-04-15T10:00:00.000Z', by: 'bod (BOD)', action: 'BOD duyệt bảo hành PAKD', note: 'V2 · Đã duyệt · Dự án ⇒ Đang thực hiện (giai đoạn bảo hành)' },
      ],
    ),
    // Demo: dự án Đóng chưa có yêu cầu bảo hành (KD / SX / outsource Closed) — tích để thử
    seedWith(
      seedProject('BP-17', 'Cổng dịch vụ công trực tuyến', '038.355', 'G3', 'Tổng công ty 038', '2025-10-01', '2026-09-30', [3_200_000_000, 1_900_000_000, 300_000_000, 8_000_000], { revenue: 1, cashIn: 0.97, cost: 0.96, workload: 1 }, ['Trần Minh Đức', 'Vũ Thị Lan']),
      {
        status: 'Kết thúc',
        closedAt: '2026-10-15',
        outsourceCodes: [{ code: '038.355.2.1', content: 'Thuê ngoài kiểm thử bảo mật', pm: 'Vũ Thị Lan', state: 'Có hiệu lực', createdAt: '2026-03-02T08:00:00.000Z', createdBy: 'Đỗ Quang Huy (GĐK)', decidedAt: '2026-03-02T08:00:00.000Z', decidedBy: 'Đỗ Quang Huy (GĐK)' }],
      },
      [
        { at: '2026-03-02T08:00:00.000Z', by: 'Đỗ Quang Huy (GĐK)', action: 'Tạo mã outsource', note: '038.355.2.1 · PM Vũ Thị Lan · Nội dung: Thuê ngoài kiểm thử bảo mật · Có hiệu lực' },
        ...closeHistory('2026-10-15T16:00:00.000Z', 'namnv (SM)', ['038.355.1', '038.355.2', '038.355.2.1']),
      ],
    ),
    // Demo chuỗi duyệt PAKD: SM lập ⇒ chờ GĐ khối duyệt
    {
      ...seedProject('BP-19', 'Cổng chăm sóc khách hàng đa kênh', '045.125', 'G2', 'Bán lẻ 045', '2027-01-01', '2027-12-31', [18_000_000_000, 9_800_000_000, 1_700_000_000, 40_000_000], { revenue: 1, cashIn: 1, cost: 1, workload: 1 }, ['Bùi Quang Minh', 'Đặng Thu Trang']),
      status: 'PAKD chờ duyệt' as BizStatus,
      expectedSignDate: '2026-12-10',
      codeIssuedAt: '2026-10-20',
      pakdDeadline: '2026-11-19',
      pakd: [{ version: 1, submittedAt: '2026-10-30', submittedBy: 'namnv (SM)', state: 'Chờ GĐK' }] as PakdVersion[],
      actual: [],
      actualImport: undefined,
      contractSigned: false,
      history: [
        { at: '2026-10-20T08:00:00.000Z', by: 'namnv (SM)', action: 'Tạo dự án', note: 'Version 1' },
        { at: '2026-10-20T10:00:00.000Z', by: 'Bùi Quang Minh (GĐK)', action: 'Duyệt mã dự án', note: 'Cấp mã 045.125 · Hạn lập PAKD: 19/11/2026' },
        { at: '2026-10-30T09:00:00.000Z', by: 'namnv (SM)', action: 'Nộp PAKD', note: 'V1 · Chờ GĐ khối duyệt' },
      ],
    },
    // Demo chuỗi duyệt PAKD: GĐK lập (⇒ chờ Kế toán), Kế toán duyệt ⇒ chờ BOD
    {
      ...seedProject('BP-20', 'Hệ thống quản trị rủi ro tín dụng', '010.545', 'BFSI', 'Ngân hàng 010', '2027-01-01', '2027-12-31', [62_000_000_000, 33_000_000_000, 5_500_000_000, 150_000_000], { revenue: 1, cashIn: 1, cost: 1, workload: 1 }, ['Lý Thu Hà', 'Ngô Bá Khá']),
      status: 'PAKD chờ duyệt' as BizStatus,
      expectedSignDate: '2026-12-20',
      codeIssuedAt: '2026-10-12',
      pakdDeadline: '2026-11-11',
      pakd: [{ version: 1, submittedAt: '2026-10-25', submittedBy: 'Lý Thu Hà (GĐK)', state: 'Chờ BOD', decidedAt: '2026-10-28', decidedBy: 'CFO' }] as PakdVersion[],
      actual: [],
      actualImport: undefined,
      contractSigned: false,
      history: [
        { at: '2026-10-12T08:00:00.000Z', by: 'Lý Thu Hà (GĐK)', action: 'Tạo dự án', note: 'Version 1 · GĐK tạo ⇒ cấp mã 010.545' },
        { at: '2026-10-25T09:00:00.000Z', by: 'Lý Thu Hà (GĐK)', action: 'Nộp PAKD', note: 'V1 · GĐK lập ⇒ Chờ Kế toán duyệt' },
        { at: '2026-10-28T15:00:00.000Z', by: 'ketoan (CFO)', action: 'CFO duyệt PAKD', note: 'V1 · Chờ BOD duyệt' },
      ],
    },
    // Demo chuỗi duyệt PAKD: Kế toán từ chối ⇒ trả về GĐ khối duyệt lại (Duyệt ⇒ chờ Kế toán / Từ chối ⇒ SM sửa)
    {
      ...seedProject('BP-21', 'Số hoá hồ sơ bệnh án', '022.075', 'G1', 'Sở Y tế 022', '2027-02-01', '2027-11-30', [9_500_000_000, 5_600_000_000, 900_000_000, 22_000_000], { revenue: 1, cashIn: 1, cost: 1, workload: 1 }, ['Nguyễn Đằng Giang', 'Phạm Hữu Trường']),
      status: 'Reject' as BizStatus,
      expectedSignDate: '2026-12-15',
      codeIssuedAt: '2026-10-15',
      pakdDeadline: '2026-11-14',
      pakd: [
        { version: 1, submittedAt: '2026-10-22', submittedBy: 'namnv (SM)', state: 'Từ chối', rejectedStep: 'CFO', decidedAt: '2026-10-29', decidedBy: 'CFO', note: 'Chi phí thuê ngoài chưa có báo giá, bổ sung trước khi trình BOD' },
      ] as PakdVersion[],
      actual: [],
      actualImport: undefined,
      contractSigned: false,
      history: [
        { at: '2026-10-15T08:00:00.000Z', by: 'namnv (SM)', action: 'Tạo dự án', note: 'Version 1' },
        { at: '2026-10-15T11:00:00.000Z', by: 'Nguyễn Đằng Giang (GĐK)', action: 'Duyệt mã dự án', note: 'Cấp mã 022.075 · Hạn lập PAKD: 14/11/2026' },
        { at: '2026-10-22T09:00:00.000Z', by: 'namnv (SM)', action: 'Nộp PAKD', note: 'V1 · Chờ GĐ khối duyệt' },
        { at: '2026-10-24T10:00:00.000Z', by: 'Nguyễn Đằng Giang (GĐK)', action: 'GĐK duyệt PAKD', note: 'V1 · Chờ Kế toán duyệt' },
        { at: '2026-10-29T16:00:00.000Z', by: 'ketoan (CFO)', action: 'CFO từ chối PAKD', note: 'V1 · trả về: GĐ khối duyệt lại · Chi phí thuê ngoài chưa có báo giá, bổ sung trước khi trình BOD' },
      ],
    },
    seedProject('BP-10', 'Dịch vụ vận hành hạ tầng', '077.004', 'GPDV', 'Tổng công ty 077', '2026-01-01', '2026-12-31', [500_000_000, 300_000_000, 50_000_000, 1_200_000], { revenue: 0.88, cashIn: 0.75, cost: 1, workload: 0.9 }, ['Vương Đình Khôi', 'Tạ Minh Châu']),
  ],
];

// Sổ chi tiết mẫu = tách Thu / Chi thực tế mẫu của từng tháng thành nhiều dòng (tổng khớp tuyệt đối).
const splitAmount = (total: number, weights: number[]) => {
  const parts = weights.map((w) => Math.round((total * w) / 1000) * 1000);
  parts[0] += total - parts.reduce((a, b) => a + b, 0);
  return parts.filter((x) => x !== 0);
};
const COST_SX_NOTES = ['Lương nhân sự sản xuất', 'BHXH, BHYT, KPCĐ', 'Thuê ngoài gia công phần mềm', 'Mua bản quyền / thiết bị', 'Công tác phí triển khai'];
const COST_KD_NOTES = ['Chi phí tiếp khách, hội nghị', 'Hoa hồng / chi phí bán hàng'];
const COST_CHUNG_NOTES = ['Chi phí thuê văn phòng, điện nước', 'Văn phòng phẩm, dịch vụ chung'];
const m0 = (ym: string) => ym.slice(5, 7);
const seedLedger = (projects: BizProject[]): Ledger => {
  const revenue: CashInEntry[] = [];
  const cashIn: CashInEntry[] = [];
  const cost: CostEntry[] = [];
  const opex: AllocEntry[] = [];
  const mgmt: AllocEntry[] = [];
  projects.forEach((p) =>
    p.actual.forEach((r, i) => {
      const mm = `${+m0(r.month)}/${r.month.slice(0, 4)}`;
      if (r.costAlloc) opex.push({ id: `OP-${p.id}-${r.month}`, ver: 4, projectCode: p.productionCode, month: r.month, value: r.costAlloc, note: `Phân bổ chi phí vận hành khối ${p.division} tháng ${mm}` });
      if (r.costMgmt) mgmt.push({ id: `MG-${p.id}-${r.month}`, ver: 5, projectCode: p.productionCode, month: r.month, value: r.costMgmt, note: `Phân bổ chi phí quản lý tháng ${mm}` });
      const [y, m] = r.month.split('-');
      const prevM = +m === 1 ? `12.${+y - 1}` : `${+m - 1}.${y}`;
      if (r.revenue)
        revenue.push({
          id: `RV-${p.id}-${r.month}`,
          ver: 1,
          date: `${r.month}-${String(3 + (i % 9)).padStart(2, '0')}`,
          month: r.month,
          description: `Doanh thu ${p.name} tháng ${prevM}`,
          amount: r.revenue,
          partner: p.customerName.toUpperCase(),
          projectCode: p.productionCode,
          projectName: p.name,
          unitCode: '',
          unitName: '',
        });
      splitAmount(r.cashIn, [0.7, 0.3]).forEach((amount, j) =>
        cashIn.push({
          id: `CI-${p.id}-${r.month}-${j}`,
          ver: 2,
          date: `${r.month}-${String(8 + j * 9 + (i % 5)).padStart(2, '0')}`,
          month: r.month,
          description: j === 0 ? `Thu tiền doanh thu ${p.name} tháng ${prevM}` : `Thu tiền nghiệm thu đợt ${i + 1} - Hợp đồng ${p.masterCode}/2026/HĐ`,
          amount,
          partner: p.customerName.toUpperCase(),
          projectCode: p.productionCode,
          projectName: p.name,
          unitCode: p.division,
          unitName: p.division,
        }),
      );
      splitAmount(r.costSx, [0.55, 0.2, 0.12, 0.08, 0.05]).forEach((v, j) =>
        cost.push({ id: `CO-${p.id}-${r.month}-sx${j}`, ver: 3, projectCode: p.productionCode, month: r.month, costSx: v, costKd: 0, costChung: 0, note: COST_SX_NOTES[j] }),
      );
      splitAmount(r.costKd, [0.65, 0.35]).forEach((v, j) =>
        cost.push({ id: `CO-${p.id}-${r.month}-kd${j}`, ver: 3, projectCode: p.productionCode, month: r.month, costSx: 0, costKd: v, costChung: 0, note: COST_KD_NOTES[j] }),
      );
      splitAmount(r.costChung || 0, [0.7, 0.3]).forEach((v, j) =>
        cost.push({ id: `CO-${p.id}-${r.month}-cc${j}`, ver: 3, projectCode: p.productionCode, month: r.month, costSx: 0, costKd: 0, costChung: v, note: COST_CHUNG_NOTES[j] }),
      );
    }),
  );
  const at = '2026-09-05T09:00:00.000Z';
  const months = [...new Set(cashIn.map((e) => e.month))].sort();
  return {
    revenue,
    cashIn,
    cost,
    opex,
    mgmt,
    imports: [
      { kind: 'mgmt', ver: 5, fileName: 'Chi_phi_quan_ly_T01-T08.2026.xlsx', months, lines: mgmt.length, at, by: 'ketoan' },
      { kind: 'opex', ver: 4, fileName: 'Chi_phi_van_hanh_T01-T08.2026.xlsx', months, lines: opex.length, at, by: 'ketoan' },
      { kind: 'cost', ver: 3, fileName: 'Chi_thuc_te_T01-T08.2026.xlsx', months, lines: cost.length, at, by: 'ketoan' },
      { kind: 'cashIn', ver: 2, fileName: 'Mau_dong_tien_thu_T01-T08.2026.xlsx', months, lines: cashIn.length, at, by: 'ketoan' },
      { kind: 'revenue', ver: 1, fileName: 'Doanh_thu_T01-T08.2026.xlsx', months, lines: revenue.length, at, by: 'ketoan' },
    ],
  };
};

interface Ctx {
  projects: BizProject[];
  ledger: Ledger;
  /**
   * Import sổ chi tiết kế toán (toàn công ty). Dữ liệu các tháng có trong file thay thế dữ liệu cũ
   * của loại sổ đó; Thu / Chi thực tế của dự án liên quan được tính lại = tổng các dòng.
   */
  importLedger: (kind: LedgerKind, entries: LedgerEntry[], months: string[], fileName: string, by: string) => void;
  /** Xoá 1 dòng sổ kế toán đã import; số thực tế của dự án liên quan được tính lại. */
  removeLedgerEntry: (kind: LedgerKind, id: string, by: string) => void;
  /** Xoá cả một lần import (phiên bản); `projectId` → chỉ xoá các dòng của dự án đó trong phiên bản. */
  removeLedgerVersion: (kind: LedgerKind, ver: number, by: string, projectId?: string) => void;
  /** Số phiên bản của lần import kế tiếp (chung cho cả 5 sổ). */
  nextLedgerVer: () => number;
  createProject: (data: BizProjectInput, by: string) => BizProject;
  updateProject: (id: string, data: BizProjectInput, by: string, note?: string) => void;
  deleteProject: (id: string) => void;
  /** Ghi số liệu theo tháng (kế hoạch hoặc thực tế) bằng dữ liệu import; tăng version. */
  importMonthly: (id: string, kind: FinKind, rows: BizMonthRow[], fileName: string, by: string) => void;
  /** Ghi đè các tháng kế hoạch có trong `rows` (tháng khác giữ nguyên) — dùng khi Kế toán duyệt "Kế hoạch khối". */
  savePlanMonths: (id: string, rows: BizMonthRow[], by: string, note: string) => void;
  /** Cập nhật ký hợp đồng → dự án chuyển "Đã ký"; tăng version. */
  saveContract: (id: string, contract: Omit<BizContract, 'updatedAt' | 'updatedBy'>, by: string) => void;
  /** Quy trình: duyệt mã / nộp PAKD / duyệt – từ chối PAKD / kết thúc dự án. */
  /** GĐK duyệt mã → hệ thống sinh Mã dự án / KD / SX, hạn PAKD = hôm nay + PAKD_DAYS. */
  approveCode: (id: string, by: string) => { deadline: string; code: string };
  /** Mở lại dự án Pending → hạn PAKD mới (trả về hạn); Đóng → Đang thực hiện + Jira reopen (chưa có .3: KD / SX / outsource; có .3: chỉ .3) (trả về ''). Mã IMIS đặt theo recordStatusOf. */
  reopenProject: (id: string, by: string) => string;
  submitPakd: (id: string, by: string, role: BizRole) => void;
  /** Lưu / gửi PAKD (bản đầu, bảo hành). Gửi: người lập ⇒ bản mới theo vai; người duyệt ở chân mình ⇒ duyệt bước đó. Trả về trạng thái sau khi gửi. */
  savePakdForm: (id: string, form: PakdFormData, by: string, submit: boolean, role: BizRole) => PakdState | undefined;
  /** Duyệt / từ chối theo chuỗi GĐ khối → Kế toán → BOD. Trả về trạng thái mới. */
  decidePakd: (id: string, approve: boolean, role: BizRole, by: string, note: string) => PakdState | undefined;
  /** Bản điều chỉnh khi dự án đang thực hiện — cùng luật với savePakdForm. */
  savePakdAdjust: (id: string, form: PakdFormData, by: string, submit: boolean, role: BizRole) => PakdState | undefined;
  /** Huỷ bản điều chỉnh đang soạn (chưa gửi). */
  cancelPakdAdjust: (id: string, by: string) => void;
  /** Kết thúc dự án Đang thực hiện ⇒ Đóng; KD / SX / outsource có hiệu lực Closed + Jira pending. */
  finishProject: (id: string, by: string) => void;
  /** Thêm / xoá tài liệu đính kèm của dự án (ghi lịch sử, không tăng version). */
  setAttachments: (id: string, files: BizAttachment[], by: string, note: string) => void;
  /** Tạo mã outsource (tối đa MAX_OUTSOURCE): `issueNow` (GĐK tạo) ⇒ có hiệu lực ngay, còn lại chờ GĐK duyệt. Trả về mã mới hoặc ''. */
  addOutsourceCode: (id: string, content: string, pm: string, by: string, issueNow: boolean) => string;
  /** GĐK duyệt / từ chối (bắt buộc lý do) TẤT CẢ mã outsource đang chờ. */
  decideOutsource: (id: string, approve: boolean, by: string, note?: string) => void;
  /** Xoá mềm mã outsource (GĐK) — số được dùng lại. */
  removeOutsourceCode: (id: string, code: string, by: string) => void;
  /** Tích "Tạo mã bảo hành" (chỉ khi Đóng, không bỏ tích được) kèm PM bảo hành (trống ⇒ GĐ khối): chờ GĐK duyệt; `issueNow` (GĐK tự tích) ⇒ cấp mã ngay. Trả về mã nếu đã cấp. */
  requestWarranty: (id: string, by: string, issueNow: boolean, pm: string) => string;
  /** GĐK duyệt (sinh Mã tổng.3 Open + Jira create, dự án ⇒ Bảo hành) / từ chối (bắt buộc lý do, tích lại được). */
  decideWarranty: (id: string, approve: boolean, by: string, note?: string) => string;
  /** Đổi PM 1 mã từ /projects (D49, D53): ghi PM về dự án kinh doanh + lịch sử + Jira update_pm; mã Closed ⇒ bỏ qua. */
  setCodePm: (id: string, code: string, pm: string, by: string) => void;
  /** Mục tiêu giá trị hợp đồng ký theo năm / khối. */
  targets: SignTargets;
  setYearTargets: (year: string, byDivision: Record<string, number>) => void;
}

const BusinessProjectContext = createContext<Ctx | null>(null);

export const BusinessProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<BizProject[]>(SEED);
  const [ledger, setLedger] = useState<Ledger>(() => seedLedger(SEED));
  const [targets, setTargets] = useState<SignTargets>(SEED_TARGETS);
  const setYearTargets = (year: string, byDivision: Record<string, number>) => setTargets((prev) => ({ ...prev, [year]: byDivision }));

  const createProject = (data: BizProjectInput, by: string) => {
    const at = now();
    const p: BizProject = {
      ...data,
      id: `BP-${Date.now()}`,
      version: 1,
      pakd: [],
      plan: [],
      actual: [],
      createdAt: at,
      updatedAt: at,
      history: [{ at, by, action: 'Tạo dự án', note: 'Version 1' }],
    };
    setProjects((prev) => [p, ...prev]);
    return p;
  };

  const updateProject = (id: string, data: BizProjectInput, by: string, note?: string) => {
    const at = now();
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        // Form sửa chỉ đổi PM của mã con (outsource chưa bị từ chối, bảo hành đã cấp mã); trạng thái mã giữ theo bản hiện tại.
        const extra: BizHistory[] = [];
        const pmOf = (code: string) => (data.outsourceCodes || []).find((o) => !o.deletedAt && o.code === code)?.pm;
        const closed = mainCodesClosed(p);
        const outsourceCodes = p.outsourceCodes?.map((o) => {
          const pm = pmOf(o.code);
          if (closed || o.deletedAt || o.state === 'Từ chối' || pm === undefined || pm === o.pm) return o;
          extra.push({ at, by, action: 'Cập nhật PM outsource', note: `${o.code} · ${pm || 'bỏ PM'}` });
          return { ...o, pm };
        });
        let warranty = p.warranty;
        const wPm = data.warranty?.pm;
        const warClosed = !!warranty?.code && codeRecordStatus(p, warranty.code) === 'Closed';
        // Chờ HOD duyệt ⇒ không đổi PM bảo hành (đổi sau khi được cấp mã).
        if (warranty?.state === 'Đã cấp mã' && !warClosed && wPm !== undefined && wPm !== warranty.pm) {
          extra.push({ at, by, action: 'Cập nhật PM bảo hành', note: `${warranty.code || warrantyCodeOf(p.masterCode)} · ${wPm || 'bỏ PM'}` });
          warranty = { ...warranty, pm: wPm };
        }
        return {
          ...p,
          ...data,
          // Mã Closed: giữ nguyên PM KD / SX / outsource.
          ...(closed ? { businessPm: p.businessPm, productionPm: p.productionPm, outsourcePm: p.outsourcePm } : {}),
          outsourceCodes,
          warranty,
          version: p.version + 1,
          updatedAt: at,
          history: [...p.history, { at, by, action: 'Cập nhật', note: note || `Version ${p.version + 1}` }, ...extra],
        };
      }),
    );
  };

  const deleteProject = (id: string) => setProjects((prev) => prev.filter((p) => p.id !== id || !canDeleteProject(p)));

  const today = () => now().slice(0, 10);
  /** Cập nhật 1 dự án + ghi lịch sử. */
  const patch = (id: string, fn: (p: BizProject) => Partial<BizProject>, by: string, action: string, note?: string) => patchLog(id, fn, [{ by, action, note }]);
  /** Cập nhật 1 dự án + ghi nhiều dòng lịch sử. */
  const patchLog = (id: string, fn: (p: BizProject) => Partial<BizProject>, logs: Omit<BizHistory, 'at'>[]) => {
    const at = now();
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const next = { ...p, ...fn(p), updatedAt: at };
        // Đổi trạng thái dự án ⇒ ghi kèm "Mã IMIS: … ⇒ …" vào dòng lịch sử đầu.
        const rec = recordChangeNote(p, next);
        const rows = logs.map((l, i) => ({ at, ...l, ...(i === 0 && rec ? { note: l.note ? `${l.note} · ${rec}` : rec } : {}) }));
        return { ...next, history: [...p.history, ...rows] };
      }),
    );
  };

  const dmyOf = (d: string) => d.split('-').reverse().join('/');
  const approveCode = (id: string, by: string) => {
    const pakdDeadline = addDays(today(), PAKD_DAYS);
    const p0 = projects.find((p) => p.id === id);
    const code = p0?.masterCode || nextMasterCode(projects, p0?.customerCode || '');
    patch(
      id,
      () => ({ status: 'Chưa có PAKD', codeIssuedAt: today(), pakdDeadline, ...codesFrom(code) }),
      by,
      'Duyệt mã dự án',
      `Cấp mã ${code} · Hạn lập PAKD: ${dmyOf(pakdDeadline)}`,
    );
    return { deadline: pakdDeadline, code };
  };

  const reopenProject = (id: string, by: string) => {
    const p0 = projects.find((p) => p.id === id);
    if (p0?.status === 'Kết thúc') {
      // Đã chốt 04/11: đang có yêu cầu bảo hành chờ duyệt ⇒ không mở lại.
      if (p0.warranty?.state === 'Chờ HOD duyệt') return '';
      // Đã chốt 04/11: có .3 ⇒ chỉ mở lại .3 (KD / SX / outsource giữ Closed); chưa có ⇒ mở lại KD / SX / outsource.
      const codes = lifecycleCodes(p0);
      patchLog(id, () => ({ status: 'Đang thực hiện', closedAt: undefined }), [
        { by, action: 'Mở lại dự án', note: `Đóng ⇒ Đang thực hiện${inWarrantyPhase(p0) ? ' (KD / SX / outsource vẫn Closed)' : ''}` },
        { by: 'Hệ thống', action: 'Đồng bộ Jira', note: `Đã gửi Jira reopen: mã ${codes.join(', ')}` },
      ]);
      return '';
    }
    if (p0?.status !== 'Pending') return '';
    const pakdDeadline = addDays(today(), PAKD_DAYS);
    patch(
      id,
      (p) => {
        const w = workingPakd(p);
        return { status: w ? statusAfterPakd({ status: 'Chưa có PAKD' }, w) : 'Chưa có PAKD', pakdDeadline, closedAt: undefined };
      },
      by,
      'Mở lại dự án',
      `Hạn PAKD mới: ${dmyOf(pakdDeadline)}`,
    );
    return pakdDeadline;
  };

  /** Hết hạn PAKD_DAYS ngày mà PAKD chưa qua bước Kế toán → tự động chuyển Pending. */
  useEffect(() => {
    const t = today();
    const waiting = (p: BizProject) => p.status === 'Chưa có PAKD' || p.status === 'PAKD chờ duyệt' || p.status === 'Reject';
    const overdue = projects.filter((p) => waiting(p) && !passedAccountant(p) && p.pakdDeadline && p.pakdDeadline < t);
    if (!overdue.length) return;
    const at = now();
    const ids = new Set(overdue.map((p) => p.id));
    setProjects((prev) =>
      prev.map((p) =>
        ids.has(p.id) && waiting(p)
          ? {
              ...p,
              status: 'Pending',
              closedAt: t,
              updatedAt: at,
              history: [
                ...p.history,
                {
                  at,
                  by: 'Hệ thống',
                  action: 'Tự động chuyển Pending',
                  note: `Quá ${PAKD_DAYS} ngày (hạn ${dmyOf(p.pakdDeadline!)}) ${p.pakd.length ? 'PAKD chưa qua bước Kế toán' : 'chưa có PAKD'}${lifecycleCodes(p).length ? ` · Mã IMIS: ${lifecycleCodes(p).join(', ')} ⇒ On-hold` : ''}`,
                },
              ],
            }
          : p,
      ),
    );
  }, [projects]);

  /** Bản mới do người lập gửi: trạng thái theo vai cao nhất; BOD lập ⇒ Đã duyệt ngay. */
  const newVersion = (p: BizProject, by: string, role: BizRole, extra: Partial<PakdVersion>): PakdVersion => {
    const state = pakdEntryState(role);
    return { version: nextPakdVersion(p), submittedAt: today(), submittedBy: by, state, ...(state === 'Đã duyệt' ? { decidedAt: today(), decidedBy: role } : {}), ...extra };
  };
  const kindOf = (p: BizProject): Partial<PakdVersion> => (p.status === 'Bảo hành' ? { warranty: true } : {});

  const submitPakd = (id: string, by: string, role: BizRole) => {
    const p0 = projects.find((x) => x.id === id);
    if (!p0 || isPakdLocked(p0)) return;
    patch(
      id,
      (p) => {
        const v = newVersion(p, by, role, kindOf(p));
        return { status: statusAfterPakd(p, v), pakd: [...p.pakd, v] };
      },
      by,
      'Nộp PAKD',
      pakdTargetLabel(pakdEntryState(role)),
    );
  };

  /** Áp số liệu PAKD vào dự án: doanh thu, chi phí, hợp đồng, thời gian, kế hoạch theo tháng. */
  const applyPakd = (p: BizProject, f: PakdFormData, by: string): Partial<BizProject> => {
    const t = pakdTotals(f);
    const signed = f.contractState === 'Đã ký';
    const plan = pakdMonthlyPlan(f);
    return {
      expectedRevenue: t.revenue,
      plannedProductionCost: t.sx,
      plannedBusinessCost: t.kd,
      contractSigned: signed,
      expectedSignDate: signed ? f.actualSignDate || f.contractDate || p.expectedSignDate : f.expectedSignMonth ? `${f.expectedSignMonth}-01` : p.expectedSignDate,
      ...(signed && f.startMonth ? { startDate: `${f.startMonth}-01` } : {}),
      ...(signed && f.endMonth ? { endDate: `${f.endMonth}-28` } : {}),
      ...(plan.length ? { plan, planImport: { fileName: 'PAKD lập trên hệ thống', at: now(), by } } : {}),
      ...(signed
        ? {
            contract: {
              ...(p.contract || { deviationReason: '', files: [], addenda: [] }),
              number: f.contractNo || p.contract?.number || '',
              signDate: f.actualSignDate || f.contractDate || p.contract?.signDate || '',
              value: f.contractValue,
              from: f.startMonth ? `${f.startMonth}-01` : p.contract?.from || '',
              to: f.endMonth ? `${f.endMonth}-28` : p.contract?.to || '',
              updatedAt: now(),
              updatedBy: by,
            },
          }
        : {}),
    };
  };
  const pakdSummary = (f: PakdFormData) => {
    const t = pakdTotals(f);
    return `${f.contractState} · Doanh thu ${Math.round(t.revenue).toLocaleString('en-US')} · Chi phí ${Math.round(t.cost).toLocaleString('en-US')}`;
  };

  /** Duyệt / từ chối 1 bản: duyệt ⇒ bước kế tiếp; từ chối ⇒ ghi bước từ chối (cấp liền trước duyệt lại). */
  const decideVersion = (v: PakdVersion, approve: boolean, role: BizRole, note: string): PakdVersion =>
    approve
      ? { ...v, state: pakdApproveTo(v, role), rejectedStep: undefined, decidedAt: today(), decidedBy: role, note: note || (v.state === 'Từ chối' ? undefined : v.note) }
      : { ...v, state: 'Từ chối', rejectedStep: pakdRejectStep(v), decidedAt: today(), decidedBy: role, note };
  const kindText = (v: Pick<PakdVersion, 'adjust' | 'warranty'>) => (v.adjust ? 'điều chỉnh ' : v.warranty ? 'bảo hành ' : '');

  const savePakdForm = (id: string, form: PakdFormData, by: string, submit: boolean, role: BizRole) => {
    const p0 = projects.find((x) => x.id === id);
    if (!p0 || isPakdLocked(p0)) return undefined;
    const f: PakdFormData = { ...form, savedAt: now(), savedBy: by };
    const w = workingPakd(p0);
    const kind = kindText(kindOf(p0));
    // "Lưu" giữ nguyên bước duyệt.
    if (!submit) {
      patch(id, () => ({ pakdForm: f }), by, `Lưu PAKD ${kind}`.trim(), w ? `V${w.version} · giữ bước: ${pakdStateLabel(w)}` : 'Nháp');
      return w?.state;
    }
    // Người duyệt sửa ở chân mình ⇒ "Gửi" = duyệt bước đó, giữ bản và người nộp gốc.
    const edit = isApproverEdit(w, role);
    const v = edit ? decideVersion(w!, true, role, '') : newVersion(p0, by, role, kindOf(p0));
    patch(
      id,
      (p) => ({ ...applyPakd(p, f, by), pakdForm: f, status: statusAfterPakd(p, v), pakd: edit ? [...p.pakd.slice(0, -1), v] : [...p.pakd, v] }),
      by,
      edit ? `${role} sửa & duyệt PAKD ${kind}`.trim() : `Nộp PAKD ${kind}`.trim(),
      `V${v.version} · ${pakdSummary(f)} · ${pakdTargetLabel(v.state)}`,
    );
    return v.state;
  };

  const savePakdAdjust = (id: string, form: PakdFormData, by: string, submit: boolean, role: BizRole) => {
    const p0 = projects.find((x) => x.id === id);
    if (!p0) return undefined;
    const f: PakdFormData = { ...form, savedAt: now(), savedBy: by };
    const w = workingPakd(p0);
    if (!submit) {
      patch(id, () => ({ pakdDraft: f }), by, 'Lưu điều chỉnh PAKD', w ? `V${w.version} · giữ bước: ${pakdStateLabel(w)}` : 'Nháp');
      return w?.state;
    }
    const edit = isApproverEdit(w, role);
    const v = edit ? decideVersion(w!, true, role, '') : newVersion(p0, by, role, { adjust: true });
    // BOD lập / duyệt bước cuối ⇒ áp dụng bản điều chỉnh ngay.
    const done = v.state === 'Đã duyệt';
    patch(
      id,
      (p) => ({
        ...(done ? { ...applyPakd(p, f, by), pakdForm: f, pakdDraft: undefined } : { pakdDraft: f }),
        pakd: edit ? [...p.pakd.slice(0, -1), v] : [...p.pakd, v],
      }),
      by,
      edit ? `${role} sửa & duyệt điều chỉnh PAKD` : 'Gửi điều chỉnh PAKD',
      `V${v.version} · ${pakdSummary(f)} · ${pakdTargetLabel(v.state)}`,
    );
    return v.state;
  };
  const cancelPakdAdjust = (id: string, by: string) => patch(id, () => ({ pakdDraft: undefined }), by, 'Huỷ bản điều chỉnh PAKD');

  const decidePakd = (id: string, approve: boolean, role: BizRole, by: string, note: string) => {
    const p0 = projects.find((x) => x.id === id);
    const w = p0 && !isPakdLocked(p0) ? workingPakd(p0) : undefined;
    note = note.trim();
    if (!w || !canDecidePakd(w, role) || (!approve && !note)) return undefined;
    const v = decideVersion(w, approve, role, note);
    patch(
      id,
      (p) => ({
        // Bản điều chỉnh: duyệt bước cuối ⇒ áp số liệu mới; còn lại giữ bản đang áp dụng.
        ...(v.state === 'Đã duyệt' && v.adjust && p.pakdDraft ? { ...applyPakd(p, p.pakdDraft, by), pakdForm: p.pakdDraft, pakdDraft: undefined } : {}),
        pakd: [...p.pakd.slice(0, -1), v],
        status: statusAfterPakd(p, v),
      }),
      by,
      `${role} ${approve ? 'duyệt' : 'từ chối'} ${kindText(w)}PAKD`,
      `V${v.version} · ${approve ? pakdTargetLabel(v.state) : `trả về: ${pakdWaitingText(v)}`}${note ? ` · ${note}` : ''}`,
    );
    return v.state;
  };

  const finishProject = (id: string, by: string) => {
    const p0 = projects.find((p) => p.id === id);
    // Đã chốt 04/11: còn mã outsource chờ duyệt ⇒ chưa cho kết thúc.
    if (p0?.status !== 'Đang thực hiện' || pendingOutsource(p0).length) return;
    const codes = lifecycleCodes(p0);
    patchLog(id, () => ({ status: 'Kết thúc', closedAt: today() }), [
      { by, action: 'Kết thúc dự án', note: 'Dự án ⇒ Đóng' },
      { by: 'Hệ thống', action: 'Đồng bộ Jira', note: `Đã gửi Jira pending: mã ${codes.join(', ')}` },
    ]);
  };

  const live = (o: BizOutsource) => !o.deletedAt;
  const addOutsourceCode = (id: string, content: string, pm: string, by: string, issueNow: boolean) => {
    const p0 = projects.find((p) => p.id === id);
    const code = p0 ? nextOutsourceCode(p0) : '';
    content = content.trim();
    if (!p0 || !code || !content) return '';
    pm = pm || p0.salesDirector || '';
    const state: OutsourceState = issueNow ? 'Có hiệu lực' : 'Chờ HOD duyệt';
    const item: BizOutsource = { code, content, pm, state, createdAt: now(), createdBy: by, ...(issueNow ? { decidedAt: now(), decidedBy: by } : {}) };
    patch(
      id,
      (p) => ({ outsourceCodes: [...(p.outsourceCodes || []), item] }),
      by,
      'Tạo mã outsource',
      `${code} · PM ${pm || '—'} · Nội dung: ${content} · ${issueNow ? 'Có hiệu lực' : 'Chờ HOD duyệt'}`,
    );
    return code;
  };
  const decideOutsource = (id: string, approve: boolean, by: string, note = '') => {
    note = note.trim();
    const p0 = projects.find((p) => p.id === id);
    if (!p0 || mainCodesClosed(p0) || (!approve && !note)) return;
    const at = now();
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const codes = (p.outsourceCodes || []).filter((o) => live(o) && o.state === 'Chờ HOD duyệt').map((o) => o.code);
        if (!codes.length) return p;
        return {
          ...p,
          outsourceCodes: (p.outsourceCodes || []).map((o) =>
            live(o) && o.state === 'Chờ HOD duyệt' ? { ...o, state: approve ? 'Có hiệu lực' : 'Từ chối', decidedAt: at, decidedBy: by, rejectReason: approve ? undefined : note } : o,
          ),
          updatedAt: at,
          history: [...p.history, ...codes.map((c) => ({ at, by, action: approve ? 'Duyệt mã outsource' : 'Từ chối mã outsource', note: note ? `${c} · ${note}` : c }))],
        };
      }),
    );
  };
  const removeOutsourceCode = (id: string, code: string, by: string) => {
    const p0 = projects.find((p) => p.id === id);
    if (!p0 || mainCodesClosed(p0)) return;
    patch(id, (p) => ({ outsourceCodes: (p.outsourceCodes || []).map((o) => (live(o) && o.code === code ? { ...o, deletedAt: now(), deletedBy: by } : o)) }), by, 'Xoá mã outsource', code);
  };

  // Mã bảo hành — ghi lịch sử, không tăng version; đã tích / đã cấp thì không huỷ / xoá.
  const issueWarranty = (p0: BizProject, w: BizWarranty, by: string, note = '') => {
    const code = warrantyCodeOf(p0.masterCode);
    const pm = w.pm || p0.salesDirector;
    const v = nextPakdVersion(p0);
    // Đã chốt 04/11: tạo sẵn PAKD bảo hành V(n+1) Nháp chép từ bản áp dụng.
    const draft = p0.pakdForm ? { ...p0.pakdForm, savedAt: now(), savedBy: 'Hệ thống' } : undefined;
    patchLog(p0.id, () => ({ status: 'Bảo hành', pakdForm: draft, pakdDraft: undefined, pakdDeadline: undefined, warranty: { ...w, state: 'Đã cấp mã', code, pm, decidedAt: now(), decidedBy: by, rejectReason: undefined, mainClosedAt: p0.closedAt } }), [
      { by, action: 'Duyệt mã bảo hành', note: `${code} · PM ${pm || '—'} · Dự án ⇒ Bảo hành${note ? ` · ${note}` : ''}` },
      { by: 'Hệ thống', action: 'Đồng bộ Jira', note: `Đã gửi Jira create: mã ${code}` },
      { by: 'Hệ thống', action: 'Tạo PAKD bảo hành', note: `V${v} Nháp — chép từ bản áp dụng V${v - 1} · không áp hạn ${PAKD_DAYS} ngày` },
    ]);
    return code;
  };
  const requestWarranty = (id: string, by: string, issueNow: boolean, pm: string) => {
    const p0 = projects.find((p) => p.id === id);
    if (!p0 || !canRequestWarranty(p0) || warrantyActive(p0.warranty)) return '';
    const base: BizWarranty = { state: 'Chờ HOD duyệt', code: '', pm: pm.trim(), requestedAt: now(), requestedBy: by };
    if (issueNow) return issueWarranty(p0, base, by);
    patch(id, () => ({ warranty: base }), by, 'Yêu cầu mã bảo hành', `${warrantyCodeOf(p0.masterCode)} · PM ${base.pm || `mặc định GĐ khối (${p0.salesDirector || '—'})`} · Chờ HOD duyệt`);
    return '';
  };
  const decideWarranty = (id: string, approve: boolean, by: string, note = '') => {
    const p0 = projects.find((p) => p.id === id);
    const w = p0?.warranty;
    note = note.trim();
    if (!p0 || w?.state !== 'Chờ HOD duyệt' || (!approve && !note)) return '';
    if (approve) return issueWarranty(p0, w, by, note);
    patch(id, () => ({ warranty: { ...w, state: 'Từ chối', decidedAt: now(), decidedBy: by, rejectReason: note } }), by, 'Từ chối mã bảo hành', note);
    return '';
  };

  const setCodePm = (id: string, code: string, pm: string, by: string) => {
    const p0 = projects.find((p) => p.id === id);
    if (!p0 || codeRecordStatus(p0, code) === 'Closed') return;
    const kind = code === p0.businessCode || code === p0.productionCode ? 'main' : p0.warranty?.code === code ? 'warranty' : 'outsource';
    const action = kind === 'main' ? 'Cập nhật PM' : kind === 'warranty' ? 'Cập nhật PM bảo hành' : 'Cập nhật PM outsource';
    patchLog(
      id,
      (p) =>
        code === p.businessCode
          ? { businessPm: pm }
          : code === p.productionCode
            ? { productionPm: pm }
            : kind === 'warranty'
              ? { warranty: { ...p.warranty!, pm } }
              : { outsourceCodes: p.outsourceCodes?.map((o) => (o.code === code ? { ...o, pm } : o)) },
      [
        { by, action, note: `${code} · ${pm} (từ /projects)` },
        ...(jiraOf(p0, code) === 'Đã tạo' ? [{ by: 'Hệ thống', action: 'Đồng bộ Jira', note: `Đã gửi Jira update_pm: mã ${code}` }] : []),
      ],
    );
  };

  const setAttachments = (id: string, files: BizAttachment[], by: string, note: string) => {
    const at = now();
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, attachments: files, updatedAt: at, history: [...p.history, { at, by, action: 'Cập nhật tài liệu đính kèm', note }] } : p,
      ),
    );
  };

  const saveContract = (id: string, contract: Omit<BizContract, 'updatedAt' | 'updatedBy'>, by: string) => {
    const at = now();
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              contractSigned: true,
              contract: { ...contract, updatedAt: at, updatedBy: by },
              // Thông tin HĐ tự cập nhật xuống PAKD (bản đang áp dụng và bản điều chỉnh nếu có)
              pakdForm: syncContractToPakd(p.pakdForm, contract),
              pakdDraft: syncContractToPakd(p.pakdDraft, contract),
              version: p.version + 1,
              updatedAt: at,
              history: [
                ...p.history,
                {
                  at,
                  by,
                  action: p.contract ? 'Cập nhật hợp đồng' : 'Ký hợp đồng',
                  note: `HĐ ${contract.number} · ${contract.addenda.length} phụ lục · Version ${p.version + 1}`,
                },
              ],
            }
          : p,
      ),
    );
  };

  const importMonthly = (id: string, kind: FinKind, rows: BizMonthRow[], fileName: string, by: string) => {
    const at = now();
    const sorted = [...rows].sort((a, b) => a.month.localeCompare(b.month));
    const action = kind === 'plan' ? 'Import kế hoạch' : 'Import thực tế';
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...(kind === 'plan' ? { plan: sorted, planImport: { fileName, at, by } } : { actual: sorted, actualImport: { fileName, at, by } }),
              version: p.version + 1,
              updatedAt: at,
              history: [...p.history, { at, by, action, note: `${fileName} · ${rows.length} tháng · Version ${p.version + 1}` }],
            }
          : p,
      ),
    );
  };

  const savePlanMonths = (id: string, rows: BizMonthRow[], by: string, note: string) => {
    const at = now();
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const map = new Map<string, BizMonthRow>(p.plan.map((r) => [r.month, r]));
        rows.forEach((r) => map.set(r.month, { ...r }));
        return {
          ...p,
          plan: [...map.values()].sort((a, b) => a.month.localeCompare(b.month)),
          planImport: { fileName: 'Kế hoạch khối', at, by },
          version: p.version + 1,
          updatedAt: at,
          history: [...p.history, { at, by, action: 'Duyệt kế hoạch khối', note: `${note} · Version ${p.version + 1}` }],
        };
      }),
    );
  };

  /** Tính lại Doanh thu / Thu / Chi thực tế của các dự án liên quan trong `months` từ bộ dòng sổ `next`. */
  const recomputeProjects = (kind: LedgerKind, next: LedgerEntry[], months: string[], touched: Set<string>, by: string, note: string) => {
    const at = now();
    const inMonths = (e: { month: string }) => months.includes(e.month);
    const total = (lines: LedgerEntry[], which: 0 | 1 | 2) => lines.reduce((a, e) => a + entryAmounts(e)[which], 0);
    setProjects((prev) =>
      prev.map((p) => {
        if (!touched.has(p.id)) return p;
        const codes = projectCodes(p);
        const mine = next.filter((e) => inMonths(e) && codes.includes(e.projectCode.trim().toLowerCase()));
        const rows = new Map<string, BizMonthRow>(p.actual.map((r) => [r.month, { ...r }]));
        months.forEach((m) => {
          const lines = mine.filter((e) => e.month === m);
          const row = rows.get(m) || { month: m, revenue: 0, cashIn: 0, costSx: 0, costKd: 0, workload: 0 };
          if (kind === 'revenue') row.revenue = total(lines, 0);
          else if (kind === 'cashIn') row.cashIn = total(lines, 0);
          else if (kind === 'opex') row.costAlloc = total(lines, 0);
          else if (kind === 'mgmt') row.costMgmt = total(lines, 0);
          else {
            row.costSx = total(lines, 0);
            row.costKd = total(lines, 1);
            row.costChung = total(lines, 2);
          }
          if (lines.length || rows.has(m)) rows.set(m, row);
        });
        return {
          ...p,
          actual: [...rows.values()].sort((a, b) => a.month.localeCompare(b.month)),
          updatedAt: at,
          history: [...p.history, { at, by, action: `Cập nhật ${LEDGER_LABEL[kind]} từ sổ kế toán`, note: `${note} · ${mine.length} dòng` }],
        };
      }),
    );
  };
  const ledgerOf = (kind: LedgerKind): LedgerEntry[] => ledger[kind];
  const nextLedgerVer = () => ledger.imports.reduce((m, i) => Math.max(m, i.ver), 0) + 1;

  const importLedger = (kind: LedgerKind, entries: LedgerEntry[], months: string[], fileName: string, by: string) => {
    const at = now();
    const ver = nextLedgerVer();
    const inMonths = (e: { month: string }) => months.includes(e.month);
    const old = ledgerOf(kind);
    const stamped = entries.map((e) => ({ ...e, ver })) as LedgerEntry[];
    const next = [...old.filter((e) => !inMonths(e)), ...stamped];
    setLedger((prev) => ({
      ...prev,
      [kind]: next,
      imports: [{ kind, ver, fileName, months, lines: entries.length, at, by }, ...prev.imports],
    }));
    // Dự án bị ảnh hưởng: có dòng trong file mới, hoặc từng có dòng ở các tháng này (import lại để sửa)
    const touched = new Set(
      [...old.filter(inMonths), ...stamped].map((e) => matchProject(projects, e.projectCode)?.id).filter((id): id is string => !!id),
    );
    recomputeProjects(kind, next, months, touched, by, `${fileName} (v${ver})`);
  };

  const removeLedgerEntry = (kind: LedgerKind, id: string, by: string) => {
    const old = ledgerOf(kind);
    const gone = old.find((e) => e.id === id);
    if (!gone) return;
    const next = old.filter((e) => e.id !== id);
    setLedger((prev) => ({ ...prev, [kind]: next }));
    const pid = matchProject(projects, gone.projectCode)?.id;
    if (pid) recomputeProjects(kind, next, [gone.month], new Set([pid]), by, `Xoá dòng sổ v${gone.ver}`);
  };

  const removeLedgerVersion = (kind: LedgerKind, ver: number, by: string, projectId?: string) => {
    const old = ledgerOf(kind);
    const codes = projectId ? projectCodes(projects.find((p) => p.id === projectId)!) : null;
    const hit = (e: LedgerEntry) => e.ver === ver && (!codes || codes.includes(e.projectCode.trim().toLowerCase()));
    const gone = old.filter(hit);
    if (!gone.length) return;
    const next = old.filter((e) => !hit(e));
    const whole = !next.some((e) => e.ver === ver);
    setLedger((prev) => ({ ...prev, [kind]: next, imports: whole ? prev.imports.filter((i) => !(i.kind === kind && i.ver === ver)) : prev.imports }));
    const months = [...new Set(gone.map((e) => e.month))];
    const touched = new Set(gone.map((e) => matchProject(projects, e.projectCode)?.id).filter((id): id is string => !!id));
    recomputeProjects(kind, next, months, touched, by, projectId ? `Xoá dòng của dự án trong lần import v${ver}` : `Xoá lần import v${ver}`);
  };

  return (
    <BusinessProjectContext.Provider value={{ projects, ledger, importLedger, removeLedgerEntry, removeLedgerVersion, nextLedgerVer, createProject, updateProject, deleteProject, importMonthly, savePlanMonths, saveContract, setAttachments, addOutsourceCode, decideOutsource, removeOutsourceCode, requestWarranty, decideWarranty, setCodePm, approveCode, reopenProject, submitPakd, savePakdForm, savePakdAdjust, cancelPakdAdjust, decidePakd, finishProject, targets, setYearTargets }}>
      {children}
    </BusinessProjectContext.Provider>
  );
};

export const useBusinessProjects = () => {
  const ctx = useContext(BusinessProjectContext);
  if (!ctx) throw new Error('useBusinessProjects must be used within BusinessProjectProvider');
  return ctx;
};
