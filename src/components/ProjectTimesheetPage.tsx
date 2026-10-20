import React, { useState, useMemo } from 'react';
import { 
  CalendarDays,
  Search,
  Filter,
  AlertTriangle,
  AlertCircle,
  FileSpreadsheet,
  Lock,
  Unlock,
  Eye,
  ChevronRight,
  RefreshCw,
  Check,
  X,
  Clock,
  Briefcase,
  Users,
  Building,
  TrendingUp,
  Download,
  CheckCircle2,
  HelpCircle,
  ArrowUpDown
} from 'lucide-react';
import * as XLSX from 'xlsx';

export type ProjectTimesheetStatus = 'APPROVED' | 'PENDING' | 'MISMATCH' | 'REJECTED' | 'LOCKED';

export interface DailyLogDetail {
  date: string;
  dayOfWeek: string;
  attendanceHours: number; // Giờ chấm công máy
  projectHours: number;    // Giờ log dự án
  otHours: number;         // Giờ OT
  taskName: string;
  note: string;
  status: 'VALID' | 'MISMATCH' | 'WEEKEND';
}

export interface ProjectMemberTimesheet {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  department: string;
  projectCode: string;
  projectName: string;
  role: string;
  plannedHours: number;
  actualHours: number;
  otHours: number;
  attendanceHours: number; // Tổng giờ máy chấm công
  status: ProjectTimesheetStatus;
  notes?: string;
  dailyLogs: DailyLogDetail[];
}

