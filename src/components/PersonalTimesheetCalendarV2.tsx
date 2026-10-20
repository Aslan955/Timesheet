import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  Info,
  Clock,
  CalendarDays,
  Send,
  Edit2,
  FileText,
  AlertTriangle,
  X,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types & Data ---
type DayStatus = 'HOLIDAY' | 'ON_LEAVE' | 'MISSING' | 'MISMATCH' | 'NOT_SUBMITTED' | 'PARTIAL_SUBMIT' | 'PENDING' | 'REJECTED' | 'APPROVED' | 'OVERDUE_SUBMIT';

interface TimesheetDay {
  dateStr: string; // YYYY-MM-DD
  dayNum: number;
  dayOfWeek: 'T2'|'T3'|'T4'|'T5'|'T6'|'T7'|'CN';
  weekNum: number;
  machineHours: number;
  loggedHours: number;
  status: DayStatus;
  note?: string; // leave type, holiday name
  projects?: { name: string; hours: number; status: DayStatus; pm: string }[];
  isFuture?: boolean;
}

// Generate Mock Data for September 2026 (Month 9)
// Sept 1 is Tuesday.
const mockDays: TimesheetDay[] = [
  // Week 1 (Sept 1 - Sept 6)
  { dateStr: '2026-09-01', dayNum: 1, dayOfWeek: 'T3', weekNum: 1, machineHours: 8.0, loggedHours: 8.0, status: 'APPROVED' },
  { dateStr: '2026-09-02', dayNum: 2, dayOfWeek: 'T4', weekNum: 1, machineHours: 0, loggedHours: 0, status: 'HOLIDAY', note: 'Quốc khánh 2/9' },
  { dateStr: '2026-09-03', dayNum: 3, dayOfWeek: 'T5', weekNum: 1, machineHours: 8.0, loggedHours: 8.0, status: 'APPROVED' },
  { dateStr: '2026-09-04', dayNum: 4, dayOfWeek: 'T6', weekNum: 1, machineHours: 8.2, loggedHours: 8.0, status: 'APPROVED' },
  { dateStr: '2026-09-05', dayNum: 5, dayOfWeek: 'T7', weekNum: 1, machineHours: 0, loggedHours: 0, status: 'HOLIDAY', note: 'Thứ 7' },
  { dateStr: '2026-09-06', dayNum: 6, dayOfWeek: 'CN', weekNum: 1, machineHours: 0, loggedHours: 0, status: 'HOLIDAY', note: 'Chủ nhật' },

  // Week 2 (Sept 7 - Sept 13)
  { dateStr: '2026-09-07', dayNum: 7, dayOfWeek: 'T2', weekNum: 2, machineHours: 4.0, loggedHours: 4.0, status: 'ON_LEAVE', note: 'Nghỉ nửa ngày (Chiều)' },
  { dateStr: '2026-09-08', dayNum: 8, dayOfWeek: 'T3', weekNum: 2, machineHours: 8.1, loggedHours: 8.0, status: 'APPROVED' },
  { dateStr: '2026-09-09', dayNum: 9, dayOfWeek: 'T4', weekNum: 2, machineHours: 8.0, loggedHours: 8.0, status: 'OVERDUE_SUBMIT' },
  { dateStr: '2026-09-10', dayNum: 10, dayOfWeek: 'T5', weekNum: 2, machineHours: 4.0, loggedHours: 2.0, status: 'MISSING', note: 'Nghỉ nửa ngày (Sáng)' },
  { dateStr: '2026-09-11', dayNum: 11, dayOfWeek: 'T6', weekNum: 2, machineHours: 8.0, loggedHours: 8.0, status: 'REJECTED', projects: [{name: 'VTX-CRM', hours: 8, status: 'REJECTED', pm: 'Nguyen Van A'}] },
  { dateStr: '2026-09-12', dayNum: 12, dayOfWeek: 'T7', weekNum: 2, machineHours: 0, loggedHours: 0, status: 'HOLIDAY', note: 'Thứ 7' },
  { dateStr: '2026-09-13', dayNum: 13, dayOfWeek: 'CN', weekNum: 2, machineHours: 0, loggedHours: 0, status: 'HOLIDAY', note: 'Chủ nhật' },

  // Week 3 (Sept 14 - Sept 20)
  { dateStr: '2026-09-14', dayNum: 14, dayOfWeek: 'T2', weekNum: 3, machineHours: 6.5, loggedHours: 8.0, status: 'MISMATCH' },
  { dateStr: '2026-09-15', dayNum: 15, dayOfWeek: 'T3', weekNum: 3, machineHours: 8.0, loggedHours: 4.0, status: 'MISSING' },
  { dateStr: '2026-09-16', dayNum: 16, dayOfWeek: 'T4', weekNum: 3, machineHours: 6.0, loggedHours: 6.0, status: 'MISSING', projects: [
    {name: 'BANK-CORE', hours: 4, status: 'NOT_SUBMITTED', pm: 'Tran Thi B'},
    {name: 'VTX-CRM', hours: 4, status: 'NOT_SUBMITTED', pm: 'Nguyen Van A'}
  ] },
  { dateStr: '2026-09-17', dayNum: 17, dayOfWeek: 'T5', weekNum: 3, machineHours: 0, loggedHours: 0, status: 'MISSING', isFuture: true }, // let's pretend today is Sept 16
  { dateStr: '2026-09-18', dayNum: 18, dayOfWeek: 'T6', weekNum: 3, machineHours: 0, loggedHours: 0, status: 'MISSING', isFuture: true },
  { dateStr: '2026-09-19', dayNum: 19, dayOfWeek: 'T7', weekNum: 3, machineHours: 0, loggedHours: 0, status: 'HOLIDAY', isFuture: true, note: 'Thứ 7' },
  { dateStr: '2026-09-20', dayNum: 20, dayOfWeek: 'CN', weekNum: 3, machineHours: 0, loggedHours: 0, status: 'HOLIDAY', isFuture: true, note: 'Chủ nhật' },

  // Week 4 (Sept 21 - Sept 27)
  { dateStr: '2026-09-21', dayNum: 21, dayOfWeek: 'T2', weekNum: 4, machineHours: 0, loggedHours: 0, status: 'MISSING', isFuture: true },
  { dateStr: '2026-09-22', dayNum: 22, dayOfWeek: 'T3', weekNum: 4, machineHours: 0, loggedHours: 0, status: 'MISSING', isFuture: true },
  { dateStr: '2026-09-23', dayNum: 23, dayOfWeek: 'T4', weekNum: 4, machineHours: 0, loggedHours: 0, status: 'MISSING', isFuture: true },
  { dateStr: '2026-09-24', dayNum: 24, dayOfWeek: 'T5', weekNum: 4, machineHours: 0, loggedHours: 0, status: 'MISSING', isFuture: true },
  { dateStr: '2026-09-25', dayNum: 25, dayOfWeek: 'T6', weekNum: 4, machineHours: 0, loggedHours: 0, status: 'MISSING', isFuture: true },
  { dateStr: '2026-09-26', dayNum: 26, dayOfWeek: 'T7', weekNum: 4, machineHours: 0, loggedHours: 0, status: 'HOLIDAY', isFuture: true, note: 'Thứ 7' },
  { dateStr: '2026-09-27', dayNum: 27, dayOfWeek: 'CN', weekNum: 4, machineHours: 0, loggedHours: 0, status: 'HOLIDAY', isFuture: true, note: 'Chủ nhật' },

  // Week 5 (Sept 28 - Sept 30)
  { dateStr: '2026-09-28', dayNum: 28, dayOfWeek: 'T2', weekNum: 5, machineHours: 0, loggedHours: 0, status: 'MISSING', isFuture: true },
  { dateStr: '2026-09-29', dayNum: 29, dayOfWeek: 'T3', weekNum: 5, machineHours: 0, loggedHours: 0, status: 'MISSING', isFuture: true },
  { dateStr: '2026-09-30', dayNum: 30, dayOfWeek: 'T4', weekNum: 5, machineHours: 0, loggedHours: 0, status: 'MISSING', isFuture: true },
];

