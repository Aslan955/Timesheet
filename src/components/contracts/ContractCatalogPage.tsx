/**
 * ContractCatalogPage — "Danh mục hợp đồng" (Human Resources): 3 danh mục dùng cho màn Hợp đồng lao động.
 *  - Loại hợp đồng : mã, tên, nhóm (Thử việc / Xác định thời hạn / Không xác định thời hạn), thời hạn cho phép, thời hạn mặc định,
 *                    mức hưởng mặc định, bảo hiểm mặc định, thứ tự, trạng thái. Đổi tên → cập nhật các HĐ đang dùng.
 *  - Công ty       : pháp nhân ký HĐ — MST, địa chỉ, người đại diện, tài khoản, công ty mặc định.
 *  - Loại phụ lục  : mã, tên, nội dung điều chỉnh.
 * Thêm / sửa trong popup; xoá có xác nhận; mục đang được dùng chỉ được ngừng sử dụng.
 */
import { createPortal } from 'react-dom';
import React, { useMemo, useState } from 'react';
import { AlertTriangle, Building2, Check, PenLine, FilePlus2, FileSignature, FileSpreadsheet, Plus, Save, Search, Trash2, X } from 'lucide-react';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, Panel, Tag, erp } from '../erp/Erp';
import { ColumnFilterBar, useColumnFilters } from '../erp/ColumnFilter';
import { CheckBox, InfoGrid, useEmployees, type InfoItem } from '../EmployeePage';
import { getContractStore, renameContractType, useContractStore } from '../ContractsPage';
import {
  APPENDIX_FIELDS, BIZ_BY_KIND, defaultBiz, KINDS, KIND_CLS, KIND_LABEL, KIND_MAX, TERM_OPTIONS, termLabel, findTemplate, empInCompany, removeCompanyDef, saveCompanyDef, signingCompanies, getCatalog, updateCatalog, useCatalog, addCatalogHistory, useCatalogHistory,
  type AppendixTypeDef, type CompanyDef, type BizType, type ContractTypeDef, type Kind, type SignerDef,
} from './catalog';
import { ACTIVE_TAG, ErrText, INACTIVE_TAG, INPUT, LINK, ME, errCls, exportSheet, fmtAt, lb, uid, useFlash } from './ui';

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
  /** Kiểm xung đột sửa đồng thời: trả thông báo lỗi nếu bản ghi đã đổi/xoá so với ver lúc mở */
  stale?: (id: string, ver?: number) => string;
  remove: (x: T) => void;
  hint: string;
  exportName: string;
  search: (x: T) => string;
  /** false: cho phép trùng tên (vd người ký cùng tên ở 2 công ty) — tự kiểm tra trong validate */
  uniqueName?: boolean;
  /** false: ẩn nút Thêm (danh mục lấy nguồn từ nơi khác) */
  canAdd?: boolean;
  /** true: cố định STT, Mã, Tên ở trái và Thao tác ở phải khi cuộn ngang */
  freeze?: boolean;
}

