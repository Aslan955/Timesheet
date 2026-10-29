/**
 * Phễu lọc theo giá trị ở tiêu đề cột (kiểu Excel / DevExtreme) — dùng chung cho các màn danh sách.
 *  - Mỗi cột: danh sách giá trị (kèm số dòng), ô tìm, "Chọn tất cả", Huỷ / Áp dụng.
 *  - Giá trị của một cột tính trên các dòng đã qua bộ lọc của các cột KHÁC (lọc liên hoàn như Excel).
 *  - Không chọn giá trị nào = không lọc cột đó. Ô trống hiện "(Trống)".
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Filter, Search, X } from 'lucide-react';

export type ColFilters = Record<string, string[]>;
type Getter<T> = (x: T) => string | number | null | undefined | (string | number | null | undefined)[];
export type ColValue = { value: string; count: number };

const EMPTY = '';
const clean = (v: unknown) => {
  const s = String(v ?? '').trim();
  return s === '-' || s === '—' ? EMPTY : s;
};
const valuesOf = <T,>(get: Getter<T>, x: T) => {
  const v = get(x);
  const arr = (Array.isArray(v) ? v : [v]).map(clean);
  return arr.length ? arr : [EMPTY];
};
const DMY = /^(\d{2})\/(\d{2})\/(\d{4})/;
const NUM = /^-?[\d.,]+(\s?%)?$/;
/** Sắp giá trị: ngày dd/mm/yyyy theo thời gian, số theo độ lớn, còn lại theo bảng chữ cái tiếng Việt; (Trống) cuối cùng */
const order = (a: string, b: string) => {
  if (a === EMPTY || b === EMPTY) return a === b ? 0 : a === EMPTY ? 1 : -1;
  const da = a.match(DMY);
  const db = b.match(DMY);
  if (da && db) return `${da[3]}${da[2]}${da[1]}${a.slice(10)}`.localeCompare(`${db[3]}${db[2]}${db[1]}${b.slice(10)}`);
  if (NUM.test(a) && NUM.test(b)) return parseFloat(a.replace(/,/g, '')) - parseFloat(b.replace(/,/g, ''));
  return a.localeCompare(b, 'vi', { numeric: true, sensitivity: 'base' });
};

/** Bộ lọc theo cột cho một danh sách. `getters`: khoá cột → giá trị hiển thị (chuỗi, hoặc mảng nếu 1 dòng có nhiều giá trị). */
export function useColumnFilters<T>(base: T[], getters: Record<string, Getter<T>>) {
  const [filters, setFilters] = useState<ColFilters>({});
  const active = (Object.entries(filters) as [string, string[]][]).filter(([k, v]) => v.length && getters[k]);
  const match = (x: T, skip?: string) => active.every(([k, sel]) => k === skip || valuesOf(getters[k], x).some((v) => sel.includes(v)));
  const rows = useMemo(() => (active.length ? base.filter((x) => match(x)) : base), [base, filters, getters]); // eslint-disable-line react-hooks/exhaustive-deps
  const valuesFor = (key: string): ColValue[] => {
    const get = getters[key];
    if (!get) return [];
    const m = new Map<string, number>();
    base.forEach((x) => {
      if (!match(x, key)) return;
      new Set(valuesOf(get, x)).forEach((v) => m.set(v, (m.get(v) || 0) + 1));
    });
    // giá trị đang chọn nhưng không còn dòng nào vẫn hiện để bỏ chọn được
    (filters[key] || []).forEach((v) => m.has(v) || m.set(v, 0));
    return [...m].map(([value, count]) => ({ value, count })).sort((a, b) => order(a.value, b.value));
  };
  const set = (key: string, sel: string[]) =>
    setFilters((f) => {
      const n = { ...f };
      if (sel.length) n[key] = sel;
      else delete n[key];
      return n;
    });
  const funnel = (key: string, label?: string) => <ColumnFilterButton key={`f-${key}`} label={label} selected={filters[key] || []} values={() => valuesFor(key)} onApply={(s) => set(key, s)} />;
  return { rows, filters, active: active.map(([k]) => k), set, clear: () => setFilters({}), funnel };
}

