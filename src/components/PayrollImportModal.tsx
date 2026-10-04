/**
 * PayrollImportModal — HR import bảng lương từ Excel → sinh phiên bản bảng lương mới (v2, v3…).
 *
 * Bước 1: Tải file mẫu (trống) hoặc tải bảng lương đang dùng để sửa.
 * Bước 2: Chọn file (.xlsx / .xls / .csv) — tự tìm dòng tiêu đề có "Mã NV".
 * Xem trước: lỗi / cảnh báo, tổng hợp theo 7 khối, khối nào giữ "Đã duyệt", khối nào phải duyệt lại.
 * Xác nhận → tạo phiên bản mới (không ghi đè phiên bản cũ).
 */
import React, { useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, FlaskConical, Info, RotateCcw, UploadCloud, X } from 'lucide-react';
import { BlockStatus, KHOIS, KHOI_NAME, Khoi, PayPeriod, PayRow, completeRow, impactOf, latestVersion, periodLabel, prevPeriodOf, rowsOf, sumRows, usePayroll } from '../payroll/PayrollContext';
import { Btn, Tag, erp } from './erp/Erp';

const money = (n: number) => Math.round(n || 0).toLocaleString('en-US');
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

type Field = keyof PayRow;
/** Cột của file mẫu: [tiêu đề, trường, bắt buộc, kiểu số]. */
export const TEMPLATE_COLS: [string, Field, boolean, boolean][] = [
  ['Mã NV', 'code', true, false],
  ['Họ tên', 'name', true, false],
  ['Khối', 'khoi', true, false],
  ['Phòng ban', 'department', false, false],
  ['Chức danh', 'title', false, false],
  ['Ngày công', 'workDays', false, true],
  ['Lương cơ bản', 'basic', true, true],
  ['Phụ cấp', 'allowance', false, true],
  ['OT', 'ot', false, true],
  ['Thưởng', 'bonus', false, true],
  ['Tổng thu nhập', 'gross', false, true],
  ['BH người lao động', 'insEmp', false, true],
  ['Thuế TNCN', 'tax', false, true],
  ['Khấu trừ khác', 'otherDeduct', false, true],
  ['Thực nhận', 'net', false, true],
  ['BH doanh nghiệp', 'insCompany', false, true],
  ['Chi phí công ty', 'cost', false, true],
];
const ALIASES: Record<string, Field> = {
  'ma nv': 'code',
  'ma nhan vien': 'code',
  'employee code': 'code',
  'ho ten': 'name',
  'ho va ten': 'name',
  'full name': 'name',
  khoi: 'khoi',
  division: 'khoi',
  'phong ban': 'department',
  department: 'department',
  'chuc danh': 'title',
  position: 'title',
  'ngay cong': 'workDays',
  'luong co ban': 'basic',
  'phu cap': 'allowance',
  ot: 'ot',
  'lam them': 'ot',
  thuong: 'bonus',
  'tong thu nhap': 'gross',
  'bh nguoi lao dong': 'insEmp',
  'bhxh nld': 'insEmp',
  'thue tncn': 'tax',
  'khau tru khac': 'otherDeduct',
  'thuc nhan': 'net',
  'bh doanh nghiep': 'insCompany',
  'chi phi cong ty': 'cost',
};
const toKhoi = (v: unknown): Khoi | null => {
  const s = norm(v).replace(/^khoi /, '');
  if (!s) return null;
  const hit = KHOIS.find((k) => norm(k) === s || norm(KHOI_NAME[k]) === s || norm(KHOI_NAME[k]).replace(/^khoi /, '') === s);
  if (hit) return hit;
  if (s.includes('giai phap') || s === 'gp-dv') return 'GPDV';
  if (s.includes('health') || s === 'hcare') return 'HCARE';
  return null;
};

