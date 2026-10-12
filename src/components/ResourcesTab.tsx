/**
 * ResourcesTab — tab "Resources" trên màn chi tiết dự án: phân bổ nhân sự cho dự án.
 *
 * Cột: # · Member Name · Type · Department · Role · Level · Tech Stack · Jira Status · Actions (sửa trên dòng / xoá).
 * Kỳ phân bổ mặc định = thời gian dự án (không hiển thị). Thanh công cụ chỉ có 2 nút:
 * "Allocation Resource": thêm một dòng phân bổ (chọn nhân sự từ bảng lương). "SyncDevops": đồng bộ trạng thái
 * tài khoản Jira (mô phỏng). Dữ liệu lưu tạm theo dự án trong phiên làm việc (chưa có API).
 */
import React, { useMemo, useState } from 'react';
import { Check, Pencil, Plus, RefreshCw, Trash2, Users, X } from 'lucide-react';
import { BizProject, latestActualMonth, monthsBetween } from '../business/BusinessProjectContext';
import { PayRow, latestVersion, usePayroll } from '../payroll/PayrollContext';
import { monthMembers } from './ActualCostTab';
import { Btn, Panel, erp } from './erp/Erp';

type JiraStatus = '-' | 'Active' | 'Inactive' | 'Not found';
export interface Allocation {
  id: string;
  code: string; // Mã NV
  name: string;
  type: 'Internal' | 'Outsource';
  department: string;
  role: string;
  level: string;
  billable: number; // %
  plan: number; // %
  techStack: string;
  start: string; // YYYY-MM-DD
  end: string;
  jira: JiraStatus;
}

const ROLES = ['DEV', 'QC', 'BA', 'PM', 'SUPPORT', 'SALE', 'DEVOPS'];
const LEVELS = ['Fresher', 'Junior', 'Middle', 'Senior', 'Lead/ Manager'];
const TECHS = ['.NET', 'Java', 'React', 'Angular', 'NodeJS', 'Python', 'Mobile', ''];
const EFFORTS = [100, 100, 100, 50, 50, 20];
const uid = () => Math.random().toString(36).slice(2, 9);
const rand = (...keys: (string | number)[]) => {
  let h = 2166136261;
  for (const ch of keys.join('|')) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (h % 10000) / 10000;
};
const pick = <T,>(arr: T[], ...keys: (string | number)[]) => arr[Math.floor(rand(...keys) * arr.length)];
const roleOf = (title: string) =>
  /trưởng|lead|quản lý/i.test(title) ? 'PM' : /test|qc/i.test(title) ? 'QC' : /ba\b|phân tích/i.test(title) ? 'BA' : /account|sale|kinh doanh/i.test(title) ? 'SALE' : /hr|hành chính|kế toán/i.test(title) ? 'SUPPORT' : 'DEV';
const levelOf = (title: string, code: string) => (/trưởng|lead/i.test(title) ? 'Lead/ Manager' : /thực tập/i.test(title) ? 'Fresher' : pick(['Junior', 'Middle', 'Middle', 'Senior'], code, 'lv'));

/** Lưu theo dự án trong phiên. */
const STORE = new Map<string, Allocation[]>();

const JIRA_CLS: Record<JiraStatus, string> = {
  '-': 'bg-slate-500 text-white',
  Active: 'bg-emerald-600 text-white',
  Inactive: 'bg-slate-400 text-white',
  'Not found': 'bg-amber-500 text-white',
};

const INP = 'w-full h-7 px-1.5 border border-slate-300 rounded-[3px] text-[12px] outline-none focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#1f5fa8]/15 bg-white';

