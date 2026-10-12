/**
 * PmoPnlPage — PMO-03 Khối P&L (F7.4 P&L & margin · F7.2 Budget burn · F7.3 Cost pipeline). Trang chủ của GĐK.
 *
 * Bố cục:
 *   thanh tiêu đề: chọn Khối · kỳ Tuần / Tháng / Quý · vai trò
 *   hàng thẻ: ECV kỳ · Chi phí kỳ (giờ × rate + overhead khối) · Margin thực · Margin định giá (bình quân theo giá trị HĐ)
 *             · Budget Burn Δ khối · Số dự án dưới margin định giá
 *   hàng 2: biểu đồ SVG 12 tuần (ECV lũy kế vs chi phí lũy kế, ECV plan) | Top 5 dự án kéo margin xuống
 *   hàng 3: bảng P&L theo dự án (bấm tiêu đề để sắp xếp, dòng tổng, bấm mã mở Cockpit) · nút Xuất Excel (CSV mẫu Finance).
 * Quyền: PM chỉ thấy margin dự án mình, không thấy rate; GĐK/GĐSX xem khối mình (OQ-015); TCT được chọn "Tất cả khối".
 */
import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Download, LineChart, Lock, TrendingDown, Wallet } from 'lucide-react';
import { KHOI, PmoProject, TODAY, fmtTy, fmtVnd, marginOf, pct } from '../../pmo/pmo';
import { usePmo } from '../../pmo/PmoContext';
import { OVERHEAD, PAST_WEEKS, projectDetail, rateOf, weekLabel, weekNo } from '../../pmo/pmoData';
import { Btn, ErpPage, ErpTitleBar, Panel, Segmented, erp } from '../erp/Erp';
import { RoleSelect, TypeTag } from './PmoBits';

type Period = 'week' | 'month' | 'quarter';
const PERIOD_WEEKS: Record<Period, number> = { week: 1, month: 4, quarter: 12 };
const PERIOD_LABEL: Record<Period, string> = { week: 'Tuần', month: 'Tháng', quarter: 'Quý' };
const SEL = `${erp.input} h-7 text-[12px]`;

const Stat: React.FC<{ label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: 'good' | 'bad' | 'warn' | 'neutral' }> = ({ label, value, sub, tone = 'neutral' }) => (
  <div className="px-3 py-2 min-w-0">
    <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500 truncate">{label}</p>
    <p className={`text-[17px] font-bold tabular-nums leading-tight ${tone === 'good' ? 'text-emerald-700' : tone === 'bad' ? 'text-rose-700' : tone === 'warn' ? 'text-amber-700' : 'text-slate-900'}`}>{value}</p>
    {sub && <p className="text-[11px] text-slate-500 truncate">{sub}</p>}
  </div>
);

/** Một dòng P&L của dự án trong kỳ đang xem. */
interface PnlRow {
  p: PmoProject;
  ecvPeriod: number;
  costPeriod: number;
  ecv: number;
  cost: number;
  margin: number;
  presale: number;
  gap: number;
  burn: number;
  eac: number;
  /** Phần margin bị hụt quy ra VNĐ: (margin thực − định giá) × ECV. */
  drag: number;
}
type SortKey = 'code' | 'name' | 'type' | 'contract' | 'ecvPeriod' | 'ecv' | 'cost' | 'margin' | 'presale' | 'gap' | 'burn' | 'eac';

const buildRow = (p: PmoProject, n: number): PnlRow => {
  const w = projectDetail(p).weekly;
  const last = w.length - 1;
  const from = last - n;
  // ECV lũy kế tại đầu kỳ (với kỳ Quý = 12 tuần, ngoại suy tuần trước tuần đầu tiên)
  const ecvStart = from >= 0 ? w[from].ecvCum : w[0].ecvCum - (w[1].ecvCum - w[0].ecvCum);
  const ecvPeriod = Math.max(0, w[last].ecvCum - ecvStart);
  const costPeriod = w.slice(last - n + 1).reduce((s, x) => s + x.cost, 0);
  const margin = marginOf(p);
  const ecvPct = p.contractValue ? p.ecv / p.contractValue : 0;
  return {
    p,
    ecvPeriod,
    costPeriod,
    ecv: p.ecv,
    cost: p.costUsed,
    margin,
    presale: p.presaleMargin,
    gap: margin - p.presaleMargin,
    burn: p.kpis.budgetBurn,
    eac: ecvPct ? p.costUsed / ecvPct : p.budget,
    drag: ((margin - p.presaleMargin) / 100) * p.ecv,
  };
};

