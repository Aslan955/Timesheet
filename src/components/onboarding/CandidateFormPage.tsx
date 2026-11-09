/**
 * Trang form thông tin cá nhân trước onboard — ứng viên mở từ link trong email (mô phỏng trang web công khai).
 * Submit → dữ liệu đổ vào hồ sơ Employees + tự gửi yêu cầu cấp tài khoản tới IT.
 */
import React, { useState } from 'react';
import { CheckCircle2, Globe, Lock, Send, X } from 'lucide-react';
import { useOnboarding } from '../../onboarding/OnboardingContext';
import { OnbRecord, FORM_FIELDS, FORM_GROUPS, taskOf, dmy, formLinkOf } from '../../onboarding/onboardingData';

/** Dữ liệu điền thử (giả lập) để demo nhanh. */
const sample = (r: OnbRecord): Record<string, string> => ({
  birthDate: '1998-04-12',
  gender: 'Nam',
  maritalStatus: 'Độc thân',
  phone: r.candidatePhone,
  idNo: '001098000123',
  idDate: '2021-06-15',
  idPlace: 'Cục Cảnh sát QLHC về TTXH',
  taxCode: '8000000123',
  socialInsNo: '0100000123',
  permanentAddress: 'Số 1, đường Mẫu, phường Mẫu, Hà Nội',
  currentAddress: 'Số 1, đường Mẫu, phường Mẫu, Hà Nội',
  bankAccount: '0000123456789',
  bankName: 'Ngân hàng Mẫu',
  education: 'Cử nhân',
  school: 'Trường Đại học Mẫu',
  major: 'Công nghệ thông tin',
});

