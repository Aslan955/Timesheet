/**
 * Tiến độ sau khi HCNS duyệt Onboarding Request (ĐỀ XUẤT): 4 việc tự động, mỗi việc
 * Chưa bắt đầu → Đang thực hiện (đã gửi / đang chờ phản hồi) → Đã hoàn thành (đã nhận phản hồi).
 */
import React, { useState } from 'react';
import { BellRing, CheckCircle2, ExternalLink, Eye, ListChecks, Loader2, Send, ShieldCheck } from 'lucide-react';
import { Panel, Btn, erp, Tag, FieldTable, FormRow } from '../erp/Erp';
import { Modal, TAG } from '../../marcom/MarcomUi';
import { useOnboarding } from '../../onboarding/OnboardingContext';
import { OnbRecord, OnbTask, TaskKey, TaskStatus, TASK_ORDER, TASK_DEFS, IT_ITEMS, IT_MAILBOX, DELIVERY_CHANNELS, IT_STAFF, MS_FORM_LINK, FORM_FIELDS, taskOf, tasksDone, dmyhm } from '../../onboarding/onboardingData';

export const TASK_STATUS_CLS: Record<TaskStatus, string> = {
  'Chưa bắt đầu': TAG.slate,
  'Đang thực hiện': TAG.amber,
  'Đã hoàn thành': TAG.green,
};

/** Nhãn tiến độ x/4 cho lưới. */
export const ProgressTag: React.FC<{ record: OnbRecord }> = ({ record }) => {
  const n = tasksDone(record);
  return <Tag cls={n === TASK_ORDER.length ? TAG.green : TAG.amber}>{`Tiến độ ${n}/${TASK_ORDER.length}`}</Tag>;
};

/** Việc còn dở (để hiện ở dải thông báo). */
export const pendingTaskNames = (r: OnbRecord) => TASK_ORDER.filter((k) => taskOf(r, k).status !== 'Đã hoàn thành').map((k) => TASK_DEFS[k].name);

