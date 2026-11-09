/**
 * Tiến độ sau khi HCNS Accept: 4 việc nối tiếp nhau giữa HCNS · Ứng viên · IT · MarCom.
 *  1. Tạo nhân viên trong Employees (hệ thống, ngay khi Accept)
 *  2. Ứng viên điền form thông tin cá nhân (link gửi qua email)
 *  3. IT cấp tài khoản — yêu cầu tự gửi khi ứng viên submit form; IT trả email, tên tài khoản, mật khẩu
 *  4. MarCom chuẩn bị Welcome Onboard — tự báo khi IT trả tài khoản
 */
import React, { useState } from 'react';
import { BellRing, CheckCircle2, Copy, ExternalLink, Eye, EyeOff, Hand, KeyRound, ListChecks, RefreshCw, Send, ShieldCheck } from 'lucide-react';
import { Panel, Btn, erp, Tag, FieldTable, FormRow } from '../erp/Erp';
import { Modal, TAG } from '../../marcom/MarcomUi';
import { useOnboarding } from '../../onboarding/OnboardingContext';
import {
  OnbRecord, OnbTask, TaskKey, TaskStatus, TASK_ORDER, TASK_DEFS, IT_MAILBOX, MARCOM_MAILBOX, IT_STAFF, MARCOM_STAFF, FORM_FIELDS, FORM_GROUPS,
  taskOf, tasksDone, dmy, dmyhm, accountNameOf, domainOf, genPassword, waitingOf,
} from '../../onboarding/onboardingData';

export const TASK_STATUS_CLS: Record<TaskStatus, string> = {
  'Chưa bắt đầu': TAG.slate,
  'Đang thực hiện': TAG.amber,
  'Đã hoàn thành': TAG.green,
};

/** Nhãn tiến độ x/4 cho lưới. */
export const ProgressTag: React.FC<{ record: OnbRecord }> = ({ record }) => {
  const n = tasksDone(record);
  return <Tag cls={n === TASK_ORDER.length ? TAG.green : TAG.amber}>{`${n}/${TASK_ORDER.length}`}</Tag>;
};

/** Bước đang chờ (ai đang giữ việc). */
export const WaitTag: React.FC<{ record: OnbRecord }> = ({ record }) => {
  const w = waitingOf(record);
  if (!w) return <span className="text-slate-400">—</span>;
  const cls = { HCNS: TAG.violet, 'Ứng viên': TAG.blue, IT: TAG.amber, MarCom: TAG.rose }[w.owner] || TAG.slate;
  return <Tag cls={w.text === 'Sẵn sàng nhận việc' ? TAG.green : cls}>{w.text}</Tag>;
};

/** Việc còn dở (để hiện ở dải thông báo). */
export const pendingTaskNames = (r: OnbRecord) => TASK_ORDER.filter((k) => taskOf(r, k).status !== 'Đã hoàn thành').map((k) => TASK_DEFS[k].name);

/** Ô bí mật (mật khẩu): ẩn mặc định, bấm mắt để xem, nút sao chép. */
export const Secret: React.FC<{ value: string; onCopy?: () => void }> = ({ value, onCopy }) => {
  const [show, setShow] = useState(false);
  if (!value) return <span className="text-slate-400">—</span>;
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
      <span className="font-mono text-[12.5px] tracking-wide">{show ? value : '••••••••••'}</span>
      <button type="button" title={show ? 'Ẩn' : 'Hiện mật khẩu'} onClick={(e) => (e.stopPropagation(), setShow(!show))} className="text-slate-400 hover:text-[#1f5fa8] cursor-pointer">
        {show ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
      {onCopy && (
        <button
          type="button"
          title="Sao chép"
          onClick={(e) => {
            e.stopPropagation();
            void navigator.clipboard?.writeText(value).catch(() => undefined);
            onCopy();
          }}
          className="text-slate-400 hover:text-[#1f5fa8] cursor-pointer"
        >
          <Copy size={13} />
        </button>
      )}
    </span>
  );
};

