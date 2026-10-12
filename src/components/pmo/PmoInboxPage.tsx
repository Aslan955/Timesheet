/**
 * PmoInboxPage — PMO-07 Inbox phê duyệt: một hàng đợi chung cho gate (F2.2), CR (F9.2),
 * waiver quality gate (F5.2), yêu cầu nguồn lực (F8.1), điều chuyển liên khối (F8.2), phân bổ giá trị (F3.4).
 * Đồng hồ SLA theo ngày làm việc; quá hạn tô đỏ. Duyệt / Từ chối ngay trên dòng; từ chối bắt buộc có lý do (nhập inline, không popup).
 */
import React, { useMemo, useState } from 'react';
import { Check, Filter, Inbox, X } from 'lucide-react';
import { InboxItem, InboxKind, InboxStatus, TODAY, dmy, workDays } from '../../pmo/pmo';
import { usePmo } from '../../pmo/PmoContext';
import { Btn, ErpPage, ErpTitleBar, Panel, Tag, erp } from '../erp/Erp';
import { RoleSelect } from './PmoBits';
import { PmoGateSummary } from './PmoGateSummary';

const KIND_CLS: Record<InboxKind, string> = {
  Gate: 'bg-violet-50 text-violet-700 border-violet-200',
  CR: 'bg-sky-50 text-sky-700 border-sky-200',
  Waiver: 'bg-amber-50 text-amber-700 border-amber-200',
  'Nguồn lực': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Điều chuyển': 'bg-teal-50 text-teal-700 border-teal-200',
  'Phân bổ giá trị': 'bg-slate-50 text-slate-700 border-slate-200',
};
const STATUS_CLS: Record<InboxStatus, string> = {
  'Chờ duyệt': 'bg-amber-50 text-amber-700 border-amber-200',
  'Đã duyệt': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Từ chối': 'bg-rose-50 text-rose-700 border-rose-200',
};
const KINDS: InboxKind[] = ['Gate', 'CR', 'Waiver', 'Nguồn lực', 'Điều chuyển', 'Phân bổ giá trị'];
const SEL = `${erp.input} h-7 text-[12px]`;

