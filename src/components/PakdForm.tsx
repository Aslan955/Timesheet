/**
 * PakdForm — "Lập phương án kinh doanh (PAKD)" trên màn chi tiết dự án.
 * Hiện sau khi GĐK duyệt mã. AM / GĐK nhập trong PAKD_DAYS ngày kể từ ngày cấp mã,
 * lưu nháp hoặc gửi Kế toán (CFO) duyệt. Bố cục theo 2 sheet của file Excel mẫu:
 *   1. Thông tin dự án = 1.1 Thông tin hợp đồng dự kiến (luôn hiện: thời điểm ký, giá trị, xác suất, phạm vi, rủi ro)
 *                      + 1.2 Thông tin hợp đồng thực tế (tình trạng; số HĐ, ngày ký, giá trị — mở khi "Đã ký")
 *   Tình trạng = "Đã ký"  → 2. Tiến độ thực hiện · 3. Nghiệm thu & thu tiền · 4. Chi phí theo tháng
 *   Tình trạng = "Chưa ký" → 3. Mốc kế hoạch & mục tiêu
 * Dữ liệu & công thức: src/business/pakd.ts
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, AlertTriangle, BarChart3, ClipboardList, Divide, FileText, Info, Paperclip, Pencil, Plus, Save, Send, X } from 'lucide-react';
import { BizProject, BizRole, PAKD_DAYS, canAdjustPakd, canLapPakd, latestPakd } from '../business/BusinessProjectContext';
import {
  COST_GROUPS,
  CostGroup,
  MAX_DEVIATION,
  MIN_MARGIN,
  PakdFormData,
  addMonths,
  cashflowSeries,
  emptyPakd,
  monthsBetween,
  msCash,
  msCashMonth,
  msValue,
  my,
  newCost,
  normalizeCost,
  costTotal,
  spreadEven,
  monthRange,
  isSxGroup,
  newMilestone,
  newPhase,
  pakdTotals,
  validatePakd,
} from '../business/pakd';
import { Btn, KpiBox, Panel, Tag, erp } from './erp/Erp';
import { MonthPickerButton } from './erp/MonthPicker';

const money = (n: number) => Math.round(n || 0).toLocaleString('en-US');

/**
 * Dự án chưa ký đã có số chi phí kế hoạch (dữ liệu cũ / import) → điền sẵn 1 mốc kế hoạch "Toàn dự án".
 * Dự án đã ký: KHÔNG điền sẵn kế hoạch chi phí theo tháng — người dùng tự nhập mục 3 và 4.
 */
const seedCosts = (p: BizProject): Partial<PakdFormData> => {
  const sx = p.plannedProductionCost || 0;
  const kd = p.plannedBusinessCost || 0;
  if ((!sx && !kd) || p.contractSigned) return {};
  const from = (p.contract?.from || p.startDate || '').slice(0, 7);
  const to = (p.contract?.to || p.endDate || '').slice(0, 7);
  return { phases: [{ ...newPhase(), name: 'Toàn dự án', from, to, sx, kd }] };
};
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const dmy = (iso?: string) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '—');
const todayIso = () => new Date().toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

// --------------------------------------------------------------------------
// Ô nhập
// --------------------------------------------------------------------------
const CELL = 'w-full h-8 px-2 bg-transparent text-[12.5px] outline-none focus:bg-[#eaf2fc] focus:ring-1 focus:ring-inset focus:ring-[#1f5fa8] disabled:text-slate-700';
const INP = `${erp.inputFull} disabled:bg-slate-50`;

/** Số tiền / số có phân cách hàng nghìn. */
const NumIn: React.FC<{ value: number; onChange: (n: number) => void; className?: string; placeholder?: string; decimals?: boolean; disabled?: boolean }> = ({
  value,
  onChange,
  className = CELL,
  placeholder = '0',
  decimals,
  disabled,
}) => (
  <input
    disabled={disabled}
    value={value ? (decimals ? String(value) : money(value)) : ''}
    onChange={(e) => onChange(Number(e.target.value.replace(decimals ? /[^\d.]/g : /[^\d]/g, '')) || 0)}
    inputMode="numeric"
    placeholder={placeholder}
    className={`${className} text-right tabular-nums`}
  />
);

/** Tháng dạng MM/YYYY (lưu YYYY-MM). */
const MonthIn: React.FC<{ value: string; onChange: (ym: string) => void; className?: string }> = ({ value, onChange, className = CELL }) => {
  const [text, setText] = useState(value ? my(value) : '');
  const [last, setLast] = useState(value);
  const [bad, setBad] = useState(false);
  if (last !== value) {
    setLast(value);
    setText(value ? my(value) : '');
  }
  const commit = () => {
    const t = text.trim();
    if (!t) return onChange(''), setBad(false);
    const m = t.match(/^(\d{1,2})\s*[/\-.]?\s*(\d{4})$/);
    const mm = m ? Number(m[1]) : 0;
    if (!m || mm < 1 || mm > 12) return setBad(true);
    setBad(false);
    const ym = `${m[2]}-${String(mm).padStart(2, '0')}`;
    setText(my(ym));
    onChange(ym);
  };
  return (
    <span className="relative block w-full">
    <input
      value={text}
      maxLength={7}
      onFocus={(e) => e.currentTarget.select()}
      onChange={(e) => {
        // Chỉ nhận số, tự chèn dấu "/" → MM/YYYY (tránh gõ thừa kiểu 01/20262)
        const d = e.target.value.replace(/\D/g, '').slice(0, 6);
        setText(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
        setBad(false);
      }}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLInputElement).blur()}
      placeholder="MM/YYYY"
      title={bad ? 'Nhập đúng dạng MM/YYYY' : 'MM/YYYY — gõ hoặc bấm biểu tượng lịch để chọn'}
      className={`${className} text-center tabular-nums pr-7 ${bad ? 'bg-rose-50 text-rose-700' : ''}`}
    />
    <MonthPickerButton
      value={value}
      onChange={(ym) => {
        setBad(false);
        setText(ym ? my(ym) : '');
        onChange(ym);
      }}
      className="absolute right-1 top-1/2 -translate-y-1/2"
    />
    </span>
  );
};

const Files: React.FC<{ files: string[]; onChange: (f: string[]) => void }> = ({ files, onChange }) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-wrap items-center gap-1 px-1.5 py-1">
      {files.map((n) => (
        <span key={n} className="inline-flex items-center gap-0.5 px-1.5 py-px rounded-[3px] bg-slate-100 border border-slate-200 text-[11px] text-slate-700 max-w-[140px]">
          <span className="truncate" title={n}>
            {n}
          </span>
          <button type="button" onClick={() => onChange(files.filter((x) => x !== n))} className="text-slate-400 hover:text-rose-600">
            <X size={10} />
          </button>
        </span>
      ))}
      <button type="button" onClick={() => ref.current?.click()} className="inline-flex items-center gap-0.5 text-[11.5px] text-[#1f7ae0] hover:underline disabled:text-slate-400 disabled:no-underline">
        <Paperclip size={11} /> Đính kèm
      </button>
      <input ref={ref} type="file" multiple hidden onChange={(e) => (onChange([...files, ...Array.from(e.target.files || []).map((x: File) => x.name)]), (e.target.value = ''))} />
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
  <section className="mt-5">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-[12.5px] font-bold text-[#1e3a5f] uppercase tracking-wide">{title}</h3>
      {action}
    </div>
    {children}
  </section>
);
const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode; className?: string }> = ({ label, required, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="block text-[11.5px] text-slate-500 mb-1">
      {label} {required && <span className="text-rose-600">*</span>}
    </span>
    {children}
  </label>
);
const AddRow: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button type="button" onClick={onClick} className="inline-flex items-center gap-1 px-2 h-7 rounded-[3px] text-[12.5px] font-semibold text-[#1f7ae0] hover:bg-[#eaf2fc] disabled:text-slate-400 disabled:hover:bg-transparent">
    <Plus size={14} /> Thêm dòng
  </button>
);
const DelBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button type="button" title="Xoá dòng" onClick={onClick} className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:hover:bg-transparent disabled:text-slate-300">
    <X size={14} />
  </button>
);

