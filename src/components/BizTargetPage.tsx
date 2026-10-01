/**
 * BizTargetPage — "Mục tiêu kinh doanh" (module Quản trị dự án & Tài chính).
 *
 * 2 tab:
 *   1. GĐK lập mục tiêu — GĐK đăng ký mục tiêu theo khách hàng / dự án cho khối mình:
 *        Khối · Người lập · Năm kế hoạch · Trạng thái hồ sơ (Bản nháp — Phiên bản 01…)
 *        Tổng giá trị mục tiêu · LN gộp mục tiêu · % LN gộp
 *        Biểu đồ giá trị mục tiêu & LN gộp (theo khách hàng / theo thời gian ký HĐ)
 *        Chi tiết theo khách hàng · Bảng đăng ký (Ra thầu, Ký HĐ MM/YYYY, HĐ ký mới, LN gộp, %, Thuyết minh, Xoá)
 *        GĐK lập hồ sơ → BOD phê duyệt → Ghi nhận kế hoạch chính thức  [Lưu nháp] [Gửi BOD duyệt]
 *   2. BOD phê duyệt — danh sách hồ sơ; mở hồ sơ để xem (chỉ đọc), nhập ý kiến,
 *        [Quay lại danh sách] [Từ chối] (bắt buộc ý kiến) [Phê duyệt].
 *        Phê duyệt → ghi nhận mục tiêu chính thức của khối (dùng cho "Sổ theo dõi dự án").
 *
 * Kỳ lập: mở 01/12/N → 31/12/N để lập mục tiêu năm N+1, sau đó khoá.
 * Kỳ điều chỉnh: mở lại vào tháng cuối mỗi quý (3, 6, 9, 12) cho GĐK điều chỉnh, sau đó khoá.
 * Lưu lịch sử mọi lần lưu / gửi / duyệt / từ chối, kèm nội dung đã điều chỉnh.
 * ĐVT: triệu VNĐ.
 */
import React, { createContext, useContext, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, ClipboardCheck, History, Lock, LockOpen, PenLine, Plus, Save, Send, Target, X, XCircle } from 'lucide-react';
import { DIVISIONS, useBusinessProjects } from '../business/BusinessProjectContext';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, KpiBox, Panel, Segmented, Tag, erp } from './erp/Erp';

const CURRENT_USER = 'namnv';
const CRUMBS = ['Quản trị dự án & Tài chính', 'Mục tiêu kinh doanh'];

// ==========================================================================
// Dữ liệu
// ==========================================================================
export interface TargetRow {
  id: string;
  customer: string;
  project: string;
  tenderMonth: string; // YYYY-MM — ra thầu
  signMonth: string; // YYYY-MM — ký HĐ
  value: number; // HĐ ký mới (triệu VNĐ)
  grossProfit: number; // LN gộp mục tiêu (triệu VNĐ)
  basis: string; // cơ sở đăng ký / thuyết minh
}
export type TargetStatus = 'Bản nháp' | 'Chờ BOD duyệt' | 'Đã duyệt' | 'Từ chối';
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
  /** Bản đã gửi / đã duyệt gần nhất — để so sánh nội dung điều chỉnh. */
  lastSubmitted?: TargetRow[];
  bodNote?: string;
  history: TargetLog[];
}

const uid = () => Math.random().toString(36).slice(2, 9);
const now = () => new Date().toISOString();
const r = (customer: string, project: string, tender: string, sign: string, value: number, gp: number, basis = ''): TargetRow => ({
  id: uid(),
  customer,
  project,
  tenderMonth: tender,
  signMonth: sign,
  value,
  grossProfit: gp,
  basis,
});

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
    status: 'Chờ BOD duyệt',
    rows: [
      r('Bán lẻ 045', 'Mở rộng hệ thống bán lẻ', '2027-01', '2027-03', 30000, 6600, 'Khách hàng hiện hữu, đã có chủ trương'),
      r('Kho bạc 045', 'Chuyển đổi số kho bạc GĐ2', '2027-04', '2027-06', 24000, 4800, 'Nối tiếp GĐ1'),
      r('Sở Tài chính 045', 'Cổng dịch vụ tài chính', '2027-06', '2027-09', 18000, 4500),
    ],
    history: [
      { at: '2026-09-20T03:00:00.000Z', by: 'GĐK G2', action: 'Tạo hồ sơ', version: 1 },
      { at: '2026-09-28T09:30:00.000Z', by: 'GĐK G2', action: 'Gửi BOD duyệt', version: 1 },
    ],
  },
];
SEED[1].lastSubmitted = SEED[1].rows.map((x) => ({ ...x }));

