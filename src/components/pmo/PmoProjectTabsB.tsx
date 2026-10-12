/**
 * PmoProjectTabsB — 4 tab của màn PMO-06 Chi tiết dự án (khung PmoProjectPage import và đặt trong FolderTabs).
 *
 *  - QualityTab  (F5.1, F5.2): thẻ Quality Gate theo release (chọn release bằng Segmented) với 4 tiêu chí đạt/không đạt,
 *                xin waiver inline khi Fail, QA Lead tick SIT sign-off; bảng bug có lọc severity/trạng thái/release;
 *                danh sách "Bug thiếu dữ liệu" riêng (không tính KPI).
 *  - FinanceTab  (F3.4, F7.1–F7.4): (a) bảng phân bổ giá trị hợp đồng 3 phương pháp + chênh lệch so với (a), kiểm tra tổng 100%
 *                và ngưỡng nhóm nền theo khối, khoá sau Scope Freeze; (b) feature × trạng thái nghiệm thu × ECV, chuyển trạng thái
 *                inline khi có evidence; (c) sổ ECV; (d) burn vs progress 12 tuần + EAC; (e) margin theo feature & dự án.
 *  - RiskCrTab   (F9.1, F9.2): risk register sửa inline (P×I, mitigation bắt buộc khi score ≥6, quá 14 ngày chưa review tô đỏ,
 *                import TECH-xxx); danh sách CR với stepper 6 bước, đồng hồ cycle time, người duyệt theo ngưỡng; thêm CR inline.
 *  - ResourceTab (F8.1): team dự án, allocation tuần này + 6 tuần tới (màu theo tổng allocation), xin người inline → danh sách yêu cầu.
 *
 * Mỗi tab là các Panel xếp dọc (space-y-3), không có ErpPage/TitleBar. Thay đổi trong phiên lưu ở STORE cấp module (giữ khi đổi tab).
 */
import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Bug as BugIcon,
  Check,
  CheckCircle2,
  Coins,
  Download,
  Filter,
  GitPullRequest,
  LineChart,
  Lock,
  Pencil,
  PieChart,
  Plus,
  Save,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { OWNERS, PmoProject, Risk, TODAY, addDays, between, dmy, fmtTy, fmtVnd, pct, pick, rand } from '../../pmo/pmo';
import {
  Acceptance,
  Bug,
  ChangeRequest,
  EcvEvent,
  Feature,
  KHOI_CONFIG,
  LEVELS,
  Level,
  NEXT_WEEKS,
  PEOPLE,
  ProjectDetail,
  RESOURCE_REQUESTS,
  Release,
  ResourceRequest,
  ALLOCATION,
  THIS_WEEK,
  WpType,
  allocTotal,
  mondayOf,
  projectDetail,
  weekLabel,
  weekNo,
} from '../../pmo/pmoData';
import { Btn, Panel, Segmented, Tag, erp } from '../erp/Erp';

// ==========================================================================
// Dùng chung
// ==========================================================================
/** Trạng thái trong phiên, giữ khi đổi tab/đổi màn (chưa có API). */
const STORE = new Map<string, unknown>();
function useStored<T>(key: string, init: () => T) {
  const [v, setV] = useState<T>(() => (STORE.has(key) ? (STORE.get(key) as T) : init()));
  const set = (u: T | ((c: T) => T)) =>
    setV((cur) => {
      const n = typeof u === 'function' ? (u as (c: T) => T)(cur) : u;
      STORE.set(key, n);
      return n;
    });
  return [v, set] as const;
}

const SEL = `${erp.input} h-7 text-[12px]`;
const TH = (x = '') => `${erp.th} border-t-0 ${x}`;
const TD = erp.td;
const SMALL_BTN = 'h-6! px-2! text-[11px]!';

const FilterCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex items-center gap-1.5 min-w-0">
    <span className="text-[12px] text-slate-600 whitespace-nowrap">{label}</span>
    {children}
  </label>
);
const FilterBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
    <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300">
      <Filter size={13} className="text-[#1f5fa8]" /> Lọc
    </span>
    {children}
  </div>
);
const Empty: React.FC<{ cols: number; text: string }> = ({ cols, text }) => (
  <tr>
    <td colSpan={cols} className="px-3 py-6 text-center text-slate-400 italic">
      {text}
    </td>
  </tr>
);
const Stat: React.FC<{ label: string; value: React.ReactNode; sub?: React.ReactNode; tone?: 'good' | 'bad' | 'warn' | 'neutral' }> = ({ label, value, sub, tone = 'neutral' }) => (
  <div className="px-3 py-1.5 min-w-0">
    <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500 truncate">{label}</p>
    <p className={`text-[16px] font-bold tabular-nums leading-tight ${tone === 'good' ? 'text-emerald-700' : tone === 'bad' ? 'text-rose-700' : tone === 'warn' ? 'text-amber-700' : 'text-slate-900'}`}>{value}</p>
    {sub && <p className="text-[11px] text-slate-500 truncate">{sub}</p>}
  </div>
);
const GOOD = 'bg-emerald-50 text-emerald-700 border-emerald-200';
const WARN = 'bg-amber-50 text-amber-700 border-amber-200';
const BAD = 'bg-rose-50 text-rose-700 border-rose-200';
const INFO = 'bg-sky-50 text-sky-700 border-sky-200';
const MUTED = 'bg-slate-50 text-slate-600 border-slate-200';
const signTy = (v: number) => `${v > 0 ? '+' : v < 0 ? '−' : ''}${fmtTy(Math.abs(v))}`;
const cfgOf = (p: PmoProject) => KHOI_CONFIG.find((c) => c.khoi === p.khoi)!;
const daysBetween = (a: string, b: string) => Math.round((new Date(b).getTime() - new Date(a).getTime()) / 864e5);

type TabProps = { project: PmoProject };

// ==========================================================================
// 1. Chất lượng (F5.1, F5.2)
// ==========================================================================
const SEV_CLS: Record<Bug['severity'], string> = {
  Critical: 'bg-rose-600 text-white border-rose-700',
  High: BAD,
  Medium: WARN,
  Low: MUTED,
};
const BUG_ST_CLS: Record<Bug['status'], string> = {
  Open: BAD,
  'In Progress': INFO,
  Retest: 'bg-violet-50 text-violet-700 border-violet-200',
  Closed: GOOD,
  Rejected: MUTED,
};
const isOpenBug = (b: Bug) => b.status !== 'Closed' && b.status !== 'Rejected';
const bugComplete = (b: Bug) => !!b.phaseFound && !!b.release;

interface Waiver {
  reason: string;
  due: string;
  approver: string;
  status: 'Chờ duyệt' | 'Đã duyệt';
  at: string;
}

/** 4 tiêu chí quality gate của một release. Release đã close lấy số chốt lúc close; còn lại tính từ bug đủ dữ liệu. */
const gateOf = (d: ProjectDetail, r: Release) => {
  const critHigh =
    r.status === 'Đã close'
      ? r.quality.critHighOpen
      : d.bugs.filter((b) => bugComplete(b) && b.release === r.code && isOpenBug(b) && (b.severity === 'Critical' || b.severity === 'High')).length;
  const r0 = d.releases[0].start;
  const endSprint = Math.floor(daysBetween(r0, r.end) / 14) + 1;
  const autoApplies = endSprint >= 3;
  const crit = [
    { label: '0 bug Critical/High mở', target: '= 0', value: `${critHigh}`, ok: critHigh === 0, src: 'F5.1 · bug đủ dữ liệu' },
    { label: 'Regression pass', target: '≥ 95%', value: `${r.quality.regression}%`, ok: r.quality.regression >= 95, src: 'Kết quả CI / QA nhập' },
    {
      label: 'Automation coverage happy path',
      target: '≥ 70% (từ sprint 3)',
      value: `${r.quality.automation}%`,
      ok: !autoApplies || r.quality.automation >= 70,
      src: autoApplies ? 'Kết quả CI' : 'Chưa áp dụng (release trước sprint 3)',
    },
    { label: 'DoD compliance', target: '≥ 90%', value: `${r.quality.dod}%`, ok: r.quality.dod >= 90, src: 'F4.2' },
  ];
  return { crit, pass: crit.every((c) => c.ok), critHigh };
};

