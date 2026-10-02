/**
 * ContractModal — "Cập nhật ký hợp đồng" của 1 dự án kinh doanh.
 *
 * Mở khi bấm vào trạng thái Hợp đồng ("Chưa ký" / "Đã ký") trên màn chi tiết dự án.
 * Các trường theo mẫu Excel:
 *   Số hợp đồng · Ngày ký · Giá trị hợp đồng · Thời hạn thực hiện (Từ – Đến) ·
 *   Lý do lệch so với giá trị đã khai báo · Tệp tài liệu (hợp đồng và các tài liệu đính kèm) ·
 *   Phụ lục điều chỉnh: Số phụ lục | Ngày ký | Nội dung điều chỉnh | Cập nhật file phụ lục
 *
 * "Giá trị đã khai báo" = Doanh thu dự kiến của dự án; lệch thì bắt buộc nhập lý do.
 * Tệp đính kèm lưu tạm trong phiên (object URL) — chưa có máy chủ lưu file.
 */
import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, Paperclip, Plus, Trash2, FileText, AlertCircle, FileSignature } from 'lucide-react';
import { BizAddendum, BizAttachment, BizContract, BizProject } from '../business/BusinessProjectContext';
import { Btn, FormRow, erp } from './erp/Erp';

const money = (n: number) => Math.round(n || 0).toLocaleString('en-US');
const fileSize = (b: number) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const uid = () => Math.random().toString(36).slice(2, 10);
export const toAttachments = (list: FileList | null): BizAttachment[] =>
  Array.from(list || []).map((f) => ({ id: uid(), name: f.name, size: f.size, url: URL.createObjectURL(f) }));

type Draft = Omit<BizContract, 'updatedAt' | 'updatedBy'>;

const initialDraft = (p: BizProject): Draft =>
  p.contract
    ? { ...p.contract, files: [...p.contract.files], addenda: p.contract.addenda.map((a) => ({ ...a, files: [...a.files] })) }
    : { number: '', signDate: '', value: p.expectedRevenue, from: p.startDate, to: p.endDate, deviationReason: '', files: [], addenda: [] };

/** Danh sách tệp đính kèm + nút chọn tệp. */
export const AttachmentList: React.FC<{ files: BizAttachment[]; onAdd: (f: BizAttachment[]) => void; onRemove: (id: string) => void; compact?: boolean; label?: string }> = ({
  files,
  onAdd,
  onRemove,
  compact,
  label = 'Chọn tệp',
}) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className={compact ? 'space-y-1' : 'space-y-1.5'}>
      <input
        ref={ref}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          onAdd(toAttachments(e.target.files));
          e.target.value = '';
        }}
      />
      {files.map((f) => (
        <div key={f.id} className="flex items-center gap-2 text-[12px] border border-slate-200 bg-slate-50 rounded-[3px] px-2 py-1">
          <FileText size={13} className="text-[#1f5fa8] shrink-0" />
          {f.url ? (
            <a href={f.url} target="_blank" rel="noreferrer" className="truncate text-[#1f5fa8] hover:underline" title={f.name}>
              {f.name}
            </a>
          ) : (
            <span className="truncate" title={f.name}>
              {f.name}
            </span>
          )}
          <span className="text-slate-400 shrink-0">{fileSize(f.size)}</span>
          <button type="button" onClick={() => onRemove(f.id)} className="ml-auto p-0.5 text-slate-400 hover:text-rose-600 cursor-pointer" title="Xoá tệp">
            <X size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`inline-flex items-center gap-1.5 border border-dashed border-slate-400 rounded-[3px] text-slate-600 hover:border-[#1f5fa8] hover:text-[#1f5fa8] cursor-pointer ${
          compact ? 'h-7 px-2 text-[11px]' : 'h-8 px-3 text-[12px]'
        }`}
      >
        <Paperclip size={compact ? 12 : 13} /> {label}
      </button>
    </div>
  );
};

