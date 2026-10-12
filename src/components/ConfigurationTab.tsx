/**
 * ConfigurationTab — tab "Configuration" trên màn chi tiết dự án.
 *
 * Danh sách cấu hình / tài nguyên của dự án: # · Item · Link · Version · Update Date · Note · Actions.
 * Mặc định 6 mục: Jira, Share point, Configuration, Process & template, Git/Bitbucket, Risk.
 * Sửa trực tiếp trên dòng (không popup); xoá có xác nhận; thêm mục mới.
 * Lọc theo từng cột (bấm biểu tượng phễu trên tiêu đề cột).
 * Dữ liệu lưu tạm theo dự án trong phiên làm việc (chưa có API).
 */
import React, { useState } from 'react';
import { Check, ExternalLink, Filter, Pencil, Plus, Settings2, Trash2, X } from 'lucide-react';
import { BizProject } from '../business/BusinessProjectContext';
import { Btn, Panel, erp } from './erp/Erp';

export interface ConfigItem {
  id: string;
  item: string;
  link: string;
  version: string;
  updatedAt: string; // YYYY-MM-DD
  note: string;
}

const DEFAULT_ITEMS = ['Jira', 'Share point', 'Configuration', 'Process & template', 'Git/Bitbucket', 'Risk'];
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().slice(0, 10);
const dmy = (d: string) => (d ? d.split('-').reverse().join('/') : '');

/** Lưu theo dự án trong phiên (đổi tab / mở lại dự án vẫn còn). */
const STORE = new Map<string, ConfigItem[]>();
const initial = (pid: string) => STORE.get(pid) || DEFAULT_ITEMS.map((item) => ({ id: uid(), item, link: '', version: '', updatedAt: '', note: '' }));

type ColKey = 'item' | 'link' | 'version' | 'updatedAt' | 'note';
const COLS: { key: ColKey; label: string; w: string }[] = [
  { key: 'item', label: 'Item', w: 'w-[18%]' },
  { key: 'link', label: 'Link', w: 'w-[22%]' },
  { key: 'version', label: 'Version', w: 'w-[11%]' },
  { key: 'updatedAt', label: 'Update Date', w: 'w-[11%]' },
  { key: 'note', label: 'Note', w: '' },
];

const CELL_INPUT = 'w-full h-7 px-2 border border-slate-300 rounded-[3px] text-[12.5px] outline-none focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#1f5fa8]/15 bg-white';

