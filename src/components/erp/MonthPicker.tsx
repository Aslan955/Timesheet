/**
 * MonthPicker — nút lịch nhỏ cạnh ô nhập tháng (MM/YYYY): bấm mở bảng chọn tháng / năm.
 * Bảng chọn vẽ qua portal, định vị cố định theo nút nên không bị bảng cuộn ngang che mất.
 */
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

export const MonthPickerButton: React.FC<{ value: string; onChange: (ym: string) => void; disabled?: boolean; className?: string }> = ({ value, onChange, disabled, className = '' }) => {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(() => (value ? +value.slice(0, 4) : new Date().getFullYear()));
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btn = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);

  const toggle = () => {
    if (disabled) return;
    if (!open) {
      setYear(value ? +value.slice(0, 4) : new Date().getFullYear());
      const r = btn.current!.getBoundingClientRect();
      const W = 232;
      const H = 190;
      const left = Math.min(Math.max(8, r.right - W), window.innerWidth - W - 8);
      const top = r.bottom + H > window.innerHeight - 8 ? r.top - H - 4 : r.bottom + 4;
      setPos({ top, left });
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (pop.current?.contains(e.target as Node) || btn.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const scrolled = (e: Event) => {
      if (!pop.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', key);
    window.addEventListener('scroll', scrolled, true);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', key);
      window.removeEventListener('scroll', scrolled, true);
    };
  }, [open]);

  const selYear = value ? +value.slice(0, 4) : 0;
  const selMonth = value ? +value.slice(5, 7) : 0;
  const now = new Date();

  return (
    <>
      <button
        ref={btn}
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={toggle}
        title="Chọn tháng / năm"
        className={`shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-[3px] text-slate-400 hover:text-[#1f5fa8] hover:bg-[#eaf2fc] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer ${className}`}
      >
        <CalendarDays size={14} />
      </button>
      {open &&
        createPortal(
          <div ref={pop} style={{ top: pos.top, left: pos.left, width: 232 }} className="fixed z-[200] bg-white border border-slate-300 rounded-[4px] shadow-xl p-2 text-[12px] select-none">
            <div className="flex items-center justify-between mb-1.5">
              <button type="button" onClick={() => setYear((y) => y - 1)} className="p-1 rounded hover:bg-slate-100 cursor-pointer text-slate-600">
                <ChevronLeft size={14} />
              </button>
              <input
                value={year}
                onChange={(e) => {
                  const y = +e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (y) setYear(y);
                }}
                className="w-16 h-6 text-center font-bold text-[#1e3a5f] border border-slate-200 rounded-[3px] outline-none focus:border-[#1f5fa8] tabular-nums"
              />
              <button type="button" onClick={() => setYear((y) => y + 1)} className="p-1 rounded hover:bg-slate-100 cursor-pointer text-slate-600">
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                const sel = year === selYear && m === selMonth;
                const cur = year === now.getFullYear() && m === now.getMonth() + 1;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      onChange(`${year}-${String(m).padStart(2, '0')}`);
                      setOpen(false);
                    }}
                    className={`h-8 rounded-[3px] border text-[12px] cursor-pointer ${
                      sel ? 'bg-[#1f5fa8] border-[#184c88] text-white font-bold' : cur ? 'border-[#1f5fa8] text-[#1f5fa8] hover:bg-[#eaf2fc]' : 'border-slate-200 text-slate-700 hover:bg-[#eaf2fc] hover:border-[#1f5fa8]'
                    }`}
                  >
                    T{m}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between mt-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  onChange(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
                  setOpen(false);
                }}
                className="text-[#1f5fa8] hover:underline cursor-pointer"
              >
                Tháng này
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setOpen(false);
                }}
                className="text-slate-500 hover:text-rose-600 hover:underline cursor-pointer"
              >
                Xoá
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
