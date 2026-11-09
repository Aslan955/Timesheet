/**
 * BizTargetPage — "Mục tiêu kinh doanh" (module Quản trị dự án & Tài chính). Đồng bộ logic với code thật
 * (BusinessProjectTargetService / Calculator, màn /BusinessProjects/Target).
 *
 * 2 tab:
 *   1. GĐK lập mục tiêu — 2 chế độ:
 *      • Lập hồ sơ theo năm: Khối + Năm kế hoạch (năm hiện tại + 4 năm kế tiếp). Hồ sơ đã có dòng chỉ xem cho tới khi bấm "Edit";
 *        hồ sơ trống sửa luôn. Dòng: Khách hàng, Tên dự án, Ra thầu (được năm trước, ≤ Ký HĐ), Ký HĐ (thuộc năm kế hoạch),
 *        Giá trị (VNĐ), % LN gộp mục tiêu (số nguyên, được âm — ô nhập), LN gộp (tự tính = Giá trị × %), Cơ sở đăng ký.
 *        [Lưu nháp] [Gửi duyệt] · đang chờ duyệt ⇒ khoá, GĐK chỉ [Rút hồ sơ] (lý do bắt buộc). Không có kỳ lập / kỳ điều chỉnh.
 *      • Xem theo khoảng thời gian: Khối (kể cả Tất cả) + Từ tháng – Đến tháng (MM/YYYY, lọc theo tháng Ký HĐ, xuyên năm,
 *        mặc định năm hiện tại) + Trạng thái; chỉ xem. Không ảnh hưởng việc lập hồ sơ theo năm.
 *   2. Phê duyệt — chỉ hồ sơ ĐẾN LƯỢT người xem: CFO ⇒ "Chờ CFO duyệt", BOD ⇒ "Chờ BOD duyệt"; có cùng bộ lọc khoảng tháng Ký HĐ.
 *
 * Luồng: GĐK gửi ⇒ Chờ CFO ⇒ CFO duyệt ⇒ Chờ BOD ⇒ BOD duyệt ⇒ Đã duyệt (ghi mục tiêu chính thức = Σ Giá trị vào Sổ theo dõi dự án).
 *        CFO từ chối ⇒ Từ chối (về GĐK); BOD từ chối ⇒ trả về Chờ CFO. Từ chối bắt buộc ý kiến.
 * Phiên bản: sửa nội dung sau khi Đã duyệt / Từ chối / đã có quyết định ⇒ phiên bản mới; phiên bản đã duyệt vẫn là mục tiêu chính thức.
 * Lưu lịch sử mọi lần lưu / gửi / rút / duyệt / từ chối, kèm nội dung đã điều chỉnh. ĐVT: VNĐ.
 * Vai trò (GĐK / CFO / BOD) chỉ là công tắc thử nghiệm của bản prototype — hệ thống thật phân quyền theo quyền + Organization.HODID.
 */
import React, { createContext, useContext, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, ClipboardCheck, Eye, Flag, History, LogOut, Pencil, PenLine, Plus, RotateCcw, Save, Send, Target, Upload, X, XCircle } from 'lucide-react';
import { DIVISIONS, useBusinessProjects } from '../business/BusinessProjectContext';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, KpiBox, Panel, Segmented, Tag, erp } from './erp/Erp';
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
  year: number;
  author: string;
  version: number;
  status: TargetStatus;
  rows: TargetRow[];
  /** Phiên bản đã được BOD duyệt gần nhất (mục tiêu chính thức) — khác `version` khi đang điều chỉnh. */
  effectiveVersion?: number;
  effectiveRows?: TargetRow[];
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
/** Seed nhập theo triệu VNĐ cho gọn, đổi sang VNĐ; % LN gộp làm tròn nguyên, LN gộp tính lại từ %. */
const r = (customer: string, project: string, tender: string, sign: string, valueTr: number, gpTr: number, basis = ''): TargetRow => {
  const value = valueTr * 1_000_000;
  const rate = valueTr ? Math.round((gpTr / valueTr) * 100) : 0;
  return { id: uid(), customer, project, tenderMonth: tender, signMonth: sign, value, grossProfitRate: rate, grossProfit: computeGp(value, rate), basis };
};

const SEED: TargetPlan[] = [
  {
    id: 'TP-G1-2027',
    division: 'G1',
    year: 2027,
    author: 'GĐK G1',
    version: 1,
    status: 'Bản nháp',
    rows: [
      r('Khách hàng A', 'Dự án A1', '2027-01', '2027-02', 18000, 4500),
      r('Khách hàng A', 'Dự án A2', '2027-02', '2027-03', 14000, 3500),
      r('Khách hàng B', 'Dự án B1', '2027-03', '2027-04', 16000, 3200),
      r('Khách hàng B', 'Dự án B2', '2027-04', '2027-05', 10000, 2000),
      r('Khách hàng C', 'Dự án C1', '2027-05', '2027-06', 12000, 3600),
      r('Khách hàng C', 'Dự án C2', '2027-06', '2027-07', 8000, 2400),
      r('Khách hàng D', 'Dự án D1', '2027-07', '2027-08', 14000, 2800),
      r('Khách hàng E', 'Dự án E1', '2027-08', '2027-09', 8000, 1200),
    ],
    history: [{ at: '2026-09-30T08:00:00.000Z', by: 'GĐK G1', action: 'Tạo hồ sơ', version: 1 }],
  },
  {
    id: 'TP-G2-2027',
    division: 'G2',
    year: 2027,
    author: 'GĐK G2',
    version: 1,
    status: 'Chờ CFO duyệt',
    rows: [
      r('Bán lẻ 045', 'Mở rộng hệ thống bán lẻ', '2027-01', '2027-03', 30000, 6600, 'Khách hàng hiện hữu, đã có chủ trương'),
      r('Kho bạc 045', 'Chuyển đổi số kho bạc GĐ2', '2027-04', '2027-06', 24000, 4800, 'Nối tiếp GĐ1'),
      r('Sở Tài chính 045', 'Cổng dịch vụ tài chính', '2027-06', '2027-09', 18000, 4500),
    ],
    history: [
      { at: '2026-09-20T03:00:00.000Z', by: 'GĐK G2', action: 'Tạo hồ sơ', version: 1 },
      { at: '2026-09-28T09:30:00.000Z', by: 'GĐK G2', action: 'Gửi duyệt', version: 1 },
    ],
  },
];

