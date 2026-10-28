/**
 * Khối "Gửi thông tin sang HCNS" NẰM TRONG popup Gửi mail — đúng RecruitmentSendMailPopup.razor:
 * mục 0 TA PIC (chỉ đọc) + 17 trường, prefill GetHcnsHandoffDraftAsync (lần gửi trước → Offer → Yêu cầu/hồ sơ),
 * cảnh báo "Cập nhật" / "chưa có Offer", validate phía client.
 */
import React from 'react';
import { Paperclip, Upload, X } from 'lucide-react';
import { erp } from '../erp/Erp';
import { RcApplication, RcCandidate, RcRequest, MailLog, money, dmy, isReferSource, norm } from '../../recruitment/rc/rcData';
import {
  HandoffData, HandoffKey, OnbRecord, WORK_LOCATIONS, HR_POSITIONS, HR_LEVELS, STAFF_NAMES, HCNS_MAILBOX, departmentsOf, emptyHandoff, validateHandoff, diffHandoff, dmyhm,
} from '../../onboarding/onboardingData';
import { FormField, CatalogSelect } from './rcUi';
import { isOfferKind } from './rcMailRules';

/** Link CV nội bộ khi hồ sơ có file CV (RecruitmentHcnsHandoffRules.BuildCvDownloadLink). */
export const internalCvLink = (c: RcCandidate) => (c.cvFile ? `${window.location.origin}/recruitment/candidate/${c.id}/cv` : '');

/** Khớp địa điểm: bỏ dấu/hoa thường/khoảng trắng-gạch; "Hà Nội"/"Hồ Chí Minh" ⇒ HN/HCM. */
const matchWorkLocation = (raw: string) => {
  if (!raw) return '';
  const k = norm(raw).replace(/[\s-]+/g, '');
  const exact = WORK_LOCATIONS.find((w) => norm(w).replace(/[\s-]+/g, '') === k);
  if (exact) return exact;
  if (k.includes('hanoi') || k.startsWith('hn')) return 'HN - HO';
  if (k.includes('hochiminh') || k.includes('hcm')) return 'HCM - HDB';
  return '';
};

export interface HcnsDraft {
  data: HandoffData;
  prev?: OnbRecord;
  hasOffer: boolean;
}

/** Prefill: snapshot HCNS mới nhất → Offer mới nhất → Yêu cầu / hồ sơ. */
export const buildHcnsDraft = (cand: RcCandidate, app: RcApplication | undefined, req: RcRequest | undefined, mailLogs: MailLog[], prev: OnbRecord | undefined): HcnsDraft => {
  const o = app ? mailLogs.filter((m) => m.applicationId === app.id && m.ok && isOfferKind(m.kind) && m.offer).pop()?.offer : undefined;
  if (prev) return { data: { ...prev.data }, prev, hasOffer: !!o };
  const depts = departmentsOf(req?.block || '');
  const lvl = req?.level || '';
  return {
    hasOffer: !!o,
    data: {
      ...emptyHandoff(),
      startDate: o?.startDate || '',
      fullName: cand.fullName,
      position: o?.position || req?.position || cand.appliedPosition,
      techStack: req?.skill || '',
      level: HR_LEVELS.includes(lvl) ? lvl : '',
      // Offer.Department mặc định là tên Khối ⇒ chỉ nhận khi khớp phòng ban trong khối
      department: o?.department && depts.includes(o.department) ? o.department : '',
      manager: o && STAFF_NAMES.includes(o.reportTo) ? o.reportTo : '',
      workLocation: matchWorkLocation(o?.workLocation || req?.workLocation || ''),
      officialSalary: o ? o.salary : req?.isStaffing ? req.salary : '',
      probationMonths: o ? o.probationMonths : '',
      probationPercent: o ? o.probationPercent : '',
      approver: o?.directors.find((d) => STAFF_NAMES.includes(d)) || '',
      cvLink: cand.cvLink || internalCvLink(cand),
      referRecipient: isReferSource(cand.source) && STAFF_NAMES.includes(cand.referrerName) ? cand.referrerName : '',
    },
  };
};

