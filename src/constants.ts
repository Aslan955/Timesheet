import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Wallet, 
  Settings, 
  Calendar, 
  Clock, 
  ClipboardList, 
  FileText, 
  Briefcase,
  UserCheck,
  Plane,
  Home,
  MessageSquare,
  Award,
  Gavel,
  Database,
  Building,
  Users2,
  Layers,
  Hash,
  Network,
  Inbox,
  PieChart,
  BellRing,
  UserPlus,
  IdCard,
  ListChecks
} from 'lucide-react';

export interface NavItem {
  title: string;
  icon: any;
  path?: string;
  children?: NavItem[];
}

export const NAVIGATION: NavItem[] = [
  {
    title: 'Project Management',
    icon: BarChart3,
    children: [
      { title: 'Work Order', icon: ClipboardList },
      { title: 'Projects', icon: Briefcase },
      { title: 'Resource Allocation', icon: Users },
      { title: 'Projects Cost Efficiency', icon: BarChart3 },
    ]
  },
  {
    title: 'Human Resources',
    icon: Users,
    children: [
      { title: 'Overview', icon: BarChart3 },
      { title: 'Employees', icon: Users },
      { title: 'Báo cáo nghỉ phép nhân sự', icon: PieChart },
      { title: 'Contracts', icon: FileText },
      { title: 'Salary History', icon: Wallet },
      { title: 'Onboarding Request', icon: UserCheck },
      { title: 'Certificate Management', icon: Award },
      { title: 'Thông tin người phụ thuộc', icon: Users },
    ]
  },
  {
    title: 'Recruitment',
    icon: UserPlus,
    children: [
      { title: 'Yêu cầu tuyển dụng', icon: Briefcase },
      { title: 'Quản lý ứng viên', icon: Users },
      {
        title: 'Danh mục tuyển dụng',
        icon: ListChecks,
        children: [
          { title: 'Nguồn ứng viên', icon: Award },
          { title: 'Trường đại học', icon: Building },
          { title: 'Chuyên ngành', icon: Layers },
          { title: 'Level ứng tuyển', icon: Hash },
          { title: 'Khối ứng tuyển', icon: Users2 },
          { title: 'Vị trí', icon: Briefcase },
          { title: 'Kỹ năng', icon: ClipboardList },
        ],
      },
    ]
  },
  {
    title: 'Sale',
    icon: ShoppingCart,
    children: [
      { title: 'Bidding', icon: Gavel },
    ]
  },
  { 
    title: 'Timekeeping', 
    icon: Clock,
    children: [
      { title: 'Overview', icon: BarChart3 },
      { title: 'Quản lý Đơn từ', icon: Inbox },
      { title: 'Timesheet', icon: Calendar },
      { title: 'Chấm công', icon: Clock },
      { title: 'Tổng hợp công', icon: FileText },
      { title: 'Overtime', icon: Clock },
      { title: 'Leaves', icon: Plane },
      { title: 'Phép cá nhân', icon: Wallet },
      { title: 'Báo cáo nghỉ phép nhân sự', icon: PieChart },
      { title: 'Onsite', icon: Home },
    ]
  },
  {
    title: 'PayRoll',
    icon: Wallet,
    children: [
      { title: 'Time Attendance', icon: Clock },
      { title: 'Payroll', icon: Wallet },
      { title: 'Báo cáo Onsite', icon: ClipboardList },
      { title: 'PayAdjustment', icon: Settings },
      { title: 'Bonus', icon: MessageSquare },
    ]
  },
  {
    title: 'System',
    icon: Settings,
    children: [
      { title: 'Holidays', icon: Calendar },
      { title: 'Roles', icon: Settings },
      { title: 'System Configuration', icon: Settings },
      { title: 'Users', icon: UserPlus },
    ]
  },
  {
    title: 'Catalog',
    icon: Database,
    children: [
      { title: 'Company', icon: Building },
      { title: 'Customers', icon: Users2 },
      { title: 'Position & Level', icon: Award },
      { title: 'Project Types', icon: Layers },
      { title: 'Department Sign', icon: Hash },
    ]
  },
  {
    title: 'Utilities',
    icon: Home,
    children: [
      { title: 'Organization', icon: Network },
      { title: 'Request Management', icon: Inbox },
      { title: 'Leaves Report', icon: PieChart },
      { title: 'Noti Management', icon: BellRing },
    ]
  }
];

export interface LeaveRequest {
  id: string;
  employeeId: string;
  fullName: string;
  project: string;
  createdAt: string;
  lastModificationTime: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalHours: number;
  status: 'Requested' | 'Approved' | 'Rejected';
  approvedBy?: string;
}