interface Ctx {
  plans: TargetPlan[];
  savePlan: (p: TargetPlan, by: string, submit: boolean) => void;
  decide: (id: string, approve: boolean, note: string, by: string) => void;
}
const TargetCtx = createContext<Ctx | null>(null);

/** So sánh 2 bản đăng ký → danh sách nội dung đã điều chỉnh (để lưu lịch sử). */
const diffRows = (before: TargetRow[] = [], after: TargetRow[]): string[] => {
  const out: string[] = [];
  const b = new Map(before.map((x) => [x.id, x]));
  after.forEach((x) => {
    const o = b.get(x.id);
    if (!o) return out.push(`Thêm ${x.project || '(chưa đặt tên)'} — ${x.customer || '—'}: ${fmt(x.value)} tr`);
    const ch: string[] = [];
    if (o.customer !== x.customer) ch.push(`khách hàng ${o.customer} → ${x.customer}`);
    if (o.project !== x.project) ch.push(`tên ${o.project} → ${x.project}`);
    if (o.tenderMonth !== x.tenderMonth) ch.push(`ra thầu ${my(o.tenderMonth)} → ${my(x.tenderMonth)}`);
    if (o.signMonth !== x.signMonth) ch.push(`ký HĐ ${my(o.signMonth)} → ${my(x.signMonth)}`);
    if (o.value !== x.value) ch.push(`HĐ ký mới ${fmt(o.value)} → ${fmt(x.value)}`);
    if (o.grossProfit !== x.grossProfit) ch.push(`LN gộp ${fmt(o.grossProfit)} → ${fmt(x.grossProfit)}`);
    if (o.basis !== x.basis) ch.push('thuyết minh');
    if (ch.length) out.push(`Sửa ${x.project || o.project}: ${ch.join('; ')}`);
  });
  const ids = new Set(after.map((x) => x.id));
  before.filter((x) => !ids.has(x.id)).forEach((x) => out.push(`Xoá ${x.project} — ${x.customer}`));
  return out;
};

