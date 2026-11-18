/** Thành phần giao diện onsite dùng chung: badge, modal xác nhận / từ chối / lịch sử, form đơn (OnsiteCRUComponent). */
import React, { useState } from 'react';
import { AlertTriangle, Ban, Check, Lock, Paperclip, Plus, Send, Trash2, UserCircle2, X } from 'lucide-react';
import {
  ELIGIBLE_CONTRACTS, EMPLOYEES, HODS, closingIdOf, closingName, creatableProjects, OnsiteRec, PROJECTS, RoleKey, SiteZone, Slot, USERS, ZONE_LABEL,
  calcHours, dow, emp, endDate, fmtD, fmtDT, money, proj, rateOf, recRate, startDate, toMin,
} from '../../onsite/onsiteData';
import { useOnsite } from '../../onsite/OnsiteContext';

const full = (d: string, s = '08:00', e = '17:30'): Slot => ({ date: d, start: s, end: e, ...calcHours(s, e) });

/** "OC-2026-10" → "T10/2026" */
export const closingLabel = (id: string) => `T${id.slice(8, 10)}/${id.slice(3, 7)}`;
/** Câu mức hưởng từ kết quả rateOf. */
export const rateText = (x: { rate: number; why?: string }) =>
  x.rate > 0 ? `Mức hỗ trợ: ${money(x.rate)} đ / ngày công${x.why ? ` (${x.why})` : ''}` : `Không hưởng phụ cấp — ${x.why}`;
const eligible = (eid: string) => ELIGIBLE_CONTRACTS.includes(emp(eid).contract);

