/**
 * ContractTemplatePage — "Template hợp đồng" (Human Resources): cấu hình file Word mẫu dùng khi In hợp đồng / phụ lục.
 *  - Danh sách template: loại (Hợp đồng / Phụ lục), áp dụng cho loại HĐ / loại phụ lục, công ty, file Word, trường trộn, trạng thái.
 *  - Chi tiết (trên trang, không popup): thông tin · tải lên file .docx (xem trước đúng định dạng rồi mới dùng, kiểm tra trường trộn) · danh sách trường trộn (bấm để sao chép)
 *    · Xem trước với dữ liệu 1 hợp đồng thật · Tải bản trộn thử · Lịch sử.
 *  Quy tắc: mỗi loại HĐ (hoặc loại phụ lục) + công ty chỉ có 1 template đang dùng; template riêng của công ty ưu tiên hơn template chung.
 *  In HĐ ở màn Hợp đồng: có template → tạo file Word đã trộn; chưa có → bản in mặc định.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { AlertTriangle, FileSpreadsheet, Check, CheckCircle2, ClipboardCopy, Download, Eye, FileCog, FileSignature, FileText, History, LayoutList, Pencil, Plus, Save, Search, Table2, Trash2, Upload, X } from 'lucide-react';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, KpiBox, Panel, Segmented, Tag, erp } from '../erp/Erp';
import { ColumnFilterBar, useColumnFilters } from '../erp/ColumnFilter';
import { CheckBox, DateInput, InfoGrid, dmy, today } from '../EmployeePage';
import { mergeDataOf, useContractStore, type Contract, type Worker } from '../ContractsPage';
import { FIELDS, FIELD_GROUPS, FIELD_KEYS, TPL_KIND_LABEL, findTemplate, getCatalog, isSigningCompany, signingCompanies, tplCompaniesOverlap, tplCompanyNames, tplHasCompany, updateCatalog, useCatalog, type AppendixTypeDef, type TemplateDef, type TplKind } from './catalog';
import { downloadBytes, inspectDocx, mergeDocx } from './docx';
import { ExactPreview } from './PrintDialog';
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
/** Lần lưu thay đổi gần nhất (dòng lịch sử cuối) */
const lastLog = (t: TemplateDef) => t.history[t.history.length - 1] || { at: t.uploadedAt, by: t.uploadedBy, action: '' };

