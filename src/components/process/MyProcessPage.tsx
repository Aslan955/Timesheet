/**
 * MyProcessPage — Phân hệ "Quy trình" › Quy trình của tôi (góc nhìn NGƯỜI DÙNG).
 *  - Danh sách: Cần tôi xử lý · Tôi đã tạo · Tôi đã xử lý · Tôi liên quan · Nháp; lọc, tìm, hạn xử lý, duyệt nhanh.
 *  - Tạo quy trình: chọn quy trình đã được thiết lập (theo phân quyền) → điền biểu mẫu bước 1 → chọn người xử lý bước 2 → Gửi / Lưu nháp.
 *  - Chi tiết: tiến trình các bước, dữ liệu từng bước, người xử lý bước hiện tại điền trường của bước + ý kiến,
 *    chọn người xử lý bước kế tiếp, Phê duyệt / Từ chối; người tạo thu hồi / tạo lại; lịch sử xử lý.
 */
import React, { useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowRight, Check, CheckCircle2, CircleDot, Clock, Eye, FilePlus2, Inbox, ListChecks, Plus, RotateCcw, Save, Search, Send, Undo2, UserRound, Users, X, XCircle, Zap,
} from 'lucide-react';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, KpiBox, Panel, Tag, erp } from '../erp/Erp';
import { PROC_GROUPS, PROC_PEOPLE, useProcesses, type Process } from './processStore';
import {
  REQ_STATUS, UNIT_OF, approveStep, canUse, currentRun, getRequests, isOverdue, newRequest, nextReqCode, recallRequest, rejectStep, saveRequest, setUser, submitRequest, updateRequests, useRequests, useUser,
  type FieldValue, type ProcRequest,
} from './requestStore';
import { FieldInput, FieldView, autoCodeOf, fieldError, formulaValue, hiddenByDep, initialValue, type FormCtx } from './FieldInput';
import { RUN_SOURCES } from './processStore';
import { ProcIcon } from './ProcIcon';

const CRUMBS = ['Quy trình', 'Quy trình của tôi'];
type Mode = { kind: 'list' } | { kind: 'pick' } | { kind: 'form'; id: string } | { kind: 'detail'; id: string };
type TabKey = 'todo' | 'mine' | 'done' | 'related' | 'draft';

const fmt = (iso: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};
const fmtD = (iso: string | null) => (iso ? fmt(iso).slice(0, 10) : '—');
const left = (iso: string | null) => {
  if (!iso) return null;
  const h = Math.round((new Date(iso).getTime() - Date.now()) / 3600000);
  return h;
};
const leftText = (iso: string | null) => {
  const h = left(iso);
  if (h === null) return 'Không giới hạn';
  if (h < 0) return `Quá hạn ${Math.ceil(-h / 24)} ngày`;
  if (h < 24) return `Còn ${Math.max(1, h)} giờ`;
  return `Còn ${Math.ceil(h / 24)} ngày`;
};
const sel = `${erp.inputFull}`;

/** Chọn người dùng (prototype) */
const UserSwitch: React.FC = () => {
  const u = useUser();
  return (
    <span className="flex items-center gap-1.5 text-[12px] text-slate-600" title="Bản prototype: đổi tài khoản để thử vai người tạo / người duyệt">
      <UserRound size={14} className="text-slate-400" />
      Đang dùng với tài khoản
      <select value={u} onChange={(e) => setUser(e.target.value)} className={`${erp.input} h-7 w-48 font-semibold text-[#1f5fa8]`} data-testid="user-switch">
        {PROC_PEOPLE.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>
    </span>
  );
};

/** Tiến trình các bước (dạng chấm) */
const Progress: React.FC<{ r: ProcRequest }> = ({ r }) => (
  <span className="flex items-center gap-0.5">
    {r.runs.map((x, i) => (
      <span
        key={i}
        title={`${i + 1}. ${x.name}${x.assignee ? ` — ${x.assignee}` : ''}`}
        className={`h-1.5 w-4 rounded-full ${x.status === 'approved' ? 'bg-emerald-500' : x.status === 'rejected' ? 'bg-rose-500' : x.status === 'pending' ? (r.status === 'pending' ? 'bg-amber-400' : 'bg-slate-300') : 'bg-slate-200'}`}
      />
    ))}
  </span>
);

export const MyProcessPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>({ kind: 'list' });
  const [toast, setToast] = useState('');
  const flash = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(''), 3500);
  };
  return (
    <ErpPage>
      {toast && <div className="fixed top-4 right-4 z-[60] rounded-[4px] border border-[#184c88] bg-[#1e3a5f] text-white text-[12.5px] px-4 py-2.5 shadow-xl max-w-[520px]">{toast}</div>}
      {mode.kind === 'list' && <RequestList setMode={setMode} flash={flash} />}
      {mode.kind === 'pick' && <PickProcess setMode={setMode} />}
      {mode.kind === 'form' && <RequestForm key={mode.id} id={mode.id} setMode={setMode} flash={flash} />}
      {mode.kind === 'detail' && <RequestDetail key={mode.id} id={mode.id} setMode={setMode} flash={flash} />}
    </ErpPage>
  );
};