export const MOCK_LEAVES: LeaveRequest[] = [
  {
    id: '1',
    employeeId: 'V00623',
    fullName: 'HỒ TÚ ANH',
    project: 'A.25.022.HTBTC',
    createdAt: '17/04/2026',
    lastModificationTime: '17/04/2026',
    leaveType: 'Maternity Leave',
    startDate: '17/04/2026 08:00',
    endDate: '22/04/2026 11:12',
    totalHours: 27.2,
    status: 'Requested'
  },
  {
    id: '2',
    employeeId: 'V00914',
    fullName: 'hồ long nhật man',
    project: 'X.24.NB.PMO',
    createdAt: '17/04/2026',
    lastModificationTime: '17/04/2026',
    leaveType: 'Wedding leave',
    startDate: '17/04/2026 08:00',
    endDate: '17/04/2026 17:30',
    totalHours: 8,
    status: 'Requested'
  },
  {
    id: '3',
    employeeId: 'V00437',
    fullName: 'admin',
    project: 'S.23.NB.SND.IMIS_TEST',
    createdAt: '13/04/2026',
    lastModificationTime: '17/04/2026',
    leaveType: 'Annual leave',
    startDate: '26/03/2026 08:00',
    endDate: '26/03/2026 17:00',
    totalHours: 7.5,
    status: 'Requested'
  },
  {
    id: '4',
    employeeId: 'V00914',
    fullName: 'hồ long nhật man',
    project: 'V.25.H.FX.039.03',
    createdAt: '26/03/2026',
    lastModificationTime: '26/03/2026',
    leaveType: 'Annual leave',
    startDate: '26/03/2026 08:00',
    endDate: '26/03/2026 17:30',
    totalHours: 8,
    status: 'Approved',
    approvedBy: 'admin admin'
  }
];

// Ảnh minh chứng mẫu (data URI) cho phần giải trình chấm công.
export const SAMPLE_EVIDENCE_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Crect width='120' height='80' rx='6' fill='%23e0e7ff'/%3E%3Cpath d='M18 62 L44 34 L60 50 L82 28 L104 62 Z' fill='%236366f1'/%3E%3Ccircle cx='88' cy='24' r='7' fill='%23fbbf24'/%3E%3C/svg%3E";

export interface TimesheetEntry {
  id: string;
  projectCode: string;
  projectName: string;
  authorName: string;
  authorKey: string;
  department: string;
  periodType: 'week' | 'month';
  periodName: string;
  month: string;
  weekNumber: number;
  jiraHours: number;
  imisHours: number;
  leaveDays?: number;
  submitDate?: string;
  approvalRejectDate?: string;
  differenceHours: number;
  comparisonStatus: 'MATCH' | 'DISCREPANCY_DEFICIT' | 'DISCREPANCY_SURPLUS' | 'NO_CHECKIN';
  explanationStatus: 'NOT_NEEDED' | 'EXPLAINED_APPROVED' | 'PENDING_EXPLANATION' | 'NEEDS_EXPLANATION';
  explanationNote?: string;
  hasEvidenceDoc?: boolean;
  status: 'REVIEW' | 'APPROVED' | 'REJECTED';
  lastSyncTime: string;
  dailyDetails?: {
    date: string;
    dayOfWeek: string;
    jiraHours: number;
    imisHours: number;
    checkIn?: string;
    checkOut?: string;
    jiraTask?: string;
    // Khi 1 ngày có nhiều task Jira (có thể thuộc nhiều dự án): liệt kê từng task kèm số giờ & mã dự án.
    tasks?: { key: string; hours: number; title?: string; project?: string }[];
    note?: string;
    leaveHours?: number;
    // Giải trình chấm công: ghi chú + ảnh đính kèm minh chứng.
    explainNote?: string;
    attachments?: { name: string; url: string }[];
  }[];
}

