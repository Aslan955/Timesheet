/**
 * PayrollContext — bảng lương theo kỳ, nhiều phiên bản (import Excel), duyệt theo 7 khối.
 *
 * Luồng:
 *   HR import bảng lương từ Excel → sinh phiên bản mới (v1, v2, …), không ghi đè bản cũ.
 *   HR "Gửi duyệt" → mỗi khối "Chưa gửi" chuyển "Chờ duyệt", Giám đốc khối nhận email (mô phỏng).
 *   Giám đốc khối vào màn "Duyệt bảng lương khối" → Duyệt / Từ chối (bắt buộc lý do, đánh dấu nhân sự có vấn đề).
 *   Import lại sau khi bị từ chối: chỉ khối bị từ chối hoặc có thay đổi số liệu phải duyệt lại;
 *   khối đã duyệt mà số liệu không đổi giữ nguyên "Đã duyệt".
 *   Đủ 7 khối duyệt → HR khoá kỳ lương (mới gửi phiếu lương cho nhân viên).
 *
 * Khi hệ thống tự tính lương được: tạo phiên bản với nguồn "Hệ thống tính", các màn giữ nguyên.
 */
import React, { createContext, useContext, useState } from 'react';

export const KHOIS = ['G1', 'G2', 'G3', 'G4', 'BFSI', 'GPDV', 'HCARE'] as const;
export type Khoi = (typeof KHOIS)[number];
export const KHOI_NAME: Record<Khoi, string> = {
  G1: 'Khối G1',
  G2: 'Khối G2',
  G3: 'Khối G3',
  G4: 'Khối G4',
  BFSI: 'Khối BFSI',
  GPDV: 'Giải pháp - Dịch vụ',
  HCARE: 'Health Care',
};
/** Giám đốc khối nhận email duyệt (dữ liệu mẫu). */
export const KHOI_DIRECTOR: Record<Khoi, { name: string; email: string }> = {
  G1: { name: 'Nguyễn Thịnh Trịnh', email: 'gdk.g1@congty.vn' },
  G2: { name: 'Ngô Thị Thanh Phương', email: 'gdk.g2@congty.vn' },
  G3: { name: 'Phạm Lê Vũ', email: 'gdk.g3@congty.vn' },
  G4: { name: 'Vũ Minh Đức', email: 'gdk.g4@congty.vn' },
  BFSI: { name: 'Lê Việt Hà', email: 'gdk.bfsi@congty.vn' },
  GPDV: { name: 'Bùi Huỳnh Nhật Hiếu', email: 'gdk.gpdv@congty.vn' },
  HCARE: { name: 'Ngô Đình Phong', email: 'gdk.hcare@congty.vn' },
};
/** Số ngày giám đốc khối có để duyệt kể từ khi gửi. */
export const APPROVE_DAYS = 3;
/** Ngưỡng cảnh báo thay đổi thu nhập so với kỳ trước. */
export const CHANGE_ALERT = 0.1;

export interface PayRow {
  code: string;
  name: string;
  khoi: Khoi;
  department: string;
  title: string;
  workDays: number;
  basic: number; // lương cơ bản (hợp đồng)
  allowance: number;
  ot: number;
  bonus: number;
  gross: number; // tổng thu nhập
  insEmp: number; // BH người lao động
  tax: number;
  otherDeduct: number;
  net: number; // thực nhận
  insCompany: number; // BH doanh nghiệp đóng
  cost: number; // chi phí công ty = gross + insCompany
}
export type PaySource = 'Import Excel' | 'Hệ thống tính';
export interface PayVersion {
  no: number;
  source: PaySource;
  fileName?: string;
  by: string;
  at: string; // ISO
  rows: PayRow[];
  note?: string;
}
export type BlockStatus = 'Chưa gửi' | 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
export interface BlockApproval {
  status: BlockStatus;
  /** Phiên bản mà trạng thái đang áp dụng. */
  version: number;
  sentAt?: string;
  deadline?: string;
  decidedAt?: string;
  decidedBy?: string;
  reason?: string;
  /** Mã NV bị giám đốc khối đánh dấu có vấn đề khi từ chối. */
  flagged?: string[];
  /** Ghi chú cho HR (vd "Số liệu thay đổi ở v3 — cần duyệt lại"). */
  note?: string;
}
export interface PayLog {
  at: string;
  by: string;
  action: string;
  khoi?: Khoi;
  version?: number;
  note?: string;
}
export interface PayPeriod {
  id: string;
  year: number;
  month: number;
  versions: PayVersion[];
  blocks: Record<Khoi, BlockApproval>;
  locked?: { at: string; by: string };
  history: PayLog[];
}

