import React, { useState, useMemo, useRef } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Edit3,
  Filter,
  Check,
  X,
  Plus,
  AlertCircle,
  ArrowLeft,
  FileText,
  ChevronRight,
  Info,
  Mail,
  Phone,
  Linkedin,
  GraduationCap,
  Building2,
  Briefcase,
  Code2,
  Calendar,
  Tag,
  UserCheck,
  Layers,
  Download,
  Paperclip,
  Star,
  Upload,
  Link as LinkIcon,
  ExternalLink,
  History,
  Clock,
  User,
  ArrowRight,
  StarHalf,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ==========================================================================
// TYPES & CONSTANTS - Recruitment / Candidate Management (Module Tuyển dụng)
// Các trường bám sát file "Tuyển dụng.xlsx"
// ==========================================================================

// Nguồn ứng viên
export const SOURCES = [
  'LinkedIn',
  'Refer',
  'TopCV',
  'VietnamWorks',
  'ITViec',
  'Website',
  'Headhunt',
  'Facebook',
  'Khác',
] as const;
export type Source = (typeof SOURCES)[number];

// Level ứng tuyển
export const LEVELS = [
  'Intern',
  'Fresher',
  'Junior',
  'Middle',
  'Senior',
  'Lead',
  'Manager',
] as const;
export type Level = (typeof LEVELS)[number];

// Khối ứng tuyển
export const BLOCKS = [
  'Software Development',
  'QA / Testing',
  'Data & AI',
  'DevOps / Cloud',
  'PM / BA',
  'Design',
  'R&D',
  'Business',
] as const;
export type Block = (typeof BLOCKS)[number];

// Trạng thái theo vòng đời ứng viên (tuần tự từ tiếp nhận → onboard)
export const FINAL_STATUSES = [
  'New',
  'Applied',
  'Not Interested',
  'TA Screen_Consider',
  'TA Screen_Passed',
  'TA Screen_Rejected',
  'HM Screen_Passed',
  'HM Screen_Rejected',
  'Intv 1_Schedule',
  'Intv 1_Passed',
  'Intv 1_Failed',
  'Intv 2_Schedule',
  'Intv 2_Passed',
  'Intv 2_Failed',
  'Intv Pass _ No Offer',
  'Offering',
  'Offer Accepted',
  'Offer Rejected',
  'Onboarded',
  'Pending',
] as const;
export type FinalStatus = (typeof FINAL_STATUSES)[number];

// Cấu hình màu cho trạng thái (nhóm theo giai đoạn: chờ = amber, đạt = teal/emerald, trượt = rose)
const STATUS_STYLE: Record<FinalStatus, string> = {
  'New': 'bg-slate-100 text-slate-600 border-slate-200',
  'Applied': 'bg-sky-50 text-sky-600 border-sky-100',
  'Not Interested': 'bg-slate-100 text-slate-400 border-slate-200',
  'TA Screen_Consider': 'bg-amber-50 text-amber-600 border-amber-100',
  'TA Screen_Passed': 'bg-teal-50 text-teal-600 border-teal-100',
  'TA Screen_Rejected': 'bg-rose-50 text-rose-600 border-rose-100',
  'HM Screen_Passed': 'bg-teal-50 text-teal-600 border-teal-100',
  'HM Screen_Rejected': 'bg-rose-50 text-rose-600 border-rose-100',
  'Intv 1_Schedule': 'bg-amber-50 text-amber-600 border-amber-100',
  'Intv 1_Passed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Intv 1_Failed': 'bg-rose-50 text-rose-600 border-rose-100',
  'Intv 2_Schedule': 'bg-amber-50 text-amber-600 border-amber-100',
  'Intv 2_Passed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Intv 2_Failed': 'bg-rose-50 text-rose-600 border-rose-100',
  'Intv Pass _ No Offer': 'bg-orange-50 text-orange-600 border-orange-100',
  'Offering': 'bg-violet-50 text-violet-600 border-violet-100',
  'Offer Accepted': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Offer Rejected': 'bg-rose-50 text-rose-600 border-rose-100',
  'Onboarded': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Pending': 'bg-slate-100 text-slate-500 border-slate-200',
};

// Nhãn hiển thị = chính tên trạng thái (thuật ngữ pipeline chuẩn)
const STATUS_LABEL = Object.fromEntries(FINAL_STATUSES.map((s) => [s, s])) as Record<FinalStatus, string>;

