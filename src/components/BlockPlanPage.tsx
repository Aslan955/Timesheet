/**
 * BlockPlanPage — "Lập kế hoạch khối" (module Quản trị dự án & Tài chính).
 *
 * Giám đốc khối nhập kế hoạch theo tháng cho tất cả dự án của khối trên MỘT bảng, gõ như Excel:
 *   • Mỗi dự án 4 dòng: Doanh thu dự kiến · Chi dự kiến · Dòng tiền thu · Khối lượng công việc (SP)
 *   • Cột 12 tháng + Cả năm (gõ vào Cả năm → rải đều cho các tháng dự án đang chạy)
 *   • Gõ tắt 1.2 tỷ / 500tr / 35k; Enter xuống dòng, Tab sang phải, Ctrl+Enter điền sang phải,
 *     dán nhiều ô từ Excel; ô đã sửa chưa lưu nền vàng; tháng ngoài thời gian dự án bị khoá.
 *   • Lấy từ PAKD · Dòng tiền = Doanh thu lệch 1 tháng · Import Excel cả khối
 *   • 4 ô KPI (so với mục tiêu khối) và biểu đồ Doanh thu – Chi – Dòng tiền thu cập nhật ngay khi gõ.
 * Luồng: Nháp → Gửi Kế toán duyệt → Duyệt (ghi vào kế hoạch dự án) / Trả lại. Đã duyệt → Điều chỉnh (phiên bản mới).
 * Chưa có đăng nhập: chọn Vai trò / Khối trên màn để thao tác thử.
 * ĐVT: VNĐ · KLCV: SP.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, ClipboardList, FileSpreadsheet, History, PenLine, RotateCcw, Save, Send, Table2, Undo2, Wand2, X, XCircle } from 'lucide-react';
import { BizProject, DIVISIONS, useBusinessProjects } from '../business/BusinessProjectContext';
import { BlockPlanDoc, BlockPlanStatus, PlanCells, blockProjects, cellsFromProjects, projectMonthsInYear, useBlockPlans, yearMonths } from '../business/BlockPlanContext';
import { GRID_METRICS, GridMetric, cashFromRevenue, cellChanged, fillFromPakd, fmtNum, fmtShort, metricValue, parseAmount, setCell, spreadEven, sumMetric } from '../business/blockPlan';
import { BlockPlanImportModal } from './BlockPlanImportModal';
import { Btn, ErpPage, ErpTitleBar, KpiBox, Panel, Tag, erp } from './erp/Erp';

const CRUMBS = ['Quản trị dự án & Tài chính', 'Lập kế hoạch khối'];
const YEARS = ['2025', '2026', '2027'];
type Role = 'GĐK' | 'CFO';
const ROLE_USER: Record<Role, string> = { 'GĐK': 'Giám đốc khối', CFO: 'ketoan' };
const STATUS_TAG: Record<BlockPlanStatus, string> = {
  'Nháp': 'bg-slate-50 text-slate-600 border-slate-300',
  'Chờ duyệt': 'bg-amber-50 text-amber-700 border-amber-300',
  'Đã duyệt': 'bg-emerald-50 text-emerald-700 border-emerald-300',
  'Trả lại': 'bg-rose-50 text-rose-700 border-rose-300',
};
// Màu biểu đồ: dùng chung với màn Tổng quan (đã validate palette)
const C = { revenue: '#1f5fa8', cost: '#e0883a', cash: '#334155' };

const fmtMonth = (m: string) => `${m.slice(5, 7)}/${m.slice(0, 4)}`;
const dt = (iso?: string) => (iso ? new Date(iso).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '—');
const pct = (r: number | null, d = 0) => (r === null || !isFinite(r) ? '—' : `${(r * 100).toFixed(d)}%`);

// ==========================================================================
// Ô nhập số kiểu bảng tính
// ==========================================================================
const NumCell: React.FC<{
  value: number;
  disabled?: boolean;
  changed?: boolean;
  bold?: boolean;
  r: number;
  c: number;
  onCommit: (v: number) => void;
  onMove: (dr: number, dc: number) => void;
  onFillRight?: () => void;
  onPasteMatrix?: (m: string[][]) => void;
}> = ({ value, disabled, changed, bold, r, c, onCommit, onMove, onFillRight, onPasteMatrix }) => {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState('');
  const [bad, setBad] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const commit = () => {
    const v = parseAmount(text);
    if (v === null) {
      setBad(true);
      setTimeout(() => setBad(false), 1200);
      return false;
    }
    if (v !== value) onCommit(v);
    return true;
  };

  if (disabled)
    return (
      <td className={`${erp.td} bg-slate-100/80 text-center text-slate-300 select-none`} title="Ngoài thời gian dự án">
        –
      </td>
    );
  return (
    <td className={`border border-slate-200 p-0 ${changed ? 'bg-[#fff6d6]' : ''}`}>
      <input
        ref={ref}
        data-r={r}
        data-c={c}
        value={focused ? text : fmtNum(value)}
        placeholder={focused ? '' : '0'}
        onChange={(e) => setText(e.target.value)}
        onFocus={(e) => {
          setText(value ? String(value) : '');
          setFocused(true);
          requestAnimationFrame(() => e.target.select());
        }}
        onBlur={() => {
          commit();
          setFocused(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (!commit()) return;
            if (e.ctrlKey || e.metaKey) onFillRight?.();
            else onMove(e.shiftKey ? -1 : 1, 0);
          } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            if (commit()) onMove(e.key === 'ArrowDown' ? 1 : -1, 0);
          } else if (e.key === 'Escape') {
            setText(value ? String(value) : '');
            ref.current?.blur();
          }
        }}
        onPaste={(e) => {
          const t = e.clipboardData.getData('text');
          if (!onPasteMatrix || !/[\t\n]/.test(t)) return;
          e.preventDefault();
          const matrix = t
            .replace(/\r/g, '')
            .split('\n')
            .filter((line, i, arr) => !(i === arr.length - 1 && line === ''))
            .map((line) => line.split('\t'));
          onPasteMatrix(matrix);
        }}
        className={`w-full h-[30px] px-1.5 text-right text-[11.5px] tabular-nums bg-transparent outline-none placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-inset ${
          bad ? 'ring-2 ring-inset ring-rose-500 bg-rose-50' : 'focus:ring-[#1f5fa8]'
        } ${bold ? 'font-bold text-slate-900' : 'text-slate-800'}`}
        title={bad ? 'Không đọc được số. Ví dụ: 1200000 · 1.2 tỷ · 500tr · 35k' : undefined}
      />
    </td>
  );
};

// ==========================================================================
// Biểu đồ Doanh thu – Chi (cột) & Dòng tiền thu (đường) theo tháng
// ==========================================================================
const PlanChart: React.FC<{ months: string[]; revenue: number[]; cost: number[]; cash: number[] }> = ({ months, revenue, cost, cash }) => {
  const [hover, setHover] = useState<number | null>(null);
  const H = 200;
  const rawMax = Math.max(1, ...revenue, ...cost, ...cash);
  const p = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const n = rawMax / p;
  const max = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const h = (v: number) => `${Math.max(0, (v / max) * 100)}%`;
  const pts = cash.map((v, i) => `${((i + 0.5) / months.length) * 100},${100 - (v / max) * 100}`).join(' ');
  const empty = rawMax <= 1;
  return (
    <div>
      <div className="flex items-center gap-4 text-[11px] text-slate-600 mb-1">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[2px]" style={{ background: C.revenue }} /> Doanh thu dự kiến
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-[2px]" style={{ background: C.cost }} /> Chi dự kiến
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-0.5" style={{ background: C.cash }} /> Dòng tiền thu
        </span>
        <span className="text-slate-400 ml-auto">ĐVT: VNĐ</span>
      </div>
      <div className="flex pt-4">
        <div className="relative w-24 shrink-0" style={{ height: H }}>
          {ticks.map((t) => (
            <span key={t} className="absolute right-2 text-[10px] text-slate-500 tabular-nums -translate-y-1/2 whitespace-nowrap" style={{ bottom: h(t) }}>
              {fmtShort(t)}
            </span>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="relative border-l border-slate-300" style={{ height: H }}>
            {ticks.map((t) => (
              <div key={t} className={`absolute inset-x-0 border-t ${t === 0 ? 'border-slate-400' : 'border-dashed border-slate-200'}`} style={{ bottom: h(t) }} />
            ))}
            <div className="absolute inset-0 flex">
              {months.map((m, i) => (
                <div
                  key={m}
                  className={`flex-1 flex items-end justify-center gap-[3px] ${hover === i ? 'bg-[#eaf2fc]' : ''}`}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <div className="w-[min(22px,32%)] rounded-t-[2px]" style={{ height: h(revenue[i]), background: C.revenue }} />
                  <div className="w-[min(22px,32%)] rounded-t-[2px]" style={{ height: h(cost[i]), background: C.cost }} />
                </div>
              ))}
            </div>
            {!empty && (
              <>
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline points={pts} fill="none" stroke={C.cash} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                </svg>
                {cash.map((v, i) => (
                  <span
                    key={i}
                    className="absolute w-2 h-2 rounded-full border-2 border-white -translate-x-1/2 translate-y-1/2 pointer-events-none"
                    style={{ left: `${((i + 0.5) / months.length) * 100}%`, bottom: h(v), background: C.cash }}
                  />
                ))}
              </>
            )}
            {hover !== null && (
              <div
                className="absolute top-0 z-10 pointer-events-none bg-white border border-slate-300 rounded-[3px] shadow-md text-[11px] whitespace-nowrap"
                style={{ left: `${((hover + 0.5) / months.length) * 100}%`, transform: `translateX(${hover > months.length / 2 ? '-105%' : '5%'})` }}
              >
                <p className="font-bold px-2.5 py-1 bg-[#e8edf4] border-b border-slate-300 text-[#1e3a5f]">{fmtMonth(months[hover])}</p>
                <table className="tabular-nums">
                  <tbody>
                    {[
                      ['Doanh thu dự kiến', revenue[hover], C.revenue],
                      ['Chi dự kiến', cost[hover], C.cost],
                      ['Dòng tiền thu', cash[hover], C.cash],
                    ].map(([l, v, col]) => (
                      <tr key={l as string}>
                        <td className="px-2.5 py-0.5 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm" style={{ background: col as string }} /> {l}
                        </td>
                        <td className="px-2.5 py-0.5 text-right font-semibold">{fmtNum(v as number) || '0'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="flex mt-1.5">
            {months.map((m) => (
              <span key={m} className="flex-1 text-center text-[10px] text-slate-500 tabular-nums">
                {fmtMonth(m)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// Hộp thoại Kế toán duyệt / trả lại
// ==========================================================================
const DecisionModal: React.FC<{ approve: boolean; division: string; year: string; onClose: () => void; onConfirm: (note: string) => void }> = ({ approve, division, year, onClose, onConfirm }) => {
  const [note, setNote] = useState('');
  const need = !approve && !note.trim();
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-[4px] border border-slate-400 shadow-2xl">
        <div className="px-4 py-2.5 border-b border-slate-300 bg-gradient-to-b from-[#f7f9fc] to-[#edf1f6] flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-[#1e3a5f]">
            {approve ? 'Duyệt kế hoạch' : 'Trả lại kế hoạch'} — {division} · năm {year}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-[12px] text-slate-600">
            {approve
              ? 'Số liệu kế hoạch theo tháng của các dự án trong khối sẽ được ghi vào kế hoạch dự án và dùng cho Báo cáo hiệu quả, Tổng quan.'
              : 'Kế hoạch được trả về cho Giám đốc khối chỉnh sửa. Vui lòng ghi rõ lý do.'}
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={approve ? 'Ghi chú (không bắt buộc)' : 'Lý do trả lại (bắt buộc)'}
            className={`${erp.inputFull} h-auto py-1.5 resize-none`}
          />
        </div>
        <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 flex justify-end gap-1.5">
          <Btn icon={X} onClick={onClose}>
            Huỷ
          </Btn>
          <Btn variant={approve ? 'success' : 'danger'} icon={approve ? CheckCircle2 : XCircle} disabled={need} onClick={() => onConfirm(note.trim())}>
            {approve ? 'Duyệt kế hoạch' : 'Trả lại'}
          </Btn>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// Trang
// ==========================================================================
const SelectBox: React.FC<{ value: string; onChange: (v: string) => void; options: { key: string; label: string }[] }> = ({ value, onChange, options }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className="h-6 px-1 bg-white border border-slate-300 rounded-[3px] text-[12px] font-semibold text-[#1e3a5f] outline-none cursor-pointer">
    {options.map((o) => (
      <option key={o.key} value={o.key}>
        {o.label}
      </option>
    ))}
  </select>
);

export const BlockPlanPage: React.FC = () => {
  const { projects, targets } = useBusinessProjects();
  const { getDoc, saveDraft, submit, decide } = useBlockPlans();
  const [role, setRole] = useState<Role>('GĐK');
  const [division, setDivision] = useState('G2');
  const [year, setYear] = useState('2026');
  const [adjusting, setAdjusting] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [decision, setDecision] = useState<boolean | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [msg, setMsg] = useState('');
  const tableRef = useRef<HTMLTableElement>(null);

  const doc: BlockPlanDoc | undefined = getDoc(year, division);
  const status: BlockPlanStatus = doc?.status || 'Nháp';
  const rows = useMemo(() => blockProjects(projects, division), [projects, division]);
  const months = useMemo(() => yearMonths(year), [year]);
  const editableMonths = useMemo(() => new Map(rows.map((p) => [p.id, new Set(projectMonthsInYear(p, year))])), [rows, year]);

  // Số liệu gốc (đã lưu) & số liệu đang sửa
  const base = useMemo<PlanCells>(() => (doc ? doc.cells : cellsFromProjects(rows, year)), [doc, rows, year]);
  const [cells, setCells] = useState<PlanCells>(base);
  useEffect(() => {
    setCells(base);
    setAdjusting(false);
  }, [base]);

  const changedCount = useMemo(() => {
    let n = 0;
    rows.forEach((p) => months.forEach((m) => GRID_METRICS.forEach(({ key }) => cellChanged(cells, base, p.id, m, key) && n++)));
    return n;
  }, [cells, base, rows, months]);

  const canEdit = role === 'GĐK' && (status === 'Nháp' || status === 'Trả lại' || (status === 'Đã duyệt' && adjusting));
  const user = ROLE_USER[role];

  const flash = (s: string) => {
    setMsg(s);
    window.setTimeout(() => setMsg(''), 4000);
  };

  // ---- Tổng khối & KPI
  const totalOf = (k: GridMetric, ms: string[] = months) => rows.reduce((s, p) => s + sumMetric(cells, p.id, ms, k), 0);
  const tRevenue = totalOf('revenue');
  const tCost = totalOf('cost');
  const tCash = totalOf('cashIn');
  const tWork = totalOf('workload');
  const target = targets[year]?.[division] || 0;
  const perMonth = (k: GridMetric) => months.map((m) => totalOf(k, [m]));

  // ---- Thao tác ô
  const moveFrom = (r: number, c: number, dr: number) => {
    const t = tableRef.current;
    if (!t) return;
    const maxR = rows.length * GRID_METRICS.length;
    for (let rr = r + dr; rr >= 0 && rr < maxR; rr += dr) {
      const el = t.querySelector<HTMLInputElement>(`input[data-r="${rr}"][data-c="${c}"]`);
      if (el) return el.focus();
    }
  };
  const update = (p: BizProject, m: string, k: GridMetric, v: number) => setCells((cur) => setCell(cur, p, m, k, v));
  const spreadYear = (p: BizProject, k: GridMetric, total: number) => {
    const ms = months.filter((m) => editableMonths.get(p.id)?.has(m));
    const parts = spreadEven(total, ms.length, k !== 'workload');
    setCells((cur) => ms.reduce((acc, m, i) => setCell(acc, p, m, k, parts[i]), cur));
  };
  const fillRight = (p: BizProject, k: GridMetric, fromIdx: number) => {
    const v = metricValue(cells[p.id]?.[months[fromIdx]], k);
    setCells((cur) => months.slice(fromIdx + 1).reduce((acc, m) => (editableMonths.get(p.id)?.has(m) ? setCell(acc, p, m, k, v) : acc), cur));
  };
  const pasteAt = (r: number, c: number, matrix: string[][]) => {
    setCells((cur) => {
      let acc = cur;
      matrix.forEach((line, i) => {
        const rr = r + i;
        const p = rows[Math.floor(rr / GRID_METRICS.length)];
        const k = GRID_METRICS[rr % GRID_METRICS.length]?.key;
        if (!p || !k) return;
        line.forEach((cell, j) => {
          const m = months[c + j];
          if (!m || !editableMonths.get(p.id)?.has(m)) return;
          const v = parseAmount(cell);
          if (v !== null) acc = setCell(acc, p, m, k, v);
        });
      });
      return acc;
    });
    flash(`Đã dán ${matrix.length} dòng × ${Math.max(...matrix.map((l) => l.length))} cột từ clipboard`);
  };

  const applyAll = (fn: (c: PlanCells, p: BizProject) => PlanCells, label: string) => {
    setCells((cur) => rows.reduce((acc, p) => fn(acc, p), cur));
    flash(label);
  };

  // ---- Lưu / gửi / duyệt
  const onSave = () => {
    saveDraft(year, division, cells, user);
    flash(`Đã lưu nháp kế hoạch ${division} năm ${year} (${changedCount} ô thay đổi)`);
  };
  const onSubmit = () => {
    submit(year, division, cells, user);
    flash(`Đã gửi kế hoạch ${division} năm ${year} cho Kế toán duyệt`);
  };
  const onDecide = (approve: boolean, note: string) => {
    decide(year, division, approve, user, note);
    setDecision(null);
    flash(approve ? `Đã duyệt kế hoạch ${division} năm ${year} — số liệu đã ghi vào kế hoạch dự án` : `Đã trả lại kế hoạch ${division} năm ${year}`);
  };

  // ---- Header
  const actions = (
    <>
      {role === 'GĐK' && canEdit && (
        <>
          <Btn icon={FileSpreadsheet} onClick={() => setShowImport(true)}>
            Import Excel
          </Btn>
          {changedCount > 0 && (
            <Btn icon={Undo2} onClick={() => setCells(base)} title="Bỏ các thay đổi chưa lưu">
              Bỏ thay đổi
            </Btn>
          )}
          <Btn variant="primary" icon={Save} onClick={onSave} disabled={changedCount === 0 && !!doc}>
            Lưu nháp{changedCount > 0 && <span className="ml-1 px-1.5 rounded-[3px] bg-white/20 text-[11px]">{changedCount}</span>}
          </Btn>
          <Btn variant="success" icon={Send} onClick={onSubmit} disabled={rows.length === 0}>
            Gửi Kế toán duyệt
          </Btn>
        </>
      )}
      {role === 'GĐK' && status === 'Đã duyệt' && !adjusting && (
        <Btn variant="primary" icon={PenLine} onClick={() => setAdjusting(true)}>
          Điều chỉnh kế hoạch
        </Btn>
      )}
      {role === 'CFO' && status === 'Chờ duyệt' && (
        <>
          <Btn variant="danger" icon={XCircle} onClick={() => setDecision(false)}>
            Trả lại
          </Btn>
          <Btn variant="success" icon={CheckCircle2} onClick={() => setDecision(true)}>
            Duyệt kế hoạch
          </Btn>
        </>
      )}
      <Btn icon={History} onClick={() => setShowHistory((v) => !v)} disabled={!doc}>
        Lịch sử
      </Btn>
    </>
  );

  const notice = msg ? (
    <div className="px-4 py-1.5 bg-emerald-50 text-emerald-800 text-[12px] flex items-center gap-1.5">
      <CheckCircle2 size={13} /> {msg}
    </div>
  ) : status === 'Trả lại' ? (
    <div className="px-4 py-1.5 bg-rose-50 text-rose-800 text-[12px] flex items-center gap-1.5">
      <XCircle size={13} /> Kế toán trả lại ngày {dt(doc?.decidedAt)}: <strong>{doc?.note}</strong> — sửa lại rồi gửi duyệt lần nữa.
    </div>
  ) : status === 'Chờ duyệt' ? (
    <div className="px-4 py-1.5 bg-amber-50 text-amber-800 text-[12px] flex items-center gap-1.5">
      <Send size={13} /> {doc?.submittedBy} đã gửi duyệt lúc {dt(doc?.submittedAt)} · đang chờ Kế toán (CFO) duyệt{role === 'GĐK' && ' — không sửa được trong lúc chờ duyệt'}.
    </div>
  ) : status === 'Đã duyệt' && !adjusting ? (
    <div className="px-4 py-1.5 bg-emerald-50 text-emerald-800 text-[12px] flex items-center gap-1.5">
      <CheckCircle2 size={13} /> Đã duyệt lúc {dt(doc?.decidedAt)} bởi {doc?.decidedBy} · số liệu đã ghi vào kế hoạch dự án. Bấm "Điều chỉnh kế hoạch" để lập phiên bản mới.
    </div>
  ) : role === 'GĐK' && !doc ? (
    <div className="px-4 py-1.5 bg-slate-50 text-slate-600 text-[12px]">
      Khối {division} chưa có hồ sơ kế hoạch năm {year}. Số liệu đang hiển thị là kế hoạch hiện có của từng dự án — sửa rồi Lưu nháp để tạo hồ sơ.
    </div>
  ) : null;

  const kpiTone = (r: number | null, good: (x: number) => boolean) => (r === null ? 'neutral' : good(r) ? 'good' : 'bad');
  const rTarget = target ? tRevenue / target : null;
  const margin = tRevenue ? (tRevenue - tCost) / tRevenue : null;
  const rCash = tRevenue ? tCash / tRevenue : null;

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={CRUMBS}
        title="Lập kế hoạch khối"
        actions={actions}
        meta={[
          { label: 'Vai trò', value: <SelectBox value={role} onChange={(v) => setRole(v as Role)} options={[{ key: 'GĐK', label: 'Giám đốc khối (GĐK)' }, { key: 'CFO', label: 'Kế toán (CFO)' }]} /> },
          { label: 'Khối', value: <SelectBox value={division} onChange={setDivision} options={DIVISIONS.map((d) => ({ key: d, label: d }))} /> },
          { label: 'Năm kế hoạch', value: <SelectBox value={year} onChange={setYear} options={YEARS.map((y) => ({ key: y, label: y }))} /> },
          { label: 'Trạng thái', value: <Tag cls={STATUS_TAG[status]}>{status}</Tag> },
          { label: 'Phiên bản', value: `V${doc?.version || 1}` },
          { label: 'Số dự án', value: rows.length },
          { label: 'ĐVT', value: 'VNĐ · KLCV: SP' },
        ]}
        notice={notice}
      />

      {showHistory && doc && (
        <Panel title="Lịch sử hồ sơ" icon={History} noPad>
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${erp.th} text-left border-t-0 border-l-0 w-44`}>Thời điểm</th>
                <th className={`${erp.th} text-left border-t-0`}>Người thực hiện</th>
                <th className={`${erp.th} text-left border-t-0`}>Thao tác</th>
                <th className={`${erp.th} text-left border-t-0 border-r-0`}>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {[...doc.history].reverse().map((h, i) => (
                <tr key={i} className={erp.tr}>
                  <td className={`${erp.td} border-l-0 tabular-nums`}>{dt(h.at)}</td>
                  <td className={erp.td}>{h.by}</td>
                  <td className={`${erp.td} font-semibold`}>{h.action}</td>
                  <td className={`${erp.td} border-r-0 text-slate-600`}>{h.note || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiBox
          label="Doanh thu dự kiến cả năm"
          value={fmtNum(tRevenue) || '0'}
          valueText={fmtNum(tRevenue)}
          badge={rTarget !== null ? pct(rTarget) : undefined}
          tone={kpiTone(rTarget, (x) => x >= 1)}
          sub={target ? `Mục tiêu khối (HĐ ký mới): ${fmtNum(target)}` : 'Khối chưa có mục tiêu năm này'}
        />
        <KpiBox
          label="Chi dự kiến cả năm"
          value={fmtNum(tCost) || '0'}
          valueText={fmtNum(tCost)}
          badge={margin !== null ? `LN gộp ${pct(margin)}` : undefined}
          tone={kpiTone(margin, (x) => x >= 0.2)}
          sub="Tách Chi SX / KD theo tỷ lệ chi phí kế hoạch của dự án"
        />
        <KpiBox
          label="Dòng tiền thu cả năm"
          value={fmtNum(tCash) || '0'}
          valueText={fmtNum(tCash)}
          badge={rCash !== null ? pct(rCash) : undefined}
          tone={kpiTone(rCash, (x) => x >= 0.9)}
          sub="So với doanh thu dự kiến"
        />
        <KpiBox label="Khối lượng công việc cả năm" value={fmtNum(tWork) || '0'} valueText={fmtNum(tWork)} sub="SP" />
      </div>

      {/* Bảng nhập */}
      <Panel
        title={`Kế hoạch theo tháng — khối ${division} · năm ${year}`}
        icon={Table2}
        noPad
        actions={
          canEdit && (
            <>
              <Btn icon={Wand2} className="h-7" onClick={() => applyAll((c, p) => fillFromPakd(c, p, year), 'Đã điền Doanh thu / Chi / Dòng tiền thu từ PAKD của các dự án')} title="Điền Doanh thu, Chi, Dòng tiền thu theo PAKD (hoặc thông tin dự án) cho tất cả dự án">
                Lấy từ PAKD
              </Btn>
              <Btn icon={RotateCcw} className="h-7" onClick={() => applyAll((c, p) => cashFromRevenue(c, p, year), 'Đã tính Dòng tiền thu = Doanh thu lệch 1 tháng')} title="Dòng tiền thu tháng N = Doanh thu tháng N-1; tháng cuối dự án thu nốt">
                Dòng tiền = Doanh thu lệch 1 tháng
              </Btn>
            </>
          )
        }
        footer={
          canEdit ? (
            <>
              Gõ tắt: <b>1.2 tỷ</b> · <b>500tr</b> · <b>35k</b> · Enter xuống dòng · Tab sang phải · <b>Ctrl+Enter</b> điền sang các tháng còn lại · dán nhiều ô từ Excel được · gõ vào cột <b>Cả năm</b> để rải đều · ô nền
              vàng = đã sửa, chưa lưu · ô xám = ngoài thời gian dự án.
            </>
          ) : (
            <>Chỉ xem. {role === 'CFO' ? 'Kế toán duyệt hoặc trả lại ở đầu trang.' : 'Giám đốc khối chỉ sửa được khi hồ sơ ở trạng thái Nháp / Trả lại.'}</>
          )
        }
      >
        {rows.length === 0 ? (
          <p className="px-3 py-10 text-center text-slate-400 italic text-[12px]">Khối {division} chưa có dự án nào được cấp mã.</p>
        ) : (
          <div className="overflow-x-auto">
            <table ref={tableRef} className={`${erp.table} text-[11.5px]`}>
              <thead>
                <tr>
                  <th className={`${erp.th} sticky left-0 z-20 text-left border-t-0 border-l-0 w-[190px] min-w-[190px]`}>Dự án</th>
                  <th className={`${erp.th} sticky left-[190px] z-20 text-left border-t-0 w-[104px] min-w-[104px]`}>Chỉ tiêu</th>
                  {months.map((m) => (
                    <th key={m} className={`${erp.th} text-right border-t-0 min-w-[90px]`}>
                      T{+m.slice(5, 7)}
                    </th>
                  ))}
                  <th className={`${erp.th} text-right border-t-0 border-r-0 min-w-[112px] bg-[#dfe6f0]`}>Cả năm</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p, pi) => {
                  const ok = editableMonths.get(p.id) || new Set<string>();
                  const span = `${fmtMonth(p.startDate.slice(0, 7))} → ${fmtMonth(p.endDate.slice(0, 7))}`;
                  return GRID_METRICS.map((met, mi) => {
                    const r = pi * GRID_METRICS.length + mi;
                    const yearTotal = sumMetric(cells, p.id, months, met.key);
                    const first = mi === 0;
                    const lastRow = mi === GRID_METRICS.length - 1;
                    return (
                      <tr key={`${p.id}-${met.key}`} className={`${lastRow ? '[&>td]:border-b-slate-300' : ''} ${pi % 2 ? 'bg-slate-50/60' : 'bg-white'}`}>
                        {first && (
                          <td rowSpan={GRID_METRICS.length} className={`${erp.td} sticky left-0 z-10 align-top border-l-0 border-b-slate-300 ${pi % 2 ? 'bg-[#f7f9fb]' : 'bg-white'}`}>
                            <p className="font-semibold text-slate-800 leading-tight" title={p.name}>
                              {p.name}
                            </p>
                            <p className="font-mono text-[11px] text-[#1f5fa8] mt-0.5">{p.masterCode}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{span}</p>
                            {canEdit && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCells((c) => fillFromPakd(c, p, year));
                                  flash(`Đã điền kế hoạch từ PAKD cho ${p.masterCode}`);
                                }}
                                className="mt-1.5 text-[11px] text-[#1f5fa8] hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <Wand2 size={11} /> Lấy từ PAKD
                              </button>
                            )}
                          </td>
                        )}
                        <td className={`${erp.td} sticky left-[190px] z-10 font-semibold whitespace-nowrap ${met.cls} ${pi % 2 ? 'bg-[#f7f9fb]' : 'bg-white'}`}>{met.short}</td>
                        {months.map((m, ci) =>
                          canEdit ? (
                            <NumCell
                              key={m}
                              r={r}
                              c={ci}
                              value={metricValue(cells[p.id]?.[m], met.key)}
                              disabled={!ok.has(m)}
                              changed={cellChanged(cells, base, p.id, m, met.key)}
                              onCommit={(v) => update(p, m, met.key, v)}
                              onMove={(dr) => moveFrom(r, ci, dr)}
                              onFillRight={() => fillRight(p, met.key, ci)}
                              onPasteMatrix={(mx) => pasteAt(r, ci, mx)}
                            />
                          ) : (
                            <td key={m} className={`${erp.td} ${erp.num} ${!ok.has(m) ? 'bg-slate-100/80 text-slate-300 text-center' : cellChanged(cells, base, p.id, m, met.key) ? 'bg-[#fff6d6]' : ''}`}>
                              {ok.has(m) ? fmtNum(metricValue(cells[p.id]?.[m], met.key)) || <span className="text-slate-300">0</span> : '–'}
                            </td>
                          ),
                        )}
                        {canEdit ? (
                          <NumCell
                            r={r}
                            c={12}
                            bold
                            value={yearTotal}
                            onCommit={(v) => spreadYear(p, met.key, v)}
                            onMove={(dr) => moveFrom(r, 12, dr)}
                          />
                        ) : (
                          <td className={`${erp.td} ${erp.num} border-r-0 font-bold`}>{fmtNum(yearTotal) || <span className="text-slate-300">0</span>}</td>
                        )}
                      </tr>
                    );
                  });
                })}
                {/* Tổng khối */}
                {GRID_METRICS.map((met, mi) => (
                  <tr key={`total-${met.key}`} className={erp.totalRow}>
                    {mi === 0 && (
                      <td rowSpan={GRID_METRICS.length} className={`${erp.td} sticky left-0 z-10 bg-[#fff6d6] align-top border-l-0`}>
                        TỔNG KHỐI {division}
                        <p className="text-[11px] font-normal text-slate-500 mt-0.5">{rows.length} dự án</p>
                      </td>
                    )}
                    <td className={`${erp.td} sticky left-[190px] z-10 bg-[#fff6d6] whitespace-nowrap ${met.cls}`}>{met.short}</td>
                    {months.map((m) => (
                      <td key={m} className={`${erp.td} ${erp.num}`}>
                        {fmtNum(totalOf(met.key, [m])) || '0'}
                      </td>
                    ))}
                    <td className={`${erp.td} ${erp.num} border-r-0 bg-[#ffefb3]`}>{fmtNum(totalOf(met.key)) || '0'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Biểu đồ */}
      {rows.length > 0 && (
        <Panel title={`Doanh thu – Chi – Dòng tiền thu theo tháng · khối ${division} · ${year}`} icon={ClipboardList} footer="Biểu đồ cập nhật ngay khi gõ số. Rê chuột vào tháng để xem con số.">
          <PlanChart months={months} revenue={perMonth('revenue')} cost={perMonth('cost')} cash={perMonth('cashIn')} />
        </Panel>
      )}

      {showImport && (
        <BlockPlanImportModal
          division={division}
          year={year}
          projects={rows}
          cells={cells}
          onClose={() => setShowImport(false)}
          onApply={(next, summary) => {
            setCells(next);
            setShowImport(false);
            flash(summary);
          }}
        />
      )}
      {decision !== null && <DecisionModal approve={decision} division={division} year={year} onClose={() => setDecision(null)} onConfirm={(note) => onDecide(decision, note)} />}
    </ErpPage>
  );
};
