/**
 * Ticket nội bộ — thành phần giao diện dùng chung: nhãn trạng thái / ưu tiên / SLA, đổi tài khoản (prototype),
 * bảng ticket có phễu lọc, form tạo ticket, màn chi tiết ticket, xem mail Outlook mô phỏng.
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowRightLeft, Ban, Check, CheckCircle2, Clock, Eye, FileText, Forward, Hourglass, Lock, Mail, MailOpen, MessageSquare, Paperclip, Pause, Play, Plus, RotateCcw, Save, Search, Send, Star, StickyNote, UserCheck, UserRound, Users, X,
} from 'lucide-react';
import { Btn, ErpTitleBar, FieldTable, Panel, Tag, erp } from '../erp/Erp';
import { ColumnFilterBar, useColumnFilters } from '../erp/ColumnFilter';
import { RICH_CLS, RichHtml, RichTextEditor } from '../../marcom/RichText';
import { emailOf, personLabel } from '../process/processStore';
import {
  PRIORITIES, PRIORITY_CLS, PRIORITY_LABEL, REOPEN_DAYS, STATUS_CLS, STATUS_LABEL, SYSTEM, TK_PEOPLE, AUTO_CLOSE_DAYS,
  addWatcher, askRequester, assignTicket, canReopen, canSeeContent, cancelTicket, catById, catLabel, changePriority, commentTicket, confirmTicket, createTicket, deptById,
  deptsOf, fmtD, fmtDT, forwardTicket, isDone, isHandler, isLeader, isOpen, leftText, loadOf, mailAddr, now, openTicket, plainText, removeWatcher, reopenTicket, resolveTicket,
  responseLate, setDue, setTkUser, slaOf, slaState, takeTicket, useOpenTicket, useTk, useTkUser, addWorkHours,
  type Ticket, type TkFile, type TkMail, type TkPriority,
} from './ticketStore';

// ==========================================================================
// Nhãn
// ==========================================================================
export const StatusTag: React.FC<{ t: Ticket }> = ({ t }) => <Tag cls={STATUS_CLS[t.status]}>{STATUS_LABEL[t.status]}</Tag>;
export const PriorityTag: React.FC<{ p: TkPriority }> = ({ p }) => <Tag cls={PRIORITY_CLS[p]}>{PRIORITY_LABEL[p]}</Tag>;
export const SLA_LABEL = { ok: 'Trong hạn', soon: 'Sắp quá hạn', overdue: 'Quá hạn', paused: 'Tạm dừng', met: 'Đúng hạn', breached: 'Trễ hạn', none: '—' } as const;
const SLA_CLS = {
  ok: 'text-slate-600',
  soon: 'text-amber-700 font-semibold',
  overdue: 'text-rose-600 font-semibold',
  paused: 'text-violet-600',
  met: 'text-emerald-700',
  breached: 'text-rose-600',
  none: 'text-slate-400',
} as const;
/** Hạn xử lý + trạng thái SLA ("còn 3 giờ", "quá 1 ngày", "Tạm dừng"…). */
export const SlaCell: React.FC<{ t: Ticket }> = ({ t }) => {
  const st = slaState(t);
  const txt = st === 'ok' || st === 'soon' || st === 'overdue' ? leftText(t.dueResolve) : SLA_LABEL[st];
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap ${SLA_CLS[st]}`} title={`Hạn xử lý: ${fmtDT(t.dueResolve)}`}>
      {st === 'overdue' && <AlertTriangle size={12} />}
      {st === 'paused' && <Pause size={12} />}
      {st === 'met' && <Check size={12} />}
      {txt}
    </span>
  );
};
export const Toast: React.FC<{ msg: string }> = ({ msg }) =>
  msg ? <div className="fixed top-4 right-4 z-[80] rounded-[4px] border border-[#184c88] bg-[#1e3a5f] text-white text-[12.5px] px-4 py-2.5 shadow-xl max-w-[520px]">{msg}</div> : null;
export const useFlash = () => {
  const [msg, setMsg] = useState('');
  const flash = (m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg(''), 3500);
  };
  return { msg, flash };
};
const NAME_CLS = 'whitespace-nowrap';
export const Person: React.FC<{ name: string; empty?: string }> = ({ name, empty = 'Chưa giao' }) =>
  name ? (
    <span className={NAME_CLS} title={emailOf(name) || undefined}>
      {name}
    </span>
  ) : (
    <span className="text-slate-400 italic">{empty}</span>
  );

/** Đổi tài khoản (prototype) — để thử vai người yêu cầu / người xử lý / trưởng nhóm. */
export const UserSwitch: React.FC = () => {
  const u = useTkUser();
  const roles = deptsOf(u).map((d) => `${d.leader === u ? 'Trưởng nhóm' : 'Xử lý'} ${d.code}`);
  return (
    <span className="flex items-center gap-1.5 text-[12px] text-slate-600" title="Bản prototype: đổi tài khoản để thử vai người yêu cầu / người xử lý / trưởng nhóm">
      <UserRound size={14} className="text-slate-400" />
      Tài khoản
      <select value={u} onChange={(e) => setTkUser(e.target.value)} className={`${erp.input} h-7 w-56 font-semibold text-[#1f5fa8]`} data-testid="tk-user">
        {TK_PEOPLE.map((p) => (
          <option key={p} value={p}>
            {p}
            {deptsOf(p).length ? ` · ${deptsOf(p).map((d) => (d.leader === p ? `TN ${d.code}` : d.code)).join(', ')}` : ''}
          </option>
        ))}
      </select>
      {roles.length > 0 && <Tag cls="bg-[#eaf2fc] text-[#1f5fa8] border-[#b9d3f0]">{roles.join(' · ')}</Tag>}
    </span>
  );
};

