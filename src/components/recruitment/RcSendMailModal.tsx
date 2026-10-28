/**
 * Popup "Gửi mail" ứng viên (RecruitmentSendMailPopup.razor) — 10 loại mail, tab Soạn mail / Lịch sử gửi mail.
 * Mời PV = tạo/cập nhật lịch Outlook; Offer = đính kèm Offer Letter .docx; "Gửi thông tin sang HCNS" = form 17 trường ngay trong popup.
 */
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Bold, Download, Eye, History, Info, Italic, List, Mail, Paperclip, RotateCcw, Send, Underline, Upload, X } from 'lucide-react';
import { Btn, erp, FieldTable, FolderTabs } from '../erp/Erp';
import { Modal, useToast } from '../../marcom/MarcomUi';
import { useRc } from '../../recruitment/rc/RcContext';
import { MAIL_KINDS, Stage, MEETING_ROOMS, EMPLOYEES, RECRUITMENT_MAILBOX, TA_OPTIONS, money, dmy, todayIso } from '../../recruitment/rc/rcData';
import { useOnboarding } from '../../onboarding/OnboardingContext';
import { HCNS_MAILBOX } from '../../onboarding/onboardingData';
import { HandoffData } from '../../onboarding/onboardingData';
import { RcHcnsFields, HcnsDraft, buildHcnsDraft, hcnsErrors, hcnsRecipients, hcnsVars, hcnsUpdateBlock } from './RcHcnsForm';
import { FormField, StageBadge, useConfirm } from './rcUi';
import { RcMailHistory } from './RcMailHistory';
import {
  isInterviewKind, isOfferKind, isThankKind, roundOf, isStaffingKind, needsApplication, resolveTemplate, fillVars, stageAfter, makeEventId, activeInvites,
  viMoneyWords, enMoneyWords, staffEmail, enDate, eventDate,
} from './rcMailRules';

type Kind = (typeof MAIL_KINDS)[number];
const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
const OFFER_PICK: Stage[] = ['Offering', 'Offer Accepted', 'Onboarded'];

interface Form {
  position: string;
  contact: string;
  date: string;
  time: string;
  duration: number | '';
  attachCv: boolean;
  location: string;
  room: string;
  onlyFree: boolean;
  link: string;
  interviewers: string[];
  externalEmails: string;
  department: string;
  customer: string;
  dayFrom: string;
  dayTo: string;
  morning: string;
  afternoon: string;
  reportTo: string;
  workLocation: string;
  startDate: string;
  probationMonths: number | '';
  salary: number | '';
  probationPercent: number | '';
  directors: string[];
  offerFile: string;
  failStage: Stage;
  cancelUpcoming: boolean;
  cancelReason: string;
  cancelNote: string;
}
const blankForm = (): Form => ({
  position: '', contact: '', date: '', time: '', duration: 60, attachCv: true, location: '', room: '', onlyFree: false, link: '', interviewers: [], externalEmails: '',
  department: '', customer: '', dayFrom: 'Thứ 2', dayTo: 'Thứ 6', morning: '08:00 - 12:00', afternoon: '13:30 - 17:30', reportTo: '', workLocation: '', startDate: '',
  probationMonths: 2, salary: '', probationPercent: 90, directors: [], offerFile: '', failStage: 'TA Screen_Rejected', cancelUpcoming: true, cancelReason: '', cancelNote: '',
});

const taContact = (ta: string) => `${ta} - 09${String((ta.length * 7919 + ta.charCodeAt(0) * 131) % 100000000).padStart(8, '0').replace(/(\d{2})(\d{3})(\d{3})/, '$1 $2 $3')}`;
const noAccent = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
const num = (v: string): number | '' => (v === '' ? '' : Number(v));

