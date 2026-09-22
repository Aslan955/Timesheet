/**
 * TimesheetApprovalPage — Màn "Duyệt Timesheet của Quản lý".
 *
 * Bám sát thiết kế hệ thống IMIS gốc (Approve/Reject Selection, thanh điều hướng
 * tuần Today / ‹ / ›, các cột ProjectName · AuthorName · AuthorKey · PM ·
 * Department · Time Log · Attendance · Status · Actions, nút Export to XLSX &
 * Migrate Data).
 *
 * Bổ sung so với IMIS gốc (vốn chỉ xem theo tuần):
 *   • Bộ lọc "Kỳ xem" gồm Theo Tuần / Theo Tháng.
 *   • Ở chế độ Tháng: chọn 1 tháng rồi lọc theo từng tuần trong tháng đó
 *     (hoặc "Cả tháng" để gộp tất cả các tuần).
 */
import React, { useMemo, useState } from 'react';
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Ban,
  Eye,
  Search,
  Filter,
  FileSpreadsheet,
  DatabaseZap,
  Calendar,
  CalendarDays,
  Clock,
  Fingerprint,
  Grid,
  X,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================================================
// Period helpers (Tuần / Tháng) — dùng ISO week, khớp dữ liệu IMIS gốc.
// ==========================================================================
const YEAR = 2026;

const pad = (n: number) => String(n).padStart(2, '0');
const fmtDate = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const shortDate = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;

// Thứ 2 của tuần ISO thứ `week` trong năm `year`.
const getMondayOfISOWeek = (week: number, year: number): Date => {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay(); // 0 (CN) .. 6 (T7)
  const monday = new Date(simple);
  if (dow <= 4) monday.setDate(simple.getDate() - dow + 1);
  else monday.setDate(simple.getDate() + 8 - dow);
  return monday;
};

const weekRange = (week: number, year: number) => {
  const monday = getMondayOfISOWeek(week, year);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
};

const weekRangeLabel = (week: number, year: number) => {
  const { monday, sunday } = weekRange(week, year);
  return `${fmtDate(monday)} – ${fmtDate(sunday)}`;
};

// Tuần thuộc tháng nào được xác định theo Thứ 5 (quy tắc ISO).
const getWeeksOfMonth = (month: number, year: number): number[] => {
  const out: number[] = [];
  for (let w = 1; w <= 53; w++) {
    const monday = getMondayOfISOWeek(w, year);
    const thursday = new Date(monday);
    thursday.setDate(monday.getDate() + 3);
    if (thursday.getFullYear() === year && thursday.getMonth() + 1 === month) out.push(w);
  }
  return out;
};

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const monthLabel = (m: number) => `Tháng ${pad(m)}/${YEAR}`;

// ==========================================================================
// Dữ liệu mẫu — roster tái hiện đúng ảnh IMIS, sinh biến thể theo từng tuần.
// ==========================================================================
type Status = 'REVIEW' | 'APPROVED' | 'REJECTED';

interface ApprovalRow {
  id: string;
  projectName: string;
  authorName: string;
  authorKey: string;
  pm: string;
  department: string;
  timeLog: number;      // Giờ log (Jira)
  attendance: number;   // Số công vân tay (ngày) trong kỳ
  status: Status;
  week: number;
  month: number;        // 1..12
}

