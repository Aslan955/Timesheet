/**
 * PakdForm — "Lập phương án kinh doanh (PAKD)" trên màn chi tiết dự án.
 * Hiện sau khi GĐK duyệt mã. AM / GĐK nhập trong PAKD_DAYS ngày kể từ ngày cấp mã,
 * lưu nháp hoặc gửi Kế toán (CFO) duyệt. Bố cục theo 2 sheet của file Excel mẫu:
 *   Tình trạng dự án = "Đã ký"  → Thông tin HĐ · Tiến độ & phạm vi · Nghiệm thu & thu tiền · Chi phí
 *   Tình trạng dự án = "Chưa ký" → Thông tin dự kiến · Phạm vi · Rủi ro · Mốc kế hoạch & mục tiêu
 * Dữ liệu & công thức: src/business/pakd.ts
 */
import React, { useMemo, useRef, useState } from 'react';
import { AlertCircle, AlertTriangle, BarChart3, ClipboardList, FileText, Info, Paperclip, Plus, Save, Send, X } from 'lucide-react';
import { BizProject, BizRole, PAKD_DAYS, latestPakd } from '../business/BusinessProjectContext';
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
  newMilestone,
  newPhase,
  pakdTotals,
  validatePakd,
} from '../business/pakd';
import { Btn, KpiBox, Panel, Tag, erp } from './erp/Erp';

const money = (n: number) => Math.round(n || 0).toLocaleString('en-US');

/** Dự án đã có số liệu chi phí kế hoạch (dữ liệu cũ / import) → điền sẵn vào form PAKD để không lệch lợi nhuận. */
const seedCosts = (p: BizProject): Partial<PakdFormData> => {
  const sx = p.plannedProductionCost || 0;
  const kd = p.plannedBusinessCost || 0;
  if (!sx && !kd) return {};
  const from = (p.contract?.from || p.startDate || '').slice(0, 7);
  const to = (p.contract?.to || p.endDate || '').slice(0, 7);
  if (p.contractSigned)
    return {
      costs: [
        { ...newCost('Sản xuất'), item: 'Chi phí sản xuất kế hoạch', month: from, amount: sx },
        { ...newCost('Kinh doanh'), item: 'Chi phí kinh doanh kế hoạch', month: from, amount: kd },
      ],
    };
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
const NumIn: React.FC<{ value: number; onChange: (n: number) => void; className?: string; placeholder?: string; decimals?: boolean }> = ({
  value,
  onChange,
  className = CELL,
  placeholder = '0',
  decimals,
}) => (
  <input
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
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLInputElement).blur()}
      placeholder="MM/YYYY"
      title={bad ? 'Nhập đúng dạng MM/YYYY' : 'MM/YYYY'}
      className={`${className} text-center tabular-nums ${bad ? 'bg-rose-50 text-rose-700' : ''}`}
    />
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
// Biểu đồ (SVG, một trục VNĐ)
// --------------------------------------------------------------------------
const C_IN = '#1f5fa8';
const C_OUT = '#e0883a';
const C_LINE = '#334155';

