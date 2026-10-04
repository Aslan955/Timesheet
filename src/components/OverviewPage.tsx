/**
 * OverviewPage — màn "Tổng quan" (module Quản trị dự án & Tài chính),
 * dựng theo mẫu "Gửi Nam - 02.10.26 - Tổng quan.xlsx". ĐVT: VNĐ.
 *
 *  Hàng 1: Mục tiêu đã xác lập / Kế hoạch năm · Công nợ phải thu · Vấn đề tồn đọng
 *  Hàng 2: Doanh thu, chi phí, lợi nhuận (4 chỉ số + biểu đồ cột, chọn chỉ tiêu, theo tháng / theo khối)
 *  Hàng 3: Công nợ phải thu theo khối · theo khách hàng (lớn → nhỏ)
 *  Hàng 4: Dòng tiền theo khối qua các tháng (biểu đồ + bảng khối; bấm khối để xem riêng)
 *  Hàng 5: Top 5 dự án hiệu quả · Top 5 dự án có dòng tiền xấu
 *  Hàng 6: Top 10 dự án công nợ cao · Top 10 khách hàng công nợ cao
 *  Hàng 7: Các vấn đề cần xử lý (mức độ cao trước, cùng mức xếp theo số ngày quá hạn xử lý)
 *
 * Cách tính: xem src/business/overview.ts.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, BarChart3, Landmark, ListChecks, Target, Trophy, TrendingDown, Users, Wallet, Waves } from 'lucide-react';
import { BizProject, DIVISIONS, latestActualMonth, useBusinessProjects } from '../business/BusinessProjectContext';
import {
  Fin,
  ISSUE_STATUSES,
  Issue,
  IssueStatus,
  MIN_MARGIN,
  PAYMENT_TERM_DAYS,
  RULES,
  Receivable,
  SEVERITIES,
  Severity,
  addFin,
  addRec,
  cutoffFor,
  detectIssues,
  emptyFin,
  emptyRec,
  endOfMonth,
  finOf,
  hasPakd,
  marginOf,
  receivableOf,
  signYear,
} from '../business/overview';
import { useBizTargets } from './BizTargetPage';
import { ErpPage, ErpTitleBar, KpiBox, Panel, Segmented, erp } from './erp/Erp';

// --------------------------------------------------------------------------
// Màu & định dạng
// --------------------------------------------------------------------------
const C = {
  blue: '#1f5fa8', // thực tế · tiền thu · trong hạn
  orange: '#e0883a', // kế hoạch · tiền chi
  line: '#334155', // dòng tiền ròng
  track: '#e2e8f0',
  overdue: '#d03b3b',
};
const SEV_COLOR: Record<Severity, string> = { Cao: '#d03b3b', 'Trung bình': '#fab219', Thấp: '#94a3b8' };
const AGING = [
  { key: 'b30' as const, label: 'Quá hạn 1-30 ngày', color: '#ef9a9a' },
  { key: 'b60' as const, label: 'Quá hạn 31-60 ngày', color: '#de5b5b' },
  { key: 'b60p' as const, label: 'Quá hạn trên 60 ngày', color: '#a61f1f' },
];

/** Số tiền hiển thị theo VNĐ (đầy đủ, ngăn cách hàng nghìn). */
const tr = (v: number) => Math.round(v || 0).toLocaleString('en-US');
const pct = (x: number | null, d = 1) => (x === null || !isFinite(x) ? '—' : `${(x * 100).toFixed(d)}%`);
/** Nhãn trục gọn. */
const short = (v: number) => {
  const a = Math.abs(v);
  if (a >= 1e12) return `${+(v / 1e12).toFixed(1)} nghìn tỷ`;
  if (a >= 1e9) return `${+(v / 1e9).toFixed(1)} tỷ`;
  if (a >= 1e6) return `${Math.round(v / 1e6)} triệu`;
  return v ? `${v}` : '0';
};
const dmy = (iso: string) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '—');
const my = (ym: string) => (ym ? `${ym.slice(5, 7)}/${ym.slice(0, 4)}` : '—');

// --------------------------------------------------------------------------
// Tooltip & đo bề rộng
// --------------------------------------------------------------------------
interface TipRow {
  color?: string;
  label: string;
  value: string;
  line?: boolean;
}
interface Tip {
  x: number;
  y: number;
  title: string;
  rows: TipRow[];
}
const TipBox: React.FC<{ tip: Tip | null; width: number }> = ({ tip, width }) =>
  tip ? (
    <div
      className="absolute z-20 pointer-events-none bg-white border border-slate-300 rounded-[4px] shadow-lg px-2.5 py-1.5 text-[12px] min-w-[150px]"
      style={{ left: Math.min(tip.x + 12, Math.max(0, width - 210)), top: Math.max(0, tip.y - 10) }}
    >
      <p className="font-semibold text-slate-800 mb-0.5">{tip.title}</p>
      {tip.rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2 leading-5">
          {r.color && (r.line ? <span className="w-3 h-[2px] shrink-0" style={{ background: r.color }} /> : <span className="w-2.5 h-2.5 rounded-[2px] shrink-0" style={{ background: r.color }} />)}
          <span className="text-slate-600">{r.label}</span>
          <span className="ml-auto pl-3 font-semibold text-slate-900 tabular-nums">{r.value}</span>
        </div>
      ))}
    </div>
  ) : null;

const useWidth = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(200, Math.floor(e.contentRect.width))));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
};

const Legend: React.FC<{ items: { color: string; label: string; line?: boolean }[] }> = ({ items }) => (
  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-600">
    {items.map((it) => (
      <span key={it.label} className="inline-flex items-center gap-1.5">
        {it.line ? <span className="w-4 h-[2px]" style={{ background: it.color }} /> : <span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: it.color }} />}
        {it.label}
      </span>
    ))}
  </div>
);