/** Mở chi tiết ticket trong màn hiện tại; link "Mở ticket" trong mail cũng đi qua đây. */
export const useDetail = () => {
  const [detail, setDetail] = useState<string | null>(null);
  const pend = useOpenTicket();
  useEffect(() => {
    if (pend) {
      setDetail(pend);
      openTicket(null);
    }
  }, [pend]);
  return [detail, setDetail] as const;
};
/** Màn nào mở được ticket này cho người dùng (link trong mail). */
export const pageFor = (t: Ticket, user: string) =>
  t.assignee === user ? 'Được giao cho tôi' : t.requester === user || t.watchers.includes(user) ? 'Ticket của tôi' : isHandler(t, user) ? 'Hàng đợi phòng ban' : 'Ticket của tôi';

// ==========================================================================
// Bảng ticket (phễu lọc theo cột như các màn danh sách khác)
// ==========================================================================
export type TkCol = 'code' | 'title' | 'dept' | 'cat' | 'priority' | 'status' | 'requester' | 'assignee' | 'created' | 'sla';
const COL_LABEL: Record<TkCol, string> = {
  code: 'Mã ticket',
  title: 'Tiêu đề',
  dept: 'Phòng xử lý',
  cat: 'Danh mục',
  priority: 'Ưu tiên',
  status: 'Trạng thái',
  requester: 'Người yêu cầu',
  assignee: 'Người xử lý',
  created: 'Ngày tạo',
  sla: 'Hạn xử lý',
};
export const TicketTable: React.FC<{
  rows: Ticket[];
  cols?: TkCol[];
  onOpen: (id: string) => void;
  empty?: string;
  extra?: (t: Ticket) => React.ReactNode;
  extraLabel?: string;
}> = ({ rows, cols = ['code', 'title', 'dept', 'cat', 'priority', 'status', 'requester', 'assignee', 'created', 'sla'], onOpen, empty = 'Không có ticket nào', extra, extraLabel }) => {
  const user = useTkUser();
  const [q, setQ] = useState('');
  const base = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? rows.filter((t) => `${t.code} ${t.title} ${t.requester} ${t.assignee}`.toLowerCase().includes(s)) : rows;
  }, [rows, q]);
  const getters = useMemo<Record<string, (t: Ticket) => string>>(
    () => ({
      dept: (t) => deptById(t.deptId)?.name || '',
      cat: (t) => catLabel(t.categoryId),
      priority: (t) => PRIORITY_LABEL[t.priority],
      status: (t) => STATUS_LABEL[t.status],
      requester: (t) => t.requester,
      assignee: (t) => t.assignee,
      sla: (t) => SLA_LABEL[slaState(t)],
      created: (t) => fmtD(t.createdAt),
    }),
    [],
  );
  const colF = useColumnFilters(base, getters);
  const th = `${erp.th} border-t-0 text-left`;
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-slate-200 bg-white">
        <div className="relative w-72">
          <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã, tiêu đề, người…" className={`${erp.inputFull} h-7 pl-7`} data-testid="tk-search" />
        </div>
        <ColumnFilterBar active={colF.active} filters={colF.filters} labelOf={(k) => COL_LABEL[k as TkCol] || k} onRemove={(k) => colF.set(k, [])} onClear={colF.clear} />
        <span className="ml-auto text-[11.5px] text-slate-500">{colF.rows.length} ticket</span>
      </div>
      <div className="overflow-auto">
        <table className={erp.table} data-testid="tk-table">
          <thead>
            <tr>
              {cols.map((c, i) => (
                <th key={c} className={`${th} ${i === 0 ? 'border-l-0' : ''} ${c === 'title' ? 'min-w-[260px]' : ''}`}>
                  <span className="inline-flex items-center gap-1">
                    {COL_LABEL[c]}
                    {getters[c] && colF.funnel(c, COL_LABEL[c])}
                  </span>
                </th>
              ))}
              {extra && <th className={`${th} border-r-0`}>{extraLabel}</th>}
            </tr>
          </thead>
          <tbody>
            {colF.rows.map((t) => {
              const hidden = !canSeeContent(t, user);
              return (
                <tr key={t.id} className={`${erp.tr} cursor-pointer`} onClick={() => onOpen(t.id)} data-testid="tk-row">
                  {cols.map((c, i) => (
                    <td key={c} className={`${erp.td} ${i === 0 ? 'border-l-0' : ''}`}>
                      {c === 'code' && <span className={`${erp.code} whitespace-nowrap`}>{t.code}</span>}
                      {c === 'title' && (
                        <span className="inline-flex items-center gap-1.5">
                          {t.confidential && <Lock size={12} className="text-slate-400 shrink-0" />}
                          {t.source === 'mail' && <Mail size={12} className="text-sky-500 shrink-0" />}
                          <span className={`font-medium ${hidden ? 'text-slate-500' : 'text-slate-800'}`}>{t.title}</span>
                          {t.comments.length > 0 && !hidden && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-400">
                              <MessageSquare size={11} />
                              {t.comments.filter((c2) => !c2.internal || isHandler(t, user)).length}
                            </span>
                          )}
                        </span>
                      )}
                      {c === 'dept' && <span className="whitespace-nowrap">{deptById(t.deptId)?.name}</span>}
                      {c === 'cat' && <span className="text-slate-600 inline-block min-w-[150px]">{catLabel(t.categoryId)}</span>}
                      {c === 'priority' && <PriorityTag p={t.priority} />}
                      {c === 'status' && <StatusTag t={t} />}
                      {c === 'requester' && <Person name={t.requester} />}
                      {c === 'assignee' && <Person name={t.assignee} />}
                      {c === 'created' && <span className="whitespace-nowrap text-slate-600">{fmtDT(t.createdAt)}</span>}
                      {c === 'sla' && <SlaCell t={t} />}
                    </td>
                  ))}
                  {extra && (
                    <td className={`${erp.td} border-r-0`} onClick={(e) => e.stopPropagation()}>
                      {extra(t)}
                    </td>
                  )}
                </tr>
              );
            })}
            {!colF.rows.length && (
              <tr>
                <td colSpan={cols.length + (extra ? 1 : 0)} className="text-center text-slate-500 py-8">
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================================================
// Hộp thoại
// ==========================================================================
export const Modal: React.FC<{ title: React.ReactNode; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; width?: string }> = ({ title, onClose, children, footer, width = 'max-w-[560px]' }) => (
  <div className="fixed inset-0 z-[70] bg-slate-900/40 flex items-start justify-center p-6 overflow-auto" onMouseDown={onClose}>
    <div className={`w-full ${width} bg-white rounded-[4px] border border-slate-300 shadow-2xl mt-10`} onMouseDown={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-4 h-10 bg-[#1e3a5f] text-white rounded-t-[4px]">
        <span className="font-bold text-[13px]">{title}</span>
        <button type="button" onClick={onClose} className="cursor-pointer text-white/80 hover:text-white" aria-label="Đóng">
          <X size={16} />
        </button>
      </div>
      <div className="p-4 space-y-3">{children}</div>
      {footer && <div className="flex justify-end gap-2 px-4 py-2.5 border-t border-slate-200 bg-slate-50 rounded-b-[4px]">{footer}</div>}
    </div>
  </div>
);
const Field: React.FC<{ label: string; required?: boolean; error?: string; hint?: React.ReactNode; children: React.ReactNode }> = ({ label, required, error, hint, children }) => (
  <div>
    <div className="text-[12px] font-semibold text-slate-700 mb-1">
      {label} {required && <span className="text-rose-600">*</span>}
    </div>
    {children}
    {error ? <div className="text-[11px] text-rose-600 mt-0.5">{error}</div> : hint ? <div className="text-[11px] text-slate-400 mt-0.5">{hint}</div> : null}
  </div>
);

// ==========================================================================
// Tạo ticket
// ==========================================================================
const fileSize = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);
const MAX_FILE = 10e6;
export const NewTicketForm: React.FC<{ onDone: (t: Ticket) => void; onCancel: () => void }> = ({ onDone, onCancel }) => {
  const s = useTk();
  const user = useTkUser();
  const depts = s.depts.filter((d) => d.active);
  const [deptId, setDeptId] = useState('');
  const [catId, setCatId] = useState('');
  const [title, setTitle] = useState('');
  const [html, setHtml] = useState('');
  const [priority, setPriority] = useState<TkPriority>('normal');
  const [wanted, setWanted] = useState('');
  const [watchers, setWatchers] = useState<string[]>([]);
  const [files, setFiles] = useState<TkFile[]>([]);
  const [tried, setTried] = useState(false);
  const cats = s.cats.filter((c) => c.deptId === deptId && c.active);
  const groups = [...new Set(cats.map((c) => c.group))];
  const cat = catById(catId);
  const errs: Record<string, string> = {};
  if (!deptId) errs.dept = 'Chọn phòng ban xử lý';
  if (!catId) errs.cat = 'Chọn danh mục';
  if (!title.trim()) errs.title = 'Nhập tiêu đề';
  else if (title.trim().length < 8) errs.title = 'Tiêu đề quá ngắn — mô tả ngắn gọn vấn đề';
  if (!plainText(html)) errs.html = 'Mô tả chi tiết yêu cầu';
  const E = (k: string) => (tried ? errs[k] : undefined);
  // gợi ý ticket tương tự đã giải quyết (cùng danh mục, trùng từ khoá trong tiêu đề)
  const similar = useMemo(() => {
    const words = title.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    if (!catId || words.length < 2) return [];
    return s.tickets
      .filter((t) => t.categoryId === catId && (t.status === 'resolved' || t.status === 'closed') && t.resolution && !t.confidential)
      .map((t) => ({ t, score: words.filter((w) => t.title.toLowerCase().includes(w)).length }))
      .filter((x) => x.score >= 1)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.t);
  }, [s.tickets, catId, title]);
  const sla = slaOf(priority);
  const dueH = cat?.slaHours ?? sla.resolve;
  const submit = () => {
    setTried(true);
    if (Object.keys(errs).length) return;
    const t = createTicket({ title, html, deptId, categoryId: catId, priority, wantedDate: wanted, watchers, files, requester: user });
    onDone(t);
  };
  return (
    <div className="space-y-3">
      <ErpTitleBar
        crumbs={['Ticket', 'Tạo ticket']}
        title="Tạo ticket mới"
        onBack={onCancel}
        actions={
          <>
            <UserSwitch />
            <Btn icon={X} onClick={onCancel}>
              Huỷ
            </Btn>
            <Btn variant="primary" icon={Send} onClick={submit} data-testid="tk-submit">
              Gửi ticket
            </Btn>
          </>
        }
      />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-3 items-start">
        <Panel title="Nội dung yêu cầu" icon={FileText}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Gửi tới phòng ban" required error={E('dept')}>
              <select
                value={deptId}
                onChange={(e) => {
                  setDeptId(e.target.value);
                  setCatId('');
                }}
                className={erp.inputFull}
                data-testid="tk-dept"
              >
                <option value="">— Chọn phòng ban —</option>
                {depts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Danh mục" required error={E('cat')} hint={cat?.confidential ? 'Ticket bảo mật: chỉ bạn và người được giao xem được nội dung' : undefined}>
              <select
                value={catId}
                onChange={(e) => {
                  setCatId(e.target.value);
                  const c = catById(e.target.value);
                  if (c) setPriority(c.priority);
                }}
                className={erp.inputFull}
                disabled={!deptId}
                data-testid="tk-cat"
              >
                <option value="">{deptId ? '— Chọn danh mục —' : 'Chọn phòng ban trước'}</option>
                {groups.map((g) => (
                  <optgroup key={g} label={g}>
                    {cats
                      .filter((c) => c.group === g)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                          {c.confidential ? ' (bảo mật)' : ''}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Tiêu đề" required error={E('title')}>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className={erp.inputFull} placeholder="VD: Laptop không lên nguồn sau khi cập nhật Windows" data-testid="tk-title" />
            </Field>
          </div>
          {similar.length > 0 && (
            <div className="mt-2 rounded-[3px] border border-amber-200 bg-amber-50 px-3 py-2 text-[12px]" data-testid="tk-similar">
              <div className="font-semibold text-amber-800 mb-1">Có thể đã có cách giải quyết:</div>
              {similar.map((t) => (
                <div key={t.id} className="text-slate-700">
                  <span className={erp.code}>{t.code}</span> {t.title} — <i>{t.resolution}</i>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3">
            <Field label="Mô tả chi tiết" required error={E('html')}>
              <div data-testid="tk-desc">
                <RichTextEditor value={html} onChange={setHtml} compact />
              </div>
            </Field>
          </div>
          <div className="mt-3">
            <Field label="File đính kèm" hint="Tối đa 10 MB mỗi file (bản prototype chỉ lưu tên và dung lượng)">
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[3px] border border-slate-300 bg-white text-[12px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
                  <Paperclip size={14} /> Chọn file
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const list = (Array.from(e.target.files || []) as File[]).filter((f) => f.size <= MAX_FILE);
                      setFiles((x) => [...x, ...list.map((f) => ({ name: f.name, size: f.size }))]);
                      e.target.value = '';
                    }}
                  />
                </label>
                {files.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 h-6 rounded-[3px] bg-slate-100 border border-slate-200 text-[11.5px]">
                    <Paperclip size={11} /> {f.name} <span className="text-slate-400">{fileSize(f.size)}</span>
                    <button type="button" className="cursor-pointer text-slate-400 hover:text-rose-600" onClick={() => setFiles((x) => x.filter((_, j) => j !== i))}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </Field>
          </div>
        </Panel>
        <div className="space-y-3">
          <Panel title="Thông tin xử lý" icon={Clock}>
            <div className="space-y-3">
              <Field label="Mức ưu tiên" hint={cat ? `Mặc định theo danh mục: ${PRIORITY_LABEL[cat.priority]}` : undefined}>
                <select value={priority} onChange={(e) => setPriority(e.target.value as TkPriority)} className={erp.inputFull} data-testid="tk-priority">
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {PRIORITY_LABEL[p]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Ngày mong muốn hoàn thành">
                <input type="date" value={wanted} onChange={(e) => setWanted(e.target.value)} className={erp.inputFull} />
              </Field>
              <div className="rounded-[3px] bg-[#f3f6fa] border border-slate-200 px-3 py-2 text-[12px] text-slate-600 leading-relaxed" data-testid="tk-sla-hint">
                Phản hồi trong <b>{sla.response} giờ</b>, xử lý xong trong <b>{dueH >= 8 ? `${dueH / 8} ngày` : `${dueH} giờ`}</b> làm việc
                <br />
                Hạn dự kiến: <b>{fmtDT(addWorkHours(now(), dueH))}</b>
              </div>
            </div>
          </Panel>
          <Panel title="Người theo dõi (CC)" icon={Users}>
            {cat?.confidential ? (
              <p className="text-[12px] text-slate-500">Ticket bảo mật không thêm người theo dõi.</p>
            ) : (
              <>
                <select
                  value=""
                  onChange={(e) => e.target.value && setWatchers((w) => [...w, e.target.value])}
                  className={erp.inputFull}
                  data-testid="tk-watch-add"
                >
                  <option value="">+ Thêm người nhận thông báo…</option>
                  {TK_PEOPLE.filter((p) => p !== user && !watchers.includes(p)).map((p) => (
                    <option key={p} value={p}>
                      {personLabel(p)}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {watchers.map((w) => (
                    <span key={w} className="inline-flex items-center gap-1 px-2 h-6 rounded-[3px] bg-[#eaf2fc] border border-[#b9d3f0] text-[11.5px] text-[#1f5fa8]">
                      {w}
                      <button type="button" className="cursor-pointer" onClick={() => setWatchers((x) => x.filter((p) => p !== w))}>
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
};

// ==========================================================================
// Xem mail (Outlook mô phỏng) — nút "Mở ticket" dẫn thẳng tới chi tiết
// ==========================================================================
export const MAIL_CLS = `${RICH_CLS} text-[13px] leading-relaxed text-slate-800 [&_table]:mt-2 [&_td]:pr-4 [&_td]:py-0.5 [&_td:first-child]:text-slate-500 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-200 [&_blockquote]:pl-3 [&_blockquote]:my-2 [&_blockquote]:text-slate-600 [&_p]:my-1`;
export const MailBody: React.FC<{ m: TkMail; onOpen?: () => void; compact?: boolean }> = ({ m, onOpen, compact }) => {
  const s = useTk();
  const t = s.tickets.find((x) => x.id === m.ticketId);
  return (
    <div className={compact ? '' : 'bg-white'} data-testid="mail-body">
      <div className="border-b border-slate-200 pb-2 mb-3">
        <div className="text-[16px] font-semibold text-slate-900">{m.subject}</div>
        <div className="mt-1 text-[12px] text-slate-600 space-y-0.5">
          <div>
            <span className="text-slate-400 w-12 inline-block">Từ</span> {mailAddr(m.from)}
          </div>
          <div>
            <span className="text-slate-400 w-12 inline-block">Tới</span> {m.to.map(mailAddr).join('; ')}
          </div>
          <div>
            <span className="text-slate-400 w-12 inline-block">Lúc</span> {fmtDT(m.at)}
          </div>
        </div>
      </div>
      <div className={MAIL_CLS} dangerouslySetInnerHTML={{ __html: m.html }} />
      {t && m.dir === 'out' && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[3px] bg-[#1f5fa8] text-white text-[13px] font-semibold hover:bg-[#184c88] cursor-pointer"
            data-testid="mail-open-ticket"
          >
            <MailOpen size={15} /> Mở ticket {t.code}
          </button>
          <div className="mt-3 text-[11px] text-slate-400">Trả lời mail này để thêm bình luận vào ticket. Không xoá mã [{t.code}] trong tiêu đề.</div>
        </div>
      )}
    </div>
  );
};

// ==========================================================================
// Chi tiết ticket
// ==========================================================================
type Act = 'resolve' | 'ask' | 'forward' | 'confirm' | 'reopen' | 'cancel' | 'due' | null;
export const TicketDetail: React.FC<{ id: string; onBack: () => void; flash: (m: string) => void }> = ({ id, onBack, flash }) => {
  const s = useTk();
  const user = useTkUser();
  const t = s.tickets.find((x) => x.id === id);
  const [act, setAct] = useState<Act>(null);
  const [mail, setMail] = useState<TkMail | null>(null);
  const [comment, setComment] = useState('');
  const [internal, setInternal] = useState(false);
  const [ckey, setCkey] = useState(0);
  if (!t) return <p className="p-6 text-slate-500">Không tìm thấy ticket.</p>;
  const dept = deptById(t.deptId)!;
  const handler = isHandler(t, user);
  const leader = isLeader(t.deptId, user);
  const mine = t.requester === user;
  const assignee = t.assignee === user;
  const see = canSeeContent(t, user);
  const open = isOpen(t);
  const st = slaState(t);
  const mails = s.mails.filter((m) => m.ticketId === t.id && (handler || mine || m.to.includes(user) || m.from === user));
  const canComment = see && t.status !== 'cancelled' && (mine || handler || t.watchers.includes(user));
  const timeline = [
    ...t.comments.filter((c) => !c.internal || handler).map((c) => ({ kind: 'c' as const, at: c.at, c })),
    ...t.events.map((e) => ({ kind: 'e' as const, at: e.at, e })),
  ].sort((a, b) => a.at - b.at);
  const sendComment = () => {
    if (!plainText(comment)) return;
    commentTicket(t.id, user, comment, internal && handler);
    setComment('');
    setInternal(false);
    setCkey((k) => k + 1);
    flash(internal ? 'Đã thêm ghi chú nội bộ (người yêu cầu không thấy)' : 'Đã gửi bình luận — mail thông báo đã gửi tới người liên quan');
  };

  const actions: React.ReactNode[] = [];
  if (handler && open) {
    if (!assignee || t.status === 'assigned' || t.status === 'new')
      actions.push(
        <Btn key="take" variant="primary" icon={Play} onClick={() => (takeTicket(t.id, user), flash(`Đã nhận xử lý ${t.code}`))} data-testid="act-take">
          {assignee ? 'Bắt đầu xử lý' : 'Nhận xử lý'}
        </Btn>,
      );
    if (assignee && t.status !== 'waiting' && t.status !== 'new')
      actions.push(
        <Btn key="ask" icon={Hourglass} onClick={() => setAct('ask')} data-testid="act-ask">
          Hỏi người yêu cầu
        </Btn>,
      );
    if (assignee || leader)
      actions.push(
        <Btn key="res" variant="success" icon={CheckCircle2} onClick={() => setAct('resolve')} data-testid="act-resolve">
          Đã giải quyết
        </Btn>,
      );
    actions.push(
      <Btn key="fw" icon={Forward} onClick={() => setAct('forward')} data-testid="act-forward">
        Chuyển tiếp
      </Btn>,
    );
  }
  if (mine && t.status === 'resolved')
    actions.push(
      <Btn key="cf" variant="success" icon={Star} onClick={() => setAct('confirm')} data-testid="act-confirm">
        Xác nhận & đánh giá
      </Btn>,
    );
  if ((mine || (handler && t.status === 'closed')) && canReopen(t))
    actions.push(
      <Btn key="ro" icon={RotateCcw} onClick={() => setAct('reopen')} data-testid="act-reopen">
        {t.status === 'resolved' ? 'Chưa xong – mở lại' : 'Mở lại'}
      </Btn>,
    );
  if (mine && (t.status === 'new' || t.status === 'assigned'))
    actions.push(
      <Btn key="cc" variant="danger" icon={Ban} onClick={() => setAct('cancel')} data-testid="act-cancel">
        Huỷ ticket
      </Btn>,
    );

  return (
    <div className="space-y-3" data-testid="tk-detail">
      <ErpTitleBar
        onBack={onBack}
        title={
          <>
            <span className={erp.code}>{t.code}</span>
            <span>{t.title}</span>
            <StatusTag t={t} />
            {t.confidential && <Tag cls="bg-slate-100 text-slate-600 border-slate-300" icon={Lock}>Bảo mật</Tag>}
          </>
        }
        actions={
          <>
            <UserSwitch />
            {actions}
          </>
        }
        meta={[
          { label: 'Phòng xử lý', value: dept.name },
          { label: 'Danh mục', value: catLabel(t.categoryId) },
          { label: 'Ưu tiên', value: PRIORITY_LABEL[t.priority] },
          { label: 'Người yêu cầu', value: t.requester },
          { label: 'Người xử lý', value: t.assignee || 'Chưa giao' },
          { label: 'Hạn xử lý', value: <SlaCell t={t} /> },
        ]}
        notice={
          t.status === 'resolved' && mine ? (
            <div className="px-4 py-2 bg-emerald-50 text-[12.5px] text-emerald-800">
              Yêu cầu đã được giải quyết: <b>{t.resolution}</b>. Bấm <b>Xác nhận & đánh giá</b> để đóng; sau {AUTO_CLOSE_DAYS} ngày làm việc không phản hồi, ticket tự đóng.
            </div>
          ) : t.status === 'waiting' && mine ? (
            <div className="px-4 py-2 bg-violet-50 text-[12.5px] text-violet-800">Người xử lý cần bạn bổ sung thông tin — trả lời bên dưới (hoặc trả lời mail) để tiếp tục. Hạn SLA đang tạm dừng.</div>
          ) : !see ? (
            <div className="px-4 py-2 bg-slate-50 text-[12.5px] text-slate-600">Ticket bảo mật — trưởng nhóm chỉ xem được tiêu đề, trạng thái và giao người xử lý.</div>
          ) : null
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-3 items-start">
        <div className="space-y-3 min-w-0">
          {see && (
            <Panel title="Mô tả" icon={FileText}>
              <RichHtml html={t.html} className="text-[13px] leading-relaxed text-slate-800" />
              {t.files.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {t.files.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 h-6 rounded-[3px] bg-slate-100 border border-slate-200 text-[11.5px]">
                      <Paperclip size={11} /> {f.name} <span className="text-slate-400">{fileSize(f.size)}</span>
                    </span>
                  ))}
                </div>
              )}
              {t.resolution && (
                <div className="mt-3 rounded-[3px] border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12.5px]">
                  <b className="text-emerald-800">Kết quả xử lý:</b> {t.resolution}
                  {t.rating && (
                    <span className="ml-2 inline-flex items-center gap-0.5 text-amber-500" title={t.ratingNote}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} size={12} fill={i < t.rating! ? 'currentColor' : 'none'} />
                      ))}
                      {t.ratingNote && <i className="ml-1 text-slate-600">“{t.ratingNote}”</i>}
                    </span>
                  )}
                </div>
              )}
            </Panel>
          )}
          {see && (
            <Panel title={`Trao đổi & lịch sử (${t.comments.filter((c) => !c.internal || handler).length} bình luận)`} icon={MessageSquare} noPad>
              <div className="divide-y divide-slate-100" data-testid="tk-timeline">
                {timeline.map((x) =>
                  x.kind === 'e' ? (
                    <div key={x.e.id} className="px-4 py-1.5 text-[12px] text-slate-500 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                      <span className="whitespace-nowrap tabular-nums text-slate-400">{fmtDT(x.at)}</span>
                      <span>
                        <b className="font-semibold text-slate-600">{x.e.by}</b> · {x.e.text}
                      </span>
                    </div>
                  ) : (
                    <div key={x.c.id} className={`px-4 py-3 ${x.c.internal ? 'bg-amber-50/70' : ''}`}>
                      <div className="flex items-center gap-2 text-[12px]">
                        <span className="w-7 h-7 rounded-full bg-[#1f5fa8]/10 text-[#1f5fa8] font-bold flex items-center justify-center text-[11px]">
                          {x.c.by.split(' ').slice(-1)[0].slice(0, 2)}
                        </span>
                        <b className="text-slate-800">{x.c.by}</b>
                        {x.c.by === t.requester && <Tag cls="bg-slate-50 text-slate-500 border-slate-200">Người yêu cầu</Tag>}
                        {x.c.internal && <Tag cls="bg-amber-100 text-amber-800 border-amber-300" icon={StickyNote}>Ghi chú nội bộ</Tag>}
                        {x.c.source === 'mail' && <Tag cls="bg-sky-50 text-sky-700 border-sky-200" icon={Mail}>Trả lời qua mail</Tag>}
                        <span className="ml-auto text-slate-400 tabular-nums">{fmtDT(x.at)}</span>
                      </div>
                      <RichHtml html={x.c.html} className="mt-1.5 ml-9 text-[13px] leading-relaxed text-slate-800" />
                    </div>
                  ),
                )}
              </div>
              {canComment && (
                <div className="border-t border-slate-200 p-3 bg-slate-50/60" data-testid="tk-comment-box">
                  <RichTextEditor key={ckey} value={comment} onChange={setComment} compact />
                  <div className="flex items-center gap-3 mt-2">
                    {handler && (
                      <label className="inline-flex items-center gap-1.5 text-[12px] text-slate-600 cursor-pointer">
                        <input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} data-testid="tk-internal" /> Ghi chú nội bộ (người yêu cầu không thấy)
                      </label>
                    )}
                    <Btn variant="primary" icon={Send} className="ml-auto" onClick={sendComment} disabled={!plainText(comment)} data-testid="tk-send">
                      {internal ? 'Lưu ghi chú' : 'Gửi bình luận'}
                    </Btn>
                  </div>
                </div>
              )}
            </Panel>
          )}
        </div>

        <div className="space-y-3">
          <Panel title="SLA" icon={Clock}>
            <SlaBox t={t} />
          </Panel>
          <Panel title="Thông tin" icon={Eye} noPad>
            <FieldTable
              labelWidth="40%"
              rows={[
                {
                  label: 'Người xử lý',
                  value:
                    leader && open ? (
                      <select value={t.assignee} onChange={(e) => (assignTicket(t.id, e.target.value, user), flash(e.target.value ? `Đã giao cho ${e.target.value}` : 'Đã bỏ giao'))} className={`${erp.input} h-7 w-full`} data-testid="tk-assign">
                        <option value="">— Chưa giao —</option>
                        {dept.members.map((m) => (
                          <option key={m} value={m}>
                            {m} ({loadOf(m)} đang mở)
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Person name={t.assignee} />
                    ),
                },
                {
                  label: 'Ưu tiên',
                  value:
                    leader && open ? (
                      <select value={t.priority} onChange={(e) => (changePriority(t.id, user, e.target.value as TkPriority), flash('Đã đổi ưu tiên, hạn SLA được tính lại'))} className={`${erp.input} h-7 w-full`} data-testid="tk-prio-edit">
                        {PRIORITIES.map((p) => (
                          <option key={p} value={p}>
                            {PRIORITY_LABEL[p]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <PriorityTag p={t.priority} />
                    ),
                },
                { label: 'Nguồn', value: t.source === 'mail' ? `Mail tới ${dept.mailbox}` : 'Tạo trên iMIS' },
                { label: 'Ngày tạo', value: fmtDT(t.createdAt) },
                { label: 'Mong muốn xong', value: t.wantedDate ? t.wantedDate.split('-').reverse().join('/') : '' },
                { label: 'Đã đóng', value: t.closedAt ? fmtDT(t.closedAt) : '' },
                { label: 'Số lần mở lại', value: t.reopenCount || '' },
              ]}
            />
          </Panel>
          {!t.confidential && (
            <Panel title={`Người theo dõi (${t.watchers.length})`} icon={Users}>
              <div className="flex flex-wrap gap-1.5">
                {t.watchers.map((w) => (
                  <span key={w} className="inline-flex items-center gap-1 px-2 h-6 rounded-[3px] bg-[#eaf2fc] border border-[#b9d3f0] text-[11.5px] text-[#1f5fa8]">
                    {w}
                    {(mine || handler) && (
                      <button type="button" className="cursor-pointer" onClick={() => removeWatcher(t.id, user, w)}>
                        <X size={11} />
                      </button>
                    )}
                  </span>
                ))}
                {!t.watchers.length && <span className="text-[12px] text-slate-400">Chưa có</span>}
              </div>
              {(mine || handler) && t.status !== 'cancelled' && (
                <select value="" onChange={(e) => e.target.value && (addWatcher(t.id, user, e.target.value), flash(`Đã thêm ${e.target.value} — đã gửi mail thông báo`))} className={`${erp.inputFull} mt-2 h-7`} data-testid="tk-watch">
                  <option value="">+ Thêm người theo dõi…</option>
                  {TK_PEOPLE.filter((p) => p !== t.requester && !t.watchers.includes(p)).map((p) => (
                    <option key={p} value={p}>
                      {personLabel(p)}
                    </option>
                  ))}
                </select>
              )}
            </Panel>
          )}
          <Panel title={`Mail liên quan (${mails.length})`} icon={Mail} noPad>
            <div className="divide-y divide-slate-100 max-h-[320px] overflow-auto" data-testid="tk-mails">
              {mails.map((m) => (
                <button key={m.id} type="button" onClick={() => setMail(m)} className="w-full text-left px-3 py-2 hover:bg-[#eaf2fc] cursor-pointer">
                  <div className="flex items-center gap-1.5 text-[11.5px]">
                    {m.dir === 'in' ? <Tag cls="bg-sky-50 text-sky-700 border-sky-200">Đến</Tag> : <Tag cls="bg-slate-50 text-slate-500 border-slate-200">Đi</Tag>}
                    <span className="truncate text-slate-700">{m.dir === 'in' ? m.from : m.to.join(', ')}</span>
                    <span className="ml-auto shrink-0 text-slate-400 tabular-nums">{fmtDT(m.at).slice(0, 16)}</span>
                  </div>
                  <div className="text-[12px] text-slate-500 truncate mt-0.5">{plainText(m.html).slice(0, 90)}</div>
                </button>
              ))}
              {!mails.length && <p className="px-3 py-3 text-[12px] text-slate-400">Chưa có mail</p>}
            </div>
          </Panel>
        </div>
      </div>

      {mail && (
        <Modal title="Xem mail (Outlook)" onClose={() => setMail(null)} width="max-w-[680px]">
          <MailBody m={mail} onOpen={() => setMail(null)} />
        </Modal>
      )}
      {act && <ActionDialog t={t} act={act} onClose={() => setAct(null)} flash={flash} />}
    </div>
  );
};

/** SLA: phản hồi đầu + xử lý xong, thanh thời gian. */
const SlaBox: React.FC<{ t: Ticket }> = ({ t }) => {
  const st = slaState(t);
  const end = t.resolvedAt || now();
  const pct = Math.max(0, Math.min(100, ((end - t.createdAt) / Math.max(1, t.dueResolve - t.createdAt)) * 100));
  const bar = st === 'overdue' || st === 'breached' ? 'bg-rose-500' : st === 'soon' ? 'bg-amber-500' : st === 'paused' ? 'bg-violet-400' : 'bg-emerald-500';
  const rLate = responseLate(t);
  return (
    <div className="space-y-2.5 text-[12.5px]" data-testid="tk-sla">
      <div className="flex justify-between gap-2">
        <span className="text-slate-500">Phản hồi đầu</span>
        <span className="text-right">
          {t.firstResponseAt ? (
            <span className={rLate ? 'text-rose-600' : 'text-emerald-700'}>
              {fmtDT(t.firstResponseAt)} {rLate ? '(trễ)' : '(đúng hạn)'}
            </span>
          ) : (
            <span className={rLate ? 'text-rose-600 font-semibold' : 'text-slate-700'}>hạn {fmtDT(t.dueResponse)}</span>
          )}
        </span>
      </div>
      <div className="flex justify-between gap-2">
        <span className="text-slate-500">Xử lý xong</span>
        <span className="text-slate-700">hạn {fmtDT(t.dueResolve)}</span>
      </div>
      <div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className={`h-full ${bar}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between mt-1 text-[11.5px]">
          <SlaCell t={t} />
          <span className="text-slate-400">Giờ làm việc T2–T6, 8:00–17:00</span>
        </div>
      </div>
    </div>
  );
};

/** Hộp thoại cho các thao tác cần nhập thêm. */
const ActionDialog: React.FC<{ t: Ticket; act: Exclude<Act, null>; onClose: () => void; flash: (m: string) => void }> = ({ t, act, onClose, flash }) => {
  const s = useTk();
  const user = useTkUser();
  const [text, setText] = useState('');
  const [html, setHtml] = useState('');
  const [rating, setRating] = useState(5);
  const [dept, setDept] = useState('');
  const [cat, setCat] = useState('');
  const [err, setErr] = useState('');
  const cats = s.cats.filter((c) => c.deptId === dept && c.active);
  const run = () => {
    if (act === 'resolve') {
      if (!text.trim()) return setErr('Nhập kết quả xử lý để người yêu cầu nắm được');
      resolveTicket(t.id, user, text.trim());
      flash(`Đã chuyển ${t.code} sang Đã giải quyết — mail mời xác nhận đã gửi tới ${t.requester}`);
    } else if (act === 'ask') {
      if (!plainText(html)) return setErr('Nhập nội dung cần bổ sung');
      askRequester(t.id, user, html);
      flash('Đã gửi câu hỏi — hạn SLA tạm dừng đến khi người yêu cầu phản hồi');
    } else if (act === 'forward') {
      if (!dept || !cat) return setErr('Chọn phòng ban và danh mục mới');
      if (dept === t.deptId && cat === t.categoryId) return setErr('Ticket đang ở danh mục này');
      forwardTicket(t.id, user, dept, cat, text.trim());
      flash(`Đã chuyển ${t.code} sang ${deptById(dept)?.name}`);
    } else if (act === 'confirm') {
      confirmTicket(t.id, user, rating, text.trim());
      flash('Cảm ơn bạn đã đánh giá — ticket đã đóng');
    } else if (act === 'reopen') {
      if (!text.trim()) return setErr('Nêu lý do mở lại');
      reopenTicket(t.id, user, text.trim());
      flash(`Đã mở lại ${t.code}`);
    } else if (act === 'cancel') {
      cancelTicket(t.id, user, text.trim());
      flash(`Đã huỷ ${t.code}`);
    }
    onClose();
  };
  const TITLE: Record<Exclude<Act, null>, string> = {
    resolve: 'Đánh dấu đã giải quyết',
    ask: 'Hỏi người yêu cầu bổ sung thông tin',
    forward: 'Chuyển tiếp sang phòng ban / danh mục khác',
    confirm: 'Xác nhận đã xong & đánh giá',
    reopen: 'Mở lại ticket',
    cancel: 'Huỷ ticket',
    due: 'Đổi hạn xử lý',
  };
  return (
    <Modal
      title={TITLE[act]}
      onClose={onClose}
      footer={
        <>
          <Btn onClick={onClose}>Đóng</Btn>
          <Btn variant={act === 'cancel' ? 'danger' : 'primary'} icon={act === 'cancel' ? Ban : Check} onClick={run} data-testid="dlg-ok">
            {act === 'cancel' ? 'Huỷ ticket' : 'Xác nhận'}
          </Btn>
        </>
      }
    >
      {act === 'ask' && (
        <>
          <p className="text-[12px] text-slate-500">Nội dung gửi tới {t.requester} (kèm mail). Hạn SLA tạm dừng đến khi họ trả lời.</p>
          <RichTextEditor value={html} onChange={setHtml} compact />
        </>
      )}
      {act === 'forward' && (
        <>
          <Field label="Phòng ban nhận" required>
            <select value={dept} onChange={(e) => (setDept(e.target.value), setCat(''))} className={erp.inputFull} data-testid="dlg-dept">
              <option value="">— Chọn —</option>
              {s.depts
                .filter((d) => d.active)
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="Danh mục" required>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className={erp.inputFull} disabled={!dept} data-testid="dlg-cat">
              <option value="">— Chọn —</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.group} › {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Lý do chuyển">
            <input value={text} onChange={(e) => setText(e.target.value)} className={erp.inputFull} placeholder="VD: Lỗi phần cứng, chuyển IT kiểm tra" />
          </Field>
          <p className="text-[11.5px] text-slate-500">Ticket về trạng thái Mới ở phòng nhận, hạn SLA tính lại từ bây giờ.</p>
        </>
      )}
      {act === 'confirm' && (
        <>
          <div className="flex items-center gap-1" data-testid="dlg-rating">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} type="button" onClick={() => setRating(i)} className="cursor-pointer text-amber-500" aria-label={`${i} sao`}>
                <Star size={24} fill={i <= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
            <span className="ml-2 text-[12px] text-slate-600">{rating}/5</span>
          </div>
          <Field label="Nhận xét (không bắt buộc)">
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className={`${erp.inputFull} h-auto py-1.5`} />
          </Field>
        </>
      )}
      {(act === 'resolve' || act === 'reopen' || act === 'cancel') && (
        <Field label={act === 'resolve' ? 'Kết quả xử lý' : act === 'reopen' ? 'Lý do mở lại' : 'Lý do huỷ (không bắt buộc)'} required={act !== 'cancel'}>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className={`${erp.inputFull} h-auto py-1.5`} data-testid="dlg-text" />
        </Field>
      )}
      {act === 'resolve' && <p className="text-[11.5px] text-slate-500">Người yêu cầu nhận mail mời xác nhận; sau {AUTO_CLOSE_DAYS} ngày làm việc không phản hồi, ticket tự đóng. Mở lại được trong {REOPEN_DAYS} ngày.</p>}
      {err && <p className="text-[12px] text-rose-600">{err}</p>}
    </Modal>
  );
};

