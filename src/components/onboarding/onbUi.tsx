/**
 * UI dùng chung của luồng Bàn giao onboard — khung ERP của module Tài chính (src/components/erp/Erp.tsx).
 */
import React from 'react';
import { Check, X } from 'lucide-react';
import { Tag, erp } from '../erp/Erp';
import { TAG } from '../../marcom/MarcomUi';
import { OnbStatus, ONB_STEPS, OnbRecord, stepIndex, daysUntil, FieldChange } from '../../onboarding/onboardingData';

export const ONB_STATUS_CLS: Record<OnbStatus, string> = {
  'Chờ HCNS duyệt': TAG.amber,
  'Đang onboard': TAG.blue,
  'Đã onboard': TAG.green,
  'Huỷ onboard': TAG.slate,
  'HCNS từ chối': TAG.rose,
};

export const OnbStatusTag: React.FC<{ status: OnbStatus }> = ({ status }) => <Tag cls={ONB_STATUS_CLS[status]}>{status}</Tag>;

/** Nhãn D-x tới ngày nhận việc. */
export const DaysTag: React.FC<{ iso: string; muted?: boolean }> = ({ iso, muted }) => {
  const d = daysUntil(iso);
  if (d == null || muted) return null;
  if (d < 0) return <Tag cls={TAG.slate}>đã qua {-d} ngày</Tag>;
  if (d === 0) return <Tag cls={TAG.rose}>hôm nay</Tag>;
  return <Tag cls={d <= 7 ? TAG.amber : TAG.slate}>D-{d}</Tag>;
};

/** Ô nhập kiểu nhãn phía trên (giống form Cấp mã dự án). */
export const FormField: React.FC<{ label: string; required?: boolean; hint?: React.ReactNode; error?: string; badge?: React.ReactNode; className?: string; children: React.ReactNode }> = ({
  label, required, hint, error, badge, className = '', children,
}) => (
  <div className={`min-w-0 ${className}`}>
    <div className="flex items-baseline justify-between gap-2 mb-1">
      <span className="text-[12.5px] font-semibold text-slate-700 flex items-center gap-1.5">
        <span>
          {label}
          {required && <span className="text-rose-500"> *</span>}
        </span>
        {badge}
      </span>
    </div>
    {children}
    {error ? <p className="text-[11px] text-rose-600 mt-0.5">{error}</p> : hint ? <p className="text-[11.5px] text-slate-400 mt-0.5">{hint}</p> : null}
  </div>
);

export const FormSection: React.FC<{ n: number; title: string; sub?: string; cols?: 2 | 3; children: React.ReactNode }> = ({ n, title, sub, cols = 2, children }) => (
  <section className="px-5 py-4 border-b border-slate-200 last:border-b-0">
    <div className="flex items-center gap-2.5 mb-3">
      <span className="w-6 h-6 rounded-full bg-[#1f5fa8] text-white text-[12px] font-bold flex items-center justify-center shrink-0">{n}</span>
      <div>
        <h3 className="text-[14px] font-bold text-[#1e3a5f] leading-tight">{title}</h3>
        {sub && <p className="text-[12px] text-slate-500">{sub}</p>}
      </div>
    </div>
    <div className={`grid grid-cols-1 gap-x-5 gap-y-3.5 ${cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>{children}</div>
  </section>
);

/** Select có giữ giá trị hiện tại kể cả khi không nằm trong danh mục (WithCurrent). */
export const CatalogSelect: React.FC<{ value: string; options: string[]; onChange: (v: string) => void; placeholder?: string; invalid?: boolean; disabled?: boolean }> = ({
  value, options, onChange, placeholder = '-- Chọn --', invalid, disabled,
}) => {
  const opts = value && !options.includes(value) ? [value, ...options] : options;
  return (
    <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className={`${erp.inputFull} cursor-pointer ${invalid ? '!border-rose-400 bg-rose-50/40' : ''}`}>
      <option value="">{placeholder}</option>
      {opts.map((o) => (
        <option key={o} value={o}>
          {o}
          {value === o && !options.includes(o) ? ' (ngoài danh mục)' : ''}
        </option>
      ))}
    </select>
  );
};

/** Danh sách thay đổi cũ → mới. */
export const ChangeList: React.FC<{ changes: FieldChange[]; empty?: string }> = ({ changes, empty = 'Không có trường nào thay đổi.' }) =>
  changes.length === 0 ? (
    <p className="text-[12px] text-slate-500">{empty}</p>
  ) : (
    <ul className="space-y-1 text-[12px]">
      {changes.map((c, i) => (
        <li key={i} className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-slate-600">{c.field}:</span>
          <span className="line-through text-slate-400">{c.from || '(trống)'}</span>
          <span className="text-slate-400">→</span>
          <b className="text-slate-800">{c.to || '(trống)'}</b>
        </li>
      ))}
    </ul>
  );

/** Stepper ngang 5 bước của phiếu (cùng kiểu PhaseStepper màn Dự án kinh doanh). */
export const OnbStepper: React.FC<{ record: OnbRecord }> = ({ record }) => {
  const cur = stepIndex(record);
  const closed = cur < 0;
  return (
    <div className="overflow-x-auto pb-1">
      <ol className="grid min-w-[680px]" style={{ gridTemplateColumns: `repeat(${ONB_STEPS.length}, minmax(0, 1fr))` }}>
        {ONB_STEPS.map((s, i) => {
          const state = closed ? (i === 0 ? 'done' : 'closed') : i < cur ? 'done' : i === cur ? 'current' : 'todo';
          return (
            <li key={s.code} className="flex flex-col items-center">
              <div className="relative w-full h-7 flex items-center justify-center">
                {i > 0 && <span className={`absolute left-0 right-1/2 top-1/2 -translate-y-1/2 h-[2px] ${!closed && i <= cur ? 'bg-emerald-600' : 'bg-slate-300'}`} />}
                {i < ONB_STEPS.length - 1 && <span className={`absolute left-1/2 right-0 top-1/2 -translate-y-1/2 h-[2px] ${!closed && i < cur ? 'bg-emerald-600' : 'bg-slate-300'}`} />}
                <span
                  className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                    state === 'done'
                      ? 'bg-emerald-600 text-white'
                      : state === 'current'
                        ? 'bg-white border-[3px] border-[#1f5fa8] ring-4 ring-[#1f5fa8]/15'
                        : state === 'closed'
                          ? 'bg-slate-200 text-slate-400'
                          : 'bg-white border-2 border-slate-300'
                  }`}
                >
                  {state === 'done' && <Check size={13} strokeWidth={3} />}
                  {state === 'closed' && <X size={12} strokeWidth={3} />}
                </span>
              </div>
              <div className={`mt-2 mx-1 w-[calc(100%-8px)] rounded-[3px] border px-3 py-1.5 ${state === 'current' ? 'border-[#1f5fa8] bg-[#eaf2fc]' : 'border-slate-300 bg-white'}`}>
                <p className={`text-[11px] font-bold ${state === 'current' ? 'text-[#1f5fa8]' : state === 'done' ? 'text-emerald-700' : 'text-slate-400'}`}>
                  Bước {s.code} · {s.owner}
                </p>
                <p className={`text-[12.5px] font-semibold truncate ${state === 'todo' || state === 'closed' ? 'text-slate-400' : 'text-slate-800'}`}>{s.name}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