// Nhãn tiếng Việt của trường theo từng danh mục (đúng nhãn trên form); thiếu thì dùng khoá
const FIELD_LABEL: Record<string, Record<string, string>> = {
  'loại hợp đồng': { code: 'Mã', name: 'Tên loại hợp đồng', kind: 'Nhóm', bizType: 'Loại nghiệp vụ', suffix: 'Ký hiệu số HĐ', terms: 'Thời hạn cho phép', defTerm: 'Thời hạn mặc định', rate: 'Mức hưởng mặc định (%)', insurance: 'Bảo hiểm mặc định', order: 'Thứ tự hiển thị', active: 'Trạng thái', note: 'Ghi chú' },
  'công ty': { signsContract: 'Ký hợp đồng', code: 'Mã', name: 'Tên công ty', shortName: 'Tên viết tắt', contractCode: 'Ký hiệu trên số HĐ', taxCode: 'Mã số thuế', address: 'Địa chỉ', phone: 'Điện thoại', email: 'Email', legalRep: 'Người đại diện', legalRepSalutation: 'Danh xưng', legalRepTitle: 'Chức vụ', bankAccount: 'Số tài khoản', bankName: 'Ngân hàng', isDefault: 'Công ty mặc định', active: 'Trạng thái', note: 'Ghi chú' },
  'người ký': { code: 'Mã', companyId: 'Công ty', name: 'Người ký', salutation: 'Danh xưng', employeeCode: 'Nhân viên', title: 'Chức danh', authorization: 'Giấy uỷ quyền', isDefault: 'Người ký mặc định', active: 'Trạng thái', note: 'Ghi chú' },
  'loại phụ lục': { code: 'Mã', name: 'Tên loại phụ lục', changes: 'Nội dung điều chỉnh', order: 'Thứ tự hiển thị', active: 'Trạng thái', note: 'Ghi chú' },
};
const fmtVal = (k: string, v: unknown): string => {
  if (k === 'active') return v ? 'Đang sử dụng' : 'Ngừng sử dụng';
  if (k === 'kind') return KIND_LABEL[v as Kind] || String(v);
  if (k === 'companyId') return getCatalog().companies.find((c) => c.id === v)?.shortName || String(v ?? '') || '(trống)';
  if (k === 'defTerm') return v ? termLabel(v as number) : '(trống)';
  if (k === 'terms' && Array.isArray(v)) return v.length ? v.map((m) => termLabel(m as number)).join(', ') : '(trống)';
  if (k === 'rate') return `${v}%`;
  return typeof v === 'boolean' ? (v ? 'Có' : 'Không') : Array.isArray(v) ? v.join(', ') || '(trống)' : v && typeof v === 'object' ? JSON.stringify(v) : String(v ?? '') || '(trống)';
};
const HIDDEN_KEYS = ['id', 'ver']; // khoá kỹ thuật, không đưa vào diff lịch sử
/** Ghi 1 dòng lịch sử cho mục danh mục (old rỗng: Thêm). */
export const logHistory = (noun: string, f: Item, old?: Item) => {
  const rec = f as unknown as Record<string, unknown>;
  const orec = old as unknown as Record<string, unknown> | undefined;
  const lab = (k: string) => FIELD_LABEL[noun]?.[k] || k;
  const changes = orec
    ? Object.keys(rec).filter((k) => !HIDDEN_KEYS.includes(k) && JSON.stringify(rec[k]) !== JSON.stringify(orec[k])).map((k) => ({ field: lab(k), from: fmtVal(k, orec[k]), to: fmtVal(k, rec[k]), raw: k }))
    : Object.keys(rec).filter((k) => !HIDDEN_KEYS.includes(k) && rec[k] !== '' && !(Array.isArray(rec[k]) && !(rec[k] as unknown[]).length)).map((k) => ({ field: lab(k), from: '', to: fmtVal(k, rec[k]), raw: k }));
  const onlyActive = old && changes.length === 1 && changes[0].raw === 'active';
  addCatalogHistory({ key: `${noun}:${f.id}`, by: ME, action: !old ? 'Thêm' : onlyActive ? (f.active ? 'Kích hoạt lại' : 'Ngừng sử dụng') : 'Sửa', changes: changes.map(({ raw, ...c }) => c) });
};
/** Ghi lịch sử xoá mục danh mục. */
export const logHistoryDelete = (noun: string, id: string) => addCatalogHistory({ key: `${noun}:${id}`, by: ME, action: 'Xoá', changes: [] });

