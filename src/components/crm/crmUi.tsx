/** Thành phần dùng chung của module CRM (theo design system ERP của iMIS). */
import React from 'react';
import { ShieldCheck, UserCog } from 'lucide-react';
import { ErpTitleBar, Tag } from '../erp/Erp';
import { TAG } from '../../marcom/MarcomUi';
import { CRM_USERS, EVENT_KIND_COLOR, EVENT_KIND_LABEL, EventKind, ROLE_LABEL, ReminderStatus, Tier, scopeText, userLabel } from '../../crm/crmData';
import { crm, useMe } from '../../crm/crmStore';

export { Modal, useToast, TAG, FilterBar, FilterCell } from '../../marcom/MarcomUi';

export const CRUMBS = (page: string) => ['CRM', page];

/** Chọn người dùng đang đăng nhập (mô phỏng) để thử phân quyền theo ma trận mục 2.2. */
export const RoleSwitcher: React.FC = () => {
  const me = useMe();
  return (
    <label className="inline-flex items-center gap-1.5 h-8 pl-2 pr-1 rounded-[3px] border border-[#b9d3f0] bg-[#f3f8fe] text-[12px] text-[#1e3a5f]" title="Mô phỏng đăng nhập để thử phân quyền">
      <UserCog size={14} />
      <span className="hidden md:inline text-slate-500">Đang xem với</span>
      <select value={me.id} onChange={(e) => crm.switchUser(e.target.value)} className="h-6 bg-transparent font-semibold outline-none cursor-pointer max-w-[260px]" data-testid="crm-user">
        {(['chairman', 'ceo', 'dn', 'gdk', 'nsk'] as const).map((r) => (
          <optgroup key={r} label={ROLE_LABEL[r]}>
            {CRM_USERS.filter((u) => u.role === r).map((u) => (
              <option key={u.id} value={u.id}>
                {userLabel(u)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
};

/** Thanh tiêu đề chung các màn CRM: breadcrumb + nút tác vụ + người dùng mô phỏng + phạm vi dữ liệu. */
export const CrmTitle: React.FC<{ page: string; title: React.ReactNode; actions?: React.ReactNode; meta?: { label: string; value: React.ReactNode }[] }> = ({ page, title, actions, meta }) => {
  const me = useMe();
  return (
    <ErpTitleBar
      crumbs={CRUMBS(page)}
      title={title}
      actions={
        <>
          {actions}
          <RoleSwitcher />
        </>
      }
      meta={[
        {
          label: 'Phạm vi dữ liệu',
          value: (
            <span className="inline-flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-600" />
              {scopeText(me)}
            </span>
          ),
        },
        ...(meta || []),
      ]}
    />
  );
};

export const TIER_CLS: Record<Tier, string> = { 'Tier 1': TAG.rose, 'Tier 2': TAG.amber, 'Tier 3': TAG.slate };
export const TierTag: React.FC<{ t: Tier }> = ({ t }) => <Tag cls={TIER_CLS[t]}>{t}</Tag>;

export const DivTag: React.FC<{ d?: string }> = ({ d }) => (d ? <span className="inline-flex px-1.5 py-px rounded-[3px] bg-[#1e3a5f] text-white text-[11px] font-bold">{d}</span> : <span className="text-slate-400">—</span>);

export const KindDot: React.FC<{ k: EventKind; label?: boolean }> = ({ k, label }) => (
  <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-600 whitespace-nowrap">
    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: EVENT_KIND_COLOR[k] }} />
    {label && EVENT_KIND_LABEL[k]}
  </span>
);

export const STATUS_CLS: Record<ReminderStatus, string> = { 'Chưa xử lý': TAG.amber, 'Đã chúc': TAG.blue, 'Đã gửi quà': TAG.green, 'Bỏ qua': TAG.slate };
export const ReminderTag: React.FC<{ s: ReminderStatus; overdue?: boolean }> = ({ s, overdue }) => (
  <Tag cls={s === 'Chưa xử lý' && overdue ? TAG.rose : STATUS_CLS[s]}>{s === 'Chưa xử lý' && overdue ? 'Quá hạn – chưa xử lý' : s}</Tag>
);

/** Ô trống "không có quyền". */
export const NoAccess: React.FC<{ text?: string }> = ({ text = 'Bạn không có quyền xem nội dung này theo phân quyền CRM.' }) => (
  <div className="px-4 py-10 text-center text-[12.5px] text-slate-400 border border-dashed border-slate-300 rounded-[4px] bg-white">{text}</div>
);

/** "còn N ngày" / "hôm nay" / "quá N ngày". */
export const DueText: React.FC<{ days: number }> = ({ days }) => (
  <span className={`text-[12px] font-semibold whitespace-nowrap ${days < 0 ? 'text-rose-600' : days === 0 ? 'text-[#c2410c]' : days <= 7 ? 'text-amber-700' : 'text-slate-500'}`}>
    {days < 0 ? `quá ${-days} ngày` : days === 0 ? 'hôm nay' : `còn ${days} ngày`}
  </span>
);
