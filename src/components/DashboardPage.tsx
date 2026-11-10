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
  Send,
  Wrench
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRENT_USER, WISH_SUGGESTIONS, WISH_THEMES, sendWish, useWishes, type WishTheme } from '../marcom/wishStore';
import { BirthdayBox } from '../marcom/BirthdayBox';
import { initialsAvatar } from '../utils/avatar';
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


type Tone = 'emerald' | 'blue' | 'violet' | 'rose' | 'amber';
const TONE: Record<Tone, { soft: string; bar: string }> = {
  emerald: { soft: 'bg-emerald-50 text-[#0fa57c]', bar: 'bg-[#0fa57c]' },
  blue: { soft: 'bg-blue-50 text-blue-600', bar: 'bg-blue-600' },
  violet: { soft: 'bg-violet-50 text-violet-600', bar: 'bg-violet-600' },
  rose: { soft: 'bg-rose-50 text-rose-500', bar: 'bg-rose-500' },
  amber: { soft: 'bg-amber-50 text-amber-600', bar: 'bg-amber-500' },
};

const greetingOf = (d: Date) => (d.getHours() < 11 ? 'Chào buổi sáng' : d.getHours() < 14 ? 'Chào buổi trưa' : d.getHours() < 18 ? 'Chào buổi chiều' : 'Chào buổi tối');

