/**
 * BlockPlanImportModal — Import kế hoạch theo tháng cho CẢ KHỐI từ Excel (màn "Lập kế hoạch khối").
 *
 * 3 bước: Tải mẫu (điền sẵn danh sách dự án của khối, có thể kèm số đang nhập) → Chọn file → Xem trước → Áp vào bảng.
 * Kết quả chỉ ghi vào bảng đang sửa trên màn (chưa lưu); GĐK vẫn Lưu nháp / Gửi duyệt như bình thường.
 *
 * Cấu trúc file (1 sheet "KeHoach"):
 *   Mã dự án | Tên dự án | Chỉ tiêu            | 01/2026 | 02/2026 | … | 12/2026 | Cả năm
 *   022.061  | Nền tảng… | Doanh thu dự kiến   |   …     |
 *            |           | Chi dự kiến         |         ← có thể tách 2 dòng "Chi dự kiến - SX" / "Chi dự kiến - KD"
 *            |           | Dòng tiền thu       |
 *            |           | Khối lượng công việc (SP)
 *   Mã dự án để trống = cùng dự án với dòng trên. Ô trống = 0. Cột "Cả năm" bỏ qua khi đọc.
 * ĐVT: VNĐ (KLCV: SP). Nhận cả số viết tắt: 1.2 tỷ · 500tr · 35k.
 */
import React, { useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, RotateCcw, UploadCloud, X } from 'lucide-react';
import { BizProject, matchProject } from '../business/BusinessProjectContext';
import { PlanCells, emptyMonth, projectMonthsInYear, yearMonths } from '../business/BlockPlanContext';
import { GRID_METRICS, GridMetric, fmtNum, metricValue, parseAmount, setCell, sumMetric } from '../business/blockPlan';
import { norm, parseMonth } from './BizMonthlyImportModal';
import { Btn, Tag, erp } from './erp/Erp';

const fmtMonth = (m: string) => `${m.slice(5, 7)}/${m.slice(0, 4)}`;
const colName = (c: number) => XLSX.utils.encode_col(c);

// ==========================================================================
// File mẫu
// ==========================================================================
const buildWorkbook = (division: string, year: string, projects: BizProject[], cells: PlanCells, withData: boolean) => {
  const months = yearMonths(year);
  const rows: (string | number)[][] = [['Mã dự án', 'Tên dự án', 'Chỉ tiêu', ...months.map(fmtMonth), 'Cả năm']];
  projects.forEach((p) => {
    const ok = new Set(projectMonthsInYear(p, year));
    GRID_METRICS.forEach((m, i) => {
      const vals = months.map((mo) => (ok.has(mo) ? (withData ? metricValue(cells[p.id]?.[mo], m.key) : 0) : ''));
      const total = vals.reduce<number>((s, v) => s + (typeof v === 'number' ? v : 0), 0);
      rows.push([i === 0 ? p.masterCode : '', i === 0 ? p.name : '', m.label, ...vals, total]);
    });
  });
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 12 }, { wch: 34 }, { wch: 28 }, ...months.map(() => ({ wch: 16 })), { wch: 18 }];
  ws['!freeze'] = { xSplit: 3, ySplit: 1 };

  const guide = XLSX.utils.aoa_to_sheet([
    [`HƯỚNG DẪN IMPORT KẾ HOẠCH KHỐI ${division} — NĂM ${year}`],
    ['ĐVT: VNĐ, nhập số đầy đủ (vd 5800000000) hoặc viết tắt (1.2 tỷ · 500tr · 35k). Khối lượng công việc tính bằng SP.'],
    [],
    ['1. Mỗi dự án 4 dòng: Doanh thu dự kiến · Chi dự kiến · Dòng tiền thu · Khối lượng công việc (SP).'],
    ['   Có thể tách "Chi dự kiến" thành 2 dòng "Chi dự kiến - SX" và "Chi dự kiến - KD".'],
    ['2. Cột "Mã dự án" để trống = cùng dự án với dòng phía trên. Không đổi mã dự án; dự án lạ sẽ bị báo lỗi.'],
    ['3. Chỉ nhập vào các tháng dự án đang triển khai (ô có số 0 trong file mẫu). Ô để trống trong file mẫu là tháng ngoài thời gian dự án — bỏ qua.'],
    ['4. Ô trống = 0. Cột "Cả năm" chỉ để tham khảo, hệ thống không đọc.'],
    ['5. Không đổi tên các cột "Mã dự án", "Chỉ tiêu" và tiêu đề tháng (MM/YYYY).'],
  ]);
  guide['!cols'] = [{ wch: 110 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'KeHoach');
  XLSX.utils.book_append_sheet(wb, guide, 'HuongDan');
  return wb;
};

