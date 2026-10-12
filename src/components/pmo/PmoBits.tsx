/**
 * PmoBits — thành phần dùng chung của module PMO: nhãn health, dải 6 phase,
 * thẻ KPI có xu hướng 8 tuần, ô chọn vai trò / dự án.
 */
import React from 'react';
import { Health, HEALTH_CLS, HEALTH_LABEL, KpiDef, PHASES, PmoProject, PROJ_TYPE_LABEL, ProjType, fmtKpi, fmtThreshold, kpiColor } from '../../pmo/pmo';
import { PmoRole } from '../../pmo/PmoContext';
import { Tag, erp } from '../erp/Erp';

export const HealthBadge: React.FC<{ h: Health; small?: boolean }> = ({ h, small }) => (
  <span className={`inline-flex items-center justify-center rounded-[3px] border font-bold ${small ? 'min-w-[44px] px-1.5 py-px text-[11px]' : 'px-2.5 h-7 text-[12px]'} ${HEALTH_CLS[h]}`}>{HEALTH_LABEL[h]}</span>
);

export const TypeTag: React.FC<{ t: ProjType }> = ({ t }) => (
  <Tag cls={t === 'CL' ? 'bg-violet-50 text-violet-700 border-violet-200' : t === 'QT' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-slate-50 text-slate-600 border-slate-200'}>
    {t} · {PROJ_TYPE_LABEL[t]}
  </Tag>
);

/** Dải 6 phase: đã qua = xanh, hiện tại = xanh đậm có viền, chưa tới = xám. */
export const PhaseStrip: React.FC<{ phase: number; compact?: boolean; short?: boolean }> = ({ phase, compact, short }) => (
  <div className="flex items-stretch gap-0.5">
    {PHASES.map((ph) => {
      const done = ph.no < phase;
      const cur = ph.no === phase;
      return (
        <div
          key={ph.no}
          title={`P${ph.no} ${ph.name}`}
          className={`flex items-center justify-center ${compact ? 'h-4 w-5 text-[9px]' : 'h-6 px-2 text-[11px]'} rounded-[2px] font-bold whitespace-nowrap ${
            cur ? 'bg-[#1f5fa8] text-white ring-2 ring-[#1f5fa8]/30' : done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
          }`}
        >
          {compact ? ph.no : short && ph.no !== phase ? `P${ph.no}` : `P${ph.no} ${ph.name}`}
        </div>
      );
    })}
  </div>
);

/** Đường xu hướng 8 tuần nhỏ (SVG), tô màu theo health hiện tại. */
export const Spark: React.FC<{ values: number[]; color: Health; w?: number; h?: number }> = ({ values, color, w = 72, h = 22 }) => {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * (w - 2) + 1},${h - 2 - ((v - lo) / span) * (h - 4)}`).join(' ');
  const stroke = color === 'red' ? '#e11d48' : color === 'yellow' ? '#d97706' : '#059669';
  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={w - 1} cy={h - 2 - ((values[values.length - 1] - lo) / span) * (h - 4)} r="2" fill={stroke} />
    </svg>
  );
};

const KPI_BAR: Record<Health, string> = { green: 'border-t-emerald-600', yellow: 'border-t-amber-400', red: 'border-t-rose-600' };
const KPI_VAL: Record<Health, string> = { green: 'text-emerald-700', yellow: 'text-amber-700', red: 'text-rose-700' };

export const KpiCard: React.FC<{ def: KpiDef; value: number; trend: number[]; active?: boolean; onClick?: () => void }> = ({ def, value, trend, active, onClick }) => {
  const c = kpiColor(def, value);
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${def.formula}\nNguồn: ${def.source}\n${fmtThreshold(def)}`}
      className={`text-left bg-white border border-slate-300 border-t-[3px] ${KPI_BAR[c]} rounded-[4px] px-2.5 pt-1.5 pb-1 min-w-0 cursor-pointer hover:border-slate-400 ${active ? 'ring-2 ring-[#1f5fa8]/40' : ''}`}
    >
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500 truncate">
        <span className="text-slate-400">#{def.no}</span> {def.label}
      </p>
      <div className="flex items-end justify-between gap-1 mt-0.5">
        <span className={`text-[19px] leading-none font-bold tabular-nums ${KPI_VAL[c]}`}>{fmtKpi(def, value)}</span>
        <Spark values={trend} color={c} />
      </div>
      <p className="text-[10px] text-slate-400 mt-1 truncate">{fmtThreshold(def)}</p>
    </button>
  );
};

export const RoleSelect: React.FC<{ value: PmoRole; onChange: (r: PmoRole) => void }> = ({ value, onChange }) => (
  <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
    Vai trò
    <select value={value} onChange={(e) => onChange(e.target.value as PmoRole)} className={`${erp.input} h-7 text-[12px]`}>
      <option>PM</option>
      <option>GĐSX</option>
      <option>GĐK</option>
      <option>TCT</option>
    </select>
  </label>
);

export const ProjectSelect: React.FC<{ projects: PmoProject[]; value: string; onChange: (id: string) => void }> = ({ projects, value, onChange }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={`${erp.input} h-7 text-[12px] max-w-[360px]`}>
    {projects.map((p) => (
      <option key={p.id} value={p.id}>
        {p.code} · {p.name}
      </option>
    ))}
  </select>
);