// --------------------------------------------------------------------------
// Biểu đồ cột nhóm (+ đường), một trục
// --------------------------------------------------------------------------
const niceTicks = (min: number, max: number, n = 4) => {
  if (min === max) max = min + 1;
  const raw = (max - min) / n;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((k) => k * p).find((s) => s >= raw) || raw;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const out: number[] = [];
  for (let v = lo; v <= hi + step / 2; v += step) out.push(+v.toFixed(6));
  return out;
};
/** Cột có đầu bo 4px ở phía xa trục (âm thì bo phía dưới). */
const barPath = (x: number, y0: number, y1: number, w: number) => {
  const h = Math.abs(y1 - y0);
  if (h < 0.5) return '';
  const r = Math.min(4, w / 2, h);
  if (y1 < y0)
    return `M${x},${y0}V${y1 + r}Q${x},${y1} ${x + r},${y1}H${x + w - r}Q${x + w},${y1} ${x + w},${y1 + r}V${y0}Z`;
  return `M${x},${y0}V${y1 - r}Q${x},${y1} ${x + r},${y1}H${x + w - r}Q${x + w},${y1} ${x + w},${y1 - r}V${y0}Z`;
};
interface Series {
  name: string;
  color: string;
  values: (number | null)[];
}
const ColumnChart: React.FC<{
  categories: string[];
  titles?: string[];
  series: Series[];
  line?: Series;
  height?: number;
}> = ({ categories, titles, series, line, height = 250 }) => {
  const [ref, W] = useWidth<HTMLDivElement>();
  const [tip, setTip] = useState<Tip | null>(null);
  const [hover, setHover] = useState(-1);
  const all = [...series, ...(line ? [line] : [])].flatMap((s) => s.values.filter((v): v is number => v !== null));
  const ticks = niceTicks(Math.min(0, ...all), Math.max(0, ...all, 1));
  const [lo, hi] = [ticks[0], ticks[ticks.length - 1]];
  const pad = { l: 64, r: 10, t: 10, b: 26 };
  const iw = W - pad.l - pad.r;
  const ih = height - pad.t - pad.b;
  const y = (v: number) => pad.t + ih - ((v - lo) / (hi - lo)) * ih;
  const n = categories.length || 1;
  const band = iw / n;
  const k = series.length;
  const bw = Math.max(3, Math.min(18, (band * 0.72 - 2 * (k - 1)) / k));
  const groupW = bw * k + 2 * (k - 1);
  const every = Math.ceil(n / Math.max(1, Math.floor(iw / 46)));
  const show = (i: number, e: React.MouseEvent) => {
    const box = ref.current!.getBoundingClientRect();
    setHover(i);
    setTip({
      x: e.clientX - box.left,
      y: e.clientY - box.top,
      title: titles?.[i] || categories[i],
      rows: [
        ...series.map((s) => ({ color: s.color, label: s.name, value: s.values[i] === null ? '—' : `${tr(s.values[i]!)} VNĐ` })),
        ...(line ? [{ color: line.color, label: line.name, value: line.values[i] === null ? '—' : `${tr(line.values[i]!)} VNĐ`, line: true }] : []),
      ],
    });
  };
  return (
    <div ref={ref} className="relative w-full" onMouseLeave={() => (setTip(null), setHover(-1))}>
      <svg width={W} height={height} className="block">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? '#94a3b8' : '#e5e9ef'} strokeWidth={1} />
            <text x={pad.l - 6} y={y(t) + 4} textAnchor="end" fontSize={11} fill="#64748b">
              {short(t)}
            </text>
          </g>
        ))}
        {categories.map((c, i) => {
          const x0 = pad.l + band * i;
          const gx = x0 + (band - groupW) / 2;
          return (
            <g key={c + i}>
              {hover === i && <rect x={x0} y={pad.t} width={band} height={ih} fill="#f1f5f9" />}
              {series.map((s, j) => {
                const v = s.values[i];
                return v === null ? null : <path key={s.name} d={barPath(gx + j * (bw + 2), y(0), y(v), bw)} fill={s.color} />;
              })}
              {i % every === 0 && (
                <text x={x0 + band / 2} y={height - 8} textAnchor="middle" fontSize={11} fill="#64748b">
                  {c}
                </text>
              )}
            </g>
          );
        })}
        {line && (
          <>
            <polyline
              fill="none"
              stroke={line.color}
              strokeWidth={2}
              points={line.values
                .map((v, i) => (v === null ? null : `${pad.l + band * i + band / 2},${y(v)}`))
                .filter(Boolean)
                .join(' ')}
            />
            {line.values.map((v, i) =>
              v === null ? null : <circle key={i} cx={pad.l + band * i + band / 2} cy={y(v)} r={4} fill={line.color} stroke="#fff" strokeWidth={2} />,
            )}
          </>
        )}
        {categories.map((c, i) => (
          <rect key={`h${i}`} x={pad.l + band * i} y={pad.t} width={band} height={ih} fill="transparent" onMouseMove={(e) => show(i, e)} />
        ))}
      </svg>
      <TipBox tip={tip} width={W} />
    </div>
  );
};

// --------------------------------------------------------------------------
// Thanh ngang xếp chồng (công nợ: trong hạn / quá hạn), lớn → nhỏ
// --------------------------------------------------------------------------
const HBarList: React.FC<{ rows: { label: string; sub?: string; rec: Receivable }[]; empty: string }> = ({ rows, empty }) => {
  const [ref, W] = useWidth<HTMLDivElement>();
  const [tip, setTip] = useState<Tip | null>(null);
  const max = Math.max(1, ...rows.map((r) => r.rec.total));
  if (!rows.length) return <p className="py-10 text-center text-slate-400 text-[12.5px]">{empty}</p>;
  return (
    <div ref={ref} className="relative space-y-1.5" onMouseLeave={() => setTip(null)}>
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center gap-2 text-[12.5px] rounded-[3px] hover:bg-slate-50 px-1 -mx-1 py-0.5"
          onMouseMove={(e) => {
            const box = ref.current!.getBoundingClientRect();
            setTip({
              x: e.clientX - box.left,
              y: e.clientY - box.top,
              title: r.label,
              rows: [
                { color: C.blue, label: 'Trong hạn', value: `${tr(r.rec.inTerm)} VNĐ` },
                { color: C.overdue, label: 'Quá hạn', value: `${tr(r.rec.overdue)} VNĐ` },
                { label: 'Tổng công nợ', value: `${tr(r.rec.total)} VNĐ` },
              ],
            });
          }}
        >
          <span className="w-[38%] max-w-[230px] shrink-0 truncate text-slate-700" title={r.label}>
            {r.label}
            {r.sub && <span className="text-slate-400"> · {r.sub}</span>}
          </span>
          <div className="flex-1 flex items-center h-3.5 min-w-0">
            <div className="h-full flex gap-[2px]" style={{ width: `${(r.rec.total / max) * 100}%` }}>
              {r.rec.inTerm > 0 && <div className="h-full rounded-l-[3px] last:rounded-r-[3px]" style={{ background: C.blue, flex: r.rec.inTerm }} />}
              {r.rec.overdue > 0 && <div className="h-full first:rounded-l-[3px] rounded-r-[3px]" style={{ background: C.overdue, flex: r.rec.overdue }} />}
            </div>
          </div>
          <span className="w-[132px] shrink-0 text-right font-semibold tabular-nums text-slate-800">{tr(r.rec.total)}</span>
        </div>
      ))}
      <TipBox tip={tip} width={W} />
    </div>
  );
};

