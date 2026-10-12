/**
 * PmoCockpitPage — PMO-01 Project Cockpit (F6.1): màn hình chính của PM.
 *
 * Bố cục cố định theo PRD:
 *   hàng 1: health + phase + ECV · hàng 2: 9 thẻ KPI (bấm để xem công thức, ngưỡng, xu hướng 8 tuần — mở inline, không popup)
 *   hàng 3: "Cần quyết hôm nay" (blocked > SLA, CR chờ, gate đến hạn, cảnh báo) · hàng 4: sprint hiện tại + top 5 risk.
 */
import React, { useMemo, useState } from 'react';
import { AlertTriangle, Gauge, ListChecks, ShieldAlert, Timer } from 'lucide-react';
import { KPI_DEFS, KpiCode, blockedDays, dmy, fmtKpi, fmtThreshold, fmtTy, kpiColor, marginOf, pct, riskScore, workDays, TODAY, PHASES } from '../../pmo/pmo';
import { usePmo } from '../../pmo/PmoContext';
import { ErpPage, ErpTitleBar, Panel, Tag, erp } from '../erp/Erp';
import { HealthBadge, KpiCard, PhaseStrip, ProjectSelect, RoleSelect, TypeTag } from './PmoBits';

const Stat: React.FC<{ label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: 'good' | 'bad' | 'neutral' }> = ({ label, value, sub, tone = 'neutral' }) => (
  <div className="px-3 py-2 border-r border-slate-200 last:border-r-0 min-w-0">
    <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    <p className={`text-[17px] font-bold tabular-nums leading-tight ${tone === 'good' ? 'text-emerald-700' : tone === 'bad' ? 'text-rose-700' : 'text-slate-900'}`}>{value}</p>
    {sub && <p className="text-[11px] text-slate-500 truncate">{sub}</p>}
  </div>
);