export const OnbProgressPanel: React.FC<{ record: OnbRecord; onOpenEmployee?: () => void; toast: (m: string) => void }> = ({ record: r, onOpenEmployee, toast }) => {
  const { remindForm, submitForm, itConfirm } = useOnboarding();
  const [modal, setModal] = useState<'' | 'form' | 'it'>('');
  const started = (r.tasks || []).length > 0;
  const stopped = r.status === 'Huỷ onboard';
  const n = tasksDone(r);

  const actions = (t: OnbTask): React.ReactNode => {
    if (!started || stopped) return null;
    const link = 'text-[#1f5fa8] underline cursor-pointer whitespace-nowrap';
    switch (t.key as TaskKey) {
      case 'employee':
        return (
          <button type="button" onClick={onOpenEmployee} className={`${link} inline-flex items-center gap-1`}>
            <ExternalLink size={12} /> Mở hồ sơ
          </button>
        );
      case 'imisAccount':
        return t.status === 'Đang thực hiện' ? (
          <span className="inline-flex items-center gap-1 text-[12px] text-amber-700">
            <Loader2 size={12} className="animate-spin" /> Job đang chạy
          </span>
        ) : null;
      case 'personalForm':
        return t.status === 'Đang thực hiện' ? (
          <span className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`${link} inline-flex items-center gap-1`}
              onClick={() => {
                remindForm(r.id);
                toast(`Đã gửi nhắc điền form tới ${r.candidateEmail}`);
              }}
            >
              <BellRing size={12} /> Gửi nhắc
            </button>
            <button type="button" className="text-emerald-700 font-semibold underline cursor-pointer whitespace-nowrap" onClick={() => setModal('form')}>
              Nhân sự submit (mô phỏng)
            </button>
          </span>
        ) : (
          <button type="button" className={`${link} inline-flex items-center gap-1`} onClick={() => setModal('form')}>
            <Eye size={12} /> Xem dữ liệu
          </button>
        );
      case 'itAccount':
        return t.status === 'Đang thực hiện' ? (
          <button type="button" className="text-emerald-700 font-semibold underline cursor-pointer whitespace-nowrap" onClick={() => setModal('it')}>
            IT xác nhận (mô phỏng)
          </button>
        ) : (
          <button type="button" className={`${link} inline-flex items-center gap-1`} onClick={() => setModal('it')}>
            <Eye size={12} /> Xem
          </button>
        );
    }
  };

  return (
    <>
      <Panel
        title="Tiến độ sau khi duyệt"
        icon={ListChecks}
        noPad
        actions={
          started ? (
            <span className="flex items-center gap-2">
              <span className="w-28 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <span className={`block h-full ${n === TASK_ORDER.length ? 'bg-emerald-600' : 'bg-amber-500'}`} style={{ width: `${(n / TASK_ORDER.length) * 100}%` }} />
              </span>
              <b className="text-[12px] tabular-nums text-[#1e3a5f]">
                {n}/{TASK_ORDER.length} hoàn thành
              </b>
            </span>
          ) : (
            <span className="text-[12px] text-slate-500">Bắt đầu tự động khi HCNS duyệt</span>
          )
        }
        footer="Đề xuất mới — code hiện tại chỉ có job tạo user + 1 mail form. Đang thực hiện = đã gửi đi, chờ phản hồi · Đã hoàn thành = đã nhận phản hồi (nhân sự submit form / IT xác nhận)."
      >
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                {['#', 'Công việc', 'Phụ trách', 'Trạng thái', 'Chi tiết', 'Bắt đầu', 'Hoàn thành', 'Thao tác'].map((h) => (
                  <th key={h} className={`${erp.th} text-left`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TASK_ORDER.map((k, i) => {
                const t = taskOf(r, k);
                return (
                  <tr key={k} className={erp.tr}>
                    <td className={`${erp.td} w-8 text-center text-slate-400`}>{i + 1}</td>
                    <td className={erp.td}>
                      <p className="font-semibold text-slate-800">{TASK_DEFS[k].name}</p>
                      <p className="text-[11px] text-slate-500">Hoàn thành khi: {TASK_DEFS[k].done}</p>
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>{TASK_DEFS[k].owner}</td>
                    <td className={erp.td}>
                      <Tag cls={TASK_STATUS_CLS[t.status]}>{t.status}</Tag>
                    </td>
                    <td className={`${erp.td} text-[12px] text-slate-600 max-w-[300px]`}>{t.detail || <span className="text-slate-400">—</span>}</td>
                    <td className={`${erp.td} whitespace-nowrap text-[12px]`}>{t.startedAt ? dmyhm(t.startedAt) : <span className="text-slate-400">—</span>}</td>
                    <td className={`${erp.td} whitespace-nowrap text-[12px]`}>
                      {t.doneAt ? (
                        <>
                          {dmyhm(t.doneAt)}
                          <p className="text-[11px] text-slate-500">{t.doneBy}</p>
                        </>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className={erp.td}>{actions(t)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <FormModal open={modal === 'form'} record={r} onClose={() => setModal('')} onSubmit={(d) => { submitForm(r.id, d); setModal(''); toast('Đã nhận Microsoft Forms — hồ sơ Employees đã được cập nhật'); }} />
      <ItModal open={modal === 'it'} record={r} onClose={() => setModal('')} onConfirm={(items, email, channel, by) => { itConfirm(r.id, items, email, channel, by); setModal(''); toast(items.length === IT_ITEMS.length ? 'IT đã cấp đủ tài khoản' : `IT đã xác nhận ${items.length}/${IT_ITEMS.length} mục`); }} />
    </>
  );
};

/** Dữ liệu mẫu nhân sự điền form (prototype). */
const sampleForm = (r: OnbRecord): Record<string, string> => ({
  birthDate: '1998-04-12',
  idNo: '001098012345',
  idDate: '2021-06-15',
  idPlace: 'Cục Cảnh sát QLHC về TTXH',
  permanentAddress: 'Số 18, ngõ 45, phường Dịch Vọng, Cầu Giấy, Hà Nội',
  currentAddress: 'Số 18, ngõ 45, phường Dịch Vọng, Cầu Giấy, Hà Nội',
  taxCode: '8412345678',
  socialInsNo: '0123456789',
  bankAccount: '0011004455667',
  bankName: 'Vietcombank',
  ...(taskOf(r, 'personalForm').formData || {}),
});

const FormModal: React.FC<{ open: boolean; record: OnbRecord; onClose: () => void; onSubmit: (d: Record<string, string>) => void }> = ({ open, record: r, onClose, onSubmit }) => {
  const done = taskOf(r, 'personalForm').status === 'Đã hoàn thành';
  const [d, setD] = useState<Record<string, string>>({});
  const [opened, setOpened] = useState(false);
  if (open && !opened) {
    setOpened(true);
    setD(sampleForm(r));
  }
  if (!open && opened) setOpened(false);
  return (
    <Modal
      open={open}
      onClose={onClose}
      width="max-w-2xl"
      title={done ? `Thông tin cá nhân đã nhận — ${r.data.fullName}` : `Mô phỏng: ${r.data.fullName} submit Microsoft Forms`}
      footer={
        done ? (
          <Btn onClick={onClose}>Đóng</Btn>
        ) : (
          <>
            <Btn onClick={onClose}>Huỷ</Btn>
            <Btn variant="success" icon={Send} onClick={() => onSubmit(d)}>
              Submit form
            </Btn>
          </>
        )
      }
    >
      <div className="space-y-3">
        <FieldTable
          labelWidth="28%"
          rows={[
            { label: 'Link form', value: <span className="font-mono text-[12px] text-[#1f5fa8]">{MS_FORM_LINK}</span> },
            { label: 'Gửi tới', value: r.candidateEmail },
          ]}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
          {FORM_FIELDS.map((f) => (
            <label key={f.key} className="min-w-0">
              <span className="block text-[12px] font-semibold text-slate-700 mb-1">{f.label}</span>
              <input
                type={f.key.endsWith('Date') ? 'date' : 'text'}
                value={d[f.key] || ''}
                readOnly={done}
                onChange={(e) => setD((x) => ({ ...x, [f.key]: e.target.value }))}
                className={`${erp.inputFull} ${done ? 'bg-slate-50' : ''}`}
              />
            </label>
          ))}
        </div>
        {!done && <p className="text-[12px] text-slate-500">Submit xong: việc chuyển “Đã hoàn thành”, dữ liệu đổ vào hồ sơ Employees của nhân sự.</p>}
      </div>
    </Modal>
  );
};

const ItModal: React.FC<{ open: boolean; record: OnbRecord; onClose: () => void; onConfirm: (items: string[], email: string, channel: string, by: string) => void }> = ({ open, record: r, onClose, onConfirm }) => {
  const t = taskOf(r, 'itAccount');
  const done = t.status === 'Đã hoàn thành';
  const [items, setItems] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [channel, setChannel] = useState('');
  const [by, setBy] = useState('');
  const [tried, setTried] = useState(false);
  const [opened, setOpened] = useState(false);
  if (open && !opened) {
    setOpened(true);
    setItems(t.itDone || []);
    setEmail(r.account.companyEmail || (r.account.userName ? `${r.account.userName}@company.vn` : ''));
    setChannel(t.deliveryChannel || '');
    setBy(t.deliveredBy || '');
    setTried(false);
  }
  // Đủ mục = hoàn thành = đã bàn giao ⇒ bắt buộc kênh + người bàn giao
  const all = IT_ITEMS.every((i) => items.includes(i));
  const errs = {
    email: items.includes(IT_ITEMS[0]) && !email.trim() ? 'Bắt buộc khi đã cấp M365' : '',
    channel: all && !channel ? 'Bắt buộc khi xác nhận đủ mục' : '',
    by: all && !by ? 'Bắt buộc khi xác nhận đủ mục' : '',
  };
  const ok = !errs.email && !errs.channel && !errs.by;
  if (!open && opened) setOpened(false);
  return (
    <Modal
      open={open}
      onClose={onClose}
      width="max-w-xl"
      title={done ? `IT đã cấp tài khoản — ${r.data.fullName}` : `Mô phỏng: IT xác nhận cấp tài khoản — ${r.data.fullName}`}
      footer={
        done ? (
          <Btn onClick={onClose}>Đóng</Btn>
        ) : (
          <>
            <Btn onClick={onClose}>Huỷ</Btn>
            <Btn variant="success" icon={ShieldCheck} onClick={() => (ok ? onConfirm(items, email.trim(), channel, by) : setTried(true))}>
              Xác nhận
            </Btn>
          </>
        )
      }
    >
      <div className="space-y-3">
        <FieldTable
          labelWidth="28%"
          rows={[
            { label: 'Mail đã gửi tới', value: IT_MAILBOX },
            { label: 'Nhân sự', value: `${r.data.fullName} · ${r.data.position} · ${r.data.department}` },
            { label: 'Ngày nhận việc', value: r.data.startDate.split('-').reverse().join('/') },
          ]}
        />
        <div className="space-y-1.5">
          {IT_ITEMS.map((it) => (
            <label key={it} className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" disabled={done} checked={items.includes(it)} onChange={(e) => setItems((x) => (e.target.checked ? [...x, it] : x.filter((y) => y !== it)))} className="w-4 h-4 accent-[#0f8f6c]" />
              {items.includes(it) && <CheckCircle2 size={13} className="text-emerald-600" />}
              {it}
            </label>
          ))}
        </div>
        <FormRow label="Email công ty (M365)" required={items.includes(IT_ITEMS[0])} error={tried ? errs.email : undefined}>
          <input value={email} readOnly={done} onChange={(e) => setEmail(e.target.value)} placeholder="user@company.vn" className={erp.inputFull} />
        </FormRow>
        <FormRow label="Kênh bàn giao" required={all} error={tried ? errs.channel : undefined} hint="Thông tin đăng nhập giao ngoài iMIS — iMIS không lưu mật khẩu">
          <select value={channel} disabled={done} onChange={(e) => setChannel(e.target.value)} className={`${erp.inputFull} cursor-pointer`}>
            <option value="">-- Chọn kênh --</option>
            {DELIVERY_CHANNELS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </FormRow>
        <FormRow label="Người bàn giao" required={all} error={tried ? errs.by : undefined}>
          <select value={by} disabled={done} onChange={(e) => setBy(e.target.value)} className={`${erp.inputFull} cursor-pointer`}>
            <option value="">-- Chọn nhân sự IT --</option>
            {IT_STAFF.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </FormRow>
        <div className="flex gap-2 bg-amber-50 border border-amber-300 rounded-[4px] px-3 py-2 text-[12px] text-amber-800">
          <ShieldCheck size={14} className="shrink-0 mt-0.5" />
          <span>Không nhập / không gửi mật khẩu qua iMIS hay email. Mã TAP / mật khẩu tạm chỉ giao qua kênh đã chọn, nhân sự bắt buộc đổi / đăng ký MFA ở lần đăng nhập đầu.</span>
        </div>
        {!done && <p className="text-[12px] text-slate-500">Thực tế: IT phản hồi mail / bấm link xác nhận. Đủ {IT_ITEMS.length}/{IT_ITEMS.length} mục → “Đã hoàn thành”; thiếu mục nào vẫn “Đang thực hiện”.</p>}
      </div>
    </Modal>
  );
};
