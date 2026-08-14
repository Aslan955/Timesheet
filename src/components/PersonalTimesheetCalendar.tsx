import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  RotateCcw, 
  Plus, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar as CalendarIcon, 
  FileText, 
  Briefcase, 
  User, 
  Check, 
  XCircle, 
  Info, 
  FileSpreadsheet,
  RefreshCw,
  Send,
  SlidersHorizontal,
  Star,
  Sliders,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Interfaces for Quan Ly Cong Calendar
export interface DayCellData {
  dateStr: string; // "2026-05-04"
  dayNum: number;
  monthNum: number;
  dayOfWeek: 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'CN';
  weekNum: number; // e.g. 18, 19, 20, 21, 22
  shiftCode: string; // e.g. "HC44", "HC44/2", "NT"
  checkIn: string; // "08:07" or "00:00"
  checkOut: string; // "17:11" or "00:00"
  checkInHours: number; // e.g. 8.0, 7.3, 0
  jiraLoggedHours: number; // e.g. 8.0, 7.0, 5.5
  congValue: string; // "1 công", "0.91 công", "0.78 công", "0.5 công", "0 công"
  statusNote?: string; // "Ngày nghỉ bù lễ;", "Không đủ giờ công", "Thiếu log Jira", "Không có dữ liệu chấm công"
  isHoliday?: boolean;
  isWeekend?: boolean;
  isFuture?: boolean;
  isToday?: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED' | 'DRAFT';
  projects: string[];
  worklogs?: {
    id: string;
    jiraTicket: string;
    projectCode: string;
    description: string;
    hours: number;
    timeLogged: string;
  }[];
}