export const MOCK_TIMESHEETS: TimesheetEntry[] = [
  {
    id: 'TS-001',
    projectCode: 'V.26.G.FX.103.66.S',
    projectName: 'Hệ thống Quản lý Dự án V26 Core',
    authorName: 'Bùi Ngọc Thanh Trúc',
    authorKey: 'trucbnt',
    department: 'Software Development',
    periodType: 'week',
    periodName: 'Tuần 32 (03/08/2026 - 09/08/2026)',
    month: '2026-08',
    weekNumber: 32,
    jiraHours: 40.0,
    imisHours: 40.0,
    leaveDays: 0,
    submitDate: '07/08/2026 17:30',
    approvalRejectDate: '-',
    differenceHours: 0.0,
    comparisonStatus: 'MATCH',
    explanationStatus: 'NOT_NEEDED',
    explanationNote: 'Dữ liệu chấm công khớp 100% giữa Jira và vân tay Imis',
    hasEvidenceDoc: false,
    status: 'REVIEW',
    lastSyncTime: '10/08/2026 08:30',
    dailyDetails: [
      { date: '03/08/2026', dayOfWeek: 'T2', jiraHours: 8.0, imisHours: 8.0, checkIn: '08:00', checkOut: '17:30', tasks: [
        { key: 'FX-1031', hours: 3.0, title: 'Refactor UI Dashboard' },
        { key: 'FX-1033', hours: 3.0, title: 'Fix login redirect bug' },
        { key: 'FX-1040', hours: 2.0, title: 'Unit Testing' },
      ] },
      { date: '04/08/2026', dayOfWeek: 'T3', jiraHours: 8.0, imisHours: 8.0, checkIn: '08:02', checkOut: '17:32', jiraTask: 'FX-1032: Optimize DB Queries' },
      { date: '05/08/2026', dayOfWeek: 'T4', jiraHours: 8.0, imisHours: 8.0, checkIn: '07:58', checkOut: '17:30', jiraTask: 'FX-1035: API Integration' },
      { date: '06/08/2026', dayOfWeek: 'T5', jiraHours: 8.0, imisHours: 8.0, checkIn: '08:05', checkOut: '17:35', jiraTask: 'FX-1040: Unit Testing' },
      { date: '07/08/2026', dayOfWeek: 'T6', jiraHours: 8.0, imisHours: 8.0, checkIn: '08:00', checkOut: '17:30', jiraTask: 'FX-1042: Code Review & Deployment' },
    ]
  },
  {
    id: 'TS-MULTI',
    projectCode: 'ĐA-DỰ-ÁN',
    projectName: 'Tổng hợp log nhiều dự án trong ngày (Test)',
    authorName: 'Nguyễn Văn An',
    authorKey: 'annv',
    department: 'Software Development',
    periodType: 'week',
    periodName: 'Tuần 32 (03/08/2026 - 09/08/2026)',
    month: '2026-08',
    weekNumber: 32,
    jiraHours: 40.0,
    imisHours: 40.0,
    leaveDays: 0,
    submitDate: '08/08/2026 17:45',
    approvalRejectDate: '-',
    differenceHours: 0.0,
    comparisonStatus: 'MATCH',
    explanationStatus: 'NOT_NEEDED',
    explanationNote: 'Nhân sự log giờ trên nhiều dự án khác nhau trong cùng 1 ngày.',
    hasEvidenceDoc: false,
    status: 'REVIEW',
    lastSyncTime: '10/08/2026 08:30',
    dailyDetails: [
      { date: '03/08/2026', dayOfWeek: 'T2', jiraHours: 8.0, imisHours: 8.0, checkIn: '08:00', checkOut: '17:30', tasks: [
        { key: 'FX-1031', hours: 3.0, title: 'Refactor UI Dashboard', project: 'V.26.G.FX.103.66.S' },
        { key: 'ADB-210', hours: 3.0, title: 'Fix lỗi chuyển khoản liên ngân hàng', project: 'X.25.NB.ADB' },
        { key: 'DN-045', hours: 2.0, title: 'Họp yêu cầu chuyển đổi số', project: '022.060.2' },
      ] },
      { date: '04/08/2026', dayOfWeek: 'T3', jiraHours: 8.0, imisHours: 8.0, checkIn: '08:05', checkOut: '17:32', tasks: [
        { key: 'ADB-215', hours: 4.0, title: 'Tối ưu truy vấn báo cáo', project: 'X.25.NB.ADB' },
        { key: 'AI-320', hours: 4.0, title: 'Huấn luyện mô hình phân loại', project: 'V.25.G.RD.C12.43' },
      ] },
      { date: '05/08/2026', dayOfWeek: 'T4', jiraHours: 8.0, imisHours: 8.0, checkIn: '07:58', checkOut: '17:30', tasks: [
        { key: 'SC-112', hours: 5.0, title: 'Tích hợp cảm biến giao thông', project: 'H99.212.2' },
        { key: 'FX-1055', hours: 3.0, title: 'Sửa API phân quyền', project: 'V.26.G.FX.103.66.S' },
      ] },
      { date: '06/08/2026', dayOfWeek: 'T5', jiraHours: 8.0, imisHours: 8.0, checkIn: '08:03', checkOut: '17:31', jiraTask: 'ICU-501: Quản lý hồ sơ bệnh án' },
      { date: '07/08/2026', dayOfWeek: 'T6', jiraHours: 8.0, imisHours: 8.0, checkIn: '08:00', checkOut: '17:30', tasks: [
        { key: 'ADB-220', hours: 4.0, title: 'Kiểm thử tích hợp OTP', project: 'X.25.NB.ADB' },
        { key: 'DN-050', hours: 4.0, title: 'Bàn giao module hộ tịch', project: '022.060.2' },
      ] },
    ]
  },
  {
    id: 'TS-002',
    projectCode: 'X.25.NB.ADB',
    projectName: 'Ứng dụng Ngân hàng Điện tử ADB Mobile',
    authorName: 'Bùi Ngọc Thanh Trúc',
    authorKey: 'trucbnt',
    department: 'Software Development',
    periodType: 'month',
    periodName: 'Tháng 08/2026 (01/08 - 31/08/2026)',
    month: '2026-08',
    weekNumber: 32,
    jiraHours: 160.0,
    imisHours: 156.0,
    leaveDays: 0.5,
    submitDate: '08/08/2026 09:15',
    approvalRejectDate: '-',
    differenceHours: -4.0,
    comparisonStatus: 'DISCREPANCY_DEFICIT',
    explanationStatus: 'EXPLAINED_APPROVED',
    explanationNote: 'Giải trình: Thiếu 4.0h do đi công tác Onsite tại Khách hàng ADB ngày 05/08 (Đã duyệt đơn Onsite #ON-8821)',
    hasEvidenceDoc: true,
    status: 'REVIEW',
    lastSyncTime: '10/08/2026 08:30',
    dailyDetails: [
      { date: '05/08/2026', dayOfWeek: 'T4', jiraHours: 8.0, imisHours: 4.0, checkIn: '08:00', checkOut: '12:00', jiraTask: 'ADB-201: Meeting at ADB Bank Headquarters', note: 'Đi Onsite buổi chiều theo đơn #ON-8821' },
    ]
  },
  {
    id: 'TS-003',
    projectCode: 'V.26.G.FX.103.66.S',
    projectName: 'Hệ thống Quản lý Dự án V26 Core',
    authorName: 'Bùi Quang Tuyền',
    authorKey: 'tuyenbq',
    department: 'Backend Engineering',
    periodType: 'week',
    periodName: 'Tuần 32 (03/08/2026 - 09/08/2026)',
    month: '2026-08',
    weekNumber: 32,
    jiraHours: 42.0,
    imisHours: 40.0,
    leaveDays: 0,
    submitDate: '07/08/2026 18:10',
    approvalRejectDate: '-',
    differenceHours: 2.0,
    comparisonStatus: 'DISCREPANCY_SURPLUS',
    explanationStatus: 'EXPLAINED_APPROVED',
    explanationNote: 'Giải trình: Làm thêm giờ 2.0h OT hỗ trợ Hotfix Release đêm 06/08 (Đơn OT #OT-9012 đã phê duyệt)',
    hasEvidenceDoc: true,
    status: 'REVIEW',
    lastSyncTime: '10/08/2026 08:30',
  },
  {
    id: 'TS-004',
    projectCode: '022.060.2',
    projectName: 'Chuyển đổi số Tỉnh Đồng Nai 2026',
    authorName: 'Bùi Thị Hà',
    authorKey: 'habt',
    department: 'QA & Testing',
    periodType: 'month',
    periodName: 'Tháng 08/2026 (01/08 - 31/08/2026)',
    month: '2026-08',
    weekNumber: 32,
    jiraHours: 168.0,
    imisHours: 160.0,
    leaveDays: 1.0,
    submitDate: '08/08/2026 10:00',
    approvalRejectDate: '-',
    differenceHours: -8.0,
    comparisonStatus: 'DISCREPANCY_DEFICIT',
    explanationStatus: 'NEEDS_EXPLANATION',
    explanationNote: 'Cần giải trình: Lệch 8.0h giữa log Jira và máy chấm công vân tay. Chưa có đơn xin phép đi kèm.',
    hasEvidenceDoc: false,
    status: 'REVIEW',
    lastSyncTime: '10/08/2026 08:30',
  },
  {
    id: 'TS-005',
    projectCode: '838.168.2',
    projectName: 'Nền tảng Tích hợp Dữ liệu Doanh nghiệp',
    authorName: 'Bùi Thị Kim Dung',
    authorKey: 'dungbtk',
    department: 'Data Analytics',
    periodType: 'week',
    periodName: 'Tuần 32 (03/08/2026 - 09/08/2026)',
    month: '2026-08',
    weekNumber: 32,
    jiraHours: 40.0,
    imisHours: 40.0,
    leaveDays: 0,
    submitDate: '07/08/2026 16:50',
    approvalRejectDate: '-',
    differenceHours: 0.0,
    comparisonStatus: 'MATCH',
    explanationStatus: 'NOT_NEEDED',
    explanationNote: 'Dữ liệu chấm công hoàn toàn trùng khớp',
    hasEvidenceDoc: false,
    status: 'REVIEW',
    lastSyncTime: '10/08/2026 08:30',
  },
  {
    id: 'TS-006',
    projectCode: 'V.25.G.RD.C12.43',
    projectName: 'Nghiên cứu AI & Học máy trong Y tế',
    authorName: 'Bùi Văn Đoàn',
    authorKey: 'doanbv',
    department: 'R&D Center',
    periodType: 'month',
    periodName: 'Tháng 08/2026 (01/08 - 31/08/2026)',
    month: '2026-08',
    weekNumber: 32,
    jiraHours: 160.0,
    imisHours: 160.0,
    leaveDays: 0,
    submitDate: '06/08/2026 17:00',
    approvalRejectDate: '09/08/2026 09:30',
    differenceHours: 0.0,
    comparisonStatus: 'MATCH',
    explanationStatus: 'NOT_NEEDED',
    explanationNote: 'Khớp 100% dữ liệu vân tay và Jira Log',
    hasEvidenceDoc: false,
    status: 'APPROVED',
    lastSyncTime: '10/08/2026 08:30',
  },
  {
    id: 'TS-007',
    projectCode: '012.010.2',
    projectName: 'Cổng Dịch vụ công Quốc gia Phase 3',
    authorName: 'Bùi Văn Đoàn',
    authorKey: 'doanbv',
    department: 'R&D Center',
    periodType: 'week',
    periodName: 'Tuần 32 (03/08/2026 - 09/08/2026)',
    month: '2026-08',
    weekNumber: 32,
    jiraHours: 40.0,
    imisHours: 36.0,
    leaveDays: 0.5,
    submitDate: '08/08/2026 11:20',
    approvalRejectDate: '-',
    differenceHours: -4.0,
    comparisonStatus: 'DISCREPANCY_DEFICIT',
    explanationStatus: 'PENDING_EXPLANATION',
    explanationNote: 'Giải trình: Đang chờ Quản lý dự án phê duyệt đơn Làm việc từ xa (WFH) ngày 07/08',
    hasEvidenceDoc: true,
    status: 'REVIEW',
    lastSyncTime: '10/08/2026 08:30',
  },
  {
    id: 'TS-008',
    projectCode: 'H99.212.2',
    projectName: 'Hệ thống Smart City & Traffic Control',
    authorName: 'Cao Bắc Tiến',
    authorKey: 'tiencb',
    department: 'IoT Solutions',
    periodType: 'week',
    periodName: 'Tuần 32 (03/08/2026 - 09/08/2026)',
    month: '2026-08',
    weekNumber: 32,
    jiraHours: 40.0,
    imisHours: 40.0,
    leaveDays: 0,
    submitDate: '07/08/2026 17:15',
    approvalRejectDate: '-',
    differenceHours: 0.0,
    comparisonStatus: 'MATCH',
    explanationStatus: 'NOT_NEEDED',
    explanationNote: 'Khớp 100% chuẩn xác',
    hasEvidenceDoc: false,
    status: 'REVIEW',
    lastSyncTime: '10/08/2026 08:30',
  },
  {
    id: 'TS-009',
    projectCode: 'ICU.565',
    projectName: 'Phần mềm Quản lý Bệnh viện ICU Cloud',
    authorName: 'Cao Bắc Tiến',
    authorKey: 'tiencb',
    department: 'IoT Solutions',
    periodType: 'month',
    periodName: 'Tháng 08/2026 (01/08 - 31/08/2026)',
    month: '2026-08',
    weekNumber: 32,
    jiraHours: 160.0,
    imisHours: 152.0,
    leaveDays: 1.0,
    submitDate: '08/08/2026 14:00',
    approvalRejectDate: '-',
    differenceHours: -8.0,
    comparisonStatus: 'DISCREPANCY_DEFICIT',
    explanationStatus: 'NEEDS_EXPLANATION',
    explanationNote: 'Cần giải trình: Thiếu 8.0h công do quên quẹt thẻ ngày 03/08. Vui lòng gửi đơn giải trình bổ sung công.',
    hasEvidenceDoc: false,
    status: 'REVIEW',
    lastSyncTime: '10/08/2026 08:30',
  },
  {
    id: 'TS-010',
    projectCode: 'X.24.NB.PMO',
    projectName: 'Quản lý Tiến độ PMO Doanh nghiệp',
    authorName: 'Hồ Tú Anh',
    authorKey: 'anht',
    department: 'PMO Office',
    periodType: 'week',
    periodName: 'Tuần 32 (03/08/2026 - 09/08/2026)',
    month: '2026-08',
    weekNumber: 32,
    jiraHours: 40.0,
    imisHours: 40.0,
    leaveDays: 0,
    submitDate: '07/08/2026 17:00',
    approvalRejectDate: '09/08/2026 11:15',
    differenceHours: 0.0,
    comparisonStatus: 'MATCH',
    explanationStatus: 'NOT_NEEDED',
    explanationNote: 'Khớp 100%',
    hasEvidenceDoc: false,
    status: 'APPROVED',
    lastSyncTime: '10/08/2026 08:30',
  }
];

