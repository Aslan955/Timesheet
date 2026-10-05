/**
 * BizMonthlyImportModal — Import số liệu theo tháng của 1 dự án kinh doanh từ Excel.
 * Dùng chung cho 2 loại:
 *   • kind = 'plan'   — KẾ HOẠCH (người lập PAKD import)
 *   • kind = 'actual' — THỰC TẾ (bộ phận kế toán import hằng tháng)
 *
 * Luồng 3 bước (giống RevenuePlanImportModal):
 *   1. Tải file mẫu (các tháng lấy theo thời gian dự án; kèm dữ liệu hiện tại nếu có)
 *   2. Chọn / kéo thả file đã điền
 *   3. Xem trước + kiểm tra lỗi → "Import"
 *
 * Cấu trúc file: THÁNG nằm ngang, CHỈ TIÊU nằm dọc
 *   Chỉ tiêu                  | 12/2026 | 01/2027 | …
 *   Doanh thu (dự kiến / thực tế)
 *   Thu (dự kiến / thực tế)          — dòng tiền thu
 *   Chi … - SX                        — chi cho dự án sản xuất
 *   Chi … - KD                        — chi cho dự án kinh doanh
 *   Khối lượng công việc (SP)
 * ĐVT: VNĐ (KLCV tính bằng SP).
 */
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';
import { X, Download, UploadCloud, FileSpreadsheet, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { BizMonthRow, BizProject, FIN_METRICS, FinKind, FinMetric, monthsBetween, sumRows } from '../business/BusinessProjectContext';

const KIND: Record<FinKind, { name: string; sheet: string; file: string }> = {
  plan: { name: 'kế hoạch', sheet: 'KeHoach', file: 'KeHoach' },
  actual: { name: 'thực tế', sheet: 'ThucTe', file: 'ThucTe' },
};

export const norm = (s: unknown) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim();

// "Doanh thu …" phải kiểm trước vì chứa chuỗi "thu".
// Dòng "Chi …" không ghi SX/KD → 'cost' (báo lỗi: bắt buộc tách).
const metricOf = (label: unknown): FinMetric | 'cost' | null => {
  const n = norm(label);
  if (!n) return null;
  if (n.includes('doanh thu')) return 'revenue';
  if (n.includes('khoi luong') || n.includes('klcv')) return 'workload';
  if (n.startsWith('chi')) {
    if (/\bsx\b|san xuat/.test(n)) return 'costSx';
    if (/\bkd\b|kinh doanh/.test(n)) return 'costKd';
    return 'cost';
  }
  if (n.startsWith('thu') || n.includes('dong tien')) return 'cashIn';
  return null;
};

// Nhận cả số thật lẫn chuỗi kiểu "1.234.000" / "1,5"
export const parseNum = (v: unknown): number | null => {
  if (v === '' || v === null || v === undefined) return 0;
  if (typeof v === 'number') return isFinite(v) ? v : null;
  const s = String(v).replace(/\s/g, '');
  if (!s || s === '-' || s === '–') return 0;
  if (/^-?\d{1,3}([.,]\d{3})+$/.test(s)) return Number(s.replace(/[.,]/g, ''));
  const n = Number(s.replace(',', '.'));
  return isNaN(n) ? null : n;
};

// Nhận "12/2026", "T12/2026", "Tháng 12/2026", "2026-12", ngày Excel → "2026-12"
export const parseMonth = (v: unknown): string | null => {
  const ym = (y: number, m: number) => (m >= 1 && m <= 12 && y >= 2000 && y <= 2100 ? `${y}-${String(m).padStart(2, '0')}` : null);
  if (v instanceof Date) return ym(v.getFullYear(), v.getMonth() + 1);
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    return d ? ym(d.y, d.m) : null;
  }
  const s = norm(v).replace(/^(thang|t)\s*/, '');
  let mt = s.match(/^(\d{1,2})\s*[/.-]\s*(\d{4})$/);
  if (mt) return ym(+mt[2], +mt[1]);
  mt = s.match(/^(\d{4})\s*[/.-]\s*(\d{1,2})$/);
  if (mt) return ym(+mt[1], +mt[2]);
  mt = s.match(/^\d{1,2}\s*[/.-]\s*(\d{1,2})\s*[/.-]\s*(\d{4})$/); // dd/mm/yyyy
  if (mt) return ym(+mt[2], +mt[1]);
  return null;
};

