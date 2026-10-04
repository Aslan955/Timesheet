/**
 * PayrollListPage — "Payroll" (HR), bản đơn giản.
 *
 * Danh sách kỳ lương → chi tiết kỳ:
 *   • Import Excel → sinh phiên bản mới (v2, v3…), chọn xem lại phiên bản cũ.
 *   • Gửi duyệt → email tới giám đốc các khối chưa gửi (mô phỏng).
 *   • Bảng trạng thái duyệt 7 khối + bảng lương chi tiết. Đủ 7 khối duyệt → Khoá kỳ lương.
 */
import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarPlus, Check, FileUp, Lock, Search, Send, Table2, Users } from 'lucide-react';
import { BlockStatus, KHOIS, KHOI_DIRECTOR, Khoi, PayPeriod, PeriodStatus, latestVersion, periodLabel, periodStatus, rowsOf, sumRows, usePayroll } from '../payroll/PayrollContext';
import { PayrollImportModal } from './PayrollImportModal';
import { Btn, ErpPage, ErpTitleBar, Panel, Tag, erp } from './erp/Erp';

const HR = 'HR - Lý Trịnh Hương';
const money = (n: number) => Math.round(n || 0).toLocaleString('en-US');
const dmy = (iso?: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

export const BLOCK_TAG: Record<BlockStatus, string> = {
  'Chưa gửi': 'bg-slate-100 text-slate-600 border-slate-300',
  'Chờ duyệt': 'bg-amber-50 text-amber-700 border-amber-300',
  'Đã duyệt': 'bg-emerald-50 text-emerald-700 border-emerald-300',
  'Từ chối': 'bg-rose-50 text-rose-700 border-rose-300',
};
const PERIOD_TAG: Record<PeriodStatus, string> = {
  'Chưa có bảng lương': 'bg-slate-100 text-slate-500 border-slate-300',
  Nháp: 'bg-slate-100 text-slate-700 border-slate-300',
  'Đang duyệt': 'bg-amber-50 text-amber-700 border-amber-300',
  'Có khối từ chối': 'bg-rose-50 text-rose-700 border-rose-300',
  'Đã duyệt': 'bg-emerald-50 text-emerald-700 border-emerald-300',
  'Đã khoá': 'bg-blue-50 text-[#1f5fa8] border-blue-300',
};

export const PayrollListPage: React.FC<{ onNavigate?: (item: string) => void }> = () => {
  const { periods, createPeriod } = usePayroll();
  const [openId, setOpenId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3200);
  };
  const p = periods.find((x) => x.id === openId);
  const sorted = [...periods].sort((a, b) => b.year - a.year || b.month - a.month);
  const newPeriod = () => {
    const last = sorted[0];
    const y = last.month === 12 ? last.year + 1 : last.year;
    const m = last.month === 12 ? 1 : last.month + 1;
    setOpenId(createPeriod(y, m));
    flash(`Đã tạo kỳ lương ${String(m).padStart(2, '0')}/${y}`);
  };

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
      {p ? (
        <PeriodDetail period={p} onBack={() => setOpenId(null)} flash={flash} />
      ) : (
        <>
          <ErpTitleBar
            crumbs={['PayRoll', 'Payroll']}
            title="Bảng lương"
            actions={
              <Btn variant="primary" icon={CalendarPlus} onClick={newPeriod}>
                Tạo kỳ lương
              </Btn>
            }
          />
          <Panel title="Danh sách kỳ lương" icon={Table2} noPad footer="Bấm vào 1 dòng để xem chi tiết">
            <div className="overflow-x-auto">
              <table className={erp.table}>
                <thead>
                  <tr>
                    {['Kỳ lương', 'Phiên bản', 'Số NS', 'Tổng chi phí (VNĐ)', ...KHOIS, 'Trạng thái'].map((h) => (
                      <th key={h} className={`${erp.th} text-center border-t-0 first:border-l-0 last:border-r-0`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((x) => {
                    const v = latestVersion(x);
                    const t = sumRows(rowsOf(v));
                    const st = periodStatus(x);
                    return (
                      <tr key={x.id} className={`${erp.tr} cursor-pointer`} onClick={() => setOpenId(x.id)}>
                        <td className={`${erp.td} font-semibold border-l-0`}>{periodLabel(x)}</td>
                        <td className={`${erp.td} text-center`}>{v ? `v${v.no}` : '—'}</td>
                        <td className={`${erp.td} ${erp.num}`}>{v ? t.count : '—'}</td>
                        <td className={`${erp.td} ${erp.num}`}>{v ? money(t.cost) : '—'}</td>
                        {KHOIS.map((k) => (
                          <td key={k} className={`${erp.td} text-center`}>
                            {v ? <Tag cls={BLOCK_TAG[x.blocks[k].status]}>{x.blocks[k].status}</Tag> : <span className="text-slate-300">—</span>}
                          </td>
                        ))}
                        <td className={`${erp.td} text-center border-r-0`}>
                          <Tag cls={PERIOD_TAG[st]}>{st}</Tag>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      )}
    </ErpPage>
  );
};

// ==========================================================================
// Chi tiết kỳ lương (HR)
// ==========================================================================
const PeriodDetail: React.FC<{ period: PayPeriod; onBack: () => void; flash: (m: string) => void }> = ({ period: p, onBack, flash }) => {
  const { sendForApproval, lockPeriod } = usePayroll();
  const latest = latestVersion(p);
  const [viewNo, setViewNo] = useState<number | null>(null);
  const v = p.versions.find((x) => x.no === viewNo) || latest;
  const [khoi, setKhoi] = useState<Khoi | ''>('');
  const [q, setQ] = useState('');
  const [importing, setImporting] = useState(false);
  const st = periodStatus(p);
  const toSend = KHOIS.filter((k) => p.blocks[k].status === 'Chưa gửi');

  const rows = useMemo(() => {
    const n = q.trim().toLowerCase();
    return rowsOf(v).filter((r) => (!khoi || r.khoi === khoi) && (!n || `${r.code} ${r.name} ${r.title} ${r.department}`.toLowerCase().includes(n)));
  }, [v, khoi, q]);
  const rt = sumRows(rows);
  const all = sumRows(rowsOf(latest));

  const send = () => {
    const list = sendForApproval(p.id, HR);
    flash(`Đã gửi email duyệt tới ${list.length} giám đốc khối: ${list.map((m) => m.khoi).join(', ')}`);
  };

  return (
    <>
      <ErpTitleBar
        onBack={onBack}
        actions={
          <>
            {p.versions.length > 1 && (
              <select value={v?.no} onChange={(e) => setViewNo(Number(e.target.value))} className={`${erp.input} w-40`} title="Chọn phiên bản để xem">
                {[...p.versions].reverse().map((x) => (
                  <option key={x.no} value={x.no}>
                    Phiên bản v{x.no}
                    {x.no === latest?.no ? ' (đang dùng)' : ''}
                  </option>
                ))}
              </select>
            )}
            {!p.locked && (
              <Btn icon={FileUp} onClick={() => setImporting(true)}>
                Import Excel
              </Btn>
            )}
            {!p.locked && latest && (
              <Btn variant="primary" icon={Send} onClick={send} disabled={!toSend.length} title={toSend.length ? `Gửi email tới giám đốc ${toSend.join(', ')}` : 'Không có khối nào cần gửi'}>
                Gửi duyệt{toSend.length ? ` (${toSend.length} khối)` : ''}
              </Btn>
            )}
            {!p.locked && st === 'Đã duyệt' && (
              <Btn
                variant="primary"
                icon={Lock}
                onClick={() => {
                  lockPeriod(p.id, HR);
                  flash(`Đã khoá kỳ lương ${periodLabel(p)}`);
                }}
              >
                Khoá kỳ lương
              </Btn>
            )}
          </>
        }
        meta={[
          { label: 'Kỳ lương', value: periodLabel(p) },
          { label: 'Phiên bản', value: v ? `v${v.no}${v.no === latest?.no ? ' (đang dùng)' : ' (bản cũ)'}` : 'Chưa có' },
          { label: 'Số NS', value: latest ? all.count : '—' },
          { label: 'Tổng chi phí', value: latest ? `${money(all.cost)} VNĐ` : '—' },
          { label: 'Trạng thái', value: <Tag cls={PERIOD_TAG[st]}>{st}</Tag> },
        ]}
      />

      {!latest ? (
        <Panel title="Bảng lương" icon={Table2}>
          <p className="py-8 text-center text-[13px] text-slate-500">
            Kỳ lương chưa có bảng lương. Bấm <b>Import Excel</b> để tạo phiên bản v1.
          </p>
        </Panel>
      ) : (
        <>
          <Panel title="Trạng thái duyệt theo khối" icon={Users} noPad>
            <table className={erp.table}>
              <thead>
                <tr>
                  {['Khối', 'Giám đốc khối', 'Số NS', 'Chi phí (VNĐ)', 'Trạng thái', 'Ghi chú'].map((h) => (
                    <th key={h} className={`${erp.th} text-left border-t-0 first:border-l-0 last:border-r-0`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KHOIS.map((k) => {
                  const b = p.blocks[k];
                  const t = sumRows(rowsOf(latest, k));
                  return (
                    <tr key={k} className={erp.tr}>
                      <td className={`${erp.td} font-semibold border-l-0`}>{k}</td>
                      <td className={erp.td}>{KHOI_DIRECTOR[k].name}</td>
                      <td className={`${erp.td} ${erp.num}`}>{t.count}</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(t.cost)}</td>
                      <td className={erp.td}>
                        <Tag cls={BLOCK_TAG[b.status]}>{b.status}</Tag>
                      </td>
                      <td className={`${erp.td} text-slate-600 border-r-0`}>
                        {b.status === 'Từ chối' ? (
                          <span className="text-rose-700">{b.reason}</span>
                        ) : b.status === 'Đã duyệt' ? (
                          `${b.decidedBy || ''} · ${dmy(b.decidedAt)}`
                        ) : b.status === 'Chờ duyệt' ? (
                          `Gửi ${dmy(b.sentAt)} · hạn ${dmy(b.deadline)}`
                        ) : (
                          b.note || 'Chưa gửi'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Panel>

          <Panel
            title="Bảng lương chi tiết"
            icon={Table2}
            noPad
            actions={
              <>
                <select value={khoi} onChange={(e) => setKhoi(e.target.value as Khoi | '')} className={`${erp.input} h-7 w-32`}>
                  <option value="">Tất cả khối</option>
                  {KHOIS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <div className="relative w-56">
                  <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã, tên…" className={`${erp.inputFull} h-7 pl-7`} />
                </div>
              </>
            }
            footer={`${rows.length} nhân sự · ĐVT: VNĐ`}
          >
            <div className="overflow-x-auto max-h-[520px]">
              <table className={erp.table}>
                <thead className="sticky top-0 z-10">
                  <tr>
                    {['STT', 'Mã NV', 'Họ tên', 'Chức danh', 'Khối', 'Phòng ban', 'Tổng thu nhập', 'Thực nhận', 'Chi phí công ty'].map((h, i) => (
                      <th key={h} className={`${erp.th} ${i > 5 ? 'text-right' : 'text-left'} border-t-0 first:border-l-0 last:border-r-0 whitespace-nowrap`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.code} className={erp.tr}>
                      <td className={`${erp.td} text-center text-slate-500 border-l-0`}>{i + 1}</td>
                      <td className={`${erp.td} ${erp.code}`}>{r.code}</td>
                      <td className={`${erp.td} whitespace-nowrap`}>{r.name}</td>
                      <td className={erp.td}>{r.title}</td>
                      <td className={`${erp.td} text-center`}>{r.khoi}</td>
                      <td className={erp.td}>{r.department}</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(r.gross)}</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(r.net)}</td>
                      <td className={`${erp.td} ${erp.num} border-r-0`}>{money(r.cost)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={erp.totalRow}>
                    <td className={`${erp.td} border-l-0`} colSpan={6}>
                      Tổng cộng
                    </td>
                    <td className={`${erp.td} ${erp.num}`}>{money(rt.gross)}</td>
                    <td className={`${erp.td} ${erp.num}`}>{money(rt.net)}</td>
                    <td className={`${erp.td} ${erp.num} border-r-0`}>{money(rt.cost)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Panel>
        </>
      )}

      <AnimatePresence>
        {importing && (
          <PayrollImportModal
            key="imp"
            period={p}
            by={HR}
            onClose={() => setImporting(false)}
            onDone={(m) => {
              setImporting(false);
              setViewNo(null);
              flash(m);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
