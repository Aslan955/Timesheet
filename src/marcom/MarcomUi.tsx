/**
 * Thành phần UI dùng chung cho các màn MarCom — theo phong cách khung ERP của màn "Báo cáo hiệu quả dự án"
 * (src/components/erp/Erp.tsx): khung viền rõ, thanh tiêu đề panel, bảng kẻ ô, góc bo nhỏ, chữ 12–13px.
 */
import React, { useEffect, useState } from 'react';
import { Check, Filter, ImageOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MarcomEmployee } from './marcomData';

export const Avatar: React.FC<{ e: MarcomEmployee; size?: number; rounded?: string; className?: string }> = ({ e, size = 32, rounded = 'rounded-full', className = '' }) =>
  e.photoUrl ? (
    <img src={e.photoUrl} alt={e.name} width={size} height={size} className={`${rounded} object-cover shrink-0 ${className}`} style={{ width: size, height: size }} />
  ) : (
    <div className={`${rounded} bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }} title="Chưa có ảnh trên hồ sơ Employee">
      <ImageOff size={Math.max(12, size * 0.38)} className="text-slate-300" />
    </div>
  );

/** Màu nhãn trạng thái (dùng với <Tag cls=...> của Erp). */
export const TAG = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  blue: 'bg-[#eaf2fc] text-[#1f5fa8] border-[#b9d3f0]',
  amber: 'bg-amber-50 text-amber-700 border-amber-300',
  rose: 'bg-rose-50 text-rose-700 border-rose-300',
  slate: 'bg-slate-100 text-slate-500 border-slate-300',
  violet: 'bg-violet-50 text-violet-700 border-violet-300',
};

/** Dải lọc một hàng, nền xám nhạt (giống FilterBar màn Báo cáo hiệu quả dự án). */
export const FilterBar: React.FC<{ children: React.ReactNode; right?: React.ReactNode }> = ({ children, right }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border border-slate-200 rounded-[4px] [&_input]:h-7 [&_select]:h-7 [&_input]:text-[12px] [&_select]:text-[12px]">
    <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300 whitespace-nowrap">
      <Filter size={13} className="text-[#1f5fa8]" /> Lọc
    </span>
    {children}
    {right && <span className="ml-auto flex items-center gap-2">{right}</span>}
  </div>
);
export const FilterCell: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className = '' }) => (
  <label className={`flex items-center gap-1.5 min-w-0 ${className}`}>
    <span className="text-[12px] text-slate-600 whitespace-nowrap">{label}</span>
    {children}
  </label>
);

/** Toast góc phải (cùng kiểu màn Báo cáo hiệu quả dự án). */
export const useToast = () => {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = window.setTimeout(() => setMsg(null), 3000);
    return () => window.clearTimeout(t);
  }, [msg]);
  const node = (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="fixed top-5 right-5 z-[130] bg-[#1e3a5f] text-white px-4 py-2.5 rounded-[4px] shadow-lg flex items-center gap-2 text-[12px] font-semibold max-w-md"
        >
          <Check size={14} className="text-emerald-300 shrink-0" /> {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
  return { toast: setMsg, toastNode: node };
};

/** Hộp thoại kiểu khung ERP: thanh tiêu đề panel + chân nút. */
export const Modal: React.FC<{ open: boolean; onClose: () => void; title: React.ReactNode; children: React.ReactNode; width?: string; footer?: React.ReactNode }> = ({
  open, onClose, title, children, width = 'max-w-lg', footer,
}) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className={`relative bg-white w-full ${width} border border-slate-300 rounded-[4px] shadow-2xl flex flex-col max-h-[90vh] text-[13px]`}
        >
          <header className="flex items-center justify-between gap-2 px-3 h-10 bg-gradient-to-b from-[#f7f9fc] to-[#edf1f6] border-b border-slate-300 rounded-t-[4px]">
            <h2 className="text-[13px] font-bold text-[#1e3a5f] flex items-center gap-1.5">
              <span className="w-[3px] h-3.5 bg-[#1f5fa8] rounded-sm" />
              {title}
            </h2>
            <button type="button" onClick={onClose} className="p-1 rounded-[3px] hover:bg-slate-200 text-slate-500 cursor-pointer">
              <X size={15} />
            </button>
          </header>
          <div className="p-4 overflow-y-auto">{children}</div>
          {footer && <div className="px-3 py-2 border-t border-slate-200 bg-slate-50 flex justify-end gap-1.5 rounded-b-[4px]">{footer}</div>}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

/** Nút icon nhỏ trong bảng. */
export const iconBtn =
  'inline-flex items-center justify-center w-7 h-7 rounded-[3px] border border-transparent text-slate-500 hover:border-slate-300 hover:bg-white hover:text-[#1f5fa8] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed';

/** Công tắc bật/tắt. */
export const Switch: React.FC<{ on: boolean; onChange: (v: boolean) => void }> = ({ on, onChange }) => (
  <button type="button" onClick={() => onChange(!on)} className={`relative w-9 h-[18px] rounded-full transition-colors cursor-pointer ${on ? 'bg-[#0f8f6c]' : 'bg-slate-300'}`}>
    <span className={`absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full shadow transition-all ${on ? 'left-[20px]' : 'left-[2px]'}`} />
  </button>
);
