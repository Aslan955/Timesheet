/**
 * Import Excel cho PAKD:
 *  - Mục 3 "Mốc kế hoạch và mục tiêu" (dự án chưa ký): Giai đoạn · Từ · Đến · Sản xuất · Kinh doanh · Kết quả đầu ra.
 *  - Mục 4 "Kế hoạch chi phí theo tháng" (đã ký): Nhóm chi phí · Khoản mục · các cột tháng MM/YYYY · Kết quả đầu ra.
 * "Tải file mẫu" xuất đúng bố cục kèm dữ liệu đang có; import xem trước, báo lỗi từng dòng rồi mới áp dụng.
 */
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Upload } from 'lucide-react';
import { Btn, erp } from './erp/Erp';
import { Modal } from '../marcom/MarcomUi';
import { COST_GROUPS, CostGroup, PakdCost, PakdPhase, costTotal, isSxGroup, my, newCost, newPhase } from '../business/pakd';

type Kind = 'phases' | 'costs';
const money = (n: number) => Math.round(n || 0).toLocaleString('en-US');
const norm = (s: unknown) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
const ym = (y: number, m: number) => (y > 1900 && m >= 1 && m <= 12 ? `${y}-${String(m).padStart(2, '0')}` : '');

/** Tháng từ ô Excel: ngày Excel, Date, "12/2026", "T12/2026", "T12/26", "2026-12", "12-2026". */
export const parseMonth = (v: unknown): string => {
  if (v == null || v === '') return '';
  if (v instanceof Date && !isNaN(v.getTime())) {
    const d = new Date(v.getTime() + 12 * 3600 * 1000); // bù lệch giờ khi Excel lưu 00:00
    return ym(d.getFullYear(), d.getMonth() + 1);
  }
  if (typeof v === 'number') {
    if (v > 20000 && v < 80000) {
      const d = XLSX.SSF.parse_date_code(v);
      return d ? ym(d.y, d.m) : '';
    }
    return '';
  }
  const s = String(v).trim().replace(/^t(hang|háng)?\s*/i, '');
  let m = s.match(/^(\d{4})[-/.](\d{1,2})$/);
  if (m) return ym(+m[1], +m[2]);
  m = s.match(/^(\d{1,2})[-/.](\d{4})$/);
  if (m) return ym(+m[2], +m[1]);
  m = s.match(/^(\d{1,2})[-/.](\d{2})$/);
  if (m) return ym(2000 + +m[2], +m[1]);
  m = s.match(/^\d{1,2}[-/.](\d{1,2})[-/.](\d{4})$/); // dd/mm/yyyy
  if (m) return ym(+m[2], +m[1]);
  return '';
};
/** Số tiền: số Excel, "1,200,000", "1.200.000", "1200000 đ". */
export const parseNum = (v: unknown): number | null => {
  if (v == null || v === '') return 0;
  if (typeof v === 'number') return isFinite(v) ? v : null;
  const s = String(v).replace(/[^\d.,-]/g, '');
  if (!s) return 0;
  const clean = /^-?\d{1,3}([.,]\d{3})+$/.test(s) ? s.replace(/[.,]/g, '') : s.replace(/,/g, '');
  const n = Number(clean);
  return isFinite(n) ? n : null;
};
const groupOf = (v: unknown): CostGroup | null => COST_GROUPS.find((g) => norm(g) === norm(v)) || null;

interface Issue {
  row: number;
  msg: string;
  level: 'error' | 'warn';
}
type Parsed = { kind: 'phases'; rows: PakdPhase[]; issues: Issue[]; file: string } | { kind: 'costs'; rows: PakdCost[]; months: string[]; issues: Issue[]; file: string };

const readAoa = async (file: File): Promise<unknown[][]> => {
  // Ô ngày đọc dạng số serial Excel (chính xác, không lệch múi giờ) — parseMonth quy đổi
  const wb = XLSX.read(await file.arrayBuffer());
  const name = wb.SheetNames.find((n) => !/huong ?dan/i.test(norm(n))) || wb.SheetNames[0];
  return XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[name], { header: 1, raw: true, defval: '' });
};

