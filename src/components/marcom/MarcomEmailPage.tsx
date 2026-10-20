/**
 * MarCom · Email tự động (yêu cầu 1.4 + 2.3) + cấu hình Box sinh nhật (1.3).
 *  - Mail sinh nhật: gửi đúng ngày sinh nhật, 09:00. Mail Welcome: gửi đúng ngày onboard, 10:00.
 *  - Nội dung do MarCom cung cấp: tiêu đề/nội dung (biến {{...}}), khung thiệp (ảnh nền) tuỳ chọn.
 *  - Ảnh nhân sự trong thiệp KHÔNG upload tay: lấy tự động từ hồ sơ Employee của từng người nhận rồi ghép vào template.
 *    Hồ sơ chưa có ảnh → dùng ảnh mặc định hoặc gửi không kèm ảnh (cấu hình), kèm cảnh báo để HCNS bổ sung.
 *  - Lịch sử gửi: thành công / lỗi / bỏ qua / gửi thử, gửi lại thủ công khi lỗi.
 * Giao diện: khung ERP (src/components/erp/Erp.tsx) như màn Báo cáo hiệu quả dự án.
 */
import React, { useMemo, useRef, useState } from 'react';
import { Cake, Hand, LayoutTemplate, History, Upload, Trash2, Send, Save, RotateCcw, Image as ImageIcon, Settings2, FileText, Eye, Clock, UserSquare2, AlertTriangle, Megaphone, Palette } from 'lucide-react';
import { useMarcom, MailConfig, BoxConfig, BoxTheme } from '../../marcom/MarcomContext';
import { Avatar, FilterBar, FilterCell, Switch, TAG, useToast } from '../../marcom/MarcomUi';
import { BirthdayBox, BOX_THEMES, useTodayBirthdays } from '../../marcom/BirthdayBox';
import { TeamsBirthdayPost, TEAMS_PLACEHOLDERS, TEAMS_DIRECTORY, TEAMS_SENDER, SenderAvatar } from '../../marcom/TeamsBirthdayPost';
import { Btn, ErpPage, ErpTitleBar, FieldTable, FolderTabs, FormRow, Panel, Segmented, Tag, erp } from '../erp/Erp';
import {
  MailKind, MarcomEmployee, MAIL_PLACEHOLDERS, addDays, fillTemplate, fmtDate, fmtDateTime, inWelcomeBatch, isBirthdayToday, isPastTimeToday,
  startOfDay, toKey,
} from '../../marcom/marcomData';

type Tab = MailKind | 'box' | 'logs';

const KIND_META: Record<MailKind, { label: string; trigger: string; icon: React.ElementType; gradient: string; emoji: string }> = {
  birthday: { label: 'Mail chúc mừng sinh nhật', trigger: 'Đúng ngày sinh nhật của CBNV', icon: Cake, gradient: 'from-pink-500 to-amber-400', emoji: '🎂' },
  welcome: { label: 'Mail Welcome Onboard', trigger: 'Đúng ngày onboard của nhân sự mới', icon: Hand, gradient: 'from-[#1f5fa8] to-[#0f8f6c]', emoji: '🎉' },
};

/** Ảnh mặc định khi hồ sơ Employee chưa có ảnh. */
const DEFAULT_PHOTO = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" fill="#e2e8f0"/><circle cx="120" cy="96" r="44" fill="#94a3b8"/><path d="M40 240c8-52 42-78 80-78s72 26 80 78z" fill="#94a3b8"/></svg>',
)}`;

export const MarcomEmailPage: React.FC = () => {
  const { config } = useMarcom();
  const [tab, setTab] = useState<Tab>('birthday');
  const { toast, toastNode } = useToast();

  return (
    <ErpPage>
      {toastNode}
      <ErpTitleBar
        crumbs={['Human Resources', 'MarCom', 'Email tự động MarCom']}
        title="Email tự động MarCom"
      />
      <FolderTabs
        tabs={[
          { key: 'birthday' as Tab, label: 'Mail sinh nhật', icon: Cake },
          { key: 'welcome' as Tab, label: 'Mail Welcome Onboard', icon: Hand },
          { key: 'box' as Tab, label: 'Box sinh nhật (Trang chủ & Teams)', icon: LayoutTemplate },
          { key: 'logs' as Tab, label: 'Lịch sử gửi', icon: History },
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

/** e = undefined → chế độ template: ảnh/tên/khối hiển thị dạng biến (job điền theo từng người nhận). */
const GreetingCard: React.FC<{ kind: MailKind; cfg: MailConfig; e?: MarcomEmployee }> = ({ kind, cfg, e }) => {
  const meta = KIND_META[kind];
  const photo = e ? e.photoUrl ?? (cfg.noPhoto === 'default' ? DEFAULT_PHOTO : null) : DEFAULT_PHOTO;
  const showPhoto = cfg.usePhoto && !!photo;
  return (
    <div className="relative h-[230px] overflow-hidden">
      {cfg.frameUrl ? (
        <img src={cfg.frameUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient}`}>
          <span className="absolute top-3 left-4 text-3xl opacity-80">{meta.emoji}</span>
          <span className="absolute bottom-3 right-4 text-3xl opacity-80">{meta.emoji}</span>
        </div>
      )}
      <div className="relative h-full flex flex-col items-center justify-center gap-2 text-center px-4">
        {showPhoto && (
          <span className="relative">
            <img
              src={photo!}
              alt={e?.name ?? 'Ảnh nhân sự'}
              className={`w-[104px] h-[104px] object-cover border-4 shadow-lg ${e ? 'border-white' : 'border-dashed border-white/90'} ${cfg.photoShape === 'circle' ? 'rounded-full' : 'rounded-xl'}`}
            />
            {!e && <span className="absolute left-1/2 -translate-x-1/2 bottom-2 px-1.5 rounded-[3px] bg-[#1f5fa8] text-white text-[9px] font-semibold whitespace-nowrap">Ảnh từ Employee</span>}
          </span>
        )}
        <div className="px-3 py-1 rounded-[3px] bg-white/90 shadow-sm">
          <div className="text-[15px] font-bold text-slate-900 leading-tight">{e ? e.name : <VarText text="{{fullname}}" />}</div>
          <div className="text-[11px] text-slate-500">{e ? e.division : <VarText text="{{khoi}}" />}</div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
