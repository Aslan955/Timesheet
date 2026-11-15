/**
 * Kho dữ liệu CRM (dùng chung giữa các màn của module) + người dùng đang đăng nhập (mô phỏng để thử phân quyền).
 * Mọi thao tác ghi nhật ký (xem / tạo / sửa / lưu trữ / xuất / nhập / phân quyền / nhắc việc).
 */
import { useSyncExternalStore } from 'react';
import {
  AuditLog, Customer, CrmUser, ExternalEvent, Gift, LibraryEvent, PermissionRequest, ReminderState, ReminderStatus, CRM_USERS, addDaysIso, buildCrmSeed, nowIso, occurrencesOf, todayIso, uid, userById,
} from './crmData';

export interface CrmState {
  meId: string;
  customers: Customer[];
  library: LibraryEvent[];
  externals: ExternalEvent[];
  gifts: Gift[];
  reminders: ReminderState[];
  audit: AuditLog[];
  requests: PermissionRequest[];
  /** Mở hồ sơ khách khi chuyển sang màn Danh bạ (từ Tổng quan / Nhắc việc / Lịch) */
  pendingOpen?: string;
}

/** Mẫu: phần lớn mốc đã qua (≤ 30 ngày) đã được xử lý, để danh sách quá hạn còn vài mục tiêu biểu. */
const seedState = (): CrmState => {
  const base = { meId: 'u-dn', ...buildCrmSeed() };
  const t = todayIso();
  const y = Number(t.slice(0, 4));
  const past = [...occurrencesOf(y - 1, base.customers, base.library, base.externals), ...occurrencesOf(y, base.customers, base.library, base.externals)].filter((o) => o.date < t && o.date >= addDaysIso(t, -30));
  const reminders: ReminderState[] = past
    .filter((_, i) => i % 4 !== 0)
    .map((o, i) => ({ key: o.id, status: (i % 3 === 0 ? 'Đã gửi quà' : i % 5 === 0 ? 'Bỏ qua' : 'Đã chúc') as ReminderStatus, reason: i % 5 === 0 && i % 3 ? 'Khách đang đi công tác nước ngoài' : undefined, by: o.ownerIds[0] || 'u-dn', at: `${o.date}T03:00:00.000Z` }));
  return { ...base, reminders };
};
let STATE: CrmState = seedState();
const SUBS = new Set<() => void>();
const set = (fn: (s: CrmState) => CrmState) => {
  STATE = fn(STATE);
  SUBS.forEach((f) => f());
};
export const useCrm = () => useSyncExternalStore((cb) => (SUBS.add(cb), () => void SUBS.delete(cb)), () => STATE);
export const useMe = (): CrmUser => {
  const s = useCrm();
  return userById(s.meId) || CRM_USERS[0];
};

const log = (s: CrmState, action: AuditLog['action'], target: string, detail?: string): AuditLog[] => [{ id: uid('au'), at: nowIso(), by: s.meId, action, target, detail }, ...s.audit];

