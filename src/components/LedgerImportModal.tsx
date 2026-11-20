/**
 * LedgerImportModal — Kế toán import sổ chi tiết toàn công ty, 5 tab tương ứng 5 sổ (file xuất từ phần mềm kế toán):
 *
 *  • Doanh thu thực tế — "BÁO CÁO DOANH THU PHÁT SINH TRONG KỲ" (sổ chi tiết các tài khoản)
 *      Ngày hạch toán | Diễn giải | Số tiền | Tên đối tượng | Mã công trình | Tên công trình
 *  • Dòng tiền thu — "BÁO CÁO DÒNG TIỀN THU TRONG KỲ" (sổ tiền gửi ngân hàng)
 *      Ngày hạch toán | Diễn giải | Số tiền | Tên đối tượng | Mã công trình | Tên công trình | Mã đơn vị | Tên đơn vị
 *  • Chi thực tế — "BÁO CÁO CHI TIẾT LÃI LỖ THEO CÔNG TRÌNH" (tháng lấy ở dòng "Tháng M năm YYYY" đầu file)
 *      Mã công trình | Diễn giải | Sản xuất | CP bán hàng | Chi phí chung
 *      Chi thực tế của dự án = Sản xuất + CP bán hàng + Chi phí chung (file cũ không có cột Chi phí chung → coi = 0)
 *      (vẫn nhận mẫu cũ: Mã dự án | Tháng (MM/yyyy) | Chi sản xuất | Chi kinh doanh | Ghi chú)
 *  • Chi phí vận hành chung (VHC) — mẫu "IP chi phí VHC", 1 file = 1 khối × 1 tháng:
 *      "CHI PHÍ VẬN HÀNH CHUNG" · "Khối: G1" · "Tháng 9 năm 2026": Diễn giải | Số tiền | Tên đối tượng | Tên nhân viên … dòng "Cộng" (= tổng đem phân bổ)
 *      Hệ thống tự phân bổ cho các dự án của khối: Tỉ lệ = Chi phí dự án trong tháng ÷ Tổng chi phí các dự án của khối trong tháng
 *      (sổ Chi thực tế); Phân bổ = Tỉ lệ × Tổng. Dự án không phát sinh chi phí → 0 đ. Sheet phân bổ tính tay (nếu có) bị bỏ qua.
 *      Import thay dữ liệu cũ cùng khối + tháng; import lại Chi thực tế → tự phân bổ lại.
 *      (vẫn nhận mẫu cũ "BẢNG PHÂN BỔ CHI PHÍ VẬN HÀNH THEO CÔNG TRÌNH": Mã công trình | Diễn giải | Số tiền)
 *  • Chi phí quản lý — "BẢNG PHÂN BỔ CHI PHÍ QUẢN LÝ THEO CÔNG TRÌNH" — cùng cấu trúc
 *      Mã công trình | Diễn giải | Số tiền
 *
 * Mỗi dòng ghép vào dự án theo mã (Mã công trình khớp Mã tổng, Mã PAKD hoặc Mã SX). Dữ liệu các tháng có trong file
 * thay thế dữ liệu cũ cùng loại sổ; Doanh thu / Thu / Chi thực tế của dự án được tính lại = tổng các dòng.
 * Dòng không có mã / không khớp dự án vẫn lưu nhưng không tính vào dự án. ĐVT: VNĐ.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { AlertTriangle, Briefcase, CheckCircle2, Download, Eraser, FileSpreadsheet, Landmark, ListOrdered, PieChart, Receipt, RotateCcw, Search, Trash2, TrendingUp, UploadCloud, X } from 'lucide-react';
import { ColumnFilterBar, useColumnFilters } from './erp/ColumnFilter';
import { AllocEntry, BizProject, CashInEntry, CostEntry, LEDGER_LABEL, LedgerEntry, LedgerKind, VhcSheet, allocateVhc, monthCostOf, entryAmounts, entryTotal, isCostLike, matchProject, ownsCode, useBusinessProjects } from '../business/BusinessProjectContext';
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
  entries: LedgerEntry[];
  months: string[];
  issues: Issue[];
  /** Loại sổ nhận ra từ file (nếu khác tab đang chọn). */
  detected?: LedgerKind;
  /** File chi phí vận hành chung (mẫu VHC 2 sheet) */
  vhc?: Omit<VhcSheet, 'id' | 'ver' | 'at' | 'by'>;
}

/** Cấu hình sổ. amounts: tên các cột tiền (sổ Chi thực tế); single: tên cột tiền duy nhất (các sổ còn lại). */
const KINDS: { key: LedgerKind; label: string; icon: React.ElementType; title: string; sheet: string; file: string; head: string[]; sample: (string | number)[]; cols: number[]; amounts?: string[]; single: string }[] = [
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
    single: 'Doanh thu',
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
    single: 'Số tiền thu',
  },
  {
    key: 'cost',
    label: 'Chi thực tế',
    icon: Receipt,
    title: 'BÁO CÁO CHI TIẾT LÃI LỖ THEO CÔNG TRÌNH',
    sheet: 'BÁO CÁO CHI TIẾT LÃI LỖ',
    file: 'Mau_chi_thuc_te.xlsx',
    head: ['Mã công trình', 'Diễn giải', 'Sản xuất', 'CP bán hàng', 'Chi phí chung'],
    sample: ['022.061.2', 'Chi phí thuê nhân sự tháng 8.2026', 27000000, 0, 1500000],
    cols: [16, 80, 18, 18, 18],
    amounts: ['Chi sản xuất', 'Chi kinh doanh', 'Chi phí chung'],
    single: 'Chi phí',
  },
  {
    key: 'opex',
    label: 'Chi phí vận hành chung',
    icon: PieChart,
    title: 'CHI PHÍ VẬN HÀNH CHUNG',
    sheet: 'Mẫu IP chi phí VHC',
    file: 'Mau_IP_chi_phi_VHC.xlsx',
    head: ['Diễn giải', 'Số tiền', 'Tên đối tượng', 'Tên nhân viên'],
    sample: [],
    cols: [68, 22, 50, 25],
    single: 'Chi phí VHC phân bổ',
  },
  {
    key: 'mgmt',
    label: 'Chi phí quản lý',
    icon: Briefcase,
    title: 'BẢNG PHÂN BỔ CHI PHÍ QUẢN LÝ THEO CÔNG TRÌNH',
    sheet: 'CHI PHÍ QUẢN LÝ',
    file: 'Mau_chi_phi_quan_ly.xlsx',
    head: ['Mã công trình', 'Diễn giải', 'Số tiền'],
    sample: ['022.061.2', 'Phân bổ chi phí quản lý tháng 9.2026', 4100000],
    cols: [16, 70, 18],
    single: 'Chi phí quản lý',
  },
];
const kindOf = (k: LedgerKind) => KINDS.find((x) => x.key === k)!;

