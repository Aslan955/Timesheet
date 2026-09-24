/**
 * OverheadDetailPage — "Chi phí vận hành chi tiết của khối".
 * Màn hình riêng liệt kê chi tiết chi phí vận hành khối (Diễn giải · Số tiền ·
 * Mã đơn vị · Tháng). Mở từ menu hoặc khi bấm dòng "Σ Chi phí vận hành khối".
 */
import React, { useMemo, useState } from 'react';
import { Grid, ChevronRight, ArrowLeft, FileSpreadsheet, Search, Building2 } from 'lucide-react';
import { OVERHEAD_DETAIL, getOverheadFocusKhoi } from '../finance/overheadDetail';

const KHOIS = Object.keys(OVERHEAD_DETAIL);
const YEARS = [2025, 2026, 2027];
const fmtVnd = (n: number) => n.toLocaleString('vi-VN');
const label = (k: string) => (k === 'Giải pháp - Dịch vụ' ? 'GPDV' : k);

export const OverheadDetailPage: React.FC<{ onNavigate?: (item: string) => void }> = ({ onNavigate }) => {
  const [khoi, setKhoi] = useState<string>(() => (KHOIS.includes(getOverheadFocusKhoi()) ? getOverheadFocusKhoi() : 'G1'));
  const [year, setYear] = useState(2026);
  const [search, setSearch] = useState('');

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (OVERHEAD_DETAIL[khoi] || []).filter((it) => !q || `${it.desc} ${it.unit} ${it.month}`.toLowerCase().includes(q));
  }, [khoi, search]);

  const total = items.reduce((s, x) => s + x.amount, 0);

  return (
    <div className="p-4 sm:p-6 bg-slate-50/50 min-h-screen space-y-4 font-sans">
      {/* Breadcrumb + tiêu đề */}
      <div className="pb-2 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
        <div>
          <div className="flex items-center text-xs text-slate-500 gap-1.5 font-medium">
            <Grid size={13} className="text-slate-400" />
            <span>Quản lý dự án</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span>Thông tin tài chính</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-900 font-bold">Chi phí vận hành chi tiết</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-1">Chi Phí Kinh Doanh - Vận Hành Khối</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Chi tiết các khoản chi phí vận hành của khối. Đơn vị: <strong>VNĐ</strong>.</p>
        </div>
        {onNavigate && (
          <button
            onClick={() => onNavigate('Thông tin tài chính dự án')}
            className="self-start px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={14} /> Quay lại tài chính dự án
          </button>
        )}
      </div>

      {/* Bộ lọc */}
      <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-[auto_220px_auto_120px_1fr] items-center gap-3">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Building2 size={13} /> Khối</span>
        <select
          value={khoi}
          onChange={(e) => setKhoi(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
        >
          {KHOIS.map((k) => (
            <option key={k} value={k}>{label(k)}</option>
          ))}
        </select>
        <span className="text-xs font-bold text-slate-500">Năm</span>
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
        >
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <div className="relative justify-self-end w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm diễn giải, mã đơn vị..." className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white" />
        </div>
      </div>

      {/* Bảng chi tiết */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800">Chi phí vận hành — Khối {label(khoi)}</h3>
            <p className="text-[11px] text-slate-500 italic">Kỳ năm {year}</p>
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
    </div>
  );
};
