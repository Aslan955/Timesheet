/**
 * Quản lý Đơn từ › Đơn đăng ký đi onsite — đúng màn mà menu Timekeeping › Onsite mở ra (TotalRequests?group=1).
 * Dựng theo code thật iMIS:
 *  - Components/TotalRequests/TotalRequestsComponent.razor (thẻ nhóm, đếm "Y/c của tôi" / "Cần phê duyệt", phạm vi)
 *  - Components/TotalRequests/OnsiteRequestComponent.razor (lọc, grid, quyền từng nút, duyệt / từ chối hàng loạt)
 *  - TotalRequests/TotalRequestsService.cs (GetOnsiteBaseQuery / GetOnsiteScopeQuery / BuildOnsiteCounts)
 *  - Onsites/OnsiteService.cs (HodApproveInitial, HodRejectInitial, ApproveInitial, RequestInitial, RemoveAsync, trùng lịch)
 *  - Components/Onsites/OnsiteCRUComponent.razor (form, tính giờ trừ trưa, hệ số)
 * Màn /Onsite cũ (OnsiteListComponent: tab, khoá, phân công) vẫn còn route nhưng không có trên menu nên không dựng ở đây.
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Target, ChevronRight, Plus, Search, Filter, Eye, Pencil, Trash2, Check, Ban, Send, Lock, X, History, Info, AlertTriangle,
  Plane, Briefcase, CalendarCheck, Clock, HeartHandshake, Columns3, RotateCcw,
} from 'lucide-react';
import { canCreateOnsite, creatableProjects,
  EMPLOYEES, HCNS_MAIL, HODS, HOD_LABEL, LEAVES, OnsiteRec, PROJECTS, Slot, USERS, ZONE_SHORT, emp, endDate, fmtD, fmtDT, log, money, monthOf, nowIso, overlap, proj,
  recRate, startDate,
} from '../onsite/onsiteData';
import { useOnsite } from '../onsite/OnsiteContext';
import { Badge, ConfirmModal, FormData, HistoryModal, IconBtn, OnsiteFormModal, RejectModal, RoleSwitcher, Toast, closingLabel } from './onsite/OnsiteUi';

export type Scope = 'all' | 'mine' | 'pending';

/** Đếm "Y/c của tôi" / "Cần phê duyệt" cho thẻ Onsite (TotalRequestsService.BuildOnsiteCounts). */
export function onsiteRequestCounts(records: OnsiteRec[], role: keyof typeof USERS) {
  const me = USERS[role];
  const isHod = role === 'hod', isPmo = role === 'pmo', managerRole = role === 'hr' || role === 'pmo';
  const hodCovers = (r: OnsiteRec) => isHod && proj(r.projectId).org === 'Khối Delivery 1';
  const isPmOf = (r: OnsiteRec) => proj(r.projectId).pmId === me.id;
  const base = records.filter((r) => (r.hodStatus !== 'DRAFT' || r.creatorId === me.id) && (r.creatorId === me.id || hodCovers(r) || isPmOf(r) || isPmo || managerRole));
  const pending = base.filter((r) => {
    const waitPmo = r.hodStatus === 'APPROVED' && r.status !== 'APPROVED';
    const rejected = r.hodStatus === 'REJECTED' || r.status === 'REJECTED';
    return (isPmOf(r) && (r.hodStatus === 'REQUESTED' || r.hodStatus === 'APPROVED_PM' || waitPmo || r.hodStatus === 'REJECTED_PM' || rejected))
      || (hodCovers(r) && (r.hodStatus === 'APPROVED_PM' || waitPmo || rejected))
      || ((managerRole || isPmo) && (r.hodStatus === 'REQUESTED' || r.hodStatus === 'APPROVED_PM' || waitPmo));
  });
  return { my: base.filter((r) => r.creatorId === me.id).length, pending: pending.length, canCreate: canCreateOnsite(role) };
}

export const OnsitePage: React.FC = () => <OnsiteRequestPanel />;

