/**
 * CRM · Phân quyền & nhật ký (mục 2):
 *  • Người dùng & vai trò · Phân công khách cho nhân sự khối (GĐK đề xuất → Chủ tịch / TGĐ / BP ĐN duyệt; tầng tổng gán trực tiếp)
 *  • Ma trận quyền (mục 2.2) · Nhật ký truy cập, thay đổi, xuất dữ liệu
 */
import React, { useState } from 'react';
import { CheckCircle2, History, KeyRound, ShieldCheck, Send, Table2, UserCog, XCircle } from 'lucide-react';
import { Btn, ErpPage, FolderTabs, FormRow, Panel, Tag, erp } from '../erp/Erp';
import { CRM_DIVISIONS, CRM_USERS, PermissionRequest, ROLE_LABEL, canDecidePermission, canProposePermission, isTop, nowIso, uid, userById, userName } from '../../crm/crmData';
import { crm, useCrm, useMe } from '../../crm/crmStore';
import { CrmTitle, DivTag, NoAccess, TAG, useToast } from './crmUi';

type Tab = 'users' | 'assign' | 'matrix' | 'audit';

export const CrmAdminPage: React.FC = () => {
  const s = useCrm();
  const me = useMe();
  const [tab, setTab] = useState<Tab>('assign');
  const { toast, toastNode } = useToast();
  const pending = s.requests.filter((r) => r.status === 'Chờ duyệt' && (isTop(me) || userById(r.userId)?.division === me.division)).length;
  return (
    <ErpPage>
      {toastNode}
      <CrmTitle page="Phân quyền & nhật ký" title="Phân quyền & nhật ký" />
      {me.role === 'nsk' ? (
        <NoAccess text="Nhân sự khối không có quyền quản lý người dùng và quyền (theo ma trận mục 2.2)." />
      ) : (
        <div>
          <FolderTabs
            tabs={[
              { key: 'assign', label: `Phân công khách hàng${pending ? ` (${pending} chờ duyệt)` : ''}`, icon: UserCog },
              { key: 'users', label: 'Người dùng & vai trò', icon: KeyRound },
              { key: 'matrix', label: 'Ma trận quyền', icon: Table2 },
              { key: 'audit', label: 'Nhật ký', icon: History },
            ]}
            value={tab}
            onChange={setTab}
          />
          <div className="pt-3 space-y-3">
            {tab === 'assign' && <AssignTab toast={toast} />}
            {tab === 'users' && <UsersTab />}
            {tab === 'matrix' && <MatrixTab />}
            {tab === 'audit' && <AuditTab />}
          </div>
        </div>
      )}
    </ErpPage>
  );
};

