/**
 * Danh mục tuyển dụng — 7 màn dùng chung 1 component (RecruitmentCatalogComponent + RecruitmentCatalogPopupDetail).
 * Sắp Độ ưu tiên rồi Tên; xoá bị chặn khi đang được tham chiếu (gợi ý bỏ tick Đang sử dụng).
 */
import React, { useMemo, useState } from 'react';
import { Check, Columns3, FileSpreadsheet, FilterX, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { ErpPage, ErpTitleBar, Panel, Btn, erp } from '../erp/Erp';
import { Modal, useToast, iconBtn } from '../../marcom/MarcomUi';
import { useRc, CATALOG_LABEL } from '../../recruitment/rc/RcContext';
import { CatalogItem, CatalogType, norm, suggestCode } from '../../recruitment/rc/rcData';
import { GridToolbar, SearchBox, Pager, useConfirm, Dash } from './rcUi';
import { FormField } from '../onboarding/onbUi';

type ColKey = 'priority' | 'name' | 'code' | 'mapLink' | 'active';

export const RcCatalogPage: React.FC<{ type: CatalogType }> = ({ type }) => {
  const rc = useRc();
  const label = CATALOG_LABEL(type);
  const isLocation = type === 'Location';
  const { toast, toastNode } = useToast();
  const { ask, confirmNode } = useConfirm();

  const [q, setQ] = useState('');
  const [colFilter, setColFilter] = useState<Partial<Record<ColKey, string>>>({});
  const [hidden, setHidden] = useState<ColKey[]>([]);
  const [chooser, setChooser] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [edit, setEdit] = useState<CatalogItem | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [codeTouched, setCodeTouched] = useState(false);
  const [codeHint, setCodeHint] = useState(false);

  const cols: { key: ColKey; label: string }[] = [
    { key: 'priority', label: 'Độ ưu tiên' },
    { key: 'name', label: 'Tên' },
    { key: 'code', label: 'Mã' },
    ...(isLocation ? [{ key: 'mapLink' as ColKey, label: 'Đường dẫn bản đồ' }] : []),
    { key: 'active', label: 'Đang sử dụng' },
  ];
  const visibleCols = cols.filter((c) => !hidden.includes(c.key));

  const all = useMemo(
    () => rc.catalog.filter((c) => c.type === type).sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name, 'vi')),
    [rc.catalog, type],
  );
  const cell = (it: CatalogItem, k: ColKey) => (k === 'priority' ? String(it.priority) : k === 'active' ? (it.isActive ? 'có' : 'không') : String(it[k] ?? ''));
  const rows = all
    .filter((it) => !q || norm(it.name).includes(norm(q)) || norm(it.code).includes(norm(q)))
    .filter((it) => (Object.entries(colFilter) as [ColKey, string][]).every(([k, v]) => !v || norm(cell(it, k)).includes(norm(v))));
  const hasColFilter = Object.values(colFilter).some(Boolean);
  const paged = rows.slice((page - 1) * size, page * size);

  const openNew = () => {
    setEdit({ id: '', type, name: '', code: '', priority: all.reduce((m, c) => Math.max(m, c.priority), 0) + 1, isActive: true, mapLink: '' });
    setErrors({});
    setCodeTouched(false);
    setCodeHint(false);
  };
  const openEdit = (it: CatalogItem) => {
    setEdit({ ...it });
    setErrors({});
    setCodeTouched(true);
    setCodeHint(false);
  };
  const save = () => {
    if (!edit) return;
    const e = rc.saveCatalog({ ...edit, name: edit.name.trim(), code: edit.code.trim() });
    setErrors(e);
    if (Object.keys(e).length) return;
    toast(edit.id ? 'Đã cập nhật' : `Đã thêm vào ${label}`);
    setEdit(null);
  };
  const remove = async (it: CatalogItem) => {
    if (!(await ask(`Xoá "${it.name}" khỏi danh mục "${label}"?`))) return;
    const err = rc.deleteCatalog(it.id);
    toast(err || `Đã xoá "${it.name}"`);
  };
  const exportXlsx = () => {
    const data = rows.map((it, i) => ({ STT: i + 1, 'Độ ưu tiên': it.priority, Tên: it.name, Mã: it.code, ...(isLocation ? { 'Đường dẫn bản đồ': it.mapLink } : {}), 'Đang sử dụng': it.isActive ? 'Có' : 'Không' }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), 'Danh muc');
    XLSX.writeFile(wb, `DanhMuc-${suggestCode(label)}.xlsx`);
  };

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['Trang chủ', 'Tuyển dụng', 'Danh mục tuyển dụng', label]}
        title={label}
        actions={
          <Btn variant="primary" icon={Plus} onClick={openNew}>
            Tạo mới
          </Btn>
        }
      />

      <Panel title={`Danh mục ${label}`} noPad>
        <GridToolbar
          left={
            <Btn icon={FileSpreadsheet} className="h-7" onClick={exportXlsx}>
              Xuất dữ liệu (XLSX)
            </Btn>
          }
          right={
            <>
              {hasColFilter && <span className="text-[11.5px] text-amber-700 bg-amber-50 border border-amber-300 rounded-[3px] px-1.5 h-6 inline-flex items-center">Đang lọc theo cột</span>}
              <SearchBox value={q} onSearch={(v) => { setQ(v); setPage(1); }} placeholder="Tìm theo tên hoặc mã..." width="w-60" />
              <span className="relative">
                <Btn icon={Columns3} className="h-7" onClick={() => setChooser((v) => !v)}>
                  Chọn cột
                </Btn>
                {chooser && (
                  <div className="absolute right-0 top-8 z-20 w-48 bg-white border border-slate-300 rounded-[4px] shadow-lg p-2 space-y-1">
                    {cols.map((c) => (
                      <label key={c.key} className="flex items-center gap-2 text-[12px] cursor-pointer">
                        <input type="checkbox" checked={!hidden.includes(c.key)} onChange={() => setHidden((h) => (h.includes(c.key) ? h.filter((x) => x !== c.key) : [...h, c.key]))} />
                        {c.label}
                      </label>
                    ))}
                  </div>
                )}
              </span>
              <Btn icon={FilterX} className="h-7" disabled={!hasColFilter} onClick={() => setColFilter({})}>
                Xóa lọc cột
              </Btn>
            </>
          }
        />
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${erp.th} w-12 text-center`}>STT</th>
                {visibleCols.map((c) => (
                  <th key={c.key} className={`${erp.th} text-left`}>
                    {c.label}
                  </th>
                ))}
                <th className={`${erp.th} w-24 text-center`}>Thao tác</th>
              </tr>
              <tr>
                <th className="border border-slate-200 bg-white" />
                {visibleCols.map((c) => (
                  <th key={c.key} className="border border-slate-200 bg-white p-1">
                    <input
                      value={colFilter[c.key] || ''}
                      onChange={(e) => { setColFilter((f) => ({ ...f, [c.key]: e.target.value })); setPage(1); }}
                      className="w-full h-6 border border-slate-200 rounded-[3px] px-1.5 text-[11.5px] font-normal outline-none focus:border-[#1f5fa8]"
                    />
                  </th>
                ))}
                <th className="border border-slate-200 bg-white" />
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 && (
                <tr>
                  <td colSpan={visibleCols.length + 2} className={`${erp.td} text-center text-slate-400 py-6`}>
                    {all.length === 0 ? 'Danh mục trống — hãy thêm phần tử mới.' : 'Không tìm thấy kết quả phù hợp.'}
                  </td>
                </tr>
              )}
              {paged.map((it, i) => (
                <tr key={it.id} className={erp.tr}>
                  <td className={`${erp.td} text-center text-slate-500`}>{(page - 1) * size + i + 1}</td>
                  {visibleCols.map((c) => (
                    <td key={c.key} className={`${erp.td} ${c.key === 'priority' ? erp.num : ''}`}>
                      {c.key === 'priority' && it.priority}
                      {c.key === 'name' && <span className="font-medium">{it.name}</span>}
                      {c.key === 'code' && <code className="font-mono text-[12px] bg-slate-100 border border-slate-200 rounded px-1">{it.code}</code>}
                      {c.key === 'mapLink' &&
                        (it.mapLink ? (
                          <a href={it.mapLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#1f5fa8] underline" title={it.mapLink}>
                            <MapPin size={12} />
                            {it.mapLink.length > 35 ? `${it.mapLink.slice(0, 35)}…` : it.mapLink}
                          </a>
                        ) : (
                          <Dash />
                        ))}
                      {c.key === 'active' && (it.isActive ? <Check size={15} className="text-emerald-600" /> : <span className="text-slate-400 text-[12px]">Ngưng dùng</span>)}
                    </td>
                  ))}
                  <td className={`${erp.td} text-center whitespace-nowrap`}>
                    <button type="button" className={iconBtn} title="Sửa" onClick={() => openEdit(it)}>
                      <Pencil size={14} />
                    </button>
                    <button type="button" className={`${iconBtn} hover:!text-rose-600`} title="Xoá" onClick={() => remove(it)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager total={rows.length} page={page} size={size} onPage={setPage} onSize={(s) => { setSize(s); setPage(1); }} />
      </Panel>

      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        width="max-w-[620px]"
        title={edit?.id ? `Sửa ${label}` : `Thêm vào ${label}`}
        footer={
          <>
            <Btn onClick={() => setEdit(null)}>Hủy</Btn>
            <Btn variant="primary" onClick={save}>
              Lưu
            </Btn>
          </>
        }
      >
        {edit && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <FormField label="Tên" required error={errors.name} className="col-span-2">
              <input
                autoFocus
                value={edit.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setEdit((x) => x && { ...x, name, code: codeTouched ? x.code : suggestCode(name) });
                  setErrors((er) => ({ ...er, name: '' }));
                }}
                className={`${erp.inputFull} ${errors.name ? '!border-rose-400' : ''}`}
              />
            </FormField>
            <FormField label="Mã" required error={errors.code} hint={codeHint ? 'Mã chỉ nhận ký tự không dấu, số và dấu gạch dưới — đã tự chuẩn hoá.' : undefined}>
              <input
                value={edit.code}
                placeholder="Mã tự gợi ý từ tên"
                onChange={(e) => {
                  const raw = e.target.value;
                  const fixed = raw.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^a-zA-Z0-9_]/g, '_').toUpperCase();
                  setCodeHint(fixed !== raw.toUpperCase());
                  setCodeTouched(true);
                  setEdit((x) => x && { ...x, code: fixed });
                  setErrors((er) => ({ ...er, code: '' }));
                }}
                className={`${erp.inputFull} font-mono ${errors.code ? '!border-rose-400' : ''}`}
              />
            </FormField>
            <FormField label="Độ ưu tiên">
              <input type="number" min={1} value={edit.priority} onChange={(e) => setEdit((x) => x && { ...x, priority: Math.max(1, Number(e.target.value) || 1) })} className={`${erp.inputFull} text-right`} />
            </FormField>
            {isLocation && (
              <FormField label="Đường dẫn bản đồ" className="col-span-2">
                <input value={edit.mapLink} placeholder="https://maps.app.goo.gl/..." onChange={(e) => setEdit((x) => x && { ...x, mapLink: e.target.value })} className={erp.inputFull} />
              </FormField>
            )}
            <FormField label="Đang sử dụng" className="col-span-2">
              <label className="inline-flex items-center gap-2 text-[12.5px] cursor-pointer">
                <input type="checkbox" checked={edit.isActive} onChange={(e) => setEdit((x) => x && { ...x, isActive: e.target.checked })} className="w-4 h-4 accent-[#1f5fa8]" />
                Hiển thị trong ô chọn của hồ sơ ứng viên
              </label>
            </FormField>
          </div>
        )}
      </Modal>
      {confirmNode}
      {toastNode}
    </ErpPage>
  );
};