const MailEditor: React.FC<{ kind: MailKind; toast: (m: string) => void }> = ({ kind, toast }) => {
  const { config, employees, updateMailConfig, sendTest } = useMarcom();
  const saved = config[kind];
  const [draft, setDraft] = useState<MailConfig>(saved);
  const [testTo, setTestTo] = useState('marcom@aequitas.vn');
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const meta = KIND_META[kind];
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  const today = startOfDay(new Date());
  const sampleList = useMemo(() => employees.filter((e) => (kind === 'birthday' ? e.active : inWelcomeBatch(e))), [employees, kind]);
  const defaultSample = (kind === 'birthday' ? sampleList.find((e) => isBirthdayToday(e)) : sampleList.find((e) => e.onboardDate === toKey(today))) ?? sampleList[0];
  const [sampleId, setSampleId] = useState(defaultSample?.id);
  const [view, setView] = useState<'template' | 'sample'>('template');
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
  const onFile = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast('Chỉ nhận file ảnh (PNG/JPG)');
    set({ frameUrl: URL.createObjectURL(f), frameName: f.name });
  };

  const photoNote = (e: MarcomEmployee) =>
    e.photoUrl ? (
      <Tag cls={TAG.green}>Có ảnh</Tag>
    ) : draft.noPhoto === 'default' ? (
      <Tag cls={TAG.amber}>Thiếu ảnh · dùng ảnh mặc định</Tag>
    ) : (
      <Tag cls={TAG.amber}>Thiếu ảnh · gửi không kèm ảnh</Tag>
    );

  return (
    <>
      {/* Thanh thao tác */}
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-[4px]">
        <Btn
          variant="primary"
          icon={Save}
          disabled={!dirty}
          onClick={() => {
            updateMailConfig(kind, draft);
            toast('Đã lưu cấu hình email');
          }}
        >
          Lưu
        </Btn>
        <Btn icon={RotateCcw} disabled={!dirty} onClick={() => setDraft(saved)}>
          Hoàn tác
        </Btn>
        {dirty && <span className="text-[12px] text-amber-700">Có thay đổi chưa lưu</span>}
        <span className="ml-auto flex items-center gap-1.5">
          <span className="text-[12px] text-slate-600">Gửi thử tới</span>
          <input value={testTo} onChange={(e) => setTestTo(e.target.value)} className={`${erp.input} w-56`} placeholder="email@aequitas.vn" />
          <Btn
            icon={Send}
            title={sample ? `Điền template bằng dữ liệu của ${sample.name} rồi gửi tới email thử` : undefined}
            disabled={!testTo.includes('@') || !sample}
            onClick={() => {
              if (!sample) return;
              sendTest(kind, sample, testTo);
              toast(`Đã gửi thử tới ${testTo} — điền bằng dữ liệu của ${sample.name}`);
            }}
          >
            Gửi thử
          </Btn>
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 items-start">
        <div className="space-y-3 min-w-0">
          <Panel title="Cấu hình gửi" icon={Settings2}>
            <div className="space-y-2.5">
              <FormRow label="Trạng thái">
                <span className="flex items-center gap-2 h-8">
                  <Switch on={draft.enabled} onChange={(v) => set({ enabled: v })} />
                  <span className="text-[12px] font-semibold text-slate-700">{draft.enabled ? 'Đang bật gửi tự động' : 'Đang tắt'}</span>
                </span>
              </FormRow>
              <FormRow label="Điều kiện gửi">
                <input value={meta.trigger} readOnly className={`${erp.inputFull} bg-slate-50 text-slate-500`} />
              </FormRow>
              <FormRow label="Giờ gửi" hint="Job chạy hằng ngày vào giờ này, tự xác định người nhận">
                <input type="time" value={draft.sendTime} onChange={(e) => set({ sendTime: e.target.value })} className={`${erp.input} w-32`} />
              </FormRow>
              <FormRow label="CC (tuỳ chọn)">
                <input value={draft.cc} onChange={(e) => set({ cc: e.target.value })} placeholder="VD: marcom@aequitas.vn" className={erp.inputFull} />
              </FormRow>
            </div>
          </Panel>

          <Panel title="Nội dung email" icon={FileText}>
            <div className="space-y-2.5">
              <FormRow label="Tiêu đề" required>
                <input value={draft.subject} onChange={(e) => set({ subject: e.target.value })} className={erp.inputFull} />
              </FormRow>
              <FormRow label="Biến chèn" hint="Bấm để chèn vào vị trí con trỏ trong nội dung">
                <span className="flex flex-wrap gap-1 pt-1">
                  {MAIL_PLACEHOLDERS.filter((p) => p.kinds.includes(kind)).map((p) => (
                    <button key={p.key} type="button" onClick={() => insert(p.key)} title={p.desc} className="px-1.5 py-px rounded-[3px] border border-[#b9d3f0] bg-[#eaf2fc] text-[#1f5fa8] text-[11px] font-mono hover:bg-[#dbe9fa] cursor-pointer">
                      {p.key}
                    </button>
                  ))}
                </span>
              </FormRow>
              <FormRow label="Nội dung" required>
                <textarea ref={bodyRef} rows={10} value={draft.body} onChange={(e) => set({ body: e.target.value })} className="w-full border border-slate-300 rounded-[3px] px-2 py-1.5 text-[13px] leading-relaxed text-slate-800 outline-none focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#1f5fa8]/15" />
              </FormRow>
            </div>
          </Panel>

          <Panel title="Ảnh trong thiệp" icon={UserSquare2} footer="Ảnh nhân sự không upload tay — hệ thống đọc ảnh đại diện mới nhất trên hồ sơ Employee của từng người nhận tại thời điểm gửi.">
            <div className="space-y-2.5">
              <FormRow label="Nguồn ảnh nhân sự">
                <span className="flex flex-wrap items-center gap-2 min-h-8">
                  <span className="font-mono text-[12px] text-[#1f5fa8]">Employee › Ảnh đại diện</span>
                  <Tag cls={TAG.blue}>Tự động theo người nhận</Tag>
                </span>
              </FormRow>
              <FormRow label="Chèn ảnh vào thiệp">
                <span className="flex items-center gap-2 h-8">
                  <Switch on={draft.usePhoto} onChange={(v) => set({ usePhoto: v })} />
                  <span className="text-[12px] text-slate-700">{draft.usePhoto ? 'Có — ghép ảnh nhân sự lên khung thiệp' : 'Không chèn ảnh nhân sự'}</span>
                </span>
              </FormRow>
              {draft.usePhoto && (
                <>
                  <FormRow label="Kiểu ảnh">
                    <Segmented
                      options={[
                        { key: 'circle' as const, label: 'Tròn' },
                        { key: 'rounded' as const, label: 'Vuông bo góc' },
                      ]}
                      value={draft.photoShape}
                      onChange={(v) => set({ photoShape: v })}
                    />
                  </FormRow>
                  <FormRow label="Employee chưa có ảnh">
                    <Segmented
                      options={[
                        { key: 'default' as const, label: 'Dùng ảnh mặc định' },
                        { key: 'omit' as const, label: 'Gửi không kèm ảnh' },
                      ]}
                      value={draft.noPhoto}
                      onChange={(v) => set({ noPhoto: v })}
                    />
                  </FormRow>
                </>
              )}
              <FormRow label="Khung thiệp (MarCom)" hint="Tuỳ chọn · PNG/JPG, khuyến nghị 1200×460 · để trống sẽ dùng nền mặc định">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                {draft.frameUrl ? (
                  <span className="flex items-center gap-2 border border-slate-300 rounded-[3px] p-1.5">
                    <img src={draft.frameUrl} alt="" className="w-20 h-10 object-cover rounded-[2px]" />
                    <span className="flex-1 min-w-0 text-[12px] text-slate-700 truncate">{draft.frameName}</span>
                    <Btn icon={Upload} className="h-7" onClick={() => fileRef.current?.click()}>
                      Đổi
                    </Btn>
                    <Btn variant="danger" icon={Trash2} className="h-7" onClick={() => set({ frameUrl: null, frameName: null })}>
                      Xoá
                    </Btn>
                  </span>
                ) : (
                  <Btn icon={ImageIcon} onClick={() => fileRef.current?.click()}>
                    Tải khung thiệp
                  </Btn>
                )}
              </FormRow>
            </div>
          </Panel>
        </div>

        <div className="space-y-3 min-w-0">
          <Panel
            title="Xem trước template"
            icon={Eye}
            noPad
            actions={
              <>
                <Segmented
                  options={[
                    { key: 'template' as const, label: 'Template (biến)' },
                    { key: 'sample' as const, label: 'Xem thử với dữ liệu' },
                  ]}
                  value={view}
                  onChange={setView}
                />
                {view === 'sample' && (
                  <select value={sample?.id} onChange={(e) => setSampleId(e.target.value)} className={`${erp.input} h-7 text-[12px] w-56`} title="Chỉ để xem thử — không phải người nhận">
                    {sampleList.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} — {kind === 'birthday' ? fmtDate(e.dob).slice(0, 5) : fmtDate(e.onboardDate)}
                        {e.photoUrl ? '' : ' (chưa có ảnh)'}
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
                    { label: 'Từ', value: 'VTX Group · MarCom <marcom@aequitas.vn>' },
                    {
                      label: 'Tới',
                      value: (
                        <span>
                          <VarText text="{{email}}" /> <span className="text-[11px] text-slate-500">— email nội bộ của từng nhân sự {kind === 'birthday' ? 'có sinh nhật' : 'onboard'} hôm đó (job tự điền, mỗi người 1 email riêng)</span>
                        </span>
                      ),
                    },
                    ...(draft.cc ? [{ label: 'CC', value: draft.cc }] : []),
                    { label: 'Tiêu đề', value: <VarText text={draft.subject} />, strong: true },
                  ]}
                />
                <div className="p-4 bg-[#eef1f5]">
                  <div className="mx-auto max-w-[560px] bg-white border border-slate-300 rounded-[4px] overflow-hidden">
                    <GreetingCard kind={kind} cfg={draft} />
                    <div className="p-4 whitespace-pre-line text-[13px] leading-relaxed text-slate-700">
                      <VarText text={draft.body} />
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
                  Các ô <span className="px-1 rounded-[3px] border border-[#b9d3f0] bg-[#eaf2fc] text-[#1f5fa8] font-mono">{"{{…}}"}</span> và ảnh được job điền theo hồ sơ Employee của từng người nhận khi gửi.
                </div>
              </>
            ) : (
              <>
                <FieldTable
                  labelWidth="90px"
                  rows={[
                    { label: 'Từ', value: 'VTX Group · MarCom <marcom@aequitas.vn>' },
                    { label: 'Tới', value: sample.email },
                    ...(draft.cc ? [{ label: 'CC', value: draft.cc }] : []),
                    { label: 'Tiêu đề', value: fillTemplate(draft.subject, sample), strong: true },
                  ]}
                />
                <div className="p-4 bg-[#eef1f5]">
                  <div className="mx-auto max-w-[560px] bg-white border border-slate-300 rounded-[4px] overflow-hidden">
                    <GreetingCard kind={kind} cfg={draft} e={sample} />
                    <div className="p-4 whitespace-pre-line text-[13px] leading-relaxed text-slate-700">{fillTemplate(draft.body, sample)}</div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 border-t text-[11px] ${sample.photoUrl ? 'border-slate-200 bg-slate-50 text-slate-500' : 'border-amber-300 bg-amber-50 text-amber-800'}`}>
                  {sample.photoUrl ? (
                    <>
                      <Avatar e={sample} size={18} /> Xem thử bằng dữ liệu của {sample.name} · ảnh từ <span className="font-mono text-[#1f5fa8]">Employee › {sample.code}</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={13} /> Hồ sơ Employee {sample.code} chưa có ảnh → {draft.noPhoto === 'default' ? 'dùng ảnh mặc định' : 'gửi không kèm ảnh'}. Cần HCNS bổ sung ảnh trên Employee.
                    </>
                  )}
                </div>
              </>
            )}
          </Panel>

          <Panel
            title="Job gửi tự động"
            icon={Clock}
            noPad
            actions={<span className="text-[12px] text-slate-600">Lần chạy kế tiếp: <b>{fmtDate(nextRunDay)} {draft.sendTime}</b></span>}
            footer={`Mỗi ngày ${draft.sendTime}: (1) lọc nhân sự ${kind === 'birthday' ? 'có sinh nhật hôm đó' : 'có ngày onboard hôm đó'} từ Employee → (2) điền template theo hồ sơ từng người → (3) gửi tới email nội bộ của người đó → (4) ghi Lịch sử gửi`}
          >
            {!draft.enabled ? (
              <div className="px-3 py-4 text-[12px] text-slate-400">Đang tắt gửi tự động.</div>
            ) : (
              <table className={erp.table}>
                <thead>
                  <tr>
                    <th className={`${erp.th} text-left`}>Người nhận</th>
                    <th className={`${erp.th} text-left`}>Gửi tới</th>
                    <th className={`${erp.th} text-left`}>Tiêu đề sau khi điền</th>
                    <th className={`${erp.th} text-left`}>Ảnh trên Employee</th>
                  </tr>
                </thead>
                <tbody>
                  {nextRecipients.length === 0 && (
                    <tr>
                      <td colSpan={4} className={`${erp.td} py-5 text-center text-slate-400`}>
                        Không có ai thỏa điều kiện — job vẫn chạy nhưng không gửi.
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
            <div className="font-bold text-[#1e3a5f]">Quy tắc gửi</div>
            <div>• Chỉ gửi CBNV đang làm việc, có email nội bộ; mỗi người nhận 1 lần ({kind === 'birthday' ? 'mỗi năm' : 'duy nhất'}) — không gửi trùng.</div>
            {kind === 'birthday' ? <div>• Sinh nhật 29/02: năm không nhuận gửi vào 28/02.</div> : <div>• Cancel Onboard thì không gửi; đổi ngày onboard trên Employee thì lịch gửi tự dời theo.</div>}
            <div>• Gửi lỗi: tự thử lại 3 lần trong 30 phút, sau đó hiện ở tab Lịch sử gửi để MarCom gửi lại.</div>
          </div>
        </div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
const BoxEditor: React.FC<{ toast: (m: string) => void }> = ({ toast }) => {
  const { config, updateBoxConfig } = useMarcom();
  const saved = config.box;
  const [draft, setDraft] = useState<BoxConfig>(saved);
  const [target, setTarget] = useState<'home' | 'teams'>('home');
  const [simulateEmpty, setSimulateEmpty] = useState(false);
  const bgRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const people = useTodayBirthdays(simulateEmpty);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  const set = (patch: Partial<BoxConfig>) => setDraft((d) => ({ ...d, ...patch }));
  const textarea = 'w-full border border-slate-300 rounded-[3px] px-2 py-1.5 text-[13px] leading-relaxed outline-none focus:border-[#1f5fa8] focus:ring-2 focus:ring-[#1f5fa8]/15';

  const today = startOfDay(new Date());
  const nextPost = isPastTimeToday(draft.teamsPostTime) ? addDays(today, 1) : today;
  const pickImage = (f: File | undefined, apply: (url: string, name: string) => void) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast('Chỉ nhận file ảnh (PNG/JPG)');
    apply(URL.createObjectURL(f), f.name);
  };
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
          Đổi
        </Btn>
        <Btn variant="danger" icon={Trash2} className="h-7" onClick={onClear}>
          Xoá
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
        <span className="text-[12px] text-slate-600">Thiết kế cho</span>
        <Segmented
          options={[
            { key: 'home' as const, label: 'Trang chủ iMIS' },
            { key: 'teams' as const, label: 'Microsoft Teams' },
          ]}
          value={target}
          onChange={setTarget}
        />
        <span className="w-px h-5 bg-slate-200 mx-1" />
        <Btn
          variant="primary"
          icon={Save}
          disabled={!dirty}
          onClick={() => {
            updateBoxConfig(draft);
            toast('Đã lưu thiết kế box sinh nhật (trang chủ & Teams)');
          }}
        >
          Lưu
        </Btn>
        <Btn icon={RotateCcw} disabled={!dirty} onClick={() => setDraft(saved)}>
          Hoàn tác
        </Btn>
        {dirty && <span className="text-[12px] text-amber-700">Có thay đổi chưa lưu</span>}
        {target === 'teams' && (
          <span className="ml-auto flex items-center gap-1.5">
            <Btn icon={Send} disabled={!draft.postToTeams} onClick={() => toast('Đã gửi bài thử tới chat riêng của bạn trên Teams (mock)')}>
              Gửi thử (chat riêng)
            </Btn>
            <Btn
              variant="success"
              icon={Megaphone}
              disabled={!draft.postToTeams || (people.length === 0 && draft.emptyMode === 'hide')}
              onClick={() => toast(`Đã đăng bài sinh nhật lên ${draft.teamsTeam} › ${draft.teamsChannel} (mock)`)}
            >
              Đăng ngay lên Teams
            </Btn>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,480px)_minmax(0,1fr)] gap-3 items-start">
        <div className="space-y-3 min-w-0">
          {target === 'home' ? (
            <>
              <Panel title="Hiển thị trang chủ iMIS" icon={LayoutTemplate}>
                <FormRow label="Trạng thái">
                  <span className="flex items-center gap-2 h-8">
                    <Switch on={draft.showOnHome} onChange={(v) => set({ showOnHome: v })} />
                    <span className="text-[12px] text-slate-700">{draft.showOnHome ? 'Hiển thị box cho toàn thể CBNV' : 'Không hiển thị'}</span>
                  </span>
                </FormRow>
              </Panel>

              <Panel title="Thiết kế box" icon={Palette}>
                <div className="space-y-2.5">
                  <FormRow label="Bố cục">
                    <Segmented
                      options={[
                        { key: 'cards' as const, label: 'Thẻ' },
                        { key: 'list' as const, label: 'Danh sách' },
                        { key: 'banner' as const, label: 'Banner ảnh nền' },
                      ]}
                      value={draft.layout}
                      onChange={(v) => set({ layout: v })}
                    />
                  </FormRow>
                  <FormRow label="Màu chủ đạo">
                    <span className="flex items-center gap-1.5 h-8">
                      {(Object.keys(BOX_THEMES) as BoxTheme[]).map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => set({ theme: k })}
                          title={BOX_THEMES[k].label}
                          className={`w-6 h-6 rounded-full ${BOX_THEMES[k].swatch} cursor-pointer ${draft.theme === k ? 'ring-2 ring-offset-2 ring-slate-500' : 'opacity-80 hover:opacity-100'}`}
                        />
                      ))}
                      <span className="ml-1 text-[12px] text-slate-500">{BOX_THEMES[draft.theme].label}</span>
                    </span>
                  </FormRow>
                  <FormRow label="Ảnh nền (MarCom)" hint="Dùng cho bố cục Banner · khuyến nghị 1600×500 · để trống dùng nền theo màu chủ đạo">
                    <input ref={bgRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickImage(e.target.files?.[0], (url, name) => set({ bgUrl: url, bgName: name, layout: 'banner' }))} />
                    {imageField(draft.bgUrl, draft.bgName, bgRef, () => set({ bgUrl: null, bgName: null }), 'Tải ảnh nền')}
                  </FormRow>
                  <FormRow label="Kiểu ảnh nhân sự">
                    <Segmented
                      options={[
                        { key: 'circle' as const, label: 'Tròn' },
                        { key: 'rounded' as const, label: 'Vuông bo góc' },
                      ]}
                      value={draft.photoShape}
                      onChange={(v) => set({ photoShape: v })}
                    />
                  </FormRow>
                  <FormRow label="Thông tin hiển thị" hint="Luôn có ảnh (từ Employee) và họ tên">
                    <span className="flex items-center gap-4 h-8 text-[12px] text-slate-700">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={draft.showDivision} onChange={(e) => set({ showDivision: e.target.checked })} className="accent-[#1f5fa8]" />
                        Division (Khối)
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={draft.showPosition} onChange={(e) => set({ showPosition: e.target.checked })} className="accent-[#1f5fa8]" />
                        Vị trí
                      </label>
                    </span>
                  </FormRow>
                </div>
              </Panel>

              <Panel title="Nội dung box" icon={FileText}>
                <div className="space-y-2.5">
                  <FormRow label="Tiêu đề">
                    <span className="flex items-center gap-1.5">
                      <input value={draft.title} onChange={(e) => set({ title: e.target.value })} className={erp.inputFull} />
                      <button
                        type="button"
                        onClick={() => set({ title: draft.title + '{{soluong}}' })}
                        title="Số người sinh nhật hôm nay"
                        className="shrink-0 px-1.5 py-px rounded-[3px] border border-[#b9d3f0] bg-[#eaf2fc] text-[#1f5fa8] text-[11px] font-mono hover:bg-[#dbe9fa] cursor-pointer"
                      >
                        {'{{soluong}}'}
                      </button>
                    </span>
                  </FormRow>
                  <FormRow label="Lời chúc chung">
                    <textarea rows={3} value={draft.greeting} onChange={(e) => set({ greeting: e.target.value })} className={textarea} />
                  </FormRow>
                  <FormRow label="Ký tên">
                    <input value={draft.signature} onChange={(e) => set({ signature: e.target.value })} className={erp.inputFull} />
                  </FormRow>
                </div>
              </Panel>
            </>
          ) : (
            <>
              <Panel title="Kênh đăng Microsoft Teams" icon={Megaphone}>
                <div className="space-y-2.5">
                  <FormRow label="Trạng thái">
                    <span className="flex items-center gap-2 h-8">
                      <Switch on={draft.postToTeams} onChange={(v) => set({ postToTeams: v })} />
                      <span className="text-[12px] text-slate-700">{draft.postToTeams ? 'Tự động đăng bài mỗi ngày' : 'Không đăng'}</span>
                    </span>
                  </FormRow>
                  <FormRow label="Team" hint="Danh sách team lấy từ Microsoft Teams của công ty">
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
                  <FormRow label="Kênh">
                    <select value={draft.teamsChannel} onChange={(e) => set({ teamsChannel: e.target.value })} className={erp.inputFull}>
                      {(TEAMS_DIRECTORY.find((t) => t.team === draft.teamsTeam)?.channels ?? []).map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </FormRow>
                  <FormRow label="Giờ đăng" hint={`Lần đăng kế tiếp: ${fmtDate(nextPost)} ${draft.teamsPostTime}`}>
                    <input type="time" value={draft.teamsPostTime} onChange={(e) => set({ teamsPostTime: e.target.value })} className={`${erp.input} w-32`} />
                  </FormRow>
                </div>
              </Panel>

              <Panel title="Tài khoản đăng bài" icon={UserSquare2} actions={<Tag cls={TAG.green}>Đã kết nối</Tag>} footer="Cố định Bot iMIS dành riêng cho MarCom — không đổi tài khoản / ảnh đại diện. Kết nối & quyền đăng do quản trị hệ thống cấu hình.">
                <span className="flex items-center gap-3">
                  <SenderAvatar size={36} />
                  <span>
                    <span className="block text-[13px] font-bold text-slate-800">{TEAMS_SENDER.name}</span>
                    <span className="block text-[11px] text-slate-500">{TEAMS_SENDER.account}</span>
                  </span>
                </span>
              </Panel>

              <Panel title="Nội dung bài đăng" icon={FileText} footer="Dòng chỉ chứa {{danhsach}} sẽ thành danh sách: 🎂 @Họ tên – Vị trí, Khối (mỗi người 1 dòng, @mention đúng người) · **chữ** = in đậm">
                <div className="space-y-2.5">
                  <FormRow label="Dòng tiêu đề">
                    <input value={draft.teamsHeader} onChange={(e) => set({ teamsHeader: e.target.value })} className={erp.inputFull} />
                  </FormRow>
                  <FormRow label="@mention team">
                    <span className="flex items-center gap-2 h-8">
                      <Switch on={draft.teamsMentionAll} onChange={(v) => set({ teamsMentionAll: v })} />
                      <span className="text-[12px] text-slate-700">{draft.teamsMentionAll ? `Gắn @${draft.teamsTeam} sau dòng tiêu đề` : 'Không gắn'}</span>
                    </span>
                  </FormRow>
                  <FormRow label="Biến chèn" hint="Bấm để chèn vào vị trí con trỏ">
                    <span className="flex flex-wrap gap-1 pt-1">
                      {TEAMS_PLACEHOLDERS.map((p) => (
                        <button key={p.key} type="button" onClick={() => insertBody(p.key)} title={p.desc} className="px-1.5 py-px rounded-[3px] border border-[#b9d3f0] bg-[#eaf2fc] text-[#1f5fa8] text-[11px] font-mono hover:bg-[#dbe9fa] cursor-pointer">
                          {p.key}
                        </button>
                      ))}
                    </span>
                  </FormRow>
                  <FormRow label="Nội dung">
                    <textarea ref={bodyRef} rows={14} value={draft.teamsBody} onChange={(e) => set({ teamsBody: e.target.value })} className={textarea} />
                  </FormRow>
                </div>
              </Panel>

              <Panel title="Ảnh thiệp đính kèm" icon={ImageIcon} footer="Thiệp tự ghép mỗi ngày: ảnh polaroid từng người (ảnh từ Employee) + họ tên + Vị trí - Khối; tối đa 4 người/thiệp">
                <div className="space-y-2.5">
                  <FormRow label="Đính kèm thiệp">
                    <span className="flex items-center gap-2 h-8">
                      <Switch on={draft.teamsAttachCard} onChange={(v) => set({ teamsAttachCard: v })} />
                      <span className="text-[12px] text-slate-700">{draft.teamsAttachCard ? 'Có — gửi kèm ảnh thiệp' : 'Chỉ gửi văn bản'}</span>
                    </span>
                  </FormRow>
                  {draft.teamsAttachCard && (
                    <FormRow label="Nền thiệp (MarCom)" hint="PNG/JPG vuông, khuyến nghị 1080×1080 · để trống dùng mẫu mặc định">
                      <input ref={cardRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickImage(e.target.files?.[0], (url, name) => set({ cardBgUrl: url, cardBgName: name }))} />
                      {imageField(draft.cardBgUrl, draft.cardBgName, cardRef, () => set({ cardBgUrl: null, cardBgName: null }), 'Tải nền thiệp')}
                    </FormRow>
                  )}
                </div>
              </Panel>
            </>
          )}

          <Panel title="Khi không có sinh nhật" icon={Cake}>
            <div className="space-y-2.5">
              <FormRow label="Xử lý" hint={draft.emptyMode === 'hide' ? 'Trang chủ ẩn box · Teams không đăng bài' : 'Trang chủ & Teams hiện nội dung mặc định'}>
                <Segmented
                  options={[
                    { key: 'hide' as const, label: 'Ẩn box / không đăng' },
                    { key: 'default' as const, label: 'Nội dung mặc định' },
                  ]}
                  value={draft.emptyMode}
                  onChange={(v) => set({ emptyMode: v })}
                />
              </FormRow>
              {draft.emptyMode === 'default' && (
                <FormRow label="Nội dung mặc định">
                  <textarea rows={2} value={draft.emptyText} onChange={(e) => set({ emptyText: e.target.value })} className={textarea} />
                </FormRow>
              )}
            </div>
          </Panel>
        </div>

        <Panel
          title={target === 'home' ? 'Xem trước · Trang chủ iMIS' : 'Xem trước · Microsoft Teams'}
          icon={Eye}
          actions={
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600 cursor-pointer select-none">
              <input type="checkbox" checked={simulateEmpty} onChange={(e) => setSimulateEmpty(e.target.checked)} className="accent-[#1f5fa8]" />
              Giả lập ngày không có sinh nhật
            </label>
          }
          footer="Danh sách người sinh nhật và ảnh lấy tự động từ hồ sơ Employee theo ngày"
        >
          {target === 'home' ? (
            draft.showOnHome ? (
              <BirthdayBox preview simulateEmpty={simulateEmpty} cfg={draft} />
            ) : (
              <div className="border border-dashed border-slate-300 rounded-[4px] bg-slate-50 py-8 text-center text-[12px] text-slate-400">Đang tắt hiển thị trên trang chủ iMIS.</div>
            )
          ) : draft.postToTeams ? (
            <TeamsBirthdayPost cfg={draft} people={people} />
          ) : (
            <div className="border border-dashed border-slate-300 rounded-[4px] bg-slate-50 py-8 text-center text-[12px] text-slate-400">Đang tắt đăng bài lên Microsoft Teams.</div>
          )}
        </Panel>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
const MailLogs: React.FC<{ toast: (m: string) => void }> = ({ toast }) => {
  const { logs, resend } = useMarcom();
  const [kind, setKind] = useState<'all' | MailKind>('all');
  const [status, setStatus] = useState<'all' | 'sent' | 'failed' | 'skipped' | 'test'>('all');
  const rows = logs.filter((l) => (kind === 'all' || l.kind === kind) && (status === 'all' || l.status === status));
  const resent = new Set(logs.filter((l) => l.note === 'Gửi lại thủ công').map((l) => `${l.kind}-${l.employeeId}`));

  const statusTag = {
    sent: <Tag cls={TAG.green}>Thành công</Tag>,
    failed: <Tag cls={TAG.rose}>Lỗi</Tag>,
    skipped: <Tag cls={TAG.slate}>Bỏ qua</Tag>,
    test: <Tag cls={TAG.blue}>Gửi thử</Tag>,
  };

  return (
    <Panel title="Lịch sử gửi email" icon={History} noPad actions={<span className="text-[12px] text-slate-600">{rows.length} bản ghi</span>}>
      <div className="p-3 border-b border-slate-200">
        <FilterBar>
          <FilterCell label="Loại mail">
            <Segmented
              options={[
                { key: 'all' as const, label: 'Tất cả' },
                { key: 'birthday' as const, label: 'Sinh nhật' },
                { key: 'welcome' as const, label: 'Welcome' },
              ]}
              value={kind}
              onChange={setKind}
            />
          </FilterCell>
          <FilterCell label="Trạng thái">
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={`${erp.input} w-40`}>
              <option value="all">Tất cả</option>
              <option value="sent">Thành công</option>
              <option value="failed">Lỗi</option>
              <option value="skipped">Bỏ qua</option>
              <option value="test">Gửi thử</option>
            </select>
          </FilterCell>
        </FilterBar>
      </div>
      <div className="overflow-x-auto">
        <table className={erp.table}>
          <thead>
            <tr>
              <th className={`${erp.th} text-left`}>Thời gian</th>
              <th className={`${erp.th} text-left`}>Loại</th>
              <th className={`${erp.th} text-left`}>Nhân sự</th>
              <th className={`${erp.th} text-left`}>Gửi tới</th>
              <th className={`${erp.th} text-left`}>Trạng thái</th>
              <th className={`${erp.th} text-left`}>Ghi chú</th>
              <th className={`${erp.th} w-[100px] text-center`}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className={`${erp.td} py-10 text-center text-slate-400`}>
                  Chưa có bản ghi.
                </td>
              </tr>
            )}
            {rows.map((l) => (
              <tr key={l.id} className={erp.tr}>
                <td className={`${erp.td} whitespace-nowrap`}>{fmtDateTime(l.sentAt)}</td>
                <td className={erp.td}>
                  <span className="inline-flex items-center gap-1">
                    {l.kind === 'birthday' ? <Cake size={12} className="text-pink-500" /> : <Hand size={12} className="text-[#0f8f6c]" />}
                    {l.kind === 'birthday' ? 'Sinh nhật' : 'Welcome'}
                  </span>
                </td>
                <td className={`${erp.td} font-semibold`}>{l.employeeName}</td>
                <td className={erp.td}>{l.to}</td>
                <td className={erp.td}>{statusTag[l.status]}</td>
                <td className={`${erp.td} text-slate-500`}>{l.note ?? '—'}</td>
                <td className={`${erp.td} text-center`}>
                  {l.status === 'failed' && !resent.has(`${l.kind}-${l.employeeId}`) && (
                    <Btn
                      className="h-7"
                      icon={Send}
                      onClick={() => {
                        resend(l.id);
                        toast(`Đã gửi lại mail cho ${l.employeeName}`);
                      }}
                    >
                      Gửi lại
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
