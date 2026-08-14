import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Download,
  Plus,
  X,
  Calendar,
  Grid,
  RefreshCw,
  AlertCircle,
  FileText,
  Check,
  Eye,
  Clock,
  Briefcase,
  User,
  Users,
  ShieldAlert,
  ArrowUpDown,
  FileSpreadsheet,
  Building2,
  Sparkles,
  HelpCircle,
  Layers,
  SlidersHorizontal,
  ChevronDown,
  Info
} from 'lucide-react';
import { MOCK_TIMESHEETS, TimesheetEntry } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { PersonalTimesheetCalendar } from './PersonalTimesheetCalendar';

// ===== Period helpers (Weekly / Monthly filter) =====
const PERIOD_YEAR = 2026;
const TOTAL_WEEKS = 52;

const pad = (n: number) => String(n).padStart(2, '0');
const fmtDate = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

// Monday of a given ISO week number in a given year
const getMondayOfISOWeek = (week: number, year: number): Date => {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay(); // 0 (Sun) .. 6 (Sat)
  const monday = new Date(simple);
  if (dow <= 4) {
    monday.setDate(simple.getDate() - dow + 1);
  } else {
    monday.setDate(simple.getDate() + 8 - dow);
  }
  return monday;
};

const getWeekRangeLabel = (week: number, year: number): string => {
  const monday = getMondayOfISOWeek(week, year);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return `Tuần ${week} (${fmtDate(monday)} - ${fmtDate(sunday)})`;
};

const WEEK_OPTIONS = Array.from({ length: TOTAL_WEEKS }, (_, i) => {
  const week = i + 1;
  return { week, label: getWeekRangeLabel(week, PERIOD_YEAR) };
});

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const month = i + 1;
  return { value: `${PERIOD_YEAR}-${pad(month)}`, label: `Tháng ${pad(month)}/${PERIOD_YEAR}` };
});

const DOW_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// Sinh chi tiết theo ngày (Work Log + Attendance) từ số liệu tổng khi bản ghi chưa có dailyDetails,
// để modal luôn hiển thị đủ 2 bảng cho cả bản ghi theo tuần lẫn theo tháng.
const synthesizeDailyDetails = (entry: TimesheetEntry): NonNullable<TimesheetEntry['dailyDetails']> => {
  const [yStr, mStr] = (entry.month || `${PERIOD_YEAR}-08`).split('-');
  const year = Number(yStr);
  const monthIdx = Number(mStr) - 1;

  // Danh sách ngày làm việc (T2–T6)
  const days: { date: string; dow: string }[] = [];
  if (entry.periodType === 'week') {
    const monday = getMondayOfISOWeek(entry.weekNumber, year);
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push({ date: fmtDate(d), dow: DOW_LABELS[d.getDay()] });
    }
  } else {
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    for (let dd = 1; dd <= daysInMonth; dd++) {
      const d = new Date(year, monthIdx, dd);
      const wd = d.getDay();
      if (wd >= 1 && wd <= 5) days.push({ date: fmtDate(d), dow: DOW_LABELS[wd] });
    }
  }

  const digits = entry.projectCode.replace(/[^0-9]/g, '').slice(0, 7) || '000000';
  const issueKey = `${digits || '012003'}-1143`;
  const summary = '[DEV] Fix bug QLQ';

  let jiraRemain = entry.jiraHours;
  let imisRemain = entry.imisHours;
  let leaveRemain = (entry.leaveDays || 0) * 8;

  return days.map(({ date, dow }) => {
    const jh = Math.max(0, Math.min(8, jiraRemain));
    jiraRemain -= jh;
    const ih = Math.max(0, Math.min(8, imisRemain));
    imisRemain -= ih;
    const lv = Math.max(0, Math.min(8 - ih, leaveRemain));
    leaveRemain -= lv;

    const hasAttendance = ih > 0;
    return {
      date,
      dayOfWeek: dow,
      jiraHours: jh,
      imisHours: ih,
      // Ngày không đủ giờ vân tay: thiếu check-in nhưng vẫn có check-out (giống mẫu)
      checkIn: hasAttendance ? '08:15' : '',
      checkOut: hasAttendance ? '17:45' : '18:30',
      jiraTask: jh > 0 ? `${issueKey}: ${summary}` : undefined,
      leaveHours: lv,
    };
  });
};

