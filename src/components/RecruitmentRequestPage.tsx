/**
 * Màn "Yêu cầu tuyển dụng" (IDRequest).
 * - Danh sách (bảng) + màn chi tiết/sửa là 1 MÀN RIÊNG (không dùng popup).
 *   Màn chi tiết dùng chung cho: xem, sửa, và tạo mới.
 * Dữ liệu lấy từ RecruitmentContext dùng chung (cùng nguồn với ô chọn IDRequest ở màn ứng viên).
 */
import React, { useMemo, useState } from 'react';
import {
  Briefcase, Plus, Pencil, Trash2, Check, X, Search, AlertCircle, Copy, ChevronLeft, Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCandidates } from '../candidates/CandidateContext';
import { DataTable, Breadcrumb, StatGrid, Column, StatItem } from './DataTable';
import {
  useRecruitment,
  RecruitmentRequestRow,
  RRPriority,
  RRStatus,
  RR_PRIORITIES,
  RR_STATUSES,
  RR_BLOCKS,
  RR_POSITIONS,
  RR_SKILLS,
  RR_LEVELS,
  RR_TA_MEMBERS,
  ENDING_STATUSES,
  computeDaysRunning,
  computeSla,
} from '../recruitment/RecruitmentContext';

const formatDate = (s: string) => (s ? new Date(s).toLocaleDateString('en-GB') : '—');

// ==========================================================================
// Badge màu theo Priority / Status / SLA
// ==========================================================================
const priorityStyle: Record<string, string> = {
  Critical: 'bg-rose-50 text-rose-600 border-rose-200',
  High: 'bg-orange-50 text-orange-600 border-orange-200',
  Medium: 'bg-amber-50 text-amber-600 border-amber-200',
  Low: 'bg-slate-100 text-slate-500 border-slate-200',
};
const statusStyle: Record<string, string> = {
  'Đang chờ phê duyệt': 'bg-sky-50 text-sky-600 border-sky-200',
  'Đang tuyển': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Đã tuyển _ Chờ nhận việc': 'bg-violet-50 text-violet-600 border-violet-200',
  'Đóng': 'bg-slate-100 text-slate-500 border-slate-200',
  'Tạm dừng': 'bg-amber-50 text-amber-600 border-amber-200',
  'Hủy': 'bg-rose-50 text-rose-500 border-rose-200',
};
const slaStyle: Record<string, string> = {
  New: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'Near Deadline': 'bg-amber-50 text-amber-600 border-amber-200',
  Overdue: 'bg-rose-50 text-rose-600 border-rose-200',
};

