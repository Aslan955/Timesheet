/**
 * ProcessEditor — màn "Tạo / Thiết lập quy trình" (3 cột như phần mềm quy trình mẫu):
 *  Trái  : tên, mô tả chung, mã, phiên bản, nhóm, CÁC BƯỚC THỰC HIỆN (thêm / chèn / xoá, không giới hạn bước),
 *          phân quyền sử dụng, xử lý nhanh, biểu tượng, trạng thái áp dụng.
 *  Giữa  : biểu mẫu của từng bước (thẻ bước) — kéo thả / bấm trường bên phải để thêm, kéo sắp xếp, lên / xuống,
 *          nhân bản, bắt buộc, xoá; mô tả bước + hạn xử lý; người liên quan; hiển thị trường bước 1 ở các bước sau.
 *  Phải  : các loại trường thông tin. Popup thiết lập chi tiết từng loại trường làm ở bản sau.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle, ArrowDown, ArrowUp, Check, ChevronDown, CopyPlus, FolderOpen, GripVertical, Info, PenLine, Plus, Save, Search, Settings2, Trash2, Users, X,
} from 'lucide-react';
import { Btn, ErpTitleBar, Panel, erp } from '../erp/Erp';
import {
  FIELD_TYPES, ME, PERM_LABEL, PROC_COLORS, PROC_GROUPS, PROC_ICONS, PROC_PEOPLE, PROC_UNITS, blankProcess, fieldTypeOf, fmtDateTime, getProcesses, newField, newStep,
  nextCode, nowIsoP, updateProcesses, useProcesses, type FieldType, type PermMode, type ProcField, type ProcStep, type Process,
} from './processStore';
import { ProcIcon } from './ProcIcon';
import { FieldSettings } from './FieldSettings';
import { cfgOf, COL_TYPES, CURRENCIES, RUN_SOURCES } from './processStore';
import { FieldInput, formulaError, initialValue } from './FieldInput';

/** Tóm tắt thiết lập của trường (hiện trên thẻ trường). */
const summaryOf = (f: ProcField): string => {
  const c = cfgOf(f);
  const many = c.multiple ? 'chọn nhiều' : 'chọn một';
  switch (f.type) {
    case 'text':
    case 'textarea':
      return [c.maxLength ? `tối đa ${c.maxLength} ký tự` : '', c.format === 'digits' ? 'chỉ chữ số' : c.format === 'phone' ? 'số điện thoại' : '', c.dependsOn ? 'có trường phụ thuộc' : ''].filter(Boolean).join(' · ');
    case 'select':
      return `${(f.options || []).length} lựa chọn · ${many}${c.display === 'radio' ? ' · nút chọn' : ''}`;
    case 'datetime':
      return [{ date: 'Ngày/tháng/năm', month: 'Tháng/năm', datetime: 'Ngày/tháng/năm Giờ:phút' }[c.dateKind || 'date'], c.dateLimit === 'notPast' ? 'không chọn quá khứ' : c.dateLimit === 'notFuture' ? 'không chọn tương lai' : '', c.defaultToday ? 'mặc định hôm nay' : ''].filter(Boolean).join(' · ');
    case 'address':
      return `${c.addrKind === 'ward' ? 'Phường/Xã' : 'Tỉnh/Thành phố'} · ${many}`;
    case 'number':
      return [{ decimal: 'Số thập phân', integer: 'Số tự nhiên', percent: 'Số phần trăm' }[c.numKind || 'decimal'], c.numSource === 'list' ? `chọn từ ${(c.numOptions || []).length} giá trị` : '', c.min != null ? `≥ ${c.min}` : '', c.max != null ? `≤ ${c.max}` : ''].filter(Boolean).join(' · ');
    case 'currency':
      return [`${c.currency} — ${CURRENCIES.find((x) => x.code === c.currency)?.name}`, c.allowCurrencyChoice ? 'đổi được loại tiền' : '', c.showWords ? 'số bằng chữ' : ''].filter(Boolean).join(' · ');
    case 'employee':
      return [many, c.defaultCreator ? 'mặc định người tạo đơn' : ''].filter(Boolean).join(' · ');
    case 'position':
    case 'org':
      return many;
    case 'catalog':
      return `Danh mục ${c.catalog} · ${many}`;
    case 'file':
      return [`tối đa ${c.maxFiles || '∞'} tệp`, c.accept ? c.accept : '', c.mergeTemplate ? `trộn mẫu ${c.mergeTemplate}` : '', c.signers?.length ? `trình ký ${c.signers.length} người` : ''].filter(Boolean).join(' · ');
    case 'subtask':
      return `${(c.tasks || []).length} công việc${c.requireAll ? ' · bắt buộc hoàn thành hết' : ''}`;
    case 'table':
      return `${(c.columns || []).length} cột: ${(c.columns || []).map((x) => `${x.name}${x.type !== 'text' && x.type !== 'stt' ? ` (${COL_TYPES.find((t) => t.type === x.type)?.label})` : ''}`).join(', ')}`;
    case 'formula':
      return `= ${c.expr || '(chưa có công thức)'}`;
    case 'runData':
      return `Tự điền: ${RUN_SOURCES.find((x) => x.key === c.source)?.label}`;
    case 'linkedData':
      return c.linkProcess ? `Chọn đơn đã duyệt của ${c.linkProcess}` : 'Chưa chọn quy trình nguồn';
    case 'autoCode':
      return `${c.prefix}${c.withYear !== false ? '-năm' : ''}-${'0'.repeat((c.digits || 4) - 1)}1`;
    default:
      return '';
  }
};