export interface LeaveBalance {
  id: string;
  employeeId: string;
  fullName: string;
  year: number;
  totalEntitlement: number; // Tổng phép năm nay
  carriedForward: number; // Phép tồn năm ngoái
  granted: number; // Phép được cấp thêm
  used: number; // Phép đã dùng
  remaining: number; // Phép còn lại
  pendingApproval: number; // Phép đang chờ duyệt
}

export interface LeaveHistory {
  date: string;
  amount: number;
  type: 'plus' | 'minus';
  reason: string;
  person?: string;
}

export interface HRTicket {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  days: number;
  status: 'Pending HR' | 'Added' | 'Rejected';
  reason?: string;
  createdAt: string;
  evidence?: boolean;
}

export const MOCK_PERSONAL_LEAVE: LeaveBalance = {
  id: '1',
  employeeId: 'V00437',
  fullName: 'admin',
  year: 2026,
  totalEntitlement: 18,
  carriedForward: 2,
  granted: 3,
  used: 7.5,
  remaining: 15.5,
  pendingApproval: 1.5
};

export const MOCK_LEAVE_HISTORY: LeaveHistory[] = [
  { date: '10/05/2026', amount: 3.0, type: 'plus', reason: 'Cấp phép kết hôn', person: 'HR admin' },
  { date: '05/05/2026', amount: 2.0, type: 'minus', reason: 'Nghỉ ốm', person: 'Manager Hồ Tú Anh' },
  { date: '01/05/2026', amount: 1.0, type: 'plus', reason: 'Hệ thống tự động cộng hàng tháng' },
];

