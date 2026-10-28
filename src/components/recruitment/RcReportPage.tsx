/**
 * Báo cáo theo khối (/recruitment/report) — bám RecruitmentReportComponent.razor + RecruitmentReportService/Calculator:
 * Bộ lọc → 8 chỉ số → Onboard theo tháng (bảng + biểu đồ) → Bảng chi tiết từng request (dòng Tổng ngay dưới tiêu đề).
 * Quyền demo: Read = chỉ khối của mình (khoá ô Khối), ReadAll = mọi khối.
 */
import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { SlidersHorizontal, BarChart3, ChevronDown, ChevronRight, FileSpreadsheet, Filter, Info, Lock, RotateCcw, ShieldCheck, Table2, TriangleAlert } from 'lucide-react';
import { ErpPage, ErpTitleBar, Panel, Btn, KpiBox, erp } from '../erp/Erp';
import { useRc } from '../../recruitment/rc/RcContext';
import { BLOCKS, todayIso, dmy } from '../../recruitment/rc/rcData';
import {
  PERIOD_TYPES, SCOPES, STATUS_GROUPS, PeriodType, Scope, StatusGroup, ReportFilter, ReportRow, PROGRESS_TONE,
  computeReport, defaultFilter, weeksInMonth, weekRange,
} from '../../recruitment/rc/rcReport';
import { ToneTag, Pager, Dash } from './rcUi';

type Perm = 'Read' | 'ReadAll';
// Màu biểu đồ theo màn thật: xanh navy (Onboard) + cam (Senior+)
const SERIES = { total: '#1f3a68', senior: '#f4a261' };

/** Dải lọc một hàng nền xám nhạt, ô cỡ nhỏ (h-7) — giống FilterBar của Báo cáo hiệu quả dự án. */
const FilterBar: React.FC<{ children: React.ReactNode; right?: React.ReactNode; plain?: boolean }> = ({ children, right, plain }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border border-slate-200 rounded-[4px] [&_input]:h-7 [&_select]:h-7 [&_input]:text-[12px] [&_select]:text-[12px]">
    <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300 whitespace-nowrap w-[96px]">
      {plain ? <><SlidersHorizontal size={13} className="text-[#1f5fa8]" /> Thuộc tính</> : <><Filter size={13} className="text-[#1f5fa8]" /> Lọc kỳ</>}
    </span>
    {children}
    {right && <span className="ml-auto flex items-center gap-2">{right}</span>}
  </div>
);

/** Dropdown chọn nhiều có checkbox (thay cho dãy nút) — trống = tất cả. */
const MultiSelect: React.FC<{ options: string[]; value: string[]; onChange: (v: string[]) => void; allText: string }> = ({ options, value, onChange, allText }) => {
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const text = value.length === 0 ? allText : value.length <= 2 ? value.join(', ') : `${value.length} trạng thái`;
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} title={value.join(', ')}
        className={`${erp.input} w-60 flex items-center justify-between gap-2 cursor-pointer text-left`}>
        <span className={`truncate ${value.length ? 'text-slate-800' : 'text-slate-500'}`}>{text}</span>
        <ChevronDown size={14} className="text-slate-500 shrink-0" />
      </button>
      {open && (
        <div className="absolute z-40 mt-1 w-60 bg-white border border-slate-300 rounded-[3px] shadow-lg py-1">
          {options.map((o) => (
            <label key={o} className="flex items-center gap-2 px-3 py-1 text-[12px] hover:bg-[#eaf2fc] cursor-pointer">
              <input type="checkbox" className="!h-3.5 w-3.5 accent-[#1f5fa8]" checked={value.includes(o)}
                onChange={() => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o])} />
              {o}
            </label>
          ))}
          <div className="border-t border-slate-200 mt-1 pt-1 px-3 flex justify-between text-[12px]">
            <button type="button" className="text-[#1f5fa8] cursor-pointer" onClick={() => onChange([...options])}>Chọn tất cả</button>
            <button type="button" className="text-slate-500 cursor-pointer" onClick={() => onChange([])}>Bỏ chọn</button>
          </div>
        </div>
      )}
    </div>
  );
};

const niceCeil = (v: number) => {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
};

