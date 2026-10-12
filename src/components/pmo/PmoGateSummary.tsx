/**
 * PmoGateSummary — PMO-08 Tóm tắt gate 1 trang cho người duyệt (F2.2).
 *
 * Mở từ Inbox phê duyệt / Chi tiết dự án. Nút "Quay lại" bên trái, Duyệt / Từ chối bên phải
 * (từ chối bắt buộc lý do, nhập inline ngay trên thanh tiêu đề — không popup).
 * Bố cục gọn trên một màn:
 *   hàng 1: thông tin dự án + loại + chuỗi người duyệt (BT GĐSX · QT GĐSX→GĐK · CL GĐSX→GĐK→TCT, tuần tự)
 *           · checklist phase hiện tại kèm evidence · tài chính (ECV, budget burn, margin, EAC)
 *   hàng 2: 9 KPI (KpiCard)
 *   hàng 3: top 5 risk · CR đang mở · Quality Gate release gần nhất
 * Ghi chú: gate pass → khoá baseline WBS/Plan/phân bổ (Scope Freeze).
 */
import React, { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Coins, GitPullRequest, Gauge, Info, ListChecks, ShieldAlert, ShieldCheck, X, XCircle } from 'lucide-react';
import { KPI_DEFS, PHASES, PMO_PROJECTS, TODAY, dmy, fmtTy, marginOf, pct, riskScore } from '../../pmo/pmo';
import { projectDetail } from '../../pmo/pmoData';
import { usePmo } from '../../pmo/PmoContext';
import { Btn, ErpPage, ErpTitleBar, Panel, Tag, erp } from '../erp/Erp';
import { HealthBadge, KpiCard, PhaseStrip, TypeTag } from './PmoBits';

const TH = (x = '') => `${erp.th} border-t-0 ${x}`;
const TD = erp.td;
const GOOD = 'bg-emerald-50 text-emerald-700 border-emerald-200';
const WARN = 'bg-amber-50 text-amber-700 border-amber-200';
const BAD = 'bg-rose-50 text-rose-700 border-rose-200';
const MUTED = 'bg-slate-50 text-slate-600 border-slate-200';

const Row: React.FC<{ label: string; children: React.ReactNode; tone?: 'good' | 'bad' | 'warn' }> = ({ label, children, tone }) => (
  <div className="flex items-baseline justify-between gap-2 px-3 py-1 border-b border-slate-100 last:border-b-0">
    <span className="text-slate-500 text-[12px]">{label}</span>
    <span className={`text-right font-semibold tabular-nums text-[12.5px] ${tone === 'good' ? 'text-emerald-700' : tone === 'bad' ? 'text-rose-700' : tone === 'warn' ? 'text-amber-700' : 'text-slate-800'}`}>{children}</span>
  </div>
);