export const OnbProgressPanel: React.FC<{
  record: OnbRecord;
  onOpenEmployee?: () => void;
  onOpenForm: () => void;
  onOpenWelcome?: () => void;
  toast: (m: string) => void;
}> = ({ record: r, onOpenEmployee, onOpenForm, onOpenWelcome, toast }) => {
  const { remindForm } = useOnboarding();
  const [modal, setModal] = useState<'' | 'formData' | 'it' | 'marcom'>('');
  const started = (r.tasks || []).length > 0;
  const stopped = r.status === 'Huỷ onboard';
  const n = tasksDone(r);
  const link = 'text-[#1f5fa8] underline cursor-pointer whitespace-nowrap inline-flex items-center gap-1';
  const act = 'text-emerald-700 font-semibold underline cursor-pointer whitespace-nowrap';

  const actions = (t: OnbTask): React.ReactNode => {
    if (!started || stopped) return null;
    switch (t.key as TaskKey) {
      case 'employee':
        return (
          <button type="button" onClick={onOpenEmployee} className={link}>
            <ExternalLink size={12} /> Mở hồ sơ
          </button>
        );
      case 'personalForm':
        return t.status === 'Đang thực hiện' ? (
          <span className="flex flex-wrap gap-x-3 gap-y-1">
            <button
              type="button"
              className={link}
              onClick={() => {
                remindForm(r.id);
                toast(`Đã gửi nhắc điền form tới ${r.candidateEmail}`);
              }}
            >
              <BellRing size={12} /> Gửi nhắc
            </button>
            <button type="button" className={act} onClick={onOpenForm} data-testid="open-candidate-form">
              Mở link form (ứng viên)
            </button>
          </span>
        ) : t.status === 'Đã hoàn thành' ? (
          <button type="button" className={link} onClick={() => setModal('formData')}>
            <Eye size={12} /> Xem dữ liệu
          </button>
        ) : null;
      case 'itAccount':
        return t.status === 'Đang thực hiện' ? (
          <button type="button" className={act} onClick={() => setModal('it')} data-testid="it-return-open">
            IT trả thông tin tài khoản
          </button>
        ) : t.status === 'Đã hoàn thành' ? (
          <button type="button" className={link} onClick={() => setModal('it')}>
            <Eye size={12} /> Xem
          </button>
        ) : null;
      case 'marcom':
        return t.status === 'Đang thực hiện' ? (
          <span className="flex flex-wrap gap-x-3 gap-y-1">
            <button type="button" className={act} onClick={() => setModal('marcom')}>
              MarCom xác nhận
            </button>
            {onOpenWelcome && (
              <button type="button" className={link} onClick={onOpenWelcome}>
                <Hand size={12} /> Welcome Onboard
              </button>
            )}
          </span>
        ) : null;
    }
  };

  return (
    <>
      <Panel
        title="Tiến độ sau khi Accept"
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
            <span className="text-[12px] text-slate-500">Bắt đầu khi HCNS Accept</span>
          )
        }
        footer="Các việc nối tiếp: ứng viên submit form → tự gửi yêu cầu IT (Họ và tên, Khối, Cấp trên trực tiếp, Công ty) → IT trả tài khoản → tự báo MarCom."
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
                  <tr key={k} className={erp.tr} data-testid={`task-${k}`}>
                    <td className={`${erp.td} w-8 text-center text-slate-400`}>{i + 1}</td>
                    <td className={erp.td}>
                      <p className="font-semibold text-slate-800">{TASK_DEFS[k].name}</p>
                      <p className="text-[11px] text-slate-500">Hoàn thành khi: {TASK_DEFS[k].done}</p>
                    </td>
                    <td className={`${erp.td} whitespace-nowrap`}>{TASK_DEFS[k].owner}</td>
                    <td className={erp.td}>
                      <Tag cls={TASK_STATUS_CLS[t.status]}>{t.status}</Tag>
                    </td>
                    <td className={`${erp.td} text-[12px] text-slate-600 max-w-[320px]`}>{t.detail || <span className="text-slate-400">—</span>}</td>
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

      <FormDataModal open={modal === 'formData'} record={r} onClose={() => setModal('')} />
      <ItReturnModal open={modal === 'it'} record={r} onClose={() => setModal('')} toast={toast} />
      <MarcomDoneModal open={modal === 'marcom'} record={r} onClose={() => setModal('')} toast={toast} />
    </>
  );
};

