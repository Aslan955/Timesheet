/**
 * Thành phần dùng chung cho màn Bảng lương (theo code): toast kiểu toastr, popup xác nhận (PopupConfirm),
 * popup Add New Payroll, popup Import các khoản khác, popup xem nội dung phiếu lương đã gửi.
 */
import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Info, Loader2, Mail, Save, X, XCircle } from 'lucide-react';
import { Btn, erp } from '../erp/Erp';
import { ImportFile, MailItem, PeriodStatusId, SAMPLE_IMPORT_FILES, STATUS_NAME, ToastType, fmtCurrency } from '../../payroll/salary/salaryData';

// ───────────────────────── Toast (toastr) ─────────────────────────
const TOAST_CLS: Record<ToastType, string> = {
  success: 'bg-[#0f8f6c]',
  warning: 'bg-[#d97706]',
  error: 'bg-[#c0392b]',
  info: 'bg-[#1f5fa8]',
};
const TOAST_ICON: Record<ToastType, React.ElementType> = { success: CheckCircle2, warning: AlertCircle, error: XCircle, info: Info };
export const ToastStack: React.FC<{ items: { id: number; type: ToastType; text: string }[]; onClose: (id: number) => void }> = ({ items, onClose }) => (
  <div className="fixed top-4 right-4 z-[140] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)]">
    {items.map((t) => {
      const Icon = TOAST_ICON[t.type];
      return (
        <div key={t.id} className={`${TOAST_CLS[t.type]} text-white rounded-[4px] shadow-lg px-3 py-2.5 flex items-start gap-2 text-[12.5px]`}>
          <Icon size={15} className="shrink-0 mt-px" />
          <span className="flex-1 break-words">{t.text}</span>
          <button type="button" className="opacity-70 hover:opacity-100 cursor-pointer" onClick={() => onClose(t.id)}>
            <X size={13} />
          </button>
        </div>
      );
    })}
  </div>
);

// ───────────────────────── Pill trạng thái kỳ (StatusComponent + MapStatusColor) ─────────────────────────
const PILL: Record<PeriodStatusId, { color: string; bg: string; border: string }> = {
  18: { color: '#fd7e14', bg: '#fffbeb', border: '#fde68a' },
  19: { color: '#28a745', bg: '#ecfdf5', border: '#a7f3d0' },
  20: { color: '#dc3545', bg: '#fef2f2', border: '#fecaca' },
};
export const StatusPill: React.FC<{ statusId: PeriodStatusId }> = ({ statusId }) => (
  <span
    className="inline-block px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wide"
    style={{ color: PILL[statusId].color, background: PILL[statusId].bg, borderColor: PILL[statusId].border }}
  >
    {STATUS_NAME[statusId]}
  </span>
);

