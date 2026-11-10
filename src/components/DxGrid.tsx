/**
 * DxGrid — lưới theo phong cách màn mục tiêu (DevExpress): toolbar Export to XLSX + Enable Virtual Scrolling,
 * vùng kéo cột để nhóm, ô tìm kiếm, cột chọn dòng, lọc theo cột, phân trang + Page Size.
 */
import React, { useMemo, useState } from 'react';
import { Filter, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, X } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Company } from '../catalog/companyMaster';

export interface Col {
  key: string;
  label: string;
  get: (r: Company) => string;
  truncate?: boolean;
  center?: boolean;
  check?: boolean; // hiển thị checkbox (boolean)
  checkOn?: string; // giá trị get() được coi là tick (mặc định 'Active')
}

const BLUE = '#0d6efd';
const bd = 'border border-slate-300';

export const DxGrid: React.FC<{
  rows: Company[];
  columns: Col[];
  exportName: string;
  renderActions: (r: Company) => React.ReactNode;
}> = ({ rows, columns, exportName, renderActions }) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [virtual, setVirtual] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [groupBy, setGroupBy] = useState<string | null>(null);
  const [dragKey, setDragKey] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && !columns.some((c) => c.get(r).toLowerCase().includes(q))) return false;
      return Object.entries(filters).every(([k, v]) => {
        const c = columns.find((x) => x.key === k);
        return !v.trim() || !c || c.get(r).toLowerCase().includes(v.trim().toLowerCase());
      });
    });
  }, [rows, columns, search, filters]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const cur = Math.min(page, pages);
  const visible = virtual ? filtered : filtered.slice((cur - 1) * pageSize, cur * pageSize);
  const groupCol = columns.find((c) => c.key === groupBy);

  const groups: { label: string | null; rows: Company[] }[] = useMemo(() => {
    if (!groupCol) return [{ label: null, rows: visible }];
    const m = new Map<string, Company[]>();
    visible.forEach((r) => m.set(groupCol.get(r) || '(trống)', [...(m.get(groupCol.get(r) || '(trống)') || []), r]));
    return [...m.entries()].map(([label, rs]) => ({ label, rows: rs }));
  }, [visible, groupCol]);

  const allSelected = visible.length > 0 && visible.every((r) => selected.has(r.id));
  const toggleAll = () =>
    setSelected((prev) => {
      const n = new Set(prev);
      visible.forEach((r) => (allSelected ? n.delete(r.id) : n.add(r.id)));
      return n;
    });
  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const exportXlsx = () => {
    const data = filtered.map((r) => columns.map((c) => c.get(r)));
    const ws = XLSX.utils.aoa_to_sheet([columns.map((c) => c.label), ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${exportName}.xlsx`);
  };

  const cb = 'w-[18px] h-[18px] cursor-pointer';
  const pgBtn = 'h-8 w-8 flex items-center justify-center border border-slate-300 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-default';

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
      <div className="border border-slate-300 bg-white text-sm text-slate-900">
        {/* Toolbar */}
        <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-300">
          <button type="button" onClick={exportXlsx} className="hover:text-[#0d6efd] cursor-pointer">Export to XLSX</button>
          <span className="h-6 w-px bg-slate-300" />
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input type="checkbox" checked={virtual} onChange={(e) => setVirtual(e.target.checked)} className={cb} style={{ accentColor: BLUE }} />
            Enable Virtual Scrolling
          </label>
        </div>

        {/* Vùng nhóm + tìm kiếm */}
        <div
          className="flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-300"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => { if (dragKey) setGroupBy(dragKey); setDragKey(null); }}
        >
          {groupCol ? (
            <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-bold">
              {groupCol.label}
              <button type="button" onClick={() => setGroupBy(null)} className="text-slate-500 hover:text-slate-800 cursor-pointer"><X size={13} /></button>
            </span>
          ) : (
            <span>Drag a column header here to group by that column</span>
          )}
          <div className="relative w-64">
            <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Enter text to search..."
              className={`w-full pl-8 pr-2 py-1.5 ${bd} rounded text-sm outline-none focus:border-[#0d6efd] placeholder:text-slate-400`}
            />
          </div>
        </div>

        {/* Bảng */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 font-bold">
                <th className={`${bd} w-12 px-3 py-2`}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className={cb} style={{ accentColor: BLUE }} />
                </th>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    draggable
                    onDragStart={() => setDragKey(c.key)}
                    className={`${bd} px-3 py-2 cursor-grab whitespace-nowrap`}
                  >
                    <div className="relative flex items-center justify-between gap-2">
                      <span className="flex-1 text-center">{c.label}</span>
                      <button
                        type="button"
                        onClick={() => setOpenFilter((o) => (o === c.key ? null : c.key))}
                        className={`cursor-pointer ${filters[c.key]?.trim() ? 'text-[#0d6efd]' : 'text-slate-500 hover:text-slate-800'}`}
                        title="Filter"
                      >
                        <Filter size={14} />
                      </button>
                      {openFilter === c.key && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(null)} />
                          <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-300 rounded shadow-lg z-20 p-2 font-normal">
                            <input
                              autoFocus
                              value={filters[c.key] || ''}
                              onChange={(e) => { setFilters((f) => ({ ...f, [c.key]: e.target.value })); setPage(1); }}
                              placeholder={`Filter ${c.label}...`}
                              className={`w-full px-2 py-1.5 ${bd} rounded text-sm outline-none focus:border-[#0d6efd]`}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </th>
                ))}
                <th className={`${bd} px-3 py-2 w-24 text-center sticky right-0 bg-slate-50`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr><td colSpan={columns.length + 2} className={`${bd} py-10 text-center text-slate-400`}>No data</td></tr>
              )}
              {groups.map((g) => (
                <React.Fragment key={g.label ?? 'all'}>
                  {g.label !== null && (
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={columns.length + 2} className={`${bd} px-3 py-2`}>
                        <ChevronDown size={14} className="inline mr-1" />{groupCol?.label}: {g.label} ({g.rows.length})
                      </td>
                    </tr>
                  )}
                  {g.rows.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className={`${bd} px-3 py-2.5 text-center`}>
                        <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleOne(r.id)} className={cb} style={{ accentColor: BLUE }} />
                      </td>
                      {columns.map((c) => (
                        <td key={c.key} className={`${bd} px-3 py-2.5 whitespace-nowrap ${c.center ? 'text-center' : ''}`}>
                          {c.check ? (
                            <input type="checkbox" checked={c.get(r) === (c.checkOn ?? 'Active')} readOnly className={cb} style={{ accentColor: BLUE }} />
                          ) : c.truncate ? (
                            <span className="block max-w-[220px] truncate" title={c.get(r)}>{c.get(r)}</span>
                          ) : (
                            c.get(r)
                          )}
                        </td>
                      ))}
                      <td className={`${bd} px-3 py-2.5 sticky right-0 bg-white`}>{renderActions(r)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-300">
          {virtual ? <span className="text-slate-500">{filtered.length} rows</span> : (
            <div className="flex items-center">
              <button type="button" className={`${pgBtn} rounded-l`} disabled={cur === 1} onClick={() => setPage(1)}><ChevronsLeft size={16} /></button>
              <button type="button" className={pgBtn} disabled={cur === 1} onClick={() => setPage(cur - 1)}><ChevronLeft size={16} /></button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button key={n} type="button" onClick={() => setPage(n)} className={`h-8 min-w-8 px-2 border border-slate-300 cursor-pointer ${n === cur ? 'bg-[#0d6efd] text-white border-[#0d6efd]' : 'bg-white text-slate-700 hover:bg-slate-50'}`}>{n}</button>
              ))}
              <button type="button" className={pgBtn} disabled={cur === pages} onClick={() => setPage(cur + 1)}><ChevronRight size={16} /></button>
              <button type="button" className={`${pgBtn} rounded-r`} disabled={cur === pages} onClick={() => setPage(pages)}><ChevronsRight size={16} /></button>
            </div>
          )}
          <label className="flex items-center gap-2 font-bold">
            Page Size:
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className={`${bd} rounded px-2 py-1 font-normal bg-white`}>
              {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};