/** Ô thông tin nhanh — bản gọn (1 hàng: biểu tượng | nhãn, số, thanh tiến độ). */
const StatTile: React.FC<{ icon: React.ElementType; tone: Tone; label: string; value: string; unit: string; note: string; pct: number; onClick?: () => void }> = ({
  icon: Icon, tone, label, value, unit, note, pct, onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group text-left bg-white border border-slate-200/80 rounded-xl px-3.5 py-3 flex items-center gap-3 hover:border-[#0fa57c]/50 hover:shadow-sm transition-all cursor-pointer"
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${TONE[tone].soft}`}>
      <Icon size={18} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[13px] font-semibold text-slate-500 uppercase truncate" title={label}>{label}</p>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="text-[20px] font-bold text-slate-700 font-mono leading-none">{value}</span>
        <span className="text-[13px] font-semibold text-slate-400 truncate">{unit}</span>
        <span className="ml-auto pl-1 text-[13px] font-semibold text-slate-400 whitespace-nowrap hidden min-[1440px]:inline">{note}</span>
      </div>
      <div className="h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
        <div className={`h-full rounded-full ${TONE[tone].bar} opacity-70 transition-all duration-500`} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
      </div>
    </div>
  </button>
);

/** Khung thẻ có tiêu đề. */
const Card: React.FC<{ icon: React.ElementType; tone: Tone; title: string; sub?: string; action?: React.ReactNode; children: React.ReactNode }> = ({ icon: Icon, tone, title, sub, action, children }) => (
  <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
    <header className="flex items-center justify-between gap-2 mb-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${TONE[tone].soft}`}>
          <Icon size={15} />
        </div>
        <div className="min-w-0">
          <h3 className="text-[16px] font-bold text-slate-900 leading-tight">{title}</h3>
          {sub && <p className="text-[13px] text-slate-500 font-semibold">{sub}</p>}
        </div>
      </div>
      {action}
    </header>
    {children}
  </section>
);

const StatusPill: React.FC<{ status: MyRequest['status'] }> = ({ status }) => {
  const m = {
    Requested: ['Chờ duyệt', 'bg-amber-50 text-amber-600 border-amber-100'],
    Approved: ['Đã duyệt', 'bg-emerald-50 text-emerald-600 border-emerald-100'],
    Rejected: ['Từ chối', 'bg-rose-50 text-rose-500 border-rose-100'],
  }[status];
  return <span className={`px-2.5 py-0.5 text-[13px] font-medium rounded-full border whitespace-nowrap ${m[1]}`}>{m[0]}</span>;
};

const NOTICES = [
  { tag: 'Lịch nghỉ lễ', tagCls: 'text-emerald-600', bar: 'bg-emerald-400', date: '02/09/2026', title: 'Nghỉ Lễ Quốc Khánh 02/09/2026', body: 'Toàn thể CBNV được nghỉ 02 ngày (02/09 và 03/09). Vui lòng đăng ký Timesheet đúng hạn trước khi nghỉ lễ.' },
  { tag: 'Khảo sát HR', tagCls: 'text-blue-600', bar: 'bg-blue-400', date: 'Quý 2/2026', title: 'Khảo sát môi trường làm việc Quý 2', body: 'HR kính mời CBNV tham gia đánh giá mức độ hài lòng về đãi ngộ & hạ tầng công nghệ.' },
];

export const DashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  // Current time state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
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
  const [wishTheme, setWishTheme] = useState<WishTheme>('cake');
  const [wishSign, setWishSign] = useState(CURRENT_USER.name);
  const wishNotifications = useWishes(); // lời chúc → thông báo ở chuông đầu trang (Header)
  // Đã gửi lời chúc cho ai (người dùng hiện tại)
  const wishesSent: Record<string, boolean> = Object.fromEntries(wishNotifications.filter((w) => w.fromName === CURRENT_USER.name).map((w) => [w.toId, true]));

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
  const birthdays = ([
    { id: 'b-1', name: 'Bùi Thu Hiền', role: 'Merchandise', date: 'Hôm nay', isToday: true, avatar: '' },
    { id: 'b-2', name: 'Nguyễn Khắc Hiển', role: 'MB Infrastructure', date: 'Hôm nay', isToday: true, avatar: '' },
    { id: 'b-3', name: 'Ánh Dương', role: 'SEO Specialist', date: '03/07', isToday: false, avatar: '' },
    { id: 'b-4', name: 'Nguyễn Văn Nam', role: 'Marketing Manager', date: '18/06', isToday: false, avatar: '' },
  ]).map((b) => ({ ...b, avatar: initialsAvatar(b.name) }));

  // Lịch sử điểm danh (gộp theo ngày: giờ vào / giờ ra từ máy chấm công)
  const attendanceLogs = [
    { id: 'a-1', date: '10/09/2026', checkIn: '08:48:35', checkOut: '—',        type: 'Máy chấm công' },
    { id: 'a-2', date: '09/09/2026', checkIn: '08:40:48', checkOut: '18:43:17', type: 'Máy chấm công' },
    { id: 'a-3', date: '08/09/2026', checkIn: '09:02:06', checkOut: '19:20:32', type: 'Máy chấm công' },
    { id: 'a-4', date: '04/09/2026', checkIn: '08:52:46', checkOut: '18:44:20', type: 'Máy chấm công' },
    { id: 'a-5', date: '03/09/2026', checkIn: '08:15:10', checkOut: '17:30:05', type: 'Máy chấm công' },
    { id: 'a-6', date: '02/09/2026', checkIn: '08:22:41', checkOut: '17:48:19', type: 'Máy chấm công' },
  ];

  // Mở popup soạn lời chúc cho một đồng nghiệp
  const openWishCompose = (person: { id: string; name: string; avatar: string }) => {
    setWishingPerson(person);
    setWishText('');
    setWishTheme('cake');
    setWishSign(CURRENT_USER.name);
  };

  // Gửi lời chúc: lưu trạng thái, đẩy thông báo tới người được chúc
  const handleSubmitWish = () => {
    if (!wishingPerson) return;
    const message = wishText.trim();
    if (!message) {
      showToast('⚠️ Vui lòng nhập nội dung lời chúc!');
      return;
    }

    // Đẩy thông báo tới người được chúc: popup thông báo + chuông đầu trang → bấm vào mở thiệp chúc của người chúc
    sendWish({
      fromName: CURRENT_USER.name,
      fromAvatar: CURRENT_USER.avatar,
      toId: wishingPerson.id,
      toName: wishingPerson.name,
      toAvatar: wishingPerson.avatar,
      message,
      signature: wishSign.trim(),
      theme: wishTheme,
    });
    showToast(`🎉 Đã gửi lời chúc mừng sinh nhật tới ${wishingPerson.name} và đẩy thông báo!`);
    setWishingPerson(null);
    setWishText('');
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
  const REQUEST_VISIBLE_ROWS = 5;
  const requestFillerCount = Math.max(0, REQUEST_VISIBLE_ROWS - filteredMyRequests.length);

  // Computed Counts
  const pendingLeavesCount = leaves.filter(l => l.status === 'Requested').length;
  const pendingTimesheetsCount = timesheets.filter(t => t.status === 'Requested').length;
  const pendingTicketsCount = hrTickets.filter(t => t.status === 'Pending HR').length;

  return (
    <div className="p-5 bg-transparent min-h-full space-y-4 relative select-none font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-[#0f172a]/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700/50 flex items-center space-x-3 text-[13px] font-medium pointer-events-auto"
          >
            <div className="w-2 h-2 rounded-full bg-[#0fa57c] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thanh chào + đồng hồ + chuyển chế độ xem */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[19px] font-semibold text-slate-800 leading-tight">
            {greetingOf(currentTime)}, {CURRENT_USER.name.split(' ').slice(-2).join(' ')}
          </h1>
          <p className="text-[13px] text-slate-500 font-medium">Tổng quan phép, chấm công và đơn từ của bạn</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="h-8 px-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-[13px] font-bold text-slate-700 font-mono">
            <Clock size={13} className="text-[#0fa57c]" />
            <span>{getVietnameseDateTimeString(currentTime)}</span>
          </div>
          <div className="h-8 bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200/70">
            {([
              { key: 'personal', label: 'Trang cá nhân', icon: User },
              { key: 'management', label: 'Quản lý & Phê duyệt', icon: FolderKanban },
            ] as const).map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`h-full px-3 rounded-md text-[13px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === t.key ? 'bg-white text-[#0fa57c] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <t.icon size={13} />
                <span>{t.label}</span>
                {t.key === 'management' && (pendingLeavesCount > 0 || pendingTimesheetsCount > 0) && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Box trang chủ (MarCom): slide Sinh nhật · Chào mừng thành viên mới · Banner — bản gọn */}
      <BirthdayBox compact />

      {/* =========================================
          TAB 1: TRANG CÁ NHÂN (PERSONAL DASHBOARD)
         ========================================= */}
      {activeTab === 'personal' && (
        <div className="space-y-4">
          {/* 4 thông tin nhanh — bản gọn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <StatTile
              icon={Wallet}
              tone="emerald"
              label="Phép cá nhân 2026"
              value={String(personalLeave.remaining)}
              unit={`/ ${personalLeave.totalEntitlement} ngày`}
              note={`Đã dùng ${personalLeave.used}`}
              pct={(personalLeave.remaining / personalLeave.totalEntitlement) * 100}
              onClick={() => onNavigate && onNavigate('Phép cá nhân')}
            />
            <StatTile
              icon={Clock}
              tone="blue"
              label={`Chấm công tháng ${currentTime.getMonth() + 1}`}
              value="21.0"
              unit="/ 22 công"
              note="Trễ 0"
              pct={95}
              onClick={() => onNavigate && onNavigate('Chấm công')}
            />
            <StatTile
              icon={FileText}
              tone="violet"
              label="Timesheet cần duyệt"
              value={String(pendingTimesheetsCount)}
              unit="bảng công"
              note={pendingTimesheetsCount > 0 ? 'Chờ bạn duyệt' : 'Đã duyệt hết'}
              pct={timesheets.length ? (pendingTimesheetsCount / timesheets.length) * 100 : 0}
              onClick={() => onNavigate && onNavigate('Timesheet')}
            />
            {/* Đơn từ đang chờ — tạm bảo trì */}
            <div
              className="relative overflow-hidden bg-white border border-dashed border-amber-300 rounded-xl px-3.5 py-3 flex items-center gap-3 cursor-default"
              title="Chức năng đang được bảo trì / phát triển"
              data-testid="pending-requests-maintenance"
            >
              <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b 0 10px, transparent 10px 20px)' }} />
              <div className="relative w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Wrench size={18} />
              </div>
              <div className="relative min-w-0">
                <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide truncate">Đơn từ đang chờ</p>
                <p className="flex items-center gap-1.5 text-[15px] font-bold text-slate-700 leading-tight mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Đang bảo trì
                </p>
                <p className="text-[13px] font-semibold text-amber-500 truncate mt-0.5">Đang nâng cấp, sẽ sớm hoạt động lại</p>
              </div>
            </div>
          </div>

          {/* Lưới chính */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 space-y-4">
              {/* Đơn từ & yêu cầu của tôi */}
              <Card
                icon={FileText}
                tone="emerald"
                title="Đơn từ & yêu cầu của tôi"
                sub="Onsite · Leaves · OT"
                action={
                  <button onClick={() => onNavigate && onNavigate('Leaves')} className="text-[13px] font-medium text-[#0fa57c] hover:underline flex items-center gap-0.5 cursor-pointer">
                    Xem tất cả <ChevronRight size={14} />
                  </button>
                }
              >
                <div className="flex items-center flex-wrap gap-1.5 mb-2.5">
                  {([
                    { key: 'all', label: 'Tất cả', n: myRequests.length },
                    { key: 'Onsite', label: 'Onsite', n: myRequests.filter((r) => r.module === 'Onsite').length },
                    { key: 'Leaves', label: 'Leaves', n: myRequests.filter((r) => r.module === 'Leaves').length },
                    { key: 'OT', label: 'OT', n: myRequests.filter((r) => r.module === 'OT').length },
                  ] as { key: RequestModule; label: string; n: number }[]).map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setRequestModule(tab.key)}
                      className={`h-6 px-2.5 text-[13px] font-medium rounded-full border transition-all cursor-pointer ${
                        requestModule === tab.key ? 'bg-[#0fa57c] text-white border-[#0fa57c]' : 'bg-white text-slate-500 border-slate-200 hover:border-[#0fa57c]/40 hover:text-slate-700'
                      }`}
                    >
                      {tab.label} <span className={requestModule === tab.key ? 'text-white/80' : 'text-slate-400'}>{tab.n}</span>
                    </button>
                  ))}
                </div>
                {/* Khung cao cố định = tiêu đề + 5 dòng; dư thì cuộn, thiếu thì chèn hàng trống */}
                <div className="overflow-auto h-[258px] rounded-lg border border-slate-100">
                  <table className="w-full text-left text-[13px] table-fixed">
                    <colgroup>
                      <col className="w-[96px]" />
                      <col />
                      <col className="w-[86px]" />
                      <col className="w-[120px]" />
                    </colgroup>
                    <thead className="sticky top-0 z-[1]">
                      <tr className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap bg-slate-50 h-9">
                        <th className="px-3">Module</th>
                        <th className="px-3">Thời gian</th>
                        <th className="px-3 text-center">Số giờ</th>
                        <th className="px-3 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMyRequests.map((item) => (
                        <tr key={item.id} className="h-11 hover:bg-slate-50/60 transition-colors">
                          <td className="px-3">
                            <span className={`px-2 py-0.5 text-[13px] font-medium rounded-md border ${MODULE_META[item.module].className}`}>{MODULE_META[item.module].label}</span>
                          </td>
                          <td className="px-3 font-medium text-slate-700 whitespace-nowrap text-[13px] truncate" title={`${item.type} · tạo ngày ${item.createdAt}`}>{item.period}</td>
                          <td className="px-3 text-center font-medium text-slate-800 font-mono">{item.hours}h</td>
                          <td className="px-3 text-center">
                            <StatusPill status={item.status} />
                          </td>
                        </tr>
                      ))}
                      {Array.from({ length: requestFillerCount }).map((_, i) => (
                        <tr key={`filler-${i}`} className="h-11">
                          <td className="px-3" colSpan={4}>
                            {filteredMyRequests.length === 0 && i === 0 && <span className="text-slate-300 font-medium text-[13px]">Không có đơn từ nào thuộc module này.</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Lịch sử điểm danh */}
              <Card
                icon={Clock}
                tone="blue"
                title="Lịch sử điểm danh"
                sub="Giờ chấm công gần đây"
                action={
                  <button onClick={() => onNavigate && onNavigate('Chấm công')} className="text-[13px] font-medium text-[#0fa57c] hover:underline flex items-center gap-0.5 cursor-pointer">
                    Xem tất cả <ChevronRight size={14} />
                  </button>
                }
              >
                <div className="overflow-x-auto rounded-lg border border-slate-100">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap bg-slate-50 h-9">
                        <th className="px-3 w-10">STT</th>
                        <th className="px-3">Ngày</th>
                        <th className="px-3">Check-in</th>
                        <th className="px-3">Check-out</th>
                        <th className="px-3">Loại điểm danh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendanceLogs.map((log, idx) => (
                        <tr key={log.id} className="h-10 hover:bg-slate-50/60 transition-colors">
                          <td className="px-3 font-medium text-slate-400 font-mono">{idx + 1}</td>
                          <td className="px-3 font-medium text-slate-700 font-mono">{log.date}</td>
                          <td className="px-3 font-medium text-slate-800 font-mono">{log.checkIn}</td>
                          <td className={`px-3 font-medium font-mono ${log.checkOut === '—' ? 'text-slate-300' : 'text-slate-800'}`}>{log.checkOut}</td>
                          <td className="px-3">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[13px] font-medium rounded-md border border-blue-100 whitespace-nowrap">{log.type}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-5 space-y-4">
              {/* Sinh nhật đồng nghiệp */}
              <Card icon={Gift} tone="rose" title="Sinh nhật đồng nghiệp" sub="Hôm nay & sắp tới">
                <div className="space-y-2">
                  {birthdays.map((person) => (
                    <div
                      key={person.id}
                      className={`px-2.5 py-2 rounded-lg border flex items-center justify-between gap-2 ${person.isToday ? 'bg-rose-50/60 border-rose-100' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img src={person.avatar} alt="" className="w-8 h-8 rounded-full shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-medium text-slate-800 truncate">{person.name}</span>
                            {person.isToday && <span className="px-1.5 py-px bg-rose-100 text-rose-600 text-[13px] font-semibold rounded">Hôm nay</span>}
                          </div>
                          <p className="text-[13px] text-slate-400 font-medium truncate">
                            {person.role} · <span className="font-medium text-slate-600">{person.date}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => openWishCompose({ id: person.id, name: person.name, avatar: person.avatar })}
                        disabled={wishesSent[person.id]}
                        className={`shrink-0 h-7 px-3 text-[13px] font-medium rounded-lg transition-all ${
                          wishesSent[person.id] ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600 text-white active:scale-95 cursor-pointer'
                        }`}
                      >
                        {wishesSent[person.id] ? 'Đã gửi' : 'Chúc'}
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Thông báo nội bộ */}
              <Card icon={Bell} tone="amber" title="Thông báo nội bộ" sub="Lịch nghỉ & quy định">
                <div className="space-y-2">
                  {NOTICES.map((n) => (
                    <div key={n.title} className="flex gap-3 p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                      <span className={`w-1 rounded-full shrink-0 ${n.bar}`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-[13px] font-semibold ${n.tagCls}`}>{n.tag}</span>
                          <span className="text-[13px] text-slate-400 font-medium">{n.date}</span>
                        </div>
                        <h4 className="text-[13px] font-medium text-slate-800 mt-0.5 leading-snug">{n.title}</h4>
                        <p className="text-[13px] text-slate-500 mt-0.5 leading-snug line-clamp-2">{n.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
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
                <p className="text-[13px] font-medium text-slate-400">Quỹ phép cá nhân</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-semibold text-slate-800 tracking-tight font-mono">{personalLeave.remaining}</span>
                  <span className="text-[13px] font-medium text-slate-400">/ {personalLeave.totalEntitlement} ngày</span>
                </div>
                <p className="text-[13px] font-medium text-[#0fa57c] flex items-center gap-1">
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
                <p className="text-[13px] font-medium text-slate-400">Đơn phép chờ duyệt</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-semibold text-slate-800 tracking-tight font-mono">{pendingLeavesCount}</span>
                  <span className="text-[13px] font-medium text-slate-400">yêu cầu</span>
                </div>
                <p className="text-[13px] font-medium text-slate-400">Đang cần bạn xem xét</p>
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
                <p className="text-[13px] font-medium text-slate-400">Timesheet chờ duyệt</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-semibold text-slate-800 tracking-tight font-mono">{pendingTimesheetsCount}</span>
                  <span className="text-[13px] font-medium text-slate-400">bảng công</span>
                </div>
                <p className="text-[13px] font-medium text-slate-400">Yêu cầu xác nhận tuần</p>
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
                    <h3 className="text-[13px] font-medium text-slate-800">Yêu Cầu Nghỉ Phép Mới Nhất</h3>
                    <p className="text-[13px] text-slate-400 font-medium">Đơn gửi từ nhân sự đang chờ xử lý</p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate && onNavigate('Leaves')}
                  className="text-[13px] font-medium text-[#0fa57c] hover:underline flex items-center space-x-1"
                >
                  <span>Tất cả đơn</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[13px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap bg-slate-50/50">
                      <th className="py-2.5 px-3">Họ và tên</th>
                      <th className="py-2.5 px-3">Loại phép</th>
                      <th className="py-2.5 px-3 text-center">Tổng giờ</th>
                      <th className="py-2.5 px-3">Thời gian</th>
                      <th className="py-2.5 px-3 text-center">Trạng thái</th>
                      <th className="py-2.5 px-3 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[13px]">
                    {filteredLeaves.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="py-3 px-3 font-medium text-slate-700">
                          <div>{item.fullName}</div>
                          <div className="text-[13px] text-slate-400 font-medium tracking-tight mt-0.5">{item.project}</div>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-500">{item.leaveType}</td>
                        <td className="py-3 px-3 text-center font-medium text-slate-700 font-mono">{item.totalHours}h</td>
                        <td className="py-3 px-3 text-slate-500 font-medium">
                          <div className="text-[13px] font-mono">{item.startDate}</div>
                          <div className="text-[13px] font-mono text-slate-400">{item.endDate}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex justify-center">
                            {item.status === 'Requested' ? (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[13px] font-medium rounded-md border border-amber-100">Chờ duyệt</span>
                            ) : item.status === 'Approved' ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[13px] font-medium rounded-md border border-emerald-100">Đã duyệt</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-rose-50 text-rose-500 text-[13px] font-medium rounded-md border border-rose-100">Từ chối</span>
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
                              <span className="text-[13px] text-slate-400 font-medium">Đã xử lý</span>
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
                    <h3 className="text-[13px] font-medium text-slate-800">Timesheet Cần Phê Duyệt</h3>
                    <p className="text-[13px] text-slate-400 font-medium">Hồ sơ xác nhận bảng công hàng tuần</p>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate && onNavigate('Timesheet')}
                  className="text-[13px] font-medium text-[#0fa57c] hover:underline flex items-center space-x-1"
                >
                  <span>Xem bảng công</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-[350px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-[13px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap bg-slate-50/50">
                      <th className="py-2.5 px-3">Nhân sự</th>
                      <th className="py-2.5 px-3">Dự án</th>
                      <th className="py-2.5 px-3 text-center">Trạng thái</th>
                      <th className="py-2.5 px-3 text-right">Duyệt nhanh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[13px]">
                    {filteredTimesheets.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/40 transition-colors group">
                        <td className="py-3.5 px-3 font-medium text-slate-700">{item.authorName}</td>
                        <td className="py-3.5 px-3 font-medium text-slate-500 truncate max-w-[120px]" title={item.projectName}>
                          {item.projectName}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex justify-center">
                            {item.status === 'Requested' ? (
                              <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-[13px] font-medium rounded-md border border-orange-100">Cần duyệt</span>
                            ) : item.status === 'Approved' ? (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[13px] font-medium rounded-md border border-emerald-100">Đã duyệt</span>
                            ) : item.status === 'Draft' ? (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[13px] font-medium rounded-md border border-slate-200">Nháp</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-rose-50 text-rose-500 text-[13px] font-medium rounded-md border border-rose-100">Từ chối</span>
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
                              <span className="text-[13px] text-slate-400 font-medium">Khóa</span>
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
                    <h4 className="font-semibold text-slate-900 text-[13px]">Gửi lời chúc mừng sinh nhật</h4>
                    <p className="text-[13px] text-slate-400 font-medium">Tới {wishingPerson.name}</p>
                  </div>
                </div>
                <button onClick={() => setWishingPerson(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>

              <div>
                <p className="text-[13px] font-semibold text-slate-500 mb-1.5">Mẫu thiệp</p>
                <div className="grid grid-cols-4 gap-2" data-testid="wish-themes">
                  {(Object.keys(WISH_THEMES) as WishTheme[]).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setWishTheme(k)}
                      className={`rounded-xl bg-gradient-to-br ${WISH_THEMES[k].bg} py-2 text-center cursor-pointer border transition-all ${wishTheme === k ? 'border-rose-400 ring-2 ring-rose-200' : 'border-slate-100 hover:border-slate-300'}`}
                    >
                      <span className="block text-xl leading-none">{WISH_THEMES[k].emoji}</span>
                      <span className="block text-[13px] font-medium text-slate-600 mt-1">{WISH_THEMES[k].label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {WISH_SUGGESTIONS.map((t, i) => (
                    <button key={i} type="button" onClick={() => setWishText(t)} className="px-2 py-1 rounded-lg bg-rose-50 text-rose-600 text-[13px] font-medium hover:bg-rose-100 cursor-pointer" title={t}>
                      Gợi ý {i + 1}
                    </button>
                  ))}
                </div>
                <textarea
                  autoFocus
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value.slice(0, WISH_MAX_LENGTH))}
                  maxLength={WISH_MAX_LENGTH}
                  placeholder="Nhập lời chúc của bạn (tối đa 500 ký tự)..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-medium text-slate-700 outline-none focus:border-rose-400 focus:bg-white transition-all h-32 resize-none"
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-[13px] font-medium ${wishText.length >= WISH_MAX_LENGTH ? 'text-rose-500' : 'text-slate-400'}`}>
                    {wishText.length}/{WISH_MAX_LENGTH} ký tự
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[13px] font-semibold text-slate-500 whitespace-nowrap">Ký tên</span>
                  <input
                    value={wishSign}
                    onChange={(e) => setWishSign(e.target.value.slice(0, 60))}
                    placeholder="Tên hiển thị cuối thiệp"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-700 outline-none focus:border-rose-400 focus:bg-white"
                  />
                </div>
                <p className="text-[13px] text-slate-400 mt-2">{wishingPerson.name} sẽ nhận thông báo ở chuông trên thanh đầu trang; bấm vào thông báo sẽ mở thiệp chúc của bạn.</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setWishingPerson(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[13px] font-medium transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitWish}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[13px] font-medium shadow-lg shadow-rose-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <Send size={14} /> Gửi lời chúc
                </button>
              </div>
            </motion.div>
          </div>
        )}

    </div>
  );
};