const INITIAL_PROJECT_TIMESHEETS: ProjectMemberTimesheet[] = [
  {
    id: '1',
    employeeCode: 'V00623',
    fullName: 'HỒ TÚ ANH',
    email: 'anh.ht@vtx.vn',
    department: 'Software Development',
    projectCode: 'IMIS-CORE',
    projectName: 'IMIS Enterprise Core System',
    role: 'Project Manager',
    plannedHours: 40,
    actualHours: 40,
    otHours: 4,
    attendanceHours: 40,
    status: 'APPROVED',
    dailyLogs: [
      { date: '14/09', dayOfWeek: 'Thứ 2', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Họp sprint planning & điều phối backlog', note: 'Hoàn thành đúng hạn', status: 'VALID' },
      { date: '15/09', dayOfWeek: 'Thứ 3', attendanceHours: 8, projectHours: 8, otHours: 2, taskName: 'Review kiến trúc Module Timesheet & Approval Flow', note: 'OT review thiết kế', status: 'VALID' },
      { date: '16/09', dayOfWeek: 'Thứ 4', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Điều phối nhân sự & theo dõi tiến độ sprint', note: '', status: 'VALID' },
      { date: '17/09', dayOfWeek: 'Thứ 5', attendanceHours: 8, projectHours: 8, otHours: 2, taskName: 'Họp nghiệm thu giai đoạn với khách hàng VTX', note: 'OT demo khách hàng', status: 'VALID' },
      { date: '18/09', dayOfWeek: 'Thứ 6', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Chốt công tuần & rà soát SLA phê duyệt', note: 'Đã hoàn thành chốt công', status: 'VALID' },
      { date: '19/09', dayOfWeek: 'Thứ 7', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
      { date: '20/09', dayOfWeek: 'Chủ nhật', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
    ]
  },
  {
    id: '2',
    employeeCode: 'V00914',
    fullName: 'NGUYỄN VĂN AN',
    email: 'an.nv@vtx.vn',
    department: 'Software Development',
    projectCode: 'IMIS-CORE',
    projectName: 'IMIS Enterprise Core System',
    role: 'Senior Frontend Lead',
    plannedHours: 40,
    actualHours: 40,
    otHours: 6,
    attendanceHours: 40,
    status: 'APPROVED',
    dailyLogs: [
      { date: '14/09', dayOfWeek: 'Thứ 2', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Xây dựng UI Bảng công dự án chuẩn IMIS', note: '', status: 'VALID' },
      { date: '15/09', dayOfWeek: 'Thứ 3', attendanceHours: 8, projectHours: 8, otHours: 2, taskName: 'Tích hợp component bộ lọc tuần & kỳ công', note: 'Làm thêm tối', status: 'VALID' },
      { date: '16/09', dayOfWeek: 'Thứ 4', attendanceHours: 8, projectHours: 8, otHours: 2, taskName: 'Xây dựng modal chi tiết log time theo ngày', note: 'Hoàn thành tính năng', status: 'VALID' },
      { date: '17/09', dayOfWeek: 'Thứ 5', attendanceHours: 8, projectHours: 8, otHours: 2, taskName: 'Tối ưu hiệu năng table với 1,000 dòng dữ liệu', note: '', status: 'VALID' },
      { date: '18/09', dayOfWeek: 'Thứ 6', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Fix lỗi responsive & export file Excel', note: '', status: 'VALID' },
      { date: '19/09', dayOfWeek: 'Thứ 7', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
      { date: '20/09', dayOfWeek: 'Chủ nhật', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
    ]
  },
  {
    id: '3',
    employeeCode: 'V00437',
    fullName: 'BÙI THỊ HÀ',
    email: 'ha.bt@vtx.vn',
    department: 'QA & Testing',
    projectCode: 'IMIS-CORE',
    projectName: 'IMIS Enterprise Core System',
    role: 'QA Lead',
    plannedHours: 40,
    actualHours: 38,
    otHours: 0,
    attendanceHours: 40,
    status: 'MISMATCH', // Lệch công
    notes: 'Giờ log dự án (38h) thiếu 2h so với giờ chấm công máy (40h)',
    dailyLogs: [
      { date: '14/09', dayOfWeek: 'Thứ 2', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Viết test case cho tính năng Duyệt công', note: '', status: 'VALID' },
      { date: '15/09', dayOfWeek: 'Thứ 3', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Kiểm thử tính năng Khóa kỳ công HCNS', note: '', status: 'VALID' },
      { date: '16/09', dayOfWeek: 'Thứ 4', attendanceHours: 8, projectHours: 6, otHours: 0, taskName: 'Kiểm thử API đồng bộ chấm công', note: 'Quên log 2h chiều', status: 'MISMATCH' },
      { date: '17/09', dayOfWeek: 'Thứ 5', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Chạy regression test suite tuần 3', note: '', status: 'VALID' },
      { date: '18/09', dayOfWeek: 'Thứ 6', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Báo cáo lỗi và nghiệm thu sprint', note: '', status: 'VALID' },
      { date: '19/09', dayOfWeek: 'Thứ 7', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
      { date: '20/09', dayOfWeek: 'Chủ nhật', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
    ]
  },
  {
    id: '4',
    employeeCode: 'V00497',
    fullName: 'BÙI QUANG TUYỀN',
    email: 'tuyen.bq@vtx.vn',
    department: 'Software Development',
    projectCode: 'PLM-VTX',
    projectName: 'PLM VTX Portal Integration',
    role: 'Backend Architect',
    plannedHours: 40,
    actualHours: 42,
    otHours: 2,
    attendanceHours: 40,
    status: 'MISMATCH', // Lệch công (log thừa)
    notes: 'Giờ log dự án vượt 2h so với máy chấm công (chưa có đơn OT được duyệt)',
    dailyLogs: [
      { date: '14/09', dayOfWeek: 'Thứ 2', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Thiết kế REST API tích hợp dữ liệu PLM', note: '', status: 'VALID' },
      { date: '15/09', dayOfWeek: 'Thứ 3', attendanceHours: 8, projectHours: 10, otHours: 2, taskName: 'Tối ưu truy vấn SQL báo cáo phân bổ nguồn lực', note: 'Chưa nộp đơn làm thêm giờ', status: 'MISMATCH' },
      { date: '16/09', dayOfWeek: 'Thứ 4', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Bảo mật endpoint & kiểm thử tải API', note: '', status: 'VALID' },
      { date: '17/09', dayOfWeek: 'Thứ 5', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Cấu hình Docker staging environment', note: '', status: 'VALID' },
      { date: '18/09', dayOfWeek: 'Thứ 6', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Deploy bản cập nhật 2.4 lên Cloud VTX', note: '', status: 'VALID' },
      { date: '19/09', dayOfWeek: 'Thứ 7', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
      { date: '20/09', dayOfWeek: 'Chủ nhật', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
    ]
  },
  {
    id: '5',
    employeeCode: 'V00188',
    fullName: 'TRẦN THỊ CẨM LY',
    email: 'ly.ttc@vtx.vn',
    department: 'PMO Office',
    projectCode: 'PLM-VTX',
    projectName: 'PLM VTX Portal Integration',
    role: 'Business Analyst',
    plannedHours: 40,
    actualHours: 40,
    otHours: 0,
    attendanceHours: 40,
    status: 'PENDING',
    dailyLogs: [
      { date: '14/09', dayOfWeek: 'Thứ 2', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Lấy yêu cầu phân hệ quản lý tài liệu PLM', note: '', status: 'VALID' },
      { date: '15/09', dayOfWeek: 'Thứ 3', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Viết tài liệu SRS luồng phê duyệt đơn từ', note: '', status: 'VALID' },
      { date: '16/09', dayOfWeek: 'Thứ 4', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Vẽ sơ đồ luồng dữ liệu nghiệp vụ', note: '', status: 'VALID' },
      { date: '17/09', dayOfWeek: 'Thứ 5', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Review yêu cầu người dùng với phòng ban HCNS', note: '', status: 'VALID' },
      { date: '18/09', dayOfWeek: 'Thứ 6', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Chốt specs cho sprint 12', note: '', status: 'VALID' },
      { date: '19/09', dayOfWeek: 'Thứ 7', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
      { date: '20/09', dayOfWeek: 'Chủ nhật', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
    ]
  },
  {
    id: '6',
    employeeCode: 'V00245',
    fullName: 'VŨ ĐỨC HẢI',
    email: 'hai.vd@vtx.vn',
    department: 'Hardware Dev',
    projectCode: 'IOT-SENSOR',
    projectName: 'IoT Smart Gateway V2',
    role: 'Hardware Firmware Engineer',
    plannedHours: 40,
    actualHours: 40,
    otHours: 5,
    attendanceHours: 40,
    status: 'PENDING',
    dailyLogs: [
      { date: '14/09', dayOfWeek: 'Thứ 2', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Kiểm tra mạch PCB Gateway board rev 1.3', note: '', status: 'VALID' },
      { date: '15/09', dayOfWeek: 'Thứ 3', attendanceHours: 8, projectHours: 8, otHours: 2, taskName: 'Nạp firmware RTOS và kiểm tra bus giao tiếp', note: 'OT test bus', status: 'VALID' },
      { date: '16/09', dayOfWeek: 'Thứ 4', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Hiệu chuẩn cảm biến nhiệt độ & gia tốc', note: '', status: 'VALID' },
      { date: '17/09', dayOfWeek: 'Thứ 5', attendanceHours: 8, projectHours: 8, otHours: 3, taskName: 'Test truyền dữ liệu MQTT lên Server VTX', note: 'OT stress test', status: 'VALID' },
      { date: '18/09', dayOfWeek: 'Thứ 6', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Lập báo cáo đánh giá tiêu thụ năng lượng', note: '', status: 'VALID' },
      { date: '19/09', dayOfWeek: 'Thứ 7', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
      { date: '20/09', dayOfWeek: 'Chủ nhật', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
    ]
  },
  {
    id: '7',
    employeeCode: 'V00311',
    fullName: 'LÊ HOÀNG NAM',
    email: 'nam.lh@vtx.vn',
    department: 'Software Development',
    projectCode: 'HRM-ENTERPRISE',
    projectName: 'HRM Enterprise Solution',
    role: 'Fullstack Engineer',
    plannedHours: 40,
    actualHours: 32,
    otHours: 0,
    attendanceHours: 32,
    status: 'PENDING',
    dailyLogs: [
      { date: '14/09', dayOfWeek: 'Thứ 2', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Phát triển màn hình Quản lý nghỉ phép', note: '', status: 'VALID' },
      { date: '15/09', dayOfWeek: 'Thứ 3', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Tích hợp bảng tính lương tự động', note: '', status: 'VALID' },
      { date: '16/09', dayOfWeek: 'Thứ 4', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Tối ưu giao diện quản lý nhân sự', note: '', status: 'VALID' },
      { date: '17/09', dayOfWeek: 'Thứ 5', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Code review & refactor mã nguồn', note: '', status: 'VALID' },
      { date: '18/09', dayOfWeek: 'Thứ 6', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ phép năm (AL) theo phê duyệt', note: 'Có đơn phép', status: 'VALID' },
      { date: '19/09', dayOfWeek: 'Thứ 7', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
      { date: '20/09', dayOfWeek: 'Chủ nhật', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
    ]
  },
  {
    id: '8',
    employeeCode: 'V00712',
    fullName: 'PHẠM TIẾN ĐẠT',
    email: 'dat.pt@vtx.vn',
    department: 'PMO Office',
    projectCode: 'HRM-ENTERPRISE',
    projectName: 'HRM Enterprise Solution',
    role: 'Project Manager',
    plannedHours: 40,
    actualHours: 40,
    otHours: 0,
    attendanceHours: 40,
    status: 'LOCKED',
    dailyLogs: [
      { date: '14/09', dayOfWeek: 'Thứ 2', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Quản lý phạm vi dự án HRM & phân bổ nhân sự', note: '', status: 'VALID' },
      { date: '15/09', dayOfWeek: 'Thứ 3', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Họp tiến độ hàng ngày và giải quyết blockers', note: '', status: 'VALID' },
      { date: '16/09', dayOfWeek: 'Thứ 4', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Báo cáo chi phí hiệu quả dự án (Cost Efficiency)', note: '', status: 'VALID' },
      { date: '17/09', dayOfWeek: 'Thứ 5', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Đánh giá rủi ro an toàn thông tin', note: '', status: 'VALID' },
      { date: '18/09', dayOfWeek: 'Thứ 6', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Ký duyệt công tuần và bàn giao phase 1', note: '', status: 'VALID' },
      { date: '19/09', dayOfWeek: 'Thứ 7', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
      { date: '20/09', dayOfWeek: 'Chủ nhật', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
    ]
  },
  {
    id: '9',
    employeeCode: 'V00501',
    fullName: 'ĐỖ THỊ MAI',
    email: 'mai.dt@vtx.vn',
    department: 'Corporate Division',
    projectCode: 'ERP-FINANCE',
    projectName: 'ERP Finance & Accounting',
    role: 'Financial Analyst',
    plannedHours: 40,
    actualHours: 40,
    otHours: 8,
    attendanceHours: 40,
    status: 'APPROVED',
    dailyLogs: [
      { date: '14/09', dayOfWeek: 'Thứ 2', attendanceHours: 8, projectHours: 8, otHours: 2, taskName: 'Đối soát số liệu tài chính quý 3', note: 'OT đối soát', status: 'VALID' },
      { date: '15/09', dayOfWeek: 'Thứ 3', attendanceHours: 8, projectHours: 8, otHours: 2, taskName: 'Cấu hình module phân bổ chi phí dự án', note: 'OT cấu hình', status: 'VALID' },
      { date: '16/09', dayOfWeek: 'Thứ 4', attendanceHours: 8, projectHours: 8, otHours: 2, taskName: 'Kiểm thử báo cáo lãi lỗ P&L theo dự án', note: '', status: 'VALID' },
      { date: '17/09', dayOfWeek: 'Thứ 5', attendanceHours: 8, projectHours: 8, otHours: 2, taskName: 'Tích hợp dữ liệu chi phí nhân sự từ Timesheet', note: '', status: 'VALID' },
      { date: '18/09', dayOfWeek: 'Thứ 6', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Xuất báo cáo tài chính định kỳ', note: '', status: 'VALID' },
      { date: '19/09', dayOfWeek: 'Thứ 7', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
      { date: '20/09', dayOfWeek: 'Chủ nhật', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
    ]
  },
  {
    id: '10',
    employeeCode: 'V00882',
    fullName: 'HOÀNG VĂN THÁI',
    email: 'thai.hv@vtx.vn',
    department: 'QA & Testing',
    projectCode: 'ERP-FINANCE',
    projectName: 'ERP Finance & Accounting',
    role: 'Automation QA',
    plannedHours: 40,
    actualHours: 35,
    otHours: 0,
    attendanceHours: 40,
    status: 'MISMATCH', // Lệch công
    notes: 'Giờ log dự án thiếu 5h so với giờ chấm công máy',
    dailyLogs: [
      { date: '14/09', dayOfWeek: 'Thứ 2', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Viết test script Playwright kiểm thử phân hệ Thu Chi', note: '', status: 'VALID' },
      { date: '15/09', dayOfWeek: 'Thứ 3', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Chạy automated test cho form tạo hóa đơn', note: '', status: 'VALID' },
      { date: '16/09', dayOfWeek: 'Thứ 4', attendanceHours: 8, projectHours: 3, otHours: 0, taskName: 'Test tính năng xuất báo cáo thuế', note: 'Thiếu 5h log công', status: 'MISMATCH' },
      { date: '17/09', dayOfWeek: 'Thứ 5', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Cấu hình CI/CD chạy kiểm thử ban đêm', note: '', status: 'VALID' },
      { date: '18/09', dayOfWeek: 'Thứ 6', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Tổng hợp báo cáo pass/fail tuần 3', note: '', status: 'VALID' },
      { date: '19/09', dayOfWeek: 'Thứ 7', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
      { date: '20/09', dayOfWeek: 'Chủ nhật', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
    ]
  },
  {
    id: '11',
    employeeCode: 'V00994',
    fullName: 'CAO BẮC TIẾN',
    email: 'tien.cb@vtx.vn',
    department: 'Software Development',
    projectCode: 'MOBILE-VTX',
    projectName: 'Mobile App VTX Portal',
    role: 'Mobile Lead (React Native)',
    plannedHours: 40,
    actualHours: 40,
    otHours: 4,
    attendanceHours: 40,
    status: 'APPROVED',
    dailyLogs: [
      { date: '14/09', dayOfWeek: 'Thứ 2', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Tối ưu animation và màn hình đăng nhập FaceID', note: '', status: 'VALID' },
      { date: '15/09', dayOfWeek: 'Thứ 3', attendanceHours: 8, projectHours: 8, otHours: 2, taskName: 'Tích hợp Push Notification thông báo chốt công', note: '', status: 'VALID' },
      { date: '16/09', dayOfWeek: 'Thứ 4', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Phát triển tính năng quét QR chấm công địa điểm', note: '', status: 'VALID' },
      { date: '17/09', dayOfWeek: 'Thứ 5', attendanceHours: 8, projectHours: 8, otHours: 2, taskName: 'Fix bug offline storage trên iOS 18', note: '', status: 'VALID' },
      { date: '18/09', dayOfWeek: 'Thứ 6', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Build app bundle và release TestFlight', note: '', status: 'VALID' },
      { date: '19/09', dayOfWeek: 'Thứ 7', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
      { date: '20/09', dayOfWeek: 'Chủ nhật', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
    ]
  },
  {
    id: '12',
    employeeCode: 'V00105',
    fullName: 'DƯƠNG THỊ LAN',
    email: 'lan.dt@vtx.vn',
    department: 'Corporate Division',
    projectCode: 'IMIS-CORE',
    projectName: 'IMIS Enterprise Core System',
    role: 'UI/UX Product Designer',
    plannedHours: 40,
    actualHours: 40,
    otHours: 0,
    attendanceHours: 40,
    status: 'LOCKED',
    dailyLogs: [
      { date: '14/09', dayOfWeek: 'Thứ 2', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Thiết kế Figma component bảng phân bổ công dự án', note: '', status: 'VALID' },
      { date: '15/09', dayOfWeek: 'Thứ 3', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Chuẩn hóa design token bảng màu & spacing', note: '', status: 'VALID' },
      { date: '16/09', dayOfWeek: 'Thứ 4', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Thiết kế trạng thái Lệch công & modal chi tiết', note: '', status: 'VALID' },
      { date: '17/09', dayOfWeek: 'Thứ 5', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Usability testing với quản lý dự án & HCNS', note: '', status: 'VALID' },
      { date: '18/09', dayOfWeek: 'Thứ 6', attendanceHours: 8, projectHours: 8, otHours: 0, taskName: 'Bàn giao asset và specs cho frontend team', note: '', status: 'VALID' },
      { date: '19/09', dayOfWeek: 'Thứ 7', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
      { date: '20/09', dayOfWeek: 'Chủ nhật', attendanceHours: 0, projectHours: 0, otHours: 0, taskName: 'Nghỉ cuối tuần', note: '', status: 'WEEKEND' },
    ]
  }
];

const WEEKS_LIST = [
  { id: 0, label: 'Cả tháng', range: '01-30/09' },
  { id: 1, label: 'Tuần 1', range: '01-06/09' },
  { id: 2, label: 'Tuần 2', range: '07-13/09' },
  { id: 3, label: 'Tuần 3', range: '14-20/09' },
  { id: 4, label: 'Tuần 4', range: '21-27/09' },
  { id: 5, label: 'Tuần 5', range: '28-30/09' },
];

export const ProjectTimesheetPage: React.FC = () => {
  const [data, setData] = useState<ProjectMemberTimesheet[]>(INITIAL_PROJECT_TIMESHEETS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedWeek, setSelectedWeek] = useState<number>(3);
  const [statusTab, setStatusTab] = useState<'ALL' | 'PENDING' | 'MISMATCH' | 'APPROVED' | 'LOCKED'>('ALL');
  
  // Modal states
  const [viewingMember, setViewingMember] = useState<ProjectMemberTimesheet | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Projects & Departments list
  const projectsList = useMemo(() => {
    const list = Array.from(new Set(INITIAL_PROJECT_TIMESHEETS.map(i => i.projectName)));
    return list;
  }, []);

  const departmentsList = useMemo(() => {
    const list = Array.from(new Set(INITIAL_PROJECT_TIMESHEETS.map(i => i.department)));
    return list;
  }, []);

  // Compute Statistics
  const stats = useMemo(() => {
    const totalMembers = data.length;
    const totalPlanned = data.reduce((acc, curr) => acc + curr.plannedHours, 0);
    const totalActual = data.reduce((acc, curr) => acc + curr.actualHours, 0);
    const totalOt = data.reduce((acc, curr) => acc + curr.otHours, 0);
    const pendingCount = data.filter(d => d.status === 'PENDING').length;
    const mismatchCount = data.filter(d => d.status === 'MISMATCH').length;
    const approvedCount = data.filter(d => d.status === 'APPROVED').length;
    const lockedCount = data.filter(d => d.status === 'LOCKED').length;

    const completionRate = totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0;

    return {
      totalMembers,
      totalPlanned,
      totalActual,
      totalOt,
      pendingCount,
      mismatchCount,
      approvedCount,
      lockedCount,
      completionRate
    };
  }, [data]);

  // Filtered Data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // 1. Text search
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesQuery = 
          item.fullName.toLowerCase().includes(query) ||
          item.employeeCode.toLowerCase().includes(query) ||
          item.projectName.toLowerCase().includes(query) ||
          item.projectCode.toLowerCase().includes(query) ||
          item.role.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // 2. Project filter
      if (selectedProject !== 'ALL' && item.projectName !== selectedProject) {
        return false;
      }

      // 3. Department filter
      if (selectedDepartment !== 'ALL' && item.department !== selectedDepartment) {
        return false;
      }

      // 4. Status Tab filter
      if (statusTab !== 'ALL' && item.status !== statusTab) {
        return false;
      }

      return true;
    });
  }, [data, searchTerm, selectedProject, selectedDepartment, statusTab]);

  const isAllSelected = filteredData.length > 0 && filteredData.every(item => selectedIds.includes(item.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(i => i.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleApproveSelected = () => {
    if (selectedIds.length === 0) return;
    setData(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, status: 'APPROVED' } : item));
    showToast(`Đã duyệt thành công ${selectedIds.length} bản ghi timesheet!`);
    setSelectedIds([]);
  };

  const handleApproveOne = (id: string) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status: 'APPROVED' } : item));
    showToast('Đã duyệt thành công timesheet!');
    if (viewingMember && viewingMember.id === id) {
      setViewingMember({ ...viewingMember, status: 'APPROVED' });
    }
  };

  const handleOpenReject = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
  };

  const handleConfirmReject = () => {
    if (!rejectingId) return;
    setData(prev => prev.map(item => item.id === rejectingId ? { 
      ...item, 
      status: 'REJECTED', 
      notes: rejectReason ? `Từ chối: ${rejectReason}` : 'Quản lý yêu cầu rà soát và log lại công.'
    } : item));
    showToast('Đã từ chối timesheet và gửi yêu cầu giải trình cho nhân sự.');
    if (viewingMember && viewingMember.id === rejectingId) {
      setViewingMember({ ...viewingMember, status: 'REJECTED' });
    }
    setRejectingId(null);
  };

  const handleLockSelected = () => {
    if (selectedIds.length === 0) return;
    setData(prev => prev.map(item => selectedIds.includes(item.id) ? { ...item, status: 'LOCKED' } : item));
    showToast(`Đã khóa ${selectedIds.length} bản ghi kỳ công dự án!`);
    setSelectedIds([]);
  };

  const handleExportXLSX = () => {
    const exportRows = filteredData.map((item, idx) => ({
      'STT': idx + 1,
      'Mã NV': item.employeeCode,
      'Họ và tên': item.fullName,
      'Phòng ban': item.department,
      'Mã dự án': item.projectCode,
      'Tên dự án': item.projectName,
      'Vai trò': item.role,
      'Giờ kế hoạch': item.plannedHours,
      'Giờ log thực tế': item.actualHours,
      'Giờ máy chấm công': item.attendanceHours,
      'Giờ tăng ca (OT)': item.otHours,
      'Trạng thái': 
        item.status === 'APPROVED' ? 'Đã duyệt' :
        item.status === 'PENDING' ? 'Chờ duyệt' :
        item.status === 'MISMATCH' ? 'Lệch công' :
        item.status === 'REJECTED' ? 'Bị từ chối' : 'Đã khóa',
      'Ghi chú': item.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bang_Cong_Du_An');
    XLSX.writeFile(workbook, `Bang_Cong_Du_An_T09_2026.xlsx`);
    showToast('Đã xuất file Excel bảng công dự án thành công!');
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2.5 text-sm animate-in fade-in slide-in-from-top-4 border border-slate-700">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Breadcrumb Area */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-3.5 flex items-center text-sm font-medium text-slate-600">
          <div className="flex items-center hover:text-slate-900 cursor-pointer transition-colors">
            <Briefcase size={16} className="mr-2 text-slate-500" />
            <span>Timekeeping</span>
          </div>
          <ChevronRight size={16} className="text-slate-400 mx-2" />
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Timesheet</span>
          <ChevronRight size={16} className="text-slate-400 mx-2" />
          <span className="text-slate-900 font-bold">Bảng công dự án</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 max-w-[1600px] mx-auto">
        
        {/* 2. Top Warning Banner - Đúng quy định chốt công & phạt 20.000đ */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-xl flex items-center justify-between text-sm shadow-xs">
          <div className="flex items-center space-x-3 text-amber-900 font-medium">
            <span className="text-lg">⏰</span>
            <span>
              <strong>Còn 1 ngày đến hạn chốt công (18/09).</strong> Log giờ dự án trễ hạn sẽ bị phạt <strong>20.000đ</strong>. Hệ thống tự động khóa sau 18h thứ 6 hàng tuần.
            </span>
          </div>
          <div className="text-xs font-semibold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-md border border-amber-200 shrink-0 hidden md:block">
            Chốt theo tuần
          </div>
        </div>

        {/* 3. Filter Bar (Month & Week Selector) */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            {/* Month Select */}
            <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <CalendarDays size={16} className="text-slate-500" />
              <select className="font-bold text-slate-800 bg-transparent outline-none cursor-pointer text-sm">
                <option>Tháng 09/2026</option>
                <option>Tháng 08/2026</option>
                <option>Tháng 07/2026</option>
              </select>
            </div>

            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

            {/* Week Selector */}
            <div className="flex items-center space-x-1">
              {WEEKS_LIST.map(w => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWeek(w.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    selectedWeek === w.id
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {w.label} {w.range ? <span className="opacity-70 text-[11px] ml-0.5">({w.range})</span> : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => showToast('Dữ liệu đã được cập nhật mới nhất từ máy chấm công')}
              className="flex items-center space-x-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className="text-slate-500" />
              <span>Đồng bộ dữ liệu</span>
            </button>
          </div>
        </div>

        {/* 4. 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Nhân sự dự án</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users size={16} />
              </div>
            </div>
            <div className="flex items-baseline space-x-1 mb-1">
              <span className="text-2xl font-black text-slate-900 tabular-nums">{stats.totalMembers}</span>
              <span className="text-xs text-slate-500 font-medium">nhân sự</span>
            </div>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 mt-2 flex items-center justify-between">
              <span>Được phân bổ trong tuần</span>
              <span className="font-semibold text-emerald-600">100% active</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tổng giờ log dự án</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock size={16} />
              </div>
            </div>
            <div className="flex items-baseline space-x-1 mb-1">
              <span className="text-2xl font-black text-slate-900 tabular-nums">{stats.totalActual}h</span>
              <span className="text-xs text-slate-500 font-medium">/ {stats.totalPlanned}h kế hoạch</span>
            </div>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 mt-2 flex items-center justify-between">
              <span>Tỷ lệ hoàn thành</span>
              <span className="font-bold text-slate-800 tabular-nums">{stats.completionRate}%</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Giờ làm thêm (OT)</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp size={16} />
              </div>
            </div>
            <div className="flex items-baseline space-x-1 mb-1">
              <span className="text-2xl font-black text-amber-600 tabular-nums">{stats.totalOt}h</span>
              <span className="text-xs text-slate-500 font-medium">tăng ca</span>
            </div>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 mt-2 flex items-center justify-between">
              <span>Đơn vị tính lương</span>
              <span className="font-semibold text-slate-700">Có duyệt OT</span>
            </div>
          </div>

          {/* Card 4 - Lệch công (đổi từ lệch dữ liệu) */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Lệch công & Cần xử lý</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <AlertTriangle size={16} />
              </div>
            </div>
            <div className="flex items-baseline space-x-2 mb-1">
              <span className="text-2xl font-black text-purple-600 tabular-nums">{stats.mismatchCount}</span>
              <span className="text-xs text-purple-700 font-bold">Lệch công</span>
              <span className="text-slate-300">·</span>
              <span className="text-xl font-black text-amber-600 tabular-nums">{stats.pendingCount}</span>
              <span className="text-xs text-amber-700 font-semibold">Chờ duyệt</span>
            </div>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 mt-2 flex items-center justify-between">
              <span>Cần chốt trước</span>
              <span className="font-bold text-rose-600">18:00 Thứ 6</span>
            </div>
          </div>
        </div>

        {/* 5. Toolbar & Filter Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          
          {/* Top row: Segmented Status Tabs + Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Status Tabs */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 lg:pb-0">
              <button
                onClick={() => setStatusTab('ALL')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                  statusTab === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Tất cả</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${statusTab === 'ALL' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {data.length}
                </span>
              </button>

              <button
                onClick={() => setStatusTab('PENDING')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                  statusTab === 'PENDING' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Chờ duyệt</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${statusTab === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'}`}>
                  {stats.pendingCount}
                </span>
              </button>

              <button
                onClick={() => setStatusTab('MISMATCH')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                  statusTab === 'MISMATCH' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Lệch công</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${statusTab === 'MISMATCH' ? 'bg-purple-700 text-white' : 'bg-purple-100 text-purple-800'}`}>
                  {stats.mismatchCount}
                </span>
              </button>

              <button
                onClick={() => setStatusTab('APPROVED')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                  statusTab === 'APPROVED' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Đã duyệt</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${statusTab === 'APPROVED' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                  {stats.approvedCount}
                </span>
              </button>

              <button
                onClick={() => setStatusTab('LOCKED')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                  statusTab === 'LOCKED' ? 'bg-slate-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Đã khóa</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${statusTab === 'LOCKED' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {stats.lockedCount}
                </span>
              </button>
            </div>

            {/* Action Buttons (Consistent with Manager/HCNS styling: white bg, text-sm font-medium, clear icons) */}
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              {selectedIds.length > 0 && (
                <>
                  <button
                    onClick={handleApproveSelected}
                    className="flex items-center space-x-1.5 text-sm font-medium text-emerald-700 bg-white border border-emerald-300 hover:bg-emerald-50 px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <Check size={16} />
                    <span>Duyệt đã chọn ({selectedIds.length})</span>
                  </button>

                  <button
                    onClick={handleLockSelected}
                    className="flex items-center space-x-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <Lock size={16} />
                    <span>Khóa ({selectedIds.length})</span>
                  </button>
                </>
              )}

              <button
                onClick={handleExportXLSX}
                className="flex items-center space-x-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <FileSpreadsheet size={16} className="text-emerald-600" />
                <span>Export to XLSX</span>
              </button>

              <button
                onClick={() => showToast('Đang tiến hành di chuyển dữ liệu đồng bộ (Migrate Data)...')}
                className="flex items-center space-x-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <RefreshCw size={16} className="text-blue-600" />
                <span>Migrate Data</span>
              </button>
            </div>
          </div>

          {/* Bottom row: Search & Dropdown Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm nhân viên (Tên, Mã NV, Tên dự án, Vị trí...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-slate-400 focus:bg-white transition-colors"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Project Dropdown */}
            <div>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer focus:border-slate-400 focus:bg-white text-slate-700 font-medium"
              >
                <option value="ALL">Tất cả dự án ({projectsList.length})</option>
                {projectsList.map(proj => (
                  <option key={proj} value={proj}>{proj}</option>
                ))}
              </select>
            </div>

            {/* Department Dropdown */}
            <div>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none cursor-pointer focus:border-slate-400 focus:bg-white text-slate-700 font-medium"
              >
                <option value="ALL">Tất cả phòng ban ({departmentsList.length})</option>
                {departmentsList.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 6. Main Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200 select-none">
                  <th className="py-3 px-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-2 w-12 text-center">STT</th>
                  <th className="py-3 px-3 w-28">Mã NV</th>
                  <th className="py-3 px-3 min-w-[220px]">Nhân viên</th>
                  <th className="py-3 px-3 min-w-[200px]">Dự án</th>
                  <th className="py-3 px-3 min-w-[160px]">Vai trò</th>
                  <th className="py-3 px-3 text-right">Kế hoạch</th>
                  <th className="py-3 px-3 text-right">Giờ Log</th>
                  <th className="py-3 px-3 text-right">Giờ Máy</th>
                  <th className="py-3 px-3 text-right">OT</th>
                  <th className="py-3 px-3 text-center min-w-[110px]">Tiến độ</th>
                  <th className="py-3 px-3 text-center min-w-[120px]">Trạng thái</th>
                  <th className="py-3 px-3 text-center w-24">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Search size={28} className="text-slate-300" />
                        <span className="text-sm font-medium">Không tìm thấy bản ghi timesheet phù hợp</span>
                        <span className="text-xs text-slate-400">Thử đổi từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, idx) => {
                    const isSelected = selectedIds.includes(item.id);
                    const progress = item.plannedHours > 0 ? Math.round((item.actualHours / item.plannedHours) * 100) : 0;
                    const hasMismatch = item.actualHours !== item.attendanceHours;

                    return (
                      <tr 
                        key={item.id}
                        className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectOne(item.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>

                        {/* STT */}
                        <td className="py-3 px-2 text-center text-slate-400 font-medium tabular-nums">
                          {idx + 1}
                        </td>

                        {/* Mã NV */}
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">
                          {item.employeeCode}
                        </td>

                        {/* Nhân viên */}
                        <td className="py-3 px-3">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase shadow-xs">
                              {item.fullName.split(' ').slice(-1)[0]?.substring(0, 2) || 'NV'}
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-slate-800 truncate">{item.fullName}</div>
                              <div className="text-[11px] text-slate-400 truncate">{item.department}</div>
                            </div>
                          </div>
                        </td>

                        {/* Dự án */}
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-800 truncate">{item.projectName}</div>
                          <span className="inline-block mt-0.5 px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-mono rounded font-medium">
                            {item.projectCode}
                          </span>
                        </td>

                        {/* Vai trò */}
                        <td className="py-3 px-3 text-slate-600 font-medium">
                          {item.role}
                        </td>

                        {/* Kế hoạch */}
                        <td className="py-3 px-3 text-right tabular-nums font-medium text-slate-500">
                          {item.plannedHours}h
                        </td>

                        {/* Giờ Log Thực tế */}
                        <td className="py-3 px-3 text-right tabular-nums font-bold text-slate-900">
                          {item.actualHours}h
                        </td>

                        {/* Giờ Chấm công máy */}
                        <td className="py-3 px-3 text-right tabular-nums font-semibold">
                          <span className={hasMismatch ? 'text-purple-600 font-bold' : 'text-slate-600'}>
                            {item.attendanceHours}h
                          </span>
                        </td>

                        {/* OT */}
                        <td className="py-3 px-3 text-right tabular-nums font-bold text-amber-600">
                          {item.otHours > 0 ? `+${item.otHours}h` : '0h'}
                        </td>

                        {/* Tiến độ (%) */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex flex-col items-center justify-center space-y-1">
                            <span className="font-bold text-slate-700 tabular-nums text-[11px]">{progress}%</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  progress >= 100 ? 'bg-emerald-500' : progress >= 80 ? 'bg-blue-500' : 'bg-amber-500'
                                }`} 
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Trạng thái */}
                        <td className="py-3 px-3 text-center">
                          {item.status === 'APPROVED' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check size={12} className="mr-1" /> Đã duyệt
                            </span>
                          )}
                          {item.status === 'PENDING' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock size={12} className="mr-1" /> Chờ duyệt
                            </span>
                          )}
                          {item.status === 'MISMATCH' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200" title={item.notes}>
                              <AlertTriangle size={12} className="mr-1" /> Lệch công
                            </span>
                          )}
                          {item.status === 'REJECTED' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <X size={12} className="mr-1" /> Từ chối
                            </span>
                          )}
                          {item.status === 'LOCKED' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                              <Lock size={12} className="mr-1" /> Đã khóa
                            </span>
                          )}
                        </td>

                        {/* Thao tác */}
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={() => setViewingMember(item)}
                              title="Xem chi tiết log công theo ngày"
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                            >
                              <Eye size={16} />
                            </button>

                            {item.status !== 'APPROVED' && item.status !== 'LOCKED' && (
                              <button
                                onClick={() => handleApproveOne(item.id)}
                                title="Phê duyệt timesheet"
                                className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                              >
                                <Check size={16} />
                              </button>
                            )}

                            {item.status === 'PENDING' && (
                              <button
                                onClick={() => handleOpenReject(item.id)}
                                title="Từ chối / Yêu cầu giải trình"
                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Summary Bar */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <div>
              Hiển thị <strong className="font-semibold text-slate-700">{filteredData.length}</strong> trên tổng số <strong className="font-semibold text-slate-700">{data.length}</strong> nhân sự
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span> Đã duyệt ({stats.approvedCount})
              </span>
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span> Chờ duyệt ({stats.pendingCount})
              </span>
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 mr-1.5"></span> Lệch công ({stats.mismatchCount})
              </span>
              <span className="flex items-center">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500 mr-1.5"></span> Đã khóa ({stats.lockedCount})
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 7. Modal Chi tiết Log time theo từng ngày */}
      {viewingMember && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm uppercase">
                  {viewingMember.fullName.split(' ').slice(-1)[0]?.substring(0, 2) || 'NV'}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base">{viewingMember.fullName}</h3>
                    <span className="font-mono text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-semibold">
                      {viewingMember.employeeCode}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {viewingMember.role} · {viewingMember.department} · Dự án: <strong className="text-white">{viewingMember.projectName}</strong>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setViewingMember(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Status & Warning Notice */}
              {viewingMember.status === 'MISMATCH' && (
                <div className="bg-purple-50 border-l-4 border-purple-500 p-3.5 rounded-r-xl flex items-start space-x-3 text-xs text-purple-900">
                  <AlertTriangle size={18} className="text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-purple-950">Phát hiện Lệch công:</strong> {viewingMember.notes || 'Giờ chấm công thực tế tại máy không khớp với số giờ nhân sự log vào dự án. Cần kiểm tra đối soát.'}
                  </div>
                </div>
              )}

              {/* Summary Stats Row */}
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Giờ Kế Hoạch</div>
                  <div className="text-base font-black text-slate-800 tabular-nums">{viewingMember.plannedHours}h</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Giờ Log Dự Án</div>
                  <div className="text-base font-black text-blue-600 tabular-nums">{viewingMember.actualHours}h</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Giờ Chấm Máy</div>
                  <div className="text-base font-black text-slate-800 tabular-nums">{viewingMember.attendanceHours}h</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Giờ Làm Thêm (OT)</div>
                  <div className="text-base font-black text-amber-600 tabular-nums">+{viewingMember.otHours}h</div>
                </div>
              </div>

              {/* Day-by-Day Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Bảng kê chi tiết theo ngày (Tuần 3: 14/09 - 20/09)</h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-3">Ngày</th>
                        <th className="py-2.5 px-3 text-right">Giờ máy</th>
                        <th className="py-2.5 px-3 text-right">Giờ dự án</th>
                        <th className="py-2.5 px-3 text-right">OT</th>
                        <th className="py-2.5 px-3">Hạng mục công việc / Ghi chú</th>
                        <th className="py-2.5 px-3 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {viewingMember.dailyLogs.map((log, index) => (
                        <tr key={index} className={log.status === 'MISMATCH' ? 'bg-purple-50/50' : log.status === 'WEEKEND' ? 'bg-slate-50/40 text-slate-400' : ''}>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-800">{log.dayOfWeek}</span>
                            <span className="text-slate-400 text-[11px] ml-1.5 font-mono">({log.date})</span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold tabular-nums">
                            {log.attendanceHours > 0 ? `${log.attendanceHours}h` : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900 tabular-nums">
                            {log.projectHours > 0 ? `${log.projectHours}h` : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-amber-600 tabular-nums">
                            {log.otHours > 0 ? `+${log.otHours}h` : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">
                            <div className="font-medium">{log.taskName}</div>
                            {log.note && <div className="text-[11px] text-slate-400 italic">{log.note}</div>}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {log.status === 'VALID' && (
                              <span className="text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                Khớp giờ
                              </span>
                            )}
                            {log.status === 'MISMATCH' && (
                              <span className="text-purple-700 font-bold text-[10px] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                                Lệch công
                              </span>
                            )}
                            {log.status === 'WEEKEND' && (
                              <span className="text-slate-400 text-[10px]">Cuối tuần</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Trạng thái hiện tại: <strong className="text-slate-800 uppercase font-bold">{viewingMember.status}</strong>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewingMember(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Đóng
                </button>

                {viewingMember.status !== 'APPROVED' && (
                  <>
                    <button
                      onClick={() => handleOpenReject(viewingMember.id)}
                      className="px-4 py-2 text-xs font-bold text-rose-700 bg-white border border-rose-300 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Từ chối timesheet
                    </button>
                    <button
                      onClick={() => handleApproveOne(viewingMember.id)}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      <Check size={14} />
                      <span>Phê duyệt ngay</span>
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 8. Reject Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-1">Xác nhận Từ chối Timesheet</h3>
            <p className="text-xs text-slate-500 mb-4">
              Vui lòng nhập lý do từ chối để nhân sự cập nhật lại giờ log đúng quy định.
            </p>

            <textarea
              rows={3}
              placeholder="Nhập lý do từ chối (Ví dụ: Giờ log thiếu 2h so với máy chấm công ngày thứ 4)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-rose-400 focus:bg-white transition-colors"
            />

            <div className="flex items-center justify-end space-x-2 mt-4">
              <button
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
