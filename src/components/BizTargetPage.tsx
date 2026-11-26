/**
 * BizTargetPage — "Mục tiêu kinh doanh" (module Quản trị dự án & Tài chính). Đồng bộ logic với code thật
 * (BusinessProjectTargetService / Calculator, màn /BusinessProjects/Target).
 *
 * Màn ngoài = DANH SÁCH kế hoạch mục tiêu (mỗi dòng 1 kế hoạch theo kỳ của 1 khối):
 *   Ô tổng quan: số kế hoạch theo trạng thái · chờ tôi duyệt · mục tiêu năm nay (đã duyệt) · đã ký HĐ năm nay + % so mục tiêu.
 *   Bộ lọc: Khối (GĐK chỉ khối mình), Trạng thái (+ "Chờ tôi duyệt" cho CFO / BOD), Kỳ có năm, tìm kiếm.
 *   Cột: Khối, Kỳ kế hoạch, Số tháng, Trạng thái — phiên bản, Số dự án, Giá trị mục tiêu, % LN gộp, LN gộp,
 *        Giá trị theo từng năm (Σ dòng có Ký HĐ trong năm), Đã ký trong kỳ (Danh sách dự án), % hoàn thành (÷ mục tiêu đã duyệt),
 *        Người lập, Cập nhật, Duyệt / Xem; dòng Tổng. GĐK thấy cả Bản nháp; CFO / BOD không thấy Nháp chưa gửi
 *        (Nháp đã có bản duyệt ⇒ hiện bản đã duyệt).
 *   Bấm 1 dòng ⇒ màn CHI TIẾT (nút "Danh sách kế hoạch" để quay lại); nút "Lập kế hoạch kỳ mới" (GĐK); nút "Xem tổng hợp theo khoảng thời gian".
 * Màn chi tiết:
 *      Kỳ = Từ tháng – Đến tháng (MM/YYYY, có thể nhiều năm); các kỳ của cùng 1 khối KHÔNG được chồng nhau. Kỳ mới mặc định
 *      nối tiếp kỳ cuối, 24 tháng; sửa được kỳ khi đang soạn (ghi lịch sử, lên phiên bản mới như sửa dòng).
 *      Dòng: Khách hàng, Tên dự án, Ra thầu (được trước kỳ, ≤ Ký HĐ, ≤ cuối kỳ), Ký HĐ (thuộc kỳ), Giá trị (VNĐ),
 *      % LN gộp mục tiêu (số nguyên, được âm — ô nhập), LN gộp (tự tính = Giá trị × %), Cơ sở đăng ký.
 *      Khung "Mục tiêu theo năm trong kỳ": mỗi năm = Σ các dòng có Ký HĐ trong năm đó.
 *      GĐK: [Lưu nháp] [Gửi duyệt] · đang chờ duyệt ⇒ khoá, chỉ [Rút hồ sơ] (lý do bắt buộc).
 *      CFO (hồ sơ Chờ CFO duyệt) / BOD (Chờ BOD duyệt): khung Phê duyệt hồ sơ [Phê duyệt] [Từ chối]; còn lại chỉ xem.
 * Xem tổng hợp theo khoảng thời gian: Khối (kể cả Tất cả) + Từ tháng – Đến tháng (lọc theo tháng Ký HĐ) + Trạng thái; chỉ xem;
 *      bấm khối ⇒ mở chi tiết kế hoạch.
 *
 * Luồng: GĐK gửi ⇒ Chờ CFO ⇒ CFO duyệt ⇒ Chờ BOD ⇒ BOD duyệt ⇒ Đã duyệt (ghi mục tiêu chính thức TỪNG NĂM của khối = Σ Giá trị các dòng
 *        có Ký HĐ trong năm, trên mọi kế hoạch đã duyệt của khối, vào Sổ theo dõi dự án / Tổng quan / Lập kế hoạch khối).
 *        CFO từ chối ⇒ Từ chối (về GĐK); BOD từ chối ⇒ trả về Chờ CFO. Từ chối bắt buộc ý kiến.
 * Phiên bản: sửa nội dung sau khi Đã duyệt / Từ chối / đã có quyết định ⇒ phiên bản mới; phiên bản đã duyệt vẫn là mục tiêu chính thức.
 * Lưu lịch sử mọi lần lưu / gửi / rút / duyệt / từ chối, kèm nội dung đã điều chỉnh. ĐVT: VNĐ.
 * Vai trò (GĐK / CFO / BOD) chỉ là công tắc thử nghiệm của bản prototype — hệ thống thật phân quyền theo quyền + Organization.HODID.
 */
import React, { createContext, useContext, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, ClipboardCheck, Eye, Flag, History, LogOut, Pencil, PenLine, Plus, RotateCcw, Save, Send, Target, Upload, X, XCircle } from 'lucide-react';
import { DIVISIONS, signedDate, signedValue, useBusinessProjects } from '../business/BusinessProjectContext';
import { Btn, ErpPage, ErpTitleBar, KpiBox, Panel, Segmented, Tag, erp } from './erp/Erp';
import { MonthPickerButton } from './erp/MonthPicker';

const CURRENT_USER = 'namnv';
const CRUMBS = ['Quản trị dự án & Tài chính', 'Mục tiêu kinh doanh'];

// ==========================================================================
// Dữ liệu
// ==========================================================================
export interface TargetRow {
  id: string;
  customer: string;
  project: string;
  tenderMonth: string; // YYYY-MM — ra thầu (được chọn năm trước, ≤ ký HĐ)
  signMonth: string; // YYYY-MM — ký HĐ (thuộc năm kế hoạch)
  value: number; // HĐ ký mới (VNĐ)
  grossProfitRate: number | null; // % LN gộp mục tiêu — ô nhập, SỐ NGUYÊN, được âm / > 100, |%| ≤ 10.000
  grossProfit: number; // LN gộp mục tiêu (VNĐ) — tự tính = round(HĐ ký mới × % / 100)
  basis: string; // cơ sở đăng ký / thuyết minh
}
export type TargetStatus = 'Bản nháp' | 'Chờ CFO duyệt' | 'Chờ BOD duyệt' | 'Đã duyệt' | 'Từ chối' | 'Đã rút';
export type Role = 'GĐK' | 'CFO' | 'BOD';
export interface TargetLog {
  at: string;
  by: string;
  action: string;
  version: number;
  note?: string;
  changes?: string[];
}
export interface TargetPlan {
  id: string;
  division: string;
  /** Kỳ kế hoạch (nhiều năm): Từ tháng – Đến tháng, YYYY-MM. Các kỳ của cùng 1 khối không được chồng nhau. */
  from: string;
  to: string;
  author: string;
  version: number;
  status: TargetStatus;
  rows: TargetRow[];
  /** Phiên bản đã được BOD duyệt gần nhất (mục tiêu chính thức) — khác `version` khi đang điều chỉnh. */
  effectiveVersion?: number;
  effectiveRows?: TargetRow[];
  /** Kỳ của phiên bản đã duyệt (khác kỳ hiện tại khi đang điều chỉnh kỳ). */
  effectiveFrom?: string;
  effectiveTo?: string;
  /** Ý kiến của lần quyết định gần nhất (CFO / BOD). */
  bodNote?: string;
  decisionBy?: 'CFO' | 'BOD';
  /** BOD từ chối ⇒ hồ sơ trả về CFO duyệt lại. */
  returnedByBod?: boolean;
  withdrawReason?: string;
  history: TargetLog[];
}

const MAX_VALUE = 9_999_999_999_999; // trần HĐ ký mới (VNĐ)
const MAX_RATE = 10_000; // trần |% LN gộp|
/** LN gộp = round(HĐ ký mới × % / 100) — server luôn tính lại, không tin số client. */
const computeGp = (value: number, rate: number | null) => (rate == null ? 0 : Math.round((value * rate) / 100));
const isPending = (s: TargetStatus) => s === 'Chờ CFO duyệt' || s === 'Chờ BOD duyệt';
/** CFO quyết định bước "Chờ CFO duyệt", BOD quyết định bước "Chờ BOD duyệt". */
const canDecide = (s: TargetStatus, role: Role) => (s === 'Chờ CFO duyệt' && role === 'CFO') || (s === 'Chờ BOD duyệt' && role === 'BOD');
const DECISION_ACTIONS = ['CFO từ chối', 'BOD phê duyệt — ghi nhận kế hoạch chính thức', 'BOD từ chối — trả về CFO'];

const uid = () => Math.random().toString(36).slice(2, 9);
const now = () => new Date().toISOString();
const fmtN = (n: number) => Math.round(n || 0).toLocaleString('en-US');
/** Seed nhập theo triệu VNĐ cho gọn, đổi sang VNĐ; % LN gộp làm tròn nguyên, LN gộp tính lại từ %. */
const r = (customer: string, project: string, tender: string, sign: string, valueTr: number, gpTr: number, basis = ''): TargetRow => {
  const value = valueTr * 1_000_000;
  const rate = valueTr ? Math.round((gpTr / valueTr) * 100) : 0;
  return { id: uid(), customer, project, tenderMonth: tender, signMonth: sign, value, grossProfitRate: rate, grossProfit: computeGp(value, rate), basis };
};

// ==========================================================================
// Dữ liệu mẫu — mỗi khối 1 kế hoạch kỳ 01/2026 – 12/2027 (gộp hồ sơ năm 2026 đã duyệt + đăng ký năm 2027).
// Phiên bản đã duyệt (kỳ 01/2026 – 12/2026) vẫn là mục tiêu chính thức tới khi bản điều chỉnh được BOD duyệt.
// ==========================================================================
const log = (at: string, by: string, action: string, version: number, extra: Partial<TargetLog> = {}): TargetLog => ({ at, by, action, version, ...extra });
const APPROVE = 'BOD phê duyệt — ghi nhận kế hoạch chính thức';
const CFO_APPROVE = 'CFO phê duyệt — chuyển BOD duyệt';
const firstRound = (d: string, created: string, sent: string, ok: string, note?: string) => [
  log(`${created}T02:00:00.000Z`, `GĐK ${d}`, 'Tạo hồ sơ', 1, { changes: ['Kỳ kế hoạch 01/2026 – 12/2026'] }),
  log(`${sent}T09:00:00.000Z`, `GĐK ${d}`, 'Gửi duyệt', 1),
  log(`${sent}T15:00:00.000Z`, 'CFO', CFO_APPROVE, 1),
  ...(ok ? [log(`${ok}T08:30:00.000Z`, 'BOD', APPROVE, 1, note ? { note } : {})] : []),
];
const EXTEND = 'Kỳ kế hoạch 01/2026 – 12/2026 → 01/2026 – 12/2027';
/** Kế hoạch kỳ 01/2026 – 12/2027 của khối: `y26` = các dòng năm 2026 (phiên bản đã duyệt `effV`), `y27` = dòng năm 2027 đăng ký thêm ở bản điều chỉnh. */
const plan = (division: string, effV: number, y26: TargetRow[], y27: TargetRow[], extra: Partial<TargetPlan>, history: TargetLog[]): TargetPlan => ({
  id: `TP-${division}-2026-01`,
  division,
  from: '2026-01',
  to: '2027-12',
  author: `GĐK ${division}`,
  version: y27.length ? effV + 1 : effV,
  status: 'Đã duyệt',
  rows: [...y26, ...y27],
  effectiveVersion: effV,
  effectiveRows: y26.map((x) => ({ ...x })),
  effectiveFrom: '2026-01',
  effectiveTo: y27.length ? '2026-12' : '2027-12',
  decisionBy: 'BOD',
  history,
  ...extra,
});

const G1_26 = [
  r('Bộ 022', 'Nền tảng chuyển đổi số quốc gia', '2025-11', '2026-01', 16_000, 6080, 'Đã trúng thầu 11/2025, chờ ký HĐ'),
  r('Tập đoàn 022', 'ERP Tập đoàn 022', '2025-12', '2026-01', 5000, 1400, 'Khách hàng hiện hữu, đã có chủ trương đầu tư'),
  r('Bộ 022', 'Hệ thống dữ liệu dân cư mở rộng', '2026-05', '2026-07', 1500, 380, 'Mở rộng từ Nền tảng chuyển đổi số quốc gia'),
  r('Tập đoàn 022', 'Mở rộng ERP phân hệ kho', '2026-06', '2026-09', 800, 200),
  r('Sở Tài chính 022', 'Cổng thanh toán điện tử tỉnh', '2026-08', '2026-10', 1200, 300, 'Đã khảo sát, khách hàng gửi đề xuất kỹ thuật'),
  r('Bộ 022', '022.NSG', '2026-09', '2026-11', 6000, 1800, 'Dự án trọng điểm, PAKD đang trình duyệt'),
];
const G1_27 = [
  r('Khách hàng A', 'Dự án A1', '2027-01', '2027-02', 5400, 1350),
  r('Khách hàng A', 'Dự án A2', '2027-02', '2027-03', 4200, 1050),
  r('Khách hàng B', 'Dự án B1', '2027-03', '2027-04', 4800, 960),
  r('Khách hàng B', 'Dự án B2', '2027-04', '2027-05', 3000, 600),
  r('Khách hàng C', 'Dự án C1', '2027-05', '2027-06', 3600, 1080),
  r('Khách hàng C', 'Dự án C2', '2027-06', '2027-07', 2400, 720),
  r('Khách hàng D', 'Dự án D1', '2027-07', '2027-08', 4200, 840),
  r('Khách hàng E', 'Dự án E1', '2027-08', '2027-09', 2400, 360),
];

