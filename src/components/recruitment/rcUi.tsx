/**
 * UI dùng chung module Tuyển dụng — khung ERP (src/components/erp/Erp.tsx), màu badge theo RecruitmentUi.cs.
 */
import React from 'react';
import { Tag, erp } from '../erp/Erp';
import { Tone, TONE_CLS, Stage, STAGES, stageTone, RequestStatus, statusTone, Priority, priorityTone, Sla, slaTone, HrStatus, HR_STATUS_LABEL, hrTone } from '../../recruitment/rc/rcData';

export { FormField, FormSection, CatalogSelect } from '../onboarding/onbUi';

export const ToneTag: React.FC<{ tone: Tone; children: React.ReactNode; title?: string }> = ({ tone, children, title }) => (
  <span title={title}>
    <Tag cls={TONE_CLS[tone]}>{children}</Tag>
  </span>
);

export const StageBadge: React.FC<{ stage: Stage }> = ({ stage }) => <ToneTag tone={stageTone(stage)}>{stage}</ToneTag>;
export const StatusBadge: React.FC<{ status: RequestStatus | '' }> = ({ status }) => (status ? <ToneTag tone={statusTone(status)}>{status}</ToneTag> : <Dash />);
export const PriorityBadge: React.FC<{ priority: Priority | '' }> = ({ priority }) => (priority ? <ToneTag tone={priorityTone(priority)}>{priority}</ToneTag> : <Dash />);
export const SlaBadge: React.FC<{ sla: Sla }> = ({ sla }) => (sla ? <ToneTag tone={slaTone(sla)}>{sla}</ToneTag> : <Dash />);
export const HrBadge: React.FC<{ status: HrStatus; showNone?: boolean }> = ({ status, showNone }) =>
  status === 'None' && !showNone ? <Dash /> : <ToneTag tone={hrTone(status)}>{HR_STATUS_LABEL[status]}</ToneTag>;

export const Dash: React.FC = () => <span className="text-slate-400">—</span>;

const SELECT_TONE: Record<Tone, string> = {
  gray: 'bg-slate-100 text-slate-700 border-slate-300',
  red: 'bg-rose-50 text-rose-700 border-rose-300',
  amber: 'bg-amber-50 text-amber-800 border-amber-300',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  blue: 'bg-[#eaf2fc] text-[#1f5fa8] border-[#b9d3f0]',
  orange: 'bg-orange-50 text-orange-700 border-orange-300',
  purple: 'bg-violet-50 text-violet-700 border-violet-300',
};

/** Ô chọn Stage tô màu theo badge (cột Vòng 1/2 trên lưới, card lượt ứng tuyển). */
export const StageSelect: React.FC<{ value: Stage; onChange: (s: Stage) => void; disabled?: boolean; className?: string }> = ({ value, onChange, disabled, className = '' }) => (
  <select
    value={value}
    disabled={disabled}
    onClick={(e) => e.stopPropagation()}
    onChange={(e) => onChange(e.target.value as Stage)}
    className={`h-6 px-1 rounded-[3px] border text-[11.5px] font-semibold cursor-pointer outline-none disabled:cursor-not-allowed disabled:opacity-80 ${SELECT_TONE[stageTone(value)]} ${className}`}
  >
    {STAGES.map((s) => (
      <option key={s} value={s} className="bg-white text-slate-800">
        {s}
      </option>
    ))}
  </select>
);

/** Thanh công cụ lưới: trái (xuất/nhập), phải (tìm kiếm Enter + chọn cột + xoá lọc cột). */
export const GridToolbar: React.FC<{ left?: React.ReactNode; right?: React.ReactNode }> = ({ left, right }) => (
  <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-slate-200 bg-slate-50">
    <div className="flex flex-wrap items-center gap-1.5">{left}</div>
    <div className="flex flex-wrap items-center gap-1.5">{right}</div>
  </div>
);

/** Ô tìm kiếm chỉ chạy khi Enter / bấm kính lúp (giống lưới thật). */
export const SearchBox: React.FC<{ value: string; onSearch: (v: string) => void; placeholder: string; width?: string }> = ({ value, onSearch, placeholder, width = 'w-72' }) => {
  const [text, setText] = React.useState(value);
  React.useEffect(() => setText(value), [value]);
  return (
    <span className="relative inline-flex items-center">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch(text.trim())}
        placeholder={placeholder}
        className={`${erp.input} h-7 ${width} pr-14 text-[12px]`}
      />
      {text && (
        <button type="button" title="Xoá từ khoá" onClick={() => { setText(''); onSearch(''); }} className="absolute right-7 text-slate-400 hover:text-slate-600 cursor-pointer text-[13px]">
          ✕
        </button>
      )}
      <button type="button" onClick={() => onSearch(text.trim())} className="absolute right-1.5 text-slate-500 hover:text-[#1f5fa8] cursor-pointer" title="Tìm">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      </button>
    </span>
  );
};

/** Phân trang 10/20/50/100. */
export const Pager: React.FC<{ total: number; page: number; size: number; onPage: (p: number) => void; onSize: (s: number) => void }> = ({ total, page, size, onPage, onSize }) => {
  const pages = Math.max(1, Math.ceil(total / size));
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 border-t border-slate-200 bg-slate-50 text-[12px] text-slate-600">
      <span>
        Tổng: <b className="text-slate-800 tabular-nums">{total}</b>
      </span>
      <span className="flex items-center gap-1">
        <button type="button" disabled={page <= 1} onClick={() => onPage(page - 1)} className="h-6 px-2 border border-slate-300 rounded-[3px] bg-white disabled:opacity-40 cursor-pointer">
          ‹
        </button>
        <span className="px-1 tabular-nums">
          {page} / {pages}
        </span>
        <button type="button" disabled={page >= pages} onClick={() => onPage(page + 1)} className="h-6 px-2 border border-slate-300 rounded-[3px] bg-white disabled:opacity-40 cursor-pointer">
          ›
        </button>
        <select value={size} onChange={(e) => onSize(Number(e.target.value))} className="h-6 ml-2 border border-slate-300 rounded-[3px] bg-white cursor-pointer">
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n} / trang
            </option>
          ))}
        </select>
      </span>
    </div>
  );
};

/** Hộp xác nhận nhỏ (thay window.confirm). */
export const useConfirm = () => {
  const [state, setState] = React.useState<{ text: string; resolve: (ok: boolean) => void } | null>(null);
  const ask = (text: string) => new Promise<boolean>((resolve) => setState({ text, resolve }));
  const close = (ok: boolean) => {
    state?.resolve(ok);
    setState(null);
  };
  const node = state ? (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={() => close(false)} />
      <div className="relative bg-white w-full max-w-sm border border-slate-300 rounded-[4px] shadow-2xl text-[13px]">
        <div className="px-4 py-4 text-slate-700">{state.text}</div>
        <div className="px-3 py-2 border-t border-slate-200 bg-slate-50 flex justify-end gap-1.5">
          <button type="button" onClick={() => close(false)} className="h-8 px-3 rounded-[3px] border border-slate-300 bg-white text-[12px] font-semibold cursor-pointer">
            Huỷ
          </button>
          <button type="button" onClick={() => close(true)} className="h-8 px-3 rounded-[3px] border border-[#184c88] bg-[#1f5fa8] text-white text-[12px] font-semibold cursor-pointer">
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  ) : null;
  return { ask, confirmNode: node };
};