/** TagBox đơn giản: chọn nhiều nhân sự. */
const TagPicker: React.FC<{ values: string[]; options: string[]; onChange: (v: string[]) => void; placeholder: string; invalid?: boolean }> = ({ values, options, onChange, placeholder, invalid }) => (
  <div className={`min-h-8 border rounded-[3px] px-1 py-0.5 flex flex-wrap gap-1 items-center bg-white ${invalid ? 'border-rose-400' : 'border-slate-300'}`}>
    {values.map((v) => (
      <span key={v} className="inline-flex items-center gap-1 h-6 px-1.5 bg-[#eaf2fc] border border-[#b9d3f0] rounded-[3px] text-[12px] text-[#1f5fa8]">
        {v}
        <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="cursor-pointer hover:text-rose-600">
          <X size={11} />
        </button>
      </span>
    ))}
    <select value="" onChange={(e) => e.target.value && onChange([...values, e.target.value])} className="flex-1 min-w-[120px] h-6 text-[12px] outline-none bg-transparent cursor-pointer text-slate-500">
      <option value="">{placeholder}</option>
      {options.filter((o) => !values.includes(o)).map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  </div>
);

const Bar: React.FC<{ tone: 'info' | 'warn' | 'bad'; children: React.ReactNode }> = ({ tone, children }) => {
  const cls = tone === 'info' ? 'bg-[#eef4fb] border-[#b9d3f0] text-[#1e3a5f]' : tone === 'warn' ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-rose-50 border-rose-300 text-rose-700';
  const Icon = tone === 'info' ? Info : AlertTriangle;
  return (
    <div className={`flex gap-2 border rounded-[4px] px-3 py-2 text-[12px] ${cls}`}>
      <Icon size={14} className="shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
};

export const RcSendMailModal: React.FC<{
  candidateId: string;
  onClose: () => void;
  onDone?: (msg: string) => void;
  /** Mở sẵn loại mail / lượt ứng tuyển (vd từ màn Onboarding: "Gửi cập nhật"). */
  initialKind?: Kind;
  applicationId?: string;
}> = ({ candidateId, onClose, onDone, initialKind, applicationId }) => {
  const rc = useRc();
  const onb = useOnboarding();
  const { toast, toastNode } = useToast();
  const { ask, confirmNode } = useConfirm();
  const cand = rc.candidate(candidateId);
  const apps = rc.appsOfCandidate(candidateId);

  // Chọn lượt: điền ô đang trống; Người liên hệ luôn ghi đè bằng TA PIC
  const prefill = (id: string, base: Form): Form => {
    const a = apps.find((x) => x.id === id);
    const r = a ? rc.request(a.requestId) : undefined;
    if (!r) return base;
    return {
      ...base,
      position: base.position || r.position,
      department: base.department || r.block,
      workLocation: base.workLocation || r.workLocation,
      salary: base.salary === '' && r.isStaffing && r.salary !== '' ? r.salary : base.salary,
      contact: r.taPics[0] ? taContact(r.taPics[0]) : base.contact,
      failStage: a?.stage === 'HM Screen_Passed' ? 'HM Screen_Rejected' : 'TA Screen_Rejected',
    };
  };

  const firstApp = applicationId || (apps.length === 1 ? apps[0].id : '');
  const [tab, setTab] = useState<'compose' | 'history'>('compose');
  const [kind, setKind] = useState<Kind>(initialKind || 'Mời phỏng vấn - Vòng 1');
  const [appId, setAppId] = useState(firstApp);
  const [f, setF] = useState<Form>(() => prefill(firstApp, blankForm()));
  const [preview, setPreview] = useState<{ subject: string; body: string; key: number } | null>(null);
  const bodyRef = useRef('');
  const [showErr, setShowErr] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [hd, setHd] = useState<HcnsDraft | null>(() => {
    const a = apps.find((x) => x.id === firstApp);
    if (initialKind !== 'Gửi thông tin sang HCNS' || !a || !cand) return null;
    return buildHcnsDraft(cand, a, rc.request(a.requestId), rc.mailLogs, onb.lastSnapshot(candidateId, a.requestId));
  });

  if (!cand) return null;
  const app = apps.find((a) => a.id === appId);
  const req = app ? rc.request(app.requestId) : undefined;
  const interview = isInterviewKind(kind);
  const offer = isOfferKind(kind);
  const thank = isThankKind(kind);
  const hcns = kind === 'Gửi thông tin sang HCNS';
  const cancelOnb = kind === 'Báo hủy Onboard sang HCNS';
  const round = roundOf(kind);
  const online = /online|teams/i.test(f.location);
  const room = MEETING_ROOMS.find((r) => r.name === f.room);
  const upcoming = activeInvites(rc.mailLogs, candidateId, appId || undefined)[0];
  const sameRoundInvite = interview ? rc.mailLogs.filter((m) => m.applicationId === appId && appId && m.kind.replace(' (Staffing)', '') === kind.replace(' (Staffing)', '') && m.ok && !m.cancelled && m.eventId).pop() : undefined;
  const hadR2 = rc.mailLogs.some((m) => m.candidateId === candidateId && (!appId || m.applicationId === appId) && m.ok && m.kind.startsWith('Mời phỏng vấn - Vòng 2'));
  const thankStage: Stage = kind === 'Thư cảm ơn - fail CV' ? f.failStage : hadR2 ? 'Intv 2_Failed' : 'Intv 1_Failed';
  const onbRecord = app ? onb.activeFor(candidateId, app.requestId) : undefined;
  const probSalary = f.salary === '' || f.probationPercent === '' ? '' : Math.round((Number(f.salary) * Number(f.probationPercent)) / 100);
  const ta = req?.taPics[0] || cand.taInput;

  const upd = (p: Partial<Form>) => {
    setF((x) => ({ ...x, ...p }));
    setPreview(null);
  };
  // Prefill form HCNS (GetHcnsHandoffDraftAsync) mỗi khi chọn loại HCNS hoặc đổi lượt
  const loadHcns = (id: string) => {
    const a = apps.find((x) => x.id === id);
    const r = a ? rc.request(a.requestId) : undefined;
    setHd(a ? buildHcnsDraft(cand!, a, r, rc.mailLogs, onb.lastSnapshot(candidateId, a.requestId)) : null);
  };
  const updHcns = (p: Partial<HandoffData>) => {
    setHd((x) => (x ? { ...x, data: { ...x.data, ...p } } : x));
    setPreview(null);
  };
  const changeApp = (id: string, k: Kind = kind) => {
    setAppId(id);
    setF((x) => prefill(id, x));
    setPreview(null);
    if (k === 'Gửi thông tin sang HCNS') loadHcns(id);
  };
  const changeKind = (k: Kind) => {
    setKind(k);
    setPreview(null);
    setShowErr(false);
    setAlertMsg('');
    let id = appId;
    if ((k === 'Gửi thông tin sang HCNS' || k === 'Báo hủy Onboard sang HCNS') && !appId) {
      const pick = apps.find((a) => OFFER_PICK.includes(a.stage));
      if (pick) id = pick.id;
    }
    if (id !== appId) changeApp(id, k);
    else if (k === 'Gửi thông tin sang HCNS') loadHcns(id);
  };

  // ---------------------------------------------------------------- lỗi
  const fe: Record<string, string> = {};
  const req1 = (k: keyof Form, empty: boolean) => empty && (fe[k] = 'Bắt buộc');
  if (needsApplication(kind) && !appId) fe.app = 'Vui lòng chọn ID Request cho loại mail này';
  if (interview) {
    req1('position', !f.position.trim());
    req1('contact', !f.contact.trim());
    req1('date', !f.date);
    req1('time', !f.time);
    req1('location', !f.location.trim());
    if (f.duration === '' || Number(f.duration) < 15 || Number(f.duration) > 480) fe.duration = 'Từ 15 đến 480 phút';
  }
  if (offer) {
    req1('position', !f.position.trim());
    req1('department', !f.department.trim());
    if (isStaffingKind(kind)) req1('customer', !f.customer.trim());
    req1('startDate', !f.startDate);
    if (f.salary === '' || Number(f.salary) <= 0) fe.salary = 'Phải lớn hơn 0';
    if (!f.directors.length) fe.directors = 'Chọn Giám đốc khối';
  }
  if (cancelOnb) req1('cancelReason', !f.cancelReason.trim());
  const hErr = hcns && hd ? hcnsErrors(hd.data, cand) : {};
  const err = (k: string) => (showErr ? fe[k] : undefined);

  // ---------------------------------------------------------------- nội dung
  const vars: Record<string, string> = {
    CandidateName: cand.fullName, CandidateNameVi: cand.fullName, CandidateNameEn: noAccent(cand.fullName), Position: f.position, Department: f.department, Division: f.department,
    Level: req?.level || '', TechStack: req?.skill || cand.techStack, InterviewRound: round === 2 ? 'second' : 'first', InterviewDate: enDate(f.date), InterviewTime: f.time,
    InterviewLocation: f.location, MeetingRoom: f.room || '—', MapLink: online ? '' : f.link, TeamsLink: online ? f.link : '', Interviewers: f.interviewers.join(', ') || '—', ContactPerson: f.contact,
    ReportTo: f.reportTo, StartDate: dmy(f.startDate), ProbationMonths: String(f.probationMonths),
    ProbationBlock: Number(f.probationMonths) > 0 ? `Probation: ${f.probationMonths} month(s), ${f.probationPercent}% of official salary (${money(probSalary)}).` : '',
    OfficialSalary: money(f.salary), OfficialSalaryInWords: viMoneyWords(f.salary), OfficialSalaryInWordsEn: enMoneyWords(f.salary), ProbationSalaryPercent: String(f.probationPercent),
    ProbationSalary: money(probSalary), WorkLocation: f.workLocation, OfferDate: dmy(todayIso()), TaName: ta, RequestCode: req?.code || '', CancelReason: f.cancelReason, CancelNote: f.cancelNote || '—',
  };
  const render = () => {
    const t = resolveTemplate(kind, rc.templates);
    if (!t) return null;
    if (hcns && hd) {
      const v = hcnsVars(hd.data, cand, req);
      return { subject: `${hd.prev ? '[Cập nhật] ' : ''}${fillVars(t.title, v)}`, body: `${hd.prev ? hcnsUpdateBlock(hd.prev, hd.data) : ''}${fillVars(t.content, v)}` };
    }
    let body = fillVars(t.content, vars);
    if (interview && online) body = body.replace('(please check the map here', '(please join the meeting here');
    if (offer) body = body.replace(/Department:/g, 'Division:');
    return { subject: fillVars(t.title, vars), body };
  };
  const external = f.externalEmails.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
  const offerDoc = f.offerFile || `Offer Letter - ${noAccent(cand.fullName)}.docx`;
  const recipients = (): { to: string; cc: string[]; attachments: string[]; extra: { label: string; value: string }[] } => {
    if (interview)
      return {
        to: cand.email,
        cc: [...f.interviewers.map(staffEmail), ...external, RECRUITMENT_MAILBOX],
        attachments: f.attachCv && cand.cvFile ? [cand.cvFile] : [],
        extra: [
          { label: 'Organizer', value: 'Hộp thư TA (Setting Email:TA)' },
          { label: 'Phòng (resource)', value: f.room || '—' },
          { label: 'Lịch Outlook', value: sameRoundInvite ? 'Cập nhật (PATCH) lịch đã gửi trước' : 'Tạo lịch mới' },
        ],
      };
    if (offer) return { to: cand.email, cc: [RECRUITMENT_MAILBOX, ...f.directors.map(staffEmail)], attachments: [offerDoc], extra: [] };
    if (hcns && hd) return hcnsRecipients(hd.data, cand, req);
    if (cancelOnb) return { to: HCNS_MAILBOX, cc: req?.taPics || [], attachments: [], extra: [] };
    return { to: cand.email, cc: [], attachments: [], extra: [] };
  };

  const check = (): boolean => {
    if (Object.keys(fe).length || Object.keys(hErr).length) {
      setShowErr(true);
      setAlertMsg(fe.app || (offer ? 'Vui lòng nhập đầy đủ các trường bắt buộc (đánh dấu *), chọn Giám đốc khối và Lương chính thức phải lớn hơn 0.' : 'Vui lòng nhập đầy đủ các trường bắt buộc (đánh dấu *).'));
      return false;
    }
    if (!cancelOnb && !cand.email.trim()) {
      setAlertMsg('Ứng viên chưa có email');
      return false;
    }
    if (!render()) {
      setAlertMsg('Không tìm thấy template email đang bật');
      return false;
    }
    setAlertMsg('');
    return true;
  };

  const doPreview = () => {
    if (!check()) return;
    const c = render()!;
    bodyRef.current = c.body;
    setPreview({ ...c, key: Date.now() });
  };

  const send = async () => {
    if (!check()) return;
    if (interview && room?.busy && !(await ask(`Phòng ${room.name} đã có lịch: ${room.busy}. Phòng có thể tự từ chối lời mời. Vẫn gửi?`))) return;
    const content = preview ? { subject: preview.subject, body: bodyRef.current } : render()!;
    if (hcns && hd && app && req) {
      // Gửi mail + Stage → Offer Accepted (ngày onboard ≤ hôm nay → Onboarded) + snapshot + đồng bộ Onboarding Request
      onb.submitHandoff(
        {
          candidateId, candidateEmail: cand.email, candidatePhone: cand.phone, candidateSource: cand.source, cvFile: cand.cvFile,
          requestId: req.id, block: req.block, taPic: req.taPics[0] || '', taPic2: req.taPics[1] || '', data: hd.data,
        },
        content,
      );
    } else if (cancelOnb && onbRecord) {
      onb.cancelOnboard(onbRecord.id, f.cancelReason.trim(), f.cancelNote.trim(), content);
    } else {
      const r = recipients();
      rc.addMail({
        candidateId, applicationId: appId, kind, subject: content.subject, body: content.body, to: r.to, cc: r.cc, attachments: r.attachments, ok: true,
        eventId: interview ? makeEventId(appId, round, f.date, f.time) : undefined,
      });
      const st = stageAfter(kind, thankStage);
      if (st) app ? rc.setAppStage(app.id, st, true) : rc.setCandidateStage(candidateId, st);
      if (thank && f.cancelUpcoming && upcoming) rc.cancelInterview(upcoming.id, 'Công ty huỷ');
    }
    onDone?.('Đã gửi email');
    onClose();
  };

  const rcp = recipients();
  const roomOpts = MEETING_ROOMS.filter((r) => !f.onlyFree || !r.busy);
  const locItem = rc.catalog.find((c) => c.type === 'Location' && c.name === f.location);
  const historyCount = rc.mailLogs.filter((m) => m.candidateId === candidateId).length;

  const footer =
    tab === 'history' ? (
      <Btn onClick={onClose}>Đóng</Btn>
    ) : (
      <>
        <Btn onClick={onClose}>Hủy</Btn>
        <Btn icon={Eye} onClick={doPreview}>
          Xem trước
        </Btn>
        {offer && (
          <Btn icon={Download} onClick={() => (check() ? toast(`Đã tải ${offerDoc} (mô phỏng)`) : undefined)}>
            Tải Offer Letter (.docx)
          </Btn>
        )}
        <Btn variant="primary" icon={Send} onClick={send} disabled={hcns && !!appId && !hd}>
          Gửi mail · {kind}
        </Btn>
      </>
    );

  return (
    <>
      <Modal open onClose={onClose} width="max-w-[760px]" title={`Gửi mail · ${cand.fullName} (${cand.code})`} footer={footer}>
        <div className="-mx-4 -mt-4 mb-3 pt-1.5 bg-[#f3f6fa]">
          <FolderTabs
            value={tab}
            onChange={setTab}
            tabs={[
              { key: 'compose', label: 'Soạn mail', icon: Mail },
              { key: 'history', label: `Lịch sử gửi mail (${historyCount})`, icon: History },
            ]}
          />
        </div>

        {tab === 'history' ? (
          <RcMailHistory candidateId={candidateId} onDone={(m) => toast(m)} />
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <FormField label="Loại mail" required>
                <select value={kind} onChange={(e) => changeKind(e.target.value as Kind)} className={`${erp.inputFull} cursor-pointer`}>
                  {MAIL_KINDS.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Lượt ứng tuyển / ID Request" required={needsApplication(kind)} error={err('app')}>
                <select value={appId} onChange={(e) => changeApp(e.target.value)} className={`${erp.inputFull} cursor-pointer ${err('app') ? '!border-rose-400' : ''}`}>
                  <option value="">— chọn lượt ứng tuyển —</option>
                  {apps.map((a) => {
                    const r = rc.request(a.requestId);
                    return (
                      <option key={a.id} value={a.id}>
                        {r?.code} · {r?.position} — {a.stage}
                      </option>
                    );
                  })}
                </select>
              </FormField>
            </div>

            {alertMsg && <Bar tone="bad">{alertMsg}</Bar>}

            {/* ===================== MỜI PHỎNG VẤN ===================== */}
            {interview && (
              <>
                <Bar tone="info">
                  Gửi = tạo lịch Outlook (organizer: hộp thư TA), mời ứng viên + người phỏng vấn + {RECRUITMENT_MAILBOX}; phòng họp mời dạng resource, CV đính kèm vào lịch. Không tự tạo Teams meeting.
                  {sameRoundInvite && (
                    <b className="block mt-0.5">
                      Đã có lịch vòng này{eventDate(sameRoundInvite) ? ` (${dmy(sameRoundInvite.eventId!.slice(-16, -6))} ${sameRoundInvite.eventId!.slice(-5)})` : ''} — gửi lại sẽ cập nhật lịch cũ, không tạo lịch mới.
                    </b>
                  )}
                </Bar>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <FormField label="Vị trí phỏng vấn" required error={err('position')}>
                    <input value={f.position} onChange={(e) => upd({ position: e.target.value })} className={erp.inputFull} />
                  </FormField>
                  <FormField label="Người liên hệ" required error={err('contact')}>
                    <input list="rc-contacts" value={f.contact} onChange={(e) => upd({ contact: e.target.value })} className={erp.inputFull} />
                    <datalist id="rc-contacts">
                      {TA_OPTIONS.map((t) => (
                        <option key={t} value={taContact(t)} />
                      ))}
                    </datalist>
                  </FormField>
                  <FormField label="Ngày phỏng vấn" required error={err('date')}>
                    <input type="date" value={f.date} onChange={(e) => upd({ date: e.target.value })} className={erp.inputFull} />
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Giờ phỏng vấn" required error={err('time')}>
                      <input type="time" value={f.time} onChange={(e) => upd({ time: e.target.value })} className={erp.inputFull} />
                    </FormField>
                    <FormField label="Thời lượng (phút)" required error={err('duration')}>
                      <input type="number" min={15} max={480} step={15} value={f.duration} onChange={(e) => upd({ duration: num(e.target.value) })} className={`${erp.inputFull} text-right`} />
                    </FormField>
                  </div>
                  <FormField label="Đính kèm CV ứng viên" className="col-span-2">
                    <label className="inline-flex items-center gap-2 text-[12.5px] cursor-pointer">
                      <input type="checkbox" checked={f.attachCv} disabled={!cand.cvFile} onChange={(e) => upd({ attachCv: e.target.checked })} className="w-4 h-4 accent-[#1f5fa8]" />
                      {cand.cvFile ? (
                        <>
                          Đã có file CV trên hồ sơ <span className="text-slate-500">({cand.cvFile})</span>
                        </>
                      ) : (
                        <span className="text-slate-500">Hồ sơ chưa tải lên file CV</span>
                      )}
                    </label>
                  </FormField>
                  <FormField label="Địa điểm phỏng vấn" required error={err('location')}>
                    <input
                      list="rc-locations"
                      value={f.location}
                      onChange={(e) => {
                        const v = e.target.value;
                        const it = rc.catalog.find((c) => c.type === 'Location' && c.name === v);
                        upd({ location: v, link: it && !/online|teams/i.test(v) ? it.mapLink : f.link });
                      }}
                      className={erp.inputFull}
                    />
                    <datalist id="rc-locations">
                      {rc.options('Location').map((o) => (
                        <option key={o} value={o} />
                      ))}
                    </datalist>
                  </FormField>
                  <FormField
                    label="Meeting Room"
                    badge={room ? <span className={`text-[11px] font-semibold px-1.5 rounded-[3px] border ${room.busy ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-emerald-50 text-emerald-700 border-emerald-300'}`}>{room.busy ? `Bận ${room.busy}` : 'Trống'}</span> : undefined}
                    hint={room ? `${room.capacity} chỗ · ${room.address}` : f.room ? 'Phòng nhập tay sẽ không được giữ chỗ trên Outlook' : undefined}
                  >
                    <select value={room ? f.room : ''} onChange={(e) => upd({ room: e.target.value })} className={`${erp.inputFull} cursor-pointer`}>
                      <option value="">— chọn phòng —</option>
                      {roomOpts.map((r) => (
                        <option key={r.name} value={r.name}>
                          {r.name} · {r.capacity} chỗ · {r.busy ? `Bận ${r.busy}` : 'Trống'}
                        </option>
                      ))}
                    </select>
                    <label className="mt-1 inline-flex items-center gap-1.5 text-[11.5px] text-slate-600 cursor-pointer">
                      <input type="checkbox" checked={f.onlyFree} onChange={(e) => upd({ onlyFree: e.target.checked })} /> Chỉ hiện phòng trống
                    </label>
                  </FormField>
                  {room?.busy && (
                    <div className="col-span-2">
                      <Bar tone="warn">
                        Phòng {room.name} đã có lịch trong khung giờ này: {room.busy}
                      </Bar>
                    </div>
                  )}
                  <FormField label={online ? 'Link Teams' : 'Link bản đồ'} hint={!online && locItem?.mapLink ? 'Tự điền từ danh mục Địa điểm phỏng vấn' : undefined} className="col-span-2">
                    <input value={f.link} onChange={(e) => upd({ link: e.target.value })} placeholder="https://..." className={erp.inputFull} />
                  </FormField>
                  <FormField label="Người phỏng vấn">
                    <TagPicker values={f.interviewers} options={EMPLOYEES} onChange={(v) => upd({ interviewers: v })} placeholder="+ Chọn người phỏng vấn" />
                  </FormField>
                  <FormField label="Email người phỏng vấn ngoài hệ thống" hint="Ngăn cách bằng dấu , hoặc ;">
                    <input value={f.externalEmails} onChange={(e) => upd({ externalEmails: e.target.value })} placeholder="a@khachhang.vn; b@khachhang.vn" className={erp.inputFull} />
                  </FormField>
                </div>
              </>
            )}

            {/* ===================== OFFER LETTER ===================== */}
            {offer && (
              <>
                {kind === 'Offer Letter' && req?.isStaffing && <Bar tone="warn">Yêu cầu này là Staffing — chọn “Offer Letter (Staffing)” để dùng mẫu Offer Letter cho nhân sự Staffing.</Bar>}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <FormField label="Vị trí ứng tuyển" required error={err('position')}>
                    <input value={f.position} onChange={(e) => upd({ position: e.target.value })} className={erp.inputFull} />
                  </FormField>
                  <FormField label="Khối / Bộ phận" required error={err('department')}>
                    <input value={f.department} onChange={(e) => upd({ department: e.target.value })} className={erp.inputFull} />
                  </FormField>
                  {isStaffingKind(kind) && (
                    <div className="col-span-2 border border-slate-200 rounded-[4px] p-3 space-y-3 bg-slate-50/50">
                      <Bar tone="info">Offer Letter (Staffing) dùng mẫu “3.1 Offer Letter (Staffing) - Thử việc”; dòng “Thuộc” là tên khách hàng, ngày/giờ làm việc theo thư nội bộ.</Bar>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <FormField label="Thuộc (tên khách hàng)" required error={err('customer')} className="col-span-2">
                          <input value={f.customer} onChange={(e) => upd({ customer: e.target.value })} className={erp.inputFull} />
                        </FormField>
                        <FormField label="Ngày làm việc (từ - đến)">
                          <div className="flex items-center gap-1.5">
                            <select value={f.dayFrom} onChange={(e) => upd({ dayFrom: e.target.value })} className={`${erp.inputFull} cursor-pointer`}>
                              {DAYS.map((d) => (
                                <option key={d}>{d}</option>
                              ))}
                            </select>
                            <span className="text-slate-400">–</span>
                            <select value={f.dayTo} onChange={(e) => upd({ dayTo: e.target.value })} className={`${erp.inputFull} cursor-pointer`}>
                              {DAYS.map((d) => (
                                <option key={d}>{d}</option>
                              ))}
                            </select>
                          </div>
                        </FormField>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField label="Giờ làm buổi sáng">
                            <input value={f.morning} onChange={(e) => upd({ morning: e.target.value })} className={erp.inputFull} />
                          </FormField>
                          <FormField label="Giờ làm buổi chiều">
                            <input value={f.afternoon} onChange={(e) => upd({ afternoon: e.target.value })} className={erp.inputFull} />
                          </FormField>
                        </div>
                      </div>
                    </div>
                  )}
                  <FormField label="Báo cáo cho">
                    <input list="rc-employees" value={f.reportTo} onChange={(e) => upd({ reportTo: e.target.value })} className={erp.inputFull} />
                    <datalist id="rc-employees">
                      {EMPLOYEES.map((x) => (
                        <option key={x} value={x} />
                      ))}
                    </datalist>
                  </FormField>
                  <FormField label="Địa điểm làm việc">
                    <input list="rc-worklocations" value={f.workLocation} onChange={(e) => upd({ workLocation: e.target.value })} className={erp.inputFull} />
                    <datalist id="rc-worklocations">
                      {rc.options('Location').map((o) => (
                        <option key={o} value={o} />
                      ))}
                    </datalist>
                  </FormField>
                  <FormField label="Ngày bắt đầu" required error={err('startDate')}>
                    <input type="date" value={f.startDate} onChange={(e) => upd({ startDate: e.target.value })} className={erp.inputFull} />
                  </FormField>
                  <FormField label="Thời gian thử việc (tháng)">
                    <input type="number" min={0} max={12} value={f.probationMonths} onChange={(e) => upd({ probationMonths: num(e.target.value) })} className={`${erp.inputFull} text-right`} />
                  </FormField>
                  <FormField label="Lương chính thức" required error={err('salary')} hint={money(f.salary)}>
                    <input type="number" min={0} step={500000} value={f.salary} onChange={(e) => upd({ salary: num(e.target.value) })} className={`${erp.inputFull} text-right tabular-nums`} />
                  </FormField>
                  <FormField label="Lương thử việc (%)" hint={probSalary !== '' ? `≈ ${money(probSalary)}` : undefined}>
                    <input type="number" min={0} max={100} value={f.probationPercent} onChange={(e) => upd({ probationPercent: num(e.target.value) })} className={`${erp.inputFull} text-right`} />
                  </FormField>
                  <FormField label="Lương chính thức (bằng chữ)" className="col-span-2">
                    <input value={viMoneyWords(f.salary)} readOnly className={`${erp.inputFull} bg-slate-50 text-slate-600`} />
                  </FormField>
                  <FormField label="Giám đốc khối" required error={err('directors')} className="col-span-2">
                    <TagPicker values={f.directors} options={EMPLOYEES} onChange={(v) => upd({ directors: v })} placeholder="+ Chọn Giám đốc khối" invalid={!!err('directors')} />
                  </FormField>
                  <FormField label="Tệp đính kèm gửi ứng viên" className="col-span-2" hint="Tuỳ chọn: Word / PDF ≤ 10MB. Nếu không tải lên, hệ thống sẽ tự động gửi kèm file Word Offer Letter sinh từ mẫu nội bộ.">
                    {f.offerFile ? (
                      <div className="flex items-center gap-2 h-8 px-2 border border-slate-300 rounded-[3px] bg-slate-50">
                        <Paperclip size={13} className="text-[#1f5fa8]" />
                        <span className="text-[12.5px] truncate flex-1">{f.offerFile}</span>
                        <button type="button" onClick={() => upd({ offerFile: '' })} className="p-0.5 rounded hover:bg-slate-200 text-slate-500 cursor-pointer">
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <label className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[3px] border border-dashed border-slate-400 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer">
                        <Upload size={14} /> Tải lên tệp đính kèm (Word / PDF)
                        <input type="file" accept=".docx,.doc,.pdf" className="hidden" onChange={(e) => e.target.files?.[0] && upd({ offerFile: e.target.files[0].name })} />
                      </label>
                    )}
                  </FormField>
                </div>
              </>
            )}

            {/* ===================== THƯ CẢM ƠN ===================== */}
            {thank && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <FormField label="Vị trí ứng tuyển">
                  <input value={f.position} onChange={(e) => upd({ position: e.target.value })} className={erp.inputFull} />
                </FormField>
                {kind === 'Thư cảm ơn - fail CV' ? (
                  <FormField label="Vòng trượt CV (Cập nhật trạng thái)">
                    <select value={f.failStage} onChange={(e) => upd({ failStage: e.target.value as Stage })} className={`${erp.inputFull} cursor-pointer`}>
                      <option value="TA Screen_Rejected">TA Screen_Rejected</option>
                      <option value="HM Screen_Rejected">HM Screen_Rejected</option>
                    </select>
                  </FormField>
                ) : (
                  <FormField label="Trạng thái tự động cập nhật" hint={hadR2 ? 'Đã có lời mời Vòng 2 thành công' : 'Chưa mời Vòng 2'}>
                    <div className="h-8 flex items-center">
                      <StageBadge stage={thankStage} />
                    </div>
                  </FormField>
                )}
                {upcoming && (
                  <label className="col-span-2 inline-flex items-center gap-2 text-[12.5px] cursor-pointer">
                    <input type="checkbox" checked={f.cancelUpcoming} onChange={(e) => upd({ cancelUpcoming: e.target.checked })} className="w-4 h-4 accent-[#1f5fa8]" />
                    Huỷ lịch phỏng vấn sắp tới ({upcoming.kind.replace('Mời phỏng vấn - ', '')}
                    {eventDate(upcoming) ? ` · ${dmy(upcoming.eventId!.slice(-16, -6))} ${upcoming.eventId!.slice(-5)}` : ''})
                  </label>
                )}
                <p className="col-span-2 text-[12px] text-slate-500">Gửi tới ứng viên, không CC, không đính kèm. Gửi xong Stage chuyển sang {thankStage}.</p>
              </div>
            )}

            {/* ===================== HCNS ===================== */}
            {hcns && hd && <RcHcnsFields draft={hd} cand={cand} req={req} skillOptions={rc.options('Skill', [hd.data.techStack])} onChange={updHcns} errors={hErr} showErr={showErr} />}

            {/* ===================== BÁO HỦY ONBOARD ===================== */}
            {cancelOnb && (
              <div className="space-y-3">
                <FieldTable
                  labelWidth="30%"
                  rows={[{ label: 'Vị trí / Level / Tech stack / Bộ phận (từ yêu cầu)', value: req ? `${req.position} / ${req.level} / ${req.skill} / ${req.block}` : '' }]}
                />
                <FormField label="Lý do hủy nhận việc / hủy Onboard" required error={err('cancelReason')}>
                  <input value={f.cancelReason} onChange={(e) => upd({ cancelReason: e.target.value })} className={erp.inputFull} />
                </FormField>
                <FormField label="Ghi chú thêm cho HCNS">
                  <textarea rows={3} value={f.cancelNote} onChange={(e) => upd({ cancelNote: e.target.value })} className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
                </FormField>
                <Bar tone="warn">
                  Gửi sẽ tự động chuyển trạng thái ứng viên sang <b>Offer Rejected</b>.
                  {onbRecord ? (
                    <>
                      {' '}
                      Onboarding Request <b>{onbRecord.id}</b> ({onbRecord.status === 'Chờ HCNS duyệt' ? 'Pending' : 'Approved'}) → <b>Rejected</b>.
                      {(onbRecord.status === 'Đang onboard' || onbRecord.status === 'Đã onboard') &&
                        (onbRecord.account.status === 'Đã tạo'
                          ? ` Hồ sơ nhân sự ${onbRecord.account.employeeCode} đã có tài khoản (${onbRecord.account.companyEmail}) — giữ nguyên, HR cần xử lý.`
                          : ' Hồ sơ nhân sự chưa có tài khoản sẽ bị xoá mềm cùng hợp đồng tự sinh.')}
                    </>
                  ) : (
                    ' Chưa có Onboarding Request đang hiệu lực cho lượt này — chỉ gửi mail.'
                  )}
                </Bar>
              </div>
            )}

            {/* ===================== XEM TRƯỚC ===================== */}
            {preview && (
              <div className="border border-slate-300 rounded-[4px] overflow-hidden">
                <div className="px-3 h-9 flex items-center gap-1.5 bg-gradient-to-b from-[#f7f9fc] to-[#edf1f6] border-b border-slate-300 text-[12px] font-bold uppercase tracking-wide text-[#1e3a5f]">
                  <span className="w-[3px] h-3.5 bg-[#1f5fa8] rounded-sm" /> Xem trước
                </div>
                <div className="p-3 space-y-2.5">
                  <FieldTable
                    labelWidth="20%"
                    rows={[
                      { label: 'To', value: rcp.to },
                      { label: 'Cc', value: rcp.cc.join(', ') },
                      ...rcp.extra,
                      { label: 'Đính kèm', value: rcp.attachments.join(', ') },
                    ]}
                  />
                  <FormField label="Tiêu đề email">
                    <input value={preview.subject} onChange={(e) => setPreview({ ...preview, subject: e.target.value })} className={erp.inputFull} />
                  </FormField>
                  <div className="flex items-center gap-1">
                    {[
                      { cmd: 'bold', Icon: Bold },
                      { cmd: 'italic', Icon: Italic },
                      { cmd: 'underline', Icon: Underline },
                      { cmd: 'insertUnorderedList', Icon: List },
                    ].map(({ cmd, Icon }) => (
                      <button key={cmd} type="button" onMouseDown={(e) => { e.preventDefault(); document.execCommand(cmd); }} className="w-7 h-7 inline-flex items-center justify-center border border-slate-300 rounded-[3px] bg-white hover:bg-slate-50 cursor-pointer">
                        <Icon size={13} />
                      </button>
                    ))}
                    <Btn
                      className="h-7 ml-auto"
                      icon={RotateCcw}
                      onClick={() => {
                        const c = render()!;
                        bodyRef.current = c.body;
                        setPreview({ ...c, key: Date.now() });
                      }}
                    >
                      Khôi phục mẫu
                    </Btn>
                  </div>
                  <div
                    key={preview.key}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => (bodyRef.current = e.currentTarget.innerHTML)}
                    className="min-h-[180px] max-h-[320px] overflow-y-auto border border-slate-300 rounded-[3px] p-3 text-[13px] leading-relaxed outline-none focus:border-[#1f5fa8] [&_ul]:list-disc [&_ul]:pl-5"
                    dangerouslySetInnerHTML={{ __html: preview.body }}
                  />
                  {offer && (
                    <div className="flex gap-2">
                      <Btn className="h-7" icon={Download} onClick={() => toast(`Đã tải ${offerDoc} (mô phỏng)`)}>
                        Tải Offer Letter (.docx)
                      </Btn>
                      <Btn className="h-7" icon={Download} onClick={() => toast('Đã tải Body Email.docx (mô phỏng)')}>
                        Tải Body Email (.docx)
                      </Btn>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
      {createPortal(
        <>
          {confirmNode}
          {toastNode}
        </>,
        document.body,
      )}
    </>
  );
};