const SEED: TargetPlan[] = [
  // G1: đã duyệt V2 (kỳ 2026) → đang soạn V3 mở rộng kỳ tới 12/2027 (Bản nháp)
  plan('G1', 2, G1_26, G1_27, { status: 'Bản nháp', bodNote: 'Đồng ý điều chỉnh tiến độ quý 2, giữ nguyên tổng mục tiêu.' }, [
    ...firstRound('G1', '2025-12-03', '2025-12-15', '2025-12-22'),
    log('2026-06-10T03:00:00.000Z', 'GĐK G1', 'Lưu nháp', 2, { changes: ['Sửa 022.NSG: ra thầu 06/2026 → 09/2026; ký HĐ 08/2026 → 11/2026', 'Sửa Mở rộng ERP phân hệ kho: ký HĐ 07/2026 → 09/2026'] }),
    log('2026-06-12T09:00:00.000Z', 'GĐK G1', 'Gửi duyệt', 2),
    log('2026-06-12T14:00:00.000Z', 'CFO', CFO_APPROVE, 2),
    log('2026-06-20T08:30:00.000Z', 'BOD', APPROVE, 2, { note: 'Đồng ý điều chỉnh tiến độ quý 2, giữ nguyên tổng mục tiêu.' }),
    log('2026-09-30T08:00:00.000Z', 'GĐK G1', 'Lưu nháp', 3, { changes: [EXTEND, ...G1_27.map((x) => `Thêm ${x.project} — ${x.customer}: ${fmtN(x.value)} VNĐ`)] }),
  ]),
  // G2: đã duyệt V1 (kỳ 2026) → V2 mở rộng tới 12/2027 đang chờ CFO
  plan(
    'G2',
    1,
    [
      r('Bán lẻ 045', 'Data Lake phân tích khách hàng', '2025-12', '2026-01', 950, 230, 'Đã chốt phạm vi với khách hàng'),
      r('Bán lẻ 045', 'Hệ thống bán lẻ đa kênh', '2025-12', '2026-02', 2100, 630, 'Khách hàng hiện hữu'),
      r('Kho bạc 045', 'Chuyển đổi số kho bạc', '2026-09', '2026-12', 1600, 400, 'Giai đoạn 1, khả năng mở rộng GĐ2 năm 2027'),
    ],
    [
      r('Bán lẻ 045', 'Mở rộng hệ thống bán lẻ', '2027-01', '2027-03', 2200, 480, 'Khách hàng hiện hữu, đã có chủ trương'),
      r('Kho bạc 045', 'Chuyển đổi số kho bạc GĐ2', '2027-04', '2027-06', 1800, 360, 'Nối tiếp GĐ1'),
      r('Sở Tài chính 045', 'Cổng dịch vụ tài chính', '2027-06', '2027-09', 1400, 350),
    ],
    { status: 'Chờ CFO duyệt' },
    [
      ...firstRound('G2', '2025-12-05', '2025-12-16', '2025-12-23'),
      log('2026-09-20T03:00:00.000Z', 'GĐK G2', 'Lưu nháp', 2, { changes: [EXTEND, 'Thêm 3 dự án ký HĐ năm 2027'] }),
      log('2026-09-28T09:30:00.000Z', 'GĐK G2', 'Gửi duyệt', 2),
    ],
  ),
  // G3: đã duyệt V1 (kỳ 2026) → V2 mở rộng tới 12/2027, CFO đã duyệt, chờ BOD
  plan(
    'G3',
    1,
    [
      r('Tổng công ty 038', 'Hệ thống giám sát dữ liệu tập trung', '2025-12', '2026-02', 1800, 540, 'Đã trình chủ trương, dự kiến ký Q1'),
      r('Tổng công ty 038', 'Nâng cấp hạ tầng giám sát GĐ2', '2026-07', '2026-10', 700, 180, 'Nối tiếp hệ thống giám sát GĐ1'),
    ],
    [
      r('Tổng công ty 038', 'Mở rộng hệ thống giám sát GĐ3', '2026-12', '2027-02', 1100, 280, 'Nối tiếp GĐ2'),
      r('Tổng công ty 038', 'Trung tâm điều hành an ninh', '2027-03', '2027-07', 1900, 380, 'Đã trình chủ trương'),
    ],
    { status: 'Chờ BOD duyệt', decisionBy: 'CFO', bodNote: 'Đồng ý, chuyển BOD.' },
    [
      ...firstRound('G3', '2025-12-08', '2025-12-17', '2025-12-23'),
      log('2026-10-12T02:00:00.000Z', 'GĐK G3', 'Lưu nháp', 2, { changes: [EXTEND, 'Thêm 2 dự án ký HĐ năm 2027'] }),
      log('2026-10-14T09:00:00.000Z', 'GĐK G3', 'Gửi duyệt', 2),
      log('2026-10-16T08:00:00.000Z', 'CFO', CFO_APPROVE, 2, { note: 'Đồng ý, chuyển BOD.' }),
    ],
  ),
  // G4: đã duyệt V2 (kỳ 2026) → V3 mở rộng tới 12/2027 đã gửi rồi rút
  plan(
    'G4',
    2,
    [
      r('Sản xuất 061', 'Nền tảng IoT nhà máy', '2025-11', '2026-01', 2800, 700, 'Đã trúng thầu'),
      r('Sản xuất 061', 'Triển khai ERP giai đoạn 2', '2026-04', '2026-07', 600, 150, 'Nối tiếp ERP GĐ1 (061.015) kết thúc 06/2026'),
      r('Sản xuất 061', 'Bảo trì hệ thống MES', '2026-09', '2026-11', 300, 90),
    ],
    [r('Sản xuất 061', 'Nâng cấp dây chuyền MES', '2027-01', '2027-05', 4000, 800, 'Chờ chốt ngân sách khách hàng')],
    { status: 'Đã rút', withdrawReason: 'Khách hàng chưa chốt ngân sách, cần cập nhật lại giá trị.' },
    [
      ...firstRound('G4', '2025-12-04', '2025-12-15', '2025-12-22'),
      log('2026-09-08T02:00:00.000Z', 'GĐK G4', 'Lưu nháp', 2, { changes: ['Sửa Bảo trì hệ thống MES: ký HĐ 09/2026 → 11/2026'] }),
      log('2026-09-10T09:00:00.000Z', 'GĐK G4', 'Gửi duyệt', 2),
      log('2026-09-10T14:00:00.000Z', 'CFO', CFO_APPROVE, 2),
      log('2026-09-18T08:30:00.000Z', 'BOD', APPROVE, 2),
      log('2026-10-20T02:00:00.000Z', 'GĐK G4', 'Lưu nháp', 3, { changes: [EXTEND, 'Thêm Nâng cấp dây chuyền MES — Sản xuất 061: 4,000,000,000 VNĐ'] }),
      log('2026-10-21T09:00:00.000Z', 'GĐK G4', 'Gửi duyệt', 3),
      log('2026-10-22T03:00:00.000Z', 'GĐK G4', 'Rút hồ sơ', 3, { note: 'Khách hàng chưa chốt ngân sách, cần cập nhật lại giá trị.' }),
    ],
  ),
  // BFSI: kỳ 01/2026 – 12/2027 đã duyệt V2 (mới đăng ký dự án năm 2026)
  plan(
    'BFSI',
    2,
    [
      r('Ngân hàng 010', 'Hệ thống chấm điểm tín dụng', '2025-11', '2026-01', 8000, 2000, 'Đã trúng thầu, đàm phán giá trị cuối'),
      r('CÔNG TY CỔ PHẦN GALAXY TECHNOLOGY SERVICES', 'HDBank Staffing', '2025-12', '2026-01', 800, 120, 'Gia hạn HĐ cho thuê nhân sự'),
      r('CÔNG TY CỔ PHẦN ATOMI DIGITAL', 'LPB Staffing', '2025-12', '2026-01', 360, 50, 'Gia hạn HĐ cho thuê nhân sự'),
      r('Ngân hàng 010', 'Cho thuê nhân sự kiểm thử', '2026-05', '2026-06', 400, -40, 'Chấp nhận lỗ để giữ khách hàng, bù bằng Core Banking Mobile Upgrade'),
      r('Ngân hàng 010', 'Core Banking Mobile Upgrade', '2026-08', '2026-10', 1500, 380, 'Khách hàng đã gửi RFP sơ bộ, tham chiếu dự án chấm điểm tín dụng'),
    ],
    [],
    {},
    [
      log('2025-12-02T02:00:00.000Z', 'GĐK BFSI', 'Tạo hồ sơ', 1, { changes: ['Kỳ kế hoạch 01/2026 – 12/2027'] }),
      log('2025-12-12T09:00:00.000Z', 'GĐK BFSI', 'Gửi duyệt', 1),
      log('2025-12-12T15:00:00.000Z', 'CFO', CFO_APPROVE, 1),
      log('2025-12-18T08:30:00.000Z', 'BOD', 'BOD từ chối — trả về CFO', 1, { note: 'Bổ sung thuyết minh cho Core Banking Mobile Upgrade; LN gộp chấm điểm tín dụng cần đạt tối thiểu 25%.' }),
      log('2025-12-19T03:00:00.000Z', 'CFO', 'CFO từ chối', 1, { note: 'Đề nghị GĐK bổ sung thuyết minh và điều chỉnh LN gộp theo ý kiến BOD.' }),
      log('2025-12-22T03:00:00.000Z', 'GĐK BFSI', 'Gửi duyệt', 2, { changes: ['Sửa Hệ thống chấm điểm tín dụng: LN gộp', 'Sửa Core Banking Mobile Upgrade: thuyết minh'] }),
      log('2025-12-23T03:00:00.000Z', 'CFO', CFO_APPROVE, 2),
      log('2025-12-26T08:30:00.000Z', 'BOD', APPROVE, 2),
    ],
  ),
  // GPDV: kỳ 01/2026 – 12/2027 đã duyệt V1
  plan(
    'GPDV',
    1,
    [
      r('CÔNG TY CỔ PHẦN CÔNG NGHỆ TÀI CHÍNH DIGILEND', 'Digilend', '2025-12', '2026-01', 300, 80, 'Gia hạn HĐ dịch vụ'),
      r('Tổng công ty 077', 'Dịch vụ vận hành hạ tầng', '2025-12', '2026-01', 250, 60, 'Gia hạn HĐ vận hành'),
      r('Tổng công ty 077', 'Giám sát an ninh mạng SOC', '2026-06', '2026-08', 450, -80, 'Năm đầu đầu tư hạ tầng SOC, lỗ; có lãi từ năm 2027'),
    ],
    [],
    {},
    [
      log('2025-12-09T02:00:00.000Z', 'GĐK GPDV', 'Tạo hồ sơ', 1, { changes: ['Kỳ kế hoạch 01/2026 – 12/2027'] }),
      log('2025-12-18T09:00:00.000Z', 'GĐK GPDV', 'Gửi duyệt', 1),
      log('2025-12-18T15:00:00.000Z', 'CFO', CFO_APPROVE, 1),
      log('2025-12-24T08:30:00.000Z', 'BOD', APPROVE, 1),
    ],
  ),
];

interface Ctx {
  plans: TargetPlan[];
  /** Trả "" nếu thành công, ngược lại là thông báo lỗi nghiệp vụ. */
  savePlan: (p: TargetPlan, by: string, submit: boolean) => string;
  withdraw: (id: string, reason: string, by: string) => void;
  decide: (id: string, approve: boolean, note: string, by: string, role: 'CFO' | 'BOD') => void;
}
const TargetCtx = createContext<Ctx | null>(null);

// --------------------------------------------------------------------------
// Kiểm tra dữ liệu (port BusinessProjectTargetCalculator)
// --------------------------------------------------------------------------
const monthValid = (ym: string) => /^\d{4}-(0[1-9]|1[0-2])$/.test(ym);
/** Kỳ kế hoạch Từ tháng – Đến tháng (YYYY-MM). */
export type Period = { from: string; to: string };
const monthInPeriod = (ym: string, p: Period) => monthValid(ym) && ym >= p.from && ym <= p.to;
const tenderAfterSign = (x: TargetRow) => !!x.tenderMonth && !!x.signMonth && x.tenderMonth > x.signMonth;
/** Ra thầu được trước kỳ kế hoạch, nhưng không sau tháng cuối của kỳ. */
const tenderOutOfRange = (ym: string, p: Period) => !monthValid(ym) || ym > p.to;
const tenderInvalid = (x: TargetRow, p: Period) => !!x.tenderMonth && (tenderOutOfRange(x.tenderMonth, p) || tenderAfterSign(x));
const signInvalid = (x: TargetRow, p: Period) => !!x.signMonth && (!monthInPeriod(x.signMonth, p) || tenderAfterSign(x));
const rateValid = (rate: number | null) => rate == null || (Number.isInteger(rate) && Math.abs(rate) <= MAX_RATE);
const monthError = (x: TargetRow, i: number, p: Period) => {
  if (x.signMonth && !monthInPeriod(x.signMonth, p)) return `Dòng ${i + 1}: tháng ký HĐ phải thuộc kỳ kế hoạch ${periodText(p)}.`;
  if (x.tenderMonth && tenderOutOfRange(x.tenderMonth, p)) return `Dòng ${i + 1}: tháng ra thầu không được sau ${my(p.to)} (cuối kỳ kế hoạch).`;
  if (tenderAfterSign(x)) return `Dòng ${i + 1}: tháng ra thầu phải trước hoặc bằng tháng ký HĐ.`;
  return '';
};
const rateError = (i: number) => `Dòng ${i + 1}: % LN gộp phải là số nguyên trong khoảng từ -${fmt(MAX_RATE)}% đến ${fmt(MAX_RATE)}%.`;
/** Lưu nháp: ≥ 1 dòng (trừ khi hồ sơ đã có dòng lưu — cho xoá hết), mỗi dòng bắt buộc Khách hàng + Tên dự án; kiểm trần % / giá trị / tháng. */
const validateDraft = (rows: TargetRow[], year: Period, allowEmpty: boolean) => {
  if (!rows.length) return allowEmpty ? '' : 'Chưa có dự án đăng ký.';
  for (let i = 0; i < rows.length; i++) {
    const x = rows[i];
    if (!x.customer.trim() || !x.project.trim()) return `Dòng ${i + 1}: nhập đủ Khách hàng và Tên dự án.`;
    if (!rateValid(x.grossProfitRate)) return rateError(i);
    if (x.value > MAX_VALUE) return `Dòng ${i + 1}: HĐ ký mới tối đa ${fmt(MAX_VALUE)} VNĐ.`;
    const e = monthError(x, i, year);
    if (e) return e;
  }
  return '';
};
/** Gửi duyệt: thêm bắt buộc Ra thầu, Ký HĐ, Giá trị > 0, % LN gộp, Cơ sở đăng ký. */
const validateSubmit = (rows: TargetRow[], year: Period) => {
  if (!rows.length) return 'Chưa có dự án đăng ký.';
  for (let i = 0; i < rows.length; i++) {
    const x = rows[i];
    if (!x.customer.trim() || !x.project.trim() || !x.tenderMonth || !x.signMonth || !(x.value > 0) || x.grossProfitRate == null || !x.basis.trim())
      return `Dòng ${i + 1}: nhập đủ Khách hàng, Tên dự án, Ra thầu, Ký HĐ, Giá trị, % LN gộp mục tiêu và Cơ sở đăng ký.`;
    if (x.value > MAX_VALUE) return `Dòng ${i + 1}: HĐ ký mới tối đa ${fmt(MAX_VALUE)} VNĐ.`;
    if (!rateValid(x.grossProfitRate)) return rateError(i);
    const e = monthError(x, i, year);
    if (e) return e;
  }
  return '';
};
/** Kỳ kế hoạch hợp lệ: đủ Từ – Đến, Từ ≤ Đến, không chồng kỳ khác của cùng khối. */
const periodError = (p: TargetPlan, plans: TargetPlan[]) => {
  if (!monthValid(p.from) || !monthValid(p.to)) return 'Nhập đủ kỳ kế hoạch Từ tháng – Đến tháng (MM/YYYY).';
  if (p.from > p.to) return 'Kỳ kế hoạch: Từ tháng phải nhỏ hơn hoặc bằng Đến tháng.';
  const hit = plans.find((x) => x.id !== p.id && x.division === p.division && overlaps(x, p));
  return hit ? `Kỳ ${periodText(p)} chồng với kế hoạch ${periodText(hit)} của khối ${p.division} — mỗi tháng chỉ thuộc 1 kế hoạch; hãy điều chỉnh kế hoạch đó hoặc chọn kỳ khác.` : '';
};
const overlaps = (a: Period, b: Period) => a.from <= b.to && b.from <= a.to;
const rowsChanged = (before: TargetRow[], after: TargetRow[]) => {
  if (before.length !== after.length) return true;
  const b = new Map(before.map((x) => [x.id, x]));
  return after.some((x) => {
    const o = b.get(x.id);
    return !o || o.customer !== x.customer || o.project !== x.project || o.tenderMonth !== x.tenderMonth || o.signMonth !== x.signMonth || o.value !== x.value || o.grossProfitRate !== x.grossProfitRate || o.basis !== x.basis;
  });
};