const sortVal = (r: PnlRow, k: SortKey): number | string =>
  k === 'code' ? r.p.code : k === 'name' ? r.p.name : k === 'type' ? r.p.type : k === 'contract' ? r.p.contractValue : r[k];

/** Biểu đồ đường 12 tuần: ECV lũy kế, ECV plan lũy kế, chi phí lũy kế. Vẽ SVG thuần. */
const TrendChart: React.FC<{ weeks: string[]; ecv: number[]; plan: number[]; cost: number[]; highlight: number }> = ({ weeks, ecv, plan, cost, highlight }) => {
  const W = 640;
  const H = 210;
  const L = 52;
  const R = 24;
  const T = 10;
  const B = 24;
  const all = [...ecv, ...plan, ...cost];
  const hi = Math.max(...all) * 1.05 || 1;
  const lo = Math.max(0, Math.min(...all) * 0.85);
  const x = (i: number) => L + (i / (weeks.length - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - (v - lo) / (hi - lo || 1)) * (H - T - B);
  const line = (vs: number[]) => vs.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const ticks = Array.from({ length: 5 }, (_, i) => lo + ((hi - lo) * i) / 4);
  const hx = x(Math.max(0, weeks.length - 1 - highlight));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="ECV lũy kế so với chi phí lũy kế 12 tuần">
      {/* vùng kỳ đang xem */}
      <rect x={hx} y={T} width={W - R - hx} height={H - T - B} fill="#1f5fa8" opacity="0.06" />
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeWidth="1" />
          <text x={L - 6} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="#64748b">
            {fmtTy(t)}
          </text>
        </g>
      ))}
      {weeks.map((w, i) => (
        <text key={w} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#64748b">
          {weekLabel(w)}
        </text>
      ))}
      <line x1={L} x2={L} y1={T} y2={H - B} stroke="#cbd5e1" />
      <polyline points={line(plan)} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
      <polyline points={line(ecv)} fill="none" stroke="#1f5fa8" strokeWidth="2" strokeLinejoin="round" />
      <polyline points={line(cost)} fill="none" stroke="#e11d48" strokeWidth="2" strokeLinejoin="round" />
      {ecv.map((v, i) => (
        <circle key={`e${i}`} cx={x(i)} cy={y(v)} r="2.2" fill="#1f5fa8">
          <title>{`Tuần ${weekNo(weeks[i])} · ECV lũy kế ${fmtTy(v)} · chi phí ${fmtTy(cost[i])}`}</title>
        </circle>
      ))}
      {cost.map((v, i) => (
        <circle key={`c${i}`} cx={x(i)} cy={y(v)} r="2.2" fill="#e11d48" />
      ))}
    </svg>
  );
};

