/**
 * Catalog > Company — danh mục công ty (Code / Name / Address / Description / IsActive).
 * Lưới + popup Create/Edit, xoá có xác nhận. Dữ liệu mẫu giữ trong state (prototype).
 */
import React, { useState } from 'react';
import { PlusSquare, Pencil, Trash2, History, AlertCircle, Lock, ShieldCheck, Home, ChevronRight } from 'lucide-react';
import { DxGrid, Col } from './DxGrid';
import { useCompanies, updateMasters, type Company } from '../catalog/companyMaster';
import { empInCompany, getCatalog, updateCatalog } from './contracts/catalog';
import { CatalogHistoryDialog, logHistory, logHistoryDelete } from './contracts/ContractCatalogPage';
import { getContractStore } from './ContractsPage';
import { getEmployees } from './EmployeePage';

export type { Company };

const EMPTY_VER = 0;
const EMPTY = { code: '', name: '', address: '', description: '', taxCode: '', phone: '', email: '', bankAccount: '', bank: '', representative: '', isActive: false, signsContract: false };

// Quyền khối "Thông tin pháp lý & thanh toán": Company.LegalInfo.View / Company.LegalInfo.Edit (Edit kéo theo View)
type LegalAccess = 'none' | 'view' | 'edit';
const ACCESS_LABEL: Record<LegalAccess, string> = {
  none: 'Không có quyền',
  view: 'Chỉ xem (LegalInfo.View)',
  edit: 'Xem & sửa (LegalInfo.Edit)',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Số điện thoại: ký tự hợp lệ + - . ( ) khoảng trắng, tổng 8–15 chữ số
const PHONE_RE = new RegExp('^\\+?[0-9\\s().-]+$');
const phoneDigits = (v: string) => v.replace(/\D/g, '').length;

const inputCls = 'w-full px-3 py-2 bg-white border border-slate-300 rounded text-sm outline-none focus:border-[#0d6efd] placeholder:text-slate-400';

export const CompanyPage: React.FC = () => {
  const rows = useCompanies(); // dùng chung với Human Resources › Danh mục hợp đồng › Công ty
  const [editor, setEditor] = useState<{ id: string | null; ver: number; form: typeof EMPTY } | null>(null);
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState(''); // xung đột sửa đồng thời (popup Sửa)
  const [flagErr, setFlagErr] = useState(''); // lỗi dưới ô cờ Ký hợp đồng
  const [delConflict, setDelConflict] = useState('');
  const [delTarget, setDelTarget] = useState<Company | null>(null);
  const [histOf, setHistOf] = useState<Company | null>(null);
  const [access, setAccess] = useState<LegalAccess>('edit'); // mô phỏng quyền của người dùng đang đăng nhập
  const canView = access !== 'none';
  const canEdit = access === 'edit';

  const openAdd = () => { setError(''); setConflict(''); setFlagErr(''); setEditor({ id: null, ver: EMPTY_VER, form: { ...EMPTY } }); };
  const openEdit = (c: Company) => {
    setError('');
    setConflict('');
    setFlagErr('');
    setEditor({ id: c.id, ver: c.ver, form: { code: c.code, name: c.name, address: c.address, description: c.description, taxCode: c.taxCode, phone: c.phone, email: c.email, bankAccount: c.bankAccount, bank: c.bank, representative: c.representative, isActive: c.isActive, signsContract: c.signsContract } });
  };

  // Kiểm bản ghi đã đổi/xoá so với lúc mở; trả thông báo lỗi hoặc ''
  const staleMsg = (id: string, ver: number) => {
    const cur = rows.find((r) => r.id === id);
    return !cur ? 'Công ty đã bị xoá, tải lại' : cur.ver !== ver ? 'Dữ liệu công ty đã thay đổi, tải lại rồi thử lại' : '';
  };
  // Tải lại: mở lại popup với dữ liệu mới nhất (công ty bị xoá thì đóng)
  const reload = () => {
    const cur = editor?.id ? rows.find((r) => r.id === editor.id) : undefined;
    if (cur) openEdit(cur); else setEditor(null);
  };

  const submit = () => {
    if (!editor) return;
    setFlagErr('');
    if (editor.id) {
      const st = staleMsg(editor.id, editor.ver);
      if (st) return setConflict(st);
    }
    const f = { ...editor.form, code: editor.form.code.trim(), name: editor.form.name.trim(), representative: editor.form.representative.trim(), email: editor.form.email.trim() };
    if (!f.code) return setError('Vui lòng nhập Code');
    if (!f.name) return setError('Vui lòng nhập Name');
    if (f.signsContract) {
      if (!f.address.trim()) return setError('Công ty ký hợp đồng: vui lòng nhập Address');
      if (canEdit && !f.representative) return setError('Công ty ký hợp đồng: vui lòng nhập Representative');
    }
    if (canEdit && f.phone.trim() && (!PHONE_RE.test(f.phone.trim()) || phoneDigits(f.phone) < 8 || phoneDigits(f.phone) > 15)) return setError('Điện thoại không hợp lệ (8–15 chữ số, cho phép +, khoảng trắng, "-", ".", "()")');
    if (canEdit && f.email && !EMAIL_RE.test(f.email)) return setError('Email không hợp lệ (vd: name@company.vn)');
    if (f.signsContract && !f.isActive && !(editor.id && rows.find((r) => r.id === editor.id)?.signsContract)) return setError('Công ty đã ngừng sử dụng không thể bật cờ Ký hợp đồng — tích "Đang sử dụng" trước');
    if (rows.some((r) => r.id !== editor.id && r.code.toLowerCase() === f.code.toLowerCase())) return setError(`Code "${f.code}" đã tồn tại`);
    // Bật cờ Ký HĐ: ký hiệu số HĐ tự điền = Mã chuẩn hoá; đã có thì giữ, rỗng/trùng công ty khác thì chặn
    const wasSign = !!(editor.id && rows.find((r) => r.id === editor.id)?.signsContract);
    let autoCode = '';
    if (f.signsContract && !wasSign) {
      const cos = getCatalog().companies;
      const own = cos.find((x) => x.id === editor.id)?.contractCode || '';
      autoCode = own || f.code.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
      if (!autoCode || cos.some((x) => x.id !== editor.id && x.contractCode.toLowerCase() === autoCode.toLowerCase())) return setFlagErr('Không tự điền được Ký hiệu số HĐ: Mã trùng ký hiệu của công ty khác (hoặc rỗng) — nhập Ký hiệu ở tab Công ty trước');
    }
    if (editor.id) {
      const old = rows.find((r) => r.id === editor.id);
      const cat = getCatalog();
      const nSigner = cat.signers.filter((x) => x.companyId === old!.id && x.active).length;
      if (old?.isActive && !f.isActive) {
        if (cat.companies.find((x) => x.id === old.id)?.isDefault) return setError('Không ngừng/xoá công ty mặc định — chọn công ty mặc định khác trước');
        if (!rows.some((r) => r.id !== old.id && r.isActive)) return setError('Phải còn ít nhất 1 công ty đang sử dụng');
        if (nSigner) return setError(`Công ty còn ${nSigner} người ký đang sử dụng — ngừng/chuyển người ký trước`);
      }
      if (old?.signsContract && !f.signsContract) {
        if (cat.companies.find((x) => x.id === old.id)?.isDefault) return setError('Không bỏ cờ "Ký hợp đồng" của công ty mặc định — chọn công ty mặc định khác trước');
        if (nSigner) return setError(`Công ty còn ${nSigner} người ký đang sử dụng — ngừng/chuyển người ký trước`);
      }
    }
    // Không có quyền sửa khối → giữ nguyên giá trị cũ của khối (không ghi đè)
    const keep = (r?: Company) => (canEdit ? {} : { taxCode: r?.taxCode ?? '', phone: r?.phone ?? '', email: r?.email ?? '', bankAccount: r?.bankAccount ?? '', bank: r?.bank ?? '', representative: r?.representative ?? '' });
    const before = editor.id ? getCatalog().companies.find((x) => x.id === editor.id) : undefined;
    const newId = editor.id || `co-${Date.now()}`;
    if (editor.id) updateMasters((p) => p.map((r) => (r.id === editor.id ? { ...r, ...f, ...keep(r) } : r)));
    else updateMasters((p) => [...p, { id: newId, ver: 1, ...f, ...keep() }]);
    if (autoCode) updateCatalog((c) => ({ ...c, companies: c.companies.map((x) => (x.id === newId ? { ...x, contractCode: autoCode } : x)) }));
    const after = getCatalog().companies.find((x) => x.id === newId);
    if (after) logHistory('công ty', after, before); // kho danh mục hợp đồng đã đồng bộ ngay sau updateMasters
    setEditor(null);
  };

  // Chặn xoá: quy tắc như tab Công ty của Danh mục + công ty đang được dùng
  const usedBy = (() => {
    if (!delTarget) return '';
    const cat = getCatalog();
    const msgs: string[] = [];
    if (cat.companies.find((x) => x.id === delTarget.id)?.isDefault) msgs.push('Không ngừng/xoá công ty mặc định — chọn công ty mặc định khác trước');
    if (delTarget.isActive && !rows.some((r) => r.id !== delTarget.id && r.isActive)) msgs.push('Phải còn ít nhất 1 công ty đang sử dụng');
    const nAct = cat.signers.filter((x) => x.companyId === delTarget.id && x.active).length;
    if (nAct) msgs.push(`Công ty còn ${nAct} người ký đang sử dụng — ngừng/chuyển người ký trước`);
    const nHd = getContractStore().contracts.filter((x) => x.companyId === delTarget.id).length;
    const nEmp = getEmployees().filter((e) => empInCompany(e, { code: delTarget.code, shortName: delTarget.name, name: delTarget.description })).length;
    const nTpl = cat.templates.filter((x) => x.companyIds.includes(delTarget.id)).length;
    const nSg = cat.signers.filter((x) => x.companyId === delTarget.id).length;
    if (nHd || nEmp || nTpl || nSg) msgs.push(`Công ty đang dùng cho ${nHd} hợp đồng, có ${nEmp} nhân viên (kể cả đã nghỉ việc), có ${nTpl} template riêng, có ${nSg} người ký — chỉ có thể Ngừng sử dụng`);
    return msgs.join('. ');
  })();

  const columns: Col[] = [
    { key: 'code', label: 'Code', get: (r) => r.code },
    { key: 'name', label: 'Name', get: (r) => r.name },
    { key: 'address', label: 'Address', get: (r) => r.address, truncate: true },
    { key: 'description', label: 'Description', get: (r) => r.description, truncate: true },
    // Khối pháp lý & thanh toán — chỉ hiện khi có quyền xem
    ...(canView
      ? ([
          { key: 'taxCode', label: 'Tax Code', get: (r: Company) => r.taxCode },
          { key: 'representative', label: 'Representative', get: (r: Company) => r.representative },
          { key: 'phone', label: 'Phone', get: (r: Company) => r.phone },
          { key: 'email', label: 'Email', get: (r: Company) => r.email },
          { key: 'bankAccount', label: 'Bank Account', get: (r: Company) => r.bankAccount },
          { key: 'bank', label: 'Bank', get: (r: Company) => r.bank },
        ] as Col[])
      : []),
    { key: 'signsContract', label: 'Ký hợp đồng', get: (r) => (r.signsContract ? 'Yes' : 'No'), center: true, check: true, checkOn: 'Yes' },
    { key: 'isActive', label: 'IsActive', get: (r) => (r.isActive ? 'Active' : 'Inactive'), center: true, check: true },
  ];

  return (
    <div className="p-6">
      {/* Breadcrumb + Create (theo màn mục tiêu) */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <nav className="flex items-center gap-2 text-slate-800">
          <Home size={20} className="text-slate-600" />
          <span className="text-xl">Home</span>
          <ChevronRight size={16} className="text-slate-500" />
          <span className="text-xl">Catalog</span>
          <ChevronRight size={16} className="text-slate-500" />
          <span className="text-xl font-medium">Company</span>
        </nav>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 text-xs text-slate-500" title="Chỉ có trong prototype để demo phân quyền">
            <ShieldCheck size={14} className="text-[#0d6efd]" /> Quyền khối pháp lý &amp; thanh toán:
            <select value={access} onChange={(e) => setAccess(e.target.value as LegalAccess)} className="border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-700">
              {(Object.keys(ACCESS_LABEL) as LegalAccess[]).map((k) => <option key={k} value={k}>{ACCESS_LABEL[k]}</option>)}
            </select>
          </label>
          <button type="button" onClick={openAdd} className="px-5 py-2.5 text-sm font-medium text-white bg-[#0d6efd] hover:bg-[#0b5ed7] rounded flex items-center gap-2 cursor-pointer">
            <PlusSquare size={16} /> Create
          </button>
        </div>
      </div>

      <DxGrid
        rows={rows}
        columns={columns}
        exportName="Company"
        renderActions={(r) => (
          <div className="flex items-center justify-center gap-3">
            <button type="button" title="Lịch sử" onClick={() => setHistOf(r)} className="text-[#0d6efd] hover:text-[#0b5ed7] cursor-pointer"><History size={15} /></button>
            <button type="button" title="Edit" onClick={() => openEdit(r)} className="text-[#0d6efd] hover:text-[#0b5ed7] cursor-pointer"><Pencil size={15} /></button>
            <button type="button" title="Delete" onClick={() => { setDelConflict(''); setDelTarget(r); }} className="text-[#0d6efd] hover:text-[#0b5ed7] cursor-pointer"><Trash2 size={15} /></button>
          </div>
        )}
      />

      {editor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">{editor.id ? 'Edit Company' : 'Add Company'}</h3>
            </div>
            <div className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {([['code', 'Code'], ['name', 'Name']] as const).map(([k, label]) => (
                  <div key={k}>
                    <label className="block text-sm font-bold text-slate-900 mb-1.5">{label} <span className="text-red-600">*</span></label>
                    <input value={editor.form[k]} placeholder={`Enter ${label}`} onChange={(e) => setEditor((s) => s && { ...s, form: { ...s.form, [k]: e.target.value } })} className={inputCls} />
                  </div>
                ))}
              </div>
              {([['address', 'Address'], ['description', 'Description']] as const).map(([k, label]) => (
                <div key={k}>
                  <label className="block text-sm font-bold text-slate-900 mb-1.5">{label} {k === 'address' && editor.form.signsContract && <span className="text-red-600">*</span>}</label>
                  <input value={editor.form[k]} placeholder={`Enter ${label}`} onChange={(e) => setEditor((s) => s && { ...s, form: { ...s.form, [k]: e.target.value } })} className={inputCls} />
                </div>
              ))}
              <section className="border border-slate-200 rounded-lg">
                <header className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200 rounded-t-lg">
                  <h4 className="text-sm font-bold text-slate-900">Thông tin pháp lý &amp; thanh toán</h4>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${canEdit ? 'bg-emerald-50 text-emerald-700' : canView ? 'bg-amber-50 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                    {canEdit ? 'Được sửa' : canView ? 'Chỉ xem' : 'Bị khoá'}
                  </span>
                </header>
                {canView ? (
                  <div className="grid grid-cols-2 gap-4 p-4">
                    {([['taxCode', 'Tax Code', false], ['representative', 'Representative', editor.form.signsContract], ['phone', 'Phone', false], ['email', 'Email', false], ['bankAccount', 'Bank Account', false], ['bank', 'Bank', false]] as const).map(([k, label, req]) => (
                      <div key={k}>
                        <label className="block text-sm font-bold text-slate-900 mb-1.5">{label} {req && canEdit && <span className="text-red-600">*</span>}</label>
                        <input value={editor.form[k]} disabled={!canEdit} placeholder={`Enter ${label}`} onChange={(e) => setEditor((s) => s && { ...s, form: { ...s.form, [k]: e.target.value } })} className={`${inputCls} disabled:bg-slate-100 disabled:text-slate-500`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-6 text-sm text-slate-500"><Lock size={15} /> Bạn không có quyền xem khối thông tin này.</div>
                )}
              </section>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">Ký hợp đồng</label>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={editor.form.signsContract} onChange={(e) => { setFlagErr(''); setEditor((s) => s && { ...s, form: { ...s.form, signsContract: e.target.checked } }); }} className="w-5 h-5 accent-[#0d6efd] cursor-pointer" />
                  Pháp nhân dùng làm Bên A trên hợp đồng lao động
                </label>
                {flagErr && <div className="text-xs font-bold mt-1.5 text-rose-600 flex items-center gap-1.5"><AlertCircle size={13} /> {flagErr}</div>}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5">IsActive</label>
                <input type="checkbox" checked={editor.form.isActive} onChange={(e) => setEditor((s) => s && { ...s, form: { ...s.form, isActive: e.target.checked } })} className="w-5 h-5 accent-[#0d6efd] cursor-pointer" />
              </div>
              {conflict && (
                <div className="text-xs font-bold px-3 py-2 rounded bg-rose-50 text-rose-600 flex items-center gap-1.5">
                  <AlertCircle size={13} /> <span className="flex-1">{conflict}</span>
                  <button type="button" onClick={reload} className="px-2.5 py-1 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded cursor-pointer">Tải lại</button>
                </div>
              )}
              {error && (
                <div className="text-xs font-bold px-3 py-2 rounded bg-rose-50 text-rose-600 flex items-center gap-1.5"><AlertCircle size={13} /> {error}</div>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setEditor(null)} className="px-4 py-2 text-sm font-medium text-slate-800 bg-slate-200 hover:bg-slate-300 rounded cursor-pointer">Huỷ</button>
                <button type="button" onClick={submit} className="px-5 py-2 text-sm font-medium text-white bg-[#0d6efd] hover:bg-[#0b5ed7] rounded cursor-pointer">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {histOf && <CatalogHistoryDialog noun="công ty" item={{ id: histOf.id, code: histOf.code, name: histOf.name, active: histOf.isActive }} onClose={() => setHistOf(null)} />}

      {delTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={() => setDelTarget(null)}>
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Xoá công ty</h3>
            <p className="text-sm text-slate-500 mb-3">Bạn có chắc muốn xoá <b>{delTarget.name}</b> ({delTarget.code})?</p>
            {delConflict && (
              <div className="text-xs font-bold px-3 py-2 mb-3 rounded bg-rose-50 text-rose-600 flex items-center gap-1.5">
                <AlertCircle size={13} /> <span className="flex-1">{delConflict}</span>
                <button type="button" onClick={() => { const cur = rows.find((r) => r.id === delTarget.id); setDelConflict(''); setDelTarget(cur || null); }} className="px-2.5 py-1 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded cursor-pointer">Tải lại</button>
              </div>
            )}
            {usedBy && <div className="text-xs font-bold px-3 py-2 mb-3 rounded bg-rose-50 text-rose-600 flex items-center gap-1.5"><AlertCircle size={13} /> {usedBy}</div>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setDelTarget(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">Cancel</button>
              <button type="button" onClick={() => { if (usedBy) return; const st = staleMsg(delTarget.id, delTarget.ver); if (st) return setDelConflict(st); updateMasters((p) => p.filter((r) => r.id !== delTarget.id)); logHistoryDelete('công ty', delTarget.id); setDelTarget(null); }} disabled={!!usedBy} className="px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
