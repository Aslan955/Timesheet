/**
 * LedgerDetailModal — màn chi tiết khi bấm vào con số Doanh thu / Thu / Chi thực tế.
 *
 * Liệt kê các dòng sổ kế toán tạo nên con số đó, đúng các cột của file kế toán:
 *  • Doanh thu thực tế (sổ chi tiết các tài khoản): Ngày hạch toán · Diễn giải · Số tiền · Tên đối tượng · Mã công trình · Tên công trình
 *  • Dòng tiền thu (sổ tiền gửi ngân hàng): như trên + Mã đơn vị · Tên đơn vị
 *  • Chi thực tế: Mã công trình · Tháng · Chi sản xuất · Chi kinh doanh · Diễn giải (chi phí chung tách sang sheet Chi phí vận hành chung) (Tổng chi phí ghi kèm CP quản lý + CP vận hành chung)
 *    (gộp 3 sổ "Chi thực tế", "Chi phí quản lý", "Chi phí vận hành chung" — Chi phí thực tế của dự án = tổng các cột)
 *  • Chi phí vận hành chung (tab riêng trong Chi phí): bảng phân bổ theo khối + tháng và các khoản chi chi tiết của khối
 *      Tháng · Khối · Diễn giải · Số tiền · Tên đối tượng · Tên nhân viên · Phân bổ cho dự án (= số tiền × tỉ lệ phân bổ)
 * Lọc theo các mã của dự án (Mã tổng / Mã PAKD / Mã SX) và kỳ [from, to]. Xuất lại được ra Excel.
 */
import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';
import { X, Search, FileSpreadsheet, AlertTriangle, Landmark, Receipt, TrendingUp, PieChart } from 'lucide-react';
import { BizProject, LedgerKind, VhcSheet, isProdCode, projectCodes, useBusinessProjects } from '../business/BusinessProjectContext';
import { erp } from './erp/Erp';

export interface LedgerDrill {
  kind: LedgerKind;
  part?: 'sx' | 'kd' | 'chung' | 'alloc' | 'mgmt'; // chỉ Chi: xem riêng Chi SX / Chi KD / Chi phí chung / Chi phí phân bổ (vận hành) / Chi phí quản lý
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
  /** Chi phí: tab Tổng hợp (mọi sổ chi) / Chi phí vận hành chung (chi tiết VHC) */
  const [view, setView] = useState<'sum' | 'vhc'>(part === 'alloc' ? 'vhc' : 'sum');
  const isVhc = kind === 'cost' && view === 'vhc';
  const codes = useMemo(() => new Set(projects.flatMap(projectCodes)), [projects]);
  // Mã của dự án, gồm cả mã con của Mã SX (.2.x)
  const owned = (code: string) => codes.has(code.trim().toLowerCase()) || projects.some((p) => isProdCode(p, code));
  const inScope = (e: { projectCode: string; month: string }) => owned(e.projectCode) && e.month >= from && e.month <= to;
  const needle = q.trim().toLowerCase();

