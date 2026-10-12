/**
 * PmoUserRolePage — PMO-15 Người dùng & role (F12.1, ma trận quyền mục 2.2 PRD).
 *
 * Ba thẻ hồ sơ:
 *   - "Gán role": bảng user_role (role × khối? × dự án?), nguồn SSO group hoặc thủ công. Bộ lọc một hàng
 *     (role, khối, nguồn, tìm). Sửa inline role/khối/dự án — dòng từ SSO group khoá role (đổi ở AD group).
 *     Thêm gán thủ công ngay trên bảng; xoá có xác nhận inline. Người có >1 dòng được tô nổi (quyền theo ngữ cảnh).
 *   - "Ma trận quyền": bảng chỉ đọc đúng mục 2.2 (đối tượng dữ liệu × PM/GĐSX/GĐK/TCT/Finance), ô màu theo mức.
 *   - "Chính sách": cờ cross_khoi_cost_visible (OQ-015), mặc định TẮT; đổi cờ → ghi audit.
 * Dữ liệu lưu trong phiên (STORE cấp module) — chưa có API.
 */
import React, { useMemo, useState } from 'react';
import { Check, Filter, Grid3x3, Lock, Pencil, Plus, ShieldCheck, SlidersHorizontal, Trash2, Users, X } from 'lucide-react';
import { KHOI, PMO_PROJECTS, TODAY, dmy } from '../../pmo/pmo';
import { SYS_ROLES, SysRole, USER_ROLES, UserRole } from '../../pmo/pmoData';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, Panel, Tag, erp } from '../erp/Erp';

// ==========================================================================
// Lưu trong phiên
// ==========================================================================
const STORE = new Map<string, unknown>();
const getRows = () => (STORE.get('rows') as UserRole[] | undefined) || USER_ROLES.map((r) => ({ ...r }));
const getFlag = () => (STORE.get('crossKhoi') as boolean | undefined) ?? false;
const getPolicyLog = () => (STORE.get('policyLog') as string[] | undefined) || [];

const SEL = `${erp.input} h-7 text-[12px]`;
const CELL = `${erp.input} h-7 text-[12px] w-full`;
const nowHm = () => new Date().toTimeString().slice(0, 5);

const FilterCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex items-center gap-1.5 min-w-0">
    <span className="text-[12px] text-slate-600 whitespace-nowrap">{label}</span>
    {children}
  </label>
);

const ROLE_CLS: Partial<Record<SysRole, string>> = {
  PM: 'bg-sky-50 text-sky-700 border-sky-200',
  GĐSX: 'bg-violet-50 text-violet-700 border-violet-200',
  GĐK: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  TCT: 'bg-rose-50 text-rose-700 border-rose-200',
  Finance: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Admin: 'bg-slate-700 text-white border-slate-800',
};
const roleCls = (r: SysRole) => ROLE_CLS[r] || 'bg-slate-50 text-slate-600 border-slate-200';

// ==========================================================================
// Ma trận quyền (mục 2.2 PRD)
// ==========================================================================
const MATRIX_ROLES = ['PM', 'GĐSX', 'GĐK', 'TCT', 'Finance'] as const;
const MATRIX: { obj: string; v: [string, string, string, string, string] }[] = [
  { obj: 'Hồ sơ dự án của mình', v: ['Sửa', 'Sửa', 'Xem', 'Xem', 'Xem'] },
  { obj: 'Hồ sơ dự án khác cùng khối', v: ['Xem tóm tắt', 'Sửa', 'Xem', 'Xem', 'Xem'] },
  { obj: 'Dự án khối khác', v: ['—', '—', '—', 'Xem', 'Xem'] },
  { obj: 'WP, Sprint, Risk, CR của dự án mình', v: ['Sửa', 'Duyệt', 'Xem', 'Xem', '—'] },
  { obj: 'Gate approval', v: ['Trình', 'Duyệt (BT, QT)', 'Duyệt (CL)', 'Duyệt (CL)', '—'] },
  { obj: 'ECV, Budget burn dự án mình', v: ['Xem', 'Xem', 'Xem', 'Xem', 'Xem'] },
  { obj: 'Rate card / lương cá nhân', v: ['—', '—', '—', 'Xem tổng', 'Sửa'] },
  { obj: 'Cost & margin theo dự án/khối mình', v: ['Margin dự án', 'Xem', 'Xem', 'Xem', 'Xem'] },
  { obj: 'Cost khối khác', v: ['—', '—', '— (OQ-015)', 'Xem', 'Xem'] },
  { obj: 'Điều chuyển liên khối', v: ['Đề xuất', 'Đề xuất', 'Duyệt', 'Xem', '—'] },
  { obj: 'Cấu hình ngưỡng, template, rule khối', v: ['—', '—', 'Sửa (khối mình)', 'Sửa', '—'] },
  { obj: 'Audit log', v: ['—', 'Xem dự án mình', 'Xem khối mình', 'Xem tất cả', 'Xem tất cả'] },
];
const levelCls = (v: string) =>
  v.startsWith('Sửa')
    ? 'bg-sky-100 text-sky-800 font-semibold'
    : v.startsWith('Duyệt')
      ? 'bg-violet-100 text-violet-800 font-semibold'
      : v.startsWith('Trình') || v.startsWith('Đề xuất')
        ? 'bg-amber-50 text-amber-800 font-semibold'
        : v.startsWith('Xem') || v.startsWith('Margin')
          ? 'bg-emerald-50 text-emerald-800'
          : 'bg-slate-50 text-slate-400';