export interface Candidate {
  id: string;
  inputDate: string;        // InputDate * - Ngày tiếp nhận
  taReceiver: string;       // TA tiếp nhận (nhân viên tiếp nhận hồ sơ)
  taPic: string;            // TA PIC * - TA phụ trách
  name: string;             // Name * - Họ và tên
  dob: string;              // DOB - Ngày sinh
  email: string;            // Email *
  phone: string;            // Phone - Điện thoại
  linkedin: string;         // Linkedin
  university: string;       // Trường Đại học *
  major: string;            // Chuyên ngành *
  currentPosition: string;  // ViTri * - Vị trí hiện tại
  currentCompany: string;   // CongTy hiện tại *
  techStack: string;        // TechStack *
  cvFile: string;           // FileNguon - File CV nguồn (tên file upload)
  cvLink: string;           // Link CV (URL gán ngoài, VD Google Drive)
  source: Source;           // Source *
  referrer: string;         // Người Refer (bắt buộc nếu Source = Refer)
  note: string;             // Note
  appliedPosition: string;  // Vị trí ứng tuyển
  appliedLevel: Level | ''; // Level ứng tuyển
  appliedSkills: string[];  // Kỹ năng theo yêu cầu (chọn nhiều)
  appliedBlock: Block | ''; // Khối ứng tuyển
  assignDate: string;       // Ngày assign job
  finalStatus: FinalStatus; // FinalStatus
  rating: number;           // Đánh giá (0-5 sao)
  tags: string[];           // Thẻ gắn cho ứng viên
}

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'ƯV-0001',
    inputDate: '2026-08-01',
    taReceiver: 'Phạm Minh Trí',
    taPic: 'Lê Thu Trang',
    name: 'Nguyễn Minh Khôi',
    dob: '1996-03-12',
    email: 'khoi.nm@gmail.com',
    phone: '0987 654 321',
    linkedin: 'linkedin.com/in/khoi-nguyen',
    university: 'Đại học Bách Khoa Hà Nội',
    major: 'Công nghệ thông tin',
    currentPosition: 'Backend Engineer',
    currentCompany: 'FPT Software',
    techStack: 'Java, Spring Boot, PostgreSQL, Kafka',
    cvFile: 'CV_NguyenMinhKhoi.pdf',
    cvLink: 'https://drive.google.com/file/d/1khoi-backend-cv/view',
    source: 'LinkedIn',
    referrer: '',
    note: 'Ứng viên có kinh nghiệm hệ thống ngân hàng, phản hồi nhanh.',
    appliedPosition: 'Senior Backend Engineer',
    appliedLevel: 'Senior',
    appliedSkills: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka'],
    appliedBlock: 'Software Development',
    assignDate: '2026-08-02',
    finalStatus: 'Intv 1_Schedule',
    rating: 4,
    tags: ['Tư duy tốt', 'Có kinh nghiệm'],
  },
  {
    id: 'ƯV-0002',
    inputDate: '2026-08-03',
    taReceiver: 'Nguyễn Thị Mai',
    taPic: 'Nguyễn Văn An',
    name: 'Trần Thị Hải Yến',
    dob: '1998-07-25',
    email: 'yen.tth@gmail.com',
    phone: '0912 333 444',
    linkedin: '',
    university: 'Đại học FPT',
    major: 'Kỹ thuật phần mềm',
    currentPosition: 'QA Engineer',
    currentCompany: 'KMS Technology',
    techStack: 'Selenium, Cypress, Postman, JMeter',
    cvFile: 'CV_TranThiHaiYen.pdf',
    cvLink: '',
    source: 'Refer',
    referrer: 'Hồ Tú Anh',
    note: 'Được refer bởi PM team QA. Ưu tiên phỏng vấn sớm.',
    appliedPosition: 'QA Automation',
    appliedLevel: 'Middle',
    appliedSkills: ['Selenium', 'Cypress', 'Postman', 'JMeter'],
    appliedBlock: 'QA / Testing',
    assignDate: '2026-08-04',
    finalStatus: 'Offering',
    rating: 5,
    tags: ['Giao tiếp tốt', 'Cẩn thận'],
  },
  {
    id: 'ƯV-0003',
    inputDate: '2026-08-05',
    taReceiver: 'Lê Thu Trang',
    taPic: 'Lê Thu Trang',
    name: 'Phạm Đức Long',
    dob: '1994-11-02',
    email: 'long.pd@outlook.com',
    phone: '0966 777 888',
    linkedin: 'linkedin.com/in/long-pham-devops',
    university: 'Đại học Công nghệ - ĐHQGHN',
    major: 'Mạng máy tính & Truyền thông',
    currentPosition: 'DevOps Engineer',
    currentCompany: 'VNG Corporation',
    techStack: 'Kubernetes, Terraform, AWS, GitLab CI',
    cvFile: 'CV_PhamDucLong.pdf',
    cvLink: '',
    source: 'ITViec',
    referrer: '',
    note: 'Mức lương kỳ vọng cao, cần thương lượng.',
    appliedPosition: 'Senior DevOps',
    appliedLevel: 'Senior',
    appliedSkills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD'],
    appliedBlock: 'DevOps / Cloud',
    assignDate: '2026-08-06',
    finalStatus: 'TA Screen_Passed',
    rating: 3,
    tags: ['Có năng lực'],
  },
  {
    id: 'ƯV-0004',
    inputDate: '2026-08-08',
    taReceiver: 'Trần Quốc Bảo',
    taPic: 'Nguyễn Văn An',
    name: 'Đỗ Thảo Nguyên',
    dob: '2000-01-18',
    email: 'nguyen.dt@gmail.com',
    phone: '0933 121 212',
    linkedin: '',
    university: 'Đại học Kinh tế Quốc dân',
    major: 'Hệ thống thông tin quản lý',
    currentPosition: 'Business Analyst (Fresher)',
    currentCompany: 'Sinh viên mới tốt nghiệp',
    techStack: 'SQL, Figma, BPMN, Jira',
    cvFile: '',
    cvLink: 'https://drive.google.com/file/d/1nguyen-ba-cv/view',
    source: 'TopCV',
    referrer: '',
    note: 'Fresher tiềm năng, tiếng Anh tốt.',
    appliedPosition: 'Business Analyst',
    appliedLevel: 'Fresher',
    appliedSkills: ['SQL', 'Figma', 'BPMN', 'Jira'],
    appliedBlock: 'PM / BA',
    assignDate: '2026-08-09',
    finalStatus: 'New',
    rating: 0,
    tags: ['Có sáng tạo'],
  },
  {
    id: 'ƯV-0005',
    inputDate: '2026-08-10',
    taReceiver: 'Hồ Tú Anh',
    taPic: 'Lê Thu Trang',
    name: 'Vũ Hoàng Nam',
    dob: '1995-05-30',
    email: 'nam.vh@gmail.com',
    phone: '0977 000 111',
    linkedin: 'linkedin.com/in/namvu-data',
    university: 'Đại học Khoa học Tự nhiên',
    major: 'Toán - Tin ứng dụng',
    currentPosition: 'Data Scientist',
    currentCompany: 'Viettel Digital',
    techStack: 'Python, PyTorch, Spark, MLflow',
    cvFile: 'CV_VuHoangNam.pdf',
    cvLink: 'https://drive.google.com/file/d/1nam-data-cv/view',
    source: 'Headhunt',
    referrer: '',
    note: 'Ứng viên chất lượng cao, đang cân nhắc nhiều offer.',
    appliedPosition: 'Senior Data Scientist',
    appliedLevel: 'Senior',
    appliedSkills: ['Python', 'PyTorch', 'Spark', 'Machine Learning'],
    appliedBlock: 'Data & AI',
    assignDate: '2026-08-11',
    finalStatus: 'Onboarded',
    rating: 5,
    tags: ['Tư duy tốt', 'Nhiệt huyết', 'Tiếng Anh tốt'],
  },
];

// Danh mục nhân viên phụ trách tuyển dụng (TA). Trường "TA phụ trách" chọn từ danh sách này.
export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
}

const EMPLOYEES: Employee[] = [
  { id: 'NV001', name: 'Nguyễn Văn An', position: 'TA Lead', department: 'Talent Acquisition' },
  { id: 'NV002', name: 'Lê Thu Trang', position: 'Senior Recruiter', department: 'Talent Acquisition' },
  { id: 'NV003', name: 'Hồ Tú Anh', position: 'Technical Recruiter', department: 'Talent Acquisition' },
  { id: 'NV004', name: 'Phạm Minh Trí', position: 'Recruiter', department: 'Talent Acquisition' },
  { id: 'NV005', name: 'Nguyễn Thị Mai', position: 'HR Business Partner', department: 'Human Resources' },
  { id: 'NV006', name: 'Trần Quốc Bảo', position: 'Sourcing Specialist', department: 'Talent Acquisition' },
];

// Option cho select nhân viên: value = tên (lưu vào taPic), label = "Tên — Chức danh"
const EMPLOYEE_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: '-- Chọn nhân viên phụ trách --' },
  ...EMPLOYEES.map((e) => ({ value: e.name, label: `${e.name} — ${e.position}` })),
];

// Danh mục kỹ năng theo yêu cầu (dropdown chọn nhiều) cho vị trí ứng tuyển
const SKILL_OPTIONS = [
  'Java', 'Spring Boot', 'Node.js', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular',
  'Python', 'Django', 'Go', 'PHP', '.NET', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis',
  'Kafka', 'GraphQL', 'REST API', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
  'CI/CD', 'Linux', 'Selenium', 'Cypress', 'Playwright', 'Postman', 'JMeter', 'Manual Testing',
  'Figma', 'BPMN', 'Jira', 'Agile/Scrum', 'PyTorch', 'TensorFlow', 'Spark', 'Pandas', 'Machine Learning',
];