/** Thanh hiện các cột đang lọc — bấm ✕ để bỏ từng cột, hoặc "Xoá lọc cột". */
export const ColumnFilterBar: React.FC<{ active: string[]; filters: ColFilters; labelOf: (k: string) => string; onRemove: (k: string) => void; onClear: () => void; className?: string }> = ({
  active,
  filters,
  labelOf,
  onRemove,
  onClear,
  className = '',
}) =>
  active.length ? (
    <div className={`flex flex-wrap items-center gap-1.5 px-3 py-1.5 bg-[#f3f7fc] border-b border-slate-200 text-[12px] ${className}`} data-testid="colfilter-bar">
      <Filter size={12} className="text-[#1f5fa8]" />
      <span className="text-slate-500">Lọc theo cột:</span>
      {active.map((k) => {
        const sel = filters[k] || [];
        return (
          <span key={k} className="inline-flex items-center gap-1 rounded-[3px] border border-[#b9d0ec] bg-white px-1.5 py-0.5 text-slate-700" title={sel.map((v) => v || '(Trống)').join(', ')}>
            <b className="font-semibold">{labelOf(k)}</b>: {sel.length === 1 ? sel[0] || '(Trống)' : `${sel.length} giá trị`}
            <button type="button" onClick={() => onRemove(k)} className="text-slate-400 hover:text-rose-600 cursor-pointer" title="Bỏ lọc cột này">
              <X size={11} />
            </button>
          </span>
        );
      })}
      <button type="button" onClick={onClear} className="ml-1 text-[#1f5fa8] hover:underline cursor-pointer font-semibold">
        Xoá lọc cột
      </button>
    </div>
  ) : null;

