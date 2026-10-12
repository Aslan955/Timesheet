/**
 * PmoResourceRequestPage — PMO-10 Yêu cầu nguồn lực (F8.1) & điều chuyển liên khối (F8.2).
 *
 * Ba thẻ:
 *   1. Yêu cầu nguồn lực: bảng yêu cầu PM gửi; "Tạo yêu cầu" mở dòng nhập ngay trên bảng (dự án, level, skill, %, từ–đến).
 *      Yêu cầu "Chờ GĐSX": "Gán người" mở ngay dưới dòng danh sách gợi ý (cùng level, % còn trống trong khoảng thời gian,
 *      tính từ allocation) → chọn → Đã gán (allocation cập nhật); người khác khối → đề xuất điều chuyển. "Từ chối" nhập lý do inline.
 *   2. Điều chuyển liên khối: bảng đề xuất + stepper 2 bước (GĐK khối cho → GĐK khối nhận), SLA 3 ngày LV/bước, quá hạn đỏ.
 *      Bấm dòng → chi tiết ngay dưới: allocation 6 tuần của người đó, tác động lên dự án khối cho, lịch sử duyệt; Duyệt/Từ chối inline.
 *      Không cho duyệt nếu làm allocation >100%. "Tạo yêu cầu điều chuyển" là dòng nhập inline (lý do bắt buộc).
 *   3. Thống kê điều chuyển: ma trận khối cho × khối nhận (số lượt, người-tháng) theo quý.
 */
import React, { useMemo, useState } from 'react';
import { ArrowRightLeft, BarChart3, Check, ChevronDown, ChevronRight, Filter, Plus, UserPlus, Users, X } from 'lucide-react';
import { KHOI, Khoi, PMO_PROJECTS, TODAY, addDays, dmy, fmtVnd, pick, rand, workDays } from '../../pmo/pmo';
import { LEVELS, Level, NEXT_WEEKS, PEOPLE, RESOURCE_REQUESTS, ResourceRequest, TRANSFERS, Transfer, personByCode, projectDetail, rateOf, weekLabel, weekNo } from '../../pmo/pmoData';
import { usePmo } from '../../pmo/PmoContext';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, Panel, Tag, erp } from '../erp/Erp';
import { HealthBadge, RoleSelect } from './PmoBits';
import { addAlloc, allocCells, allocSum, heatCls, setAllocCells, weeksInRange } from './PmoAllocationPage';

// ==========================================================================
// Dữ liệu trong phiên
// ==========================================================================
type Req = ResourceRequest & { reason?: string };
const SKILL_LIST = [...new Set(PEOPLE.map((p) => p.skill))].sort();

/** Bổ sung lịch sử điều chuyển cũ (mẫu, tất định) để thẻ thống kê có số liệu theo quý. */
const HISTORY: Transfer[] = Array.from({ length: 9 }, (_, i) => {
  const person = pick(PEOPLE, 'trh', i);
  const target = pick(
    PMO_PROJECTS.filter((p) => p.khoi !== person.khoi),
    'trp',
    i,
  );
  const from = addDays('2026-01-05', i * 26 + Math.floor(rand('trs', i) * 10));
  const to = addDays(from, 45 + Math.floor(rand('trd', i) * 60));
  const ok = rand('tro', i) > 0.15;
  const gdk = (k: Khoi) => `GĐK ${k}`;
  return {
    id: `TR-${String(i + 1).padStart(3, '0')}`,
    person: person.code,
    fromKhoi: person.khoi,
    toProject: target.id,
    pct: pick([50, 50, 100, 30], 'trpc', i),
    from,
    to,
    reason: pick(['Thiếu người cho release', 'Cần chuyên gia tích hợp', 'Hỗ trợ SIT/UAT', 'Bổ sung BA nghiệp vụ'], 'trr', i),
    status: ok ? (to < TODAY ? 'Đã trả người' : 'Đã duyệt') : 'Từ chối',
    createdAt: addDays(from, -8),
    steps: ok
      ? [
          { step: `GĐK khối cho (${person.khoi})`, by: gdk(person.khoi), decision: 'Đồng ý', at: addDays(from, -7) },
          { step: `GĐK khối nhận (${target.khoi})`, by: gdk(target.khoi), decision: 'Đồng ý', at: addDays(from, -5) },
        ]
      : [{ step: `GĐK khối cho (${person.khoi})`, by: gdk(person.khoi), decision: 'Từ chối — dự án khối đang thiếu người', at: addDays(from, -6) }],
  } as Transfer;
});

const STORE = {
  reqs: RESOURCE_REQUESTS.map((r) => ({ ...r })) as Req[],
  trs: [...TRANSFERS.map((t) => ({ ...t, steps: [...t.steps] })), ...HISTORY.reverse()] as Transfer[],
  seqReq: 42,
  seqTr: 14,
};

// ==========================================================================
// Tiện ích
// ==========================================================================
const SEL = `${erp.input} h-7 text-[12px]`;
const projectOf = (id: string) => PMO_PROJECTS.find((p) => p.id === id);
const SLA_DAYS = 3;
const REQ_CLS: Record<ResourceRequest['status'], string> = {
  'Chờ GĐSX': 'bg-amber-50 text-amber-700 border-amber-200',
  'Đã gán': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Từ chối': 'bg-rose-50 text-rose-700 border-rose-200',
};
const TR_CLS: Record<Transfer['status'], string> = {
  'Chờ GĐK cho': 'bg-amber-50 text-amber-700 border-amber-200',
  'Chờ GĐK nhận': 'bg-amber-50 text-amber-700 border-amber-200',
  'Đã duyệt': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Từ chối': 'bg-rose-50 text-rose-700 border-rose-200',
  'Đã trả người': 'bg-slate-50 text-slate-600 border-slate-200',
};

/** % còn trống nhỏ nhất của một người trong khoảng (theo 12 tuần dự báo). */
const freeIn = (code: string, from: string, to: string) => {
  const ws = weeksInRange(from, to);
  const pool = ws.length ? ws : [NEXT_WEEKS[NEXT_WEEKS.length - 1]];
  return Math.min(...pool.map((w) => 100 - allocSum(code, w)));
};
/** Tuần bị vượt 100% nếu thêm pct. */
const overWeeks = (code: string, pct: number, from: string, to: string) => weeksInRange(from, to).filter((w) => allocSum(code, w) + pct > 100);

const FilterCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex items-center gap-1.5 min-w-0">
    <span className="text-[12px] text-slate-600 whitespace-nowrap">{label}</span>
    {children}
  </label>
);

type TabKey = 'req' | 'tr' | 'stat';

