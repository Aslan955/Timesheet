import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Search, 
  CheckCircle, 
  XCircle, 
  Inbox, 
  FileText, 
  ClipboardList, 
  Bell, 
  Heart, 
  Award, 
  AlertCircle,
  TrendingUp,
  ExternalLink,
  Gift,
  Wallet,
  Plus,
  Plane,
  Home,
  Users,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FolderKanban
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MOCK_LEAVES, 
  MOCK_TIMESHEETS, 
  MOCK_PERSONAL_LEAVE, 
  MOCK_HR_TICKETS, 
  LeaveRequest, 
  TimesheetEntry, 
  LeaveBalance, 
  HRTicket 
} from '../constants';

interface DashboardProps {
  onNavigate?: (item: string) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  // Current time state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [wishesSent, setWishesSent] = useState<Record<string, boolean>>({});
  
  // Data states initialized from constants
  const [leaves, setLeaves] = useState<LeaveRequest[]>(MOCK_LEAVES);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(MOCK_TIMESHEETS);
  const [personalLeave, setPersonalLeave] = useState<LeaveBalance>(MOCK_PERSONAL_LEAVE);
  const [hrTickets, setHrTickets] = useState<HRTicket[]>(MOCK_HR_TICKETS);

  // Tab mode state ('personal' = Dashboard cá nhân, 'management' = Dashboard quản lý)
  const [activeTab, setActiveTab] = useState<'personal' | 'management'>('personal');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync clock time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getVietnameseDateTimeString = (date: Date) => {
    const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const weekday = weekdays[date.getDay()];
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${weekday}, ${dd}/${mm}/${yyyy} - ${hh}:${min}:${ss}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Birthday list combining original IMIS birthdays and others
  const birthdays = [
    { id: 'b-1', name: 'Bùi Thu Hiền', role: 'Merchandise', date: 'Hôm nay', isToday: true, avatar: 'https://ui-avatars.com/api/?name=Bui+Hien&background=ffeedd&color=e67e22&bold=true' },
    { id: 'b-2', name: 'Nguyễn Khắc Hiển', role: 'MB Infrastructure', date: 'Hôm nay', isToday: true, avatar: 'https://ui-avatars.com/api/?name=Khac+Hien&background=e3f2fd&color=0d47a1&bold=true' },
    { id: 'b-3', name: 'Ánh Dương', role: 'SEO Specialist', date: '03/07', isToday: false, avatar: 'https://ui-avatars.com/api/?name=Anh+Duong&background=0fa57c&color=fff&bold=true' },
    { id: 'b-4', name: 'Nguyễn Văn Nam', role: 'Marketing Manager', date: '18/06', isToday: false, avatar: 'https://ui-avatars.com/api/?name=Nguyen+Nam&background=4f46e5&color=fff&bold=true' },
  ];

  const handleSendWish = (id: string, name: string) => {
    setWishesSent(prev => ({ ...prev, [id]: true }));
    showToast(`🎉 Đã gửi lời chúc mừng sinh nhật thành công tới ${name}!`);
  };

  // Quick Approve/Reject Action handlers
  const handleApproveLeave = (id: string, applicant: string) => {
    setLeaves(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved' as const } : item));
    showToast(`✅ Đã phê duyệt đơn xin nghỉ phép của ${applicant} thành công!`);
  };

  const handleRejectLeave = (id: string, applicant: string) => {
    setLeaves(prev => prev.map(item => item.id === id ? { ...item, status: 'Rejected' as const } : item));
    showToast(`❌ Đã từ chối đơn xin nghỉ phép của ${applicant}.`);
  };

  const handleApproveTimesheet = (id: string, author: string) => {
    setTimesheets(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved' as const } : item));
    showToast(`✅ Đã phê duyệt bảng công của ${author} thành công!`);
  };

  const handleRejectTimesheet = (id: string, author: string) => {
    setTimesheets(prev => prev.map(item => item.id === id ? { ...item, status: 'Rejected' as const } : item));
    showToast(`❌ Đã từ chối bảng công của ${author}.`);
  };

  // Filter lists based on quick search
  const filteredLeaves = leaves.filter(item => 
    item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTimesheets = timesheets.filter(item => 
    item.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Computed Counts
  const pendingLeavesCount = leaves.filter(l => l.status === 'Requested').length;
  const pendingTimesheetsCount = timesheets.filter(t => t.status === 'Requested').length;
  const pendingTicketsCount = hrTickets.filter(t => t.status === 'Pending HR').length;

  return (
    <div className="p-6 bg-transparent min-h-full space-y-6 relative select-none font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-[#0f172a]/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700/50 flex items-center space-x-3 text-xs font-bold pointer-events-auto"
          >
            <div className="w-2 h-2 rounded-full bg-[#0fa57c] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header & Dashboard Navigation Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Dashboard Portal IMIS
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0fa57c]/10 text-[#0fa57c] border border-[#0fa57c]/20 uppercase">
              Fwork Enterprise
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Hệ thống quản trị thông tin nhân sự và vận hành Fwork
          </p>
        </div>

        {/* Live Clock Pill & Tab Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-full shadow-xs flex items-center space-x-2 text-xs font-bold text-slate-600 font-mono">
            <Clock size={13} className="text-[#0fa57c] animate-pulse" />
            <span>{getVietnameseDateTimeString(currentTime)}</span>
          </div>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center space-x-1 border border-slate-200/60">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'personal'
                  ? 'bg-white text-[#0fa57c] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User size={13} />
              <span>Trang cá nhân</span>
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'management'
                  ? 'bg-white text-[#0fa57c] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FolderKanban size={13} />
              <span>Quản lý & Phê duyệt</span>
              {(pendingLeavesCount > 0 || pendingTimesheetsCount > 0) && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          TAB 1: TRANG CÁ NHÂN (PERSONAL DASHBOARD)
         ========================================= */}
      {activeTab === 'personal' && (
        <div className="space-y-6">
          {/* 1. Personal Welcome Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0f172a] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0fa57c]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src="https://ui-avatars.com/api/?name=Nguyen+Van+An&background=0fa57c&color=fff&bold=true"
                    alt="Nguyen Van An"
                    className="w-16 h-16 rounded-2xl border-2 border-white/20 object-cover shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-black text-white">Nguyễn Văn An</h2>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-md">
                      V00437
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    Senior Software Engineer • Phòng Development
                  </p>
                  <div className="flex items-center space-x-3 mt-2 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <ShieldCheck size={13} /> Đã điểm danh (Ca 08:00 - 17:30)
                    </span>
                    <span>•</span>
                    <span>Manager: Trần Văn B</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions inside Hero */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onNavigate && onNavigate('Leaves')}
                  className="px-4 py-2 bg-[#0fa57c] hover:bg-[#0fa57c]/90 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-950/40 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <Plane size={14} />
                  <span>Xin nghỉ phép</span>
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('Timesheet')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold rounded-xl backdrop-blur-md transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <FileText size={14} />
                  <span>Khai Timesheet</span>
                </button>
                <button
                  onClick={() => onNavigate && onNavigate('Thông tin người phụ thuộc')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold rounded-xl backdrop-blur-md transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
                >
                  <Users size={14} />
                  <span>Người phụ thuộc</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Personal Key Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Stat 1: Quỹ phép cá nhân */}
            <div 
              onClick={() => onNavigate && onNavigate('Phép cá nhân')}
              className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-[#0fa57c]/50 transition-all duration-200 group cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phép cá nhân (2026)</span>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-[#0fa57c] group-hover:scale-110 transition-transform">
                  <Wallet size={18} />
                </div>
              </div>
              <div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black text-slate-800 font-mono">{personalLeave.remaining}</span>
                  <span className="text-xs font-bold text-slate-400">/ {personalLeave.totalEntitlement} ngày</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div 
                    className="bg-[#0fa57c] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(personalLeave.remaining / personalLeave.totalEntitlement) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center justify-between">
                  <span>Đã dùng: {personalLeave.used}d</span>
                  <span className="text-[#0fa57c] hover:underline">Xem chi tiết &rarr;</span>
                </p>
              </div>
            </div>

            {/* Stat 2: Chấm công tháng này */}
            <div 
              onClick={() => onNavigate && onNavigate('Chấm công')}
              className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-[#0fa57c]/50 transition-all duration-200 group cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chấm công tháng 5</span>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                  <Clock size={18} />
                </div>
              </div>
              <div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black text-slate-800 font-mono">21.0</span>
                  <span className="text-xs font-bold text-slate-400">/ 22 công</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full w-[95%]" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 mt-2 flex items-center justify-between">
                  <span className="text-emerald-600">Đúng giờ: 21d</span>
                  <span className="text-slate-400">Trễ: 0</span>
                </p>
              </div>
            </div>

            {/* Stat 3: Timesheet tuần này */}
            <div 
              onClick={() => onNavigate && onNavigate('Timesheet')}
              className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-[#0fa57c]/50 transition-all duration-200 group cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timesheet Tuần</span>
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                  <FileText size={18} />
                </div>
              </div>
              <div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black text-slate-800 font-mono">40.0</span>
                  <span className="text-xs font-bold text-slate-400">/ 40.0 giờ</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full w-[100%]" />
                </div>
                <p className="text-[10px] font-bold text-purple-600 mt-2 flex items-center justify-between">
                  <span>Trạng thái: Đã duyệt ✅</span>
                </p>
              </div>
            </div>

            {/* Stat 4: Đơn của tôi đang chờ */}
            <div 
              onClick={() => onNavigate && onNavigate('Quản lý Đơn từ')}
              className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs hover:shadow-md hover:border-[#0fa57c]/50 transition-all duration-200 group cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đơn từ đang chờ</span>
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
                  <Inbox size={18} />
                </div>
              </div>
              <div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black text-slate-800 font-mono">1</span>
                  <span className="text-xs font-bold text-slate-400">yêu cầu</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full w-[50%]" />
                </div>
                <p className="text-[10px] font-bold text-amber-600 mt-2 flex items-center justify-between">
                  <span>Nghỉ phép năm (1 ngày)</span>
                </p>
              </div>
            </div>
          </div>

          {/* 3. Main Split Grid (My Requests & Birthdays) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Side: My Recent Requests & Leave History */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Đơn từ cá nhân gần đây */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-emerald-50 text-[#0fa57c] rounded-xl">
                      <FileText size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Đơn Từ & Yêu Cầu Của Tôi</h3>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Lịch sử đăng ký nghỉ / WFH gần nhất</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate && onNavigate('Leaves')}
                    className="text-xs font-bold text-[#0fa57c] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Xem tất cả</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                        <th className="py-2.5 px-3">Loại đơn</th>
                        <th className="py-2.5 px-3">Thời gian</th>
                        <th className="py-2.5 px-3 text-center">Số giờ</th>
                        <th className="py-2.5 px-3 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leaves.filter(l => l.employeeId === 'V00437' || l.fullName.includes('Nguyễn Văn An')).concat(leaves.slice(0, 3)).slice(0, 4).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-800">{item.leaveType}</span>
                            <span className="block text-[10px] text-slate-400 font-medium">Tạo ngày {item.createdAt}</span>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-600">
                            {item.startDate.split(' ')[0]} - {item.endDate.split(' ')[0]}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-800 font-mono">
                            {item.totalHours}h
                          </td>
                          <td className="py-3 px-3 text-center">
                            {item.status === 'Requested' ? (
                              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded-full border border-amber-100">Chờ duyệt</span>
                            ) : item.status === 'Approved' ? (
                              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded-full border border-emerald-100">Đã duyệt</span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-rose-50 text-rose-500 text-[9px] font-bold rounded-full border border-rose-100">Từ chối</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Card 2: Personal Leave Breakdown Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <Award size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Chi Tiết Quỹ Phép Cá Nhân</h3>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Năm 2026 • Hạn mức hợp đồng V00437</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Hạn mức gốc</span>
                    <span className="text-lg font-black text-slate-800 font-mono mt-0.5 block">{personalLeave.totalEntitlement} ngày</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Tồn năm trước</span>
                    <span className="text-lg font-black text-slate-800 font-mono mt-0.5 block">{personalLeave.carriedForward} ngày</span>
                  </div>
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-[#0fa57c] font-bold uppercase block">Cấp thêm</span>
                    <span className="text-lg font-black text-[#0fa57c] font-mono mt-0.5 block">+{personalLeave.granted} ngày</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Đã nghỉ</span>
                    <span className="text-lg font-black text-slate-800 font-mono mt-0.5 block">{personalLeave.used} ngày</span>
                  </div>
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                    <span className="text-[10px] text-amber-600 font-bold uppercase block">Đang chờ duyệt</span>
                    <span className="text-lg font-black text-amber-600 font-mono mt-0.5 block">{personalLeave.pendingApproval} ngày</span>
                  </div>
                  <div className="p-3 bg-[#0fa57c]/10 rounded-xl border border-[#0fa57c]/20">
                    <span className="text-[10px] text-[#0fa57c] font-bold uppercase block">Khả dụng</span>
                    <span className="text-lg font-black text-emerald-800 font-mono mt-0.5 block">{personalLeave.remaining} ngày</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Birthdays & Corporate Announcements */}
            <div className="lg:col-span-5 space-y-6">
              {/* Birthdays Card */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
                      <Gift size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Sinh Nhật Đồng Nghiệp</h3>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Tháng 5/2026</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {birthdays.map((person) => (
                    <div 
                      key={person.id}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                        person.isToday 
                          ? 'bg-rose-50/50 border-rose-100' 
                          : 'bg-slate-50/40 border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={person.avatar} 
                          alt={person.name} 
                          className="w-9 h-9 rounded-full border border-slate-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800">{person.name}</span>
                            {person.isToday && (
                              <span className="px-1.5 py-0.5 bg-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-wider rounded">Hôm nay</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold">{person.role} • <span className="font-bold text-slate-600">{person.date}</span></p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSendWish(person.id, person.name)}
                        disabled={wishesSent[person.id]}
                        className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          wishesSent[person.id]
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-not-allowed'
                            : 'bg-rose-500 hover:bg-rose-600 text-white active:scale-95'
                        }`}
                      >
                        {wishesSent[person.id] ? 'Đã gửi' : 'Chúc'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Notice Board */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                      <Bell size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Thông Báo Nội Bộ</h3>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Lịch nghỉ & Quy định Fwork</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase">Lịch nghỉ lễ sắp tới</span>
                    <h4 className="text-xs font-bold text-slate-800 mt-0.5">Nghỉ Lễ Quốc Khánh 02/09/2026</h4>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Toàn thể CBNV được nghỉ 02 ngày (02/09 và 03/09). Vui lòng đăng ký Timesheet đúng hạn trước khi nghỉ lễ.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-bold text-blue-600 uppercase">Khảo sát HR</span>
                    <h4 className="text-xs font-bold text-slate-800 mt-0.5">Khảo sát môi trường làm việc Quý 2</h4>
                    <p className="text-[10px] text-slate-500 mt-1">
                      HR kính mời CBNV tham gia đánh giá mức độ hài lòng về đãi ngộ & hạ tầng công nghệ.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================
          TAB 2: QUẢN LÝ & PHÊ DUYỆT (MANAGER OVERVIEW)
         ========================================= */}
      {activeTab === 'management' && (
        <div className="space-y-6">
          {/* Key Metrics Row (3 widgets) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Metric 1: Remaining Personal Leave */}
            <div 
              onClick={() => onNavigate && onNavigate('Phép cá nhân')}
              className="bg-white border border-slate-200/60 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm hover:border-[#0fa57c]/40 transition-all duration-200 relative overflow-hidden group cursor-pointer"
            >
              <div className="space-y-1.5 z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quỹ phép cá nhân</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-slate-800 tracking-tight font-mono">{personalLeave.remaining}</span>
                  <span className="text-xs font-semibold text-slate-400">/ {personalLeave.totalEntitlement} ngày</span>
                </div>
                <p className="text-[10px] font-bold text-[#0fa57c] flex items-center gap-1">
                  <TrendingUp size={11} /> Đã sử dụng {personalLeave.used} ngày
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50 text-[#0fa57c] group-hover:scale-110 transition-transform duration-300">
                <Calendar size={20} />
              </div>
            </div>

            {/* Metric 2: Pending Leave Requests */}
            <div 
              onClick={() => onNavigate && onNavigate('Leaves')}
              className="bg-white border border-slate-200/60 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm hover:border-[#0fa57c]/40 transition-all duration-200 relative overflow-hidden group cursor-pointer"
            >
              <div className="space-y-1.5 z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đơn phép chờ duyệt</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-slate-800 tracking-tight font-mono">{pendingLeavesCount}</span>
                  <span className="text-xs font-semibold text-slate-400">yêu cầu</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400">Đang cần bạn xem xét</p>
              </div>
              <div className={`p-3.5 rounded-xl ${pendingLeavesCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'} group-hover:scale-110 transition-transform duration-300`}>
                <Inbox size={20} />
              </div>
            </div>

            {/* Metric 3: Pending Timesheets */}
            <div 
              onClick={() => onNavigate && onNavigate('Timesheet')}
              className="bg-white border border-slate-200/60 p-5 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm hover:border-[#0fa57c]/40 transition-all duration-200 relative overflow-hidden group cursor-pointer"
            >
              <div className="space-y-1.5 z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timesheet chờ duyệt</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-slate-800 tracking-tight font-mono">{pendingTimesheetsCount}</span>
                  <span className="text-xs font-semibold text-slate-400">bảng công</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400">Yêu cầu xác nhận tuần</p>
              </div>
              <div className={`p-3.5 rounded-xl ${pendingTimesheetsCount > 0 ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'} group-hover:scale-110 transition-transform duration-300`}>
                <FileText size={20} />
              </div>
            </div>
          </div>

          {/* Leave Queue & Timesheet Queue Double Grids */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Leave Requests Pending Queue */}
            <div className="xl:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Inbox size={16} /></div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Yêu Cầu Nghỉ Phép Mới Nhất</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Đơn gửi từ nhân sự đang chờ xử lý</p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate && onNavigate('Leaves')}
                  className="text-xs font-bold text-[#0fa57c] hover:underline flex items-center space-x-1"
                >
                  <span>Tất cả đơn</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                      <th className="py-2.5 px-3">Họ và tên</th>
                      <th className="py-2.5 px-3">Loại phép</th>
                      <th className="py-2.5 px-3 text-center">Tổng giờ</th>
                      <th className="py-2.5 px-3">Thời gian</th>
                      <th className="py-2.5 px-3 text-center">Trạng thái</th>
                      <th className="py-2.5 px-3 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredLeaves.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="py-3 px-3 font-bold text-slate-700">
                          <div>{item.fullName}</div>
                          <div className="text-[9px] text-slate-400 font-medium tracking-tight mt-0.5">{item.project}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-500">{item.leaveType}</td>
                        <td className="py-3 px-3 text-center font-bold text-slate-700 font-mono">{item.totalHours}h</td>
                        <td className="py-3 px-3 text-slate-500 font-medium">
                          <div className="text-[10px] font-mono">{item.startDate}</div>
                          <div className="text-[10px] font-mono text-slate-400">{item.endDate}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex justify-center">
                            {item.status === 'Requested' ? (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded-md border border-amber-100">Chờ duyệt</span>
                            ) : item.status === 'Approved' ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded-md border border-emerald-100">Đã duyệt</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-rose-50 text-rose-500 text-[9px] font-bold rounded-md border border-rose-100">Từ chối</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-end space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            {item.status === 'Requested' ? (
                              <>
                                <button 
                                  onClick={() => handleApproveLeave(item.id, item.fullName)}
                                  title="Duyệt đơn" 
                                  className="p-1 hover:bg-emerald-50 text-[#0fa57c] rounded transition-colors cursor-pointer"
                                >
                                  <CheckCircle size={15} />
                                </button>
                                <button 
                                  onClick={() => handleRejectLeave(item.id, item.fullName)}
                                  title="Từ chối đơn" 
                                  className="p-1 hover:bg-rose-50 text-rose-500 rounded transition-colors cursor-pointer"
                                >
                                  <XCircle size={15} />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium">Đã xử lý</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timesheet Approval Queue */}
            <div className="xl:col-span-5 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><FileText size={16} /></div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Timesheet Cần Phê Duyệt</h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Hồ sơ xác nhận bảng công hàng tuần</p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate && onNavigate('Timesheet')}
                  className="text-xs font-bold text-[#0fa57c] hover:underline flex items-center space-x-1"
                >
                  <span>Xem bảng công</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-[350px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                      <th className="py-2.5 px-3">Nhân sự</th>
                      <th className="py-2.5 px-3">Dự án</th>
                      <th className="py-2.5 px-3 text-center">Trạng thái</th>
                      <th className="py-2.5 px-3 text-right">Duyệt nhanh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredTimesheets.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="py-3.5 px-3 font-bold text-slate-700">{item.authorName}</td>
                        <td className="py-3.5 px-3 font-medium text-slate-500 truncate max-w-[120px]" title={item.projectName}>
                          {item.projectName}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex justify-center">
                            {item.status === 'Requested' ? (
                              <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-bold rounded-md border border-orange-100">Cần duyệt</span>
                            ) : item.status === 'Approved' ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded-md border border-emerald-100">Đã duyệt</span>
                            ) : item.status === 'Draft' ? (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-bold rounded-md border border-slate-200">Nháp</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-rose-50 text-rose-500 text-[9px] font-bold rounded-md border border-rose-100">Từ chối</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            {item.status === 'Requested' ? (
                              <>
                                <button 
                                  onClick={() => handleApproveTimesheet(item.id, item.authorName)}
                                  title="Duyệt bảng công" 
                                  className="p-1 hover:bg-emerald-50 text-[#0fa57c] rounded transition-colors cursor-pointer"
                                >
                                  <CheckCircle size={15} />
                                </button>
                                <button 
                                  onClick={() => handleRejectTimesheet(item.id, item.authorName)}
                                  title="Từ chối bảng công" 
                                  className="p-1 hover:bg-rose-50 text-rose-500 rounded transition-colors cursor-pointer"
                                >
                                  <XCircle size={15} />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-medium">Khóa</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