const STATUS_CLS: Record<string, string> = {
  Done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'In Progress': 'bg-sky-50 text-sky-700 border-sky-200',
  Review: 'bg-violet-50 text-violet-700 border-violet-200',
  'To Do': 'bg-slate-50 text-slate-600 border-slate-200',
  Blocked: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const PmoCockpitPage: React.FC<{ onNavigate?: (item: string) => void }> = ({ onNavigate }) => {
  const { projects, focus: p, focusId, setFocusId, role, setRole, inbox } = usePmo();
  const [kpiOpen, setKpiOpen] = useState<KpiCode | null>(null);

  const ecvPct = pct(p.ecv, p.contractValue);
  const ecvPlanPct = pct(p.ecvPlan, p.contractValue);
  const burnPct = pct(p.costUsed, p.budget);
  const margin = marginOf(p);
  const gateDays = workDays(TODAY, p.phaseDue);

  /** Hàng 3 — việc cần quyết hôm nay, gom từ các nguồn. */
  const todo = useMemo(() => {
    const rows: { kind: string; text: string; who: string; sla: string; bad: boolean; go?: string }[] = [];
    p.blocked
      .filter((b) => blockedDays(b.hours) > 1)
      .forEach((b) =>
        rows.push({ kind: 'Blocked', text: `${b.wp} ${b.name} · ${b.reason}`, who: b.owner, sla: `${blockedDays(b.hours).toFixed(1)} ngày`, bad: blockedDays(b.hours) > 2 }),
      );
    inbox
      .filter((x) => x.projectId === p.id && x.status === 'Chờ duyệt')
      .forEach((x) => {
        const wd = workDays(x.submittedAt, TODAY);
        rows.push({ kind: x.kind, text: `${x.id} · ${x.title}`, who: x.approver, sla: `${wd}/${x.slaDays} ngày`, bad: wd > x.slaDays, go: 'Inbox phê duyệt' });
      });
    if (p.phase < 6 && gateDays <= 3 && p.checklistPct < 80) rows.push({ kind: 'Gate', text: `${p.nextGate} đến hạn ${dmy(p.phaseDue)} · checklist ${p.checklistPct}%`, who: p.pm, sla: `${gateDays} ngày`, bad: gateDays <= 1 });
    else if (p.phase < 6 && gateDays < 0) rows.push({ kind: 'Phase', text: `P${p.phase} ${PHASES[p.phase - 1].name} quá hạn ${dmy(p.phaseDue)}`, who: p.pm, sla: `${-gateDays} ngày`, bad: true });
    if (p.health === 'red') rows.push({ kind: 'Cảnh báo', text: `AL-01 Health đỏ · do ${p.drivers.map((d) => d.label).join(', ')}`, who: 'PM, GĐSX, GĐK', sla: 'ngay', bad: true });
    const bb = p.kpis.budgetBurn;
    if (bb > 10) rows.push({ kind: 'Cảnh báo', text: `AL-09 Budget Burn Δ ${fmtKpi(KPI_DEFS[5], bb)}`, who: 'PM, GĐSX, GĐK', sla: 'ngay', bad: true });
    return rows;
  }, [p, inbox, gateDays]);

  const topRisks = [...p.risks].filter((r) => r.status !== 'Closed').sort((a, b) => riskScore(b) - riskScore(a)).slice(0, 5);
  const kd = kpiOpen ? KPI_DEFS.find((d) => d.code === kpiOpen)! : null;
  const maxVel = Math.max(...p.sprint.velocity, p.sprint.spPlanned);

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', 'Project Cockpit']}
        title={
          <>
            <span className={erp.code}>{p.code}</span> {p.name} <TypeTag t={p.type} />
          </>
        }
        actions={
          <>
            <ProjectSelect projects={projects} value={focusId} onChange={setFocusId} />
            <RoleSelect value={role} onChange={setRole} />
          </>
        }
        meta={[
          { label: 'Khối', value: p.khoi },
          { label: 'Khách hàng', value: p.client },
          { label: 'PM', value: p.pm },
          { label: 'Hợp đồng', value: `${dmy(p.start)} → ${dmy(p.end)}` },
          { label: 'Giá trị HĐ', value: `${fmtTy(p.contractValue)} VNĐ` },
          { label: 'Dữ liệu Jira', value: `${p.lastSync} hôm nay` },
        ]}
      />

      {/* Hàng 1: health · phase · ECV */}
      <div className="bg-white border border-slate-300 rounded-[4px] grid grid-cols-2 lg:grid-cols-[auto_1.6fr_1fr_1fr_1fr_1fr]">
        <div className="px-3 py-2 border-r border-slate-200 flex flex-col gap-1 min-w-[150px]">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">Health</p>
          <div className="flex items-center gap-2">
            <HealthBadge h={p.health} />
            <span className="text-[11px] text-slate-500 leading-tight">{p.drivers.length ? `do ${p.drivers.map((d) => `#${d.no}`).join(', ')}` : '9/9 KPI đạt'}</span>
          </div>
        </div>
        <div className="px-3 py-2 border-r border-slate-200 col-span-2 lg:col-span-1 min-w-0">
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">
            Phase hiện tại · gate kế tiếp: <b className="text-slate-700">{p.nextGate}</b>
          </p>
          <div className="mt-1">
            <PhaseStrip phase={p.phase} short />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Hạn phase {dmy(p.phaseDue)} ({gateDays >= 0 ? `còn ${gateDays}` : `quá ${-gateDays}`} ngày LV) · checklist{' '}
            <b className={p.checklistPct < 80 ? 'text-amber-700' : 'text-slate-800'}>{p.checklistPct}%</b>
          </p>
        </div>
        <Stat label="ECV đã ghi nhận" value={`${fmtTy(p.ecv)} VNĐ`} sub={`${ecvPct.toFixed(0)}% giá trị HĐ · plan ${ecvPlanPct.toFixed(0)}%`} tone={ecvPct >= ecvPlanPct ? 'good' : 'bad'} />
        <Stat label="% ECV vs plan" value={`${(ecvPct - ecvPlanPct).toFixed(1)} điểm`} sub={ecvPct >= ecvPlanPct ? 'đúng nhịp doanh thu' : 'chậm so với Release Plan'} tone={ecvPct >= ecvPlanPct - 5 ? 'good' : 'bad'} />
        <Stat label="Budget burn" value={`${burnPct.toFixed(0)}%`} sub={`${fmtTy(p.costUsed)} / ${fmtTy(p.budget)} VNĐ`} tone={p.kpis.budgetBurn > 5 ? 'bad' : 'neutral'} />
        <Stat label="Margin thực / định giá" value={`${margin.toFixed(1)}% / ${p.presaleMargin.toFixed(1)}%`} sub={margin >= p.presaleMargin ? 'đạt margin định giá' : `thấp hơn ${(p.presaleMargin - margin).toFixed(1)} điểm`} tone={margin >= p.presaleMargin - 2 ? 'good' : 'bad'} />
      </div>

      {/* Hàng 2: 9 KPI */}
      <Panel title="9 KPI" icon={Gauge} noPad footer="Màu KPI theo ngưỡng Phụ lục A · Health: Đỏ nếu ≥1 KPI đỏ trong {#3, #6, #9} hoặc ≥3 KPI đỏ; Vàng nếu ≥2 vàng hoặc 1 đỏ khác. Bấm thẻ để xem công thức và xu hướng 8 tuần.">
        <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-9 gap-1.5 p-2">
          {KPI_DEFS.map((d) => (
            <KpiCard key={d.code} def={d} value={p.kpis[d.code]} trend={p.trend[d.code]} active={kpiOpen === d.code} onClick={() => setKpiOpen(kpiOpen === d.code ? null : d.code)} />
          ))}
        </div>
        {kd && (
          <div className="border-t border-slate-200 bg-[#f5f9ff] px-3 py-2 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3 text-[12px]">
            <div className="space-y-0.5">
              <p>
                <b>
                  #{kd.no} {kd.label}
                </b>{' '}
                = {kd.formula}
              </p>
              <p className="text-slate-600">
                Nguồn: {kd.source} · Ngưỡng: {fmtThreshold(kd)} · Hiện tại:{' '}
                <b className={kpiColor(kd, p.kpis[kd.code]) === 'red' ? 'text-rose-700' : kpiColor(kd, p.kpis[kd.code]) === 'yellow' ? 'text-amber-700' : 'text-emerald-700'}>{fmtKpi(kd, p.kpis[kd.code])}</b>
              </p>
            </div>
            <table className={`${erp.table} w-auto`}>
              <thead>
                <tr>
                  {p.trend[kd.code].map((_, i) => (
                    <th key={i} className={`${erp.th} text-center px-2 py-1`}>
                      T-{7 - i}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {p.trend[kd.code].map((v, i) => (
                    <td key={i} className={`${erp.td} text-center px-2 py-1 ${kpiColor(kd, v) === 'red' ? 'text-rose-700 font-bold' : kpiColor(kd, v) === 'yellow' ? 'text-amber-700' : ''}`}>
                      {fmtKpi(kd, v)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {/* Hàng 3: cần quyết hôm nay */}
      <Panel
        title={
          <>
            Cần quyết hôm nay <span className="ml-1 px-1.5 rounded-[3px] bg-rose-600 text-white text-[11px]">{todo.length}</span>
          </>
        }
        icon={AlertTriangle}
        noPad
      >
        <table className={erp.table}>
          <thead>
            <tr>
              <th className={`${erp.th} border-t-0 border-l-0 w-28`}>Loại</th>
              <th className={`${erp.th} border-t-0 text-left`}>Nội dung</th>
              <th className={`${erp.th} border-t-0 w-44`}>Người xử lý</th>
              <th className={`${erp.th} border-t-0 w-28 text-center`}>SLA</th>
              <th className={`${erp.th} border-t-0 border-r-0 w-28`}></th>
            </tr>
          </thead>
          <tbody>
            {todo.map((r, i) => (
              <tr key={i} className={erp.tr}>
                <td className={`${erp.td} border-l-0`}>
                  <Tag cls={r.bad ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>{r.kind}</Tag>
                </td>
                <td className={erp.td}>{r.text}</td>
                <td className={`${erp.td} whitespace-nowrap`}>{r.who}</td>
                <td className={`${erp.td} text-center tabular-nums font-semibold ${r.bad ? 'text-rose-700' : 'text-amber-700'}`}>{r.sla}</td>
                <td className={`${erp.td} border-r-0 text-center`}>
                  {r.go && onNavigate && (
                    <button type="button" onClick={() => onNavigate(r.go!)} className="text-[#1f5fa8] hover:underline text-[12px] cursor-pointer">
                      Mở inbox
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!todo.length && (
              <tr>
                <td colSpan={5} className="px-3 py-5 text-center text-slate-400 italic">
                  Không có việc nào quá SLA hoặc chờ quyết định.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>

      {/* Hàng 4: sprint + risk */}
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-3">
        <Panel
          title={p.sprint.seq ? `Sprint ${p.sprint.seq} · ${dmy(p.sprint.start)} → ${dmy(p.sprint.end)}` : 'Sprint hiện tại'}
          icon={Timer}
          noPad
          actions={
            p.sprint.seq ? (
              <span className="text-[12px] text-slate-600">
                SP done <b className="text-slate-900">{p.sprint.spDone}</b>/{p.sprint.spPlanned} · velocity TB 3 sprint <b className="text-slate-900">{Math.round(p.sprint.velocity.slice(-3).reduce((a, b) => a + b, 0) / 3)}</b> SP
              </span>
            ) : undefined
          }
        >
          {p.sprint.seq ? (
            <>
              <div className="flex items-end gap-2 px-3 pt-3 pb-2 border-b border-slate-200">
                <span className="text-[11px] text-slate-500 w-20 shrink-0">Velocity 6 sprint</span>
                <div className="flex items-end gap-1.5 h-12 flex-1">
                  {p.sprint.velocity.map((v, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5 w-10" title={`Sprint ${p.sprint.seq - 5 + i}: ${v} SP`}>
                      <span className="text-[10px] text-slate-600 tabular-nums">{v}</span>
                      <div className={`w-full rounded-t-[2px] ${v >= p.sprint.spPlanned * 0.9 ? 'bg-emerald-500' : v >= p.sprint.spPlanned * 0.75 ? 'bg-amber-400' : 'bg-rose-500'}`} style={{ height: `${(v / maxVel) * 32}px` }} />
                    </div>
                  ))}
                </div>
                <span className="text-[11px] text-slate-500 shrink-0">plan {p.sprint.spPlanned} SP/sprint</span>
              </div>
              <table className={erp.table}>
                <thead>
                  <tr>
                    <th className={`${erp.th} border-t-0 border-l-0`}>WP</th>
                    <th className={`${erp.th} border-t-0 text-left`}>Tên</th>
                    <th className={`${erp.th} border-t-0`}>Owner</th>
                    <th className={`${erp.th} border-t-0 text-center w-12`}>SP</th>
                    <th className={`${erp.th} border-t-0 text-center w-28`}>Trạng thái</th>
                    <th className={`${erp.th} border-t-0 border-r-0 text-center w-16`}>Reopen</th>
                  </tr>
                </thead>
                <tbody>
                  {p.sprint.wps.map((w) => (
                    <tr key={w.wp} className={erp.tr}>
                      <td className={`${erp.td} border-l-0 ${erp.code}`}>{w.wp}</td>
                      <td className={erp.td}>{w.name}</td>
                      <td className={`${erp.td} whitespace-nowrap`}>{w.owner}</td>
                      <td className={`${erp.td} text-center`}>{w.sp}</td>
                      <td className={`${erp.td} text-center`}>
                        <Tag cls={STATUS_CLS[w.status]}>{w.status}</Tag>
                      </td>
                      <td className={`${erp.td} border-r-0 text-center ${w.reopen ? 'text-rose-700 font-bold' : 'text-slate-400'}`}>{w.reopen || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="px-3 py-6 text-center text-slate-400 italic text-[12px]">Dự án đang ở P{p.phase} — chưa chạy sprint. Sprint bắt đầu từ P4.</p>
          )}
        </Panel>

        <Panel
          title="Top 5 risk"
          icon={ShieldAlert}
          noPad
          actions={
            <span className="text-[12px] text-slate-600">
              Risk Score <b className={p.kpis.riskScore >= 12 ? 'text-rose-700' : p.kpis.riskScore >= 8 ? 'text-amber-700' : 'text-emerald-700'}>{p.kpis.riskScore}</b>
            </span>
          }
          footer="Score = P × I (1–3). Risk ≥6 bắt buộc có mitigation; quá 14 ngày chưa review → nhắc PM (thứ Năm)."
        >
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 w-14`}>Mã</th>
                <th className={`${erp.th} border-t-0 text-left`}>Rủi ro</th>
                <th className={`${erp.th} border-t-0 text-center w-16`}>P×I</th>
                <th className={`${erp.th} border-t-0 w-24`}>Trạng thái</th>
                <th className={`${erp.th} border-t-0 border-r-0 text-center w-24`}>Review</th>
              </tr>
            </thead>
            <tbody>
              {topRisks.map((r) => {
                const sc = riskScore(r);
                const stale = workDays(r.lastReview, TODAY) > 10;
                return (
                  <tr key={r.code} className={erp.tr}>
                    <td className={`${erp.td} border-l-0 ${erp.code}`}>{r.code}</td>
                    <td className={erp.td}>
                      {r.desc}
                      <span className="block text-[11px] text-slate-500">Owner: {r.owner}</span>
                    </td>
                    <td className={`${erp.td} text-center font-bold ${sc >= 6 ? 'text-rose-700' : sc >= 4 ? 'text-amber-700' : 'text-slate-700'}`}>
                      {sc} <span className="font-normal text-slate-400 text-[11px]">({r.p}×{r.i})</span>
                    </td>
                    <td className={erp.td}>
                      <Tag cls={r.status === 'Mitigating' ? 'bg-sky-50 text-sky-700 border-sky-200' : r.status === 'Occurred' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>{r.status}</Tag>
                    </td>
                    <td className={`${erp.td} border-r-0 text-center tabular-nums ${stale ? 'text-rose-700 font-semibold' : ''}`}>{dmy(r.lastReview)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </div>

      <p className="text-[11px] text-slate-500 flex items-center gap-1">
        <ListChecks size={12} /> Dữ liệu mẫu — KPI tính lại mỗi đêm và ngay khi có gate fail / bug Critical / CR duyệt; Jira đồng bộ ≤15 phút.
      </p>
    </ErpPage>
  );
};