export const MOCK_HR_TICKETS: HRTicket[] = [
  { id: 'T1', employeeId: 'V00437', employeeName: 'admin', type: 'Đơn cộng phép kết hôn', days: 3, status: 'Added', createdAt: '10/05/2026', evidence: true },
  { id: 'T2', employeeId: 'V00623', employeeName: 'HỒ TÚ ANH', type: 'Phép thai sản bổ sung', days: 5, status: 'Pending HR', createdAt: '12/05/2026', evidence: true },
  { id: 'T3', employeeId: 'V00914', employeeName: 'hồ long nhật man', type: 'Phép hiếu hỉ', days: 2, status: 'Pending HR', createdAt: '13/05/2026', evidence: false },
];

export interface GlobalLedgerEntry {
  id: string;
  timestamp: string;
  employeeName: string;
  action: string;
  amount: number;
  performer: string;
  balanceAfter: number;
  source: 'System' | 'Ticket' | 'Manual';
  dept: string;
}

export interface LeaveTypeConfig {
  id: string;
  name: string;
  standardDays: number;
  evidenceRequired: boolean;
  validityDays: number;
}

export const MOCK_LEAVE_TYPES: LeaveTypeConfig[] = [
  { id: 'LT1', name: 'Kết hôn', standardDays: 3, evidenceRequired: true, validityDays: 30 },
  { id: 'LT2', name: 'Tang chế (Tứ thân phụ mẫu)', standardDays: 3, evidenceRequired: true, validityDays: 30 },
  { id: 'LT3', name: 'Thai sản', standardDays: 180, evidenceRequired: true, validityDays: 365 },
  { id: 'LT4', name: 'Nghỉ khám thai', standardDays: 5, evidenceRequired: true, validityDays: 90 },
];

