/**
 * PayRoll › Báo cáo Onsite (/OnsiteReport) — ĐỀ XUẤT: HCNS chốt onsite từng dòng / nhiều dòng tại đây (Phụ lục 03).
 * Chốt = gắn closingId cho đơn ⇒ số vào Payroll ngay (không có bước hoàn tất tháng). Duyệt kỳ lương cùng tháng ⇒ tháng onsite khoá.
 * Dữ liệu lấy từ kho onsite dùng chung (đơn sửa / duyệt ở Quản lý Đơn từ hiện ngay ở đây).
 */
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, BookOpen, CheckCircle2, ChevronDown, ChevronRight, CircleDashed, Download, Eye, Filter, Lock, RefreshCw, Search, Table2, Unlock } from 'lucide-react';
import {
  ClosingDay, ClosingLine, EMPLOYEES, PROJECTS, OLD_RATE, OnsiteClosing, OnsiteRec, RULE_FROM, USERS, ZONE_LABEL, ZONE_SHORT,
  canCloseOnsite, closingIdOf, closingName, computeClosing, dow, emp, evalClosing, fmtD, fmtDT, log, money, nowIso,
  proj, rateOf, recMonth, reportStatus, RoleKey, slotOf,
} from '../onsite/onsiteData';
import { useOnsite } from '../onsite/OnsiteContext';
import * as XLSX from 'xlsx';
import { Badge, ConfirmModal } from './onsite/OnsiteUi';
import { Btn, ErpPage, ErpTitleBar, KpiBox, Panel, Tag, erp } from './erp/Erp';

/** Màu nhãn theo bộ khung ERP (giống màn Báo cáo hiệu quả dự án). */
const TAG = {
  done: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  part: 'bg-[#eaf2fc] text-[#1f5fa8] border-[#bcd3ee]',
  wait: 'bg-amber-50 text-amber-700 border-amber-300',
  none: 'bg-slate-100 text-slate-500 border-slate-300',
};
/** Ô lọc: nhãn bên trái ô nhập. */
const FilterCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex items-center gap-1.5 min-w-0">
    <span className="text-[12px] text-slate-600 whitespace-nowrap">{label}</span>
    {children}
  </label>
);
/** Dải lọc một hàng, nền xám nhạt (giống màn Báo cáo hiệu quả dự án). */
const FilterBar: React.FC<{ children: React.ReactNode; right?: React.ReactNode }> = ({ children, right }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border border-slate-200 rounded-[4px] [&_input]:h-7 [&_select]:h-7 [&_input]:text-[12px] [&_select]:text-[12px]">
    <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300 whitespace-nowrap">
      <Filter size={13} className="text-[#1f5fa8]" /> Lọc
    </span>
    {children}
    {right && <span className="ml-auto flex items-center gap-2">{right}</span>}
  </div>
);

const NOW = { m: 11, y: 2026 };
const n2 = (v: number) => String(Math.round(v * 100) / 100);
const ymKey = (y: number, m: number) => `${y}-${String(m).padStart(2, '0')}`;
const ord = (c: { year: number; month: number }) => c.year * 12 + c.month;
const PENDING_HOD = ['REQUESTED', 'APPROVED_PM'];

// ───────────────────────── Logic chốt (hàm thuần — test được ngoài React) ─────────────────────────
const upsertClosing = (closings: OnsiteClosing[], c: OnsiteClosing) =>
  (closings.some((x) => x.id === c.id) ? closings.map((x) => (x.id === c.id ? c : x)) : [...closings, c]).sort((a, b) => ord(a) - ord(b));

