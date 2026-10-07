/**
 * LedgerImportModal — Kế toán import sổ chi tiết toàn công ty, 3 tab tương ứng 3 sổ (file xuất từ phần mềm kế toán):
 *
 *  • Doanh thu thực tế — "BÁO CÁO DOANH THU PHÁT SINH TRONG KỲ" (sổ chi tiết các tài khoản)
 *      Ngày hạch toán | Diễn giải | Số tiền | Tên đối tượng | Mã công trình | Tên công trình
 *  • Dòng tiền thu — "BÁO CÁO DÒNG TIỀN THU TRONG KỲ" (sổ tiền gửi ngân hàng)
 *      Ngày hạch toán | Diễn giải | Số tiền | Tên đối tượng | Mã công trình | Tên công trình | Mã đơn vị | Tên đơn vị
 *  • Chi thực tế — "BÁO CÁO CHI TIẾT LÃI LỖ THEO CÔNG TRÌNH" (tháng lấy ở dòng "Tháng M năm YYYY" đầu file)
 *      Mã công trình | Diễn giải | Sản xuất | CP bán hàng
 *      (vẫn nhận mẫu cũ: Mã dự án | Tháng (MM/yyyy) | Chi sản xuất | Chi kinh doanh | Ghi chú)
 *
 * Mỗi dòng ghép vào dự án theo mã (Mã công trình khớp Mã tổng, Mã PAKD hoặc Mã SX). Dữ liệu các tháng có trong file
 * thay thế dữ liệu cũ cùng loại sổ; Doanh thu / Thu / Chi thực tế của dự án được tính lại = tổng các dòng.
 * Dòng không có mã / không khớp dự án vẫn lưu nhưng không tính vào dự án. ĐVT: VNĐ.
 */
