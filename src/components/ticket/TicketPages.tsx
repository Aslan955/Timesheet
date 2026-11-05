/**
 * Phân hệ "Ticket nội bộ" — các màn hình:
 *  Ticket của tôi · Được giao cho tôi · Hàng đợi phòng ban (danh sách / Kanban) · Hộp thư Outlook (mô phỏng) · Báo cáo Ticket · Cấu hình Ticket.
 */
import React, { useMemo, useState } from 'react';
import { BarChart3, Columns3, Inbox, LayoutList, Mail, MailOpen, Pencil, Plus, Reply, Save, Send, Settings, Trash2, UserCheck, Users } from 'lucide-react';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, KpiBox, Panel, Segmented, Tag, erp } from '../erp/Erp';
import { personLabel } from '../process/processStore';
import {
  PRIORITIES, PRIORITY_LABEL, RULE_LABEL, STATUS_LABEL, TK_PEOPLE,
  assignTicket, catLabel, deleteCat, deptById, deptsOf, fmtDT, isDone, isOpen, loadOf, mailAddr, mailToDept, newId, now, openTicket, plainText, replyByMail, saveCat, saveDept, saveSla,
  slaState, useTk, useTkUser, workHoursBetween,
  type Ticket, type TkCategory, type TkDept, type TkMail, type TkPriority, type TkRule, type TkSla, type TkStatus,
} from './ticketStore';
import { MailBody, Modal, NewTicketForm, PriorityTag, SlaCell, StatusTag, TicketDetail, TicketTable, Toast, UserSwitch, pageFor, useDetail, useFlash } from './ticketUi';

const byDue = (a: Ticket, b: Ticket) => a.dueResolve - b.dueResolve;
const byNew = (a: Ticket, b: Ticket) => b.createdAt - a.createdAt;
const weekStart = () => {
  const d = new Date(now());
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getTime();
};

// ==========================================================================
// Ticket của tôi
// ==========================================================================
export const MyTicketPage: React.FC = () => {
  const s = useTk();
  const user = useTkUser();
  const [detail, setDetail] = useDetail();
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState<'mine' | 'watch'>('mine');
  const [kpi, setKpi] = useState<'' | 'open' | 'waiting' | 'resolved' | 'closed'>('');
  const { msg, flash } = useFlash();
  const mine = s.tickets.filter((t) => t.requester === user);
  const watch = s.tickets.filter((t) => t.watchers.includes(user) && t.requester !== user);
  const base = (tab === 'mine' ? mine : watch).filter(
    (t) => !kpi || (kpi === 'open' ? isOpen(t) && t.status !== 'waiting' : kpi === 'closed' ? t.status === 'closed' || t.status === 'cancelled' : t.status === kpi),
  );
  const rows = [...base].sort(byNew);
  const count = (f: (t: Ticket) => boolean) => mine.filter(f).length;
  const toggle = (k: typeof kpi) => setKpi((x) => (x === k ? '' : k));
  return (
    <ErpPage>
      <Toast msg={msg} />
      {creating ? (
        <NewTicketForm
          onCancel={() => setCreating(false)}
          onDone={(t) => {
            setCreating(false);
            setDetail(t.id);
            flash(`Đã gửi ${t.code} tới ${deptById(t.deptId)?.name}${t.assignee ? `, tự giao cho ${t.assignee}` : ''} — mail xác nhận đã gửi vào Outlook của bạn`);
          }}
        />
      ) : detail ? (
        <TicketDetail key={detail} id={detail} onBack={() => setDetail(null)} flash={flash} />
      ) : (
        <>
          <ErpTitleBar
            crumbs={['Ticket', 'Ticket của tôi']}
            title="Ticket của tôi"
            actions={
              <>
                <UserSwitch />
                <Btn variant="primary" icon={Plus} onClick={() => setCreating(true)} data-testid="tk-new">
                  Tạo ticket
                </Btn>
              </>
            }
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <KpiBox label="Đang xử lý" value={count((t) => isOpen(t) && t.status !== 'waiting')} onClick={() => toggle('open')} active={kpi === 'open'} />
            <KpiBox label="Chờ tôi bổ sung thông tin" value={count((t) => t.status === 'waiting')} tone={count((t) => t.status === 'waiting') ? 'bad' : 'neutral'} onClick={() => toggle('waiting')} active={kpi === 'waiting'} />
            <KpiBox label="Đã giải quyết – chờ tôi xác nhận" value={count((t) => t.status === 'resolved')} tone={count((t) => t.status === 'resolved') ? 'bad' : 'neutral'} onClick={() => toggle('resolved')} active={kpi === 'resolved'} />
            <KpiBox label="Đã đóng / huỷ" value={count((t) => t.status === 'closed' || t.status === 'cancelled')} tone="good" onClick={() => toggle('closed')} active={kpi === 'closed'} />
          </div>
          <Panel title="Danh sách ticket" icon={Inbox} noPad>
            <div className="pt-2 bg-[#f7f9fc]">
              <FolderTabs
                tabs={[
                  { key: 'mine' as const, label: `Tôi tạo (${mine.length})` },
                  { key: 'watch' as const, label: `Tôi theo dõi (${watch.length})` },
                ]}
                value={tab}
                onChange={setTab}
              />
            </div>
            <TicketTable rows={rows} cols={['code', 'title', 'dept', 'cat', 'priority', 'status', 'assignee', 'created', 'sla']} onOpen={setDetail} empty={tab === 'mine' ? 'Bạn chưa tạo ticket nào — bấm "Tạo ticket" để gửi yêu cầu tới phòng ban' : 'Chưa có ticket bạn theo dõi'} />
          </Panel>
        </>
      )}
    </ErpPage>
  );
};

