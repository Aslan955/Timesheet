/**
 * Ô nhập / hiển thị giá trị theo loại trường của quy trình — dùng thiết lập chi tiết (cfg) của từng trường:
 * kiểu số, loại tiền, kiểu thời gian, tỉnh/phường, chọn một/nhiều, bảng nhiều cột, công thức tự tính, công việc con,
 * dữ liệu lượt chạy, dữ liệu kết nối, mã số tự sinh…
 */
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Paperclip, PenLine, Plus, RotateCcw, Search, Trash2, X } from 'lucide-react';
import { erp } from '../erp/Erp';
import { soThanhChu } from '../contracts/docx';
import {
  CATALOGS, CURRENCIES, POSITIONS, PROC_PEOPLE, PROC_UNITS, PROVINCES, RUN_SOURCES, WARDS, cfgOf, fieldTypeOf, type ColType, type ProcField, type TableCol,
} from './processStore';
import { evalFormula, fmtNumber, roundBy } from './formula';
import type { FieldValue, ProcRequest } from './requestStore';

export type Row = Record<string, string | number>;
export type TableVal = { rows: Row[] };
/** Ngữ cảnh biểu mẫu: tất cả trường + giá trị (để tính công thức, trường phụ thuộc, dữ liệu lượt chạy…). */
export interface FormCtx {
  fields: ProcField[];
  values: Record<string, FieldValue>;
  set?: (key: string, v: FieldValue) => void;
  req?: Pick<ProcRequest, 'code' | 'creator' | 'createdAt' | 'submittedAt' | 'processName' | 'version'> & { unit?: string };
  linked?: ProcRequest[];
}

const money0 = (n: number) => (n ? Math.round(n).toLocaleString('en-US') : '0');
const toNum = (v: unknown) => (typeof v === 'number' ? v : v === '' || v === null || v === undefined ? NaN : Number(String(v).replace(/,/g, '')));
const dmy = (s: string) => {
  if (!s) return '';
  if (/^\d{4}-\d{2}$/.test(s)) return `${s.slice(5, 7)}/${s.slice(0, 4)}`;
  const t = s.length > 10 ? ` ${s.slice(11, 16)}` : '';
  return `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}${t}`;
};
const todayIso = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};
const colsOf = (f: ProcField) => cfgOf(f).columns || [];
const isNumCol = (t: ColType) => t === 'decimal' || t === 'integer' || t === 'percent' || t === 'currency';
export const curKey = (fid: string) => `${fid}__cur`;
export const fmlKey = (fid: string) => `${fid}__edited`;

// ==========================================================================
// Giá trị số (cho công thức)
// ==========================================================================
export const tableTotal = (f: ProcField, v: FieldValue) => {
  const col = colsOf(f).find((c) => c.sum && isNumCol(c.type)) || colsOf(f).find((c) => isNumCol(c.type));
  if (!col) return 0;
  return ((v as TableVal)?.rows || []).reduce((s, r) => s + (Number(r[col.id]) || 0), 0);
};
export const numericOf = (f: ProcField, ctx: FormCtx, depth = 0): number | null => {
  const v = ctx.values[f.id];
  if (f.type === 'formula') return formulaValue(f, ctx, depth + 1);
  if (f.type === 'table') return tableTotal(f, v);
  const n = toNum(v);
  return isNaN(n) ? 0 : n;
};
export const formulaValue = (f: ProcField, ctx: FormCtx, depth = 0): number | null => {
  const c = cfgOf(f);
  if (c.editable && ctx.values[fmlKey(f.id)] && ctx.values[f.id] !== '' && ctx.values[f.id] !== undefined) return toNum(ctx.values[f.id]);
  if (!c.expr || depth > 8) return null;
  try {
    const v = evalFormula(c.expr, (name) => {
      const ref = ctx.fields.find((x) => x.label.trim() === name);
      return ref ? numericOf(ref, ctx, depth) ?? 0 : null;
    });
    return roundBy(v, c.rounding, c.returnKind === 'integer' ? 0 : c.returnKind === 'currency' ? 0 : c.decimals ?? 2);
  } catch {
    return null;
  }
};
export const formulaError = (f: ProcField, fields: ProcField[]) => {
  const c = cfgOf(f);
  try {
    evalFormula(c.expr || '', (name) => (fields.some((x) => x.label.trim() === name && x.id !== f.id) ? 1 : null));
    return '';
  } catch (e) {
    return (e as Error).message === 'Chia cho 0' ? '' : (e as Error).message;
  }
};

