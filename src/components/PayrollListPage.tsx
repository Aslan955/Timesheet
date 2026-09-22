/**
 * PayrollListPage — "Payroll" (danh sách kỳ lương).
 *
 * Bám sát màn Payroll mẫu (Year, Month, Approved By/At, Created By/Date, Status,
 * Actions) và BỔ SUNG 6 cột trạng thái theo 6 khối (G1, G2, G3, G4, BFSI, GPDV):
 *   • Khối đã duyệt   → APPROVED
 *   • Khối từ chối     → REJECT
 *   • Khối chưa duyệt  → IN PROGRESS
 * Trạng thái tổng của kỳ = APPROVED khi cả 6 khối duyệt, ngược lại REQUESTED.
 */
import React, { useMemo, useState } from 'react';
import {
  Home,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Send,
  Check,
  Ban,
  Lock,
  ChevronsLeft,
  ChevronLeft,
  ChevronsRight,
} from 'lucide-react';

const KHOIS = ['G1', 'G2', 'G3', 'G4', 'BFSI', 'GPDV'] as const;
type Khoi = (typeof KHOIS)[number];
type BlockStatus = 'APPROVED' | 'REJECT' | 'INPROGRESS';

interface PayrollPeriod {
  id: number;
  year: number;
  month: number;
  approvedBy: string;
  approvedAt: string;
  createdBy: string;
  createdDate: string;
  blocks: Record<Khoi, BlockStatus>;
}

const mkBlocks = (arr: BlockStatus[]): Record<Khoi, BlockStatus> =>
  KHOIS.reduce((acc, k, i) => ((acc[k] = arr[i]), acc), {} as Record<Khoi, BlockStatus>);

const A: BlockStatus = 'APPROVED';
const R: BlockStatus = 'REJECT';
const P: BlockStatus = 'INPROGRESS';

const PERIODS: PayrollPeriod[] = [
  { id: 1, year: 2026, month: 8, approvedBy: 'Admin Admin', approvedAt: '10/09/2026', createdBy: 'Admin Admin', createdDate: '27/08/2026 16:12', blocks: mkBlocks([A, A, A, A, A, A]) },
  { id: 2, year: 2026, month: 7, approvedBy: 'Admin Admin', approvedAt: '07/08/2026', createdBy: 'Admin Admin', createdDate: '08/06/2026 15:27', blocks: mkBlocks([A, A, A, A, A, A]) },
  { id: 3, year: 2026, month: 6, approvedBy: 'Admin Admin', approvedAt: '08/06/2026', createdBy: 'Admin Admin', createdDate: '08/06/2026 15:27', blocks: mkBlocks([A, A, A, A, A, A]) },
  { id: 4, year: 2025, month: 6, approvedBy: 'Lý Trịnh Hương', approvedAt: '01/08/2025', createdBy: 'Lý Trịnh Hương', createdDate: '01/08/2025 09:43', blocks: mkBlocks([A, A, A, A, A, A]) },
  { id: 5, year: 2025, month: 5, approvedBy: 'Đỗ Đặng Thành', approvedAt: '17/06/2025', createdBy: 'Admin Admin', createdDate: '07/05/2025 11:18', blocks: mkBlocks([A, A, R, P, A, P]) },
  { id: 6, year: 2025, month: 1, approvedBy: 'Đỗ Đặng Thành', approvedAt: '17/06/2025', createdBy: '', createdDate: '01/01/2025 00:00', blocks: mkBlocks([A, P, P, R, P, A]) },
];

const overallStatus = (p: PayrollPeriod): 'APPROVED' | 'REQUESTED' =>
  KHOIS.every((k) => p.blocks[k] === 'APPROVED') ? 'APPROVED' : 'REQUESTED';

