/**
 * Màn hình chi tiết ứng viên - phiên bản 2 (demo bố cục mới).
 * Giữ nguyên màu sắc & phong cách hệ thống hiện tại (accent #0fa57c),
 * nhưng bố cục theo mẫu: header + tabs ngang + các cụm thông tin thu gọn.
 * Đây là entry riêng để xem trước, không thay thế màn chi tiết cũ (CandidatePage).
 */
import React, { useEffect, useState } from 'react';
import {
  X,
  Edit3,
  Copy,
  Check,
  Plus,
  ChevronDown,
  ChevronRight,
  List,
  FileText,
  IdCard,
  MessageSquare,
  CheckCircle2,
  Activity,
  History,
  Globe,
  User,
  UserRound,
  Calendar,
  Frame,
  Layers,
  Star,
  Download,
  Link as LinkIcon,
  ExternalLink,
  Paperclip,
  Trash2,
} from 'lucide-react';
import {
  Candidate,
  CandidateApplication,
  FinalStatus,
  FINAL_STATUSES,
  RECRUITMENT_REQUESTS,
  INITIAL_CANDIDATES,
  emptyForm,
  StatusBadge,
  CURRENT_USER,
  ChangeLog,
  FieldChange,
} from './CandidatePage';

// Nhãn tiếng Anh cho các trường được phép sửa trong màn hình này — dùng khi ghi lại lịch sử chỉnh sửa
// (không dùng chung FIELD_LABELS của màn cũ vì màn này đồng bộ toàn bộ giao diện bằng tiếng Anh)
const V2_FIELD_LABELS: Partial<Record<keyof Candidate, string>> = {
  name: 'Name',
  phone: 'Phone Number',
  email: 'Email',
  linkedin: 'LinkedIn',
  university: 'University',
  major: 'Major',
  currentPosition: 'Current Position',
  currentCompany: 'Current Company',
  techStack: 'Tech Stack',
};
const V2_EDITABLE_FIELDS = Object.keys(V2_FIELD_LABELS) as (keyof Candidate)[];

// Ghi chú thông tin về ứng viên - có thể tạo nhiều ghi chú theo thời gian
interface CandidateNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

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

const formatDateEN = (d: string) => (d ? new Date(d).toLocaleDateString('en-GB') : '');

// Nút sao chép nhanh giá trị, tự đổi icon thành dấu tick khi copy xong
export const CopyButton: React.FC<{ value: string }> = ({ value }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Trình duyệt chặn clipboard API (vd không phải HTTPS) — bỏ qua, không có gì để hiển thị thêm
        }
      }}
      className="text-slate-400 hover:text-[#0fa57c] transition-colors shrink-0"
      title="Copy"
    >
      {copied ? <Check size={13} className="text-[#0fa57c]" /> : <Copy size={13} />}
    </button>
  );
};

// Cụm thông tin thu gọn/mở rộng (label + chevron), giống phong cách Section của màn cũ
export const CollapsibleField: React.FC<{ label: string; defaultOpen?: boolean; children: React.ReactNode }> = ({
  label,
  defaultOpen = true,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 py-4 first:pt-0 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-1.5 text-sm font-bold text-slate-700 hover:text-[#0fa57c] transition-colors"
      >
        {open ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
        {label}
      </button>
      {open && <div className="mt-3 pl-[22px]">{children}</div>}
    </div>
  );
};

// Ô nhập/hiển thị 1 trường: nhãn (kèm dấu * nếu bắt buộc, có thể bỏ nhãn) + input khi sửa, box chỉ đọc khi xem.
// Dùng chung cho MỌI trường trong tab Details để bố cục đồng nhất (giống cụm Education & Experience).
export const FieldBox: React.FC<{
  label?: string;
  value: string;
  required?: boolean;
  full?: boolean;
  editing?: boolean;
  multiline?: boolean;
  placeholder?: string;
  display?: React.ReactNode;
  onChange?: (v: string) => void;
}> = ({ label, value, required, full, editing, multiline, placeholder, display, onChange }) => (
  <div className={full ? 'sm:col-span-2' : ''}>
    {label && (
      <label className="block text-[13px] font-medium text-slate-500 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
    )}
    {editing ? (
      multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          rows={2}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c] resize-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c]"
        />
      )
    ) : (
      <div className="w-full min-h-[42px] px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 flex items-center break-words">
        {display !== undefined ? display : value ? value : <span className="text-slate-300 font-normal">—</span>}
      </div>
    )}
  </div>
);

