/**
 * Erp — bộ khung giao diện kiểu phần mềm kế toán dùng cho module Kinh doanh
 * (Dự án kinh doanh, Báo cáo hiệu quả dự án).
 *
 * Nguyên tắc: khung viền rõ ràng, mỗi khung có thanh tiêu đề; bảng kẻ ô đầy đủ,
 * tiêu đề cột nền xám, số canh phải + chữ số đều (tabular-nums), dòng tổng nền vàng nhạt;
 * góc bo nhỏ, không đổ bóng lớn; chữ 12–13px.
 */
import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';

// ==========================================================================
// Class dùng chung
// ==========================================================================
const INPUT =
  'h-8 border border-slate-300 rounded-[3px] px-2 text-[13px] text-slate-800 bg-white outline-none focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#1f5fa8]/15 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed';

export const erp = {
  /** Ô nhập, tự đặt độ rộng (vd trên thanh lọc) */
  input: INPUT,
  /** Ô nhập rộng hết khung (trong form) */
  inputFull: `${INPUT} w-full`,
  /** Bảng kẻ ô */
  table: 'w-full border-collapse text-[12.5px] tabular-nums',
  th: 'bg-[#e8edf4] border border-slate-300 px-2.5 py-1.5 font-semibold text-[#1e3a5f] text-[12px] whitespace-nowrap',
  td: 'border border-slate-200 px-2.5 py-1.5',
  tr: 'even:bg-slate-50/70 hover:bg-[#eaf2fc]',
  totalRow: 'bg-[#fff6d6] font-bold text-slate-800 [&>td]:border-slate-300',
  num: 'text-right tabular-nums whitespace-nowrap',
  code: 'font-mono text-[#1f5fa8]',
};

// ==========================================================================
// Trang & thanh tiêu đề
// ==========================================================================
export const ErpPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-full bg-[#eef1f5] p-3 sm:p-4 space-y-3 text-[13px] text-slate-800 font-sans">{children}</div>
);

export const ErpTitleBar: React.FC<{
  /** Bỏ trống crumbs + title (vd màn có nút Quay lại) → chỉ hiện nút Quay lại bên trái. */
  crumbs?: string[];
  title?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: { label: string; value: React.ReactNode }[];
  /** Dòng thông báo / thao tác của bước hiện tại, hiện ở cuối khung đầu trang. */
  notice?: React.ReactNode;
  /** Nút "Quay lại" — luôn nằm bên trái (trước tiêu đề); các nút tác vụ nằm bên phải. */
  onBack?: () => void;
  backLabel?: string;
}> = ({ crumbs = [], title, actions, meta, notice, onBack, backLabel = 'Quay lại' }) => (
  <div className="bg-white border border-slate-300 rounded-[4px]">
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5">
      <div className="min-w-0 flex items-center gap-3">
        {onBack && (
          <Btn icon={ArrowLeft} onClick={onBack} className="shrink-0">
            {backLabel}
          </Btn>
        )}
        {(crumbs.length > 0 || title) && (
        <div className="min-w-0">
        {crumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-[11px] text-slate-500">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={11} className="text-slate-400" />}
              {c}
            </span>
          ))}
        </nav>
        )}
        {title && <h1 className="text-[17px] font-bold text-[#1e3a5f] leading-tight mt-0.5 flex items-center gap-2 flex-wrap">{title}</h1>}
        </div>
        )}
      </div>
      {actions && <div className="ml-auto flex flex-wrap items-center justify-end gap-1.5">{actions}</div>}
    </div>
    {meta && meta.length > 0 && (
      <div className="flex flex-wrap border-t border-slate-200 bg-slate-50 text-[12px]">
        {meta.map((m, i) => (
          <div key={i} className="px-4 py-1.5 border-r border-slate-200 last:border-r-0">
            <span className="text-slate-500">{m.label}: </span>
            <span className="font-semibold text-slate-800">{m.value}</span>
          </div>
        ))}
      </div>
    )}
    {notice && <div className="border-t border-slate-200 rounded-b-[4px] overflow-hidden empty:hidden">{notice}</div>}
  </div>
);