// ---- Sinh thêm ứng viên mẫu để danh sách đủ dài (demo phân trang giống mẫu) ----
const _MORE_NAMES = [
  'Trần Minh Hoàng', 'Đỗ Thị Lan Đào', 'Nguyễn Linh Mạnh', 'Thiên Vân', 'Nguyễn Anh Tú',
  'Lê Anh Phú', 'Nguyễn Thế Hùng', 'Mai Thanh Thúy', 'Nguyễn Thị Hoa', 'Nguyễn Phú Nhuận',
  'Nguyễn Đức Dũng', 'Hoàng Anh Minh', 'Trương Thị Phương', 'Phạm Minh Ngọc', 'Mai Thanh Vân',
  'Lê Quốc Toản', 'Vũ Thị Kim', 'Đặng Văn Hải', 'Bùi Thu Hà', 'Ngô Gia Bảo',
  'Phan Thị Yến', 'Hồ Văn Nam', 'Dương Thị Loan', 'Đinh Công Minh', 'Tô Hoài An',
  'Lý Thị Ngọc', 'Trịnh Văn Sơn', 'Cao Thị Hương', 'Võ Minh Khoa', 'Chu Thị Thanh',
];
const _POS_POOL = ['Nhân viên QC', 'Lập trình viên .NET', 'Biên dịch viên', 'Kế toán tổng hợp', 'Nhân viên kinh doanh'];
const _BLOCK_POOL: Block[] = ['QA / Testing', 'Software Development', 'Business', 'PM / BA', 'Data & AI'];
const _STATUS_POOL: FinalStatus[] = ['Applied', 'TA Screen_Consider', 'Intv 1_Schedule', 'Offering', 'New', 'TA Screen_Passed', 'Not Interested'];
const _SOURCE_POOL: Source[] = ['Website', 'Facebook', 'TopCV', 'VietnamWorks', 'ITViec', 'LinkedIn'];
const _TAG_POOL = ['Tư duy tốt', 'Giao tiếp tốt', 'Có kinh nghiệm', 'Có sáng tạo', 'Có năng lực', 'Nhiệt huyết', 'Cẩn thận', 'Tiếng Anh tốt'];
const _LEVEL_POOL: Level[] = ['Fresher', 'Junior', 'Middle', 'Senior'];

INITIAL_CANDIDATES.push(
  ..._MORE_NAMES.map((name, i): Candidate => {
    const idx = i + 6;
    const first = name.split(' ').pop()!.toLowerCase().replace(/đ/g, 'd');
    const emp = EMPLOYEES[i % EMPLOYEES.length].name;
    return {
      id: `ƯV-${String(idx).padStart(4, '0')}`,
      inputDate: `2026-04-${String((i % 27) + 1).padStart(2, '0')}`,
      taReceiver: EMPLOYEES[(i + 2) % EMPLOYEES.length].name,
      taPic: emp,
      name,
      dob: `199${i % 9}-0${(i % 8) + 1}-1${i % 9}`,
      email: `${first}${idx}@gmail.com`,
      phone: `09${String(60 + i)} ${String(200 + i * 3).slice(0, 3)} ${String(100 + i * 7).slice(0, 3)}`,
      linkedin: '',
      university: 'Đại học Kinh tế Quốc dân',
      major: 'Công nghệ thông tin',
      currentPosition: _POS_POOL[i % _POS_POOL.length],
      currentCompany: 'Công ty CP Giải pháp Công nghệ',
      techStack: 'JavaScript, SQL, HTML/CSS',
      cvFile: '',
      cvLink: '',
      source: _SOURCE_POOL[i % _SOURCE_POOL.length],
      referrer: '',
      note: '',
      appliedPosition: _POS_POOL[i % _POS_POOL.length],
      appliedLevel: _LEVEL_POOL[i % _LEVEL_POOL.length],
      appliedSkills: [],
      appliedBlock: _BLOCK_POOL[i % _BLOCK_POOL.length],
      assignDate: '',
      finalStatus: _STATUS_POOL[i % _STATUS_POOL.length],
      rating: i % 3 === 0 ? 0 : (i % 5) + 1,
      tags: i % 4 === 0 ? [] : _TAG_POOL.slice(i % 5, (i % 5) + (1 + (i % 2))),
    };
  })
);

// Người dùng đang đăng nhập (mock) - dùng cho trường "người thay đổi" khi ghi log
const CURRENT_USER = 'Nguyễn Văn An';

// Nhãn tiếng Việt của từng trường khi hiển thị log thay đổi
const FIELD_LABELS: Record<keyof Candidate, string> = {
  id: 'Mã ứng viên',
  inputDate: 'Ngày tiếp nhận',
  taReceiver: 'TA tiếp nhận',
  taPic: 'TA phụ trách',
  name: 'Họ và tên',
  dob: 'Ngày sinh',
  email: 'Email',
  phone: 'Điện thoại',
  linkedin: 'LinkedIn',
  university: 'Trường đại học',
  major: 'Chuyên ngành',
  currentPosition: 'Vị trí hiện tại',
  currentCompany: 'Công ty hiện tại',
  techStack: 'Tech Stack',
  cvFile: 'File CV',
  cvLink: 'Link CV',
  source: 'Nguồn',
  referrer: 'Người refer',
  note: 'Ghi chú',
  appliedPosition: 'Vị trí ứng tuyển',
  appliedLevel: 'Level ứng tuyển',
  appliedSkills: 'Kỹ năng',
  appliedBlock: 'Khối ứng tuyển',
  assignDate: 'Ngày assign job',
  finalStatus: 'Trạng thái',
  rating: 'Đánh giá',
  tags: 'Thẻ',
};

// Một thay đổi của 1 trường: giá trị cũ → giá trị mới
export interface FieldChange {
  field: string;
  oldValue: string;
  newValue: string;
}

// Bản ghi log thay đổi hồ sơ ứng viên
export interface ChangeLog {
  id: string;
  candidateId: string;
  action: 'create' | 'update';
  changedBy: string;   // người thay đổi
  timestamp: string;   // thời gian thay đổi
  changes: FieldChange[];
}

// Seed log khởi tạo cho các ứng viên mẫu
const INITIAL_LOGS: ChangeLog[] = INITIAL_CANDIDATES.map((c, i) => ({
  id: `LOG-INIT-${i}`,
  candidateId: c.id,
  action: 'create',
  changedBy: c.taPic,
  timestamp: `${c.inputDate.split('-').reverse().join('/')} 09:00:00`,
  changes: [],
}));

// Trạng thái mặc định của form rỗng
const emptyForm = (): Candidate => ({
  id: '',
  inputDate: new Date().toISOString().split('T')[0],
  taReceiver: '',
  taPic: '',
  name: '',
  dob: '',
  email: '',
  phone: '',
  linkedin: '',
  university: '',
  major: '',
  currentPosition: '',
  currentCompany: '',
  techStack: '',
  cvFile: '',
  cvLink: '',
  source: 'LinkedIn',
  referrer: '',
  note: '',
  appliedPosition: '',
  appliedLevel: '',
  appliedSkills: [],
  appliedBlock: '',
  assignDate: '',
  finalStatus: 'New',
  rating: 0,
  tags: [],
});

const formatDate = (d: string) => (d ? new Date(d).toLocaleDateString('vi-VN') : '—');

// ==========================================================================
// SUB-COMPONENTS
// ==========================================================================