// ==========================================================================
// Kiểm tra giá trị
// ==========================================================================
export const isEmpty = (f: ProcField, v: FieldValue) => {
  if (['autoCode', 'formula', 'runData'].includes(f.type)) return false;
  if (v === null || v === undefined || v === '') return true;
  if (Array.isArray(v)) return !v.length;
  if (typeof v === 'object') return !(v as TableVal).rows?.some((r) => Object.values(r).some((x) => x !== '' && x !== 0 && x !== undefined));
  return false;
};
/** Lỗi của 1 trường (bắt buộc, độ dài, email, giới hạn số, ngày, cột bắt buộc trong bảng, công việc con). */
export const fieldError = (f: ProcField, v: FieldValue): string => {
  const c = cfgOf(f);
  if (f.type === 'subtask') {
    const done = (v as string[]) || [];
    if (f.required && c.requireAll && done.length < (c.tasks || []).length) return 'Cần hoàn thành toàn bộ công việc con';
    if (f.required && !done.length) return 'Chưa hoàn thành công việc nào';
    return '';
  }
  if (f.required && isEmpty(f, v)) return 'Không được để trống';
  if (isEmpty(f, v)) return '';
  if ((f.type === 'text' || f.type === 'textarea') && c.maxLength && String(v).length > c.maxLength) return `Tối đa ${c.maxLength} ký tự`;
  if (f.type === 'text' && c.format === 'phone' && !/^\+?[\d\s.]{8,15}$/.test(String(v))) return 'Số điện thoại không hợp lệ';
  if (f.type === 'email' && !String(v).split(/[;,]\s*/).every((x) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x))) return 'Email không hợp lệ';
  if (f.type === 'number') {
    const n = toNum(v);
    if (isNaN(n)) return 'Phải là số';
    if (c.numKind === 'integer' && !Number.isInteger(n)) return 'Phải là số tự nhiên';
    if (c.min !== null && c.min !== undefined && n < c.min) return `Không nhỏ hơn ${c.min}`;
    if (c.max !== null && c.max !== undefined && n > c.max) return `Không lớn hơn ${c.max}`;
  }
  if (f.type === 'datetime' && c.dateLimit && c.dateLimit !== 'none' && c.dateKind !== 'month') {
    const d = String(v).slice(0, 10);
    if (c.dateLimit === 'notPast' && d < todayIso()) return 'Không chọn ngày trong quá khứ';
    if (c.dateLimit === 'notFuture' && d > todayIso()) return 'Không chọn ngày trong tương lai';
  }
  if (f.type === 'table') {
    const rows = (v as TableVal).rows || [];
    const miss = colsOf(f).filter((col) => col.required && col.type !== 'stt' && rows.some((r) => Object.values(r).some((x) => x !== '' && x !== 0) && (r[col.id] === '' || r[col.id] === undefined)));
    if (miss.length) return `Nhập cột ${miss.map((x) => x.name).join(', ')}`;
  }
  if (f.type === 'file' && (v as string[]).length > (c.maxFiles || 99)) return `Tối đa ${c.maxFiles} tệp`;
  return '';
};
/** Trường đang ẩn vì trường phụ thuộc chưa có giá trị. */
export const hiddenByDep = (f: ProcField, ctx: FormCtx) => {
  const dep = cfgOf(f).dependsOn;
  if (!dep) return false;
  const src = ctx.fields.find((x) => x.id === dep);
  return !!src && isEmpty(src, ctx.values[dep]);
};
/** Giá trị khởi tạo khi mở biểu mẫu (giá trị mặc định, người tạo, ngày hiện tại, số dòng bảng). */
export const initialValue = (f: ProcField, creator: string): FieldValue | undefined => {
  const c = cfgOf(f);
  if (f.type === 'employee' && c.defaultCreator) return c.multiple ? [creator] : creator;
  if (f.type === 'datetime' && c.defaultToday) return c.dateKind === 'month' ? todayIso().slice(0, 7) : c.dateKind === 'datetime' ? `${todayIso()}T08:00` : todayIso();
  if (f.type === 'table') return { rows: Array.from({ length: Math.max(1, c.rowsDefault || 1) }, () => ({})) };
  if (c.defaultOn && c.defaultValue !== undefined && c.defaultValue !== '') return f.type === 'number' || f.type === 'currency' ? toNum(c.defaultValue) : c.defaultValue;
  return undefined;
};
/** Mã số tự sinh theo thiết lập: tiền tố-năm-số thứ tự. */
export const autoCodeOf = (f: ProcField, code?: string) => {
  const c = cfgOf(f);
  const seq = Number((code || '').match(/(\d+)$/)?.[1] || 1);
  return [c.prefix || 'DN', c.withYear ? String(new Date().getFullYear()) : '', String(seq).padStart(c.digits || 4, '0')].filter(Boolean).join('-');
};
const runDataOf = (f: ProcField, ctx: FormCtx) => {
  const r = ctx.req;
  if (!r) return '';
  switch (cfgOf(f).source) {
    case 'code':
      return r.code;
    case 'creator':
      return r.creator;
    case 'creatorUnit':
      return r.unit || '';
    case 'createdAt':
      return dmy(r.createdAt.slice(0, 10));
    case 'submittedAt':
      return r.submittedAt ? dmy(r.submittedAt.slice(0, 10)) : '(khi gửi đơn)';
    case 'processName':
      return r.processName;
    case 'version':
      return r.version;
    default:
      return '';
  }
};

