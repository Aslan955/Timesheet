/** Tính mốc lịch & nhắc việc theo người dùng đang xem (dùng chung Tổng quan / Lịch / Nhắc việc). */
import { useMemo } from 'react';
import { CrmUser, Occurrence, REMIND_BEFORE, ReminderState, ReminderStatus, addDaysIso, daysBetween, gdkOf, occurrenceVisible, occurrencesOf, todayIso, userName } from './crmData';
import { CrmState, useCrm, useMe } from './crmStore';

/** Nhắc lại các mốc chưa xử lý tối đa N ngày sau mốc (tránh dồn toàn bộ mốc đầu năm). */
export const OVERDUE_WINDOW = 30;

export interface ReminderItem extends Occurrence {
  days: number; // số ngày từ hôm nay đến mốc (âm = đã qua)
  status: ReminderStatus;
  state?: ReminderState;
  recipients: string[]; // tên người nhận
}

/** Mốc trong [from, to] (có thể vắt qua năm) mà người dùng được xem. */
export const occurrencesIn = (s: CrmState, me: CrmUser, from: string, to: string): Occurrence[] => {
  const years = [...new Set([Number(from.slice(0, 4)), Number(to.slice(0, 4))])];
  return years
    .flatMap((y) => occurrencesOf(y, s.customers, s.library, s.externals))
    .filter((o) => o.date >= from && o.date <= to && occurrenceVisible(me, o, s.customers));
};

export const toItem = (s: CrmState, o: Occurrence, t = todayIso()): ReminderItem => {
  const state = s.reminders.find((r) => r.key === o.id);
  const gdk = o.division ? gdkOf(o.division)?.id : undefined;
  return {
    ...o,
    days: daysBetween(t, o.date),
    status: state?.status || 'Chưa xử lý',
    state,
    recipients: o.kind === 'holiday' ? ['Toàn bộ nhân sự khối & GĐK', 'BP Đối ngoại'] : [...new Set([...o.ownerIds, ...(gdk ? [gdk] : [])])].map(userName),
  };
};

/** Nhắc việc đang mở: mốc trong 7 ngày tới + mốc đã qua chưa xử lý (≤ 30 ngày). */
export const useReminders = () => {
  const s = useCrm();
  const me = useMe();
  return useMemo(() => {
    const t = todayIso();
    const all = occurrencesIn(s, me, addDaysIso(t, -OVERDUE_WINDOW), addDaysIso(t, 60)).map((o) => toItem(s, o, t));
    const active = all.filter((x) => (x.days >= 0 && x.days <= REMIND_BEFORE) || (x.days < 0 && x.status === 'Chưa xử lý'));
    return { all, active, open: active.filter((x) => x.status === 'Chưa xử lý'), overdue: active.filter((x) => x.days < 0 && x.status === 'Chưa xử lý') };
  }, [s, me]);
};
