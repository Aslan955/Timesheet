/**
 * EmailHistoryModal — popup xem lịch sử email đã gửi cho 1 ứng viên + xem lại nội dung.
 */
import React, { useState } from 'react';
import { Clock, X, Eye, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { Candidate } from './CandidatePage';
import { useEmail, EmailType, emailTypeLabel, SentEmail } from '../email/EmailContext';

const typeStyle: Record<EmailType, string> = {
  interview: 'bg-sky-50 text-sky-600 border-sky-200',
  thanks: 'bg-violet-50 text-violet-600 border-violet-200',
  offer: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  hr: 'bg-amber-50 text-amber-600 border-amber-200',
};

export const EmailHistoryModal: React.FC<{ candidate: Candidate; onClose: () => void }> = ({ candidate, onClose }) => {
  const { sentForCandidate } = useEmail();
  const history = sentForCandidate(candidate.id);
  const [viewMail, setViewMail] = useState<SentEmail | null>(null);

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
            <Mail size={16} className="text-[#0fa57c]" /> Lịch sử email · {candidate.name}
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400">{history.length}</span>
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"><X size={18} /></button>
        </div>

        <div className="p-4 overflow-y-auto">
          {viewMail ? (
            <div>
              <button type="button" onClick={() => setViewMail(null)} className="text-xs font-bold text-[#0fa57c] hover:underline mb-3 cursor-pointer">← Quay lại danh sách</button>
              <div className="mb-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${typeStyle[viewMail.type]}`}>{emailTypeLabel(viewMail.type)}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800">{viewMail.subject}</h4>
              <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1"><Clock size={10} /> {viewMail.sentAt} · Đến: {viewMail.to}</p>
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed bg-slate-50/70 border border-slate-100 rounded-lg p-4">{viewMail.body}</pre>
            </div>
          ) : history.length === 0 ? (
            <p className="text-center text-sm text-slate-300 py-10">Chưa gửi email nào cho ứng viên này.</p>
          ) : (
            <ul className="space-y-2">
              {history.map((m) => (
                <li key={m.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50/70 group">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 ${typeStyle[m.type]}`}>{emailTypeLabel(m.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">{m.subject}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1"><Clock size={10} /> {m.sentAt} · {m.to}</p>
                  </div>
                  <button type="button" onClick={() => setViewMail(m)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#0fa57c] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" title="Xem nội dung">
                    <Eye size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