const BLOCK_BADGE: Record<BlockStatus, { label: string; cls: string }> = {
  APPROVED: { label: 'Approved', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  REJECT: { label: 'Reject', cls: 'bg-rose-50 text-rose-700 border-rose-200' },
  INPROGRESS: { label: 'In progress', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
};

export const PayrollListPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return PERIODS;
    return PERIODS.filter((p) =>
      `${p.year} ${p.month} ${p.approvedBy} ${p.createdBy}`.toLowerCase().includes(q),
    );
  }, [search]);

  const th = 'px-3 py-3 font-bold text-slate-600 border-r border-slate-200 last:border-r-0';
  const td = 'px-3 py-3 border-r border-slate-100 last:border-r-0';

  return (
    <div className="p-4 sm:p-6 bg-slate-50/50 min-h-screen font-sans text-slate-800">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-slate-500 gap-2 font-medium mb-4">
        <Home size={15} className="text-slate-400" />
        <span>Home</span>
        <ChevronRight size={13} className="text-slate-300" />
        <span>PayRoll</span>
        <ChevronRight size={13} className="text-slate-300" />
        <span className="text-slate-900 font-bold">Payroll</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <button className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer">
            <Plus size={14} /> Add New
          </button>
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter text to search..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-2">Drag a column header here to group by that column</p>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse text-xs min-w-[1400px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <th className={`${th} w-10 text-center`}>#</th>
                <th className={th}>Year</th>
                <th className={th}>Month</th>
                <th className={th}>Approved By</th>
                <th className={th}>Approved At</th>
                <th className={th}>Created By</th>
                <th className={th}>Created Date</th>
                {KHOIS.map((k) => (
                  <th key={k} className={`${th} text-center min-w-[92px] bg-indigo-50/60 text-indigo-700`}>{k}</th>
                ))}
                <th className={`${th} text-center`}>Status</th>
                <th className={`${th} text-center min-w-[150px]`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((p) => {
                const overall = overallStatus(p);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70">
                    <td className={`${td} text-center text-slate-400 font-mono`}>{p.id}</td>
                    <td className={`${td} font-mono`}>{p.year}</td>
                    <td className={`${td} font-mono`}>{p.month}</td>
                    <td className={td}>{p.approvedBy || <span className="text-slate-300">—</span>}</td>
                    <td className={`${td} font-mono text-slate-600`}>{p.approvedAt || <span className="text-slate-300">—</span>}</td>
                    <td className={td}>{p.createdBy || <span className="text-slate-300">—</span>}</td>
                    <td className={`${td} font-mono text-slate-600`}>{p.createdDate}</td>
                    {KHOIS.map((k) => {
                      const b = BLOCK_BADGE[p.blocks[k]];
                      return (
                        <td key={k} className={`${td} text-center`}>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${b.cls}`}>{b.label}</span>
                        </td>
                      );
                    })}
                    <td className={`${td} text-center`}>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        overall === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {overall}
                      </span>
                    </td>
                    <td className={`${td}`}>
                      <div className="flex items-center justify-center gap-2 text-slate-400">
                        <button className="hover:text-sky-600 cursor-pointer" title="Xem"><Eye size={16} /></button>
                        <button className="hover:text-rose-600 cursor-pointer" title="Xoá"><Trash2 size={16} /></button>
                        <button className="hover:text-blue-600 cursor-pointer" title="Gửi duyệt"><Send size={16} /></button>
                        {overall === 'REQUESTED' && (
                          <>
                            <button className="text-emerald-500 hover:text-emerald-700 cursor-pointer" title="Duyệt"><Check size={16} /></button>
                            <button className="text-rose-400 hover:text-rose-600 cursor-pointer" title="Từ chối"><Ban size={16} /></button>
                          </>
                        )}
                        <button className="hover:text-slate-700 cursor-pointer" title="Khoá kỳ"><Lock size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-3 text-xs text-slate-600">
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden divide-x divide-slate-200 bg-white">
            <button className="p-1.5 text-slate-400 hover:bg-slate-50 cursor-pointer"><ChevronsLeft size={14} /></button>
            <button className="p-1.5 text-slate-400 hover:bg-slate-50 cursor-pointer"><ChevronLeft size={14} /></button>
            <button className="px-3 py-1.5 font-bold bg-blue-600 text-white">1</button>
            <button className="p-1.5 text-slate-400 hover:bg-slate-50 cursor-pointer"><ChevronRight size={14} /></button>
            <button className="p-1.5 text-slate-400 hover:bg-slate-50 cursor-pointer"><ChevronsRight size={14} /></button>
          </div>
          <div className="flex items-center gap-2">
            <span>Page Size:</span>
            <select className="border border-slate-200 rounded-lg px-2 py-1 outline-none bg-white cursor-pointer font-bold">
              <option>30</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>

        {/* Chú thích trạng thái khối */}
        <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-500 flex-wrap">
          <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Filter size={11} /> Trạng thái khối:</span>
          {(Object.keys(BLOCK_BADGE) as BlockStatus[]).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${BLOCK_BADGE[s].cls}`}>{BLOCK_BADGE[s].label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
