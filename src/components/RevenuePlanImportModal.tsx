/**
 * RevenuePlanImportModal — Nhập kế hoạch thu - chi của khối từ file Excel.
 *
 * Luồng 3 bước:
 *   1. Tải file mẫu (trống, hoặc kèm dữ liệu đang khai báo trên màn hình)
 *   2. Chọn / kéo thả file .xlsx đã điền
 *   3. Xem trước + kiểm tra lỗi → "Áp dụng vào bảng" (chỉ đổ vào bản nháp,
 *      người dùng vẫn phải bấm "Lưu khai báo" để ghi vào kế hoạch)
 *
 * Cấu trúc file (sheet "KeHoach"): mỗi dòng = 1 dự án × 1 chỉ tiêu
 *   Mã dự án | Tên dự án | Chỉ tiêu | T1-SX | T1-KD | … | T12-SX | T12-KD
 * Chỉ tiêu: Doanh thu dự kiến · Thu dự kiến · Chi dự kiến · Khối lượng công việc (%)
 */
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';
import {
  X,
  Download,
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { ProjectPlan, MONTHS12, zero12, sum12 } from '../finance/FinancePlanContext';

type MetricKey = 'plannedRevenue' | 'revenue' | 'expense' | 'workloadMonthly';
const KD_OF: Record<MetricKey, keyof ProjectPlan> = {
  plannedRevenue: 'plannedRevenueKd',
  revenue: 'revenueKd',
  expense: 'expenseKd',
  workloadMonthly: 'workloadKd',
};
const METRICS: { key: MetricKey; label: string }[] = [
  { key: 'plannedRevenue', label: 'Doanh thu dự kiến' },
  { key: 'revenue', label: 'Thu dự kiến' },
  { key: 'expense', label: 'Chi dự kiến' },
  { key: 'workloadMonthly', label: 'Khối lượng công việc (%)' },
];

const SHEET = 'KeHoach';
const HEAD = ['Mã dự án', 'Tên dự án', 'Chỉ tiêu', ...MONTHS12.flatMap((m) => [`T${m}-SX`, `T${m}-KD`])];

const norm = (s: unknown) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .trim();

// "Doanh thu dự kiến" phải kiểm trước vì chứa chuỗi "thu du kien"
const metricOf = (label: unknown): MetricKey | null => {
  const n = norm(label);
  if (!n) return null;
  if (n.includes('doanh thu')) return 'plannedRevenue';
  if (n.includes('khoi luong') || n.includes('klcv')) return 'workloadMonthly';
  if (n.startsWith('chi')) return 'expense';
  if (n.startsWith('thu')) return 'revenue';
  return null;
};

// Nhận cả số thật lẫn chuỗi kiểu "1.234" / "1,5"
const parseNum = (v: unknown): number | null => {
  if (v === '' || v === null || v === undefined) return 0;
  if (typeof v === 'number') return isFinite(v) ? v : null;
  const s = String(v).replace(/\s|%/g, '');
  if (!s || s === '-' || s === '–') return 0;
  if (/^-?\d{1,3}([.,]\d{3})+$/.test(s)) return Number(s.replace(/[.,]/g, ''));
  const n = Number(s.replace(',', '.'));
  return isNaN(n) ? null : n;
};

interface Issue {
  row: number;
  msg: string;
  level: 'error' | 'warn';
}
interface Parsed {
  fileName: string;
  projects: ProjectPlan[];
  issues: Issue[];
  rowCount: number;
}

// ==========================================================================
// Tạo & đọc file
// ==========================================================================
const buildWorkbook = (khoi: string, year: number, projects: ProjectPlan[]) => {
  const rows: (string | number)[][] = [HEAD];
  const src = projects.length ? projects : [{ projectCode: 'DA-001', projectName: 'Dự án mẫu' } as ProjectPlan];
  src.forEach((p) =>
    METRICS.forEach(({ key, label }) => {
      const sx = (p[key] as number[] | undefined) || zero12();
      const kd = (p[KD_OF[key]] as number[] | undefined) || zero12();
      rows.push([p.projectCode, p.projectName, label, ...MONTHS12.flatMap((_, i) => [sx[i] || 0, kd[i] || 0])]);
    }),
  );
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 14 }, { wch: 30 }, { wch: 24 }, ...MONTHS12.flatMap(() => [{ wch: 8 }, { wch: 8 }])];
  ws['!freeze'] = { xSplit: 3, ySplit: 1 };

  const guide = XLSX.utils.aoa_to_sheet([
    ['HƯỚNG DẪN NHẬP KẾ HOẠCH THU - CHI'],
    [`Khối: ${khoi}   ·   Năm: ${year}   ·   ĐVT: triệu VNĐ (KLCV tính bằng %)`],
    [],
    ['1. Mỗi dự án gồm 4 dòng, mỗi dòng là 1 chỉ tiêu:'],
    ...METRICS.map((m) => [`     • ${m.label}`]),
    ['2. Cột T1-SX … T12-KD: giá trị từng tháng, tách SX (sản xuất) và KD (kinh doanh). Ô trống = 0.'],
    ['3. Mã dự án bắt buộc. Có thể bỏ bớt dòng chỉ tiêu không cần khai báo.'],
    ['4. Không đổi tên dòng tiêu đề của sheet "KeHoach".'],
  ]);
  guide['!cols'] = [{ wch: 100 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, SHEET);
  XLSX.utils.book_append_sheet(wb, guide, 'HuongDan');
  return wb;
};