/** So sánh 2 bản đăng ký → danh sách nội dung đã điều chỉnh (để lưu lịch sử). */
const diffRows = (before: TargetRow[] = [], after: TargetRow[]): string[] => {
  const out: string[] = [];
  const b = new Map(before.map((x) => [x.id, x]));
  const gpText = (x: TargetRow) => (x.grossProfitRate == null ? '—' : fmt(x.grossProfit));
  after.forEach((x) => {
    const o = b.get(x.id);
    if (!o) return out.push(`Thêm ${x.project || '(chưa đặt tên)'} — ${x.customer || '—'}: ${fmt(x.value)} VNĐ`);
    const ch: string[] = [];
    if (o.customer !== x.customer) ch.push(`khách hàng ${o.customer || '—'} → ${x.customer || '—'}`);
    if (o.project !== x.project) ch.push(`tên ${o.project || '—'} → ${x.project || '—'}`);
    if (o.tenderMonth !== x.tenderMonth) ch.push(`ra thầu ${my(o.tenderMonth)} → ${my(x.tenderMonth)}`);
    if (o.signMonth !== x.signMonth) ch.push(`ký HĐ ${my(o.signMonth)} → ${my(x.signMonth)}`);
    if (o.value !== x.value) ch.push(`HĐ ký mới ${fmt(o.value)} → ${fmt(x.value)}`);
    if (o.grossProfit !== x.grossProfit || (o.grossProfitRate == null) !== (x.grossProfitRate == null)) ch.push(`LN gộp ${gpText(o)} → ${gpText(x)}`);
    if (o.basis !== x.basis) ch.push('cơ sở đăng ký'); // D11
    if (ch.length) out.push(`Sửa ${x.project || o.project || '(chưa đặt tên)'}: ${ch.join('; ')}`);
  });
  const ids = new Set(after.map((x) => x.id));
  before.filter((x) => !ids.has(x.id)).forEach((x) => out.push(`Xoá ${x.project || '(chưa đặt tên)'} — ${x.customer || '—'}`));
  return out;
};

export const BizTargetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<TargetPlan[]>(SEED);
  const { targets, setYearTargets } = useBusinessProjects();

  const savePlan = (p: TargetPlan, by: string, submit: boolean): string => {
    const old = plans.find((x) => x.id === p.id);
    const rows = p.rows.map((x) => ({ ...x, grossProfit: computeGp(x.value, x.grossProfitRate) }));
    // BR6: đang chờ duyệt (CFO / BOD) thì không lưu / gửi lại được — chỉ rút.
    if (old && isPending(old.status)) return 'Hồ sơ đang chờ duyệt — không sửa hoặc gửi lại được. Rút hồ sơ nếu cần điều chỉnh.';
    const pErr = periodError(p, plans);
    if (pErr) return pErr;
    const periodChanged = !!old && (old.from !== p.from || old.to !== p.to);
    const changed = old ? rowsChanged(old.rows, rows) || periodChanged : true;
    // Gửi lại nguyên phiên bản đã duyệt là vô nghĩa.
    if (old && !changed && submit && old.status === 'Đã duyệt') return 'Nội dung chưa thay đổi so với phiên bản đã duyệt — không cần gửi lại.';
    // Lưu nháp không có thay đổi ⇒ không ghi nhận gì (không log, không đổi trạng thái).
    if (old && !changed && !submit) return '';
    // BR12: phiên bản đã có quyết định (BOD duyệt / từ chối, CFO từ chối) không bị ghi đè — sửa nội dung sang phiên bản mới.
    const decided = !!old && old.history.some((h) => h.version === old.version && DECISION_ACTIONS.includes(h.action));
    const version = !old ? 1 : !changed ? old.version : decided || old.status === 'Đã duyệt' || old.status === 'Từ chối' ? old.version + 1 : old.version;
    const logs: TargetLog[] = [];
    const changes = [...(!old ? [`Kỳ kế hoạch ${periodText(p)}`] : periodChanged ? [`Kỳ kế hoạch ${periodText(old)} → ${periodText(p)}`] : []), ...diffRows(old?.rows, rows)];
    if (!old) logs.push({ at: now(), by, action: 'Tạo hồ sơ', version, changes: changes.length ? changes : undefined });
    else if (!submit || changed) logs.push({ at: now(), by, action: submit ? 'Gửi duyệt' : 'Lưu nháp', version, changes: changed && changes.length ? changes : undefined });
    if (!old && submit) logs.push({ at: new Date(Date.now() + 1).toISOString(), by, action: 'Gửi duyệt', version });
    if (old && submit && !changed) logs.splice(0, logs.length, { at: now(), by, action: 'Gửi duyệt', version });
    const next: TargetPlan = {
      ...(old || p),
      from: p.from,
      to: p.to,
      rows,
      version,
      status: submit ? 'Chờ CFO duyệt' : 'Bản nháp',
      returnedByBod: false,
      withdrawReason: submit ? undefined : old?.withdrawReason,
      history: [...(old?.history || []), ...logs],
    };
    setPlans((prev) => (old ? prev.map((x) => (x.id === p.id ? next : x)) : [next, ...prev]));
    return '';
  };

  /** GĐK rút hồ sơ đang chờ duyệt (CFO / BOD); giữ nguyên phiên bản, lý do bắt buộc. */
  const withdraw = (id: string, reason: string, by: string) =>
    setPlans((prev) =>
      prev.map((x) =>
        x.id === id && isPending(x.status)
          ? { ...x, status: 'Đã rút', withdrawReason: reason, history: [...x.history, { at: now(), by, action: 'Rút hồ sơ', version: x.version, note: reason }] }
          : x,
      ),
    );

  /** CFO (Chờ CFO: duyệt ⇒ Chờ BOD, từ chối ⇒ Từ chối) hoặc BOD (Chờ BOD: duyệt ⇒ Đã duyệt, từ chối ⇒ trả về Chờ CFO). */
  const decide = (id: string, approve: boolean, note: string, by: string, role: 'CFO' | 'BOD') => {
    const p = plans.find((x) => x.id === id);
    if (!p || !canDecide(p.status, role)) return;
    const cfoStep = p.status === 'Chờ CFO duyệt';
    const [status, action]: [TargetStatus, string] = cfoStep
      ? approve
        ? ['Chờ BOD duyệt', 'CFO phê duyệt — chuyển BOD duyệt']
        : ['Từ chối', 'CFO từ chối']
      : approve
        ? ['Đã duyệt', 'BOD phê duyệt — ghi nhận kế hoạch chính thức']
        : ['Chờ CFO duyệt', 'BOD từ chối — trả về CFO'];
    setPlans((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              status,
              bodNote: note || undefined,
              decisionBy: role,
              returnedByBod: !cfoStep && !approve,
              // BR11: BOD duyệt ⇒ phiên bản này là mục tiêu chính thức.
              ...(status === 'Đã duyệt' ? { effectiveVersion: x.version, effectiveRows: x.rows.map((y) => ({ ...y })), effectiveFrom: x.from, effectiveTo: x.to } : {}),
              history: [...x.history, { at: now(), by, action, version: x.version, note: note || undefined }],
            }
          : x,
      ),
    );
    // BR27: ghi nhận mục tiêu ký HĐ chính thức của khối theo từng năm (= Σ HĐ ký mới các dòng có Ký HĐ trong năm, mọi kế hoạch đã duyệt của khối)
    // cho Sổ theo dõi dự án / Tổng quan / Lập kế hoạch khối. Năm không còn dòng nào (đổi kỳ) ⇒ 0.
    if (status === 'Đã duyệt') {
      const nextPlans = plans.map((x) => (x.id === id ? { ...x, effectiveRows: x.rows } : x));
      const byYear = yearTargetsOf(nextPlans, p.division);
      const years = new Set<string>([...Object.keys(byYear), ...yearsOf(p).map(String), ...(p.effectiveRows || []).map((x) => x.signMonth.slice(0, 4)).filter(Boolean)]);
      years.forEach((y) => setYearTargets(y, { ...(targets[y] || {}), [p.division]: byYear[y] || 0 }));
    }
  };

  return <TargetCtx.Provider value={{ plans, savePlan, withdraw, decide }}>{children}</TargetCtx.Provider>;
};
export const useBizTargets = () => {
  const c = useContext(TargetCtx);
  if (!c) throw new Error('BizTargetProvider missing');
  return c;
};