// ==========================================================================
// Đọc file
// ==========================================================================
/** Nhận loại sổ từ dòng tiêu đề báo cáo / cột tiêu đề. */
const hasCode = (r: unknown[]) => r.some((c) => /^(ma du an|ma cong trinh)/.test(norm(c)));
const isCostHead = (r: unknown[]) => hasCode(r) && r.some((c) => /^(chi )?san xuat/.test(norm(c)));
/** Sổ phân bổ (vận hành / quản lý): có Mã công trình + Số tiền, không có Ngày hạch toán. */
const isAllocHead = (r: unknown[]) => hasCode(r) && r.some((c) => /^so tien/.test(norm(c))) && !r.some((c) => norm(c) === 'ngay hach toan');
const detectKind = (aoa: unknown[][], fallback: LedgerKind): LedgerKind | null => {
  const headAlloc = aoa.findIndex(isAllocHead);
  const headCost = aoa.findIndex(isCostHead);
  const headCash = aoa.findIndex((r) => r.some((c) => norm(c) === 'ngay hach toan'));
  if (headCost >= 0) return 'cost';
  if (headAlloc >= 0) {
    // Phân biệt vận hành / quản lý theo dòng tiêu đề báo cáo; không có thì theo tab đang chọn
    const titles = aoa.slice(0, headAlloc).map((r) => r.map(norm).join(' ')).join(' ');
    if (titles.includes('quan ly')) return 'mgmt';
    if (titles.includes('van hanh')) return 'opex';
    return fallback === 'opex' || fallback === 'mgmt' ? fallback : 'opex';
  }
  if (headCash < 0) return null;
  // Chỉ xét các dòng tiêu đề báo cáo phía trên dòng cột (dòng dữ liệu cũng hay chứa chữ "doanh thu")
  const titles = aoa.slice(0, headCash).map((r) => r.map(norm).join(' ')).join(' ');
  if (titles.includes('dong tien')) return 'cashIn';
  if (titles.includes('doanh thu')) return 'revenue';
  const hasUnit = aoa[headCash].some((c) => norm(c).startsWith('ma don vi'));
  return hasUnit ? 'cashIn' : fallback === 'revenue' || fallback === 'cashIn' ? fallback : 'revenue';
};

// --------------------------------------------------------------------------
// Chi phí vận hành chung — mẫu "IP chi phí VHC" (2 sheet)
// --------------------------------------------------------------------------
const isVhcLineHead = (r: unknown[]) => {
  const h = r.map(norm);
  return h.some((c) => c.startsWith('dien giai')) && h.some((c) => c.startsWith('so tien')) && h.some((c) => c.startsWith('ten doi tuong')) && !hasCode(r);
};
const isVhcAllocHead = (r: unknown[]) => hasCode(r) && r.some((c) => norm(c).includes('nhan cong'));
const sheetsOf = (wb: XLSX.WorkBook) =>
  wb.SheetNames.map((name) => ({ name, aoa: XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[name], { header: 1, defval: '', blankrows: false, raw: true }) }));
const isVhcBook = (wb: XLSX.WorkBook) => sheetsOf(wb).some(({ aoa }) => aoa.some(isVhcLineHead) || aoa.some(isVhcAllocHead));

const parseVhc = (wb: XLSX.WorkBook, fileName: string, projects: BizProject[], cost: CostEntry[]): Parsed => {
  const sheets = sheetsOf(wb);
  const issues: Issue[] = [];
  const fail = (msg: string): Parsed => ({ kind: 'opex', fileName, entries: [], months: [], issues: [{ row: 0, level: 'error', msg }] });
  const ls = sheets.find(({ aoa }) => aoa.some(isVhcLineHead));
  if (!ls) return fail('Thiếu sheet "CHI PHÍ VẬN HÀNH CHUNG" (dòng tiêu đề: Diễn giải | Số tiền | Tên đối tượng | Tên nhân viên). Hãy dùng file mẫu.');
  const as = sheets.find(({ aoa }) => aoa.some(isVhcAllocHead));
  if (as) issues.push({ row: 0, level: 'warn', msg: `Sheet "${as.name}" (bảng phân bổ tính tay) không dùng — hệ thống tự phân bổ theo tỉ lệ chi phí của dự án trong tháng.` });

  // Khối + tháng: dòng tiêu đề đầu sheet chi tiết
  const hi = ls.aoa.findIndex(isVhcLineHead);
  const titleRows = ls.aoa.slice(0, hi);
  const month = titleRows.map((r) => r.map(parsePeriodLine).find(Boolean) || null).find((m): m is string => !!m) || null;
  const division =
    titleRows
      .flatMap((r) => r.map((c) => String(c ?? '').trim()))
      .map((c) => (/^khoi\b/.test(norm(c)) ? c.replace(/^\S+\s*[:：-]?\s*/, '').trim() : ''))
      .find(Boolean) || '';

  // Các khoản chi + dòng Cộng
  const head = ls.aoa[hi].map(norm);
  const col = (n: string) => head.findIndex((h) => h.startsWith(n));
  const c = { desc: col('dien giai'), amount: col('so tien'), partner: col('ten doi tuong'), employee: col('ten nhan vien') };
  const lines: VhcSheet['lines'] = [];
  let total: number | null = null;
  let skipped = 0;
  ls.aoa.slice(hi + 1).forEach((r, i) => {
    const row = hi + 2 + i;
    const str = (k: number) => (k >= 0 ? String(r[k] ?? '').trim() : '');
    const amount = parseNum(r[c.amount]);
    if (/^(cong|tong)/.test(norm(str(c.desc)))) return void (total = amount ?? 0);
    if (amount === null) return void issues.push({ row, level: 'error', msg: `Số tiền "${r[c.amount]}" không phải số.` });
    if (!str(c.desc) && !amount) {
      if (str(c.partner) || str(c.employee)) skipped++;
      return;
    }
    lines.push({ description: str(c.desc), amount, partner: str(c.partner), employee: str(c.employee) });
  });
  const sumLines = lines.reduce((a, l) => a + l.amount, 0);
  if (skipped) issues.push({ row: 0, level: 'warn', msg: `${skipped} dòng có Tên đối tượng nhưng không có Diễn giải / Số tiền — bỏ qua.` });
  if (total !== null && lines.length && Math.abs(sumLines - total) > 1) issues.push({ row: 0, level: 'warn', msg: `Tổng các khoản chi (${fmt(sumLines)}) khác dòng "Cộng" (${fmt(total)}) — phân bổ theo dòng Cộng.` });
  if (!lines.length) issues.push({ row: 0, level: 'warn', msg: 'Chưa có khoản chi nào có Diễn giải / Số tiền — báo cáo chỉ hiện bảng phân bổ, không có chi tiết.' });
  const pool = total ?? sumLines;

  if (!month) issues.push({ row: 0, level: 'error', msg: 'Không xác định được tháng: cần dòng "Tháng M năm YYYY" ở đầu sheet.' });
  if (!division) issues.push({ row: 0, level: 'error', msg: 'Không xác định được khối: cần dòng "Khối: …" ở đầu sheet.' });
  else if (!projects.some((p) => norm(p.division) === norm(division))) issues.push({ row: 0, level: 'error', msg: `Khối "${division}" không có dự án nào trên hệ thống.` });
  if (pool <= 0) issues.push({ row: 0, level: 'error', msg: 'Tổng chi phí vận hành chung bằng 0 (dòng "Cộng" / tổng Số tiền).' });
  const div = projects.find((p) => norm(p.division) === norm(division))?.division || division;

  // Phân bổ theo tỉ lệ chi phí dự án trong tháng (sổ Chi thực tế hiện có)
  const alloc = month && div ? allocateVhc(pool, div, projects, monthCostOf(projects, cost, month)) : [];
  const zero = month ? projects.filter((p) => p.division === div && !alloc.some((a) => a.projectCode === (p.productionCode || p.masterCode))).length : 0;
  if (month && div && pool > 0 && !alloc.length)
    issues.push({ row: 0, level: 'warn', msg: `Khối ${div} tháng ${fmtMonth(month)} chưa có chi phí dự án (sổ Chi thực tế) — chưa phân bổ được; khi import Chi thực tế của tháng này, hệ thống tự phân bổ lại.` });
  else if (zero) issues.push({ row: 0, level: 'warn', msg: `${zero} dự án của khối ${div} không phát sinh chi phí trong tháng → chi phí vận hành chung phân bổ = 0 đ.` });

  const m = month || '';
  const mm = m ? `${+m.slice(5, 7)}/${m.slice(0, 4)}` : '';
  const entries: AllocEntry[] = alloc.map((a, i) => ({
    id: `OP-${Date.now()}-${i}`,
    ver: 0,
    projectCode: a.projectCode,
    month: m,
    value: a.value,
    note: `Phân bổ chi phí vận hành chung khối ${div} tháng ${mm} (${(a.ratio * 100).toFixed(2)}% chi phí khối)`,
    division: div,
  }));
  return {
    kind: 'opex',
    fileName,
    entries,
    months: month ? [month] : [],
    issues,
    vhc: month && div ? { division: div, month, fileName, lines, total: total ?? sumLines, pool, alloc } : undefined,
  };
};