/** Biểu đồ cột có trục Y, lưới nét đứt, hover hiện bảng chi tiết — cùng kiểu PlanActualChart. */
const MonthChart: React.FC<{ months: { month: number; onboard: number; senior: number }[] }> = ({ months }) => {
  const [hover, setHover] = useState<number | null>(null);
  const top = Math.max(1, ...months.map((m) => m.onboard));
  // Trục Y chỉ ra số nguyên (số người): bước 1 khi nhỏ, ngược lại ~4–5 vạch
  const step = top <= 5 ? 1 : niceCeil(top / 4);
  const max = step * Math.ceil(top / step);
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step);
  const h = (v: number) => `${Math.max(0, (v / max) * 100)}%`;
  const g = hover !== null ? months[hover] : null;
  const Bar: React.FC<{ v: number; c: string }> = ({ v, c }) => (
    <div className="w-[min(22px,35%)] rounded-t-[3px] relative" style={{ height: h(v), background: c }}>
      {v > 0 && <span className="absolute -top-4 inset-x-0 text-center text-[11px] font-semibold text-slate-700 tabular-nums">{v}</span>}
    </div>
  );
  return (
    // Cao bằng bảng bên cạnh (h-full), vùng vẽ giãn theo (flex-1), tối thiểu 220px
    <div className="flex h-full pt-6">
      <div className="flex flex-col w-8 shrink-0">
        <div className="relative flex-1 min-h-[220px]">
          {ticks.map((t) => (
            <span key={t} className="absolute right-2 text-[10px] text-slate-500 tabular-nums translate-y-1/2" style={{ bottom: h(t) }}>{t}</span>
          ))}
        </div>
        <div className="h-5" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="relative flex-1 min-h-[220px] border-l border-slate-300">
          {ticks.map((t) => (
            <div key={t} className={`absolute inset-x-0 border-t ${t === 0 ? 'border-slate-400' : 'border-dashed border-slate-200'}`} style={{ bottom: h(t) }} />
          ))}
          <div className="absolute inset-0 flex">
            {months.map((m, i) => (
              <div key={m.month} className={`flex-1 flex items-end justify-center gap-[2px] cursor-default ${hover === i ? 'bg-[#eaf2fc]' : ''}`}
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <Bar v={m.onboard} c={SERIES.total} />
                <Bar v={m.senior} c={SERIES.senior} />
              </div>
            ))}
          </div>
          {g && (
            <div className="absolute top-0 z-10 pointer-events-none bg-white border border-slate-300 rounded-[3px] shadow-md text-[11px] whitespace-nowrap"
              style={{ left: `${((hover! + 0.5) / months.length) * 100}%`, transform: `translateX(${hover! > months.length / 2 ? '-105%' : '5%'})` }}>
              <p className="font-bold px-2.5 py-1 bg-[#e8edf4] border-b border-slate-300 text-[#1e3a5f]">Tháng {g.month}</p>
              <table className="tabular-nums"><tbody>
                <tr><td className="px-2.5 py-0.5 flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: SERIES.total }} /> Onboard</td><td className="px-2.5 py-0.5 text-right font-semibold">{g.onboard}</td></tr>
                <tr><td className="px-2.5 py-0.5 flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: SERIES.senior }} /> Senior+</td><td className="px-2.5 py-0.5 text-right font-semibold">{g.senior}</td></tr>
              </tbody></table>
            </div>
          )}
        </div>
        <div className="flex h-5 items-end">
          {months.map((m) => <span key={m.month} className="flex-1 text-center text-[10px] text-slate-500 tabular-nums">T{m.month}</span>)}
        </div>
      </div>
    </div>
  );
};
/** Khối của user demo khi chỉ có quyền Read (UserProfile.DivisionId). */
const OWN_BLOCK = 'Khối G1';

const num = (n: number) => n.toLocaleString('vi-VN');
const dash = (n: number | null | undefined) => (n == null ? '—' : num(n));
const rate = (v: number | null) => (v == null ? '—' : `${(v * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%`);
const d = (s: string) => (s ? dmy(s) : '');

