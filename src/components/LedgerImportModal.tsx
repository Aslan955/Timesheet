/**
 * LedgerImportModal — Kế toán import sổ chi tiết toàn công ty (tự nhận loại file theo dòng tiêu đề):
 *
 *  • Dòng tiền thu ("BÁO CÁO DÒNG TIỀN THU TRONG KỲ" — sổ tiền gửi ngân hàng)
 *      Ngày hạch toán | Diễn giải | Số tiền | Tên đối tượng | Mã công trình | Tên công trình | Mã đơn vị | Tên đơn vị
 *  • Chi thực tế
 *      Mã dự án (Mã tổng/Mã SX/Mã PAKD) | Tháng (MM/yyyy) | Chi sản xuất (đ) | Chi kinh doanh (đ) | Ghi chú
 *
 * Mỗi dòng ghép vào dự án theo mã (Mã công trình / Mã dự án khớp Mã tổng, Mã PAKD hoặc Mã SX).
 * Dữ liệu các tháng có trong file thay thế dữ liệu cũ cùng loại sổ; Thu / Chi thực tế của dự án
 * được tính lại = tổng các dòng. Dòng không có mã / không khớp dự án vẫn lưu nhưng không tính vào dự án.
 */
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';
import { X, Download, UploadCloud, FileSpreadsheet, AlertTriangle, CheckCircle2, RotateCcw, Landmark, Receipt } from 'lucide-react';
import { BizProject, CashInEntry, CostEntry, LedgerKind, matchProject, useBusinessProjects } from '../business/BusinessProjectContext';

const norm = (s: unknown) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();

const parseNum = (v: unknown): number | null => {
  if (v === '' || v === null || v === undefined) return 0;
  if (typeof v === 'number') return isFinite(v) ? v : null;
  const s = String(v).replace(/\s/g, '');
  if (!s || s === '-' || s === '–') return 0;
  if (/^-?\d{1,3}([.,]\d{3})+$/.test(s)) return Number(s.replace(/[.,]/g, ''));
  const n = Number(s.replace(',', '.'));
  return isNaN(n) ? null : n;
};

const pad = (n: number) => String(n).padStart(2, '0');
/** Ngày: số serial Excel, "dd/mm/yyyy", "yyyy-mm-dd" → "YYYY-MM-DD". */
const parseDate = (v: unknown): string | null => {
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    return d ? `${d.y}-${pad(d.m)}-${pad(d.d)}` : null;
  }
  const s = String(v ?? '').trim();
  let m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  if (m && +m[2] <= 12 && +m[1] <= 31) return `${m[3]}-${pad(+m[2])}-${pad(+m[1])}`;
  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return `${m[1]}-${pad(+m[2])}-${pad(+m[3])}`;
  return null;
};
/** Tháng: số serial Excel, "MM/yyyy", "yyyy-MM" → "YYYY-MM". */
const parseMonth = (v: unknown): string | null => {
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    return d ? `${d.y}-${pad(d.m)}` : null;
  }
  const s = String(v ?? '').trim();
  let m = s.match(/^(\d{1,2})[/.-](\d{4})$/);
  if (m && +m[1] >= 1 && +m[1] <= 12) return `${m[2]}-${pad(+m[1])}`;
  m = s.match(/^(\d{4})-(\d{1,2})$/);
  if (m && +m[2] >= 1 && +m[2] <= 12) return `${m[1]}-${pad(+m[2])}`;
  const d = parseDate(s);
  return d ? d.slice(0, 7) : null;
};

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const fmtMonth = (m: string) => `${m.slice(5, 7)}/${m.slice(0, 4)}`;

interface Issue {
  row: number;
  msg: string;
  level: 'error' | 'warn';
}
interface Parsed {
  kind: LedgerKind | null;
  fileName: string;
  entries: (CashInEntry | CostEntry)[];
  months: string[];
  issues: Issue[];
}