export interface SystemConfig {
  accrualDay: number;
  accrualValue: number;
  accrualProbation: boolean;
  maxNegativeBalance: number;
  carryoverDate: string;
  maxCarryoverDays: number;
  minLeaveUnit: 'Day' | 'Half Day' | 'Hour';
}

export const MOCK_SYSTEM_CONFIG: SystemConfig = {
  accrualDay: 1,
  accrualValue: 1.0,
  accrualProbation: false,
  maxNegativeBalance: 2,
  carryoverDate: '31/03',
  maxCarryoverDays: 5,
  minLeaveUnit: 'Half Day'
};

export const MOCK_GLOBAL_LEDGER: GlobalLedgerEntry[] = [
  { id: 'L1', timestamp: '14/05/2026 09:30', employeeName: 'HỒ TÚ ANH', action: 'Cộng phép thai sản', amount: 5, performer: 'HR Admin', balanceAfter: 14.5, source: 'Ticket', dept: 'Development' },
  { id: 'L2', timestamp: '01/05/2026 00:00', employeeName: 'Nguyễn Văn A', action: 'Hệ thống tự động cộng hàng tháng', amount: 1, performer: 'System', balanceAfter: 13.5, source: 'System', dept: 'Development' },
  { id: 'L3', timestamp: '10/05/2026 14:15', employeeName: 'admin', action: 'Thưởng hiệu suất năm', amount: 2, performer: 'HR Admin', balanceAfter: 15.5, source: 'Manual', dept: 'HR' },
];