  const isLines = kind !== 'cost'; // doanh thu & dòng tiền thu: cùng dạng dòng chứng từ
  const source = kind === 'revenue' ? ledger.revenue : ledger.cashIn;
  const cash = useMemo(
    () =>
      source
        .filter(inScope)
        .filter((e) => !needle || [e.description, e.partner, e.projectCode, e.projectName].some((v) => v.toLowerCase().includes(needle)))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [source, codes, from, to, needle],
  );
  type CostRow = { id: string; projectCode: string; month: string; sx: number; kd: number; chung: number; alloc: number; mgmt: number; note: string };
  const costAll = useMemo<CostRow[]>(
    () =>
      [
        ...ledger.cost.map((e) => ({ id: e.id, projectCode: e.projectCode, month: e.month, sx: e.costSx, kd: e.costKd, chung: e.costChung || 0, alloc: 0, mgmt: 0, note: e.note })),
        ...ledger.mgmt.map((e) => ({ id: e.id, projectCode: e.projectCode, month: e.month, sx: 0, kd: 0, chung: 0, alloc: 0, mgmt: e.value, note: e.note })),
        ...ledger.opex.map((e) => ({ id: e.id, projectCode: e.projectCode, month: e.month, sx: 0, kd: 0, chung: 0, alloc: e.value, mgmt: 0, note: e.note })),
      ]
        .filter(inScope)
        .filter((e) => (part ? e[part] : 1) !== 0)
        .filter((e) => !hideZero || e.sx || e.kd || e.chung || e.alloc || e.mgmt)
        .filter((e) => !needle || [e.projectCode, e.note].some((v) => v.toLowerCase().includes(needle)))
        .sort((a, b) => a.month.localeCompare(b.month) || a.projectCode.localeCompare(b.projectCode)),
    [ledger.cost, ledger.opex, ledger.mgmt, codes, from, to, needle, hideZero, part],
  );
  // Bảng Tổng hợp: sổ Chi thực tế (SX · KD) + Chi phí chung (phân bổ từ sheet Chi phí chung riêng); CP quản lý chỉ cộng vào tổng
  // (CP quản lý chỉ hiện cột khi mở từ con số CP quản lý; chi tiết Chi phí chung của khối xem ở tab riêng)
  const showMgmt = part === 'mgmt';
  const cost = useMemo(() => costAll.filter((e) => (showMgmt ? e.mgmt : !e.mgmt)), [costAll, showMgmt]);
  const chungOf = (e: CostRow) => e.alloc + e.chung; // Chi phí chung = phân bổ từ sheet riêng (+ số cũ của cột Chi phí chung nếu còn)

  // ---- Chi phí vận hành chung: bảng phân bổ + dòng chi tiết của khối, quy về phần của (các) dự án đang xem
  type VhcGroup = { sheet: VhcSheet; allocs: VhcSheet['alloc']; share: number; base: number };
  const vhcGroups = useMemo<VhcGroup[]>(
    () =>
      ledger.vhc
        .filter((v) => v.month >= from && v.month <= to)
        .map((sheet) => {
          const allocs = sheet.alloc.filter((a) => codes.has(a.projectCode.trim().toLowerCase()));
          const base = sheet.lines.reduce((a, l) => a + l.amount, 0);
          return { sheet, allocs, share: allocs.reduce((a, x) => a + x.value, 0), base };
        })
        .filter((g) => g.allocs.length)
        .sort((a, b) => a.sheet.month.localeCompare(b.sheet.month) || a.sheet.division.localeCompare(b.sheet.division)),
    [ledger.vhc, codes, from, to],
  );
  // Dòng phân bổ không kèm file chi tiết (import mẫu cũ "Mã công trình | Diễn giải | Số tiền")
  const vhcLoose = useMemo(
    () => ledger.opex.filter(inScope).filter((e) => !ledger.vhc.some((v) => v.month === e.month && v.alloc.some((a) => a.projectCode.trim().toLowerCase() === e.projectCode.trim().toLowerCase()))),
    [ledger.opex, ledger.vhc, codes, from, to],
  );
  const vhcLines = useMemo(
    () =>
      vhcGroups.flatMap((g) =>
        g.sheet.lines
          .map((l, i) => ({ key: `${g.sheet.id}-${i}`, month: g.sheet.month, division: g.sheet.division, ...l, alloc: g.base ? (l.amount * g.share) / g.base : 0 }))
          .filter((l) => !needle || [l.description, l.partner, l.employee, l.division].some((v) => v.toLowerCase().includes(needle))),
      ),
    [vhcGroups, needle],
  );
  const vhcAllocTotal = vhcGroups.reduce((a, g) => a + g.share, 0) + vhcLoose.reduce((a, e) => a + e.value, 0);
  const vhcLinesTotal = vhcLines.reduce((a, l) => a + l.amount, 0);
  const vhcLinesAlloc = vhcLines.reduce((a, l) => a + l.alloc, 0);