export const hcnsErrors = (d: HandoffData, cand: RcCandidate) => validateHandoff(d, { hasCvFile: !!cand.cvFile, refer: isReferSource(cand.source) });

/** Link CV trống hoặc là link nội bộ ⇒ đính kèm file CV. */
export const hcnsAttachments = (d: HandoffData, cand: RcCandidate) =>
  [d.evidenceFile, cand.cvFile && (!d.cvLink.trim() || d.cvLink.trim() === internalCvLink(cand)) ? cand.cvFile : ''].filter(Boolean);

export const hcnsRecipients = (d: HandoffData, cand: RcCandidate, req?: RcRequest) => ({
  to: HCNS_MAILBOX,
  cc: req?.taPics || [],
  attachments: hcnsAttachments(d, cand),
  extra: [{ label: 'Hộp thư HCNS', value: 'SystemConfig Recruitment.HcnsHandoffTo → fallback Email:HR' }],
});

/** Biến template RECRUITMENT_HCNS_HANDOFF. */
export const hcnsVars = (d: HandoffData, cand: RcCandidate, req?: RcRequest): Record<string, string> => {
  const attachedCv = hcnsAttachments(d, cand).includes(cand.cvFile) && cand.cvFile;
  return {
    TaPicName: req?.taPics[0] || cand.taInput,
    StartDate: dmy(d.startDate),
    CandidateName: d.fullName,
    Position: d.position,
    TechStack: d.techStack,
    Level: d.level,
    Department: d.department,
    ManagerName: d.manager,
    WorkLocation: d.workLocation,
    OfficialSalary: money(d.officialSalary),
    ProbationMonths: String(d.probationMonths),
    ProbationSalaryPercent: String(d.probationPercent),
    Approver: d.approver,
    ApprovalEvidence: d.evidenceFile ? `File đính kèm (${d.evidenceFile})` : '—',
    CvLink: attachedCv ? (d.cvLink.trim() ? `${d.cvLink} · File CV đính kèm (${cand.cvFile})` : `File CV đính kèm (${cand.cvFile})`) : d.cvLink,
    ReferInfo: isReferSource(cand.source) && d.referBonus !== '' ? `${money(d.referBonus)} – Người nhận: ${d.referRecipient || '—'}` : '—',
    Note: d.note || '—',
  };
};

/** Khối "CẬP NHẬT" chèn đầu thân mail (RecruitmentHcnsHandoffRules). */
export const hcnsUpdateBlock = (prev: OnbRecord, d: HandoffData) => {
  const ch = diffHandoff(prev.data, d);
  const items = ch.length
    ? `<ul>${ch.map((c) => `<li>${c.field}: <s>${c.from || '(trống)'}</s> → <b>${c.to || '(trống)'}</b></li>`).join('')}</ul>`
    : '<p>Gửi lại thông tin, không có trường nào thay đổi.</p>';
  return `<div style="border:1px solid #fcd34d;background:#fffbeb;padding:8px 10px;margin-bottom:10px"><p><b>CẬP NHẬT thông tin onboard — thay đổi so với lần gửi trước</b></p>${items}</div>`;
};

const Bar: React.FC<{ tone: 'warn' | 'info'; children: React.ReactNode }> = ({ tone, children }) => (
  <div className={`border rounded-[4px] px-3 py-2 text-[12px] ${tone === 'warn' ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-[#eef4fb] border-[#b9d3f0] text-[#1e3a5f]'}`}>{children}</div>
);