export type PeriodStatus = 'Chưa có bảng lương' | 'Nháp' | 'Đang duyệt' | 'Có khối từ chối' | 'Đã duyệt' | 'Đã khoá';

// ==========================================================================
// Tính toán
// ==========================================================================
export const latestVersion = (p: PayPeriod) => p.versions[p.versions.length - 1] as PayVersion | undefined;
export const rowsOf = (v: PayVersion | undefined, k?: Khoi) => (v ? (k ? v.rows.filter((r) => r.khoi === k) : v.rows) : []);
export const sumRows = (rows: PayRow[]) =>
  rows.reduce(
    (t, r) => ({ count: t.count + 1, gross: t.gross + r.gross, net: t.net + r.net, cost: t.cost + r.cost, insCompany: t.insCompany + r.insCompany, tax: t.tax + r.tax, insEmp: t.insEmp + r.insEmp }),
    { count: 0, gross: 0, net: 0, cost: 0, insCompany: 0, tax: 0, insEmp: 0 },
  );
/** Dấu vân tay số liệu của 1 khối — để biết import mới có làm thay đổi khối đó không. */
export const blockHash = (rows: PayRow[]) =>
  JSON.stringify(
    [...rows]
      .sort((a, b) => a.code.localeCompare(b.code))
      .map((r) => [r.code, r.workDays, r.basic, r.allowance, r.ot, r.bonus, r.gross, r.insEmp, r.tax, r.otherDeduct, r.net, r.insCompany, r.cost]),
  );

export const periodStatus = (p: PayPeriod): PeriodStatus => {
  if (p.locked) return 'Đã khoá';
  if (!p.versions.length) return 'Chưa có bảng lương';
  const st = KHOIS.map((k) => p.blocks[k].status);
  if (st.every((s) => s === 'Đã duyệt')) return 'Đã duyệt';
  if (st.includes('Từ chối')) return 'Có khối từ chối';
  if (st.includes('Chờ duyệt') || st.includes('Đã duyệt')) return 'Đang duyệt';
  return 'Nháp';
};
export const periodLabel = (p: Pick<PayPeriod, 'year' | 'month'>) => `${String(p.month).padStart(2, '0')}/${p.year}`;
export const prevPeriodOf = (periods: PayPeriod[], p: PayPeriod) => {
  const y = p.month === 1 ? p.year - 1 : p.year;
  const m = p.month === 1 ? 12 : p.month - 1;
  return periods.find((x) => x.year === y && x.month === m);
};

/** Tính lại các cột tự động của 1 dòng (khi file để trống). */
export const completeRow = (r: Omit<PayRow, 'gross' | 'net' | 'cost'> & Partial<Pick<PayRow, 'gross' | 'net' | 'cost'>>): PayRow => {
  const gross = r.gross || Math.round((r.basic * r.workDays) / 22) + r.allowance + r.ot + r.bonus;
  const net = r.net || gross - r.insEmp - r.tax - r.otherDeduct;
  const cost = r.cost || gross + r.insCompany;
  return { ...r, gross, net, cost };
};

