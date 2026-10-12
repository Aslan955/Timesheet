/**
 * PmoCapacityPage — PMO-11 Dự báo capacity 12 tuần (F8.1).
 *
 * Bố cục:
 *   hàng 1: gợi ý hành động tự sinh (thiếu/thừa theo level × tuần, release quá tải)
 *   hàng 2: bảng level × 12 tuần — cung (người, từ nhân sự khối) / cầu (tổng allocation của level + yêu cầu nguồn lực đang chờ)
 *           → chênh lệch: đỏ = thiếu, vàng = thừa >20%; biểu đồ cột SVG cung/cầu theo tuần
 *   hàng 3: capacity SP theo release của các dự án khối: Σ(allocation × ngày làm việc × SP/người-ngày theo level) so với SP còn lại.
 */
import React, { useMemo, useState } from 'react';
import { BarChart3, Gauge, Lightbulb, Layers } from 'lucide-react';
import { KHOI, PMO_PROJECTS, TODAY, addDays, dmy } from '../../pmo/pmo';
import { HOLIDAYS, LEVELS, Level, NEXT_WEEKS, PEOPLE, RESOURCE_REQUESTS, SP_PER_DAY, THIS_WEEK, projectDetail, weekLabel, weekNo } from '../../pmo/pmoData';
import { usePmo } from '../../pmo/PmoContext';
import { ErpPage, ErpTitleBar, Panel, Tag, erp } from '../erp/Erp';
import { HealthBadge, RoleSelect } from './PmoBits';
import { allocCells, allocSum } from './PmoAllocationPage';

const SEL = `${erp.input} h-7 text-[12px]`;
const projectOf = (id: string) => PMO_PROJECTS.find((p) => p.id === id);
/** Ngày làm việc trong tuần (trừ holiday). */
const daysOfWeek = (w: string) => 5 - HOLIDAYS.filter((h) => h >= w && h <= addDays(w, 4)).length;
/** Ngày làm việc của tuần w nằm trong [s, e]. */
const overlapDays = (w: string, s: string, e: string) => {
  let n = 0;
  for (let i = 0; i < 5; i++) {
    const d = addDays(w, i);
    if (d >= s && d <= e && !HOLIDAYS.includes(d)) n++;
  }
  return n;
};
const fmt1 = (v: number) => (Math.abs(v) < 0.05 ? '0' : v.toFixed(1).replace(/\.0$/, ''));