const StatusBadge: React.FC<{ status: FinalStatus; withLabel?: boolean }> = ({ status, withLabel }) => (
  <span
    className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border inline-flex items-center gap-1.5 ${STATUS_STYLE[status]}`}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {withLabel ? STATUS_LABEL[status] : status}
  </span>
);

// Hiển thị đánh giá dạng sao (hỗ trợ nửa sao)
const Stars: React.FC<{ value: number }> = ({ value }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((n) =>
      value >= n ? (
        <Star key={n} size={13} className="fill-amber-400 text-amber-400" />
      ) : value >= n - 0.5 ? (
        <StarHalf key={n} size={13} className="fill-amber-400 text-amber-400" />
      ) : (
        <Star key={n} size={13} className="text-slate-200" />
      )
    )}
  </div>
);

// Màu cho thẻ (tag) - deterministic theo nội dung
const TAG_COLORS = [
  'bg-blue-100 text-blue-600',
  'bg-emerald-100 text-emerald-600',
  'bg-amber-100 text-amber-600',
  'bg-violet-100 text-violet-600',
  'bg-rose-100 text-rose-600',
  'bg-sky-100 text-sky-600',
  'bg-orange-100 text-orange-600',
];
const tagColor = (t: string) => {
  let h = 0;
  for (const ch of t) h = (h * 31 + ch.charCodeAt(0)) % TAG_COLORS.length;
  return TAG_COLORS[h];
};

// Nhãn kiểu form: chữ thường, dấu * đỏ khi bắt buộc (hiển thị cả khi xem)
const FieldLabel: React.FC<{ label: string; required?: boolean }> = ({ label, required }) => (
  <label className="block text-[13px] font-medium text-slate-500 mb-1.5">
    {label}
    {required && <span className="text-rose-500"> *</span>}
  </label>
);

// Ô chi tiết vừa hiển thị (view) vừa cho sửa inline (edit) tuỳ theo `editing`
const DetailField: React.FC<{
  icon?: React.ElementType;
  label: string;
  value: string;
  onChange?: (v: string) => void;
  editing?: boolean;
  display?: React.ReactNode;
  control?: 'text' | 'date' | 'email' | 'textarea' | 'select';
  options?: (string | { value: string; label: string })[];
  placeholder?: string;
  required?: boolean;
  mono?: boolean;
  full?: boolean;
}> = ({ label, value, onChange, editing, display, control = 'text', options = [], placeholder, required, full }) => (
  <div className={full ? 'sm:col-span-2' : ''}>
    <FieldLabel label={label} required={required} />
    {editing ? (
      control === 'select' ? (
        <select value={value} onChange={(e) => onChange?.(e.target.value)} className={`${fieldClass} cursor-pointer`}>
          {options.map((o) => {
            const val = typeof o === 'string' ? o : o.value;
            const lbl = typeof o === 'string' ? o : o.label;
            return val === '' ? (
              <option key="__empty" value="">{placeholder || (typeof lbl === 'string' ? lbl : '') || '-- Chọn --'}</option>
            ) : (
              <option key={val} value={val}>{lbl}</option>
            );
          })}
        </select>
      ) : control === 'textarea' ? (
        <textarea value={value} onChange={(e) => onChange?.(e.target.value)} rows={2} placeholder={placeholder} className={`${fieldClass} resize-none`} />
      ) : (
        <input
          type={control === 'date' ? 'date' : control === 'email' ? 'email' : 'text'}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={fieldClass}
        />
      )
    ) : (
      // Chế độ xem: giá trị nằm trong ô viền như một input chỉ đọc
      <div className="w-full min-h-[38px] px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-md text-sm font-medium text-slate-800 break-words flex items-center">
        {display !== undefined ? display : value !== '' ? value : <span className="text-slate-300 font-normal">—</span>}
      </div>
    )}
  </div>
);

// Section dạng form có thể thu gọn (giống mẫu: tiêu đề + chevron)
const Section: React.FC<{ title: string; icon?: React.ElementType; children: React.ReactNode; defaultOpen?: boolean }> = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer"
      >
        <h3 className="text-sm font-bold text-[#0fa57c] flex items-center gap-2">
          {Icon && <Icon size={16} className="text-[#0fa57c]" />}
          {title}
        </h3>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
};

// Chọn nhiều kỹ năng (dropdown theo yêu cầu): view = chip, edit = chip có nút xoá + dropdown thêm
const SkillSelect: React.FC<{
  value: string[];
  options: string[];
  editing?: boolean;
  onChange?: (v: string[]) => void;
}> = ({ value, options, editing, onChange }) => {
  if (!editing) {
    return value.length ? (
      <div className="flex flex-wrap gap-1.5">
        {value.map((s) => (
          <span key={s} className="px-2 py-0.5 bg-[#0fa57c]/10 text-[#0fa57c] rounded-md text-[11px] font-bold">{s}</span>
        ))}
      </div>
    ) : (
      <p className="text-sm text-slate-300 font-normal">Chưa cập nhật</p>
    );
  }
  const remaining = options.filter((o) => !value.includes(o));
  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((s) => (
            <span key={s} className="px-2 py-1 bg-[#0fa57c]/10 text-[#0fa57c] rounded-md text-[11px] font-bold flex items-center gap-1">
              {s}
              <button
                type="button"
                onClick={() => onChange?.(value.filter((x) => x !== s))}
                className="hover:text-rose-500 transition-colors"
                title="Bỏ kỹ năng"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      <select
        value=""
        onChange={(e) => {
          if (e.target.value) onChange?.([...value, e.target.value]);
        }}
        className={`${fieldClass} cursor-pointer`}
      >
        <option value="">+ Thêm kỹ năng theo yêu cầu...</option>
        {remaining.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
};

// ==========================================================================
// MAIN COMPONENT
// ==========================================================================

export const CandidatePage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);

  // null = màn danh sách, có giá trị = màn chi tiết
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Bộ lọc & tìm kiếm cho danh sách
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [blockFilter, setBlockFilter] = useState<string>('All');

  // Chọn dòng (checkbox) & phân trang
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  // Chỉnh sửa / tạo mới inline ngay trên màn chi tiết (không dùng popup)
  const [isEditing, setIsEditing] = useState(false);   // đang sửa hồ sơ đã có
  const [isCreating, setIsCreating] = useState(false); // đang tạo ứng viên mới
  const [draft, setDraft] = useState<Candidate>(emptyForm());
  const [detailError, setDetailError] = useState('');

  // Log lịch sử thay đổi hồ sơ ứng viên
  const [logs, setLogs] = useState<ChangeLog[]>(INITIAL_LOGS);
  const [showLog, setShowLog] = useState(false);

  const selectedCandidate = candidates.find((c) => c.id === selectedId) || null;
  // Đang ở chế độ nhập liệu (sửa hoặc tạo mới)
  const editing = isEditing || isCreating;
  // Có hiển thị màn chi tiết không (xem 1 ứng viên / đang sửa / đang tạo mới)
  const showDetail = selectedCandidate != null || isCreating;
  // Dữ liệu hiển thị ở màn chi tiết: khi nhập liệu thì lấy từ bản nháp (draft)
  const view: Candidate = (editing ? draft : selectedCandidate) as Candidate;
  const setDf = (k: keyof Candidate) => (v: string) => setDraft((prev) => ({ ...prev, [k]: v }));
  // Log thay đổi của ứng viên đang xem
  const candidateLogs = logs.filter((l) => l.candidateId === (selectedCandidate?.id ?? ''));

  // Mở màn tạo ứng viên mới — dùng luôn màn chi tiết ở chế độ nhập liệu
  const startCreate = () => {
    setSelectedId(null);
    setDraft(emptyForm());
    setIsCreating(true);
    setIsEditing(false);
    setDetailError('');
  };

  // Vào chế độ sửa inline trên màn chi tiết (dùng chung cho nút ở list và ở màn view)
  const startEditDetail = (c: Candidate) => {
    setSelectedId(c.id);
    setDraft({ ...c });
    setIsEditing(true);
    setIsCreating(false);
    setDetailError('');
  };

  const cancelEdit = () => {
    if (isCreating) {
      setIsCreating(false);
      setSelectedId(null); // hủy tạo mới → quay về danh sách
    } else {
      setIsEditing(false);
    }
    setDetailError('');
  };

  const backToList = () => {
    setSelectedId(null);
    setIsEditing(false);
    setIsCreating(false);
    setDetailError('');
  };

  const nowStamp = () => new Date().toLocaleString('vi-VN', { hour12: false });

  const saveDetail = () => {
    const err = validate(draft);
    if (err) {
      setDetailError(err);
      return;
    }
    if (isCreating) {
      const newId = `ƯV-${String(candidates.length + 1).padStart(4, '0')}`;
      setCandidates((prev) => [{ ...draft, id: newId }, ...prev]);
      // Ghi log tạo mới
      setLogs((prev) => [
        { id: `LOG-${Date.now()}`, candidateId: newId, action: 'create', changedBy: CURRENT_USER, timestamp: nowStamp(), changes: [] },
        ...prev,
      ]);
      setSelectedId(newId); // tạo xong xem luôn hồ sơ vừa tạo
      setIsCreating(false);
    } else {
      // So sánh bản gốc với bản nháp để tìm các trường thay đổi
      const original = selectedCandidate;
      const changes: FieldChange[] = [];
      if (original) {
        const fmt = (v: unknown) => (Array.isArray(v) ? v.join(', ') : String(v ?? ''));
        (Object.keys(FIELD_LABELS) as (keyof Candidate)[]).forEach((k) => {
          if (k === 'id') return;
          const oldV = fmt(original[k]);
          const newV = fmt(draft[k]);
          if (oldV !== newV) changes.push({ field: FIELD_LABELS[k], oldValue: oldV, newValue: newV });
        });
      }
      setCandidates((prev) => prev.map((c) => (c.id === draft.id ? { ...draft } : c)));
      // Chỉ ghi log khi thực sự có thay đổi
      if (changes.length > 0) {
        setLogs((prev) => [
          { id: `LOG-${Date.now()}`, candidateId: draft.id, action: 'update', changedBy: CURRENT_USER, timestamp: nowStamp(), changes },
          ...prev,
        ]);
      }
    }
    setIsEditing(false);
    setDetailError('');
  };

  // Đổi nhanh trạng thái ngay ở màn xem (không cần vào chế độ sửa) — mỗi lần đổi ghi log
  const changeStatus = (newStatus: FinalStatus) => {
    if (!selectedCandidate || newStatus === selectedCandidate.finalStatus) return;
    const oldStatus = selectedCandidate.finalStatus;
    const id = selectedCandidate.id;
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, finalStatus: newStatus } : c)));
    setLogs((prev) => [
      {
        id: `LOG-${Date.now()}`,
        candidateId: id,
        action: 'update',
        changedBy: CURRENT_USER,
        timestamp: nowStamp(),
        changes: [{ field: 'Trạng thái', oldValue: oldStatus, newValue: newStatus }],
      },
      ...prev,
    ]);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ ứng viên này?')) {
      setCandidates((prev) => prev.filter((c) => c.id !== id));
      if (selectedId === id) {
        setSelectedId(null);
        setIsEditing(false);
      }
    }
  };

  // Kiểm tra hợp lệ dùng chung cho cả thêm mới và sửa inline
  const validate = (c: Candidate): string | null => {
    const required: [keyof Candidate, string][] = [
      ['inputDate', 'Ngày tiếp nhận'],
      ['taPic', 'TA phụ trách'],
      ['name', 'Họ và tên'],
      ['email', 'Email'],
      ['university', 'Trường đại học'],
      ['major', 'Chuyên ngành'],
      ['currentPosition', 'Vị trí hiện tại'],
      ['currentCompany', 'Công ty hiện tại'],
      ['techStack', 'Tech Stack'],
      ['source', 'Nguồn ứng viên'],
    ];
    for (const [key, label] of required) {
      if (!String(c[key]).trim()) return `Vui lòng nhập "${label}"`;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email.trim())) return 'Email không đúng định dạng';
    if (c.source === 'Refer' && !c.referrer.trim()) return 'Nguồn là "Refer" — vui lòng nhập tên Người refer';
    return null;
  };

  // ---- Danh sách đã lọc ----
  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const hay = `${c.name} ${c.email} ${c.phone} ${c.currentCompany} ${c.techStack} ${c.appliedPosition} ${c.taPic}`.toLowerCase();
      const matchSearch = hay.includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'All' || c.finalStatus === statusFilter;
      const matchSource = sourceFilter === 'All' || c.source === sourceFilter;
      const matchBlock = blockFilter === 'All' || c.appliedBlock === blockFilter;
      return matchSearch && matchStatus && matchSource && matchBlock;
    });
  }, [candidates, searchQuery, statusFilter, sourceFilter, blockFilter]);

  // Thống kê nhanh theo trạng thái
  const stats = useMemo(() => {
    const total = candidates.length;
    const inSet = (arr: FinalStatus[]) => candidates.filter((c) => arr.includes(c.finalStatus)).length;
    return {
      total,
      interview: candidates.filter((c) => c.finalStatus.startsWith('Intv')).length,
      offer: inSet(['Offering', 'Offer Accepted', 'Offer Rejected']),
      hired: inSet(['Onboarded']),
    };
  }, [candidates]);

  // ---- Phân trang ----
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const paged = filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, filtered.length);

  // ---- Chọn dòng ----
  const toggleRow = (id: string) =>
    setSelectedRows((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const allPageSelected = paged.length > 0 && paged.every((c) => selectedRows.has(c.id));
  const toggleAllPage = () =>
    setSelectedRows((prev) => {
      const n = new Set(prev);
      if (allPageSelected) paged.forEach((c) => n.delete(c.id));
      else paged.forEach((c) => n.add(c.id));
      return n;
    });

  // ---- Xuất khẩu CSV ----
  const handleExport = () => {
    const source = selectedRows.size > 0 ? filtered.filter((c) => selectedRows.has(c.id)) : filtered;
    const cols = ['Họ và tên', 'Số điện thoại', 'Email', 'Vị trí tuyển dụng', 'Tin tuyển dụng', 'Vòng tuyển dụng', 'Đánh giá', 'Thẻ', 'Ngày ứng tuyển', 'Nguồn ứng viên'];
    const rows = source.map((c) => [c.name, c.phone, c.email, c.appliedPosition, c.appliedBlock, c.finalStatus, String(c.rating), c.tags.join('; '), formatDate(c.inputDate), c.source]);
    const csv = [cols, ...rows].map((r) => r.map((f) => `"${String(f ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'danh-sach-ung-vien.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // ==========================================================================
  return (
    <div className="bg-transparent min-h-full p-4 sm:p-6">
      <div className="space-y-6 w-full pb-20">
        <AnimatePresence mode="wait">
          {!showDetail ? (
            // ==================================================================
            // MÀN 1: DANH SÁCH ỨNG VIÊN
            // ==================================================================
            <motion.div
              key="candidate-list"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Header + toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-[#0fa57c]/10 text-[#0fa57c] rounded-2xl shadow-xs">
                    <UserPlus size={22} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">QUẢN LÝ ỨNG VIÊN</h2>
                    <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider mt-0.5">
                      Module Tuyển dụng · Danh sách ứng viên
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full lg:w-auto">
                  <div className="relative flex-1 lg:w-72">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm nhanh trong danh sách"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0fa57c] focus:ring-2 focus:ring-[#0fa57c]/10 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    onClick={handleExport}
                    className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
                  >
                    <Download size={14} className="text-[#0fa57c]" />
                    Xuất khẩu
                  </button>
                  <button
                    onClick={startCreate}
                    className="px-4 py-2.5 bg-[#0fa57c] text-white rounded-xl text-xs font-bold hover:bg-[#0fa57c]/90 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer active:scale-95 shrink-0"
                  >
                    <Plus size={15} />
                    Thêm ứng viên
                  </button>
                </div>
              </div>

              {/* Bảng danh sách kiểu grid */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  {filtered.length === 0 ? (
                    <div className="py-16 text-center space-y-3">
                      <AlertCircle className="mx-auto text-slate-300" size={40} />
                      <p className="text-xs font-bold text-slate-400">Không tìm thấy ứng viên nào phù hợp</p>
                      <button
                        onClick={() => { setSearchQuery(''); setStatusFilter('All'); setSourceFilter('All'); setBlockFilter('All'); }}
                        className="px-4 py-1.5 border border-slate-200 text-slate-500 text-[10px] font-bold rounded-lg hover:bg-slate-50"
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse min-w-[1150px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          <th className="pl-5 pr-2 py-3.5 w-10">
                            <input
                              type="checkbox"
                              checked={allPageSelected}
                              onChange={toggleAllPage}
                              className="w-4 h-4 rounded border-slate-300 text-[#0fa57c] accent-[#0fa57c] cursor-pointer"
                            />
                          </th>
                          <th className="px-4 py-3.5 font-bold">Họ và tên</th>
                          <th className="px-4 py-3.5 font-bold">Số điện thoại</th>
                          <th className="px-4 py-3.5 font-bold">Email</th>
                          <th className="px-4 py-3.5 font-bold">Vị trí tuyển dụng</th>
                          <th className="px-4 py-3.5 font-bold">Tin tuyển dụng</th>
                          <th className="px-4 py-3.5 font-bold">Vòng tuyển dụng</th>
                          <th className="px-4 py-3.5 font-bold">Đánh giá</th>
                          <th className="px-4 py-3.5 font-bold">Thẻ</th>
                          <th className="px-4 py-3.5 font-bold">Ngày ứng tuyển</th>
                          <th className="px-4 py-3.5 font-bold">Nguồn ứng viên</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {paged.map((c) => (
                          <tr
                            key={c.id}
                            onClick={() => setSelectedId(c.id)}
                            className={`transition-colors group cursor-pointer ${selectedRows.has(c.id) ? 'bg-emerald-50/40' : 'hover:bg-slate-50/75'}`}
                          >
                            <td className="pl-5 pr-2 py-3" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedRows.has(c.id)}
                                onChange={() => toggleRow(c.id)}
                                className="w-4 h-4 rounded border-slate-300 text-[#0fa57c] accent-[#0fa57c] cursor-pointer"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0fa57c] to-teal-400 text-white flex items-center justify-center font-bold text-[10px] uppercase shadow-xs shrink-0">
                                  {c.name.split(' ').pop()?.slice(0, 2)}
                                </div>
                                <span className="font-bold text-slate-800 group-hover:text-[#0fa57c] transition-colors whitespace-nowrap">{c.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">{c.phone || '—'}</td>
                            <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{c.email}</td>
                            <td className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">{c.appliedPosition || '—'}</td>
                            <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{c.appliedBlock || '—'}</td>
                            <td className="px-4 py-3"><StatusBadge status={c.finalStatus} /></td>
                            <td className="px-4 py-3"><Stars value={c.rating} /></td>
                            <td className="px-4 py-3">
                              {c.tags.length ? (
                                <div className="flex flex-wrap gap-1 max-w-[180px]">
                                  {c.tags.map((t) => (
                                    <span key={t} className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${tagColor(t)}`}>{t}</span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-300">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">{formatDate(c.inputDate)}</td>
                            <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{c.source}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Footer phân trang */}
                {filtered.length > 0 && (
                  <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/30">
                    <span className="text-xs font-bold text-slate-500">
                      Tổng số bản ghi: <span className="text-slate-800">{filtered.length}</span>
                      {selectedRows.size > 0 && <span className="ml-2 text-[#0fa57c]">· Đã chọn {selectedRows.size}</span>}
                    </span>
                    <div className="flex items-center gap-3">
                      <select
                        value={pageSize}
                        onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                        className="bg-white border border-slate-200 px-2 py-1.5 rounded-lg text-xs font-bold text-slate-600 outline-none focus:border-[#0fa57c] cursor-pointer"
                      >
                        {[10, 20, 30, 50].map((n) => (
                          <option key={n} value={n}>{n} bản ghi trên trang</option>
                        ))}
                      </select>
                      <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{rangeStart} đến {rangeEnd}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={page <= 1}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <span className="text-xs font-bold text-slate-600 px-1">{page}/{totalPages}</span>
                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page >= totalPages}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            // ==================================================================
            // MÀN 2: CHI TIẾT ỨNG VIÊN
            // ==================================================================
            <motion.div
              key="candidate-detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Back + actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                  onClick={backToList}
                  className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors self-start py-1"
                >
                  <ArrowLeft size={16} />
                  <span>Quay lại danh sách ứng viên</span>
                </button>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {!editing ? (
                    <>
                      <button
                        onClick={() => setShowLog(true)}
                        className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                      >
                        <History size={14} className="text-[#0fa57c]" />
                        Lịch sử thay đổi
                        {candidateLogs.length > 0 && (
                          <span className="px-1.5 py-0.5 bg-[#0fa57c]/10 text-[#0fa57c] rounded-md text-[10px] font-black">
                            {candidateLogs.length}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => startEditDetail(selectedCandidate)}
                        className="px-4 py-2 bg-[#0fa57c] text-white rounded-xl text-xs font-bold hover:bg-[#0fa57c]/90 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer active:scale-95"
                      >
                        <Edit3 size={14} />
                        Chỉnh sửa hồ sơ
                      </button>
                      <button
                        onClick={() => handleDelete(selectedCandidate.id)}
                        className="px-4 py-2 border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                      >
                        <Trash2 size={14} />
                        Xóa
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                      >
                        <X size={14} />
                        Hủy
                      </button>
                      <button
                        onClick={saveDetail}
                        className="px-5 py-2 bg-[#0fa57c] text-white rounded-xl text-xs font-bold hover:bg-[#0fa57c]/90 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10 cursor-pointer active:scale-95"
                      >
                        <Check size={15} />
                        {isCreating ? 'Tạo ứng viên' : 'Lưu thay đổi'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Banner trạng thái khi nhập liệu */}
              {editing && (
                <div className="p-3 bg-amber-50 text-amber-700 border border-amber-100 text-xs font-bold rounded-xl flex items-center gap-2">
                  {isCreating ? <UserPlus size={14} /> : <Edit3 size={14} />}
                  <span>
                    {isCreating
                      ? 'Bạn đang tạo ứng viên mới. Điền thông tin (các trường có dấu * là bắt buộc) rồi bấm "Tạo ứng viên".'
                      : 'Bạn đang ở chế độ chỉnh sửa. Sửa trực tiếp các ô bên dưới rồi bấm "Lưu thay đổi".'}
                  </span>
                </div>
              )}
              {detailError && (
                <div className="p-3.5 bg-rose-50 text-rose-600 border border-rose-100 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{detailError}</span>
                </div>
              )}

              {/* Profile header card */}
              <div className={`bg-white rounded-3xl border p-5 sm:p-6 shadow-xs relative overflow-hidden transition-colors ${editing ? 'border-[#0fa57c]/40 ring-2 ring-[#0fa57c]/10' : 'border-slate-100'}`}>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#0fa57c] to-teal-400 text-white flex items-center justify-center font-black text-xl uppercase shadow-md shrink-0">
                      {view.name.split(' ').pop()?.slice(0, 2) || '?'}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">{view.name || (isCreating ? 'Ứng viên mới' : 'Chưa có tên')}</h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-bold mt-1">
                        <span className="font-mono text-slate-700">{isCreating ? 'Mã tự động khi lưu' : view.id}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[#0fa57c]">{view.appliedPosition || 'Chưa gắn vị trí'}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 font-semibold">
                        {view.currentPosition || '—'} {view.currentCompany ? `@ ${view.currentCompany}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <StatusBadge status={view.finalStatus} withLabel />
                    <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <Calendar size={12} />
                      Tiếp nhận: {formatDate(view.inputDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail sections - bố cục 2 cột cân đối */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                {/* ===== Cột 1: Thông tin tuyển dụng (khu vực làm việc chính) ===== */}
                <div className="space-y-6">
                  {/* Thông tin ứng tuyển */}
                  <Section title="Thông tin ứng tuyển" icon={Tag}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                      {/* Trạng thái ứng viên - đổi nhanh ngay ở màn xem, tự ghi log (full width) */}
                      <div className="sm:col-span-2 bg-slate-50/70 border border-slate-200 rounded-lg p-4">
                        <label className="block text-[13px] font-medium text-slate-500 mb-2">
                          Trạng thái ứng viên <span className="text-rose-500">*</span>
                        </label>
                        {editing ? (
                          <select
                            value={draft.finalStatus}
                            onChange={setDf('finalStatus')}
                            className={`${fieldClass} cursor-pointer font-bold`}
                          >
                            {FINAL_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <StatusBadge status={view.finalStatus} withLabel />
                            <select
                              value={view.finalStatus}
                              onChange={(e) => changeStatus(e.target.value as FinalStatus)}
                              className={`${fieldClass} cursor-pointer font-bold sm:max-w-xs`}
                            >
                              {FINAL_STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        )}
                        {!editing && (
                          <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                            <History size={11} /> Đổi trạng thái sẽ được ghi log tự động (người đổi + thời gian)
                          </p>
                        )}
                      </div>

                      {editing && (
                        <DetailField icon={Calendar} label="Ngày tiếp nhận" required control="date" mono editing value={view.inputDate} onChange={setDf('inputDate')} />
                      )}
                      <DetailField icon={Briefcase} label="Vị trí ứng tuyển" editing={editing} value={view.appliedPosition} onChange={setDf('appliedPosition')} />
                      <DetailField icon={Star} label="Level ứng tuyển" control="select" options={['', ...LEVELS]} placeholder="-- Chọn level --" editing={editing} value={view.appliedLevel} onChange={setDf('appliedLevel')} />
                      {/* Kỹ năng theo yêu cầu (dropdown chọn nhiều) - full width */}
                      <div className="sm:col-span-2">
                        <label className="block text-[13px] font-medium text-slate-500 mb-1.5">Kỹ năng</label>
                        <SkillSelect
                          value={view.appliedSkills}
                          options={SKILL_OPTIONS}
                          editing={editing}
                          onChange={(v) => setDraft((p) => ({ ...p, appliedSkills: v }))}
                        />
                      </div>
                      <DetailField icon={Layers} label="Khối ứng tuyển" control="select" options={['', ...BLOCKS]} placeholder="-- Chọn khối --" editing={editing} value={view.appliedBlock} onChange={setDf('appliedBlock')} />
                      <DetailField icon={Calendar} label="Ngày assign job" control="date" mono editing={editing} value={view.assignDate} display={formatDate(view.assignDate)} onChange={setDf('assignDate')} />
                      <DetailField icon={UserCheck} label="TA phụ trách" required control="select" options={EMPLOYEE_OPTIONS} placeholder="-- Chọn nhân viên phụ trách --" editing={editing} value={view.taPic} onChange={setDf('taPic')} />

                      <div className="h-px bg-slate-100 sm:col-span-2" />
                      <DetailField icon={Tag} label="Nguồn ứng viên" required control="select" options={[...SOURCES]} editing={editing} value={view.source} onChange={setDf('source')} />
                      {(editing || view.source === 'Refer') && (
                        <DetailField
                          icon={UserCheck}
                          label={`Người refer${view.source === 'Refer' ? ' *' : ''}`}
                          editing={editing}
                          value={view.referrer}
                          onChange={setDf('referrer')}
                          placeholder={view.source === 'Refer' ? 'Bắt buộc khi nguồn là Refer' : 'Không bắt buộc'}
                        />
                      )}
                    </div>
                  </Section>

                  {/* CV file */}
                  <Section title="File CV nguồn" icon={Paperclip}>
                    <div>
                      {editing ? (
                        <CvUploader
                          fileName={draft.cvFile}
                          link={draft.cvLink}
                          onPickFile={(name) => setDraft((p) => ({ ...p, cvFile: name }))}
                          onClearFile={() => setDraft((p) => ({ ...p, cvFile: '' }))}
                          onLinkChange={(v) => setDraft((p) => ({ ...p, cvLink: v }))}
                        />
                      ) : view.cvFile || view.cvLink ? (
                        <div className="space-y-2.5">
                          {view.cvFile && (
                            <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-rose-50 text-rose-500 rounded-lg shrink-0">
                                  <FileText size={18} />
                                </div>
                                <span className="text-xs font-bold text-slate-700 truncate">{view.cvFile}</span>
                              </div>
                              <button className="p-2 text-slate-400 hover:text-[#0fa57c] hover:bg-emerald-50 rounded-lg transition-colors shrink-0" title="Tải xuống">
                                <Download size={16} />
                              </button>
                            </div>
                          )}
                          {view.cvLink && (
                            <a
                              href={view.cvLink.startsWith('http') ? view.cvLink : `https://${view.cvLink}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl hover:bg-emerald-50 transition-colors group/link"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2 bg-[#0fa57c]/10 text-[#0fa57c] rounded-lg shrink-0">
                                  <LinkIcon size={18} />
                                </div>
                                <span className="text-xs font-bold text-[#0fa57c] truncate">{view.cvLink}</span>
                              </div>
                              <ExternalLink size={16} className="text-[#0fa57c] shrink-0 opacity-70 group-hover/link:opacity-100" />
                            </a>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-300 text-center py-2">Chưa đính kèm CV</p>
                      )}
                    </div>
                  </Section>
                </div>

                {/* ===== Cột 2: Hồ sơ cá nhân (tham chiếu) ===== */}
                <div className="space-y-6">
                  {/* Thông tin cá nhân & liên hệ */}
                  <Section title="Thông tin cá nhân & liên hệ" icon={Mail}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                      <DetailField icon={Users} label="Họ và tên" required editing={editing} value={view.name} onChange={setDf('name')} placeholder="VD: Nguyễn Văn A" />
                      <DetailField icon={Calendar} label="Ngày sinh" control="date" mono editing={editing} value={view.dob} display={formatDate(view.dob)} onChange={setDf('dob')} />
                      <DetailField icon={Mail} label="Email" required control="email" mono editing={editing} value={view.email} onChange={setDf('email')} placeholder="email@example.com" />
                      <DetailField icon={Phone} label="Điện thoại" mono editing={editing} value={view.phone} onChange={setDf('phone')} placeholder="09xx xxx xxx" />
                      <DetailField icon={UserCheck} label="TA tiếp nhận" full control="select" options={EMPLOYEE_OPTIONS} placeholder="-- Chọn nhân viên tiếp nhận --" editing={editing} value={view.taReceiver} onChange={setDf('taReceiver')} />
                      <DetailField
                        icon={Linkedin}
                        label="LinkedIn"
                        full
                        editing={editing}
                        value={view.linkedin}
                        onChange={setDf('linkedin')}
                        placeholder="linkedin.com/in/..."
                        display={
                          view.linkedin ? (
                            <a
                              href={view.linkedin.startsWith('http') ? view.linkedin : `https://${view.linkedin}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#0fa57c] hover:underline break-all"
                            >
                              {view.linkedin}
                            </a>
                          ) : undefined
                        }
                      />
                    </div>
                  </Section>

                  {/* Học vấn & Kinh nghiệm */}
                  <Section title="Học vấn & kinh nghiệm" icon={GraduationCap}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                      <DetailField icon={GraduationCap} label="Trường đại học" required editing={editing} value={view.university} onChange={setDf('university')} />
                      <DetailField icon={Layers} label="Chuyên ngành" required editing={editing} value={view.major} onChange={setDf('major')} />
                      <DetailField icon={Briefcase} label="Vị trí hiện tại" required editing={editing} value={view.currentPosition} onChange={setDf('currentPosition')} />
                      <DetailField icon={Building2} label="Công ty hiện tại" required editing={editing} value={view.currentCompany} onChange={setDf('currentCompany')} />
                      <DetailField icon={Code2} label="Tech Stack" required full control="textarea" editing={editing} value={view.techStack} onChange={setDf('techStack')} placeholder="VD: Java, Spring Boot, PostgreSQL..." />
                    </div>
                  </Section>

                  {/* Ghi chú */}
                  <Section title="Ghi chú" icon={FileText}>
                    <div>
                      {editing ? (
                        <textarea
                          value={draft.note}
                          onChange={setDf('note')}
                          rows={4}
                          placeholder="Nhận xét, lưu ý về ứng viên..."
                          className={`${fieldClass} resize-none`}
                        />
                      ) : (
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                          {view.note || <span className="text-slate-300">Chưa có ghi chú.</span>}
                        </p>
                      )}
                    </div>
                  </Section>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ==================================================================
          MODAL: LỊCH SỬ THAY ĐỔI HỒ SƠ ỨNG VIÊN
          ================================================================== */}
      <AnimatePresence>
        {showLog && selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLog(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] border border-slate-100 z-10"
            >
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <History size={16} className="text-[#0fa57c]" />
                    LỊCH SỬ THAY ĐỔI
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    {selectedCandidate.name} · {selectedCandidate.id} · {candidateLogs.length} bản ghi
                  </p>
                </div>
                <button
                  onClick={() => setShowLog(false)}
                  className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {candidateLogs.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <History className="mx-auto text-slate-300" size={40} />
                    <p className="text-xs font-bold text-slate-400">Chưa có thay đổi nào được ghi nhận</p>
                  </div>
                ) : (
                  <ol className="relative border-l-2 border-slate-100 ml-2 space-y-6">
                    {candidateLogs.map((log) => (
                      <li key={log.id} className="ml-5">
                        {/* Chấm mốc thời gian */}
                        <span className={`absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full ring-4 ring-white ${log.action === 'create' ? 'bg-[#0fa57c]' : 'bg-amber-400'}`} />

                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${log.action === 'create' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                            {log.action === 'create' ? 'Khởi tạo' : 'Chỉnh sửa'}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-600">
                            <User size={12} className="text-slate-400" />
                            {log.changedBy}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 font-mono">
                            <Clock size={12} />
                            {log.timestamp}
                          </span>
                        </div>

                        {log.action === 'create' ? (
                          <p className="text-xs text-slate-500 font-medium">Khởi tạo hồ sơ ứng viên trong hệ thống.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {log.changes.map((ch, idx) => (
                              <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">{ch.field}</span>
                                <div className="flex items-center gap-2 text-xs flex-wrap">
                                  <span className="px-2 py-0.5 bg-rose-50 text-rose-500 rounded-md line-through decoration-rose-300 font-semibold break-all">
                                    {ch.oldValue || '(trống)'}
                                  </span>
                                  <ArrowRight size={13} className="text-slate-400 shrink-0" />
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md font-bold break-all">
                                    {ch.newValue || '(trống)'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================================================
// FORM HELPER COMPONENTS
// ==========================================================================

// Upload file CV (mock: lưu tên file) + dòng gán link CV. Dùng chung cho modal thêm & sửa inline.
const CvUploader: React.FC<{
  fileName: string;
  link: string;
  onPickFile: (name: string) => void;
  onClearFile: () => void;
  onLinkChange: (v: string) => void;
}> = ({ fileName, link, onPickFile, onClearFile, onLinkChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPickFile(f.name);
          e.currentTarget.value = '';
        }}
      />

      {fileName ? (
        <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-rose-50 text-rose-500 rounded-lg shrink-0">
              <FileText size={18} />
            </div>
            <span className="text-xs font-bold text-slate-700 truncate">{fileName}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-2.5 py-1.5 text-[10px] font-bold text-slate-500 hover:text-[#0fa57c] hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Đổi file
            </button>
            <button
              type="button"
              onClick={onClearFile}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Gỡ file"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-1.5 py-5 px-4 border-2 border-dashed border-slate-200 hover:border-[#0fa57c] hover:bg-emerald-50/40 rounded-xl transition-all cursor-pointer group"
        >
          <div className="p-2 bg-slate-100 group-hover:bg-[#0fa57c]/10 text-slate-400 group-hover:text-[#0fa57c] rounded-lg transition-colors">
            <Upload size={18} />
          </div>
          <span className="text-xs font-bold text-slate-600 group-hover:text-[#0fa57c]">Tải lên file CV</span>
          <span className="text-[10px] text-slate-400 font-medium">Chấp nhận PDF, DOC, DOCX</span>
        </button>
      )}

      {/* Dòng gán link CV */}
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Hoặc gán link CV</label>
        <div className="relative">
          <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={link}
            onChange={(e) => onLinkChange(e.target.value)}
            placeholder="Dán link CV (VD: https://drive.google.com/...)"
            className={`${fieldClass} pl-9`}
          />
        </div>
      </div>
    </div>
  );
};

const fieldClass =
  'w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-800 outline-none focus:border-[#0fa57c] focus:ring-2 focus:ring-[#0fa57c]/10 transition-all placeholder:text-slate-400 placeholder:font-normal';