export const PmoGateSummary: React.FC<{ projectId: string; title: string; onBack: () => void; onDecide?: (approve: boolean, reason?: string) => void }> = ({ projectId, title, onBack, onDecide }) => {
  const { inbox } = usePmo();
  const p = PMO_PROJECTS.find((x) => x.id === projectId) || PMO_PROJECTS[0];
  const d = projectDetail(p);
  const [decision, setDecision] = useState<{ approve: boolean; reason?: string } | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');

  // Chuỗi người duyệt theo loại dự án (tuần tự)
  const chain = p.type === 'BT' ? ['GĐSX'] : p.type === 'QT' ? ['GĐSX', 'GĐK'] : ['GĐSX', 'GĐK', 'TCT'];
  const gateItem = inbox.find((x) => x.projectId === p.id && x.kind === 'Gate' && x.status === 'Chờ duyệt');
  const stepMatch = gateItem?.step?.match(/Bước (\d+)\//);
  const curStep = Math.min(chain.length - 1, stepMatch ? Number(stepMatch[1]) - 1 : 0);

  // Checklist phase hiện tại
  const req = d.checklist.filter((c) => c.required);
  const reqDone = req.filter((c) => c.done).length;
  const reqMissing = req.length - reqDone;

  // Tài chính
  const ecvPct = pct(p.ecv, p.contractValue);
  const planPct = pct(p.ecvPlan, p.contractValue);
  const burnPct = pct(p.costUsed, p.budget);
  const burnDelta = burnPct - ecvPct;
  const margin = marginOf(p);
  const eac = ecvPct > 0 ? p.costUsed / (ecvPct / 100) : 0;

  // Rủi ro & CR
  const topRisks = [...p.risks].filter((r) => r.status !== 'Closed').sort((a, b) => riskScore(b) - riskScore(a)).slice(0, 5);
  const openCrs = d.crs.filter((c) => c.step !== 'Đóng');
  const ageH = (c: (typeof openCrs)[number]) => (c.decidedAt ? 0 : Math.max(0, Math.round((new Date(TODAY).getTime() - new Date(c.createdAt).getTime()) / 864e5)) * 24);

  // Quality Gate release gần nhất (đang chạy, nếu không có thì release close gần nhất)
  const rels = d.releases.filter((r) => r.code !== 'RBuf');
  const rel = rels.find((r) => r.status === 'Đang chạy') || [...rels].reverse().find((r) => r.status === 'Đã close');
  const qg = rel
    ? (() => {
        const ch =
          rel.status === 'Đã close'
            ? rel.quality.critHighOpen
            : d.bugs.filter((b) => b.phaseFound && b.release === rel.code && b.status !== 'Closed' && b.status !== 'Rejected' && (b.severity === 'Critical' || b.severity === 'High')).length;
        const crit = [
          { label: '0 bug Critical/High mở', value: `${ch}`, ok: ch === 0 },
          { label: 'Regression ≥95%', value: `${rel.quality.regression}%`, ok: rel.quality.regression >= 95 },
          { label: 'Automation ≥70%', value: `${rel.quality.automation}%`, ok: rel.quality.automation >= 70 },
          { label: 'DoD ≥90%', value: `${rel.quality.dod}%`, ok: rel.quality.dod >= 90 },
        ];
        return { crit, pass: crit.every((c) => c.ok) };
      })()
    : null;

  const approve = () => {
    setDecision({ approve: true });
    onDecide?.(true);
  };
  const reject = () => {
    if (!reason.trim()) return;
    setDecision({ approve: false, reason: reason.trim() });
    setRejecting(false);
    onDecide?.(false, reason.trim());
  };

  const actions = decision ? (
    <Tag cls={decision.approve ? GOOD : BAD} icon={decision.approve ? Check : X}>
      {decision.approve ? `Đã duyệt bước ${chain[curStep]}${curStep < chain.length - 1 ? ` → chuyển ${chain[curStep + 1]}` : ''}` : `Đã từ chối: ${decision.reason}`}
    </Tag>
  ) : rejecting ? (
    <>
      <input
        autoFocus
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        onKeyDown={(e) => (e.key === 'Enter' ? reject() : e.key === 'Escape' ? setRejecting(false) : null)}
        placeholder="Lý do từ chối *"
        className={`${erp.input} w-72 ${!reason.trim() ? 'border-rose-300' : ''}`}
      />
      <Btn variant="danger" onClick={reject} disabled={!reason.trim()}>
        Xác nhận từ chối
      </Btn>
      <Btn onClick={() => setRejecting(false)}>Huỷ</Btn>
    </>
  ) : (
    <>
      <Btn variant="success" icon={Check} onClick={approve}>
        Duyệt
      </Btn>
      <Btn variant="danger" icon={X} onClick={() => (setRejecting(true), setReason(''))}>
        Từ chối
      </Btn>
    </>
  );

  return (
    <ErpPage>
      <ErpTitleBar
        onBack={onBack}
        title={
          <>
            {title} <span className="text-slate-400 font-normal">·</span> <span className={erp.code}>{p.code}</span> {p.name} <TypeTag t={p.type} />
          </>
        }
        actions={actions}
        meta={[
          { label: 'Khối', value: p.khoi },
          { label: 'Khách hàng', value: p.client },
          { label: 'PM', value: p.pm },
          { label: 'Giá trị HĐ', value: `${fmtTy(p.contractValue)} VNĐ` },
          { label: 'Hợp đồng', value: `${dmy(p.start)} → ${dmy(p.end)}` },
          { label: 'Trình', value: gateItem ? `${gateItem.submittedBy} · ${dmy(gateItem.submittedAt)}` : '—' },
        ]}
        notice={
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#f5f9ff] text-[12px] text-slate-700">
            <Info size={13} className="text-[#1f5fa8] shrink-0" />
            Gate pass → khoá baseline WBS / Master Plan / bảng phân bổ giá trị (Scope Freeze); mọi thay đổi sau đó phải qua CR. Gate pass ghi audit (người duyệt, thời điểm, phiên bản checklist).
          </div>
        }
      />

      {/* Hàng 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr_1fr] gap-3">
        <Panel title="Dự án & người duyệt" icon={ShieldCheck} noPad>
          <div className="px-3 py-2 border-b border-slate-100 flex items-center gap-2 flex-wrap">
            <HealthBadge h={p.health} small />
            <PhaseStrip phase={p.phase} compact />
            <span className="text-[12px] text-slate-600">
              P{p.phase} {PHASES[p.phase - 1].name}
            </span>
          </div>
          <Row label="Loại dự án">
            {p.type} · {p.type === 'BT' ? 'Bình thường' : p.type === 'QT' ? 'Quan trọng' : 'Chiến lược'}
          </Row>
          <Row label="Gate">{title}</Row>
          <Row label="Hạn phase" tone={p.phaseDue < TODAY ? 'bad' : undefined}>
            {dmy(p.phaseDue)}
          </Row>
          <div className="px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">Chuỗi duyệt (tuần tự)</p>
            <div className="flex items-center gap-1 flex-wrap">
              {chain.map((c, i) => {
                const done = i < curStep || (decision?.approve && i === curStep);
                const cur = i === curStep && !decision;
                return (
                  <React.Fragment key={c}>
                    {i > 0 && <ArrowRight size={12} className="text-slate-400" />}
                    <span
                      className={`px-2 h-6 inline-flex items-center gap-1 rounded-[3px] border text-[11.5px] font-bold ${
                        done ? 'bg-emerald-600 text-white border-emerald-700' : cur ? 'bg-[#1f5fa8] text-white border-[#184c88]' : decision && !decision.approve && i === curStep ? 'bg-rose-600 text-white border-rose-700' : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {done && <Check size={11} />}
                      {c}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">SLA 2 ngày làm việc mỗi bước · từ chối phải có lý do, PM sửa và trình lại.</p>
          </div>
        </Panel>

        <Panel
          title={`Checklist P${p.phase} · ${reqDone}/${req.length} bắt buộc`}
          icon={ListChecks}
          noPad
          actions={reqMissing ? <Tag cls={BAD}>Còn {reqMissing} mục bắt buộc</Tag> : <Tag cls={GOOD}>Đủ điều kiện trình</Tag>}
        >
          <div className="overflow-x-auto">
            <table className={`${erp.table} min-w-[520px]`}>
              <thead>
                <tr>
                  <th className={TH('border-l-0 w-16')}>Mã</th>
                  <th className={TH('text-left')}>Mục</th>
                  <th className={TH('w-14')}>BB</th>
                  <th className={TH('w-20')}>Trạng thái</th>
                  <th className={TH('border-r-0 text-left w-44')}>Evidence</th>
                </tr>
              </thead>
              <tbody>
                {d.checklist.map((c) => (
                  <tr key={c.code} className={erp.tr}>
                    <td className={`${TD} border-l-0 whitespace-nowrap ${erp.code}`}>{c.code}</td>
                    <td className={TD}>{c.name}</td>
                    <td className={`${TD} text-center`}>{c.required ? '✓' : ''}</td>
                    <td className={`${TD} text-center`}>{c.done ? <Tag cls={GOOD}>Xong</Tag> : <Tag cls={c.required ? BAD : MUTED}>Chưa</Tag>}</td>
                    <td className={`${TD} border-r-0 text-[11.5px]`}>
                      {c.evidence ? (
                        <a href={c.evidence} target="_blank" rel="noreferrer" className="text-[#1f5fa8] hover:underline" title={c.evidence}>
                          {c.code}.pdf
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                      {c.doneAt && <span className="text-slate-500"> · {dmy(c.doneAt)}</span>}
                    </td>
                  </tr>
                ))}
                {!d.checklist.length && (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-center text-slate-400 italic">
                      Không có checklist.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Tài chính" icon={Coins} noPad>
          <Row label="ECV đã ghi nhận" tone={ecvPct >= planPct ? 'good' : 'bad'}>
            {fmtTy(p.ecv)} · {ecvPct.toFixed(0)}% HĐ
          </Row>
          <Row label="ECV vs plan" tone={ecvPct >= planPct - 5 ? 'good' : 'bad'}>
            {ecvPct - planPct > 0 ? '+' : ''}
            {(ecvPct - planPct).toFixed(1)} điểm (plan {planPct.toFixed(0)}%)
          </Row>
          <Row label="Cost / budget">
            {fmtTy(p.costUsed)} / {fmtTy(p.budget)} · {burnPct.toFixed(0)}%
          </Row>
          <Row label="Budget Burn Δ" tone={burnDelta > 10 ? 'bad' : burnDelta > 5 ? 'warn' : 'good'}>
            {burnDelta > 0 ? '+' : ''}
            {burnDelta.toFixed(1)} điểm
          </Row>
          <Row label="EAC" tone={eac > p.budget * 1.05 ? 'bad' : undefined}>
            {eac ? `${fmtTy(eac)} (${eac > p.budget ? 'vượt' : 'dưới'} budget)` : '—'}
          </Row>
          <Row label="Margin thực / định giá" tone={margin >= p.presaleMargin - 2 ? 'good' : 'bad'}>
            {margin.toFixed(1)}% / {p.presaleMargin.toFixed(1)}%
          </Row>
        </Panel>
      </div>

      {/* Hàng 2: 9 KPI */}
      <Panel title="9 KPI" icon={Gauge} noPad>
        <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-9 gap-1.5 p-2">
          {KPI_DEFS.map((k) => (
            <KpiCard key={k.code} def={k} value={p.kpis[k.code]} trend={p.trend[k.code]} />
          ))}
        </div>
      </Panel>

      {/* Hàng 3 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <Panel title="Top 5 risk" icon={ShieldAlert} noPad>
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={TH('border-l-0 w-14')}>Mã</th>
                <th className={TH('text-left')}>Mô tả</th>
                <th className={TH('w-12')}>P×I</th>
                <th className={TH('border-r-0 w-24')}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {topRisks.map((r) => (
                <tr key={r.code} className={erp.tr}>
                  <td className={`${TD} border-l-0 whitespace-nowrap ${erp.code}`}>{r.code}</td>
                  <td className={TD}>
                    {r.desc}
                    <span className="block text-[11px] text-slate-500">{r.owner}</span>
                  </td>
                  <td className={`${TD} ${erp.num} font-bold ${riskScore(r) >= 6 ? 'text-rose-700' : riskScore(r) >= 3 ? 'text-amber-700' : ''}`}>{riskScore(r)}</td>
                  <td className={`${TD} border-r-0 text-center`}>
                    <Tag cls={r.status === 'Open' ? BAD : r.status === 'Mitigating' ? WARN : MUTED}>{r.status}</Tag>
                  </td>
                </tr>
              ))}
              {!topRisks.length && (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-slate-400 italic">
                    Không có risk mở.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Panel>

        <Panel title={`CR đang mở (${openCrs.length})`} icon={GitPullRequest} noPad>
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={TH('border-l-0 w-16')}>Mã</th>
                <th className={TH('text-left')}>Tiêu đề</th>
                <th className={TH('w-12')}>ΔSP</th>
                <th className={TH('border-r-0 w-24')}>Bước</th>
              </tr>
            </thead>
            <tbody>
              {openCrs.map((c) => {
                const h = ageH(c);
                return (
                  <tr key={c.code} className={erp.tr}>
                    <td className={`${TD} border-l-0 whitespace-nowrap ${erp.code}`}>{c.code}</td>
                    <td className={TD}>
                      {c.title}
                      <span className="block text-[11px] text-slate-500">
                        {c.proposal} · +{fmtTy(c.costDelta)} · +{c.daysDelta} ngày
                      </span>
                    </td>
                    <td className={`${TD} ${erp.num}`}>+{c.spDelta}</td>
                    <td className={`${TD} border-r-0 text-center text-[11.5px]`}>
                      {c.step}
                      {!c.decidedAt && <span className={`block font-bold tabular-nums ${h > 48 ? 'text-rose-700' : 'text-slate-600'}`}>{h}h</span>}
                    </td>
                  </tr>
                );
              })}
              {!openCrs.length && (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-slate-400 italic">
                    Không có CR mở.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Panel>

        <Panel
          title={rel ? `Quality Gate · ${rel.code} (${rel.status})` : 'Quality Gate'}
          icon={ShieldCheck}
          noPad
          actions={qg ? <Tag cls={qg.pass ? GOOD : rel?.quality.waiver ? WARN : BAD}>{qg.pass ? 'Pass' : rel?.quality.waiver ? 'Pass (waiver)' : 'Fail'}</Tag> : undefined}
        >
          {qg && rel ? (
            <>
              <table className={erp.table}>
                <tbody>
                  {qg.crit.map((c) => (
                    <tr key={c.label} className={erp.tr}>
                      <td className={`${TD} border-l-0 border-t-0`}>{c.label}</td>
                      <td className={`${TD} border-t-0 ${erp.num} font-bold ${c.ok ? 'text-emerald-700' : 'text-rose-700'}`}>{c.value}</td>
                      <td className={`${TD} border-t-0 border-r-0 text-center w-10`}>{c.ok ? <CheckCircle2 size={14} className="inline text-emerald-600" /> : <XCircle size={14} className="inline text-rose-600" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-3 py-1.5 text-[11.5px] text-slate-600">
                {dmy(rel.start)} → {dmy(rel.end)} · SP {rel.spDone}/{rel.spPlanned}
                {rel.quality.waiver && <span className="block text-amber-700">Waiver: {rel.quality.waiver}</span>}
                {p.nextGate === 'Go-live' && <span className="block">Go-live yêu cầu Quality Gate release cuối = pass và UAT sign-off có evidence.</span>}
              </p>
            </>
          ) : (
            <p className="px-3 py-4 text-center text-slate-400 italic text-[12px]">Chưa có release đang chạy hoặc đã close (dự án ở P{p.phase}).</p>
          )}
        </Panel>
      </div>
    </ErpPage>
  );
};