const QualityInner: React.FC<TabProps> = ({ project: p }) => {
  const d = projectDetail(p);
  const rels = d.releases.filter((r) => r.code !== 'RBuf');
  const defRel = (rels.find((r) => r.status === 'Đang chạy') || [...rels].reverse().find((r) => r.status === 'Đã close') || rels[0]).code;
  const [relCode, setRelCode] = useState(defRel);
  const [waivers, setWaivers] = useStored<Record<string, Waiver>>(`q-waiver-${p.id}`, () => ({}));
  const [sit, setSit] = useStored<{ by: string; at: string } | null>(`q-sit-${p.id}`, () => null);
  const [wForm, setWForm] = useState<{ reason: string; due: string } | null>(null);
  const [fSev, setFSev] = useState('');
  const [fSt, setFSt] = useState('');
  const [fRel, setFRel] = useState('');

  const r = rels.find((x) => x.code === relCode) || rels[0];
  const g = gateOf(d, r);
  const waiver: Waiver | undefined = waivers[r.code] || (r.quality.waiver ? { reason: r.quality.waiver, due: r.end, approver: 'GĐSX', status: 'Đã duyệt', at: r.end } : undefined);
  const approverChain = p.type === 'BT' ? 'GĐSX' : 'GĐSX → GĐK';
  const planned = r.status === 'Kế hoạch';
  const state: { label: string; cls: string } = planned
    ? { label: 'Chưa đánh giá', cls: MUTED }
    : g.pass
      ? { label: 'Pass', cls: GOOD }
      : waiver?.status === 'Đã duyệt'
        ? { label: 'Pass (waiver)', cls: WARN }
        : waiver
          ? { label: 'Fail · waiver chờ duyệt', cls: WARN }
          : { label: 'Fail', cls: BAD };

  const valid = d.bugs.filter(bugComplete);
  const missing = d.bugs.filter((b) => !bugComplete(b));
  const rows = valid
    .filter((b) => (!fSev || b.severity === fSev) && (!fSt || b.status === fSt) && (!fRel || b.release === fRel))
    .sort((a, b) => (isOpenBug(b) ? 1 : 0) - (isOpenBug(a) ? 1 : 0) || ['Critical', 'High', 'Medium', 'Low'].indexOf(a.severity) - ['Critical', 'High', 'Medium', 'Low'].indexOf(b.severity));
  const openCH = valid.filter((b) => isOpenBug(b) && (b.severity === 'Critical' || b.severity === 'High')).length;

  const submitWaiver = () => {
    if (!wForm || !wForm.reason.trim() || !wForm.due) return;
    setWaivers((cur) => ({ ...cur, [r.code]: { reason: wForm.reason.trim(), due: wForm.due, approver: approverChain, status: 'Chờ duyệt', at: TODAY } }));
    setWForm(null);
  };

  return (
    <div className="space-y-3">
      <Panel
        title={`Quality Gate · ${r.code}`}
        icon={ShieldCheck}
        actions={<Segmented options={rels.map((x) => ({ key: x.code, label: `${x.code}${x.status === 'Đang chạy' ? ' •' : ''}` }))} value={r.code} onChange={setRelCode} />}
        noPad
        footer="Fail → không close release, không nhận ECV 100% cho feature trong release. Waiver: PM đề xuất, GĐSX duyệt (QT/CL thêm GĐK), có hạn xử lý, ghi trên Release Close Report. QA Lead là người duy nhất xác nhận SIT pass."
      >
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px]">
          <div className="overflow-x-auto">
            <table className={`${erp.table} min-w-[560px]`}>
              <thead>
                <tr>
                  <th className={TH('border-l-0 text-left')}>Tiêu chí</th>
                  <th className={TH('w-36')}>Ngưỡng</th>
                  <th className={TH('w-24')}>Hiện tại</th>
                  <th className={TH('w-24')}>Kết quả</th>
                  <th className={TH('border-r-0 text-left')}>Nguồn</th>
                </tr>
              </thead>
              <tbody>
                {g.crit.map((c) => (
                  <tr key={c.label} className={erp.tr}>
                    <td className={`${TD} border-l-0 font-semibold`}>{c.label}</td>
                    <td className={`${TD} text-center text-slate-600`}>{c.target}</td>
                    <td className={`${TD} ${erp.num} font-bold ${planned ? 'text-slate-400' : c.ok ? 'text-emerald-700' : 'text-rose-700'}`}>{planned ? '—' : c.value}</td>
                    <td className={`${TD} text-center`}>
                      {planned ? (
                        <span className="text-slate-400">—</span>
                      ) : c.ok ? (
                        <Tag cls={GOOD} icon={CheckCircle2}>
                          Đạt
                        </Tag>
                      ) : (
                        <Tag cls={BAD} icon={XCircle}>
                          Không đạt
                        </Tag>
                      )}
                    </td>
                    <td className={`${TD} border-r-0 text-[11.5px] text-slate-500`}>{c.src}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-3 py-1.5 text-[11.5px] text-slate-600 border-t border-slate-200">
              {r.code}: {dmy(r.start)} → {dmy(r.end)} · {r.status} · SP {r.spDone}/{r.spPlanned} · mục tiêu: {r.goal}
            </p>
          </div>
          <div className="border-t xl:border-t-0 xl:border-l border-slate-200 p-3 space-y-2 text-[12px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-600">Trạng thái gate</span>
              <Tag cls={state.cls}>{state.label}</Tag>
            </div>
            {waiver && (
              <div className={`border rounded-[3px] px-2 py-1.5 ${waiver.status === 'Đã duyệt' ? 'border-amber-200 bg-amber-50/60' : 'border-slate-200 bg-slate-50'}`}>
                <p className="font-semibold text-slate-800">
                  Waiver · {waiver.status} <span className="font-normal text-slate-500">({waiver.approver})</span>
                </p>
                <p className="text-slate-700">{waiver.reason}</p>
                <p className="text-[11px] text-slate-500">
                  Hạn xử lý {dmy(waiver.due)} · đề xuất {dmy(waiver.at)}
                </p>
              </div>
            )}
            {!planned && !g.pass && !waiver && !wForm && (
              <Btn variant="danger" icon={ShieldAlert} onClick={() => setWForm({ reason: '', due: addDays(TODAY, 10) })}>
                Xin waiver
              </Btn>
            )}
            {wForm && (
              <div className="border border-rose-200 bg-[#fff5f5] rounded-[3px] p-2 space-y-1.5">
                <input
                  autoFocus
                  value={wForm.reason}
                  onChange={(e) => setWForm({ ...wForm, reason: e.target.value })}
                  placeholder="Lý do (vd bug High đã có workaround, khách chấp nhận) *"
                  className={`${SEL} w-full ${!wForm.reason.trim() ? 'border-rose-300' : ''}`}
                />
                <div className="flex items-center gap-2">
                  <FilterCell label="Hạn xử lý">
                    <input type="date" value={wForm.due} onChange={(e) => setWForm({ ...wForm, due: e.target.value })} className={SEL} />
                  </FilterCell>
                  <span className="text-[11px] text-slate-600">
                    Người duyệt: <b>{approverChain}</b>
                  </span>
                </div>
                <div className="flex gap-1">
                  <Btn variant="primary" className={SMALL_BTN} onClick={submitWaiver} disabled={!wForm.reason.trim() || !wForm.due}>
                    Gửi duyệt
                  </Btn>
                  <Btn className={SMALL_BTN} onClick={() => setWForm(null)}>
                    Huỷ
                  </Btn>
                </div>
              </div>
            )}
            <div className="border-t border-slate-200 pt-2">
              <p className="text-slate-600 mb-1">SIT sign-off (bắt buộc trước Go-live gate)</p>
              {sit ? (
                <div className="flex items-center justify-between gap-2">
                  <Tag cls={GOOD} icon={Check}>
                    {sit.by} đã xác nhận {dmy(sit.at)}
                  </Tag>
                  <button type="button" onClick={() => setSit(null)} className="text-[11px] text-slate-500 hover:text-rose-600 cursor-pointer">
                    Bỏ xác nhận
                  </button>
                </div>
              ) : (
                <Btn variant="success" icon={Check} onClick={() => setSit({ by: 'QA Lead', at: TODAY })}>
                  QA Lead xác nhận SIT sign-off
                </Btn>
              )}
              {p.phase < 5 && !sit && <p className="text-[11px] text-slate-400 mt-0.5">Dự án đang ở P{p.phase}; Go-live gate (cuối P5) sẽ chặn nếu chưa tick.</p>}
            </div>
          </div>
        </div>
      </Panel>

      <Panel
        title="Bug"
        icon={BugIcon}
        noPad
        actions={
          <span className="text-[12px] text-slate-600">
            Đủ dữ liệu <b>{valid.length}</b> · C/H mở <b className={openCH ? 'text-rose-700' : ''}>{openCH}</b> · reopen <b>{valid.reduce((s, b) => s + b.reopen, 0)}</b>
          </span>
        }
        footer="Đồng bộ từ Jira (F5.1). Bug Owner chỉ hiển thị và tính vào báo cáo khi Bug Owner confirmed = true. Reopen tự tăng khi Jira chuyển Retest → Open."
      >
        <FilterBar>
          <FilterCell label="Severity">
            <select value={fSev} onChange={(e) => setFSev(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              {(['Critical', 'High', 'Medium', 'Low'] as const).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </FilterCell>
          <FilterCell label="Trạng thái">
            <select value={fSt} onChange={(e) => setFSt(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              {(['Open', 'In Progress', 'Retest', 'Closed', 'Rejected'] as const).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </FilterCell>
          <FilterCell label="Release">
            <select value={fRel} onChange={(e) => setFRel(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              {rels.map((x) => (
                <option key={x.code}>{x.code}</option>
              ))}
            </select>
          </FilterCell>
        </FilterBar>
        <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
          <table className={`${erp.table} min-w-[1050px]`}>
            <thead className="sticky top-0 z-[1]">
              <tr>
                <th className={TH('border-l-0 w-28')}>Key</th>
                <th className={TH('text-left')}>Tiêu đề</th>
                <th className={TH('w-20')}>Severity</th>
                <th className={TH('w-20')}>Phase found</th>
                <th className={TH('w-16')}>Release</th>
                <th className={TH('w-24')}>Linked WP</th>
                <th className={TH('w-24')}>Origin</th>
                <th className={TH('text-left w-36')}>Bug owner</th>
                <th className={TH('w-24')}>Trạng thái</th>
                <th className={TH('border-r-0 w-16')}>Reopen</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <tr key={b.key} className={erp.tr}>
                  <td className={`${TD} border-l-0 ${erp.code}`}>{b.key}</td>
                  <td className={TD}>{b.title}</td>
                  <td className={`${TD} text-center`}>
                    <Tag cls={SEV_CLS[b.severity]}>{b.severity}</Tag>
                  </td>
                  <td className={`${TD} text-center`}>{b.phaseFound}</td>
                  <td className={`${TD} text-center`}>{b.release}</td>
                  <td className={`${TD} ${erp.code} text-center`}>{b.wp}</td>
                  <td className={`${TD} text-center`}>{b.origin}</td>
                  <td className={TD}>{b.ownerConfirmed && b.owner ? b.owner : <span className="text-slate-400 italic">chưa xác nhận</span>}</td>
                  <td className={`${TD} text-center`}>
                    <Tag cls={BUG_ST_CLS[b.status]}>{b.status}</Tag>
                  </td>
                  <td className={`${TD} border-r-0 ${erp.num} ${b.reopen ? 'text-rose-700 font-bold' : 'text-slate-400'}`}>{b.reopen}</td>
                </tr>
              ))}
              {!rows.length && <Empty cols={10} text={d.bugs.length ? 'Không có bug khớp bộ lọc.' : `Dự án đang ở P${p.phase} — chưa có bug (bắt đầu từ P4).`} />}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title={`Bug thiếu dữ liệu (${missing.length})`}
        icon={AlertTriangle}
        noPad
        footer="Bug thiếu Phase found hoặc Release KHÔNG được tính vào KPI (Defect Density #5, Quality Gate) cho đến khi QA bổ sung đủ trên Jira."
      >
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[760px]`}>
            <thead>
              <tr>
                <th className={TH('border-l-0 w-28')}>Key</th>
                <th className={TH('text-left')}>Tiêu đề</th>
                <th className={TH('w-20')}>Severity</th>
                <th className={TH('w-24')}>Linked WP</th>
                <th className={TH('text-left w-48')}>Thiếu trường</th>
                <th className={TH('border-r-0 w-24')}>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {missing.map((b) => (
                <tr key={b.key} className={erp.tr}>
                  <td className={`${TD} border-l-0 ${erp.code}`}>{b.key}</td>
                  <td className={TD}>{b.title}</td>
                  <td className={`${TD} text-center`}>
                    <Tag cls={SEV_CLS[b.severity]}>{b.severity}</Tag>
                  </td>
                  <td className={`${TD} ${erp.code} text-center`}>{b.wp}</td>
                  <td className={`${TD} text-rose-700 font-semibold`}>{[!b.phaseFound && 'Phase found', !b.release && 'Release'].filter(Boolean).join(', ')}</td>
                  <td className={`${TD} border-r-0 text-center tabular-nums`}>{dmy(b.createdAt)}</td>
                </tr>
              ))}
              {!missing.length && <Empty cols={6} text="Không có bug thiếu dữ liệu." />}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};
export const QualityTab: React.FC<TabProps> = ({ project }) => <QualityInner key={project.id} project={project} />;

// ==========================================================================
// 2. Tài chính (F3.4, F7.1–F7.4)
// ==========================================================================
type Method = ProjectDetail['allocMethod'];
const METHODS: { key: Method; label: string }[] = [
  { key: 'Tỉ lệ SP', label: '(a) Tỉ lệ SP' },
  { key: 'Giờ kế hoạch × rate', label: '(b) Giờ kế hoạch × rate' },
  { key: 'Nhập tay', label: '(c) Nhập tay' },
];
const TYPE_FACTOR: Record<WpType, number> = { Architecture: 1.25, NFR: 1.2, Integration: 1.15, API: 1, CRUD: 0.9, Test: 0.85 };
const spOf = (f: Feature) => f.wps.reduce((s, w) => s + w.sp, 0);
const ACC_CLS: Record<Acceptance, string> = { 'Đang làm': MUTED, 'Nghiệm thu nội bộ': INFO, 'Khách nghiệm thu': GOOD, 'Khách reject': BAD };

/** Phân bổ: nhóm nền nhận share% HĐ chia theo trọng số; phần còn lại chia cho feature nghiệp vụ theo trọng số. */
const distribute = (features: Feature[], contract: number, share: number, weight: (f: Feature) => number) => {
  const out: Record<string, number> = {};
  const groups = [features.filter((f) => f.foundation), features.filter((f) => !f.foundation)];
  const totals = [(contract * share) / 100, contract * (1 - share / 100)];
  groups.forEach((g, gi) => {
    const ws = g.reduce((s, f) => s + weight(f), 0) || 1;
    g.forEach((f) => (out[f.code] = (totals[gi] * weight(f)) / ws));
  });
  return out;
};

interface AllocState {
  method: Method;
  share: number;
  manual: Record<string, number>; // triệu VNĐ
  reason: string;
  saved?: { at: string; status: string };
}

/** Biểu đồ đường burn vs progress (12 tuần), có crosshair + tooltip khi rê chuột. */
const BurnChart: React.FC<{ data: { week: string; cost: number; ecv: number; plan: number }[] }> = ({ data }) => {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = 200;
  const L = 34;
  const R = 68;
  const T = 10;
  const B = 22;
  const yMax = Math.min(160, Math.max(40, Math.ceil(Math.max(...data.flatMap((x) => [x.cost, x.ecv, x.plan])) / 20) * 20));
  const x = (i: number) => L + (i / (data.length - 1)) * (W - L - R);
  const y = (v: number) => T + (1 - v / yMax) * (H - T - B);
  const line = (k: 'cost' | 'ecv' | 'plan') => data.map((d, i) => `${x(i)},${y(d[k])}`).join(' ');
  const ticks = Array.from({ length: yMax / 20 + 1 }, (_, i) => i * 20);
  const last = data[data.length - 1];
  const COST = '#c2410c';
  const ECV = '#1f5fa8';
  const h = hover !== null ? data[hover] : null;
  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-3 text-[11.5px] text-slate-600 mb-1">
        <span className="inline-flex items-center gap-1">
          <span className="w-4 h-[2px]" style={{ background: COST }} /> % cost đã dùng / budget
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-4 h-[2px]" style={{ background: ECV }} /> % ECV / giá trị HĐ
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="w-4 border-t border-dashed border-slate-400" /> % ECV plan
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[200px]" onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeWidth="1" />
            <text x={L - 4} y={y(t) + 3} textAnchor="end" fontSize="10" fill="#64748b">
              {t}%
            </text>
          </g>
        ))}
        {data.map((d, i) => (
          <text key={d.week} x={x(i)} y={H - 6} textAnchor="middle" fontSize="10" fill="#64748b">
            {i % 2 === 1 || i === data.length - 1 ? weekLabel(d.week) : ''}
          </text>
        ))}
        <polyline points={line('plan')} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 3" />
        <polyline points={line('cost')} fill="none" stroke={COST} strokeWidth="2" strokeLinejoin="round" />
        <polyline points={line('ecv')} fill="none" stroke={ECV} strokeWidth="2" strokeLinejoin="round" />
        <text x={x(data.length - 1) + 6} y={y(last.cost) + 3} fontSize="10.5" fill="#334155" fontWeight="600">
          Cost {last.cost.toFixed(0)}%
        </text>
        <text x={x(data.length - 1) + 6} y={y(last.ecv) + (Math.abs(last.ecv - last.cost) < 6 ? 14 : 3)} fontSize="10.5" fill="#334155" fontWeight="600">
          ECV {last.ecv.toFixed(0)}%
        </text>
        {hover !== null && h && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={T} y2={H - B} stroke="#94a3b8" strokeWidth="1" />
            <circle cx={x(hover)} cy={y(h.cost)} r="4" fill={COST} stroke="#fff" strokeWidth="2" />
            <circle cx={x(hover)} cy={y(h.ecv)} r="4" fill={ECV} stroke="#fff" strokeWidth="2" />
          </g>
        )}
        {data.map((d, i) => (
          <rect key={d.week} x={x(i) - (W - L - R) / (data.length - 1) / 2} y={T} width={(W - L - R) / (data.length - 1)} height={H - T - B} fill="transparent" onMouseEnter={() => setHover(i)} />
        ))}
      </svg>
      {hover !== null && h && (
        <div
          className="absolute top-6 pointer-events-none bg-white border border-slate-300 rounded-[3px] px-2 py-1 text-[11px] tabular-nums shadow-sm"
          style={{ left: `${Math.min(70, (x(hover) / W) * 100)}%` }}
        >
          <p className="font-bold text-slate-800">
            Tuần {weekNo(h.week)} ({weekLabel(h.week)})
          </p>
          <p>Cost: {h.cost.toFixed(1)}% budget</p>
          <p>ECV: {h.ecv.toFixed(1)}% HĐ · plan {h.plan.toFixed(1)}%</p>
          <p className={h.cost - h.ecv > 10 ? 'text-rose-700 font-semibold' : h.cost - h.ecv > 5 ? 'text-amber-700 font-semibold' : 'text-slate-600'}>
            Δ burn {h.cost - h.ecv > 0 ? '+' : ''}
            {(h.cost - h.ecv).toFixed(1)} điểm
          </p>
        </div>
      )}
    </div>
  );
};

interface Transition {
  to: Acceptance;
  label: string;
  event: EcvEvent['event'];
  ratio: number;
  by: string;
}
const transitionsOf = (a: Acceptance, internalPct: number): Transition[] => {
  const ip = internalPct / 100;
  if (a === 'Đang làm') return [{ to: 'Nghiệm thu nội bộ', label: `Nội bộ pass +${internalPct}%`, event: '+70% nội bộ pass', ratio: ip, by: 'QA Lead' }];
  if (a === 'Nghiệm thu nội bộ')
    return [
      { to: 'Khách nghiệm thu', label: `Khách nghiệm thu +${100 - internalPct}%`, event: '+30% khách nghiệm thu', ratio: 1 - ip, by: 'BA Lead' },
      { to: 'Khách reject', label: `Khách reject −${internalPct}%`, event: '−70% khách reject', ratio: -ip, by: 'BA Lead' },
    ];
  if (a === 'Khách reject') return [{ to: 'Nghiệm thu nội bộ', label: `Nội bộ pass lại +${internalPct}%`, event: '+70% nội bộ pass', ratio: ip, by: 'QA Lead' }];
  return [];
};

const FinanceInner: React.FC<TabProps> = ({ project: p }) => {
  const d = projectDetail(p);
  const cfg = cfgOf(p);
  const contract = p.contractValue;
  const locked = p.phase > 2;
  const feats = d.features;
  const baseFound = feats.filter((f) => f.foundation).reduce((s, f) => s + f.allocValue, 0);
  const baseShare = pct(baseFound, contract);

  // ---- (a) Phân bổ giá trị
  const [alloc, setAlloc] = useStored<AllocState>(`f-alloc-${p.id}`, () => {
    const manual: Record<string, number> = {};
    feats.forEach((f) => (manual[f.code] = Math.round(f.allocValue / 1e6)));
    const diff = Math.round(contract / 1e6) - Object.values(manual).reduce((s, v) => s + v, 0);
    const firstBiz = feats.find((f) => !f.foundation);
    if (firstBiz) manual[firstBiz.code] += diff;
    return { method: d.allocMethod, share: Math.round(baseShare * 10) / 10, manual, reason: d.allocMethod === 'Nhập tay' ? 'Theo biên bản đàm phán giá với khách' : '' };
  });
  const detailVals = useMemo(() => Object.fromEntries(feats.map((f) => [f.code, f.allocValue])) as Record<string, number>, [feats]);
  const shareUnchanged = Math.abs(alloc.share - baseShare) < 0.06;
  const weightB = (f: Feature) => f.wps.reduce((s, w) => s + w.sp * TYPE_FACTOR[w.type], 0) * between(0.92, 1.08, p.id, f.code, 'hb');
  const valsOf = (m: Method, share: number): Record<string, number> => {
    if (m === 'Nhập tay') return Object.fromEntries(feats.map((f) => [f.code, (alloc.manual[f.code] || 0) * 1e6]));
    if (m === d.allocMethod && Math.abs(share - baseShare) < 0.06) return detailVals;
    return distribute(feats, contract, share, m === 'Tỉ lệ SP' ? spOf : weightB);
  };
  const vals = valsOf(alloc.method, alloc.share);
  const sumVal = feats.reduce((s, f) => s + (vals[f.code] || 0), 0);
  const foundVal = feats.filter((f) => f.foundation).reduce((s, f) => s + (vals[f.code] || 0), 0);
  const foundPct = pct(foundVal, contract);
  const aVals = alloc.method === 'Tỉ lệ SP' ? vals : d.allocMethod === 'Tỉ lệ SP' && Math.abs(foundPct - baseShare) < 0.06 ? detailVals : distribute(feats, contract, foundPct, spOf);
  const sumOk = Math.abs(sumVal - contract) < 1000;
  const foundLow = foundPct < cfg.foundationMinPct - 1e-6;
  const foundHigh = foundPct > cfg.foundationMaxPct + 1e-6;
  const reasonOk = alloc.method !== 'Nhập tay' || !!alloc.reason.trim();
  const canSave = !locked && sumOk && !foundLow && !foundHigh && reasonOk;
  const devTotal = feats.reduce((s, f) => s + Math.abs((vals[f.code] || 0) - (aVals[f.code] || 0)), 0) / 2;

  // ---- (b) Nghiệm thu & ECV
  const [acc, setAcc] = useStored<Record<string, Acceptance>>(`f-acc-${p.id}`, () => Object.fromEntries(feats.map((f) => [f.code, f.acceptance])));
  const [ledgerAdd, setLedgerAdd] = useStored<EcvEvent[]>(`f-ledger-${p.id}`, () => []);
  const [evid, setEvid] = useState<Record<string, string>>({});
  const deltaOf = (code: string) => ledgerAdd.filter((e) => e.feature.startsWith(`${code} `)).reduce((s, e) => s + e.delta, 0);
  const ecvOf = (f: Feature) => f.ecv + deltaOf(f.code);
  const ecvTotal = feats.reduce((s, f) => s + ecvOf(f), 0);
  const doTransition = (f: Feature, t: Transition) => {
    const link = (evid[f.code] || '').trim();
    if (!link) return;
    setLedgerAdd((cur) => [{ at: TODAY, feature: `${f.code} ${f.name}`, event: t.event, delta: f.allocValue * t.ratio, by: t.by, evidence: link }, ...cur]);
    setAcc((cur) => ({ ...cur, [f.code]: t.to }));
    setEvid((cur) => ({ ...cur, [f.code]: '' }));
  };
  const ledger = [...ledgerAdd, ...d.ecvLedger];

  // ---- (d) Burn vs progress
  const ecvAdj = ecvTotal - feats.reduce((s, f) => s + f.ecv, 0);
  const series = d.weekly.map((w, i) => ({
    week: w.week,
    cost: pct(w.costCum, p.budget),
    ecv: pct(w.ecvCum + (i === d.weekly.length - 1 ? ecvAdj : 0), contract),
    plan: pct(w.ecvPlanCum, contract),
  }));
  const costPct = pct(p.costUsed, p.budget);
  const ecvPct = pct(ecvTotal, contract);
  const burnDelta = costPct - ecvPct;
  const eac = ecvPct > 0 ? p.costUsed / (ecvPct / 100) : 0;
  const last4 = d.weekly.slice(-4).map((w) => w.cost);
  const mean4 = last4.reduce((s, v) => s + v, 0) / last4.length;
  const cv = Math.sqrt(last4.reduce((s, v) => s + (v - mean4) ** 2, 0) / last4.length) / (mean4 || 1);

  // ---- (e) Margin (cost feature chuẩn hoá để tổng = cost dự án)
  const rawCost = feats.reduce((s, f) => s + f.cost, 0) || 1;
  const costOf = (f: Feature) => (f.cost * p.costUsed) / rawCost;
  const bizWithEcv = feats.filter((f) => !f.foundation && ecvOf(f) > 0);
  const found = feats.filter((f) => f.foundation);
  const noEcv = feats.filter((f) => !f.foundation && ecvOf(f) <= 0);
  const marginRows = [
    ...bizWithEcv.map((f) => ({ key: f.code, name: `${f.code} ${f.name}`, ecv: ecvOf(f), cost: costOf(f), show: true })),
    { key: 'found', name: `Nhóm nền (gộp ${found.length} feature)`, ecv: found.reduce((s, f) => s + ecvOf(f), 0), cost: found.reduce((s, f) => s + costOf(f), 0), show: true },
    ...(noEcv.length ? [{ key: 'wip', name: `Feature chưa có ECV (${noEcv.length}) — chi phí dở dang`, ecv: 0, cost: noEcv.reduce((s, f) => s + costOf(f), 0), show: false }] : []),
  ];
  const mProj = ecvTotal ? ((ecvTotal - p.costUsed) / ecvTotal) * 100 : 0;
  const mCls = (m: number) => (m < p.presaleMargin - 5 ? 'text-rose-700' : m < p.presaleMargin ? 'text-amber-700' : 'text-emerald-700');

  const setManual = (code: string, v: number) => setAlloc((c) => ({ ...c, manual: { ...c.manual, [code]: v }, saved: undefined }));

  return (
    <div className="space-y-3">
      {/* (a) Phân bổ giá trị hợp đồng */}
      <Panel
        title="Phân bổ giá trị hợp đồng (F3.4)"
        icon={PieChart}
        noPad
        actions={
          <>
            {locked ? (
              <Tag cls={MUTED} icon={Lock}>
                Đã khoá cùng Scope Freeze · đổi qua CR
              </Tag>
            ) : alloc.saved ? (
              <Tag cls={WARN}>
                {alloc.saved.status} · {dmy(alloc.saved.at)}
              </Tag>
            ) : null}
            {!locked && (
              <Btn variant="primary" icon={Save} className="h-7" disabled={!canSave} onClick={() => setAlloc((c) => ({ ...c, saved: { at: TODAY, status: 'Chờ GĐK duyệt' } }))}>
                Lưu & trình GĐK
              </Btn>
            )}
          </>
        }
        footer={`Ba phương pháp: (a) tỉ lệ SP · (b) giờ kế hoạch × rate · (c) nhập tay có lý do. Cột chênh lệch so với (a) để người duyệt thấy bất thường. Nhóm nền khối ${p.khoi}: ${cfg.foundationMinPct}–${cfg.foundationMaxPct}% giá trị HĐ; tổng phải = 100% giá trị HĐ. Bảng khoá cùng Scope Freeze.`}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200 text-[12px]">
          <FilterCell label="Phương pháp">
            {locked ? <b className="text-slate-800">{METHODS.find((m) => m.key === alloc.method)?.label}</b> : <Segmented options={METHODS} value={alloc.method} onChange={(m) => setAlloc((c) => ({ ...c, method: m, saved: undefined }))} />}
          </FilterCell>
          {alloc.method !== 'Nhập tay' && (
            <FilterCell label="Nhóm nền (% HĐ)">
              <input
                type="number"
                step={0.5}
                value={alloc.share}
                disabled={locked}
                onChange={(e) => setAlloc((c) => ({ ...c, share: Number(e.target.value), saved: undefined }))}
                className={`${SEL} w-20 text-right`}
              />
            </FilterCell>
          )}
          {alloc.method === 'Nhập tay' && (
            <FilterCell label="Lý do nhập tay">
              <input
                value={alloc.reason}
                disabled={locked}
                onChange={(e) => setAlloc((c) => ({ ...c, reason: e.target.value, saved: undefined }))}
                placeholder="Bắt buộc *"
                className={`${SEL} w-72 ${!reasonOk ? 'border-rose-300' : ''}`}
              />
            </FilterCell>
          )}
          <span className="text-slate-600">
            Baseline: <b>{d.allocMethod}</b>
            {!shareUnchanged && alloc.method !== 'Nhập tay' && <span className="text-amber-700"> · đã đổi % nền</span>}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[920px]`}>
            <thead>
              <tr>
                <th className={TH('border-l-0 w-14')}>Mã</th>
                <th className={TH('text-left')}>Feature</th>
                <th className={TH('w-14')}>Nền</th>
                <th className={TH('w-14')}>SP</th>
                <th className={TH('w-44')}>Giá trị phân bổ (VNĐ)</th>
                <th className={TH('w-16')}>% HĐ</th>
                <th className={TH('w-32')}>Theo (a) tỉ lệ SP</th>
                <th className={TH('border-r-0 w-36')}>Chênh lệch vs (a)</th>
              </tr>
            </thead>
            <tbody>
              {feats.map((f) => {
                const v = vals[f.code] || 0;
                const dv = v - (aVals[f.code] || 0);
                const dpp = pct(dv, contract);
                return (
                  <tr key={f.code} className={f.foundation ? 'bg-slate-50' : erp.tr}>
                    <td className={`${TD} border-l-0 ${erp.code}`}>{f.code}</td>
                    <td className={TD}>{f.name}</td>
                    <td className={`${TD} text-center`}>{f.foundation ? <Tag cls={MUTED}>Nền</Tag> : ''}</td>
                    <td className={`${TD} ${erp.num}`}>{spOf(f)}</td>
                    <td className={`${TD} ${erp.num}`}>
                      {alloc.method === 'Nhập tay' && !locked ? (
                        <span className="inline-flex items-center gap-1">
                          <input type="number" value={alloc.manual[f.code] ?? 0} onChange={(e) => setManual(f.code, Number(e.target.value))} className={`${SEL} w-28 text-right`} />
                          <span className="text-[11px] text-slate-500">tr</span>
                        </span>
                      ) : (
                        fmtVnd(v)
                      )}
                    </td>
                    <td className={`${TD} ${erp.num}`}>{pct(v, contract).toFixed(1)}%</td>
                    <td className={`${TD} ${erp.num} text-slate-600`}>{fmtTy(aVals[f.code] || 0)}</td>
                    <td className={`${TD} border-r-0 ${erp.num} ${Math.abs(dpp) >= 3 ? 'text-rose-700 font-bold' : Math.abs(dpp) >= 1 ? 'text-amber-700' : 'text-slate-500'}`}>
                      {Math.abs(dv) < 1e6 ? '0' : `${signTy(dv)} (${dpp > 0 ? '+' : ''}${dpp.toFixed(1)} đ)`}
                    </td>
                  </tr>
                );
              })}
              <tr className={erp.totalRow}>
                <td className={`${TD} border-l-0`} colSpan={3}>
                  Tổng
                </td>
                <td className={`${TD} ${erp.num}`}>{feats.reduce((s, f) => s + spOf(f), 0)}</td>
                <td className={`${TD} ${erp.num} ${sumOk ? '' : 'text-rose-700'}`}>{fmtVnd(sumVal)}</td>
                <td className={`${TD} ${erp.num} ${sumOk ? '' : 'text-rose-700'}`}>{pct(sumVal, contract).toFixed(1)}%</td>
                <td className={`${TD} ${erp.num}`}>{fmtTy(contract)}</td>
                <td className={`${TD} border-r-0 ${erp.num}`}>lệch {pct(devTotal, contract).toFixed(1)}% HĐ</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 px-3 py-1.5 border-t border-slate-200 text-[12px]">
          <span className={sumOk ? 'text-emerald-700' : 'text-rose-700 font-semibold'}>
            {sumOk ? <Check size={12} className="inline" /> : <X size={12} className="inline" />} Tổng = {pct(sumVal, contract).toFixed(2)}% giá trị HĐ ({fmtVnd(contract)})
            {!sumOk && ` · lệch ${fmtVnd(sumVal - contract)} — không cho lưu`}
          </span>
          <span className={foundLow || foundHigh ? 'text-rose-700 font-semibold' : 'text-emerald-700'}>
            {foundLow || foundHigh ? <X size={12} className="inline" /> : <Check size={12} className="inline" />} Nhóm nền {foundPct.toFixed(1)}% (ngưỡng {p.khoi}: {cfg.foundationMinPct}–{cfg.foundationMaxPct}%)
            {foundLow && ' — dưới ngưỡng, không cho lưu'}
            {foundHigh && ' — vượt trần, không cho lưu'}
          </span>
          {!reasonOk && <span className="text-rose-700 font-semibold">Nhập tay bắt buộc có lý do</span>}
        </div>
      </Panel>

      {/* (b) Feature × nghiệm thu × ECV */}
      <Panel
        title="Nghiệm thu feature & ECV (F7.1)"
        icon={CheckCircle2}
        noPad
        actions={
          <span className="text-[12px] text-slate-600">
            ECV <b className="text-slate-900">{fmtTy(ecvTotal)}</b> ({ecvPct.toFixed(1)}% HĐ) · tỉ lệ nội bộ khối {p.khoi}: <b>{cfg.ecvInternalPct}%</b>
          </span>
        }
        footer="ECV chỉ thay đổi qua chuyển trạng thái có evidence — không có ô nhập tay ECV. Nội bộ pass: QA Lead xác nhận (WP done 100%, DoD); khách nghiệm thu/reject: BA Lead đính kèm biên bản/email. Feature nền: ECV theo % WP done pass DoD, trần 70% đến Go-live gate. Mọi chuyển trạng thái ghi audit."
      >
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1150px]`}>
            <thead>
              <tr>
                <th className={TH('border-l-0 w-14')}>Mã</th>
                <th className={TH('text-left')}>Feature</th>
                <th className={TH('w-14')}>Release</th>
                <th className={TH('w-16')}>WP done</th>
                <th className={TH('w-24')}>Giá trị</th>
                <th className={TH('w-32')}>Trạng thái</th>
                <th className={TH('w-24')}>ECV</th>
                <th className={TH('w-14')}>%</th>
                <th className={TH('w-52 text-left')}>Evidence (link)</th>
                <th className={TH('border-r-0 text-left w-72')}>Chuyển trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {feats.map((f) => {
                const a = acc[f.code] || f.acceptance;
                const done = f.wps.filter((w) => w.status === 'Done').length;
                const allDone = done === f.wps.length;
                const ts = f.foundation ? [] : transitionsOf(a, cfg.ecvInternalPct);
                const e = ecvOf(f);
                const link = (evid[f.code] || '').trim();
                return (
                  <tr key={f.code} className={f.foundation ? 'bg-slate-50' : erp.tr}>
                    <td className={`${TD} border-l-0 ${erp.code}`}>{f.code}</td>
                    <td className={TD}>{f.name}</td>
                    <td className={`${TD} text-center`}>{f.release}</td>
                    <td className={`${TD} ${erp.num} ${allDone ? 'text-emerald-700' : ''}`}>
                      {done}/{f.wps.length}
                    </td>
                    <td className={`${TD} ${erp.num}`}>{fmtTy(f.allocValue)}</td>
                    <td className={`${TD} text-center`}>{f.foundation ? <span className="text-[11px] text-slate-500">Nền · theo % WP</span> : <Tag cls={ACC_CLS[a]}>{a}</Tag>}</td>
                    <td className={`${TD} ${erp.num} font-semibold`}>{fmtTy(e)}</td>
                    <td className={`${TD} ${erp.num}`}>{pct(e, f.allocValue).toFixed(0)}%</td>
                    <td className={TD}>
                      {ts.length ? (
                        <input value={evid[f.code] || ''} onChange={(ev) => setEvid((c) => ({ ...c, [f.code]: ev.target.value }))} placeholder="https://… biên bản / DoD" className={`${SEL} w-full`} />
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                    <td className={`${TD} border-r-0`}>
                      <div className="flex flex-wrap gap-1">
                        {ts.map((t) => {
                          const needDone = t.to === 'Nghiệm thu nội bộ' && !allDone;
                          return (
                            <Btn
                              key={t.label}
                              variant={t.ratio < 0 ? 'danger' : 'default'}
                              className={SMALL_BTN}
                              disabled={!link || needDone}
                              title={needDone ? `Còn ${f.wps.length - done} WP chưa Done` : !link ? 'Nhập link evidence trước' : ''}
                              onClick={() => doTransition(f, t)}
                            >
                              {t.label}
                            </Btn>
                          );
                        })}
                        {!f.foundation && !ts.length && <span className="text-[11px] text-emerald-700">Hoàn tất 100%</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* (d) Burn vs progress · (e) Margin */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <Panel title="Budget burn vs progress (F7.2)" icon={LineChart} footer="Budget Burn Δ = % cost đã dùng − % ECV (vàng >5, đỏ >10 điểm). EAC = cost đã dùng / %ECV; khoảng dao động theo biến động cost 4 tuần gần nhất. Budget: chi phí kế hoạch từ presales.">
          <div className="grid grid-cols-2 md:grid-cols-4 -mx-3 -mt-2 mb-1 border-b border-slate-100">
            <Stat label="Cost / budget" value={`${costPct.toFixed(0)}%`} sub={`${fmtTy(p.costUsed)} / ${fmtTy(p.budget)}`} />
            <Stat label="ECV / HĐ" value={`${ecvPct.toFixed(0)}%`} sub={`${fmtTy(ecvTotal)} / ${fmtTy(contract)}`} />
            <Stat label="Budget Burn Δ" value={`${burnDelta > 0 ? '+' : ''}${burnDelta.toFixed(1)}`} sub="điểm %" tone={burnDelta > 10 ? 'bad' : burnDelta > 5 ? 'warn' : 'good'} />
            <Stat
              label="EAC"
              value={eac ? fmtTy(eac) : '—'}
              sub={eac ? `±${(cv * 100).toFixed(0)}% · ${eac > p.budget ? 'vượt' : 'dưới'} budget ${fmtTy(Math.abs(eac - p.budget))}` : 'chưa có ECV'}
              tone={eac > p.budget * 1.05 ? 'bad' : eac > p.budget ? 'warn' : 'neutral'}
            />
          </div>
          <BurnChart data={series} />
        </Panel>

        <Panel title="Margin theo feature & dự án (F7.4)" icon={Coins} noPad footer="Margin = (ECV − cost) / ECV. Chỉ hiện margin feature đã có ECV > 0; feature nền gộp một dòng. Chi phí = timesheet × rate + overhead (F7.3) — PM không thấy rate, chỉ thấy tổng chi phí.">
          <div className="overflow-x-auto">
            <table className={`${erp.table} min-w-[520px]`}>
              <thead>
                <tr>
                  <th className={TH('border-l-0 text-left')}>Feature</th>
                  <th className={TH('w-24')}>ECV</th>
                  <th className={TH('w-24')}>Chi phí</th>
                  <th className={TH('border-r-0 w-20')}>Margin</th>
                </tr>
              </thead>
              <tbody>
                {marginRows.map((m) => {
                  const mg = m.ecv > 0 ? ((m.ecv - m.cost) / m.ecv) * 100 : 0;
                  return (
                    <tr key={m.key} className={m.key === 'found' ? 'bg-slate-50' : erp.tr}>
                      <td className={`${TD} border-l-0 ${m.show ? '' : 'text-slate-500 italic'}`}>{m.name}</td>
                      <td className={`${TD} ${erp.num}`}>{m.ecv > 0 ? fmtTy(m.ecv) : '—'}</td>
                      <td className={`${TD} ${erp.num}`}>{fmtTy(m.cost)}</td>
                      <td className={`${TD} border-r-0 ${erp.num} font-semibold ${m.show && m.ecv > 0 ? mCls(mg) : 'text-slate-400'}`}>{m.show && m.ecv > 0 ? `${mg.toFixed(1)}%` : '—'}</td>
                    </tr>
                  );
                })}
                <tr className={erp.totalRow}>
                  <td className={`${TD} border-l-0`}>Dự án</td>
                  <td className={`${TD} ${erp.num}`}>{fmtTy(ecvTotal)}</td>
                  <td className={`${TD} ${erp.num}`}>{fmtTy(p.costUsed)}</td>
                  <td className={`${TD} border-r-0 ${erp.num} ${mCls(mProj)}`}>{mProj.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 px-3 py-1.5 border-t border-slate-200 text-[12px]">
            <span>
              Margin dự án <b className={mCls(mProj)}>{mProj.toFixed(1)}%</b> vs định giá presales <b>{p.presaleMargin.toFixed(1)}%</b>
            </span>
            <span className={mProj >= p.presaleMargin ? 'text-emerald-700' : 'text-rose-700'}>
              {mProj >= p.presaleMargin ? 'đạt' : 'thấp hơn'} {Math.abs(mProj - p.presaleMargin).toFixed(1)} điểm
            </span>
          </div>
        </Panel>
      </div>

      {/* (c) Sổ ECV */}
      <Panel title={`Sổ ECV (${ledger.length} biến động)`} icon={BookOpen} noPad footer="Ledger ghi từng biến động: +70% nội bộ pass · +30% khách nghiệm thu · −70% khách reject sau nội bộ · WP nền theo tỉ lệ. Finance đối chiếu doanh thu kế toán theo sổ này.">
        <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
          <table className={`${erp.table} min-w-[860px]`}>
            <thead className="sticky top-0 z-[1]">
              <tr>
                <th className={TH('border-l-0 w-24')}>Ngày</th>
                <th className={TH('text-left')}>Feature</th>
                <th className={TH('w-44')}>Sự kiện</th>
                <th className={TH('w-28')}>Δ ECV</th>
                <th className={TH('w-24')}>Xác nhận</th>
                <th className={TH('border-r-0 text-left w-56')}>Evidence</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((e, i) => (
                <tr key={i} className={i < ledgerAdd.length ? 'bg-[#f5f9ff]' : erp.tr}>
                  <td className={`${TD} border-l-0 text-center tabular-nums`}>{dmy(e.at)}</td>
                  <td className={TD}>{e.feature}</td>
                  <td className={`${TD} text-center`}>
                    <Tag cls={e.delta < 0 ? BAD : e.event.startsWith('+30') ? GOOD : e.event.startsWith('WP') ? MUTED : INFO}>{e.event}</Tag>
                  </td>
                  <td className={`${TD} ${erp.num} font-semibold ${e.delta < 0 ? 'text-rose-700' : 'text-emerald-700'}`}>{signTy(e.delta)}</td>
                  <td className={`${TD} text-center`}>{e.by}</td>
                  <td className={`${TD} border-r-0 text-[11.5px] text-[#1f5fa8] truncate max-w-[240px]`} title={e.evidence}>
                    {e.evidence}
                  </td>
                </tr>
              ))}
              {!ledger.length && <Empty cols={6} text="Chưa có biến động ECV." />}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};
export const FinanceTab: React.FC<TabProps> = ({ project }) => <FinanceInner key={project.id} project={project} />;

// ==========================================================================
// 3. Rủi ro & CR (F9.1, F9.2)
// ==========================================================================
interface RiskRow extends Risk {
  category: string;
  mitigation: string;
}
const categoryOf = (desc: string) => {
  const s = desc.toLowerCase();
  if (/nhân sự|senior|nghỉ|thiếu người/.test(s)) return 'Nhân sự';
  if (/bảo mật|security/.test(s)) return 'Bảo mật';
  if (/srs|phạm vi|scope|yêu cầu/.test(s)) return 'Phạm vi';
  if (/api|hạ tầng|môi trường|hiệu năng|thư viện|kiến trúc|tích hợp/.test(s)) return 'Kỹ thuật';
  if (/khách|đối tác/.test(s)) return 'Khách hàng';
  return 'Khác';
};
const MITS = ['Họp tuần với khách, chốt mốc gửi dữ liệu', 'Gửi RQ xin người, đào tạo chéo trong team', 'Dựng mock API, test theo contract', 'Chốt SRS trong giao ban, ghi biên bản', 'Chuẩn bị môi trường SIT dự phòng', 'Đánh giá bảo mật sớm cùng khách', 'Bàn giao kiến thức, có người backup'];
const RISK_ST_CLS: Record<Risk['status'], string> = { Open: BAD, Mitigating: WARN, Closed: MUTED, Occurred: 'bg-rose-600 text-white border-rose-700' };
const TECH_RISKS = (p: PmoProject): RiskRow[] => [
  { code: 'TECH-001', desc: 'Hiệu năng API tra cứu chưa đạt 2s ở 1.000 CCU (HLD)', category: 'Kỹ thuật', p: 2, i: 3, mitigation: 'Cache tầng đọc + load test sprint kế tiếp', owner: OWNERS[2], status: 'Open', lastReview: TODAY },
  { code: 'TECH-002', desc: 'Thư viện ký số sắp hết hạn hỗ trợ của nhà cung cấp', category: 'Kỹ thuật', p: 2, i: 2, mitigation: '', owner: p.pm, status: 'Open', lastReview: TODAY },
];
const CR_STEPS: ChangeRequest['step'][] = ['Nhận', 'Phân loại', 'Impact', 'Phê duyệt', 'Thực hiện', 'Đóng'];
interface CrRow extends ChangeRequest {
  cycleH?: number; // giờ từ tạo đến quyết định (đã chốt)
}
const CrStepper: React.FC<{ step: ChangeRequest['step'] }> = ({ step }) => {
  const idx = CR_STEPS.indexOf(step);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {CR_STEPS.map((s, i) => (
          <span
            key={s}
            title={`${i + 1}. ${s}`}
            className={`w-4 h-4 rounded-[2px] text-[9px] font-bold flex items-center justify-center ${i < idx ? 'bg-emerald-600 text-white' : i === idx ? 'bg-[#1f5fa8] text-white ring-2 ring-[#1f5fa8]/30' : 'bg-slate-200 text-slate-500'}`}
          >
            {i + 1}
          </span>
        ))}
      </div>
      <span className="text-[11.5px] text-slate-700 whitespace-nowrap">{step}</span>
    </div>
  );
};
const blankRisk = (code: string, owner: string): RiskRow => ({ code, desc: '', category: 'Khác', p: 2, i: 2, mitigation: '', owner, status: 'Open', lastReview: TODAY });
const crCost = (sp: number) => sp * 8 * 260_000 * 1.2;

const RiskCrInner: React.FC<TabProps> = ({ project: p }) => {
  const d = projectDetail(p);
  const cfg = cfgOf(p);
  const owners = useMemo(() => [...new Set([p.pm, ...OWNERS])], [p.pm]);

  // ---- Risk register
  const [risks, setRisks] = useStored<RiskRow[]>(`r-risk-${p.id}`, () =>
    p.risks.map((r, i) => ({ ...r, category: categoryOf(r.desc), mitigation: rand(p.id, 'mit', i) < 0.6 ? pick(MITS, p.id, 'mt', i) : '' })),
  );
  const [editCode, setEditCode] = useState<string | null>(null);
  const [draft, setDraft] = useState<RiskRow | null>(null);
  const [adding, setAdding] = useState(false);
  const imported = risks.some((r) => r.code.startsWith('TECH-'));
  const openScore = risks.filter((r) => r.status === 'Open').reduce((s, r) => s + r.p * r.i, 0);
  const stale = (r: RiskRow) => r.status !== 'Closed' && daysBetween(r.lastReview, TODAY) > 14;
  const draftBad = !!draft && (!draft.desc.trim() || (draft.p * draft.i >= 6 && !draft.mitigation.trim()));
  const nextRiskCode = () => `R-${String(risks.filter((r) => r.code.startsWith('R-')).reduce((m, r) => Math.max(m, Number(r.code.slice(2)) || 0), 0) + 1).padStart(2, '0')}`;
  const startEdit = (r: RiskRow) => (setEditCode(r.code), setDraft({ ...r }), setAdding(false));
  const startAdd = () => (setAdding(true), setEditCode(null), setDraft(blankRisk(nextRiskCode(), p.pm)));
  const cancel = () => (setEditCode(null), setAdding(false), setDraft(null));
  const saveDraft = () => {
    if (!draft || draftBad) return;
    const row = { ...draft, desc: draft.desc.trim(), mitigation: draft.mitigation.trim(), lastReview: TODAY };
    setRisks((cur) => (adding ? [row, ...cur] : cur.map((r) => (r.code === row.code ? row : r))));
    cancel();
  };
  const upd = (patch: Partial<RiskRow>) => setDraft((c) => (c ? { ...c, ...patch, ...(patch.desc !== undefined ? { category: categoryOf(patch.desc) } : {}) } : c));

  const riskEditRow = (dr: RiskRow) => {
    const sc = dr.p * dr.i;
    return (
      <tr key={`edit-${dr.code}`} className="bg-[#f5f9ff]">
        <td className={`${TD} border-l-0 ${erp.code}`}>{dr.code}</td>
        <td className={TD}>
          <input autoFocus value={dr.desc} onChange={(e) => upd({ desc: e.target.value })} placeholder="Mô tả rủi ro *" className={`${SEL} w-full ${!dr.desc.trim() ? 'border-rose-300' : ''}`} />
        </td>
        <td className={`${TD} text-center text-[11.5px]`}>
          {dr.category}
          <span className="block text-[10px] text-slate-400">tự gán</span>
        </td>
        {(['p', 'i'] as const).map((k) => (
          <td key={k} className={`${TD} text-center`}>
            <select value={dr[k]} onChange={(e) => upd({ [k]: Number(e.target.value) as 1 | 2 | 3 })} className={`${SEL} w-12`}>
              {[1, 2, 3].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </td>
        ))}
        <td className={`${TD} ${erp.num} font-bold ${sc >= 6 ? 'text-rose-700' : ''}`}>{sc}</td>
        <td className={TD}>
          <input
            value={dr.mitigation}
            onChange={(e) => upd({ mitigation: e.target.value })}
            placeholder={sc >= 6 ? 'Bắt buộc khi score ≥6 *' : 'Mitigation'}
            className={`${SEL} w-full ${sc >= 6 && !dr.mitigation.trim() ? 'border-rose-400 bg-rose-50' : ''}`}
          />
        </td>
        <td className={TD}>
          <select value={dr.owner} onChange={(e) => upd({ owner: e.target.value })} className={`${SEL} w-full`}>
            {owners.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </td>
        <td className={TD}>
          <select value={dr.status} onChange={(e) => upd({ status: e.target.value as Risk['status'] })} className={`${SEL} w-full`}>
            {(['Open', 'Mitigating', 'Closed', 'Occurred'] as const).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </td>
        <td className={`${TD} text-center text-[11px] text-slate-500`}>lưu = hôm nay</td>
        <td className={`${TD} border-r-0`}>
          <div className="flex gap-1 justify-center">
            <Btn variant="primary" className={SMALL_BTN} disabled={draftBad} onClick={saveDraft}>
              Lưu
            </Btn>
            <Btn className={SMALL_BTN} onClick={cancel}>
              Huỷ
            </Btn>
          </div>
        </td>
      </tr>
    );
  };

  // ---- CR
  const totalSp = d.wps.reduce((s, w) => s + w.sp, 0) || 1;
  const [crs, setCrs] = useStored<CrRow[]>(`r-cr-${p.id}`, () =>
    d.crs.map((c) => ({ ...c, cycleH: c.decidedAt ? Math.round(between(6, 60, p.id, c.code, 'cy')) : undefined })),
  );
  const [crForm, setCrForm] = useState<{ title: string; source: ChangeRequest['source']; classification: ChangeRequest['classification']; wps: string[]; sp: number; days: number; proposal: ChangeRequest['proposal'] } | null>(null);
  const approverOf = (c: { proposal: ChangeRequest['proposal']; spDelta: number }) =>
    c.proposal === 'Tính phí' ? 'GĐK + Finance' : c.proposal === 'Hấp thụ' ? (pct(c.spDelta, totalSp) <= cfg.crAbsorbSpPct ? 'PM' : 'GĐSX') : 'PM';
  const cycleOf = (c: CrRow) => (c.cycleH !== undefined ? c.cycleH : Math.max(0, daysBetween(c.createdAt, TODAY)) * 24);
  const pendingCr = crs.filter((c) => c.cycleH === undefined);
  const advance = (c: CrRow) =>
    setCrs((cur) =>
      cur.map((x) => {
        if (x.code !== c.code) return x;
        const next = CR_STEPS[Math.min(CR_STEPS.length - 1, CR_STEPS.indexOf(x.step) + 1)];
        const deciding = x.step === 'Phê duyệt';
        return { ...x, step: next, ...(deciding ? { decidedAt: TODAY, cycleH: Math.max(4, daysBetween(x.createdAt, TODAY) * 24) } : {}) };
      }),
    );
  const suggestions = useMemo(() => {
    if (!crForm) return [];
    const toks = crForm.title
      .toLowerCase()
      .split(/[\s,.;]+/)
      .filter((t) => t.length >= 3);
    const hit = toks.length ? d.wps.filter((w) => toks.some((t) => w.name.toLowerCase().includes(t))) : [];
    const pool = hit.length ? hit : d.wps.filter((w) => w.status !== 'Done' && w.status !== 'To Do');
    return pool.filter((w) => !crForm.wps.includes(w.code)).slice(0, 5);
  }, [crForm, d.wps]);
  const nextCrCode = () => `CR-${String(crs.reduce((m, c) => Math.max(m, Number(c.code.slice(3)) || 0), 0) + 1).padStart(3, '0')}`;
  const crFormOk = !!crForm && !!crForm.title.trim() && crForm.wps.length > 0 && crForm.sp > 0;
  const addCr = () => {
    if (!crForm || !crFormOk) return;
    setCrs((cur) => [
      {
        code: nextCrCode(),
        title: crForm.title.trim(),
        source: crForm.source,
        classification: crForm.classification,
        wps: crForm.wps,
        spDelta: crForm.sp,
        costDelta: crCost(crForm.sp),
        daysDelta: crForm.days,
        proposal: crForm.proposal,
        step: 'Nhận',
        createdAt: TODAY,
      },
      ...cur,
    ]);
    setCrForm(null);
  };

  return (
    <div className="space-y-3">
      <Panel
        title="Risk register (F9.1)"
        icon={ShieldAlert}
        noPad
        actions={
          <>
            <span className="text-[12px] text-slate-600 mr-1">
              Risk Score (Σ P×I Open) <b className={openScore >= 12 ? 'text-rose-700' : openScore >= 8 ? 'text-amber-700' : 'text-emerald-700'}>{openScore}</b> · chưa review &gt;14 ngày{' '}
              <b className={risks.some(stale) ? 'text-rose-700' : ''}>{risks.filter(stale).length}</b>
            </span>
            <Btn icon={Download} className="h-7" disabled={imported} onClick={() => setRisks((cur) => [...cur, ...TECH_RISKS(p)])} title={imported ? 'Đã import' : ''}>
              Import TECH-xxx từ HLD Discovery
            </Btn>
            <Btn variant="primary" icon={Plus} className="h-7" onClick={startAdd} disabled={adding}>
              Thêm risk
            </Btn>
          </>
        }
        footer="Nhắc review mỗi thứ Năm; risk chưa review >14 ngày tô đỏ. Score = P×I (1–3); score ≥6 bắt buộc có mitigation. Category tự gán theo mô tả. Risk Score dự án (KPI #9) = Σ score risk Open."
      >
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1200px]`}>
            <thead>
              <tr>
                <th className={TH('border-l-0 w-20')}>Mã</th>
                <th className={TH('text-left')}>Mô tả</th>
                <th className={TH('w-24')}>Category</th>
                <th className={TH('w-12')}>P</th>
                <th className={TH('w-12')}>I</th>
                <th className={TH('w-14')}>Score</th>
                <th className={TH('text-left w-64')}>Mitigation</th>
                <th className={TH('text-left w-36')}>Owner</th>
                <th className={TH('w-28')}>Trạng thái</th>
                <th className={TH('w-24')}>Review cuối</th>
                <th className={TH('border-r-0 w-36')}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {adding && draft && riskEditRow(draft)}
              {[...risks]
                .sort((a, b) => (a.status === 'Closed' ? 1 : 0) - (b.status === 'Closed' ? 1 : 0) || b.p * b.i - a.p * a.i)
                .map((r) => {
                  if (editCode === r.code && draft) return riskEditRow(draft);
                  const sc = r.p * r.i;
                  const old = stale(r);
                  const age = daysBetween(r.lastReview, TODAY);
                  return (
                    <tr key={r.code} className={old ? 'bg-rose-50/70 hover:bg-rose-50' : erp.tr}>
                      <td className={`${TD} border-l-0 ${erp.code}`}>{r.code}</td>
                      <td className={TD}>{r.desc}</td>
                      <td className={`${TD} text-center text-[11.5px]`}>{r.category}</td>
                      <td className={`${TD} ${erp.num}`}>{r.p}</td>
                      <td className={`${TD} ${erp.num}`}>{r.i}</td>
                      <td className={`${TD} ${erp.num} font-bold ${sc >= 6 ? 'text-rose-700' : sc >= 3 ? 'text-amber-700' : 'text-slate-600'}`}>{sc}</td>
                      <td className={`${TD} ${sc >= 6 && !r.mitigation ? 'bg-rose-100 text-rose-700 font-semibold' : ''}`}>{r.mitigation || (sc >= 6 ? 'Thiếu — bắt buộc (score ≥6)' : <span className="text-slate-400">—</span>)}</td>
                      <td className={TD}>{r.owner}</td>
                      <td className={`${TD} text-center`}>
                        <Tag cls={RISK_ST_CLS[r.status]}>{r.status}</Tag>
                      </td>
                      <td className={`${TD} text-center tabular-nums ${old ? 'text-rose-700 font-bold' : ''}`}>
                        {dmy(r.lastReview)}
                        {old && <span className="block text-[10.5px] font-semibold">{age} ngày</span>}
                      </td>
                      <td className={`${TD} border-r-0`}>
                        <div className="flex gap-1 justify-center">
                          <Btn className={SMALL_BTN} icon={Pencil} onClick={() => startEdit(r)}>
                            Sửa
                          </Btn>
                          <Btn className={SMALL_BTN} onClick={() => setRisks((cur) => cur.map((x) => (x.code === r.code ? { ...x, lastReview: TODAY } : x)))} disabled={r.lastReview === TODAY}>
                            Đã review
                          </Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title="Change Request (F9.2)"
        icon={GitPullRequest}
        noPad
        actions={
          <>
            <span className="text-[12px] text-slate-600 mr-1">
              Chưa quyết định <b>{pendingCr.length}</b> · &gt;48h <b className={pendingCr.some((c) => cycleOf(c) > 48) ? 'text-rose-700' : ''}>{pendingCr.filter((c) => cycleOf(c) > 48).length}</b>
            </span>
            <Btn
              variant="primary"
              icon={Plus}
              className="h-7"
              disabled={!!crForm}
              onClick={() => setCrForm({ title: '', source: 'Khách', classification: 'Out-of-scope', wps: [], sp: 5, days: 2, proposal: 'Tính phí' })}
            >
              Thêm CR
            </Btn>
          </>
        }
        footer={`6 bước: Nhận → Phân loại → Impact → Phê duyệt → Thực hiện → Đóng. Người duyệt: hấp thụ ≤${cfg.crAbsorbSpPct}% SP dự án (${totalSp} SP) → PM; hấp thụ trên ngưỡng → GĐSX; có tính phí / đổi giá trị HĐ → GĐK + Finance. Cycle time từ lúc tạo đến quyết định; >48h → cảnh báo AL-05. CR duyệt → mở khoá WBS/plan/phân bổ đúng phạm vi, ghi baseline mới.`}
      >
        {crForm && (
          <div className="border-b border-slate-200 bg-[#f5f9ff] px-3 py-2 space-y-1.5 text-[12px]">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <input
                autoFocus
                value={crForm.title}
                onChange={(e) => setCrForm({ ...crForm, title: e.target.value })}
                placeholder="Tiêu đề / mô tả CR *"
                className={`${SEL} w-80 ${!crForm.title.trim() ? 'border-rose-300' : ''}`}
              />
              <FilterCell label="Nguồn">
                <select value={crForm.source} onChange={(e) => setCrForm({ ...crForm, source: e.target.value as ChangeRequest['source'] })} className={SEL}>
                  <option>Khách</option>
                  <option>Nội bộ</option>
                </select>
              </FilterCell>
              <FilterCell label="Phân loại">
                <select value={crForm.classification} onChange={(e) => setCrForm({ ...crForm, classification: e.target.value as ChangeRequest['classification'] })} className={SEL}>
                  <option>In-scope</option>
                  <option>Out-of-scope</option>
                </select>
              </FilterCell>
              <FilterCell label="ΔSP">
                <input type="number" min={1} value={crForm.sp} onChange={(e) => setCrForm({ ...crForm, sp: Number(e.target.value), days: Math.ceil(Number(e.target.value) / 4) })} className={`${SEL} w-16 text-right`} />
              </FilterCell>
              <FilterCell label="Δngày">
                <input type="number" min={0} value={crForm.days} onChange={(e) => setCrForm({ ...crForm, days: Number(e.target.value) })} className={`${SEL} w-14 text-right`} />
              </FilterCell>
              <FilterCell label="Đề xuất">
                <select value={crForm.proposal} onChange={(e) => setCrForm({ ...crForm, proposal: e.target.value as ChangeRequest['proposal'] })} className={SEL}>
                  <option>Tính phí</option>
                  <option>Hấp thụ</option>
                  <option>Từ chối</option>
                </select>
              </FilterCell>
              <span className="text-slate-600">
                Δcost ước tính <b>{fmtTy(crCost(crForm.sp))}</b> · người duyệt <b className="text-[#1e3a5f]">{approverOf({ proposal: crForm.proposal, spDelta: crForm.sp })}</b>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-600">WP ảnh hưởng *</span>
              {crForm.wps.map((w) => (
                <span key={w} className="inline-flex items-center gap-1 px-1.5 py-px rounded-[3px] border border-[#1f5fa8]/40 bg-white text-[11.5px] font-mono text-[#1f5fa8]">
                  {w}
                  <button type="button" onClick={() => setCrForm({ ...crForm, wps: crForm.wps.filter((x) => x !== w) })} className="text-slate-400 hover:text-rose-600 cursor-pointer">
                    <X size={11} />
                  </button>
                </span>
              ))}
              {suggestions.length > 0 && <span className="text-[11px] text-slate-500 ml-1">Gợi ý:</span>}
              {suggestions.map((w) => (
                <button
                  key={w.code}
                  type="button"
                  onClick={() => setCrForm({ ...crForm, wps: [...crForm.wps, w.code] })}
                  className="px-1.5 py-px rounded-[3px] border border-dashed border-slate-300 bg-white text-[11px] text-slate-600 hover:border-[#1f5fa8] hover:text-[#1f5fa8] cursor-pointer"
                  title={`${w.name} · ${w.release} · ${w.status}`}
                >
                  + {w.code} <span className="text-slate-400">{w.name}</span>
                </button>
              ))}
              <select value="" onChange={(e) => e.target.value && setCrForm({ ...crForm, wps: [...crForm.wps, e.target.value] })} className={`${SEL} w-48`}>
                <option value="">Chọn WP khác…</option>
                {d.wps
                  .filter((w) => !crForm.wps.includes(w.code))
                  .map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code} · {w.name}
                    </option>
                  ))}
              </select>
              <span className="ml-auto flex gap-1">
                <Btn variant="primary" className={SMALL_BTN} disabled={!crFormOk} onClick={addCr}>
                  Tạo CR
                </Btn>
                <Btn className={SMALL_BTN} onClick={() => setCrForm(null)}>
                  Huỷ
                </Btn>
              </span>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1180px]`}>
            <thead>
              <tr>
                <th className={TH('border-l-0 w-[72px]')}>Mã</th>
                <th className={TH('text-left min-w-[170px]')}>Tiêu đề</th>
                <th className={TH('w-16')}>Nguồn</th>
                <th className={TH('w-24')}>Phân loại</th>
                <th className={TH('text-left w-24')}>WP ảnh hưởng</th>
                <th className={TH('w-12')}>ΔSP</th>
                <th className={TH('w-20')}>Δcost</th>
                <th className={TH('w-14')}>Δngày</th>
                <th className={TH('w-20')}>Đề xuất</th>
                <th className={TH('text-left w-48')}>Bước</th>
                <th className={TH('w-20')}>Cycle time</th>
                <th className={TH('w-28')}>Người duyệt</th>
                <th className={TH('border-r-0 w-28')}></th>
              </tr>
            </thead>
            <tbody>
              {crs.map((c) => {
                const h = cycleOf(c);
                const pending = c.cycleH === undefined;
                return (
                  <tr key={c.code} className={erp.tr}>
                    <td className={`${TD} border-l-0 whitespace-nowrap ${erp.code}`}>{c.code}</td>
                    <td className={TD}>
                      {c.title}
                      <span className="block text-[11px] text-slate-500 tabular-nums whitespace-nowrap">tạo {dmy(c.createdAt)}</span>
                    </td>
                    <td className={`${TD} text-center`}>{c.source}</td>
                    <td className={`${TD} text-center`}>
                      <Tag cls={c.classification === 'Out-of-scope' ? WARN : MUTED}>{c.classification}</Tag>
                    </td>
                    <td className={`${TD} font-mono text-[11px] text-[#1f5fa8]`}>
                      {c.wps.map((w) => (
                        <span key={w} className="block whitespace-nowrap">
                          {w}
                        </span>
                      ))}
                    </td>
                    <td className={`${TD} ${erp.num}`}>+{c.spDelta}</td>
                    <td className={`${TD} ${erp.num}`}>+{fmtTy(c.costDelta)}</td>
                    <td className={`${TD} ${erp.num}`}>+{c.daysDelta}</td>
                    <td className={`${TD} text-center`}>
                      <Tag cls={c.proposal === 'Tính phí' ? INFO : c.proposal === 'Hấp thụ' ? MUTED : BAD}>{c.proposal}</Tag>
                    </td>
                    <td className={TD}>
                      <CrStepper step={c.step} />
                    </td>
                    <td className={`${TD} text-center tabular-nums font-bold ${h > 48 ? 'text-rose-700' : h > 36 ? 'text-amber-700' : 'text-slate-700'}`}>
                      {h}h<span className="block text-[10.5px] font-normal text-slate-500">{pending ? 'đang chạy' : `chốt ${dmy(c.decidedAt || '')}`}</span>
                    </td>
                    <td className={`${TD} text-center text-[11.5px] font-semibold text-[#1e3a5f]`}>
                      {approverOf(c)}
                      <span className="block text-[10.5px] font-normal text-slate-500">{pct(c.spDelta, totalSp).toFixed(1)}% SP</span>
                    </td>
                    <td className={`${TD} border-r-0 text-center`}>
                      {c.step !== 'Đóng' ? (
                        <Btn className={SMALL_BTN} onClick={() => advance(c)}>
                          {c.step === 'Phê duyệt' ? 'Ghi quyết định' : 'Bước tiếp'}
                        </Btn>
                      ) : (
                        <Tag cls={GOOD}>Đã đóng</Tag>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!crs.length && <Empty cols={13} text="Chưa có CR." />}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};
export const RiskCrTab: React.FC<TabProps> = ({ project }) => <RiskCrInner key={project.id} project={project} />;

// ==========================================================================
// 4. Nguồn lực (F8.1)
// ==========================================================================
const REQ_ST_CLS: Record<ResourceRequest['status'], string> = { 'Chờ GĐSX': WARN, 'Đã gán': GOOD, 'Từ chối': BAD };
const ALL_SKILLS = [...new Set(PEOPLE.map((x) => x.skill))].sort();
const cellCls = (total: number) => (total > 100 ? 'bg-rose-100 text-rose-800 font-bold' : total < 60 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-800');
const weekAtOrAfter = (d: string) => NEXT_WEEKS.find((w) => w >= mondayOf(d)) || NEXT_WEEKS[NEXT_WEEKS.length - 1];

const ResourceInner: React.FC<TabProps> = ({ project: p }) => {
  const d = projectDetail(p);
  const weeks = NEXT_WEEKS.slice(1, 7);
  const [reqs, setReqs] = useStored<ResourceRequest[]>(`res-req-${p.id}`, () => []);
  const [form, setForm] = useState<{ level: Level; skill: string; pct: number; from: string; to: string } | null>(null);
  const all = [...reqs, ...RESOURCE_REQUESTS.filter((r) => r.projectId === p.id)];
  const projPct = (code: string, w: string) => (ALLOCATION[code]?.[w] || []).filter((c) => c.projectId === p.id).reduce((s, c) => s + c.pct, 0);
  const fte = d.team.reduce((s, t) => s + t.pct, 0) / 100;
  const overN = d.team.filter((t) => [THIS_WEEK, ...weeks].some((w) => allocTotal(t.person.code, w) > 100)).length;
  const lowN = d.team.filter((t) => allocTotal(t.person.code, THIS_WEEK) < 60).length;
  const formOk = !!form && !!form.skill.trim() && form.pct > 0 && !!form.from && !!form.to && form.from <= form.to;

  const suggest = (r: ResourceRequest) => {
    const wk = weekAtOrAfter(r.from);
    const free = (code: string) => 100 - allocTotal(code, wk);
    const fit = PEOPLE.filter((x) => x.level === r.level && free(x.code) >= r.pct);
    const bySkill = fit.filter((x) => x.skill === r.skill);
    return (bySkill.length ? bySkill : fit).slice(0, 3).map((x) => `${x.name} (còn ${free(x.code)}%${x.skill === r.skill ? '' : `, ${x.skill}`})`);
  };
  const submit = () => {
    if (!form || !formOk) return;
    const n = 50 + reqs.length + 1;
    setReqs((cur) => [{ id: `RQ-${String(n).padStart(3, '0')}`, projectId: p.id, level: form.level, skill: form.skill.trim(), pct: form.pct, from: form.from, to: form.to, status: 'Chờ GĐSX', createdBy: p.pm, createdAt: TODAY }, ...cur]);
    setForm(null);
  };

  return (
    <div className="space-y-3">
      <Panel
        title={`Team dự án (${d.team.length} người · ${fte.toFixed(1)} FTE tuần này)`}
        icon={Users}
        noPad
        actions={
          <>
            <span className="text-[12px] text-slate-600 mr-1">
              Quá tải <b className={overN ? 'text-rose-700' : ''}>{overN}</b> · tổng &lt;60% <b className={lowN ? 'text-amber-700' : ''}>{lowN}</b>
            </span>
            <Btn variant="primary" icon={UserPlus} className="h-7" disabled={!!form} onClick={() => setForm({ level: 'Middle', skill: '', pct: 100, from: NEXT_WEEKS[2], to: addDays(NEXT_WEEKS[2], 8 * 7 - 3) })}>
              Xin người
            </Btn>
          </>
        }
        footer="Allocation theo tuần, đơn vị 10%. Ô hiện % của dự án này; màu theo TỔNG allocation của người đó trên mọi dự án: đỏ >100%, vàng <60% (2 tuần liên tục → bench), xanh bình thường. Chi phí nhân sự tính theo rate card level × khối (F7.3) — màn này không dùng lương cá nhân."
      >
        {form && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2 border-b border-slate-200 bg-[#f5f9ff] text-[12px]">
            <FilterCell label="Level">
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as Level })} className={SEL}>
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </FilterCell>
            <FilterCell label="Skill">
              <input list="pmo-skill-list" value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })} placeholder="vd .NET *" className={`${SEL} w-44 ${!form.skill.trim() ? 'border-rose-300' : ''}`} />
              <datalist id="pmo-skill-list">
                {ALL_SKILLS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </FilterCell>
            <FilterCell label="%">
              <select value={form.pct} onChange={(e) => setForm({ ...form, pct: Number(e.target.value) })} className={SEL}>
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}%
                  </option>
                ))}
              </select>
            </FilterCell>
            <FilterCell label="Từ">
              <input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} className={SEL} />
            </FilterCell>
            <FilterCell label="Đến">
              <input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} className={`${SEL} ${form.from > form.to ? 'border-rose-400' : ''}`} />
            </FilterCell>
            <span className="text-slate-500">→ GĐSX {p.khoi} duyệt và gán người</span>
            <span className="ml-auto flex gap-1">
              <Btn variant="primary" className={SMALL_BTN} disabled={!formOk} onClick={submit}>
                Gửi yêu cầu
              </Btn>
              <Btn className={SMALL_BTN} onClick={() => setForm(null)}>
                Huỷ
              </Btn>
            </span>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1000px]`}>
            <thead>
              <tr>
                <th className={TH('border-l-0 text-left')}>Người</th>
                <th className={TH('w-20')}>Mã</th>
                <th className={TH('w-16')}>Khối gốc</th>
                <th className={TH('w-20')}>Level</th>
                <th className={TH('w-14')}>Vai trò</th>
                <th className={TH('w-24')}>Tuần này</th>
                {weeks.map((w, i) => (
                  <th key={w} className={TH(`w-16 ${i === weeks.length - 1 ? 'border-r-0' : ''}`)}>
                    W{weekNo(w)}
                    <span className="block text-[10px] font-normal text-slate-500">{weekLabel(w)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.team.map((t) => {
                const tot = allocTotal(t.person.code, THIS_WEEK);
                return (
                  <tr key={t.person.code} className={erp.tr}>
                    <td className={`${TD} border-l-0`}>
                      {t.person.name}
                      <span className="block text-[11px] text-slate-500">{t.person.skill}</span>
                    </td>
                    <td className={`${TD} ${erp.code} text-center`}>{t.person.code}</td>
                    <td className={`${TD} text-center ${t.person.khoi !== p.khoi ? 'text-violet-700 font-semibold' : ''}`}>{t.person.khoi}</td>
                    <td className={`${TD} text-center`}>{t.person.level}</td>
                    <td className={`${TD} text-center`}>{t.role}</td>
                    <td className={`${TD} text-center tabular-nums ${cellCls(tot)}`} title={`Tổng allocation: ${tot}%`}>
                      <b>{t.pct}%</b>
                      <span className="text-[10.5px] opacity-70"> /{tot}</span>
                    </td>
                    {weeks.map((w, i) => {
                      const wt = allocTotal(t.person.code, w);
                      const pp = projPct(t.person.code, w);
                      return (
                        <td key={w} className={`${TD} text-center tabular-nums ${cellCls(wt)} ${i === weeks.length - 1 ? 'border-r-0' : ''}`} title={`Dự án ${pp}% · tổng ${wt}%`}>
                          {pp}
                          <span className="text-[10px] opacity-70">/{wt}</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {!d.team.length && <Empty cols={6 + weeks.length} text="Chưa có ai được allocate vào dự án tuần này." />}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title={`Yêu cầu nguồn lực (${all.length})`} icon={UserPlus} noPad footer="PM tạo yêu cầu (level, skill, %, từ–đến) → GĐSX duyệt và gán người. Gợi ý: người cùng level còn đủ capacity ở tuần bắt đầu (ưu tiên đúng skill).">
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1000px]`}>
            <thead>
              <tr>
                <th className={TH('border-l-0 w-20')}>Mã</th>
                <th className={TH('w-20')}>Level</th>
                <th className={TH('text-left w-44')}>Skill</th>
                <th className={TH('w-14')}>%</th>
                <th className={TH('w-44')}>Từ – đến</th>
                <th className={TH('w-24')}>Trạng thái</th>
                <th className={TH('text-left')}>Người được gán / gợi ý</th>
                <th className={TH('border-r-0 text-left w-40')}>Người tạo</th>
              </tr>
            </thead>
            <tbody>
              {all.map((r) => {
                const assigned = r.assigned ? PEOPLE.find((x) => x.code === r.assigned) : undefined;
                return (
                  <tr key={r.id} className={reqs.includes(r) ? 'bg-[#f5f9ff]' : erp.tr}>
                    <td className={`${TD} border-l-0 ${erp.code}`}>{r.id}</td>
                    <td className={`${TD} text-center`}>{r.level}</td>
                    <td className={TD}>{r.skill}</td>
                    <td className={`${TD} ${erp.num}`}>{r.pct}%</td>
                    <td className={`${TD} text-center tabular-nums`}>
                      {dmy(r.from)} → {dmy(r.to)}
                    </td>
                    <td className={`${TD} text-center`}>
                      <Tag cls={REQ_ST_CLS[r.status]}>{r.status}</Tag>
                    </td>
                    <td className={`${TD} text-[11.5px]`}>
                      {assigned ? (
                        <b>
                          {assigned.name} ({assigned.code} · {assigned.khoi})
                        </b>
                      ) : r.status === 'Chờ GĐSX' ? (
                        <span className="text-slate-600">{suggest(r).join(' · ') || <span className="text-amber-700">Không còn người phù hợp — cân nhắc điều chuyển liên khối (F8.2)</span>}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className={`${TD} border-r-0`}>
                      {r.createdBy}
                      <span className="block text-[11px] text-slate-500 tabular-nums">{dmy(r.createdAt)}</span>
                    </td>
                  </tr>
                );
              })}
              {!all.length && <Empty cols={8} text="Chưa có yêu cầu nguồn lực." />}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};
export const ResourceTab: React.FC<TabProps> = ({ project }) => <ResourceInner key={project.id} project={project} />;