export const TimesheetPage: React.FC = () => {
  // Main View Switcher: 'Personal Calendar' (Check cá nhân) vs 'Manager Approval' (Duyệt dự án)
  const [mainViewMode, setMainViewMode] = useState<'Personal Calendar' | 'Manager Approval'>('Personal Calendar');
  
  // Data State
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(MOCK_TIMESHEETS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Filter States
  const [viewPeriodMode, setViewPeriodMode] = useState<'week' | 'month'>('week');
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>(32);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]); // rỗng = tất cả dự án
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [selectedComparison, setSelectedComparison] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // UI States
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('10/08/2026 09:30:15');
  const [selectedDetailEntry, setSelectedDetailEntry] = useState<TimesheetEntry | null>(null);
  const [selectedExplanationEntry, setSelectedExplanationEntry] = useState<TimesheetEntry | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Explanation Form State
  const [explanationText, setExplanationText] = useState('');
  const [attachedTicket, setAttachedTicket] = useState('ON-8821');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Extract unique project codes for dropdown filter
  const uniqueProjects = useMemo(() => {
    const list = Array.from(new Set(timesheets.map(t => t.projectCode)));
    return list;
  }, [timesheets]);

  // Filter Logic
  const filteredTimesheets = useMemo(() => {
    return timesheets.filter(item => {
      // Period filter
      if (viewPeriodMode === 'week' && item.periodType !== 'week') return false;
      if (viewPeriodMode === 'month' && item.periodType !== 'month') return false;

      // Week number filter (only meaningful in week mode)
      if (viewPeriodMode === 'week' && selectedWeek !== 'all' && item.weekNumber !== selectedWeek) return false;

      // Month filter (only meaningful in month mode)
      if (viewPeriodMode === 'month' && item.month !== selectedMonth) return false;

      // Project filter (multi-select; rỗng = tất cả)
      if (selectedProjects.length > 0 && !selectedProjects.includes(item.projectCode)) return false;

      // Comparison status filter
      if (selectedComparison === 'MATCH' && item.comparisonStatus !== 'MATCH') return false;
      if (selectedComparison === 'DEFICIT' && item.comparisonStatus !== 'DISCREPANCY_DEFICIT') return false;
      if (selectedComparison === 'SURPLUS' && item.comparisonStatus !== 'DISCREPANCY_SURPLUS') return false;
      if (selectedComparison === 'NEEDS_EXPLANATION' && item.explanationStatus !== 'NEEDS_EXPLANATION') return false;

      // Status filter
      if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;

      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesProject = item.projectCode.toLowerCase().includes(query) || item.projectName.toLowerCase().includes(query);
        const matchesAuthor = item.authorName.toLowerCase().includes(query) || item.authorKey.toLowerCase().includes(query);
        const matchesNote = item.explanationNote?.toLowerCase().includes(query) || false;
        return matchesProject || matchesAuthor || matchesNote;
      }

      return true;
    });
  }, [timesheets, viewPeriodMode, selectedWeek, selectedMonth, selectedProjects, selectedComparison, selectedStatus, searchTerm]);

  // Totals calculations
  const totalJiraHours = filteredTimesheets.reduce((acc, curr) => acc + curr.jiraHours, 0);
  const totalImisHours = filteredTimesheets.reduce((acc, curr) => acc + curr.imisHours, 0);
  const totalPendingReview = filteredTimesheets.filter(t => t.status === 'REVIEW').length;

  // Toggle Checkbox logic
  const isAllSelected = filteredTimesheets.length > 0 && filteredTimesheets.every(t => selectedIds.includes(t.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTimesheets.map(t => t.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  // Actions
  const handleApproveSelected = () => {
    if (selectedIds.length === 0) {
      showToast('⚠️ Vui lòng chọn ít nhất 1 bản ghi timesheet để phê duyệt!');
      return;
    }
    setTimesheets(prev => prev.map(t => selectedIds.includes(t.id) ? { ...t, status: 'APPROVED' } : t));
    showToast(`✅ Đã phê duyệt thành công ${selectedIds.length} bản ghi Timesheet được chọn!`);
    setSelectedIds([]);
  };

  const handleRejectSelected = () => {
    if (selectedIds.length === 0) {
      showToast('⚠️ Vui lòng chọn ít nhất 1 bản ghi timesheet để từ chối!');
      return;
    }
    setTimesheets(prev => prev.map(t => selectedIds.includes(t.id) ? { ...t, status: 'REJECTED' } : t));
    showToast(`⛔ Đã từ chối ${selectedIds.length} bản ghi Timesheet!`);
    setSelectedIds([]);
  };

  const handleSyncJira = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const nowStr = new Date().toLocaleString('vi-VN');
      setLastSyncTime(nowStr);
      showToast('🔄 Đã đồng bộ dữ liệu Timesheet mới nhất từ Jira sang hệ thống Imis!');
    }, 1200);
  };

  const handleSaveExplanation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExplanationEntry) return;

    setTimesheets(prev => prev.map(t => {
      if (t.id === selectedExplanationEntry.id) {
        return {
          ...t,
          explanationStatus: 'PENDING_EXPLANATION',
          explanationNote: `Giải trình mới gửi: ${explanationText} (Đính kèm đơn ${attachedTicket})`,
          hasEvidenceDoc: true
        };
      }
      return t;
    }));

    showToast(`📝 Đã gửi giải trình chấm công cho bản ghi ${selectedExplanationEntry.projectCode} thành công!`);
    setSelectedExplanationEntry(null);
    setExplanationText('');
  };

  const handleExportXLSX = () => {
    const count = selectedIds.length > 0 ? selectedIds.length : filteredTimesheets.length;
    showToast(`📥 Đã xuất dữ liệu ${count} bản ghi Timesheet ra file Timesheet_Imis_Jira_2026.xlsx!`);
  };

  // Sinh dữ liệu Timesheet mẫu để test danh sách / bộ lọc / KPI
  const handleAutoFillSampleData = () => {
    const sampleProjects = [
      { code: 'V.26.G.FX.103.66.S', name: 'Hệ thống Quản lý Dự án V26 Core' },
      { code: 'X.25.NB.ADB', name: 'Ứng dụng Ngân hàng Điện tử ADB' },
      { code: '022.060.2', name: 'Chuyển đổi số Tỉnh Đồng Nai' },
      { code: '838.168.2', name: 'Nền tảng Tích hợp Dữ liệu Quốc gia' },
      { code: 'V.25.G.RD.C12.43', name: 'Nghiên cứu AI & Học máy' },
      { code: 'H99.212.2', name: 'Hệ thống Smart City & Traffic' },
      { code: 'ICU.565', name: 'Phần mềm Quản lý Bệnh viện' },
    ];
    const sampleAuthors = [
      { name: 'Nguyễn Văn An', key: 'annv', dept: 'Software Development' },
      { name: 'Trần Thị Bích', key: 'bichtt', dept: 'Quality Assurance' },
      { name: 'Lê Hoàng Cường', key: 'cuonglh', dept: 'Software Development' },
      { name: 'Phạm Thu Dung', key: 'dungpt', dept: 'Business Analysis' },
      { name: 'Vũ Minh Đức', key: 'ducvm', dept: 'DevOps' },
      { name: 'Đỗ Thị Hà', key: 'hadt', dept: 'Software Development' },
      { name: 'Hoàng Văn Kiên', key: 'kienhv', dept: 'Software Development' },
      { name: 'Ngô Thị Lan', key: 'lannt', dept: 'Quality Assurance' },
    ];
    const comparisons: TimesheetEntry['comparisonStatus'][] = ['MATCH', 'DISCREPANCY_DEFICIT', 'DISCREPANCY_SURPLUS'];
    const statuses: TimesheetEntry['status'][] = ['REVIEW', 'APPROVED', 'REJECTED', 'REVIEW'];
    const rnd = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const round1 = (n: number) => Math.round(n * 10) / 10;

    const stamp = Date.now();
    const generated: TimesheetEntry[] = Array.from({ length: 8 }, (_, i) => {
      const proj = rnd(sampleProjects);
      const author = rnd(sampleAuthors);
      const comparisonStatus = rnd(comparisons);
      const isMonth = i % 4 === 3; // ~1/4 là bản ghi theo tháng
      const baseHours = isMonth ? 176 : 40;

      let imisHours = baseHours;
      let jiraHours = baseHours;
      if (comparisonStatus === 'DISCREPANCY_DEFICIT') jiraHours = round1(baseHours - (isMonth ? 12 : 4.5));
      if (comparisonStatus === 'DISCREPANCY_SURPLUS') jiraHours = round1(baseHours + (isMonth ? 8 : 3.0));
      const differenceHours = round1(jiraHours - imisHours);

      const needsExplanation = comparisonStatus !== 'MATCH';
      const explanationStatus: TimesheetEntry['explanationStatus'] = needsExplanation
        ? rnd(['NEEDS_EXPLANATION', 'PENDING_EXPLANATION', 'EXPLAINED_APPROVED'])
        : 'NOT_NEEDED';
      const status = rnd(statuses);

      return {
        id: `TS-GEN-${stamp}-${i}`,
        projectCode: proj.code,
        projectName: proj.name,
        authorName: author.name,
        authorKey: author.key,
        department: author.dept,
        periodType: isMonth ? 'month' : 'week',
        periodName: isMonth ? 'Tháng 08/2026' : 'Tuần 32 (03/08/2026 - 09/08/2026)',
        month: '2026-08',
        weekNumber: 32,
        jiraHours,
        imisHours,
        leaveDays: 0,
        submitDate: '08/08/2026 17:30',
        approvalRejectDate: status === 'REVIEW' ? '-' : '09/08/2026 09:15',
        differenceHours,
        comparisonStatus,
        explanationStatus,
        explanationNote: needsExplanation ? '(Dữ liệu test) Lệch giờ giữa Jira và vân tay Imis, cần giải trình.' : undefined,
        hasEvidenceDoc: needsExplanation && Math.random() > 0.5,
        status,
        lastSyncTime: '10/08/2026 08:30',
      };
    });

    setTimesheets(prev => [...generated, ...prev]);
    showToast(`✨ Đã tạo ${generated.length} bản ghi Timesheet mẫu để test!`);
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-50/50 min-h-screen space-y-5 font-sans select-none">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center space-x-3 text-xs font-bold pointer-events-auto"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#0fa57c] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Switcher Bar: Personal Calendar vs Manager Approval */}
      <div className="bg-slate-900 text-white p-2.5 px-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-300">Chế độ xem:</span>
          <div className="flex bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setMainViewMode('Personal Calendar')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                mainViewMode === 'Personal Calendar' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar size={14} />
              <span>Lịch Check Timesheet Cá Nhân</span>
            </button>
            <button
              onClick={() => setMainViewMode('Manager Approval')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                mainViewMode === 'Manager Approval' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users size={14} />
              <span>Duyệt Timesheet Dự Án (Manager)</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-semibold flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#0fa57c]" />
          <span>Tài khoản cá nhân: <strong className="text-white font-bold">Nguyễn Hoàng (NV0101)</strong></span>
        </div>
      </div>

      {mainViewMode === 'Personal Calendar' ? (
        <PersonalTimesheetCalendar />
      ) : (
        <>
          {/* 1. Breadcrumb & Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-3 border-b border-slate-200/80">
        <div>
          <div className="flex items-center text-xs text-slate-500 mb-1 space-x-1.5 font-medium">
            <Grid size={13} className="text-slate-400" />
            <span>Home</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span>Timekeeping</span>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-900 font-bold">Timesheet Approval</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <span>Quản Lý & Phê Duyệt Timesheet (Jira & Imis)</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-200">
              Đồng bộ Imis v4.2
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Đối chiếu số giờ log Jira với số giờ chấm công máy vân tay Imis, hỗ trợ xem theo tuần/tháng & quản lý giải trình.
          </p>
        </div>

        {/* Sync Jira & Sync Time */}
        <div className="flex flex-col items-stretch sm:items-end gap-1.5">
          <button
            onClick={handleSyncJira}
            disabled={isSyncing}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin text-[#0fa57c]' : 'text-[#0fa57c]'} />
            <span>{isSyncing ? 'Đang đồng bộ Jira...' : 'Đồng bộ từ Jira'}</span>
          </button>

          <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <Clock size={13} className="text-slate-400" />
            <span>Lần đồng bộ gần nhất: <strong className="text-slate-700 font-mono">{lastSyncTime}</strong></span>
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTROLS & FILTER TOOLBAR (RE-DESIGNED FOR WEEKLY/MONTHLY & PROJECT SEARCH) */}
      <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">

        {/* Row 1: View Period Switcher (Week vs Month) + Date Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          
          {/* Mode Tabs: Theo Tuần / Theo Tháng */}
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Kỳ xem</span>
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => { setViewPeriodMode('week'); setSelectedWeek(32); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewPeriodMode === 'week' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar size={13} />
              <span>Theo Tuần</span>
            </button>
            <button
              onClick={() => { setViewPeriodMode('month'); setSelectedWeek('all'); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewPeriodMode === 'month' ? 'bg-white text-[#0fa57c] shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calendar size={13} />
              <span>Theo Tháng</span>
            </button>
            </div>
          </div>

          {/* Date Range Navigation Control */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (viewPeriodMode === 'week') setSelectedWeek(32);
                else if (viewPeriodMode === 'month') setSelectedMonth('2026-08');
              }}
              className="px-2.5 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Hôm nay
            </button>
            <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl text-xs font-bold text-slate-700">
              <button
                onClick={() => {
                  if (viewPeriodMode === 'week') {
                    const cur = selectedWeek === 'all' ? 32 : selectedWeek;
                    setSelectedWeek(Math.max(1, cur - 1));
                  } else if (viewPeriodMode === 'month') {
                    const idx = MONTH_OPTIONS.findIndex(m => m.value === selectedMonth);
                    if (idx > 0) setSelectedMonth(MONTH_OPTIONS[idx - 1].value);
                  }
                }}
                className="text-slate-400 hover:text-slate-700 p-0.5"
              >
                <ChevronLeft size={14} />
              </button>

              {viewPeriodMode === 'week' ? (
                <select
                  value={selectedWeek === 'all' ? 32 : selectedWeek}
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  className="bg-transparent px-1 font-mono font-bold text-slate-700 outline-none cursor-pointer"
                >
                  {WEEK_OPTIONS.map(w => (
                    <option key={w.week} value={w.week}>{w.label}</option>
                  ))}
                </select>
              ) : (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent px-1 font-mono font-bold text-slate-700 outline-none cursor-pointer"
                >
                  {MONTH_OPTIONS.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              )}

              <button
                onClick={() => {
                  if (viewPeriodMode === 'week') {
                    const cur = selectedWeek === 'all' ? 32 : selectedWeek;
                    setSelectedWeek(Math.min(TOTAL_WEEKS, cur + 1));
                  } else if (viewPeriodMode === 'month') {
                    const idx = MONTH_OPTIONS.findIndex(m => m.value === selectedMonth);
                    if (idx < MONTH_OPTIONS.length - 1) setSelectedMonth(MONTH_OPTIONS[idx + 1].value);
                  }
                }}
                className="text-slate-400 hover:text-slate-700 p-0.5"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Streamlined Filter Toolbar with compact select dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">

          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            <Filter size={12} />
            Bộ lọc
          </span>

          {/* FILTER 1: PROJECT MULTI-SELECT (dạng select, tag hiển thị bên trong) */}
          <div className="relative">
            <div
              onClick={() => setIsProjectDropdownOpen(o => !o)}
              className={`flex items-center gap-1.5 flex-wrap bg-slate-50 border rounded-xl px-2.5 py-1.5 min-h-[34px] max-w-lg transition-all cursor-pointer ${
                isProjectDropdownOpen || selectedProjects.length > 0 ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Briefcase size={13} className="text-blue-600 shrink-0" />
              {selectedProjects.length === 0 ? (
                <span className="text-xs font-bold text-slate-500">Tất cả Dự Án ({uniqueProjects.length})</span>
              ) : (
                selectedProjects.map(code => (
                  <span
                    key={code}
                    className="flex items-center gap-1 pl-1.5 pr-1 py-0.5 bg-blue-100 border border-blue-200 rounded text-[10px] font-bold text-blue-700"
                  >
                    <span className="font-mono">{code}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProjects(prev => prev.filter(c => c !== code)); }}
                      className="text-blue-400 hover:text-blue-700 cursor-pointer"
                      title="Bỏ chọn dự án này"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))
              )}
              <ChevronDown size={13} className={`ml-auto text-slate-400 shrink-0 transition-transform ${isProjectDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isProjectDropdownOpen && (
              <>
                {/* click-outside overlay */}
                <div className="fixed inset-0 z-20" onClick={() => setIsProjectDropdownOpen(false)} />
                <div className="absolute left-0 top-full mt-1.5 z-30 w-80 max-h-72 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg p-1.5">
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chọn dự án</span>
                    {selectedProjects.length > 0 && (
                      <button
                        onClick={() => setSelectedProjects([])}
                        className="text-[10px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                      >
                        Bỏ chọn tất cả
                      </button>
                    )}
                  </div>
                  {uniqueProjects.map(code => {
                    const checked = selectedProjects.includes(code);
                    const proj = timesheets.find(t => t.projectCode === code);
                    return (
                      <label
                        key={code}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setSelectedProjects(prev =>
                            prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
                          )}
                          className="accent-blue-600 cursor-pointer"
                        />
                        <span className="font-mono font-bold text-[11px] text-blue-700 shrink-0">{code}</span>
                        <span className="text-[11px] text-slate-500 truncate">{proj?.projectName}</span>
                      </label>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* FILTER 3: APPROVAL STATUS DROPDOWN */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 hover:border-slate-300 transition-all">
            <CheckCircle2 size={13} className="text-indigo-600 mr-1.5 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-1"
            >
              <option value="all">Tất cả trạng thái duyệt</option>
              <option value="REVIEW">REVIEW (Chờ duyệt)</option>
              <option value="APPROVED">APPROVED (Đã duyệt)</option>
              <option value="REJECTED">REJECTED (Từ chối)</option>
            </select>
          </div>

          {/* SEARCH BOX */}
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm mã dự án, nhân viên, key..."
              className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={13} />
              </button>
            )}
          </div>

          {/* RIGHT CLUSTER: cố định, không nhảy vị trí */}
          <div className="ml-auto flex items-center gap-2.5 shrink-0">
            {/* CLEAR FILTERS BUTTON (luôn hiển thị, mờ khi không có bộ lọc) */}
            {(() => {
              const hasActiveFilters = selectedProjects.length > 0 || selectedComparison !== 'all' || selectedStatus !== 'all' || searchTerm !== '';
              return (
                <button
                  onClick={() => {
                    setSelectedProjects([]);
                    setSelectedComparison('all');
                    setSelectedStatus('all');
                    setSearchTerm('');
                  }}
                  disabled={!hasActiveFilters}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                    hasActiveFilters
                      ? 'text-rose-600 bg-rose-50 hover:bg-rose-100 cursor-pointer'
                      : 'text-slate-400 bg-slate-50 border border-slate-200 cursor-not-allowed opacity-60'
                  }`}
                >
                  <X size={13} />
                  <span>Xóa bộ lọc</span>
                </button>
              );
            })()}

            {/* QUICK STAT / FILTER: Timesheet cần duyệt */}
            <button
              onClick={() => setSelectedStatus(s => s === 'REVIEW' ? 'all' : 'REVIEW')}
              title="Lọc nhanh các timesheet đang chờ duyệt"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                selectedStatus === 'REVIEW'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Clock size={14} className={selectedStatus === 'REVIEW' ? 'text-white' : 'text-amber-600'} />
              <span>Cần duyệt</span>
              <span className={`font-mono font-black px-1.5 rounded ${
                selectedStatus === 'REVIEW' ? 'bg-white/20' : 'bg-amber-100'
              }`}>{totalPendingReview}</span>
            </button>
          </div>

        </div>

      </div>

      {/* 5. Bulk Action Toolbar (When rows selected) */}
      <div className="flex items-center justify-between bg-white p-3.5 px-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleApproveSelected}
            className="flex items-center text-xs text-[#0fa57c] font-bold hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition-all cursor-pointer active:scale-95"
          >
            <CheckCircle2 size={15} className="mr-1.5" />
            <span>Approve Selection</span>
          </button>
          <button
            onClick={handleRejectSelected}
            className="flex items-center text-xs text-rose-600 font-bold hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition-all cursor-pointer active:scale-95"
          >
            <XCircle size={15} className="mr-1.5" />
            <span>Reject Selection</span>
          </button>

          {selectedIds.length > 0 && (
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
              Đã chọn <strong className="text-blue-600 font-mono">{selectedIds.length}</strong> bản ghi
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAutoFillSampleData}
            title="Tự động sinh dữ liệu Timesheet mẫu để test"
            className="px-3.5 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-dashed border-violet-300 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Sparkles size={15} className="text-violet-600" />
            <span>Auto Fill Dữ Liệu Mẫu</span>
          </button>

          <button
            onClick={handleExportXLSX}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <FileSpreadsheet size={15} className="text-emerald-600" />
            <span>Export XLSX</span>
          </button>
        </div>
      </div>

      {/* 6. REDESIGNED DATA GRID TABLE WITH ALL REQUESTED COLUMNS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        
        <div className="p-3.5 px-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">
            Danh Sách Bản Ghi Timesheet Đồng Bộ Imis ({filteredTimesheets.length} bản ghi)
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Kéo / Chọn tiêu đề cột để lọc nhanh
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center border-r border-slate-200">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 w-10 text-center border-r border-slate-200">#</th>
                <th className="py-3 px-4 border-r border-slate-200">Dự Án (ProjectName)</th>
                <th className="py-3 px-4 border-r border-slate-200">Tác Giả (Author / Key)</th>
                <th className="py-3 px-3 text-center border-r border-slate-200">Kỳ Hạn</th>
                <th className="py-3 px-3 text-center border-r border-slate-200">Giờ Jira</th>
                <th className="py-3 px-3 text-center border-r border-slate-200">Giờ Vân Tay</th>
                <th className="py-3 px-3 text-center border-r border-slate-200">Ngày Phép</th>
                <th className="py-3 px-3 text-center border-r border-slate-200">Submit Date</th>
                <th className="py-3 px-3 text-center border-r border-slate-200">Approval / Reject Date</th>
                <th className="py-3 px-3 text-center border-r border-slate-200">Status</th>
                <th className="py-3 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredTimesheets.map((item, idx) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr 
                    key={item.id} 
                    className={`transition-colors group ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/80'}`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-3 text-center border-r border-slate-100">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(item.id)}
                        className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
                      />
                    </td>

                    {/* STT */}
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-400 border-r border-slate-100">
                      {idx + 1}
                    </td>

                    {/* PROJECT NAME & CODE */}
                    <td className="py-3.5 px-4 border-r border-slate-100">
                      <div className="space-y-0.5">
                        <div className="font-mono font-black text-blue-600 text-xs hover:underline cursor-pointer flex items-center gap-1.5">
                          <span>{item.projectCode}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-slate-700 line-clamp-1">
                          {item.projectName}
                        </div>
                      </div>
                    </td>

                    {/* AUTHOR & USERKEY */}
                    <td className="py-3.5 px-4 border-r border-slate-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center border border-slate-300 shrink-0">
                          {item.authorName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-xs">{item.authorName}</div>
                          <div className="text-[10px] font-mono text-slate-400 font-bold">
                            @{item.authorKey}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* PERIOD */}
                    <td className="py-3.5 px-3 text-center border-r border-slate-100 font-medium text-slate-600">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.periodType === 'week' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {item.periodType === 'week' ? `Tuần ${item.weekNumber}` : `Tháng ${item.month.split('-')[1]}`}
                      </span>
                    </td>

                    {/* JIRA HOURS */}
                    <td className="py-3.5 px-3 text-center border-r border-slate-100 font-mono font-black text-slate-800">
                      {item.jiraHours.toFixed(1)}h
                    </td>

                    {/* IMIS HOURS */}
                    <td className="py-3.5 px-3 text-center border-r border-slate-100 font-mono font-black text-slate-700">
                      {item.imisHours.toFixed(1)}h
                    </td>

                    {/* NGÀY PHÉP */}
                    <td className="py-3.5 px-3 text-center border-r border-slate-100 font-mono">
                      {item.leaveDays && item.leaveDays > 0 ? (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-md text-[11px] font-black">
                          {item.leaveDays.toFixed(1)} ngày
                        </span>
                      ) : (
                        <span className="text-slate-300 font-normal">0</span>
                      )}
                    </td>

                    {/* SUBMIT DATE */}
                    <td className="py-3.5 px-3 text-center border-r border-slate-100 font-mono text-[11px] text-slate-600 font-medium">
                      {item.submitDate || '-'}
                    </td>

                    {/* APPROVAL / REJECT DATE */}
                    <td className="py-3.5 px-3 text-center border-r border-slate-100 font-mono text-[11px] text-slate-600 font-medium">
                      {item.approvalRejectDate && item.approvalRejectDate !== '-' ? (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200/80 font-bold">
                          {item.approvalRejectDate}
                        </span>
                      ) : (
                        <span className="text-slate-300 font-normal">-</span>
                      )}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="py-3.5 px-3 text-center border-r border-slate-100">
                      {item.status === 'REVIEW' && (
                        <span className="px-2.5 py-1 bg-sky-100 text-sky-700 text-[10px] font-black rounded-lg border border-sky-200 tracking-wider">
                          REVIEW
                        </span>
                      )}
                      {item.status === 'APPROVED' && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-lg border border-emerald-200 tracking-wider">
                          APPROVED
                        </span>
                      )}
                      {item.status === 'REJECTED' && (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-[10px] font-black rounded-lg border border-rose-200 tracking-wider">
                          REJECTED
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => setSelectedDetailEntry(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Xem chi tiết đối chiếu theo ngày"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => {
                            setTimesheets(prev => prev.map(t => t.id === item.id ? { ...t, status: 'APPROVED' } : t));
                            showToast(`✅ Đã phê duyệt Timesheet ${item.projectCode}!`);
                          }}
                          className="p-1.5 text-[#0fa57c] hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Phê duyệt nhanh"
                        >
                          <CheckCircle2 size={15} />
                        </button>

                        <button
                          onClick={() => {
                            setTimesheets(prev => prev.map(t => t.id === item.id ? { ...t, status: 'REJECTED' } : t));
                            showToast(`⛔ Đã từ chối Timesheet ${item.projectCode}!`);
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Từ chối"
                        >
                          <XCircle size={15} />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}

              {filteredTimesheets.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-medium">
                    Không tìm thấy dữ liệu Timesheet phù hợp với điều kiện lọc!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3.5 px-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex border border-slate-200 rounded-xl overflow-hidden divide-x divide-slate-200 bg-white">
            <button className="p-1.5 text-slate-400 hover:bg-slate-50 cursor-pointer"><ChevronsLeft size={14} /></button>
            <button className="p-1.5 text-slate-400 hover:bg-slate-50 cursor-pointer"><ChevronLeft size={14} /></button>
            <button className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white">1</button>
            <button className="p-1.5 text-slate-400 hover:bg-slate-50 cursor-pointer"><ChevronRight size={14} /></button>
            <button className="p-1.5 text-slate-400 hover:bg-slate-50 cursor-pointer"><ChevronsRight size={14} /></button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Hiển thị:</span>
            <select className="border border-slate-200 rounded-xl px-2 py-1 outline-none font-bold bg-white cursor-pointer">
              <option>30 dòng / trang</option>
              <option>50 dòng / trang</option>
              <option>100 dòng / trang</option>
            </select>
          </div>
        </div>

      </div>

      {/* MODAL 1: CHI TIẾT ĐỐI CHIẾU TIMESHEET THEO NGÀY */}
      <AnimatePresence>
        {selectedDetailEntry && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetailEntry(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 text-white rounded-xl">
                    <Eye size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Đối Chiếu Chấm Công Chi Tiết</span>
                      <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-mono rounded">
                        {selectedDetailEntry.projectCode}
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-300 font-semibold">
                      Nhân sự: {selectedDetailEntry.authorName} (@{selectedDetailEntry.authorKey}) • {selectedDetailEntry.periodName}
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedDetailEntry(null)} className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                {/* Summary Info */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 grid grid-cols-5 gap-2 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Giờ Jira</span>
                    <span className="text-base font-black text-blue-600 font-mono">{selectedDetailEntry.jiraHours}h</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Giờ Vân Tay</span>
                    <span className="text-base font-black text-emerald-600 font-mono">{selectedDetailEntry.imisHours}h</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Chênh Lệch</span>
                    <span className={`text-base font-black font-mono ${
                      selectedDetailEntry.differenceHours === 0 ? 'text-[#0fa57c]' : 'text-rose-600'
                    }`}>
                      {selectedDetailEntry.differenceHours === 0 ? 'Khớp 100%' : `${selectedDetailEntry.differenceHours.toFixed(1)}h`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Submit Date</span>
                    <span className="text-xs font-bold text-slate-700 font-mono block mt-1">{selectedDetailEntry.submitDate || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Approval/Reject Date</span>
                    <span className="text-xs font-bold text-slate-700 font-mono block mt-1">{selectedDetailEntry.approvalRejectDate || '-'}</span>
                  </div>
                </div>

                {/* Explanation Note Banner if present */}
                {selectedDetailEntry.explanationNote && (
                  <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-start space-x-2.5">
                    <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-blue-800 uppercase block">Thông tin giải trình đi kèm:</span>
                      <p className="text-xs font-semibold text-blue-900 mt-0.5">
                        {selectedDetailEntry.explanationNote}
                      </p>
                    </div>
                  </div>
                )}

                {/* Work Log & Attendance Tables (dạng form đối chiếu) */}
                {(() => {
                  // Có sẵn dailyDetails thì dùng; nếu không (bản ghi theo tháng / auto-fill) thì tự sinh từ số liệu tổng.
                  const details = (selectedDetailEntry.dailyDetails && selectedDetailEntry.dailyDetails.length > 0)
                    ? selectedDetailEntry.dailyDetails
                    : synthesizeDailyDetails(selectedDetailEntry);
                  if (!details || details.length === 0) {
                    return (
                      <div className="p-6 text-center text-slate-400 border border-dashed border-slate-300 rounded-xl">
                        Không có dữ liệu chi tiết cho kỳ {selectedDetailEntry.periodName}.
                      </div>
                    );
                  }

                  // Flatten thành các dòng Work Log (1 dòng / 1 task / 1 ngày)
                  const workLog: { date: string; issueKey: string; summary: string; description: string; hours: number }[] = [];
                  details.forEach(day => {
                    if (day.tasks && day.tasks.length > 0) {
                      day.tasks.forEach(t => workLog.push({
                        date: day.date,
                        issueKey: t.key,
                        summary: t.title || '-',
                        description: `Working on issue ${t.key}`,
                        hours: t.hours,
                      }));
                    } else if (day.jiraTask) {
                      const [k, ...rest] = day.jiraTask.split(':');
                      const key = k.trim();
                      workLog.push({
                        date: day.date,
                        issueKey: key,
                        summary: rest.join(':').trim() || '-',
                        description: `Working on issue ${key}`,
                        hours: day.jiraHours,
                      });
                    }
                  });
                  const workLogSum = workLog.reduce((a, r) => a + r.hours, 0);

                  // Các dòng Attendance (1 dòng / ngày)
                  const attendance = details.map(day => {
                    const inRaw = day.checkIn && day.checkIn !== '00:00' ? day.checkIn : '';
                    const outRaw = day.checkOut && day.checkOut !== '00:00' ? day.checkOut : '';
                    const total = day.imisHours;
                    let status: string;
                    if (!inRaw && outRaw) status = 'Missing check-in';
                    else if (inRaw && !outRaw) status = 'Missing check-out';
                    else if (total >= 8) status = 'Full attendance';
                    else if (total > 0) status = 'Partial attendance';
                    else status = 'No attendance';
                    return {
                      date: day.date,
                      workMode: day.note && day.note.toLowerCase().includes('onsite') ? 'Onsite' : 'HQ',
                      checkIn: inRaw || '-',
                      checkOut: outRaw || '-',
                      totalHour: total,
                      leaveHour: day.leaveHours ?? 0,
                      status,
                    };
                  });
                  const attendanceSum = attendance.reduce((a, r) => a + r.totalHour, 0);

                  return (
                    <>
                      {/* WORK LOG */}
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Work Log</h4>
                        <div className="border border-slate-200 rounded-xl overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[640px]">
                            <thead>
                              <tr className="bg-slate-100 text-[10px] font-extrabold text-slate-400 uppercase">
                                <th className="py-2.5 px-3 whitespace-nowrap">Work Date</th>
                                <th className="py-2.5 px-3 whitespace-nowrap">Issue Key</th>
                                <th className="py-2.5 px-3">Issue Summary</th>
                                <th className="py-2.5 px-3">Description</th>
                                <th className="py-2.5 px-3 text-right whitespace-nowrap">Hours</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-medium">
                              {workLog.map((r, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                  <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">{r.date}</td>
                                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">{r.issueKey}</td>
                                  <td className="py-2.5 px-3 text-slate-700">{r.summary}</td>
                                  <td className="py-2.5 px-3 text-slate-500">{r.description}</td>
                                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800 whitespace-nowrap">{r.hours}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-slate-50 border-t-2 border-slate-200 text-xs font-black text-slate-700">
                                <td className="py-2 px-3" colSpan={4}>Sum</td>
                                <td className="py-2 px-3 text-right font-mono text-blue-700">{workLogSum}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      {/* ATTENDANCE */}
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Attendance</h4>
                        <div className="border border-slate-200 rounded-xl overflow-x-auto">
                          <table className="w-full text-left border-collapse min-w-[720px]">
                            <thead>
                              <tr className="bg-slate-100 text-[10px] font-extrabold text-slate-400 uppercase">
                                <th className="py-2.5 px-3 whitespace-nowrap">Work Date</th>
                                <th className="py-2.5 px-3 whitespace-nowrap">Work Mode</th>
                                <th className="py-2.5 px-3 whitespace-nowrap">Check In</th>
                                <th className="py-2.5 px-3 whitespace-nowrap">Check Out</th>
                                <th className="py-2.5 px-3 text-right whitespace-nowrap">Total Hour</th>
                                <th className="py-2.5 px-3 text-right whitespace-nowrap">Leave Hour</th>
                                <th className="py-2.5 px-3 whitespace-nowrap">Issue Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs font-medium">
                              {attendance.map((r, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                  <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">{r.date}</td>
                                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{r.workMode}</td>
                                  <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">{r.checkIn}</td>
                                  <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">{r.checkOut}</td>
                                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">{r.totalHour}</td>
                                  <td className="py-2.5 px-3 text-right font-mono text-slate-500 whitespace-nowrap">{r.leaveHour}</td>
                                  <td className="py-2.5 px-3 whitespace-nowrap">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                      r.status === 'Full attendance' ? 'bg-emerald-50 text-emerald-700' :
                                      r.status === 'Partial attendance' ? 'bg-amber-50 text-amber-700' :
                                      r.status.startsWith('Missing') ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                                    }`}>{r.status}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-slate-50 border-t-2 border-slate-200 text-xs font-black text-slate-700">
                                <td className="py-2 px-3" colSpan={4}>Sum</td>
                                <td className="py-2 px-3 text-right font-mono text-emerald-700">{attendanceSum}</td>
                                <td className="py-2 px-3" colSpan={2}></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </>
                  );
                })()}

              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end space-x-3">
                <button
                  onClick={() => setSelectedDetailEntry(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: GỬI GIẢI TRÌNH CHẤM CÔNG (EXPLANATION FORM) */}
      <AnimatePresence>
        {selectedExplanationEntry && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExplanationEntry(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10"
            >
              <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-rose-500 text-white rounded-xl">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Tạo Đơn Giải Trình Chấm Công</h3>
                    <p className="text-[10px] text-slate-300 font-semibold">
                      Dự án: {selectedExplanationEntry.projectCode} • Lệch {selectedExplanationEntry.differenceHours}h
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedExplanationEntry(null)} className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveExplanation} className="p-6 space-y-4 text-xs">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between font-bold text-rose-700">
                  <span>Mức độ lệch dữ liệu đối chiếu:</span>
                  <span className="font-mono text-sm">{selectedExplanationEntry.differenceHours.toFixed(1)}h</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Đính kèm Đơn xin phép liên quan (Onsite / WFH / OT)
                  </label>
                  <select
                    value={attachedTicket}
                    onChange={(e) => setAttachedTicket(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="ON-8821">Đơn đi công tác Khách hàng #ON-8821 (Đã duyệt)</option>
                    <option value="WFH-9010">Đơn Làm việc từ xa #WFH-9010 (Đã duyệt)</option>
                    <option value="OT-4412">Đơn Làm thêm giờ OT #OT-4412 (Đã duyệt)</option>
                    <option value="NONE">Không có đơn (Bổ sung giải trình thủ công)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Nội dung giải trình chi tiết *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={explanationText}
                    onChange={(e) => setExplanationText(e.target.value)}
                    placeholder="Nhập lý do chênh lệch giữa giờ quẹt thẻ và giờ log Jira (e.g., Đi họp khách hàng ADB, sự cố máy chấm công, quên quẹt thẻ...)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedExplanationEntry(null)}
                    className="px-4 py-2 text-slate-500 font-bold hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    Gửi giải trình
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: CREATE TASK FORM FOR STAFFING TAB */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs" 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Create New Staffing Task Form</h3>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Project *</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-800 bg-slate-50">
                      <option value="">Choose project</option>
                      {uniqueProjects.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Staffing User *</label>
                    <input type="text" placeholder="Enter username..." className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold bg-slate-50" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                  <textarea rows={3} placeholder="Job description..." className="w-full px-3 py-2 border border-slate-200 rounded-xl font-medium bg-slate-50 resize-none" />
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl">
                  Cancel
                </button>
                <button onClick={() => { setIsCreateModalOpen(false); showToast('✅ Đã tạo task staffing thành công!'); }} className="px-6 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md">
                  Create Task
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

        </>
      )}

    </div>
  );
};

export default TimesheetPage;