// --------------------------------------------------------------------------
// Năm 2026 — hồ sơ đã được BOD duyệt (lập 12/2025). Tổng mỗi khối = mục tiêu ký HĐ 2026
// trong Sổ theo dõi dự án (SEED_TARGETS); các dòng gắn với dự án đang có trên hệ thống.
// --------------------------------------------------------------------------
const log = (at: string, by: string, action: string, version: number, extra: Partial<TargetLog> = {}): TargetLog => ({ at, by, action, version, ...extra });
const APPROVE = 'BOD phê duyệt — ghi nhận kế hoạch chính thức';
const CFO_APPROVE = 'CFO phê duyệt — chuyển BOD duyệt';
const approved2026 = (division: string, version: number, rows: TargetRow[], history: TargetLog[], bodNote?: string): TargetPlan => ({
  id: `TP-${division}-2026`,
  division,
  year: 2026,
  author: `GĐK ${division}`,
  version,
  status: 'Đã duyệt',
  rows,
  effectiveVersion: version,
  effectiveRows: rows.map((x) => ({ ...x })),
  decisionBy: 'BOD',
  bodNote,
  history,
});
const firstRound = (d: string, created: string, sent: string, ok: string, note?: string) => [
  log(`${created}T02:00:00.000Z`, `GĐK ${d}`, 'Tạo hồ sơ', 1),
  log(`${sent}T09:00:00.000Z`, `GĐK ${d}`, 'Gửi duyệt', 1),
  log(`${sent}T15:00:00.000Z`, 'CFO', CFO_APPROVE, 1),
  ...(ok ? [log(`${ok}T08:30:00.000Z`, 'BOD', APPROVE, 1, note ? { note } : {})] : []),
];

