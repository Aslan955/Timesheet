/**
 * BizReportPage — "Báo cáo hiệu quả dự án" (theo mẫu Excel "Gửi đội Phát triển").
 *
 * 2 tab theo 2 sheet của mẫu:
 *  1. Tổng quan cả khối / công ty
 *     – Kỳ báo cáo (Từ tháng → Đến tháng), Phạm vi xem (Toàn công ty / khối), Chốt số đến.
 *     – 5 ô số: Biên lợi nhuận gộp, Doanh thu, Chi phí, Dòng tiền thu, Khối lượng công việc
 *       (số to = thực tế, dưới = kế hoạch & % hoàn thành; dưới KH đỏ, trên KH xanh —
 *       riêng Chi phí đảo chiều vì vượt KH là xấu).
 *     – Biểu đồ cột Kế hoạch vs Thực tế của chỉ tiêu đang chọn (theo tháng / theo dự án).
 *       Chỉ tiêu đầu tiên "Tổng quan": Doanh thu, Chi phí (cột) + Lợi nhuận = DT − CP (đường), chọn Thực tế / Kế hoạch.
 *     – Bảng dự án: KH / TT / Chênh lệch từng chỉ tiêu + Sức khoẻ, lọc theo mức sức khoẻ.
 *  2. Tổng quan dự án
 *     – Chọn dự án + chỉ tiêu; 5 ô: Tổng KH cả vòng đời, Luỹ kế KH / TT đến kỳ chốt,
 *       Còn lại theo KH, Mức thực hiện luỹ kế; bảng số liệu từng tháng + luỹ kế.
 *
 * Bấm vào con số Dòng tiền thu / Chi phí thực tế → LedgerDetailModal (các dòng sổ kế toán tạo nên số đó).
 * Kế toán import sổ chi tiết (dòng tiền thu, chi thực tế) qua nút "Import sổ kế toán" → LedgerImportModal.
 *
 * Giao diện: khung kiểu phần mềm kế toán (src/components/erp/Erp.tsx).
 * Tính toán: src/business/bizReport.ts. ĐVT tiền: VNĐ.
 */
import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ClipboardList, FileUp, BarChart3, Building2, CheckCircle2, AlertTriangle, Eye, CircleDashed, FolderKanban, Filter, Table2, BookOpen, Check } from 'lucide-react';
import { LedgerDetailModal, LedgerDrill, drillCls } from './LedgerDetailModal';
import { LedgerImportModal } from './LedgerImportModal';
import { BizProject, DIVISIONS, latestActualMonth, useBusinessProjects } from '../business/BusinessProjectContext';
import {
  CostParts,
  costParts,
  HEALTHS,
  HEALTH_RULES,
  Health,
  MonthPoint,
  REPORT_METRICS,
  ReportMetric,
  Totals,
  addTotals,
  lowerIsBetter,
  margin,
  monthlySeries,
  projectMonthRange,
  projectPerf,
  ratio,
} from '../business/bizReport';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, KpiBox, Panel, Segmented, Tag, Tone, erp } from './erp/Erp';

// Categorical slot 1 / 2 (đã chạy validate_palette: PASS)
const SERIES = { plan: '#2a78d6', actual: '#eb6834' };
// Chỉ tiêu "Tổng quan": DT = slot 1, CP = slot 2, LN = slot 3 (3 slot đầu validate all-pairs)
const PNL = { revenue: '#2a78d6', cost: '#eb6834', profit: '#1baf7a' };

const fmtMonth = (m: string) => (m ? `${m.slice(5, 7)}/${m.slice(0, 4)}` : '—');
const dmy = (iso: string) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '—');
const isMoney = (k: ReportMetric) => REPORT_METRICS.find((m) => m.key === k)!.money;
const val = (_k: ReportMetric, n: number) => Math.round(n).toLocaleString('en-US');
/** Tooltip tách Chi phí thực tế = Chi thực tế import (SX + KD + Chi phí chung) + CP phân bổ khối + CP quản lý (Kế toán import theo dự án). */
const costTipOf = (c: CostParts) =>
  `Chi thực tế import (SX + KD + Chi phí chung): ${val('cost', c.direct)}\n+ CP quản lý: ${val('cost', c.mgmt)}\n+ CP phân bổ (vận hành): ${val('cost', c.alloc)}\n= Chi phí thực tế: ${val('cost', c.direct + c.alloc + c.mgmt)}`;
const pct = (r: number | null, digits = 0) => (r === null ? '—' : `${(r * 100).toFixed(digits)}%`);
const unitOf = (k: ReportMetric) => (isMoney(k) ? 'VNĐ' : 'SP');

/** Chỉ tiêu có sổ chi tiết kế toán để xem khi bấm vào số thực tế. */
const ledgerKindOf = (k: ReportMetric): LedgerDrill['kind'] | null => (k === 'revenue' ? 'revenue' : k === 'cashIn' ? 'cashIn' : k === 'cost' ? 'cost' : null);
type OnDrill = (d: LedgerDrill) => void;

/** Con số thực tế: bấm được khi chỉ tiêu có sổ chi tiết. */
const DrillVal: React.FC<{ k: ReportMetric; value: number; onClick?: () => void }> = ({ k, value, onClick }) =>
  onClick && ledgerKindOf(k) && value ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`font-[inherit] ${drillCls}`}
      title="Xem chi tiết sổ kế toán"
    >
      {val(k, value)}
    </button>
  ) : (
    <>{val(k, value)}</>
  );

/** Tốt khi thực tế ≥ KH (chi phí: ≤ KH). */
const goodTone = (k: ReportMetric, actual: number, plan: number) => (lowerIsBetter(k) ? actual <= plan : actual >= plan);
const toneOf = (k: ReportMetric, actual: number, plan: number): Tone => (plan ? (goodTone(k, actual, plan) ? 'good' : 'bad') : 'neutral');

const HEALTH_STYLE: Record<Health, { cls: string; icon: React.ElementType }> = {
  'Tốt': { cls: 'bg-emerald-50 text-emerald-700 border-emerald-300', icon: CheckCircle2 },
  'Cần chú ý': { cls: 'bg-rose-50 text-rose-700 border-rose-300', icon: AlertTriangle },
  'Theo dõi': { cls: 'bg-amber-50 text-amber-700 border-amber-300', icon: Eye },
  'Chưa phát sinh': { cls: 'bg-slate-100 text-slate-500 border-slate-300', icon: CircleDashed },
};
const HealthBadge: React.FC<{ h: Health }> = ({ h }) => (
  <Tag cls={HEALTH_STYLE[h].cls} icon={HEALTH_STYLE[h].icon}>
    {h}
  </Tag>
);

