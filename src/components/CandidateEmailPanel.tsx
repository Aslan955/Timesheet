/**
 * CandidateEmailPanel — khối gửi email cho 1 ứng viên (nhúng ở màn chi tiết).
 * - 3 nút: Lịch phỏng vấn / Thư từ chối / Offer letter → mở popup soạn (mock gửi).
 * - Popup soạn: chọn vị trí (theo yêu cầu ứng viên), điền biến động, xem/sửa nội dung.
 * - Lịch sử email đã gửi cho ứng viên + xem lại nội dung.
 */
import React, { useState } from 'react';
import { Mail, CalendarClock, Heart, Gift, Send, X, Clock, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Candidate } from './CandidatePage';
import { useRecruitment } from '../recruitment/RecruitmentContext';
import { useEmail, EMAIL_TYPES, EmailType, emailTypeLabel, fillTemplate, SentEmail } from '../email/EmailContext';

const typeStyle: Record<EmailType, string> = {
  interview: 'bg-sky-50 text-sky-600 border-sky-200',
  thanks: 'bg-violet-50 text-violet-600 border-violet-200',
  offer: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  hr: 'bg-amber-50 text-amber-600 border-amber-200',
};
const typeIcon: Record<EmailType, React.ElementType> = {
  interview: CalendarClock,
  thanks: Heart,
  offer: Gift,
  hr: Send,
};

interface ComposeState {
  type: EmailType;
  to: string;
  requestId: string;
  position: string;
  subject: string;
  body: string;
  edited: boolean; // đã sửa tiêu đề/nội dung thủ công chưa
  // biến động phụ theo loại
  thoigian: string;
  diadiem: string;
  nguoiPV: string;
  luong: string;
  ngaynhanviec: string;
}

