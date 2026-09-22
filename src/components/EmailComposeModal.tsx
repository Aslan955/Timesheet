/**
 * EmailComposeModal — popup soạn 1 email cho ứng viên (dùng chung nhiều màn).
 * Tự điền mẫu theo loại + biến động, cho sửa, "gửi" (mock -> ghi lịch sử).
 */
import React, { useState } from 'react';
import { Mail, Send, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Candidate } from './CandidatePage';
import { useRecruitment } from '../recruitment/RecruitmentContext';
import { useEmail, EmailType, emailTypeLabel, fillTemplate } from '../email/EmailContext';

interface ComposeState {
  to: string;
  requestId: string;
  position: string;
  subject: string;
  body: string;
  edited: boolean;
  thoigian: string;
  diadiem: string;
  nguoiPV: string;
  luong: string;
  ngaynhanviec: string;
}

export const EmailComposeModal: React.FC<{
  candidate: Candidate;
  type: EmailType;
  onClose: () => void;
  onSent?: () => void;
}> = ({ candidate, type, onClose, onSent }) => {
  const { findRequest } = useRecruitment();
  const { templates, sendEmail } = useEmail();

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
    const tpl = templates[type];
    const vars = buildVars(c);
    return { ...c, subject: fillTemplate(tpl.subject, vars), body: fillTemplate(tpl.body, vars) };
  };

  const [compose, setCompose] = useState<ComposeState>(() =>
    regen({
      to: type === 'hr' ? '' : candidate.email || '',
      requestId: positionOptions[0].requestId,
      position: positionOptions[0].position,
      subject: '',
      body: '',
      edited: false,
      thoigian: '',
      diadiem: 'Văn phòng công ty',
      nguoiPV: candidate.taPic || '',
      luong: '',
      ngaynhanviec: '',
    }),
  );
  const [err, setErr] = useState('');

  const patchVar = (patch: Partial<ComposeState>) => setCompose((c) => regen({ ...c, ...patch }));

  const send = () => {
    if (!compose.to.trim()) { setErr('Vui lòng nhập email người nhận'); return; }
    if (!compose.subject.trim()) { setErr('Vui lòng nhập tiêu đề'); return; }
    sendEmail({
      candidateId: candidate.id,
      candidateName: candidate.name,
      type,
      to: compose.to.trim(),
      subject: compose.subject,
      body: compose.body,
    });
    onSent?.();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Mail size={16} className="text-[#0fa57c]" /> Soạn email — {emailTypeLabel(type)} · {candidate.name}
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><X size={18} /></button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Người nhận <span className="text-rose-500">*</span></label>
              <input value={compose.to} onChange={(e) => setCompose((c) => ({ ...c, to: e.target.value }))} placeholder={type === 'hr' ? 'email HCNS (VD: hcns@company.com)' : 'email@ungvien.com'} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c]" />
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

          {type === 'interview' && (
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
          {type === 'offer' && (
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
          {type === 'hr' && (
            <div>
              <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Ngày nhận việc</label>
              <input value={compose.ngaynhanviec} onChange={(e) => patchVar({ ngaynhanviec: e.target.value })} placeholder="VD: 01/09/2026" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c]" />
            </div>
          )}

          <div>
            <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Tiêu đề <span className="text-rose-500">*</span></label>
            <input value={compose.subject} onChange={(e) => setCompose((c) => ({ ...c, subject: e.target.value, edited: true }))} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c]" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-medium text-slate-500">Nội dung</label>
              {compose.edited && (
                <button type="button" onClick={() => setCompose((c) => regen({ ...c, edited: false }))} className="text-[11px] font-bold text-[#0fa57c] hover:underline cursor-pointer">
                  Khôi phục từ mẫu
                </button>
              )}
            </div>
            <textarea value={compose.body} onChange={(e) => setCompose((c) => ({ ...c, body: e.target.value, edited: true }))} rows={12} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c] resize-none font-mono leading-relaxed" />
          </div>

          {err && <p className="text-[11px] font-bold text-rose-600">{err}</p>}
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/40 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">Huỷ</button>
          <button type="button" onClick={send} className="px-4 py-2 text-xs font-bold text-white bg-[#0fa57c] hover:bg-[#0c8a68] rounded-lg flex items-center gap-1.5 cursor-pointer">
            <Send size={14} /> Gửi email
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
