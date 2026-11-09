/**
 * Danh sách dự án — bám ProjectsListComponent.razor + ProjectService.GetAll / GetStatusList.
 * Tab trạng thái (kèm số đếm theo phạm vi), DxGrid: tìm kiếm, phễu lọc cột, nhóm, chọn dòng, phân trang 10/20/50/100,
 * màu chữ dòng theo tiến độ, Xuất XLSX, thao tác Xem / Xoá (chỉ Open + Projects.Delete).
 */
import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { Eye, FileSpreadsheet, Search, Trash2 } from 'lucide-react';
import { erp } from '../erp/Erp';
import { ColumnFilterBar, useColumnFilters } from '../erp/ColumnFilter';
import { useProjects } from '../../projects/ProjectsContext';
import { INITIALIZED_LIST, LIST_TABS, PERMS, QProject, S, dmy, inScope, money, projectTypeName, rowColor, statusCounts, statusName, svc } from '../../projects/projectData';
import { ConfirmDialog } from './ProjectPopups';
import { StatusPill, Progress } from './ProjectUi';

// Cột lưới (caption theo key PL_* trong imis-vi.xml)
const COLS: { key: string; label: string; get: (p: QProject) => string; search: boolean }[] = [
  { key: 'code', label: 'Mã dự án', get: (p) => p.projectCode, search: true },
  { key: 'master', label: 'Mã tổng', get: (p) => p.masterCode || '', search: true },
  { key: 'old', label: 'Mã cũ', get: (p) => p.oldProjectCode || '', search: true },
  { key: 'name', label: 'Tên dự án', get: (p) => p.projectName, search: true },
  { key: 'pm', label: 'Quản lý dự án', get: (p) => p.pm, search: true },
  { key: 'dept', label: 'Phòng ban', get: (p) => p.department, search: true },
  { key: 'customer', label: 'Khách hàng', get: (p) => p.customer, search: true },
  { key: 'priority', label: 'Độ ưu tiên', get: (p) => p.priority, search: true },
  { key: 'size', label: 'Quy mô', get: (p) => p.size, search: true },
  { key: 'type', label: 'Loại', get: (p) => projectTypeName(p.projectTypeId), search: true },
  { key: 'devCost', label: 'Chi phí phát triển', get: (p) => money(p.targetedCost), search: false },
  { key: 'bac', label: 'BAC', get: (p) => money(p.bac), search: false },
  { key: 'actualCost', label: 'Chi phí thực tế', get: (p) => money(p.actualCost), search: false },
  { key: 'start', label: 'Ngày bắt đầu', get: (p) => dmy(p.actualStartDate), search: false },
  { key: 'end', label: 'Ngày kết thúc', get: (p) => dmy(p.actualEndDate), search: false },
  { key: 'planned', label: 'Tiến độ kế hoạch', get: (p) => (p.plannedComplete == null ? '' : `${p.plannedComplete}%`), search: false },
  { key: 'actual', label: 'Tiến độ thực tế', get: (p) => (p.actualCompleted == null ? '' : `${p.actualCompleted}%`), search: false },
  { key: 'status', label: 'Trạng thái', get: (p) => statusName(p.statusId), search: true },
];
const GROUPS = [
  { key: '', label: 'Không nhóm' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'dept', label: 'Phòng ban' },
  { key: 'pm', label: 'Quản lý dự án' },
  { key: 'type', label: 'Loại' },
  { key: 'master', label: 'Mã tổng' },
];
const ROW_COLOR: Record<string, string> = { red: 'text-red-600', black: 'text-slate-900', green: 'text-green-600' };