// ==========================================================================
// Khung (panel) có thanh tiêu đề
// ==========================================================================
export const Panel: React.FC<{
  title: React.ReactNode;
  icon?: React.ElementType;
  actions?: React.ReactNode;
  children: React.ReactNode;
  noPad?: boolean;
  className?: string;
  footer?: React.ReactNode;
}> = ({ title, icon: Icon, actions, children, noPad, className = '', footer }) => (
  <section className={`bg-white border border-slate-300 rounded-[4px] overflow-hidden min-w-0 ${className}`}>
    <header className="flex flex-wrap items-center justify-between gap-2 px-3 min-h-9 py-1 bg-gradient-to-b from-[#f7f9fc] to-[#edf1f6] border-b border-slate-300">
      <h2 className="text-[12px] font-bold uppercase tracking-wide text-[#1e3a5f] flex items-center gap-1.5">
        <span className="w-[3px] h-3.5 bg-[#1f5fa8] rounded-sm" />
        {Icon && <Icon size={13} className="text-[#1f5fa8]" />}
        {title}
      </h2>
      {actions && <div className="ml-auto flex flex-wrap items-center justify-end gap-1.5">{actions}</div>}
    </header>
    <div className={noPad ? '' : 'p-3'}>{children}</div>
    {footer && <div className="px-3 py-1.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">{footer}</div>}
  </section>
);