const CASH_HEAD = ['Ngày hạch toán', 'Diễn giải', 'Số tiền', 'Tên đối tượng', 'Mã công trình', 'Tên công trình', 'Mã đơn vị', 'Tên đơn vị'];
const COST_HEAD = ['Mã dự án (Mã tổng/Mã SX/Mã PAKD) *', 'Tháng (MM/yyyy) *', 'Chi sản xuất (đ) *', 'Chi kinh doanh (đ) *', 'Ghi chú'];

// ==========================================================================
// Đọc file
// ==========================================================================
const parseWorkbook = (wb: XLSX.WorkBook, fileName: string, projects: BizProject[]): Parsed => {
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '', blankrows: false, raw: true });
  const fail = (msg: string): Parsed => ({ kind: null, fileName, entries: [], months: [], issues: [{ row: 0, level: 'error', msg }] });
  const issues: Issue[] = [];
  const unmatched = new Map<string, number>();
  let noCode = 0;
  const track = (code: string) => {
    if (!code) return void noCode++;
    if (!matchProject(projects, code)) unmatched.set(code, (unmatched.get(code) || 0) + 1);
  };

  const hiCash = aoa.findIndex((r) => r.some((c) => norm(c) === 'ngay hach toan'));
  const hiCost = aoa.findIndex((r) => r.some((c) => norm(c).startsWith('ma du an')) && r.some((c) => norm(c).startsWith('chi san xuat')));
  if (hiCash < 0 && hiCost < 0)
    return fail('Không nhận ra loại file. Cần dòng tiêu đề "Ngày hạch toán …" (dòng tiền thu) hoặc "Mã dự án … | Chi sản xuất …" (chi thực tế).');

  const entries: (CashInEntry | CostEntry)[] = [];
  const stamp = Date.now();

  if (hiCash >= 0) {
    const head = aoa[hiCash].map(norm);
    const col = (name: string) => head.findIndex((h) => h.startsWith(name));
    const c = {
      date: col('ngay hach toan'),
      desc: col('dien giai'),
      amount: col('so tien'),
      partner: col('ten doi tuong'),
      code: col('ma cong trinh'),
      pname: col('ten cong trinh'),
      ucode: col('ma don vi'),
      uname: col('ten don vi'),
    };
    if (c.amount < 0) return fail('Thiếu cột "Số tiền".');
    aoa.slice(hiCash + 1).forEach((r, i) => {
      const row = hiCash + 2 + i;
      if (r.every((x) => String(x).trim() === '')) return;
      const date = parseDate(r[c.date]);
      const amount = parseNum(r[c.amount]);
      if (!date) return void issues.push({ row, level: 'error', msg: `Ngày hạch toán "${r[c.date]}" không hợp lệ (dùng dd/mm/yyyy).` });
      if (amount === null) return void issues.push({ row, level: 'error', msg: `Số tiền "${r[c.amount]}" không phải số.` });
      const code = c.code >= 0 ? String(r[c.code]).trim() : '';
      track(code);
      const s = (k: number) => (k >= 0 ? String(r[k] ?? '').trim() : '');
      entries.push({
        id: `CI-${stamp}-${i}`,
        date,
        month: date.slice(0, 7),
        description: s(c.desc),
        amount,
        partner: s(c.partner),
        projectCode: code,
        projectName: s(c.pname),
        unitCode: s(c.ucode),
        unitName: s(c.uname),
      });
    });
  } else {
    const head = aoa[hiCost].map(norm);
    const col = (name: string) => head.findIndex((h) => h.startsWith(name));
    const c = { code: col('ma du an'), month: col('thang'), sx: col('chi san xuat'), kd: col('chi kinh doanh'), note: col('ghi chu') };
    if (c.month < 0) return fail('Thiếu cột "Tháng (MM/yyyy)".');
    aoa.slice(hiCost + 1).forEach((r, i) => {
      const row = hiCost + 2 + i;
      if (r.every((x) => String(x).trim() === '')) return;
      const code = String(r[c.code] ?? '').trim();
      const month = parseMonth(r[c.month]);
      const sx = parseNum(r[c.sx]);
      const kd = c.kd >= 0 ? parseNum(r[c.kd]) : 0;
      if (!code) return void issues.push({ row, level: 'error', msg: 'Thiếu Mã dự án.' });
      if (!month) return void issues.push({ row, level: 'error', msg: `Tháng "${r[c.month]}" không hợp lệ (dùng MM/yyyy).` });
      if (sx === null || kd === null) return void issues.push({ row, level: 'error', msg: `Chi sản xuất / Chi kinh doanh không phải số.` });
      track(code);
      entries.push({ id: `CO-${stamp}-${i}`, projectCode: code, month, costSx: sx, costKd: kd, note: c.note >= 0 ? String(r[c.note] ?? '').trim() : '' });
    });
  }

  if (noCode) issues.push({ row: 0, level: 'warn', msg: `${noCode} dòng không có mã công trình — lưu vào sổ nhưng không tính vào dự án nào (vd hoàn ứng, chi phí chung).` });
  if (unmatched.size)
    issues.push({
      row: 0,
      level: 'warn',
      msg: `${[...unmatched.values()].reduce((a, b) => a + b, 0)} dòng có mã chưa khớp dự án nào: ${[...unmatched.keys()].slice(0, 12).join(', ')}${unmatched.size > 12 ? '…' : ''}`,
    });
  if (!entries.length && !issues.some((x) => x.level === 'error')) issues.push({ row: 0, level: 'error', msg: 'File không có dòng dữ liệu nào.' });

  return { kind: hiCash >= 0 ? 'cashIn' : 'cost', fileName, entries, months: [...new Set(entries.map((e) => e.month))].sort(), issues };
};