// ==========================================================================
// Dữ liệu mẫu
// ==========================================================================
const DEPTS: Record<Khoi, string[]> = {
  G1: ['G1 - SẢN XUẤT', 'G1 - SALES'],
  G2: ['G2 - SẢN XUẤT', 'G2 - SALES'],
  G3: ['G3 - SẢN XUẤT', 'G3 - SALES'],
  G4: ['G4 - SẢN XUẤT', 'G4 - SALES'],
  BFSI: ['BFSI - SẢN XUẤT', 'Staffing', 'BFSI - SALES'],
  GPDV: ['GPDV - SẢN XUẤT', 'GPDV - SALES'],
  HCARE: ['HCARE - SẢN XUẤT', 'HCARE - SALES'],
};
const TITLES: [string, number][] = [
  ['Trưởng nhóm', 32_000_000],
  ['Dev', 22_000_000],
  ['Dev', 19_000_000],
  ['Tester', 15_000_000],
  ['QC', 14_000_000],
  ['BA', 20_000_000],
  ['Account Manager', 18_000_000],
  ['Dev', 16_000_000],
  ['Tester', 12_500_000],
  ['Thực tập sinh', 6_000_000],
];
const LAST = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đỗ', 'Bùi', 'Ngô', 'Đặng', 'Hà', 'Phan', 'Trịnh', 'Lý'];
const MID = ['Văn', 'Thị', 'Minh', 'Đức', 'Thu', 'Thanh', 'Quốc', 'Ngọc', 'Hữu', 'Hoài'];
const FIRST = ['Giang', 'Mến', 'Khánh', 'Tùng', 'Phong', 'Thảo', 'Vân', 'Hưng', 'Anh', 'Hà', 'Linh', 'Tuấn', 'Nga', 'Hiếu', 'Trúc', 'Lan', 'Kiên', 'Dũng', 'Hạnh', 'Phương', 'Sơn', 'Yến', 'Bảo', 'Châu'];

let seed = 7;
const rnd = () => ((seed = (seed * 9301 + 49297) % 233280), seed / 233280);
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];

const calcRow = (base: Omit<PayRow, 'workDays' | 'allowance' | 'ot' | 'bonus' | 'gross' | 'insEmp' | 'tax' | 'otherDeduct' | 'net' | 'insCompany' | 'cost'>, month: number): PayRow => {
  const workDays = 22 - Math.floor(rnd() * 3);
  const allowance = 1_000_000 + Math.floor(rnd() * 4) * 500_000;
  const ot = Math.floor(rnd() * 4) * 750_000;
  const bonus = month === 9 && rnd() > 0.8 ? 2_000_000 : 0;
  const gross = Math.round((base.basic * workDays) / 22) + allowance + ot + bonus;
  const insEmp = Math.round(base.basic * 0.105);
  const taxable = gross - insEmp - 11_000_000;
  const tax = taxable <= 0 ? 0 : taxable <= 5_000_000 ? Math.round(taxable * 0.05) : Math.round(250_000 + (taxable - 5_000_000) * 0.1);
  const otherDeduct = rnd() > 0.85 ? 200_000 : 0;
  const insCompany = Math.round(base.basic * 0.215);
  return { ...base, workDays, allowance, ot, bonus, gross, insEmp, tax, otherDeduct, net: gross - insEmp - tax - otherDeduct, insCompany, cost: gross + insCompany };
};

const buildRoster = () => {
  const out: Omit<PayRow, 'workDays' | 'allowance' | 'ot' | 'bonus' | 'gross' | 'insEmp' | 'tax' | 'otherDeduct' | 'net' | 'insCompany' | 'cost'>[] = [];
  let code = 101;
  KHOIS.forEach((k, ki) => {
    const n = 8 + ((ki * 3) % 5);
    for (let i = 0; i < n; i++) {
      const [title, basic] = i === 0 ? TITLES[0] : pick(TITLES.slice(1));
      out.push({
        code: `V${String(code++ * 3).padStart(5, '0')}`,
        name: `${pick(LAST)} ${pick(MID)} ${pick(FIRST)}`,
        khoi: k,
        department: DEPTS[k][i === 0 ? 0 : i % 4 === 3 ? DEPTS[k].length - 1 : i % 3 === 1 && DEPTS[k].length > 2 ? 1 : 0],
        title,
        basic: Math.round((basic * (0.92 + rnd() * 0.16)) / 100_000) * 100_000,
      });
    }
  });
  return out;
};

