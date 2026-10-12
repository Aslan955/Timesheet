/**
 * PmoTimesheetPage — PMO-14 Timesheet theo WP (F4.4).
 *
 * Hai thẻ:
 *   1. Timesheet của tôi: chọn người (demo) + tuần (‹ tuần trước | tuần này | tuần sau ›). Bảng dòng log: dự án, WP (WP của dự án
 *      được allocate), tag Normal/Rework, giờ T2..T6 (bước 0,25), ghi chú, tổng — sửa trực tiếp, thêm/xoá dòng inline.
 *      Dòng tổng theo ngày; so với allocation (giờ allocation = 40 × tổng%/100) → Timesheet accuracy = |log − allocation| / allocation.
 *      Rule: WP đã Done → tag Rework tự đặt và khoá. Tuần đã khoá (sau thứ Ba tuần kế tiếp) → chỉ xem; "Xin mở lại" → "Chờ PM duyệt"
 *      (PM duyệt mở lại → ghi audit).
 *   2. Báo cáo thiếu timesheet (PM): chọn dự án → thành viên × 4 tuần gần nhất: giờ log vs giờ allocation, % lệch; ô đỏ nếu thiếu >20%; nút "Nhắc".
 *
 * STORE theo người + tuần, khởi tạo từ timesheetOf (một số tuần cũ để trống để minh hoạ thiếu timesheet).
 */
import React, { useMemo, useState } from 'react';
import { AlertTriangle, BellRing, ChevronLeft, ChevronRight, ClipboardList, Clock, Lock, LockOpen, Plus, Trash2, Unlock } from 'lucide-react';
import { KHOI, PMO_PROJECTS, TODAY, addDays, dmy, rand, workDays } from '../../pmo/pmo';
import { NEXT_WEEKS, PAST_WEEKS, PEOPLE, THIS_WEEK, TsRow, isLocked, personByCode, projectDetail, timesheetOf, weekLabel, weekNo } from '../../pmo/pmoData';
import { usePmo } from '../../pmo/PmoContext';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, Panel, Tag, erp } from '../erp/Erp';
import { ProjectSelect, RoleSelect } from './PmoBits';
import { allocCells } from './PmoAllocationPage';

// ==========================================================================
// STORE theo người + tuần
// ==========================================================================
type Reopen = '' | 'pending' | 'open';
interface Sheet {
  rows: TsRow[];
  reopen: Reopen;
}
const STORE = new Map<string, Sheet>();
let seq = 1;

const projectOf = (id: string) => PMO_PROJECTS.find((p) => p.id === id);
const wpOf = (projectId: string, code: string) => {
  const p = projectOf(projectId);
  return p ? projectDetail(p).wps.find((w) => w.code === code) : undefined;
};
const isFoundation = (projectId: string, wpCode: string) => {
  const p = projectOf(projectId);
  if (!p) return false;
  const d = projectDetail(p);
  const wp = d.wps.find((w) => w.code === wpCode);
  return !!wp && !!d.features.find((f) => f.code === wp.feature)?.foundation;
};

const sheetOf = (code: string, week: string): Sheet => {
  const key = `${code}|${week}`;
  let s = STORE.get(key);
  if (!s) {
    // Mẫu: ~12% tuần đã qua chưa log để báo cáo thiếu timesheet có số liệu
    const missing = week < THIS_WEEK && rand(code, week, 'miss') < 0.12;
    const rows = missing ? [] : timesheetOf(code, week).map((r) => ({ ...r, hours: [...r.hours], tag: wpOf(r.projectId, r.wp)?.status === 'Done' ? 'Rework' : r.tag }) as TsRow);
    s = { rows, reopen: '' };
    STORE.set(key, s);
  }
  return s;
};
/** Allocation của tuần: ngoài 12 tuần dự báo (tuần đã qua) dùng kế hoạch tuần này. */
const allocFor = (code: string, week: string) => allocCells(code, NEXT_WEEKS.includes(week) ? week : THIS_WEEK);
const sumH = (rows: TsRow[]) => rows.reduce((s, r) => s + r.hours.reduce((a, b) => a + b, 0), 0);
const fmtH = (h: number) => (Number.isInteger(h) ? `${h}` : h.toFixed(2).replace(/0$/, '').replace('.', ','));
const accTone = (acc: number) => (acc <= 10 ? 'text-emerald-700' : acc <= 20 ? 'text-amber-700' : 'text-rose-700');
/** Số ngày làm việc đã qua của tuần (tuần hiện tại tính đến hết hôm qua). */
const elapsedDays = (week: string) => (week < THIS_WEEK ? 5 : week === THIS_WEEK ? Math.min(5, Math.max(0, workDays(THIS_WEEK, TODAY))) : 0);