export const BizTargetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<TargetPlan[]>(SEED);
  const { targets, setYearTargets } = useBusinessProjects();

  const savePlan = (p: TargetPlan, by: string, submit: boolean) =>
    setPlans((prev) => {
      const old = prev.find((x) => x.id === p.id);
      // Hồ sơ đã gửi / đã duyệt / bị từ chối mà sửa lại → phiên bản mới.
      const bump = old && old.status !== 'Bản nháp' ? 1 : 0;
      const version = (old?.version ?? 0) + bump || 1;
      const changes = diffRows(old?.rows, p.rows);
      const log: TargetLog = { at: now(), by, action: submit ? 'Gửi BOD duyệt' : old ? 'Lưu nháp' : 'Tạo hồ sơ', version, changes: changes.length ? changes : undefined };
      const next: TargetPlan = {
        ...p,
        version,
        status: submit ? 'Chờ BOD duyệt' : 'Bản nháp',
        lastSubmitted: submit ? p.rows.map((x) => ({ ...x })) : old?.lastSubmitted,
        bodNote: submit ? undefined : old?.bodNote,
        history: [...(old?.history || []), log],
      };
      return old ? prev.map((x) => (x.id === p.id ? next : x)) : [next, ...prev];
    });

  const decide = (id: string, approve: boolean, note: string, by: string) => {
    const p = plans.find((x) => x.id === id);
    if (!p) return;
    setPlans((prev) =>
      prev.map((x) =>
        x.id === id
          ? {
              ...x,
              status: approve ? 'Đã duyệt' : 'Từ chối',
              bodNote: note || undefined,
              history: [...x.history, { at: now(), by, action: approve ? 'BOD phê duyệt — ghi nhận kế hoạch chính thức' : 'BOD từ chối', version: x.version, note: note || undefined }],
            }
          : x,
      ),
    );
    // Ghi nhận mục tiêu chính thức của khối (VNĐ) cho Sổ theo dõi dự án.
    if (approve) setYearTargets(String(p.year), { ...(targets[String(p.year)] || {}), [p.division]: totals(p.rows).value * 1_000_000 });
  };

  return <TargetCtx.Provider value={{ plans, savePlan, decide }}>{children}</TargetCtx.Provider>;
};
const useTargets = () => {
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

/**
 * Kỳ lập / điều chỉnh mục tiêu (theo ngày hôm nay):
 *  - Tháng 12/N: mở lập mục tiêu năm N+1 (và điều chỉnh quý 4 năm N).
 *  - Tháng 3, 6, 9 của năm N: mở điều chỉnh mục tiêu năm N.
 *  - Các tháng khác: khoá.
 */
const windowFor = (year: number, today = new Date()) => {
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  if (m === 12 && year === y + 1) return { open: true, text: `Đang mở kỳ lập mục tiêu năm ${year} (01/12/${y} – 31/12/${y})` };
  if ([3, 6, 9, 12].includes(m) && year === y) return { open: true, text: `Đang mở kỳ điều chỉnh quý ${m / 3} năm ${year} (tháng ${m}/${y})` };
  const nextAdj = [3, 6, 9, 12].find((q) => q > m) || 3;
  return {
    open: false,
    text:
      year > y
        ? `Đã khoá — kỳ lập mục tiêu năm ${year} mở từ 01/12/${year - 1} đến 31/12/${year - 1}`
        : `Đã khoá — kỳ điều chỉnh tiếp theo: tháng ${nextAdj}/${nextAdj > m ? y : y + 1}`,
  };
};

const STATUS_CLS: Record<TargetStatus, string> = {
  'Bản nháp': 'bg-slate-100 text-slate-700 border-slate-300',
  'Chờ BOD duyệt': 'bg-amber-50 text-amber-700 border-amber-300',
  'Đã duyệt': 'bg-emerald-50 text-emerald-700 border-emerald-300',
  'Từ chối': 'bg-rose-50 text-rose-700 border-rose-300',
};
const statusText = (p: TargetPlan) => `${p.status} — Phiên bản ${String(p.version).padStart(2, '0')}`;

// ==========================================================================
// Biểu đồ cột nhóm: Giá trị mục tiêu & LN gộp (cùng một trục, triệu VNĐ)
// ==========================================================================
const C_VALUE = '#1f5fa8';
const C_GP = '#e0883a';

const TargetChart: React.FC<{ data: { label: string; value: number; grossProfit: number }[] }> = ({ data }) => {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => Math.max(d.value, d.grossProfit)));
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const top = Math.ceil(max / step) * step;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * top);
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
        <span className="text-slate-400">ĐVT: triệu VNĐ</span>
      </div>
      <div className="flex gap-2 mt-4">
        {/* trục giá trị */}
        <div className="relative w-14 h-[220px] text-[10.5px] text-slate-400 tabular-nums">
          {ticks.map((t) => (
            <span key={t} className="absolute right-1 -translate-y-1/2" style={{ bottom: `${(t / top) * 100}%`, transform: 'translateY(50%)' }}>
              {fmt(t)}
            </span>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="relative h-[220px] border-b border-slate-300">
            {ticks.slice(1).map((t) => (
              <div key={t} className="absolute inset-x-0 border-t border-slate-100" style={{ bottom: `${(t / top) * 100}%` }} />
            ))}
            <div className="absolute inset-0 flex items-end">
              {data.map((d, i) => (
                <div
                  key={d.label}
                  className="relative flex-1 h-full flex items-end justify-center gap-[2px] cursor-default"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  {hover === i && <div className="absolute inset-y-0 inset-x-1 bg-slate-100/70 rounded-[3px]" />}
                  {[
                    [d.value, C_VALUE],
                    [d.grossProfit, C_GP],
                  ].map(([v, c], j) => (
                    <div key={j} className="relative w-[min(26px,30%)] rounded-t-[4px]" style={{ height: `${((v as number) / top) * 100}%`, background: c as string }} />
                  ))}
                  {hover === i && (
                    <div className="absolute z-10 bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white border border-slate-300 shadow-md rounded-[4px] px-2.5 py-1.5 text-[11.5px] text-slate-700">
                      <p className="font-semibold text-slate-800 mb-0.5">{d.label}</p>
                      <p className="flex items-center gap-1.5 tabular-nums">
                        <span className="w-2 h-2 rounded-[2px]" style={{ background: C_VALUE }} /> Giá trị mục tiêu: <b>{fmt(d.value)}</b>
                      </p>
                      <p className="flex items-center gap-1.5 tabular-nums">
                        <span className="w-2 h-2 rounded-[2px]" style={{ background: C_GP }} /> LN gộp: <b>{fmt(d.grossProfit)}</b> ({d.value ? pct(d.grossProfit / d.value) : '—'})
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
const PlanHeader: React.FC<{ p: TargetPlan; editable?: boolean; onChange?: (patch: Partial<TargetPlan>) => void; years?: number[] }> = ({ p, editable, onChange, years = [] }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    {[
      [
        'Khối đăng ký',
        editable ? (
          <select value={p.division} onChange={(e) => onChange?.({ division: e.target.value, author: `GĐK ${e.target.value}` })} className={erp.inputFull}>
            {DIVISIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        ) : (
          p.division
        ),
      ],
      ['Người lập', p.author],
      [
        'Năm kế hoạch',
        editable ? (
          <select value={p.year} onChange={(e) => onChange?.({ year: Number(e.target.value) })} className={erp.inputFull}>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        ) : (
          p.year
        ),
      ],
      ['Trạng thái hồ sơ', <Tag cls={STATUS_CLS[p.status]}>{statusText(p)}</Tag>],
    ].map(([k, v]) => (
      <div key={k as string}>
        <p className="text-[11.5px] text-slate-500 mb-1">{k}</p>
        <div className="min-h-8 flex items-center text-[13px] font-semibold text-slate-800">{v}</div>
      </div>
    ))}
  </div>
);

const PlanSummary: React.FC<{ rows: TargetRow[] }> = ({ rows }) => {
  const [by, setBy] = useState<'customer' | 'time'>('customer');
  const t = totals(rows);
  const byCustomer = groupBy(rows, (x) => x.customer);
  const byTime = groupBy([...rows].sort((a, b) => a.signMonth.localeCompare(b.signMonth)), (x) => my(x.signMonth));
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-3">
      <div className="grid grid-cols-3 xl:grid-cols-1 gap-3">
        <KpiBox label="Tổng giá trị mục tiêu" value={fmt(t.value)} valueText={fmt(t.value)} sub="triệu VNĐ · HĐ ký mới" />
        <KpiBox label="Lợi nhuận gộp mục tiêu" value={fmt(t.grossProfit)} valueText={fmt(t.grossProfit)} sub="triệu VNĐ" />
        <KpiBox label="% Lợi nhuận gộp" value={t.value ? pct(t.rate) : '—'} sub="LN gộp / Giá trị mục tiêu" tone={t.rate >= 0.2 ? 'good' : 'neutral'} />
      </div>
      <Panel
        title="Tổng mục tiêu khối"
        icon={Target}
        actions={
          <span className="flex items-center gap-2 text-[12px] text-slate-600">
            Thời gian
            <Segmented
              options={[
                { key: 'customer', label: 'Theo khách hàng' },
                { key: 'time', label: 'Theo thời gian ký HĐ' },
              ]}
              value={by}
              onChange={setBy}
            />
          </span>
        }
      >
        <div className="grid grid-cols-1 2xl:grid-cols-[1fr_420px] gap-4">
          <TargetChart data={by === 'customer' ? byCustomer : byTime} />
          <div>
            <p className="text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide mb-1.5">Chi tiết mục tiêu theo khách hàng</p>
            <table className={erp.table}>
              <thead>
                <tr>
                  {['Khách hàng', 'Giá trị mục tiêu', 'LN gộp', '% LN gộp'].map((h) => (
                    <th key={h} className={`${erp.th} text-center`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {byCustomer.map((c) => (
                  <tr key={c.label} className={erp.tr}>
                    <td className={erp.td}>{c.label}</td>
                    <td className={`${erp.td} ${erp.num}`}>{fmt(c.value)}</td>
                    <td className={`${erp.td} ${erp.num}`}>{fmt(c.grossProfit)}</td>
                    <td className={`${erp.td} ${erp.num}`}>{c.value ? pct(c.grossProfit / c.value) : '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className={erp.totalRow}>
                  <td className={erp.td}>TỔNG KHỐI</td>
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

/** Bảng "Đăng ký mục tiêu theo khách hàng / dự án". */
/** Ô nhập tháng dạng MM/YYYY (lưu YYYY-MM). Gõ "2/2027", "02/2027" hoặc "022027". */
const MonthInput: React.FC<{ value: string; onChange: (ym: string) => void; className: string }> = ({ value, onChange, className }) => {
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
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLInputElement).blur()}
      placeholder="MM/YYYY"
      inputMode="numeric"
      title={bad ? 'Nhập đúng dạng MM/YYYY, ví dụ 02/2027' : 'MM/YYYY'}
      className={`${className} text-center tabular-nums ${bad ? 'bg-rose-50 text-rose-700' : ''}`}
    />
  );
};

/**
 * `editable`: cho sửa nội dung các ô. `actions`: hiện cột Xoá + nút "Thêm dòng"
 * (khi không sửa được thì các nút này mờ đi kèm lý do `lockReason`).
 */
const RowsTable: React.FC<{
  rows: TargetRow[];
  editable?: boolean;
  actions?: boolean;
  lockReason?: string;
  onChange?: (rows: TargetRow[]) => void;
  onAdd?: () => void;
  customers?: string[];
}> = ({ rows, editable, actions = editable, lockReason, onChange, onAdd, customers = [] }) => {
  const t = totals(rows);
  const set = (id: string, patch: Partial<TargetRow>) => onChange?.(rows.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const cell = 'w-full h-8 px-2 bg-transparent text-[12.5px] outline-none focus:bg-[#eaf2fc] focus:ring-1 focus:ring-inset focus:ring-[#1f5fa8]';
  const numIn = (v: number, on: (n: number) => void) => (
    <input value={v ? fmt(v) : ''} onChange={(e) => on(Number(e.target.value.replace(/[^\d]/g, '')) || 0)} inputMode="numeric" placeholder="0" className={`${cell} text-right tabular-nums`} />
  );
  return (
    <div className="overflow-x-auto">
      <table className={`${erp.table} min-w-[1100px]`}>
        <thead>
          <tr>
            {['STT', 'Khách hàng', 'Tên dự án'].map((h) => (
              <th key={h} rowSpan={2} className={`${erp.th} text-center border-t-0 first:border-l-0`}>
                {h}
              </th>
            ))}
            <th colSpan={2} className={`${erp.th} text-center border-t-0`}>
              Thời điểm dự kiến
            </th>
            <th colSpan={3} className={`${erp.th} text-center border-t-0`}>
              Chỉ tiêu đăng ký (triệu VNĐ)
            </th>
            <th rowSpan={2} className={`${erp.th} text-center border-t-0 ${actions ? '' : 'border-r-0'}`}>
              Cơ sở đăng ký / Thuyết minh kế hoạch
            </th>
            {actions && (
              <th rowSpan={2} className={`${erp.th} text-center border-t-0 border-r-0 w-12`}>
                Xoá
              </th>
            )}
          </tr>
          <tr>
            {['Ra thầu', 'Ký HĐ', 'HĐ ký mới', 'LN gộp mục tiêu', '% LN gộp mục tiêu'].map((h) => (
              <th key={h} className={`${erp.th} text-center font-medium`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((x, i) => (
            <tr key={x.id} className={erp.tr}>
              <td className={`${erp.td} text-center text-slate-500 border-l-0 w-12`}>{i + 1}</td>
              {editable ? (
                <>
                  <td className="border border-slate-200 p-0 w-44">
                    <input value={x.customer} onChange={(e) => set(x.id, { customer: e.target.value })} list="target-customers" placeholder="Khách hàng" className={cell} />
                  </td>
                  <td className="border border-slate-200 p-0 w-52">
                    <input value={x.project} onChange={(e) => set(x.id, { project: e.target.value })} placeholder="Tên dự án" className={cell} />
                  </td>
                  <td className="border border-slate-200 p-0 w-28">
                    <MonthInput value={x.tenderMonth} onChange={(ym) => set(x.id, { tenderMonth: ym })} className={cell} />
                  </td>
                  <td className="border border-slate-200 p-0 w-28">
                    <MonthInput value={x.signMonth} onChange={(ym) => set(x.id, { signMonth: ym })} className={cell} />
                  </td>
                  <td className="border border-slate-200 p-0 w-32">{numIn(x.value, (n) => set(x.id, { value: n }))}</td>
                  <td className="border border-slate-200 p-0 w-32">{numIn(x.grossProfit, (n) => set(x.id, { grossProfit: n }))}</td>
                  <td className={`${erp.td} ${erp.num} w-28 text-slate-600`}>{x.value ? pct(x.grossProfit / x.value) : '—'}</td>
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
                  <td className={`${erp.td} ${erp.num}`}>{fmt(x.grossProfit)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{x.value ? pct(x.grossProfit / x.value) : '—'}</td>
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
              <td colSpan={actions ? 10 : 9} className={`${erp.td} text-center text-slate-400 py-6 border-x-0`}>
                Chưa có dự án đăng ký. {editable && 'Bấm "+ Thêm dòng".'}
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className={erp.totalRow}>
            <td colSpan={5} className={`${erp.td} border-l-0`}>
              TỔNG MỤC TIÊU KHỐI
            </td>
            <td className={`${erp.td} ${erp.num}`}>{fmt(t.value)}</td>
            <td className={`${erp.td} ${erp.num}`}>{fmt(t.grossProfit)}</td>
            <td className={`${erp.td} ${erp.num}`}>{t.value ? pct(t.rate) : '—'}</td>
            <td colSpan={actions ? 2 : 1} className={`${erp.td} border-r-0`} />
          </tr>
          {actions && (
            <tr>
              <td colSpan={10} className="border-t border-slate-200 px-2 py-1.5">
                <button
                  type="button"
                  onClick={onAdd}
                  disabled={!editable}
                  title={editable ? 'Thêm một dòng đăng ký mới' : lockReason}
                  className="inline-flex items-center gap-1 px-2 h-7 rounded-[3px] text-[12.5px] font-semibold text-[#1f7ae0] hover:bg-[#eaf2fc] disabled:text-slate-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                >
                  <Plus size={14} /> Thêm dòng
                </button>
                {!editable && lockReason && <span className="ml-2 text-[11.5px] text-slate-400">{lockReason}</span>}
              </td>
            </tr>
          )}
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

const FlowNote = () => <span className="text-[12px] text-slate-600">GĐK lập hồ sơ → BOD phê duyệt → Ghi nhận kế hoạch chính thức</span>;

// ==========================================================================
// Tab 1: GĐK lập mục tiêu
// ==========================================================================
const GdkTab: React.FC<{ flash: (m: string) => void }> = ({ flash }) => {
  const { plans, savePlan } = useTargets();
  const { projects } = useBusinessProjects();
  const today = new Date();
  // Quý 4 (tháng 10–12) mặc định chuẩn bị mục tiêu năm sau; còn lại là năm hiện tại.
  const defYear = today.getFullYear() + (today.getMonth() >= 9 ? 1 : 0);
  const years = [today.getFullYear(), today.getFullYear() + 1];
  const [division, setDivision] = useState('G1');
  const [year, setYear] = useState(defYear);
  // Bản thử nghiệm (chưa có đăng nhập / lịch thật): mặc định cho sửa cả ngoài kỳ; bỏ tick để thấy cơ chế khoá kỳ.
  const [ignoreLock, setIgnoreLock] = useState(true);
  const saved = plans.find((p) => p.division === division && p.year === year);
  const blank = (): TargetPlan => ({ id: `TP-${division}-${year}`, division, year, author: `GĐK ${division}`, version: 1, status: 'Bản nháp', rows: [], history: [] });
  const [draft, setDraft] = useState<TargetPlan>(() => saved || blank());
  const [err, setErr] = useState('');
  // Đổi khối / năm → nạp hồ sơ tương ứng.
  const key = `${division}-${year}`;
  const [loadedKey, setLoadedKey] = useState(key);
  if (loadedKey !== key) {
    setLoadedKey(key);
    setDraft(saved || blank());
    setErr('');
  }

  const win = windowFor(year, today);
  const waiting = (saved?.status ?? draft.status) === 'Chờ BOD duyệt';
  const editable = (win.open || ignoreLock) && !waiting;
  const lockReason = waiting ? 'Hồ sơ đang chờ BOD duyệt — không sửa được' : !win.open && !ignoreLock ? 'Ngoài kỳ lập / điều chỉnh mục tiêu — đã khoá' : undefined;
  const addRow = () => setDraft((d) => ({ ...d, rows: [...d.rows, { id: uid(), customer: '', project: '', tenderMonth: '', signMonth: '', value: 0, grossProfit: 0, basis: '' }] }));
  const customers = useMemo(() => [...new Set([...projects.map((p) => p.customerName), ...plans.flatMap((p) => p.rows.map((x) => x.customer))].filter(Boolean))].sort(), [projects, plans]);
  const dirty = JSON.stringify(saved?.rows || []) !== JSON.stringify(draft.rows);

  const validate = () => {
    if (!draft.rows.length) return 'Chưa có dự án đăng ký.';
    const bad = draft.rows.findIndex((x) => !x.customer.trim() || !x.project.trim() || !x.signMonth || !x.value);
    if (bad >= 0) return `Dòng ${bad + 1}: nhập đủ Khách hàng, Tên dự án, Ký HĐ và HĐ ký mới.`;
    const over = draft.rows.findIndex((x) => x.grossProfit > x.value);
    if (over >= 0) return `Dòng ${over + 1}: LN gộp không được lớn hơn giá trị HĐ ký mới.`;
    return '';
  };
  const save = (submit: boolean) => {
    const e = submit ? validate() : '';
    setErr(e);
    if (e) return;
    savePlan(draft, `${CURRENT_USER} (GĐK ${division})`, submit);
    flash(submit ? `Đã gửi BOD duyệt mục tiêu ${division} năm ${year}` : 'Đã lưu nháp');
  };
  // Đồng bộ draft với bản vừa lưu (trạng thái / phiên bản / lịch sử).
  const current = plans.find((p) => p.id === draft.id);
  const view: TargetPlan = current ? { ...current, rows: draft.rows } : draft;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
          Khối
          <select value={division} onChange={(e) => setDivision(e.target.value)} className={`${erp.input} w-28`}>
            {DIVISIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
          Năm kế hoạch
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={`${erp.input} w-28`}>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </label>
        <span
          className={`flex items-center gap-1.5 px-2.5 h-8 rounded-[3px] border text-[12px] font-semibold ${
            win.open ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-slate-100 border-slate-300 text-slate-600'
          }`}
        >
          {win.open ? <LockOpen size={13} /> : <Lock size={13} />} {win.text}
        </span>
        {!win.open && (
          <label className="flex items-center gap-1.5 text-[12px] text-slate-500 cursor-pointer" title="Chỉ để thử chức năng khi kỳ lập đang khoá">
            <input type="checkbox" checked={ignoreLock} onChange={(e) => setIgnoreLock(e.target.checked)} className="accent-[#1f5fa8]" /> Chế độ thử: bỏ qua khoá kỳ
          </label>
        )}
      </div>

      <Panel title="Mục tiêu kinh doanh" icon={Target}>
        <PlanHeader p={view} />
        {waiting && <p className="mt-3 text-[12px] text-amber-700">Hồ sơ đang chờ BOD duyệt — không sửa được cho tới khi BOD phê duyệt hoặc từ chối.</p>}
        {view.status === 'Từ chối' && view.bodNote && (
          <p className="mt-3 flex items-start gap-1.5 px-3 py-2 rounded-[3px] bg-rose-50 border border-rose-200 text-[12px] text-rose-700">
            <XCircle size={14} className="mt-px shrink-0" /> BOD từ chối: “{view.bodNote}” — điều chỉnh và gửi lại (phiên bản mới).
          </p>
        )}
      </Panel>

      <PlanSummary rows={draft.rows} />

      <Panel
        title="Đăng ký mục tiêu theo khách hàng / dự án"
        icon={PenLine}
        noPad
        actions={
          <Btn variant="primary" icon={Plus} className="h-7" disabled={!editable} title={lockReason} onClick={addRow}>
            Thêm dòng
          </Btn>
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
                  Gửi BOD duyệt
                </Btn>
              </span>
            )}
          </div>
        }
      >
        <RowsTable rows={draft.rows} editable={editable} actions lockReason={lockReason} customers={customers} onAdd={addRow} onChange={(rows) => setDraft((d) => ({ ...d, rows }))} />
      </Panel>

      {current && <HistoryPanel p={current} />}
    </>
  );
};

// ==========================================================================
// Tab 2: BOD phê duyệt
// ==========================================================================
const BodTab: React.FC<{ flash: (m: string) => void }> = ({ flash }) => {
  const { plans, decide } = useTargets();
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  const p = plans.find((x) => x.id === openId);
  const list = [...plans].sort((a, b) => (a.status === 'Chờ BOD duyệt' ? -1 : 0) - (b.status === 'Chờ BOD duyệt' ? -1 : 0) || b.year - a.year || a.division.localeCompare(b.division));

  if (!p)
    return (
      <Panel title="Hồ sơ mục tiêu kinh doanh" icon={ClipboardCheck} noPad footer="Bấm vào một hồ sơ để xem và phê duyệt. ĐVT: triệu VNĐ">
        <table className={erp.table}>
          <thead>
            <tr>
              {['Khối', 'Năm kế hoạch', 'Người lập', 'Trạng thái hồ sơ', 'Số dự án', 'Tổng giá trị mục tiêu', 'LN gộp', '% LN gộp', 'Cập nhật', ''].map((h, i) => (
                <th key={i} className={`${erp.th} text-center border-t-0 first:border-l-0 last:border-r-0`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((x) => {
              const t = totals(x.rows);
              const last = x.history[x.history.length - 1];
              return (
                <tr key={x.id} className={`${erp.tr} cursor-pointer`} onClick={() => (setOpenId(x.id), setNote(''), setErr(''))}>
                  <td className={`${erp.td} font-semibold border-l-0`}>{x.division}</td>
                  <td className={`${erp.td} text-center`}>{x.year}</td>
                  <td className={erp.td}>{x.author}</td>
                  <td className={erp.td}>
                    <Tag cls={STATUS_CLS[x.status]}>{statusText(x)}</Tag>
                  </td>
                  <td className={`${erp.td} text-center`}>{x.rows.length}</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmt(t.value)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmt(t.grossProfit)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{t.value ? pct(t.rate) : '—'}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{last ? dt(last.at) : '—'}</td>
                  <td className={`${erp.td} text-center border-r-0`}>
                    <span className={`underline ${x.status === 'Chờ BOD duyệt' ? 'text-rose-600 font-bold' : 'text-[#1f5fa8]'}`}>{x.status === 'Chờ BOD duyệt' ? 'Duyệt' : 'Xem'}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    );

  const canDecide = p.status === 'Chờ BOD duyệt';
  const act = (approve: boolean) => {
    if (!approve && !note.trim()) return setErr('Từ chối bắt buộc nhập ý kiến (không chấp nhận nội dung trống hoặc chỉ có khoảng trắng).');
    decide(p.id, approve, note.trim(), `${CURRENT_USER} (BOD)`);
    flash(approve ? `BOD đã phê duyệt mục tiêu ${p.division} năm ${p.year} — ghi nhận kế hoạch chính thức` : `BOD đã từ chối mục tiêu ${p.division} năm ${p.year}`);
    setErr('');
  };

  return (
    <>
      <Panel title="Mục tiêu kinh doanh" icon={Target}>
        <PlanHeader p={p} />
      </Panel>
      <PlanSummary rows={p.rows} />
      <Panel title="Đăng ký mục tiêu theo khách hàng / dự án" icon={PenLine} noPad>
        <RowsTable rows={p.rows} />
      </Panel>
      <Panel
        title="Ý kiến BOD — bắt buộc nếu từ chối"
        icon={ClipboardCheck}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FlowNote />
            <span className="flex items-center gap-2">
              <Btn icon={ArrowLeft} className="h-8" onClick={() => setOpenId(null)}>
                Quay lại danh sách
              </Btn>
              {canDecide && (
                <>
                  <Btn variant="danger" icon={XCircle} className="h-8" onClick={() => act(false)}>
                    Từ chối
                  </Btn>
                  <Btn variant="success" icon={CheckCircle2} className="h-8" onClick={() => act(true)}>
                    Phê duyệt
                  </Btn>
                </>
              )}
            </span>
          </div>
        }
      >
        {canDecide ? (
          <>
            <textarea value={note} onChange={(e) => (setNote(e.target.value), setErr(''))} rows={3} placeholder="Nhập ý kiến của BOD…" className={`${erp.inputFull} h-auto py-1.5`} />
            <p className={`mt-1 text-[11.5px] ${err ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
              {err || 'Nhập ý kiến tại ô trên. Phê duyệt: ý kiến không bắt buộc. Từ chối: không chấp nhận nội dung trống hoặc chỉ có khoảng trắng.'}
            </p>
          </>
        ) : (
          <p className="text-[12.5px] text-slate-600">
            Hồ sơ đang ở trạng thái <b>{p.status}</b>
            {p.bodNote ? <> — ý kiến BOD: “{p.bodNote}”</> : ''}. {p.status === 'Bản nháp' && 'GĐK chưa gửi duyệt.'}
          </p>
        )}
      </Panel>
      <HistoryPanel p={p} />
    </>
  );
};

// ==========================================================================
// Trang
// ==========================================================================
export const BizTargetPage: React.FC = () => {
  const [tab, setTab] = useState<'gdk' | 'bod'>('gdk');
  const { plans } = useTargets();
  const [toast, setToast] = useState<string | null>(null);
  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2600);
  };
  const waiting = plans.filter((p) => p.status === 'Chờ BOD duyệt').length;
  return (
    <ErpPage>
      {toast && (
        <div className="fixed top-5 right-5 z-[120] bg-[#1e3a5f] text-white px-4 py-2.5 rounded-[4px] shadow-lg flex items-center gap-2 text-[12px] font-semibold max-w-md">
          <CheckCircle2 size={14} className="text-emerald-300 shrink-0" /> {toast}
        </div>
      )}
      <ErpTitleBar crumbs={CRUMBS} title="Mục tiêu kinh doanh" />
      <FolderTabs
        tabs={[
          { key: 'gdk', label: 'GĐK lập mục tiêu', icon: PenLine },
          { key: 'bod', label: `BOD phê duyệt${waiting ? ` (${waiting})` : ''}`, icon: ClipboardCheck },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === 'gdk' ? <GdkTab flash={flash} /> : <BodTab flash={flash} />}
    </ErpPage>
  );
};