// Roster gốc lấy từ ảnh hệ thống IMIS (tuần 32).
const BASE_ROSTER: Array<{
  projectName: string;
  authorName: string;
  authorKey: string;
  pm: string;
  department: string;
  baseLog: number;
  baseAtt: number;
}> = [
  { projectName: 'E.22.NB.EDS.ITSP', authorName: 'Bế Văn Dương', authorKey: 'Duongbv', pm: 'BẾ VĂN DƯƠNG', department: 'Back Office', baseLog: 39.5, baseAtt: 5 },
  { projectName: '024.640.1', authorName: 'Lê Thanh Tùng', authorKey: 'tunglt1', pm: '—', department: 'Giải pháp - Dịch vụ', baseLog: 4, baseAtt: 1 },
  { projectName: '024.470.1', authorName: 'Lê Thanh Tùng', authorKey: 'tunglt1', pm: '—', department: 'Giải pháp - Dịch vụ', baseLog: 8, baseAtt: 1 },
  { projectName: '103.103.2.1', authorName: 'Nguyễn Đạt', authorKey: 'datn', pm: 'NGUYỄN QUỐC PHÚ', department: 'Giải pháp - Dịch vụ', baseLog: 40, baseAtt: 5 },
  { projectName: '005.008.2', authorName: 'Phạm Tài Khôi', authorKey: 'khoipt', pm: 'NGUYỄN TUẤN ĐẠT', department: 'G2', baseLog: 40, baseAtt: 5 },
  { projectName: 'E.22.NB.EDS.MKTI', authorName: 'Tiêu Ngọc Linh', authorKey: 'linhtn', pm: 'TIÊU NGỌC LINH', department: 'Sales & Marketing', baseLog: 32, baseAtt: 4 },
  { projectName: 'E.22.NB.EDS.ITSP', authorName: 'Trần Duy Hưng', authorKey: 'hungtd1', pm: 'BẾ VĂN DƯƠNG', department: 'Back Office', baseLog: 40, baseAtt: 5 },
  { projectName: '012.003.2', authorName: 'Bùi Công Hoàng', authorKey: 'hoangbc', pm: 'Bùi Văn Nghĩa', department: 'G2', baseLog: 36, baseAtt: 5 },
  { projectName: '996.996.2', authorName: 'Bùi Huỳnh Nhật Hiếu', authorKey: 'hieubhn', pm: 'BÙI HUỲNH NHẬT HIẾU', department: 'Giải pháp - Dịch vụ', baseLog: 20, baseAtt: 3 },
  { projectName: '002.941.2', authorName: 'Bùi Huỳnh Nhật Hiếu', authorKey: 'hieubhn', pm: 'NGUYỄN VĂN QUÝ', department: 'G4', baseLog: 8, baseAtt: 1 },
  { projectName: '994.994.2', authorName: 'Bùi Huỳnh Nhật Hiếu', authorKey: 'hieubhn', pm: 'NGHIÊM VIẾT TUẤN', department: 'Giải pháp - Dịch vụ', baseLog: 12, baseAtt: 2 },
  { projectName: '012.010.2', authorName: 'Bùi Nam Anh Tuấn', authorKey: 'tuanbna', pm: 'NGUYỄN QUỲNH NGA', department: 'G2', baseLog: 36, baseAtt: 5 },
  { projectName: 'X.25.NB.ADB', authorName: 'Bùi Ngọc Thanh Trúc', authorKey: 'trucbnt', pm: 'LÊ VIỆT HÀ', department: 'Health Care', baseLog: 10, baseAtt: 2 },
  { projectName: '103.103.2.1', authorName: 'Bùi Ngọc Thanh Trúc', authorKey: 'trucbnt', pm: 'NGUYỄN QUỐC PHÚ', department: 'Giải pháp - Dịch vụ', baseLog: 30, baseAtt: 4 },
  { projectName: '103.103.2.1', authorName: 'Bùi Quang Tuyển', authorKey: 'tuyenbq', pm: 'NGUYỄN QUỐC PHÚ', department: 'Giải pháp - Dịch vụ', baseLog: 36, baseAtt: 5 },
  { projectName: '022.060.2', authorName: 'Bùi Thị Hà', authorKey: 'habt', pm: 'PHẠM HỮU TRƯỜNG', department: 'G1', baseLog: 40, baseAtt: 5 },
];

// Trạng thái xoay vòng "giống thật": vài dòng đầu REVIEW, còn lại APPROVED,
// và một biến thể REJECTED rải rác — thay đổi nhẹ theo từng tuần để lọc có nghĩa.
const deriveStatus = (idx: number, week: number): Status => {
  const seed = (idx * 7 + week * 3) % 10;
  if (idx < 7 - (week % 3)) return 'REVIEW';
  if (seed === 4) return 'REJECTED';
  return 'APPROVED';
};