type TabKey = 'assign' | 'matrix' | 'policy';

export const PmoUserRolePage: React.FC<{ onNavigate?: (item: string) => void }> = () => {
  const [tab, setTab] = useState<TabKey>('assign');
  const [rows, setRowsRaw] = useState<UserRole[]>(getRows);
  const setRows = (fn: (r: UserRole[]) => UserRole[]) =>
    setRowsRaw((cur) => {
      const next = fn(cur);
      STORE.set('rows', next);
      return next;
    });
  const [crossKhoi, setCrossKhoiRaw] = useState<boolean>(getFlag);
  const [policyLog, setPolicyLog] = useState<string[]>(getPolicyLog);

  // Bộ lọc
  const [fRole, setFRole] = useState('');
  const [fKhoi, setFKhoi] = useState('');
  const [fSrc, setFSrc] = useState('');
  const [q, setQ] = useState('');
  const [onlyMulti, setOnlyMulti] = useState(false);

  // Sửa / thêm / xoá
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<UserRole | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const flash = (s: string) => {
    setMsg(s);
    window.setTimeout(() => setMsg(''), 3500);
  };

  const countByUser = useMemo(() => {
    const m = new Map<string, number>();
    rows.forEach((r) => m.set(r.user, (m.get(r.user) || 0) + 1));
    return m;
  }, [rows]);
  const multiUsers = [...countByUser.entries()].filter(([, n]) => n > 1).map(([u]) => u);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows
      .filter(
        (r) =>
          (!fRole || r.role === fRole) &&
          (!fKhoi || (fKhoi === '*' ? !r.khoi : r.khoi === fKhoi)) &&
          (!fSrc || r.source === fSrc) &&
          (!onlyMulti || (countByUser.get(r.user) || 0) > 1) &&
          (!s || `${r.user} ${r.email} ${r.group} ${r.projectId}`.toLowerCase().includes(s)),
      )
      .sort((a, b) => a.user.localeCompare(b.user, 'vi') || a.id.localeCompare(b.id));
  }, [rows, fRole, fKhoi, fSrc, q, onlyMulti, countByUser]);

  const startEdit = (r: UserRole) => {
    setEditId(r.id);
    setDraft({ ...r });
    setIsNew(false);
    setConfirmId(null);
  };
  const startAdd = () => {
    const id = `UR${Date.now().toString(36)}`;
    const blank: UserRole = { id, user: '', email: '', role: 'Member', khoi: '', projectId: '', source: 'Thủ công', group: '—' };
    setRows((cur) => [blank, ...cur]);
    setEditId(id);
    setDraft(blank);
    setIsNew(true);
    setConfirmId(null);
    setFRole('');
    setFKhoi('');
    setFSrc('');
    setQ('');
    setOnlyMulti(false);
  };
  const cancel = () => {
    if (isNew && draft) setRows((cur) => cur.filter((r) => r.id !== draft.id));
    setEditId(null);
    setDraft(null);
    setIsNew(false);
  };
  const draftErr = draft
    ? !draft.user.trim()
      ? 'Nhập họ tên'
      : !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(draft.email.trim())
        ? 'Email không hợp lệ'
        : draft.projectId && draft.khoi && !draft.projectId.startsWith(`${draft.khoi}-`)
          ? 'Dự án không thuộc khối đã chọn'
          : rows.some((r) => r.id !== draft.id && r.email === draft.email.trim() && r.role === draft.role && r.khoi === draft.khoi && r.projectId === draft.projectId)
            ? 'Trùng gán đã có'
            : ''
    : '';
  const save = () => {
    if (!draft || draftErr) return;
    const clean = { ...draft, user: draft.user.trim(), email: draft.email.trim().toLowerCase() };
    setRows((cur) => cur.map((r) => (r.id === clean.id ? clean : r)));
    flash(`${isNew ? 'Đã thêm' : 'Đã lưu'} gán ${clean.role} cho ${clean.user} · ghi audit`);
    setEditId(null);
    setDraft(null);
    setIsNew(false);
  };
  const remove = (r: UserRole) => {
    setRows((cur) => cur.filter((x) => x.id !== r.id));
    setConfirmId(null);
    flash(`Đã gỡ role ${r.role} của ${r.user} · ghi audit`);
  };

  const setCrossKhoi = (v: boolean) => {
    setCrossKhoiRaw(v);
    STORE.set('crossKhoi', v);
    const line = `${dmy(TODAY)} ${nowHm()} · admin · cross_khoi_cost_visible: ${v ? 'TẮT → BẬT' : 'BẬT → TẮT'} · đã ghi audit`;
    setPolicyLog((cur) => {
      const next = [line, ...cur];
      STORE.set('policyLog', next);
      return next;
    });
  };

  const projOptions = (khoi: string) => PMO_PROJECTS.filter((p) => !khoi || p.khoi === khoi);
  const projName = (id: string) => PMO_PROJECTS.find((p) => p.id === id)?.name || '';

  const matrixCell = (rowIdx: number, colIdx: number) => {
    const v = MATRIX[rowIdx].v[colIdx];
    // Cờ OQ-015 bật → GĐSX/GĐK được xem cost khối khác
    if (crossKhoi && MATRIX[rowIdx].obj === 'Cost khối khác' && (colIdx === 1 || colIdx === 2)) return 'Xem (cờ OQ-015 bật)';
    return v;
  };

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', 'Quản trị', 'Người dùng & role']}
        title="Người dùng & role"
        meta={[
          { label: 'Dòng gán', value: rows.length },
          { label: 'Người dùng', value: countByUser.size },
          { label: 'Từ SSO group', value: rows.filter((r) => r.source === 'SSO group').length },
          { label: 'Thủ công', value: rows.filter((r) => r.source === 'Thủ công').length },
          { label: 'Nhiều role', value: multiUsers.length },
          { label: 'cross_khoi_cost_visible', value: <span className={crossKhoi ? 'text-amber-700' : 'text-slate-700'}>{crossKhoi ? 'BẬT' : 'TẮT'}</span> },
        ]}
      />

      <div>
        <FolderTabs<TabKey>
          tabs={[
            { key: 'assign', label: 'Gán role', icon: Users },
            { key: 'matrix', label: 'Ma trận quyền', icon: Grid3x3 },
            { key: 'policy', label: 'Chính sách', icon: SlidersHorizontal },
          ]}
          value={tab}
          onChange={setTab}
        />

        {tab === 'assign' && (
          <Panel
            className="rounded-t-none border-t-0"
            title={
              <>
                Gán role <span className="font-normal normal-case text-slate-500 tracking-normal">· {shown.length} dòng</span>
              </>
            }
            icon={Users}
            noPad
            actions={
              <>
                {msg && <span className="text-[12px] text-emerald-700">{msg}</span>}
                <Btn variant="primary" icon={Plus} className="h-7" onClick={startAdd} disabled={!!editId}>
                  Thêm gán thủ công
                </Btn>
              </>
            }
            footer="Quyền gắn với (role × khối × dự án) và tính theo ngữ cảnh màn hình: một người có thể nhiều role — ví dụ Nguyễn Văn Hùng là PM dự án G1-2026-003 và GĐSX khối G2. Dòng từ SSO group đồng bộ từ Azure AD: đổi role ở AD group, không sửa tại đây. Khối/dự án để trống = mọi khối / mọi dự án trong phạm vi."
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
              <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300">
                <Filter size={13} className="text-[#1f5fa8]" /> Lọc
              </span>
              <FilterCell label="Role">
                <select value={fRole} onChange={(e) => setFRole(e.target.value)} className={SEL}>
                  <option value="">Tất cả</option>
                  {SYS_ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </FilterCell>
              <FilterCell label="Khối">
                <select value={fKhoi} onChange={(e) => setFKhoi(e.target.value)} className={SEL}>
                  <option value="">Tất cả</option>
                  <option value="*">Mọi khối (toàn TCT)</option>
                  {KHOI.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </FilterCell>
              <FilterCell label="Nguồn">
                <select value={fSrc} onChange={(e) => setFSrc(e.target.value)} className={SEL}>
                  <option value="">Tất cả</option>
                  <option>SSO group</option>
                  <option>Thủ công</option>
                </select>
              </FilterCell>
              <FilterCell label="Tìm">
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tên, email, group, mã dự án" className={`${SEL} w-52`} />
              </FilterCell>
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600 cursor-pointer">
                <input type="checkbox" checked={onlyMulti} onChange={(e) => setOnlyMulti(e.target.checked)} />
                Chỉ người nhiều role
              </label>
              {(fRole || fKhoi || fSrc || q || onlyMulti) && (
                <button type="button" onClick={() => (setFRole(''), setFKhoi(''), setFSrc(''), setQ(''), setOnlyMulti(false))} className="text-[12px] text-[#1f5fa8] hover:underline cursor-pointer">
                  Bỏ lọc
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className={`${erp.table} min-w-[1120px]`}>
                <thead>
                  <tr>
                    <th className={`${erp.th} border-t-0 border-l-0 text-left w-48`}>Người dùng</th>
                    <th className={`${erp.th} border-t-0 text-left w-48`}>Email</th>
                    <th className={`${erp.th} border-t-0 text-left w-32`}>Role</th>
                    <th className={`${erp.th} border-t-0 text-left w-28`}>Khối</th>
                    <th className={`${erp.th} border-t-0 text-left`}>Dự án</th>
                    <th className={`${erp.th} border-t-0 text-center w-24`}>Nguồn</th>
                    <th className={`${erp.th} border-t-0 text-left w-40`}>Group SSO</th>
                    <th className={`${erp.th} border-t-0 border-r-0 text-center w-40`}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => {
                    const multi = (countByUser.get(r.user) || 0) > 1;
                    const editing = editId === r.id && draft;
                    const confirming = confirmId === r.id;
                    const sso = r.source === 'SSO group';
                    if (editing && draft)
                      return (
                        <tr key={r.id} className="bg-[#eaf2fc]">
                          <td className={`${erp.td} border-l-0`}>
                            {isNew ? <input autoFocus value={draft.user} onChange={(e) => setDraft({ ...draft, user: e.target.value })} placeholder="Họ tên *" className={CELL} /> : <b>{r.user}</b>}
                          </td>
                          <td className={erp.td}>
                            {isNew ? <input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} placeholder="ten@vtx.vn *" className={CELL} /> : <span className="text-slate-600">{r.email}</span>}
                          </td>
                          <td className={erp.td}>
                            <select value={draft.role} disabled={sso} onChange={(e) => setDraft({ ...draft, role: e.target.value as SysRole })} className={CELL} title={sso ? 'Đổi ở AD group' : undefined}>
                              {SYS_ROLES.map((x) => (
                                <option key={x}>{x}</option>
                              ))}
                            </select>
                            {sso && (
                              <span className="flex items-center gap-1 text-[10.5px] text-slate-500 mt-0.5">
                                <Lock size={10} /> đổi ở AD group
                              </span>
                            )}
                          </td>
                          <td className={erp.td}>
                            <select value={draft.khoi} onChange={(e) => setDraft({ ...draft, khoi: e.target.value, projectId: draft.projectId && e.target.value && !draft.projectId.startsWith(`${e.target.value}-`) ? '' : draft.projectId })} className={CELL}>
                              <option value="">Mọi khối</option>
                              {KHOI.map((k) => (
                                <option key={k}>{k}</option>
                              ))}
                            </select>
                          </td>
                          <td className={erp.td}>
                            <select value={draft.projectId} onChange={(e) => setDraft({ ...draft, projectId: e.target.value })} className={CELL}>
                              <option value="">Mọi dự án trong phạm vi</option>
                              {projOptions(draft.khoi).map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.code} · {p.name}
                                </option>
                              ))}
                            </select>
                            {draftErr && <span className="block text-[11px] text-rose-600 mt-0.5">{draftErr}</span>}
                          </td>
                          <td className={`${erp.td} text-center`}>
                            <Tag cls={sso ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>{r.source}</Tag>
                          </td>
                          <td className={`${erp.td} font-mono text-[11.5px] text-slate-600`}>{r.group}</td>
                          <td className={`${erp.td} border-r-0 text-center`}>
                            <div className="inline-flex gap-1">
                              <Btn variant="success" className="h-7 px-2.5" icon={Check} onClick={save} disabled={!!draftErr}>
                                Lưu
                              </Btn>
                              <Btn className="h-7 px-2.5" icon={X} onClick={cancel}>
                                Huỷ
                              </Btn>
                            </div>
                          </td>
                        </tr>
                      );
                    return (
                      <tr key={r.id} className={confirming ? 'bg-[#fff5f5]' : multi ? 'bg-amber-50/60 hover:bg-amber-50' : erp.tr}>
                        <td className={`${erp.td} ${multi ? 'border-l-[3px] border-l-amber-400' : 'border-l-0'}`}>
                          <span className="font-semibold text-slate-800">{r.user}</span>
                          {multi && (
                            <span className="ml-1.5 inline-flex px-1 rounded-[3px] bg-amber-400 text-slate-900 text-[10px] font-bold" title="Một người nhiều role theo ngữ cảnh">
                              {countByUser.get(r.user)} role
                            </span>
                          )}
                        </td>
                        <td className={`${erp.td} text-slate-600`}>{r.email}</td>
                        <td className={erp.td}>
                          <Tag cls={roleCls(r.role)}>{r.role}</Tag>
                        </td>
                        <td className={erp.td}>{r.khoi || <span className="text-slate-400 italic">Mọi khối</span>}</td>
                        <td className={erp.td}>
                          {r.projectId ? (
                            <span>
                              <span className={`${erp.code} text-[11.5px]`}>{r.projectId}</span> <span className="text-slate-600">{projName(r.projectId)}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Mọi dự án trong phạm vi</span>
                          )}
                        </td>
                        <td className={`${erp.td} text-center`}>
                          <Tag cls={sso ? 'bg-sky-50 text-sky-700 border-sky-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>{r.source}</Tag>
                        </td>
                        <td className={`${erp.td} font-mono text-[11.5px] text-slate-600`}>{r.group}</td>
                        <td className={`${erp.td} border-r-0 text-center`}>
                          {confirming ? (
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-[11.5px] text-rose-700">Gỡ role này?</span>
                              <Btn variant="danger" className="h-6! px-2! text-[11px]!" onClick={() => remove(r)}>
                                Gỡ
                              </Btn>
                              <Btn className="h-6! px-2! text-[11px]!" onClick={() => setConfirmId(null)}>
                                Huỷ
                              </Btn>
                            </div>
                          ) : (
                            <div className="inline-flex gap-1">
                              <Btn className="h-7 px-2" icon={Pencil} onClick={() => startEdit(r)} disabled={!!editId} title="Sửa role / khối / dự án">
                                Sửa
                              </Btn>
                              <Btn
                                variant="danger"
                                className="h-7 px-2"
                                icon={sso ? Lock : Trash2}
                                onClick={() => (setConfirmId(r.id), setEditId(null))}
                                disabled={!!editId || sso}
                                title={sso ? 'Gỡ người khỏi AD group để thu hồi' : 'Gỡ gán thủ công'}
                              >
                                Gỡ
                              </Btn>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {!shown.length && (
                    <tr>
                      <td colSpan={8} className="px-3 py-8 text-center text-slate-400 italic">
                        Không có dòng gán nào khớp bộ lọc.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        )}

        {tab === 'matrix' && (
          <Panel
            className="rounded-t-none border-t-0"
            title="Ma trận quyền (mục 2.2 PRD)"
            icon={Grid3x3}
            noPad
            actions={
              <span className="flex items-center gap-1 text-[11px]">
                {['Sửa', 'Duyệt', 'Trình / Đề xuất', 'Xem', '—'].map((l) => (
                  <span key={l} className={`px-1.5 py-px rounded-[3px] border border-slate-200 ${levelCls(l)}`}>
                    {l}
                  </span>
                ))}
              </span>
            }
            footer="Chỉ đọc — ma trận là cấu hình permission_matrix, đổi qua release có test. Quyền được kiểm tra ở API, không chỉ ẩn nút ở UI; có test tự động cho từng ô của ma trận. Dữ liệu lương cá nhân không rời tầng Finance; PMO chỉ nhận blended rate theo level × khối (F7.3)."
          >
            <div className="overflow-x-auto">
              <table className={`${erp.table} min-w-[860px]`}>
                <thead>
                  <tr>
                    <th className={`${erp.th} border-t-0 border-l-0 text-left`}>Đối tượng dữ liệu</th>
                    {MATRIX_ROLES.map((r, i) => (
                      <th key={r} className={`${erp.th} border-t-0 text-center w-36 ${i === MATRIX_ROLES.length - 1 ? 'border-r-0' : ''}`}>
                        {r}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MATRIX.map((m, ri) => (
                    <tr key={m.obj}>
                      <td className={`${erp.td} border-l-0 font-medium text-slate-800`}>{m.obj}</td>
                      {MATRIX_ROLES.map((r, ci) => {
                        const v = matrixCell(ri, ci);
                        return (
                          <td key={r} className={`${erp.td} text-center text-[12px] ${levelCls(v)} ${ci === MATRIX_ROLES.length - 1 ? 'border-r-0' : ''}`}>
                            {v}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-3 py-1.5 border-t border-slate-200 text-[12px] text-slate-600">
              <b className="text-[#1e3a5f]">OQ-015:</b> ma trận giả định GĐ khối KHÔNG xem cost/margin khối khác.{' '}
              {crossKhoi ? <span className="text-amber-700 font-semibold">Cờ cross_khoi_cost_visible đang BẬT → GĐSX/GĐK xem được hàng "Cost khối khác".</span> : 'Cờ cross_khoi_cost_visible đang TẮT.'}
            </div>
          </Panel>
        )}

        {tab === 'policy' && (
          <Panel className="rounded-t-none border-t-0" title="Chính sách phân quyền" icon={ShieldCheck} footer="Mọi thay đổi cờ chính sách ghi audit (F12.3, đối tượng Cấu hình) và có hiệu lực ngay ở API cho phiên kế tiếp của người dùng.">
            <div className="flex flex-wrap items-start gap-4">
              <button
                type="button"
                role="switch"
                aria-checked={crossKhoi}
                onClick={() => setCrossKhoi(!crossKhoi)}
                className={`relative shrink-0 w-11 h-6 rounded-full border cursor-pointer transition-colors ${crossKhoi ? 'bg-[#1f5fa8] border-[#184c88]' : 'bg-slate-300 border-slate-400'}`}
              >
                <span className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white transition-all ${crossKhoi ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-slate-800">
                  <span className="font-mono text-[#1f5fa8]">cross_khoi_cost_visible</span> · GĐ khối xem chi phí/margin khối khác{' '}
                  <Tag cls={crossKhoi ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'}>{crossKhoi ? 'BẬT' : 'TẮT (mặc định)'}</Tag>
                </p>
                <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">
                  Quyết định OQ-015 (CEO/COO). Đề xuất MVP: <b>không</b> — TCT chia sẻ số tổng hợp ẩn danh theo quý. Áp dụng cho role GĐK và GĐSX.
                </p>
                <ul className="text-[12px] text-slate-600 mt-1 list-disc pl-4 space-y-0.5">
                  <li>
                    <b>TẮT:</b> GĐK/GĐSX chỉ thấy cost, margin của khối mình; Portfolio TCT ẩn cột cost/margin của khối khác với họ.
                  </li>
                  <li>
                    <b>BẬT:</b> GĐK/GĐSX xem cost & margin mọi khối (chỉ xem, không sửa); rate card vẫn chỉ Finance thấy chi tiết.
                  </li>
                  <li>PM, Member không bị ảnh hưởng; TCT và Finance luôn xem tất cả.</li>
                </ul>
                {policyLog.length > 0 && (
                  <div className="mt-2 border-t border-slate-200 pt-1.5 space-y-0.5">
                    {policyLog.map((l, i) => (
                      <p key={i} className="text-[11.5px] text-emerald-700 flex items-center gap-1">
                        <Check size={11} /> {l}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Panel>
        )}
      </div>
    </ErpPage>
  );
};