SEED.push(
  approved2026(
    'G1',
    2,
    [
      r('Bộ 022', 'Nền tảng chuyển đổi số quốc gia', '2025-11', '2026-01', 1_000_000, 380_000, 'Đã trúng thầu 11/2025, chờ ký HĐ'),
      r('Tập đoàn 022', 'ERP Tập đoàn 022', '2025-12', '2026-01', 250_000, 70_000, 'Khách hàng hiện hữu, đã có chủ trương đầu tư'),
      r('Bộ 022', 'Hệ thống dữ liệu dân cư mở rộng', '2026-05', '2026-07', 60_000, 15_000, 'Mở rộng từ Nền tảng chuyển đổi số quốc gia'),
      r('Tập đoàn 022', 'Mở rộng ERP phân hệ kho', '2026-06', '2026-09', 30_000, 7_500),
      r('Sở Tài chính 022', 'Cổng thanh toán điện tử tỉnh', '2026-08', '2026-10', 15_000, 3_750, 'Đã khảo sát, khách hàng gửi đề xuất kỹ thuật'),
      r('Bộ 022', '022.NSG', '2026-09', '2026-11', 145_000, 43_500, 'Dự án trọng điểm, PAKD đang trình duyệt'),
    ],
    [
      ...firstRound('G1', '2025-12-03', '2025-12-15', '2025-12-22'),
      log('2026-06-10T03:00:00.000Z', 'GĐK G1', 'Lưu nháp', 2, { changes: ['Sửa 022.NSG: ra thầu 06/2026 → 09/2026; ký HĐ 08/2026 → 11/2026', 'Sửa Mở rộng ERP phân hệ kho: ký HĐ 07/2026 → 09/2026'] }),
      log('2026-06-12T09:00:00.000Z', 'GĐK G1', 'Gửi duyệt', 2),
      log('2026-06-12T14:00:00.000Z', 'CFO', CFO_APPROVE, 2),
      log('2026-06-20T08:30:00.000Z', 'BOD', APPROVE, 2, { note: 'Đồng ý điều chỉnh tiến độ quý 2, giữ nguyên tổng mục tiêu.' }),
    ],
    'Đồng ý điều chỉnh tiến độ quý 2, giữ nguyên tổng mục tiêu.',
  ),
  approved2026(
    'G2',
    1,
    [
      r('Bán lẻ 045', 'Data Lake phân tích khách hàng', '2025-12', '2026-01', 6_500, 1_600, 'Đã chốt phạm vi với khách hàng'),
      r('Bán lẻ 045', 'Hệ thống bán lẻ đa kênh', '2025-12', '2026-02', 48_000, 14_400, 'Khách hàng hiện hữu'),
      r('Kho bạc 045', 'Chuyển đổi số kho bạc', '2026-09', '2026-12', 15_500, 3_900, 'Giai đoạn 1, khả năng mở rộng GĐ2 năm 2027'),
    ],
    firstRound('G2', '2025-12-05', '2025-12-16', '2025-12-23'),
  ),
  approved2026(
    'G3',
    1,
    [
      r('Tổng công ty 038', 'Hệ thống giám sát dữ liệu tập trung', '2025-12', '2026-02', 12_500, 3_750, 'Đã trình chủ trương, dự kiến ký Q1'),
      r('Tổng công ty 038', 'Nâng cấp hạ tầng giám sát GĐ2', '2026-07', '2026-10', 7_500, 1_900, 'Nối tiếp hệ thống giám sát GĐ1'),
    ],
    firstRound('G3', '2025-12-08', '2025-12-17', '2025-12-23'),
  ),
  approved2026(
    'G4',
    2,
    [
      r('Sản xuất 061', 'Nền tảng IoT nhà máy', '2025-11', '2026-01', 120_000, 30_000, 'Đã trúng thầu'),
      r('Sản xuất 061', 'Triển khai ERP giai đoạn 2', '2026-04', '2026-07', 22_000, 5_500, 'Nối tiếp ERP GĐ1 (061.015) kết thúc 06/2026'),
      r('Sản xuất 061', 'Bảo trì hệ thống MES', '2026-09', '2026-11', 8_000, 2_400),
    ],
    [
      ...firstRound('G4', '2025-12-04', '2025-12-15', '2025-12-22'),
      log('2026-09-08T02:00:00.000Z', 'GĐK G4', 'Lưu nháp', 2, { changes: ['Sửa Bảo trì hệ thống MES: ký HĐ 09/2026 → 11/2026; HĐ ký mới 10,000,000,000 → 8,000,000,000; LN gộp 3,000,000,000 → 2,400,000,000', 'Sửa Triển khai ERP giai đoạn 2: HĐ ký mới 20,000,000,000 → 22,000,000,000; LN gộp 5,000,000,000 → 5,500,000,000'] }),
      log('2026-09-10T09:00:00.000Z', 'GĐK G4', 'Gửi duyệt', 2),
      log('2026-09-10T14:00:00.000Z', 'CFO', CFO_APPROVE, 2),
      log('2026-09-18T08:30:00.000Z', 'BOD', APPROVE, 2),
    ],
  ),
  approved2026(
    'BFSI',
    2,
    [
      r('Ngân hàng 010', 'Hệ thống chấm điểm tín dụng', '2025-11', '2026-01', 450_000, 112_500, 'Đã trúng thầu, đàm phán giá trị cuối'),
      r('CÔNG TY CỔ PHẦN GALAXY TECHNOLOGY SERVICES', 'HDBank Staffing', '2025-12', '2026-01', 4_800, 720, 'Gia hạn HĐ cho thuê nhân sự'),
      r('CÔNG TY CỔ PHẦN ATOMI DIGITAL', 'LPB Staffing', '2025-12', '2026-01', 1_200, 180, 'Gia hạn HĐ cho thuê nhân sự'),
      r('Ngân hàng 010', 'Cho thuê nhân sự kiểm thử', '2026-05', '2026-06', 6_000, -600, 'Chấp nhận lỗ để giữ khách hàng, bù bằng Core Banking Mobile Upgrade'),
      r('Ngân hàng 010', 'Core Banking Mobile Upgrade', '2026-08', '2026-10', 38_000, 9_500, 'Khách hàng đã gửi RFP sơ bộ, tham chiếu dự án chấm điểm tín dụng'),
    ],
    [
      ...firstRound('BFSI', '2025-12-02', '2025-12-12', ''),
      log('2025-12-18T08:30:00.000Z', 'BOD', 'BOD từ chối — trả về CFO', 1, { note: 'Bổ sung thuyết minh cho Core Banking Mobile Upgrade; LN gộp chấm điểm tín dụng cần đạt tối thiểu 25%.' }),
      log('2025-12-19T03:00:00.000Z', 'CFO', 'CFO từ chối', 1, { note: 'Đề nghị GĐK bổ sung thuyết minh và điều chỉnh LN gộp theo ý kiến BOD.' }),
      log('2025-12-22T03:00:00.000Z', 'GĐK BFSI', 'Gửi duyệt', 2, { changes: ['Sửa Hệ thống chấm điểm tín dụng: LN gộp 99,000,000,000 → 112,500,000,000', 'Sửa Core Banking Mobile Upgrade: thuyết minh'] }),
      log('2025-12-23T03:00:00.000Z', 'CFO', CFO_APPROVE, 2),
      log('2025-12-26T08:30:00.000Z', 'BOD', APPROVE, 2),
    ],
  ),
  approved2026(
    'GPDV',
    1,
    [
      r('CÔNG TY CỔ PHẦN CÔNG NGHỆ TÀI CHÍNH DIGILEND', 'Digilend', '2025-12', '2026-01', 600, 150, 'Gia hạn HĐ dịch vụ'),
      r('Tổng công ty 077', 'Dịch vụ vận hành hạ tầng', '2025-12', '2026-01', 500, 125, 'Gia hạn HĐ vận hành'),
      r('Tổng công ty 077', 'Giám sát an ninh mạng SOC', '2026-06', '2026-08', 900, -150, 'Năm đầu đầu tư hạ tầng SOC, lỗ; có lãi từ năm 2027'),
    ],
    firstRound('GPDV', '2025-12-09', '2025-12-18', '2025-12-24'),
  ),
);