const METRIC_OPTIONS = REPORT_METRICS.map((m) => ({ key: m.key, label: m.label }));

/** Nhãn + ô lọc trên cùng 1 dòng. */
const FilterField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex items-center gap-2">
    <span className="text-[12px] text-slate-600 whitespace-nowrap">{label}</span>
    {children}
  </label>
);
/** Ô lọc dạng nhãn trên – ô nhập dưới, dùng trong dải lọc (FilterBar). */
const FilterCell: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className = '' }) => (
  // Nhãn nằm cùng hàng bên trái ô nhập — gọn, tốn ít chiều cao
  <label className={`flex items-center gap-1.5 min-w-0 ${className}`}>
    <span className="text-[12px] text-slate-600 whitespace-nowrap">{label}</span>
    {children}
  </label>
);
/** Dải lọc một hàng, nền xám nhạt, gọn (cao ~40px). Ô lọc dùng cỡ nhỏ (h-7). */
const FilterBar: React.FC<{ children: React.ReactNode; right?: React.ReactNode }> = ({ children, right }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border border-slate-200 rounded-[4px] [&_input]:h-7 [&_select]:h-7 [&_input]:text-[12px] [&_select]:text-[12px]">
    <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300 whitespace-nowrap">
      <Filter size={13} className="text-[#1f5fa8]" /> Lọc
    </span>
    {children}
    {right && <span className="ml-auto flex items-center gap-2">{right}</span>}
  </div>
);

// ==========================================================================
// Page
// ==========================================================================
export const BizReportPage: React.FC<{ onNavigate?: (item: string) => void }> = ({ onNavigate }) => {
  const { projects } = useBusinessProjects();
  const cutoff = useMemo(() => latestActualMonth(projects), [projects]);
  const [tab, setTab] = useState<'overview' | 'project'>('overview');
  const [projectId, setProjectId] = useState<string>(() => projects.find((p) => p.actual.length)?.id || projects[0]?.id || '');
  const [drill, setDrill] = useState<LedgerDrill | null>(null);
  const [showLedgerImport, setShowLedgerImport] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['Quản trị dự án & Tài chính', 'Báo cáo hiệu quả dự án']}
        title="Báo cáo hiệu quả dự án"
        actions={
          <>
            {onNavigate && (
              <Btn icon={ClipboardList} onClick={() => onNavigate('Lập kế hoạch khối')} title="Giám đốc khối lập kế hoạch theo tháng cho các dự án của khối">
                Lập kế hoạch khối
              </Btn>
            )}
            <Btn variant="success" icon={FileUp} onClick={() => setShowLedgerImport(true)}>
              Import sổ kế toán
            </Btn>
          </>
        }
        meta={[
          { label: 'Chốt số đến', value: cutoff ? fmtMonth(cutoff) : 'chưa có số thực tế' },
          { label: 'Số dự án', value: projects.length },
        ]}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-5 right-5 z-[130] bg-[#1e3a5f] text-white px-4 py-2.5 rounded-[4px] shadow-lg flex items-center gap-2 text-[12px] font-semibold max-w-md"
          >
            <Check size={14} className="text-emerald-300 shrink-0" /> {toast}
          </motion.div>
        )}
        {showLedgerImport && (
          <LedgerImportModal
            key="ledger-import"
            by="ketoan"
            onClose={() => setShowLedgerImport(false)}
            onDone={(msg) => {
              setShowLedgerImport(false);
              flash(msg);
            }}
          />
        )}
        {drill && <LedgerDetailModal key="ledger-detail" {...drill} onClose={() => setDrill(null)} />}
      </AnimatePresence>

      <FolderTabs
        tabs={[
          { key: 'overview', label: 'Tổng quan cả khối / công ty', icon: Building2 },
          { key: 'project', label: 'Tổng quan dự án', icon: FolderKanban },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'overview' ? (
        <OverviewTab
          projects={projects}
          cutoff={cutoff}
          onDrill={setDrill}
          onOpenProject={(id) => {
            setProjectId(id);
            setTab('project');
          }}
        />
      ) : (
        <ProjectTab projects={projects} cutoff={cutoff} projectId={projectId} onProjectChange={setProjectId} onDrill={setDrill} />
      )}
    </ErpPage>
  );
};

// ==========================================================================
// Ô số liệu
// ==========================================================================
/** Giá trị trong ô số: bấm được nếu có onClick. */
const KpiValue: React.FC<{ text: string; onClick?: () => void }> = ({ text, onClick }) =>
  onClick ? (
    <button type="button" onClick={onClick} className={`font-[inherit] text-left ${drillCls}`} title="Xem chi tiết sổ kế toán">
      {text}
    </button>
  ) : (
    <>{text}</>
  );

const MetricCards: React.FC<{ plan: Totals; actual: Totals; onDrillMetric?: (k: ReportMetric) => void }> = ({ plan, actual, onDrillMetric }) => {
  const mA = margin(actual);
  const mP = margin(plan);
  const mR = mA !== null && mP ? mA / mP - 1 : null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
      <KpiBox
        label="Biên lợi nhuận gộp"
        value={pct(mA, 1)}
        sub={`Kế hoạch ${pct(mP, 1)} · (DT − CP) / DT`}
        badge={mR === null ? undefined : `${mR >= 0 ? '+' : ''}${(mR * 100).toFixed(0)}%`}
        tone={mR === null ? 'neutral' : mR >= 0 ? 'good' : 'bad'}
      />
      {REPORT_METRICS.map(({ key, label }) => {
        const r = ratio(actual[key], plan[key]);
        const text = val(key, actual[key]);
        return (
          <KpiBox
            key={key}
            label={`${label} (${unitOf(key)})`}
            value={<KpiValue text={text} onClick={onDrillMetric && ledgerKindOf(key) && actual[key] ? () => onDrillMetric(key) : undefined} />}
            valueText={text}
            sub={`Kế hoạch ${val(key, plan[key])}`}
            badge={r === null ? undefined : pct(r)}
            tone={toneOf(key, actual[key], plan[key])}
          />
        );
      })}
    </div>
  );
};

// ==========================================================================
// Biểu đồ cột Kế hoạch vs Thực tế
// ==========================================================================
interface ChartGroup {
  key: string;
  label: string;
  plan: number;
  actual: number | null;
}

const niceCeil = (v: number) => {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
};

