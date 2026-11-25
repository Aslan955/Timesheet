/**
 * Hộp thoại Đóng dự án: bảng tổng kết lãi / lỗ (Kế hoạch vs Thực tế — doanh thu, chi phí, dòng tiền,
 * thời gian hoàn thành) + luồng duyệt Yêu cầu → GĐ khối → Kế toán → BOD.
 * mode: request (AM / GĐKD / GĐ khối gửi) · decide (bước đang chờ duyệt / từ chối) · view (chỉ xem).
 */
import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { CalendarClock, Check, CheckCircle2, ChevronRight, Flag, SkipForward, X, XCircle, Clock3 } from 'lucide-react';
import { BizProject, BizRole, CLOSE_EXTRA_FIELDS, CLOSE_REVIEW_FIELDS, CloseExtraCost, CloseExtraKey, CloseReview, closeReviewMissing, closeApproveTo, closeEntryState, closePendingStep, closeStateLabel, closeTargetLabel, PAKD_STEP_LABEL, pendingOutsource } from '../business/BusinessProjectContext';
import { CASH_SPEED_RULE, CashSpeed, CloseLine, closeSummary, closeTrack, lineTone, timeText } from '../business/projectClose';
import { Btn, FolderTabs, KpiBox, Tag, erp } from './erp/Erp';
import { parseAmount } from '../business/blockPlan';

export type CloseMode = 'request' | 'decide' | 'view';

const money = (n: number) => Math.round(n || 0).toLocaleString('en-US');
const signed = (n: number) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${money(Math.abs(n))}`;
const pct1 = (x: number | null | undefined) => (x === null || x === undefined ? '—' : `${(x * 100).toFixed(1)}%`);
const dmy = (d: string) => (d ? d.slice(0, 10).split('-').reverse().join('/') : '—');
const mmyy = (m: string) => `${m.slice(5, 7)}/${m.slice(0, 4)}`;
const dt = (s: string) => new Date(s).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const TONE_TXT = { good: 'text-emerald-700', bad: 'text-rose-600', neutral: 'text-slate-700' } as const;
const speedTxt = (c: CashSpeed) => (c.label === 'Nhanh' ? 'text-emerald-700' : c.label === 'Chậm' ? 'text-rose-600' : 'text-slate-400');
const SpeedTag: React.FC<{ ratio: number | null }> = ({ ratio }) =>
  ratio === null ? (
    <span className="text-slate-300">—</span>
  ) : (
    <span className={`inline-block px-1.5 py-px rounded-[3px] border text-[11px] font-semibold ${ratio >= 1 ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-rose-300 bg-rose-50 text-rose-700'}`}>{ratio >= 1 ? 'Nhanh' : 'Chậm'}</span>
  );

