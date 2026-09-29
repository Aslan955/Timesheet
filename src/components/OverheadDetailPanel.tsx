/**
 * OverheadDetailPanel — "Chi phí vận hành chi tiết của khối".
 * Tab trong màn "Thông tin tài chính dự án": liệt kê chi tiết chi phí vận hành
 * của khối đang chọn (Diễn giải · Số tiền · Mã đơn vị · Tháng).
 * Khối lấy từ bộ chọn Khối của màn cha.
 */
import React, { useMemo, useState } from 'react';
import { FileSpreadsheet, Search } from 'lucide-react';
import { OVERHEAD_DETAIL } from '../finance/overheadDetail';

const YEARS = [2025, 2026, 2027];
const fmtVnd = (n: number) => n.toLocaleString('vi-VN');
const label = (k: string) => (k === 'Giải pháp - Dịch vụ' ? 'GPDV' : k);
const selectCls = 'bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer';

export const OverheadDetailPanel: React.FC<{ khoi: string }> = ({ khoi }) => {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (OVERHEAD_DETAIL[khoi] || []).filter((it) => {
      const [mm, yyyy] = it.month.split('/').map(Number);
      if (yyyy !== year) return false;
      if (month !== 'all' && mm !== month) return false;
      return !q || `${it.desc} ${it.unit} ${it.month}`.toLowerCase().includes(q);
    });
  }, [khoi, year, month, search]);

  const total = items.reduce((s, x) => s + x.amount, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h3 className="text-sm font-black text-slate-800">Chi phí vận hành chi tiết — Khối {label(khoi)}</h3>
          <p className="text-[11px] text-slate-500 italic">
            {month === 'all' ? `Kỳ năm ${year}` : `Tháng ${String(month).padStart(2, '0')} năm ${year}`} · Đơn vị: VNĐ
          </p>
        </div>
        <label className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Tháng</span>
          <select value={month} onChange={(e) => setMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))} className={selectCls}>
            <option value="all">Tất cả tháng</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>Tháng {String(m).padStart(2, '0')}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Năm</span>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={selectCls}>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
        <div className="relative w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm diễn giải, mã đơn vị..." className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white" />
        </div>
        <button className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer">
          <FileSpreadsheet size={14} className="text-slate-400" /> Export XLSX
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b-2 border-slate-200 text-slate-700 font-bold">
              <th className="px-4 py-3 w-12 text-center border-r border-slate-200">#</th>
              <th className="px-4 py-3 border-r border-slate-200">Diễn giải</th>
              <th className="px-4 py-3 border-r border-slate-200 text-right w-40">Số tiền</th>
              <th className="px-4 py-3 border-r border-slate-200 text-center w-32">Mã đơn vị</th>
              <th className="px-4 py-3 text-center w-28">Tháng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((it, i) => (
              <tr key={i} className="hover:bg-slate-50/60">
                <td className="px-4 py-2.5 text-center font-mono text-slate-300 border-r border-slate-100">{i + 1}</td>
                <td className="px-4 py-2.5 text-slate-700 border-r border-slate-100">{it.desc}</td>
                <td className="px-4 py-2.5 text-right font-mono text-slate-800 border-r border-slate-100">{fmtVnd(it.amount)}</td>
                <td className="px-4 py-2.5 text-center font-mono text-slate-600 border-r border-slate-100">{it.unit}</td>
                <td className="px-4 py-2.5 text-center font-mono text-slate-600">{it.month}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-slate-400">Không có khoản chi phí phù hợp.</td></tr>
            )}
          </tbody>
          {items.length > 0 && (
            <tfoot>
              <tr className="bg-slate-50 border-t-2 border-slate-200 font-black text-indigo-700">
                <td className="px-4 py-3 border-r border-slate-200" />
                <td className="px-4 py-3 border-r border-slate-200 text-slate-700">Tổng cộng ({items.length} khoản)</td>
                <td className="px-4 py-3 border-r border-slate-200 text-right font-mono">{fmtVnd(total)}</td>
                <td className="px-4 py-3 border-r border-slate-200" />
                <td className="px-4 py-3" />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