/** Form 17 trường trong popup. */
export const RcHcnsFields: React.FC<{
  draft: HcnsDraft;
  cand: RcCandidate;
  req?: RcRequest;
  /** Danh mục Skill (draft.TechStackOptions) */
  skillOptions: string[];
  onChange: (p: Partial<HandoffData>) => void;
  errors: Partial<Record<HandoffKey, string>>;
  showErr: boolean;
}> = ({ draft, cand, req, skillOptions, onChange, errors, showErr }) => {
  const d = draft.data;
  const err = (k: HandoffKey) => (showErr ? errors[k] : undefined);
  const inv = (k: HandoffKey) => (err(k) ? '!border-rose-400' : '');
  const num = (v: string): number | '' => (v === '' ? '' : Number(v));
  const refer = isReferSource(cand.source);
  return (
    <div className="space-y-3">
      {draft.prev && (
        <Bar tone="warn">
          Đã gửi HCNS lúc <b>{dmyhm(draft.prev.sentAt)}</b> ({draft.prev.sentBy}). Lần gửi này là <b>THÔNG BÁO CẬP NHẬT</b>: HCNS nhận mail [Cập nhật] kèm danh sách thay đổi, hồ sơ chờ onboard được cập nhật theo.
        </Bar>
      )}
      {!draft.hasOffer && <Bar tone="warn">Lượt ứng tuyển này chưa có Offer letter trên hệ thống — vui lòng nhập tay các thông tin onboard.</Bar>}

      <div className="grid grid-cols-12 gap-x-4 gap-y-3">
        <div className="col-span-12 text-[12.5px] text-slate-600">
          TA PIC ứng viên: <b className="text-slate-800">{req?.taPics[0] || cand.taInput || '—'}</b>
        </div>
        <FormField label="Ngày bắt đầu làm việc" required error={err('startDate')} className="col-span-6">
          <input type="date" value={d.startDate} onChange={(e) => onChange({ startDate: e.target.value })} className={`${erp.inputFull} ${inv('startDate')}`} />
        </FormField>
        <FormField label="Họ tên ứng viên" required error={err('fullName')} className="col-span-6">
          <input value={d.fullName} onChange={(e) => onChange({ fullName: e.target.value })} className={`${erp.inputFull} ${inv('fullName')}`} />
        </FormField>
        <FormField label="Vị trí chức danh" required error={err('position')} className="col-span-6">
          <CatalogSelect value={d.position} options={HR_POSITIONS} onChange={(v) => onChange({ position: v })} placeholder="Chọn vị trí" invalid={!!err('position')} />
        </FormField>
        <FormField label="Tech Stack" required error={err('techStack')} className="col-span-6">
          <CatalogSelect value={d.techStack} options={skillOptions} onChange={(v) => onChange({ techStack: v })} placeholder="Chọn tech stack" invalid={!!err('techStack')} />
        </FormField>
        <FormField label="Level" required error={err('level')} className="col-span-6">
          <CatalogSelect value={d.level} options={HR_LEVELS} onChange={(v) => onChange({ level: v })} placeholder="Chọn level" invalid={!!err('level')} />
        </FormField>
        <FormField label="Bộ phận" required error={err('department')} className="col-span-6" hint={req ? `Phòng ban thuộc ${req.block}` : undefined}>
          <CatalogSelect value={d.department} options={departmentsOf(req?.block || '')} onChange={(v) => onChange({ department: v })} placeholder="Chọn bộ phận" invalid={!!err('department')} />
        </FormField>
        <FormField label="Quản lý trực tiếp" required error={err('manager')} className="col-span-6">
          <CatalogSelect value={d.manager} options={STAFF_NAMES} onChange={(v) => onChange({ manager: v })} placeholder="Chọn nhân sự" invalid={!!err('manager')} />
        </FormField>
        <FormField label="Địa điểm làm việc" required error={err('workLocation')} className="col-span-6">
          <CatalogSelect value={d.workLocation} options={WORK_LOCATIONS} onChange={(v) => onChange({ workLocation: v })} placeholder="Chọn địa điểm" invalid={!!err('workLocation')} />
        </FormField>
        <FormField label="Lương chính thức" required error={err('officialSalary')} className="col-span-6" hint={money(d.officialSalary)}>
          <input type="number" min={0} step={500000} value={d.officialSalary} onChange={(e) => onChange({ officialSalary: num(e.target.value) })} className={`${erp.inputFull} text-right tabular-nums ${inv('officialSalary')}`} />
        </FormField>
        <FormField label="Thời gian thử việc (tháng)" required error={err('probationMonths')} className="col-span-3">
          <input type="number" min={0} max={12} value={d.probationMonths} onChange={(e) => onChange({ probationMonths: num(e.target.value) })} className={`${erp.inputFull} text-right ${inv('probationMonths')}`} />
        </FormField>
        <FormField label="Tỉ lệ thử việc (%)" required={Number(d.probationMonths) > 0} error={err('probationPercent')} className="col-span-3">
          <input type="number" min={0} max={100} value={d.probationPercent} onChange={(e) => onChange({ probationPercent: num(e.target.value) })} className={`${erp.inputFull} text-right ${inv('probationPercent')}`} />
        </FormField>
        <FormField label="Người phê duyệt Offer" required error={err('approver')} className="col-span-6">
          <CatalogSelect value={d.approver} options={STAFF_NAMES} onChange={(v) => onChange({ approver: v })} placeholder="Chọn nhân sự" invalid={!!err('approver')} />
        </FormField>
        <FormField label="Bằng chứng phê duyệt" className="col-span-6" hint=".pdf .png .jpg .doc .docx .xls .xlsx .msg .eml — đính kèm vào mail">
          {d.evidenceFile ? (
            <div className="flex items-center gap-2 h-8 px-2 border border-slate-300 rounded-[3px] bg-slate-50">
              <Paperclip size={13} className="text-[#1f5fa8]" />
              <span className="text-[12.5px] truncate flex-1">{d.evidenceFile}</span>
              <button type="button" onClick={() => onChange({ evidenceFile: '' })} className="p-0.5 rounded hover:bg-slate-200 text-slate-500 cursor-pointer" title="Bỏ file">
                <X size={13} />
              </button>
            </div>
          ) : (
            <label className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[3px] border border-dashed border-slate-400 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer">
              <Upload size={14} /> Tải lên bằng chứng
              <input type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.msg,.eml" className="hidden" onChange={(e) => e.target.files?.[0] && onChange({ evidenceFile: e.target.files[0].name })} />
            </label>
          )}
        </FormField>
        <FormField
          label="Link CV"
          required={!cand.cvFile}
          error={err('cvLink')}
          className="col-span-12"
          hint={cand.cvFile ? `Để trống thì đính kèm file CV của hồ sơ: ${cand.cvFile}` : undefined}
        >
          <input value={d.cvLink} onChange={(e) => onChange({ cvLink: e.target.value })} placeholder="https://..." className={`${erp.inputFull} ${inv('cvLink')}`} />
        </FormField>
        {refer && (
          <>
            <FormField label="Mức thưởng refer" className="col-span-6" hint={money(d.referBonus)}>
              <input type="number" min={0} step={500000} value={d.referBonus} onChange={(e) => onChange({ referBonus: num(e.target.value) })} className={`${erp.inputFull} text-right tabular-nums`} />
            </FormField>
            <FormField
              label="Người nhận tiền refer"
              error={err('referRecipient')}
              className="col-span-6"
              hint={cand.referrerName && !STAFF_NAMES.includes(cand.referrerName) && !d.referRecipient ? `Người refer trên hồ sơ: ${cand.referrerName} — chưa khớp nhân sự nào, vui lòng chọn` : undefined}
            >
              <CatalogSelect value={d.referRecipient} options={STAFF_NAMES} onChange={(v) => onChange({ referRecipient: v })} placeholder="Chọn nhân sự" invalid={!!err('referRecipient')} />
            </FormField>
          </>
        )}
        <FormField label="Ghi chú" className="col-span-12">
          <textarea rows={3} value={d.note} onChange={(e) => onChange({ note: e.target.value })} className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
        </FormField>
      </div>
    </div>
  );
};