const parsePhases = (aoa: unknown[][], file: string): Parsed => {
  const issues: Issue[] = [];
  const h = aoa.findIndex((r) => r.some((c) => norm(c).startsWith('giai doan')));
  if (h < 0) return { kind: 'phases', rows: [], issues: [{ row: 0, level: 'error', msg: 'Không tìm thấy dòng tiêu đề có cột "Giai đoạn" — dùng file mẫu.' }], file };
  const head = aoa[h].map(norm);
  const col = (...keys: string[]) => head.findIndex((c) => keys.some((k) => c.startsWith(k)));
  const c = { name: col('giai doan'), from: col('tu'), to: col('den'), sx: col('san xuat'), kd: col('kinh doanh'), out: col('ket qua') };
  // Tiêu đề 2 tầng ("Tổng mức đầu tư" ở dòng trên, Sản xuất / Kinh doanh ở dòng dưới)
  if (c.sx < 0 || c.kd < 0) {
    const sub = (aoa[h + 1] || []).map(norm);
    if (c.sx < 0) c.sx = sub.findIndex((x) => x.startsWith('san xuat'));
    if (c.kd < 0) c.kd = sub.findIndex((x) => x.startsWith('kinh doanh'));
  }
  const missing = Object.entries({ 'Giai đoạn': c.name, 'Từ': c.from, 'Đến': c.to, 'Sản xuất': c.sx, 'Kinh doanh': c.kd }).filter(([, i]) => i < 0).map(([k]) => k);
  if (missing.length) return { kind: 'phases', rows: [], issues: [{ row: h + 1, level: 'error', msg: `Thiếu cột: ${missing.join(', ')}` }], file };
  const rows: PakdPhase[] = [];
  aoa.slice(h + 1).forEach((r, i) => {
    const line = h + i + 2;
    const name = String(r[c.name] ?? '').trim();
    if (!name && !r[c.from] && !r[c.to] && !r[c.sx] && !r[c.kd]) return;
    if (/^(tong|cong)/.test(norm(name)) || /^san xuat|^kinh doanh/.test(norm(r[c.sx]))) return;
    const from = parseMonth(r[c.from]);
    const to = parseMonth(r[c.to]);
    const sx = parseNum(r[c.sx]);
    const kd = parseNum(r[c.kd]);
    const errs: string[] = [];
    if (!name) errs.push('thiếu tên giai đoạn');
    if (r[c.from] !== '' && !from) errs.push(`"Từ" không đúng tháng (${String(r[c.from])})`);
    if (r[c.to] !== '' && !to) errs.push(`"Đến" không đúng tháng (${String(r[c.to])})`);
    if (from && to && to < from) errs.push('"Đến" trước "Từ"');
    if (sx === null || (sx ?? 0) < 0) errs.push('Sản xuất không phải số ≥ 0');
    if (kd === null || (kd ?? 0) < 0) errs.push('Kinh doanh không phải số ≥ 0');
    if (errs.length) return issues.push({ row: line, level: 'error', msg: `${name || '(trống)'}: ${errs.join('; ')} — bỏ qua dòng` });
    if (!from || !to) issues.push({ row: line, level: 'warn', msg: `${name}: chưa có ${!from ? '"Từ"' : '"Đến"'}` });
    rows.push({ ...newPhase(), name, from, to, sx: sx || 0, kd: kd || 0, output: c.out >= 0 ? String(r[c.out] ?? '').trim() : '' });
  });
  if (!rows.length && !issues.some((x) => x.level === 'error')) issues.push({ row: 0, level: 'error', msg: 'File không có dòng giai đoạn nào.' });
  return { kind: 'phases', rows, issues, file };
};

