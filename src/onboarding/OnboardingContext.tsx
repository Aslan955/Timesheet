/**
 * Store Onboarding Request — nguồn: TA "Gửi thông tin sang HCNS" / "Báo hủy Onboard" ở popup Gửi mail;
 * HCNS duyệt / từ chối, tiến độ sau duyệt (hồ sơ Employees, user iMIS, Microsoft Forms, mail IT), checklist.
 * Đổi Stage lượt ứng tuyển như code thật: gửi → Offer Accepted, nhận việc → Onboarded, huỷ → Offer Rejected.
 * Phải bọc TRONG RcProvider (store Tuyển dụng).
 */
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRc } from '../recruitment/rc/RcContext';
import { Stage, MailKind } from '../recruitment/rc/rcData';
import {
  OnbRecord, HandoffData, FieldChange, OnbMail, OnbTask, TaskKey, ItRequest, ItReturn, SEED_RECORDS, HCNS_MAILBOX, IT_MAILBOX, MARCOM_MAILBOX, FORM_FIELDS,
  buildChecklist, diffHandoff, canChangeStartDate, todayIso, formLinkOf, missingForApprove, dmy, dmyhm,
} from './onboardingData';
import { OnbMailTemplate, OnbMailTrigger, SEED_ONB_TEMPLATES, fillTemplate, scheduledAt, templatesFor, varsOf } from './onbMailTemplates';
import { upsertEmployeeFromOnboarding, removeEmployeeFromOnboarding } from '../components/EmployeePage';

/** Người dùng giả lập theo vai trò (prototype chưa có đăng nhập). */
export const TA_USER = 'MenTT';
export const HCNS_USER = 'Nguyễn Thị Mai';

const statusReal = (r: OnbRecord) => (r.status === 'Chờ HCNS duyệt' ? 'Pending' : 'Approved');
const ACTIVE = (r: OnbRecord) => r.status !== 'Huỷ onboard' && r.status !== 'HCNS từ chối' && r.status !== 'Cancel offer';

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
  /** Công ty ký HĐ — mặc định AEQUITAS */
  company?: string;
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
  hrSave: (id: string, patch: { data?: Partial<HandoffData>; contractType?: string; company?: string; hrNote?: string }) => void;
  /** Accept → tạo nhân viên trong Employees + gửi link form cho ứng viên. */
  hrApprove: (id: string, patch: { data?: Partial<HandoffData>; contractType?: string; company?: string; hrNote?: string }) => void;
  /** Accept nhiều ứng viên — bỏ qua phiếu thiếu trường bắt buộc. */
  hrApproveMany: (ids: string[]) => { done: string[]; skipped: { id: string; missing: string[] }[] };
  hrReject: (id: string, reason: string) => void;
  hrRejectMany: (ids: string[], reason: string) => void;
  toggleChecklist: (id: string, itemId: string) => void;
  /** Sau khi Accept */
  remindForm: (id: string) => void;
  /** Ứng viên submit form → đổ vào Employees + gửi yêu cầu IT. */
  submitForm: (id: string, data: Record<string, string>) => void;
  /** IT trả email, tên tài khoản, mật khẩu → báo MarCom. */
  itReturn: (id: string, ret: { email: string; accountName: string; password: string; by: string; note?: string }) => void;
  marcomDone: (id: string, by: string, note?: string) => void;
  /** Gửi ngay các email ngày onboard (và email trước ngày onboard còn chờ) theo mẫu → Đã onboard. */
  sendOnboardMail: (id: string, manual?: boolean) => void;
  /** Gửi ngay email bộ tài liệu trước ngày onboard (Staffing). */
  sendDocsMail: (id: string) => void;
  /** Mẫu email onboard (màn Thiết lập email Onboarding). */
  mailTemplates: OnbMailTemplate[];
  saveMailTemplate: (t: OnbMailTemplate) => void;
  removeMailTemplate: (key: string) => void;
  /** HCNS chuyển Cancel offer khi ứng viên báo không onboard → huỷ onboard. */
  cancelOffer: (id: string, reason: string) => void;
  /** HCNS đổi ngày onboard: dời lịch email 08:00, cập nhật Employees, báo ứng viên / IT / MarCom / TA. */
  changeStartDate: (id: string, date: string, reason: string) => void;
  /** HCNS sửa toàn bộ thông tin ứng viên (17 trường + email/điện thoại); đổi ngày onboard đi qua changeStartDate. */
  hrEdit: (id: string, p: { data: HandoffData; candidateEmail: string; candidatePhone: string }, reason: string) => number;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