const parseWorkbook = (wb: XLSX.WorkBook, fileName: string, projects: BizProject[], kind: LedgerKind, cost: CostEntry[] = []): Parsed => {
  if (isVhcBook(wb)) {
    if (kind !== 'opex')
      return { kind, fileName, entries: [], months: [], issues: [{ row: 0, level: 'error', msg: `File này là "${LEDGER_LABEL.opex}", không phải "${LEDGER_LABEL[kind]}". Chuyển sang tab "${LEDGER_LABEL.opex}" để import.` }], detected: 'opex' };
    return parseVhc(wb, fileName, projects, cost);
  }
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
    return fail('Không nhận ra cấu trúc file. Cần dòng tiêu đề "Ngày hạch toán | Diễn giải | Số tiền | …" (doanh thu / dòng tiền thu), "Mã công trình | Diễn giải | Sản xuất | CP bán hàng" (chi thực tế) hoặc "Mã công trình | Diễn giải | Số tiền" (chi phí vận hành / quản lý). Hãy dùng file mẫu.');
  if (detected !== kind) return fail(`File này là sổ "${LEDGER_LABEL[detected]}", không phải "${LEDGER_LABEL[kind]}". Chuyển sang tab "${LEDGER_LABEL[detected]}" để import.`, detected);

  const entries: LedgerEntry[] = [];
  const stamp = Date.now();
  const prefix = kind === 'revenue' ? 'RV' : kind === 'cashIn' ? 'CI' : kind === 'opex' ? 'OP' : kind === 'mgmt' ? 'MG' : 'CO';

  if (!isCostLike(kind)) {
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
        ver: 0,
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
    const alloc = kind !== 'cost'; // vận hành / quản lý: 1 cột Số tiền
    const hi = aoa.findIndex(alloc ? isAllocHead : isCostHead);
    const head = aoa[hi].map(norm);
    const col = (...names: string[]) => head.findIndex((h) => names.some((n) => h.includes(n)));
    const c = {
      code: col('ma du an', 'ma cong trinh'),
      month: head.findIndex((h) => h.startsWith('thang')),
      sx: alloc ? col('so tien') : col('chi san xuat', 'san xuat'),
      kd: alloc ? -1 : col('chi kinh doanh', 'cp ban hang', 'kinh doanh', 'ban hang'),
      chung: alloc ? -1 : col('chi phi chung', 'cp chung', 'chung'),
      note: col('ghi chu', 'dien giai'),
    };
    const [aName, bName, cName] = kindOf(kind).amounts || ['Số tiền', '', ''];
    // Không có cột Tháng → lấy kỳ ở dòng "Tháng M năm YYYY" phía trên tiêu đề
    const period = aoa.slice(0, hi).map(parsePeriodLine).find((m): m is string => !!m) || null;
    if (c.month < 0 && !period) return fail('Không xác định được tháng: file cần dòng "Tháng M năm YYYY" ở đầu (như báo cáo kế toán) hoặc cột "Tháng (MM/yyyy)".');
    if (c.sx < 0) return fail(`Thiếu cột "${aName}".`);
    if (!alloc && c.kd < 0) issues.push({ row: hi + 1, level: 'warn', msg: `Không có cột "${bName}" — coi ${bName} = 0.` });
    if (!alloc && c.chung < 0) issues.push({ row: hi + 1, level: 'warn', msg: `Không có cột "${cName}" — coi ${cName} = 0.` });
    aoa.slice(hi + 1).forEach((r, i) => {
      const row = hi + 2 + i;
      if (r.every((x) => String(x).trim() === '')) return;
      const code = String(r[c.code] ?? '').trim();
      if (/^(tong|cong)/.test(norm(code)) || (!code && /^(tong|cong)/.test(norm(r[c.note])))) return;
      const month = c.month >= 0 ? parseMonth(r[c.month]) || period : period;
      const sx = parseNum(r[c.sx]);
      const kd = c.kd >= 0 ? parseNum(r[c.kd]) : 0;
      const chung = c.chung >= 0 ? parseNum(r[c.chung]) : 0;
      if (!month) return void issues.push({ row, level: 'error', msg: `Tháng "${r[c.month]}" không hợp lệ (dùng MM/yyyy).` });
      if (sx === null || kd === null || chung === null) return void issues.push({ row, level: 'error', msg: `${alloc ? aName : `${aName} / ${bName} / ${cName}`} không phải số.` });
      if (!code) {
        if (sx || kd || chung) issues.push({ row, level: 'warn', msg: `Dòng không có mã công trình (${fmt(sx + kd + chung)}) — lưu vào sổ, không tính vào dự án.` });
        noCode++;
      } else track(code);
      const note = c.note >= 0 ? String(r[c.note] ?? '').trim() : '';
      if (alloc) entries.push({ id: `${prefix}-${stamp}-${i}`, ver: 0, projectCode: code, month, value: sx, note });
      else entries.push({ id: `${prefix}-${stamp}-${i}`, ver: 0, projectCode: code, month, costSx: sx, costKd: kd, costChung: chung, note });
    });
  }

  if (noCode && !isCostLike(kind)) issues.push({ row: 0, level: 'warn', msg: `${noCode} dòng không có mã công trình — lưu vào sổ nhưng không tính vào dự án nào (vd hoàn ứng, thu khác).` });
  if (unmatched.size)
    issues.push({
      row: 0,
      level: 'warn',
      msg: `${[...unmatched.values()].reduce((a, b) => a + b, 0)} dòng có mã chưa khớp dự án nào trên hệ thống: ${[...unmatched.keys()].slice(0, 12).join(', ')}${unmatched.size > 12 ? '…' : ''}`,
    });
  if (!entries.length && !issues.some((x) => x.level === 'error')) issues.push({ row: 0, level: 'error', msg: 'File không có dòng dữ liệu nào.' });

  return { kind, fileName, entries, months: [...new Set(entries.map((e) => e.month))].sort(), issues };
};