const TIP = {
  funnel: 'Phễu luỹ kế, không lọc kỳ, suy từ vòng hiện tại của lượt và mail đã gửi (mời PV, Offer, gửi HCNS) — có thể đếm thiếu khi ứng viên rút lui hoặc TA sửa vòng lùi',
  daysRunning: 'Có Ngày đóng: Ngày đóng − Ngày nhận. Đã đóng (Hoàn thành / Tạm dừng / Hủy) mà thiếu Ngày đóng: trống. Còn lại: Hôm nay − Ngày nhận. Thiếu Ngày nhận: trống',
  progress: 'Xét theo thứ tự: (1) Hoàn thành: Ngày đóng ≤ Deadline ⇒ Đóng – đúng hạn, ngược lại Đóng – trễ hạn; thiếu Deadline hoặc Ngày đóng ⇒ Đóng – đã tuyển đủ. (2) Hủy / Tạm dừng ⇒ Đóng – hủy/tạm dừng. (3) Chờ phê duyệt ⇒ tên trạng thái. (4) Thiếu Deadline ⇒ Chưa có deadline. (5) Hôm nay > Deadline ⇒ Overdue. (6) Đã qua ≥ 2/3 thời gian ⇒ Near Deadline. (7) Còn lại ⇒ Đúng tiến độ',
  total: 'Dòng Tổng: cộng các cột số, tỷ lệ tính lại từ tổng (không lấy trung bình từng job), Số ngày chạy job = trung bình các ô có giá trị',
};

interface Col {
  key: keyof ReportRow;
  caption: string;
  w: number;
  align?: 'left' | 'center' | 'right';
  tip?: string;
  fixed?: number; // left offset khi ghim
  text: (r: ReportRow) => React.ReactNode;
  total: (t: ReturnType<typeof computeReport>['total']) => React.ReactNode;
}