/** Tải file mẫu; truyền rows để tải bảng lương đang dùng (sửa rồi import lại). */
export const downloadPayrollTemplate = (period: PayPeriod, rows: PayRow[] = []) => {
  const data = [
    [`BẢNG LƯƠNG KỲ ${periodLabel(period)}`],
    ['Đơn vị: VNĐ. Cột * bắt buộc. Để trống Tổng thu nhập / Thực nhận / Chi phí công ty thì hệ thống tự tính. Khối: G1, G2, G3, G4, BFSI, GPDV, HCARE.'],
    TEMPLATE_COLS.map(([h, , req]) => (req ? `${h} *` : h)),
    ...rows.map((r) => TEMPLATE_COLS.map(([, f]) => r[f] as string | number)),
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = TEMPLATE_COLS.map(([h]) => ({ wch: Math.max(12, h.length + 4) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'BangLuong');
  XLSX.writeFile(wb, rows.length ? `BangLuong_T${String(period.month).padStart(2, '0')}_${period.year}_v${latestVersion(period)?.no ?? 0}.xlsx` : `MauImport_BangLuong.xlsx`);
};

interface Issue {
  row: number;
  level: 'error' | 'warn' | 'info';
  msg: string;
}
interface Parsed {
  fileName: string;
  rows: PayRow[];
  issues: Issue[];
}

const parseSheet = (aoa: unknown[][], fileName: string, compareWith: PayRow[]): Parsed => {
  const issues: Issue[] = [];
  const headIdx = aoa.findIndex((r) => r.some((c) => ALIASES[norm(c).replace(/\s*\*$/, '')] === 'code'));
  if (headIdx < 0) return { fileName, rows: [], issues: [{ row: 0, level: 'error', msg: 'Không tìm thấy dòng tiêu đề có cột "Mã NV". Dùng đúng file mẫu.' }] };
  const map = new Map<number, Field>();
  aoa[headIdx].forEach((c, i) => {
    const f = ALIASES[norm(c).replace(/\s*\*$/, '')];
    if (f) map.set(i, f);
  });
  const missing = TEMPLATE_COLS.filter(([, f, req]) => req && ![...map.values()].includes(f)).map(([h]) => h);
  if (missing.length) return { fileName, rows: [], issues: [{ row: 0, level: 'error', msg: `Thiếu cột bắt buộc: ${missing.join(', ')}.` }] };

  const rows: PayRow[] = [];
  const seen = new Set<string>();
  aoa.slice(headIdx + 1).forEach((r, i) => {
    const line = headIdx + i + 2;
    if (!r.some((c) => String(c ?? '').trim())) return;
    const get = (f: Field) => {
      const idx = [...map.entries()].find(([, ff]) => ff === f)?.[0];
      return idx === undefined ? '' : r[idx];
    };
    const code = String(get('code') ?? '').trim().toUpperCase();
    if (!code) return void issues.push({ row: line, level: 'error', msg: 'Thiếu Mã NV.' });
    if (seen.has(code)) return void issues.push({ row: line, level: 'error', msg: `Trùng Mã NV ${code}.` });
    seen.add(code);
    const khoi = toKhoi(get('khoi'));
    if (!khoi) return void issues.push({ row: line, level: 'error', msg: `${code}: Khối "${get('khoi')}" không hợp lệ (G1, G2, G3, G4, BFSI, GPDV, HCARE).` });
    const nums: Partial<Record<Field, number>> = {};
    let bad = '';
    TEMPLATE_COLS.filter(([, , , isNum]) => isNum).forEach(([h, f]) => {
      const n = parseNum(get(f));
      if (n === null) bad = h;
      else nums[f] = n;
    });
    if (bad) return void issues.push({ row: line, level: 'error', msg: `${code}: cột "${bad}" không phải số.` });
    if ((nums.basic || 0) <= 0) return void issues.push({ row: line, level: 'error', msg: `${code}: Lương cơ bản phải lớn hơn 0.` });
    if (Object.values(nums).some((n) => (n as number) < 0)) return void issues.push({ row: line, level: 'error', msg: `${code}: có số âm.` });
    const row = completeRow({
      code,
      name: String(get('name') ?? '').trim(),
      khoi,
      department: String(get('department') ?? '').trim(),
      title: String(get('title') ?? '').trim(),
      workDays: nums.workDays || 22,
      basic: nums.basic || 0,
      allowance: nums.allowance || 0,
      ot: nums.ot || 0,
      bonus: nums.bonus || 0,
      gross: nums.gross || 0,
      insEmp: nums.insEmp || 0,
      tax: nums.tax || 0,
      otherDeduct: nums.otherDeduct || 0,
      net: nums.net || 0,
      insCompany: nums.insCompany || 0,
      cost: nums.cost || 0,
    });
    if (!row.name) issues.push({ row: line, level: 'warn', msg: `${code}: thiếu Họ tên.` });
    if (Math.abs(row.net - (row.gross - row.insEmp - row.tax - row.otherDeduct)) > 1000)
      issues.push({ row: line, level: 'warn', msg: `${code}: Thực nhận (${money(row.net)}) ≠ Tổng thu nhập − BH − Thuế − Khấu trừ (${money(row.gross - row.insEmp - row.tax - row.otherDeduct)}).` });
    rows.push(row);
  });
  if (!rows.length && !issues.some((x) => x.level === 'error')) issues.push({ row: 0, level: 'error', msg: 'File không có dòng dữ liệu nào.' });
  // So với kỳ trước / phiên bản đang dùng
  if (rows.length && compareWith.length) {
    const now = new Set(rows.map((r) => r.code));
    const before = new Set(compareWith.map((r) => r.code));
    const gone = compareWith.filter((r) => !now.has(r.code));
    const added = rows.filter((r) => !before.has(r.code));
    if (gone.length) issues.push({ row: 0, level: 'warn', msg: `${gone.length} nhân sự có ở bảng lương trước nhưng không có trong file (có thể đã nghỉ việc): ${gone.slice(0, 8).map((r) => `${r.code} ${r.name}`).join(', ')}${gone.length > 8 ? '…' : ''}` });
    if (added.length) issues.push({ row: 0, level: 'info', msg: `${added.length} nhân sự mới so với bảng lương trước: ${added.slice(0, 8).map((r) => `${r.code} ${r.name}`).join(', ')}${added.length > 8 ? '…' : ''}` });
  }
  return { fileName, rows, issues };
};

const STATUS_TAG: Record<BlockStatus, string> = {
  'Chưa gửi': 'bg-slate-100 text-slate-600 border-slate-300',
  'Chờ duyệt': 'bg-amber-50 text-amber-700 border-amber-300',
  'Đã duyệt': 'bg-emerald-50 text-emerald-700 border-emerald-300',
  'Từ chối': 'bg-rose-50 text-rose-700 border-rose-300',
};

export const PayrollImportModal: React.FC<{ period: PayPeriod; by: string; onClose: () => void; onDone: (msg: string) => void }> = ({ period: p, by, onClose, onDone }) => {
  const { periods, importVersion } = usePayroll();
  const inputRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [dragging, setDragging] = useState(false);
  const cur = latestVersion(p);
  const prev = prevPeriodOf(periods, p);
  const compareWith = cur ? cur.rows : rowsOf(prev ? latestVersion(prev) : undefined);
  const nextNo = p.versions.length + 1;

  const readFile = (file: File) => {
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) return setParsed({ fileName: file.name, rows: [], issues: [{ row: 0, level: 'error', msg: 'Chỉ hỗ trợ file .xlsx, .xls, .csv.' }] });
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const wb = XLSX.read(reader.result, { type: 'array' });
        const aoa = XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '' });
        setParsed(parseSheet(aoa, file.name, compareWith));
      } catch {
        setParsed({ fileName: file.name, rows: [], issues: [{ row: 0, level: 'error', msg: 'Không đọc được file.' }] });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  /** Dữ liệu thử: lấy bảng lương đang dùng, bổ sung phụ cấp onsite cho nhân sự bị đánh dấu ở khối bị từ chối. */
  const useSample = () => {
    const base = cur?.rows || rowsOf(prev ? latestVersion(prev) : undefined);
    const flagged = new Set(KHOIS.flatMap((k) => (p.blocks[k].status === 'Từ chối' ? p.blocks[k].flagged || [] : [])));
    const rejected = KHOIS.filter((k) => p.blocks[k].status === 'Từ chối');
    const rows = base.map((r) => {
      const fix = flagged.has(r.code) || (!flagged.size && rejected.includes(r.khoi) && r.title === 'Dev');
      if (!fix) return r;
      const allowance = r.allowance + 1_500_000;
      const gross = r.gross + 1_500_000;
      return { ...r, allowance, gross, net: gross - r.insEmp - r.tax - r.otherDeduct, cost: gross + r.insCompany };
    });
    const aoa = [TEMPLATE_COLS.map(([h]) => h), ...rows.map((r) => TEMPLATE_COLS.map(([, f]) => r[f] as string | number))];
    setParsed(parseSheet(aoa, `BangLuong_T${String(p.month).padStart(2, '0')}_${p.year}_bosung.xlsx (dữ liệu thử)`, compareWith));
  };

  const errors = parsed?.issues.filter((x) => x.level === 'error') || [];
  const warns = parsed?.issues.filter((x) => x.level !== 'error') || [];
  const impacts = useMemo(() => (parsed && !errors.length ? impactOf(p, parsed.rows) : []), [parsed, p]);
  const canApply = !!parsed && parsed.rows.length > 0 && errors.length === 0;

  const apply = () => {
    if (!parsed) return;
    const no = importVersion(p.id, parsed.rows, parsed.fileName, by);
    const need = impacts.filter((i) => i.after === 'Chưa gửi').map((i) => i.khoi);
    onDone(`Đã tạo bảng lương v${no} (${parsed.rows.length} nhân sự)${cur ? ` — khối cần gửi duyệt lại: ${need.join(', ') || 'không có'}` : ''}`);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40" />
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 12 }}
        className="relative bg-[#eef1f5] w-full max-w-3xl rounded-[4px] border border-slate-400 shadow-2xl z-10 flex flex-col max-h-[92vh]"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-t-[3px]">
          <div className="min-w-0">
            <h3 className="text-[14px] font-bold flex items-center gap-2">
              <FileSpreadsheet size={16} /> Import bảng lương — kỳ {periodLabel(p)}
            </h3>
            <p className="text-[11px] text-slate-300">
              Sẽ tạo <b>phiên bản v{nextNo}</b>
              {cur ? ` (phiên bản đang dùng: v${cur.no}, không bị ghi đè)` : ' (phiên bản đầu tiên của kỳ)'} · ĐVT: VNĐ
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
              <Btn icon={Download} onClick={() => downloadPayrollTemplate(p)}>
                File mẫu trống
              </Btn>
              {(cur || prev) && (
                <Btn icon={Download} onClick={() => downloadPayrollTemplate(p, cur?.rows || rowsOf(prev ? latestVersion(prev) : undefined))}>
                  {cur ? `Bảng lương đang dùng (v${cur.no}) để sửa` : `Bảng lương kỳ trước (${periodLabel(prev!)}) để sửa`}
                </Btn>
              )}
            </div>
            <p className="mt-2 text-[11.5px] text-slate-500">Cột bắt buộc: Mã NV, Họ tên, Khối, Lương cơ bản.</p>
          </section>

          {/* Bước 2 */}
          <section className="bg-white border border-slate-300 rounded-[4px] p-3">
            <p className="text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide mb-2">2. Chọn file bảng lương</p>
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
              <>
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
                {(cur || prev) && (
                  <button type="button" onClick={useSample} className="mt-2 inline-flex items-center gap-1 text-[12px] text-[#1f5fa8] hover:underline cursor-pointer">
                    <FlaskConical size={12} /> Chưa có file? Dùng dữ liệu thử
                  </button>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-[12.5px]">
                  <FileSpreadsheet size={15} className="text-emerald-600" />
                  <b className="text-slate-800">{parsed.fileName}</b>
                  <span className="text-slate-500">· {parsed.rows.length} nhân sự hợp lệ</span>
                  {errors.length > 0 && <Tag cls="bg-rose-50 text-rose-700 border-rose-300">{errors.length} lỗi</Tag>}
                  {warns.filter((w) => w.level === 'warn').length > 0 && <Tag cls="bg-amber-50 text-amber-700 border-amber-300">{warns.filter((w) => w.level === 'warn').length} cảnh báo</Tag>}
                </div>
                {parsed.issues.length > 0 && (
                  <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-[3px] divide-y divide-slate-100">
                    {parsed.issues.slice(0, 60).map((it, i) => (
                      <p key={i} className="flex items-start gap-1.5 px-2.5 py-1.5 text-[12px] text-slate-700">
                        {it.level === 'info' ? <Info size={13} className="mt-0.5 shrink-0 text-[#1f5fa8]" /> : <AlertTriangle size={13} className={`mt-0.5 shrink-0 ${it.level === 'error' ? 'text-rose-500' : 'text-amber-500'}`} />}
                        <span>
                          {it.row > 0 && <b className="text-slate-500 mr-1">Dòng {it.row}:</b>}
                          {it.msg}
                        </span>
                      </p>
                    ))}
                  </div>
                )}
                {impacts.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className={erp.table}>
                      <thead>
                        <tr>
                          {['Khối', 'Số NS', 'Chi phí công ty', 'Sau khi import'].map((h) => (
                            <th key={h} className={`${erp.th} text-center`}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {impacts.map((im) => {
                          const t = sumRows(parsed.rows.filter((r) => r.khoi === im.khoi));
                          return (
                            <tr key={im.khoi} className={erp.tr}>
                              <td className={`${erp.td} font-semibold`}>{im.khoi}</td>
                              <td className={`${erp.td} ${erp.num}`}>{t.count}</td>
                              <td className={`${erp.td} ${erp.num}`}>{money(t.cost)}</td>
                              <td className={`${erp.td} text-center`}>
                                {im.after === 'Chưa gửi' ? (
                                  <Tag cls="bg-blue-50 text-[#1f5fa8] border-blue-300">{cur ? 'Cần duyệt lại' : 'Chờ gửi duyệt'}</Tag>
                                ) : (
                                  <Tag cls={STATUS_TAG[im.after]}>Giữ {im.after}</Tag>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        {(() => {
                          const t = sumRows(parsed.rows);
                          return (
                            <tr className={erp.totalRow}>
                              <td className={erp.td}>TỔNG</td>
                              <td className={`${erp.td} ${erp.num}`}>{t.count}</td>
                              <td className={`${erp.td} ${erp.num}`}>{money(t.cost)}</td>
                              <td className={erp.td} />
                            </tr>
                          );
                        })()}
                      </tfoot>
                    </table>
                    <p className="mt-1.5 text-[11.5px] text-slate-500">Khối đã duyệt mà số liệu không đổi giữ nguyên "Đã duyệt".</p>
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
              Tạo phiên bản v{nextNo}
            </Btn>
          </span>
        </div>
      </motion.div>
    </div>
  );
};
