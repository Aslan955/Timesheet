/**
 * CRM · Module 01 — Danh bạ & hồ sơ khách hàng.
 *  Danh sách (lọc khối / cấp / tier / lĩnh vực / phụ trách) → Hồ sơ (cơ quan, đầu mối, tương tác, cam kết & dự án, quà tặng,
 *  ghi chú nhạy cảm, nhật ký) → Thêm / sửa (trường bắt buộc mục 3.1). Nhập hàng loạt & xuất Excel theo quyền.
 */
import React, { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  AlertTriangle, Archive, ArchiveRestore, BookUser, Briefcase, CalendarClock, CheckCircle2, Download, FileSpreadsheet, Gift as GiftIcon, History, Lock, MessageSquareText,
  Pencil, Phone, Plus, Save, Search, Star, Trash2, Upload, UserRound, Users, X,
} from 'lucide-react';
import { Btn, ErpPage, ErpTitleBar, FieldTable, FolderTabs, FormRow, KpiBox, Panel, Tag, erp } from '../erp/Erp';
import { DateInput, InfoGrid } from '../EmployeePage';
import {
  Commitment, Contact, Customer, CustomerProject, CRM_DIVISIONS, CRM_USERS, CrmDivision, CrmUser, Gift, INTERACTION_TYPES, Interaction, InteractionType, ORG_LEVELS, OrgLevel,
  PROJECT_ROLES, PROJECT_ROLE_VI, PROJECT_STAGES, ProjectRole, ProjectStage, SECTORS, STALE_DAYS, Sector, TIERS, TIER_HINT, Tier, addDaysIso, ageOf, canArchiveCustomer,
  canCreateCustomer, canEditBirthday, canEditCustomer, canExport, canImport, canSeeCustomer, canSensitive, canWorkLog, daysBetween, dmy, fmtMoney, isTop, lastContactOf,
  nowIso, todayIso, uid, userName,
} from '../../crm/crmData';
import { crm, useCrm, useMe } from '../../crm/crmStore';
import { CRUMBS, DivTag, DueText, Modal, NoAccess, RoleSwitcher, TAG, TierTag, CrmTitle, useToast } from './crmUi';

type Mode = { kind: 'list' } | { kind: 'detail'; id: string } | { kind: 'new' } | { kind: 'edit'; id: string };

export const CrmCustomersPage: React.FC = () => {
  const { pendingOpen } = useCrm();
  const [mode, setMode] = useState<Mode>(() => (pendingOpen ? { kind: 'detail', id: pendingOpen } : { kind: 'list' }));
  const { toast, toastNode } = useToast();
  useEffect(() => {
    // Mở hồ sơ được chọn từ màn khác (Tổng quan / Nhắc việc / Lịch)
    if (pendingOpen) {
      setMode({ kind: 'detail', id: pendingOpen });
      crm.clearPending();
    }
  }, [pendingOpen]);
  return (
    <ErpPage>
      {toastNode}
      {mode.kind === 'list' && <CustomerList onOpen={(id) => setMode({ kind: 'detail', id })} onNew={() => setMode({ kind: 'new' })} toast={toast} />}
      {mode.kind === 'detail' && <CustomerDetail id={mode.id} onBack={() => setMode({ kind: 'list' })} onEdit={() => setMode({ kind: 'edit', id: mode.id })} toast={toast} />}
      {(mode.kind === 'new' || mode.kind === 'edit') && (
        <CustomerForm
          id={mode.kind === 'edit' ? mode.id : undefined}
          onCancel={() => setMode(mode.kind === 'edit' ? { kind: 'detail', id: mode.id } : { kind: 'list' })}
          onSaved={(id, msg) => {
            toast(msg);
            setMode({ kind: 'detail', id });
          }}
        />
      )}
    </ErpPage>
  );
};

// ==========================================================================
// Tiện ích
// ==========================================================================
const primaryOf = (c: Customer) => c.contacts.find((x) => x.primary) || c.contacts[0];
/** Sinh nhật kế tiếp (từ hôm nay) của các đầu mối. */
const nextBirthday = (c: Customer, from = todayIso()) => {
  const y = Number(from.slice(0, 4));
  return c.contacts
    .filter((x) => x.birthday)
    .map((x) => {
      let d = `${y}-${x.birthday.slice(5, 10)}`;
      if (d < from) d = `${y + 1}-${x.birthday.slice(5, 10)}`;
      return { ct: x, date: d, days: daysBetween(from, d) };
    })
    .sort((a, b) => a.days - b.days)[0];
};
const ALL = '';
const sel = 'h-8 border border-slate-300 rounded-[3px] px-2 text-[12.5px] bg-white outline-none focus:border-[#1f5fa8] cursor-pointer';
const ownersOf = (d: CrmDivision) => CRM_USERS.filter((u) => u.role === 'nsk' && u.division === d);