export const fmtMonth = (m: string) => `${m.slice(5, 7)}/${m.slice(0, 4)}`;

const emptyMonth = (month: string): BizMonthRow => ({ month, revenue: 0, cashIn: 0, costSx: 0, costKd: 0, workload: 0 });

const colName = (c: number) => XLSX.utils.encode_col(c);

interface Issue {
  row: number;
  msg: string;
  level: 'error' | 'warn';
}
interface Parsed {
  fileName: string;
  months: BizMonthRow[];
  issues: Issue[];
}

// ==========================================================================
// Tạo & đọc file
// ==========================================================================
const buildWorkbook = (kind: FinKind, p: BizProject, withData: boolean) => {
  const metrics = FIN_METRICS[kind];
  const current = p[kind];
  const byMonth = new Map(current.map((r) => [r.month, r]));
  const months = Array.from(new Set([...monthsBetween(p.startDate, p.endDate), ...(withData ? current.map((r) => r.month) : [])])).sort();
  const rows: (string | number)[][] = [
    ['Chỉ tiêu', ...months.map(fmtMonth)],
    ...metrics.map(({ key, label }) => [label, ...months.map((m) => (withData && byMonth.get(m)?.[key]) || 0)]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 32 }, ...months.map(() => ({ wch: 16 }))];

  const guide = XLSX.utils.aoa_to_sheet([
    [`HƯỚNG DẪN IMPORT SỐ ${KIND[kind].name.toUpperCase()} THEO THÁNG`],
    [`Dự án: ${p.masterCode} — ${p.name}   ·   Thời gian: ${fmtMonth(p.startDate.slice(0, 7))} → ${fmtMonth(p.endDate.slice(0, 7))}`],
    ['ĐVT: VNĐ, nhập số đầy đủ, vd 5800000000 (Khối lượng công việc tính bằng SP)'],
    [],
    ['1. Dòng tiêu đề: ô đầu là "Chỉ tiêu", các ô tiếp theo là tháng dạng MM/YYYY (vd 12/2026), mỗi tháng 1 cột.'],
    ['2. Mỗi dòng bên dưới là 1 chỉ tiêu:'],
    ...metrics.map((m) => [`     • ${m.label}`]),
    ['3. Chỉ dòng Chi tách SX (dự án sản xuất) / KD (dự án kinh doanh); Doanh thu, Thu và KLCV nhập 1 số cho cả dự án.'],
    ['4. Ô trống = 0. Có thể xoá bớt cột tháng không cần khai báo.'],
    ['5. Không đổi tên cột "Chỉ tiêu" và tên các chỉ tiêu.'],
  ]);
  guide['!cols'] = [{ wch: 100 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, KIND[kind].sheet);
  XLSX.utils.book_append_sheet(wb, guide, 'HuongDan');
  return wb;
};

const parseWorkbook = (kind: FinKind, wb: XLSX.WorkBook, fileName: string, project: BizProject): Parsed => {
  const metrics = FIN_METRICS[kind];
  const labelOf = (k: FinMetric) => metrics.find((m) => m.key === k)!.label;
  const issues: Issue[] = [];
  const fail = (msg: string): Parsed => ({ fileName, months: [], issues: [{ row: 0, level: 'error', msg }] });
  const sheet = wb.Sheets[KIND[kind].sheet] || wb.Sheets[wb.SheetNames[0]];
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '', blankrows: false });

  // Dòng tiêu đề: có ô "Chỉ tiêu" / "Nội dung"
  const isLabelHead = (c: unknown) => ['chi tieu', 'noi dung'].includes(norm(c));
  const hi = aoa.findIndex((r) => r.some(isLabelHead));
  if (hi < 0) return fail('Không tìm thấy dòng tiêu đề có ô "Chỉ tiêu". Hãy dùng file mẫu.');
  const head = aoa[hi];
  const cLabel = head.findIndex(isLabelHead);

  // Cột tháng (nằm ngang)
  const inRange = new Set(monthsBetween(project.startDate, project.endDate));
  const monthCols: { month: string; c: number }[] = [];
  const seenMonth = new Map<string, number>();
  head.forEach((cell, c) => {
    if (c <= cLabel || String(cell).trim() === '') return;
    if (/^(tong|ca nam|ca du an)/.test(norm(cell))) return; // bỏ qua cột tổng nếu có
    const month = parseMonth(cell);
    if (!month) return void issues.push({ row: hi + 1, level: 'error', msg: `Cột ${colName(c)}: "${cell}" không phải tháng hợp lệ (dùng MM/YYYY).` });
    if (seenMonth.has(month))
      return void issues.push({ row: hi + 1, level: 'error', msg: `Tháng ${fmtMonth(month)} bị trùng (cột ${colName(seenMonth.get(month)!)} và ${colName(c)}).` });
    seenMonth.set(month, c);
    if (inRange.size && !inRange.has(month)) issues.push({ row: hi + 1, level: 'warn', msg: `Tháng ${fmtMonth(month)} nằm ngoài thời gian dự án.` });
    monthCols.push({ month, c });
  });
  if (!monthCols.length && !issues.length) return fail('Dòng tiêu đề không có cột tháng nào (vd 12/2026).');

  // Dòng chỉ tiêu (nằm dọc)
  const records = new Map(monthCols.map(({ month }) => [month, emptyMonth(month)]));
  const seenMetric = new Map<FinMetric, number>();
  aoa.slice(hi + 1).forEach((r, i) => {
    const row = hi + 2 + i;
    const label = r[cLabel];
    if (r.every((c) => String(c).trim() === '')) return;
    const key = metricOf(label);
    if (key === 'cost')
      return void issues.push({ row, level: 'error', msg: `"${label}": phải tách 2 dòng "${labelOf('costSx')}" và "${labelOf('costKd')}".` });
    if (!key) return void issues.push({ row, level: 'warn', msg: `Bỏ qua dòng "${label}" — không phải chỉ tiêu.` });
    if (seenMetric.has(key)) return void issues.push({ row, level: 'error', msg: `Chỉ tiêu "${label}" bị trùng với dòng ${seenMetric.get(key)}.` });
    seenMetric.set(key, row);
    monthCols.forEach(({ month, c }) => {
      const n = parseNum(r[c]);
      if (n === null) return void issues.push({ row, level: 'error', msg: `Ô ${colName(c)}${row} (${fmtMonth(month)}): "${r[c]}" không phải số.` });
      if (n < 0) issues.push({ row, level: 'warn', msg: `Ô ${colName(c)}${row} (${fmtMonth(month)}) có giá trị âm (${n}).` });
      records.get(month)![key] = n;
    });
  });
  metrics.forEach(({ key, label }) => {
    if (!seenMetric.has(key)) issues.push({ row: 0, level: 'warn', msg: `Thiếu dòng "${label}" — coi như 0.` });
  });
  if (!seenMetric.size && !issues.some((x) => x.level === 'error')) issues.push({ row: 0, level: 'error', msg: 'File không có dòng chỉ tiêu nào.' });

  return { fileName, months: [...records.values()].sort((a, b) => a.month.localeCompare(b.month)), issues };
};