/** Mẫu IP chi phí VHC (dữ liệu giả lập): 1 khối × 1 tháng — các khoản chi + dòng Cộng (hệ thống tự phân bổ cho dự án). */
const downloadVhcTemplate = () => {
  const lines: [string, number, string, string][] = [
    ['Thuê văn phòng tầng 15 tháng 9.2026', 60000000, 'CÔNG TY TNHH TOÀ NHÀ MẪU', ''],
    ['Tiền điện, nước văn phòng tháng 9.2026', 12000000, 'CÔNG TY ĐIỆN LỰC MẪU', ''],
    ['Cước internet, đường truyền tháng 9.2026', 8000000, 'CÔNG TY VIỄN THÔNG MẪU', ''],
    ['Văn phòng phẩm, nước uống', 5000000, 'CÔNG TY TNHH VĂN PHÒNG PHẨM MẪU', 'Trần Thị Mẫu'],
    ['Lương bộ phận hỗ trợ chung của khối', 15000000, '', 'Nguyễn Văn Mẫu'],
  ];
  const total = lines.reduce((a, l) => a + l[1], 0);
  const s1 = XLSX.utils.aoa_to_sheet([['CHI PHÍ VẬN HÀNH CHUNG'], ['Khối: G1'], ['Tháng 9 năm 2026'], ['Diễn giải', 'Số tiền', 'Tên đối tượng', 'Tên nhân viên'], ...lines, ['Cộng', total, '', '']]);
  s1['!cols'] = [68, 22, 50, 25].map((wch) => ({ wch }));
  s1['!merges'] = [0, 1, 2].map((r) => ({ s: { r, c: 0 }, e: { r, c: 3 } }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, s1, 'Mẫu IP chi phí VHC');
  XLSX.writeFile(wb, 'Mau_IP_chi_phi_VHC.xlsx');
};

const downloadTemplate = (kind: LedgerKind, projects: BizProject[]) => {
  if (kind === 'opex') return downloadVhcTemplate();
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
  const { projects, ledger, importLedger, importVhc, nextLedgerVer } = useBusinessProjects();
  const inputRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<LedgerKind>(initialKind);
  const [view, setView] = useState<'import' | 'list'>('import');
  const nLines = ledger[kind].length;
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
      setParsed(parseWorkbook(wb, f.name, projects, forKind, ledger.cost));
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
  const canApply = !!parsed && (parsed.entries.length > 0 || !!parsed.vhc) && errors.length === 0;

  // Tổng hợp theo dự án khớp mã
  const byProject = new Map<string, { p: BizProject; lines: number; a: number; b: number; c: number }>();
  let unassigned = { lines: 0, a: 0, b: 0, c: 0 };
  parsed?.entries.forEach((e) => {
    const p = matchProject(projects, e.projectCode);
    const [a, b, c] = entryAmounts(e);
    if (!p) return void (unassigned = { lines: unassigned.lines + 1, a: unassigned.a + a, b: unassigned.b + b, c: unassigned.c + c });
    const cur = byProject.get(p.id) || { p, lines: 0, a: 0, b: 0, c: 0 };
    byProject.set(p.id, { p, lines: cur.lines + 1, a: cur.a + a, b: cur.b + b, c: cur.c + c });
  });
  const oldLines = parsed
    ? parsed.vhc
      ? ledger.opex.filter((e) => e.month === parsed.vhc!.month && (e.division ? e.division === parsed.vhc!.division : parsed.vhc!.alloc.some((a) => a.projectCode.trim().toLowerCase() === e.projectCode.trim().toLowerCase()))).length
      : (ledger[kind] as LedgerEntry[]).filter((e) => parsed.months.includes(e.month)).length
    : 0;
  const lastImport = ledger.imports.find((i) => i.kind === kind);

  const apply = () => {
    if (!parsed || !canApply) return;
    if (parsed.vhc) {
      const v = parsed.vhc;
      importVhc(v, by);
      onDone(`Đã import chi phí vận hành chung khối ${v.division} tháng ${fmtMonth(v.month)}: ${fmt(v.pool)} · phân bổ cho ${v.alloc.length} dự án theo tỉ lệ chi phí trong tháng`);
      return;
    }
    importLedger(kind, parsed.entries, parsed.months, parsed.fileName, by);
    onDone(`Đã import ${LEDGER_LABEL[kind]}: ${parsed.entries.length} dòng, tháng ${parsed.months.map(fmtMonth).join(', ')} — cập nhật ${byProject.size} dự án`);
  };

  const reset = () => {
    setParsed(null);
    setFile(null);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />
      <div className="relative bg-[#eef1f5] w-full max-w-6xl rounded-[4px] border border-slate-400 shadow-2xl z-10 flex flex-col max-h-[92vh]">
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

        <div className="pt-2 px-3 bg-[#eef1f5] flex items-end gap-2">
          <div className="flex-1 min-w-0">
            <FolderTabs tabs={KINDS.map((x) => ({ key: x.key, label: x.label, icon: x.icon }))} value={kind} onChange={setKind} />
          </div>
          <div className="pb-1.5 shrink-0">
            {view === 'import' ? (
              <Btn icon={ListOrdered} className="h-7" onClick={() => setView('list')}>
                Dữ liệu đã import ({nLines} dòng)
              </Btn>
            ) : (
              <Btn variant="primary" icon={UploadCloud} className="h-7" onClick={() => setView('import')}>
                Import file mới (v{nextLedgerVer()})
              </Btn>
            )}
          </div>
        </div>

        {view === 'list' ? (
          <LedgerList key={kind} kind={kind} projects={projects} by={by} />
        ) : (
        <div className="p-3 space-y-3 overflow-y-auto">
          {/* Bước 1 */}
          <section className="bg-white border border-slate-300 rounded-[4px] p-3">
            <p className="text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide mb-2">1. Tải file mẫu — {k.label}</p>
            <div className="flex flex-wrap items-center gap-2">
              <Btn icon={Download} onClick={() => downloadTemplate(kind, projects)}>
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
              {kind === 'cost'
                ? 'Tháng lấy ở dòng "Tháng M năm YYYY" đầu file; Sản xuất → Chi SX, CP bán hàng → Chi KD, Chi phí chung → Chi phí chung; Chi thực tế = tổng 3 cột.'
                : kind === 'opex'
                  ? 'Mỗi file = 1 khối × 1 tháng ("Khối: …", "Tháng M năm YYYY" ở đầu sheet), tổng ở dòng "Cộng". Hệ thống tự phân bổ cho các dự án của khối: Tỉ lệ = Chi phí mã sản xuất (.2, gồm mã con .2.x) của dự án trong tháng ÷ Tổng chi phí mã sản xuất của các dự án trong khối (sổ Chi thực tế; không tính mã kinh doanh .1); Phân bổ = Tỉ lệ × Tổng chi phí vận hành chung. Dự án không phát sinh chi phí trong tháng → 0 đ. Import lại Chi thực tế của tháng → tự phân bổ lại. Import lại cùng khối + tháng sẽ thay dữ liệu cũ.'
                : kind === 'mgmt'
                  ? `Kế toán phân bổ ${k.label.toLowerCase()} về từng dự án bên ngoài rồi import; tháng lấy ở dòng "Tháng M năm YYYY" đầu file. Chi phí thực tế của dự án = Chi thực tế (SX + KD) + Chi phí vận hành + Chi phí quản lý.`
                  : 'Tháng lấy theo Ngày hạch toán.'}{' '}
              Mã công trình khớp Mã tổng / Mã PAKD (.1) / Mã SX (.2) của dự án; mã con của Mã SX (.2.x, vd 022.061.2.2) cũng được ghép vào dự án và tính là chi phí sản xuất.
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

                {parsed.vhc && <VhcPreview v={parsed.vhc} />}

                {parsed.entries.length > 0 && !parsed.vhc && (
                  <div className="max-h-64 overflow-auto border border-slate-300 rounded-[3px]">
                    <table className={erp.table}>
                      <thead className="sticky top-0 z-10">
                        <tr>
                          <th className={`${erp.th} text-left border-t-0 border-l-0`}>Dự án</th>
                          <th className={`${erp.th} text-right border-t-0`}>Số dòng</th>
                          {k.amounts ? (
                            <>
                              {k.amounts.map((h) => (
                                <th key={h} className={`${erp.th} text-right border-t-0`}>{h}</th>
                              ))}
                              <th className={`${erp.th} text-right border-t-0 border-r-0`}>Tổng chi</th>
                            </>
                          ) : (
                            <th className={`${erp.th} text-right border-t-0 border-r-0`}>{k.single}</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {[...byProject.values()].map(({ p, lines, a, b, c }) => (
                          <tr key={p.id} className={erp.tr}>
                            <td className={`${erp.td} border-l-0`}>
                              <span className={`${erp.code} font-semibold`}>{p.masterCode}</span> <span className="text-slate-700">{p.name}</span>
                            </td>
                            <td className={`${erp.td} ${erp.num}`}>{lines}</td>
                            <td className={`${erp.td} ${erp.num} ${k.amounts ? '' : 'border-r-0'}`}>{fmt(a)}</td>
                            {k.amounts && (
                              <>
                                <td className={`${erp.td} ${erp.num}`}>{fmt(b)}</td>
                                <td className={`${erp.td} ${erp.num}`}>{fmt(c)}</td>
                                <td className={`${erp.td} ${erp.num} border-r-0 font-semibold`}>{fmt(a + b + c)}</td>
                              </>
                            )}
                          </tr>
                        ))}
                        {unassigned.lines > 0 && (
                          <tr className="text-slate-500 italic">
                            <td className={`${erp.td} border-l-0`}>Không gắn / chưa khớp dự án</td>
                            <td className={`${erp.td} ${erp.num}`}>{unassigned.lines}</td>
                            <td className={`${erp.td} ${erp.num} ${k.amounts ? '' : 'border-r-0'}`}>{fmt(unassigned.a)}</td>
                            {k.amounts && (
                              <>
                                <td className={`${erp.td} ${erp.num}`}>{fmt(unassigned.b)}</td>
                                <td className={`${erp.td} ${erp.num}`}>{fmt(unassigned.c)}</td>
                                <td className={`${erp.td} ${erp.num} border-r-0`}>{fmt(unassigned.a + unassigned.b + unassigned.c)}</td>
                              </>
                            )}
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr className={erp.totalRow}>
                          <td className={`${erp.td} border-l-0`}>TỔNG</td>
                          <td className={`${erp.td} ${erp.num}`}>{parsed.entries.length}</td>
                          <td className={`${erp.td} ${erp.num} ${k.amounts ? '' : 'border-r-0'}`}>{fmt([...byProject.values()].reduce((s, x) => s + x.a, unassigned.a))}</td>
                          {k.amounts && (
                            <>
                              <td className={`${erp.td} ${erp.num}`}>{fmt([...byProject.values()].reduce((s, x) => s + x.b, unassigned.b))}</td>
                              <td className={`${erp.td} ${erp.num}`}>{fmt([...byProject.values()].reduce((s, x) => s + x.c, unassigned.c))}</td>
                              <td className={`${erp.td} ${erp.num} border-r-0`}>{fmt([...byProject.values()].reduce((s, x) => s + x.a + x.b + x.c, unassigned.a + unassigned.b + unassigned.c))}</td>
                            </>
                          )}
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {oldLines > 0 && (
                  <p className="text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-[3px] px-3 py-2">
                    {parsed.vhc
                      ? `Khối ${parsed.vhc.division} tháng ${fmtMonth(parsed.vhc.month)} đã có ${oldLines} dòng phân bổ chi phí vận hành chung — sẽ được thay bằng file này.`
                      : `Sổ ${LEDGER_LABEL[kind]} đang có ${oldLines} dòng ở tháng ${parsed.months.map(fmtMonth).join(', ')} — sẽ được thay bằng dữ liệu trong file này.`}
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
        )}

        {view === 'import' && (
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
              Import {k.label.toLowerCase()} (v{nextLedgerVer()})
            </Btn>
          </span>
        </div>
        )}
      </div>
    </div>
  );
};

// ==========================================================================
// Danh sách dữ liệu đã import (theo sổ đang chọn) — lọc theo phiên bản / tháng / tìm kiếm, xoá từng dòng
// ==========================================================================
const LedgerList: React.FC<{ kind: LedgerKind; projects: BizProject[]; by: string }> = ({ kind, projects, by }) => {
  const { ledger, removeLedgerEntry, removeLedgerVersion } = useBusinessProjects();
  const [ver, setVer] = useState('all');
  const [delOpen, setDelOpen] = useState(false);
  const [month, setMonth] = useState('all');
  const [q, setQ] = useState('');
  const [confirm, setConfirm] = useState<string | null>(null);
  const all = ledger[kind] as LedgerEntry[];
  const vers = [...new Set(all.map((e) => e.ver))].sort((a, b) => b - a);
  const months = [...new Set(all.map((e) => e.month))].sort().reverse();
  const needle = q.trim().toLowerCase();
  const baseRows = all
    .filter((e) => (ver === 'all' || e.ver === +ver) && (month === 'all' || e.month === month))
    .map((e) => ({ e, p: matchProject(projects, e.projectCode) }))
    .filter(({ e, p }) => !needle || [e.projectCode, p?.masterCode, p?.name, 'description' in e ? e.description : e.note, 'partner' in e ? e.partner : ''].some((v) => (v || '').toLowerCase().includes(needle)))
    .sort((a, b) => b.e.ver - a.e.ver || b.e.month.localeCompare(a.e.month) || a.e.projectCode.localeCompare(b.e.projectCode));
  const logs = ledger.imports.filter((i) => i.kind === kind);
  // Cột đúng theo file import của từng sổ + Tháng + Ver; get = giá trị dùng cho lọc / cộng tổng
  type Row = { e: LedgerEntry; p?: BizProject };
  type Col = { h: string; num?: boolean; center?: boolean; get: (r: Row) => string | number };
  const dmy = (d: string) => d.split('-').reverse().join('/');
  const amt = (i: number) => (r: Row) => entryAmounts(r.e)[i];
  const codeOf = ({ e }: Row) => e.projectCode;
  const noteOf = ({ e }: Row) => ('description' in e ? e.description : e.note) || '';
  const cash = (r: Row) => r.e as CashInEntry;
  const cols: Col[] =
    kind === 'cost'
      ? [
          { h: 'Mã công trình', get: codeOf },
          { h: 'Diễn giải', get: noteOf },
          { h: 'Sản xuất', num: true, get: amt(0) },
          { h: 'CP bán hàng', num: true, get: amt(1) },
          { h: 'Chi phí chung', num: true, get: amt(2) },
        ]
      : kind === 'opex' || kind === 'mgmt'
      ? [{ h: 'Mã công trình', get: codeOf }, { h: 'Diễn giải', get: noteOf }, { h: 'Số tiền', num: true, get: amt(0) }]
      : [
          { h: 'Ngày hạch toán', center: true, get: (r) => dmy(cash(r).date) },
          { h: 'Diễn giải', get: noteOf },
          { h: 'Số tiền', num: true, get: amt(0) },
          { h: 'Tên đối tượng', get: (r) => cash(r).partner || '' },
          { h: 'Mã công trình', get: codeOf },
          { h: 'Tên công trình', get: (r) => cash(r).projectName || r.p?.name || '' },
          ...(kind === 'cashIn' ? [{ h: 'Mã đơn vị', get: (r: Row) => cash(r).unitCode || '' }, { h: 'Tên đơn vị', get: (r: Row) => cash(r).unitName || '' }] : []),
        ];
  // Phễu lọc ở tiêu đề từng cột (chọn giá trị, kiểu Excel) — lọc liên hoàn giữa các cột
  const getters = useMemo(() => {
    const g: Record<string, (r: Row) => string> = {};
    cols.forEach((c) => (g[c.h] = (r) => (c.num ? fmt(Number(c.get(r))) : String(c.get(r) || ''))));
    g['Tháng'] = (r) => fmtMonth(r.e.month);
    g['Ver'] = (r) => `v${r.e.ver}`;
    return g;
  }, [kind, projects]); // eslint-disable-line react-hooks/exhaustive-deps
  const colF = useColumnFilters<Row>(baseRows, getters);
  const rows = colF.rows;
  const total = rows.reduce((s, { e }) => s + entryTotal(e), 0);
  const colSum = (c: Col) => rows.reduce((a, r) => a + Number(c.get(r)), 0);
  const colNz = (c: Col) => rows.filter((r) => Number(c.get(r)) !== 0).length;
  const headCell = (h: string) => (
    <div className="flex items-center gap-1">
      <span className="flex-1 min-w-0">{h}</span>
      {colF.funnel(h, h)}
    </div>
  );
  const codeCell = (e: LedgerEntry, p?: BizProject) => (
    <span className="font-mono whitespace-nowrap" title={p ? `Khớp dự án ${p.masterCode} — ${p.name}` : 'Chưa khớp dự án nào trên hệ thống'}>
      {e.projectCode ? <span className={p ? 'text-[#1f5fa8]' : 'text-amber-700'}>{e.projectCode}</span> : <span className="text-slate-300">—</span>}
    </span>
  );

  return (
    <div className="p-3 space-y-2 overflow-y-auto">
      <div className="flex flex-wrap items-center gap-2 text-[12px]">
        <label className="flex items-center gap-1.5 text-slate-600">
          Phiên bản
          <select value={ver} onChange={(e) => setVer(e.target.value)} className={`${erp.input} h-7 w-28`}>
            <option value="all">Tất cả</option>
            {vers.map((v) => (
              <option key={v} value={v}>
                v{v}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1.5 text-slate-600">
          Tháng
          <select value={month} onChange={(e) => setMonth(e.target.value)} className={`${erp.input} h-7 w-28`}>
            <option value="all">Tất cả</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {fmtMonth(m)}
              </option>
            ))}
          </select>
        </label>
        <span className="relative">
          <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã, tên dự án, diễn giải…" className={`${erp.input} h-7 pl-7 w-64`} />
        </span>
        <span className="ml-auto text-slate-600">
          <b className="text-slate-800">{rows.length}</b> dòng · Tổng <b className="text-slate-800 tabular-nums">{fmt(total)}</b>
        </span>
        <Btn variant="danger" icon={Eraser} className="h-7" disabled={!logs.length} onClick={() => setDelOpen(true)}>
          Xoá theo lần import
        </Btn>
      </div>
      {delOpen && (
        <DeleteVersionDialog
          kind={kind}
          entries={all}
          logs={logs}
          projects={projects}
          initialVer={ver === 'all' ? undefined : +ver}
          onClose={() => setDelOpen(false)}
          onDelete={(v, pid) => {
            removeLedgerVersion(kind, v, by, pid);
            setDelOpen(false);
            if (ver !== 'all' && +ver === v && !pid) setVer('all');
          }}
        />
      )}
      {logs.length > 0 && (
        <p className="text-[11.5px] text-slate-500">
          Các lần import {LEDGER_LABEL[kind].toLowerCase()}:{' '}
          {logs.map((l) => (
            <span key={l.ver} className="mr-2">
              <Tag cls="bg-slate-100 text-slate-700 border-slate-300">v{l.ver}</Tag> {l.fileName} · {l.lines} dòng · {new Date(l.at).toLocaleDateString('vi-VN')}
            </span>
          ))}
        </p>
      )}
      <ColumnFilterBar active={colF.active} filters={colF.filters} labelOf={(k) => k} onRemove={(k) => colF.set(k, [])} onClear={colF.clear} className="border border-slate-200 rounded-[3px]" />
      <div className="max-h-[58vh] overflow-auto border border-slate-300 rounded-[3px] bg-white">
        <table className={erp.table}>
          <thead className="sticky top-0 z-10">
            <tr>
              <th className={`${erp.th} border-t-0 border-l-0 text-center w-10`}>#</th>
              {cols.map((c) => (
                <th key={c.h} className={`${erp.th} border-t-0 whitespace-nowrap ${c.num ? 'text-right' : c.center ? 'text-center' : 'text-left'}`}>
                  {headCell(c.h)}
                </th>
              ))}
              <th className={`${erp.th} border-t-0 text-center whitespace-nowrap`}>{headCell('Tháng')}</th>
              <th className={`${erp.th} border-t-0 text-center whitespace-nowrap`}>{headCell('Ver')}</th>
              <th className={`${erp.th} border-t-0 border-r-0 text-center`}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ e, p }, i) => (
              <tr key={e.id} className={erp.tr}>
                <td className={`${erp.td} text-center text-slate-500 border-l-0`}>{i + 1}</td>
                {'amount' in e ? (
                  <>
                    <td className={`${erp.td} text-center tabular-nums whitespace-nowrap`}>{dmy(e.date)}</td>
                    <td className={`${erp.td} max-w-[300px] truncate`} title={e.description}>
                      {e.description}
                    </td>
                    <td className={`${erp.td} ${erp.num} font-semibold text-emerald-700`}>{fmt(e.amount)}</td>
                    <td className={`${erp.td} max-w-[200px] truncate`} title={e.partner}>
                      {e.partner}
                    </td>
                    <td className={erp.td}>{codeCell(e, p)}</td>
                    <td className={`${erp.td} max-w-[200px] truncate`} title={e.projectName || p?.name}>
                      {e.projectName || p?.name || <span className="text-slate-300">—</span>}
                    </td>
                    {kind === 'cashIn' && <td className={`${erp.td} whitespace-nowrap`}>{e.unitCode || <span className="text-slate-300">—</span>}</td>}
                    {kind === 'cashIn' && <td className={`${erp.td} whitespace-nowrap`}>{e.unitName || <span className="text-slate-300">—</span>}</td>}
                  </>
                ) : (
                  <>
                    <td className={erp.td}>{codeCell(e, p)}</td>
                    <td className={`${erp.td} max-w-[420px] truncate`} title={e.note}>
                      {e.note || <span className="text-slate-300">—</span>}
                    </td>
                    {entryAmounts(e).slice(0, 'value' in e ? 1 : 3).map((v, j) => (
                      <td key={j} className={`${erp.td} ${erp.num} ${v ? 'font-semibold text-rose-700' : 'text-slate-400'}`}>{fmt(v)}</td>
                    ))}
                  </>
                )}
                <td className={`${erp.td} text-center tabular-nums whitespace-nowrap`}>{fmtMonth(e.month)}</td>
                <td className={`${erp.td} text-center`}>
                  <Tag cls="bg-slate-100 text-slate-700 border-slate-300">v{e.ver}</Tag>
                </td>
                <td className={`${erp.td} text-center border-r-0 whitespace-nowrap`}>
                  {confirm === e.id ? (
                    <span className="inline-flex gap-1">
                      <Btn variant="danger" className="h-6 px-2 text-[11px]" onClick={() => (removeLedgerEntry(kind, e.id, by), setConfirm(null))}>
                        Xoá
                      </Btn>
                      <Btn className="h-6 px-2 text-[11px]" onClick={() => setConfirm(null)}>
                        Không
                      </Btn>
                    </span>
                  ) : (
                    <button type="button" title="Xoá dòng này (số thực tế của dự án được tính lại)" onClick={() => setConfirm(e.id)} className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={4 + cols.length} className="px-3 py-8 text-center text-slate-400 italic">
                  Chưa có dòng nào.
                </td>
              </tr>
            )}
          </tbody>
          {rows.length > 0 && (
            <tfoot className="sticky bottom-0 z-10" data-testid="ledger-totals">
              <tr className={erp.totalRow}>
                <td className={`${erp.td} border-l-0 text-center`} />
                {cols.map((c, i) =>
                  c.num ? (
                    <td key={c.h} className={`${erp.td} ${erp.num} whitespace-nowrap`} title={`${colNz(c)} / ${rows.length} dòng có số khác 0`}>
                      {fmt(colSum(c))}
                    </td>
                  ) : i === 0 ? (
                    <td key={c.h} className={`${erp.td} whitespace-nowrap`}>
                      Tổng · {rows.length} dòng
                    </td>
                  ) : (
                    <td key={c.h} className={erp.td} />
                  ),
                )}
                <td className={erp.td} />
                <td className={erp.td} />
                <td className={`${erp.td} border-r-0`} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <p className="text-[11.5px] text-slate-500">Cột đúng theo file import, thêm Tháng và Ver. Mã công trình màu xanh = đã khớp dự án, màu cam = chưa khớp. Bấm biểu tượng phễu ở tiêu đề cột để lọc theo giá trị (có ô tìm, chọn nhiều); dòng Tổng cộng tính theo kết quả đang lọc. Mỗi lần import 1 file là 1 phiên bản (v1, v2…); import lại tháng nào thì dòng cũ của tháng đó được thay bằng file mới.</p>
    </div>
  );
};

// ==========================================================================
// Hộp thoại xoá dữ liệu theo lần import (phiên bản)
// ==========================================================================
const DeleteVersionDialog: React.FC<{
  kind: LedgerKind;
  entries: LedgerEntry[];
  logs: { ver: number; fileName: string; at: string; lines: number }[];
  projects: BizProject[];
  initialVer?: number;
  onClose: () => void;
  onDelete: (ver: number, projectId?: string) => void;
}> = ({ kind, entries, logs, projects, initialVer, onClose, onDelete }) => {
  const vers = [...new Set(entries.map((e) => e.ver))].sort((a: number, b: number) => b - a) as number[];
  const [ver, setVer] = useState<number>(initialVer && vers.includes(initialVer) ? initialVer : vers[0]);
  const [mode, setMode] = useState<'all' | 'project'>('all');
  const [pid, setPid] = useState('');
  const inVer = entries.filter((e) => e.ver === ver);
  const projIn = projects.filter((p) => inVer.some((e) => ownsCode(p, e.projectCode)));
  const nProj = (v: number) => new Set(entries.filter((e) => e.ver === v).map((e) => matchProject(projects, e.projectCode)?.id).filter(Boolean)).size;
  const log = logs.find((l) => l.ver === ver);
  const when = (iso?: string) => (iso ? new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
  const selP = projects.find((p) => p.id === pid);
  const nDel = mode === 'all' ? inVer.length : selP ? inVer.filter((e) => ownsCode(selP, e.projectCode)).length : 0;
  const canDelete = !!ver && (mode === 'all' || !!selP) && nDel > 0;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-[4px] border border-slate-400 shadow-2xl">
        <div className="px-4 py-2.5 border-b border-slate-300 bg-gradient-to-b from-[#f7f9fc] to-[#edf1f6] flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-[#1e3a5f] flex items-center gap-1.5">
            <Eraser size={14} className="text-rose-600" /> Xoá dữ liệu theo lần import — {LEDGER_LABEL[kind]}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <div className="p-4 space-y-3 text-[12.5px]">
          <label className="block">
            <span className="block text-[12px] text-slate-600 mb-1">
              Chọn phiên bản <span className="text-rose-600">*</span>
            </span>
            <select value={ver} onChange={(e) => (setVer(+e.target.value), setPid(''))} className={erp.inputFull}>
              {vers.map((v) => {
                const l = logs.find((x) => x.ver === v);
                return (
                  <option key={v} value={v}>
                    v{v} · {entries.filter((e) => e.ver === v).length} dòng · Dự án: {nProj(v)} · {when(l?.at)}
                    {l ? ` · ${l.fileName}` : ''}
                  </option>
                );
              })}
            </select>
          </label>
          <p className="text-slate-600">
            <b className="text-slate-800">{inVer.length}</b> dòng · <b className="text-slate-800">{projIn.length}</b> dự án khớp mã · import lúc {when(log?.at)}
            {log && (
              <>
                {' '}· file <b className="text-slate-800">{log.fileName}</b>
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setMode('all')} className={`h-8 px-3 rounded-full border text-[12px] font-semibold cursor-pointer ${mode === 'all' ? 'bg-[#eaf2fc] border-[#1f5fa8] text-[#1f5fa8]' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
              Xoá toàn bộ phiên bản này
            </button>
            <button type="button" onClick={() => setMode('project')} className={`h-8 px-3 rounded-full border text-[12px] font-semibold cursor-pointer ${mode === 'project' ? 'bg-[#eaf2fc] border-[#1f5fa8] text-[#1f5fa8]' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
              Chỉ xoá một dự án trong phiên bản này
            </button>
          </div>
          {mode === 'project' && (
            <label className="block">
              <span className="block text-[12px] text-slate-600 mb-1">
                Dự án <span className="text-rose-600">*</span>
              </span>
              <select value={pid} onChange={(e) => setPid(e.target.value)} className={erp.inputFull}>
                <option value="">— Chọn dự án —</option>
                {projIn.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.masterCode} — {p.name} ({inVer.filter((e) => ownsCode(p, e.projectCode)).length} dòng)
                  </option>
                ))}
              </select>
              {!projIn.length && <span className="block mt-1 text-[11.5px] text-amber-700">Phiên bản này không có dòng nào khớp dự án trên hệ thống.</span>}
            </label>
          )}
          <p className="text-[11.5px] text-amber-800 bg-amber-50 border border-amber-200 rounded-[3px] px-3 py-2">
            Sẽ xoá <b>{nDel}</b> dòng. Số {LEDGER_LABEL[kind].toLowerCase()} của các dự án liên quan được tính lại ngay; thao tác không hoàn tác được.
          </p>
        </div>
        <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 flex justify-end gap-1.5">
          <Btn icon={X} onClick={onClose}>
            Huỷ
          </Btn>
          <Btn variant="danger" icon={Trash2} disabled={!canDelete} onClick={() => onDelete(ver, mode === 'project' ? pid : undefined)} className="!bg-rose-600 !border-rose-700 !text-white hover:!bg-rose-700">
            Xoá
          </Btn>
        </div>
      </div>
    </div>
  );
};

/** Xem trước file chi phí vận hành chung: khối, tháng, tổng + các khoản chi. */
const VhcPreview: React.FC<{ v: NonNullable<Parsed['vhc']> }> = ({ v }) => {
  const [open, setOpen] = useState(false);
  const cells: [string, React.ReactNode][] = [
    ['Khối', <b key="d">{v.division}</b>],
    ['Tháng', <b key="m">{fmtMonth(v.month)}</b>],
    ['Tổng chi phí VHC (Cộng)', <b key="p" className="font-mono">{fmt(v.pool)}</b>],
    ['Số khoản chi', <b key="l">{v.lines.length}</b>],
    ['Tổng chi phí mã SX của khối', <b key="t" className="font-mono">{fmt(v.alloc.reduce((a, x) => a + x.cost, 0))}</b>],
    ['Số dự án được phân bổ', <b key="a">{v.alloc.length}</b>],
  ];
  return (
    <div className="border border-slate-300 rounded-[3px]" data-testid="vhc-preview">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-slate-200 bg-[#f5f8fc] text-[12px]">
        {cells.map(([l, val]) => (
          <div key={l} className="px-2.5 py-1.5">
            <p className="text-[11px] text-slate-500">{l}</p>
            <p className="text-slate-800">{val}</p>
          </div>
        ))}
      </div>
      <div className="max-h-64 overflow-auto border-t border-slate-200" data-testid="vhc-preview-alloc">
        <table className={erp.table}>
          <thead className="sticky top-0 z-10">
            <tr>
              {['Dự án', 'Chi phí mã SX (.2 + .2.x) trong tháng', 'Tỉ lệ', 'Chi phí VHC phân bổ'].map((h, i) => (
                <th key={h} className={`${erp.th} ${i ? 'text-right' : 'text-left'} border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 3 ? 'border-r-0' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {v.alloc.map((a) => (
              <tr key={a.projectCode} className={erp.tr}>
                <td className={`${erp.td} border-l-0`}>
                  <span className={`${erp.code} font-semibold`}>{a.projectCode}</span> <span className="text-slate-700">{a.projectName}</span>
                </td>
                <td className={`${erp.td} ${erp.num}`}>{fmt(a.cost)}</td>
                <td className={`${erp.td} ${erp.num}`}>{(a.ratio * 100).toFixed(2)}%</td>
                <td className={`${erp.td} ${erp.num} border-r-0 font-semibold`}>{fmt(a.value)}</td>
              </tr>
            ))}
            {!v.alloc.length && (
              <tr>
                <td colSpan={4} className={`${erp.td} border-x-0 text-center text-slate-400 py-4`}>
                  Chưa có chi phí dự án của khối trong tháng — chưa phân bổ.
                </td>
              </tr>
            )}
          </tbody>
          {v.alloc.length > 0 && (
            <tfoot>
              <tr className={erp.totalRow}>
                <td className={`${erp.td} border-l-0`}>TỔNG ({v.alloc.length} dự án)</td>
                <td className={`${erp.td} ${erp.num}`}>{fmt(v.alloc.reduce((a, x) => a + x.cost, 0))}</td>
                <td className={`${erp.td} ${erp.num}`}>100%</td>
                <td className={`${erp.td} ${erp.num} border-r-0`}>{fmt(v.alloc.reduce((a, x) => a + x.value, 0))}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {v.lines.length > 0 && (
        <>
          <button type="button" onClick={() => setOpen((x) => !x)} className="w-full text-left px-2.5 py-1.5 border-t border-slate-200 text-[12px] font-semibold text-[#1f5fa8] hover:bg-slate-50 cursor-pointer">
            {open ? 'Ẩn' : 'Xem'} {v.lines.length} khoản chi chi tiết
          </button>
          {open && (
            <div className="max-h-56 overflow-auto border-t border-slate-200">
              <table className={erp.table}>
                <thead className="sticky top-0 z-10">
                  <tr>
                    {['Diễn giải', 'Số tiền', 'Tên đối tượng', 'Tên nhân viên'].map((h, i) => (
                      <th key={h} className={`${erp.th} ${i === 1 ? 'text-right' : 'text-left'} border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 3 ? 'border-r-0' : ''}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {v.lines.map((l, i) => (
                    <tr key={i} className={erp.tr}>
                      <td className={`${erp.td} border-l-0`}>{l.description || '—'}</td>
                      <td className={`${erp.td} ${erp.num}`}>{fmt(l.amount)}</td>
                      <td className={erp.td}>{l.partner || '—'}</td>
                      <td className={`${erp.td} border-r-0`}>{l.employee || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};
