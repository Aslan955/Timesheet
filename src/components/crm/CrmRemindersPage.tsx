/**
 * CRM · Module 03 — Hệ thống cảnh báo sớm.
 *  • Hôm nay & quá hạn: mốc trong 7 ngày tới + mốc đã qua chưa xử lý (nhắc lại, kể cả khi đã quá ngày)
 *  • Sắp tới 7 / 14 / 30 ngày
 *  • Overview đầu tháng: danh sách sự kiện trong tháng gửi tự động 08:00 ngày 1 (mô phỏng)
 *  • Cảnh báo: cam kết quá hạn, khách lâu chưa tiếp xúc
 * Trạng thái mỗi lần nhắc: Chưa xử lý · Đã chúc · Đã gửi quà (ghi sổ quà tặng) · Bỏ qua (ghi lý do).
 */
import React, { useMemo, useState } from 'react';
import { AlarmClock, BellRing, CalendarDays, CheckCircle2, Gift as GiftIcon, Mail, MailCheck, SkipForward, TriangleAlert, Users } from 'lucide-react';
import { Btn, ErpPage, FolderTabs, FormRow, KpiBox, Panel, Segmented, erp } from '../erp/Erp';
import {
  CRM_USERS, Customer, EVENT_KIND_LABEL, EventKind, Gift, REMIND_BEFORE, STALE_DAYS, addDaysIso, canSeeCustomer, daysBetween, dm, dmy, isTop, lastContactOf, todayIso, uid, userName,
} from '../../crm/crmData';
import { crm, useCrm, useMe } from '../../crm/crmStore';
import { ReminderItem, occurrencesIn, toItem, useReminders } from '../../crm/crmHooks';
import { CrmTitle, DivTag, DueText, KindDot, Modal, ReminderTag, TierTag, useToast } from './crmUi';

type Tab = 'today' | 'upcoming' | 'overview' | 'alerts';

export const CrmRemindersPage: React.FC<{ onOpenCustomer?: (id: string) => void }> = ({ onOpenCustomer }) => {
  const { active, open, overdue } = useReminders();
  const s = useCrm();
  const me = useMe();
  const [tab, setTab] = useState<Tab>('today');
  const { toast, toastNode } = useToast();
  const t = todayIso();
  const mine = s.customers.filter((c) => !c.archived && canSeeCustomer(me, c));
  const lateCommit = mine.flatMap((c) => c.commitments.filter((x) => !x.done && x.dueDate < t).map((x) => ({ c, x })));
  const stale = mine.filter((c) => daysBetween(lastContactOf(c) || '2000-01-01', t) > STALE_DAYS);
  return (
    <ErpPage>
      {toastNode}
      <CrmTitle page="Nhắc việc" title="Nhắc việc & cảnh báo sớm" meta={[{ label: 'Quy tắc', value: `Nhắc trước ${REMIND_BEFORE} ngày · overview 08:00 ngày 1 hằng tháng · chưa xử lý thì nhắc lại` }]} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <KpiBox label="Cần xử lý (7 ngày tới)" value={open.length - overdue.length} sub={`${active.length} mốc đang mở nhắc`} onClick={() => setTab('today')} active={tab === 'today'} />
        <KpiBox label="Quá hạn chưa xử lý" value={overdue.length} tone={overdue.length ? 'bad' : 'good'} sub="Hệ thống nhắc lại mỗi ngày" onClick={() => setTab('today')} />
        <KpiBox label="Cam kết quá hạn" value={lateCommit.length} tone={lateCommit.length ? 'bad' : 'good'} sub="Cam kết với khách chưa hoàn thành" onClick={() => setTab('alerts')} active={tab === 'alerts'} />
        <KpiBox label={`Lâu chưa tiếp xúc (> ${STALE_DAYS} ngày)`} value={stale.length} tone={stale.length ? 'bad' : 'good'} sub="Khách cần chủ động liên hệ" onClick={() => setTab('alerts')} />
      </div>
      <div>
        <FolderTabs
          tabs={[
            { key: 'today', label: `Hôm nay & quá hạn (${open.length})`, icon: BellRing },
            { key: 'upcoming', label: 'Sắp tới', icon: CalendarDays },
            { key: 'overview', label: 'Overview đầu tháng', icon: Mail },
            { key: 'alerts', label: `Cảnh báo (${lateCommit.length + stale.length})`, icon: TriangleAlert },
          ]}
          value={tab}
          onChange={setTab}
        />
        <div className="pt-3 space-y-3">
          {tab === 'today' && <TodayTab items={active} toast={toast} onOpenCustomer={onOpenCustomer} />}
          {tab === 'upcoming' && <UpcomingTab toast={toast} onOpenCustomer={onOpenCustomer} />}
          {tab === 'overview' && <OverviewTab toast={toast} />}
          {tab === 'alerts' && <AlertsTab lateCommit={lateCommit} stale={stale} onOpenCustomer={onOpenCustomer} />}
        </div>
      </div>
    </ErpPage>
  );
};

