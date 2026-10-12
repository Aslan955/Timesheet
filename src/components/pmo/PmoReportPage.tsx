/**
 * PmoReportPage — PMO-12 Báo cáo dự án (F6.2 Tự sinh báo cáo Weekly / Sprint Close / Release).
 *
 * Chế độ danh sách: thẻ tổng hợp (Report on-time rate, nháp chờ PM, đã gửi, gửi muộn) + bộ lọc một hàng
 *   (Khối · Loại · Trạng thái · Dự án) + bảng báo cáo; bấm dòng → chế độ soạn trong cùng trang.
 * Chế độ soạn: nút Quay lại bên trái; Lưu nháp · Xác nhận & gửi · Xuất PDF · Xuất DOCX bên phải.
 *   Trái: các khối tự sinh từ dữ liệu (9 KPI + biến động tuần trước, ECV/budget, top risk, CR, WP blocked),
 *   "Nhận định tiến độ" (AI draft → PM đã sửa), "Quyết định cần xin" (PM nhập), ô xác nhận trách nhiệm.
 *   Phải: người nhận, lịch sử phiên bản, ghi chú AI governance.
 * Trạng thái báo cáo giữ trong STORE cấp module để không mất khi đổi màn.
 */
import React, { useState } from 'react';
import { AlertTriangle, Bot, Check, Clock, FileText, FileType, Filter, GitPullRequest, History, Save, Send, ShieldCheck, Users, Wallet } from 'lucide-react';
import { KHOI, KPI_DEFS, PmoProject, TODAY, dmy, fmtKpi, fmtThreshold, fmtTy, kpiColor, marginOf, pct, riskScore } from '../../pmo/pmo';
import { usePmo } from '../../pmo/PmoContext';
import { REPORTS_SEED, Report, ReportStatus, ReportType, projectDetail } from '../../pmo/pmoData';
import { Btn, ErpPage, ErpTitleBar, FieldTable, Panel, Tag, erp } from '../erp/Erp';
import { HealthBadge, RoleSelect } from './PmoBits';

// ==========================================================================
// Trạng thái trong phiên
// ==========================================================================
interface Version {
  at: string;
  by: string;
  action: string;
}
interface ReportState extends Report {
  narrative: string;
  narrativeEdited: boolean;
  decisions: string;
  confirmed: boolean;
  versions: Version[];
}

const STATUS_CLS: Record<ReportStatus, string> = {
  'Nháp AI': 'bg-violet-50 text-violet-700 border-violet-200',
  'PM đã sửa': 'bg-sky-50 text-sky-700 border-sky-200',
  'Đã gửi': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Gửi muộn': 'bg-rose-50 text-rose-700 border-rose-200',
};
const TYPES: ReportType[] = ['Weekly Status', 'Sprint Close', 'Release Report'];
const STATUSES: ReportStatus[] = ['Nháp AI', 'PM đã sửa', 'Đã gửi', 'Gửi muộn'];
const SEL = `${erp.input} h-7 text-[12px]`;
const NOW = `${TODAY} 16:45`;

const dt = (s?: string) => (s ? `${dmy(s.slice(0, 10))} ${s.slice(11, 16)}` : '');
const daysBetween = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 864e5);
/** Số tuần lùi so với hiện tại của báo cáo (để lấy đúng điểm trong chuỗi xu hướng 8 tuần). */
const weekOffset = (r: Report) => Math.max(0, Math.min(6, Math.round(daysBetween(r.createdAt.slice(0, 10), TODAY) / 7)));