export const ResourcesTab: React.FC<{ project: BizProject }> = ({ project: p }) => {
  const { periods } = usePayroll();
  const cutoff = latestActualMonth([p]) || '2026-08';
  const roster: PayRow[] = useMemo(() => {
    const withRows = periods.filter((x) => latestVersion(x)?.rows.length).sort((a, b) => a.year - b.year || a.month - b.month);
    return withRows.length ? latestVersion(withRows[withRows.length - 1])!.rows : [];
  }, [periods]);
  const months = useMemo(() => monthsBetween(p.startDate, p.endDate).filter((m) => m <= cutoff), [p.startDate, p.endDate, cutoff]);

  // Seed: các thành viên từng log task vào dự án (cùng nguồn với tab Actual Cost)
  const seed = (): Allocation[] => {
    const seen = new Map<string, PayRow>();
    months.forEach((m) => monthMembers(p, m, roster).forEach((x) => seen.set(x.row.code, x.row)));
    return [...seen.values()].map((r) => {
      const plan = pick(EFFORTS, p.id, r.code, 'eff');
      return {
        id: uid(),
        code: r.code,
        name: r.name,
        type: 'Internal',
        department: r.department,
        role: roleOf(r.title),
        level: levelOf(r.title, r.code),
        billable: plan,
        plan,
        techStack: pick(TECHS, p.id, r.code, 'tech'),
        start: p.startDate.slice(0, 10),
        end: p.endDate.slice(0, 10),
        jira: '-',
      };
    });
  };
  const [rows, setRowsRaw] = useState<Allocation[]>(() => STORE.get(p.id) || seed());
  const setRows = (fn: (r: Allocation[]) => Allocation[]) =>
    setRowsRaw((cur) => {
      const next = fn(cur);
      STORE.set(p.id, next);
      return next;
    });

  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Allocation | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const flash = (s: string) => {
    setMsg(s);
    window.setTimeout(() => setMsg(''), 3500);
  };

  const startEdit = (a: Allocation) => {
    setEditId(a.id);
    setDraft({ ...a });
    setConfirmId(null);
  };
  const cancelEdit = () => {
    if (draft && !rows.find((r) => r.id === draft.id)?.code) setRows((cur) => cur.filter((r) => r.id !== draft.id));
    setEditId(null);
    setDraft(null);
  };
  const valid = (d: Allocation | null) => !!d && !!d.code && !!d.start && !!d.end && d.end >= d.start && d.plan >= 0 && d.plan <= 100 && d.billable >= 0 && d.billable <= 100;
  const save = () => {
    if (!draft || !valid(draft)) return;
    setRows((cur) => cur.map((r) => (r.id === draft.id ? draft : r)));
    setEditId(null);
    setDraft(null);
  };
  const add = () => {
    const a: Allocation = { id: uid(), code: '', name: '', type: 'Internal', department: '', role: 'DEV', level: 'Middle', billable: 100, plan: 100, techStack: '', start: p.startDate.slice(0, 10), end: p.endDate.slice(0, 10), jira: '-' };
    setRows((cur) => [...cur, a]);
    setEditId(a.id);
    setDraft(a);
  };
  const pickMember = (code: string) => {
    if (!draft) return;
    const r = roster.find((x) => x.code === code);
    setDraft({ ...draft, code, name: r?.name || '', department: r?.department || '', role: r ? roleOf(r.title) : draft.role, level: r ? levelOf(r.title, r.code) : draft.level });
  };
  const sync = () => {
    const today = new Date().toISOString().slice(0, 10);
    setRows((cur) => cur.map((a) => ({ ...a, jira: rand(a.code, 'jira') < 0.08 ? 'Not found' : a.end >= today ? 'Active' : 'Inactive' })));
    flash(`Đã đồng bộ trạng thái Jira/DevOps cho ${rows.length} thành viên lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`);
  };

  const used = new Set(rows.filter((r) => r.id !== editId).map((r) => r.code));
  const heads = ['#', 'Member Name', 'Type', 'Department', 'Role', 'Level', 'Tech Stack', 'Jira Status', 'Actions'];

  return (
    <Panel title="Resources" icon={Users} noPad>
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-slate-200">
        <Btn variant="primary" icon={Plus} onClick={add} disabled={!!editId}>
          Allocation Resource
        </Btn>
        <Btn variant="primary" icon={RefreshCw} onClick={sync} disabled={!!editId || !rows.length}>
          SyncDevops
        </Btn>
        {msg && <span className="text-[12px] text-emerald-700">{msg}</span>}
      </div>

      <div className="overflow-x-auto">
        <table className={`${erp.table} min-w-[1000px]`}>
          <thead>
            <tr>
              {heads.map((h, i) => (
                <th key={h} className={`${erp.th} border-t-0 text-center ${i === 0 ? 'border-l-0 w-10' : ''} ${i === heads.length - 1 ? 'border-r-0 w-20' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => {
              const ed = editId === a.id && draft;
              if (ed)
                return (
                  <tr key={a.id} className="bg-[#f5f9ff]">
                    <td className={`${erp.td} text-center text-slate-500 border-l-0`}>{i + 1}</td>
                    <td className="border border-slate-200 p-1 min-w-[180px]">
                      <select autoFocus value={draft.code} onChange={(e) => pickMember(e.target.value)} className={`${INP} ${!draft.code ? 'border-rose-300' : ''}`}>
                        <option value="">— Chọn nhân sự —</option>
                        {roster
                          .filter((r) => !used.has(r.code))
                          .map((r) => (
                            <option key={r.code} value={r.code}>
                              {r.name} ({r.code})
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="border border-slate-200 p-1">
                      <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as Allocation['type'] })} className={INP}>
                        <option>Internal</option>
                        <option>Outsource</option>
                      </select>
                    </td>
                    <td className="border border-slate-200 p-1">
                      <input value={draft.department} onChange={(e) => setDraft({ ...draft, department: e.target.value })} className={INP} />
                    </td>
                    <td className="border border-slate-200 p-1">
                      <select value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} className={INP}>
                        {ROLES.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-slate-200 p-1">
                      <select value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value })} className={INP}>
                        {LEVELS.map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-slate-200 p-1">
                      <input value={draft.techStack} onChange={(e) => setDraft({ ...draft, techStack: e.target.value })} placeholder=".NET" className={INP} />
                    </td>
                    <td className={`${erp.td} text-center`}>
                      <span className={`inline-block min-w-[22px] px-1.5 py-0.5 rounded-[3px] text-[11px] font-bold ${JIRA_CLS[draft.jira]}`}>{draft.jira}</span>
                    </td>
                    <td className={`${erp.td} text-center border-r-0 whitespace-nowrap`}>
                      <button type="button" title="Lưu" onClick={save} disabled={!valid(draft)} className="p-1 rounded text-emerald-600 hover:bg-emerald-50 disabled:opacity-40 cursor-pointer">
                        <Check size={16} />
                      </button>
                      <button type="button" title="Huỷ" onClick={cancelEdit} className="p-1 rounded text-slate-500 hover:bg-slate-100 cursor-pointer">
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                );
              return (
                <tr key={a.id} className={erp.tr}>
                  <td className={`${erp.td} text-center text-slate-500 border-l-0`}>{i + 1}</td>
                  <td className={`${erp.td} whitespace-nowrap`} title={a.code}>
                    {a.name}
                  </td>
                  <td className={erp.td}>{a.type}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{a.department}</td>
                  <td className={erp.td}>{a.role}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{a.level}</td>
                  <td className={erp.td}>{a.techStack}</td>
                  <td className={`${erp.td} text-center`}>
                    <span className={`inline-block min-w-[22px] px-1.5 py-0.5 rounded-[3px] text-[11px] font-bold ${JIRA_CLS[a.jira]}`}>{a.jira}</span>
                  </td>
                  <td className={`${erp.td} text-center border-r-0 whitespace-nowrap`}>
                    {confirmId === a.id ? (
                      <span className="inline-flex gap-1">
                        <Btn variant="danger" className="h-6 px-2 text-[11px]" onClick={() => (setRows((cur) => cur.filter((x) => x.id !== a.id)), setConfirmId(null))}>
                          Xoá
                        </Btn>
                        <Btn className="h-6 px-2 text-[11px]" onClick={() => setConfirmId(null)}>
                          Không
                        </Btn>
                      </span>
                    ) : (
                      <>
                        <button type="button" title="Sửa" onClick={() => startEdit(a)} disabled={!!editId} className="p-1 rounded text-[#1f7ae0] hover:bg-[#eaf2fc] disabled:opacity-30 cursor-pointer">
                          <Pencil size={15} />
                        </button>
                        <button type="button" title="Xoá" onClick={() => setConfirmId(a.id)} disabled={!!editId} className="p-1 rounded text-[#1f7ae0] hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 cursor-pointer">
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan={heads.length} className="px-3 py-8 text-center text-slate-400 italic">
                  Chưa phân bổ nhân sự nào. Bấm "Allocation Resource".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
};
