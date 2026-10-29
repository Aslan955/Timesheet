/**
 * ContractCatalogPage — "Danh mục hợp đồng" (Human Resources): 3 danh mục dùng cho màn Hợp đồng lao động.
 *  - Loại hợp đồng : mã, tên, nhóm (Thử việc / Xác định thời hạn / Không xác định thời hạn), thời hạn cho phép, thời hạn mặc định,
 *                    mức hưởng mặc định, bảo hiểm mặc định, thứ tự, trạng thái. Đổi tên → cập nhật các HĐ đang dùng.
 *  - Công ty       : pháp nhân ký HĐ — MST, địa chỉ, người đại diện, tài khoản, công ty mặc định.
 *  - Loại phụ lục  : mã, tên, nội dung điều chỉnh.
 * Thêm / sửa ngay trên trang (không popup); xoá có xác nhận; mục đang được dùng chỉ được ngừng sử dụng.
 */
import React, { useMemo, useState } from 'react';
import { AlertTriangle, Building2, Check, PenLine, FilePlus2, FileSignature, FileSpreadsheet, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, Panel, Tag, erp } from '../erp/Erp';
import { ColumnFilterBar, useColumnFilters } from '../erp/ColumnFilter';
import { CheckBox, InfoGrid, type InfoItem } from '../EmployeePage';
import { getContractStore, renameContractType, useContractStore } from '../ContractsPage';
import {
  APPENDIX_FIELDS, KINDS, KIND_CLS, KIND_LABEL, KIND_MAX, TERM_OPTIONS, termLabel, updateCatalog, useCatalog,
  type AppendixTypeDef, type CompanyDef, type ContractTypeDef, type Kind, type SignerDef,
} from './catalog';
import { ACTIVE_TAG, ErrText, INACTIVE_TAG, INPUT, LINK, errCls, exportSheet, lb, uid, useFlash } from './ui';

const CRUMBS = ['Human Resources', 'Danh mục hợp đồng'];
type Tab = 'types' | 'companies' | 'signers' | 'appendix';
type Item = { id: string; code: string; name: string; active: boolean };

// ==========================================================================
// Khung danh mục dùng chung: tìm kiếm · trạng thái · thêm/sửa trên trang · xoá có xác nhận · xuất Excel
// ==========================================================================
interface Col<T> {
  label: string;
  cls?: string;
  cell: (x: T) => React.ReactNode;
  xlsx: (x: T) => string | number;
}
interface TabCfg<T extends Item> {
  title: string;
  noun: string;
  icon: React.ElementType;
  items: T[];
  blank: () => T;
  cols: Col<T>[];
  form: (f: T, set: (p: Partial<T>) => void, E: (k: string) => string | undefined, isNew: boolean) => { left: InfoItem[]; right: InfoItem[] };
  validate: (f: T, list: T[], old?: T) => Record<string, string>;
  save: (f: T, old?: T) => string; // trả về thông báo
  usedBy: (x: T) => string; // khác rỗng → không xoá được
  remove: (x: T) => void;
  hint: string;
  exportName: string;
  search: (x: T) => string;
  /** false: cho phép trùng tên (vd người ký cùng tên ở 2 công ty) — tự kiểm tra trong validate */
  uniqueName?: boolean;
}

