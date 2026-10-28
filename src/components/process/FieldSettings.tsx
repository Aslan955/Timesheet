/**
 * FieldSettings — popup thiết lập chi tiết 1 trường thông tin của quy trình (mở khi thêm trường hoặc bấm ⚙ trên thẻ trường).
 * Theo phần mềm quy trình mẫu: Một dòng, Nhiều dòng, Chọn giá trị, Thời gian, Địa giới hành chính, Số, Tiền tệ, Nhân viên,
 * Tên vị trí công việc, Cơ cấu tổ chức, Tải tệp, Công việc con, Bảng, Danh mục, Công thức, Email, Dữ liệu lượt chạy,
 * Dữ liệu kết nối, Mã số tự sinh.
 */
import React, { useMemo, useRef, useState } from 'react';
import { Calculator, FileSignature, FileStack, GripVertical, Plus, Settings2, Table2, Trash2, X } from 'lucide-react';
import { Btn, erp } from '../erp/Erp';
import {
  CATALOGS, COL_TYPES, PROC_PEOPLE, RUN_SOURCES, cfgOf, fieldTypeOf, uidP, type ColType, type FieldCfg, type ProcField, type Process, type TableCol,
} from './processStore';
import { CurrencyPick, autoCodeOf } from './FieldInput';
import { evalFormula, fmtNumber, refsOf, roundBy } from './formula';
import { soThanhChu } from '../contracts/docx';

