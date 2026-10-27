/**
 * ContractTemplatePage — "Template hợp đồng" (Human Resources): cấu hình file Word mẫu dùng khi In hợp đồng / phụ lục.
 *  - Danh sách template: loại (Hợp đồng / Phụ lục), áp dụng cho loại HĐ / loại phụ lục, công ty, file Word, trường trộn, trạng thái.
 *  - Chi tiết (trên trang, không popup): thông tin · tải lên file .docx (kiểm tra trường trộn) · danh sách trường trộn (bấm để sao chép)
 *    · Xem trước với dữ liệu 1 hợp đồng thật · Tải bản trộn thử · Lịch sử.
 *  Quy tắc: mỗi loại HĐ (hoặc loại phụ lục) + công ty chỉ có 1 template đang dùng; template riêng của công ty ưu tiên hơn template chung.
 *  In HĐ ở màn Hợp đồng: có template → tạo file Word đã trộn; chưa có → bản in mặc định.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Check, CheckCircle2, ClipboardCopy, Download, Eye, FileCog, FileSignature, FileText, History, LayoutList, Pencil, Plus, Save, Search, Table2, Trash2, Upload, X } from 'lucide-react';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, KpiBox, Panel, Segmented, Tag, erp } from '../erp/Erp';
import { CheckBox, DateInput, InfoGrid, dmy, today } from '../EmployeePage';
import { mergeDataOf, useContractStore, type Contract, type Worker } from '../ContractsPage';
import { FIELDS, FIELD_GROUPS, FIELD_KEYS, SAMPLE_FILES, TPL_KIND_LABEL, getCatalog, updateCatalog, useCatalog, type TemplateDef, type TplKind } from './catalog';
import { FIELD_RE, MF_RE, downloadBytes, inspectDocx, mergeDocx, type DocLine } from './docx';
import { ACTIVE_TAG, ErrText, INACTIVE_TAG, INPUT, LINK, ME, errCls, fileSize, fmtAt, lb, nowIso, uid, useFlash } from './ui';

const CRUMBS = ['Human Resources', 'Template hợp đồng'];
type Mode = { kind: 'list' } | { kind: 'detail'; id: string; edit?: boolean } | { kind: 'new' };

export const ContractTemplatePage: React.FC = () => {
  const [mode, setMode] = useState<Mode>({ kind: 'list' });
  const { flash, toast } = useFlash();
  return (
    <ErpPage>
      {toast}
      {mode.kind === 'list' ? <TemplateList setMode={setMode} /> : <TemplateDetail key={mode.kind === 'detail' ? mode.id : 'new'} mode={mode} setMode={setMode} flash={flash} />}
    </ErpPage>
  );
};

const targetName = (t: Pick<TemplateDef, 'kind'>, id: string) => {
  const c = getCatalog();
  return (t.kind !== 'PL' ? c.types.find((x) => x.id === id) : c.appendix.find((x) => x.id === id))?.name || id;
};
const unknownOf = (t: Pick<TemplateDef, 'fields'>) => t.fields.filter((f) => !FIELD_KEYS.has(f.normalize('NFC')));
const KIND_TAG: Record<TplKind, string> = { HD: 'bg-sky-50 text-sky-700 border-sky-300', KT: 'bg-violet-50 text-violet-700 border-violet-300', PL: 'bg-amber-50 text-amber-700 border-amber-300' };
const safe = (s: string) => s.replace(/[\\/:*?"<>|]+/g, '_');

// ==========================================================================
// Danh sách
// ==========================================================================
const TemplateList: React.FC<{ setMode: (m: Mode) => void }> = ({ setMode }) => {
  const cat = useCatalog();
  const [kind, setKind] = useState<'' | TplKind>('');
  const [q, setQ] = useState('');
  const rows = cat.templates.filter((t) => (!kind || t.kind === kind) && (!q || `${t.code} ${t.name} ${t.fileName}`.toLowerCase().includes(q.toLowerCase())));
  // Đủ template = mọi công ty đang dùng đều có mẫu (mẫu chung hoặc mẫu riêng của công ty)
  const covered = (k: TplKind, id: string) =>
    cat.companies.filter((co) => co.active).every((co) => cat.templates.some((t) => t.active && t.kind === k && t.data && t.appliesTo.includes(id) && (!t.companyId || t.companyId === co.id)));
  const typesNo = cat.types.filter((t) => t.active && !covered('HD', t.id));
  const appNo = cat.appendix.filter((a) => a.active && !covered('PL', a.id));
  const th = `${erp.th} border-t-0 text-left`;
  return (
    <>
      <ErpTitleBar
        crumbs={CRUMBS}
        title="Cấu hình template hợp đồng"
        actions={
          <>
            <Btn icon={Download} onClick={() => downloadBytes(SAMPLE_FILES.allFields(), 'danh-sach-truong-tron.docx')} title="File Word liệt kê toàn bộ trường trộn — dùng làm điểm bắt đầu cho mẫu mới">
              Tải file mẫu (đủ trường trộn)
            </Btn>
            <Btn variant="primary" icon={Plus} onClick={() => setMode({ kind: 'new' })}>
              Thêm template
            </Btn>
          </>
        }
        notice={
          <div className="flex items-start gap-2 px-4 py-1.5 bg-slate-50 text-[12px] text-slate-600">
            <FileCog size={13} className="shrink-0 mt-0.5 text-[#1f5fa8]" />
            <span>
              Template là file Word (.docx) có trường trộn — dùng được file trộn thư sẵn có của Word (<code className="px-1 rounded bg-white border border-slate-200 text-[#1f5fa8]">«Họ_và_tên»</code>) hoặc gõ <code className="px-1 rounded bg-white border border-slate-200 text-[#1f5fa8]">{'{{Họ_và_tên}}'}</code>. Khi bấm <b>In HĐ</b> ở màn Hợp đồng, hệ thống chọn template đang
              dùng theo <b>loại hợp đồng</b> (ưu tiên template riêng của <b>công ty ký HĐ</b>), trộn dữ liệu và tạo file Word.
            </span>
          </div>
        }
      />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiBox label="Tổng số template" value={cat.templates.length} valueText="1" sub={`${cat.templates.filter((t) => t.kind === 'HD').length} hợp đồng · ${cat.templates.filter((t) => t.kind === 'PL').length} phụ lục`} />
        <KpiBox label="Đang sử dụng" value={cat.templates.filter((t) => t.active).length} valueText="1" tone="good" sub="Được dùng khi in" />
        <KpiBox
          label="Loại HĐ chưa có template"
          value={typesNo.length}
          valueText="1"
          tone={typesNo.length ? 'bad' : 'good'}
          sub={typesNo.length ? typesNo.map((t) => t.name).join(', ') : 'Tất cả loại HĐ đã có template'}
        />
        <KpiBox label="Loại phụ lục chưa có template" value={appNo.length} valueText="1" tone={appNo.length ? 'bad' : 'good'} sub={appNo.length ? appNo.map((t) => t.name).join(', ') : 'Đủ template'} />
      </div>
      <Panel
        title="Danh sách template"
        icon={Table2}
        noPad
        actions={
          <>
            <Segmented
              options={[
                { key: '', label: 'Tất cả' },
                { key: 'HD', label: 'Hợp đồng' },
                { key: 'PL', label: 'Phụ lục' },
              ]}
              value={kind}
              onChange={setKind}
            />
            <div className="relative w-60">
              <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã, tên template, tên file..." className={`${erp.inputFull} h-7 pl-7`} />
            </div>
          </>
        }
        footer={`${rows.length} / ${cat.templates.length} template · Bấm vào dòng để xem / sửa`}
      >
        <div className="overflow-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${th} border-l-0 w-12 !text-center`}>STT</th>
                {['Mã', 'Tên template', 'Loại', 'Áp dụng cho', 'Công ty', 'File Word', 'Trường trộn', 'Cập nhật', 'Trạng thái'].map((h) => (
                  <th key={h} className={th}>
                    {h}
                  </th>
                ))}
                <th className={`${th} border-r-0 w-24 !text-center`}>Tải file</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t, i) => {
                const unk = unknownOf(t);
                return (
                  <tr key={t.id} className={`${erp.tr} cursor-pointer`} onClick={() => setMode({ kind: 'detail', id: t.id })}>
                    <td className={`${erp.td} border-l-0 text-center text-slate-500`}>{i + 1}</td>
                    <td className={`${erp.td} ${erp.code} font-semibold whitespace-nowrap`}>{t.code}</td>
                    <td className={`${erp.td} font-semibold text-slate-800`}>{t.name}</td>
                    <td className={erp.td}>
                      <Tag cls={KIND_TAG[t.kind]}>{TPL_KIND_LABEL[t.kind]}</Tag>
                    </td>
                    <td className={erp.td}>{t.appliesTo.map((id) => targetName(t, id)).join(', ') || <span className="text-rose-600">Chưa chọn</span>}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{t.companyId ? getCatalog().companies.find((c) => c.id === t.companyId)?.shortName : <i className="text-slate-500">Tất cả công ty</i>}</td>
                    <td className={erp.td}>
                      {t.data ? (
                        <span className="inline-flex items-center gap-1.5">
                          <FileText size={13} className="text-[#1f5fa8]" />
                          {t.fileName} <span className="text-slate-400">({fileSize(t.size)})</span>
                        </span>
                      ) : (
                        <span className="text-rose-600">Chưa có file</span>
                      )}
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>
                      {t.fields.length} trường{unk.length > 0 && <span className="text-rose-600"> · {unk.length} không hợp lệ</span>}
                    </td>
                    <td className={`${erp.td} whitespace-nowrap text-slate-600`}>
                      {dmy(t.uploadedAt.slice(0, 10))} · {t.uploadedBy}
                    </td>
                    <td className={erp.td}>
                      <Tag cls={t.active ? ACTIVE_TAG : INACTIVE_TAG}>{t.active ? 'Đang sử dụng' : 'Ngừng sử dụng'}</Tag>
                    </td>
                    <td className={`${erp.td} border-r-0 text-center`} onClick={(e) => e.stopPropagation()}>
                      {t.data && (
                        <button type="button" className={LINK} onClick={() => downloadBytes(t.data!, t.fileName)}>
                          <Download size={13} /> .docx
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={11} className="px-3 py-10 text-center text-slate-400">
                    Chưa có template.
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
// Chi tiết / thêm / sửa
// ==========================================================================
const TemplateDetail: React.FC<{ mode: Exclude<Mode, { kind: 'list' }>; setMode: (m: Mode) => void; flash: (m: string) => void }> = ({ mode, setMode, flash }) => {
  const cat = useCatalog();
  const isNew = mode.kind === 'new';
  const orig = mode.kind === 'detail' ? cat.templates.find((t) => t.id === mode.id) : undefined;
  const [f, setF] = useState<TemplateDef>(() =>
    orig
      ? { ...orig, appliesTo: [...orig.appliesTo], history: [...orig.history] }
      : { id: `tp-${uid()}`, code: '', name: '', kind: 'HD', appliesTo: [], companyId: '', fileName: '', size: 0, data: null, fields: [], uploadedAt: nowIso(), uploadedBy: ME, active: true, note: '', history: [] },
  );
  const [editing, setEditing] = useState(isNew || (mode.kind === 'detail' && !!mode.edit));
  const [tab, setTab] = useState<'config' | 'preview' | 'history'>('config');
  const [tried, setTried] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [newFile, setNewFile] = useState(false);
  const [upErr, setUpErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  if (mode.kind === 'detail' && !orig) return <ErpTitleBar onBack={() => setMode({ kind: 'list' })} title="Template không còn tồn tại" />;

  const targets = f.kind !== 'PL' ? [...cat.types].sort((a, b) => a.order - b.order) : [...cat.appendix].sort((a, b) => a.order - b.order);
  const errs: Record<string, string> = {};
  if (!f.code.trim()) errs.code = 'Bắt buộc';
  else if (cat.templates.some((t) => t.id !== f.id && t.code.toLowerCase() === f.code.trim().toLowerCase())) errs.code = 'Mã đã tồn tại';
  if (!f.name.trim()) errs.name = 'Bắt buộc';
  if (!f.appliesTo.length) errs.appliesTo = `Chọn ít nhất 1 ${f.kind !== 'PL' ? 'loại hợp đồng' : 'loại phụ lục'}`;
  if (!f.data) errs.file = 'Tải lên file Word (.docx)';
  if (f.active && f.kind !== 'KT') {
    const clash = cat.templates.filter((t) => t.id !== f.id && t.active && t.kind === f.kind && t.companyId === f.companyId && t.appliesTo.some((a) => f.appliesTo.includes(a)));
    if (clash.length)
      errs.appliesTo = `Trùng phạm vi với template đang dùng ${clash.map((t) => `"${t.name}" (${t.appliesTo.filter((a) => f.appliesTo.includes(a)).map((a) => targetName(t, a)).join(', ')})`).join('; ')} — mỗi loại + công ty chỉ có 1 template đang dùng`;
  }
  const E = (k: string) => (tried ? errs[k] : undefined);
  const nErr = Object.keys(errs).length;
  const unk = unknownOf(f);

  const upload = async (file: File) => {
    setUpErr('');
    if (!/\.docx$/i.test(file.name)) return setUpErr('Chỉ nhận file Word .docx (file .doc cũ: mở bằng Word → Lưu thành .docx).');
    if (file.size > 10 * 1048576) return setUpErr('File tối đa 10 MB.');
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const info = await inspectDocx(data);
      setF((o) => ({ ...o, data, fileName: file.name, size: file.size, fields: info.fields, uploadedAt: nowIso(), uploadedBy: ME, name: o.name || file.name.replace(/\.docx$/i, '') }));
      setNewFile(true);
      const unk = info.fields.filter((k) => !FIELD_KEYS.has(k.normalize('NFC'))).length;
      flash(
        info.fields.length
          ? `Đã đọc file ${file.name}: ${info.fields.length} trường trộn${unk ? `, ${unk} trường chưa có trong danh sách` : ''}${info.mailMerge ? ' · file trộn thư của Word — khi in hệ thống tự bỏ liên kết tới file Excel nguồn' : ''}`
          : `File ${file.name} không có trường trộn nào — nội dung in sẽ giống hệt file mẫu`,
      );
    } catch (e) {
      setUpErr(`Không đọc được file: ${(e as Error).message}`);
    }
  };
  const save = () => {
    setTried(true);
    if (nErr) return flash('Vui lòng kiểm tra các trường được đánh dấu đỏ');
    const v: TemplateDef = { ...f, code: f.code.trim().toUpperCase(), name: f.name.trim() };
    const logs = [...v.history];
    if (isNew) logs.push({ at: nowIso(), by: ME, action: `Tạo template · tải lên file ${v.fileName}` });
    else {
      const ch: string[] = [];
      if (orig!.name !== v.name) ch.push(`tên: ${orig!.name} → ${v.name}`);
      if (orig!.code !== v.code) ch.push(`mã: ${orig!.code} → ${v.code}`);
      if (orig!.appliesTo.join() !== v.appliesTo.join()) ch.push(`áp dụng cho: ${v.appliesTo.map((a) => targetName(v, a)).join(', ')}`);
      if (orig!.companyId !== v.companyId) ch.push(`công ty: ${cat.companies.find((c) => c.id === v.companyId)?.shortName || 'Tất cả'}`);
      if (orig!.active !== v.active) ch.push(v.active ? 'chuyển Đang sử dụng' : 'chuyển Ngừng sử dụng');
      if (orig!.note !== v.note) ch.push('ghi chú');
      if (newFile) logs.push({ at: nowIso(), by: ME, action: `Thay file Word: ${v.fileName} (${v.fields.length} trường trộn)` });
      if (ch.length) logs.push({ at: nowIso(), by: ME, action: `Cập nhật ${ch.join(' · ')}` });
      if (!ch.length && !newFile) {
        setEditing(false);
        setTried(false);
        return flash('Không có thay đổi');
      }
    }
    v.history = logs;
    updateCatalog((c) => ({ ...c, templates: isNew ? [...c.templates, v] : c.templates.map((t) => (t.id === v.id ? v : t)) }));
    flash(isNew ? `Đã thêm template ${v.name}` : `Đã lưu template ${v.name}`);
    if (isNew) setMode({ kind: 'detail', id: v.id });
    else {
      setF(v);
      setEditing(false);
      setTried(false);
      setNewFile(false);
    }
  };
  const cancel = () => {
    if (isNew) return setMode({ kind: 'list' });
    setF({ ...orig!, appliesTo: [...orig!.appliesTo] });
    setEditing(false);
    setTried(false);
    setNewFile(false);
    setUpErr('');
  };
  const ed = editing;
  const companyName = (id: string) => (id ? cat.companies.find((c) => c.id === id)?.name || '' : 'Tất cả công ty');

  return (
    <div className="space-y-3">
      <ErpTitleBar
        crumbs={isNew || editing ? CRUMBS : undefined}
        title={
          <>
            {isNew ? 'Thêm template hợp đồng' : editing ? `Sửa template ${orig!.code}` : orig!.name}
            {!isNew && !editing && <Tag cls={orig!.active ? ACTIVE_TAG : INACTIVE_TAG}>{orig!.active ? 'Đang sử dụng' : 'Ngừng sử dụng'}</Tag>}
          </>
        }
        onBack={editing ? undefined : () => setMode({ kind: 'list' })}
        actions={
          editing ? (
            <>
              <Btn icon={X} onClick={cancel}>
                {isNew ? 'Huỷ' : 'Huỷ sửa'}
              </Btn>
              <Btn variant="primary" icon={Save} onClick={save}>
                {isNew ? 'Lưu template' : 'Lưu thay đổi'}
              </Btn>
            </>
          ) : (
            <>
              {f.data && (
                <Btn icon={Download} onClick={() => downloadBytes(f.data!, f.fileName)}>
                  Tải file Word
                </Btn>
              )}
              <Btn icon={Eye} onClick={() => setTab('preview')}>
                Xem trước
              </Btn>
              <Btn variant="primary" icon={Pencil} onClick={() => (setEditing(true), setTab('config'), setConfirmDel(false))}>
                Sửa
              </Btn>
              <Btn variant="danger" icon={Trash2} onClick={() => setConfirmDel(true)}>
                Xoá
              </Btn>
            </>
          )
        }
        meta={
          isNew || !orig
            ? undefined
            : [
                { label: 'Mã', value: <span className="font-mono">{orig.code}</span> },
                { label: 'Loại', value: TPL_KIND_LABEL[orig.kind] },
                { label: 'Áp dụng cho', value: orig.appliesTo.map((a) => targetName(orig, a)).join(', ') },
                { label: 'Công ty', value: companyName(orig.companyId) },
                { label: 'File', value: `${orig.fileName} (${fileSize(orig.size)})` },
              ]
        }
        notice={
          confirmDel ? (
            <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-rose-50 text-[12.5px] text-rose-700">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="flex-1 min-w-[240px]">
                Xoá template <b>{f.code} — {f.name}</b>? {f.kind === 'KT' ? 'Hợp đồng sẽ không còn in kèm văn bản này.' : `Các ${f.kind === 'HD' ? 'loại hợp đồng' : 'loại phụ lục'} đang dùng template này sẽ chuyển về bản in mặc định.`}
              </span>
              <Btn className="h-7" onClick={() => setConfirmDel(false)}>
                Không xoá
              </Btn>
              <Btn
                variant="danger"
                icon={Trash2}
                className="h-7 !bg-rose-600 !text-white !border-rose-700"
                onClick={() => (updateCatalog((c) => ({ ...c, templates: c.templates.filter((t) => t.id !== f.id) })), flash(`Đã xoá template ${f.name}`), setMode({ kind: 'list' }))}
              >
                Xoá template
              </Btn>
            </div>
          ) : tried && nErr ? (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-[12px] text-rose-700">
              <AlertTriangle size={13} className="shrink-0" /> Còn {nErr} mục chưa hợp lệ (đánh dấu đỏ).
            </div>
          ) : null
        }
      />

      {!isNew && (
        <FolderTabs
          tabs={[
            { key: 'config', label: 'Cấu hình', icon: LayoutList },
            { key: 'preview', label: 'Xem trước', icon: Eye },
            { key: 'history', label: `Lịch sử (${f.history.length})`, icon: History },
          ]}
          value={tab}
          onChange={(k) => !editing && setTab(k)}
        />
      )}

      {tab === 'config' && (
        <div className="space-y-3">
          <Panel title="Thông tin template" icon={FileSignature} noPad>
            <InfoGrid
              left={[
                {
                  label: lb('Mã template', true, ed),
                  value: ed ? (
                    <>
                      <input value={f.code} placeholder="VD: TPL-HDLD" onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} className={`${INPUT} font-mono ${errCls(E('code'))}`} />
                      <ErrText e={E('code')} />
                    </>
                  ) : (
                    <span className={`${erp.code} font-semibold`}>{f.code}</span>
                  ),
                },
                {
                  label: lb('Tên template', true, ed),
                  value: ed ? (
                    <>
                      <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={`${INPUT} ${errCls(E('name'))}`} />
                      <ErrText e={E('name')} />
                    </>
                  ) : (
                    <b>{f.name}</b>
                  ),
                },
                {
                  label: lb('Dùng cho', true, ed),
                  value:
                    ed && isNew ? (
                      <select value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as TplKind, appliesTo: [] })} className={INPUT}>
                        <option value="HD">In hợp đồng lao động</option>
                        <option value="KT">In kèm hợp đồng (thỏa thuận bảo mật, cam kết…)</option>
                        <option value="PL">In phụ lục hợp đồng</option>
                      </select>
                    ) : (
                      TPL_KIND_LABEL[f.kind]
                    ),
                },
                {
                  label: 'Công ty áp dụng',
                  value: ed ? (
                    <select value={f.companyId} onChange={(e) => setF({ ...f, companyId: e.target.value })} className={INPUT}>
                      <option value="">Tất cả công ty (template chung)</option>
                      {cat.companies
                        .filter((c) => c.active || c.id === f.companyId)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                    </select>
                  ) : (
                    companyName(f.companyId)
                  ),
                },
                {
                  label: 'Trạng thái',
                  value: ed ? (
                    <span className="flex items-center gap-2">
                      <CheckBox checked={f.active} onChange={(b) => setF({ ...f, active: b })} /> Đang sử dụng (được chọn khi in)
                    </span>
                  ) : (
                    <Tag cls={f.active ? ACTIVE_TAG : INACTIVE_TAG}>{f.active ? 'Đang sử dụng' : 'Ngừng sử dụng'}</Tag>
                  ),
                },
              ]}
              right={[
                {
                  label: lb(f.kind !== 'PL' ? 'Áp dụng cho loại HĐ' : 'Áp dụng cho loại phụ lục', true, ed),
                  value: ed ? (
                    <>
                      <span className="flex flex-col gap-1">
                        {targets.map((t) => (
                          <span key={t.id} className="flex items-center gap-1.5">
                            <CheckBox checked={f.appliesTo.includes(t.id)} onChange={(v) => setF({ ...f, appliesTo: v ? targets.filter((x) => f.appliesTo.includes(x.id) || x.id === t.id).map((x) => x.id) : f.appliesTo.filter((x) => x !== t.id) })} />
                            {t.name}
                            {!t.active && <span className="text-[11px] text-slate-400">(ngừng sử dụng)</span>}
                          </span>
                        ))}
                      </span>
                      <ErrText e={E('appliesTo')} />
                    </>
                  ) : (
                    <span className="flex flex-wrap gap-1">
                      {f.appliesTo.map((a) => (
                        <Tag key={a} cls="bg-white text-slate-700 border-slate-300">
                          {targetName(f, a)}
                        </Tag>
                      ))}
                    </span>
                  ),
                },
                { label: 'Ghi chú', value: ed ? <textarea rows={3} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} className={`${INPUT} h-auto py-1.5 resize-y`} /> : f.note },
              ]}
            />
          </Panel>

          <Panel
            title="File Word mẫu (.docx)"
            icon={FileText}
            noPad
            actions={
              ed ? (
                <>
                  <Btn icon={Upload} className={`h-7 ${!f.data ? '!bg-[#1f5fa8] !text-white !border-[#184c88]' : ''}`} onClick={() => fileRef.current?.click()}>
                    {f.data ? 'Thay file khác' : 'Tải lên file .docx'}
                  </Btn>
                  <input ref={fileRef} type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(e) => (e.target.files?.[0] && upload(e.target.files[0]), (e.target.value = ''))} />
                </>
              ) : f.data ? (
                <Btn icon={Download} className="h-7" onClick={() => downloadBytes(f.data!, f.fileName)}>
                  Tải file
                </Btn>
              ) : undefined
            }
            footer="Trường trộn: trường Word «Tên_trường» (Insert → Quick Parts → Field → MergeField) hoặc gõ {{Tên_trường}} — xem danh sách bên dưới. Trường không có trong danh sách được giữ nguyên khi in; liên kết tới file Excel nguồn của Word được tự bỏ."
          >
            {upErr && <p className="px-3 py-2 bg-rose-50 border-b border-rose-200 text-[12.5px] text-rose-700">{upErr}</p>}
            {f.data ? (
              <InfoGrid
                left={[
                  { label: 'Tên file', value: <span className="inline-flex items-center gap-1.5"><FileText size={13} className="text-[#1f5fa8]" />{f.fileName}{newFile && <Tag cls="bg-amber-50 text-amber-700 border-amber-300">Mới — chưa lưu</Tag>}</span> },
                  { label: 'Dung lượng', value: fileSize(f.size) },
                  { label: 'Tải lên', value: `${fmtAt(f.uploadedAt)} bởi ${f.uploadedBy}` },
                ]}
                right={[
                  {
                    label: 'Trường trộn trong file',
                    value: f.fields.length ? (
                      <span className="flex flex-wrap gap-1">
                        {f.fields.map((k) => (
                          <Tag key={k} cls={FIELD_KEYS.has(k) ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-rose-50 text-rose-700 border-rose-300'}>
                            «{k}»
                          </Tag>
                        ))}
                      </span>
                    ) : (
                      <span className="text-amber-700">Không có trường trộn nào</span>
                    ),
                  },
                  {
                    label: 'Kiểm tra',
                    value: unk.length ? (
                      <span className="text-rose-600 inline-flex items-start gap-1">
                        <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                        {unk.length} trường không có trong danh sách: {unk.map((k) => `{{${k}}}`).join(', ')} — sửa lại trong file Word
                      </span>
                    ) : (
                      <span className="text-emerald-700 inline-flex items-center gap-1">
                        <CheckCircle2 size={13} /> Tất cả trường trộn hợp lệ
                      </span>
                    ),
                  },
                ]}
              />
            ) : (
              <div className="px-3 py-6 text-center text-[12.5px]">
                <p className="text-slate-500">Chưa có file Word.</p>
                <ErrText e={E('file')} />
                <p className="mt-2 text-slate-400">
                  Chưa có mẫu?{' '}
                  <button type="button" className={LINK} onClick={() => downloadBytes(SAMPLE_FILES.allFields(), 'danh-sach-truong-tron.docx')}>
                    Tải file danh sách trường trộn
                  </button>{' '}
                  rồi chèn trường vào mẫu Word của công ty và tải lên.
                </p>
              </div>
            )}
          </Panel>

          <FieldDictionary used={new Set(f.fields)} flash={flash} />
        </div>
      )}

      {tab === 'preview' && <Preview t={f} flash={flash} />}

      {tab === 'history' && (
        <Panel title="Lịch sử thay đổi" icon={History} noPad>
          <table className={erp.table}>
            <thead>
              <tr>
                {['Thời gian', 'Người thực hiện', 'Nội dung'].map((h, i, a) => (
                  <th key={h} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0 w-40' : ''} ${i === a.length - 1 ? 'border-r-0' : 'w-40'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...f.history].reverse().map((h, i) => (
                <tr key={i} className={erp.tr}>
                  <td className={`${erp.td} border-l-0 whitespace-nowrap`}>{fmtAt(h.at)}</td>
                  <td className={erp.td}>{h.by}</td>
                  <td className={`${erp.td} border-r-0`}>{h.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
};

// ==========================================================================
// Danh sách trường trộn (bấm để sao chép)
// ==========================================================================
const FieldDictionary: React.FC<{ used: Set<string>; flash: (m: string) => void }> = ({ used, flash }) => {
  const cat = useCatalog();
  const usage = useMemo(() => {
    const m = new Map<string, number>();
    cat.templates.forEach((t) => new Set<string>(t.fields.map((k) => k.normalize('NFC'))).forEach((k) => m.set(k, (m.get(k) || 0) + 1)));
    return m;
  }, [cat.templates]);
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('');
  const rows = FIELDS.filter((f) => (!group || f.group === group) && (!q || `${f.key} ${f.label}`.toLowerCase().includes(q.toLowerCase())));
  const copy = async (k: string) => {
    try {
      await navigator.clipboard.writeText(`{{${k}}}`);
      flash(`Đã sao chép {{${k}}} — dán vào file Word`);
    } catch {
      flash(`Trường trộn: {{${k}}}`);
    }
  };
  const th = `${erp.th} border-t-0 text-left`;
  return (
    <Panel
      title={`Danh sách trường trộn (${FIELDS.length})`}
      icon={ClipboardCopy}
      noPad
      actions={
        <>
          <select value={group} onChange={(e) => setGroup(e.target.value)} className={`${erp.input} h-7 w-44`}>
            <option value="">Tất cả nhóm</option>
            {FIELD_GROUPS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <div className="relative w-56">
            <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm trường..." className={`${erp.inputFull} h-7 pl-7`} />
          </div>
        </>
      }
      footer="Bấm vào tên trường để sao chép dạng {{Tên_trường}} rồi dán vào file Word — hoặc chèn trường Word cùng tên (Insert → Quick Parts → Field → MergeField). Tên trường theo bộ mẫu hợp đồng AEQUITAS."
    >
      <div className="overflow-auto max-h-[420px]">
        <table className={erp.table}>
          <thead className="sticky top-0 z-10">
            <tr>
              <th className={`${th} border-l-0 w-36`}>Nhóm</th>
              <th className={`${th} w-64`}>Trường trộn</th>
              <th className={th}>Ý nghĩa</th>
              <th className={th}>Ví dụ</th>
              <th className={`${th} w-28 !text-center`}>Trong file này</th>
              <th className={`${th} border-r-0 w-24 !text-center`}>Số mẫu dùng</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.key} className={erp.tr}>
                <td className={`${erp.td} border-l-0 text-slate-500`}>{f.group}</td>
                <td className={erp.td}>
                  <button type="button" className="inline-flex items-center gap-1 font-mono text-[#1f5fa8] hover:underline cursor-pointer" onClick={() => copy(f.key)} title="Bấm để sao chép">
                    «{f.key}» <ClipboardCopy size={11} className="text-slate-400" />
                  </button>
                </td>
                <td className={erp.td}>{f.label}</td>
                <td className={`${erp.td} text-slate-500`}>{f.sample || '—'}</td>
                <td className={`${erp.td} text-center`}>{used.has(f.key) && <Check size={14} className="inline text-emerald-600" />}</td>
                <td className={`${erp.td} border-r-0 text-center text-slate-600`}>{usage.get(f.key) || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
};

// ==========================================================================
// Xem trước với dữ liệu 1 hợp đồng
// ==========================================================================
const Preview: React.FC<{ t: TemplateDef; flash: (m: string) => void }> = ({ t, flash }) => {
  const cs = useContractStore();
  const cat = useCatalog();
  const workerOf = useMemo(() => new Map(cs.workers.map((w) => [w.id, w])), [cs.workers]);
  const typeNamesOf = t.kind !== 'PL' ? new Set(t.appliesTo.map((id) => cat.types.find((x) => x.id === id)?.name)) : null;
  const pool = cs.contracts
    .filter((c) => workerOf.has(c.workerId) && (!typeNamesOf || typeNamesOf.has(c.type)) && (!t.companyId || c.companyId === t.companyId))
    .sort((a, b) => b.signDate.localeCompare(a.signDate));
  const [cid, setCid] = useState(pool[0]?.id || '');
  const [appId, setAppId] = useState(t.kind === 'PL' ? t.appliesTo[0] || '' : '');
  const [appDate, setAppDate] = useState(today());
  const [q, setQ] = useState('');
  const [lines, setLines] = useState<DocLine[] | null>(null);
  const [err, setErr] = useState('');
  const c = cs.contracts.find((x) => x.id === cid);
  const w = c ? workerOf.get(c.workerId) : undefined;
  const app = cat.appendix.find((a) => a.id === appId);
  const data = c && w ? mergeDataOf(c as Contract, w as Worker, t.kind === 'PL' ? app : undefined, appDate) : null;
  useEffect(() => {
    if (!cid && pool[0]) setCid(pool[0].id);
  }, [pool.length]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    let live = true;
    setErr('');
    if (!t.data) return setLines([]);
    inspectDocx(t.data)
      .then((r) => live && setLines(r.lines))
      .catch((e) => live && setErr((e as Error).message));
    return () => {
      live = false;
    };
  }, [t.data]);
  const shown = pool.filter((x) => !q || `${x.no} ${workerOf.get(x.workerId)?.name} ${workerOf.get(x.workerId)?.code}`.toLowerCase().includes(q.toLowerCase())).slice(0, 200);
  // ô lọc làm hợp đồng đang chọn biến khỏi danh sách → chọn hợp đồng đầu tiên còn lại (để xem trước khớp với ô chọn)
  useEffect(() => {
    if (shown.length && !shown.some((x) => x.id === cid)) setCid(shown[0].id);
  }, [q, shown.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const render = (text: string) => {
    const out: React.ReactNode[] = [];
    let last = 0;
    const re = new RegExp(`${MF_RE.source}|${FIELD_RE.source}`, 'gu');
    for (const m of text.matchAll(re)) {
      const name = (m[1] ?? m[2]).normalize('NFC');
      out.push(text.slice(last, m.index));
      const known = data && name in data;
      out.push(
        known ? (
          <mark key={m.index} className="bg-amber-100 text-slate-900 rounded-sm px-0.5 whitespace-pre-wrap" title={`«${name}»`}>
            {data![name] || <span className="text-slate-400">(trống)</span>}
          </mark>
        ) : (
          <span key={m.index} className="bg-rose-100 text-rose-700 rounded-sm px-0.5" title="Trường không có trong danh sách">
            «{name}»
          </span>
        ),
      );
      last = m.index! + m[0].length;
    }
    out.push(text.slice(last));
    return out;
  };
  const downloadMerged = async () => {
    if (!t.data || !data || !c) return;
    try {
      downloadBytes(await mergeDocx(t.data, data), `${t.kind === 'HD' ? 'HDLD' : t.kind === 'KT' ? 'KEMTHEO' : 'PHULUC'}_${safe(c.no)}_thu.docx`);
      flash('Đã tải bản trộn thử');
    } catch (e) {
      flash(`Không trộn được file: ${(e as Error).message}`);
    }
  };
  return (
    <Panel
      title="Xem trước với dữ liệu hợp đồng"
      icon={Eye}
      noPad
      actions={
        <>
          <div className="relative w-48">
            <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Lọc số HĐ, họ tên..." className={`${erp.inputFull} h-7 pl-7`} />
          </div>
          <select value={cid} onChange={(e) => setCid(e.target.value)} className={`${erp.input} h-7 w-80`}>
            {!shown.length && <option value="">Không có hợp đồng phù hợp</option>}
            {shown.map((x) => (
              <option key={x.id} value={x.id}>
                {x.no} · {workerOf.get(x.workerId)?.name} · {x.type}
              </option>
            ))}
          </select>
          {t.kind === 'PL' && (
            <span className="flex items-center gap-1.5 text-[12px] text-slate-600 whitespace-nowrap">
              Ngày áp dụng
              <span className="w-32">
                <DateInput value={appDate} onChange={setAppDate} className="!h-7" />
              </span>
            </span>
          )}
          {t.kind === 'PL' && (
            <select value={appId} onChange={(e) => setAppId(e.target.value)} className={`${erp.input} h-7 w-56`}>
              {t.appliesTo.map((a) => (
                <option key={a} value={a}>
                  {cat.appendix.find((x) => x.id === a)?.name}
                </option>
              ))}
            </select>
          )}
          <Btn variant="primary" icon={Download} className="h-7" disabled={!data || !t.data} onClick={downloadMerged}>
            Tải bản trộn (.docx)
          </Btn>
        </>
      }
      footer={
        <span className="flex flex-wrap items-center gap-3">
          <span>
            <mark className="bg-amber-100 px-1 rounded-sm">Nền vàng</mark> = dữ liệu trộn từ hợp đồng
          </span>
          <span>
            <span className="bg-rose-100 text-rose-700 px-1 rounded-sm">Nền đỏ</span> = trường không hợp lệ
          </span>
          <span>Xem trước hiển thị nội dung chữ; định dạng, bảng, hình ảnh giữ nguyên trong file Word.</span>
        </span>
      }
    >
      <div className="bg-[#e9edf2] p-4 overflow-auto max-h-[calc(100vh-260px)]">
        {err ? (
          <p className="text-rose-600 text-center py-10">{err}</p>
        ) : !t.data ? (
          <p className="text-slate-500 text-center py-10">Chưa có file Word để xem trước.</p>
        ) : !lines ? (
          <p className="text-slate-500 text-center py-10">Đang đọc file…</p>
        ) : (
          <div className="mx-auto max-w-[800px] min-h-[600px] bg-white shadow border border-slate-300 px-14 py-12 text-[14.5px] leading-[1.6] text-slate-900" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            {lines.map((l, i) =>
              l.text.trim() ? (
                <p key={i} className={`whitespace-pre-wrap ${l.center ? 'text-center' : l.right ? 'text-right' : 'text-justify'} ${l.bold ? 'font-bold' : ''} ${l.table ? 'text-center' : ''} mb-1`}>
                  {render(l.text)}
                </p>
              ) : (
                <div key={i} className="h-3" />
              ),
            )}
          </div>
        )}
      </div>
    </Panel>
  );
};