const WEEKS = [
  { id: 0, label: 'Cả tháng', range: '01-30/09' },
  { id: 1, label: 'Tuần 1', range: '01-06/09' },
  { id: 2, label: 'Tuần 2', range: '07-13/09' },
  { id: 3, label: 'Tuần 3', range: '14-20/09' },
  { id: 4, label: 'Tuần 4', range: '21-27/09' },
  { id: 5, label: 'Tuần 5', range: '28-30/09' },
];

const STATUS_CONFIG: Record<DayStatus, { label: string; bg: string; border: string; text: string }> = {
  APPROVED: { label: 'Đã duyệt', bg: 'bg-[#e0f2fe]', border: 'border-[#38bdf8]', text: 'text-[#0369a1]' },
  HOLIDAY: { label: 'Ngày nghỉ', bg: 'bg-slate-50', border: 'border-transparent', text: 'text-slate-500' },
  ON_LEAVE: { label: 'Nghỉ phép', bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-600' },
  MISSING: { label: 'Lệch công', bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700' },
  MISMATCH: { label: 'Lệch công', bg: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-700' },
  NOT_SUBMITTED: { label: 'Chưa submit', bg: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-700' },
  PARTIAL_SUBMIT: { label: 'Submit một phần', bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-700' },
  OVERDUE_SUBMIT: { label: 'Quá hạn submit', bg: 'bg-rose-50', border: 'border-rose-500', text: 'text-rose-700' },
  PENDING: { label: 'Chờ duyệt', bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700' },
  REJECTED: { label: 'Bị từ chối', bg: 'bg-red-50', border: 'border-red-600 border-2', text: 'text-red-800' },
};

// Override APPROVED to green
STATUS_CONFIG.APPROVED = { label: 'Đã duyệt', bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-700' };

export const PersonalTimesheetCalendarV2: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(3); // Default week 3 (contains today Sept 16)
  const [popoverDay, setPopoverDay] = useState<TimesheetDay | null>(null);

  // Computed Stats (calculated over ENTIRE month, ignoring week filter)
  const stats = useMemo(() => {
    let totalApproved = 0;
    let missingDays = [];
    let mismatchCount = 0;
    let notSubmittedCount = 0;
    let rejectedCount = 0;
    let overdueSubmitCount = 0;
    let pendingCount = 0;

    mockDays.forEach(d => {
      // BRD 7.1: Công của tôi = SUM(giờ log đã duyệt + chờ duyệt) / 8
      if (d.status === 'APPROVED' || d.status === 'PENDING') {
        totalApproved += d.loggedHours;
      }
      if (d.status === 'PENDING') pendingCount++;
      if (d.status === 'MISSING' && !d.isFuture) missingDays.push(d);
      if (d.status === 'MISMATCH' && !d.isFuture) mismatchCount++;
      if ((d.status === 'NOT_SUBMITTED' || d.status === 'PARTIAL_SUBMIT') && !d.isFuture) notSubmittedCount++;
      if (d.status === 'REJECTED' && !d.isFuture) rejectedCount++;
      if (d.status === 'OVERDUE_SUBMIT' && !d.isFuture) overdueSubmitCount++;
    });

    return {
      totalCong: (totalApproved / 8).toFixed(1).replace('.', ','),
      percent: Math.round((totalApproved / (22 * 8)) * 100), // Assuming 22 working days
      missingCount: missingDays.length,
      missingSample: missingDays.slice(0, 3).map(d => d.dateStr.slice(8,10) + '/' + d.dateStr.slice(5,7)),
      mismatchCount,
      notSubmittedCount,
      rejectedCount,
      overdueSubmitCount,
      pendingCount
    };
  }, []);

  // Filtered Days for Grid
  const gridDays = useMemo(() => {
    if (selectedWeek === 0) return mockDays;
    return mockDays.filter(d => d.weekNum === selectedWeek);
  }, [selectedWeek]);

  const handleAction = (e: React.MouseEvent, action: string, day: TimesheetDay) => {
    e.stopPropagation();
    alert(`Action: ${action} for ${day.dateStr}`);
  };

  return (
    <div className="space-y-4">
      {/* KHỐI A — BỘ LỌC */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <CalendarDays size={18} className="text-slate-500" />
            <select className="font-bold text-slate-800 bg-transparent outline-none cursor-pointer text-sm">
              <option>Tháng 09/2026</option>
              <option>Tháng 08/2026</option>
            </select>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          
          <div className="flex items-center">
              <select 
                className="font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 outline-none cursor-pointer text-sm hover:border-slate-300"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
              >
                {WEEKS.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.label} {w.range ? `(${w.range})` : ''}
                  </option>
                ))}
              </select>
            </div>
        </div>
      </div>

      {/* KHỐI B — THANH CẢNH BÁO (HIỂN THỊ MULTIPLE ALERTS NẾU CÓ) */}
      <div className="flex flex-col gap-2">
                {/* Cảnh báo: Khóa kỳ công */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg flex items-center justify-between text-sm shadow-sm">
          <div className="flex items-center space-x-2 text-blue-800">
            <span className="text-base leading-none mr-1">⏰</span>
            <span>Còn <strong>1 ngày</strong> đến hạn chốt công (<strong>18/09</strong>). Log giờ dự án trễ hạn sẽ bị phạt 20.000đ.</span>
          </div>
        </div>
        
        {/* Cảnh báo: Chưa submit (sẽ phạt tiền) */}
        {stats.notSubmittedCount > 0 && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-r-lg flex items-center justify-between text-sm shadow-sm">
            <div className="flex items-center space-x-3 text-rose-800">
              <AlertCircle size={18} className="text-rose-500" />
              <span>Có <strong className="font-bold">{stats.notSubmittedCount} timesheet</strong> cần Submit. Vui lòng submit ! (Submit muộn sẽ mất 20k tiền phạt)</span>
            </div>
          </div>
        )}

        {/* Cảnh báo: Quá hạn submit (bị khóa) */}
        {stats.overdueSubmitCount > 0 && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-r-lg flex items-center justify-between text-sm shadow-sm">
            <div className="flex items-center space-x-3 text-rose-800">
              <AlertCircle size={18} className="text-rose-500" />
              <span>Bạn có <strong className="font-bold">{stats.overdueSubmitCount} tuần quá hạn submit</strong>. Vui lòng giải trình xin mở khóa.</span>
            </div>
          </div>
        )}
        
        {/* Cảnh báo: Bị từ chối */}
        {stats.rejectedCount > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg flex items-center justify-between text-sm shadow-sm">
            <div className="flex items-center space-x-3 text-red-800">
              <AlertCircle size={18} className="text-red-500" />
              <span><strong className="font-bold">{stats.rejectedCount} tuần công</strong> của bạn bị từ chối, cần log lại.</span>
            </div>
          </div>
        )}

        {/* Cảnh báo: Lệch công */}
        {(stats.missingCount > 0 || stats.mismatchCount > 0) && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r-lg flex items-center justify-between text-sm shadow-sm">
            <div className="flex items-center space-x-3 text-orange-800">
              <AlertTriangle size={18} className="text-orange-500" />
              <span>Bạn còn <strong className="font-bold">{stats.missingCount + stats.mismatchCount} ngày lệch dữ liệu</strong> (thiếu công, lệch giờ) chưa xử lý.</span>
            </div>
          </div>
        )}
      </div>

      {/* KHỐI C — THẺ CHỈ SỐ TỔNG HỢP */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Công của tôi</div>
          <div className="flex items-baseline space-x-1 mb-1">
            <span className="text-2xl font-black text-slate-800">{stats.totalCong}</span>
            <span className="text-xs text-slate-500 font-medium">/ 22 công</span>
          </div>
          <div className="text-xs text-slate-500 mt-auto pt-3 border-t border-slate-200">
            Đạt {stats.percent}% công chuẩn tháng
          </div>
        </div>

        {/* Card 2: Lệch công */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Lệch công</div>
          <div className="flex items-baseline space-x-1 mb-1">
            <span className={`text-2xl font-black ${(stats.missingCount + stats.mismatchCount) > 0 ? 'text-orange-500' : 'text-slate-800'}`}>{stats.missingCount + stats.mismatchCount}</span>
            <span className="text-xs text-slate-500 font-medium">ngày</span>
          </div>
          <div className="text-xs text-slate-500 mt-auto pt-3 border-t border-slate-200">
            {(stats.missingCount + stats.mismatchCount) > 0 ? 'Thiếu công hoặc lệch giờ' : 'Dữ liệu chuẩn xác'}
          </div>
        </div>

        {/* Card 3: Đã log chưa submit */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:border-purple-300 transition-colors">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Đã log chưa submit</div>
          <div className="flex items-baseline space-x-1 mb-1">
            <span className={`text-2xl font-black ${stats.notSubmittedCount > 0 ? 'text-slate-800' : 'text-slate-800'}`}>{stats.notSubmittedCount}</span>
            <span className="text-xs text-slate-500 font-medium">timesheet</span>
          </div>
          <div className="text-xs text-slate-500 mt-auto pt-3 border-t border-slate-200">
            {stats.notSubmittedCount > 0 ? 'Cần gửi duyệt trước 18h Thứ 6' : 'Đã gửi duyệt tất cả'}
          </div>
        </div>

        {/* Card 4: Chưa được approve */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:border-blue-300 transition-colors">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Chờ PM Approve</div>
          <div className="flex items-baseline space-x-1 mb-1">
            <span className={`text-2xl font-black ${stats.pendingCount > 0 ? 'text-blue-500' : 'text-slate-800'}`}>{stats.pendingCount}</span>
            <span className="text-xs text-slate-500 font-medium">timesheet</span>
          </div>
          <div className="text-xs text-slate-500 mt-auto pt-3 border-t border-slate-200">
             {stats.pendingCount > 0 ? 'Đang chờ quản lý duyệt' : 'Không có'}
          </div>
        </div>
        
        {/* Card 5 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:border-rose-300 transition-colors">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Quá hạn submit</div>
          <div className="flex items-baseline space-x-1 mb-1">
            <span className={`text-2xl font-black ${stats.overdueSubmitCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>{stats.overdueSubmitCount}</span>
            <span className="text-xs text-slate-500 font-medium">timesheet</span>
          </div>
          <div className="text-xs text-slate-500 mt-auto pt-3 border-t border-slate-200">
             <span className="text-rose-600">{stats.overdueSubmitCount > 0 ? 'Bị khóa, cần xin mở lại' : 'Không có'}</span>
          </div>
        </div>
      </div>

      {/* KHỐI D — LỊCH CÔNG CHI TIẾT */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden pb-8">
        {/* Calendar Header */}
        <div className="flex bg-slate-50 border-b border-slate-200">
          <div className="grid grid-cols-7 flex-1">
            {['THỨ 2', 'THỨ 3', 'THỨ 4', 'THỨ 5', 'THỨ 6', 'THỨ 7', 'CN'].map((day, i) => (
              <div key={day} className={`py-2 text-center text-[11px] font-bold text-slate-500 ${i < 6 ? 'border-r border-slate-200' : ''}`}>
                {day}
              </div>
            ))}
          </div>
          <div className="w-48 py-2 text-center text-[11px] font-bold text-slate-500 border-l border-slate-200 flex-shrink-0">
            TỔNG KẾT TUẦN
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-slate-200 flex flex-col gap-px border-b border-slate-200">
          {/* Group days by week to render rows */}
          {[1,2,3,4,5].filter(w => selectedWeek === 0 || selectedWeek === w).map(weekNum => {
            const daysInWeek = gridDays.filter(d => d.weekNum === weekNum);
            if (daysInWeek.length === 0) return null;

            // Pad beginning of first week if needed
            const firstDayIndex = ['T2','T3','T4','T5','T6','T7','CN'].indexOf(daysInWeek[0].dayOfWeek);
            const emptyCellsBefore = Array.from({ length: firstDayIndex }).map((_, i) => i);
            
            // Pad end of last week if needed
            const lastDayIndex = ['T2','T3','T4','T5','T6','T7','CN'].indexOf(daysInWeek[daysInWeek.length-1].dayOfWeek);
            const emptyCellsAfter = Array.from({ length: 6 - lastDayIndex }).map((_, i) => i);

            let weekStatus = 'APPROVED';
            if (daysInWeek.some(d => d.status === 'REJECTED') && daysInWeek.some(d => d.status === 'OVERDUE_SUBMIT')) weekStatus = 'OVERDUE_REJECTED'; // Both? Let's just say if there's an overdue and a rejected, maybe it's overdue rejected? Actually, let's look at it differently.
            
            // Let's rely on standard conditions. If user explicitly wants 2 overdue statuses, we can check for REJECTED and OVERDUE_SUBMIT.
            // If the week has OVERDUE_SUBMIT and REJECTED, we call it OVERDUE_REJECTED.
            // If it just has OVERDUE_SUBMIT, OVERDUE_NOT_SUBMIT.
            const hasOverdue = daysInWeek.some(d => d.status === 'OVERDUE_SUBMIT');
            const hasRejected = daysInWeek.some(d => d.status === 'REJECTED');
            
            if (hasOverdue && hasRejected) weekStatus = 'OVERDUE_REJECTED';
            else if (hasOverdue) weekStatus = 'OVERDUE_NOT_SUBMIT';
            else if (hasRejected) weekStatus = 'REJECTED';
            else if (daysInWeek.some(d => d.status === 'NOT_SUBMITTED' || d.status === 'PARTIAL_SUBMIT' || d.status === 'MISSING' || d.status === 'MISMATCH')) weekStatus = 'NOT_SUBMITTED';
            else if (daysInWeek.some(d => d.status === 'PENDING')) weekStatus = 'PENDING';

            return (
              <div key={weekNum} className="flex gap-px bg-slate-200 border-b border-slate-200">
                <div className="grid grid-cols-7 flex-1 gap-px">
                {emptyCellsBefore.map(i => <div key={`empty-b-${i}`} className="bg-white/50 min-h-[140px]"></div>)}
                
                {daysInWeek.map(day => {
                  const conf = STATUS_CONFIG[day.status];
                  const isFaded = day.isFuture;

                  return (
                    <div 
                      key={day.dateStr} 
                      className={`bg-white min-h-[140px] p-2 flex flex-col relative ${isFaded ? 'opacity-50' : ''}`}
                      onMouseEnter={() => day.projects && setPopoverDay(day)}
                      onMouseLeave={() => setPopoverDay(null)}
                    >
                      {/* Date & Badge */}
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-black text-slate-700">{day.dateStr.slice(8,10)}/{day.dateStr.slice(5,7)}</span>
                        {(!isFaded) && (
                          day.status === 'HOLIDAY' ? null :
                          day.status === 'ON_LEAVE' ? <span className="text-[9px] px-1.5 py-0.5 rounded font-bold border bg-emerald-50 border-emerald-400 text-emerald-700">Đủ công</span> :
                          (day.status === 'MISSING' || day.status === 'MISMATCH') ? <span className="text-[9px] px-1.5 py-0.5 rounded font-bold border bg-orange-50 border-orange-400 text-orange-700">Lệch công</span> :
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-bold border bg-emerald-50 border-emerald-400 text-emerald-700">Đủ công</span>
                        )}
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 flex flex-col">
                        {isFaded ? (
                          <div className="text-xs text-slate-400 italic mt-auto mb-auto text-center">Chưa đến ngày</div>
                        ) : day.status === 'HOLIDAY' ? (
                          <div className="text-xs text-slate-500 font-medium text-center mt-auto mb-auto">{day.note}</div>
                        ) : (
                          <div className="flex flex-col flex-1">
                            {day.note ? (
                              <div className="text-[10px] text-slate-600 font-medium text-center bg-slate-100 px-1 py-0.5 rounded border border-slate-200 mb-2">{day.note}</div>
                            ) : null}
                            
                            {/* Projects info (Moved above to keep bottom hours aligned) */}
                            {day.projects && day.projects.length > 1 && (
                              <div className="text-[10px] text-blue-600 font-semibold cursor-help flex items-center gap-1 mb-2">
                                <Info size={12} /> {day.projects.length} dự án đã log
                              </div>
                            )}

                            <div className="mt-auto space-y-2.5 pt-2">
                              {/* Logged Hours */}
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 font-medium">Log jira:</span>
                                <span className="font-bold text-slate-800">{day.loggedHours.toFixed(1)}h</span>
                              </div>
                              
                              {/* Machine Hours */}
                              <div className={`flex items-center justify-between text-xs ${day.status === 'MISMATCH' ? 'text-orange-600' : 'text-slate-500'}`}>
                                <span className="font-medium">Máy chấm:</span>
                                <span className={`font-bold ${day.status === 'MISMATCH' ? '' : 'text-slate-800'}`}>{day.machineHours.toFixed(1)}h</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons removed per user request (read-only mode) */}

                      {/* Popover for Multi-Project (Only shows when hovered & has projects) */}
                      <AnimatePresence>
                        {popoverDay?.dateStr === day.dateStr && day.projects && (
                          <motion.div 
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute z-[100] top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-slate-900 rounded-lg shadow-xl border border-slate-700 p-3 text-white pointer-events-none"
                          >
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-t border-l border-slate-700 rotate-45"></div>
                            <div className="text-xs font-bold mb-2 pb-2 border-b border-slate-700 flex justify-between relative z-10">
                              <span>Chi tiết dự án ({day.dateStr})</span>
                              <span className="text-slate-400">{day.loggedHours}h</span>
                            </div>
                            <div className="space-y-2">
                              {day.projects.map((p, idx) => {
                                const pConf = STATUS_CONFIG[p.status];
                                return (
                                  <div key={idx} className="flex flex-col gap-0.5">
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-xs">{p.name}</span>
                                      <span className="font-mono text-xs">{p.hours}h</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px]">
                                      <span className="text-slate-400">PM: {p.pm}</span>
                                      <span className={`${pConf.text.replace('text-', 'text-')} bg-white/10 px-1 rounded`}>{pConf.label}</span>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  );
                })}

                {emptyCellsAfter.map(i => <div key={`empty-a-${i}`} className="bg-white/50 min-h-[140px]"></div>)}
                </div>

                {/* Weekly Summary Column */}
                <div className="w-48 bg-slate-50/80 p-3 flex flex-col border-l border-slate-200 flex-shrink-0">
                  {(() => {
                     const pastDays = daysInWeek.filter(d => !d.isFuture && d.status !== 'HOLIDAY' && d.status !== 'ON_LEAVE');
                     if (pastDays.length === 0) return <div className="text-slate-400 text-xs italic text-center my-auto">Chưa có dữ liệu</div>;
                     


                     const conf = weekStatus === 'OVERDUE_NOT_SUBMIT' ? { ...STATUS_CONFIG['OVERDUE_SUBMIT'], label: 'Quá hạn (Chưa submit)' } : 
                                  weekStatus === 'OVERDUE_REJECTED' ? { ...STATUS_CONFIG['OVERDUE_SUBMIT'], label: 'Quá hạn (Bị từ chối)' } : 
                                  weekStatus === 'REJECTED' ? STATUS_CONFIG['REJECTED'] : 
                                  weekStatus === 'NOT_SUBMITTED' ? STATUS_CONFIG['NOT_SUBMITTED'] : 
                                  weekStatus === 'PENDING' ? STATUS_CONFIG['PENDING'] : 
                                  STATUS_CONFIG['APPROVED'];

                     const totalWeekHours = daysInWeek.reduce((sum, d) => sum + (d.loggedHours || 0), 0);

                     return (
                       <div className="flex flex-col h-full">
                         <div className="text-center mb-4">
                           <div className="text-xs text-slate-500 mb-1 font-medium group relative inline-block cursor-help border-b border-dashed border-slate-400">
                             Tổng giờ log tuần
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-1.5 bg-slate-800 text-white text-[10px] text-center rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 whitespace-normal">
                               Ghi nhận chấm công tối đa 8h/ngày
                             </div>
                           </div>
                           <div className="text-xl font-black text-slate-800">{totalWeekHours.toFixed(1)}h</div>
                         </div>
                         
                         <div className="flex flex-col gap-2 mt-auto">
                           <div className={`text-center text-[11px] font-bold px-2 py-1.5 rounded-md border ${conf.bg} ${conf.border} ${conf.text} mb-1`}>
                             {conf.label}
                           </div>

                           {(weekStatus === 'OVERDUE_NOT_SUBMIT' || weekStatus === 'OVERDUE_REJECTED') && (
                             <button onClick={(e) => handleAction(e, 'Giải trình xin mở khóa lại', daysInWeek[0])} className="w-full py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-[11px] font-bold rounded shadow-sm flex items-center justify-center gap-1 transition-colors">
    <AlertCircle size={12} /> Giải trình mở khóa
  </button>
                           )}

                           {weekStatus === 'REJECTED' && (
                             <>
                               <button onClick={(e) => handleAction(e, 'Log lại tuần', daysInWeek[0])} className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded shadow-sm flex items-center justify-center transition-colors">
                                 Log lại tuần
                               </button>
                               <button onClick={(e) => handleAction(e, 'Xem lý do', daysInWeek[0])} className="w-full py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-bold rounded flex items-center justify-center transition-colors">
                                 Xem lý do
                               </button>
                             </>
                           )}
                           

                           <button onClick={(e) => handleAction(e, 'Xem chi tiết tuần', daysInWeek[0])} className="w-full py-1.5 text-slate-500 hover:text-blue-600 text-[11px] font-semibold rounded flex items-center justify-center gap-1 transition-colors mt-1">
                               <FileText size={12} /> Xem log
                             </button>
                         </div>
                       </div>
                     )
                  })()}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* KHỐI E — CHÚ THÍCH MÀU (Inside Card Footer to match BRD "dưới khối D") */}
        <div className="bg-white p-3 flex items-center flex-wrap gap-4 text-xs font-medium text-slate-600 border-t border-slate-200">
          <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mr-2">Chú giải:</span>
          
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-50 border border-emerald-400"></div>
            <span>Hợp lệ / Đã duyệt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-white border border-slate-300"></div>
            <span>Chờ duyệt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-purple-50 border border-purple-400"></div>
            <span>Chưa submit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-rose-50 border border-rose-500"></div>
            <span>Quá hạn</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-orange-50 border border-orange-400"></div>
            <span>Lệch công</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-50 border-2 border-red-600"></div>
            <span>Bị từ chối</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-300"></div>
            <span>Nghỉ phép</span>
          </div>
        </div>
      </div>

    </div>
  );
};
