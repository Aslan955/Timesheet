/**
 * Store Onboarding Request — nguồn: TA "Gửi thông tin sang HCNS" / "Báo hủy Onboard" ở popup Gửi mail;
 * HCNS duyệt / từ chối, tiến độ sau duyệt (hồ sơ Employees, user iMIS, Microsoft Forms, mail IT), checklist.
 * Đổi Stage lượt ứng tuyển như code thật: gửi → Offer Accepted, nhận việc → Onboarded, huỷ → Offer Rejected.
 * Phải bọc TRONG RcProvider (store Tuyển dụng).
 */
import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { useRc } from '../recruitment/rc/RcContext';
import { Stage, MailKind } from '../recruitment/rc/rcData';
import {
  OnbRecord, HandoffData, FieldChange, OnbMail, OnbTask, TaskKey, SEED_RECORDS, HCNS_MAILBOX, IT_MAILBOX, IT_ITEMS, MS_FORM_LINK, FORM_FIELDS,
  buildChecklist, diffHandoff, todayIso,
} from './onboardingData';
import { upsertEmployeeFromOnboarding, removeEmployeeFromOnboarding } from '../components/EmployeePage';

/** Người dùng giả lập theo vai trò (prototype chưa có đăng nhập). */
export const TA_USER = 'MenTT';
export const HCNS_USER = 'Nguyễn Thị Mai';

const statusReal = (r: OnbRecord) => (r.status === 'Chờ HCNS duyệt' ? 'Pending' : 'Approved');
const ACTIVE = (r: OnbRecord) => r.status !== 'Huỷ onboard' && r.status !== 'HCNS từ chối';

export interface SubmitInput {
  candidateId: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateSource: string;
  cvFile: string;
  requestId: string;
  block: string;
  taPic: string;
  taPic2: string;
  data: HandoffData;
}

interface OnboardingContextValue {
  records: OnbRecord[];
  find: (id: string) => OnbRecord | undefined;
  /** Phiếu còn hiệu lực của ứng viên (theo lượt ứng tuyển nếu có). */
  activeFor: (candidateId: string, requestId?: string) => OnbRecord | undefined;
  /** Bản gửi HCNS gần nhất (snapshot) — chỉ bỏ qua khi TA đã báo huỷ onboard. Dùng cho prefill + xác định "Cập nhật". */
  lastSnapshot: (candidateId: string, requestId: string) => OnbRecord | undefined;
  /** mail: nội dung đã soạn / sửa ở bước Xem trước của popup Gửi mail. */
  submitHandoff: (input: SubmitInput, mail?: { subject: string; body: string }) => OnbRecord;
  /** mail: nội dung đã soạn / sửa ở bước Xem trước của popup Gửi mail. */
  cancelOnboard: (id: string, reason: string, note: string, mail?: { subject: string; body: string }) => void;
  hrSave: (id: string, patch: { data?: Partial<HandoffData>; contractType?: string; hrNote?: string }) => void;
  hrApprove: (id: string, patch: { data?: Partial<HandoffData>; contractType: string; hrNote: string }) => void;
  hrReject: (id: string, reason: string) => void;
  toggleChecklist: (id: string, itemId: string) => void;
  /** Tiến độ sau duyệt */
  remindForm: (id: string) => void;
  submitForm: (id: string, data: Record<string, string>) => void;
  itConfirm: (id: string, items: string[], companyEmail: string, channel: string, deliveredBy: string) => void;
  confirmOnboarded: (id: string) => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

const nowIso = () => new Date().toISOString();

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<OnbRecord[]>(() => SEED_RECORDS);
  const recordsRef = useRef(records);
  recordsRef.current = records;
  const rc = useRc();
  const rcRef = useRef(rc);
  rcRef.current = rc;

  const appOf = (candidateId: string, requestId: string) => rcRef.current.applications.find((a) => a.candidateId === candidateId && a.requestId === requestId);
  const codeOf = (requestId: string) => rcRef.current.request(requestId)?.code || requestId;

  // Đổi Stage của lượt ứng tuyển + Stage tổng hồ sơ (giống ApplyStageChangeAsync)
  const setStage = (candidateId: string, requestId: string, status: Stage, keepIfOnboarded = false) => {
    const app = appOf(candidateId, requestId);
    if (!app || (keepIfOnboarded && app.stage === 'Onboarded')) return;
    rcRef.current.setAppStage(app.id, status, true);
  };