export const PersonalTimesheetCalendar: React.FC = () => {
  // Current Selected Month/Year
  const [currentMonth, setCurrentMonth] = useState(5); // Tháng 5
  const [currentYear, setCurrentYear] = useState(2026);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [filterDraft, setFilterDraft] = useState(true);
  const [filterConfirmed, setFilterConfirmed] = useState(true);
  const [filterFullWork, setFilterFullWork] = useState(true);
  const [filterMissingWork, setFilterMissingWork] = useState(true);

  // Side Widget Visibility
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  // Selected Day for Detail Drawer
  const [selectedDay, setSelectedDay] = useState<DayCellData | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Log Modal inside drawer
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState('VTX-108');
  const [newHours, setNewHours] = useState('1.5');
  const [newDesc, setNewDesc] = useState('');

  // Attendance explanation (Giải trình chấm công) form inside drawer
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [explainCheckIn, setExplainCheckIn] = useState('08:00');
  const [explainCheckOut, setExplainCheckOut] = useState('17:30');
  const [explainNote, setExplainNote] = useState('');

  // Quick Explanation Modal
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [explanationNote, setExplanationNote] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Mock Days Data for Tháng 5 / 2026 (exact replica style of user screenshot)
  const [daysData, setDaysData] = useState<DayCellData[]>([
    // Week 18 (End of April / Early May)
    { dateStr: '2026-04-27', dayNum: 27, monthNum: 4, dayOfWeek: 'T2', weekNum: 18, shiftCode: 'HC44', checkIn: '08:00', checkOut: '17:30', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', isHoliday: true, statusNote: 'Ngày nghỉ bù lễ;', status: 'APPROVED', projects: ['VTX-CRM'] },
    { dateStr: '2026-04-28', dayNum: 28, monthNum: 4, dayOfWeek: 'T3', weekNum: 18, shiftCode: 'HC44', checkIn: '08:07', checkOut: '17:11', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', status: 'APPROVED', projects: ['BANK-CORE'] },
    { dateStr: '2026-04-29', dayNum: 29, monthNum: 4, dayOfWeek: 'T4', weekNum: 18, shiftCode: 'HC44', checkIn: '08:12', checkOut: '18:03', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', status: 'APPROVED', projects: ['VTX-CRM'] },
    { dateStr: '2026-04-30', dayNum: 30, monthNum: 4, dayOfWeek: 'T5', weekNum: 18, shiftCode: 'HC44', checkIn: '00:00', checkOut: '00:00', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', isHoliday: true, statusNote: 'Ngày lễ;', status: 'APPROVED', projects: [] },
    { dateStr: '2026-05-01', dayNum: 1, monthNum: 5, dayOfWeek: 'T6', weekNum: 18, shiftCode: 'HC44', checkIn: '00:00', checkOut: '00:00', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', isHoliday: true, statusNote: 'Ngày lễ;', status: 'APPROVED', projects: [] },
    { dateStr: '2026-05-02', dayNum: 2, monthNum: 5, dayOfWeek: 'T7', weekNum: 18, shiftCode: 'HC44/2', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0.5 công', isWeekend: true, status: 'APPROVED', projects: [] },
    { dateStr: '2026-05-03', dayNum: 3, monthNum: 5, dayOfWeek: 'CN', weekNum: 18, shiftCode: 'NT', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', isWeekend: true, status: 'APPROVED', projects: [] },

    // Week 19
    { 
      dateStr: '2026-05-04', dayNum: 4, monthNum: 5, dayOfWeek: 'T2', weekNum: 19, shiftCode: 'HC44', 
      checkIn: '08:50', checkOut: '17:07', checkInHours: 7.3, jiraLoggedHours: 6.5, congValue: '0.91 công', 
      status: 'DRAFT', projects: ['VTX-CRM'],
      worklogs: [
        { id: 'w1', jiraTicket: 'VTX-101', projectCode: 'VTX-CRM', description: 'Phát triển màn hình Quản lý công V2', hours: 6.5, timeLogged: '08:50 - 16:20' }
      ]
    },
    { 
      dateStr: '2026-05-05', dayNum: 5, monthNum: 5, dayOfWeek: 'T3', weekNum: 19, shiftCode: 'HC44', 
      checkIn: '08:10', checkOut: '17:13', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', 
      status: 'APPROVED', projects: ['BANK-CORE'],
      worklogs: [
        { id: 'w2', jiraTicket: 'BANK-201', projectCode: 'BANK-CORE', description: 'Tích hợp API thanh toán QRCode và chữ ký số', hours: 8.0, timeLogged: '08:10 - 17:13' }
      ]
    },
    { 
      dateStr: '2026-05-06', dayNum: 6, monthNum: 5, dayOfWeek: 'T4', weekNum: 19, shiftCode: 'HC44', 
      checkIn: '08:05', checkOut: '17:06', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', 
      status: 'APPROVED', projects: ['VTX-CRM'],
      worklogs: [
        { id: 'w3', jiraTicket: 'VTX-102', projectCode: 'VTX-CRM', description: 'Tối ưu hoá truy vấn SQL lịch chấm công', hours: 8.0, timeLogged: '08:05 - 17:06' }
      ]
    },
    { 
      dateStr: '2026-05-07', dayNum: 7, monthNum: 5, dayOfWeek: 'T5', weekNum: 19, shiftCode: 'HC44', 
      checkIn: '08:13', checkOut: '17:18', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', 
      status: 'APPROVED', projects: ['BANK-CORE'] 
    },
    { 
      dateStr: '2026-05-08', dayNum: 8, monthNum: 5, dayOfWeek: 'T6', weekNum: 19, shiftCode: 'HC44', 
      checkIn: '08:14', checkOut: '17:16', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', 
      status: 'APPROVED', projects: ['VTX-CRM'] 
    },
    { dateStr: '2026-05-09', dayNum: 9, monthNum: 5, dayOfWeek: 'T7', weekNum: 19, shiftCode: 'HC44/2', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0.5 công', isWeekend: true, status: 'APPROVED', projects: [] },
    { dateStr: '2026-05-10', dayNum: 10, monthNum: 5, dayOfWeek: 'CN', weekNum: 19, shiftCode: 'NT', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', isWeekend: true, status: 'APPROVED', projects: [] },

    // Week 20
    { 
      dateStr: '2026-05-11', dayNum: 11, monthNum: 5, dayOfWeek: 'T2', weekNum: 20, shiftCode: 'HC44', 
      checkIn: '08:16', checkOut: '17:19', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', 
      status: 'APPROVED', projects: ['VTX-CRM'] 
    },
    { 
      dateStr: '2026-05-12', dayNum: 12, monthNum: 5, dayOfWeek: 'T3', weekNum: 20, shiftCode: 'HC44', 
      checkIn: '08:19', checkOut: '17:22', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', 
      status: 'APPROVED', projects: ['BANK-CORE'] 
    },
    { 
      dateStr: '2026-05-13', dayNum: 13, monthNum: 5, dayOfWeek: 'T4', weekNum: 20, shiftCode: 'HC44', 
      checkIn: '08:23', checkOut: '15:39', checkInHours: 6.2, jiraLoggedHours: 6.0, congValue: '0.78 công', 
      status: 'DRAFT', projects: ['VTX-CRM'],
      worklogs: [
        { id: 'w4', jiraTicket: 'VTX-103', projectCode: 'VTX-CRM', description: 'Về sớm do việc cá nhân (đã nộp đơn phép 2h)', hours: 6.0, timeLogged: '08:23 - 15:39' }
      ]
    },
    { 
      dateStr: '2026-05-14', dayNum: 14, monthNum: 5, dayOfWeek: 'T5', weekNum: 20, shiftCode: 'HC44', 
      checkIn: '08:12', checkOut: '17:19', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', 
      status: 'APPROVED', projects: ['BANK-CORE'] 
    },
    { 
      dateStr: '2026-05-15', dayNum: 15, monthNum: 5, dayOfWeek: 'T6', weekNum: 20, shiftCode: 'HC44', 
      checkIn: '08:08', checkOut: '17:21', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', 
      status: 'APPROVED', projects: ['VTX-CRM'] 
    },
    { 
      dateStr: '2026-05-16', dayNum: 16, monthNum: 5, dayOfWeek: 'T7', weekNum: 20, shiftCode: 'HC44/2', 
      checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', 
      statusNote: 'Không có dữ liệu chấm công', isWeekend: true, status: 'APPROVED', projects: [] 
    },
    { dateStr: '2026-05-17', dayNum: 17, monthNum: 5, dayOfWeek: 'CN', weekNum: 20, shiftCode: 'NT', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', isWeekend: true, status: 'APPROVED', projects: [] },

    // Week 21
    { 
      dateStr: '2026-05-18', dayNum: 18, monthNum: 5, dayOfWeek: 'T2', weekNum: 21, shiftCode: 'HC44', 
      checkIn: '08:16', checkOut: '17:18', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', 
      status: 'APPROVED', projects: ['VTX-CRM'] 
    },
    { 
      dateStr: '2026-05-19', dayNum: 19, monthNum: 5, dayOfWeek: 'T3', weekNum: 21, shiftCode: 'HC44', 
      checkIn: '08:08', checkOut: '17:51', checkInHours: 8.0, jiraLoggedHours: 8.0, congValue: '1 công', 
      status: 'APPROVED', projects: ['BANK-CORE'] 
    },
    { 
      dateStr: '2026-05-20', dayNum: 20, monthNum: 5, dayOfWeek: 'T4', weekNum: 21, shiftCode: 'HC44', 
      checkIn: '09:37', checkOut: '17:08', checkInHours: 6.5, jiraLoggedHours: 8.0, congValue: '0.82 công', 
      isToday: true, status: 'DRAFT', projects: ['VTX-CRM'],
      worklogs: [
        { id: 'w5', jiraTicket: 'VTX-105', projectCode: 'VTX-CRM', description: 'Đang làm việc hôm nay (Đã log 8.0h trên Jira)', hours: 8.0, timeLogged: '08:30 - 17:30' }
      ]
    },
    { 
      dateStr: '2026-05-21', dayNum: 21, monthNum: 5, dayOfWeek: 'T5', weekNum: 21, shiftCode: 'HC44', 
      checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', 
      statusNote: 'Không có dữ liệu chấm công', status: 'DRAFT', projects: [] 
    },
    { dateStr: '2026-05-22', dayNum: 22, monthNum: 5, dayOfWeek: 'T6', weekNum: 21, shiftCode: 'HC44', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', isFuture: true, status: 'DRAFT', projects: [] },
    { dateStr: '2026-05-23', dayNum: 23, monthNum: 5, dayOfWeek: 'T7', weekNum: 21, shiftCode: 'HC44/2', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', isWeekend: true, isFuture: true, status: 'DRAFT', projects: [] },
    { dateStr: '2026-05-24', dayNum: 24, monthNum: 5, dayOfWeek: 'CN', weekNum: 21, shiftCode: 'NT', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', isWeekend: true, isFuture: true, status: 'DRAFT', projects: [] },

    // Week 22
    { dateStr: '2026-05-25', dayNum: 25, monthNum: 5, dayOfWeek: 'T2', weekNum: 22, shiftCode: 'HC44', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', isFuture: true, status: 'DRAFT', projects: [] },
    { dateStr: '2026-05-26', dayNum: 26, monthNum: 5, dayOfWeek: 'T3', weekNum: 22, shiftCode: 'HC44', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', isFuture: true, status: 'DRAFT', projects: [] },
    { dateStr: '2026-05-27', dayNum: 27, monthNum: 5, dayOfWeek: 'T4', weekNum: 22, shiftCode: 'HC44', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', isFuture: true, status: 'DRAFT', projects: [] },
    { dateStr: '2026-05-28', dayNum: 28, monthNum: 5, dayOfWeek: 'T5', weekNum: 22, shiftCode: 'HC44', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', isFuture: true, status: 'DRAFT', projects: [] },
    { dateStr: '2026-05-29', dayNum: 29, monthNum: 5, dayOfWeek: 'T6', weekNum: 22, shiftCode: 'HC44', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', isFuture: true, status: 'DRAFT', projects: [] },
    { dateStr: '2026-05-30', dayNum: 30, monthNum: 5, dayOfWeek: 'T7', weekNum: 22, shiftCode: 'HC44/2', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', isWeekend: true, isFuture: true, status: 'DRAFT', projects: [] },
    { dateStr: '2026-05-31', dayNum: 31, monthNum: 5, dayOfWeek: 'CN', weekNum: 22, shiftCode: 'NT', checkIn: '00:00', checkOut: '00:00', checkInHours: 0, jiraLoggedHours: 0, congValue: '0 công', isWeekend: true, isFuture: true, status: 'DRAFT', projects: [] },
  ]);

  // Filtered Days
  const filteredDays = useMemo(() => {
    return daysData.filter(d => {
      // Search term filter
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchNote = d.statusNote?.toLowerCase().includes(query);
        const matchShift = d.shiftCode.toLowerCase().includes(query);
        const matchProj = d.projects.some(p => p.toLowerCase().includes(query));
        if (!matchNote && !matchShift && !matchProj) return false;
      }

      // Check-in & Jira match status filters
      const isFull = d.checkInHours >= 8.0 && d.jiraLoggedHours >= 8.0;
      const isMissing = (d.checkInHours < 8.0 || d.jiraLoggedHours < 8.0) && !d.isFuture && !d.isHoliday && !d.isWeekend;

      if (!filterFullWork && isFull) return false;
      if (!filterMissingWork && isMissing) return false;

      // Status filters
      if (!filterDraft && d.status === 'DRAFT') return false;
      if (!filterConfirmed && d.status === 'APPROVED') return false;

      return true;
    });
  }, [daysData, searchTerm, filterFullWork, filterMissingWork, filterDraft, filterConfirmed]);

  // Calculate Cell Color Logic strictly as user requested:
  // - Nếu số giờ check in/out >= 8 VÀ số giờ log Jira >= 8 => ĐỦ CÔNG (Mint green bg)
  // - Nếu số giờ check in/out < 8 HOẶC số giờ log Jira < 8 => THIẾU CÔNG (Yellow/lime bg like screenshot)
  const getCellStyling = (day: DayCellData) => {
    if (day.isFuture) {
      return {
        bg: 'bg-white',
        border: 'border-slate-200/60',
        text: 'text-slate-400',
        noteColor: 'text-slate-400'
      };
    }

    if (day.isHoliday) {
      return {
        bg: 'bg-[#d1fae5]', // Mint green for holiday with 1 cong
        border: 'border-emerald-200',
        text: 'text-emerald-900',
        noteColor: 'text-emerald-800'
      };
    }

    // Check if full work (both checkIn >= 8h and jira >= 8h)
    const isFull = day.checkInHours >= 8.0 && day.jiraLoggedHours >= 8.0;
    const isNoData = day.checkIn === '00:00' && day.checkOut === '00:00' && day.jiraLoggedHours === 0;

    if (isNoData) {
      if (day.isWeekend) {
        return {
          bg: 'bg-[#e6f4ea]/50',
          border: 'border-emerald-100',
          text: 'text-emerald-800',
          noteColor: 'text-emerald-700'
        };
      }
      return {
        bg: 'bg-[#fef9c3]', // Yellow for missing data/missing công
        border: 'border-amber-300',
        text: 'text-amber-950',
        noteColor: 'text-amber-800 font-bold'
      };
    }

    if (isFull) {
      // Green background like user's mint green cells
      return {
        bg: 'bg-[#d1fae5] hover:bg-[#bbf7d0]',
        border: 'border-emerald-300/80',
        text: 'text-emerald-900',
        noteColor: 'text-emerald-800 font-medium'
      };
    } else {
      // Yellow background for "Không đủ giờ công" (matches user image!)
      return {
        bg: 'bg-[#fef9c3] hover:bg-[#fef08a]',
        border: 'border-amber-300',
        text: 'text-amber-950',
        noteColor: 'text-amber-900 font-bold'
      };
    }
  };

  const handleAddWorklog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) return;

    const addedHours = parseFloat(newHours) || 0;
    const newLog = {
      id: Date.now().toString(),
      jiraTicket: newTicket,
      projectCode: selectedDay.projects[0] || 'VTX-CRM',
      description: newDesc || 'Bổ sung giờ công cá nhân',
      hours: addedHours,
      timeLogged: '16:00 - 17:30'
    };

    const updatedJira = selectedDay.jiraLoggedHours + addedHours;
    const isNowFull = selectedDay.checkInHours >= 8.0 && updatedJira >= 8.0;

    // Mutate state locally
    setDaysData(prev => prev.map(d => {
      if (d.dateStr === selectedDay.dateStr) {
        const existingLogs = d.worklogs || [];
        return {
          ...d,
          jiraLoggedHours: updatedJira,
          statusNote: isNowFull ? undefined : 'Thiếu log Jira',
          worklogs: [...existingLogs, newLog]
        };
      }
      return d;
    }));

    setSelectedDay(prev => prev ? {
      ...prev,
      jiraLoggedHours: updatedJira,
      statusNote: isNowFull ? undefined : 'Thiếu log Jira',
      worklogs: [...(prev.worklogs || []), newLog]
    } : null);

    showToast(`✅ Đã thêm ${addedHours}h công cho ticket ${newTicket} thành công!`);
    setIsAddLogOpen(false);
    setNewDesc('');
  };

  // Compute worked hours from check-in/out (minus 1h lunch break, capped at 8.0)
  const computeWorkedHours = (checkIn: string, checkOut: string): number => {
    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);
    if ([inH, inM, outH, outM].some(n => Number.isNaN(n))) return 0;
    const diff = (outH * 60 + outM) - (inH * 60 + inM);
    const worked = diff / 60 - 1; // trừ 1h nghỉ trưa
    return Math.max(0, Math.min(8, Math.round(worked * 10) / 10));
  };

  const handleExplainAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) return;

    const newCheckInHours = computeWorkedHours(explainCheckIn, explainCheckOut);
    const isNowFull = newCheckInHours >= 8.0 && selectedDay.jiraLoggedHours >= 8.0;

    setDaysData(prev => prev.map(d => {
      if (d.dateStr === selectedDay.dateStr) {
        return {
          ...d,
          checkIn: explainCheckIn,
          checkOut: explainCheckOut,
          checkInHours: newCheckInHours,
          statusNote: isNowFull ? undefined : (explainNote || 'Đã giải trình chấm công'),
        };
      }
      return d;
    }));

    setSelectedDay(prev => prev ? {
      ...prev,
      checkIn: explainCheckIn,
      checkOut: explainCheckOut,
      checkInHours: newCheckInHours,
      statusNote: isNowFull ? undefined : (explainNote || 'Đã giải trình chấm công'),
    } : null);

    showToast(`📝 Đã giải trình chấm công ${explainCheckIn} - ${explainCheckOut} (${newCheckInHours}h)!`);
    setIsExplainOpen(false);
    setExplainNote('');
  };

  return (
    <div className="p-3 sm:p-5 bg-[#f3f4f6] min-h-screen space-y-4 font-sans select-none text-slate-800">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[120] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-3 text-xs font-bold pointer-events-auto"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#0fa57c] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HEADER BAR MATCHING USER SCREENSHOT EXACTLY */}
      <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        
        {/* Left: Title + Navigation Buttons (< Hôm nay >) + View Mode Switcher */}
        <div className="flex items-center flex-wrap gap-3">
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Quản lý công (tháng 5 2026)</span>
          </h1>

          {/* Red Action Navigation Buttons (Exact style from user image!) */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => showToast('📅 Đã chuyển về tháng 4/2026')}
              className="px-2 py-1 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-md text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
              title="Tháng trước"
            >
              <ChevronLeft size={16} />
            </button>

            <button 
              onClick={() => showToast('📍 Đã nhảy đến ngày hôm nay (20/05/2026)')}
              className="px-3 py-1 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-md text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Hôm nay
            </button>

            <button 
              onClick={() => showToast('📅 Đã chuyển sang tháng 6/2026')}
              className="px-2 py-1 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-md text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
              title="Tháng sau"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Right: Search + Filter Tools + Favorites + Toggle Sidebar */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-medium">
          
          {/* Search Box with Search Icon button */}
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm..." 
              className="pl-2.5 pr-7 py-1 bg-white border border-slate-300 rounded-md text-xs text-slate-800 outline-none focus:border-slate-500 w-36 sm:w-48"
            />
            <button className="absolute right-1 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5">
              <Search size={14} />
            </button>
          </div>

          {/* Advanced Search Button */}
          <button 
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-md flex items-center space-x-1 cursor-pointer"
          >
            <Sliders size={13} className="text-slate-500" />
            <span>Tìm kiếm nâng cao</span>
          </button>


          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setShowRightSidebar(!showRightSidebar)}
            className="p-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md text-slate-700 cursor-pointer ml-1"
            title="Toggle Sidebar"
          >
            <ChevronRight size={16} className={`transition-transform ${showRightSidebar ? '' : 'rotate-180'}`} />
          </button>

        </div>

      </div>

      {/* ADVANCED FILTER DRAWER / PANEL IF TOGGLED */}
      {showAdvancedFilter && (
        <div className="p-3 bg-white border border-slate-300 rounded-xl space-y-2 text-xs">
          <div className="font-bold text-slate-800 flex items-center justify-between">
            <span>Bộ lọc nâng cao theo Giờ Check In / Log Jira:</span>
            <button onClick={() => setShowAdvancedFilter(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
          </div>
          <div className="flex items-center flex-wrap gap-4">
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filterFullWork} 
                onChange={e => setFilterFullWork(e.target.checked)} 
                className="rounded text-emerald-600 focus:ring-emerald-500" 
              />
              <span className="font-semibold text-emerald-900 bg-[#d1fae5] px-2 py-0.5 rounded">Đủ công (CheckIn ≥ 8h & Jira ≥ 8h)</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filterMissingWork} 
                onChange={e => setFilterMissingWork(e.target.checked)} 
                className="rounded text-amber-600 focus:ring-amber-500" 
              />
              <span className="font-semibold text-amber-950 bg-[#fef9c3] px-2 py-0.5 rounded">Thiếu công (&lt;8h CheckIn/Jira)</span>
            </label>
          </div>
        </div>
      )}

      {/* MAIN LAYOUT: CALENDAR GRID + RIGHT SIDEBAR (MATCHING SCREENSHOT) */}
      <div className="flex gap-3 items-start">
        
        {/* CALENDAR MATRIX GRID (LEFT MAIN SECTION) */}
        <div className="flex-1 bg-white border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
          
          {/* HEADER ROW FOR DAYS OF WEEK */}
          <div className="grid grid-cols-[38px_repeat(7,1fr)] bg-slate-100 border-b border-slate-300 text-xs font-bold text-slate-600 text-center py-1.5">
            <div className="border-r border-slate-300 text-slate-400 font-mono">W</div>
            <div className="border-r border-slate-200">T2</div>
            <div className="border-r border-slate-200">T3</div>
            <div className="border-r border-slate-200">T4</div>
            <div className="border-r border-slate-200">T5</div>
            <div className="border-r border-slate-200">T6</div>
            <div className="border-r border-slate-200 text-slate-500">T7</div>
            <div className="text-slate-500">CN</div>
          </div>

          {/* GRID WEEKS ROWS (W 18 to W 22) */}
          <div className="divide-y divide-slate-300 text-xs">
            {[18, 19, 20, 21, 22].map((weekNum) => {
              const weekDays = filteredDays.filter(d => d.weekNum === weekNum);

              return (
                <div key={weekNum} className="grid grid-cols-[38px_repeat(7,1fr)] min-h-[92px]">
                  
                  {/* Left Column: Week Number (W 18, 19, 20...) */}
                  <div className="bg-slate-100 border-r border-slate-300 text-slate-500 font-mono font-bold text-xs flex items-start justify-center pt-2">
                    {weekNum}
                  </div>

                  {/* 7 Days Columns */}
                  {weekDays.map((day) => {
                    const style = getCellStyling(day);

                    return (
                      <div
                        key={day.dateStr}
                        onClick={() => setSelectedDay(day)}
                        className={`p-1.5 border-r border-slate-300 transition-all cursor-pointer relative flex flex-col justify-between ${style.bg} hover:brightness-95`}
                      >
                        {/* Top Line: Day Number on right */}
                        <div className="flex items-start justify-end text-[11px] leading-tight">
                          <span className={`font-bold font-mono text-xs ${day.isToday ? 'bg-blue-600 text-white px-1.5 rounded-full' : ''}`}>
                            {day.dayNum}
                          </span>
                        </div>

                        {/* Middle Line: Check In - Check Out Time OR Special Note */}
                        <div className="my-1 text-center font-mono text-[11px] font-bold leading-tight">
                          {day.isHoliday ? (
                            <div className="text-[10px] font-semibold text-emerald-900">
                              {day.statusNote || 'Ngày nghỉ lễ;'}
                            </div>
                          ) : (
                            <div>
                              {day.checkIn} - {day.checkOut}
                            </div>
                          )}
                        </div>

                        {/* Bottom Lines: Cong value & Jira Logged hours */}
                        <div className="text-center text-[10px] space-y-0.5 leading-tight">
                          <div className="font-semibold">
                            {day.congValue}
                            {day.jiraLoggedHours > 0 && (
                              <span className="ml-1 opacity-80 font-mono text-[9px] font-bold">
                                ({day.jiraLoggedHours}h log)
                              </span>
                            )}
                          </div>

                          {/* Warning / Status Note */}
                          {day.statusNote && !day.isHoliday && day.statusNote !== 'Không đủ giờ công' && (
                            <div className={`text-[10px] ${style.noteColor}`}>
                              {day.statusNote}
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}

                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT SIDEBAR WIDGET (MATCHING USER SCREENSHOT EXACTLY) */}
        {showRightSidebar && (
          <div className="w-56 shrink-0 space-y-3">
            
            {/* MINI CALENDAR BOX */}
            <div className="bg-white p-3 rounded-lg border border-slate-300 shadow-2xs text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <div className="flex items-center space-x-1">
                  <button className="p-0.5 hover:bg-slate-100 rounded cursor-pointer"><ChevronLeft size={14} /></button>
                  <span>Th05 2026</span>
                  <button className="p-0.5 hover:bg-slate-100 rounded cursor-pointer"><ChevronRight size={14} /></button>
                </div>
                <button onClick={() => setShowRightSidebar(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={14} />
                </button>
              </div>

              {/* Mini Grid Header */}
              <div className="grid grid-cols-7 text-center font-bold text-[10px] text-slate-500 border-b border-slate-200 pb-1">
                <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>CN</span>
              </div>

              {/* Mini Days Grid */}
              <div className="grid grid-cols-7 text-center text-[10px] gap-y-1 font-mono">
                <span className="text-slate-300">27</span><span className="text-slate-300">28</span><span className="text-slate-300">29</span><span className="text-slate-300">30</span>
                <span>1</span><span>2</span><span>3</span>
                <span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
                <span>11</span><span>12</span><span>13</span><span>14</span><span>15</span><span>16</span><span>17</span>
                <span>18</span><span>19</span><span className="bg-slate-900 text-white font-bold rounded-full">20</span><span>21</span><span>22</span><span>23</span><span>24</span>
                <span>25</span><span>26</span><span>27</span><span>28</span><span>29</span><span>30</span><span>31</span>
              </div>
            </div>

            {/* TRẠNG THÁI FILTER BOX (MATCHING SCREENSHOT) */}
            <div className="bg-white p-3 rounded-lg border border-slate-300 shadow-2xs text-xs space-y-2">
              <h3 className="font-bold text-slate-800 uppercase text-[11px] tracking-tight border-b border-slate-200 pb-1">
                Trạng thái
              </h3>

              <div className="space-y-1.5 font-medium">
                <label className="flex items-center space-x-2 cursor-pointer hover:text-slate-900">
                  <input 
                    type="checkbox" 
                    checked={filterDraft}
                    onChange={(e) => setFilterDraft(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500" 
                  />
                  <span>Soạn thảo</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer hover:text-slate-900">
                  <input 
                    type="checkbox" 
                    checked={filterConfirmed}
                    onChange={(e) => setFilterConfirmed(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500" 
                  />
                  <span>Xác nhận</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer hover:text-slate-900">
                  <input 
                    type="checkbox" 
                    checked={filterFullWork}
                    onChange={(e) => setFilterFullWork(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500" 
                  />
                  <span className="text-emerald-900 font-bold bg-[#d1fae5] px-1.5 py-0.2 rounded text-[11px]">
                    Đủ công (8h)
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer hover:text-slate-900">
                  <input 
                    type="checkbox" 
                    checked={filterMissingWork}
                    onChange={(e) => setFilterMissingWork(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500" 
                  />
                  <span className="text-amber-950 font-bold bg-[#fef9c3] px-1.5 py-0.2 rounded text-[11px]">
                    Thiếu công (&lt;8h)
                  </span>
                </label>
              </div>
            </div>

            {/* QUICK LEGEND BOX */}
            <div className="bg-white p-3 rounded-lg border border-slate-300 shadow-2xs text-xs space-y-2">
              <h3 className="font-bold text-slate-800 uppercase text-[11px] tracking-tight border-b border-slate-200 pb-1">
                Chú giải màu sắc
              </h3>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center space-x-2">
                  <div className="w-3.5 h-3.5 bg-[#d1fae5] border border-emerald-300 rounded-sm shrink-0" />
                  <span className="text-slate-700 font-medium">Đủ công (CheckIn ≥8h & Jira ≥8h)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3.5 h-3.5 bg-[#fef9c3] border border-amber-300 rounded-sm shrink-0" />
                  <span className="text-slate-700 font-medium">Thiếu công (&lt;8h hoặc lệch Jira)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3.5 h-3.5 bg-white border border-slate-300 rounded-sm shrink-0" />
                  <span className="text-slate-700 font-medium">Ngày chưa tới / không có dữ liệu</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* DETAILED DAY DRAWER WHEN A CELL IS CLICKED */}
      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-[110] flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md h-full bg-white shadow-2xl z-10 flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                    <span>Chi Tiết Ngày {selectedDay.dateStr}</span>
                    <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[9px] rounded font-bold">
                      Ca {selectedDay.shiftCode}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300 font-semibold mt-0.5">
                    Thứ {selectedDay.dayOfWeek} • Tuần W{selectedDay.weekNum}
                  </p>
                </div>
                <button onClick={() => setSelectedDay(null)} className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
                
                {/* Comparison Card (CheckIn/Out vs Jira Logged) */}
                <div className={`p-3.5 rounded-xl border space-y-2 ${
                  selectedDay.checkInHours >= 8.0 && selectedDay.jiraLoggedHours >= 8.0 
                    ? 'bg-[#d1fae5] border-emerald-300 text-emerald-950' 
                    : 'bg-[#fef9c3] border-amber-300 text-amber-950'
                }`}>
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>Trạng thái công ngày:</span>
                    <span className="px-2 py-0.5 bg-white/80 rounded-md text-xs font-mono font-black">
                      {selectedDay.congValue}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-white/80 p-2 rounded-lg space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Chấm công quẹt thẻ</span>
                      <div className="text-sm font-black font-mono">{selectedDay.checkIn} - {selectedDay.checkOut}</div>
                      <div className="text-[11px] font-semibold text-slate-600">Tổng: {selectedDay.checkInHours}h</div>
                    </div>

                    <div className="bg-white/80 p-2 rounded-lg space-y-0.5">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Log Jira Tempo</span>
                      <div className="text-sm font-black font-mono text-blue-700">{selectedDay.jiraLoggedHours} h</div>
                      <div className="text-[11px] font-semibold text-slate-600">
                        {selectedDay.jiraLoggedHours >= 8.0 ? '✅ Đủ 8.0h' : `⚠️ Thiếu ${(8 - selectedDay.jiraLoggedHours).toFixed(1)}h`}
                      </div>
                    </div>
                  </div>

                  {selectedDay.statusNote && (
                    <div className="text-xs font-bold pt-1 border-t border-black/10 flex items-center gap-1.5">
                      <AlertTriangle size={14} className="shrink-0" />
                      <span>{selectedDay.statusNote}</span>
                    </div>
                  )}
                </div>

                {/* Worklogs List */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={14} className="text-blue-600" />
                      <span>Danh sách task đã log trên Jira ({selectedDay.worklogs?.length || 0})</span>
                    </h4>
                    <button
                      onClick={() => {
                        setExplainCheckIn(selectedDay.checkIn && selectedDay.checkIn !== '00:00' ? selectedDay.checkIn : '08:00');
                        setExplainCheckOut(selectedDay.checkOut && selectedDay.checkOut !== '00:00' ? selectedDay.checkOut : '17:30');
                        setExplainNote('');
                        setIsExplainOpen(true);
                      }}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
                    >
                      <Clock size={13} />
                      <span>Giải trình chấm công</span>
                    </button>
                  </div>

                  {/* Attendance Explanation Inline Form (popup) */}
                  {isExplainOpen && (
                    <form onSubmit={handleExplainAttendance} className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between text-amber-900 font-bold text-xs">
                        <span className="flex items-center gap-1.5"><Clock size={13} /> Giải trình chấm công</span>
                        <button type="button" onClick={() => setIsExplainOpen(false)}><X size={14} /></button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-amber-800 uppercase block">Giờ vào (Check-in)</label>
                          <input
                            type="time"
                            value={explainCheckIn}
                            onChange={e => setExplainCheckIn(e.target.value)}
                            className="w-full p-1.5 bg-white border border-amber-300 rounded-md text-xs font-mono font-bold outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-amber-800 uppercase block">Giờ ra (Check-out)</label>
                          <input
                            type="time"
                            value={explainCheckOut}
                            onChange={e => setExplainCheckOut(e.target.value)}
                            className="w-full p-1.5 bg-white border border-amber-300 rounded-md text-xs font-mono font-bold outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="text-[11px] font-semibold text-amber-800">
                        Số giờ công quy đổi: <strong className="font-mono">{computeWorkedHours(explainCheckIn, explainCheckOut)}h</strong>
                        <span className="text-amber-600"> (đã trừ 1h nghỉ trưa)</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-amber-800 uppercase block">Ghi chú giải trình</label>
                        <textarea
                          value={explainNote}
                          onChange={e => setExplainNote(e.target.value)}
                          placeholder="Lý do đi muộn / về sớm / quên quẹt thẻ..."
                          rows={2}
                          className="w-full p-1.5 bg-white border border-amber-300 rounded-md text-xs outline-none resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-md text-xs transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        Lưu giải trình
                      </button>
                    </form>
                  )}

                  {selectedDay.worklogs && selectedDay.worklogs.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDay.worklogs.map(log => (
                        <div key={log.id} className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-blue-700 text-xs">{log.jiraTicket}</span>
                            <span className="font-mono font-black text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                              {log.hours}h
                            </span>
                          </div>
                          <p className="text-xs text-slate-700">{log.description}</p>
                          <div className="text-[10px] font-mono text-slate-400">Khung giờ: {log.timeLogged}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-400 font-medium bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      Chưa có worklog Jira cho ngày này.
                    </div>
                  )}

                </div>

              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <button
                  onClick={() => setSelectedDay(null)}
                  className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-lg text-xs cursor-pointer"
                >
                  Đóng
                </button>

                <button
                  onClick={() => {
                    showToast(`📝 Đã gửi giải trình công ngày ${selectedDay.dateStr} thành công!`);
                    setSelectedDay(null);
                  }}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer flex items-center space-x-1.5"
                >
                  <Send size={13} />
                  <span>Gửi Giải Trình Công</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