/** Nhận định tiến độ do AI viết nháp — chỉ dùng dữ liệu nội bộ (không tên khách, không giá trị HĐ). */
const aiNarrative = (p: PmoProject, r: Report) => {
  const ecvGap = pct(p.ecv, p.contractValue) - pct(p.ecvPlan, p.contractValue);
  const bad = KPI_DEFS.filter((d) => kpiColor(d, p.kpis[d.code]) !== 'green');
  const top = [...p.risks].filter((x) => x.status !== 'Closed').sort((a, b) => riskScore(b) - riskScore(a))[0];
  const lines: string[] = [];
  lines.push(
    `${r.type === 'Weekly Status' ? 'Trong tuần' : r.type === 'Sprint Close' ? 'Trong sprint vừa đóng' : 'Trong release'}, dự án ở trạng thái ${p.health === 'green' ? 'Xanh' : p.health === 'yellow' ? 'Vàng' : 'Đỏ'}` +
      (p.drivers.length ? ` do ${p.drivers.map((d) => d.label).join(', ')}.` : ', 9/9 KPI đạt ngưỡng.'),
  );
  lines.push(
    `Tiến độ giá trị: %ECV ${ecvGap >= 0 ? 'vượt' : 'chậm'} plan ${Math.abs(ecvGap).toFixed(1)} điểm; velocity đạt ${Math.round(p.kpis.velocity)}% plan, carried over ${Math.round(p.kpis.carriedOver)}%.`,
  );
  if (bad.length) lines.push(`KPI lệch ngưỡng: ${bad.map((d) => `${d.label} ${fmtKpi(d, p.kpis[d.code])}`).join('; ')}.`);
  if (p.blocked.length) lines.push(`${p.blocked.length} WP đang blocked, chủ yếu do "${p.blocked[0].reason}".`);
  if (top) lines.push(`Risk lớn nhất: ${top.code} ${top.desc} (P×I = ${riskScore(top)}).`);
  const acts: string[] = [];
  if (p.kpis.wpBlocked >= 2) acts.push('họp gỡ blocked với owner trong 24h');
  if (p.kpis.budgetBurn > 5) acts.push('rà soát chi phí và năng suất các WP đang làm');
  if (p.kpis.crPending > 0) acts.push(`chốt ${p.kpis.crPending} CR đang chờ quyết định`);
  if (ecvGap < -5) acts.push('đẩy nghiệm thu nội bộ các feature đã xong để ghi nhận ECV');
  lines.push(`Đề xuất: ${acts.length ? acts.join('; ') : 'giữ nhịp hiện tại, theo dõi risk lớn nhất'}.`);
  return lines.join('\n');
};

const initState = (r: Report, p: PmoProject): ReportState => {
  const day = r.createdAt.slice(0, 10);
  const edited = r.status !== 'Nháp AI';
  const versions: Version[] = [{ at: r.createdAt, by: 'Hệ thống (AI)', action: `Tạo nháp tự động ${r.type === 'Weekly Status' ? 'thứ Sáu 12:00' : ''}`.trim() }];
  if (edited) versions.push({ at: r.sentAt && r.sentAt < `${day} 14:30` ? `${day} 13:40` : `${day} 14:30`, by: p.pm, action: 'PM sửa nhận định, thêm quyết định cần xin' });
  if (r.sentAt) versions.push({ at: r.sentAt, by: p.pm, action: `Gửi tới ${r.sentTo.length} người nhận${r.status === 'Gửi muộn' ? ' (muộn hạn thứ Sáu 17:00)' : ''}` });
  return {
    ...r,
    narrative: aiNarrative(p, r) + (edited ? '\nPM: đã trao đổi với khách về lịch UAT, thống nhất giữ mốc release.' : ''),
    narrativeEdited: edited,
    decisions: edited ? 'Xin GĐSX bổ sung 1 QA automation 50% trong 4 tuần tới.' : '',
    confirmed: !!r.sentAt,
    versions,
  };
};

const STORE = new Map<string, ReportState>();
const getState = (r: Report, p: PmoProject) => {
  let s = STORE.get(r.id);
  if (!s) {
    s = initState(r, p);
    STORE.set(r.id, s);
  }
  return s;
};