const Badge: React.FC<{ text: string; cls?: string }> = ({ text, cls }) =>
  text ? (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${cls || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
      {text}
    </span>
  ) : (
    <span className="text-slate-300">—</span>
  );

// ==========================================================================
// Field: hiển thị (xem) hoặc điều khiển nhập (sửa)
// ==========================================================================
const fieldClass = 'w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-[13px] outline-none focus:border-[#0fa57c]';

const DField: React.FC<{
  label: string;
  required?: boolean;
  editing: boolean;
  value?: React.ReactNode;   // giá trị hiển thị khi xem
  full?: boolean;
  children?: React.ReactNode; // điều khiển nhập khi sửa
}> = ({ label, required, editing, value, full, children }) => (
  <div className={full ? 'sm:col-span-2' : ''}>
    <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    {editing ? (
      children
    ) : (
      <div className="w-full min-h-[32px] px-2.5 py-1.5 bg-slate-50/70 border border-slate-200 rounded-md text-[13px] font-medium text-slate-800 flex items-center break-words">
        {value !== undefined && value !== '' && value !== null ? value : <span className="text-slate-300 font-normal">—</span>}
      </div>
    )}
  </div>
);

const SelectControl: React.FC<{
  value: string;
  options: readonly string[];
  placeholder?: string;
  onChange: (v: string) => void;
}> = ({ value, options, placeholder, onChange }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={`${fieldClass} cursor-pointer`}>
    <option value="">{placeholder || '-- Chọn --'}</option>
    {options.map((o) => (
      <option key={o} value={o}>{o}</option>
    ))}
  </select>
);

// ==========================================================================
// Trang chính
// ==========================================================================
const emptyRow = (): RecruitmentRequestRow => ({
  id: '', priority: '', requestId: '', status: '', block: '', position: '', skill: '',
  level: '', taPic: '', taSupport: '', dateReceived: '', endDate: '', note: '', headcount: '',
});

export const RecruitmentRequestPage: React.FC = () => {
  const { requests, addRequest, updateRequest, removeRequest } = useRecruitment();
  const { candidates, assignToRequest, unassignFromRequest } = useCandidates();

  // Gán ứng viên vào yêu cầu (trong màn chi tiết)
  const [showAssign, setShowAssign] = useState(false);
  const [assignSearch, setAssignSearch] = useState('');

  // Điều hướng list ↔ detail
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<RecruitmentRequestRow>(emptyRow());
  const [formError, setFormError] = useState('');

  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const flash = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text });
    window.setTimeout(() => setMsg(null), 2500);
  };

  const selected = requests.find((r) => r.id === selectedId) || null;
  const editing = isEditing || isCreating;
  const showDetail = isCreating || selected != null;
  const view = editing ? draft : selected || emptyRow();

  const patch = (p: Partial<RecruitmentRequestRow>) => setDraft((d) => ({ ...d, ...p }));

  const openDetail = (r: RecruitmentRequestRow) => {
    setSelectedId(r.id);
    setIsCreating(false);
    setIsEditing(false);
    setFormError('');
  };
  const startCreate = () => {
    setSelectedId(null);
    setDraft(emptyRow());
    setIsCreating(true);
    setIsEditing(false);
    setFormError('');
  };
  const startEdit = () => {
    if (!selected) return;
    setDraft({ ...selected });
    setIsEditing(true);
    setFormError('');
  };
  const cancel = () => {
    if (isCreating) {
      setIsCreating(false);
      setSelectedId(null);
    } else {
      setIsEditing(false);
    }
    setFormError('');
  };
  const backToList = () => {
    setSelectedId(null);
    setIsCreating(false);
    setIsEditing(false);
    setFormError('');
  };

  const validate = (d: RecruitmentRequestRow): string | null => {
    if (!d.priority) return 'Vui lòng chọn Priority';
    if (!d.status) return 'Vui lòng chọn Tình trạng y/c';
    if (!d.block) return 'Vui lòng chọn Khối';
    if (!d.position) return 'Vui lòng chọn Vị trí tuyển dụng';
    if (!d.skill) return 'Vui lòng chọn Skill';
    if (!d.level) return 'Vui lòng chọn Level';
    if (!d.taPic) return 'Vui lòng chọn TA PIC';
    if (!d.taSupport) return 'Vui lòng chọn TA Support';
    if (!d.dateReceived) return 'Vui lòng nhập Ngày nhận y/c';
    if (ENDING_STATUSES.includes(d.status as RRStatus) && !d.endDate)
      return 'Trạng thái kết thúc — vui lòng nhập ngày kết thúc';
    return null;
  };

  const save = () => {
    const err = validate(draft);
    if (err) {
      setFormError(err);
      return;
    }
    if (isCreating) {
      const rid = addRequest(draft);
      flash('success', `Đã thêm yêu cầu ${rid}`);
      backToList();
    } else {
      updateRequest(draft);
      flash('success', 'Đã cập nhật yêu cầu');
      setIsEditing(false);
    }
  };

  const remove = (r: RecruitmentRequestRow) => {
    if (window.confirm(`Xoá yêu cầu ${r.requestId}?`)) {
      removeRequest(r.id);
      flash('success', `Đã xoá ${r.requestId}`);
      if (selectedId === r.id) backToList();
    }
  };

  const days = computeDaysRunning(view);
  const sla = computeSla(days);
  const isEnding = ENDING_STATUSES.includes(view.status as RRStatus);

  // Ứng viên đã gán / còn có thể gán vào yêu cầu đang xem
  const assignedCandidates = candidates.filter((c) => c.applications.some((a) => a.requestId === view.requestId));
  const aq = assignSearch.trim().toLowerCase();
  const assignableCandidates = candidates
    .filter((c) => !c.applications.some((a) => a.requestId === view.requestId))
    .filter((c) => !aq || [c.name, c.email, c.phone, c.id].some((f) => String(f).toLowerCase().includes(aq)));
  const closeAssign = () => {
    setShowAssign(false);
    setAssignSearch('');
  };

  // Thông báo nổi (dùng chung list & detail)
  const Toast = (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`mb-4 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-2 border ${
            msg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}
        >
          {msg.type === 'success' ? <Check size={15} /> : <X size={15} />}
          {msg.text}
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ========================================================================
  // MÀN CHI TIẾT / SỬA / TẠO MỚI
  // ========================================================================
  if (showDetail) {
    return (
      <div className="p-6 h-full">
        {Toast}
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={backToList}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer"
              title="Quay lại danh sách"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="w-11 h-11 rounded-xl bg-[#0fa57c]/10 flex items-center justify-center">
              <Briefcase size={22} className="text-[#0fa57c]" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
                {isCreating ? 'Thêm yêu cầu tuyển dụng' : 'Chi tiết yêu cầu tuyển dụng'}
              </h1>
              <p className="text-xs text-slate-400 font-medium">Quản lý các yêu cầu tuyển dụng (IDRequest)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <div className="flex items-center gap-2">
              {editing ? (
                <>
                  <button type="button" onClick={cancel} className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                    Huỷ
                  </button>
                  <button type="button" onClick={save} className="px-4 py-2.5 text-xs font-bold text-white bg-[#0fa57c] hover:bg-[#0c8a68] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10">
                    <Check size={15} /> {isCreating ? 'Thêm' : 'Lưu thay đổi'}
                  </button>
                </>
              ) : (
                <>
                  {selected && (
                    <button type="button" onClick={() => remove(selected)} className="px-4 py-2.5 text-xs font-bold text-rose-500 border border-rose-200 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer">
                      <Trash2 size={15} /> Xoá
                    </button>
                  )}
                  <button type="button" onClick={startEdit} className="px-4 py-2.5 text-xs font-bold text-white bg-[#0fa57c] hover:bg-[#0c8a68] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10">
                    <Pencil size={15} /> Sửa
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-6 items-start ${!isCreating ? 'xl:grid-cols-[1.5fr_1fr]' : ''}`}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
              <DField label="Priority" required editing={editing} value={<Badge text={view.priority} cls={priorityStyle[view.priority]} />}>
                <SelectControl value={draft.priority} options={RR_PRIORITIES} onChange={(v) => patch({ priority: v as RRPriority })} />
              </DField>
              <DField label="Tình trạng y/c" required editing={editing} value={<Badge text={view.status} cls={statusStyle[view.status]} />}>
                <SelectControl value={draft.status} options={RR_STATUSES} onChange={(v) => patch({ status: v as RRStatus })} />
              </DField>
              <DField label="Khối" required editing={editing} value={view.block}>
                <SelectControl value={draft.block} options={RR_BLOCKS} onChange={(v) => patch({ block: v })} />
              </DField>
              <DField label="Vị trí tuyển dụng" required editing={editing} value={view.position}>
                <SelectControl value={draft.position} options={RR_POSITIONS} onChange={(v) => patch({ position: v })} />
              </DField>
              <DField label="Skill" required editing={editing} value={view.skill}>
                <SelectControl value={draft.skill} options={RR_SKILLS} onChange={(v) => patch({ skill: v })} />
              </DField>
              <DField label="Level" required editing={editing} value={view.level}>
                <SelectControl value={draft.level} options={RR_LEVELS} onChange={(v) => patch({ level: v })} />
              </DField>
              <DField label="TA PIC" required editing={editing} value={view.taPic}>
                <SelectControl value={draft.taPic} options={RR_TA_MEMBERS} onChange={(v) => patch({ taPic: v })} />
              </DField>
              <DField label="TA Support" required editing={editing} value={view.taSupport}>
                <SelectControl value={draft.taSupport} options={RR_TA_MEMBERS} onChange={(v) => patch({ taSupport: v })} />
              </DField>
              <DField label="Ngày nhận y/c" required editing={editing} value={formatDate(view.dateReceived)}>
                <input type="date" value={draft.dateReceived} onChange={(e) => patch({ dateReceived: e.target.value })} className={fieldClass} />
              </DField>
              {isEnding && (
                <DField label="Ngày kết thúc" required editing={editing} value={formatDate(view.endDate)}>
                  <input type="date" value={draft.endDate} onChange={(e) => patch({ endDate: e.target.value })} className={fieldClass} />
                </DField>
              )}
              <DField label="Số lượng ứng viên cần" editing={editing} value={view.headcount === '' ? '' : String(view.headcount)}>
                <input
                  type="number"
                  min={0}
                  value={draft.headcount}
                  onChange={(e) => patch({ headcount: e.target.value === '' ? '' : Number(e.target.value) })}
                  className={fieldClass}
                />
              </DField>
              <DField label="Note" full editing={editing} value={view.note}>
                <textarea value={draft.note} onChange={(e) => patch({ note: e.target.value })} rows={3} placeholder="Ghi chú thêm về yêu cầu..." className={`${fieldClass} resize-none`} />
              </DField>
            </div>

            {formError && (
              <div className="mt-4 text-[11px] font-bold px-3 py-2 rounded-lg bg-rose-50 text-rose-600 flex items-center gap-1.5">
                <AlertCircle size={13} /> {formError}
              </div>
            )}

            {/* Mã Request ID + Số ngày chạy job + SLA — dưới phần thông tin */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Request ID</span>
                <span className="font-mono text-xs font-bold text-slate-700">{isCreating ? '(tự sinh khi lưu)' : view.requestId}</span>
                {!isCreating && view.requestId && (
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(view.requestId)}
                    className="text-slate-400 hover:text-[#0fa57c]"
                    title="Sao chép"
                  >
                    <Copy size={12} />
                  </button>
                )}
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Ngày chạy job</span>
                <span className="text-xs font-bold text-slate-700">{days == null ? '—' : `${days} ngày`}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">SLA</span>
                <Badge text={sla} cls={slaStyle[sla]} />
              </div>
            </div>
          </div>
          </div>

          {/* ===== Ứng viên đã gán vào yêu cầu (cột song song) ===== */}
          {!isCreating && view.requestId && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#0fa57c]" />
                <h2 className="text-sm font-black text-slate-800">Ứng viên đã gán</h2>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400">{assignedCandidates.length}</span>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => (showAssign ? closeAssign() : setShowAssign(true))}
                  className="px-3.5 py-2 border border-[#0fa57c]/30 text-[#0fa57c] rounded-xl text-xs font-bold hover:bg-[#0fa57c]/5 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={13} /> Gán ứng viên
                </button>
                {showAssign && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={closeAssign} />
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                      <div className="p-2 border-b border-slate-100 bg-slate-50/60">
                        <div className="relative">
                          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            autoFocus
                            value={assignSearch}
                            onChange={(e) => setAssignSearch(e.target.value)}
                            placeholder="Tìm ứng viên theo tên, email..."
                            className="w-full pl-8 pr-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-[#0fa57c]"
                          />
                        </div>
                      </div>
                      <div className="p-2 max-h-64 overflow-y-auto">
                        {assignableCandidates.length === 0 ? (
                          <p className="text-xs text-slate-300 text-center py-3">Không có ứng viên phù hợp</p>
                        ) : (
                          assignableCandidates.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                assignToRequest(c.id, view.requestId);
                                closeAssign();
                                flash('success', `Đã gán ${c.name}`);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                              <p className="text-xs font-bold text-slate-700">{c.name}</p>
                              <p className="text-[10px] text-slate-400">{c.email || c.id}</p>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="p-3">
              {assignedCandidates.length === 0 ? (
                <p className="text-center text-sm text-slate-300 py-8">Chưa có ứng viên nào được gán.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {assignedCandidates.map((c) => {
                    const app = c.applications.find((a) => a.requestId === view.requestId);
                    return (
                      <li key={c.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50/70 rounded-lg group">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0fa57c] to-teal-400 text-white flex items-center justify-center font-bold text-[10px] uppercase shrink-0">
                          {c.name.split(' ').pop()?.slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-700 truncate">{c.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{c.email || '—'} · {c.phone || '—'}</p>
                        </div>
                        {app && <Badge text={app.finalStatus} />}
                        <button
                          type="button"
                          onClick={() => {
                            unassignFromRequest(c.id, view.requestId);
                            flash('success', `Đã bỏ gán ${c.name}`);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Bỏ gán"
                        >
                          <X size={15} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    );
  }

  // ========================================================================
  // MÀN DANH SÁCH
  // ========================================================================
  const slaOf = (r: RecruitmentRequestRow) => computeSla(computeDaysRunning(r));
  const stats: StatItem[] = [
    { label: 'Tổng yêu cầu', value: requests.length },
    { label: 'Đang tuyển', value: requests.filter((r) => r.status === 'Đang tuyển').length, tone: 'success' },
    { label: 'Đang chờ phê duyệt', value: requests.filter((r) => r.status === 'Đang chờ phê duyệt').length },
    { label: 'Đã tuyển', value: requests.filter((r) => r.status === 'Đã tuyển _ Chờ nhận việc').length, tone: 'success' },
    { label: 'Sắp đến hạn SLA', value: requests.filter((r) => slaOf(r) === 'Near Deadline').length, tone: 'warning' },
    { label: 'Quá hạn SLA', value: requests.filter((r) => slaOf(r) === 'Overdue').length, tone: 'danger' },
    { label: 'Tạm dừng', value: requests.filter((r) => r.status === 'Tạm dừng').length },
    { label: 'Tổng SL cần', value: requests.reduce((s, r) => s + (Number(r.headcount) || 0), 0) },
  ];

  const columns: Column<RecruitmentRequestRow>[] = [
    { key: 'priority', label: 'Priority', get: (r) => r.priority, render: (r) => <Badge text={r.priority} cls={priorityStyle[r.priority]} /> },
    { key: 'requestId', label: 'Request ID', get: (r) => r.requestId, render: (r) => <span className="font-mono font-bold text-slate-700 whitespace-nowrap group-hover:text-[#0fa57c] transition-colors">{r.requestId}</span> },
    { key: 'status', label: 'Tình trạng', get: (r) => r.status, render: (r) => <Badge text={r.status} cls={statusStyle[r.status]} /> },
    { key: 'block', label: 'Khối', get: (r) => r.block },
    { key: 'position', label: 'Vị trí tuyển dụng', get: (r) => r.position, render: (r) => <span className="font-semibold text-slate-700">{r.position || '—'}</span> },
    { key: 'skill', label: 'Skill', get: (r) => r.skill },
    { key: 'level', label: 'Level', get: (r) => r.level },
    { key: 'taPic', label: 'TA PIC', get: (r) => r.taPic },
    { key: 'dateReceived', label: 'Ngày nhận', get: (r) => formatDate(r.dateReceived) },
    { key: 'days', label: 'Ngày chạy', numeric: true, get: (r) => computeDaysRunning(r) ?? '', render: (r) => { const d = computeDaysRunning(r); return d == null ? <span className="text-slate-300">—</span> : d; } },
    { key: 'sla', label: 'SLA', get: (r) => slaOf(r), render: (r) => <Badge text={slaOf(r)} cls={slaStyle[slaOf(r)]} /> },
    { key: 'headcount', label: 'SL cần', numeric: true, total: true, get: (r) => (r.headcount === '' ? '' : r.headcount) },
  ];

  return (
    <div className="p-6 h-full">
      {Toast}
      <Breadcrumb items={['Home', 'Recruitment', 'Yêu cầu tuyển dụng']} />

      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0fa57c]/10 flex items-center justify-center">
            <Briefcase size={22} className="text-[#0fa57c]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">Yêu cầu tuyển dụng</h1>
            <p className="text-xs text-slate-400 font-medium">Quản lý các yêu cầu tuyển dụng (IDRequest)</p>
          </div>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="px-4 py-2.5 bg-[#0fa57c] text-white rounded-xl text-xs font-bold hover:bg-[#0fa57c]/90 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer active:scale-95"
        >
          <Plus size={15} /> Thêm yêu cầu
        </button>
      </div>

      <StatGrid items={stats} />

      <DataTable
        rows={requests}
        columns={columns}
        getRowKey={(r) => r.id}
        onRowClick={(r) => openDetail(r)}
        onView={(r) => openDetail(r)}
        searchPlaceholder="Tìm yêu cầu... (Enter)"
        exportFileName="yeu-cau-tuyen-dung"
        totalLabel={`Tổng: ${requests.length} yêu cầu`}
      />
    </div>
  );
};