/** Dữ liệu ứng viên đã submit. */
const FormDataModal: React.FC<{ open: boolean; record: OnbRecord; onClose: () => void }> = ({ open, record: r, onClose }) => {
  const t = taskOf(r, 'personalForm');
  const d = t.formData || {};
  return (
    <Modal open={open} onClose={onClose} width="max-w-2xl" title={`Thông tin cá nhân ứng viên đã gửi — ${r.data.fullName}`} footer={<Btn onClick={onClose}>Đóng</Btn>}>
      <div className="space-y-3">
        <p className="text-[12px] text-slate-500">
          Submit lúc {dmyhm(t.doneAt || '')} qua link <span className="font-mono text-[#1f5fa8]">{t.formLink}</span> — đã đổ vào hồ sơ {r.account.employeeCode}.
        </p>
        {FORM_GROUPS.map((g) => (
          <div key={g}>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#1e3a5f] mb-1">{g}</p>
            <FieldTable
              labelWidth="34%"
              rows={FORM_FIELDS.filter((f) => f.group === g).map((f) => ({ label: f.label, value: f.type === 'date' ? dmy(d[f.key] || '') : d[f.key] || '' }))}
            />
          </div>
        ))}
      </div>
    </Modal>
  );
};

/** IT nhận yêu cầu (Họ và tên, Khối, Cấp trên trực tiếp, Công ty) → trả email, tên tài khoản, mật khẩu. */
export const ItReturnModal: React.FC<{ open: boolean; record: OnbRecord; onClose: () => void; toast: (m: string) => void }> = ({ open, record: r, onClose, toast }) => {
  const { itReturn } = useOnboarding();
  const t = taskOf(r, 'itAccount');
  const done = t.status === 'Đã hoàn thành';
  const req = t.itReq;
  const [email, setEmail] = useState('');
  const [acc, setAcc] = useState('');
  const [pass, setPass] = useState('');
  const [by, setBy] = useState('');
  const [note, setNote] = useState('');
  const [tried, setTried] = useState(false);
  const [opened, setOpened] = useState(false);
  if (open && !opened) {
    setOpened(true);
    const name = t.itRet?.accountName || accountNameOf(r.data.fullName);
    setAcc(name);
    setEmail(t.itRet?.email || `${name}@${domainOf(r.company)}`);
    setPass(t.itRet?.password || genPassword());
    setBy(t.itRet?.by || IT_STAFF[0]);
    setNote(t.itRet?.note || '');
    setTried(false);
  }
  if (!open && opened) setOpened(false);
  const errs = {
    email: !email.trim() ? 'Bắt buộc' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? 'Email không hợp lệ' : '',
    acc: !acc.trim() ? 'Bắt buộc' : '',
    pass: pass.length < 8 ? 'Tối thiểu 8 ký tự' : '',
    by: !by ? 'Bắt buộc' : '',
  };
  const ok = !errs.email && !errs.acc && !errs.pass && !errs.by;
  const submit = () => {
    if (!ok) return setTried(true);
    itReturn(r.id, { email: email.trim(), accountName: acc.trim(), password: pass, by, note: note.trim() || undefined });
    onClose();
    toast(`IT đã trả tài khoản cho ${r.data.fullName} — đã cập nhật Employees và báo MarCom`);
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      width="max-w-xl"
      title={done ? `Tài khoản IT đã cấp — ${r.data.fullName}` : `IT trả thông tin tài khoản — ${r.data.fullName}`}
      footer={
        done ? (
          <Btn onClick={onClose}>Đóng</Btn>
        ) : (
          <>
            <Btn onClick={onClose}>Huỷ</Btn>
            <Btn variant="success" icon={ShieldCheck} onClick={submit} data-testid="it-return-submit">
              Gửi thông tin tài khoản
            </Btn>
          </>
        )
      }
    >
      <div className="space-y-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#1e3a5f] mb-1">Yêu cầu HCNS gửi ({req ? dmyhm(req.sentAt) : '—'} · {IT_MAILBOX})</p>
          <FieldTable
            labelWidth="34%"
            rows={[
              { label: 'Họ và tên', value: req?.fullName || r.data.fullName },
              { label: 'Khối', value: req?.block || r.block },
              { label: 'Cấp trên trực tiếp', value: req?.manager || r.data.manager },
              { label: 'Công ty', value: req?.company || r.company },
              { label: 'Ngày onboard', value: dmy(r.data.startDate) },
            ]}
          />
        </div>
        {done && t.itRet ? (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[#1e3a5f] mb-1">IT đã trả ({dmyhm(t.itRet.at)} · {t.itRet.by})</p>
            <FieldTable
              labelWidth="34%"
              rows={[
                { label: 'Email', value: <span className="font-mono">{t.itRet.email}</span> },
                { label: 'Tên tài khoản', value: <span className="font-mono">{t.itRet.accountName}</span> },
                { label: 'Mật khẩu', value: <Secret value={t.itRet.password} onCopy={() => toast('Đã sao chép mật khẩu')} /> },
                { label: 'Ghi chú IT', value: t.itRet.note || '' },
              ]}
            />
          </div>
        ) : (
          <div className="border border-slate-300 rounded-[4px] p-3 space-y-2.5">
            <p className="text-[12px] font-bold uppercase tracking-wide text-[#1e3a5f]">Thông tin tài khoản trả về</p>
            <FormRow label="Email" required error={tried ? errs.email : undefined}>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className={erp.inputFull} data-testid="it-email" />
            </FormRow>
            <FormRow label="Tên tài khoản" required error={tried ? errs.acc : undefined}>
              <input
                value={acc}
                onChange={(e) => {
                  const v = e.target.value;
                  // email đang theo tên tài khoản → đổi cùng
                  if (email === `${acc}@${domainOf(r.company)}`) setEmail(`${v}@${domainOf(r.company)}`);
                  setAcc(v);
                }}
                className={erp.inputFull}
                data-testid="it-account"
              />
            </FormRow>
            <FormRow label="Mật khẩu" required error={tried ? errs.pass : undefined} hint="Mật khẩu tạm — nhân sự bắt buộc đổi ở lần đăng nhập đầu">
              <span className="flex gap-1.5">
                <input value={pass} onChange={(e) => setPass(e.target.value)} className={`${erp.inputFull} font-mono`} data-testid="it-password" />
                <Btn icon={RefreshCw} onClick={() => setPass(genPassword())} title="Tạo mật khẩu ngẫu nhiên">
                  Tạo
                </Btn>
              </span>
            </FormRow>
            <FormRow label="Người cấp" required error={tried ? errs.by : undefined}>
              <select value={by} onChange={(e) => setBy(e.target.value)} className={`${erp.inputFull} cursor-pointer`}>
                <option value="">-- Chọn nhân sự IT --</option>
                {IT_STAFF.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </FormRow>
            <FormRow label="Ghi chú">
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="VD: đã cấp thêm VPN, Jira" className={erp.inputFull} />
            </FormRow>
          </div>
        )}
        {!done && (
          <div className="flex gap-2 bg-[#eef4fb] border border-[#b9d3f0] rounded-[4px] px-3 py-2 text-[12px] text-[#1e3a5f]">
            <KeyRound size={14} className="shrink-0 mt-0.5" />
            <span>
              Khi gửi: email + tên tài khoản ghi vào hồ sơ <b>{r.account.employeeCode}</b> trong Employees, HCNS xem được mật khẩu (ẩn mặc định) để bàn giao, và hệ thống tự báo <b>{MARCOM_MAILBOX}</b> chuẩn bị Welcome Onboard.
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};

export const MarcomDoneModal: React.FC<{ open: boolean; record: OnbRecord; onClose: () => void; toast: (m: string) => void }> = ({ open, record: r, onClose, toast }) => {
  const { marcomDone } = useOnboarding();
  const [by, setBy] = useState(MARCOM_STAFF[0]);
  const [note, setNote] = useState('');
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`MarCom xác nhận Welcome Onboard — ${r.data.fullName}`}
      footer={
        <>
          <Btn onClick={onClose}>Huỷ</Btn>
          <Btn
            variant="success"
            icon={CheckCircle2}
            onClick={() => {
              marcomDone(r.id, by, note.trim());
              onClose();
              toast(`MarCom đã chuẩn bị Welcome cho ${r.data.fullName}`);
            }}
            data-testid="marcom-done-submit"
          >
            Xác nhận đã chuẩn bị
          </Btn>
        </>
      }
    >
      <div className="space-y-3">
        <FieldTable
          labelWidth="34%"
          rows={[
            { label: 'Nhân sự mới', value: `${r.data.fullName} · ${r.data.position}` },
            { label: 'Khối · Phòng ban', value: `${r.block} · ${r.data.department}` },
            { label: 'Ngày onboard', value: dmy(r.data.startDate) },
            { label: 'Email công ty', value: r.account.companyEmail || '' },
          ]}
        />
        <FormRow label="Người xác nhận" required>
          <select value={by} onChange={(e) => setBy(e.target.value)} className={`${erp.inputFull} cursor-pointer`}>
            {MARCOM_STAFF.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </FormRow>
        <FormRow label="Ghi chú">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="VD: đã đặt welcome kit, lên lịch email chào mừng" className={erp.inputFull} />
        </FormRow>
        <p className="flex items-center gap-1.5 text-[12px] text-slate-500">
          <Send size={12} /> Email chào mừng toàn công ty soạn ở màn MarCom › Welcome Onboard.
        </p>
      </div>
    </Modal>
  );
};
