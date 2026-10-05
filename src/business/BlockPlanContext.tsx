/**
 * BlockPlanContext — "Lập kế hoạch khối".
 *
 * Giám đốc khối (GĐK) lập kế hoạch theo tháng cho TẤT CẢ dự án của khối mình trong 1 năm:
 *   Doanh thu dự kiến · Chi dự kiến · Dòng tiền thu · Khối lượng công việc (SP).
 * Mỗi hồ sơ = 1 năm × 1 khối.
 *
 * Luồng:  Nháp ──(Gửi duyệt)──► Chờ duyệt ──(Kế toán duyệt)──► Đã duyệt → ghi vào project.plan
 *                                   └──(Trả lại, có lý do)──► Trả lại → GĐK sửa, gửi lại
 *          Đã duyệt ──(Điều chỉnh)──► Nháp (phiên bản mới)
 * Số liệu chỉ đổ vào kế hoạch dự án (BusinessProjectContext.plan) khi Kế toán duyệt, nên các màn
 * Báo cáo hiệu quả / Tổng quan luôn đọc số đã duyệt.
 *
 * ĐVT: VNĐ (KLCV: SP).
 */
import React, { createContext, useContext, useState } from 'react';
import { BizHistory, BizMonthRow, BizProject, monthsBetween, useBusinessProjects } from './BusinessProjectContext';

export type BlockPlanStatus = 'Nháp' | 'Chờ duyệt' | 'Đã duyệt' | 'Trả lại';
/** Ô số liệu của hồ sơ: dự án → tháng (YYYY-MM) → số liệu tháng. */
export type PlanCells = Record<string, Record<string, BizMonthRow>>;

export interface BlockPlanDoc {
  year: string;
  division: string;
  status: BlockPlanStatus;
  version: number;
  cells: PlanCells;
  updatedAt: string;
  updatedBy: string;
  submittedAt?: string;
  submittedBy?: string;
  decidedAt?: string;
  decidedBy?: string;
  /** Lý do trả lại / ghi chú duyệt gần nhất. */
  note?: string;
  history: BizHistory[];
}