// Sinh toàn bộ bản ghi cho các tuần của tháng 6→9/2026 (đủ để demo bộ lọc).
const ALL_ROWS: ApprovalRow[] = (() => {
  const rows: ApprovalRow[] = [];
  for (const month of [6, 7, 8, 9]) {
    for (const week of getWeeksOfMonth(month, YEAR)) {
      BASE_ROSTER.forEach((p, idx) => {
        // Bỏ bớt vài dòng ở các tuần khác để mỗi tuần có sĩ số hơi khác nhau.
        if ((idx + week) % 8 === 0 && week % 2 === 1) return;
        const jitter = ((idx * 3 + week) % 5) - 2; // -2..+2
        const timeLog = Math.max(0, Math.round((p.baseLog + jitter) * 10) / 10);
        const attendance = Math.min(5, Math.max(0, p.baseAtt + ((week + idx) % 3 === 0 ? -1 : 0)));
        rows.push({
          id: `TSA-${YEAR}-W${week}-${idx}`,
          projectName: p.projectName,
          authorName: p.authorName,
          authorKey: p.authorKey,
          pm: p.pm,
          department: p.department,
          timeLog,
          attendance,
          status: deriveStatus(idx, week),
          week,
          month,
        });
      });
    }
  }
  return rows;
})();

const CURRENT_WEEK = 32; // Tuần mặc định (03/08 – 09/08/2026), khớp ảnh.
const CURRENT_MONTH = 8;