  const totalCash = cash.reduce((s, e) => s + e.amount, 0);
  const totalSx = costAll.reduce((s, e) => s + e.sx, 0);
  const totalKd = costAll.reduce((s, e) => s + e.kd, 0);
  const totalChung = costAll.reduce((s, e) => s + e.chung, 0);
  const totalAlloc = costAll.reduce((s, e) => s + e.alloc, 0);
  const totalMgmt = costAll.reduce((s, e) => s + e.mgmt, 0);
  const totalCost = totalSx + totalKd + totalChung + totalMgmt + totalAlloc;
  const shownTotal = isVhc ? vhcAllocTotal : isLines ? totalCash : part === 'sx' ? totalSx : part === 'kd' ? totalKd : part === 'chung' ? totalChung : part === 'alloc' ? totalAlloc : part === 'mgmt' ? totalMgmt : totalCost;
  const mismatch = !needle && expected !== undefined && Math.round(expected) !== Math.round(shownTotal);

  const heading =
    kind === 'revenue'
      ? 'BÁO CÁO DOANH THU PHÁT SINH TRONG KỲ'
      : kind === 'cashIn'
        ? 'BÁO CÁO DÒNG TIỀN THU TRONG KỲ'
        : isVhc
          ? 'CHI PHÍ CHUNG'
          : `CHI PHÍ THỰC TẾ${part === 'sx' ? ' — CHI SẢN XUẤT' : part === 'kd' ? ' — CHI KINH DOANH' : part === 'chung' ? ' — CHI PHÍ CHUNG' : part === 'alloc' ? ' — CHI PHÍ CHUNG' : part === 'mgmt' ? ' — CHI PHÍ QUẢN LÝ' : ''}`;
  const Icon = kind === 'revenue' ? TrendingUp : kind === 'cashIn' ? Landmark : isVhc ? PieChart : Receipt;
  const iconCls = kind === 'cost' ? 'text-rose-600' : 'text-emerald-600';

