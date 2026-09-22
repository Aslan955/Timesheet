/**
 * Màn "Mẫu email" — quản lý 3 mẫu email (Lịch phỏng vấn, Từ chối, Offer).
 * Sửa Tiêu đề + Nội dung; dùng biến động {{...}} sẽ được thay khi soạn ở màn ứng viên.
 */
import React, { useState } from 'react';
import { Mail, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEmail, EMAIL_TYPES, EmailType, EMAIL_PLACEHOLDERS } from '../email/EmailContext';
import { Breadcrumb } from './DataTable';
import { SkinProvider, SkinName } from '../recruitment2/skin';

export const EmailTemplatePage: React.FC<{ skin?: SkinName }> = ({ skin = 'classic' }) => {
  const { templates, updateTemplate } = useEmail();
  const [activeType, setActiveType] = useState<EmailType>('interview');
  const [subject, setSubject] = useState(templates.interview.subject);
  const [body, setBody] = useState(templates.interview.body);
  const [msg, setMsg] = useState('');

  const load = (type: EmailType) => {
    setActiveType(type);
    setSubject(templates[type].subject);
    setBody(templates[type].body);
    setMsg('');
  };

  const save = () => {
    updateTemplate(activeType, { subject, body });
    setMsg('Đã lưu mẫu email');
    window.setTimeout(() => setMsg(''), 2000);
  };

  const dirty = subject !== templates[activeType].subject || body !== templates[activeType].body;

  return (
    <SkinProvider skin={skin}>
    <div className="p-6 h-full">
      <Breadcrumb items={skin === 'v2' ? ['Trang chủ', 'Tuyển dụng 2', 'Mẫu email'] : ['Home', 'Recruitment', 'Mẫu email']} />
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-[#0fa57c]/10 flex items-center justify-center">
          <Mail size={22} className="text-[#0fa57c]" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800">Mẫu email</h1>
          <p className="text-xs text-slate-400 font-medium">Chỉnh nội dung mẫu — áp dụng khi gửi email cho ứng viên.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5 items-start">
        {/* Danh sách loại mẫu */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden self-start">
          <nav className="p-2 space-y-0.5">
            {EMAIL_TYPES.map((t) => {
              const active = t.type === activeType;
              return (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => load(t.type)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${active ? 'bg-[#0fa57c]/10 text-[#0fa57c] font-bold' : 'text-slate-600 hover:bg-slate-50 font-semibold'}`}
                >
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Trình soạn mẫu */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
            <h2 className="text-base font-black text-slate-800">{EMAIL_TYPES.find((t) => t.type === activeType)?.label}</h2>
            <div className="flex items-center gap-2">
              {dirty && (
                <button type="button" onClick={() => load(activeType)} className="px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 cursor-pointer">
                  <RotateCcw size={14} /> Hoàn tác
                </button>
              )}
              <button type="button" onClick={save} disabled={!dirty} className="px-4 py-2 text-xs font-bold text-white bg-[#0fa57c] hover:bg-[#0c8a68] disabled:opacity-40 rounded-lg flex items-center gap-1.5 cursor-pointer">
                <Check size={15} /> Lưu mẫu
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Tiêu đề</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c]" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Nội dung</label>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={14} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c] resize-none font-mono leading-relaxed" />
            </div>

            {/* Chú thích biến động */}
            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Biến động dùng được (bấm để chèn vào nội dung)</p>
              <div className="flex flex-wrap gap-2">
                {EMAIL_PLACEHOLDERS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => setBody((b) => `${b}${p.key}`)}
                    title={p.desc}
                    className="px-2 py-1 rounded-md bg-white border border-slate-200 text-[11px] font-mono text-slate-600 hover:border-[#0fa57c] hover:text-[#0fa57c] cursor-pointer"
                  >
                    {p.key}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {msg && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5">
                  <Check size={13} /> {msg}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
    </SkinProvider>
  );
};