const ROSTER = buildRoster();
const AUG = ROSTER.map((r) => calcRow(r, 8));
// Kỳ 09/2026: 1 người nghỉ (G2), 2 người mới (G4, HCARE), 2 người tăng lương (G3, BFSI)
const SEP = (() => {
  const leaver = ROSTER.find((r) => r.khoi === 'G2' && r.title !== 'Trưởng nhóm')!.code;
  const base = ROSTER.filter((r) => r.code !== leaver).map((r) => {
    const raise = (r.khoi === 'G3' || r.khoi === 'BFSI') && r.title === 'Dev' ? 1.15 : 1;
    return { ...r, basic: Math.round((r.basic * raise) / 100_000) * 100_000 };
  });
  base.push(
    { code: 'V01120', name: 'Trần Thị Vân', khoi: 'G4', department: 'G4 - SẢN XUẤT', title: 'Tester', basic: 13_000_000 },
    { code: 'V01121', name: 'Lê Quốc Bảo', khoi: 'HCARE', department: 'HCARE - SẢN XUẤT', title: 'Dev', basic: 18_500_000 },
  );
  return base.map((r) => calcRow(r, 9));
})();

const iso = (d: string) => new Date(d).toISOString();
const addDays = (isoStr: string, n: number) => new Date(new Date(isoStr).getTime() + n * 86_400_000).toISOString();
const blocksAll = (status: BlockStatus, version: number, extra: Partial<BlockApproval> = {}) =>
  KHOIS.reduce((acc, k) => ((acc[k] = { status, version, ...extra }), acc), {} as Record<Khoi, BlockApproval>);

const SEED: PayPeriod[] = [
  {
    id: 'PR-2026-08',
    year: 2026,
    month: 8,
    versions: [{ no: 1, source: 'Import Excel', fileName: 'BangLuong_T08_2026.xlsx', by: 'HR - Lý Trịnh Hương', at: iso('2026-08-27T09:12:00'), rows: AUG }],
    blocks: blocksAll('Đã duyệt', 1, { sentAt: iso('2026-08-27T10:00:00'), deadline: iso('2026-08-30T10:00:00'), decidedAt: iso('2026-08-29T15:30:00') }),
    locked: { at: iso('2026-09-01T08:30:00'), by: 'HR - Lý Trịnh Hương' },
    history: [
      { at: iso('2026-08-27T09:12:00'), by: 'HR - Lý Trịnh Hương', action: 'Import bảng lương v1', version: 1, note: 'BangLuong_T08_2026.xlsx' },
      { at: iso('2026-08-27T10:00:00'), by: 'HR - Lý Trịnh Hương', action: 'Gửi duyệt 7 khối', version: 1 },
      { at: iso('2026-09-01T08:30:00'), by: 'HR - Lý Trịnh Hương', action: 'Khoá kỳ lương' },
    ],
  },
  {
    id: 'PR-2026-09',
    year: 2026,
    month: 9,
    versions: [{ no: 1, source: 'Import Excel', fileName: 'BangLuong_T09_2026.xlsx', by: 'HR - Lý Trịnh Hương', at: iso('2026-09-30T09:05:00'), rows: SEP }],
    blocks: {
      ...blocksAll('Chờ duyệt', 1, { sentAt: iso('2026-10-01T10:00:00'), deadline: addDays(iso('2026-10-01T10:00:00'), APPROVE_DAYS) }),
      G1: { status: 'Đã duyệt', version: 1, sentAt: iso('2026-10-01T10:00:00'), decidedAt: iso('2026-10-01T15:40:00'), decidedBy: KHOI_DIRECTOR.G1.name },
      G2: { status: 'Đã duyệt', version: 1, sentAt: iso('2026-10-01T10:00:00'), decidedAt: iso('2026-10-02T08:10:00'), decidedBy: KHOI_DIRECTOR.G2.name },
      G3: {
        status: 'Từ chối',
        version: 1,
        sentAt: iso('2026-10-01T10:00:00'),
        decidedAt: iso('2026-10-02T09:20:00'),
        decidedBy: KHOI_DIRECTOR.G3.name,
        reason: 'Thiếu phụ cấp onsite tháng 9 cho nhân sự được đánh dấu, đề nghị HR bổ sung.',
        flagged: SEP.filter((r) => r.khoi === 'G3').slice(1, 3).map((r) => r.code),
      },
      GPDV: { status: 'Đã duyệt', version: 1, sentAt: iso('2026-10-01T10:00:00'), decidedAt: iso('2026-10-02T16:00:00'), decidedBy: KHOI_DIRECTOR.GPDV.name },
    },
    history: [
      { at: iso('2026-09-30T09:05:00'), by: 'HR - Lý Trịnh Hương', action: 'Import bảng lương v1', version: 1, note: 'BangLuong_T09_2026.xlsx' },
      { at: iso('2026-10-01T10:00:00'), by: 'HR - Lý Trịnh Hương', action: 'Gửi duyệt 7 khối', version: 1, note: 'Đã gửi email tới 7 giám đốc khối' },
      { at: iso('2026-10-01T15:40:00'), by: KHOI_DIRECTOR.G1.name, action: 'Duyệt', khoi: 'G1', version: 1 },
      { at: iso('2026-10-02T08:10:00'), by: KHOI_DIRECTOR.G2.name, action: 'Duyệt', khoi: 'G2', version: 1 },
      { at: iso('2026-10-02T09:20:00'), by: KHOI_DIRECTOR.G3.name, action: 'Từ chối', khoi: 'G3', version: 1, note: 'Thiếu phụ cấp onsite tháng 9 cho nhân sự được đánh dấu, đề nghị HR bổ sung.' },
      { at: iso('2026-10-02T16:00:00'), by: KHOI_DIRECTOR.GPDV.name, action: 'Duyệt', khoi: 'GPDV', version: 1 },
    ],
  },
  {
    id: 'PR-2026-10',
    year: 2026,
    month: 10,
    versions: [],
    blocks: blocksAll('Chưa gửi', 0),
    history: [],
  },
];