// ==========================================================================
// Định dạng & tính toán
// ==========================================================================
const fmt = (n: number) => Math.round(n || 0).toLocaleString('en-US');
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const my = (ym: string) => (ym ? `${ym.slice(5, 7)}/${ym.slice(0, 4)}` : '—');
const dt = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};
const totals = (rows: TargetRow[]) => {
  const value = rows.reduce((s, x) => s + (x.value || 0), 0);
  const grossProfit = rows.reduce((s, x) => s + (x.grossProfit || 0), 0);
  return { value, grossProfit, rate: value ? grossProfit / value : 0 };
};
// Lọc theo khoảng tháng Ký HĐ (YYYY-MM, so chuỗi); trống một đầu = mở đầu đó; trống cả hai = không lọc. Cho phép xuyên năm.
const inRange = (ym: string, from: string, to: string) => !!ym && (!from || ym >= from) && (!to || ym <= to);
const rowsInRange = (rows: TargetRow[], from: string, to: string) => (!from && !to ? rows : rows.filter((x) => inRange(x.signMonth, from, to)));
const rangeError = (from: string, to: string) => (from && to && from > to ? 'Từ tháng phải nhỏ hơn hoặc bằng Đến tháng.' : '');
const rangeText = (from: string, to: string) => (from && to ? `${my(from)} – ${my(to)}` : from ? `Từ ${my(from)}` : to ? `Đến ${my(to)}` : 'Tất cả thời gian');
const yearRange = (y: number) => ({ from: `${y}-01`, to: `${y}-12` });
export const periodText = (p: Period) => `${my(p.from)} – ${my(p.to)}`;
/** Số tháng của kỳ (tính cả 2 đầu). */
const periodMonths = (p: Period) => (+p.to.slice(0, 4) - +p.from.slice(0, 4)) * 12 + (+p.to.slice(5, 7) - +p.from.slice(5, 7)) + 1;
const yearsOf = (p: Period) => Array.from({ length: +p.to.slice(0, 4) - +p.from.slice(0, 4) + 1 }, (_, i) => +p.from.slice(0, 4) + i);
const addMonth = (ym: string, n: number) => {
  const t = +ym.slice(0, 4) * 12 + +ym.slice(5, 7) - 1 + n;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`;
};
/** Mục tiêu chính thức theo năm của 1 khối = Σ Giá trị các dòng (phiên bản đã duyệt) có tháng Ký HĐ trong năm, trên mọi kế hoạch của khối. */
export const yearTargetsOf = (plans: TargetPlan[], division: string) => {
  const m: Record<string, number> = {};
  plans
    .filter((p) => p.division === division && p.effectiveRows)
    .forEach((p) => p.effectiveRows!.forEach((x) => x.signMonth && (m[x.signMonth.slice(0, 4)] = (m[x.signMonth.slice(0, 4)] || 0) + (x.value || 0))));
  return m;
};
const groupBy = (rows: TargetRow[], key: (x: TargetRow) => string) => {
  const m = new Map<string, { value: number; grossProfit: number }>();
  rows.forEach((x) => {
    const k = key(x) || '—';
    const o = m.get(k) || { value: 0, grossProfit: 0 };
    o.value += x.value || 0;
    o.grossProfit += x.grossProfit || 0;
    m.set(k, o);
  });
  return [...m.entries()].map(([label, v]) => ({ label, ...v }));
};

const STATUS_CLS: Record<TargetStatus, string> = {
  'Bản nháp': 'bg-slate-100 text-slate-700 border-slate-300',
  'Chờ CFO duyệt': 'bg-amber-50 text-amber-700 border-amber-300',
  'Chờ BOD duyệt': 'bg-amber-50 text-amber-700 border-amber-300',
  'Đã duyệt': 'bg-emerald-50 text-emerald-700 border-emerald-300',
  'Từ chối': 'bg-rose-50 text-rose-700 border-rose-300',
  'Đã rút': 'bg-purple-50 text-purple-700 border-purple-300',
};
const statusText = (p: TargetPlan) => `${p.status} — Phiên bản ${String(p.version).padStart(2, '0')}`;

// ==========================================================================
// Biểu đồ cột nhóm: Giá trị mục tiêu & LN gộp (cùng một trục, VNĐ)
// ==========================================================================
const C_VALUE = '#1f5fa8';
const C_GP = '#e0883a';

const C_LOSS = '#c0392b';

/**
 * Trục giá trị: phần dương chia 4–5 vạch "đẹp"; có số âm thì thêm vùng âm phía dưới 0
 * (tối thiểu ~12% chiều cao để cột lỗ nhỏ vẫn nhìn thấy), làm tròn theo nửa bước chia.
 */
const niceAxis = (lo: number, hi: number) => {
  const raw = Math.max(1, hi) / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((x) => x >= raw) || 10 * mag;
  const top = Math.max(step, Math.ceil(hi / step) * step);
  const ticks: number[] = [];
  for (let t = 0; t <= top + step / 2; t += step) ticks.push(Math.round(t));
  let bottom = 0;
  if (lo < 0) {
    const half = step / 2;
    bottom = -Math.ceil(Math.max(-lo, top * 0.12) / half) * half;
    for (let t = -step; t > bottom + half / 2; t -= step) ticks.unshift(Math.round(t));
    ticks.unshift(Math.round(bottom));
  }
  return { bottom, top, ticks };
};

const TargetChart: React.FC<{ data: { label: string; value: number; grossProfit: number }[] }> = ({ data }) => {
  const [hover, setHover] = useState<number | null>(null);
  const hi = Math.max(1, ...data.map((d) => Math.max(d.value, d.grossProfit)));
  const lo = Math.min(0, ...data.map((d) => Math.min(d.value, d.grossProfit)));
  const { bottom, top, ticks } = niceAxis(lo, hi);
  const span = top - bottom;
  /** Vị trí (% từ đáy khung) của một giá trị. */
  const y = (v: number) => ((v - bottom) / span) * 100;
  const zero = y(0);
  const hasLoss = data.some((d) => d.grossProfit < 0);
  if (!data.length) return <p className="py-10 text-center text-[12px] text-slate-400">Chưa có dữ liệu đăng ký.</p>;
  return (
    <div>
      <div className="flex items-center gap-4 text-[11.5px] text-slate-600 mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[2px]" style={{ background: C_VALUE }} /> Giá trị mục tiêu
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[2px]" style={{ background: C_GP }} /> LN gộp
        </span>
        {hasLoss && (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[2px]" style={{ background: C_LOSS }} /> LN gộp âm (lỗ)
          </span>
        )}
        <span className="text-slate-400">ĐVT: VNĐ</span>
      </div>
      <div className="flex gap-2 mt-4">
        {/* trục giá trị */}
        <div className="relative w-28 h-[220px] text-[10.5px] text-slate-400 tabular-nums">
          {ticks.map((t) => (
            <span key={t} className={`absolute right-1 ${t < 0 ? 'text-rose-500' : ''}`} style={{ bottom: `${y(t)}%`, transform: 'translateY(50%)' }}>
              {fmt(t)}
            </span>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="relative h-[220px] border-b border-slate-200">
            {ticks.map((t) => (
              <div key={t} className={`absolute inset-x-0 border-t ${t === 0 ? 'border-slate-400' : 'border-slate-100'}`} style={{ bottom: `${y(t)}%` }} />
            ))}
            {bottom < 0 && <div className="absolute inset-x-0 bottom-0 bg-rose-50/50" style={{ height: `${zero}%` }} />}
            <div className="absolute inset-0 flex">
              {data.map((d, i) => (
                <div
                  key={d.label}
                  className="relative flex-1 h-full flex justify-center gap-[2px] cursor-default"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  {hover === i && <div className="absolute inset-y-0 inset-x-1 bg-slate-100/70 rounded-[3px]" />}
                  {([
                    [d.value, C_VALUE],
                    [d.grossProfit, d.grossProfit < 0 ? C_LOSS : C_GP],
                  ] as [number, string][]).map(([v, c], j) => (
                    <div key={j} className="relative w-[min(26px,30%)] h-full">
                      {v !== 0 && (
                        <div
                          className={`absolute inset-x-0 ${v > 0 ? 'rounded-t-[4px]' : 'rounded-b-[4px]'}`}
                          style={
                            v > 0
                              ? { bottom: `${zero}%`, height: `${y(v) - zero}%`, minHeight: 2, background: c }
                              : { top: `${100 - zero}%`, height: `${zero - y(v)}%`, minHeight: 3, background: c }
                          }
                        >
                          {v < 0 && <span className="absolute left-1/2 -translate-x-1/2 top-full mt-0.5 text-[10px] font-semibold text-rose-700 tabular-nums whitespace-nowrap">{fmt(v)}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                  {hover === i && (
                    <div className="absolute z-10 top-0 -translate-y-full left-1/2 -translate-x-1/2 whitespace-nowrap bg-white border border-slate-300 shadow-md rounded-[4px] px-2.5 py-1.5 text-[11.5px] text-slate-700">
                      <p className="font-semibold text-slate-800 mb-0.5">{d.label}</p>
                      <p className="flex items-center gap-1.5 tabular-nums">
                        <span className="w-2 h-2 rounded-[2px]" style={{ background: C_VALUE }} /> Giá trị mục tiêu: <b>{fmt(d.value)}</b>
                      </p>
                      <p className="flex items-center gap-1.5 tabular-nums">
                        <span className="w-2 h-2 rounded-[2px]" style={{ background: d.grossProfit < 0 ? C_LOSS : C_GP }} /> LN gộp:{' '}
                        <b className={d.grossProfit < 0 ? 'text-rose-700' : ''}>{fmt(d.grossProfit)}</b> ({d.value ? pct(d.grossProfit / d.value) : '—'})
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex">
            {data.map((d) => (
              <p key={d.label} className="flex-1 text-center text-[11px] text-slate-600 pt-1 truncate px-0.5" title={d.label}>
                {d.label}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// Khung tổng hợp (dùng chung cho GĐK và BOD)
// ==========================================================================
type Flash = (m: string, kind?: 'ok' | 'error') => void;

/** Hộp thoại dùng chung (xác nhận, rút hồ sơ, import, ý kiến duyệt). */
const Dialog: React.FC<{ title: string; onClose: () => void; footer: React.ReactNode; children: React.ReactNode; width?: number }> = ({ title, onClose, footer, children, width = 480 }) => (
  <div className="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className="bg-white rounded-[4px] shadow-xl w-full border border-slate-300" style={{ maxWidth: width }}>
      <header className="flex items-center justify-between px-4 h-10 border-b border-slate-200 bg-gradient-to-b from-[#f7f9fc] to-[#edf1f6]">
        <h3 className="text-[13px] font-bold text-[#1e3a5f]">{title}</h3>
        <button type="button" onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800">
          <X size={15} />
        </button>
      </header>
      <div className="p-4 text-[12.5px] text-slate-700">{children}</div>
      <footer className="flex justify-end gap-2 px-4 py-3 border-t border-slate-200 bg-slate-50">{footer}</footer>
    </div>
  </div>
);

/** Khung thông tin hồ sơ + ghi chú theo trạng thái (chỉ hiển thị). */
const PlanHeader: React.FC<{ p: TargetPlan; onPeriod?: (pr: Period) => void; periodErr?: string }> = ({ p, onPeriod, periodErr }) => {
  const [reason, setReason] = useState(false);
  const byCfo = p.decisionBy === 'CFO';
  const eff = p.effectiveVersion != null && p.effectiveVersion !== p.version && p.effectiveRows;
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['Khối đăng ký', p.division],
          ['Người lập', p.author],
          [
            'Kỳ kế hoạch',
            onPeriod ? (
              <span className="flex items-center gap-1.5 font-normal" data-testid="plan-period-edit">
                <span className="relative w-28">
                  <MonthInput value={p.from} onChange={(ym) => onPeriod({ from: ym, to: p.to })} className={`${erp.input} !w-full`} invalid={!!periodErr} />
                </span>
                –
                <span className="relative w-28">
                  <MonthInput value={p.to} onChange={(ym) => onPeriod({ from: p.from, to: ym })} className={`${erp.input} !w-full`} invalid={!!periodErr} />
                </span>
              </span>
            ) : (
              <span data-testid="plan-period">
                {periodText(p)} <span className="font-normal text-slate-500">· {periodMonths(p)} tháng</span>
              </span>
            ),
          ],
          [
            'Trạng thái hồ sơ',
            <span className="flex items-center gap-1.5">
              <Tag cls={STATUS_CLS[p.status]}>{statusText(p)}</Tag>
              {p.status === 'Từ chối' && p.bodNote && (
                <button type="button" title={byCfo ? 'Xem lý do CFO từ chối' : 'Xem lý do BOD từ chối'} onClick={() => setReason(true)} className="text-[#1f5fa8] hover:text-[#184c88]">
                  <Eye size={14} />
                </button>
              )}
            </span>,
          ],
        ].map(([k, v]) => (
          <div key={k as string}>
            <p className="text-[11.5px] text-slate-500 mb-1">{k}</p>
            <div className="min-h-8 flex items-center text-[13px] font-semibold text-slate-800">{v}</div>
          </div>
        ))}
      </div>
      {p.status === 'Chờ CFO duyệt' && (
        <>
          <p className="mt-3 text-[12px] text-amber-700">Hồ sơ đang chờ CFO duyệt — Để chỉnh sửa vui lòng thực hiện rút hồ sơ hoặc chờ tới khi CFO phê duyệt hoặc từ chối.</p>
          {p.returnedByBod && p.bodNote && (
            <p className="mt-2 flex items-start gap-1.5 px-3 py-2 rounded-[3px] bg-rose-50 border border-rose-200 text-[12px] text-rose-700 whitespace-pre-wrap">
              <XCircle size={14} className="mt-px shrink-0" /> BOD đã từ chối, trả về CFO xem xét lại — ý kiến BOD: “{p.bodNote}”
            </p>
          )}
        </>
      )}
      {p.status === 'Chờ BOD duyệt' && <p className="mt-3 text-[12px] text-amber-700">Hồ sơ đang chờ BOD duyệt — Để chỉnh sửa vui lòng thực hiện rút hồ sơ hoặc chờ tới khi BOD phê duyệt hoặc từ chối.</p>}
      {p.status === 'Đã rút' && p.withdrawReason && (
        <p className="mt-3 flex items-start gap-1.5 px-3 py-2 rounded-[3px] bg-purple-50 border border-purple-200 text-[12px] text-purple-700">
          <RotateCcw size={14} className="mt-px shrink-0" /> Đã rút: “{p.withdrawReason}”
        </p>
      )}
      {eff && (
        <p className="mt-3 flex items-start gap-1.5 px-3 py-2 rounded-[3px] bg-sky-50 border border-sky-200 text-[12px] text-sky-800">
          <Flag size={14} className="mt-px shrink-0" /> Mục tiêu chính thức — Phiên bản {String(p.effectiveVersion).padStart(2, '0')}
          {p.effectiveFrom && p.effectiveTo ? ` (kỳ ${periodText({ from: p.effectiveFrom, to: p.effectiveTo })})` : ''}: {fmt(totals(p.effectiveRows!).value)} VNĐ · LN gộp {fmt(totals(p.effectiveRows!).grossProfit)} VNĐ
        </p>
      )}
      {periodErr && <p className="mt-2 flex items-center gap-1 text-[12px] text-rose-600 font-semibold"><AlertCircle size={13} /> {periodErr}</p>}
      {reason && (
        <Dialog
          title={byCfo ? 'Lý do từ chối của CFO' : 'Lý do từ chối của BOD'}
          onClose={() => setReason(false)}
          footer={
            <Btn onClick={() => setReason(false)}>Đóng</Btn>
          }
        >
          <p className="whitespace-pre-wrap">{p.bodNote}</p>
        </Dialog>
      )}
    </>
  );
};

const PlanSummary: React.FC<{ rows: TargetRow[]; title?: string; totalLabel?: string; divisionOf?: (row: TargetRow) => string; defaultBy?: 'customer' | 'division' }> = ({ rows, title = 'Tổng mục tiêu khối', totalLabel = 'TỔNG KHỐI', divisionOf, defaultBy }) => {
  // "Theo khối": xem cả công ty ⇒ nhiều cột, mặc định theo khối; màn lập hồ sơ 1 khối ⇒ 1 cột (khối của hồ sơ), mặc định vẫn theo khách hàng.
  const [pick, setBy] = useState<'customer' | 'time' | 'division'>(defaultBy ?? (divisionOf ? 'division' : 'customer'));
  const by = pick === 'division' && !divisionOf ? 'customer' : pick;
  const t = totals(rows);
  const byCustomer = groupBy(rows, (x) => x.customer);
  const byDivision = divisionOf ? groupBy(rows, divisionOf).sort((a, b) => a.label.localeCompare(b.label)) : [];
  const detail = by === 'division' ? byDivision : byCustomer;
  const byTime = groupBy([...rows].sort((a, b) => a.signMonth.localeCompare(b.signMonth)), (x) => my(x.signMonth));
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-3">
      <div className="grid grid-cols-3 xl:grid-cols-1 gap-3">
        <KpiBox label="Tổng giá trị mục tiêu" value={fmt(t.value)} valueText={fmt(t.value)} sub="VNĐ · HĐ ký mới" />
        <KpiBox label="Lợi nhuận gộp mục tiêu" value={fmt(t.grossProfit)} valueText={fmt(t.grossProfit)} sub="VNĐ" />
        <KpiBox label="% Lợi nhuận gộp" value={t.value ? pct(t.rate) : '—'} sub="LN gộp / Giá trị mục tiêu" tone={t.rate >= 0.2 ? 'good' : 'neutral'} />
      </div>
      <Panel
        title={title}
        icon={Target}
        actions={
          <span className="flex items-center gap-2 text-[12px] text-slate-600">
            Thời gian
            <Segmented
              options={[
                ...(divisionOf ? [{ key: 'division' as const, label: 'Theo khối' }] : []),
                { key: 'customer' as const, label: 'Theo khách hàng' },
                { key: 'time' as const, label: 'Theo thời gian ký HĐ' },
              ]}
              value={by}
              onChange={setBy}
            />
          </span>
        }
      >
        <div className="grid grid-cols-1 2xl:grid-cols-[1fr_420px] gap-4">
          <TargetChart data={by === 'customer' ? byCustomer : by === 'division' ? byDivision : byTime} />
          <div>
            <p className="text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide mb-1.5">{by === 'division' ? 'Chi tiết mục tiêu theo khối' : 'Chi tiết mục tiêu theo khách hàng'}</p>
            <table className={erp.table}>
              <thead>
                <tr>
                  {[by === 'division' ? 'Khối' : 'Khách hàng', 'Giá trị mục tiêu', 'LN gộp', '% LN gộp'].map((h) => (
                    <th key={h} className={`${erp.th} text-center`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detail.map((c) => (
                  <tr key={c.label} className={erp.tr}>
                    <td className={erp.td}>{c.label}</td>
                    <td className={`${erp.td} ${erp.num}`}>{fmt(c.value)}</td>
                    <td className={`${erp.td} ${erp.num} ${c.grossProfit < 0 ? 'text-rose-700 font-semibold' : ''}`}>{fmt(c.grossProfit)}</td>
                    <td className={`${erp.td} ${erp.num} ${c.grossProfit < 0 ? 'text-rose-700' : ''}`}>{c.value ? pct(c.grossProfit / c.value) : '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className={erp.totalRow}>
                  <td className={erp.td}>{totalLabel}</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmt(t.value)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmt(t.grossProfit)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{t.value ? pct(t.rate) : '—'}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </Panel>
    </div>
  );
};

/** Ô nhập % LN gộp: SỐ NGUYÊN, '-' chỉ đứng đầu (được âm / > 100), để trống = chưa nhập. */
/** Chia kế hoạch theo năm: mỗi năm của kỳ = Σ các dòng có tháng Ký HĐ trong năm đó (mục tiêu năm dùng ở Tổng quan / Lập kế hoạch khối / Sổ theo dõi). */
const YearSplit: React.FC<{ rows: TargetRow[]; period: Period; note?: string }> = ({ rows, period, note }) => {
  const ok = monthValid(period.from) && monthValid(period.to) && period.from <= period.to;
  const years = ok ? yearsOf(period) : [];
  const all = totals(rows);
  const data = years.map((y) => {
    const yr = rows.filter((x) => x.signMonth.startsWith(`${y}-`));
    const from = `${y}-01` < period.from ? period.from : `${y}-01`;
    const to = `${y}-12` > period.to ? period.to : `${y}-12`;
    return { y, from, to, n: yr.length, ...totals(yr) };
  });
  const outside = rows.filter((x) => x.signMonth && !(ok && monthInPeriod(x.signMonth, period)));
  return (
    <Panel title="Mục tiêu theo năm trong kỳ" icon={Target} noPad footer={note || 'Mục tiêu năm = tổng Giá trị các dòng có tháng Ký HĐ trong năm đó. Khi kế hoạch được BOD duyệt, mục tiêu từng năm được ghi cho Tổng quan, Lập kế hoạch khối và Sổ theo dõi dự án.'}>
      <table className={erp.table} data-testid="year-split">
        <thead>
          <tr>
            {['Năm', 'Tháng trong kỳ', 'Số dự án', 'Giá trị mục tiêu (VNĐ)', '% LN gộp', 'LN gộp (VNĐ)', 'Tỉ trọng'].map((h, i, arr) => (
              <th key={h} className={`${erp.th} border-t-0 ${i === 0 ? 'border-l-0 text-left' : i < 3 ? 'text-center' : 'text-right'} ${i === arr.length - 1 ? 'border-r-0' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.y} className={erp.tr}>
              <td className={`${erp.td} border-l-0 font-semibold`}>{d.y}</td>
              <td className={`${erp.td} text-center`}>
                {my(d.from)} – {my(d.to)}
              </td>
              <td className={`${erp.td} text-center`}>{d.n}</td>
              <td className={`${erp.td} ${erp.num} font-semibold`}>{fmt(d.value)}</td>
              <td className={`${erp.td} ${erp.num}`}>{d.value ? pct(d.rate) : '—'}</td>
              <td className={`${erp.td} ${erp.num} ${d.grossProfit < 0 ? 'text-rose-700' : ''}`}>{fmt(d.grossProfit)}</td>
              <td className={`${erp.td} ${erp.num} border-r-0`}>{all.value ? pct(d.value / all.value) : '—'}</td>
            </tr>
          ))}
          {!data.length && (
            <tr>
              <td colSpan={7} className={`${erp.td} border-x-0 py-4 text-center text-slate-400`}>
                Nhập kỳ kế hoạch hợp lệ để xem mục tiêu theo năm.
              </td>
            </tr>
          )}
        </tbody>
        {data.length > 0 && (
          <tfoot>
            <tr className={erp.totalRow}>
              <td className={`${erp.td} border-l-0`} colSpan={2}>
                CẢ KỲ {periodText(period)}
              </td>
              <td className={`${erp.td} text-center`}>{rows.length}</td>
              <td className={`${erp.td} ${erp.num}`}>{fmt(all.value)}</td>
              <td className={`${erp.td} ${erp.num}`}>{all.value ? pct(all.rate) : '—'}</td>
              <td className={`${erp.td} ${erp.num}`}>{fmt(all.grossProfit)}</td>
              <td className={`${erp.td} ${erp.num} border-r-0`}>{all.value ? '100.0%' : '—'}</td>
            </tr>
          </tfoot>
        )}
      </table>
      {outside.length > 0 && <p className="px-3 py-1.5 border-t border-rose-200 bg-rose-50 text-[12px] text-rose-700">{outside.length} dòng có tháng Ký HĐ nằm ngoài kỳ — sửa tháng Ký HĐ hoặc kỳ kế hoạch trước khi lưu.</p>}
    </Panel>
  );
};

