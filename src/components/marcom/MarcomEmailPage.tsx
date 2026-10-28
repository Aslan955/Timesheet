/**
 * MarCom · Email tự động (yêu cầu 1.4 + 2.3) + cấu hình Box sinh nhật (1.3).
 *  - Mail sinh nhật: gửi đúng ngày sinh nhật, 09:00. Mail Welcome: gửi đúng ngày onboard, 10:00.
 *  - Nội dung do MarCom cung cấp: tiêu đề/nội dung (biến {{...}}), banner đầu + banner cuối mail (ảnh làm sẵn) tuỳ chọn.
 *  - Avatar người nhận KHÔNG upload tay: lấy tự động từ hồ sơ Employee của từng người nhận, hiện nhỏ cạnh lời chúc.
 *    Hồ sơ chưa có ảnh → dùng ảnh mặc định hoặc gửi không kèm ảnh (cấu hình), kèm cảnh báo để HCNS bổ sung.
 *  - Lịch sử gửi: thành công / lỗi / bỏ qua / gửi thử, gửi lại thủ công khi lỗi.
 * Giao diện: khung ERP (src/components/erp/Erp.tsx) như màn Báo cáo hiệu quả dự án.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, GalleryHorizontal, Cake, Hand, LayoutTemplate, History, Upload, Trash2, Send, Save, RotateCcw, Image as ImageIcon, Settings2, FileText, Eye, Clock, UserSquare2, AlertTriangle, Megaphone, Palette, Maximize2, X } from 'lucide-react';
import { useMarcom, MailConfig, BoxConfig, BoxTheme, HomeBanner } from '../../marcom/MarcomContext';
import { Avatar, FilterBar, FilterCell, LangSwitch, Switch, TAG, useToast } from '../../marcom/MarcomUi';
import { useMarcomLang } from '../../marcom/i18n';
import { BirthdayBox, BOX_THEMES, useTodayBirthdays } from '../../marcom/BirthdayBox';
import { TeamsBirthdayPost, TEAMS_PLACEHOLDERS, TEAMS_DIRECTORY, TEAMS_SENDER, SenderAvatar } from '../../marcom/TeamsBirthdayPost';
import { Btn, ErpPage, ErpTitleBar, FieldTable, FolderTabs, FormRow, Panel, Segmented, Tag, erp } from '../erp/Erp';
import {
  MAX_IMAGE_BYTES, MailKind, MarcomEmployee, TEAMS_POST_ENABLED, addDays, fillTemplate, fmtDate, fmtDateTime, inWelcomeBatch, isBirthdayToday, isPastTimeToday,
  startOfDay, toKey,
} from '../../marcom/marcomData';

type Tab = MailKind | 'box' | 'logs';

type Device = 'desktop' | 'tablet' | 'mobile';
/** Bề rộng thân mail theo thiết bị (px) — mail thật co giãn 100% tới tối đa 720px. */
const DEVICE_WIDTH: Record<Device, number> = { desktop: 720, tablet: 540, mobile: 360 };

const KIND_META: Record<MailKind, { label: string; labelEn: string; trigger: string; triggerEn: string; icon: React.ElementType; wait: string; emoji: string }> = {
  birthday: { label: 'Mail chúc mừng sinh nhật', labelEn: 'Birthday greeting email', trigger: 'Đúng ngày sinh nhật của CBNV', triggerEn: 'On the employee’s birthday', icon: Cake, wait: 'bg-gradient-to-br from-pink-100 via-rose-50 to-amber-100 border-pink-300 text-pink-700', emoji: '🎂' },
  welcome: { label: 'Mail Welcome Onboard', labelEn: 'Welcome Onboard email', trigger: 'Đúng ngày onboard của nhân sự mới', triggerEn: 'On the new hire’s onboard date', icon: Hand, wait: 'bg-gradient-to-br from-sky-100 via-emerald-50 to-teal-100 border-sky-300 text-sky-800', emoji: '🎉' },
};