// ==========================================================================
// Đọc file
// ==========================================================================
type FileMetric = GridMetric | 'costSx' | 'costKd';
const metricOf = (label: unknown): FileMetric | null => {
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

interface Issue {
  row: number;
  msg: string;
  level: 'error' | 'warn';
}
/** Giá trị đọc được: dự án → tháng → chỉ tiêu → số. */
type Incoming = Record<string, Record<string, Partial<Record<FileMetric, number>>>>;
interface Parsed {
  fileName: string;
  data: Incoming;
  issues: Issue[];
  nCells: number;
}

const parseWorkbook = (wb: XLSX.WorkBook, fileName: string, year: string, projects: BizProject[]): Parsed => {
  const issues: Issue[] = [];
  const fail = (msg: string): Parsed => ({ fileName, data: {}, issues: [{ row: 0, level: 'error', msg }], nCells: 0 });
  const sheet = wb.Sheets['KeHoach'] || wb.Sheets[wb.SheetNames[0]];
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '', blankrows: false });

  const isCodeHead = (c: unknown) => /^ma (du an|tong|project)/.test(norm(c));
  const isLabelHead = (c: unknown) => ['chi tieu', 'noi dung'].includes(norm(c));
  const hi = aoa.findIndex((r) => r.some(isCodeHead) && r.some(isLabelHead));
  if (hi < 0) return fail('Không tìm thấy dòng tiêu đề có ô "Mã dự án" và "Chỉ tiêu". Hãy dùng file mẫu.');
  const head = aoa[hi];
  const cCode = head.findIndex(isCodeHead);
  const cLabel = head.findIndex(isLabelHead);

  // Cột tháng
  const monthCols: { month: string; c: number }[] = [];
  const seen = new Map<string, number>();
  head.forEach((cell, c) => {
    if (c <= Math.max(cCode, cLabel) || String(cell).trim() === '') return;
    if (/^(tong|ca nam)/.test(norm(cell))) return;
    const month = parseMonth(cell);
    if (!month) return void issues.push({ row: hi + 1, level: 'error', msg: `Cột ${colName(c)}: "${cell}" không phải tháng hợp lệ (dùng MM/YYYY).` });
    if (seen.has(month)) return void issues.push({ row: hi + 1, level: 'error', msg: `Tháng ${fmtMonth(month)} bị trùng (cột ${colName(seen.get(month)!)} và ${colName(c)}).` });
    seen.set(month, c);
    if (!month.startsWith(year)) return void issues.push({ row: hi + 1, level: 'warn', msg: `Cột ${colName(c)} (${fmtMonth(month)}) không thuộc năm ${year} — bỏ qua.` });
    monthCols.push({ month, c });
  });
  if (!monthCols.length) return fail(`Dòng tiêu đề không có cột tháng nào của năm ${year} (vd 01/${year}).`);

  // Dòng dữ liệu
  const data: Incoming = {};
  let nCells = 0;
  let current: BizProject | undefined;
  const seenMetric = new Map<string, number>(); // `${pid}|${metric}` → dòng
  const unknownCodes = new Set<string>();
  aoa.slice(hi + 1).forEach((r, i) => {
    const row = hi + 2 + i;
    if (r.every((c) => String(c).trim() === '')) return;
    const code = String(r[cCode] ?? '').trim();
    if (code) {
      current = matchProject(projects, code);
      if (!current) {
        if (!unknownCodes.has(code)) issues.push({ row, level: 'error', msg: `Mã dự án "${code}" không thuộc khối này (hoặc chưa được cấp mã).` });
        unknownCodes.add(code);
      }
    }
    if (!current) return;
    const label = r[cLabel];
    const key = metricOf(label);
    if (!key) {
      if (String(label).trim()) issues.push({ row, level: 'warn', msg: `Bỏ qua dòng "${label}" — không phải chỉ tiêu.` });
      return;
    }
    const mk = `${current.id}|${key}`;
    if (seenMetric.has(mk)) return void issues.push({ row, level: 'error', msg: `${current.masterCode}: chỉ tiêu "${label}" bị trùng với dòng ${seenMetric.get(mk)}.` });
    seenMetric.set(mk, row);
    const ok = new Set(projectMonthsInYear(current, year));
    const p = current;
    monthCols.forEach(({ month, c }) => {
      const raw = r[c];
      const v = typeof raw === 'number' ? (isFinite(raw) ? Math.round(raw) : null) : parseAmount(String(raw ?? ''));
      if (v === null) return void issues.push({ row, level: 'error', msg: `Ô ${colName(c)}${row} (${p.masterCode} · ${fmtMonth(month)}): "${raw}" không phải số.` });
      if (!ok.has(month)) {
        if (v) issues.push({ row, level: 'warn', msg: `Ô ${colName(c)}${row}: ${p.masterCode} không triển khai trong ${fmtMonth(month)} — bỏ qua giá trị ${fmtNum(v)}.` });
        return;
      }
      data[p.id] ??= {};
      data[p.id][month] ??= {};
      data[p.id][month][key] = v;
      nCells++;
    });
  });
  projects.forEach((p) => {
    if (!data[p.id]) issues.push({ row: 0, level: 'warn', msg: `Không có dòng nào của ${p.masterCode} — ${p.name}: giữ nguyên số đang nhập.` });
  });
  if (!nCells && !issues.some((x) => x.level === 'error')) issues.push({ row: 0, level: 'error', msg: 'File không có ô số liệu nào đọc được.' });
  return { fileName, data, issues, nCells };
};