export const crm = {
  switchUser: (id: string) => set((s) => ({ ...s, meId: id })),
  openCustomer: (id: string) => set((s) => ({ ...s, pendingOpen: id })),
  clearPending: () => set((s) => ({ ...s, pendingOpen: undefined })),
  audit: (action: AuditLog['action'], target: string, detail?: string) => set((s) => ({ ...s, audit: log(s, action, target, detail) })),

  saveCustomer: (c: Customer, changes: string[]) =>
    set((s) => {
      const exists = s.customers.some((x) => x.id === c.id);
      const next = { ...c, updatedAt: nowIso() };
      return {
        ...s,
        customers: exists ? s.customers.map((x) => (x.id === c.id ? next : x)) : [next, ...s.customers],
        audit: log(s, exists ? 'Sửa' : 'Tạo', c.code, exists ? changes.join(' · ') || 'Cập nhật hồ sơ' : c.name),
      };
    }),
  patchCustomer: (id: string, fn: (c: Customer) => Customer, action: AuditLog['action'], detail: string) =>
    set((s) => {
      const c = s.customers.find((x) => x.id === id);
      if (!c) return s;
      return { ...s, customers: s.customers.map((x) => (x.id === id ? { ...fn(x), updatedAt: nowIso() } : x)), audit: log(s, action, c.code, detail) };
    }),
  importCustomers: (list: Customer[], fileName: string) =>
    set((s) => {
      const byName = new Map(s.customers.map((c) => [c.name.trim().toLowerCase(), c]));
      let added = 0;
      let updated = 0;
      const merged = [...s.customers];
      list.forEach((n) => {
        const old = byName.get(n.name.trim().toLowerCase());
        if (old) {
          updated++;
          const i = merged.findIndex((x) => x.id === old.id);
          merged[i] = { ...old, ...n, id: old.id, code: old.code, interactions: old.interactions, commitments: old.commitments, projects: old.projects, sensitiveNote: old.sensitiveNote, updatedAt: nowIso() };
        } else {
          added++;
          merged.unshift(n);
        }
      });
      return { ...s, customers: merged, audit: log(s, 'Nhập dữ liệu', fileName, `${added} khách mới · ${updated} khách cập nhật`) };
    }),

  saveLibrary: (e: LibraryEvent) =>
    set((s) => ({
      ...s,
      library: s.library.some((x) => x.id === e.id) ? s.library.map((x) => (x.id === e.id ? e : x)) : [...s.library, e],
      audit: log(s, s.library.some((x) => x.id === e.id) ? 'Sửa' : 'Tạo', 'Thư viện lịch', e.name),
    })),
  removeLibrary: (id: string) =>
    set((s) => ({ ...s, library: s.library.filter((x) => x.id !== id), audit: log(s, 'Lưu trữ', 'Thư viện lịch', s.library.find((x) => x.id === id)?.name) })),
  saveExternal: (e: ExternalEvent) =>
    set((s) => ({
      ...s,
      externals: s.externals.some((x) => x.id === e.id) ? s.externals.map((x) => (x.id === e.id ? e : x)) : [...s.externals, e],
      audit: log(s, s.externals.some((x) => x.id === e.id) ? 'Sửa' : 'Tạo', 'Sự kiện đối ngoại', e.name),
    })),

  setReminder: (key: string, status: ReminderStatus, reason: string | undefined, label: string) =>
    set((s) => ({
      ...s,
      reminders: [...s.reminders.filter((r) => r.key !== key), { key, status, reason, by: s.meId, at: nowIso() }],
      audit: log(s, 'Nhắc việc', label, `${status}${reason ? ` — ${reason}` : ''}`),
    })),
  addGift: (g: Gift) => set((s) => ({ ...s, gifts: [g, ...s.gifts], audit: log(s, 'Tạo', 'Sổ quà tặng', `${g.item} · ${g.occasion}`) })),
  removeGift: (id: string) => set((s) => ({ ...s, gifts: s.gifts.filter((g) => g.id !== id), audit: log(s, 'Lưu trữ', 'Sổ quà tặng', s.gifts.find((g) => g.id === id)?.item) })),

  proposePermission: (r: PermissionRequest) =>
    set((s) => ({ ...s, requests: [r, ...s.requests], audit: log(s, 'Phân quyền', userById(r.userId)?.name || r.userId, `Đề xuất phụ trách ${r.customerIds.length} khách`) })),
  decidePermission: (id: string, ok: boolean) =>
    set((s) => {
      const r = s.requests.find((x) => x.id === id);
      if (!r) return s;
      const customers = ok ? s.customers.map((c) => (r.customerIds.includes(c.id) && !c.ownerIds.includes(r.userId) ? { ...c, ownerIds: [...c.ownerIds, r.userId] } : c)) : s.customers;
      return {
        ...s,
        customers,
        requests: s.requests.map((x) => (x.id === id ? { ...x, status: ok ? 'Đã duyệt' : 'Từ chối', decidedBy: s.meId, decidedAt: nowIso() } : x)),
        audit: log(s, 'Phân quyền', userById(r.userId)?.name || r.userId, ok ? `Duyệt phụ trách ${r.customerIds.length} khách` : 'Từ chối đề xuất'),
      };
    }),
  setOwners: (customerId: string, ownerIds: string[]) =>
    set((s) => {
      const c = s.customers.find((x) => x.id === customerId);
      return { ...s, customers: s.customers.map((x) => (x.id === customerId ? { ...x, ownerIds } : x)), audit: log(s, 'Phân quyền', c?.code || customerId, `Phụ trách: ${ownerIds.map((i) => userById(i)?.name).join(', ') || '—'}`) };
    }),
};