const SEL = `${erp.input} h-7 text-[12px]`;
const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6'];
type TabKey = 'mine' | 'report';

export const PmoTimesheetPage: React.FC<{ onNavigate?: (item: string) => void }> = () => {
  const { projects, focusId, role, setRole } = usePmo();
  const [tab, setTab] = useState<TabKey>('mine');
  const [person, setPerson] = useState(PEOPLE[0].code);
  const [week, setWeek] = useState(THIS_WEEK);
  const [, setVer] = useState(0);
  const bump = () => setVer((v) => v + 1);
  const [delId, setDelId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const flash = (s: string) => {
    setMsg(s);
    window.setTimeout(() => setMsg(''), 3500);
  };
  const [projId, setProjId] = useState(focusId);
  const [reminded, setReminded] = useState<Set<string>>(new Set());

  // ---------- Timesheet của tôi ----------
  const sheet = sheetOf(person, week);
  const rows = sheet.rows;
  const lockedWeek = isLocked(week);
  const readOnly = lockedWeek && sheet.reopen !== 'open';
  const alloc = allocFor(person, week);
  const allocPct = alloc.reduce((s, c) => s + c.pct, 0);
  const allocH = (40 * allocPct) / 100;
  const logH = sumH(rows);
  const acc = allocH ? (Math.abs(logH - allocH) / allocH) * 100 : 0;
  const dayTotals = DAYS.map((_, i) => rows.reduce((s, r) => s + (r.hours[i] || 0), 0));
  const reworkH = sumH(rows.filter((r) => r.tag === 'Rework'));
  const foundationH = sumH(rows.filter((r) => isFoundation(r.projectId, r.wp)));
  const me = personByCode(person)!;
  const projOptions = [...new Set([...alloc.map((c) => c.projectId), ...rows.map((r) => r.projectId)])];

  const update = (id: string, patch: Partial<TsRow>) => {
    sheet.rows = sheet.rows.map((r) => {
      if (r.id !== id) return r;
      const next = { ...r, ...patch };
      if (patch.projectId && patch.projectId !== r.projectId) {
        const wps = projectDetail(projectOf(patch.projectId)!).wps.filter((w) => w.status !== 'To Do');
        const w = wps[0] || projectDetail(projectOf(patch.projectId)!).wps[0];
        next.wp = w.code;
        next.wpName = w.name;
      }
      if (patch.wp) next.wpName = wpOf(next.projectId, patch.wp)?.name || '';
      if (wpOf(next.projectId, next.wp)?.status === 'Done') next.tag = 'Rework';
      return next;
    });
    bump();
  };
  const setHour = (r: TsRow, i: number, v: number) => {
    const h = [...r.hours];
    h[i] = Math.max(0, Math.min(24, Math.round(v * 4) / 4));
    update(r.id, { hours: h });
  };
  const addRow = () => {
    const pid = alloc[0]?.projectId || projOptions[0] || PMO_PROJECTS[0].id;
    const d = projectDetail(projectOf(pid)!);
    const w = d.wps.find((x) => x.status === 'In Progress') || d.wps[0];
    sheet.rows = [...sheet.rows, { id: `new-${seq++}`, projectId: pid, wp: w.code, wpName: w.name, tag: w.status === 'Done' ? 'Rework' : 'Normal', hours: [0, 0, 0, 0, 0], note: '' }];
    bump();
  };
  const delRow = (id: string) => {
    sheet.rows = sheet.rows.filter((r) => r.id !== id);
    setDelId(null);
    bump();
  };
  const askReopen = () => {
    sheet.reopen = 'pending';
    bump();
    flash(`Đã gửi yêu cầu mở lại tuần W${weekNo(week)} — chờ PM duyệt`);
  };
  const approveReopen = () => {
    sheet.reopen = 'open';
    bump();
    flash(`PM đã duyệt mở lại timesheet W${weekNo(week)} của ${me.name} — ghi audit (Timesheet)`);
  };

  const minWeek = PAST_WEEKS[0];
  const maxWeek = addDays(THIS_WEEK, 7);

  // ---------- Báo cáo thiếu timesheet ----------
  const rp = projects.find((p) => p.id === projId) || projects[0];
  const team = projectDetail(rp).team;
  const RWEEKS = PAST_WEEKS.slice(-4);
  const report = useMemo(
    () =>
      team.map((m) => {
        const cells = RWEEKS.map((w) => {
          const pct = allocFor(m.person.code, w)
            .filter((c) => c.projectId === rp.id)
            .reduce((s, c) => s + c.pct, 0);
          const exp = ((40 * pct) / 100) * (elapsedDays(w) / 5);
          const log = sumH(sheetOf(m.person.code, w).rows.filter((r) => r.projectId === rp.id));
          const acc = exp ? (Math.abs(log - exp) / exp) * 100 : 0;
          return { w, pct, exp, log, acc, short: exp > 0 && log < exp * 0.8 };
        });
        const exp = cells.reduce((s, c) => s + c.exp, 0);
        const log = cells.reduce((s, c) => s + c.log, 0);
        return { m, cells, exp, log, acc: exp ? (Math.abs(log - exp) / exp) * 100 : 0, shortN: cells.filter((c) => c.short).length };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rp.id, tab],
  );
  const shortNow = report.filter((r) => r.cells[r.cells.length - 1].short);
  const remind = (codes: string[]) => {
    setReminded(new Set([...reminded, ...codes]));
    flash(`Đã nhắc ${codes.length} người log timesheet ${rp.code} qua email/Teams`);
  };

  // ==========================================================================
  const mine = (
    <Panel
      title={
        <>
          Timesheet tuần W{weekNo(week)} <span className="font-normal normal-case text-slate-500 tracking-normal">· {weekLabel(week)} – {weekLabel(addDays(week, 4))}</span>
        </>
      }
      icon={Clock}
      noPad
      actions={
        <>
          {msg && <span className="text-[12px] text-emerald-700">{msg}</span>}
          <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
            Người
            <select value={person} onChange={(e) => (setPerson(e.target.value), setDelId(null))} className={`${SEL} max-w-[240px]`}>
              {KHOI.map((k) => (
                <optgroup key={k} label={`Khối ${k}`}>
                  {PEOPLE.filter((p) => p.khoi === k).map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.code} · {p.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <span className="inline-flex border border-slate-300 rounded-[3px] overflow-hidden divide-x divide-slate-300 bg-white">
            <button type="button" disabled={week <= minWeek} onClick={() => setWeek(addDays(week, -7))} className="h-7 px-2 text-[12px] text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer inline-flex items-center">
              <ChevronLeft size={14} /> Tuần trước
            </button>
            <button type="button" onClick={() => setWeek(THIS_WEEK)} className={`h-7 px-3 text-[12px] cursor-pointer ${week === THIS_WEEK ? 'bg-[#1f5fa8] text-white font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
              Tuần này
            </button>
            <button type="button" disabled={week >= maxWeek} onClick={() => setWeek(addDays(week, 7))} className="h-7 px-2 text-[12px] text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer inline-flex items-center">
              Tuần sau <ChevronRight size={14} />
            </button>
          </span>
        </>
      }
      footer="Đơn vị 0,25 giờ. Tag Rework bắt buộc khi log vào WP đã Done (tự đặt và khoá). Khoá timesheet sau thứ Ba tuần kế tiếp; mở lại cần PM duyệt và ghi audit. Giờ WP nền và WP feature tách riêng để tính margin theo feature (F7.4). Tự lưu khi sửa."
    >
      {/* Dải tổng hợp + trạng thái khoá */}
      <div className="flex flex-wrap items-stretch border-b border-slate-200 bg-[#f3f6fa] text-[12px]">
        {[
          { l: 'Giờ log', v: `${fmtH(logH)}h`, c: '' },
          { l: 'Giờ allocation', v: `${fmtH(allocH)}h`, c: '', s: `40 × ${allocPct}%` },
          { l: 'Timesheet accuracy', v: allocH ? `lệch ${acc.toFixed(0)}%` : '—', c: accTone(acc), s: '|log − alloc| / alloc' },
          { l: 'Rework', v: `${fmtH(reworkH)}h`, c: reworkH ? 'text-amber-700' : '' },
          { l: 'WP nền', v: `${fmtH(foundationH)}h`, c: '' },
        ].map((x) => (
          <div key={x.l} className="px-3 py-1.5 border-r border-slate-200">
            <span className="text-slate-500">{x.l}: </span>
            <b className={`tabular-nums ${x.c || 'text-slate-800'}`}>{x.v}</b>
            {x.s && <span className="text-[11px] text-slate-400"> ({x.s})</span>}
          </div>
        ))}
        <div className="px-3 py-1.5 flex flex-wrap items-center gap-1.5 text-slate-600">
          {alloc.map((c) => {
            const lh = sumH(rows.filter((r) => r.projectId === c.projectId));
            const ah = (40 * c.pct) / 100;
            return (
              <span key={c.projectId} className="inline-flex items-center gap-1 px-1.5 rounded-[3px] border border-slate-200 bg-white text-[11.5px] tabular-nums" title={projectOf(c.projectId)?.name}>
                <span className="font-mono text-[#1f5fa8]">{c.projectId}</span> {fmtH(lh)}/{fmtH(ah)}h
              </span>
            );
          })}
        </div>
        <div className="ml-auto px-3 py-1 flex items-center gap-1.5">
          {lockedWeek ? (
            sheet.reopen === 'open' ? (
              <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-200" icon={LockOpen}>
                Đã mở lại (PM duyệt)
              </Tag>
            ) : sheet.reopen === 'pending' ? (
              <>
                <Tag cls="bg-amber-50 text-amber-700 border-amber-200" icon={Lock}>
                  Chờ PM duyệt
                </Tag>
                {role === 'PM' && (
                  <Btn variant="success" className="h-6! px-2! text-[11px]!" icon={Unlock} onClick={approveReopen}>
                    PM duyệt mở lại
                  </Btn>
                )}
              </>
            ) : (
              <>
                <Tag cls="bg-slate-100 text-slate-600 border-slate-300" icon={Lock}>
                  Đã khoá
                </Tag>
                <Btn className="h-6! px-2! text-[11px]!" icon={Unlock} onClick={askReopen}>
                  Xin mở lại
                </Btn>
              </>
            )
          ) : (
            <Tag cls="bg-sky-50 text-sky-700 border-sky-200">Đang mở · khoá sau {dmy(addDays(week, 8))}</Tag>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className={`${erp.table} min-w-[1150px]`}>
          <thead>
            <tr>
              <th className={`${erp.th} border-t-0 border-l-0 text-left w-72`}>Dự án</th>
              <th className={`${erp.th} border-t-0 text-left`}>WP</th>
              <th className={`${erp.th} border-t-0 w-[104px]`}>Tag</th>
              {DAYS.map((d, i) => (
                <th key={d} className={`${erp.th} border-t-0 text-center w-[64px] ${addDays(week, i) === TODAY ? 'bg-[#d6e4f5]' : ''}`}>
                  {d}
                  <span className="block text-[10px] font-normal text-slate-500">{weekLabel(addDays(week, i))}</span>
                </th>
              ))}
              <th className={`${erp.th} border-t-0 text-left w-36`}>Ghi chú</th>
              <th className={`${erp.th} border-t-0 text-right w-16`}>Tổng</th>
              <th className={`${erp.th} border-t-0 border-r-0 w-[88px]`} />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const p = projectOf(r.projectId);
              const wps = p ? projectDetail(p).wps : [];
              const wp = wps.find((w) => w.code === r.wp);
              const forced = wp?.status === 'Done';
              const total = r.hours.reduce((a, b) => a + b, 0);
              return (
                <tr key={r.id} className={delId === r.id ? 'bg-[#fff5f5]' : erp.tr}>
                  <td className={`${erp.td} border-l-0 py-1`}>
                    {readOnly ? (
                      <>
                        <span className={erp.code}>{r.projectId}</span> <span className="text-[11.5px] text-slate-600">{p?.name}</span>
                      </>
                    ) : (
                      <select value={r.projectId} onChange={(e) => update(r.id, { projectId: e.target.value })} className={`${SEL} w-full`}>
                        {projOptions.map((id) => (
                          <option key={id} value={id}>
                            {id} · {projectOf(id)?.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className={`${erp.td} py-1`}>
                    {readOnly ? (
                      <>
                        <span className={erp.code}>{r.wp}</span> {r.wpName}
                      </>
                    ) : (
                      <select value={r.wp} onChange={(e) => update(r.id, { wp: e.target.value })} className={`${SEL} w-full`}>
                        {wps.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.code} · {w.name} · {w.status}
                          </option>
                        ))}
                      </select>
                    )}
                    {isFoundation(r.projectId, r.wp) && <span className="text-[10.5px] text-violet-700">WP nền</span>}
                  </td>
                  <td className={`${erp.td} py-1 text-center`}>
                    {readOnly || forced ? (
                      <span className="inline-flex items-center gap-1" title={forced ? 'WP đã Done → bắt buộc Rework' : ''}>
                        <Tag cls={r.tag === 'Rework' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}>{r.tag}</Tag>
                        {forced && !readOnly && <Lock size={11} className="text-slate-400" />}
                      </span>
                    ) : (
                      <select value={r.tag} onChange={(e) => update(r.id, { tag: e.target.value as TsRow['tag'] })} className={`${SEL} w-full px-1.5!`}>
                        <option>Normal</option>
                        <option>Rework</option>
                      </select>
                    )}
                  </td>
                  {r.hours.map((h, i) => (
                    <td key={i} className={`${erp.td} px-0.5 py-1`}>
                      {readOnly ? (
                        <span className="block text-right px-1.5 tabular-nums">{h ? fmtH(h) : ''}</span>
                      ) : (
                        <input type="number" step={0.25} min={0} max={24} value={h} onChange={(e) => setHour(r, i, Number(e.target.value))} className={`${SEL} w-full px-1.5! text-right tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`} />
                      )}
                    </td>
                  ))}
                  <td className={`${erp.td} py-1`}>
                    {readOnly ? <span className="text-[12px] text-slate-600">{r.note}</span> : <input value={r.note} onChange={(e) => update(r.id, { note: e.target.value })} placeholder="Tuỳ chọn" className={`${SEL} w-full`} />}
                  </td>
                  <td className={`${erp.td} ${erp.num} font-semibold`}>{fmtH(total)}</td>
                  <td className={`${erp.td} border-r-0 text-center`}>
                    {readOnly ? null : delId === r.id ? (
                      <span className="inline-flex gap-1">
                        <Btn variant="danger" className="h-6! px-1.5! text-[11px]!" onClick={() => delRow(r.id)}>
                          Xoá
                        </Btn>
                        <Btn className="h-6! px-1.5! text-[11px]!" onClick={() => setDelId(null)}>
                          Huỷ
                        </Btn>
                      </span>
                    ) : (
                      <button type="button" title="Xoá dòng" onClick={() => setDelId(r.id)} className="text-slate-400 hover:text-rose-600 cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={11} className="px-3 py-6 text-center text-slate-400 italic">
                  Chưa log giờ tuần này.
                </td>
              </tr>
            )}
            <tr className={erp.totalRow}>
              <td className={`${erp.td} border-l-0`} colSpan={3}>
                Tổng theo ngày
              </td>
              {dayTotals.map((t, i) => (
                <td key={i} className={`${erp.td} ${erp.num} ${t > 12 ? 'text-rose-700' : ''}`} title={t > 12 ? 'Quá 12 giờ/ngày' : undefined}>
                  {fmtH(t)}
                </td>
              ))}
              <td className={erp.td} />
              <td className={`${erp.td} ${erp.num}`}>{fmtH(logH)}</td>
              <td className={`${erp.td} border-r-0`} />
            </tr>
            <tr className="bg-white text-[11.5px] text-slate-500">
              <td className={`${erp.td} border-l-0`} colSpan={3}>
                Allocation theo ngày (8h × {allocPct}%)
              </td>
              {DAYS.map((d, i) => (
                <td key={d} className={`${erp.td} ${erp.num} ${Math.abs(dayTotals[i] - (8 * allocPct) / 100) > 2 && (week < THIS_WEEK || addDays(week, i) < TODAY) ? 'text-amber-700' : ''}`}>
                  {fmtH((8 * allocPct) / 100)}
                </td>
              ))}
              <td className={erp.td} />
              <td className={`${erp.td} ${erp.num}`}>{fmtH(allocH)}</td>
              <td className={`${erp.td} border-r-0`} />
            </tr>
          </tbody>
        </table>
      </div>
      {!readOnly && (
        <div className="px-3 py-1.5 border-t border-slate-200 flex items-center gap-2">
          <Btn icon={Plus} className="h-7" onClick={addRow}>
            Thêm dòng
          </Btn>
          <span className="text-[11px] text-slate-500">
            {me.name} · {me.level} {me.job} · khối {me.khoi} · dự án được allocate tuần này: {alloc.map((c) => `${c.projectId} ${c.pct}%`).join(', ') || 'không có'}
          </span>
        </div>
      )}
    </Panel>
  );

  const reportPanel = (
    <Panel
      title={
        <>
          Báo cáo thiếu timesheet <span className="font-normal normal-case text-slate-500 tracking-normal">· {team.length} thành viên · 4 tuần gần nhất</span>
        </>
      }
      icon={ClipboardList}
      noPad
      actions={
        <>
          {msg && <span className="text-[12px] text-emerald-700">{msg}</span>}
          <ProjectSelect projects={projects} value={rp.id} onChange={setProjId} />
          <Btn variant="primary" icon={BellRing} className="h-7" disabled={!report.some((r) => r.shortN)} onClick={() => remind(report.filter((r) => r.shortN).map((r) => r.m.person.code))}>
            Nhắc tất cả ({report.filter((r) => r.shortN).length})
          </Btn>
        </>
      }
      footer={`Giờ allocation = 40 × % allocation vào dự án (tuần đã qua dùng kế hoạch tuần này — mẫu). Tuần hiện tại tính đến hết hôm qua (${elapsedDays(THIS_WEEK)}/5 ngày). Ô đỏ = thiếu >20% so với allocation. % = |log − allocation| / allocation.`}
    >
      <div className="overflow-x-auto">
        <table className={`${erp.table} min-w-[1100px]`}>
          <thead>
            <tr>
              <th className={`${erp.th} border-t-0 border-l-0 text-left`}>Thành viên</th>
              <th className={`${erp.th} border-t-0 w-14`}>Vai trò</th>
              <th className={`${erp.th} border-t-0 text-right w-14`}>%</th>
              {RWEEKS.map((w) => (
                <th key={w} className={`${erp.th} border-t-0 text-center w-32 ${w === THIS_WEEK ? 'bg-[#d6e4f5]' : ''}`}>
                  W{weekNo(w)} <span className="font-normal text-slate-500 text-[10.5px]">{weekLabel(w)}</span>
                  <span className="block text-[10px] font-normal text-slate-500">log / alloc · lệch</span>
                </th>
              ))}
              <th className={`${erp.th} border-t-0 text-center w-32`}>4 tuần</th>
              <th className={`${erp.th} border-t-0 border-r-0 w-24`}>Nhắc</th>
            </tr>
          </thead>
          <tbody>
            {report.map((r) => (
              <tr key={r.m.person.code} className={erp.tr}>
                <td className={`${erp.td} border-l-0 whitespace-nowrap`}>
                  <b className="text-slate-800">{r.m.person.name}</b> <span className="text-[11px] text-slate-500 font-mono">{r.m.person.code}</span>
                  {r.m.person.khoi !== rp.khoi && <span className="ml-1 text-[11px] text-teal-700">({r.m.person.khoi})</span>}
                </td>
                <td className={`${erp.td} text-center`}>{r.m.role}</td>
                <td className={`${erp.td} ${erp.num}`}>{r.m.pct}%</td>
                {r.cells.map((c) => (
                  <td key={c.w} className={`${erp.td} text-center tabular-nums ${c.short ? 'bg-rose-100' : ''}`}>
                    {c.exp ? (
                      <>
                        <span className={c.short ? 'text-rose-700 font-bold' : 'text-slate-800'}>
                          {fmtH(c.log)} / {fmtH(Math.round(c.exp * 4) / 4)}h
                        </span>{' '}
                        <span className={`text-[11px] ${accTone(c.acc)}`}>{c.acc.toFixed(0)}%</span>
                        {c.log === 0 && <span className="block text-[10.5px] text-rose-700 font-semibold">chưa log</span>}
                      </>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                ))}
                <td className={`${erp.td} text-center tabular-nums font-semibold`}>
                  {fmtH(r.log)} / {fmtH(Math.round(r.exp * 4) / 4)}h <span className={`text-[11px] ${accTone(r.acc)}`}>{r.acc.toFixed(0)}%</span>
                </td>
                <td className={`${erp.td} border-r-0 text-center`}>
                  {reminded.has(r.m.person.code) ? (
                    <span className="text-[11px] text-emerald-700">Đã nhắc</span>
                  ) : (
                    <Btn className="h-6! px-2! text-[11px]!" icon={BellRing} disabled={!r.shortN} onClick={() => remind([r.m.person.code])}>
                      Nhắc
                    </Btn>
                  )}
                </td>
              </tr>
            ))}
            {!report.length && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-slate-400 italic">
                  Dự án chưa có thành viên được allocate tuần này.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', 'Cá nhân', 'Timesheet theo WP']}
        title="Timesheet theo WP"
        actions={<RoleSelect value={role} onChange={setRole} />}
        meta={
          tab === 'mine'
            ? [
                { label: 'Người', value: `${me.name} (${me.code})` },
                { label: 'Tuần', value: `W${weekNo(week)} · ${dmy(week)} – ${dmy(addDays(week, 4))}` },
                { label: 'Trạng thái', value: readOnly ? 'Đã khoá' : lockedWeek ? 'Mở lại' : 'Đang mở' },
                { label: 'Accuracy', value: <span className={accTone(acc)}>{allocH ? `lệch ${acc.toFixed(0)}%` : '—'}</span> },
              ]
            : [
                { label: 'Dự án', value: `${rp.code} · ${rp.name}` },
                { label: 'PM', value: rp.pm },
                {
                  label: 'Thiếu tuần này',
                  value: (
                    <span className={shortNow.length ? 'text-rose-700 inline-flex items-center gap-1' : ''}>
                      {shortNow.length > 0 && <AlertTriangle size={12} />}
                      {shortNow.length} người
                    </span>
                  ),
                },
                { label: 'Lệch TB 4 tuần', value: `${(report.reduce((s, r) => s + r.acc, 0) / Math.max(1, report.length)).toFixed(0)}%` },
              ]
        }
      />
      <div>
        <FolderTabs<TabKey>
          tabs={[
            { key: 'mine', label: 'Timesheet của tôi', icon: Clock },
            { key: 'report', label: 'Báo cáo thiếu timesheet', icon: ClipboardList },
          ]}
          value={tab}
          onChange={setTab}
        />
        <div className="pt-3">{tab === 'mine' ? mine : reportPanel}</div>
      </div>
    </ErpPage>
  );
};
