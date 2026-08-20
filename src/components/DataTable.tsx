/**
 * DataTable — bảng dùng chung theo mẫu "PAKD Bidding Management":
 *  - Toolbar: Export XLSX, ô tìm kiếm, Choose columns, Clear column filters.
 *  - Lọc theo từng cột (icon phễu + popover nhập text).
 *  - Chỉ báo "Filtering by column ✕" khi đang lọc cột.
 *  - Dòng Tổng ở cuối cho các cột số.
 *  - Cột Actions (vd icon con mắt).
 * Kèm các thành phần phụ: Breadcrumb, StatCard, StatGrid.
 */
import React, { useMemo, useState } from 'react';
import { Filter, Search, Eye, FileSpreadsheet, Columns3, FilterX, ChevronRight } from 'lucide-react';
import * as XLSX from 'xlsx';

// ==========================================================================
// Breadcrumb
// ==========================================================================
export const Breadcrumb: React.FC<{ items: string[] }> = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-4 flex-wrap">
    {items.map((it, i) => (
      <span key={i} className="flex items-center gap-1.5">
        {i > 0 && <ChevronRight size={14} className="text-slate-300" />}
        <span className={i === items.length - 1 ? 'font-bold text-slate-700' : 'hover:text-slate-700'}>{it}</span>
      </span>
    ))}
  </nav>
);

// ==========================================================================
// Stat cards
// ==========================================================================
export interface StatItem {
  label: string;
  value: React.ReactNode;
  tone?: 'default' | 'warning' | 'danger' | 'success';
}
const toneCls: Record<string, string> = {
  default: 'bg-white border-slate-200',
  warning: 'bg-amber-50/60 border-amber-200',
  danger: 'bg-rose-50/60 border-rose-200',
  success: 'bg-emerald-50/60 border-emerald-200',
};
const toneValue: Record<string, string> = {
  default: 'text-slate-800',
  warning: 'text-amber-600',
  danger: 'text-rose-600',
  success: 'text-emerald-600',
};
export const StatGrid: React.FC<{ items: StatItem[] }> = ({ items }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 mb-5">
    {items.map((s, i) => (
      <div key={i} className={`rounded-xl border shadow-xs px-4 py-3 ${toneCls[s.tone || 'default']}`}>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">{s.label}</p>
        <p className={`text-2xl font-black ${toneValue[s.tone || 'default']}`}>{s.value}</p>
      </div>
    ))}
  </div>
);

// ==========================================================================
// DataTable
// ==========================================================================
export interface Column<T> {
  key: string;
  label: string;
  get: (row: T) => string | number;          // dùng cho lọc / tìm kiếm / tổng / export
  render?: (row: T) => React.ReactNode;        // nội dung ô (mặc định = get)
  numeric?: boolean;                           // canh phải
  total?: boolean;                             // cộng vào dòng Tổng
  filterable?: boolean;                        // hiện icon phễu (mặc định true)
  width?: string;                              // vd 'w-32'
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  onView?: (row: T) => void;                   // icon con mắt ở cột Actions
  actions?: (row: T) => React.ReactNode;       // tuỳ biến cột Actions (ghi đè onView)
  searchPlaceholder?: string;
  exportFileName?: string;                     // tên file XLSX (không đuôi)
  totalLabel?: string;                         // nhãn dòng tổng, vd "Tổng: N bản ghi"
}