const RateInput: React.FC<{ value: number | null; onChange: (n: number | null) => void; className?: string }> = ({ value, onChange, className = '' }) => {
  const [text, setText] = useState<string | null>(null);
  const shown = text ?? (value == null ? '' : String(value));
  return (
    <span className="relative block w-full">
      <input
        value={shown}
        onFocus={() => setText(value == null ? '' : String(value))}
        onBlur={() => setText(null)}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d-]/g, '');
          const neg = raw.startsWith('-');
          const digits = raw.replace(/-/g, '').slice(0, 5);
          setText((neg ? '-' : '') + digits);
          onChange(digits ? (neg ? -1 : 1) * Number(digits) : null);
        }}
        inputMode="text"
        placeholder="0"
        title="Số nguyên, được âm (dự án lỗ) hoặc lớn hơn 100; tối đa ±10.000"
        className={`${className} text-right tabular-nums pr-6 ${value != null && value < 0 ? 'text-rose-700 font-semibold' : ''}`}
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[12px] text-slate-400 pointer-events-none">%</span>
    </span>
  );
};

/** Ô nhập tháng dạng MM/YYYY (lưu YYYY-MM). Gõ "2/2027", "02/2027" hoặc "022027". */
const MonthInput: React.FC<{ value: string; onChange: (ym: string) => void; className: string; invalid?: boolean }> = ({ value, onChange, className, invalid }) => {
  const [text, setText] = useState(value ? my(value) : '');
  const [bad, setBad] = useState(false);
  const [last, setLast] = useState(value);
  if (last !== value) {
    setLast(value);
    setText(value ? my(value) : '');
  }
  const commit = () => {
    const t = text.trim();
    if (!t) return onChange(''), setBad(false);
    const m = t.match(/^(\d{1,2})\s*[\/\-.]?\s*(\d{4})$/);
    const mm = m ? Number(m[1]) : 0;
    if (!m || mm < 1 || mm > 12) return setBad(true);
    setBad(false);
    const ym = `${m[2]}-${String(mm).padStart(2, '0')}`;
    setText(my(ym));
    onChange(ym);
  };
  return (
    <span className="relative block w-full">
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLInputElement).blur()}
      placeholder="MM/YYYY"
      inputMode="numeric"
      title={bad ? 'Nhập đúng dạng MM/YYYY, ví dụ 02/2027' : 'MM/YYYY — gõ hoặc bấm biểu tượng lịch để chọn'}
      className={`${className} text-center tabular-nums pr-7 ${bad || invalid ? 'bg-rose-50 text-rose-700' : ''}`}
    />
    <MonthPickerButton
      value={value}
      onChange={(ym) => {
        setBad(false);
        setText(ym ? my(ym) : '');
        onChange(ym);
      }}
      className="absolute right-1 top-1/2 -translate-y-1/2"
    />
    </span>
  );
};

/**
 * `editable`: cho sửa nội dung các ô. `actions`: hiện cột Xoá (mờ kèm lý do `lockReason` khi không sửa được).
 * Nút Edit / Import / Thêm dòng nằm ở thanh tiêu đề của khung chứa bảng.
 */
