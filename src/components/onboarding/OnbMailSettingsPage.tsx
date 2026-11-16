/**
 * HR › Thiết lập email Onboarding — mẫu email gửi ứng viên theo đối tượng Nội bộ / Staffing:
 * thời điểm gửi, người nhận, tiêu đề, nội dung (chèn biến), tệp đính kèm, bật / tắt, xem trước.
 */
import React, { useMemo, useRef, useState } from 'react';
import { ArrowLeft, CalendarClock, Eye, Mail, Paperclip, Plus, RotateCcw, Save, Settings2, Trash2, Upload, X } from 'lucide-react';
import { Btn, ErpPage, ErpTitleBar, FieldTable, Panel, erp } from '../erp/Erp';
import { Modal, TAG, useToast } from '../../marcom/MarcomUi';
import { Tag } from '../erp/Erp';
import { useOnboarding } from '../../onboarding/OnboardingContext';
import {
  OnbMailAudience, OnbMailTemplate, ONB_MAIL_AUDIENCES, ONB_MAIL_TO, ONB_MAIL_TRIGGERS, ONB_MAIL_VARS, fillTemplate, fmtSize, sampleVars, timingText,
} from '../../onboarding/onbMailTemplates';

const AUD_CLS: Record<OnbMailAudience, string> = { Chung: TAG.slate, 'Nội bộ': TAG.blue, Staffing: TAG.green };
const order = (t: OnbMailTemplate) => (t.trigger === 'accept' ? -1e9 : t.trigger === 'before' ? -t.daysBefore * 24 * 60 : 0) + Number(t.time.replace(':', ''));
const sel = `${erp.inputFull} cursor-pointer`;

