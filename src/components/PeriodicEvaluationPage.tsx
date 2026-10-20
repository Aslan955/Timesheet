import React, { useState, useMemo } from 'react';
import { 
  Calendar,
  CalendarDays,
  Search,
  Filter,
  AlertTriangle,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Eye,
  CheckCircle,
  CheckCircle2,
  Clock,
  User,
  Users,
  Building,
  Check,
  X,
  ChevronRight,
  TrendingUp,
  Award,
  ChevronLeft,
  Briefcase,
  HelpCircle,
  BarChart3,
  FileText,
  UserCheck,
  ShieldAlert,
  ArrowUpDown,
  ArrowDown,
  Home,
  Send,
  Paperclip,
  Upload,
  Sparkles,
  Mail,
  FileCheck,
  Info,
  Printer,
  Lock,
  Unlock,
  Target,
  PieChart,
  Layers
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useLanguage } from '../i18n/LanguageContext';

export type EvaluationDeadlineStatus = 'OVERDUE' | 'DUE_TODAY' | 'UPCOMING' | 'NOT_DUE' | 'CLOSED';
export type EvaluationProgressStatus = 'IN_PROGRESS' | 'NOT_STARTED' | 'COMPLETED' | 'CANCELLED';
export type EvaluationStage = 'NOT_SENT' | 'WAITING_SELF_REVIEW' | 'WAITING_MANAGER_REVIEW' | 'COMPLETED';

// 3 Role người dùng theo yêu cầu phân biệt góc nhìn & hành vi
export type EvaluationUserRole = 'HR_ADMIN' | 'EMPLOYEE' | 'MANAGER';

export interface RoleConfig {
  id: EvaluationUserRole;
  title: string;
  shortTitle: string;
  badge: string;
  personaName: string;
  personaTitle: string;
  department: string;
  avatarText: string;
  avatarBg: string;
  accentColor: string;
  perspectiveDesc: string;
  behaviorDesc: string;
  primaryActions: string[];
}

export const getRoleConfigs = (lang: 'vi' | 'en' = 'vi'): Record<EvaluationUserRole, RoleConfig> => {
  const isEn = lang === 'en';
  return {
    HR_ADMIN: {
      id: 'HR_ADMIN',
      title: isEn ? 'Human Resources Admin (HR)' : 'Hành Chính Nhân Sự (HCNS)',
      shortTitle: isEn ? 'HR Admin (HR)' : 'HCNS (HR)',
      badge: isEn ? 'Administration & Coordination' : 'Quản trị & Điều phối toàn diện',
      personaName: 'Nguyễn Thị Mai',
      personaTitle: isEn ? 'C&B / Performance Specialist' : 'Chuyên viên C&B / Đánh giá nhân sự',
      department: isEn ? 'Human Resources Dept' : 'Ban Hành chính - Nhân sự',
      avatarText: 'HR',
      avatarBg: 'bg-blue-600 text-white',
      accentColor: 'blue',
      perspectiveDesc: isEn
        ? 'Enterprise-wide view (all divisions & departments). Manages evaluation cycles, monitors SLA progress, controls A/B/C rating distribution, and approves cycle closure.'
        : 'Bao quát toàn doanh nghiệp (tất cả Division & phòng ban). Quản trị chu kỳ đánh giá, giám sát SLA tiến độ, kiểm soát phân bổ xếp loại A/B/C và phê duyệt đóng kỳ.',
      behaviorDesc: isEn
        ? 'Initialize evaluation cycles, assign/reassign evaluators, send bulk SLA reminders, review results (HR Review), close cycles, and export aggregate reports.'
        : 'Khởi tạo kỳ đánh giá, phân công/đổi người đánh giá, gửi đôn đốc SLA hàng loạt, duyệt kết quả đánh giá (HCNS Review), đóng kỳ lưu trữ và xuất báo cáo tổng hợp.',
      primaryActions: isEn
        ? ['Company-wide SLA Reminders', 'Assign Evaluators', 'Approve & Close Cycle', 'Export Excel Report']
        : ['Nhắc nhở SLA toàn công ty', 'Phân công người đánh giá', 'Duyệt & Đóng kỳ', 'Xuất báo cáo Excel']
    },
    EMPLOYEE: {
      id: 'EMPLOYEE',
      title: isEn ? 'Employee (Self-Assessment)' : 'Nhân Sự (Nhân viên được đánh giá)',
      shortTitle: isEn ? 'Employee (EMP)' : 'Nhân sự (NV)',
      badge: isEn ? 'Personal Self-Assessment' : 'Cá nhân tự đánh giá',
      personaName: 'Nguyễn Văn Nam',
      personaTitle: 'Senior Software Engineer (NV001)',
      department: isEn ? 'IT Division' : 'Division Công nghệ (IT)',
      avatarText: 'NV',
      avatarBg: 'bg-purple-600 text-white',
      accentColor: 'purple',
      perspectiveDesc: isEn
        ? 'View personal evaluation records only (Current Sep/2026 cycle & historical cycles). Strictly confidential, focused on individual KPI outputs and development.'
        : 'Chỉ xem hồ sơ đánh giá của chính mình (Kỳ Tháng 09/2026 hiện tại & Lịch sử các kỳ trước). Bảo mật tuyệt đối, tập trung vào kết quả KPI và phát triển cá nhân.',
      behaviorDesc: isEn
        ? 'Download standard evaluation form, self-score competencies, upload work evidence (Jira, Sprint Report), submit to Manager, and track approval status.'
        : 'Tải biểu mẫu đánh giá chuẩn IT, tự chấm điểm năng lực, tải lên tài liệu minh chứng (Jira, Sprint Report), gửi Quản lý thẩm định và theo dõi tiến độ phê duyệt.',
      primaryActions: isEn
        ? ['Download Self-Assessment Form', 'Submit Self-Assessment & Evidence', 'Track Approval Progress', 'View Manager Feedback']
        : ['Tải biểu mẫu tự đánh giá', 'Nộp bản tự đánh giá & Minh chứng', 'Theo dõi tiến độ duyệt', 'Xem phản hồi của Quản lý']
    },
    MANAGER: {
      id: 'MANAGER',
      title: isEn ? 'Direct Manager (Line Manager)' : 'Quản Lý Đánh Giá (Line Manager)',
      shortTitle: isEn ? 'Manager (MGR)' : 'Quản lý (QL)',
      badge: isEn ? 'Direct Manager' : 'Quản lý trực tiếp',
      personaName: 'Trần Quốc Huy',
      personaTitle: isEn ? 'Head of IT / Head of Technology' : 'Trưởng phòng IT / Head of Technology',
      department: isEn ? 'IT Division' : 'Division Công nghệ (IT)',
      avatarText: 'QL',
      avatarBg: 'bg-indigo-600 text-white',
      accentColor: 'indigo',
      perspectiveDesc: isEn
        ? 'View direct report employees only (IT Team: Nguyễn Văn Nam, Bùi Văn Thắng, Lê Hoàng Long, Đặng Quốc Anh). Cannot access records outside authority.'
        : 'Chỉ xem các nhân sự trực thuộc quản lý (Team IT: Nguyễn Văn Nam, Bùi Văn Thắng, Lê Hoàng Long, Đặng Quốc Anh). Không xem dữ liệu ngoài thẩm quyền.',
      behaviorDesc: isEn
        ? 'Download employee self-assessment, urge timely submissions, conduct independent manager scoring, recommend performance rating, and submit to HR for audit.'
        : 'Tải bài tự chấm của nhân viên, đôn đốc nhân viên nộp bài đúng hạn, chấm điểm quản lý độc lập, đề xuất xếp loại năng lực và chuyển hồ sơ lên HCNS thẩm định.',
      primaryActions: isEn
        ? ['Download Employee Submission', 'Urge Employee Submission', 'Grade & Propose Rating', 'Submit Results to HR']
        : ['Tải bài tự chấm của NV', 'Đôn đốc nhân viên nộp bài', 'Chấm điểm & Đề xuất xếp loại', 'Gửi kết quả lên HCNS']
    }
  };
};

export const ROLE_CONFIGS = getRoleConfigs('vi');

export type EvaluationBusinessStatus = 
  | 'Quá hạn' 
  | 'Sắp đến hạn' 
  | 'Trong hạn' 
  | 'Nhân viên đánh giá' 
  | 'Quản lý đánh giá' 
  | 'HCNS Review' 
  | 'Hoàn thành' 
  | 'Đã hủy';

export const renderStatusBadge = (status: EvaluationBusinessStatus | string, lang: 'vi' | 'en' = 'vi') => {
  const isEn = lang === 'en';
  switch (status) {
    case 'Quá hạn':
      return (
        <span 
          title={isEn ? "Overdue: Past the review date" : "Quá hạn: Quá hạn so với ngày review date"}
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs whitespace-nowrap cursor-help"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-1.5 animate-pulse"></span>
          {isEn ? 'Overdue' : 'Quá hạn'}
        </span>
      );
    case 'Sắp đến hạn':
      return (
        <span 
          title={isEn ? "Due soon: Within 15 days of review date" : "Sắp đến hạn: Trong vòng 15 ngày so với review date"}
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs whitespace-nowrap cursor-help"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
          {isEn ? 'Due Soon' : 'Sắp đến hạn'}
        </span>
      );
    case 'Trong hạn':
      return (
        <span 
          title={isEn ? "On time: Within valid evaluation period" : "Trong hạn: Ngày hiện tại = Review Date (hoặc trong kỳ hạn Review Date)"}
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs whitespace-nowrap cursor-help"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-1.5"></span>
          {isEn ? 'On Time' : 'Trong hạn'}
        </span>
      );
    case 'Nhân viên đánh giá':
      return (
        <span 
          title={isEn ? "Step 2: Employee is self-assessing" : "Nhân viên đánh giá: Nhân sự đã gửi bản đánh giá cho nhân viên tự đánh giá"}
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs whitespace-nowrap cursor-help"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mr-1.5"></span>
          {isEn ? 'Employee Assessing' : 'Nhân viên đánh giá'}
        </span>
      );
    case 'Quản lý đánh giá':
      return (
        <span 
          title={isEn ? "Step 3: Direct manager is reviewing" : "Quản lý đánh giá: Nhân viên đã thực hiện đánh giá và đã gửi sang cho quản lý"}
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs whitespace-nowrap cursor-help"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mr-1.5"></span>
          {isEn ? 'Manager Review' : 'Quản lý đánh giá'}
        </span>
      );
    case 'HCNS Review':
      return (
        <span 
          title={isEn ? "Step 4: HR is auditing results" : "HCNS Review: Quản lý thực hiện hoàn thành đánh giá nhân viên, gửi lại cho nhân sự review"}
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 shadow-2xs whitespace-nowrap cursor-help"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mr-1.5"></span>
          {isEn ? 'HR Review' : 'HCNS Review'}
        </span>
      );
    case 'Hoàn thành':
      return (
        <span 
          title={isEn ? "Completed: Evaluation cycle successfully closed" : "Hoàn thành: Nhân sự tích hoàn thành"}
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs whitespace-nowrap cursor-help"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>
          {isEn ? 'Completed' : 'Hoàn thành'}
        </span>
      );
    case 'Đã hủy':
      return (
        <span 
          title={isEn ? "Cancelled: Employee resigned" : "Đã hủy: Kỳ đánh giá đã bị hủy do thôi việc"}
          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-300 shadow-2xs whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
          {isEn ? 'Cancelled' : 'Đã hủy'}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs whitespace-nowrap">
          {status}
        </span>
      );
  }
};

export interface StatusLogEntry {
  id: string;
  timestamp: string;
  performer: string;
  previousStatus: string;
  newStatus: string;
  note: string;
  channel?: string;
}

export interface EvaluationRecord {
  id: string;
  employeeCode: string;
  fullName: string;
  department: string;
  division: string; // e.g. "Division Công nghệ (IT)", "Division Tài chính - Kế toán", etc.
  period: string; // Tháng 09/2026, Tháng 10/2026, v.v.
  officialDate: string; // DD/MM/YYYY
  reviewDate: string; // DD/MM/YYYY
  remainingDaysText: string; // "Quá 8 ngày", "Quá 5 ngày", "Hôm nay", "Còn 5 ngày", "Còn 12 ngày", "Còn 158 ngày", "—"
  evaluatorName: string; // e.g. "Trần Quốc Huy", "⚠️ Chưa gán"
  status: EvaluationBusinessStatus;
  deadlineStatus: EvaluationDeadlineStatus;
  progressStatus: EvaluationProgressStatus;
  evaluationStage?: EvaluationStage;
  statusUpdatedAt?: string; // Thời gian thay đổi trạng thái e.g. "23/09/2026 10:15"
  statusLogs?: StatusLogEntry[]; // Lịch sử thay đổi trạng thái
  subNote?: string; // "muộn 4 ngày", "nghỉ việc"
  position?: string;
  contractType?: string; // e.g. "HĐLĐ không xác định thời hạn", "HĐLĐ xác định thời hạn (36 tháng)", "HĐLĐ Thử việc"
  score?: number;
  comments?: string;
  sentAt?: string;
  customTemplateName?: string;
}

export interface RoleTemplateInfo {
  fileName: string;
  name: string;
  role: string;
  size: string;
  code: string;
  version: string;
  criteriaSummary: { name: string; weight: string; description: string }[];
}

export const getRoleTemplate = (position?: string, department?: string): RoleTemplateInfo => {
  const pos = (position || '').toLowerCase();
  const dept = (department || '').toLowerCase();

  if (dept.includes('it') || pos.includes('engineer') || pos.includes('developer') || pos.includes('devops') || pos.includes('software')) {
    return {
      fileName: 'BM01_DanhGia_KyThuat_IT_Dev.xlsx',
      name: 'Biểu mẫu Đánh giá Năng lực Kỹ thuật & Công nghệ (IT/Dev)',
      role: 'Kỹ sư phần mềm, Developer, DevOps, IT Engineer',
      size: '1.2 MB',
      code: 'BM-IT-01',
      version: 'v2.4 (2026)',
      criteriaSummary: [
        { name: '1. Năng lực chuyên môn & Kỹ năng kỹ thuật', weight: '40%', description: 'Kiến trúc phần mềm, chất lượng mã nguồn, xử lý bài toán kỹ thuật phức tạp, công nghệ mới.' },
        { name: '2. Hiệu suất & Tiến độ công việc (Sprint SLA)', weight: '40%', description: 'Tỷ lệ hoàn thành nhiệm vụ Sprint đúng hạn, ít bug phát sinh, viết tài liệu kỹ thuật chuẩn.' },
        { name: '3. Thái độ, Kỷ luật & Văn hóa Timesheet', weight: '20%', description: 'Log timesheet đầy đủ đúng quy định, tinh thần phối hợp đội ngũ, tuân thủ quy trình code review.' }
      ]
    };
  }

  if (dept.includes('kế toán') || pos.includes('kế toán') || pos.includes('thuế') || pos.includes('tài chính')) {
    return {
      fileName: 'BM02_DanhGia_NghiepVu_KeToan_TaiChinh.xlsx',
      name: 'Biểu mẫu Đánh giá Chuẩn mực Kế toán & Quản trị Tài chính',
      role: 'Chuyên viên Kế toán, Kế toán Thuế, Kế toán Tổng hợp',
      size: '980 KB',
      code: 'BM-KT-02',
      version: 'v2.1 (2026)',
      criteriaSummary: [
        { name: '1. Nghiệp vụ kế toán, thuế & Báo cáo tài chính', weight: '40%', description: 'Đối soát sổ sách kế toán chuẩn xác, nộp báo cáo thuế đúng hạn, không để xảy ra sai sót pháp lý.' },
        { name: '2. Tốc độ & Độ chính xác xử lý chứng từ thanh toán', weight: '40%', description: 'Thanh toán đúng hẹn, đối chiếu công nợ chuẩn xác 100%, tối ưu hóa quy trình chứng từ.' },
        { name: '3. Kỷ luật, Bảo mật tài chính & Văn hóa Timesheet', weight: '20%', description: 'Bảo mật tuyệt đối số liệu tài chính doanh nghiệp, chấp hành nội quy và nề nếp tập đoàn.' }
      ]
    };
  }

  if (dept.includes('sale') || pos.includes('kinh doanh') || pos.includes('sale') || pos.includes('b2b')) {
    return {
      fileName: 'BM03_DanhGia_HieuSuat_KinhDoanh_KPI.xlsx',
      name: 'Biểu mẫu Đánh giá Chỉ tiêu Doanh số & KPI Kinh doanh',
      role: 'Chuyên viên Kinh doanh, Sales Executive, Account Manager',
      size: '1.1 MB',
      code: 'BM-KD-03',
      version: 'v2.2 (2026)',
      criteriaSummary: [
        { name: '1. Kỹ năng tìm kiếm khách hàng & Đàm phán hợp đồng', weight: '35%', description: 'Mở rộng tệp khách hàng B2B, chốt hợp đồng giá trị cao, duy trì quan hệ đối tác chiến lược.' },
        { name: '2. Tỷ lệ hoàn thành chỉ tiêu doanh thu (KPI Doanh số)', weight: '45%', description: 'Doanh số thực tế đạt so với chỉ tiêu quý, tốc độ thu hồi công nợ bán hàng đúng hạn.' },
        { name: '3. Kỷ luật CRM, Báo cáo & Văn hóa Timesheet', weight: '20%', description: 'Cập nhật pipeline trên hệ thống CRM đầy đủ, tham gia họp định kỳ, tuân thủ kỷ luật.' }
      ]
    };
  }

  if (dept.includes('nhân sự') || pos.includes('nhân sự') || pos.includes('tuyển dụng') || pos.includes('đào tạo')) {
    return {
      fileName: 'BM04_DanhGia_NangLuc_HanhChinh_NhanSu.xlsx',
      name: 'Biểu mẫu Đánh giá Năng lực Tuyển dụng & Vận hành HR',
      role: 'Chuyên viên Tuyển dụng, Đào tạo, C&B, HR Generalist',
      size: '950 KB',
      code: 'BM-HR-04',
      version: 'v2.0 (2026)',
      criteriaSummary: [
        { name: '1. Hiệu quả tuyển dụng & Đáp ứng nhân sự SLA', weight: '40%', description: 'Tỷ lệ tuyển dụng đúng hạn theo yêu cầu, chi phí tối ưu, chất lượng nhân sự onboard tốt.' },
        { name: '2. Vận hành chính sách, C&B & Gắn kết nội bộ', weight: '35%', description: 'Giải đáp chế độ phúc lợi, tổ chức đào tạo hội nhập, lan tỏa văn hóa doanh nghiệp.' },
        { name: '3. Quản trị hồ sơ & Tuân thủ pháp lý lao động', weight: '25%', description: 'Quản trị hồ sơ nhân sự chuẩn mực, tuân thủ luật lao động, giải quyết chế độ kịp thời.' }
      ]
    };
  }

  if (dept.includes('marketing') || pos.includes('marketing') || pos.includes('content') || pos.includes('ads')) {
    return {
      fileName: 'BM05_DanhGia_ChienDich_Marketing_TruyenThong.xlsx',
      name: 'Biểu mẫu Đánh giá Năng lực Chiến dịch & Sáng tạo Marketing',
      role: 'Marketing Specialist, Content Creator, Digital Ads Lead',
      size: '1.05 MB',
      code: 'BM-MKT-05',
      version: 'v2.3 (2026)',
      criteriaSummary: [
        { name: '1. Năng lực sáng tạo nội dung & Triển khai chiến dịch', weight: '40%', description: 'Lên ý tưởng sáng tạo, sản xuất content/ads đa kênh thu hút traffic và lead chất lượng.' },
        { name: '2. Chỉ số hiệu quả chiến dịch (ROAS, CAC, Chuyển đổi)', weight: '40%', description: 'Tối ưu chi phí quảng cáo, chuyển đổi khách hàng tiềm năng đạt và vượt KPI đề ra.' },
        { name: '3. Kỹ năng phối hợp phòng ban & Kỷ luật Timesheet', weight: '20%', description: 'Phối hợp nhịp nhàng với Sale/Product, tuân thủ deadline và quy định tập đoàn.' }
      ]
    };
  }

  return {
    fileName: 'BM00_BieuMau_DanhGia_DinhKy_Standard.xlsx',
    name: 'Biểu mẫu Đánh giá Năng lực Định kỳ Tiêu chuẩn Tập đoàn',
    role: 'Nhân viên văn phòng, Chuyên viên nghiệp vụ chung',
    size: '890 KB',
    code: 'BM-STD-00',
    version: 'v2.0 (2026)',
    criteriaSummary: [
      { name: '1. Năng lực chuyên môn & Kỹ năng công việc', weight: '40%', description: 'Hoàn thành các nhiệm vụ được giao, chuyên môn vững vàng, xử lý công việc linh hoạt.' },
      { name: '2. Hiệu suất & Chất lượng công việc', weight: '40%', description: 'Đảm bảo tiến độ công việc, chất lượng đầu ra đạt tiêu chuẩn, có tinh thần trách nhiệm cao.' },
      { name: '3. Thái độ, Kỷ luật & Văn hóa doanh nghiệp', weight: '20%', description: 'Tuân thủ nội quy, log timesheet đầy đủ, tích cực tham gia hoạt động tập thể.' }
    ]
  };
};