const downloadTemplate = (kind: LedgerKind) => {
  const rows =
    kind === 'cashIn'
      ? [
          ['BÁO CÁO DÒNG TIỀN THU TRONG KỲ'],
          ['Tháng 9 năm 2026'],
          CASH_HEAD,
          ['07/09/2026', 'Thu tiền doanh thu tháng 8.2026', 360741788, 'CÔNG TY CỔ PHẦN ABC', '022.061.2', 'Nền tảng chuyển đổi số quốc gia', 'G1', 'G1'],
        ]
      : [COST_HEAD, ['022.061.2', '09/2026', 32681520, 0, 'Lương nhân sự sản xuất']];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = (kind === 'cashIn' ? [14, 60, 16, 40, 14, 36, 10, 16] : [34, 16, 18, 18, 40]).map((wch) => ({ wch }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, kind === 'cashIn' ? 'SỔ TIỀN GỬI NGÂN HÀNG' : 'Chi thuc te');
  XLSX.writeFile(wb, kind === 'cashIn' ? 'Mau_dong_tien_thu.xlsx' : 'Mau_chi_thuc_te.xlsx');
};

// ==========================================================================
// Modal
// ==========================================================================
export const LedgerImportModal: React.FC<{ onClose: () => void; onDone: (summary: string) => void; by: string }> = ({ onClose, onDone, by }) => {
  const { projects, ledger, importLedger } = useBusinessProjects();
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [dragging, setDragging] = useState(false);

  const readFile = async (file: File) => {
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      setParsed({ kind: null, fileName: file.name, entries: [], months: [], issues: [{ row: 0, level: 'error', msg: 'Chỉ hỗ trợ file .xlsx, .xls, .csv.' }] });
      return;
    }
    try {
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array', codepage: 65001 });
      setParsed(parseWorkbook(wb, file.name, projects));
    } catch {
      setParsed({ kind: null, fileName: file.name, entries: [], months: [], issues: [{ row: 0, level: 'error', msg: 'Không đọc được file.' }] });
    }
  };

  const errors = parsed?.issues.filter((i) => i.level === 'error') || [];
  const warns = parsed?.issues.filter((i) => i.level === 'warn') || [];
  const canApply = !!parsed?.kind && parsed.entries.length > 0 && errors.length === 0;
  const kindLabel = parsed?.kind === 'cashIn' ? 'Dòng tiền thu' : 'Chi thực tế';

  // Tổng hợp theo dự án khớp mã
  const byProject = new Map<string, { p: BizProject; lines: number; a: number; b: number }>();
  let unassigned = { lines: 0, a: 0, b: 0 };
  parsed?.entries.forEach((e) => {
    const p = matchProject(projects, e.projectCode);
    const [a, b] = 'amount' in e ? [e.amount, 0] : [e.costSx, e.costKd];
    if (!p) return void (unassigned = { lines: unassigned.lines + 1, a: unassigned.a + a, b: unassigned.b + b });
    const cur = byProject.get(p.id) || { p, lines: 0, a: 0, b: 0 };
    byProject.set(p.id, { p, lines: cur.lines + 1, a: cur.a + a, b: cur.b + b });
  });
  const oldLines = parsed?.kind ? (parsed.kind === 'cashIn' ? ledger.cashIn : ledger.cost).filter((e) => parsed.months.includes(e.month)).length : 0;

  const apply = () => {
    if (!parsed?.kind || !canApply) return;
    importLedger(parsed.kind, parsed.entries as CashInEntry[] | CostEntry[], parsed.months, parsed.fileName, by);
    onDone(`Đã import ${kindLabel}: ${parsed.entries.length} dòng, tháng ${parsed.months.map(fmtMonth).join(', ')} — cập nhật ${byProject.size} dự án`);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-emerald-600" /> Import sổ kế toán — Dòng tiền thu / Chi thực tế
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">File toàn công ty, nhiều dự án; hệ thống ghép từng dòng vào dự án theo mã. ĐVT: VNĐ</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <section className="space-y-2">
            <StepTitle n={1} text="Tải file mẫu" />
            <div className="flex flex-wrap gap-2 pl-7">
              <button onClick={() => downloadTemplate('cashIn')} className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                <Download size={13} /> Mẫu dòng tiền thu
              </button>
              <button onClick={() => downloadTemplate('cost')} className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                <Download size={13} /> Mẫu chi thực tế
              </button>
            </div>
            <p className="pl-7 text-[11px] text-slate-400">
              Dòng tiền thu: {CASH_HEAD.join(' · ')}. Chi thực tế: Mã dự án · Tháng · Chi sản xuất · Chi kinh doanh · Ghi chú.
            </p>
          </section>

          <section className="space-y-2">
            <StepTitle n={2} text="Chọn file của kế toán" />
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) readFile(f);
                e.target.value = '';
              }}
            />
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const f = e.dataTransfer.files?.[0];
                if (f) readFile(f);
              }}
              className={`ml-7 py-6 rounded-2xl border-2 border-dashed flex flex-col items-center gap-1.5 cursor-pointer transition-colors ${
                dragging ? 'border-emerald-400 bg-emerald-50/60' : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <UploadCloud size={26} className={dragging ? 'text-emerald-500' : 'text-slate-400'} />
              {parsed ? (
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileSpreadsheet size={13} className="text-emerald-600" /> {parsed.fileName}
                  <span className="text-slate-400 font-semibold">· bấm để chọn file khác</span>
                </span>
              ) : (
                <>
                  <span className="text-xs font-bold text-slate-600">Kéo thả file vào đây hoặc bấm để chọn</span>
                  <span className="text-[11px] text-slate-400">Tự nhận loại sổ theo dòng tiêu đề · .xlsx, .xls, .csv</span>
                </>
              )}
            </div>
          </section>

          {parsed && (
            <section className="space-y-2">
              <StepTitle n={3} text="Kiểm tra & import" />
              <div className="pl-7 space-y-3">
                <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                  {parsed.kind && (
                    <Chip cls={parsed.kind === 'cashIn' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}>
                      {parsed.kind === 'cashIn' ? <Landmark size={11} className="inline mr-1" /> : <Receipt size={11} className="inline mr-1" />}
                      {kindLabel}
                    </Chip>
                  )}
                  <Chip cls="bg-slate-100 text-slate-600">{parsed.entries.length} dòng</Chip>
                  {parsed.months.length > 0 && <Chip cls="bg-blue-50 text-blue-700 border border-blue-200">Tháng {parsed.months.map(fmtMonth).join(', ')}</Chip>}
                  <Chip cls="bg-slate-100 text-slate-600">{byProject.size} dự án khớp mã</Chip>
                  {errors.length > 0 && <Chip cls="bg-rose-50 text-rose-700 border border-rose-200">{errors.length} lỗi</Chip>}
                  {warns.length > 0 && <Chip cls="bg-amber-50 text-amber-700 border border-amber-200">{warns.length} cảnh báo</Chip>}
                </div>

                {parsed.issues.length > 0 && (
                  <div className="max-h-36 overflow-y-auto rounded-xl border border-slate-100 divide-y divide-slate-100">
                    {[...errors, ...warns].map((it, i) => (
                      <div key={i} className="px-3 py-1.5 flex items-start gap-2 text-[11px]">
                        <AlertTriangle size={12} className={`mt-0.5 shrink-0 ${it.level === 'error' ? 'text-rose-500' : 'text-amber-500'}`} />
                        {it.row > 0 && <span className="font-mono text-slate-400 shrink-0">Dòng {it.row}</span>}
                        <span className={it.level === 'error' ? 'text-rose-700' : 'text-amber-700'}>{it.msg}</span>
                      </div>
                    ))}
                  </div>
                )}

                {parsed.kind && parsed.entries.length > 0 && (
                  <div className="max-h-60 overflow-auto rounded-xl border border-slate-100">
                    <table className="w-full text-xs">
                      <thead className="sticky top-0">
                        <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          <th className="px-3 py-2 text-left">Dự án</th>
                          <th className="px-3 py-2 text-right">Số dòng</th>
                          {parsed.kind === 'cashIn' ? (
                            <th className="px-3 py-2 text-right">Số tiền thu</th>
                          ) : (
                            <>
                              <th className="px-3 py-2 text-right">Chi sản xuất</th>
                              <th className="px-3 py-2 text-right">Chi kinh doanh</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[...byProject.values()].map(({ p, lines, a, b }) => (
                          <tr key={p.id}>
                            <td className="px-3 py-1.5">
                              <span className="font-mono font-bold text-blue-600">{p.masterCode}</span> <span className="text-slate-600">{p.name}</span>
                            </td>
                            <td className="px-3 py-1.5 text-right font-mono">{lines}</td>
                            <td className="px-3 py-1.5 text-right font-mono">{fmt(a)}</td>
                            {parsed.kind === 'cost' && <td className="px-3 py-1.5 text-right font-mono">{fmt(b)}</td>}
                          </tr>
                        ))}
                        {unassigned.lines > 0 && (
                          <tr className="text-slate-400 italic">
                            <td className="px-3 py-1.5">Không gắn / chưa khớp dự án</td>
                            <td className="px-3 py-1.5 text-right font-mono">{unassigned.lines}</td>
                            <td className="px-3 py-1.5 text-right font-mono">{fmt(unassigned.a)}</td>
                            {parsed.kind === 'cost' && <td className="px-3 py-1.5 text-right font-mono">{fmt(unassigned.b)}</td>}
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {parsed.kind && oldLines > 0 && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                    Sổ {kindLabel} đang có {oldLines} dòng ở tháng {parsed.months.map(fmtMonth).join(', ')} — sẽ được thay bằng dữ liệu trong file này.
                  </p>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2">
          {parsed ? (
            <button onClick={() => setParsed(null)} className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1.5 cursor-pointer">
              <RotateCcw size={13} /> Chọn lại
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-white text-xs font-bold cursor-pointer">
              Huỷ
            </button>
            <button
              onClick={apply}
              disabled={!canApply}
              className="px-3.5 py-1.5 bg-[#0fa57c] hover:bg-[#0c8e6b] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <CheckCircle2 size={14} /> Import sổ
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StepTitle: React.FC<{ n: number; text: string }> = ({ n, text }) => (
  <div className="flex items-center gap-2">
    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">{n}</span>
    <span className="text-xs font-black text-slate-700">{text}</span>
  </div>
);

const Chip: React.FC<{ cls: string; children: React.ReactNode }> = ({ cls, children }) => (
  <span className={`px-2 py-0.5 rounded-lg ${cls}`}>{children}</span>
);
