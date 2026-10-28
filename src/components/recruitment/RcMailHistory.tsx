/**
 * Tab "Lịch sử gửi mail" của popup Gửi mail + hộp "Huỷ lịch phỏng vấn" (CancelInterviewAsync).
 */
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, CalendarX, ChevronDown, ChevronRight, Info, Paperclip } from 'lucide-react';
import { Btn, erp, FieldTable } from '../erp/Erp';
import { Modal } from '../../marcom/MarcomUi';
import { useRc } from '../../recruitment/rc/RcContext';
import { MailLog, dmy, dmyhm } from '../../recruitment/rc/rcData';
import { ToneTag } from './rcUi';
import { FormField } from '../onboarding/onbUi';
import { eventDate, isInterviewKind, isLatestInvite, isPastInterview } from './rcMailRules';

const CANCEL_REASONS = ['Ứng viên từ chối', 'Công ty huỷ', 'Khác'];

export const RcMailHistory: React.FC<{ candidateId: string; onDone?: (msg: string) => void }> = ({ candidateId, onDone }) => {
  const rc = useRc();
  const [open, setOpen] = useState<string | null>(null);
  const [cancelFor, setCancelFor] = useState<MailLog | null>(null);
  const [reason, setReason] = useState('');
  const [tried, setTried] = useState(false);
  const [blocked, setBlocked] = useState('');

  const rows = rc.mailLogs.filter((m) => m.candidateId === candidateId).sort((a, b) => b.sentAt.localeCompare(a.sentAt));
  const reqCode = (appId: string) => {
    const a = rc.applications.find((x) => x.id === appId);
    return a ? rc.request(a.requestId)?.code || '' : '';
  };

  const confirmCancel = () => {
    if (!cancelFor) return;
    if (!reason) {
      setTried(true);
      return;
    }
    const latest = rc.mailLogs.find((m) => m.id === cancelFor.id);
    if (latest?.cancelled) return setBlocked('Lịch phỏng vấn này đã được huỷ trước đó.');
    if (!isLatestInvite(cancelFor, rc.mailLogs)) return setBlocked(`Lời mời phỏng vấn vòng ${cancelFor.kind.includes('Vòng 2') ? 2 : 1} này đã được thay bằng lời mời mới hơn — huỷ trên lời mời mới nhất.`);
    rc.cancelInterview(cancelFor.id, reason);
    onDone?.('Đã huỷ lịch phỏng vấn');
    setCancelFor(null);
  };

  return (
    <>
      <table className={erp.table}>
        <thead>
          <tr>
            {['', 'Ngày gửi', 'Loại mail', 'Tiêu đề', 'Trạng thái', ''].map((h, i) => (
              <th key={i} className={`${erp.th} text-left`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className={`${erp.td} text-center text-slate-400 py-6`}>
                Chưa gửi mail nào cho ứng viên này.
              </td>
            </tr>
          )}
          {rows.map((m) => {
            const invite = isInterviewKind(m.kind) && m.ok && !!m.eventId;
            const past = invite && isPastInterview(m);
            const canCancel = invite && !m.cancelled && !past && isLatestInvite(m, rc.mailLogs);
            const expanded = open === m.id;
            return (
              <React.Fragment key={m.id}>
                <tr className={`${erp.tr} cursor-pointer`} onClick={() => setOpen(expanded ? null : m.id)}>
                  <td className={`${erp.td} w-6 text-slate-400`}>{expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{dmyhm(m.sentAt)}</td>
                  <td className={erp.td}>
                    <span className="whitespace-nowrap">{m.kind}</span>
                    {reqCode(m.applicationId) && <span className="block text-[11px] text-slate-500 font-mono">{reqCode(m.applicationId)}</span>}
                  </td>
                  <td className={erp.td}>{m.subject}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>
                    {m.ok ? <ToneTag tone="green">Thành công</ToneTag> : <ToneTag tone="red">Lỗi</ToneTag>}{' '}
                    {m.cancelled && <ToneTag tone="gray">Đã huỷ</ToneTag>}
                    {past && !m.cancelled && <ToneTag tone="gray">Đã diễn ra</ToneTag>}
                  </td>
                  <td className={`${erp.td} whitespace-nowrap`} onClick={(e) => e.stopPropagation()}>
                    {canCancel && (
                      <Btn
                        className="h-7"
                        variant="danger"
                        icon={CalendarX}
                        onClick={() => {
                          setCancelFor(m);
                          setReason('');
                          setTried(false);
                          setBlocked('');
                        }}
                      >
                        Huỷ lịch
                      </Btn>
                    )}
                  </td>
                </tr>
                {expanded && (
                  <tr>
                    <td colSpan={6} className="border border-slate-200 bg-slate-50/60 p-3">
                      <FieldTable
                        labelWidth="16%"
                        rows={[
                          { label: 'Người gửi', value: m.sentBy },
                          { label: 'To', value: m.to },
                          { label: 'Cc', value: m.cc.join(', ') },
                          {
                            label: 'Đính kèm',
                            value: (
                              <span className="flex flex-wrap gap-1.5">
                                {m.attachments.map((a) => (
                                  <span key={a} className="inline-flex items-center gap-1 text-[12px]">
                                    <Paperclip size={11} className="text-slate-400" /> {a}
                                  </span>
                                ))}
                                {invite && <ToneTag tone="blue">.ics</ToneTag>}
                              </span>
                            ),
                          },
                          ...(m.error ? [{ label: 'Lỗi', value: <span className="text-rose-700">{m.error}</span> }] : []),
                        ]}
                      />
                      <div className="mt-2 border border-slate-200 bg-white rounded-[3px] p-3 text-[12.5px] leading-relaxed [&_ul]:list-disc [&_ul]:pl-5" dangerouslySetInnerHTML={{ __html: m.body }} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      {createPortal(
      <Modal
        open={!!cancelFor}
        onClose={() => setCancelFor(null)}
        title="Huỷ lịch phỏng vấn"
        footer={
          <>
            <Btn onClick={() => setCancelFor(null)}>Đóng</Btn>
            <Btn variant="danger" icon={CalendarX} onClick={confirmCancel}>
              Huỷ lịch
            </Btn>
          </>
        }
      >
        {cancelFor && (
          <div className="space-y-3">
            <FieldTable
              labelWidth="22%"
              rows={[
                { label: 'Vòng', value: cancelFor.kind.replace('Mời phỏng vấn - ', '') },
                { label: 'Ngày', value: eventDate(cancelFor) ? dmy(cancelFor.eventId!.slice(-16, -6)) + ' ' + cancelFor.eventId!.slice(-5) : dmyhm(cancelFor.sentAt) },
                { label: 'Tiêu đề', value: cancelFor.subject },
              ]}
            />
            <FormField
              label="Lý do huỷ"
              required
              error={tried && !reason ? 'Vui lòng chọn lý do huỷ' : undefined}
              hint={reason ? (reason === 'Ứng viên từ chối' ? 'Vòng tuyển dụng sẽ chuyển sang Not Interested.' : 'Vòng tuyển dụng giữ nguyên.') : undefined}
            >
              <select value={reason} onChange={(e) => setReason(e.target.value)} className={`${erp.inputFull} cursor-pointer`}>
                <option value="">— chọn lý do —</option>
                {CANCEL_REASONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </FormField>
            <p className="flex gap-1.5 text-[12px] text-slate-500">
              <Info size={13} className="shrink-0 mt-0.5" /> Muốn dời lịch / đổi phòng: gửi lại mail mời phỏng vấn với thông tin mới, không cần huỷ.
            </p>
            <div className="flex gap-2 bg-amber-50 border border-amber-300 rounded-[4px] px-3 py-2 text-[12px] text-amber-800">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              Outlook sẽ gửi thông báo huỷ lịch tới ứng viên và người phỏng vấn, đồng thời nhả phòng họp.
            </div>
            {blocked && <p className="text-[12px] font-semibold text-rose-600">{blocked}</p>}
          </div>
        )}
      </Modal>,
      document.body,
      )}
    </>
  );
};