const DT_TYPE = 'application/x-qt-type';
const DT_MOVE = 'application/x-qt-move';
const errCls = (e?: string) => (e ? '!border-rose-400 !ring-rose-100' : '');

/** Chọn nhiều (phòng ban, nhân viên, bước…) — nút + danh sách tick. */
const MultiPick: React.FC<{ options: string[]; value: string[]; onChange: (v: string[]) => void; placeholder: string; labelOf?: (v: string) => string; error?: string; testId?: string }> = ({
  options, value, onChange, placeholder, labelOf = (v) => v, error, testId,
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const shown = options.filter((o) => !q || labelOf(o).toLowerCase().includes(q.toLowerCase()));
  const text = value.length ? value.map(labelOf).join(', ') : '';
  return (
    <div ref={ref} className="relative" data-testid={testId}>
      <button type="button" onClick={() => setOpen((o) => !o)} className={`${erp.inputFull} flex items-center gap-1 text-left cursor-pointer ${errCls(error)}`} title={text}>
        <span className={`flex-1 truncate ${text ? '' : 'text-slate-400'}`}>{text || placeholder}</span>
        {value.length > 1 && <span className="shrink-0 rounded bg-[#e8f1fb] text-[#1f5fa8] text-[11px] font-bold px-1">{value.length}</span>}
        <ChevronDown size={14} className="shrink-0 text-slate-400" />
      </button>
      {open && (
        <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-300 rounded-[4px] shadow-lg">
          {options.length > 6 && (
            <div className="p-1.5 border-b border-slate-100">
              <div className="relative">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm..." className={`${erp.inputFull} h-7 pl-6 text-[12px]`} />
              </div>
            </div>
          )}
          <div className="max-h-56 overflow-auto py-1">
            {!shown.length && <p className="px-3 py-2 text-[12px] text-slate-400">Không có lựa chọn</p>}
            {shown.map((o) => {
              const on = value.includes(o);
              return (
                <label key={o} className="flex items-center gap-2 px-3 py-1.5 text-[12.5px] hover:bg-[#eaf2fc] cursor-pointer">
                  <input type="checkbox" className="accent-[#1f5fa8]" checked={on} onChange={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])} />
                  <span className="truncate">{labelOf(o)}</span>
                </label>
              );
            })}
          </div>
          {value.length > 0 && (
            <div className="border-t border-slate-100 px-3 py-1.5 flex justify-between text-[12px]">
              <button type="button" className="text-rose-600 hover:underline cursor-pointer" onClick={() => onChange([])}>
                Bỏ chọn tất cả
              </button>
              <button type="button" className="text-[#1f5fa8] font-semibold hover:underline cursor-pointer" onClick={() => setOpen(false)}>
                Xong
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Lbl: React.FC<{ children: React.ReactNode; required?: boolean; extra?: React.ReactNode }> = ({ children, required, extra }) => (
  <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-700 mb-1">
    {children} {required && <span className="text-rose-600">*</span>}
    {extra}
  </div>
);
const Err: React.FC<{ e?: string }> = ({ e }) => (e ? <p className="text-[11px] text-rose-600 mt-0.5">{e}</p> : null);

export const ProcessEditor: React.FC<{ id: string | null; onBack: () => void; flash: (m: string) => void }> = ({ id, onBack, flash }) => {
  const list = useProcesses();
  const orig = id ? list.find((p) => p.id === id) : undefined;
  const isNew = !orig;
  const [d, setD] = useState<Process>(() => (orig ? structuredClone(orig) : { ...blankProcess(), code: nextCode(getProcesses()) }));
  const [base] = useState(() => JSON.stringify(d));
  const [cur, setCur] = useState(d.steps[0]?.id || '');
  const [tried, setTried] = useState(false);
  const [showDesc, setShowDesc] = useState(!!d.desc);
  const [showStepDesc, setShowStepDesc] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);
  const [leave, setLeave] = useState(false);
  const [over, setOver] = useState<number | null>(null);
  const [armed, setArmed] = useState<string | null>(null);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [edit, setEdit] = useState<{ field: ProcField; isNew: boolean; at?: number } | null>(null);
  const stepRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const iconRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!iconOpen) return;
    const h = (e: MouseEvent) => iconRef.current && !iconRef.current.contains(e.target as Node) && setIconOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [iconOpen]);

  if (id && !orig) return <ErpTitleBar onBack={onBack} title="Quy trình không còn tồn tại" />;

  const dirty = JSON.stringify(d) !== base;
  const set = (patch: Partial<Process>) => setD((x) => ({ ...x, ...patch }));
  const step = d.steps.find((s) => s.id === cur) || d.steps[0];
  const stepIdx = d.steps.indexOf(step);
  const setStep = (sid: string, patch: Partial<ProcStep>) => setD((x) => ({ ...x, steps: x.steps.map((s) => (s.id === sid ? { ...s, ...patch } : s)) }));
  const setFields = (fn: (l: ProcField[]) => ProcField[]) => setStep(step.id, { fields: fn(step.fields) });

  // ---- Các bước
  const insertStep = (after: number) => {
    const s = newStep();
    setD((x) => {
      const steps = [...x.steps];
      steps.splice(after + 1, 0, s);
      return { ...x, steps };
    });
    setCur(s.id);
    requestAnimationFrame(() => stepRefs.current[s.id]?.focus());
  };
  const removeStep = (s: ProcStep, i: number) => {
    if (i === 0) return;
    if (d.steps.length <= 2) return flash('Quy trình cần ít nhất 2 bước: người tạo đơn và 1 bước xử lý');
    setD((x) => ({ ...x, steps: x.steps.filter((y) => y.id !== s.id), quickSteps: x.quickSteps.filter((q) => q !== s.id) }));
    if (cur === s.id) setCur(d.steps[i - 1].id);
    flash(`Đã xoá bước ${i + 1}${s.name ? ` "${s.name}"` : ''}${s.fields.length ? ` cùng ${s.fields.length} trường thông tin` : ''}`);
  };

  // ---- Trường thông tin
  // Thêm trường: mở popup thiết lập, Lưu mới thêm vào biểu mẫu
  const addField = (type: FieldType, at?: number) => setEdit({ field: newField(type), isNew: true, at });
  const saveEdit = (f: ProcField) => {
    if (!edit) return;
    if (edit.isNew)
      setFields((l) => {
        const n = [...l];
        n.splice(edit.at ?? n.length, 0, f);
        return n;
      });
    else setFields((l) => l.map((x) => (x.id === f.id ? f : x)));
    setFocusField(f.id);
    setEdit(null);
  };
  const moveField = (fid: string, to: number) =>
    setFields((l) => {
      const from = l.findIndex((x) => x.id === fid);
      if (from < 0) return l;
      const n = [...l];
      const [f] = n.splice(from, 1);
      n.splice(to > from ? to - 1 : to, 0, f);
      return n;
    });
  const patchField = (fid: string, patch: Partial<ProcField>) => setFields((l) => l.map((x) => (x.id === fid ? { ...x, ...patch } : x)));
  const onDrop = (e: React.DragEvent, at: number) => {
    e.preventDefault();
    const t = e.dataTransfer.getData(DT_TYPE) as FieldType;
    const m = e.dataTransfer.getData(DT_MOVE);
    if (t) addField(t, at);
    else if (m) moveField(m, at);
    setOver(null);
    setArmed(null);
  };
  const overCard = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setOver(e.clientY < r.top + r.height / 2 ? i : i + 1);
  };

  // ---- Kiểm tra & lưu
  const errs: Record<string, string> = {};
  if (!d.name.trim()) errs.name = 'Nhập tên quy trình';
  else if (list.some((p) => p.id !== d.id && p.name.trim().toLowerCase() === d.name.trim().toLowerCase() && p.version.trim() === d.version.trim()))
    errs.name = `Đã có quy trình "${d.name.trim()}" phiên bản ${d.version}`;
  if (!d.version.trim()) errs.version = 'Nhập phiên bản';
  if (!d.group) errs.group = 'Chọn nhóm quy trình';
  const emptySteps = d.steps.map((s, i) => (!s.name.trim() ? i + 1 : 0)).filter(Boolean);
  if (emptySteps.length) errs.steps = `Nhập tên bước ${emptySteps.join(', ')}`;
  if (d.permMode === 'units' && !d.permUnits.length) errs.perm = 'Chọn ít nhất 1 phòng ban / khối';
  if (d.permMode === 'people' && !d.permPeople.length) errs.perm = 'Chọn ít nhất 1 nhân viên';
  const emptyLabels = d.steps.flatMap((s, i) => s.fields.filter((f) => !f.label.trim()).map(() => i + 1));
  if (emptyLabels.length) errs.fields = `Có trường chưa đặt tên ở bước ${[...new Set(emptyLabels)].join(', ')}`;
  const allF = d.steps.flatMap((s) => s.fields);
  const badF = allF.filter((f) => f.type === 'formula' && formulaError(f, allF));
  if (!errs.fields && badF.length) errs.fields = `Công thức lỗi: ${badF.map((f) => `"${f.label}" (${formulaError(f, allF)})`).join(', ')}`;
  const E = tried ? errs : {};

  const save = () => {
    setTried(true);
    if (Object.keys(errs).length) return flash(`Chưa lưu được: ${Object.values(errs)[0]}`);
    const at = nowIsoP();
    const clean: Process = {
      ...d,
      name: d.name.trim(),
      version: d.version.trim(),
      steps: d.steps.map((s) => ({ ...s, name: s.name.trim(), fields: s.fields.map((f) => ({ ...f, label: f.label.trim() })) })),
      updatedAt: at,
    };
    if (isNew) {
      clean.createdAt = at;
      clean.history = [{ at, by: ME, action: 'Tạo quy trình' }];
      updateProcesses((l) => [clean, ...l]);
      flash(`Đã tạo quy trình ${clean.code} — ${clean.name} (${clean.steps.length} bước)`);
    } else {
      const o = orig!;
      const parts = [
        (o.name !== clean.name || o.desc !== clean.desc || o.version !== clean.version || o.group !== clean.group || o.icon !== clean.icon || o.color !== clean.color) && 'thông tin chung',
        JSON.stringify(o.steps.map((s) => [s.name, s.desc, s.deadlineDays])) !== JSON.stringify(clean.steps.map((s) => [s.name, s.desc, s.deadlineDays])) || o.unlimitedSteps !== clean.unlimitedSteps ? 'các bước' : '',
        JSON.stringify(o.steps.map((s) => s.fields)) !== JSON.stringify(clean.steps.map((s) => s.fields)) && 'trường thông tin',
        (o.permMode !== clean.permMode || o.permUnits.join() !== clean.permUnits.join() || o.permPeople.join() !== clean.permPeople.join()) && 'phân quyền',
        (o.quickSteps.join() !== clean.quickSteps.join() || o.related.join() !== clean.related.join() || o.showStep1 !== clean.showStep1 || o.active !== clean.active) && 'thiết lập khác',
      ].filter(Boolean);
      clean.history = [...o.history, { at, by: ME, action: `Cập nhật ${parts.join(', ') || 'quy trình'}` }];
      updateProcesses((l) => l.map((p) => (p.id === clean.id ? clean : p)));
      flash(`Đã lưu quy trình ${clean.code}${o.requests ? ` — ${o.requests} đơn đang chạy giữ nguyên các bước cũ, đơn tạo mới dùng thiết lập này` : ''}`);
    }
    onBack();
  };
  const tryBack = () => (dirty ? setLeave(true) : onBack());

  const s1 = d.steps[0];
  const ICON = PROC_ICONS;
  const stepOpts = d.steps.slice(1).map((s) => s.id);
  const stepLabel = (sid: string) => {
    const i = d.steps.findIndex((s) => s.id === sid);
    return `Bước ${i + 1}${d.steps[i]?.name ? `: ${d.steps[i].name}` : ''}`;
  };

  return (
    <>
      <ErpTitleBar
        onBack={tryBack}
        title={
          <span className="flex items-center gap-2">
            {isNew ? 'Tạo quy trình' : 'Thiết lập quy trình'}
            {!isNew && <span className={`${erp.code} text-[13px]`}>{d.code}</span>}
            {dirty && <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5">Chưa lưu</span>}
          </span>
        }
        actions={
          <>
            <Btn onClick={tryBack}>Huỷ bỏ</Btn>
            <Btn variant="primary" icon={Save} onClick={save} data-testid="proc-save">
              Lưu
            </Btn>
          </>
        }
        notice={
          leave ? (
            <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-amber-50 text-[12.5px] text-amber-800">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="flex-1 min-w-[240px]">Quy trình có thay đổi chưa lưu. Rời màn hình sẽ mất các thay đổi này.</span>
              <Btn className="h-7" onClick={() => setLeave(false)}>
                Ở lại
              </Btn>
              <Btn variant="danger" className="h-7" onClick={onBack}>
                Bỏ thay đổi
              </Btn>
            </div>
          ) : tried && Object.keys(errs).length ? (
            <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-rose-50 text-[12.5px] text-rose-700">
              <AlertTriangle size={14} className="shrink-0" /> Chưa lưu được: {Object.values(errs).join(' · ')}
            </div>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[330px_minmax(0,1fr)_220px] gap-3 items-start">
        {/* ============ Cột trái: thông tin & các bước ============ */}
        <Panel title="Thông tin quy trình">
          <div className="space-y-3.5">
            <div>
              <Lbl required>Tên quy trình</Lbl>
              <input value={d.name} onChange={(e) => set({ name: e.target.value })} placeholder="VD: Đề nghị thanh toán" className={`${erp.inputFull} ${errCls(E.name)}`} data-testid="proc-name" />
              <Err e={E.name} />
              {showDesc ? (
                <textarea
                  rows={3}
                  value={d.desc}
                  onChange={(e) => set({ desc: e.target.value })}
                  placeholder="Mô tả chung: mục đích, phạm vi áp dụng, lưu ý khi tạo đơn…"
                  className="mt-1.5 w-full border border-slate-300 rounded-[3px] px-2 py-1.5 text-[12.5px] outline-none focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#1f5fa8]/15"
                />
              ) : (
                <button type="button" onClick={() => setShowDesc(true)} className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] text-[#1f5fa8] hover:underline cursor-pointer">
                  <PenLine size={13} /> Mô tả chung
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Lbl>Mã quy trình</Lbl>
                <input value={d.code} readOnly className={`${erp.inputFull} bg-slate-50 text-slate-600 font-mono`} title="Hệ thống tự sinh" />
              </div>
              <div>
                <Lbl required>Phiên bản</Lbl>
                <input value={d.version} onChange={(e) => set({ version: e.target.value })} placeholder="1.0" className={`${erp.inputFull} ${errCls(E.version)}`} />
                <Err e={E.version} />
              </div>
            </div>
            <div>
              <Lbl required>Nhóm quy trình</Lbl>
              <select value={d.group} onChange={(e) => set({ group: e.target.value })} className={`${erp.inputFull} ${errCls(E.group)}`} data-testid="proc-group">
                <option value="">— Chọn nhóm —</option>
                {PROC_GROUPS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
              <Err e={E.group} />
            </div>

            {/* Các bước thực hiện */}
            <div>
              <Lbl required>Các bước thực hiện</Lbl>
              <label className="flex items-start gap-2 text-[12.5px] text-slate-700 cursor-pointer mb-2" title="Người xử lý bước cuối được chuyển tiếp đơn cho thêm người khác xử lý (không giới hạn số bước)">
                <input type="checkbox" className="mt-0.5 accent-[#1f5fa8]" checked={d.unlimitedSteps} onChange={(e) => set({ unlimitedSteps: e.target.checked })} />
                <span>
                  Không giới hạn bước thực hiện
                  <span className="block text-[11px] text-slate-400">Người xử lý bước cuối được chuyển tiếp thêm người xử lý</span>
                </span>
              </label>
              <div className="relative" data-testid="proc-steps">
                <span className="absolute left-[11px] top-4 bottom-4 w-px bg-slate-300" />
                {d.steps.map((s, i) => {
                  const active = s.id === step.id;
                  return (
                    <div key={s.id} className="group relative flex items-center gap-2 py-1">
                      <button
                        type="button"
                        onClick={() => setCur(s.id)}
                        className={`relative z-[1] w-6 h-6 shrink-0 rounded-[3px] border text-[12px] font-bold cursor-pointer ${active ? 'bg-[#1f5fa8] border-[#1f5fa8] text-white' : 'bg-white border-slate-300 text-[#1f5fa8] hover:border-[#1f5fa8]'}`}
                        title={`Thiết lập biểu mẫu bước ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                      <input
                        ref={(el) => void (stepRefs.current[s.id] = el)}
                        value={s.name}
                        onFocus={() => setCur(s.id)}
                        onChange={(e) => setStep(s.id, { name: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), insertStep(i))}
                        placeholder={i === 0 ? 'Người tạo đơn (VD: Người đề nghị)' : 'Nhập tên bước'}
                        className={`${erp.inputFull} ${active ? '!border-[#1f5fa8] ring-2 ring-[#1f5fa8]/15' : ''} ${tried && !s.name.trim() ? '!border-rose-400' : ''}`}
                      />
                      <span className={`flex items-center shrink-0 ${active ? '' : 'opacity-0 group-hover:opacity-100'}`}>
                        <button type="button" onClick={() => insertStep(i)} className="p-0.5 rounded-full text-[#1f5fa8] hover:bg-[#eaf2fc] cursor-pointer" title="Thêm bước ngay sau bước này (Enter)">
                          <Plus size={15} />
                        </button>
                        <button
                          type="button"
                          disabled={i === 0}
                          onClick={() => removeStep(s, i)}
                          className="p-0.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer disabled:invisible"
                          title="Xoá bước"
                        >
                          <X size={15} />
                        </button>
                      </span>
                    </div>
                  );
                })}
              </div>
              <button type="button" onClick={() => insertStep(d.steps.length - 1)} className="mt-1 ml-8 inline-flex items-center gap-1 text-[12.5px] text-[#1f5fa8] hover:underline cursor-pointer">
                <Plus size={13} /> Thêm bước
              </button>
              <Err e={E.steps} />
              <p className="text-[11px] text-slate-400 mt-1">Bước 1 luôn là người tạo đơn. Người xử lý mỗi bước sau do người xử lý bước trước chọn khi chuyển đơn.</p>
            </div>

            <div>
              <Lbl>Phân quyền sử dụng</Lbl>
              <select value={d.permMode} onChange={(e) => set({ permMode: e.target.value as PermMode })} className={erp.inputFull}>
                {(Object.keys(PERM_LABEL) as PermMode[]).map((k) => (
                  <option key={k} value={k}>
                    {PERM_LABEL[k]}
                  </option>
                ))}
              </select>
              {d.permMode === 'units' && (
                <div className="mt-1.5">
                  <MultiPick options={PROC_UNITS} value={d.permUnits} onChange={(v) => set({ permUnits: v })} placeholder="Chọn phòng ban / khối được tạo đơn" error={E.perm} />
                </div>
              )}
              {d.permMode === 'people' && (
                <div className="mt-1.5">
                  <MultiPick options={PROC_PEOPLE} value={d.permPeople} onChange={(v) => set({ permPeople: v })} placeholder="Chọn nhân viên được tạo đơn" error={E.perm} />
                </div>
              )}
              <Err e={E.perm} />
            </div>

            <div>
              <Lbl
                extra={
                  <span title="Người xử lý ở các bước được chọn có thể duyệt ngay trên danh sách đơn (không cần mở chi tiết đơn)">
                    <Info size={13} className="text-slate-400" />
                  </span>
                }
              >
                Xử lý nhanh
              </Lbl>
              <MultiPick options={stepOpts} value={d.quickSteps.filter((q) => stepOpts.includes(q))} onChange={(v) => set({ quickSteps: v })} placeholder="Chọn bước có thể xử lý nhanh" labelOf={stepLabel} testId="proc-quick" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div ref={iconRef} className="relative">
                <Lbl>Biểu tượng</Lbl>
                <button type="button" onClick={() => setIconOpen((o) => !o)} className="w-[72px] h-[64px] rounded-[4px] border border-slate-300 bg-[#f7f9fc] hover:border-[#1f5fa8] flex items-center justify-center cursor-pointer" title="Đổi biểu tượng">
                  <ProcIcon p={d} size={38} />
                </button>
                {iconOpen && (
                  <div className="absolute z-30 left-0 mt-1 w-[260px] bg-white border border-slate-300 rounded-[4px] shadow-lg p-2.5">
                    <div className="grid grid-cols-6 gap-1.5">
                      {Object.keys(ICON).map((k) => (
                        <button key={k} type="button" onClick={() => set({ icon: k })} className={`rounded-[4px] p-0.5 cursor-pointer ${d.icon === k ? 'ring-2 ring-[#1f5fa8]' : 'hover:bg-slate-100'}`}>
                          <ProcIcon p={{ icon: k, color: d.color }} size={32} />
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
                      {Object.entries(PROC_COLORS).map(([k, c]) => (
                        <button key={k} type="button" onClick={() => set({ color: k })} className={`w-6 h-6 rounded-full cursor-pointer ${c.bg} border border-slate-200 ${d.color === k ? `ring-2 ${c.ring} ring-offset-1` : ''}`} title={k} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Lbl>Trạng thái</Lbl>
                <label className="flex items-center gap-2 h-8 cursor-pointer">
                  <input type="checkbox" className="accent-[#0f8f6c] w-4 h-4" checked={d.active} onChange={(e) => set({ active: e.target.checked })} />
                  <span className={`text-[12.5px] font-semibold ${d.active ? 'text-emerald-700' : 'text-slate-500'}`}>{d.active ? 'Đang áp dụng' : 'Ngừng / nháp'}</span>
                </label>
              </div>
            </div>
          </div>
        </Panel>

        {/* ============ Cột giữa: biểu mẫu theo bước ============ */}
        <Panel
          title={`Biểu mẫu bước ${stepIdx + 1}${step.name ? `: ${step.name}` : ''}`}
          noPad
          actions={
            <button type="button" onClick={() => setShowStepDesc((o) => !o)} className="inline-flex items-center gap-1 text-[12.5px] text-[#1f5fa8] hover:underline cursor-pointer">
              <PenLine size={13} /> Mô tả bước
              {(step.desc || step.deadlineDays) && <Check size={12} className="text-emerald-600" />}
            </button>
          }
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 px-4 py-2 border-b border-slate-200 text-[12.5px] text-slate-600">
            <span>
              ID: <b className="font-mono text-slate-800">{isNew ? '—' : d.code}</b>
            </span>
            <span className="w-px h-4 bg-slate-300" />
            <span>
              Người tạo: <b className="text-slate-800">{isNew ? '—' : d.createdBy}</b>
            </span>
            <span className="w-px h-4 bg-slate-300" />
            <span>
              Ngày tạo: <b className="text-slate-800">{isNew ? '—' : fmtDateTime(d.createdAt)}</b>
            </span>
          </div>
          {/* Thẻ bước */}
          <div className="flex flex-wrap gap-1 px-3 pt-2.5" data-testid="proc-step-tabs">
            {d.steps.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCur(s.id)}
                className={`h-7 px-2.5 rounded-[3px] border text-[12px] cursor-pointer max-w-[220px] truncate ${s.id === step.id ? 'bg-[#1f5fa8] border-[#1f5fa8] text-white font-semibold' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                title={s.name}
              >
                {i + 1}. {s.name || 'Chưa đặt tên'}
                <span className={`ml-1.5 text-[11px] ${s.id === step.id ? 'text-white/80' : 'text-slate-400'}`}>({s.fields.length})</span>
              </button>
            ))}
          </div>
          {showStepDesc && (
            <div className="mx-3 mt-2.5 rounded-[4px] border border-[#cfe0f5] bg-[#f5f9ff] p-2.5 grid grid-cols-1 md:grid-cols-[1fr_200px] gap-2">
              <div>
                <div className="text-[12px] font-semibold text-slate-600 mb-1">Mô tả bước {stepIdx + 1} (hướng dẫn người xử lý)</div>
                <textarea
                  rows={2}
                  value={step.desc}
                  onChange={(e) => setStep(step.id, { desc: e.target.value })}
                  placeholder={stepIdx === 0 ? 'VD: Đính kèm đủ hoá đơn, hợp đồng trước khi gửi' : 'VD: Kiểm tra chứng từ, đối chiếu ngân sách dự án'}
                  className="w-full border border-slate-300 rounded-[3px] px-2 py-1.5 text-[12.5px] outline-none focus:border-[#1f5fa8] bg-white"
                />
              </div>
              <div>
                <div className="text-[12px] font-semibold text-slate-600 mb-1">Hạn xử lý</div>
                <span className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    value={step.deadlineDays ?? ''}
                    disabled={stepIdx === 0}
                    onChange={(e) => setStep(step.id, { deadlineDays: e.target.value === '' ? null : Math.max(0, Number(e.target.value)) })}
                    placeholder="Không giới hạn"
                    className={`${erp.input} w-36`}
                  />
                  <span className="text-[12px] text-slate-500">ngày</span>
                </span>
                {stepIdx === 0 && <span className="block text-[11px] text-slate-400 mt-0.5">Bước tạo đơn không có hạn</span>}
              </div>
            </div>
          )}

          {/* Trường bước 1 hiển thị ở các bước sau */}
          {stepIdx > 0 && d.showStep1 && s1.fields.length > 0 && (
            <div className="mx-3 mt-2.5 rounded-[4px] border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] text-slate-600">
              <span className="font-semibold">Người xử lý bước {stepIdx + 1} xem được {s1.fields.length} trường của bước 1 (chỉ đọc):</span>{' '}
              {s1.fields.map((f) => f.label).join(' · ')}
            </div>
          )}

          {/* Canvas biểu mẫu */}
          <div className="p-3" onDragLeave={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOver(null)} data-testid="proc-canvas">
            {step.fields.length === 0 ? (
              <div
                onDragOver={(e) => (e.preventDefault(), setOver(0))}
                onDrop={(e) => onDrop(e, 0)}
                className={`rounded-[6px] border-2 border-dashed py-10 px-4 text-center transition-colors ${over !== null ? 'border-[#1f5fa8] bg-[#eef5ff]' : 'border-slate-300 bg-[#fafcff]'}`}
              >
                <div className="mx-auto w-20 h-20 rounded-full bg-[#e8f1fb] flex items-center justify-center mb-3">
                  <FolderOpen size={40} className="text-[#5b9be0]" />
                </div>
                <p className="text-[13px] text-slate-600">Kéo và thả hoặc nhấp chuột vào các nút bấm ở bên phải để tạo biểu mẫu</p>
                <p className="text-[11.5px] text-slate-400 mt-1">
                  {stepIdx === 0 ? 'Bước 1: thông tin người tạo đơn điền khi lập đơn' : `Bước ${stepIdx + 1}: để trống nếu người xử lý chỉ cần duyệt / từ chối và ghi ý kiến`}
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {step.fields.map((f, i) => {
                  const T = fieldTypeOf(f.type);
                  return (
                    <React.Fragment key={f.id}>
                      <div className={`h-1.5 rounded-full transition-colors ${over === i ? 'bg-[#1f5fa8]' : 'bg-transparent'}`} />
                      <div
                        draggable={armed === f.id}
                        onDragStart={(e) => (e.dataTransfer.setData(DT_MOVE, f.id), (e.dataTransfer.effectAllowed = 'move'))}
                        onDragEnd={() => (setArmed(null), setOver(null))}
                        onDragOver={(e) => overCard(e, i)}
                        onDrop={(e) => onDrop(e, over ?? i)}
                        className={`group flex items-start gap-2 rounded-[4px] border bg-white px-2 py-2 ${armed === f.id ? 'opacity-50' : ''} ${focusField === f.id ? 'border-[#1f5fa8] ring-2 ring-[#1f5fa8]/15' : 'border-slate-300 hover:border-slate-400'}`}
                        data-testid="proc-field"
                      >
                        <span onMouseDown={() => setArmed(f.id)} onMouseUp={() => setArmed(null)} className="mt-1.5 text-slate-400 cursor-grab active:cursor-grabbing" title="Kéo để sắp xếp">
                          <GripVertical size={15} />
                        </span>
                        {/* Xem trước trường đúng như trên biểu mẫu quy trình — bấm để thiết lập */}
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => (setFocusField(f.id), setEdit({ field: f, isNew: false }))} title="Bấm để thiết lập trường" data-testid="field-preview">
                          <div className="grid grid-cols-[170px_minmax(0,1fr)] gap-x-3 items-start">
                            <span className={`text-[12.5px] pt-1.5 leading-tight ${f.label.trim() ? 'text-slate-700' : 'text-rose-600 italic'}`}>
                              {f.label.trim() || '(chưa đặt tên trường)'}
                              {f.required && !['formula', 'autoCode', 'runData'].includes(f.type) && <span className="text-rose-600"> *</span>}
                            </span>
                            <span className="min-w-0 pointer-events-none select-none" aria-hidden>
                              <FieldInput f={f} v={initialValue(f, 'Người tạo đơn') ?? ''} onChange={() => {}} ctx={{ fields: step.fields, values: {}, req: { code: 'DON-2026-0001', creator: 'Người tạo đơn', createdAt: new Date().toISOString(), submittedAt: null, processName: d.name || 'Quy trình', version: d.version, unit: 'Phòng ban' } }} />
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5 pl-[182px] text-[11px] text-slate-400">
                            <T.icon size={11} className="shrink-0" />
                            <span className="shrink-0">{T.label}</span>
                            {summaryOf(f) && <span className="truncate">· {summaryOf(f)}</span>}
                            {f.type === 'formula' && formulaError(f, d.steps.flatMap((x) => x.fields)) && <span className="text-rose-600 shrink-0">⚠ {formulaError(f, d.steps.flatMap((x) => x.fields))}</span>}
                          </div>
                        </div>
                        <span className="flex items-center shrink-0 opacity-60 group-hover:opacity-100">
                          <button type="button" disabled={i === 0} onClick={() => moveField(f.id, i - 1)} className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer" title="Lên">
                            <ArrowUp size={14} />
                          </button>
                          <button type="button" disabled={i === step.fields.length - 1} onClick={() => moveField(f.id, i + 2)} className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer" title="Xuống">
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setFields((l) => [...l.slice(0, i + 1), { ...f, id: newField(f.type).id, label: `${f.label} (2)` }, ...l.slice(i + 1)])}
                            className="p-1 rounded text-slate-500 hover:bg-slate-100 cursor-pointer"
                            title="Nhân bản"
                          >
                            <CopyPlus size={14} />
                          </button>
                          <button type="button" onClick={() => setEdit({ field: f, isNew: false })} className="p-1 rounded text-[#1f5fa8] hover:bg-[#eaf2fc] cursor-pointer" title={`Thiết lập trường "${T.label}"`} data-testid="field-gear">
                            <Settings2 size={14} />
                          </button>
                          <button type="button" onClick={() => setFields((l) => l.filter((x) => x.id !== f.id))} className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer" title="Xoá trường">
                            <Trash2 size={14} />
                          </button>
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div
                  onDragOver={(e) => (e.preventDefault(), setOver(step.fields.length))}
                  onDrop={(e) => onDrop(e, step.fields.length)}
                  className={`mt-1.5 rounded-[4px] border border-dashed py-3 text-center text-[12px] transition-colors ${over === step.fields.length ? 'border-[#1f5fa8] bg-[#eef5ff] text-[#1f5fa8]' : 'border-slate-300 text-slate-400'}`}
                >
                  Thả trường vào đây hoặc bấm loại trường bên phải để thêm vào cuối biểu mẫu
                </div>
              </div>
            )}
            {E.fields && <Err e={E.fields} />}
          </div>

          {/* Người liên quan */}
          <div className="border-t border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Users size={14} className="text-slate-500" />
              <span className="text-[12.5px] font-semibold text-slate-700">Người liên quan</span>
              <span className="text-[11px] text-slate-400">— nhận thông báo và xem được mọi đơn của quy trình</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {d.related.map((r) => (
                <span key={r} className="inline-flex items-center gap-1 rounded-full bg-[#e8f1fb] text-[#1f5fa8] text-[12px] pl-2.5 pr-1 py-0.5">
                  {r}
                  <button type="button" onClick={() => set({ related: d.related.filter((x) => x !== r) })} className="p-0.5 rounded-full hover:bg-white cursor-pointer" title="Bỏ">
                    <X size={11} />
                  </button>
                </span>
              ))}
              <div className="w-56">
                <MultiPick options={PROC_PEOPLE} value={d.related} onChange={(v) => set({ related: v })} placeholder="+ Thêm người liên quan" />
              </div>
            </div>
          </div>
          <label className="flex items-start gap-2 border-t border-slate-200 px-4 py-3 cursor-pointer">
            <input type="checkbox" className="mt-0.5 accent-[#1f5fa8]" checked={d.showStep1} onChange={(e) => set({ showStep1: e.target.checked })} />
            <span className="text-[12.5px] text-slate-700">
              Hiển thị các trường thông tin của bước 1 ở các bước sau
              <span className="block text-[11px] italic text-slate-400">Sử dụng khi tất cả các bước sau đều cần xem lại thông tin ở bước 1</span>
            </span>
          </label>
        </Panel>

        {/* ============ Cột phải: loại trường ============ */}
        <Panel title="Trường thông tin" noPad footer="Bấm để thêm vào biểu mẫu bước đang chọn (mở popup thiết lập trường), hoặc kéo thả vào vị trí mong muốn.">
          <div className="py-1 xl:max-h-[calc(100vh-230px)] overflow-auto" data-testid="proc-palette">
            {FIELD_TYPES.map((t) => (
              <button
                key={t.type}
                type="button"
                draggable
                onDragStart={(e) => (e.dataTransfer.setData(DT_TYPE, t.type), (e.dataTransfer.effectAllowed = 'copy'))}
                onDragEnd={() => setOver(null)}
                onClick={() => addField(t.type)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] text-slate-700 hover:bg-[#eaf2fc] hover:text-[#1f5fa8] cursor-grab active:cursor-grabbing text-left"
                title={`Thêm trường "${t.label}" vào bước ${stepIdx + 1}`}
              >
                <t.icon size={16} className="text-slate-500 shrink-0" />
                {t.label}
              </button>
            ))}
          </div>
        </Panel>
      </div>
      {edit && (
        <FieldSettings
          field={edit.field}
          isNew={edit.isNew}
          stepFields={step.fields}
          allFields={edit.isNew ? [...allF, edit.field] : allF}
          processes={list}
          onSave={saveEdit}
          onCancel={() => setEdit(null)}
        />
      )}
    </>
  );
};

export default ProcessEditor;