const AssignTab: React.FC<{ toast: (m: string) => void }> = ({ toast }) => {
  const s = useCrm();
  const me = useMe();
  const divs = isTop(me) ? [...CRM_DIVISIONS] : [me.division!];
  const [div, setDiv] = useState(divs[0]);
  const staff = CRM_USERS.filter((u) => u.role === 'nsk' && u.division === div);
  const [who, setWho] = useState(staff[0]?.id || '');
  const [pick, setPick] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const customers = s.customers.filter((c) => !c.archived && c.division === div);
  const reqs = s.requests.filter((r) => isTop(me) || userById(r.userId)?.division === me.division);
  return (
    <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-3">
      <Panel
        title={isTop(me) ? 'Phân công trực tiếp (tầng tổng)' : 'Đề xuất phân công cho nhân sự khối'}
        icon={UserCog}
        footer={isTop(me) ? 'Chủ tịch / TGĐ / BP Đối ngoại gán trực tiếp người phụ trách — có hiệu lực ngay.' : 'Giám đốc khối đề xuất → Chủ tịch / TGĐ / BP Đối ngoại duyệt thì nhân sự mới xem được khách.'}
      >
        <div className="grid grid-cols-2 gap-3">
          <FormRow label="Khối">
            <select
              value={div}
              onChange={(e) => {
                setDiv(e.target.value as typeof div);
                setWho(CRM_USERS.find((u) => u.role === 'nsk' && u.division === e.target.value)?.id || '');
                setPick([]);
              }}
              disabled={divs.length === 1}
              className={`${erp.inputFull} cursor-pointer`}
            >
              {divs.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Nhân sự khối">
            <select value={who} onChange={(e) => (setWho(e.target.value), setPick([]))} className={`${erp.inputFull} cursor-pointer`}>
              {staff.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </FormRow>
        </div>
        <div className="mt-3 border border-slate-300 rounded-[3px] max-h-72 overflow-auto">
          <table className={erp.table}>
            <thead className="sticky top-0">
              <tr>
                {['', 'Khách hàng', 'Đang phụ trách'].map((h, i) => (
                  <th key={i} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0 w-8' : ''} ${i === 2 ? 'border-r-0' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const has = c.ownerIds.includes(who);
                return (
                  <tr key={c.id} className={erp.tr}>
                    <td className={`${erp.td} border-l-0 text-center`}>
                      <input
                        type="checkbox"
                        className="accent-[#1f5fa8] cursor-pointer"
                        checked={isTop(me) ? (pick.length ? pick.includes(c.id) : has) : pick.includes(c.id)}
                        disabled={!isTop(me) && has}
                        onChange={(e) => {
                          const base = isTop(me) && !pick.length ? customers.filter((x) => x.ownerIds.includes(who)).map((x) => x.id) : pick;
                          setPick(e.target.checked ? [...base, c.id] : base.filter((x) => x !== c.id));
                        }}
                      />
                    </td>
                    <td className={erp.td}>
                      <span className={erp.code}>{c.code}</span> {c.name}
                    </td>
                    <td className={`${erp.td} border-r-0 text-[12px]`}>{c.ownerIds.map(userName).join(', ') || <span className="text-rose-600">Chưa phân công</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!isTop(me) && (
          <FormRow label="Ghi chú đề xuất" className="mt-3">
            <input value={note} onChange={(e) => setNote(e.target.value)} className={erp.inputFull} />
          </FormRow>
        )}
        <div className="flex justify-end mt-3">
          {isTop(me) ? (
            <Btn
              variant="primary"
              icon={CheckCircle2}
              disabled={!who || !pick.length}
              onClick={() => {
                customers.forEach((c) => {
                  const want = pick.includes(c.id);
                  const has = c.ownerIds.includes(who);
                  if (want !== has) crm.setOwners(c.id, want ? [...c.ownerIds, who] : c.ownerIds.filter((x) => x !== who));
                });
                setPick([]);
                toast(`Đã cập nhật phân công cho ${userName(who)}`);
              }}
            >
              Lưu phân công
            </Btn>
          ) : (
            canProposePermission(me) && (
              <Btn
                variant="primary"
                icon={Send}
                disabled={!who || !pick.length}
                onClick={() => {
                  const r: PermissionRequest = { id: uid('rq'), userId: who, customerIds: pick, proposedBy: me.id, proposedAt: nowIso(), status: 'Chờ duyệt', note };
                  crm.proposePermission(r);
                  setPick([]);
                  setNote('');
                  toast('Đã gửi đề xuất — chờ tầng tổng duyệt');
                }}
                data-testid="crm-propose"
              >
                Gửi đề xuất ({pick.length})
              </Btn>
            )
          )}
        </div>
      </Panel>
      <Panel title={`Đề xuất phân quyền (${reqs.length})`} icon={ShieldCheck} noPad>
        <table className={erp.table}>
          <thead>
            <tr>
              {['Nhân sự', 'Khách hàng', 'Người đề xuất', 'Trạng thái', ''].map((h, i) => (
                <th key={i} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 4 ? 'border-r-0' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reqs.map((r) => (
              <tr key={r.id} className={erp.tr}>
                <td className={`${erp.td} border-l-0 whitespace-nowrap`}>
                  {userName(r.userId)} <DivTag d={userById(r.userId)?.division} />
                </td>
                <td className={`${erp.td} text-[12px] min-w-[240px]`}>
                  {r.customerIds.map((id) => s.customers.find((c) => c.id === id)?.name).filter(Boolean).join('; ')}
                  {r.note && <p className="text-[11px] text-slate-500 italic">{r.note}</p>}
                </td>
                <td className={`${erp.td} text-[12px] whitespace-nowrap`}>
                  {userName(r.proposedBy)}
                  <p className="text-[11px] text-slate-400">{new Date(r.proposedAt).toLocaleDateString('vi-VN')}</p>
                </td>
                <td className={`${erp.td} whitespace-nowrap`}>
                  <Tag cls={r.status === 'Chờ duyệt' ? TAG.amber : r.status === 'Đã duyệt' ? TAG.green : TAG.rose}>{r.status}</Tag>
                  {r.decidedBy && <p className="text-[11px] text-slate-400">{userName(r.decidedBy)}</p>}
                </td>
                <td className={`${erp.td} border-r-0 whitespace-nowrap`}>
                  {r.status === 'Chờ duyệt' && canDecidePermission(me) && (
                    <span className="flex gap-1">
                      <Btn className="h-7 px-2" variant="success" icon={CheckCircle2} onClick={() => (crm.decidePermission(r.id, true), toast('Đã duyệt đề xuất'))} data-testid={`crm-approve-${r.id}`}>
                        Duyệt
                      </Btn>
                      <Btn className="h-7 px-2" variant="danger" icon={XCircle} onClick={() => (crm.decidePermission(r.id, false), toast('Đã từ chối đề xuất'))}>
                        Từ chối
                      </Btn>
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {!reqs.length && (
              <tr>
                <td colSpan={5} className={`${erp.td} border-x-0 py-6 text-center text-slate-400`}>
                  Chưa có đề xuất.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
};

const UsersTab: React.FC = () => {
  const s = useCrm();
  const me = useMe();
  const users = CRM_USERS.filter((u) => isTop(me) || u.division === me.division);
  return (
    <Panel title={`Người dùng CRM (${users.length})`} icon={KeyRound} noPad>
      <table className={erp.table}>
        <thead>
          <tr>
            {['Họ tên', 'Email', 'Vai trò', 'Khối', 'Phạm vi truy cập', 'Khách phụ trách'].map((h, i) => (
              <th key={h} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 5 ? 'border-r-0' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className={erp.tr}>
              <td className={`${erp.td} border-l-0 font-semibold`}>{u.name}</td>
              <td className={`${erp.td} text-[12px]`}>{u.email}</td>
              <td className={erp.td}>
                <Tag cls={isTop(u) ? TAG.violet : u.role === 'gdk' ? TAG.blue : TAG.slate}>{ROLE_LABEL[u.role]}</Tag>
              </td>
              <td className={erp.td}>
                <DivTag d={u.division} />
              </td>
              <td className={`${erp.td} text-[12px]`}>{isTop(u) ? 'Toàn bộ 5 khối' : u.role === 'gdk' ? `Dữ liệu khối ${u.division}` : 'Khách được phân công'}</td>
              <td className={`${erp.td} border-r-0 text-right tabular-nums`}>{u.role === 'nsk' ? s.customers.filter((c) => c.ownerIds.includes(u.id)).length : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
};

const MATRIX: [string, string, string, string][] = [
  ['Danh sách tổng', 'X S T L', '—', '—'],
  ['Hồ sơ khách của khối mình', 'X S T L', 'X S T L', 'X'],
  ['Hồ sơ khách của khối khác', 'X S T L', '—', '—'],
  ['Ngày sinh', 'X S T L', 'X S T L', 'X S'],
  ['Tương tác, dự án, nhiệm vụ của khối mình', 'X S T L', 'X S T L', 'X S T'],
  ['Ghi chú nhạy cảm', 'X S T L (chỉ Chủ tịch và BP ĐN)', '—', '—'],
  ['Nhắc việc', 'Toàn bộ', 'Của khối mình', 'Của mình'],
  ['Bảng điều khiển', 'Toàn bộ', 'Khối mình', 'Khối mình'],
  ['Nhập dữ liệu hàng loạt', 'Có', 'Khối mình', '—'],
  ['Xuất dữ liệu', 'Có', 'Có', '—'],
  ['Quản lý người dùng và quyền', 'Duyệt quyền tầng tổng', 'Đề xuất quyền cho nhân sự khối', '—'],
];
const MatrixTab: React.FC = () => (
  <Panel title="Ma trận quyền (mục 2.2)" icon={Table2} noPad footer="X: xem · S: sửa · T: tạo · L: lưu trữ (xoá mềm) · —: không có quyền. Áp dụng cho cả 3 module.">
    <table className={erp.table}>
      <thead>
        <tr>
          {['Đối tượng', 'Chủ tịch, TGĐ, BP ĐN', 'Giám đốc khối', 'Nhân sự khối'].map((h, i) => (
            <th key={h} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 3 ? 'border-r-0' : ''}`}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {MATRIX.map((r) => (
          <tr key={r[0]} className={erp.tr}>
            <td className={`${erp.td} border-l-0 font-semibold`}>{r[0]}</td>
            {r.slice(1).map((v, i) => (
              <td key={i} className={`${erp.td} ${i === 2 ? 'border-r-0' : ''} ${v === '—' ? 'text-slate-400' : 'text-slate-800'}`}>
                {v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </Panel>
);

const AuditTab: React.FC = () => {
  const s = useCrm();
  const me = useMe();
  const [action, setAction] = useState('');
  const list = s.audit.filter((a) => (isTop(me) || userById(a.by)?.division === me.division) && (!action || a.action === action));
  return (
    <Panel
      title={`Nhật ký (${list.length})`}
      icon={History}
      noPad
      actions={
        <select value={action} onChange={(e) => setAction(e.target.value)} className="h-7 border border-slate-300 rounded-[3px] px-2 text-[12px] bg-white cursor-pointer">
          <option value="">Tất cả thao tác</option>
          {['Xem', 'Tạo', 'Sửa', 'Lưu trữ', 'Khôi phục', 'Xuất dữ liệu', 'Nhập dữ liệu', 'Phân quyền', 'Nhắc việc'].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      }
      footer={isTop(me) ? 'Nhật ký toàn hệ thống.' : `Nhật ký của người dùng khối ${me.division}.`}
    >
      <div className="max-h-[560px] overflow-auto">
        <table className={erp.table}>
          <thead className="sticky top-0">
            <tr>
              {['Thời gian', 'Người thực hiện', 'Thao tác', 'Đối tượng', 'Chi tiết'].map((h, i) => (
                <th key={h} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 4 ? 'border-r-0' : ''}`}>
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
                  <Tag cls={a.action === 'Xem' ? TAG.slate : a.action === 'Xuất dữ liệu' ? TAG.amber : a.action === 'Lưu trữ' ? TAG.rose : a.action === 'Phân quyền' ? TAG.violet : TAG.blue}>{a.action}</Tag>
                </td>
                <td className={`${erp.td} whitespace-nowrap`}>{a.target}</td>
                <td className={`${erp.td} border-r-0 text-[12px]`}>{a.detail || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
};