export const emptyMonth = (month: string): BizMonthRow => ({ month, revenue: 0, cashIn: 0, costSx: 0, costKd: 0, workload: 0 });
export const yearMonths = (year: string) => Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`);
/** Các tháng trong năm mà dự án đang triển khai (được nhập). */
export const projectMonthsInYear = (p: Pick<BizProject, 'startDate' | 'endDate'>, year: string) =>
  monthsBetween(p.startDate, p.endDate).filter((m) => m.startsWith(year));

/** Dự án thuộc khối được lập kế hoạch: đã có mã dự án, chưa kết thúc. */
export const blockProjects = (projects: BizProject[], division: string) =>
  projects
    .filter((p) => p.division === division && !!p.masterCode && p.status !== 'Kết thúc')
    .sort((a, b) => a.masterCode.localeCompare(b.masterCode));

/** Ô số liệu khởi tạo từ kế hoạch hiện có của dự án (project.plan) cho các tháng trong năm. */
export const cellsFromProjects = (projects: BizProject[], year: string): PlanCells => {
  const out: PlanCells = {};
  projects.forEach((p) => {
    const byMonth = new Map(p.plan.map((r) => [r.month, r]));
    out[p.id] = {};
    yearMonths(year).forEach((m) => {
      const r = byMonth.get(m);
      out[p.id][m] = r ? { ...r } : emptyMonth(m);
    });
  });
  return out;
};

export const docKey = (year: string, division: string) => `${year}|${division}`;

interface Ctx {
  docs: Record<string, BlockPlanDoc>;
  getDoc: (year: string, division: string) => BlockPlanDoc | undefined;
  /** Lưu nháp. Hồ sơ đã duyệt → thành bản điều chỉnh (Nháp, phiên bản +1). */
  saveDraft: (year: string, division: string, cells: PlanCells, by: string) => void;
  /** Gửi Kế toán duyệt (lưu luôn số liệu hiện tại). */
  submit: (year: string, division: string, cells: PlanCells, by: string) => void;
  /** Kế toán duyệt → ghi vào kế hoạch dự án; hoặc trả lại kèm lý do. */
  decide: (year: string, division: string, approve: boolean, by: string, note: string) => void;
}

const BlockPlanContext = createContext<Ctx | null>(null);

const now = () => new Date().toISOString();

export const BlockPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { projects, savePlanMonths } = useBusinessProjects();

  // Hồ sơ mẫu: BFSI 2026 đang chờ Kế toán duyệt; G1 2026 đã duyệt (số liệu = kế hoạch hiện có của dự án).
  const [docs, setDocs] = useState<Record<string, BlockPlanDoc>>(() => {
    const mk = (year: string, division: string, status: BlockPlanStatus, at: string, by: string, extra: Partial<BlockPlanDoc> = {}): BlockPlanDoc => ({
      year,
      division,
      status,
      version: 1,
      cells: cellsFromProjects(blockProjects(projects, division), year),
      updatedAt: at,
      updatedBy: by,
      history: [{ at, by, action: 'Lưu nháp', note: 'Version 1' }],
      ...extra,
    });
    return {
      [docKey('2026', 'BFSI')]: mk('2026', 'BFSI', 'Chờ duyệt', '2026-09-28T09:30:00.000Z', 'Phan Anh Tuấn', {
        submittedAt: '2026-09-28T09:30:00.000Z',
        submittedBy: 'Phan Anh Tuấn',
        history: [
          { at: '2026-09-26T08:10:00.000Z', by: 'Phan Anh Tuấn', action: 'Lưu nháp', note: 'Version 1' },
          { at: '2026-09-28T09:30:00.000Z', by: 'Phan Anh Tuấn', action: 'Gửi Kế toán duyệt', note: 'Version 1' },
        ],
      }),
      [docKey('2026', 'G1')]: mk('2026', 'G1', 'Đã duyệt', '2026-01-08T10:00:00.000Z', 'Nguyễn Đằng Giang', {
        submittedAt: '2026-01-06T10:00:00.000Z',
        submittedBy: 'Nguyễn Đằng Giang',
        decidedAt: '2026-01-08T10:00:00.000Z',
        decidedBy: 'ketoan',
        history: [
          { at: '2026-01-05T08:00:00.000Z', by: 'Nguyễn Đằng Giang', action: 'Lưu nháp', note: 'Version 1' },
          { at: '2026-01-06T10:00:00.000Z', by: 'Nguyễn Đằng Giang', action: 'Gửi Kế toán duyệt', note: 'Version 1' },
          { at: '2026-01-08T10:00:00.000Z', by: 'ketoan', action: 'Duyệt kế hoạch', note: 'Version 1 · ghi vào kế hoạch dự án' },
        ],
      }),
    };
  });

  const getDoc = (year: string, division: string) => docs[docKey(year, division)];

  const upsert = (year: string, division: string, fn: (d: BlockPlanDoc) => BlockPlanDoc) =>
    setDocs((prev) => {
      const k = docKey(year, division);
      const cur: BlockPlanDoc =
        prev[k] || { year, division, status: 'Nháp', version: 1, cells: {}, updatedAt: '', updatedBy: '', history: [] };
      return { ...prev, [k]: fn(cur) };
    });

  const saveDraft = (year: string, division: string, cells: PlanCells, by: string) => {
    const at = now();
    upsert(year, division, (d) => {
      const adjust = d.status === 'Đã duyệt';
      const version = adjust ? d.version + 1 : d.version;
      return {
        ...d,
        status: 'Nháp',
        version,
        cells,
        updatedAt: at,
        updatedBy: by,
        note: adjust ? undefined : d.note,
        history: [...d.history, { at, by, action: adjust ? 'Điều chỉnh kế hoạch' : 'Lưu nháp', note: `Version ${version}` }],
      };
    });
  };

  const submit = (year: string, division: string, cells: PlanCells, by: string) => {
    const at = now();
    upsert(year, division, (d) => {
      const version = d.status === 'Đã duyệt' ? d.version + 1 : d.version;
      return {
        ...d,
        status: 'Chờ duyệt',
        version,
        cells,
        updatedAt: at,
        updatedBy: by,
        submittedAt: at,
        submittedBy: by,
        note: undefined,
        history: [...d.history, { at, by, action: 'Gửi Kế toán duyệt', note: `Version ${version}` }],
      };
    });
  };

  const decide = (year: string, division: string, approve: boolean, by: string, note: string) => {
    const at = now();
    const d = getDoc(year, division);
    if (!d) return;
    if (approve) {
      // Ghi các tháng trong năm vào kế hoạch dự án
      Object.entries(d.cells).forEach(([pid, byMonth]) => {
        const rows = Object.values(byMonth).filter((r) => r.month.startsWith(year));
        if (rows.length) savePlanMonths(pid, rows, by, `Kế hoạch khối ${division} năm ${year} · V${d.version}`);
      });
    }
    upsert(year, division, (cur) => ({
      ...cur,
      status: approve ? 'Đã duyệt' : 'Trả lại',
      decidedAt: at,
      decidedBy: by,
      note: note || undefined,
      updatedAt: at,
      updatedBy: by,
      history: [
        ...cur.history,
        { at, by, action: approve ? 'Duyệt kế hoạch' : 'Trả lại', note: approve ? `Version ${cur.version} · ghi vào kế hoạch dự án${note ? ` · ${note}` : ''}` : note },
      ],
    }));
  };

  return <BlockPlanContext.Provider value={{ docs, getDoc, saveDraft, submit, decide }}>{children}</BlockPlanContext.Provider>;
};

export const useBlockPlans = () => {
  const ctx = useContext(BlockPlanContext);
  if (!ctx) throw new Error('useBlockPlans must be used within BlockPlanProvider');
  return ctx;
};