/** Áp số liệu đọc được vào bảng: ô có trong file ghi đè, ô khác giữ nguyên. */
const applyIncoming = (cells: PlanCells, projects: BizProject[], data: Incoming): PlanCells => {
  let next = cells;
  projects.forEach((p) => {
    const byMonth = data[p.id];
    if (!byMonth) return;
    Object.entries(byMonth).forEach(([month, vals]) => {
      (['revenue', 'cashIn', 'workload'] as const).forEach((k) => {
        if (vals[k] !== undefined) next = setCell(next, p, month, k, vals[k]!);
      });
      if (vals.costSx !== undefined || vals.costKd !== undefined) {
        const cur = next[p.id]?.[month] || emptyMonth(month);
        const row = { ...cur, costSx: vals.costSx ?? cur.costSx, costKd: vals.costKd ?? cur.costKd };
        next = { ...next, [p.id]: { ...(next[p.id] || {}), [month]: row } };
      } else if (vals.cost !== undefined) next = setCell(next, p, month, 'cost', vals.cost);
    });
  });
  return next;
};

// ==========================================================================
// Modal
// ==========================================================================
export const BlockPlanImportModal: React.FC<{
  division: string;
  year: string;
  projects: BizProject[];
  cells: PlanCells;
  onClose: () => void;
  onApply: (next: PlanCells, summary: string) => void;
}> = ({ division, year, projects, cells, onClose, onApply }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [dragging, setDragging] = useState(false);
  const months = yearMonths(year);

  const download = (withData: boolean) =>
    XLSX.writeFile(buildWorkbook(division, year, projects, cells, withData), `${withData ? 'KeHoach' : 'Mau_KeHoach'}_${division}_${year}.xlsx`);

  const readFile = async (file: File) => {
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      setParsed({ fileName: file.name, data: {}, issues: [{ row: 0, level: 'error', msg: 'Chỉ hỗ trợ file .xlsx, .xls, .csv.' }], nCells: 0 });
      return;
    }
    try {
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array', codepage: 65001, cellDates: true });
      setParsed(parseWorkbook(wb, file.name, year, projects));
    } catch {
      setParsed({ fileName: file.name, data: {}, issues: [{ row: 0, level: 'error', msg: 'Không đọc được file. File có thể bị hỏng hoặc đặt mật khẩu.' }], nCells: 0 });
    }
  };

  const errors = parsed?.issues.filter((i) => i.level === 'error') || [];
  const warns = parsed?.issues.filter((i) => i.level === 'warn') || [];
  // Xem trước cả khi còn lỗi (để biết dòng nào cần sửa); chỉ cho áp khi hết lỗi.
  const next = useMemo(() => (parsed ? applyIncoming(cells, projects, parsed.data) : null), [parsed, cells, projects]);

  // Xem trước: dự án có trong file — tổng cả năm cũ → mới từng chỉ tiêu
  const preview = useMemo(() => {
    if (!parsed || !next) return [];
    return projects
      .filter((p) => parsed.data[p.id])
      .map((p) => {
        let changed = 0;
        months.forEach((m) => GRID_METRICS.forEach(({ key }) => metricValue(cells[p.id]?.[m], key) !== metricValue(next[p.id]?.[m], key) && changed++));
        return { p, changed, before: GRID_METRICS.map(({ key }) => sumMetric(cells, p.id, months, key)), after: GRID_METRICS.map(({ key }) => sumMetric(next, p.id, months, key)) };
      });
  }, [parsed, next, projects, cells, months]);
  const totalChanged = preview.reduce((s, x) => s + x.changed, 0);
  const canApply = !!next && errors.length === 0 && totalChanged > 0;

  const apply = () => {
    if (!next || !canApply) return;
    onApply(next, `Đã import kế hoạch từ ${parsed!.fileName}: ${preview.length} dự án · ${totalChanged} ô thay đổi (chưa lưu — bấm Lưu nháp hoặc Gửi duyệt)`);
  };

  const Delta: React.FC<{ a: number; b: number }> = ({ a, b }) =>
    a === b ? (
      <span className="text-slate-400">{fmtNum(b) || '0'}</span>
    ) : (
      <span className="block leading-tight">
        <b className="block text-[#1f5fa8]">{fmtNum(b) || '0'}</b>
        <span className="block text-[11px] text-slate-400 line-through">{fmtNum(a) || '0'}</span>
      </span>
    );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="relative bg-[#eef1f5] w-full max-w-5xl rounded-[4px] border border-slate-400 shadow-2xl z-10 flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-t-[3px]">
          <div className="min-w-0">
            <h3 className="text-[14px] font-bold flex items-center gap-2">
              <FileSpreadsheet size={16} /> Import kế hoạch khối {division} — năm {year}
            </h3>
            <p className="text-[11px] text-slate-300">
              {projects.length} dự án · 4 chỉ tiêu × 12 tháng · ĐVT: VNĐ (KLCV: SP) · số import ghi vào bảng đang sửa, chưa lưu
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 cursor-pointer" title="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="p-3 space-y-3 overflow-y-auto">
          {/* Bước 1 */}
          <section className="bg-white border border-slate-300 rounded-[4px] p-3">
            <p className="text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide mb-2">1. Tải file mẫu</p>
            <div className="flex flex-wrap gap-2">
              <Btn icon={Download} onClick={() => download(false)}>
                File mẫu trống (đã điền danh sách dự án)
              </Btn>
              <Btn icon={Download} onClick={() => download(true)}>
                File kèm số đang nhập để sửa
              </Btn>
            </div>
            <p className="mt-2 text-[11.5px] text-slate-500">
              Mỗi dự án 4 dòng: {GRID_METRICS.map((m) => m.label).join(' · ')}. Tháng nằm ngang (MM/YYYY). Ô trống trong file mẫu = tháng ngoài thời gian dự án.
            </p>
          </section>

          {/* Bước 2 + 3 */}
          <section className="bg-white border border-slate-300 rounded-[4px] p-3">
            <p className="text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide mb-2">{parsed ? '2. Kiểm tra & xem trước' : '2. Chọn file đã điền'}</p>
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
            {!parsed ? (
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => (e.preventDefault(), setDragging(true))}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) readFile(f);
                }}
                className={`flex flex-col items-center justify-center gap-1.5 py-8 rounded-[4px] border-2 border-dashed cursor-pointer ${
                  dragging ? 'border-[#1f5fa8] bg-[#eaf2fc]' : 'border-slate-300 hover:border-[#1f5fa8] hover:bg-slate-50'
                }`}
              >
                <UploadCloud size={26} className="text-[#1f5fa8]" />
                <span className="text-[13px] font-semibold text-slate-700">Kéo thả file vào đây hoặc bấm để chọn</span>
                <span className="text-[11.5px] text-slate-400">.xlsx · .xls · .csv</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
                  <FileSpreadsheet size={15} className="text-emerald-600" />
                  <b className="text-slate-800">{parsed.fileName}</b>
                  <span className="text-slate-500">
                    · {preview.length} dự án · {parsed.nCells} ô đọc được · <b className="text-[#1f5fa8]">{totalChanged} ô thay đổi</b>
                  </span>
                  {errors.length > 0 && <Tag cls="bg-rose-50 text-rose-700 border-rose-300">{errors.length} lỗi</Tag>}
                  {warns.length > 0 && <Tag cls="bg-amber-50 text-amber-700 border-amber-300">{warns.length} cảnh báo</Tag>}
                </div>
                {parsed.issues.length > 0 && (
                  <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-[3px] divide-y divide-slate-100">
                    {parsed.issues.slice(0, 80).map((it, i) => (
                      <p key={i} className="flex items-start gap-1.5 px-2.5 py-1.5 text-[12px] text-slate-700">
                        <AlertTriangle size={13} className={`mt-0.5 shrink-0 ${it.level === 'error' ? 'text-rose-500' : 'text-amber-500'}`} />
                        <span>
                          {it.row > 0 && <b className="text-slate-500 mr-1">Dòng {it.row}:</b>}
                          {it.msg}
                        </span>
                      </p>
                    ))}
                  </div>
                )}
                {preview.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className={erp.table}>
                      <thead>
                        <tr>
                          <th className={`${erp.th} text-left`}>Dự án</th>
                          {GRID_METRICS.map((m) => (
                            <th key={m.key} className={`${erp.th} text-right`}>
                              {m.short} cả năm
                            </th>
                          ))}
                          <th className={`${erp.th} text-right`}>Ô đổi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map(({ p, changed, before, after }) => (
                          <tr key={p.id} className={erp.tr}>
                            <td className={erp.td}>
                              <p className="font-semibold text-slate-800 truncate max-w-[220px]" title={p.name}>
                                {p.name}
                              </p>
                              <p className="font-mono text-[11px] text-[#1f5fa8]">{p.masterCode}</p>
                            </td>
                            {GRID_METRICS.map((m, i) => (
                              <td key={m.key} className={`${erp.td} ${erp.num} text-[12px]`}>
                                <Delta a={before[i]} b={after[i]} />
                              </td>
                            ))}
                            <td className={`${erp.td} ${erp.num} font-semibold`}>{changed || <span className="text-slate-400">0</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-1.5 text-[11.5px] text-slate-500">Số đậm = sau khi import, số gạch ngang bên dưới = đang nhập. Dự án không có trong file giữ nguyên.</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-slate-300 bg-slate-50 rounded-b-[3px]">
          {parsed ? (
            <Btn icon={RotateCcw} onClick={() => setParsed(null)}>
              Chọn lại
            </Btn>
          ) : (
            <span />
          )}
          <span className="ml-auto flex gap-2">
            <Btn icon={X} onClick={onClose}>
              Huỷ
            </Btn>
            <Btn variant="primary" icon={CheckCircle2} onClick={apply} disabled={!canApply}>
              Áp vào bảng{totalChanged > 0 && ` (${totalChanged} ô)`}
            </Btn>
          </span>
        </div>
      </div>
    </div>
  );
};