const parseCosts = (aoa: unknown[][], file: string, period: string[]): Parsed => {
  const issues: Issue[] = [];
  const h = aoa.findIndex((r) => r.some((c) => norm(c).startsWith('khoan muc')));
  if (h < 0) return { kind: 'costs', rows: [], months: [], issues: [{ row: 0, level: 'error', msg: 'Không tìm thấy dòng tiêu đề có cột "Khoản mục chi phí" — dùng file mẫu.' }], file };
  const head = aoa[h];
  const hn = head.map(norm);
  const cGroup = hn.findIndex((x) => x.startsWith('nhom'));
  const cItem = hn.findIndex((x) => x.startsWith('khoan muc'));
  const cOut = hn.findIndex((x) => x.startsWith('ket qua'));
  const monthCols = head.map((x, i) => ({ i, m: parseMonth(x) })).filter((x) => x.m);
  if (cGroup < 0) return { kind: 'costs', rows: [], months: [], issues: [{ row: h + 1, level: 'error', msg: 'Thiếu cột "Nhóm chi phí".' }], file };
  if (!monthCols.length) return { kind: 'costs', rows: [], months: [], issues: [{ row: h + 1, level: 'error', msg: 'Không có cột tháng nào (tiêu đề dạng MM/YYYY, ví dụ 02/2026).' }], file };
  const rows: PakdCost[] = [];
  aoa.slice(h + 1).forEach((r, i) => {
    const line = h + i + 2;
    const rawG = String(r[cGroup] ?? '').trim();
    const item = String(r[cItem] ?? '').trim();
    if (!rawG && !item && monthCols.every(({ i: k }) => r[k] === '' || r[k] == null)) return;
    if (/^(tong|cong|luy ke|a\.|b\.)/.test(norm(rawG)) || /^(tong|cong|luy ke)/.test(norm(item))) return; // dòng nhóm / tổng
    const group = groupOf(rawG);
    const errs: string[] = [];
    if (!group) errs.push(`Nhóm chi phí "${rawG || '(trống)'}" không hợp lệ (${COST_GROUPS.join(', ')})`);
    if (!item) errs.push('thiếu khoản mục');
    const amounts: Record<string, number> = {};
    monthCols.forEach(({ i: k, m }) => {
      const n = parseNum(r[k]);
      if (n === null || n < 0) errs.push(`${my(m)} không phải số ≥ 0 (${String(r[k])})`);
      else if (n) amounts[m] = (amounts[m] || 0) + n;
    });
    if (errs.length) return issues.push({ row: line, level: 'error', msg: `${item || rawG || '(trống)'}: ${errs.join('; ')} — bỏ qua dòng` });
    rows.push({ ...newCost(group!, item), amounts, output: cOut >= 0 ? String(r[cOut] ?? '').trim() : '' });
  });
  const months = [...new Set(monthCols.map((x) => x.m))].sort();
  const out = months.filter((m) => !period.includes(m) && rows.some((c) => c.amounts[m]));
  if (out.length) issues.push({ row: 0, level: 'warn', msg: `Có chi phí ngoài kỳ thực hiện (${out.map(my).join(', ')}) — vẫn nhận, các cột tô vàng.` });
  if (!rows.length && !issues.some((x) => x.level === 'error')) issues.push({ row: 0, level: 'error', msg: 'File không có khoản mục chi phí nào.' });
  return { kind: 'costs', rows, months, issues, file };
};