/** Đơn của một dòng được xét ở kỳ (y, m): HOD đã duyệt và vào kỳ theo evalClosing (gồm cả đơn đã chốt vào kỳ này). */
export function rowEligible(row: { recIds: Set<string> }, records: OnsiteRec[], closings: OnsiteClosing[], y: number, m: number) {
  return [...row.recIds].map((id) => records.find((r) => r.id === id)).filter((r): r is OnsiteRec => !!r && evalClosing(r, closings, y, m).ok);
}
/** Chốt các đơn đã chọn (từng dòng / nhiều dòng): gắn closingId + ghi lịch sử; tạo kỳ chốt nếu chưa có. */
export function applyCloseRecords(records: OnsiteRec[], closings: OnsiteClosing[], ids: string[], y: number, m: number, by: string, at: string) {
  const id = closingIdOf(y, m);
  const nextRecords = records.map((r) => {
    if (!ids.includes(r.id) || r.closingId === id) return r;
    const e = evalClosing(r, closings, y, m);
    if (!e.ok) return r;
    const detail = `Chốt ở Báo cáo Onsite tháng ${closingName({ year: y, month: m })}${e.carry ? ' — bổ sung đơn tháng trước duyệt muộn' : ''}`;
    return { ...r, closingId: id, history: [...r.history, log(at, by, 'Chốt onsite', detail)] };
  });
  const nextClosings = closings.some((c) => c.id === id) ? closings : upsertClosing(closings, { id, year: y, month: m, status: 'OPEN' });
  return { records: nextRecords, closings: nextClosings, count: nextRecords.filter((r, i) => r !== records[i]).length };
}
/** Bỏ chốt các đơn đã chọn (khi kỳ lương cùng tháng chưa duyệt): gỡ closingId, đơn mở khoá ở màn Đơn từ. */
export function applyUncloseRecords(records: OnsiteRec[], ids: string[], y: number, m: number, by: string, at: string) {
  const id = closingIdOf(y, m);
  const nextRecords = records.map((r) => (!ids.includes(r.id) || r.closingId !== id ? r : {
    ...r, closingId: undefined, history: [...r.history, log(at, by, 'Bỏ chốt onsite', `Bỏ chốt khỏi kỳ ${closingName({ year: y, month: m })} — đơn quay về chờ chốt`)],
  }));
  return { records: nextRecords, count: nextRecords.filter((r, i) => r !== records[i]).length };
}
// ───────────────────────── Màn hình ─────────────────────────
export const OnsiteReportPage: React.FC = () => {
  const { records, setRecords, closings, setClosings, role, setRole } = useOnsite();
  // Giá trị trên thanh lọc — chỉ áp khi bấm Tìm kiếm / Enter (ExecuteSearch)
  const [fSearch, setFSearch] = useState('');
  const [fMonth, setFMonth] = useState(NOW.m);
  const [fYear, setFYear] = useState(NOW.y);
  const [fDept, setFDept] = useState('');
  const [fProject, setFProject] = useState('');
  const [applied, setApplied] = useState({ search: '', m: NOW.m, y: NOW.y, dept: '', project: '' });
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ text: string; onOk: () => void } | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  // Cột ghim trái: đo độ rộng thật của tiêu đề để tính vị trí left (tránh lệch / đè cột kế bên)
  const pinRefs = useRef<(HTMLTableCellElement | null)[]>([]);
  const [pinLefts, setPinLefts] = useState<number[]>([]);
  useLayoutEffect(() => {
    const ws = Array.from({ length: 7 }, (_, i) => pinRefs.current[i]?.getBoundingClientRect().width || 0);
    const ls = ws.map((_, i) => ws.slice(0, i).reduce((t, w) => t + w, 0));
    if (ls.join() !== pinLefts.join()) setPinLefts(ls);
  });
  const [, setResizeTick] = useState(0);
  useLayoutEffect(() => {
    const onResize = () => setResizeTick((t) => t + 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const [toast, setToast] = useState<{ text: string; err?: boolean } | null>(null);
  const showToast = (text: string, err = false) => { setToast({ text, err }); setTimeout(() => setToast(null), 4000); };
  const execute = () => { setApplied({ search: fSearch, m: fMonth, y: fYear, dept: fDept, project: fProject }); setOpenKey(null); setSelected([]); };
  const resetAll = () => {
    setFSearch(''); setFDept(''); setFProject(''); setFMonth(NOW.m); setFYear(NOW.y);
    setApplied({ search: '', m: NOW.m, y: NOW.y, dept: '', project: '' }); setOpenKey(null);
  };

  const { y, m } = applied;
  const ym = ymKey(y, m);
  const cid = closingIdOf(y, m);
  const name = closingName({ year: y, month: m });
  const closing = closings.find((c) => c.id === cid);
  const isClosed = closing?.status === 'APPROVED';
  const canClose = canCloseOnsite(role);
  const me = USERS[role].name;

  // Nguồn số: tháng đã khoá (kỳ lương đã duyệt) đọc số đã chốt, còn mở thì tính thử cả dòng chưa chốt
  const allLines: ClosingLine[] = useMemo(
    () => (isClosed ? closing?.saved || [] : computeClosing(records, closings, y, m)),
    [isClosed, closing, records, closings, y, m],
  );
  const q = applied.search.trim().toLowerCase();
  const empMatch = (eid: string) => {
    const e = emp(eid);
    return (!q || e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q)) && (!applied.dept || e.dept === applied.dept);
  };
  const lines = allLines.filter((l) => empMatch(l.employeeId));
  const sum = (f: (l: ClosingLine) => number) => lines.reduce((s, l) => s + f(l), 0);
  const tot = {
    lt30: sum((l) => l.unitsLT30), ge30: sum((l) => l.unitsGE30), carryU: sum((l) => l.carryUnits), carryA: sum((l) => l.carryAmount),
    noPay: sum((l) => l.noPayDays), units: sum((l) => l.units), amount: sum((l) => l.amount),
  };

  // Danh sách: nhân viên × dự án × trạng thái đơn
  const allRows = useMemo(() => buildRows(records, closings, y, m, isClosed), [records, closings, y, m, isClosed]);
  const rows = allRows.filter((x) => (empMatch(x.employeeId) || (!!q && proj(x.projectId).code.toLowerCase().includes(q)))
    && (!applied.project || x.projectId === applied.project));
  const rsum = (f: (x: ReportRow) => number) => rows.reduce((s, x) => s + f(x), 0);
  const rt = {
    lt30: rsum((x) => x.lt30), ge30: rsum((x) => x.ge30), paid: rsum((x) => x.paid), noPay: rsum((x) => x.noPay),
    carryUnits: rsum((x) => x.carryUnits), carryAmount: rsum((x) => x.carryAmount), pending: rsum((x) => x.pending), pendingRecs: rsum((x) => x.pendingRecs), rejectedRecs: rsum((x) => x.rejectedRecs), rejectedDays: rsum((x) => x.rejectedDays), amount: rsum((x) => x.amount),
  };

  /** Đơn được xét / đã chốt của từng dòng (khi tháng chưa khoá). */
  const eligOf = (x: ReportRow) => (isClosed ? [] : rowEligible(x, records, closings, y, m));
  const stampedOf = (x: ReportRow) => eligOf(x).filter((r) => r.closingId === cid);
  const canAct = canClose && !isClosed;

  /** Trạng thái chốt của HR cho một dòng (NV × dự án). */
  const hrStateOf = (x: ReportRow): { t: string; c: string; icon: React.ElementType; sub?: string } => {
    const none = { t: 'Không xét', c: TAG.none, icon: CircleDashed, sub: 'chưa có đơn được duyệt' };
    if (isClosed) {
      if (x.days.length) return { t: 'Đã chốt', c: TAG.done, icon: CheckCircle2, sub: x.pending ? `còn ${n2(x.pending)} ngày chưa ghi nhận` : undefined };
      return x.lateApproved ? { t: 'Chưa chốt', c: TAG.wait, icon: Eye, sub: 'chuyển sang kỳ sau' } : none;
    }
    const el = eligOf(x), st = stampedOf(x);
    if (!el.length) return none;
    if (st.length === el.length) return { t: 'Đã chốt', c: TAG.done, icon: CheckCircle2 };
    if (st.length) return { t: 'Chốt một phần', c: TAG.part, icon: Lock, sub: `${st.length}/${el.length} đơn` };
    return { t: 'Chưa chốt', c: TAG.wait, icon: Eye };
  };
  const hrState = (x: ReportRow) => {
    const h = hrStateOf(x);
    return <span className="inline-flex flex-col gap-0.5"><Tag cls={h.c} icon={h.icon}>{h.t}</Tag>{h.sub && <span className="text-[10.5px] text-slate-500">{h.sub}</span>}</span>;
  };

  // Đơn trong tháng chưa qua HOD / nháp — không vào kỳ chốt này
  const inMonth = records.filter((r) => recMonth(r) === ym);
  const pendingHod = inMonth.filter((r) => PENDING_HOD.includes(r.hodStatus));
  const drafts = inMonth.filter((r) => r.hodStatus === 'DRAFT');

  const deptList = [...new Set(EMPLOYEES.map((e) => e.dept))].sort();

  // ── Hành động chốt: chọn từng dòng / nhiều dòng để chốt — chốt là vào Payroll ngay ──
  const selectable = rows.filter((x) => eligOf(x).length > 0);
  const selRows = rows.filter((x) => selected.includes(x.key));
  const toggle = (k: string) => setSelected((cur) => (cur.includes(k) ? cur.filter((v) => v !== k) : [...cur, k]));
  const allSel = selectable.length > 0 && selectable.every((x) => selected.includes(x.key));
  const sumRows = (xs: ReportRow[]) => ({ units: xs.reduce((t, x) => t + x.paid + x.carryUnits, 0), amount: xs.reduce((t, x) => t + x.amount + x.carryAmount, 0) });

  const closeRows = (xs: ReportRow[]) => {
    const ids = xs.flatMap((x) => eligOf(x).filter((r) => r.closingId !== cid).map((r) => r.id));
    if (!ids.length) { showToast('Các dòng đã chọn không còn đơn nào để chốt (đã chốt hoặc chưa được HOD duyệt).', true); return; }
    const t = sumRows(xs);
    setConfirm({
      text: `Chốt ${xs.length} dòng (${ids.length} đơn): ${n2(t.units)} ngày công, ${money(t.amount)} đ.\nSố chốt vào Payroll ${name} ngay; đơn đã chốt bị khoá ở màn Đơn từ.`,
      onOk: () => {
        const res = applyCloseRecords(records, closings, ids, y, m, me, nowIso());
        setRecords(res.records); setClosings(res.closings); setSelected([]);
        showToast(`Đã chốt ${xs.length} dòng (${res.count} đơn) vào kỳ ${name} — Payroll ${name} đã nhận số.`);
      },
    });
  };
  const uncloseRows = (xs: ReportRow[]) => {
    const ids = xs.flatMap((x) => stampedOf(x).map((r) => r.id));
    if (!ids.length) { showToast('Các dòng đã chọn chưa có đơn nào được chốt.', true); return; }
    setConfirm({
      text: `Bỏ chốt ${xs.length} dòng (${ids.length} đơn) khỏi kỳ ${name}? Số bị gỡ khỏi Payroll ${name} ngay; đơn được mở khoá ở màn Đơn từ.`,
      onOk: () => {
        const res = applyUncloseRecords(records, ids, y, m, me, nowIso());
        setRecords(res.records); setSelected([]);
        showToast(`Đã bỏ chốt ${res.count} đơn — đã gỡ khỏi Payroll ${name}.`);
      },
    });
  };
  const closedAmount = useMemo(() => computeClosing(records.filter((r) => r.closingId === cid), closings, y, m).reduce((t, l) => t + l.amount, 0), [records, closings, cid, y, m]);

  const th = `${erp.th} text-center`;
  const thL = `${erp.th} text-left`;
  const td = `${erp.td} whitespace-nowrap`;
  const num = `${erp.td} ${erp.num}`;
  const dash = <span className="text-slate-300">–</span>;
  const z = (v: number, cls = '') => (v ? <span className={cls}>{n2(v)}</span> : dash);
  const unit = (u: string) => <span className="block font-normal text-[10.5px] text-slate-500">({u})</span>;
  const COLS = canAct ? 20 : 18;
  // Ghim cột trái (đến Mã dự án) và cột Thao tác bên phải
  const pin = (i: number, bg?: string): React.CSSProperties => ({ position: 'sticky', left: pinLefts[i] ?? 0, zIndex: 2, ...(bg ? { background: bg } : {}) });
  const pinRef = (i: number) => (el: HTMLTableCellElement | null) => { pinRefs.current[i] = el; };
  const PIN_EDGE = 'shadow-[inset_-1px_0_0_#94a3b8]';
  const pinRight = (bg?: string): React.CSSProperties => ({ position: 'sticky', right: 0, zIndex: 2, ...(bg ? { background: bg } : {}) });
  const PIN_EDGE_R = 'shadow-[inset_1px_0_0_#94a3b8]';
  const HEAD_BG = '#e8edf4';
  const doneRows = rows.filter((x) => stampedOf(x).length > 0).length;
  // Xuất Excel theo bộ lọc đang áp: sheet Tổng hợp (như lưới) + sheet Chi tiết từng khung giờ onsite
  const exportXlsx = () => {
    if (!rows.length) { showToast('Không có dữ liệu để xuất.', true); return; }
    const fileName = `BaoCaoOnsite_${y}_${String(m).padStart(2, '0')}.xlsx`;
    const head = [
      [`BÁO CÁO ONSITE THÁNG ${name}`],
      [`Kỳ chốt: ${cid} · ${isClosed ? `Đã khoá (kỳ lương đã duyệt ${fmtDT(closing?.approvedAt)})` : 'Đang chốt — gồm cả dòng chưa chốt (tính thử)'}`],
      [`Xuất lúc ${fmtDT(nowIso())} bởi ${me}${applied.search || applied.dept || applied.project ? ` · Lọc: ${[applied.search && `"${applied.search}"`, applied.dept && `BP ${applied.dept}`, applied.project && `dự án ${proj(applied.project).code}`].filter(Boolean).join(', ')}` : ''}`],
      [],
    ];
    const sum = [
      ...head,
      ['#', 'Mã NV', 'Họ và tên', 'Bộ phận', 'Mã dự án', 'Tên dự án', 'Trạng thái chốt (HR)', 'Ngày công < 30km', 'Ngày công ≥ 30km', 'Được hưởng (ngày công)', 'Không hưởng (ngày)',
        'Bổ sung tháng trước — ngày công', 'Bổ sung tháng trước — tiền (VNĐ)', 'Tổng onsite (ngày công)', 'Thành tiền (VNĐ)', 'Đơn chưa duyệt', 'Đơn bị từ chối', 'Ngày chưa ghi nhận'],
      ...rows.map((x, i) => {
        const e = emp(x.employeeId), p = proj(x.projectId), h = hrStateOf(x);
        return [i + 1, e.code, e.name, e.dept, p.code, p.name, h.sub ? `${h.t} (${h.sub})` : h.t, x.lt30, x.ge30, x.paid, x.noPay,
          x.carryUnits, x.carryAmount, x.paid + x.carryUnits, x.amount + x.carryAmount, x.pendingRecs, x.rejectedRecs, x.pending];
      }),
      ['', '', `Tổng (${rows.length} dòng)`, '', '', '', '', rt.lt30, rt.ge30, rt.paid, rt.noPay, rt.carryUnits, rt.carryAmount, rt.paid + rt.carryUnits, rt.amount + rt.carryAmount, rt.pendingRecs, rt.rejectedRecs, rt.pending],
    ];
    // Mỗi khung giờ (đơn × ngày) một dòng; số ngày công / tiền tính theo cả ngày nên chỉ ghi ở dòng đầu của ngày
    const det: (string | number)[][] = [
      ...head,
      ['#', 'Mã NV', 'Họ và tên', 'Bộ phận', 'Mã dự án (dòng báo cáo)', 'Ngày', 'Thứ', 'Mã đơn', 'Dự án của đơn', 'Từ giờ', 'Đến giờ', 'Giờ onsite', 'Địa điểm làm việc', 'Khoảng cách',
        'Trạng thái đơn', 'Giờ phép (ngày)', 'Giờ hợp lệ (ngày)', 'Ngày công', 'Mức (đ)', 'Thành tiền (đ)', 'Ghi chú'],
    ];
    let k = 0, tUnit = 0, tAmount = 0;
    rows.forEach((x) => {
      const e = emp(x.employeeId);
      detailItems(x, records, closings, y, m, isClosed, cid).forEach((it) => {
        if (it.amount) { tUnit += it.unit || 0; tAmount += it.amount; }
        it.recs.forEach((r, j) => {
          const sl = slotOf(r, it.date);
          const day = j === 0;
          det.push([++k, e.code, e.name, e.dept, proj(x.projectId).code, fmtD(it.date), dow(it.date), r.code, proj(r.projectId).code,
            sl?.start || '', sl?.end || '', sl ? sl.hours : '', sl?.address || '', sl ? ZONE_SHORT[sl.zone] : '', reportStatus(r.status, r.hodStatus),
            day && it.leave !== undefined ? it.leave : '', day && it.valid !== undefined ? it.valid : '', day && it.unit !== undefined ? it.unit : '',
            day && it.rate !== undefined ? it.rate : '', day && it.amount !== undefined ? it.amount : '', day ? it.note : 'Tính chung ngày với dòng trên']);
        });
      });
    });
    det.push(['', '', 'Tổng', '', '', '', '', '', '', '', '', '', '', '', '', '', '', tUnit, '', tAmount, 'Ngày công tính tiền / thành tiền của các ngày được hưởng']);
    const sheet = (aoa: (string | number)[][], widths: number[]) => {
      const ws = XLSX.utils.aoa_to_sheet(aoa);
      ws['!cols'] = widths.map((wch) => ({ wch }));
      ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: head.length, c: 0 }, e: { r: aoa.length - 2, c: widths.length - 1 } }) };
      return ws;
    };
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet(sum, [5, 10, 22, 14, 12, 28, 26, 10, 10, 12, 12, 14, 16, 14, 16, 10, 10, 12]), 'Tổng hợp');
    XLSX.utils.book_append_sheet(wb, sheet(det, [5, 10, 22, 14, 14, 11, 5, 14, 12, 8, 8, 9, 36, 10, 11, 10, 10, 9, 10, 12, 60]), 'Chi tiết thời gian onsite');
    XLSX.writeFile(wb, fileName);
    showToast(`Đã xuất ${fileName} — ${rows.length} dòng, ${k} khung giờ onsite${isClosed ? '' : ' (gồm cả dòng chưa chốt, tính thử)'}`);
  };

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PayRoll', 'Báo cáo Onsite']}
        title={<>Báo cáo Onsite <Tag cls={isClosed ? TAG.done : TAG.wait} icon={isClosed ? CheckCircle2 : Eye}>{isClosed ? 'Đã khoá — kỳ lương đã duyệt' : 'Đang chốt'}</Tag></>}
        actions={
          <>
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Xem với vai trò
              <select className={`${erp.input} h-8`} value={role} onChange={(e) => setRole(e.target.value as RoleKey)}>
                {(Object.keys(USERS) as RoleKey[]).map((k) => <option key={k} value={k}>{USERS[k].label} — {USERS[k].name}</option>)}
              </select>
            </label>
            <Btn icon={Download} onClick={exportXlsx}>Xuất Excel</Btn>
          </>
        }
        meta={[
          { label: 'Tháng công', value: name },
          { label: 'Kỳ chốt', value: <span className="font-mono">{cid}</span> },
          { label: isClosed ? 'Khoá lúc' : 'Đã chốt (đã vào Payroll)', value: isClosed ? `${fmtDT(closing?.approvedAt)} · duyệt kỳ lương ${name}` : `${doneRows}/${selectable.length} dòng · ${money(closedAmount)} đ` },
          { label: 'Người được chốt', value: 'HCNS, Admin' },
        ]}
        notice={
          !canClose ? <div className="px-4 py-1.5 bg-slate-50 text-slate-600 text-[12px]">Vai trò <b>{USERS[role].label}</b> chỉ xem. Chỉ HCNS / Admin được chốt / bỏ chốt onsite.</div>
            : isClosed ? <div className="px-4 py-1.5 bg-emerald-50 text-emerald-800 text-[12px]">Kỳ lương {name} đã duyệt — onsite tháng này đã khoá, không chốt / bỏ chốt được. Đơn HOD duyệt sau sẽ tính vào kỳ kế tiếp.</div>
              : <div className="px-4 py-1.5 bg-[#eaf2fc] text-[#1e3a5f] text-[12px]">Tích chọn dòng (hoặc bấm <b>Chốt</b> trên dòng) để chốt — số vào <b>Payroll {name} ngay</b>. Bỏ chốt được đến khi kỳ lương {name} được duyệt; dòng chưa chốt lúc duyệt lương chuyển sang kỳ sau.</div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiBox label="Nhân sự có phụ cấp" value={`${lines.filter((x) => x.amount > 0).length} người`} sub={`${lines.length} nhân sự có ngày onsite được xét`} />
        <KpiBox label="Tổng ngày công ghi nhận" value={n2(tot.units)} tone="good" sub={`Gồm ${n2(tot.carryU)} ngày công bổ sung tháng trước`} />
        <KpiBox label="Tổng thành tiền (VNĐ)" value={money(tot.amount)} valueText={money(tot.amount)} sub={isClosed ? 'Số đã chốt — trả cùng lương tháng này' : `Đã chốt (vào Payroll) ${money(closedAmount)} · còn lại tính thử`} />
        <KpiBox label="Đơn chờ HOD duyệt" value={`${pendingHod.length} đơn`} tone={pendingHod.length ? 'bad' : 'neutral'} sub={`Trong tháng ${name} — không vào kỳ chốt này`} />
      </div>

      <Panel
        title={`Danh sách onsite tháng ${name}`}
        icon={Table2}
        noPad
        actions={canAct && (
          <>
            <span className="text-[12px] text-slate-600">{selRows.length ? <>Đã chọn <b className="text-[#1e3a5f]">{selRows.length}</b> dòng</> : 'Tích chọn dòng để chốt nhiều'}</span>
            <Btn variant="success" icon={Lock} className="h-7" disabled={!selRows.length} onClick={() => closeRows(selRows)}>Chốt</Btn>
            <Btn icon={Unlock} className="h-7" disabled={!selRows.length} onClick={() => uncloseRows(selRows)}>Bỏ chốt</Btn>
            {selRows.length > 0 && <Btn className="h-7" onClick={() => setSelected([])}>Bỏ chọn</Btn>}
          </>
        )}
        footer={
          <details>
            <summary className="cursor-pointer select-none font-semibold text-[#1e3a5f]">Giải thích các cột</summary>
            <ul className="mt-1.5 grid grid-cols-2 gap-x-6 gap-y-0.5 list-disc ml-4 leading-relaxed text-slate-600">
              <li><b>Onsite trong tháng</b>: ngày của đơn đã duyệt. <b>Ngày công &lt; 30km / ≥ 30km</b> = ngày công được hưởng, phân theo khoảng cách của từng ngày (khớp Payroll); tổng hai cột = Được hưởng (trừ ngày ngoài Hà Nội trước {RULE_FROM.slice(5)}/{RULE_FROM.slice(0, 4)} vẫn hưởng mức cũ).</li>
              <li><b>Được hưởng</b>: ngày công được tính tiền. <b>Không hưởng</b>: chưa đủ 1 ngày công, ngoài Hà Nội, HĐ không áp dụng.</li>
              <li><b>Bổ sung tháng trước</b>: đơn tháng trước duyệt muộn, tính vào kỳ chốt đầu tiên sau khi HOD duyệt.</li>
              <li><b>Ghi nhận trong kỳ này</b>: Tổng onsite = Được hưởng + Bổ sung tháng trước; Thành tiền trả cùng lương tháng này.</li>
              <li><b>Đơn chưa duyệt</b>: đơn chờ HOD duyệt. <b>Đơn bị từ chối</b>: không tính onsite, không tính tiền.</li>
              <li><b>Ngày chưa ghi nhận</b>: ngày của đơn chờ duyệt hoặc duyệt sau khi đã chốt — tính ở kỳ sau. Đơn nháp không lên báo cáo.</li>
            </ul>
          </details>
        }
      >
        <div className="p-3 border-b border-slate-200">
          <FilterBar right={<><Btn variant="primary" icon={Search} className="h-7" onClick={execute}>Tìm kiếm</Btn><Btn icon={RefreshCw} className="h-7" onClick={resetAll}>Mặc định</Btn></>}>
            <FilterCell label="Tìm"><input className={`${erp.input} w-60`} placeholder="Mã NV, họ tên, mã dự án…" value={fSearch} onChange={(e) => setFSearch(e.target.value)} onKeyUp={(e) => e.key === 'Enter' && execute()} /></FilterCell>
            <FilterCell label="Tháng công">
              <select className={`${erp.input} w-16`} value={fMonth} onChange={(e) => setFMonth(Number(e.target.value))}>{Array.from({ length: 12 }, (_, i) => i + 1).map((x) => <option key={x} value={x}>{x}</option>)}</select>
              <select className={`${erp.input} w-20`} value={fYear} onChange={(e) => setFYear(Number(e.target.value))}>{Array.from({ length: 10 }, (_, i) => NOW.y - 5 + i).map((x) => <option key={x} value={x}>{x}</option>)}</select>
            </FilterCell>
            <FilterCell label="Bộ phận"><select className={`${erp.input} w-36`} value={fDept} onChange={(e) => setFDept(e.target.value)}><option value="">Tất cả</option>{deptList.map((d) => <option key={d}>{d}</option>)}</select></FilterCell>
            <FilterCell label="Mã dự án"><select className={`${erp.input} w-36`} value={fProject} onChange={(e) => setFProject(e.target.value)}><option value="">Tất cả</option>{PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.code}</option>)}</select></FilterCell>
          </FilterBar>
        </div>
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                {canAct && <th rowSpan={2} ref={pinRef(0)} style={pin(0, HEAD_BG)} className={`${th} border-t-0 border-l-0`}><input type="checkbox" title="Chọn tất cả dòng có thể chốt" checked={allSel} onChange={() => setSelected(allSel ? [] : selectable.map((x) => x.key))} /></th>}
                <th rowSpan={2} ref={pinRef(1)} style={pin(1, HEAD_BG)} className={`${th} border-t-0 ${canAct ? '' : 'border-l-0'}`}></th>
                <th rowSpan={2} ref={pinRef(2)} style={pin(2, HEAD_BG)} className={`${th} border-t-0`}>#</th>
                <th rowSpan={2} ref={pinRef(3)} style={pin(3, HEAD_BG)} className={`${thL} border-t-0`}>Mã NV</th>
                <th rowSpan={2} ref={pinRef(4)} style={pin(4, HEAD_BG)} className={`${thL} border-t-0`}>Họ và tên</th>
                <th rowSpan={2} ref={pinRef(5)} style={pin(5, HEAD_BG)} className={`${thL} border-t-0`}>BP</th>
                <th rowSpan={2} ref={pinRef(6)} style={pin(6, HEAD_BG)} className={`${thL} border-t-0 ${PIN_EDGE}`}>Mã dự án</th>
                <th rowSpan={2} className={`${thL} border-t-0`} title="HR đã chốt số onsite của dòng này vào kỳ chưa">Trạng thái chốt (HR)</th>
                <th colSpan={4} className={`${th} border-t-0`}>Onsite trong tháng</th>
                <th colSpan={2} className={`${th} border-t-0`} title="Đơn tháng trước duyệt muộn, chốt bổ sung vào kỳ này">Bổ sung tháng trước</th>
                <th colSpan={2} className={`${th} border-t-0 bg-[#dbe7f5]`}>Ghi nhận trong kỳ này</th>
                <th colSpan={3} className={`${th} border-t-0 ${canAct ? '' : 'border-r-0'}`}>Chưa vào kỳ này</th>
                {canAct && <th rowSpan={2} style={pinRight(HEAD_BG)} className={`${th} border-t-0 border-r-0 ${PIN_EDGE_R}`}>Thao tác</th>}
              </tr>
              <tr>
                <th className={`${th} font-medium`} title="Ngày công được hưởng tại Hà Nội, cách trụ sở dưới 30km">&lt; 30km{unit('ngày công')}</th>
                <th className={`${th} font-medium`} title="Ngày công được hưởng tại Hà Nội, cách trụ sở từ 30km">≥ 30km{unit('ngày công')}</th>
                <th className={`${th} font-medium`} title="Ngày công được tính tiền trong tháng">Được hưởng{unit('ngày công')}</th>
                <th className={`${th} font-medium`} title="Chưa đủ 1 ngày công, ngoài Hà Nội, HĐ không áp dụng">Không hưởng{unit('ngày')}</th>
                <th className={`${th} font-medium`}>Ngày công{unit('ngày công')}</th>
                <th className={`${th} font-medium`}>Tiền{unit('VNĐ')}</th>
                <th className={`${th} font-medium bg-[#dbe7f5]`} title="Được hưởng + bổ sung tháng trước">Tổng onsite{unit('ngày công')}</th>
                <th className={`${th} font-medium bg-[#dbe7f5]`}>Thành tiền{unit('VNĐ')}</th>
                <th className={`${th} font-medium`} title="Đơn trong tháng còn chờ HOD duyệt">Đơn chưa duyệt{unit('đơn')}</th>
                <th className={`${th} font-medium`} title="Đơn trong tháng bị HOD từ chối">Đơn bị từ chối{unit('đơn')}</th>
                <th className={`${th} font-medium ${canAct ? '' : 'border-r-0'}`} title="Ngày của đơn chờ duyệt hoặc duyệt sau khi đã chốt — tính kỳ sau">Ngày chưa ghi nhận{unit('ngày')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={COLS} className={`${erp.td} border-x-0 text-center text-slate-400 py-8`}>Không có dữ liệu</td></tr>}
              {rows.map((x, i) => {
                const e = emp(x.employeeId);
                const isOpen = openKey === x.key;
                const sel = selected.includes(x.key);
                const bg = sel ? '#eaf2fc' : isOpen ? '#f3f6fa' : i % 2 ? '#f8fafc' : '#ffffff';
                return (
                  <React.Fragment key={x.key}>
                    <tr className="cursor-pointer [&:hover>td]:!bg-[#eaf2fc]" style={{ background: bg }} onClick={() => setOpenKey(isOpen ? null : x.key)}>
                      {canAct && <td style={pin(0, bg)} className={`${td} text-center border-l-0`} onClick={(ev) => ev.stopPropagation()}><input type="checkbox" disabled={!eligOf(x).length} checked={sel} onChange={() => toggle(x.key)} /></td>}
                      <td style={pin(1, bg)} className={`${td} px-1 text-slate-400 ${canAct ? '' : 'border-l-0'}`}>{isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</td>
                      <td style={pin(2, bg)} className={`${td} text-center text-slate-500`}>{i + 1}</td>
                      <td style={pin(3, bg)} className={`${td} font-mono text-slate-600`}>{e.code}</td>
                      <td style={pin(4, bg)} className={`${td} font-semibold text-slate-900`}>{e.name}</td>
                      <td style={pin(5, bg)} className={`${td} text-slate-600`}>{e.dept}</td>
                      <td style={pin(6, bg)} className={`${td} ${erp.code} ${PIN_EDGE}`} title={proj(x.projectId).name}>{proj(x.projectId).code}</td>
                      <td className={td}>{hrState(x)}</td>
                      <td className={num}>{z(x.lt30)}</td>
                      <td className={num}>{z(x.ge30)}</td>
                      <td className={num}>{z(x.paid, 'font-semibold text-emerald-700')}</td>
                      <td className={num}>{z(x.noPay, 'font-semibold text-rose-600')}</td>
                      <td className={num}>{z(x.carryUnits)}</td>
                      <td className={num}>{x.carryAmount ? money(x.carryAmount) : dash}</td>
                      <td className={`${num} bg-[#f3f7fc] font-bold text-slate-900`}>{z(x.paid + x.carryUnits)}</td>
                      <td className={`${num} bg-[#f3f7fc] font-bold text-slate-900`}>{x.amount + x.carryAmount ? money(x.amount + x.carryAmount) : dash}</td>
                      <td className={num}>{z(x.pendingRecs, 'font-semibold text-amber-700')}</td>
                      <td className={num} title={x.rejectedRecs ? `${x.rejectedRecs} đơn, ${n2(x.rejectedDays)} ngày` : undefined}>{z(x.rejectedRecs, 'font-semibold text-rose-600')}</td>
                      <td className={`${num} ${canAct ? '' : 'border-r-0'}`}>{z(x.pending, 'font-semibold text-amber-700')}</td>
                      {canAct && (
                        <td style={pinRight(bg)} className={`${td} border-r-0 ${PIN_EDGE_R}`} onClick={(ev) => ev.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            {eligOf(x).some((r) => r.closingId !== cid) && <Btn variant="success" icon={Lock} className="h-6 px-2 text-[11px]" onClick={() => closeRows([x])}>Chốt</Btn>}
                            {stampedOf(x).length > 0 && <Btn icon={Unlock} className="h-6 px-2 text-[11px]" onClick={() => uncloseRows([x])}>Bỏ chốt</Btn>}
                            {!eligOf(x).length && dash}
                          </div>
                        </td>
                      )}
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={COLS} className="border border-slate-200 border-x-0 bg-[#f3f6fa] px-6 py-3">
                          <RowDetail row={x} records={records} closings={closings} y={y} m={m} isClosed={isClosed} cid={cid} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className={erp.totalRow}>
                  <td colSpan={canAct ? 7 : 6} style={{ position: 'sticky', left: 0, zIndex: 2, background: '#fff6d6' }} className={`${erp.td} text-right border-l-0 ${PIN_EDGE}`}>Tổng ({rows.length} dòng)</td>
                  <td className={erp.td} />
                  <td className={num}>{n2(rt.lt30)}</td>
                  <td className={num}>{n2(rt.ge30)}</td>
                  <td className={num}>{n2(rt.paid)}</td>
                  <td className={num}>{n2(rt.noPay)}</td>
                  <td className={num}>{n2(rt.carryUnits)}</td>
                  <td className={num}>{money(rt.carryAmount)}</td>
                  <td className={num}>{n2(rt.paid + rt.carryUnits)}</td>
                  <td className={num}>{money(rt.amount + rt.carryAmount)}</td>
                  <td className={num}>{rt.pendingRecs}</td>
                  <td className={num}>{rt.rejectedRecs}</td>
                  <td className={`${num} ${canAct ? '' : 'border-r-0'}`}>{n2(rt.pending)}</td>
                  {canAct && <td style={pinRight('#fff6d6')} className={`${erp.td} border-r-0 ${PIN_EDGE_R}`} />}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 text-[12px] leading-relaxed">
        <Panel title="Quy tắc chốt onsite (Phụ lục 03)" icon={BookOpen}>
          <ul className="list-disc ml-4 text-slate-700 space-y-1">
            <li>Áp dụng HĐ <b>thử việc</b> và <b>chính thức</b>. Onsite ngoài Hà Nội không được hưởng. Đi họp tại nơi làm việc của khách hàng không thuộc diện onsite — không đăng ký đơn.</li>
            <li>Mức: <b>&lt; 30km 100.000 đ</b>, <b>≥ 30km 180.000 đ</b> / ngày công. Ngày onsite trước {RULE_FROM.slice(5)}/{RULE_FROM.slice(0, 4)} tính mức cũ {money(OLD_RATE)} đ.</li>
            <li>Ngày công = giờ onsite trong ngày (gộp các đơn) trừ giờ phép: <b>đủ 8h = 1 ngày công</b>; <b>chưa đủ 1 ngày công thì không tính tiền</b> — áp cho mọi ngày. Một ngày có nhiều đơn khác mức ⇒ lấy mức cao nhất.</li>
            <li>Chỉ đơn <b>HOD đã duyệt</b> được chốt. Đơn chờ HOD / nháp không vào kỳ; duyệt sau khi kỳ lương tháng đó đã duyệt ⇒ <b>chốt bổ sung vào kỳ sau</b>.</li>
            <li>HCNS <b>chốt từng dòng</b> hoặc <b>chọn nhiều dòng</b>: đơn của dòng gắn kỳ chốt, bị khoá ở màn Đơn từ, và <b>số vào Payroll ngay</b> — không có bước hoàn tất tháng.</li>
            <li><b>Bỏ chốt</b> được đến khi kỳ lương cùng tháng được duyệt; bỏ chốt là số gỡ khỏi Payroll ngay.</li>
            <li><b>Duyệt kỳ lương</b> ⇒ onsite tháng đó khoá; dòng chưa chốt lúc đó chuyển sang kỳ sau (cột "Bổ sung tháng trước"). Từ chối kỳ lương ⇒ mở khoá lại.</li>
            <li>Payroll tháng đó <b>chỉ đọc số đã chốt</b>, trả vào kỳ lương của tháng; HCNS gửi mail xác nhận cùng bảng lương.</li>
          </ul>
        </Panel>
        <Panel title="Đã xác nhận (17/11/2026)" icon={CheckCircle2}>
          <ul className="list-disc ml-4 text-slate-700 space-y-1">
            <li>Phụ lục 03 áp dụng cho ngày onsite từ <b>01/{RULE_FROM.slice(5)}/{RULE_FROM.slice(0, 4)}</b>; ngày trước đó tính mức cũ {money(OLD_RATE)} đ.</li>
            <li>Mức hỗ trợ theo <b>khoảng cách của từng ngày</b> trong lịch trình đơn (một đơn đi được nhiều địa điểm), HOD duyệt cùng đơn.</li>
            <li><b>HCNS và Admin</b> được chốt / bỏ chốt dòng (quyền mới Report_Onsite.Approve).</li>
            <li>Đơn bổ sung / duyệt muộn: tính vào <b>kỳ đầu tiên còn mở sau khi HOD duyệt</b>. VD đơn tháng 8 (kỳ lương 8 đã duyệt): HOD duyệt trước khi duyệt kỳ lương tháng 9 ⇒ lương tháng 9; duyệt sau ⇒ lương tháng 10.</li>
            <li>Danh sách <b>1 dòng / nhân viên × dự án</b>; HR chọn từng dòng hoặc nhiều dòng để chốt.</li>
            <li>Duyệt (chốt) ở Báo cáo Onsite là <b>số cuối, vào thẳng lương</b> — Payroll không có bước duyệt / chốt riêng cho onsite.</li>
            <li>Một ngày có 2 đơn khác mức ⇒ cả ngày tính theo <b>mức cao</b>. Xác nhận của khách hàng: <b>chỉ cần HOD duyệt</b>.</li>
            <li>Ngày công <b>dưới 1</b> không được tính tiền — áp cho mọi ngày, kể cả ngày trước 01/11/2026 được tính bổ sung.</li>
            <li>Onsite <b>ngoài Hà Nội</b> không hưởng phụ cấp ở đây. HĐ thực tập / CTV: cho đăng ký, có cảnh báo, phụ cấp = 0.</li>
            <li>Mail xác nhận (B3) <b>gộp vào mail phiếu lương</b>.</li>
            <li>Lương đã duyệt: <b>không mở lại tháng đó</b>. Đơn duyệt muộn tính kỳ sau; đơn duyệt nhầm <b>không điều chỉnh</b>.</li>
          </ul>
        </Panel>
      </div>

      {confirm && <ConfirmModal text={confirm.text} onOk={() => { confirm.onOk(); setConfirm(null); }} onCancel={() => setConfirm(null)} />}
      {toast && (
        <div className={`fixed top-5 right-5 z-[130] px-4 py-2.5 rounded-[4px] shadow-lg flex items-start gap-2 text-[12px] font-semibold max-w-md whitespace-pre-line text-white ${toast.err ? 'bg-rose-700' : 'bg-[#1e3a5f]'}`}>
          {toast.err ? <AlertTriangle size={14} className="shrink-0 mt-px" /> : <CheckCircle2 size={14} className="text-emerald-300 shrink-0 mt-px" />}{toast.text}
        </div>
      )}
    </ErpPage>
  );
};

/** Gom dòng báo cáo theo nhân viên × dự án: ngày đã vào kỳ chốt quy về dự án của đơn mức cao nhất trong ngày;
 *  đơn chờ HOD duyệt / duyệt sau chốt ⇒ "Chưa ghi nhận", đơn bị từ chối ⇒ cột "Đơn bị từ chối" (không tính vào ngày nào). */
export interface ReportRow {
  key: string; employeeId: string; projectId: string; lateApproved: boolean;
  lt30: number; ge30: number; paid: number; amount: number; noPay: number; carryUnits: number; carryAmount: number; pending: number;
  /** Số đơn trong tháng còn chờ HOD duyệt */
  pendingRecs: number;
  /** Đơn trong tháng bị HOD từ chối: số đơn / số ngày */
  rejectedRecs: number; rejectedDays: number;
  days: ClosingDay[]; recIds: Set<string>;
}
export function buildRows(records: OnsiteRec[], closings: OnsiteClosing[], y: number, m: number, isClosed: boolean): ReportRow[] {
  const ym = ymKey(y, m), cid = closingIdOf(y, m);
  const recById = (id: string) => records.find((r) => r.id === id);
  // Kỳ đã chốt: tính lại từ đúng các đơn đã gắn kỳ (đơn bị khoá nên khớp số đã lưu); chưa chốt: tính thử
  const lines = computeClosing(isClosed ? records.filter((r) => r.closingId === cid) : records, closings, y, m);
  const map = new Map<string, ReportRow>();
  const get = (employeeId: string, projectId: string) => {
    const key = `${employeeId}|${projectId}`;
    if (!map.has(key)) map.set(key, { key, employeeId, projectId, lateApproved: false, lt30: 0, ge30: 0, paid: 0, amount: 0, noPay: 0, carryUnits: 0, carryAmount: 0, pending: 0, pendingRecs: 0, rejectedRecs: 0, rejectedDays: 0, days: [], recIds: new Set() });
    return map.get(key)!;
  };
  const included = new Set<string>();
  lines.forEach((l) => l.detail.forEach((d) => {
    const recs = d.recIds.map(recById).filter((r): r is OnsiteRec => !!r);
    if (!recs.length) return;
    recs.forEach((r) => included.add(r.id));
    const main = [...recs].sort((a, b) => rateOf(b, d.date).rate - rateOf(a, d.date).rate)[0];
    const row = get(l.employeeId, main.projectId);
    recs.forEach((r) => row.recIds.add(r.id));
    row.days.push(d);
    if (d.carry) { if (d.amount > 0) { row.carryUnits += d.unit; row.carryAmount += d.amount; } return; }
    // Cùng cách tính với kỳ chốt / Payroll: ngày công được hưởng, phân theo khoảng cách của ngày
    if (d.zone === 'HN_LT30') row.lt30 += d.unit;
    else if (d.zone === 'HN_GE30') row.ge30 += d.unit;
    if (d.amount > 0) { row.paid += d.unit; row.amount += d.amount; } else row.noPay += 1;
  }));
  records.filter((r) => recMonth(r) === ym && r.hodStatus !== 'DRAFT' && !included.has(r.id)).forEach((r) => {
    const st = reportStatus(r.status, r.hodStatus);
    if (st === 'Draft') return;
    const row = get(r.employeeId, r.projectId);
    row.recIds.add(r.id);
    const n = new Set(r.slots.map((s) => s.date)).size;
    if (st === 'Approved') { row.pending += n; row.lateApproved = true; return; } // HOD duyệt sau khi đã chốt ⇒ kỳ sau
    if (st === 'Rejected') { row.rejectedRecs += 1; row.rejectedDays += n; } else { row.pending += n; row.pendingRecs += 1; }
  });
  return [...map.values()].sort((a, b) => emp(a.employeeId).code.localeCompare(emp(b.employeeId).code)
    || proj(a.projectId).code.localeCompare(proj(b.projectId).code));
}

/** Chi tiết một dòng: mỗi ngày onsite một dòng — thông tin đơn + cách tính ngày công / tiền + kết quả chốt. */
export type DetailItem = { date: string; recs: OnsiteRec[]; hours: number; leave?: number; valid?: number; unit?: number; rate?: number; amount?: number; note: string; tone: 'ok' | 'nopay' | 'carry' | 'wait' | 'rej' };
/** Các ngày onsite của một dòng (dùng cho bảng chi tiết và xuất Excel). */
export function detailItems(row: ReportRow, records: OnsiteRec[], closings: OnsiteClosing[], y: number, m: number, isClosed: boolean, cid: string): DetailItem[] {
  type Item = DetailItem;
  const recOf = (id: string) => records.find((r) => r.id === id);
  const covered = new Set(row.days.flatMap((d) => d.recIds));
  const items: Item[] = [
    ...row.days.map((d): Item => {
      const recs = d.recIds.map(recOf).filter((r): r is OnsiteRec => !!r);
      const main = [...recs].sort((a, b) => rateOf(b, d.date).rate - rateOf(a, d.date).rate)[0];
      const why = d.rate === 0 ? recs.map((r) => rateOf(r, d.date).why).find(Boolean) || 'Không được hỗ trợ'
        : d.unit === 0 ? `Chưa đủ 1 ngày công (${n2(d.valid)}h hợp lệ) — không tính tiền` : rateOf(main, d.date).why || '';
      const state = main?.closingId === cid ? 'Đã chốt' : 'Sẽ chốt';
      const note = [d.carry ? 'Bổ sung tháng trước' : '', why, state].filter(Boolean).join(' · ');
      return { date: d.date, recs, hours: d.hours, leave: d.leave, valid: d.valid, unit: d.unit, rate: d.rate, amount: d.amount, note, tone: d.amount === 0 ? 'nopay' : d.carry ? 'carry' : 'ok' };
    }),
    ...[...row.recIds].filter((id) => !covered.has(id)).map(recOf).filter((r): r is OnsiteRec => !!r).flatMap((r) => r.slots.map((sl): Item => {
      const st = reportStatus(r.status, r.hodStatus);
      const e = evalClosing(r, closings, y, m);
      const note = st === 'Rejected' ? 'Đơn bị từ chối — không tính onsite, không tính tiền'
        : st === 'Approved' ? (isClosed && e.ok ? 'Chưa chốt khi kỳ lương đã duyệt — chuyển sang kỳ sau (bổ sung)' : e.why)
          : 'Chờ HOD duyệt — chưa ghi nhận trong kỳ này';
      return { date: sl.date, recs: [r], hours: sl.hours, note, tone: st === 'Rejected' ? 'rej' : 'wait' };
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));
  return items;
}
export const RowDetail: React.FC<{ row: ReportRow; records: OnsiteRec[]; closings: OnsiteClosing[]; y: number; m: number; isClosed: boolean; cid: string }> = ({ row, records, closings, y, m, isClosed, cid }) => {
  type Item = DetailItem;
  const items = detailItems(row, records, closings, y, m, isClosed, cid);
  const toneCls: Record<Item['tone'], string> = { ok: 'bg-white', carry: 'bg-[#eaf2fc]', nopay: 'bg-rose-50/70', wait: 'bg-amber-50/70', rej: 'bg-slate-100 text-slate-500' };
  const noteCls: Record<Item['tone'], string> = { ok: 'text-slate-500', carry: 'text-[#1f5fa8]', nopay: 'text-rose-700', wait: 'text-amber-700', rej: 'text-slate-500' };
  const c = erp.td;
  const num = (v?: number) => (v === undefined ? <span className="text-slate-300">—</span> : n2(v));
  return (
    <table className={`${erp.table} text-[12px] bg-white`}>
      <thead>
        <tr>
          {['Ngày', 'Thứ', 'Mã đơn', 'Địa điểm làm việc', 'Khoảng cách', 'Trạng thái', 'Giờ onsite', 'Giờ phép', 'Giờ hợp lệ', 'Ngày công', 'Mức (đ)', 'Thành tiền (đ)', 'Ghi chú'].map((h) => <th key={h} className={`${erp.th} text-left`}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {items.map((it, i) => {
          const main = it.recs[0];
          return (
            <tr key={`${it.date}-${i}`} className={toneCls[it.tone]}>
              <td className={`${c} py-1 whitespace-nowrap`}>{fmtD(it.date)}</td>
              <td className={`${c} ${['T7', 'CN'].includes(dow(it.date)) ? 'text-amber-700 font-semibold' : ''}`}>{dow(it.date)}</td>
              <td className={`${c} ${erp.code} whitespace-nowrap`}>{it.recs.map((r) => r.code).join(', ')}</td>
              <td className={c}>{[...new Set(it.recs.map((r) => slotOf(r, it.date)?.address || ''))].join('; ')}</td>
              <td className={`${c} whitespace-nowrap`} title={[...new Set(it.recs.map((r) => slotOf(r, it.date)?.zone).filter(Boolean).map((z) => ZONE_LABEL[z!]))].join('; ')}>{[...new Set(it.recs.map((r) => slotOf(r, it.date)?.zone).filter(Boolean).map((z) => ZONE_SHORT[z!]))].join(', ')}</td>
              <td className={c}>{main && <Badge v={reportStatus(main.status, main.hodStatus)} />}</td>
              <td className={`${c} text-right`}>{n2(it.hours)}</td>
              <td className={`${c} text-right ${it.leave ? 'text-amber-700 font-semibold' : 'text-slate-300'}`}>{num(it.leave)}</td>
              <td className={`${c} text-right`}>{num(it.valid)}</td>
              <td className={`${c} text-right font-bold`}>{num(it.unit)}</td>
              <td className={`${c} text-right`}>{it.rate === undefined ? <span className="text-slate-300">—</span> : it.rate ? money(it.rate) : <span className="text-rose-600">0</span>}</td>
              <td className={`${c} text-right font-semibold`}>{it.amount === undefined ? <span className="text-slate-300">—</span> : money(it.amount)}</td>
              <td className={`${c} ${noteCls[it.tone]}`}>{it.note}</td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr className={erp.totalRow}>
          <td colSpan={9} className={`${c} text-right`}>Tổng</td>
          <td className={`${c} text-right`}>{n2(items.reduce((t, x) => t + (x.amount ? x.unit || 0 : 0), 0))}</td>
          <td className={c} />
          <td className={`${c} text-right`}>{money(items.reduce((t, x) => t + (x.amount || 0), 0))}</td>
          <td className={`${c} font-normal text-slate-500`}>Giờ hợp lệ = giờ onsite − giờ phép (tối đa 8) · đủ 8h = 1 ngày công × mức</td>
        </tr>
      </tfoot>
    </table>
  );
};