const fmt = (v: string | number) => (typeof v === 'number' ? v.toLocaleString('en-US') : v);

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  onRowClick,
  onView,
  actions,
  searchPlaceholder = 'Search... (Enter)',
  exportFileName = 'export',
  totalLabel,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [colFilters, setColFilters] = useState<Record<string, string>>({});
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [showChooser, setShowChooser] = useState(false);

  const visibleColumns = columns.filter((c) => !hidden.has(c.key));
  const hasColFilters = Object.values(colFilters).some((v) => String(v).trim() !== '');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      // Global search trên mọi cột
      if (q && !columns.some((c) => String(c.get(row)).toLowerCase().includes(q))) return false;
      // Lọc theo từng cột
      for (const [key, val] of Object.entries(colFilters) as [string, string][]) {
        if (!val.trim()) continue;
        const col = columns.find((c) => c.key === key);
        if (!col) continue;
        if (!String(col.get(row)).toLowerCase().includes(val.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [rows, columns, search, colFilters]);

  const totals = useMemo(() => {
    const out: Record<string, number> = {};
    columns.forEach((c) => {
      if (c.total) out[c.key] = filtered.reduce((s, r) => s + (Number(c.get(r)) || 0), 0);
    });
    return out;
  }, [filtered, columns]);

  const hasTotals = columns.some((c) => c.total);

  const clearColFilters = () => setColFilters({});

  const exportXlsx = () => {
    const header = visibleColumns.map((c) => c.label);
    const data = filtered.map((r) => visibleColumns.map((c) => c.get(r)));
    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${exportFileName}.xlsx`);
  };

  return (
    <div>
      {/* Chỉ báo đang lọc theo cột */}
      {hasColFilters && (
        <button
          type="button"
          onClick={clearColFilters}
          className="inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-md bg-sky-50 text-sky-600 border border-sky-200 text-xs font-bold cursor-pointer hover:bg-sky-100"
        >
          <Filter size={12} /> Filtering by column <span className="text-sky-400">✕</span>
        </button>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={exportXlsx}
            className="px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet size={14} className="text-[#0fa57c]" /> Export XLSX
          </button>

          <div className="relative flex-1 min-w-[200px] max-w-sm ml-auto">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0fa57c] transition-all"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowChooser((s) => !s)}
              className="px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Columns3 size={14} /> Choose columns
            </button>
            {showChooser && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowChooser(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-20 p-2 max-h-72 overflow-y-auto">
                  {columns.map((c) => (
                    <label key={c.key} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!hidden.has(c.key)}
                        onChange={() =>
                          setHidden((prev) => {
                            const next = new Set(prev);
                            if (next.has(c.key)) next.delete(c.key);
                            else next.add(c.key);
                            return next;
                          })
                        }
                        className="w-4 h-4 rounded border-slate-300 text-[#0fa57c] accent-[#0fa57c]"
                      />
                      <span className="text-xs font-semibold text-slate-600">{c.label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={clearColFilters}
            className="px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <FilterX size={14} /> Clear column filters
          </button>
        </div>

        {/* Bảng */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="pl-4 pr-2 py-3 w-10">#</th>
                {visibleColumns.map((c) => (
                  <th key={c.key} className={`px-4 py-3 font-bold ${c.width || ''} ${c.numeric ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-1.5 ${c.numeric ? 'justify-end' : ''}`}>
                      <span>{c.label}</span>
                      {c.filterable !== false && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setOpenFilter((o) => (o === c.key ? null : c.key))}
                            className={`p-0.5 rounded cursor-pointer ${colFilters[c.key]?.trim() ? 'text-[#0fa57c]' : 'text-slate-300 hover:text-slate-500'}`}
                            title="Lọc cột"
                          >
                            <Filter size={12} />
                          </button>
                          {openFilter === c.key && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
                              <div className="absolute left-0 mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 p-2">
                                <input
                                  autoFocus
                                  value={colFilters[c.key] || ''}
                                  onChange={(e) => setColFilters((prev) => ({ ...prev, [c.key]: e.target.value }))}
                                  placeholder={`Lọc ${c.label}...`}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-xs outline-none focus:border-[#0fa57c] normal-case"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                {(onView || actions) && <th className="px-4 py-3 font-bold text-center w-20">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 2} className="py-12 text-center text-sm text-slate-300">
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr
                    key={getRowKey(row)}
                    onClick={() => onRowClick?.(row)}
                    className={`group hover:bg-slate-50/70 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    <td className="pl-4 pr-2 py-3 text-[11px] font-bold text-slate-300">{idx + 1}</td>
                    {visibleColumns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 ${c.numeric ? 'text-right font-mono text-slate-600' : 'text-slate-600'}`}>
                        {c.render ? c.render(row) : (() => { const v = c.get(row); return v === '' || v == null ? <span className="text-slate-300">—</span> : fmt(v); })()}
                      </td>
                    ))}
                    {(onView || actions) && (
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {actions ? (
                          actions(row)
                        ) : (
                          <button
                            type="button"
                            onClick={() => onView?.(row)}
                            className="p-1.5 rounded-lg text-sky-500 hover:bg-sky-50 cursor-pointer"
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
            {hasTotals && filtered.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200 text-xs font-black text-slate-700">
                  <td className="pl-4 pr-2 py-3" />
                  {visibleColumns.map((c, i) => (
                    <td key={c.key} className={`px-4 py-3 ${c.numeric ? 'text-right font-mono' : ''}`}>
                      {i === 0 && !c.total ? (totalLabel || `Tổng: ${filtered.length}`) : c.total ? fmt(totals[c.key]) : ''}
                    </td>
                  ))}
                  {(onView || actions) && <td />}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