/** Tải file mẫu (kèm dữ liệu đang có). */
const downloadTemplate = (kind: Kind, phases: PakdPhase[], costs: PakdCost[], period: string[], code: string) => {
  const wb = XLSX.utils.book_new();
  const guide: string[][] = [['Hướng dẫn import']];
  if (kind === 'phases') {
    const rows = [['Giai đoạn', 'Từ (MM/YYYY)', 'Đến (MM/YYYY)', 'Sản xuất (VNĐ)', 'Kinh doanh (VNĐ)', 'Kết quả đầu ra'], ...phases.filter((p) => p.name || p.sx || p.kd).map((p) => [p.name, my(p.from).replace('—', ''), my(p.to).replace('—', ''), p.sx, p.kd, p.output])];
    if (rows.length === 1) rows.push(['Toàn dự án', '01/2027', '12/2027', 0, 0, '']);
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 30 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 36 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Moc_ke_hoach');
    guide.push(['Mỗi dòng 1 giai đoạn. Từ / Đến nhập dạng MM/YYYY (ví dụ 12/2026).'], ['Sản xuất, Kinh doanh: tổng mức đầu tư (VNĐ), số ≥ 0. Cột Tổng do hệ thống tự tính.'], ['File đính kèm thêm trên màn hình sau khi import.']);
  } else {
    const months = [...new Set([...period, ...costs.flatMap((c) => Object.keys(c.amounts || {}).filter((m) => c.amounts[m]))])].sort();
    const head = ['Nhóm chi phí', 'Khoản mục chi phí', ...months.map((m) => my(m)), 'Kết quả đầu ra'];
    const order = [...costs.filter((c) => isSxGroup(c.group)), ...costs.filter((c) => !isSxGroup(c.group))];
    const rows = [head, ...order.map((c) => [c.group, c.item, ...months.map((m) => c.amounts?.[m] || 0), c.output])];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 22 }, { wch: 28 }, ...months.map(() => ({ wch: 14 })), { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Chi_phi_theo_thang');
    guide.push(
      [`Nhóm chi phí chỉ nhận: ${COST_GROUPS.join(', ')}.`],
      ['Tiêu đề cột tháng dạng MM/YYYY (ví dụ 02/2026); thêm / bớt cột tháng tuỳ ý. Ô trống = 0.'],
      ['Mỗi dòng 1 khoản mục; các dòng Tổng / Cộng được bỏ qua. File đính kèm thêm trên màn hình sau khi import.'],
    );
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(guide), 'Huong_dan');
  XLSX.writeFile(wb, `PAKD_${kind === 'phases' ? 'MocKeHoach' : 'ChiPhiTheoThang'}_${(code || 'mau').replace(/\./g, '-')}.xlsx`);
};