export const PmoResourceRequestPage: React.FC<{ onNavigate?: (item: string) => void }> = ({ onNavigate }) => {
  const { projects, role, setRole, khoi } = usePmo();
  const [tab, setTab] = useState<TabKey>('req');
  const [reqs, setReqsState] = useState<Req[]>(STORE.reqs);
  const [trs, setTrsState] = useState<Transfer[]>(STORE.trs);
  const [ver, setVer] = useState(0); // allocation thay đổi
  const [msg, setMsg] = useState('');
  const flash = (s: string) => {
    setMsg(s);
    window.setTimeout(() => setMsg(''), 4000);
  };
  const setReqs = (next: Req[]) => ((STORE.reqs = next), setReqsState(next));
  const setTrs = (next: Transfer[]) => ((STORE.trs = next), setTrsState(next));

  // ----- Yêu cầu nguồn lực -----
  const [reqStatus, setReqStatus] = useState('');
  const [reqForm, setReqForm] = useState<null | { projectId: string; level: Level; skill: string; pct: number; from: string; to: string }>(null);
  const [assignId, setAssignId] = useState<string | null>(null);
  const [rejectReq, setRejectReq] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  // ----- Điều chuyển -----
  const [trStatus, setTrStatus] = useState('');
  const [openTr, setOpenTr] = useState<string | null>(null);
  const [rejectTr, setRejectTr] = useState<string | null>(null);
  const [trForm, setTrForm] = useState<null | { person: string; toProject: string; pct: number; from: string; to: string; reason: string }>(null);
  const [trErr, setTrErr] = useState<Record<string, string>>({});

  // ----- Thống kê -----
  const [quarter, setQuarter] = useState('2026-Q3');

  const reqRows = reqs.filter((r) => !reqStatus || r.status === reqStatus);
  const trRows = trs.filter((t) => !trStatus || t.status === trStatus);
  const pendingReq = reqs.filter((r) => r.status === 'Chờ GĐSX').length;
  const pendingTr = trs.filter((t) => t.status === 'Chờ GĐK cho' || t.status === 'Chờ GĐK nhận');

  /** Ngày bắt đầu bước hiện tại và số ngày LV đã chờ. */
  const stepClock = (t: Transfer) => {
    const start = t.status === 'Chờ GĐK nhận' ? t.steps[0]?.at || t.createdAt : t.createdAt;
    return { start, wd: workDays(start, TODAY) };
  };

  // ---------- Hành động: yêu cầu nguồn lực ----------
  const createReq = () => {
    if (!reqForm || !reqForm.skill.trim() || reqForm.to < reqForm.from) return;
    const r: Req = { id: `RQ-${String(STORE.seqReq++).padStart(3, '0')}`, ...reqForm, skill: reqForm.skill.trim(), status: 'Chờ GĐSX', createdBy: projectOf(reqForm.projectId)?.pm || 'PM', createdAt: TODAY };
    setReqs([r, ...reqs]);
    setReqForm(null);
    flash(`Đã tạo ${r.id} — gửi GĐSX khối ${projectOf(r.projectId)?.khoi} duyệt và gán người (Inbox phê duyệt)`);
  };
  const assign = (r: Req, code: string) => {
    addAlloc(code, r.projectId, r.pct, weeksInRange(r.from, r.to));
    setVer(ver + 1);
    setReqs(reqs.map((x) => (x.id === r.id ? { ...x, status: 'Đã gán', assigned: code } : x)));
    setAssignId(null);
    flash(`Đã gán ${personByCode(code)?.name} cho ${r.id} — allocation ${r.pct}% cập nhật ${weeksInRange(r.from, r.to).length} tuần, ghi audit`);
  };
  const rejectRequest = (r: Req) => {
    if (!reason.trim()) return;
    setReqs(reqs.map((x) => (x.id === r.id ? { ...x, status: 'Từ chối', reason: reason.trim() } : x)));
    setRejectReq(null);
    setReason('');
    flash(`Đã từ chối ${r.id} — PM nhận thông báo kèm lý do`);
  };
  const proposeTransfer = (r: Req, code: string) => {
    setTab('tr');
    setTrForm({ person: code, toProject: r.projectId, pct: r.pct, from: r.from, to: r.to, reason: `Theo ${r.id}: cần ${r.level} ${r.skill}` });
    setAssignId(null);
  };

  // ---------- Hành động: điều chuyển ----------
  const createTr = () => {
    if (!trForm || !trForm.reason.trim() || !trForm.toProject || trForm.to < trForm.from) return;
    const p = personByCode(trForm.person)!;
    const t: Transfer = { id: `TR-${String(STORE.seqTr++).padStart(3, '0')}`, ...trForm, reason: trForm.reason.trim(), fromKhoi: p.khoi, status: 'Chờ GĐK cho', createdAt: TODAY, steps: [] };
    setTrs([t, ...trs]);
    setTrForm(null);
    setOpenTr(t.id);
    flash(`Đã tạo ${t.id} — chờ GĐK khối ${p.khoi} (khối cho) duyệt, SLA ${SLA_DAYS} ngày LV`);
  };
  const approveTr = (t: Transfer) => {
    const over = overWeeks(t.person, t.pct, t.from, t.to);
    if (over.length) {
      setTrErr({ ...trErr, [t.id]: `Không duyệt được: ${over.map((w) => `W${weekNo(w)} ${allocSum(t.person, w) + t.pct}%`).join(', ')} > 100%. Giảm allocation dự án khối cho trước.` });
      return;
    }
    const toK = projectOf(t.toProject)?.khoi;
    if (t.status === 'Chờ GĐK cho') {
      setTrs(trs.map((x) => (x.id === t.id ? { ...x, status: 'Chờ GĐK nhận', steps: [...x.steps, { step: `GĐK khối cho (${t.fromKhoi})`, by: `GĐK ${t.fromKhoi}`, decision: 'Đồng ý', at: TODAY }] } : x)));
      flash(`${t.id}: GĐK ${t.fromKhoi} đồng ý → chuyển GĐK khối nhận (${toK}) duyệt`);
    } else {
      addAlloc(t.person, t.toProject, t.pct, weeksInRange(t.from, t.to));
      setVer(ver + 1);
      setTrs(trs.map((x) => (x.id === t.id ? { ...x, status: 'Đã duyệt', steps: [...x.steps, { step: `GĐK khối nhận (${toK})`, by: `GĐK ${toK}`, decision: 'Đồng ý', at: TODAY }] } : x)));
      flash(`${t.id} đã duyệt — allocation cập nhật tự động; cost tính vào ${t.toProject} theo rate khối ${t.fromKhoi}`);
    }
    setTrErr({ ...trErr, [t.id]: '' });
  };
  const rejectTransfer = (t: Transfer) => {
    if (!reason.trim()) return;
    const toK = projectOf(t.toProject)?.khoi;
    const step = t.status === 'Chờ GĐK cho' ? `GĐK khối cho (${t.fromKhoi})` : `GĐK khối nhận (${toK})`;
    setTrs(trs.map((x) => (x.id === t.id ? { ...x, status: 'Từ chối', steps: [...x.steps, { step, by: step.replace('khối cho ', '').replace('khối nhận ', '').replace(/[()]/g, ''), decision: `Từ chối — ${reason.trim()}`, at: TODAY }] } : x)));
    setRejectTr(null);
    setReason('');
    flash(`Đã từ chối ${t.id} — người đề xuất nhận lý do`);
  };
  /** Giảm allocation dự án khối cho để đủ chỗ (thao tác nhanh của GĐK khối cho). */
  const freeUp = (t: Transfer) => {
    weeksInRange(t.from, t.to).forEach((w) => {
      let need = allocSum(t.person, w) + t.pct - 100;
      if (need <= 0) return;
      const cells = allocCells(t.person, w)
        .map((c) => ({ ...c }))
        .sort((a, b) => (projectOf(a.projectId)?.khoi === t.fromKhoi ? -1 : 1) - (projectOf(b.projectId)?.khoi === t.fromKhoi ? -1 : 1) || b.pct - a.pct);
      cells.forEach((c) => {
        const cut = Math.min(c.pct, need);
        c.pct -= cut;
        need -= cut;
      });
      setAllocCells(t.person, w, cells);
    });
    setVer(ver + 1);
    setTrErr({ ...trErr, [t.id]: '' });
    flash(`Đã giảm allocation dự án khối ${t.fromKhoi} của ${personByCode(t.person)?.name} để nhường ${t.pct}% — ghi audit`);
  };
  const extend = (t: Transfer) => {
    setTrs(trs.map((x) => (x.id === t.id ? { ...x, to: addDays(x.to, 30) } : x)));
    flash(`${t.id} gia hạn thêm 30 ngày → ${dmy(addDays(t.to, 30))}`);
  };
  const giveBack = (t: Transfer) => {
    setTrs(trs.map((x) => (x.id === t.id ? { ...x, status: 'Đã trả người', to: TODAY } : x)));
    flash(`${t.id}: đã trả người về khối ${t.fromKhoi}`);
  };

  // ---------- Thống kê ----------
  const QUARTERS = ['2026-Q1', '2026-Q2', '2026-Q3', '2026-Q4', '2027-Q1'];
  const qRange = (q: string) => {
    const [y, n] = q.split('-Q').map(Number);
    const s = `${y}-${String((n - 1) * 3 + 1).padStart(2, '0')}-01`;
    const e = addDays(`${n === 4 ? y + 1 : y}-${String(n === 4 ? 1 : n * 3 + 1).padStart(2, '0')}-01`, -1);
    return [s, e];
  };
  const matrix = useMemo(() => {
    const [qs, qe] = qRange(quarter);
    const m: Record<string, Record<string, { n: number; pm: number }>> = {};
    trs
      .filter((t) => t.status === 'Đã duyệt' || t.status === 'Đã trả người')
      .forEach((t) => {
        const s = t.from > qs ? t.from : qs;
        const e = t.to < qe ? t.to : qe;
        if (s > e) return;
        const days = (new Date(e).getTime() - new Date(s).getTime()) / 864e5 + 1;
        const toK = projectOf(t.toProject)?.khoi || '';
        m[t.fromKhoi] = m[t.fromKhoi] || {};
        m[t.fromKhoi][toK] = m[t.fromKhoi][toK] || { n: 0, pm: 0 };
        m[t.fromKhoi][toK].n++;
        m[t.fromKhoi][toK].pm += (days / 30) * (t.pct / 100);
      });
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trs, quarter]);

  // ==========================================================================
  // Render
  // ==========================================================================
  const reqTable = (
    <Panel
      title={
        <>
          Yêu cầu nguồn lực <span className="font-normal normal-case text-slate-500 tracking-normal">· {reqRows.length} yêu cầu</span>
        </>
      }
      icon={UserPlus}
      noPad
      actions={
        <>
          {msg && <span className="text-[12px] text-emerald-700">{msg}</span>}
          <Btn
            variant="primary"
            icon={Plus}
            className="h-7"
            disabled={!!reqForm}
            onClick={() => setReqForm({ projectId: (projects.find((p) => p.khoi === khoi) || projects[0]).id, level: 'Middle', skill: '', pct: 100, from: addDays(TODAY, 10), to: addDays(TODAY, 70) })}
          >
            Tạo yêu cầu
          </Btn>
        </>
      }
      footer="PM tạo yêu cầu (level, skill, %, từ–đến) → GĐSX khối duyệt và gán người. Gợi ý: cùng level, % còn trống nhỏ nhất trong khoảng thời gian (theo allocation 12 tuần). Người khác khối → tạo điều chuyển liên khối."
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
        <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300">
          <Filter size={13} className="text-[#1f5fa8]" /> Lọc
        </span>
        <FilterCell label="Trạng thái">
          <select value={reqStatus} onChange={(e) => setReqStatus(e.target.value)} className={SEL}>
            <option value="">Tất cả</option>
            <option>Chờ GĐSX</option>
            <option>Đã gán</option>
            <option>Từ chối</option>
          </select>
        </FilterCell>
      </div>
      <div className="overflow-x-auto">
        <table className={`${erp.table} min-w-[1150px]`}>
          <thead>
            <tr>
              <th className={`${erp.th} border-t-0 border-l-0 w-16`}>Mã</th>
              <th className={`${erp.th} border-t-0 text-left min-w-[220px]`}>Dự án</th>
              <th className={`${erp.th} border-t-0 w-20`}>Level</th>
              <th className={`${erp.th} border-t-0 text-left w-32`}>Skill</th>
              <th className={`${erp.th} border-t-0 text-right w-16`}>%</th>
              <th className={`${erp.th} border-t-0 w-44`}>Từ – đến</th>
              <th className={`${erp.th} border-t-0 text-left w-36`}>Người tạo</th>
              <th className={`${erp.th} border-t-0 w-24`}>Trạng thái</th>
              <th className={`${erp.th} border-t-0 text-left w-40`}>Người được gán</th>
              <th className={`${erp.th} border-t-0 border-r-0 w-48`}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {reqForm && (
              <tr className="bg-[#fffbea]">
                <td className={`${erp.td} border-l-0 text-[11px] text-slate-500`}>Mới</td>
                <td className={erp.td}>
                  <select value={reqForm.projectId} onChange={(e) => setReqForm({ ...reqForm, projectId: e.target.value })} className={`${SEL} w-full`}>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} · {p.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={erp.td}>
                  <select value={reqForm.level} onChange={(e) => setReqForm({ ...reqForm, level: e.target.value as Level })} className={`${SEL} w-full`}>
                    {LEVELS.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </td>
                <td className={erp.td}>
                  <input list="pmo-skills" value={reqForm.skill} onChange={(e) => setReqForm({ ...reqForm, skill: e.target.value })} placeholder="Skill *" className={`${SEL} w-full ${!reqForm.skill.trim() ? 'border-rose-300' : ''}`} />
                  <datalist id="pmo-skills">
                    {SKILL_LIST.map((s) => (
                      <option key={s} value={s} />
                    ))}
                  </datalist>
                </td>
                <td className={erp.td}>
                  <input type="number" step={10} min={10} max={100} value={reqForm.pct} onChange={(e) => setReqForm({ ...reqForm, pct: Math.max(10, Math.min(100, Math.round(Number(e.target.value) / 10) * 10)) })} className={`${SEL} w-full text-right`} />
                </td>
                <td className={erp.td}>
                  <span className="flex items-center gap-1">
                    <input type="date" value={reqForm.from} onChange={(e) => setReqForm({ ...reqForm, from: e.target.value })} className={`${SEL} px-1`} />
                    <input type="date" value={reqForm.to} onChange={(e) => setReqForm({ ...reqForm, to: e.target.value })} className={`${SEL} px-1 ${reqForm.to < reqForm.from ? 'border-rose-400' : ''}`} />
                  </span>
                </td>
                <td className={`${erp.td} text-slate-500`}>{projectOf(reqForm.projectId)?.pm}</td>
                <td className={`${erp.td} text-center`}>
                  <Tag cls={REQ_CLS['Chờ GĐSX']}>Nháp</Tag>
                </td>
                <td className={`${erp.td} text-[11px] text-slate-500`}>{reqForm.to < reqForm.from ? <span className="text-rose-700">Ngày đến phải sau ngày từ</span> : 'GĐSX gán sau khi duyệt'}</td>
                <td className={`${erp.td} border-r-0 text-center`}>
                  <span className="inline-flex gap-1">
                    <Btn variant="primary" className="h-7 px-2.5" icon={Check} disabled={!reqForm.skill.trim() || reqForm.to < reqForm.from} onClick={createReq}>
                      Gửi
                    </Btn>
                    <Btn className="h-7 px-2.5" onClick={() => setReqForm(null)}>
                      Huỷ
                    </Btn>
                  </span>
                </td>
              </tr>
            )}
            {reqRows.map((r) => {
              const p = projectOf(r.projectId);
              const assigning = assignId === r.id;
              const rejecting = rejectReq === r.id;
              const who = r.assigned ? personByCode(r.assigned) : undefined;
              const cands = assigning
                ? PEOPLE.filter((x) => x.level === r.level)
                    .map((x) => ({ x, free: freeIn(x.code, r.from, r.to), skillOk: x.skill === r.skill, same: x.khoi === p?.khoi }))
                    .sort((a, b) => Number(b.same) - Number(a.same) || Number(b.skillOk) - Number(a.skillOk) || b.free - a.free)
                    .slice(0, 8)
                : [];
              return (
                <React.Fragment key={r.id}>
                  <tr className={assigning ? 'bg-[#eaf2fc]' : rejecting ? 'bg-[#fff5f5]' : erp.tr}>
                    <td className={`${erp.td} border-l-0 whitespace-nowrap ${erp.code}`}>{r.id}</td>
                    <td className={erp.td}>
                      <span className={`${erp.code} whitespace-nowrap`}>{r.projectId}</span> <span className="text-slate-700">{p?.name}</span>
                    </td>
                    <td className={`${erp.td} text-center`}>{r.level}</td>
                    <td className={erp.td}>{r.skill}</td>
                    <td className={`${erp.td} ${erp.num}`}>{r.pct}%</td>
                    <td className={`${erp.td} text-center tabular-nums whitespace-nowrap`}>
                      {dmy(r.from)} – {dmy(r.to)}
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      {r.createdBy}
                      <span className="block text-[11px] text-slate-500 tabular-nums">{dmy(r.createdAt)}</span>
                    </td>
                    <td className={`${erp.td} text-center`}>
                      <Tag cls={REQ_CLS[r.status]}>{r.status}</Tag>
                    </td>
                    <td className={erp.td}>
                      {who ? (
                        <>
                          {who.name} <span className="text-[11px] text-slate-500 font-mono">{who.code}</span>
                        </>
                      ) : r.status === 'Từ chối' ? (
                        <span className="text-[11.5px] text-rose-700">{r.reason || 'Không còn người phù hợp trong khối'}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className={`${erp.td} border-r-0 text-center`}>
                      {r.status !== 'Chờ GĐSX' ? (
                        <span className="text-slate-400 text-[11px]">—</span>
                      ) : rejecting ? (
                        <div className="flex flex-col gap-1">
                          <input
                            autoFocus
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            onKeyDown={(e) => (e.key === 'Enter' ? rejectRequest(r) : e.key === 'Escape' ? setRejectReq(null) : null)}
                            placeholder="Lý do từ chối *"
                            className={`${SEL} w-full ${!reason.trim() ? 'border-rose-300' : ''}`}
                          />
                          <div className="flex gap-1 justify-center">
                            <Btn variant="danger" className="h-6! px-2! text-[11px]!" disabled={!reason.trim()} onClick={() => rejectRequest(r)}>
                              Xác nhận từ chối
                            </Btn>
                            <Btn className="h-6! px-2! text-[11px]!" onClick={() => setRejectReq(null)}>
                              Huỷ
                            </Btn>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex gap-1">
                          <Btn variant={assigning ? 'default' : 'success'} className="h-6! px-2! text-[11px]!" icon={assigning ? ChevronDown : Users} onClick={() => setAssignId(assigning ? null : r.id)}>
                            Gán người
                          </Btn>
                          <Btn variant="danger" className="h-6! px-2! text-[11px]!" icon={X} onClick={() => (setRejectReq(r.id), setAssignId(null), setReason(''))}>
                            Từ chối
                          </Btn>
                        </span>
                      )}
                    </td>
                  </tr>
                  {assigning && (
                    <tr>
                      <td colSpan={10} className="border border-slate-300 border-l-0 border-r-0 bg-[#f7fafd] p-2">
                        <p className="text-[12px] mb-1.5">
                          <b className="text-[#1e3a5f]">Gợi ý người phù hợp</b>{' '}
                          <span className="text-slate-500">
                            · level {r.level} · cần {r.pct}% từ {dmy(r.from)} đến {dmy(r.to)} · % trống = nhỏ nhất trong {weeksInRange(r.from, r.to).length || 1} tuần dự báo
                          </span>
                        </p>
                        <table className={`${erp.table} bg-white`}>
                          <thead>
                            <tr>
                              <th className={`${erp.th} text-left`}>Nhân sự</th>
                              <th className={erp.th}>Khối</th>
                              <th className={erp.th}>Vai trò</th>
                              <th className={`${erp.th} text-left`}>Skill</th>
                              <th className={`${erp.th} text-right`}>% còn trống</th>
                              <th className={`${erp.th} text-left`}>Allocation hiện tại</th>
                              <th className={erp.th}>Chọn</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cands.map(({ x, free, skillOk, same }) => {
                              const enough = free >= r.pct;
                              return (
                                <tr key={x.code} className={erp.tr}>
                                  <td className={erp.td}>
                                    <b className="text-slate-800">{x.name}</b> <span className="text-[11px] text-slate-500 font-mono">{x.code}</span>
                                  </td>
                                  <td className={`${erp.td} text-center`}>
                                    {x.khoi} {!same && <Tag cls="bg-teal-50 text-teal-700 border-teal-200">khác khối</Tag>}
                                  </td>
                                  <td className={`${erp.td} text-center`}>{x.job}</td>
                                  <td className={`${erp.td} ${skillOk ? 'text-emerald-700 font-semibold' : ''}`}>{x.skill}</td>
                                  <td className={`${erp.td} ${erp.num} font-bold ${enough ? 'text-emerald-700' : free > 0 ? 'text-amber-700' : 'text-rose-700'}`}>{Math.max(0, free)}%</td>
                                  <td className={`${erp.td} text-[11.5px] text-slate-600`}>
                                    {allocCells(x.code, NEXT_WEEKS[0])
                                      .map((c) => `${c.projectId} ${c.pct}%`)
                                      .join(' · ') || 'Chưa phân bổ'}
                                  </td>
                                  <td className={`${erp.td} text-center`}>
                                    {same ? (
                                      <Btn variant="primary" className="h-6! px-2! text-[11px]!" disabled={!enough} title={enough ? '' : 'Không đủ capacity — sẽ vượt 100%'} onClick={() => assign(r, x.code)}>
                                        Chọn
                                      </Btn>
                                    ) : (
                                      <Btn className="h-6! px-2! text-[11px]!" icon={ArrowRightLeft} disabled={!enough} onClick={() => proposeTransfer(r, x.code)}>
                                        Đề xuất điều chuyển
                                      </Btn>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );

  const formPerson = trForm ? personByCode(trForm.person) : undefined;
  const formOver = trForm ? overWeeks(trForm.person, trForm.pct, trForm.from, trForm.to) : [];

  const trTable = (
    <Panel
      title={
        <>
          Điều chuyển liên khối <span className="font-normal normal-case text-slate-500 tracking-normal">· {trRows.length} đề xuất · {pendingTr.length} chờ duyệt</span>
        </>
      }
      icon={ArrowRightLeft}
      noPad
      actions={
        <>
          {msg && <span className="text-[12px] text-emerald-700">{msg}</span>}
          <Btn
            variant="primary"
            icon={Plus}
            className="h-7"
            disabled={!!trForm}
            onClick={() => {
              const target = projects.find((p) => p.khoi === khoi) || projects[0];
              const person = PEOPLE.find((x) => x.khoi !== target.khoi)!;
              setTrForm({ person: person.code, toProject: target.id, pct: 50, from: addDays(TODAY, 7), to: addDays(TODAY, 90), reason: '' });
            }}
          >
            Tạo yêu cầu điều chuyển
          </Btn>
        </>
      }
      footer="Duyệt tuần tự: GĐK khối cho → GĐK khối nhận, SLA 3 ngày LV mỗi bước; quá hạn → nhắc và cảnh báo TCT. Khi duyệt: allocation cập nhật tự động; cost tính vào dự án nhận với rate khối gốc (F7.3). Đến hạn (≤30 ngày) → nhắc gia hạn hoặc trả người. Không cho điều chuyển làm allocation >100%."
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
        <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300">
          <Filter size={13} className="text-[#1f5fa8]" /> Lọc
        </span>
        <FilterCell label="Trạng thái">
          <select value={trStatus} onChange={(e) => setTrStatus(e.target.value)} className={SEL}>
            <option value="">Tất cả</option>
            {(Object.keys(TR_CLS) as Transfer['status'][]).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </FilterCell>
      </div>

      {trForm && (
        <div className="px-3 py-2 bg-[#fffbea] border-b border-slate-200 text-[12px]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <b className="text-[#1e3a5f]">Đề xuất mới</b>
            <FilterCell label="Người *">
              <select value={trForm.person} onChange={(e) => setTrForm({ ...trForm, person: e.target.value })} className={`${SEL} max-w-[260px]`}>
                {KHOI.map((k) => (
                  <optgroup key={k} label={`Khối ${k}`}>
                    {PEOPLE.filter((x) => x.khoi === k).map((x) => (
                      <option key={x.code} value={x.code}>
                        {x.code} · {x.name} · {x.level} {x.job}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </FilterCell>
            <FilterCell label="Dự án nhận *">
              <select value={trForm.toProject} onChange={(e) => setTrForm({ ...trForm, toProject: e.target.value })} className={`${SEL} max-w-[280px]`}>
                <option value="">— chọn —</option>
                {projects
                  .filter((p) => p.khoi !== formPerson?.khoi)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} · {p.name}
                    </option>
                  ))}
              </select>
            </FilterCell>
            <FilterCell label="% *">
              <input type="number" step={10} min={10} max={100} value={trForm.pct} onChange={(e) => setTrForm({ ...trForm, pct: Math.max(10, Math.min(100, Math.round(Number(e.target.value) / 10) * 10)) })} className={`${SEL} w-16 text-right`} />
            </FilterCell>
            <FilterCell label="Từ – đến *">
              <input type="date" value={trForm.from} onChange={(e) => setTrForm({ ...trForm, from: e.target.value })} className={`${SEL} px-1`} />
              <input type="date" value={trForm.to} onChange={(e) => setTrForm({ ...trForm, to: e.target.value })} className={`${SEL} px-1 ${trForm.to < trForm.from ? 'border-rose-400' : ''}`} />
            </FilterCell>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5">
            <FilterCell label="Lý do *">
              <input value={trForm.reason} onChange={(e) => setTrForm({ ...trForm, reason: e.target.value })} placeholder="Bắt buộc — vd: thiếu Senior .NET cho R3" className={`${SEL} w-[360px] ${!trForm.reason.trim() ? 'border-rose-300' : ''}`} />
            </FilterCell>
            {formPerson && (
              <span className="text-slate-600">
                Allocation hiện tại:{' '}
                {NEXT_WEEKS.slice(0, 6).map((w) => (
                  <span key={w} title={`W${weekNo(w)}`} className={`inline-block min-w-[30px] text-center mx-px px-1 rounded-[2px] text-[11px] tabular-nums ${heatCls(allocSum(formPerson.code, w))}`}>
                    {allocSum(formPerson.code, w)}
                  </span>
                ))}
                <span className="ml-1 text-slate-500">(6 tuần tới) · khối gốc {formPerson.khoi} · rate {fmtVnd(rateOf(formPerson.khoi, formPerson.level))}/h</span>
              </span>
            )}
            {formOver.length > 0 && <span className="text-amber-700">Lưu ý: {formOver.length} tuần sẽ vượt 100% — GĐK khối cho phải giảm allocation trước khi duyệt.</span>}
            <span className="ml-auto inline-flex gap-1">
              <Btn variant="primary" className="h-7 px-2.5" icon={Check} disabled={!trForm.reason.trim() || !trForm.toProject || trForm.to < trForm.from} onClick={createTr}>
                Gửi duyệt
              </Btn>
              <Btn className="h-7 px-2.5" onClick={() => setTrForm(null)}>
                Huỷ
              </Btn>
            </span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className={`${erp.table} min-w-[1250px]`}>
          <thead>
            <tr>
              <th className={`${erp.th} border-t-0 border-l-0 w-8`} />
              <th className={`${erp.th} border-t-0 w-20`}>Mã</th>
              <th className={`${erp.th} border-t-0 text-left`}>Người</th>
              <th className={`${erp.th} border-t-0 text-left`}>Khối cho → Dự án nhận</th>
              <th className={`${erp.th} border-t-0 text-right w-14`}>%</th>
              <th className={`${erp.th} border-t-0 w-44`}>Từ – đến</th>
              <th className={`${erp.th} border-t-0 text-left`}>Lý do</th>
              <th className={`${erp.th} border-t-0 w-28`}>Trạng thái</th>
              <th className={`${erp.th} border-t-0 w-64`}>Bước duyệt</th>
              <th className={`${erp.th} border-t-0 border-r-0 w-48`}>Quyết định</th>
            </tr>
          </thead>
          <tbody>
            {trRows.map((t) => {
              const person = personByCode(t.person);
              const toP = projectOf(t.toProject);
              const isOpen = openTr === t.id;
              const pending = t.status === 'Chờ GĐK cho' || t.status === 'Chờ GĐK nhận';
              const clock = stepClock(t);
              const overdue = pending && clock.wd > SLA_DAYS;
              const dueSoon = t.status === 'Đã duyệt' && workDays(TODAY, t.to) <= 22;
              const rejecting = rejectTr === t.id;
              const curStep = t.status === 'Chờ GĐK cho' ? 0 : t.status === 'Chờ GĐK nhận' ? 1 : 2;
              const steps = [`GĐK ${t.fromKhoi} (cho)`, `GĐK ${toP?.khoi} (nhận)`];
              const err = trErr[t.id];
              const sixWeeks = NEXT_WEEKS.slice(0, 6);
              const inRange = new Set(weeksInRange(t.from, t.to));
              const projIds = [...new Set(sixWeeks.flatMap((w) => allocCells(t.person, w).map((c) => c.projectId)))];
              const srcProjects = projIds.map(projectOf).filter((p) => p && p.khoi === t.fromKhoi);
              return (
                <React.Fragment key={t.id}>
                  <tr className={`cursor-pointer ${isOpen ? 'bg-[#eaf2fc]' : rejecting ? 'bg-[#fff5f5]' : erp.tr}`} onClick={() => setOpenTr(isOpen ? null : t.id)}>
                    <td className={`${erp.td} border-l-0 text-center text-slate-500`}>{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</td>
                    <td className={`${erp.td} ${erp.code}`}>{t.id}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      <b className="text-slate-800">{person?.name}</b> <span className="text-[11px] text-slate-500 font-mono">{t.person}</span>
                      <span className="block text-[11px] text-slate-500">
                        {person?.level} {person?.job} · {person?.skill}
                      </span>
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      <b>{t.fromKhoi}</b> → <span className={erp.code}>{t.toProject}</span> <span className="text-[11px] text-slate-500">({toP?.khoi})</span>
                      <span className="block text-[11px] text-slate-600">{toP?.name}</span>
                    </td>
                    <td className={`${erp.td} ${erp.num}`}>{t.pct}%</td>
                    <td className={`${erp.td} text-center tabular-nums whitespace-nowrap`}>
                      {dmy(t.from)} – {dmy(t.to)}
                      {dueSoon && <span className="block text-[10.5px] font-semibold text-amber-700">sắp đến hạn</span>}
                    </td>
                    <td className={`${erp.td} text-[12px]`}>{t.reason}</td>
                    <td className={`${erp.td} text-center`}>
                      <Tag cls={TR_CLS[t.status]}>{t.status}</Tag>
                    </td>
                    <td className={erp.td}>
                      <div className="flex items-center gap-1">
                        {steps.map((s, i) => {
                          const done = i < curStep && !(t.status === 'Từ chối' && i >= t.steps.length - 1);
                          const rejected = t.status === 'Từ chối' && i === t.steps.length - 1;
                          const cur = i === curStep && pending;
                          return (
                            <React.Fragment key={i}>
                              {i > 0 && <span className="w-3 h-px bg-slate-300" />}
                              <span
                                className={`inline-flex items-center gap-1 px-1.5 h-5 rounded-[3px] border text-[10.5px] font-semibold whitespace-nowrap ${
                                  rejected
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : done || t.status === 'Đã duyệt' || t.status === 'Đã trả người'
                                      ? 'bg-emerald-600 text-white border-emerald-600'
                                      : cur
                                        ? overdue
                                          ? 'bg-rose-600 text-white border-rose-600'
                                          : 'bg-[#1f5fa8] text-white border-[#1f5fa8]'
                                        : 'bg-slate-100 text-slate-500 border-slate-200'
                                }`}
                              >
                                {i + 1}. {s}
                              </span>
                            </React.Fragment>
                          );
                        })}
                      </div>
                      {pending && (
                        <span className={`block text-[10.5px] mt-0.5 tabular-nums ${overdue ? 'text-rose-700 font-semibold' : clock.wd === SLA_DAYS ? 'text-amber-700' : 'text-slate-500'}`}>
                          SLA {clock.wd}/{SLA_DAYS} ngày LV{overdue ? ' · quá hạn — đã nhắc, cảnh báo TCT' : ''}
                        </span>
                      )}
                    </td>
                    <td className={`${erp.td} border-r-0 text-center`} onClick={(e) => e.stopPropagation()}>
                      {pending ? (
                        rejecting ? (
                          <div className="flex flex-col gap-1">
                            <input
                              autoFocus
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              onKeyDown={(e) => (e.key === 'Enter' ? rejectTransfer(t) : e.key === 'Escape' ? setRejectTr(null) : null)}
                              placeholder="Lý do từ chối *"
                              className={`${SEL} w-full ${!reason.trim() ? 'border-rose-300' : ''}`}
                            />
                            <div className="flex gap-1 justify-center">
                              <Btn variant="danger" className="h-6! px-2! text-[11px]!" disabled={!reason.trim()} onClick={() => rejectTransfer(t)}>
                                Xác nhận từ chối
                              </Btn>
                              <Btn className="h-6! px-2! text-[11px]!" onClick={() => setRejectTr(null)}>
                                Huỷ
                              </Btn>
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex gap-1">
                            <Btn variant="success" className="h-7 px-2.5" icon={Check} onClick={() => (approveTr(t), setOpenTr(t.id))} title={`Duyệt bước ${curStep + 1}: ${steps[curStep]}`}>
                              Duyệt
                            </Btn>
                            <Btn variant="danger" className="h-7 px-2.5" icon={X} onClick={() => (setRejectTr(t.id), setReason(''))}>
                              Từ chối
                            </Btn>
                          </span>
                        )
                      ) : dueSoon ? (
                        <span className="inline-flex gap-1">
                          <Btn className="h-7 px-2" onClick={() => extend(t)}>
                            Gia hạn
                          </Btn>
                          <Btn className="h-7 px-2" onClick={() => giveBack(t)}>
                            Trả người
                          </Btn>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>
                  </tr>
                  {(isOpen || err) && (
                    <tr>
                      <td colSpan={10} className="border border-slate-300 border-l-0 border-r-0 bg-[#f7fafd] p-2" onClick={(e) => e.stopPropagation()}>
                        {err && (
                          <div className="flex flex-wrap items-center gap-2 mb-2 px-2 py-1.5 border border-rose-200 bg-rose-50 text-rose-700 text-[12px] rounded-[3px]">
                            <b>{err}</b>
                            <Btn className="h-6! px-2! text-[11px]!" onClick={() => freeUp(t)}>
                              Giảm allocation dự án khối {t.fromKhoi} −{t.pct}%
                            </Btn>
                            <Btn className="h-6! px-2! text-[11px]!" onClick={() => onNavigate?.('Heatmap allocation')}>
                              Mở Heatmap allocation
                            </Btn>
                          </div>
                        )}
                        {isOpen && (
                          <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr_1fr] gap-2">
                            {/* Allocation 6 tuần */}
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold uppercase tracking-wide text-[#1e3a5f] mb-1">Allocation hiện tại · 6 tuần</p>
                              <div className="overflow-x-auto">
                                <table className={`${erp.table} bg-white`}>
                                  <thead>
                                    <tr>
                                      <th className={`${erp.th} text-left`}>Dự án</th>
                                      {sixWeeks.map((w) => (
                                        <th key={w} className={`${erp.th} text-center px-1 ${inRange.has(w) ? 'bg-[#d6e4f5]' : ''}`}>
                                          W{weekNo(w)}
                                          <span className="block text-[10px] font-normal text-slate-500">{weekLabel(w)}</span>
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {projIds.map((pid) => (
                                      <tr key={pid} className={erp.tr}>
                                        <td className={`${erp.td} whitespace-nowrap`}>
                                          <span className={erp.code}>{pid}</span>
                                        </td>
                                        {sixWeeks.map((w) => (
                                          <td key={w} className={`${erp.td} ${erp.num} px-1`}>
                                            {allocCells(t.person, w).find((c) => c.projectId === pid)?.pct || ''}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                    <tr className={erp.totalRow}>
                                      <td className={erp.td}>Tổng hiện tại</td>
                                      {sixWeeks.map((w) => (
                                        <td key={w} className={`${erp.td} text-center px-1 ${heatCls(allocSum(t.person, w))}`}>
                                          {allocSum(t.person, w)}%
                                        </td>
                                      ))}
                                    </tr>
                                    {pending && (
                                      <tr>
                                        <td className={`${erp.td} text-[11.5px] font-semibold`}>Sau điều chuyển</td>
                                        {sixWeeks.map((w) => {
                                          const v = allocSum(t.person, w) + (inRange.has(w) ? t.pct : 0);
                                          return (
                                            <td key={w} className={`${erp.td} text-center px-1 text-[11.5px] ${heatCls(v)}`}>
                                              {v}%
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            {/* Tác động lên dự án khối cho */}
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold uppercase tracking-wide text-[#1e3a5f] mb-1">Tác động lên dự án khối {t.fromKhoi}</p>
                              {srcProjects.length ? (
                                <table className={`${erp.table} bg-white`}>
                                  <thead>
                                    <tr>
                                      <th className={`${erp.th} text-left`}>Dự án</th>
                                      <th className={erp.th}>Health</th>
                                      <th className={`${erp.th} text-right`}>% của người</th>
                                      <th className={`${erp.th} text-right`}>Team</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {srcProjects.map((p) => {
                                      const d = projectDetail(p!);
                                      const mine = allocCells(t.person, NEXT_WEEKS[0]).find((c) => c.projectId === p!.id)?.pct || 0;
                                      const teamFte = d.team.reduce((s, m) => s + m.pct, 0) / 100;
                                      return (
                                        <tr key={p!.id} className={erp.tr}>
                                          <td className={erp.td}>
                                            <span className={erp.code}>{p!.id}</span>
                                            <span className="block text-[11px] text-slate-600">{p!.name}</span>
                                          </td>
                                          <td className={`${erp.td} text-center`}>
                                            <HealthBadge h={p!.health} small />
                                          </td>
                                          <td className={`${erp.td} ${erp.num}`}>{mine}%</td>
                                          <td className={`${erp.td} ${erp.num} text-[11.5px]`}>
                                            {teamFte.toFixed(1)} FTE
                                            <span className={`block ${mine / 100 / Math.max(teamFte, 0.1) > 0.25 ? 'text-rose-700 font-semibold' : 'text-slate-500'}`}>
                                              −{((mine / 100 / Math.max(teamFte, 0.1)) * 100).toFixed(0)}% nếu rút hết
                                            </span>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="text-[12px] text-slate-500 italic">Người này không còn allocation ở dự án khối {t.fromKhoi} trong 6 tuần tới.</p>
                              )}
                              <p className="text-[11px] text-slate-500 mt-1">
                                Cost tính vào {t.toProject} với rate khối gốc {t.fromKhoi}: {person ? fmtVnd(rateOf(t.fromKhoi, person.level)) : '—'}/h · ≈{' '}
                                {person ? fmtVnd(rateOf(t.fromKhoi, person.level) * 40 * (t.pct / 100)) : '—'}/tuần.
                              </p>
                            </div>
                            {/* Lịch sử duyệt */}
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold uppercase tracking-wide text-[#1e3a5f] mb-1">Lịch sử bước duyệt</p>
                              <ol className="bg-white border border-slate-200 rounded-[3px] divide-y divide-slate-100 text-[12px]">
                                <li className="px-2 py-1.5">
                                  <span className="tabular-nums text-slate-500">{dmy(t.createdAt)}</span> · Tạo đề xuất <span className="text-slate-500">— lý do: {t.reason}</span>
                                </li>
                                {t.steps.map((s, i) => (
                                  <li key={i} className="px-2 py-1.5">
                                    <span className="tabular-nums text-slate-500">{dmy(s.at)}</span> · <b>{s.step}</b> · {s.by}:{' '}
                                    <span className={s.decision.startsWith('Từ chối') ? 'text-rose-700 font-semibold' : 'text-emerald-700 font-semibold'}>{s.decision}</span>
                                  </li>
                                ))}
                                {pending && (
                                  <li className={`px-2 py-1.5 ${overdue ? 'text-rose-700' : 'text-amber-700'}`}>
                                    Đang chờ {steps[curStep]} từ {dmy(clock.start)} ({clock.wd}/{SLA_DAYS} ngày LV)
                                  </li>
                                )}
                                {t.status === 'Đã trả người' && <li className="px-2 py-1.5 text-slate-600">{dmy(t.to)} · Trả người về khối {t.fromKhoi}</li>}
                              </ol>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );

  const statTotals = (() => {
    const rowT: Record<string, { n: number; pm: number }> = {};
    const colT: Record<string, { n: number; pm: number }> = {};
    let all = { n: 0, pm: 0 };
    KHOI.forEach((a) =>
      KHOI.forEach((b) => {
        const c = matrix[a]?.[b];
        if (!c) return;
        rowT[a] = { n: (rowT[a]?.n || 0) + c.n, pm: (rowT[a]?.pm || 0) + c.pm };
        colT[b] = { n: (colT[b]?.n || 0) + c.n, pm: (colT[b]?.pm || 0) + c.pm };
        all = { n: all.n + c.n, pm: all.pm + c.pm };
      }),
    );
    return { rowT, colT, all };
  })();
  const maxPm = Math.max(0.1, ...KHOI.flatMap((a) => KHOI.map((b) => matrix[a]?.[b]?.pm || 0)));
  const cellTxt = (c?: { n: number; pm: number }) =>
    c ? (
      <>
        <b>{c.n}</b> <span className="text-[11px] text-slate-500">lượt</span>
        <span className="block text-[11px]">{c.pm.toFixed(1)} ng-th</span>
      </>
    ) : (
      <span className="text-slate-300">—</span>
    );

  const statPanel = (
    <Panel
      title="Thống kê điều chuyển giữa các khối"
      icon={BarChart3}
      noPad
      actions={
        <FilterCell label="Quý">
          <select value={quarter} onChange={(e) => setQuarter(e.target.value)} className={SEL}>
            {QUARTERS.map((q) => (
              <option key={q} value={q}>
                {q.replace('-', ' · ')}
              </option>
            ))}
          </select>
        </FilterCell>
      }
      footer="Tính từ điều chuyển đã duyệt hoặc đã trả người, có thời gian giao với quý. Người-tháng = số ngày trong quý / 30 × %. Hàng = khối cho, cột = khối nhận (khối của dự án nhận)."
    >
      <div className="overflow-x-auto">
        <table className={`${erp.table} min-w-[900px]`}>
          <thead>
            <tr>
              <th className={`${erp.th} border-t-0 border-l-0 text-left w-32`}>Cho \ Nhận</th>
              {KHOI.map((k) => (
                <th key={k} className={`${erp.th} border-t-0 text-center`}>
                  {k}
                </th>
              ))}
              <th className={`${erp.th} border-t-0 border-r-0 text-center`}>Tổng cho đi</th>
            </tr>
          </thead>
          <tbody>
            {KHOI.map((a) => (
              <tr key={a} className={erp.tr}>
                <td className={`${erp.td} border-l-0 font-bold text-[#1e3a5f]`}>{a}</td>
                {KHOI.map((b) => {
                  const c = matrix[a]?.[b];
                  const shade = c ? Math.min(1, c.pm / maxPm) : 0;
                  return (
                    <td key={b} className={`${erp.td} text-center tabular-nums ${a === b ? 'bg-slate-100' : ''}`} style={c ? { backgroundColor: `rgba(31,95,168,${0.06 + shade * 0.22})` } : undefined}>
                      {a === b ? <span className="text-slate-300">·</span> : cellTxt(c)}
                    </td>
                  );
                })}
                <td className={`${erp.td} border-r-0 text-center tabular-nums bg-[#fff6d6]`}>{cellTxt(statTotals.rowT[a])}</td>
              </tr>
            ))}
            <tr className={erp.totalRow}>
              <td className={`${erp.td} border-l-0`}>Tổng nhận</td>
              {KHOI.map((b) => (
                <td key={b} className={`${erp.td} text-center`}>
                  {cellTxt(statTotals.colT[b])}
                </td>
              ))}
              <td className={`${erp.td} border-r-0 text-center`}>{cellTxt(statTotals.all.n ? statTotals.all : undefined)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Panel>
  );

  void ver;

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', 'Nguồn lực', 'Yêu cầu & điều chuyển']}
        title="Yêu cầu nguồn lực & điều chuyển liên khối"
        actions={<RoleSelect value={role} onChange={setRole} />}
        meta={[
          { label: 'Yêu cầu chờ GĐSX', value: <span className={pendingReq ? 'text-amber-700' : ''}>{pendingReq}</span> },
          { label: 'Điều chuyển chờ duyệt', value: pendingTr.length },
          { label: 'Quá SLA', value: <span className={pendingTr.some((t) => stepClock(t).wd > SLA_DAYS) ? 'text-rose-700' : ''}>{pendingTr.filter((t) => stepClock(t).wd > SLA_DAYS).length}</span> },
          { label: 'Đang điều chuyển', value: trs.filter((t) => t.status === 'Đã duyệt').length },
        ]}
      />
      <div>
        <FolderTabs<TabKey>
          tabs={[
            { key: 'req', label: `Yêu cầu nguồn lực${pendingReq ? ` (${pendingReq})` : ''}`, icon: UserPlus },
            { key: 'tr', label: `Điều chuyển liên khối${pendingTr.length ? ` (${pendingTr.length})` : ''}`, icon: ArrowRightLeft },
            { key: 'stat', label: 'Thống kê điều chuyển', icon: BarChart3 },
          ]}
          value={tab}
          onChange={setTab}
        />
        <div className="pt-3">{tab === 'req' ? reqTable : tab === 'tr' ? trTable : statPanel}</div>
      </div>
    </ErpPage>
  );
};