const parseWorkbook = (wb: XLSX.WorkBook, fileName: string): Parsed => {
  const issues: Issue[] = [];
  const sheet = wb.Sheets[SHEET] || wb.Sheets[wb.SheetNames[0]];
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '', blankrows: false });

  // Tìm dòng tiêu đề (dòng có ô "Mã dự án")
  const hi = aoa.findIndex((r) => r.some((c) => norm(c) === 'ma du an'));
  if (hi < 0) {
    return { fileName, projects: [], rowCount: 0, issues: [{ row: 0, level: 'error', msg: 'Không tìm thấy dòng tiêu đề có cột "Mã dự án". Hãy dùng file mẫu.' }] };
  }
  const head = aoa[hi].map(norm);
  const cCode = head.indexOf('ma du an');
  const cName = head.indexOf('ten du an');
  const cMetric = head.findIndex((h) => h === 'chi tieu' || h === 'noi dung');
  const monthCols: { m: number; kd: boolean; c: number }[] = [];
  head.forEach((h, c) => {
    const mt = h.match(/^t(?:hang)?\s*(\d{1,2})\s*[-_ ]?\s*(sx|kd)$/);
    if (mt && +mt[1] >= 1 && +mt[1] <= 12) monthCols.push({ m: +mt[1] - 1, kd: mt[2] === 'kd', c });
  });
  if (cMetric < 0) issues.push({ row: hi + 1, level: 'error', msg: 'Thiếu cột "Chỉ tiêu".' });
  if (monthCols.length === 0) issues.push({ row: hi + 1, level: 'error', msg: 'Không có cột tháng nào (định dạng T1-SX, T1-KD …).' });
  if (issues.length) return { fileName, projects: [], rowCount: 0, issues };

  const byCode = new Map<string, ProjectPlan>();
  const seen = new Set<string>();
  let rowCount = 0;

  aoa.slice(hi + 1).forEach((r, k) => {
    const rowNo = hi + 2 + k; // số dòng như trong Excel
    const code = String(r[cCode] ?? '').trim();
    const name = cName >= 0 ? String(r[cName] ?? '').trim() : '';
    const mLabel = r[cMetric];
    if (!code && !name && !String(mLabel ?? '').trim()) return;
    rowCount++;

    if (!code) return issues.push({ row: rowNo, level: 'error', msg: 'Thiếu Mã dự án.' });
    const metric = metricOf(mLabel);
    if (!metric) return issues.push({ row: rowNo, level: 'error', msg: `Chỉ tiêu "${String(mLabel)}" không hợp lệ.` });
    const dupKey = `${code.toLowerCase()}|${metric}`;
    if (seen.has(dupKey)) return issues.push({ row: rowNo, level: 'error', msg: `Trùng chỉ tiêu "${METRICS.find((x) => x.key === metric)!.label}" của dự án ${code}.` });
    seen.add(dupKey);

    let p = byCode.get(code.toLowerCase());
    if (!p) {
      // Chưa gán mảng chỉ tiêu — để biết chỉ tiêu nào thực sự có trong file khi gộp
      p = { projectCode: code, projectName: name } as ProjectPlan;
      byCode.set(code.toLowerCase(), p);
    } else if (name && p.projectName && name !== p.projectName) {
      issues.push({ row: rowNo, level: 'warn', msg: `Tên dự án ${code} khác dòng trước — dùng "${p.projectName}".` });
    }
    if (!p.projectName) p.projectName = name;

    const sx = zero12();
    const kd = zero12();
    const badCols: string[] = [];
    const negCols: string[] = [];
    for (const { m, kd: isKd, c } of monthCols) {
      const col = `T${m + 1}-${isKd ? 'KD' : 'SX'}`;
      const v = parseNum(r[c]);
      if (v === null) {
        badCols.push(col);
        continue;
      }
      if (v < 0) negCols.push(col);
      (isKd ? kd : sx)[m] = v;
    }
    const list = (cols: string[]) => cols.slice(0, 4).join(', ') + (cols.length > 4 ? ` … (+${cols.length - 4})` : '');
    if (badCols.length) issues.push({ row: rowNo, level: 'error', msg: `${badCols.length} ô không phải số: ${list(badCols)}.` });
    if (negCols.length) issues.push({ row: rowNo, level: 'warn', msg: `${negCols.length} ô có giá trị âm: ${list(negCols)}.` });
    if (metric === 'workloadMonthly' && MONTHS12.some((_, i) => sx[i] + kd[i] > 100)) {
      issues.push({ row: rowNo, level: 'warn', msg: `KLCV dự án ${code} có tháng vượt 100%.` });
    }
    (p as any)[metric] = sx;
    (p as any)[KD_OF[metric]] = kd;
  });

  if (rowCount === 0) issues.push({ row: 0, level: 'error', msg: 'File không có dòng dữ liệu nào.' });
  return { fileName, projects: Array.from(byCode.values()), issues, rowCount };
};