// ==========================================================================
// Component
// ==========================================================================
export const TimesheetApprovalPage: React.FC = () => {
  const [rows, setRows] = useState<ApprovalRow[]>(ALL_ROWS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Bộ lọc kỳ xem
  const [periodMode, setPeriodMode] = useState<'week' | 'month'>('week');
  const [month, setMonth] = useState<number>(CURRENT_MONTH);
  const [week, setWeek] = useState<number>(CURRENT_WEEK);
  const [weekInMonth, setWeekInMonth] = useState<number | 'all'>(CURRENT_WEEK); // dùng ở chế độ tháng

  // Bộ lọc phụ
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [search, setSearch] = useState('');
  const [monthOpen, setMonthOpen] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 3000);
  };

  // Bản ghi đang xem chi tiết
  const [detailRow, setDetailRow] = useState<ApprovalRow | null>(null);

  const weeksOfMonth = useMemo(() => getWeeksOfMonth(month, YEAR), [month]);

  // Nhãn dải ngày hiển thị trên thanh điều hướng.
  const periodLabel = useMemo(() => {
    if (periodMode === 'week') return weekRangeLabel(week, YEAR);
    if (weekInMonth === 'all') {
      const first = weekRange(weeksOfMonth[0], YEAR).monday;
      const last = weekRange(weeksOfMonth[weeksOfMonth.length - 1], YEAR).sunday;
      return `${monthLabel(month)} · ${shortDate(first)} – ${shortDate(last)}`;
    }
    return `Tuần ${weekInMonth} · ${weekRangeLabel(weekInMonth as number, YEAR)}`;
  }, [periodMode, week, month, weekInMonth, weeksOfMonth]);

  // Điều hướng ‹ ›
  const goPrev = () => {
    if (periodMode === 'week') setWeek((w) => Math.max(1, w - 1));
    else setMonth((m) => Math.max(1, m - 1));
  };
  const goNext = () => {
    if (periodMode === 'week') setWeek((w) => Math.min(53, w + 1));
    else setMonth((m) => Math.min(12, m + 1));
  };
  const goToday = () => {
    if (periodMode === 'week') setWeek(CURRENT_WEEK);
    else {
      setMonth(CURRENT_MONTH);
      setWeekInMonth(CURRENT_WEEK);
    }
  };

  // Khi đổi tháng, mặc định về "Cả tháng".
  const changeMonth = (m: number) => {
    setMonth(m);
    setWeekInMonth('all');
    setMonthOpen(false);
  };

  // Lọc dữ liệu
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (periodMode === 'week') {
        if (r.week !== week) return false;
      } else {
        if (r.month !== month) return false;
        if (weekInMonth !== 'all' && r.week !== weekInMonth) return false;
      }
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${r.projectName} ${r.authorName} ${r.authorKey} ${r.pm} ${r.department}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, periodMode, week, month, weekInMonth, statusFilter, search]);

  const pendingCount = filtered.filter((r) => r.status === 'REVIEW').length;
  const totalLog = filtered.reduce((s, r) => s + r.timeLog, 0);

  const allSelected = filtered.length > 0 && filtered.every((r) => selectedIds.has(r.id));
  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((r) => r.id)));
  };
  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const setStatusFor = (ids: string[], status: Status) => {
    setRows((prev) => prev.map((r) => (ids.includes(r.id) ? { ...r, status } : r)));
  };

  const approveSelection = () => {
    if (selectedIds.size === 0) return showToast('⚠️ Hãy chọn ít nhất 1 dòng để duyệt.');
    setStatusFor([...selectedIds], 'APPROVED');
    showToast(`✅ Đã duyệt ${selectedIds.size} bản ghi timesheet.`);
    setSelectedIds(new Set());
  };
  const rejectSelection = () => {
    if (selectedIds.size === 0) return showToast('⚠️ Hãy chọn ít nhất 1 dòng để từ chối.');
    setStatusFor([...selectedIds], 'REJECTED');
    showToast(`⛔ Đã từ chối ${selectedIds.size} bản ghi timesheet.`);
    setSelectedIds(new Set());
  };

  const hasActiveFilter = statusFilter !== 'all' || search.trim() !== '';

  return (
    <div className="p-4 sm:p-6 bg-slate-50/50 min-h-screen space-y-4 font-sans select-none">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            className="fixed top-6 right-6 z-[100] bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center gap-3 text-xs font-bold"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#0fa57c] animate-ping" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb + tiêu đề */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center text-xs text-slate-500 mb-1 gap-1.5 font-medium">
            <Grid size={13} className="text-slate-400" />
            <span>Home</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span>Timekeeping</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-900 font-bold">Duyệt Timesheet</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <span>Duyệt Timesheet Nhân Sự</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200">
              Quản lý
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Duyệt timesheet theo tuần như hệ thống IMIS, bổ sung bộ lọc xem theo tháng và theo từng tuần.
          </p>
        </div>
      </div>

      {/* Thanh điều hướng kỳ (Today / ‹ / dải ngày / ›) + Kỳ xem + lọc tuần trong tháng */}
      <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
       <div className="grid grid-cols-[auto_1fr] items-center gap-3">
        {/* Kỳ xem: Tuần / Tháng */}
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Kỳ xem</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setPeriodMode('week')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                periodMode === 'week' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar size={13} />
              <span>Theo Tuần</span>
            </button>
            <button
              onClick={() => setPeriodMode('month')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                periodMode === 'month' ? 'bg-white text-[#0fa57c] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CalendarDays size={13} />
              <span>Theo Tháng</span>
            </button>
          </div>
        </div>

        {/* Điều hướng dải ngày (giống IMIS) */}
        <div className="flex items-center gap-2 justify-self-end">
          <button
            onClick={goToday}
            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Hôm nay
          </button>
          <button
            onClick={() => showToast('🔄 Đã tải lại dữ liệu timesheet kỳ hiện tại.')}
            className="p-2 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Tải lại"
          >
            <RefreshCw size={14} />
          </button>

          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-1.5 py-1 rounded-xl">
            <button onClick={goPrev} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
              <ChevronLeft size={16} />
            </button>

            {periodMode === 'week' ? (
              <div className="px-2 min-w-[180px] text-center">
                <div className="text-[10px] font-bold text-slate-400 leading-none">Tuần {week}</div>
                <div className="text-xs font-mono font-bold text-slate-700 leading-tight">{weekRangeLabel(week, YEAR)}</div>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setMonthOpen((o) => !o)}
                  className="px-3 min-w-[180px] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="text-xs font-mono font-bold text-slate-700">{monthLabel(month)}</span>
                  <ChevronDown size={13} className={`text-slate-400 transition-transform ${monthOpen ? 'rotate-180' : ''}`} />
                </button>
                {monthOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setMonthOpen(false)} />
                    <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-30 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 grid grid-cols-3 gap-1">
                      {MONTHS.map((m) => (
                        <button
                          key={m}
                          onClick={() => changeMonth(m)}
                          className={`py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                            m === month ? 'bg-[#0fa57c] text-white' : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          T{pad(m)}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <button onClick={goNext} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
       </div>

       {/* Ở chế độ tháng: chọn từng tuần trong tháng (chip) — gộp chung card */}
       {periodMode === 'month' && (
        <div className="grid grid-cols-[112px_1fr] items-center gap-3 pt-2.5 border-t border-slate-100">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <Filter size={12} /> Lọc theo tuần
          </span>
          <div className="flex items-stretch gap-2">
            <button
              onClick={() => setWeekInMonth('all')}
              className={`w-32 shrink-0 px-2 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center leading-tight ${
                weekInMonth === 'all'
                  ? 'bg-[#0fa57c] text-white border-[#0fa57c] shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>Cả tháng</span>
              <span className={`text-[10px] font-mono ${weekInMonth === 'all' ? 'text-emerald-100' : 'text-slate-400'}`}>
                {weeksOfMonth.length} tuần
              </span>
            </button>
            {weeksOfMonth.map((w) => (
              <button
                key={w}
                onClick={() => setWeekInMonth(w)}
                className={`w-28 shrink-0 px-2 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center justify-center leading-tight ${
                  weekInMonth === w
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span>Tuần {w}</span>
                <span className={`text-[10px] font-mono ${weekInMonth === w ? 'text-blue-100' : 'text-slate-400'}`}>
                  {shortDate(weekRange(w, YEAR).monday)}–{shortDate(weekRange(w, YEAR).sunday)}
                </span>
              </button>
            ))}
          </div>
        </div>
       )}
      </div>

      {/* Bộ lọc phụ + tìm kiếm — bố cục cứng (grid cột cố định) */}
      <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs grid grid-cols-[64px_240px_360px_1fr_136px_150px] items-center gap-2.5">
        {/* Cột 1: nhãn */}
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <Filter size={12} /> Bộ lọc
        </span>

        {/* Cột 2: trạng thái */}
        <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 hover:border-slate-300 transition-all">
          <CheckCircle2 size={13} className="text-indigo-600 mr-1.5 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="REVIEW">REVIEW (Chờ duyệt)</option>
            <option value="APPROVED">APPROVED (Đã duyệt)</option>
            <option value="REJECTED">REJECTED (Từ chối)</option>
          </select>
        </div>

        {/* Cột 3: tìm kiếm */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm dự án, nhân sự, key, PM, phòng ban..."
            className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Cột 4: khoảng đệm cố định (giữ 2 nút phải luôn đứng yên) */}
        <div />

        {/* Cột 5: xóa bộ lọc */}
        <button
          onClick={() => {
            setStatusFilter('all');
            setSearch('');
          }}
          disabled={!hasActiveFilter}
          className={`w-full justify-center px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
            hasActiveFilter
              ? 'text-rose-600 bg-rose-50 hover:bg-rose-100 cursor-pointer'
              : 'text-slate-400 bg-slate-50 border border-slate-200 cursor-not-allowed opacity-60'
          }`}
        >
          <X size={13} /> Xóa bộ lọc
        </button>

        {/* Cột 6: cần duyệt */}
        <button
          onClick={() => setStatusFilter((s) => (s === 'REVIEW' ? 'all' : 'REVIEW'))}
          title="Lọc nhanh timesheet chờ duyệt"
          className={`w-full justify-center flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            statusFilter === 'REVIEW'
              ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Clock size={14} className={statusFilter === 'REVIEW' ? 'text-white' : 'text-amber-600'} />
          <span>Cần duyệt</span>
          <span className={`font-mono font-black px-1.5 rounded ${statusFilter === 'REVIEW' ? 'bg-white/20' : 'bg-amber-100'}`}>
            {pendingCount}
          </span>
        </button>
      </div>

      {/* Bảng danh sách + thanh hành động (theo IMIS) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Toolbar trên bảng */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3 flex-wrap">
          <button
            onClick={approveSelection}
            className="flex items-center text-xs text-[#0fa57c] font-bold hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition-all cursor-pointer active:scale-95"
          >
            <CheckCircle2 size={15} className="mr-1.5" /> Approve Selection
          </button>
          <button
            onClick={rejectSelection}
            className="flex items-center text-xs text-rose-600 font-bold hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-all cursor-pointer active:scale-95"
          >
            <XCircle size={15} className="mr-1.5" /> Reject Selection
          </button>
          {selectedIds.size > 0 && (
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              Đã chọn <strong className="text-blue-600 font-mono">{selectedIds.size}</strong> dòng
            </span>
          )}

          <div className="ml-auto flex items-center gap-2.5">
            <span className="hidden md:inline text-[11px] text-slate-400 font-semibold mr-1">
              Kỳ: <strong className="text-slate-600">{periodLabel}</strong>
            </span>
            <button
              onClick={() => showToast('📥 Đã xuất dữ liệu timesheet ra file XLSX.')}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet size={14} className="text-emerald-600" /> Export to XLSX
            </button>
            <button
              onClick={() => showToast('🔁 Đã đồng bộ (migrate) dữ liệu timesheet kỳ hiện tại.')}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <DatabaseZap size={14} className="text-amber-600" /> Migrate Data
            </button>
          </div>
        </div>

        {/* Bảng */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 rounded accent-blue-600 cursor-pointer" />
                </th>
                <th className="py-3 px-3 w-10 text-center">#</th>
                <th className="py-3 px-4">ProjectName</th>
                <th className="py-3 px-4">AuthorName</th>
                <th className="py-3 px-4">AuthorKey</th>
                <th className="py-3 px-4">PM</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-3 text-right">Time Log</th>
                <th className="py-3 px-3 text-center">Attendance</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((r, idx) => {
                const selected = selectedIds.has(r.id);
                return (
                  <tr key={r.id} className={`transition-colors group ${selected ? 'bg-blue-50/50' : 'hover:bg-slate-50/70'}`}>
                    <td className="py-3 px-3 text-center">
                      <input type="checkbox" checked={selected} onChange={() => toggleOne(r.id)} className="w-4 h-4 rounded accent-blue-600 cursor-pointer" />
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-300">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-black text-blue-600">{r.projectName}</td>
                    <td className="py-3 px-4 font-bold text-slate-700">{r.authorName}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{r.authorKey}</td>
                    <td className="py-3 px-4 text-slate-600">{r.pm}</td>
                    <td className="py-3 px-4 text-slate-600">{r.department}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">{r.timeLog}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-slate-500 font-mono">
                        <Fingerprint size={12} className="text-slate-400" /> {r.attendance}/5
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {r.status === 'REVIEW' && (
                        <span className="px-2.5 py-1 bg-sky-100 text-sky-700 text-[10px] font-black rounded-lg border border-sky-200 tracking-wider">REVIEW</span>
                      )}
                      {r.status === 'APPROVED' && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-lg border border-emerald-200 tracking-wider">APPROVED</span>
                      )}
                      {r.status === 'REJECTED' && (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-[10px] font-black rounded-lg border border-rose-200 tracking-wider">REJECTED</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setDetailRow(r)}
                          className="p-1.5 text-sky-500 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <Eye size={15} />
                        </button>
                        {r.status === 'REVIEW' ? (
                          <>
                            <button
                              onClick={() => {
                                setStatusFor([r.id], 'APPROVED');
                                showToast(`✅ Đã duyệt timesheet ${r.authorName}.`);
                              }}
                              className="p-1.5 text-[#0fa57c] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Duyệt"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                            <button
                              onClick={() => {
                                setStatusFor([r.id], 'REJECTED');
                                showToast(`⛔ Đã từ chối timesheet ${r.authorName}.`);
                              }}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Từ chối"
                            >
                              <Ban size={15} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setStatusFor([r.id], 'REVIEW');
                              showToast(`↩️ Đã mở lại timesheet ${r.authorName} để duyệt.`);
                            }}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Mở lại (chờ duyệt)"
                          >
                            <Ban size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-medium">
                    Không có timesheet nào trong kỳ đã chọn.
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200 text-xs font-black text-slate-700">
                  <td className="py-3 px-3" />
                  <td className="py-3 px-3" />
                  <td className="py-3 px-4" colSpan={5}>
                    <span className="inline-flex items-center gap-1.5">
                      <Users size={13} className="text-slate-400" /> Tổng: {filtered.length} bản ghi · {pendingCount} chờ duyệt
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono">{Math.round(totalLog * 10) / 10}</td>
                  <td className="py-3 px-3" colSpan={3} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* ===== MODAL: Chi tiết timesheet ===== */}
      <AnimatePresence>
        {detailRow && (
          <TimesheetDetailModal
            row={detailRow}
            onClose={() => setDetailRow(null)}
            onApprove={() => {
              setStatusFor([detailRow.id], 'APPROVED');
              showToast(`✅ Đã duyệt timesheet ${detailRow.authorName}.`);
              setDetailRow(null);
            }}
            onReject={() => {
              setStatusFor([detailRow.id], 'REJECTED');
              showToast(`⛔ Đã từ chối timesheet ${detailRow.authorName}.`);
              setDetailRow(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================================================
// Modal chi tiết timesheet (đối chiếu theo ngày trong tuần)
// ==========================================================================
const DOW = ['T2', 'T3', 'T4', 'T5', 'T6'];
const TimesheetDetailModal: React.FC<{
  row: ApprovalRow;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}> = ({ row, onClose, onApprove, onReject }) => {
  const monday = getMondayOfISOWeek(row.week, YEAR);
  // Rải giờ log & số công vào các ngày T2–T6
  const perDay = row.timeLog / 5;
  const days = DOW.map((dow, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const present = i < row.attendance; // số công = số ngày có chấm công
    const log = Math.round(perDay * 10) / 10;
    return { dow, date: fmtDate(d), log, present };
  });

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl"><Eye size={18} /></div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <span>Chi tiết Timesheet</span>
                <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-mono rounded">{row.projectName}</span>
              </h3>
              <p className="text-[11px] text-slate-300 font-semibold">
                {row.authorName} (@{row.authorKey}) · Tuần {row.week} ({weekRangeLabel(row.week, YEAR)})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white cursor-pointer"><X size={18} /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Tóm tắt */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">PM</span>
              <span className="text-xs font-bold text-slate-700">{row.pm}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Department</span>
              <span className="text-xs font-bold text-slate-700">{row.department}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Time Log</span>
              <span className="text-base font-black text-blue-600 font-mono">{row.timeLog}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Attendance</span>
              <span className="text-base font-black text-slate-700 font-mono">{row.attendance}/5</span>
            </div>
          </div>

          {/* Bảng chi tiết theo ngày */}
          <div className="rounded-2xl border border-slate-200/80 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-2.5">Ngày</th>
                  <th className="px-4 py-2.5 text-right">Giờ log</th>
                  <th className="px-4 py-2.5 text-center">Chấm công</th>
                  <th className="px-4 py-2.5 text-center">Check in</th>
                  <th className="px-4 py-2.5 text-center">Check out</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {days.map((d) => (
                  <tr key={d.date} className="hover:bg-slate-50/60">
                    <td className="px-4 py-2.5 font-semibold text-slate-700">{d.dow} · <span className="font-mono text-slate-500">{d.date}</span></td>
                    <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-800">{d.log}</td>
                    <td className="px-4 py-2.5 text-center">
                      {d.present ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-bold"><Fingerprint size={12} /> Có</span>
                      ) : (
                        <span className="text-rose-500 font-bold">Thiếu</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-center font-mono text-slate-600">{d.present ? '08:15' : '—'}</td>
                    <td className="px-4 py-2.5 text-center font-mono text-slate-600">{d.present ? '17:45' : '—'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200 font-black text-slate-700">
                  <td className="px-4 py-2.5">Tổng tuần</td>
                  <td className="px-4 py-2.5 text-right font-mono">{Math.round(row.timeLog * 10) / 10}</td>
                  <td className="px-4 py-2.5 text-center font-mono">{row.attendance}/5</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer hành động */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold">
            Trạng thái:{' '}
            {row.status === 'REVIEW' && <span className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded-lg border border-sky-200 tracking-wider">REVIEW</span>}
            {row.status === 'APPROVED' && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 tracking-wider">APPROVED</span>}
            {row.status === 'REJECTED' && <span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-lg border border-rose-200 tracking-wider">REJECTED</span>}
          </span>
          {row.status === 'REVIEW' && (
            <div className="flex items-center gap-2">
              <button onClick={onReject} className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
                <Ban size={14} /> Từ chối
              </button>
              <button onClick={onApprove} className="px-3.5 py-2 rounded-xl bg-[#0fa57c] hover:bg-[#0c8e6b] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95">
                <CheckCircle2 size={14} /> Duyệt
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