export const ProjectCloseModal: React.FC<{
  project: BizProject;
  role: BizRole;
  mode: CloseMode;
  onClose: () => void;
  onRequest?: (review: CloseReview) => void;
  onDecide?: (approve: boolean, note: string, extra?: Pick<CloseExtraCost, CloseExtraKey>) => void;
}> = ({ project: p, role, mode, onClose, onRequest, onDecide }) => {
  // Bước Kế toán: nhập Chi phí tài chính / quản lý / khác (CP quản lý gợi ý = sổ CP quản lý phân bổ)
  const acctStep = mode === 'decide' && closePendingStep(p.closeRequest) === 'CFO';
  const base = useMemo(() => closeSummary(p, undefined, null), [p]);
  const [draft, setDraft] = useState<Record<CloseExtraKey, string>>(() => {
    const e = p.closeRequest?.extraCost;
    return { finance: e ? money(e.finance) : '', mgmt: money(e ? e.mgmt : base.mgmtLedger), other: e ? money(e.other) : '' };
  });
  const [extraErr, setExtraErr] = useState<CloseExtraKey[]>([]);
  const parsed = (k: CloseExtraKey) => (draft[k].trim() ? parseAmount(draft[k]) : null);
  const draftNums = { finance: parsed('finance') ?? 0, mgmt: parsed('mgmt') ?? 0, other: parsed('other') ?? 0 };
  const s = useMemo(() => (acctStep ? closeSummary(p, undefined, draftNums) : closeSummary(p)), [p, acctStep, draft]); // eslint-disable-line react-hooks/exhaustive-deps
  const approve = () => {
    if (!acctStep) return onDecide?.(true, note.trim());
    const bad = CLOSE_EXTRA_FIELDS.map((f) => f.key).filter((k) => {
      const v = parsed(k);
      return v === null || v < 0;
    });
    if (bad.length) {
      setExtraErr(bad);
      setTab('compare');
      setTimeout(() => document.querySelector<HTMLInputElement>(`[data-testid=extra-${bad[0]}]`)?.focus(), 0);
      return;
    }
    onDecide?.(true, note.trim(), draftNums);
  };
  const [tab, setTab] = useState<'compare' | 'month' | 'speed'>('compare');
  const [note, setNote] = useState('');
  const [needNote, setNeedNote] = useState(false);
  const [review, setReview] = useState<CloseReview>(() => (p.closeRequest?.state === 'Từ chối' && p.closeRequest.review) || { strengths: '', weaknesses: '', advantages: '', difficulties: '' }); // gửi lại sau khi bị từ chối ⇒ điền sẵn bản cũ
  const [missing, setMissing] = useState<(keyof CloseReview)[]>([]);
  const submit = () => {
    const m = closeReviewMissing(review);
    if (m.length) {
      setMissing(m);
      document.querySelector<HTMLTextAreaElement>(`[data-testid=review-${m[0]}]`)?.focus();
      return;
    }
    onRequest?.(review);
  };
  const c = p.closeRequest;
  const track = closeTrack(mode === 'request' ? undefined : c);
  const blocked = mode === 'request' && pendingOutsource(p).length ? 'Còn mã outsource chờ GĐ khối duyệt — duyệt / từ chối trước khi đóng dự án' : '';
  const lossy = s.profit.actual < 0;
  const step = closePendingStep(c);
  const title = mode === 'request' ? 'Yêu cầu đóng dự án' : mode === 'decide' ? `${PAKD_STEP_LABEL[step!]} duyệt đóng dự án` : 'Báo cáo tổng kết dự án';

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 pt-16">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40" />
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 12 }}
        className="relative bg-white w-full max-w-[1080px] max-h-[calc(100vh-80px)] flex flex-col rounded-[4px] border border-slate-400 shadow-2xl z-10"
        data-testid="close-modal"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-t-[3px]">
          <h3 className="text-[14px] font-bold flex items-center gap-2 min-w-0">
            <Flag size={16} className="shrink-0" />
            <span className="truncate">
              {title} — {p.masterCode} · {p.name}
            </span>
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 cursor-pointer shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-3 space-y-3">
          {/* Thông tin chung */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border border-slate-200 rounded-[3px] text-[12.5px]">
            {[
              ['Khách hàng', p.customerName],
              ['Khối · AM', `${p.division} · ${p.am.join(', ') || '—'}`],
              ['Hợp đồng', p.contract?.number ? `${p.contract.number} · ${money(p.contract.value)}` : p.contractSigned ? money(p.expectedRevenue) : 'Chưa ký'],
              ['Số liệu thực tế đến', s.lastActualMonth ? `Tháng ${mmyy(s.lastActualMonth)}` : 'Chưa có số thực tế'],
            ].map(([k, v], i) => (
              <div key={k} className={`px-3 py-1.5 ${i ? 'border-l border-slate-200' : ''} max-lg:[&:nth-child(3)]:border-l-0 max-lg:[&:nth-child(n+3)]:border-t`}>
                <p className="text-[11px] text-slate-500">{k}</p>
                <p className="font-semibold text-slate-800 truncate" title={v}>
                  {v}
                </p>
              </div>
            ))}
          </div>

          {/* Quy trình duyệt */}
          <div className="flex flex-wrap items-stretch gap-1.5" data-testid="close-track">
            {track.map((t, i) => {
              const sty =
                t.state === 'done'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : t.state === 'reject'
                    ? 'border-rose-300 bg-rose-50 text-rose-700'
                    : t.state === 'current'
                      ? 'border-amber-400 bg-amber-50 text-amber-800 ring-1 ring-amber-300'
                      : t.state === 'skip'
                        ? 'border-slate-200 bg-slate-50 text-slate-400'
                        : 'border-slate-200 bg-white text-slate-500';
              const Icon = t.state === 'done' ? Check : t.state === 'reject' ? XCircle : t.state === 'skip' ? SkipForward : t.state === 'current' ? Clock3 : ChevronRight;
              const pre = mode === 'request' && t.step === 'Yêu cầu';
              const preSkip = mode === 'request' && t.step === 'GĐK' && closeEntryState(role) !== 'Chờ GĐK';
              return (
                <React.Fragment key={t.step}>
                  {i > 0 && <ChevronRight size={14} className="self-center text-slate-300 shrink-0" />}
                  <div className={`flex-1 min-w-[150px] border rounded-[3px] px-2.5 py-1.5 ${pre ? 'border-[#1f5fa8] bg-[#eef4fb] text-[#1e3a5f]' : preSkip ? 'border-slate-200 bg-slate-50 text-slate-400' : sty}`}>
                    <p className="text-[12px] font-bold flex items-center gap-1">
                      <Icon size={13} className="shrink-0" /> {t.label}
                    </p>
                    <p className="text-[11px] leading-tight truncate" title={'note' in t ? t.note : undefined}>
                      {pre
                        ? `Bạn (${role}) gửi`
                        : preSkip || t.state === 'skip'
                          ? 'Bỏ qua — GĐ khối / GĐKD yêu cầu'
                          : t.state === 'current'
                            ? 'Đang chờ duyệt'
                            : 'by' in t && t.by
                              ? `${t.by} · ${dt(t.at!)}`
                              : 'Chưa đến'}
                    </p>
                    {'note' in t && t.note && <p className="text-[11px] italic leading-tight truncate" title={t.note}>“{t.note}”</p>}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          {c?.state === 'Từ chối' && mode !== 'decide' && (
            <p className="text-[12px] text-rose-700 bg-rose-50 border border-rose-200 rounded-[3px] px-2.5 py-1.5">
              Lần yêu cầu trước: <b>{closeStateLabel(c)}</b>
              {c.log[c.log.length - 1]?.note ? ` — “${c.log[c.log.length - 1].note}”` : ''}.
            </p>
          )}

          {/* KPI */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            <KpiBox label="Doanh thu thực tế" value={money(s.revenue.actual)} valueText={money(s.revenue.actual)} badge={s.revenue.plan ? pct1(s.revenue.actual / s.revenue.plan) : undefined} tone={s.revenue.actual >= s.revenue.plan ? 'good' : 'bad'} sub={`Kế hoạch ${money(s.revenue.plan)}`} />
            <KpiBox label="Chi phí thực tế" value={money(s.cost.actual)} valueText={money(s.cost.actual)} badge={s.cost.plan ? pct1(s.cost.actual / s.cost.plan) : undefined} tone={s.cost.actual <= s.cost.plan ? 'good' : 'bad'} sub={`Kế hoạch ${money(s.cost.plan)}`} />
            <KpiBox
              label={lossy ? 'Lỗ trước thuế thực tế' : 'Lợi nhuận trước thuế thực tế'}
              value={<span className={lossy ? 'text-rose-600' : 'text-emerald-700'}>{signed(s.profit.actual)}</span>}
              valueText={signed(s.profit.actual)}
              badge={pct1(s.margin.actual)}
              tone={lossy || s.profit.actual < s.profit.plan ? 'bad' : 'good'}
              sub={`Kế hoạch ${signed(s.profit.plan)}`}
            />
            <KpiBox label="Dòng tiền thuần thực tế" value={<span className={s.net.actual < 0 ? 'text-rose-600' : ''}>{signed(s.net.actual)}</span>} valueText={signed(s.net.actual)} tone={s.net.actual >= s.net.plan ? 'good' : 'bad'} sub={`Kế hoạch ${signed(s.net.plan)}`} />
            <KpiBox
              label="Thời gian hoàn thành"
              value={timeText(s.time)}
              valueText={timeText(s.time)}
              tone={s.time.lateDays > 0 ? 'bad' : 'good'}
              sub={`KH ${dmy(s.time.planEnd)} · TT ${dmy(s.time.actualEnd)}`}
            />
            <KpiBox
              label="Tốc độ dòng tiền về"
              value={<span className={speedTxt(s.cashSpeed)} data-testid="cash-speed">{s.cashSpeed.label}</span>}
              valueText={s.cashSpeed.label}
              badge={s.cashSpeed.avg === null ? undefined : pct1(s.cashSpeed.avg)}
              tone={s.cashSpeed.label === 'Chậm' ? 'bad' : 'good'}
              sub={s.cashSpeed.months ? `TB ${s.cashSpeed.months} tháng · ${s.cashSpeed.fast} nhanh / ${s.cashSpeed.slow} chậm` : 'Chưa có số thu thực tế'}
              onClick={() => setTab('speed')}
            />
          </div>

          <div className="border border-slate-300 rounded-[3px]">
            <div className="bg-[#f7f9fc] pt-1.5">
              <FolderTabs
                tabs={[
                  { key: 'compare', label: 'Tổng kết Kế hoạch – Thực tế' },
                  { key: 'month', label: 'Dòng tiền theo tháng' },
                  { key: 'speed', label: 'Tốc độ dòng tiền về' },
                ]}
                value={tab}
                onChange={setTab}
              />
            </div>
            {tab === 'compare' ? (
              <CompareTable
                lines={s.lines}
                time={s.time}
                cashSpeed={s.cashSpeed}
                edit={
                  acctStep
                    ? {
                        draft,
                        err: extraErr,
                        onChange: (k, v) => {
                          setDraft((d) => ({ ...d, [k]: v }));
                          setExtraErr((e) => e.filter((x) => x !== k));
                        },
                      }
                    : undefined
                }
              />
            ) : tab === 'month' ? (
              <MonthTable s={s} />
            ) : (
              <SpeedTable s={s} />
            )}
            {acctStep && tab === 'compare' && (
              <p className="px-3 py-1.5 border-t border-amber-200 bg-amber-50 text-[12px] text-amber-800" data-testid="extra-hint">
                <b>Kế toán nhập</b> Chi phí tài chính, Chi phí quản lý, Chi phí khác (bắt buộc, không có thì nhập 0) — cộng vào Tổng chi phí thực tế, lãi / lỗ và dòng tiền. Chi phí quản lý điền sẵn theo sổ CP quản lý phân bổ: <b>{money(base.mgmtLedger)}</b>.
                {extraErr.length > 0 && <span className="text-rose-600 font-semibold"> Nhập đủ {extraErr.map((k) => CLOSE_EXTRA_FIELDS.find((f) => f.key === k)!.label.toLowerCase()).join(', ')}.</span>}
              </p>
            )}
            <p className="px-3 py-1.5 border-t border-slate-200 text-[11.5px] text-slate-500">
              Kế hoạch: {s.planSource === 'monthly' ? 'kế hoạch theo tháng đã import' : 'PAKD đã duyệt (chưa có kế hoạch tháng)'} · Thực tế: số Kế toán import{s.lastActualMonth ? ` đến tháng ${mmyy(s.lastActualMonth)}` : ''} · Đơn vị: VNĐ. Chi phí chung, chi phí tài chính / quản lý / khác không có trong kế hoạch; Chi phí chung = phân bổ từ sheet Chi phí chung riêng; Lợi nhuận trước thuế = Doanh thu − Tổng chi phí − CP tài chính − CP quản lý − CP khác{s.hasExtra ? '' : ' (chưa có số Kế toán nhập: CP quản lý tạm lấy sổ CP quản lý phân bổ, CP tài chính / khác = 0)'}; Tổng chi phí = SX + KD + Chi phí chung; Tiền chi ra gồm cả 3 khoản Kế toán nhập.
            </p>
          </div>

          {mode === 'request' ? (
            <div data-testid="close-review">
              <p className="text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide mb-1.5">
                Đánh giá dự án <span className="normal-case font-normal text-slate-500 tracking-normal">— bắt buộc nhập đủ 4 mục</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {CLOSE_REVIEW_FIELDS.map((f) => {
                  const err = missing.includes(f.key);
                  return (
                    <label key={f.key} className="block">
                      <span className="text-[12px] font-semibold text-slate-700">
                        {f.label} <span className="text-rose-600">*</span>
                      </span>
                      <textarea
                        value={review[f.key]}
                        onChange={(e) => {
                          const v = e.target.value;
                          setReview((r) => ({ ...r, [f.key]: v }));
                          if (v.trim()) setMissing((m) => m.filter((k) => k !== f.key));
                        }}
                        rows={3}
                        placeholder={f.hint}
                        className={`${erp.inputFull} h-auto py-1.5 mt-1 ${err ? 'border-rose-500 bg-rose-50/40' : ''}`}
                        data-testid={`review-${f.key}`}
                      />
                      {err && <span className="text-[11.5px] text-rose-600">Nhập {f.label.toLowerCase()}.</span>}
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            c?.review && <ReviewView review={c.review} by={c.requestedBy} />
          )}

          {mode === 'decide' && (
            <label className="block">
              <span className="text-[12px] font-semibold text-slate-700">
                Ý kiến <span className="font-normal text-slate-500">(bắt buộc khi từ chối)</span>
              </span>
              <textarea
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                  setNeedNote(false);
                }}
                rows={2}
                placeholder="Nhập ý kiến…"
                className={`${erp.inputFull} h-auto py-1.5 mt-1 ${needNote ? 'border-rose-500' : ''}`}
                data-testid="close-note"
              />
              {needNote && <span className="text-[11.5px] text-rose-600">Nhập lý do từ chối.</span>}
            </label>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-t border-slate-200 bg-slate-50 rounded-b-[3px]">
          <span className="flex-1 text-[12px] text-slate-500 min-w-[200px]">
            {mode === 'request' && (blocked || <>Gửi ⇒ <b>{closeTargetLabel(closeEntryState(role))}</b>{role !== 'AM' && ' (bỏ qua bước GĐ khối)'}. Luồng: GĐ khối → Kế toán → BOD; BOD duyệt ⇒ dự án Đóng.</>)}
            {mode === 'decide' && c && (
              <>
                Duyệt ⇒ <b>{closeApproveTo(c.state) === 'Đã duyệt' ? 'Dự án Đóng, mã KD / SX / outsource Closed + gửi Jira pending' : closeTargetLabel(closeApproveTo(c.state))}</b> · Từ chối ⇒ trả về {c.requestedBy}.
              </>
            )}
            {mode === 'view' && c && (
              <>
                Trạng thái: <Tag cls={c.state === 'Từ chối' ? 'bg-rose-50 text-rose-700 border-rose-300' : c.state === 'Đã duyệt' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'}>{closeStateLabel(c)}</Tag>
              </>
            )}
          </span>
          <Btn onClick={onClose}>Đóng</Btn>
          {mode === 'request' && (
            <Btn variant="primary" icon={Flag} disabled={!!blocked} title={blocked || undefined} onClick={submit} data-testid="close-submit">
              Gửi yêu cầu đóng dự án
            </Btn>
          )}
          {mode === 'decide' && (
            <>
              <Btn variant="danger" icon={XCircle} onClick={() => (note.trim() ? onDecide?.(false, note.trim()) : setNeedNote(true))} data-testid="close-reject">
                Từ chối
              </Btn>
              <Btn variant="primary" icon={CheckCircle2} onClick={approve} data-testid="close-approve">
                {closeApproveTo(c!.state) === 'Đã duyệt' ? 'Duyệt & đóng dự án' : 'Duyệt'}
              </Btn>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/** Đánh giá của người yêu cầu (chỉ xem) — hiện cho người duyệt và khi xem lại. */
const ReviewView: React.FC<{ review: CloseReview; by: string }> = ({ review, by }) => (
  <div>
    <p className="text-[12px] font-bold text-[#1e3a5f] uppercase tracking-wide mb-1.5">
      Đánh giá dự án <span className="normal-case font-normal text-slate-500 tracking-normal">— {by}</span>
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 border-l border-t border-slate-200 rounded-[3px] overflow-hidden">
      {CLOSE_REVIEW_FIELDS.map((f) => (
        <div key={f.key} className="border-r border-b border-slate-200">
          <p className="px-3 py-1 bg-[#f3f6fa] text-[12px] font-semibold text-slate-600">{f.label}</p>
          <p className="px-3 py-1.5 text-[12.5px] text-slate-800 whitespace-pre-line min-h-[44px]">{review[f.key]}</p>
        </div>
      ))}
    </div>
  </div>
);

type ExtraEdit = { draft: Record<CloseExtraKey, string>; err: CloseExtraKey[]; onChange: (k: CloseExtraKey, v: string) => void };
const CompareTable: React.FC<{ lines: CloseLine[]; time: ReturnType<typeof closeSummary>['time']; cashSpeed: CashSpeed; edit?: ExtraEdit }> = ({ lines, time, cashSpeed, edit }) => {
  const th = `${erp.th} border-t-0`;
  const group = (label: string) => (
    <tr>
      <td colSpan={5} className={`${erp.td} border-x-0 bg-[#f4f7fb] font-bold text-[#1e3a5f] text-[12px] uppercase tracking-wide`}>
        {label}
      </td>
    </tr>
  );
  const row = (l: CloseLine) => {
    const tone = lineTone(l);
    const d = l.plan === null ? null : l.actual - l.plan;
    const neg = (n: number) => (n < 0 ? 'text-rose-600' : '');
    return (
      <tr key={l.key} className={`${erp.tr} ${l.key === 'profit' || l.key === 'pbt' || l.key === 'net' ? 'bg-[#fffbea]' : ''}`}>
        <td className={`${erp.td} border-l-0 ${l.level ? 'pl-7 text-slate-600' : ''} ${l.bold ? 'font-bold text-slate-900' : ''}`}>
          {l.label}
          {l.extra && (
            <span className="ml-1.5 text-[10.5px] px-1 py-px rounded-[2px] border border-amber-300 bg-amber-50 text-amber-700 align-middle">
              {l.pendingExtra && !edit ? 'Chờ Kế toán nhập' : `Kế toán nhập${edit ? ' *' : ''}`}
            </span>
          )}
        </td>
        <td className={`${erp.td} ${erp.num} ${l.bold ? 'font-semibold' : ''} ${l.plan !== null && !l.pct ? neg(l.plan) : ''}`}>{l.plan === null ? <span className="text-slate-300">—</span> : l.pct ? pct1(l.plan) : money(l.plan)}</td>
        {l.extra && edit ? (
          <td className={`${erp.td} p-1`}>
            <input
              value={edit.draft[l.extra]}
              onChange={(e) => edit.onChange(l.extra!, e.target.value)}
              onBlur={(e) => {
                const v = parseAmount(e.target.value);
                if (e.target.value.trim() && v !== null) edit.onChange(l.extra!, money(v));
              }}
              inputMode="numeric"
              placeholder="Nhập số tiền"
              className={`${erp.inputFull} !h-7 text-right tabular-nums ${edit.err.includes(l.extra) ? 'border-rose-500 bg-rose-50/50' : 'border-amber-400 bg-amber-50/40'}`}
              title="Gõ số, vd 12500000 · 12,500,000 · 12.5tr · 1.2 tỷ"
              data-testid={`extra-${l.extra}`}
            />
          </td>
        ) : (
          <td className={`${erp.td} ${erp.num} ${l.bold ? 'font-bold' : ''} ${!l.pct ? neg(l.actual) : ''}`}>{l.pct ? pct1(l.actual) : money(l.actual)}</td>
        )}
        <td className={`${erp.td} ${erp.num} font-semibold ${TONE_TXT[tone]}`}>{d === null ? '—' : l.pct ? `${d > 0 ? '+' : d < 0 ? '−' : ''}${Math.abs(d * 100).toFixed(1)}%` : signed(d)}</td>
        <td className={`${erp.td} ${erp.num} border-r-0 ${TONE_TXT[tone]}`}>{l.pct || l.noRatio || !l.plan ? '—' : pct1(l.actual / l.plan)}</td>
      </tr>
    );
  };
  return (
    <div className="overflow-x-auto">
      <table className={erp.table} data-testid="close-compare">
        <thead>
          <tr>
            <th className={`${th} border-l-0 text-left w-[38%]`}>Chỉ tiêu</th>
            <th className={`${th} text-right`}>Kế hoạch</th>
            <th className={`${th} text-right`}>Thực tế</th>
            <th className={`${th} text-right`}>Chênh lệch (TT − KH)</th>
            <th className={`${th} border-r-0 text-right`}>% TT / KH</th>
          </tr>
        </thead>
        <tbody>
          {group('A. Kết quả kinh doanh (lãi / lỗ)')}
          {lines.filter((l) => l.group === 'pl').map(row)}
          {group('B. Dòng tiền')}
          {lines.filter((l) => l.group === 'cash').map(row)}
          <tr className={erp.tr} data-testid="cash-speed-row">
            <td className={`${erp.td} border-l-0 font-semibold`} title={CASH_SPEED_RULE}>
              Tốc độ dòng tiền về <span className="text-slate-400 text-[11px] font-normal">(TB % thu luỹ kế TT ÷ KH {cashSpeed.months} tháng)</span>
            </td>
            <td className={`${erp.td} ${erp.num}`}>100.0%</td>
            <td className={`${erp.td} ${erp.num} font-bold ${speedTxt(cashSpeed)}`}>{pct1(cashSpeed.avg)}</td>
            <td className={`${erp.td} ${erp.num} font-semibold ${speedTxt(cashSpeed)}`}>{cashSpeed.avg === null ? '—' : `${cashSpeed.avg >= 1 ? '+' : '−'}${Math.abs((cashSpeed.avg - 1) * 100).toFixed(1)}%`}</td>
            <td className={`${erp.td} border-r-0 text-right`}>
              <SpeedTag ratio={cashSpeed.avg} />
            </td>
          </tr>
          {group('C. Thời gian hoàn thành')}
          <tr className={erp.tr}>
            <td className={`${erp.td} border-l-0`}>Ngày bắt đầu</td>
            <td className={`${erp.td} ${erp.num}`}>{dmy(time.planStart)}</td>
            <td className={`${erp.td} ${erp.num}`}>{dmy(time.planStart)}</td>
            <td className={`${erp.td} ${erp.num}`}>—</td>
            <td className={`${erp.td} border-r-0`} />
          </tr>
          <tr className={erp.tr}>
            <td className={`${erp.td} border-l-0`}>Ngày kết thúc {time.actualEnd && <span className="text-slate-400 text-[11px]">(TT = ngày đóng{time.actualEnd === new Date().toISOString().slice(0, 10) ? ' — tính đến hôm nay' : ''})</span>}</td>
            <td className={`${erp.td} ${erp.num}`}>{dmy(time.planEnd)}</td>
            <td className={`${erp.td} ${erp.num} font-semibold`}>{dmy(time.actualEnd)}</td>
            <td className={`${erp.td} ${erp.num} font-semibold ${time.lateDays > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>{time.lateDays ? `${time.lateDays > 0 ? '+' : '−'}${Math.abs(time.lateDays)} ngày` : '0'}</td>
            <td className={`${erp.td} border-r-0 text-right font-semibold ${time.lateDays > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              <span className="inline-flex items-center gap-1">
                <CalendarClock size={13} /> {timeText(time)}
              </span>
            </td>
          </tr>
          <tr className={erp.tr}>
            <td className={`${erp.td} border-l-0`}>Số ngày thực hiện</td>
            <td className={`${erp.td} ${erp.num}`}>{time.planDays.toLocaleString('en-US')}</td>
            <td className={`${erp.td} ${erp.num}`}>{time.actualDays.toLocaleString('en-US')}</td>
            <td className={`${erp.td} ${erp.num} ${time.actualDays > time.planDays ? 'text-rose-600' : 'text-emerald-700'}`}>{signed(time.actualDays - time.planDays)}</td>
            <td className={`${erp.td} ${erp.num} border-r-0`}>{time.planDays ? pct1(time.actualDays / time.planDays) : '—'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const MonthTable: React.FC<{ s: ReturnType<typeof closeSummary> }> = ({ s }) => {
  const th = `${erp.th} border-t-0 text-right`;
  const tot = (k: 'planRevenue' | 'actualRevenue' | 'planCost' | 'actualCost' | 'planCash' | 'actualCash' | 'net') => s.months.reduce((a, m) => a + m[k], 0);
  const neg = (n: number) => (n < 0 ? 'text-rose-600' : '');
  return (
    <div className="overflow-auto max-h-[360px]">
      <table className={erp.table}>
        <thead className="sticky top-0 z-[1]">
          <tr>
            <th rowSpan={2} className={`${erp.th} border-t-0 border-l-0 text-left`}>Tháng</th>
            <th colSpan={2} className={`${erp.th} border-t-0`}>Doanh thu</th>
            <th colSpan={2} className={`${erp.th} border-t-0`}>Chi phí</th>
            <th colSpan={2} className={`${erp.th} border-t-0`}>Tiền thu</th>
            <th colSpan={2} className={`${erp.th} border-t-0 border-r-0`}>Dòng tiền thuần thực tế</th>
          </tr>
          <tr>
            {['Kế hoạch', 'Thực tế', 'Kế hoạch', 'Thực tế', 'Kế hoạch', 'Thực tế', 'Trong tháng', 'Luỹ kế'].map((h, i) => (
              <th key={i} className={`${th} ${i === 7 ? 'border-r-0' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {s.months.map((m) => {
            const has = m.month <= s.lastActualMonth;
            return (
              <tr key={m.month} className={erp.tr}>
                <td className={`${erp.td} border-l-0 tabular-nums`}>{mmyy(m.month)}</td>
                <td className={`${erp.td} ${erp.num} text-slate-500`}>{money(m.planRevenue)}</td>
                <td className={`${erp.td} ${erp.num}`}>{has ? money(m.actualRevenue) : '—'}</td>
                <td className={`${erp.td} ${erp.num} text-slate-500`}>{money(m.planCost)}</td>
                <td className={`${erp.td} ${erp.num}`}>{has ? money(m.actualCost) : '—'}</td>
                <td className={`${erp.td} ${erp.num} text-slate-500`}>{money(m.planCash)}</td>
                <td className={`${erp.td} ${erp.num}`}>{has ? money(m.actualCash) : '—'}</td>
                <td className={`${erp.td} ${erp.num} ${neg(m.net)}`}>{has ? signed(m.net) : '—'}</td>
                <td className={`${erp.td} ${erp.num} border-r-0 font-semibold ${neg(m.cumNet)}`}>{has ? signed(m.cumNet) : '—'}</td>
              </tr>
            );
          })}
          {!s.months.length && (
            <tr>
              <td colSpan={9} className={`${erp.td} border-x-0 py-6 text-center text-slate-400`}>
                Chưa có số liệu theo tháng.
              </td>
            </tr>
          )}
        </tbody>
        {s.months.length > 0 && (
          <tfoot>
            <tr className={erp.totalRow}>
              <td className={`${erp.td} border-l-0`}>Tổng cộng</td>
              <td className={`${erp.td} ${erp.num}`}>{money(tot('planRevenue'))}</td>
              <td className={`${erp.td} ${erp.num}`}>{money(tot('actualRevenue'))}</td>
              <td className={`${erp.td} ${erp.num}`}>{money(tot('planCost'))}</td>
              <td className={`${erp.td} ${erp.num}`}>{money(tot('actualCost'))}</td>
              <td className={`${erp.td} ${erp.num}`}>{money(tot('planCash'))}</td>
              <td className={`${erp.td} ${erp.num}`}>{money(tot('actualCash'))}</td>
              <td className={`${erp.td} ${erp.num} ${neg(tot('net'))}`}>{signed(tot('net'))}</td>
              <td className={`${erp.td} ${erp.num} border-r-0 ${neg(tot('net'))}`}>{signed(tot('net'))}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

/** Tab Tốc độ dòng tiền về: tiền thu luỹ kế TT so với KH từng tháng → TB cộng các tháng ⇒ Nhanh / Chậm. */
const SpeedTable: React.FC<{ s: ReturnType<typeof closeSummary> }> = ({ s }) => {
  const th = `${erp.th} border-t-0 text-right`;
  const rows = s.months.filter((m) => m.month <= s.lastActualMonth);
  const tone = (r: number | null) => (r === null ? 'text-slate-400' : r >= 1 ? 'text-emerald-700' : 'text-rose-600');
  return (
    <div>
      <div className="overflow-auto max-h-[360px]">
        <table className={erp.table} data-testid="cash-speed-table">
          <thead className="sticky top-0 z-[1]">
            <tr>
              <th rowSpan={2} className={`${erp.th} border-t-0 border-l-0 text-left`}>Tháng</th>
              <th colSpan={2} className={`${erp.th} border-t-0`}>Tiền thu trong tháng</th>
              <th colSpan={2} className={`${erp.th} border-t-0`}>Tiền thu luỹ kế</th>
              <th rowSpan={2} className={th}>% luỹ kế TT ÷ KH</th>
              <th rowSpan={2} className={`${erp.th} border-t-0 border-r-0 text-center`}>Đánh giá tháng</th>
            </tr>
            <tr>
              {['Kế hoạch', 'Thực tế', 'Kế hoạch', 'Thực tế'].map((h, i) => (
                <th key={i} className={th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.month} className={erp.tr}>
                <td className={`${erp.td} border-l-0 tabular-nums`}>{mmyy(m.month)}</td>
                <td className={`${erp.td} ${erp.num} text-slate-500`}>{money(m.planCash)}</td>
                <td className={`${erp.td} ${erp.num}`}>{money(m.actualCash)}</td>
                <td className={`${erp.td} ${erp.num} text-slate-500`}>{money(m.cumPlanCash)}</td>
                <td className={`${erp.td} ${erp.num} font-semibold`}>{money(m.cumActualCash)}</td>
                <td className={`${erp.td} ${erp.num} font-semibold ${tone(m.cashRatio)}`}>{m.cashRatio === null ? 'Không tính' : pct1(m.cashRatio)}</td>
                <td className={`${erp.td} border-r-0 text-center`}>
                  <SpeedTag ratio={m.cashRatio} />
                </td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={7} className={`${erp.td} border-x-0 py-6 text-center text-slate-400`}>
                  Chưa có số tiền thu thực tế.
                </td>
              </tr>
            )}
          </tbody>
          {rows.length > 0 && (
            <tfoot>
              <tr className={erp.totalRow}>
                <td colSpan={5} className={`${erp.td} border-l-0 text-right`}>
                  Trung bình cộng {s.cashSpeed.months} tháng ({s.cashSpeed.fast} tháng nhanh · {s.cashSpeed.slow} tháng chậm)
                </td>
                <td className={`${erp.td} ${erp.num} ${speedTxt(s.cashSpeed)}`} data-testid="cash-speed-avg">
                  {pct1(s.cashSpeed.avg)}
                </td>
                <td className={`${erp.td} border-r-0 text-center`}>
                  <SpeedTag ratio={s.cashSpeed.avg} />
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      <p className="px-3 py-1.5 border-t border-slate-200 text-[11.5px] text-slate-600 bg-[#f6faf6]">
        <b>Cách đánh giá:</b> {CASH_SPEED_RULE} Tiền về sớm hơn kế hoạch ⇒ luỹ kế thực tế vượt kế hoạch ⇒ % ≥ 100%.
      </p>
    </div>
  );
};

/** Chế độ mở hộp thoại theo vai trò + trạng thái dự án. */
export const closeModeOf = (p: BizProject, role: BizRole): CloseMode | null => {
  const step = closePendingStep(p.closeRequest);
  if (p.status === 'Đang thực hiện' && step) return step === role ? 'decide' : 'view';
  if (p.status === 'Đang thực hiện') return role === 'AM' || role === 'SM' || role === 'GĐK' ? 'request' : 'view';
  if (p.status === 'Kết thúc' || p.status === 'Bảo hành') return 'view';
  return null;
};