const INITIAL_EVALUATIONS: EvaluationRecord[] = [
  {
    id: '1',
    employeeCode: 'NV001',
    fullName: 'Nguyễn Văn Nam',
    department: 'IT',
    division: 'Division Công nghệ (IT)',
    period: 'Tháng 09/2026',
    officialDate: '15/03/2026',
    reviewDate: '15/09/2026',
    remainingDaysText: 'Quá 8 ngày',
    evaluatorName: 'Trần Quốc Huy',
    status: 'Quá hạn',
    deadlineStatus: 'OVERDUE',
    progressStatus: 'IN_PROGRESS',
    evaluationStage: 'WAITING_MANAGER_REVIEW',
    statusUpdatedAt: '23/09/2026 10:15',
    statusLogs: [
      { id: 'log-1-1', timestamp: '01/09/2026 08:30', performer: 'Hệ thống (System Bot)', previousStatus: '—', newStatus: 'Trong hạn', note: 'Khởi tạo kỳ đánh giá định kỳ theo quy định', channel: 'Hệ thống tự động' },
      { id: 'log-1-2', timestamp: '10/09/2026 09:15', performer: 'Lê Thanh Hà (HR Admin)', previousStatus: 'Trong hạn', newStatus: 'Nhân viên đánh giá', note: 'Gửi biểu mẫu BM-IT-01 qua email nhân sự', channel: 'IMIS Portal' },
      { id: 'log-1-3', timestamp: '14/09/2026 17:30', performer: 'Nguyễn Văn Nam (Nhân viên)', previousStatus: 'Nhân viên đánh giá', newStatus: 'Quản lý đánh giá', note: 'Nộp phiếu tự chấm 92/100 kèm minh chứng Sprint', channel: 'Web App' },
      { id: 'log-1-4', timestamp: '23/09/2026 10:15', performer: 'Hệ thống (SLA Monitor)', previousStatus: 'Quản lý đánh giá', newStatus: 'Quá hạn', note: 'Cảnh báo quá hạn SLA 8 ngày gửi tới Quản lý Trần Quốc Huy', channel: 'Email Bot' }
    ],
    position: 'Senior Software Engineer',
    contractType: 'HĐLĐ không xác định thời hạn',
    score: 85,
    sentAt: '10/09/2026',
    comments: 'Nhân viên đã hoàn thành tự đánh giá (92/100). Cần Quản lý hoàn tất chấm điểm phần Năng lực chuyên môn trước ngày 25/09.'
  },
  {
    id: '1-prev1',
    employeeCode: 'NV001',
    fullName: 'Nguyễn Văn Nam',
    department: 'IT',
    division: 'Division Công nghệ (IT)',
    period: 'Tháng 03/2026',
    officialDate: '15/09/2025',
    reviewDate: '15/03/2026',
    remainingDaysText: '—',
    evaluatorName: 'Trần Quốc Huy',
    status: 'Hoàn thành',
    deadlineStatus: 'CLOSED',
    progressStatus: 'COMPLETED',
    evaluationStage: 'COMPLETED',
    statusUpdatedAt: '14/03/2026 16:30',
    statusLogs: [
      { id: 'log-1h1-1', timestamp: '01/03/2026 08:30', performer: 'Hệ thống (System Bot)', previousStatus: '—', newStatus: 'Trong hạn', note: 'Khởi tạo kỳ đánh giá định kỳ H1/2026', channel: 'Hệ thống tự động' },
      { id: 'log-1h1-2', timestamp: '10/03/2026 14:00', performer: 'Nguyễn Văn Nam (Nhân viên)', previousStatus: 'Nhân viên đánh giá', newStatus: 'Quản lý đánh giá', note: 'Nộp phiếu tự chấm 92/100', channel: 'Web App' },
      { id: 'log-1h1-3', timestamp: '14/03/2026 16:30', performer: 'Trần Quốc Huy (Quản lý)', previousStatus: 'Quản lý đánh giá', newStatus: 'Hoàn thành', note: 'Quản lý duyệt Xuất sắc A+ 92/100', channel: 'IMIS Portal' }
    ],
    position: 'Senior Software Engineer',
    contractType: 'HĐLĐ xác định thời hạn (36 tháng)',
    score: 92,
    sentAt: '05/03/2026',
    comments: 'Hoàn thành xuất sắc kỳ đánh giá H1/2026. Đã nâng bậc lương kỹ sư cao cấp.'
  },
  {
    id: '1-prev2',
    employeeCode: 'NV001',
    fullName: 'Nguyễn Văn Nam',
    department: 'IT',
    division: 'Division Công nghệ (IT)',
    period: 'Tháng 09/2025',
    officialDate: '15/03/2025',
    reviewDate: '15/09/2025',
    remainingDaysText: '—',
    evaluatorName: 'Trần Quốc Huy',
    status: 'Hoàn thành',
    deadlineStatus: 'CLOSED',
    progressStatus: 'COMPLETED',
    evaluationStage: 'COMPLETED',
    statusUpdatedAt: '12/09/2025 15:00',
    statusLogs: [
      { id: 'log-1h2-1', timestamp: '01/09/2025 08:30', performer: 'Hệ thống (System Bot)', previousStatus: '—', newStatus: 'Trong hạn', note: 'Khởi tạo kỳ đánh giá định kỳ năm 2025', channel: 'Hệ thống tự động' },
      { id: 'log-1h2-2', timestamp: '12/09/2025 15:00', performer: 'Trần Quốc Huy (Quản lý)', previousStatus: 'Quản lý đánh giá', newStatus: 'Hoàn thành', note: 'Hoàn thành đánh giá định kỳ, thăng cấp lên Senior', channel: 'IMIS Portal' }
    ],
    position: 'Software Engineer',
    contractType: 'HĐLĐ xác định thời hạn (12 tháng)',
    score: 88,
    sentAt: '05/09/2025',
    comments: 'Hoàn thành tốt kỳ đánh giá năm 2025. Xếp loại A - Đạt yêu cầu tốt.'
  },
  {
    id: '2',
    employeeCode: 'NV014',
    fullName: 'Phạm Thị Mai',
    department: 'Kế toán',
    division: 'Division Tài chính - Kế toán',
    period: 'Tháng 09/2026',
    officialDate: '18/09/2025',
    reviewDate: '18/09/2026',
    remainingDaysText: 'Quá 5 ngày',
    evaluatorName: 'Lê Thanh Hà',
    status: 'Quá hạn',
    deadlineStatus: 'OVERDUE',
    progressStatus: 'NOT_STARTED',
    evaluationStage: 'NOT_SENT',
    statusUpdatedAt: '18/09/2026 17:00',
    statusLogs: [
      { id: 'log-2-1', timestamp: '01/09/2026 08:30', performer: 'Hệ thống (System Bot)', previousStatus: '—', newStatus: 'Trong hạn', note: 'Khởi tạo kỳ đánh giá định kỳ', channel: 'Hệ thống tự động' },
      { id: 'log-2-2', timestamp: '18/09/2026 17:00', performer: 'Hệ thống (System Bot)', previousStatus: 'Trong hạn', newStatus: 'Quá hạn', note: 'Hết hạn Review Date, ghi nhận trạng thái Quá hạn', channel: 'Hệ thống tự động' }
    ],
    position: 'Chuyên viên Kế toán Tổng hợp',
    contractType: 'HĐLĐ xác định thời hạn (36 tháng)',
    comments: 'Chưa gửi đánh giá. Cần nhấn "Gửi đánh giá" để gửi biểu mẫu cho nhân sự tự đánh giá trước.'
  },
  {
    id: '3',
    employeeCode: 'NV022',
    fullName: 'Đỗ Minh Quân',
    department: 'Sale',
    division: 'Division Kinh doanh (Sale)',
    period: 'Tháng 09/2026',
    officialDate: '23/03/2026',
    reviewDate: '23/09/2026',
    remainingDaysText: 'Hôm nay',
    evaluatorName: 'Vũ Đình Long',
    status: 'Trong hạn',
    deadlineStatus: 'DUE_TODAY',
    progressStatus: 'NOT_STARTED',
    evaluationStage: 'NOT_SENT',
    statusUpdatedAt: '23/09/2026 08:00',
    statusLogs: [
      { id: 'log-3-1', timestamp: '01/09/2026 08:30', performer: 'Hệ thống (System Bot)', previousStatus: '—', newStatus: 'Trong hạn', note: 'Khởi tạo kỳ đánh giá', channel: 'Hệ thống tự động' },
      { id: 'log-3-2', timestamp: '23/09/2026 08:00', performer: 'Hệ thống (System Bot)', previousStatus: 'Trong hạn', newStatus: 'Trong hạn', note: 'Review Date trùng ngày hiện tại 23/09/2026: Ghi nhận trạng thái Trong hạn', channel: 'IMIS Alert' }
    ],
    position: 'Chuyên viên Kinh doanh B2B',
    contractType: 'HĐLĐ xác định thời hạn (12 tháng)',
    comments: 'Hạn cuối đánh giá trong ngày hôm nay 23/09/2026 (Trong hạn). Cần gửi đánh giá ngay cho nhân sự.'
  },
  {
    id: '4',
    employeeCode: 'NV007',
    fullName: 'Trần Văn A',
    department: 'Nhân sự',
    division: 'Division Nhân sự',
    period: 'Tháng 09/2026',
    officialDate: '28/09/2025',
    reviewDate: '28/09/2026',
    remainingDaysText: 'Còn 5 ngày',
    evaluatorName: 'Lê Thanh Hà',
    status: 'Nhân viên đánh giá',
    deadlineStatus: 'UPCOMING',
    progressStatus: 'IN_PROGRESS',
    evaluationStage: 'WAITING_SELF_REVIEW',
    statusUpdatedAt: '20/09/2026 14:15',
    statusLogs: [
      { id: 'log-4-1', timestamp: '01/09/2026 08:30', performer: 'Hệ thống (System Bot)', previousStatus: '—', newStatus: 'Trong hạn', note: 'Khởi tạo kỳ đánh giá', channel: 'Hệ thống tự động' },
      { id: 'log-4-2', timestamp: '20/09/2026 09:30', performer: 'Lê Thanh Hà (HR Admin)', previousStatus: 'Trong hạn', newStatus: 'Nhân viên đánh giá', note: 'Đã gửi biểu mẫu đánh giá BM-HR-04', channel: 'IMIS Portal' },
      { id: 'log-4-3', timestamp: '20/09/2026 14:15', performer: 'Trần Văn A (Nhân viên)', previousStatus: 'Nhân viên đánh giá', newStatus: 'Nhân viên đánh giá', note: 'Nhân viên đã mở biểu mẫu và lưu bản nháp', channel: 'Web App' }
    ],
    position: 'Chuyên viên Tuyển dụng & Đào tạo',
    contractType: 'HĐLĐ không xác định thời hạn',
    score: 88,
    sentAt: '20/09/2026',
    comments: 'Đang chờ nhân viên tự đánh giá trước khi quản lý phê duyệt.'
  },
  {
    id: '5',
    employeeCode: 'NV031',
    fullName: 'Hoàng Thị Lan',
    department: 'Marketing',
    division: 'Division Marketing',
    period: 'Tháng 10/2026',
    officialDate: '05/04/2026',
    reviewDate: '05/10/2026',
    remainingDaysText: 'Còn 12 ngày',
    evaluatorName: '⚠️ Chưa gán',
    status: 'Sắp đến hạn',
    deadlineStatus: 'UPCOMING',
    progressStatus: 'NOT_STARTED',
    evaluationStage: 'NOT_SENT',
    statusUpdatedAt: '22/09/2026 09:20',
    statusLogs: [
      { id: 'log-5-1', timestamp: '01/09/2026 08:30', performer: 'Hệ thống (System Bot)', previousStatus: '—', newStatus: 'Trong hạn', note: 'Khởi tạo kỳ đánh giá', channel: 'Hệ thống tự động' },
      { id: 'log-5-2', timestamp: '22/09/2026 09:20', performer: 'Hệ thống (System Bot)', previousStatus: 'Trong hạn', newStatus: 'Sắp đến hạn', note: 'Cảnh báo: Chưa phân công người đánh giá', channel: 'IMIS Alert' }
    ],
    position: 'Content Marketing Specialist',
    contractType: 'HĐLĐ Thử việc',
    comments: 'Chưa phân công người đánh giá. Cần Trưởng phòng Marketing hoặc HR gán người phụ trách trước khi gửi đánh giá.'
  },
  {
    id: '6',
    employeeCode: 'NV009',
    fullName: 'Bùi Văn Thắng',
    department: 'IT',
    division: 'Division Công nghệ (IT)',
    period: 'Tháng 09/2026',
    officialDate: '23/03/2026',
    reviewDate: '23/09/2026',
    remainingDaysText: 'Hôm nay',
    evaluatorName: 'Trần Quốc Huy',
    status: 'Trong hạn',
    deadlineStatus: 'DUE_TODAY',
    progressStatus: 'NOT_STARTED',
    evaluationStage: 'NOT_SENT',
    statusUpdatedAt: '23/09/2026 08:30',
    statusLogs: [
      { id: 'log-6-1', timestamp: '01/09/2026 08:30', performer: 'Hệ thống (System Bot)', previousStatus: '—', newStatus: 'Trong hạn', note: 'Khởi tạo kỳ đánh giá định kỳ', channel: 'Hệ thống tự động' },
      { id: 'log-6-2', timestamp: '23/09/2026 08:30', performer: 'Hệ thống (System Bot)', previousStatus: 'Trong hạn', newStatus: 'Trong hạn', note: 'Review Date trùng ngày hiện tại 23/09/2026: Ghi nhận trạng thái Trong hạn', channel: 'IMIS Alert' }
    ],
    position: 'DevOps & Cloud Engineer',
    contractType: 'HĐLĐ xác định thời hạn (36 tháng)',
    comments: 'Review Date = Today (23/09/2026). Trạng thái ghi nhận: Trong hạn. Cần gửi biểu mẫu đánh giá.'
  },
  {
    id: '7',
    employeeCode: 'NV018',
    fullName: 'Ngô Thị Hạnh',
    department: 'Kế toán',
    division: 'Division Tài chính - Kế toán',
    period: 'Tháng 09/2026',
    officialDate: '10/03/2026',
    reviewDate: '10/09/2026',
    remainingDaysText: '—',
    evaluatorName: 'Lê Thanh Hà',
    status: 'Hoàn thành',
    deadlineStatus: 'CLOSED',
    progressStatus: 'COMPLETED',
    evaluationStage: 'COMPLETED',
    statusUpdatedAt: '14/09/2026 16:30',
    statusLogs: [
      { id: 'log-7-1', timestamp: '01/09/2026 08:30', performer: 'Hệ thống (System Bot)', previousStatus: '—', newStatus: 'Trong hạn', note: 'Khởi tạo kỳ đánh giá', channel: 'Hệ thống tự động' },
      { id: 'log-7-2', timestamp: '05/09/2026 09:00', performer: 'Lê Thanh Hà (HR Admin)', previousStatus: 'Trong hạn', newStatus: 'Nhân viên đánh giá', note: 'Gửi biểu mẫu BM-KT-02', channel: 'IMIS Portal' },
      { id: 'log-7-3', timestamp: '10/09/2026 14:00', performer: 'Ngô Thị Hạnh (Nhân viên)', previousStatus: 'Nhân viên đánh giá', newStatus: 'Quản lý đánh giá', note: 'Nộp phiếu tự đánh giá 92/100', channel: 'Web App' },
      { id: 'log-7-4', timestamp: '14/09/2026 16:30', performer: 'Lê Thanh Hà (Quản lý)', previousStatus: 'Quản lý đánh giá', newStatus: 'Hoàn thành', note: 'Quản lý phê duyệt kết quả Xuất sắc, đề xuất tăng bậc lương', channel: 'IMIS Portal' }
    ],
    subNote: 'muộn 4 ngày',
    position: 'Kế toán Thuế',
    contractType: 'HĐLĐ không xác định thời hạn',
    score: 92,
    comments: 'Đã hoàn tất đánh giá kỳ tháng 09/2026. Đề xuất tăng lương bậc 2.'
  },
  {
    id: '8',
    employeeCode: 'NV026',
    fullName: 'Lý Văn Dũng',
    department: 'Sale',
    division: 'Division Kinh doanh (Sale)',
    period: 'Tháng 06/2026',
    officialDate: '01/06/2025',
    reviewDate: '01/06/2026',
    remainingDaysText: '—',
    evaluatorName: 'Vũ Đình Long',
    status: 'Đã hủy',
    deadlineStatus: 'CLOSED',
    progressStatus: 'CANCELLED',
    evaluationStage: 'COMPLETED',
    statusUpdatedAt: '01/06/2026 11:00',
    statusLogs: [
      { id: 'log-8-1', timestamp: '01/05/2026 08:30', performer: 'Hệ thống (System Bot)', previousStatus: '—', newStatus: 'Trong hạn', note: 'Khởi tạo kỳ đánh giá', channel: 'Hệ thống tự động' },
      { id: 'log-8-2', timestamp: '01/06/2026 11:00', performer: 'Lê Thanh Hà (HR Admin)', previousStatus: 'Trong hạn', newStatus: 'Đã hủy', note: 'Hủy kỳ đánh giá do nhân sự thôi việc theo quyết định số 104/QĐ-NS', channel: 'IMIS Core' }
    ],
    subNote: 'nghỉ việc',
    position: 'Sale Executive',
    contractType: 'HĐLĐ xác định thời hạn (12 tháng)',
    comments: 'Nhân sự đã nghỉ việc theo quyết định số 104/QĐ-NS ngày 15/05/2026.'
  },
  {
    id: '9',
    employeeCode: 'NV011',
    fullName: 'Lê Hoàng Long',
    department: 'IT',
    division: 'Division Công nghệ (IT)',
    period: 'Tháng 10/2026',
    officialDate: '20/04/2026',
    reviewDate: '20/10/2026',
    remainingDaysText: 'Còn 27 ngày',
    evaluatorName: 'Trần Quốc Huy',
    status: 'Quản lý đánh giá',
    deadlineStatus: 'NOT_DUE',
    progressStatus: 'IN_PROGRESS',
    evaluationStage: 'WAITING_MANAGER_REVIEW',
    statusUpdatedAt: '21/09/2026 15:45',
    statusLogs: [
      { id: 'log-9-1', timestamp: '10/09/2026 08:30', performer: 'Hệ thống (System Bot)', previousStatus: '—', newStatus: 'Trong hạn', note: 'Khởi tạo kỳ đánh giá', channel: 'Hệ thống tự động' },
      { id: 'log-9-2', timestamp: '15/09/2026 10:00', performer: 'Lê Thanh Hà (HR Admin)', previousStatus: 'Trong hạn', newStatus: 'Nhân viên đánh giá', note: 'Gửi biểu mẫu BM-IT-01', channel: 'IMIS Portal' },
      { id: 'log-9-3', timestamp: '21/09/2026 15:45', performer: 'Lê Hoàng Long (Nhân viên)', previousStatus: 'Nhân viên đánh giá', newStatus: 'Quản lý đánh giá', note: 'Nhân viên nộp phiếu tự chấm 91/100', channel: 'Web App' }
    ],
    position: 'Senior Fullstack Engineer',
    contractType: 'HĐLĐ xác định thời hạn (36 tháng)',
    score: 91,
    sentAt: '15/09/2026',
    comments: 'Nhân viên đã tự đánh giá đạt 91/100. Tiến độ đánh giá đang thực hiện đúng lộ trình SLA.'
  },
  {
    id: '10',
    employeeCode: 'NV015',
    fullName: 'Phan Thùy Dung',
    department: 'Kế toán',
    division: 'Division Tài chính - Kế toán',
    period: 'Tháng 10/2026',
    officialDate: '02/04/2026',
    reviewDate: '02/10/2026',
    remainingDaysText: 'Còn 9 ngày',
    evaluatorName: 'Lê Thanh Hà',
    status: 'Sắp đến hạn',
    deadlineStatus: 'UPCOMING',
    progressStatus: 'NOT_STARTED',
    evaluationStage: 'NOT_SENT',
    statusUpdatedAt: '20/09/2026 13:20',
    statusLogs: [
      { id: 'log-10-1', timestamp: '10/09/2026 08:30', performer: 'Hệ thống (System Bot)', previousStatus: '—', newStatus: 'Trong hạn', note: 'Khởi tạo kỳ đánh giá', channel: 'Hệ thống tự động' },
      { id: 'log-10-2', timestamp: '20/09/2026 13:20', performer: 'Hệ thống (System Bot)', previousStatus: 'Trong hạn', newStatus: 'Sắp đến hạn', note: 'Cảnh báo: Trong vòng 15 ngày so với Review Date (còn 9 ngày)', channel: 'IMIS Alert' }
    ],
    position: 'Chuyên viên Kế toán Thuế',
    contractType: 'HĐLĐ không xác định thời hạn',
    comments: 'Trong vòng 15 ngày so với Review Date (còn 9 ngày). Trạng thái: Sắp đến hạn. Cần gửi biểu mẫu cho nhân sự tự đánh giá.'
  },
  {
    id: '11',
    employeeCode: 'NV033',
    fullName: 'Đặng Quốc Anh',
    department: 'Marketing',
    division: 'Division Marketing',
    period: 'Tháng 10/2026',
    officialDate: '01/04/2026',
    reviewDate: '01/10/2026',
    remainingDaysText: 'Còn 8 ngày',
    evaluatorName: 'Trần Quốc Huy',
    status: 'Nhân viên đánh giá',
    deadlineStatus: 'UPCOMING',
    progressStatus: 'IN_PROGRESS',
    evaluationStage: 'WAITING_SELF_REVIEW',
    statusUpdatedAt: '22/09/2026 11:10',
    statusLogs: [
      { id: 'log-11-1', timestamp: '10/09/2026 08:30', performer: 'Hệ thống (System Bot)', previousStatus: '—', newStatus: 'Trong hạn', note: 'Khởi tạo kỳ đánh giá', channel: 'Hệ thống tự động' },
      { id: 'log-11-2', timestamp: '18/09/2026 09:00', performer: 'Lê Thanh Hà (HR Admin)', previousStatus: 'Trong hạn', newStatus: 'Nhân viên đánh giá', note: 'Đã gửi biểu mẫu đánh giá BM-MKT-05', channel: 'IMIS Portal' },
      { id: 'log-11-3', timestamp: '22/09/2026 11:10', performer: 'Đặng Quốc Anh (Nhân viên)', previousStatus: 'Nhân viên đánh giá', newStatus: 'Nhân viên đánh giá', note: 'Mở biểu mẫu trực tuyến và cập nhật tiến độ minh chứng', channel: 'Web App' }
    ],
    position: 'SEO & Performance Specialist',
    contractType: 'HĐLĐ Thử việc',
    score: 84,
    sentAt: '18/09/2026',
    comments: 'Đã gửi biểu mẫu. Đang chờ nhân sự tự đánh giá trước khi quản lý chấm điểm.'
  },
  {
    id: '12',
    employeeCode: 'NV005',
    fullName: 'Vũ Minh Tuấn',
    department: 'Sale',
    division: 'Division Kinh doanh (Sale)',
    period: 'Tháng 09/2026',
    officialDate: '23/03/2026',
    reviewDate: '23/09/2026',
    remainingDaysText: 'Hôm nay',
    evaluatorName: 'Vũ Đình Long',
    status: 'HCNS Review',
    deadlineStatus: 'DUE_TODAY',
    progressStatus: 'IN_PROGRESS',
    evaluationStage: 'WAITING_SELF_REVIEW',
    statusUpdatedAt: '23/09/2026 09:00',
    statusLogs: [
      { id: 'log-12-1', timestamp: '01/09/2026 08:30', performer: 'Hệ thống (System Bot)', previousStatus: '—', newStatus: 'Trong hạn', note: 'Khởi tạo kỳ đánh giá', channel: 'Hệ thống tự động' },
      { id: 'log-12-2', timestamp: '21/09/2026 10:00', performer: 'Lê Thanh Hà (HR Admin)', previousStatus: 'Trong hạn', newStatus: 'Quản lý đánh giá', note: 'Gửi biểu mẫu BM-KD-03', channel: 'IMIS Portal' },
      { id: 'log-12-3', timestamp: '23/09/2026 09:00', performer: 'Vũ Đình Long (Quản lý)', previousStatus: 'Quản lý đánh giá', newStatus: 'HCNS Review', note: 'Quản lý hoàn tất chấm điểm, chuyển HCNS review tổng hợp kết quả', channel: 'IMIS Portal' }
    ],
    position: 'Trưởng nhóm Kinh doanh',
    contractType: 'HĐLĐ không xác định thời hạn',
    sentAt: '21/09/2026',
    comments: 'Đến hạn trong ngày hôm nay. Đang ở bước HCNS Review tổng hợp kết quả.'
  }
];

// Helper to compute evaluation criteria data matching the screenshot
export const getCriteriaData = (item: EvaluationRecord) => {
  const isAcc = item.department === 'Kế toán';
  const isSale = item.department === 'Sale';
  const isMkt = item.department === 'Marketing';

  let c1Name = '1. Năng lực chuyên môn & Kỹ năng kỹ thuật';
  let c1Proof = 'Nắm vững kiến trúc hệ thống, hoàn thành các module phức tạp đúng tiến độ.';
  let c2Name = '2. Hiệu suất & Chất lượng công việc (KPI)';
  let c2Proof = 'Tỷ lệ hoàn thành công việc đạt 100%, ít phát sinh lỗi nghiêm trọng.';
  let c3Name = '3. Thái độ, Kỷ luật & Văn hóa doanh nghiệp';
  let c3Proof = 'Giao tiếp tốt với đồng nghiệp, log timesheet đầy đủ đúng hạn.';

  if (isAcc) {
    c1Name = '1. Nghiệp vụ kế toán, thuế & Kiểm toán nội bộ';
    c1Proof = 'Đối soát sổ sách kế toán chuẩn xác, lập báo cáo tài chính đúng hạn quy định.';
    c2Proof = 'Tối ưu hóa quy trình chứng từ thanh toán, giải ngân nhanh và không sai lệch.';
  } else if (isSale) {
    c1Name = '1. Kỹ năng đàm phán, chốt hợp đồng & Quan hệ khách hàng';
    c1Proof = 'Phát triển khách hàng doanh nghiệp mới, tỷ lệ chốt hợp đồng vượt kỳ vọng.';
    c2Proof = 'Doanh số thực tế đạt 108% chỉ tiêu KPI được giao trong quý.';
  } else if (isMkt) {
    c1Name = '1. Năng lực sáng tạo nội dung, chiến dịch & Digital Ads';
    c1Proof = 'Triển khai các chiến dịch truyền thông đa kênh, tăng lượng lead chất lượng.';
    c2Proof = 'Chi phí thu hút khách hàng (CAC) giảm 12% so với quý trước.';
  }

  // Exact numbers for Nguyen Van Nam if item.employeeCode === 'NV001'
  if (item.employeeCode === 'NV001') {
    return {
      c1: { name: c1Name, weight: '40%', max: 40, self: 36, mgr: 35, proof: c1Proof },
      c2: { name: c2Name, weight: '40%', max: 40, self: 38, mgr: 37, proof: c2Proof },
      c3: { name: c3Name, weight: '20%', max: 20, self: 18, mgr: 18, proof: c3Proof },
      selfTotal: 92,
      mgrTotal: 90,
      rank: 'Xuất sắc',
      proposal: 'Đạt tiêu chuẩn nâng lương'
    };
  }

  const baseScore = item.score || (item.deadlineStatus === 'OVERDUE' ? 82 : 88);
  const selfTotal = Math.min(100, baseScore + 2);
  const mgrTotal = baseScore;

  const selfC1 = Math.round(selfTotal * 0.4);
  const mgrC1 = Math.round(mgrTotal * 0.4);

  const selfC2 = Math.round(selfTotal * 0.4);
  const mgrC2 = Math.round(mgrTotal * 0.4);

  const selfC3 = selfTotal - selfC1 - selfC2;
  const mgrC3 = mgrTotal - mgrC1 - mgrC2;

  const rank = mgrTotal >= 90 ? 'Xuất sắc' : mgrTotal >= 80 ? 'Đạt yêu cầu (Tốt)' : mgrTotal >= 70 ? 'Khá' : 'Cần cải thiện';
  const proposal = mgrTotal >= 90 ? 'Đạt tiêu chuẩn nâng lương' : mgrTotal >= 80 ? 'Đạt tiêu chuẩn tái ký HĐLĐ' : 'Cần theo dõi thêm';

  return {
    c1: { name: c1Name, weight: '40%', max: 40, self: selfC1, mgr: mgrC1, proof: c1Proof },
    c2: { name: c2Name, weight: '40%', max: 40, self: selfC2, mgr: mgrC2, proof: c2Proof },
    c3: { name: c3Name, weight: '20%', max: 20, self: selfC3, mgr: mgrC3, proof: c3Proof },
    selfTotal,
    mgrTotal,
    rank,
    proposal
  };
};