// --------------------------------------------------------------------------
// 4. Kế hoạch chi phí theo tháng (thời điểm = các tháng thực hiện dự án)
// --------------------------------------------------------------------------
const SX_GROUPS = COST_GROUPS.filter(isSxGroup);
const KD_GROUPS = COST_GROUPS.filter((g) => !isSxGroup(g));
const mShort = (ym: string) => `T${+ym.slice(5)}/${ym.slice(2, 4)}`;

const CostPlan: React.FC<{ f: PakdFormData; setCosts: (c: PakdFormData['costs']) => void }> = ({ f, setCosts }) => {
  const [fill, setFill] = useState<{ id: string; total: number } | null>(null);
  // Kỳ kế hoạch = Bắt đầu → Kết thúc (mục 2); chưa nhập thì mặc định 12 tháng của năm hiện tại.
  const hasPeriod = !!f.startMonth && !!f.endMonth && f.endMonth >= f.startMonth;
  const year = (f.startMonth || new Date().toISOString()).slice(0, 4);
  const period = hasPeriod ? monthRange(f.startMonth, f.endMonth) : monthRange(`${year}-01`, `${year}-12`);
  const extra: string[] = Array.from(new Set<string>(f.costs.flatMap((c) => Object.keys(c.amounts || {}).filter((m) => c.amounts[m])))).filter((m) => !period.includes(m));
  const months: string[] = [...period, ...extra].sort();
  const up = (id: string, patch: Partial<PakdFormData['costs'][number]>) => setCosts(f.costs.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const sum = (rows: PakdFormData['costs'], m?: string) => rows.reduce((s, c) => s + (m ? c.amounts?.[m] || 0 : costTotal(c)), 0);
  const sx = f.costs.filter((c) => isSxGroup(c.group));
  const kd = f.costs.filter((c) => !isSxGroup(c.group));
  let run = 0;
  const cum = months.map((m) => (run += sum(f.costs, m)));

  const STICKY1 = 'sticky left-0 z-[2] w-[172px] min-w-[172px]';
  const STICKY2 = 'sticky left-[172px] z-[2] w-[200px] min-w-[200px] shadow-[2px_0_0_0_#e2e8f0]';
  const MONTH = 'w-[112px] min-w-[112px]';

  const row = (c: PakdFormData['costs'][number], groups: readonly CostGroup[]) => (
    <tr key={c.id} className="group/row hover:bg-[#f5f9fe]">
      <td className={`${STICKY1} bg-white group-hover/row:bg-[#f5f9fe] border border-slate-200 border-l-0 p-0`}>
        <select value={c.group} onChange={(e) => up(c.id, { group: e.target.value as CostGroup })} className={CELL}>
          {groups.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </td>
      <td className={`${STICKY2} bg-white group-hover/row:bg-[#f5f9fe] border border-slate-200 p-0`}>
        <input value={c.item} onChange={(e) => up(c.id, { item: e.target.value })} placeholder="Khoản mục chi phí" className={CELL} />
      </td>
      {months.map((m) => (
        <td key={m} className={`${MONTH} border border-slate-200 p-0 ${period.includes(m) ? '' : 'bg-amber-50'}`}>
          <NumIn
            value={c.amounts?.[m] || 0}
            onChange={(n) => {
              const amounts = { ...(c.amounts || {}) };
              if (n) amounts[m] = n;
              else delete amounts[m];
              up(c.id, { amounts });
            }}
          />
        </td>
      ))}
      <td className={`${erp.td} ${erp.num} font-bold bg-slate-50 w-[130px] min-w-[130px]`}>{money(costTotal(c))}</td>
      <td className="border border-slate-200 p-0 min-w-[170px]">
        <input value={c.output} onChange={(e) => up(c.id, { output: e.target.value })} placeholder="Kết quả đầu ra" className={CELL} />
      </td>
      <td className="border border-slate-200 p-0 min-w-[120px]">
        <Files files={c.files} onChange={(files) => up(c.id, { files })} />
      </td>
      <td className="border border-slate-200 border-r-0 px-1 w-[72px] min-w-[72px] relative">
        <div className="flex items-center justify-center gap-0.5">
          <button
            type="button"
            title="Chia đều một tổng giá trị cho các tháng trong kỳ"
            onClick={() => setFill(fill?.id === c.id ? null : { id: c.id, total: costTotal(c) })}
            className="p-1 rounded text-slate-400 hover:text-[#1f5fa8] hover:bg-[#eaf2fc] disabled:hover:bg-transparent disabled:text-slate-300"
          >
            <Divide size={14} />
          </button>
          <DelBtn onClick={() => setCosts(f.costs.filter((x) => x.id !== c.id))} />
        </div>
        {fill?.id === c.id && (
          <div className="absolute right-1 top-full z-20 mt-1 w-[260px] bg-white border border-slate-300 rounded-[4px] shadow-lg p-2.5 text-[12px]">
            <p className="font-semibold text-slate-700 mb-1">Chia đều cho {period.length} tháng ({my(period[0])} – {my(period[period.length - 1])})</p>
            <NumIn value={fill.total} onChange={(n) => setFill({ id: c.id, total: n })} className={`${INP} h-8 text-right`} placeholder="Tổng giá trị (VNĐ)" />
            <div className="flex justify-end gap-1.5 mt-2">
              <Btn className="h-7" onClick={() => setFill(null)}>
                Huỷ
              </Btn>
              <Btn
                variant="primary"
                className="h-7"
                onClick={() => {
                  up(c.id, { amounts: spreadEven(fill.total, period) });
                  setFill(null);
                }}
              >
                Chia đều
              </Btn>
            </div>
          </div>
        )}
      </td>
    </tr>
  );

  const block = (label: string, rows: PakdFormData['costs'], groups: readonly CostGroup[], tone: string) => (
    <>
      <tr>
        <td colSpan={2} className={`sticky left-0 z-[2] ${tone} border border-slate-200 border-l-0 px-2.5 py-1.5 text-[12px] font-bold uppercase tracking-wide text-[#1e3a5f] shadow-[2px_0_0_0_#e2e8f0]`}>
          {label}
        </td>
        <td colSpan={months.length + 4} className={`${tone} border border-slate-200 border-r-0`} />
      </tr>
      {rows.map((c) => row(c, groups))}
      <tr>
        <td colSpan={2} className="sticky left-0 z-[2] bg-white border border-slate-200 border-l-0 px-2 py-1 shadow-[2px_0_0_0_#e2e8f0]">
          <button
            type="button"
            onClick={() => setCosts([...f.costs, newCost(groups[0])])}
            className="inline-flex items-center gap-1 px-1.5 h-6 rounded-[3px] text-[12px] font-semibold text-[#1f7ae0] hover:bg-[#eaf2fc] disabled:text-slate-400 disabled:hover:bg-transparent"
          >
            <Plus size={13} /> Thêm khoản mục
          </button>
        </td>
        <td colSpan={months.length + 4} className="border border-slate-200 border-r-0" />
      </tr>
      <tr className="font-semibold text-slate-800">
        <td colSpan={2} className={`sticky left-0 z-[2] ${tone} border border-slate-200 border-l-0 px-2.5 py-1.5 text-[12.5px] shadow-[2px_0_0_0_#e2e8f0]`}>
          Cộng {label.replace(/^[AB]\. /, '').toLowerCase()}
        </td>
        {months.map((m) => (
          <td key={m} className={`${tone} ${erp.td} ${erp.num}`}>
            {sum(rows, m) ? money(sum(rows, m)) : <span className="text-slate-300">—</span>}
          </td>
        ))}
        <td className={`${tone} ${erp.td} ${erp.num} font-bold`}>{money(sum(rows))}</td>
        <td colSpan={3} className={`${tone} border border-slate-200 border-r-0`} />
      </tr>
    </>
  );

  return (
    <Section
      title="4. Kế hoạch chi phí theo tháng"
      action={
        <span className="text-[12px] text-slate-500">
          Kỳ kế hoạch: <b className="text-slate-700">{my(period[0])} – {my(period[period.length - 1])}</b> ({period.length} tháng) · ĐVT: VNĐ
        </span>
      }
    >
      {!hasPeriod && (
        <p className="mb-2 flex items-center gap-1.5 text-[12px] text-amber-700">
          <Info size={13} /> Chưa nhập Bắt đầu / Kết thúc ở mục 2 — tạm lập kế hoạch 12 tháng năm {year}.
        </p>
      )}
      {extra.length > 0 && (
        <p className="mb-2 flex items-center gap-1.5 text-[12px] text-amber-700">
          <AlertTriangle size={13} /> Có chi phí ngoài kỳ thực hiện ({extra.map(my).join(', ')}) — các cột tô vàng.
        </p>
      )}
      <div className="overflow-x-auto border border-slate-200 rounded-[3px]">
        <table className={`${erp.table} w-max min-w-full`}>
          <thead>
            <tr>
              <th className={`${erp.th} ${STICKY1} z-[3] border-t-0 border-l-0 text-left`}>Nhóm chi phí</th>
              <th className={`${erp.th} ${STICKY2} z-[3] border-t-0 text-left`}>Khoản mục chi phí</th>
              {months.map((m) => (
                <th key={m} className={`${erp.th} ${MONTH} border-t-0 text-right ${period.includes(m) ? '' : '!bg-amber-100'}`} title={my(m)}>
                  {mShort(m)}
                </th>
              ))}
              <th className={`${erp.th} border-t-0 text-right`}>Tổng</th>
              <th className={`${erp.th} border-t-0 text-left`}>Kết quả đầu ra</th>
              <th className={`${erp.th} border-t-0 text-left`}>File đính kèm</th>
              <th className={`${erp.th} border-t-0 border-r-0`} />
            </tr>
          </thead>
          <tbody>
            {block('A. Chi phí sản xuất', sx, SX_GROUPS, 'bg-[#eef4fb]')}
            {block('B. Chi phí kinh doanh', kd, KD_GROUPS, 'bg-[#fdf3ea]')}
          </tbody>
          <tfoot>
            <tr className={erp.totalRow}>
              <td colSpan={2} className={`sticky left-0 z-[2] bg-[#fff6d6] ${erp.td} border-l-0 shadow-[2px_0_0_0_#e2e8f0]`}>
                TỔNG CHI PHÍ
              </td>
              {months.map((m) => (
                <td key={m} className={`${erp.td} ${erp.num}`}>
                  {money(sum(f.costs, m))}
                </td>
              ))}
              <td className={`${erp.td} ${erp.num}`}>{money(sum(f.costs))}</td>
              <td colSpan={3} className={`${erp.td} border-r-0`} />
            </tr>
            <tr className="text-slate-600">
              <td colSpan={2} className={`sticky left-0 z-[2] bg-white ${erp.td} border-l-0 italic shadow-[2px_0_0_0_#e2e8f0]`}>
                Luỹ kế chi phí
              </td>
              {months.map((m, i) => (
                <td key={m} className={`${erp.td} ${erp.num} italic`}>
                  {money(cum[i])}
                </td>
              ))}
              <td colSpan={4} className={`${erp.td} border-r-0`} />
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-1.5 text-[11.5px] text-slate-500">
        Nhập giá trị chi dự kiến của từng khoản mục vào các tháng thực hiện. Nút <Divide size={11} className="inline -mt-0.5" /> chia đều một tổng giá trị cho các tháng trong kỳ. Kỳ kế hoạch lấy theo Bắt đầu / Kết thúc ở mục 2.
      </p>
    </Section>
  );
};

// --------------------------------------------------------------------------
// Biểu đồ (SVG, một trục VNĐ)
// --------------------------------------------------------------------------
const C_IN = '#1f5fa8';
const C_OUT = '#e0883a';
const C_LINE = '#334155';

type Series = { key: string; label: string; color: string; kind: 'bar' | 'line'; values: number[] };
const MiniChart: React.FC<{ months: string[]; series: Series[]; empty: string }> = ({ months, series, empty }) => {
  const [hover, setHover] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 640, h: 230 });
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: Math.max(300, Math.floor(e.contentRect.width)), h: Math.max(220, Math.floor(e.contentRect.height)) }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [months.length]);
  if (!months.length) return <p className="flex-1 min-h-[220px] flex items-center justify-center text-[12px] text-slate-400 text-center px-6">{empty}</p>;
  const all = series.flatMap((s) => s.values);
  // Trục số tròn (1 · 2 · 2,5 · 5 × 10ⁿ) để nhãn dễ đọc
  const rawMax = Math.max(0, ...all);
  const rawMin = Math.min(0, ...all);
  const rawStep = (rawMax - rawMin || 1) / 4;
  const p10 = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const step = [1, 2, 2.5, 5, 10].map((k) => k * p10).find((v) => v >= rawStep) || rawStep;
  const max = Math.ceil(rawMax / step) * step;
  const min = Math.floor(rawMin / step) * step;
  const W = size.w;
  const H = size.h;
  const L = 74;
  const B = 22;
  const T = 8;
  const span = max - min || 1;
  const y = (v: number) => T + ((max - v) / span) * (H - T - B);
  const slot = (W - L - 18) / months.length;
  const x = (i: number) => L + slot * i + slot / 2;
  const bars = series.filter((s) => s.kind === 'bar');
  const bw = Math.max(3, Math.min(18, (slot * 0.72 - 2 * (bars.length - 1)) / Math.max(1, bars.length)));
  const ticks = Array.from({ length: Math.round(span / step) + 1 }, (_, i) => min + step * i);
  const fmtAxis = (v: number) => (Math.abs(v) >= 1e9 ? `${+(v / 1e9).toFixed(1)} tỷ` : Math.abs(v) >= 1e6 ? `${Math.round(v / 1e6)} tr` : money(v));
  const every = Math.ceil(months.length / Math.max(1, Math.floor((W - L) / 58)));
  return (
    <div className="relative flex-1 flex flex-col">
      <div className="flex flex-wrap items-center gap-3 text-[11.5px] text-slate-600 mb-1">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            {s.kind === 'bar' ? <span className="w-3 h-3 rounded-[2px]" style={{ background: s.color }} /> : <span className="w-4 h-[2px]" style={{ background: s.color }} />}
            {s.label}
          </span>
        ))}
        <span className="text-slate-400">ĐVT: VNĐ</span>
      </div>
      <div ref={boxRef} className="h-[280px]">
      <svg width={W} height={H} className="block" onMouseLeave={() => setHover(null)}>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={L} x2={W - 6} y1={y(t)} y2={y(t)} stroke={Math.abs(t) < 1e-6 ? '#94a3b8' : '#eef2f6'} />
            <text x={L - 6} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="#94a3b8">
              {fmtAxis(t)}
            </text>
          </g>
        ))}
        {min < 0 && <line x1={L} x2={W - 6} y1={y(0)} y2={y(0)} stroke="#94a3b8" />}
        {months.map((m, i) => (
          <g key={m} onMouseEnter={() => setHover(i)}>
            <rect x={L + slot * i} y={T} width={slot} height={H - T - B} fill={hover === i ? '#f1f5f9' : 'transparent'} />
            {bars.map((s, j) => {
              const v = s.values[i] || 0;
              const x0 = x(i) - (bars.length * bw + (bars.length - 1) * 2) / 2 + j * (bw + 2);
              const top = Math.min(y(v), y(0));
              const h = Math.abs(y(v) - y(0));
              if (h < 0.5) return null;
              const r = Math.min(3, bw / 2, h);
              const d = v >= 0
                ? `M${x0},${top + h}V${top + r}Q${x0},${top} ${x0 + r},${top}H${x0 + bw - r}Q${x0 + bw},${top} ${x0 + bw},${top + r}V${top + h}Z`
                : `M${x0},${top}V${top + h - r}Q${x0},${top + h} ${x0 + r},${top + h}H${x0 + bw - r}Q${x0 + bw},${top + h} ${x0 + bw},${top + h - r}V${top}Z`;
              return <path key={s.key} d={d} fill={s.color} />;
            })}
            {i % every === 0 && (
              <text x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#64748b">
                {my(m)}
              </text>
            )}
          </g>
        ))}
        {series
          .filter((s) => s.kind === 'line')
          .map((s) => (
            <g key={s.key}>
              <polyline fill="none" stroke={s.color} strokeWidth={2} points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
              {s.values.map((v, i) => (
                <circle key={i} cx={x(i)} cy={y(v)} r={hover === i ? 4 : 2.5} fill="#fff" stroke={s.color} strokeWidth={2} />
              ))}
            </g>
          ))}
      </svg>
      </div>
      {hover !== null && (
        <div className="absolute top-6 right-2 bg-white border border-slate-300 shadow-md rounded-[4px] px-2.5 py-1.5 text-[11.5px] text-slate-700 pointer-events-none">
          <p className="font-semibold text-slate-800 mb-0.5">Tháng {my(months[hover])}</p>
          {series.map((s) => (
            <p key={s.key} className="flex items-center gap-1.5 tabular-nums">
              <span className="w-2 h-2 rounded-[2px]" style={{ background: s.color }} /> {s.label}: <b>{money(s.values[hover] || 0)}</b>
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// --------------------------------------------------------------------------
// Form
// --------------------------------------------------------------------------
/** Nút thao tác PAKD hiển thị trên đầu trang. */
export interface PakdHeaderActions {
  mode: 'lap' | 'adjust';
  save: (submit: boolean) => void;
  cancel: () => void;
  cancelLabel: string;
}

export const PakdForm: React.FC<{
  project: BizProject;
  role: BizRole;
  actor: string;
  onSave: (form: PakdFormData, submit: boolean) => void;
  /** GĐK / SM sửa PAKD khi dự án đang thực hiện (bản điều chỉnh → Kế toán duyệt lại). */
  onAdjust?: (form: PakdFormData, submit: boolean) => void;
  onCancelAdjust?: () => void;
  /** Cho phép sửa PAKD đã duyệt ngay trên khung (SM / GĐK). */
  allowAdjust?: boolean;
  /** Mở sẵn chế độ sửa khi hiển thị. */
  startAdjust?: boolean;
  /** Tăng giá trị → mở chế độ sửa PAKD (nút "Sửa PAKD" trên thanh thao tác). */
  adjustSignal?: number;
  /** Đưa các nút Lưu nháp / Gửi duyệt lên đầu trang: báo cho màn cha khi nào cần hiện nút. Có prop này thì chân khung không hiện nút. */
  onHeaderActions?: (a: PakdHeaderActions | null) => void;
}> = ({ project: p, role, actor, onSave, onAdjust, onCancelAdjust, allowAdjust = false, startAdjust = false, adjustSignal = 0, onHeaderActions }) => {
  const running = p.status === 'Đang thực hiện';
  const initial = (useDraft = true) => {
    const src = useDraft && running && p.pakdDraft ? p.pakdDraft : p.pakdForm;
    return src
      ? (() => {
          const c = structuredClone(src);
          return { ...c, costs: c.costs.map(normalizeCost) };
        })()
      : {
          ...emptyPakd(p.contractSigned, p.contract?.value ?? p.expectedRevenue),
          contractNo: p.contract?.number || '',
          contractDate: p.contract?.signDate || '',
          actualSignDate: p.contract?.signDate || '',
          startMonth: (p.contract?.from || p.startDate || '').slice(0, 7),
          endMonth: (p.contract?.to || p.endDate || '').slice(0, 7),
          expectedSignMonth: (p.expectedSignDate || '').slice(0, 7),
          ...seedCosts(p),
        };
  };
  const [f, setF] = useState<PakdFormData>(() => initial());
  const [errors, setErrors] = useState<string[]>([]);
  const [adjusting, setAdjusting] = useState(() => startAdjust && allowAdjust && p.status === 'Đang thực hiện' && canAdjustPakd(role));
  const [lastSignal, setLastSignal] = useState(adjustSignal);
  if (adjustSignal !== lastSignal) {
    setLastSignal(adjustSignal);
    if (allowAdjust && p.status === 'Đang thực hiện' && canAdjustPakd(role)) setAdjusting(true);
  }
  const key = `${p.id}-${p.pakdForm?.savedAt || ''}-${p.pakdDraft?.savedAt || ''}-${p.pakd.length}-${latestPakd(p)?.state || ''}-${p.contract?.updatedAt || ''}`;
  const [lastKey, setLastKey] = useState(key);
  if (key !== lastKey) {
    setLastKey(key);
    setF(initial());
  }
  const set = <K extends keyof PakdFormData>(k: K, v: PakdFormData[K]) => {
    setF((prev) => ({ ...prev, [k]: v }));
    setErrors([]);
  };

  const last = latestPakd(p);
  const signed = f.contractState === 'Đã ký';
  // Luồng sửa PAKD sau khi Kế toán duyệt (dự án đang thực hiện): GĐK / SM sửa → bản điều chỉnh → Kế toán duyệt lại.
  const pendingAdjust = !!(last?.adjust && last.state === 'Chờ CFO');
  const rejectedAdjust = !!(last?.adjust && last.state === 'Từ chối' && p.pakdDraft);
  const inAdjust = running && (adjusting || !!p.pakdDraft);
  const canAdjust = allowAdjust && running && canAdjustPakd(role) && !pendingAdjust;
  const editable = (p.status === 'Chưa có PAKD' && canLapPakd(role)) || (inAdjust && canAdjust);
  const approvedV = [...p.pakd].reverse().find((v) => v.state === 'Đã duyệt' && v !== last)?.version;
  const state = pendingAdjust
    ? `Chờ duyệt V${last!.version}`
    : rejectedAdjust
      ? 'Điều chỉnh bị từ chối'
      : inAdjust
        ? 'Đang điều chỉnh'
        : !last
          ? 'Chưa có PAKD'
          : last.state === 'Chờ CFO'
            ? 'Đã có PAKD · chờ Kế toán duyệt'
            : last.state === 'Đã duyệt'
              ? 'Đã duyệt'
              : p.status === 'Chưa có PAKD'
                ? 'Từ chối — làm lại'
                : running
                  ? 'Đã duyệt'
                  : last.state;
  const stateCls =
    state === 'Đã duyệt'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
      : state.startsWith('Chờ duyệt') || state.includes('chờ Kế toán')
        ? 'bg-amber-50 text-amber-700 border-amber-300'
        : state.startsWith('Từ chối') || state.includes('bị từ chối')
          ? 'bg-rose-50 text-rose-700 border-rose-300'
          : state === 'Đang điều chỉnh'
            ? 'bg-[#eaf2fc] text-[#1f5fa8] border-[#bcd3f0]'
            : 'bg-slate-100 text-slate-700 border-slate-300';
  /**
   * Đổi tình trạng HĐ: Chưa ký → Đã ký chỉ điền sẵn Giá trị HĐ (= giá trị dự kiến) và kỳ thực hiện (từ mốc kế hoạch).
   * Mục 3 (Nghiệm thu, thu tiền) và mục 4 (Kế hoạch chi phí theo tháng) để trống cho người dùng tự nhập —
   * không tự chuyển chi phí từ các mốc kế hoạch sang.
   */
  const changeContractState = (v: PakdFormData['contractState']) => {
    if (v === 'Đã ký' && f.contractState === 'Chưa ký') {
      const ph = f.phases.filter((x) => x.from);
      const from = f.startMonth || ph.map((x) => x.from).sort()[0] || '';
      const to = f.endMonth || ph.map((x) => x.to || x.from).sort().slice(-1)[0] || '';
      setF((prev) => ({
        ...prev,
        contractState: 'Đã ký',
        contractValue: prev.contractValue || prev.expectedValue,
        startMonth: from,
        endMonth: to,
      }));
      setErrors([]);
      return;
    }
    set('contractState', v);
  };
  const left = p.pakdDeadline ? daysBetween(todayIso(), p.pakdDeadline) : null;
  const leftText = left === null ? '—' : p.pakd.length ? 'Đã nộp' : left > 0 ? `Còn ${left} ngày` : left === 0 ? 'Hết hạn hôm nay' : `Quá hạn ${-left} ngày`;

  const t = useMemo(() => pakdTotals(f), [f]);
  const flow = useMemo(() => cashflowSeries(f), [f]);
  const nMonths = monthsBetween(f.startMonth, f.endMonth);
  const msTotal = f.milestones.reduce((a, m) => ({ pct: a.pct + (m.percent || 0), val: a.val + msValue(f, m), cash: a.cash + msCash(f, m) }), { pct: 0, val: 0, cash: 0 });
  const totalInvest = t.cost;
  const deviation = p.contract?.value && t.revenue ? Math.abs(p.contract.value - t.revenue) / t.revenue : 0;

  const save = (submit: boolean) => {
    const e = submit ? validatePakd(f) : [];
    setErrors(e);
    if (e.length) {
      setTimeout(() => document.getElementById('pakd-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30);
      return;
    }
    if (inAdjust && onAdjust) {
      onAdjust(f, submit);
      if (submit) setAdjusting(false);
      return;
    }
    onSave(f, submit);
  };
  const cancelAdjust = () => {
    if (p.pakdDraft) onCancelAdjust?.();
    setAdjusting(false);
    setErrors([]);
    setF(initial(false));
  };

  // Nút trên đầu trang (màn chi tiết dự án): Lưu nháp · Gửi Kế toán duyệt (lập lần đầu) / Huỷ · Lưu nháp · Gửi duyệt điều chỉnh.
  const saveRef = useRef(save);
  saveRef.current = save;
  const cancelRef = useRef(cancelAdjust);
  cancelRef.current = cancelAdjust;
  const headerMode: PakdHeaderActions['mode'] | null = !editable ? null : inAdjust ? 'adjust' : 'lap';
  const hasDraft = !!p.pakdDraft;
  useEffect(() => {
    if (!onHeaderActions) return;
    onHeaderActions(
      headerMode
        ? {
            mode: headerMode,
            save: (submit) => saveRef.current(submit),
            cancel: () => cancelRef.current(),
            cancelLabel: hasDraft ? 'Huỷ bản điều chỉnh' : 'Huỷ sửa',
          }
        : null,
    );
  }, [headerMode, hasDraft]);
  useEffect(() => () => onHeaderActions?.(null), []);
  const footerButtons = !onHeaderActions;

  // Hàng tiêu đề: Người lập · Hạn lập PAKD · Thời gian còn lại · Trạng thái PAKD
  const header: [string, React.ReactNode][] = [
    ['Người lập', (inAdjust || pendingAdjust ? p.pakdDraft?.savedBy : p.pakdForm?.savedBy) || last?.submittedBy || actor],
    ['Hạn lập PAKD', dmy(p.pakdDeadline)],
    ['Thời gian còn lại', <span className={left !== null && left <= 3 && !p.pakd.length ? 'text-rose-600' : ''}>{leftText}</span>],
    ['Trạng thái PAKD', <Tag cls={stateCls}>{state}</Tag>],
  ];

  return (
    <Panel
      title={inAdjust || pendingAdjust ? 'Phương án kinh doanh (PAKD) — điều chỉnh' : 'Lập phương án kinh doanh (PAKD)'}
      icon={ClipboardList}
      actions={
        running && canAdjust && !inAdjust ? (
          <Btn variant="primary" icon={Pencil} className="h-7" onClick={() => setAdjusting(true)}>
            Sửa PAKD
          </Btn>
        ) : undefined
      }
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            {inAdjust && editable
              ? 'Sửa PAKD (bản điều chỉnh) → Gửi Kế toán (CFO) duyệt lại. Số liệu dự án chỉ thay đổi khi bản điều chỉnh được duyệt.'
              : pendingAdjust
                ? 'Bản điều chỉnh đang chờ Kế toán (CFO) duyệt — chỉ xem.'
                : running
                  ? canAdjust
                    ? 'PAKD đã được duyệt. Bấm "Sửa PAKD" để điều chỉnh — gửi Kế toán duyệt lại, duyệt xong sinh phiên bản mới.'
                    : 'PAKD đã được duyệt — chỉ Giám đốc khối / Giám đốc kinh doanh (SM) được sửa PAKD.'
                  : editable
                    ? `SM / GĐK nhập PAKD trong ${PAKD_DAYS} ngày kể từ ngày GĐK duyệt → Gửi Kế toán (CFO) duyệt. Quá hạn chưa được duyệt → dự án Pending.`
                    : p.status === 'Chưa có PAKD'
                      ? 'Chọn vai trò SM hoặc GĐK để nhập PAKD.'
                      : p.status === 'Pending'
                        ? 'Dự án Pending (quá hạn PAKD) — Kế toán mở lại để tiếp tục.'
                      : 'PAKD đã gửi duyệt — chỉ xem.'}
            {(inAdjust ? p.pakdDraft : p.pakdForm)?.savedAt && (
              <>
                {' '}
                · Lưu lần cuối {dmy((inAdjust ? p.pakdDraft : p.pakdForm)!.savedAt)} bởi {(inAdjust ? p.pakdDraft : p.pakdForm)!.savedBy}
              </>
            )}
          </span>
          {footerButtons && inAdjust && editable && (
            <span className="flex items-center gap-2">
              <Btn icon={X} className="h-8" onClick={cancelAdjust}>
                {p.pakdDraft ? 'Huỷ bản điều chỉnh' : 'Huỷ sửa'}
              </Btn>
              <Btn icon={Save} className="h-8" onClick={() => save(false)}>
                Lưu nháp
              </Btn>
              <Btn variant="primary" icon={Send} className="h-8" onClick={() => save(true)}>
                Gửi Kế toán duyệt điều chỉnh
              </Btn>
            </span>
          )}
          {footerButtons && editable && !inAdjust && (
            <span className="flex items-center gap-2">
              <Btn icon={Save} className="h-8" onClick={() => save(false)}>
                Lưu nháp
              </Btn>
              <Btn variant="primary" icon={Send} className="h-8" onClick={() => save(true)}>
                Gửi Kế toán duyệt
              </Btn>
            </span>
          )}
        </div>
      }
    >
      <div id="pakd-form" className="scroll-mt-16" />
      {/* Thông tin chung */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-3 border-b border-slate-200">
        {header.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <p className="text-[11.5px] text-slate-500 mb-1">{k}</p>
            <div className="text-[13px] font-semibold text-slate-800 truncate">{v}</div>
          </div>
        ))}
      </div>

      {(inAdjust || pendingAdjust) && (
        <div
          className={`mt-3 flex items-start gap-2 px-3 py-2 rounded-[4px] border text-[12.5px] ${
            rejectedAdjust ? 'bg-rose-50 border-rose-300 text-rose-800' : pendingAdjust ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-[#eaf2fc] border-[#bcd3f0] text-[#1e3a5f]'
          }`}
        >
          <Info size={15} className="mt-0.5 shrink-0" />
          <span>
            {pendingAdjust ? (
              <>
                Đang hiển thị <b>bản điều chỉnh V{last!.version}</b> chờ Kế toán (CFO) duyệt. Số liệu dự án vẫn theo bản đã duyệt{approvedV ? ` V${approvedV}` : ''} cho đến khi bản điều chỉnh được duyệt.
              </>
            ) : rejectedAdjust ? (
              <>
                Bản điều chỉnh V{last!.version} bị Kế toán từ chối{last!.note ? <>: <b>{last!.note}</b></> : ''}. Sửa lại và gửi duyệt, hoặc huỷ bản điều chỉnh để giữ bản đang áp dụng.
              </>
            ) : (
              <>
                <b>Đang sửa PAKD.</b> Cập nhật <b>Tình trạng dự án → Đã ký</b> khi đã ký hợp đồng, rồi nhập tiếp thông tin hợp đồng, mốc nghiệm thu và kế hoạch chi phí theo tháng. Gửi Kế toán duyệt lại để áp dụng.
              </>
            )}
          </span>
        </div>
      )}

      {errors.length > 0 && (
        <div className="mt-3 px-3 py-2 rounded-[4px] bg-rose-50 border border-rose-300 text-[12px] text-rose-700">
          <p className="flex items-center gap-1.5 font-semibold">
            <AlertCircle size={14} /> Chưa gửi được — cần bổ sung:
          </p>
          <ul className="list-disc pl-6 mt-1">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Chỉ số PAKD + biểu đồ + tóm tắt chi phí */}
      <div className="mt-3 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <KpiBox
            label="Doanh thu kế hoạch"
            value={money(t.revenue)}
            valueText={money(t.revenue)}
            sub={signed ? 'VNĐ · theo hợp đồng đã ký' : f.expectedValue ? 'VNĐ · theo giá trị dự kiến' : 'VNĐ · ước tính, chưa có hợp đồng'}
          />
          <KpiBox label="Lợi nhuận" value={money(t.profit)} valueText={money(t.profit)} tone={t.profit < 0 ? 'bad' : 'neutral'} sub="Doanh thu kế hoạch − tổng chi phí" />
          <KpiBox
            label="Biên lợi nhuận"
            value={t.revenue ? pct(t.margin) : '—'}
            tone={!t.revenue ? 'neutral' : t.margin >= MIN_MARGIN ? 'good' : 'bad'}
            badge={t.revenue ? (t.margin >= MIN_MARGIN ? '▲ Đạt' : '! Dưới khung') : undefined}
            sub={`Khung tối thiểu ${pct(MIN_MARGIN)}`}
          />
        </div>
        {/* Biểu đồ + tóm tắt chi phí: tự xuống dòng theo bề rộng khung (không phụ thuộc bề rộng màn hình) */}
        <div className="flex flex-wrap gap-3 min-w-0">
          <div className="flex-[3] min-w-[420px] self-start border border-slate-200 rounded-[4px] p-3 flex flex-col">
            <p className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide mb-1">
              <BarChart3 size={13} />
              {signed ? 'Luỹ kế dòng tiền (LKDT = Dòng thu − Dòng chi + Số dư kỳ trước)' : 'Dòng tiền chi của dự án theo tháng'}
            </p>
            {signed ? (
              <MiniChart
                months={flow.map((x) => x.month)}
                empty="Nhập mốc nghiệm thu (thời điểm, %) và chi phí (thời điểm, giá trị) để xem luỹ kế dòng tiền."
                series={[
                  { key: 'in', label: 'Dòng thu', color: C_IN, kind: 'bar', values: flow.map((x) => x.inn) },
                  { key: 'out', label: 'Dòng chi', color: C_OUT, kind: 'bar', values: flow.map((x) => x.out) },
                  { key: 'bal', label: 'Luỹ kế dòng tiền', color: C_LINE, kind: 'line', values: flow.map((x) => x.balance) },
                ]}
              />
            ) : (
              <MiniChart
                months={flow.map((x) => x.month)}
                empty="Nhập mốc kế hoạch (từ – đến, tổng mức đầu tư) để xem dòng tiền chi theo tháng."
                series={[
                  { key: 'sx', label: 'Sản xuất', color: C_IN, kind: 'bar', values: flow.map((x) => x.sx) },
                  { key: 'kd', label: 'Kinh doanh', color: C_OUT, kind: 'bar', values: flow.map((x) => x.kd) },
                ]}
              />
            )}
          </div>
          <div className="flex-[2] min-w-[380px] overflow-x-auto">
            <p className="text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide mb-1.5">Tóm tắt chi phí</p>
            {signed ? (
              <table className={erp.table}>
                <thead>
                  <tr>
                    {['Nhóm chi phí', 'Số tiền (VNĐ)', '% doanh thu'].map((h) => (
                      <th key={h} className={`${erp.th} text-center`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COST_GROUPS.map((g) => (
                    <tr key={g} className={erp.tr}>
                      <td className={erp.td}>{g}</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(t.byGroup[g])}</td>
                      <td className={`${erp.td} ${erp.num}`}>{t.revenue ? pct(t.byGroup[g] / t.revenue) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={erp.totalRow}>
                    <td className={erp.td}>TỔNG CHI PHÍ</td>
                    <td className={`${erp.td} ${erp.num}`}>{money(t.cost)}</td>
                    <td className={`${erp.td} ${erp.num}`}>{t.revenue ? pct(t.cost / t.revenue) : '—'}</td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <table className={erp.table}>
                <thead>
                  <tr>
                    {['Tháng', 'Sản xuất', '%/Tổng SX', 'Kinh doanh', '%/Tổng KD', '%/Tổng mức đầu tư'].map((h) => (
                      <th key={h} className={`${erp.th} text-center`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {flow.map((x) => (
                    <tr key={x.month} className={erp.tr}>
                      <td className={`${erp.td} text-center`}>{my(x.month)}</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(x.sx)}</td>
                      <td className={`${erp.td} ${erp.num}`}>{t.sx ? pct(x.sx / t.sx) : '—'}</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(x.kd)}</td>
                      <td className={`${erp.td} ${erp.num}`}>{t.kd ? pct(x.kd / t.kd) : '—'}</td>
                      <td className={`${erp.td} ${erp.num}`}>{totalInvest ? pct((x.sx + x.kd) / totalInvest) : '—'}</td>
                    </tr>
                  ))}
                  {!flow.length && (
                    <tr>
                      <td colSpan={6} className={`${erp.td} text-center text-slate-400`}>
                        Chưa có mốc kế hoạch.
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className={erp.totalRow}>
                    <td className={erp.td}>TỔNG CHI PHÍ</td>
                    <td className={`${erp.td} ${erp.num}`}>{money(t.sx)}</td>
                    <td className={`${erp.td} ${erp.num}`}>{t.sx ? '100%' : '—'}</td>
                    <td className={`${erp.td} ${erp.num}`}>{money(t.kd)}</td>
                    <td className={`${erp.td} ${erp.num}`}>{t.kd ? '100%' : '—'}</td>
                    <td className={`${erp.td} ${erp.num}`}>{totalInvest ? '100%' : '—'}</td>
                  </tr>
                </tfoot>
              </table>
            )}
          </div>
        </div>
      </div>

      <fieldset disabled={!editable} className="min-w-0">
        {/* 1. Thông tin dự án: 1.1 hợp đồng dự kiến (luôn hiện) · 1.2 hợp đồng thực tế (nhập khi đã ký) */}
        <Section title="1. Thông tin dự án">
          <div className="border border-slate-200 rounded-[3px] p-3 bg-slate-50/40">
            <h4 className="text-[12px] font-bold text-[#1e3a5f] mb-2">1.1. Thông tin hợp đồng dự kiến</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Field label="Thời điểm dự kiến ký" required={!signed}>
                <MonthIn value={f.expectedSignMonth} onChange={(v) => set('expectedSignMonth', v)} className={INP} />
              </Field>
              <Field label="Giá trị hợp đồng dự kiến (VNĐ)" required={!signed}>
                <NumIn value={f.expectedValue} onChange={(n) => set('expectedValue', n)} className={INP} />
              </Field>
              <Field label="Xác suất thành công (%)">
                <NumIn value={f.probability} onChange={(n) => set('probability', Math.min(100, n))} className={INP} decimals />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <Field label="Phạm vi công việc" required>
                <textarea value={f.scope} onChange={(e) => set('scope', e.target.value)} rows={3} className={`${INP} h-auto py-1.5`} />
              </Field>
              <Field label="Đánh giá rủi ro" required={!signed}>
                <textarea value={f.risk} onChange={(e) => set('risk', e.target.value)} rows={3} className={`${INP} h-auto py-1.5`} />
              </Field>
            </div>
          </div>

          <div className="border border-slate-200 rounded-[3px] p-3 mt-3 bg-slate-50/40">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h4 className="text-[12px] font-bold text-[#1e3a5f]">1.2. Thông tin hợp đồng thực tế</h4>
              {!signed && <span className="text-[11.5px] text-slate-500">Chưa ký hợp đồng — chuyển Tình trạng sang "Đã ký" để nhập số hợp đồng, ngày ký và giá trị thực tế.</span>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <Field label="Tình trạng dự án" required>
                <select value={f.contractState} onChange={(e) => changeContractState(e.target.value as PakdFormData['contractState'])} className={INP}>
                  <option>Đã ký</option>
                  <option disabled={inAdjust && p.pakdForm?.contractState === 'Đã ký'}>Chưa ký</option>
                </select>
              </Field>
              <Field label="Số hợp đồng">
                <input value={f.contractNo} onChange={(e) => set('contractNo', e.target.value)} placeholder={signed ? 'VD: HĐ-022/688/2026' : '—'} disabled={!signed} className={INP} />
              </Field>
              <Field label="Ngày ký trên hợp đồng">
                <input type="date" value={f.contractDate} onChange={(e) => set('contractDate', e.target.value)} disabled={!signed} className={INP} />
              </Field>
              <Field label="Ngày ký thực tế">
                <input type="date" value={f.actualSignDate} onChange={(e) => set('actualSignDate', e.target.value)} disabled={!signed} className={INP} />
              </Field>
              <Field label="Giá trị hợp đồng (VNĐ)" required={signed}>
                <NumIn value={f.contractValue} onChange={(n) => set('contractValue', n)} className={INP} disabled={!signed} />
              </Field>
            </div>
          </div>
        </Section>

        {signed ? (
          <>
            {/* 2. Tiến độ và phạm vi */}
            <Section title="2. Tiến độ thực hiện (theo hợp đồng)">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Field label="Bắt đầu thực hiện (tháng)" required>
                  <MonthIn value={f.startMonth} onChange={(v) => set('startMonth', v)} className={INP} />
                </Field>
                <Field label="Kết thúc dự kiến (tháng)" required>
                  <MonthIn value={f.endMonth} onChange={(v) => set('endMonth', v)} className={INP} />
                </Field>
                <Field label="Số tháng thực hiện">
                  <p className="h-8 px-2.5 flex items-center rounded-[3px] border border-slate-200 bg-slate-50 text-[13px] font-semibold tabular-nums">{nMonths > 0 ? nMonths : '—'}</p>
                </Field>
              </div>
            </Section>

            {/* 3. Nghiệm thu, ghi nhận doanh thu và thu tiền */}
            <Section title="3. Nghiệm thu, ghi nhận doanh thu và thu tiền">
              <div className="overflow-x-auto border border-slate-200 rounded-[3px]">
                <table className={`${erp.table} min-w-[1150px]`}>
                  <thead>
                    <tr>
                      {(
                        [
                          ['STT'],
                          ['Mốc'],
                          ['Thời điểm', 'rev'],
                          ['%'],
                          ['Giá trị', 'rev'],
                          ['Tỷ lệ được thanh toán (%)'],
                          ['Giá trị thu đợt này', 'cash'],
                          ['Thời gian gửi hồ sơ'],
                          ['Điều kiện nghiệm thu'],
                          ['Thời gian chờ (ngày)'],
                          ['Tháng thu tiền', 'cash'],
                          [''],
                        ] as [string, ('rev' | 'cash')?][]
                      ).map(([h, to], i) => (
                        <th key={i} className={`${erp.th} text-center border-t-0 first:border-l-0 last:border-r-0 whitespace-normal align-top`}>
                          {h}
                          {/* Cột được lấy sang kế hoạch theo tháng của Báo cáo hiệu quả dự án */}
                          {to && (
                            <span className={`block mt-0.5 text-[10px] font-semibold normal-case ${to === 'rev' ? 'text-emerald-700' : 'text-[#1f5fa8]'}`}>
                              → {to === 'rev' ? 'Doanh thu KH' : 'Dòng tiền thu KH'}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {f.milestones.map((m, i) => {
                      const up = (patch: Partial<typeof m>) => set('milestones', f.milestones.map((x) => (x.id === m.id ? { ...x, ...patch } : x)));
                      return (
                        <tr key={m.id} className={erp.tr}>
                          <td className={`${erp.td} text-center text-slate-500 border-l-0 w-10`}>{i + 1}</td>
                          <td className="border border-slate-200 p-0 min-w-[190px]">
                            <input value={m.name} onChange={(e) => up({ name: e.target.value })} placeholder="Mốc" className={CELL} />
                          </td>
                          <td className="border border-slate-200 p-0 w-24">
                            <MonthIn value={m.month} onChange={(v) => up({ month: v })} />
                          </td>
                          <td className="border border-slate-200 p-0 w-16">
                            <NumIn value={m.percent} onChange={(n) => up({ percent: Math.min(100, n) })} decimals />
                          </td>
                          <td className={`${erp.td} ${erp.num} w-32 bg-slate-50/70`}>{money(msValue(f, m))}</td>
                          <td className="border border-slate-200 p-0 w-24">
                            <NumIn value={m.payRate} onChange={(n) => up({ payRate: Math.min(100, n) })} decimals />
                          </td>
                          <td className={`${erp.td} ${erp.num} w-32 bg-slate-50/70`}>{money(msCash(f, m))}</td>
                          <td className="border border-slate-200 p-0 w-24">
                            <MonthIn value={m.submitMonth} onChange={(v) => up({ submitMonth: v })} />
                          </td>
                          <td className="border border-slate-200 p-0 min-w-[170px]">
                            <input value={m.condition} onChange={(e) => up({ condition: e.target.value })} placeholder="Điều kiện…" className={CELL} />
                          </td>
                          <td className="border border-slate-200 p-0 w-20">
                            <NumIn value={m.waitDays} onChange={(n) => up({ waitDays: n })} />
                          </td>
                          <td className={`${erp.td} text-center w-24 bg-slate-50/70`}>{my(msCashMonth(m))}</td>
                          <td className={`${erp.td} text-center border-r-0 w-10`}>
                            <DelBtn onClick={() => set('milestones', f.milestones.filter((x) => x.id !== m.id))} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className={erp.totalRow}>
                      <td colSpan={3} className={`${erp.td} border-l-0`}>
                        TỔNG
                      </td>
                      <td className={`${erp.td} ${erp.num} ${Math.abs(msTotal.pct - 100) > 0.01 ? 'text-rose-600' : ''}`}>{msTotal.pct}%</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(msTotal.val)}</td>
                      <td className={erp.td} />
                      <td className={`${erp.td} ${erp.num}`}>{money(msTotal.cash)}</td>
                      <td colSpan={5} className={`${erp.td} border-r-0`} />
                    </tr>
                    <tr>
                      <td colSpan={12} className="px-2 py-1 border-t border-slate-200">
                        <AddRow onClick={() => set('milestones', [...f.milestones, newMilestone()])} />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="mt-1.5 text-[11.5px] text-slate-500">
                Số liệu đổ sang kế hoạch theo tháng (màn Báo cáo hiệu quả dự án, Tổng quan): <b className="text-emerald-700">Thời điểm + Giá trị → Doanh thu kế hoạch</b> của tháng đó;{' '}
                <b className="text-[#1f5fa8]">Tháng thu tiền + Giá trị thu đợt này → Dòng tiền thu kế hoạch</b>. Tháng thu tiền = Thời gian gửi hồ sơ (hoặc Thời điểm) + Thời gian chờ quy ra tháng.
              </p>
            </Section>

            {/* 4. Kế hoạch chi phí theo tháng */}
            <CostPlan f={f} setCosts={(costs) => set('costs', costs)} />
          </>
        ) : (
          /* 3. Mốc kế hoạch và mục tiêu (chưa ký) */
          <Section title="3. Mốc kế hoạch và mục tiêu">
            <div className="overflow-x-auto border border-slate-200 rounded-[3px]">
              <table className={`${erp.table} min-w-[1000px]`}>
                <thead>
                  <tr>
                    {['TT', 'Giai đoạn', 'Từ', 'Đến'].map((h) => (
                      <th key={h} rowSpan={2} className={`${erp.th} text-center border-t-0 first:border-l-0`}>
                        {h}
                      </th>
                    ))}
                    <th colSpan={3} className={`${erp.th} text-center border-t-0`}>
                      Tổng mức đầu tư (VNĐ)
                    </th>
                    {['Kết quả đầu ra', 'File đính kèm', ''].map((h, i) => (
                      <th key={i} rowSpan={2} className={`${erp.th} text-center border-t-0 last:border-r-0`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {['Sản xuất', 'Kinh doanh', 'Tổng'].map((h) => (
                      <th key={h} className={`${erp.th} text-center font-medium`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {f.phases.map((ph, i) => {
                    const up = (patch: Partial<typeof ph>) => set('phases', f.phases.map((x) => (x.id === ph.id ? { ...x, ...patch } : x)));
                    return (
                      <tr key={ph.id} className={erp.tr}>
                        <td className={`${erp.td} text-center text-slate-500 border-l-0 w-10`}>{i + 1}</td>
                        <td className="border border-slate-200 p-0 w-52">
                          <input value={ph.name} onChange={(e) => up({ name: e.target.value })} placeholder="Giai đoạn" className={CELL} />
                        </td>
                        <td className="border border-slate-200 p-0 w-24 min-w-[92px]">
                          <MonthIn value={ph.from} onChange={(v) => up({ from: v })} />
                        </td>
                        <td className="border border-slate-200 p-0 w-24 min-w-[92px]">
                          <MonthIn value={ph.to} onChange={(v) => up({ to: v })} />
                        </td>
                        <td className="border border-slate-200 p-0 w-36">
                          <NumIn value={ph.sx} onChange={(n) => up({ sx: n })} />
                        </td>
                        <td className="border border-slate-200 p-0 w-36">
                          <NumIn value={ph.kd} onChange={(n) => up({ kd: n })} />
                        </td>
                        <td className={`${erp.td} ${erp.num} w-36 bg-slate-50/70`}>{money(ph.sx + ph.kd)}</td>
                        <td className="border border-slate-200 p-0">
                          <input value={ph.output} onChange={(e) => up({ output: e.target.value })} placeholder="Kết quả đầu ra" className={CELL} />
                        </td>
                        <td className="border border-slate-200 p-0 w-48">
                          <Files files={ph.files} onChange={(files) => up({ files })} />
                        </td>
                        <td className={`${erp.td} text-center border-r-0 w-10`}>
                          <DelBtn onClick={() => set('phases', f.phases.filter((x) => x.id !== ph.id))} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className={erp.totalRow}>
                    <td colSpan={4} className={`${erp.td} border-l-0`}>
                      TỔNG
                    </td>
                    <td className={`${erp.td} ${erp.num}`}>{money(t.sx)}</td>
                    <td className={`${erp.td} ${erp.num}`}>{money(t.kd)}</td>
                    <td className={`${erp.td} ${erp.num}`}>{money(t.cost)}</td>
                    <td colSpan={3} className={`${erp.td} border-r-0`} />
                  </tr>
                  <tr>
                    <td colSpan={10} className="px-2 py-1 border-t border-slate-200">
                      <AddRow onClick={() => set('phases', [...f.phases, newPhase()])} />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Section>
        )}
      </fieldset>

      {/* Kế hoạch cập nhật thông tin hợp đồng sau khi lập PAKD */}
      <Section title="Kế hoạch cập nhật thông tin hợp đồng sau khi lập PAKD">
        <div className="px-3 py-2.5 rounded-[4px] bg-[#f4f8fd] border border-[#d6e4f5] text-[12.5px] text-slate-700 space-y-1">
          {signed ? (
            <p className="flex items-start gap-1.5">
              {deviation > MAX_DEVIATION ? <AlertTriangle size={14} className="text-amber-600 mt-0.5 shrink-0" /> : <Info size={14} className="text-[#1f5fa8] mt-0.5 shrink-0" />}
              <span>
                Đối chiếu: giá trị hợp đồng <b>{money(p.contract?.value ?? f.contractValue)}</b> so với doanh thu PAKD <b>{money(t.revenue)}</b>. Cảnh báo nếu lệch quá {pct(MAX_DEVIATION)}
                {deviation > MAX_DEVIATION && <b className="text-amber-700"> — đang lệch {pct(deviation)}</b>}.
              </span>
            </p>
          ) : f.expectedSignMonth ? (
            <p className="flex items-start gap-1.5">
              <Info size={14} className="text-[#1f5fa8] mt-0.5 shrink-0" />
              <span>
                Nhắc cập nhật thông tin hợp đồng từ <b>01/{my(addMonths(f.expectedSignMonth, -1))}</b>. Cảnh báo nếu quá tháng dự kiến ký <b>{my(f.expectedSignMonth)}</b>.
              </span>
            </p>
          ) : (
            <p className="flex items-start gap-1.5">
              <Info size={14} className="text-[#1f5fa8] mt-0.5 shrink-0" />
              <span>
                PAKD tạm: cập nhật thông tin hợp đồng (giá trị, ngày ký) ngay khi có. Hệ thống nhắc định kỳ. Chưa tính vào Dự kiến ký còn lại của khối cho đến khi có ngày dự kiến ký.
              </span>
            </p>
          )}
          <p className="flex items-start gap-1.5 text-slate-600">
            <FileText size={14} className="text-slate-400 mt-0.5 shrink-0" />
            Khi có hợp đồng ký, hệ thống đối chiếu giá trị ký với PAKD và cảnh báo nếu lệch; lập bản điều chỉnh PAKD khi cần.
          </p>
        </div>
      </Section>
    </Panel>
  );
};