// ==========================================================================
// Được giao cho tôi
// ==========================================================================
export const AssignedTicketPage: React.FC = () => {
  const s = useTk();
  const user = useTkUser();
  const [detail, setDetail] = useDetail();
  const [tab, setTab] = useState<'doing' | 'waiting' | 'done'>('doing');
  const [kpi, setKpi] = useState<'' | 'soon' | 'overdue'>('');
  const { msg, flash } = useFlash();
  const mine = s.tickets.filter((t) => t.assignee === user);
  const doing = mine.filter((t) => isOpen(t) && t.status !== 'waiting');
  const waiting = mine.filter((t) => t.status === 'waiting');
  const done = mine.filter(isDone);
  const list = (tab === 'doing' ? doing : tab === 'waiting' ? waiting : done).filter((t) => !kpi || slaState(t) === kpi);
  const rows = [...list].sort(tab === 'done' ? byNew : byDue);
  const ws = weekStart();
  const handlerOf = deptsOf(user);
  return (
    <ErpPage>
      <Toast msg={msg} />
      {detail ? (
        <TicketDetail key={detail} id={detail} onBack={() => setDetail(null)} flash={flash} />
      ) : (
        <>
          <ErpTitleBar crumbs={['Ticket', 'Được giao cho tôi']} title="Ticket được giao cho tôi" actions={<UserSwitch />} meta={handlerOf.length ? handlerOf.map((d) => ({ label: d.leader === user ? 'Trưởng nhóm' : 'Nhóm xử lý', value: d.name })) : undefined} />
          {!handlerOf.length && !mine.length ? (
            <Panel title="Chưa thuộc nhóm xử lý" icon={UserCheck}>
              <p className="text-slate-600">
                Tài khoản <b>{user}</b> không thuộc nhóm xử lý của phòng ban nào. Đổi tài khoản (VD <b>Đỗ Văn Khánh</b> – trưởng nhóm IT, <b>Ngô Thị Lan</b> – HCNS) để thử vai người xử lý, hoặc thêm vào nhóm ở màn <b>Cấu hình Ticket</b>.
              </p>
            </Panel>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <KpiBox label="Đang xử lý" value={doing.length} onClick={() => (setTab('doing'), setKpi(''))} active={tab === 'doing' && !kpi} />
                <KpiBox label="Sắp quá hạn (còn < 20%)" value={doing.filter((t) => slaState(t) === 'soon').length} tone={doing.some((t) => slaState(t) === 'soon') ? 'bad' : 'neutral'} onClick={() => (setTab('doing'), setKpi((k) => (k === 'soon' ? '' : 'soon')))} active={kpi === 'soon'} />
                <KpiBox label="Quá hạn SLA" value={doing.filter((t) => slaState(t) === 'overdue').length} tone={doing.some((t) => slaState(t) === 'overdue') ? 'bad' : 'good'} onClick={() => (setTab('doing'), setKpi((k) => (k === 'overdue' ? '' : 'overdue')))} active={kpi === 'overdue'} />
                <KpiBox label="Đã giải quyết tuần này" value={done.filter((t) => (t.resolvedAt || 0) >= ws).length} tone="good" />
              </div>
              <Panel title="Việc của tôi" icon={UserCheck} noPad>
                <div className="pt-2 bg-[#f7f9fc]">
                  <FolderTabs
                    tabs={[
                      { key: 'doing' as const, label: `Đang xử lý (${doing.length})` },
                      { key: 'waiting' as const, label: `Chờ người yêu cầu (${waiting.length})` },
                      { key: 'done' as const, label: `Đã xong (${done.length})` },
                    ]}
                    value={tab}
                    onChange={(k) => (setTab(k), setKpi(''))}
                  />
                </div>
                <TicketTable rows={rows} cols={['code', 'title', 'cat', 'priority', 'status', 'requester', 'created', 'sla']} onOpen={setDetail} empty="Không có ticket" />
              </Panel>
            </>
          )}
        </>
      )}
    </ErpPage>
  );
};

