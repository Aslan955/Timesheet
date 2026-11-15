/**
 * CRM · Module 02 — Lịch ngoại giao.
 *  • Lịch 12 tháng: sinh nhật, ngày thành lập, ngày truyền thống ngành, lễ chung, lịch riêng của khối, sự kiện đối ngoại
 *    (lọc khối, loại mốc, tier, người phụ trách; bấm ngày xem chi tiết)
 *  • Thư viện lịch chung: BP Đối ngoại nhập 1 lần ngày lễ & ngày truyền thống ngành (dương / âm lịch, lặp hằng năm,
 *    âm lịch tự quy đổi dương lịch từng năm); mỗi khối thêm lịch riêng của khối mình
 *  • Sự kiện đối ngoại: hội nghị, lễ ký kết, đoàn công tác, triển lãm — danh sách khách mời, khối tổ chức
 */
import React, { useMemo, useState } from 'react';
import { BookMarked, CalendarDays, CalendarRange, ChevronLeft, ChevronRight, Handshake, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { Btn, ErpPage, FolderTabs, FormRow, Panel, Tag, erp } from '../erp/Erp';
import {
  CRM_DIVISIONS, CRM_USERS, CrmDivision, EVENT_KIND_COLOR, EVENT_KIND_LABEL, EventKind, ExternalEvent, LibraryEvent, SECTORS, Sector, TIERS, canManageLibrary, canSeeCustomer, dmy, isTop,
  todayIso, uid,
} from '../../crm/crmData';
import { lunarToSolar } from '../../crm/lunar';
import { crm, useCrm, useMe } from '../../crm/crmStore';
import { occurrencesIn, toItem } from '../../crm/crmHooks';
import { CrmTitle, DivTag, KindDot, Modal, ReminderTag, TAG, TierTag, useToast } from './crmUi';

type Tab = 'year' | 'library' | 'external';
const WD = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const sel = 'h-8 border border-slate-300 rounded-[3px] px-2 text-[12.5px] bg-white outline-none focus:border-[#1f5fa8] cursor-pointer';

export const CrmCalendarPage: React.FC<{ onOpenCustomer?: (id: string) => void }> = ({ onOpenCustomer }) => {
  const [tab, setTab] = useState<Tab>('year');
  const { toast, toastNode } = useToast();
  return (
    <ErpPage>
      {toastNode}
      <CrmTitle page="Lịch ngoại giao" title="Lịch ngoại giao" meta={[{ label: 'Lặp hằng năm', value: 'có sẵn · ngày âm lịch tự quy đổi dương lịch mỗi năm' }]} />
      <div>
        <FolderTabs
          tabs={[
            { key: 'year', label: 'Lịch 12 tháng', icon: CalendarRange },
            { key: 'library', label: 'Thư viện lịch chung', icon: BookMarked },
            { key: 'external', label: 'Sự kiện đối ngoại', icon: Handshake },
          ]}
          value={tab}
          onChange={setTab}
        />
        <div className="pt-3 space-y-3">
          {tab === 'year' && <YearView onOpenCustomer={onOpenCustomer} />}
          {tab === 'library' && <LibraryView toast={toast} />}
          {tab === 'external' && <ExternalView toast={toast} />}
        </div>
      </div>
    </ErpPage>
  );
};

// ==========================================================================
// Lịch 12 tháng
// ==========================================================================
const YearView: React.FC<{ onOpenCustomer?: (id: string) => void }> = ({ onOpenCustomer }) => {
  const s = useCrm();
  const me = useMe();
  const t = todayIso();
  const [year, setYear] = useState(Number(t.slice(0, 4)));
  const [div, setDiv] = useState('');
  const [kind, setKind] = useState<EventKind | ''>('');
  const [tier, setTier] = useState('');
  const [owner, setOwner] = useState('');
  const [day, setDay] = useState<string>(t);

  const items = useMemo(() => {
    return occurrencesIn(s, me, `${year}-01-01`, `${year}-12-31`)
      .map((o) => toItem(s, o, t))
      .filter((o) => !div || o.division === div || (!o.division && o.kind === 'holiday'))
      .filter((o) => !kind || o.kind === kind)
      .filter((o) => !tier || o.tier === tier)
      .filter((o) => !owner || o.ownerIds.includes(owner));
  }, [s, me, year, div, kind, tier, owner, t]);
  const byDate = useMemo(() => {
    const m = new Map<string, typeof items>();
    items.forEach((o) => m.set(o.date, [...(m.get(o.date) || []), o]));
    return m;
  }, [items]);
  const dayList = byDate.get(day) || [];
  const counts = (Object.keys(EVENT_KIND_LABEL) as EventKind[]).map((k) => ({ k, n: items.filter((x) => x.kind === k).length }));

  return (
    <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_380px] gap-3">
      <Panel
        title={`Lịch năm ${year} (${items.length} mốc)`}
        icon={CalendarRange}
        noPad
        actions={
          <span className="flex items-center gap-1">
            <Btn className="h-7 px-2" icon={ChevronLeft} onClick={() => setYear(year - 1)} title="Năm trước" />
            <b className="text-[13px] tabular-nums px-1">{year}</b>
            <Btn className="h-7 px-2" icon={ChevronRight} onClick={() => setYear(year + 1)} title="Năm sau" />
          </span>
        }
      >
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-slate-200 bg-[#f7f9fc]">
          {isTop(me) && (
            <select value={div} onChange={(e) => setDiv(e.target.value)} className={sel}>
              <option value="">Tất cả khối</option>
              {CRM_DIVISIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          )}
          <select value={kind} onChange={(e) => setKind(e.target.value as EventKind | '')} className={sel}>
            <option value="">Tất cả loại mốc</option>
            {(Object.keys(EVENT_KIND_LABEL) as EventKind[]).map((k) => (
              <option key={k} value={k}>
                {EVENT_KIND_LABEL[k]}
              </option>
            ))}
          </select>
          <select value={tier} onChange={(e) => setTier(e.target.value)} className={sel}>
            <option value="">Tất cả tier</option>
            {TIERS.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          {me.role !== 'nsk' && (
            <select value={owner} onChange={(e) => setOwner(e.target.value)} className={sel}>
              <option value="">Tất cả người phụ trách</option>
              {CRM_USERS.filter((u) => u.role === 'nsk' && (isTop(me) || u.division === me.division)).map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.division})
                </option>
              ))}
            </select>
          )}
          <span className="ml-auto flex flex-wrap items-center gap-3">
            {counts.map(({ k, n }) => (
              <button key={k} type="button" onClick={() => setKind(kind === k ? '' : k)} className={`inline-flex items-center gap-1 text-[12px] cursor-pointer ${kind && kind !== k ? 'opacity-40' : ''}`}>
                <KindDot k={k} label /> <b className="tabular-nums">{n}</b>
              </button>
            ))}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-3" data-testid="crm-year">
          {Array.from({ length: 12 }, (_, m) => (
            <MiniMonth key={m} year={year} month={m} byDate={byDate} today={t} selected={day} onPick={setDay} />
          ))}
        </div>
      </Panel>

      <Panel title={`Ngày ${dmy(day)} (${dayList.length})`} icon={CalendarDays} noPad className="2xl:sticky 2xl:top-3 self-start">
        <div className="divide-y divide-slate-100 max-h-[640px] overflow-auto" data-testid="crm-day">
          {dayList.map((o) => (
            <div key={o.id} className="px-3 py-2 hover:bg-slate-50">
              <div className="flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ background: EVENT_KIND_COLOR[o.kind] }} />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-slate-800">{o.title}</p>
                  <p className="text-[11.5px] text-slate-500">
                    {EVENT_KIND_LABEL[o.kind]}
                    {o.lunar ? ` · ${o.lunar}` : ''}
                  </p>
                  {o.customerId && onOpenCustomer ? (
                    <button type="button" onClick={() => onOpenCustomer(o.customerId!)} className="text-[12px] text-[#1f5fa8] hover:underline cursor-pointer text-left">
                      {o.sub}
                    </button>
                  ) : (
                    <p className="text-[12px] text-slate-600">{o.sub}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {o.division && <DivTag d={o.division} />}
                    {o.tier && <TierTag t={o.tier} />}
                    {o.days >= -30 && o.days <= 7 && <ReminderTag s={o.status} overdue={o.days < 0} />}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {!dayList.length && <p className="px-3 py-8 text-center text-[12.5px] text-slate-400">Không có mốc nào trong ngày. Bấm vào ngày có chấm màu trên lịch.</p>}
        </div>
      </Panel>
    </div>
  );
};

const MiniMonth: React.FC<{ year: number; month: number; byDate: Map<string, { kind: EventKind }[]>; today: string; selected: string; onPick: (d: string) => void }> = ({
  year,
  month,
  byDate,
  today,
  selected,
  onPick,
}) => {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const key = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const total = Array.from({ length: days }, (_, i) => byDate.get(key(i + 1))?.length || 0).reduce((a, b) => a + b, 0);
  return (
    <div className="border border-slate-200 rounded-[4px] overflow-hidden bg-white">
      <div className={`flex items-center justify-between px-2.5 py-1.5 border-b border-slate-200 ${today.slice(0, 7) === key(1).slice(0, 7) ? 'bg-[#1e3a5f] text-white' : 'bg-[#f3f6fa] text-[#1e3a5f]'}`}>
        <b className="text-[12.5px]">Tháng {month + 1}</b>
        <span className="text-[11px] opacity-80">{total} mốc</span>
      </div>
      <div className="grid grid-cols-7 px-1.5 pt-1 text-[10px] font-semibold text-slate-400 text-center">
        {WD.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 p-1.5 pt-0.5">
        {cells.map((d, i) =>
          d ? (
            (() => {
              const k = key(d);
              const ev = byDate.get(k) || [];
              const kinds = [...new Set<EventKind>(ev.map((e) => e.kind))].slice(0, 3);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onPick(k)}
                  title={ev.length ? `${ev.length} mốc` : undefined}
                  className={`relative h-8 rounded-[3px] text-[11.5px] tabular-nums cursor-pointer flex flex-col items-center justify-start pt-0.5 ${
                    k === selected ? 'bg-[#1f5fa8] text-white font-bold' : k === today ? 'ring-1 ring-[#1f5fa8] text-[#1f5fa8] font-bold' : ev.length ? 'bg-[#f5f8fc] text-slate-800 font-semibold hover:bg-[#e6eef8]' : 'text-slate-500 hover:bg-slate-50'
                  } ${(i % 7) === 6 && k !== selected ? 'text-rose-500' : ''}`}
                >
                  {d}
                  {kinds.length > 0 && (
                    <span className="flex gap-0.5 mt-0.5">
                      {kinds.map((kd) => (
                        <span key={kd} className="w-1.5 h-1.5 rounded-full" style={{ background: k === selected ? '#fff' : EVENT_KIND_COLOR[kd] }} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })()
          ) : (
            <span key={i} />
          ),
        )}
      </div>
    </div>
  );
};

// ==========================================================================
// Thư viện lịch chung + lịch riêng của khối
// ==========================================================================
const LibraryView: React.FC<{ toast: (m: string) => void }> = ({ toast }) => {
  const s = useCrm();
  const me = useMe();
  const y = Number(todayIso().slice(0, 4));
  const [edit, setEdit] = useState<LibraryEvent | null>(null);
  const canShared = canManageLibrary(me);
  const canDivision = (e?: LibraryEvent) => canShared || (me.role === 'gdk' && (!e || e.division === me.division));
  const list = s.library.filter((e) => e.kind !== 'division' || isTop(me) || e.division === me.division);
  const solar = (e: LibraryEvent, yr: number) => (e.calendar === 'solar' ? `${String(e.day).padStart(2, '0')}/${String(e.month).padStart(2, '0')}/${yr}` : dmy(lunarToSolar(e.day, e.month, yr) || ''));
  const groups: { title: string; kind: LibraryEvent['kind'] }[] = [
    { title: 'Lễ chung toàn công ty', kind: 'holiday' },
    { title: 'Ngày truyền thống ngành (áp cho khách cùng lĩnh vực)', kind: 'industry' },
    { title: 'Lịch riêng của khối', kind: 'division' },
  ];
  return (
    <>
      <Panel
        title={`Thư viện lịch (${list.length} mốc)`}
        icon={BookMarked}
        noPad
        actions={
          (canShared || me.role === 'gdk') && (
            <Btn
              variant="primary"
              icon={Plus}
              className="h-7"
              onClick={() => setEdit({ id: uid('lb'), name: '', kind: canShared ? 'holiday' : 'division', calendar: 'solar', day: 1, month: 1, division: me.division, note: '', createdBy: me.id })}
              data-testid="crm-lib-add"
            >
              Thêm mốc
            </Btn>
          )
        }
        footer="BP Đối ngoại nhập 1 lần lễ chung & ngày truyền thống ngành, mọi khối dùng lại · Giám đốc khối thêm lịch riêng của khối mình · Ngày âm lịch tự quy đổi dương lịch mỗi năm."
      >
        <table className={erp.table}>
          <thead>
            <tr>
              {['Tên mốc', 'Lịch', 'Ngày', `Dương lịch ${y}`, `Dương lịch ${y + 1}`, 'Áp dụng', 'Ghi chú', ''].map((h, i) => (
                <th key={i} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 7 ? 'border-r-0 w-16' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((g) => {
              const rows = list.filter((e) => e.kind === g.kind).sort((a, b) => a.month - b.month || a.day - b.day);
              if (!rows.length) return null;
              return (
                <React.Fragment key={g.kind}>
                  <tr>
                    <td colSpan={8} className="px-3 py-1.5 bg-[#eef3f9] border-y border-slate-300 text-[12px] font-bold text-[#1e3a5f]">
                      <span className="inline-flex items-center gap-2">
                        <KindDot k={g.kind} /> {g.title} ({rows.length})
                      </span>
                    </td>
                  </tr>
                  {rows.map((e) => (
                    <tr key={e.id} className={erp.tr}>
                      <td className={`${erp.td} border-l-0 font-semibold`}>{e.name}</td>
                      <td className={erp.td}>
                        <Tag cls={e.calendar === 'lunar' ? TAG.violet : TAG.blue}>{e.calendar === 'lunar' ? 'Âm lịch' : 'Dương lịch'}</Tag>
                      </td>
                      <td className={`${erp.td} tabular-nums whitespace-nowrap`}>
                        {String(e.day).padStart(2, '0')}/{String(e.month).padStart(2, '0')}
                      </td>
                      <td className={`${erp.td} tabular-nums whitespace-nowrap`}>{solar(e, y)}</td>
                      <td className={`${erp.td} tabular-nums whitespace-nowrap text-slate-500`}>{solar(e, y + 1)}</td>
                      <td className={`${erp.td} text-[12px]`}>{e.kind === 'industry' ? `Ngành ${e.sector}` : e.kind === 'division' ? <DivTag d={e.division} /> : 'Toàn công ty'}</td>
                      <td className={`${erp.td} text-[12px] text-slate-600`}>{e.note || '—'}</td>
                      <td className={`${erp.td} border-r-0 whitespace-nowrap`}>
                        {(e.kind === 'division' ? canDivision(e) : canShared) && (
                          <span className="flex gap-1">
                            <button type="button" className="p-1 text-slate-400 hover:text-[#1f5fa8] cursor-pointer" title="Sửa" onClick={() => setEdit(e)}>
                              <Pencil size={13} />
                            </button>
                            <button
                              type="button"
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Xoá"
                              onClick={() => {
                                crm.removeLibrary(e.id);
                                toast(`Đã xoá mốc ${e.name}`);
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </Panel>
      {edit && <LibraryModal e={edit} canShared={canShared} onClose={() => setEdit(null)} toast={toast} />}
    </>
  );
};

const LibraryModal: React.FC<{ e: LibraryEvent; canShared: boolean; onClose: () => void; toast: (m: string) => void }> = ({ e: init, canShared, onClose, toast }) => {
  const me = useMe();
  const [e, setE] = useState<LibraryEvent>(init);
  const [tried, setTried] = useState(false);
  const y = Number(todayIso().slice(0, 4));
  const preview = e.calendar === 'lunar' ? lunarToSolar(e.day, e.month, y) : `${y}-${String(e.month).padStart(2, '0')}-${String(e.day).padStart(2, '0')}`;
  const valid = e.name.trim() && e.day >= 1 && e.day <= (e.calendar === 'lunar' ? 30 : new Date(2024, e.month, 0).getDate()) && e.month >= 1 && e.month <= 12 && (e.kind !== 'industry' || e.sector) && (e.kind !== 'division' || e.division);
  return (
    <Modal
      open
      onClose={onClose}
      title={init.name ? `Sửa mốc — ${init.name}` : 'Thêm mốc lịch'}
      footer={
        <>
          <Btn onClick={onClose}>Huỷ</Btn>
          <Btn
            variant="primary"
            icon={Save}
            onClick={() => {
              if (!valid) return setTried(true);
              crm.saveLibrary({ ...e, name: e.name.trim() });
              toast(`Đã lưu mốc ${e.name.trim()}`);
              onClose();
            }}
            data-testid="crm-lib-save"
          >
            Lưu
          </Btn>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <FormRow label="Tên mốc" required error={tried && !e.name.trim() ? 'Bắt buộc' : undefined} className="col-span-2">
          <input value={e.name} onChange={(x) => setE({ ...e, name: x.target.value })} className={erp.inputFull} data-testid="crm-lib-name" />
        </FormRow>
        <FormRow label="Loại mốc" required>
          <select value={e.kind} onChange={(x) => setE({ ...e, kind: x.target.value as LibraryEvent['kind'] })} className={`${erp.inputFull} cursor-pointer`}>
            {canShared && <option value="holiday">Lễ chung</option>}
            {canShared && <option value="industry">Ngày truyền thống ngành</option>}
            <option value="division">Lịch riêng của khối</option>
          </select>
        </FormRow>
        {e.kind === 'industry' && (
          <FormRow label="Lĩnh vực" required>
            <select value={e.sector || ''} onChange={(x) => setE({ ...e, sector: x.target.value as Sector })} className={`${erp.inputFull} cursor-pointer`}>
              <option value="">— Chọn —</option>
              {SECTORS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </FormRow>
        )}
        {e.kind === 'division' && (
          <FormRow label="Khối" required>
            <select value={e.division || ''} disabled={!isTop(me)} onChange={(x) => setE({ ...e, division: x.target.value as CrmDivision })} className={`${erp.inputFull} cursor-pointer`}>
              {CRM_DIVISIONS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </FormRow>
        )}
        <FormRow label="Theo lịch" required>
          <select value={e.calendar} onChange={(x) => setE({ ...e, calendar: x.target.value as LibraryEvent['calendar'] })} className={`${erp.inputFull} cursor-pointer`}>
            <option value="solar">Dương lịch</option>
            <option value="lunar">Âm lịch (tự quy đổi mỗi năm)</option>
          </select>
        </FormRow>
        <FormRow label="Ngày / tháng" required error={tried && !valid ? 'Ngày không hợp lệ' : undefined} hint={preview ? `Năm ${y}: ${dmy(preview)}` : undefined}>
          <span className="flex items-center gap-1.5">
            <input type="number" min={1} max={31} value={e.day} onChange={(x) => setE({ ...e, day: Number(x.target.value) })} className={`${erp.input} w-16 text-right`} />
            <span>/</span>
            <input type="number" min={1} max={12} value={e.month} onChange={(x) => setE({ ...e, month: Number(x.target.value) })} className={`${erp.input} w-16 text-right`} />
          </span>
        </FormRow>
        <FormRow label="Ghi chú" className="col-span-2">
          <input value={e.note} onChange={(x) => setE({ ...e, note: x.target.value })} className={erp.inputFull} />
        </FormRow>
      </div>
    </Modal>
  );
};

// ==========================================================================
// Sự kiện đối ngoại
// ==========================================================================
const ExternalView: React.FC<{ toast: (m: string) => void }> = ({ toast }) => {
  const s = useCrm();
  const me = useMe();
  const [edit, setEdit] = useState<ExternalEvent | null>(null);
  const t = todayIso();
  const list = [...s.externals].filter((x) => isTop(me) || x.division === me.division || s.customers.some((c) => x.guestCustomerIds.includes(c.id) && canSeeCustomer(me, c))).sort((a, b) => b.date.localeCompare(a.date));
  const canEdit = (x?: ExternalEvent) => isTop(me) || (me.role === 'gdk' && (!x || x.division === me.division));
  return (
    <>
      <Panel
        title={`Sự kiện đối ngoại (${list.length})`}
        icon={Handshake}
        noPad
        actions={
          canEdit() && (
            <Btn
              variant="primary"
              icon={Plus}
              className="h-7"
              onClick={() => setEdit({ id: uid('ex'), name: '', type: 'Hội nghị', date: t, location: '', division: (me.division || 'G1') as CrmDivision, guestCustomerIds: [], note: '', createdBy: me.id })}
              data-testid="crm-ex-add"
            >
              Thêm sự kiện
            </Btn>
          )
        }
      >
        <table className={erp.table}>
          <thead>
            <tr>
              {['Ngày', 'Sự kiện', 'Loại', 'Địa điểm', 'Khối tổ chức', 'Khách mời', ''].map((h, i) => (
                <th key={i} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 6 ? 'border-r-0 w-10' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((x) => (
              <tr key={x.id} className={`${erp.tr} ${x.date < t ? 'text-slate-500' : ''}`}>
                <td className={`${erp.td} border-l-0 whitespace-nowrap tabular-nums font-semibold`}>{dmy(x.date)}</td>
                <td className={`${erp.td} font-semibold`}>
                  {x.name}
                  {x.note && <p className="text-[11px] font-normal text-slate-500">{x.note}</p>}
                </td>
                <td className={erp.td}>
                  <Tag cls={TAG.green}>{x.type}</Tag>
                </td>
                <td className={erp.td}>{x.location}</td>
                <td className={erp.td}>
                  <DivTag d={x.division} />
                </td>
                <td className={`${erp.td} text-[12px]`}>
                  {x.guestCustomerIds
                    .map((id) => s.customers.find((c) => c.id === id))
                    .filter(Boolean)
                    .map((c) => (canSeeCustomer(me, c!) ? c!.name : 'Khách khối khác'))
                    .join('; ') || '—'}
                </td>
                <td className={`${erp.td} border-r-0`}>
                  {canEdit(x) && (
                    <button type="button" className="p-1 text-slate-400 hover:text-[#1f5fa8] cursor-pointer" title="Sửa" onClick={() => setEdit(x)}>
                      <Pencil size={13} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan={7} className={`${erp.td} border-x-0 py-8 text-center text-slate-400`}>
                  Chưa có sự kiện.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>
      {edit && <ExternalModal x={edit} onClose={() => setEdit(null)} toast={toast} />}
    </>
  );
};

const ExternalModal: React.FC<{ x: ExternalEvent; onClose: () => void; toast: (m: string) => void }> = ({ x: init, onClose, toast }) => {
  const s = useCrm();
  const me = useMe();
  const [x, setX] = useState<ExternalEvent>(init);
  const [tried, setTried] = useState(false);
  const guests = s.customers.filter((c) => !c.archived && canSeeCustomer(me, c));
  const ok = x.name.trim() && x.date && x.location.trim();
  return (
    <Modal
      open
      onClose={onClose}
      width="max-w-2xl"
      title={init.name ? `Sửa sự kiện — ${init.name}` : 'Thêm sự kiện đối ngoại'}
      footer={
        <>
          <Btn onClick={onClose}>Huỷ</Btn>
          <Btn
            variant="primary"
            icon={Save}
            onClick={() => {
              if (!ok) return setTried(true);
              crm.saveExternal({ ...x, name: x.name.trim(), location: x.location.trim() });
              toast(`Đã lưu sự kiện ${x.name.trim()}`);
              onClose();
            }}
          >
            Lưu
          </Btn>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <FormRow label="Tên sự kiện" required error={tried && !x.name.trim() ? 'Bắt buộc' : undefined} className="col-span-2">
          <input value={x.name} onChange={(e) => setX({ ...x, name: e.target.value })} className={erp.inputFull} />
        </FormRow>
        <FormRow label="Loại" required>
          <select value={x.type} onChange={(e) => setX({ ...x, type: e.target.value as ExternalEvent['type'] })} className={`${erp.inputFull} cursor-pointer`}>
            {['Hội nghị', 'Lễ ký kết', 'Đoàn công tác', 'Triển lãm', 'Khác'].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </FormRow>
        <FormRow label="Ngày" required>
          <input type="date" value={x.date} onChange={(e) => setX({ ...x, date: e.target.value })} className={erp.inputFull} />
        </FormRow>
        <FormRow label="Địa điểm" required error={tried && !x.location.trim() ? 'Bắt buộc' : undefined}>
          <input value={x.location} onChange={(e) => setX({ ...x, location: e.target.value })} className={erp.inputFull} />
        </FormRow>
        <FormRow label="Khối tổ chức" required>
          <select value={x.division} disabled={!isTop(me)} onChange={(e) => setX({ ...x, division: e.target.value as CrmDivision })} className={`${erp.inputFull} cursor-pointer`}>
            {CRM_DIVISIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </FormRow>
        <FormRow label={`Danh sách khách mời (${x.guestCustomerIds.length})`} className="col-span-2">
          <div className="max-h-44 overflow-auto border border-slate-300 rounded-[3px] p-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
            {guests.map((c) => (
              <label key={c.id} className="flex items-center gap-1.5 text-[12.5px] cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-[#1f5fa8]"
                  checked={x.guestCustomerIds.includes(c.id)}
                  onChange={(e) => setX({ ...x, guestCustomerIds: e.target.checked ? [...x.guestCustomerIds, c.id] : x.guestCustomerIds.filter((g) => g !== c.id) })}
                />
                <span className="truncate">
                  {c.division} · {c.name}
                </span>
              </label>
            ))}
          </div>
        </FormRow>
        <FormRow label="Ghi chú" className="col-span-2">
          <input value={x.note} onChange={(e) => setX({ ...x, note: e.target.value })} className={erp.inputFull} />
        </FormRow>
      </div>
    </Modal>
  );
};

