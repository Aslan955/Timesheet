/** CRM · Bảng điều khiển: toàn bộ (Chủ tịch / TGĐ / ĐN) · khối mình (GĐK, nhân sự khối). */
import React from 'react';
import { AlarmClock, BarChart3, CalendarDays, Cake, Gift as GiftIcon, TriangleAlert } from 'lucide-react';
import { Btn, ErpPage, KpiBox, Panel, erp } from '../erp/Erp';
import { CRM_DIVISIONS, EVENT_KIND_LABEL, EventKind, STALE_DAYS, addDaysIso, canSeeCustomer, daysBetween, dm, fmtMoney, isTop, lastContactOf, todayIso } from '../../crm/crmData';
import { useCrm, useMe } from '../../crm/crmStore';
import { occurrencesIn, toItem, useReminders } from '../../crm/crmHooks';
import { ReminderTable } from './CrmRemindersPage';
import { CrmTitle, DivTag, DueText, KindDot, useToast } from './crmUi';

export const CrmDashboardPage: React.FC<{ onNavigate?: (p: string) => void; onOpenCustomer?: (id: string) => void }> = ({ onNavigate, onOpenCustomer }) => {
  const s = useCrm();
  const me = useMe();
  const { toast, toastNode } = useToast();
  const { active, open, overdue } = useReminders();
  const t = todayIso();
  const y = t.slice(0, 4);
  // Bảng điều khiển: GĐK & nhân sự khối xem cả khối mình
  const scope = s.customers.filter((c) => !c.archived && (isTop(me) || c.division === me.division));
  const mine = scope.filter((c) => canSeeCustomer(me, c) || me.role === 'nsk');
  const contacts = mine.reduce((a, c) => a + c.contacts.length, 0);
  const upcoming = occurrencesIn(s, me, t, addDaysIso(t, 30)).map((o) => toItem(s, o, t));
  const bdays = upcoming.filter((x) => x.kind === 'birthday');
  const gifts = s.gifts.filter((g) => g.date.startsWith(y) && (isTop(me) || g.division === me.division));
  const giftValue = gifts.reduce((a, g) => a + g.value * g.quantity, 0);
  const stale = mine.filter((c) => daysBetween(lastContactOf(c) || '2000-01-01', t) > STALE_DAYS);
  const late = mine.flatMap((c) => c.commitments.filter((x) => !x.done && x.dueDate < t));
  const divs = isTop(me) ? [...CRM_DIVISIONS] : [me.division!];
  const today = active.filter((x) => x.status === 'Chưa xử lý').sort((a, b) => a.date.localeCompare(b.date)).slice(0, 8);

  return (
    <ErpPage>
      {toastNode}
      <CrmTitle page="Tổng quan" title="CRM — Tổng quan quan hệ khách hàng" meta={[{ label: 'Hôm nay', value: t.split('-').reverse().join('/') }]} />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
        <KpiBox label="Khách hàng" value={mine.length} sub={`${scope.filter((c) => c.tier === 'Tier 1').length} khách Tier 1`} onClick={() => onNavigate?.('Danh bạ khách hàng')} />
        <KpiBox label="Đầu mối" value={contacts} sub={`${mine.reduce((a, c) => a + c.contacts.filter((k) => k.role === 'Decision Maker').length, 0)} Decision Maker`} />
        <KpiBox label="Nhắc việc chưa xử lý" value={open.length} sub={`${overdue.length} quá hạn`} tone={overdue.length ? 'bad' : 'neutral'} onClick={() => onNavigate?.('Nhắc việc')} />
        <KpiBox label="Sinh nhật 30 ngày tới" value={bdays.length} sub="Đầu mối khách hàng" onClick={() => onNavigate?.('Lịch ngoại giao')} />
        <KpiBox label={`Lâu chưa tiếp xúc > ${STALE_DAYS} ngày`} value={stale.length} tone={stale.length ? 'bad' : 'good'} sub={`${late.length} cam kết quá hạn`} onClick={() => onNavigate?.('Nhắc việc')} />
        <KpiBox label={`Quà tặng năm ${y} (VNĐ)`} value={fmtMoney(giftValue)} valueText={fmtMoney(giftValue)} sub={`${gifts.length} lần tặng`} onClick={() => onNavigate?.('Sổ quà tặng')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] gap-3">
        <Panel
          title={`Hôm nay — cần xử lý (${open.length})`}
          icon={AlarmClock}
          noPad
          actions={
            <Btn className="h-7" onClick={() => onNavigate?.('Nhắc việc')}>
              Mở Nhắc việc
            </Btn>
          }
        >
          <ReminderTable items={today} toast={toast} onOpenCustomer={onOpenCustomer} compact empty="Không còn việc cần xử lý hôm nay." />
        </Panel>
        <Panel title="Sắp tới 30 ngày" icon={CalendarDays} noPad>
          <div className="max-h-[420px] overflow-auto divide-y divide-slate-100">
            {upcoming.slice(0, 40).map((x) => (
              <div key={x.id} className="flex items-start gap-2.5 px-3 py-1.5">
                <span className="w-11 shrink-0 text-center">
                  <b className="block text-[13px] tabular-nums text-[#1e3a5f]">{dm(x.date)}</b>
                </span>
                <KindDot k={x.kind} />
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-semibold text-slate-800 truncate" title={x.title}>
                    {x.title}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate" title={x.sub}>
                    {x.sub}
                  </p>
                </div>
                <DueText days={x.days} />
              </div>
            ))}
            {!upcoming.length && <p className="px-3 py-8 text-center text-[12.5px] text-slate-400">Không có mốc nào.</p>}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        <Panel title={isTop(me) ? 'Theo khối' : `Khối ${me.division}`} icon={BarChart3} noPad>
          <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                {['Khối', 'Khách hàng', 'Tier 1', 'Đầu mối', 'Nhắc chưa xử lý', 'Lâu chưa tiếp xúc', 'Cam kết quá hạn', 'Quà tặng năm'].map((h, i) => (
                  <th key={h} className={`${erp.th} ${i ? 'text-right' : 'text-left'} border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 7 ? 'border-r-0' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {divs.map((d) => {
                const cs = scope.filter((c) => c.division === d);
                const rem = open.filter((x) => x.division === d).length;
                const st = cs.filter((c) => daysBetween(lastContactOf(c) || '2000-01-01', t) > STALE_DAYS).length;
                const lc = cs.reduce((a, c) => a + c.commitments.filter((x) => !x.done && x.dueDate < t).length, 0);
                const gv = gifts.filter((g) => g.division === d).reduce((a, g) => a + g.value * g.quantity, 0);
                return (
                  <tr key={d} className={erp.tr}>
                    <td className={`${erp.td} border-l-0`}>
                      <DivTag d={d} />
                    </td>
                    <td className={`${erp.td} ${erp.num} font-semibold`}>{cs.length}</td>
                    <td className={`${erp.td} ${erp.num}`}>{cs.filter((c) => c.tier === 'Tier 1').length}</td>
                    <td className={`${erp.td} ${erp.num}`}>{cs.reduce((a, c) => a + c.contacts.length, 0)}</td>
                    <td className={`${erp.td} ${erp.num} ${rem ? 'text-amber-700 font-semibold' : ''}`}>{rem}</td>
                    <td className={`${erp.td} ${erp.num} ${st ? 'text-rose-600 font-semibold' : ''}`}>{st}</td>
                    <td className={`${erp.td} ${erp.num} ${lc ? 'text-rose-600 font-semibold' : ''}`}>{lc}</td>
                    <td className={`${erp.td} ${erp.num} border-r-0`}>{fmtMoney(gv)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </Panel>
        <Panel title="Mốc 30 ngày tới theo loại" icon={TriangleAlert}>
          <div className="space-y-2">
            {(Object.keys(EVENT_KIND_LABEL) as EventKind[]).map((k) => {
              const n = upcoming.filter((x) => x.kind === k).length;
              const max = Math.max(1, ...(Object.keys(EVENT_KIND_LABEL) as EventKind[]).map((kk) => upcoming.filter((x) => x.kind === kk).length));
              return (
                <div key={k} className="grid grid-cols-[180px_minmax(0,1fr)_40px] items-center gap-2 text-[12.5px]">
                  <KindDot k={k} label />
                  <span className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <span className="block h-full rounded-full bg-[#1f5fa8]" style={{ width: `${(n / max) * 100}%` }} />
                  </span>
                  <b className="text-right tabular-nums">{n}</b>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-[12px] font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Cake size={13} className="text-rose-500" /> Sinh nhật sắp tới
            </p>
            <ul className="space-y-1">
              {bdays.slice(0, 6).map((x) => (
                <li key={x.id} className="flex items-center gap-2 text-[12.5px]">
                  <b className="w-12 tabular-nums text-[#1e3a5f]">{dm(x.date)}</b>
                  <button type="button" onClick={() => x.customerId && onOpenCustomer?.(x.customerId)} className="min-w-0 flex-1 truncate text-left hover:text-[#1f5fa8] cursor-pointer">
                    {x.title.replace('Sinh nhật ', '')} <span className="text-slate-500">— {x.sub}</span>
                  </button>
                  <DueText days={x.days} />
                </li>
              ))}
              {!bdays.length && <li className="text-[12px] text-slate-400">Không có.</li>}
            </ul>
          </div>
          <p className="mt-3 text-[11.5px] text-slate-500 flex items-center gap-1.5">
            <GiftIcon size={12} /> Ghi quà tặng khi xử lý nhắc việc để có sổ cái lịch sử đầy đủ.
          </p>
        </Panel>
      </div>
    </ErpPage>
  );
};