/** embedded = nhúng vào màn Request Management của prototype (bỏ breadcrumb + hàng thẻ, scope / tạo mới điều khiển từ ngoài). */
export const OnsiteRequestPanel: React.FC<{ embedded?: boolean; initialScope?: Scope; createTick?: number; onClose?: () => void }> = ({ embedded, initialScope = 'all', createTick = 0, onClose }) => {
  const { records, setRecords, periods, role, setRole } = useOnsite();
  const [scope, setScope] = useState<Scope>(initialScope);
  const [open, setOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [fProject, setFProject] = useState('');
  const [fFrom, setFFrom] = useState('');
  const [fTo, setFTo] = useState('');
  const [applied, setApplied] = useState({ project: '', from: '', to: '' });
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState<{ mode: 'create' | 'edit' | 'view'; rec?: OnsiteRec } | null>(null);
  const [confirm, setConfirm] = useState<{ text: string; onOk: () => void } | null>(null);
  const [reject, setReject] = useState<{ ids: string[]; skipped?: number } | null>(null);
  const [historyOf, setHistoryOf] = useState<OnsiteRec | null>(null);
  const [toast, setToast] = useState<{ text: string; err?: boolean } | null>(null);
  const showToast = (text: string, err = false) => { setToast({ text, err }); setTimeout(() => setToast(null), 5000); };
  useEffect(() => { setScope(initialScope); }, [initialScope]);
  useEffect(() => { if (createTick > 0) setForm({ mode: 'create' }); }, [createTick]);

  const me = USERS[role];
  const isAdmin = role === 'admin', isHr = role === 'hr', isPmo = role === 'pmo', isHod = role === 'hod';
  const isRegular = role === 'emp';
  // Quyền permission: Onsite.Approve (PM/HOD/PMO/HR/Admin), Onsite.PmoApprove (PMO; Admin luôn qua)
  const hasHodApprove = !isRegular;
  const hasPmoApprove = isPmo || isAdmin;
  const isHrOrAdmin = isHr || isAdmin;
  // ĐỀ XUẤT: chỉ PM dự án / HOD / HR / Admin được tạo (code: mọi vai trò không phải nhân viên thường, gồm cả PMO)
  const canCreate = canCreateOnsite(role);
  const hasEdit = !isRegular;
  // GetOnsiteContext: HasApprove = vai trò IT / HR / PMO (Admin KHÔNG nằm trong danh sách này)
  const managerRole = isHr || isPmo;

  const hodCovers = (r: OnsiteRec) => isHod && proj(r.projectId).org === 'Khối Delivery 1';
  const isPmOf = (r: OnsiteRec) => proj(r.projectId).pmId === me.id;
  /** ĐỀ XUẤT: đơn đã chốt ở Báo cáo Onsite (có closingId) bị khoá — chỉ còn Xem + Lịch sử. */
  const closed = (r: OnsiteRec) => !!r.closingId;
  const blockReason = (r: OnsiteRec) => (r.isLocked ? 'Bản ghi đã khoá, không thể thay đổi.'
    : r.closingId ? `Đơn đã chốt onsite ${closingLabel(r.closingId)} ở Báo cáo Onsite, không thể thay đổi.` : null);

  // ── GetOnsiteBaseQuery: nháp chỉ người tạo thấy; còn lại: người tạo, HOD trong khối, PM dự án, PMO, IT/HR/PMO ──
  const base = useMemo(() => records.filter((r) => (r.hodStatus !== 'DRAFT' || r.creatorId === me.id)
    && (r.creatorId === me.id || hodCovers(r) || isPmOf(r) || isPmo || managerRole)), [records, role]);
  // ── GetOnsiteScopeQuery(PendingApproval) / BuildOnsiteCounts ──
  const isPending = (r: OnsiteRec) => {
    const waitPmo = r.hodStatus === 'APPROVED' && r.status !== 'APPROVED';
    const rejected = r.hodStatus === 'REJECTED' || r.status === 'REJECTED';
    return (isPmOf(r) && (r.hodStatus === 'REQUESTED' || r.hodStatus === 'APPROVED_PM' || waitPmo || r.hodStatus === 'REJECTED_PM' || rejected))
      || (hodCovers(r) && (r.hodStatus === 'APPROVED_PM' || waitPmo || rejected))
      || ((managerRole || isPmo) && (r.hodStatus === 'REQUESTED' || r.hodStatus === 'APPROVED_PM' || waitPmo));
  };
  const myCount = base.filter((r) => r.creatorId === me.id).length;
  const pendingCount = base.filter(isPending).length;

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return base
      .filter((r) => scope === 'all' || (scope === 'mine' ? r.creatorId === me.id : isPending(r)))
      .filter((r) => !applied.project || r.projectId === applied.project)
      .filter((r) => !applied.from || endDate(r) >= applied.from)
      .filter((r) => !applied.to || startDate(r) <= applied.to)
      .filter((r) => !q || [r.code, proj(r.projectId).code, proj(r.projectId).name, emp(r.employeeId).name, emp(r.employeeId).code, r.createdBy].some((x) => x.toLowerCase().includes(q)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [base, scope, applied, search, role]);

  // ── Quyền từng nút (OnsiteRequestComponent) ──
  const ownerBranch = (r: OnsiteRec) => (r.creatorId === me.id || isPmOf(r)) && hasEdit && r.status !== 'APPROVED';
  const canRequest = (r: OnsiteRec) => !closed(r) && (r.hodStatus === 'DRAFT' || r.hodStatus === 'REJECTED' || r.hodStatus === 'REJECTED_PM' || r.status === 'REJECTED');
  const canApprove = (r: OnsiteRec) => {
    if (r.isLocked || closed(r)) return false;
    if (isAdmin || isHr || isPmo) return r.hodStatus === 'REQUESTED' || r.hodStatus === 'APPROVED_PM';
    if (isPmOf(r) && r.hodStatus === 'REQUESTED') return true;
    return hodCovers(r) && r.hodStatus === 'APPROVED_PM';
  };
  const canReject = (r: OnsiteRec) => {
    if (r.isLocked || closed(r)) return false;
    if (r.hodStatus === 'APPROVED') return hodCovers(r) || isAdmin || isHr || isPmo;
    if (isAdmin || isHr || isPmo) return r.hodStatus === 'REQUESTED' || r.hodStatus === 'APPROVED_PM';
    if (isPmOf(r) && r.hodStatus === 'REQUESTED') return true;
    return hodCovers(r) && r.hodStatus === 'APPROVED_PM';
  };
  /** OnsiteCRUComponent.CanApprove (nút Duyệt trong popup Xem): không phân biệt người tạo, Admin/HR/PMO thấy cả đơn
   *  HodStatus = Approved mà Status rỗng — bấm sẽ bị service từ chối "not requested/pending initial". */
  const canApprovePopup = (r: OnsiteRec) => canApprove(r) || (!r.isLocked && !closed(r) && (isAdmin || isHr || isPmo) && r.hodStatus === 'APPROVED' && r.status === null);
  const isPmoOrAdminHrApprove = (r: OnsiteRec) => !closed(r) && ((hasPmoApprove && r.hodStatus === 'APPROVED' && r.status === null) || (isHrOrAdmin && r.hodStatus === 'APPROVED'));

  // ── Thao tác (OnsiteService) ──
  const update = (id: string, fn: (r: OnsiteRec) => OnsiteRec) => setRecords((rs) => rs.map((r) => (r.id === id ? fn(r) : r)));
  const hodName = (hodId: string, projectId: string) => HODS.find((h) => h.id === hodId)?.name || HODS.find((h) => h.org === proj(projectId).org)?.name || '';
  /** Phụ lục 03 – B1: gửi yêu cầu = mail cho HOD phê duyệt, cc HCNS (mô phỏng). */
  const mailText = (hodId: string, projectId: string) => `Đã gửi mail cho HOD ${hodName(hodId, projectId)}, cc ${HCNS_MAIL}`;

  /** GetConflictingRequests + GetLeaveRequestConflictErrors: so KHUNG GIỜ; khi lưu / gửi mọi đơn còn hiệu lực giữ chỗ, khi duyệt chỉ đơn đã duyệt. */
  const conflicts = (employeeIds: string[], slots: Slot[], excludeId: string | undefined, approvedOnly: boolean) => {
    const errs: string[] = [];
    employeeIds.forEach((eid) => {
      const hit = records.filter((o) => o.id !== excludeId && o.employeeId === eid
        && (approvedOnly ? o.hodStatus === 'APPROVED' || o.status === 'APPROVED'
          : !['DRAFT', 'REJECTED', 'REJECTED_PM'].includes(o.hodStatus) && o.status !== 'REJECTED'))
        .flatMap((o) => o.slots.filter((s) => slots.some((n) => overlap(s, n))).map((s) => ({ o, s })))
        .sort((a, b) => (a.s.date + a.s.start).localeCompare(b.s.date + b.s.start))[0];
      if (hit) errs.push(`Nhân sự ${emp(eid).name} đã có lịch onsite dự án [${proj(hit.o.projectId).name}] (đơn ${hit.o.code}) ngày ${fmtD(hit.s.date)} lúc ${hit.s.start} - ${hit.s.end}.`);
      const lv = [...slots].sort((a, b) => a.date.localeCompare(b.date)).find((s) => LEAVES.some((l) => l.employeeId === eid && `${s.date}T${s.start}` < l.end && l.start < `${s.date}T${s.end}`));
      if (lv) errs.push(`Nhân sự ${emp(eid).name} đang có lịch nghỉ phép (${LEAVES.find((l) => l.employeeId === eid)!.label}) vào ngày ${fmtD(lv.date)}, vui lòng kiểm tra lại lịch onsite.`);
    });
    return errs;
  };

  /** HodApproveInitial → trả về thông báo lỗi hoặc null. */
  const approveOne = (r: OnsiteRec, t: string): string | null => {
    if (!['REQUESTED', 'APPROVED_PM', 'REJECTED', 'REJECTED_PM'].includes(r.hodStatus)) return 'Entity not found or not requested/pending initial';
    const br = blockReason(r); if (br) return br;
    const c = conflicts([r.employeeId], r.slots, r.id, true); if (c.length) return c.join('\n');
    if (r.hodStatus === 'REQUESTED' && !(isAdmin || isHr || isPmo)) {
      if (!isPmOf(r)) return 'You do not have permission to approve this request in its current state.';
      update(r.id, (x) => ({ ...x, hodStatus: 'APPROVED_PM', history: [...x.history, log(t, me.name, 'Duyệt', `Đã được phê duyệt cấp 1 (PM) bởi ${me.name}`)] }));
      return null;
    }
    if (r.hodStatus !== 'REQUESTED' && !(hodCovers(r) || isAdmin || isHr || isPmo)) return 'You do not have permission to approve this request in its current state.';
    const msg = r.hodStatus === 'REQUESTED' ? `Đã được duyệt trực tiếp (bỏ qua PM) bởi Admin/HR/PMO ${me.name}` : `Đã được phê duyệt cấp 2 (HOD/Admin) bởi ${me.name}`;
    update(r.id, (x) => ({ ...x, hodStatus: 'APPROVED', hodApprovedAt: t, hodApprovedBy: me.name, status: 'APPROVED', approvedAt: t, approveBy: me.name, history: [...x.history, log(t, me.name, 'Duyệt', msg)] }));
    return null;
  };
  /** ApproveInitial (bước PMO) — chỉ gọi từ "Duyệt hàng loạt" cho đơn HOD đã duyệt: ghi đè ApprovedAt / ApproveBy. */
  const pmoApproveOne = (r: OnsiteRec, t: string): string | null => {
    if (r.hodStatus !== 'APPROVED' && r.hodStatus !== 'REJECTED') return 'Entity not found or not approved';
    const br = blockReason(r); if (br) return br;
    const c = conflicts([r.employeeId], r.slots, r.id, true); if (c.length) return c.join('\n');
    update(r.id, (x) => ({ ...x, status: 'APPROVED', approvedAt: t, approveBy: me.name, history: [...x.history, log(t, me.name, 'Duyệt', `Đã được duyệt bởi ${me.name} (PMO duyệt — ApprovedAt bị ghi lại thành ${fmtDT(t)})`)] }));
    return null;
  };
  /** HodRejectInitial */
  const rejectOne = (r: OnsiteRec, note: string, t: string): string | null => {
    if (!['REQUESTED', 'APPROVED_PM', 'APPROVED'].includes(r.hodStatus)) return 'Entity not found or not in a rejectable state';
    const br = blockReason(r); if (br) return br;
    const lv1 = r.hodStatus === 'REQUESTED';
    if (lv1 ? !(isPmOf(r) || isAdmin || isHr || isPmo) : !(hodCovers(r) || isAdmin || isHr || isPmo)) return 'You do not have permission to reject this request in its current state.';
    const msg = lv1 ? `Đã bị từ chối cấp 1 (PM) bởi ${proj(r.projectId).pmName}, lý do: ${note}` : `Đã bị từ chối cấp 2 (HOD/Admin) bởi ${me.name}, lý do: ${note}`;
    update(r.id, (x) => ({ ...x, hodStatus: lv1 ? 'REJECTED_PM' : 'REJECTED', status: 'REJECTED', hodApprovedAt: t, hodApprovedBy: me.name, approvedAt: t, approveBy: me.name, note, history: [...x.history, log(t, me.name, 'Từ chối', msg)] }));
    return null;
  };

  const doApprove = (r: OnsiteRec) => {
    const err = approveOne(r, nowIso());
    if (err) return showToast(err, true);
    showToast(`Phê duyệt thành công!\n✉ Gửi mail thông báo tới HOD khối cha của dự án ${proj(r.projectId).code} (mô phỏng).`);
  };
  const doRequest = (r: OnsiteRec) => {
    const c = conflicts([r.employeeId], r.slots, r.id, false);
    if (c.length) return showToast(c.join('\n'), true);
    const br = blockReason(r); if (br) return showToast(br, true);
    if (!proj(r.projectId).active) return showToast(`Mã dự án ${proj(r.projectId).code} đã đóng, không thể gửi yêu cầu.`, true);
    const t = nowIso();
    const mail = mailText(r.hodId, r.projectId);
    update(r.id, (x) => ({ ...x, hodStatus: 'APPROVED_PM', status: null, hodApprovedAt: undefined, approvedAt: undefined,
      history: [...x.history, log(t, me.name, 'Gửi yêu cầu', `Yêu cầu được tạo bởi ${me.name}`), log(t, me.name, 'Gửi mail', `${mail} (Phụ lục 03 – bước 1)`)] }));
    showToast(`Gửi yêu cầu thành công!\n✉ ${mail} (mô phỏng).`);
  };
  /** RemoveAsync: ngoài Admin chỉ NGƯỜI TẠO xoá được. */
  const doRemove = (r: OnsiteRec) => {
    const ok = !blockReason(r) && (isAdmin || r.creatorId === me.id);
    if (!ok) return showToast('Remove failed!', true);
    setRecords((rs) => rs.filter((x) => x.id !== r.id)); showToast('Xóa bản ghi thành công!');
  };
  /** CreateOrUpdate: luôn kiểm tra trùng lịch (kể cả lưu nháp) → CreateAsync / UpdateAsync. */
  const saveForm = (data: FormData, submit: boolean) => {
    const c = conflicts(data.employeeIds, data.slots, data.base?.id, false);
    if (c.length) { showToast(c.join('\n'), true); return false; }
    if (data.base) { const br = blockReason(data.base); if (br) { showToast(br, true); return false; } }
    const m = Number(data.slots[0].date.slice(5, 7)), y = Number(data.slots[0].date.slice(0, 4));
    if (periods.find((p) => p.year === y && p.month === m && p.locked)) { showToast('Kỳ lương đã bị khoá. Cần mở khoá trước khi thay đổi dữ liệu.', true); return false; }
    if (!proj(data.projectId).active) { showToast(`Mã dự án ${proj(data.projectId).code} đã đóng, không thể tạo/sửa đơn.`, true); return false; }
    if (!data.base && !creatableProjects(role, me.id).some((p) => p.id === data.projectId)) { showToast(`Bạn không có quyền tạo đơn onsite cho dự án ${proj(data.projectId).code}.`, true); return false; }
    const t = nowIso(); const ymd = t.slice(0, 10).replace(/-/g, '');
    const newHod = submit ? 'APPROVED_PM' as const : 'DRAFT' as const;
    const mail = mailText(data.hodId, data.projectId);
    const mailLog = submit ? [log(t, me.name, 'Gửi mail', `${mail} (Phụ lục 03 – bước 1)`)] : [];
    if (data.base) {
      update(data.base.id, (x) => ({ ...x, projectId: data.projectId, address: data.address, zone: data.zone, regType: data.regType, description: data.description, hodId: data.hodId, attachment: data.attachment, slots: data.slots,
        hodStatus: newHod, history: [...x.history, log(t, me.name, 'Sửa', submit ? 'Sửa và gửi yêu cầu (chờ HOD)' : 'Sửa và lưu nháp'), ...mailLog] }));
    } else {
      setRecords((rs) => {
        let n = rs.filter((r) => r.code.startsWith(`ONS_${ymd}_`)).length;
        const created = data.employeeIds.map((eid) => {
          n++;
          return {
            id: 'r' + Math.random().toString(36).slice(2, 8), code: `ONS_${ymd}_${String(n).padStart(4, '0')}`, projectId: data.projectId, employeeId: eid,
            hodStatus: newHod, status: null, createdAt: t, createdBy: me.name, creatorId: me.id, isLocked: false,
            address: data.address, zone: data.zone, regType: data.regType, description: data.description, hodId: data.hodId, attachment: data.attachment, slots: data.slots,
            history: [log(t, me.name, submit ? 'Gửi yêu cầu' : 'Lưu nháp', submit ? 'Tạo đơn và gửi yêu cầu (chờ HOD duyệt)' : 'Tạo bản nháp'), ...mailLog],
          } as OnsiteRec;
        });
        return [...created, ...rs];
      });
    }
    showToast('Lưu thành công!' + (submit ? `\n✉ ${mail} (mô phỏng).` : ''));
    return true;
  };

  // ── Duyệt / từ chối hàng loạt (ĐỀ XUẤT: bỏ qua đơn đã chốt onsite) ──
  const skippedNote = (n: number) => (n ? `\nBỏ qua ${n} đơn đã chốt onsite (khoá).` : '');
  const bulkApprove = () => {
    if (!selected.length) return showToast('Vui lòng chọn ít nhất một yêu cầu!', true);
    const sel = records.filter((r) => selected.includes(r.id));
    const skipped = sel.filter(closed).length, skipNote = skippedNote(skipped);
    const items = sel.filter((r) => canApprove(r) || isPmoOrAdminHrApprove(r));
    if (!items.length) return showToast('Không có yêu cầu hợp lệ nào được chọn để duyệt!' + skipNote, true);
    setConfirm({
      text: `Bạn có chắc chắn muốn duyệt ${items.length} yêu cầu đã chọn?` + (skipped ? ` (bỏ qua ${skipped} đơn đã chốt onsite)` : ''),
      onOk: () => {
        const t = nowIso();
        const ok = items.filter((r) => !(canApprove(r) ? approveOne(r, t) : pmoApproveOne(r, t))).length;
        setSelected([]);
        showToast((ok ? `Đã duyệt thành công ${ok}/${items.length} yêu cầu!` : 'Duyệt hàng loạt thất bại!') + skipNote, ok === 0);
      },
    });
  };
  const bulkReject = () => {
    if (!selected.length) return showToast('Vui lòng chọn ít nhất một yêu cầu!', true);
    const sel = records.filter((r) => selected.includes(r.id));
    const skipped = sel.filter(closed).length;
    const items = sel.filter(canReject);
    if (!items.length) return showToast('Không có yêu cầu hợp lệ nào được chọn để từ chối!' + skippedNote(skipped), true);
    setReject({ ids: items.map((r) => r.id), skipped });
  };
  const doReject = (ids: string[], note: string, skipped = 0) => {
    const t = nowIso();
    const items = records.filter((r) => ids.includes(r.id));
    const errs: string[] = [];
    const ok = items.filter((r) => { const e = rejectOne(r, note, t); if (e) errs.push(`${r.code}: ${e}`); return !e; }).length;
    setSelected([]);
    const skipNote = skippedNote(skipped);
    if (items.length === 1) return errs.length ? showToast(errs[0] + skipNote, true) : showToast('Từ chối thành công!' + skipNote);
    showToast((ok ? `Đã từ chối thành công ${ok}/${items.length} yêu cầu!` : 'Từ chối hàng loạt thất bại!') + skipNote, ok === 0);
  };

  const projectOptions = isRegular ? PROJECTS.filter((p) => p.members.includes(EMPLOYEES.find((e) => e.userId === me.id)?.id || '')) : PROJECTS;
  const allChecked = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  const cards = [
    { key: 0, title: 'Đơn xin nghỉ phép', code: 'DXN', icon: Plane, bg: '#e7f6ec', color: '#1e9e54' },
    { key: 1, title: 'Đơn đăng ký đi onsite', code: 'DCT', icon: Briefcase, bg: '#eceefb', color: '#4d5bd6' },
    { key: 2, title: 'Duyệt bảng công', code: 'DBC', icon: CalendarCheck, bg: '#e6f7f4', color: '#0d9488' },
    { key: 3, title: 'Đơn làm thêm giờ', code: 'DLTG', icon: Clock, bg: '#fff3e6', color: '#e8830c' },
    { key: 5, title: 'Đơn cấp phép', code: 'DCP', icon: HeartHandshake, bg: '#fde8ef', color: '#d6336c' },
  ];

  return (
    <div className={embedded ? 'bg-white rounded-2xl border border-gray-100 shadow-sm p-3 text-gray-800' : 'p-4 bg-white m-4 rounded-sm shadow-sm min-w-[1000px] text-gray-800'}>
      {embedded ? (
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 rounded px-2 py-1">Phần onsite dựng theo code thật (TotalRequests?group=1 · OnsiteRequestComponent) + đề xuất Phụ lục 03 (khung xanh dưới grid)</div>
          <RoleSwitcher role={role} onChange={(r) => { setRole(r); setSelected([]); }} />
        </div>
      ) : (<>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm">
          <Target size={16} className="text-gray-400 mr-2" />
          <span className="text-gray-500 font-medium">Quản lý yêu cầu</span>
          <ChevronRight size={14} className="mx-2 text-gray-400" />
          <span className="text-gray-900 font-medium">Bảng điều khiển đơn từ</span>
          <span className="ml-3 text-[10px] text-gray-400">/TotalRequests?group=1 (menu Timekeeping › Onsite)</span>
        </div>
        <RoleSwitcher role={role} onChange={(r) => { setRole(r); setSelected([]); }} />
      </div>

      {/* Thẻ nhóm */}
      <div className="grid grid-cols-5 gap-3 mb-4">
        {cards.map((c) => {
          const active = c.key === 1;
          const Icon = c.icon;
          return (
            <div key={c.key} onClick={() => active && setOpen(true)} title={active ? '' : 'Ngoài phạm vi prototype onsite'}
              className={`border rounded-lg p-3 text-xs ${active ? `cursor-pointer ${open ? 'border-[#4d5bd6] ring-1 ring-[#4d5bd6]' : 'border-gray-200'}` : 'border-gray-100 opacity-40'}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: c.bg, color: c.color }}><Icon size={15} /></div>
                <div><div className="font-bold text-[12px]">{c.title}</div><div className="text-[10px] text-gray-400">{c.code}</div></div>
              </div>
              {active && (
                <>
                  <p className="text-[10px] text-gray-500 mt-2">Đăng ký làm việc tại site khách hàng hoặc đi công tác.</p>
                  <div className="flex items-center justify-between mt-2">
                    {canCreate
                      ? <button title="Thêm mới" onClick={(e) => { e.stopPropagation(); setForm({ mode: 'create' }); }} className="w-6 h-6 rounded-full bg-[#4d5bd6] text-white flex items-center justify-center"><Plus size={13} /></button>
                      : <span />}
                    <div className="flex gap-1">
                      <button onClick={(e) => { e.stopPropagation(); setOpen(true); setScope('mine'); }} className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold">{myCount} Y/c của tôi</button>
                      <button onClick={(e) => { e.stopPropagation(); setOpen(true); setScope('pending'); }} className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold">{pendingCount} Cần phê duyệt</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      </>)}

      {(open || embedded) && (
        <div className="border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between px-4 py-2.5 border-b bg-slate-50">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-sm flex items-center gap-2"><Briefcase size={15} className="text-[#4d5bd6]" />Đơn đăng ký đi onsite</h3>
              <div className="flex text-[11px] border border-gray-300 rounded overflow-hidden">
                {([['all', 'Tất cả'], ['mine', `${myCount} Y/c của tôi`], ['pending', `${pendingCount} Cần phê duyệt`]] as [Scope, string][]).map(([k, l]) => (
                  <button key={k} onClick={() => { setScope(k); setSelected([]); }} className={`px-3 py-1 ${scope === k ? 'bg-[#4d5bd6] text-white font-semibold' : 'bg-white text-gray-600'}`}>{l}</button>
                ))}
              </div>
            </div>
            <button title="Đóng" onClick={() => (onClose ? onClose() : setOpen(false))}><X size={16} className="text-gray-500" /></button>
          </div>

          <div className="p-3">
            {/* Thanh lọc */}
            <div className="flex flex-wrap items-center gap-3 mb-3 text-xs">
              <label className="flex items-center gap-2 font-bold">Dự án:
                <select className="border border-gray-300 rounded px-2 py-1 w-[250px] font-normal" value={fProject} onChange={(e) => setFProject(e.target.value)}>
                  <option value="">Tất cả dự án</option>
                  {projectOptions.map((p) => <option key={p.id} value={p.id}>{p.code} – {p.name}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 font-bold">Từ ngày <input type="date" className="border border-gray-300 rounded px-2 py-1 font-normal" value={fFrom} onChange={(e) => setFFrom(e.target.value)} /></label>
              <label className="flex items-center gap-2 font-bold">Đến ngày <input type="date" className="border border-gray-300 rounded px-2 py-1 font-normal" value={fTo} onChange={(e) => setFTo(e.target.value)} /></label>
              <button onClick={() => setApplied({ project: fProject, from: fFrom, to: fTo })} className="px-3 py-1.5 bg-[#007bff] text-white rounded flex items-center gap-1"><Search size={12} />Tìm kiếm</button>
              <button onClick={() => { setFProject(''); setFFrom(''); setFTo(''); setApplied({ project: '', from: '', to: '' }); }} className="px-3 py-1.5 border border-gray-300 rounded flex items-center gap-1"><RotateCcw size={12} />Đặt lại</button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-2 text-xs">
              {(hasHodApprove || hasPmoApprove || isHrOrAdmin) && (
                <>
                  <button onClick={bulkApprove} className="px-3 py-1.5 bg-green-600 text-white rounded flex items-center gap-1"><Check size={13} />Duyệt hàng loạt</button>
                  <button onClick={bulkReject} className="px-3 py-1.5 bg-red-600 text-white rounded flex items-center gap-1"><Ban size={13} />Từ chối hàng loạt</button>
                </>
              )}
              {selected.length > 0 && <span className="text-gray-500">Đã chọn {selected.length}</span>}
              <div className="ml-auto flex items-center gap-1.5">
                {['Export XLSX', 'Export XLS', 'Export CSV'].map((x) => <button key={x} onClick={() => showToast(`Đã xuất ExportResult (${x.split(' ')[1]}) — giả lập`)} className="px-2 py-1.5 border border-gray-300 rounded">{x}</button>)}
                <button onClick={() => showToast('Column Chooser — giả lập')} className="px-2 py-1.5 border border-gray-300 rounded flex items-center gap-1"><Columns3 size={12} />Column Chooser</button>
                <div className="relative w-56 ml-2">
                  <input className="w-full pl-7 pr-2 py-1.5 border border-gray-300 rounded outline-none focus:border-blue-400" placeholder="Enter text to search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                  <Search size={13} className="absolute left-2 top-2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="overflow-x-auto border border-gray-200 rounded">
              <table className="w-full text-[11px] border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th rowSpan={2} className="px-2 border-r border-b border-gray-200 w-8"><input type="checkbox" checked={allChecked} onChange={() => setSelected(allChecked ? [] : rows.map((r) => r.id))} /></th>
                    <th rowSpan={2} className="px-2 border-r border-b border-gray-200 w-8">#</th>
                    {['Mã đơn', 'Mã dự án', 'Tên dự án', 'Tháng', 'Ngày bắt đầu', 'Ngày kết thúc', 'Nhân viên đi onsite', 'Mã nhân viên', 'Mức hỗ trợ', 'Ngày tạo', 'Người tạo'].map((h) => (
                      <th key={h} rowSpan={2} className="px-3 py-2 text-left font-semibold border-r border-b border-gray-200 whitespace-nowrap"><span className="flex items-center justify-between gap-2">{h}<Filter size={10} className="text-gray-400" /></span></th>
                    ))}
                    <th colSpan={3} className="px-3 py-1 font-semibold border-r border-b border-gray-200 bg-blue-50">HOD</th>
                    <th rowSpan={2} className="px-3 py-2 text-left font-semibold border-r border-b border-gray-200 whitespace-nowrap bg-emerald-50/60">Chốt onsite</th>
                    <th rowSpan={2} className="px-3 py-2 font-semibold border-b border-gray-200 sticky right-0 bg-gray-50 min-w-[150px]">Thao tác</th>
                  </tr>
                  <tr className="bg-gray-50 text-gray-600">
                    {['Người phê duyệt', 'Ngày duyệt', 'Trạng thái'].map((h) => <th key={h} className="px-3 py-1.5 text-left font-semibold border-r border-b border-gray-200 whitespace-nowrap bg-blue-50/60">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 && <tr><td colSpan={18} className="text-center text-gray-400 py-8">Không có dữ liệu</td></tr>}
                  {rows.map((r, i) => {
                    const p = proj(r.projectId), e = emp(r.employeeId);
                    const owner = ownerBranch(r), lock = closed(r), rt = recRate(r);
                    return (
                      <tr key={r.id} className={`border-b border-gray-200 hover:bg-blue-50 ${selected.includes(r.id) ? 'bg-blue-50/60' : ''}`}>
                        <td className="px-2 text-center border-r border-gray-200"><input type="checkbox" checked={selected.includes(r.id)} onChange={() => setSelected(selected.includes(r.id) ? selected.filter((x) => x !== r.id) : [...selected, r.id])} /></td>
                        <td className="px-2 text-center text-gray-500 border-r border-gray-200">{i + 1}</td>
                        <td className="px-3 py-2 border-r border-gray-200 text-blue-600 font-medium whitespace-nowrap">
                          {r.code}
                          {r.isLocked && <span title="Bản ghi đã khoá (khoá ở màn /Onsite)"><Lock size={10} className="inline ml-1 text-gray-500" /></span>}
                        </td>
                        <td className="px-3 border-r border-gray-200 whitespace-nowrap">{p.code}</td>
                        <td className="px-3 border-r border-gray-200 max-w-[200px] truncate" title={p.name}>{p.name}</td>
                        <td className="px-3 border-r border-gray-200 text-center">{monthOf(r)}</td>
                        <td className="px-3 border-r border-gray-200 text-center">{fmtD(startDate(r))}</td>
                        <td className="px-3 border-r border-gray-200 text-center">{fmtD(endDate(r))}</td>
                        <td className="px-3 border-r border-gray-200 whitespace-nowrap">{e.name}</td>
                        <td className="px-3 border-r border-gray-200">{e.code}</td>
                        <td className="px-3 border-r border-gray-200 whitespace-nowrap">
                          {rt.rate > 0
                            ? <span title={rt.why}><span className="text-gray-500">{ZONE_SHORT[r.zone]}</span> · <b>{money(rt.rate)}</b></span>
                            : <span title={rt.why} className="text-amber-700 underline decoration-dotted cursor-help">Không hưởng</span>}
                        </td>
                        <td className="px-3 border-r border-gray-200 whitespace-nowrap">{fmtDT(r.createdAt)}</td>
                        <td className="px-3 border-r border-gray-200 whitespace-nowrap">{r.createdBy}</td>
                        <td className="px-3 border-r border-gray-200 whitespace-nowrap">{r.hodApprovedBy || ''}</td>
                        <td className="px-3 border-r border-gray-200 text-center">{fmtD(r.hodApprovedAt)}</td>
                        <td className="px-3 border-r border-gray-200"><Badge v={HOD_LABEL[r.hodStatus]} sub={r.hodStatus === 'APPROVED_PM' ? 'chờ HOD' : r.hodStatus === 'REQUESTED' ? 'chờ PM (dữ liệu cũ)' : r.hodStatus === 'REJECTED_PM' ? 'PM từ chối' : undefined} /></td>
                        <td className="px-3 border-r border-gray-200 whitespace-nowrap">
                          {r.closingId ? <span title="Đã chốt ở Báo cáo Onsite — đơn bị khoá" className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1"><Lock size={9} />Đã chốt {closingLabel(r.closingId)}</span> : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-2 sticky right-0 bg-white">
                          <div className="flex items-center gap-0.5">
                            <IconBtn t="Xem" c="text-blue-600" onClick={() => setForm({ mode: 'view', rec: r })}><Eye size={13} /></IconBtn>
                            {lock ? null : owner ? (
                              <>
                                <IconBtn t="Sửa" c="text-blue-600" onClick={() => setForm({ mode: 'edit', rec: r })}><Pencil size={13} /></IconBtn>
                                <IconBtn t="Xoá" c="text-red-600" onClick={() => setConfirm({ text: 'Bạn có chắc chắn muốn xóa bản ghi này không?', onOk: () => doRemove(r) })}><Trash2 size={13} /></IconBtn>
                                {canRequest(r) && <IconBtn t="Gửi yêu cầu" c="text-indigo-600" onClick={() => setConfirm({ text: 'Bạn có chắc chắn muốn gửi yêu cầu bản ghi này không?', onOk: () => doRequest(r) })}><Send size={13} /></IconBtn>}
                              </>
                            ) : (
                              <>
                                {canApprove(r) && <IconBtn t="Duyệt" c="text-green-600" onClick={() => setConfirm({ text: 'Duyệt bản ghi này?', onOk: () => doApprove(r) })}><Check size={13} /></IconBtn>}
                                {canReject(r) && <IconBtn t="Từ chối" c="text-red-600" onClick={() => setReject({ ids: [r.id] })}><Ban size={13} /></IconBtn>}
                              </>
                            )}
                            <IconBtn t="Lịch sử" c="text-orange-500" onClick={() => setHistoryOf(r)}><History size={13} /></IconBtn>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <RuleNote />
          </div>
        </div>
      )}

      {form && (
        <OnsiteFormModal
          mode={form.mode} rec={form.rec} role={role} me={me}
          onClose={() => setForm(null)}
          onSave={(d, submit) => { if (saveForm(d, submit)) setForm(null); }}
          canApprove={form.rec ? canApprovePopup(form.rec) : false} canReject={form.rec ? canReject(form.rec) : false}
          onApprove={() => { if (form.rec) { const r = form.rec; setForm(null); setConfirm({ text: 'Duyệt bản ghi này?', onOk: () => doApprove(r) }); } }}
          onReject={() => { if (form.rec) { setReject({ ids: [form.rec.id] }); setForm(null); } }}
          onRequest={form.rec?.closingId ? undefined : () => { const r = form.rec!; setForm(null); setConfirm({ text: 'Bạn có chắc chắn muốn gửi yêu cầu bản ghi này không?', onOk: () => doRequest(r) }); }}
        />
      )}
      {confirm && <ConfirmModal text={confirm.text} onCancel={() => setConfirm(null)} onOk={() => { confirm.onOk(); setConfirm(null); }} />}
      {reject && <RejectModal count={reject.ids.length} onCancel={() => setReject(null)} onOk={(note) => { doReject(reject.ids, note, reject.skipped); setReject(null); }} />}
      {historyOf && <HistoryModal rec={records.find((r) => r.id === historyOf.id) || historyOf} onClose={() => setHistoryOf(null)} />}
      <Toast toast={toast} />
    </div>
  );
};

const RuleNote: React.FC = () => (
  <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] leading-relaxed">
    <div className="text-gray-600 bg-slate-50 border border-slate-200 rounded p-3">
      <div className="font-semibold text-slate-700 mb-1 flex items-center gap-1"><Info size={12} />Theo code hiện tại — luồng và quyền</div>
      <ul className="list-disc ml-4 space-y-0.5">
        <li><b>Lưu bản nháp</b> → Draft. <b>Gửi yêu cầu</b> → chuyển thẳng sang <b>chờ HOD</b> (cột HOD hiện "Requested") + gửi mail HOD. HOD trong khối / Admin / HR / PMO duyệt → Approved (một bước, cả HodStatus và Status) + mail HOD khối cha.</li>
        <li>Người tạo hoặc PM dự án (không phải nhân viên thường) và đơn chưa Approved: thấy Sửa / Xoá / Gửi yêu cầu, <b>không</b> thấy Duyệt / Từ chối. Người khác thấy Duyệt / Từ chối theo trạng thái.</li>
        <li>Nút Duyệt / Từ chối ẩn khi đơn bị khoá (khoá ở màn /Onsite cũ). Không có nút Khoá ở màn này.</li>
        <li>Mỗi lần lưu (kể cả nháp) / gửi kiểm tra trùng khung giờ với đơn khác còn hiệu lực và nghỉ phép; lúc duyệt so với đơn đã duyệt.</li>
        <li>Ai thấy đơn: người tạo, HOD trong khối, PM dự án, PMO, HR (và IT). Bản nháp chỉ người tạo thấy.</li>
      </ul>
    </div>
    <div className="text-amber-900 bg-amber-50 border border-amber-300 rounded p-3">
      <div className="font-semibold mb-1 flex items-center gap-1"><AlertTriangle size={12} />Theo code hiện tại — điểm lệch / lỗi phát hiện khi rà code</div>
      <ul className="list-disc ml-4 space-y-0.5">
        <li><b>Nhân viên được cử đi onsite không thấy đơn của mình</b> (chỉ thấy đơn mình tạo, mà nhân viên thường không được tạo). Màn /Onsite cũ thì có cho xem.</li>
        <li><b>Admin không có trong nhóm xem toàn bộ</b> (chỉ IT / HR / PMO) — Admin chỉ thấy đơn mình tạo / dự án mình làm PM / khối mình làm HOD.</li>
        <li>"Cần phê duyệt" của PM và HOD đếm cả đơn <b>đã bị từ chối</b> và đơn đã Approved mà Status chưa Approved ⇒ con số không bao giờ về 0.</li>
        <li>"Duyệt hàng loạt" với đơn đã Approved (HR / Admin) gọi bước PMO ApproveInitial ⇒ <b>ghi đè ApprovedAt / Người duyệt</b> — làm lệch cột "Lũy kế" ở Báo cáo Onsite.</li>
        <li>Nút Sửa vẫn hiện với đơn đã khoá; bấm Lưu mới báo lỗi. PM không phải người tạo bấm Xoá sẽ nhận "Remove failed!".</li>
        <li>Lọc Từ ngày / Đến ngày ở thanh trên của thẻ không áp cho nhóm Onsite (chỉ nhóm Nghỉ phép, OT) — dùng bộ lọc trong danh sách.</li>
      </ul>
    </div>
    <div className="col-span-2 text-emerald-900 bg-emerald-50 border border-emerald-300 rounded p-3">
      <div className="font-semibold mb-1 flex items-center gap-1"><Info size={12} />ĐỀ XUẤT theo quy định mới (Phụ lục 03 – hỗ trợ chi phí onsite trên địa bàn Hà Nội) — chưa có trong code</div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="font-semibold">Tóm tắt Phụ lục 03</div>
          <ul className="list-disc ml-4 space-y-0.5">
            <li>Áp dụng cho nhân viên <b>HĐ thử việc + HĐ chính thức</b> đi onsite tại trụ sở khách hàng <b>trong Hà Nội</b>. <b>Không</b> áp dụng cho đi họp tại nơi làm việc của khách hàng — đi họp không đăng ký đơn onsite (HOD không duyệt).</li>
            <li>Cách trụ sở <b>&lt; 30km: 100.000 đ / ngày công</b>; <b>≥ 30km: 180.000 đ / ngày công</b>.</li>
            <li>Tính theo ngày công onsite thực tế trong tháng, HOD xác nhận, trả vào kỳ lương của tháng đó.</li>
            <li>Quy trình: <b>B1</b> đội dự án gửi email cho HOD phê duyệt, cc {HCNS_MAIL} · <b>B2</b> hàng tuần quản lý nhóm / HOD cập nhật onsite trên iMIS · <b>B3</b> HCNS gửi mail xác nhận cùng bảng lương.</li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Thay đổi trên màn này</div>
          <ul className="list-disc ml-4 space-y-0.5">
            <li>Form thêm trường bắt buộc <b>Địa bàn / khoảng cách từ trụ sở</b> (để trống khi tạo mới). Form hiện ngay mức hưởng theo từng nhân viên.</li>
            <li><b>Quyền tạo đơn</b>: chỉ <b>PM dự án</b> (dự án mình quản lý), <b>HOD</b> (dự án thuộc khối, hoặc dự án khối khác mà mình làm PM), <b>HR</b>, <b>Admin</b>. Nhân viên thường và PMO không tạo được; PMO vẫn duyệt như code (code hiện cho cả PMO tạo và chọn mọi dự án).</li>
            <li>Chip nhân viên hiện loại HĐ; HĐ thực tập / cộng tác viên có cảnh báo vàng nhưng <b>vẫn cho đăng ký</b> (đơn không được tính phụ cấp).</li>
            <li>Grid thêm cột <b>Mức hỗ trợ</b> (địa bàn + số tiền, hoặc "Không hưởng" kèm lý do khi rê chuột) và <b>Chốt onsite</b>.</li>
            <li><b>Gửi yêu cầu</b> (từ form hoặc nút trên grid) = bước B1: mô phỏng gửi mail cho HOD, cc {HCNS_MAIL}, ghi vào lịch sử đơn.</li>
            <li>Việc <b>chốt onsite</b> chuyển sang màn <b>Báo cáo Onsite</b>: HCNS chốt từng dòng / nhiều dòng (gắn kỳ chốt cho đơn, bỏ chốt được khi kỳ chưa hoàn tất) rồi hoàn tất chốt tháng. Payroll chỉ đọc số đã hoàn tất chốt.</li>
            <li><b>Đơn đã chốt bị khoá</b>: không còn Sửa / Xoá / Gửi yêu cầu / Duyệt / Từ chối trên grid và popup, chỉ còn Xem + Lịch sử. Duyệt / Từ chối hàng loạt bỏ qua đơn đã chốt và báo số đơn bị bỏ qua.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);