// ───────────────────────── Khung popup ─────────────────────────
export const Modal: React.FC<{ title: React.ReactNode; maxW: string; onClose?: () => void; children: React.ReactNode; footer?: React.ReactNode }> = ({ title, maxW, onClose, children, footer }) => (
  <div className="fixed inset-0 z-[120] bg-slate-900/40 flex items-start justify-center p-4 pt-[8vh] overflow-y-auto">
    <div className="bg-white rounded-[4px] border border-slate-300 shadow-xl w-full" style={{ maxWidth: maxW }}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-gradient-to-b from-[#f7f9fc] to-[#edf1f6]">
        <h3 className="text-[13px] font-bold text-[#1e3a5f]">{title}</h3>
        {onClose && (
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X size={16} />
          </button>
        )}
      </div>
      <div className="p-4 text-[13px]">{children}</div>
      {footer && <div className="flex justify-end gap-2 px-4 py-2.5 border-t border-slate-200 bg-slate-50">{footer}</div>}
    </div>
  </div>
);

/** PopupConfirmComponent: max 400px, tiêu đề "Xác nhận", footer Hủy / Xác nhận; withNote ⇒ Note bắt buộc. */
export const ConfirmPopup: React.FC<{ text: string; withNote?: boolean; onCancel: () => void; onOk: (note: string) => void }> = ({ text, withNote, onCancel, onOk }) => {
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const ok = () => {
    if (withNote && !note.trim()) {
      setErr('Please enter a Note.');
      return;
    }
    setBusy(true);
    setTimeout(() => onOk(note), 250);
  };
  return (
    <Modal
      title="Xác nhận"
      maxW="400px"
      footer={
        <>
          <Btn onClick={onCancel} disabled={busy}>
            Hủy
          </Btn>
          <Btn variant="primary" icon={busy ? Loader2 : Save} onClick={ok} disabled={busy} className={busy ? '[&>svg]:animate-spin' : ''}>
            Xác nhận
          </Btn>
        </>
      }
    >
      <p className="text-slate-700">{text}</p>
      {withNote && (
        <div className="mt-3">
          <label className="block text-[12px] text-slate-600 mb-1">
            Note <span className="text-rose-600">*</span>
          </label>
          <textarea rows={2} value={note} onChange={(e) => (setNote(e.target.value), setErr(''))} placeholder="Enter Note" className={`${erp.inputFull} h-auto py-1.5`} />
          {err && <p className="text-[11px] text-rose-600 mt-0.5">{err}</p>}
          <p className="text-[11px] text-slate-400 mt-1">Theo code: Note bắt buộc nhập nhưng không được gửi / lưu xuống service.</p>
        </div>
      )}
    </Modal>
  );
};

/** SalaryPopupComponent — "Add New Payroll": Month / Year, MinValue = 0, không có max, không validate. */
export const AddNewPopup: React.FC<{ defMonth: number; defYear: number; onCancel: () => void; onSave: (y: number, m: number) => boolean }> = ({ defMonth, defYear, onCancel, onSave }) => {
  const [m, setM] = useState(defMonth);
  const [y, setY] = useState(defYear);
  const [busy, setBusy] = useState(false);
  const save = () => {
    setBusy(true);
    setTimeout(() => {
      if (!onSave(y, m)) setBusy(false);
    }, 250);
  };
  return (
    <Modal
      title="Add New Payroll"
      maxW="640px"
      footer={
        <>
          <Btn onClick={onCancel}>Cancel</Btn>
          <Btn variant="primary" icon={busy ? Loader2 : undefined} onClick={save} disabled={busy} className={busy ? '[&>svg]:animate-spin' : ''}>
            Save
          </Btn>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-[12px] text-slate-600 mb-1">Month</span>
          <input type="number" min={0} value={m} onChange={(e) => setM(Math.max(0, Math.trunc(Number(e.target.value) || 0)))} className={erp.inputFull} />
        </label>
        <label className="block">
          <span className="block text-[12px] text-slate-600 mb-1">Year</span>
          <input type="number" min={0} value={y} onChange={(e) => setY(Math.max(0, Math.trunc(Number(e.target.value) || 0)))} className={erp.inputFull} />
        </label>
      </div>
      <p className="text-[11px] text-slate-400 mt-2">Theo code: không giới hạn tháng 1–12 (nhập 13 vẫn lưu được, mở chi tiết sẽ lỗi).</p>
    </Modal>
  );
};

/** Popup "Import các khoản khác" (SSL:419-484). Ô chọn file được mô phỏng bằng danh sách file mẫu. */
export const ImportPopup: React.FC<{
  errors: string[];
  onCancel: () => void;
  onUpload: (f: ImportFile) => void;
  onDownloadTemplate: () => void;
}> = ({ errors, onCancel, onUpload, onDownloadTemplate }) => {
  const [file, setFile] = useState<ImportFile | null>(null);
  const COLS = ['Mã NV', 'PC thiết bị', 'PC gửi xe', 'PC khác', 'Thưởng dự án', 'Thưởng kinh doanh', 'Thưởng giới thiệu nhân viên', 'Công tác phí', 'Thưởng khác', 'Điều chỉnh khác trước thuế'];
  const KEYS = ['DeviceAllowance', 'ParkingAllowance', 'OtherAllowances', 'ProjectBonus', 'BusinessBonus', 'ReferralBonus', 'BusinessTripAllowance', 'OtherBonuses', 'TaxAdjustment'] as const;
  return (
    <Modal
      title="Import các khoản khác"
      maxW="500px"
      footer={
        <>
          <Btn variant="primary" disabled={!file} onClick={() => file && onUpload(file)}>
            Upload
          </Btn>
          <Btn onClick={onCancel}>Cancel</Btn>
        </>
      }
    >
      <div className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-[4px] px-3 py-2">
        <span className="flex items-center gap-2 text-slate-700">
          <FileSpreadsheet size={16} className="text-emerald-600" /> Tải file mẫu import
        </span>
        <button type="button" className="text-[#1f5fa8] hover:underline flex items-center gap-1 cursor-pointer text-[12px]" onClick={onDownloadTemplate}>
          <Download size={13} /> Tải xuống
        </button>
      </div>
      <label className="block mt-3 text-[12px] text-slate-600">Chọn File (.xlsx) import:</label>
      <select className={`${erp.inputFull} mt-1`} value={file?.name || ''} onChange={(e) => setFile(SAMPLE_IMPORT_FILES.find((f) => f.name === e.target.value) || null)}>
        <option value="">— Chọn file mẫu (mô phỏng ô chọn file) —</option>
        {SAMPLE_IMPORT_FILES.map((f) => (
          <option key={f.name} value={f.name}>
            {f.name} — {f.note}
          </option>
        ))}
      </select>
      {file && (
        <>
          <div className="mt-3 bg-[#eaf2fc] border border-[#bcd3ee] text-[#1e3a5f] rounded-[4px] px-3 py-2 text-[12px]">
            File được chọn: <b>{file.name}</b> ({file.sizeKb.toFixed(2)} KB)
          </div>
          <div className="mt-2 overflow-x-auto border border-slate-200 rounded-[3px]">
            <table className={erp.table}>
              <thead>
                <tr>
                  <th className={`${erp.th} text-center`}>Dòng</th>
                  {COLS.map((c) => (
                    <th key={c} className={erp.th}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {file.rows.map((r, i) => (
                  <tr key={i} className={erp.tr}>
                    <td className={`${erp.td} text-center text-slate-500`}>{i + 2}</td>
                    <td className={`${erp.td} ${erp.code}`}>{r.code || <span className="text-slate-300">(trống)</span>}</td>
                    {KEYS.map((k) => (
                      <td key={k} className={`${erp.td} ${erp.num}`}>
                        {r.values[k] ? r.values[k]!.toLocaleString('en-US') : ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {errors.length > 0 && (
        <div className="mt-3 bg-rose-50 border border-rose-200 rounded-[4px] px-3 py-2 text-[12px] text-rose-700">
          <p className="font-semibold">Phát hiện {errors.length} lỗi khi import:</p>
          <ul className="mt-1 max-h-[200px] overflow-y-auto space-y-0.5">
            {errors.map((e, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <XCircle size={12} className="shrink-0 mt-0.5" /> {e}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  );
};

/** Bảng phiếu lương theo Template-PayRollSumarry.html (map MS:404-457). */
const payslipLines = (r: MailItem['row']): [string, string][] => {
  const n0 = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 0 });
  const n2 = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 2 });
  const otherDed = r.AdvanceDeductions + r.TradeUnionContributionRecovery;
  return [
    ['Họ và tên', r.FullName],
    ['Ngày công chuẩn', String(r.WorkDaysInMonth)],
    ['Ngày công thực tế 1', String(r.WorkDaysType1)],
    ['Ngày công thực tế 2', String(r.WorkDaysType2)],
    ['Mức lương Gross 1', n0(r.SalaryLevel)],
    ['Mức lương Gross 2', r.SalaryLevel2 ? n0(r.SalaryLevel2) : ''],
    ['Lương theo ngày công', n0(r.SalaryBasedOnWorkDays)],
    ['Tiền lương OT theo giờ', r.OvertimeHours.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })],
    ['Tiền OT theo giờ', n0(r.OvertimePay)],
    // ĐỀ XUẤT: số đã chốt ở Báo cáo Onsite (tiền gồm < 30km, ≥ 30km, bổ sung tháng trước)
    ['Số ngày Onsite', n2(r.OnsiteDays)],
    ['Tiền onsite', n0(r.OnsiteAllowance)],
    ['Thưởng khác', n0(r.OtherBonuses)],
    ['Tiền thưởng Lễ, tết', n0(r.HolidayBonus)],
    ['Tiền lương T13', n0(r.YearEndBonus)],
    ['Tổng thu nhập tháng', n0(r.TotalIncome)],
    ['Tổng thu nhập chịu thuế', n0(r.TaxableIncome)],
    ['Tổng thu nhập tính thuế (sau giảm trừ)', n0(r.TaxCalculatedIncome)],
    ['Trích đóng 8% BHXH, 1.5% YT, 1% TN', n0(r.SocialInsurance)],
    ['Trích đóng Đoàn phí', n0(r.TradeUnionFee)],
    ['Thuế TNCN tạm tính', n0(r.PersonalIncomeTax)],
    ['Các khoản trừ khác', otherDed > 0 ? n0(otherDed) : ''],
    ['Số tiền thực nhận', n0(r.NetReceived)],
    ['Số tài khoản ngân hàng', r.BankAccount],
    ['Tại Ngân hàng', r.BankName],
  ];
};
export const MailPreviewPopup: React.FC<{ mails: MailItem[]; onClose: () => void }> = ({ mails, onClose }) => {
  const [i, setI] = useState(0);
  const m = mails[i];
  const [y, mo] = m ? [m.row.Year, m.row.Month.slice(5, 7)] : ['', ''];
  return (
    <Modal title={<span className="flex items-center gap-1.5"><Mail size={14} /> Phiếu lương đã xếp hàng gửi (mô phỏng) — {mails.length} mail</span>} maxW="860px" onClose={onClose} footer={<Btn onClick={onClose}>Đóng</Btn>}>
      {!m ? (
        <p className="text-slate-500">Không có mail nào (dòng Email rỗng bị bỏ qua).</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-3">
          <ul className="border border-slate-200 rounded-[3px] max-h-[460px] overflow-y-auto divide-y divide-slate-100">
            {mails.map((x, k) => (
              <li key={k}>
                <button type="button" onClick={() => setI(k)} className={`w-full text-left px-2.5 py-1.5 text-[12px] cursor-pointer ${k === i ? 'bg-[#eaf2fc] text-[#1f5fa8] font-semibold' : 'hover:bg-slate-50'}`}>
                  {x.row.FullName}
                  <span className="block text-[11px] text-slate-500 font-normal truncate">{x.to}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="min-w-0">
            <div className="text-[12px] text-slate-600 space-y-0.5 mb-2">
              <p><b>Tới:</b> {m.to} · <b>CC:</b> (không có)</p>
              <p><b>Tiêu đề:</b> {m.subject}</p>
              <p className="text-slate-400">Nguồn số: {m.row.Id ? `dòng Salary đã lưu #${m.row.Id}` : 'số vừa tính (NV chưa có dòng đã lưu)'}</p>
            </div>
            <div className="border border-slate-300 rounded-[3px] p-3 bg-white">
              <p className="mb-2">Dear anh/chị: <b>{m.row.FullName}</b></p>
              <p className="text-center font-bold text-[#1e3a5f] mb-2">BẢNG CHI TIẾT TIỀN LƯƠNG THÁNG {mo}/{y}</p>
              <table className={erp.table}>
                <tbody>
                  {payslipLines(m.row).map(([k, v], idx) => (
                    <tr key={idx} className={erp.tr}>
                      <td className={`${erp.td} w-8 text-center text-slate-400`}>{idx + 1}</td>
                      <td className={erp.td}>{k}</td>
                      <td className={`${erp.td} ${erp.num} font-semibold`}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-[12px] text-slate-600">
                Mọi thắc mắc vui lòng phản hồi về HR trước 14h00, ngày <b>{m.feedbackDeadline}</b>.
              </p>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Theo code: dòng 8 hiện SỐ GIỜ OT dưới nhãn tiền; T13 luôn 0; "Các khoản trừ khác" không đọc NonTaxDeductions/OtherDeductions; không có OT gói, khoản import, truy lĩnh. Dòng onsite (đề xuất): số đã chốt ở Báo cáo Onsite. Thực nhận {fmtCurrency(m.row.NetReceived)}.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};