// ==========================================================================
// Thành phần
// ==========================================================================
const Stat: React.FC<{ label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: 'good' | 'bad' | 'warn' | 'neutral' }> = ({ label, value, sub, tone = 'neutral' }) => (
  <div className="px-3 py-2 min-w-0">
    <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500 truncate">{label}</p>
    <p className={`text-[17px] font-bold tabular-nums leading-tight ${tone === 'good' ? 'text-emerald-700' : tone === 'bad' ? 'text-rose-700' : tone === 'warn' ? 'text-amber-700' : 'text-slate-900'}`}>{value}</p>
    {sub && <p className="text-[11px] text-slate-500 truncate">{sub}</p>}
  </div>
);
const HC: Record<string, string> = { green: 'text-emerald-700', yellow: 'text-amber-700', red: 'text-rose-700' };
const HT: Record<string, string> = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  yellow: 'bg-amber-50 text-amber-700 border-amber-200',
  red: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const PmoReportPage: React.FC<{ onNavigate?: (item: string) => void }> = ({ onNavigate }) => {
  const { projects, setFocusId, role, setRole, khoi } = usePmo();
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);
  const [fKhoi, setFKhoi] = useState<string>(role === 'TCT' ? '' : khoi);
  const [fType, setFType] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [fProj, setFProj] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const flash = (s: string) => {
    setMsg(s);
    window.setTimeout(() => setMsg(''), 3500);
  };

  const proj = (id: string) => projects.find((p) => p.id === id)!;
  const all = REPORTS_SEED.map((r) => getState(r, proj(r.projectId)));
  const projOpts = projects.filter((p) => !fKhoi || p.khoi === fKhoi);
  const rows = all
    .filter((r) => {
      const p = proj(r.projectId);
      return (!fKhoi || p.khoi === fKhoi) && (!fType || r.type === fType) && (!fStatus || r.status === fStatus) && (!fProj || r.projectId === fProj);
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.projectId.localeCompare(b.projectId));
  const sent = rows.filter((r) => r.status === 'Đã gửi' || r.status === 'Gửi muộn');
  const onTime = rows.filter((r) => r.status === 'Đã gửi');
  const rate = sent.length ? (onTime.length / sent.length) * 100 : 0;
  const drafts = rows.filter((r) => r.status === 'Nháp AI' || r.status === 'PM đã sửa');
  const aiOnly = rows.filter((r) => r.status === 'Nháp AI');

  const goCockpit = (id: string) => {
    setFocusId(id);
    onNavigate?.('Project Cockpit');
  };

  // ------------------------------------------------------------------------
  // Chế độ soạn
  // ------------------------------------------------------------------------
  if (openId) {
    const r = STORE.get(openId)!;
    const p = proj(r.projectId);
    const d = projectDetail(p);
    const done = r.status === 'Đã gửi' || r.status === 'Gửi muộn';
    const off = weekOffset(r);
    const upd = (patch: Partial<ReportState>) => {
      STORE.set(r.id, { ...STORE.get(r.id)!, ...patch });
      rerender();
    };
    const save = () => {
      upd({
        status: r.narrativeEdited || r.decisions.trim() ? 'PM đã sửa' : r.status,
        versions: [...r.versions, { at: NOW, by: `${p.pm} (${role})`, action: r.narrativeEdited ? 'Lưu nháp — PM đã sửa nhận định' : 'Lưu nháp' }],
      });
      flash(`Đã lưu nháp ${r.id}`);
    };
    const send = () => {
      if (!r.confirmed) return;
      const late = NOW > `${r.createdAt.slice(0, 10)} 17:00`;
      upd({
        status: late ? 'Gửi muộn' : 'Đã gửi',
        sentAt: NOW,
        versions: [...r.versions, { at: NOW, by: `${p.pm} (${role})`, action: `Xác nhận & gửi tới ${r.sentTo.length} người nhận${r.narrativeEdited ? '' : ' (giữ nguyên nội dung AI, PM đã xác nhận)'}` }],
      });
      flash(`Đã gửi ${r.id} qua email cho Ban điều hành — lưu phiên bản và thời điểm gửi`);
    };
    const topRisks = [...p.risks].filter((x) => x.status !== 'Closed').sort((a, b) => riskScore(b) - riskScore(a)).slice(0, 5);
    const crs = d.crs.filter((c) => c.step !== 'Đóng');
    const changed = KPI_DEFS.filter((k) => kpiColor(k, p.trend[k.code][7 - off]) !== kpiColor(k, p.trend[k.code][6 - off]));
    const aiLabel = r.narrativeEdited ? (
      <Tag cls="bg-sky-50 text-sky-700 border-sky-200" icon={Check}>
        PM đã sửa
      </Tag>
    ) : (
      <Tag cls="bg-violet-50 text-violet-700 border-violet-200" icon={Bot}>
        AI draft{r.confirmed ? ' · PM đã xác nhận' : ''}
      </Tag>
    );

    return (
      <ErpPage>
        <ErpTitleBar
          onBack={() => setOpenId(null)}
          title={
            <>
              <span className={erp.code}>{r.id}</span>
              <Tag cls={STATUS_CLS[r.status]}>{r.status}</Tag>
            </>
          }
          actions={
            <>
              {msg && <span className="text-[12px] text-emerald-700 mr-1">{msg}</span>}
              <Btn icon={Save} onClick={save} disabled={done}>
                Lưu nháp
              </Btn>
              <Btn variant="success" icon={Send} onClick={send} disabled={done || !r.confirmed} title={!r.confirmed ? 'Cần tích "Tôi đã đọc và chịu trách nhiệm nội dung"' : ''}>
                Xác nhận & gửi
              </Btn>
              <Btn icon={FileText} onClick={() => flash(`Đã xuất ${r.id}.pdf theo template Bao_Cao_Va_Risk_Register`)}>
                Xuất PDF
              </Btn>
              <Btn icon={FileType} onClick={() => flash(`Đã xuất ${r.id}.docx theo template Bao_Cao_Va_Risk_Register`)}>
                Xuất DOCX
              </Btn>
            </>
          }
          meta={[
            {
              label: 'Dự án',
              value: (
                <button type="button" className="text-[#1f5fa8] hover:underline cursor-pointer" onClick={() => goCockpit(p.id)}>
                  {p.code} · {p.name}
                </button>
              ),
            },
            { label: 'Loại', value: r.type },
            { label: 'Kỳ', value: r.period },
            { label: 'PM', value: p.pm },
            { label: 'Tạo lúc', value: dt(r.createdAt) },
            { label: 'Gửi lúc', value: r.sentAt ? dt(r.sentAt) : 'chưa gửi' },
          ]}
        />

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-3 items-start">
          <div className="space-y-3 min-w-0">
            <Panel
              title="9 KPI & biến động so tuần trước"
              icon={Clock}
              noPad
              actions={
                <span className="flex items-center gap-1.5 text-[12px] text-slate-600">
                  Health <HealthBadge h={p.health} small />
                </span>
              }
              footer={changed.length ? `KPI đổi màu so với tuần trước: ${changed.map((k) => `#${k.no} ${k.label}`).join(', ')}.` : 'Không KPI nào đổi màu so với tuần trước.'}
            >
              <div className="overflow-x-auto">
                <table className={`${erp.table} min-w-[640px]`}>
                  <thead>
                    <tr>
                      <th className={`${erp.th} border-t-0 border-l-0 text-left`}>KPI</th>
                      <th className={`${erp.th} border-t-0 text-right`}>Tuần này</th>
                      <th className={`${erp.th} border-t-0 text-right`}>Tuần trước</th>
                      <th className={`${erp.th} border-t-0 text-right`}>Biến động</th>
                      <th className={`${erp.th} border-t-0 text-left`}>Ngưỡng</th>
                      <th className={`${erp.th} border-t-0 border-r-0 text-center`}>Màu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {KPI_DEFS.map((k) => {
                      const cur = p.trend[k.code][7 - off];
                      const prev = p.trend[k.code][6 - off];
                      const delta = cur - prev;
                      const better = k.higherBetter ? delta > 0 : delta < 0;
                      const c = kpiColor(k, cur);
                      const dTxt = k.unit === 'ratio' ? delta.toFixed(2) : k.unit === 'n' ? String(Math.round(delta)) : delta.toFixed(1);
                      return (
                        <tr key={k.code} className={erp.tr}>
                          <td className={`${erp.td} border-l-0 whitespace-nowrap`}>
                            <span className="text-slate-400">#{k.no}</span> {k.label}
                          </td>
                          <td className={`${erp.td} ${erp.num} font-bold ${HC[c]}`}>{fmtKpi(k, cur)}</td>
                          <td className={`${erp.td} ${erp.num} text-slate-500`}>{fmtKpi(k, prev)}</td>
                          <td className={`${erp.td} ${erp.num} ${Math.abs(delta) < 0.005 ? 'text-slate-400' : better ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {delta > 0 ? '+' : ''}
                            {dTxt}
                          </td>
                          <td className={`${erp.td} text-[11.5px] text-slate-500 whitespace-nowrap`}>{fmtThreshold(k)}</td>
                          <td className={`${erp.td} border-r-0 text-center`}>
                            <Tag cls={HT[c]}>{c === 'green' ? 'Xanh' : c === 'yellow' ? 'Vàng' : 'Đỏ'}</Tag>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Panel>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Panel title="ECV & budget" icon={Wallet} noPad>
                <FieldTable
                  labelWidth="48%"
                  rows={[
                    { label: 'ECV lũy kế', value: `${fmtTy(p.ecv)} (${pct(p.ecv, p.contractValue).toFixed(0)}% HĐ)`, num: true, strong: true },
                    { label: 'ECV plan đến nay', value: `${fmtTy(p.ecvPlan)} (${pct(p.ecvPlan, p.contractValue).toFixed(0)}% HĐ)`, num: true },
                    { label: 'Cost đã dùng / budget', value: `${fmtTy(p.costUsed)} / ${fmtTy(p.budget)}`, num: true },
                    { label: 'Budget Burn Δ', value: <span className={p.kpis.budgetBurn > 10 ? 'text-rose-700 font-bold' : p.kpis.budgetBurn > 5 ? 'text-amber-700 font-bold' : ''}>{fmtKpi(KPI_DEFS[5], p.kpis.budgetBurn)}</span>, num: true },
                    { label: 'Margin thực / định giá', value: `${marginOf(p).toFixed(1)}% / ${p.presaleMargin.toFixed(1)}%`, num: true },
                  ]}
                />
              </Panel>
              <Panel title={`Top risk · ${topRisks.length}`} icon={AlertTriangle} noPad>
                <table className={erp.table}>
                  <tbody>
                    {topRisks.map((x) => (
                      <tr key={x.code} className={erp.tr}>
                        <td className={`${erp.td} border-l-0 border-t-0 ${erp.code} w-14`}>{x.code}</td>
                        <td className={`${erp.td} border-t-0`}>
                          {x.desc}
                          <span className="block text-[11px] text-slate-500">
                            {x.owner} · {x.status}
                          </span>
                        </td>
                        <td className={`${erp.td} border-t-0 border-r-0 ${erp.num} font-bold ${riskScore(x) >= 6 ? 'text-rose-700' : riskScore(x) >= 4 ? 'text-amber-700' : ''}`}>{riskScore(x)}</td>
                      </tr>
                    ))}
                    {!topRisks.length && (
                      <tr>
                        <td className="px-3 py-4 text-center text-slate-400 italic">Không có risk mở.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Panel>
              <Panel title={`CR đang mở · ${crs.length}`} icon={GitPullRequest} noPad>
                <table className={erp.table}>
                  <tbody>
                    {crs.map((c) => (
                      <tr key={c.code} className={erp.tr}>
                        <td className={`${erp.td} border-l-0 border-t-0 ${erp.code} w-16 whitespace-nowrap`}>{c.code}</td>
                        <td className={`${erp.td} border-t-0`}>
                          {c.title}
                          <span className="block text-[11px] text-slate-500">
                            {c.classification} · {c.proposal} · +{c.spDelta} SP · +{fmtTy(c.costDelta)} · +{c.daysDelta} ngày
                          </span>
                        </td>
                        <td className={`${erp.td} border-t-0 border-r-0 text-center whitespace-nowrap text-[11.5px]`}>
                          <Tag cls={c.step === 'Phê duyệt' || c.step === 'Impact' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}>{c.step}</Tag>
                          <span className="block text-slate-400 mt-0.5">{dmy(c.createdAt)}</span>
                        </td>
                      </tr>
                    ))}
                    {!crs.length && (
                      <tr>
                        <td className="px-3 py-4 text-center text-slate-400 italic">Không có CR mở.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Panel>
              <Panel title={`WP blocked · ${p.blocked.length}`} icon={AlertTriangle} noPad>
                <table className={erp.table}>
                  <tbody>
                    {p.blocked.map((b) => (
                      <tr key={b.wp} className={erp.tr}>
                        <td className={`${erp.td} border-l-0 border-t-0 ${erp.code} w-24 whitespace-nowrap`}>{b.wp}</td>
                        <td className={`${erp.td} border-t-0`}>
                          {b.name}
                          <span className="block text-[11px] text-slate-500">
                            {b.reason} · {b.owner}
                          </span>
                        </td>
                        <td className={`${erp.td} border-t-0 border-r-0 ${erp.num} ${b.hours > 16 ? 'text-rose-700 font-bold' : b.hours > 8 ? 'text-amber-700' : ''}`}>{(b.hours / 8).toFixed(1)} ngày</td>
                      </tr>
                    ))}
                    {!p.blocked.length && (
                      <tr>
                        <td className="px-3 py-4 text-center text-slate-400 italic">Không có WP blocked.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Panel>
            </div>

            <Panel title="Nhận định tiến độ" icon={Bot} actions={aiLabel} footer="AI viết nháp từ KPI, WP, risk, CR; PM sửa trực tiếp. Nhãn 'AI draft' giữ nguyên cho đến khi PM sửa nội dung.">
              <textarea
                value={r.narrative}
                disabled={done}
                onChange={(e) => upd({ narrative: e.target.value, narrativeEdited: true, status: 'PM đã sửa' })}
                rows={7}
                className={`${erp.inputFull} h-auto py-1.5 leading-relaxed resize-y ${!r.narrativeEdited ? 'bg-violet-50/40 border-violet-200' : ''}`}
              />
            </Panel>

            <Panel title="Quyết định cần xin" icon={Users} footer="PM tự nhập: quyết định cần Ban điều hành / GĐSX / GĐK chốt, kèm hạn.">
              <textarea
                value={r.decisions}
                disabled={done}
                onChange={(e) => upd({ decisions: e.target.value })}
                rows={3}
                placeholder="Ví dụ: Xin GĐK duyệt CR-112 tính phí trước 14/10 để kịp R3…"
                className={`${erp.inputFull} h-auto py-1.5 leading-relaxed resize-y`}
              />
            </Panel>

            <div className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 border rounded-[4px] ${r.confirmed ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <label className="flex items-center gap-2 text-[12.5px] text-slate-800 cursor-pointer">
                <input type="checkbox" checked={r.confirmed} disabled={done} onChange={(e) => upd({ confirmed: e.target.checked })} className="w-4 h-4 accent-emerald-600" />
                <b>Tôi đã đọc và chịu trách nhiệm nội dung</b>
                <span className="text-slate-500">— bắt buộc trước khi gửi, kể cả khi giữ nguyên bản AI draft.</span>
              </label>
              {done ? (
                <span className="text-[12px] text-emerald-700 font-semibold">Đã gửi lúc {dt(r.sentAt)}</span>
              ) : (
                <Btn variant="success" icon={Send} onClick={send} disabled={!r.confirmed}>
                  Xác nhận & gửi
                </Btn>
              )}
            </div>
          </div>

          <div className="space-y-3 min-w-0">
            <Panel title={`Người nhận · ${r.sentTo.length}`} icon={Users} footer="Danh sách Ban điều hành theo loại dự án; gửi email kèm PDF.">
              <ul className="text-[12.5px] space-y-0.5">
                {r.sentTo.map((x) => (
                  <li key={x} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {x}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Lịch sử phiên bản" icon={History} noPad>
              <ol className="divide-y divide-slate-100">
                {r.versions.map((v, i) => (
                  <li key={i} className="px-3 py-1.5 text-[12px]">
                    <div className="flex items-center justify-between gap-2">
                      <b className="text-slate-800">v{i + 1}</b>
                      <span className="text-slate-500 tabular-nums">{dt(v.at)}</span>
                    </div>
                    <p className="text-slate-700">{v.action}</p>
                    <p className="text-[11px] text-slate-500">{v.by}</p>
                  </li>
                ))}
              </ol>
            </Panel>
            <Panel title="AI governance" icon={ShieldCheck}>
              <p className="text-[12px] text-slate-700 leading-relaxed">
                Dữ liệu đưa vào mô hình chỉ gồm KPI, WP, risk, CR nội bộ. <b>Không gửi giá trị hợp đồng và tên khách hàng</b> ra mô hình ngoài khi chưa có DPA. Phần
                nhận định gắn nhãn <i>AI draft</i> cho tới khi PM sửa; PM chịu trách nhiệm nội dung cuối.
              </p>
            </Panel>
          </div>
        </div>
      </ErpPage>
    );
  }

  // ------------------------------------------------------------------------
  // Chế độ danh sách
  // ------------------------------------------------------------------------
  return (
    <ErpPage>
      <ErpTitleBar crumbs={['PMO', 'Báo cáo dự án']} title="Báo cáo dự án" actions={<RoleSelect value={role} onChange={setRole} />} />

      <div className="bg-white border border-slate-300 rounded-[4px] grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200">
        <Stat label="Report on-time rate" value={`${rate.toFixed(0)}%`} sub={`${onTime.length}/${sent.length} gửi trước thứ Sáu 17:00`} tone={rate >= 90 ? 'good' : rate >= 75 ? 'warn' : 'bad'} />
        <Stat label="Nháp chờ PM" value={drafts.length} sub={`${aiOnly.length} còn nguyên AI draft · hạn 17:00 hôm nay`} tone={aiOnly.length ? 'warn' : 'good'} />
        <Stat label="Đã gửi" value={onTime.length} sub="đúng hạn" />
        <Stat label="Gửi muộn" value={rows.filter((r) => r.status === 'Gửi muộn').length} sub="sau thứ Sáu 17:00" tone={rows.some((r) => r.status === 'Gửi muộn') ? 'bad' : 'neutral'} />
      </div>

      <Panel
        title={
          <>
            Danh sách báo cáo <span className="font-normal normal-case text-slate-500 tracking-normal">· {rows.length} báo cáo</span>
          </>
        }
        icon={FileText}
        noPad
        footer="Weekly Status tự tạo nháp thứ Sáu 12:00, hạn gửi 17:00 · Sprint Close khi sprint đóng · Release Report khi release close. Bấm dòng để mở trình soạn."
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
          <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300">
            <Filter size={13} className="text-[#1f5fa8]" /> Lọc
          </span>
          <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
            Khối
            <select value={fKhoi} onChange={(e) => (setFKhoi(e.target.value), setFProj(''))} className={SEL}>
              <option value="">Tất cả</option>
              {KHOI.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
            Loại
            <select value={fType} onChange={(e) => setFType(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
            Trạng thái
            <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              {STATUSES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
            Dự án
            <select value={fProj} onChange={(e) => setFProj(e.target.value)} className={`${SEL} max-w-[280px]`}>
              <option value="">Tất cả</option>
              {projOpts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} · {p.name}
                </option>
              ))}
            </select>
          </label>
          {(fKhoi || fType || fStatus || fProj) && (
            <button type="button" onClick={() => (setFKhoi(''), setFType(''), setFStatus(''), setFProj(''))} className="text-[12px] text-[#1f5fa8] hover:underline cursor-pointer">
              Bỏ lọc
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1100px]`}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 text-left`}>Mã</th>
                <th className={`${erp.th} border-t-0 text-left`}>Dự án</th>
                <th className={`${erp.th} border-t-0 text-left`}>Loại</th>
                <th className={`${erp.th} border-t-0 text-left`}>Kỳ</th>
                <th className={`${erp.th} border-t-0 text-center`}>Tạo lúc</th>
                <th className={`${erp.th} border-t-0 text-center`}>Trạng thái</th>
                <th className={`${erp.th} border-t-0 text-center`}>Gửi lúc</th>
                <th className={`${erp.th} border-t-0 border-r-0 text-left`}>Người nhận</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const p = proj(r.projectId);
                return (
                  <tr key={r.id} className={`${erp.tr} cursor-pointer`} onClick={() => setOpenId(r.id)}>
                    <td className={`${erp.td} border-l-0 ${erp.code} whitespace-nowrap`}>{r.id}</td>
                    <td className={erp.td}>
                      <button
                        type="button"
                        onClick={(e) => (e.stopPropagation(), goCockpit(p.id))}
                        className="text-left text-[#1f5fa8] hover:underline cursor-pointer leading-tight"
                        title="Mở Project Cockpit"
                      >
                        <span className="font-mono text-[11.5px]">{p.code}</span> <span className="text-slate-700">{p.name}</span>
                      </button>
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>{r.type}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{r.period}</td>
                    <td className={`${erp.td} text-center tabular-nums whitespace-nowrap`}>{dt(r.createdAt)}</td>
                    <td className={`${erp.td} text-center`}>
                      <Tag cls={STATUS_CLS[r.status]} icon={r.status === 'Nháp AI' ? Bot : undefined}>
                        {r.status}
                      </Tag>
                    </td>
                    <td className={`${erp.td} text-center tabular-nums whitespace-nowrap ${r.status === 'Gửi muộn' ? 'text-rose-700 font-semibold' : ''}`}>{r.sentAt ? dt(r.sentAt) : <span className="text-slate-400">—</span>}</td>
                    <td className={`${erp.td} border-r-0 text-[11.5px] text-slate-600`} title={r.sentTo.join(', ')}>
                      <span className="line-clamp-1">{r.sentTo.join(', ')}</span>
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-slate-400 italic">
                    Không có báo cáo nào khớp bộ lọc.
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