export const ProjectsListView: React.FC<{ onOpen: (id: string) => void }> = ({ onOpen }) => {
  const { projects, persona, has, ctx, remove, toast } = useProjects();
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(0);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [del, setDel] = useState<QProject | null>(null);

  // Phạm vi (ProjectVisibility.ApplyScope) → sắp CreationTime giảm dần
  const scoped = useMemo(() => projects.filter((p) => inScope(p, persona)).sort((a, b) => b.creationTime.localeCompare(a.creationTime)), [projects, persona]);
  const counts = statusCounts(scoped);
  const byTab = useMemo(() => scoped.filter((p) => tab === 0 || p.statusId === tab), [scoped, tab]);
  const searched = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? byTab.filter((p) => COLS.some((c) => c.search && c.get(p).toLowerCase().includes(n))) : byTab;
  }, [byTab, q]);
  const getters = useMemo(() => Object.fromEntries(COLS.map((c) => [c.key, c.get])), []);
  const cf = useColumnFilters(searched, getters);
  const rows = cf.rows;
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const cur = Math.min(page, pages - 1);
  const pageRows = rows.slice(cur * pageSize, cur * pageSize + pageSize);

  const grouped = useMemo(() => {
    if (!group) return [{ key: '', items: pageRows }];
    const g = COLS.find((c) => c.key === group)!;
    const m = new Map<string, QProject[]>();
    pageRows.forEach((p) => m.set(g.get(p), [...(m.get(g.get(p)) || []), p]));
    return [...m].map(([key, items]) => ({ key, items }));
  }, [pageRows, group]);

  const exportXlsx = () => {
    const data = [['#', ...COLS.map((c) => c.label)], ...rows.map((p, i) => [i + 1, ...COLS.map((c) => c.get(p))])];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data), 'Sheet1');
    XLSX.writeFile(wb, 'ExportResult.xlsx');
  };

  const doDelete = (p: QProject) => {
    const r = svc.canDelete(p, ctx());
    if ('message' in r) return toast('error', r.message);
    remove(p.id);
    toast('success', 'Delete record successfully!');
  };

  const allOnPage = pageRows.length > 0 && pageRows.every((p) => sel.has(p.id));
  const th = `${erp.th} text-left`;
  let idx = cur * pageSize;

  return (
    <div className="bg-white border border-slate-300 rounded-[4px]">
      {/* DxTabs trạng thái */}
      <div className="flex flex-wrap gap-0.5 border-b border-slate-300 px-2 pt-2">
        {LIST_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTab(t.id);
              setPage(0);
            }}
            className={`h-8 px-4 -mb-px rounded-t-[4px] border text-[12px] font-bold cursor-pointer ${tab === t.id ? 'bg-white border-slate-300 border-b-white text-[#1f5fa8]' : 'bg-[#e3e8ef] border-transparent text-slate-600 hover:bg-[#d8dee8]'}`}
          >
            {t.name} ({counts[t.id] ?? 0})
          </button>
        ))}
      </div>

      {/* Toolbar + group panel + search box */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-slate-200 bg-[#f7f9fc]">
        <button type="button" onClick={exportXlsx} className="inline-flex items-center gap-1.5 h-7 px-3 rounded-[3px] border border-slate-300 bg-white text-[12px] font-semibold hover:bg-slate-50 cursor-pointer">
          <FileSpreadsheet size={13} className="text-emerald-700" /> Xuất XLSX
        </button>
        <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
          Nhóm theo
          <select value={group} onChange={(e) => setGroup(e.target.value)} className={`${erp.input} h-7`}>
            {GROUPS.map((g) => (
              <option key={g.key} value={g.key}>
                {g.label}
              </option>
            ))}
          </select>
        </label>
        {sel.size > 0 && <span className="text-[12px] text-slate-500">Đã chọn {sel.size} dòng (Xuất XLSX vẫn xuất toàn bộ — ExportSelectedRowsOnly = false)</span>}
        <div className="relative ml-auto w-64">
          <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
            placeholder="Nhập nội dung tìm kiếm..."
            className={`${erp.inputFull} h-7 pl-7`}
          />
        </div>
      </div>
      <ColumnFilterBar active={cf.active} filters={cf.filters} labelOf={(k) => COLS.find((c) => c.key === k)?.label || k} onRemove={(k) => cf.set(k, [])} onClear={cf.clear} />

      <div className="overflow-x-auto">
        <table className={erp.table}>
          <thead>
            <tr>
              <th className={`${erp.th} w-8 text-center sticky left-0 z-10`}>
                <input
                  type="checkbox"
                  className="accent-[#1f5fa8]"
                  checked={allOnPage}
                  onChange={() =>
                    setSel((s) => {
                      const n = new Set(s);
                      pageRows.forEach((p) => (allOnPage ? n.delete(p.id) : n.add(p.id)));
                      return n;
                    })
                  }
                />
              </th>
              <th className={`${erp.th} w-10 text-center`}>#</th>
              {COLS.map((c) => (
                <th key={c.key} className={th}>
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    {cf.funnel(c.key, c.label)}
                  </span>
                </th>
              ))}
              <th className={`${erp.th} text-center sticky right-0 z-10`}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {grouped.map((g) => (
              <React.Fragment key={g.key || 'all'}>
                {group && (
                  <tr className="bg-[#eef3f9]">
                    <td colSpan={COLS.length + 3} className="border border-slate-200 px-2.5 py-1 font-semibold text-[#1e3a5f]">
                      {GROUPS.find((x) => x.key === group)?.label}: {g.key || '(Trống)'} <span className="font-normal text-slate-500">(Count: {g.items.length})</span>
                    </td>
                  </tr>
                )}
                {g.items.map((p) => {
                  idx += 1;
                  const linkable = !INITIALIZED_LIST.includes(p.statusId);
                  return (
                    <tr key={p.id} className={`${erp.tr} ${ROW_COLOR[rowColor(p)]}`}>
                      <td className={`${erp.td} text-center sticky left-0 bg-inherit`}>
                        <input
                          type="checkbox"
                          className="accent-[#1f5fa8]"
                          checked={sel.has(p.id)}
                          onChange={() =>
                            setSel((s) => {
                              const n = new Set(s);
                              if (n.has(p.id)) n.delete(p.id);
                              else n.add(p.id);
                              return n;
                            })
                          }
                        />
                      </td>
                      <td className={`${erp.td} text-center`}>{idx}</td>
                      <td className={`${erp.td} whitespace-nowrap`}>
                        {linkable ? (
                          <button type="button" onClick={() => onOpen(p.id)} className="text-[#1f5fa8] hover:underline cursor-pointer font-mono">
                            {p.projectCode}
                          </button>
                        ) : (
                          <span className="font-mono">{p.projectCode}</span>
                        )}
                        {p.pakdId && <span className="ml-1.5 px-1 rounded-[3px] bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold" title="Sinh từ màn Dự án kinh doanh (Projects.PakdId) — chỉ prototype hiện nhãn này">DAKD</span>}
                      </td>
                      <td className={`${erp.td} font-mono`}>{p.masterCode}</td>
                      <td className={`${erp.td} font-mono`}>{p.oldProjectCode}</td>
                      <td className={`${erp.td} min-w-[220px]`}>{p.projectName}</td>
                      <td className={`${erp.td} whitespace-nowrap`}>{p.pm}</td>
                      <td className={`${erp.td} whitespace-nowrap`}>{p.department}</td>
                      <td className={`${erp.td} min-w-[200px]`}>{p.customer}</td>
                      <td className={erp.td}>{p.priority}</td>
                      <td className={erp.td}>{p.size}</td>
                      <td className={`${erp.td} whitespace-nowrap`}>{projectTypeName(p.projectTypeId)}</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(p.targetedCost)}</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(p.bac)}</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(p.actualCost)}</td>
                      <td className={`${erp.td} text-center`}>{dmy(p.actualStartDate)}</td>
                      <td className={`${erp.td} text-center`}>{dmy(p.actualEndDate)}</td>
                      <td className={`${erp.td} min-w-[140px]`}>
                        <Progress value={p.plannedComplete} />
                      </td>
                      <td className={`${erp.td} min-w-[140px]`}>
                        <Progress value={p.actualCompleted} />
                      </td>
                      <td className={erp.td}>
                        <StatusPill name={statusName(p.statusId)} />
                      </td>
                      <td className={`${erp.td} sticky right-0 bg-white`}>
                        <div className="flex items-center justify-center gap-2 text-slate-500">
                          <button type="button" title="View" onClick={() => onOpen(p.id)} className="hover:text-[#1f5fa8] cursor-pointer">
                            <Eye size={14} />
                          </button>
                          {p.statusId === S.OPEN && has(PERMS.Delete) && (
                            <button type="button" title="Delete" onClick={() => setDel(p)} className="hover:text-rose-600 cursor-pointer">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={COLS.length + 3} className="text-center text-slate-400 py-8 border border-slate-200">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50">
              <td colSpan={COLS.length + 2} className="border border-slate-200" />
              <td className="border border-slate-200 px-2 py-1 text-[11.5px] text-slate-600 text-center whitespace-nowrap">Count: {rows.length}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pager */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-t border-slate-200 text-[12px] text-slate-600">
        <span>Page size</span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(0);
          }}
          className={`${erp.input} h-7`}
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <div className="ml-auto flex items-center gap-1">
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} type="button" onClick={() => setPage(i)} className={`h-7 min-w-7 px-2 rounded-[3px] border cursor-pointer ${i === cur ? 'bg-[#1f5fa8] border-[#1f5fa8] text-white' : 'border-slate-300 bg-white hover:bg-slate-50'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="px-3 py-1.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
        Màu chữ dòng: <span className="text-red-600 font-semibold">đỏ</span> = tiến độ thực tế &lt; kế hoạch hoặc thiếu số · <span className="font-semibold">đen</span> = bằng nhau · <span className="text-green-600 font-semibold">xanh</span> = vượt kế hoạch. Đang xem với “{persona.label}” — {persona.viewAll ? 'vai trò xem tất cả' : 'chỉ dự án mình tạo / làm PM / là thành viên'}.
      </div>

      {del && <ConfirmDialog message="Are you sure you want to delete this record?" onConfirm={() => doDelete(del)} onClose={() => setDel(null)} />}
    </div>
  );
};