function CatalogTab<T extends Item>({ cfg, flash }: { cfg: TabCfg<T>; flash: (m: string) => void; key?: string }) {
  const [q, setQ] = useState('');
  const [st, setSt] = useState<'' | 'on' | 'off'>('');
  const [form, setForm] = useState<{ f: T; old?: T } | null>(null);
  const [tried, setTried] = useState(false);
  const [delId, setDelId] = useState<string | null>(null);
  const base = cfg.items.filter((x) => (!st || (st === 'on') === x.active) && (!q || cfg.search(x).toLowerCase().includes(q.toLowerCase())));
  const getters = useMemo(
    () => ({ ...Object.fromEntries(cfg.cols.map((c) => [c.label, (x: T) => String(c.xlsx(x) ?? '')])), 'Trạng thái': (x: T) => (x.active ? 'Đang sử dụng' : 'Ngừng sử dụng') }),
    [cfg.cols],
  );
  const colF = useColumnFilters(base, getters);
  const rows = colF.rows;
  const errs: Record<string, string> = {};
  if (form) {
    const f = form.f;
    if (!f.code.trim()) errs.code = 'Bắt buộc';
    else if (cfg.items.some((x) => x.id !== f.id && x.code.trim().toLowerCase() === f.code.trim().toLowerCase())) errs.code = 'Mã đã tồn tại';
    if (!f.name.trim()) errs.name = 'Bắt buộc';
    else if (cfg.uniqueName !== false && cfg.items.some((x) => x.id !== f.id && x.name.trim().toLowerCase() === f.name.trim().toLowerCase())) errs.name = 'Tên đã tồn tại';
    Object.assign(errs, cfg.validate(f, cfg.items, form.old));
  }
  const E = (k: string) => (tried ? errs[k] : undefined);
  const set = (p: Partial<T>) => setForm((o) => (o ? { ...o, f: { ...o.f, ...p } } : o));
  const save = () => {
    setTried(true);
    if (!form || Object.keys(errs).length) return;
    const f = { ...form.f, code: form.f.code.trim(), name: form.f.name.trim() };
    flash(cfg.save(f, form.old));
    setForm(null);
    setTried(false);
  };
  const fm = form ? cfg.form(form.f, set, E, !form.old) : null;
  const th = `${erp.th} border-t-0 text-left`;
  const nErr = Object.keys(errs).length;

  return (
    <>
      <Panel
        title={cfg.title}
        icon={cfg.icon}
        noPad
        className="!rounded-t-none !border-t-0"
        actions={
          <>
            <div className="relative w-60">
              <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã, tên..." className={`${erp.inputFull} h-7 pl-7`} />
            </div>
            <select value={st} onChange={(e) => setSt(e.target.value as '' | 'on' | 'off')} className={`${erp.input} h-7 w-40`}>
              <option value="">Tất cả trạng thái</option>
              <option value="on">Đang sử dụng</option>
              <option value="off">Ngừng sử dụng</option>
            </select>
            <Btn icon={FileSpreadsheet} className="h-7" onClick={() => exportSheet(cfg.exportName, 'DanhMuc', ['STT', ...cfg.cols.map((c) => c.label), 'Trạng thái'], cfg.items.map((x, i) => [i + 1, ...cfg.cols.map((c) => c.xlsx(x)), x.active ? 'Đang sử dụng' : 'Ngừng sử dụng']))}>
              Xuất Excel
            </Btn>
            <Btn variant="primary" icon={Plus} className="h-7" onClick={() => (setForm({ f: cfg.blank() }), setTried(false), setDelId(null))}>
              Thêm {cfg.noun}
            </Btn>
          </>
        }
        footer={`${rows.length} / ${cfg.items.length} ${cfg.noun} · ${cfg.hint}`}
      >
        {form && fm && (
          <div className="border-b-2 border-[#1f5fa8] bg-[#f7faff]">
            <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 border-b border-slate-200 bg-[#eef4fb]">
              <span className="text-[12px] font-bold uppercase tracking-wide text-[#1e3a5f]">{form.old ? `Sửa ${cfg.noun}: ${form.old.name}` : `Thêm ${cfg.noun}`}</span>
              {tried && nErr > 0 && <span className="text-[12px] text-rose-600">· Còn {nErr} trường chưa hợp lệ (đánh dấu đỏ)</span>}
              <span className="ml-auto flex gap-1.5">
                <Btn icon={X} className="h-7" onClick={() => (setForm(null), setTried(false))}>
                  Huỷ
                </Btn>
                <Btn variant="primary" icon={Save} className="h-7" onClick={save}>
                  Lưu
                </Btn>
              </span>
            </div>
            <div className="bg-white">
              <InfoGrid left={fm.left} right={fm.right} />
            </div>
          </div>
        )}
        <ColumnFilterBar active={colF.active} filters={colF.filters} labelOf={(k) => k} onRemove={(k) => colF.set(k, [])} onClear={colF.clear} />
        <div className="overflow-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${th} border-l-0 w-12 !text-center`}>STT</th>
                {cfg.cols.map((c) => (
                  <th key={c.label} className={`${th} ${c.cls || ''}`}>
                    <div className="flex items-center gap-1">
                      <span className="flex-1 min-w-0">{c.label}</span>
                      {colF.funnel(c.label, c.label)}
                    </div>
                  </th>
                ))}
                <th className={`${th} w-36`}>
                  <div className="flex items-center gap-1">
                    <span className="flex-1 min-w-0">Trạng thái</span>
                    {colF.funnel('Trạng thái', 'Trạng thái')}
                  </div>
                </th>
                <th className={`${th} border-r-0 w-28 !text-center`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x, i) => {
                const used = cfg.usedBy(x);
                return (
                  <React.Fragment key={x.id}>
                    <tr className={form?.f.id === x.id ? 'bg-[#dbe8f8]' : erp.tr}>
                      <td className={`${erp.td} border-l-0 text-center text-slate-500`}>{i + 1}</td>
                      {cfg.cols.map((c) => (
                        <td key={c.label} className={`${erp.td} ${c.cls || ''}`}>
                          {c.cell(x)}
                        </td>
                      ))}
                      <td className={erp.td}>
                        <Tag cls={x.active ? ACTIVE_TAG : INACTIVE_TAG}>{x.active ? 'Đang sử dụng' : 'Ngừng sử dụng'}</Tag>
                      </td>
                      <td className={`${erp.td} border-r-0 text-center whitespace-nowrap`}>
                        <span className="inline-flex items-center gap-2">
                          <button type="button" className={LINK} onClick={() => (setForm({ f: structuredClone(x), old: x }), setTried(false), setDelId(null))}>
                            Sửa
                          </button>
                          <button type="button" className={`${LINK} !text-rose-600`} onClick={() => setDelId(delId === x.id ? null : x.id)}>
                            Xoá
                          </button>
                        </span>
                      </td>
                    </tr>
                    {delId === x.id && (
                      <tr>
                        <td colSpan={cfg.cols.length + 3} className={`${erp.td} border-x-0 ${used ? 'bg-amber-50' : 'bg-rose-50'}`}>
                          <span className={`flex flex-wrap items-center gap-3 text-[12.5px] ${used ? 'text-amber-800' : 'text-rose-700'}`}>
                            <AlertTriangle size={14} className="shrink-0" />
                            {used ? (
                              <>
                                <span className="flex-1">
                                  Không xoá được <b>{x.name}</b>: {used}. Có thể chuyển sang <b>Ngừng sử dụng</b> để không chọn được cho hợp đồng mới.
                                </span>
                                {x.active && (
                                  <Btn
                                    className="h-7"
                                    onClick={() => {
                                      const f = { ...x, active: false };
                                      const e = cfg.validate(f, cfg.items, x);
                                      if (e.active) return flash(e.active);
                                      flash(cfg.save(f, x));
                                      setDelId(null);
                                    }}
                                  >
                                    Ngừng sử dụng
                                  </Btn>
                                )}
                                <Btn className="h-7" onClick={() => setDelId(null)}>
                                  Đóng
                                </Btn>
                              </>
                            ) : (
                              <>
                                <span className="flex-1">
                                  Xoá {cfg.noun} <b>{x.code} — {x.name}</b>? Không khôi phục được.
                                </span>
                                <Btn className="h-7" onClick={() => setDelId(null)}>
                                  Không xoá
                                </Btn>
                                <Btn variant="danger" icon={Trash2} className="h-7 !bg-rose-600 !text-white !border-rose-700" onClick={() => (cfg.remove(x), setDelId(null), flash(`Đã xoá ${cfg.noun} ${x.name}`))}>
                                  Xoá
                                </Btn>
                              </>
                            )}
                          </span>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={cfg.cols.length + 3} className="px-3 py-10 text-center text-slate-400">
                    Không có dữ liệu phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

// ==========================================================================
// Trang
// ==========================================================================
export const ContractCatalogPage: React.FC = () => {
  const cat = useCatalog();
  const cs = useContractStore();
  const [tab, setTab] = useState<Tab>('types');
  const { flash, toast } = useFlash();
  const countBy = useMemo(() => {
    const byType = new Map<string, number>();
    const byCo = new Map<string, number>();
    const bySigner = new Map<string, number>();
    cs.contracts.forEach((c) => {
      if (c.signerId) bySigner.set(c.signerId, (bySigner.get(c.signerId) || 0) + 1);
      byType.set(c.type, (byType.get(c.type) || 0) + 1);
      byCo.set(c.companyId, (byCo.get(c.companyId) || 0) + 1);
    });
    return { byType, byCo, bySigner };
  }, [cs.contracts]);
  const tplNames = (kind: 'HD' | 'PL', id: string) => cat.templates.filter((t) => t.kind === kind && t.active && t.appliesTo.includes(id)).map((t) => t.name);
  const tplCell = (kind: 'HD' | 'PL', id: string) => {
    const n = tplNames(kind, id);
    return n.length ? n.join(', ') : <span className="text-amber-700">Chưa có{kind === 'HD' ? ' — in mặc định' : ''}</span>;
  };
  const NumIn = (v: number, on: (n: number) => void, w = 'w-24', err?: string) => (
    <input type="number" value={v} onChange={(e) => on(Number(e.target.value))} className={`${INPUT} ${w} text-right tabular-nums ${errCls(err)}`} />
  );
  const activeCheck = (v: boolean, on: (b: boolean) => void, err?: string) => (
    <>
      <span className="flex items-center gap-2">
        <CheckBox checked={v} onChange={on} /> Đang sử dụng
      </span>
      <ErrText e={err} />
    </>
  );
  const text = (v: string, on: (s: string) => void, err?: string, ph = '') => (
    <>
      <input value={v} placeholder={ph} onChange={(e) => on(e.target.value)} className={`${INPUT} ${errCls(err)}`} />
      <ErrText e={err} />
    </>
  );

  // ---------------- Loại hợp đồng
  const typesCfg: TabCfg<ContractTypeDef> = {
    title: 'Danh mục loại hợp đồng',
    noun: 'loại hợp đồng',
    icon: FileSignature,
    items: [...cat.types].sort((a, b) => a.order - b.order),
    blank: () => ({ id: `ct-${uid()}`, code: '', name: '', kind: 'XD', suffix: '', terms: [12], defTerm: 12, rate: 100, insurance: true, order: cat.types.length + 1, active: true, note: '' }),
    search: (x) => `${x.code} ${x.name} ${KIND_LABEL[x.kind]}`,
    hint: 'Nhóm quyết định quy tắc: không xác định thời hạn thì không có ngày hết hạn; tái ký Thử việc → Xác định thời hạn → Không xác định thời hạn',
    exportName: 'danh-muc-loai-hop-dong.xlsx',
    cols: [
      { label: 'Mã', cls: 'w-24', cell: (x) => <span className={`${erp.code} font-semibold`}>{x.code}</span>, xlsx: (x) => x.code },
      { label: 'Tên loại hợp đồng', cell: (x) => <b className="text-slate-800">{x.name}</b>, xlsx: (x) => x.name },
      { label: 'Nhóm', cls: 'w-40', cell: (x) => <Tag cls={KIND_CLS[x.kind]}>{x.kind === 'OTHER' ? 'Khác' : KIND_LABEL[x.kind]}</Tag>, xlsx: (x) => KIND_LABEL[x.kind] },
      { label: 'Ký hiệu số HĐ', cls: 'whitespace-nowrap', cell: (x) => <span className="font-mono text-slate-600">«Mã_NV»/…/<b className="text-slate-800">{x.suffix}</b></span>, xlsx: (x) => x.suffix },
      { label: 'Thời hạn cho phép', cell: (x) => (x.kind === 'KXD' ? 'Không thời hạn' : x.terms.map(termLabel).join(', ')), xlsx: (x) => (x.kind === 'KXD' ? 'Không thời hạn' : x.terms.map(termLabel).join(', ')) },
      { label: 'Mặc định', cls: 'w-20 text-center', cell: (x) => (x.defTerm ? termLabel(x.defTerm) : '—'), xlsx: (x) => (x.defTerm ? termLabel(x.defTerm) : '') },
      { label: 'Mức hưởng', cls: 'w-20 text-right', cell: (x) => `${x.rate}%`, xlsx: (x) => x.rate },
      { label: 'Bảo hiểm', cls: 'w-20 text-center', cell: (x) => (x.insurance ? <Check size={14} className="inline text-emerald-600" /> : '—'), xlsx: (x) => (x.insurance ? 'Có' : 'Không') },
      { label: 'Template in', cell: (x) => tplCell('HD', x.id), xlsx: (x) => tplNames('HD', x.id).join(', ') },
      { label: 'Số HĐ', cls: 'w-16 text-right', cell: (x) => countBy.byType.get(x.name) || 0, xlsx: (x) => countBy.byType.get(x.name) || 0 },
    ],
    form: (f, set, E, isNew) => {
      const used = !isNew && (countBy.byType.get(cat.types.find((t) => t.id === f.id)?.name || '') || 0);
      const opts = TERM_OPTIONS.filter((m) => m <= KIND_MAX[f.kind]);
      return {
        left: [
          { label: lb('Mã', true), value: text(f.code, (v) => set({ code: v.toUpperCase() }), E('code'), 'VD: HDXD') },
          { label: lb('Tên loại hợp đồng', true), value: text(f.name, (v) => set({ name: v }), E('name'), 'VD: Hợp đồng xác định thời hạn') },
          {
            label: lb('Nhóm', true),
            value: (
              <>
                <select
                  value={f.kind}
                  disabled={!!used}
                  onChange={(e) => {
                    const k = e.target.value as Kind;
                    const terms = k === 'KXD' ? [] : f.terms.filter((m) => m <= KIND_MAX[k]).length ? f.terms.filter((m) => m <= KIND_MAX[k]) : k === 'TV' ? [2] : [12];
                    set({ kind: k, terms, defTerm: k === 'KXD' ? 0 : terms.includes(f.defTerm) ? f.defTerm : terms[0], rate: k === 'TV' ? 85 : f.rate, insurance: k === 'TV' ? false : f.insurance });
                  }}
                  className={INPUT}
                >
                  {KINDS.map((k) => (
                    <option key={k} value={k}>
                      {KIND_LABEL[k]}
                    </option>
                  ))}
                </select>
                {!!used && <span className="text-[11px] text-slate-500 mt-0.5">Đang dùng cho {used} hợp đồng — không đổi nhóm</span>}
                <ErrText e={E('kind')} />
              </>
            ),
          },
          {
            label: lb('Ký hiệu số HĐ', true),
            value: (
              <>
                <span className="flex items-center gap-1.5 w-full">
                  <span className="font-mono text-slate-500 whitespace-nowrap">«Mã_NV»/«Công ty»/</span>
                  <input value={f.suffix} placeholder="VD: HDCT" onChange={(e) => set({ suffix: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '') })} className={`${INPUT} font-mono w-32 ${errCls(E('suffix'))}`} />
                </span>
                <ErrText e={E('suffix')} />
              </>
            ),
          },
          { label: 'Thứ tự hiển thị', value: NumIn(f.order, (n) => set({ order: n })) },
          { label: 'Trạng thái', value: activeCheck(f.active, (b) => set({ active: b }), E('active')) },
        ],
        right: [
          {
            label: lb('Thời hạn cho phép', f.kind !== 'KXD'),
            value:
              f.kind === 'KXD' ? (
                <span className="text-slate-500">Không xác định thời hạn — không có ngày hết hạn</span>
              ) : (
                <>
                  <span className="flex flex-wrap gap-x-4 gap-y-1">
                    {opts.map((m) => (
                      <span key={m} className="flex items-center gap-1.5">
                        <CheckBox
                          checked={f.terms.includes(m)}
                          onChange={(v) => {
                            const terms = (v ? [...f.terms, m] : f.terms.filter((x) => x !== m)).sort((a, b) => a - b);
                            set({ terms, defTerm: terms.includes(f.defTerm) ? f.defTerm : terms[0] || 0 });
                          }}
                        />{' '}
                        {termLabel(m)}
                      </span>
                    ))}
                  </span>
                  <ErrText e={E('terms')} />
                </>
              ),
          },
          {
            label: 'Thời hạn mặc định',
            value:
              f.kind === 'KXD' ? (
                '—'
              ) : (
                <select value={f.defTerm} onChange={(e) => set({ defTerm: Number(e.target.value) })} className={`${INPUT} w-40`}>
                  {f.terms.map((m) => (
                    <option key={m} value={m}>
                      {termLabel(m)}
                    </option>
                  ))}
                </select>
              ),
          },
          {
            label: 'Mức hưởng mặc định (%)',
            value: (
              <>
                {NumIn(f.rate, (n) => set({ rate: n }), 'w-24', E('rate'))}
                <ErrText e={E('rate')} />
              </>
            ),
          },
          {
            label: 'Bảo hiểm mặc định',
            value: (
              <span className="flex items-center gap-2">
                <CheckBox checked={f.insurance} onChange={(b) => set({ insurance: b })} /> Tham gia BHXH, BHYT, BHTN
              </span>
            ),
          },
          { label: 'Ghi chú', value: <textarea rows={2} value={f.note} onChange={(e) => set({ note: e.target.value })} className={`${INPUT} h-auto py-1.5 resize-y`} /> },
        ],
      };
    },
    validate: (f, list, old) => {
      const e: Record<string, string> = {};
      if (f.kind !== 'KXD' && !f.terms.length) e.terms = 'Chọn ít nhất 1 thời hạn';
      if (f.kind !== 'KXD' && f.terms.some((m) => m > KIND_MAX[f.kind])) e.terms = `${KIND_LABEL[f.kind]}: tối đa ${termLabel(KIND_MAX[f.kind])}`;
      if (f.rate < 0 || f.rate > 100) e.rate = 'Từ 0 đến 100%';
      if (!f.suffix) e.suffix = 'Bắt buộc — dùng tạo số hợp đồng';
      if (old && old.kind !== f.kind && (countBy.byType.get(old.name) || 0) > 0) e.kind = 'Đang có hợp đồng dùng loại này — không đổi nhóm';
      const others = list.filter((x) => x.id !== f.id && x.kind === f.kind && x.active);
      if (!f.active && f.kind !== 'OTHER' && !others.length) e.active = `Phải còn ít nhất 1 loại "${KIND_LABEL[f.kind]}" đang sử dụng (dùng khi tái ký)`;
      return e;
    },
    save: (f, old) => {
      const clean = { ...f, terms: f.kind === 'KXD' ? [] : f.terms, defTerm: f.kind === 'KXD' ? 0 : f.defTerm };
      updateCatalog((c) => ({ ...c, types: old ? c.types.map((x) => (x.id === f.id ? clean : x)) : [...c.types, clean] }));
      if (old && old.name !== f.name) {
        const n = getContractStore().contracts.filter((c) => c.type === old.name).length;
        renameContractType(old.name, f.name);
        return `Đã lưu loại hợp đồng · đổi tên trên ${n} hợp đồng`;
      }
      return old ? `Đã lưu loại hợp đồng ${f.name}` : `Đã thêm loại hợp đồng ${f.name}`;
    },
    usedBy: (x) => {
      const n = countBy.byType.get(x.name) || 0;
      return n ? `đang dùng cho ${n} hợp đồng` : '';
    },
    remove: (x) => updateCatalog((c) => ({ ...c, types: c.types.filter((t) => t.id !== x.id), templates: c.templates.map((t) => ({ ...t, appliesTo: t.appliesTo.filter((a) => a !== x.id) })) })),
  };

  // ---------------- Công ty
  const companiesCfg: TabCfg<CompanyDef> = {
    title: 'Danh mục công ty',
    noun: 'công ty',
    icon: Building2,
    items: cat.companies,
    blank: () => ({ id: `co-${uid()}`, code: '', name: '', shortName: '', contractCode: '', legalRepSalutation: 'Ông', taxCode: '', address: '', phone: '', email: '', legalRep: '', legalRepTitle: 'Giám đốc', bankAccount: '', bankName: '', isDefault: false, active: true, note: '' }),
    search: (x) => `${x.code} ${x.name} ${x.shortName} ${x.taxCode} ${x.legalRep}`,
    hint: 'Công ty ký hợp đồng — thông tin dùng khi in hợp đồng (Bên A). Công ty mặc định được chọn sẵn khi thêm hợp đồng.',
    exportName: 'danh-muc-cong-ty.xlsx',
    cols: [
      { label: 'Mã', cls: 'w-20', cell: (x) => <span className={`${erp.code} font-semibold`}>{x.code}</span>, xlsx: (x) => x.code },
      {
        label: 'Tên công ty',
        cell: (x) => (
          <span className="flex flex-wrap items-center gap-1.5">
            <b className="text-slate-800">{x.name}</b>
            {x.isDefault && <Tag cls="bg-amber-50 text-amber-700 border-amber-300">Mặc định</Tag>}
          </span>
        ),
        xlsx: (x) => x.name,
      },
      { label: 'Tên viết tắt', cls: 'whitespace-nowrap', cell: (x) => x.shortName, xlsx: (x) => x.shortName },
      { label: 'Ký hiệu số HĐ', cls: 'whitespace-nowrap', cell: (x) => <span className="font-mono text-slate-600">«Mã_NV»/<b className="text-slate-800">{x.contractCode}</b>/…</span>, xlsx: (x) => x.contractCode },
      { label: 'Mã số thuế', cls: 'w-28 font-mono', cell: (x) => x.taxCode || <span className="text-amber-700 font-sans">Chưa có</span>, xlsx: (x) => x.taxCode },
      { label: 'Địa chỉ', cell: (x) => x.address, xlsx: (x) => x.address },
      { label: 'Người đại diện', cls: 'whitespace-nowrap', cell: (x) => (x.legalRep ? <>{x.legalRepSalutation} {x.legalRep} <span className="text-slate-500">— {x.legalRepTitle}</span></> : '—'), xlsx: (x) => `${x.legalRepSalutation} ${x.legalRep} — ${x.legalRepTitle}` },
      { label: 'Điện thoại', cls: 'whitespace-nowrap', cell: (x) => x.phone, xlsx: (x) => x.phone },
      { label: 'Số HĐ', cls: 'w-16 text-right', cell: (x) => countBy.byCo.get(x.id) || 0, xlsx: (x) => countBy.byCo.get(x.id) || 0 },
    ],
    form: (f, set, E) => ({
      left: [
        { label: lb('Mã', true), value: text(f.code, (v) => set({ code: v.toUpperCase() }), E('code'), 'VD: AEQ') },
        { label: lb('Tên công ty', true), value: text(f.name, (v) => set({ name: v.toUpperCase() }), E('name'), 'Tên đầy đủ theo đăng ký kinh doanh') },
        { label: 'Tên viết tắt', value: text(f.shortName, (v) => set({ shortName: v })) },
        {
          label: lb('Ký hiệu trên số HĐ', true),
          value: (
            <>
              <span className="flex items-center gap-1.5 w-full">
                <span className="font-mono text-slate-500">«Mã_NV»/</span>
                <input value={f.contractCode} placeholder="VD: AEQUITAS" onChange={(e) => set({ contractCode: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '') })} className={`${INPUT} font-mono w-40 ${errCls(E('contractCode'))}`} />
                <span className="font-mono text-slate-500">/HDCT</span>
              </span>
              <ErrText e={E('contractCode')} />
            </>
          ),
        },
        { label: 'Mã số thuế', value: text(f.taxCode, (v) => set({ taxCode: v.replace(/[^\d-]/g, '') }), E('taxCode'), '10 số hoặc 10 số-3 số') },
        { label: lb('Địa chỉ', true), value: text(f.address, (v) => set({ address: v }), E('address')) },
        { label: 'Điện thoại', value: text(f.phone, (v) => set({ phone: v })) },
        { label: 'Email', value: text(f.email, (v) => set({ email: v }), E('email')) },
      ],
      right: [
        {
          label: lb('Người đại diện', true),
          value: (
            <>
              <span className="flex items-center gap-1.5 w-full">
                <select value={f.legalRepSalutation} onChange={(e) => set({ legalRepSalutation: e.target.value })} className={`${INPUT} w-20`}>
                  <option>Ông</option>
                  <option>Bà</option>
                </select>
                <input value={f.legalRep} placeholder="Người đại diện theo pháp luật" onChange={(e) => set({ legalRep: e.target.value })} className={`${INPUT} ${errCls(E('legalRep'))}`} />
              </span>
              <ErrText e={E('legalRep')} />
            </>
          ),
        },
        { label: lb('Chức vụ', true), value: text(f.legalRepTitle, (v) => set({ legalRepTitle: v }), E('legalRepTitle')) },
        { label: 'Số tài khoản', value: text(f.bankAccount, (v) => set({ bankAccount: v })) },
        { label: 'Ngân hàng', value: text(f.bankName, (v) => set({ bankName: v })) },
        {
          label: 'Công ty mặc định',
          value: (
            <span className="flex items-center gap-2">
              <CheckBox checked={f.isDefault} onChange={(b) => set({ isDefault: b })} /> Chọn sẵn khi thêm hợp đồng
            </span>
          ),
        },
        { label: 'Trạng thái', value: activeCheck(f.active, (b) => set({ active: b }), E('active')) },
        { label: 'Ghi chú', value: <textarea rows={2} value={f.note} onChange={(e) => set({ note: e.target.value })} className={`${INPUT} h-auto py-1.5 resize-y`} /> },
      ],
    }),
    validate: (f, list, old) => {
      const e: Record<string, string> = {};
      if (!f.contractCode) e.contractCode = 'Bắt buộc — dùng tạo số hợp đồng';
      else if (list.some((x) => x.id !== f.id && x.contractCode === f.contractCode)) e.contractCode = 'Ký hiệu đã dùng cho công ty khác';
      if (!f.taxCode) {
        /* chưa có MST: cho phép lưu, hiển thị "Chưa có" */
      } else if (!/^\d{10}(-\d{3})?$/.test(f.taxCode)) e.taxCode = 'Mã số thuế gồm 10 số (hoặc 10 số-3 số với chi nhánh)';
      else if (list.some((x) => x.id !== f.id && x.taxCode === f.taxCode)) e.taxCode = 'Mã số thuế đã tồn tại';
      if (!f.address.trim()) e.address = 'Bắt buộc';
      if (!f.legalRep.trim()) e.legalRep = 'Bắt buộc';
      if (!f.legalRepTitle.trim()) e.legalRepTitle = 'Bắt buộc';
      if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email = 'Email không hợp lệ';
      if (f.isDefault && !f.active) e.active = 'Công ty mặc định phải đang sử dụng';
      if (old?.isDefault && !f.isDefault) e.active = 'Phải có 1 công ty mặc định — chọn công ty mặc định khác thay thế';
      if (!f.active && !list.some((x) => x.id !== f.id && x.active)) e.active = 'Phải còn ít nhất 1 công ty đang sử dụng';
      return e;
    },
    save: (f, old) => {
      updateCatalog((c) => {
        let cos = old ? c.companies.map((x) => (x.id === f.id ? f : x)) : [...c.companies, f];
        if (f.isDefault) cos = cos.map((x) => (x.id === f.id ? x : { ...x, isDefault: false }));
        return { ...c, companies: cos };
      });
      return old ? `Đã lưu công ty ${f.name}` : `Đã thêm công ty ${f.name}`;
    },
    usedBy: (x) => {
      const n = countBy.byCo.get(x.id) || 0;
      const t = cat.templates.filter((tp) => tp.companyId === x.id).length;
      return [n && `đang dùng cho ${n} hợp đồng`, t && `có ${t} template riêng`, x.isDefault && 'là công ty mặc định'].filter(Boolean).join(', ');
    },
    remove: (x) => updateCatalog((c) => ({ ...c, companies: c.companies.filter((co) => co.id !== x.id) })),
  };

  // ---------------- Loại phụ lục
  const appendixCfg: TabCfg<AppendixTypeDef> = {
    title: 'Danh mục loại phụ lục hợp đồng',
    noun: 'loại phụ lục',
    icon: FilePlus2,
    items: [...cat.appendix].sort((a, b) => a.order - b.order),
    blank: () => ({ id: `pl-${uid()}`, code: `PL${String(cat.appendix.length + 1).padStart(2, '0')}`, name: '', changes: [], order: cat.appendix.length + 1, active: true, note: '' }),
    search: (x) => `${x.code} ${x.name} ${x.changes.join(' ')}`,
    hint: 'Phụ lục dùng để thay đổi một số nội dung của hợp đồng đang hiệu lực (lương, phụ cấp, vị trí, nơi làm việc…).',
    exportName: 'danh-muc-loai-phu-luc.xlsx',
    cols: [
      { label: 'Mã', cls: 'w-20', cell: (x) => <span className={`${erp.code} font-semibold`}>{x.code}</span>, xlsx: (x) => x.code },
      { label: 'Tên loại phụ lục', cell: (x) => <b className="text-slate-800">{x.name}</b>, xlsx: (x) => x.name },
      {
        label: 'Nội dung điều chỉnh',
        cell: (x) => (
          <span className="flex flex-wrap gap-1">
            {x.changes.map((c) => (
              <Tag key={c} cls="bg-white text-slate-700 border-slate-300">
                {c}
              </Tag>
            ))}
          </span>
        ),
        xlsx: (x) => x.changes.join(', '),
      },
      { label: 'Template', cell: (x) => tplCell('PL', x.id), xlsx: (x) => tplNames('PL', x.id).join(', ') },
      { label: 'Thứ tự', cls: 'w-16 text-right', cell: (x) => x.order, xlsx: (x) => x.order },
      { label: 'Ghi chú', cell: (x) => x.note || '—', xlsx: (x) => x.note },
    ],
    form: (f, set, E) => ({
      left: [
        { label: lb('Mã', true), value: text(f.code, (v) => set({ code: v.toUpperCase() }), E('code')) },
        { label: lb('Tên loại phụ lục', true), value: text(f.name, (v) => set({ name: v }), E('name'), 'VD: Phụ lục điều chỉnh lương') },
        { label: 'Thứ tự hiển thị', value: NumIn(f.order, (n) => set({ order: n })) },
        { label: 'Trạng thái', value: activeCheck(f.active, (b) => set({ active: b })) },
      ],
      right: [
        {
          label: lb('Nội dung điều chỉnh', true),
          value: (
            <>
              <span className="grid grid-cols-2 gap-x-4 gap-y-1">
                {APPENDIX_FIELDS.map((c) => (
                  <span key={c} className="flex items-center gap-1.5">
                    <CheckBox checked={f.changes.includes(c)} onChange={(v) => set({ changes: v ? APPENDIX_FIELDS.filter((x) => f.changes.includes(x) || x === c) : f.changes.filter((x) => x !== c) })} /> {c}
                  </span>
                ))}
              </span>
              <ErrText e={E('changes')} />
            </>
          ),
        },
        { label: 'Ghi chú', value: <textarea rows={2} value={f.note} onChange={(e) => set({ note: e.target.value })} className={`${INPUT} h-auto py-1.5 resize-y`} /> },
      ],
    }),
    validate: (f): Record<string, string> => (f.changes.length ? {} : { changes: 'Chọn ít nhất 1 nội dung' }),
    save: (f, old) => {
      updateCatalog((c) => ({ ...c, appendix: old ? c.appendix.map((x) => (x.id === f.id ? f : x)) : [...c.appendix, f] }));
      return old ? `Đã lưu loại phụ lục ${f.name}` : `Đã thêm loại phụ lục ${f.name}`;
    },
    usedBy: () => '',
    remove: (x) => updateCatalog((c) => ({ ...c, appendix: c.appendix.filter((a) => a.id !== x.id), templates: c.templates.map((t) => ({ ...t, appliesTo: t.appliesTo.filter((a) => a !== x.id) })) })),
  };

  // ---------------- Người ký (1 công ty có nhiều người ký)
  const coName = (id: string) => cat.companies.find((c) => c.id === id)?.shortName || '—';
  const signersCfg: TabCfg<SignerDef> = {
    title: 'Danh mục người ký hợp đồng',
    noun: 'người ký',
    icon: PenLine,
    items: [...cat.signers].sort((a, b) => coName(a.companyId).localeCompare(coName(b.companyId)) || Number(b.isDefault) - Number(a.isDefault) || a.code.localeCompare(b.code)),
    uniqueName: false,
    blank: () => ({ id: `sg-${uid()}`, code: '', companyId: cat.companies.find((c) => c.isDefault)?.id || cat.companies[0]?.id || '', salutation: 'Ông', name: '', title: '', authorization: '', isDefault: false, active: true, note: '' }),
    search: (x) => `${x.code} ${x.name} ${x.title} ${coName(x.companyId)} ${x.authorization}`,
    hint: 'Người được ký hợp đồng thay mặt công ty (Bên A). Màn hợp đồng chọn người ký theo công ty ký HĐ; người ký mặc định được chọn sẵn khi không có Thiết lập người ký phù hợp.',
    exportName: 'danh-muc-nguoi-ky.xlsx',
    cols: [
      { label: 'Mã', cls: 'w-24', cell: (x) => <span className={`${erp.code} font-semibold`}>{x.code}</span>, xlsx: (x) => x.code },
      { label: 'Công ty', cls: 'whitespace-nowrap', cell: (x) => coName(x.companyId), xlsx: (x) => cat.companies.find((c) => c.id === x.companyId)?.name || '' },
      {
        label: 'Người ký',
        cls: 'whitespace-nowrap',
        cell: (x) => (
          <span className="flex flex-wrap items-center gap-1.5">
            <b className="text-slate-800">
              {x.salutation} {x.name}
            </b>
            {x.isDefault && <Tag cls="bg-amber-50 text-amber-700 border-amber-300">Mặc định</Tag>}
          </span>
        ),
        xlsx: (x) => `${x.salutation} ${x.name}`,
      },
      { label: 'Chức danh', cls: 'whitespace-nowrap', cell: (x) => x.title, xlsx: (x) => x.title },
      { label: 'Giấy uỷ quyền', cell: (x) => x.authorization || <i className="text-slate-500">Đại diện theo pháp luật</i>, xlsx: (x) => x.authorization || 'Đại diện theo pháp luật' },
      { label: 'Số HĐ đã ký', cls: 'w-24 text-right', cell: (x) => countBy.bySigner.get(x.id) || 0, xlsx: (x) => countBy.bySigner.get(x.id) || 0 },
    ],
    form: (f, set, E) => ({
      left: [
        { label: lb('Mã', true), value: text(f.code, (v) => set({ code: v.toUpperCase() }), E('code'), 'VD: AEQ-PGD') },
        {
          label: lb('Công ty', true),
          value: (
            <>
              <select value={f.companyId} onChange={(e) => set({ companyId: e.target.value })} className={`${INPUT} ${errCls(E('companyId'))}`}>
                <option value="">— Chọn công ty —</option>
                {cat.companies
                  .filter((c) => c.active || c.id === f.companyId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
              <ErrText e={E('companyId')} />
            </>
          ),
        },
        {
          label: lb('Người ký', true),
          value: (
            <>
              <span className="flex items-center gap-1.5 w-full">
                <select value={f.salutation} onChange={(e) => set({ salutation: e.target.value })} className={`${INPUT} w-20`}>
                  <option>Ông</option>
                  <option>Bà</option>
                </select>
                <input value={f.name} placeholder="Họ và tên" onChange={(e) => set({ name: e.target.value })} className={`${INPUT} ${errCls(E('name'))}`} />
              </span>
              <ErrText e={E('name')} />
            </>
          ),
        },
        { label: lb('Chức danh', true), value: text(f.title, (v) => set({ title: v }), E('title'), 'VD: Phó Giám đốc') },
      ],
      right: [
        { label: 'Giấy uỷ quyền', value: text(f.authorization, (v) => set({ authorization: v }), E('authorization'), 'Số / ngày giấy uỷ quyền — để trống nếu là người đại diện theo pháp luật') },
        {
          label: 'Người ký mặc định',
          value: (
            <span className="flex items-center gap-2">
              <CheckBox checked={f.isDefault} onChange={(b) => set({ isDefault: b })} /> Chọn sẵn cho hợp đồng của công ty này
            </span>
          ),
        },
        { label: 'Trạng thái', value: activeCheck(f.active, (b) => set({ active: b }), E('active')) },
        { label: 'Ghi chú', value: <textarea rows={2} value={f.note} onChange={(e) => set({ note: e.target.value })} className={`${INPUT} h-auto py-1.5 resize-y`} /> },
      ],
    }),
    validate: (f, list, old) => {
      const e: Record<string, string> = {};
      if (!f.companyId) e.companyId = 'Bắt buộc';
      if (!f.title.trim()) e.title = 'Bắt buộc';
      if (f.name.trim() && list.some((x) => x.id !== f.id && x.companyId === f.companyId && x.name.trim().toLowerCase() === f.name.trim().toLowerCase())) e.name = 'Công ty này đã có người ký trùng tên';
      if (f.isDefault && !f.active) e.active = 'Người ký mặc định phải đang sử dụng';
      if (old?.isDefault && old.companyId === f.companyId && (!f.isDefault || !f.active)) e.active = 'Mỗi công ty cần 1 người ký mặc định — chọn người ký mặc định khác thay thế trước';
      if (!f.active && cs.signers.some((x) => x.signerId === f.id)) e.active = 'Đang dùng trong Thiết lập người ký — đổi thiết lập trước khi ngừng sử dụng';
      return e;
    },
    save: (f, old) => {
      const clean = { ...f, title: f.title.trim(), authorization: f.authorization.trim() };
      const noDefault = !cat.signers.some((x) => x.id !== f.id && x.companyId === f.companyId && x.isDefault && x.active);
      if (noDefault && clean.active) clean.isDefault = true; // công ty chưa có người ký mặc định → người này
      updateCatalog((c) => {
        let list = old ? c.signers.map((x) => (x.id === f.id ? clean : x)) : [...c.signers, clean];
        if (clean.isDefault) list = list.map((x) => (x.id !== clean.id && x.companyId === clean.companyId ? { ...x, isDefault: false } : x));
        return { ...c, signers: list };
      });
      return old ? `Đã lưu người ký ${f.name}` : `Đã thêm người ký ${f.name} (${coName(f.companyId)})`;
    },
    usedBy: (x) => {
      const n = countBy.bySigner.get(x.id) || 0;
      const st = cs.signers.filter((y) => y.signerId === x.id).length;
      return [n && `đã ký ${n} hợp đồng`, st && `dùng trong ${st} thiết lập người ký`, x.isDefault && 'là người ký mặc định của công ty'].filter(Boolean).join(', ');
    },
    remove: (x) => updateCatalog((c) => ({ ...c, signers: c.signers.filter((y) => y.id !== x.id) })),
  };

  return (
    <ErpPage>
      {toast}
      <ErpTitleBar
        crumbs={CRUMBS}
        title="Danh mục hợp đồng"
        meta={[
          { label: 'Loại hợp đồng', value: `${cat.types.filter((t) => t.active).length} đang sử dụng / ${cat.types.length}` },
          { label: 'Công ty', value: `${cat.companies.filter((t) => t.active).length} đang sử dụng / ${cat.companies.length}` },
          { label: 'Người ký', value: `${cat.signers.filter((t) => t.active).length} đang sử dụng / ${cat.signers.length}` },
          { label: 'Loại phụ lục', value: `${cat.appendix.filter((t) => t.active).length} đang sử dụng / ${cat.appendix.length}` },
          { label: 'Công ty mặc định', value: cat.companies.find((c) => c.isDefault)?.shortName || '—' },
        ]}
      />
      <div>
        <FolderTabs
          tabs={[
            { key: 'types', label: `Loại hợp đồng (${cat.types.length})`, icon: FileSignature },
            { key: 'companies', label: `Công ty (${cat.companies.length})`, icon: Building2 },
            { key: 'signers', label: `Người ký (${cat.signers.length})`, icon: PenLine },
            { key: 'appendix', label: `Loại phụ lục hợp đồng (${cat.appendix.length})`, icon: FilePlus2 },
          ]}
          value={tab}
          onChange={setTab}
        />
        {tab === 'types' && <CatalogTab key="t" cfg={typesCfg} flash={flash} />}
        {tab === 'companies' && <CatalogTab key="c" cfg={companiesCfg} flash={flash} />}
        {tab === 'signers' && <CatalogTab key="s" cfg={signersCfg} flash={flash} />}
        {tab === 'appendix' && <CatalogTab key="a" cfg={appendixCfg} flash={flash} />}
      </div>
    </ErpPage>
  );
};