/** Phiếu mẫu đã Accept → có sẵn nhân viên tương ứng trong Employees (chạy 1 lần). */
let seededEmployees = false;
const seedEmployees = () => {
  if (seededEmployees) return;
  seededEmployees = true;
  SEED_RECORDS.forEach((r) => {
    const code = r.account.employeeCode;
    if (!code || (r.status !== 'Đang onboard' && r.status !== 'Đã onboard')) return;
    const form = r.tasks?.find((t) => t.key === 'personalForm')?.formData || {};
    upsertEmployeeFromOnboarding(
      code,
      { fullName: r.data.fullName, division: r.block, department: r.data.department, position: r.data.position, level: r.data.level, manager: r.data.manager, joinDate: r.data.startDate, personalEmail: r.candidateEmail, phone: r.candidatePhone, techStack: r.data.techStack },
      { company: r.company, ...form, ...(r.account.companyEmail ? { companyEmail: r.account.companyEmail, userName: r.account.userName || '' } : {}) },
    );
  });
};

const nowIso = () => new Date().toISOString();
const TPL_KEY = 'imis-onb-mail-templates-v1';

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<OnbRecord[]>(() => (seedEmployees(), SEED_RECORDS));
  const recordsRef = useRef(records);
  recordsRef.current = records;
  const rc = useRc();
  const rcRef = useRef(rc);
  rcRef.current = rc;

  // Mẫu email onboard — lưu trình duyệt để giữ thiết lập khi tải lại trang (tệp đính kèm chỉ giữ tên)
  const [mailTemplates, setMailTemplates] = useState<OnbMailTemplate[]>(() => {
    try {
      const raw = localStorage.getItem(TPL_KEY);
      if (raw) return JSON.parse(raw) as OnbMailTemplate[];
    } catch {
      /* bỏ qua */
    }
    return SEED_ONB_TEMPLATES;
  });
  const tplRef = useRef(mailTemplates);
  tplRef.current = mailTemplates;
  const persistTpl = (list: OnbMailTemplate[]) => {
    tplRef.current = list;
    setMailTemplates(list);
    try {
      localStorage.setItem(TPL_KEY, JSON.stringify(list.map((t) => ({ ...t, attachments: t.attachments.map(({ url: _u, ...a }) => a) }))));
    } catch {
      /* bỏ qua */
    }
  };
  const saveMailTemplate: OnboardingContextValue['saveMailTemplate'] = (t) =>
    persistTpl(tplRef.current.some((x) => x.key === t.key) ? tplRef.current.map((x) => (x.key === t.key ? { ...t, updatedAt: nowIso(), updatedBy: HCNS_USER } : x)) : [...tplRef.current, { ...t, updatedAt: nowIso(), updatedBy: HCNS_USER }]);
  const removeMailTemplate: OnboardingContextValue['removeMailTemplate'] = (key) => persistTpl(tplRef.current.filter((x) => x.key !== key || x.system));

  /** Dòng mô tả lịch gửi của 1 nhóm email (để hiện ở cột Việc). */
  const scheduleText = (r: OnbRecord, trig: OnbMailTrigger, startDate = r.data.startDate) => {
    const list = templatesFor(tplRef.current, r.data.employeeType, trig);
    if (!list.length) return trig === 'onboardDay' ? `Không có email ngày onboard đang bật — tự chuyển Đã onboard ${dmy(startDate)}` : 'Không có email đang bật';
    return list
      .map((t) => `${t.name} → ${t.to === 'company' ? 'email công ty' : r.candidateEmail} lúc ${dmyhm(scheduledAt(t, startDate))}`)
      .join(' · ');
  };
  /** Dựng email từ mẫu cho 1 phiếu. */
  const mailFrom = (r: OnbRecord, t: OnbMailTemplate, at: string, extra: { formLink?: string } = {}): OnbMail => {
    const vars = varsOf(r, { ...extra, hcns: r.decidedBy || HCNS_USER });
    const company = r.account.companyEmail || r.tasks?.find((k) => k.key === 'itAccount')?.itRet?.email;
    const to = t.to === 'company' && company ? company : r.candidateEmail;
    return {
      at,
      kind: 'Email onboard theo mẫu',
      template: t.name + (t.to === 'company' && !company ? ' (chưa có email công ty → gửi email cá nhân)' : ''),
      subject: fillTemplate(t.subject, vars),
      body: fillTemplate(t.body, vars),
      to,
      cc: t.cc.split(',').map((x) => x.trim()).filter(Boolean),
      attachments: t.attachments.map((a) => a.name),
    };
  };

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
      .filter((r) => r.candidateId === candidateId && r.requestId === requestId && r.status !== 'Huỷ onboard' && r.status !== 'Cancel offer')
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
        company: input.company || prev.company,
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
        company: input.company || 'AEQUITAS',
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

  const hrChanges = (r: OnbRecord, p: { data?: Partial<HandoffData>; contractType?: string; company?: string }): FieldChange[] => {
    const out: FieldChange[] = p.data ? diffHandoff(r.data, { ...r.data, ...p.data }) : [];
    if (p.contractType !== undefined && p.contractType !== r.contractType) out.push({ field: 'Loại hợp đồng', from: r.contractType, to: p.contractType });
    if (p.company !== undefined && p.company !== r.company) out.push({ field: 'Công ty', from: r.company, to: p.company });
    return out;
  };

  const hrSave: OnboardingContextValue['hrSave'] = (id, p) =>
    patch(id, (r) => {
      const changes = hrChanges(r, p);
      return {
        ...r,
        data: { ...r.data, ...p.data },
        contractType: p.contractType ?? r.contractType,
        company: p.company ?? r.company,
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
  const nextEmpCode = (taken: string[] = []) => {
    const used = [...recordsRef.current.map((r) => r.account.employeeCode || ''), ...taken].map((c) => parseInt(c.replace(/\D/g, ''), 10) || 0);
    return `NV${String(Math.max(420, ...used) + 1).padStart(4, '0')}`;
  };

  /** Accept 1 phiếu: tạo nhân viên trong Employees + gửi link form cho ứng viên. */
  const acceptOne = (cur: OnbRecord, p: { data?: Partial<HandoffData>; contractType?: string; company?: string; hrNote?: string }, code: string, at: string, bulk: boolean) => {
    const data = { ...cur.data, ...p.data };
    const company = p.company || cur.company;
    upsertEmployeeFromOnboarding(code, { ...empInfo({ ...cur, data }) }, { company });
    const link = formLinkOf(cur.id);
    const staffing = data.employeeType === 'Staffing';
    const preview = { ...cur, data, company, decidedBy: HCNS_USER };
    // Email "Ngay khi HCNS Accept" theo đối tượng (mặc định: Form thông tin cá nhân)
    const acceptTpl = templatesFor(tplRef.current, data.employeeType, 'accept');
    const acceptMails: OnbMail[] = acceptTpl.length
      ? acceptTpl.map((t) => ({ ...mailFrom(preview, t, at, { formLink: link }), kind: t.key === 'FORM_LINK' ? ('Form onboarding cho ứng viên' as const) : ('Email onboard theo mẫu' as const) }))
      : [{ at, kind: 'Form onboarding cho ứng viên', subject: 'Chào mừng bạn gia nhập — vui lòng điền thông tin cá nhân trước ngày nhận việc', to: cur.candidateEmail, cc: [HCNS_MAILBOX], attachments: [], body: link }];
    patch(cur.id, (r) => {
      const changes = hrChanges(r, p);
      return {
        ...r,
        data,
        company,
        contractType: p.contractType ?? r.contractType,
        hrNote: p.hrNote ?? r.hrNote,
        status: 'Đang onboard',
        decidedBy: HCNS_USER,
        decidedAt: at,
        returnReason: undefined,
        account: { status: 'Đang tạo', employeeCode: code },
        checklist: buildChecklist(0),
        tasks: [
          { key: 'employee', status: 'Đã hoàn thành', startedAt: at, doneAt: at, doneBy: 'Hệ thống', detail: `Mã NV ${code} · Thử việc · ${company}` },
          { key: 'personalForm', status: 'Đang thực hiện', startedAt: at, formLink: link, reminders: 0, detail: `Đã gửi link form tới ${r.candidateEmail} — chờ ứng viên submit` },
          { key: 'itAccount', status: 'Chưa bắt đầu', detail: 'Tự gửi IT khi ứng viên submit form' },
          { key: 'marcom', status: 'Chưa bắt đầu', detail: 'Tự báo MarCom khi IT trả tài khoản' },
          ...(staffing ? [{ key: 'docsMail' as const, status: 'Đang thực hiện' as const, startedAt: at, detail: `Lên lịch: ${scheduleText(preview, 'before')}` }] : []),
          { key: 'onboardMail', status: 'Đang thực hiện', startedAt: at, detail: `Lên lịch: ${scheduleText(preview, 'onboardDay')}` },
        ],
        sentMails: Object.fromEntries(acceptTpl.map((t) => [t.key, at])),
        mails: [...r.mails, ...acceptMails],
        history: [
          ...r.history,
          ...(changes.length ? [{ at, by: HCNS_USER, role: 'HCNS' as const, action: 'HCNS bổ sung thông tin', changes }] : []),
          { at, by: HCNS_USER, role: 'HCNS', action: bulk ? 'Accept ứng viên (chọn nhiều)' : 'Accept ứng viên', note: [p.contractType && `Loại HĐ: ${p.contractType}`, p.hrNote].filter(Boolean).join(' · ') || undefined },
          { at, by: 'Hệ thống', role: 'Hệ thống', action: `Tạo nhân viên ${code} trong Employees (Thử việc)` },
          { at, by: 'Hệ thống', role: 'Hệ thống', action: `Gửi link form thông tin cá nhân tới ${r.candidateEmail}`, note: `${link}${acceptTpl.length ? ` · mẫu: ${acceptTpl.map((t) => t.name).join(', ')}` : ''}` },
          { at, by: 'Hệ thống', role: 'Hệ thống', action: `Lên lịch email onboard — đối tượng ${data.employeeType || 'Nội bộ'}`, note: [staffing && scheduleText(preview, 'before'), scheduleText(preview, 'onboardDay')].filter(Boolean).join(' · ') },
        ],
      };
    });
    window.setTimeout(() => dispatch(cur.id, 'auto'), 0); // ngày onboard quá gần ⇒ gửi ngay email đã tới giờ
  };

  const hrApprove: OnboardingContextValue['hrApprove'] = (id, p) => {
    const cur = recordsRef.current.find((x) => x.id === id);
    if (!cur || cur.status !== 'Chờ HCNS duyệt') return;
    acceptOne(cur, p, nextEmpCode(), nowIso(), false);
  };

  const hrApproveMany: OnboardingContextValue['hrApproveMany'] = (ids) => {
    const at = nowIso();
    const done: string[] = [];
    const skipped: { id: string; missing: string[] }[] = [];
    const codes: string[] = [];
    ids.forEach((id) => {
      const cur = recordsRef.current.find((x) => x.id === id);
      if (!cur || cur.status !== 'Chờ HCNS duyệt') return;
      const missing = missingForApprove(cur);
      if (missing.length) return void skipped.push({ id, missing });
      const code = nextEmpCode(codes);
      codes.push(code);
      acceptOne(cur, { contractType: cur.contractType || 'Thử việc' }, code, at, true);
      done.push(id);
    });
    return { done, skipped };
  };

  const rejectOne = (id: string, reason: string, at: string, bulk: boolean) =>
    patch(id, (r) =>
      r.status !== 'Chờ HCNS duyệt'
        ? r
        : {
            ...r,
            status: 'HCNS từ chối',
            returnReason: reason,
            decidedBy: HCNS_USER,
            decidedAt: at,
            hrNote: [r.hrNote, `[Từ chối] ${HCNS_USER} lúc ${new Date(at).toLocaleString('vi-VN')}${reason ? ` – Lý do: ${reason}` : ''}`].filter(Boolean).join('\n'),
            mails: [...r.mails, { at, kind: 'HCNS từ chối', subject: `[HCNS → Tuyển dụng] Từ chối onboard: ${r.data.fullName}`, to: r.taPic, cc: [HCNS_MAILBOX], attachments: [] }],
            history: [...r.history, { at, by: HCNS_USER, role: 'HCNS', action: bulk ? 'Reject ứng viên (chọn nhiều)' : 'Reject ứng viên', note: reason || '(không ghi lý do)' }],
          },
    );
  const hrReject: OnboardingContextValue['hrReject'] = (id, reason) => rejectOne(id, reason, nowIso(), false);
  const hrRejectMany: OnboardingContextValue['hrRejectMany'] = (ids, reason) => {
    const at = nowIso();
    ids.forEach((id) => rejectOne(id, reason, at, ids.length > 1));
  };

  const remindForm: OnboardingContextValue['remindForm'] = (id) => {
    const at = nowIso();
    patch(id, (r) => {
      const t = r.tasks?.find((x) => x.key === 'personalForm');
      const n = (t?.reminders || 0) + 1;
      return {
        ...r,
        tasks: setTask(r, 'personalForm', { reminders: n, detail: `Đã gửi link form tới ${r.candidateEmail} — chờ ứng viên submit (đã nhắc ${n} lần)` }),
        mails: [...r.mails, { at, kind: 'Nhắc điền form thông tin', subject: `[Nhắc] Vui lòng hoàn thiện thông tin cá nhân trước ngày nhận việc`, to: r.candidateEmail, cc: [HCNS_MAILBOX], attachments: [] }],
        history: [...r.history, { at, by: HCNS_USER, role: 'HCNS', action: `Gửi nhắc điền form (lần ${n})` }],
      };
    });
  };

  /** Ứng viên submit form → đổ dữ liệu vào Employees, đồng thời gửi yêu cầu IT. */
  const submitForm: OnboardingContextValue['submitForm'] = (id, formData) => {
    const at = nowIso();
    const r = recordsRef.current.find((x) => x.id === id);
    if (!r || r.status !== 'Đang onboard') return;
    if (r.account.employeeCode) upsertEmployeeFromOnboarding(r.account.employeeCode, empInfo(r), { ...formData, company: r.company }, 'Cập nhật thông tin cá nhân từ form trước onboard');
    const filled = FORM_FIELDS.filter((f) => (formData[f.key] || '').trim()).length;
    const itReq: ItRequest = { fullName: r.data.fullName, block: r.block, manager: r.data.manager, company: r.company, sentAt: at };
    patch(id, (x) => ({
      ...x,
      candidatePhone: formData.phone || x.candidatePhone,
      tasks: setTask(
        { ...x, tasks: setTask(x, 'personalForm', { status: 'Đã hoàn thành', doneAt: at, doneBy: x.data.fullName, formData, detail: `Đã nhận ${filled}/${FORM_FIELDS.length} trường — đã cập nhật hồ sơ Employees` }) },
        'itAccount',
        { status: 'Đang thực hiện', startedAt: at, itReq, detail: `Đã gửi yêu cầu tới ${IT_MAILBOX} — chờ IT trả thông tin tài khoản` },
      ),
      mails: [...x.mails, { at, kind: 'Mail IT cấp tài khoản', subject: `[Onboarding] Yêu cầu cấp tài khoản: ${x.data.fullName} – ${x.block} – ${x.company}`, to: IT_MAILBOX, cc: [HCNS_MAILBOX], attachments: [] }],
      history: [
        ...x.history,
        { at, by: x.data.fullName, role: 'Ứng viên', action: 'Submit form thông tin cá nhân', note: `${filled}/${FORM_FIELDS.length} trường → hồ sơ ${x.account.employeeCode}` },
        { at, by: 'Hệ thống', role: 'Hệ thống', action: `Gửi yêu cầu cấp tài khoản tới ${IT_MAILBOX}`, note: `Họ tên: ${itReq.fullName} · Khối: ${itReq.block} · Cấp trên trực tiếp: ${itReq.manager} · Công ty: ${itReq.company}` },
      ],
    }));
  };

  /** IT trả thông tin tài khoản → ghi hồ sơ, báo MarCom. */
  const itReturn: OnboardingContextValue['itReturn'] = (id, ret) => {
    const at = nowIso();
    const r = recordsRef.current.find((x) => x.id === id);
    if (!r) return;
    const full: ItReturn = { ...ret, at };
    if (r.account.employeeCode) upsertEmployeeFromOnboarding(r.account.employeeCode, empInfo(r), { companyEmail: ret.email, userName: ret.accountName }, 'IT cấp tài khoản');
    patch(id, (x) => ({
      ...x,
      account: { ...x.account, status: 'Đã tạo', userName: ret.accountName, companyEmail: ret.email },
      tasks: setTask(
        { ...x, tasks: setTask(x, 'itAccount', { status: 'Đã hoàn thành', doneAt: at, doneBy: ret.by, itRet: full, detail: `${ret.email} · tài khoản ${ret.accountName}` }) },
        'marcom',
        { status: 'Đang thực hiện', startedAt: at, detail: `Đã báo ${MARCOM_MAILBOX} — chờ MarCom chuẩn bị Welcome` },
      ),
      mails: [
        ...x.mails,
        { at, kind: 'IT trả thông tin tài khoản', subject: `[IT] Đã cấp tài khoản cho ${x.data.fullName}`, to: HCNS_MAILBOX, cc: [IT_MAILBOX], attachments: [] },
        { at, kind: 'Thông báo MarCom', subject: `[Onboarding] Nhân sự mới ${x.data.fullName} nhận việc ${x.data.startDate.split('-').reverse().join('/')} — chuẩn bị Welcome`, to: MARCOM_MAILBOX, cc: [HCNS_MAILBOX], attachments: [] },
      ],
      history: [
        ...x.history,
        { at, by: ret.by, role: 'IT', action: 'Trả thông tin tài khoản', note: [`Email: ${ret.email}`, `Tài khoản: ${ret.accountName}`, 'Mật khẩu: ••••••', ret.note].filter(Boolean).join(' · ') },
        { at, by: 'Hệ thống', role: 'Hệ thống', action: `Cập nhật email & tài khoản vào hồ sơ ${x.account.employeeCode} · báo MarCom` },
      ],
    }));
  };

  const marcomDone: OnboardingContextValue['marcomDone'] = (id, by, note) => {
    const at = nowIso();
    patch(id, (x) => ({
      ...x,
      tasks: setTask(x, 'marcom', { status: 'Đã hoàn thành', doneAt: at, doneBy: by, detail: note || 'Đã chuẩn bị Welcome Onboard' }),
      history: [...x.history, { at, by, role: 'MarCom', action: 'Đã chuẩn bị Welcome Onboard', note: note || undefined }],
    }));
  };

  const toggleChecklist: OnboardingContextValue['toggleChecklist'] = (id, itemId) =>
    patch(id, (r) => ({
      ...r,
      checklist: r.checklist.map((c) => (c.id === itemId ? (c.done ? { ...c, done: false, doneBy: undefined, doneAt: undefined } : { ...c, done: true, doneBy: HCNS_USER, doneAt: nowIso() }) : c)),
    }));

  /**
   * Gửi email onboard theo mẫu (trước ngày onboard / ngày onboard) cho 1 phiếu Đang onboard.
   * auto: chỉ gửi mẫu đã tới giờ · docs: gửi ngay email trước ngày onboard · all: gửi ngay tất cả còn chờ.
   * Gửi xong mọi email ngày onboard ⇒ phiếu Đã onboard, Stage Onboarded.
   */
  const dispatch = (id: string, mode: 'auto' | 'docs' | 'all') => {
    const r = recordsRef.current.find((x) => x.id === id);
    if (!r || r.status !== 'Đang onboard' || !r.data.startDate) return;
    const now = nowIso();
    const sent = r.sentMails || {};
    const before = templatesFor(tplRef.current, r.data.employeeType, 'before');
    const day = templatesFor(tplRef.current, r.data.employeeType, 'onboardDay');
    const due = (t: OnbMailTemplate) => new Date(scheduledAt(t, r.data.startDate)).toISOString() <= now;
    const pick = [...before, ...day].filter((t) => !sent[t.key] && (mode === 'all' || (mode === 'docs' ? t.trigger === 'before' : due(t))));
    // Không có email ngày onboard nào bật ⇒ vẫn chuyển Đã onboard khi tới ngày
    const noDayMail = !day.length && (mode === 'all' || new Date(`${r.data.startDate}T08:00:00`).toISOString() <= now);
    if (!pick.length && !noDayMail) return;
    const stamp = (t: OnbMailTemplate) => {
      const s0 = scheduledAt(t, r.data.startDate);
      return mode === 'auto' && new Date(s0).toISOString() >= (r.decidedAt || '') ? s0 : now;
    };
    const mails = pick.map((t) => mailFrom(r, t, stamp(t)));
    const nextSent = { ...sent, ...Object.fromEntries(pick.map((t, i) => [t.key, mails[i].at])) };
    const docsDone = before.every((t) => nextSent[t.key]);
    const dayDone = day.every((t) => nextSent[t.key]);
    const finish = dayDone && (day.length > 0 || noDayMail);
    const lastAt = mails.length ? mails[mails.length - 1].at : now;
    // cập nhật ref ngay để job không gửi trùng
    recordsRef.current = recordsRef.current.map((x) => (x.id === id ? { ...x, sentMails: nextSent, status: finish ? 'Đã onboard' : x.status } : x));
    const how = mode === 'auto' ? 'Job gửi theo lịch' : 'Gửi thủ công (mô phỏng)';
    patch(id, (x) => {
      let tasks = x.tasks || [];
      const upd = (k: TaskKey, t: Partial<OnbTask>) => (tasks = tasks.map((y) => (y.key === k ? { ...y, ...t } : y)));
      const of = (trig: OnbMailTrigger) => mails.filter((m, i) => pick[i].trigger === trig).map((m) => `${m.template} → ${m.to}`).join(' · ');
      if (r.data.employeeType === 'Staffing' && docsDone && pick.some((t) => t.trigger === 'before'))
        upd('docsMail', { status: 'Đã hoàn thành', doneAt: lastAt, doneBy: 'Hệ thống', detail: `Đã gửi: ${of('before')}` });
      if (finish) upd('onboardMail', { status: 'Đã hoàn thành', doneAt: lastAt, doneBy: 'Hệ thống', detail: day.length ? `Đã gửi: ${of('onboardDay') || 'các email ngày onboard'}` : 'Không có email ngày onboard đang bật' });
      else if (pick.some((t) => t.trigger === 'onboardDay')) upd('onboardMail', { detail: `Đã gửi: ${of('onboardDay')} · còn chờ: ${day.filter((t) => !nextSent[t.key]).map((t) => t.name).join(', ')}` });
      return {
        ...x,
        status: finish ? 'Đã onboard' : x.status,
        sentMails: nextSent,
        tasks,
        mails: [...x.mails, ...mails],
        history: [
          ...x.history,
          ...mails.map((m) => ({ at: m.at, by: 'Hệ thống', role: 'Hệ thống' as const, action: `Gửi email "${m.template}" tới ${m.to}`, note: `${how}${m.attachments.length ? ` · đính kèm ${m.attachments.length} tệp` : ''}` })),
          ...(finish ? [{ at: lastAt, by: 'Hệ thống', role: 'Hệ thống' as const, action: 'Hoàn tất email ngày onboard → Đã onboard', note: 'Stage Onboarded' }] : []),
        ],
      };
    });
    if (finish) {
      setStage(r.candidateId, r.requestId, 'Onboarded');
      if (r.account.employeeCode) rcRef.current.setCandidateHr(r.candidateId, { status: 'Probation', employeeCode: r.account.employeeCode, employeeName: r.data.fullName, startDate: r.data.startDate });
    }
  };
  const sendOnboardMail: OnboardingContextValue['sendOnboardMail'] = (id, manual = false) => dispatch(id, manual ? 'all' : 'auto');
  const sendDocsMail: OnboardingContextValue['sendDocsMail'] = (id) => dispatch(id, 'docs');

  // Job gửi email onboard theo lịch: chạy khi mở app và mỗi phút
  useEffect(() => {
    const tick = () => recordsRef.current.filter((r) => r.status === 'Đang onboard').forEach((r) => dispatch(r.id, 'auto'));
    tick();
    const t = window.setInterval(tick, 60000);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** HCNS Cancel offer: ứng viên báo không onboard → dừng luồng, huỷ lịch email, thu hồi hồ sơ / tài khoản. */
  const cancelOffer: OnboardingContextValue['cancelOffer'] = (id, reason) => {
    const r = recordsRef.current.find((x) => x.id === id);
    if (!r || r.status !== 'Đang onboard') return;
    const at = nowIso();
    const t = (k: TaskKey) => r.tasks?.find((x) => x.key === k)?.status || 'Chưa bắt đầu';
    const toIt = t('itAccount') !== 'Chưa bắt đầu';
    const toMc = t('marcom') !== 'Chưa bắt đầu';
    const hasAcc = r.account.status === 'Đã tạo';
    const subject = `[HCNS] Cancel offer — ${r.data.fullName} không onboard ngày ${dmy(r.data.startDate)}`;
    const mails: OnbMail[] = [
      { at, kind: 'Cancel offer', subject, to: r.taPic, cc: [HCNS_MAILBOX], attachments: [] },
      ...(toIt ? [{ at, kind: 'Cancel offer' as const, subject: `${subject}${hasAcc ? ' — đề nghị khoá tài khoản ' + (r.account.companyEmail || '') : ' — huỷ yêu cầu cấp tài khoản'}`, to: IT_MAILBOX, cc: [HCNS_MAILBOX], attachments: [] }] : []),
      ...(toMc ? [{ at, kind: 'Cancel offer' as const, subject: `${subject} — huỷ Welcome Onboard`, to: MARCOM_MAILBOX, cc: [HCNS_MAILBOX], attachments: [] }] : []),
    ];
    patch(id, (x) => ({
      ...x,
      status: 'Cancel offer',
      cancelReason: reason,
      cancelledBy: HCNS_USER,
      cancelledAt: at,
      tasks: (x.tasks || []).map((k) =>
        k.status === 'Đã hoàn thành' ? k : { ...k, detail: k.key === 'onboardMail' || k.key === 'docsMail' ? 'Đã huỷ lịch gửi email onboard' : `${k.detail || ''} — dừng do Cancel offer` },
      ),
      hrNote: [x.hrNote, `[Cancel offer] ${HCNS_USER} lúc ${new Date(at).toLocaleString('vi-VN')} – Lý do: ${reason}`].filter(Boolean).join('\n'),
      mails: [...x.mails, ...mails],
      history: [
        ...x.history,
        { at, by: HCNS_USER, role: 'HCNS', action: 'Cancel offer — huỷ onboard', note: reason },
        {
          at, by: 'Hệ thống', role: 'Hệ thống', action: 'Huỷ onboard',
          note: [
            'Huỷ lịch email onboard',
            r.account.employeeCode && `xoá hồ sơ ${r.account.employeeCode} khỏi Employees`,
            toIt && (hasAcc ? 'báo IT khoá tài khoản' : 'báo IT huỷ yêu cầu'),
            toMc && 'báo MarCom huỷ Welcome',
            'báo Tuyển dụng',
            'Stage → Offer Rejected',
          ].filter(Boolean).join(' · '),
        },
      ],
    }));
    setStage(r.candidateId, r.requestId, 'Offer Rejected');
    rcRef.current.setCandidateHr(r.candidateId, { status: 'None' });
    if (r.account.employeeCode) removeEmployeeFromOnboarding(r.account.employeeCode);
  };

  const changeStartDate: OnboardingContextValue['changeStartDate'] = (id, date, reason) => {
    const r = recordsRef.current.find((x) => x.id === id);
    if (!r || !canChangeStartDate(r) || !date || date === r.data.startDate) return;
    const at = nowIso();
    const from = r.data.startDate;
    const accepted = r.status === 'Đang onboard';
    const t = (k: TaskKey) => r.tasks?.find((x) => x.key === k)?.status || 'Chưa bắt đầu';
    const toIt = accepted && t('itAccount') !== 'Chưa bắt đầu';
    const toMc = accepted && t('marcom') !== 'Chưa bắt đầu';
    const subject = `[HCNS] Đổi ngày onboard ${r.data.fullName}: ${dmy(from)} → ${dmy(date)}`;
    const mails: OnbMail[] = [
      ...(accepted
        ? [{ at, kind: 'Đổi ngày onboard' as const, subject: `Xác nhận ngày nhận việc mới: ${dmy(date)} — ${r.company}`, to: r.candidateEmail, cc: [HCNS_MAILBOX], attachments: [] }]
        : []),
      { at, kind: 'Đổi ngày onboard', subject, to: r.taPic, cc: [HCNS_MAILBOX], attachments: [] },
      ...(toIt ? [{ at, kind: 'Đổi ngày onboard' as const, subject: `${subject} — cập nhật hạn cấp tài khoản`, to: IT_MAILBOX, cc: [HCNS_MAILBOX], attachments: [] }] : []),
      ...(toMc ? [{ at, kind: 'Đổi ngày onboard' as const, subject: `${subject} — dời Welcome Onboard`, to: MARCOM_MAILBOX, cc: [HCNS_MAILBOX], attachments: [] }] : []),
    ];
    const notified = [accepted && 'ứng viên', 'Tuyển dụng', toIt && 'IT', toMc && 'MarCom'].filter(Boolean).join(', ');
    patch(id, (x) => ({
      ...x,
      data: { ...x.data, startDate: date },
      dateChanges: [...(x.dateChanges || []), { at, by: HCNS_USER, from, to: date, reason }],
      tasks: (x.tasks || []).map((k) =>
        (k.key === 'onboardMail' || k.key === 'docsMail') && k.status !== 'Đã hoàn thành' ? { ...k, detail: `Lên lịch: ${scheduleText(x, k.key === 'docsMail' ? 'before' : 'onboardDay', date)}` } : k,
      ),
      mails: [...x.mails, ...mails],
      history: [
        ...x.history,
        {
          at, by: HCNS_USER, role: 'HCNS', action: 'Đổi ngày onboard', note: reason,
          changes: [{ field: 'Ngày onboard', from: dmy(from), to: dmy(date) }],
        },
        {
          at, by: 'Hệ thống', role: 'Hệ thống', action: 'Cập nhật theo ngày onboard mới',
          note: [accepted && `Dời lịch email onboard theo ngày mới ${dmy(date)}`, r.account.employeeCode && `cập nhật ngày vào làm hồ sơ ${r.account.employeeCode}`, `báo ${notified}`].filter(Boolean).join(' · '),
        },
      ],
    }));
    if (r.account.employeeCode) upsertEmployeeFromOnboarding(r.account.employeeCode, empInfo({ ...r, data: { ...r.data, startDate: date } }), { joinDate: date }, `Đổi ngày onboard ${dmy(from)} → ${dmy(date)}`);
  };

  const hrEdit: OnboardingContextValue['hrEdit'] = (id, p, reason) => {
    const r = recordsRef.current.find((x) => x.id === id);
    if (!r || !canChangeStartDate(r)) return 0;
    const at = nowIso();
    const { startDate, ...rest } = p.data;
    const changes: FieldChange[] = diffHandoff(r.data, { ...r.data, ...rest });
    if (p.candidateEmail !== r.candidateEmail) changes.push({ field: 'Email cá nhân', from: r.candidateEmail, to: p.candidateEmail });
    if (p.candidatePhone !== r.candidatePhone) changes.push({ field: 'Điện thoại', from: r.candidatePhone, to: p.candidatePhone });
    if (changes.length) {
      const accepted = r.status === 'Đang onboard';
      const itFields = ['Họ tên ứng viên', 'Bộ phận', 'Quản lý trực tiếp'];
      const toIt = accepted && (r.tasks?.find((x) => x.key === 'itAccount')?.status || 'Chưa bắt đầu') === 'Đang thực hiện' && changes.some((c) => itFields.includes(c.field));
      const subject = `[HCNS] Cập nhật thông tin onboard ${p.data.fullName} — ${changes.length} trường thay đổi`;
      patch(id, (x) => ({
        ...x,
        data: { ...x.data, ...rest },
        candidateEmail: p.candidateEmail,
        candidatePhone: p.candidatePhone,
        mails: [
          ...x.mails,
          { at, kind: 'Cập nhật thông tin onboard', subject, to: x.taPic, cc: [HCNS_MAILBOX], attachments: [] },
          ...(toIt ? [{ at, kind: 'Cập nhật thông tin onboard' as const, subject: `${subject} — cập nhật yêu cầu cấp tài khoản`, to: IT_MAILBOX, cc: [HCNS_MAILBOX], attachments: [] }] : []),
        ],
        history: [...x.history, { at, by: HCNS_USER, role: 'HCNS', action: 'HCNS sửa thông tin ứng viên', note: reason || undefined, changes }],
      }));
      if (r.account.employeeCode) {
        const name = p.data.fullName.trim().toUpperCase();
        const words = name.split(/\s+/).filter(Boolean);
        upsertEmployeeFromOnboarding(
          r.account.employeeCode,
          empInfo(r),
          {
            fullName: name, surname: words.slice(0, -1).join(' '), givenName: words[words.length - 1] || '',
            department: p.data.department, position: p.data.position, level: p.data.level, manager: p.data.manager.toUpperCase(), techStack: p.data.techStack,
            personalEmail: p.candidateEmail, phone: p.candidatePhone,
          },
          'HCNS sửa thông tin ứng viên (Onboarding Request)',
        );
      }
    }
    if (startDate && startDate !== r.data.startDate) {
      // ref mới ngay để email xác nhận ngày mới đi tới email / họ tên vừa sửa
      recordsRef.current = recordsRef.current.map((x) => (x.id === id ? { ...x, data: { ...x.data, ...rest }, candidateEmail: p.candidateEmail, candidatePhone: p.candidatePhone } : x));
      changeStartDate(id, startDate, reason || 'HCNS sửa thông tin ứng viên');
      return changes.length + 1;
    }
    return changes.length;
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
      hrApproveMany,
      hrReject,
      hrRejectMany,
      toggleChecklist,
      remindForm,
      submitForm,
      itReturn,
      marcomDone,
      sendOnboardMail,
      sendDocsMail,
      mailTemplates,
      saveMailTemplate,
      removeMailTemplate,
      cancelOffer,
      changeStartDate,
      hrEdit,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [records, mailTemplates],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within an OnboardingProvider');
  return ctx;
}