const ChartLegend: React.FC<{ metric: ReportMetric }> = ({ metric }) => (
  <span className="flex items-center gap-3 text-[11px] text-slate-600">
    {(['plan', 'actual'] as const).map((s) => (
      <span key={s} className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-[2px]" style={{ background: SERIES[s] }} />
        {s === 'plan' ? 'Kế hoạch' : 'Thực tế'}
      </span>
    ))}
    <span className="text-slate-400">ĐVT: {unitOf(metric)}</span>
  </span>
);

const PlanActualChart: React.FC<{ groups: ChartGroup[]; metric: ReportMetric; height?: number }> = ({ groups, metric, height = 230 }) => {
  const [hover, setHover] = useState<number | null>(null);
  const max = niceCeil(Math.max(1, ...groups.map((g) => Math.max(g.plan, g.actual ?? 0))));
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const h = (v: number) => `${Math.max(0, (v / max) * 100)}%`;
  const g = hover !== null ? groups[hover] : null;

  if (!groups.length) return <p className="text-[12px] text-slate-400 py-10 text-center">Không có số liệu trong kỳ.</p>;

  return (
    <div className="flex pt-2">
      {/* Trục Y */}
      <div className="relative w-28 shrink-0" style={{ height }}>
        {ticks.map((t) => (
          <span key={t} className="absolute right-2 text-[10px] text-slate-500 tabular-nums -translate-y-1/2" style={{ bottom: h(t) }}>
            {val(metric, t)}
          </span>
        ))}
      </div>
      <div className="flex-1 overflow-x-auto">
        <div style={{ minWidth: groups.length * 48 }}>
          <div className="relative border-l border-slate-300" style={{ height }}>
            {ticks.map((t) => (
              <div key={t} className={`absolute inset-x-0 border-t ${t === 0 ? 'border-slate-400' : 'border-dashed border-slate-200'}`} style={{ bottom: h(t) }} />
            ))}
            <div className="absolute inset-0 flex">
              {groups.map((gr, i) => (
                <div
                  key={gr.key}
                  className={`flex-1 flex items-end justify-center gap-[2px] cursor-default ${hover === i ? 'bg-[#eaf2fc]' : ''}`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <div className="w-[min(24px,35%)] rounded-t-[3px]" style={{ height: h(gr.plan), background: SERIES.plan }} />
                  {gr.actual !== null && <div className="w-[min(24px,35%)] rounded-t-[3px]" style={{ height: h(gr.actual), background: SERIES.actual }} />}
                </div>
              ))}
            </div>
            {g && (
              <div
                className="absolute top-0 z-10 pointer-events-none bg-white border border-slate-300 rounded-[3px] shadow-md text-[11px] whitespace-nowrap"
                style={{ left: `${((hover! + 0.5) / groups.length) * 100}%`, transform: `translateX(${hover! > groups.length / 2 ? '-105%' : '5%'})` }}
              >
                <p className="font-bold px-2.5 py-1 bg-[#e8edf4] border-b border-slate-300 text-[#1e3a5f]">{g.label}</p>
                <table className="tabular-nums">
                  <tbody>
                    <tr>
                      <td className="px-2.5 py-0.5 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-sm" style={{ background: SERIES.plan }} /> Kế hoạch
                      </td>
                      <td className="px-2.5 py-0.5 text-right font-semibold">{val(metric, g.plan)}</td>
                    </tr>
                    <tr>
                      <td className="px-2.5 py-0.5 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-sm" style={{ background: SERIES.actual }} /> Thực tế
                      </td>
                      <td className="px-2.5 py-0.5 text-right font-semibold">{g.actual === null ? 'chưa chốt số' : val(metric, g.actual)}</td>
                    </tr>
                    {g.actual !== null && (
                      <tr className="border-t border-slate-200">
                        <td className="px-2.5 py-0.5 text-slate-500">Hoàn thành</td>
                        <td className="px-2.5 py-0.5 text-right font-semibold">{pct(ratio(g.actual, g.plan))}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="flex mt-1.5">
            {groups.map((gr) => (
              <span key={gr.key} className="flex-1 text-center text-[10px] text-slate-500 tabular-nums truncate px-0.5" title={gr.label}>
                {gr.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// Biểu đồ "Tổng quan" (lựa chọn đầu trong hàng chỉ tiêu): Doanh thu & Chi phí (cột) + Lợi nhuận (đường)
// ==========================================================================
interface PnlGroup {
  key: string;
  label: string;
  revenue: number | null; // null = chưa chốt số (sau kỳ chốt)
  cost: number | null;
}
const profitOf = (g: PnlGroup) => (g.revenue === null || g.cost === null ? null : g.revenue - g.cost);
const fmtN = (n: number) => Math.round(n).toLocaleString('en-US');

const PnlLegend: React.FC = () => (
  <span className="flex items-center gap-3 text-[11px] text-slate-600">
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-[2px]" style={{ background: PNL.revenue }} /> Doanh thu
    </span>
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-[2px]" style={{ background: PNL.cost }} /> Chi phí
    </span>
    <span className="flex items-center gap-1.5">
      <svg width="22" height="10" className="shrink-0">
        <line x1="1" y1="5" x2="21" y2="5" stroke={PNL.profit} strokeWidth="2" />
        <circle cx="11" cy="5" r="3.5" fill={PNL.profit} stroke="#fff" strokeWidth="1.5" />
      </svg>
      Lợi nhuận (DT − CP)
    </span>
    <span className="text-slate-400">ĐVT: VNĐ</span>
  </span>
);

/** Biểu đồ kết hợp một trục: cột DT, CP từ đường 0; đường LN (có thể âm). */
const PnlChart: React.FC<{ groups: PnlGroup[]; height?: number }> = ({ groups, height = 240 }) => {
  const [hover, setHover] = useState<number | null>(null);
  if (!groups.length) return <p className="text-[12px] text-slate-400 py-10 text-center">Không có số liệu trong kỳ.</p>;

  const vals = groups.flatMap((g) => [g.revenue, g.cost, profitOf(g)]).filter((v): v is number => v !== null);
  const vMin = Math.min(0, ...vals);
  const vMax = Math.max(1, ...vals);
  const step = niceCeil((vMax - vMin) / 4);
  const lo = Math.floor(vMin / step) * step;
  const hi = Math.ceil(vMax / step) * step;
  const ticks: number[] = [];
  for (let t = lo; t <= hi + step / 2; t += step) ticks.push(t);
  const y = (v: number) => ((v - lo) / (hi - lo)) * 100; // % tính từ đáy
  const n = groups.length;
  const x = (i: number) => ((i + 0.5) / n) * 100;

  // Đường lợi nhuận: ngắt đoạn ở tháng chưa chốt số
  const segments: { i: number; v: number }[][] = [];
  groups.forEach((g, i) => {
    const p = profitOf(g);
    if (p === null) return segments.push([]);
    if (!segments.length || !segments[segments.length - 1]) segments.push([]);
    segments[segments.length - 1].push({ i, v: p });
  });

  const bar = (v: number | null, color: string) =>
    v === null ? (
      <div className="w-[min(24px,35%)]" />
    ) : (
      <div className="relative w-[min(24px,35%)] h-full">
        <div
          className={`absolute inset-x-0 ${v >= 0 ? 'rounded-t-[4px]' : 'rounded-b-[4px]'}`}
          style={{ bottom: `${y(Math.min(0, v))}%`, height: `${Math.abs(y(v) - y(0))}%`, background: color }}
        />
      </div>
    );

  const g = hover !== null ? groups[hover] : null;
  const gp = g ? profitOf(g) : null;

  return (
    <div className="flex pt-2">
      {/* Trục Y */}
      <div className="relative w-28 shrink-0" style={{ height }}>
        {ticks.map((t) => (
          <span key={t} className="absolute right-2 text-[10px] text-slate-500 tabular-nums -translate-y-1/2" style={{ bottom: `${y(t)}%` }}>
            {fmtN(t)}
          </span>
        ))}
      </div>
      <div className="flex-1 overflow-x-auto">
        <div style={{ minWidth: n * 56 }}>
          <div className="relative border-l border-slate-300" style={{ height }}>
            {ticks.map((t) => (
              <div key={t} className={`absolute inset-x-0 border-t ${t === 0 ? 'border-slate-500' : 'border-dashed border-slate-200'}`} style={{ bottom: `${y(t)}%` }} />
            ))}
            {/* Cột DT / CP + vùng hover */}
            <div className="absolute inset-0 flex">
              {groups.map((gr, i) => (
                <div
                  key={gr.key}
                  className={`flex-1 flex justify-center gap-[2px] ${hover === i ? 'bg-[#eaf2fc]' : ''}`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  {bar(gr.revenue, PNL.revenue)}
                  {bar(gr.cost, PNL.cost)}
                </div>
              ))}
            </div>
            {/* Đường lợi nhuận */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              {segments
                .filter((sg) => sg.length > 1)
                .map((sg, k) => (
                  <polyline
                    key={k}
                    points={sg.map((pt) => `${x(pt.i)},${100 - y(pt.v)}`).join(' ')}
                    fill="none"
                    stroke={PNL.profit}
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
            </svg>
            {groups.map((gr, i) => {
              const p = profitOf(gr);
              return p === null ? null : (
                <span
                  key={gr.key}
                  className="absolute pointer-events-none rounded-full border-2 border-white"
                  style={{ left: `${x(i)}%`, bottom: `${y(p)}%`, width: hover === i ? 11 : 9, height: hover === i ? 11 : 9, background: PNL.profit, transform: 'translate(-50%, 50%)' }}
                />
              );
            })}
            {g && (
              <div
                className="absolute top-0 z-10 pointer-events-none bg-white border border-slate-300 rounded-[3px] shadow-md text-[11px] whitespace-nowrap"
                style={{ left: `${x(hover!)}%`, transform: `translateX(${hover! > n / 2 ? '-105%' : '5%'})` }}
              >
                <p className="font-bold px-2.5 py-1 bg-[#e8edf4] border-b border-slate-300 text-[#1e3a5f]">{g.label}</p>
                <table className="tabular-nums">
                  <tbody>
                    {([
                      ['Doanh thu', g.revenue, PNL.revenue, false],
                      ['Chi phí', g.cost, PNL.cost, false],
                      ['Lợi nhuận', gp, PNL.profit, true],
                    ] as const).map(([lb, v, c, line]) => (
                      <tr key={lb}>
                        <td className="px-2.5 py-0.5 flex items-center gap-1.5">
                          <span className={line ? 'w-2 h-2 rounded-full' : 'w-2 h-2 rounded-sm'} style={{ background: c }} /> {lb}
                        </td>
                        <td className={`px-2.5 py-0.5 text-right font-semibold ${line && v !== null && v < 0 ? 'text-rose-700' : ''}`}>{v === null ? 'chưa chốt số' : fmtN(v)}</td>
                      </tr>
                    ))}
                    {gp !== null && g.revenue ? (
                      <tr className="border-t border-slate-200">
                        <td className="px-2.5 py-0.5 text-slate-500">Biên lợi nhuận</td>
                        <td className="px-2.5 py-0.5 text-right font-semibold">{((gp / g.revenue) * 100).toFixed(1)}%</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="flex mt-1.5">
            {groups.map((gr) => (
              <span key={gr.key} className="flex-1 text-center text-[10px] text-slate-500 tabular-nums truncate px-0.5" title={gr.label}>
                {gr.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// Tab 1 — Tổng quan cả khối / công ty
// ==========================================================================
const ALL = 'Toàn công ty';

const OverviewTab: React.FC<{ projects: BizProject[]; cutoff: string; onOpenProject: (id: string) => void; onDrill: OnDrill }> = ({
  projects,
  cutoff,
  onOpenProject,
  onDrill,
}) => {
  const defFrom = cutoff ? `${cutoff.slice(0, 4)}-01` : '2026-01';
  const defTo = cutoff || '2026-12';
  const [from, setFrom] = useState(defFrom);
  const [to, setTo] = useState(defTo);
  const [scope, setScope] = useState(ALL);
  const [projectId, setProjectId] = useState(ALL); // lọc 1 dự án trong phạm vi (ALL = tất cả)
  const [metric, setMetric] = useState<ReportMetric | 'overview'>('overview');
  const [kind, setKind] = useState<'actual' | 'plan'>('actual'); // dùng cho chỉ tiêu "Tổng quan"
  const [axis, setAxis] = useState<'month' | 'project'>('month');
  const [health, setHealth] = useState<Health | 'all'>('all');

  const inScope = useMemo(() => projects.filter((p) => scope === ALL || p.division === scope), [projects, scope]);
  const scoped = useMemo(() => (projectId === ALL ? inScope : inScope.filter((p) => p.id === projectId)), [inScope, projectId]);
  const perfs = useMemo(() => scoped.map((p) => projectPerf(p, from, to, cutoff)), [scoped, from, to, cutoff]);
  const planT = perfs.reduce((t, x) => addTotals(t, x.plan), { revenue: 0, cost: 0, cashIn: 0, workload: 0 });
  const actualT = perfs.reduce((t, x) => addTotals(t, x.actual), { revenue: 0, cost: 0, cashIn: 0, workload: 0 });
  const counts = HEALTHS.reduce((m, h) => ({ ...m, [h]: perfs.filter((x) => x.health === h).length }), {} as Record<Health, number>);
  const shown = health === 'all' ? perfs : perfs.filter((x) => x.health === health);
  const compareEnd = cutoff && cutoff < to ? cutoff : to;
  const drillFor = (k: ReportMetric, list: BizProject[], expected: number, title: string, part?: LedgerDrill['part']) =>
    onDrill({ kind: ledgerKindOf(k)!, part, projects: list, from, to: compareEnd, expected, title });
  const costTip = costTipOf;
  const scopeTitle = projectId !== ALL && scoped[0] ? `${scoped[0].masterCode} — ${scoped[0].name}` : scope === ALL ? 'Toàn công ty' : `Khối ${scope}`;

  const groups: ChartGroup[] =
    metric === 'overview'
      ? []
      : axis === 'month'
      ? monthlySeries(scoped, metric, from, to, cutoff).map((m) => ({ key: m.month, label: fmtMonth(m.month), plan: m.plan, actual: m.actual }))
      : perfs
          .filter((x) => x.plan[metric] || x.actual[metric])
          .map((x) => ({ key: x.project.id, label: x.project.masterCode, plan: x.plan[metric], actual: x.actual[metric] }));

  const pnlGroups: PnlGroup[] =
    metric !== 'overview'
      ? []
      : axis === 'month'
        ? (() => {
            const rev = monthlySeries(scoped, 'revenue', from, to, cutoff);
            const cost = monthlySeries(scoped, 'cost', from, to, cutoff);
            return rev.map((m, i) => ({ key: m.month, label: fmtMonth(m.month), revenue: kind === 'plan' ? m.plan : m.actual, cost: kind === 'plan' ? cost[i].plan : cost[i].actual }));
          })()
        : perfs
            .filter((x) => x[kind].revenue || x[kind].cost)
            .map((x) => ({ key: x.project.id, label: x.project.masterCode, revenue: x[kind].revenue, cost: x[kind].cost }));

  return (
    <>
      <MetricCards plan={planT} actual={actualT} onDrillMetric={(k) => drillFor(k, scoped, actualT[k], `${scopeTitle} · ${scoped.length} dự án`)} />

      {/* Điều kiện lọc + điều khiển biểu đồ gộp chung một khung */}
      <Panel title="Biểu đồ kế hoạch – thực tế" icon={BarChart3}>
        <div className="mb-3">
          <FilterBar
            right={
              (from !== defFrom || to !== defTo || scope !== ALL || projectId !== ALL) && (
                <Btn
                  className="h-7"
                  onClick={() => {
                    setFrom(defFrom);
                    setTo(defTo);
                    setScope(ALL);
                    setProjectId(ALL);
                  }}
                >
                  Mặc định
                </Btn>
              )
            }
          >
            <FilterCell label="Từ">
              <input type="month" value={from} max={to} onChange={(e) => e.target.value && setFrom(e.target.value)} className={`${erp.input} w-36`} />
            </FilterCell>
            <FilterCell label="Đến">
              <input type="month" value={to} min={from} onChange={(e) => e.target.value && setTo(e.target.value)} className={`${erp.input} w-36`} />
            </FilterCell>
            <FilterCell label="Phạm vi xem">
              <select
                value={scope}
                onChange={(e) => {
                  setScope(e.target.value);
                  setProjectId(ALL);
                }}
                className={`${erp.input} w-36`}
              >
                {[ALL, ...DIVISIONS].map((d) => (
                  <option key={d} value={d}>
                    {d === ALL ? d : `Khối ${d}`}
                  </option>
                ))}
              </select>
            </FilterCell>
            <FilterCell label="Dự án" className="flex-1 min-w-[220px] max-w-[380px]">
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className={`${erp.input} w-full min-w-0`}>
                <option value={ALL}>Tất cả dự án ({inScope.length})</option>
                {inScope.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.masterCode} — {x.name}
                  </option>
                ))}
              </select>
            </FilterCell>
          </FilterBar>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {metric === 'overview' ? <PnlLegend /> : <ChartLegend metric={metric} />}
          <Segmented options={[{ key: 'overview' as const, label: 'Tổng quan' }, ...METRIC_OPTIONS]} value={metric} onChange={setMetric} />
          {metric === 'overview' && (
            <Segmented
              options={[
                { key: 'actual', label: 'Thực tế' },
                { key: 'plan', label: 'Kế hoạch' },
              ]}
              value={kind}
              onChange={setKind}
            />
          )}
          <Segmented
            options={[
              { key: 'month', label: 'Theo tháng' },
              { key: 'project', label: 'Theo dự án' },
            ]}
            value={axis}
            onChange={setAxis}
          />
        </div>
        {metric === 'overview' ? <PnlChart groups={pnlGroups} /> : <PlanActualChart groups={groups} metric={metric} />}
      </Panel>

      <Panel
        title="Chi tiết theo dự án"
        icon={Table2}
        noPad
        actions={
          <>
            <span className="text-[12px] text-slate-600">Sức khoẻ:</span>
            <Segmented
              options={[{ key: 'all' as const, label: `Tất cả (${perfs.length})` }, ...HEALTHS.map((h) => ({ key: h, label: `${h} (${counts[h]})` }))]}
              value={health}
              onChange={setHealth}
            />
          </>
        }
        footer="Bấm vào 1 dòng để xem Tổng quan dự án · Bấm vào con số thực tế của Doanh thu / Chi phí / Dòng tiền thu để xem chi tiết sổ kế toán · ĐVT: VNĐ (KLCV: SP)"
      >
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                <th rowSpan={2} className={`${erp.th} sticky left-0 z-10 text-center min-w-[230px] border-t-0 border-l-0`}>
                  Mã dự án
                </th>
                <th rowSpan={2} className={`${erp.th} text-center border-t-0`}>
                  Start
                </th>
                <th rowSpan={2} className={`${erp.th} text-center border-t-0`}>
                  End
                </th>
                <th rowSpan={2} className={`${erp.th} text-center border-t-0`}>
                  Sức khoẻ
                </th>
                {REPORT_METRICS.map((m) => (
                  <th key={m.key} colSpan={m.key === 'cost' ? 5 : 3} className={`${erp.th} text-center border-t-0 last:border-r-0`}>
                    {m.label}
                  </th>
                ))}
              </tr>
              <tr>
                {REPORT_METRICS.map((m) => (
                  <React.Fragment key={m.key}>
                    <th className={`${erp.th} text-center font-medium`}>Kế hoạch</th>
                    {m.key === 'cost' && (
                      <>
                        <th className={`${erp.th} text-center font-medium`} title="Chi phí quản lý phân bổ cho dự án — Kế toán import (sổ Chi phí quản lý)">
                          CP quản lý
                        </th>
                        <th className={`${erp.th} text-center font-medium`} title="Chi phí vận hành khối phân bổ cho dự án — Kế toán import (sổ Chi phí vận hành)">
                          CP phân bổ
                        </th>
                      </>
                    )}
                    <th className={`${erp.th} text-center font-medium`} title={m.key === 'cost' ? 'Chi phí thực tế = Chi thực tế import (SX + KD + Chi phí chung) + CP quản lý + CP phân bổ (vận hành)' : undefined}>
                      Thực tế
                    </th>
                    <th className={`${erp.th} text-center font-medium`}>Chênh lệch (%)</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((x) => (
                <tr key={x.project.id} onClick={() => onOpenProject(x.project.id)} className={`${erp.tr} cursor-pointer group`}>
                  <td className={`${erp.td} sticky left-0 z-10 bg-white group-hover:bg-[#eaf2fc] border-l-0`}>
                    <p className={`${erp.code} font-semibold`}>{x.project.masterCode}</p>
                    <p className="text-[11px] text-slate-500 truncate max-w-[240px]">
                      {x.project.division} · {x.project.name}
                    </p>
                  </td>
                  <td className={`${erp.td} whitespace-nowrap text-slate-600`}>{dmy(x.project.startDate)}</td>
                  <td className={`${erp.td} whitespace-nowrap text-slate-600`}>{dmy(x.project.endDate)}</td>
                  <td className={erp.td}>
                    <HealthBadge h={x.health} />
                  </td>
                  {REPORT_METRICS.map(({ key }) => {
                    const pl = x.plan[key];
                    const act = x.actual[key];
                    const d = act - pl;
                    const noData = x.health === 'Chưa phát sinh';
                    const diffPct = pl ? (d / pl) * 100 : null;
                    const title = `${x.project.masterCode} — ${x.project.name}`;
                    return (
                      <React.Fragment key={key}>
                        <td className={`${erp.td} ${erp.num} text-slate-600`}>{val(key, pl)}</td>
                        {key === 'cost' && (
                          <>
                            <td className={`${erp.td} ${erp.num} text-slate-700`}>
                              {noData ? '–' : <DrillVal k={key} value={x.cost.mgmt} onClick={() => drillFor(key, [x.project], x.cost.mgmt, title, 'mgmt')} />}
                            </td>
                            <td className={`${erp.td} ${erp.num} text-slate-700`}>
                              {noData ? '–' : <DrillVal k={key} value={x.cost.alloc} onClick={() => drillFor(key, [x.project], x.cost.alloc, title, 'alloc')} />}
                            </td>
                          </>
                        )}
                        <td className={`${erp.td} ${erp.num} font-semibold`} title={key === 'cost' && !noData ? costTip(x.cost) : undefined}>
                          {noData ? '–' : <DrillVal k={key} value={act} onClick={() => drillFor(key, [x.project], act, title)} />}
                        </td>
                        <td
                          title={noData ? undefined : `Chênh lệch: ${d > 0 ? '+' : ''}${val(key, d)} ${unitOf(key)}`}
                          className={`${erp.td} ${erp.num} last:border-r-0 font-medium ${
                            noData || Math.round(d) === 0 ? 'text-slate-400' : goodTone(key, act, pl) ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {noData || diffPct === null
                            ? '–'
                            : Math.abs(diffPct) < 0.05
                            ? '0.0%'
                            : `${diffPct > 0 ? '+' : ''}${diffPct.toFixed(1)}%`}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              ))}
              {!shown.length && (
                <tr>
                  <td colSpan={18} className={`${erp.td} text-center text-slate-400 py-6`}>
                    Không có dự án nào ở mức này.
                  </td>
                </tr>
              )}
            </tbody>
            {shown.length > 0 && (
              <tfoot>
                <tr className={erp.totalRow}>
                  <td className={`${erp.td} sticky left-0 z-10 bg-[#fff6d6] border-l-0`} colSpan={4}>
                    Tổng cộng ({shown.length} dự án)
                  </td>
                  {REPORT_METRICS.map(({ key }) => {
                    const p = shown.reduce((s, x) => s + x.plan[key], 0);
                    const a = shown.reduce((s, x) => s + x.actual[key], 0);
                    const d = a - p;
                    const diffPct = p ? (d / p) * 100 : null;
                    const list = shown.map((x) => x.project);
                    const title = `${scopeTitle} · ${shown.length} dự án`;
                    const parts: CostParts = shown.reduce((t, x) => ({ direct: t.direct + x.cost.direct, alloc: t.alloc + x.cost.alloc, mgmt: t.mgmt + x.cost.mgmt }), { direct: 0, alloc: 0, mgmt: 0 });
                    return (
                      <React.Fragment key={key}>
                        <td className={`${erp.td} ${erp.num}`}>{val(key, p)}</td>
                        {key === 'cost' && (
                          <>
                            <td className={`${erp.td} ${erp.num}`}>
                              <DrillVal k={key} value={parts.mgmt} onClick={() => drillFor(key, list, parts.mgmt, title, 'mgmt')} />
                            </td>
                            <td className={`${erp.td} ${erp.num}`}>
                              <DrillVal k={key} value={parts.alloc} onClick={() => drillFor(key, list, parts.alloc, title, 'alloc')} />
                            </td>
                          </>
                        )}
                        <td className={`${erp.td} ${erp.num}`} title={key === 'cost' ? costTip(parts) : undefined}>
                          <DrillVal k={key} value={a} onClick={() => drillFor(key, list, a, title)} />
                        </td>
                        <td
                          title={`Chênh lệch: ${d > 0 ? '+' : ''}${val(key, d)} ${unitOf(key)}`}
                          className={`${erp.td} ${erp.num} last:border-r-0 font-medium ${
                            Math.round(d) === 0 ? 'text-slate-500' : goodTone(key, a, p) ? 'text-emerald-700' : 'text-rose-600'
                          }`}
                        >
                          {diffPct === null
                            ? '–'
                            : Math.abs(diffPct) < 0.05
                            ? '0.0%'
                            : `${diffPct > 0 ? '+' : ''}${diffPct.toFixed(1)}%`}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Panel>

      <Panel title="Định nghĩa về mức sức khoẻ" icon={BookOpen} noPad footer="Khối lượng công việc chưa tham gia xếp mức (chờ chốt ngưỡng).">
        <table className={erp.table}>
          <thead>
            <tr>
              <th className={`${erp.th} text-left w-44 border-t-0 border-l-0`}>Mức</th>
              <th className={`${erp.th} text-left border-t-0 border-r-0`}>Điều kiện (so với kế hoạch cùng kỳ)</th>
            </tr>
          </thead>
          <tbody>
            {HEALTHS.map((h) => (
              <tr key={h} className={erp.tr}>
                <td className={`${erp.td} border-l-0`}>
                  <HealthBadge h={h} />
                </td>
                <td className={`${erp.td} text-slate-700 border-r-0`}>{HEALTH_RULES[h]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
};

// ==========================================================================
// Tab 2 — Tổng quan 1 dự án
// ==========================================================================
const ProjectTab: React.FC<{ projects: BizProject[]; cutoff: string; projectId: string; onProjectChange: (id: string) => void; onDrill: OnDrill }> = ({
  projects,
  cutoff,
  projectId,
  onProjectChange,
  onDrill,
}) => {
  const [metric, setMetric] = useState<ReportMetric>('revenue');
  const p = projects.find((x) => x.id === projectId) || projects[0];
  const [pFirst, pLast] = p ? projectMonthRange(p) : ['', ''];
  // Kỳ xem (tháng/năm) — mặc định cả thời gian dự án; đổi dự án thì đặt lại
  const [range, setRange] = useState<{ id: string; from: string; to: string }>({ id: p?.id || '', from: pFirst, to: pLast });
  if (p && range.id !== p.id) setRange({ id: p.id, from: pFirst, to: pLast });
  if (!p) return <p className="text-[13px] text-slate-500">Chưa có dự án.</p>;

  const first = range.from || pFirst;
  const last = range.to || pLast;
  const series: MonthPoint[] = monthlySeries([p], metric, first, last, cutoff);
  const totalPlan = series.reduce((s, m) => s + m.plan, 0);
  const cumPlan = series.filter((m) => m.actual !== null).reduce((s, m) => s + m.plan, 0);
  const cumActual = series.reduce((s, m) => s + (m.actual ?? 0), 0);
  const rate = ratio(cumActual, cumPlan);
  const label = REPORT_METRICS.find((m) => m.key === metric)!.label;
  const drill = (from: string, to: string, expected: number) =>
    ledgerKindOf(metric) && onDrill({ kind: ledgerKindOf(metric)!, projects: [p], from, to, expected, title: `${p.masterCode} — ${p.name}` });

  let runPlan = 0;
  let runActual = 0;
  const rows = series.map((m) => {
    runPlan += m.plan;
    if (m.actual !== null) runActual += m.actual;
    const cp = costParts(p.actual, m.month, m.month); // chỉ dùng khi chỉ tiêu Chi phí
    return { ...m, cumPlan: runPlan, cumActual: m.actual === null ? null : runActual, cp };
  });
  const isCost = metric === 'cost';
  const drillPart = (from: string, to: string, expected: number, part: LedgerDrill['part']) =>
    onDrill({ kind: 'cost', part, projects: [p], from, to, expected, title: `${p.masterCode} — ${p.name}` });
  const cpTotal = costParts(p.actual, first, cutoff < last ? cutoff : last);

  const byDivision = DIVISIONS.map((d) => [d, projects.filter((x) => x.division === d)] as const).filter(([, list]) => list.length);
  const cumText = val(metric, cumActual);

  return (
    <>
      <FilterBar>
        <FilterCell label="Dự án" className="flex-1 min-w-[260px] max-w-[460px]">
          <select value={p.id} onChange={(e) => onProjectChange(e.target.value)} className={`${erp.input} w-full min-w-0`}>
            {byDivision.map(([d, list]) => (
              <optgroup key={d} label={`Khối ${d}`}>
                {list.map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.masterCode} — {x.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </FilterCell>
        <FilterCell label="Từ">
          <input type="month" value={first} min={pFirst} max={last} onChange={(e) => e.target.value && setRange((r) => ({ ...r, from: e.target.value }))} className={`${erp.input} w-36`} />
        </FilterCell>
        <FilterCell label="Đến">
          <input type="month" value={last} min={first} max={pLast} onChange={(e) => e.target.value && setRange((r) => ({ ...r, to: e.target.value }))} className={`${erp.input} w-36`} />
        </FilterCell>
        {(first !== pFirst || last !== pLast) && (
          <Btn className="h-7" onClick={() => setRange({ id: p.id, from: pFirst, to: pLast })} title="Xem cả thời gian dự án">
            Cả dự án
          </Btn>
        )}
      </FilterBar>

      <Panel
        title="Thông tin dự án"
        icon={FolderKanban}
        noPad
        actions={
          <span className="flex items-center gap-2 text-[12px] text-slate-600">
            Chỉ tiêu <Segmented options={METRIC_OPTIONS} value={metric} onChange={setMetric} />
          </span>
        }
      >
        {/* 1 bảng chung 6 cột (nhãn | giá trị × 3) để các hàng luôn thẳng nhau */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px] table-fixed min-w-[720px]">
            <tbody>
              {[
                [
                  ['Khối', p.division],
                  ['Tên dự án', p.name],
                  ['Thời gian dự án', `${dmy(p.startDate)} → ${dmy(p.endDate)}`],
                ],
                [
                  ['Mã dự án', <span className={`${erp.code} font-semibold`}>{p.masterCode}</span>],
                  ['Chỉ tiêu', `${label} (${unitOf(metric)})`],
                  ['Kỳ đang xem', `${fmtMonth(first)} → ${fmtMonth(last)} (${series.length} tháng)`],
                ],
              ].map((row, i) => (
                <tr key={i}>
                  {row.map(([k, v], j) => (
                    <React.Fragment key={j}>
                      <th className={`w-[12%] bg-[#f3f6fa] border border-slate-200 px-3 py-1.5 text-left font-medium text-slate-600 ${j === 0 ? 'border-l-0' : ''}`}>{k}</th>
                      <td className={`w-[21.3%] border border-slate-200 px-3 py-1.5 text-slate-800 truncate ${j === 2 ? 'border-r-0' : ''}`} title={typeof v === 'string' ? v : undefined}>
                        {v}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <KpiBox label={first === pFirst && last === pLast ? 'Tổng KH cả vòng đời dự án' : 'Tổng KH trong kỳ'} value={val(metric, totalPlan)} valueText={val(metric, totalPlan)} sub={`${fmtMonth(first)} → ${fmtMonth(last)}`} />
        <KpiBox label="Luỹ kế KH đến kỳ chốt" value={val(metric, cumPlan)} valueText={val(metric, cumPlan)} sub={`Đến ${fmtMonth(cutoff)}`} />
        <KpiBox
          label="Luỹ kế TT đến kỳ chốt"
          value={<KpiValue text={cumText} onClick={ledgerKindOf(metric) && cumActual ? () => drill(first, cutoff, cumActual) : undefined} />}
          valueText={cumText}
          sub={p.actual.length ? `Đến ${fmtMonth(cutoff)}` : 'Chưa có số thực tế'}
        />
        <KpiBox label="Còn lại theo kế hoạch" value={val(metric, totalPlan - cumPlan)} valueText={val(metric, totalPlan - cumPlan)} sub="Tổng KH − Luỹ kế KH" />
        <KpiBox
          label="Mức thực hiện luỹ kế"
          value={pct(rate)}
          sub="Luỹ kế TT / Luỹ kế KH"
          badge={rate === null ? undefined : goodTone(metric, cumActual, cumPlan) ? 'Đạt' : lowerIsBetter(metric) ? 'Vượt KH' : 'Chưa đạt'}
          tone={rate === null ? 'neutral' : toneOf(metric, cumActual, cumPlan)}
        />
      </div>

      <Panel title={`${label} theo tháng`} icon={BarChart3} actions={<ChartLegend metric={metric} />}>
        <PlanActualChart groups={series.map((m) => ({ key: m.month, label: fmtMonth(m.month), plan: m.plan, actual: m.actual }))} metric={metric} />
      </Panel>

      <Panel
        title="Số liệu từng tháng của dự án đang chọn"
        icon={Table2}
        noPad
        footer={`ĐVT: ${unitOf(metric)} · Dòng nền xám: tháng sau kỳ chốt số (chưa có thực tế)`}
      >
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                {['Tháng', 'Kế hoạch', ...(isCost ? ['CP quản lý', 'CP phân bổ'] : []), 'Thực tế', 'Chênh lệch', '+/- %', 'Luỹ kế kế hoạch', 'Luỹ kế thực tế', '% luỹ kế'].map((h, i) => (
                  <th
                    key={h}
                    title={isCost && h === 'Thực tế' ? 'Chi phí thực tế = Chi thực tế import (SX + KD + Chi phí chung) + CP quản lý + CP phân bổ (vận hành)' : undefined}
                    className={`${erp.th} ${i ? 'text-right' : 'text-left'} border-t-0 first:border-l-0 last:border-r-0`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const done = r.actual !== null;
                const d = done ? r.actual! - r.plan : 0;
                const dr = done ? ratio(r.actual!, r.plan) : null;
                const cr = r.cumActual !== null ? ratio(r.cumActual, r.cumPlan) : null;
                const tone = (a: number, pl: number) => (goodTone(metric, a, pl) ? 'text-emerald-700' : 'text-rose-600');
                return (
                  <tr key={r.month} className={done ? erp.tr : 'bg-slate-100 text-slate-400'}>
                    <td className={`${erp.td} font-semibold whitespace-nowrap border-l-0`}>
                      {fmtMonth(r.month)}
                      {r.month === cutoff && <Tag cls="ml-1.5 bg-blue-50 text-[#1f5fa8] border-blue-300">Chốt số</Tag>}
                    </td>
                    <td className={`${erp.td} ${erp.num}`}>{val(metric, r.plan)}</td>
                    {isCost && (
                      <>
                        <td className={`${erp.td} ${erp.num}`}>{done ? <DrillVal k={metric} value={r.cp.mgmt} onClick={() => drillPart(r.month, r.month, r.cp.mgmt, 'mgmt')} /> : '–'}</td>
                        <td className={`${erp.td} ${erp.num}`}>{done ? <DrillVal k={metric} value={r.cp.alloc} onClick={() => drillPart(r.month, r.month, r.cp.alloc, 'alloc')} /> : '–'}</td>
                      </>
                    )}
                    <td className={`${erp.td} ${erp.num} font-semibold`} title={isCost && done ? costTipOf(r.cp) : undefined}>
                      {done ? <DrillVal k={metric} value={r.actual!} onClick={() => drill(r.month, r.month, r.actual!)} /> : '–'}
                    </td>
                    <td className={`${erp.td} ${erp.num} ${done && Math.round(d) ? tone(r.actual!, r.plan) : ''}`}>{done ? `${d > 0 ? '+' : ''}${val(metric, d)}` : '–'}</td>
                    <td className={`${erp.td} ${erp.num} ${dr !== null ? tone(r.actual!, r.plan) : ''}`}>
                      {dr === null ? '–' : `${dr >= 1 ? '+' : ''}${((dr - 1) * 100).toFixed(1)}%`}
                    </td>
                    <td className={`${erp.td} ${erp.num}`}>{val(metric, r.cumPlan)}</td>
                    <td className={`${erp.td} ${erp.num} font-semibold`}>
                      {r.cumActual === null ? '–' : <DrillVal k={metric} value={r.cumActual} onClick={() => drill(first, r.month, r.cumActual!)} />}
                    </td>
                    <td className={`${erp.td} ${erp.num} font-semibold border-r-0 ${cr !== null ? tone(r.cumActual!, r.cumPlan) : ''}`}>{pct(cr, 1)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className={erp.totalRow}>
                <td className={`${erp.td} border-l-0`}>Tổng cộng</td>
                <td className={`${erp.td} ${erp.num}`}>{val(metric, totalPlan)}</td>
                {isCost && (
                  <>
                    <td className={`${erp.td} ${erp.num}`}>
                      <DrillVal k={metric} value={cpTotal.mgmt} onClick={() => drillPart(first, cutoff, cpTotal.mgmt, 'mgmt')} />
                    </td>
                    <td className={`${erp.td} ${erp.num}`}>
                      <DrillVal k={metric} value={cpTotal.alloc} onClick={() => drillPart(first, cutoff, cpTotal.alloc, 'alloc')} />
                    </td>
                  </>
                )}
                <td className={`${erp.td} ${erp.num}`} title={isCost ? costTipOf(cpTotal) : undefined}>
                  <DrillVal k={metric} value={cumActual} onClick={() => drill(first, cutoff, cumActual)} />
                </td>
                <td className={`${erp.td} ${erp.num}`} colSpan={2}>
                  Luỹ kế đến {fmtMonth(cutoff)}: {cumActual - cumPlan > 0 ? '+' : ''}
                  {val(metric, cumActual - cumPlan)}
                </td>
                <td className={`${erp.td} ${erp.num}`}>{val(metric, cumPlan)}</td>
                <td className={`${erp.td} ${erp.num}`}>{cumText}</td>
                <td className={`${erp.td} ${erp.num} border-r-0`}>{pct(rate, 1)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Panel>
    </>
  );
};
