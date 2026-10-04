/**
 * PayrollApprovalPage — "Duyệt bảng lương khối" (bản đơn giản).
 *
 * Giám đốc khối chọn kỳ lương → xem số nhân sự, chi phí lương và danh sách nhân sự của khối mình
 * → Duyệt hoặc Từ chối (bắt buộc lý do). Chỉ duyệt được khi khối đang "Chờ duyệt".
 * HR / BGĐ: chọn khối để xem, không duyệt thay.
 */
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, CheckCircle2, Search, Users, X, XCircle } from 'lucide-react';
import { KHOIS, KHOI_DIRECTOR, KHOI_NAME, Khoi, latestVersion, periodLabel, rowsOf, sumRows, usePayroll } from '../payroll/PayrollContext';
import { BLOCK_TAG } from './PayrollListPage';
import { Btn, ErpPage, ErpTitleBar, KpiBox, Panel, Tag, erp } from './erp/Erp';

const money = (n: number) => Math.round(n || 0).toLocaleString('en-US');
const dmy = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

type Role = 'HR' | Khoi;

export const PayrollApprovalPage: React.FC = () => {
  const { periods, decide, focus, setFocus } = usePayroll();
  const withData = periods.filter((p) => p.versions.length).sort((a, b) => b.year - a.year || b.month - a.month);
  const [periodId, setPeriodId] = useState(() => focus?.periodId || withData.find((p) => !p.locked)?.id || withData[0]?.id || '');
  const [role, setRole] = useState<Role>(() => focus?.khoi || 'G3');
  const [hrKhoi, setHrKhoi] = useState<Khoi>('G1');
  const [q, setQ] = useState('');
  const [modal, setModal] = useState<'approve' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [reasonErr, setReasonErr] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3000);
  };
  useEffect(() => {
    if (!focus) return;
    setPeriodId(focus.periodId);
    if (focus.khoi) setRole(focus.khoi);
    setFocus(null);
  }, [focus]);

  const p = periods.find((x) => x.id === periodId);
  const khoi: Khoi = role === 'HR' ? hrKhoi : role;
  const v = p ? latestVersion(p) : undefined;
  const b = p?.blocks[khoi];
  const rows = rowsOf(v, khoi);
  const t = sumRows(rows);
  const shown = rows.filter((r) => !q.trim() || `${r.code} ${r.name} ${r.title} ${r.department}`.toLowerCase().includes(q.trim().toLowerCase()));
  const canDecide = !!p && !p.locked && role !== 'HR' && b?.status === 'Chờ duyệt';

  const confirm = () => {
    if (!p) return;
    if (modal === 'reject' && !reason.trim()) return setReasonErr(true);
    decide(p.id, khoi, modal === 'approve', KHOI_DIRECTOR[khoi].name, modal === 'reject' ? reason.trim() : undefined);
    flash(modal === 'approve' ? `Đã duyệt bảng lương ${KHOI_NAME[khoi]} kỳ ${periodLabel(p)}` : `Đã từ chối bảng lương ${KHOI_NAME[khoi]}`);
    setModal(null);
    setReason('');
    setReasonErr(false);
  };

  const statusNote = !b
    ? ''
    : b.status === 'Chờ duyệt'
      ? `Gửi ${dmy(b.sentAt)} · hạn duyệt ${dmy(b.deadline)}`
      : b.status === 'Đã duyệt'
        ? `Duyệt bởi ${b.decidedBy} · ${dmy(b.decidedAt)}`
        : b.status === 'Từ chối'
          ? `Từ chối bởi ${b.decidedBy} · ${dmy(b.decidedAt)}: “${b.reason}”`
          : 'HR chưa gửi duyệt';

  return (
    <ErpPage>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-5 right-5 z-[130] bg-[#1e3a5f] text-white px-4 py-2.5 rounded-[4px] shadow-lg flex items-center gap-2 text-[12px] font-semibold max-w-md"
          >
            <Check size={14} className="text-emerald-300 shrink-0" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <ErpTitleBar
        crumbs={['PayRoll', 'Duyệt bảng lương khối']}
        title="Duyệt bảng lương khối"
        actions={
          <>
            <select value={periodId} onChange={(e) => setPeriodId(e.target.value)} className={`${erp.input} w-36`} title="Kỳ lương">
              {withData.map((x) => (
                <option key={x.id} value={x.id}>
                  Kỳ {periodLabel(x)}
                </option>
              ))}
            </select>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className={`${erp.input} w-60`} title="Vai trò">
              <option value="HR">HR / BGĐ (xem tất cả)</option>
              {KHOIS.map((k) => (
                <option key={k} value={k}>
                  GĐK {k} — {KHOI_DIRECTOR[k].name}
                </option>
              ))}
            </select>
            {role === 'HR' && (
              <select value={hrKhoi} onChange={(e) => setHrKhoi(e.target.value as Khoi)} className={`${erp.input} w-32`} title="Khối">
                {KHOIS.map((k) => (
                  <option key={k} value={k}>
                    Khối {k}
                  </option>
                ))}
              </select>
            )}
            {canDecide && (
              <>
                <Btn variant="danger" icon={XCircle} onClick={() => (setModal('reject'), setReasonErr(false))}>
                  Từ chối
                </Btn>
                <Btn variant="primary" icon={CheckCircle2} onClick={() => setModal('approve')}>
                  Duyệt
                </Btn>
              </>
            )}
          </>
        }
        meta={
          p && v && b
            ? [
                { label: 'Khối', value: `${khoi} · ${KHOI_NAME[khoi]}` },
                { label: 'Phiên bản', value: `v${v.no}` },
                { label: 'Trạng thái', value: <Tag cls={BLOCK_TAG[b.status]}>{b.status}</Tag> },
                { label: 'Ghi chú', value: <span className={b.status === 'Từ chối' ? 'text-rose-700' : ''}>{statusNote}</span> },
              ]
            : []
        }
      />

      {!p || !v ? (
        <Panel title="Bảng lương" icon={Users}>
          <p className="py-8 text-center text-[13px] text-slate-500">Chưa có bảng lương nào được gửi duyệt.</p>
        </Panel>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <KpiBox label="Số nhân sự" value={String(t.count)} sub={KHOI_NAME[khoi]} />
            <KpiBox label="Tổng thực nhận (VNĐ)" value={money(t.net)} valueText={money(t.net)} sub="Tiền chi trả cho nhân viên" />
            <KpiBox label="Chi phí lương của khối (VNĐ)" value={money(t.cost)} valueText={money(t.cost)} sub="Tổng thu nhập + BH doanh nghiệp" />
          </div>

          <Panel
            title={`Danh sách nhân sự (${rows.length})`}
            icon={Users}
            noPad
            actions={
              <div className="relative w-56">
                <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã, tên…" className={`${erp.inputFull} h-7 pl-7`} />
              </div>
            }
            footer="ĐVT: VNĐ"
          >
            <div className="overflow-x-auto max-h-[560px]">
              <table className={erp.table}>
                <thead className="sticky top-0 z-10">
                  <tr>
                    {['STT', 'Mã NV', 'Họ tên', 'Chức danh', 'Phòng ban', 'Tổng thu nhập', 'Thực nhận', 'Chi phí công ty'].map((h, i) => (
                      <th key={h} className={`${erp.th} ${i > 4 ? 'text-right' : 'text-left'} border-t-0 first:border-l-0 last:border-r-0 whitespace-nowrap`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r, i) => (
                    <tr key={r.code} className={erp.tr}>
                      <td className={`${erp.td} text-center text-slate-500 border-l-0`}>{i + 1}</td>
                      <td className={`${erp.td} ${erp.code}`}>{r.code}</td>
                      <td className={`${erp.td} whitespace-nowrap`}>{r.name}</td>
                      <td className={erp.td}>{r.title}</td>
                      <td className={erp.td}>{r.department}</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(r.gross)}</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(r.net)}</td>
                      <td className={`${erp.td} ${erp.num} border-r-0`}>{money(r.cost)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={erp.totalRow}>
                    <td className={`${erp.td} border-l-0`} colSpan={5}>
                      Tổng cộng
                    </td>
                    <td className={`${erp.td} ${erp.num}`}>{money(shown.reduce((s, r) => s + r.gross, 0))}</td>
                    <td className={`${erp.td} ${erp.num}`}>{money(shown.reduce((s, r) => s + r.net, 0))}</td>
                    <td className={`${erp.td} ${erp.num} border-r-0`}>{money(shown.reduce((s, r) => s + r.cost, 0))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Panel>
        </>
      )}

      <AnimatePresence>
        {modal && p && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(null)} className="absolute inset-0 bg-black/40" />
            <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }} className="relative z-10 bg-white w-full max-w-md rounded-[4px] border border-slate-400 shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e3a5f] text-white rounded-t-[3px]">
                <h3 className="text-[14px] font-bold">
                  {modal === 'approve' ? 'Duyệt' : 'Từ chối'} bảng lương {KHOI_NAME[khoi]} — kỳ {periodLabel(p)}
                </h3>
                <button onClick={() => setModal(null)} className="p-1 rounded hover:bg-white/10 cursor-pointer" title="Đóng">
                  <X size={18} />
                </button>
              </div>
              <div className="p-4 space-y-3 text-[13px]">
                <p>
                  {t.count} nhân sự · Chi phí lương <b>{money(t.cost)} VNĐ</b>
                </p>
                {modal === 'reject' && (
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">
                      Lý do từ chối <span className="text-rose-500">*</span>
                    </p>
                    <textarea
                      value={reason}
                      onChange={(e) => (setReason(e.target.value), setReasonErr(false))}
                      rows={3}
                      placeholder="Nhập lý do để HR chỉnh sửa…"
                      className={`${erp.inputFull} h-auto py-1.5 ${reasonErr ? '!border-rose-400 bg-rose-50/40' : ''}`}
                    />
                    {reasonErr && <p className="text-[11.5px] text-rose-600 mt-0.5">Nhập lý do từ chối.</p>}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 px-3 py-2 border-t border-slate-300 bg-slate-50 rounded-b-[3px]">
                <Btn onClick={() => setModal(null)}>Huỷ</Btn>
                <Btn variant={modal === 'approve' ? 'primary' : 'danger'} icon={modal === 'approve' ? CheckCircle2 : XCircle} onClick={confirm}>
                  {modal === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối'}
                </Btn>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ErpPage>
  );
};