type Series = { key: string; label: string; color: string; kind: 'bar' | 'line'; values: number[] };
const MiniChart: React.FC<{ months: string[]; series: Series[]; empty: string }> = ({ months, series, empty }) => {
  const [hover, setHover] = useState<number | null>(null);
  if (!months.length) return <p className="h-[220px] flex items-center justify-center text-[12px] text-slate-400 text-center px-6">{empty}</p>;
  const all = series.flatMap((s) => s.values);
  const max = Math.max(0, ...all);
  const min = Math.min(0, ...all);
  const W = 640;
  const H = 210;
  const L = 74;
  const B = 22;
  const T = 8;
  const span = max - min || 1;
  const y = (v: number) => T + ((max - v) / span) * (H - T - B);
  const slot = (W - L - 6) / months.length;
  const x = (i: number) => L + slot * i + slot / 2;
  const bars = series.filter((s) => s.kind === 'bar');
  const bw = Math.min(16, (slot * 0.7) / Math.max(1, bars.length));
  const ticks = Array.from({ length: 5 }, (_, i) => min + (span * i) / 4);
  const fmtAxis = (v: number) => (Math.abs(v) >= 1e9 ? `${(v / 1e9).toFixed(1)} tỷ` : Math.abs(v) >= 1e6 ? `${Math.round(v / 1e6)} tr` : money(v));
  const every = Math.ceil(months.length / 12);
  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-3 text-[11.5px] text-slate-600 mb-1">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5">
            {s.kind === 'bar' ? <span className="w-3 h-3 rounded-[2px]" style={{ background: s.color }} /> : <span className="w-4 h-[2px]" style={{ background: s.color }} />}
            {s.label}
          </span>
        ))}
        <span className="text-slate-400">ĐVT: VNĐ</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[220px]" onMouseLeave={() => setHover(null)}>
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
              return <rect key={s.key} x={x0} y={Math.min(y(v), y(0))} width={bw} height={Math.max(0.5, Math.abs(y(v) - y(0)))} rx={2} fill={s.color} />;
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
export const PakdForm: React.FC<{
  project: BizProject;
  role: BizRole;
  actor: string;
  onSave: (form: PakdFormData, submit: boolean) => void;
}> = ({ project: p, role, actor, onSave }) => {
  const initial = () =>
    p.pakdForm
      ? structuredClone(p.pakdForm)
      : {
          ...emptyPakd(p.contractSigned, p.contract?.value ?? p.expectedRevenue),
          contractNo: p.contract?.number || '',
          contractDate: p.contract?.signDate || '',
          startMonth: (p.contract?.from || p.startDate || '').slice(0, 7),
          endMonth: (p.contract?.to || p.endDate || '').slice(0, 7),
          expectedSignMonth: (p.expectedSignDate || '').slice(0, 7),
          ...seedCosts(p),
        };
  const [f, setF] = useState<PakdFormData>(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const [lastKey, setLastKey] = useState(`${p.id}-${p.pakdForm?.savedAt || ''}`);
  const key = `${p.id}-${p.pakdForm?.savedAt || ''}`;
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
  const editable = p.status === 'Chưa có PAKD' && (role === 'AM' || role === 'GĐK');
  const state = !last ? 'Nháp' : last.state === 'Chờ CFO' ? 'Chờ duyệt' : last.state === 'Đã duyệt' ? 'Đã duyệt' : p.status === 'Chưa có PAKD' ? 'Từ chối — làm lại' : last.state;
  const stateCls =
    state === 'Đã duyệt' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : state === 'Chờ duyệt' ? 'bg-amber-50 text-amber-700 border-amber-300' : state.startsWith('Từ chối') ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-slate-100 text-slate-700 border-slate-300';
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
    if (e.length) return;
    onSave(f, submit);
  };

  // Hàng tiêu đề (theo mẫu): Mã dự án · Tên dự án · Khối · Người lập · Hạn lập PAKD · Thời gian còn lại · Trạng thái PAKD
  const header: [string, React.ReactNode][] = [
    ['Mã dự án', <span className={erp.code}>{p.masterCode || '—'}</span>],
    ['Tên dự án', p.name],
    ['Khối', p.division],
    ['Người lập', p.pakdForm?.savedBy || last?.submittedBy || actor],
    ['Hạn lập PAKD', dmy(p.pakdDeadline)],
    ['Thời gian còn lại', <span className={left !== null && left <= 3 && !p.pakd.length ? 'text-rose-600' : ''}>{leftText}</span>],
    ['Trạng thái PAKD', <Tag cls={stateCls}>{state}</Tag>],
  ];

  return (
    <Panel
      title="Lập phương án kinh doanh (PAKD)"
      icon={ClipboardList}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            {editable
              ? `AM / GĐK nhập PAKD trong ${PAKD_DAYS} ngày kể từ ngày cấp mã → Gửi Kế toán (CFO) duyệt. Bị từ chối thì sửa và gửi lại.`
              : p.status === 'Chưa có PAKD'
                ? 'Chọn vai trò AM hoặc GĐK để nhập PAKD.'
                : 'PAKD đã gửi duyệt — chỉ xem.'}
            {p.pakdForm?.savedAt && <> · Lưu lần cuối {dmy(p.pakdForm.savedAt)} bởi {p.pakdForm.savedBy}</>}
          </span>
          {editable && (
            <span className="flex items-center gap-2">
              <Btn icon={Save} className="h-8" onClick={() => save(false)}>
                Lưu nháp
              </Btn>
              <Btn variant="success" icon={Send} className="h-8" onClick={() => save(true)}>
                Gửi Kế toán duyệt
              </Btn>
            </span>
          )}
        </div>
      }
    >
      <div id="pakd-form" className="scroll-mt-16" />
      {/* Thông tin chung */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 pb-3 border-b border-slate-200">
        {header.map(([k, v]) => (
          <div key={k} className="min-w-0">
            <p className="text-[11.5px] text-slate-500 mb-1">{k}</p>
            <div className="text-[13px] font-semibold text-slate-800 truncate">{v}</div>
          </div>
        ))}
      </div>

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
          <div className="flex-[3] min-w-[420px] border border-slate-200 rounded-[4px] p-3">
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
                  { key: 'sx', label: 'Sản xuất', color: C_IN, kind: 'line', values: flow.map((x) => x.sx) },
                  { key: 'kd', label: 'Kinh doanh', color: C_OUT, kind: 'line', values: flow.map((x) => x.kd) },
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
        {/* 1. Thông tin dự án */}
        <Section title="1. Thông tin dự án">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Field label="Tình trạng dự án" required>
              <select value={f.contractState} onChange={(e) => set('contractState', e.target.value as PakdFormData['contractState'])} className={INP}>
                <option>Đã ký</option>
                <option>Chưa ký</option>
              </select>
            </Field>
            {signed ? (
              <>
                <Field label="Số hợp đồng">
                  <input value={f.contractNo} onChange={(e) => set('contractNo', e.target.value)} placeholder="VD: HĐ-022/688/2026" className={INP} />
                </Field>
                <Field label="Ngày ký trên hợp đồng">
                  <input type="date" value={f.contractDate} onChange={(e) => set('contractDate', e.target.value)} className={INP} />
                </Field>
                <Field label="Ngày ký thực tế">
                  <input type="date" value={f.actualSignDate} onChange={(e) => set('actualSignDate', e.target.value)} className={INP} />
                </Field>
                <Field label="Giá trị hợp đồng (VNĐ)" required>
                  <NumIn value={f.contractValue} onChange={(n) => set('contractValue', n)} className={INP} />
                </Field>
              </>
            ) : (
              <>
                <Field label="Thời điểm dự kiến ký" required>
                  <MonthIn value={f.expectedSignMonth} onChange={(v) => set('expectedSignMonth', v)} className={INP} />
                </Field>
                <Field label="Giá trị hợp đồng dự kiến (VNĐ)" required>
                  <NumIn value={f.expectedValue} onChange={(n) => set('expectedValue', n)} className={INP} />
                </Field>
                <Field label="Xác suất thành công (%)">
                  <NumIn value={f.probability} onChange={(n) => set('probability', Math.min(100, n))} className={INP} decimals />
                </Field>
              </>
            )}
          </div>
          {!signed && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <Field label="Phạm vi công việc" required>
                <textarea value={f.scope} onChange={(e) => set('scope', e.target.value)} rows={3} className={`${INP} h-auto py-1.5`} />
              </Field>
              <Field label="Đánh giá rủi ro" required>
                <textarea value={f.risk} onChange={(e) => set('risk', e.target.value)} rows={3} className={`${INP} h-auto py-1.5`} />
              </Field>
            </div>
          )}
        </Section>

        {signed ? (
          <>
            {/* 2. Tiến độ và phạm vi */}
            <Section title="2. Tiến độ và phạm vi (theo hợp đồng)">
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
              <Field label="Phạm vi công việc" required className="mt-3">
                <textarea value={f.scope} onChange={(e) => set('scope', e.target.value)} rows={3} className={`${INP} h-auto py-1.5`} />
              </Field>
            </Section>

            {/* 3. Nghiệm thu, ghi nhận doanh thu và thu tiền */}
            <Section title="3. Nghiệm thu, ghi nhận doanh thu và thu tiền">
              <div className="overflow-x-auto border border-slate-200 rounded-[3px]">
                <table className={`${erp.table} min-w-[1150px]`}>
                  <thead>
                    <tr>
                      {['STT', 'Mốc', 'Thời điểm', '%', 'Giá trị', 'Tỷ lệ được thanh toán (%)', 'Giá trị thu đợt này', 'Thời gian gửi hồ sơ', 'Điều kiện nghiệm thu', 'Thời gian chờ (ngày)', 'Tháng thu tiền', ''].map((h, i) => (
                        <th key={i} className={`${erp.th} text-center border-t-0 first:border-l-0 last:border-r-0 whitespace-normal`}>
                          {h}
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
            </Section>

            {/* 4. Chi phí */}
            <Section title="4. Chi phí">
              <div className="overflow-x-auto border border-slate-200 rounded-[3px]">
                <table className={`${erp.table} min-w-[1000px]`}>
                  <thead>
                    <tr>
                      {['Nhóm chi phí', 'Khoản mục chi phí', 'Thời điểm', 'Giá trị (VNĐ)', 'Kết quả đầu ra', 'File đính kèm', ''].map((h, i) => (
                        <th key={i} className={`${erp.th} text-center border-t-0 first:border-l-0 last:border-r-0`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {f.costs.map((c) => {
                      const up = (patch: Partial<typeof c>) => set('costs', f.costs.map((x) => (x.id === c.id ? { ...x, ...patch } : x)));
                      return (
                        <tr key={c.id} className={erp.tr}>
                          <td className="border border-slate-200 border-l-0 p-0 w-48">
                            <select value={c.group} onChange={(e) => up({ group: e.target.value as CostGroup })} className={CELL}>
                              {COST_GROUPS.map((g) => (
                                <option key={g}>{g}</option>
                              ))}
                            </select>
                          </td>
                          <td className="border border-slate-200 p-0 w-52">
                            <input value={c.item} onChange={(e) => up({ item: e.target.value })} placeholder="Khoản mục" className={CELL} />
                          </td>
                          <td className="border border-slate-200 p-0 w-24">
                            <MonthIn value={c.month} onChange={(v) => up({ month: v })} />
                          </td>
                          <td className="border border-slate-200 p-0 w-36">
                            <NumIn value={c.amount} onChange={(n) => up({ amount: n })} />
                          </td>
                          <td className="border border-slate-200 p-0">
                            <input value={c.output} onChange={(e) => up({ output: e.target.value })} placeholder="Kết quả đầu ra" className={CELL} />
                          </td>
                          <td className="border border-slate-200 p-0 w-52">
                            <Files files={c.files} onChange={(files) => up({ files })} />
                          </td>
                          <td className={`${erp.td} text-center border-r-0 w-10`}>
                            <DelBtn onClick={() => set('costs', f.costs.filter((x) => x.id !== c.id))} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className={erp.totalRow}>
                      <td colSpan={3} className={`${erp.td} border-l-0`}>
                        TỔNG CHI PHÍ
                      </td>
                      <td className={`${erp.td} ${erp.num}`}>{money(t.cost)}</td>
                      <td colSpan={3} className={`${erp.td} border-r-0`} />
                    </tr>
                    <tr>
                      <td colSpan={7} className="px-2 py-1 border-t border-slate-200">
                        <AddRow onClick={() => set('costs', [...f.costs, newCost()])} />
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Section>
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