  // Ghi vào lịch sử mail của ứng viên (tab "Lịch sử gửi mail")
  const logMail = (candidateId: string, requestId: string, kind: MailKind, subject: string, to: string, cc: string[], attachments: string[], body: string) =>
    rcRef.current.addMail({ candidateId, applicationId: appOf(candidateId, requestId)?.id || '', kind, subject, to, cc, attachments, body, ok: true });

  const patch = (id: string, fn: (r: OnbRecord) => OnbRecord) => setRecords((prev) => prev.map((r) => (r.id === id ? fn(r) : r)));

  const nextId = () => {
    const year = new Date().getFullYear();
    const prefix = `ONB-${year}-`;
    const max = recordsRef.current.filter((r) => r.id.startsWith(prefix)).reduce((m, r) => Math.max(m, parseInt(r.id.slice(prefix.length), 10) || 0), 0);
    return `${prefix}${String(max + 1).padStart(3, '0')}`;
  };

  const activeFor: OnboardingContextValue['activeFor'] = (candidateId, requestId) =>
    recordsRef.current
      .filter((r) => r.candidateId === candidateId && (!requestId || r.requestId === requestId) && ACTIVE(r))
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt))[0];

  const lastSnapshot: OnboardingContextValue['lastSnapshot'] = (candidateId, requestId) =>
    recordsRef.current
      .filter((r) => r.candidateId === candidateId && r.requestId === requestId && r.status !== 'Huỷ onboard')
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt))[0];

  const submitHandoff: OnboardingContextValue['submitHandoff'] = (input, composed) => {
    const at = nowIso();
    // Pending/Approved của lượt → cập nhật; đã bị HCNS từ chối → tạo Pending mới nhưng mail vẫn là [Cập nhật]
    const prev = activeFor(input.candidateId, input.requestId);
    const snap = lastSnapshot(input.candidateId, input.requestId);
    const isUpdate = !!snap;
    const subject = composed?.subject || `${isUpdate ? '[Cập nhật] ' : ''}[Tuyển dụng → HCNS] Bàn giao nhân sự mới: ${input.data.fullName} - ${input.data.position}`;
    const attachments = [input.data.evidenceFile, !input.data.cvLink && input.cvFile ? input.cvFile : ''].filter(Boolean);
    const mail: OnbMail = {
      at,
      kind: isUpdate ? 'Cập nhật thông tin onboard' : 'Gửi thông tin sang HCNS',
      subject,
      to: HCNS_MAILBOX,
      cc: [input.taPic, input.taPic2].filter(Boolean),
      attachments,
    };
    let result: OnbRecord;
    if (prev) {
      const changes = diffHandoff(prev.data, input.data);
      const approved = prev.status === 'Đang onboard' || prev.status === 'Đã onboard';
      result = {
        ...prev,
        ...input,
        lastChanges: changes,
        version: prev.version + 1,
        returnReason: undefined,
        sentAt: at,
        sentBy: TA_USER,
        mails: [...prev.mails, mail],
        history: [
          ...prev.history,
          {
            at,
            by: TA_USER,
            role: 'TA',
            action: 'Gửi cập nhật thông tin onboard',
            note: approved ? 'Phiếu đã duyệt — HCNS cần cập nhật hồ sơ nhân sự theo thay đổi.' : changes.length ? undefined : 'Gửi lại, không có trường nào thay đổi.',
            changes,
          },
        ],
      };
      setRecords((list) => list.map((r) => (r.id === prev.id ? result : r)));
    } else {
      result = {
        id: nextId(),
        ...input,
        lastChanges: snap ? diffHandoff(snap.data, input.data) : [],
        version: 1,
        status: 'Chờ HCNS duyệt',
        sentAt: at,
        sentBy: TA_USER,
        contractType: '',
        hrNote: '',
        account: { status: 'Chưa tạo' },
        checklist: [],
        mails: [mail],
        history: [
          {
            at, by: TA_USER, role: 'TA',
            action: snap ? 'Gửi cập nhật thông tin onboard' : 'Gửi thông tin sang HCNS',
            note: snap ? `Yêu cầu trước (${snap.id}) đã bị HCNS từ chối → tạo yêu cầu Pending mới.` : `Stage lượt ${codeOf(input.requestId)} → Offer Accepted`,
            changes: snap ? diffHandoff(snap.data, input.data) : undefined,
          },
        ],
      };
      setRecords((list) => [result, ...list]);
    }
    setStage(input.candidateId, input.requestId, 'Offer Accepted', true);
    // Ngày onboard đã tới → lên Onboarded ngay (không chờ job 00:15)
    if (input.data.startDate && input.data.startDate <= todayIso()) setStage(input.candidateId, input.requestId, 'Onboarded');
    logMail(input.candidateId, input.requestId, isUpdate ? 'Cập nhật thông tin onboard sang HCNS' : 'Gửi thông tin sang HCNS', subject, HCNS_MAILBOX, mail.cc, attachments, composed?.body || `Phiếu ${result.id} — xem chi tiết ở màn Bàn giao onboard.`);
    return result;
  };

  const cancelOnboard: OnboardingContextValue['cancelOnboard'] = (id, reason, note, composed) => {
    const r = recordsRef.current.find((x) => x.id === id);
    if (!r) return;
    const at = nowIso();
    const subject = composed?.subject || `[iMIS] Báo hủy Onboard - Ứng viên ${r.data.fullName}`;
    const approved = r.status === 'Đang onboard' || r.status === 'Đã onboard';
    // Approved: hồ sơ "mồ côi" (chưa có tài khoản + mã NV) bị xoá mềm cùng HĐ tự sinh; đã có tài khoản thì giữ, để HR xử lý
    const keepProfile = approved && r.account.status === 'Đã tạo';
    const dropProfile = approved && !keepProfile;
    const effect = keepProfile
      ? 'Yêu cầu đã duyệt, hồ sơ đã có tài khoản — Cần HR xử lý hồ sơ/tài khoản đã tạo.'
      : dropProfile
        ? 'Yêu cầu đã duyệt — đã xoá mềm hồ sơ nhân sự chưa có tài khoản và hợp đồng tự sinh.'
        : '';
    const stamp = new Date().toLocaleString('vi-VN');
    patch(id, (x) => ({
      ...x,
      status: 'Huỷ onboard',
      cancelReason: reason,
      account: dropProfile ? { status: 'Chưa tạo' } : x.account,
      checklist: dropProfile ? [] : x.checklist,
      // Việc còn dở dừng lại
      tasks: (x.tasks || []).map((t) => (t.status === 'Đang thực hiện' ? { ...t, detail: `${t.detail || ''} — dừng do TA báo huỷ onboard` } : t)),
      hrNote: [x.hrNote, `[Tuyển dụng] ${TA_USER} báo huỷ onboard lúc ${stamp} – Lý do: ${reason}${note ? ` – Ghi chú: ${note}` : ''}${effect ? ` – ${effect}` : ''}`].filter(Boolean).join('\n'),
      mails: [...x.mails, { at, kind: 'Báo huỷ onboard', subject, to: HCNS_MAILBOX, cc: [x.taPic, x.taPic2].filter(Boolean), attachments: [] }],
      history: [
        ...x.history,
        { at, by: TA_USER, role: 'TA', action: 'Báo huỷ onboard', note: [`Lý do: ${reason}.`, note && `Ghi chú: ${note}.`, `Onboarding Request ${statusReal(x)} → Rejected.`, 'Stage → Offer Rejected.', effect].filter(Boolean).join(' ') },
      ],
    }));
    setStage(r.candidateId, r.requestId, 'Offer Rejected');
    if (dropProfile) {
      rcRef.current.setCandidateHr(r.candidateId, { status: 'None' });
      if (r.account.employeeCode) removeEmployeeFromOnboarding(r.account.employeeCode);
    }
    logMail(r.candidateId, r.requestId, 'Báo hủy Onboard sang HCNS', subject, HCNS_MAILBOX, [r.taPic, r.taPic2].filter(Boolean), [], composed?.body || `Lý do: ${reason}${note ? `\nGhi chú: ${note}` : ''}`);
  };

  const hrChanges = (r: OnbRecord, p: { data?: Partial<HandoffData>; contractType?: string }): FieldChange[] => {
    const out: FieldChange[] = p.data ? diffHandoff(r.data, { ...r.data, ...p.data }) : [];
    if (p.contractType !== undefined && p.contractType !== r.contractType) out.push({ field: 'Loại hợp đồng', from: r.contractType, to: p.contractType });
    return out;
  };

  const hrSave: OnboardingContextValue['hrSave'] = (id, p) =>
    patch(id, (r) => {
      const changes = hrChanges(r, p);
      return {
        ...r,
        data: { ...r.data, ...p.data },
        contractType: p.contractType ?? r.contractType,
        hrNote: p.hrNote ?? r.hrNote,
        history: changes.length ? [...r.history, { at: nowIso(), by: HCNS_USER, role: 'HCNS', action: 'HCNS bổ sung thông tin', changes }] : r.history,
      };
    });

  /** Thông tin hồ sơ Employees lấy từ yêu cầu onboarding (tạo nếu chưa có). */
  const empInfo = (r: OnbRecord) => ({
    fullName: r.data.fullName, division: r.block, department: r.data.department, position: r.data.position, level: r.data.level,
    manager: r.data.manager, joinDate: r.data.startDate, personalEmail: r.candidateEmail, phone: r.candidatePhone, techStack: r.data.techStack,
  });
  const setTask = (r: OnbRecord, k: TaskKey, t: Partial<OnbTask>): OnbTask[] => (r.tasks || []).map((x) => (x.key === k ? { ...x, ...t } : x));
  const userNameOf = (fullName: string) => {
    const parts = fullName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().split(/\s+/).filter(Boolean);
    return parts.length ? `${parts[parts.length - 1]}${parts.slice(0, -1).map((x) => x[0]).join('')}` : 'newuser';
  };
  const nextEmpCode = () => {
    const used = recordsRef.current.map((r) => parseInt((r.account.employeeCode || '').replace(/\D/g, ''), 10) || 0);
    return `NV${String(Math.max(420, ...used) + 1).padStart(4, '0')}`;
  };

  const hrApprove: OnboardingContextValue['hrApprove'] = (id, p) => {
    const at = nowIso();
    const cur = recordsRef.current.find((x) => x.id === id);
    if (!cur) return;
    const data = { ...cur.data, ...p.data };
    const code = nextEmpCode();
    // 1. Tạo hồ sơ nhân sự ngay (màn Employees)
    upsertEmployeeFromOnboarding(code, {
      fullName: data.fullName, division: cur.block, department: data.department, position: data.position, level: data.level,
      manager: data.manager, joinDate: data.startDate, personalEmail: cur.candidateEmail, phone: cur.candidatePhone, techStack: data.techStack,
    });
    const formMail: OnbMail = { at, kind: 'Form onboarding cho ứng viên', subject: 'Chào mừng bạn gia nhập — vui lòng điền thông tin cá nhân (Microsoft Forms)', to: cur.candidateEmail, cc: [HCNS_MAILBOX], attachments: [] };
    const itMail: OnbMail = { at, kind: 'Mail IT cấp tài khoản', subject: `[Onboarding] Cấp tài khoản cho nhân sự mới: ${data.fullName} – ${data.position} – nhận việc ${data.startDate.split('-').reverse().join('/')}`, to: IT_MAILBOX, cc: [HCNS_MAILBOX, data.manager], attachments: [] };
    patch(id, (r) => {
      const changes = hrChanges(r, p);
      return {
        ...r,
        data,
        contractType: p.contractType,
        hrNote: p.hrNote,
        status: 'Đang onboard',
        decidedBy: HCNS_USER,
        decidedAt: at,
        returnReason: undefined,
        account: { status: 'Đang tạo', employeeCode: code },
        checklist: buildChecklist(0),
        tasks: [
          { key: 'employee', status: 'Đã hoàn thành', startedAt: at, doneAt: at, doneBy: 'Hệ thống', detail: `Mã NV ${code} · Thử việc` },
          { key: 'imisAccount', status: 'Đang thực hiện', startedAt: at, detail: 'Job tạo user iMIS đang chạy…' },
          { key: 'personalForm', status: 'Đang thực hiện', startedAt: at, detail: `Đã gửi link form tới ${r.candidateEmail} — chờ nhân sự submit`, reminders: 0 },
          { key: 'itAccount', status: 'Đang thực hiện', startedAt: at, detail: `Đã gửi mail tới ${IT_MAILBOX} — chờ IT xác nhận`, itDone: [] },
        ],
        mails: [...r.mails, formMail, itMail],
        history: [
          ...r.history,
          ...(changes.length ? [{ at, by: HCNS_USER, role: 'HCNS' as const, action: 'HCNS bổ sung thông tin', changes }] : []),
          { at, by: HCNS_USER, role: 'HCNS', action: 'Duyệt yêu cầu onboarding', note: [p.contractType && `Loại HĐ: ${p.contractType}`, p.hrNote].filter(Boolean).join(' · ') || undefined },
          { at, by: 'Hệ thống', role: 'Hệ thống', action: `Tạo hồ sơ nhân sự ${code} (Thử việc)` },
          { at, by: 'Hệ thống', role: 'Hệ thống', action: `Gửi Microsoft Forms thông tin cá nhân tới ${r.candidateEmail}` },
          { at, by: 'Hệ thống', role: 'Hệ thống', action: `Gửi mail ${IT_MAILBOX} đề nghị cấp tài khoản Microsoft 365 & đăng nhập` },
        ],
      };
    });
    // 2. Job tạo user iMIS (ExternalUserCreateJob)
    window.setTimeout(() => {
      // Tác động phụ (Employees, hồ sơ ứng viên) chạy NGOÀI hàm cập nhật state
      const cur2 = recordsRef.current.find((x) => x.id === id);
      if (!cur2 || cur2.account.status !== 'Đang tạo') return;
      const user = userNameOf(cur2.data.fullName);
      const empCode = cur2.account.employeeCode || code;
      upsertEmployeeFromOnboarding(empCode, empInfo(cur2), { userName: user }, 'Gán tài khoản iMIS');
      rcRef.current.setCandidateHr(cur2.candidateId, { status: 'Probation', employeeCode: empCode, employeeName: cur2.data.fullName, startDate: cur2.data.startDate });
      patch(id, (r) => {
        if (r.account.status !== 'Đang tạo') return r;
        const done = nowIso();
        return {
          ...r,
          account: { ...r.account, status: 'Đã tạo', userName: user },
          tasks: setTask(r, 'imisAccount', { status: 'Đã hoàn thành', doneAt: done, doneBy: 'Hệ thống', detail: `User iMIS: ${user}` }),
          history: [...r.history, { at: done, by: 'Hệ thống', role: 'Hệ thống', action: `Tạo tài khoản iMIS: ${user} · gán hồ sơ ${empCode}` }],
        };
      });
    }, 2500);
  };

  const remindForm: OnboardingContextValue['remindForm'] = (id) => {
    const at = nowIso();
    patch(id, (r) => {
      const t = r.tasks?.find((x) => x.key === 'personalForm');
      const n = (t?.reminders || 0) + 1;
      return {
        ...r,
        tasks: setTask(r, 'personalForm', { reminders: n, detail: `Đã gửi link form tới ${r.candidateEmail} — chờ nhân sự submit (đã nhắc ${n} lần)` }),
        mails: [...r.mails, { at, kind: 'Nhắc điền form thông tin', subject: `[Nhắc] Vui lòng hoàn thiện thông tin cá nhân trước ngày nhận việc`, to: r.candidateEmail, cc: [HCNS_MAILBOX], attachments: [] }],
        history: [...r.history, { at, by: HCNS_USER, role: 'HCNS', action: `Gửi nhắc điền Microsoft Forms (lần ${n})` }],
      };
    });
  };

  const submitForm: OnboardingContextValue['submitForm'] = (id, formData) => {
    const at = nowIso();
    const r = recordsRef.current.find((x) => x.id === id);
    if (!r) return;
    if (r.account.employeeCode) upsertEmployeeFromOnboarding(r.account.employeeCode, empInfo(r), formData, 'Cập nhật thông tin cá nhân từ Microsoft Forms');
    const filled = FORM_FIELDS.filter((f) => (formData[f.key] || '').trim()).length;
    patch(id, (x) => ({
      ...x,
      tasks: setTask(x, 'personalForm', { status: 'Đã hoàn thành', doneAt: at, doneBy: x.data.fullName, formData, detail: `Đã nhận ${filled}/${FORM_FIELDS.length} trường — đã cập nhật hồ sơ Employees` }),
      history: [...x.history, { at, by: x.data.fullName, role: 'Hệ thống', action: 'Nhân sự đã submit Microsoft Forms thông tin cá nhân', note: `${filled}/${FORM_FIELDS.length} trường → hồ sơ ${x.account.employeeCode}` }],
    }));
  };

  const itConfirm: OnboardingContextValue['itConfirm'] = (id, items, companyEmail, channel, deliveredBy) => {
    const at = nowIso();
    const r = recordsRef.current.find((x) => x.id === id);
    if (!r) return;
    const all = IT_ITEMS.every((i) => items.includes(i));
    if (companyEmail && r.account.employeeCode) upsertEmployeeFromOnboarding(r.account.employeeCode, empInfo(r), { companyEmail }, 'IT cấp email công ty');
    patch(id, (x) => ({
      ...x,
      account: { ...x.account, companyEmail: companyEmail || x.account.companyEmail },
      tasks: setTask(x, 'itAccount', {
        status: all ? 'Đã hoàn thành' : 'Đang thực hiện',
        itDone: items,
        deliveryChannel: channel || undefined,
        deliveredBy: deliveredBy || undefined,
        doneAt: all ? at : undefined,
        doneBy: all ? `IT (${IT_MAILBOX})` : undefined,
        detail: all
          ? `${companyEmail || 'Đã cấp'} · đủ ${IT_ITEMS.length}/${IT_ITEMS.length} mục · bàn giao: ${channel} (${deliveredBy})`
          : `Đã gửi mail tới ${IT_MAILBOX} — IT đã xác nhận ${items.length}/${IT_ITEMS.length} mục`,
      }),
      history: [
        ...x.history,
        {
          at, by: deliveredBy || `IT (${IT_MAILBOX})`, role: 'Hệ thống', action: `IT xác nhận cấp tài khoản (${items.length}/${IT_ITEMS.length})`,
          note: [companyEmail && `Email: ${companyEmail}`, items.join('; '), channel && `Bàn giao đăng nhập: ${channel}`].filter(Boolean).join(' · '),
        },
      ],
    }));
  };

  const hrReject: OnboardingContextValue['hrReject'] = (id, reason) =>
    patch(id, (r) => ({
      ...r,
      status: 'HCNS từ chối',
      returnReason: reason,
      decidedBy: HCNS_USER,
      decidedAt: nowIso(),
      hrNote: [r.hrNote, `[Từ chối] ${HCNS_USER} lúc ${new Date().toLocaleString('vi-VN')}${reason ? ` – Lý do: ${reason}` : ''}`].filter(Boolean).join('\n'),
      history: [...r.history, { at: nowIso(), by: HCNS_USER, role: 'HCNS', action: 'Từ chối yêu cầu onboarding', note: reason || '(không ghi lý do)' }],
    }));

  const toggleChecklist: OnboardingContextValue['toggleChecklist'] = (id, itemId) =>
    patch(id, (r) => ({
      ...r,
      checklist: r.checklist.map((c) => (c.id === itemId ? (c.done ? { ...c, done: false, doneBy: undefined, doneAt: undefined } : { ...c, done: true, doneBy: HCNS_USER, doneAt: nowIso() }) : c)),
    }));

  const confirmOnboarded: OnboardingContextValue['confirmOnboarded'] = (id) => {
    const r = recordsRef.current.find((x) => x.id === id);
    if (!r) return;
    patch(id, (x) => ({
      ...x,
      status: 'Đã onboard',
      history: [...x.history, { at: nowIso(), by: HCNS_USER, role: 'HCNS', action: 'Xác nhận ứng viên đã nhận việc', note: `Ngày nhận việc ${x.data.startDate <= todayIso() ? 'đã tới' : 'sớm hơn kế hoạch'} → Stage Onboarded` }],
    }));
    setStage(r.candidateId, r.requestId, 'Onboarded');
  };

  const value = useMemo<OnboardingContextValue>(
    () => ({
      records,
      find: (id) => records.find((r) => r.id === id),
      activeFor,
      lastSnapshot,
      submitHandoff,
      cancelOnboard,
      hrSave,
      hrApprove,
      hrReject,
      toggleChecklist,
      remindForm,
      submitForm,
      itConfirm,
      confirmOnboarded,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [records],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within an OnboardingProvider');
  return ctx;
}
