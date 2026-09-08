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
  FolderKanban,
  X,
  Send
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

// Quy đổi số ngày phép sang giờ (chuẩn 1 ngày công = 8 giờ)
const HOURS_PER_DAY = 8;
const formatHours = (days: number) => {
  const hours = days * HOURS_PER_DAY;
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
};

// Phân loại đơn từ theo module
type RequestModule = 'all' | 'Onsite' | 'Leaves' | 'OT';

interface MyRequest {
  id: string;
  module: Exclude<RequestModule, 'all'>;
  type: string;        // Loại đơn cụ thể
  createdAt: string;
  period: string;      // Thời gian áp dụng
  hours: number;
  status: 'Requested' | 'Approved' | 'Rejected';
}

const MODULE_META: Record<Exclude<RequestModule, 'all'>, { label: string; className: string }> = {
  Onsite: { label: 'Onsite', className: 'bg-blue-50 text-blue-600 border-blue-100' },
  Leaves: { label: 'Leaves', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  OT: { label: 'OT', className: 'bg-purple-50 text-purple-600 border-purple-100' },
};

// Giới hạn ký tự lời chúc sinh nhật
const WISH_MAX_LENGTH = 500;

// Thông báo lời chúc gửi tới người được chúc
interface WishNotification {
  id: string;
  fromName: string;   // người gửi lời chúc
  toId: string;       // id người được chúc
  toName: string;     // tên người được chúc
  toAvatar: string;
  message: string;
  time: string;
  read: boolean;
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

  // Bộ lọc phân loại đơn từ theo module (mục "Đơn Từ & Yêu Cầu Của Tôi")
  const [requestModule, setRequestModule] = useState<RequestModule>('all');

  // Lời chúc sinh nhật: popup soạn & hệ thống thông báo
  const [wishingPerson, setWishingPerson] = useState<{ id: string; name: string; avatar: string } | null>(null);
  const [wishText, setWishText] = useState('');
  const [wishNotifications, setWishNotifications] = useState<WishNotification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [openedNotif, setOpenedNotif] = useState<WishNotification | null>(null);

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

  // Lịch sử điểm danh (log chấm công thô từ máy chấm công)
  const attendanceLogs = [
    { id: 'a-1', date: '21/05/2026', time: '08:10:46', type: 'Máy chấm công' },
    { id: 'a-2', date: '20/05/2026', time: '17:08:30', type: 'Máy chấm công' },
    { id: 'a-3', date: '20/05/2026', time: '09:37:06', type: 'Máy chấm công' },
    { id: 'a-4', date: '19/05/2026', time: '17:12:20', type: 'Máy chấm công' },
    { id: 'a-5', date: '19/05/2026', time: '08:08:15', type: 'Máy chấm công' },
    { id: 'a-6', date: '18/05/2026', time: '17:19:02', type: 'Máy chấm công' },
  ];

  // Mở popup soạn lời chúc cho một đồng nghiệp
  const openWishCompose = (person: { id: string; name: string; avatar: string }) => {
    setWishingPerson(person);
    setWishText('');
  };

  // Gửi lời chúc: lưu trạng thái, đẩy thông báo tới người được chúc
  const handleSubmitWish = () => {
    if (!wishingPerson) return;
    const message = wishText.trim();
    if (!message) {
      showToast('⚠️ Vui lòng nhập nội dung lời chúc!');
      return;
    }

    const notif: WishNotification = {
      id: `WN-${Date.now()}`,
      fromName: 'Nguyễn Văn An',
      toId: wishingPerson.id,
      toName: wishingPerson.name,
      toAvatar: wishingPerson.avatar,
      message,
      time: new Date().toLocaleString('vi-VN').replace(',', ''),
      read: false,
    };

    setWishNotifications(prev => [notif, ...prev]);
    setWishesSent(prev => ({ ...prev, [wishingPerson.id]: true }));
    showToast(`🎉 Đã gửi lời chúc mừng sinh nhật tới ${wishingPerson.name} và đẩy thông báo!`);
    setWishingPerson(null);
    setWishText('');
  };

  // Người được chúc bấm vào thông báo -> mở popup xem lời chúc, đánh dấu đã đọc
  const openNotification = (notif: WishNotification) => {
    setOpenedNotif(notif);
    setWishNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
  };

  const unreadNotifCount = wishNotifications.filter(n => !n.read).length;

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

  // Đơn từ của tôi, gộp từ nhiều module (Leaves lấy từ dữ liệu phép + đơn Onsite/OT mẫu)
  const myLeaveRequests: MyRequest[] = leaves
    .filter(l => l.employeeId === 'V00437' || l.fullName.includes('Nguyễn Văn An'))
    .concat(leaves.slice(0, 3))
    .slice(0, 4)
    .map((l, idx) => ({
      id: `LV-${idx}-${l.id}`,
      module: 'Leaves',
      type: l.leaveType,
      createdAt: l.createdAt,
      period: `${l.startDate.split(' ')[0]} - ${l.endDate.split(' ')[0]}`,
      hours: l.totalHours,
      status: l.status === 'Approved' ? 'Approved' : l.status === 'Rejected' ? 'Rejected' : 'Requested',
    }));

  const myOtherRequests: MyRequest[] = [
    { id: 'OS-01', module: 'Onsite', type: 'Đăng ký Onsite khách hàng', createdAt: '05/09/2026', period: '10/09/2026 - 12/09/2026', hours: 24, status: 'Requested' },
    { id: 'OS-02', module: 'Onsite', type: 'Onsite trung tâm dữ liệu', createdAt: '28/08/2026', period: '01/09/2026 - 01/09/2026', hours: 8, status: 'Approved' },
    { id: 'OT-01', module: 'OT', type: 'Làm thêm giờ dự án', createdAt: '03/09/2026', period: '03/09/2026 18:00 - 21:00', hours: 3, status: 'Approved' },
    { id: 'OT-02', module: 'OT', type: 'Trực hệ thống cuối tuần', createdAt: '30/08/2026', period: '31/08/2026 08:00 - 12:00', hours: 4, status: 'Requested' },
  ];

  const myRequests: MyRequest[] = [...myLeaveRequests, ...myOtherRequests];
  const filteredMyRequests = requestModule === 'all'
    ? myRequests
    : myRequests.filter(r => r.module === requestModule);

  // Khung cứng: luôn chừa chỗ cho 6 dòng, thiếu thì chèn hàng trống, dư thì scroll
  const REQUEST_VISIBLE_ROWS = 6;
  const requestFillerCount = Math.max(0, REQUEST_VISIBLE_ROWS - filteredMyRequests.length);

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
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timesheet cần duyệt</span>
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                  <FileText size={18} />
                </div>
              </div>
              <div>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-black text-slate-800 font-mono">{pendingTimesheetsCount}</span>
                  <span className="text-xs font-bold text-slate-400">bảng công</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${timesheets.length ? (pendingTimesheetsCount / timesheets.length) * 100 : 0}%` }} />
                </div>
                <p className="text-[10px] font-bold text-purple-600 mt-2 flex items-center justify-between">
                  <span>{pendingTimesheetsCount > 0 ? 'Đang chờ bạn phê duyệt' : 'Đã duyệt hết ✅'}</span>
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
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Phân loại theo module: Onsite / Leaves / OT</p>
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

                {/* Bộ lọc phân loại theo module */}
                <div className="flex items-center flex-wrap gap-1.5 mb-3">
                  {([
                    { key: 'all', label: `Tất cả (${myRequests.length})` },
                    { key: 'Onsite', label: `Onsite (${myRequests.filter(r => r.module === 'Onsite').length})` },
                    { key: 'Leaves', label: `Leaves (${myRequests.filter(r => r.module === 'Leaves').length})` },
                    { key: 'OT', label: `OT (${myRequests.filter(r => r.module === 'OT').length})` },
                  ] as { key: RequestModule; label: string }[]).map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setRequestModule(tab.key)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                        requestModule === tab.key
                          ? 'bg-[#0fa57c] text-white border-[#0fa57c] shadow-xs'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-[#0fa57c]/40 hover:text-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Khung cứng cao cố định = header + 6 dòng (mỗi dòng 84px).
                    Dư 6 đơn -> scroll dọc; thiếu -> chèn hàng trống giữ layout. */}
                <div className="overflow-x-auto overflow-y-auto h-[551px]">
                  <table className="w-full text-left text-xs table-fixed">
                    <colgroup>
                      <col className="w-[80px]" />
                      <col />
                      <col className="w-[180px]" />
                      <col className="w-[70px]" />
                      <col className="w-[100px]" />
                    </colgroup>
                    <thead className="sticky top-0 z-10">
                      <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50">
                        <th className="py-2.5 px-3">Module</th>
                        <th className="py-2.5 px-3">Loại đơn</th>
                        <th className="py-2.5 px-3">Thời gian</th>
                        <th className="py-2.5 px-3 text-center">Số giờ</th>
                        <th className="py-2.5 px-3 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMyRequests.map((item) => (
                        <tr key={item.id} className="h-[84px] hover:bg-slate-50/40 transition-colors align-middle">
                          <td className="px-3">
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md border ${MODULE_META[item.module].className}`}>
                              {MODULE_META[item.module].label}
                            </span>
                          </td>
                          <td className="px-3">
                            <span className="font-bold text-slate-800 block truncate">{item.type}</span>
                            <span className="block text-[10px] text-slate-400 font-medium">Tạo ngày {item.createdAt}</span>
                          </td>
                          <td className="px-3 font-medium text-slate-600 whitespace-nowrap">
                            {item.period}
                          </td>
                          <td className="px-3 text-center font-bold text-slate-800 font-mono">
                            {item.hours}h
                          </td>
                          <td className="px-3 text-center">
                            {item.status === 'Requested' ? (
                              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded-full border border-amber-100 whitespace-nowrap">Chờ duyệt</span>
                            ) : item.status === 'Approved' ? (
                              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded-full border border-emerald-100 whitespace-nowrap">Đã duyệt</span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-rose-50 text-rose-500 text-[9px] font-bold rounded-full border border-rose-100 whitespace-nowrap">Từ chối</span>
                            )}
                          </td>
                        </tr>
                      ))}

                      {/* Hàng trống lấp đầy khung khi số đơn < 8 */}
                      {Array.from({ length: requestFillerCount }).map((_, i) => (
                        <tr key={`filler-${i}`} className="h-[84px] align-middle">
                          <td className="px-3" colSpan={5}>
                            {filteredMyRequests.length === 0 && i === 0 && (
                              <span className="text-slate-300 font-semibold text-[11px]">Không có đơn từ nào thuộc module này.</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Lịch sử điểm danh (giờ chấm công) */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <Clock size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Lịch sử điểm danh</h3>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Giờ chấm công gần đây</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate && onNavigate('Chấm công')}
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
                        <th className="py-2.5 px-3 w-10">STT</th>
                        <th className="py-2.5 px-3">Ngày</th>
                        <th className="py-2.5 px-3">Thời gian</th>
                        <th className="py-2.5 px-3">Loại điểm danh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {attendanceLogs.map((log, idx) => (
                        <tr key={log.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-700 font-mono">{log.date}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-800 font-mono">{log.time}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded-md border border-blue-100 whitespace-nowrap">{log.type}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

                  {/* Nút chuông thông báo lời chúc */}
                  <button
                    onClick={() => setShowNotifPanel(v => !v)}
                    className="relative p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors cursor-pointer"
                    title="Thông báo lời chúc"
                  >
                    <Bell size={16} />
                    {unreadNotifCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                        {unreadNotifCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Bảng danh sách thông báo lời chúc (người được chúc nhận được) */}
                {showNotifPanel && (
                  <div className="mb-4 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Thông báo lời chúc ({wishNotifications.length})</span>
                      <button onClick={() => setShowNotifPanel(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
                    </div>
                    {wishNotifications.length === 0 ? (
                      <div className="px-3 py-6 text-center text-[11px] text-slate-400 font-semibold">Chưa có lời chúc nào được gửi.</div>
                    ) : (
                      <div className="max-h-52 overflow-y-auto divide-y divide-slate-50">
                        {wishNotifications.map(n => (
                          <button
                            key={n.id}
                            onClick={() => openNotification(n)}
                            className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 transition-colors cursor-pointer ${n.read ? 'hover:bg-slate-50' : 'bg-rose-50/40 hover:bg-rose-50'}`}
                          >
                            <img src={n.toAvatar} alt={n.toName} className="w-8 h-8 rounded-full border border-slate-100 mt-0.5" referrerPolicy="no-referrer" />
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-slate-800 truncate">
                                🎂 Lời chúc gửi tới {n.toName}
                                {!n.read && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-rose-500 align-middle" />}
                              </p>
                              <p className="text-[10px] text-slate-500 truncate">{n.fromName}: {n.message}</p>
                              <p className="text-[9px] text-slate-400 font-medium mt-0.5">{n.time}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

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
                        onClick={() => openWishCompose({ id: person.id, name: person.name, avatar: person.avatar })}
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

      {/* Popup soạn lời chúc sinh nhật (tối đa 500 ký tự) */}
      {wishingPerson && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setWishingPerson(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={wishingPerson.avatar} alt={wishingPerson.name} className="w-11 h-11 rounded-full border border-slate-100" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">Gửi lời chúc mừng sinh nhật</h4>
                    <p className="text-[11px] text-slate-400 font-semibold">Tới {wishingPerson.name}</p>
                  </div>
                </div>
                <button onClick={() => setWishingPerson(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>

              <div>
                <textarea
                  autoFocus
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value.slice(0, WISH_MAX_LENGTH))}
                  maxLength={WISH_MAX_LENGTH}
                  placeholder="Nhập lời chúc của bạn (tối đa 500 ký tự)..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 outline-none focus:border-rose-400 focus:bg-white transition-all h-32 resize-none"
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-[10px] font-bold ${wishText.length >= WISH_MAX_LENGTH ? 'text-rose-500' : 'text-slate-400'}`}>
                    {wishText.length}/{WISH_MAX_LENGTH} ký tự
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setWishingPerson(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitWish}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <Send size={14} /> Gửi lời chúc
                </button>
              </div>
            </motion.div>
          </div>
        )}

      {/* Popup xem chi tiết lời chúc (khi người được chúc bấm vào thông báo) */}
      {openedNotif && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpenedNotif(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-7 shadow-2xl text-center space-y-4 overflow-hidden"
            >
              <button onClick={() => setOpenedNotif(null)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
              <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-2xl">🎂</div>
              <div>
                <h4 className="font-black text-slate-900 text-base">Chúc mừng sinh nhật {openedNotif.toName}!</h4>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Từ {openedNotif.fromName} • {openedNotif.time}</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left">
                <p className="text-sm text-slate-700 font-medium whitespace-pre-wrap break-words">{openedNotif.message}</p>
              </div>
              <button
                onClick={() => setOpenedNotif(null)}
                className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-rose-500/20 transition-all"
              >
                Đóng
              </button>
            </motion.div>
          </div>
        )}

    </div>
  );
};