/** Popup lịch sử thay đổi của 1 mục danh mục. */
export const CatalogHistoryDialog: React.FC<{ noun: string; item: Item; onClose: () => void }> = ({ noun, item, onClose }) => {
  const hist = useCatalogHistory();
  const list = hist.filter((h) => h.key === `${noun}:${item.id}`);
  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center overflow-auto bg-slate-900/40 p-4" role="dialog" aria-modal="true">
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-[760px] flex-col overflow-hidden rounded-md border border-slate-300 bg-white shadow-2xl">
        <div className="border-b border-slate-200 bg-[#eef4fb] px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-[#1e3a5f]">Lịch sử — {item.code} — {item.name}</div>
        <div className="min-h-0 flex-1 overflow-auto">
          {list.length ? (
            <table className={erp.table}>
              <thead>
                <tr>
                  {['Thời điểm', 'Người', 'Thao tác', 'Nội dung thay đổi'].map((h) => (
                    <th key={h} className={`${erp.th} text-left`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list.map((h) => (
                  <tr key={h.id} className={erp.tr}>
                    <td className={`${erp.td} whitespace-nowrap`}>{fmtAt(h.at)}</td>
                    <td className={erp.td}>{h.by}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{h.action}</td>
                    <td className={erp.td}>
                      {h.changes.map((c) => (
                        <div key={c.field}>{c.field}: {h.action === 'Thêm' ? c.to : `${c.from} → ${c.to}`}</div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-3 py-10 text-center text-slate-400">Chưa có thay đổi nào</div>
          )}
        </div>
        <div className="flex justify-end border-t border-slate-200 bg-[#f7faff] px-3 py-2">
          <Btn icon={X} className="h-8" onClick={onClose}>
            Đóng
          </Btn>
        </div>
      </div>
    </div>,
    document.body,
  );
};

function CatalogTab<T extends Item>({ cfg, flash }: { cfg: TabCfg<T>; flash: (m: string) => void; key?: string }) {
  const [q, setQ] = useState('');
  const [st, setSt] = useState<'' | 'on' | 'off'>('');
  const [form, setForm] = useState<{ f: T; old?: T } | null>(null);
  const [tried, setTried] = useState(false);
  const [delId, setDelId] = useState<string | null>(null);
  const [delVer, setDelVer] = useState<number | undefined>();
  const [conflict, setConflict] = useState('');
  const [histOf, setHistOf] = useState<T | null>(null);
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
    if (!form) return;
    const stale = form.old && cfg.stale?.(form.old.id, (form.old as { ver?: number }).ver);
    if (stale) return setConflict(stale);
    if (Object.keys(errs).length) return;
    const f = { ...form.f, code: form.f.code.trim(), name: form.f.name.trim() };
    flash(cfg.save(f, form.old));
    logHistory(cfg.noun, f, form.old);
    setForm(null);
    setTried(false);
  };
  // Tải lại: mở lại popup với dữ liệu mới nhất (bản ghi bị xoá thì đóng)
  const reload = () => {
    const cur = form && cfg.items.find((x) => x.id === form.f.id);
    setConflict('');
    setTried(false);
    setForm(cur ? { f: structuredClone(cur), old: cur } : null);
  };
  const fm = form ? cfg.form(form.f, set, E, !form.old) : null;
  const th = `${erp.th} border-t-0 text-left`;
  // cột cố định khi cuộn ngang: STT (48px) + Mã (96px) + Tên ở trái, Thao tác ở phải
  const fz = !!cfg.freeze;
  const L = ['left-0', 'left-[48px]', 'left-[144px] shadow-[2px_0_0_#cbd5e1]'];
  const stkH = (k: number | 'r') => (!fz ? '' : k === 'r' ? 'sticky right-0 z-20 shadow-[-2px_0_0_#cbd5e1]' : k < 3 ? `sticky ${L[k]} z-20` : '');
  const stkD = (k: number | 'r') => (!fz ? '' : k === 'r' ? 'sticky right-0 z-10 shadow-[-2px_0_0_#cbd5e1] bg-white group-even:bg-slate-50 group-hover:bg-[#eaf2fc]' : k < 3 ? `sticky ${L[k]} z-10 bg-white group-even:bg-slate-50 group-hover:bg-[#eaf2fc]` : '');
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
            {cfg.canAdd !== false && (
              <Btn variant="primary" icon={Plus} className="h-7" onClick={() => (setForm({ f: cfg.blank() }), setTried(false), setConflict(''), setDelId(null))}>
                Thêm {cfg.noun}
              </Btn>
            )}
          </>
        }
        footer={`${rows.length} / ${cfg.items.length} ${cfg.noun} · ${cfg.hint}`}
      >
        {form && fm && createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-auto bg-slate-900/40 p-4" role="dialog" aria-modal="true">
            <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-[1000px] flex-col overflow-hidden rounded-md border border-slate-300 bg-white shadow-2xl">
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-[#eef4fb] px-3 py-2">
                <span className="text-[12px] font-bold uppercase tracking-wide text-[#1e3a5f]">{form.old ? `Sửa ${cfg.noun}: ${form.old.name}` : `Thêm ${cfg.noun}`}</span>
                {tried && nErr > 0 && !conflict && <span className="text-[12px] text-rose-600">· Còn {nErr} trường chưa hợp lệ (đánh dấu đỏ)</span>}
              </div>
              <div className="min-h-0 flex-1 overflow-auto bg-white">
                <InfoGrid left={fm.left} right={fm.right} labelW={[168, 168]} />
              </div>
              {conflict && (
                <div className="flex items-center gap-2 border-t border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] font-bold text-rose-700">
                  <AlertTriangle size={14} className="shrink-0" />
                  <span className="flex-1">{conflict}</span>
                  <Btn className="h-7" onClick={reload}>Tải lại</Btn>
                </div>
              )}
              <div className="flex justify-end gap-2 border-t border-slate-200 bg-[#f7faff] px-3 py-2">
                <Btn icon={X} className="h-8" onClick={() => (setForm(null), setTried(false), setConflict(''))}>
                  Huỷ
                </Btn>
                <Btn variant="primary" icon={Save} className="h-8" onClick={save}>
                  Lưu
                </Btn>
              </div>
            </div>
          </div>
          , document.body)}
        {histOf && <CatalogHistoryDialog noun={cfg.noun} item={histOf} onClose={() => setHistOf(null)} />}
        <ColumnFilterBar active={colF.active} filters={colF.filters} labelOf={(k) => k} onRemove={(k) => colF.set(k, [])} onClear={colF.clear} />
        <div className="overflow-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${th} border-l-0 w-12 min-w-[48px] !text-center ${stkH(0)}`}>STT</th>
                {cfg.cols.map((c, ci) => (
                  <th key={c.label} className={`${th} ${c.cls || ''} ${stkH(ci + 1)}`}>
                    <div className="flex items-center gap-1">
                      <span className="flex-1 min-w-0">{c.label}</span>
                      {colF.funnel(c.label, c.label)}
                    </div>
                  </th>
                ))}
                <th className={`${th} w-36 whitespace-nowrap`}>
                  <div className="flex items-center gap-1">
                    <span className="flex-1 min-w-0">Trạng thái</span>
                    {colF.funnel('Trạng thái', 'Trạng thái')}
                  </div>
                </th>
                <th className={`${th} border-r-0 w-36 !text-center ${stkH('r')}`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x, i) => {
                const used = cfg.usedBy(x);
                return (
                  <React.Fragment key={x.id}>
                    <tr className={`group ${form?.f.id === x.id ? 'bg-[#dbe8f8]' : erp.tr}`}>
                      <td className={`${erp.td} border-l-0 text-center text-slate-500 ${stkD(0)}`}>{i + 1}</td>
                      {cfg.cols.map((c, ci) => (
                        <td key={c.label} className={`${erp.td} ${c.cls || ''} ${stkD(ci + 1)}`}>
                          {c.cell(x)}
                        </td>
                      ))}
                      <td className={`${erp.td} whitespace-nowrap`}>
                        <Tag cls={x.active ? ACTIVE_TAG : INACTIVE_TAG}>{x.active ? 'Đang sử dụng' : 'Ngừng sử dụng'}</Tag>
                      </td>
                      <td className={`${erp.td} border-r-0 text-center whitespace-nowrap ${stkD('r')}`}>
                        <span className="inline-flex items-center gap-2">
                          <button type="button" className={LINK} onClick={() => setHistOf(x)}>
                            Lịch sử
                          </button>
                          <button type="button" className={LINK} onClick={() => (setForm({ f: structuredClone(x), old: x }), setTried(false), setConflict(''), setDelId(null))}>
                            Sửa
                          </button>
                          <button type="button" className={`${LINK} !text-rose-600`} onClick={() => (setDelVer((x as { ver?: number }).ver), setDelId(delId === x.id ? null : x.id))}>
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
                                      const st = cfg.stale?.(x.id, delVer);
                                      if (st) return flash(st);
                                      const f = { ...x, active: false };
                                      const e = cfg.validate(f, cfg.items, x);
                                      if (e.active) return flash(e.active);
                                      flash(cfg.save(f, x));
                                      logHistory(cfg.noun, f, x);
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
                                <Btn variant="danger" icon={Trash2} className="h-7 !bg-rose-600 !text-white !border-rose-700" onClick={() => { const st = cfg.stale?.(x.id, delVer); if (st) return flash(st); cfg.remove(x), logHistoryDelete(cfg.noun, x.id), setDelId(null), flash(`Đã xoá ${cfg.noun} ${x.name}`); }}>
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
  const emps = useEmployees();
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
  /** Template hiệu lực theo từng công ty ký HĐ (riêng ưu tiên chung): "<tên> (<công ty>)", công ty còn thiếu ghi riêng. */
  const tplCov = (kind: 'HD' | 'PL', id: string) => {
    const cos = signingCompanies();
    const by = new Map<string, { name: string; cos: string[] }>();
    const miss: string[] = [];
    for (const co of cos) {
      const t = findTemplate(kind, id, co.id);
      if (!t) miss.push(co.shortName);
      else by.set(t.id, { name: t.name, cos: [...(by.get(t.id)?.cos || []), co.shortName] });
    }
    const ok = [...by.values()].map((x) => `${x.name} (${cos.length > 1 && x.cos.length === cos.length ? 'tất cả công ty' : x.cos.join(', ')})`);
    return { ok, miss: miss.map((m) => `${m}: ${kind === 'HD' ? 'in mặc định' : 'chưa có'}`) };
  };
  const tplNames = (kind: 'HD' | 'PL', id: string) => {
    const v = tplCov(kind, id);
    return [...v.ok, ...v.miss];
  };
  const tplCell = (kind: 'HD' | 'PL', id: string) => {
    const v = tplCov(kind, id);
    return (
      <span className="flex flex-col">
        {v.ok.map((x) => (
          <span key={x}>{x}</span>
        ))}
        {v.miss.map((x) => (
          <span key={x} className="text-amber-700">
            {x}
          </span>
        ))}
      </span>
    );
  };
  /** Số template (chưa xoá, kể cả ngừng sử dụng) tham chiếu loại HĐ / loại phụ lục → không cho xoá loại đó */
  const tplRefs = (kind: 'HD' | 'PL', id: string) => cat.templates.filter((t) => (kind === 'PL' ? t.kind === 'PL' : t.kind !== 'PL') && t.appliesTo.includes(id)).length;
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
    blank: () => ({ id: `ct-${uid()}`, code: '', name: '', kind: 'XD', bizType: 'Xác định thời hạn', suffix: '', terms: [12], defTerm: 12, rate: 100, insurance: true, order: cat.types.length + 1, active: true, note: '' }),
    search: (x) => `${x.code} ${x.name} ${KIND_LABEL[x.kind]} ${x.bizType}`,
    hint: 'Nhóm quyết định quy tắc: không xác định thời hạn thì không có ngày hết hạn; tái ký Thử việc → Xác định thời hạn → Không xác định thời hạn',
    freeze: true,
    exportName: 'danh-muc-loai-hop-dong.xlsx',
    cols: [
      { label: 'Mã', cls: 'w-24 whitespace-nowrap', cell: (x) => <span className={`${erp.code} font-semibold`}>{x.code}</span>, xlsx: (x) => x.code },
      { label: 'Tên loại hợp đồng', cell: (x) => <b className="text-slate-800">{x.name}</b>, xlsx: (x) => x.name },
      { label: 'Nhóm', cls: 'w-40', cell: (x) => <Tag cls={KIND_CLS[x.kind]}>{x.kind === 'OTHER' ? 'Khác' : KIND_LABEL[x.kind]}</Tag>, xlsx: (x) => KIND_LABEL[x.kind] },
      { label: 'Loại nghiệp vụ', cls: 'whitespace-nowrap', cell: (x) => x.bizType, xlsx: (x) => x.bizType },
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
                    set({ kind: k, bizType: BIZ_BY_KIND[k].includes(f.bizType) ? f.bizType : defaultBiz(k), terms, defTerm: k === 'KXD' ? 0 : terms.includes(f.defTerm) ? f.defTerm : terms[0], rate: k === 'TV' ? 85 : f.rate, insurance: k === 'TV' ? false : f.insurance });
                  }}
                  className={INPUT}
                >
                  {KINDS.map((k) => (
                    <option key={k} value={k}>
                      {KIND_LABEL[k]}
                    </option>
                  ))}
                </select>
                {!!used && <span className="text-[11px] text-slate-500 mt-0.5">Đang dùng cho {used} hợp đồng — không đổi nhóm, loại nghiệp vụ</span>}
                <ErrText e={E('kind')} />
              </>
            ),
          },
          {
            label: lb('Loại nghiệp vụ', true),
            value: (
              <>
                <select value={f.bizType} disabled={!!used || BIZ_BY_KIND[f.kind].length === 1} onChange={(e) => set({ bizType: e.target.value as BizType })} className={`${INPUT} ${errCls(E('bizType'))}`}>
                  {BIZ_BY_KIND[f.kind].map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <ErrText e={E('bizType')} />
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
                  <span className="grid w-full grid-cols-3 gap-x-4 gap-y-1.5">
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
      if (!f.bizType) e.bizType = 'Bắt buộc';
      else if (!BIZ_BY_KIND[f.kind].includes(f.bizType)) e.bizType = 'Loại nghiệp vụ không khớp nhóm';
      else if (old && old.bizType !== f.bizType && (countBy.byType.get(old.name) || 0) > 0) e.bizType = 'Đang có hợp đồng dùng loại này — không đổi loại nghiệp vụ';
      if (old && old.kind !== f.kind && (countBy.byType.get(old.name) || 0) > 0) e.kind = 'Đang có hợp đồng dùng loại này — không đổi nhóm';
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
      const t = tplRefs('HD', x.id);
      return [n && `đang dùng cho ${n} hợp đồng`, t && `đang gắn ${t} template`].filter(Boolean).join(', ');
    },
    remove: (x) => updateCatalog((c) => ({ ...c, types: c.types.filter((t) => t.id !== x.id) })),
  };

  // ---------------- Công ty
  const empCount = (x: CompanyDef) => emps.filter((e) => e.status !== 'Đã nghỉ việc' && empInCompany(e, x)).length;
  const companiesCfg: TabCfg<CompanyDef> = {
    title: 'Danh mục công ty',
    noun: 'công ty',
    icon: Building2,
    items: cat.companies,
    blank: () => ({ id: '', code: '', name: '', shortName: '', contractCode: '', legalRepSalutation: 'Ông', taxCode: '', address: '', phone: '', email: '', legalRep: '', legalRepTitle: 'Giám đốc', bankAccount: '', bankName: '', isDefault: false, active: true, signsContract: true, note: '' }),
    search: (x) => `${x.code} ${x.name} ${x.shortName} ${x.taxCode} ${x.legalRep}`,
    hint: 'Danh sách lấy từ Catalog › Company; muốn thêm pháp nhân mới, tạo ở Catalog › Company rồi bật cờ Ký hợp đồng bằng Sửa. Sửa trường chung (Mã, Tên, MST, địa chỉ, liên hệ, người đại diện, tài khoản, trạng thái) sẽ ghi ngược Catalog › Company. Ký hiệu số HĐ, danh xưng, chức vụ, công ty mặc định chỉ dùng cho hợp đồng.',
    canAdd: false,
    freeze: true,
    exportName: 'danh-muc-cong-ty.xlsx',
    cols: [
      { label: 'Mã', cls: 'w-24 whitespace-nowrap', cell: (x) => <span className={`${erp.code} font-semibold`}>{x.code}</span>, xlsx: (x) => x.code },
      {
        label: 'Tên công ty',
        cell: (x) => (
          <span className="flex flex-nowrap items-center gap-1.5 min-w-[220px] max-w-[300px]">
            <b className="text-slate-800 truncate" title={x.name}>{x.name}</b>
            {x.isDefault && <Tag cls="bg-amber-50 text-amber-700 border-amber-300 shrink-0 whitespace-nowrap">Mặc định</Tag>}
          </span>
        ),
        xlsx: (x) => x.name,
      },
      { label: 'Ký HĐ', cls: 'w-14 text-center', cell: (x) => (x.signsContract ? '✓' : '—'), xlsx: (x) => (x.signsContract ? 'Có' : 'Không') },
      { label: 'Tên viết tắt', cls: 'whitespace-nowrap', cell: (x) => x.shortName, xlsx: (x) => x.shortName },
      { label: 'Ký hiệu số HĐ', cls: 'whitespace-nowrap', cell: (x) => <span className="font-mono text-slate-600">«Mã_NV»/<b className="text-slate-800">{x.contractCode}</b>/…</span>, xlsx: (x) => x.contractCode },
      { label: 'Mã số thuế', cls: 'w-28 font-mono whitespace-nowrap', cell: (x) => x.taxCode || <span className="text-amber-700 font-sans">Chưa có</span>, xlsx: (x) => x.taxCode },
      { label: 'Địa chỉ', cell: (x) => <span className="block max-w-[260px] truncate" title={x.address}>{x.address}</span>, xlsx: (x) => x.address },
      { label: 'Người đại diện', cls: 'whitespace-nowrap', cell: (x) => (x.legalRep ? <>{x.legalRepSalutation} {x.legalRep} <span className="text-slate-500">— {x.legalRepTitle}</span></> : '—'), xlsx: (x) => `${x.legalRepSalutation} ${x.legalRep} — ${x.legalRepTitle}` },
      { label: 'Điện thoại', cls: 'whitespace-nowrap', cell: (x) => x.phone, xlsx: (x) => x.phone },
      { label: 'Số HĐ', cls: 'w-16 text-right', cell: (x) => countBy.byCo.get(x.id) || 0, xlsx: (x) => countBy.byCo.get(x.id) || 0 },
      { label: 'Số nhân viên', cls: 'w-24 text-right', cell: (x) => empCount(x), xlsx: (x) => empCount(x) },
    ],
    form: (f, set, E) => {
      return {
      left: [
        {
          label: 'Ký hợp đồng',
          value: (
            <>
              <span className="flex items-center gap-2">
                <CheckBox checked={f.signsContract} onChange={(b) => set({ signsContract: b })} /> Pháp nhân dùng làm Bên A trên hợp đồng lao động
              </span>
              <ErrText e={E('signsContract')} />
            </>
          ),
        },
        { label: lb('Mã', true), value: text(f.code, (v) => set({ code: v.toUpperCase() }), E('code'), 'VD: AEQ') },
        { label: lb('Tên công ty', true), value: text(f.name, (v) => set({ name: v.toUpperCase() }), E('name'), 'Tên đầy đủ theo đăng ký kinh doanh') },
        { label: 'Tên viết tắt', value: text(f.shortName, (v) => set({ shortName: v })) },
        {
          label: lb('Ký hiệu trên số HĐ', true),
          value: (
            <>
              <span className="flex items-center gap-1.5 w-full">
                <span className="font-mono text-slate-500">«Mã_NV»/</span>
                <input value={f.contractCode} placeholder="VD: AEQ" onChange={(e) => set({ contractCode: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '') })} className={`${INPUT} font-mono w-40 ${errCls(E('contractCode'))}`} />
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
      };
    },
    validate: (f, list, old) => {
      const e: Record<string, string> = {};
      if (f.signsContract && !f.contractCode) e.contractCode = 'Bắt buộc — dùng tạo số hợp đồng';
      else if (f.contractCode && list.some((x) => x.id !== f.id && x.contractCode === f.contractCode)) e.contractCode = 'Ký hiệu đã dùng cho công ty khác';
      if (!f.taxCode) {
        /* chưa có MST: cho phép lưu, hiển thị "Chưa có" */
      } else if (!/^\d{10}(-\d{3})?$/.test(f.taxCode)) e.taxCode = 'Mã số thuế gồm 10 số (hoặc 10 số-3 số với chi nhánh)';
      else if (list.some((x) => x.id !== f.id && x.taxCode === f.taxCode)) e.taxCode = 'Mã số thuế đã tồn tại';
      if (f.signsContract && !f.address.trim()) e.address = 'Bắt buộc';
      if (f.signsContract && !f.legalRep.trim()) e.legalRep = 'Bắt buộc';
      if (f.signsContract && !f.legalRepTitle.trim()) e.legalRepTitle = 'Bắt buộc';
      if (f.signsContract && !f.active && !old?.signsContract) e.signsContract = 'Công ty đã ngừng sử dụng không thể bật cờ Ký hợp đồng — tích "Đang sử dụng" trước';
      if (f.isDefault && !f.signsContract) e.signsContract = 'Công ty mặc định phải có cờ "Ký hợp đồng"';
      if (old?.signsContract && !f.signsContract) {
        if (old.isDefault) e.signsContract = 'Không bỏ cờ của công ty mặc định — chọn công ty mặc định khác trước';
      }
      const nSg = cat.signers.filter((x) => x.companyId === f.id && x.active).length;
      if (nSg && old?.signsContract && !f.signsContract) e.signsContract = `Công ty còn ${nSg} người ký đang sử dụng — ngừng/chuyển người ký trước`;
      if (nSg && old?.active && !f.active) e.active = `Công ty còn ${nSg} người ký đang sử dụng — ngừng/chuyển người ký trước`;
      if (f.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) e.email = 'Email không hợp lệ';
      if (f.isDefault && !f.active) e.active = 'Công ty mặc định phải đang sử dụng';
      if (old?.isDefault && !f.isDefault) e.active = 'Phải có 1 công ty mặc định — chọn công ty mặc định khác thay thế';
      if (!f.active && !list.some((x) => x.id !== f.id && x.active)) e.active = 'Phải còn ít nhất 1 công ty đang sử dụng';
      return e;
    },
    save: (f, old) => {
      // đặt mặc định mới → công ty mặc định cũ bị bỏ mặc định: ghi lịch sử cho công ty đó
      const prevDef = f.isDefault ? cat.companies.find((x) => x.id !== f.id && x.isDefault) : undefined;
      saveCompanyDef(f); // trường dùng chung ghi ngược về Catalog > Company
      if (prevDef) logHistory('công ty', { ...prevDef, isDefault: false }, prevDef);
      if (!old) return `Đã thêm công ty ${f.name} vào danh mục hợp đồng và cập nhật Catalog › Company (bật Ký hợp đồng)`;
      const shared: (keyof CompanyDef)[] = ['code', 'name', 'shortName', 'taxCode', 'address', 'phone', 'email', 'legalRep', 'bankAccount', 'bankName', 'active', 'signsContract'];
      return shared.some((k) => old[k] !== f[k]) ? `Đã lưu công ty ${f.name} và cập nhật Catalog › Company` : `Đã lưu công ty ${f.name}`;
    },
    usedBy: (x) => {
      const n = countBy.byCo.get(x.id) || 0;
      const t = cat.templates.filter((tp) => tp.companyIds.includes(x.id)).length;
      const sg = cat.signers.filter((y) => y.companyId === x.id && y.active).length;
      const ne = emps.filter((e) => empInCompany(e, x)).length;
      return [n && `đang dùng cho ${n} hợp đồng`, ne && `có ${ne} nhân viên (kể cả đã nghỉ việc)`, t && `có ${t} template riêng`, sg && `có ${sg} người ký đang sử dụng`, x.isDefault && 'là công ty mặc định'].filter(Boolean).join(', ');
    },
    remove: (x) => removeCompanyDef(x.id),
    stale: (id, ver) => {
      const cur = getCatalog().companies.find((c) => c.id === id);
      return !cur ? 'Công ty đã bị xoá, tải lại' : cur.ver !== ver ? 'Dữ liệu công ty đã thay đổi, tải lại rồi thử lại' : '';
    },
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
    freeze: true,
    exportName: 'danh-muc-loai-phu-luc.xlsx',
    cols: [
      { label: 'Mã', cls: 'w-24 whitespace-nowrap', cell: (x) => <span className={`${erp.code} font-semibold`}>{x.code}</span>, xlsx: (x) => x.code },
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
    usedBy: (x) => {
      const t = tplRefs('PL', x.id);
      return t ? `đang gắn ${t} template` : '';
    },
    remove: (x) => updateCatalog((c) => ({ ...c, appendix: c.appendix.filter((a) => a.id !== x.id) })),
  };

  // ---------------- Người ký (1 công ty có nhiều người ký) — chọn từ danh sách nhân viên (Employees)
  const properName = (s: string) =>
    s
      .trim()
      .toLocaleLowerCase('vi')
      .split(/\s+/)
      .map((w) => w.charAt(0).toLocaleUpperCase('vi') + w.slice(1))
      .join(' ');
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
    freeze: true,
    exportName: 'danh-muc-nguoi-ky.xlsx',
    cols: [
      { label: 'Mã', cls: 'w-24 whitespace-nowrap', cell: (x) => <span className={`${erp.code} font-semibold`}>{x.code}</span>, xlsx: (x) => x.code },
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
            <span className="basis-full text-[11.5px] text-slate-500">{x.employeeCode ? `${x.employeeCode} · ${emps.find((m) => m.code === x.employeeCode)?.companyEmail || ''}` : 'Chưa liên kết nhân viên'}</span>
          </span>
        ),
        xlsx: (x) => `${x.salutation} ${x.name}`,
      },
      { label: 'Mã NV', cls: 'hidden', cell: () => null, xlsx: (x) => x.employeeCode || '' },
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
                  .filter((c) => (c.active && c.signsContract) || c.id === f.companyId)
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
                <select value={f.salutation} onChange={(e) => set({ salutation: e.target.value })} className={`${INPUT} !w-[72px] shrink-0`}>
                  <option>Ông</option>
                  <option>Bà</option>
                </select>
                <select
                  value={f.employeeCode || ''}
                  onChange={(e) => {
                    const emp = emps.find((x) => x.code === e.target.value);
                    if (!emp) return set({ employeeCode: undefined });
                    set({ employeeCode: emp.code, name: properName(emp.fullName), salutation: emp.gender === 'Nữ' ? 'Bà' : 'Ông', title: f.title.trim() ? f.title : emp.position });
                  }}
                  className={`${INPUT} ${errCls(E('name'))}`}
                  data-testid="signer-employee"
                >
                  <option value="">{f.name && !f.employeeCode ? `${f.name} (chưa liên kết nhân viên) — chọn lại` : '— Chọn nhân viên —'}</option>
                  {emps
                    .filter((x) => x.status !== 'Đã nghỉ việc' || x.code === f.employeeCode)
                    .map((x) => (
                      <option key={x.code} value={x.code}>
                        {properName(x.fullName)} — {x.code} · {x.position} · {x.companyEmail}
                      </option>
                    ))}
                </select>
              </span>
              {(() => {
                const emp = emps.find((x) => x.code === f.employeeCode);
                return emp ? (
                  <span className="block text-[11.5px] text-slate-500 mt-0.5" data-testid="signer-employee-info">
                    {emp.department} · {emp.position} · {emp.companyEmail}
                    {emp.status !== 'Đang làm việc' && <b className="text-amber-700"> · {emp.status}</b>}
                  </span>
                ) : null;
              })()}
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
      if (!f.employeeCode) e.name = 'Chọn người ký từ danh sách nhân viên';
      else if (list.some((x) => x.id !== f.id && x.companyId === f.companyId && x.employeeCode === f.employeeCode)) e.name = 'Nhân viên này đã là người ký của công ty';
      if (f.isDefault && !f.active) e.active = 'Người ký mặc định phải đang sử dụng';
      if (old?.isDefault && old.companyId !== f.companyId) e.companyId = 'Người ký mặc định của công ty — hãy chọn người ký mặc định khác trước khi đổi công ty';
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