// ==========================================================================
// Nút
// ==========================================================================
type BtnVariant = 'primary' | 'default' | 'success' | 'danger';
const BTN: Record<BtnVariant, string> = {
  primary: 'bg-[#1f5fa8] border-[#184c88] text-white hover:bg-[#184c88]',
  success: 'bg-[#0f8f6c] border-[#0b7659] text-white hover:bg-[#0b7659]',
  default: 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50',
  danger: 'bg-white border-slate-300 text-rose-600 hover:bg-rose-50 hover:border-rose-300',
};
export const Btn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; icon?: React.ElementType }> = ({
  variant = 'default',
  icon: Icon,
  children,
  className = '',
  ...rest
}) => (
  <button
    type="button"
    {...rest}
    className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[3px] border text-[12px] font-semibold whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${BTN[variant]} ${className}`}
  >
    {Icon && <Icon size={14} />}
    {children}
  </button>
);

// ==========================================================================
// Tab dạng thẻ hồ sơ
// ==========================================================================
export function FolderTabs<K extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { key: K; label: React.ReactNode; icon?: React.ElementType }[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <div className="flex items-end gap-0.5 border-b border-slate-300 px-1">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`flex items-center gap-1.5 h-8 px-4 -mb-px rounded-t-[4px] border text-[12px] cursor-pointer ${
            value === key
              ? 'bg-white border-slate-300 border-b-white text-[#1f5fa8] font-bold'
              : 'bg-[#e3e8ef] border-transparent text-slate-600 hover:bg-[#d8dee8]'
          }`}
        >
          {Icon && <Icon size={13} />}
          {label}
        </button>
      ))}
    </div>
  );
}

/** Nhóm nút chọn 1 (vd chọn chỉ tiêu). */
export function Segmented<K extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: K; label: React.ReactNode }[];
  value: K;
  onChange: (k: K) => void;
}) {
  return (
    <div className="inline-flex border border-slate-300 rounded-[3px] overflow-hidden divide-x divide-slate-300 bg-white">
      {options.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`h-7 px-3 text-[12px] cursor-pointer whitespace-nowrap ${
            value === key ? 'bg-[#1f5fa8] text-white font-semibold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ==========================================================================
// Bảng thuộc tính (nhãn | giá trị) kẻ ô
// ==========================================================================
export interface FieldRow {
  label: React.ReactNode;
  value: React.ReactNode;
  num?: boolean; // canh phải
  strong?: boolean;
}
export const FieldTable: React.FC<{ rows: FieldRow[]; labelWidth?: string }> = ({ rows, labelWidth = '42%' }) => (
  <table className="w-full border-collapse text-[13px]">
    <tbody>
      {rows.map((r, i) => (
        <tr key={i}>
          <th style={{ width: labelWidth }} className="bg-[#f3f6fa] border border-slate-200 px-3 py-1.5 text-left font-medium text-slate-600 align-top">
            {r.label}
          </th>
          <td className={`border border-slate-200 px-3 py-1.5 ${r.num ? erp.num : ''} ${r.strong ? 'font-bold text-slate-900' : 'text-slate-800'}`}>
            {r.value === '' || r.value === null || r.value === undefined ? <span className="text-slate-400">—</span> : r.value}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

// ==========================================================================
// Ô số liệu (KPI)
// ==========================================================================
export type Tone = 'good' | 'bad' | 'neutral';
const TONE_BAR: Record<Tone, string> = { good: 'border-t-emerald-600', bad: 'border-t-rose-600', neutral: 'border-t-[#1f5fa8]' };
const TONE_TEXT: Record<Tone, string> = { good: 'text-emerald-700 bg-emerald-50 border-emerald-200', bad: 'text-rose-700 bg-rose-50 border-rose-200', neutral: 'text-slate-600 bg-slate-50 border-slate-200' };

export const KpiBox: React.FC<{
  label: string;
  value: React.ReactNode;
  valueText?: string; // để chọn cỡ chữ theo độ dài
  sub?: React.ReactNode;
  badge?: string;
  tone?: Tone;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}> = ({ label, value, valueText = '', sub, badge, tone = 'neutral', onClick, active, className = '' }) => (
  // Chiều cao cố định cho từng phần (nhãn 2 dòng, số 1 dòng, dải dưới ghim đáy) để các ô cùng hàng thẳng nhau
  <div
    onClick={onClick}
    className={`flex flex-col bg-white border border-slate-300 border-t-[3px] ${TONE_BAR[tone]} rounded-[4px] min-w-0 ${
      onClick ? 'cursor-pointer hover:shadow-sm hover:border-slate-400 transition-all select-none' : ''
    } ${active ? 'ring-2 ring-emerald-500 shadow-sm' : ''} ${className}`}
  >
    <div className="flex items-start justify-between gap-2 px-3 pt-2 h-[38px]">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 leading-[14px] line-clamp-2" title={label}>
        {label}
      </p>
      {badge && <span className={`shrink-0 px-1.5 py-px rounded-[3px] border text-[11px] font-bold tabular-nums ${TONE_TEXT[tone]}`}>{badge}</span>}
    </div>
    <p className={`px-3 h-[34px] flex items-center font-bold text-slate-900 tabular-nums whitespace-nowrap overflow-hidden ${valueText.length > 15 ? 'text-[17px]' : 'text-[20px]'}`}>
      {value}
    </p>
    {sub && <div className="mt-auto px-3 py-1 border-t border-slate-100 bg-slate-50/70 text-[11px] text-slate-500 tabular-nums truncate">{sub}</div>}
  </div>
);

/** Ô nhập có nhãn bên trái (dạng form kế toán). */
export const FormRow: React.FC<{ label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode; className?: string }> = ({
  label,
  required,
  error,
  hint,
  children,
  className = '',
}) => (
  <label className={`grid grid-cols-[150px_1fr] items-start gap-x-2 ${className}`}>
    <span className="text-[12px] text-slate-600 pt-1.5 leading-tight">
      {label} {required && <span className="text-rose-600">*</span>}
    </span>
    <span className="min-w-0">
      {children}
      {error ? <span className="block text-[11px] text-rose-600 mt-0.5">{error}</span> : hint && <span className="block text-[11px] text-slate-400 mt-0.5">{hint}</span>}
    </span>
  </label>
);

/** Nhãn trạng thái vuông, có viền. */
export const Tag: React.FC<{ cls: string; children: React.ReactNode; icon?: React.ElementType }> = ({ cls, children, icon: Icon }) => (
  <span className={`inline-flex items-center gap-1 px-1.5 py-px rounded-[3px] border text-[11px] font-semibold whitespace-nowrap ${cls}`}>
    {Icon && <Icon size={11} />}
    {children}
  </span>
);