// ==========================================================================
// Context
// ==========================================================================
export interface SentMail {
  khoi: Khoi;
  to: string;
  name: string;
  subject: string;
  count: number;
  cost: number;
  deadline: string;
  version: number;
}
/** Kết quả so sánh 1 khối giữa phiên bản đang dùng và dữ liệu import mới. */
export interface BlockImpact {
  khoi: Khoi;
  changed: boolean;
  before: BlockStatus;
  after: BlockStatus;
}

export const impactOf = (p: PayPeriod, rows: PayRow[]): BlockImpact[] => {
  const cur = latestVersion(p);
  return KHOIS.map((k) => {
    const b = p.blocks[k];
    const changed = blockHash(rowsOf(cur, k)) !== blockHash(rows.filter((r) => r.khoi === k));
    const after: BlockStatus = !cur ? 'Chưa gửi' : b.status === 'Đã duyệt' && !changed ? 'Đã duyệt' : b.status === 'Chờ duyệt' && !changed ? 'Chờ duyệt' : 'Chưa gửi';
    return { khoi: k, changed, before: cur ? b.status : 'Chưa gửi', after };
  });
};

interface Ctx {
  periods: PayPeriod[];
  importVersion: (periodId: string, rows: PayRow[], fileName: string, by: string, source?: PaySource) => number;
  sendForApproval: (periodId: string, by: string) => SentMail[];
  decide: (periodId: string, khoi: Khoi, approve: boolean, by: string, reason?: string, flagged?: string[]) => void;
  lockPeriod: (periodId: string, by: string) => void;
  createPeriod: (year: number, month: number) => string;
  /** Mở màn duyệt từ email: kỳ + khối cần focus. */
  focus: { periodId: string; khoi?: Khoi } | null;
  setFocus: (f: { periodId: string; khoi?: Khoi } | null) => void;
}
const PayrollCtx = createContext<Ctx | null>(null);
const now = () => new Date().toISOString();