// ==========================================================================
// Hàng đợi phòng ban (danh sách / Kanban)
// ==========================================================================
const KANBAN: TkStatus[] = ['new', 'assigned', 'in_progress', 'waiting', 'resolved'];
export const QueueTicketPage: React.FC = () => {
  const s = useTk();
  const user = useTkUser();
  const [detail, setDetail] = useDetail();
  const mineDepts = deptsOf(user);
  const [deptPick, setDeptPick] = useState('');
  const dept = mineDepts.find((d) => d.id === deptPick) || mineDepts[0];
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [scope, setScope] = useState<'open' | 'unassigned' | 'all'>('open');
  const { msg, flash } = useFlash();
  const leader = dept?.leader === user;
  const all = dept ? s.tickets.filter((t) => t.deptId === dept.id && (!t.confidential || leader || t.assignee === user)) : [];
  const rows = all.filter((t) => (scope === 'all' ? true : scope === 'unassigned' ? !t.assignee && isOpen(t) : isOpen(t))).sort(byDue);
  const ws = weekStart();
  return (
    <ErpPage>
      <Toast msg={msg} />
      {detail ? (
        <TicketDetail key={detail} id={detail} onBack={() => setDetail(null)} flash={flash} />
      ) : (
        <>
          <ErpTitleBar
            crumbs={['Ticket', 'Hàng đợi phòng ban']}
            title={dept ? `Hàng đợi ${dept.name}` : 'Hàng đợi phòng ban'}
            actions={
              <>
                <UserSwitch />
                {mineDepts.length > 1 && (
                  <select value={dept?.id} onChange={(e) => setDeptPick(e.target.value)} className={`${erp.input} h-7`}>
                    {mineDepts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                )}
              </>
            }
            meta={dept ? [{ label: 'Hộp thư', value: dept.mailbox }, { label: 'Trưởng nhóm', value: dept.leader }, { label: 'Giao việc', value: RULE_LABEL[dept.rule] }] : undefined}
          />
          {!dept ? (
            <Panel title="Chưa thuộc nhóm xử lý" icon={Users}>
              <p className="text-slate-600">
                Hàng đợi chỉ dành cho nhóm xử lý của phòng ban. Đổi tài khoản sang <b>Đỗ Văn Khánh</b> (trưởng nhóm IT), <b>Trần Thị Bình</b> (trưởng nhóm HCNS), <b>Lê Hoàng Cường</b> (trưởng nhóm Kế toán) hoặc <b>Vũ Thị Giang</b> (Hành chính) để xem.
              </p>
            </Panel>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <KpiBox label="Chưa giao" value={all.filter((t) => !t.assignee && isOpen(t)).length} tone={all.some((t) => !t.assignee && isOpen(t)) ? 'bad' : 'good'} onClick={() => setScope('unassigned')} active={scope === 'unassigned'} />
                <KpiBox label="Đang mở" value={all.filter(isOpen).length} onClick={() => setScope('open')} active={scope === 'open'} />
                <KpiBox label="Quá hạn SLA" value={all.filter((t) => slaState(t) === 'overdue').length} tone={all.some((t) => slaState(t) === 'overdue') ? 'bad' : 'good'} />
                <KpiBox label="Giải quyết tuần này" value={all.filter((t) => (t.resolvedAt || 0) >= ws).length} tone="good" onClick={() => setScope('all')} active={scope === 'all'} />
              </div>
              <div className="grid grid-cols-1 gap-3 items-start">
                <Panel
                  title={`Ticket của phòng (${rows.length})`}
                  icon={Inbox}
                  noPad
                  actions={
                    <>
                      <Segmented
                        options={[
                          { key: 'open' as const, label: 'Đang mở' },
                          { key: 'unassigned' as const, label: 'Chưa giao' },
                          { key: 'all' as const, label: 'Tất cả' },
                        ]}
                        value={scope}
                        onChange={setScope}
                      />
                      <Segmented
                        options={[
                          { key: 'list' as const, label: <span className="inline-flex items-center gap-1"><LayoutList size={13} /> Danh sách</span> },
                          { key: 'kanban' as const, label: <span className="inline-flex items-center gap-1"><Columns3 size={13} /> Kanban</span> },
                        ]}
                        value={view}
                        onChange={setView}
                      />
                    </>
                  }
                >
                  {view === 'list' ? (
                    <TicketTable
                      rows={rows}
                      cols={leader ? ['code', 'title', 'cat', 'priority', 'status', 'requester', 'sla'] : ['code', 'title', 'cat', 'priority', 'status', 'requester', 'assignee', 'sla']}
                      onOpen={setDetail}
                      empty="Hàng đợi trống"
                      extraLabel={leader ? 'Người xử lý (giao nhanh)' : undefined}
                      extra={
                        leader
                          ? (t) =>
                              isOpen(t) ? (
                                <select
                                  value={t.assignee}
                                  onChange={(e) => (assignTicket(t.id, e.target.value, user), flash(e.target.value ? `Đã giao ${t.code} cho ${e.target.value} — mail đã gửi` : `Đã bỏ giao ${t.code}`))}
                                  className={`${erp.input} h-7 w-44`}
                                  data-testid="queue-assign"
                                >
                                  <option value="">— Chưa giao —</option>
                                  {dept.members.map((m) => (
                                    <option key={m} value={m}>
                                      {m} ({loadOf(m)})
                                    </option>
                                  ))}
                                </select>
                              ) : null
                          : undefined
                      }
                    />
                  ) : (
                    <div className="grid grid-cols-5 gap-2 p-3 overflow-x-auto min-w-[900px]" data-testid="kanban">
                      {KANBAN.map((st) => {
                        const col = (scope === 'all' ? all : all.filter((t) => scope !== 'unassigned' || !t.assignee)).filter((t) => t.status === st).sort(byDue);
                        return (
                          <div key={st} className="bg-[#f3f6fa] border border-slate-200 rounded-[4px] min-h-[200px]">
                            <div className="px-2.5 py-1.5 border-b border-slate-200 text-[12px] font-bold text-[#1e3a5f] flex justify-between">
                              {STATUS_LABEL[st]} <span className="text-slate-500">{col.length}</span>
                            </div>
                            <div className="p-2 space-y-2">
                              {col.map((t) => (
                                <button key={t.id} type="button" onClick={() => setDetail(t.id)} className="w-full text-left bg-white border border-slate-200 rounded-[4px] p-2 hover:border-[#1f5fa8] hover:shadow-sm cursor-pointer" data-testid="kanban-card">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className={`${erp.code} text-[11px]`}>{t.code}</span>
                                    <PriorityTag p={t.priority} />
                                  </div>
                                  <div className="text-[12.5px] font-medium text-slate-800 mt-1 leading-snug">{t.title}</div>
                                  <div className="flex items-center justify-between gap-1 mt-1.5 text-[11px]">
                                    <span className="text-slate-500 truncate">{t.assignee || 'Chưa giao'}</span>
                                    <SlaCell t={t} />
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Panel>
                <Panel title="Tải công việc nhóm" icon={Users}>
                  <div className="flex flex-wrap gap-2" data-testid="queue-load">
                    {dept.members.map((m) => {
                      const od = s.tickets.filter((t) => t.assignee === m && slaState(t) === 'overdue').length;
                      return (
                        <div key={m} className="min-w-[190px] border border-slate-200 rounded-[4px] px-3 py-2 bg-[#f7f9fc]">
                          <div className="text-[12.5px] font-semibold text-slate-800">
                            {m} {m === dept.leader && <Tag cls="bg-slate-50 text-slate-500 border-slate-200">Trưởng nhóm</Tag>}
                          </div>
                          <div className="text-[12px] text-slate-600 mt-0.5">
                            <b className="text-slate-900">{loadOf(m)}</b> đang mở · <b className={od ? 'text-rose-600' : 'text-slate-900'}>{od}</b> quá hạn
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
              </div>
            </>
          )}
        </>
      )}
    </ErpPage>
  );
};

// ==========================================================================
// Hộp thư Outlook (mô phỏng): mail thông báo, trả lời → bình luận, gửi mail vào hộp thư phòng ban → ticket
// ==========================================================================
export const TicketMailboxPage: React.FC = () => {
  const s = useTk();
  const user = useTkUser();
  const [folder, setFolder] = useState<'in' | 'sent'>('in');
  const [sel, setSel] = useState<string | null>(null);
  const [read, setRead] = useState<Set<string>>(new Set());
  const [reply, setReply] = useState('');
  const [compose, setCompose] = useState(false);
  const { msg, flash } = useFlash();
  const list = s.mails.filter((m) => (folder === 'in' ? m.dir === 'out' && m.to.includes(user) : m.dir === 'in' && m.from === user)).sort((a, b) => b.at - a.at);
  const cur = list.find((m) => m.id === sel) || null;
  const unread = s.mails.filter((m) => m.dir === 'out' && m.to.includes(user) && !read.has(m.id)).length;
  const pick = (m: TkMail) => {
    setSel(m.id);
    setReply('');
    setRead((r) => new Set(r).add(m.id));
  };
  const openT = (m: TkMail) => {
    const t = s.tickets.find((x) => x.id === m.ticketId);
    if (t) openTicket(t.id, pageFor(t, user));
  };
  const sendReply = () => {
    if (!cur || !reply.trim()) return;
    try {
      const t = replyByMail(cur, user, reply.trim());
      setReply('');
      flash(`Đã gửi trả lời — nội dung thành bình luận trong ${t.code}`);
    } catch (e) {
      flash((e as Error).message);
    }
  };
  return (
    <ErpPage>
      <Toast msg={msg} />
      <ErpTitleBar
        crumbs={['Ticket', 'Hộp thư Outlook (mô phỏng)']}
        title="Hộp thư Outlook (mô phỏng)"
        actions={
          <>
            <UserSwitch />
            <Btn variant="primary" icon={Send} onClick={() => setCompose(true)} data-testid="mail-compose">
              Gửi mail tới hộp thư phòng ban
            </Btn>
          </>
        }
        notice={<div className="px-4 py-1.5 bg-sky-50 text-[12px] text-sky-800">Bản prototype: mail không gửi thật. Khi chạy thật, mail đi qua Microsoft 365 (Graph API) tới Outlook của từng người; trả lời mail sẽ thành bình luận trong ticket.</div>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-[180px_380px_1fr] gap-3 items-start">
        <Panel title="Thư mục" icon={Mail} noPad>
          {(['in', 'sent'] as const).map((f) => (
            <button key={f} type="button" onClick={() => (setFolder(f), setSel(null))} className={`w-full flex items-center justify-between px-3 h-9 text-[12.5px] cursor-pointer border-l-[3px] ${folder === f ? 'border-[#1f5fa8] bg-[#eaf2fc] font-semibold text-[#1f5fa8]' : 'border-transparent hover:bg-slate-50'}`}>
              {f === 'in' ? 'Hộp thư đến' : 'Đã gửi'}
              {f === 'in' && unread > 0 && <span className="px-1.5 rounded-full bg-[#1f5fa8] text-white text-[11px]">{unread}</span>}
            </button>
          ))}
          <div className="px-3 py-2 text-[11px] text-slate-500 border-t border-slate-200">{mailAddr(user)}</div>
        </Panel>
        <Panel title={`${folder === 'in' ? 'Hộp thư đến' : 'Đã gửi'} (${list.length})`} icon={Inbox} noPad>
          <div className="divide-y divide-slate-100 max-h-[640px] overflow-auto" data-testid="mail-list">
            {list.map((m) => {
              const unreadM = folder === 'in' && !read.has(m.id);
              return (
                <button key={m.id} type="button" onClick={() => pick(m)} className={`w-full text-left px-3 py-2 cursor-pointer border-l-[3px] ${cur?.id === m.id ? 'bg-[#eaf2fc] border-[#1f5fa8]' : unreadM ? 'border-[#1f5fa8]/60 hover:bg-slate-50' : 'border-transparent hover:bg-slate-50'}`} data-testid="mail-item">
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className={`truncate ${unreadM ? 'font-bold text-slate-900' : 'text-slate-700'}`}>{folder === 'in' ? m.from.replace(/ <.*/, '') : m.to.join(', ')}</span>
                    <span className="ml-auto shrink-0 text-[11px] text-slate-400 tabular-nums">{fmtDT(m.at).slice(0, 16)}</span>
                  </div>
                  <div className={`text-[12.5px] truncate ${unreadM ? 'font-semibold text-[#1f5fa8]' : 'text-slate-800'}`}>{m.subject}</div>
                  <div className="text-[11.5px] text-slate-500 truncate">{plainText(m.html).slice(0, 100)}</div>
                </button>
              );
            })}
            {!list.length && <p className="px-3 py-6 text-center text-[12px] text-slate-400">Không có mail</p>}
          </div>
        </Panel>
        <Panel title="Nội dung mail" icon={MailOpen}>
          {cur ? (
            <div>
              <MailBody m={cur} onOpen={() => openT(cur)} />
              {folder === 'in' && cur.ticketId && (
                <div className="mt-4 border-t border-slate-200 pt-3" data-testid="mail-reply">
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700 mb-1.5">
                    <Reply size={14} /> Trả lời (RE: {cur.subject})
                  </div>
                  <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={4} className={`${erp.inputFull} h-auto py-1.5`} placeholder="Nội dung trả lời sẽ thành bình luận trong ticket…" data-testid="mail-reply-text" />
                  <div className="flex justify-end mt-2">
                    <Btn variant="primary" icon={Send} onClick={sendReply} disabled={!reply.trim()} data-testid="mail-reply-send">
                      Gửi trả lời
                    </Btn>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-slate-400 py-16">Chọn một mail để xem</p>
          )}
        </Panel>
      </div>
      {compose && <ComposeMail onClose={() => setCompose(false)} flash={flash} />}
    </ErpPage>
  );
};
const ComposeMail: React.FC<{ onClose: () => void; flash: (m: string) => void }> = ({ onClose, flash }) => {
  const s = useTk();
  const user = useTkUser();
  const depts = s.depts.filter((d) => d.active);
  const [to, setTo] = useState(depts[0]?.mailbox || '');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [err, setErr] = useState('');
  const send = () => {
    if (!subject.trim() || !body.trim()) return setErr('Nhập tiêu đề và nội dung');
    try {
      const t = mailToDept(user, to, subject.trim(), body.trim());
      flash(`Mail tới ${to} đã thành ticket ${t.code}${t.assignee ? `, tự giao cho ${t.assignee}` : ''}`);
      onClose();
    } catch (e) {
      setErr((e as Error).message);
    }
  };
  return (
    <Modal
      title="Soạn mail mới (Outlook)"
      onClose={onClose}
      width="max-w-[640px]"
      footer={
        <>
          <Btn onClick={onClose}>Huỷ</Btn>
          <Btn variant="primary" icon={Send} onClick={send} data-testid="compose-send">
            Gửi
          </Btn>
        </>
      }
    >
      <div className="grid grid-cols-[70px_1fr] gap-2 items-center text-[12.5px]">
        <span className="text-slate-500">Từ</span>
        <span>{mailAddr(user)}</span>
        <span className="text-slate-500">Tới</span>
        <select value={to} onChange={(e) => setTo(e.target.value)} className={erp.inputFull} data-testid="compose-to">
          {depts.map((d) => (
            <option key={d.id} value={d.mailbox}>
              {d.mailbox} — {d.name}
            </option>
          ))}
        </select>
        <span className="text-slate-500">Tiêu đề</span>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} className={erp.inputFull} data-testid="compose-subject" />
      </div>
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} className={`${erp.inputFull} h-auto py-1.5`} data-testid="compose-body" />
      <p className="text-[11.5px] text-slate-500">Mail gửi vào hộp thư phòng ban sẽ tự tạo ticket (danh mục mặc định của phòng, phòng phân loại lại sau). Bạn nhận mail xác nhận kèm mã ticket.</p>
      {err && <p className="text-[12px] text-rose-600">{err}</p>}
    </Modal>
  );
};

// ==========================================================================
// Báo cáo Ticket
// ==========================================================================
export const TicketReportPage: React.FC = () => {
  const s = useTk();
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [deptF, setDeptF] = useState('');
  const from = now() - days * 864e5;
  const inScope = s.tickets.filter((t) => (!deptF || t.deptId === deptF) && t.createdAt >= from);
  const resolved = inScope.filter((t) => t.resolvedAt);
  const slaPct = resolved.length ? Math.round((resolved.filter((t) => t.resolvedAt! <= t.dueResolve).length / resolved.length) * 100) : null;
  const avgH = resolved.length ? resolved.reduce((x, t) => x + workHoursBetween(t.createdAt, t.resolvedAt!), 0) / resolved.length : null;
  const rated = inScope.filter((t) => t.rating);
  const csat = rated.length ? rated.reduce((x, t) => x + (t.rating || 0), 0) / rated.length : null;
  const byDept = s.depts.map((d) => {
    const ts = inScope.filter((t) => t.deptId === d.id);
    const rs = ts.filter((t) => t.resolvedAt);
    return {
      d,
      total: ts.length,
      open: ts.filter(isOpen).length,
      overdue: ts.filter((t) => slaState(t) === 'overdue').length,
      resolved: rs.length,
      sla: rs.length ? Math.round((rs.filter((t) => t.resolvedAt! <= t.dueResolve).length / rs.length) * 100) : null,
      avg: rs.length ? rs.reduce((x, t) => x + workHoursBetween(t.createdAt, t.resolvedAt!), 0) / rs.length : null,
    };
  });
  const catCount: Record<string, number> = {};
  inScope.forEach((t) => (catCount[t.categoryId] = (catCount[t.categoryId] || 0) + 1));
  const byCat = (Object.entries(catCount) as [string, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  // 14 ngày gần nhất: ticket mới vs đã giải quyết
  const daysArr = useMemo(() => {
    const out: { key: string; label: string; created: number; resolved: number }[] = [];
    const d0 = new Date(now());
    d0.setHours(0, 0, 0, 0);
    for (let i = 13; i >= 0; i--) {
      const a = d0.getTime() - i * 864e5;
      const b = a + 864e5;
      const dd = new Date(a);
      const scope = s.tickets.filter((t) => !deptF || t.deptId === deptF);
      out.push({
        key: String(a),
        label: `${String(dd.getDate()).padStart(2, '0')}/${String(dd.getMonth() + 1).padStart(2, '0')}`,
        created: scope.filter((t) => t.createdAt >= a && t.createdAt < b).length,
        resolved: scope.filter((t) => t.resolvedAt && t.resolvedAt >= a && t.resolvedAt < b).length,
      });
    }
    return out;
  }, [s.tickets, deptF]);
  const max = Math.max(1, ...daysArr.map((d) => Math.max(d.created, d.resolved)));
  const hours = (h: number | null) => (h === null ? '—' : h >= 8 ? `${(h / 8).toFixed(1)} ngày` : `${h.toFixed(1)} giờ`);
  const th = `${erp.th} border-t-0`;
  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['Ticket', 'Báo cáo Ticket']}
        title="Báo cáo Ticket"
        actions={
          <>
            <select value={deptF} onChange={(e) => setDeptF(e.target.value)} className={`${erp.input} h-7`} data-testid="rp-dept">
              <option value="">Tất cả phòng ban</option>
              {s.depts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <Segmented
              options={[
                { key: 7 as const, label: '7 ngày' },
                { key: 30 as const, label: '30 ngày' },
                { key: 90 as const, label: '90 ngày' },
              ]}
              value={days}
              onChange={setDays}
            />
          </>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <KpiBox label="Ticket mới" value={inScope.length} />
        <KpiBox label="Đang mở" value={inScope.filter(isOpen).length} />
        <KpiBox label="Quá hạn SLA" value={inScope.filter((t) => slaState(t) === 'overdue').length} tone={inScope.some((t) => slaState(t) === 'overdue') ? 'bad' : 'good'} />
        <KpiBox label="Tỷ lệ đúng SLA" value={slaPct === null ? '—' : `${slaPct}%`} tone={slaPct !== null && slaPct < 80 ? 'bad' : 'good'} sub={`${resolved.length} ticket đã giải quyết`} />
        <KpiBox label="Thời gian xử lý TB" value={hours(avgH)} sub="Giờ làm việc" />
        <KpiBox label="Điểm hài lòng" value={csat === null ? '—' : `${csat.toFixed(1)}/5`} sub={`${rated.length} lượt đánh giá`} tone="good" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-3 items-start">
        <Panel title="Theo phòng ban" icon={BarChart3} noPad>
          <table className={erp.table} data-testid="rp-dept-table">
            <thead>
              <tr>
                <th className={`${th} border-l-0 text-left`}>Phòng ban</th>
                <th className={`${th} text-right`}>Ticket</th>
                <th className={`${th} text-right`}>Đang mở</th>
                <th className={`${th} text-right`}>Quá hạn</th>
                <th className={`${th} text-right`}>Đã giải quyết</th>
                <th className={`${th} text-right`}>Đúng SLA</th>
                <th className={`${th} border-r-0 text-right`}>Xử lý TB</th>
              </tr>
            </thead>
            <tbody>
              {byDept.map((r) => (
                <tr key={r.d.id} className={erp.tr}>
                  <td className={`${erp.td} border-l-0 font-medium`}>{r.d.name}</td>
                  <td className={`${erp.td} ${erp.num}`}>{r.total}</td>
                  <td className={`${erp.td} ${erp.num}`}>{r.open}</td>
                  <td className={`${erp.td} ${erp.num} ${r.overdue ? 'text-rose-600 font-bold' : ''}`}>{r.overdue}</td>
                  <td className={`${erp.td} ${erp.num}`}>{r.resolved}</td>
                  <td className={`${erp.td} ${erp.num} ${r.sla !== null && r.sla < 80 ? 'text-rose-600' : ''}`}>{r.sla === null ? '—' : `${r.sla}%`}</td>
                  <td className={`${erp.td} ${erp.num} border-r-0`}>{hours(r.avg)}</td>
                </tr>
              ))}
              <tr className={erp.totalRow}>
                <td className={`${erp.td} border-l-0`}>Tổng</td>
                <td className={`${erp.td} ${erp.num}`}>{inScope.length}</td>
                <td className={`${erp.td} ${erp.num}`}>{inScope.filter(isOpen).length}</td>
                <td className={`${erp.td} ${erp.num}`}>{inScope.filter((t) => slaState(t) === 'overdue').length}</td>
                <td className={`${erp.td} ${erp.num}`}>{resolved.length}</td>
                <td className={`${erp.td} ${erp.num}`}>{slaPct === null ? '—' : `${slaPct}%`}</td>
                <td className={`${erp.td} ${erp.num} border-r-0`}>{hours(avgH)}</td>
              </tr>
            </tbody>
          </table>
        </Panel>
        <Panel title="Danh mục nhiều ticket nhất" icon={BarChart3} noPad>
          <table className={erp.table}>
            <tbody>
              {byCat.map(([id, n]) => (
                <tr key={id} className={erp.tr}>
                  <td className={`${erp.td} border-l-0`}>
                    <div className="text-[12px]">{catLabel(id)}</div>
                    <div className="h-1.5 mt-1 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-[#1f5fa8]" style={{ width: `${(n / (byCat[0]?.[1] || 1)) * 100}%` }} />
                    </div>
                  </td>
                  <td className={`${erp.td} ${erp.num} border-r-0 w-14`}>{n}</td>
                </tr>
              ))}
              {!byCat.length && (
                <tr>
                  <td className="text-center text-slate-400 py-6">Chưa có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </Panel>
      </div>
      <Panel title="14 ngày gần nhất: ticket mới và đã giải quyết" icon={BarChart3}>
        <svg viewBox="0 0 760 210" className="w-full max-w-[900px]" role="img" aria-label="Ticket mới và đã giải quyết theo ngày" data-testid="rp-chart">
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <line x1="40" x2="750" y1={170 - f * 140} y2={170 - f * 140} stroke="#e2e8f0" />
              <text x="32" y={174 - f * 140} textAnchor="end" fontSize="11" fill="#64748b">
                {Math.round(max * f)}
              </text>
            </g>
          ))}
          {daysArr.map((d, i) => {
            const x = 52 + i * 50;
            const h1 = (d.created / max) * 140;
            const h2 = (d.resolved / max) * 140;
            return (
              <g key={d.key}>
                <rect x={x} y={170 - h1} width="16" height={h1} fill="#1f5fa8" rx="2" />
                <rect x={x + 18} y={170 - h2} width="16" height={h2} fill="#0f8f6c" rx="2" />
                <text x={x + 17} y="188" textAnchor="middle" fontSize="10.5" fill="#64748b">
                  {d.label}
                </text>
              </g>
            );
          })}
          <rect x="560" y="196" width="10" height="10" fill="#1f5fa8" rx="2" />
          <text x="575" y="205" fontSize="11" fill="#334155">
            Ticket mới
          </text>
          <rect x="650" y="196" width="10" height="10" fill="#0f8f6c" rx="2" />
          <text x="665" y="205" fontSize="11" fill="#334155">
            Đã giải quyết
          </text>
        </svg>
      </Panel>
    </ErpPage>
  );
};

// ==========================================================================
// Cấu hình Ticket
// ==========================================================================
export const TicketConfigPage: React.FC = () => {
  const [tab, setTab] = useState<'dept' | 'cat' | 'sla'>('dept');
  const { msg, flash } = useFlash();
  return (
    <ErpPage>
      <Toast msg={msg} />
      <ErpTitleBar crumbs={['Ticket', 'Cấu hình Ticket']} title="Cấu hình Ticket" />
      <FolderTabs
        tabs={[
          { key: 'dept' as const, label: 'Phòng ban nhận ticket', icon: Users },
          { key: 'cat' as const, label: 'Danh mục', icon: LayoutList },
          { key: 'sla' as const, label: 'SLA & quy tắc', icon: Settings },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === 'dept' && <DeptConfig flash={flash} />}
      {tab === 'cat' && <CatConfig flash={flash} />}
      {tab === 'sla' && <SlaConfig flash={flash} />}
    </ErpPage>
  );
};
const DeptConfig: React.FC<{ flash: (m: string) => void }> = ({ flash }) => {
  const s = useTk();
  const [edit, setEdit] = useState<TkDept | null>(null);
  const [err, setErr] = useState('');
  const th = `${erp.th} border-t-0 text-left`;
  const save = () => {
    if (!edit) return;
    if (!edit.code.trim() || !edit.name.trim()) return setErr('Nhập mã và tên phòng');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(edit.mailbox)) return setErr('Hộp thư không đúng dạng email');
    if (s.depts.some((d) => d.id !== edit.id && d.mailbox.toLowerCase() === edit.mailbox.toLowerCase())) return setErr('Hộp thư đã dùng cho phòng khác');
    if (!edit.members.length) return setErr('Chọn ít nhất 1 người trong nhóm xử lý');
    if (!edit.members.includes(edit.leader)) return setErr('Trưởng nhóm phải thuộc nhóm xử lý');
    saveDept(edit);
    flash(`Đã lưu ${edit.name}`);
    setEdit(null);
    setErr('');
  };
  return (
    <div className="space-y-3">
      <Panel
        title={`Phòng ban nhận ticket (${s.depts.length})`}
        icon={Users}
        noPad
        actions={
          <Btn variant="primary" icon={Plus} className="h-7" onClick={() => (setEdit({ id: newId('d'), code: '', name: '', mailbox: '', leader: '', members: [], rule: 'manual', active: true }), setErr(''))}>
            Thêm phòng ban
          </Btn>
        }
      >
        <table className={erp.table}>
          <thead>
            <tr>
              <th className={`${th} border-l-0`}>Mã</th>
              <th className={th}>Phòng ban</th>
              <th className={th}>Hộp thư chung</th>
              <th className={th}>Trưởng nhóm</th>
              <th className={th}>Nhóm xử lý</th>
              <th className={th}>Giao việc</th>
              <th className={th}>Trạng thái</th>
              <th className={`${th} border-r-0`}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {s.depts.map((d) => (
              <tr key={d.id} className={erp.tr}>
                <td className={`${erp.td} border-l-0 ${erp.code}`}>{d.code}</td>
                <td className={`${erp.td} font-medium`}>{d.name}</td>
                <td className={erp.td}>{d.mailbox}</td>
                <td className={erp.td}>{d.leader}</td>
                <td className={erp.td}>{d.members.join(', ')}</td>
                <td className={erp.td}>{RULE_LABEL[d.rule]}</td>
                <td className={erp.td}>{d.active ? <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-200">Đang nhận</Tag> : <Tag cls="bg-slate-50 text-slate-500 border-slate-200">Ngừng</Tag>}</td>
                <td className={`${erp.td} border-r-0`}>
                  <button type="button" className="text-[#1f5fa8] hover:underline cursor-pointer inline-flex items-center gap-1" onClick={() => (setEdit(structuredClone(d)), setErr(''))}>
                    <Pencil size={12} /> Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      {edit && (
        <Panel
          title={s.depts.some((d) => d.id === edit.id) ? `Sửa: ${edit.name}` : 'Thêm phòng ban'}
          icon={Pencil}
          actions={
            <>
              <Btn className="h-7" onClick={() => setEdit(null)}>
                Huỷ
              </Btn>
              <Btn variant="primary" icon={Save} className="h-7" onClick={save} data-testid="dept-save">
                Lưu
              </Btn>
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="text-[12px]">
              Mã
              <input value={edit.code} onChange={(e) => setEdit({ ...edit, code: e.target.value.toUpperCase() })} className={erp.inputFull} />
            </label>
            <label className="text-[12px]">
              Tên phòng ban
              <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className={erp.inputFull} />
            </label>
            <label className="text-[12px]">
              Hộp thư chung (Microsoft 365)
              <input value={edit.mailbox} onChange={(e) => setEdit({ ...edit, mailbox: e.target.value.trim() })} className={erp.inputFull} placeholder="it@congty.vn" />
            </label>
            <label className="text-[12px]">
              Quy tắc giao việc
              <select value={edit.rule} onChange={(e) => setEdit({ ...edit, rule: e.target.value as TkRule })} className={erp.inputFull}>
                {(Object.keys(RULE_LABEL) as TkRule[]).map((r) => (
                  <option key={r} value={r}>
                    {RULE_LABEL[r]}
                  </option>
                ))}
              </select>
            </label>
            <div className="text-[12px] md:col-span-2">
              Nhóm xử lý
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1 p-2 border border-slate-200 rounded-[3px]">
                {TK_PEOPLE.map((p) => (
                  <label key={p} className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={edit.members.includes(p)} onChange={(e) => setEdit({ ...edit, members: e.target.checked ? [...edit.members, p] : edit.members.filter((m) => m !== p), leader: !e.target.checked && edit.leader === p ? '' : edit.leader })} />
                    {p}
                  </label>
                ))}
              </div>
            </div>
            <label className="text-[12px]">
              Trưởng nhóm
              <select value={edit.leader} onChange={(e) => setEdit({ ...edit, leader: e.target.value })} className={erp.inputFull}>
                <option value="">— Chọn —</option>
                {edit.members.map((m) => (
                  <option key={m} value={m}>
                    {personLabel(m)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[12px] inline-flex items-center gap-2 mt-5">
              <input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} /> Đang nhận ticket
            </label>
          </div>
          {err && <p className="text-[12px] text-rose-600 mt-2">{err}</p>}
        </Panel>
      )}
    </div>
  );
};
const CatConfig: React.FC<{ flash: (m: string) => void }> = ({ flash }) => {
  const s = useTk();
  const [deptF, setDeptF] = useState('');
  const [edit, setEdit] = useState<TkCategory | null>(null);
  const [err, setErr] = useState('');
  const rows = s.cats.filter((c) => !deptF || c.deptId === deptF);
  const used = (id: string) => s.tickets.filter((t) => t.categoryId === id).length;
  const th = `${erp.th} border-t-0 text-left`;
  const save = () => {
    if (!edit) return;
    if (!edit.deptId || !edit.group.trim() || !edit.name.trim()) return setErr('Nhập phòng ban, nhóm và tên danh mục');
    if (edit.slaHours !== undefined && (edit.slaHours <= 0 || Number.isNaN(edit.slaHours))) return setErr('SLA riêng phải lớn hơn 0 giờ');
    saveCat({ ...edit, group: edit.group.trim(), name: edit.name.trim() });
    flash(`Đã lưu danh mục ${edit.name}`);
    setEdit(null);
    setErr('');
  };
  return (
    <div className="space-y-3">
      <Panel
        title={`Danh mục (${rows.length})`}
        icon={LayoutList}
        noPad
        actions={
          <>
            <select value={deptF} onChange={(e) => setDeptF(e.target.value)} className={`${erp.input} h-7`}>
              <option value="">Tất cả phòng ban</option>
              {s.depts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <Btn variant="primary" icon={Plus} className="h-7" onClick={() => (setEdit({ id: newId('c'), deptId: deptF || s.depts[0].id, group: '', name: '', priority: 'normal', confidential: false, active: true }), setErr(''))}>
              Thêm danh mục
            </Btn>
          </>
        }
      >
        <table className={erp.table}>
          <thead>
            <tr>
              <th className={`${th} border-l-0`}>Phòng ban</th>
              <th className={th}>Nhóm</th>
              <th className={th}>Danh mục</th>
              <th className={th}>Ưu tiên mặc định</th>
              <th className={th}>Bảo mật</th>
              <th className={`${th} text-right`}>SLA riêng</th>
              <th className={`${th} text-right`}>Số ticket</th>
              <th className={th}>Trạng thái</th>
              <th className={`${th} border-r-0`}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className={erp.tr}>
                <td className={`${erp.td} border-l-0`}>{deptById(c.deptId)?.code}</td>
                <td className={erp.td}>{c.group}</td>
                <td className={`${erp.td} font-medium`}>{c.name}</td>
                <td className={erp.td}>
                  <PriorityTag p={c.priority} />
                </td>
                <td className={erp.td}>{c.confidential ? 'Có' : ''}</td>
                <td className={`${erp.td} ${erp.num}`}>{c.slaHours ? `${c.slaHours} giờ` : '—'}</td>
                <td className={`${erp.td} ${erp.num}`}>{used(c.id)}</td>
                <td className={erp.td}>{c.active ? <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-200">Đang dùng</Tag> : <Tag cls="bg-slate-50 text-slate-500 border-slate-200">Ngừng</Tag>}</td>
                <td className={`${erp.td} border-r-0 whitespace-nowrap`}>
                  <button type="button" className="text-[#1f5fa8] hover:underline cursor-pointer mr-3" onClick={() => (setEdit(structuredClone(c)), setErr(''))}>
                    Sửa
                  </button>
                  <button
                    type="button"
                    className={`cursor-pointer ${used(c.id) ? 'text-slate-300' : 'text-rose-600 hover:underline'}`}
                    title={used(c.id) ? 'Đã có ticket — chuyển sang Ngừng thay vì xoá' : 'Xoá'}
                    onClick={() => !used(c.id) && (deleteCat(c.id), flash(`Đã xoá ${c.name}`))}
                  >
                    <Trash2 size={12} className="inline" /> Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      {edit && (
        <Panel
          title={s.cats.some((c) => c.id === edit.id) ? `Sửa danh mục: ${edit.name}` : 'Thêm danh mục'}
          icon={Pencil}
          actions={
            <>
              <Btn className="h-7" onClick={() => setEdit(null)}>
                Huỷ
              </Btn>
              <Btn variant="primary" icon={Save} className="h-7" onClick={save} data-testid="cat-save">
                Lưu
              </Btn>
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="text-[12px]">
              Phòng ban
              <select value={edit.deptId} onChange={(e) => setEdit({ ...edit, deptId: e.target.value })} className={erp.inputFull}>
                {s.depts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[12px]">
              Nhóm (cấp 1)
              <input value={edit.group} onChange={(e) => setEdit({ ...edit, group: e.target.value })} className={erp.inputFull} list="tk-groups" />
              <datalist id="tk-groups">
                {[...new Set(s.cats.filter((c) => c.deptId === edit.deptId).map((c) => c.group))].map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </label>
            <label className="text-[12px]">
              Tên danh mục (cấp 2)
              <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className={erp.inputFull} />
            </label>
            <label className="text-[12px]">
              Ưu tiên mặc định
              <select value={edit.priority} onChange={(e) => setEdit({ ...edit, priority: e.target.value as TkPriority })} className={erp.inputFull}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABEL[p]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[12px]">
              SLA xử lý riêng (giờ làm việc)
              <input type="number" min={1} value={edit.slaHours ?? ''} onChange={(e) => setEdit({ ...edit, slaHours: e.target.value === '' ? undefined : Number(e.target.value) })} className={erp.inputFull} placeholder="Trống = theo mức ưu tiên" />
            </label>
            <div className="text-[12px] flex flex-col gap-1.5 mt-5">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={edit.confidential} onChange={(e) => setEdit({ ...edit, confidential: e.target.checked })} /> Bảo mật (chỉ người yêu cầu + người được giao xem nội dung)
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} /> Đang dùng
              </label>
            </div>
          </div>
          {err && <p className="text-[12px] text-rose-600 mt-2">{err}</p>}
        </Panel>
      )}
    </div>
  );
};
const SlaConfig: React.FC<{ flash: (m: string) => void }> = ({ flash }) => {
  const s = useTk();
  const [rows, setRows] = useState<TkSla[]>(() => structuredClone(s.sla));
  const [err, setErr] = useState('');
  const th = `${erp.th} border-t-0`;
  const save = () => {
    if (rows.some((r) => !(r.response > 0) || !(r.resolve > 0))) return setErr('Số giờ phải lớn hơn 0');
    if (rows.some((r) => r.resolve < r.response)) return setErr('Hạn xử lý không được nhỏ hơn hạn phản hồi');
    saveSla(rows);
    setErr('');
    flash('Đã lưu SLA — áp dụng cho ticket tạo mới');
  };
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[560px_1fr] gap-3 items-start">
      <Panel
        title="SLA theo mức ưu tiên (giờ làm việc)"
        icon={Settings}
        noPad
        actions={
          <Btn variant="primary" icon={Save} className="h-7" onClick={save} data-testid="sla-save">
            Lưu
          </Btn>
        }
      >
        <table className={erp.table}>
          <thead>
            <tr>
              <th className={`${th} border-l-0 text-left`}>Mức ưu tiên</th>
              <th className={`${th} text-right`}>Phản hồi đầu (giờ)</th>
              <th className={`${th} border-r-0 text-right`}>Xử lý xong (giờ)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.priority} className={erp.tr}>
                <td className={`${erp.td} border-l-0`}>
                  <PriorityTag p={r.priority} />
                </td>
                {(['response', 'resolve'] as const).map((k, j) => (
                  <td key={k} className={`${erp.td} ${j ? 'border-r-0' : ''}`}>
                    <input type="number" min={0.5} step={0.5} value={r[k]} onChange={(e) => setRows((x) => x.map((y, n) => (n === i ? { ...y, [k]: Number(e.target.value) } : y)))} className={`${erp.inputFull} h-7 text-right`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {err && <p className="text-[12px] text-rose-600 px-3 py-2">{err}</p>}
      </Panel>
      <Panel title="Quy tắc chung" icon={Settings}>
        <ul className="list-disc pl-5 space-y-1.5 text-[12.5px] text-slate-700">
          <li>Giờ làm việc: thứ 2 – thứ 6, 8:00–12:00 và 13:00–17:00 (8 giờ/ngày). SLA chỉ tính trong giờ làm việc.</li>
          <li>Trạng thái "Chờ người yêu cầu": đồng hồ SLA tạm dừng, chạy tiếp khi người yêu cầu phản hồi (trên iMIS hoặc trả lời mail).</li>
          <li>Nhắc hạn: còn dưới 20% thời gian → "Sắp quá hạn"; quá hạn → báo trưởng nhóm.</li>
          <li>Ticket "Đã giải quyết" tự đóng sau 3 ngày làm việc nếu người yêu cầu không xác nhận; mở lại được trong 7 ngày.</li>
          <li>Ticket bảo mật: mail thông báo chỉ có tiêu đề và link, không kèm nội dung; không thêm người theo dõi.</li>
          <li>Chuyển tiếp sang phòng khác: ticket về "Mới", hạn SLA tính lại từ lúc chuyển.</li>
        </ul>
      </Panel>
    </div>
  );
};