const NUM_TYPES = ['number', 'currency', 'formula', 'table'];
const Lbl: React.FC<{ children: React.ReactNode; req?: boolean; right?: React.ReactNode }> = ({ children, req, right }) => (
  <div className="flex items-center justify-between mb-1">
    <span className="text-[13px] font-semibold text-slate-700">
      {children} {req && <span className="text-rose-600">*</span>}
    </span>
    {right}
  </div>
);
const Check: React.FC<{ on: boolean; set: (v: boolean) => void; children: React.ReactNode; disabled?: boolean }> = ({ on, set, children, disabled }) => (
  <label className={`flex items-center gap-2 text-[13px] text-slate-700 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
    <input type="checkbox" className="w-4 h-4 accent-[#1f5fa8]" checked={on} disabled={disabled} onChange={(e) => set(e.target.checked)} />
    {children}
  </label>
);
const Radio: React.FC<{ on: boolean; set: () => void; children: React.ReactNode }> = ({ on, set, children }) => (
  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
    <input type="radio" className="w-4 h-4 accent-[#1f5fa8]" checked={on} onChange={set} />
    {children}
  </label>
);
const LinkBtn: React.FC<{ onClick: () => void; children: React.ReactNode; icon?: React.ElementType }> = ({ onClick, children, icon: I }) => (
  <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 text-[13px] text-[#1f6fd1] hover:underline cursor-pointer">
    {I && <I size={15} />} {children}
  </button>
);

/** Danh sách mục kéo thả (lựa chọn, công việc con…). */
const ListEditor: React.FC<{ items: string[]; set: (v: string[]) => void; addLabel: string; placeholder: string; numeric?: boolean }> = ({ items, set, addLabel, placeholder, numeric }) => {
  const drag = useRef<number | null>(null);
  return (
    <div className="rounded-[6px] bg-[#e4e9f1] p-2.5 space-y-1.5">
      {items.map((it, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5"
          draggable
          onDragStart={() => (drag.current = i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (drag.current === null || drag.current === i) return;
            const n = [...items];
            const [x] = n.splice(drag.current, 1);
            n.splice(i, 0, x);
            set(n);
            drag.current = null;
          }}
        >
          <GripVertical size={15} className="text-slate-500 cursor-grab shrink-0" />
          <input
            value={it}
            type={numeric ? 'number' : 'text'}
            onChange={(e) => set(items.map((x, k) => (k === i ? e.target.value : x)))}
            placeholder={placeholder}
            className={`${erp.inputFull} bg-white`}
          />
          <button type="button" onClick={() => set(items.filter((_, k) => k !== i))} className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer shrink-0" title="Xoá">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => set([...items, ''])} className="ml-6 inline-flex items-center gap-1 h-8 px-3 rounded-[4px] bg-white text-[13px] text-[#1f6fd1] hover:bg-slate-50 cursor-pointer">
        <Plus size={15} /> {addLabel}
      </button>
    </div>
  );
};

export const FieldSettings: React.FC<{
  field: ProcField;
  isNew?: boolean;
  stepFields: ProcField[]; // trường cùng bước (trường phụ thuộc)
  allFields: ProcField[]; // trường trong quy trình (công thức)
  processes: Process[];
  onSave: (f: ProcField) => void;
  onCancel: () => void;
}> = ({ field, isNew, stepFields, allFields, processes, onSave, onCancel }) => {
  const [f, setF] = useState<ProcField>(() => ({ ...field, cfg: cfgOf(field) }));
  const [adv, setAdv] = useState(false);
  const [tried, setTried] = useState(false);
  const [colGear, setColGear] = useState<string | null>(null);
  const [rowsOpen, setRowsOpen] = useState(false);
  const [trial, setTrial] = useState<Record<string, string> | null>(null);
  const [hashOpen, setHashOpen] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(!!field.cfg?.mergeTemplate);
  const [signOpen, setSignOpen] = useState(!!field.cfg?.signers?.length);
  const exprRef = useRef<HTMLTextAreaElement>(null);
  const c = f.cfg as FieldCfg;
  const set = (patch: Partial<ProcField>) => setF((x) => ({ ...x, ...patch }));
  const setC = (patch: Partial<FieldCfg>) => setF((x) => ({ ...x, cfg: { ...(x.cfg || {}), ...patch } }));
  const T = fieldTypeOf(f.type);

  // trường dùng được trong công thức (số, tiền, công thức khác, bảng) — trừ chính nó
  const numFields = allFields.filter((x) => x.id !== f.id && NUM_TYPES.includes(x.type));
  const exprErr = useMemo(() => {
    if (f.type !== 'formula') return '';
    if (!c.expr?.trim()) return 'Không được để trống.';
    try {
      evalFormula(c.expr, (name) => (numFields.some((x) => x.label.trim() === name) ? 1 : null));
      return '';
    } catch (e) {
      return (e as Error).message === 'Chia cho 0' ? '' : `${(e as Error).message}.`;
    }
  }, [f.type, c.expr, numFields]);

  // ---- Kiểm tra trước khi lưu
  const errs: Record<string, string> = {};
  if (!f.label.trim()) errs.label = 'Không được để trống.';
  else if (allFields.some((x) => x.id !== f.id && x.label.trim().toLowerCase() === f.label.trim().toLowerCase())) errs.label = 'Tên trường đã có trong quy trình (công thức dùng tên trường để tham chiếu).';
  if (f.type === 'select' && !(f.options || []).filter((o) => o.trim()).length) errs.options = 'Thêm ít nhất 1 lựa chọn.';
  if (f.type === 'number' && c.numSource === 'list' && !(c.numOptions || []).length) errs.options = 'Thêm ít nhất 1 giá trị.';
  if (f.type === 'subtask' && !(c.tasks || []).filter((t) => t.trim()).length) errs.tasks = 'Thêm ít nhất 1 công việc.';
  if (f.type === 'table') {
    const cols = (c.columns || []).filter((x) => x.type !== 'stt');
    if (!cols.length) errs.columns = 'Thêm ít nhất 1 cột.';
    else if (cols.some((x) => !x.name.trim())) errs.columns = 'Nhập tên cho tất cả các cột.';
    else if ((c.columns || []).some((x) => x.type === 'select' && !(x.options || []).filter((o) => o.trim()).length)) errs.columns = 'Cột "Chọn giá trị" cần danh sách lựa chọn (bấm ⚙).';
  }
  if (f.type === 'formula' && exprErr) errs.expr = exprErr;
  if (f.type === 'linkedData' && !c.linkProcess) errs.link = 'Chọn quy trình nguồn.';
  if (f.type === 'number' && c.min !== null && c.min !== undefined && c.max !== null && c.max !== undefined && c.min > c.max) errs.minmax = 'Giá trị nhỏ nhất lớn hơn giá trị lớn nhất.';
  const E = tried ? errs : {};

  const save = () => {
    setTried(true);
    if (Object.keys(errs).length) return;
    const clean: ProcField = {
      ...f,
      label: f.label.trim(),
      options: f.type === 'select' ? (f.options || []).map((o) => o.trim()).filter(Boolean) : f.options,
      cfg: {
        ...c,
        tasks: c.tasks?.map((t) => t.trim()).filter(Boolean),
        numOptions: c.numOptions?.filter((n) => n !== null && !isNaN(Number(n))).map(Number),
        columns: c.columns?.map((x) => ({ ...x, name: x.name.trim(), options: x.options?.map((o) => o.trim()).filter(Boolean) })),
      },
    };
    onSave(clean);
  };

  // ---- Công thức: gõ # để chọn trường
  const insertRef = (name: string) => {
    const el = exprRef.current;
    const s = c.expr || '';
    const pos = el?.selectionStart ?? s.length;
    const hashAt = s.lastIndexOf('#', pos);
    const a = hashAt >= 0 && hashAt >= pos - 1 ? hashAt : pos;
    const next = `${s.slice(0, a)}{${name}}${s.slice(pos)}`;
    setC({ expr: next });
    setHashOpen(false);
    requestAnimationFrame(() => {
      el?.focus();
      const p = a + name.length + 2;
      el?.setSelectionRange(p, p);
    });
  };
  const trialResult = useMemo(() => {
    if (!trial || !c.expr) return null;
    try {
      const v = evalFormula(c.expr, (name) => (name in trial ? Number(String(trial[name]).replace(/,/g, '')) || 0 : null));
      return { v: roundBy(v, c.rounding, c.returnKind === 'integer' || c.returnKind === 'currency' ? 0 : c.decimals ?? 2), err: '' };
    } catch (e) {
      return { v: null, err: (e as Error).message };
    }
  }, [trial, c.expr, c.rounding, c.decimals, c.returnKind]);

  // ---- Bảng
  const cols = c.columns || [];
  const setCols = (n: TableCol[]) => setC({ columns: n });
  const colDrag = useRef<number | null>(null);

  const hint = (
    <div>
      <Lbl>Hướng dẫn nhập</Lbl>
      <input value={f.hint} onChange={(e) => set({ hint: e.target.value })} placeholder="Nhập nội dung hướng dẫn" className={erp.inputFull} />
    </div>
  );
  const required = <Check on={f.required} set={(v) => set({ required: v })}>Trường bắt buộc</Check>;
  const defaultBox = (input: React.ReactNode) => (
    <div className="space-y-1.5">
      <Check on={!!c.defaultOn} set={(v) => setC({ defaultOn: v })}>
        Giá trị mặc định
      </Check>
      {c.defaultOn && <div className="pl-6">{input}</div>}
    </div>
  );
  const multipleRadio = (
    <div className="flex items-center gap-6">
      <span className="text-[13px] font-semibold text-slate-700 w-[130px]">
        Kiểu chọn giá trị <span className="text-rose-600">*</span>
      </span>
      <Radio on={!c.multiple} set={() => setC({ multiple: false })}>
        Chọn một
      </Radio>
      <Radio on={!!c.multiple} set={() => setC({ multiple: true })}>
        Chọn nhiều
      </Radio>
    </div>
  );
  const depSelect = (
    <div>
      <Lbl>Trường phụ thuộc</Lbl>
      <select value={c.dependsOn || ''} onChange={(e) => setC({ dependsOn: e.target.value || undefined })} className={erp.inputFull}>
        <option value="">Không phụ thuộc</option>
        {stepFields
          .filter((x) => x.id !== f.id)
          .map((x) => (
            <option key={x.id} value={x.id}>
              {x.label}
            </option>
          ))}
      </select>
      {c.dependsOn && <p className="text-[11.5px] text-slate-400 mt-0.5">Trường chỉ hiện khi "{stepFields.find((x) => x.id === c.dependsOn)?.label}" đã có giá trị.</p>}
    </div>
  );
  const hasAdv = f.type === 'text' || f.type === 'textarea' || f.type === 'datetime';

  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/45 flex items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div
        className={`w-full ${f.type === 'table' ? 'max-w-[860px]' : f.type === 'formula' ? 'max-w-[680px]' : 'max-w-[560px]'} max-h-[92vh] bg-white rounded-[10px] shadow-2xl flex flex-col overflow-hidden`}
        data-testid="field-settings"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h3 className="text-[22px] font-bold text-slate-900 flex items-center gap-2">
            {T.label}
            {isNew && <span className="text-[11px] font-semibold text-[#1f5fa8] bg-[#e8f1fb] rounded px-1.5 py-0.5">Trường mới</span>}
          </h3>
          <button type="button" onClick={onCancel} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 cursor-pointer" title="Đóng">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 pb-5 space-y-4">
          {/* Tên trường */}
          <div>
            <Lbl req right={hasAdv ? <LinkBtn onClick={() => setAdv((a) => !a)}>{adv ? 'Ẩn thiết lập nâng cao' : 'Thiết lập nâng cao'}</LinkBtn> : undefined}>
              Tên trường
            </Lbl>
            <input autoFocus value={f.label} onChange={(e) => set({ label: e.target.value })} className={`${erp.inputFull} ${E.label ? '!border-rose-400' : ''}`} data-testid="fs-label" />
            {E.label && <p className="text-[12px] text-rose-600 mt-0.5">{E.label}</p>}
          </div>

          {/* ===== Một dòng / Nhiều dòng ===== */}
          {(f.type === 'text' || f.type === 'textarea') && (
            <>
              {adv && (
                <div className="rounded-[6px] border border-slate-200 bg-slate-50 p-3 grid grid-cols-2 gap-3">
                  <div>
                    <Lbl>Độ dài tối đa (ký tự)</Lbl>
                    <input type="number" min={1} value={c.maxLength ?? ''} onChange={(e) => setC({ maxLength: e.target.value ? Number(e.target.value) : undefined })} placeholder="Không giới hạn" className={erp.inputFull} />
                  </div>
                  {f.type === 'text' && (
                    <div>
                      <Lbl>Định dạng</Lbl>
                      <select value={c.format || 'free'} onChange={(e) => setC({ format: e.target.value as FieldCfg['format'] })} className={erp.inputFull}>
                        <option value="free">Tự do</option>
                        <option value="digits">Chỉ nhập chữ số</option>
                        <option value="phone">Số điện thoại</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
              {depSelect}
              {hint}
              {required}
              {defaultBox(
                f.type === 'text' ? (
                  <input value={c.defaultValue || ''} onChange={(e) => setC({ defaultValue: e.target.value })} className={erp.inputFull} />
                ) : (
                  <textarea rows={2} value={c.defaultValue || ''} onChange={(e) => setC({ defaultValue: e.target.value })} className="w-full border border-slate-300 rounded-[3px] px-2 py-1.5 text-[13px]" />
                ),
              )}
            </>
          )}

          {/* ===== Chọn giá trị ===== */}
          {f.type === 'select' && (
            <>
              <div>
                <Lbl req>Danh sách lựa chọn</Lbl>
                <ListEditor items={f.options?.length ? f.options : ['']} set={(v) => set({ options: v })} addLabel="Thêm lựa chọn" placeholder="Nhập lựa chọn" />
                {E.options && <p className="text-[12px] text-rose-600 mt-0.5">{E.options}</p>}
              </div>
              {multipleRadio}
              <div className="flex items-center gap-6">
                <span className="text-[13px] font-semibold text-slate-700 w-[130px]">Kiểu hiển thị</span>
                <Radio on={c.display !== 'radio'} set={() => setC({ display: 'dropdown' })}>
                  Danh sách thả xuống
                </Radio>
                <Radio on={c.display === 'radio'} set={() => setC({ display: 'radio' })}>
                  Nút chọn
                </Radio>
              </div>
              {hint}
              {required}
              {!c.multiple &&
                defaultBox(
                  <select value={c.defaultValue || ''} onChange={(e) => setC({ defaultValue: e.target.value })} className={erp.inputFull}>
                    <option value="">— Chọn —</option>
                    {(f.options || []).filter(Boolean).map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>,
                )}
            </>
          )}

          {/* ===== Thời gian ===== */}
          {f.type === 'datetime' && (
            <>
              <div>
                <Lbl req>Kiểu dữ liệu</Lbl>
                <select value={c.dateKind || 'date'} onChange={(e) => setC({ dateKind: e.target.value as FieldCfg['dateKind'] })} className={erp.inputFull} data-testid="fs-datekind">
                  <option value="date">Ngày/tháng/năm</option>
                  <option value="month">Tháng/năm</option>
                  <option value="datetime">Ngày/tháng/năm Giờ:phút</option>
                </select>
              </div>
              {adv && (
                <div className="rounded-[6px] border border-slate-200 bg-slate-50 p-3">
                  <Lbl>Giới hạn thời gian được chọn</Lbl>
                  <select value={c.dateLimit || 'none'} onChange={(e) => setC({ dateLimit: e.target.value as FieldCfg['dateLimit'] })} className={erp.inputFull}>
                    <option value="none">Không giới hạn</option>
                    <option value="notPast">Không chọn thời gian trong quá khứ</option>
                    <option value="notFuture">Không chọn thời gian trong tương lai</option>
                  </select>
                </div>
              )}
              {hint}
              {required}
              <Check on={!!c.defaultToday} set={(v) => setC({ defaultToday: v })}>
                Giá trị mặc định: thời điểm hiện tại
              </Check>
            </>
          )}

          {/* ===== Địa giới hành chính ===== */}
          {f.type === 'address' && (
            <>
              {multipleRadio}
              <div>
                <Lbl req>Kiểu giá trị</Lbl>
                <select value={c.addrKind || 'province'} onChange={(e) => setC({ addrKind: e.target.value as FieldCfg['addrKind'] })} className={erp.inputFull}>
                  <option value="province">Tỉnh/Thành phố</option>
                  <option value="ward">Phường/Xã</option>
                </select>
                <p className="text-[11.5px] text-slate-400 mt-0.5">Theo đơn vị hành chính 2 cấp: 34 tỉnh, thành phố; phường / xã chọn sau khi chọn tỉnh, thành.</p>
              </div>
              {hint}
              {required}
            </>
          )}

          {/* ===== Số ===== */}
          {f.type === 'number' && (
            <>
              <div>
                <Lbl req>Kiểu dữ liệu</Lbl>
                <select value={c.numKind || 'decimal'} onChange={(e) => setC({ numKind: e.target.value as FieldCfg['numKind'] })} className={erp.inputFull} data-testid="fs-numkind">
                  <option value="decimal">Số thập phân</option>
                  <option value="integer">Số tự nhiên</option>
                  <option value="percent">Số phần trăm</option>
                </select>
              </div>
              <div className="space-y-2">
                <Radio on={c.numSource !== 'list'} set={() => setC({ numSource: 'input' })}>
                  Nhập giá trị
                </Radio>
                {c.numSource !== 'list' && (
                  <div className="pl-6 grid grid-cols-3 gap-2">
                    {c.numKind !== 'integer' && (
                      <label className="block">
                        <span className="text-[12px] text-slate-500">Số chữ số thập phân</span>
                        <input type="number" min={0} max={6} value={c.decimals ?? 2} onChange={(e) => setC({ decimals: Number(e.target.value) })} className={erp.inputFull} />
                      </label>
                    )}
                    <label className="block">
                      <span className="text-[12px] text-slate-500">Nhỏ nhất</span>
                      <input type="number" value={c.min ?? ''} onChange={(e) => setC({ min: e.target.value === '' ? null : Number(e.target.value) })} className={erp.inputFull} />
                    </label>
                    <label className="block">
                      <span className="text-[12px] text-slate-500">Lớn nhất</span>
                      <input type="number" value={c.max ?? ''} onChange={(e) => setC({ max: e.target.value === '' ? null : Number(e.target.value) })} className={erp.inputFull} />
                    </label>
                  </div>
                )}
                {E.minmax && <p className="pl-6 text-[12px] text-rose-600">{E.minmax}</p>}
                <Radio on={c.numSource === 'list'} set={() => setC({ numSource: 'list', numOptions: c.numOptions?.length ? c.numOptions : [] })}>
                  Chọn giá trị từ danh sách
                </Radio>
                {c.numSource === 'list' && (
                  <div className="pl-6">
                    <ListEditor items={(c.numOptions || []).map(String).concat(c.numOptions?.length ? [] : [''])} set={(v) => setC({ numOptions: v.map((x) => (x === '' ? NaN : Number(x))) as number[] })} addLabel="Thêm giá trị" placeholder="Nhập số" numeric />
                    {E.options && <p className="text-[12px] text-rose-600 mt-0.5">{E.options}</p>}
                  </div>
                )}
              </div>
              {hint}
              {required}
              {defaultBox(<input type="number" value={c.defaultValue || ''} onChange={(e) => setC({ defaultValue: e.target.value })} className={`${erp.input} w-48`} />)}
            </>
          )}

          {/* ===== Tiền tệ ===== */}
          {f.type === 'currency' && (
            <>
              <div className="flex items-end gap-4">
                <div>
                  <Lbl req>Loại tiền</Lbl>
                  <CurrencyPick value={c.currency || 'VND'} onChange={(v) => setC({ currency: v })} />
                </div>
                <div className="pb-1.5 space-y-1.5">
                  <Check on={!!c.allowCurrencyChoice} set={(v) => setC({ allowCurrencyChoice: v })}>
                    Cho phép người nhập đổi loại tiền
                  </Check>
                </div>
              </div>
              {hint}
              {required}
              <Check on={!!c.showWords} set={(v) => setC({ showWords: v })}>
                Hiển thị số viết bằng chữ (VND)
              </Check>
              {defaultBox(<input value={c.defaultValue ? Number(c.defaultValue).toLocaleString('en-US') : ''} onChange={(e) => setC({ defaultValue: e.target.value.replace(/[^\d]/g, '') })} className={`${erp.input} w-48 text-right`} />)}
            </>
          )}

          {/* ===== Nhân viên / Vị trí / Cơ cấu tổ chức / Danh mục ===== */}
          {(f.type === 'employee' || f.type === 'position' || f.type === 'org' || f.type === 'catalog') && (
            <>
              {f.type === 'catalog' && (
                <div>
                  <Lbl req>Danh mục</Lbl>
                  <select value={c.catalog || ''} onChange={(e) => setC({ catalog: e.target.value })} className={erp.inputFull}>
                    {Object.keys(CATALOGS).map((k) => (
                      <option key={k}>{k}</option>
                    ))}
                  </select>
                  <p className="text-[11.5px] text-slate-400 mt-0.5">{(CATALOGS[c.catalog || ''] || []).slice(0, 4).join(' · ')}…</p>
                </div>
              )}
              {multipleRadio}
              {f.type === 'employee' && (
                <Check on={!!c.defaultCreator} set={(v) => setC({ defaultCreator: v })}>
                  Mặc định là người tạo đơn
                </Check>
              )}
              {hint}
              {required}
            </>
          )}

          {/* ===== Email ===== */}
          {f.type === 'email' && (
            <>
              {hint}
              {required}
              {defaultBox(<input value={c.defaultValue || ''} onChange={(e) => setC({ defaultValue: e.target.value })} placeholder="ten@congty.vn" className={erp.inputFull} />)}
            </>
          )}

          {/* ===== Tải tệp ===== */}
          {f.type === 'file' && (
            <>
              {hint}
              {required}
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[12px] text-slate-500">Số tệp tối đa</span>
                  <input type="number" min={1} value={c.maxFiles ?? ''} onChange={(e) => setC({ maxFiles: e.target.value ? Number(e.target.value) : undefined })} className={erp.inputFull} />
                </label>
                <label className="block">
                  <span className="text-[12px] text-slate-500">Định dạng cho phép</span>
                  <select value={c.accept || ''} onChange={(e) => setC({ accept: e.target.value })} className={erp.inputFull}>
                    <option value="">Tất cả</option>
                    <option value=".pdf">PDF</option>
                    <option value=".pdf,.jpg,.png">PDF, ảnh</option>
                    <option value=".doc,.docx,.xls,.xlsx,.pdf">Word, Excel, PDF</option>
                  </select>
                </label>
              </div>
              <div className="rounded-[6px] border border-slate-200 p-3 space-y-2">
                <div className="text-[13px] font-semibold text-slate-700">Thiết lập nâng cao</div>
                <LinkBtn icon={FileStack} onClick={() => setMergeOpen((o) => !o)}>
                  Tự động trộn và đính kèm mẫu in thiết lập
                </LinkBtn>
                {mergeOpen && (
                  <div className="pl-6 flex items-center gap-2">
                    {c.mergeTemplate ? (
                      <>
                        <span className="text-[12.5px] rounded border border-slate-200 bg-slate-50 px-2 py-1">{c.mergeTemplate}</span>
                        <button type="button" onClick={() => setC({ mergeTemplate: null })} className="text-rose-500 cursor-pointer" title="Bỏ mẫu in">
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <label className="inline-flex items-center gap-1 h-7 px-2.5 rounded-[3px] border border-slate-300 text-[12px] font-semibold cursor-pointer hover:bg-slate-50">
                        Chọn mẫu in (.docx)
                        <input type="file" accept=".docx" className="hidden" onChange={(e) => e.target.files?.[0] && setC({ mergeTemplate: e.target.files[0].name })} />
                      </label>
                    )}
                    <span className="text-[11.5px] text-slate-400">Trường {'{{Tên trường}}'} trong mẫu được trộn từ dữ liệu đơn khi gửi.</span>
                  </div>
                )}
                <LinkBtn icon={FileSignature} onClick={() => setSignOpen((o) => !o)}>
                  Thiết lập trình ký
                </LinkBtn>
                {signOpen && (
                  <div className="pl-6 space-y-1.5">
                    {(c.signers || []).map((p, i) => (
                      <div key={i} className="flex items-center gap-2 text-[12.5px]">
                        <span className="w-5 text-slate-500">{i + 1}.</span>
                        <select value={p} onChange={(e) => setC({ signers: (c.signers || []).map((x, k) => (k === i ? e.target.value : x)) })} className={`${erp.input} h-7 w-60`}>
                          {PROC_PEOPLE.map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                        <button type="button" onClick={() => setC({ signers: (c.signers || []).filter((_, k) => k !== i) })} className="text-rose-500 cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setC({ signers: [...(c.signers || []), PROC_PEOPLE[0]] })} className="inline-flex items-center gap-1 text-[12.5px] text-[#1f6fd1] hover:underline cursor-pointer">
                      <Plus size={13} /> Thêm người ký (ký lần lượt)
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ===== Công việc con ===== */}
          {f.type === 'subtask' && (
            <>
              <div>
                <Lbl req>Công việc con</Lbl>
                <ListEditor items={c.tasks?.length ? c.tasks : ['']} set={(v) => setC({ tasks: v })} addLabel="Thêm công việc" placeholder="Nhập công việc" />
                {E.tasks && <p className="text-[12px] text-rose-600 mt-0.5">{E.tasks}</p>}
              </div>
              {hint}
              {required}
              <Check on={!!c.requireAll} set={(v) => setC({ requireAll: v })}>
                Bắt buộc hoàn thành toàn bộ công việc con
              </Check>
            </>
          )}

          {/* ===== Bảng ===== */}
          {f.type === 'table' && (
            <>
              <div>
                <Lbl req>Thiết lập cột</Lbl>
                <div className="rounded-[6px] bg-[#e4e9f1] p-3" data-testid="fs-columns">
                  <div className="grid grid-cols-[20px_minmax(0,1fr)_minmax(0,1fr)_36px_70px_30px] gap-2 px-0.5 pb-1 text-[13px] font-semibold text-slate-700">
                    <span />
                    <span>Tên cột</span>
                    <span>Loại dữ liệu</span>
                    <span />
                    <span className="text-center">Bắt buộc</span>
                    <span />
                  </div>
                  {cols.map((col, i) => (
                    <div
                      key={col.id}
                      className="relative grid grid-cols-[20px_minmax(0,1fr)_minmax(0,1fr)_36px_70px_30px] gap-2 items-center py-1"
                      draggable
                      onDragStart={() => (colDrag.current = i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (colDrag.current === null || colDrag.current === i) return;
                        const n = [...cols];
                        const [x] = n.splice(colDrag.current, 1);
                        n.splice(i, 0, x);
                        setCols(n);
                        colDrag.current = null;
                      }}
                    >
                      <GripVertical size={15} className="text-slate-500 cursor-grab" />
                      <input value={col.name} onChange={(e) => setCols(cols.map((x) => (x.id === col.id ? { ...x, name: e.target.value } : x)))} className={`${erp.inputFull} bg-white`} placeholder="Tên cột" />
                      <select value={col.type} onChange={(e) => setCols(cols.map((x) => (x.id === col.id ? { ...x, type: e.target.value as ColType, sum: ['currency', 'decimal', 'integer'].includes(e.target.value) ? x.sum : false } : x)))} className={`${erp.inputFull} bg-white`}>
                        {COL_TYPES.filter((t) => !t.group).slice(0, 4).map((t) => (
                          <option key={t.type} value={t.type}>
                            {t.label}
                          </option>
                        ))}
                        <optgroup label="Thời gian">
                          {COL_TYPES.filter((t) => t.group === 'Thời gian').map((t) => (
                            <option key={t.type} value={t.type}>
                              {t.label}
                            </option>
                          ))}
                        </optgroup>
                        <option value="address">Địa giới hành chính</option>
                        <optgroup label="Số">
                          {COL_TYPES.filter((t) => t.group === 'Số').map((t) => (
                            <option key={t.type} value={t.type}>
                              {t.label}
                            </option>
                          ))}
                        </optgroup>
                        <option value="currency">Tiền tệ</option>
                      </select>
                      <button
                        type="button"
                        disabled={col.type === 'stt'}
                        onClick={() => setColGear(colGear === col.id ? null : col.id)}
                        className="w-8 h-8 rounded-[4px] bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:border-[#1f5fa8] disabled:opacity-30 cursor-pointer"
                        title="Thiết lập cột"
                      >
                        <Settings2 size={15} />
                      </button>
                      <span className="flex justify-center">
                        <input type="checkbox" className="w-4 h-4 accent-[#1f5fa8]" checked={col.type === 'stt' || col.required} disabled={col.type === 'stt'} onChange={(e) => setCols(cols.map((x) => (x.id === col.id ? { ...x, required: e.target.checked } : x)))} />
                      </span>
                      <button type="button" onClick={() => setCols(cols.filter((x) => x.id !== col.id))} className="text-rose-500 hover:bg-rose-50 rounded p-1 cursor-pointer" title="Xoá cột">
                        <Trash2 size={16} />
                      </button>
                      {colGear === col.id && (
                        <div className="col-span-6 ml-6 rounded-[4px] border border-slate-300 bg-white p-2.5 text-[12.5px] space-y-2">
                          {col.type === 'select' ? (
                            <>
                              <div className="font-semibold text-slate-700">Danh sách lựa chọn của cột "{col.name || '…'}"</div>
                              <ListEditor items={col.options?.length ? col.options : ['']} set={(v) => setCols(cols.map((x) => (x.id === col.id ? { ...x, options: v } : x)))} addLabel="Thêm lựa chọn" placeholder="Nhập lựa chọn" />
                            </>
                          ) : ['currency', 'decimal', 'integer'].includes(col.type) ? (
                            <Check on={!!col.sum} set={(v) => setCols(cols.map((x) => (x.id === col.id ? { ...x, sum: v } : x)))}>
                              Tính tổng cột ở dòng cuối (dùng được trong Công thức)
                            </Check>
                          ) : (
                            <span className="text-slate-500">Cột "{COL_TYPES.find((t) => t.type === col.type)?.label}" không có thiết lập thêm.</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setCols([...cols, { id: uidP('c'), name: '', type: 'text', required: false }])} className="ml-7 mt-1 inline-flex items-center gap-1 h-8 px-3 rounded-[4px] bg-white text-[13px] text-[#1f6fd1] hover:bg-slate-50 cursor-pointer" data-testid="fs-addcol">
                    <Plus size={15} /> Thêm cột
                  </button>
                </div>
                {E.columns && <p className="text-[12px] text-rose-600 mt-0.5">{E.columns}</p>}
              </div>
              <div className="flex items-center gap-5">
                <LinkBtn icon={Table2} onClick={() => setRowsOpen((o) => !o)}>
                  Dòng
                </LinkBtn>
                {!cols.some((x) => x.type === 'stt') && (
                  <LinkBtn icon={Plus} onClick={() => setCols([{ id: 'stt', name: 'STT', type: 'stt', required: true }, ...cols])}>
                    Thêm cột STT
                  </LinkBtn>
                )}
              </div>
              {rowsOpen && (
                <div className="rounded-[6px] border border-slate-200 bg-slate-50 p-3 flex flex-wrap items-center gap-5">
                  <label className="flex items-center gap-2 text-[13px]">
                    Số dòng mặc định
                    <input type="number" min={1} value={c.rowsDefault ?? 1} onChange={(e) => setC({ rowsDefault: Math.max(1, Number(e.target.value)) })} className={`${erp.input} w-20`} />
                  </label>
                  <Check on={c.allowAddRows !== false} set={(v) => setC({ allowAddRows: v })}>
                    Cho phép người nhập thêm / xoá dòng
                  </Check>
                </div>
              )}
              {hint}
              {required}
            </>
          )}

          {/* ===== Công thức ===== */}
          {f.type === 'formula' && (
            <>
              <div>
                <Lbl>Kiểu dữ liệu trả về</Lbl>
                <select value={c.returnKind || 'decimal'} onChange={(e) => setC({ returnKind: e.target.value as FieldCfg['returnKind'] })} className={erp.inputFull} data-testid="fs-return">
                  <option value="decimal">Số thập phân</option>
                  <option value="integer">Số tự nhiên</option>
                  <option value="percent">Số phần trăm</option>
                  <option value="currency">Tiền tệ (VND)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Lbl>Phương thức làm tròn</Lbl>
                  <select value={c.rounding || 'nearest'} onChange={(e) => setC({ rounding: e.target.value as FieldCfg['rounding'] })} className={erp.inputFull}>
                    <option value="nearest">Làm tròn gần nhất (≥ 0.5 làm tròn lên)</option>
                    <option value="up">Luôn làm tròn lên</option>
                    <option value="down">Luôn làm tròn xuống</option>
                  </select>
                </div>
                <div>
                  <Lbl>Số chữ số thập phân hiển thị &amp; làm tròn</Lbl>
                  <input type="number" min={0} max={6} disabled={c.returnKind === 'integer' || c.returnKind === 'currency'} value={c.returnKind === 'integer' || c.returnKind === 'currency' ? 0 : c.decimals ?? 2} onChange={(e) => setC({ decimals: Number(e.target.value) })} className={erp.inputFull} />
                </div>
              </div>
              <div className="relative">
                <Lbl req right={<LinkBtn icon={Calculator} onClick={() => setTrial(trial ? null : Object.fromEntries(refsOf(c.expr || '').map((r) => [r, ''])))}>Tính thử kết quả</LinkBtn>}>
                  Thiết lập công thức
                </Lbl>
                <textarea
                  ref={exprRef}
                  rows={3}
                  value={c.expr || ''}
                  onChange={(e) => {
                    setC({ expr: e.target.value });
                    const pos = e.target.selectionStart;
                    setHashOpen(e.target.value[pos - 1] === '#');
                  }}
                  onKeyDown={(e) => e.key === 'Escape' && setHashOpen(false)}
                  placeholder="VD: {Số lượng} * {Đơn giá}"
                  className={`w-full border rounded-[3px] px-2 py-1.5 text-[13px] font-mono outline-none ${E.expr || (c.expr && exprErr) ? 'border-rose-400' : 'border-slate-300 focus:border-[#1f5fa8]'}`}
                  data-testid="fs-expr"
                />
                {hashOpen && (
                  <div className="absolute z-10 left-0 right-0 mt-0.5 bg-white border border-slate-300 rounded-[4px] shadow-lg max-h-52 overflow-auto" data-testid="fs-hash">
                    {!numFields.length && <p className="px-3 py-2 text-[12.5px] text-slate-400">Chưa có trường số / tiền tệ / bảng trong quy trình.</p>}
                    {numFields.map((x) => (
                      <button key={x.id} type="button" onMouseDown={(e) => (e.preventDefault(), insertRef(x.label))} className="w-full text-left px-3 py-1.5 text-[12.5px] hover:bg-[#eaf2fc] cursor-pointer">
                        {x.label} <span className="text-slate-400">· {fieldTypeOf(x.type).label}</span>
                      </button>
                    ))}
                  </div>
                )}
                {(E.expr || (c.expr && exprErr)) && <p className="text-[12px] text-rose-600 mt-0.5">{E.expr || exprErr}</p>}
                <p className="text-[12px] text-slate-500 mt-1.5">
                  Gõ <b className="text-[#1f6fd1]">#</b> để chọn trường thông tin.
                  <br />
                  Các phép toán có thể thực hiện: Cộng (+), Trừ (-), Nhân (*), Chia (/), Đóng mở ngoặc (). Trường kiểu Bảng lấy tổng cột được tính tổng.
                </p>
              </div>
              {trial && (
                <div className="rounded-[6px] border border-[#cfe0f5] bg-[#f5f9ff] p-3 space-y-2" data-testid="fs-trial">
                  <div className="text-[12.5px] font-semibold text-slate-700">Tính thử — nhập giá trị cho các trường</div>
                  {!Object.keys(trial).length && <p className="text-[12px] text-slate-500">Công thức chưa tham chiếu trường nào.</p>}
                  {Object.keys(trial).map((k) => (
                    <label key={k} className="flex items-center gap-2 text-[12.5px]">
                      <span className="w-48 truncate">{k}</span>
                      <input value={trial[k]} onChange={(e) => setTrial({ ...trial, [k]: e.target.value })} className={`${erp.input} h-7 w-40 text-right`} placeholder="0" />
                    </label>
                  ))}
                  <div className="text-[13px]">
                    Kết quả:{' '}
                    {trialResult?.err ? (
                      <span className="text-rose-600">{trialResult.err}</span>
                    ) : (
                      <>
                        <b className="text-[#1f5fa8]">{fmtNumber(trialResult?.v ?? null, c.returnKind || 'decimal', c.decimals ?? 2)}</b>
                        {c.showWords && c.returnKind === 'currency' && trialResult?.v ? <span className="block text-[11.5px] italic text-slate-500">{soThanhChu(trialResult.v)}</span> : null}
                      </>
                    )}
                  </div>
                </div>
              )}
              <Check on={!!c.editable} set={(v) => setC({ editable: v })}>
                Cho phép chỉnh sửa
              </Check>
              <Check on={!!c.showWords} set={(v) => setC({ showWords: v })} disabled={c.returnKind !== 'currency'}>
                Hiển thị số viết bằng chữ
              </Check>
            </>
          )}

          {/* ===== Dữ liệu lượt chạy ===== */}
          {f.type === 'runData' && (
            <div>
              <Lbl req>Dữ liệu lấy từ lượt chạy</Lbl>
              <select value={c.source || 'code'} onChange={(e) => setC({ source: e.target.value })} className={erp.inputFull}>
                {RUN_SOURCES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
              <p className="text-[11.5px] text-slate-400 mt-0.5">Hệ thống tự điền khi tạo đơn, người dùng không sửa.</p>
            </div>
          )}

          {/* ===== Dữ liệu kết nối ===== */}
          {f.type === 'linkedData' && (
            <>
              <div>
                <Lbl req>Quy trình nguồn</Lbl>
                <select value={c.linkProcess || ''} onChange={(e) => setC({ linkProcess: e.target.value })} className={`${erp.inputFull} ${E.link ? '!border-rose-400' : ''}`}>
                  <option value="">— Chọn quy trình —</option>
                  {processes.map((p) => (
                    <option key={p.id} value={p.code}>
                      {p.code} — {p.name}
                    </option>
                  ))}
                </select>
                {E.link ? <p className="text-[12px] text-rose-600 mt-0.5">{E.link}</p> : <p className="text-[11.5px] text-slate-400 mt-0.5">Người tạo đơn chọn 1 đơn đã được duyệt của quy trình nguồn (VD: đề nghị tạm ứng khi làm hoàn ứng).</p>}
              </div>
              {hint}
              {required}
            </>
          )}

          {/* ===== Mã số tự sinh ===== */}
          {f.type === 'autoCode' && (
            <>
              <div className="grid grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-[12px] text-slate-500">Tiền tố</span>
                  <input value={c.prefix || ''} onChange={(e) => setC({ prefix: e.target.value.toUpperCase().replace(/\s+/g, '') })} className={erp.inputFull} />
                </label>
                <label className="block">
                  <span className="text-[12px] text-slate-500">Số chữ số thứ tự</span>
                  <input type="number" min={2} max={8} value={c.digits ?? 4} onChange={(e) => setC({ digits: Number(e.target.value) })} className={erp.inputFull} />
                </label>
                <span className="pt-5">
                  <Check on={c.withYear !== false} set={(v) => setC({ withYear: v })}>
                    Gồm năm
                  </Check>
                </span>
              </div>
              <p className="text-[12.5px]">
                Ví dụ: <b className={erp.code}>{autoCodeOf({ ...f, cfg: c }, 'X-0001')}</b> — số thứ tự tăng dần theo đơn của quy trình.
              </p>
            </>
          )}
        </div>
        <div className="flex justify-end gap-2 px-6 py-3 bg-[#f3f4f6] border-t border-slate-200">
          <Btn onClick={onCancel} className="h-9 px-4">
            Huỷ bỏ
          </Btn>
          <Btn variant="primary" onClick={save} className="h-9 px-6" data-testid="fs-save">
            Lưu
          </Btn>
        </div>
      </div>
    </div>
  );
};