// Gộp theo tháng: tháng có trong file ghi đè, tháng khác giữ nguyên
const mergeMonths = (current: BizMonthRow[], incoming: BizMonthRow[]) => {
  const map = new Map(current.map((r) => [r.month, r]));
  incoming.forEach((r) => map.set(r.month, r));
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
};

// ==========================================================================
// Modal
// ==========================================================================
export const BizMonthlyImportModal: React.FC<{
  kind: FinKind;
  project: BizProject;
  onClose: () => void;
  onApply: (rows: BizMonthRow[], fileName: string, summary: string) => void;
}> = ({ kind, project, onClose, onApply }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const current = project[kind];
  const metrics = FIN_METRICS[kind];
  const name = KIND[kind].name;
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [mode, setMode] = useState<'merge' | 'replace'>(current.length ? 'merge' : 'replace');
  const [dragging, setDragging] = useState(false);
  const hasData = current.length > 0;

  const download = (withData: boolean) =>
    XLSX.writeFile(
      buildWorkbook(kind, project, withData),
      withData ? `${KIND[kind].file}_${project.masterCode}.xlsx` : `Mau_${KIND[kind].file}_${project.masterCode}.xlsx`,
    );

  const readFile = async (file: File) => {
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      setParsed({ fileName: file.name, months: [], issues: [{ row: 0, level: 'error', msg: 'Chỉ hỗ trợ file .xlsx, .xls, .csv.' }] });
      return;
    }
    try {
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array', codepage: 65001, cellDates: true });
      setParsed(parseWorkbook(kind, wb, file.name, project));
    } catch {
      setParsed({ fileName: file.name, months: [], issues: [{ row: 0, level: 'error', msg: 'Không đọc được file. File có thể bị hỏng hoặc đặt mật khẩu.' }] });
    }
  };

  const errors = parsed?.issues.filter((i) => i.level === 'error') || [];
  const warns = parsed?.issues.filter((i) => i.level === 'warn') || [];
  const existing = new Set(current.map((r) => r.month));
  const nUpd = parsed?.months.filter((r) => existing.has(r.month)).length || 0;
  const nNew = (parsed?.months.length || 0) - nUpd;
  const canApply = !!parsed && parsed.months.length > 0 && errors.length === 0;

  const apply = () => {
    if (!parsed || !canApply) return;
    const next = mode === 'replace' ? parsed.months : mergeMonths(current, parsed.months);
    const summary =
      mode === 'replace'
        ? `Đã import ${name} ${parsed.months.length} tháng từ ${parsed.fileName}`
        : `Đã import ${name}: ${nNew} tháng mới, ${nUpd} tháng cập nhật`;
    onApply(next, parsed.fileName, summary);
  };

  const fmt = (n: number) => (n ? Math.round(n).toLocaleString('en-US') : '–');

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
              <FileSpreadsheet size={16} className="text-emerald-600" /> Import số {name} theo tháng — {project.masterCode} · {project.name}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Thời gian dự án {fmtMonth(project.startDate.slice(0, 7))} → {fmtMonth(project.endDate.slice(0, 7))} · ĐVT: VNĐ
              {kind === 'actual' && ' · Bộ phận kế toán import hằng tháng'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Bước 1 */}
          <section className="space-y-2">
            <StepTitle n={1} text="Tải file mẫu" />
            <div className="flex flex-wrap gap-2 pl-7">
              <button onClick={() => download(false)} className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                <Download size={13} /> File mẫu trống
              </button>
              <button
                onClick={() => download(true)}
                disabled={!hasData}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download size={13} /> Mẫu kèm số {name} hiện tại ({current.length} tháng)
              </button>
            </div>
            <p className="pl-7 text-[11px] text-slate-400">Tháng nằm ngang (MM/YYYY), chỉ tiêu nằm dọc: {metrics.map((m) => m.label).join(' · ')}.</p>
          </section>

          {/* Bước 2 */}
          <section className="space-y-2">
            <StepTitle n={2} text="Chọn file đã điền" />
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
                  <span className="text-slate-400 font-semibold">· {parsed.months.length} tháng · bấm để chọn file khác</span>
                </span>
              ) : (
                <>
                  <span className="text-xs font-bold text-slate-600">Kéo thả file vào đây hoặc bấm để chọn</span>
                  <span className="text-[11px] text-slate-400">.xlsx, .xls, .csv</span>
                </>
              )}
            </div>
          </section>

          {/* Bước 3 */}
          {parsed && (
            <section className="space-y-2">
              <StepTitle n={3} text="Kiểm tra & import" />
              <div className="pl-7 space-y-3">
                <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                  <Chip cls="bg-slate-100 text-slate-600">{parsed.months.length} tháng</Chip>
                  {mode === 'merge' && <Chip cls="bg-emerald-50 text-emerald-700 border border-emerald-200">{nNew} tháng mới</Chip>}
                  {mode === 'merge' && <Chip cls="bg-blue-50 text-blue-700 border border-blue-200">{nUpd} tháng cập nhật</Chip>}
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

                {parsed.months.length > 0 && (
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          <th className="sticky left-0 bg-slate-50 px-3 py-2 text-left min-w-[200px]">Chỉ tiêu</th>
                          <th className="px-3 py-2 text-right bg-slate-100">Tổng</th>
                          {parsed.months.map((r) => (
                            <th key={r.month} className="px-3 py-2 text-right whitespace-nowrap">
                              {fmtMonth(r.month)}
                              {mode === 'merge' && (
                                <span className={`block text-[9px] ${existing.has(r.month) ? 'text-blue-600' : 'text-emerald-600'}`}>
                                  {existing.has(r.month) ? 'Cập nhật' : 'Mới'}
                                </span>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {metrics.map(({ key, label }) => (
                          <tr key={key}>
                            <td className="sticky left-0 bg-white px-3 py-1.5 font-bold text-slate-700 whitespace-nowrap">{label}</td>
                            <td className="px-3 py-1.5 text-right font-mono font-black bg-slate-50">{fmt(sumRows(parsed.months, key))}</td>
                            {parsed.months.map((r) => (
                              <td key={r.month} className="px-3 py-1.5 text-right font-mono text-slate-600">{fmt(r[key])}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {hasData && (
                  <div className="grid sm:grid-cols-2 gap-2">
                    <ModeOption
                      active={mode === 'merge'}
                      onClick={() => setMode('merge')}
                      title="Gộp theo tháng"
                      desc="Tháng có trong file được ghi đè; các tháng khác giữ nguyên."
                    />
                    <ModeOption
                      active={mode === 'replace'}
                      onClick={() => setMode('replace')}
                      title="Thay toàn bộ"
                      desc={`Xoá số ${name} ${current.length} tháng hiện tại, chỉ giữ dữ liệu trong file.`}
                      danger
                    />
                  </div>
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
              title={errors.length ? 'Sửa hết lỗi trong file trước khi import' : undefined}
            >
              <CheckCircle2 size={14} /> Import {name}
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

const ModeOption: React.FC<{ active: boolean; onClick: () => void; title: string; desc: string; danger?: boolean }> = ({ active, onClick, title, desc, danger }) => (
  <button
    onClick={onClick}
    className={`text-left p-3 rounded-xl border cursor-pointer transition-colors ${
      active ? (danger ? 'border-rose-300 bg-rose-50/60' : 'border-emerald-300 bg-emerald-50/60') : 'border-slate-200 hover:bg-slate-50'
    }`}
  >
    <div className="flex items-center gap-2">
      <span className={`w-3.5 h-3.5 rounded-full border-2 ${active ? (danger ? 'border-rose-500 bg-rose-500' : 'border-emerald-500 bg-emerald-500') : 'border-slate-300'}`} />
      <span className={`text-xs font-black ${danger && active ? 'text-rose-700' : 'text-slate-700'}`}>{title}</span>
    </div>
    <p className="text-[11px] text-slate-500 mt-1 pl-5.5">{desc}</p>
  </button>
);
