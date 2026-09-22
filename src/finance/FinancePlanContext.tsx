/**
 * FinancePlanContext — dữ liệu dùng chung cho "Kế hoạch dòng tiền của khối".
 *
 * Giám đốc khối lên KẾ HOẠCH THU – CHI cho từng dự án mình phụ trách (1 năm):
 *   • Mỗi dự án là một khối khai báo gồm 2 dòng:
 *       – Thu dự kiến từng tháng  (revenue[12])
 *       – Chi dự kiến từng tháng  (expense[12])
 *   • Chênh lệch thu - chi của từng dự án và của cả khối được tự tính.
 * Khai báo theo dự án (không theo khách hàng, không theo nhóm chi phí).
 *
 * Số "Thu dự kiến" theo dự án được màn "Cập nhật tài chính dự án" đọc lại
 * để hiển thị dòng "Doanh thu kế hoạch (PAKD)".
 *
 * Đơn vị: triệu VNĐ.
 */
import React, { createContext, useContext, useMemo, useState } from 'react';

export const MONTHS12 = Array.from({ length: 12 }, (_, i) => i + 1);
export const zero12 = () => MONTHS12.map(() => 0);
export const fill12 = (v: number) => MONTHS12.map(() => v);
export const sum12 = (a: number[]) => a.reduce((s, x) => s + (x || 0), 0);

export interface PlanHistory {
  at: string;
  by: string;
  action: string;
  note?: string;
}

/** Một dự án trong kế hoạch của khối — gồm các dòng dự kiến theo tháng. */
export interface ProjectPlan {
  projectCode: string;
  projectName: string;
  workload?: number; // Khối lượng công việc (KLCV) — tổng năm (= tổng workloadMonthly)
  plannedRevenue?: number[]; // Doanh thu dự kiến (nghiệm thu) 12 tháng
  revenue: number[]; // Thu dự kiến (dòng tiền thu) 12 tháng
  expense: number[]; // Chi dự kiến 12 tháng
  workloadMonthly?: number[]; // Khối lượng công việc theo từng tháng
}

export interface BlockPlan {
  id: string;
  khoi: string;
  year: number;
  createdBy: string;
  updatedAt: string;
  projects: ProjectPlan[]; // Danh sách dự án phụ trách
  history: PlanHistory[];
}

export interface EditRequest {
  id: string;
  khoi: string;
  projectCode: string;
  requestedBy: string;
  reason: string;
  status: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
  at: string;
}

interface Ctx {
  blocks: BlockPlan[];
  editRequests: EditRequest[];
  getBlock: (khoi: string, year: number) => BlockPlan | undefined;
  /** Tạo mới hoặc ghi đè kế hoạch của (khoi, year). */
  saveBlock: (khoi: string, year: number, data: { projects: ProjectPlan[] }, by: string, note?: string) => void;
  /** Mảng 12 tháng thu dự kiến theo mã dự án + năm (nếu có). */
  getPlanMonthly: (projectCode: string, year: number) => number[] | undefined;
  /** Mảng 12 tháng khối lượng công việc (%) theo mã dự án + năm (nếu có). */
  getWorkloadMonthly: (projectCode: string, year: number) => number[] | undefined;
}

const FinancePlanContext = createContext<Ctx | null>(null);
const now = () => new Date().toISOString().replace('T', ' ').substring(0, 16);

/** Tạo 1 dự án: thu = revBase/tháng, chi = expBase/tháng, bỏ qua các tháng trong `skip`. */
const proj = (
  projectCode: string,
  projectName: string,
  revBase: number,
  expBase: number,
  _workload = 0,
  skip: number[] = [],
): ProjectPlan => {
  // Khối lượng công việc tính theo %: rải đều 100% cho các tháng có triển khai,
  // phần dư dồn vào các tháng đầu để tổng năm đúng 100%.
  const activeMonths = MONTHS12.filter((m) => !skip.includes(m));
  const per = activeMonths.length ? Math.floor(100 / activeMonths.length) : 0;
  let rem = 100 - per * activeMonths.length;
  const workloadMonthly = MONTHS12.map((m) => {
    if (skip.includes(m)) return 0;
    let v = per;
    if (rem > 0) { v += 1; rem -= 1; }
    return v;
  });
  return {
    projectCode,
    projectName,
    workload: 100,
    // Doanh thu dự kiến (nghiệm thu) — mặc định bằng thu dự kiến để giữ liên kết PAKD.
    plannedRevenue: MONTHS12.map((m) => (skip.includes(m) ? 0 : revBase)),
    revenue: MONTHS12.map((m) => (skip.includes(m) ? 0 : revBase)),
    expense: MONTHS12.map((m) => (skip.includes(m) ? 0 : expBase)),
    workloadMonthly, // %
  };
};

const seedBlock = (khoi: string, projects: ProjectPlan[], by: string): BlockPlan => ({
  id: `KH-${khoi}-2026`,
  khoi,
  year: 2026,
  createdBy: by,
  updatedAt: now(),
  projects,
  history: [{ at: now(), by, action: 'Tạo mới', note: 'Khai báo kế hoạch thu - chi năm 2026' }],
});