/** Nút phễu + bảng chọn giá trị (portal ra body để không bị cắt bởi bảng cuộn / tiêu đề cố định). */
export const ColumnFilterButton: React.FC<{ label?: string; selected: string[]; values: () => ColValue[]; onApply: (sel: string[]) => void }> = ({ label, selected, values, onApply }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const [list, setList] = useState<ColValue[]>([]);
  const [pick, setPick] = useState<Set<string>>(new Set());
  const [q, setQ] = useState('');
  const btn = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const on = selected.length > 0;
  const W = 280;

  const place = () => {
    const r = btn.current!.getBoundingClientRect();
    const h = box.current?.offsetHeight || 380;
    const left = Math.max(8, Math.min(r.left, window.innerWidth - W - 8));
    const top = r.bottom + 4 + h > window.innerHeight - 8 ? Math.max(8, r.top - 4 - h) : r.bottom + 4;
    setPos({ left, top });
  };
  const show = () => {
    setList(values());
    setPick(new Set(selected));
    setQ('');
    setOpen(true);
  };
  useLayoutEffect(() => {
    if (open) place();
  }, [open, list.length]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => !box.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation(); // không đóng màn / popup phía sau
      setOpen(false);
    };
    const away = (e: Event) => !box.current?.contains(e.target as Node) && place(); // bảng cuộn → bám theo nút phễu
    document.addEventListener('mousedown', down);
    window.addEventListener('keydown', key, true);
    window.addEventListener('scroll', away, true);
    window.addEventListener('resize', away);
    return () => {
      document.removeEventListener('mousedown', down);
      window.removeEventListener('keydown', key, true);
      window.removeEventListener('scroll', away, true);
      window.removeEventListener('resize', away);
    };
  }, [open]);

  const nq = q.trim().toLowerCase().normalize('NFC');
  const vis = nq ? list.filter((x) => (x.value || '(trống)').toLowerCase().normalize('NFC').includes(nq)) : list;
  const allOn = vis.length > 0 && vis.every((x) => pick.has(x.value));
  const someOn = vis.some((x) => pick.has(x.value));
  const changed = pick.size !== selected.length || selected.some((v) => !pick.has(v));
  const toggle = (v: string) =>
    setPick((p) => {
      const n = new Set(p);
      if (n.has(v)) n.delete(v);
      else n.add(v);
      return n;
    });
  const apply = () => {
    onApply(list.map((x) => x.value).filter((v) => pick.has(v)));
    setOpen(false);
  };

  return (
    <>
      <button
        ref={btn}
        type="button"
        onClick={(e) => (e.stopPropagation(), open ? setOpen(false) : show())}
        title={on ? `Đang lọc ${selected.length} giá trị — bấm để sửa` : `Lọc theo giá trị${label ? ` ${label}` : ''}`}
        aria-label={`Lọc cột${label ? ` ${label}` : ''}`}
        data-testid="colfilter-btn"
        className={`shrink-0 inline-flex items-center justify-center w-[20px] h-[20px] rounded-[3px] cursor-pointer transition-colors ${
          on ? 'bg-[#1f5fa8] text-white hover:bg-[#184d8a]' : open ? 'bg-slate-300 text-slate-700' : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
        }`}
      >
        <Filter size={12} fill={on ? 'currentColor' : 'none'} />
      </button>
      {open &&
        createPortal(
          <div
            ref={box}
            role="dialog"
            aria-label="Lọc theo giá trị"
            data-testid="colfilter-pop"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'fixed', left: pos.left, top: pos.top, width: W, zIndex: 1000 }}
            className="bg-white border border-slate-300 rounded-[4px] shadow-xl text-[12.5px] font-normal normal-case tracking-normal text-slate-700 text-left"
          >
            <div className="flex items-center px-3 pt-2.5 pb-1.5">
              <span className="font-bold text-[13px] text-slate-800">Giá trị</span>
              {on && (
                <button type="button" onClick={() => (onApply([]), setOpen(false))} className="ml-auto text-[12px] text-[#1f5fa8] hover:underline cursor-pointer">
                  Bỏ lọc
                </button>
              )}
            </div>
            <div className="px-3 pb-2">
              <div className="relative">
                <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && changed && apply()} placeholder="Nhập để tìm..." className="w-full h-7 pl-7 pr-2 border border-slate-300 rounded-[3px] outline-none focus:border-[#1f5fa8] text-[12.5px]" />
              </div>
            </div>
            <label className="flex items-center gap-2 px-3 py-1.5 border-y border-slate-200 font-semibold cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                className="accent-[#1f5fa8] w-3.5 h-3.5"
                checked={allOn}
                ref={(el) => {
                  if (el) el.indeterminate = !allOn && someOn;
                }}
                onChange={() =>
                  setPick((p) => {
                    const n = new Set(p);
                    vis.forEach((x) => (allOn ? n.delete(x.value) : n.add(x.value)));
                    return n;
                  })
                }
              />
              Chọn tất cả{nq ? ' (kết quả tìm)' : ''}
            </label>
            <div className="max-h-[240px] overflow-auto py-1">
              {vis.map((x) => (
                <label key={x.value} className="flex items-center gap-2 px-3 py-[5px] cursor-pointer hover:bg-[#eef4fb]" data-testid="colfilter-opt">
                  <input type="checkbox" className="accent-[#1f5fa8] w-3.5 h-3.5 shrink-0" checked={pick.has(x.value)} onChange={() => toggle(x.value)} />
                  <span className={`flex-1 min-w-0 truncate ${x.value ? '' : 'italic text-slate-500'}`} title={x.value || '(Trống)'}>
                    {x.value || '(Trống)'}
                  </span>
                  <span className="shrink-0 text-[11px] text-slate-400 tabular-nums">{x.count}</span>
                </label>
              ))}
              {!vis.length && <p className="px-3 py-3 text-center text-slate-400">Không có giá trị phù hợp</p>}
            </div>
            <div className="flex gap-2 p-2 border-t border-slate-200 bg-[#f7f9fc]">
              <button type="button" onClick={() => setOpen(false)} className="flex-1 h-7 rounded-[3px] border border-slate-300 bg-white hover:bg-slate-50 font-semibold cursor-pointer">
                Huỷ
              </button>
              <button
                type="button"
                disabled={!changed}
                onClick={apply}
                className="flex-1 h-7 rounded-[3px] border border-[#1f5fa8] bg-[#1f5fa8] text-white font-semibold cursor-pointer hover:bg-[#184d8a] disabled:opacity-45 disabled:cursor-default disabled:hover:bg-[#1f5fa8]"
              >
                Áp dụng
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