const RowsTable: React.FC<{
  rows: TargetRow[];
  editable?: boolean;
  actions?: boolean;
  lockReason?: string;
  onChange?: (rows: TargetRow[]) => void;
  customers?: string[];
  /** Kỳ kế hoạch: tô đỏ ô Ra thầu / Ký HĐ sai luật tháng. */
  period?: Period;
  /** Xem tổng hợp nhiều hồ sơ: thêm cột "Khối · Kỳ kế hoạch" (hồ sơ nguồn của dòng). */
  sourceOf?: (row: TargetRow) => string;
  totalLabel?: string;
  emptyText?: string;
}> = ({ rows, editable, actions = editable, lockReason, onChange, customers = [], period, sourceOf, totalLabel = 'TỔNG MỤC TIÊU KHỐI', emptyText }) => {
  const extra = sourceOf ? 1 : 0;
  const t = totals(rows);
  const set = (id: string, patch: Partial<TargetRow>) =>
    onChange?.(
      rows.map((x) => {
        if (x.id !== id) return x;
        const n = { ...x, ...patch };
        if (!n.value) n.grossProfitRate = null; // D10: Giá trị trống / 0 ⇒ xoá % và khoá ô %
        return { ...n, grossProfit: computeGp(n.value, n.grossProfitRate) };
      }),
    );
  const cell = 'w-full h-8 px-2 bg-transparent text-[12.5px] outline-none focus:bg-[#eaf2fc] focus:ring-1 focus:ring-inset focus:ring-[#1f5fa8]';
  const req = editable ? <span className="text-rose-600"> *</span> : null;
  const gpCls = (x: TargetRow) => (x.grossProfit < 0 ? 'text-rose-700 font-semibold' : '');
  const rateText = (x: TargetRow) => (x.grossProfitRate == null ? '—' : `${x.grossProfitRate}%`);
  return (
    <div className="overflow-x-auto">
      <table className={`${erp.table} min-w-[1200px]`}>
        <thead>
          <tr>
            {['STT', ...(sourceOf ? ['Khối · Kỳ kế hoạch'] : []), 'Khách hàng', 'Tên dự án'].map((h) => (
              <th key={h} rowSpan={2} className={`${erp.th} text-center border-t-0 first:border-l-0`}>
                {h}
                {(h === 'Khách hàng' || h === 'Tên dự án') && req}
              </th>
            ))}
            <th colSpan={2} className={`${erp.th} text-center border-t-0`}>
              Thời điểm dự kiến
            </th>
            <th colSpan={3} className={`${erp.th} text-center border-t-0`}>
              Chỉ tiêu đăng ký (VNĐ)
            </th>
            <th rowSpan={2} className={`${erp.th} text-center border-t-0 ${actions ? '' : 'border-r-0'}`}>
              Cơ sở đăng ký / Thuyết minh kế hoạch{req}
            </th>
            {actions && (
              <th rowSpan={2} className={`${erp.th} text-center border-t-0 border-r-0 w-12`}>
                Xoá
              </th>
            )}
          </tr>
          <tr>
            <th className={`${erp.th} text-center font-medium`}>Ra thầu{req}</th>
            <th className={`${erp.th} text-center font-medium`}>Ký HĐ{req}</th>
            <th className={`${erp.th} text-center font-medium`}>Giá trị{req}</th>
            <th className={`${erp.th} text-center font-medium`}>% LN gộp mục tiêu{req}</th>
            <th className={`${erp.th} text-center font-medium`}>LN gộp mục tiêu</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((x, i) => (
            <tr key={x.id} className={erp.tr}>
              <td className={`${erp.td} text-center text-slate-500 border-l-0 w-12`}>{i + 1}</td>
              {sourceOf && <td className={`${erp.td} whitespace-nowrap font-semibold text-[#1e3a5f]`}>{sourceOf(x)}</td>}
              {editable ? (
                <>
                  <td className="border border-slate-200 p-0 w-44">
                    <input value={x.customer} onChange={(e) => set(x.id, { customer: e.target.value })} list="target-customers" placeholder="Chọn khách hàng…" className={cell} />
                  </td>
                  <td className="border border-slate-200 p-0 w-52">
                    <input value={x.project} onChange={(e) => set(x.id, { project: e.target.value })} placeholder="Tên dự án" className={cell} />
                  </td>
                  <td className="border border-slate-200 p-0 w-32">
                    <MonthInput value={x.tenderMonth} onChange={(ym) => set(x.id, { tenderMonth: ym })} className={cell} invalid={!!period && tenderInvalid(x, period)} />
                  </td>
                  <td className="border border-slate-200 p-0 w-32">
                    <MonthInput value={x.signMonth} onChange={(ym) => set(x.id, { signMonth: ym })} className={cell} invalid={!!period && signInvalid(x, period)} />
                  </td>
                  <td className="border border-slate-200 p-0 w-44">
                    <input
                      value={x.value ? fmt(x.value) : ''}
                      onChange={(e) => set(x.id, { value: Math.min(Number(e.target.value.replace(/[^\d]/g, '').slice(0, 13)) || 0, MAX_VALUE) })}
                      inputMode="numeric"
                      placeholder="0"
                      className={`${cell} text-right tabular-nums`}
                    />
                  </td>
                  <td className="border border-slate-200 p-0 w-32" title={x.value ? undefined : 'Nhập Giá trị trước khi nhập % LN gộp'}>
                    {x.value ? (
                      <RateInput value={x.grossProfitRate} onChange={(n) => set(x.id, { grossProfitRate: n })} className={cell} />
                    ) : (
                      <span className={`${cell} flex items-center justify-end bg-slate-50 text-slate-400 cursor-not-allowed`}>—</span>
                    )}
                  </td>
                  <td className={`${erp.td} ${erp.num} w-44 bg-slate-50 ${x.grossProfit < 0 ? 'text-rose-700' : 'text-slate-600'}`} title="Tự tính = HĐ ký mới × % LN gộp mục tiêu (làm tròn đến đồng)">
                    {fmt(x.grossProfit)}
                  </td>
                  <td className="border border-slate-200 p-0">
                    <input value={x.basis} onChange={(e) => set(x.id, { basis: e.target.value })} placeholder="Cơ sở đăng ký…" className={cell} />
                  </td>
                  <td className={`${erp.td} text-center border-r-0`}>
                    <button type="button" title="Xoá cả dòng" onClick={() => onChange?.(rows.filter((y) => y.id !== x.id))} className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                      <X size={14} />
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className={erp.td}>{x.customer}</td>
                  <td className={erp.td}>{x.project}</td>
                  <td className={`${erp.td} text-center`}>{my(x.tenderMonth)}</td>
                  <td className={`${erp.td} text-center`}>{my(x.signMonth)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmt(x.value)}</td>
                  <td className={`${erp.td} ${erp.num} ${x.grossProfit < 0 ? 'text-rose-700' : ''}`}>{rateText(x)}</td>
                  <td className={`${erp.td} ${erp.num} ${gpCls(x)}`}>{fmt(x.grossProfit)}</td>
                  <td className={`${erp.td} text-slate-600 ${actions ? '' : 'border-r-0'}`}>{x.basis || '—'}</td>
                  {actions && (
                    <td className={`${erp.td} text-center border-r-0`}>
                      <button type="button" disabled title={lockReason || 'Không xoá được'} className="p-1 rounded text-slate-300 cursor-not-allowed">
                        <X size={14} />
                      </button>
                    </td>
                  )}
                </>
              )}
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={(actions ? 10 : 9) + extra} className={`${erp.td} text-center text-slate-400 py-6 border-x-0`}>
                {emptyText || 'Chưa có dự án đăng ký.'} {editable && 'Bấm "+ Thêm dòng".'}
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className={erp.totalRow}>
            <td colSpan={5 + extra} className={`${erp.td} border-l-0`}>
              {totalLabel}
            </td>
            <td className={`${erp.td} ${erp.num}`}>{fmt(t.value)}</td>
            <td className={`${erp.td} ${erp.num}`}>{t.value ? pct(t.rate) : '—'}</td>
            <td className={`${erp.td} ${erp.num}`}>{fmt(t.grossProfit)}</td>
            <td colSpan={actions ? 2 : 1} className={`${erp.td} border-r-0`} />
          </tr>
        </tfoot>
      </table>
      {editable && (
        <datalist id="target-customers">
          {customers.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      )}
    </div>
  );
};

const HistoryPanel: React.FC<{ p: TargetPlan }> = ({ p }) => (
  <Panel title={`Lịch sử điều chỉnh (${p.history.length})`} icon={History} noPad>
    <table className={erp.table}>
      <thead>
        <tr>
          {['Thời gian', 'Người thực hiện', 'Thao tác', 'Phiên bản', 'Nội dung điều chỉnh / Ý kiến'].map((h) => (
            <th key={h} className={`${erp.th} text-center border-t-0 first:border-l-0 last:border-r-0`}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...p.history].reverse().map((h, i) => (
          <tr key={i} className={erp.tr}>
            <td className={`${erp.td} whitespace-nowrap border-l-0`}>{dt(h.at)}</td>
            <td className={erp.td}>{h.by}</td>
            <td className={`${erp.td} font-semibold`}>{h.action}</td>
            <td className={`${erp.td} text-center`}>{String(h.version).padStart(2, '0')}</td>
            <td className={`${erp.td} text-slate-600 border-r-0`}>
              {h.changes?.map((c, j) => (
                <p key={j}>• {c}</p>
              ))}
              {h.note && <p className="italic">“{h.note}”</p>}
              {!h.changes && !h.note && '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Panel>
);

const FlowNote = () => <span className="text-[12px] text-slate-600">GĐK lập hồ sơ → CFO duyệt → BOD phê duyệt → Ghi nhận kế hoạch chính thức</span>;

/** Bộ lọc khoảng thời gian (theo tháng Ký HĐ của dòng): Từ tháng – Đến tháng (MM/YYYY), dùng cho chế độ xem và tab BOD. Không ảnh hưởng việc lập hồ sơ theo năm. */
const RangeFilter: React.FC<{ from: string; to: string; onChange: (from: string, to: string) => void }> = ({ from, to, onChange }) => {
  const err = rangeError(from, to);
  const y = new Date().getFullYear();
  return (
    <>
      <label className="flex items-center gap-1.5 text-[12px] text-slate-600 whitespace-nowrap" title="Lọc theo tháng Ký HĐ của dòng mục tiêu">
        Ký HĐ từ
        <span className="w-[120px] shrink-0">
          <MonthInput value={from} onChange={(v) => onChange(v, to)} className={`${erp.input} !w-full`} invalid={!!err} />
        </span>
      </label>
      <label className="flex items-center gap-1.5 text-[12px] text-slate-600 whitespace-nowrap">
        đến
        <span className="w-[120px] shrink-0">
          <MonthInput value={to} onChange={(v) => onChange(from, v)} className={`${erp.input} !w-full`} invalid={!!err} />
        </span>
      </label>
      <Btn className="h-8 !px-2" title="Đặt lại khoảng thời gian = năm hiện tại" onClick={() => onChange(yearRange(y).from, yearRange(y).to)}>
        Năm nay
      </Btn>
      <Btn className="h-8 !px-2" title="Bỏ lọc thời gian — xem tất cả" onClick={() => onChange('', '')}>
        Xoá lọc
      </Btn>
      {err && (
        <span className="flex items-center gap-1 text-[12px] text-rose-600 font-semibold whitespace-nowrap">
          <AlertCircle size={13} /> {err}
        </span>
      )}
    </>
  );
};

// ==========================================================================
// Nút quyết định (CFO ở bước Chờ CFO, BOD ở bước Chờ BOD) — dùng cho tab Phê duyệt và tab GĐK
// ==========================================================================
const DecisionButtons: React.FC<{ plan: TargetPlan; role: Role; flash: Flash; onDone?: () => void }> = ({ plan, role, flash, onDone }) => {
  const { decide } = useBizTargets();
  const [open, setOpen] = useState<boolean | null>(null); // true = phê duyệt, false = từ chối, null = đóng
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  if (role === 'GĐK' || !canDecide(plan.status, role)) return null;
  const cfo = plan.status === 'Chờ CFO duyệt';
  const where = `${plan.division} kỳ ${periodText(plan)}`;
  const run = () => {
    if (open === false && !note.trim()) return setErr('Từ chối bắt buộc nhập ý kiến (không chấp nhận nội dung trống hoặc chỉ có khoảng trắng).');
    decide(plan.id, !!open, note.trim(), `${CURRENT_USER} (${role})`, role);
    flash(
      cfo
        ? open
          ? `CFO đã phê duyệt mục tiêu ${where} — chuyển BOD duyệt`
          : `CFO đã từ chối mục tiêu ${where}`
        : open
          ? `BOD đã phê duyệt mục tiêu ${where} — ghi nhận kế hoạch chính thức`
          : `BOD đã từ chối mục tiêu ${where} — trả về CFO xem xét lại`,
    );
    setOpen(null);
    onDone?.();
  };
  const begin = (approve: boolean) => (setOpen(approve), setNote(''), setErr(''));
  return (
    <>
      <Btn variant="danger" icon={XCircle} onClick={() => begin(false)}>
        Từ chối
      </Btn>
      <Btn variant="success" icon={CheckCircle2} onClick={() => begin(true)}>
        Phê duyệt
      </Btn>
      {open !== null && (
        <Dialog
          title={open ? 'Phê duyệt' : 'Từ chối'}
          width={560}
          onClose={() => setOpen(null)}
          footer={
            <>
              <Btn onClick={() => setOpen(null)}>Huỷ</Btn>
              <Btn variant={open ? 'success' : 'danger'} icon={open ? CheckCircle2 : XCircle} onClick={run}>
                {open ? 'Phê duyệt' : 'Từ chối'}
              </Btn>
            </>
          }
        >
          <p className="mb-3">{open ? `Phê duyệt mục tiêu ${where} — phiên bản ${String(plan.version).padStart(2, '0')}?` : `Từ chối mục tiêu ${where}?`}</p>
          <label className="block text-[12px] font-semibold mb-1">
            Ý kiến {!open && <span className="text-rose-600">*</span>}
          </label>
          <textarea value={note} onChange={(e) => (setNote(e.target.value), setErr(''))} rows={4} placeholder={cfo ? 'Nhập ý kiến của CFO…' : 'Nhập ý kiến của BOD…'} className={`${erp.inputFull} h-auto py-1.5 ${err ? 'border-rose-400 bg-rose-50' : ''}`} />
          {err && <p className="mt-1 text-[11.5px] text-rose-600 font-semibold">{err}</p>}
        </Dialog>
      )}
    </>
  );
};

// ==========================================================================
// Tab 1: GĐK lập mục tiêu
// ==========================================================================
const ALL_DIV = '__ALL__';
/** Khối của GĐK/HOD đang đăng nhập (bản thử; hệ thống thật theo Organization.HODID). */
const OWN_DIVISION = 'G1';

type DetailInit = { mode: 'edit' | 'view'; division?: string; planId?: string };
/** Màn chi tiết 1 kế hoạch (mode edit) hoặc xem tổng hợp theo khoảng thời gian (mode view) — mở từ màn danh sách, có nút Quay lại. */
const GdkTab: React.FC<{ flash: Flash; role: Role; init?: DetailInit; onBack?: () => void; onOpenPlan?: (division: string, planId: string) => void }> = ({ flash, role, init, onBack, onOpenPlan }) => {
  const { plans, savePlan, withdraw } = useBizTargets();
  const { projects } = useBusinessProjects();
  const today = new Date();
  const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const [mode, setMode] = useState<'edit' | 'view'>(init?.mode || 'edit');
  const [division, setDivision] = useState(init?.division || (role === 'GĐK' ? OWN_DIVISION : ALL_DIV)); // CFO / BOD mặc định "Tất cả (cả công ty)" như code thật
  // Kế hoạch theo kỳ (nhiều năm): chọn 1 kế hoạch của khối hoặc "Kế hoạch kỳ mới".
  const NEW = '__new__';
  const divPlans = useMemo(() => plans.filter((p) => p.division === division).sort((a, b) => a.from.localeCompare(b.from)), [plans, division]);
  /** Mặc định: kế hoạch chứa tháng hiện tại, không có thì kế hoạch mới nhất, chưa có thì kỳ mới. */
  const defPlanId = (d: string) => {
    const ps = plans.filter((p) => p.division === d).sort((a, b) => a.from.localeCompare(b.from));
    return (ps.find((p) => p.from <= thisMonth && thisMonth <= p.to) || ps[ps.length - 1])?.id || NEW;
  };
  const [planId, setPlanId] = useState(() => init?.planId || defPlanId(init?.division || (role === 'GĐK' ? OWN_DIVISION : ALL_DIV)));
  // Chế độ xem: lọc theo khoảng tháng Ký HĐ (xuyên năm), không dùng Năm kế hoạch.
  const [viewDivision, setViewDivision] = useState(ALL_DIV);
  const [from, setFrom] = useState(yearRange(today.getFullYear()).from);
  const [to, setTo] = useState(yearRange(today.getFullYear()).to);
  const [statusFilter, setStatusFilter] = useState<'ALL' | TargetStatus>('ALL');

  const canEdit = role === 'GĐK';
  const found = planId === NEW ? undefined : plans.find((p) => p.id === planId);
  // D2 (chốt 04/11): người không sửa được khối không thấy nội dung Nháp — Nháp có bản hiệu lực ⇒ hiện bản hiệu lực (Đã duyệt); chưa gửi lần nào ⇒ khung trống.
  const saved: TargetPlan | undefined =
    !canEdit && found?.status === 'Bản nháp'
      ? found.effectiveRows
        ? { ...found, status: 'Đã duyệt', version: found.effectiveVersion || found.version, rows: found.effectiveRows, history: found.history.filter((h) => h.version <= (found.effectiveVersion || found.version)) }
        : undefined
      : found;
  /** Kỳ mới: nối tiếp sau kế hoạch cuối của khối (hoặc từ tháng 01 năm nay), mặc định 24 tháng. */
  const blank = (): TargetPlan => {
    const last = divPlans[divPlans.length - 1];
    const from = last ? addMonth(last.to, 1) : `${today.getFullYear()}-01`;
    return { id: `TP-${division}-${from}-${uid()}`, division, from, to: addMonth(from, 23), author: `GĐK ${division}`, version: 1, status: 'Bản nháp', rows: [], history: [] };
  };
  const [draft, setDraft] = useState<TargetPlan>(() => saved || blank());
  const [editing, setEditing] = useState(false); // nút "Edit": hồ sơ đã có dòng chỉ xem cho tới khi bấm Edit
  const [err, setErr] = useState('');
  const [dlg, setDlg] = useState<null | 'submit' | 'withdraw' | 'discard' | 'import'>(null);
  const [onDiscard, setOnDiscard] = useState<(() => void) | null>(null);
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileErr, setFileErr] = useState('');
  // Đổi khối / năm → nạp hồ sơ tương ứng.
  const key = `${division}-${planId}`;
  const [loadedKey, setLoadedKey] = useState(key);
  if (loadedKey !== key) {
    setLoadedKey(key);
    setDraft(saved || blank());
    setErr('');
    setEditing(false);
  }

  const noSaved = !saved || saved.rows.length === 0; // hồ sơ chưa có dòng nào: sửa luôn, không có nút Edit
  const waiting = !!saved && isPending(saved.status);
  const editable = canEdit && !waiting && (editing || noSaved);
  const lockReason = waiting ? (saved!.status === 'Chờ CFO duyệt' ? 'Hồ sơ đang chờ CFO duyệt — rút hồ sơ hoặc chờ CFO quyết định để sửa' : 'Hồ sơ đang chờ BOD duyệt — rút hồ sơ hoặc chờ BOD quyết định để sửa') : undefined;
  const dirty = JSON.stringify(saved?.rows || []) !== JSON.stringify(draft.rows) || (!!saved && (saved.from !== draft.from || saved.to !== draft.to));
  const periodErr = editable ? periodError(draft, plans) : '';
  const by = `${CURRENT_USER} (GĐK ${division})`;
  const customers = useMemo(() => [...new Set([...projects.map((p) => p.customerName), ...plans.flatMap((p) => p.rows.map((x) => x.customer))].filter(Boolean))].sort(), [projects, plans]);
  const addRow = () => editable && setDraft((d) => ({ ...d, rows: [...d.rows, { id: uid(), customer: '', project: '', tenderMonth: '', signMonth: '', value: 0, grossProfitRate: null, grossProfit: 0, basis: '' }] }));
  // Có thay đổi chưa lưu ⇒ hỏi trước khi bỏ.
  const guard = (go: () => void) => (dirty ? (setOnDiscard(() => go), setDlg('discard')) : go());

  const doSave = (submit: boolean) => {
    const msg = savePlan({ ...draft }, by, submit);
    if (msg) return setErr(msg), flash(msg, 'error');
    setErr('');
    setEditing(false);
    if (planId === NEW) (setLoadedKey(`${division}-${draft.id}`), setPlanId(draft.id));
    flash(submit ? `Đã gửi duyệt mục tiêu ${division} kỳ ${periodText(draft)}` : 'Đã lưu nháp');
  };
  const save = (submit: boolean) => {
    const e = periodError(draft, plans) || (submit ? validateSubmit(draft.rows, draft) : validateDraft(draft.rows, draft, !noSaved));
    setErr(e);
    if (e) return flash(e, 'error');
    if (submit) setDlg('submit');
    else doSave(false);
  };
  const toggleEdit = () => {
    if (!editing) return setEditing(true);
    guard(() => (setDraft(saved || blank()), setEditing(false), setErr('')));
  };
  const runImport = () => {
    if (!file) return;
    if (!/\.(xlsx|xls)$/i.test(file.name)) return setFileErr('Chỉ nhận file Excel (.xlsx, .xls).');
    // Bản thử: không đọc file thật — thêm 2 dòng mẫu hợp lệ vào bảng (chỉ lưu khi Lưu nháp / Gửi duyệt).
    const demo: TargetRow[] = [
      { ...r('Khách hàng A', 'Dự án import 1', addMonth(draft.from, -1), addMonth(draft.from, 2), 1_200, 300, 'Từ file import'), id: uid() },
      { ...r('Khách hàng B', 'Dự án import 2', addMonth(draft.from, 13), addMonth(draft.from, 17), 800, 160, 'Từ file import'), id: uid() },
    ];
    setDraft((d) => ({ ...d, rows: [...d.rows, ...demo] }));
    setDlg(null);
    setFile(null);
    setFileErr('');
    flash(`Đã thêm ${demo.length} dòng từ file. Bấm Lưu nháp hoặc Gửi duyệt để lưu.`);
  };

  const current = canEdit ? plans.find((p) => p.id === draft.id) : saved; // D2: người chỉ xem dùng bản đã che Nháp
  const view: TargetPlan = current ? { ...current, rows: draft.rows } : draft;
  const isView = mode === 'view';
  // CFO / BOD chọn Khối = Tất cả ở màn "Lập hồ sơ theo năm" ⇒ xem tổng hợp cả công ty của Năm kế hoạch đó (chỉ xem), như khối "Tất cả" của code thật.
  const companyEdit = !isView && !canEdit && division === ALL_DIV;

  return (
    <>
      <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 [&>*]:shrink-0">
        {onBack && (
          <Btn icon={ArrowLeft} className="h-8" onClick={() => guard(onBack)} data-testid="target-back">
            Danh sách kế hoạch
          </Btn>
        )}
        {!onBack && (
          <Segmented
            options={[
              { key: 'edit', label: 'Lập kế hoạch theo kỳ' },
              { key: 'view', label: 'Xem theo khoảng thời gian' },
            ]}
            value={mode}
            onChange={(m) => (m === 'view' ? guard(() => setMode('view')) : setMode('edit'))}
          />
        )}
        {onBack && !isView ? (
          <span className="flex items-center gap-2 text-[13px] font-bold text-[#1e3a5f]" data-testid="target-detail-title">
            Khối {division} · {planId === NEW ? `Kế hoạch kỳ mới (${periodText(draft)})` : `Kỳ ${periodText(draft)}`}
            {!canEdit && (
              <span className="flex items-center gap-1.5 px-2.5 h-7 rounded-[3px] border border-sky-200 bg-sky-50 text-[12px] font-semibold text-sky-800">
                <Eye size={13} /> Vai trò {role}: chỉ xem; duyệt ở khung Phê duyệt bên dưới
              </span>
            )}
          </span>
        ) : isView ? (
          <>
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Khối
              {/* HOD/GĐK chỉ xem khối của mình; "Tất cả (cả công ty)" và các khối khác chỉ dành cho CFO / BOD. */}
              <select value={canEdit ? OWN_DIVISION : viewDivision} onChange={(e) => setViewDivision(e.target.value)} disabled={canEdit} className={`${erp.input} w-36`}>
                {!canEdit && <option value={ALL_DIV}>Tất cả (cả công ty)</option>}
                {(canEdit ? [OWN_DIVISION] : DIVISIONS).map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Trạng thái
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'ALL' | TargetStatus)} className={`${erp.input} w-36`}>
                <option value="ALL">Tất cả</option>
                {((canEdit ? ['Bản nháp', 'Chờ CFO duyệt', 'Chờ BOD duyệt', 'Đã duyệt', 'Từ chối', 'Đã rút'] : ['Chờ CFO duyệt', 'Chờ BOD duyệt', 'Đã duyệt', 'Từ chối', 'Đã rút']) as TargetStatus[]).map((st) => (
                  <option key={st}>{st}</option>
                ))}
              </select>
            </label>
            <RangeFilter from={from} to={to} onChange={(f, t) => (setFrom(f), setTo(t))} />
          </>
        ) : (
          <>
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Khối
              <select value={division} onChange={(e) => guard(() => (setDivision(e.target.value), setPlanId(defPlanId(e.target.value))))} disabled={canEdit} title={canEdit ? 'Khối cố định theo tài khoản GĐK' : undefined} className={`${erp.input} w-40`}>
                {!canEdit && <option value={ALL_DIV}>Tất cả (cả công ty)</option>}
                {DIVISIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            {division !== ALL_DIV && (
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
                Kỳ kế hoạch
                <select value={planId} onChange={(e) => guard(() => setPlanId(e.target.value))} className={`${erp.input} w-72`} data-testid="plan-select">
                  {divPlans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {periodText(p)} · {canEdit || p.status !== 'Bản nháp' ? p.status : 'Đã duyệt'}
                    </option>
                  ))}
                  {canEdit && <option value={NEW}>+ Kế hoạch kỳ mới…</option>}
                  {!canEdit && !divPlans.length && <option value={NEW}>Chưa có kế hoạch</option>}
                </select>
              </label>
            )}
            {companyEdit && (
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
                Trạng thái
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'ALL' | TargetStatus)} className={`${erp.input} w-36`}>
                  <option value="ALL">Tất cả</option>
                  {(['Chờ CFO duyệt', 'Chờ BOD duyệt', 'Đã duyệt', 'Từ chối', 'Đã rút'] as TargetStatus[]).map((st) => (
                    <option key={st}>{st}</option>
                  ))}
                </select>
              </label>
            )}
            {!canEdit && (
              <span className="flex items-center gap-1.5 px-2.5 h-8 rounded-[3px] border border-sky-200 bg-sky-50 text-[12px] font-semibold text-sky-800">
                <Eye size={13} /> Vai trò {role}: chỉ xem hồ sơ; chỉ GĐK lập / sửa / gửi / rút
              </span>
            )}
          </>
        )}
      </div>

      {isView || companyEdit ? (
        <AggregateView
          plans={plans}
          role={role}
          division={isView ? (canEdit ? OWN_DIVISION : viewDivision) : ALL_DIV}
          from={from}
          to={to}
          statusFilter={statusFilter}
          onOpen={(d, id) => {
            if (onOpenPlan) return onOpenPlan(d, id);
            setDivision(d);
            setPlanId(id);
            setMode('edit');
          }}
        />
      ) : (
        <>
          <Panel title="Mục tiêu kinh doanh" icon={Target}>
            <PlanHeader p={{ ...view, from: draft.from, to: draft.to }} onPeriod={editable ? (pr) => setDraft((d) => ({ ...d, ...pr })) : undefined} periodErr={periodErr} />
          </Panel>

          <PlanSummary rows={draft.rows} divisionOf={() => division} defaultBy="customer" />

          <YearSplit rows={draft.rows} period={draft} />

          <Panel
            title="Đăng ký mục tiêu theo khách hàng / dự án"
            icon={PenLine}
            noPad
            actions={
              <>
                {canEdit && !noSaved && (
                  <span title={waiting ? lockReason : editing ? 'Thoát chế độ chỉnh sửa, quay về chế độ xem' : 'Bật chế độ chỉnh sửa bảng đăng ký mục tiêu'}>
                    <Btn icon={editing ? LogOut : Pencil} className="h-7" disabled={waiting} onClick={toggleEdit}>
                      {editing ? 'Thoát Edit' : 'Edit'}
                    </Btn>
                  </span>
                )}
                {editable && (
                  <Btn icon={Upload} className="h-7" title="Import dòng đăng ký từ file Excel" onClick={() => (setFile(null), setFileErr(''), setDlg('import'))}>
                    Import
                  </Btn>
                )}
                {editable && (
                  <Btn variant="primary" icon={Plus} className="h-7" title="Thêm một dòng đăng ký mới" onClick={addRow}>
                    Thêm dòng
                  </Btn>
                )}
              </>
            }
            footer={
              <div className="flex flex-wrap items-center justify-between gap-3">
                <FlowNote />
                {err && (
                  <span className="flex items-center gap-1 text-rose-600 font-semibold">
                    <AlertCircle size={13} /> {err}
                  </span>
                )}
                {editable && (
                  <span className="flex items-center gap-2">
                    <Btn icon={Save} className="h-8" onClick={() => save(false)} disabled={!dirty && !!saved}>
                      Lưu nháp
                    </Btn>
                    <Btn variant="success" icon={Send} className="h-8" onClick={() => save(true)}>
                      Gửi duyệt
                    </Btn>
                  </span>
                )}
                {!editable && waiting && canEdit && (
                  <Btn icon={RotateCcw} className="h-8 !border-amber-400 !text-amber-700 hover:!bg-amber-50" onClick={() => (setReason(''), setDlg('withdraw'))}>
                    Rút hồ sơ
                  </Btn>
                )}
              </div>
            }
          >
            <RowsTable rows={draft.rows} editable={editable} actions lockReason={lockReason} customers={customers} period={draft} onChange={(rows) => setDraft((d) => ({ ...d, rows }))} />
          </Panel>

          {/* Người duyệt xem hồ sơ chờ đúng bước của mình ở khối / năm đang chọn ⇒ quyết định ngay tại tab này. */}
          {saved && canDecide(saved.status, role) && (
            <Panel title="Phê duyệt hồ sơ" icon={ClipboardCheck} actions={<DecisionButtons plan={saved} role={role} flash={flash} />}>
              <p className="text-[12.5px] text-slate-600">
                Hồ sơ đang <b>{saved.status}</b>. Bấm Phê duyệt hoặc Từ chối (Từ chối bắt buộc ý kiến).
              </p>
            </Panel>
          )}

          {current && <HistoryPanel p={current} />}
        </>
      )}

      {dlg === 'discard' && (
        <Dialog
          title="Thay đổi chưa lưu"
          onClose={() => setDlg(null)}
          footer={
            <>
              <Btn onClick={() => setDlg(null)}>Huỷ</Btn>
              <Btn variant="primary" onClick={() => (setDlg(null), onDiscard?.())}>
                Đồng ý
              </Btn>
            </>
          }
        >
          Có thay đổi chưa lưu. Bỏ các thay đổi này?
        </Dialog>
      )}
      {dlg === 'submit' && (
        <Dialog
          title="Gửi duyệt"
          onClose={() => setDlg(null)}
          footer={
            <>
              <Btn onClick={() => setDlg(null)}>Huỷ</Btn>
              <Btn variant="success" icon={Send} onClick={() => (setDlg(null), doSave(true))}>
                Gửi duyệt
              </Btn>
            </>
          }
        >
          Gửi duyệt mục tiêu {division} kỳ {periodText(draft)}? Sau khi gửi, hồ sơ bị khoá cho tới khi CFO / BOD quyết định hoặc bạn rút hồ sơ.
        </Dialog>
      )}
      {dlg === 'withdraw' && saved && (
        <Dialog
          title="Rút hồ sơ mục tiêu"
          onClose={() => setDlg(null)}
          footer={
            <>
              <Btn onClick={() => setDlg(null)}>Huỷ</Btn>
              <Btn
                icon={RotateCcw}
                disabled={!reason.trim()}
                className="!border-amber-500 !bg-amber-500 !text-white hover:!bg-amber-600"
                onClick={() => (withdraw(saved.id, reason.trim(), by), setDlg(null), flash(`Đã rút hồ sơ mục tiêu ${division} kỳ ${periodText(saved)}`))}
              >
                Xác nhận rút
              </Btn>
            </>
          }
        >
          <p className="mb-3">Rút hồ sơ mục tiêu {division} kỳ {periodText(saved)} khỏi hàng chờ duyệt? Sau khi rút, hồ sơ giữ nguyên phiên bản và sửa tiếp được.</p>
          <label className="block text-[12px] font-semibold mb-1">
            Lý do rút <span className="text-rose-600">*</span>
          </label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Nhập lý do rút hồ sơ…" className={`${erp.inputFull} h-auto py-1.5`} />
        </Dialog>
      )}
      {dlg === 'import' && (
        <Dialog
          title="Import dữ liệu đăng ký mục tiêu"
          width={560}
          onClose={() => setDlg(null)}
          footer={
            <>
              <Btn onClick={() => setDlg(null)}>Đóng</Btn>
              <Btn variant="primary" icon={Upload} disabled={!file} onClick={runImport}>
                Import
              </Btn>
            </>
          }
        >
          <p className="font-semibold text-[#1e3a5f] mb-1">1. Tải file mẫu</p>
          <p className="text-[12px] text-slate-600 mb-2">
            Bắt buộc: Khách hàng, Tên dự án, Ra thầu, Ký HĐ, Giá trị, % LN gộp và Cơ sở đăng ký. Khách hàng: nhập Mã khách hàng hoặc "Mã - Tên" như danh sách trên màn. Ký HĐ: tháng MM/YYYY thuộc kỳ kế hoạch {periodText(draft)}. Ra thầu: tháng MM/YYYY, được trước kỳ nhưng không sau tháng Ký HĐ. % LN gộp: số nguyên (được âm).
          </p>
          <Btn icon={Upload}>Tải file mẫu</Btn>
          <p className="font-semibold text-[#1e3a5f] mt-4 mb-1">2. Tải file lên</p>
          <input type="file" accept=".xlsx,.xls" onChange={(e) => (setFile(e.target.files?.[0] || null), setFileErr(''))} className="text-[12px]" />
          {fileErr && <p className="mt-1 text-[11.5px] text-rose-600 font-semibold">{fileErr}</p>}
          <p className="mt-3 text-[11.5px] text-slate-500">
            Dữ liệu import chỉ được thêm vào bảng (như "Thêm dòng"), chỉ lưu khi bấm Lưu nháp hoặc Gửi duyệt. Có 1 dòng lỗi thì không import dòng nào. (Bản thử: không đọc file thật, thêm 2 dòng mẫu.)
          </p>
        </Dialog>
      )}
    </>
  );
};

// ==========================================================================
// Xem theo khoảng thời gian (khối "Tất cả" của code thật + lọc Từ tháng – Đến tháng theo Ký HĐ) — chỉ xem, không sửa
// ==========================================================================
/** Hồ sơ hiện ở chế độ xem tổng hợp: mọi trạng thái trừ Bản nháp; bản đã duyệt đang điều chỉnh (Nháp) tính theo phiên bản đã duyệt như "Đã duyệt". */
const asCompanyView = (p: TargetPlan): { status: TargetStatus; version: number; rows: TargetRow[] } | null =>
  p.status === 'Bản nháp' ? (p.effectiveRows ? { status: 'Đã duyệt', version: p.effectiveVersion || p.version, rows: p.effectiveRows } : null) : { status: p.status, version: p.version, rows: p.rows };

const AggregateView: React.FC<{ plans: TargetPlan[]; role: Role; division: string; from: string; to: string; statusFilter: 'ALL' | TargetStatus; onOpen: (division: string, planId: string) => void }> = ({
  plans,
  role,
  division,
  from,
  to,
  statusFilter,
  onOpen,
}) => {
  const allDiv = division === ALL_DIV;
  const divs = allDiv ? DIVISIONS : [division];
  const invalid = rangeError(from, to);
  const filtered = !!(from || to);
  const items = invalid
    ? []
    : plans
        .filter((p) => divs.includes(p.division))
        // HOD/GĐK: khối của mình, mọi trạng thái kể cả Bản nháp (nội dung đang lưu). CFO/BOD: dữ liệu mới nhất của từng hồ sơ, không có Nháp.
        .map((p) => ({ p, v: role === 'GĐK' ? { status: p.status, version: p.version, rows: p.rows } : asCompanyView(p) }))
        .filter((x): x is { p: TargetPlan; v: { status: TargetStatus; version: number; rows: TargetRow[] } } => !!x.v)
        .filter((x) => statusFilter === 'ALL' || x.v.status === statusFilter)
        .map((x) => ({ ...x, inRange: rowsInRange(x.v.rows, from, to) }))
        .filter((x) => !filtered || x.inRange.length > 0);
  const srcOf = new Map<string, string>(items.flatMap((x) => x.inRange.map((row) => [row.id, `${x.p.division} · ${periodText(x.p)}`] as [string, string])));
  const divOf = new Map<string, string>(items.flatMap((x) => x.inRange.map((row) => [row.id, x.p.division] as [string, string])));
  const rows = items.flatMap((x) => x.inRange).sort((a, b) => (srcOf.get(a.id) || '').localeCompare(srcOf.get(b.id) || '') || a.signMonth.localeCompare(b.signMonth));
  const scopeText = allDiv ? `Cả công ty (${DIVISIONS.length} khối)` : `Khối ${division}`;
  const byStatus = ((role === 'GĐK' ? ['Bản nháp', 'Chờ CFO duyệt', 'Chờ BOD duyệt', 'Đã duyệt', 'Từ chối', 'Đã rút'] : ['Chờ CFO duyệt', 'Chờ BOD duyệt', 'Đã duyệt', 'Từ chối', 'Đã rút']) as TargetStatus[]).map((st) => [st, items.filter((x) => x.v.status === st).length] as const).filter(([, n]) => n);
  const label = allDiv ? 'công ty' : 'khối';
  const list = [...items].sort((a, b) => b.p.from.localeCompare(a.p.from) || a.p.division.localeCompare(b.p.division));

  return (
    <>
      <Panel title="Mục tiêu kinh doanh" icon={Target}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            ['Phạm vi', scopeText],
            ['Khoảng thời gian (Ký HĐ)', rangeText(from, to)],
            ['Số hồ sơ', `${items.length} hồ sơ có dòng trong kỳ · ${rows.length} dự án đăng ký`],
            [
              'Trạng thái hồ sơ',
              byStatus.length ? (
                <span className="flex flex-wrap gap-1">
                  {byStatus.map(([st, n]) => (
                    <Tag key={st} cls={STATUS_CLS[st]}>
                      {st}: {n}
                    </Tag>
                  ))}
                </span>
              ) : (
                <span className="text-slate-400 font-normal">—</span>
              ),
            ],
          ].map(([k, v]) => (
            <div key={k as string}>
              <p className="text-[11.5px] text-slate-500 mb-1">{k}</p>
              <div className="min-h-8 flex items-center text-[13px] font-semibold text-slate-800">{v}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-start gap-1.5 px-3 py-2 rounded-[3px] bg-sky-50 border border-sky-200 text-[12px] text-sky-800">
          <Flag size={14} className="mt-px shrink-0" /> {role === 'GĐK' ? 'Bạn xem được các khối của mình. Khối bạn sửa được hiện mọi trạng thái kể cả Bản nháp (nội dung đang lưu); khối chỉ xem hiện dữ liệu mới nhất trừ Bản nháp. ' : 'Chỉ CFO và BOD xem được cả công ty. Mỗi hồ sơ (Khối · Năm) chỉ hiện dữ liệu mới nhất của nó, không có Bản nháp: hồ sơ chưa gửi duyệt lần nào không hiện; hồ sơ đã duyệt đang sửa dở hiện phiên bản đã duyệt. '}Mỗi kế hoạch (Khối · Kỳ) giữ trạng thái và phiên bản riêng; các kỳ của cùng 1 khối không chồng nhau. Tổng chỉ gồm các dòng có tháng Ký HĐ trong khoảng đã chọn (có thể xuyên nhiều năm) — không phải mục tiêu chính thức của cả kỳ; tháng Ra thầu không dùng để lọc.
        </p>
        {invalid && <p className="mt-2 text-[12px] text-rose-600 font-semibold">{invalid}</p>}
      </Panel>

      <PlanSummary rows={rows} divisionOf={allDiv ? (x) => divOf.get(x.id) || '—' : undefined} title={`Tổng mục tiêu ${label} trong kỳ`} totalLabel="TỔNG TRONG KỲ" />

      <Panel title="Hồ sơ có dòng trong kỳ" icon={ClipboardCheck} noPad footer="Bấm “Mở hồ sơ” để chuyển sang chế độ lập kế hoạch theo kỳ của khối đó.">
        <table className={erp.table}>
          <thead>
            <tr>
              {['Khối', 'Kỳ kế hoạch', 'Trạng thái hồ sơ', 'Số dự án trong khoảng lọc', 'Giá trị trong khoảng lọc (VNĐ)', ''].map((h, i) => (
                <th key={i} className={`${erp.th} text-center border-t-0 first:border-l-0 last:border-r-0`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className={`${erp.td} text-center text-slate-500 border-l-0 border-r-0`}>
                  {invalid ? 'Khoảng thời gian không hợp lệ.' : 'Không có mục tiêu nào trong khoảng đã chọn.'}
                </td>
              </tr>
            )}
            {list.map((x) => (
              <tr key={x.p.id} className={erp.tr}>
                <td className={`${erp.td} font-semibold border-l-0`}>{x.p.division}</td>
                <td className={`${erp.td} text-center`}>{periodText(x.p)}</td>
                <td className={erp.td}>
                  <Tag cls={STATUS_CLS[x.v.status]}>{`${x.v.status} — Phiên bản ${String(x.v.version).padStart(2, '0')}`}</Tag>
                </td>
                <td className={`${erp.td} text-center`}>{x.inRange.length}</td>
                <td className={`${erp.td} ${erp.num}`}>{fmt(totals(x.inRange).value)}</td>
                <td className={`${erp.td} text-center border-r-0`}>
                  <span className="underline text-[#1f5fa8] cursor-pointer" onClick={() => onOpen(x.p.division, x.p.id)}>
                    Mở hồ sơ
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Danh sách dự án đăng ký trong kỳ" icon={PenLine} noPad footer="Chế độ xem — chỉ xem. Chuyển sang “Lập kế hoạch theo kỳ” để lập / sửa.">
        <RowsTable rows={rows} sourceOf={(x) => srcOf.get(x.id) || ''} totalLabel="TỔNG TRONG KỲ" emptyText={invalid ? 'Khoảng thời gian không hợp lệ.' : 'Không có mục tiêu nào trong khoảng đã chọn.'} />
      </Panel>
    </>
  );
};

// ==========================================================================
// Màn danh sách kế hoạch mục tiêu (màn ngoài) — bấm 1 dòng để mở chi tiết
// ==========================================================================
const lastUpdate = (p: TargetPlan) => (p.history.length ? p.history[p.history.length - 1].at : '');
type ListItem = { p: TargetPlan; status: TargetStatus; version: number; rows: TargetRow[]; period: Period };
/** Dữ liệu 1 kế hoạch theo người xem: GĐK thấy bản đang lưu (kể cả Nháp); CFO / BOD thấy dữ liệu mới nhất trừ Nháp (Nháp có bản đã duyệt ⇒ bản đã duyệt + kỳ của nó). */
const listItemOf = (p: TargetPlan, role: Role): ListItem | null => {
  if (role === 'GĐK') return { p, status: p.status, version: p.version, rows: p.rows, period: p };
  const v = asCompanyView(p);
  if (!v) return null;
  const eff = p.status === 'Bản nháp';
  return { p, ...v, period: eff ? { from: p.effectiveFrom || p.from, to: p.effectiveTo || p.to } : p };
};

const TargetList: React.FC<{ role: Role; onOpen: (division: string, planId: string) => void; onNew: () => void; onRange: () => void }> = ({ role, onOpen, onNew, onRange }) => {
  const { plans } = useBizTargets();
  const { projects } = useBusinessProjects();
  const thisYear = String(new Date().getFullYear());
  const canEdit = role === 'GĐK';
  const [division, setDivision] = useState(ALL_DIV);
  const [status, setStatus] = useState<'ALL' | 'MINE' | TargetStatus>('ALL');
  const [year, setYear] = useState('ALL');
  const [q, setQ] = useState('');
  const all = plans
    .filter((p) => !canEdit || p.division === OWN_DIVISION)
    .map((p) => listItemOf(p, role))
    .filter((x): x is ListItem => !!x);
  const years: number[] = [...new Set<number>(all.flatMap((x) => yearsOf(x.period)))].sort((a, b) => a - b);
  const mine = all.filter((x) => canDecide(x.p.status, role));
  const needle = q.trim().toLowerCase();
  const list = all
    .filter((x) => division === ALL_DIV || x.p.division === division)
    .filter((x) => (status === 'ALL' ? true : status === 'MINE' ? canDecide(x.p.status, role) : x.status === status))
    .filter((x) => year === 'ALL' || yearsOf(x.period).includes(+year))
    .filter((x) => !needle || [x.p.division, x.p.author, periodText(x.period), ...x.rows.map((r) => `${r.customer} ${r.project}`)].some((v) => v.toLowerCase().includes(needle)))
    .sort((a, b) => a.p.division.localeCompare(b.p.division) || b.period.from.localeCompare(a.period.from));
  const shownYears: number[] = [...new Set<number>(list.flatMap((x) => yearsOf(x.period)))].sort((a, b) => a - b);
  /** HĐ đã ký thực tế của khối trong kỳ (Danh sách dự án: ngày ký HĐ thuộc kỳ). */
  const signedIn = (div: string, pr: Period) =>
    projects.filter((p) => p.division === div && p.contractSigned && signedDate(p) && inRange(signedDate(p).slice(0, 7), pr.from, pr.to)).reduce((s0, p) => s0 + (signedValue(p) || 0), 0);
  const yearVal = (rows: TargetRow[], y: number) => rows.filter((r) => r.signMonth.startsWith(`${y}-`)).reduce((s0, r) => s0 + (r.value || 0), 0);
  const approvedOf = (p: TargetPlan) => (p.effectiveRows ? totals(p.effectiveRows).value : null);
  // Ô tổng quan: mục tiêu năm nay (đã duyệt) và HĐ đã ký năm nay của các khối trong phạm vi
  const divs = canEdit ? [OWN_DIVISION] : division === ALL_DIV ? DIVISIONS : [division];
  const targetYear = divs.reduce((s0, d) => s0 + (yearTargetsOf(plans, d)[thisYear] || 0), 0);
  const signedYear = divs.reduce((s0, d) => s0 + signedIn(d, yearRange(+thisYear)), 0);
  const byStatus = (['Bản nháp', 'Chờ CFO duyệt', 'Chờ BOD duyệt', 'Đã duyệt', 'Từ chối', 'Đã rút'] as TargetStatus[]).map((st) => [st, all.filter((x) => x.status === st).length] as const).filter(([, n]) => n);
  const sum = (f: (x: ListItem) => number) => list.reduce((s0, x) => s0 + f(x), 0);
  const th = `${erp.th} border-t-0 whitespace-nowrap`;
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <KpiBox label="Kế hoạch mục tiêu" value={all.length} sub={byStatus.map(([st, n]) => `${st} ${n}`).join(' · ') || '—'} />
        <KpiBox
          label={canEdit ? 'Đang chờ duyệt' : `Chờ ${role} duyệt`}
          value={<span className={(canEdit ? all.filter((x) => isPending(x.status)).length : mine.length) ? 'text-amber-600' : ''}>{canEdit ? all.filter((x) => isPending(x.status)).length : mine.length}</span>}
          sub={canEdit ? 'Hồ sơ đã gửi, chờ CFO / BOD' : 'Bấm để lọc các kế hoạch đến lượt bạn duyệt'}
          onClick={canEdit ? undefined : () => setStatus('MINE')}
        />
        <KpiBox label={`Mục tiêu năm ${thisYear} (đã duyệt)`} value={fmt(targetYear)} valueText={fmt(targetYear)} sub={`${canEdit ? `Khối ${OWN_DIVISION}` : division === ALL_DIV ? 'Cả công ty' : `Khối ${division}`} · Σ dòng Ký HĐ năm ${thisYear}`} />
        <KpiBox
          label={`Đã ký HĐ năm ${thisYear}`}
          value={fmt(signedYear)}
          valueText={fmt(signedYear)}
          badge={targetYear ? pct(signedYear / targetYear) : undefined}
          tone={targetYear && signedYear >= targetYear ? 'good' : 'neutral'}
          sub="Theo Danh sách dự án · % so với mục tiêu năm đã duyệt"
        />
      </div>

      <Panel
        title="Danh sách kế hoạch mục tiêu kinh doanh"
        icon={Target}
        noPad
        actions={
          <>
            <Btn icon={Eye} className="h-7" onClick={onRange}>
              Xem tổng hợp theo khoảng thời gian
            </Btn>
            {canEdit && (
              <Btn variant="primary" icon={Plus} className="h-7" onClick={onNew} data-testid="target-new">
                Lập kế hoạch kỳ mới
              </Btn>
            )}
          </>
        }
        footer="Bấm vào một dòng để xem chi tiết, sửa, gửi duyệt hoặc phê duyệt. Giá trị theo năm = Σ các dòng có Ký HĐ trong năm. Đã ký = HĐ đã ký của khối có ngày ký trong kỳ (Danh sách dự án); % hoàn thành so với mục tiêu đã duyệt của kỳ. ĐVT: VNĐ."
      >
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-slate-200 text-[12px]">
          <label className="flex items-center gap-1.5 text-slate-600">
            Khối
            <select value={canEdit ? OWN_DIVISION : division} disabled={canEdit} onChange={(e) => setDivision(e.target.value)} className={`${erp.input} h-7 w-36`}>
              {!canEdit && <option value={ALL_DIV}>Tất cả</option>}
              {(canEdit ? [OWN_DIVISION] : DIVISIONS).map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-slate-600">
            Trạng thái
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={`${erp.input} h-7 w-44`} data-testid="target-status-filter">
              <option value="ALL">Tất cả</option>
              {!canEdit && <option value="MINE">Chờ tôi duyệt ({mine.length})</option>}
              {(['Bản nháp', 'Chờ CFO duyệt', 'Chờ BOD duyệt', 'Đã duyệt', 'Từ chối', 'Đã rút'] as TargetStatus[])
                .filter((st) => canEdit || st !== 'Bản nháp')
                .map((st) => (
                  <option key={st}>{st}</option>
                ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-slate-600">
            Kỳ có năm
            <select value={year} onChange={(e) => setYear(e.target.value)} className={`${erp.input} h-7 w-28`}>
              <option value="ALL">Tất cả</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm khối, người lập, khách hàng, dự án…" className={`${erp.input} h-7 w-64`} />
          <span className="ml-auto text-slate-500">{list.length} kế hoạch</span>
        </div>
        <div className="overflow-x-auto">
          <table className={erp.table} data-testid="target-list">
            <thead>
              <tr>
                <th rowSpan={2} className={`${th} border-l-0 text-left`}>Khối</th>
                <th rowSpan={2} className={`${th} text-center`}>Kỳ kế hoạch</th>
                <th rowSpan={2} className={`${th} text-center`}>Số tháng</th>
                <th rowSpan={2} className={`${th} text-left`}>Trạng thái — phiên bản</th>
                <th rowSpan={2} className={`${th} text-center`}>Số dự án</th>
                <th rowSpan={2} className={`${th} text-right`}>Giá trị mục tiêu</th>
                <th rowSpan={2} className={`${th} text-right`}>% LN gộp</th>
                <th rowSpan={2} className={`${th} text-right`}>LN gộp</th>
                {shownYears.length > 0 && (
                  <th colSpan={shownYears.length} className={`${th} text-center`}>
                    Giá trị mục tiêu theo năm
                  </th>
                )}
                <th rowSpan={2} className={`${th} text-right`}>Đã ký trong kỳ</th>
                <th rowSpan={2} className={`${th} text-right`} title="Đã ký trong kỳ ÷ Giá trị mục tiêu đã duyệt của kỳ">
                  % hoàn thành
                </th>
                <th rowSpan={2} className={`${th} text-left`}>Người lập</th>
                <th rowSpan={2} className={`${th} text-left`}>Cập nhật</th>
                <th rowSpan={2} className={`${th} border-r-0`} />
              </tr>
              <tr>
                {shownYears.map((y) => (
                  <th key={y} className={`${erp.th} text-right font-medium`}>
                    {y}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((x) => {
                const t = totals(x.rows);
                const signed = signedIn(x.p.division, x.period);
                const appr = approvedOf(x.p);
                const done = appr ? signed / appr : null;
                const at = lastUpdate(x.p);
                const decide = canDecide(x.p.status, role);
                return (
                  <tr key={x.p.id} className={`${erp.tr} cursor-pointer`} onClick={() => onOpen(x.p.division, x.p.id)} data-testid={`target-row-${x.p.division}`}>
                    <td className={`${erp.td} border-l-0 font-semibold text-[#1e3a5f]`}>{x.p.division}</td>
                    <td className={`${erp.td} text-center whitespace-nowrap`}>{periodText(x.period)}</td>
                    <td className={`${erp.td} text-center`}>{periodMonths(x.period)}</td>
                    <td className={erp.td}>
                      <Tag cls={STATUS_CLS[x.status]}>{`${x.status} — V${String(x.version).padStart(2, '0')}`}</Tag>
                    </td>
                    <td className={`${erp.td} text-center`}>{x.rows.length}</td>
                    <td className={`${erp.td} ${erp.num} font-semibold`}>{fmt(t.value)}</td>
                    <td className={`${erp.td} ${erp.num}`}>{t.value ? pct(t.rate) : '—'}</td>
                    <td className={`${erp.td} ${erp.num} ${t.grossProfit < 0 ? 'text-rose-700' : ''}`}>{fmt(t.grossProfit)}</td>
                    {shownYears.map((y) => (
                      <td key={y} className={`${erp.td} ${erp.num} ${yearsOf(x.period).includes(y) ? '' : 'bg-slate-50 text-slate-300'}`}>
                        {yearsOf(x.period).includes(y) ? fmt(yearVal(x.rows, y)) : '—'}
                      </td>
                    ))}
                    <td className={`${erp.td} ${erp.num}`}>{fmt(signed)}</td>
                    <td className={`${erp.td} ${erp.num} font-semibold ${done == null ? 'text-slate-400' : done >= 1 ? 'text-emerald-700' : 'text-amber-700'}`} title={appr != null ? `Mục tiêu đã duyệt ${fmt(appr)}` : 'Chưa có phiên bản được duyệt'}>
                      {done == null ? '—' : pct(done)}
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>{x.p.author}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{at ? dt(at) : '—'}</td>
                    <td className={`${erp.td} text-center border-r-0 whitespace-nowrap`}>
                      <span className={`underline font-semibold ${decide ? 'text-rose-600' : 'text-[#1f5fa8]'}`}>{decide ? 'Duyệt' : 'Xem'}</span>
                    </td>
                  </tr>
                );
              })}
              {!list.length && (
                <tr>
                  <td colSpan={13 + shownYears.length} className={`${erp.td} border-x-0 py-8 text-center text-slate-400`}>
                    Không có kế hoạch nào phù hợp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
            {list.length > 0 && (
              <tfoot>
                <tr className={erp.totalRow}>
                  <td colSpan={4} className={`${erp.td} border-l-0`}>
                    TỔNG ({list.length} kế hoạch)
                  </td>
                  <td className={`${erp.td} text-center`}>{sum((x) => x.rows.length)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmt(sum((x) => totals(x.rows).value))}</td>
                  <td className={`${erp.td} ${erp.num}`}>{sum((x) => totals(x.rows).value) ? pct(sum((x) => totals(x.rows).grossProfit) / sum((x) => totals(x.rows).value)) : '—'}</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmt(sum((x) => totals(x.rows).grossProfit))}</td>
                  {shownYears.map((y) => (
                    <td key={y} className={`${erp.td} ${erp.num}`}>
                      {fmt(sum((x) => (yearsOf(x.period).includes(y) ? yearVal(x.rows, y) : 0)))}
                    </td>
                  ))}
                  <td className={`${erp.td} ${erp.num}`}>{fmt(sum((x) => signedIn(x.p.division, x.period)))}</td>
                  <td className={erp.td} />
                  <td className={erp.td} colSpan={3} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Panel>
    </>
  );
};

// ==========================================================================
// Trang
// ==========================================================================
export const BizTargetPage: React.FC = () => {
  // Màn ngoài = danh sách kế hoạch; bấm 1 dòng ⇒ chi tiết (lập / sửa / gửi / rút / phê duyệt); hoặc xem tổng hợp theo khoảng thời gian.
  const [screen, setScreen] = useState<{ k: 'list' } | { k: 'detail'; division: string; planId?: string } | { k: 'range' }>({ k: 'list' });
  // Bản thử nghiệm (chưa có đăng nhập / phân quyền thật): chọn vai trò để thử luồng GĐK → CFO → BOD.
  const [role, setRole] = useState<Role>('GĐK');
  const [toast, setToast] = useState<{ msg: string; kind: 'ok' | 'error' } | null>(null);
  const flash: Flash = (msg, kind = 'ok') => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 2600);
  };
  const back = () => setScreen({ k: 'list' });
  const open = (division: string, planId: string) => setScreen({ k: 'detail', division, planId });
  return (
    <ErpPage>
      {toast && (
        <div className={`fixed top-5 right-5 z-[120] text-white px-4 py-2.5 rounded-[4px] shadow-lg flex items-center gap-2 text-[12px] font-semibold max-w-md ${toast.kind === 'error' ? 'bg-rose-700' : 'bg-[#1e3a5f]'}`}>
          {toast.kind === 'error' ? <AlertCircle size={14} className="shrink-0" /> : <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />} {toast.msg}
        </div>
      )}
      <ErpTitleBar crumbs={CRUMBS} title={screen.k === 'list' ? 'Mục tiêu kinh doanh' : screen.k === 'range' ? 'Mục tiêu kinh doanh — xem theo khoảng thời gian' : 'Mục tiêu kinh doanh — chi tiết kế hoạch'} />
      <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
        Vai trò thử nghiệm
        <Segmented
          options={[
            { key: 'GĐK', label: 'GĐK (lập)' },
            { key: 'CFO', label: 'CFO (duyệt bước 1)' },
            { key: 'BOD', label: 'BOD (duyệt bước 2)' },
          ]}
          value={role}
          onChange={(r2) => (setRole(r2), setScreen({ k: 'list' }))}
        />
      </div>
      {screen.k === 'list' ? (
        <TargetList role={role} onOpen={open} onNew={() => setScreen({ k: 'detail', division: OWN_DIVISION, planId: '__new__' })} onRange={() => setScreen({ k: 'range' })} />
      ) : screen.k === 'range' ? (
        <GdkTab key={`range-${role}`} flash={flash} role={role} init={{ mode: 'view' }} onBack={back} onOpenPlan={open} />
      ) : (
        <GdkTab key={`d-${screen.division}-${screen.planId}-${role}`} flash={flash} role={role} init={{ mode: 'edit', division: screen.division, planId: screen.planId }} onBack={back} onOpenPlan={open} />
      )}
    </ErpPage>
  );
};