const INITIAL_BLOCKS: BlockPlan[] = [
  seedBlock(
    'G1',
    [
      proj('022.060.2', '022.GSDT (26-28)', 800, 470, 120),
      proj('100.000.2', 'Dự án nội bộ G1', 100, 70, 30),
    ],
    'Trần B (GĐ Khối G1)',
  ),
  seedBlock(
    'G2',
    [
      proj('012.003.2', 'Quản lý văn bản G2', 700, 405, 90),
      proj('005.008.2', 'Cổng dịch vụ công G2', 500, 300, 70),
    ],
    'Đỗ F (GĐ Khối G2)',
  ),
  seedBlock(
    'G3',
    [
      proj('038.360.2', 'Điều phối', 150, 95, 24),
      proj('023.011.5', 'Hệ thống CSKH Viettel', 400, 240, 60, [3]),
      proj('024.002.1', 'Cổng thanh toán MobiFone', 600, 360, 80, [1, 11, 12]),
    ],
    'Trần B (GĐ Khối G3)',
  ),
  seedBlock(
    'G4',
    [
      proj('002.941.2', 'Hệ thống lõi G4', 450, 270, 55),
      proj('994.994.2', 'Tích hợp dữ liệu G4', 300, 185, 40, [6]),
    ],
    'Ngô G (GĐ Khối G4)',
  ),
  seedBlock(
    'Giải pháp - Dịch vụ',
    [proj('V.25.S.FX.DRA.12', 'Tripeo AI Travel Buddy', 300, 190, 45)],
    'Lê C (GĐ Khối GPDV)',
  ),
  seedBlock(
    'BFSI',
    [proj('010.540.2', 'Hợp đồng cho thuê lại lao động', 200, 130, 36)],
    'Vũ E (GĐ Khối BFSI)',
  ),
];

const INITIAL_REQUESTS: EditRequest[] = [
  { id: 'YCS-01', khoi: 'G3', projectCode: '023.011.5', requestedBy: 'Trần B (GĐ Khối G3)', reason: 'Điều chỉnh tăng doanh thu Q4 do ký thêm phụ lục hợp đồng.', status: 'Chờ duyệt', at: now() },
  { id: 'YCS-02', khoi: 'G3', projectCode: '024.002.1', requestedBy: 'Trần B (GĐ Khối G3)', reason: 'Dời mốc nghiệm thu T1 sang T2 theo yêu cầu khách hàng.', status: 'Chờ duyệt', at: now() },
];

export const FinancePlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blocks, setBlocks] = useState<BlockPlan[]>(INITIAL_BLOCKS);
  const [editRequests] = useState<EditRequest[]>(INITIAL_REQUESTS);

  const getBlock: Ctx['getBlock'] = (khoi, year) => blocks.find((b) => b.khoi === khoi && b.year === year);

  const saveBlock: Ctx['saveBlock'] = (khoi, year, data, by, note) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.khoi === khoi && b.year === year);
      if (idx === -1) {
        const nb: BlockPlan = {
          id: `KH-${khoi}-${year}-${Math.floor(100 + Math.random() * 900)}`,
          khoi,
          year,
          createdBy: by,
          updatedAt: now(),
          projects: data.projects,
          history: [{ at: now(), by, action: 'Tạo mới', note }],
        };
        return [nb, ...prev];
      }
      return prev.map((b, i) =>
        i === idx
          ? { ...b, projects: data.projects, updatedAt: now(), history: [{ at: now(), by, action: 'Cập nhật', note }, ...b.history] }
          : b,
      );
    });
  };

  const getPlanMonthly: Ctx['getPlanMonthly'] = (projectCode, year) => {
    for (const b of blocks) {
      if (b.year !== year) continue;
      const p = b.projects.find((x) => x.projectCode === projectCode);
      // "Doanh thu kế hoạch (PAKD)" = doanh thu dự kiến; fallback về thu dự kiến.
      if (p) return p.plannedRevenue ?? p.revenue;
    }
    return undefined;
  };

  const getWorkloadMonthly: Ctx['getWorkloadMonthly'] = (projectCode, year) => {
    for (const b of blocks) {
      if (b.year !== year) continue;
      const p = b.projects.find((x) => x.projectCode === projectCode);
      if (p) return p.workloadMonthly;
    }
    return undefined;
  };

  const value = useMemo(
    () => ({ blocks, editRequests, getBlock, saveBlock, getPlanMonthly, getWorkloadMonthly }),
    [blocks, editRequests],
  );

  return <FinancePlanContext.Provider value={value}>{children}</FinancePlanContext.Provider>;
};

export const useFinancePlans = () => {
  const ctx = useContext(FinancePlanContext);
  if (!ctx) throw new Error('useFinancePlans must be used within FinancePlanProvider');
  return ctx;
};
