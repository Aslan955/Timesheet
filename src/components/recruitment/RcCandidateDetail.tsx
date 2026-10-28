/**
 * Chi tiết / tạo / sửa ứng viên — bám RecruitmentCandidateDetailComponent.razor (2 cột, không tab).
 * Lượt ứng tuyển: chế độ xem có hiệu lực ngay; chế độ sửa ghi nháp tới khi Lưu (null = không đụng).
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight, Briefcase, ChevronDown, ChevronUp, Code, FileText, GraduationCap, History, IdCard, Link2, Loader2, Mail, Paperclip, Pencil, Plus, Save, Sparkles,
  Star, Trash2, Upload, UserRound, X,
} from 'lucide-react';
import { ErpTitleBar, Panel, Btn, erp } from '../erp/Erp';
import { Modal } from '../../marcom/MarcomUi';
import { useRc, DraftApp } from '../../recruitment/rc/RcContext';
import {
  RcCandidate, RcApplication, Stage, CatalogType, TA_OPTIONS, CURRENT_TA, emptyCandidate, validateCandidate, isReferSource, dmy, dmyhm, todayIso,
} from '../../recruitment/rc/rcData';
import { StageSelect, StageBadge, HrBadge, Dash, useConfirm } from './rcUi';
import type { Perm } from './RcCandidatePage';

export type DetailMode = 'view' | 'edit' | 'create';

const AUTO_TIP = 'Trường này được tự động điền từ CV — vui lòng kiểm tra lại';
const CV_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.html';
type AppItem = { key: string; requestId: string; stage: Stage; app?: RcApplication };

export const RcCandidateDetail: React.FC<{
  id?: string;
  mode: DetailMode;
  perm: Perm;
  onBack: () => void;
  onOpen: (id: string, mode: DetailMode) => void;
  onMail: (id: string) => void;
  onOpenRequest: (requestId: string) => void;
  toast: (m: string) => void;
}> = ({ id, mode, perm, onBack, onOpen, onMail, onOpenRequest, toast }) => {
  const rc = useRc();
  const { candidate, appsOfCandidate, requests, request, options, isDeactivated, emailTaken, logs } = rc;
  const saved = id ? candidate(id) : undefined;
  const editing = mode !== 'view';
  const canEdit = perm === 'full';
  const { ask, confirmNode } = useConfirm();

  const [draft, setDraft] = useState<RcCandidate>(() => (saved ? { ...saved, skills: [...saved.skills] } : { ...emptyCandidate(), taInput: CURRENT_TA }));
  const [draftApps, setDraftApps] = useState<DraftApp[] | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dupEmail, setDupEmail] = useState(false);
  const [auto, setAuto] = useState<Set<string>>(new Set());
  const [reading, setReading] = useState(false);
  const [openApply, setOpenApply] = useState(true);
  const [picker, setPicker] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Tra trùng email (debounce 400ms) — chỉ trùng email mới chặn Lưu
  useEffect(() => {
    if (!editing) return;
    const t = window.setTimeout(() => setDupEmail(!!emailTaken(draft.email, saved?.id)), 400);
    return () => window.clearTimeout(t);
  }, [draft.email, editing, emailTaken, saved?.id]);

  if (mode !== 'create' && !saved)
    return (
      <Panel title="Ứng viên">
        <p className="text-slate-500">Không tìm thấy hồ sơ ứng viên.</p>
        <Btn className="mt-2" onClick={onBack}>
          Quay lại danh sách
        </Btn>
      </Panel>
    );

  const set = <K extends keyof RcCandidate>(k: K, v: RcCandidate[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setErrors((e) => {
      if (!e[k as string]) return e;
      const n = { ...e };
      delete n[k as string];
      return n;
    });
    setAuto((a) => {
      if (!a.has(k as string)) return a;
      const n = new Set(a);
      n.delete(k as string);
      return n;
    });
  };

  // ---- lượt ứng tuyển hiển thị
  const liveApps = saved ? appsOfCandidate(saved.id) : [];
  const items: AppItem[] =
    editing && draftApps
      ? draftApps.map((d) => ({ key: d.requestId, requestId: d.requestId, stage: d.stage, app: liveApps.find((a) => a.requestId === d.requestId) }))
      : liveApps.map((a) => ({ key: a.id, requestId: a.requestId, stage: a.stage, app: a }));
  const baseDraft = (): DraftApp[] => draftApps ?? liveApps.map((a) => ({ requestId: a.requestId, stage: a.stage }));

  const addRequest = (requestId: string) => {
    setPicker(false);
    if (editing) {
      setDraftApps([...baseDraft(), { requestId, stage: 'New' }]);
      return;
    }
    const err = rc.assign(saved!.id, requestId);
    toast(err || `Đã gán ${request(requestId)?.code}`);
  };
  const removeItem = async (it: AppItem) => {
    if (editing) {
      setDraftApps(baseDraft().filter((d) => d.requestId !== it.requestId));
      return;
    }
    const code = request(it.requestId)?.code || '';
    if (it.app && (await ask(`Xác nhận gỡ "${code}" khỏi yêu cầu này?`))) {
      rc.unassign(it.app.id);
      toast(`Đã bỏ gán ${code}`);
    }
  };
  const changeStage = (it: AppItem, s: Stage) => {
    if (editing) setDraftApps(baseDraft().map((d) => (d.requestId === it.requestId ? { ...d, stage: s } : d)));
    else if (it.app) rc.setAppStage(it.app.id, s);
  };

  // ---- CV auto-fill (giả lập trích từ tên file, chỉ điền ô trống)
  const pickCv = (file: File) => {
    set('cvFile', file.name);
    if (!/\.(pdf|docx?)$/i.test(file.name)) {
      toast('Không đọc được CV. Hỗ trợ file PDF, DOC, DOCX (PDF phải là văn bản, không phải ảnh scan).');
      return;
    }
    setReading(true);
    window.setTimeout(() => {
      const base = file.name.replace(/\.[^.]+$/, '').replace(/^cv[_\s-]*/i, '');
      const words = base.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[\s_\-.]+/).filter(Boolean);
      const name = words.map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
      const slug = words.join('').toLowerCase().replace(/[^a-z0-9]/g, '') || 'ungvien';
      const guess: Partial<Record<keyof RcCandidate, unknown>> = {
        fullName: name, email: `${slug}@gmail.com`, phone: '0912 345 678', linkedin: `linkedin.com/in/${slug}`, dob: '1997-05-14', address: 'Cầu Giấy, Hà Nội',
        university: options('University')[0], major: options('Major')[0], skills: options('Skill').slice(0, 2),
      };
      const filled: string[] = [];
      setDraft((d) => {
        const n = { ...d } as Record<string, unknown>;
        (Object.keys(guess) as (keyof RcCandidate)[]).forEach((k) => {
          const cur = d[k];
          const empty = Array.isArray(cur) ? cur.length === 0 : !String(cur ?? '').trim();
          if (empty && guess[k]) {
            n[k] = guess[k];
            filled.push(k);
          }
        });
        return n as unknown as RcCandidate;
      });
      setAuto(new Set(filled));
      setReading(false);
      toast(filled.length ? `Đã tự động điền ${filled.length} trường từ CV.` : 'Đã đọc CV nhưng không tìm thấy thông tin phù hợp để tự động điền.');
    }, 1000);
  };

  // ---- lưu
  const save = (andNew: boolean) => {
    const e = validateCandidate(draft);
    if (dupEmail) e.email = 'Email đã tồn tại trong hệ thống';
    setErrors(e);
    if (Object.keys(e).length) return;
    const res = rc.saveCandidate(draft, draftApps);
    toast(mode === 'create' ? `Đã tạo ứng viên ${res.code}` : 'Đã lưu thay đổi');
    if (andNew) onOpen('', 'create');
    else onOpen(res.id, 'view');
  };
  const cancel = () => (mode === 'create' ? onBack() : onOpen(saved!.id, 'view'));
  const remove = async () => {
    if (await ask('Bạn có chắc chắn muốn xóa hồ sơ ứng viên này?')) {
      rc.deleteCandidate(saved!.id);
      toast('Đã xoá hồ sơ ứng viên');
      onBack();
    }
  };

  const c = editing ? draft : saved!;
  const lbl = (k: keyof RcCandidate) => (auto.has(k as string) ? <AutoBadge /> : null);
  const sel = (type: CatalogType, k: 'appliedPosition' | 'source' | 'university' | 'major', placeholder: string) => (
    <CatSel value={draft[k] as string} options={options(type, [draft[k] as string])} deactivated={(v) => isDeactivated(type, v)} onChange={(v) => set(k, v)} placeholder={placeholder} invalid={!!errors[k]} />
  );
  const refer = isReferSource(c.source);
  const title = mode === 'create' ? 'Thêm ứng viên' : saved!.fullName || saved!.code;

  return (
    <>
      <ErpTitleBar
        onBack={onBack}
        backLabel="Quay lại danh sách"
        crumbs={['Trang chủ', 'Tuyển dụng', 'Quản lý ứng viên', title]}
        title={
          <>
            {title}
            {saved && <span className={`${erp.code} text-[13px] font-normal`}>{saved.code}</span>}
          </>
        }
        actions={
          editing ? (
            <>
              <Btn icon={X} onClick={cancel}>
                Hủy
              </Btn>
              {mode === 'create' && (
                <Btn variant="success" icon={Plus} onClick={() => save(true)}>
                  Lưu và tạo mới
                </Btn>
              )}
              <Btn variant="primary" icon={Save} onClick={() => save(false)}>
                {mode === 'create' ? 'Tạo ứng viên' : 'Lưu thay đổi'}
              </Btn>
            </>
          ) : (
            <>
              <Btn icon={History} onClick={() => setHistoryOpen(true)}>
                Lịch sử thay đổi
              </Btn>
              {canEdit && (
                <Btn icon={Mail} onClick={() => onMail(saved!.id)}>
                  Gửi mail
                </Btn>
              )}
              {canEdit && (
                <Btn variant="primary" icon={Pencil} onClick={() => onOpen(saved!.id, 'edit')}>
                  Chỉnh sửa hồ sơ
                </Btn>
              )}
              {canEdit && (
                <Btn variant="danger" icon={Trash2} onClick={remove}>
                  Xóa
                </Btn>
              )}
            </>
          )
        }
        meta={
          saved
            ? [
                { label: 'Vòng tuyển dụng (tổng)', value: <StageBadge stage={saved.stage} /> },
                { label: 'TA Input', value: saved.taInput || '—' },
                { label: 'Ngày tiếp nhận', value: dmy(saved.inputDate) },
                { label: 'Người tạo', value: saved.createdBy || '—' },
              ]
            : undefined
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-start">
        {/* ============ CỘT TRÁI ============ */}
        <div className="space-y-3">
          <Panel
            title="Thông tin ứng tuyển"
            icon={Briefcase}
            actions={
              <button type="button" onClick={() => setOpenApply((v) => !v)} className="p-1 rounded-[3px] text-slate-500 hover:bg-slate-200 cursor-pointer" title={openApply ? 'Thu gọn' : 'Mở rộng'}>
                {openApply ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            }
          >
            {openApply && (
              <div className="space-y-3">
                <Field label="Ngày tiếp nhận" required error={errors.inputDate} view={!editing} text={dmy(c.inputDate)}>
                  <input type="date" value={draft.inputDate} onChange={(e) => set('inputDate', e.target.value)} className={`${erp.inputFull} max-w-[220px] ${errors.inputDate ? '!border-rose-400' : ''}`} />
                </Field>

                <div className="flex items-center justify-between gap-2 relative">
                  <p className="text-[11.5px] font-bold uppercase tracking-wide text-slate-500">{items.length} yêu cầu tuyển dụng</p>
                  {canEdit ? (
                    <Btn className="h-7" icon={Plus} onClick={() => setPicker((v) => !v)}>
                      Thêm yêu cầu vào ứng viên
                    </Btn>
                  ) : null}
                  {picker && (
                    <RequestPicker
                      exclude={items.map((i) => i.requestId)}
                      onPick={addRequest}
                      onClose={() => setPicker(false)}
                      requests={requests.filter((r) => r.status === 'Đang tuyển')}
                    />
                  )}
                </div>

                {items.length === 0 ? (
                  <p className="text-[12.5px] text-slate-400 py-2">Chưa gán yêu cầu tuyển dụng nào.</p>
                ) : (
                  <ul className="space-y-2">
                    {items.map((it, i) => {
                      const r = request(it.requestId);
                      return (
                        <li key={it.key} className="border border-slate-300 rounded-[4px] bg-white">
                          <div className="flex items-start gap-2.5 px-3 py-2">
                            <span className="w-5 h-5 rounded-full bg-[#e8edf4] text-[#1e3a5f] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            <div className="min-w-0 flex-1">
                              <button type="button" onClick={() => onOpenRequest(it.requestId)} className="inline-flex items-center gap-1 text-[#1f5fa8] font-semibold hover:underline cursor-pointer">
                                {r ? `${r.code} - ${r.block}` : it.requestId} <Link2 size={12} />
                              </button>
                              <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-slate-500 mt-0.5">
                                <span className="inline-flex items-center gap-1"><Briefcase size={11} /> {r?.position || '—'}</span>
                                <span className="inline-flex items-center gap-1"><Star size={11} /> {r?.level || '—'}</span>
                                <span className="inline-flex items-center gap-1"><Code size={11} /> {r?.skill || '—'}</span>
                              </p>
                            </div>
                            <StageSelect value={it.stage} disabled={!canEdit} onChange={(s) => changeStage(it, s)} />
                            {canEdit && (
                              <button type="button" title="Gỡ yêu cầu này" onClick={() => removeItem(it)} className="p-1 rounded-[3px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer">
                                <X size={14} />
                              </button>
                            )}
                          </div>
                          <p className="px-3 py-1 border-t border-slate-100 bg-slate-50/70 text-[11px] text-slate-500">
                            {it.app ? `${it.app.addedBy} · ${dmy(it.app.stageChangedAt || it.app.appliedDate)}` : `${CURRENT_TA} · ${dmy(todayIso())} (chưa lưu)`}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {editing && draftApps && <p className="text-[11.5px] text-amber-700">Thay đổi yêu cầu tuyển dụng chỉ có hiệu lực khi bấm Lưu.</p>}
              </div>
            )}
          </Panel>

          {mode !== 'create' && saved && (
            <Panel title="Thông tin từ HCNS" icon={UserRound}>
              {saved.hr.status === 'None' ? (
                <p className="text-[12.5px] text-slate-500">Chưa có hồ sơ HCNS</p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <HrBadge status={saved.hr.status} showNone />
                    {saved.hr.matchedByEmail && <span className="text-[11.5px] text-slate-500">✉ Khớp theo email</span>}
                  </div>
                  <p className="text-[12.5px]">
                    <span className="text-slate-500">Nhân viên: </span>
                    <b>
                      {saved.hr.employeeCode} - {saved.hr.employeeName}
                    </b>
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-[12px]">
                    {[
                      ['Ngày vào làm', saved.hr.startDate],
                      ['Ngày chính thức', saved.hr.officialDate],
                      ['Ngày nghỉ việc', saved.hr.resignDate],
                    ].map(([l, v]) => (
                      <div key={l} className="border border-slate-200 rounded-[3px] px-2 py-1.5 bg-slate-50">
                        <p className="text-[11px] text-slate-500">{l}</p>
                        <p className="font-semibold tabular-nums">{v ? dmy(v) : '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Panel>
          )}

          <Panel title="File CV nguồn" icon={Paperclip}>
            <div className="space-y-2.5">
              <div className="text-[12.5px]">
                <span className="text-slate-500">File CV: </span>
                {c.cvFile ? <span className="text-[#1f5fa8] underline cursor-pointer">{c.cvFile}</span> : <span className="text-slate-400">— chưa có file CV</span>}
              </div>
              {editing && (
                <>
                  <p className="text-[11.5px] text-slate-500">File chọn ở đây chỉ vào hồ sơ khi bấm Lưu. Bấm Hủy là bỏ luôn.</p>
                  <Btn icon={reading ? Loader2 : Upload} disabled={reading} onClick={() => fileRef.current?.click()}>
                    {reading ? 'Đang đọc CV...' : 'Chọn file CV'}
                  </Btn>
                  <input ref={fileRef} type="file" accept={CV_ACCEPT} className="hidden" onChange={(e) => { e.target.files?.[0] && pickCv(e.target.files[0]); e.target.value = ''; }} />
                </>
              )}
              <Field label="Hoặc gán link CV" view={!editing} text={c.cvLink ? <a href={c.cvLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#1f5fa8] underline break-all">{c.cvLink} <ArrowUpRight size={12} /></a> : ''}>
                <input value={draft.cvLink} onChange={(e) => set('cvLink', e.target.value)} placeholder="https://..." className={erp.inputFull} />
              </Field>
            </div>
          </Panel>

          <Panel title="Ghi chú" icon={FileText}>
            {editing ? (
              <textarea rows={4} value={draft.note} onChange={(e) => set('note', e.target.value)} placeholder="Nhận xét, lưu ý về ứng viên..." className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
            ) : (
              <p className="text-[12.5px] whitespace-pre-wrap">{c.note || <Dash />}</p>
            )}
          </Panel>
        </div>

        {/* ============ CỘT PHẢI ============ */}
        <div className="space-y-3">
          <Panel title="Thông tin cá nhân và liên hệ" icon={IdCard}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <Field label="Họ và tên" required badge={lbl('fullName')} error={errors.fullName} view={!editing} text={c.fullName}>
                <input value={draft.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="VD: Nguyễn Văn A" className={`${erp.inputFull} ${errors.fullName ? '!border-rose-400' : ''}`} />
              </Field>
              <Field label="Vị trí ứng tuyển" view={!editing} text={withOff(c.appliedPosition, isDeactivated('Position', c.appliedPosition))}>
                {sel('Position', 'appliedPosition', 'Chọn vị trí')}
              </Field>
              <Field label="Ngày sinh" badge={lbl('dob')} view={!editing} text={dmy(c.dob)}>
                <input type="date" value={draft.dob} onChange={(e) => set('dob', e.target.value)} className={erp.inputFull} />
              </Field>
              <Field label="Email" required badge={lbl('email')} error={errors.email || (editing && dupEmail ? 'Email đã tồn tại trong hệ thống' : undefined)} view={!editing} text={c.email}>
                <input value={draft.email} onChange={(e) => set('email', e.target.value)} placeholder="email@example.com" className={`${erp.inputFull} ${errors.email || dupEmail ? '!border-rose-400' : ''}`} />
              </Field>
              <Field label="Điện thoại" badge={lbl('phone')} view={!editing} text={c.phone}>
                <input value={draft.phone} onChange={(e) => set('phone', e.target.value)} placeholder="09xx xxx xxx" className={erp.inputFull} />
              </Field>
              <Field label="TA Input" required error={errors.taInput} view={!editing} text={c.taInput}>
                <CatSel value={draft.taInput} options={TA_OPTIONS.includes(draft.taInput) || !draft.taInput ? TA_OPTIONS : [...TA_OPTIONS, draft.taInput]} onChange={(v) => set('taInput', v)} placeholder="Chọn TA Input" invalid={!!errors.taInput} />
              </Field>
              <Field label="Địa chỉ" badge={lbl('address')} className="md:col-span-2" view={!editing} text={c.address}>
                <textarea rows={2} value={draft.address} onChange={(e) => set('address', e.target.value)} placeholder="Số nhà, đường, quận/huyện, tỉnh/thành" className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
              </Field>
              <Field label="LinkedIn" badge={lbl('linkedin')} className="md:col-span-2" view={!editing} text={c.linkedin}>
                <input value={draft.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="linkedin.com/in/..." className={erp.inputFull} />
              </Field>
              <Field label="Nguồn ứng viên" required error={errors.source} view={!editing} text={withOff(c.source, isDeactivated('Source', c.source))}>
                {sel('Source', 'source', 'Chọn nguồn')}
              </Field>
              <Field label="Người refer" required={refer} error={errors.referrerName} view={!editing} text={c.referrerName}>
                <input
                  value={draft.referrerName}
                  onChange={(e) => set('referrerName', e.target.value)}
                  placeholder={refer ? 'Bắt buộc khi nguồn là Refer' : 'Không bắt buộc'}
                  className={`${erp.inputFull} ${errors.referrerName ? '!border-rose-400' : ''}`}
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Học vấn và kinh nghiệm" icon={GraduationCap}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
              <Field label="Trường đại học" badge={lbl('university')} view={!editing} text={withOff(c.university, isDeactivated('University', c.university))}>
                {sel('University', 'university', 'Chọn trường đại học')}
              </Field>
              <Field label="Chuyên ngành" badge={lbl('major')} view={!editing} text={withOff(c.major, isDeactivated('Major', c.major))}>
                {sel('Major', 'major', 'Chọn chuyên ngành')}
              </Field>
              <Field label="Vị trí hiện tại" view={!editing} text={c.currentPosition}>
                <input value={draft.currentPosition} onChange={(e) => set('currentPosition', e.target.value)} placeholder="VD: Senior Backend Developer" className={erp.inputFull} />
              </Field>
              <Field label="Công ty hiện tại" view={!editing} text={c.currentCompany}>
                <input value={draft.currentCompany} onChange={(e) => set('currentCompany', e.target.value)} placeholder="Tên công ty đang làm" className={erp.inputFull} />
              </Field>
              <Field label="Tech Stack" className="md:col-span-2" view={!editing} text={c.techStack}>
                <textarea rows={2} value={draft.techStack} onChange={(e) => set('techStack', e.target.value)} placeholder="VD: Java, Spring Boot, PostgreSQL..." className={`${erp.inputFull} h-auto py-1.5 resize-none`} />
              </Field>
              <Field
                label="Kỹ năng"
                badge={lbl('skills')}
                className="md:col-span-2"
                view={!editing}
                text={c.skills.length ? <SkillTags skills={c.skills} deactivated={(s) => isDeactivated('Skill', s)} /> : ''}
              >
                <SkillPicker value={draft.skills} options={options('Skill', draft.skills)} deactivated={(s) => isDeactivated('Skill', s)} onChange={(v) => set('skills', v)} />
              </Field>
            </div>
          </Panel>
        </div>
      </div>

      <Modal open={historyOpen} onClose={() => setHistoryOpen(false)} width="max-w-[900px]" title={`Lịch sử thay đổi — ${saved?.fullName || ''}`}>
        <HistoryTimeline items={logs.filter((l) => l.entity === 'candidate' && l.entityId === saved?.id)} />
      </Modal>
      {confirmNode}
    </>
  );
};

// ==========================================================================
// Phụ trợ
// ==========================================================================
const withOff = (v: string, off: boolean) => (v ? (off ? `${v} (ngưng dùng)` : v) : '');

const AutoBadge: React.FC = () => (
  <span title={AUTO_TIP} className="inline-flex items-center text-violet-600">
    <Sparkles size={12} />
  </span>
);

const Field: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  badge?: React.ReactNode;
  className?: string;
  view: boolean;
  text: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, required, error, badge, className = '', view, text, children }) => (
  <div className={`min-w-0 ${className}`}>
    <p className="text-[12px] font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
      <span>
        {label}
        {required && !view && <span className="text-rose-500"> *</span>}
      </span>
      {badge}
    </p>
    {view ? <div className="text-[13px] text-slate-800 min-h-[20px] break-words">{text === '' || text == null ? <Dash /> : text}</div> : children}
    {!view && error && <p className="text-[11px] text-rose-600 mt-0.5">{error}</p>}
  </div>
);

const CatSel: React.FC<{ value: string; options: string[]; onChange: (v: string) => void; placeholder: string; invalid?: boolean; deactivated?: (v: string) => boolean }> = ({
  value, options, onChange, placeholder, invalid, deactivated,
}) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} className={`${erp.inputFull} cursor-pointer ${invalid ? '!border-rose-400' : ''}`}>
    <option value="">{placeholder}</option>
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
        {deactivated?.(o) ? ' (ngưng dùng)' : ''}
      </option>
    ))}
  </select>
);

const SkillTags: React.FC<{ skills: string[]; deactivated: (s: string) => boolean; onRemove?: (s: string) => void }> = ({ skills, deactivated, onRemove }) => (
  <span className="flex flex-wrap gap-1">
    {skills.map((s) => (
      <span key={s} className="inline-flex items-center gap-1 px-1.5 py-px rounded-[3px] border border-[#b9d3f0] bg-[#eaf2fc] text-[11.5px] font-semibold text-[#1f5fa8]">
        {s}
        {deactivated(s) ? ' (ngưng dùng)' : ''}
        {onRemove && (
          <button type="button" onClick={() => onRemove(s)} className="cursor-pointer hover:text-rose-600">
            <X size={10} />
          </button>
        )}
      </span>
    ))}
  </span>
);

const SkillPicker: React.FC<{ value: string[]; options: string[]; deactivated: (s: string) => boolean; onChange: (v: string[]) => void }> = ({ value, options, deactivated, onChange }) => (
  <div className="flex flex-wrap items-center gap-1.5 min-h-8 border border-slate-300 rounded-[3px] px-1.5 py-1 bg-white">
    <SkillTags skills={value} deactivated={deactivated} onRemove={(s) => onChange(value.filter((x) => x !== s))} />
    <select value="" onChange={(e) => e.target.value && onChange([...value, e.target.value])} className="h-6 flex-1 min-w-[120px] text-[12px] outline-none bg-transparent cursor-pointer">
      <option value="">{value.length ? '+ Thêm kỹ năng' : 'Chọn kỹ năng'}</option>
      {options
        .filter((o) => !value.includes(o))
        .map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
    </select>
  </div>
);

const RequestPicker: React.FC<{ requests: ReturnType<typeof useRc>['requests']; exclude: string[]; onPick: (id: string) => void; onClose: () => void }> = ({
  requests, exclude, onPick, onClose,
}) => {
  const [q, setQ] = useState('');
  const avail = requests.filter((r) => !exclude.includes(r.id));
  const list = useMemo(() => {
    const k = q.trim().toLowerCase();
    return avail.filter((r) => !k || [r.code, r.position, r.level, r.block, r.skill].some((s) => s.toLowerCase().includes(k)));
  }, [avail, q]);
  return (
    <div className="absolute right-0 top-9 z-30 w-[360px] bg-white border border-slate-300 rounded-[4px] shadow-lg">
      <div className="flex items-center gap-1 p-2 border-b border-slate-200">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && list[0]) onPick(list[0].id);
            if (e.key === 'Escape') onClose();
          }}
          placeholder="Tìm theo mã, vị trí, level, khối..."
          className={`${erp.inputFull} h-7 text-[12px]`}
        />
        <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
          <X size={14} />
        </button>
      </div>
      <ul className="max-h-64 overflow-y-auto">
        {list.length === 0 && (
          <li className="px-3 py-3 text-[12px] text-slate-400">{avail.length === 0 ? 'Ứng viên đã được gán vào tất cả yêu cầu tuyển dụng' : 'Không tìm thấy yêu cầu phù hợp'}</li>
        )}
        {list.map((r) => (
          <li key={r.id}>
            <button type="button" onClick={() => onPick(r.id)} className="w-full text-left px-3 py-1.5 hover:bg-[#eaf2fc] cursor-pointer">
              <p className="text-[12.5px] font-semibold text-slate-800">
                <span className={erp.code}>{r.code}</span> · {r.position}
              </p>
              <p className="text-[11.5px] text-slate-500">
                {r.level} · {r.skill} · {r.block}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const HistoryTimeline: React.FC<{ items: ReturnType<typeof useRc>['logs'] }> = ({ items }) =>
  items.length === 0 ? (
    <p className="text-[12.5px] text-slate-400">Chưa có lịch sử thay đổi.</p>
  ) : (
    <ol className="relative border-l-2 border-slate-200 ml-2 space-y-3">
      {[...items].reverse().map((l) => (
        <li key={l.id} className="ml-4">
          <span className="absolute -left-[7px] mt-1 w-3 h-3 rounded-full bg-[#1f5fa8] border-2 border-white" />
          <p className="text-[12px] text-slate-500">
            {dmyhm(l.at)} · <b className="text-slate-700">{l.by}</b>
          </p>
          <p className="text-[13px] font-semibold text-[#1e3a5f]">{l.action}</p>
          {l.changes && l.changes.length > 0 && (
            <ul className="mt-0.5 text-[12px] space-y-0.5">
              {l.changes.map((ch, i) => (
                <li key={i}>
                  <span className="text-slate-500">{ch.field}: </span>
                  <span className="line-through text-slate-400">{ch.from || '(trống)'}</span> → <b>{ch.to || '(trống)'}</b>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