// Bổ sung các mảng chỉ tiêu còn thiếu = 0
const complete = (p: ProjectPlan): ProjectPlan => {
  const out = { ...p, workload: p.workload || 0 } as any;
  METRICS.forEach(({ key }) => {
    out[key] = out[key] || zero12();
    out[KD_OF[key]] = out[KD_OF[key]] || zero12();
  });
  return out;
};

// Gộp: dự án trùng mã → chỉ tiêu có trong file ghi đè, chỉ tiêu không có giữ nguyên
const mergeProjects = (current: ProjectPlan[], incoming: ProjectPlan[]): ProjectPlan[] => {
  const out = current.map((p) => ({ ...p }));
  incoming.forEach((np) => {
    const i = out.findIndex((p) => p.projectCode.trim().toLowerCase() === np.projectCode.toLowerCase());
    if (i < 0) return void out.push(complete(np));
    const merged: ProjectPlan = { ...out[i], projectName: np.projectName || out[i].projectName };
    METRICS.forEach(({ key }) => {
      if (np[key]) {
        (merged as any)[key] = np[key];
        (merged as any)[KD_OF[key]] = np[KD_OF[key]];
      }
    });
    out[i] = merged;
  });
  return out;
};

// ==========================================================================
// Modal
// ==========================================================================
export const RevenuePlanImportModal: React.FC<{
  khoi: string;
  year: number;
  current: ProjectPlan[];
  onClose: () => void;
  onApply: (projects: ProjectPlan[], summary: string) => void;
}> = ({ khoi, year, current, onClose, onApply }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [mode, setMode] = useState<'merge' | 'replace'>('merge');
  const [dragging, setDragging] = useState(false);

  const download = (withData: boolean) =>
    XLSX.writeFile(
      buildWorkbook(khoi, year, withData ? current : []),
      withData ? `KeHoachThuChi_${khoi}_${year}.xlsx` : `Mau_KeHoachThuChi_${khoi}_${year}.xlsx`,
    );

  const readFile = async (file: File) => {
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      setParsed({ fileName: file.name, projects: [], rowCount: 0, issues: [{ row: 0, level: 'error', msg: 'Chỉ hỗ trợ file .xlsx, .xls, .csv.' }] });
      return;
    }
    try {
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array', codepage: 65001 });
      setParsed(parseWorkbook(wb, file.name));
    } catch {
      setParsed({ fileName: file.name, projects: [], rowCount: 0, issues: [{ row: 0, level: 'error', msg: 'Không đọc được file. File có thể bị hỏng hoặc đặt mật khẩu.' }] });
    }
  };

  const errors = parsed?.issues.filter((i) => i.level === 'error') || [];
  const warns = parsed?.issues.filter((i) => i.level === 'warn') || [];
  const existing = new Set(current.map((p) => p.projectCode.trim().toLowerCase()));
  const nNew = parsed?.projects.filter((p) => !existing.has(p.projectCode.toLowerCase())).length || 0;
  const nUpd = (parsed?.projects.length || 0) - nNew;
  const canApply = !!parsed && parsed.projects.length > 0 && errors.length === 0;

  const apply = () => {
    if (!parsed || !canApply) return;
    const next = mode === 'replace' ? parsed.projects.map(complete) : mergeProjects(current, parsed.projects);
    const summary =
      mode === 'replace'
        ? `Đã thay toàn bộ bằng ${parsed.projects.length} dự án từ Excel`
        : `Đã nhập Excel: ${nNew} dự án mới, ${nUpd} dự án cập nhật`;
    onApply(next, summary);
  };

  const tot = (p: ProjectPlan, a: keyof ProjectPlan, b: keyof ProjectPlan) =>
    sum12((p[a] as number[]) || zero12()) + sum12((p[b] as number[]) || zero12());
  const fmt = (n: number) => (n ? Math.round(n).toLocaleString('vi-VN') : '–');

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-emerald-600" /> Nhập kế hoạch từ Excel — Khối {khoi} {year}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">Dữ liệu được đổ vào bảng nháp, bấm “Lưu khai báo” để ghi chính thức.</p>
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
                disabled={current.length === 0}
                className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download size={13} /> Mẫu kèm dữ liệu hiện tại ({current.length} dự án)
              </button>
            </div>
            <p className="pl-7 text-[11px] text-slate-400">
              Mỗi dự án 4 dòng (Doanh thu dự kiến · Thu dự kiến · Chi dự kiến · KLCV %), cột T1-SX … T12-KD. ĐVT: triệu VNĐ.
            </p>
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
                  <span className="text-slate-400 font-semibold">· {parsed.rowCount} dòng · bấm để chọn file khác</span>
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
              <StepTitle n={3} text="Kiểm tra & áp dụng" />
              <div className="pl-7 space-y-3">
                <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                  <Chip cls="bg-slate-100 text-slate-600">{parsed.projects.length} dự án</Chip>
                  {mode === 'merge' && <Chip cls="bg-emerald-50 text-emerald-700 border border-emerald-200">{nNew} mới</Chip>}
                  {mode === 'merge' && <Chip cls="bg-blue-50 text-blue-700 border border-blue-200">{nUpd} cập nhật</Chip>}
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

                {parsed.projects.length > 0 && (
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          <th className="px-3 py-2 text-left">Mã dự án</th>
                          <th className="px-3 py-2 text-left">Tên dự án</th>
                          <th className="px-3 py-2 text-right">Doanh thu</th>
                          <th className="px-3 py-2 text-right">Thu</th>
                          <th className="px-3 py-2 text-right">Chi</th>
                          <th className="px-3 py-2 text-center">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsed.projects.map((p) => {
                          const isNew = !existing.has(p.projectCode.toLowerCase());
                          return (
                            <tr key={p.projectCode}>
                              <td className="px-3 py-1.5 font-mono font-bold text-blue-600">{p.projectCode}</td>
                              <td className="px-3 py-1.5 text-slate-700">{p.projectName || <span className="text-slate-300">—</span>}</td>
                              <td className="px-3 py-1.5 text-right font-mono">{fmt(tot(p, 'plannedRevenue', 'plannedRevenueKd'))}</td>
                              <td className="px-3 py-1.5 text-right font-mono text-emerald-700">{fmt(tot(p, 'revenue', 'revenueKd'))}</td>
                              <td className="px-3 py-1.5 text-right font-mono text-rose-700">{fmt(tot(p, 'expense', 'expenseKd'))}</td>
                              <td className="px-3 py-1.5 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${isNew || mode === 'replace' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {isNew || mode === 'replace' ? 'Mới' : 'Cập nhật'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-2">
                  <ModeOption
                    active={mode === 'merge'}
                    onClick={() => setMode('merge')}
                    title="Gộp theo mã dự án"
                    desc="Dự án trùng mã được cập nhật các chỉ tiêu có trong file; dự án khác giữ nguyên."
                  />
                  <ModeOption
                    active={mode === 'replace'}
                    onClick={() => setMode('replace')}
                    title="Thay toàn bộ"
                    desc={`Xoá ${current.length} dự án đang có trên bảng, chỉ giữ dữ liệu trong file.`}
                    danger
                  />
                </div>
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
              title={errors.length ? 'Sửa hết lỗi trong file trước khi áp dụng' : undefined}
            >
              <CheckCircle2 size={14} /> Áp dụng vào bảng
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
