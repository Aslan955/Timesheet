/**
 * PmoAllocationPage — PMO-09 Heatmap allocation khối (F8.1).
 *
 * Bố cục:
 *   hàng 1: thẻ tổng hợp (headcount, utilization tuần này, số người >100%, số người bench, capacity trống người-tuần)
 *   hàng 2: bộ lọc một hàng (level, vai trò, chỉ quá tải / chỉ bench)
 *   hàng 3: heatmap người × 12 tuần tới — hàng = nhân sự khối gốc + người khối khác đang làm dự án của khối (nhãn "liên khối");
 *           ô = tổng % allocation tuần (đỏ >100 · xanh đậm =100 · xanh nhạt 60–90 · vàng <60). Bench = <60% liên tục 2 tuần.
 *           Bấm một hàng → mở rộng ngay dưới: chi tiết dự án × tuần, sửa % trực tiếp (bước 10%), không cho lưu nếu tổng >100%.
 *
 * ALLOC_STORE: bản allocation sửa trong phiên, dùng chung cho PMO-10 (gán người / điều chuyển), PMO-11 (capacity), PMO-14 (timesheet).
 */
import React, { useMemo, useState } from 'react';
import { Filter, Grid3x3, Plus, Save, X } from 'lucide-react';
import { KHOI, PMO_PROJECTS, addDays } from '../../pmo/pmo';
import { ALLOCATION, AllocCell, LEVELS, NEXT_WEEKS, PEOPLE, Person, THIS_WEEK, weekLabel, weekNo } from '../../pmo/pmoData';
import { usePmo } from '../../pmo/PmoContext';
import { Btn, ErpPage, ErpTitleBar, Panel, Tag, erp } from '../erp/Erp';
import { RoleSelect } from './PmoBits';

// ==========================================================================
// Allocation dùng chung trong phiên (PMO-09/10/11/14)
// ==========================================================================
/** ALLOC_STORE[personCode][week] = các dự án và % — khởi tạo từ ALLOCATION, sửa trong phiên. */
export const ALLOC_STORE: Record<string, Record<string, AllocCell[]>> = Object.fromEntries(
  Object.entries(ALLOCATION).map(([code, weeks]) => [code, Object.fromEntries(Object.entries(weeks).map(([w, cells]) => [w, cells.map((c) => ({ ...c }))]))]),
);
export const allocCells = (code: string, week: string): AllocCell[] => ALLOC_STORE[code]?.[week] || [];
export const allocSum = (code: string, week: string) => allocCells(code, week).reduce((s, c) => s + c.pct, 0);
/** Ghi đè allocation của một người cho một tuần (bỏ ô 0%). */
export const setAllocCells = (code: string, week: string, cells: AllocCell[]) => {
  if (!ALLOC_STORE[code]) ALLOC_STORE[code] = {};
  ALLOC_STORE[code][week] = cells.filter((c) => c.pct > 0);
};
/** Cộng thêm % của một dự án vào các tuần (dùng khi gán người / duyệt điều chuyển). */
export const addAlloc = (code: string, projectId: string, pct: number, weeks: string[]) =>
  weeks.forEach((w) => {
    const cells = allocCells(code, w).map((c) => ({ ...c }));
    const hit = cells.find((c) => c.projectId === projectId);
    if (hit) hit.pct += pct;
    else cells.push({ projectId, pct });
    setAllocCells(code, w, cells);
  });
/** Các tuần trong 12 tuần tới giao với khoảng [from, to]. */
export const weeksInRange = (from: string, to: string) => NEXT_WEEKS.filter((w) => addDays(w, 4) >= from && w <= to);
/** Tuần bắt đầu bench: <60% liên tục 2 tuần (null nếu không). */
export const benchFrom = (code: string) => {
  for (let i = 0; i < NEXT_WEEKS.length - 1; i++) if (allocSum(code, NEXT_WEEKS[i]) < 60 && allocSum(code, NEXT_WEEKS[i + 1]) < 60) return NEXT_WEEKS[i];
  return null;
};

/** Màu ô heatmap theo tổng %. */
export const heatCls = (v: number) =>
  v > 100 ? 'bg-rose-600 text-white font-bold' : v === 100 ? 'bg-emerald-600 text-white font-semibold' : v >= 60 ? 'bg-emerald-100 text-emerald-800' : v > 0 ? 'bg-amber-100 text-amber-800' : 'bg-amber-50 text-amber-600';

const projectOf = (id: string) => PMO_PROJECTS.find((p) => p.id === id);
const SEL = `${erp.input} h-7 text-[12px]`;
const JOBS = ['DEV', 'BA', 'QA', 'TL', 'PM'] as const;

const FilterCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex items-center gap-1.5 min-w-0">
    <span className="text-[12px] text-slate-600 whitespace-nowrap">{label}</span>
    {children}
  </label>
);

interface Row {
  person: Person;
  cross: boolean; // người khối khác làm dự án khối này
  totals: number[];
  bench: string | null;
}

export const PmoAllocationPage: React.FC<{ onNavigate?: (item: string) => void }> = () => {
  const { role, setRole, khoi, setKhoi } = usePmo();
  const [level, setLevel] = useState('');
  const [job, setJob] = useState('');
  const [flag, setFlag] = useState<'' | 'over' | 'bench'>('');
  const [open, setOpen] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<string, Record<string, number>>>({}); // projectId → week → %
  const [addProj, setAddProj] = useState('');
  const [ver, setVer] = useState(0);
  const [msg, setMsg] = useState('');
  const flash = (s: string) => {
    setMsg(s);
    window.setTimeout(() => setMsg(''), 3500);
  };

  const allRows = useMemo<Row[]>(() => {
    const own = PEOPLE.filter((p) => p.khoi === khoi);
    const cross = PEOPLE.filter((p) => p.khoi !== khoi && NEXT_WEEKS.some((w) => allocCells(p.code, w).some((c) => projectOf(c.projectId)?.khoi === khoi)));
    return [...own.map((p) => ({ p, cross: false })), ...cross.map((p) => ({ p, cross: true }))].map(({ p, cross }) => ({
      person: p,
      cross,
      totals: NEXT_WEEKS.map((w) => allocSum(p.code, w)),
      bench: benchFrom(p.code),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [khoi, ver]);

  const rows = allRows.filter(
    (r) => (!level || r.person.level === level) && (!job || r.person.job === job) && (!flag || (flag === 'over' ? r.totals.some((t) => t > 100) : !!r.bench)),
  );

  // Thẻ tổng hợp: tính trên nhân sự khối gốc
  const own = allRows.filter((r) => !r.cross);
  const util = own.length ? own.reduce((s, r) => s + r.totals[0], 0) / own.length : 0;
  const overN = own.filter((r) => r.totals.some((t) => t > 100)).length;
  const overNow = own.filter((r) => r.totals[0] > 100).length;
  const benchN = own.filter((r) => r.bench).length;
  const freeWeeks = own.reduce((s, r) => s + r.totals.reduce((a, t) => a + Math.max(0, 100 - t) / 100, 0), 0);

  const toggle = (code: string) => {
    if (open === code) return setOpen(null);
    const d: Record<string, Record<string, number>> = {};
    NEXT_WEEKS.forEach((w) =>
      allocCells(code, w).forEach((c) => {
        d[c.projectId] = d[c.projectId] || {};
        d[c.projectId][w] = c.pct;
      }),
    );
    setDraft(d);
    setAddProj('');
    setOpen(code);
  };
  const draftTotals: number[] = NEXT_WEEKS.map((w) => Object.keys(draft).reduce((s, pid) => s + (draft[pid][w] || 0), 0));
  const draftOver = draftTotals.some((t) => t > 100);
  const setCell = (pid: string, w: string, v: number) => setDraft((cur) => ({ ...cur, [pid]: { ...cur[pid], [w]: Math.max(0, Math.min(100, Math.round(v / 10) * 10)) } }));
  const save = (code: string) => {
    if (draftOver) return;
    NEXT_WEEKS.forEach((w) =>
      setAllocCells(
        code,
        w,
        Object.entries(draft).map(([projectId, m]) => ({ projectId, pct: m[w] || 0 })),
      ),
    );
    setVer((v) => v + 1);
    setOpen(null);
    flash(`Đã lưu allocation ${code} — ghi audit (Allocation), cập nhật capacity khối`);
  };

  const COLS = 5 + NEXT_WEEKS.length;

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', 'Nguồn lực', 'Heatmap allocation']}
        title={`Heatmap allocation khối ${khoi} · 12 tuần tới`}
        actions={
          <>
            <FilterCell label="Khối">
              <select value={khoi} onChange={(e) => (setKhoi(e.target.value), setOpen(null))} className={SEL}>
                {KHOI.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </FilterCell>
            <RoleSelect value={role} onChange={setRole} />
          </>
        }
      />

      {/* Thẻ tổng hợp */}
      <div className="bg-white border border-slate-300 rounded-[4px] grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 divide-x divide-slate-200">
        {[
          { l: 'Headcount', v: `${own.length}`, s: `+ ${allRows.length - own.length} người liên khối`, tone: '' },
          { l: 'Utilization tuần này', v: `${util.toFixed(0)}%`, s: `W${weekNo(THIS_WEEK)} · TB tổng allocation`, tone: util > 100 ? 'text-rose-700' : util < 75 ? 'text-amber-700' : 'text-emerald-700' },
          { l: 'Người >100%', v: `${overN}`, s: `${overNow} người ngay tuần này`, tone: overN ? 'text-rose-700' : '' },
          { l: 'Người bench', v: `${benchN}`, s: '<60% liên tục 2 tuần', tone: benchN ? 'text-amber-700' : '' },
          { l: 'Capacity trống', v: `${freeWeeks.toFixed(1)}`, s: 'người-tuần trong 12 tuần', tone: '' },
        ].map((c, i) => (
          <div key={i} className="px-3 py-2 min-w-0">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500 truncate">{c.l}</p>
            <p className={`text-[17px] font-bold tabular-nums leading-tight ${c.tone || 'text-slate-900'}`}>{c.v}</p>
            <p className="text-[11px] text-slate-500 truncate">{c.s}</p>
          </div>
        ))}
      </div>

      <Panel
        title={
          <>
            Heatmap người × tuần <span className="font-normal normal-case text-slate-500 tracking-normal">· {rows.length} người</span>
          </>
        }
        icon={Grid3x3}
        noPad
        actions={msg ? <span className="text-[12px] text-emerald-700">{msg}</span> : undefined}
        footer={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>Chú giải:</span>
            {[
              ['>100% quá tải', heatCls(110)],
              ['100%', heatCls(100)],
              ['60–90%', heatCls(70)],
              ['<60%', heatCls(40)],
            ].map(([l, c]) => (
              <span key={l} className="inline-flex items-center gap-1">
                <span className={`inline-block w-4 h-3 rounded-[2px] ${c}`} /> {l}
              </span>
            ))}
            <span>· Bench = &lt;60% liên tục 2 tuần (AL-11). Đơn vị 10%. Bấm một hàng để sửa allocation theo dự án.</span>
          </span>
        }
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
          <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300">
            <Filter size={13} className="text-[#1f5fa8]" /> Lọc
          </span>
          <FilterCell label="Level">
            <select value={level} onChange={(e) => setLevel(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </FilterCell>
          <FilterCell label="Vai trò">
            <select value={job} onChange={(e) => setJob(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              {JOBS.map((j) => (
                <option key={j}>{j}</option>
              ))}
            </select>
          </FilterCell>
          <FilterCell label="Chỉ hiện">
            <select value={flag} onChange={(e) => setFlag(e.target.value as typeof flag)} className={SEL}>
              <option value="">Tất cả</option>
              <option value="over">Quá tải &gt;100%</option>
              <option value="bench">Bench</option>
            </select>
          </FilterCell>
          {(level || job || flag) && (
            <button type="button" onClick={() => (setLevel(''), setJob(''), setFlag(''))} className="text-[12px] text-[#1f5fa8] hover:underline cursor-pointer">
              Bỏ lọc
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1180px]`}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 text-left w-56`}>Nhân sự</th>
                <th className={`${erp.th} border-t-0 w-16`}>Level</th>
                <th className={`${erp.th} border-t-0 w-12`}>Vai trò</th>
                <th className={`${erp.th} border-t-0 w-12`}>Khối</th>
                {NEXT_WEEKS.map((w) => (
                  <th key={w} className={`${erp.th} border-t-0 text-center px-1 ${w === THIS_WEEK ? 'bg-[#d6e4f5]' : ''}`}>
                    W{weekNo(w)}
                    <span className="block text-[10px] font-normal text-slate-500">{weekLabel(w)}</span>
                  </th>
                ))}
                <th className={`${erp.th} border-t-0 border-r-0 text-right w-14`}>TB</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isOpen = open === r.person.code;
                const avg = r.totals.reduce((a, b) => a + b, 0) / r.totals.length;
                return (
                  <React.Fragment key={r.person.code}>
                    <tr className={`cursor-pointer ${isOpen ? 'bg-[#eaf2fc]' : erp.tr}`} onClick={() => toggle(r.person.code)}>
                      <td className={`${erp.td} border-l-0 whitespace-nowrap`}>
                        <span className="font-semibold text-slate-800">{r.person.name}</span> <span className="text-[11px] text-slate-500 font-mono">{r.person.code}</span>
                        <span className="ml-1.5 inline-flex gap-1 align-middle">
                          {r.cross && <Tag cls="bg-teal-50 text-teal-700 border-teal-200">Liên khối</Tag>}
                          {r.bench && <Tag cls="bg-amber-50 text-amber-700 border-amber-200">Bench từ W{weekNo(r.bench)}</Tag>}
                        </span>
                      </td>
                      <td className={`${erp.td} text-center`}>{r.person.level}</td>
                      <td className={`${erp.td} text-center`}>{r.person.job}</td>
                      <td className={`${erp.td} text-center`}>{r.person.khoi}</td>
                      {NEXT_WEEKS.map((w, i) => {
                        const v = r.totals[i];
                        const cells = allocCells(r.person.code, w);
                        return (
                          <td
                            key={w}
                            title={`W${weekNo(w)} (${weekLabel(w)}) · tổng ${v}%\n${cells.length ? cells.map((c) => `${c.projectId} ${projectOf(c.projectId)?.name || ''}: ${c.pct}%`).join('\n') : 'Chưa phân bổ'}`}
                            className={`border border-white px-1 py-1.5 text-center text-[11.5px] tabular-nums ${heatCls(v)}`}
                          >
                            {v}
                          </td>
                        );
                      })}
                      <td className={`${erp.td} border-r-0 ${erp.num} font-semibold`}>{avg.toFixed(0)}%</td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={COLS} className="border border-slate-300 border-l-0 border-r-0 bg-[#f7fafd] p-2" onClick={(e) => e.stopPropagation()}>
                          <div className="flex flex-wrap items-center gap-2 mb-1.5 text-[12px]">
                            <b className="text-[#1e3a5f]">Chi tiết allocation · {r.person.name}</b>
                            <span className="text-slate-500">
                              {r.person.level} {r.person.job} · {r.person.skill} · khối gốc {r.person.khoi}
                            </span>
                            {draftOver && <span className="text-rose-700 font-semibold">Có tuần tổng &gt;100% — không cho vượt 100%, chưa lưu được.</span>}
                          </div>
                          <div className="overflow-x-auto">
                            <table className={`${erp.table} min-w-[1100px] bg-white`}>
                              <thead>
                                <tr>
                                  <th className={`${erp.th} text-left w-64`}>Dự án</th>
                                  {NEXT_WEEKS.map((w) => (
                                    <th key={w} className={`${erp.th} text-center px-1`}>
                                      W{weekNo(w)}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {Object.keys(draft).map((pid) => {
                                  const p = projectOf(pid);
                                  return (
                                    <tr key={pid} className={erp.tr}>
                                      <td className={`${erp.td} whitespace-nowrap`}>
                                        <span className={erp.code}>{pid}</span> <span className="text-slate-700">{p?.name}</span>
                                        {p && p.khoi !== r.person.khoi && <span className="ml-1 text-[11px] text-teal-700">({p.khoi})</span>}
                                      </td>
                                      {NEXT_WEEKS.map((w) => (
                                        <td key={w} className={`${erp.td} px-0.5 py-0.5`}>
                                          <input
                                            type="number"
                                            step={10}
                                            min={0}
                                            max={100}
                                            value={draft[pid][w] || 0}
                                            onChange={(e) => setCell(pid, w, Number(e.target.value))}
                                            className={`${erp.input} h-6 w-full px-1 text-[12px] text-right`}
                                          />
                                        </td>
                                      ))}
                                    </tr>
                                  );
                                })}
                                <tr className={erp.totalRow}>
                                  <td className={erp.td}>Tổng tuần</td>
                                  {draftTotals.map((t, i) => (
                                    <td key={i} className={`${erp.td} text-center px-1 ${t > 100 ? 'bg-rose-600 text-white' : ''}`}>
                                      {t}%
                                    </td>
                                  ))}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <select value={addProj} onChange={(e) => setAddProj(e.target.value)} className={`${SEL} max-w-[320px]`}>
                              <option value="">— Thêm dự án —</option>
                              {PMO_PROJECTS.filter((p) => !draft[p.id]).map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.code} · {p.name}
                                </option>
                              ))}
                            </select>
                            <Btn
                              icon={Plus}
                              className="h-7"
                              disabled={!addProj}
                              onClick={() => {
                                setDraft((cur) => ({ ...cur, [addProj]: {} }));
                                setAddProj('');
                              }}
                            >
                              Thêm
                            </Btn>
                            <span className="ml-auto text-[11px] text-slate-500">Dự án khối khác cần đi qua điều chuyển liên khối (PMO-10) nếu là người khối {r.person.khoi}.</span>
                            <Btn variant="primary" icon={Save} className="h-7" disabled={draftOver} onClick={() => save(r.person.code)} title={draftOver ? 'Không cho vượt 100%' : ''}>
                              Lưu
                            </Btn>
                            <Btn icon={X} className="h-7" onClick={() => setOpen(null)}>
                              Huỷ
                            </Btn>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={COLS} className="px-3 py-8 text-center text-slate-400 italic">
                    Không có nhân sự nào khớp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </ErpPage>
  );
};