// ==========================================================================
// Danh sách
// ==========================================================================
/** File Excel trường trộn theo mẫu "DS trường trộn_v2": danh sách trường + bảng tên cũ → tên mới + 1 dòng dữ liệu mẫu (nguồn Mail Merge) + hướng dẫn. */
const downloadFieldsXlsx = () => {
  const tpls = getCatalog().templates;
  const usedBy = (k: string) => tpls.filter((t) => t.fields.some((f) => f.normalize('NFC') === k.normalize('NFC')));
  const isOld = (g: string) => g.startsWith('Tên cũ');
  const main = FIELDS.filter((f) => !isOld(f.group));
  const list = XLSX.utils.aoa_to_sheet([
    ['STT', 'Nhóm thông tin', 'Tên gọi chuẩn', 'Mã trường trộn', 'Diễn giải', 'Ví dụ dữ liệu', 'Định dạng dữ liệu', 'Số mẫu đang dùng', 'Mẫu đang dùng'],
    ...main.map((f, i) => {
      const u = usedBy(f.key);
      return [i + 1, f.group, f.label, `{{${f.key}}}`, f.desc || '', f.sample || '(trống)', f.format || '', u.length || '', u.map((t) => t.code).join(', ')];
    }),
  ]);
  list['!cols'] = [{ wch: 5 }, { wch: 30 }, { wch: 32 }, { wch: 34 }, { wch: 55 }, { wch: 30 }, { wch: 24 }, { wch: 10 }, { wch: 40 }];
  list['!autofilter'] = { ref: `A1:I${main.length + 1}` };
  const olds = FIELDS.filter((f) => isOld(f.group));
  const legacy = XLSX.utils.aoa_to_sheet([
    ['STT', 'Mã trường cũ', 'Dùng như mã mới', 'Ghi chú', 'Số mẫu đang dùng', 'Mẫu đang dùng'],
    ...olds.map((f, i) => {
      const u = usedBy(f.key);
      return [i + 1, `{{${f.key}}}`, f.legacyOf ? `{{${f.legacyOf}}}` : '', f.legacyOf ? 'Cùng dữ liệu với mã mới — nên đổi sang mã mới' : `${f.label}. ${f.desc || ''}`.trim(), u.length || '', u.map((t) => t.code).join(', ')];
    }),
  ]);
  legacy['!cols'] = [{ wch: 5 }, { wch: 30 }, { wch: 34 }, { wch: 50 }, { wch: 10 }, { wch: 40 }];
  const data = XLSX.utils.aoa_to_sheet([main.map((f) => f.key), main.map((f) => f.sample)]);
  data['!cols'] = main.map((f) => ({ wch: Math.max(14, f.key.length + 2, String(f.sample).length + 2) }));
  const guide = XLSX.utils.aoa_to_sheet([
    ['HƯỚNG DẪN SOẠN TEMPLATE HỢP ĐỒNG (FILE WORD .docx)'],
    [],
    ['1. Mở mẫu hợp đồng Word của công ty.'],
    ['2. Chèn trường trộn theo 1 trong 2 cách:'],
    ['   a) Gõ mã trường trong cặp ngoặc nhọn đôi, ví dụ {{HỌ_VÀ_TÊN_NLĐ_IN_HOA}} (cột "Mã trường trộn" ở sheet DS trường trộn_v2).'],
    ['   b) Trộn thư của Word: Mailings → Select Recipients → Use an Existing List → chọn file này → sheet Du_lieu_mau → Insert Merge Field.'],
    ['3. Bấm "Preview Results" trong Word để xem thử với dòng dữ liệu mẫu.'],
    ['4. Lưu file .docx và tải lên ở màn Cấu hình template hợp đồng (Thêm template / Tải file Word).'],
    [],
    ['Lưu ý:'],
    ['- Trường kết thúc bằng _text đã có sẵn chữ "ngày … tháng … năm …" → trong Word KHÔNG gõ thêm chữ "ngày" phía trước.'],
    ['- Tiền tệ có dấu chấm phân cách hàng nghìn (15.000.000); trường "bằng chữ" tự sinh từ số tiền.'],
    ['- Mã trường cũ (sheet Ten_cu) vẫn trộn được để mẫu Word cũ không lỗi; mẫu mới nên dùng mã chuẩn.'],
    ['- Mã trường phải đúng chính tả và dấu; trường không có trong danh sách sẽ bị báo đỏ khi tải mẫu lên.'],
  ]);
  guide['!cols'] = [{ wch: 120 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, list, 'DS trường trộn_v2');
  XLSX.utils.book_append_sheet(wb, legacy, 'Ten_cu');
  XLSX.utils.book_append_sheet(wb, data, 'Du_lieu_mau');
  XLSX.utils.book_append_sheet(wb, guide, 'Huong_dan');
  XLSX.writeFile(wb, 'danh-sach-truong-tron-v2.xlsx');
};

/** Giá trị cho phễu lọc theo cột của danh sách template (đúng chữ hiển thị trong ô) */
const TPL_GETTERS: Record<string, (t: TemplateDef) => string | string[]> = {
  Mã: (t) => t.code,
  'Tên template': (t) => t.name,
  Loại: (t) => TPL_KIND_LABEL[t.kind],
  'Áp dụng cho': (t) => (t.appliesTo.length ? t.appliesTo.map((id) => targetName(t, id)) : 'Chưa chọn'),
  'Công ty': (t) => tplCompanyNames(t),
  'File Word': (t) => (t.data ? t.fileName : 'Chưa có file'),
  'Trường trộn': (t) => `${t.fields.length} trường${unknownOf(t).length ? ` · ${unknownOf(t).length} không hợp lệ` : ''}`,
  'Ngày cập nhật': (t) => dmy(lastLog(t).at.slice(0, 10)),
  'Người cập nhật': (t) => lastLog(t).by || '—',
  'Trạng thái': (t) => (t.active ? 'Đang sử dụng' : 'Ngừng sử dụng'),
};
const TemplateList: React.FC<{ setMode: (m: Mode) => void }> = ({ setMode }) => {
  const cat = useCatalog();
  const [kind, setKind] = useState<'' | TplKind>('');
  const [q, setQ] = useState('');
  const base = cat.templates.filter((t) => (!kind || t.kind === kind) && (!q || `${t.code} ${t.name} ${t.fileName}`.toLowerCase().includes(q.toLowerCase())));
  const colF = useColumnFilters(base, TPL_GETTERS);
  const rows = colF.rows;
  // Đủ template = mọi công ty ký HĐ (đang sử dụng) đều có mẫu chung hoặc mẫu riêng; chưa đủ → ghi kèm công ty còn thiếu
  const gaps = (list: { id: string; name: string; active: boolean }[], k: TplKind) =>
    list
      .filter((x) => x.active)
      .map((x) => ({ name: x.name, cos: signingCompanies().filter((co) => !findTemplate(k, x.id, co.id)).map((co) => co.shortName) }))
      .filter((x) => x.cos.length);
  const typesNo = gaps(cat.types, 'HD');
  const appNo = gaps(cat.appendix, 'PL');
  const gapText = (g: { name: string; cos: string[] }[]) => g.map((x) => `${x.name} (${x.cos.join(', ')})`).join(', ');
  const th = `${erp.th} border-t-0 text-left`;
  return (
    <>
      <ErpTitleBar
        crumbs={CRUMBS}
        title="Cấu hình template hợp đồng"
        actions={
          <>
            <Btn icon={FileSpreadsheet} onClick={downloadFieldsXlsx} title="File Excel theo mẫu DS trường trộn_v2 (nhóm, tên gọi chuẩn, mã trường, diễn giải, ví dụ, định dạng) + bảng mã cũ → mã mới + 1 dòng dữ liệu mẫu để thử trộn thư trong Word">
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
        <KpiBox label="Tổng số template" value={cat.templates.length} valueText="1" sub={`${cat.templates.filter((t) => t.kind === 'HD').length} hợp đồng · ${cat.templates.filter((t) => t.kind === 'KT').length} văn bản kèm theo · ${cat.templates.filter((t) => t.kind === 'PL').length} phụ lục`} />
        <KpiBox label="Đang sử dụng" value={cat.templates.filter((t) => t.active).length} valueText="1" tone="good" sub="Được dùng khi in" />
        <KpiBox
          label="Loại HĐ chưa có template"
          value={typesNo.length}
          valueText="1"
          tone={typesNo.length ? 'bad' : 'good'}
          sub={typesNo.length ? gapText(typesNo) : 'Tất cả loại HĐ đã có template'}
        />
        <KpiBox label="Loại phụ lục chưa có template" value={appNo.length} valueText="1" tone={appNo.length ? 'bad' : 'good'} sub={appNo.length ? gapText(appNo) : 'Đủ template'} />
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
                { key: 'KT', label: 'Văn bản kèm theo' },
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
        <ColumnFilterBar active={colF.active} filters={colF.filters} labelOf={(k) => k} onRemove={(k) => colF.set(k, [])} onClear={colF.clear} />
        <div className="overflow-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${th} border-l-0 w-12 !text-center`}>STT</th>
                {['Mã', 'Tên template', 'Loại', 'Áp dụng cho', 'Công ty', 'File Word', 'Trường trộn', 'Ngày cập nhật', 'Người cập nhật', 'Trạng thái'].map((h) => (
                  <th key={h} className={th}>
                    <div className="flex items-center gap-1">
                      <span className="flex-1 min-w-0 whitespace-nowrap">{h}</span>
                      {colF.funnel(h, h)}
                    </div>
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
                    <td className={`${erp.td} whitespace-nowrap`}>{t.companyIds.length ? tplCompanyNames(t) : <i className="text-slate-500">Tất cả công ty</i>}</td>
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
                    <td className={`${erp.td} whitespace-nowrap text-slate-600`}>{dmy(lastLog(t).at.slice(0, 10))}</td>
                    <td className={`${erp.td} whitespace-nowrap text-slate-600`}>{lastLog(t).by || '—'}</td>
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
                  <td colSpan={12} className="px-3 py-10 text-center text-slate-400">
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
      ? { ...orig, appliesTo: [...orig.appliesTo], history: [...orig.history], companyIds: [...orig.companyIds] }
      : { id: `tp-${uid()}`, code: '', name: '', kind: 'HD', appliesTo: [], companyIds: [], fileName: '', size: 0, data: null, fields: [], uploadedAt: nowIso(), uploadedBy: ME, active: true, note: '', history: [] },
  );
  const [editing, setEditing] = useState(isNew || (mode.kind === 'detail' && !!mode.edit));
  const [tab, setTab] = useState<'config' | 'preview' | 'history'>('config');
  const [tried, setTried] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [newFile, setNewFile] = useState(false);
  const [upErr, setUpErr] = useState('');
  const [pending, setPending] = useState<PendingFile | null>(null); // file vừa chọn, đang xem trước — chưa gắn vào template
  const [viewFile, setViewFile] = useState(false);
  const [general, setGeneral] = useState(!!orig && !orig.companyIds.length); // ô "template chung": companyIds lưu []
  const [askDeact, setAskDeact] = useState(false); // ngừng template chung khi còn công ty chưa có mẫu riêng → xác nhận
  const [askReplace, setAskReplace] = useState(false); // lưu trùng phạm vi → hỏi thay thế template đang dùng
  const fileRef = useRef<HTMLInputElement>(null);

  if (mode.kind === 'detail' && !orig) return <ErpTitleBar onBack={() => setMode({ kind: 'list' })} title="Template không còn tồn tại" />;

  const targets = f.kind !== 'PL' ? [...cat.types].sort((a, b) => a.order - b.order) : [...cat.appendix].sort((a, b) => a.order - b.order);
  const errs: Record<string, string> = {};
  const fScope = { ...f, companyIds: general ? [] : f.companyIds };
  if (!general && !f.companyIds.length) errs.companyIds = 'Chọn ít nhất 1 công ty';
  if (!f.code.trim()) errs.code = 'Bắt buộc';
  else if (cat.templates.some((t) => t.id !== f.id && t.code.toLowerCase() === f.code.trim().toLowerCase())) errs.code = 'Mã đã tồn tại';
  if (!f.name.trim()) errs.name = 'Bắt buộc';
  if (!f.appliesTo.length) errs.appliesTo = `Chọn ít nhất 1 ${f.kind !== 'PL' ? 'loại hợp đồng' : 'loại phụ lục'}`;
  if (!f.data) errs.file = 'Tải lên file Word (.docx)';
  // Mỗi loại + công ty chỉ 1 template đang dùng (cả Văn bản kèm theo) — trùng thì hỏi thay thế khi lưu
  const clash = f.active && (general || f.companyIds.length) ? cat.templates.filter((t) => t.id !== f.id && t.active && t.kind === f.kind && tplCompaniesOverlap(t, fScope) && t.appliesTo.some((a) => f.appliesTo.includes(a))) : [];
  const clashText = clash.map((t) => `"${t.name}" (${t.appliesTo.filter((a) => f.appliesTo.includes(a)).map((a) => targetName(t, a)).join(', ')})`).join('; ');
  // Chỉ thay thế khi template mới phủ trọn phạm vi template cũ (loại và công ty); trùng một phần → chặn
  const covers = (t: TemplateDef) => t.appliesTo.every((a) => f.appliesTo.includes(a)) && t.companyIds.every((x) => fScope.companyIds.includes(x));
  const coName = (id: string) => tplCompanyNames({ companyIds: [id] });
  const overlapTypes = (t: TemplateDef) => t.appliesTo.filter((a) => f.appliesTo.includes(a));
  const overlapCos = (t: TemplateDef) => (t.companyIds.length ? t.companyIds.filter((x) => fScope.companyIds.includes(x)).map(coName).join(', ') : 'Tất cả công ty');
  const blockers = clash.filter((t) => !covers(t));
  const blockText = blockers.map((t) => `Trùng ${overlapCos(t)} × ${overlapTypes(t).map((a) => targetName(t, a)).join(', ')} với "${t.name}"; template cũ có phạm vi rộng hơn/khác nên không thể thay thế một phần — hãy sửa phạm vi của "${t.name}" hoặc template này`).join('. ');
  const replaceText = clash.map((t) => `"${t.name}" chuyển Ngừng sử dụng`).join('; ');
  const E = (k: string) => (tried ? errs[k] : undefined);
  const nErr = Object.keys(errs).length;
  const unk = unknownOf(f);
  // Đang được dùng = template hiệu lực (riêng ưu tiên chung) của ít nhất 1 cặp loại × công ty ký HĐ; chung → chỉ cảnh báo, riêng → không xoá
  const usage = (() => {
    if (!orig?.active) return [];
    const list = orig.kind !== 'PL' ? cat.types : cat.appendix;
    const out: { id: string; name: string; cos: string[]; ids: string[] }[] = [];
    for (const x of list.filter((x) => x.active && orig.appliesTo.includes(x.id))) {
      const cs = signingCompanies().filter((co) => findTemplate(orig.kind, x.id, co.id)?.id === orig.id);
      if (cs.length) out.push({ id: x.id, name: x.name, cos: cs.map((co) => co.shortName), ids: cs.map((co) => co.id) });
    }
    return out;
  })();
  const inUse = usage.map((u) => `${orig!.kind === 'KT' ? 'đang được in kèm cho' : 'đang là template in của'} ${u.name} (${u.cos.join(', ')})`);
  const isGeneralOrig = !!orig && !orig.companyIds.length;
  const lostText = usage.map((u) => `${u.name}: ${u.cos.join(', ')} sẽ không còn template (dùng bản in mặc định)`).join('; ');
  // Thu hẹp phạm vi (bỏ tick chung / bớt công ty / bớt loại) → công ty không còn template nào (không có mẫu khác thay) dùng bản in mặc định
  const scopeLost = editing && !!orig && f.active
    ? usage.map((u) => ({ name: u.name, cos: signingCompanies().filter((co) => u.ids.includes(co.id) && !(f.appliesTo.includes(u.id) && tplHasCompany(fScope, co.id)) && !cat.templates.some((t) => t.id !== orig.id && t.active && t.data && t.kind === orig.kind && t.appliesTo.includes(u.id) && tplHasCompany(t, co.id))).map((co) => co.shortName) })).filter((u) => u.cos.length)
    : [];
  const scopeLostText = scopeLost.map((u) => `${u.name}: ${u.cos.join(', ')} sẽ không còn template (dùng bản in mặc định)`).join('; ');
  const deactWarn = editing && ((isGeneralOrig && !f.active && usage.length > 0) || scopeLost.length > 0);
  const warnText = isGeneralOrig && !f.active ? `ngừng template chung: ${lostText}` : `thu hẹp phạm vi template — ${scopeLostText}`;

  const upload = async (file: File) => {
    setUpErr('');
    if (!/\.docx$/i.test(file.name)) return setUpErr('Chỉ nhận file Word .docx (file .doc cũ: mở bằng Word → Lưu thành .docx).');
    if (file.size > 10 * 1048576) return setUpErr('File tối đa 10 MB.');
    try {
      const data = new Uint8Array(await file.arrayBuffer());
      const info = await inspectDocx(data);
      setPending({ data, fileName: file.name, size: file.size, fields: info.fields, mailMerge: info.mailMerge });
    } catch (e) {
      setPending(null);
      setUpErr(`Không đọc được file: ${(e as Error).message}`);
    }
  };
  /** Đồng ý dùng file đang xem trước → gắn vào template (vẫn phải bấm Lưu mới ghi nhận). */
  const acceptPending = () => {
    if (!pending) return;
    const p = pending;
    setF((o) => ({ ...o, data: p.data, fileName: p.fileName, size: p.size, fields: p.fields, uploadedAt: nowIso(), uploadedBy: ME, name: o.name || p.fileName.replace(/\.docx$/i, '') }));
    setNewFile(true);
    setPending(null);
    const unk = p.fields.filter((k) => !FIELD_KEYS.has(k.normalize('NFC'))).length;
    flash(
      p.fields.length
        ? `Đã dùng file ${p.fileName}: ${p.fields.length} trường trộn${unk ? `, ${unk} trường chưa có trong danh sách` : ''}${p.mailMerge ? ' · file trộn thư của Word — khi in hệ thống tự bỏ liên kết tới file Excel nguồn' : ''}`
        : `File ${p.fileName} không có trường trộn nào — nội dung in sẽ giống hệt file mẫu`,
    );
  };
  const save = (replace = false, okDeact = false) => {
    setTried(true);
    if (nErr) return flash('Vui lòng kiểm tra các trường được đánh dấu đỏ');
    if (deactWarn && !okDeact) return setAskDeact(true);
    setAskDeact(false);
    if (blockers.length) return setAskReplace(true);
    if (clash.length && !replace) return setAskReplace(true);
    setAskReplace(false);
    const v: TemplateDef = { ...f, companyIds: fScope.companyIds, code: f.code.trim().toUpperCase(), name: f.name.trim() };
    const logs = [...v.history];
    const repl = clash.length ? ` · thay thế ${clash.map((t) => t.code).join(', ')}` : '';
    if (isNew) logs.push({ at: nowIso(), by: ME, action: `Tạo template · tải lên file ${v.fileName}${repl}` });
    else {
      const ch: string[] = [];
      if (orig!.name !== v.name) ch.push(`tên: ${orig!.name} → ${v.name}`);
      if (orig!.code !== v.code) ch.push(`mã: ${orig!.code} → ${v.code}`);
      if (orig!.appliesTo.join() !== v.appliesTo.join()) ch.push(`áp dụng cho: ${v.appliesTo.map((a) => targetName(v, a)).join(', ')}`);
      if (orig!.companyIds.join() !== v.companyIds.join()) ch.push(`công ty: ${tplCompanyNames(v)}`);
      if (orig!.active !== v.active) ch.push(v.active ? 'chuyển Đang sử dụng' : 'chuyển Ngừng sử dụng');
      if (orig!.note !== v.note) ch.push('ghi chú');
      if (newFile) logs.push({ at: nowIso(), by: ME, action: `Thay file Word: ${v.fileName} (${v.fields.length} trường trộn)` });
      if (ch.length || repl) logs.push({ at: nowIso(), by: ME, action: `Cập nhật ${[...ch, ...(repl ? [repl.slice(3)] : [])].join(' · ')}` });
      if (!ch.length && !newFile && !repl) {
        setEditing(false);
        setTried(false);
        return flash('Không có thay đổi');
      }
    }
    v.history = logs;
    const off = new Set(clash.map((t) => t.id));
    const replaced = (t: TemplateDef): TemplateDef => ({ ...t, active: false, history: [...t.history, { at: nowIso(), by: ME, action: `Ngừng sử dụng — thay bằng template ${v.code}` }] });
    updateCatalog((c) => {
      const rest = c.templates.map((t) => (off.has(t.id) ? replaced(t) : t));
      return { ...c, templates: isNew ? [...rest, v] : rest.map((t) => (t.id === v.id ? v : t)) };
    });
    flash(`${isNew ? `Đã thêm template ${v.name}` : `Đã lưu template ${v.name}`}${clash.length ? ` · ${replaceText}` : ''}`);
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
    setF({ ...orig!, appliesTo: [...orig!.appliesTo], companyIds: [...orig!.companyIds] });
    setGeneral(!orig!.companyIds.length);
    setAskDeact(false);
    setEditing(false);
    setTried(false);
    setNewFile(false);
    setUpErr('');
    setAskReplace(false);
  };
  /** Chuyển Ngừng sử dụng (từ dải chặn xoá) */
  const deactivate = () => {
    const v: TemplateDef = { ...orig!, active: false, history: [...orig!.history, { at: nowIso(), by: ME, action: 'Cập nhật chuyển Ngừng sử dụng' }] };
    updateCatalog((c) => ({ ...c, templates: c.templates.map((t) => (t.id === v.id ? v : t)) }));
    setF(v);
    setConfirmDel(false);
    flash(`Đã chuyển template ${v.name} sang Ngừng sử dụng`);
  };
  const ed = editing;

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
              <Btn variant="primary" icon={Save} onClick={() => save()}>
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
                { label: 'Công ty', value: tplCompanyNames(orig, true) },
                { label: 'File', value: `${orig.fileName} (${fileSize(orig.size)})` },
              ]
        }
        notice={
          confirmDel && inUse.length && isGeneralOrig ? (
            <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-amber-50 text-[12.5px] text-amber-800">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="flex-1 min-w-[240px]">
                Không xoá được template chung <b>{f.code} — {f.name}</b> khi đang hiệu lực — hãy ngừng sử dụng trước. Cảnh báo khi ngừng: {lostText}.
              </span>
              <Btn className="h-7" onClick={() => setConfirmDel(false)}>
                Đóng
              </Btn>
              <Btn className="h-7" onClick={deactivate}>
                Chuyển Ngừng sử dụng
              </Btn>
            </div>
          ) : confirmDel && inUse.length ? (
            <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-amber-50 text-[12.5px] text-amber-800">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="flex-1 min-w-[240px]">
                Không xoá được template <b>{f.code} — {f.name}</b>: {inUse.join('; ')}. Chuyển Ngừng sử dụng nếu không muốn dùng nữa.
              </span>
              <Btn className="h-7" onClick={() => setConfirmDel(false)}>
                Đóng
              </Btn>
              <Btn variant="primary" className="h-7" onClick={deactivate}>
                Chuyển Ngừng sử dụng
              </Btn>
            </div>
          ) : confirmDel ? (
            <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-rose-50 text-[12.5px] text-rose-700">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="flex-1 min-w-[240px]">
                Xoá template <b>{f.code} — {f.name}</b>? Template sẽ không còn trong danh sách; lịch sử và các phiên bản tệp vẫn được lưu lại.
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
          ) : askDeact && deactWarn && !nErr ? (
            <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-amber-50 text-[12.5px] text-amber-800">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="flex-1 min-w-[240px]">Cảnh báo — {warnText}.</span>
              <Btn className="h-7" onClick={() => setAskDeact(false)}>
                Không lưu
              </Btn>
              <Btn variant="primary" icon={Save} className="h-7" onClick={() => save(false, true)}>
                Vẫn lưu
              </Btn>
            </div>
          ) : askReplace && blockers.length && !nErr ? (
            <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-rose-50 text-[12.5px] text-rose-700">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="flex-1 min-w-[240px]">{blockText}.</span>
              <Btn className="h-7" onClick={() => setAskReplace(false)}>
                Đóng
              </Btn>
            </div>
          ) : askReplace && clash.length && !nErr ? (
            <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-amber-50 text-[12.5px] text-amber-800">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="flex-1 min-w-[240px]">
                Trùng phạm vi với template đang dùng {clashText}. Thay thế: {replaceText}.
              </span>
              <Btn className="h-7" onClick={() => setAskReplace(false)}>
                Không lưu
              </Btn>
              <Btn variant="primary" icon={Save} className="h-7" onClick={() => save(true)}>
                Thay thế và lưu
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
          onChange={(k) => (editing ? k !== tab && flash('Lưu hoặc huỷ sửa trước khi chuyển tab') : setTab(k))}
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
                    <>
                      <CompanyMultiSelect
                        options={cat.companies.filter((c) => isSigningCompany(c.id) || f.companyIds.includes(c.id)).map((c) => ({ id: c.id, name: isSigningCompany(c.id) ? c.name : `${c.shortName} (không còn ký HĐ)`, shortName: isSigningCompany(c.id) ? c.shortName : `${c.shortName} (không còn ký HĐ)` }))}
                        all={signingCompanies().map((c) => c.id)}
                        value={f.companyIds}
                        onChange={(ids) => setF({ ...f, companyIds: ids })}
                        err={!!E('companyIds')}
                        disabled={general}
                      />
                      <label className="mt-1.5 flex items-center gap-2 text-[12.5px] cursor-pointer">
                        <CheckBox checked={general} onChange={setGeneral} /> Áp dụng cho cả công ty thêm sau này (template chung)
                      </label>
                      <ErrText e={E('companyIds')} />
                    </>
                  ) : (
                    tplCompanyNames(fScope, true)
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
                      {clash.length > 0 && (blockers.length ? <p className="mt-1 text-[12px] text-rose-700">{blockText}.</p> : <p className="mt-1 text-[12px] text-amber-700">Trùng phạm vi với template đang dùng {clashText} — khi lưu sẽ hỏi thay thế.</p>)}
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
                  {f.data && (
                    <Btn icon={Eye} className="h-7" onClick={() => setViewFile(true)}>
                      Xem trước file
                    </Btn>
                  )}
                  <Btn icon={Upload} className={`h-7 ${!f.data ? '!bg-[#1f5fa8] !text-white !border-[#184c88]' : ''}`} onClick={() => fileRef.current?.click()}>
                    {f.data ? 'Thay file khác' : 'Tải lên file .docx'}
                  </Btn>
                  <input ref={fileRef} type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(e) => (e.target.files?.[0] && upload(e.target.files[0]), (e.target.value = ''))} />
                </>
              ) : f.data ? (
                <>
                  <Btn icon={Eye} className="h-7" onClick={() => setViewFile(true)}>
                    Xem trước file
                  </Btn>
                  <Btn icon={Download} className="h-7" onClick={() => downloadBytes(f.data!, f.fileName)}>
                    Tải file
                  </Btn>
                </>
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
                  <button type="button" className={LINK} onClick={downloadFieldsXlsx}>
                    Tải file danh sách trường trộn
                  </button>{' '}
                  (Excel) rồi chèn trường vào mẫu Word của công ty và tải lên.
                </p>
              </div>
            )}
          </Panel>

          <FieldDictionary used={new Set(f.fields)} flash={flash} />
        </div>
      )}

      {pending && (
        <FilePreviewModal
          file={pending}
          scope={f}
          replacing={f.data ? f.fileName : ''}
          error={upErr}
          onClose={() => setPending(null)}
          onPickOther={() => fileRef.current?.click()}
          onAccept={acceptPending}
        />
      )}
      {viewFile && f.data && !pending && (
        <FilePreviewModal file={{ data: f.data, fileName: f.fileName, size: f.size, fields: f.fields, mailMerge: false }} scope={f} onClose={() => setViewFile(false)} />
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
// Popup xem trước file Word (trước khi dùng file vừa tải lên / xem lại file hiện tại)
// ==========================================================================
type PendingFile = { data: Uint8Array; fileName: string; size: number; fields: string[]; mailMerge: boolean };
/** Dropdown nhiều lựa chọn: "Chọn tất cả" + checkbox từng công ty; đóng khi bấm ra ngoài. */
const CompanyMultiSelect: React.FC<{ options: { id: string; name: string; shortName: string }[]; all: string[]; value: string[]; onChange: (ids: string[]) => void; err?: boolean; disabled?: boolean }> = ({ options, all, value, onChange, err, disabled }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const allOn = all.length > 0 && all.every((id) => value.includes(id));
  const label = disabled ? 'Tất cả công ty' : !value.length ? '— Chọn công ty —' : allOn && value.length === all.length ? `Tất cả ${all.length} công ty hiện có` : options.filter((o) => value.includes(o.id)).map((o) => o.shortName).join(', ');
  const toggle = (id: string) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  return (
    <div ref={ref} className="relative">
      <button type="button" title={label} disabled={disabled} onClick={() => setOpen(!open)} className={`${INPUT} flex items-center justify-between gap-2 text-left ${err ? 'border-rose-400' : ''} ${disabled ? '!bg-slate-100 text-slate-400 cursor-not-allowed' : ''}`}>
        <span className={`truncate ${value.length || disabled ? '' : 'text-slate-400'}`}>{label}</span>
        <span className="text-[10px] text-slate-500">▾</span>
      </button>
      {open && !disabled && (
        <div className="absolute z-30 mt-1 w-full min-w-[240px] max-h-64 overflow-auto rounded border border-slate-300 bg-white shadow-lg py-1">
          <label className="flex items-center gap-2 px-2.5 py-1.5 text-[12.5px] font-semibold border-b border-slate-200 cursor-pointer hover:bg-slate-50">
            <input type="checkbox" checked={allOn} onChange={(e) => onChange(e.target.checked ? [...new Set([...value, ...all])] : value.filter((id) => !all.includes(id)))} /> Chọn tất cả
          </label>
          {options.map((o) => (
            <label key={o.id} className="flex items-center gap-2 px-2.5 py-1.5 text-[12.5px] cursor-pointer hover:bg-slate-50">
              <input type="checkbox" checked={value.includes(o.id)} onChange={() => toggle(o.id)} /> {o.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

type Scope = Pick<TemplateDef, 'kind' | 'appliesTo' | 'companyIds'>;

/** Chọn 1 hợp đồng (+ loại phụ lục, ngày áp dụng) để trộn thử — dùng ở tab Xem trước và popup xem trước file. */
const useMergePick = (t: Scope) => {
  const cs = useContractStore();
  const cat = useCatalog();
  const workerOf = useMemo(() => new Map(cs.workers.map((w) => [w.id, w])), [cs.workers]);
  const typeNames = new Set(t.kind !== 'PL' ? t.appliesTo.map((id) => cat.types.find((x) => x.id === id)?.name) : []);
  // chưa tích phạm vi (đang thêm mới) → lấy mọi HĐ của công ty
  const pool = cs.contracts
    .filter((c) => workerOf.has(c.workerId) && (!typeNames.size || typeNames.has(c.type)) && tplHasCompany(t, c.companyId))
    .sort((a, b) => b.signDate.localeCompare(a.signDate));
  const [cid, setCid] = useState(pool[0]?.id || '');
  const [appId, setAppId] = useState('');
  const [appDate, setAppDate] = useState(today());
  const [q, setQ] = useState('');
  const shown = pool.filter((x) => !q || `${x.no} ${workerOf.get(x.workerId)?.name} ${workerOf.get(x.workerId)?.code}`.toLowerCase().includes(q.toLowerCase())).slice(0, 200);
  // hợp đồng đang chọn rơi khỏi danh sách (lọc / đổi phạm vi) → chọn hợp đồng đầu tiên còn lại
  useEffect(() => {
    if (!shown.some((x) => x.id === cid)) setCid(shown[0]?.id || '');
  }, [q, shown.length, shown[0]?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  const apps = t.kind === 'PL' ? t.appliesTo : [];
  const app: AppendixTypeDef | undefined = cat.appendix.find((a) => a.id === (apps.includes(appId) ? appId : apps[0]));
  const c = cs.contracts.find((x) => x.id === cid);
  const w = c ? workerOf.get(c.workerId) : undefined;
  const data = useMemo(
    () => (c && w ? mergeDataOf(c as Contract, w as Worker, t.kind === 'PL' ? app : undefined, appDate) : null),
    [c, w, t.kind, app, appDate],
  );
  const controls = (
    <>
      <div className="relative w-44">
        <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Lọc số HĐ, họ tên..." className={`${erp.inputFull} h-7 pl-7`} />
      </div>
      <select value={cid} onChange={(e) => setCid(e.target.value)} className={`${erp.input} h-7 w-72`} data-testid="merge-contract">
        {!shown.length && <option value="">Không có hợp đồng phù hợp</option>}
        {shown.map((x) => (
          <option key={x.id} value={x.id}>
            {x.no} · {workerOf.get(x.workerId)?.name} · {x.type}
          </option>
        ))}
      </select>
      {t.kind === 'PL' && (
        <>
          <span className="flex items-center gap-1.5 text-[12px] text-slate-600 whitespace-nowrap">
            Ngày áp dụng
            <span className="w-32">
              <DateInput value={appDate} onChange={setAppDate} className="!h-7" />
            </span>
          </span>
          <select value={app?.id || ''} onChange={(e) => setAppId(e.target.value)} className={`${erp.input} h-7 w-52`}>
            {!apps.length && <option value="">Chưa chọn loại phụ lục</option>}
            {apps.map((a) => (
              <option key={a} value={a}>
                {cat.appendix.find((x) => x.id === a)?.name}
              </option>
            ))}
          </select>
        </>
      )}
    </>
  );
  return { data, contract: c, controls };
};

const Legend: React.FC<{ merged: boolean }> = ({ merged }) => (
  <span className="flex flex-wrap items-center gap-3 text-[11.5px] text-slate-500">
    {!merged && (
      <span>
        <mark className="bg-emerald-100 text-emerald-800 px-1 rounded-sm">Nền xanh</mark> = trường hợp lệ
      </span>
    )}
    <span>
      <mark className="bg-rose-100 text-rose-700 px-1 rounded-sm">Nền đỏ</mark> = trường không có trong danh sách
    </span>
  </span>
);

const FilePreviewModal: React.FC<{ file: PendingFile; scope: Scope; replacing?: string; error?: string; onClose: () => void; onPickOther?: () => void; onAccept?: () => void }> = ({
  file,
  scope,
  replacing,
  error,
  onClose,
  onPickOther,
  onAccept,
}) => {
  const confirm = !!onAccept; // file vừa chọn → cần xác nhận dùng
  const unk = file.fields.filter((k) => !FIELD_KEYS.has(k.normalize('NFC')));
  const tpl = useMemo(() => ({ id: `pv-${file.fileName}-${file.size}`, data: file.data }), [file]);
  const [merge, setMerge] = useState<'raw' | 'merge'>('raw');
  const [askUnk, setAskUnk] = useState(false);
  const pick = useMergePick(scope);
  useEffect(() => setAskUnk(false), [file]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const accept = () => (unk.length && !askUnk ? setAskUnk(true) : onAccept?.());
  const merged = merge === 'merge' && !!pick.data;
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/45 flex items-center justify-center p-3" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-label="Xem trước file Word" className="w-[min(1100px,98vw)] h-[94vh] bg-white rounded-[4px] shadow-2xl border border-slate-300 flex flex-col overflow-hidden">
        <div className="h-11 shrink-0 flex items-center gap-2 px-4 bg-[#1e3a5f] text-white">
          <Eye size={16} />
          <span className="font-bold text-[14px]">{confirm ? 'Xem trước file trước khi dùng' : 'Xem trước file Word mẫu'}</span>
          <span className="text-[12px] text-slate-300 truncate">
            · {file.fileName} ({fileSize(file.size)})
          </span>
          <button onClick={onClose} className="ml-auto p-1 rounded hover:bg-white/15 cursor-pointer" title="Đóng (Esc)">
            <X size={16} />
          </button>
        </div>

        {error && <p className="shrink-0 px-4 py-2 bg-rose-50 border-b border-rose-200 text-[12.5px] text-rose-700">{error}</p>}
        <div className="shrink-0 px-4 py-2 border-b border-slate-200 bg-[#f8fafc] text-[12.5px] flex flex-wrap items-center gap-x-4 gap-y-1">
          <span>
            <b>{file.fields.length}</b> trường trộn
          </span>
          {unk.length ? (
            <span className="text-rose-600 inline-flex items-center gap-1">
              <AlertTriangle size={13} className="shrink-0" />
              {unk.length} trường không có trong danh sách: {unk.map((k) => `«${k}»`).join(', ')}
            </span>
          ) : file.fields.length ? (
            <span className="text-emerald-700 inline-flex items-center gap-1">
              <CheckCircle2 size={13} /> Tất cả trường trộn hợp lệ
            </span>
          ) : (
            <span className="text-amber-700">Không có trường trộn nào — nội dung in sẽ giống hệt file mẫu</span>
          )}
          {file.mailMerge && <span className="text-slate-500">File trộn thư của Word — khi in hệ thống tự bỏ liên kết tới file Excel nguồn</span>}
          {confirm && replacing && <span className="text-amber-700">Sẽ thay cho file hiện tại: {replacing}</span>}
        </div>

        <div className="shrink-0 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center gap-2">
          <Segmented
            options={[
              { key: 'raw', label: 'Mẫu gốc' },
              { key: 'merge', label: 'Trộn với hợp đồng' },
            ]}
            value={merge}
            onChange={setMerge}
          />
          {merge === 'merge' && pick.controls}
          <span className="ml-auto">
            <Legend merged={merged} />
          </span>
        </div>

        <div className="flex-1 min-h-0 overflow-auto bg-[#e9edf2] p-5">
          {merge === 'merge' && !pick.data ? (
            <p className="text-slate-500 text-center py-10">Không có hợp đồng phù hợp để trộn thử.</p>
          ) : (
            <ExactPreview tpl={tpl} data={merged ? pick.data! : undefined} fieldKeys={FIELD_KEYS} />
          )}
        </div>

        {askUnk ? (
          <div className="shrink-0 flex flex-wrap items-center gap-2 px-4 py-2.5 border-t border-amber-200 bg-amber-50 text-[12.5px] text-amber-800">
            <AlertTriangle size={14} className="shrink-0" />
            <span className="flex-1 min-w-[240px]">
              File có <b>{unk.length}</b> trường không có trong danh sách — khi in các trường này giữ nguyên. Vẫn dùng file này?
            </span>
            <Btn onClick={() => setAskUnk(false)}>Xem lại</Btn>
            <Btn variant="primary" icon={Check} onClick={onAccept}>
              Vẫn dùng
            </Btn>
          </div>
        ) : (
          <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 border-t border-slate-200 bg-[#f8fafc]">
            <span className="text-[12px] text-slate-500">{confirm ? 'File chỉ được gắn vào template khi bấm "Dùng file này" rồi Lưu.' : 'Bản xem trước dựng gần đúng file Word (gồm đầu / chân trang).'}</span>
            <span className="ml-auto" />
            {confirm ? (
              <>
                <Btn icon={X} onClick={onClose}>
                  Huỷ
                </Btn>
                <Btn icon={Upload} onClick={onPickOther}>
                  Chọn file khác
                </Btn>
                <Btn variant="primary" icon={Check} onClick={accept}>
                  Dùng file này
                </Btn>
              </>
            ) : (
              <Btn onClick={onClose}>Đóng</Btn>
            )}
          </div>
        )}
      </div>
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
  const rows = FIELDS.filter((f) => (!group || f.group === group) && (!q || `${f.key} ${f.label} ${f.desc || ''}`.toLowerCase().includes(q.toLowerCase())));
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
      title={`Danh sách trường trộn (${FIELDS.filter((f) => !f.group.startsWith('Tên cũ')).length} trường chuẩn · ${FIELDS.filter((f) => f.group.startsWith('Tên cũ')).length} tên cũ)`}
      icon={ClipboardCopy}
      noPad
      actions={
        <>
          <select value={group} onChange={(e) => setGroup(e.target.value)} className={`${erp.input} h-7 w-64`}>
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
      footer="Bấm vào tên trường để sao chép dạng {{Tên_trường}} rồi dán vào file Word — hoặc chèn trường Word cùng tên (Insert → Quick Parts → Field → MergeField). Mã trường theo danh sách trường trộn v2; mã cũ vẫn trộn được. Trường _text đã có chữ “ngày … tháng … năm …” — không gõ thêm chữ “ngày” phía trước."
    >
      <div className="overflow-auto max-h-[420px]">
        <table className={`${erp.table} table-fixed min-w-[1100px]`}>
          <thead className="sticky top-0 z-10">
            <tr>
              <th className={`${th} border-l-0 w-10 !text-center`}>STT</th>
              <th className={`${th} w-44`}>Tên gọi chuẩn</th>
              <th className={`${th} w-60`}>Mã trường trộn</th>
              <th className={th}>Diễn giải</th>
              <th className={`${th} w-32`}>Ví dụ dữ liệu</th>
              <th className={`${th} w-44`}>Định dạng dữ liệu</th>
              <th className={`${th} w-20 !text-center`} title="Trường có trong file Word của template này">Trong file</th>
              <th className={`${th} border-r-0 w-20 !text-center`} title="Số template đang dùng trường này">Số mẫu</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((f, i) => (
              <React.Fragment key={f.key}>
              {(i === 0 || rows[i - 1].group !== f.group) && (
                <tr>
                  <td colSpan={8} className={`${erp.td} border-x-0 bg-slate-50 font-semibold text-slate-700`}>
                    {f.group}
                  </td>
                </tr>
              )}
              <tr className={erp.tr}>
                <td className={`${erp.td} border-l-0 text-center text-slate-500`}>{i + 1}</td>
                <td className={erp.td}>{f.label}</td>
                <td className={erp.td}>
                  <button type="button" className="inline-flex items-center gap-1 font-mono text-[12px] text-[#1f5fa8] hover:underline cursor-pointer text-left break-all" onClick={() => copy(f.key)} title="Bấm để sao chép">
                    {`{{${f.key}}}`} <ClipboardCopy size={11} className="text-slate-400 shrink-0" />
                  </button>
                </td>
                <td className={`${erp.td} text-slate-600`}>{f.desc || ''}</td>
                <td className={`${erp.td} text-slate-500`}>{f.sample || '(trống)'}</td>
                <td className={`${erp.td} text-[11px] leading-snug text-slate-500`}>{f.format || ''}</td>
                <td className={`${erp.td} text-center`}>{used.has(f.key) && <Check size={14} className="inline text-emerald-600" />}</td>
                <td className={`${erp.td} border-r-0 text-center text-slate-600`}>{usage.get(f.key) || ''}</td>
              </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
};

// ==========================================================================
// Xem trước với dữ liệu 1 hợp đồng — dựng đúng định dạng Word (gồm đầu / chân trang)
// ==========================================================================
const Preview: React.FC<{ t: TemplateDef; flash: (m: string) => void }> = ({ t, flash }) => {
  const { data, contract: c, controls } = useMergePick(t);
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
          {controls}
          <Btn variant="primary" icon={Download} className="h-7" disabled={!data || !t.data} onClick={downloadMerged}>
            Tải bản trộn (.docx)
          </Btn>
        </>
      }
      footer={
        <span className="flex flex-wrap items-center gap-3">
          <Legend merged={!!data} />
          <span>{data ? 'Đã thay dữ liệu của hợp đồng đang chọn.' : 'Chưa chọn hợp đồng — đang hiện mẫu gốc.'} Bản xem trước dựng gần đúng file Word (gồm đầu / chân trang).</span>
        </span>
      }
    >
      <div className="bg-[#e9edf2] p-4 overflow-auto max-h-[calc(100vh-260px)]">
        {!t.data ? <p className="text-slate-500 text-center py-10">Chưa có file Word để xem trước.</p> : <ExactPreview tpl={t} data={data ?? undefined} fieldKeys={FIELD_KEYS} />}
      </div>
    </Panel>
  );
};