export interface TeamLeaveRequest {
  id: string;
  employeeName: string;
  avatar: string;
  position: string;
  type: 'Nghỉ phép (Trừ hũ)' | 'Nghỉ không lương';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  currentBalance: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export const MOCK_TEAM_REQUESTS: TeamLeaveRequest[] = [
  {
    id: 'TR1',
    employeeName: 'Nguyễn Văn A',
    avatar: 'https://ui-avatars.com/api/?name=NV+A&background=random',
    position: 'Developer',
    type: 'Nghỉ phép (Trừ hũ)',
    startDate: '15/05/2026',
    endDate: '16/05/2026',
    totalDays: 2,
    reason: 'Giải quyết việc gia đình',
    currentBalance: 12.5,
    status: 'Pending'
  },
  {
    id: 'TR2',
    employeeName: 'Lê Thị B',
    avatar: 'https://ui-avatars.com/api/?name=LT+B&background=random',
    position: 'Tester',
    type: 'Nghỉ không lương',
    startDate: '14/05/2026',
    endDate: '14/05/2026',
    totalDays: 1,
    reason: 'Đi khám bệnh',
    currentBalance: 5,
    status: 'Pending'
  },
  {
    id: 'TR3',
    employeeName: 'Trần Văn C',
    avatar: 'https://ui-avatars.com/api/?name=TV+C&background=random',
    position: 'Designer',
    type: 'Nghỉ phép (Trừ hũ)',
    startDate: '20/05/2026',
    endDate: '25/05/2026',
    totalDays: 6,
    reason: 'Du lịch hè',
    currentBalance: 18,
    status: 'Pending'
  }
];

export const MOCK_LEAVE_BALANCES: LeaveBalance[] = [
  {
    id: '1',
    employeeId: 'V00623',
    fullName: 'HỒ TÚ ANH',
    year: 2026,
    totalEntitlement: 12,
    carriedForward: 2,
    granted: 0,
    used: 4.5,
    remaining: 9.5,
    pendingApproval: 0
  },
  {
    id: '2',
    employeeId: 'V00914',
    fullName: 'hồ long nhật man',
    year: 2026,
    totalEntitlement: 14,
    carriedForward: 5,
    granted: 1,
    used: 2,
    remaining: 18,
    pendingApproval: 1
  },
  {
    id: '3',
    employeeId: 'V00437',
    fullName: 'admin',
    year: 2026,
    totalEntitlement: 18,
    carriedForward: 0,
    granted: 3,
    used: 7.5,
    remaining: 10.5,
    pendingApproval: 1.5
  }
];

export interface LeaveHistoryItem {
  id: string;
  date: string;
  type: 'plus' | 'minus';
  amount: number;
  reason: string;
  performer: string;
  balanceAfter: number;
}

export interface EmployeeLeaveReportData {
  employeeId: string;       // mã nhân viên
  employeeName: string;     // tên nhân viên
  username: string;         // user
  department: string;       // phòng ban
  position: string;         // vị trí
  avatar: string;           // ảnh đại diện
  remainingDays: number;    // phép còn lại
  usedDays: number;         // phép đã dùng
  grantedDays: number;      // số phép được cộng
  totalEntitlement: number; // tổng định mức phép
  history: LeaveHistoryItem[]; // lịch sử cộng trừ phép
}

export const MOCK_EMPLOYEE_LEAVE_REPORTS: EmployeeLeaveReportData[] = [
  {
    employeeId: 'V00437',
    employeeName: 'Nguyễn Văn An',
    username: 'an.nv',
    department: 'Development',
    position: 'Senior Software Engineer',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+An&background=0fa57c&color=fff&bold=true',
    remainingDays: 11.5,
    usedDays: 3.5,
    grantedDays: 3.0,
    totalEntitlement: 15.0,
    history: [
      { id: 'H101', date: '10/05/2026 14:30', type: 'plus', amount: 3.0, reason: 'Cộng phép chế độ kết hôn', performer: 'HR Admin', balanceAfter: 15.0 },
      { id: 'H102', date: '05/05/2026 09:15', type: 'minus', amount: 2.0, reason: 'Nghỉ phép cá nhân (Giải quyết việc nhà)', performer: 'Trần Văn B (Manager)', balanceAfter: 12.0 },
      { id: 'H103', date: '18/04/2026 11:00', type: 'minus', amount: 1.5, reason: 'Nghỉ nửa ngày sáng + chiều', performer: 'Trần Văn B (Manager)', balanceAfter: 14.0 },
      { id: 'H104', date: '01/01/2026 00:00', type: 'plus', amount: 12.0, reason: 'Cấp phép chuẩn năm 2026', performer: 'Hệ thống (System)', balanceAfter: 12.0 },
    ]
  },
  {
    employeeId: 'V00623',
    employeeName: 'Hồ Tú Anh',
    username: 'anh.ht',
    department: 'Development',
    position: 'Project Manager',
    avatar: 'https://ui-avatars.com/api/?name=Ho+Tu+Anh&background=3b82f6&color=fff&bold=true',
    remainingDays: 9.5,
    usedDays: 4.5,
    grantedDays: 2.0,
    totalEntitlement: 14.0,
    history: [
      { id: 'H201', date: '12/05/2026 10:00', type: 'plus', amount: 2.0, reason: 'Cộng phép OT đổi ngày nghỉ', performer: 'HR Admin', balanceAfter: 14.0 },
      { id: 'H202', date: '02/05/2026 08:30', type: 'minus', amount: 3.0, reason: 'Nghỉ phép năm đi du lịch', performer: 'Nguyễn Văn An (Director)', balanceAfter: 12.0 },
      { id: 'H203', date: '15/03/2026 16:45', type: 'minus', amount: 1.5, reason: 'Nghỉ việc gia đình', performer: 'Nguyễn Văn An (Director)', balanceAfter: 15.0 },
      { id: 'H204', date: '01/01/2026 00:00', type: 'plus', amount: 12.0, reason: 'Cấp phép chuẩn năm 2026', performer: 'Hệ thống (System)', balanceAfter: 12.0 },
    ]
  },
  {
    employeeId: 'V00914',
    employeeName: 'Hồ Long Nhật Man',
    username: 'man.hln',
    department: 'Tester',
    position: 'QA Tech Lead',
    avatar: 'https://ui-avatars.com/api/?name=Ho+Long+Nhat+Man&background=8b5cf6&color=fff&bold=true',
    remainingDays: 18.0,
    usedDays: 2.0,
    grantedDays: 5.0,
    totalEntitlement: 20.0,
    history: [
      { id: 'H301', date: '08/05/2026 15:20', type: 'plus', amount: 5.0, reason: 'Cộng phép thâm niên 5 năm', performer: 'HR Admin', balanceAfter: 20.0 },
      { id: 'H302', date: '20/04/2026 13:00', type: 'minus', amount: 2.0, reason: 'Nghỉ khám sức khỏe định kỳ', performer: 'Hồ Tú Anh (PM)', balanceAfter: 15.0 },
      { id: 'H303', date: '01/01/2026 00:00', type: 'plus', amount: 15.0, reason: 'Cấp phép chuẩn năm 2026 (Bao gồm tồn năm 2025)', performer: 'Hệ thống (System)', balanceAfter: 15.0 },
    ]
  },
  {
    employeeId: 'V00108',
    employeeName: 'Trần Văn Bình',
    username: 'binh.tv',
    department: 'Designer',
    position: 'UI/UX Designer',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Van+Binh&background=f59e0b&color=fff&bold=true',
    remainingDays: 6.0,
    usedDays: 8.0,
    grantedDays: 2.0,
    totalEntitlement: 14.0,
    history: [
      { id: 'H401', date: '11/05/2026 09:00', type: 'plus', amount: 2.0, reason: 'Cộng phép thành tích dự án xuất sắc', performer: 'HR Admin', balanceAfter: 14.0 },
      { id: 'H402', date: '28/04/2026 14:10', type: 'minus', amount: 4.0, reason: 'Nghỉ giải quyết công việc cá nhân', performer: 'Trần Văn B (Manager)', balanceAfter: 12.0 },
      { id: 'H403', date: '10/03/2026 10:30', type: 'minus', amount: 4.0, reason: 'Nghỉ phép năm', performer: 'Trần Văn B (Manager)', balanceAfter: 16.0 },
      { id: 'H404', date: '01/01/2026 00:00', type: 'plus', amount: 12.0, reason: 'Cấp phép chuẩn năm 2026', performer: 'Hệ thống (System)', balanceAfter: 12.0 },
    ]
  },
  {
    employeeId: 'V00215',
    employeeName: 'Lê Thị Cúc',
    username: 'cuc.lt',
    department: 'HR',
    position: 'HR Specialist',
    avatar: 'https://ui-avatars.com/api/?name=Le+Thi+Cuc&background=ec4899&color=fff&bold=true',
    remainingDays: 13.5,
    usedDays: 1.5,
    grantedDays: 1.0,
    totalEntitlement: 15.0,
    history: [
      { id: 'H501', date: '01/05/2026 00:00', type: 'plus', amount: 1.0, reason: 'Cộng phép thâm niên hàng tháng', performer: 'Hệ thống (System)', balanceAfter: 15.0 },
      { id: 'H502', date: '15/04/2026 08:00', type: 'minus', amount: 1.5, reason: 'Nghỉ phép năm', performer: 'Admin', balanceAfter: 14.0 },
      { id: 'H503', date: '01/01/2026 00:00', type: 'plus', amount: 14.0, reason: 'Cấp phép chuẩn năm 2026', performer: 'Hệ thống (System)', balanceAfter: 14.0 },
    ]
  },
  {
    employeeId: 'V00388',
    employeeName: 'Phạm Đức Dũng',
    username: 'dung.pd',
    department: 'Production',
    position: 'DevOps Engineer',
    avatar: 'https://ui-avatars.com/api/?name=Pham+Duc+Dung&background=06b6d4&color=fff&bold=true',
    remainingDays: 7.0,
    usedDays: 6.0,
    grantedDays: 1.0,
    totalEntitlement: 13.0,
    history: [
      { id: 'H601', date: '04/05/2026 11:20', type: 'plus', amount: 1.0, reason: 'Cộng phép OT trực hệ thống cuối tuần', performer: 'HR Admin', balanceAfter: 13.0 },
      { id: 'H602', date: '22/04/2026 09:00', type: 'minus', amount: 6.0, reason: 'Nghỉ phép gia đình', performer: 'Hồ Tú Anh (PM)', balanceAfter: 12.0 },
      { id: 'H603', date: '01/01/2026 00:00', type: 'plus', amount: 12.0, reason: 'Cấp phép chuẩn năm 2026', performer: 'Hệ thống (System)', balanceAfter: 12.0 },
    ]
  },
  {
    employeeId: 'V00502',
    employeeName: 'Vũ Hoàng Giang',
    username: 'giang.vh',
    department: 'Marketing',
    position: 'Marketing Manager',
    avatar: 'https://ui-avatars.com/api/?name=Vu+Hoang+Giang&background=10b981&color=fff&bold=true',
    remainingDays: 14.0,
    usedDays: 2.0,
    grantedDays: 4.0,
    totalEntitlement: 16.0,
    history: [
      { id: 'H701', date: '09/05/2026 16:00', type: 'plus', amount: 4.0, reason: 'Cộng phép thai sản bổ sung (Vợ sinh em bé)', performer: 'HR Admin', balanceAfter: 16.0 },
      { id: 'H702', date: '14/04/2026 10:15', type: 'minus', amount: 2.0, reason: 'Nghỉ việc riêng', performer: 'Admin', balanceAfter: 12.0 },
      { id: 'H703', date: '01/01/2026 00:00', type: 'plus', amount: 12.0, reason: 'Cấp phép chuẩn năm 2026', performer: 'Hệ thống (System)', balanceAfter: 12.0 },
    ]
  }
];

