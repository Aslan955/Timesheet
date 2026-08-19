/**
 * Form tạo ứng viên mới - phiên bản 2 (dùng lại bố cục/màu sắc của CandidateDetailV2Page).
 * Được nhúng trực tiếp vào màn "Quản lý ứng viên" (CandidatePage) làm lựa chọn V2 khi bấm "Thêm ứng viên".
 * Chỉ phụ trách hiển thị + nhập liệu (draft) — việc lưu/huỷ do CandidatePage xử lý (dùng lại đúng logic tạo mới sẵn có).
 */
import React, { useState } from 'react';
import { User, Globe, Check, List, FileText, IdCard, MessageSquare, CheckCircle2, Activity, History, AlertCircle } from 'lucide-react';
import { Candidate } from './CandidatePage';
import { CollapsibleField, FieldBox } from './CandidateDetailV2Page';
import { useCatalog } from '../catalog/CatalogContext';

type TabKey = 'details' | 'request' | 'cv' | 'note' | 'reference' | 'activity' | 'history';

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'details', label: 'Details', icon: List },
  { key: 'request', label: 'Request', icon: FileText },
  { key: 'cv', label: 'CV', icon: IdCard },
  { key: 'note', label: 'Note', icon: MessageSquare },
  { key: 'reference', label: 'Reference', icon: CheckCircle2 },
  { key: 'activity', label: 'Activity', icon: Activity },
  { key: 'history', label: 'History', icon: History },
];

export const CandidateFormV2: React.FC<{
  draft: Candidate;
  onChange: (patch: Partial<Candidate>) => void;
  onSave: () => void;
  onCancel: () => void;
  error?: string;
}> = ({ draft, onChange, onSave, onCancel, error }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('details');
  const { names } = useCatalog();

  return (
    <div className="bg-white rounded-2xl border border-[#0fa57c]/40 ring-2 ring-[#0fa57c]/10 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-5 sm:p-6 pb-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <User size={28} className="text-slate-300" />
          </div>
          <div className="min-w-0">
            <input
              value={draft.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Candidate name"
              className="text-lg font-black text-slate-900 border-b-2 border-[#0fa57c]/40 focus:border-[#0fa57c] outline-none bg-transparent"
            />
            <div className="mt-0.5">
              <span className="text-xs font-mono font-bold text-slate-300">ID auto-generated on save</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onSave}
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#0fa57c] hover:bg-[#0c8a68] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Check size={13} /> Create
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-5 sm:mx-6 mb-4 p-3 bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold rounded-xl flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 px-5 sm:px-6 border-b border-slate-100 overflow-x-auto no-scrollbar-x">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.key === activeTab;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-bold border-b-2 -mb-px transition-colors whitespace-nowrap ${
                active ? 'border-[#0fa57c] text-[#0fa57c]' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Nội dung tab */}
      <div className="p-5 sm:p-6 lg:p-8">
        {activeTab === 'details' ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-10">
            {/* Cột 1: liên hệ */}
            <div>
              <CollapsibleField label="Phone Number">
                <FieldBox value={draft.phone} editing placeholder="09xx xxx xxx" onChange={(v) => onChange({ phone: v })} />
              </CollapsibleField>

              <CollapsibleField label="Email">
                <FieldBox value={draft.email} editing placeholder="email@example.com" onChange={(v) => onChange({ email: v })} />
              </CollapsibleField>

              <CollapsibleField label="Ims and Websites" defaultOpen={false}>
                <FieldBox
                  value={draft.linkedin}
                  editing
                  placeholder="linkedin.com/in/..."
                  onChange={(v) => onChange({ linkedin: v })}
                />
              </CollapsibleField>
            </div>

            {/* Cột 2: học vấn & kinh nghiệm */}
            <div className="xl:border-l xl:border-slate-100 xl:pl-10">
              <CollapsibleField label="Education & Experience">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <FieldBox label="University" required editing options={names.university} placeholder="-- Chọn trường đại học --" value={draft.university} onChange={(v) => onChange({ university: v })} />
                  <FieldBox label="Major" required editing options={names.major} placeholder="-- Chọn chuyên ngành --" value={draft.major} onChange={(v) => onChange({ major: v })} />
                  <FieldBox
                    label="Current Position"
                    required
                    editing
                    value={draft.currentPosition}
                    onChange={(v) => onChange({ currentPosition: v })}
                  />
                  <FieldBox
                    label="Current Company"
                    required
                    editing
                    value={draft.currentCompany}
                    onChange={(v) => onChange({ currentCompany: v })}
                  />
                  <FieldBox
                    label="Tech Stack"
                    required
                    full
                    multiline
                    editing
                    value={draft.techStack}
                    onChange={(v) => onChange({ techStack: v })}
                  />
                </div>
              </CollapsibleField>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center text-sm text-slate-300 flex flex-col items-center gap-2">
            <Globe size={20} className="text-slate-200" />
            Save the candidate first to unlock the "{TABS.find((t) => t.key === activeTab)?.label}" tab.
          </div>
        )}
      </div>
    </div>
  );
};