export const BADGE: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-600 border-gray-300', Requested: 'bg-amber-50 text-amber-700 border-amber-300',
  Approved: 'bg-green-50 text-green-700 border-green-300', Rejected: 'bg-red-50 text-red-700 border-red-300',
};
export const Badge: React.FC<{ v?: string | null; sub?: string }> = ({ v, sub }) =>
  !v ? <span className="text-gray-300">—</span> : (
    <span className="inline-flex flex-col">
      <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold w-fit ${BADGE[v] || ''}`}>{v}</span>
      {sub && <span className="text-[9px] text-gray-500 mt-0.5">{sub}</span>}
    </span>
  );

export const RoleSwitcher: React.FC<{ role: RoleKey; onChange: (r: RoleKey) => void; note?: string }> = ({ role, onChange, note }) => (
  <div className="flex items-center gap-2 text-xs bg-indigo-50 border border-indigo-200 rounded px-3 py-1.5">
    <UserCircle2 size={14} className="text-indigo-600" />
    <span className="text-indigo-700 font-semibold">Xem với vai trò:</span>
    <select className="border border-indigo-200 rounded px-1 py-0.5 bg-white" value={role} onChange={(e) => onChange(e.target.value as RoleKey)}>
      {(Object.keys(USERS) as RoleKey[]).map((k) => <option key={k} value={k}>{USERS[k].label} — {USERS[k].name}</option>)}
    </select>
    {note && <span className="text-[10px] text-indigo-500">{note}</span>}
  </div>
);

export const Toast: React.FC<{ toast: { text: string; err?: boolean } | null }> = ({ toast }) =>
  toast ? <div className={`fixed bottom-6 right-6 z-[100] max-w-md px-4 py-3 rounded shadow-lg text-sm text-white whitespace-pre-line ${toast.err ? 'bg-red-600' : 'bg-green-600'}`}>{toast.text}</div> : null;

export const IconBtn: React.FC<{ t: string; c: string; onClick: () => void; children: React.ReactNode }> = ({ t, c, onClick, children }) => (
  <button title={t} onClick={onClick} className={`p-1 rounded hover:bg-gray-100 ${c}`}>{children}</button>
);

// ───────────────────────── Form tạo / sửa / xem ─────────────────────────
export interface FormData {
  base?: OnsiteRec; employeeIds: string[]; projectId: string; address: string; regType: 0 | 1 | 2; description: string; hodId: string; attachment?: string; slots: Slot[];
  /** Đề xuất Phụ lục 03 */
  zone: SiteZone;
}

export function weeksOfMonth(ym: string) {
  const [y, m] = ym.split('-').map(Number);
  const days: string[] = [];
  for (let d = 1; d <= new Date(y, m, 0).getDate(); d++) days.push(`${ym}-${String(d).padStart(2, '0')}`);
  const weeks: string[][] = [];
  days.forEach((d) => {
    const wd = new Date(d + 'T00:00').getDay();
    if (wd === 0 || wd === 6) return;
    if (!weeks.length || wd === 1) weeks.push([]);
    weeks[weeks.length - 1].push(d);
  });
  return weeks.filter((w) => w.length);
}

export const OnsiteFormModal: React.FC<{
  mode: 'create' | 'edit' | 'view'; rec?: OnsiteRec; role: RoleKey; me: { id: string; name: string };
  onClose: () => void; onSave: (d: FormData, submit: boolean) => void;
  canApprove: boolean; canReject: boolean; onApprove: () => void; onReject: () => void; onRequest?: () => void;
}> = ({ mode, rec, role, me, onClose, onSave, canApprove, canReject, onApprove, onReject, onRequest }) => {
  const [projectId, setProjectId] = useState(rec?.projectId || '');
  const [address, setAddress] = useState(rec?.address || '');
  const [zone, setZone] = useState<SiteZone | ''>(rec?.zone || '');
  const [regType, setRegType] = useState<0 | 1 | 2>(rec?.regType ?? 0);
  const [month, setMonth] = useState((rec ? startDate(rec) : '2026-11-01').slice(0, 7));
  const [week, setWeek] = useState(0);
  const [employeeIds, setEmployeeIds] = useState<string[]>(rec ? [rec.employeeId] : []);
  const [hodId, setHodId] = useState(rec?.hodId || '');
  const [warn, setWarn] = useState('');
  const [description, setDescription] = useState(rec?.description || '');
  const [attachment, setAttachment] = useState(rec?.attachment || '');
  const [slots, setSlots] = useState<Slot[]>(rec?.slots || []);
  const [errors, setErrors] = useState<string[]>([]);
  const view = mode === 'view';
  // Tháng của lịch đã chốt onsite ⇒ đơn tính bổ sung vào kỳ chốt đầu tiên diễn ra sau khi HOD duyệt (gần nhất: kỳ chưa hoàn tất kế tiếp)
  const { closings } = useOnsite();
  const isFinal = (yy: number, mm: number) => closings.some((c) => c.id === closingIdOf(yy, mm) && c.status === 'APPROVED');
  const closedMonth = (() => {
    const ym = [...slots].sort((a, b) => a.date.localeCompare(b.date))[0]?.date.slice(0, 7);
    if (!ym) return null;
    let yy = Number(ym.slice(0, 4)), mm = Number(ym.slice(5, 7));
    if (!isFinal(yy, mm)) return null;
    const own = closingName({ year: yy, month: mm });
    do { mm += 1; if (mm > 12) { mm = 1; yy += 1; } } while (isFinal(yy, mm));
    return { own, next: closingName({ year: yy, month: mm }) };
  })();
  const p = PROJECTS.find((x) => x.id === projectId);
  const total = slots.reduce((s, x) => s + x.hours, 0);
  // Gợi ý mức hưởng (Phụ lục 03): rateOf theo ngày onsite đầu tiên (chưa có lịch thì đầu tháng đang chọn)
  const rateDate = [...slots].map((s) => s.date).sort()[0] || `${month}-01`;
  const rateLines = zone ? employeeIds.map((eid) => ({ eid, text: rateText(rateOf({ ...(rec as OnsiteRec), employeeId: eid, zone }, rateDate)) })) : [];
  const sameRate = rateLines.length > 0 && rateLines.every((l) => l.text === rateLines[0].text);
  const ineligible = employeeIds.filter((eid) => !eligible(eid));
  const weeks = weeksOfMonth(month);
  const monthOptions = Array.from({ length: 13 }, (_, i) => { const d = new Date(2026, 10 + i - 6, 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; });
  // ĐỀ XUẤT quyền tạo: PM chỉ dự án mình làm PM, HOD dự án thuộc khối hoặc dự án mình làm PM, HR / Admin mọi dự án còn hoạt động (giữ mã của đơn đang sửa)
  const allowed = creatableProjects(role, me.id);
  const projectOptions = rec && !allowed.some((x) => x.id === rec.projectId) ? [...allowed, proj(rec.projectId)] : allowed;
  /** OnProjectChanged(resetEmployee: true): nạp PM, thành viên, HOD của khối dự án (chọn HOD đầu tiên, ô HOD bị khoá);
   *  danh sách nhân viên bị xoá — kể cả khi đang SỬA đơn. */
  const changeProject = (id: string) => {
    setProjectId(id);
    const np = PROJECTS.find((x) => x.id === id);
    setHodId(np ? HODS.find((h) => h.org === np.org)?.id || '' : '');
    setEmployeeIds([]);
  };

  const gen = (type: 0 | 1 | 2, ym: string, wk: number) => {
    if (type === 0) { setSlots([]); return; } // SetRegistrationType: đổi hình thức là xoá lịch, Theo ngày thì để trống
    const ws = weeksOfMonth(ym);
    const days = type === 1 ? ws[Math.min(wk, ws.length - 1)] || [] : ws.flat();
    setSlots(days.map((d) => full(d)));
  };
  const setRow = (i: number, patch: Partial<Slot>) => {
    const others = slots.filter((_, j) => j !== i);
    const n = { ...slots[i], ...patch };
    // OnDateRowChanged / OnStartTimeChanged / OnEndTimeChanged: nhận giá trị mới rồi cảnh báo (toastr.warning)
    if (patch.date && others.some((x) => x.date === patch.date)) setWarn('Ngày onsite bị trùng lặp trong danh sách.');
    else if (patch.date && others.length && others[0].date.slice(0, 7) !== patch.date.slice(0, 7)) setWarn('Lịch onsite không được thuộc hai tháng khác nhau.');
    else if ((patch.start || patch.end) && (!n.start || !n.end || toMin(n.end) <= toMin(n.start))) setWarn('Thời gian kết thúc phải lớn hơn thời gian bắt đầu.');
    else setWarn('');
    setSlots(slots.map((s, j) => (j === i ? { ...n, ...calcHours(n.start, n.end) } : s)));
  };
  /** AddScheduleRow: ngày kế sau dòng cuối (rỗng thì từ hôm nay), bỏ qua T7/CN, 08:00–17:30; không cho sang tháng khác. */
  const addDay = () => {
    const sorted = [...slots].sort((a, b) => a.date.localeCompare(b.date));
    const d = sorted.length ? new Date(sorted[sorted.length - 1].date + 'T00:00') : new Date();
    if (sorted.length) d.setDate(d.getDate() + 1);
    while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (sorted.length && ds.slice(0, 7) !== sorted[0].date.slice(0, 7)) { setWarn('Lịch onsite không được thuộc hai tháng khác nhau.'); return; }
    setWarn('');
    setSlots([...sorted, full(ds)]);
  };

  /** HandleValidSubmit: bắt buộc + lịch rỗng → giờ sai → TRÙNG NGÀY (mỗi ngày một dòng) → khác tháng; dừng ở lỗi đầu tiên. */
  const validate = () => {
    let e: string | null = null;
    // DataAnnotations: Địa điểm, HOD (ApprovalById), Nhân viên (ApprovalForId) bắt buộc — ProjectId không gắn [Required]; Địa bàn: đề xuất Phụ lục 03
    if (!address.trim() || !zone || !hodId || !employeeIds.length) e = 'Vui lòng kiểm tra lại các trường thông tin bắt buộc!';
    else if (!slots.length) e = 'Vui lòng thêm ít nhất một ngày đi onsite trong lịch trình.';
    else if (slots.some((s) => !s.start || !s.end || toMin(s.end) <= toMin(s.start))) e = 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu.';
    else if (new Set(slots.map((s) => s.date)).size < slots.length) e = 'Ngày onsite bị trùng lặp trong danh sách.';
    else if (new Set(slots.map((s) => s.date.slice(0, 7))).size > 1) e = 'Lịch onsite không được thuộc hai tháng khác nhau.';
    setErrors(e ? [e] : []);
    return !e;
  };
  const submit = (send: boolean) => {
    if (!validate()) return;
    onSave({ base: rec, employeeIds, projectId, address, zone: zone as SiteZone, regType, description, hodId, attachment: attachment || undefined, slots: [...slots].sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start)) }, send);
  };

  const title = mode === 'create' ? 'Tạo đơn đăng ký đi onsite' : mode === 'edit' ? 'Sửa đơn đăng ký đi onsite' : 'Chi tiết đơn đăng ký đi onsite';
  const lbl = 'block text-[11px] font-bold text-gray-600 mb-1';
  const inp = 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs outline-none focus:border-blue-400 disabled:bg-gray-100';

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded shadow-xl w-[90%] max-w-[1024px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="font-bold text-sm">{title}{rec && <span className="ml-2 text-blue-600 font-medium">{rec.code}</span>}</h3>
          <button onClick={onClose}><X size={18} className="text-gray-500" /></button>
        </div>

        <div className="overflow-y-auto px-5 py-4 text-xs">
          {view && rec ? (
            <>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                {[
                  ['Mã dự án', proj(rec.projectId).code], ['Tháng', String(Number(startDate(rec).slice(5, 7)))],
                  ['Tên dự án', proj(rec.projectId).name], ['Ngày bắt đầu', fmtD(startDate(rec))],
                  ['Quản lý dự án', proj(rec.projectId).pmName], ['Ngày kết thúc', fmtD(endDate(rec))],
                  ['Địa điểm làm việc', rec.address], ['HOD', HODS.find((h) => h.id === rec.hodId)?.name || ''],
                  ['Hình thức đăng ký', ['Theo ngày', 'Theo tuần', 'Theo tháng'][rec.regType]], ['Nhân viên đi onsite', `${emp(rec.employeeId).name} (HĐ ${emp(rec.employeeId).contract})`],
                  ['Địa bàn', ZONE_LABEL[rec.zone]],
                ].map(([k, v]) => <div key={k} className="flex"><span className="font-bold w-40 shrink-0">{k}</span><span className="w-3">:</span><span>{v}</span></div>)}
              </div>
              <div className="flex mt-1.5"><span className="font-bold w-40 shrink-0">Mức hưởng</span><span className="w-3">:</span>
                <span className={recRate(rec).rate > 0 ? 'text-emerald-700 font-semibold' : 'text-amber-700'}>{rateText(recRate(rec))}</span></div>
              <div className="flex mt-1.5"><span className="font-bold w-40 shrink-0">Mô tả công việc</span><span className="w-3">:</span><span>{rec.description}</span></div>
              {rec.closingId && (
                <div className="mt-3 p-2 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 flex items-center gap-1.5">
                  <Lock size={12} />Đã chốt onsite {closingLabel(rec.closingId)} ở Báo cáo Onsite — đơn bị khoá: không sửa / xoá / gửi yêu cầu / duyệt / từ chối (đề xuất).
                </div>
              )}
              {rec.attachment && <div className="flex mt-1.5"><span className="font-bold w-40 shrink-0">Tài liệu đính kèm</span><span className="w-3">:</span><span className="text-blue-600 flex items-center gap-1"><Paperclip size={12} />{rec.attachment}</span></div>}
              {(rec.status === 'REJECTED' || rec.hodStatus === 'REJECTED' || rec.hodStatus === 'REJECTED_PM') && (
                <div className="mt-3"><div className="text-[13px] text-slate-500 font-semibold">Lý do từ chối</div><div className="mt-1 p-2 bg-red-50 border border-red-200 rounded">{rec.note}</div></div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Mã dự án <span className="text-red-500">*</span></label>
                <select className={inp} value={projectId} onChange={(e) => changeProject(e.target.value)}>
                  <option value="">Chọn dự án</option>
                  {projectOptions.map((x) => <option key={x.id} value={x.id}>{x.code} – {x.name}{x.active ? '' : ' (Closed)'}</option>)}
                </select>
                <div className="text-[10px] text-gray-500 mt-1">{role === 'pm' ? 'PM chỉ chọn được dự án mình quản lý.' : role === 'hod' ? 'HOD chọn được dự án thuộc khối mình, hoặc dự án khối khác mà mình làm PM.' : 'HR / Admin chọn được mọi dự án còn hoạt động.'}</div>
              </div>
              <div>
                <label className={lbl}>Địa điểm làm việc <span className="text-red-500">*</span></label>
                <input className={inp} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Địa điểm làm việc" />
              </div>
              <div>
                <label className={lbl}>Địa bàn / khoảng cách từ trụ sở <span className="text-red-500">*</span></label>
                <select className={inp} value={zone} onChange={(e) => setZone(e.target.value as SiteZone | '')}>
                  <option value="">Chọn địa bàn</option>
                  {(Object.keys(ZONE_LABEL) as SiteZone[]).map((z) => <option key={z} value={z}>{ZONE_LABEL[z]}</option>)}
                </select>
              </div>
              <div className="text-[11px] self-end pb-2">
                {!zone ? <span className="text-gray-400 italic">Chọn địa bàn để xem mức hỗ trợ (Phụ lục 03).</span>
                  : !rateLines.length ? <span className="text-gray-500 italic">Chọn nhân viên để xem mức hỗ trợ.</span>
                  : sameRate ? <span className={rateLines[0].text.startsWith('Mức') ? 'text-emerald-700 font-semibold' : 'text-amber-700'}>{rateLines[0].text}</span>
                  : (
                    <ul className="space-y-0.5">
                      {rateLines.map((l) => <li key={l.eid} className={l.text.startsWith('Mức') ? 'text-emerald-700' : 'text-amber-700'}><b>{emp(l.eid).name}</b>: {l.text}</li>)}
                    </ul>
                  )}
              </div>

              <div className="col-span-2 border border-emerald-200 bg-emerald-50/40 rounded p-3">
                <div className="text-[11px] font-bold text-emerald-700 mb-2">HÌNH THỨC ĐĂNG KÝ</div>
                <div className="flex gap-1 mb-1">
                  {(['Theo ngày', 'Theo tuần', 'Theo tháng'] as const).map((t, i) => (
                    <button key={t} type="button" onClick={() => { setRegType(i as 0 | 1 | 2); gen(i as 0 | 1 | 2, month, week); }} className={`px-3 py-1 rounded border text-xs font-semibold ${regType === i ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-300'}`}>{t}</button>
                  ))}
                </div>
                <div className="text-[10px] text-gray-500 italic mb-2">Tự động tạo lịch làm việc từ thứ 2 tới thứ 6 của tuần/tháng được chọn.</div>
                {regType !== 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={lbl}>Chọn Tháng <span className="text-red-500">*</span></label>
                      <select className={inp} value={month} onChange={(e) => { setMonth(e.target.value); setWeek(0); gen(regType, e.target.value, 0); }}>
                        {monthOptions.map((m) => <option key={m} value={m}>Tháng {m.slice(5)} {m.slice(0, 4)}</option>)}
                      </select>
                    </div>
                    {regType === 1 && (
                      <div>
                        <label className={lbl}>Chọn Tuần <span className="text-red-500">*</span></label>
                        <select className={inp} value={week} onChange={(e) => { setWeek(Number(e.target.value)); gen(1, month, Number(e.target.value)); }}>
                          {weeks.map((w, i) => <option key={i} value={i}>Tuần {i + 1} ({fmtD(w[0])} – {fmtD(w[w.length - 1])})</option>)}
                        </select>
                        <div className="flex items-center gap-1 mt-2"><span className="text-gray-500 text-[10px] mr-1">CHỌN NHANH:</span>
                          {weeks.map((_, i) => <button key={i} type="button" onClick={() => { setWeek(i); gen(1, month, i); }} className={`px-2 py-0.5 rounded border text-[10px] ${week === i ? 'bg-emerald-600 text-white border-emerald-600' : 'border-emerald-300 text-emerald-700'}`}>Tuần {i + 1}</button>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className={lbl}>Nhân viên đi onsite <span className="text-red-500">*</span></label>
                {mode === 'create' ? (
                  <div className="border border-gray-300 rounded p-1.5 min-h-[32px] flex flex-wrap gap-1">
                    {(p ? p.members : []).map((id) => {
                      const on = employeeIds.includes(id);
                      const ok = eligible(id);
                      return (
                        <button key={id} type="button" title={ok ? undefined : `HĐ ${emp(id).contract} — không thuộc diện hỗ trợ Phụ lục 03`} onClick={() => setEmployeeIds(on ? employeeIds.filter((x) => x !== id) : [...employeeIds, id])}
                          className={`px-2 py-0.5 rounded-full border text-[10px] ${on ? (ok ? 'bg-blue-600 text-white border-blue-600' : 'bg-amber-500 text-white border-amber-500') : ok ? 'border-gray-300 text-gray-600' : 'border-amber-400 text-amber-700 bg-amber-50'}`}>
                          {!ok && '⚠ '}{emp(id).code} – {emp(id).name} · <span className="opacity-80">{emp(id).contract}</span>
                        </button>
                      );
                    })}
                    {!p && <span className="text-gray-400">Chọn dự án trước</span>}
                  </div>
                ) : <input className={inp} disabled value={employeeIds.length ? `${emp(employeeIds[0]).code} - ${emp(employeeIds[0]).name} · HĐ ${emp(employeeIds[0]).contract}` : ''} placeholder="Nhân viên đi onsite" />}
                {ineligible.length > 0 && (
                  <div className="mt-1 p-1.5 bg-amber-50 border border-amber-300 rounded text-[10px] text-amber-800">
                    ⚠ {ineligible.map((eid) => `${emp(eid).name} (HĐ ${emp(eid).contract})`).join(', ')}: chỉ HĐ thử việc / chính thức được hỗ trợ theo Phụ lục 03. Vẫn đăng ký được, nhưng đơn không được tính phụ cấp.
                  </div>
                )}
                {mode === 'edit' && !employeeIds.length && <div className="text-[10px] text-red-600 mt-1">Đổi dự án khi sửa làm mất nhân viên và ô này bị khoá ⇒ không lưu được (hành vi hiện tại của code).</div>}
                {mode === 'create' && <div className="text-[10px] text-gray-500 mt-1">Chọn nhiều người ⇒ hệ thống sinh <b>một đơn riêng cho mỗi người</b>. Nhân viên không tự tạo đơn — PM / HOD / HR / Admin tạo cho nhân viên.</div>}
              </div>
              <div>
                <label className={lbl}>Quản lý dự án</label>
                <input className={inp} disabled value={p?.pmName || ''} />
              </div>
              <div>
                <label className={lbl}>HOD <span className="text-red-500">*</span></label>
                <select className={inp} value={hodId} disabled>
                  <option value="">Người phê duyệt</option>
                  {HODS.map((h) => <option key={h.id} value={h.id}>{h.name} ({h.org})</option>)}
                </select>
                <div className="text-[10px] text-gray-500 mt-1">Tự lấy HOD của khối sở hữu dự án, không sửa được.</div>
              </div>
              <div>
                <label className={lbl}>Tài liệu đính kèm</label>
                <div className="flex gap-2">
                  <input className={inp} value={attachment} onChange={(e) => setAttachment(e.target.value)} placeholder="ten-file.pdf" />
                  <button type="button" onClick={() => setAttachment('ke-hoach-onsite.pdf')} className="px-2 border border-gray-300 rounded whitespace-nowrap flex items-center gap-1"><Paperclip size={12} />Chọn file</button>
                </div>
              </div>
              <div className="col-span-2">
                <label className={lbl}>Mô tả công việc</label>
                <textarea className={inp} rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
          )}

          {/* Lịch trình */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-bold text-emerald-700 text-[12px]">CHI TIẾT LỊCH TRÌNH ĐI ONSITE</h5>
              {!view && regType === 0 && <button type="button" onClick={addDay} className="px-2 py-1 border border-emerald-400 text-emerald-700 rounded flex items-center gap-1"><Plus size={12} />Thêm ngày</button>}
            </div>
            <table className="w-full border-collapse text-[11px]">
              <thead><tr className="bg-gray-50">
                {['STT', 'Ngày onsite', 'Giờ bắt đầu', 'Giờ kết thúc', 'Số giờ', 'Hệ số', ...(view ? [] : [''])].map((h, i) => <th key={i} className="border border-gray-200 px-2 py-1.5 text-left">{h}</th>)}
              </tr></thead>
              <tbody>
                {slots.length === 0 && <tr><td colSpan={7} className="text-center text-gray-400 py-3 border border-gray-200">Vui lòng thêm hoặc chọn lịch trình.</td></tr>}
                {slots.map((s, i) => {
                  const we = ['T7', 'CN'].includes(dow(s.date));
                  const dup = slots.some((x, j) => j !== i && x.date === s.date);
                  return (
                    <tr key={i} className={dup ? 'bg-red-50' : we ? 'bg-amber-50' : ''}>
                      <td className="border border-gray-200 px-2">{i + 1}</td>
                      <td className="border border-gray-200 px-2 py-1">
                        {view || regType !== 0 ? <span>{fmtD(s.date)} <span className="text-gray-400">({dow(s.date)})</span></span>
                          : <input type="date" className="border border-gray-300 rounded px-1" value={s.date} onChange={(e) => setRow(i, { date: e.target.value })} />}
                      </td>
                      <td className="border border-gray-200 px-2">{view ? s.start : <input type="time" className="border border-gray-300 rounded px-1" value={s.start} onChange={(e) => setRow(i, { start: e.target.value })} />}</td>
                      <td className="border border-gray-200 px-2">{view ? s.end : <input type="time" className="border border-gray-300 rounded px-1" value={s.end} onChange={(e) => setRow(i, { end: e.target.value })} />}</td>
                      <td className="border border-gray-200 px-2 font-bold">{s.hours.toFixed(1)} giờ</td>
                      <td className="border border-gray-200 px-2 font-bold">{s.coef.toFixed(2)}</td>
                      {!view && <td className="border border-gray-200 px-2 text-center"><button type="button" onClick={() => setSlots(slots.filter((_, j) => j !== i))}><Trash2 size={12} className="text-red-500" /></button></td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-gray-500">Số giờ = giờ kết thúc − giờ bắt đầu, trừ nghỉ trưa 12:00–13:30 · Hệ số = Số giờ / 8 (tối đa 1) · Mỗi ngày một dòng (dòng đỏ = trùng ngày). Dòng vàng = thứ 7 / chủ nhật (chỉ nhập tay được, lịch tự sinh bỏ qua). Phụ cấp (đề xuất): mỗi ngày sau khi trừ giờ phép đủ 8 giờ = 1 ngày công; chưa đủ 1 ngày công thì không tính tiền — HCNS chốt theo tháng ở Báo cáo Onsite.</span>
              <span className="text-xs">TỔNG SỐ GIỜ ONSITE: <b>{total.toFixed(1)} giờ</b></span>
            </div>
          </div>

          {!view && closedMonth && (
            <div className="mt-2 p-2 bg-sky-50 border border-sky-300 rounded text-[11px] text-sky-800">
              ⓘ Tháng <b>{closedMonth.own}</b> đã chốt onsite. Đơn này được tính <b>bổ sung vào kỳ chốt onsite đầu tiên sau khi HOD duyệt</b>:
              nếu HOD duyệt <b>trước</b> lúc HR chốt onsite tháng <b>{closedMonth.next}</b> thì trả cùng lương tháng {closedMonth.next};
              duyệt <b>sau</b> lúc đó thì chuyển tiếp sang kỳ chốt tháng kế tiếp. Hiện ở cột "Bổ sung tháng trước" của kỳ được tính.
            </div>
          )}
          {slots.some((x) => x.hours > 0 && x.hours < 8) && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-300 rounded text-[11px] text-amber-800">
              ⚠ Ngày {slots.filter((x) => x.hours > 0 && x.hours < 8).map((x) => `${fmtD(x.date).slice(0, 5)} (${x.hours}h)`).join(', ')} chưa đủ 1 ngày công ⇒ không được tính tiền phụ cấp onsite (vẫn ghi nhận đi onsite).
            </div>
          )}
          {warn && <div className="mt-3 p-2 bg-amber-50 border border-amber-300 rounded text-amber-800">⚠ {warn}</div>}
          {errors.length > 0 && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 space-y-0.5">{errors.map((e) => <div key={e}>• {e}</div>)}</div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-3 border-t text-xs">
          {view ? (
            <>
              <button onClick={onClose} className="px-4 py-1.5 border border-gray-300 rounded">Huỷ</button>
              {canApprove && <button onClick={onApprove} className="px-4 py-1.5 bg-[#1e9e54] text-white rounded flex items-center gap-1"><Check size={13} />Duyệt</button>}
              {canReject && <button onClick={onReject} className="px-4 py-1.5 bg-[#007bff] text-white rounded flex items-center gap-1"><Ban size={13} />Từ chối</button>}
              {rec && !rec.closingId && (rec.hodStatus === 'DRAFT' || rec.hodStatus === 'REJECTED' || rec.hodStatus === 'REJECTED_PM' || rec.status === 'REJECTED') && onRequest &&
                <button onClick={onRequest} className="px-4 py-1.5 bg-[#1e9e54] text-white rounded flex items-center gap-1"><Send size={13} />Gửi yêu cầu</button>}
            </>
          ) : (
            <>
              <button onClick={onClose} className="px-4 py-1.5 border border-gray-300 rounded">Huỷ</button>
              <button onClick={() => submit(true)} className="px-4 py-1.5 bg-[#1e9e54] text-white rounded flex items-center gap-1"><Send size={13} />Gửi yêu cầu</button>
              <button onClick={() => submit(false)} className="px-4 py-1.5 bg-[#007bff] text-white rounded">Lưu bản nháp</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ───────────────────────── Modal phụ ─────────────────────────
export const ConfirmModal: React.FC<{ text: string; onOk: () => void; onCancel: () => void }> = ({ text, onOk, onCancel }) => (
  <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center" onClick={onCancel}>
    <div className="bg-white rounded shadow-xl w-[460px] max-w-[92vw] p-5 text-sm" onClick={(e) => e.stopPropagation()}>
      <div className="flex gap-3 items-start"><AlertTriangle className="text-amber-500 shrink-0" size={20} /><p className="whitespace-pre-line">{text}</p></div>
      <div className="flex justify-end gap-2 mt-5 text-xs">
        <button onClick={onCancel} className="px-4 py-1.5 border border-gray-300 rounded">Huỷ</button>
        <button onClick={onOk} className="px-4 py-1.5 bg-[#007bff] text-white rounded">Đồng ý</button>
      </div>
    </div>
  </div>
);
export const RejectModal: React.FC<{ count: number; onOk: (note: string) => void; onCancel: () => void }> = ({ count, onOk, onCancel }) => {
  const [note, setNote] = useState('');
  return (
    <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center" onClick={onCancel}>
      <div className="bg-white rounded shadow-xl w-[440px] p-5 text-sm" onClick={(e) => e.stopPropagation()}>
        <h4 className="font-bold mb-2">{count > 1 ? `Bạn có chắc chắn muốn từ chối ${count} yêu cầu đã chọn?` : 'Từ chối bản ghi này?'}</h4>
        <label className="text-xs font-bold text-gray-600">Lý do từ chối <span className="text-red-500">*</span></label>
        <textarea className="w-full border border-gray-300 rounded p-2 text-xs mt-1" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="flex justify-end gap-2 mt-4 text-xs">
          <button onClick={onCancel} className="px-4 py-1.5 border border-gray-300 rounded">Huỷ</button>
          <button disabled={!note.trim()} onClick={() => onOk(note.trim())} className="px-4 py-1.5 bg-red-600 text-white rounded disabled:opacity-40">Từ chối</button>
        </div>
      </div>
    </div>
  );
};
export const HistoryModal: React.FC<{ rec: OnsiteRec; onClose: () => void }> = ({ rec, onClose }) => (
  <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center" onClick={onClose}>
    <div className="bg-white rounded shadow-xl w-[560px] max-h-[80vh] overflow-y-auto p-5 text-xs" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between mb-3"><h4 className="font-bold text-sm">Lịch sử thay đổi — {rec.code}</h4><button onClick={onClose}><X size={16} /></button></div>
      <ol className="border-l-2 border-gray-200 ml-2 space-y-3">
        {[...rec.history].reverse().map((h, i) => (
          <li key={i} className="ml-4 relative">
            <span className="absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500" />
            <div className="text-gray-500">{fmtDT(h.at)} · <b className="text-gray-700">{h.by}</b></div>
            <div><span className="font-semibold">{h.action}</span> — {h.detail}</div>
          </li>
        ))}
      </ol>
    </div>
  </div>
);