export const RcReportPage: React.FC<{ onNavigate?: (menuTitle: string) => void }> = ({ onNavigate }) => {
  const rc = useRc();
  const today = todayIso();
  const [perm, setPerm] = useState<Perm>('ReadAll');
  const [filter, setFilter] = useState<ReportFilter>(() => defaultFilter(today));
  const [monthOpen, setMonthOpen] = useState(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  const locked = perm === 'Read' ? OWN_BLOCK : null;
  const set = (patch: Partial<ReportFilter>) => { setFilter((f) => ({ ...f, ...patch })); setPage(1); };
  const isDefault = JSON.stringify({ ...filter, block: '' }) === JSON.stringify({ ...defaultFilter(today), block: '' }) && (locked != null || !filter.block);

  const res = useMemo(() => computeReport(filter, rc.requests, rc.applications, rc.mailLogs, today, locked), [filter, rc.requests, rc.applications, rc.mailLogs, today, locked]);
  const { rows, total, kpi, months, period, warn } = res;

  const skills = useMemo(() => [...new Set(rc.requests.map((r) => r.skill).filter(Boolean))].sort(), [rc.requests]);
  const levels = useMemo(() => [...new Set(rc.requests.map((r) => r.level).filter(Boolean))].sort(), [rc.requests]);
  const years = useMemo(() => { const y = +today.slice(0, 4); return Array.from({ length: 6 }, (_, i) => y + 1 - i); }, [today]);
  const showMonth = filter.periodType === 'Tháng' || filter.periodType === 'Tuần';
  const nWeeks = weeksInMonth(filter.year, filter.month);

  const cols: Col[] = [
    { key: 'block', caption: 'Khối', w: 90, fixed: 0, text: (r) => r.block.replace(/^Khối /, ''), total: () => 'Tổng' },
    { key: 'code', caption: 'IDRequest', w: 150, fixed: 90, text: (r) => (
      <a href="#" onClick={(e) => { e.preventDefault(); rc.setFocus({ screen: 'request', id: r.requestId, mode: 'view' }); onNavigate?.('Yêu cầu tuyển dụng'); }}
         className={`${erp.code} hover:underline`} title="Mở yêu cầu tuyển dụng">{r.code}</a>
    ), total: (t) => `${num(t.jobs)} request` },
    { key: 'position', caption: 'Vị trí tuyển dụng', w: 170, text: (r) => r.position, total: () => '' },
    { key: 'skill', caption: 'Skill', w: 90, text: (r) => r.skill, total: () => '' },
    { key: 'level', caption: 'Level', w: 80, text: (r) => r.level, total: () => '' },
    { key: 'taPics', caption: 'TA PIC', w: 130, text: (r) => r.taPics, total: () => '' },
    { key: 'staffing', caption: 'Nội bộ/Staffing', w: 100, align: 'center', text: (r) => r.staffing, total: () => '' },
    { key: 'status', caption: 'Tình trạng y/c', w: 120, align: 'center', text: (r) => r.status || <Dash />, total: (t) => `${num(t.recruiting)} đang tuyển` },
    { key: 'dateReceived', caption: 'Ngày nhận y/c', w: 100, align: 'center', text: (r) => d(r.dateReceived), total: () => '' },
    { key: 'deadline', caption: 'Deadline', w: 100, align: 'center', text: (r) => d(r.deadline), total: () => '' },
    { key: 'endDate', caption: 'Ngày đóng job', w: 100, align: 'center', text: (r) => d(r.endDate), total: () => '' },
    { key: 'daysRunning', caption: 'Số ngày chạy job', w: 90, align: 'right', tip: TIP.daysRunning, text: (r) => dash(r.daysRunning), total: (t) => dash(t.avgDays) },
    { key: 'progress', caption: 'Tiến độ', w: 150, align: 'center', tip: TIP.progress,
      text: (r) => (r.progress ? <ToneTag tone={PROGRESS_TONE[r.progress] ?? 'gray'}>{r.progress}</ToneTag> : <Dash />),
      total: (t) => `${num(t.overdue)} Overdue | ${num(t.near)} Near DL` },
    { key: 'headcount', caption: 'HC cần', w: 70, align: 'right', tip: 'SL cần của request; trống tính 0', text: (r) => dash(r.headcount), total: (t) => dash(t.headcount) },
    { key: 'filled', caption: 'HC đã đáp ứng', w: 90, align: 'right', tip: 'Số lượt Offer Accepted + Onboarded, chặn trong 0..HC cần (kể cả job Hoàn thành)', text: (r) => dash(r.filled), total: (t) => dash(t.filled) },
    { key: 'remaining', caption: 'HC còn thiếu', w: 90, align: 'right', tip: 'HC cần − HC đã đáp ứng (không âm)', text: (r) => dash(r.remaining), total: (t) => dash(t.remaining) },
    { key: 'fillRate', caption: 'Fill rate', w: 80, align: 'right', tip: 'HC đã đáp ứng ÷ HC cần; HC cần = 0 thì trống, không vượt 100%. Khác Fill rate màn Yêu cầu tuyển dụng', text: (r) => rate(r.fillRate), total: (t) => rate(t.fillRate) },
    { key: 'candidates', caption: 'Tổng UV', w: 74, align: 'right', tip: 'Số lượt ứng tuyển chưa xoá của job, luỹ kế, không lọc kỳ', text: (r) => dash(r.candidates), total: (t) => dash(t.candidates) },
    { key: 'wishlist', caption: 'Wishlist (UV đang process)', w: 110, align: 'right', tip: 'Số lượt đang ở 12 vòng đang xử lý: New … Offering, Pending', text: (r) => dash(r.wishlist), total: (t) => dash(t.wishlist) },
    { key: 'cv', caption: 'CV Apply', w: 74, align: 'right', tip: `Lượt đã tới vòng Applied trở đi.\n${TIP.funnel}`, text: (r) => dash(r.cv), total: (t) => dash(t.cv) },
    { key: 'passScr', caption: 'Pass Screening', w: 90, align: 'right', tip: `Lượt đã tới vòng TA Screen_Passed trở đi.\n${TIP.funnel}`, text: (r) => dash(r.passScr), total: (t) => dash(t.passScr) },
    { key: 'passHm', caption: 'Pass HM', w: 74, align: 'right', tip: `Lượt đã tới HM Screen_Passed trở đi, hoặc đã được mời PV vòng 1.\n${TIP.funnel}`, text: (r) => dash(r.passHm), total: (t) => dash(t.passHm) },
    { key: 'passItv', caption: 'Pass Interview', w: 90, align: 'right', tip: `Lượt đã qua ít nhất 1 vòng PV, hoặc đã được mời PV vòng 2.\n${TIP.funnel}`, text: (r) => dash(r.passItv), total: (t) => dash(t.passItv) },
    { key: 'offer', caption: 'Offer', w: 66, align: 'right', tip: `Lượt đã tới Offering trở đi, hoặc đã được gửi Offer.\n${TIP.funnel}`, text: (r) => dash(r.offer), total: (t) => dash(t.offer) },
    { key: 'accepted', caption: 'Accepted', w: 80, align: 'right', tip: `Lượt Offer Accepted / Onboarded / Cancelled Onboard, hoặc đã gửi thông tin onboard sang HCNS.\n${TIP.funnel}`, text: (r) => dash(r.accepted), total: (t) => dash(t.accepted) },
    { key: 'onboard', caption: 'Onboard', w: 76, align: 'right', tip: `Lượt đang ở vòng Onboarded.\n${TIP.funnel}`, text: (r) => dash(r.onboard), total: (t) => dash(t.onboard) },
    { key: 'passScrRate', caption: '% Pass Screening (Pass Scr / CV)', w: 120, align: 'right', tip: 'Pass Screening ÷ CV Apply; mẫu = 0 thì trống', text: (r) => rate(r.passScrRate), total: (t) => rate(t.passScrRate) },
    { key: 'passItvRate', caption: '% Pass Interview (Pass Itv / Pass HM)', w: 130, align: 'right', tip: 'Pass Interview ÷ Pass HM; mẫu = 0 thì trống', text: (r) => rate(r.passItvRate), total: (t) => rate(t.passItvRate) },
    { key: 'acceptRate', caption: '% Nhận Offer (Accepted / Offer)', w: 130, align: 'right', tip: 'Accepted ÷ Offer; mẫu = 0 thì trống', text: (r) => rate(r.acceptRate), total: (t) => rate(t.acceptRate) },
    { key: 'cvToOnboard', caption: '% CV → Onboard', w: 100, align: 'right', tip: 'Onboard ÷ CV Apply; mẫu = 0 thì trống', text: (r) => rate(r.cvToOnboard), total: (t) => rate(t.cvToOnboard) },
    { key: 'note', caption: 'Note', w: 200, text: (r) => <span className="block truncate" title={r.note}>{r.note}</span>, total: () => '' },
  ];

  const alignCls = (a?: string) => (a === 'right' ? 'text-right tabular-nums' : a === 'center' ? 'text-center' : 'text-left');
  const pageRows = rows.slice((page - 1) * size, page * size);

  const exportXlsx = () => {
    const head = cols.map((c) => c.caption);
    const cell = (r: ReportRow, c: Col) => {
      const v = r[c.key];
      if (['fillRate', 'passScrRate', 'passItvRate', 'acceptRate', 'cvToOnboard'].includes(c.key)) return v == null ? '' : (v as number);
      if (['dateReceived', 'deadline', 'endDate'].includes(c.key)) return d(v as string);
      return v ?? '';
    };
    const aoa: (string | number)[][] = [
      ['BÁO CÁO TỔNG HỢP REQUEST THEO KHỐI'],
      [`Đang xem: ${d(period.from)} – ${d(period.to)} (${period.days} ngày)`],
      [],
      head,
      cols.map((c) => { const t = c.total(total); return typeof t === 'string' || typeof t === 'number' ? t : ''; }),
      ...rows.map((r) => cols.map((c) => cell(r, c))),
    ];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = cols.map((c) => ({ wch: Math.round(c.w / 7) }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RPT_Khối');
    XLSX.writeFile(wb, `BaoCaoTheoKhoi_${period.from}_${period.to}.xlsx`);
  };

  const warnItems = [
    warn.missingDeadline > 0 && `${num(warn.missingDeadline)} job thiếu Deadline`,
    warn.closedMissingEnd > 0 && `${num(warn.closedMissingEnd)} job đã đóng thiếu Ngày đóng`,
    warn.onboardEstimated > 0 && `${num(warn.onboardEstimated)} lượt Onboarded chưa có ngày onboard thật (đang lấy ngày đổi vòng)`,
  ].filter(Boolean) as string[];

  const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <label className="flex items-center gap-1.5 min-w-0">
      <span className="text-[12px] text-slate-600 whitespace-nowrap">{label}</span>
      {children}
    </label>
  );
  const Sel: React.FC<{ value: string | number; onChange: (v: string) => void; options: { v: string | number; t: string }[]; w?: string; blank?: string; disabled?: boolean }> =
    ({ value, onChange, options, w = 'w-28', blank, disabled }) => (
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className={`${erp.input} ${w} cursor-pointer`}>
        {blank != null && <option value="">{blank}</option>}
        {options.map((o) => <option key={o.v} value={o.v}>{o.t}</option>)}
      </select>
    );

  const yearTotal = months.reduce((s, m) => s + m.onboard, 0);
  const yearSenior = months.reduce((s, m) => s + m.senior, 0);

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['Recruitment', 'Báo cáo theo khối']}
        title="BÁO CÁO TỔNG HỢP REQUEST THEO KHỐI"
        actions={
          <>
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600 border border-slate-300 rounded-[3px] bg-slate-50 pl-2" title="Demo quyền Recruitment.Report.*">
              <ShieldCheck size={13} className="text-slate-500" /> Quyền
              <select value={perm} onChange={(e) => { setPerm(e.target.value as Perm); setPage(1); }} className="h-8 px-1.5 bg-white border-l border-slate-300 text-[12px] font-semibold text-[#1e3a5f] outline-none cursor-pointer">
                <option value="ReadAll">ReadAll (mọi khối)</option>
                <option value="Read">Read (chỉ khối mình)</option>
              </select>
            </label>
            <Btn icon={FileSpreadsheet} variant="success" onClick={exportXlsx}>Xuất Excel</Btn>
          </>
        }
        meta={[
          { label: 'Đang xem', value: `${d(period.from)} – ${d(period.to)} (${period.days} ngày)` },
          { label: 'Số request', value: total.jobs },
          ...(locked ? [{ label: 'Khối', value: <span className="inline-flex items-center gap-1 text-amber-700"><Lock size={12} /> {locked}</span> }] : []),
        ]}
      />

      {/* ── Bộ lọc: dải một hàng nền xám như Báo cáo hiệu quả dự án ── */}
      <FilterBar
        right={!isDefault && <Btn className="h-7" icon={RotateCcw} onClick={() => { setFilter(defaultFilter(today)); setPage(1); }}>Mặc định</Btn>}>
        <Field label="Loại kỳ"><Sel value={filter.periodType} w="w-28" onChange={(v) => set({ periodType: v as PeriodType })} options={PERIOD_TYPES.map((p) => ({ v: p, t: p }))} /></Field>
        <Field label="Năm">
          <Sel value={filter.year} w="w-20" onChange={(v) => set({ year: +v, week: Math.min(filter.week, weeksInMonth(+v, filter.month)) })} options={years.map((y) => ({ v: y, t: String(y) }))} />
        </Field>
        {showMonth && (
          <Field label="Tháng">
            <Sel value={filter.month} w="w-24" onChange={(v) => set({ month: +v, week: Math.min(filter.week, weeksInMonth(filter.year, +v)) })}
              options={Array.from({ length: 12 }, (_, i) => ({ v: i + 1, t: `Tháng ${i + 1}` }))} />
          </Field>
        )}
        {filter.periodType === 'Quý' && (
          <Field label="Quý"><Sel value={filter.quarter} w="w-24" onChange={(v) => set({ quarter: +v })} options={[1, 2, 3, 4].map((q) => ({ v: q, t: `Quý ${q}` }))} /></Field>
        )}
        {filter.periodType === 'Nửa năm' && (
          <Field label="Nửa năm"><Sel value={filter.half} w="w-28" onChange={(v) => set({ half: +v })} options={[1, 2].map((h) => ({ v: h, t: `Nửa năm ${h}` }))} /></Field>
        )}
        {filter.periodType === 'Tuần' && (
          <Field label="Tuần">
            <Sel value={filter.week} w="w-52" onChange={(v) => set({ week: +v })}
              options={Array.from({ length: nWeeks }, (_, i) => { const w = weekRange(filter.year, filter.month, i + 1); return { v: i + 1, t: `Tuần ${i + 1} (${d(w.from).slice(0, 5)}–${d(w.to).slice(0, 5)})` }; })} />
          </Field>
        )}
        {filter.periodType === 'Tuỳ chọn' && (
          <>
            <Field label="Từ ngày"><input type="date" value={filter.from} onChange={(e) => set({ from: e.target.value })} className={`${erp.input} w-36`} /></Field>
            <Field label="Đến ngày"><input type="date" value={filter.to} onChange={(e) => set({ to: e.target.value })} className={`${erp.input} w-36`} /></Field>
          </>
        )}
        <Field label="Phạm vi kỳ">
          <Sel value={filter.scope} w="w-56" onChange={(v) => set({ scope: v as Scope })} options={SCOPES.map((s) => ({ v: s, t: s }))} />
        </Field>
      </FilterBar>
      <FilterBar plain>
        <Field label="Skill"><Sel value={filter.skill} blank="Tất cả" onChange={(v) => set({ skill: v })} options={skills.map((s) => ({ v: s, t: s }))} w="w-32" /></Field>
        <Field label="Level"><Sel value={filter.level} blank="Tất cả" onChange={(v) => set({ level: v })} options={levels.map((s) => ({ v: s, t: s }))} w="w-28" /></Field>
        <Field label="Nội bộ/Staffing"><Sel value={filter.staffing} blank="Tất cả" onChange={(v) => set({ staffing: v as ReportFilter['staffing'] })} options={[{ v: 'Nội Bộ', t: 'Nội Bộ' }, { v: 'Staffing', t: 'Staffing' }]} w="w-28" /></Field>
        <Field label="Khối">
          <Sel value={locked ?? filter.block} blank="Tất cả" disabled={!!locked} onChange={(v) => set({ block: v })} options={BLOCKS.map((b) => ({ v: b.name, t: b.name }))} w="w-32" />
        </Field>
        <Field label="Trạng thái request">
          <MultiSelect options={STATUS_GROUPS} value={filter.statusGroups} onChange={(v) => set({ statusGroups: v as StatusGroup[] })} allText="Tất cả" />
        </Field>
        <Field label="ID Request">
          <input value={filter.code} onChange={(e) => set({ code: e.target.value })} placeholder="Nhập mã request" className={`${erp.input} w-36`} />
        </Field>
      </FilterBar>

      {/* ── Chỉ số tổng quan ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiBox label="Tổng request" value={num(total.jobs)} sub={`Đang tuyển: ${num(total.recruiting)}`} />
        <KpiBox label="HC cần" value={num(total.headcount)} sub={`Còn thiếu: ${num(total.remaining)} HC`} />
        <KpiBox label="Fill rate *" value={rate(total.fillRate)} tone="good" sub={`Đã đáp ứng ${num(total.filled)} / ${num(total.headcount)} HC`} />
        <KpiBox label="Job Overdue" value={num(total.overdue)} tone={total.overdue > 0 ? 'bad' : 'neutral'} sub={`Near Deadline: ${num(total.near)}`} />
        <KpiBox label="Tổng ứng viên" value={num(total.candidates)} sub={`CV Apply: ${num(total.cv)} | Offer: ${num(total.offer)}`} />
        <KpiBox label="Tỷ lệ nhận Offer" value={rate(total.acceptRate)} sub={`Accepted ${num(total.accepted)} / Offer ${num(total.offer)}`} />
        <KpiBox label="Onboard trong kỳ" value={num(kpi.onboardInPeriod)} sub={`Senior+: ${num(kpi.seniorInPeriod)}`} />
        <KpiBox label="Time to fill TB" value={kpi.avgTimeToFill == null ? '—' : `${num(kpi.avgTimeToFill)} ngày`} sub={`Số ngày chạy job TB: ${kpi.avgDaysRunning ?? '—'}`} />
      </div>
      <div className="flex items-start gap-1.5 text-[11.5px] text-slate-500">
        <Info size={13} className="mt-px shrink-0" />
        <span>* Đã đáp ứng chặn trong 0..HC cần, khác Fill rate màn Yêu cầu tuyển dụng. {TIP.funnel}.</span>
      </div>
      {warnItems.length > 0 && (
        <div className="flex items-start gap-1.5 text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-[3px] px-3 py-1.5">
          <TriangleAlert size={14} className="mt-px shrink-0" />
          <span>{warnItems.join(' · ')}</span>
        </div>
      )}

      {/* ── Onboard theo tháng ── */}
      <Panel title={`Onboard theo tháng – năm ${filter.year}`} icon={BarChart3}
        actions={
          <span className="flex items-center gap-3 text-[11px] text-slate-600">
            {[{ c: SERIES.total, t: 'Onboard' }, { c: SERIES.senior, t: 'Senior+' }].map((l) => (
              <span key={l.t} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-[2px]" style={{ background: l.c }} />{l.t}</span>
            ))}
            <button type="button" onClick={() => setMonthOpen((o) => !o)} className="flex items-center gap-1 text-slate-600 cursor-pointer">
              Năm: <b>{yearTotal || '—'}</b> · Senior+ <b>{yearSenior || '—'}</b>
              {monthOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          </span>
        }>
        {monthOpen && (
          <div className="grid lg:grid-cols-[1fr_300px] gap-4" title="Số lượt Onboarded có ngày onboard trong từng tháng của Năm đã chọn. Chỉ lọc Khối / Skill / Level / Nội bộ-Staffing, không phụ thuộc Từ–Đến, Trạng thái request, Phạm vi kỳ.">
            <MonthChart months={months} />
            <table className={erp.table}>
              <thead><tr><th className={`${erp.th} text-left`}>Tháng</th><th className={`${erp.th} text-right`}>Onboard</th><th className={`${erp.th} text-right`}>Senior+</th></tr></thead>
              <tbody>
                {months.map((m) => (
                  <tr key={m.month} className={erp.tr}>
                    <td className={`${erp.td} font-semibold`}>T{m.month}</td>
                    <td className={`${erp.td} ${erp.num}`}>{m.onboard || '–'}</td>
                    <td className={`${erp.td} ${erp.num}`}>{m.senior || '–'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className={erp.totalRow}>
                  <td className={erp.td}>Năm</td>
                  <td className={`${erp.td} ${erp.num}`}>{yearTotal || '–'}</td>
                  <td className={`${erp.td} ${erp.num}`}>{yearSenior || '–'}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Panel>

      {/* ── Bảng chi tiết ── */}
      <Panel title="Chi tiết từng request" icon={Table2} noPad
        footer={<Pager total={rows.length} page={page} size={size} onPage={setPage} onSize={(s) => { setSize(s); setPage(1); }} />}>
        <div className="overflow-auto max-h-[70vh]">
          <table className={`${erp.table} border-separate border-spacing-0`} style={{ minWidth: cols.reduce((s, c) => s + c.w, 0) }}>
            <thead className="sticky top-0 z-20">
              <tr>
                {cols.map((c) => (
                  <th key={c.key} title={c.tip ?? c.caption}
                    className={`${erp.th} ${alignCls(c.align)} whitespace-normal align-middle ${c.fixed != null ? 'sticky z-30' : ''}`}
                    style={{ minWidth: c.w, width: c.w, left: c.fixed }}>{c.caption}</th>
                ))}
              </tr>
              <tr title={TIP.total}>
                {cols.map((c) => (
                  <th key={c.key}
                    className={`bg-[#fff6d6] border border-slate-300 px-2.5 py-1.5 text-[12px] font-bold text-slate-800 whitespace-nowrap ${alignCls(c.align)} ${c.fixed != null ? 'sticky z-30' : ''}`}
                    style={{ left: c.fixed }}>{c.total(total)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr><td colSpan={cols.length} className="text-center text-slate-400 py-8">Không có dữ liệu theo bộ lọc hiện tại</td></tr>
              )}
              {pageRows.map((r) => (
                <tr key={r.requestId} className={`${erp.tr} group`}>
                  {cols.map((c) => (
                    <td key={c.key} className={`${erp.td} ${alignCls(c.align)} whitespace-nowrap ${c.fixed != null ? 'sticky z-10 bg-white group-hover:bg-[#eaf2fc]' : ''}`}
                      style={{ left: c.fixed, maxWidth: c.w }}>{c.text(r)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </ErpPage>
  );
};