export const PmoInboxPage: React.FC<{ onNavigate?: (item: string) => void }> = ({ onNavigate }) => {
  const { inbox, decide, projects, setFocusId, role, setRole } = usePmo();
  const [kind, setKind] = useState('');
  const [status, setStatus] = useState<string>('Chờ duyệt');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [msg, setMsg] = useState('');
  /** PMO-08: mở tóm tắt gate 1 trang (cùng màn, có nút Quay lại). */
  const [summaryId, setSummaryId] = useState<string | null>(null);
  const flash = (s: string) => {
    setMsg(s);
    window.setTimeout(() => setMsg(''), 3500);
  };

  const rows = useMemo(
    () =>
      inbox
        .filter((x) => (!kind || x.kind === kind) && (!status || x.status === status))
        .sort((a, b) => (a.status === 'Chờ duyệt' ? 0 : 1) - (b.status === 'Chờ duyệt' ? 0 : 1) || a.submittedAt.localeCompare(b.submittedAt)),
    [inbox, kind, status],
  );
  const pending = inbox.filter((x) => x.status === 'Chờ duyệt');
  const overdue = pending.filter((x) => workDays(x.submittedAt, TODAY) > x.slaDays);
  const proj = (id: string) => projects.find((p) => p.id === id);

  const approve = (x: InboxItem) => {
    decide(x.id, true);
    flash(`Đã duyệt ${x.id} — ${x.kind === 'Gate' ? 'dự án sang bước kế tiếp, ghi audit' : x.kind === 'CR' ? 'mở khóa WBS/plan theo phạm vi CR' : x.kind === 'Điều chuyển' ? 'chuyển sang GĐK khối nhận duyệt' : 'ghi audit'}`);
  };
  const reject = (x: InboxItem) => {
    if (!reason.trim()) return;
    decide(x.id, false, reason.trim());
    setRejectId(null);
    setReason('');
    flash(`Đã từ chối ${x.id} — PM sửa và trình lại (giữ lịch sử)`);
  };

  const summary = summaryId ? inbox.find((x) => x.id === summaryId) : null;
  if (summary)
    return (
      <PmoGateSummary
        projectId={summary.projectId}
        title={summary.title}
        onBack={() => setSummaryId(null)}
        onDecide={
          summary.status === 'Chờ duyệt'
            ? (ok, why) => {
                decide(summary.id, ok, why);
                setSummaryId(null);
                flash(ok ? `Đã duyệt ${summary.id} — dự án sang bước kế tiếp, ghi audit` : `Đã từ chối ${summary.id} — PM sửa và trình lại (giữ lịch sử)`);
              }
            : undefined
        }
      />
    );

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', 'Inbox phê duyệt']}
        title="Inbox phê duyệt"
        actions={<RoleSelect value={role} onChange={setRole} />}
        meta={[
          { label: 'Chờ duyệt', value: pending.length },
          { label: 'Quá SLA', value: <span className={overdue.length ? 'text-rose-700' : ''}>{overdue.length}</span> },
          ...KINDS.map((k) => ({ label: k, value: pending.filter((x) => x.kind === k).length })),
        ]}
      />

      <Panel
        title="Hàng đợi"
        icon={Inbox}
        noPad
        actions={msg ? <span className="text-[12px] text-emerald-700">{msg}</span> : undefined}
        footer="SLA: gate 2 ngày LV · CR 48h · điều chuyển 3 ngày LV mỗi bước. Quá hạn → nhắc người duyệt và cảnh báo cấp trên (AL-07). Từ chối phải có lý do; PM sửa và trình lại, hệ thống giữ lịch sử."
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
          <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300">
            <Filter size={13} className="text-[#1f5fa8]" /> Lọc
          </span>
          <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
            Loại
            <select value={kind} onChange={(e) => setKind(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              {KINDS.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
            Trạng thái
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              <option>Chờ duyệt</option>
              <option>Đã duyệt</option>
              <option>Từ chối</option>
            </select>
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1100px]`}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 w-20`}>Mã</th>
                <th className={`${erp.th} border-t-0 w-28`}>Loại</th>
                <th className={`${erp.th} border-t-0 text-left w-56`}>Dự án</th>
                <th className={`${erp.th} border-t-0 text-left`}>Nội dung</th>
                <th className={`${erp.th} border-t-0 text-left w-40`}>Người trình</th>
                <th className={`${erp.th} border-t-0 text-center w-28`}>SLA</th>
                <th className={`${erp.th} border-t-0 text-left w-36`}>Bước duyệt</th>
                <th className={`${erp.th} border-t-0 border-r-0 text-center w-44`}>Quyết định</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => {
                const p = proj(x.projectId);
                const wd = workDays(x.submittedAt, TODAY);
                const over = x.status === 'Chờ duyệt' && wd > x.slaDays;
                const rejecting = rejectId === x.id;
                return (
                  <tr key={x.id} className={rejecting ? 'bg-[#fff5f5]' : erp.tr}>
                    <td className={`${erp.td} border-l-0 ${erp.code} align-top`}>{x.id}</td>
                    <td className={`${erp.td} align-top`}>
                      <Tag cls={KIND_CLS[x.kind]}>{x.kind}</Tag>
                    </td>
                    <td className={`${erp.td} align-top`}>
                      <button
                        type="button"
                        onClick={() => (setFocusId(x.projectId), onNavigate?.('Project Cockpit'))}
                        className="text-left text-[#1f5fa8] hover:underline cursor-pointer leading-tight"
                        title="Mở Project Cockpit"
                      >
                        <span className="font-mono text-[11.5px]">{x.projectId}</span>
                        <span className="block text-slate-700">{p?.name}</span>
                      </button>
                    </td>
                    <td className={`${erp.td} align-top`}>
                      <p className="font-semibold text-slate-800">
                        {x.title}
                        {x.kind === 'Gate' && (
                          <button type="button" onClick={() => setSummaryId(x.id)} className="ml-2 text-[11.5px] font-normal text-[#1f5fa8] hover:underline cursor-pointer">
                            Xem tóm tắt 1 trang
                          </button>
                        )}
                      </p>
                      <p className="text-[11.5px] text-slate-600">{x.detail}</p>
                      {x.impact && (
                        <p className="text-[11.5px] text-slate-700 mt-0.5">
                          {x.impact.map((i, k) => (
                            <span key={k} className="inline-block mr-2.5">
                              <span className="text-slate-500">{i.label}:</span> <b>{i.value}</b>
                            </span>
                          ))}
                        </p>
                      )}
                      {x.status === 'Từ chối' && x.reason && <p className="text-[11.5px] text-rose-700 mt-0.5">Lý do từ chối: {x.reason}</p>}
                    </td>
                    <td className={`${erp.td} align-top`}>
                      {x.submittedBy}
                      <span className="block text-[11px] text-slate-500 tabular-nums">{dmy(x.submittedAt)}</span>
                    </td>
                    <td className={`${erp.td} align-top text-center tabular-nums`}>
                      {x.status === 'Chờ duyệt' ? (
                        <span className={`font-bold ${over ? 'text-rose-700' : wd === x.slaDays ? 'text-amber-700' : 'text-slate-800'}`}>
                          {wd}/{x.slaDays} ngày
                          {over && <span className="block text-[10.5px] font-semibold">quá hạn</span>}
                        </span>
                      ) : (
                        <span className="text-slate-500">{dmy(x.decidedAt || '')}</span>
                      )}
                    </td>
                    <td className={`${erp.td} align-top text-[11.5px]`}>
                      <b className="text-slate-800">{x.approver}</b>
                      {x.step && <span className="block text-slate-500">{x.step}</span>}
                    </td>
                    <td className={`${erp.td} border-r-0 align-top text-center`}>
                      {x.status !== 'Chờ duyệt' ? (
                        <Tag cls={STATUS_CLS[x.status]}>{x.status}</Tag>
                      ) : rejecting ? (
                        <div className="flex flex-col gap-1">
                          <input
                            autoFocus
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            onKeyDown={(e) => (e.key === 'Enter' ? reject(x) : e.key === 'Escape' ? setRejectId(null) : null)}
                            placeholder="Lý do từ chối *"
                            className={`${erp.input} h-7 text-[12px] w-full ${!reason.trim() ? 'border-rose-300' : ''}`}
                          />
                          <div className="flex gap-1 justify-center">
                            <Btn variant="danger" className="h-6! px-2! text-[11px]!" onClick={() => reject(x)} disabled={!reason.trim()}>
                              Xác nhận từ chối
                            </Btn>
                            <Btn className="h-6! px-2! text-[11px]!" onClick={() => setRejectId(null)}>
                              Huỷ
                            </Btn>
                          </div>
                        </div>
                      ) : (
                        <div className="inline-flex gap-1">
                          <Btn variant="success" className="h-7 px-2.5" icon={Check} onClick={() => approve(x)}>
                            Duyệt
                          </Btn>
                          <Btn variant="danger" className="h-7 px-2.5" icon={X} onClick={() => (setRejectId(x.id), setReason(''))}>
                            Từ chối
                          </Btn>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-slate-400 italic">
                    Không có yêu cầu nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </ErpPage>
  );
};
