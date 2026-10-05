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

const fmtMonth = (m: string) => (m ? `${m.slice(5, 7)}/${m.slice(0, 4)}` : '—');
const dmy = (iso: string) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '—');
const isMoney = (k: ReportMetric) => REPORT_METRICS.find((m) => m.key === k)!.money;
const val = (_k: ReportMetric, n: number) => Math.round(n).toLocaleString('en-US');
const pct = (r: number | null, digits = 0) => (r === null ? '—' : `${(r * 100).toFixed(digits)}%`);
const unitOf = (k: ReportMetric) => (isMoney(k) ? 'VNĐ' : 'SP');

/** Chỉ tiêu có sổ chi tiết kế toán để xem khi bấm vào số thực tế. */
const ledgerKindOf = (k: ReportMetric): LedgerDrill['kind'] | null => (k === 'cashIn' ? 'cashIn' : k === 'cost' ? 'cost' : null);
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
// Tab 1 — Tổng quan cả khối / công ty
// ==========================================================================
const ALL = 'Toàn công ty';

const OverviewTab: React.FC<{ projects: BizProject[]; cutoff: string; onOpenProject: (id: string) => void; onDrill: OnDrill }> = ({
  projects,
  cutoff,
  onOpenProject,
  onDrill,
}) => {
  const [from, setFrom] = useState(() => (cutoff ? `${cutoff.slice(0, 4)}-01` : '2026-01'));
  const [to, setTo] = useState(() => cutoff || '2026-12');
  const [scope, setScope] = useState(ALL);
  const [metric, setMetric] = useState<ReportMetric>('revenue');
  const [axis, setAxis] = useState<'month' | 'project'>('month');
  const [health, setHealth] = useState<Health | 'all'>('all');

  const scoped = useMemo(() => projects.filter((p) => scope === ALL || p.division === scope), [projects, scope]);
  const perfs = useMemo(() => scoped.map((p) => projectPerf(p, from, to, cutoff)), [scoped, from, to, cutoff]);
  const planT = perfs.reduce((t, x) => addTotals(t, x.plan), { revenue: 0, cost: 0, cashIn: 0, workload: 0 });
  const actualT = perfs.reduce((t, x) => addTotals(t, x.actual), { revenue: 0, cost: 0, cashIn: 0, workload: 0 });
  const counts = HEALTHS.reduce((m, h) => ({ ...m, [h]: perfs.filter((x) => x.health === h).length }), {} as Record<Health, number>);
  const shown = health === 'all' ? perfs : perfs.filter((x) => x.health === health);
  const compareEnd = cutoff && cutoff < to ? cutoff : to;
  const drillFor = (k: ReportMetric, list: BizProject[], expected: number, title: string) =>
    onDrill({ kind: ledgerKindOf(k)!, projects: list, from, to: compareEnd, expected, title });
  const scopeTitle = scope === ALL ? 'Toàn công ty' : `Khối ${scope}`;

  const groups: ChartGroup[] =
    axis === 'month'
      ? monthlySeries(scoped, metric, from, to, cutoff).map((m) => ({ key: m.month, label: fmtMonth(m.month), plan: m.plan, actual: m.actual }))
      : perfs
          .filter((x) => x.plan[metric] || x.actual[metric])
          .map((x) => ({ key: x.project.id, label: x.project.masterCode, plan: x.plan[metric], actual: x.actual[metric] }));

  return (
    <>
      <MetricCards plan={planT} actual={actualT} onDrillMetric={(k) => drillFor(k, scoped, actualT[k], `${scopeTitle} · ${scoped.length} dự án`)} />

      {/* Điều kiện lọc + điều khiển biểu đồ gộp chung một khung */}
      <Panel title="Biểu đồ kế hoạch – thực tế" icon={BarChart3}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-3 mb-3 border-b border-slate-200">
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1e3a5f]">
            <Filter size={13} /> Điều kiện lọc
          </span>
          <FilterField label="Từ tháng">
            <input type="month" value={from} max={to} onChange={(e) => e.target.value && setFrom(e.target.value)} className={`${erp.input} w-40`} />
          </FilterField>
          <FilterField label="Đến tháng">
            <input type="month" value={to} min={from} onChange={(e) => e.target.value && setTo(e.target.value)} className={`${erp.input} w-40`} />
          </FilterField>
          <FilterField label="Phạm vi xem">
            <select value={scope} onChange={(e) => setScope(e.target.value)} className={`${erp.input} w-44`}>
              {[ALL, ...DIVISIONS].map((d) => (
                <option key={d} value={d}>
                  {d === ALL ? d : `Khối ${d}`}
                </option>
              ))}
            </select>
          </FilterField>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <ChartLegend metric={metric} />
          <Segmented options={METRIC_OPTIONS} value={metric} onChange={setMetric} />
          <Segmented
            options={[
              { key: 'month', label: 'Theo tháng' },
              { key: 'project', label: 'Theo dự án' },
            ]}
            value={axis}
            onChange={setAxis}
          />
        </div>
        <PlanActualChart groups={groups} metric={metric} />
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
        footer="Bấm vào 1 dòng để xem Tổng quan dự án · Bấm vào con số thực tế của Chi phí / Dòng tiền thu để xem chi tiết sổ kế toán · ĐVT: VNĐ (KLCV: SP)"
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
                  <th key={m.key} colSpan={3} className={`${erp.th} text-center border-t-0 last:border-r-0`}>
                    {m.label}
                  </th>
                ))}
              </tr>
              <tr>
                {REPORT_METRICS.map((m) => (
                  <React.Fragment key={m.key}>
                    <th className={`${erp.th} text-center font-medium`}>Kế hoạch</th>
                    <th className={`${erp.th} text-center font-medium`}>Thực tế</th>
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
                    return (
                      <React.Fragment key={key}>
                        <td className={`${erp.td} ${erp.num} text-slate-600`}>{val(key, pl)}</td>
                        <td className={`${erp.td} ${erp.num} font-semibold`}>
                          {noData ? (
                            '–'
                          ) : (
                            <DrillVal k={key} value={act} onClick={() => drillFor(key, [x.project], act, `${x.project.masterCode} — ${x.project.name}`)} />
                          )}
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
                  <td colSpan={16} className={`${erp.td} text-center text-slate-400 py-6`}>
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
                    return (
                      <React.Fragment key={key}>
                        <td className={`${erp.td} ${erp.num}`}>{val(key, p)}</td>
                        <td className={`${erp.td} ${erp.num}`}>
                          <DrillVal k={key} value={a} onClick={() => drillFor(key, shown.map((x) => x.project), a, `${scopeTitle} · ${shown.length} dự án`)} />
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
  if (!p) return <p className="text-[13px] text-slate-500">Chưa có dự án.</p>;

  const [first, last] = projectMonthRange(p);
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
    return { ...m, cumPlan: runPlan, cumActual: m.actual === null ? null : runActual };
  });

  const byDivision = DIVISIONS.map((d) => [d, projects.filter((x) => x.division === d)] as const).filter(([, list]) => list.length);
  const cumText = val(metric, cumActual);

  return (
    <>
      <Panel title="Điều kiện lọc" icon={Filter}>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <FilterField label="Dự án">
            <select value={p.id} onChange={(e) => onProjectChange(e.target.value)} className={`${erp.input} w-[380px]`}>
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
          </FilterField>
          <FilterField label="Chỉ tiêu">
            <Segmented options={METRIC_OPTIONS} value={metric} onChange={setMetric} />
          </FilterField>
        </div>
      </Panel>

      <Panel title="Thông tin dự án" icon={FolderKanban} noPad>
        {/* 1 bảng chung 6 cột (nhãn | giá trị × 3) để các hàng luôn thẳng nhau */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px] table-fixed min-w-[720px]">
            <tbody>
              {[
                [
                  ['Khối', p.division],
                  ['Tên dự án', p.name],
                  ['Start', dmy(p.startDate)],
                ],
                [
                  ['Mã dự án', <span className={`${erp.code} font-semibold`}>{p.masterCode}</span>],
                  ['Chỉ tiêu', `${label} (${unitOf(metric)})`],
                  ['End', dmy(p.endDate)],
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
        <KpiBox label="Tổng KH cả vòng đời dự án" value={val(metric, totalPlan)} valueText={val(metric, totalPlan)} sub={`${fmtMonth(first)} → ${fmtMonth(last)}`} />
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
                {['Tháng', 'Kế hoạch', 'Thực tế', 'Chênh lệch', '+/- %', 'Luỹ kế kế hoạch', 'Luỹ kế thực tế', '% luỹ kế'].map((h, i) => (
                  <th key={h} className={`${erp.th} ${i ? 'text-right' : 'text-left'} border-t-0 first:border-l-0 last:border-r-0`}>
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
                    <td className={`${erp.td} ${erp.num} font-semibold`}>
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
                <td className={`${erp.td} ${erp.num}`}>
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