export const PmoCapacityPage: React.FC<{ onNavigate?: (item: string) => void }> = ({ onNavigate }) => {
  const { role, setRole, khoi, setKhoi, setFocusId } = usePmo();
  const [showReq, setShowReq] = useState(true);

  /** cung/cầu theo level × tuần. */
  const grid = useMemo(() => {
    const own = PEOPLE.filter((p) => p.khoi === khoi);
    const pending = RESOURCE_REQUESTS.filter((r) => r.status === 'Chờ GĐSX' && projectOf(r.projectId)?.khoi === khoi);
    return LEVELS.map((lv) => {
      const ppl = own.filter((p) => p.level === lv);
      const cells = NEXT_WEEKS.map((w) => {
        const supply = (ppl.length * daysOfWeek(w)) / 5;
        const alloc = ppl.reduce((s, p) => s + allocSum(p.code, w), 0) / 100;
        const req = showReq ? pending.filter((r) => r.level === lv && addDays(w, 4) >= r.from && w <= r.to).reduce((s, r) => s + r.pct, 0) / 100 : 0;
        const demand = alloc + req;
        return { w, supply, demand, req, gap: supply - demand };
      });
      return { lv, n: ppl.length, cells };
    });
    // ALLOC_STORE (sửa ở Heatmap) được đọc lại mỗi lần vào màn
  }, [khoi, showReq]);

  const totals = NEXT_WEEKS.map((w, i) => ({
    w,
    supply: grid.reduce((s, g) => s + g.cells[i].supply, 0),
    demand: grid.reduce((s, g) => s + g.cells[i].demand, 0),
  }));

  /** Capacity SP theo release (dự án khối). */
  const releases = useMemo(() => {
    const last = NEXT_WEEKS[NEXT_WEEKS.length - 1];
    return PMO_PROJECTS.filter((p) => p.khoi === khoi).flatMap((p) => {
      const d = projectDetail(p);
      // SP/ngày của dự án theo từng tuần = Σ allocation × SP_PER_DAY[level]
      const spDay = (w: string) =>
        PEOPLE.reduce((s, x) => {
          const c = allocCells(x.code, w).find((c) => c.projectId === p.id);
          return s + (c ? (c.pct / 100) * SP_PER_DAY[x.level] : 0);
        }, 0);
      const lastRate = spDay(last);
      return d.releases
        .filter((r) => r.spPlanned > 0 && r.end >= THIS_WEEK && r.status !== 'Đã close')
        .map((r) => {
          const s = r.start > TODAY ? r.start : TODAY;
          let cap = 0;
          NEXT_WEEKS.forEach((w) => (cap += spDay(w) * overlapDays(w, s, r.end)));
          // Sau 12 tuần dự báo: giữ mức allocation tuần cuối
          let tail = 0;
          for (let w = addDays(last, 7); w <= r.end; w = addDays(w, 7)) tail += overlapDays(w, s, r.end);
          const beyond = tail > 0;
          cap += lastRate * tail;
          const remain = r.spPlanned - r.spDone;
          const load = cap ? (remain / cap) * 100 : remain ? 999 : 0;
          return { p, r, cap, remain, load, beyond };
        });
    });
  }, [khoi]);

  /** Gợi ý hành động. */
  const hints = useMemo(() => {
    const out: { tone: 'bad' | 'warn' | 'ok'; text: string }[] = [];
    grid.forEach((g) => {
      // gom các tuần liên tiếp thiếu / thừa
      const runs = (pred: (c: (typeof g.cells)[number]) => boolean) => {
        const res: { a: number; b: number; peak: number }[] = [];
        g.cells.forEach((c, i) => {
          if (!pred(c)) return;
          const last = res[res.length - 1];
          const mag = Math.abs(c.gap);
          if (last && last.b === i - 1) (last.b = i), (last.peak = Math.max(last.peak, mag));
          else res.push({ a: i, b: i, peak: mag });
        });
        return res;
      };
      const wk = (a: number, b: number) => (a === b ? `W${weekNo(NEXT_WEEKS[a])}` : `W${weekNo(NEXT_WEEKS[a])}–W${weekNo(NEXT_WEEKS[b])}`);
      runs((c) => c.gap < -0.05).forEach((r) =>
        out.push({ tone: 'bad', text: `Thiếu ${Math.ceil(r.peak - 0.05)} ${g.lv} tuần ${wk(r.a, r.b)} → cân nhắc tuyển/điều chuyển${g.cells.slice(r.a, r.b + 1).some((c) => c.req > 0) ? ' (gồm yêu cầu nguồn lực đang chờ)' : ''}` }),
      );
      runs((c) => c.supply > 0 && c.gap / c.supply > 0.2)
        .filter((r) => r.b - r.a >= 1)
        .forEach((r) => out.push({ tone: 'warn', text: `Thừa ~${fmt1(r.peak)} ${g.lv} tuần ${wk(r.a, r.b)} → nhận yêu cầu nguồn lực khối khác / cho điều chuyển / đào tạo` }));
    });
    const overRel = releases.filter((x) => x.load > 100).sort((a, b) => b.load - a.load);
    overRel
      .slice(0, 3)
      .forEach((x) => out.push({ tone: 'bad', text: `${x.p.code} ${x.r.code} quá tải ${x.load.toFixed(0)}% (còn ${x.remain} SP, capacity ${x.cap.toFixed(0)} SP) → giảm phạm vi, dời sang release sau hoặc bổ sung ~${Math.ceil((x.remain - x.cap) / 0.9)} người-ngày Middle` }));
    if (overRel.length > 3) out.push({ tone: 'bad', text: `Còn ${overRel.length - 3} release quá tải khác — xem bảng capacity SP bên dưới.` });
    if (!out.length) out.push({ tone: 'ok', text: 'Cung – cầu cân đối trong 12 tuần tới; không có release quá tải.' });
    return out;
  }, [grid, releases]);

  // ---------- Biểu đồ cột SVG ----------
  const W = 1200;
  const H = 150;
  const PADL = 30;
  const PADB = 22;
  const maxV = Math.max(1, ...totals.flatMap((t) => [t.supply, t.demand])) * 1.1;
  const step = (W - PADL - 6) / totals.length;
  const bw = Math.min(22, step / 2 - 3);
  const y = (v: number) => H - PADB - (v / maxV) * (H - PADB - 8);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxV * f));

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', 'Nguồn lực', 'Dự báo capacity']}
        title={`Dự báo capacity 12 tuần · khối ${khoi}`}
        actions={
          <>
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Khối
              <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className={SEL}>
                {KHOI.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </label>
            <RoleSelect value={role} onChange={setRole} />
          </>
        }
        meta={[
          { label: 'Nhân sự khối', value: PEOPLE.filter((p) => p.khoi === khoi).length },
          { label: 'Từ', value: `W${weekNo(NEXT_WEEKS[0])} (${weekLabel(NEXT_WEEKS[0])})` },
          { label: 'Đến', value: `W${weekNo(NEXT_WEEKS[11])} (${weekLabel(NEXT_WEEKS[11])})` },
          { label: 'Release theo dõi', value: releases.length },
          { label: 'Release quá tải', value: <span className={releases.some((x) => x.load > 100) ? 'text-rose-700' : ''}>{releases.filter((x) => x.load > 100).length}</span> },
        ]}
      />

      <Panel title="Gợi ý hành động" icon={Lightbulb} noPad>
        <ul className="divide-y divide-slate-100 text-[12.5px]">
          {hints.map((h, i) => (
            <li key={i} className="flex items-start gap-2 px-3 py-1.5">
              <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${h.tone === 'bad' ? 'bg-rose-500' : h.tone === 'warn' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
              <span className={h.tone === 'bad' ? 'text-rose-800' : h.tone === 'warn' ? 'text-amber-800' : 'text-emerald-800'}>{h.text}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid grid-cols-1 gap-3">
        <Panel
          title="Cung – cầu theo level × tuần (người)"
          icon={Layers}
          noPad
          actions={
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600 normal-case">
              <input type="checkbox" checked={showReq} onChange={(e) => setShowReq(e.target.checked)} /> Tính yêu cầu nguồn lực đang chờ
            </label>
          }
          footer="Cung = số người của level trong khối (trừ ngày lễ). Cầu = Σ allocation tuần của nhân sự level đó (mọi dự án) + yêu cầu nguồn lực chờ GĐSX của dự án khối. Chênh = cung − cầu: đỏ thiếu, vàng thừa >20%."
        >
          <div className="overflow-x-auto">
            <table className={`${erp.table} min-w-[900px]`}>
              <thead>
                <tr>
                  <th className={`${erp.th} border-t-0 border-l-0 text-left w-20`}>Level</th>
                  <th className={`${erp.th} border-t-0 text-left w-14`} />
                  {NEXT_WEEKS.map((w) => (
                    <th key={w} className={`${erp.th} border-t-0 text-center px-1 ${w === THIS_WEEK ? 'bg-[#d6e4f5]' : ''}`}>
                      W{weekNo(w)}
                      <span className="block text-[10px] font-normal text-slate-500">{weekLabel(w)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.map((g) => (
                  <React.Fragment key={g.lv}>
                    <tr className="bg-white">
                      <td rowSpan={3} className={`${erp.td} border-l-0 align-top font-bold text-[#1e3a5f]`}>
                        {g.lv}
                        <span className="block text-[11px] font-normal text-slate-500">{g.n} người</span>
                      </td>
                      <td className={`${erp.td} text-[11px] text-slate-500`}>Cung</td>
                      {g.cells.map((c) => (
                        <td key={c.w} className={`${erp.td} ${erp.num} px-1 text-slate-600`}>
                          {fmt1(c.supply)}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-white">
                      <td className={`${erp.td} text-[11px] text-slate-500`}>Cầu</td>
                      {g.cells.map((c) => (
                        <td key={c.w} className={`${erp.td} ${erp.num} px-1 text-slate-600`} title={c.req ? `gồm ${fmt1(c.req)} từ yêu cầu nguồn lực đang chờ` : undefined}>
                          {fmt1(c.demand)}
                          {c.req > 0 && <span className="text-[#1f5fa8]">*</span>}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-slate-50 border-b-2 border-slate-300">
                      <td className={`${erp.td} text-[11px] font-semibold text-slate-700`}>Chênh</td>
                      {g.cells.map((c) => {
                        const short = c.gap < -0.05;
                        const surplus = c.supply > 0 && c.gap / c.supply > 0.2;
                        return (
                          <td
                            key={c.w}
                            className={`${erp.td} ${erp.num} px-1 font-bold ${short ? 'bg-rose-100 text-rose-700' : surplus ? 'bg-amber-50 text-amber-700' : 'text-slate-700'}`}
                            title={`${g.lv} W${weekNo(c.w)}: cung ${fmt1(c.supply)} · cầu ${fmt1(c.demand)}`}
                          >
                            {c.gap > 0.05 ? '+' : ''}
                            {fmt1(c.gap)}
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                ))}
                <tr className={erp.totalRow}>
                  <td className={`${erp.td} border-l-0`} colSpan={2}>
                    Tổng chênh
                  </td>
                  {totals.map((t) => (
                    <td key={t.w} className={`${erp.td} ${erp.num} px-1 ${t.supply - t.demand < 0 ? 'text-rose-700' : ''}`}>
                      {t.supply - t.demand > 0.05 ? '+' : ''}
                      {fmt1(t.supply - t.demand)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Cung / cầu toàn khối theo tuần"
          icon={BarChart3}
          footer={
            <span className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-[2px] bg-slate-300" /> Cung (người)
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-[2px] bg-[#1f5fa8]" /> Cầu (người)
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-[2px] bg-rose-600" /> Cầu vượt cung
              </span>
            </span>
          }
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Biểu đồ cột cung và cầu nhân sự theo tuần">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PADL} x2={W - 4} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeWidth="1" />
                <text x={PADL - 4} y={y(t) + 3} textAnchor="end" fontSize="10" fill="#64748b">
                  {t}
                </text>
              </g>
            ))}
            {totals.map((t, i) => {
              const cx = PADL + step * i + step / 2;
              const over = t.demand > t.supply + 0.05;
              return (
                <g key={t.w}>
                  <title>{`W${weekNo(t.w)} (${weekLabel(t.w)})\nCung: ${fmt1(t.supply)} người\nCầu: ${fmt1(t.demand)} người\nChênh: ${fmt1(t.supply - t.demand)}`}</title>
                  <rect x={cx - step / 2} y={4} width={step} height={H - PADB - 4} fill="transparent" />
                  <rect x={cx - bw - 1} y={y(t.supply)} width={bw} height={Math.max(0, y(0) - y(t.supply))} rx="2" fill="#cbd5e1" />
                  <rect x={cx + 1} y={y(t.demand)} width={bw} height={Math.max(0, y(0) - y(t.demand))} rx="2" fill={over ? '#e11d48' : '#1f5fa8'} />
                  <text x={cx} y={H - 8} textAnchor="middle" fontSize="10" fill="#475569">
                    W{weekNo(t.w)}
                  </text>
                </g>
              );
            })}
            <line x1={PADL} x2={W - 4} y1={y(0)} y2={y(0)} stroke="#94a3b8" strokeWidth="1" />
          </svg>
        </Panel>
      </div>

      <Panel
        title={
          <>
            Capacity SP theo release <span className="font-normal normal-case text-slate-500 tracking-normal">· dự án khối {khoi}</span>
          </>
        }
        icon={Gauge}
        noPad
        footer="Capacity SP = Σ (allocation × ngày làm việc còn lại của release × SP/người-ngày theo level: Fresher 0,4 · Junior 0,6 · Middle 0,9 · Senior 1,1 · Lead 0,8). Sau 12 tuần dự báo giữ mức allocation tuần cuối (*). Tải = SP còn lại / capacity: >100% quá tải, 90–100% sát ngưỡng."
      >
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1000px]`}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 text-left`}>Dự án</th>
                <th className={`${erp.th} border-t-0 w-16`}>Health</th>
                <th className={`${erp.th} border-t-0 w-16`}>Release</th>
                <th className={`${erp.th} border-t-0 w-44`}>Thời gian</th>
                <th className={`${erp.th} border-t-0 w-24`}>Trạng thái</th>
                <th className={`${erp.th} border-t-0 text-right w-20`}>SP planned</th>
                <th className={`${erp.th} border-t-0 text-right w-20`}>SP done</th>
                <th className={`${erp.th} border-t-0 text-right w-20`}>SP còn lại</th>
                <th className={`${erp.th} border-t-0 text-right w-24`}>Capacity SP</th>
                <th className={`${erp.th} border-t-0 w-40`}>Tải</th>
                <th className={`${erp.th} border-t-0 border-r-0 text-left w-36`}>Cảnh báo</th>
              </tr>
            </thead>
            <tbody>
              {releases.map(({ p, r, cap, remain, load, beyond }) => (
                <tr key={`${p.id}-${r.code}`} className={erp.tr}>
                  <td className={`${erp.td} border-l-0 whitespace-nowrap`}>
                    <button type="button" className="text-left text-[#1f5fa8] hover:underline cursor-pointer" onClick={() => (setFocusId(p.id), onNavigate?.('Project Cockpit'))} title="Mở Project Cockpit">
                      <span className="font-mono text-[11.5px]">{p.code}</span> <span className="text-slate-700">{p.name}</span>
                    </button>
                  </td>
                  <td className={`${erp.td} text-center`}>
                    <HealthBadge h={p.health} small />
                  </td>
                  <td className={`${erp.td} text-center font-semibold`}>{r.code}</td>
                  <td className={`${erp.td} text-center tabular-nums whitespace-nowrap`}>
                    {dmy(r.start)} – {dmy(r.end)}
                  </td>
                  <td className={`${erp.td} text-center`}>
                    <Tag cls={r.status === 'Đang chạy' ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-slate-50 text-slate-600 border-slate-200'}>{r.status}</Tag>
                  </td>
                  <td className={`${erp.td} ${erp.num}`}>{r.spPlanned}</td>
                  <td className={`${erp.td} ${erp.num}`}>{r.spDone}</td>
                  <td className={`${erp.td} ${erp.num} font-semibold`}>{remain}</td>
                  <td className={`${erp.td} ${erp.num}`}>
                    {cap.toFixed(0)}
                    {beyond && <span className="text-slate-400">*</span>}
                  </td>
                  <td className={erp.td}>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-2 bg-slate-100 rounded-sm overflow-hidden">
                        <div className={`h-full ${load > 100 ? 'bg-rose-500' : load >= 90 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, load)}%` }} />
                      </div>
                      <span className={`w-11 text-right tabular-nums font-semibold ${load > 100 ? 'text-rose-700' : load >= 90 ? 'text-amber-700' : 'text-slate-700'}`}>{load > 998 ? '∞' : `${load.toFixed(0)}%`}</span>
                    </div>
                  </td>
                  <td className={`${erp.td} border-r-0 text-[11.5px]`}>
                    {load > 100 ? (
                      <span className="text-rose-700 font-semibold">Quá tải · thiếu {Math.ceil(remain - cap)} SP</span>
                    ) : load >= 90 ? (
                      <span className="text-amber-700">Sát ngưỡng</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {!releases.length && (
                <tr>
                  <td colSpan={11} className="px-3 py-8 text-center text-slate-400 italic">
                    Khối {khoi} chưa có release đang chạy hoặc kế hoạch.
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