SEED.push(
  {
    id: 'TP-G3-2027',
    division: 'G3',
    year: 2027,
    author: 'GĐK G3',
    version: 1,
    status: 'Chờ BOD duyệt',
    rows: [
      r('Tổng công ty 038', 'Mở rộng hệ thống giám sát GĐ3', '2026-12', '2027-02', 9_000, 2_250, 'Nối tiếp GĐ2'),
      r('Tổng công ty 038', 'Trung tâm điều hành an ninh', '2027-03', '2027-07', 16_000, 3_200, 'Đã trình chủ trương'),
    ],
    decisionBy: 'CFO',
    history: [
      log('2026-10-12T02:00:00.000Z', 'GĐK G3', 'Tạo hồ sơ', 1),
      log('2026-10-14T09:00:00.000Z', 'GĐK G3', 'Gửi duyệt', 1),
      log('2026-10-16T08:00:00.000Z', 'CFO', CFO_APPROVE, 1, { note: 'Đồng ý, chuyển BOD.' }),
    ],
    bodNote: 'Đồng ý, chuyển BOD.',
  },
  {
    id: 'TP-G4-2027',
    division: 'G4',
    year: 2027,
    author: 'GĐK G4',
    version: 1,
    status: 'Đã rút',
    rows: [r('Sản xuất 061', 'Nâng cấp dây chuyền MES', '2027-01', '2027-05', 11_000, 2_200, 'Chờ chốt ngân sách khách hàng')],
    withdrawReason: 'Khách hàng chưa chốt ngân sách, cần cập nhật lại giá trị.',
    history: [
      log('2026-10-20T02:00:00.000Z', 'GĐK G4', 'Tạo hồ sơ', 1),
      log('2026-10-21T09:00:00.000Z', 'GĐK G4', 'Gửi duyệt', 1),
      log('2026-10-22T03:00:00.000Z', 'GĐK G4', 'Rút hồ sơ', 1, { note: 'Khách hàng chưa chốt ngân sách, cần cập nhật lại giá trị.' }),
    ],
  },
);

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
const monthInYear = (ym: string, year: number) => monthValid(ym) && ym.startsWith(`${year}-`);
const tenderAfterSign = (x: TargetRow) => !!x.tenderMonth && !!x.signMonth && x.tenderMonth > x.signMonth;
/** Ra thầu được chọn năm trước, nhưng không quá hết năm kế hoạch. */
const tenderOutOfRange = (ym: string, year: number) => !monthValid(ym) || ym > `${year}-12`;
const tenderInvalid = (x: TargetRow, year: number) => !!x.tenderMonth && (tenderOutOfRange(x.tenderMonth, year) || tenderAfterSign(x));
const signInvalid = (x: TargetRow, year: number) => !!x.signMonth && (!monthInYear(x.signMonth, year) || tenderAfterSign(x));
const rateValid = (rate: number | null) => rate == null || (Number.isInteger(rate) && Math.abs(rate) <= MAX_RATE);
const monthError = (x: TargetRow, i: number, year: number) => {
  if (x.signMonth && !monthInYear(x.signMonth, year)) return `Dòng ${i + 1}: tháng ký HĐ phải thuộc năm ${year}.`;
  if (x.tenderMonth && tenderOutOfRange(x.tenderMonth, year)) return `Dòng ${i + 1}: tháng ra thầu không được sau năm ${year}.`;
  if (tenderAfterSign(x)) return `Dòng ${i + 1}: tháng ra thầu phải trước hoặc bằng tháng ký HĐ.`;
  return '';
};
const rateError = (i: number) => `Dòng ${i + 1}: % LN gộp phải là số nguyên trong khoảng từ -${fmt(MAX_RATE)}% đến ${fmt(MAX_RATE)}%.`;
/** Lưu nháp: ≥ 1 dòng (trừ khi hồ sơ đã có dòng lưu — cho xoá hết), mỗi dòng bắt buộc Khách hàng + Tên dự án; kiểm trần % / giá trị / tháng. */
const validateDraft = (rows: TargetRow[], year: number, allowEmpty: boolean) => {
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
const validateSubmit = (rows: TargetRow[], year: number) => {
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
    const changed = old ? rowsChanged(old.rows, rows) : true;
    // Gửi lại nguyên phiên bản đã duyệt là vô nghĩa.
    if (old && !changed && submit && old.status === 'Đã duyệt') return 'Nội dung chưa thay đổi so với phiên bản đã duyệt — không cần gửi lại.';
    // Lưu nháp không có thay đổi ⇒ không ghi nhận gì (không log, không đổi trạng thái).
    if (old && !changed && !submit) return '';
    // BR12: phiên bản đã có quyết định (BOD duyệt / từ chối, CFO từ chối) không bị ghi đè — sửa nội dung sang phiên bản mới.
    const decided = !!old && old.history.some((h) => h.version === old.version && DECISION_ACTIONS.includes(h.action));
    const version = !old ? 1 : !changed ? old.version : decided || old.status === 'Đã duyệt' || old.status === 'Từ chối' ? old.version + 1 : old.version;
    const logs: TargetLog[] = [];
    const changes = diffRows(old?.rows, rows);
    if (!old) logs.push({ at: now(), by, action: 'Tạo hồ sơ', version, changes: changes.length ? changes : undefined });
    else if (!submit || changed) logs.push({ at: now(), by, action: submit ? 'Gửi duyệt' : 'Lưu nháp', version, changes: changed && changes.length ? changes : undefined });
    if (!old && submit) logs.push({ at: new Date(Date.now() + 1).toISOString(), by, action: 'Gửi duyệt', version });
    if (old && submit && !changed) logs.splice(0, logs.length, { at: now(), by, action: 'Gửi duyệt', version });
    const next: TargetPlan = {
      ...(old || p),
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
              ...(status === 'Đã duyệt' ? { effectiveVersion: x.version, effectiveRows: x.rows.map((y) => ({ ...y })) } : {}),
              history: [...x.history, { at: now(), by, action, version: x.version, note: note || undefined }],
            }
          : x,
      ),
    );
    // BR27: ghi nhận mục tiêu ký HĐ chính thức của khối = Σ HĐ ký mới (đã là VNĐ) cho Sổ theo dõi dự án.
    if (status === 'Đã duyệt') setYearTargets(String(p.year), { ...(targets[String(p.year)] || {}), [p.division]: totals(p.rows).value });
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
const PlanHeader: React.FC<{ p: TargetPlan }> = ({ p }) => {
  const [reason, setReason] = useState(false);
  const byCfo = p.decisionBy === 'CFO';
  const eff = p.effectiveVersion != null && p.effectiveVersion !== p.version && p.effectiveRows;
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['Khối đăng ký', p.division],
          ['Người lập', p.author],
          ['Năm kế hoạch', p.year],
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
          <Flag size={14} className="mt-px shrink-0" /> Mục tiêu chính thức — Phiên bản {String(p.effectiveVersion).padStart(2, '0')}: {fmt(totals(p.effectiveRows!).value)} VNĐ · LN gộp {fmt(totals(p.effectiveRows!).grossProfit)} VNĐ
        </p>
      )}
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
  /** Năm kế hoạch: tô đỏ ô Ra thầu / Ký HĐ sai luật tháng. */
  year?: number;
  /** Xem tổng hợp nhiều hồ sơ: thêm cột "Khối · Năm" (hồ sơ nguồn của dòng). */
  sourceOf?: (row: TargetRow) => string;
  totalLabel?: string;
  emptyText?: string;
}> = ({ rows, editable, actions = editable, lockReason, onChange, customers = [], year, sourceOf, totalLabel = 'TỔNG MỤC TIÊU KHỐI', emptyText }) => {
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
            {['STT', ...(sourceOf ? ['Khối · Năm'] : []), 'Khách hàng', 'Tên dự án'].map((h) => (
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
                    <MonthInput value={x.tenderMonth} onChange={(ym) => set(x.id, { tenderMonth: ym })} className={cell} invalid={year != null && tenderInvalid(x, year)} />
                  </td>
                  <td className="border border-slate-200 p-0 w-32">
                    <MonthInput value={x.signMonth} onChange={(ym) => set(x.id, { signMonth: ym })} className={cell} invalid={year != null && signInvalid(x, year)} />
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
  const where = `${plan.division} năm ${plan.year}`;
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

const GdkTab: React.FC<{ flash: Flash; role: Role }> = ({ flash, role }) => {
  const { plans, savePlan, withdraw } = useBizTargets();
  const { projects } = useBusinessProjects();
  const today = new Date();
  // Quý 4 (tháng 10–12) mặc định chuẩn bị mục tiêu năm sau; còn lại là năm hiện tại.
  const defYear = today.getFullYear() + (today.getMonth() >= 9 ? 1 : 0);
  // Năm kế hoạch được chọn khi lập (BR4 theo code): năm hiện tại + 4 năm kế tiếp.
  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() + i);
  const [mode, setMode] = useState<'edit' | 'view'>('edit');
  const [division, setDivision] = useState(role === 'GĐK' ? OWN_DIVISION : ALL_DIV); // CFO / BOD mặc định "Tất cả (cả công ty)" như code thật
  const [year, setYear] = useState(defYear);
  const editYears = [...new Set([...years, year])].sort((a, b) => a - b); // năm của hồ sơ mở từ chế độ xem vẫn có trong ô
  // Chế độ xem: lọc theo khoảng tháng Ký HĐ (xuyên năm), không dùng Năm kế hoạch.
  const [viewDivision, setViewDivision] = useState(ALL_DIV);
  const [from, setFrom] = useState(yearRange(today.getFullYear()).from);
  const [to, setTo] = useState(yearRange(today.getFullYear()).to);
  const [statusFilter, setStatusFilter] = useState<'ALL' | TargetStatus>('ALL');

  const canEdit = role === 'GĐK';
  const found = plans.find((p) => p.division === division && p.year === year);
  // D2 (chốt 04/11): người không sửa được khối không thấy nội dung Nháp — Nháp có bản hiệu lực ⇒ hiện bản hiệu lực (Đã duyệt); chưa gửi lần nào ⇒ khung trống.
  const saved: TargetPlan | undefined =
    !canEdit && found?.status === 'Bản nháp'
      ? found.effectiveRows
        ? { ...found, status: 'Đã duyệt', version: found.effectiveVersion || found.version, rows: found.effectiveRows, history: found.history.filter((h) => h.version <= (found.effectiveVersion || found.version)) }
        : undefined
      : found;
  const blank = (): TargetPlan => ({ id: `TP-${division}-${year}`, division, year, author: `GĐK ${division}`, version: 1, status: 'Bản nháp', rows: [], history: [] });
  const [draft, setDraft] = useState<TargetPlan>(() => saved || blank());
  const [editing, setEditing] = useState(false); // nút "Edit": hồ sơ đã có dòng chỉ xem cho tới khi bấm Edit
  const [err, setErr] = useState('');
  const [dlg, setDlg] = useState<null | 'submit' | 'withdraw' | 'discard' | 'import'>(null);
  const [onDiscard, setOnDiscard] = useState<(() => void) | null>(null);
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileErr, setFileErr] = useState('');
  // Đổi khối / năm → nạp hồ sơ tương ứng.
  const key = `${division}-${year}`;
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
  const dirty = JSON.stringify(saved?.rows || []) !== JSON.stringify(draft.rows);
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
    flash(submit ? `Đã gửi duyệt mục tiêu ${division} năm ${year}` : 'Đã lưu nháp');
  };
  const save = (submit: boolean) => {
    const e = submit ? validateSubmit(draft.rows, year) : validateDraft(draft.rows, year, !noSaved);
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
      { ...r('Khách hàng A', 'Dự án import 1', `${year - 1}-12`, `${year}-03`, 12_000, 3_000, 'Từ file import'), id: uid() },
      { ...r('Khách hàng B', 'Dự án import 2', `${year}-02`, `${year}-06`, 8_000, 1_600, 'Từ file import'), id: uid() },
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
        <Segmented
          options={[
            { key: 'edit', label: 'Lập hồ sơ theo năm' },
            { key: 'view', label: 'Xem theo khoảng thời gian' },
          ]}
          value={mode}
          onChange={(m) => (m === 'view' ? guard(() => setMode('view')) : setMode('edit'))}
        />
        {isView ? (
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
              <select value={division} onChange={(e) => guard(() => setDivision(e.target.value))} disabled={canEdit} title={canEdit ? 'Khối cố định theo tài khoản GĐK' : undefined} className={`${erp.input} w-40`}>
                {!canEdit && <option value={ALL_DIV}>Tất cả (cả công ty)</option>}
                {DIVISIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Năm kế hoạch
              <select value={year} onChange={(e) => guard(() => setYear(Number(e.target.value)))} className={`${erp.input} w-28`}>
                {editYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
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
          from={isView ? from : yearRange(year).from}
          to={isView ? to : yearRange(year).to}
          statusFilter={statusFilter}
          onOpen={(d, y) => {
            setDivision(d);
            setYear(y);
            setMode('edit');
          }}
        />
      ) : (
        <>
          <Panel title="Mục tiêu kinh doanh" icon={Target}>
            <PlanHeader p={view} />
          </Panel>

          <PlanSummary rows={draft.rows} divisionOf={() => division} defaultBy="customer" />

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
            <RowsTable rows={draft.rows} editable={editable} actions lockReason={lockReason} customers={customers} year={year} onChange={(rows) => setDraft((d) => ({ ...d, rows }))} />
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
          Gửi duyệt mục tiêu {division} năm {year}? Sau khi gửi, hồ sơ bị khoá cho tới khi CFO / BOD quyết định hoặc bạn rút hồ sơ.
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
                onClick={() => (withdraw(saved.id, reason.trim(), by), setDlg(null), flash(`Đã rút hồ sơ mục tiêu ${division} năm ${year}`))}
              >
                Xác nhận rút
              </Btn>
            </>
          }
        >
          <p className="mb-3">Rút hồ sơ mục tiêu {division} năm {year} khỏi hàng chờ duyệt? Sau khi rút, hồ sơ giữ nguyên phiên bản và sửa tiếp được.</p>
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
            Bắt buộc: Khách hàng, Tên dự án, Ra thầu, Ký HĐ, Giá trị, % LN gộp và Cơ sở đăng ký. Khách hàng: nhập Mã khách hàng hoặc "Mã - Tên" như danh sách trên màn. Ký HĐ: tháng MM/YYYY thuộc năm {year}. Ra thầu: tháng MM/YYYY, được chọn năm trước nhưng không sau tháng Ký HĐ. % LN gộp: số nguyên (được âm).
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

const AggregateView: React.FC<{ plans: TargetPlan[]; role: Role; division: string; from: string; to: string; statusFilter: 'ALL' | TargetStatus; onOpen: (division: string, year: number) => void }> = ({
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
  const srcOf = new Map<string, string>(items.flatMap((x) => x.inRange.map((row) => [row.id, `${x.p.division} · ${x.p.year}`] as [string, string])));
  const divOf = new Map<string, string>(items.flatMap((x) => x.inRange.map((row) => [row.id, x.p.division] as [string, string])));
  const rows = items.flatMap((x) => x.inRange).sort((a, b) => (srcOf.get(a.id) || '').localeCompare(srcOf.get(b.id) || '') || a.signMonth.localeCompare(b.signMonth));
  const scopeText = allDiv ? `Cả công ty (${DIVISIONS.length} khối)` : `Khối ${division}`;
  const byStatus = ((role === 'GĐK' ? ['Bản nháp', 'Chờ CFO duyệt', 'Chờ BOD duyệt', 'Đã duyệt', 'Từ chối', 'Đã rút'] : ['Chờ CFO duyệt', 'Chờ BOD duyệt', 'Đã duyệt', 'Từ chối', 'Đã rút']) as TargetStatus[]).map((st) => [st, items.filter((x) => x.v.status === st).length] as const).filter(([, n]) => n);
  const label = allDiv ? 'công ty' : 'khối';
  const list = [...items].sort((a, b) => b.p.year - a.p.year || a.p.division.localeCompare(b.p.division));

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
          <Flag size={14} className="mt-px shrink-0" /> {role === 'GĐK' ? 'Bạn xem được các khối của mình. Khối bạn sửa được hiện mọi trạng thái kể cả Bản nháp (nội dung đang lưu); khối chỉ xem hiện dữ liệu mới nhất trừ Bản nháp. ' : 'Chỉ CFO và BOD xem được cả công ty. Mỗi hồ sơ (Khối · Năm) chỉ hiện dữ liệu mới nhất của nó, không có Bản nháp: hồ sơ chưa gửi duyệt lần nào không hiện; hồ sơ đã duyệt đang sửa dở hiện phiên bản đã duyệt. '}Một khối có nhiều năm trong khoảng lọc thì mỗi năm là một hồ sơ riêng, giữ trạng thái và phiên bản riêng. Tổng chỉ gồm các dòng có tháng Ký HĐ trong khoảng đã chọn (có thể xuyên nhiều năm) — không phải mục tiêu chính thức của năm; tháng Ra thầu không dùng để lọc.
        </p>
        {invalid && <p className="mt-2 text-[12px] text-rose-600 font-semibold">{invalid}</p>}
      </Panel>

      <PlanSummary rows={rows} divisionOf={allDiv ? (x) => divOf.get(x.id) || '—' : undefined} title={`Tổng mục tiêu ${label} trong kỳ`} totalLabel="TỔNG TRONG KỲ" />

      <Panel title="Hồ sơ có dòng trong kỳ" icon={ClipboardCheck} noPad footer="Bấm “Mở hồ sơ” để chuyển sang chế độ lập hồ sơ theo năm của khối đó.">
        <table className={erp.table}>
          <thead>
            <tr>
              {['Khối', 'Năm kế hoạch', 'Trạng thái hồ sơ', 'Số dự án trong kỳ', 'Giá trị trong kỳ (VNĐ)', ''].map((h, i) => (
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
                <td className={`${erp.td} text-center`}>{x.p.year}</td>
                <td className={erp.td}>
                  <Tag cls={STATUS_CLS[x.v.status]}>{`${x.v.status} — Phiên bản ${String(x.v.version).padStart(2, '0')}`}</Tag>
                </td>
                <td className={`${erp.td} text-center`}>{x.inRange.length}</td>
                <td className={`${erp.td} ${erp.num}`}>{fmt(totals(x.inRange).value)}</td>
                <td className={`${erp.td} text-center border-r-0`}>
                  <span className="underline text-[#1f5fa8] cursor-pointer" onClick={() => onOpen(x.p.division, x.p.year)}>
                    Mở hồ sơ
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel title="Danh sách dự án đăng ký trong kỳ" icon={PenLine} noPad footer="Chế độ xem — chỉ xem. Chuyển sang “Lập hồ sơ theo năm” để lập / sửa.">
        <RowsTable rows={rows} sourceOf={(x) => srcOf.get(x.id) || ''} totalLabel="TỔNG TRONG KỲ" emptyText={invalid ? 'Khoảng thời gian không hợp lệ.' : 'Không có mục tiêu nào trong khoảng đã chọn.'} />
      </Panel>
    </>
  );
};

// ==========================================================================
// Tab 2: Phê duyệt (CFO / BOD) — chỉ hồ sơ chờ đúng bước của người xem
// ==========================================================================
const lastUpdate = (p: TargetPlan) => (p.history.length ? p.history[p.history.length - 1].at : '');

const BodTab: React.FC<{ flash: Flash; role: Role }> = ({ flash, role }) => {
  const { plans } = useBizTargets();
  const [openId, setOpenId] = useState<string | null>(null);
  const p = plans.find((x) => x.id === openId);
  // Lọc theo khoảng tháng Ký HĐ — mặc định KHÔNG lọc (D4, chốt 04/11): thấy mọi hồ sơ chờ mình; đặt lọc thì chỉ hồ sơ có ≥ 1 dòng trong khoảng.
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const filtered = !!(from || to);
  const invalid = rangeError(from, to);
  // Nguồn danh sách: hồ sơ ĐẾN LƯỢT người xem duyệt (CFO ⇒ Chờ CFO, BOD ⇒ Chờ BOD).
  const mine = plans.filter((x) => canDecide(x.status, role));
  const matched = invalid ? [] : mine.filter((x) => !filtered || rowsInRange(x.rows, from, to).length > 0);
  const hiddenWaiting = mine.length - matched.length;
  const list = [...matched].sort((a, b) => lastUpdate(b).localeCompare(lastUpdate(a)));

  if (!p)
    return (
      <>
        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 [&>*]:shrink-0">
          <RangeFilter from={from} to={to} onChange={(f, t) => (setFrom(f), setTo(t))} />
        </div>
        <Panel
          title="Hồ sơ mục tiêu kinh doanh"
          icon={ClipboardCheck}
          noPad
          footer={
            <span>
              Bấm vào một hồ sơ để xem và phê duyệt. ĐVT: VNĐ.
              {filtered && ` Số dự án và giá trị chỉ tính các dòng có Ký HĐ trong ${rangeText(from, to)}; mở hồ sơ để xem đầy đủ.`}
              {hiddenWaiting > 0 && <b className="text-rose-600"> Có {hiddenWaiting} hồ sơ chờ bạn duyệt nằm ngoài khoảng lọc — bấm “Xoá lọc” để xem.</b>}
            </span>
          }
        >
          <table className={erp.table}>
            <thead>
              <tr>
                {['Khối', 'Năm kế hoạch', 'Người lập', 'Trạng thái hồ sơ', filtered ? 'Số dự án trong kỳ' : 'Số dự án', filtered ? 'Giá trị mục tiêu trong kỳ' : 'Tổng giá trị mục tiêu', '% LN gộp', 'LN gộp', 'Cập nhật', ''].map((h, i) => (
                  <th key={i} className={`${erp.th} text-center border-t-0 first:border-l-0 last:border-r-0`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.length === 0 && (
                <tr>
                  <td colSpan={10} className={`${erp.td} text-center text-slate-500 border-l-0 border-r-0`}>
                    {invalid ? 'Khoảng thời gian không hợp lệ.' : role === 'GĐK' ? 'Vai trò GĐK không có hồ sơ cần duyệt — đổi sang CFO hoặc BOD để thử phê duyệt.' : 'Không có hồ sơ nào chờ bạn duyệt trong khoảng đã chọn.'}
                  </td>
                </tr>
              )}
              {list.map((x) => {
                const xr = rowsInRange(x.rows, from, to);
                const t = totals(xr);
                const at = lastUpdate(x);
                return (
                  <tr key={x.id} className={`${erp.tr} cursor-pointer`} onClick={() => setOpenId(x.id)}>
                    <td className={`${erp.td} font-semibold border-l-0`}>{x.division}</td>
                    <td className={`${erp.td} text-center`}>{x.year}</td>
                    <td className={erp.td}>{x.author}</td>
                    <td className={erp.td}>
                      <Tag cls={STATUS_CLS[x.status]}>{statusText(x)}</Tag>
                    </td>
                    <td className={`${erp.td} text-center`}>{xr.length}</td>
                    <td className={`${erp.td} ${erp.num}`}>{fmt(t.value)}</td>
                    <td className={`${erp.td} ${erp.num}`}>{t.value ? pct(t.rate) : '—'}</td>
                    <td className={`${erp.td} ${erp.num}`}>{fmt(t.grossProfit)}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{at ? dt(at) : '—'}</td>
                    <td className={`${erp.td} text-center border-r-0`}>
                      <span className="underline text-rose-600 font-bold">Duyệt</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </>
    );

  const decidable = canDecide(p.status, role);
  const stateNote = () => {
    if (p.status === 'Đã rút') return p.withdrawReason ? ` — lý do rút: “${p.withdrawReason}”` : '';
    if (!p.bodNote) return '';
    // Đang chờ duyệt: ý kiến cũ còn lưu — chỉ hiện khi BOD vừa trả về CFO.
    if (isPending(p.status) && !(p.status === 'Chờ CFO duyệt' && p.returnedByBod)) return '';
    return ` — ý kiến ${p.decisionBy === 'CFO' ? 'CFO' : 'BOD'}: “${p.bodNote}”`;
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 bg-white border border-slate-300 rounded-[4px] px-3 py-2">
        <span className="flex items-center gap-3">
          <Btn icon={ArrowLeft} className="h-8" onClick={() => setOpenId(null)}>
            Quay lại danh sách
          </Btn>
          <h2 className="text-[14px] font-bold text-[#1e3a5f]">
            {p.division} · {p.year}
          </h2>
        </span>
        {decidable && (
          <span className="flex items-center gap-2">
            <DecisionButtons plan={p} role={role} flash={flash} />
          </span>
        )}
      </div>
      <Panel title="Mục tiêu kinh doanh" icon={Target}>
        <PlanHeader p={p} />
      </Panel>
      <PlanSummary rows={p.rows} divisionOf={() => p.division} defaultBy="customer" />
      <Panel title="Đăng ký mục tiêu theo khách hàng / dự án" icon={PenLine} noPad>
        <RowsTable rows={p.rows} year={p.year} />
      </Panel>
      {!decidable && (
        <Panel title="Ý kiến phê duyệt — bắt buộc nếu từ chối" icon={ClipboardCheck}>
          <p className="text-[12.5px] text-slate-600">
            Hồ sơ đang ở trạng thái <b>{p.status}</b>
            {stateNote()}.
          </p>
        </Panel>
      )}
      <HistoryPanel p={p} />
    </>
  );
};

// ==========================================================================
// Trang
// ==========================================================================
export const BizTargetPage: React.FC = () => {
  const [tab, setTab] = useState<'gdk' | 'bod'>('gdk');
  // Bản thử nghiệm (chưa có đăng nhập / phân quyền thật): chọn vai trò để thử luồng GĐK → CFO → BOD.
  const [role, setRole] = useState<Role>('GĐK');
  const { plans } = useBizTargets();
  const [toast, setToast] = useState<{ msg: string; kind: 'ok' | 'error' } | null>(null);
  const flash: Flash = (msg, kind = 'ok') => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 2600);
  };
  const waiting = plans.filter((p) => canDecide(p.status, role)).length;
  return (
    <ErpPage>
      {toast && (
        <div className={`fixed top-5 right-5 z-[120] text-white px-4 py-2.5 rounded-[4px] shadow-lg flex items-center gap-2 text-[12px] font-semibold max-w-md ${toast.kind === 'error' ? 'bg-rose-700' : 'bg-[#1e3a5f]'}`}>
          {toast.kind === 'error' ? <AlertCircle size={14} className="shrink-0" /> : <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />} {toast.msg}
        </div>
      )}
      <ErpTitleBar crumbs={CRUMBS} title="Mục tiêu kinh doanh" />
      <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-600">
        Vai trò thử nghiệm
        <Segmented
          options={[
            { key: 'GĐK', label: 'GĐK (lập)' },
            { key: 'CFO', label: 'CFO (duyệt bước 1)' },
            { key: 'BOD', label: 'BOD (duyệt bước 2)' },
          ]}
          value={role}
          onChange={(r2) => (setRole(r2), setTab(r2 === 'GĐK' ? 'gdk' : 'bod'))}
        />
      </div>
      <FolderTabs
        tabs={[
          { key: 'gdk', label: 'GĐK lập mục tiêu', icon: PenLine },
          { key: 'bod', label: `Phê duyệt${waiting ? ` (${waiting})` : ''}`, icon: ClipboardCheck },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === 'gdk' ? <GdkTab flash={flash} role={role} /> : <BodTab flash={flash} role={role} />}
    </ErpPage>
  );
};