export const PeriodicEvaluationPage: React.FC = () => {
  // Language Hook for Full Multiple Language Support
  const { language, setLanguage, t } = useLanguage();
  const roleConfigs = useMemo(() => getRoleConfigs(language), [language]);

  // Multi-language helper utilities for labels, dropdowns, and badges
  const getTranslatedDivision = (div: string) => {
    if (language === 'vi') return div;
    if (div === 'Tất cả') return 'All Divisions';
    if (div === 'Division Công nghệ (IT)') return 'IT Division';
    if (div === 'Division Tài chính - Kế toán') return 'Finance & Accounting Division';
    if (div === 'Division Kinh doanh (Sale)') return 'Sales & Business Division';
    if (div === 'Division Nhân sự') return 'HR Division';
    if (div === 'Division Marketing') return 'Marketing Division';
    return div;
  };

  const getTranslatedContractType = (ct: string) => {
    if (language === 'vi') return ct;
    if (ct === 'Tất cả') return 'All Contract Types';
    if (ct === 'HĐLĐ không xác định thời hạn') return 'Indefinite Labor Contract';
    if (ct === 'HĐLĐ xác định thời hạn (36 tháng)') return 'Definite Contract (36M)';
    if (ct === 'HĐLĐ xác định thời hạn (12 tháng)') return 'Definite Contract (12M)';
    if (ct === 'HĐLĐ Thử việc') return 'Probation Contract';
    return ct;
  };

  const getTranslatedStatus = (st: string) => {
    if (language === 'vi') return st;
    if (st === 'Tất cả') return 'All Statuses';
    if (st === 'Quá hạn') return 'Overdue';
    if (st === 'Sắp đến hạn') return 'Due Soon';
    if (st === 'Trong hạn') return 'On Time';
    if (st === 'Nhân viên đánh giá') return 'Employee Review';
    if (st === 'Quản lý đánh giá') return 'Manager Review';
    if (st === 'HCNS Review') return 'HR Review';
    if (st === 'Hoàn thành') return 'Completed';
    if (st === 'Đã hủy') return 'Cancelled';
    return st;
  };

  const getTranslatedEvaluator = (eva: string) => {
    if (language === 'vi') return eva;
    if (eva === 'Tất cả') return 'All Evaluators';
    if (eva === '⚠️ Chưa gán') return '⚠️ Unassigned';
    return eva;
  };

  const getTranslatedPeriod = (per: string) => {
    if (language === 'vi') return per;
    if (per === 'Tất cả') return 'All Periods';
    return per.replace('Tháng ', 'Month ');
  };

  const getTranslatedDeadlineText = (text: string) => {
    if (language === 'vi' || !text) return text;
    if (text.includes('hôm nay')) return 'Due today';
    const matchOverdue = text.match(/Quá\s+(\d+)\s+ngày/i);
    if (matchOverdue) return `Overdue ${matchOverdue[1]}d`;
    const matchRemaining = text.match(/Còn\s+(\d+)\s+ngày/i);
    if (matchRemaining) return `${matchRemaining[1]}d left`;
    return text;
  };

  // Tab State: 2 Tabs theo yêu cầu (Quản lý danh sách đánh giá & Báo cáo tháng)
  const [activeTab, setActiveTab] = useState<'eval_list' | 'monthly_report'>('eval_list');

  // Role State: 3 Roles theo yêu cầu (HCNS, Nhân sự, Quản lý đánh giá)
  const [currentRole, setCurrentRole] = useState<EvaluationUserRole>('HR_ADMIN');
  const [showRoleDetails, setShowRoleDetails] = useState<boolean>(false);

  // Filter dành cho Role Nhân sự (Nguyễn Văn Nam - NV001)
  const [employeePeriodFilter, setEmployeePeriodFilter] = useState('Tất cả');
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState('Tất cả');

  // Filter dành cho Role Quản lý đánh giá (Trần Quốc Huy)
  const [managerStatusFilter, setManagerStatusFilter] = useState('Tất cả');
  const [managerSearch, setManagerSearch] = useState('');

  // Filters State matching user request:
  // 1. Division, 2. Loại hợp đồng, 3. Người đánh giá, 4. Trạng thái, 5. Kỳ đánh giá, 6. Tháng Review date
  const [selectedDivision, setSelectedDivision] = useState('Tất cả');
  const [selectedDepartment, setSelectedDepartment] = useState('Tất cả');
  const [selectedContractType, setSelectedContractType] = useState('Tất cả');
  const [selectedEvaluator, setSelectedEvaluator] = useState('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [selectedDeadline, setSelectedDeadline] = useState('Tất cả');
  const [selectedPeriod, setSelectedPeriod] = useState('Tất cả');
  const [reviewDateMonth, setReviewDateMonth] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');

  // Monthly Report Filters & State
  const [reportMonth, setReportMonth] = useState('Tháng 09/2026');
  const [reportDepartment, setReportDepartment] = useState('Tất cả');
  const [reportRankFilter, setReportRankFilter] = useState('Tất cả');
  const [reportSearch, setReportSearch] = useState('');
  const [isMonthLocked, setIsMonthLocked] = useState(false);

  // Data state
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>(INITIAL_EVALUATIONS);
  const [selectedItem, setSelectedItem] = useState<EvaluationRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Assign Evaluator Modal
  const [assigningItem, setAssigningItem] = useState<EvaluationRecord | null>(null);
  const [newEvaluatorName, setNewEvaluatorName] = useState('Trần Quốc Huy');

  // Preview Template Modal
  const [previewTemplateItem, setPreviewTemplateItem] = useState<EvaluationRecord | null>(null);

  // Upload Evaluation Modal (Giai đoạn 2: NV tự đánh giá -> Quản lý; Giai đoạn 3: Quản lý đánh giá -> HCNS Review)
  const [uploadModal, setUploadModal] = useState<{
    isOpen: boolean;
    stage: 2 | 3;
    item: EvaluationRecord | null;
    fileName: string;
    fileSize: string;
    score: number;
    notes: string;
    rank: string;
  }>({
    isOpen: false,
    stage: 2,
    item: null,
    fileName: '',
    fileSize: '',
    score: 92,
    notes: '',
    rank: 'Xuất sắc (A+)'
  });

  // View Log Modal (Nhật ký thay đổi trạng thái)
  const [viewingLogItem, setViewingLogItem] = useState<EvaluationRecord | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSwitchRole = (rKey: EvaluationUserRole) => {
    setCurrentRole(rKey);
    if (selectedItem) {
      if (rKey === 'EMPLOYEE' && selectedItem.employeeCode !== 'NV001') {
        const myItem = evaluations.find(e => e.employeeCode === 'NV001' && !e.id.includes('prev')) || evaluations.find(e => e.employeeCode === 'NV001');
        if (myItem) setSelectedItem(myItem);
      } else if (rKey === 'MANAGER' && selectedItem.evaluatorName !== 'Trần Quốc Huy' && selectedItem.department !== 'IT') {
        const teamItem = evaluations.find(e => (e.evaluatorName === 'Trần Quốc Huy' || e.department === 'IT') && !e.id.includes('prev'));
        if (teamItem) setSelectedItem(teamItem);
      }
    }
    showToast(language === 'vi' ? `Đã switch sang vai trò: ${roleConfigs[rKey].title}` : `Switched to role: ${roleConfigs[rKey].title}`);
  };

  // Filter options
  const divisionOptions = [
    'Tất cả', 
    'Division Công nghệ (IT)', 
    'Division Tài chính - Kế toán', 
    'Division Kinh doanh (Sale)', 
    'Division Nhân sự', 
    'Division Marketing'
  ];
  const departmentOptions = ['Tất cả', 'IT', 'Kế toán', 'Sale', 'Nhân sự', 'Marketing'];
  const contractTypeOptions = [
    'Tất cả',
    'HĐLĐ không xác định thời hạn',
    'HĐLĐ xác định thời hạn (36 tháng)',
    'HĐLĐ xác định thời hạn (12 tháng)',
    'HĐLĐ Thử việc'
  ];
  const evaluatorOptions = ['Tất cả', 'Trần Quốc Huy', 'Lê Thanh Hà', 'Vũ Đình Long', '⚠️ Chưa gán'];
  const statusOptions = [
    'Tất cả', 
    'Quá hạn', 
    'Sắp đến hạn', 
    'Trong hạn', 
    'Nhân viên đánh giá', 
    'Quản lý đánh giá', 
    'HCNS Review', 
    'Hoàn thành',
    'Đã hủy'
  ];
  const deadlineOptions = ['Tất cả', 'Đang theo dõi', 'Sắp đến hạn', 'Đến hạn hôm nay', 'Quá hạn', 'Chưa tới', 'Đã đóng'];
  const periodOptions = ['Tất cả', 'Tháng 09/2026', 'Tháng 10/2026', 'Tháng 06/2026', 'Tháng 02/2027'];
  const reviewDateMonthOptions = ['Tất cả', 'Tháng 09/2026', 'Tháng 10/2026', 'Tháng 06/2026', 'Tháng 02/2027'];

  // Handle Reset Filter
  const handleResetFilter = () => {
    setSearchTerm('');
    setSelectedDivision('Tất cả');
    setSelectedDepartment('Tất cả');
    setSelectedContractType('Tất cả');
    setSelectedEvaluator('Tất cả');
    setSelectedStatus('Tất cả');
    setSelectedDeadline('Tất cả');
    setSelectedPeriod('Tất cả');
    setReviewDateMonth('Tất cả');
    setEmployeeStatusFilter('Tất cả');
    setEmployeePeriodFilter('Tất cả');
    setManagerStatusFilter('Tất cả');
    setManagerSearch('');
    showToast('Đã xóa tất cả bộ lọc');
  };

  // Filtered List cho HCNS
  const hrFilteredList = useMemo(() => {
    return evaluations.filter(item => {
      // Ẩn các bản ghi lịch sử cũ của NV001 trừ khi được tìm kiếm đích danh
      if (item.id.includes('prev') && selectedPeriod === 'Tất cả' && searchTerm === '') {
        return false;
      }

      // 0. Quick search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase().trim();
        const matches = 
          item.fullName.toLowerCase().includes(query) ||
          item.employeeCode.toLowerCase().includes(query) ||
          (item.division && item.division.toLowerCase().includes(query)) ||
          item.department.toLowerCase().includes(query) ||
          item.evaluatorName.toLowerCase().includes(query) ||
          (item.contractType && item.contractType.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // 1. Division
      if (selectedDivision !== 'Tất cả' && item.division !== selectedDivision) {
        return false;
      }

      // Fallback department
      if (selectedDepartment !== 'Tất cả' && item.department !== selectedDepartment) {
        return false;
      }

      // 1.5. Loại hợp đồng
      if (selectedContractType !== 'Tất cả' && item.contractType !== selectedContractType) {
        return false;
      }

      // 2. Người đánh giá
      if (selectedEvaluator !== 'Tất cả') {
        if (selectedEvaluator === '⚠️ Chưa gán') {
          if (!item.evaluatorName.includes('Chưa gán')) return false;
        } else if (item.evaluatorName !== selectedEvaluator) {
          return false;
        }
      }

      // 3. Trạng thái
      if (selectedStatus !== 'Tất cả') {
        if (selectedStatus === 'Sắp đến hạn') {
          if (item.deadlineStatus !== 'UPCOMING') return false;
        } else if (selectedStatus === 'Trong hạn') {
          if (item.deadlineStatus !== 'DUE_TODAY' && item.reviewDate !== '23/09/2026') return false;
        } else if (selectedStatus === 'Quá hạn') {
          if (item.deadlineStatus !== 'OVERDUE' && !item.remainingDaysText.toLowerCase().includes('quá')) return false;
        } else if (selectedStatus === 'Hoàn thành') {
          if (item.status !== 'Hoàn thành') return false;
        } else if (item.status !== selectedStatus) {
          return false;
        }
      }

      // Tình trạng hạn (dành cho summary card click interaction)
      if (selectedDeadline !== 'Tất cả') {
        if (selectedDeadline === 'Đang theo dõi' && (item.status === 'Hoàn thành' || item.status === 'Đã hủy' || item.progressStatus === 'COMPLETED' || item.evaluationStage === 'COMPLETED' || item.progressStatus === 'CANCELLED' || item.deadlineStatus === 'CLOSED')) return false;
        if ((selectedDeadline === 'Quá hạn' || selectedDeadline === 'QUÁ HẠN') && (item.deadlineStatus !== 'OVERDUE' || item.status === 'Hoàn thành' || item.status === 'Đã hủy')) return false;
        if ((selectedDeadline === 'Sắp đến hạn' || selectedDeadline === 'Sắp đến hạn (≤ 15 ngày)') && (item.deadlineStatus !== 'UPCOMING' || item.status === 'Hoàn thành' || item.status === 'Đã hủy')) return false;
        if ((selectedDeadline === 'Đến hạn' || selectedDeadline === 'Đến hạn hôm nay' || selectedDeadline === 'ĐẾN HẠN HÔM NAY') && (item.deadlineStatus !== 'DUE_TODAY' || item.status === 'Hoàn thành' || item.status === 'Đã hủy')) return false;
        if (selectedDeadline === 'Trong kỳ hạn' && (item.deadlineStatus === 'OVERDUE' || item.deadlineStatus === 'UPCOMING' || item.deadlineStatus === 'CLOSED')) return false;
        if (selectedDeadline === 'Chưa tới' && item.deadlineStatus !== 'NOT_DUE') return false;
        if (selectedDeadline === 'Đã đóng' && item.deadlineStatus !== 'CLOSED' && item.status !== 'Hoàn thành' && item.status !== 'Đã hủy') return false;
      }

      // 4. Kỳ đánh giá
      if (selectedPeriod !== 'Tất cả' && item.period !== selectedPeriod) {
        return false;
      }

      // 5. Tháng Review date
      if (reviewDateMonth !== 'Tất cả' && reviewDateMonth.trim() !== '') {
        const parts = item.reviewDate.split('/');
        if (parts.length === 3) {
          const itemMonthYear = `${parts[1]}/${parts[2]}`; // "09/2026"
          const itemMonthText = `Tháng ${parts[1]}/${parts[2]}`; // "Tháng 09/2026"
          const cleanFilter = reviewDateMonth.trim().toLowerCase();
          const matchMonth = 
            itemMonthText.toLowerCase() === cleanFilter ||
            itemMonthYear.toLowerCase() === cleanFilter ||
            cleanFilter.includes(itemMonthYear.toLowerCase()) ||
            itemMonthText.toLowerCase().includes(cleanFilter);
          if (!matchMonth) return false;
        }
      }

      return true;
    });
  }, [evaluations, searchTerm, selectedDivision, selectedDepartment, selectedContractType, selectedEvaluator, selectedStatus, selectedDeadline, selectedPeriod, reviewDateMonth]);

  // Filtered List cho Role Nhân Sự (Nguyễn Văn Nam - NV001)
  const employeeFilteredList = useMemo(() => {
    return evaluations.filter(item => {
      // Chỉ xem hồ sơ của chính mình
      if (item.employeeCode !== 'NV001') return false;

      // Quick search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase().trim();
        const matches = 
          item.fullName.toLowerCase().includes(query) ||
          item.employeeCode.toLowerCase().includes(query) ||
          item.period.toLowerCase().includes(query) ||
          item.evaluatorName.toLowerCase().includes(query) ||
          (item.contractType && item.contractType.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Lọc từ dropdown trạng thái cá nhân
      if (employeeStatusFilter !== 'Tất cả') {
        if (employeeStatusFilter === 'Đang xử lý' && (item.status === 'Hoàn thành' || item.deadlineStatus === 'CLOSED')) return false;
        if (employeeStatusFilter === 'Đã hoàn thành' && item.status !== 'Hoàn thành') return false;
      }

      // Lọc từ dropdown Loại hợp đồng
      if (selectedContractType !== 'Tất cả' && item.contractType !== selectedContractType) {
        return false;
      }

      // Lọc từ 4 Thẻ Summary Cards (Sắp đến hạn, Trong hạn, Quá hạn)
      if (selectedStatus !== 'Tất cả') {
        if (selectedStatus === 'Sắp đến hạn') {
          if (item.deadlineStatus !== 'UPCOMING') return false;
        } else if (selectedStatus === 'Trong hạn') {
          if (item.deadlineStatus !== 'DUE_TODAY' && item.reviewDate !== '23/09/2026') return false;
        } else if (selectedStatus === 'Quá hạn') {
          if (item.deadlineStatus !== 'OVERDUE' && !item.remainingDaysText.toLowerCase().includes('quá')) return false;
        } else if (selectedStatus === 'Hoàn thành') {
          if (item.status !== 'Hoàn thành') return false;
        } else if (item.status !== selectedStatus) {
          return false;
        }
      }

      // Lọc từ Thẻ 1 (Đang theo dõi)
      if (selectedDeadline === 'Đang theo dõi') {
        if (item.status === 'Hoàn thành' || item.status === 'Đã hủy' || item.progressStatus === 'COMPLETED' || item.deadlineStatus === 'CLOSED') return false;
      }

      // Kỳ đánh giá
      if (employeePeriodFilter !== 'Tất cả' && item.period !== employeePeriodFilter) return false;

      return true;
    });
  }, [evaluations, employeePeriodFilter, employeeStatusFilter, searchTerm, selectedStatus, selectedDeadline, selectedContractType]);

  // Filtered List cho Role Quản Lý Đánh Giá (Trần Quốc Huy)
  const managerFilteredList = useMemo(() => {
    return evaluations.filter(item => {
      // Chỉ các nhân sự thuộc team IT do Trần Quốc Huy phụ trách (loại trừ các bản ghi lịch sử cũ của Nam)
      if (item.id.includes('prev')) return false;
      const isMyTeam = item.evaluatorName === 'Trần Quốc Huy' || item.department === 'IT';
      if (!isMyTeam) return false;

      // Quick search term
      const term = (searchTerm || managerSearch).trim().toLowerCase();
      if (term !== '') {
        const match = 
          item.fullName.toLowerCase().includes(term) || 
          item.employeeCode.toLowerCase().includes(term) || 
          (item.position && item.position.toLowerCase().includes(term)) ||
          (item.contractType && item.contractType.toLowerCase().includes(term));
        if (!match) return false;
      }

      // Lọc theo Loại hợp đồng
      if (selectedContractType !== 'Tất cả' && item.contractType !== selectedContractType) {
        return false;
      }

      // Lọc theo trạng thái quản lý trong team
      if (managerStatusFilter !== 'Tất cả') {
        if (managerStatusFilter === 'Cần chấm ngay') {
          // NV đã nộp bài, chờ QL chấm
          if (item.status !== 'Quản lý đánh giá' && !(item.status === 'Quá hạn' && item.score !== undefined)) return false;
        } else if (managerStatusFilter === 'Chờ NV nộp bài') {
          if (item.status !== 'Nhân viên đánh giá') return false;
        } else if (managerStatusFilter === 'Cần gửi / Chưa nộp') {
          if (item.status !== 'Trong hạn' && item.status !== 'Sắp đến hạn') return false;
        } else if (managerStatusFilter === 'Đã gửi HCNS') {
          if (item.status !== 'HCNS Review') return false;
        } else if (managerStatusFilter === 'Đã hoàn thành') {
          if (item.status !== 'Hoàn thành') return false;
        }
      }

      // Lọc từ 4 Thẻ Summary Cards (Sắp đến hạn, Trong hạn, Quá hạn)
      if (selectedStatus !== 'Tất cả') {
        if (selectedStatus === 'Sắp đến hạn') {
          if (item.deadlineStatus !== 'UPCOMING') return false;
        } else if (selectedStatus === 'Trong hạn') {
          if (item.deadlineStatus !== 'DUE_TODAY' && item.reviewDate !== '23/09/2026') return false;
        } else if (selectedStatus === 'Quá hạn') {
          if (item.deadlineStatus !== 'OVERDUE' && !item.remainingDaysText.toLowerCase().includes('quá')) return false;
        } else if (selectedStatus === 'Hoàn thành') {
          if (item.status !== 'Hoàn thành') return false;
        } else if (item.status !== selectedStatus) {
          return false;
        }
      }

      // Lọc từ Thẻ 1 (Đang theo dõi)
      if (selectedDeadline === 'Đang theo dõi') {
        if (item.status === 'Hoàn thành' || item.status === 'Đã hủy' || item.progressStatus === 'COMPLETED' || item.deadlineStatus === 'CLOSED') return false;
      }

      // Kỳ đánh giá
      if (selectedPeriod !== 'Tất cả' && item.period !== selectedPeriod) {
        return false;
      }

      // Tháng Review date
      if (reviewDateMonth !== 'Tất cả' && reviewDateMonth.trim() !== '') {
        const parts = item.reviewDate.split('/');
        if (parts.length === 3) {
          const itemMonthText = `Tháng ${parts[1]}/${parts[2]}`;
          const cleanFilter = reviewDateMonth.trim().toLowerCase();
          if (!itemMonthText.toLowerCase().includes(cleanFilter) && !cleanFilter.includes(itemMonthText.toLowerCase())) return false;
        }
      }

      return true;
    });
  }, [evaluations, managerStatusFilter, managerSearch, searchTerm, selectedStatus, selectedDeadline, selectedPeriod, reviewDateMonth, selectedContractType]);

  // Danh sách hiển thị theo Role được chọn
  const filteredList = useMemo(() => {
    if (currentRole === 'EMPLOYEE') return employeeFilteredList;
    if (currentRole === 'MANAGER') return managerFilteredList;
    return hrFilteredList;
  }, [currentRole, employeeFilteredList, managerFilteredList, hrFilteredList]);

  // KPI Stats cho 4 Summary Cards (Tính toán trên Data pool của Role tương ứng)
  const evalSummaryStats = useMemo(() => {
    let pool = evaluations.filter(e => !e.id.includes('prev'));
    if (currentRole === 'EMPLOYEE') {
      pool = evaluations.filter(e => e.employeeCode === 'NV001');
    } else if (currentRole === 'MANAGER') {
      pool = evaluations.filter(e => (e.evaluatorName === 'Trần Quốc Huy' || e.department === 'IT') && !e.id.includes('prev'));
    }

    const trackingList = pool.filter(e => 
      e.progressStatus !== 'COMPLETED' && 
      e.evaluationStage !== 'COMPLETED' && 
      e.progressStatus !== 'CANCELLED' && 
      e.deadlineStatus !== 'CLOSED'
    );
    const trackingCount = trackingList.length;

    const upcomingList = trackingList.filter(e => {
      if (e.deadlineStatus === 'DUE_TODAY') return false;
      const match = e.remainingDaysText.match(/Còn\s+(\d+)\s+ngày/i);
      if (match) {
        const days = parseInt(match[1], 10);
        return days > 0 && days <= 15;
      }
      return e.deadlineStatus === 'UPCOMING';
    });
    const upcomingCount = upcomingList.length;

    const dueTodayList = trackingList.filter(e => 
      e.deadlineStatus === 'DUE_TODAY' || 
      e.remainingDaysText.toLowerCase().includes('hôm nay') ||
      e.reviewDate === '23/09/2026'
    );
    const dueTodayCount = dueTodayList.length;

    const overdueList = trackingList.filter(e => 
      e.deadlineStatus === 'OVERDUE' || 
      e.remainingDaysText.toLowerCase().includes('quá')
    );
    const overdueCount = overdueList.length;

    return { 
      total: pool.length,
      trackingCount, 
      upcomingCount, 
      dueTodayCount, 
      overdueCount 
    };
  }, [evaluations, currentRole]);

  // KPI Stats cho Role Nhân Sự (Nguyễn Văn Nam)
  const employeeStats = useMemo(() => {
    const myCurrent = evaluations.find(e => e.employeeCode === 'NV001' && !e.id.includes('prev'));
    const myHistory = evaluations.filter(e => e.employeeCode === 'NV001' && e.status === 'Hoàn thành');
    const avg = myHistory.length > 0 ? (myHistory.reduce((acc, cur) => acc + (cur.score || 90), 0) / myHistory.length).toFixed(1) : '92.0';
    return {
      currentPeriod: myCurrent?.period || 'Tháng 09/2026',
      reviewDate: myCurrent?.reviewDate || '15/09/2026',
      remainingText: myCurrent?.remainingDaysText || 'Quá 8 ngày',
      evaluatorName: myCurrent?.evaluatorName || 'Trần Quốc Huy',
      selfScore: 92,
      managerScore: 90,
      completedCount: myHistory.length,
      avgScore: avg,
      currentStatus: myCurrent?.status || 'Quá hạn'
    };
  }, [evaluations]);

  // KPI Stats cho Role Quản Lý Đánh Giá (Trần Quốc Huy)
  const managerStats = useMemo(() => {
    const itTeam = evaluations.filter(e => (e.evaluatorName === 'Trần Quốc Huy' || e.department === 'IT') && !e.id.includes('prev'));
    const needGrading = itTeam.filter(e => e.status === 'Quản lý đánh giá' || (e.status === 'Quá hạn' && e.score !== undefined)).length;
    const waitingEmployee = itTeam.filter(e => e.status === 'Nhân viên đánh giá').length;
    const dueToday = itTeam.filter(e => e.deadlineStatus === 'DUE_TODAY' || e.status === 'Trong hạn').length;
    const sentToHr = itTeam.filter(e => e.status === 'HCNS Review' || e.status === 'Hoàn thành').length;
    return {
      teamTotal: itTeam.length,
      needGrading,
      waitingEmployee,
      dueToday,
      sentToHr
    };
  }, [evaluations]);

  // Action Reminders
  const handleRemindEmployee = (item: EvaluationRecord) => {
    showToast(`Đã gửi thông báo nhắc nhở nhân sự ${item.fullName} (${item.employeeCode}) khẩn trương nộp bản tự đánh giá!`);
  };

  const handleRemindAllTeam = () => {
    showToast(`Đã gửi thông báo đôn đốc toàn bộ thành viên trong Team IT nộp bản tự đánh giá định kỳ.`);
  };

  const handleRemindCompanyAll = () => {
    showToast(`Đã kích hoạt gửi email nhắc nhở SLA toàn công ty cho ${evalSummaryStats.overdueCount} hồ sơ quá hạn và ${evalSummaryStats.upcomingCount} hồ sơ sắp đến hạn.`);
  };

  // Export to Excel (XLSX)
  const handleExportXLSX = () => {
    const exportRows = filteredList.map((item, idx) => ({
      'STT': idx + 1,
      'Mã NV': item.employeeCode,
      'Họ và tên': item.fullName,
      'Division': item.division || '—',
      'Phòng ban': item.department,
      'Loại hợp đồng': item.contractType || '—',
      'Kỳ đánh giá': item.period,
      'Official Date': item.officialDate,
      'Review Date': item.reviewDate,
      'Thời hạn còn lại': item.remainingDaysText,
      'Người đánh giá': item.evaluatorName,
      'Trạng thái': item.status,
      'Thời gian đổi trạng thái': item.statusUpdatedAt || '—',
      'Ghi chú': item.subNote || item.comments || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh_Sach_Danh_Gia');
    XLSX.writeFile(wb, `Danh_Sach_Danh_Gia_Dinh_Ky_23092026.xlsx`);
    showToast('Đã xuất file Excel danh sách đánh giá định kỳ thành công!');
  };

  // Save Assignment
  const handleSaveAssignment = () => {
    if (!assigningItem) return;
    const now = new Date();
    const timestampStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: StatusLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: timestampStr,
      performer: 'Ban Nhân Sự (HR)',
      previousStatus: assigningItem.status,
      newStatus: assigningItem.status,
      note: `Phân công Người đánh giá mới: ${newEvaluatorName}.`,
      channel: 'IMIS Portal'
    };

    setEvaluations(prev => prev.map(e => e.id === assigningItem.id ? { 
      ...e, 
      evaluatorName: newEvaluatorName,
      statusUpdatedAt: timestampStr,
      statusLogs: [newLog, ...(e.statusLogs || [])]
    } : e));
    if (selectedItem && selectedItem.id === assigningItem.id) {
      setSelectedItem(prev => prev ? { 
        ...prev, 
        evaluatorName: newEvaluatorName,
        statusUpdatedAt: timestampStr,
        statusLogs: [newLog, ...(prev.statusLogs || [])]
      } : null);
    }
    showToast(`Đã gán người đánh giá ${newEvaluatorName} cho nhân sự ${assigningItem.fullName}`);
    setAssigningItem(null);
  };

  // Direct Change Evaluator (có thể thay đổi ngay trên màn hình chi tiết)
  const handleDirectChangeEvaluator = (item: EvaluationRecord, newName: string) => {
    const now = new Date();
    const timestampStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: StatusLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: timestampStr,
      performer: 'Ban Nhân Sự (HR)',
      previousStatus: item.status,
      newStatus: item.status,
      note: `Thay đổi Người đánh giá trực tiếp thành "${newName}".`,
      channel: 'IMIS Portal'
    };

    setEvaluations(prev => prev.map(e => e.id === item.id ? { 
      ...e, 
      evaluatorName: newName,
      statusUpdatedAt: timestampStr,
      statusLogs: [newLog, ...(e.statusLogs || [])]
    } : e));
    if (selectedItem && selectedItem.id === item.id) {
      setSelectedItem(prev => prev ? { 
        ...prev, 
        evaluatorName: newName,
        statusUpdatedAt: timestampStr,
        statusLogs: [newLog, ...(prev.statusLogs || [])]
      } : null);
    }
    showToast(`Đã thay đổi Người đánh giá thành "${newName}" cho nhân sự ${item.fullName}`);
  };

  // Action: Gửi đánh giá (Sẽ gửi đến cho nhân viên tự đánh giá trước)
  const handleSendEvaluation = (item: EvaluationRecord) => {
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const timestampStr = `${dateStr} ${timeStr}`;
    const roleTmpl = getRoleTemplate(item.position, item.department);

    const newLog: StatusLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: timestampStr,
      performer: 'Lê Thanh Hà (HR Admin)',
      previousStatus: item.status,
      newStatus: 'Nhân viên đánh giá',
      note: `Gửi biểu mẫu đánh giá (${roleTmpl.code}) tới nhân sự ${item.fullName}.`,
      channel: 'IMIS Portal'
    };

    const updatedItem: EvaluationRecord = {
      ...item,
      status: 'Nhân viên đánh giá',
      evaluationStage: 'WAITING_SELF_REVIEW',
      progressStatus: 'IN_PROGRESS',
      sentAt: dateStr,
      statusUpdatedAt: timestampStr,
      statusLogs: [newLog, ...(item.statusLogs || [])],
      comments: `Đã gửi biểu mẫu đánh giá (${roleTmpl.code}) tới nhân sự ${item.fullName} vào ngày ${dateStr}. Nhân viên đang thực hiện tự chấm điểm & giải trình minh chứng trước khi Quản lý (${item.evaluatorName}) rà soát.`
    };

    setEvaluations(prev => prev.map(e => e.id === item.id ? updatedItem : e));
    if (selectedItem && selectedItem.id === item.id) {
      setSelectedItem(updatedItem);
    }

    showToast(`Đã gửi đánh giá thành công đến ${item.fullName}! Trạng thái chuyển thành "Nhân viên đánh giá".`);
  };

  // Action: Mô phỏng Nhân viên đã nộp bản tự đánh giá (để quản lý chấm tiếp theo)
  const handleSimulateSelfEvaluated = (item: EvaluationRecord) => {
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const timestampStr = `${dateStr} ${timeStr}`;

    const newLog: StatusLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: timestampStr,
      performer: `${item.fullName} (Nhân viên)`,
      previousStatus: item.status,
      newStatus: 'Quản lý đánh giá',
      note: `Nhân viên đã hoàn thành tự đánh giá (92/100). Chuyển hồ sơ tới Quản lý (${item.evaluatorName}).`,
      channel: 'Web App'
    };

    const updatedItem: EvaluationRecord = {
      ...item,
      status: 'Quản lý đánh giá',
      evaluationStage: 'WAITING_MANAGER_REVIEW',
      statusUpdatedAt: timestampStr,
      statusLogs: [newLog, ...(item.statusLogs || [])],
      comments: `Nhân viên ${item.fullName} đã hoàn thành tự đánh giá (92/100). Đang chờ Quản lý trực tiếp (${item.evaluatorName}) rà soát và chấm điểm chính thức.`
    };

    setEvaluations(prev => prev.map(e => e.id === item.id ? updatedItem : e));
    if (selectedItem && selectedItem.id === item.id) {
      setSelectedItem(updatedItem);
    }

    showToast(`Nhân viên ${item.fullName} đã nộp bản tự đánh giá. Trạng thái chuyển thành "Quản lý đánh giá"!`);
  };

  // Action: Mở popup Upload bản đánh giá (Giai đoạn 2 hoặc Giai đoạn 3)
  const handleOpenUploadModal = (item: EvaluationRecord, stage: 2 | 3) => {
    const defaultFileName = stage === 2 
      ? `BM-DG-${item.employeeCode}-${item.fullName.replace(/\s+/g, '')}-TuDanhGia.xlsx`
      : `BM-DG-${item.employeeCode}-QuanLy-${item.evaluatorName.replace(/\s+/g, '')}-ChamDiem.xlsx`;

    const defaultNotes = stage === 2
      ? `Nhân viên đã tự hoàn thành bảng đánh giá năng lực kỳ ${item.period}. Tự chấm 92/100, đính kèm biên bản minh chứng KPI.`
      : `Quản lý trực tiếp đã hoàn thành chấm điểm vòng 2 và phỏng vấn 1-1. Chấm 88/100 điểm, đề xuất mức xếp loại Xuất sắc.`;

    setUploadModal({
      isOpen: true,
      stage,
      item,
      fileName: defaultFileName,
      fileSize: stage === 2 ? '248 KB' : '315 KB',
      score: stage === 2 ? 92 : 88,
      notes: defaultNotes,
      rank: 'Xuất sắc (A+)'
    });
  };

  // Action: Xác nhận Upload và gửi hồ sơ sang bước tiếp theo
  const handleConfirmUpload = () => {
    if (!uploadModal.item) return;
    const item = uploadModal.item;
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const timestampStr = `${dateStr} ${timeStr}`;

    if (uploadModal.stage === 2) {
      // Giai đoạn 2: Nhân viên upload bản tự đánh giá -> click confirm chuyển sang Quản lý
      const newLog: StatusLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: timestampStr,
        performer: `${item.fullName} (Nhân viên)`,
        previousStatus: item.status,
        newStatus: 'Quản lý đánh giá',
        note: `Nhân viên đã tải lên bản tự đánh giá ("${uploadModal.fileName}"). Đã gửi sang cho Quản lý (${item.evaluatorName}).`,
        channel: 'Web App Upload'
      };

      const updatedItem: EvaluationRecord = {
        ...item,
        status: 'Quản lý đánh giá',
        evaluationStage: 'WAITING_MANAGER_REVIEW',
        statusUpdatedAt: timestampStr,
        statusLogs: [newLog, ...(item.statusLogs || [])],
        comments: `Nhân viên ${item.fullName} đã tải lên bản tự đánh giá ("${uploadModal.fileName}"). Đang chờ Quản lý trực tiếp (${item.evaluatorName}) rà soát và đánh giá.`
      };

      setEvaluations(prev => prev.map(e => e.id === item.id ? updatedItem : e));
      if (selectedItem && selectedItem.id === item.id) {
        setSelectedItem(updatedItem);
      }
      showToast(`Đã tải lên bản tự đánh giá thành công! Hồ sơ đã được gửi sang cho Quản lý (${item.evaluatorName}).`);
    } else {
      // Giai đoạn 3: Quản lý upload bản đánh giá -> click confirm chuyển sang HCNS Review
      const newLog: StatusLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: timestampStr,
        performer: `${item.evaluatorName} (Quản lý trực tiếp)`,
        previousStatus: item.status,
        newStatus: 'HCNS Review',
        note: `Quản lý đã tải lên bản đánh giá hoàn tất ("${uploadModal.fileName}"). Đã gửi sang Ban Nhân sự (HCNS Review).`,
        channel: 'IMIS Portal Upload'
      };

      const updatedItem: EvaluationRecord = {
        ...item,
        status: 'HCNS Review',
        statusUpdatedAt: timestampStr,
        statusLogs: [newLog, ...(item.statusLogs || [])],
        comments: `Quản lý ${item.evaluatorName} đã hoàn thành đánh giá và tải lên tệp "${uploadModal.fileName}". Hồ sơ đang chờ Ban Nhân sự (HCNS) review và phê duyệt đóng kỳ.`
      };

      setEvaluations(prev => prev.map(e => e.id === item.id ? updatedItem : e));
      if (selectedItem && selectedItem.id === item.id) {
        setSelectedItem(updatedItem);
      }
      showToast(`Quản lý đã nộp bản đánh giá hoàn tất! Hồ sơ đã được chuyển sang cho Ban Nhân sự (HCNS Review).`);
    }

    setUploadModal(prev => ({ ...prev, isOpen: false }));
  };

  // Download template file theo role/vị trí nhân sự (.xlsx)
  const handleDownloadTemplate = (item: EvaluationRecord) => {
    const tmpl = getRoleTemplate(item.position, item.department);
    const wb = XLSX.utils.book_new();

    // Sheet 1: THONG_TIN_CHUNG
    const generalData = [
      ['PHIẾU ĐÁNH GIÁ NĂNG LỰC NHÂN SỰ ĐỊNH KỲ (FILE TEMPLATE THEO ROLE)'],
      ['Tên biểu mẫu:', tmpl.name],
      ['Mã biểu mẫu:', tmpl.code, 'Phiên bản:', tmpl.version],
      ['Vị trí / Role áp dụng:', tmpl.role],
      [''],
      ['1. THÔNG TIN NHÂN SỰ CẦN ĐÁNH GIÁ'],
      ['Mã nhân viên:', item.employeeCode],
      ['Họ và tên:', item.fullName],
      ['Phòng ban:', item.department],
      ['Vị trí chuyên môn:', item.position || 'Chuyên viên'],
      ['Loại hợp đồng:', item.contractType || 'HĐLĐ xác định thời hạn'],
      ['Kỳ đánh giá:', item.period],
      ['Ngày tiếp nhận chính thức (Official Date):', item.officialDate],
      ['Ngày đến hạn đánh giá (Review Date):', item.reviewDate],
      ['Người đánh giá (Quản lý trực tiếp):', item.evaluatorName],
      ['Trạng thái hiện tại:', item.status],
      [''],
      ['2. QUY TRÌNH THỰC HIỆN ĐÁNH GIÁ'],
      ['Bước 1:', 'Nhân viên tải biểu mẫu này, điền điểm tự chấm và minh chứng tại Sheet "TIEU_CHI_DANH_GIA".'],
      ['Bước 2:', 'Gửi lại bản tự đánh giá cho Người đánh giá (Quản lý trực tiếp) trước hạn chót SLA.'],
      ['Bước 3:', 'Quản lý trực tiếp chấm điểm, ghi nhận xét và phỏng vấn 1-1.'],
      ['Bước 4:', 'Phòng Nhân sự rà soát kết quả, xếp loại và đề xuất nâng lương / tái ký HĐLĐ.']
    ];
    const wsGeneral = XLSX.utils.aoa_to_sheet(generalData);
    XLSX.utils.book_append_sheet(wb, wsGeneral, 'THONG_TIN_CHUNG');

    // Sheet 2: TIEU_CHI_DANH_GIA
    const criteriaData = tmpl.criteriaSummary.map((c, idx) => ({
      'STT': idx + 1,
      'Nhóm tiêu chí đánh giá': c.name,
      'Tỷ trọng': c.weight,
      'Mô tả chi tiết / Hướng dẫn minh chứng': c.description,
      'Điểm NV tự chấm (Max 100)': '',
      'Minh chứng / Kết quả cụ thể của NV': '',
      'Điểm Quản lý chấm': '',
      'Nhận xét của Quản lý trực tiếp': ''
    }));
    const wsCriteria = XLSX.utils.json_to_sheet(criteriaData);
    XLSX.utils.book_append_sheet(wb, wsCriteria, 'TIEU_CHI_DANH_GIA');

    XLSX.writeFile(wb, tmpl.fileName);
    showToast(`Đã tải xuống biểu mẫu ${tmpl.fileName} cho vị trí ${item.position || item.department}!`);
  };

  // Action: Quản lý thực hiện hoàn thành đánh giá nhân viên, gửi lại cho nhân sự review (HCNS Review)
  const handleManagerSubmitToHR = (item: EvaluationRecord) => {
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const timestampStr = `${dateStr} ${timeStr}`;

    const newLog: StatusLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: timestampStr,
      performer: `${item.evaluatorName} (Quản lý trực tiếp)`,
      previousStatus: item.status,
      newStatus: 'HCNS Review',
      note: `Quản lý đã hoàn tất chấm điểm (${item.score || 88}/100) và gửi lại cho nhân sự (HCNS Review) tổng hợp kết quả.`,
      channel: 'IMIS Portal'
    };

    const updatedItem: EvaluationRecord = {
      ...item,
      status: 'HCNS Review',
      statusUpdatedAt: timestampStr,
      statusLogs: [newLog, ...(item.statusLogs || [])],
      comments: `Quản lý ${item.evaluatorName} đã hoàn thành đánh giá nhân viên và gửi lại cho Ban Nhân sự review tổng hợp kết quả.`
    };

    setEvaluations(prev => prev.map(e => e.id === item.id ? updatedItem : e));
    if (selectedItem && selectedItem.id === item.id) {
      setSelectedItem(updatedItem);
    }

    showToast(`Quản lý ${item.evaluatorName} đã hoàn thành đánh giá, chuyển trạng thái sang "HCNS Review"!`);
  };

  // Action: Nhân sự tích hoàn thành (Hoàn thành)
  const handleApproveAndClosePeriod = (item: EvaluationRecord) => {
    const now = new Date();
    const timestampStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: StatusLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: timestampStr,
      performer: 'Lê Thanh Hà (Ban Nhân Sự - HR)',
      previousStatus: item.status,
      newStatus: 'Hoàn thành',
      note: `Nhân sự tích hoàn thành và xác nhận đóng kỳ đánh giá định kỳ cho nhân sự ${item.fullName}.`,
      channel: 'IMIS Portal'
    };

    setEvaluations(prev => prev.map(e => e.id === item.id ? {
      ...e,
      status: 'Hoàn thành',
      progressStatus: 'COMPLETED',
      deadlineStatus: 'CLOSED',
      evaluationStage: 'COMPLETED',
      statusUpdatedAt: timestampStr,
      statusLogs: [newLog, ...(e.statusLogs || [])],
      remainingDaysText: '—',
      subNote: undefined
    } : e));
    showToast(`Nhân sự đã tích hoàn thành kỳ đánh giá định kỳ cho ${item.fullName}!`);
    setSelectedItem(null);
  };

  // Monthly Report Filtered List
  const monthlyReportList = useMemo(() => {
    return evaluations.filter(item => {
      if (reportDepartment !== 'Tất cả' && item.department !== reportDepartment) return false;
      
      const crit = getCriteriaData(item);
      if (reportRankFilter !== 'Tất cả' && crit.rank !== reportRankFilter) return false;

      if (reportSearch.trim()) {
        const q = reportSearch.toLowerCase().trim();
        const matchName = item.fullName.toLowerCase().includes(q);
        const matchCode = item.employeeCode.toLowerCase().includes(q);
        const matchPos = (item.position || '').toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchPos) return false;
      }

      return true;
    });
  }, [evaluations, reportDepartment, reportRankFilter, reportSearch]);

  // Monthly Stats
  const monthlyStats = useMemo(() => {
    const total = evaluations.length;
    const completed = evaluations.filter(e => e.progressStatus === 'COMPLETED' || e.evaluationStage === 'COMPLETED' || e.deadlineStatus === 'CLOSED').length;
    const inProgress = evaluations.filter(e => e.progressStatus === 'IN_PROGRESS' || e.evaluationStage === 'WAITING_SELF_REVIEW' || e.evaluationStage === 'WAITING_MANAGER_REVIEW').length;
    const overdue = evaluations.filter(e => e.deadlineStatus === 'OVERDUE').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    let totalScore = 0;
    let excellentCount = 0;
    let goodCount = 0;
    let fairCount = 0;
    let needImprovementCount = 0;

    evaluations.forEach(item => {
      const crit = getCriteriaData(item);
      totalScore += crit.mgrTotal;
      if (crit.mgrTotal >= 90) excellentCount++;
      else if (crit.mgrTotal >= 80) goodCount++;
      else if (crit.mgrTotal >= 70) fairCount++;
      else needImprovementCount++;
    });

    const avgScore = total > 0 ? (totalScore / total).toFixed(1) : '0';

    // Department Stats
    const depts = ['IT', 'Kế toán', 'Sale', 'Marketing', 'Nhân sự'];
    const deptStats = depts.map(dept => {
      const items = evaluations.filter(e => e.department === dept);
      const dTotal = items.length;
      const dCompleted = items.filter(e => e.progressStatus === 'COMPLETED' || e.evaluationStage === 'COMPLETED' || e.deadlineStatus === 'CLOSED').length;
      const dScores = items.map(e => getCriteriaData(e).mgrTotal);
      const dAvg = dTotal > 0 ? (dScores.reduce((a, b) => a + b, 0) / dTotal).toFixed(1) : '0';
      const dRate = dTotal > 0 ? Math.round((dCompleted / dTotal) * 100) : 0;
      return { dept, total: dTotal, completed: dCompleted, avgScore: dAvg, rate: dRate };
    });

    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate,
      avgScore,
      excellentCount,
      goodCount,
      fairCount,
      needImprovementCount,
      deptStats
    };
  }, [evaluations]);

  // Export Monthly Report to Excel
  const handleExportMonthlyReport = () => {
    const reportData = monthlyReportList.map((item, idx) => {
      const crit = getCriteriaData(item);
      return {
        'STT': idx + 1,
        'Mã NV': item.employeeCode,
        'Họ và tên': item.fullName,
        'Phòng ban': item.department,
        'Chức vụ': item.position || '',
        'Kỳ đánh giá': item.period,
        'Review Date': item.reviewDate,
        'Người đánh giá': item.evaluatorName,
        'Điểm tự chấm (NV)': crit.selfTotal,
        'Điểm Quản lý chấm': crit.mgrTotal,
        'Chênh lệch (+/-)': crit.mgrTotal - crit.selfTotal,
        'Xếp loại tháng': crit.rank,
        'Đề xuất nhân sự (HR Action)': crit.proposal,
        'Trạng thái hồ sơ': (item.progressStatus === 'COMPLETED' || item.evaluationStage === 'COMPLETED' || item.deadlineStatus === 'CLOSED') ? 'Đã hoàn thành' : 'Đang xử lý'
      };
    });

    const summaryData = [
      ['BÁO CÁO TỔNG HỢP ĐÁNH GIÁ ĐỊNH KỲ NHÂN SỰ — THÁNG 09/2026'],
      ['Ngày xuất báo cáo:', '23/09/2026'],
      ['Chu kỳ theo dõi:', 'Kỳ đánh giá định kỳ 6 tháng / 12 tháng năm 2026'],
      [''],
      ['1. CHỈ SỐ TỔNG QUAN KỲ ĐÁNH GIÁ THÁNG 09/2026'],
      ['Tổng số nhân sự theo dõi:', monthlyStats.total],
      ['Đã hoàn thành đánh giá:', `${monthlyStats.completed} nhân sự (${monthlyStats.completionRate}%)`],
      ['Đang trong tiến trình đánh giá:', `${monthlyStats.inProgress} nhân sự`],
      ['Quá hạn cần đôn đốc SLA:', `${monthlyStats.overdue} nhân sự`],
      ['Điểm trung bình toàn công ty:', `${monthlyStats.avgScore}/100`],
      [''],
      ['2. CƠ CẤU XẾP LOẠI TOÀN DOANH NGHIỆP'],
      ['Xuất sắc (>= 90 điểm):', `${monthlyStats.excellentCount} nhân sự`],
      ['Đạt yêu cầu - Tốt (80 - 89 điểm):', `${monthlyStats.goodCount} nhân sự`],
      ['Khá (70 - 79 điểm):', `${monthlyStats.fairCount} nhân sự`],
      ['Cần cải thiện (< 70 điểm):', `${monthlyStats.needImprovementCount} nhân sự`]
    ];

    const wb = XLSX.utils.book_new();
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    const wsDetails = XLSX.utils.json_to_sheet(reportData);

    XLSX.utils.book_append_sheet(wb, wsSummary, 'TONG_QUAN_THANG');
    XLSX.utils.book_append_sheet(wb, wsDetails, 'CHI_TIET_KET_QUA_DANH_GIA');

    XLSX.writeFile(wb, `Bao_Cao_Danh_Gia_Dinh_Ky_Thang_09_2026.xlsx`);
    showToast('Đã xuất file Excel Báo cáo tháng đánh giá định kỳ thành công!');
  };

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2.5 text-sm animate-in fade-in slide-in-from-top-4 border border-slate-700">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 0. THANH ĐIỀU KHIỂN ĐỈNH TRANG (TOP BAR): PHÂN QUYỀN VAI TRÒ DẠNG SWITCH */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-6 bg-slate-50/50 pb-0">
        <div className="bg-slate-900 text-white rounded-2xl p-3 sm:p-4 shadow-lg border border-slate-800 space-y-3">
          
          {/* HÀNG 1: BỘ SWITCH PHÂN QUYỀN THEO VAI TRÒ (ROLE SWITCHER) NỔI BẬT TRÊN ĐẦU */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            {/* Cụm Switch Vai Trò */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <div className="flex items-center space-x-2 shrink-0">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                  <ShieldAlert size={13} className="text-blue-400" />
                  <span>{language === 'vi' ? 'Phân Quyền Vai Trò' : 'Role Permissions'}</span>
                </span>
                <span className="text-xs font-bold text-slate-300">{language === 'vi' ? 'Switch vai trò:' : 'Switch Role:'}</span>
              </div>

              {/* Segmented Switch Control (Dạng Switch bấm chuyển đổi tức thì, nổi bật) */}
              <div className="inline-flex bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner flex-wrap gap-1">
                {(['HR_ADMIN', 'EMPLOYEE', 'MANAGER'] as EvaluationUserRole[]).map((rKey) => {
                  const cfg = roleConfigs[rKey];
                  const isSelected = currentRole === rKey;
                  return (
                    <button
                      key={rKey}
                      type="button"
                      onClick={() => handleSwitchRole(rKey)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center space-x-2 relative ${
                        isSelected
                          ? rKey === 'HR_ADMIN'
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 ring-1 ring-blue-300/40'
                            : rKey === 'EMPLOYEE'
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 ring-1 ring-purple-300/40'
                            : 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40 ring-1 ring-indigo-300/40'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : cfg.avatarBg
                      }`}>
                        {cfg.avatarText}
                      </div>
                      <span className="whitespace-nowrap">{cfg.shortTitle}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-md ${
                        isSelected ? 'bg-black/25 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {rKey === 'HR_ADMIN' ? '12 NV' : rKey === 'EMPLOYEE' ? 'NV001' : 'Team IT (4)'}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Persona Đang Kích Hoạt & Action Nhanh & Language Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Language Switcher Button Group */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
                <button
                  type="button"
                  onClick={() => setLanguage('vi')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                    language === 'vi' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Chuyển sang Tiếng Việt"
                >
                  <img src="https://flagcdn.com/w20/vn.png" alt="Tiếng Việt" className="w-4 h-3 object-cover rounded-[1px]" />
                  <span>VI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                    language === 'en' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Switch to English"
                >
                  <img src="https://flagcdn.com/w20/us.png" alt="English" className="w-4 h-3 object-cover rounded-[1px]" />
                  <span>EN</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
                <span className="text-[11px] text-slate-400">{language === 'vi' ? 'Đang kích hoạt:' : 'Active Persona:'}</span>
                <strong className={`font-bold ${
                  currentRole === 'HR_ADMIN' ? 'text-blue-300' : currentRole === 'EMPLOYEE' ? 'text-purple-300' : 'text-indigo-300'
                }`}>
                  {roleConfigs[currentRole].personaName}
                </strong>
                <span className="text-slate-400 hidden sm:inline text-[11px]">({roleConfigs[currentRole].personaTitle})</span>
              </div>

              {/* Nút Xem chi tiết quyền hạn vai trò */}
              <button
                type="button"
                onClick={() => setShowRoleDetails(!showRoleDetails)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors border border-slate-700 cursor-pointer flex items-center space-x-1"
                title={language === 'vi' ? 'Bật/tắt mô tả chi tiết góc nhìn & thẩm quyền của vai trò' : 'Toggle role permissions & perspective details'}
              >
                <Info size={13} />
                <span>{showRoleDetails ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Chi tiết quyền' : 'Role Details')}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${showRoleDetails ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* CHI TIẾT QUYỀN HẠN & GÓC NHÌN (COLLAPSIBLE, CHỈ MỞ KHI BẤM) */}
          {showRoleDetails && (
            <div className="bg-slate-950/90 rounded-xl p-3.5 border border-slate-800 text-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-2.5 pb-2.5 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${roleConfigs[currentRole].avatarBg}`}>
                    {roleConfigs[currentRole].avatarText}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">
                      {roleConfigs[currentRole].title} — {roleConfigs[currentRole].badge}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {language === 'vi' ? 'Người đảm nhiệm:' : 'Assigned Person:'} <strong className="text-slate-200">{roleConfigs[currentRole].personaName}</strong> ({roleConfigs[currentRole].personaTitle}) · {roleConfigs[currentRole].department}
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  {language === 'vi' ? 'Phạm vi dữ liệu:' : 'Data Scope:'} <strong className="text-white">{currentRole === 'HR_ADMIN' ? (language === 'vi' ? 'Toàn bộ doanh nghiệp (12 nhân sự)' : 'All Enterprise (12 Employees)') : currentRole === 'EMPLOYEE' ? (language === 'vi' ? 'Hồ sơ cá nhân Nguyễn Văn Nam (NV001)' : 'Personal Profile Nguyễn Văn Nam (NV001)') : (language === 'vi' ? 'Thành viên trực thuộc Team IT (4 nhân sự)' : 'Direct IT Team Members (4 Employees)')}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-slate-200 block mb-1 flex items-center space-x-1.5 text-[11px]">
                    <span>🎯</span>
                    <span>{language === 'vi' ? 'Góc nhìn hiển thị (Perspective):' : 'Viewing Perspective:'}</span>
                  </strong>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {roleConfigs[currentRole].perspectiveDesc}
                  </p>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <strong className="text-slate-200 block mb-1 flex items-center space-x-1.5 text-[11px]">
                    <span>⚡</span>
                    <span>{language === 'vi' ? 'Hành vi & Quyền thao tác (Behavior):' : 'Key Behaviors & Permissions:'}</span>
                  </strong>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {roleConfigs[currentRole].behaviorDesc}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* HÀNG 2: CHẾ ĐỘ XEM & THÔNG TIN HỆ THỐNG */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400">{language === 'vi' ? 'Chế độ xem:' : 'View Mode:'}</span>
              <div className="flex bg-slate-950 p-1 rounded-xl flex-wrap gap-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('eval_list')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activeTab === 'eval_list' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileSpreadsheet size={13} />
                  <span>{t.tabs.list}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${activeTab === 'eval_list' ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {evaluations.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('monthly_report')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activeTab === 'monthly_report' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 size={13} />
                  <span>{t.tabs.reports}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${activeTab === 'monthly_report' ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    {language === 'vi' ? 'Tháng 09/2026' : 'Sep 2026'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{language === 'vi' ? 'Ngày hệ thống:' : 'System Date:'} <strong className="text-slate-200 font-mono">23/09/2026</strong></span>
              </div>
              <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
              <div className="hidden sm:flex items-center space-x-1.5">
                <Calendar size={13} className="text-slate-400" />
                <span>{language === 'vi' ? 'Chu kỳ:' : 'Cycle:'} <strong className="text-slate-200">H1/2026 & H2/2026</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Breadcrumb / Header Area (Theo chuẩn Timesheet) */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="flex flex-col">
          <div className="flex items-center px-4 sm:px-6 py-3 text-lg font-medium text-slate-700">
            <div className="flex items-center cursor-pointer hover:text-slate-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-slate-600"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span className="text-xl">Home</span>
            </div>
            <ChevronRight size={22} className="text-slate-500 mx-1.5" />
            <span className="cursor-pointer hover:text-slate-900 transition-colors text-xl">Human Resources</span>
            <ChevronRight size={22} className="text-slate-500 mx-1.5" />
            <span className="text-slate-800 text-xl font-bold">
              {activeTab === 'eval_list' 
                ? (language === 'vi' ? 'Đánh giá định kỳ' : 'Periodic Evaluation') 
                : (language === 'vi' ? 'Báo cáo tháng đánh giá định kỳ' : 'Monthly Evaluation Report')}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 max-w-[1680px] mx-auto space-y-4">
        {activeTab === 'eval_list' ? (
          /* TAB 1: QUẢN LÝ DANH SÁCH ĐÁNH GIÁ (3 ROLES: HCNS, NHÂN SỰ, QUẢN LÝ ĐÁNH GIÁ) */
          <div className="w-full space-y-4">
            
          {/* 1. Filter Controls Bar (6 Bộ lọc chuẩn, thích ứng theo Role) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Cột 1: Division */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Division</label>
                {currentRole === 'HR_ADMIN' ? (
                  <select
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer focus:border-slate-400 focus:bg-white text-slate-700 font-medium"
                  >
                    {divisionOptions.map(div => (
                      <option key={div} value={div}>
                        {div === 'Tất cả' ? (language === 'vi' ? 'Tất cả' : 'All Divisions') : getTranslatedDivision(div)}
                      </option>
                    ))}
                  </select>
                ) : currentRole === 'EMPLOYEE' ? (
                  <select
                    disabled
                    className="w-full py-1.5 px-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 font-medium cursor-not-allowed"
                  >
                    <option>{language === 'vi' ? 'Khối Công Nghệ (IT) · Cá nhân' : 'IT Division · Personal'}</option>
                  </select>
                ) : (
                  <select
                    disabled
                    className="w-full py-1.5 px-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 font-medium cursor-not-allowed"
                  >
                    <option>{language === 'vi' ? 'Khối Công Nghệ (Team IT)' : 'IT Division (Team IT)'}</option>
                  </select>
                )}
              </div>

              {/* Cột 2: Loại hợp đồng */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">{language === 'vi' ? 'Loại hợp đồng' : 'Contract Type'}</label>
                <select
                  value={selectedContractType}
                  onChange={(e) => setSelectedContractType(e.target.value)}
                  className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer focus:border-slate-400 focus:bg-white text-slate-700 font-medium"
                >
                  {contractTypeOptions.map(ct => (
                    <option key={ct} value={ct}>
                      {ct === 'Tất cả' ? (language === 'vi' ? 'Tất cả' : 'All Types') : getTranslatedContractType(ct)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cột 3: Người đánh giá */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">{language === 'vi' ? 'Người đánh giá' : 'Assigned Evaluator'}</label>
                {currentRole === 'HR_ADMIN' ? (
                  <select
                    value={selectedEvaluator}
                    onChange={(e) => setSelectedEvaluator(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer focus:border-slate-400 focus:bg-white text-slate-700 font-medium"
                  >
                    {evaluatorOptions.map(eva => (
                      <option key={eva} value={eva}>
                        {eva === 'Tất cả' ? (language === 'vi' ? 'Tất cả' : 'All Evaluators') : getTranslatedEvaluator(eva)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <select
                    disabled
                    className="w-full py-1.5 px-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 font-medium cursor-not-allowed"
                  >
                    <option>{language === 'vi' ? 'Trần Quốc Huy (Trưởng phòng IT)' : 'Trần Quốc Huy (Head of IT)'}</option>
                  </select>
                )}
              </div>

              {/* Cột 4: Trạng thái */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">{language === 'vi' ? 'Trạng thái' : 'Status'}</label>
                {currentRole === 'HR_ADMIN' ? (
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer focus:border-slate-400 focus:bg-white text-slate-700 font-medium"
                  >
                    {statusOptions.map(st => (
                      <option key={st} value={st}>
                        {st === 'Tất cả' ? (language === 'vi' ? 'Tất cả' : 'All Statuses') : getTranslatedStatus(st)}
                      </option>
                    ))}
                  </select>
                ) : currentRole === 'EMPLOYEE' ? (
                  <select
                    value={employeeStatusFilter}
                    onChange={(e) => setEmployeeStatusFilter(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer focus:border-slate-400 focus:bg-white text-slate-700 font-medium"
                  >
                    <option value="Tất cả">{language === 'vi' ? 'Tất cả trạng thái cá nhân' : 'All Personal Statuses'}</option>
                    <option value="Đang xử lý">{language === 'vi' ? 'Đang xử lý' : 'In Progress'}</option>
                    <option value="Đã hoàn thành">{language === 'vi' ? 'Đã hoàn thành' : 'Completed'}</option>
                  </select>
                ) : (
                  <select
                    value={managerStatusFilter}
                    onChange={(e) => setManagerStatusFilter(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer focus:border-slate-400 focus:bg-white text-slate-700 font-medium"
                  >
                    <option value="Tất cả">{language === 'vi' ? 'Tất cả trạng thái trong team' : 'All Team Statuses'}</option>
                    <option value="Cần chấm ngay">{language === 'vi' ? 'Cần chấm ngay (NV đã nộp)' : 'Needs Grading (EMP Submitted)'}</option>
                    <option value="Chờ NV nộp bài">{language === 'vi' ? 'Chờ NV nộp bài' : 'Awaiting Employee'}</option>
                    <option value="Cần gửi / Chưa nộp">{language === 'vi' ? 'Đến hạn hôm nay / Cần gửi' : 'Due Today / Action Required'}</option>
                    <option value="Đã gửi HCNS">{language === 'vi' ? 'Đã gửi HCNS' : 'Submitted to HR'}</option>
                    <option value="Đã hoàn thành">{language === 'vi' ? 'Đã hoàn thành' : 'Completed'}</option>
                  </select>
                )}
              </div>

              {/* Cột 5: Kỳ đánh giá */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">{language === 'vi' ? 'Kỳ đánh giá' : 'Evaluation Period'}</label>
                {currentRole === 'EMPLOYEE' ? (
                  <select
                    value={employeePeriodFilter}
                    onChange={(e) => setEmployeePeriodFilter(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer focus:border-slate-400 focus:bg-white text-slate-700 font-medium"
                  >
                    <option value="Tất cả">{language === 'vi' ? 'Tất cả các kỳ của tôi' : 'All My Evaluation Cycles'}</option>
                    <option value="Tháng 09/2026">{language === 'vi' ? 'Tháng 09/2026 (Kỳ này)' : 'Sep/2026 (Current Cycle)'}</option>
                    <option value="Tháng 03/2026">{language === 'vi' ? 'Tháng 03/2026' : 'March/2026'}</option>
                    <option value="Tháng 09/2025">{language === 'vi' ? 'Tháng 09/2025' : 'Sep/2025'}</option>
                  </select>
                ) : (
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer focus:border-slate-400 focus:bg-white text-slate-700 font-medium"
                  >
                    {periodOptions.map(per => (
                      <option key={per} value={per}>
                        {per === 'Tất cả' ? (language === 'vi' ? 'Tất cả' : 'All Periods') : getTranslatedPeriod(per)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Cột 6: Tháng Review date */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">{language === 'vi' ? 'Tháng Review date' : 'Review Month'}</label>
                <div className="relative">
                  <select
                    value={reviewDateMonth}
                    onChange={(e) => setReviewDateMonth(e.target.value)}
                    className="w-full py-1.5 pl-2.5 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer focus:border-slate-400 focus:bg-white text-slate-700 font-medium appearance-none"
                  >
                    {reviewDateMonthOptions.map(m => (
                      <option key={m} value={m}>
                        {m === 'Tất cả' ? (language === 'vi' ? 'Tất cả' : 'All Months') : getTranslatedPeriod(m)}
                      </option>
                    ))}
                  </select>
                  <CalendarDays size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => showToast(language === 'vi' ? 'Đã áp dụng các điều kiện lọc!' : 'Filters applied successfully!')}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-sm active:scale-98"
                >
                  {language === 'vi' ? 'Lọc' : 'Filter'}
                </button>
                <button
                  onClick={handleResetFilter}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-sm active:scale-98"
                >
                  {language === 'vi' ? 'Xóa lọc' : 'Reset'}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {currentRole === 'HR_ADMIN' && (
                  <button
                    onClick={handleExportXLSX}
                    className="flex items-center space-x-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs active:scale-98"
                  >
                    <Download size={15} className="text-slate-500" />
                    <span>{language === 'vi' ? 'Xuất danh sách' : 'Export Excel'}</span>
                  </button>
                )}
                {currentRole === 'MANAGER' && (
                  <button
                    onClick={handleExportXLSX}
                    className="flex items-center space-x-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs active:scale-98"
                  >
                    <Download size={15} className="text-slate-500" />
                    <span>{language === 'vi' ? 'Xuất danh sách Team' : 'Export Team Excel'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 4. 4 Summary Cards (Chuẩn 4 thẻ của bản ban đầu, số liệu tính toán theo Role) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Tổng kỳ đang theo dõi */}
            <div 
              onClick={() => {
                if (selectedDeadline === 'Đang theo dõi') {
                  setSelectedDeadline('Tất cả');
                  showToast(language === 'vi' ? 'Hiển thị tất cả kỳ đánh giá' : 'Displaying all evaluation cycles');
                } else {
                  setSelectedDeadline('Đang theo dõi');
                  setSelectedStatus('Tất cả');
                  showToast(language === 'vi' ? 'Lọc các kỳ đang theo dõi (không bao gồm hoàn thành hoặc đã hủy)' : 'Filtering active cycles in progress');
                }
              }}
              className={`bg-white rounded-xl border p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group ${
                selectedDeadline === 'Đang theo dõi' ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20' : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{language === 'vi' ? 'Tổng kỳ đang theo dõi' : 'Active Tracked Cycles'}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              </div>
              <div className="flex items-baseline space-x-1.5 mb-1">
                <span className="text-3xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                  {evalSummaryStats.trackingCount}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {language === 'vi' ? 'kỳ đang theo dõi' : 'active cycles'}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span>
                  {currentRole === 'HR_ADMIN' 
                    ? (language === 'vi' ? 'Toàn bộ phòng ban đang xử lý' : 'All company departments') 
                    : currentRole === 'EMPLOYEE' 
                    ? (language === 'vi' ? 'Hồ sơ cá nhân của bạn' : 'Your personal record') 
                    : (language === 'vi' ? 'Thành viên Team IT do bạn quản lý' : 'IT team members')}
                </span>
              </div>
            </div>

            {/* Card 2: Sắp đến hạn */}
            <div 
              onClick={() => {
                if (selectedStatus === 'Sắp đến hạn') {
                  setSelectedStatus('Tất cả');
                  showToast(language === 'vi' ? 'Hiển thị tất cả kỳ đánh giá' : 'Displaying all evaluation cycles');
                } else {
                  setSelectedStatus('Sắp đến hạn');
                  setSelectedDeadline('Tất cả');
                  showToast(language === 'vi' ? 'Lọc các kỳ sắp đến hạn (trong vòng 15 ngày)' : 'Filtering due soon cycles (<= 15 days)');
                }
              }}
              className={`bg-white rounded-xl border p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group ${
                selectedStatus === 'Sắp đến hạn' ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20' : 'border-slate-200 hover:border-amber-300'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{language === 'vi' ? 'Sắp đến hạn' : 'Due Soon'}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              </div>
              <div className="flex items-baseline space-x-1.5 mb-1">
                <span className="text-3xl font-black text-amber-500 group-hover:scale-105 transition-transform">
                  {evalSummaryStats.upcomingCount}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {language === 'vi' ? 'kỳ cần nhắc' : 'cycles to remind'}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span>{language === 'vi' ? 'Trong vòng 15 ngày' : 'Within 15 days'}</span>
              </div>
            </div>

            {/* Card 3: Trong hạn (Review date = today) */}
            <div 
              onClick={() => {
                if (selectedStatus === 'Trong hạn') {
                  setSelectedStatus('Tất cả');
                  setSelectedDeadline('Tất cả');
                  showToast(language === 'vi' ? 'Hiển thị tất cả kỳ đánh giá' : 'Displaying all evaluation cycles');
                } else {
                  setSelectedStatus('Trong hạn');
                  setSelectedDeadline('Tất cả');
                  showToast(language === 'vi' ? 'Lọc các kỳ Trong hạn (Review date = today: 23/09/2026)' : 'Filtering on-time cycles due today');
                }
              }}
              className={`bg-white rounded-xl border p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group ${
                selectedStatus === 'Trong hạn' || selectedDeadline === 'Đến hạn hôm nay' ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/20' : 'border-slate-200 hover:border-sky-300'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{language === 'vi' ? 'Trong hạn (Đến hạn hôm nay)' : 'On Time (Due Today)'}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              </div>
              <div className="flex items-baseline space-x-1.5 mb-1">
                <span className="text-3xl font-black text-sky-600 group-hover:scale-105 transition-transform">
                  {evalSummaryStats.dueTodayCount}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {language === 'vi' ? 'kỳ hôm nay' : 'cycles today'}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span>{language === 'vi' ? 'Review date = today (hiện tại)' : 'Review date = today (current)'}</span>
              </div>
            </div>

            {/* Card 4: Quá hạn */}
            <div 
              onClick={() => {
                if (selectedStatus === 'Quá hạn') {
                  setSelectedStatus('Tất cả');
                  showToast(language === 'vi' ? 'Hiển thị tất cả kỳ đánh giá' : 'Displaying all evaluation cycles');
                } else {
                  setSelectedStatus('Quá hạn');
                  setSelectedDeadline('Tất cả');
                  showToast(language === 'vi' ? 'Lọc các kỳ quá hạn review và chưa hoàn thành' : 'Filtering overdue uncompleted cycles');
                }
              }}
              className={`bg-white rounded-xl border p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:shadow-md transition-all group ${
                selectedStatus === 'Quá hạn' ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50/20' : 'border-slate-200 hover:border-red-300'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>{language === 'vi' ? 'Quá hạn' : 'Overdue'}</span>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              </div>
              <div className="flex items-baseline space-x-1.5 mb-1">
                <span className={`text-3xl font-black ${evalSummaryStats.overdueCount > 0 ? 'text-red-600' : 'text-slate-800'} group-hover:scale-105 transition-transform`}>
                  {evalSummaryStats.overdueCount}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {language === 'vi' ? 'kỳ vi phạm' : 'overdue cycles'}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span>{language === 'vi' ? 'Đã quá hạn review và chưa hoàn thành' : 'Exceeded review date SLA'}</span>
              </div>
            </div>
          </div>

          {/* 5. Main Data Card (Chuẩn Timesheet Grid 10 cột của bản ban đầu) */}
          <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
            
            {/* Grouping / Quick Search Bar (Chuẩn Timesheet ban đầu) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b border-slate-200 bg-white gap-3 whitespace-nowrap">
              <span className="text-sm text-slate-600 whitespace-nowrap">
                {language === 'vi' 
                  ? 'Kéo tiêu đề cột vào đây để gom nhóm · SLA quy định hoàn tất trước Review Date' 
                  : 'Drag a column header here to group by that column · SLA requires completion before Review Date'}
              </span>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === 'vi' ? 'Tìm tên, mã NV, division, người đánh giá...' : 'Search employee name, code, division...'}
                    className="pl-8 pr-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-400 w-64 text-slate-700 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-[1520px]">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200 select-none whitespace-nowrap">
                    <th className="py-3.5 px-4 min-w-[200px] whitespace-nowrap">{language === 'vi' ? 'Nhân viên' : 'Employee'}</th>
                    <th className="py-3.5 px-3 min-w-[180px] whitespace-nowrap">Division</th>
                    <th className="py-3.5 px-3 min-w-[170px] whitespace-nowrap">{language === 'vi' ? 'Loại hợp đồng' : 'Contract Type'}</th>
                    <th className="py-3.5 px-3 min-w-[130px] whitespace-nowrap">{language === 'vi' ? 'Kỳ đánh giá' : 'Period'}</th>
                    <th className="py-3.5 px-3 min-w-[130px] whitespace-nowrap">Official Date</th>
                    <th className="py-3.5 px-3 min-w-[130px] whitespace-nowrap">Review Date</th>
                    <th className="py-3.5 px-3 min-w-[130px] whitespace-nowrap text-left">{language === 'vi' ? 'Còn lại' : 'Remaining'}</th>
                    <th className="py-3.5 px-3 min-w-[170px] whitespace-nowrap">{language === 'vi' ? 'Người đánh giá' : 'Assigned Evaluator'}</th>
                    <th className="py-3.5 px-3 min-w-[170px] whitespace-nowrap">{language === 'vi' ? 'Trạng thái' : 'Status'}</th>
                    <th className="py-3.5 px-3 min-w-[190px] whitespace-nowrap">{language === 'vi' ? 'Thời gian đổi trạng thái' : 'Status Updated At'}</th>
                    <th className="py-3.5 px-4 text-center min-w-[130px] whitespace-nowrap">{language === 'vi' ? 'Thao tác' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Search size={28} className="text-slate-300" />
                          <span className="text-sm font-medium">
                            {language === 'vi' ? 'Không tìm thấy kỳ đánh giá nào phù hợp bộ lọc' : 'No evaluation records found matching current filters'}
                          </span>
                          <button 
                            onClick={handleResetFilter}
                            className="text-xs text-blue-600 font-bold hover:underline"
                          >
                            {language === 'vi' ? 'Bấm vào đây để xóa bộ lọc' : 'Click here to reset filters'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* 1. Nhân viên */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-800 text-sm">{item.fullName}</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.employeeCode}</div>
                        </td>

                        {/* 2. Division */}
                        <td className="py-3.5 px-3 text-slate-700 font-medium whitespace-nowrap">
                          <div className="font-semibold text-slate-800">{getTranslatedDivision(item.division)}</div>
                          <div className="text-[11px] text-slate-500 font-normal">{item.department}</div>
                        </td>

                        {/* 3. Loại hợp đồng */}
                        <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {item.contractType ? getTranslatedContractType(item.contractType) : (language === 'vi' ? 'HĐLĐ xác định thời hạn' : 'Definite Contract')}
                          </span>
                        </td>

                        {/* 4. Kỳ đánh giá */}
                        <td className="py-3.5 px-3 text-slate-700 font-semibold whitespace-nowrap">
                          {getTranslatedPeriod(item.period)}
                        </td>

                        {/* 4. Official Date */}
                        <td className="py-3.5 px-3 font-mono text-slate-700 tabular-nums whitespace-nowrap">
                          {item.officialDate}
                        </td>

                        {/* 5. Review Date */}
                        <td className="py-3.5 px-3 font-mono text-slate-700 tabular-nums whitespace-nowrap">
                          {item.reviewDate}
                        </td>

                        {/* 6. Còn lại (Thời hạn deadline) */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {item.deadlineStatus === 'OVERDUE' ? (
                            <span className="font-bold text-rose-600">{getTranslatedDeadlineText(item.remainingDaysText)}</span>
                          ) : item.deadlineStatus === 'DUE_TODAY' ? (
                            <span className="font-bold text-amber-600">{getTranslatedDeadlineText(item.remainingDaysText)}</span>
                          ) : item.deadlineStatus === 'UPCOMING' ? (
                            <span className="font-bold text-slate-800">{getTranslatedDeadlineText(item.remainingDaysText)}</span>
                          ) : item.deadlineStatus === 'NOT_DUE' ? (
                            <span className="font-bold text-slate-800">{getTranslatedDeadlineText(item.remainingDaysText)}</span>
                          ) : (
                            <span className="text-slate-400 font-bold">—</span>
                          )}
                        </td>

                        {/* 7. Người đánh giá (Chỉ HCNS mới có quyền bấm để đổi người đánh giá) */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {currentRole === 'HR_ADMIN' && item.evaluatorName.includes('Chưa gán') ? (
                            <button
                              onClick={() => setAssigningItem(item)}
                              className="text-rose-600 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                              title={language === 'vi' ? 'Bấm để phân công người đánh giá' : 'Click to assign an evaluator'}
                            >
                              <span>⚠️ {language === 'vi' ? 'Chưa gán' : 'Unassigned'}</span>
                            </button>
                          ) : (
                            <span className="text-slate-800 font-medium">{item.evaluatorName}</span>
                          )}
                        </td>

                        {/* 8. Trạng thái */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          {renderStatusBadge(item.status, language)}
                        </td>

                        {/* 9. Thời gian đổi trạng thái */}
                        <td className="py-3.5 px-3 font-mono text-slate-600 text-xs tabular-nums whitespace-nowrap">
                          {item.statusUpdatedAt || '—'}
                        </td>

                        {/* 10. Hành động (chuyển thành icon theo chuẩn bản ban đầu, phù hợp với Role) */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1.5">
                            {/* Icon 1: Xem chi tiết */}
                            <button
                              type="button"
                              onClick={() => setSelectedItem(item)}
                              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all cursor-pointer shadow-2xs group relative"
                              title={
                                currentRole === 'EMPLOYEE'
                                  ? (language === 'vi' ? 'Xem chi tiết & nộp bản tự đánh giá' : 'View details & submit self-assessment')
                                  : currentRole === 'MANAGER'
                                  ? (language === 'vi' ? 'Xem chi tiết & chấm điểm nhân viên' : 'View details & grade employee')
                                  : (language === 'vi' ? 'Xem chi tiết phiếu đánh giá' : 'View evaluation details')
                              }
                              aria-label="Xem chi tiết"
                            >
                              <Eye size={16} className="group-hover:scale-110 transition-transform text-slate-600 group-hover:text-blue-600" />
                            </button>

                            {/* Icon 2: Xem log */}
                            <button
                              type="button"
                              onClick={() => setViewingLogItem(item)}
                              className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-all cursor-pointer shadow-2xs group relative"
                              title={language === 'vi' ? 'Xem nhật ký thay đổi trạng thái (Log)' : 'View status change log'}
                              aria-label="Xem log"
                            >
                              <Clock size={16} className="group-hover:scale-110 transition-transform text-slate-600 group-hover:text-indigo-600" />
                            </button>

                            {/* Icon 3: Tải biểu mẫu / Tải bài nộp */}
                            <button
                              type="button"
                              onClick={() => handleDownloadTemplate(item)}
                              className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg transition-all cursor-pointer shadow-2xs group relative"
                              title={
                                currentRole === 'MANAGER'
                                  ? (language === 'vi' ? 'Tải bài tự đánh giá của nhân viên' : 'Download employee self-assessment')
                                  : (language === 'vi' ? `Tải biểu mẫu Excel (${getRoleTemplate(item.position, item.department).code})` : `Download Excel Template (${getRoleTemplate(item.position, item.department).code})`)
                              }
                              aria-label="Tải biểu mẫu"
                            >
                              <FileSpreadsheet size={16} className="group-hover:scale-110 transition-transform text-slate-600 group-hover:text-emerald-600" />
                            </button>

                            {/* Icon 4: Nhắc nhở nộp bài (Chỉ dành cho Quản lý khi NV chưa nộp) */}
                            {currentRole === 'MANAGER' && item.status === 'Nhân viên đánh giá' && (
                              <button
                                type="button"
                                onClick={() => handleRemindEmployee(item)}
                                className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border border-amber-200 hover:border-amber-300 rounded-lg transition-all cursor-pointer shadow-2xs group relative"
                                title={language === 'vi' ? 'Gửi nhắc nhở nhân viên nộp bài tự đánh giá' : 'Send reminder to employee'}
                                aria-label="Nhắc nhở"
                              >
                                <Send size={15} className="group-hover:scale-110 transition-transform text-amber-600" />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer matching screenshot info text */}
            <div className="px-4 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
              <div>
                {language === 'vi' ? 'Hiển thị' : 'Showing'} <strong className="font-semibold text-slate-800">1–{filteredList.length}</strong> {language === 'vi' ? 'trong' : 'of'} <strong className="font-semibold text-slate-800">{evalSummaryStats.total}</strong> {language === 'vi' ? 'kỳ · sắp xếp theo Review Date, kỳ quá hạn xếp đầu (AC8.7)' : 'cycles · sorted by Review Date, overdue first'}
              </div>

              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
                  {language === 'vi' ? 'Trước' : 'Previous'}
                </button>
                <button className="px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer shadow-xs">
                  {language === 'vi' ? 'Sau' : 'Next'}
                </button>
              </div>
            </div>
          </div>

          {/* Footnote Rule Explanations (Đúng như dòng chữ xám dưới cùng ảnh) */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 leading-relaxed">
            {language === 'vi' 
              ? 'Bảng dùng ngày hệ thống 23/09/2026. Hàng "Bùi Văn Thắng" minh hoạ BR2 — Official Date 31/08 nên Review Date lùi về ngày cuối tháng đích: 31/08/2025 + 18 tháng = 28/02/2027.' 
              : 'Table uses system date 23/09/2026. "Bùi Văn Thắng" illustrates BR2 — Official Date 31/08 with Review Date shifted to target month-end: 31/08/2025 + 18 months = 28/02/2027.'}
          </div>

        </div>
        ) : (
          /* TAB 2: BÁO CÁO THÁNG */
          <div className="w-full space-y-4">
            {/* Header Báo Cáo Tháng & Control Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      Báo cáo tháng
                    </span>
                    {isMonthLocked ? (
                      <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Lock size={12} />
                        <span>Đã chốt số liệu</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <Unlock size={12} />
                        <span>Đang mở cập nhật</span>
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    Báo Cáo Tổng Hợp Đánh Giá Định Kỳ Nhân Sự — {reportMonth}
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tổng hợp kết quả đánh giá năng lực, tiến độ SLA và đề xuất chế độ nhân sự định kỳ toàn công ty.
                  </p>
                </div>

                {/* Action Buttons: Xuất Excel, In PDF, Chốt tháng */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportMonthlyReport}
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                    title="Xuất file Excel tổng hợp báo cáo tháng (.xlsx)"
                  >
                    <Download size={15} />
                    <span>Xuất báo cáo Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center space-x-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-98"
                    title="In hoặc xuất PDF báo cáo"
                  >
                    <Printer size={15} className="text-slate-500" />
                    <span>In / PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMonthLocked(prev => !prev);
                      showToast(isMonthLocked ? 'Đã mở khóa kỳ đánh giá tháng 09/2026 để cập nhật' : 'Đã chốt và khóa số liệu đánh giá tháng 09/2026!');
                    }}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98 ${
                      isMonthLocked 
                        ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                    title={isMonthLocked ? 'Mở khóa kỳ báo cáo' : 'Khóa kỳ báo cáo tháng'}
                  >
                    {isMonthLocked ? <Unlock size={15} /> : <Lock size={15} />}
                    <span>{isMonthLocked ? 'Mở khóa kỳ' : 'Chốt số liệu tháng'}</span>
                  </button>
                </div>
              </div>

              {/* Filter Bar bên trong Báo Cáo Tháng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                {/* Chọn tháng báo cáo */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Tháng báo cáo</label>
                  <select
                    value={reportMonth}
                    onChange={(e) => setReportMonth(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer focus:border-slate-400 focus:bg-white text-slate-700 font-semibold"
                  >
                    <option value="Tháng 09/2026">Tháng 09/2026 (Kỳ hiện tại)</option>
                    <option value="Tháng 08/2026">Tháng 08/2026</option>
                    <option value="Tháng 07/2026">Tháng 07/2026</option>
                    <option value="Cả Quý 3/2026">Cả Quý 3/2026</option>
                  </select>
                </div>

                {/* Lọc theo Phòng ban */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Phòng ban</label>
                  <select
                    value={reportDepartment}
                    onChange={(e) => setReportDepartment(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer focus:border-slate-400 focus:bg-white text-slate-700 font-medium"
                  >
                    {departmentOptions.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Lọc theo Xếp loại */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Phân loại kết quả</label>
                  <select
                    value={reportRankFilter}
                    onChange={(e) => setReportRankFilter(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer focus:border-slate-400 focus:bg-white text-slate-700 font-medium"
                  >
                    <option value="Tất cả">Tất cả xếp loại</option>
                    <option value="Xuất sắc">Xuất sắc (&gt;= 90 điểm)</option>
                    <option value="Đạt yêu cầu (Tốt)">Đạt yêu cầu - Tốt (80 - 89 điểm)</option>
                    <option value="Khá">Khá (70 - 79 điểm)</option>
                    <option value="Cần cải thiện">Cần cải thiện (&lt; 70 điểm)</option>
                  </select>
                </div>

                {/* Tìm kiếm nhanh */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Tìm kiếm nhân sự</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={reportSearch}
                      onChange={(e) => setReportSearch(e.target.value)}
                      placeholder="Mã NV, họ tên, chức danh..."
                      className="w-full py-1.5 pl-8 pr-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-400 focus:bg-white text-slate-700 font-medium"
                    />
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Thẻ chỉ số KPI Báo Cáo Tháng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Tổng nhân sự theo dõi */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Tổng Nhân Sự Kỳ Tháng
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
                      {monthlyStats.total} <span className="text-xs font-normal text-slate-500">nhân sự</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Users size={22} />
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500 flex items-center space-x-1">
                  <span className="font-semibold text-slate-700">100%</span>
                  <span>kế hoạch đánh giá định kỳ 6T / 12T</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
              </div>

              {/* Card 2: Tiến độ hoàn thành SLA */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Tỷ Lệ Hoàn Thành SLA
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 font-mono">
                      {monthlyStats.completionRate}%
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={22} />
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500 flex items-center space-x-1 truncate">
                  <strong className="text-emerald-700">{monthlyStats.completed}</strong>
                  <span>đã xong ·</span>
                  <strong className="text-sky-700">{monthlyStats.inProgress}</strong>
                  <span>đang chấm ·</span>
                  <strong className="text-rose-600">{monthlyStats.overdue}</strong>
                  <span>quá hạn</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
              </div>

              {/* Card 3: Điểm trung bình */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Điểm Đánh Giá Trung Bình
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1 font-mono">
                      {monthlyStats.avgScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <TrendingUp size={22} />
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500 flex items-center space-x-1">
                  <span className="font-semibold text-emerald-600">+2.4 điểm</span>
                  <span>so với kỳ trước · Xếp loại: <strong className="text-slate-700">Tốt</strong></span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500"></div>
              </div>

              {/* Card 4: Đề xuất nâng lương & khen thưởng */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Đề Xuất Nâng Lương / Thưởng
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1 font-mono">
                      {monthlyStats.excellentCount} <span className="text-xs font-normal text-slate-500">nhân sự</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Award size={22} />
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500 flex items-center space-x-1">
                  <span>Đạt loại <strong>Xuất sắc (&gt;= 90 điểm)</strong></span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500"></div>
              </div>
            </div>

            {/* Biểu đồ phân tích cơ cấu Báo Cáo Tháng (2 Cột) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Cột 1: Cơ cấu phân bổ xếp loại toàn doanh nghiệp */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <BarChart3 size={18} className="text-blue-600" />
                    <h3 className="font-bold text-sm text-slate-800">Cơ Cấu Xếp Loại Đánh Giá ({reportMonth})</h3>
                  </div>
                  <span className="text-xs text-slate-500">Tổng: <strong>{monthlyStats.total}</strong> nhân sự</span>
                </div>

                <div className="space-y-3.5">
                  {/* Xuất sắc */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-emerald-800 flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span>Xuất sắc (Điểm &gt;= 90)</span>
                      </span>
                      <span className="font-bold text-slate-800">
                        {monthlyStats.excellentCount} nhân sự ({monthlyStats.total > 0 ? Math.round(monthlyStats.excellentCount / monthlyStats.total * 100) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${monthlyStats.total > 0 ? (monthlyStats.excellentCount / monthlyStats.total * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Đạt yêu cầu - Tốt */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-blue-800 flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        <span>Đạt yêu cầu - Tốt (Điểm 80–89)</span>
                      </span>
                      <span className="font-bold text-slate-800">
                        {monthlyStats.goodCount} nhân sự ({monthlyStats.total > 0 ? Math.round(monthlyStats.goodCount / monthlyStats.total * 100) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${monthlyStats.total > 0 ? (monthlyStats.goodCount / monthlyStats.total * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Khá */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-amber-800 flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span>Khá (Điểm 70–79)</span>
                      </span>
                      <span className="font-bold text-slate-800">
                        {monthlyStats.fairCount} nhân sự ({monthlyStats.total > 0 ? Math.round(monthlyStats.fairCount / monthlyStats.total * 100) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${monthlyStats.total > 0 ? (monthlyStats.fairCount / monthlyStats.total * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Cần cải thiện */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-rose-800 flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                        <span>Cần cải thiện (Điểm &lt; 70)</span>
                      </span>
                      <span className="font-bold text-slate-800">
                        {monthlyStats.needImprovementCount} nhân sự ({monthlyStats.total > 0 ? Math.round(monthlyStats.needImprovementCount / monthlyStats.total * 100) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-rose-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${monthlyStats.total > 0 ? (monthlyStats.needImprovementCount / monthlyStats.total * 100) : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cột 2: Tiến độ & Điểm trung bình theo phòng ban */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Building size={18} className="text-emerald-600" />
                    <h3 className="font-bold text-sm text-slate-800">Tiến Độ SLA & Điểm TB Theo Phòng Ban</h3>
                  </div>
                  <span className="text-xs text-slate-500">5 Khối phòng ban</span>
                </div>

                <div className="space-y-3">
                  {monthlyStats.deptStats.map(d => (
                    <div key={d.dept} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="min-w-[100px]">
                        <div className="font-bold text-xs text-slate-800">{d.dept}</div>
                        <div className="text-[11px] text-slate-400">{d.completed}/{d.total} hoàn tất ({d.rate}%)</div>
                      </div>

                      <div className="flex-1 mx-3 hidden sm:block">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${d.rate}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-bold text-xs text-slate-800 font-mono">{d.avgScore}/100</div>
                        <div className="text-[10px] text-emerald-600 font-medium">{d.rate === 100 ? '✓ Đạt 100%' : `${100 - d.rate}% chờ`}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bảng Chi Tiết Kết Quả Báo Cáo Tháng */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-800 flex items-center space-x-2">
                    <FileText size={16} className="text-blue-600" />
                    <span>Bảng Tổng Hợp Chi Tiết Kết Quả Đánh Giá Tháng ({monthlyReportList.length} nhân sự)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bảng đối soát điểm tự chấm (NV) và điểm Quản lý (Reviewer) để ra quyết định nhân sự.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={handleExportMonthlyReport}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                  >
                    <Download size={13} />
                    <span>Tải Excel</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1050px]">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200 select-none">
                      <th className="py-3 px-3 w-12 text-center">STT</th>
                      <th className="py-3 px-4 min-w-[180px]">Nhân viên</th>
                      <th className="py-3 px-3 min-w-[120px]">Phòng ban & Vị trí</th>
                      <th className="py-3 px-3 w-16 text-center">Kỳ</th>
                      <th className="py-3 px-3 min-w-[110px]">Review Date</th>
                      <th className="py-3 px-3 min-w-[130px]">Người đánh giá</th>
                      <th className="py-3 px-3 text-center w-24">Điểm NV</th>
                      <th className="py-3 px-3 text-center w-24 text-blue-700 font-bold">Điểm QL</th>
                      <th className="py-3 px-3 min-w-[120px]">Xếp loại</th>
                      <th className="py-3 px-4 min-w-[180px]">Đề xuất nhân sự (HR Action)</th>
                      <th className="py-3 px-3 text-center w-24">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {monthlyReportList.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-12 text-center text-slate-400">
                          <Search size={28} className="mx-auto mb-2 text-slate-300" />
                          <span className="font-medium text-sm">Không tìm thấy nhân sự phù hợp điều kiện lọc báo cáo</span>
                        </td>
                      </tr>
                    ) : (
                      monthlyReportList.map((item, idx) => {
                        const crit = getCriteriaData(item);
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-3 text-center font-bold text-slate-400 font-mono">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-800 text-sm">{item.fullName}</div>
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5">{item.employeeCode}</div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-700">{item.department}</div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{item.position || 'Chuyên viên'}</div>
                            </td>
                            <td className="py-3 px-3 text-center font-medium text-slate-700">
                              {item.period}
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-700">
                              {item.reviewDate}
                            </td>
                            <td className="py-3 px-3 text-slate-700 font-medium">
                              {item.evaluatorName}
                            </td>
                            <td className="py-3 px-3 text-center font-bold text-slate-700 font-mono">
                              {crit.selfTotal}
                            </td>
                            <td className="py-3 px-3 text-center font-black text-blue-700 font-mono bg-blue-50/40">
                              {crit.mgrTotal}
                            </td>
                            <td className="py-3 px-3">
                              {crit.rank === 'Xuất sắc' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  ★ Xuất sắc
                                </span>
                              ) : crit.rank === 'Đạt yêu cầu (Tốt)' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                                  Đạt (Tốt)
                                </span>
                              ) : crit.rank === 'Khá' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                  Khá
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                  Cần cải thiện
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-700 font-medium">
                              <div className="flex items-center space-x-1.5">
                                <Check size={13} className="text-emerald-600 shrink-0 font-bold" />
                                <span>{crit.proposal}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => setSelectedItem(item)}
                                className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-lg transition-colors cursor-pointer shadow-2xs"
                              >
                                Xem
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Khối Kế Hoạch & Hành Động Nhân Sự (HR Action Plan sau kỳ đánh giá) */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles size={18} className="text-amber-400" />
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                    Kế Hoạch & Quyết Định Nhân Sự (HR Next Steps — {reportMonth})
                  </h3>
                </div>
                <div className="text-xs text-slate-400">
                  Cập nhật lần cuối: 23/09/2026 bởi Ban Nhân Sự
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 space-y-2">
                  <div className="font-bold text-emerald-400 flex items-center space-x-1.5">
                    <Award size={15} />
                    <span>1. Nâng ngạch / Tăng bậc lương ({monthlyStats.excellentCount} nhân sự)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Các nhân sự đạt xếp loại <strong>Xuất sắc (&gt;= 90 điểm)</strong> được tổng hợp lập tờ trình chuyển Hội đồng Lương thưởng xét duyệt nâng bậc lương chu kỳ tới.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 space-y-2">
                  <div className="font-bold text-sky-400 flex items-center space-x-1.5">
                    <FileCheck size={15} />
                    <span>2. Tái ký HĐLĐ chính thức (4 nhân sự)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Hoàn tất hồ sơ đánh giá đạt yêu cầu để ban hành phụ lục gia hạn hợp đồng lao động không xác định thời hạn hoặc hợp đồng 3 năm theo quy chế tập đoàn.
                  </p>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 space-y-2">
                  <div className="font-bold text-amber-400 flex items-center space-x-1.5">
                    <AlertTriangle size={15} />
                    <span>3. Đôn đốc SLA & Kế hoạch đào tạo</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Gửi văn bản nhắc nhở <strong>{monthlyStats.overdue} nhân sự</strong> quá hạn nộp bản đánh giá và phân bổ chương trình bồi dưỡng chuyên môn cho nhóm cần cải thiện.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
                <span className="text-slate-400">
                  Biên bản kỳ đánh giá tháng {reportMonth} sẽ được lưu trữ tự động vào hồ sơ nhân sự điện tử.
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => showToast('Đã lưu dự thảo biên bản họp đánh giá tháng vào hệ thống')}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
                  >
                    Lưu biên bản họp
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMonthLocked(true);
                      showToast('Đã phê duyệt và chốt kỳ báo cáo tháng 09/2026!');
                    }}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    Ký duyệt báo cáo tháng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Modal "Xem" Chi Tiết Kỳ Đánh Giá (Mở dạng popup như trên ảnh) */}
      {selectedItem && (() => {
        const criteria = getCriteriaData(selectedItem);
        const roleTemplate = getRoleTemplate(selectedItem.position, selectedItem.department);
        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
            <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
              
              {/* Modal Header */}
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-blue-400/20 shrink-0">
                    {selectedItem.fullName.split(' ').slice(-1)[0]?.substring(0, 2) || 'NV'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="font-bold text-base sm:text-lg text-white">
                        {selectedItem.fullName} — {getTranslatedPeriod(selectedItem.period)}
                      </h2>
                    </div>
                    <div className="text-xs text-slate-300 font-mono mt-0.5 flex flex-wrap items-center gap-1.5">
                      <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 font-semibold">{selectedItem.employeeCode}</span>
                      <span>·</span>
                      <span>{language === 'vi' ? 'Phòng' : 'Dept'} {selectedItem.department}</span>
                      <span>·</span>
                      <span className="text-slate-400">{selectedItem.position || 'Chuyên viên'}</span>
                      <span>·</span>
                      <span className="text-amber-300 font-sans font-semibold">
                        {language === 'vi' ? 'Loại HĐ:' : 'Contract:'} {selectedItem.contractType ? getTranslatedContractType(selectedItem.contractType) : (language === 'vi' ? 'HĐLĐ xác định thời hạn' : 'Definite Contract')}
                      </span>
                      <span>·</span>
                      <span className="text-emerald-400 font-sans font-semibold">
                        {language === 'vi' ? 'ngày hệ thống 23/09/2026' : 'system date 23/09/2026'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Bộ chuyển đổi góc nhìn trực tiếp trong Modal */}
                  <div className="hidden sm:flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                    <span className="text-[10px] font-bold text-slate-400 px-1 uppercase tracking-wider">{t.role.label}</span>
                    {(['HR_ADMIN', 'EMPLOYEE', 'MANAGER'] as EvaluationUserRole[]).map(roleKey => {
                      const isAct = currentRole === roleKey;
                      const cfg = roleConfigs[roleKey];
                      return (
                        <button
                          key={roleKey}
                          type="button"
                          onClick={() => handleSwitchRole(roleKey)}
                          className={`px-2 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                            isAct 
                              ? 'bg-blue-600 text-white shadow-xs' 
                              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                          }`}
                        >
                          {cfg.shortTitle}
                        </button>
                      );
                    })}
                  </div>

                  {/* Status badge in header */}
                  {selectedItem.deadlineStatus === 'OVERDUE' && (
                    <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {language === 'vi' ? 'Quá hạn' : 'Overdue'}
                    </span>
                  )}
                  {selectedItem.deadlineStatus === 'UPCOMING' && (
                    <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {language === 'vi' ? 'Sắp đến hạn' : 'Due Soon'}
                    </span>
                  )}
                  {selectedItem.deadlineStatus === 'NOT_DUE' && (
                    <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {language === 'vi' ? 'Trong kỳ hạn' : 'On Time'}
                    </span>
                  )}
                  {selectedItem.deadlineStatus === 'DUE_TODAY' && (
                    <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {language === 'vi' ? 'Đến hạn hôm nay' : 'Due Today'}
                    </span>
                  )}
                  {selectedItem.deadlineStatus === 'CLOSED' && (
                    <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-300">
                      {language === 'vi' ? 'Đã đóng kỳ' : 'Closed'}
                    </span>
                  )}

                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    title={language === 'vi' ? 'Đóng popup' : 'Close'}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="p-6 space-y-5 overflow-y-auto text-xs">

                {/* 1. KHỐI THÔNG TIN KỲ ĐÁNH GIÁ & PHÂN CÔNG PHỤ TRÁCH (Tất cả trong 1 khối, mỗi thông tin 1 dòng riêng biệt) */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
                  {/* Header bar thanh mảnh */}
                  <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <CalendarDays size={12} />
                      </div>
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {t.detail.block1_title}
                      </h3>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                      {language === 'vi' ? 'Hồ sơ:' : 'Record:'} <strong className="text-slate-800 font-bold">{selectedItem.fullName}</strong> ({selectedItem.employeeCode})
                    </span>
                  </div>

                  {/* Danh sách các dòng thông tin (Mỗi thông tin 1 dòng riêng biệt, không để dạng cột trên cùng 1 dòng) */}
                  <div className="divide-y divide-slate-100 text-xs">
                    
                    {/* DÒNG 1: KỲ ĐÁNH GIÁ */}
                    <div className="p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-center space-x-3 min-w-[220px] shrink-0">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/80">
                          <Calendar size={14} />
                        </div>
                        <span className="text-[11px] uppercase font-bold tracking-wider text-slate-600">
                          {t.detail.period_label}
                        </span>
                      </div>
                      <div className="flex items-center flex-wrap gap-2.5 pl-10 sm:pl-0 sm:justify-end">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {getTranslatedPeriod(selectedItem.period)}
                        </span>
                        <span className="text-slate-300 hidden sm:inline">·</span>
                        <span className="text-xs text-slate-600">
                          {t.detail.period_cycle}
                        </span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {t.detail.period_sla}
                        </span>
                      </div>
                    </div>

                    {/* DÒNG 2: LOẠI HỢP ĐỒNG */}
                    <div className="p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-center space-x-3 min-w-[220px] shrink-0">
                        <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100/80">
                          <FileText size={14} />
                        </div>
                        <span className="text-[11px] uppercase font-bold tracking-wider text-slate-600">
                          {t.detail.contract_label}
                        </span>
                      </div>
                      <div className="flex items-center flex-wrap gap-2.5 pl-10 sm:pl-0 sm:justify-end">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {selectedItem.contractType ? getTranslatedContractType(selectedItem.contractType) : (language === 'vi' ? 'HĐLĐ không xác định thời hạn' : 'Indefinite Labor Contract')}
                        </span>
                      </div>
                    </div>

                    {/* DÒNG 3: OFFICIAL DATE (TÁCH THÀNH 1 DÒNG ĐỨNG TRƯỚC HẠN REVIEW) */}
                    <div className="p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-center space-x-3 min-w-[220px] shrink-0">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/80">
                          <CalendarDays size={14} />
                        </div>
                        <span className="text-[11px] uppercase font-bold tracking-wider text-slate-600">
                          {t.detail.official_date_label}
                        </span>
                      </div>
                      <div className="flex items-center flex-wrap gap-2.5 pl-10 sm:pl-0 sm:justify-end">
                        <span className="text-xs sm:text-sm font-bold font-mono text-slate-900">
                          {selectedItem.officialDate}
                        </span>
                      </div>
                    </div>

                    {/* DÒNG 4: HẠN REVIEW (REVIEW DATE) */}
                    <div className="p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-center space-x-3 min-w-[220px] shrink-0">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                          selectedItem.deadlineStatus === 'OVERDUE' 
                            ? 'bg-rose-50 text-rose-600 border-rose-100' 
                            : selectedItem.deadlineStatus === 'DUE_TODAY' 
                            ? 'bg-amber-50 text-amber-600 border-amber-100' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          <Clock size={14} />
                        </div>
                        <span className="text-[11px] uppercase font-bold tracking-wider text-slate-600">
                          {t.detail.review_date_label}
                        </span>
                      </div>
                      <div className="flex items-center flex-wrap gap-2.5 pl-10 sm:pl-0 sm:justify-end">
                        <span className="text-xs sm:text-sm font-bold font-mono text-slate-900">
                          {selectedItem.reviewDate}
                        </span>
                        {selectedItem.deadlineStatus === 'OVERDUE' ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                            <span>{getTranslatedDeadlineText(selectedItem.remainingDaysText)}</span>
                          </span>
                        ) : selectedItem.deadlineStatus === 'DUE_TODAY' ? (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                            <span>{language === 'vi' ? 'Đến hạn hôm nay' : 'Due Today'}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {getTranslatedDeadlineText(selectedItem.remainingDaysText)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* DÒNG 5: NGƯỜI ĐÁNH GIÁ PHỤ TRÁCH (Thích ứng theo cả 3 loại Role) */}
                    <div className="p-3 sm:px-4 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:bg-slate-50/70 transition-colors">
                      <div className="flex items-center space-x-3 min-w-[220px] shrink-0">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/80">
                          <UserCheck size={14} />
                        </div>
                        <span className="text-[11px] uppercase font-bold tracking-wider text-slate-600">
                          {t.detail.evaluator_label}
                        </span>
                      </div>
                      <div className="flex items-center flex-wrap gap-2.5 pl-10 sm:pl-0 sm:justify-end">
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {selectedItem.evaluatorName}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({currentRole === 'MANAGER' && selectedItem.evaluatorName === 'Trần Quốc Huy'
                            ? t.detail.role_context_mgr
                            : currentRole === 'EMPLOYEE'
                            ? t.detail.role_context_emp
                            : t.detail.role_context_hr})
                        </span>
                        <span className="text-slate-300 hidden sm:inline">·</span>
                        {selectedItem.sentAt ? (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {t.detail.status_activated}
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {t.detail.status_not_sent}
                          </span>
                        )}
                        {currentRole === 'HR_ADMIN' && (
                          <button
                            type="button"
                            onClick={() => setAssigningItem(selectedItem)}
                            className="ml-1 px-2.5 py-0.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors cursor-pointer flex items-center space-x-1"
                            title={t.detail.change_evaluator_tip}
                          >
                            <span>✏️ {t.detail.change_evaluator_btn}</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. QUY TRÌNH & HÀNH ĐỘNG ĐÁNH GIÁ NHÂN SỰ (Chu trình 5 bước với chú thích tinh gọn, súc tích) */}
                <div className="space-y-3.5 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
                        <Send size={15} className="text-blue-600" />
                        <span>{t.detail.block2_title}</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {t.detail.block2_subtitle}
                      </p>
                    </div>

                    {/* Badge trạng thái quy trình hiện tại */}
                    <div className="flex items-center space-x-1.5 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 text-xs">
                      <span className="text-slate-500 font-medium">{t.detail.current_stage_label}</span>
                      <strong className="text-blue-700 font-bold">{getTranslatedStatus(selectedItem.status)}</strong>
                    </div>
                  </div>

                  {/* Danh sách 5 bước thực hiện nối tiếp với mũi tên chuyển giai đoạn */}
                  <div className="space-y-1.5">
                    {/* Bước 1: HCNS gửi bảng đánh giá */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      selectedItem.status === 'Trong hạn' || selectedItem.status === 'Sắp đến hạn' || selectedItem.status === 'Quá hạn'
                        ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-400/20'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-start space-x-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                            selectedItem.status === 'Nhân viên đánh giá' || selectedItem.status === 'Quản lý đánh giá' || selectedItem.status === 'HCNS Review' || selectedItem.status === 'Hoàn thành'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-blue-600 text-white ring-2 ring-blue-200 shadow-2xs'
                          }`}>
                            {selectedItem.status === 'Nhân viên đánh giá' || selectedItem.status === 'Quản lý đánh giá' || selectedItem.status === 'HCNS Review' || selectedItem.status === 'Hoàn thành' ? '✓' : '1'}
                          </span>
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="font-bold text-slate-900 text-xs">{t.detail.step1_title}</span>
                              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                                {t.detail.step1_tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal">
                              {t.detail.step1_desc}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 sm:self-center pl-9 sm:pl-0">
                          {selectedItem.status === 'Trong hạn' || selectedItem.status === 'Sắp đến hạn' || selectedItem.status === 'Quá hạn' ? (
                            currentRole === 'HR_ADMIN' ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setPreviewTemplateItem(selectedItem)}
                                  className="px-3 py-1.5 bg-white border border-blue-300 hover:bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center space-x-1.5 active:scale-95"
                                  title={language === 'vi' ? 'Xem trước mẫu bảng đánh giá trước khi gửi' : 'Preview template before sending'}
                                >
                                  <Eye size={13} className="text-blue-600" />
                                  <span>{t.detail.step1_preview_btn}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSendEvaluation(selectedItem)}
                                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center space-x-1.5 active:scale-95"
                                  title={language === 'vi' ? 'Gửi bảng đánh giá đến nhân viên' : 'Send evaluation form to employee'}
                                >
                                  <Send size={13} />
                                  <span>{t.detail.step1_send_btn}</span>
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 font-medium">
                                  {t.detail.step1_waiting}
                                </span>
                              </div>
                            )
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                                {t.detail.step1_sent} ({selectedItem.sentAt || '25/09/2026'})
                              </span>
                              {currentRole === 'HR_ADMIN' && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewTemplateItem(selectedItem)}
                                  className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs rounded-md cursor-pointer inline-flex items-center space-x-1"
                                  title={language === 'vi' ? 'Xem lại mẫu bảng đánh giá' : 'Preview template'}
                                >
                                  <Eye size={12} />
                                  <span>{language === 'vi' ? 'Preview mẫu' : 'Preview'}</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mũi tên chuyển giai đoạn 1 -> 2 */}
                    <div className="flex items-center pl-6 py-0.5">
                      <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shadow-2xs">
                        <ArrowDown size={11} className="stroke-[2.5]" />
                      </div>
                    </div>

                    {/* Bước 2: Nhân viên tự đánh giá */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      selectedItem.status === 'Nhân viên đánh giá'
                        ? 'bg-purple-50/70 border-purple-300 ring-1 ring-purple-400/20'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-start space-x-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                            selectedItem.status === 'Quản lý đánh giá' || selectedItem.status === 'HCNS Review' || selectedItem.status === 'Hoàn thành'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : selectedItem.status === 'Nhân viên đánh giá'
                              ? 'bg-purple-600 text-white ring-2 ring-purple-200 shadow-2xs'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {selectedItem.status === 'Quản lý đánh giá' || selectedItem.status === 'HCNS Review' || selectedItem.status === 'Hoàn thành' ? '✓' : '2'}
                          </span>
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="font-bold text-slate-900 text-xs">{t.detail.step2_title}</span>
                              <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                                {t.detail.step2_tag_prefix} {selectedItem.fullName}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal">
                              {t.detail.step2_desc}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 sm:self-center pl-9 sm:pl-0">
                          {selectedItem.status === 'Nhân viên đánh giá' ? (
                            currentRole === 'EMPLOYEE' ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleDownloadTemplate(selectedItem)}
                                  className="px-3 py-1.5 bg-white border border-purple-300 hover:bg-purple-50 text-purple-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center space-x-1.5 active:scale-95"
                                  title={language === 'vi' ? 'Tải về file bảng đánh giá (.xlsx) để tự chấm điểm' : 'Download Excel form (.xlsx)'}
                                >
                                  <Download size={13} className="text-purple-600" />
                                  <span>{t.detail.step2_download_btn}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenUploadModal(selectedItem, 2)}
                                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center space-x-1.5 active:scale-95"
                                  title={language === 'vi' ? 'Tải lên bài tự chấm và minh chứng của bạn' : 'Upload your self-assessment and evidence'}
                                >
                                  <Upload size={13} />
                                  <span>{t.detail.step2_upload_btn}</span>
                                </button>
                              </div>
                            ) : currentRole === 'MANAGER' ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-[11px] text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200 font-medium">
                                  {t.detail.step2_waiting_emp}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemindEmployee(selectedItem)}
                                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center space-x-1.5"
                                  title={language === 'vi' ? 'Gửi nhắc nhở nhân viên nộp bài tự đánh giá' : 'Send reminder to employee'}
                                >
                                  <Send size={13} />
                                  <span>{t.detail.step2_remind_btn}</span>
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className="text-[11px] text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200 font-medium">
                                  {t.detail.step2_waiting_emp}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemindEmployee(selectedItem)}
                                  className="px-2.5 py-1 bg-white border border-amber-300 hover:bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                                >
                                  <Send size={12} />
                                  <span>{t.detail.step2_remind_emp_btn}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenUploadModal(selectedItem, 2)}
                                  className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                                >
                                  <Upload size={12} />
                                  <span>{t.detail.step2_support_upload}</span>
                                </button>
                              </div>
                            )
                          ) : selectedItem.status === 'Quản lý đánh giá' || selectedItem.status === 'HCNS Review' || selectedItem.status === 'Hoàn thành' ? (
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                                {t.detail.step2_submitted} {selectedItem.selfScore ? `(${selectedItem.selfScore}/100)` : ''}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDownloadTemplate(selectedItem)}
                                className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs rounded-md cursor-pointer inline-flex items-center space-x-1"
                                title={language === 'vi' ? 'Tải lại file bản tự đánh giá' : 'Download form file'}
                              >
                                <Download size={12} />
                                <span>{language === 'vi' ? 'Tải file' : 'Download'}</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">{t.detail.step2_waiting_step1}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mũi tên chuyển giai đoạn 2 -> 3 */}
                    <div className="flex items-center pl-6 py-0.5">
                      <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shadow-2xs">
                        <ArrowDown size={11} className="stroke-[2.5]" />
                      </div>
                    </div>

                    {/* Bước 3: Quản lý trực tiếp đánh giá */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      selectedItem.status === 'Quản lý đánh giá'
                        ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-400/20'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-start space-x-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                            selectedItem.status === 'HCNS Review' || selectedItem.status === 'Hoàn thành'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : selectedItem.status === 'Quản lý đánh giá'
                              ? 'bg-indigo-600 text-white ring-2 ring-indigo-200 shadow-2xs'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {selectedItem.status === 'HCNS Review' || selectedItem.status === 'Hoàn thành' ? '✓' : '3'}
                          </span>
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="font-bold text-slate-900 text-xs">{t.detail.step3_title}</span>
                              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                {t.detail.step3_tag_prefix} {selectedItem.evaluatorName}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal">
                              {t.detail.step3_desc}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 sm:self-center pl-9 sm:pl-0">
                          {selectedItem.status === 'Quản lý đánh giá' ? (
                            currentRole === 'MANAGER' ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  type="button"
                                  onClick={() => handleDownloadTemplate(selectedItem)}
                                  className="px-3 py-1.5 bg-white border border-indigo-300 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center space-x-1.5 active:scale-95"
                                  title={language === 'vi' ? 'Tải về bản tự đánh giá của nhân viên để Quản lý chấm điểm' : 'Download employee self-assessment form'}
                                >
                                  <Download size={13} className="text-indigo-600" />
                                  <span>{t.detail.step3_download_emp_work}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenUploadModal(selectedItem, 3)}
                                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs flex items-center space-x-1.5 active:scale-95"
                                  title={language === 'vi' ? 'Mở popup nhập điểm và tải lên bản đánh giá đã chấm của Quản lý' : 'Open grading modal and submit results'}
                                >
                                  <Upload size={13} />
                                  <span>{t.detail.step3_grade_btn}</span>
                                </button>
                              </div>
                            ) : currentRole === 'EMPLOYEE' ? (
                              <div className="flex items-center space-x-2">
                                <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 font-medium">
                                  {t.detail.step3_waiting_mgr}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadTemplate(selectedItem)}
                                  className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs rounded-md cursor-pointer inline-flex items-center space-x-1"
                                >
                                  <Download size={12} />
                                  <span>{language === 'vi' ? 'Xem bài nộp' : 'View Submission'}</span>
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className="text-[11px] text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 font-medium">
                                  {t.detail.step3_waiting_mgr}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => showToast(language === 'vi' ? `Đã gửi email nhắc nhở Quản lý ${selectedItem.evaluatorName} khẩn trương hoàn thành chấm điểm!` : `Reminder sent to Manager ${selectedItem.evaluatorName}!`)}
                                  className="px-2.5 py-1 bg-white border border-indigo-300 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                                >
                                  <Send size={12} />
                                  <span>{t.detail.step3_remind_mgr}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenUploadModal(selectedItem, 3)}
                                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                                >
                                  <Upload size={12} />
                                  <span>{t.detail.step3_support_grade}</span>
                                </button>
                              </div>
                            )
                          ) : selectedItem.status === 'HCNS Review' || selectedItem.status === 'Hoàn thành' ? (
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                                {t.detail.step3_submitted} {selectedItem.managerScore || selectedItem.score ? `(${language === 'vi' ? 'Điểm QL:' : 'MGR Score:'} ${selectedItem.managerScore || selectedItem.score}/100)` : ''}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDownloadTemplate(selectedItem)}
                                className="px-2 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs rounded-md cursor-pointer inline-flex items-center space-x-1"
                                title={language === 'vi' ? 'Tải bản đánh giá quản lý đã chấm' : 'Download graded manager assessment'}
                              >
                                <Download size={12} />
                                <span>{language === 'vi' ? 'Tải file' : 'Download'}</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">{t.detail.step3_waiting_step2}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mũi tên chuyển giai đoạn 3 -> 4 */}
                    <div className="flex items-center pl-6 py-0.5">
                      <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shadow-2xs">
                        <ArrowDown size={11} className="stroke-[2.5]" />
                      </div>
                    </div>

                    {/* Bước 4: HCNS review */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      selectedItem.status === 'HCNS Review'
                        ? 'bg-teal-50/80 border-teal-300 ring-1 ring-teal-400/20'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-start space-x-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                            selectedItem.status === 'Hoàn thành'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : selectedItem.status === 'HCNS Review'
                              ? 'bg-teal-600 text-white ring-2 ring-teal-200 shadow-2xs animate-pulse'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {selectedItem.status === 'Hoàn thành' ? '✓' : '4'}
                          </span>
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="font-bold text-slate-900 text-xs">{t.detail.step4_title}</span>
                              <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                {t.detail.step4_tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal">
                              {t.detail.step4_desc}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 sm:self-center pl-9 sm:pl-0">
                          {selectedItem.status === 'HCNS Review' ? (
                            currentRole === 'HR_ADMIN' ? (
                              <div className="flex items-center space-x-1.5 bg-teal-100/80 border border-teal-300 px-3 py-1.5 rounded-lg text-teal-900 text-xs font-bold">
                                <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></span>
                                <span>{t.detail.step4_pending_hr}</span>
                              </div>
                            ) : currentRole === 'MANAGER' ? (
                              <span className="inline-flex items-center text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                                {t.detail.step4_submitted_to_hr}
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                                {t.detail.step4_submitted_to_hr}
                              </span>
                            )
                          ) : selectedItem.status === 'Hoàn thành' ? (
                            <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                              {t.detail.step4_hr_reviewed}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">{t.detail.step4_waiting_step3}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mũi tên chuyển giai đoạn 4 -> 5 */}
                    <div className="flex items-center pl-6 py-0.5">
                      <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shadow-2xs">
                        <ArrowDown size={11} className="stroke-[2.5]" />
                      </div>
                    </div>

                    {/* Bước 5: Hoàn tất đóng kỳ */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      selectedItem.status === 'Hoàn thành'
                        ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400/20'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-start space-x-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                            selectedItem.status === 'Hoàn thành'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {selectedItem.status === 'Hoàn thành' ? '✓' : '5'}
                          </span>
                          <div className="space-y-0.5">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="font-bold text-slate-900 text-xs">{t.detail.step5_title}</span>
                              <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {t.detail.step5_tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal">
                              {t.detail.step5_desc}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 sm:self-center pl-9 sm:pl-0">
                          {selectedItem.status === 'Hoàn thành' ? (
                            <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs">
                              {t.detail.step5_completed}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 italic">{t.detail.step5_waiting_step4}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer (Đã bỏ Đổi/Gán & Tải template; Phê duyệt & Đóng kỳ chỉ enable khi HCNS Review) */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                {/* Left side: Trạng thái hiện tại */}
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <span className="font-medium text-slate-500">{t.detail.footer_status_label}</span>
                  {renderStatusBadge(selectedItem.status, language)}
                </div>

                {/* Right side: Action buttons theo Role */}
                <div className="flex flex-wrap items-center space-x-2 w-full sm:w-auto justify-end gap-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    {t.detail.footer_close}
                  </button>

                  {/* Hành động cho HCNS */}
                  {currentRole === 'HR_ADMIN' && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          showToast(language === 'vi' ? `Đã lưu bản nháp đánh giá cho nhân sự ${selectedItem.fullName}` : `Saved draft for employee ${selectedItem.fullName}`);
                        }}
                        className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        {t.detail.footer_save_draft}
                      </button>
                      
                      {selectedItem.status === 'HCNS Review' ? (
                        <button
                          type="button"
                          onClick={() => {
                            handleApproveAndClosePeriod(selectedItem);
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm flex items-center space-x-1.5 ring-2 ring-emerald-500/20 active:scale-95"
                          title={language === 'vi' ? 'Phê duyệt kết quả và đóng kỳ đánh giá định kỳ (Đang ở bước HCNS Review)' : 'Approve results and close cycle'}
                        >
                          <Check size={14} className="stroke-[2.5]" />
                          <span>{t.detail.footer_approve}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="px-4 py-2 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold rounded-lg cursor-not-allowed flex items-center space-x-1.5 select-none"
                          title={t.detail.footer_approve_only_hr}
                        >
                          <Check size={14} className="opacity-40" />
                          <span>{t.detail.footer_approve}</span>
                          <span className="text-[10px] font-normal text-slate-400 hidden sm:inline">{t.detail.footer_approve_only_hr}</span>
                        </button>
                      )}
                    </>
                  )}

                  {/* Hành động cho Nhân sự (Chỉ cho phép tải mẫu khi đang ở giai đoạn 'Nhân viên đánh giá') */}
                  {currentRole === 'EMPLOYEE' && (
                    <>
                      {selectedItem.status === 'Nhân viên đánh giá' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDownloadTemplate(selectedItem)}
                            className="px-3.5 py-2 border border-purple-300 text-purple-700 bg-purple-50 hover:bg-purple-100 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5"
                          >
                            <Download size={13} />
                            <span>{t.detail.step2_download_btn}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenUploadModal(selectedItem, 2)}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm flex items-center space-x-1.5 ring-2 ring-purple-500/20 active:scale-95"
                            title={language === 'vi' ? 'Tải lên bài tự chấm và minh chứng KPI của bạn' : 'Upload your self-assessment and KPI evidence'}
                          >
                            <Upload size={13} />
                            <span>{t.detail.step2_upload_btn}</span>
                          </button>
                        </>
                      ) : selectedItem.status === 'Quản lý đánh giá' || selectedItem.status === 'HCNS Review' || selectedItem.status === 'Hoàn thành' ? (
                        <button
                          type="button"
                          disabled
                          className="px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-default select-none"
                        >
                          <CheckCircle2 size={13} />
                          <span>{language === 'vi' ? 'Đã nộp bài tự đánh giá' : 'Self-assessment submitted'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="px-3.5 py-2 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-medium rounded-lg cursor-not-allowed select-none"
                        >
                          <span>{t.detail.footer_waiting_issuance}</span>
                        </button>
                      )}
                    </>
                  )}

                  {/* Hành động cho Quản lý đánh giá (Chỉ cho phép tải bài khi đang ở giai đoạn 'Quản lý đánh giá') */}
                  {currentRole === 'MANAGER' && (
                    <>
                      {selectedItem.status === 'Quản lý đánh giá' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDownloadTemplate(selectedItem)}
                            className="px-3.5 py-2 border border-indigo-300 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5"
                            title={language === 'vi' ? 'Tải bài tự chấm của nhân sự để xem trước' : 'Download employee self-assessment form'}
                          >
                            <Download size={13} />
                            <span>{t.detail.step3_download_emp_work}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenUploadModal(selectedItem, 3)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm flex items-center space-x-1.5 ring-2 ring-indigo-500/20 active:scale-95"
                            title={language === 'vi' ? 'Quản lý nhập điểm và gửi hồ sơ lên HCNS' : 'Enter score and submit to HR'}
                          >
                            <UserCheck size={14} />
                            <span>{t.detail.step3_grade_btn}</span>
                          </button>
                        </>
                      ) : selectedItem.status === 'Nhân viên đánh giá' ? (
                        <button
                          type="button"
                          onClick={() => handleRemindEmployee(selectedItem)}
                          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm flex items-center space-x-1.5 ring-2 ring-amber-400/20 active:scale-95"
                          title={language === 'vi' ? 'Nhắc nhở nhân viên khẩn trương nộp bài' : 'Remind employee to submit assessment'}
                        >
                          <Send size={13} />
                          <span>{t.detail.step2_remind_emp_btn}</span>
                        </button>
                      ) : selectedItem.status === 'HCNS Review' || selectedItem.status === 'Hoàn thành' ? (
                        <button
                          type="button"
                          disabled
                          className="px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-default select-none"
                        >
                          <CheckCircle2 size={13} />
                          <span>{language === 'vi' ? 'Đã gửi kết quả lên HCNS' : 'Results submitted to HR'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="px-3.5 py-2 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-medium rounded-lg cursor-not-allowed select-none"
                        >
                          <span>{t.detail.footer_waiting_issuance}</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* 7. Modal Phân công Người Đánh Giá */}
      {assigningItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {language === 'vi' ? 'Gán Người Đánh Giá' : 'Assign Evaluator'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'vi' 
                ? <>Chọn cán bộ quản lý phụ trách đánh giá định kỳ cho nhân sự <strong>{assigningItem.fullName}</strong> ({assigningItem.employeeCode}).</>
                : <>Select the manager responsible for periodic evaluation for <strong>{assigningItem.fullName}</strong> ({assigningItem.employeeCode}).</>}
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Chọn người đánh giá' : 'Select evaluator'}
                </label>
                <select
                  value={newEvaluatorName}
                  onChange={(e) => setNewEvaluatorName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 focus:bg-white font-medium text-slate-800"
                >
                  <option value="Trần Quốc Huy">{language === 'vi' ? 'Trần Quốc Huy (Trưởng phòng IT)' : 'Tran Quoc Huy (IT Head)'}</option>
                  <option value="Lê Thanh Hà">{language === 'vi' ? 'Lê Thanh Hà (Kế toán trưởng / HR Lead)' : 'Le Thanh Ha (Chief Accountant / HR Lead)'}</option>
                  <option value="Vũ Đình Long">{language === 'vi' ? 'Vũ Đình Long (Giám đốc Kinh doanh)' : 'Vu Dinh Long (Sales Director)'}</option>
                  <option value="Nguyễn Văn An">{language === 'vi' ? 'Nguyễn Văn An (Technical Lead)' : 'Nguyen Van An (Technical Lead)'}</option>
                  <option value="Hồ Tú Anh">{language === 'vi' ? 'Hồ Tú Anh (PMO Director)' : 'Ho Tu Anh (PMO Director)'}</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-6">
              <button
                onClick={() => setAssigningItem(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                {language === 'vi' ? 'Hủy' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveAssignment}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                {language === 'vi' ? 'Lưu phân công' : 'Save Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modal Xem Trước Biểu Mẫu Template Đánh Giá Theo Role */}
      {previewTemplateItem && (() => {
        const tmpl = getRoleTemplate(previewTemplateItem.position, previewTemplateItem.department);
        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{tmpl.name}</h3>
                    <div className="text-xs text-slate-300 font-mono mt-0.5">
                      {tmpl.code} · {language === 'vi' ? `Phiên bản ${tmpl.version}` : `Version ${tmpl.version}`} · {tmpl.size}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewTemplateItem(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 overflow-y-auto text-xs">
                <div className="bg-emerald-50/80 border border-emerald-200 p-3 rounded-xl flex items-start space-x-3 text-emerald-950">
                  <FileCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-emerald-900">
                      {language === 'vi' ? 'Vị trí nhân sự áp dụng biểu mẫu này:' : 'Position applicable for this template:'}
                    </div>
                    <div className="text-xs text-emerald-800 mt-0.5 font-medium">{tmpl.role}</div>
                    <div className="text-[11px] text-emerald-700 mt-1">
                      {language === 'vi'
                        ? 'Biểu mẫu chuẩn hóa gồm 2 sheet: "THONG_TIN_CHUNG" và "TIEU_CHI_DANH_GIA" phục vụ cho nhân viên tự chấm điểm trước, sau đó Quản lý đối soát và chấm điểm vòng 2.'
                        : 'Standardized template includes 2 sheets: "GENERAL_INFO" and "EVALUATION_CRITERIA" for employee self-assessment first, followed by manager review and score.'}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                    {language === 'vi' ? 'Các Nhóm Tiêu Chí Đánh Giá Chuẩn Hóa' : 'Standardized Evaluation Criteria Groups'}
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-xs">
                        <tr>
                          <th className="py-2.5 px-3 w-10 text-center">{language === 'vi' ? 'STT' : 'No.'}</th>
                          <th className="py-2.5 px-3">{language === 'vi' ? 'Nhóm tiêu chí' : 'Criteria Group'}</th>
                          <th className="py-2.5 px-3 text-center w-24">{language === 'vi' ? 'Tỷ trọng' : 'Weight'}</th>
                          <th className="py-2.5 px-3">{language === 'vi' ? 'Mô tả & Hướng dẫn minh chứng' : 'Description & Evidence Guide'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs bg-white">
                        {tmpl.criteriaSummary.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-bold text-slate-800">{item.name}</td>
                            <td className="py-2.5 px-3 text-center font-bold text-blue-600">{item.weight}</td>
                            <td className="py-2.5 px-3 text-slate-600 leading-relaxed">{item.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
                  <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>{language === 'vi' ? 'Quy Trình Triển Khai Template 4 Bước:' : '4-Step Template Implementation Process:'}</span>
                  </div>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-700">
                    {language === 'vi' ? (
                      <>
                        <li>HR/Quản lý nhấn <strong>"Gửi đánh giá"</strong>: Hệ thống gửi file template tới nhân viên.</li>
                        <li><strong>Nhân viên tự đánh giá trước</strong>: Điền điểm tự chấm và tài liệu minh chứng vào sheet TIEU_CHI_DANH_GIA.</li>
                        <li><strong>Quản lý trực tiếp chấm điểm</strong>: Rà soát điểm tự chấm, đối chiếu kết quả thực tế và cho điểm quản lý.</li>
                        <li><strong>Phê duyệt & Đóng kỳ</strong>: HR tổng hợp kết quả, xét nâng lương hoặc tái ký hợp đồng.</li>
                      </>
                    ) : (
                      <>
                        <li>HR/Manager clicks <strong>"Send Evaluation"</strong>: System distributes template to employee.</li>
                        <li><strong>Employee self-evaluates</strong>: Fill self-score and evidence in EVALUATION_CRITERIA sheet.</li>
                        <li><strong>Direct manager scores</strong>: Reviews self-score, compares actual KPIs and gives manager score.</li>
                        <li><strong>Approve & Close Cycle</strong>: HR compiles final results for salary review or contract renewal.</li>
                      </>
                    )}
                  </ol>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setPreviewTemplateItem(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  {language === 'vi' ? 'Đóng' : 'Close'}
                </button>
                <button
                  onClick={() => {
                    handleDownloadTemplate(previewTemplateItem);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 shadow-xs"
                >
                  <Download size={14} />
                  <span>{language === 'vi' ? 'Tải file template Excel này (.xlsx)' : 'Download Excel Template (.xlsx)'}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 8.5 Modal Upload Bản Đánh Giá (Giai đoạn 2 và Giai đoạn 3) */}
      {uploadModal.isOpen && uploadModal.item && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className={`px-6 py-4 text-white flex items-center justify-between shrink-0 border-b ${
              uploadModal.stage === 2 ? 'bg-purple-900 border-purple-800' : 'bg-indigo-900 border-indigo-800'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-sm ${
                  uploadModal.stage === 2 ? 'bg-purple-600' : 'bg-indigo-600'
                }`}>
                  <Upload size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {uploadModal.stage === 2 
                      ? (language === 'vi' ? 'Tải Lên Bản Tự Đánh Giá (Nhân Viên)' : 'Upload Employee Self-Assessment')
                      : (language === 'vi' ? 'Tải Lên Bản Đánh Giá Đã Chấm (Quản Lý)' : 'Upload Manager Graded Assessment')}
                  </h3>
                  <div className="text-xs text-slate-300 mt-0.5 flex flex-wrap items-center gap-1.5 font-mono">
                    <span className="font-sans font-bold text-white">{uploadModal.item.fullName}</span>
                    <span>·</span>
                    <span>{uploadModal.item.employeeCode}</span>
                    <span>·</span>
                    <span className="font-sans">{getTranslatedPeriod(uploadModal.item.period)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setUploadModal(prev => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title={language === 'vi' ? 'Đóng popup' : 'Close popup'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto text-xs">
              {/* Process Stage Notice */}
              <div className={`p-3 rounded-xl border flex items-start space-x-2.5 ${
                uploadModal.stage === 2
                  ? 'bg-purple-50 text-purple-950 border-purple-200'
                  : 'bg-indigo-50 text-indigo-950 border-indigo-200'
              }`}>
                <Info size={16} className={`shrink-0 mt-0.5 ${uploadModal.stage === 2 ? 'text-purple-600' : 'text-indigo-600'}`} />
                <div className="leading-relaxed">
                  {uploadModal.stage === 2 ? (
                    language === 'vi' ? (
                      <>
                        <strong>Giai đoạn 2:</strong> Sau khi nhân viên hoàn thiện bảng tự đánh giá và tải tệp lên hệ thống, nhấn <strong>"Xác nhận & Gửi Quản lý"</strong> để chuyển hồ sơ sang cho Quản lý trực tiếp (<strong>{uploadModal.item.evaluatorName}</strong>) rà soát và chấm điểm.
                      </>
                    ) : (
                      <>
                        <strong>Stage 2:</strong> After the employee completes the self-evaluation and uploads the file, click <strong>"Confirm & Send to Manager"</strong> to forward to direct manager (<strong>{uploadModal.item.evaluatorName}</strong>) for review and scoring.
                      </>
                    )
                  ) : (
                    language === 'vi' ? (
                      <>
                        <strong>Giai đoạn 3:</strong> Quản lý trực tiếp sau khi hoàn tất chấm điểm và phỏng vấn 1-1 sẽ tải tệp kết quả lên hệ thống, nhấn <strong>"Xác nhận & Gửi HCNS Review"</strong> để chuyển sang Ban Nhân sự thẩm định và chuẩn bị phê duyệt.
                      </>
                    ) : (
                      <>
                        <strong>Stage 3:</strong> After completing scoring and 1-on-1 interview, direct manager uploads the result file and clicks <strong>"Confirm & Send to HR Review"</strong> to transfer to HR for verification and approval.
                      </>
                    )
                  )}
                </div>
              </div>

              {/* Drag & Drop File Upload Box */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {language === 'vi' ? 'Tệp Bản Đánh Giá (.xlsx, .xls, .pdf, .docx)' : 'Evaluation File (.xlsx, .xls, .pdf, .docx)'} <span className="text-rose-500">*</span>
                </label>

                <div 
                  className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/20 p-5 rounded-xl text-center transition-colors cursor-pointer relative"
                  onClick={() => {
                    const input = document.getElementById('evaluation-file-input');
                    if (input) input.click();
                  }}
                >
                  <input
                    id="evaluation-file-input"
                    type="file"
                    className="hidden"
                    accept=".xlsx,.xls,.pdf,.docx,.doc"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const sizeKb = Math.round(file.size / 1024);
                        setUploadModal(prev => ({
                          ...prev,
                          fileName: file.name,
                          fileSize: `${sizeKb} KB`
                        }));
                        showToast(language === 'vi' ? `Đã chọn tệp: ${file.name}` : `Selected file: ${file.name}`);
                      }
                    }}
                  />

                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-2xs">
                      <FileSpreadsheet size={24} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-xs sm:text-sm">
                        {language === 'vi' ? 'Kéo thả file vào đây hoặc ' : 'Drag & drop file here or '}
                        <span className="text-blue-600 underline">
                          {language === 'vi' ? 'chọn từ thiết bị' : 'browse from device'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {language === 'vi' ? 'Hỗ trợ định dạng: .xlsx, .xls, .pdf, .docx (Dung lượng tối đa 25MB)' : 'Supported: .xlsx, .xls, .pdf, .docx (Max size 25MB)'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attached File Preview Card */}
                {uploadModal.fileName && (
                  <div className="mt-2.5 p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <FileCheck size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-emerald-950 text-xs truncate font-mono">
                          {uploadModal.fileName}
                        </div>
                        <div className="text-[10px] text-emerald-700">
                          {uploadModal.fileSize || '250 KB'} · {language === 'vi' ? 'Đã sẵn sàng gửi' : 'Ready to submit'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                      {language === 'vi' ? 'Đã chọn' : 'Selected'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setUploadModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                {language === 'vi' ? 'Hủy bỏ' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleConfirmUpload}
                className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-all cursor-pointer shadow-sm flex items-center space-x-1.5 active:scale-95 ${
                  uploadModal.stage === 2
                    ? 'bg-purple-600 hover:bg-purple-700 ring-2 ring-purple-400/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 ring-2 ring-indigo-400/20'
                }`}
                title={
                  uploadModal.stage === 2 
                    ? (language === 'vi' ? 'Xác nhận nộp bài và gửi sang Quản lý' : 'Confirm submission and send to Manager')
                    : (language === 'vi' ? 'Xác nhận hoàn thành và gửi sang HCNS Review' : 'Confirm completion and send to HR Review')
                }
              >
                <Check size={14} className="stroke-[2.5]" />
                <span>
                  {uploadModal.stage === 2 
                    ? (language === 'vi' ? 'Xác nhận & Gửi Quản lý' : 'Confirm & Send to Manager')
                    : (language === 'vi' ? 'Xác nhận & Gửi HCNS Review' : 'Confirm & Send to HR Review')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Modal Xem Log Lịch Sử Thay Đổi Trạng Thái & Nhật Ký Đánh Giá */}
      {viewingLogItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <span>{language === 'vi' ? 'Nhật Ký Lịch Sử Thay Đổi Trạng Thái' : 'Status Change Audit History'}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono font-normal bg-slate-800 text-blue-300 border border-slate-700">
                      #{viewingLogItem.employeeCode}
                    </span>
                  </h3>
                  <div className="text-xs text-slate-300 mt-0.5 flex flex-wrap items-center gap-1.5">
                    <strong className="text-white">{viewingLogItem.fullName}</strong>
                    <span>·</span>
                    <span>{language === 'vi' ? `Phòng ${getTranslatedDivision(viewingLogItem.department)}` : `${getTranslatedDivision(viewingLogItem.department)} Dept`}</span>
                    <span>·</span>
                    <span>{getTranslatedPeriod(viewingLogItem.period)}</span>
                    <span>·</span>
                    <span>{language === 'vi' ? 'Người đánh giá:' : 'Evaluator:'} <strong className="text-slate-200">{getTranslatedEvaluator(viewingLogItem.evaluatorName)}</strong></span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingLogItem(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title={language === 'vi' ? 'Đóng popup log' : 'Close log popup'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-slate-500 font-medium">{language === 'vi' ? 'Trạng thái hiện tại:' : 'Current status:'}</span>
                {renderStatusBadge(viewingLogItem.status)}
              </div>

              <div className="flex items-center space-x-3 text-slate-500 font-mono text-[11px]">
                <span>{language === 'vi' ? 'Cập nhật gần nhất:' : 'Latest update:'} <strong className="text-slate-800">{viewingLogItem.statusUpdatedAt || '—'}</strong></span>
                <span>·</span>
                <span>{language === 'vi' ? 'Tổng số log:' : 'Total logs:'} <strong className="text-blue-600">{viewingLogItem.statusLogs?.length || 0}</strong></span>
              </div>
            </div>

            {/* Modal Body: Log List & Table */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh] text-xs">
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                      <th className="py-2.5 px-3 w-10 text-center">#</th>
                      <th className="py-2.5 px-3 min-w-[130px]">{language === 'vi' ? 'Thời gian' : 'Timestamp'}</th>
                      <th className="py-2.5 px-3 min-w-[140px]">{language === 'vi' ? 'Người thao tác' : 'Performer'}</th>
                      <th className="py-2.5 px-3 min-w-[130px]">{language === 'vi' ? 'Trạng thái trước' : 'Previous Status'}</th>
                      <th className="py-2.5 px-3 min-w-[130px]">{language === 'vi' ? 'Trạng thái mới' : 'New Status'}</th>
                      <th className="py-2.5 px-4 min-w-[200px]">{language === 'vi' ? 'Hành động & Ghi chú' : 'Action & Notes'}</th>
                      <th className="py-2.5 px-3 min-w-[110px]">{language === 'vi' ? 'Kênh' : 'Channel'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs bg-white">
                    {(!viewingLogItem.statusLogs || viewingLogItem.statusLogs.length === 0) ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          {language === 'vi' ? 'Chưa có ghi nhận nhật ký nào cho hồ sơ này.' : 'No audit log records for this record yet.'}
                        </td>
                      </tr>
                    ) : (
                      viewingLogItem.statusLogs.map((log, idx) => (
                        <tr key={log.id || idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-700 tabular-nums whitespace-nowrap font-medium">
                            {log.timestamp}
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-800">
                            {log.performer}
                          </td>
                          <td className="py-3 px-3 text-slate-500">
                            {log.previousStatus === '—' ? (
                              <span className="text-slate-300 font-mono">—</span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                                {getTranslatedStatus(log.previousStatus)}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {getTranslatedStatus(log.newStatus)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 leading-relaxed">
                            {log.note}
                          </td>
                          <td className="py-3 px-3 text-[11px] font-mono text-slate-500">
                            {log.channel || 'IMIS Portal'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShieldAlert size={16} className="text-blue-600 shrink-0" />
                  <span>
                    {language === 'vi'
                      ? 'Toàn bộ thao tác thay đổi trạng thái, gửi biểu mẫu và chấm điểm đều được ghi vết Audit Log tự động theo chuẩn quy trình doanh nghiệp.'
                      : 'All status changes, form submissions, and scorings are automatically audit-logged according to enterprise workflow standards.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (!viewingLogItem?.statusLogs) return;
                  const logRows = viewingLogItem.statusLogs.map((l, i) => ({
                    'STT': i + 1,
                    'Mã NV': viewingLogItem.employeeCode,
                    'Họ tên': viewingLogItem.fullName,
                    'Thời gian': l.timestamp,
                    'Người thực hiện': l.performer,
                    'Trạng thái trước': l.previousStatus,
                    'Trạng thái mới': l.newStatus,
                    'Nội dung thao tác': l.note,
                    'Kênh': l.channel || 'IMIS Portal'
                  }));
                  const ws = XLSX.utils.json_to_sheet(logRows);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, 'Audit_Log');
                  XLSX.writeFile(wb, `Log_Danh_Gia_${viewingLogItem.employeeCode}_${viewingLogItem.fullName.replace(/\s+/g, '_')}.xlsx`);
                  showToast(language === 'vi' ? 'Đã xuất file Excel nhật ký thay đổi trạng thái!' : 'Audit log exported to Excel!');
                }}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                <Download size={13} className="text-slate-500" />
                <span>{language === 'vi' ? 'Xuất file Excel Log' : 'Export Excel Log'}</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingLogItem(null)}
                className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                {language === 'vi' ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