export const CandidateFormPage: React.FC<{ record: OnbRecord; onClose: () => void; onSubmitted?: () => void }> = ({ record: r, onClose, onSubmitted }) => {
  const { submitForm } = useOnboarding();
  const t = taskOf(r, 'personalForm');
  const already = t.status === 'Đã hoàn thành';
  const [d, setD] = useState<Record<string, string>>(() => ({ phone: r.candidatePhone }));
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(already);
  const missing = FORM_FIELDS.filter((f) => f.required && !(d[f.key] || '').trim());
  const set = (k: string, v: string) => setD((x) => ({ ...x, [k]: v }));
  const link = t.formLink || formLinkOf(r.id);

  const submit = () => {
    if (missing.length) {
      setTried(true);
      return;
    }
    submitForm(r.id, d);
    setSent(true);
    onSubmitted?.();
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-3 md:p-6" data-testid="candidate-form">
      <div className="w-full max-w-4xl h-full max-h-[880px] bg-white rounded-[6px] shadow-2xl overflow-hidden flex flex-col">
        {/* Thanh trình duyệt mô phỏng */}
        <div className="flex items-center gap-2 px-3 h-10 bg-[#e9edf2] border-b border-slate-300 shrink-0">
          <span className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
          </span>
          <span className="flex-1 min-w-0 flex items-center gap-1.5 h-7 px-3 rounded-full bg-white border border-slate-300 text-[12px] text-slate-600">
            <Lock size={12} className="text-emerald-600 shrink-0" />
            <span className="truncate font-mono">{link}</span>
          </span>
          <span className="hidden sm:inline text-[11px] text-slate-500 whitespace-nowrap">Góc nhìn ứng viên (mô phỏng)</span>
          <button type="button" onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-300/60 cursor-pointer" title="Đóng">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#f4f6fa]">
          <div className="bg-[#011b64] text-white px-6 py-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/60 flex items-center gap-1.5">
              <Globe size={12} /> {r.company} · Cổng thông tin nhân sự mới
            </p>
            <h1 className="text-[20px] font-bold mt-1">Thông tin cá nhân trước ngày nhận việc</h1>
            <p className="text-[13px] text-white/80 mt-1">
              Chào {r.data.fullName}, chào mừng bạn gia nhập vị trí <b>{r.data.position}</b> — ngày nhận việc <b>{dmy(r.data.startDate)}</b>. Vui lòng điền các thông tin dưới đây để
              phòng Hành chính Nhân sự hoàn thiện hồ sơ và phòng IT chuẩn bị tài khoản cho bạn.
            </p>
          </div>

          {sent ? (
            <div className="max-w-xl mx-auto my-12 bg-white border border-slate-200 rounded-[6px] p-8 text-center" data-testid="candidate-form-done">
              <CheckCircle2 size={44} className="mx-auto text-emerald-600" />
              <h2 className="text-[18px] font-bold text-slate-800 mt-3">Cảm ơn bạn đã gửi thông tin!</h2>
              <p className="text-[13px] text-slate-600 mt-2">
                Phòng Hành chính Nhân sự đã nhận được thông tin. Phòng IT sẽ chuẩn bị email và tài khoản đăng nhập trước ngày {dmy(r.data.startDate)}.
              </p>
              <button type="button" onClick={onClose} className="mt-5 h-9 px-5 rounded-[4px] bg-[#011b64] text-white text-[13px] font-semibold cursor-pointer">
                Đóng
              </button>
            </div>
          ) : (
            <div className="px-4 md:px-6 py-5 space-y-4">
              <section className="bg-white border border-slate-200 rounded-[6px] p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
                  <Info label="Họ và tên" value={r.data.fullName} />
                  <Info label="Email cá nhân" value={r.candidateEmail} />
                  <Info label="Khối · Phòng ban" value={`${r.block} · ${r.data.department}`} />
                </div>
              </section>
              {FORM_GROUPS.map((g) => (
                <section key={g} className="bg-white border border-slate-200 rounded-[6px] p-4">
                  <h2 className="text-[13px] font-bold text-[#011b64] uppercase tracking-wide mb-3">{g}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    {FORM_FIELDS.filter((f) => f.group === g).map((f) => {
                      const err = tried && f.required && !(d[f.key] || '').trim();
                      const cls = `w-full h-9 px-3 rounded-[4px] border text-[13px] outline-none focus:border-[#011b64] focus:ring-2 focus:ring-[#011b64]/15 ${err ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'}`;
                      return (
                        <label key={f.key} className={`min-w-0 ${f.full ? 'sm:col-span-2' : ''}`}>
                          <span className="block text-[12.5px] font-semibold text-slate-700 mb-1">
                            {f.label}
                            {f.required && <span className="text-rose-500"> *</span>}
                          </span>
                          {f.type === 'select' ? (
                            <select value={d[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} className={`${cls} cursor-pointer bg-white`} data-field={f.key}>
                              <option value="">-- Chọn --</option>
                              {f.options!.map((o) => (
                                <option key={o}>{o}</option>
                              ))}
                            </select>
                          ) : (
                            <input type={f.type === 'date' ? 'date' : f.type === 'tel' ? 'tel' : 'text'} value={d[f.key] || ''} onChange={(e) => set(f.key, e.target.value)} className={cls} data-field={f.key} />
                          )}
                          {err && <span className="text-[11px] text-rose-600">Bắt buộc</span>}
                        </label>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {!sent && (
          <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t border-slate-200 bg-white shrink-0">
            <span className={`text-[12px] flex-1 min-w-[200px] ${tried && missing.length ? 'text-rose-600' : 'text-slate-500'}`}>
              {tried && missing.length ? `Còn thiếu ${missing.length} trường bắt buộc: ${missing.map((f) => f.label).join(', ')}` : 'Các trường có dấu * là bắt buộc. Thông tin được bảo mật, chỉ phòng HCNS xem được.'}
            </span>
            <button type="button" onClick={() => setD(sample(r))} className="h-9 px-3 rounded-[4px] border border-slate-300 text-[12.5px] text-slate-600 hover:bg-slate-50 cursor-pointer" data-testid="form-fill-sample">
              Điền dữ liệu mẫu
            </button>
            <button type="button" onClick={submit} className="h-9 px-5 rounded-[4px] bg-[#ff0f55] hover:bg-[#e00b4a] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer" data-testid="form-submit">
              <Send size={14} /> Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="min-w-0">
    <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
    <p className="font-semibold text-slate-800 truncate" title={value}>
      {value}
    </p>
  </div>
);