// --------------------------------------------------------------------------
// Vòng tiến độ (meter tròn) & donut mức độ
// --------------------------------------------------------------------------
/**
 * Vòng tiến độ mục tiêu năm: 1 vòng, 100% = Kế hoạch năm.
 *   Xanh lá  = Đã ký
 *   Xanh dương = Đã xác lập nhưng chưa ký (Đã xác lập − Đã ký)
 *   Xám      = Chưa xác lập (Kế hoạch − Đã xác lập)
 * Giữa vòng: % đã ký / KH năm. Chú thích bên cạnh ghi số và % từng phần.
 */
const C_SIGNED = '#0f8a4c';
const GoalRing: React.FC<{ plan: number; est: number; signed: number }> = ({ plan, est, signed }) => {
  const [hover, setHover] = useState<string | null>(null);
  const r = 46;
  const sw = 13;
  const len = 2 * Math.PI * r;
  const base = plan > 0 ? plan : Math.max(est, signed, 1);
  const kSigned = Math.min(1, signed / base);
  const kEst = Math.min(1 - kSigned, Math.max(0, est - signed) / base);
  const gap = 2; // khe 2px giữa 2 phần
  const segs = [
    { key: 'signed', k: kSigned, color: C_SIGNED, label: 'Đã ký', value: signed },
    { key: 'est', k: kEst, color: C.blue, label: 'Đã xác lập, chưa ký', value: Math.max(0, est - signed) },
  ];
  const visible = segs.filter((x) => x.k > 0);
  let acc = 0;
  const rows = [
    ...segs,
    { key: 'none', k: 0, color: C.track, label: 'Chưa xác lập', value: Math.max(0, plan - est) },
  ];
  const pctOf = (v: number) => (plan > 0 ? `${Math.round((v / plan) * 100)}%` : '—');
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      <svg width={124} height={124} viewBox="0 0 124 124" role="img" aria-label={`Đã ký ${pctOf(signed)}, đã xác lập ${pctOf(est)} kế hoạch năm`} className="shrink-0">
        <circle cx={62} cy={62} r={r} fill="none" stroke={C.track} strokeWidth={sw} />
        {visible.map((x) => {
          const seg = x.k * len;
          const draw = Math.max(0, seg - (visible.length > 1 ? gap : 0));
          const el = (
            <circle
              key={x.key}
              cx={62}
              cy={62}
              r={r}
              fill="none"
              stroke={x.color}
              strokeWidth={hover === x.key ? sw + 3 : sw}
              strokeDasharray={`${draw} ${len}`}
              strokeDashoffset={-acc}
              transform="rotate(-90 62 62)"
              onMouseEnter={() => setHover(x.key)}
              onMouseLeave={() => setHover(null)}
              className="cursor-default transition-[stroke-width]"
            >
              <title>{`${x.label}: ${tr(x.value)} (${pctOf(x.value)} KH năm)`}</title>
            </circle>
          );
          acc += seg;
          return el;
        })}
        <text x={62} y={62} textAnchor="middle" fontSize={20} fontWeight={700} fill="#0f172a">
          {pctOf(signed)}
        </text>
        <text x={62} y={78} textAnchor="middle" fontSize={10.5} fill="#64748b">
          đã ký
        </text>
      </svg>
      <div className="flex-1 min-w-[260px] max-w-[420px] space-y-1">
        {rows.map((x) => (
          <div
            key={x.key}
            className={`flex items-start gap-2 text-[12px] rounded-[3px] px-1 -mx-1 ${hover === x.key ? 'bg-slate-100' : ''}`}
            onMouseEnter={() => x.key !== 'none' && setHover(x.key)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="mt-[3px] w-2.5 h-2.5 rounded-[2px] shrink-0" style={{ background: x.color }} />
            <span className="flex-1 min-w-0 text-slate-600 leading-tight">{x.label}</span>
            <span className="font-semibold text-slate-800 tabular-nums">{tr(x.value)}</span>
            <span className="w-10 text-right text-slate-500 tabular-nums">{pctOf(x.value)}</span>
          </div>
        ))}
        <p className="pt-1 border-t border-slate-200 text-[11.5px] text-slate-500">
          Đã xác lập: <b className="text-slate-700 tabular-nums">{pctOf(est)}</b> KH năm
        </p>
      </div>
    </div>
  );
};

const Donut: React.FC<{ parts: { key: string; value: number; color: string }[]; center: React.ReactNode }> = ({ parts, center }) => {
  const total = parts.reduce((s, p) => s + p.value, 0);
  const r = 40;
  const len = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={104} height={104} viewBox="0 0 104 104" className="shrink-0">
      <circle cx={52} cy={52} r={r} fill="none" stroke={C.track} strokeWidth={12} />
      {total > 0 &&
        parts.map((p) => {
          if (!p.value) return null;
          const seg = (p.value / total) * len;
          const gap = parts.filter((x) => x.value).length > 1 ? 2 : 0;
          const el = (
            <circle
              key={p.key}
              cx={52}
              cy={52}
              r={r}
              fill="none"
              stroke={p.color}
              strokeWidth={12}
              strokeDasharray={`${Math.max(0, seg - gap)} ${len}`}
              strokeDashoffset={-acc}
              transform="rotate(-90 52 52)"
            />
          );
          acc += seg;
          return el;
        })}
      <foreignObject x={22} y={30} width={60} height={44}>
        <div className="h-full flex flex-col items-center justify-center leading-tight">{center}</div>
      </foreignObject>
    </svg>
  );
};