import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Landmark, Receipt, RotateCcw, TrendingUp, UploadCloud, X } from 'lucide-react';
import { BizProject, CashInEntry, CostEntry, LEDGER_LABEL, LedgerKind, matchProject, useBusinessProjects } from '../business/BusinessProjectContext';
import { Btn, FolderTabs, Tag, erp } from './erp/Erp';

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
/** Ngày: Date, số serial Excel, "dd/mm/yyyy", "yyyy-mm-dd" → "YYYY-MM-DD". */
const parseDate = (v: unknown): string | null => {
  if (v instanceof Date) return isNaN(v.getTime()) ? null : `${v.getFullYear()}-${pad(v.getMonth() + 1)}-${pad(v.getDate())}`;
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    return d ? `${d.y}-${pad(d.m)}-${pad(d.d)}` : null;
  }
  const s = String(v ?? '').trim();
  let m = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
  if (m && +m[2] <= 12 && +m[1] <= 31) return `${m[3]}-${pad(+m[2])}-${pad(+m[1])}`;
  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${pad(+m[2])}-${pad(+m[3])}`;
  return null;
};
/** Tháng: số serial Excel, "MM/yyyy", "yyyy-MM" → "YYYY-MM". */
const parseMonth = (v: unknown): string | null => {
  if (v instanceof Date || typeof v === 'number') return parseDate(v)?.slice(0, 7) ?? null;
  const s = String(v ?? '').trim();
  let m = s.match(/^(\d{1,2})[/.-](\d{4})$/);
  if (m && +m[1] >= 1 && +m[1] <= 12) return `${m[2]}-${pad(+m[1])}`;
  m = s.match(/^(\d{4})-(\d{1,2})$/);
  if (m && +m[2] >= 1 && +m[2] <= 12) return `${m[1]}-${pad(+m[2])}`;
  const d = parseDate(s);
  return d ? d.slice(0, 7) : null;
};
/** "Tháng 9 năm 2026" (dòng kỳ báo cáo đầu file) → "2026-09". */
const parsePeriodLine = (v: unknown): string | null => {
  const m = norm(v).match(/thang\s*(\d{1,2})\s*nam\s*(\d{4})/);
  return m && +m[1] >= 1 && +m[1] <= 12 ? `${m[2]}-${pad(+m[1])}` : null;
};

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const fmtMonth = (m: string) => `${m.slice(5, 7)}/${m.slice(0, 4)}`;

interface Issue {
  row: number;
  msg: string;
  level: 'error' | 'warn';
}
interface Parsed {
  kind: LedgerKind;
  fileName: string;
  entries: (CashInEntry | CostEntry)[];
  months: string[];
  issues: Issue[];
  /** Loại sổ nhận ra từ file (nếu khác tab đang chọn). */
  detected?: LedgerKind;
}

const KINDS: { key: LedgerKind; label: string; icon: React.ElementType; title: string; sheet: string; file: string; head: string[]; sample: (string | number)[]; cols: number[] }[] = [
  {
    key: 'revenue',
    label: 'Doanh thu thực tế',
    icon: TrendingUp,
    title: 'BÁO CÁO DOANH THU PHÁT SINH TRONG KỲ',
    sheet: 'SỔ CHI TIẾT CÁC TÀI KHOẢN',
    file: 'Mau_doanh_thu_thuc_te.xlsx',
    head: ['Ngày hạch toán', 'Diễn giải', 'Số tiền', 'Tên đối tượng', 'Mã công trình', 'Tên công trình'],
    sample: ['10/09/2026', 'Doanh thu Hợp đồng nâng cấp hệ thống tháng 8.2026', 790000000, 'CÔNG TY CỔ PHẦN ABC', '022.061.2', 'Nền tảng chuyển đổi số quốc gia'],
    cols: [14, 70, 16, 40, 14, 36],
  },
  {
    key: 'cashIn',
    label: 'Dòng tiền thu',
    icon: Landmark,
    title: 'BÁO CÁO DÒNG TIỀN THU TRONG KỲ',
    sheet: 'SỔ TIỀN GỬI NGÂN HÀNG',
    file: 'Mau_dong_tien_thu.xlsx',
    head: ['Ngày hạch toán', 'Diễn giải', 'Số tiền', 'Tên đối tượng', 'Mã công trình', 'Tên công trình', 'Mã đơn vị', 'Tên đơn vị'],
    sample: ['07/09/2026', 'Thu tiền doanh thu tháng 8.2026', 360741788, 'CÔNG TY CỔ PHẦN ABC', '022.061.2', 'Nền tảng chuyển đổi số quốc gia', 'G1', 'G1'],
    cols: [14, 60, 16, 40, 14, 36, 10, 16],
  },
  {
    key: 'cost',
    label: 'Chi thực tế',
    icon: Receipt,
    title: 'BÁO CÁO CHI TIẾT LÃI LỖ THEO CÔNG TRÌNH',
    sheet: 'BÁO CÁO CHI TIẾT LÃI LỖ',
    file: 'Mau_chi_thuc_te.xlsx',
    head: ['Mã công trình', 'Diễn giải', 'Sản xuất', 'CP bán hàng'],
    sample: ['022.061.2', 'Chi phí thuê nhân sự tháng 8.2026', 27000000, 0],
    cols: [16, 80, 18, 18],
  },
];
const kindOf = (k: LedgerKind) => KINDS.find((x) => x.key === k)!;

// ==========================================================================
// Đọc file
// ==========================================================================
/** Nhận loại sổ từ dòng tiêu đề báo cáo / cột tiêu đề. */
const detectKind = (aoa: unknown[][], fallback: LedgerKind): LedgerKind | null => {
  const headCost = aoa.findIndex((r) => r.some((c) => /^(ma du an|ma cong trinh)/.test(norm(c))) && r.some((c) => /^(chi )?san xuat/.test(norm(c))));
  const headCash = aoa.findIndex((r) => r.some((c) => norm(c) === 'ngay hach toan'));
  if (headCost >= 0) return 'cost';
  if (headCash < 0) return null;
  // Chỉ xét các dòng tiêu đề báo cáo phía trên dòng cột (dòng dữ liệu cũng hay chứa chữ "doanh thu")
  const titles = aoa.slice(0, headCash).map((r) => r.map(norm).join(' ')).join(' ');
  if (titles.includes('dong tien')) return 'cashIn';
  if (titles.includes('doanh thu')) return 'revenue';
  const hasUnit = aoa[headCash].some((c) => norm(c).startsWith('ma don vi'));
  return hasUnit ? 'cashIn' : fallback === 'revenue' || fallback === 'cashIn' ? fallback : 'revenue';
};

const parseWorkbook = (wb: XLSX.WorkBook, fileName: string, projects: BizProject[], kind: LedgerKind): Parsed => {
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const aoa = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '', blankrows: false, raw: true });
  const fail = (msg: string, detected?: LedgerKind): Parsed => ({ kind, fileName, entries: [], months: [], issues: [{ row: 0, level: 'error', msg }], detected });
  const issues: Issue[] = [];
  const unmatched = new Map<string, number>();
  let noCode = 0;
  const track = (code: string) => {
    if (!code) return void noCode++;
    if (!matchProject(projects, code)) unmatched.set(code, (unmatched.get(code) || 0) + 1);
  };

  const detected = detectKind(aoa, kind);
  if (!detected)
    return fail('Không nhận ra cấu trúc file. Cần dòng tiêu đề "Ngày hạch toán | Diễn giải | Số tiền | …" (doanh thu / dòng tiền thu) hoặc "Mã công trình | Diễn giải | Sản xuất | CP bán hàng" (chi thực tế). Hãy dùng file mẫu.');
  if (detected !== kind) return fail(`File này là sổ "${LEDGER_LABEL[detected]}", không phải "${LEDGER_LABEL[kind]}". Chuyển sang tab "${LEDGER_LABEL[detected]}" để import.`, detected);

  const entries: (CashInEntry | CostEntry)[] = [];
  const stamp = Date.now();
  const prefix = kind === 'revenue' ? 'RV' : kind === 'cashIn' ? 'CI' : 'CO';

  if (kind !== 'cost') {
    const hi = aoa.findIndex((r) => r.some((c) => norm(c) === 'ngay hach toan'));
    const head = aoa[hi].map(norm);
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
    if (c.code < 0) issues.push({ row: hi + 1, level: 'warn', msg: 'Thiếu cột "Mã công trình" — không dòng nào ghép được vào dự án.' });
    aoa.slice(hi + 1).forEach((r, i) => {
      const row = hi + 2 + i;
      if (r.every((x) => String(x).trim() === '')) return;
      const s = (k: number) => (k >= 0 ? String(r[k] ?? '').trim() : '');
      // Dòng tổng cộng cuối sổ (không có ngày) → bỏ qua
      if (/^(tong|cong)/.test(norm(r[c.date])) || (!s(c.date) && /^(tong|cong)/.test(norm(r[c.desc])))) return;
      const date = parseDate(r[c.date]);
      const amount = parseNum(r[c.amount]);
      if (!date) return void issues.push({ row, level: 'error', msg: `Ngày hạch toán "${r[c.date]}" không hợp lệ (dùng dd/mm/yyyy).` });
      if (amount === null) return void issues.push({ row, level: 'error', msg: `Số tiền "${r[c.amount]}" không phải số.` });
      const code = s(c.code);
      track(code);
      entries.push({
        id: `${prefix}-${stamp}-${i}`,
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
    const hi = aoa.findIndex((r) => r.some((c) => /^(ma du an|ma cong trinh)/.test(norm(c))) && r.some((c) => /^(chi )?san xuat/.test(norm(c))));
    const head = aoa[hi].map(norm);
    const col = (...names: string[]) => head.findIndex((h) => names.some((n) => h.startsWith(n)));
    const c = {
      code: col('ma du an', 'ma cong trinh'),
      month: col('thang'),
      sx: col('chi san xuat', 'san xuat'),
      kd: col('chi kinh doanh', 'cp ban hang', 'kinh doanh', 'ban hang'),
      note: col('ghi chu', 'dien giai'),
    };
    // Không có cột Tháng → lấy kỳ ở dòng "Tháng M năm YYYY" phía trên tiêu đề
    const period = aoa.slice(0, hi).map(parsePeriodLine).find((m): m is string => !!m) || null;
    if (c.month < 0 && !period) return fail('Không xác định được tháng: file cần dòng "Tháng M năm YYYY" ở đầu (như báo cáo kế toán) hoặc cột "Tháng (MM/yyyy)".');
    if (c.kd < 0) issues.push({ row: hi + 1, level: 'warn', msg: 'Không có cột "CP bán hàng" / "Chi kinh doanh" — coi Chi kinh doanh = 0.' });
    aoa.slice(hi + 1).forEach((r, i) => {
      const row = hi + 2 + i;
      if (r.every((x) => String(x).trim() === '')) return;
      const code = String(r[c.code] ?? '').trim();
      if (/^(tong|cong)/.test(norm(code)) || (!code && /^(tong|cong)/.test(norm(r[c.note])))) return;
      const month = c.month >= 0 ? parseMonth(r[c.month]) || period : period;
      const sx = parseNum(r[c.sx]);
      const kd = c.kd >= 0 ? parseNum(r[c.kd]) : 0;
      if (!month) return void issues.push({ row, level: 'error', msg: `Tháng "${r[c.month]}" không hợp lệ (dùng MM/yyyy).` });
      if (sx === null || kd === null) return void issues.push({ row, level: 'error', msg: `Sản xuất / CP bán hàng không phải số.` });
      if (!code) {
        if (sx || kd) issues.push({ row, level: 'warn', msg: `Dòng không có mã công trình (${fmt((sx || 0) + (kd || 0))}) — lưu vào sổ, không tính vào dự án.` });
        noCode++;
      } else track(code);
      entries.push({ id: `${prefix}-${stamp}-${i}`, projectCode: code, month, costSx: sx, costKd: kd, note: c.note >= 0 ? String(r[c.note] ?? '').trim() : '' });
    });
  }

  if (noCode && kind !== 'cost') issues.push({ row: 0, level: 'warn', msg: `${noCode} dòng không có mã công trình — lưu vào sổ nhưng không tính vào dự án nào (vd hoàn ứng, thu khác).` });
  if (unmatched.size)
    issues.push({
      row: 0,
      level: 'warn',
      msg: `${[...unmatched.values()].reduce((a, b) => a + b, 0)} dòng có mã chưa khớp dự án nào trên hệ thống: ${[...unmatched.keys()].slice(0, 12).join(', ')}${unmatched.size > 12 ? '…' : ''}`,
    });
  if (!entries.length && !issues.some((x) => x.level === 'error')) issues.push({ row: 0, level: 'error', msg: 'File không có dòng dữ liệu nào.' });

  return { kind, fileName, entries, months: [...new Set(entries.map((e) => e.month))].sort(), issues };
};

const downloadTemplate = (kind: LedgerKind) => {
  const k = kindOf(kind);
  const rows: (string | number)[][] = [[k.title], ['Tháng 9 năm 2026'], [], k.head, k.sample];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = k.cols.map((wch) => ({ wch }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, k.sheet);
  XLSX.writeFile(wb, k.file);
};

// ==========================================================================
// Modal
// ==========================================================================
export const LedgerImportModal: React.FC<{ onClose: () => void; onDone: (summary: string) => void; by: string; initialKind?: LedgerKind }> = ({ onClose, onDone, by, initialKind = 'revenue' }) => {
  const { projects, ledger, importLedger } = useBusinessProjects();
  const inputRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<LedgerKind>(initialKind);
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [dragging, setDragging] = useState(false);
  const k = kindOf(kind);

  const readFile = async (f: File, forKind: LedgerKind) => {
    setFile(f);
    if (!/\.(xlsx|xls|csv)$/i.test(f.name)) {
      setParsed({ kind: forKind, fileName: f.name, entries: [], months: [], issues: [{ row: 0, level: 'error', msg: 'Chỉ hỗ trợ file .xlsx, .xls, .csv.' }] });
      return;
    }
    try {
      const wb = XLSX.read(await f.arrayBuffer(), { type: 'array', codepage: 65001, cellDates: true });
      setParsed(parseWorkbook(wb, f.name, projects, forKind));
    } catch {
      setParsed({ kind: forKind, fileName: f.name, entries: [], months: [], issues: [{ row: 0, level: 'error', msg: 'Không đọc được file.' }] });
    }
  };
  // Đổi tab: đọc lại file đang chọn theo loại sổ mới
  useEffect(() => {
    if (file) void readFile(file, kind);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  const errors = parsed?.issues.filter((i) => i.level === 'error') || [];
  const warns = parsed?.issues.filter((i) => i.level === 'warn') || [];
  const canApply = !!parsed && parsed.entries.length > 0 && errors.length === 0;

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
  const oldLines = parsed ? (kind === 'cost' ? ledger.cost : ledger[kind]).filter((e) => parsed.months.includes(e.month)).length : 0;
  const lastImport = ledger.imports.find((i) => i.kind === kind);

  const apply = () => {
    if (!parsed || !canApply) return;
    importLedger(kind, parsed.entries as CashInEntry[] | CostEntry[], parsed.months, parsed.fileName, by);
    onDone(`Đã import ${LEDGER_LABEL[kind]}: ${parsed.entries.length} dòng, tháng ${parsed.months.map(fmtMonth).join(', ')} — cập nhật ${byProject.size} dự án`);
  };

  const reset = () => {
    setParsed(null);
    setFile(null);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="relative bg-[#eef1f5] w-full max-w-4xl rounded-[4px] border border-slate-400 shadow-2xl z-10 flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-t-[3px]">
          <div className="min-w-0">
            <h3 className="text-[14px] font-bold flex items-center gap-2">
              <FileSpreadsheet size={16} /> Import sổ kế toán
            </h3>
            <p className="text-[11px] text-slate-300">File xuất từ phần mềm kế toán, toàn công ty; hệ thống ghép từng dòng vào dự án theo Mã công trình · ĐVT: VNĐ</p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 cursor-pointer" title="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="pt-2 px-3 bg-[#eef1f5]">
          <FolderTabs tabs={KINDS.map((x) => ({ key: x.key, label: x.label, icon: x.icon }))} value={kind} onChange={setKind} />
        </div>

        <div className="p-3 space-y-3 overflow-y-auto">
          {/* Bước 1 */}
          <section className="bg-white border border-slate-300 rounded-[4px] p-3">
            <p className="text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide mb-2">1. Tải file mẫu — {k.label}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Btn icon={Download} onClick={() => downloadTemplate(kind)}>
                Mẫu {k.label.toLowerCase()}
              </Btn>
              {lastImport && (
                <span className="text-[11.5px] text-slate-500">
                  Lần import gần nhất: <b className="text-slate-700">{lastImport.fileName}</b> · {lastImport.lines} dòng · tháng {lastImport.months.map(fmtMonth).join(', ')}
                </span>
              )}
            </div>
            <p className="mt-2 text-[11.5px] text-slate-500">
              <b>{k.title}</b> · cột: {k.head.join(' · ')}.{' '}
              {kind === 'cost' ? 'Tháng lấy ở dòng "Tháng M năm YYYY" đầu file; Sản xuất → Chi SX, CP bán hàng → Chi KD.' : 'Tháng lấy theo Ngày hạch toán.'} Mã công trình khớp Mã tổng / Mã PAKD (.1) / Mã SX (.2) của dự án.
            </p>
          </section>

          {/* Bước 2 */}
          <section className="bg-white border border-slate-300 rounded-[4px] p-3">
            <p className="text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide mb-2">{parsed ? '2. Kiểm tra & import' : '2. Chọn file của kế toán'}</p>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void readFile(f, kind);
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
                  if (f) void readFile(f, kind);
                }}
                className={`flex flex-col items-center justify-center gap-1.5 py-8 rounded-[4px] border-2 border-dashed cursor-pointer ${
                  dragging ? 'border-[#1f5fa8] bg-[#eaf2fc]' : 'border-slate-300 hover:border-[#1f5fa8] hover:bg-slate-50'
                }`}
              >
                <UploadCloud size={26} className="text-[#1f5fa8]" />
                <span className="text-[13px] font-semibold text-slate-700">Kéo thả file {k.label.toLowerCase()} vào đây hoặc bấm để chọn</span>
                <span className="text-[11.5px] text-slate-400">.xlsx · .xls · .csv</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
                  <FileSpreadsheet size={15} className="text-emerald-600" />
                  <b className="text-slate-800">{parsed.fileName}</b>
                  {parsed.entries.length > 0 && (
                    <span className="text-slate-500">
                      · {parsed.entries.length} dòng · tháng {parsed.months.map(fmtMonth).join(', ')} · <b className="text-[#1f5fa8]">{byProject.size} dự án khớp mã</b>
                    </span>
                  )}
                  {errors.length > 0 && <Tag cls="bg-rose-50 text-rose-700 border-rose-300">{errors.length} lỗi</Tag>}
                  {warns.length > 0 && <Tag cls="bg-amber-50 text-amber-700 border-amber-300">{warns.length} cảnh báo</Tag>}
                  {parsed.detected && (
                    <Btn className="h-7" onClick={() => setKind(parsed.detected!)}>
                      Chuyển sang tab {LEDGER_LABEL[parsed.detected]}
                    </Btn>
                  )}
                </div>

                {parsed.issues.length > 0 && (
                  <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-[3px] divide-y divide-slate-100">
                    {[...errors, ...warns].slice(0, 80).map((it, i) => (
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

                {parsed.entries.length > 0 && (
                  <div className="max-h-64 overflow-auto border border-slate-300 rounded-[3px]">
                    <table className={erp.table}>
                      <thead className="sticky top-0 z-10">
                        <tr>
                          <th className={`${erp.th} text-left border-t-0 border-l-0`}>Dự án</th>
                          <th className={`${erp.th} text-right border-t-0`}>Số dòng</th>
                          {kind === 'cost' ? (
                            <>
                              <th className={`${erp.th} text-right border-t-0`}>Chi sản xuất</th>
                              <th className={`${erp.th} text-right border-t-0 border-r-0`}>Chi kinh doanh</th>
                            </>
                          ) : (
                            <th className={`${erp.th} text-right border-t-0 border-r-0`}>{kind === 'revenue' ? 'Doanh thu' : 'Số tiền thu'}</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {[...byProject.values()].map(({ p, lines, a, b }) => (
                          <tr key={p.id} className={erp.tr}>
                            <td className={`${erp.td} border-l-0`}>
                              <span className={`${erp.code} font-semibold`}>{p.masterCode}</span> <span className="text-slate-700">{p.name}</span>
                            </td>
                            <td className={`${erp.td} ${erp.num}`}>{lines}</td>
                            <td className={`${erp.td} ${erp.num} ${kind === 'cost' ? '' : 'border-r-0'}`}>{fmt(a)}</td>
                            {kind === 'cost' && <td className={`${erp.td} ${erp.num} border-r-0`}>{fmt(b)}</td>}
                          </tr>
                        ))}
                        {unassigned.lines > 0 && (
                          <tr className="text-slate-500 italic">
                            <td className={`${erp.td} border-l-0`}>Không gắn / chưa khớp dự án</td>
                            <td className={`${erp.td} ${erp.num}`}>{unassigned.lines}</td>
                            <td className={`${erp.td} ${erp.num} ${kind === 'cost' ? '' : 'border-r-0'}`}>{fmt(unassigned.a)}</td>
                            {kind === 'cost' && <td className={`${erp.td} ${erp.num} border-r-0`}>{fmt(unassigned.b)}</td>}
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr className={erp.totalRow}>
                          <td className={`${erp.td} border-l-0`}>TỔNG</td>
                          <td className={`${erp.td} ${erp.num}`}>{parsed.entries.length}</td>
                          <td className={`${erp.td} ${erp.num} ${kind === 'cost' ? '' : 'border-r-0'}`}>{fmt([...byProject.values()].reduce((s, x) => s + x.a, unassigned.a))}</td>
                          {kind === 'cost' && <td className={`${erp.td} ${erp.num} border-r-0`}>{fmt([...byProject.values()].reduce((s, x) => s + x.b, unassigned.b))}</td>}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {oldLines > 0 && (
                  <p className="text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-[3px] px-3 py-2">
                    Sổ {LEDGER_LABEL[kind]} đang có {oldLines} dòng ở tháng {parsed.months.map(fmtMonth).join(', ')} — sẽ được thay bằng dữ liệu trong file này.
                  </p>
                )}
              </div>
            )}
          </section>
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-slate-300 bg-slate-50 rounded-b-[3px]">
          {parsed ? (
            <Btn icon={RotateCcw} onClick={reset}>
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
              Import {k.label.toLowerCase()}
            </Btn>
          </span>
        </div>
      </div>
    </div>
  );
};