/** Nút "Tải file mẫu" + "Import Excel" và hộp thoại xem trước. */
export const PakdImportBar: React.FC<{
  kind: Kind;
  phases?: PakdPhase[];
  costs?: PakdCost[];
  /** Kỳ kế hoạch (mục 4) */
  period?: string[];
  code: string;
  onApplyPhases?: (rows: PakdPhase[]) => void;
  onApplyCosts?: (rows: PakdCost[]) => void;
}> = ({ kind, phases = [], costs = [], period = [], code, onApplyPhases, onApplyCosts }) => {
  const inp = useRef<HTMLInputElement>(null);
  const [res, setRes] = useState<Parsed | null>(null);
  const [mode, setMode] = useState<'replace' | 'merge'>('replace');
  const pick = async (file?: File) => {
    if (!file) return;
    try {
      const aoa = await readAoa(file);
      setRes(kind === 'phases' ? parsePhases(aoa, file.name) : parseCosts(aoa, file.name, period));
      setMode(kind === 'phases' ? 'replace' : 'merge');
    } catch {
      setRes({ kind, rows: [], months: [], issues: [{ row: 0, level: 'error', msg: 'Không đọc được file — chọn file Excel (.xlsx, .xls) hoặc .csv.' }], file: file.name } as Parsed);
    }
  };
  const errors = res?.issues.filter((x) => x.level === 'error') || [];
  const warns = res?.issues.filter((x) => x.level === 'warn') || [];
  const apply = () => {
    if (!res?.rows.length) return;
    if (res.kind === 'phases') onApplyPhases?.(mode === 'replace' ? res.rows : [...phases.filter((p) => p.name || p.sx || p.kd), ...res.rows]);
    else if (mode === 'replace') onApplyCosts?.(res.rows);
    else {
      // Cập nhật theo Nhóm + Khoản mục: khớp ⇒ thay số tháng (giữ file đính kèm, giữ kết quả đầu ra nếu file để trống); không khớp ⇒ thêm mới
      const key = (c: PakdCost) => `${c.group}|${norm(c.item)}`;
      const map = new Map<string, PakdCost>(res.rows.map((c) => [key(c), c]));
      const next = costs.map((c) => {
        const n = map.get(key(c));
        if (!n) return c;
        map.delete(key(c));
        return { ...c, amounts: n.amounts, output: n.output || c.output };
      });
      onApplyCosts?.([...next, ...map.values()]);
    }
    setRes(null);
  };
  const matched = res?.kind === 'costs' ? res.rows.filter((r) => costs.some((c) => c.group === r.group && norm(c.item) === norm(r.item))).length : 0;

  return (
    <>
      <span className="inline-flex items-center gap-1.5">
        <Btn icon={Download} className="h-7" onClick={() => downloadTemplate(kind, phases, costs, period, code)} title="Tải file Excel mẫu (kèm dữ liệu đang có)" data-testid={`pakd-tpl-${kind}`}>
          File mẫu
        </Btn>
        <Btn icon={Upload} className="h-7" onClick={() => inp.current?.click()} data-testid={`pakd-import-${kind}`}>
          Import Excel
        </Btn>
        <input
          ref={inp}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            void pick(e.target.files?.[0]);
            e.target.value = '';
          }}
          data-testid={`pakd-file-${kind}`}
        />
      </span>
      <Modal
        open={!!res}
        onClose={() => setRes(null)}
        width="max-w-4xl"
        title={
          <span className="inline-flex items-center gap-2">
            <FileSpreadsheet size={16} /> Import {kind === 'phases' ? '3. Mốc kế hoạch và mục tiêu' : '4. Kế hoạch chi phí theo tháng'} — {res?.file}
          </span>
        }
        footer={
          <>
            <Btn onClick={() => setRes(null)}>Huỷ</Btn>
            <Btn variant="primary" icon={CheckCircle2} disabled={!res?.rows.length} onClick={apply} data-testid="pakd-import-apply">
              Áp dụng {res?.rows.length || 0} dòng
            </Btn>
          </>
        }
      >
        {res && (
          <div className="space-y-3" data-testid="pakd-import-preview">
            <div className="flex flex-wrap gap-2 text-[12.5px]">
              <span className="px-2 py-1 rounded-[3px] bg-emerald-50 border border-emerald-200 text-emerald-800">
                Hợp lệ: <b>{res.rows.length}</b> dòng
              </span>
              {errors.length > 0 && (
                <span className="px-2 py-1 rounded-[3px] bg-rose-50 border border-rose-200 text-rose-700">
                  Lỗi: <b>{errors.length}</b>
                </span>
              )}
              {warns.length > 0 && (
                <span className="px-2 py-1 rounded-[3px] bg-amber-50 border border-amber-200 text-amber-800">
                  Lưu ý: <b>{warns.length}</b>
                </span>
              )}
              {res.kind === 'costs' && (
                <span className="px-2 py-1 rounded-[3px] bg-slate-50 border border-slate-200 text-slate-600">
                  {res.months.length} cột tháng ({my(res.months[0])} – {my(res.months[res.months.length - 1])})
                </span>
              )}
            </div>
            {res.issues.length > 0 && (
              <ul className="max-h-36 overflow-auto border border-slate-200 rounded-[3px] divide-y divide-slate-100 text-[12px]">
                {res.issues.map((x, i) => (
                  <li key={i} className={`flex items-start gap-1.5 px-2.5 py-1 ${x.level === 'error' ? 'text-rose-700' : 'text-amber-800'}`}>
                    <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                    {x.row > 0 && <b className="shrink-0">Dòng {x.row}:</b>} {x.msg}
                  </li>
                ))}
              </ul>
            )}
            {res.rows.length > 0 && (
              <div className="max-h-[300px] overflow-auto border border-slate-200 rounded-[3px]">
                {res.kind === 'phases' ? (
                  <table className={erp.table}>
                    <thead className="sticky top-0">
                      <tr>
                        {['TT', 'Giai đoạn', 'Từ', 'Đến', 'Sản xuất', 'Kinh doanh', 'Tổng', 'Kết quả đầu ra'].map((h, i) => (
                          <th key={h} className={`${erp.th} border-t-0 ${i >= 4 && i <= 6 ? 'text-right' : 'text-left'}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {res.rows.map((p, i) => (
                        <tr key={p.id} className={erp.tr}>
                          <td className={`${erp.td} text-center text-slate-500`}>{i + 1}</td>
                          <td className={erp.td}>{p.name}</td>
                          <td className={erp.td}>{my(p.from)}</td>
                          <td className={erp.td}>{my(p.to)}</td>
                          <td className={`${erp.td} ${erp.num}`}>{money(p.sx)}</td>
                          <td className={`${erp.td} ${erp.num}`}>{money(p.kd)}</td>
                          <td className={`${erp.td} ${erp.num} font-semibold`}>{money(p.sx + p.kd)}</td>
                          <td className={erp.td}>{p.output}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className={erp.table}>
                    <thead className="sticky top-0">
                      <tr>
                        {['Nhóm chi phí', 'Khoản mục', 'Số tháng có chi', 'Tháng đầu – cuối', 'Tổng (VNĐ)', 'Kết quả đầu ra'].map((h, i) => (
                          <th key={h} className={`${erp.th} border-t-0 ${i === 4 ? 'text-right' : 'text-left'}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {res.rows.map((c) => {
                        const ms = Object.keys(c.amounts).sort();
                        const hit = costs.some((x) => x.group === c.group && norm(x.item) === norm(c.item));
                        return (
                          <tr key={c.id} className={erp.tr}>
                            <td className={erp.td}>{c.group}</td>
                            <td className={erp.td}>
                              {c.item}
                              {mode === 'merge' && <span className={`ml-1.5 text-[11px] ${hit ? 'text-[#1f5fa8]' : 'text-emerald-700'}`}>{hit ? '· cập nhật' : '· thêm mới'}</span>}
                            </td>
                            <td className={`${erp.td} text-center`}>{ms.length}</td>
                            <td className={erp.td}>{ms.length ? `${my(ms[0])} – ${my(ms[ms.length - 1])}` : '—'}</td>
                            <td className={`${erp.td} ${erp.num} font-semibold`}>{money(costTotal(c))}</td>
                            <td className={erp.td}>{c.output}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className={erp.totalRow}>
                        <td colSpan={4} className={erp.td}>
                          Tổng chi phí import
                        </td>
                        <td className={`${erp.td} ${erp.num}`}>{money(res.rows.reduce((s, c) => s + costTotal(c), 0))}</td>
                        <td className={erp.td} />
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>
            )}
            {res.rows.length > 0 && (
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[12.5px]">
                <span className="font-semibold text-slate-700">Cách áp dụng:</span>
                {(res.kind === 'phases'
                  ? ([
                      ['replace', 'Thay thế toàn bộ mục 3'],
                      ['merge', 'Thêm vào sau các dòng đang có'],
                    ] as const)
                  : ([
                      ['merge', `Cập nhật theo Nhóm + Khoản mục (${matched} cập nhật, ${res.rows.length - matched} thêm mới; khoản mục khác giữ nguyên)`],
                      ['replace', 'Thay thế toàn bộ mục 4'],
                    ] as const)
                ).map(([k, l]) => (
                  <label key={k} className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input type="radio" checked={mode === k} onChange={() => setMode(k)} className="accent-[#1f5fa8]" data-testid={`pakd-mode-${k}`} />
                    {l}
                  </label>
                ))}
                {mode === 'replace' && <span className="w-full text-[11.5px] text-amber-700">Thay thế sẽ xoá các dòng hiện có (kể cả file đính kèm của các dòng đó).</span>}
              </div>
            )}
            <p className="text-[11.5px] text-slate-500">Áp dụng chỉ đổi dữ liệu trên form — bấm Lưu nháp hoặc Gửi duyệt để lưu PAKD.</p>
          </div>
        )}
      </Modal>
    </>
  );
};