// ==========================================================================
// Danh sách
// ==========================================================================
const RequestList: React.FC<{ setMode: (m: Mode) => void; flash: (m: string) => void }> = ({ setMode, flash }) => {
  const reqs = useRequests();
  const user = useUser();
  const procs = useProcesses();
  const [tab, setTab] = useState<TabKey>('todo');
  const [q, setQ] = useState('');
  const [proc, setProc] = useState('');
  const [status, setStatus] = useState('');
  const [quick, setQuick] = useState<ProcRequest | null>(null);

  const todo = reqs.filter((r) => currentRun(r)?.assignee === user);
  const mine = reqs.filter((r) => r.creator === user && r.status !== 'draft');
  const done = reqs.filter((r) => r.creator !== user && r.runs.some((x, i) => i > 0 && x.assignee === user && (x.status === 'approved' || x.status === 'rejected')));
  const related = reqs.filter((r) => r.status !== 'draft' && r.related.includes(user) && r.creator !== user);
  const drafts = reqs.filter((r) => r.creator === user && r.status === 'draft');
  const sets: Record<TabKey, ProcRequest[]> = { todo, mine, done, related, draft: drafts };
  const rows = useMemo(() => {
    const n = q.trim().toLowerCase();
    return sets[tab]
      .filter((r) => !proc || r.processId === proc)
      .filter((r) => !status || (status === 'overdue' ? isOverdue(r) : r.status === status))
      .filter((r) => !n || `${r.code} ${r.title} ${r.processName} ${r.creator}`.toLowerCase().includes(n))
      .sort((a, b) => (b.submittedAt || b.createdAt).localeCompare(a.submittedAt || a.createdAt));
  }, [tab, reqs, user, q, proc, status]); // eslint-disable-line react-hooks/exhaustive-deps
  const overdue = todo.filter(isOverdue).length;

  const th = `${erp.th} border-t-0 text-left`;
  return (
    <>
      <ErpTitleBar
        crumbs={CRUMBS}
        title="Quy trình của tôi"
        actions={
          <>
            <UserSwitch />
            <Btn variant="primary" icon={Plus} onClick={() => setMode({ kind: 'pick' })} data-testid="new-request">
              Tạo quy trình
            </Btn>
          </>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiBox label="Cần tôi xử lý" value={todo.length} tone={todo.length ? 'bad' : 'neutral'} badge={overdue ? `${overdue} quá hạn` : undefined} sub="Đơn đang chờ bạn duyệt" onClick={() => setTab('todo')} active={tab === 'todo'} />
        <KpiBox label="Tôi đã tạo · đang xử lý" value={mine.filter((r) => r.status === 'pending').length} sub={`${mine.length} đơn đã gửi`} onClick={() => setTab('mine')} active={tab === 'mine'} />
        <KpiBox label="Đơn của tôi đã duyệt" value={mine.filter((r) => r.status === 'approved').length} tone="good" sub="Đã hoàn tất toàn bộ các bước" onClick={() => (setTab('mine'), setStatus('approved'))} />
        <KpiBox label="Bị từ chối / thu hồi" value={mine.filter((r) => r.status === 'rejected' || r.status === 'recalled').length} sub="Có thể tạo lại từ đơn cũ" onClick={() => (setTab('mine'), setStatus('rejected'))} />
      </div>

      <div className="bg-white border border-slate-300 rounded-[4px] overflow-hidden">
        <div className="pt-2 bg-[#f3f6fa]">
          <FolderTabs<TabKey>
            tabs={[
              { key: 'todo', label: `Cần tôi xử lý (${todo.length})`, icon: Inbox },
              { key: 'mine', label: `Tôi đã tạo (${mine.length})`, icon: Send },
              { key: 'done', label: `Tôi đã xử lý (${done.length})`, icon: CheckCircle2 },
              { key: 'related', label: `Tôi liên quan (${related.length})`, icon: Users },
              { key: 'draft', label: `Nháp (${drafts.length})`, icon: FilePlus2 },
            ]}
            value={tab}
            onChange={(k) => (setTab(k), setStatus(''))}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-slate-200 bg-[#fafbfd]">
          <div className="relative w-72">
            <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã đơn, tiêu đề, người tạo..." className={`${erp.inputFull} pl-7`} />
          </div>
          <select value={proc} onChange={(e) => setProc(e.target.value)} className={`${erp.input} w-60`}>
            <option value="">Tất cả quy trình</option>
            {procs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${erp.input} w-44`}>
            <option value="">Tất cả trạng thái</option>
            {(['pending', 'approved', 'rejected', 'recalled'] as const).map((s) => (
              <option key={s} value={s}>
                {REQ_STATUS[s].label}
              </option>
            ))}
            <option value="overdue">Quá hạn xử lý</option>
          </select>
          {(q || proc || status) && (
            <Btn icon={X} onClick={() => (setQ(''), setProc(''), setStatus(''))}>
              Bỏ lọc
            </Btn>
          )}
          <span className="ml-auto text-[12px] text-slate-500">{rows.length} đơn</span>
        </div>
        <div className="overflow-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${th} border-l-0 w-10 text-center`}>STT</th>
                <th className={th}>Mã đơn</th>
                <th className={th}>Tiêu đề / Quy trình</th>
                <th className={th}>Người tạo</th>
                <th className={th}>Ngày gửi</th>
                <th className={th}>Tiến độ</th>
                <th className={th}>Đang ở bước / Người xử lý</th>
                <th className={th}>Hạn xử lý</th>
                <th className={`${th} text-center`}>Trạng thái</th>
                <th className={`${th} border-r-0 text-center`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {!rows.length && (
                <tr>
                  <td colSpan={10} className={`${erp.td} text-center text-slate-500 py-10`}>
                    {tab === 'todo' ? 'Không có đơn nào đang chờ bạn xử lý.' : 'Không có đơn phù hợp.'}{' '}
                    {tab !== 'todo' && (
                      <button type="button" onClick={() => setMode({ kind: 'pick' })} className="text-[#1f5fa8] font-semibold hover:underline cursor-pointer">
                        Tạo quy trình
                      </button>
                    )}
                  </td>
                </tr>
              )}
              {rows.map((r, i) => {
                const run = currentRun(r);
                const od = isOverdue(r);
                const canQuick = run?.assignee === user && r.quickSteps.includes(run.stepId) && !run.def.fields.some((f) => f.required);
                return (
                  <tr key={r.id} className={`${erp.tr} cursor-pointer`} onClick={() => setMode(r.status === 'draft' ? { kind: 'form', id: r.id } : { kind: 'detail', id: r.id })}>
                    <td className={`${erp.td} border-l-0 text-center text-slate-500`}>{i + 1}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      <span className={erp.code}>{r.code}</span>
                    </td>
                    <td className={erp.td}>
                      <span className="flex items-center gap-2 min-w-[200px]">
                        <ProcIcon p={r} size={26} />
                        <span className="min-w-0">
                          <span className="block font-semibold text-slate-800 truncate max-w-[210px]" title={r.title}>{r.title || r.processName}</span>
                          <span className="block text-[11px] text-slate-500">{r.processName}</span>
                        </span>
                      </span>
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      {r.creator === user ? 'Bạn' : r.creator}
                      <span className="block text-[11px] text-slate-400 truncate max-w-[150px]">{UNIT_OF[r.creator]}</span>
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>{fmtD(r.submittedAt || r.createdAt)}</td>
                    <td className={erp.td}>
                      <Progress r={r} />
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        {r.runs.filter((x) => x.status === 'approved').length}/{r.runs.length} bước
                      </span>
                    </td>
                    <td className={erp.td}>
                      {run ? (
                        <>
                          <span className="block text-slate-800">
                            {r.current + 1}. {run.name}
                          </span>
                          <span className={`block text-[11.5px] ${run.assignee === user ? 'text-[#1f5fa8] font-semibold' : 'text-slate-500'}`}>{run.assignee === user ? 'Bạn' : run.assignee}</span>
                        </>
                      ) : r.status === 'draft' ? (
                        <span className="text-slate-400">Chưa gửi</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className={`${erp.td} whitespace-nowrap ${od ? 'text-rose-600 font-semibold' : ''}`}>
                      {run ? (
                        <>
                          {run.deadline ? fmtD(run.deadline) : '—'}
                          <span className={`block text-[11px] ${od ? 'text-rose-600' : 'text-slate-400'}`}>{leftText(run.deadline)}</span>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className={`${erp.td} text-center`}>
                      <Tag cls={REQ_STATUS[r.status].cls}>{REQ_STATUS[r.status].label}</Tag>
                    </td>
                    <td className={`${erp.td} border-r-0 text-center whitespace-nowrap`} onClick={(e) => e.stopPropagation()}>
                      <button type="button" onClick={() => setMode(r.status === 'draft' ? { kind: 'form', id: r.id } : { kind: 'detail', id: r.id })} className="p-1 rounded text-[#1f5fa8] hover:bg-[#eaf2fc] cursor-pointer" title={r.status === 'draft' ? 'Tiếp tục soạn' : 'Xem chi tiết'}>
                        <Eye size={14} />
                      </button>
                      {canQuick && (
                        <button type="button" onClick={() => setQuick(r)} className="ml-0.5 inline-flex items-center gap-1 h-6 px-2 rounded-[3px] bg-emerald-600 text-white text-[11.5px] font-semibold hover:bg-emerald-700 cursor-pointer" title="Duyệt nhanh">
                          <Zap size={12} /> Duyệt nhanh
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {quick && <QuickApprove r={quick} onClose={() => setQuick(null)} flash={flash} />}
    </>
  );
};

/** Duyệt nhanh trên danh sách (bước được cấu hình "Xử lý nhanh", không có trường bắt buộc). */
const QuickApprove: React.FC<{ r: ProcRequest; onClose: () => void; flash: (m: string) => void }> = ({ r, onClose, flash }) => {
  const user = useUser();
  const last = r.current === r.runs.length - 1;
  const [next, setNext] = useState('');
  const [comment, setComment] = useState('Đồng ý');
  const ok = last || !!next;
  const go = () => {
    if (!ok) return;
    saveRequest(approveStep(r, user, comment.trim(), {}, next || undefined));
    flash(last ? `Đã duyệt ${r.code} — đơn hoàn tất` : `Đã duyệt ${r.code} — chuyển ${next} xử lý bước ${r.current + 2}`);
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md bg-white rounded-[4px] border border-slate-300 shadow-2xl" data-testid="quick-approve">
        <div className="h-10 px-4 flex items-center gap-2 bg-[#1e3a5f] text-white font-bold text-[13px] rounded-t-[4px]">
          <Zap size={15} /> Duyệt nhanh {r.code}
          <button onClick={onClose} className="ml-auto p-1 rounded hover:bg-white/15 cursor-pointer">
            <X size={15} />
          </button>
        </div>
        <div className="p-4 space-y-3 text-[12.5px]">
          <p>
            <b>{r.title || r.processName}</b> — bước {r.current + 1}: {r.runs[r.current].name}
          </p>
          {!last && (
            <label className="block">
              <span className="text-slate-600">
                Người xử lý bước {r.current + 2}: {r.runs[r.current + 1].name} <span className="text-rose-600">*</span>
              </span>
              <select value={next} onChange={(e) => setNext(e.target.value)} className={`${sel} mt-1`}>
                <option value="">— Chọn người xử lý —</option>
                {PROC_PEOPLE.filter((p) => p !== user).map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
          )}
          <label className="block">
            <span className="text-slate-600">Ý kiến</span>
            <input value={comment} onChange={(e) => setComment(e.target.value)} className={`${sel} mt-1`} />
          </label>
        </div>
        <div className="px-4 py-3 border-t border-slate-200 flex justify-end gap-2">
          <Btn onClick={onClose}>Huỷ</Btn>
          <Btn variant="primary" icon={Check} disabled={!ok} onClick={go}>
            Phê duyệt
          </Btn>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// Chọn quy trình để tạo
// ==========================================================================
const PickProcess: React.FC<{ setMode: (m: Mode) => void }> = ({ setMode }) => {
  const procs = useProcesses();
  const user = useUser();
  const [q, setQ] = useState('');
  const usable = procs.filter((p) => canUse(p, user));
  const hidden = procs.filter((p) => p.active && !canUse(p, user)).length;
  const n = q.trim().toLowerCase();
  const shown = usable.filter((p) => !n || `${p.name} ${p.code} ${p.group} ${p.desc}`.toLowerCase().includes(n));
  const start = (p: Process) => {
    const r = newRequest(p, user, getRequests());
    r.title = p.name;
    saveRequest(r);
    setMode({ kind: 'form', id: r.id });
  };
  return (
    <>
      <ErpTitleBar onBack={() => setMode({ kind: 'list' })} title="Tạo quy trình — chọn quy trình" actions={<UserSwitch />} />
      <Panel
        title={`Quy trình bạn được sử dụng (${usable.length})`}
        icon={ListChecks}
        actions={
          <div className="relative w-64">
            <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm quy trình..." className={`${erp.inputFull} h-7 pl-7`} />
          </div>
        }
        footer={`Chỉ hiện quy trình đang áp dụng và được phân quyền cho bạn${hidden ? ` · ${hidden} quy trình khác không thuộc phạm vi của bạn` : ''}.`}
      >
        {PROC_GROUPS.filter((g) => shown.some((p) => p.group === g)).map((g) => (
          <div key={g} className="mb-4 last:mb-0">
            <div className="text-[11.5px] font-bold uppercase tracking-wide text-slate-500 mb-2">{g}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5">
              {shown
                .filter((p) => p.group === g)
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => start(p)}
                    className="group text-left rounded-[4px] border border-slate-300 bg-white p-3 hover:border-[#1f5fa8] hover:shadow-sm cursor-pointer flex gap-3"
                    data-testid="pick-process"
                  >
                    <ProcIcon p={p} size={38} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 truncate">{p.name}</span>
                        <span className={`${erp.code} text-[11px]`}>{p.code}</span>
                      </span>
                      {p.desc && <span className="block text-[11.5px] text-slate-500 line-clamp-2 mt-0.5">{p.desc}</span>}
                      <span className="block text-[11.5px] text-slate-600 mt-1.5 truncate">
                        {p.steps.map((s, i) => `${i + 1}. ${s.name}`).join(' › ')}
                      </span>
                    </span>
                    <ArrowRight size={16} className="self-center text-slate-300 group-hover:text-[#1f5fa8] shrink-0" />
                  </button>
                ))}
            </div>
          </div>
        ))}
        {!shown.length && <p className="text-center text-slate-500 py-8">Không có quy trình phù hợp.</p>}
      </Panel>
    </>
  );
};

// ==========================================================================
// Biểu mẫu tạo đơn (bước 1)
// ==========================================================================
const RequestForm: React.FC<{ id: string; setMode: (m: Mode) => void; flash: (m: string) => void }> = ({ id, setMode, flash }) => {
  const reqs = useRequests();
  const user = useUser();
  const orig = reqs.find((r) => r.id === id);
  const [r, setR] = useState<ProcRequest | undefined>(() => {
    if (!orig) return undefined;
    const x = structuredClone(orig);
    // giá trị khởi tạo: mặc định, người tạo, ngày hiện tại, số dòng bảng
    x.runs[0].def.fields.forEach((f) => {
      if (x.runs[0].data[f.id] !== undefined) return;
      const v = initialValue(f, x.creator);
      if (v !== undefined) x.runs[0].data[f.id] = v;
    });
    return x;
  });
  const [next, setNext] = useState(orig?.runs[1]?.assignee || '');
  const [tried, setTried] = useState(false);
  const [addRel, setAddRel] = useState('');
  if (!r) return <ErpTitleBar onBack={() => setMode({ kind: 'list' })} title="Đơn không còn tồn tại" />;
  const s1 = r.runs[0];
  const setData = (fid: string, v: FieldValue) => setR((x) => x && { ...x, runs: x.runs.map((y, i) => (i === 0 ? { ...y, data: { ...y.data, [fid]: v } } : y)) });
  const ctx: FormCtx = {
    fields: s1.def.fields,
    values: s1.data,
    set: (k, v) => setData(k, v),
    req: { ...r, unit: UNIT_OF[r.creator] },
    linked: reqs,
  };
  const visible = s1.def.fields.filter((f) => !hiddenByDep(f, ctx));
  const bad = visible.map((f) => [f, fieldError(f, s1.data[f.id] ?? '')] as const).filter(([, e]) => e);
  const errs: string[] = [];
  if (!r.title.trim()) errs.push('Nhập tiêu đề');
  if (bad.length) errs.push(bad.map(([f, e]) => `${f.label}: ${e}`).join('; '));
  if (r.runs.length > 1 && !next) errs.push(`Chọn người xử lý bước 2`);
  /** Chốt giá trị tự sinh / tự tính vào đơn: mã số tự sinh, công thức, dữ liệu lượt chạy. */
  const fill = (x: ProcRequest) => {
    const fx: FormCtx = { ...ctx, values: x.runs[0].data, req: { ...x, submittedAt: x.submittedAt || new Date().toISOString(), unit: UNIT_OF[x.creator] } };
    const auto: Record<string, FieldValue> = {};
    x.runs[0].def.fields.forEach((f) => {
      if (f.type === 'autoCode') auto[f.id] = autoCodeOf(f, x.code);
      if (f.type === 'formula') auto[f.id] = formulaValue(f, fx);
      if (f.type === 'runData') {
        const src = (f.cfg?.source || 'code') as string;
        const v = { code: x.code, creator: x.creator, creatorUnit: UNIT_OF[x.creator], createdAt: x.createdAt.slice(0, 10).split('-').reverse().join('/'), submittedAt: new Date().toISOString().slice(0, 10).split('-').reverse().join('/'), processName: x.processName, version: x.version }[src];
        auto[f.id] = v ?? RUN_SOURCES[0].label;
      }
    });
    const runs = x.runs.map((y, i) => (i === 0 ? { ...y, data: { ...y.data, ...auto } } : y));
    return { ...x, title: x.title.trim(), runs };
  };
  const saveDraft = () => {
    saveRequest({ ...r, title: r.title.trim(), runs: r.runs.map((y, i) => (i === 1 ? { ...y, assignee: next || null } : y)), history: [...r.history, { at: new Date().toISOString(), by: user, action: 'Lưu nháp' }] });
    flash(`Đã lưu nháp ${r.code}`);
    setMode({ kind: 'list' });
  };
  const send = () => {
    setTried(true);
    if (errs.length) return flash(`Chưa gửi được: ${errs[0]}`);
    const sent = r.runs.length > 1 ? submitRequest(fill(r), next) : { ...fill(r), status: 'approved' as const };
    saveRequest(sent);
    flash(`Đã gửi ${r.code} — ${next} nhận thông báo xử lý bước 2`);
    setMode({ kind: 'detail', id: r.id });
  };
  const cancel = () => {
    if (!orig?.submittedAt && orig?.status === 'draft' && orig.history.length === 1) updateRequests((l) => l.filter((x) => x.id !== r.id)); // bỏ đơn mới tạo chưa lưu nháp
    setMode({ kind: 'list' });
  };
  const others = PROC_PEOPLE.filter((p) => p !== user);
  return (
    <>
      <ErpTitleBar
        onBack={cancel}
        title={
          <span className="flex items-center gap-2">
            <ProcIcon p={r} size={26} /> Tạo quy trình: {r.processName} <span className={`${erp.code} text-[13px]`}>{r.code}</span>
          </span>
        }
        actions={
          <>
            <Btn onClick={cancel}>Huỷ</Btn>
            <Btn icon={Save} onClick={saveDraft}>
              Lưu nháp
            </Btn>
            <Btn variant="primary" icon={Send} onClick={send} data-testid="send-request">
              Gửi duyệt
            </Btn>
          </>
        }
        notice={
          tried && errs.length ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-[12.5px] text-rose-700">
              <AlertTriangle size={14} /> Chưa gửi được: {errs.join(' · ')}
            </div>
          ) : undefined
        }
      />
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-3 items-start">
        <Panel title={`Bước 1: ${s1.name} — thông tin đề nghị`} icon={FilePlus2} footer="Trường có dấu * là bắt buộc. Thông tin bước 1 được chuyển cho người xử lý các bước sau.">
          {s1.def.desc && <p className="mb-3 rounded-[3px] border border-[#cfe0f5] bg-[#f5f9ff] px-3 py-2 text-[12.5px] text-slate-700">{s1.def.desc}</p>}
          <div className="grid grid-cols-[180px_minmax(0,1fr)] gap-x-3 gap-y-3 items-start" data-testid="request-form">
            <span className="text-[12.5px] text-slate-600 pt-1.5">
              Tiêu đề <span className="text-rose-600">*</span>
            </span>
            <input value={r.title} onChange={(e) => setR({ ...r, title: e.target.value })} className={`${erp.inputFull} ${tried && !r.title.trim() ? '!border-rose-400' : ''}`} data-testid="req-title" />
            <span className="text-[12.5px] text-slate-600 pt-1.5">Người tạo</span>
            <span className="pt-1.5 text-[13px]">
              <b>{r.creator}</b> <span className="text-slate-500">· {UNIT_OF[r.creator]}</span>
            </span>
            {visible.map((f) => {
              const e = tried ? fieldError(f, s1.data[f.id] ?? '') : '';
              return (
                <React.Fragment key={f.id}>
                  <span className="text-[12.5px] text-slate-600 pt-1.5 leading-tight">
                    {f.label} {f.required && !['formula', 'autoCode', 'runData'].includes(f.type) && <span className="text-rose-600">*</span>}
                  </span>
                  <span className="min-w-0" data-field={f.label}>
                    <FieldInput f={f} v={s1.data[f.id] ?? ''} onChange={(v) => setData(f.id, v)} ctx={ctx} invalid={!!e} />
                    {e && <span className="block text-[11.5px] text-rose-600 mt-0.5">{e}</span>}
                    {f.hint && !['text', 'textarea', 'number', 'email'].includes(f.type) && <span className="block text-[11px] text-slate-400 mt-0.5">{f.hint}</span>}
                  </span>
                </React.Fragment>
              );
            })}
            {!s1.def.fields.length && <span className="col-span-2 text-[12.5px] text-slate-500">Quy trình chưa có trường thông tin ở bước 1 — chỉ cần tiêu đề và chọn người xử lý.</span>}
          </div>
        </Panel>

        <div className="space-y-3">
          <Panel title="Luồng phê duyệt" icon={ListChecks}>
            <ol className="relative space-y-3">
              <span className="absolute left-[11px] top-3 bottom-3 w-px bg-slate-200" />
              {r.runs.map((x, i) => (
                <li key={i} className="relative flex gap-2.5">
                  <span className={`relative z-[1] w-6 h-6 shrink-0 rounded-full text-[11px] font-bold flex items-center justify-center ${i === 0 ? 'bg-[#1f5fa8] text-white' : 'bg-white border border-slate-300 text-slate-600'}`}>{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-semibold text-slate-800">{x.name}</span>
                    {i === 0 ? (
                      <span className="block text-[11.5px] text-slate-500">Bạn — người tạo</span>
                    ) : i === 1 ? (
                      <span className="block mt-1">
                        <select value={next} onChange={(e) => setNext(e.target.value)} className={`${erp.inputFull} h-7 text-[12px] ${tried && !next ? '!border-rose-400' : ''}`} data-testid="next-assignee">
                          <option value="">— Chọn người xử lý * —</option>
                          {others.map((p) => (
                            <option key={p}>{p}</option>
                          ))}
                        </select>
                      </span>
                    ) : (
                      <span className="block text-[11.5px] text-slate-400">Do người xử lý bước {i} chọn</span>
                    )}
                    {i > 0 && <span className="block text-[11px] text-slate-400 mt-0.5">Hạn xử lý: {x.def.deadlineDays ? `${x.def.deadlineDays} ngày` : 'không giới hạn'}</span>}
                  </span>
                </li>
              ))}
            </ol>
            {r.unlimitedSteps && <p className="mt-3 text-[11.5px] text-amber-700">Quy trình không giới hạn bước: người xử lý bước cuối có thể chuyển tiếp thêm người.</p>}
          </Panel>
          <Panel title="Người liên quan" icon={Users} footer="Người liên quan nhận thông báo và xem được đơn.">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {r.related.map((p) => (
                <span key={p} className="inline-flex items-center gap-1 rounded-full bg-[#e8f1fb] text-[#1f5fa8] text-[12px] pl-2.5 pr-1 py-0.5">
                  {p}
                  <button type="button" onClick={() => setR({ ...r, related: r.related.filter((x) => x !== p) })} className="p-0.5 rounded-full hover:bg-white cursor-pointer">
                    <X size={11} />
                  </button>
                </span>
              ))}
              {!r.related.length && <span className="text-[12px] text-slate-400">Chưa có</span>}
            </div>
            <select value={addRel} onChange={(e) => (e.target.value && setR({ ...r, related: [...r.related, e.target.value] }), setAddRel(''))} className={`${erp.inputFull} h-7 text-[12px]`}>
              <option value="">+ Thêm người liên quan</option>
              {others.filter((p) => !r.related.includes(p)).map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Panel>
        </div>
      </div>
    </>
  );
};

// ==========================================================================
// Chi tiết đơn + xử lý
// ==========================================================================
const RUN_ICON = { approved: CheckCircle2, rejected: XCircle, pending: CircleDot, waiting: Clock, skipped: Undo2 };
const RUN_CLS = { approved: 'text-emerald-600', rejected: 'text-rose-600', pending: 'text-amber-500', waiting: 'text-slate-300', skipped: 'text-slate-400' };

const RequestDetail: React.FC<{ id: string; setMode: (m: Mode) => void; flash: (m: string) => void }> = ({ id, setMode, flash }) => {
  const reqs = useRequests();
  const procs = useProcesses();
  const user = useUser();
  const r = reqs.find((x) => x.id === id);
  const [data, setData] = useState<Record<string, FieldValue>>({});
  const [comment, setComment] = useState('');
  const [next, setNext] = useState('');
  const [forward, setForward] = useState('');
  const [tried, setTried] = useState<'' | 'approve' | 'reject'>('');
  const [recall, setRecall] = useState(false);
  if (!r) return <ErpTitleBar onBack={() => setMode({ kind: 'list' })} title="Đơn không còn tồn tại" />;
  const run = currentRun(r);
  const mine = run?.assignee === user;
  const last = r.current === r.runs.length - 1;
  const allValues = Object.assign({}, ...r.runs.map((x) => x.data), data) as Record<string, FieldValue>;
  const allFields = r.runs.flatMap((x) => x.def.fields);
  const ctxOf = (fields = allFields): FormCtx => ({ fields, values: allValues, set: (k, v) => setData((d) => ({ ...d, [k]: v })), req: { ...r, unit: UNIT_OF[r.creator] }, linked: reqs });
  const actCtx = ctxOf();
  const actFields = mine ? run!.def.fields.filter((f) => !hiddenByDep(f, actCtx)) : [];
  const missing = actFields.filter((f) => fieldError(f, data[f.id] ?? run!.data[f.id] ?? ''));
  const canSee = r.creator === user || r.related.includes(user) || r.runs.some((x) => x.assignee === user);

  const approve = () => {
    setTried('approve');
    if (missing.length || (!last && !next)) return flash(missing.length ? `Nhập ${missing.map((f) => f.label).join(', ')}` : `Chọn người xử lý bước ${r.current + 2}`);
    const fixed: Record<string, FieldValue> = { ...data };
    run!.def.fields.forEach((f) => f.type === 'formula' && (fixed[f.id] = formulaValue(f, actCtx)));
    const n = approveStep(r, user, comment.trim(), fixed, next || undefined, forward || undefined);
    saveRequest(n);
    flash(n.status === 'approved' ? `Đã phê duyệt — ${r.code} hoàn tất` : `Đã phê duyệt — chuyển ${n.runs[n.current].assignee} xử lý bước ${n.current + 1}`);
    setMode({ kind: 'list' });
  };
  const reject = () => {
    setTried('reject');
    if (!comment.trim()) return flash('Nhập ý kiến (lý do từ chối)');
    saveRequest(rejectStep(r, user, comment.trim(), data));
    flash(`Đã từ chối ${r.code} — người tạo nhận thông báo`);
    setMode({ kind: 'list' });
  };
  const doRecall = () => {
    saveRequest(recallRequest(r, comment.trim()));
    flash(`Đã thu hồi ${r.code}`);
    setRecall(false);
  };
  const recreate = () => {
    const p = procs.find((x) => x.id === r.processId);
    if (!p || !p.active) return flash('Quy trình đã ngừng áp dụng — không tạo lại được');
    const n = newRequest(p, user, getRequests());
    n.title = r.title;
    n.code = nextReqCode(p, getRequests());
    // giữ dữ liệu bước 1 cho các trường còn trong quy trình
    n.runs[0].data = Object.fromEntries(n.runs[0].def.fields.map((f) => [f.id, r.runs[0].data[r.runs[0].def.fields.find((x) => x.label === f.label)?.id || ''] ?? '']).filter(([, v]) => v !== ''));
    n.related = [...r.related];
    n.history = [{ at: n.createdAt, by: user, action: `Tạo lại từ ${r.code}` }];
    saveRequest(n);
    setMode({ kind: 'form', id: n.id });
  };

  const S = REQ_STATUS[r.status];
  return (
    <>
      <ErpTitleBar
        onBack={() => setMode({ kind: 'list' })}
        title={
          <span className="flex items-center gap-2">
            <ProcIcon p={r} size={26} /> {r.title || r.processName} <span className={`${erp.code} text-[13px]`}>{r.code}</span> <Tag cls={S.cls}>{S.label}</Tag>
            {isOverdue(r) && <Tag cls="bg-rose-50 text-rose-700 border-rose-300">Quá hạn</Tag>}
          </span>
        }
        actions={
          <>
            <UserSwitch />
            {r.creator === user && r.status === 'pending' && (
              <Btn icon={Undo2} onClick={() => setRecall(true)}>
                Thu hồi
              </Btn>
            )}
            {r.creator === user && (r.status === 'rejected' || r.status === 'recalled') && (
              <Btn variant="primary" icon={RotateCcw} onClick={recreate}>
                Tạo lại
              </Btn>
            )}
          </>
        }
        meta={[
          { label: 'Quy trình', value: `${r.processName} (${r.processCode} · v${r.version})` },
          { label: 'Người tạo', value: `${r.creator} · ${UNIT_OF[r.creator]}` },
          { label: 'Ngày gửi', value: fmt(r.submittedAt) },
          { label: 'Bước hiện tại', value: run ? `${r.current + 1}/${r.runs.length}: ${run.name} — ${run.assignee}` : S.label },
        ]}
        notice={
          recall ? (
            <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-amber-50 text-[12.5px] text-amber-800">
              <span className="flex-1 min-w-[240px]">Thu hồi đơn {r.code}? Người đang xử lý sẽ không xử lý tiếp được; bạn có thể tạo lại từ đơn này.</span>
              <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Lý do (tuỳ chọn)" className={`${erp.input} h-7 w-64`} />
              <Btn className="h-7" onClick={() => setRecall(false)}>
                Không
              </Btn>
              <Btn variant="danger" className="h-7" onClick={doRecall}>
                Thu hồi
              </Btn>
            </div>
          ) : undefined
        }
      />

      {/* Tiến trình */}
      <div className="bg-white border border-slate-300 rounded-[4px] px-4 py-3 overflow-x-auto" data-testid="req-stepper">
        <ol className="flex items-start min-w-max">
          {r.runs.map((x, i) => {
            const I = RUN_ICON[x.status];
            const active = r.status === 'pending' && i === r.current;
            return (
              <li key={i} className="flex items-start">
                <div className={`w-[170px] text-center px-1 ${active ? '' : ''}`}>
                  <I size={22} className={`mx-auto ${RUN_CLS[x.status]} ${active ? 'animate-pulse' : ''}`} />
                  <div className={`mt-1 text-[12px] font-semibold ${active ? 'text-amber-700' : 'text-slate-800'}`}>
                    {i + 1}. {x.name}
                  </div>
                  <div className="text-[11.5px] text-slate-500 truncate">{x.assignee ? (x.assignee === user ? 'Bạn' : x.assignee) : 'Chưa chọn người xử lý'}</div>
                  <div className="text-[11px] text-slate-400">{x.actedAt ? fmt(x.actedAt) : active ? leftText(x.deadline) : ''}</div>
                </div>
                {i < r.runs.length - 1 && <div className={`mt-[11px] h-px w-10 ${x.status === 'approved' ? 'bg-emerald-400' : 'bg-slate-300'}`} />}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-3 items-start">
        <div className="space-y-3 min-w-0">
          {!canSee && <p className="text-[12.5px] text-amber-700">Bạn không thuộc đơn này (bản demo vẫn cho xem).</p>}
          {/* Dữ liệu các bước đã có */}
          {r.runs.map((x, i) =>
            (i === 0 || x.status === 'approved' || x.status === 'rejected') && (i === 0 || x.def.fields.length || x.comment) ? (
              <Panel
                key={i}
                title={`Bước ${i + 1}: ${x.name}`}
                icon={i === 0 ? FilePlus2 : x.status === 'rejected' ? XCircle : CheckCircle2}
                actions={
                  <span className="text-[12px] text-slate-500">
                    {x.assignee} · {fmt(x.actedAt)}
                  </span>
                }
              >
                {x.def.fields.length > 0 && (
                  <div className="grid grid-cols-[200px_minmax(0,1fr)] gap-x-3 gap-y-2 text-[13px]">
                    {i === 0 && (
                      <>
                        <span className="text-slate-500">Tiêu đề</span>
                        <span className="font-semibold">{r.title}</span>
                      </>
                    )}
                    {x.def.fields
                      .filter((f) => !hiddenByDep(f, ctxOf()))
                      .map((f) => (
                        <React.Fragment key={f.id}>
                          <span className="text-slate-500">{f.label}</span>
                          <span className="min-w-0">
                            <FieldView f={f} v={x.data[f.id] ?? ''} ctx={ctxOf()} />
                          </span>
                        </React.Fragment>
                      ))}
                  </div>
                )}
                {i > 0 && x.comment && (
                  <p className={`${x.def.fields.length ? 'mt-3' : ''} rounded-[3px] border px-3 py-2 text-[12.5px] ${x.status === 'rejected' ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                    <b>Ý kiến:</b> {x.comment}
                  </p>
                )}
              </Panel>
            ) : null,
          )}

          {/* Xử lý bước hiện tại */}
          {mine && run && (
            <Panel title={`Xử lý bước ${r.current + 1}: ${run.name}`} icon={CircleDot} className="!border-amber-400" footer={`Hạn xử lý: ${run.deadline ? `${fmt(run.deadline)} (${leftText(run.deadline)})` : 'không giới hạn'}`}>
              <div className="space-y-3" data-testid="act-panel">
                {run.def.desc && <p className="rounded-[3px] border border-[#cfe0f5] bg-[#f5f9ff] px-3 py-2 text-[12.5px]">{run.def.desc}</p>}
                {actFields.length > 0 && (
                  <div className="grid grid-cols-[200px_minmax(0,1fr)] gap-x-3 gap-y-3 items-start">
                    {actFields.map((f) => {
                      const e = tried === 'approve' ? fieldError(f, data[f.id] ?? run.data[f.id] ?? '') : '';
                      return (
                        <React.Fragment key={f.id}>
                          <span className="text-[12.5px] text-slate-600 pt-1.5">
                            {f.label} {f.required && <span className="text-rose-600">*</span>}
                          </span>
                          <span className="min-w-0">
                            <FieldInput f={f} v={data[f.id] ?? run.data[f.id] ?? ''} onChange={(v) => setData((d) => ({ ...d, [f.id]: v }))} ctx={actCtx} invalid={!!e} />
                            {e && <span className="block text-[11.5px] text-rose-600 mt-0.5">{e}</span>}
                          </span>
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
                <div className="grid grid-cols-[200px_minmax(0,1fr)] gap-x-3 gap-y-3 items-start">
                  <span className="text-[12.5px] text-slate-600 pt-1.5">Ý kiến {tried === 'reject' && <span className="text-rose-600">*</span>}</span>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ý kiến xử lý (bắt buộc khi từ chối)"
                    className={`w-full border border-slate-300 rounded-[3px] px-2 py-1.5 text-[13px] outline-none focus:border-[#1f5fa8] ${tried === 'reject' && !comment.trim() ? '!border-rose-400' : ''}`}
                    data-testid="act-comment"
                  />
                  {!last ? (
                    <>
                      <span className="text-[12.5px] text-slate-600 pt-1.5">
                        Người xử lý bước {r.current + 2}: {r.runs[r.current + 1].name} <span className="text-rose-600">*</span>
                      </span>
                      <select value={next} onChange={(e) => setNext(e.target.value)} className={`${erp.inputFull} max-w-[320px] ${tried === 'approve' && !next ? '!border-rose-400' : ''}`} data-testid="act-next">
                        <option value="">— Chọn người xử lý —</option>
                        {PROC_PEOPLE.filter((p) => p !== user).map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </>
                  ) : r.unlimitedSteps ? (
                    <>
                      <span className="text-[12.5px] text-slate-600 pt-1.5">Chuyển tiếp thêm người xử lý</span>
                      <span>
                        <select value={forward} onChange={(e) => setForward(e.target.value)} className={`${erp.inputFull} max-w-[320px]`}>
                          <option value="">Không — kết thúc quy trình khi phê duyệt</option>
                          {PROC_PEOPLE.filter((p) => p !== user).map((p) => (
                            <option key={p}>{p}</option>
                          ))}
                        </select>
                        <span className="block text-[11px] text-slate-400 mt-0.5">Quy trình không giới hạn bước</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <span />
                      <span className="text-[12px] text-slate-500">Bước cuối — phê duyệt sẽ hoàn tất đơn.</span>
                    </>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Btn variant="danger" icon={XCircle} onClick={reject} data-testid="act-reject">
                    Từ chối
                  </Btn>
                  <Btn variant="primary" icon={Check} onClick={approve} data-testid="act-approve">
                    Phê duyệt
                  </Btn>
                </div>
              </div>
            </Panel>
          )}
          {!mine && run && (
            <div className="bg-white border border-dashed border-amber-300 rounded-[4px] px-4 py-3 text-[12.5px] text-slate-600 flex items-center gap-2">
              <Clock size={15} className="text-amber-500" /> Đang chờ <b>{run.assignee}</b> xử lý bước {r.current + 1}: {run.name} · {leftText(run.deadline)}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Panel title="Lịch sử xử lý" icon={Clock} noPad>
            <ol className="px-3 py-2 space-y-2.5 max-h-[460px] overflow-auto" data-testid="req-history">
              {[...r.history].reverse().map((h, i) => (
                <li key={i} className="flex gap-2 text-[12px]">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1f5fa8] shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-slate-800">
                      <b>{h.by}</b> — {h.action}
                    </span>
                    {h.comment && <span className="block text-slate-600 italic">“{h.comment}”</span>}
                    <span className="block text-[11px] text-slate-400">{fmt(h.at)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Panel>
          <Panel title="Người liên quan" icon={Users}>
            {r.related.length ? (
              <div className="flex flex-wrap gap-1.5">
                {r.related.map((p) => (
                  <span key={p} className="rounded-full bg-[#e8f1fb] text-[#1f5fa8] text-[12px] px-2.5 py-0.5">
                    {p}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[12px] text-slate-400">Không có</span>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
};

export default MyProcessPage;
