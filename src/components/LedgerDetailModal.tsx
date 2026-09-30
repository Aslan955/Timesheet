/**
 * LedgerDetailModal — màn chi tiết khi bấm vào con số Thu thực tế / Chi thực tế.
 *
 * Liệt kê các dòng sổ kế toán tạo nên con số đó, đúng các cột của file kế toán:
 *  • Dòng tiền thu (sổ tiền gửi ngân hàng): Ngày hạch toán · Diễn giải · Số tiền · Tên đối tượng ·
 *    Mã công trình · Tên công trình · Mã đơn vị · Tên đơn vị
 *  • Chi thực tế: Mã dự án · Tháng · Chi sản xuất (đ) · Chi kinh doanh (đ) · Ghi chú
 * Lọc theo các mã của dự án (Mã tổng / Mã PAKD / Mã SX) và kỳ [from, to]. Xuất lại được ra Excel.
 */
import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';
import { X, Search, FileSpreadsheet, AlertTriangle, Landmark, Receipt } from 'lucide-react';
import { BizProject, LedgerKind, projectCodes, useBusinessProjects } from '../business/BusinessProjectContext';
import { erp } from './erp/Erp';

export interface LedgerDrill {
  kind: LedgerKind;
  part?: 'sx' | 'kd'; // chỉ Chi: xem riêng Chi sản xuất / Chi kinh doanh
  projects: BizProject[];
  from: string; // YYYY-MM
  to: string;
  title: string; // vd "022.061 — Nền tảng chuyển đổi số quốc gia"
  expected?: number; // con số người dùng vừa bấm, để đối chiếu với tổng chi tiết
}

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const fmtMonth = (m: string) => `${m.slice(5, 7)}/${m.slice(0, 4)}`;
const dmy = (d: string) => d.split('-').reverse().join('/');
const periodText = (from: string, to: string) =>
  from === to ? `Tháng ${+from.slice(5, 7)} năm ${from.slice(0, 4)}` : `Từ tháng ${fmtMonth(from)} đến tháng ${fmtMonth(to)}`;