// ==========================================================================
// Các ô chọn dùng chung
// ==========================================================================
const MultiCheck: React.FC<{ options: string[]; value: string[]; onChange: (v: string[]) => void; invalid?: boolean; placeholder?: string }> = ({ options, value, onChange, invalid, placeholder = '— Chọn —' }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const shown = options.filter((o) => !q || o.toLowerCase().includes(q.toLowerCase()));
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className={`${erp.inputFull} flex items-center gap-1 text-left cursor-pointer ${invalid ? '!border-rose-400' : ''}`}>
        <span className={`flex-1 truncate ${value.length ? '' : 'text-slate-400'}`}>{value.length ? value.join(', ') : placeholder}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>
      {open && (
        <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-300 rounded-[4px] shadow-lg">
          {options.length > 7 && (
            <div className="p-1.5 border-b border-slate-100">
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm..." className={`${erp.inputFull} h-7 text-[12px]`} />
            </div>
          )}
          <div className="max-h-56 overflow-auto py-1">
            {shown.map((o) => (
              <label key={o} className="flex items-center gap-2 px-3 py-1.5 text-[12.5px] hover:bg-[#eaf2fc] cursor-pointer">
                <input type="checkbox" className="accent-[#1f5fa8]" checked={value.includes(o)} onChange={() => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o])} />
                {o}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
const Pick: React.FC<{ options: string[]; value: FieldValue; multiple?: boolean; onChange: (v: FieldValue) => void; invalid?: boolean; placeholder?: string; radio?: boolean }> = ({ options, value, multiple, onChange, invalid, placeholder, radio }) => {
  if (radio)
    return (
      <span className={`flex flex-wrap gap-x-4 gap-y-1.5 py-1 ${invalid ? 'outline outline-1 outline-rose-300 rounded' : ''}`}>
        {options.map((o) => {
          const arr = (Array.isArray(value) ? value : []) as string[];
          const on = multiple ? arr.includes(o) : value === o;
          return (
            <label key={o} className="flex items-center gap-1.5 text-[13px] cursor-pointer">
              <input type={multiple ? 'checkbox' : 'radio'} className="accent-[#1f5fa8]" checked={on} onChange={() => onChange(multiple ? (on ? arr.filter((x) => x !== o) : [...arr, o]) : o)} />
              {o}
            </label>
          );
        })}
      </span>
    );
  if (multiple) return <MultiCheck options={options} value={(Array.isArray(value) ? value : []) as string[]} onChange={onChange} invalid={invalid} placeholder={placeholder} />;
  return (
    <select value={(value as string) || ''} onChange={(e) => onChange(e.target.value)} className={`${erp.inputFull} ${invalid ? '!border-rose-400' : ''}`}>
      <option value="">{placeholder || '— Chọn —'}</option>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
};
/** Chọn loại tiền (tìm kiếm, bảng Ký hiệu · Tên loại tiền). */
export const CurrencyPick: React.FC<{ value: string; onChange: (v: string) => void; disabled?: boolean }> = ({ value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const shown = CURRENCIES.filter((c) => !q || `${c.code} ${c.name}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div ref={ref} className="relative inline-block">
      <button type="button" disabled={disabled} onClick={() => setOpen((o) => !o)} className={`${erp.input} w-[84px] flex items-center justify-between font-semibold cursor-pointer disabled:cursor-default`} title={CURRENCIES.find((c) => c.code === value)?.name}>
        {value} {!disabled && <ChevronDown size={13} className="text-slate-400" />}
      </button>
      {open && (
        <div className="absolute z-40 left-0 mt-1 w-[340px] bg-white border border-slate-300 rounded-[6px] shadow-xl p-2" data-testid="currency-pick">
          <div className="relative mb-1.5">
            <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm kiếm loại tiền" className={`${erp.inputFull} pl-7`} />
          </div>
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-2 py-1 font-semibold w-16">Ký hiệu</th>
                <th className="px-2 py-1 font-semibold">Tên loại tiền</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((c) => (
                <tr key={c.code} onClick={() => (onChange(c.code), setOpen(false))} className={`cursor-pointer hover:bg-[#eaf2fc] ${c.code === value ? 'bg-[#eaf2fc] text-[#1f5fa8] font-semibold' : ''}`}>
                  <td className="px-2 py-1.5">{c.code}</td>
                  <td className="px-2 py-1.5">{c.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ==========================================================================
// Ô của bảng
// ==========================================================================
const CellInput: React.FC<{ col: TableCol; v: string | number | undefined; onChange: (v: string | number) => void; idx: number }> = ({ col, v, onChange, idx }) => {
  const cls = `${erp.inputFull} h-7 border-transparent`;
  switch (col.type) {
    case 'stt':
      return <span className="block text-center text-slate-500">{idx + 1}</span>;
    case 'textarea':
      return <textarea rows={1} value={(v as string) || ''} onChange={(e) => onChange(e.target.value)} className="w-full border border-transparent rounded-[3px] px-2 py-1 text-[12.5px] outline-none focus:border-[#1f5fa8] resize-y" />;
    case 'select':
      return (
        <select value={(v as string) || ''} onChange={(e) => onChange(e.target.value)} className={cls}>
          <option value="" />
          {(col.options || []).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
    case 'date':
      return <input type="date" value={(v as string) || ''} onChange={(e) => onChange(e.target.value)} className={cls} />;
    case 'month':
      return <input type="month" value={(v as string) || ''} onChange={(e) => onChange(e.target.value)} className={cls} />;
    case 'datetime':
      return <input type="datetime-local" value={(v as string) || ''} onChange={(e) => onChange(e.target.value)} className={cls} />;
    case 'address':
      return (
        <select value={(v as string) || ''} onChange={(e) => onChange(e.target.value)} className={cls}>
          <option value="" />
          {PROVINCES.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      );
    case 'decimal':
    case 'integer':
    case 'percent':
      return <input type="number" step={col.type === 'integer' ? 1 : 'any'} value={v === undefined ? '' : v} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} className={`${cls} text-right`} />;
    case 'currency':
      return (
        <input
          value={v === undefined || v === '' ? '' : money0(Number(v))}
          onChange={(e) => {
            const d = e.target.value.replace(/[^\d]/g, '');
            onChange(d ? Number(d) : '');
          }}
          inputMode="numeric"
          className={`${cls} text-right tabular-nums`}
        />
      );
    default:
      return <input value={(v as string) || ''} onChange={(e) => onChange(e.target.value)} className={cls} />;
  }
};
const cellView = (col: TableCol, v: unknown, idx: number) => {
  if (col.type === 'stt') return idx + 1;
  if (v === '' || v === undefined || v === null) return '';
  if (col.type === 'currency') return money0(Number(v));
  if (col.type === 'percent') return `${v}%`;
  if (col.type === 'decimal' || col.type === 'integer') return Number(v).toLocaleString('en-US');
  if (col.type === 'date' || col.type === 'month' || col.type === 'datetime') return dmy(String(v));
  return String(v);
};
const TableEditor: React.FC<{ f: ProcField; v: FieldValue; onChange: (v: FieldValue) => void; invalid?: boolean; readOnly?: boolean }> = ({ f, v, onChange, invalid, readOnly }) => {
  const c = cfgOf(f);
  const cols = c.columns || [];
  const rows = (v as TableVal)?.rows?.length ? (v as TableVal).rows : readOnly ? [] : [{}];
  const setCell = (i: number, col: string, x: string | number) => onChange({ rows: rows.map((r, k) => (k === i ? { ...r, [col]: x } : r)) });
  const sums = cols.filter((col) => col.sum && isNumCol(col.type));
  const editable = !readOnly && c.allowAddRows !== false;
  // ô ghi chữ "Tổng cộng": cột đầu tiên không phải STT / cột tổng (cột 0 dành cho nút Thêm dòng khi được sửa)
  const labelAt = cols.findIndex((col, k) => !(editable && k === 0) && col.type !== 'stt' && !col.sum);
  return (
    <div className="overflow-x-auto">
      <table className={`${erp.table} ${invalid ? 'outline outline-1 outline-rose-400' : ''}`}>
        <thead>
          <tr>
            {cols.map((col) => (
              <th key={col.id} className={`${erp.th} ${col.type === 'stt' ? 'w-10 text-center' : isNumCol(col.type) ? 'text-right min-w-[120px]' : 'text-left min-w-[140px]'}`}>
                {col.name}
                {col.required && col.type !== 'stt' && !readOnly && <span className="text-rose-600"> *</span>}
                {col.type === 'currency' && <span className="font-normal text-slate-500"> (VNĐ)</span>}
              </th>
            ))}
            {!readOnly && c.allowAddRows !== false && <th className={`${erp.th} w-8`} />}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {cols.map((col) =>
                readOnly ? (
                  <td key={col.id} className={`${erp.td} ${col.type === 'stt' ? 'text-center' : isNumCol(col.type) ? erp.num : ''}`}>
                    {cellView(col, r[col.id], i)}
                  </td>
                ) : (
                  <td key={col.id} className={`${erp.td} p-0.5`}>
                    <CellInput col={col} v={r[col.id]} onChange={(x) => setCell(i, col.id, x)} idx={i} />
                  </td>
                ),
              )}
              {!readOnly && c.allowAddRows !== false && (
                <td className={`${erp.td} text-center`}>
                  <button type="button" disabled={rows.length === 1} onClick={() => onChange({ rows: rows.filter((_, k) => k !== i) })} className="p-0.5 text-rose-500 disabled:opacity-30 cursor-pointer" title="Xoá dòng">
                    <Trash2 size={13} />
                  </button>
                </td>
              )}
            </tr>
          ))}
          {(sums.length > 0 || (!readOnly && c.allowAddRows !== false)) && (
            <tr className={erp.totalRow}>
              {cols.map((col, k) => (
                <td key={col.id} className={`${erp.td} ${isNumCol(col.type) ? erp.num : ''}`}>
                  {k === 0 && !readOnly && c.allowAddRows !== false ? (
                    <button type="button" onClick={() => onChange({ rows: [...rows, {}] })} className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1f5fa8] hover:underline cursor-pointer whitespace-nowrap">
                      <Plus size={12} /> Thêm dòng
                    </button>
                  ) : k === labelAt ? (
                    sums.length ? 'Tổng cộng' : ''
                  ) : col.sum && isNumCol(col.type) ? (
                    cellView(col, rows.reduce((s, r) => s + (Number(r[col.id]) || 0), 0), 0)
                  ) : (
                    ''
                  )}
                </td>
              ))}
              {!readOnly && c.allowAddRows !== false && <td className={erp.td} />}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// ==========================================================================
// Hiển thị (chỉ đọc)
// ==========================================================================
export const FieldView: React.FC<{ f: ProcField; v: FieldValue; ctx?: FormCtx }> = ({ f, v, ctx }) => {
  const c = cfgOf(f);
  const dash = <span className="text-slate-400">—</span>;
  switch (f.type) {
    case 'autoCode':
      return <span className={erp.code}>{(v as string) || autoCodeOf(f, ctx?.req?.code)}</span>;
    case 'runData':
      return <span>{(v as string) || (ctx ? runDataOf(f, ctx) : '') || '—'}</span>;
    case 'formula': {
      const n = ctx ? formulaValue(f, ctx) : toNum(v);
      if (n === null || isNaN(n)) return dash;
      return (
        <span>
          <b className="tabular-nums">{fmtNumber(n, c.returnKind, c.decimals)}</b>
          {c.showWords && c.returnKind === 'currency' && <span className="block text-[11.5px] italic text-slate-500">({soThanhChu(n)})</span>}
        </span>
      );
    }
    case 'subtask': {
      const done = (v as string[]) || [];
      return (
        <span className="block space-y-0.5">
          {(c.tasks || []).map((t) => (
            <span key={t} className={`block text-[12.5px] ${done.includes(t) ? 'text-emerald-700' : 'text-slate-500'}`}>
              {done.includes(t) ? '☑' : '☐'} {t}
            </span>
          ))}
        </span>
      );
    }
  }
  if (isEmpty(f, v)) return dash;
  switch (f.type) {
    case 'currency': {
      const cur = (ctx?.values[curKey(f.id)] as string) || c.currency || 'VND';
      const n = toNum(v);
      return (
        <span>
          <b className="tabular-nums">{fmtNumber(n, 'currency', 2, cur)}</b>
          {c.showWords && cur === 'VND' && <span className="block text-[11.5px] italic text-slate-500">({soThanhChu(n)})</span>}
        </span>
      );
    }
    case 'number':
      return <span className="tabular-nums">{fmtNumber(toNum(v), c.numKind, c.decimals)}</span>;
    case 'datetime':
      return <span>{dmy(String(v))}</span>;
    case 'file':
      return (
        <span className="flex flex-wrap gap-1">
          {(v as string[]).map((n) => (
            <span key={n} className="inline-flex items-center gap-1 rounded-[3px] border border-slate-200 bg-slate-50 px-1.5 text-[12px]">
              <Paperclip size={11} /> {n}
            </span>
          ))}
        </span>
      );
    case 'table':
      return <TableEditor f={f} v={v} onChange={() => {}} readOnly />;
    case 'linkedData': {
      const r = ctx?.linked?.find((x) => x.id === v);
      return <span>{r ? `${r.code} — ${r.title}` : String(v)}</span>;
    }
    default:
      return <span className="whitespace-pre-wrap break-words">{Array.isArray(v) ? v.join(', ') : String(v)}</span>;
  }
};

// ==========================================================================
// Ô nhập
// ==========================================================================
export const FieldInput: React.FC<{ f: ProcField; v: FieldValue; onChange: (v: FieldValue) => void; ctx?: FormCtx; invalid?: boolean }> = ({ f, v, onChange, ctx, invalid }) => {
  const c = cfgOf(f);
  const cls = `${erp.inputFull} ${invalid ? '!border-rose-400 ring-2 ring-rose-100' : ''}`;
  const ph = f.hint || `Nhập ${f.label.toLowerCase()}`;
  switch (f.type) {
    case 'text':
      return (
        <input
          value={(v as string) || ''}
          maxLength={c.maxLength || undefined}
          onChange={(e) => onChange(c.format === 'digits' ? e.target.value.replace(/\D/g, '') : e.target.value)}
          placeholder={ph}
          inputMode={c.format === 'digits' || c.format === 'phone' ? 'numeric' : undefined}
          className={cls}
        />
      );
    case 'textarea':
      return (
        <span className="block">
          <textarea
            rows={3}
            value={(v as string) || ''}
            maxLength={c.maxLength || undefined}
            onChange={(e) => onChange(e.target.value)}
            placeholder={ph}
            className={`w-full border border-slate-300 rounded-[3px] px-2 py-1.5 text-[13px] outline-none focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#1f5fa8]/15 ${invalid ? '!border-rose-400' : ''}`}
          />
          {c.maxLength ? <span className="block text-right text-[11px] text-slate-400">{String(v || '').length}/{c.maxLength}</span> : null}
        </span>
      );
    case 'select':
      return <Pick options={f.options || []} value={v} multiple={c.multiple} onChange={onChange} invalid={invalid} radio={c.display === 'radio'} />;
    case 'datetime': {
      const t = c.dateKind === 'month' ? 'month' : c.dateKind === 'datetime' ? 'datetime-local' : 'date';
      const lim = c.dateKind === 'month' ? todayIso().slice(0, 7) : c.dateKind === 'datetime' ? `${todayIso()}T00:00` : todayIso();
      return (
        <input
          type={t}
          value={(v as string) || ''}
          min={c.dateLimit === 'notPast' ? lim : undefined}
          max={c.dateLimit === 'notFuture' ? lim : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`${cls} max-w-[240px]`}
        />
      );
    }
    case 'address': {
      if (c.addrKind !== 'ward') return <Pick options={PROVINCES} value={v} multiple={c.multiple} onChange={onChange} invalid={invalid} placeholder="— Chọn tỉnh / thành phố —" />;
      const prov = (ctx?.values[`${f.id}__prov`] as string) || '';
      const wards = WARDS[prov] || [];
      return (
        <span className="grid grid-cols-2 gap-2">
          <select value={prov} onChange={(e) => (ctx?.set?.(`${f.id}__prov`, e.target.value), onChange(c.multiple ? [] : ''))} className={cls}>
            <option value="">— Tỉnh / thành phố —</option>
            {PROVINCES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {prov && !wards.length ? (
            <input value={(v as string) || ''} onChange={(e) => onChange(e.target.value)} placeholder="Nhập phường / xã" className={cls} />
          ) : (
            <Pick options={wards.map((w) => `${w}, ${prov}`)} value={v} multiple={c.multiple} onChange={onChange} invalid={invalid} placeholder="— Phường / xã —" />
          )}
        </span>
      );
    }
    case 'number': {
      if (c.numSource === 'list')
        return (
          <select value={v === '' || v === undefined || v === null ? '' : String(v)} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} className={`${cls} max-w-[240px]`}>
            <option value="">— Chọn —</option>
            {(c.numOptions || []).map((o) => (
              <option key={o} value={o}>
                {fmtNumber(o, c.numKind, c.decimals)}
              </option>
            ))}
          </select>
        );
      return (
        <span className="flex items-center gap-2">
          <input
            type="number"
            step={c.numKind === 'integer' ? 1 : 'any'}
            min={c.min ?? undefined}
            max={c.max ?? undefined}
            value={v === null || v === undefined ? '' : String(v)}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder={ph}
            className={`${cls} max-w-[220px] text-right`}
          />
          {c.numKind === 'percent' && <span className="text-[13px] text-slate-500">%</span>}
        </span>
      );
    }
    case 'currency': {
      const n = toNum(v);
      const cur = (ctx?.values[curKey(f.id)] as string) || c.currency || 'VND';
      return (
        <span className="block">
          <span className="flex items-center gap-2">
            <input
              value={v === '' || v === null || v === undefined ? '' : money0(n)}
              onChange={(e) => {
                const d = e.target.value.replace(/[^\d]/g, '');
                onChange(d ? Number(d) : '');
              }}
              placeholder={f.hint || '0'}
              inputMode="numeric"
              className={`${cls} max-w-[220px] text-right tabular-nums`}
            />
            <CurrencyPick value={cur} onChange={(x) => ctx?.set?.(curKey(f.id), x)} disabled={!c.allowCurrencyChoice} />
          </span>
          {c.showWords && cur === 'VND' && n > 0 && <span className="block text-[11.5px] italic text-slate-500 mt-0.5">Bằng chữ: {soThanhChu(n)}</span>}
        </span>
      );
    }
    case 'employee':
      return <Pick options={PROC_PEOPLE} value={v} multiple={c.multiple} onChange={onChange} invalid={invalid} placeholder="— Chọn nhân viên —" />;
    case 'position':
      return <Pick options={POSITIONS} value={v} multiple={c.multiple} onChange={onChange} invalid={invalid} placeholder="— Chọn vị trí công việc —" />;
    case 'org':
      return <Pick options={PROC_UNITS} value={v} multiple={c.multiple} onChange={onChange} invalid={invalid} placeholder="— Chọn phòng ban / khối —" />;
    case 'catalog':
      return <Pick options={CATALOGS[c.catalog || ''] || []} value={v} multiple={c.multiple} onChange={onChange} invalid={invalid} placeholder={`— Chọn ${(c.catalog || 'danh mục').toLowerCase()} —`} />;
    case 'email':
      return <input type="text" value={(v as string) || ''} onChange={(e) => onChange(e.target.value)} placeholder={f.hint || 'ten@congty.vn (nhiều email cách nhau bằng dấu ;)'} className={cls} />;
    case 'file': {
      const files = (v as string[]) || [];
      return (
        <span className="block">
          <span className="flex flex-wrap items-center gap-1.5">
            {files.map((n) => (
              <span key={n} className="inline-flex items-center gap-1 rounded-[3px] border border-slate-200 bg-slate-50 pl-1.5 pr-0.5 text-[12px]">
                <Paperclip size={11} /> {n}
                <button type="button" onClick={() => onChange(files.filter((x) => x !== n))} className="p-0.5 rounded hover:bg-white cursor-pointer" title="Bỏ tệp">
                  <X size={11} />
                </button>
              </span>
            ))}
            {files.length < (c.maxFiles || 99) && (
              <label className={`inline-flex items-center gap-1 h-7 px-2.5 rounded-[3px] border text-[12px] font-semibold cursor-pointer ${invalid ? 'border-rose-400 text-rose-600' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                <Paperclip size={12} /> Đính kèm tệp
                <input type="file" multiple accept={c.accept || undefined} className="hidden" onChange={(e) => (onChange([...files, ...[...(e.target.files || [])].map((x) => x.name)].slice(0, c.maxFiles || 99)), (e.target.value = ''))} />
              </label>
            )}
          </span>
          <span className="block text-[11px] text-slate-400 mt-0.5">
            {c.accept ? `Định dạng: ${c.accept} · ` : ''}Tối đa {c.maxFiles || 'không giới hạn'} tệp
            {c.mergeTemplate ? ` · Tự trộn & đính kèm mẫu in "${c.mergeTemplate}" khi gửi` : ''}
            {c.signers?.length ? ` · Trình ký: ${c.signers.join(' → ')}` : ''}
          </span>
        </span>
      );
    }
    case 'subtask': {
      const done = (v as string[]) || [];
      return (
        <span className={`block space-y-1 ${invalid ? 'outline outline-1 outline-rose-300 rounded p-1' : ''}`}>
          {(c.tasks || []).map((t) => (
            <label key={t} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" className="accent-[#0f8f6c]" checked={done.includes(t)} onChange={() => onChange(done.includes(t) ? done.filter((x) => x !== t) : [...done, t])} />
              <span className={done.includes(t) ? 'line-through text-slate-400' : ''}>{t}</span>
            </label>
          ))}
          <span className="block text-[11px] text-slate-400">
            Đã xong {done.length}/{(c.tasks || []).length}
            {c.requireAll ? ' · bắt buộc hoàn thành toàn bộ' : ''}
          </span>
        </span>
      );
    }
    case 'table':
      return <TableEditor f={f} v={v} onChange={onChange} invalid={invalid} />;
    case 'autoCode':
      return <span className={`${erp.code} inline-block py-1.5`}>{autoCodeOf(f, ctx?.req?.code)}</span>;
    case 'runData':
      return <span className="inline-block py-1.5 text-slate-700">{ctx ? runDataOf(f, ctx) : '—'}</span>;
    case 'formula': {
      const n = ctx ? formulaValue(f, { ...ctx, values: { ...ctx.values, [fmlKey(f.id)]: '' } }) : null;
      const edited = !!ctx?.values[fmlKey(f.id)];
      const shown = edited ? toNum(v) : n;
      if (c.editable)
        return (
          <span className="block">
            <span className="flex items-center gap-2">
              <input
                value={shown === null || isNaN(shown as number) ? '' : String(shown)}
                onChange={(e) => (ctx?.set?.(fmlKey(f.id), '1'), onChange(e.target.value === '' ? '' : Number(e.target.value.replace(/,/g, ''))))}
                className={`${cls} max-w-[220px] text-right tabular-nums`}
              />
              {edited ? (
                <button type="button" onClick={() => (ctx?.set?.(fmlKey(f.id), ''), onChange(''))} className="text-[12px] text-[#1f5fa8] hover:underline inline-flex items-center gap-1 cursor-pointer" title="Tính lại theo công thức">
                  <RotateCcw size={12} /> Tự tính
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
                  <PenLine size={11} /> tự tính, sửa được
                </span>
              )}
            </span>
            <span className="block text-[11px] text-slate-400">= {c.expr}</span>
          </span>
        );
      return (
        <span className="block py-1">
          <b className="tabular-nums">{n === null ? '—' : fmtNumber(n, c.returnKind, c.decimals)}</b>
          {c.showWords && c.returnKind === 'currency' && n ? <span className="block text-[11.5px] italic text-slate-500">Bằng chữ: {soThanhChu(n)}</span> : null}
          <span className="block text-[11px] text-slate-400">Tự tính = {c.expr || '(chưa thiết lập công thức)'}</span>
        </span>
      );
    }
    case 'linkedData': {
      const src = (ctx?.linked || []).filter((r) => r.processCode === c.linkProcess && r.status === 'approved');
      return (
        <select value={(v as string) || ''} onChange={(e) => onChange(e.target.value)} className={cls}>
          <option value="">{c.linkProcess ? `— Chọn đơn đã duyệt (${src.length}) —` : '— Chưa thiết lập quy trình nguồn —'}</option>
          {src.map((r) => (
            <option key={r.id} value={r.id}>
              {r.code} — {r.title}
            </option>
          ))}
        </select>
      );
    }
    default:
      return <span className="text-slate-400 text-[12px]">{fieldTypeOf(f.type).label}</span>;
  }
};