export const OnbMailSettingsPage: React.FC<{ onNavigate?: (p: string) => void }> = ({ onNavigate }) => {
  const { mailTemplates, saveMailTemplate, removeMailTemplate } = useOnboarding();
  const { toast, toastNode } = useToast();
  const [key, setKey] = useState(mailTemplates[0]?.key || '');
  const saved = mailTemplates.find((t) => t.key === key);
  const [draft, setDraft] = useState<OnbMailTemplate | null>(saved ? { ...saved } : null);
  const [preview, setPreview] = useState(false);
  const [tried, setTried] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const subjRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<'subject' | 'body'>('body');
  const isNew = !!draft && !saved;
  const dirty = !!draft && (isNew || JSON.stringify(draft) !== JSON.stringify(saved));
  const errors = draft
    ? {
        name: !draft.name.trim() ? 'Bắt buộc' : '',
        subject: !draft.subject.trim() ? 'Bắt buộc' : '',
        body: !draft.body.trim() ? 'Bắt buộc' : '',
        daysBefore: draft.trigger === 'before' && !(draft.daysBefore >= 1 && draft.daysBefore <= 30) ? 'Từ 1 đến 30 ngày' : '',
        time: draft.trigger !== 'accept' && !/^\d{2}:\d{2}$/.test(draft.time) ? 'Chọn giờ gửi' : '',
      }
    : {};
  const hasErr = Object.values(errors).some(Boolean);

  const pick = (k: string) => {
    if (k === key) return;
    if (dirty && !window.confirm('Mẫu đang sửa chưa lưu. Bỏ thay đổi?')) return;
    const t = mailTemplates.find((x) => x.key === k);
    setKey(k);
    setDraft(t ? { ...t } : null);
    setTried(false);
  };
  const set = <K extends keyof OnbMailTemplate>(k: K, v: OnbMailTemplate[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));
  const insertVar = (v: string) => {
    if (!draft) return;
    const token = `{${v}}`;
    const el = lastFocus.current === 'subject' ? subjRef.current : bodyRef.current;
    const field = lastFocus.current === 'subject' ? 'subject' : 'body';
    const text = draft[field];
    const a = el?.selectionStart ?? text.length;
    const b = el?.selectionEnd ?? text.length;
    set(field, text.slice(0, a) + token + text.slice(b));
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(a + token.length, a + token.length);
    });
  };
  const save = () => {
    if (!draft) return;
    if (hasErr) return setTried(true);
    saveMailTemplate({ ...draft, name: draft.name.trim(), subject: draft.subject.trim() });
    toast(`Đã lưu mẫu "${draft.name.trim()}" — áp dụng cho các email gửi từ bây giờ`);
    setTried(false);
  };
  const addNew = (audience: OnbMailAudience) => {
    if (dirty && !window.confirm('Mẫu đang sửa chưa lưu. Bỏ thay đổi?')) return;
    const k = `CUSTOM_${Date.now()}`;
    setKey(k);
    setDraft({ key: k, name: '', audience, trigger: 'onboardDay', daysBefore: 1, time: '08:00', to: 'personal', cc: 'hcns@company.vn', subject: '', body: 'Chào {HoTen},\n\n\n\nTrân trọng,\n{HCNS} — Phòng Hành chính Nhân sự', attachments: [], active: true });
    setTried(false);
  };
  const remove = () => {
    if (!draft || draft.system) return;
    if (!window.confirm(`Xoá mẫu "${draft.name || 'mới'}"?`)) return;
    if (saved) removeMailTemplate(draft.key);
    const first = mailTemplates.find((t) => t.key !== draft.key);
    setKey(first?.key || '');
    setDraft(first ? { ...first } : null);
    toast('Đã xoá mẫu email');
  };
  const addFiles = (files: FileList | null) => {
    if (!draft || !files?.length) return;
    const add = [...files].map((f) => ({ id: `att-${Date.now()}-${f.name}`, name: f.name, size: f.size, url: URL.createObjectURL(f) }));
    set('attachments', [...draft.attachments, ...add.filter((a) => !draft.attachments.some((x) => x.name === a.name))]);
  };

  const groups = useMemo(() => ONB_MAIL_AUDIENCES.map((a) => ({ a, list: mailTemplates.filter((t) => t.audience === a).sort((x, y) => order(x) - order(y)) })), [mailTemplates]);
  const flow = (type: 'Nội bộ' | 'Staffing') => mailTemplates.filter((t) => t.audience === 'Chung' || t.audience === type).sort((x, y) => order(x) - order(y));
  const err = (k: keyof typeof errors) => (tried ? errors[k] : '');
  const vars = sampleVars();

  return (
    <ErpPage>
      {toastNode}
      <ErpTitleBar
        crumbs={['Nhân sự', 'Onboarding Request', 'Thiết lập email']}
        title="Thiết lập email Onboarding"
        actions={
          onNavigate && (
            <Btn icon={ArrowLeft} onClick={() => onNavigate('Onboarding Request')}>
              Về Onboarding Request
            </Btn>
          )
        }
      />

      {/* Luồng email theo đối tượng */}
      <Panel title="Luồng email gửi ứng viên theo đối tượng" icon={CalendarClock}>
        <div className="space-y-2">
          {(['Nội bộ', 'Staffing'] as const).map((type) => (
            <div key={type} className="flex flex-wrap items-center gap-1.5 text-[12px]" data-testid={`flow-${type}`}>
              <span className="w-[86px] shrink-0">
                <Tag cls={AUD_CLS[type]}>{type}</Tag>
              </span>
              <span className="px-2 py-1 rounded-[3px] border border-violet-200 bg-violet-50 text-violet-800 font-semibold">HCNS Accept</span>
              {flow(type).map((t) => (
                <React.Fragment key={t.key}>
                  <span className="text-slate-300">→</span>
                  <button
                    type="button"
                    onClick={() => pick(t.key)}
                    className={`text-left px-2 py-1 rounded-[3px] border cursor-pointer ${t.active ? 'border-[#b9d3f0] bg-[#eef4fb] text-[#1e3a5f] hover:bg-[#e2edf9]' : 'border-slate-200 bg-slate-50 text-slate-400 line-through'} ${key === t.key ? 'ring-1 ring-[#1f5fa8]' : ''}`}
                    title={t.active ? 'Bấm để sửa mẫu' : 'Mẫu đang tắt'}
                  >
                    <b>{t.name}</b>
                    <span className="block text-[11px] text-slate-500 no-underline">
                      {timingText(t)} · {t.to === 'company' ? 'email công ty' : 'email cá nhân'}
                      {t.attachments.length > 0 && ` · ${t.attachments.length} tệp`}
                    </span>
                  </button>
                </React.Fragment>
              ))}
              <span className="text-slate-300">→</span>
              <span className="px-2 py-1 rounded-[3px] border border-emerald-200 bg-emerald-50 text-emerald-800 font-semibold">Đã onboard</span>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-[340px_minmax(0,1fr)] gap-3">
        {/* Danh sách mẫu */}
        <Panel title={`Mẫu email (${mailTemplates.length})`} icon={Mail} noPad>
          <div className="divide-y divide-slate-200">
            {groups.map(({ a, list }) => (
              <div key={a}>
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#f4f7fb]">
                  <span className="text-[11.5px] font-bold uppercase tracking-wide text-[#1e3a5f]">{a === 'Chung' ? 'Chung (mọi đối tượng)' : a}</span>
                  {a !== 'Chung' && (
                    <button type="button" onClick={() => addNew(a)} className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#1f5fa8] hover:underline cursor-pointer" data-testid={`add-${a}`}>
                      <Plus size={12} /> Thêm email
                    </button>
                  )}
                </div>
                {list.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => pick(t.key)}
                    className={`w-full text-left px-3 py-2 cursor-pointer border-l-[3px] ${key === t.key ? 'bg-[#eaf2fc] border-l-[#1f5fa8]' : 'border-l-transparent hover:bg-slate-50'}`}
                    data-testid={`tpl-${t.key}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <b className={`text-[12.5px] ${t.active ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{t.name}</b>
                      {!t.active && <Tag cls={TAG.slate}>Tắt</Tag>}
                    </span>
                    <span className="block text-[11.5px] text-slate-500">
                      {timingText(t)} · {t.to === 'company' ? 'Email công ty' : 'Email cá nhân'}
                    </span>
                    {t.attachments.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <Paperclip size={11} /> {t.attachments.length} tệp đính kèm
                      </span>
                    )}
                  </button>
                ))}
                {!list.length && <p className="px-3 py-2 text-[12px] text-slate-400">Chưa có mẫu.</p>}
              </div>
            ))}
          </div>
        </Panel>

        {/* Soạn mẫu */}
        {draft ? (
          <Panel
            title={isNew ? 'Thêm mẫu email' : `Sửa mẫu — ${saved?.name}`}
            icon={Settings2}
            actions={
              <span className="flex items-center gap-2">
                {!draft.system && (
                  <Btn variant="danger" icon={Trash2} className="h-7" onClick={remove}>
                    Xoá
                  </Btn>
                )}
                <Btn icon={Eye} className="h-7" onClick={() => setPreview(true)} data-testid="tpl-preview">
                  Xem trước
                </Btn>
              </span>
            }
            footer={
              saved?.updatedAt ? `Cập nhật lần cuối: ${new Date(saved.updatedAt).toLocaleString('vi-VN')} · ${saved.updatedBy}` : 'Thay đổi áp dụng cho các email gửi sau khi lưu; email đã gửi giữ nguyên.'
            }
          >
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-x-4 gap-y-3">
                <L label="Tên mẫu" req err={err('name')} cls="col-span-12 md:col-span-6">
                  <input value={draft.name} onChange={(e) => set('name', e.target.value)} className={`${erp.inputFull} ${err('name') ? '!border-rose-400' : ''}`} placeholder="VD: Nhắc mang giấy tờ" data-testid="tpl-name" />
                </L>
                <L label="Đối tượng" cls="col-span-6 md:col-span-3">
                  <div className="h-8 flex items-center">
                    <Tag cls={AUD_CLS[draft.audience]}>{draft.audience === 'Chung' ? 'Chung (mọi đối tượng)' : draft.audience}</Tag>
                  </div>
                </L>
                <L label="Trạng thái" cls="col-span-6 md:col-span-3">
                  <label className="h-8 inline-flex items-center gap-2 text-[12.5px] cursor-pointer">
                    <input type="checkbox" checked={draft.active} onChange={(e) => set('active', e.target.checked)} className="w-4 h-4 accent-[#1f5fa8]" data-testid="tpl-active" />
                    {draft.active ? 'Đang dùng' : 'Tắt (không gửi)'}
                  </label>
                </L>
                <L label="Thời điểm gửi" req cls="col-span-12 md:col-span-4">
                  <select value={draft.trigger} onChange={(e) => set('trigger', e.target.value as OnbMailTemplate['trigger'])} className={sel} disabled={draft.key === 'FORM_LINK'} data-testid="tpl-trigger">
                    {ONB_MAIL_TRIGGERS.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </L>
                {draft.trigger === 'before' && (
                  <L label="Số ngày trước onboard" req err={err('daysBefore')} cls="col-span-6 md:col-span-2">
                    <input type="number" min={1} max={30} value={draft.daysBefore} onChange={(e) => set('daysBefore', Number(e.target.value))} className={`${erp.inputFull} text-right`} data-testid="tpl-days" />
                  </L>
                )}
                {draft.trigger !== 'accept' && (
                  <L label="Giờ gửi" req err={err('time')} cls="col-span-6 md:col-span-2">
                    <input type="time" value={draft.time} onChange={(e) => set('time', e.target.value)} className={erp.inputFull} data-testid="tpl-time" />
                  </L>
                )}
                <L label="Gửi tới" req cls={`col-span-12 ${draft.trigger === 'before' ? 'md:col-span-4' : draft.trigger === 'accept' ? 'md:col-span-8' : 'md:col-span-6'}`}>
                  <select value={draft.to} onChange={(e) => set('to', e.target.value as OnbMailTemplate['to'])} className={sel} data-testid="tpl-to">
                    {ONB_MAIL_TO.map((t) => (
                      <option key={t.key} value={t.key}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </L>
                <p className="col-span-12 -mt-1.5 text-[11.5px] text-slate-500">
                  {draft.trigger === 'accept'
                    ? 'Gửi ngay khi HCNS Accept ứng viên.'
                    : draft.trigger === 'before'
                      ? `Gửi lúc ${draft.time} ngày D-${draft.daysBefore || '?'} (VD onboard 23/11 ⇒ gửi ${draft.daysBefore >= 1 ? new Date(2026, 10, 23 - draft.daysBefore).toLocaleDateString('vi-VN') : '—'}). Accept sau thời điểm này ⇒ gửi ngay.`
                      : `Gửi lúc ${draft.time} sáng ngày onboard. Gửi xong tất cả email ngày onboard ⇒ phiếu chuyển Đã onboard.`}
                  {draft.to === 'company' && ' Nếu tới giờ gửi IT chưa cấp email công ty, hệ thống gửi vào email cá nhân.'}
                </p>
                <L label="CC" cls="col-span-12" hint="Nhiều địa chỉ cách nhau dấu phẩy">
                  <input value={draft.cc} onChange={(e) => set('cc', e.target.value)} className={erp.inputFull} placeholder="hcns@company.vn" />
                </L>
                <L label="Tiêu đề" req err={err('subject')} cls="col-span-12">
                  <input
                    ref={subjRef}
                    value={draft.subject}
                    onFocus={() => (lastFocus.current = 'subject')}
                    onChange={(e) => set('subject', e.target.value)}
                    className={`${erp.inputFull} ${err('subject') ? '!border-rose-400' : ''}`}
                    data-testid="tpl-subject"
                  />
                </L>
                <L label="Nội dung" req err={err('body')} cls="col-span-12">
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    <span className="text-[11.5px] text-slate-500 mr-1 self-center">Chèn biến:</span>
                    {ONB_MAIL_VARS.map((v) => (
                      <button
                        key={v.key}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => insertVar(v.key)}
                        title={`${v.label} — VD: ${v.sample}`}
                        className="px-1.5 py-px rounded-[3px] border border-slate-300 bg-slate-50 text-[11.5px] font-mono text-[#1f5fa8] hover:bg-[#eaf2fc] cursor-pointer"
                      >
                        {`{${v.key}}`}
                      </button>
                    ))}
                  </div>
                  <textarea
                    ref={bodyRef}
                    rows={12}
                    value={draft.body}
                    onFocus={() => (lastFocus.current = 'body')}
                    onChange={(e) => set('body', e.target.value)}
                    className={`${erp.inputFull} h-auto py-2 leading-relaxed ${err('body') ? '!border-rose-400' : ''}`}
                    data-testid="tpl-body"
                  />
                </L>
                <L label="Tệp đính kèm" cls="col-span-12">
                  <div className="space-y-1.5">
                    {draft.attachments.map((a) => (
                      <div key={a.id} className="flex items-center gap-2 h-8 px-2 border border-slate-300 rounded-[3px] bg-slate-50 text-[12.5px]" data-testid="tpl-att">
                        <Paperclip size={13} className="text-[#1f5fa8] shrink-0" />
                        {a.url ? (
                          <a href={a.url} download={a.name} className="truncate flex-1 text-[#1f5fa8] hover:underline">
                            {a.name}
                          </a>
                        ) : (
                          <span className="truncate flex-1">{a.name}</span>
                        )}
                        <span className="text-[11px] text-slate-500 tabular-nums">{fmtSize(a.size)}</span>
                        <button type="button" onClick={() => set('attachments', draft.attachments.filter((x) => x.id !== a.id))} className="p-0.5 rounded hover:bg-slate-200 text-slate-500 cursor-pointer" title="Bỏ tệp">
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                    <label className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[3px] border border-dashed border-slate-400 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer">
                      <Upload size={14} /> Tải lên tệp đính kèm
                      <input type="file" multiple className="hidden" onChange={(e) => (addFiles(e.target.files), (e.target.value = ''))} data-testid="tpl-file" />
                    </label>
                    <p className="text-[11.5px] text-slate-500">Tệp gửi kèm mọi email dùng mẫu này (PDF, Word, Excel, ảnh…).</p>
                  </div>
                </L>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-200">
                {tried && hasErr && <span className="mr-auto text-[12px] text-rose-600">Kiểm tra các ô bắt buộc.</span>}
                {!tried && dirty && <span className="mr-auto text-[12px] text-amber-700">Có thay đổi chưa lưu</span>}
                <Btn icon={RotateCcw} disabled={!dirty || isNew} onClick={() => saved && (setDraft({ ...saved }), setTried(false))}>
                  Huỷ thay đổi
                </Btn>
                <Btn variant="primary" icon={Save} disabled={!dirty} onClick={save} data-testid="tpl-save">
                  Lưu mẫu
                </Btn>
              </div>
            </div>
          </Panel>
        ) : (
          <Panel title="Mẫu email" icon={Settings2}>
            <p className="text-[12.5px] text-slate-500">Chọn 1 mẫu bên trái để sửa.</p>
          </Panel>
        )}
      </div>

      <Modal open={preview && !!draft} onClose={() => setPreview(false)} title={`Xem trước — ${draft?.name || 'mẫu mới'}`} width="max-w-2xl" footer={<Btn onClick={() => setPreview(false)}>Đóng</Btn>}>
        {draft && (
          <div className="space-y-2.5" data-testid="tpl-preview-body">
            <p className="text-[11.5px] text-slate-500">Dữ liệu mẫu minh hoạ (không phải ứng viên thật).</p>
            <FieldTable
              labelWidth="18%"
              rows={[
                { label: 'Thời điểm', value: timingText(draft) },
                { label: 'Đến', value: <span className="font-mono">{draft.to === 'company' ? vars.EmailCongTy : vars.EmailCaNhan}</span> },
                { label: 'CC', value: draft.cc },
                { label: 'Tiêu đề', value: <b>{fillTemplate(draft.subject, vars)}</b> },
                {
                  label: 'Đính kèm',
                  value: draft.attachments.length ? (
                    <span className="inline-flex flex-wrap gap-1.5">
                      {draft.attachments.map((a) => (
                        <span key={a.id} className="inline-flex items-center gap-1 px-1.5 py-px border border-slate-300 rounded-[3px] bg-slate-50 text-[12px]">
                          <Paperclip size={11} /> {a.name}
                        </span>
                      ))}
                    </span>
                  ) : (
                    ''
                  ),
                },
              ]}
            />
            <div className="border border-slate-200 rounded-[3px] px-3 py-2.5 text-[13px] leading-relaxed whitespace-pre-line">{fillTemplate(draft.body, vars)}</div>
          </div>
        )}
      </Modal>
    </ErpPage>
  );
};

const L: React.FC<{ label: string; req?: boolean; err?: string; hint?: string; cls?: string; children: React.ReactNode }> = ({ label, req, err, hint, cls = '', children }) => (
  <div className={cls}>
    <span className="block text-[12px] font-semibold text-slate-700 mb-1">
      {label} {req && <span className="text-rose-600">*</span>}
      {hint && <span className="font-normal text-slate-400 ml-1">({hint})</span>}
    </span>
    {children}
    {err && <span className="block text-[11.5px] text-rose-600 mt-0.5">{err}</span>}
  </div>
);