export const LedgerDetailModal: React.FC<LedgerDrill & { onClose: () => void }> = ({ kind, part, projects, from, to, title, expected, onClose }) => {
  const { ledger } = useBusinessProjects();
  const [q, setQ] = useState('');
  const [hideZero, setHideZero] = useState(true);
  const codes = useMemo(() => new Set(projects.flatMap(projectCodes)), [projects]);
  const inScope = (e: { projectCode: string; month: string }) => codes.has(e.projectCode.trim().toLowerCase()) && e.month >= from && e.month <= to;
  const needle = q.trim().toLowerCase();

  const cash = useMemo(
    () =>
      ledger.cashIn
        .filter(inScope)
        .filter((e) => !needle || [e.description, e.partner, e.projectCode, e.projectName].some((v) => v.toLowerCase().includes(needle)))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [ledger.cashIn, codes, from, to, needle],
  );
  const cost = useMemo(
    () =>
      ledger.cost
        .filter(inScope)
        .filter((e) => (part === 'sx' ? e.costSx : part === 'kd' ? e.costKd : 1) !== 0)
        .filter((e) => !hideZero || e.costSx || e.costKd)
        .filter((e) => !needle || [e.projectCode, e.note].some((v) => v.toLowerCase().includes(needle)))
        .sort((a, b) => a.month.localeCompare(b.month) || a.projectCode.localeCompare(b.projectCode)),
    [ledger.cost, codes, from, to, needle, hideZero, part],
  );

  const totalCash = cash.reduce((s, e) => s + e.amount, 0);
  const totalSx = cost.reduce((s, e) => s + e.costSx, 0);
  const totalKd = cost.reduce((s, e) => s + e.costKd, 0);
  const shownTotal = kind === 'cashIn' ? totalCash : part === 'sx' ? totalSx : part === 'kd' ? totalKd : totalSx + totalKd;
  const mismatch = !needle && expected !== undefined && Math.round(expected) !== Math.round(shownTotal);

  const heading = kind === 'cashIn' ? 'BÁO CÁO DÒNG TIỀN THU TRONG KỲ' : `CHI THỰC TẾ${part === 'sx' ? ' — CHI SẢN XUẤT' : part === 'kd' ? ' — CHI KINH DOANH' : ''}`;
  const Icon = kind === 'cashIn' ? Landmark : Receipt;

  const exportXlsx = () => {
    const rows: (string | number)[][] =
      kind === 'cashIn'
        ? [
            [heading],
            [periodText(from, to)],
            ['Ngày hạch toán', 'Diễn giải', 'Số tiền', 'Tên đối tượng', 'Mã công trình', 'Tên công trình', 'Mã đơn vị', 'Tên đơn vị'],
            ...cash.map((e) => [dmy(e.date), e.description, e.amount, e.partner, e.projectCode, e.projectName, e.unitCode, e.unitName]),
          ]
        : [
            ['Mã dự án (Mã tổng/Mã SX/Mã PAKD) *', 'Tháng (MM/yyyy) *', 'Chi sản xuất (đ) *', 'Chi kinh doanh (đ) *', 'Ghi chú'],
            ...cost.map((e) => [e.projectCode, fmtMonth(e.month), e.costSx, e.costKd, e.note]),
          ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = kind === 'cashIn' ? [12, 60, 16, 40, 14, 36, 10, 16].map((wch) => ({ wch })) : [34, 16, 18, 18, 40].map((wch) => ({ wch }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, kind === 'cashIn' ? 'SỔ TIỀN GỬI NGÂN HÀNG' : 'Chi thuc te');
    XLSX.writeFile(wb, `${kind === 'cashIn' ? 'DongTienThu' : 'ChiThucTe'}_${projects.length === 1 ? projects[0].masterCode : 'nhieu-du-an'}_${from}_${to}.xlsx`);
  };

  const th = erp.th;
  const td = `${erp.td} align-top`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
      >
        <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Icon size={16} className={kind === 'cashIn' ? 'text-emerald-600' : 'text-rose-600'} /> {heading}
            </h3>
            <p className="text-[12px] text-slate-600 font-semibold mt-0.5">{title}</p>
            <p className="text-[11px] text-slate-500">
              {periodText(from, to)} · ĐVT: VNĐ · Nguồn: sổ kế toán import
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={kind === 'cashIn' ? 'Tìm diễn giải, đối tượng, mã công trình...' : 'Tìm mã dự án, ghi chú...'}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          {kind === 'cost' && (
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer select-none">
              <input type="checkbox" checked={hideZero} onChange={(e) => setHideZero(e.target.checked)} className="accent-blue-600" /> Ẩn dòng bằng 0
            </label>
          )}
          <span className="text-xs text-slate-500">
            <strong className="text-slate-800">{kind === 'cashIn' ? cash.length : cost.length}</strong> dòng · Tổng{' '}
            <strong className="text-slate-800 font-mono">{fmt(shownTotal)}</strong>
          </span>
          <button onClick={exportXlsx} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">
            <FileSpreadsheet size={13} className="text-emerald-600" /> Export XLSX
          </button>
        </div>

        {mismatch && (
          <div className="mx-4 mt-3 flex items-start gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
            Tổng chi tiết ({fmt(shownTotal)}) khác con số trên báo cáo ({fmt(expected!)}) — phần chênh lệch được import dạng số tổng, không kèm chứng từ chi tiết.
          </div>
        )}

        <div className="p-4 overflow-auto">
          <div className="border border-slate-300 overflow-auto">
            {kind === 'cashIn' ? (
              <table className={erp.table}>
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className={`${th} text-left`}>Ngày hạch toán</th>
                    <th className={`${th} text-left min-w-[280px]`}>Diễn giải</th>
                    <th className={`${th} text-right`}>Số tiền</th>
                    <th className={`${th} text-left min-w-[200px]`}>Tên đối tượng</th>
                    <th className={`${th} text-left`}>Mã công trình</th>
                    <th className={`${th} text-left min-w-[160px]`}>Tên công trình</th>
                    <th className={`${th} text-left`}>Mã đơn vị</th>
                    <th className={`${th} text-left`}>Tên đơn vị</th>
                  </tr>
                </thead>
                <tbody>
                  {cash.map((e) => (
                    <tr key={e.id} className={erp.tr}>
                      <td className={`${td} font-mono whitespace-nowrap`}>{dmy(e.date)}</td>
                      <td className={`${td} text-slate-700`}>{e.description}</td>
                      <td className={`${td} text-right font-mono font-bold text-emerald-700 whitespace-nowrap`}>{fmt(e.amount)}</td>
                      <td className={`${td} text-slate-600`}>{e.partner}</td>
                      <td className={`${td} font-mono text-blue-600 whitespace-nowrap`}>{e.projectCode}</td>
                      <td className={`${td} text-slate-600`}>{e.projectName}</td>
                      <td className={`${td} whitespace-nowrap`}>{e.unitCode}</td>
                      <td className={`${td} whitespace-nowrap`}>{e.unitName}</td>
                    </tr>
                  ))}
                  {!cash.length && <EmptyRow cols={8} />}
                </tbody>
                {cash.length > 0 && (
                  <tfoot>
                    <tr className={erp.totalRow}>
                      <td className={td} colSpan={2}>
                        Tổng cộng
                      </td>
                      <td className={`${td} text-right font-mono`}>{fmt(totalCash)}</td>
                      <td colSpan={5} />
                    </tr>
                  </tfoot>
                )}
              </table>
            ) : (
              <table className={erp.table}>
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className={`${th} text-left`}>Mã dự án (Mã tổng/Mã SX/Mã PAKD)</th>
                    <th className={`${th} text-left`}>Tháng (MM/yyyy)</th>
                    <th className={`${th} text-right ${part === 'kd' ? 'opacity-40' : ''}`}>Chi sản xuất (đ)</th>
                    <th className={`${th} text-right ${part === 'sx' ? 'opacity-40' : ''}`}>Chi kinh doanh (đ)</th>
                    <th className={`${th} text-left min-w-[240px]`}>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {cost.map((e) => (
                    <tr key={e.id} className={erp.tr}>
                      <td className={`${td} font-mono text-blue-600`}>{e.projectCode}</td>
                      <td className={`${td} font-mono`}>{fmtMonth(e.month)}</td>
                      <td className={`${td} text-right font-mono ${e.costSx ? 'font-bold text-rose-700' : 'text-slate-400'}`}>{fmt(e.costSx)}</td>
                      <td className={`${td} text-right font-mono ${e.costKd ? 'font-bold text-rose-700' : 'text-slate-400'}`}>{fmt(e.costKd)}</td>
                      <td className={`${td} text-slate-600`}>{e.note || <span className="text-slate-300">—</span>}</td>
                    </tr>
                  ))}
                  {!cost.length && <EmptyRow cols={5} />}
                </tbody>
                {cost.length > 0 && (
                  <tfoot>
                    <tr className={erp.totalRow}>
                      <td className={td} colSpan={2}>
                        Tổng cộng
                      </td>
                      <td className={`${td} text-right font-mono`}>{fmt(totalSx)}</td>
                      <td className={`${td} text-right font-mono`}>{fmt(totalKd)}</td>
                      <td className={`${td} text-slate-500 font-semibold`}>Tổng chi: {fmt(totalSx + totalKd)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const EmptyRow: React.FC<{ cols: number }> = ({ cols }) => (
  <tr>
    <td colSpan={cols} className="px-3 py-8 text-center text-slate-400">
      Không có dòng chi tiết nào trong kỳ.
    </td>
  </tr>
);

/** Class cho con số bấm được để mở chi tiết. */
export const drillCls = 'underline decoration-dotted decoration-slate-300 underline-offset-2 hover:text-blue-600 hover:decoration-blue-400 cursor-pointer';