// Tab "Request": danh sách các Yêu cầu tuyển dụng mà ứng viên đang tham gia (có thể nhiều request cùng lúc)
export const RequestTabContent: React.FC<{
  applications: CandidateApplication[];
  assignee: string;
  date: string;
  onAdd: (requestId: string) => void;
  onRemove: (idx: number) => void;
  onChangeStatus: (idx: number, status: FinalStatus) => void;
}> = ({ applications, assignee, date, onAdd, onRemove, onChangeStatus }) => {
  const [showPicker, setShowPicker] = useState(false);
  const availableRequests = RECRUITMENT_REQUESTS.filter((r) => !applications.some((a) => a.requestId === r.id));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
          {applications.length} recruitment request{applications.length === 1 ? '' : 's'}
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPicker((s) => !s)}
            className="px-3.5 py-2 border border-[#0fa57c]/30 text-[#0fa57c] rounded-xl text-xs font-bold hover:bg-[#0fa57c]/5 transition-colors flex items-center gap-1.5"
          >
            <Plus size={13} /> Add request to candidate
          </button>
          {showPicker && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-10 p-2 max-h-72 overflow-y-auto">
              {availableRequests.length === 0 ? (
                <p className="text-xs text-slate-300 text-center py-3">All recruitment requests have been assigned</p>
              ) : (
                availableRequests.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      onAdd(r.id);
                      setShowPicker(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <p className="text-xs font-bold text-slate-700">
                      {r.id} · {r.position}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {r.level} · {r.block}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-300">No recruitment requests yet.</div>
      ) : (
        <div className="space-y-3">
          {applications.map((a, i) => {
            const req = RECRUITMENT_REQUESTS.find((r) => r.id === a.requestId);
            return (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#0fa57c]/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Frame size={22} className="text-slate-300" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0fa57c]">
                    Request [{i + 1}] [{req?.position || 'Undefined'}]
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Layers size={12} className="text-slate-400" />
                      {req?.block || '—'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-slate-400" />
                      {req?.level || '—'}
                    </span>
                    <span className="flex items-center gap-1">
                      ID: {a.requestId}
                      <CopyButton value={a.requestId} />
                    </span>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-start sm:items-end gap-1.5 shrink-0">
                  <StatusBadge status={a.finalStatus} withLabel />
                  <select
                    value={a.finalStatus}
                    onChange={(e) => onChangeStatus(i, e.target.value as FinalStatus)}
                    className="text-[10px] font-bold text-slate-500 px-1.5 py-1 rounded-md border border-slate-200 cursor-pointer outline-none"
                  >
                    {FINAL_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <UserRound size={11} /> {assignee || '—'}
                    <Calendar size={11} className="ml-1" /> {date ? new Date(date).toLocaleDateString('en-GB') : '—'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0 self-start"
                  title="Remove this request"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Tab "Note": ghi chú thông tin về ứng viên, có thể tạo nhiều ghi chú theo thời gian
const NoteTabContent: React.FC<{
  notes: CandidateNote[];
  onAdd: (content: string) => void;
  onRemove: (id: string) => void;
}> = ({ notes, onAdd, onRemove }) => {
  const [draftNote, setDraftNote] = useState('');

  const submit = () => {
    if (!draftNote.trim()) return;
    onAdd(draftNote);
    setDraftNote('');
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="space-y-2">
        <textarea
          value={draftNote}
          onChange={(e) => setDraftNote(e.target.value)}
          placeholder="Write a note about this candidate..."
          rows={3}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0fa57c] resize-none"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={submit}
            disabled={!draftNote.trim()}
            className="px-3.5 py-2 bg-[#0fa57c] text-white rounded-xl text-xs font-bold hover:bg-[#0c8a68] transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={13} /> Add note
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-300">No notes yet.</div>
      ) : (
        <div className="space-y-3">
          {notes.map((n) => (
            <div key={n.id} className="flex items-start gap-3 p-3.5 bg-white border border-slate-100 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[#0fa57c]/10 text-[#0fa57c] flex items-center justify-center shrink-0 text-xs font-black uppercase">
                {n.author.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">{n.author}</span>
                  <span className="text-[10px] text-slate-400">{new Date(n.createdAt).toLocaleString('en-GB')}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap break-words">{n.content}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(n.id)}
                className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                title="Delete note"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Tab "History": lịch sử các lần tạo/chỉnh sửa thông tin ứng viên (mới nhất lên đầu)
const HistoryTabContent: React.FC<{ logs: ChangeLog[] }> = ({ logs }) => {
  if (logs.length === 0) {
    return <div className="py-10 text-center text-sm text-slate-300 max-w-2xl">No update history yet.</div>;
  }
  return (
    <div className="max-w-2xl space-y-3">
      {logs.map((log) => (
        <div key={log.id} className="p-3.5 bg-white border border-slate-100 rounded-xl">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide ${
                log.action === 'create' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}
            >
              {log.action === 'create' ? 'Created' : 'Updated'}
            </span>
            <span className="text-[11px] text-slate-400">
              {log.changedBy} · {log.timestamp}
            </span>
          </div>
          {log.changes.length > 0 && (
            <div className="mt-2.5 space-y-1.5">
              {log.changes.map((c: FieldChange, i: number) => (
                <div key={i} className="text-xs text-slate-600">
                  <span className="font-bold text-slate-700">{c.field}: </span>
                  <span className="text-rose-400 line-through">{c.oldValue || '—'}</span>
                  <span className="mx-1 text-slate-300">→</span>
                  <span className="text-emerald-600 font-medium">{c.newValue || '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const CandidateDetailV2Page: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [selectedId, setSelectedId] = useState<string | null>(candidates[0]?.id ?? null);
  const [activeTab, setActiveTab] = useState<TabKey>('details');
  const [editing, setEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const candidate = candidates.find((c) => c.id === selectedId) || null;
  const [draft, setDraft] = useState<Candidate | null>(candidate);
  // Ghi chú theo từng ứng viên (key = candidate id)
  const [notesByCandidate, setNotesByCandidate] = useState<Record<string, CandidateNote[]>>({});
  // Lịch sử tạo/chỉnh sửa thông tin theo từng ứng viên (key = candidate id)
  const [logsByCandidate, setLogsByCandidate] = useState<Record<string, ChangeLog[]>>({});

  const pushLog = (candidateId: string, action: 'create' | 'update', changes: FieldChange[]) => {
    const entry: ChangeLog = {
      id: `LOG-${Date.now()}`,
      candidateId,
      action,
      changedBy: CURRENT_USER,
      timestamp: new Date().toLocaleString('en-GB', { hour12: false }),
      changes,
    };
    setLogsByCandidate((prev) => ({ ...prev, [candidateId]: [entry, ...(prev[candidateId] || [])] }));
  };
  const diffCandidate = (before: Candidate, after: Candidate): FieldChange[] => {
    const changes: FieldChange[] = [];
    V2_EDITABLE_FIELDS.forEach((k) => {
      const oldV = String(before[k] ?? '');
      const newV = String(after[k] ?? '');
      if (oldV !== newV) changes.push({ field: V2_FIELD_LABELS[k] ?? k, oldValue: oldV, newValue: newV });
    });
    return changes;
  };

  // Reset bản nháp + tab + trạng thái sửa mỗi khi đổi ứng viên
  useEffect(() => {
    if (isCreating) return;
    setDraft(candidate);
    setEditing(false);
    setActiveTab('details');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Mở màn tạo ứng viên mới — dùng luôn màn xem/sửa hiện tại, chỉ đổi sang chế độ nhập liệu rỗng
  const startCreate = () => {
    setIsCreating(true);
    setEditing(true);
    setDraft(emptyForm());
    setActiveTab('details');
  };

  if ((!candidate && !isCreating) || !draft) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-400">No candidates found.</p>
      </div>
    );
  }

  const view = editing ? draft : (candidate as Candidate);

  const handleSave = () => {
    if (isCreating) {
      const newId = `ƯV-${String(candidates.length + 1).padStart(4, '0')}`;
      const created = { ...draft, id: newId };
      setCandidates((prev) => [created, ...prev]);
      pushLog(newId, 'create', []);
      setSelectedId(newId);
      setIsCreating(false);
      setEditing(false);
      return;
    }
    const changes = candidate ? diffCandidate(candidate, draft) : [];
    setCandidates((prev) => prev.map((c) => (c.id === draft.id ? draft : c)));
    if (changes.length > 0) pushLog(draft.id, 'update', changes);
    setEditing(false);
  };
  const handleCancel = () => {
    if (isCreating) {
      setIsCreating(false);
      setEditing(false);
      setDraft(candidate);
      return;
    }
    setDraft(candidate);
    setEditing(false);
  };

  // Cập nhật danh sách Yêu cầu tuyển dụng của ứng viên đang xem — lưu ngay lập tức (không cần bấm Lưu),
  // đồng thời đồng bộ vào bản nháp (draft) để không bị ghi đè mất nếu đang sửa dở phần Details.
  const mutateApplications = (fn: (apps: CandidateApplication[]) => CandidateApplication[]) => {
    if (!candidate) return;
    setCandidates((prev) => prev.map((c) => (c.id === candidate.id ? { ...c, applications: fn(c.applications) } : c)));
    setDraft((prev) => (prev && prev.id === candidate.id ? { ...prev, applications: fn(prev.applications) } : prev));
  };
  const addApplicationToCandidate = (requestId: string) => {
    mutateApplications((apps) => [...apps, { requestId, finalStatus: 'New' }]);
    if (candidate) pushLog(candidate.id, 'update', [{ field: 'Recruitment Request', oldValue: '—', newValue: requestId }]);
  };
  const removeApplicationFromCandidate = (idx: number) => {
    const removed = candidate?.applications[idx];
    mutateApplications((apps) => apps.filter((_, i) => i !== idx));
    if (candidate && removed) pushLog(candidate.id, 'update', [{ field: 'Recruitment Request', oldValue: removed.requestId, newValue: '—' }]);
  };
  const changeApplicationStatusV2 = (idx: number, status: FinalStatus) => {
    const old = candidate?.applications[idx];
    mutateApplications((apps) => apps.map((a, i) => (i === idx ? { ...a, finalStatus: status } : a)));
    if (candidate && old) pushLog(candidate.id, 'update', [{ field: `FinalStatus (${old.requestId})`, oldValue: old.finalStatus, newValue: status }]);
  };

  // Ghi chú thông tin về ứng viên đang xem - thêm/xoá ngay lập tức, không cần bấm Lưu
  const candidateNotes = candidate ? notesByCandidate[candidate.id] || [] : [];
  const addNote = (content: string) => {
    if (!candidate) return;
    const newNote: CandidateNote = {
      id: `NOTE-${Date.now()}`,
      content: content.trim(),
      author: CURRENT_USER,
      createdAt: new Date().toISOString(),
    };
    setNotesByCandidate((prev) => ({ ...prev, [candidate.id]: [newNote, ...(prev[candidate.id] || [])] }));
  };
  const removeNote = (id: string) => {
    if (!candidate) return;
    setNotesByCandidate((prev) => ({ ...prev, [candidate.id]: (prev[candidate.id] || []).filter((n) => n.id !== id) }));
  };

  return (
    <div className="bg-transparent min-h-full p-4 sm:p-6">
      <div className="w-full space-y-4">
        {/* Thanh tiêu đề + nút tạo mới */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-600 uppercase tracking-wide">Candidate Details</h2>
          {!isCreating && (
            <button
              type="button"
              onClick={startCreate}
              className="px-3.5 py-2 bg-[#0fa57c] text-white rounded-xl text-xs font-bold hover:bg-[#0c8a68] transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
            >
              <Plus size={14} /> Add candidate
            </button>
          )}
        </div>

        {/* Card chi tiết ứng viên */}
        <div
          className={`bg-white rounded-2xl border shadow-xs overflow-hidden transition-colors ${
            editing ? 'border-[#0fa57c]/40 ring-2 ring-[#0fa57c]/10' : 'border-slate-100'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 p-5 sm:p-6 pb-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <User size={28} className="text-slate-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {editing ? (
                    <input
                      value={draft.name}
                      onChange={(e) => setDraft((p) => (p ? { ...p, name: e.target.value } : p))}
                      placeholder="Candidate name"
                      className="text-lg font-black text-slate-900 border-b-2 border-[#0fa57c]/40 focus:border-[#0fa57c] outline-none bg-transparent"
                    />
                  ) : (
                    <h3 className="text-lg font-black text-slate-900 truncate">{view.name || 'No name'}</h3>
                  )}
                  {!editing && (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="text-slate-300 hover:text-[#0fa57c] transition-colors"
                      title="Quick edit"
                    >
                      <Edit3 size={15} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isCreating ? (
                    <span className="text-xs font-mono font-bold text-slate-300">ID auto-generated on save</span>
                  ) : (
                    <>
                      <span className="text-xs font-mono font-bold text-slate-400">{candidate?.id}</span>
                      <CopyButton value={candidate?.id ?? ''} />
                    </>
                  )}
                </div>
              </div>
            </div>
            {editing && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-[#0fa57c] hover:bg-[#0c8a68] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Check size={13} /> {isCreating ? 'Create' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

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
                    <FieldBox
                      value={view.phone}
                      editing={editing}
                      placeholder="09xx xxx xxx"
                      onChange={(v) => setDraft((p) => (p ? { ...p, phone: v } : p))}
                      display={
                        view.phone ? (
                          <span className="flex items-center gap-2 w-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0fa57c] shrink-0" />
                            <span className="flex-1 truncate">{view.phone}</span>
                            <CopyButton value={view.phone} />
                          </span>
                        ) : undefined
                      }
                    />
                  </CollapsibleField>

                  <CollapsibleField label="Email">
                    <FieldBox
                      value={view.email}
                      editing={editing}
                      placeholder="email@example.com"
                      onChange={(v) => setDraft((p) => (p ? { ...p, email: v } : p))}
                      display={
                        view.email ? (
                          <span className="flex items-center gap-2 w-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0fa57c] shrink-0" />
                            <span className="flex-1 truncate">{view.email}</span>
                            <CopyButton value={view.email} />
                          </span>
                        ) : undefined
                      }
                    />
                  </CollapsibleField>

                  <CollapsibleField label="Info">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      <FieldBox label="Date of Birth" value={formatDateEN(view.dob)} />
                      <FieldBox label="Nationality" value="Vietnam" />
                      <FieldBox label="Job Rank" value={view.appliedLevel} />
                      <FieldBox label="Talent search" value={view.taPic} />
                      <FieldBox label="Desired work location" value={view.appliedBlock} />
                      <FieldBox label="Rec channel" value={view.source} />
                    </div>
                  </CollapsibleField>

                  <CollapsibleField label="Ims and Websites" defaultOpen={false}>
                    <FieldBox
                      value={view.linkedin}
                      editing={editing}
                      placeholder="linkedin.com/in/..."
                      onChange={(v) => setDraft((p) => (p ? { ...p, linkedin: v } : p))}
                      display={
                        view.linkedin ? (
                          <a
                            href={view.linkedin.startsWith('http') ? view.linkedin : `https://${view.linkedin}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 w-full text-[#0fa57c] hover:underline break-all"
                          >
                            <Globe size={14} className="shrink-0" />
                            <span className="truncate">{view.linkedin}</span>
                          </a>
                        ) : undefined
                      }
                    />
                  </CollapsibleField>
                </div>

                {/* Cột 2: học vấn & kinh nghiệm */}
                <div className="xl:border-l xl:border-slate-100 xl:pl-10">
                  <CollapsibleField label="Education & Experience">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      <FieldBox
                        label="University"
                        required
                        editing={editing}
                        value={view.university}
                        onChange={(v) => setDraft((p) => (p ? { ...p, university: v } : p))}
                      />
                      <FieldBox
                        label="Major"
                        required
                        editing={editing}
                        value={view.major}
                        onChange={(v) => setDraft((p) => (p ? { ...p, major: v } : p))}
                      />
                      <FieldBox
                        label="Current Position"
                        required
                        editing={editing}
                        value={view.currentPosition}
                        onChange={(v) => setDraft((p) => (p ? { ...p, currentPosition: v } : p))}
                      />
                      <FieldBox
                        label="Current Company"
                        required
                        editing={editing}
                        value={view.currentCompany}
                        onChange={(v) => setDraft((p) => (p ? { ...p, currentCompany: v } : p))}
                      />
                      <FieldBox
                        label="Tech Stack"
                        required
                        full
                        multiline
                        editing={editing}
                        value={view.techStack}
                        onChange={(v) => setDraft((p) => (p ? { ...p, techStack: v } : p))}
                      />
                    </div>
                  </CollapsibleField>
                </div>
              </div>
            ) : activeTab === 'request' ? (
              isCreating || !candidate ? (
                <div className="py-10 text-center text-sm text-slate-300">
                  Please save the candidate before assigning a recruitment request.
                </div>
              ) : (
                <RequestTabContent
                  applications={candidate.applications}
                  assignee={candidate.taPic}
                  date={candidate.assignDate || candidate.inputDate}
                  onAdd={addApplicationToCandidate}
                  onRemove={removeApplicationFromCandidate}
                  onChangeStatus={changeApplicationStatusV2}
                />
              )
            ) : activeTab === 'note' ? (
              isCreating || !candidate ? (
                <div className="py-10 text-center text-sm text-slate-300">
                  Please save the candidate before adding notes.
                </div>
              ) : (
                <NoteTabContent notes={candidateNotes} onAdd={addNote} onRemove={removeNote} />
              )
            ) : activeTab === 'cv' ? (
              <div className="space-y-3 max-w-2xl">
                {view.cvFile && (
                  <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-rose-50 text-rose-500 rounded-lg shrink-0">
                        <FileText size={18} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 truncate">{view.cvFile}</span>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-[#0fa57c] hover:bg-emerald-50 rounded-lg transition-colors shrink-0" title="Download">
                      <Download size={16} />
                    </button>
                  </div>
                )}
                {view.cvLink && (
                  <a
                    href={view.cvLink.startsWith('http') ? view.cvLink : `https://${view.cvLink}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl hover:bg-emerald-50 transition-colors group/link"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 bg-[#0fa57c]/10 text-[#0fa57c] rounded-lg shrink-0">
                        <LinkIcon size={18} />
                      </div>
                      <span className="text-sm font-bold text-[#0fa57c] truncate">{view.cvLink}</span>
                    </div>
                    <ExternalLink size={16} className="text-[#0fa57c] shrink-0 opacity-70 group-hover/link:opacity-100" />
                  </a>
                )}
                {!view.cvFile && !view.cvLink && (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-300">
                    <Paperclip size={22} />
                    <p className="text-sm">No CV attached</p>
                  </div>
                )}
              </div>
            ) : activeTab === 'history' ? (
              isCreating || !candidate ? (
                <div className="py-10 text-center text-sm text-slate-300">This candidate has no history yet.</div>
              ) : (
                <HistoryTabContent logs={logsByCandidate[candidate.id] || []} />
              )
            ) : (
              <div className="py-10 text-center text-sm text-slate-300">
                The "{TABS.find((t) => t.key === activeTab)?.label}" tab is under development.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