// ==========================================================================
// Bảng nhắc việc (dùng chung)
// ==========================================================================
export const ReminderTable: React.FC<{ items: ReminderItem[]; toast: (m: string) => void; onOpenCustomer?: (id: string) => void; empty?: string; compact?: boolean }> = ({ items, toast, onOpenCustomer, empty = 'Không có nhắc việc.', compact }) => {
  const s = useCrm();
  const [skip, setSkip] = useState<ReminderItem | null>(null);
  const [gift, setGift] = useState<ReminderItem | null>(null);
  const customerOf = (id?: string) => s.customers.find((c) => c.id === id);
  return (
    <>
      <div className="overflow-x-auto">
        <table className={erp.table}>
          <thead>
            <tr>
              {['Ngày', 'Loại mốc', 'Nội dung', ...(compact ? [] : ['Khối', 'Tier', 'Người nhận nhắc']), 'Trạng thái', 'Xử lý'].map((h, i, arr) => (
                <th key={h} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === arr.length - 1 ? 'border-r-0' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((x) => {
              const c = customerOf(x.customerId);
              return (
                <tr key={x.id} className={`${erp.tr} ${x.days < 0 && x.status === 'Chưa xử lý' ? '!bg-rose-50/60' : ''}`} data-testid={`rm-${x.id}`}>
                  <td className={`${erp.td} border-l-0 whitespace-nowrap`}>
                    <b className="tabular-nums">{dmy(x.date)}</b>
                    <div>
                      <DueText days={x.days} />
                    </div>
                    {x.lunar && <div className="text-[11px] text-slate-500">{x.lunar}</div>}
                  </td>
                  <td className={erp.td}>
                    <KindDot k={x.kind} label />
                  </td>
                  <td className={`${erp.td} min-w-[260px]`}>
                    <p className="font-semibold text-slate-800">{x.title}</p>
                    <p className="text-[11.5px] text-slate-500">
                      {c && onOpenCustomer ? (
                        <button type="button" onClick={() => onOpenCustomer(c.id)} className="text-[#1f5fa8] hover:underline cursor-pointer text-left">
                          {x.sub}
                        </button>
                      ) : (
                        x.sub
                      )}
                    </p>
                    {x.state?.reason && <p className="text-[11px] text-slate-500 italic">Lý do bỏ qua: {x.state.reason}</p>}
                  </td>
                  {!compact && (
                    <>
                      <td className={erp.td}>
                        <DivTag d={x.division} />
                      </td>
                      <td className={erp.td}>{x.tier ? <TierTag t={x.tier} /> : '—'}</td>
                      <td className={`${erp.td} text-[12px] text-slate-600 min-w-[150px]`}>{x.recipients.join(', ') || '—'}</td>
                    </>
                  )}
                  <td className={`${erp.td} whitespace-nowrap`}>
                    <ReminderTag s={x.status} overdue={x.days < 0} />
                    {x.state && <div className="text-[11px] text-slate-400 mt-0.5">{userName(x.state.by)}</div>}
                  </td>
                  <td className={`${erp.td} border-r-0 whitespace-nowrap`}>
                    {x.status === 'Chưa xử lý' ? (
                      <span className="flex gap-1">
                        <Btn className="h-7 px-2" icon={CheckCircle2} title="Đã chúc" onClick={() => (crm.setReminder(x.id, 'Đã chúc', undefined, x.title), toast(`Đã ghi nhận: Đã chúc — ${x.title}`))} data-testid={`rm-wish-${x.id}`}>
                          {!compact && 'Đã chúc'}
                        </Btn>
                        <Btn className="h-7 px-2" icon={GiftIcon} title="Đã gửi quà — ghi sổ quà tặng" onClick={() => setGift(x)}>
                          {!compact && 'Gửi quà'}
                        </Btn>
                        <Btn className="h-7 px-2" icon={SkipForward} title="Bỏ qua (ghi lý do)" onClick={() => setSkip(x)}>
                          {!compact && 'Bỏ qua'}
                        </Btn>
                      </span>
                    ) : (
                      <button type="button" className="text-[12px] text-slate-500 hover:text-[#1f5fa8] hover:underline cursor-pointer" onClick={() => crm.setReminder(x.id, 'Chưa xử lý', undefined, x.title)}>
                        Mở lại
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {!items.length && (
              <tr>
                <td colSpan={compact ? 5 : 8} className={`${erp.td} border-x-0 py-8 text-center text-slate-400`}>
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {skip && <SkipModal item={skip} onClose={() => setSkip(null)} toast={toast} />}
      {gift && <GiftModal item={gift} onClose={() => setGift(null)} toast={toast} />}
    </>
  );
};

const SkipModal: React.FC<{ item: ReminderItem; onClose: () => void; toast: (m: string) => void }> = ({ item, onClose, toast }) => {
  const [r, setR] = useState('');
  const [tried, setTried] = useState(false);
  return (
    <Modal
      open
      onClose={onClose}
      title={`Bỏ qua nhắc việc — ${item.title}`}
      footer={
        <>
          <Btn onClick={onClose}>Huỷ</Btn>
          <Btn
            variant="primary"
            icon={SkipForward}
            onClick={() => {
              if (!r.trim()) return setTried(true);
              crm.setReminder(item.id, 'Bỏ qua', r.trim(), item.title);
              toast('Đã bỏ qua nhắc việc');
              onClose();
            }}
            data-testid="rm-skip-ok"
          >
            Bỏ qua
          </Btn>
        </>
      }
    >
      <FormRow label="Lý do bỏ qua" required error={tried && !r.trim() ? 'Bắt buộc ghi lý do' : undefined}>
        <textarea rows={3} value={r} onChange={(e) => setR(e.target.value)} className={`${erp.inputFull} h-auto py-1.5`} placeholder="VD: Khách đã nghỉ hưu / đã chúc trực tiếp tại sự kiện…" data-testid="rm-skip-reason" />
      </FormRow>
    </Modal>
  );
};

/** Ghi "Đã gửi quà" + thêm dòng vào sổ cái quà tặng. */
export const GiftModal: React.FC<{ item?: ReminderItem; onClose: () => void; toast: (m: string) => void; customerId?: string }> = ({ item, onClose, toast, customerId }) => {
  const s = useCrm();
  const me = useMe();
  const visible = s.customers.filter((c) => !c.archived && canSeeCustomer(me, c));
  const [g, setG] = useState<Gift>(() => {
    const cid = item?.customerId || customerId || visible[0]?.id || '';
    const c = s.customers.find((x) => x.id === cid);
    return {
      id: uid('gf'),
      date: todayIso(),
      customerId: cid,
      contactId: item?.contactId || c?.contacts.find((k) => k.primary)?.id,
      occasion: item ? item.title.replace(/^Sinh nhật .*/, 'Sinh nhật') : '',
      item: '',
      value: 0,
      quantity: 1,
      givenBy: me.id,
      division: (c?.division || me.division || 'G1') as Gift['division'],
      note: '',
      occurrenceKey: item?.id,
    };
  });
  const [tried, setTried] = useState(false);
  const c = s.customers.find((x) => x.id === g.customerId);
  const E = { customer: !g.customerId, item: !g.item.trim(), occasion: !g.occasion.trim(), value: g.value <= 0 };
  const bad = Object.values(E).some(Boolean);
  return (
    <Modal
      open
      onClose={onClose}
      width="max-w-2xl"
      title={item ? `Đã gửi quà — ${item.title}` : 'Ghi quà tặng'}
      footer={
        <>
          <Btn onClick={onClose}>Huỷ</Btn>
          <Btn
            variant="primary"
            icon={GiftIcon}
            onClick={() => {
              if (bad) return setTried(true);
              crm.addGift({ ...g, item: g.item.trim(), occasion: g.occasion.trim(), division: c?.division || g.division });
              if (item) crm.setReminder(item.id, 'Đã gửi quà', undefined, item.title);
              toast(`Đã ghi quà tặng: ${g.item}`);
              onClose();
            }}
            data-testid="gift-save"
          >
            Lưu vào sổ quà tặng
          </Btn>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormRow label="Khách hàng" required error={tried && E.customer ? 'Bắt buộc' : undefined} className="sm:col-span-2">
          <select
            value={g.customerId}
            disabled={!!item?.customerId}
            onChange={(e) => {
              const k = s.customers.find((x) => x.id === e.target.value);
              setG({ ...g, customerId: e.target.value, contactId: k?.contacts.find((y) => y.primary)?.id, division: (k?.division || g.division) as Gift['division'] });
            }}
            className={`${erp.inputFull} cursor-pointer`}
          >
            {visible.map((k) => (
              <option key={k.id} value={k.id}>
                {k.code} · {k.name}
              </option>
            ))}
          </select>
        </FormRow>
        <FormRow label="Người nhận">
          <select value={g.contactId || ''} onChange={(e) => setG({ ...g, contactId: e.target.value || undefined })} className={`${erp.inputFull} cursor-pointer`}>
            <option value="">Cơ quan</option>
            {c?.contacts.map((k) => (
              <option key={k.id} value={k.id}>
                {k.name} — {k.title}
              </option>
            ))}
          </select>
        </FormRow>
        <FormRow label="Ngày tặng" required>
          <input type="date" value={g.date} onChange={(e) => setG({ ...g, date: e.target.value })} className={erp.inputFull} />
        </FormRow>
        <FormRow label="Dịp" required error={tried && E.occasion ? 'Bắt buộc' : undefined}>
          <input value={g.occasion} onChange={(e) => setG({ ...g, occasion: e.target.value })} className={erp.inputFull} list="gift-occasions" />
        </FormRow>
        <FormRow label="Quà tặng" required error={tried && E.item ? 'Bắt buộc' : undefined}>
          <input value={g.item} onChange={(e) => setG({ ...g, item: e.target.value })} className={erp.inputFull} placeholder="VD: Lẵng hoa chúc mừng" list="gift-items" data-testid="gift-item" />
        </FormRow>
        <FormRow label="Đơn giá (VNĐ)" required error={tried && E.value ? 'Lớn hơn 0' : undefined}>
          <input value={g.value ? g.value.toLocaleString('en-US') : ''} onChange={(e) => setG({ ...g, value: Number(e.target.value.replace(/\D/g, '')) || 0 })} className={`${erp.inputFull} text-right tabular-nums`} data-testid="gift-value" />
        </FormRow>
        <FormRow label="Số lượng">
          <input type="number" min={1} value={g.quantity} onChange={(e) => setG({ ...g, quantity: Math.max(1, Number(e.target.value) || 1) })} className={`${erp.inputFull} text-right`} />
        </FormRow>
        <FormRow label="Người tặng">
          <select value={g.givenBy} onChange={(e) => setG({ ...g, givenBy: e.target.value })} className={`${erp.inputFull} cursor-pointer`}>
            {CRM_USERS.filter((u) => isTop(u) || u.division === (c?.division || me.division)).map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </FormRow>
        <FormRow label="Ghi chú" className="sm:col-span-2">
          <input value={g.note} onChange={(e) => setG({ ...g, note: e.target.value })} className={erp.inputFull} />
        </FormRow>
      </div>
      <datalist id="gift-occasions">
        {['Sinh nhật', 'Tết Nguyên đán', 'Ngày thành lập cơ quan', 'Ngày Doanh nhân Việt Nam', 'Ngày Nhà giáo Việt Nam', 'Ngày Thầy thuốc Việt Nam', 'Quốc tế Phụ nữ 8/3', 'Ngày Phụ nữ Việt Nam 20/10', 'Sự kiện đối ngoại'].map((x) => (
          <option key={x} value={x} />
        ))}
      </datalist>
      <datalist id="gift-items">
        {['Lẵng hoa chúc mừng', 'Hộp quà Tết cao cấp', 'Tranh sơn mài', 'Hoa + thiệp chúc mừng', 'Bánh Trung thu', 'Trà / đặc sản'].map((x) => (
          <option key={x} value={x} />
        ))}
      </datalist>
    </Modal>
  );
};

// ==========================================================================
// Các tab
// ==========================================================================
const TodayTab: React.FC<{ items: ReminderItem[]; toast: (m: string) => void; onOpenCustomer?: (id: string) => void }> = ({ items, toast, onOpenCustomer }) => {
  const [show, setShow] = useState<'open' | 'all'>('open');
  const list = (show === 'open' ? items.filter((x) => x.status === 'Chưa xử lý') : items).sort((a, b) => a.date.localeCompare(b.date));
  return (
    <Panel
      title="Hôm nay — việc cần xử lý"
      icon={AlarmClock}
      noPad
      actions={
        <Segmented
          options={[
            { key: 'open', label: 'Chưa xử lý' },
            { key: 'all', label: 'Tất cả' },
          ]}
          value={show}
          onChange={setShow}
        />
      }
      footer={`Gồm mốc trong ${REMIND_BEFORE} ngày tới và mốc đã qua chưa xử lý (nhắc lại tối đa 30 ngày sau mốc). Người nhận: nhân sự khối & GĐK của khách; Chủ tịch / BP Đối ngoại xem tổng.`}
    >
      <ReminderTable items={list} toast={toast} onOpenCustomer={onOpenCustomer} empty="Không còn việc chưa xử lý — tuyệt vời!" />
    </Panel>
  );
};

const UpcomingTab: React.FC<{ toast: (m: string) => void; onOpenCustomer?: (id: string) => void }> = ({ toast, onOpenCustomer }) => {
  const s = useCrm();
  const me = useMe();
  const [range, setRange] = useState<'7' | '14' | '30'>('7');
  const [kind, setKind] = useState<EventKind | ''>('');
  const t = todayIso();
  const items = useMemo(
    () => occurrencesIn(s, me, t, addDaysIso(t, Number(range))).map((o) => toItem(s, o, t)).filter((x) => !kind || x.kind === kind),
    [s, me, t, range, kind],
  );
  return (
    <Panel
      title={`Sắp tới ${range} ngày (${items.length})`}
      icon={CalendarDays}
      noPad
      actions={
        <>
          <select value={kind} onChange={(e) => setKind(e.target.value as EventKind | '')} className="h-7 border border-slate-300 rounded-[3px] px-2 text-[12px] bg-white cursor-pointer">
            <option value="">Tất cả loại mốc</option>
            {(Object.keys(EVENT_KIND_LABEL) as EventKind[]).map((k) => (
              <option key={k} value={k}>
                {EVENT_KIND_LABEL[k]}
              </option>
            ))}
          </select>
          <Segmented
            options={[
              { key: '7', label: '7 ngày' },
              { key: '14', label: '14 ngày' },
              { key: '30', label: '30 ngày' },
            ]}
            value={range}
            onChange={setRange}
          />
        </>
      }
    >
      <ReminderTable items={items} toast={toast} onOpenCustomer={onOpenCustomer} empty="Không có mốc nào trong khoảng này." />
    </Panel>
  );
};

const OverviewTab: React.FC<{ toast: (m: string) => void }> = ({ toast }) => {
  const s = useCrm();
  const me = useMe();
  const t = todayIso();
  const [month, setMonth] = useState(t.slice(0, 7));
  const from = `${month}-01`;
  const end = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate();
  const items = occurrencesIn(s, me, from, `${month}-${end}`).map((o) => toItem(s, o, t));
  const byKind = (Object.keys(EVENT_KIND_LABEL) as EventKind[]).map((k) => ({ k, n: items.filter((x) => x.kind === k).length })).filter((x) => x.n);
  const recipients = isTop(me) ? 'Chủ tịch HĐQT, BP Đối ngoại (tổng) · từng GĐK & nhân sự khối (phần của mình)' : me.role === 'gdk' ? `GĐK khối ${me.division} + nhân sự khối` : me.name;
  const weeks = [1, 8, 15, 22, 29].map((d, i) => ({ label: `Tuần ${i + 1} (${String(d).padStart(2, '0')}–${String(Math.min(d + 6, end)).padStart(2, '0')})`, list: items.filter((x) => +x.date.slice(8, 10) >= d && +x.date.slice(8, 10) <= d + 6) })).filter((w) => w.list.length);
  return (
    <Panel
      title="Overview đầu tháng"
      icon={MailCheck}
      actions={
        <>
          <input type="month" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} className={`${erp.input} w-40`} />
          <Btn
            variant="primary"
            icon={Mail}
            onClick={() => {
              crm.audit('Nhắc việc', `Overview ${month.slice(5)}/${month.slice(0, 4)}`, `Gửi ${items.length} mốc tới: ${recipients}`);
              toast(`Đã gửi overview tháng ${month.slice(5)}/${month.slice(0, 4)} (mô phỏng)`);
            }}
            data-testid="rm-send-overview"
          >
            Gửi ngay (mô phỏng)
          </Btn>
        </>
      }
      footer="Hệ thống tự gửi email overview lúc 08:00 ngày 1 hằng tháng; mỗi người nhận chỉ thấy các mốc trong phạm vi quyền của mình."
    >
      <div className="max-w-3xl mx-auto border border-slate-300 rounded-[4px] overflow-hidden bg-white shadow-sm" data-testid="rm-overview">
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 text-[12px] text-slate-600 space-y-0.5">
          <p>
            <b className="text-slate-700">Từ:</b> CRM iMIS &lt;crm@aequitas.vn&gt;
          </p>
          <p>
            <b className="text-slate-700">Tới:</b> {recipients}
          </p>
          <p>
            <b className="text-slate-700">Tiêu đề:</b> [CRM] Lịch ngoại giao tháng {month.slice(5)}/{month.slice(0, 4)} — {items.length} mốc cần lưu ý
          </p>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-[13px] text-slate-700">
            Kính gửi anh/chị, dưới đây là các mốc trong tháng <b>{month.slice(5)}/{month.slice(0, 4)}</b> thuộc phạm vi của anh/chị. Hệ thống sẽ nhắc lại trước mỗi mốc {REMIND_BEFORE} ngày.
          </p>
          <div className="flex flex-wrap gap-2">
            {byKind.map(({ k, n }) => (
              <span key={k} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-[12px]">
                <KindDot k={k} /> {EVENT_KIND_LABEL[k]}: <b>{n}</b>
              </span>
            ))}
          </div>
          {weeks.map((w) => (
            <div key={w.label}>
              <p className="text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide border-b border-slate-200 pb-1 mb-1">{w.label}</p>
              <ul className="space-y-1">
                {w.list.map((x) => (
                  <li key={x.id} className="flex items-start gap-2 text-[12.5px]">
                    <span className="w-12 shrink-0 tabular-nums font-semibold text-slate-700">{dm(x.date)}</span>
                    <KindDot k={x.kind} />
                    <span className="min-w-0">
                      <b className="text-slate-800">{x.title}</b> <span className="text-slate-500">— {x.sub}</span>
                      {x.lunar && <span className="text-slate-400"> ({x.lunar})</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {!items.length && <p className="text-[12.5px] text-slate-400 text-center py-4">Không có mốc nào trong tháng.</p>}
        </div>
      </div>
    </Panel>
  );
};

const AlertsTab: React.FC<{ lateCommit: { c: Customer; x: Customer['commitments'][number] }[]; stale: Customer[]; onOpenCustomer?: (id: string) => void }> = ({ lateCommit, stale, onOpenCustomer }) => {
  const t = todayIso();
  const link = (c: Customer) =>
    onOpenCustomer ? (
      <button type="button" onClick={() => onOpenCustomer(c.id)} className="text-left text-[#1f5fa8] hover:underline cursor-pointer font-semibold">
        {c.code} · {c.name}
      </button>
    ) : (
      `${c.code} · ${c.name}`
    );
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
      <Panel title={`Cam kết quá hạn (${lateCommit.length})`} icon={TriangleAlert} noPad>
        <table className={erp.table}>
          <thead>
            <tr>
              {['Khách hàng', 'Cam kết', 'Hạn', 'Người thực hiện'].map((h, i) => (
                <th key={h} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 3 ? 'border-r-0' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lateCommit.map(({ c, x }) => (
              <tr key={x.id} className={erp.tr}>
                <td className={`${erp.td} border-l-0`}>{link(c)}</td>
                <td className={erp.td}>{x.content}</td>
                <td className={`${erp.td} whitespace-nowrap`}>
                  {dmy(x.dueDate)} <DueText days={daysBetween(t, x.dueDate)} />
                </td>
                <td className={`${erp.td} border-r-0 whitespace-nowrap`}>{userName(x.ownerId)}</td>
              </tr>
            ))}
            {!lateCommit.length && (
              <tr>
                <td colSpan={4} className={`${erp.td} border-x-0 py-6 text-center text-slate-400`}>
                  Không có cam kết quá hạn.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>
      <Panel title={`Lâu chưa tiếp xúc > ${STALE_DAYS} ngày (${stale.length})`} icon={Users} noPad>
        <table className={erp.table}>
          <thead>
            <tr>
              {['Khách hàng', 'Khối', 'Tier', 'Tiếp xúc gần nhất', 'Phụ trách'].map((h, i) => (
                <th key={h} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 4 ? 'border-r-0' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stale
              .sort((a, b) => (lastContactOf(a) || '').localeCompare(lastContactOf(b) || ''))
              .map((c) => {
                const last = lastContactOf(c);
                return (
                  <tr key={c.id} className={erp.tr}>
                    <td className={`${erp.td} border-l-0`}>{link(c)}</td>
                    <td className={erp.td}>
                      <DivTag d={c.division} />
                    </td>
                    <td className={erp.td}>
                      <TierTag t={c.tier} />
                    </td>
                    <td className={`${erp.td} whitespace-nowrap text-rose-600 font-semibold`}>{last ? `${dmy(last)} (${daysBetween(last, t)} ngày)` : 'Chưa từng'}</td>
                    <td className={`${erp.td} border-r-0 text-[12px]`}>{c.ownerIds.map(userName).join(', ') || '—'}</td>
                  </tr>
                );
              })}
            {!stale.length && (
              <tr>
                <td colSpan={5} className={`${erp.td} border-x-0 py-6 text-center text-slate-400`}>
                  Không có khách lâu chưa tiếp xúc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
};