  const exportXlsx = () => {
    if (isVhc) {
      const wb = XLSX.utils.book_new();
      const a = XLSX.utils.aoa_to_sheet([
        ['BẢNG PHÂN BỔ CHI PHÍ VẬN HÀNH CHUNG'],
        [title],
        [periodText(from, to)],
        ['Tháng', 'Khối', 'Mã công trình', 'Tên công trình', 'Chi phí mã SX (.2 + .2.x) trong tháng', 'Tỉ lệ', 'Chi phí VHC phân bổ'],
        ...vhcGroups.flatMap((g) => g.allocs.map((x) => [fmtMonth(g.sheet.month), g.sheet.division, x.projectCode, x.projectName, x.cost, x.ratio, x.value])),
        ...vhcLoose.map((e) => [fmtMonth(e.month), e.division || '', e.projectCode, e.note, '', '', e.value]),
        ['Tổng cộng', '', '', '', '', '', vhcAllocTotal],
      ]);
      a['!cols'] = [10, 8, 16, 40, 18, 10, 20].map((wch) => ({ wch }));
      const d = XLSX.utils.aoa_to_sheet([
        ['CHI PHÍ VẬN HÀNH CHUNG — CHI TIẾT'],
        [periodText(from, to)],
        ['Tháng', 'Khối', 'Diễn giải', 'Số tiền', 'Tên đối tượng', 'Tên nhân viên', 'Phân bổ cho dự án'],
        ...vhcLines.map((l) => [fmtMonth(l.month), l.division, l.description, l.amount, l.partner, l.employee, Math.round(l.alloc)]),
        ['Cộng', '', '', vhcLinesTotal, '', '', Math.round(vhcLinesAlloc)],
      ]);
      d['!cols'] = [10, 8, 60, 16, 40, 24, 18].map((wch) => ({ wch }));
      XLSX.utils.book_append_sheet(wb, a, 'Bảng phân bổ chi phí VHC');
      XLSX.utils.book_append_sheet(wb, d, 'Chi tiết chi phí VHC');
      XLSX.writeFile(wb, `ChiPhiVHC_${projects.length === 1 ? projects[0].masterCode : 'nhieu-du-an'}_${from}_${to}.xlsx`);
      return;
    }
    const rows: (string | number)[][] =
      kind === 'revenue'
        ? [
            [heading],
            [periodText(from, to)],
            ['Ngày hạch toán', 'Diễn giải', 'Số tiền', 'Tên đối tượng', 'Mã công trình', 'Tên công trình'],
            ...cash.map((e) => [dmy(e.date), e.description, e.amount, e.partner, e.projectCode, e.projectName]),
          ]
        : kind === 'cashIn'
          ? [
              [heading],
              [periodText(from, to)],
              ['Ngày hạch toán', 'Diễn giải', 'Số tiền', 'Tên đối tượng', 'Mã công trình', 'Tên công trình', 'Mã đơn vị', 'Tên đơn vị'],
              ...cash.map((e) => [dmy(e.date), e.description, e.amount, e.partner, e.projectCode, e.projectName, e.unitCode, e.unitName]),
            ]
          : [
              [heading],
              [periodText(from, to)],
              showMgmt
                ? ['Mã công trình', 'Tháng', 'Chi phí quản lý', 'Diễn giải']
                : ['Mã công trình', 'Tháng', 'Chi sản xuất', 'Chi kinh doanh', 'Chi phí chung', 'Diễn giải'],
              ...cost.map((e) => (showMgmt ? [e.projectCode, fmtMonth(e.month), e.mgmt, e.note] : [e.projectCode, fmtMonth(e.month), e.sx, e.kd, chungOf(e), e.note])),
              ...(showMgmt ? [] : [['Tổng chi phí', '', totalCost, '', '', `gồm Chi phí chung ${fmt(totalAlloc + totalChung)} · CP quản lý ${fmt(totalMgmt)}`]]),
            ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = (kind === 'revenue' ? [12, 60, 16, 40, 14, 36] : kind === 'cashIn' ? [12, 60, 16, 40, 14, 36, 10, 16] : [16, 12, 18, 18, 18, 18, 18, 60]).map((wch) => ({ wch }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, kind === 'revenue' ? 'SỔ CHI TIẾT CÁC TÀI KHOẢN' : kind === 'cashIn' ? 'SỔ TIỀN GỬI NGÂN HÀNG' : 'BÁO CÁO CHI TIẾT LÃI LỖ');
    XLSX.writeFile(wb, `${kind === 'revenue' ? 'DoanhThu' : kind === 'cashIn' ? 'DongTienThu' : 'ChiThucTe'}_${projects.length === 1 ? projects[0].masterCode : 'nhieu-du-an'}_${from}_${to}.xlsx`);
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
              <Icon size={16} className={iconCls} /> {heading}
            </h3>
            <p className="text-[12px] text-slate-600 font-semibold mt-0.5">{title}</p>
            <p className="text-[11px] text-slate-500">
              {periodText(from, to)} · ĐVT: VNĐ · Nguồn: sổ kế toán import
              {isVhc ? ' (sheet Chi phí chung theo khối, phân bổ theo tỉ lệ chi phí sản xuất của dự án trong tháng)' : kind === 'cost' ? ' (Chi thực tế + Chi phí chung (sheet riêng) + Chi phí quản lý)' : ''}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {kind === 'cost' && part !== 'alloc' && (
          <div className="px-4 pt-2 border-b border-slate-200 flex gap-1" role="tablist">
            {(
              [
                ['sum', 'Tổng hợp chi phí', Receipt],
                ['vhc', 'Chi phí chung (chi tiết khối)', PieChart],
              ] as const
            ).map(([k, label, I]) => (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={view === k}
                onClick={() => setView(k)}
                className={`-mb-px flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-semibold border border-b-0 rounded-t-[4px] cursor-pointer ${
                  view === k ? 'bg-white border-slate-200 text-[#1e3a5f]' : 'bg-slate-50 border-transparent text-slate-500 hover:text-slate-700'
                }`}
                data-testid={`cost-view-${k}`}
              >
                <I size={13} /> {label}
              </button>
            ))}
          </div>
        )}
        <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={isVhc ? 'Tìm diễn giải, đối tượng, nhân viên...' : isLines ? 'Tìm diễn giải, đối tượng, mã công trình...' : 'Tìm mã công trình, diễn giải...'}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
            />
          </div>
          {kind === 'cost' && !isVhc && (
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer select-none">
              <input type="checkbox" checked={hideZero} onChange={(e) => setHideZero(e.target.checked)} className="accent-blue-600" /> Ẩn dòng bằng 0
            </label>
          )}
          <span className="text-xs text-slate-500">
            <strong className="text-slate-800">{isVhc ? vhcLines.length : isLines ? cash.length : cost.length}</strong> dòng · Tổng{isVhc ? ' phân bổ cho dự án' : ''}{' '}
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
          {isVhc ? (
            <VhcView groups={vhcGroups} loose={vhcLoose} lines={vhcLines} allocTotal={vhcAllocTotal} linesTotal={vhcLinesTotal} linesAlloc={vhcLinesAlloc} />
          ) : (
          <div className="border border-slate-300 overflow-auto">
            {isLines ? (
              <table className={erp.table}>
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className={`${th} text-left`}>Ngày hạch toán</th>
                    <th className={`${th} text-left min-w-[280px]`}>Diễn giải</th>
                    <th className={`${th} text-right`}>Số tiền</th>
                    <th className={`${th} text-left min-w-[200px]`}>Tên đối tượng</th>
                    <th className={`${th} text-left`}>Mã công trình</th>
                    <th className={`${th} text-left min-w-[160px]`}>Tên công trình</th>
                    {kind === 'cashIn' && <th className={`${th} text-left`}>Mã đơn vị</th>}
                    {kind === 'cashIn' && <th className={`${th} text-left`}>Tên đơn vị</th>}
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
                      {kind === 'cashIn' && <td className={`${td} whitespace-nowrap`}>{e.unitCode}</td>}
                      {kind === 'cashIn' && <td className={`${td} whitespace-nowrap`}>{e.unitName}</td>}
                    </tr>
                  ))}
                  {!cash.length && <EmptyRow cols={kind === 'cashIn' ? 8 : 6} />}
                </tbody>
                {cash.length > 0 && (
                  <tfoot>
                    <tr className={erp.totalRow}>
                      <td className={td} colSpan={2}>
                        Tổng cộng
                      </td>
                      <td className={`${td} text-right font-mono`}>{fmt(totalCash)}</td>
                      <td colSpan={kind === 'cashIn' ? 5 : 3} />
                    </tr>
                  </tfoot>
                )}
              </table>
            ) : (
              <table className={erp.table}>
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className={`${th} text-left`}>Mã công trình</th>
                    <th className={`${th} text-left`}>Tháng</th>
                    {!showMgmt && (
                      <>
                    <th className={`${th} text-right ${part && part !== 'sx' ? 'opacity-40' : ''}`}>Chi sản xuất</th>
                    <th className={`${th} text-right ${part && part !== 'kd' ? 'opacity-40' : ''}`}>Chi kinh doanh</th>
                    <th className={`${th} text-right ${part && part !== 'chung' ? 'opacity-40' : ''}`} title="Phân bổ từ sheet Chi phí chung (file Kế toán theo khối + tháng)">Chi phí chung</th>
                      </>
                    )}
                    {showMgmt && <th className={`${th} text-right`} title="Sổ Chi phí quản lý (Kế toán phân bổ theo dự án)">Chi phí quản lý</th>}
                    <th className={`${th} text-left min-w-[240px]`}>Diễn giải</th>
                  </tr>
                </thead>
                <tbody>
                  {cost.map((e) => (
                    <tr key={e.id} className={erp.tr}>
                      <td className={`${td} font-mono text-blue-600`}>{e.projectCode}</td>
                      <td className={`${td} font-mono`}>{fmtMonth(e.month)}</td>
                      {(showMgmt ? [e.mgmt] : [e.sx, e.kd, chungOf(e)]).map((v, j) => (
                        <td key={j} className={`${td} text-right font-mono ${v ? 'font-bold text-rose-700' : 'text-slate-400'}`}>{fmt(v)}</td>
                      ))}
                      <td className={`${td} text-slate-600`}>{e.note || <span className="text-slate-300">—</span>}</td>
                    </tr>
                  ))}
                  {!cost.length && <EmptyRow cols={showMgmt ? 4 : 6} />}
                </tbody>
                {cost.length > 0 && (
                  <tfoot>
                    <tr className={erp.totalRow}>
                      <td className={td} colSpan={2}>
                        Tổng cộng
                      </td>
                      {showMgmt ? (
                        <>
                          <td className={`${td} text-right font-mono`}>{fmt(totalMgmt)}</td>
                          <td className={td} />
                        </>
                      ) : (
                        <>
                          <td className={`${td} text-right font-mono`}>{fmt(totalSx)}</td>
                          <td className={`${td} text-right font-mono`}>{fmt(totalKd)}</td>
                          <td className={`${td} text-right font-mono`}>{fmt(totalAlloc + totalChung)}</td>
                          <td className={`${td} text-slate-500 font-semibold`}>
                            Tổng chi phí: {fmt(totalCost)}
                            {totalMgmt > 0 && <span className="block text-[11px] font-normal">gồm CP quản lý {fmt(totalMgmt)}</span>}
                          </td>
                        </>
                      )}
                    </tr>
                  </tfoot>
                )}
              </table>
            )}
          </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/** Tab "Chi phí vận hành chung": bảng phân bổ (khối → dự án) + các khoản chi chi tiết của khối. */
const VhcView: React.FC<{
  groups: { sheet: VhcSheet; allocs: VhcSheet['alloc']; share: number }[];
  loose: { id: string; month: string; projectCode: string; value: number; note: string; division?: string }[];
  lines: { key: string; month: string; division: string; description: string; amount: number; partner: string; employee: string; alloc: number }[];
  allocTotal: number;
  linesTotal: number;
  linesAlloc: number;
}> = ({ groups, loose, lines, allocTotal, linesTotal, linesAlloc }) => {
  const th = erp.th;
  const td = `${erp.td} align-top`;
  return (
    <div className="space-y-3">
      <div>
        <p className="text-[12px] font-bold text-slate-700 mb-1.5">Bảng phân bổ chi phí VHC</p>
        <div className="border border-slate-300 overflow-auto">
          <table className={erp.table} data-testid="vhc-alloc">
            <thead>
              <tr>
                <th className={`${th} text-left`}>Tháng</th>
                <th className={`${th} text-left`}>Khối</th>
                <th className={`${th} text-right`}>Tổng chi phí VHC khối</th>
                <th className={`${th} text-left`}>Mã công trình</th>
                <th className={`${th} text-left min-w-[180px]`}>Tên công trình</th>
                <th className={`${th} text-right`} title="Sổ Chi thực tế — các dòng của mã sản xuất (.2) và mã con (.2.x)">Chi phí mã SX (.2 + .2.x) trong tháng</th>
                <th className={`${th} text-right`}>Tỉ lệ</th>
                <th className={`${th} text-right`}>Chi phí VHC phân bổ</th>
              </tr>
            </thead>
            <tbody>
              {groups.flatMap((g) =>
                g.allocs.map((a, i) => (
                  <tr key={`${g.sheet.id}-${a.projectCode}`} className={erp.tr}>
                    <td className={`${td} font-mono`}>{fmtMonth(g.sheet.month)}</td>
                    <td className={td}>{g.sheet.division}</td>
                    <td className={`${td} text-right font-mono text-slate-600`}>{i === 0 ? fmt(g.sheet.pool) : ''}</td>
                    <td className={`${td} font-mono text-blue-600`}>{a.projectCode}</td>
                    <td className={`${td} text-slate-600`}>{a.projectName || '—'}</td>
                    <td className={`${td} text-right font-mono`}>{fmt(a.cost)}</td>
                    <td className={`${td} text-right font-mono`}>{(a.ratio * 100).toFixed(2)}%</td>
                    <td className={`${td} text-right font-mono font-bold text-rose-700`}>{fmt(a.value)}</td>
                  </tr>
                )),
              )}
              {loose.map((e) => (
                <tr key={e.id} className={erp.tr}>
                  <td className={`${td} font-mono`}>{fmtMonth(e.month)}</td>
                  <td className={td}>{e.division || '—'}</td>
                  <td className={`${td} text-slate-400`}>—</td>
                  <td className={`${td} font-mono text-blue-600`}>{e.projectCode}</td>
                  <td className={`${td} text-slate-500 italic`} colSpan={3}>
                    {e.note || 'Phân bổ không kèm file chi tiết'}
                  </td>
                  <td className={`${td} text-right font-mono font-bold text-rose-700`}>{fmt(e.value)}</td>
                </tr>
              ))}
              {!groups.length && !loose.length && <EmptyRow cols={8} />}
            </tbody>
            {(groups.length > 0 || loose.length > 0) && (
              <tfoot>
                <tr className={erp.totalRow}>
                  <td className={td} colSpan={7}>
                    Tổng phân bổ cho dự án
                  </td>
                  <td className={`${td} text-right font-mono`}>{fmt(allocTotal)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <div>
        <p className="text-[12px] font-bold text-slate-700 mb-1.5">Các khoản chi vận hành chung của khối</p>
        <div className="border border-slate-300 overflow-auto">
          <table className={erp.table} data-testid="vhc-lines">
            <thead className="sticky top-0 z-10">
              <tr>
                <th className={`${th} text-left`}>Tháng</th>
                <th className={`${th} text-left`}>Khối</th>
                <th className={`${th} text-left min-w-[260px]`}>Diễn giải</th>
                <th className={`${th} text-right`}>Số tiền</th>
                <th className={`${th} text-left min-w-[200px]`}>Tên đối tượng</th>
                <th className={`${th} text-left`}>Tên nhân viên</th>
                <th className={`${th} text-right`} title="Số tiền × tỉ lệ phân bổ của dự án">
                  Phân bổ cho dự án
                </th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.key} className={erp.tr}>
                  <td className={`${td} font-mono whitespace-nowrap`}>{fmtMonth(l.month)}</td>
                  <td className={td}>{l.division}</td>
                  <td className={`${td} text-slate-700`}>{l.description || <span className="text-slate-300">—</span>}</td>
                  <td className={`${td} text-right font-mono text-slate-700 whitespace-nowrap`}>{fmt(l.amount)}</td>
                  <td className={`${td} text-slate-600`}>{l.partner || <span className="text-slate-300">—</span>}</td>
                  <td className={`${td} text-slate-600 whitespace-nowrap`}>{l.employee || <span className="text-slate-300">—</span>}</td>
                  <td className={`${td} text-right font-mono font-bold text-rose-700 whitespace-nowrap`}>{fmt(l.alloc)}</td>
                </tr>
              ))}
              {!lines.length && <EmptyRow cols={7} />}
            </tbody>
            {lines.length > 0 && (
              <tfoot>
                <tr className={erp.totalRow}>
                  <td className={td} colSpan={3}>
                    Cộng
                  </td>
                  <td className={`${td} text-right font-mono`}>{fmt(linesTotal)}</td>
                  <td colSpan={2} />
                  <td className={`${td} text-right font-mono`}>{fmt(linesAlloc)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
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