export const ContractModal: React.FC<{ project: BizProject; onClose: () => void; onSave: (c: Draft) => void }> = ({ project: p, onClose, onSave }) => {
  const [d, setD] = useState<Draft>(() => initialDraft(p));
  const [touched, setTouched] = useState(false);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((prev) => ({ ...prev, [k]: v }));
  const setAddendum = (id: string, patch: Partial<BizAddendum>) => set('addenda', d.addenda.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  const diff = d.value - p.expectedRevenue;
  const diffPct = p.expectedRevenue ? (diff / p.expectedRevenue) * 100 : 0;

  const errors: Record<string, string> = {};
  if (!d.number.trim()) errors.number = 'Nhập số hợp đồng';
  if (!d.signDate) errors.signDate = 'Chọn ngày ký';
  if (!d.value) errors.value = 'Nhập giá trị hợp đồng';
  if (!d.from || !d.to) errors.period = 'Chọn thời hạn thực hiện';
  else if (d.to < d.from) errors.period = 'Ngày kết thúc phải sau ngày bắt đầu';
  if (diff && !d.deviationReason.trim()) errors.deviationReason = 'Giá trị hợp đồng khác giá trị đã khai báo — bắt buộc nhập lý do';
  d.addenda.forEach((a, i) => {
    if (!a.number.trim() || !a.signDate) errors[`add-${a.id}`] = `Phụ lục dòng ${i + 1}: nhập Số phụ lục và Ngày ký`;
  });
  const err = (k: string) => (touched ? errors[k] : undefined);
  const errCount = Object.keys(errors).length;

  const save = () => {
    setTouched(true);
    if (errCount) return;
    onSave({ ...d, number: d.number.trim(), deviationReason: diff ? d.deviationReason.trim() : '' });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40" />
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 12 }}
        className="relative bg-[#eef1f5] w-full max-w-4xl rounded-[4px] border border-slate-400 shadow-2xl z-10 flex flex-col max-h-[92vh]"
      >
        {/* Thanh tiêu đề */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-t-[3px]">
          <div className="min-w-0">
            <h3 className="text-[14px] font-bold flex items-center gap-2">
              <FileSignature size={16} /> Cập nhật ký hợp đồng
            </h3>
            <p className="text-[11px] text-slate-300 truncate">
              {p.masterCode} — {p.name} · Giá trị đã khai báo (Doanh thu dự kiến): {money(p.expectedRevenue)} VNĐ
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 cursor-pointer" title="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="p-3 space-y-3 overflow-y-auto">
          {touched && errCount > 0 && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-[3px] bg-rose-50 border border-rose-300 text-[12px] text-rose-700">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>
                Còn {errCount} mục chưa hợp lệ: {Object.values(errors).join('; ')}.
              </span>
            </div>
          )}

          {/* Thông tin hợp đồng */}
          <section className="bg-white border border-slate-300 rounded-[4px]">
            <header className="px-3 h-9 flex items-center bg-gradient-to-b from-[#f7f9fc] to-[#edf1f6] border-b border-slate-300 text-[12px] font-bold uppercase tracking-wide text-[#1e3a5f]">
              <span className="w-[3px] h-3.5 bg-[#1f5fa8] rounded-sm mr-1.5" /> Thông tin hợp đồng
            </header>
            <div className="p-3 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2.5">
              <FormRow label="Số hợp đồng" required error={err('number')}>
                <input value={d.number} onChange={(e) => set('number', e.target.value)} placeholder="VD: 2907/2026/HĐ/CTK-AQT" className={erp.inputFull} />
              </FormRow>
              <FormRow label="Ngày ký" required error={err('signDate')}>
                <input type="date" value={d.signDate} onChange={(e) => set('signDate', e.target.value)} className={erp.inputFull} />
              </FormRow>
              <FormRow label="Giá trị hợp đồng" required error={err('value')}>
                <div className="relative">
                  <input
                    inputMode="numeric"
                    value={d.value ? d.value.toLocaleString('en-US') : ''}
                    onChange={(e) => set('value', Number(e.target.value.replace(/[^\d]/g, '')) || 0)}
                    placeholder="0"
                    className={`${erp.inputFull} text-right pr-12 tabular-nums`}
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400">VNĐ</span>
                </div>
              </FormRow>
              <FormRow label="Thời hạn thực hiện" required error={err('period')} className="lg:col-span-2">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-slate-500">Từ</span>
                  <input type="date" value={d.from} onChange={(e) => set('from', e.target.value)} className={`${erp.input} w-44`} />
                  <span className="text-[12px] text-slate-500">Đến</span>
                  <input type="date" value={d.to} min={d.from} onChange={(e) => set('to', e.target.value)} className={`${erp.input} w-44`} />
                </div>
              </FormRow>

              {/* Đối chiếu với giá trị đã khai báo */}
              <div className="lg:col-span-2">
                <table className={erp.table}>
                  <thead>
                    <tr>
                      <th className={`${erp.th} text-left`}>Đối chiếu</th>
                      <th className={`${erp.th} text-right`}>Giá trị đã khai báo</th>
                      <th className={`${erp.th} text-right`}>Giá trị hợp đồng</th>
                      <th className={`${erp.th} text-right`}>Chênh lệch</th>
                      <th className={`${erp.th} text-center`}>Kết quả</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={erp.td}>Doanh thu dự kiến ↔ Giá trị hợp đồng</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(p.expectedRevenue)}</td>
                      <td className={`${erp.td} ${erp.num} font-semibold`}>{money(d.value)}</td>
                      <td className={`${erp.td} ${erp.num} ${diff ? 'text-amber-700 font-semibold' : 'text-slate-400'}`}>
                        {diff ? `${diff > 0 ? '+' : ''}${money(diff)} (${diffPct > 0 ? '+' : ''}${diffPct.toFixed(1)}%)` : '0'}
                      </td>
                      <td className={`${erp.td} text-center`}>
                        <span
                          className={`inline-flex px-1.5 py-px rounded-[3px] border text-[11px] font-semibold ${
                            diff ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          }`}
                        >
                          {diff ? 'Lệch' : 'Khớp'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <FormRow label="Lý do lệch so với giá trị đã khai báo" required={!!diff} error={err('deviationReason')} className="lg:col-span-2">
                <textarea
                  value={d.deviationReason}
                  onChange={(e) => set('deviationReason', e.target.value)}
                  rows={2}
                  disabled={!diff}
                  placeholder={diff ? 'VD: Khách hàng cắt giảm hạng mục đào tạo…' : 'Giá trị hợp đồng khớp giá trị đã khai báo — không cần nhập'}
                  className={`${erp.inputFull} h-auto py-1.5`}
                />
              </FormRow>

              <FormRow label="Tệp tài liệu" hint="Hợp đồng và các tài liệu đính kèm" className="lg:col-span-2">
                <AttachmentList
                  files={d.files}
                  onAdd={(f) => set('files', [...d.files, ...f])}
                  onRemove={(id) => set('files', d.files.filter((x) => x.id !== id))}
                  label="Tải lên hợp đồng / tài liệu"
                />
              </FormRow>
            </div>
          </section>

          {/* Phụ lục điều chỉnh */}
          <section className="bg-white border border-slate-300 rounded-[4px] overflow-hidden">
            <header className="px-3 h-9 flex items-center justify-between bg-gradient-to-b from-[#f7f9fc] to-[#edf1f6] border-b border-slate-300">
              <span className="text-[12px] font-bold uppercase tracking-wide text-[#1e3a5f] flex items-center">
                <span className="w-[3px] h-3.5 bg-[#1f5fa8] rounded-sm mr-1.5" /> Phụ lục điều chỉnh ({d.addenda.length})
              </span>
              <Btn
                icon={Plus}
                className="h-7"
                onClick={() => set('addenda', [...d.addenda, { id: uid(), number: '', signDate: '', content: '', files: [] }])}
              >
                Thêm phụ lục
              </Btn>
            </header>
            <div className="overflow-x-auto">
              <table className={`${erp.table} min-w-[760px]`}>
                <thead>
                  <tr>
                    {['STT', 'Số phụ lục', 'Ngày ký', 'Nội dung điều chỉnh', 'Cập nhật file phụ lục', ''].map((h, i) => (
                      <th key={i} className={`${erp.th} text-left border-t-0 first:border-l-0 last:border-r-0`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.addenda.map((a, i) => {
                    const bad = touched && !!errors[`add-${a.id}`];
                    const cell = `w-full h-8 px-2 bg-transparent text-[13px] outline-none focus:bg-[#eaf2fc] focus:ring-1 focus:ring-inset focus:ring-[#1f5fa8] ${bad ? 'bg-rose-50' : ''}`;
                    return (
                      <tr key={a.id} className="align-top">
                        <td className={`${erp.td} text-center text-slate-500 w-12 border-l-0`}>{i + 1}</td>
                        <td className="border border-slate-200 p-0 w-44">
                          <input value={a.number} onChange={(e) => setAddendum(a.id, { number: e.target.value })} placeholder="VD: PL01" className={cell} />
                        </td>
                        <td className="border border-slate-200 p-0 w-36">
                          <input type="date" value={a.signDate} onChange={(e) => setAddendum(a.id, { signDate: e.target.value })} className={cell} />
                        </td>
                        <td className="border border-slate-200 p-0">
                          <textarea
                            value={a.content}
                            onChange={(e) => setAddendum(a.id, { content: e.target.value })}
                            rows={1}
                            placeholder="Nội dung điều chỉnh"
                            className={`${cell} h-auto min-h-8 py-1.5 resize-y`}
                          />
                        </td>
                        <td className={`${erp.td} w-56`}>
                          <AttachmentList
                            compact
                            files={a.files}
                            onAdd={(f) => setAddendum(a.id, { files: [...a.files, ...f] })}
                            onRemove={(id) => setAddendum(a.id, { files: a.files.filter((x) => x.id !== id) })}
                            label="Tải file phụ lục"
                          />
                        </td>
                        <td className={`${erp.td} w-10 text-center border-r-0`}>
                          <button
                            type="button"
                            onClick={() => set('addenda', d.addenda.filter((x) => x.id !== a.id))}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Xoá phụ lục"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {!d.addenda.length && (
                    <tr>
                      <td colSpan={6} className={`${erp.td} text-center text-slate-400 py-5 border-x-0`}>
                        Chưa có phụ lục điều chỉnh — bấm "Thêm phụ lục" khi có.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-slate-300 bg-white rounded-b-[3px]">
          <span className="text-[11px] text-slate-500">
            {p.contract ? `Cập nhật lần cuối bởi ${p.contract.updatedBy} lúc ${new Date(p.contract.updatedAt).toLocaleString('vi-VN')}` : 'Lưu sẽ chuyển dự án sang trạng thái "Đã ký"'}
          </span>
          <div className="flex gap-1.5">
            <Btn icon={X} onClick={onClose}>
              Huỷ
            </Btn>
            <Btn variant="primary" icon={Save} onClick={save}>
              {p.contract ? 'Lưu thay đổi' : 'Lưu & xác nhận đã ký'}
            </Btn>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
