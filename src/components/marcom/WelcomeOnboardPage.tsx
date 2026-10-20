/**
 * MarCom · Welcome Onboard (yêu cầu 2.1 + trạng thái mail 2.3).
 *  - Đợt Welcome = thứ 3 hằng tuần. Đợt thứ 3 ngày T gồm nhân sự có ngày onboard thực tế từ thứ 4 tuần trước → hết thứ 3 (T).
 *    VD: onboard thứ 3 → đợt tuần này; onboard thứ 4 → tự chuyển sang đợt thứ 3 tuần sau.
 *  - Màn chỉ ĐỌC dữ liệu từ Employee (ngày onboard, trạng thái) để xếp đợt — không sửa ở đây.
 *  - Xếp đợt theo NGÀY ONBOARD: hoãn = HCNS đổi sang ngày mới trên Employee → tự xếp lại đợt.
 *  - Cancel Onboard: trạng thái Employee chuyển 'Cancel Onboard' → không vào đợt Welcome nào, không gửi mail Welcome;
 *    vẫn liệt kê riêng ở khung "Cancel Onboard" của đợt dự kiến để MarCom biết. Mọi thay đổi ghi vào nhật ký.
 *  - Hạn chốt gửi MarCom (đề xuất): 17:00 thứ 2 trước đợt; sau hạn vẫn cập nhật, thay đổi được đánh dấu.
 *  - Mail Welcome gửi đúng NGÀY ONBOARD lúc 10:00 (độc lập với đợt Welcome).
 * Giao diện: khung ERP (src/components/erp/Erp.tsx) như màn Báo cáo hiệu quả dự án.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { UserX, AlertTriangle, ArrowRight, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Download, FileSpreadsheet, History, RefreshCw, Table2, UserMinus } from 'lucide-react';
import { useMarcom } from '../../marcom/MarcomContext';
import { Avatar, FilterBar, FilterCell, TAG, iconBtn, useToast } from '../../marcom/MarcomUi';
import { Btn, ErpPage, ErpTitleBar, KpiBox, Panel, Tag, erp } from '../erp/Erp';
import {
  BatchPhase, DIVISIONS, MarcomEmployee, addDays, batchDeadline, batchPhase, batchTuesdayOf, batchWindow, downloadPhoto,
  fmtDate, fmtDateTime, fmtDayMonth, fmtTime, fromKey, inWelcomeBatch, isCancelOnboard, isPastTimeToday, startOfDay, toKey, WEEKDAY_LONG, WEEKDAY_SHORT,
} from '../../marcom/marcomData';

const PHASE: Record<BatchPhase, { text: string; cls: string }> = {
  upcoming: { text: 'Chưa tới kỳ', cls: TAG.slate },
  collecting: { text: 'Đang cập nhật', cls: TAG.blue },
  locked: { text: 'Đã chốt gửi MarCom', cls: TAG.amber },
  done: { text: 'Đã Welcome', cls: TAG.green },
};

export const WelcomeOnboardPage: React.FC = () => {
  const { employees, logs, config, changes, refresh } = useMarcom();
  const { toast, toastNode } = useToast();
  const now = new Date();
  const today = startOfDay(now);
  const currentTue = batchTuesdayOf(today);
  const [tue, setTue] = useState(currentTue);
  const [division, setDivision] = useState('all');

  const goto = (t: Date) => {
    setTue(t);
  };

  const { from, to } = batchWindow(tue);
  const deadline = batchDeadline(tue);
  const nextTue = addDays(tue, 7);

  const newHires = useMemo(() => employees.filter((e) => e.isNewHire), [employees]);
  const batchOf = (e: MarcomEmployee) => batchTuesdayOf(e.onboardDate).getTime();

  const batchAll = useMemo(
    () => newHires.filter((e) => inWelcomeBatch(e) && batchOf(e) === tue.getTime()).sort((a, b) => a.onboardDate.localeCompare(b.onboardDate) || a.name.localeCompare(b.name, 'vi')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newHires, tue],
  );
  const rows = batchAll
    .filter((e) => division === 'all' || e.division === division);
  const nextBatch = newHires.filter((e) => inWelcomeBatch(e) && batchOf(e) === nextTue.getTime());
  /** Cancel Onboard có ngày onboard dự kiến rơi vào kỳ của đợt đang xem — không tính vào đợt. */
  const cancelled = newHires.filter((e) => isCancelOnboard(e) && batchOf(e) === tue.getTime());
  const lockedChanges = changes.filter((c) => {
    const touches = batchTuesdayOf(c.from).getTime() === tue.getTime() || batchTuesdayOf(c.to).getTime() === tue.getTime();
    return touches && new Date(c.at) >= deadline;
  });

  const countOfBatch = (t: Date) => newHires.filter((e) => inWelcomeBatch(e) && batchOf(e) === t.getTime()).length;

  const mailStatus = (e: MarcomEmployee) => {
    const d = fromKey(e.onboardDate);
    const log = logs.find((l) => l.kind === 'welcome' && l.employeeId === e.id && l.status !== 'test');
    if (log?.status === 'sent') return <Tag cls={TAG.green}>Đã gửi {fmtDayMonth(d)} {fmtTime(log.sentAt)}</Tag>;
    if (log?.status === 'failed') return <Tag cls={TAG.rose}>Gửi lỗi</Tag>;
    const isToday = d.getTime() === today.getTime();
    if (d < today || (isToday && isPastTimeToday(config.welcome.sendTime))) return <Tag cls={TAG.green}>Đã gửi</Tag>;
    if (!config.welcome.enabled) return <Tag cls={TAG.slate}>Tắt tự động</Tag>;
    return <Tag cls={isToday ? TAG.amber : TAG.blue}>{isToday ? `Chờ gửi ${config.welcome.sendTime}` : `Lên lịch ${fmtDayMonth(d)} ${config.welcome.sendTime}`}</Tag>;
  };

  const exportExcel = () => {
    const data = batchAll.map((e, i) => ({
      STT: i + 1,
      'Họ và tên': e.name,
      'Mã NV': e.code,
      'Vị trí': e.position,
      'Division (Khối)': e.division,
      'Ngày onboard': fmtDate(e.onboardDate),
      Thứ: WEEKDAY_LONG[fromKey(e.onboardDate).getDay()],
      'Email nội bộ': e.email,
      'Có ảnh': e.photoUrl ? 'Có' : 'Chưa có',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Welcome ${fmtDayMonth(tue).replace('/', '-')}`);
    XLSX.writeFile(wb, `WelcomeOnboard_${toKey(tue)}.xlsx`);
    toast(`Đã xuất ${batchAll.length} nhân sự đợt Welcome ${fmtDate(tue)}`);
  };

  return (
    <ErpPage>
      {toastNode}
      <ErpTitleBar
        crumbs={['Human Resources', 'MarCom', 'Welcome Onboard']}
        title="Welcome Onboard"
        actions={
          <>
            <Btn icon={RefreshCw} onClick={refresh} title="Dữ liệu đọc trực tiếp từ hồ sơ Employee">
              Làm mới
            </Btn>
            <Btn variant="success" icon={FileSpreadsheet} onClick={exportExcel} disabled={batchAll.length === 0}>
              Xuất Excel
            </Btn>
          </>
        }
      />

      {/* ===== Chọn đợt Welcome ===== */}
      <Panel
        title="Đợt Welcome"
        icon={CalendarDays}
      >
        <div className="flex flex-col gap-3">
          <FilterBar
            right={
              division !== 'all' && (
                <Btn
                  className="h-7"
                  onClick={() => {
                    setDivision('all');
                  }}
                >
                  Bỏ lọc
                </Btn>
              )
            }
          >
            <FilterCell label="Đợt">
              <WeekPicker value={tue} current={currentTue} onChange={goto} countOf={countOfBatch} />
            </FilterCell>
            {tue.getTime() !== currentTue.getTime() && (
              <Btn className="h-7" onClick={() => goto(currentTue)}>
                Đợt tuần này
              </Btn>
            )}
            <FilterCell label="Division (Khối)">
              <select value={division} onChange={(e) => setDivision(e.target.value)} className={`${erp.input} w-44`}>
                <option value="all">Tất cả</option>
                {DIVISIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </FilterCell>
          </FilterBar>

          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-slate-600">
            Đợt <b className="text-[#1e3a5f]">thứ 3 {fmtDate(tue)}</b> gồm nhân sự onboard từ <b>T4 {fmtDayMonth(from)}</b> đến hết <b>T3 {fmtDayMonth(to)}</b>.
            <span>
              Onboard từ T4 {fmtDayMonth(addDays(tue, 1))} trở đi chuyển sang đợt {fmtDayMonth(nextTue)} ({nextBatch.length} nhân sự)
            </span>
            <button type="button" onClick={() => goto(nextTue)} className="text-[#1f5fa8] font-semibold hover:underline cursor-pointer">
              Xem đợt sau →
            </button>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiBox label="Trong đợt" value={batchAll.length} sub={`Đợt thứ 3 ${fmtDate(tue)}`} />
        <KpiBox label="Thiếu ảnh trên Employee" value={batchAll.filter((e) => !e.photoUrl).length} tone={batchAll.some((e) => !e.photoUrl) ? 'bad' : 'good'} sub="Cần HCNS bổ sung ảnh" />
        <KpiBox label="Chuyển sang đợt sau" value={nextBatch.length} sub={`Đợt ${fmtDate(nextTue)}`} />
        <KpiBox label="Cancel Onboard" value={cancelled.length} tone={cancelled.length ? 'bad' : 'neutral'} sub="Không vào đợt Welcome nào" />
      </div>

      {lockedChanges.length > 0 && (
        <div className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-300 rounded-[4px] text-[12px] text-amber-800">
          <AlertTriangle size={14} className="shrink-0 mt-px" />
          Có <b>{lockedChanges.length}</b> thay đổi sau hạn chốt 17:00 T2 {fmtDayMonth(deadline)} — danh sách đã tự cập nhật, MarCom kiểm tra lại nội dung Welcome.
        </div>
      )}

      <Panel
        title="Danh sách Welcome"
        icon={Table2}
        noPad
        actions={<span className="text-[12px] text-slate-600">{rows.length} / {batchAll.length} nhân sự</span>}
        footer={`Ảnh lấy từ hồ sơ Employee · Mail Welcome gửi ${config.welcome.sendTime} đúng ngày onboard (độc lập với đợt) · Ngày onboard / trạng thái do HCNS cập nhật trên Employee`}
      >
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${erp.th} text-left`}>Họ và tên</th>
                <th className={`${erp.th} text-left`}>Mã NV</th>
                <th className={`${erp.th} text-left`}>Division (Khối)</th>
                <th className={`${erp.th} text-left`}>Vị trí</th>
                <th className={`${erp.th} text-center`}>Ngày onboard</th>
                <th className={`${erp.th} text-left`}>Email nội bộ</th>
                <th className={`${erp.th} text-left`}>Mail Welcome</th>
                <th className={`${erp.th} w-[60px] text-center`}>Ảnh</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className={`${erp.td} py-10 text-center text-slate-400`}>
                    Không có nhân sự phù hợp.
                  </td>
                </tr>
              )}
              {rows.map((e) => {
                const d = fromKey(e.onboardDate);
                const changed = changes.find((c) => c.employeeId === e.id);
                return (
                  <tr key={e.id} className={erp.tr}>
                    <td className={erp.td}>
                      <div className="flex items-center gap-2">
                        <Avatar e={e} size={26} />
                        <span className="font-semibold text-slate-800">{e.name}</span>
                      </div>
                    </td>
                    <td className={`${erp.td} ${erp.code}`}>{e.code}</td>
                    <td className={erp.td}>{e.division}</td>
                    <td className={erp.td}>{e.position}</td>
                    <td className={`${erp.td} text-center whitespace-nowrap`}>
                      {WEEKDAY_SHORT[d.getDay()]}, {fmtDate(d)}
                      {changed && (
                        <span className="ml-1">
                          <Tag cls={TAG.amber}>đã đổi</Tag>
                        </span>
                      )}
                    </td>
                    <td className={erp.td}>{e.email}</td>
                    <td className={erp.td}>{mailStatus(e)}</td>
                    <td className={`${erp.td} text-center whitespace-nowrap`}>
                      <button type="button" className={iconBtn} disabled={!e.photoUrl} onClick={() => downloadPhoto(e)} title={e.photoUrl ? 'Tải ảnh (từ hồ sơ Employee)' : 'Hồ sơ Employee chưa có ảnh'}>
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-start">
        <div className="space-y-3 min-w-0">
        <Panel title={`Cancel Onboard · không vào đợt Welcome`} icon={UserX} noPad footer="Trạng thái Employee = Cancel Onboard → không xếp vào đợt Welcome nào và không gửi mail Welcome">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${erp.th} text-left`}>Họ và tên</th>
                <th className={`${erp.th} text-left`}>Division (Khối)</th>
                <th className={`${erp.th} text-center`}>Ngày onboard dự kiến</th>
                <th className={`${erp.th} text-left`}>Trạng thái Employee</th>
                <th className={`${erp.th} text-left`}>Lý do</th>
              </tr>
            </thead>
            <tbody>
              {cancelled.length === 0 && (
                <tr>
                  <td colSpan={5} className={`${erp.td} py-6 text-center text-slate-400`}>
                    Không có.
                  </td>
                </tr>
              )}
              {cancelled.map((e) => (
                <tr key={e.id} className={erp.tr}>
                  <td className={erp.td}>
                    <span className="font-semibold text-slate-500 line-through decoration-slate-300">{e.name}</span>
                    <div className={`text-[11px] ${erp.code}`}>{e.code}</div>
                  </td>
                  <td className={erp.td}>{e.division}</td>
                  <td className={`${erp.td} text-center whitespace-nowrap`}>
                    {WEEKDAY_SHORT[fromKey(e.onboardDate).getDay()]}, {fmtDayMonth(e.onboardDate)}
                  </td>
                  <td className={erp.td}>
                    <Tag cls={TAG.rose}>Cancel Onboard</Tag>
                  </td>
                  <td className={`${erp.td} text-slate-600`}>{e.cancelReason ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <Panel title={`Chuyển sang đợt sau · ${fmtDate(nextTue)}`} icon={UserMinus} noPad>
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${erp.th} text-left`}>Họ và tên</th>
                <th className={`${erp.th} text-center`}>Ngày onboard</th>
                <th className={`${erp.th} text-left`}>Lý do</th>
              </tr>
            </thead>
            <tbody>
              {nextBatch.length === 0 && (
                <tr>
                  <td colSpan={3} className={`${erp.td} py-6 text-center text-slate-400`}>
                    Không có.
                  </td>
                </tr>
              )}
              {nextBatch.map((e) => (
                <tr key={e.id} className={erp.tr}>
                  <td className={`${erp.td} font-semibold`}>{e.name}</td>
                  <td className={`${erp.td} text-center`}>
                    {WEEKDAY_SHORT[fromKey(e.onboardDate).getDay()]}, {fmtDayMonth(e.onboardDate)}
                  </td>
                  <td className={erp.td}>
                    <Tag cls={TAG.violet}>Onboard sau T3 {fmtDayMonth(tue)}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        </div>

        <Panel title="Lịch sử thay đổi onboard (từ Employee)" icon={History} noPad footer="HCNS đổi ngày onboard / chuyển Cancel Onboard trên Employee → danh sách Welcome tự xếp lại đợt">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${erp.th} text-left`}>Thời gian</th>
                <th className={`${erp.th} text-left`}>Nhân sự</th>
                <th className={`${erp.th} text-left`}>Thay đổi</th>
                <th className={`${erp.th} text-left`}>Lý do</th>
              </tr>
            </thead>
            <tbody>
              {changes.length === 0 && (
                <tr>
                  <td colSpan={4} className={`${erp.td} py-6 text-center text-slate-400`}>
                    Chưa có thay đổi từ Employee.
                  </td>
                </tr>
              )}
              {changes.map((c) => {
                const fromTue = batchTuesdayOf(c.from);
                const toTue = c.to ? batchTuesdayOf(c.to) : null;
                return (
                  <tr key={c.id} className={erp.tr}>
                    <td className={`${erp.td} whitespace-nowrap`}>{fmtDateTime(c.at)}</td>
                    <td className={`${erp.td} font-semibold`}>{c.employeeName}</td>
                    <td className={erp.td}>
                      {toTue ? (
                        <>
                          {fmtDayMonth(c.from)} → {fmtDayMonth(c.to)}
                          <div className="text-[11px] text-slate-500">{fromTue.getTime() === toTue.getTime() ? `Giữ đợt ${fmtDayMonth(toTue)}` : `Chuyển đợt ${fmtDayMonth(fromTue)} → ${fmtDayMonth(toTue)}`}</div>
                        </>
                      ) : (
                        <>
                          Trạng thái → <Tag cls={TAG.rose}>Cancel Onboard</Tag>
                          <div className="text-[11px] text-slate-500">Loại khỏi đợt {fmtDayMonth(fromTue)}</div>
                        </>
                      )}
                    </td>
                    <td className={erp.td}>
                      {c.reason}
                      <div className="text-[11px] text-slate-500">{c.by}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </div>

    </ErpPage>
  );
};

// ---------------------------------------------------------------------------
// Chọn đợt: ‹ [Thứ 3, dd/MM/yyyy ▾] › — bảng xổ xuống liệt kê các đợt quanh tuần hiện tại kèm số nhân sự.
// ---------------------------------------------------------------------------
const WeekPicker: React.FC<{ value: Date; current: Date; onChange: (t: Date) => void; countOf: (t: Date) => number }> = ({ value, current, onChange, countOf }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const options = Array.from({ length: 11 }, (_, i) => addDays(current, (i - 6) * 7)); // 6 đợt trước → 4 đợt sau
  const w = batchWindow(value);

  return (
    <span ref={ref} className="relative inline-flex items-center border border-slate-300 rounded-[3px] bg-white h-7">
      <button type="button" onClick={() => onChange(addDays(value, -7))} className="w-7 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 border-r border-slate-300 cursor-pointer" title="Đợt trước">
        <ChevronLeft size={14} />
      </button>
      <button type="button" onClick={() => setOpen((v) => !v)} className="h-full px-2.5 flex items-center gap-2 text-[12px] hover:bg-slate-50 cursor-pointer">
        <span className="font-bold text-[#1e3a5f]">Thứ 3, {fmtDate(value)}</span>
        <span className="text-slate-400">
          ({fmtDayMonth(w.from)} – {fmtDayMonth(w.to)})
        </span>
        <ChevronDown size={13} className="text-slate-400" />
      </button>
      <button type="button" onClick={() => onChange(addDays(value, 7))} className="w-7 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 border-l border-slate-300 cursor-pointer" title="Đợt sau">
        <ChevronRight size={14} />
      </button>

      {open && (
        <div className="absolute z-30 top-[calc(100%+4px)] left-0 w-[340px] bg-white border border-slate-300 rounded-[4px] shadow-lg overflow-hidden">
          <div className="px-3 py-1.5 bg-[#e8edf4] border-b border-slate-300 text-[11px] font-semibold text-[#1e3a5f]">Chọn đợt Welcome</div>
          <div className="max-h-[300px] overflow-y-auto">
            {options.map((t) => {
              const win = batchWindow(t);
              const n = countOf(t);
              const isCur = t.getTime() === current.getTime();
              const isSel = t.getTime() === value.getTime();
              const ph = batchPhase(t);
              return (
                <button
                  key={t.toISOString()}
                  type="button"
                  onClick={() => {
                    onChange(t);
                    setOpen(false);
                  }}
                  className={`w-full grid grid-cols-[1fr_auto_auto] items-center gap-2 px-3 py-1.5 text-left text-[12px] border-b border-slate-100 last:border-b-0 cursor-pointer ${
                    isSel ? 'bg-[#eaf2fc]' : 'hover:bg-slate-50'
                  }`}
                >
                  <span>
                    <span className={`font-semibold ${isSel ? 'text-[#1f5fa8]' : 'text-slate-800'}`}>T3 {fmtDate(t)}</span>
                    <span className="text-slate-400">
                      {' '}
                      · {fmtDayMonth(win.from)} – {fmtDayMonth(win.to)}
                    </span>
                    {isCur && (
                      <span className="ml-1.5">
                        <Tag cls={TAG.blue}>Tuần này</Tag>
                      </span>
                    )}
                  </span>
                  <span className="tabular-nums font-semibold text-slate-700">{n} NS</span>
                  <Tag cls={PHASE[ph].cls}>{PHASE[ph].text}</Tag>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </span>
  );
};