// --------------------------------------------------------------------------
// Bảng xếp hạng
// --------------------------------------------------------------------------
const RankTable: React.FC<{ head: { label: string; num?: boolean }[]; rows: React.ReactNode[][]; empty: string }> = ({ head, rows, empty }) => (
  <div className="overflow-x-auto">
  <table className={erp.table}>
    <thead>
      <tr>
        <th className={`${erp.th} w-8 text-center border-t-0 border-l-0`}>#</th>
        {head.map((h, i) => (
          <th key={h.label} className={`${erp.th} border-t-0 ${h.num ? 'text-right' : 'text-left'} ${i === head.length - 1 ? 'border-r-0' : ''}`}>
            {h.label}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.length ? (
        rows.map((cells, i) => (
          <tr key={i} className={erp.tr}>
            <td className={`${erp.td} text-center text-slate-500 border-l-0`}>{i + 1}</td>
            {cells.map((c, j) => (
              <td key={j} className={`${erp.td} ${head[j].num ? `${erp.num} whitespace-nowrap` : ''} ${j === cells.length - 1 ? 'border-r-0' : ''}`}>
                {c}
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={head.length + 1} className="px-3 py-6 text-center text-slate-400 italic">
            {empty}
          </td>
        </tr>
      )}
    </tbody>
  </table>
  </div>
);
const ProjCell: React.FC<{ p: BizProject }> = ({ p }) => (
  <div className="min-w-0 max-w-[150px]">
    <p className="truncate font-medium text-slate-800" title={p.name}>
      {p.name}
    </p>
    <p className="font-mono text-[11px] text-[#1f5fa8]">{p.masterCode || '—'}</p>
  </div>
);

// --------------------------------------------------------------------------
// Trang
// --------------------------------------------------------------------------
type Metric = 'revenue' | 'cost' | 'profit';
const METRICS: { key: Metric; label: string }[] = [
  { key: 'revenue', label: 'Doanh thu' },
  { key: 'cost', label: 'Chi phí' },
  { key: 'profit', label: 'Lợi nhuận' },
];
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

export const OverviewPage: React.FC = () => {
  const { projects, targets } = useBusinessProjects();
  const { plans } = useBizTargets();
  const thisYear = String(new Date().getFullYear());

  const years = useMemo(() => {
    const s = new Set<string>([thisYear, ...Object.keys(targets), ...plans.map((p) => String(p.year))]);
    projects.forEach((p) => {
      const y = signYear(p);
      if (y) s.add(y);
      p.actual.forEach((r) => s.add(r.month.slice(0, 4)));
    });
    return [...s].filter(Boolean).sort().reverse();
  }, [projects, targets, plans, thisYear]);
  const [year, setYear] = useState(thisYear);
  const [metric, setMetric] = useState<Metric>('revenue');
  const [view, setView] = useState<'month' | 'division'>('month');
  const [cashDiv, setCashDiv] = useState<string>('');
  const [sevFilter, setSevFilter] = useState<Severity | ''>('');
  const [hideDone, setHideDone] = useState(true);
  const [issueStatus, setIssueStatus] = useState<Record<string, IssueStatus>>({});

  const cutoff = useMemo(() => cutoffFor(projects, year), [projects, year]);
  const from = `${year}-01`;
  const to = cutoff && cutoff.startsWith(year) ? cutoff : cutoff && cutoff.slice(0, 4) > year ? `${year}-12` : '';
  const recAsOf = cutoff && cutoff.slice(0, 4) >= year ? cutoff : '';

  // ---- 1. Mục tiêu / Kế hoạch năm -------------------------------------------------
  const goal = useMemo(() => {
    const yPlans = plans.filter((p) => String(p.year) === year && p.status !== 'Từ chối');
    const planByDiv: Record<string, number> = {};
    let source: string;
    if (yPlans.length) {
      yPlans.forEach((p) => (planByDiv[p.division] = (planByDiv[p.division] || 0) + p.rows.reduce((s, r) => s + (r.value || 0), 0) * 1e6));
      source = 'Theo hồ sơ màn Mục tiêu kinh doanh';
    } else {
      Object.entries(targets[year] || ({} as Record<string, number>)).forEach(([d, v]) => (planByDiv[d] = Number(v)));
      source = 'Theo mục tiêu ký HĐ của khối';
    }
    const inYear = projects.filter((p) => signYear(p) === year && p.status !== 'Pending');
    const estByDiv: Record<string, number> = {};
    const signByDiv: Record<string, number> = {};
    inYear.forEach((p) => {
      if (hasPakd(p)) estByDiv[p.division] = (estByDiv[p.division] || 0) + (p.expectedRevenue || 0);
      if (p.contractSigned) signByDiv[p.division] = (signByDiv[p.division] || 0) + (p.contract?.value ?? p.expectedRevenue ?? 0);
    });
    const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);
    const divs = DIVISIONS.filter((d) => planByDiv[d] || estByDiv[d] || signByDiv[d]);
    return { plan: sum(planByDiv), est: sum(estByDiv), signed: sum(signByDiv), planByDiv, estByDiv, signByDiv, divs, source };
  }, [plans, targets, projects, year]);

  // ---- 2. Công nợ phải thu ---------------------------------------------------------
  const recs = useMemo(
    () => (recAsOf ? projects.map((p) => ({ p, rec: receivableOf(p, recAsOf) })).filter((x) => x.rec.total > 0.5) : []),
    [projects, recAsOf],
  );
  const recTotal = useMemo(() => recs.reduce((a, x) => addRec(a, x.rec), emptyRec()), [recs]);
  const recByDiv = useMemo(() => {
    const m = new Map<string, Receivable>();
    recs.forEach(({ p, rec }) => m.set(p.division, addRec(m.get(p.division) || emptyRec(), rec)));
    return [...m.entries()].map(([label, rec]) => ({ label, rec })).sort((a, b) => b.rec.total - a.rec.total);
  }, [recs]);
  const recByCus = useMemo(() => {
    const m = new Map<string, Receivable>();
    recs.forEach(({ p, rec }) => m.set(p.customerName, addRec(m.get(p.customerName) || emptyRec(), rec)));
    return [...m.entries()].map(([label, rec]) => ({ label, rec })).sort((a, b) => b.rec.total - a.rec.total);
  }, [recs]);

  // ---- 3. Vấn đề tồn đọng ----------------------------------------------------------
  const issues = useMemo(() => detectIssues(projects, latestActualMonth(projects)), [projects]);
  const statusOf = (i: Issue) => issueStatus[i.id] || 'Chưa xử lý';
  const openIssues = issues.filter((i) => statusOf(i) !== 'Đã xử lý');
  const sevCount = (s: Severity) => openIssues.filter((i) => i.severity === s).length;
  const shownIssues = issues.filter((i) => (!sevFilter || i.severity === sevFilter) && (!hideDone || statusOf(i) !== 'Đã xử lý'));

  // ---- 4. Doanh thu, chi phí, lợi nhuận ---------------------------------------------
  const fin = useMemo(() => {
    const act = to ? projects.reduce((a, p) => addFin(a, finOf(p.actual, from, to)), emptyFin()) : emptyFin();
    const plan = to ? projects.reduce((a, p) => addFin(a, finOf(p.plan, from, to)), emptyFin()) : emptyFin();
    return { act, plan };
  }, [projects, from, to]);
  const pick = (f: Fin, m: Metric) => f[m];
  const chart = useMemo(() => {
    if (view === 'month') {
      const cats = MONTHS.map((m) => `T${+m}`);
      const plan = MONTHS.map((m) => pick(projects.reduce((a, p) => addFin(a, finOf(p.plan, `${year}-${m}`, `${year}-${m}`)), emptyFin()), metric));
      const act = MONTHS.map((m) =>
        to && `${year}-${m}` <= to ? pick(projects.reduce((a, p) => addFin(a, finOf(p.actual, `${year}-${m}`, `${year}-${m}`)), emptyFin()), metric) : null,
      );
      return { cats, titles: MONTHS.map((m) => `Tháng ${m}/${year}`), plan, act };
    }
    const cats = DIVISIONS;
    const plan = cats.map((d) => (to ? pick(projects.filter((p) => p.division === d).reduce((a, p) => addFin(a, finOf(p.plan, from, to)), emptyFin()), metric) : 0));
    const act = cats.map((d) => (to ? pick(projects.filter((p) => p.division === d).reduce((a, p) => addFin(a, finOf(p.actual, from, to)), emptyFin()), metric) : null));
    return { cats, titles: cats.map((d) => `Khối ${d}${to ? ` · ${my(from)} – ${my(to)}` : ''}`), plan, act };
  }, [view, metric, projects, year, from, to]);

  // ---- 5. Dòng tiền theo khối --------------------------------------------------------
  const cashMonths = to ? MONTHS.map((m) => `${year}-${m}`).filter((m) => m <= to) : [];
  const cashRows = useMemo(
    () =>
      DIVISIONS.map((d) => ({
        d,
        f: to ? projects.filter((p) => p.division === d).reduce((a, p) => addFin(a, finOf(p.actual, from, to)), emptyFin()) : emptyFin(),
      })),
    [projects, from, to],
  );
  const cashTotal = cashRows.reduce((a, r) => addFin(a, r.f), emptyFin());
  const cashSeries = useMemo(() => {
    const scope = projects.filter((p) => !cashDiv || p.division === cashDiv);
    const per = cashMonths.map((m) => scope.reduce((a, p) => addFin(a, finOf(p.actual, m, m)), emptyFin()));
    return { inn: per.map((f) => f.cashIn), out: per.map((f) => f.cost), net: per.map((f) => f.net) };
  }, [projects, cashDiv, cashMonths.join()]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- 6. Top --------------------------------------------------------------------------
  const perf = useMemo(
    () => (to ? projects.map((p) => ({ p, f: finOf(p.actual, from, to) })).filter((x) => x.f.revenue > 0 || x.f.cost > 0) : []),
    [projects, from, to],
  );
  const topGood = [...perf].filter((x) => x.f.revenue > 0).sort((a, b) => b.f.profit - a.f.profit).slice(0, 5);
  const topBadCash = [...perf].sort((a, b) => a.f.net - b.f.net).slice(0, 5);
  const topRecProj = [...recs].sort((a, b) => b.rec.total - a.rec.total).slice(0, 10);
  const topRecCus = recByCus.slice(0, 10);

  const ratio = (a: number, b: number) => (b ? a / b : null);
  const revK = ratio(fin.act.revenue, fin.plan.revenue);
  const costK = ratio(fin.act.cost, fin.plan.cost);
  const profitK = ratio(fin.act.profit, fin.plan.profit);
  const m = marginOf(fin.act);
  const overdueShare = recTotal.total ? recTotal.overdue / recTotal.total : 0;
  const metricLabel = METRICS.find((x) => x.key === metric)!.label;
  const netCls = (v: number) => (v < 0 ? 'text-rose-600' : 'text-emerald-700');

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['Quản trị dự án & Tài chính', 'Tổng quan']}
        title="Tổng quan"
        actions={
          <label className="flex items-center gap-2 text-[12.5px] text-slate-600">
            Năm
            <select value={year} onChange={(e) => setYear(e.target.value)} className={`${erp.input} w-40 font-semibold`}>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y === thisYear ? `${y} (năm nay)` : y}
                </option>
              ))}
            </select>
          </label>
        }
        meta={[
          { label: 'ĐVT', value: 'VNĐ' },
          { label: 'Số liệu thực tế đến', value: to ? my(to) : 'Chưa có số thực tế' },
          { label: 'Công nợ tính tại', value: recAsOf ? dmy(endOfMonth(recAsOf)) : '—' },
        ]}
      />

      {/* ===== Hàng 1 ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
        <Panel title="Mục tiêu đã xác lập / Kế hoạch năm" icon={Target} className="xl:col-span-6" actions={<span className="text-[12px] font-semibold text-slate-600">Năm {year}</span>}>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Kế hoạch năm', v: goal.plan, sub: goal.source, cls: 'text-slate-900' },
              { label: 'Đã xác lập', v: goal.est, sub: 'Giá trị HĐ dự kiến của dự án đã lập PAKD', cls: 'text-[#1f5fa8]' },
              { label: 'Hoàn thành (đã ký)', v: goal.signed, sub: 'Tổng giá trị HĐ đã ký', cls: 'text-emerald-700' },
            ].map((x) => (
              <div key={x.label} className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{x.label}</p>
                <p className={`text-[17px] font-bold tabular-nums leading-tight mt-0.5 whitespace-nowrap ${x.cls}`}>{tr(x.v)}</p>
                <p className="text-[11.5px] text-slate-500 leading-snug">{x.sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
            <GoalRing plan={goal.plan} est={goal.est} signed={goal.signed} />
            <div className="overflow-x-auto">
              <table className={erp.table}>
                <thead>
                  <tr>
                    {['Khối', 'Kế hoạch', 'Đã xác lập', 'Đã ký', '% ký'].map((h, i) => (
                      <th key={h} className={`${erp.th} !px-1.5 ${i ? 'text-right' : 'text-left'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {goal.divs.map((d) => (
                    <tr key={d} className={erp.tr}>
                      <td className={`${erp.td} !px-1.5 font-semibold`}>{d}</td>
                      <td className={`${erp.td} !px-1.5 ${erp.num}`}>{tr(goal.planByDiv[d] || 0)}</td>
                      <td className={`${erp.td} !px-1.5 ${erp.num}`}>{tr(goal.estByDiv[d] || 0)}</td>
                      <td className={`${erp.td} !px-1.5 ${erp.num}`}>{tr(goal.signByDiv[d] || 0)}</td>
                      <td className={`${erp.td} !px-1.5 ${erp.num}`}>{goal.planByDiv[d] ? pct((goal.signByDiv[d] || 0) / goal.planByDiv[d], 0) : '—'}</td>
                    </tr>
                  ))}
                  {!goal.divs.length && (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 text-center text-slate-400 italic">
                        Chưa có mục tiêu / dự án cho năm {year}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Panel>

        <Panel title="Công nợ phải thu" icon={Wallet} className="xl:col-span-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Tổng</p>
          <p className="text-[24px] font-bold tabular-nums text-slate-900 leading-tight">{tr(recTotal.total)}</p>
          <p className="text-[11.5px] text-slate-500">VNĐ</p>
          <div className="flex h-3 gap-[2px] mt-3">
            {recTotal.overdue > 0 && <div className="rounded-l-[3px] last:rounded-r-[3px]" style={{ flex: recTotal.overdue, background: C.overdue }} />}
            {recTotal.inTerm > 0 && <div className="first:rounded-l-[3px] rounded-r-[3px]" style={{ flex: recTotal.inTerm, background: C.blue }} />}
            {!recTotal.total && <div className="flex-1 rounded-[3px]" style={{ background: C.track }} />}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-[12px]">
            <div>
              <p className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: C.overdue }} /> Quá hạn
              </p>
              <p className="font-bold tabular-nums text-[14px] text-slate-900">{tr(recTotal.overdue)}</p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: C.blue }} /> Trong hạn
              </p>
              <p className="font-bold tabular-nums text-[14px] text-slate-900">{tr(recTotal.inTerm)}</p>
            </div>
          </div>
          <p className="mt-2 px-2 py-1 rounded-[3px] bg-slate-100 text-[12px] text-slate-700">
            Quá hạn chiếm <b className="text-slate-900">{pct(overdueShare)}</b> tổng công nợ
          </p>
          <div className="mt-2 divide-y divide-slate-200 border-y border-slate-200">
            {AGING.map((a) => (
              <div key={a.key} className="flex items-center gap-2 py-1.5 text-[12px]">
                <span className="w-2.5 h-2.5 rounded-[2px] shrink-0" style={{ background: a.color }} />
                <span className="text-slate-600">{a.label}</span>
                <span className="ml-auto font-semibold tabular-nums text-slate-900">{tr(recTotal[a.key])}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Hạn thanh toán = cuối tháng ghi nhận doanh thu + {PAYMENT_TERM_DAYS} ngày</p>
        </Panel>

        <Panel title="Vấn đề tồn đọng" icon={AlertTriangle} className="xl:col-span-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Tổng</p>
          <div className="flex items-center gap-4 mt-1">
            <Donut
              parts={SEVERITIES.map((s) => ({ key: s, value: sevCount(s), color: SEV_COLOR[s] }))}
              center={
                <>
                  <span className="text-[20px] font-bold text-slate-900 tabular-nums">{openIssues.length}</span>
                  <span className="text-[11px] text-slate-500">vấn đề</span>
                </>
              }
            />
            <div className="flex-1 space-y-1">
              {SEVERITIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSevFilter(sevFilter === s ? '' : s);
                    document.getElementById('ov-issues')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`w-full flex items-center gap-2 px-1.5 py-1 rounded-[3px] text-[12.5px] cursor-pointer hover:bg-slate-100 ${sevFilter === s ? 'bg-slate-100 ring-1 ring-slate-300' : ''}`}
                  title="Lọc danh sách vấn đề theo mức độ"
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: SEV_COLOR[s] }} />
                  <span className="text-slate-700">{s === 'Cao' ? 'Mức độ cao' : s}</span>
                  <span className="ml-auto font-bold tabular-nums text-slate-900">{sevCount(s)}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">Theo loại</p>
            <div className="flex flex-wrap gap-1">
              {[...new Set(openIssues.map((i) => i.type))].map((t) => (
                <span key={t} className="px-1.5 py-0.5 rounded-[3px] border border-slate-200 bg-slate-50 text-[11.5px] text-slate-600">
                  {t} <b className="text-slate-800">{openIssues.filter((i) => i.type === t).length}</b>
                </span>
              ))}
              {!openIssues.length && <span className="text-[12px] text-slate-400">Không có vấn đề tồn đọng</span>}
            </div>
          </div>
        </Panel>
      </div>

      {/* ===== Hàng 2: Doanh thu, chi phí, lợi nhuận ===== */}
      <Panel
        title="Doanh thu, chi phí, lợi nhuận"
        icon={BarChart3}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              options={[
                { key: 'month', label: 'Theo tháng' },
                { key: 'division', label: 'Theo khối' },
              ]}
              value={view}
              onChange={setView}
            />
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Chọn chỉ tiêu
              <select value={metric} onChange={(e) => setMetric(e.target.value as Metric)} className={`${erp.input} w-32`}>
                {METRICS.map((x) => (
                  <option key={x.key} value={x.key}>
                    {x.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        }
        footer={to ? `Thực tế ${my(from)} – ${my(to)} so với kế hoạch cùng kỳ · ĐVT: VNĐ` : `Năm ${year} chưa có số thực tế`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiBox
            label="Doanh thu"
            value={tr(fin.act.revenue)}
            valueText={tr(fin.act.revenue)}
            tone={revK === null ? 'neutral' : revK >= 0.95 ? 'good' : revK <= 0.85 ? 'bad' : 'neutral'}
            badge={revK === null ? undefined : `${Math.round(revK * 100)}% KH`}
            sub={`Kế hoạch cùng kỳ ${tr(fin.plan.revenue)}`}
          />
          <KpiBox
            label="Chi phí"
            value={tr(fin.act.cost)}
            valueText={tr(fin.act.cost)}
            tone={costK === null ? 'neutral' : costK <= 1 ? 'good' : costK >= 1.1 ? 'bad' : 'neutral'}
            badge={costK === null ? undefined : `${Math.round(costK * 100)}% KH`}
            sub={`Kế hoạch cùng kỳ ${tr(fin.plan.cost)}`}
          />
          <KpiBox
            label="Lợi nhuận"
            value={<span className={fin.act.profit < 0 ? 'text-rose-600' : ''}>{tr(fin.act.profit)}</span>}
            valueText={tr(fin.act.profit)}
            tone={profitK === null ? 'neutral' : profitK >= 1 ? 'good' : profitK < 0.85 ? 'bad' : 'neutral'}
            badge={profitK === null ? undefined : `${Math.round(profitK * 100)}% KH`}
            sub={`Kế hoạch cùng kỳ ${tr(fin.plan.profit)}`}
          />
          <KpiBox
            label="Biên lợi nhuận"
            value={pct(m)}
            tone={m === null ? 'neutral' : m >= MIN_MARGIN ? 'good' : 'bad'}
            badge={m === null ? undefined : m >= MIN_MARGIN ? '▲ Đạt' : '! Dưới khung'}
            sub={`Kế hoạch ${pct(marginOf(fin.plan))} · khung tối thiểu ${MIN_MARGIN * 100}%`}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 mb-1">
          <p className="text-[12.5px] font-semibold text-slate-700">
            {metricLabel} {view === 'month' ? `theo tháng năm ${year}` : 'theo khối (cùng kỳ)'}
          </p>
          <Legend
            items={[
              { color: C.orange, label: 'Kế hoạch' },
              { color: C.blue, label: 'Thực tế' },
            ]}
          />
        </div>
        <ColumnChart
          categories={chart.cats}
          titles={chart.titles}
          series={[
            { name: 'Kế hoạch', color: C.orange, values: chart.plan },
            { name: 'Thực tế', color: C.blue, values: chart.act },
          ]}
        />
      </Panel>

      {/* ===== Hàng 3: Công nợ theo khối / khách hàng ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {[
          { title: 'Công nợ phải thu theo khối (lớn đến nhỏ)', icon: Landmark, rows: recByDiv },
          { title: 'Công nợ phải thu theo khách hàng (lớn đến nhỏ)', icon: Users, rows: recByCus.slice(0, 8) },
        ].map((x) => (
          <Panel
            key={x.title}
            title={x.title}
            icon={x.icon}
            actions={
              <Legend
                items={[
                  { color: C.blue, label: 'Trong hạn' },
                  { color: C.overdue, label: 'Quá hạn' },
                ]}
              />
            }
            footer={x.rows === recByDiv ? 'ĐVT: VNĐ' : `ĐVT: VNĐ · ${recByCus.length > 8 ? `8/${recByCus.length} khách hàng lớn nhất` : `${recByCus.length} khách hàng`}`}
          >
            <HBarList rows={x.rows} empty="Không có công nợ phải thu" />
          </Panel>
        ))}
      </div>

      {/* ===== Hàng 4: Dòng tiền theo khối ===== */}
      <Panel title="Dòng tiền theo khối qua các tháng" icon={Waves} footer="Dòng tiền ròng = tiền thu − tiền chi · ĐVT: VNĐ · Bấm một khối trong bảng để xem riêng khối đó">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="flex-[3] min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <p className="text-[12.5px] font-semibold text-slate-700">{cashDiv ? `Khối ${cashDiv}` : 'Tất cả các khối'}</p>
              <Legend
                items={[
                  { color: C.blue, label: 'Tiền thu' },
                  { color: C.orange, label: 'Tiền chi' },
                  { color: C.line, label: 'Dòng tiền ròng', line: true },
                ]}
              />
            </div>
            {cashMonths.length ? (
              <ColumnChart
                categories={cashMonths.map((x) => `T${+x.slice(5)}`)}
                titles={cashMonths.map((x) => `Tháng ${my(x)}${cashDiv ? ` · ${cashDiv}` : ''}`)}
                series={[
                  { name: 'Tiền thu', color: C.blue, values: cashSeries.inn },
                  { name: 'Tiền chi', color: C.orange, values: cashSeries.out },
                ]}
                line={{ name: 'Dòng tiền ròng', color: C.line, values: cashSeries.net }}
                height={260}
              />
            ) : (
              <p className="py-16 text-center text-slate-400 text-[12.5px]">Năm {year} chưa có số thực tế</p>
            )}
          </div>
          <div className="flex-[2] min-w-[320px]">
            <table className={erp.table}>
              <thead>
                <tr>
                  {['Khối', 'Tiền thu', 'Tiền chi', 'Dòng tiền ròng'].map((h, i) => (
                    <th key={h} className={`${erp.th} ${i ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cashRows.map(({ d, f }) => (
                  <tr
                    key={d}
                    onClick={() => setCashDiv(cashDiv === d ? '' : d)}
                    className={`${erp.tr} cursor-pointer ${cashDiv === d ? '!bg-[#dcebfb] font-semibold' : ''}`}
                    title="Xem dòng tiền của khối"
                  >
                    <td className={erp.td}>{d}</td>
                    <td className={`${erp.td} ${erp.num}`}>{tr(f.cashIn)}</td>
                    <td className={`${erp.td} ${erp.num}`}>{tr(f.cost)}</td>
                    <td className={`${erp.td} ${erp.num} font-semibold ${netCls(f.net)}`}>{tr(f.net)}</td>
                  </tr>
                ))}
                <tr className={`${erp.totalRow} cursor-pointer`} onClick={() => setCashDiv('')} title="Xem tất cả các khối">
                  <td className={erp.td}>TỔNG</td>
                  <td className={`${erp.td} ${erp.num}`}>{tr(cashTotal.cashIn)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{tr(cashTotal.cost)}</td>
                  <td className={`${erp.td} ${erp.num} ${netCls(cashTotal.net)}`}>{tr(cashTotal.net)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Panel>

      {/* ===== Hàng 5: Top 5 ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <Panel title="Top 5 dự án hiệu quả" icon={Trophy} noPad footer="Xếp theo lợi nhuận thực tế trong năm · ĐVT: VNĐ">
          <RankTable
            head={[{ label: 'Dự án' }, { label: 'Khối' }, { label: 'Doanh thu', num: true }, { label: 'Lợi nhuận', num: true }, { label: 'Biên', num: true }]}
            rows={topGood.map(({ p, f }) => [
              <ProjCell p={p} />,
              p.division,
              tr(f.revenue),
              <span className={netCls(f.profit)}>{tr(f.profit)}</span>,
              pct(marginOf(f)),
            ])}
            empty="Chưa có số thực tế"
          />
        </Panel>
        <Panel title="Top 5 dự án có dòng tiền xấu" icon={TrendingDown} noPad footer="Xếp theo dòng tiền ròng thấp nhất · ĐVT: VNĐ">
          <RankTable
            head={[{ label: 'Dự án' }, { label: 'Khối' }, { label: 'Tiền thu', num: true }, { label: 'Tiền chi', num: true }, { label: 'Dòng tiền ròng', num: true }]}
            rows={topBadCash.map(({ p, f }) => [<ProjCell p={p} />, p.division, tr(f.cashIn), tr(f.cost), <b className={netCls(f.net)}>{tr(f.net)}</b>])}
            empty="Chưa có số thực tế"
          />
        </Panel>
      </div>

      {/* ===== Hàng 6: Top 10 công nợ ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <Panel title="Top 10 dự án có công nợ phải thu cao" icon={Wallet} noPad footer="ĐVT: VNĐ">
          <RankTable
            head={[{ label: 'Dự án' }, { label: 'Khối' }, { label: 'Công nợ', num: true }, { label: 'Quá hạn', num: true }, { label: '% QH', num: true }]}
            rows={topRecProj.map(({ p, rec }) => [
              <ProjCell p={p} />,
              p.division,
              tr(rec.total),
              <span className={rec.overdue > 0 ? 'text-rose-600 font-semibold' : ''}>{tr(rec.overdue)}</span>,
              pct(rec.total ? rec.overdue / rec.total : 0),
            ])}
            empty="Không có công nợ phải thu"
          />
        </Panel>
        <Panel title="Top 10 khách hàng có công nợ phải thu cao" icon={Users} noPad footer="ĐVT: VNĐ">
          <RankTable
            head={[{ label: 'Khách hàng' }, { label: 'Công nợ', num: true }, { label: 'Quá hạn', num: true }, { label: '% quá hạn', num: true }]}
            rows={topRecCus.map(({ label, rec }) => [
              <span className="block max-w-[210px] truncate" title={label}>
                {label}
              </span>,
              tr(rec.total),
              <span className={rec.overdue > 0 ? 'text-rose-600 font-semibold' : ''}>{tr(rec.overdue)}</span>,
              pct(rec.total ? rec.overdue / rec.total : 0),
            ])}
            empty="Không có công nợ phải thu"
          />
        </Panel>
      </div>

      {/* ===== Hàng 7: Vấn đề cần xử lý ===== */}
      <div id="ov-issues" className="scroll-mt-4">
        <Panel
          title="Các vấn đề cần xử lý (xếp theo mức độ nghiêm trọng)"
          icon={ListChecks}
          noPad
          actions={
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <select value={sevFilter} onChange={(e) => setSevFilter(e.target.value as Severity | '')} className={`${erp.input} w-36`}>
                <option value="">Tất cả mức độ</option>
                {SEVERITIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} className="accent-[#1f5fa8]" />
                Ẩn vấn đề đã xử lý
              </label>
            </div>
          }
          footer={
            <details>
              <summary className="cursor-pointer">Mức độ cao xếp trước, cùng mức thì xếp theo số ngày quá hạn xử lý · Quy tắc phát hiện vấn đề</summary>
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                {RULES.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </details>
          }
        >
          <div className="overflow-x-auto">
            <table className={erp.table}>
              <thead>
                <tr>
                  {['#', 'Vấn đề', 'Khối', 'Loại', 'Mức độ', 'Hạn xử lý', 'Quá hạn', 'Người phụ trách', 'Trạng thái'].map((h, i) => (
                    <th key={h} className={`${erp.th} border-t-0 ${i === 0 ? 'w-8 text-center border-l-0' : 'text-left'} ${i === 8 ? 'border-r-0' : ''} ${h === 'Quá hạn' ? '!text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shownIssues.map((it, i) => {
                  const st = statusOf(it);
                  return (
                    <tr key={it.id} className={`${erp.tr} ${st === 'Đã xử lý' ? 'opacity-60' : ''}`}>
                      <td className={`${erp.td} text-center text-slate-500 border-l-0`}>{i + 1}</td>
                      <td className={`${erp.td} min-w-[260px]`}>
                        <p className="font-medium text-slate-800">{it.title}</p>
                        <p className="text-[11.5px] text-slate-500">
                          <span className="font-mono text-[#1f5fa8]">{it.code || '—'}</span> · {it.projectName}
                        </p>
                      </td>
                      <td className={erp.td}>{it.division}</td>
                      <td className={`${erp.td} whitespace-nowrap`}>{it.type}</td>
                      <td className={`${erp.td} whitespace-nowrap`}>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: SEV_COLOR[it.severity] }} />
                          {it.severity}
                        </span>
                      </td>
                      <td className={`${erp.td} whitespace-nowrap tabular-nums`}>{dmy(it.due)}</td>
                      <td className={`${erp.td} ${erp.num}`}>{it.overdueDays > 0 ? <b className="text-rose-600">{it.overdueDays} ngày</b> : <span className="text-slate-400">—</span>}</td>
                      <td className={`${erp.td} whitespace-nowrap`}>{it.owner}</td>
                      <td className={`${erp.td} border-r-0 py-1`}>
                        <select
                          value={st}
                          onChange={(e) => setIssueStatus((s) => ({ ...s, [it.id]: e.target.value as IssueStatus }))}
                          className={`${erp.input} h-7 w-[118px] ${st === 'Đã xử lý' ? 'text-emerald-700' : st === 'Đang xử lý' ? 'text-[#1f5fa8]' : ''}`}
                        >
                          {ISSUE_STATUSES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
                {!shownIssues.length && (
                  <tr>
                    <td colSpan={9} className="px-3 py-6 text-center text-slate-400 italic">
                      Không có vấn đề cần xử lý
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </ErpPage>
  );
};