const csvCell = (v: string | number) => {
  const s = typeof v === 'number' ? String(Math.round(v * 100) / 100) : v;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const PmoPnlPage: React.FC<{ onNavigate?: (item: string) => void }> = ({ onNavigate }) => {
  const { projects, setFocusId, focus, role, setRole, khoi, setKhoi } = usePmo();
  const [period, setPeriod] = useState<Period>('month');
  const [allKhoi, setAllKhoi] = useState(false);
  const [sort, setSort] = useState<{ k: SortKey; asc: boolean }>({ k: 'gap', asc: true });
  const [msg, setMsg] = useState('');
  const flash = (s: string) => {
    setMsg(s);
    window.setTimeout(() => setMsg(''), 3500);
  };

  const isPm = role === 'PM';
  const showAll = role === 'TCT' && allKhoi;
  const n = PERIOD_WEEKS[period];

  // Phạm vi dữ liệu theo quyền
  const pool = useMemo(() => {
    if (isPm) return projects.filter((p) => p.pm === focus.pm);
    return showAll ? projects : projects.filter((p) => p.khoi === khoi);
  }, [projects, isPm, focus.pm, showAll, khoi]);

  const rows = useMemo(() => pool.map((p) => buildRow(p, n)), [pool, n]);
  const sorted = useMemo(() => {
    const s = [...rows].sort((a, b) => {
      const va = sortVal(a, sort.k);
      const vb = sortVal(b, sort.k);
      return typeof va === 'string' ? va.localeCompare(vb as string) : va - (vb as number);
    });
    return sort.asc ? s : s.reverse();
  }, [rows, sort]);

  // Tổng hợp
  const tot = useMemo(() => {
    const sum = (f: (r: PnlRow) => number) => rows.reduce((s, r) => s + f(r), 0);
    const contract = sum((r) => r.p.contractValue);
    const ecv = sum((r) => r.ecv);
    const cost = sum((r) => r.cost);
    const budget = sum((r) => r.p.budget);
    const ecvPeriod = sum((r) => r.ecvPeriod);
    const costPeriod = sum((r) => r.costPeriod);
    // tách chi phí kỳ: trực tiếp (giờ × rate) + overhead theo khối
    const direct = sum((r) => r.costPeriod / (1 + OVERHEAD[r.p.khoi] / 100));
    const hours = sum((r) => r.costPeriod / (1 + OVERHEAD[r.p.khoi] / 100) / rateOf(r.p.khoi, 'Middle'));
    const presale = contract ? sum((r) => r.presale * r.p.contractValue) / contract : 0;
    const margin = ecv ? ((ecv - cost) / ecv) * 100 : 0;
    return {
      contract,
      ecv,
      cost,
      budget,
      ecvPeriod,
      costPeriod,
      direct,
      overhead: costPeriod - direct,
      hours,
      presale,
      margin,
      marginPeriod: ecvPeriod ? ((ecvPeriod - costPeriod) / ecvPeriod) * 100 : 0,
      burn: pct(cost, budget) - pct(ecv, contract),
      eac: sum((r) => r.eac),
      below: rows.filter((r) => r.gap < 0).length,
    };
  }, [rows]);

  // Chuỗi 12 tuần cộng theo khối
  const series = useMemo(() => {
    const ecv = PAST_WEEKS.map(() => 0);
    const plan = PAST_WEEKS.map(() => 0);
    const cost = PAST_WEEKS.map(() => 0);
    pool.forEach((p) =>
      projectDetail(p).weekly.forEach((w, i) => {
        ecv[i] += w.ecvCum;
        plan[i] += w.ecvPlanCum;
        cost[i] += w.costCum;
      }),
    );
    return { ecv, plan, cost };
  }, [pool]);

  const top5 = useMemo(() => [...rows].filter((r) => r.drag < 0).sort((a, b) => a.drag - b.drag).slice(0, 5), [rows]);
  const maxDrag = Math.max(1, ...top5.map((r) => -r.drag));

  const open = (p: PmoProject) => {
    setFocusId(p.id);
    onNavigate?.('Project Cockpit');
  };
  const scopeLabel = isPm ? `dự án của ${focus.pm}` : showAll ? 'Tất cả khối' : `Khối ${khoi}`;

  const exportCsv = () => {
    const head = ['Khối', 'Mã dự án', 'Tên dự án', 'Loại', 'Giá trị HĐ (VNĐ)', `ECV ${PERIOD_LABEL[period].toLowerCase()} (VNĐ)`, `Chi phí ${PERIOD_LABEL[period].toLowerCase()} (VNĐ)`, 'ECV lũy kế (VNĐ)', 'Chi phí lũy kế (VNĐ)', 'Margin thực (%)', 'Margin định giá (%)', 'Chênh lệch (điểm)', 'Budget Burn Δ (điểm)', 'EAC dự báo (VNĐ)'];
    const body = sorted.map((r) => [r.p.khoi, r.p.code, r.p.name, r.p.type, r.p.contractValue, r.ecvPeriod, r.costPeriod, r.ecv, r.cost, r.margin, r.presale, r.gap, r.burn, r.eac]);
    const total = ['TỔNG', '', `${rows.length} dự án`, '', tot.contract, tot.ecvPeriod, tot.costPeriod, tot.ecv, tot.cost, tot.margin, tot.presale, tot.margin - tot.presale, tot.burn, tot.eac];
    const meta = [[`P&L ${scopeLabel} — kỳ ${PERIOD_LABEL[period]} đến ${TODAY}`], ['Nguồn: ecv_ledger + cost_ledger (giờ timesheet × rate + overhead khối) · số liệu mẫu']];
    const csv = '﻿' + [...meta, [], head, ...body, total].map((r) => r.map(csvCell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `PnL_${isPm ? 'PM' : showAll ? 'TCT' : khoi}_${PERIOD_LABEL[period]}_${TODAY}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash(`Đã xuất ${rows.length} dòng P&L theo mẫu Finance`);
  };

  const Th: React.FC<{ k: SortKey; children: React.ReactNode; align?: 'left' | 'right' | 'center'; className?: string }> = ({ k, children, align = 'right', className = '' }) => (
    <th
      className={`${erp.th} border-t-0 cursor-pointer select-none hover:bg-[#dbe3ee] ${align === 'left' ? 'text-left' : align === 'center' ? 'text-center' : 'text-right'} ${className}`}
      onClick={() => setSort((s) => ({ k, asc: s.k === k ? !s.asc : true }))}
      title="Bấm để sắp xếp"
    >
      <span className={`inline-flex items-center gap-0.5 ${align === 'right' ? 'justify-end' : ''}`}>
        {children}
        {sort.k === k && (sort.asc ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
      </span>
    </th>
  );

  const gapCls = (g: number) => (g < -3 ? 'text-rose-700 font-semibold' : g < 0 ? 'text-amber-700' : 'text-emerald-700');
  const burnCls = (b: number) => (b > 10 ? 'text-rose-700 font-semibold' : b > 5 ? 'text-amber-700' : '');

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', 'Khối P&L']}
        title={`P&L · ${scopeLabel}`}
        actions={
          <>
            {!isPm && (
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
                Khối
                <select
                  value={showAll ? '' : khoi}
                  onChange={(e) => (e.target.value ? (setAllKhoi(false), setKhoi(e.target.value)) : setAllKhoi(true))}
                  className={SEL}
                >
                  {role === 'TCT' && <option value="">Tất cả khối</option>}
                  {KHOI.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </label>
            )}
            <Segmented options={(['week', 'month', 'quarter'] as Period[]).map((k) => ({ key: k, label: PERIOD_LABEL[k] }))} value={period} onChange={setPeriod} />
            <RoleSelect value={role} onChange={setRole} />
          </>
        }
        notice={
          <div className="flex items-center gap-1.5 px-4 py-1 bg-slate-50 text-[11.5px] text-slate-600">
            <Lock size={12} className="text-slate-400" />
            {isPm
              ? 'Vai trò PM: chỉ thấy margin các dự án mình phụ trách; không hiển thị rate và giờ quy đổi.'
              : role === 'TCT'
                ? 'Vai trò TCT: xem được tất cả khối và so sánh chi phí giữa các khối.'
                : `Vai trò ${role}: chỉ xem chi phí/margin khối mình (OQ-015 — chưa cho xem cost khối khác).`}
          </div>
        }
      />

      {/* Hàng thẻ */}
      <div className="bg-white border border-slate-300 rounded-[4px] grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 divide-x divide-slate-200">
        <Stat label={`ECV ${PERIOD_LABEL[period].toLowerCase()} này`} value={`${fmtTy(tot.ecvPeriod)}`} sub={`lũy kế ${fmtTy(tot.ecv)} / HĐ ${fmtTy(tot.contract)}`} />
        <Stat
          label={`Chi phí ${PERIOD_LABEL[period].toLowerCase()} này`}
          value={fmtTy(tot.costPeriod)}
          sub={isPm ? `lũy kế ${fmtTy(tot.cost)}` : `≈${Math.round(tot.hours).toLocaleString('vi-VN')} giờ × rate ${fmtTy(tot.direct)} + overhead ${fmtTy(tot.overhead)}`}
        />
        <Stat
          label="Margin thực"
          value={`${tot.margin.toFixed(1)}%`}
          sub={period === 'week' ? 'lũy kế · ECV tuần dao động theo nghiệm thu' : `lũy kế · riêng kỳ ${tot.marginPeriod.toFixed(1)}%`}
          tone={tot.margin < tot.presale - 3 ? 'bad' : tot.margin < tot.presale ? 'warn' : 'good'}
        />
        <Stat label="Margin định giá" value={`${tot.presale.toFixed(1)}%`} sub="bình quân theo giá trị HĐ" />
        <Stat label="Budget Burn Δ" value={`${tot.burn > 0 ? '+' : ''}${tot.burn.toFixed(1)} điểm`} sub="% cost/budget − % ECV/HĐ" tone={tot.burn > 10 ? 'bad' : tot.burn > 5 ? 'warn' : 'good'} />
        <Stat label="Dự án dưới margin định giá" value={`${tot.below} / ${rows.length}`} sub={`${rows.filter((r) => r.gap < -3).length} dự án thấp hơn > 3 điểm`} tone={tot.below ? 'bad' : 'good'} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-3 items-start">
        <Panel
          title="ECV lũy kế vs chi phí lũy kế · 12 tuần"
          icon={LineChart}
          actions={
            <span className="flex items-center gap-3 text-[11px] text-slate-600">
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-0.5 bg-[#1f5fa8]" /> ECV
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-3 border-t border-dashed border-slate-400" /> ECV plan
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-3 h-0.5 bg-rose-600" /> Chi phí
              </span>
            </span>
          }
          footer={`Vùng tô nhạt = kỳ đang xem (${PERIOD_LABEL[period]}). Chi phí = giờ timesheet × rate (level, khối gốc) + overhead khối; khóa theo tuần cùng timesheet (F7.3).`}
        >
          <TrendChart weeks={PAST_WEEKS} ecv={series.ecv} plan={series.plan} cost={series.cost} highlight={n} />
        </Panel>

        <Panel title="Top 5 dự án kéo margin xuống" icon={TrendingDown} noPad footer="Xếp theo (margin thực − margin định giá) × ECV — số VNĐ margin bị hụt so với định giá.">
          {top5.length ? (
            <ul className="divide-y divide-slate-100">
              {top5.map((r, i) => (
                <li key={r.p.id} className="px-3 py-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <button type="button" onClick={() => open(r.p)} className="min-w-0 text-left cursor-pointer hover:underline" title="Mở Project Cockpit">
                      <span className="text-slate-400 text-[11px] mr-1">#{i + 1}</span>
                      <span className={`${erp.code} text-[11.5px]`}>{r.p.code}</span> <span className="text-slate-800">{r.p.name}</span>
                    </button>
                    <span className="shrink-0 text-rose-700 font-bold tabular-nums text-[12px]">−{fmtTy(-r.drag)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-sm overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${(-r.drag / maxDrag) * 100}%` }} />
                    </div>
                    <span className="text-[11px] text-slate-500 tabular-nums whitespace-nowrap">
                      {r.margin.toFixed(1)}% vs {r.presale.toFixed(1)}% · burn {r.burn > 0 ? '+' : ''}
                      {r.burn.toFixed(0)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-6 text-center text-slate-400 italic">Không có dự án nào dưới margin định giá.</p>
          )}
        </Panel>
      </div>

      <Panel
        title={
          <>
            P&L theo dự án <span className="font-normal normal-case text-slate-500 tracking-normal">· {rows.length} dự án · kỳ {PERIOD_LABEL[period]}</span>
          </>
        }
        icon={Wallet}
        noPad
        actions={
          <>
            {msg && <span className="text-[12px] text-emerald-700">{msg}</span>}
            <Btn icon={Download} className="h-7" onClick={exportCsv}>
              Xuất Excel (mẫu Finance)
            </Btn>
          </>
        }
        footer="Margin thực lũy kế = (ECV − cost)/ECV · Chênh lệch đỏ khi thấp hơn định giá > 3 điểm · Budget Burn Δ vàng > +5, đỏ > +10 · EAC = cost đã dùng / %ECV (F7.2). Bấm tiêu đề cột để sắp xếp, bấm mã để mở Cockpit."
      >
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1200px]`}>
            <thead>
              <tr>
                <Th k="code" align="left" className="border-l-0">
                  Mã
                </Th>
                <Th k="name" align="left">
                  Tên dự án
                </Th>
                <Th k="type" align="center">
                  Loại
                </Th>
                <Th k="contract">Giá trị HĐ</Th>
                <Th k="ecvPeriod">ECV kỳ</Th>
                <Th k="ecv">ECV lũy kế</Th>
                <Th k="cost">Cost lũy kế</Th>
                <Th k="margin">Margin thực</Th>
                <Th k="presale">Margin định giá</Th>
                <Th k="gap">Chênh lệch</Th>
                <Th k="burn">Budget Burn Δ</Th>
                <Th k="eac" className="border-r-0">
                  EAC dự báo
                </Th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.p.id} className={erp.tr}>
                  <td className={`${erp.td} border-l-0 whitespace-nowrap`}>
                    <button type="button" onClick={() => open(r.p)} className={`${erp.code} hover:underline cursor-pointer`} title="Mở Project Cockpit">
                      {r.p.code}
                    </button>
                  </td>
                  <td className={`${erp.td} font-semibold text-slate-800 whitespace-nowrap`}>{r.p.name}</td>
                  <td className={`${erp.td} text-center`}>
                    <TypeTag t={r.p.type} />
                  </td>
                  <td className={`${erp.td} ${erp.num}`} title={fmtVnd(r.p.contractValue)}>
                    {fmtTy(r.p.contractValue)}
                  </td>
                  <td className={`${erp.td} ${erp.num}`}>{fmtTy(r.ecvPeriod)}</td>
                  <td className={`${erp.td} ${erp.num}`} title={fmtVnd(r.ecv)}>
                    {fmtTy(r.ecv)}
                  </td>
                  <td className={`${erp.td} ${erp.num}`} title={fmtVnd(r.cost)}>
                    {fmtTy(r.cost)}
                  </td>
                  <td className={`${erp.td} ${erp.num} font-semibold`}>{r.margin.toFixed(1)}%</td>
                  <td className={`${erp.td} ${erp.num} text-slate-600`}>{r.presale.toFixed(1)}%</td>
                  <td className={`${erp.td} ${erp.num} ${gapCls(r.gap)}`}>
                    {r.gap > 0 ? '+' : ''}
                    {r.gap.toFixed(1)}
                  </td>
                  <td className={`${erp.td} ${erp.num} ${burnCls(r.burn)}`}>
                    {r.burn > 0 ? '+' : ''}
                    {r.burn.toFixed(1)}
                  </td>
                  <td className={`${erp.td} border-r-0 ${erp.num} ${r.eac > r.p.budget * 1.05 ? 'text-rose-700' : ''}`} title={`Budget ${fmtVnd(r.p.budget)}`}>
                    {fmtTy(r.eac)}
                    <span className="text-[10.5px] text-slate-400 ml-1">({r.eac > r.p.budget ? '+' : ''}{(pct(r.eac, r.p.budget) - 100).toFixed(0)}%)</span>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={12} className="px-3 py-8 text-center text-slate-400 italic">
                    Không có dự án trong phạm vi xem.
                  </td>
                </tr>
              )}
              {rows.length > 0 && (
                <tr className={erp.totalRow}>
                  <td className={`${erp.td} border-l-0`} colSpan={3}>
                    Tổng {rows.length} dự án
                  </td>
                  <td className={`${erp.td} ${erp.num}`}>{fmtTy(tot.contract)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmtTy(tot.ecvPeriod)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmtTy(tot.ecv)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmtTy(tot.cost)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{tot.margin.toFixed(1)}%</td>
                  <td className={`${erp.td} ${erp.num}`}>{tot.presale.toFixed(1)}%</td>
                  <td className={`${erp.td} ${erp.num} ${gapCls(tot.margin - tot.presale)}`}>
                    {tot.margin - tot.presale > 0 ? '+' : ''}
                    {(tot.margin - tot.presale).toFixed(1)}
                  </td>
                  <td className={`${erp.td} ${erp.num} ${burnCls(tot.burn)}`}>
                    {tot.burn > 0 ? '+' : ''}
                    {tot.burn.toFixed(1)}
                  </td>
                  <td className={`${erp.td} border-r-0 ${erp.num}`}>{fmtTy(tot.eac)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </ErpPage>
  );
};