export const PayrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [periods, setPeriods] = useState<PayPeriod[]>(SEED);
  const [focus, setFocus] = useState<{ periodId: string; khoi?: Khoi } | null>(null);
  const patch = (id: string, fn: (p: PayPeriod) => PayPeriod) => setPeriods((prev) => prev.map((p) => (p.id === id ? fn(p) : p)));

  const importVersion: Ctx['importVersion'] = (periodId, rows, fileName, by, source = 'Import Excel') => {
    const p = periods.find((x) => x.id === periodId)!;
    const no = p.versions.length + 1;
    const impacts = impactOf(p, rows);
    patch(periodId, (x) => ({
      ...x,
      versions: [...x.versions, { no, source, fileName, by, at: now(), rows }],
      blocks: KHOIS.reduce((acc, k) => {
        const imp = impacts.find((i) => i.khoi === k)!;
        const old = x.blocks[k];
        acc[k] =
          imp.after === old.status && x.versions.length
            ? { ...old, version: no, note: undefined }
            : {
                status: 'Chưa gửi',
                version: no,
                note: x.versions.length ? (old.status === 'Từ chối' ? `Bị từ chối ở v${old.version} — gửi lại bản v${no}` : imp.changed ? `Số liệu thay đổi ở v${no} — cần duyệt lại` : undefined) : undefined,
                reason: old.status === 'Từ chối' ? old.reason : undefined,
                flagged: old.status === 'Từ chối' ? old.flagged : undefined,
              };
        return acc;
      }, {} as Record<Khoi, BlockApproval>),
      history: [
        ...x.history,
        {
          at: now(),
          by,
          action: `Import bảng lương v${no}`,
          version: no,
          note: [fileName, x.versions.length ? `Khối cần duyệt lại: ${impacts.filter((i) => i.after === 'Chưa gửi').map((i) => i.khoi).join(', ') || 'không có'}` : ''].filter(Boolean).join(' · '),
        },
      ],
    }));
    return no;
  };

  const sendForApproval: Ctx['sendForApproval'] = (periodId, by) => {
    const p = periods.find((x) => x.id === periodId)!;
    const v = latestVersion(p);
    if (!v) return [];
    const at = now();
    const deadline = addDays(at, APPROVE_DAYS);
    const targets = KHOIS.filter((k) => p.blocks[k].status === 'Chưa gửi');
    const mails: SentMail[] = targets.map((k) => {
      const t = sumRows(rowsOf(v, k));
      return {
        khoi: k,
        to: KHOI_DIRECTOR[k].email,
        name: KHOI_DIRECTOR[k].name,
        subject: `[Bảng lương ${periodLabel(p)}] Đề nghị duyệt bảng lương ${KHOI_NAME[k]} (v${v.no})`,
        count: t.count,
        cost: t.cost,
        deadline,
        version: v.no,
      };
    });
    patch(periodId, (x) => ({
      ...x,
      blocks: KHOIS.reduce((acc, k) => {
        acc[k] = targets.includes(k) ? { ...x.blocks[k], status: 'Chờ duyệt', sentAt: at, deadline, decidedAt: undefined, decidedBy: undefined } : x.blocks[k];
        return acc;
      }, {} as Record<Khoi, BlockApproval>),
      history: [...x.history, { at, by, action: `Gửi duyệt ${targets.length} khối`, version: v.no, note: `Email tới: ${targets.map((k) => `${KHOI_DIRECTOR[k].name} (${k})`).join(', ')}` }],
    }));
    return mails;
  };

  const decide: Ctx['decide'] = (periodId, khoi, approve, by, reason, flagged) =>
    patch(periodId, (x) => ({
      ...x,
      blocks: {
        ...x.blocks,
        [khoi]: {
          ...x.blocks[khoi],
          status: approve ? 'Đã duyệt' : 'Từ chối',
          decidedAt: now(),
          decidedBy: by,
          reason: approve ? undefined : reason,
          flagged: approve ? undefined : flagged,
          note: undefined,
        },
      },
      history: [...x.history, { at: now(), by, action: approve ? 'Duyệt' : 'Từ chối', khoi, version: x.blocks[khoi].version, note: reason || undefined }],
    }));

  const lockPeriod: Ctx['lockPeriod'] = (periodId, by) =>
    patch(periodId, (x) => ({ ...x, locked: { at: now(), by }, history: [...x.history, { at: now(), by, action: 'Khoá kỳ lương' }] }));

  const createPeriod: Ctx['createPeriod'] = (year, month) => {
    const id = `PR-${year}-${String(month).padStart(2, '0')}`;
    if (!periods.some((p) => p.id === id)) setPeriods((prev) => [...prev, { id, year, month, versions: [], blocks: blocksAll('Chưa gửi', 0), history: [] }]);
    return id;
  };

  return <PayrollCtx.Provider value={{ periods, importVersion, sendForApproval, decide, lockPeriod, createPeriod, focus, setFocus }}>{children}</PayrollCtx.Provider>;
};

export const usePayroll = () => {
  const c = useContext(PayrollCtx);
  if (!c) throw new Error('PayrollProvider missing');
  return c;
};