export const ConfigurationTab: React.FC<{ project: BizProject }> = ({ project: p }) => {
  const [rows, setRowsRaw] = useState<ConfigItem[]>(() => initial(p.id));
  const setRows = (fn: (r: ConfigItem[]) => ConfigItem[]) =>
    setRowsRaw((cur) => {
      const next = fn(cur);
      STORE.set(p.id, next);
      return next;
    });
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ConfigItem | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<Record<ColKey, string>>>({});
  const [showFilter, setShowFilter] = useState(false);

  const shown = rows.filter((r) =>
    COLS.every(({ key }) => {
      const f = (filters[key] || '').trim().toLowerCase();
      if (!f) return true;
      const v = key === 'updatedAt' ? dmy(r.updatedAt) : r[key];
      return v.toLowerCase().includes(f);
    }),
  );

  const startEdit = (r: ConfigItem) => {
    setEditId(r.id);
    setDraft({ ...r });
    setConfirmId(null);
  };
  const cancelEdit = () => {
    // Dòng mới thêm mà chưa nhập gì → bỏ luôn
    if (draft && rows.find((r) => r.id === draft.id && !r.item && !r.link && !r.version && !r.note)) setRows((cur) => cur.filter((r) => r.id !== draft.id));
    setEditId(null);
    setDraft(null);
  };
  const save = () => {
    if (!draft || !draft.item.trim()) return;
    setRows((cur) => cur.map((r) => (r.id === draft.id ? { ...draft, item: draft.item.trim(), updatedAt: today() } : r)));
    setEditId(null);
    setDraft(null);
  };
  const add = () => {
    const r: ConfigItem = { id: uid(), item: '', link: '', version: '', updatedAt: '', note: '' };
    setRows((cur) => [...cur, r]);
    setEditId(r.id);
    setDraft(r);
  };
  const href = (link: string) => (/^https?:\/\//i.test(link) ? link : link ? `https://${link}` : '');

  return (
    <Panel
      title="Configuration"
      icon={Settings2}
      noPad
      actions={
        <>
          {Object.values(filters).some(Boolean) && (
            <Btn className="h-7" icon={X} onClick={() => setFilters({})}>
              Bỏ lọc
            </Btn>
          )}
          <Btn variant="primary" className="h-7" icon={Plus} onClick={add} disabled={!!editId}>
            Thêm mục
          </Btn>
        </>
      }
    >
      <div className="overflow-x-auto">
        <table className={`${erp.table} table-fixed min-w-[980px]`}>
          <thead>
            <tr>
              <th className={`${erp.th} border-t-0 border-l-0 text-center w-12`}>#</th>
              {COLS.map((c) => (
                <th key={c.key} className={`${erp.th} border-t-0 ${c.w}`}>
                  <span className="flex items-center justify-center relative">
                    {c.label}
                    <button
                      type="button"
                      title={`Lọc theo ${c.label}`}
                      onClick={() => setShowFilter((v) => !v)}
                      className={`absolute right-0 p-0.5 rounded cursor-pointer ${filters[c.key] ? 'text-[#1f5fa8]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      <Filter size={13} fill={filters[c.key] ? 'currentColor' : 'none'} />
                    </button>
                  </span>
                </th>
              ))}
              <th className={`${erp.th} border-t-0 border-r-0 text-center w-24`}>Actions</th>
            </tr>
            {showFilter && (
              <tr className="bg-white">
                <td className={`${erp.td} border-l-0`} />
                {COLS.map((c) => (
                  <td key={c.key} className="border border-slate-200 p-1">
                    <input value={filters[c.key] || ''} onChange={(e) => setFilters((f) => ({ ...f, [c.key]: e.target.value }))} placeholder="Lọc…" className={CELL_INPUT} />
                  </td>
                ))}
                <td className={`${erp.td} border-r-0`} />
              </tr>
            )}
          </thead>
          <tbody>
            {shown.map((r, i) => {
              const editing = editId === r.id && draft;
              return (
                <tr key={r.id} className={editing ? 'bg-[#f5f9ff]' : erp.tr}>
                  <td className={`${erp.td} text-center text-slate-500 border-l-0`}>{i + 1}</td>
                  {editing ? (
                    <>
                      <td className="border border-slate-200 p-1">
                        <input autoFocus value={draft.item} onChange={(e) => setDraft({ ...draft, item: e.target.value })} placeholder="Tên mục *" className={`${CELL_INPUT} ${!draft.item.trim() ? 'border-rose-300' : ''}`} />
                      </td>
                      <td className="border border-slate-200 p-1">
                        <input value={draft.link} onChange={(e) => setDraft({ ...draft, link: e.target.value })} placeholder="https://…" className={CELL_INPUT} />
                      </td>
                      <td className="border border-slate-200 p-1">
                        <input value={draft.version} onChange={(e) => setDraft({ ...draft, version: e.target.value })} placeholder="v1.0" className={CELL_INPUT} />
                      </td>
                      <td className={`${erp.td} text-center text-slate-400 text-[11.5px]`}>tự cập nhật khi lưu</td>
                      <td className="border border-slate-200 p-1">
                        <input
                          value={draft.note}
                          onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                          onKeyDown={(e) => (e.key === 'Enter' ? save() : e.key === 'Escape' ? cancelEdit() : null)}
                          placeholder="Ghi chú"
                          className={CELL_INPUT}
                        />
                      </td>
                      <td className={`${erp.td} text-center border-r-0 whitespace-nowrap`}>
                        <button type="button" title="Lưu" onClick={save} disabled={!draft.item.trim()} className="p-1 rounded text-emerald-600 hover:bg-emerald-50 disabled:opacity-40 cursor-pointer">
                          <Check size={16} />
                        </button>
                        <button type="button" title="Huỷ" onClick={cancelEdit} className="p-1 rounded text-slate-500 hover:bg-slate-100 cursor-pointer">
                          <X size={16} />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={`${erp.td} truncate`} title={r.item}>
                        {r.item}
                      </td>
                      <td className={`${erp.td} truncate`}>
                        {r.link && (
                          <a href={href(r.link)} target="_blank" rel="noreferrer" className="text-[#1f5fa8] hover:underline inline-flex items-center gap-1 max-w-full" title={r.link}>
                            <span className="truncate">{r.link}</span>
                            <ExternalLink size={11} className="shrink-0" />
                          </a>
                        )}
                      </td>
                      <td className={`${erp.td} truncate`}>{r.version}</td>
                      <td className={`${erp.td} text-center tabular-nums`}>{dmy(r.updatedAt)}</td>
                      <td className={`${erp.td} truncate`} title={r.note}>
                        {r.note}
                      </td>
                      <td className={`${erp.td} text-center border-r-0 whitespace-nowrap`}>
                        {confirmId === r.id ? (
                          <span className="inline-flex gap-1">
                            <Btn variant="danger" className="h-6 px-2 text-[11px]" onClick={() => (setRows((cur) => cur.filter((x) => x.id !== r.id)), setConfirmId(null))}>
                              Xoá
                            </Btn>
                            <Btn className="h-6 px-2 text-[11px]" onClick={() => setConfirmId(null)}>
                              Không
                            </Btn>
                          </span>
                        ) : (
                          <>
                            <button type="button" title="Sửa" onClick={() => startEdit(r)} disabled={!!editId} className="p-1 rounded text-[#1f7ae0] hover:bg-[#eaf2fc] disabled:opacity-30 cursor-pointer">
                              <Pencil size={15} />
                            </button>
                            <button type="button" title="Xoá" onClick={() => setConfirmId(r.id)} disabled={!!editId} className="p-1 rounded text-[#1f7ae0] hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 cursor-pointer">
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
            {!shown.length && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-slate-400 italic">
                  {rows.length ? 'Không có mục nào khớp bộ lọc.' : 'Chưa có mục cấu hình nào. Bấm "Thêm mục".'}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50">
              <td colSpan={7} className="px-3 py-1.5 border-t border-slate-200 text-right text-[12px] font-bold text-slate-700">
                Count: {shown.length}
                {shown.length !== rows.length && <span className="font-normal text-slate-500"> / {rows.length}</span>}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

    </Panel>
  );
};