// ==========================================================================
// Danh sách
// ==========================================================================
const CustomerList: React.FC<{ onOpen: (id: string) => void; onNew: () => void; toast: (m: string) => void }> = ({ onOpen, onNew, toast }) => {
  const s = useCrm();
  const me = useMe();
  const [q, setQ] = useState('');
  const [div, setDiv] = useState(ALL);
  const [level, setLevel] = useState(ALL);
  const [tier, setTier] = useState(ALL);
  const [sector, setSector] = useState(ALL);
  const [owner, setOwner] = useState(ALL);
  const [archived, setArchived] = useState(false);
  const [quick, setQuick] = useState<'' | 'stale' | 'overdue' | 'bday'>('');
  const [showImport, setShowImport] = useState(false);
  const t = todayIso();

  const mine = s.customers.filter((c) => canSeeCustomer(me, c));
  const needle = q.trim().toLowerCase();
  const rows = mine
    .filter((c) => c.archived === archived)
    .filter((c) => !div || c.division === div)
    .filter((c) => !level || c.level === level)
    .filter((c) => !tier || c.tier === tier)
    .filter((c) => !sector || c.sector === sector)
    .filter((c) => !owner || c.ownerIds.includes(owner))
    .filter((c) => !needle || [c.name, c.code, ...c.contacts.flatMap((x) => [x.name, x.phone, x.title])].some((v) => v.toLowerCase().includes(needle)))
    .filter((c) => {
      if (quick === 'stale') return daysBetween(lastContactOf(c) || '2000-01-01', t) > STALE_DAYS;
      if (quick === 'overdue') return c.commitments.some((x) => !x.done && x.dueDate < t);
      if (quick === 'bday') return (nextBirthday(c)?.days ?? 99) <= 30;
      return true;
    });
  const live = mine.filter((c) => !c.archived);
  const stale = live.filter((c) => daysBetween(lastContactOf(c) || '2000-01-01', t) > STALE_DAYS).length;
  const overdue = live.filter((c) => c.commitments.some((x) => !x.done && x.dueDate < t)).length;
  const bday = live.filter((c) => (nextBirthday(c)?.days ?? 99) <= 30).length;

  const exportXlsx = () => {
    const withNote = canSensitive(me);
    const head = ['Mã KH', 'Tên cơ quan, đơn vị', 'Cấp cơ quan', 'Lĩnh vực', 'Khối', 'Tier', 'Ngày thành lập', 'Đầu mối chính', 'Họ và tên', 'Chức vụ', 'Số điện thoại', 'Project Role', 'Ngày sinh', 'Email công vụ', 'Email cá nhân', 'Trợ lý / thư ký', 'SĐT trợ lý', 'Phụ trách', 'Tương tác gần nhất', ...(withNote ? ['Ghi chú nhạy cảm'] : [])];
    const data = rows.flatMap((c) =>
      c.contacts.map((x) => [
        c.code, c.name, c.level, c.sector, c.division, c.tier, c.foundingDate ? dmy(c.foundingDate) : '', x.primary ? 'x' : '', x.name, x.title, x.phone, x.role, dmy(x.birthday), x.emailWork, x.emailPersonal, x.assistantName, x.assistantPhone,
        c.ownerIds.map(userName).join(', '), dmy(lastContactOf(c)), ...(withNote ? [c.sensitiveNote] : []),
      ]),
    );
    const ws = XLSX.utils.aoa_to_sheet([head, ...data]);
    ws['!cols'] = head.map((h) => ({ wch: Math.max(12, Math.min(40, h.length + 6)) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Khách hàng');
    XLSX.writeFile(wb, `CRM_KhachHang_${isTop(me) ? 'TongHop' : me.division}_${t}.xlsx`);
    crm.audit('Xuất dữ liệu', isTop(me) ? 'Danh sách tổng khách hàng' : `Khách hàng khối ${me.division}`, `${rows.length} khách · ${data.length} đầu mối${withNote ? ' · kèm ghi chú nhạy cảm' : ''}`);
    toast(`Đã xuất ${rows.length} khách hàng (${data.length} đầu mối)`);
  };

  return (
    <>
      <CrmTitle
        page="Danh bạ khách hàng"
        title={isTop(me) ? 'Danh bạ khách hàng — danh sách tổng' : me.role === 'gdk' ? `Danh bạ khách hàng — khối ${me.division}` : 'Khách hàng tôi phụ trách'}
        actions={
          <>
            {canImport(me) && (
              <Btn icon={Upload} onClick={() => setShowImport(true)} data-testid="crm-import">
                Nhập Excel
              </Btn>
            )}
            {canExport(me) && (
              <Btn icon={Download} onClick={exportXlsx} data-testid="crm-export">
                Xuất Excel
              </Btn>
            )}
            {canCreateCustomer(me) && (
              <Btn variant="primary" icon={Plus} onClick={onNew} data-testid="crm-new">
                Thêm khách hàng
              </Btn>
            )}
          </>
        }
      />
      {showImport && <ImportModal onClose={() => setShowImport(false)} toast={toast} />}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
        <KpiBox label="Khách hàng đang theo dõi" value={live.length} sub={`${live.reduce((a, c) => a + c.contacts.length, 0)} đầu mối`} onClick={() => setQuick('')} active={quick === ''} />
        <KpiBox label="Khách Tier 1 (chiến lược)" value={live.filter((c) => c.tier === 'Tier 1').length} sub={`Tier 2: ${live.filter((c) => c.tier === 'Tier 2').length} · Tier 3: ${live.filter((c) => c.tier === 'Tier 3').length}`} />
        <KpiBox label="Sinh nhật trong 30 ngày" value={bday} sub="Khách có đầu mối sắp sinh nhật" tone={bday ? 'neutral' : 'good'} onClick={() => setQuick(quick === 'bday' ? '' : 'bday')} active={quick === 'bday'} />
        <KpiBox label={`Lâu chưa tiếp xúc (> ${STALE_DAYS} ngày)`} value={stale} sub="Cần chủ động liên hệ" tone={stale ? 'bad' : 'good'} onClick={() => setQuick(quick === 'stale' ? '' : 'stale')} active={quick === 'stale'} />
        <KpiBox label="Có cam kết quá hạn" value={overdue} sub="Cam kết chưa hoàn thành" tone={overdue ? 'bad' : 'good'} onClick={() => setQuick(quick === 'overdue' ? '' : 'overdue')} active={quick === 'overdue'} />
      </div>

      <Panel title={`Danh sách khách hàng (${rows.length})`} icon={BookUser} noPad footer="Bấm 1 dòng để mở hồ sơ · Ghi chú nhạy cảm chỉ hiển thị với Chủ tịch và BP Đối ngoại">
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-slate-200 bg-[#f7f9fc]">
          <div className="relative flex-1 min-w-[220px] max-w-[340px]">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm cơ quan, đầu mối, số điện thoại…" className={`${erp.inputFull} pl-8`} data-testid="crm-search" />
          </div>
          {isTop(me) && (
            <select value={div} onChange={(e) => setDiv(e.target.value)} className={sel}>
              <option value="">Tất cả khối</option>
              {CRM_DIVISIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          )}
          <select value={level} onChange={(e) => setLevel(e.target.value)} className={sel}>
            <option value="">Tất cả cấp cơ quan</option>
            {ORG_LEVELS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <select value={tier} onChange={(e) => setTier(e.target.value)} className={sel}>
            <option value="">Tất cả tier</option>
            {TIERS.map((d) => (
              <option key={d} value={d}>
                {d} — {TIER_HINT[d]}
              </option>
            ))}
          </select>
          <select value={sector} onChange={(e) => setSector(e.target.value)} className={sel}>
            <option value="">Tất cả lĩnh vực</option>
            {SECTORS.map((d) => (
              <option key={d}>{d}</option>
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
          <label className="ml-auto flex items-center gap-1.5 text-[12px] text-slate-600 cursor-pointer select-none">
            <input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} className="accent-[#1f5fa8]" /> Đã lưu trữ
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                {['Mã KH', 'Cơ quan, đơn vị', 'Cấp cơ quan', 'Khối', 'Tier', 'Đầu mối chính', 'Vai trò', 'Phụ trách', 'Tiếp xúc gần nhất', 'Cam kết', 'Sinh nhật sắp tới'].map((h, i) => (
                  <th key={h} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 10 ? 'border-r-0' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const p = primaryOf(c);
                const last = lastContactOf(c);
                const gap = last ? daysBetween(last, t) : null;
                const open = c.commitments.filter((x) => !x.done);
                const late = open.filter((x) => x.dueDate < t).length;
                const nb = nextBirthday(c);
                return (
                  <tr key={c.id} onClick={() => onOpen(c.id)} className={`${erp.tr} cursor-pointer`} data-testid={`crm-row-${c.code}`}>
                    <td className={`${erp.td} border-l-0 ${erp.code} whitespace-nowrap`}>{c.code}</td>
                    <td className={`${erp.td} min-w-[240px]`}>
                      <p className="font-semibold text-slate-800">{c.name}</p>
                      <p className="text-[11px] text-slate-500">{c.sector}</p>
                    </td>
                    <td className={`${erp.td} whitespace-nowrap text-slate-600`}>{c.level}</td>
                    <td className={erp.td}>
                      <DivTag d={c.division} />
                    </td>
                    <td className={erp.td}>
                      <TierTag t={c.tier} />
                    </td>
                    <td className={`${erp.td} min-w-[190px]`}>
                      {p ? (
                        <>
                          <p className="font-semibold text-slate-800">{p.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {p.title} · <span className="tabular-nums">{p.phone}</span>
                          </p>
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className={`${erp.td} whitespace-nowrap text-[12px]`}>{p?.role}</td>
                    <td className={`${erp.td} text-[12px] text-slate-600 min-w-[120px]`}>{c.ownerIds.map(userName).join(', ') || <span className="text-rose-600">Chưa phân công</span>}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      {last ? (
                        <span className={gap! > STALE_DAYS ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                          {dmy(last)} <span className="text-[11px]">({gap} ngày)</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Chưa có</span>
                      )}
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      {open.length ? (
                        <span className={late ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                          {open.length} mở{late ? ` · ${late} quá hạn` : ''}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className={`${erp.td} border-r-0 whitespace-nowrap`}>
                      {nb ? (
                        <span className="text-[12px]">
                          {dmy(nb.date).slice(0, 5)} · {nb.ct.name.split(' ').slice(-2).join(' ')} <DueText days={nb.days} />
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={11} className={`${erp.td} border-x-0 py-8 text-center text-slate-400`}>
                    Không có khách hàng nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
};

// ==========================================================================
// Hồ sơ khách hàng
// ==========================================================================
type DTab = 'profile' | 'interactions' | 'work' | 'gifts' | 'sensitive' | 'log';

const CustomerDetail: React.FC<{ id: string; onBack: () => void; onEdit: () => void; toast: (m: string) => void }> = ({ id, onBack, onEdit, toast }) => {
  const s = useCrm();
  const me = useMe();
  const c = s.customers.find((x) => x.id === id);
  const [tab, setTab] = useState<DTab>('profile');
  const logged = useRef('');
  useEffect(() => {
    // Ghi nhật ký "Xem" mỗi lần mở hồ sơ (theo người xem)
    if (c && canSeeCustomer(me, c) && logged.current !== me.id) {
      logged.current = me.id;
      crm.audit('Xem', c.code, 'Mở hồ sơ khách hàng');
    }
  }, [c, me]);
  if (!c) return <ErpTitleBar onBack={onBack} title="Khách hàng không còn tồn tại" />;
  if (!canSeeCustomer(me, c))
    return (
      <>
        <ErpTitleBar onBack={onBack} title={c.code} actions={<RoleSwitcher />} />
        <NoAccess text={`Bạn (${me.name}) không có quyền xem hồ sơ ${c.code} — khách thuộc khối ${c.division}.`} />
      </>
    );
  const edit = canEditCustomer(me, c);
  const t = todayIso();
  const last = lastContactOf(c);
  const gifts = s.gifts.filter((g) => g.customerId === c.id);
  const tabs = [
    { key: 'profile' as const, label: 'Hồ sơ', icon: BookUser },
    { key: 'interactions' as const, label: `Tương tác (${c.interactions.length})`, icon: MessageSquareText },
    { key: 'work' as const, label: `Cam kết & dự án (${c.commitments.filter((x) => !x.done).length}/${c.projects.length})`, icon: Briefcase },
    { key: 'gifts' as const, label: `Quà tặng (${gifts.length})`, icon: GiftIcon },
    ...(canSensitive(me) ? [{ key: 'sensitive' as const, label: 'Ghi chú nhạy cảm', icon: Lock }] : []),
    { key: 'log' as const, label: 'Nhật ký', icon: History },
  ];

  return (
    <>
      <ErpTitleBar
        onBack={onBack}
        title={
          <>
            {c.code} · {c.name}
            <TierTag t={c.tier} />
            {c.archived && <Tag cls={TAG.slate}>Đã lưu trữ</Tag>}
          </>
        }
        actions={
          <>
            {canArchiveCustomer(me, c) && (
              <Btn
                variant={c.archived ? 'default' : 'danger'}
                icon={c.archived ? ArchiveRestore : Archive}
                onClick={() => {
                  crm.patchCustomer(c.id, (x) => ({ ...x, archived: !x.archived }), c.archived ? 'Khôi phục' : 'Lưu trữ', c.archived ? 'Khôi phục hồ sơ' : 'Lưu trữ hồ sơ (xoá mềm)');
                  toast(c.archived ? 'Đã khôi phục khách hàng' : 'Đã lưu trữ khách hàng (xoá mềm)');
                }}
              >
                {c.archived ? 'Khôi phục' : 'Lưu trữ'}
              </Btn>
            )}
            {edit && (
              <Btn variant="primary" icon={Pencil} onClick={onEdit} data-testid="crm-edit">
                Sửa hồ sơ
              </Btn>
            )}
            <RoleSwitcher />
          </>
        }
        meta={[
          { label: 'Cấp cơ quan', value: c.level },
          { label: 'Khối phụ trách', value: c.division },
          { label: 'Lĩnh vực', value: c.sector },
          { label: 'Phụ trách', value: c.ownerIds.map(userName).join(', ') || 'Chưa phân công' },
          { label: 'Tiếp xúc gần nhất', value: last ? `${dmy(last)} (${daysBetween(last, t)} ngày)` : 'Chưa có' },
        ]}
      />
      <div>
        <FolderTabs tabs={tabs} value={tab} onChange={setTab} />
        <div className="space-y-3 pt-3">
          {tab === 'profile' && <ProfileTab c={c} me={me} toast={toast} />}
          {tab === 'interactions' && <InteractionsTab c={c} me={me} toast={toast} />}
          {tab === 'work' && <WorkTab c={c} me={me} toast={toast} />}
          {tab === 'gifts' && <CustomerGifts c={c} gifts={gifts} />}
          {tab === 'sensitive' && canSensitive(me) && <SensitiveTab c={c} toast={toast} />}
          {tab === 'log' && <CustomerLog code={c.code} />}
        </div>
      </div>
    </>
  );
};

const ProfileTab: React.FC<{ c: Customer; me: CrmUser; toast: (m: string) => void }> = ({ c, me, toast }) => {
  const [bd, setBd] = useState<{ id: string; v: string } | null>(null);
  return (
    <>
      <Panel title="Thông tin cơ quan, đơn vị" icon={BookUser} noPad>
        <InfoGrid
          left={[
            { label: 'Tên cơ quan, đơn vị', value: <b>{c.name}</b> },
            { label: 'Cấp cơ quan', value: c.level },
            { label: 'Lĩnh vực', value: c.sector },
            { label: 'Địa chỉ', value: c.address },
          ]}
          right={[
            { label: 'Khối phụ trách', value: <DivTag d={c.division} /> },
            { label: 'Tier', value: <span className="inline-flex items-center gap-2"><TierTag t={c.tier} /> <span className="text-slate-500 text-[12px]">{TIER_HINT[c.tier]}</span></span> },
            { label: 'Ngày thành lập', value: c.foundingDate ? (c.foundingDate.length > 5 ? dmy(c.foundingDate) : c.foundingDate.split('-').reverse().join('/')) : '' },
            { label: 'Nhân sự phụ trách', value: c.ownerIds.map(userName).join(', ') },
          ]}
        />
      </Panel>
      <Panel title={`Đầu mối (${c.contacts.length})`} icon={Users} noPad footer="★ Đầu mối chính · Ngày sinh dùng để nhắc sinh nhật (nhắc trước 7 ngày) · Nhân sự phụ trách được sửa ngày sinh">
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                {['Họ và tên', 'Chức vụ', 'Số điện thoại', 'Project Role', 'Ngày sinh', 'Email công vụ', 'Email cá nhân', 'Trợ lý / thư ký'].map((h, i) => (
                  <th key={h} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 7 ? 'border-r-0' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.contacts.map((x) => (
                <tr key={x.id} className={erp.tr}>
                  <td className={`${erp.td} border-l-0 whitespace-nowrap font-semibold`}>
                    {x.primary && <Star size={12} className="inline -mt-0.5 mr-1 text-amber-500 fill-amber-400" />}
                    {x.name}
                  </td>
                  <td className={`${erp.td} whitespace-nowrap`}>{x.title}</td>
                  <td className={`${erp.td} whitespace-nowrap tabular-nums`}>
                    <Phone size={11} className="inline -mt-0.5 mr-1 text-slate-400" />
                    {x.phone}
                  </td>
                  <td className={`${erp.td} whitespace-nowrap`} title={PROJECT_ROLE_VI[x.role]}>
                    <Tag cls={x.role === 'Decision Maker' ? TAG.rose : x.role === 'Influencer' ? TAG.violet : TAG.slate}>{x.role}</Tag>
                  </td>
                  <td className={`${erp.td} whitespace-nowrap`}>
                    {bd?.id === x.id ? (
                      <span className="flex items-center gap-1 w-[180px]">
                        <DateInput value={bd.v} onChange={(v) => setBd({ id: x.id, v })} />
                        <button
                          type="button"
                          className="p-1 text-emerald-600 cursor-pointer"
                          title="Lưu"
                          onClick={() => {
                            if (!bd.v) return;
                            crm.patchCustomer(c.id, (k) => ({ ...k, contacts: k.contacts.map((y) => (y.id === x.id ? { ...y, birthday: bd.v } : y)) }), 'Sửa', `Ngày sinh ${x.name}: ${dmy(x.birthday)} → ${dmy(bd.v)}`);
                            setBd(null);
                            toast('Đã cập nhật ngày sinh');
                          }}
                        >
                          <Save size={14} />
                        </button>
                        <button type="button" className="p-1 text-slate-400 cursor-pointer" title="Huỷ" onClick={() => setBd(null)}>
                          <X size={14} />
                        </button>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        {dmy(x.birthday)} <span className="text-[11px] text-slate-400">({ageOf(x.birthday)} tuổi)</span>
                        {canEditBirthday(me, c) && (
                          <button type="button" className="p-0.5 text-slate-400 hover:text-[#1f5fa8] cursor-pointer" title="Sửa ngày sinh" onClick={() => setBd({ id: x.id, v: x.birthday })}>
                            <Pencil size={11} />
                          </button>
                        )}
                      </span>
                    )}
                  </td>
                  <td className={`${erp.td} text-[12px]`}>{x.emailWork || '—'}</td>
                  <td className={`${erp.td} text-[12px]`}>{x.emailPersonal || '—'}</td>
                  <td className={`${erp.td} border-r-0 text-[12px] whitespace-nowrap`}>{x.assistantName ? `${x.assistantName} · ${x.assistantPhone}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
};

const InteractionsTab: React.FC<{ c: Customer; me: CrmUser; toast: (m: string) => void }> = ({ c, me, toast }) => {
  const blank = (): Interaction => ({ id: uid('it'), date: todayIso(), type: 'Gặp trực tiếp', contactIds: [c.contacts[0]?.id].filter(Boolean) as string[], summary: '', by: me.id });
  const [f, setF] = useState<Interaction | null>(null);
  const list = [...c.interactions].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <Panel
      title="Lịch sử tương tác — ghi chú sau mỗi lần làm việc"
      icon={MessageSquareText}
      actions={
        canWorkLog(me, c) && !f ? (
          <Btn variant="primary" icon={Plus} className="h-7" onClick={() => setF(blank())} data-testid="crm-add-interaction">
            Ghi tương tác
          </Btn>
        ) : undefined
      }
    >
      {f && (
        <div className="mb-3 border border-[#b9d3f0] bg-[#f5f9fe] rounded-[4px] p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
          <FormRow label="Ngày" required>
            <DateInput value={f.date} onChange={(v) => setF({ ...f, date: v })} />
          </FormRow>
          <FormRow label="Hình thức" required>
            <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as InteractionType })} className={`${erp.inputFull} cursor-pointer`}>
              {INTERACTION_TYPES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Đầu mối tham gia" className="md:col-span-2">
            <div className="flex flex-wrap gap-x-3 gap-y-1 min-h-8 items-center">
              {c.contacts.map((x) => (
                <label key={x.id} className="flex items-center gap-1 text-[12.5px] cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-[#1f5fa8]"
                    checked={f.contactIds.includes(x.id)}
                    onChange={(e) => setF({ ...f, contactIds: e.target.checked ? [...f.contactIds, x.id] : f.contactIds.filter((y) => y !== x.id) })}
                  />
                  {x.name}
                </label>
              ))}
            </div>
          </FormRow>
          <FormRow label="Nội dung / meeting notes" required className="md:col-span-4">
            <textarea rows={3} value={f.summary} onChange={(e) => setF({ ...f, summary: e.target.value })} className={`${erp.inputFull} h-auto py-1.5`} placeholder="Nội dung trao đổi, kết luận, việc cần làm tiếp…" data-testid="crm-interaction-text" />
          </FormRow>
          <div className="md:col-span-4 flex justify-end gap-2">
            <Btn icon={X} onClick={() => setF(null)}>
              Huỷ
            </Btn>
            <Btn
              variant="primary"
              icon={Save}
              onClick={() => {
                if (!f.summary.trim() || !f.date) return toast('Nhập ngày và nội dung tương tác');
                crm.patchCustomer(c.id, (x) => ({ ...x, interactions: [...x.interactions, { ...f, summary: f.summary.trim() }] }), 'Tạo', `Tương tác ${f.type} ${dmy(f.date)}`);
                setF(null);
                toast('Đã ghi tương tác');
              }}
              data-testid="crm-save-interaction"
            >
              Lưu
            </Btn>
          </div>
        </div>
      )}
      {list.length ? (
        <ol className="relative border-l-2 border-slate-200 ml-2 space-y-3">
          {list.map((x) => (
            <li key={x.id} className="ml-4">
              <span className="absolute -left-[7px] mt-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#1f5fa8]" />
              <div className="flex flex-wrap items-center gap-2 text-[12px]">
                <b className="text-[#1e3a5f] tabular-nums">{dmy(x.date)}</b>
                <Tag cls={TAG.blue}>{x.type}</Tag>
                <span className="text-slate-500">
                  {x.contactIds.map((cid) => c.contacts.find((k) => k.id === cid)?.name).filter(Boolean).join(', ') || '—'} · ghi bởi {userName(x.by)}
                </span>
              </div>
              <p className="text-[13px] text-slate-700 mt-0.5">{x.summary}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-[12.5px] text-slate-400 py-4 text-center">Chưa có tương tác nào.</p>
      )}
    </Panel>
  );
};

const WorkTab: React.FC<{ c: Customer; me: CrmUser; toast: (m: string) => void }> = ({ c, me, toast }) => {
  const t = todayIso();
  const can = canWorkLog(me, c);
  const [cm, setCm] = useState<Commitment | null>(null);
  const [pj, setPj] = useState<CustomerProject | null>(null);
  const owners = [...new Set([...c.ownerIds, ...CRM_USERS.filter((u) => u.role === 'gdk' && u.division === c.division).map((u) => u.id)])];
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
      <Panel
        title="Cam kết / nhiệm vụ với khách"
        icon={CalendarClock}
        noPad
        actions={can && !cm ? <Btn variant="primary" icon={Plus} className="h-7" onClick={() => setCm({ id: uid('cm'), content: '', dueDate: addDaysIso(t, 7), ownerId: me.role === 'nsk' ? me.id : owners[0], done: false })}>Thêm cam kết</Btn> : undefined}
        footer="Cam kết quá hạn chưa hoàn thành được nhắc ở Nhắc việc & Tổng quan."
      >
        {cm && (
          <div className="p-3 border-b border-slate-200 bg-[#f5f9fe] grid grid-cols-1 sm:grid-cols-3 gap-2">
            <FormRow label="Nội dung cam kết" required className="sm:col-span-3">
              <input value={cm.content} onChange={(e) => setCm({ ...cm, content: e.target.value })} className={erp.inputFull} />
            </FormRow>
            <FormRow label="Hạn" required>
              <DateInput value={cm.dueDate} onChange={(v) => setCm({ ...cm, dueDate: v })} />
            </FormRow>
            <FormRow label="Người thực hiện">
              <select value={cm.ownerId} onChange={(e) => setCm({ ...cm, ownerId: e.target.value })} className={`${erp.inputFull} cursor-pointer`}>
                {owners.map((o) => (
                  <option key={o} value={o}>
                    {userName(o)}
                  </option>
                ))}
              </select>
            </FormRow>
            <div className="flex items-end justify-end gap-2">
              <Btn icon={X} onClick={() => setCm(null)}>
                Huỷ
              </Btn>
              <Btn
                variant="primary"
                icon={Save}
                onClick={() => {
                  if (!cm.content.trim() || !cm.dueDate) return toast('Nhập nội dung và hạn');
                  crm.patchCustomer(c.id, (x) => ({ ...x, commitments: [...x.commitments, cm] }), 'Tạo', `Cam kết: ${cm.content}`);
                  setCm(null);
                  toast('Đã thêm cam kết');
                }}
              >
                Lưu
              </Btn>
            </div>
          </div>
        )}
        <table className={erp.table}>
          <thead>
            <tr>
              {['', 'Nội dung', 'Hạn', 'Người thực hiện'].map((h, i) => (
                <th key={i} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0 w-8' : ''} ${i === 3 ? 'border-r-0' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...c.commitments]
              .sort((a, b) => Number(a.done) - Number(b.done) || a.dueDate.localeCompare(b.dueDate))
              .map((x) => (
                <tr key={x.id} className={erp.tr}>
                  <td className={`${erp.td} border-l-0 text-center`}>
                    <input
                      type="checkbox"
                      checked={x.done}
                      disabled={!can}
                      className="accent-emerald-600 cursor-pointer"
                      onChange={(e) =>
                        crm.patchCustomer(c.id, (k) => ({ ...k, commitments: k.commitments.map((y) => (y.id === x.id ? { ...y, done: e.target.checked, doneAt: e.target.checked ? nowIso() : undefined } : y)) }), 'Sửa', `${e.target.checked ? 'Hoàn thành' : 'Mở lại'} cam kết: ${x.content}`)
                      }
                    />
                  </td>
                  <td className={`${erp.td} ${x.done ? 'line-through text-slate-400' : ''}`}>{x.content}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>
                    {dmy(x.dueDate)} {!x.done && <DueText days={daysBetween(t, x.dueDate)} />}
                  </td>
                  <td className={`${erp.td} border-r-0 whitespace-nowrap`}>{userName(x.ownerId)}</td>
                </tr>
              ))}
            {!c.commitments.length && (
              <tr>
                <td colSpan={4} className={`${erp.td} border-x-0 py-6 text-center text-slate-400`}>
                  Chưa có cam kết.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>
      <Panel
        title="Dự án với khách"
        icon={Briefcase}
        noPad
        actions={can && !pj ? <Btn variant="primary" icon={Plus} className="h-7" onClick={() => setPj({ id: uid('pj'), name: '', code: '', stage: 'Tiếp cận', value: 0, note: '' })}>Thêm dự án</Btn> : undefined}
      >
        {pj && (
          <div className="p-3 border-b border-slate-200 bg-[#f5f9fe] grid grid-cols-1 sm:grid-cols-2 gap-2">
            <FormRow label="Tên dự án" required className="sm:col-span-2">
              <input value={pj.name} onChange={(e) => setPj({ ...pj, name: e.target.value })} className={erp.inputFull} />
            </FormRow>
            <FormRow label="Mã dự án (nếu có)">
              <input value={pj.code} onChange={(e) => setPj({ ...pj, code: e.target.value })} className={erp.inputFull} placeholder="VD: 022.061" />
            </FormRow>
            <FormRow label="Giai đoạn">
              <select value={pj.stage} onChange={(e) => setPj({ ...pj, stage: e.target.value as ProjectStage })} className={`${erp.inputFull} cursor-pointer`}>
                {PROJECT_STAGES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </FormRow>
            <FormRow label="Giá trị dự kiến (VNĐ)">
              <input value={pj.value ? pj.value.toLocaleString('en-US') : ''} onChange={(e) => setPj({ ...pj, value: Number(e.target.value.replace(/\D/g, '')) || 0 })} className={`${erp.inputFull} text-right tabular-nums`} />
            </FormRow>
            <div className="flex items-end justify-end gap-2">
              <Btn icon={X} onClick={() => setPj(null)}>
                Huỷ
              </Btn>
              <Btn
                variant="primary"
                icon={Save}
                onClick={() => {
                  if (!pj.name.trim()) return toast('Nhập tên dự án');
                  crm.patchCustomer(c.id, (x) => ({ ...x, projects: [...x.projects, pj] }), 'Tạo', `Dự án: ${pj.name}`);
                  setPj(null);
                  toast('Đã thêm dự án');
                }}
              >
                Lưu
              </Btn>
            </div>
          </div>
        )}
        <table className={erp.table}>
          <thead>
            <tr>
              {['Dự án', 'Mã', 'Giai đoạn', 'Giá trị dự kiến'].map((h, i) => (
                <th key={h} className={`${erp.th} ${i === 3 ? 'text-right border-r-0' : 'text-left'} border-t-0 ${i === 0 ? 'border-l-0' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.projects.map((x) => (
              <tr key={x.id} className={erp.tr}>
                <td className={`${erp.td} border-l-0 font-semibold`}>{x.name}</td>
                <td className={`${erp.td} ${erp.code}`}>{x.code || '—'}</td>
                <td className={erp.td}>
                  {can ? (
                    <select
                      value={x.stage}
                      onChange={(e) => crm.patchCustomer(c.id, (k) => ({ ...k, projects: k.projects.map((y) => (y.id === x.id ? { ...y, stage: e.target.value as ProjectStage } : y)) }), 'Sửa', `Dự án ${x.name}: ${x.stage} → ${e.target.value}`)}
                      className="h-7 border border-slate-300 rounded-[3px] px-1.5 text-[12px] bg-white cursor-pointer"
                    >
                      {PROJECT_STAGES.map((st) => (
                        <option key={st}>{st}</option>
                      ))}
                    </select>
                  ) : (
                    x.stage
                  )}
                </td>
                <td className={`${erp.td} ${erp.num} border-r-0`}>{fmtMoney(x.value)}</td>
              </tr>
            ))}
            {!c.projects.length && (
              <tr>
                <td colSpan={4} className={`${erp.td} border-x-0 py-6 text-center text-slate-400`}>
                  Chưa có dự án.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
};

const CustomerGifts: React.FC<{ c: Customer; gifts: Gift[] }> = ({ c, gifts }) => (
  <Panel title="Lịch sử quà tặng" icon={GiftIcon} noPad footer={`Tổng giá trị: ${fmtMoney(gifts.reduce((a, g) => a + g.value * g.quantity, 0))} VNĐ · ghi thêm ở màn Sổ quà tặng hoặc khi xử lý nhắc việc "Đã gửi quà"`}>
    <table className={erp.table}>
      <thead>
        <tr>
          {['Ngày', 'Dịp', 'Người nhận', 'Quà tặng', 'SL', 'Giá trị', 'Người tặng'].map((h, i) => (
            <th key={h} className={`${erp.th} ${i === 4 || i === 5 ? 'text-right' : 'text-left'} border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 6 ? 'border-r-0' : ''}`}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {gifts.map((g) => (
          <tr key={g.id} className={erp.tr}>
            <td className={`${erp.td} border-l-0 whitespace-nowrap`}>{dmy(g.date)}</td>
            <td className={erp.td}>{g.occasion}</td>
            <td className={erp.td}>{c.contacts.find((x) => x.id === g.contactId)?.name || 'Cơ quan'}</td>
            <td className={erp.td}>{g.item}</td>
            <td className={`${erp.td} ${erp.num}`}>{g.quantity}</td>
            <td className={`${erp.td} ${erp.num}`}>{fmtMoney(g.value * g.quantity)}</td>
            <td className={`${erp.td} border-r-0`}>{userName(g.givenBy)}</td>
          </tr>
        ))}
        {!gifts.length && (
          <tr>
            <td colSpan={7} className={`${erp.td} border-x-0 py-6 text-center text-slate-400`}>
              Chưa tặng quà.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </Panel>
);

const SensitiveTab: React.FC<{ c: Customer; toast: (m: string) => void }> = ({ c, toast }) => {
  const [v, setV] = useState(c.sensitiveNote);
  useEffect(() => {
    crm.audit('Xem', c.code, 'Xem ghi chú nhạy cảm');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Panel title="Ghi chú nhạy cảm — quan điểm riêng, lưu ý đặc thù" icon={Lock} footer="Chỉ Chủ tịch HĐQT và BP Đối ngoại xem / sửa. Mỗi lần xem và sửa đều ghi nhật ký.">
      <div className="flex items-start gap-2 mb-2 px-3 py-2 rounded-[3px] bg-rose-50 border border-rose-200 text-[12px] text-rose-800">
        <Lock size={14} className="shrink-0 mt-0.5" /> Thông tin mật — không chia sẻ ra ngoài, không đưa vào file xuất của khối.
      </div>
      <textarea rows={6} value={v} onChange={(e) => setV(e.target.value)} className={`${erp.inputFull} h-auto py-2`} placeholder="Quan điểm riêng của lãnh đạo, lưu ý khi làm việc…" data-testid="crm-sensitive" />
      <div className="flex justify-end mt-2">
        <Btn
          variant="primary"
          icon={Save}
          disabled={v === c.sensitiveNote}
          onClick={() => {
            crm.patchCustomer(c.id, (x) => ({ ...x, sensitiveNote: v }), 'Sửa', 'Cập nhật ghi chú nhạy cảm');
            toast('Đã lưu ghi chú nhạy cảm');
          }}
        >
          Lưu ghi chú
        </Btn>
      </div>
    </Panel>
  );
};

const CustomerLog: React.FC<{ code: string }> = ({ code }) => {
  const s = useCrm();
  const list = s.audit.filter((a) => a.target === code);
  return (
    <Panel title="Nhật ký truy cập & thay đổi" icon={History} noPad>
      <table className={erp.table}>
        <thead>
          <tr>
            {['Thời gian', 'Người thực hiện', 'Thao tác', 'Chi tiết'].map((h, i) => (
              <th key={h} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 3 ? 'border-r-0' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((a) => (
            <tr key={a.id} className={erp.tr}>
              <td className={`${erp.td} border-l-0 whitespace-nowrap tabular-nums`}>{new Date(a.at).toLocaleString('vi-VN')}</td>
              <td className={`${erp.td} whitespace-nowrap`}>{userName(a.by)}</td>
              <td className={erp.td}>
                <Tag cls={a.action === 'Xem' ? TAG.slate : a.action === 'Xuất dữ liệu' ? TAG.amber : a.action === 'Lưu trữ' ? TAG.rose : TAG.blue}>{a.action}</Tag>
              </td>
              <td className={`${erp.td} border-r-0`}>{a.detail || '—'}</td>
            </tr>
          ))}
          {!list.length && (
            <tr>
              <td colSpan={4} className={`${erp.td} border-x-0 py-6 text-center text-slate-400`}>
                Chưa có nhật ký.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Panel>
  );
};

// ==========================================================================
// Thêm / sửa hồ sơ (trường bắt buộc mục 3.1)
// ==========================================================================
const blankContact = (primary: boolean): Contact => ({
  id: uid('ct'), name: '', title: '', phone: '', role: 'Decision Maker', birthday: '', emailWork: '', emailPersonal: '', assistantName: '', assistantPhone: '', primary,
});
const PHONE_RE = /^[0-9 +().-]{9,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CustomerForm: React.FC<{ id?: string; onCancel: () => void; onSaved: (id: string, msg: string) => void }> = ({ id, onCancel, onSaved }) => {
  const s = useCrm();
  const me = useMe();
  const orig = id ? s.customers.find((x) => x.id === id) : undefined;
  const [c, setC] = useState<Customer>(() =>
    orig
      ? structuredClone(orig)
      : {
          id: uid('kh'),
          code: `KH-${String(Math.max(0, ...s.customers.map((x) => Number(x.code.slice(3)) || 0)) + 1).padStart(4, '0')}`,
          name: '',
          level: 'Trung ương',
          sector: 'Quản lý nhà nước',
          division: (me.division || 'G1') as CrmDivision,
          tier: 'Tier 2',
          ownerIds: [],
          foundingDate: '',
          address: '',
          contacts: [blankContact(true)],
          interactions: [],
          commitments: [],
          projects: [],
          sensitiveNote: '',
          archived: false,
          createdAt: nowIso(),
          createdBy: me.id,
          updatedAt: nowIso(),
        },
  );
  const [tried, setTried] = useState(false);
  const setCt = (cid: string, p: Partial<Contact>) => setC((x) => ({ ...x, contacts: x.contacts.map((k) => (k.id === cid ? { ...k, ...p } : p.primary ? { ...k, primary: false } : k)) }));

  // Kiểm tra
  const E: Record<string, string> = {};
  if (!c.name.trim()) E.name = 'Bắt buộc';
  else if (s.customers.some((x) => x.id !== c.id && x.name.trim().toLowerCase() === c.name.trim().toLowerCase())) E.name = 'Đã có hồ sơ cơ quan này';
  if (!c.contacts.length) E.contacts = 'Cần ít nhất 1 đầu mối';
  if (c.contacts.filter((k) => k.primary).length !== 1) E.contacts = 'Chọn đúng 1 đầu mối chính';
  c.contacts.forEach((k) => {
    if (!k.name.trim()) E[`${k.id}.name`] = 'Bắt buộc';
    if (!k.title.trim()) E[`${k.id}.title`] = 'Bắt buộc';
    if (!k.phone.trim()) E[`${k.id}.phone`] = 'Bắt buộc';
    else if (!PHONE_RE.test(k.phone.trim())) E[`${k.id}.phone`] = 'Số điện thoại không hợp lệ';
    if (!k.birthday) E[`${k.id}.birthday`] = 'Bắt buộc (đủ ngày/tháng/năm)';
    else if (k.birthday > todayIso()) E[`${k.id}.birthday`] = 'Sau ngày hôm nay';
    if (k.emailWork && !EMAIL_RE.test(k.emailWork)) E[`${k.id}.emailWork`] = 'Email không hợp lệ';
    if (k.emailPersonal && !EMAIL_RE.test(k.emailPersonal)) E[`${k.id}.emailPersonal`] = 'Email không hợp lệ';
    if (k.assistantPhone && !PHONE_RE.test(k.assistantPhone)) E[`${k.id}.assistantPhone`] = 'Số điện thoại không hợp lệ';
  });
  const err = (k: string) => (tried ? E[k] : undefined);
  const inv = (k: string) => (err(k) ? '!border-rose-400 !bg-rose-50/40' : '');
  const lockDiv = !isTop(me);

  const save = () => {
    setTried(true);
    if (Object.keys(E).length) return;
    const clean: Customer = { ...c, name: c.name.trim(), contacts: c.contacts.map((k) => ({ ...k, name: k.name.trim(), title: k.title.trim(), phone: k.phone.trim() })) };
    const changes: string[] = [];
    if (orig) {
      (['name', 'level', 'sector', 'division', 'tier', 'foundingDate', 'address'] as const).forEach((k) => orig[k] !== clean[k] && changes.push(`${k}: ${orig[k] || '—'} → ${clean[k] || '—'}`));
      if (orig.contacts.length !== clean.contacts.length) changes.push(`Đầu mối: ${orig.contacts.length} → ${clean.contacts.length}`);
      else if (JSON.stringify(orig.contacts) !== JSON.stringify(clean.contacts)) changes.push('Cập nhật thông tin đầu mối');
      if (orig.ownerIds.join() !== clean.ownerIds.join()) changes.push(`Phụ trách: ${clean.ownerIds.map(userName).join(', ') || '—'}`);
      if (orig.sensitiveNote !== clean.sensitiveNote) changes.push('Ghi chú nhạy cảm');
    }
    crm.saveCustomer(clean, changes);
    onSaved(clean.id, orig ? `Đã lưu hồ sơ ${clean.code}` : `Đã tạo khách hàng ${clean.code}`);
  };

  return (
    <>
      <ErpTitleBar
        crumbs={CRUMBS(orig ? 'Sửa hồ sơ' : 'Thêm khách hàng')}
        title={orig ? `Sửa hồ sơ ${orig.code}` : 'Thêm khách hàng mới'}
        actions={
          <>
            <Btn icon={X} onClick={onCancel}>
              Huỷ
            </Btn>
            <Btn variant="primary" icon={Save} onClick={save} data-testid="crm-save">
              Lưu hồ sơ
            </Btn>
          </>
        }
        notice={
          tried && Object.keys(E).length ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-800 text-[12.5px]">
              <AlertTriangle size={14} /> Còn {Object.keys(E).length} trường chưa hợp lệ — xem các ô báo đỏ.
            </div>
          ) : undefined
        }
      />
      <Panel title="1. Tổ chức" icon={BookUser}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormRow label="Tên cơ quan, đơn vị" required error={err('name')} className="md:col-span-2">
            <input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} className={`${erp.inputFull} ${inv('name')}`} placeholder="VD: Cục CNTT thuộc Bộ Tài chính" data-testid="crm-f-name" />
          </FormRow>
          <FormRow label="Cấp cơ quan" required>
            <select value={c.level} onChange={(e) => setC({ ...c, level: e.target.value as OrgLevel })} className={`${erp.inputFull} cursor-pointer`}>
              {ORG_LEVELS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Khối phụ trách" required hint={lockDiv ? 'Giám đốc khối chỉ tạo khách của khối mình' : undefined}>
            <select value={c.division} disabled={lockDiv} onChange={(e) => setC({ ...c, division: e.target.value as CrmDivision, ownerIds: [] })} className={`${erp.inputFull} cursor-pointer`}>
              {CRM_DIVISIONS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Lĩnh vực" hint="Dùng để nhắc ngày truyền thống ngành">
            <select value={c.sector} onChange={(e) => setC({ ...c, sector: e.target.value as Sector })} className={`${erp.inputFull} cursor-pointer`}>
              {SECTORS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Tier">
            <select value={c.tier} onChange={(e) => setC({ ...c, tier: e.target.value as Tier })} className={`${erp.inputFull} cursor-pointer`}>
              {TIERS.map((x) => (
                <option key={x} value={x}>
                  {x} — {TIER_HINT[x]}
                </option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Ngày thành lập cơ quan" hint="Nhắc kỷ niệm thành lập hằng năm">
            <DateInput value={c.foundingDate.length > 5 ? c.foundingDate : ''} onChange={(v) => setC({ ...c, foundingDate: v })} />
          </FormRow>
          <FormRow label="Địa chỉ" className="md:col-span-2">
            <input value={c.address} onChange={(e) => setC({ ...c, address: e.target.value })} className={erp.inputFull} />
          </FormRow>
          <FormRow label="Nhân sự khối phụ trách" className="md:col-span-3">
            <div className="flex flex-wrap gap-x-4 gap-y-1 min-h-8 items-center">
              {ownersOf(c.division).map((u) => (
                <label key={u.id} className="flex items-center gap-1.5 text-[12.5px] cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-[#1f5fa8]"
                    checked={c.ownerIds.includes(u.id)}
                    onChange={(e) => setC({ ...c, ownerIds: e.target.checked ? [...c.ownerIds, u.id] : c.ownerIds.filter((x) => x !== u.id) })}
                  />
                  {u.name}
                </label>
              ))}
              {!ownersOf(c.division).length && <span className="text-[12px] text-slate-400">Khối chưa có nhân sự</span>}
            </div>
          </FormRow>
        </div>
      </Panel>

      <Panel
        title={`2. Đầu mối (${c.contacts.length})`}
        icon={UserRound}
        actions={
          <Btn icon={Plus} className="h-7" onClick={() => setC({ ...c, contacts: [...c.contacts, blankContact(!c.contacts.length)] })} data-testid="crm-add-contact">
            Thêm đầu mối
          </Btn>
        }
      >
        {err('contacts') && <p className="mb-2 text-[12px] text-rose-600">{err('contacts')}</p>}
        <div className="space-y-3">
          {c.contacts.map((k, i) => (
            <div key={k.id} className={`border rounded-[4px] ${k.primary ? 'border-[#1f5fa8] bg-[#f7fbff]' : 'border-slate-200'}`}>
              <div className="flex items-center gap-3 px-3 py-1.5 border-b border-slate-200 bg-white/60">
                <b className="text-[12.5px] text-[#1e3a5f]">Đầu mối {i + 1}</b>
                <label className="flex items-center gap-1.5 text-[12px] cursor-pointer">
                  <input type="radio" name="primary" className="accent-[#1f5fa8]" checked={k.primary} onChange={() => setCt(k.id, { primary: true })} /> Đầu mối chính
                </label>
                {c.contacts.length > 1 && (
                  <button
                    type="button"
                    className="ml-auto p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Xoá đầu mối"
                    onClick={() => setC({ ...c, contacts: c.contacts.filter((x) => x.id !== k.id).map((x, j, arr) => (k.primary && j === 0 && !arr.some((y) => y.primary) ? { ...x, primary: true } : x)) })}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
                <FormRow label="Họ và tên" required error={err(`${k.id}.name`)}>
                  <input value={k.name} onChange={(e) => setCt(k.id, { name: e.target.value })} className={`${erp.inputFull} ${inv(`${k.id}.name`)}`} placeholder="Nguyễn Văn A" data-testid={`crm-c${i}-name`} />
                </FormRow>
                <FormRow label="Chức vụ" required error={err(`${k.id}.title`)}>
                  <input value={k.title} onChange={(e) => setCt(k.id, { title: e.target.value })} list="crm-titles" className={`${erp.inputFull} ${inv(`${k.id}.title`)}`} placeholder="Cục trưởng" data-testid={`crm-c${i}-title`} />
                </FormRow>
                <FormRow label="Số điện thoại" required error={err(`${k.id}.phone`)}>
                  <input value={k.phone} onChange={(e) => setCt(k.id, { phone: e.target.value })} className={`${erp.inputFull} tabular-nums ${inv(`${k.id}.phone`)}`} placeholder="09xx xxx xxx" data-testid={`crm-c${i}-phone`} />
                </FormRow>
                <FormRow label="Ngày sinh" required error={err(`${k.id}.birthday`)}>
                  <span data-testid={`crm-c${i}-birthday`}>
                    <DateInput value={k.birthday} onChange={(v) => setCt(k.id, { birthday: v })} className={inv(`${k.id}.birthday`)} />
                  </span>
                </FormRow>
                <FormRow label="Vai trò trong dự án (Project Role)" required className="md:col-span-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {PROJECT_ROLES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setCt(k.id, { role: r as ProjectRole })}
                        className={`text-left px-3 py-1.5 rounded-[4px] border cursor-pointer ${k.role === r ? 'border-[#1f5fa8] bg-[#eaf2fc] ring-1 ring-[#1f5fa8]' : 'border-slate-300 bg-white hover:border-slate-400'}`}
                      >
                        <span className="block text-[12.5px] font-semibold text-slate-800">{r}</span>
                        <span className="block text-[11px] text-slate-500">{PROJECT_ROLE_VI[r]}</span>
                      </button>
                    ))}
                  </div>
                </FormRow>
                <FormRow label="Email công vụ" error={err(`${k.id}.emailWork`)}>
                  <input value={k.emailWork} onChange={(e) => setCt(k.id, { emailWork: e.target.value })} className={`${erp.inputFull} ${inv(`${k.id}.emailWork`)}`} />
                </FormRow>
                <FormRow label="Email cá nhân" error={err(`${k.id}.emailPersonal`)}>
                  <input value={k.emailPersonal} onChange={(e) => setCt(k.id, { emailPersonal: e.target.value })} className={`${erp.inputFull} ${inv(`${k.id}.emailPersonal`)}`} />
                </FormRow>
                <FormRow label="Trợ lý / thư ký riêng" hint="Rất quan trọng với lãnh đạo nhà nước">
                  <input value={k.assistantName} onChange={(e) => setCt(k.id, { assistantName: e.target.value })} className={erp.inputFull} placeholder="Họ tên" />
                </FormRow>
                <FormRow label="SĐT trợ lý / thư ký" error={err(`${k.id}.assistantPhone`)}>
                  <input value={k.assistantPhone} onChange={(e) => setCt(k.id, { assistantPhone: e.target.value })} className={`${erp.inputFull} tabular-nums ${inv(`${k.id}.assistantPhone`)}`} />
                </FormRow>
              </div>
            </div>
          ))}
        </div>
        <datalist id="crm-titles">
          {['Bộ trưởng', 'Thứ trưởng', 'Cục trưởng', 'Phó Cục trưởng', 'Vụ trưởng', 'Chánh Văn phòng', 'Giám đốc Sở', 'Phó Giám đốc Sở', 'Trưởng phòng', 'Phó Trưởng phòng', 'Tổng Giám đốc', 'Phó Tổng Giám đốc', 'Giám đốc Khối CNTT'].map((x) => (
            <option key={x} value={x} />
          ))}
        </datalist>
      </Panel>

      {canSensitive(me) && (
        <Panel title="3. Ghi chú nhạy cảm (chỉ Chủ tịch & BP Đối ngoại)" icon={Lock}>
          <textarea rows={3} value={c.sensitiveNote} onChange={(e) => setC({ ...c, sensitiveNote: e.target.value })} className={`${erp.inputFull} h-auto py-1.5`} placeholder="Quan điểm riêng, lưu ý đặc thù…" />
        </Panel>
      )}
    </>
  );
};

// ==========================================================================
// Nhập dữ liệu hàng loạt
// ==========================================================================
const IMPORT_HEAD = ['Tên cơ quan, đơn vị', 'Cấp cơ quan', 'Lĩnh vực', 'Khối', 'Tier', 'Ngày thành lập', 'Đầu mối chính (x)', 'Họ và tên', 'Chức vụ', 'Số điện thoại', 'Project Role', 'Ngày sinh', 'Email công vụ', 'Email cá nhân', 'Trợ lý / thư ký', 'SĐT trợ lý'];

const parseDate = (v: unknown): string => {
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    return d ? `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}` : '';
  }
  const m = String(v ?? '').trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : '';
};

const ImportModal: React.FC<{ onClose: () => void; toast: (m: string) => void }> = ({ onClose, toast }) => {
  const s = useCrm();
  const me = useMe();
  const ref = useRef<HTMLInputElement>(null);
  const [res, setRes] = useState<{ file: string; list: Customer[]; errors: string[] } | null>(null);

  const template = () => {
    const d = me.division || 'G1';
    const ws = XLSX.utils.aoa_to_sheet([
      IMPORT_HEAD,
      ['Cục Mẫu Thống kê', 'Trung ương', 'Quản lý nhà nước', d, 'Tier 2', '20/05/1990', 'x', 'Nguyễn Văn Mẫu', 'Cục trưởng', '0900 000 001', 'Decision Maker', '12/04/1970', 'mau.nv@coquan-mau.gov.vn', '', 'Trần Thị Mẫu', '0900 000 002'],
      ['Cục Mẫu Thống kê', 'Trung ương', 'Quản lý nhà nước', d, 'Tier 2', '20/05/1990', '', 'Lê Văn Mẫu', 'Trưởng phòng', '0900 000 003', 'Influencer', '03/09/1980', '', '', '', ''],
    ]);
    ws['!cols'] = IMPORT_HEAD.map((h) => ({ wch: Math.max(14, h.length + 4) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Khách hàng');
    XLSX.writeFile(wb, 'Mau_nhap_khach_hang_CRM.xlsx');
  };

  const read = async (f: File) => {
    const wb = XLSX.read(await f.arrayBuffer(), { type: 'array' });
    const aoa = XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[wb.SheetNames[0]], { header: 1, defval: '', blankrows: false, raw: true });
    const errors: string[] = [];
    const groups = new Map<string, Customer>();
    let n = Math.max(0, ...s.customers.map((x) => Number(x.code.slice(3)) || 0));
    aoa.slice(1).forEach((r, i) => {
      const row = i + 2;
      const v = (k: number) => String(r[k] ?? '').trim();
      const name = v(0);
      if (!name) return;
      const division = v(3).toUpperCase() as CrmDivision;
      if (!CRM_DIVISIONS.includes(division)) return void errors.push(`Dòng ${row}: Khối "${v(3)}" không hợp lệ (G1, G2, G3, G4, BFSI).`);
      if (!isTop(me) && division !== me.division) return void errors.push(`Dòng ${row}: Bạn chỉ được nhập khách của khối ${me.division}.`);
      const level = (ORG_LEVELS as readonly string[]).includes(v(1)) ? (v(1) as OrgLevel) : null;
      if (!level) return void errors.push(`Dòng ${row}: Cấp cơ quan "${v(1)}" không hợp lệ.`);
      const role = (PROJECT_ROLES as readonly string[]).includes(v(10)) ? (v(10) as ProjectRole) : null;
      const birthday = parseDate(r[11]);
      const miss = [!v(7) && 'Họ và tên', !v(8) && 'Chức vụ', !v(9) && 'Số điện thoại', !role && 'Project Role', !birthday && 'Ngày sinh'].filter(Boolean);
      if (miss.length) return void errors.push(`Dòng ${row}: thiếu / sai ${miss.join(', ')}.`);
      const key = name.toLowerCase();
      const c =
        groups.get(key) ||
        ({
          id: uid('kh'),
          code: `KH-${String(++n).padStart(4, '0')}`,
          name,
          level,
          sector: ((SECTORS as readonly string[]).includes(v(2)) ? v(2) : 'Quản lý nhà nước') as Sector,
          division,
          tier: ((TIERS as readonly string[]).includes(v(4)) ? v(4) : 'Tier 3') as Tier,
          ownerIds: [],
          foundingDate: parseDate(r[5]),
          address: '',
          contacts: [],
          interactions: [],
          commitments: [],
          projects: [],
          sensitiveNote: '',
          archived: false,
          createdAt: nowIso(),
          createdBy: me.id,
          updatedAt: nowIso(),
        } as Customer);
      c.contacts.push({
        id: uid('ct'), name: v(7), title: v(8), phone: v(9), role: role!, birthday, emailWork: v(12), emailPersonal: v(13), assistantName: v(14), assistantPhone: v(15), primary: v(6).toLowerCase() === 'x',
      });
      groups.set(key, c);
    });
    const list = [...groups.values()].map((c) => (c.contacts.some((k) => k.primary) ? c : { ...c, contacts: c.contacts.map((k, i) => ({ ...k, primary: i === 0 })) }));
    setRes({ file: f.name, list, errors });
  };
  const exists = (c: Customer) => s.customers.some((x) => x.name.trim().toLowerCase() === c.name.trim().toLowerCase());

  return (
    <Modal
      open
      onClose={onClose}
      width="max-w-4xl"
      title="Nhập khách hàng hàng loạt"
      footer={
        <>
          <Btn onClick={onClose}>Đóng</Btn>
          <Btn
            variant="primary"
            icon={CheckCircle2}
            disabled={!res || !res.list.length}
            onClick={() => {
              crm.importCustomers(res!.list, res!.file);
              toast(`Đã nhập ${res!.list.length} khách hàng từ ${res!.file}`);
              onClose();
            }}
            data-testid="crm-import-apply"
          >
            Nhập {res?.list.length || 0} khách hàng
          </Btn>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-[12.5px] text-slate-600">
          Mỗi dòng = 1 đầu mối; các dòng cùng <b>Tên cơ quan</b> gộp thành 1 hồ sơ. Bắt buộc: Tên cơ quan, Cấp cơ quan, Khối, Họ và tên, Chức vụ, SĐT, Project Role, Ngày sinh (dd/mm/yyyy).
          {!isTop(me) && <> Bạn chỉ nhập được khách của khối <b>{me.division}</b>.</>} Cơ quan đã có → cập nhật thông tin & đầu mối.
        </p>
        <div className="flex gap-2">
          <Btn icon={FileSpreadsheet} onClick={template}>
            Tải file mẫu
          </Btn>
          <Btn variant="primary" icon={Upload} onClick={() => ref.current?.click()}>
            Chọn file Excel
          </Btn>
          <input
            ref={ref}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void read(f);
              e.target.value = '';
            }}
            data-testid="crm-import-file"
          />
        </div>
        {res && (
          <>
            {res.errors.length > 0 && (
              <div className="max-h-32 overflow-auto border border-rose-200 bg-rose-50 rounded-[3px] px-3 py-2 text-[12px] text-rose-800 space-y-0.5">
                {res.errors.map((e, i) => (
                  <p key={i}>{e}</p>
                ))}
              </div>
            )}
            <FieldTable
              rows={[
                { label: 'File', value: res.file },
                { label: 'Khách hàng hợp lệ', value: `${res.list.length} (mới ${res.list.filter((c) => !exists(c)).length} · cập nhật ${res.list.filter(exists).length})` },
                { label: 'Đầu mối', value: res.list.reduce((a, c) => a + c.contacts.length, 0) },
              ]}
            />
            <div className="max-h-56 overflow-auto border border-slate-300">
              <table className={erp.table}>
                <thead className="sticky top-0">
                  <tr>
                    {['Cơ quan', 'Khối', 'Cấp', 'Đầu mối', ''].map((h) => (
                      <th key={h} className={`${erp.th} text-left border-t-0`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {res.list.map((c) => (
                    <tr key={c.id} className={erp.tr}>
                      <td className={erp.td}>{c.name}</td>
                      <td className={erp.td}>{c.division}</td>
                      <td className={erp.td}>{c.level}</td>
                      <td className={erp.td}>{c.contacts.map((k) => `${k.primary ? '★ ' : ''}${k.name}`).join(', ')}</td>
                      <td className={erp.td}>{exists(c) ? <Tag cls={TAG.amber}>Cập nhật</Tag> : <Tag cls={TAG.green}>Mới</Tag>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export { primaryOf, nextBirthday };