/** Ảnh mặc định khi hồ sơ Employee chưa có ảnh. */
const DEFAULT_PHOTO = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="#e2e8f0"/><circle cx="120" cy="96" r="44" fill="#94a3b8"/><path d="M40 240c8-52 42-78 80-78s72 26 80 78z" fill="#94a3b8"/></svg>',
)}`;

export const MarcomEmailPage: React.FC = () => {
  const { config } = useMarcom();
  const [tab, setTab] = useState<Tab>('birthday');
  const { toast, toastNode } = useToast();
  const { tr } = useMarcomLang();

  return (
    <ErpPage>
      {toastNode}
      <ErpTitleBar
        crumbs={['Human Resources', 'MarCom', tr('Email tự động MarCom', 'MarCom automated emails')]}
        title={tr('Email tự động MarCom', 'MarCom automated emails')}
        actions={<LangSwitch />}
      />
      <FolderTabs
        tabs={[
          { key: 'birthday' as Tab, label: tr('Mail sinh nhật', 'Birthday email'), icon: Cake },
          { key: 'welcome' as Tab, label: tr('Mail Welcome Onboard', 'Welcome Onboard email'), icon: Hand },
          {
            key: 'box' as Tab,
            label: TEAMS_POST_ENABLED ? tr('Box sinh nhật (Trang chủ & Teams)', 'Birthday box (Home & Teams)') : tr('Box sinh nhật (Trang chủ)', 'Birthday box (Home)'),
            icon: LayoutTemplate,
          },
          { key: 'logs' as Tab, label: tr('Lịch sử gửi', 'Send history'), icon: History },
        ]}
        value={tab}
        onChange={setTab}
      />
      {(tab === 'birthday' || tab === 'welcome') && <MailEditor key={tab} kind={tab} toast={toast} />}
      {tab === 'box' && <BoxEditor toast={toast} />}
      {tab === 'logs' && <MailLogs toast={toast} />}
    </ErpPage>
  );
};

// ---------------------------------------------------------------------------
// Thiệp: khung (ảnh nền MarCom) + ảnh nhân sự lấy từ Employee + tên, khối
// ---------------------------------------------------------------------------
/** Biến {{...}} hiển thị dạng thẻ xanh trong chế độ xem template. */
const VarText: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(/(\{\{\w+\}\})/g).map((part, i) =>
      /^\{\{\w+\}\}$/.test(part) ? (
        <span key={i} className="px-1 mx-px rounded-[3px] border border-[#b9d3f0] bg-[#eaf2fc] text-[#1f5fa8] font-mono text-[0.85em]">
          {part}
        </span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
  </>
);

/** Mail MarCom: banner đầu làm sẵn + người nhận (ảnh nhỏ) + lời chúc + banner cuối. e = undefined → chế độ template. */
const BannerMail: React.FC<{ kind: MailKind; cfg: MailConfig; e?: MarcomEmployee; body: React.ReactNode; device?: Device }> = ({ kind, cfg, e, body, device = 'desktop' }) => {
  const meta = KIND_META[kind];
  const mobile = device === 'mobile';
  const { tr } = useMarcomLang();
  const photo = e ? e.photoUrl ?? (cfg.noPhoto === 'default' ? DEFAULT_PHOTO : null) : DEFAULT_PHOTO;
  const showPhoto = cfg.usePhoto && !!photo;
  return (
    <div>
      {cfg.frameUrl ? (
        <img src={cfg.frameUrl} alt={tr('Banner đầu mail', 'Header banner')} className="block w-full h-auto" />
      ) : (
        <div className={`${mobile ? 'h-[110px]' : 'h-[150px]'} flex flex-col items-center justify-center gap-1 border-b border-dashed ${meta.wait}`}>
          <span className="text-3xl">{meta.emoji}</span>
          <span className="text-[12px] font-semibold">{tr('Banner đầu mail do MarCom cung cấp', 'Header banner provided by MarCom')}</span>
          <span className="text-[11px] opacity-80">{tr('Banner đầu mail — tải ở mục “Banner & ảnh người nhận”', 'Header banner — upload under “Banners & recipient photo”')}</span>
        </div>
      )}
      <div className={mobile ? 'p-3' : 'p-4'}>
        <div className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-200">
          {showPhoto && (
            <img
              src={photo!}
              alt={e?.name ?? tr('Ảnh nhân sự', 'Employee photo')}
              title={e ? undefined : tr('Ảnh lấy tự động từ Employee', 'Photo taken automatically from Employee')}
              className={`${mobile ? 'w-10 h-10' : 'w-12 h-12'} shrink-0 object-cover border-2 shadow-sm ${e ? 'border-white' : 'border-dashed border-slate-400'} ${cfg.photoShape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
            />
          )}
          <div className="min-w-0">
            <div className={`${mobile ? 'text-[13px]' : 'text-[14px]'} font-bold text-slate-900 leading-tight break-words`}>{e ? e.name : <VarText text="{{fullname}}" />}</div>
            <div className="text-[11px] text-slate-500">{e ? e.division : <VarText text="{{khoi}}" />}</div>
          </div>
        </div>
        <div className={`whitespace-pre-line ${mobile ? 'text-[12.5px]' : 'text-[13px]'} leading-relaxed text-slate-700 break-words`}>{body}</div>
      </div>
      {cfg.footerUrl ? (
        <img src={cfg.footerUrl} alt={tr('Banner cuối mail', 'Footer banner')} className="block w-full h-auto" />
      ) : (
        <div className={`${mobile ? 'h-[56px]' : 'h-[70px]'} flex items-center justify-center gap-2 bg-slate-50 border-t border-dashed border-slate-300 text-[11px] text-slate-500`}>
          <ImageIcon size={14} /> {tr('Banner cuối mail do MarCom cung cấp (tuỳ chọn)', 'Footer banner provided by MarCom (optional)')}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
const MailEditor: React.FC<{ kind: MailKind; toast: (m: string) => void }> = ({ kind, toast }) => {
  const { config, employees: allEmployees, birthdayEmployees, updateMailConfig, sendTest } = useMarcom();
  // Mail sinh nhật dùng ảnh chúc mừng (có thể là ảnh tải lên); mail Welcome dùng ảnh Employee
  const employees = kind === 'birthday' ? birthdayEmployees : allEmployees;
  const saved = config[kind];
  const [draft, setDraft] = useState<MailConfig>(saved);
  const [testTo, setTestTo] = useState('marcom@aequitas.vn');
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const footerRef = useRef<HTMLInputElement>(null);
  const meta = KIND_META[kind];
  const { tr, placeholders } = useMarcomLang();
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const today = startOfDay(new Date());
  const sampleList = useMemo(() => employees.filter((e) => (kind === 'birthday' ? e.active : inWelcomeBatch(e))), [employees, kind]);
  const defaultSample = (kind === 'birthday' ? sampleList.find((e) => isBirthdayToday(e)) : sampleList.find((e) => e.onboardDate === toKey(today))) ?? sampleList[0];
  const [sampleId, setSampleId] = useState(defaultSample?.id);
  const [view, setView] = useState<'template' | 'sample'>('template');
  const [device, setDevice] = useState<Device>('desktop');
  const [full, setFull] = useState(false);
  const [zoom, setZoom] = useState<100 | 125 | 150>(100);
  useEffect(() => {
    if (!full) return;
    const onKey = (ev: KeyboardEvent) => ev.key === 'Escape' && setFull(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [full]);
  const sample = sampleList.find((e) => e.id === sampleId) ?? defaultSample;

  const nextRunDay = isPastTimeToday(draft.sendTime) ? addDays(today, 1) : today;
  const nextRecipients: MarcomEmployee[] =
    kind === 'birthday' ? employees.filter((e) => e.active && isBirthdayToday(e, nextRunDay)) : employees.filter((e) => inWelcomeBatch(e) && e.onboardDate === toKey(nextRunDay));

  const set = (patch: Partial<MailConfig>) => setDraft((d) => ({ ...d, ...patch }));
  const insert = (token: string) => {
    const el = bodyRef.current;
    if (!el) return set({ body: draft.body + token });
    const s = el.selectionStart ?? draft.body.length;
    const e = el.selectionEnd ?? s;
    set({ body: draft.body.slice(0, s) + token + draft.body.slice(e) });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + token.length, s + token.length);
    });
  };
  const badImage = (f: File) =>
    !f.type.startsWith('image/')
      ? (toast(tr('Chỉ nhận file ảnh (PNG/JPG)', 'Only image files are accepted (PNG/JPG)')), true)
      : f.size > MAX_IMAGE_BYTES
        ? (toast(tr('Ảnh tối đa 5MB', 'Maximum image size is 5MB')), true)
        : false;
  const onFile = (f: File | undefined) => {
    if (!f || badImage(f)) return;
    set({ frameUrl: URL.createObjectURL(f), frameName: f.name });
  };
  const onFooterFile = (f: File | undefined) => {
    if (!f || badImage(f)) return;
    set({ footerUrl: URL.createObjectURL(f), footerName: f.name });
  };

  const photoNote = (e: MarcomEmployee) =>
    e.photoUrl ? (
      <Tag cls={TAG.green}>{tr('Có ảnh', 'Has photo')}</Tag>
    ) : draft.noPhoto === 'default' ? (
      <Tag cls={TAG.amber}>{tr('Thiếu ảnh · dùng ảnh mặc định', 'No photo · default photo used')}</Tag>
    ) : (
      <Tag cls={TAG.amber}>{tr('Thiếu ảnh · gửi không kèm ảnh', 'No photo · sent without photo')}</Tag>
    );

  return (
    <>
      {full && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#eef1f5]" role="dialog" aria-label={tr('Xem trước toàn màn hình', 'Full-screen preview')}>
          <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-white border-b border-slate-300">
            <span className="text-[13px] font-bold text-[#1e3a5f]">{tr(meta.label, meta.labelEn)} — {tr('xem toàn màn hình', 'full-screen view')}</span>
            <span className="text-[12px] text-slate-500 truncate max-w-[40%]">{view === 'sample' && sample ? fillTemplate(draft.subject, sample) : draft.subject}</span>
            <span className="ml-auto flex items-center gap-2">
              <Segmented
                options={[
                  { key: 'desktop' as const, label: tr('Máy tính', 'Desktop') },
                  { key: 'tablet' as const, label: 'Tablet' },
                  { key: 'mobile' as const, label: tr('Điện thoại', 'Mobile') },
                ]}
                value={device}
                onChange={setDevice}
              />
              <Segmented
                options={[
                  { key: 100 as const, label: '100%' },
                  { key: 125 as const, label: '125%' },
                  { key: 150 as const, label: '150%' },
                ]}
                value={zoom}
                onChange={setZoom}
              />
              <Btn icon={X} onClick={() => setFull(false)}>
                {tr('Đóng', 'Close')}
              </Btn>
            </span>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <div className="mx-auto w-full bg-white border border-slate-300 rounded-[4px] shadow-md overflow-hidden transition-[max-width] duration-200" style={{ maxWidth: DEVICE_WIDTH[device], zoom: zoom / 100 }}>
              {view === 'sample' && sample ? (
                <BannerMail kind={kind} cfg={draft} e={sample} device={device} body={fillTemplate(draft.body, sample)} />
              ) : (
                <BannerMail kind={kind} cfg={draft} device={device} body={<VarText text={draft.body} />} />
              )}
            </div>
          </div>
        </div>
      )}
      {/* Thanh thao tác */}
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-[4px]">
        <Btn
          variant="primary"
          icon={Save}
          disabled={!dirty}
          onClick={() => {
            updateMailConfig(kind, draft);
            toast(tr('Đã lưu cấu hình email', 'Email settings saved'));
          }}
        >
          {tr('Lưu', 'Save')}
        </Btn>
        <Btn icon={RotateCcw} disabled={!dirty} onClick={() => setDraft(saved)}>
          {tr('Hoàn tác', 'Undo')}
        </Btn>
        {dirty && <span className="text-[12px] text-amber-700">{tr('Có thay đổi chưa lưu', 'Unsaved changes')}</span>}
        <span className="ml-auto flex items-center gap-1.5">
          <span className="text-[12px] text-slate-600">{tr('Gửi thử tới', 'Send test to')}</span>
          <input value={testTo} onChange={(e) => setTestTo(e.target.value)} className={`${erp.input} w-56`} placeholder="email@aequitas.vn" />
          <Btn
            icon={Send}
            title={sample ? tr(`Điền template bằng dữ liệu của ${sample.name} rồi gửi tới email thử`, `Fill the template with ${sample.name}’s data and send it to the test address`) : undefined}
            disabled={!testTo.includes('@') || !sample}
            onClick={() => {
              if (!sample) return;
              sendTest(kind, sample, testTo);
              toast(tr(`Đã gửi thử tới ${testTo} — điền bằng dữ liệu của ${sample.name}`, `Test sent to ${testTo} — filled with ${sample.name}’s data`));
            }}
          >
            {tr('Gửi thử', 'Send test')}
          </Btn>
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 items-start">
        <div className="space-y-3 min-w-0">
          <Panel title={tr('Cấu hình gửi', 'Sending settings')} icon={Settings2}>
            <div className="space-y-2.5">
              <FormRow label={tr('Trạng thái', 'Status')}>
                <span className="flex items-center gap-2 h-8">
                  <Switch on={draft.enabled} onChange={(v) => set({ enabled: v })} />
                  <span className="text-[12px] font-semibold text-slate-700">{draft.enabled ? tr('Đang bật gửi tự động', 'Auto-send on') : tr('Đang tắt', 'Off')}</span>
                </span>
              </FormRow>
              <FormRow label={tr('Điều kiện gửi', 'Send trigger')}>
                <input value={tr(meta.trigger, meta.triggerEn)} readOnly className={`${erp.inputFull} bg-slate-50 text-slate-500`} />
              </FormRow>
              <FormRow label={tr('Giờ gửi', 'Send time')} hint={tr('Job chạy hằng ngày vào giờ này, tự xác định người nhận', 'The job runs daily at this time and picks recipients automatically')}>
                <input type="time" value={draft.sendTime} onChange={(e) => set({ sendTime: e.target.value })} className={`${erp.input} w-32`} />
              </FormRow>
            </div>
          </Panel>

          <Panel title={tr('Nội dung email', 'Email content')} icon={FileText}>
            <div className="space-y-2.5">
              <FormRow label={tr('Tiêu đề', 'Subject')} required>
                <input value={draft.subject} onChange={(e) => set({ subject: e.target.value })} className={erp.inputFull} />
              </FormRow>
              <FormRow label={tr('Biến chèn', 'Placeholders')} hint={tr('Bấm để chèn vào vị trí con trỏ trong nội dung', 'Click to insert at the cursor in the content')}>
                <span className="flex flex-wrap gap-1 pt-1">
                  {placeholders.filter((p) => p.kinds.includes(kind)).map((p) => (
                    <button key={p.key} type="button" onClick={() => insert(p.key)} title={p.desc} className="px-1.5 py-px rounded-[3px] border border-[#b9d3f0] bg-[#eaf2fc] text-[#1f5fa8] text-[11px] font-mono hover:bg-[#dbe9fa] cursor-pointer">
                      {p.key}
                    </button>
                  ))}
                </span>
              </FormRow>
              <FormRow label={tr('Nội dung', 'Content')} required>
                <textarea ref={bodyRef} rows={10} value={draft.body} onChange={(e) => set({ body: e.target.value })} className="w-full border border-slate-300 rounded-[3px] px-2 py-1.5 text-[13px] leading-relaxed text-slate-800 outline-none focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#1f5fa8]/15" />
              </FormRow>
            </div>
          </Panel>

          <Panel
            title={tr('Banner & ảnh người nhận', 'Banners & recipient photo')}
            icon={UserSquare2}
            footer={tr(
              'Banner đầu và banner cuối do MarCom thiết kế sẵn, gửi nguyên vẹn — không ghép thêm gì lên banner. Mail co giãn theo màn hình (tối đa 720px): banner luôn vừa bề rộng, không bị cắt — dùng ảnh rộng 1440px (gấp đôi) cho màn hình nét; chữ/logo trong banner đặt cách mép ≥ 24px và cỡ chữ ≥ 24px (ở bản 1440px) để vẫn đọc được trên điện thoại. Ảnh người nhận là avatar nhỏ cạnh lời chúc, lấy từ hồ sơ Employee tại thời điểm gửi, hoặc (riêng mail sinh nhật) ảnh MarCom đã tải lên ở màn Sinh nhật nhân sự.',
              'Header and footer banners are pre-designed by MarCom and sent as is — nothing is overlaid on them. The email scales with the screen (max 720px): banners always fit the width and are never cropped — use 1440px-wide images (2x) for sharp displays; keep text/logos in the banner ≥ 24px from the edges with font size ≥ 24px (at 1440px) so they stay readable on phones. The recipient photo is a small avatar next to the greeting, taken from the Employee profile at send time, or (birthday mail only) the photo MarCom uploaded on the Employee birthdays screen.',
            )}
          >
            <div className="space-y-2.5">
              <FormRow label={tr('Nguồn ảnh nhân sự', 'Employee photo source')}>
                <span className="flex flex-wrap items-center gap-2 min-h-8">
                  <span className="font-mono text-[12px] text-[#1f5fa8]">
                    {kind === 'birthday' ? tr('Ảnh chúc mừng (Employee hoặc ảnh MarCom tải lên)', 'Greeting photo (Employee or MarCom upload)') : tr('Employee › Ảnh đại diện', 'Employee › Profile photo')}
                  </span>
                  <Tag cls={TAG.blue}>{tr('Tự động theo người nhận', 'Automatic per recipient')}</Tag>
                </span>
              </FormRow>
              <FormRow label={tr('Avatar người nhận', 'Recipient avatar')}>
                <span className="flex items-center gap-2 h-8">
                  <Switch on={draft.usePhoto} onChange={(v) => set({ usePhoto: v })} />
                  <span className="text-[12px] text-slate-700">{draft.usePhoto ? tr('Có — avatar nhỏ cạnh tên người nhận', 'Yes — small avatar next to the recipient name') : tr('Không hiện avatar', 'No avatar')}</span>
                </span>
              </FormRow>
              {draft.usePhoto && (
                <>
                  <FormRow label={tr('Kiểu ảnh', 'Photo style')}>
                    <Segmented
                      options={[
                        { key: 'circle' as const, label: tr('Tròn', 'Circle') },
                        { key: 'rounded' as const, label: tr('Vuông bo góc', 'Rounded square') },
                      ]}
                      value={draft.photoShape}
                      onChange={(v) => set({ photoShape: v })}
                    />
                  </FormRow>
                  <FormRow label={tr('Employee chưa có ảnh', 'Employee without photo')}>
                    <Segmented
                      options={[
                        { key: 'default' as const, label: tr('Dùng ảnh mặc định', 'Use default photo') },
                        { key: 'omit' as const, label: tr('Gửi không kèm ảnh', 'Send without photo') },
                      ]}
                      value={draft.noPhoto}
                      onChange={(v) => set({ noPhoto: v })}
                    />
                  </FormRow>
                </>
              )}
              <FormRow
                label={tr('Banner đầu mail (MarCom)', 'Header banner (MarCom)')}
                hint={tr('PNG/JPG, rộng 720–1440 px, tỉ lệ ~3:1 · hiện nguyên ảnh ở đầu mail · để trống hiện khung chờ', 'PNG/JPG, 720–1440 px wide, ratio ~3:1 · shown in full at the top of the email · leave empty to show a placeholder')}
              >
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                {draft.frameUrl ? (
                  <span className="flex items-center gap-2 border border-slate-300 rounded-[3px] p-1.5">
                    <img src={draft.frameUrl} alt="" className="w-20 h-10 object-cover rounded-[2px]" />
                    <span className="flex-1 min-w-0 text-[12px] text-slate-700 truncate">{draft.frameName}</span>
                    <Btn icon={Upload} className="h-7" onClick={() => fileRef.current?.click()}>
                      {tr('Đổi', 'Change')}
                    </Btn>
                    <Btn variant="danger" icon={Trash2} className="h-7" onClick={() => set({ frameUrl: null, frameName: null })}>
                      {tr('Xoá', 'Remove')}
                    </Btn>
                  </span>
                ) : (
                  <Btn icon={ImageIcon} onClick={() => fileRef.current?.click()}>
                    {tr('Tải banner đầu', 'Upload header banner')}
                  </Btn>
                )}
              </FormRow>
              <FormRow label={tr('Banner cuối mail (MarCom)', 'Footer banner (MarCom)')} hint={tr('Tuỳ chọn · PNG/JPG, rộng 720–1440 px · hiện nguyên ảnh ở cuối mail, dưới lời chúc', 'Optional · PNG/JPG, 720–1440 px wide · shown in full at the bottom of the email, below the greeting')}>
                <input ref={footerRef} type="file" accept="image/*" className="hidden" onChange={(e) => (onFooterFile(e.target.files?.[0]), (e.target.value = ''))} />
                {draft.footerUrl ? (
                  <span className="flex items-center gap-2 border border-slate-300 rounded-[3px] p-1.5">
                    <img src={draft.footerUrl} alt="" className="w-20 h-10 object-cover rounded-[2px]" />
                    <span className="flex-1 min-w-0 text-[12px] text-slate-700 truncate">{draft.footerName}</span>
                    <Btn icon={Upload} className="h-7" onClick={() => footerRef.current?.click()}>
                      {tr('Đổi', 'Change')}
                    </Btn>
                    <Btn variant="danger" icon={Trash2} className="h-7" onClick={() => set({ footerUrl: null, footerName: null })}>
                      {tr('Xoá', 'Remove')}
                    </Btn>
                  </span>
                ) : (
                  <Btn icon={ImageIcon} onClick={() => footerRef.current?.click()}>
                    {tr('Tải banner cuối', 'Upload footer banner')}
                  </Btn>
                )}
              </FormRow>
            </div>
          </Panel>
        </div>

        <div className="space-y-3 min-w-0">
          <Panel
            title={tr('Xem trước template', 'Template preview')}
            icon={Eye}
            noPad
            actions={
              <>
                <Segmented
                  options={[
                    { key: 'template' as const, label: tr('Template (biến)', 'Template (variables)') },
                    { key: 'sample' as const, label: tr('Xem thử với dữ liệu', 'Preview with data') },
                  ]}
                  value={view}
                  onChange={setView}
                />
                <Segmented
                  options={[
                    { key: 'desktop' as const, label: tr('Máy tính', 'Desktop') },
                    { key: 'tablet' as const, label: 'Tablet' },
                    { key: 'mobile' as const, label: tr('Điện thoại', 'Mobile') },
                  ]}
                  value={device}
                  onChange={setDevice}
                />
                <Btn icon={Maximize2} className="h-7" onClick={() => setFull(true)} title={tr('Xem toàn màn hình (Esc để đóng)', 'Full screen (Esc to close)')}>
                  {tr('Toàn màn hình', 'Full screen')}
                </Btn>
                {view === 'sample' && (
                  <select value={sample?.id} onChange={(e) => setSampleId(e.target.value)} className={`${erp.input} h-7 text-[12px] w-56`} title={tr('Chỉ để xem thử — không phải người nhận', 'Preview only — not a recipient')}>
                    {sampleList.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} — {kind === 'birthday' ? fmtDate(e.dob).slice(0, 5) : fmtDate(e.onboardDate)}
                        {e.photoUrl ? '' : tr(' (chưa có ảnh)', ' (no photo)')}
                      </option>
                    ))}
                  </select>
                )}
              </>
            }
          >
            {view === 'template' || !sample ? (
              <>
                <FieldTable
                  labelWidth="90px"
                  rows={[
                    { label: tr('Từ', 'From'), value: 'VTX Group · MarCom <marcom@aequitas.vn>' },
                    {
                      label: tr('Tới', 'To'),
                      value: (
                        <span>
                          <VarText text="{{email}}" /> <span className="text-[11px] text-slate-500">{tr(`— email nội bộ của từng nhân sự ${kind === 'birthday' ? 'có sinh nhật' : 'onboard'} hôm đó (job tự điền, mỗi người 1 email riêng)`, `— internal email of each employee ${kind === 'birthday' ? 'with a birthday' : 'onboarding'} that day (filled in by the job, one separate email per person)`)}</span>
                        </span>
                      ),
                    },
                    { label: tr('Tiêu đề', 'Subject'), value: <VarText text={draft.subject} />, strong: true },
                  ]}
                />
                <div className="p-4 bg-[#eef1f5]">
                  <div className="mx-auto w-full bg-white border border-slate-300 rounded-[4px] overflow-hidden transition-[max-width] duration-200" style={{ maxWidth: DEVICE_WIDTH[device] }}>
                    <BannerMail kind={kind} cfg={draft} device={device} body={<VarText text={draft.body} />} />
                  </div>
                </div>
                <div className="px-3 py-1.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
                  {tr('Các ô', 'The')} <span className="px-1 rounded-[3px] border border-[#b9d3f0] bg-[#eaf2fc] text-[#1f5fa8] font-mono">{"{{…}}"}</span> {tr('và ảnh được job điền theo hồ sơ Employee của từng người nhận khi gửi.', 'fields and the photo are filled in by the job from each recipient’s Employee profile at send time.')}
                </div>
              </>
            ) : (
              <>
                <FieldTable
                  labelWidth="90px"
                  rows={[
                    { label: tr('Từ', 'From'), value: 'VTX Group · MarCom <marcom@aequitas.vn>' },
                    { label: tr('Tới', 'To'), value: sample.email },
                    { label: tr('Tiêu đề', 'Subject'), value: fillTemplate(draft.subject, sample), strong: true },
                  ]}
                />
                <div className="p-4 bg-[#eef1f5]">
                  <div className="mx-auto w-full bg-white border border-slate-300 rounded-[4px] overflow-hidden transition-[max-width] duration-200" style={{ maxWidth: DEVICE_WIDTH[device] }}>
                    <BannerMail kind={kind} cfg={draft} e={sample} device={device} body={fillTemplate(draft.body, sample)} />
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 border-t text-[11px] ${sample.photoUrl ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-amber-300 bg-amber-50 text-amber-800'}`}>
                  {sample.photoUrl ? (
                    <>
                      <Avatar e={sample} size={18} /> {tr('Xem thử bằng dữ liệu của', 'Previewing with data of')} {sample.name} · {tr('ảnh từ', 'photo from')} <span className="font-mono text-[#1f5fa8]">{sample.photoSource === 'upload' ? tr('ảnh MarCom tải lên', 'MarCom upload') : `Employee › ${sample.code}`}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={13} />{' '}
                      {tr(
                        `Hồ sơ Employee ${sample.code} chưa có ảnh → ${draft.noPhoto === 'default' ? 'dùng ảnh mặc định' : 'gửi không kèm ảnh'}. Cần HCNS bổ sung ảnh trên Employee.`,
                        `Employee profile ${sample.code} has no photo → ${draft.noPhoto === 'default' ? 'default photo is used' : 'sent without photo'}. HR needs to add a photo in Employee.`,
                      )}
                    </>
                  )}
                </div>
              </>
            )}
          </Panel>

          <Panel
            title={tr('Job gửi tự động', 'Auto-send job')}
            icon={Clock}
            noPad
            actions={<span className="text-[12px] text-slate-600">{tr('Lần chạy kế tiếp', 'Next run')}: <b>{fmtDate(nextRunDay)} {draft.sendTime}</b></span>}
            footer={tr(
              `Mỗi ngày ${draft.sendTime}: (1) lọc nhân sự ${kind === 'birthday' ? 'có sinh nhật hôm đó' : 'có ngày onboard hôm đó'} từ Employee → (2) điền template theo hồ sơ từng người → (3) gửi tới email nội bộ của người đó → (4) ghi Lịch sử gửi`,
              `Daily at ${draft.sendTime}: (1) find employees ${kind === 'birthday' ? 'with a birthday that day' : 'onboarding that day'} in Employee → (2) fill the template from each person’s profile → (3) send to that person’s internal email → (4) record in Send history`,
            )}
          >
            {!draft.enabled ? (
              <div className="px-3 py-4 text-[12px] text-slate-400">{tr('Đang tắt gửi tự động.', 'Auto-send is off.')}</div>
            ) : (
              <table className={erp.table}>
                <thead>
                  <tr>
                    <th className={`${erp.th} text-left`}>{tr('Người nhận', 'Recipient')}</th>
                    <th className={`${erp.th} text-left`}>{tr('Gửi tới', 'Sent to')}</th>
                    <th className={`${erp.th} text-left`}>{tr('Tiêu đề sau khi điền', 'Subject after filling')}</th>
                    <th className={`${erp.th} text-left`}>{kind === 'birthday' ? tr('Ảnh chúc mừng', 'Greeting photo') : tr('Ảnh trên Employee', 'Photo in Employee')}</th>
                  </tr>
                </thead>
                <tbody>
                  {nextRecipients.length === 0 && (
                    <tr>
                      <td colSpan={4} className={`${erp.td} py-5 text-center text-slate-400`}>
                        {tr('Không có ai thỏa điều kiện — job vẫn chạy nhưng không gửi.', 'No one matches — the job still runs but sends nothing.')}
                      </td>
                    </tr>
                  )}
                  {nextRecipients.map((e) => (
                    <tr key={e.id} className={erp.tr}>
                      <td className={erp.td}>
                        <span className="flex items-center gap-2">
                          <Avatar e={e} size={22} />
                          <span className="font-semibold">{e.name}</span>
                        </span>
                      </td>
                      <td className={erp.td}>{e.email}</td>
                      <td className={erp.td}>{fillTemplate(draft.subject, e)}</td>
                      <td className={erp.td}>{photoNote(e)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>

          <div className="px-3 py-2 bg-white border border-slate-300 rounded-[4px] text-[11px] text-slate-600 space-y-0.5">
            <div className="font-bold text-[#1e3a5f]">{tr('Quy tắc gửi', 'Sending rules')}</div>
            <div>
              •{' '}
              {tr(
                `Chỉ gửi CBNV đang làm việc, có email nội bộ; mỗi người nhận 1 lần (${kind === 'birthday' ? 'mỗi năm' : 'duy nhất'}) — không gửi trùng.`,
                `Only active employees with an internal email; each person receives it ${kind === 'birthday' ? 'once a year' : 'only once'} — no duplicates.`,
              )}
            </div>
            {kind === 'birthday' ? <div>• {tr('Sinh nhật 29/02: năm không nhuận gửi vào 28/02.', 'Birthday on 29/02: sent on 28/02 in non-leap years.')}</div> : <div>• {tr('Cancel Onboard thì không gửi; đổi ngày onboard trên Employee thì lịch gửi tự dời theo.', 'Not sent on Cancel Onboard; changing the onboard date in Employee reschedules the email automatically.')}</div>}
            <div>• {tr('Gửi lỗi: tự thử lại 3 lần trong 30 phút, sau đó hiện ở tab Lịch sử gửi để MarCom gửi lại.', 'Failed sends are retried automatically 3 times within 30 minutes, then shown in the Send history tab for MarCom to resend.')}</div>
          </div>
        </div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
const BoxEditor: React.FC<{ toast: (m: string) => void }> = ({ toast }) => {
  const { config, updateBoxConfig } = useMarcom();
  const { tr, en } = useMarcomLang();
  const saved = config.box;
  const [draft, setDraft] = useState<BoxConfig>(saved);
  const [target, setTarget] = useState<'home' | 'teams'>('home');
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const bgRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const people = useTodayBirthdays(simulateEmpty);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const set = (patch: Partial<BoxConfig>) => setDraft((d) => ({ ...d, ...patch }));
  const textarea = 'w-full border border-slate-300 rounded-[3px] px-2 py-1.5 text-[13px] leading-relaxed outline-none focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#1f5fa8]/15';

  const today = startOfDay(new Date());
  const nextPost = isPastTimeToday(draft.teamsPostTime) ? addDays(today, 1) : today;
  const pickImage = (f: File | undefined, apply: (url: string, name: string) => void) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast(tr('Chỉ nhận file ảnh (PNG/JPG)', 'Only image files are accepted (PNG/JPG)'));
    if (f.size > MAX_IMAGE_BYTES) return toast(tr('Ảnh tối đa 5MB', 'Maximum image size is 5MB'));
    apply(URL.createObjectURL(f), f.name);
  };
  // Banner trang chủ — chạy slide cùng box sinh nhật
  const banners = draft.banners || [];
  const setBanners = (fn: (l: HomeBanner[]) => HomeBanner[]) => setDraft((d) => ({ ...d, banners: fn(d.banners || []) }));
  const patchBanner = (id: string, patch: Partial<HomeBanner>) => setBanners((l) => l.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const moveBanner = (i: number, d: number) =>
    setBanners((l) => {
      const n = [...l];
      [n[i], n[i + d]] = [n[i + d], n[i]];
      return n;
    });
  const addBanners = (files: FileList | null) => {
    const list = [...(files || [])];
    const imgs = list.filter((f) => f.type.startsWith('image/') && f.size <= MAX_IMAGE_BYTES);
    if (imgs.length < list.length) toast(tr('Chỉ nhận file ảnh PNG/JPG/WebP tối đa 5MB — đã bỏ qua file khác', 'Only PNG/JPG/WebP images up to 5MB are accepted — other files were skipped'));
    if (!imgs.length) return;
    setBanners((l) => [...l, ...imgs.map((f, k) => ({ id: `bn-${Date.now()}-${k}`, name: f.name.replace(/\.[^.]+$/, ''), url: URL.createObjectURL(f), link: '', active: true }))]);
  };
  const activeBanners = banners.filter((b) => b.active).length;
  const insertBody = (token: string) => {
    const el = bodyRef.current;
    if (!el) return set({ teamsBody: draft.teamsBody + token });
    const a = el.selectionStart ?? draft.teamsBody.length;
    const b = el.selectionEnd ?? a;
    set({ teamsBody: draft.teamsBody.slice(0, a) + token + draft.teamsBody.slice(b) });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(a + token.length, a + token.length);
    });
  };
  const imageField = (url: string | null, name: string | null, ref: React.RefObject<HTMLInputElement | null>, onClear: () => void, label: string) =>
    url ? (
      <span className="flex items-center gap-2 border border-slate-300 rounded-[3px] p-1.5">
        <img src={url} alt="" className="w-20 h-10 object-cover rounded-[2px]" />
        <span className="flex-1 min-w-0 text-[12px] text-slate-700 truncate">{name}</span>
        <Btn icon={Upload} className="h-7" onClick={() => ref.current?.click()}>
          {tr('Đổi', 'Change')}
        </Btn>
        <Btn variant="danger" icon={Trash2} className="h-7" onClick={onClear}>
          {tr('Xoá', 'Remove')}
        </Btn>
      </span>
    ) : (
      <Btn icon={ImageIcon} onClick={() => ref.current?.click()}>
        {label}
      </Btn>
    );

  return (
    <>
      {/* Thanh thao tác */}
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-[4px]">
        {/* Kênh Teams tạm ẩn → chỉ thiết kế cho trang chủ */}
        {TEAMS_POST_ENABLED && (
          <>
            <span className="text-[12px] text-slate-600">{tr('Thiết kế cho', 'Design for')}</span>
            <Segmented
              options={[
                { key: 'home' as const, label: tr('Trang chủ iMIS', 'iMIS home page') },
                { key: 'teams' as const, label: 'Microsoft Teams' },
              ]}
              value={target}
              onChange={setTarget}
            />
            <span className="w-px h-5 bg-slate-200 mx-1" />
          </>
        )}
        <Btn
          variant="primary"
          icon={Save}
          disabled={!dirty}
          onClick={() => {
            updateBoxConfig(draft);
            toast(
              TEAMS_POST_ENABLED
                ? tr('Đã lưu thiết kế box sinh nhật (trang chủ & Teams)', 'Birthday box design saved (home page & Teams)')
                : tr('Đã lưu thiết kế box sinh nhật (trang chủ)', 'Birthday box design saved (home page)'),
            );
          }}
        >
          {tr('Lưu', 'Save')}
        </Btn>
        <Btn icon={RotateCcw} disabled={!dirty} onClick={() => setDraft(saved)}>
          {tr('Hoàn tác', 'Undo')}
        </Btn>
        {dirty && <span className="text-[12px] text-amber-700">{tr('Có thay đổi chưa lưu', 'Unsaved changes')}</span>}
        {target === 'teams' && (
          <span className="ml-auto flex items-center gap-1.5">
            <Btn icon={Send} disabled={!draft.postToTeams} onClick={() => toast(tr('Đã gửi bài thử tới chat riêng của bạn trên Teams (mock)', 'Test post sent to your private Teams chat (mock)'))}>
              {tr('Gửi thử (chat riêng)', 'Send test (private chat)')}
            </Btn>
            <Btn
              variant="success"
              icon={Megaphone}
              disabled={!draft.postToTeams || (people.length === 0 && draft.emptyMode === 'hide')}
              onClick={() => toast(tr(`Đã đăng bài sinh nhật lên ${draft.teamsTeam} › ${draft.teamsChannel} (mock)`, `Birthday post published to ${draft.teamsTeam} › ${draft.teamsChannel} (mock)`))}
            >
              {tr('Đăng ngay lên Teams', 'Post to Teams now')}
            </Btn>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,480px)_minmax(0,1fr)] gap-3 items-start">
        <div className="space-y-3 min-w-0">
          {target === 'home' ? (
            <>
              <Panel title={tr('Hiển thị trang chủ iMIS', 'iMIS home page display')} icon={LayoutTemplate}>
                <FormRow label={tr('Trạng thái', 'Status')}>
                  <span className="flex items-center gap-2 h-8">
                    <Switch on={draft.showOnHome} onChange={(v) => set({ showOnHome: v })} />
                    <span className="text-[12px] text-slate-700">{draft.showOnHome ? tr('Hiển thị box cho toàn thể CBNV', 'Show the box to all employees') : tr('Không hiển thị', 'Hidden')}</span>
                  </span>
                </FormRow>
              </Panel>

              <Panel
                title={tr('Banner trang chủ (chạy slide)', 'Home page banners (slideshow)')}
                icon={GalleryHorizontal}
                actions={
                  <>
                    <input ref={bannerRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => (addBanners(e.target.files), (e.target.value = ''))} data-testid="banner-input" />
                    <Btn icon={Upload} className="h-7" onClick={() => bannerRef.current?.click()}>
                      {tr('Tải banner', 'Upload banner')}
                    </Btn>
                  </>
                }
                footer={tr(
                  `Slide chạy lần lượt: Sinh nhật hôm nay → ${activeBanners ? `${activeBanners} banner đang bật` : 'banner'} · mỗi mục ${draft.slideSeconds || 5} giây · di chuột vào thì dừng. Ảnh khuyến nghị 1600×400 px.`,
                  `Slideshow order: Today’s birthdays → ${activeBanners ? `${activeBanners} active banner(s)` : 'banners'} · ${draft.slideSeconds || 5} seconds each · pauses on hover. Recommended image size 1600×400 px.`,
                )}
              >
                <div className="space-y-2.5">
                  <FormRow label={tr('Thời gian mỗi mục', 'Duration per slide')}>
                    <span className="flex items-center gap-2">
                      <select value={draft.slideSeconds || 5} onChange={(e) => set({ slideSeconds: Number(e.target.value) })} className={`${erp.input} w-24`}>
                        {[3, 5, 7, 10, 15].map((x) => (
                          <option key={x} value={x}>
                            {x} {tr('giây', 'sec')}
                          </option>
                        ))}
                      </select>
                    </span>
                  </FormRow>
                  {!banners.length ? (
                    <div className="border border-dashed border-slate-300 rounded-[4px] bg-slate-50 py-5 text-center text-[12px] text-slate-500">
                      {tr('Chưa có banner — trang chủ chỉ hiện box sinh nhật.', 'No banners yet — the home page shows only the birthday box.')}{' '}
                      <button type="button" onClick={() => bannerRef.current?.click()} className="text-[#1f5fa8] font-semibold hover:underline cursor-pointer">
                        {tr('Tải banner', 'Upload banner')}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5" data-testid="banner-list">
                      {banners.map((b, i) => (
                        <div key={b.id} className={`flex items-start gap-2 border rounded-[3px] p-1.5 ${b.active ? 'border-slate-300 bg-white' : 'border-slate-200 bg-slate-50 opacity-70'}`}>
                          <img src={b.url} alt="" className="w-[136px] h-[34px] object-cover rounded-[2px] border border-slate-200 shrink-0" />
                          <div className="flex-1 min-w-0 space-y-1">
                            <input value={b.name} onChange={(e) => patchBanner(b.id, { name: e.target.value })} placeholder={tr('Tên banner', 'Banner name')} className={`${erp.inputFull} h-7 text-[12px]`} />
                            <input value={b.link} onChange={(e) => patchBanner(b.id, { link: e.target.value })} placeholder={tr('Link khi bấm vào banner (tuỳ chọn) — https://...', 'Link when the banner is clicked (optional) — https://...')} className={`${erp.inputFull} h-7 text-[12px]`} />
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="flex items-center gap-1.5" title={b.active ? tr('Đang hiển thị', 'Visible') : tr('Đang ẩn', 'Hidden')}>
                              <span className="text-[11px] text-slate-500">{i + 1}</span>
                              <Switch on={b.active} onChange={(v) => patchBanner(b.id, { active: v })} />
                            </span>
                            <span className="flex items-center gap-0.5">
                              <button type="button" disabled={i === 0} onClick={() => moveBanner(i, -1)} className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer" title={tr('Lên trước', 'Move up')}>
                                <ArrowUp size={13} />
                              </button>
                              <button type="button" disabled={i === banners.length - 1} onClick={() => moveBanner(i, 1)} className="p-1 rounded text-slate-500 hover:bg-slate-100 disabled:opacity-30 cursor-pointer" title={tr('Xuống sau', 'Move down')}>
                                <ArrowDown size={13} />
                              </button>
                              <button type="button" onClick={() => setBanners((l) => l.filter((x) => x.id !== b.id))} className="p-1 rounded text-rose-500 hover:bg-rose-50 cursor-pointer" title={tr('Xoá banner', 'Remove banner')}>
                                <Trash2 size={13} />
                              </button>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Panel>

              <Panel title={tr('Thiết kế box', 'Box design')} icon={Palette}>
                <div className="space-y-2.5">
                  <FormRow label={tr('Bố cục', 'Layout')}>
                    <Segmented
                      options={[
                        { key: 'cards' as const, label: tr('Thẻ', 'Cards') },
                        { key: 'list' as const, label: tr('Danh sách', 'List') },
                        { key: 'banner' as const, label: tr('Banner ảnh nền', 'Background banner') },
                      ]}
                      value={draft.layout}
                      onChange={(v) => set({ layout: v })}
                    />
                  </FormRow>
                  <FormRow label={tr('Màu chủ đạo', 'Theme color')}>
                    <span className="flex items-center gap-1.5 h-8">
                      {(Object.keys(BOX_THEMES) as BoxTheme[]).map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => set({ theme: k })}
                          title={en ? BOX_THEMES[k].labelEn : BOX_THEMES[k].label}
                          className={`w-6 h-6 rounded-full ${BOX_THEMES[k].swatch} cursor-pointer ${draft.theme === k ? 'ring-2 ring-offset-2 ring-slate-500' : 'opacity-80 hover:opacity-100'}`}
                        />
                      ))}
                      <span className="ml-1 text-[12px] text-slate-500">{en ? BOX_THEMES[draft.theme].labelEn : BOX_THEMES[draft.theme].label}</span>
                    </span>
                  </FormRow>
                  <FormRow label={tr('Ảnh nền (MarCom)', 'Background image (MarCom)')} hint={tr('Dùng cho bố cục Banner · khuyến nghị 1600×500 · để trống dùng nền theo màu chủ đạo', 'For the Banner layout · recommended 1600×500 · leave empty to use the theme color')}>
                    <input ref={bgRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickImage(e.target.files?.[0], (url, name) => set({ bgUrl: url, bgName: name, layout: 'banner' }))} />
                    {imageField(draft.bgUrl, draft.bgName, bgRef, () => set({ bgUrl: null, bgName: null }), tr('Tải ảnh nền', 'Upload background'))}
                  </FormRow>
                  <FormRow label={tr('Kiểu ảnh nhân sự', 'Employee photo style')}>
                    <Segmented
                      options={[
                        { key: 'circle' as const, label: tr('Tròn', 'Circle') },
                        { key: 'rounded' as const, label: tr('Vuông bo góc', 'Rounded square') },
                      ]}
                      value={draft.photoShape}
                      onChange={(v) => set({ photoShape: v })}
                    />
                  </FormRow>
                  <FormRow label={tr('Thông tin hiển thị', 'Displayed info')} hint={tr('Luôn có ảnh chúc mừng và họ tên', 'Greeting photo and full name are always shown')}>
                    <span className="flex items-center gap-4 h-8 text-[12px] text-slate-700">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={draft.showDivision} onChange={(e) => set({ showDivision: e.target.checked })} className="accent-[#1f5fa8]" />
                        {tr('Division (Khối)', 'Division')}
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={draft.showPosition} onChange={(e) => set({ showPosition: e.target.checked })} className="accent-[#1f5fa8]" />
                        {tr('Vị trí', 'Position')}
                      </label>
                    </span>
                  </FormRow>
                </div>
              </Panel>

              <Panel title={tr('Nội dung box', 'Box content')} icon={FileText}>
                <div className="space-y-2.5">
                  <FormRow label={tr('Tiêu đề', 'Title')}>
                    <span className="flex items-center gap-1.5">
                      <input value={draft.title} onChange={(e) => set({ title: e.target.value })} className={erp.inputFull} />
                      <button
                        type="button"
                        onClick={() => set({ title: draft.title + '{{soluong}}' })}
                        title={tr('Số người sinh nhật hôm nay', 'Number of birthdays today')}
                        className="shrink-0 px-1.5 py-px rounded-[3px] border border-[#b9d3f0] bg-[#eaf2fc] text-[#1f5fa8] text-[11px] font-mono hover:bg-[#dbe9fa] cursor-pointer"
                      >
                        {'{{soluong}}'}
                      </button>
                    </span>
                  </FormRow>
                  <FormRow label={tr('Lời chúc chung', 'Common greeting')}>
                    <textarea rows={3} value={draft.greeting} onChange={(e) => set({ greeting: e.target.value })} className={textarea} />
                  </FormRow>
                  <FormRow label={tr('Ký tên', 'Signature')}>
                    <input value={draft.signature} onChange={(e) => set({ signature: e.target.value })} className={erp.inputFull} />
                  </FormRow>
                </div>
              </Panel>
            </>
          ) : (
            <>
              <Panel title={tr('Kênh đăng Microsoft Teams', 'Microsoft Teams channel')} icon={Megaphone}>
                <div className="space-y-2.5">
                  <FormRow label={tr('Trạng thái', 'Status')}>
                    <span className="flex items-center gap-2 h-8">
                      <Switch on={draft.postToTeams} onChange={(v) => set({ postToTeams: v })} />
                      <span className="text-[12px] text-slate-700">{draft.postToTeams ? tr('Tự động đăng bài mỗi ngày', 'Post automatically every day') : tr('Không đăng', 'Not posting')}</span>
                    </span>
                  </FormRow>
                  <FormRow label="Team" hint={tr('Danh sách team lấy từ Microsoft Teams của công ty', 'Team list from the company’s Microsoft Teams')}>
                    <select
                      value={draft.teamsTeam}
                      onChange={(e) => {
                        const t = TEAMS_DIRECTORY.find((x) => x.team === e.target.value);
                        set({ teamsTeam: e.target.value, teamsChannel: t?.channels[0] ?? '' });
                      }}
                      className={erp.inputFull}
                    >
                      {TEAMS_DIRECTORY.map((t) => (
                        <option key={t.team}>{t.team}</option>
                      ))}
                    </select>
                  </FormRow>
                  <FormRow label={tr('Kênh', 'Channel')}>
                    <select value={draft.teamsChannel} onChange={(e) => set({ teamsChannel: e.target.value })} className={erp.inputFull}>
                      {(TEAMS_DIRECTORY.find((t) => t.team === draft.teamsTeam)?.channels ?? []).map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </FormRow>
                  <FormRow label={tr('Giờ đăng', 'Post time')} hint={`${tr('Lần đăng kế tiếp', 'Next post')}: ${fmtDate(nextPost)} ${draft.teamsPostTime}`}>
                    <input type="time" value={draft.teamsPostTime} onChange={(e) => set({ teamsPostTime: e.target.value })} className={`${erp.input} w-32`} />
                  </FormRow>
                </div>
              </Panel>

              <Panel
                title={tr('Tài khoản đăng bài', 'Posting account')}
                icon={UserSquare2}
                actions={<Tag cls={TAG.green}>{tr('Đã kết nối', 'Connected')}</Tag>}
                footer={tr('Cố định Bot iMIS dành riêng cho MarCom — không đổi tài khoản / ảnh đại diện. Kết nối & quyền đăng do quản trị hệ thống cấu hình.', 'Fixed to the iMIS Bot dedicated to MarCom — the account / avatar cannot be changed. Connection & posting permissions are configured by the system administrator.')}
              >
                <span className="flex items-center gap-3">
                  <SenderAvatar size={36} />
                  <span>
                    <span className="block text-[13px] font-bold text-slate-800">{TEAMS_SENDER.name}</span>
                    <span className="block text-[11px] text-slate-500">{en ? TEAMS_SENDER.accountEn : TEAMS_SENDER.account}</span>
                  </span>
                </span>
              </Panel>

              <Panel
                title={tr('Nội dung bài đăng', 'Post content')}
                icon={FileText}
                footer={tr('Dòng chỉ chứa {{danhsach}} sẽ thành danh sách: 🎂 @Họ tên – Vị trí, Khối (mỗi người 1 dòng, @mention đúng người) · **chữ** = in đậm', 'A line containing only {{danhsach}} becomes the list: 🎂 @Full name – Position, Division (one line per person, @mentioning the right person) · **text** = bold')}
              >
                <div className="space-y-2.5">
                  <FormRow label={tr('Dòng tiêu đề', 'Header line')}>
                    <input value={draft.teamsHeader} onChange={(e) => set({ teamsHeader: e.target.value })} className={erp.inputFull} />
                  </FormRow>
                  <FormRow label="@mention team">
                    <span className="flex items-center gap-2 h-8">
                      <Switch on={draft.teamsMentionAll} onChange={(v) => set({ teamsMentionAll: v })} />
                      <span className="text-[12px] text-slate-700">{draft.teamsMentionAll ? tr(`Gắn @${draft.teamsTeam} sau dòng tiêu đề`, `Mention @${draft.teamsTeam} after the header line`) : tr('Không gắn', 'Off')}</span>
                    </span>
                  </FormRow>
                  <FormRow label={tr('Biến chèn', 'Placeholders')} hint={tr('Bấm để chèn vào vị trí con trỏ', 'Click to insert at the cursor')}>
                    <span className="flex flex-wrap gap-1 pt-1">
                      {TEAMS_PLACEHOLDERS.map((p) => (
                        <button key={p.key} type="button" onClick={() => insertBody(p.key)} title={en ? p.descEn : p.desc} className="px-1.5 py-px rounded-[3px] border border-[#b9d3f0] bg-[#eaf2fc] text-[#1f5fa8] text-[11px] font-mono hover:bg-[#dbe9fa] cursor-pointer">
                          {p.key}
                        </button>
                      ))}
                    </span>
                  </FormRow>
                  <FormRow label={tr('Nội dung', 'Content')}>
                    <textarea ref={bodyRef} rows={14} value={draft.teamsBody} onChange={(e) => set({ teamsBody: e.target.value })} className={textarea} />
                  </FormRow>
                </div>
              </Panel>

              <Panel
                title={tr('Ảnh thiệp đính kèm', 'Attached card image')}
                icon={ImageIcon}
                footer={tr('Thiệp tự ghép mỗi ngày: ảnh polaroid từng người (ảnh chúc mừng) + họ tên + Vị trí - Khối; tối đa 4 người/thiệp', 'The card is composed daily: a polaroid photo of each person (greeting photo) + full name + Position - Division; up to 4 people per card')}
              >
                <div className="space-y-2.5">
                  <FormRow label={tr('Đính kèm thiệp', 'Attach card')}>
                    <span className="flex items-center gap-2 h-8">
                      <Switch on={draft.teamsAttachCard} onChange={(v) => set({ teamsAttachCard: v })} />
                      <span className="text-[12px] text-slate-700">{draft.teamsAttachCard ? tr('Có — gửi kèm ảnh thiệp', 'Yes — attach the card image') : tr('Chỉ gửi văn bản', 'Text only')}</span>
                    </span>
                  </FormRow>
                  {draft.teamsAttachCard && (
                    <FormRow label={tr('Nền thiệp (MarCom)', 'Card background (MarCom)')} hint={tr('PNG/JPG vuông, khuyến nghị 1080×1080 · để trống dùng mẫu mặc định', 'Square PNG/JPG, recommended 1080×1080 · leave empty to use the default template')}>
                      <input ref={cardRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickImage(e.target.files?.[0], (url, name) => set({ cardBgUrl: url, cardBgName: name }))} />
                      {imageField(draft.cardBgUrl, draft.cardBgName, cardRef, () => set({ cardBgUrl: null, cardBgName: null }), tr('Tải nền thiệp', 'Upload card background'))}
                    </FormRow>
                  )}
                </div>
              </Panel>
            </>
          )}

          <Panel title={tr('Khi không có sinh nhật', 'When there are no birthdays')} icon={Cake}>
            <div className="space-y-2.5">
              <FormRow
                label={tr('Xử lý', 'Handling')}
                hint={
                  TEAMS_POST_ENABLED
                    ? draft.emptyMode === 'hide'
                      ? tr('Trang chủ ẩn box · Teams không đăng bài', 'Home page hides the box · Teams does not post')
                      : tr('Trang chủ & Teams hiện nội dung mặc định', 'Home page & Teams show the default content')
                    : draft.emptyMode === 'hide'
                      ? tr('Trang chủ ẩn box', 'Home page hides the box')
                      : tr('Trang chủ hiện nội dung mặc định', 'Home page shows the default content')
                }
              >
                <Segmented
                  options={[
                    { key: 'hide' as const, label: tr('Ẩn box / không đăng', 'Hide box / do not post') },
                    { key: 'default' as const, label: tr('Nội dung mặc định', 'Default content') },
                  ]}
                  value={draft.emptyMode}
                  onChange={(v) => set({ emptyMode: v })}
                />
              </FormRow>
              {draft.emptyMode === 'default' && (
                <FormRow label={tr('Nội dung mặc định', 'Default content')}>
                  <textarea rows={2} value={draft.emptyText} onChange={(e) => set({ emptyText: e.target.value })} className={textarea} />
                </FormRow>
              )}
            </div>
          </Panel>
        </div>

        <Panel
          title={target === 'home' ? tr('Xem trước · Trang chủ iMIS', 'Preview · iMIS home page') : tr('Xem trước · Microsoft Teams', 'Preview · Microsoft Teams')}
          icon={Eye}
          actions={
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600 cursor-pointer select-none">
              <input type="checkbox" checked={simulateEmpty} onChange={(e) => setSimulateEmpty(e.target.checked)} className="accent-[#1f5fa8]" />
              {tr('Giả lập ngày không có sinh nhật', 'Simulate a day with no birthdays')}
            </label>
          }
          footer={tr('Danh sách người sinh nhật lấy tự động từ hồ sơ Employee theo ngày, kèm ảnh chúc mừng', 'The birthday list is taken automatically from Employee profiles by date, with each greeting photo')}
        >
          {target === 'home' ? (
            draft.showOnHome ? (
              <BirthdayBox preview simulateEmpty={simulateEmpty} cfg={draft} />
            ) : (
              <div className="border border-dashed border-slate-300 rounded-[4px] bg-slate-50 py-8 text-center text-[12px] text-slate-400">{tr('Đang tắt hiển thị trên trang chủ iMIS.', 'Display on the iMIS home page is off.')}</div>
            )
          ) : draft.postToTeams ? (
            <TeamsBirthdayPost cfg={draft} people={people} />
          ) : (
            <div className="border border-dashed border-slate-300 rounded-[4px] bg-slate-50 py-8 text-center text-[12px] text-slate-400">{tr('Đang tắt đăng bài lên Microsoft Teams.', 'Posting to Microsoft Teams is off.')}</div>
          )}
        </Panel>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
const MailLogs: React.FC<{ toast: (m: string) => void }> = ({ toast }) => {
  const { logs, resend } = useMarcom();
  const { tr, note } = useMarcomLang();
  const [kind, setKind] = useState<'all' | MailKind>('all');
  const [status, setStatus] = useState<'all' | 'sent' | 'failed' | 'skipped' | 'test'>('all');
  const rows = logs.filter((l) => (kind === 'all' || l.kind === kind) && (status === 'all' || l.status === status));
  // Đã có bản ghi Thành công (tự thử lại hoặc gửi lại thủ công) → ẩn nút Gửi lại ở bản ghi lỗi
  const resent = new Set(logs.filter((l) => l.status === 'sent').map((l) => `${l.kind}-${l.employeeId}`));

  const statusTag = {
    sent: <Tag cls={TAG.green}>{tr('Thành công', 'Sent')}</Tag>,
    failed: <Tag cls={TAG.rose}>{tr('Lỗi', 'Failed')}</Tag>,
    skipped: <Tag cls={TAG.slate}>{tr('Bỏ qua', 'Skipped')}</Tag>,
    test: <Tag cls={TAG.blue}>{tr('Gửi thử', 'Test')}</Tag>,
  };

  return (
    <Panel title={tr('Lịch sử gửi email', 'Email send history')} icon={History} noPad actions={<span className="text-[12px] text-slate-600">{rows.length} {tr('bản ghi', 'records')}</span>}>
      <div className="p-3 border-b border-slate-200">
        <FilterBar>
          <FilterCell label={tr('Loại mail', 'Email type')}>
            <Segmented
              options={[
                { key: 'all' as const, label: tr('Tất cả', 'All') },
                { key: 'birthday' as const, label: tr('Sinh nhật', 'Birthday') },
                { key: 'welcome' as const, label: 'Welcome' },
              ]}
              value={kind}
              onChange={setKind}
            />
          </FilterCell>
          <FilterCell label={tr('Trạng thái', 'Status')}>
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={`${erp.input} w-40`}>
              <option value="all">{tr('Tất cả', 'All')}</option>
              <option value="sent">{tr('Thành công', 'Sent')}</option>
              <option value="failed">{tr('Lỗi', 'Failed')}</option>
              <option value="skipped">{tr('Bỏ qua', 'Skipped')}</option>
              <option value="test">{tr('Gửi thử', 'Test')}</option>
            </select>
          </FilterCell>
        </FilterBar>
      </div>
      <div className="overflow-x-auto">
        <table className={erp.table}>
          <thead>
            <tr>
              <th className={`${erp.th} text-left`}>{tr('Thời gian', 'Time')}</th>
              <th className={`${erp.th} text-left`}>{tr('Loại', 'Type')}</th>
              <th className={`${erp.th} text-left`}>{tr('Nhân sự', 'Employee')}</th>
              <th className={`${erp.th} text-left`}>{tr('Gửi tới', 'Sent to')}</th>
              <th className={`${erp.th} text-left`}>{tr('Trạng thái', 'Status')}</th>
              <th className={`${erp.th} text-left`}>{tr('Ghi chú', 'Note')}</th>
              <th className={`${erp.th} w-[100px] text-center`}>{tr('Thao tác', 'Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className={`${erp.td} py-10 text-center text-slate-400`}>
                  {tr('Chưa có bản ghi.', 'No records yet.')}
                </td>
              </tr>
            )}
            {rows.map((l) => (
              <tr key={l.id} className={erp.tr}>
                <td className={`${erp.td} whitespace-nowrap`}>{fmtDateTime(l.sentAt)}</td>
                <td className={erp.td}>
                  <span className="inline-flex items-center gap-1">
                    {l.kind === 'birthday' ? <Cake size={12} className="text-pink-500" /> : <Hand size={12} className="text-[#0f8f6c]" />}
                    {l.kind === 'birthday' ? tr('Sinh nhật', 'Birthday') : 'Welcome'}
                  </span>
                </td>
                <td className={`${erp.td} font-semibold`}>{l.employeeName}</td>
                <td className={erp.td}>{l.to}</td>
                <td className={erp.td}>{statusTag[l.status]}</td>
                <td className={`${erp.td} text-slate-500`}>{note(l.note) ?? '—'}</td>
                <td className={`${erp.td} text-center`}>
                  {l.status === 'failed' && !resent.has(`${l.kind}-${l.employeeId}`) && (
                    <Btn
                      className="h-7"
                      icon={Send}
                      onClick={() => {
                        resend(l.id);
                        toast(tr(`Đã gửi lại mail cho ${l.employeeName}`, `Email resent to ${l.employeeName}`));
                      }}
                    >
                      {tr('Gửi lại', 'Resend')}
                    </Btn>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
};
