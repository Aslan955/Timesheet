/** Mảnh UI dùng chung của màn Dự án (StatusComponent, DxProgressBar, DetailField, lưới tab con). */
import React from 'react';
import { Eye, FileSpreadsheet, Pencil, Plus, Trash2 } from 'lucide-react';
import { erp } from '../erp/Erp';
import { STATUS_COLOR } from '../../projects/projectData';

/** StatusComponent.razor — pill chữ hoa, màu theo MapStatusColor. */
export const StatusPill: React.FC<{ name: string }> = ({ name }) => {
  const c = STATUS_COLOR[name] || '#64748b';
  return (
    <span className="inline-block px-3 py-[3px] rounded-full text-[10px] font-black uppercase tracking-[0.3px] whitespace-nowrap" style={{ color: c, background: `${c}1a`, border: `1px solid ${c}55` }}>
      {name || '—'}
    </span>
  );
};

/** DxProgressBar 0–100, nhãn "{value}%". */
export const Progress: React.FC<{ value: number | null }> = ({ value }) => (
  <div className="relative h-[14px] rounded-full bg-slate-200 overflow-hidden">
    <div className="absolute inset-y-0 left-0 bg-[#1f5fa8]/70" style={{ width: `${Math.max(0, Math.min(100, value ?? 0))}%` }} />
    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-slate-800">{value == null ? '%' : `${value}%`}</span>
  </div>
);

/** DetailFieldTextComponent — "Nhãn : giá trị". */
export const DetailField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex gap-2 py-1 text-[13px]">
    <b className="w-[170px] shrink-0 text-slate-700">{label}</b>
    <span className="text-slate-500">:</span>
    <span className="min-w-0 text-slate-800">{children === '' || children == null ? <span className="text-slate-400">—</span> : children}</span>
  </div>
);

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h5 className="mt-5 mb-1.5 text-[14px] font-semibold text-[#6b778c]">{children}</h5>;

/** Lưới tab con kiểu DxGrid: toolbar Add New / Export to XLSX / Export Selected Rows Only + cột thao tác. */
export const MiniGrid: React.FC<{
  cols: string[];
  rows: React.ReactNode[][];
  addNew?: boolean;
  addLabel?: string;
  toolbar?: boolean;
  actions?: { view?: boolean; edit?: boolean; del?: boolean } | null;
  extraActions?: React.ReactNode;
  footer?: React.ReactNode;
  onAction?: (what: string, i: number) => void;
}> = ({ cols, rows, addNew, addLabel = 'Add New', toolbar = true, actions, extraActions, footer, onAction }) => (
  <div className="border border-slate-300 rounded-[3px] overflow-hidden">
    {(toolbar || extraActions) && (
      <div className="flex flex-wrap items-center gap-2 px-2 py-1.5 bg-[#f7f9fc] border-b border-slate-200">
        {addNew && (
          <button type="button" onClick={() => onAction?.('add', -1)} className="inline-flex items-center gap-1 h-7 px-3 rounded-[3px] bg-[#1f5fa8] text-white text-[12px] font-semibold cursor-pointer">
            <Plus size={13} /> {addLabel}
          </button>
        )}
        {toolbar && (
          <>
            <button type="button" className="inline-flex items-center gap-1 h-7 px-3 rounded-[3px] border border-slate-300 bg-white text-[12px] font-semibold cursor-pointer">
              <FileSpreadsheet size={13} className="text-emerald-700" /> Export to XLSX
            </button>
            <label className="ml-auto flex items-center gap-1.5 text-[12px] text-slate-600">
              <input type="checkbox" className="accent-[#1f5fa8]" /> Export Selected Rows Only
            </label>
          </>
        )}
        {extraActions}
      </div>
    )}
    <div className="overflow-x-auto">
      <table className={erp.table}>
        <thead>
          <tr>
            {cols.map((c) => (
              <th key={c} className={`${erp.th} text-left`}>
                {c}
              </th>
            ))}
            {actions && <th className={`${erp.th} text-center w-24`}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={erp.tr}>
              {r.map((c, j) => (
                <td key={j} className={erp.td}>
                  {c}
                </td>
              ))}
              {actions && (
                <td className={`${erp.td} text-center`}>
                  <div className="flex justify-center gap-2 text-slate-500">
                    {actions.view && <Eye size={13} className="cursor-pointer hover:text-[#1f5fa8]" onClick={() => onAction?.('view', i)} />}
                    {actions.edit && <Pencil size={13} className="cursor-pointer hover:text-[#1f5fa8]" onClick={() => onAction?.('edit', i)} />}
                    {actions.del && <Trash2 size={13} className="cursor-pointer hover:text-rose-600" onClick={() => onAction?.('delete', i)} />}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={cols.length + (actions ? 1 : 0)} className="text-center text-slate-400 py-6 border border-slate-200">
                No data to display
              </td>
            </tr>
          )}
        </tbody>
        {footer && (
          <tfoot>
            <tr className={erp.totalRow}>{footer}</tr>
          </tfoot>
        )}
      </table>
    </div>
  </div>
);