export const CandidateEmailPanel: React.FC<{ candidate: Candidate }> = ({ candidate }) => {
  const { findRequest } = useRecruitment();
  const { templates, sendEmail, sentForCandidate } = useEmail();

  const [compose, setCompose] = useState<ComposeState | null>(null);
  const [viewMail, setViewMail] = useState<SentEmail | null>(null);
  const [flashMsg, setFlashMsg] = useState('');

  const history = sentForCandidate(candidate.id);

  // Danh sách vị trí ứng tuyển của ứng viên (theo applications) để chọn khi soạn
  const positionOptions = candidate.applications.length
    ? candidate.applications.map((a) => ({ requestId: a.requestId, position: findRequest(a.requestId)?.position || a.requestId }))
    : [{ requestId: '', position: candidate.appliedPosition || '' }];

  const buildVars = (c: ComposeState): Record<string, string> => ({
    ten: candidate.name,
    vitri: c.position,
    idrequest: c.requestId,
    email: candidate.email,
    sdt: candidate.phone,
    thoigian: c.thoigian,
    diadiem: c.diadiem,
    nguoiPV: c.nguoiPV,
    luong: c.luong,
    ngaynhanviec: c.ngaynhanviec,
  });

  const regen = (c: ComposeState): ComposeState => {
    if (c.edited) return c;
    const tpl = templates[c.type];
    const vars = buildVars(c);
    return { ...c, subject: fillTemplate(tpl.subject, vars), body: fillTemplate(tpl.body, vars) };
  };

  const openCompose = (type: EmailType) => {
    const first = positionOptions[0];
    const base: ComposeState = {
      type,
      to: candidate.email || '',
      requestId: first.requestId,
      position: first.position,
      subject: '',
      body: '',
      edited: false,
      thoigian: '',
      diadiem: 'Văn phòng công ty',
      nguoiPV: candidate.taPic || '',
      luong: '',
      ngaynhanviec: '',
    };
    setCompose(regen(base));
  };

  // cập nhật 1 biến động rồi tự sinh lại nội dung (nếu chưa sửa tay)
  const patchVar = (patch: Partial<ComposeState>) => setCompose((c) => (c ? regen({ ...c, ...patch }) : c));

  const send = () => {
    if (!compose) return;
    if (!compose.to.trim()) { setFlashMsg('Vui lòng nhập email người nhận'); return; }
    if (!compose.subject.trim()) { setFlashMsg('Vui lòng nhập tiêu đề'); return; }
    sendEmail({
      candidateId: candidate.id,
      candidateName: candidate.name,
      type: compose.type,
      to: compose.to.trim(),
      subject: compose.subject,
      body: compose.body,
    });
    setCompose(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
        <Mail size={16} className="text-[#0fa57c]" />
        <h3 className="text-sm font-black text-slate-800">Gửi email cho ứng viên</h3>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 ml-1">{history.length} đã gửi</span>
      </div>

      <div className="p-4 space-y-4">
        {/* Nút gửi theo loại email */}
        <div className="flex flex-wrap gap-2">
          {EMAIL_TYPES.map((t) => {
            const Icon = typeIcon[t.type];
            return (
              <button
                key={t.type}
                type="button"
                onClick={() => openCompose(t.type)}
                className={`px-3 py-2 rounded-lg text-xs font-bold border hover:brightness-95 transition-all flex items-center gap-1.5 cursor-pointer ${typeStyle[t.type]}`}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Lịch sử */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Lịch sử email</p>
          {history.length === 0 ? (
            <p className="text-xs text-slate-300 py-3 text-center">Chưa gửi email nào cho ứng viên này.</p>
          ) : (
            <ul className="space-y-2">
              {history.map((m) => {
                const Icon = typeIcon[m.type];
                return (
                  <li key={m.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50/70 group">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${typeStyle[m.type]}`}>
                      <Icon size={11} /> {emailTypeLabel(m.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">{m.subject}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} /> {m.sentAt} · {m.to}</p>
                    </div>
                    <button type="button" onClick={() => setViewMail(m)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#0fa57c] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" title="Xem nội dung">
                      <Eye size={15} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ===== Popup soạn email ===== */}
      <AnimatePresence>
        {compose && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            onClick={() => setCompose(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Mail size={16} className="text-[#0fa57c]" /> Soạn email — {emailTypeLabel(compose.type)}
                </h3>
                <button type="button" onClick={() => setCompose(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><X size={18} /></button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Người nhận <span className="text-rose-500">*</span></label>
                    <input value={compose.to} onChange={(e) => setCompose((c) => (c ? { ...c, to: e.target.value } : c))} placeholder="email@ungvien.com" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Vị trí ứng tuyển</label>
                    <select
                      value={compose.requestId}
                      onChange={(e) => {
                        const opt = positionOptions.find((o) => o.requestId === e.target.value) || positionOptions[0];
                        patchVar({ requestId: opt.requestId, position: opt.position });
                      }}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c] cursor-pointer"
                    >
                      {positionOptions.map((o, i) => (
                        <option key={i} value={o.requestId}>{o.position}{o.requestId ? ` (${o.requestId})` : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Biến động theo loại */}
                {compose.type === 'interview' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Thời gian</label>
                      <input value={compose.thoigian} onChange={(e) => patchVar({ thoigian: e.target.value })} placeholder="VD: 14:00 25/08/2026" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c]" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Địa điểm</label>
                      <input value={compose.diadiem} onChange={(e) => patchVar({ diadiem: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c]" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Người phỏng vấn</label>
                      <input value={compose.nguoiPV} onChange={(e) => patchVar({ nguoiPV: e.target.value })} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c]" />
                    </div>
                  </div>
                )}
                {compose.type === 'offer' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Mức lương</label>
                      <input value={compose.luong} onChange={(e) => patchVar({ luong: e.target.value })} placeholder="VD: 25.000.000 VND" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c]" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Ngày nhận việc</label>
                      <input value={compose.ngaynhanviec} onChange={(e) => patchVar({ ngaynhanviec: e.target.value })} placeholder="VD: 01/09/2026" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c]" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Tiêu đề <span className="text-rose-500">*</span></label>
                  <input value={compose.subject} onChange={(e) => setCompose((c) => (c ? { ...c, subject: e.target.value, edited: true } : c))} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c]" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[13px] font-medium text-slate-500">Nội dung</label>
                    {compose.edited && (
                      <button type="button" onClick={() => setCompose((c) => (c ? regen({ ...c, edited: false }) : c))} className="text-[11px] font-bold text-[#0fa57c] hover:underline cursor-pointer">
                        Khôi phục từ mẫu
                      </button>
                    )}
                  </div>
                  <textarea value={compose.body} onChange={(e) => setCompose((c) => (c ? { ...c, body: e.target.value, edited: true } : c))} rows={12} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c] resize-none font-mono leading-relaxed" />
                </div>

                {flashMsg && <p className="text-[11px] font-bold text-rose-600">{flashMsg}</p>}
              </div>

              <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/40 shrink-0">
                <button type="button" onClick={() => setCompose(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">Huỷ</button>
                <button type="button" onClick={send} className="px-4 py-2 text-xs font-bold text-white bg-[#0fa57c] hover:bg-[#0c8a68] rounded-lg flex items-center gap-1.5 cursor-pointer">
                  <Send size={14} /> Gửi email
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Popup xem lại email đã gửi ===== */}
      <AnimatePresence>
        {viewMail && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            onClick={() => setViewMail(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{viewMail.subject}</h3>
                  <p className="text-[11px] text-slate-400">{emailTypeLabel(viewMail.type)} · {viewMail.sentAt} · Đến: {viewMail.to}</p>
                </div>
                <button type="button" onClick={() => setViewMail(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><X size={18} /></button>
              </div>
              <div className="p-5 overflow-y-auto">
                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{viewMail.body}</pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
