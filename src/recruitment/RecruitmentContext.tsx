/**
 * Recruitment store (Yêu cầu tuyển dụng - IDRequest) dùng chung toàn hệ thống.
 *
 * Là nguồn dữ liệu duy nhất cho:
 *  - Màn "Yêu cầu tuyển dụng" (RecruitmentRequestPage) — CRUD đầy đủ.
 *  - Ô chọn IDRequest ở màn ứng viên (RequestTabContent) — đọc requestOptions/findRequest.
 */
import React, { createContext, useContext, useMemo, useState } from 'react';

// ==========================================================================
// Danh mục dropdown (theo file IDrequest.xlsx)
// ==========================================================================
export const RR_PRIORITIES = ['Critical', 'High', 'Medium', 'Low'] as const;
export type RRPriority = (typeof RR_PRIORITIES)[number];

export const RR_STATUSES = [
  'Đang chờ phê duyệt',
  'Đang tuyển',
  'Đã tuyển _ Chờ nhận việc',
  'Đóng',
  'Tạm dừng',
  'Hủy',
] as const;
export type RRStatus = (typeof RR_STATUSES)[number];

// Trạng thái được coi là "kết thúc" → yêu cầu nhập ngày kết thúc
export const ENDING_STATUSES: RRStatus[] = ['Đã tuyển _ Chờ nhận việc', 'Đóng', 'Hủy'];

export const RR_BLOCKS = [
  'BFSI', 'BO', 'Data', 'DevOps', 'G1', 'G2', 'G3', 'G4', 'GPDV', 'Hcare',
  'Operations', 'PQA', 'Staffing', 'Đấu thầu',
] as const;

export const RR_POSITIONS = [
  'CEO', 'Vice CEO', 'COO', 'CTO', 'CDO', 'Chief Accountant', 'Head of BA Department',
  'Head of Department', 'Head of Division', 'Delivery Director', 'Sales Director',
  'Project Manager', 'Delivery Manager', 'Solution Architect', 'Pre-Sale', 'Account Manager',
  'Sales Support', 'Techlead', 'Technical Project Manager', 'Software Developer',
  'Software Implementation', 'Software Implementation Leader', 'Business Analyst',
  'Business Analyst Leader', 'Business Analyst Manager', 'Product Designer', 'Product Owner',
  'Test Leader', 'Test Manager', 'Tester', 'Data Analyst', 'Data Analyst Lead', 'Data Engineer',
  'Data Engineer Lead', 'Data Engineer Expert', 'Project Support', 'IT Support', 'DevOps Engineer',
  'Assistant', 'UI/UX Designer', 'AI Workflow Engineer', 'Bidding Specialist', 'Accountant',
  'Employee Experience & Employer Branding', 'External Relations Specialist', 'Internal Communication',
  'PQA', 'PQA Manager', 'Content Marketing', 'Content Marketing Strategist', 'Marketing Operation',
] as const;

export const RR_SKILLS = [
  'Vận hành', 'Đấu thầu', 'HR', 'C&B', 'HCTH', 'TA', 'Legal', 'Marcom', 'Design (Marcom)',
  'People&Culture', 'IC&EB', 'Tax Accountant', 'CTO (Toàn Cty)', 'Đối ngoại', 'ITsupport',
  'IT Helpdesk', 'SEO', 'Design (MKT)', 'Sales', 'SalesSupport', 'Presales', 'AM', 'AI Workflow',
  'BA', 'DBA', 'DE', 'DA', 'BI', 'SA', '.NET', 'Java', 'NodeJS', 'Python', 'PHP', 'ReactJS',
  'Angular', 'Javascripts', 'Typescript', 'iOS', 'Fullter', 'React Native', 'Fullstack', 'DevOps',
  'CTO (Khối)', 'UIUX', 'PM', 'DM', 'Test', 'Admin (Khối)',
] as const;

export const RR_LEVELS = [
  'Intern', 'Fresher', 'Junior', 'Middle', 'Senior', 'Lead', 'Manager', 'Head', 'Director', 'Chief',
] as const;

export const RR_TA_MEMBERS = [
  'MenTT', 'NhuPTK', 'HienNPM', 'HangLT', 'XuanDTT', 'LyTH1', 'HungNV4', 'SenNT',
] as const;

export type SlaStatus = 'New' | 'Near Deadline' | 'Overdue' | '';

// ==========================================================================
// Kiểu dữ liệu 1 Yêu cầu tuyển dụng
// ==========================================================================
export interface RecruitmentRequestRow {
  id: string;               // khoá nội bộ
  priority: RRPriority | '';
  requestId: string;        // R-YYYY-<Khối>-NNN (tự sinh) hoặc mã cũ (REQ-xxx)
  status: RRStatus | '';
  block: string;
  position: string;
  skill: string;
  level: string;
  taPic: string;
  taSupport: string;
  dateReceived: string;     // yyyy-mm-dd
  endDate: string;          // ngày kết thúc (khi trạng thái kết thúc)
  note: string;
  headcount: number | '';   // Số lượng ứng viên cần
}

// Bản rút gọn cho ô chọn IDRequest ở màn ứng viên
export interface RequestOption {
  id: string;
  position: string;
  level: string;
  block: string;
}

// ==========================================================================
// Helper: tự sinh Request ID, tính số ngày chạy job & trạng thái SLA
// ==========================================================================
export const genRequestId = (block: string, dateStr: string, existing: RecruitmentRequestRow[]): string => {
  const year = (dateStr ? new Date(dateStr) : new Date()).getFullYear();
  const blk = block || 'NA';
  const prefix = `R-${year}-${blk}-`;
  const nums = existing
    .map((r) => r.requestId)
    .filter((rid) => rid.startsWith(prefix))
    .map((rid) => parseInt(rid.slice(prefix.length), 10) || 0);
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
};

// Số ngày đã chạy job — chỉ tính với job "Đang tuyển"
export const computeDaysRunning = (r: RecruitmentRequestRow): number | null => {
  if (r.status !== 'Đang tuyển' || !r.dateReceived) return null;
  const d = new Date(r.dateReceived);
  if (isNaN(d.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
};

// Trạng thái SLA suy ra từ số ngày: New < 14, Near Deadline 14–30, Overdue > 30
export const computeSla = (days: number | null): SlaStatus => {
  if (days == null) return '';
  if (days < 14) return 'New';
  if (days <= 30) return 'Near Deadline';
  return 'Overdue';
};

// ==========================================================================
// Dữ liệu mẫu (bao gồm các request cũ REQ-001..010 để hồ sơ ứng viên sẵn có vẫn khớp)
// ==========================================================================
const SEED: RecruitmentRequestRow[] = [
  { id: 'RR-REQ-001', requestId: 'REQ-001', priority: 'Critical', status: 'Đang tuyển', block: 'G1', position: 'Software Developer', skill: 'Java', level: 'Senior', taPic: 'MenTT', taSupport: 'NhuPTK', dateReceived: '2026-08-12', endDate: '', note: 'Ưu tiên ứng viên có kinh nghiệm banking.', headcount: 3 },
  { id: 'RR-REQ-002', requestId: 'REQ-002', priority: 'High', status: 'Đang chờ phê duyệt', block: 'BFSI', position: 'Business Analyst', skill: 'BA', level: 'Fresher', taPic: 'HungNV4', taSupport: 'SenNT', dateReceived: '2026-08-18', endDate: '', note: '', headcount: 2 },
  { id: 'RR-REQ-003', requestId: 'REQ-003', priority: 'Medium', status: 'Đang tuyển', block: 'G2', position: 'Data Analyst', skill: 'DA', level: 'Senior', taPic: 'HienNPM', taSupport: 'HangLT', dateReceived: '2026-07-20', endDate: '', note: '', headcount: 2 },
  { id: 'RR-REQ-004', requestId: 'REQ-004', priority: 'Low', status: 'Tạm dừng', block: 'G1', position: 'Product Designer', skill: 'UIUX', level: 'Junior', taPic: 'XuanDTT', taSupport: 'LyTH1', dateReceived: '2026-07-01', endDate: '', note: '', headcount: 1 },
  { id: 'RR-REQ-005', requestId: 'REQ-005', priority: 'Medium', status: 'Đang tuyển', block: 'G3', position: 'IT Support', skill: 'ITsupport', level: 'Fresher', taPic: 'LyTH1', taSupport: 'MenTT', dateReceived: '2026-06-15', endDate: '', note: '', headcount: 1 },
  { id: 'RR-REQ-006', requestId: 'REQ-006', priority: 'High', status: 'Đang tuyển', block: 'G2', position: 'Delivery Manager', skill: 'DM', level: 'Manager', taPic: 'SenNT', taSupport: 'HungNV4', dateReceived: '2026-07-10', endDate: '', note: '', headcount: 1 },
  { id: 'RR-REQ-007', requestId: 'REQ-007', priority: 'Low', status: 'Đã tuyển _ Chờ nhận việc', block: 'G4', position: 'Accountant', skill: 'Tax Accountant', level: 'Junior', taPic: 'HangLT', taSupport: 'NhuPTK', dateReceived: '2026-05-20', endDate: '2026-07-30', note: 'Đã có offer.', headcount: 1 },
  { id: 'RR-REQ-008', requestId: 'REQ-008', priority: 'Critical', status: 'Đang chờ phê duyệt', block: 'G3', position: 'CTO', skill: 'CTO (Toàn Cty)', level: 'Chief', taPic: 'MenTT', taSupport: 'XuanDTT', dateReceived: '2026-08-05', endDate: '', note: '', headcount: 1 },
  { id: 'RR-REQ-009', requestId: 'REQ-009', priority: 'High', status: 'Đang tuyển', block: 'BFSI', position: 'DevOps Engineer', skill: 'DevOps', level: 'Senior', taPic: 'XuanDTT', taSupport: 'LyTH1', dateReceived: '2026-06-25', endDate: '', note: '', headcount: 2 },
  { id: 'RR-REQ-010', requestId: 'REQ-010', priority: 'Medium', status: 'Đang tuyển', block: 'G4', position: 'Software Developer', skill: 'NodeJS', level: 'Middle', taPic: 'NhuPTK', taSupport: 'HienNPM', dateReceived: '2026-08-08', endDate: '', note: '', headcount: 2 },
];

interface RecruitmentContextValue {
  requests: RecruitmentRequestRow[];
  requestOptions: RequestOption[];
  findRequest: (requestId: string) => RequestOption | undefined;
  addRequest: (draft: RecruitmentRequestRow) => string;   // trả về requestId đã sinh
  updateRequest: (draft: RecruitmentRequestRow) => void;
  removeRequest: (id: string) => void;
}

const RecruitmentContext = createContext<RecruitmentContextValue | null>(null);

export const RecruitmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<RecruitmentRequestRow[]>(() => SEED.map((r) => ({ ...r })));

  const addRequest: RecruitmentContextValue['addRequest'] = (draft) => {
    const id = `RR-${Date.now()}`;
    const requestId = genRequestId(draft.block, draft.dateReceived, requests);
    setRequests((prev) => [{ ...draft, id, requestId }, ...prev]);
    return requestId;
  };

  const updateRequest: RecruitmentContextValue['updateRequest'] = (draft) => {
    setRequests((prev) => {
      const original = prev.find((r) => r.id === draft.id);
      let requestId = draft.requestId;
      if (original) {
        const yearChanged =
          new Date(original.dateReceived).getFullYear() !== new Date(draft.dateReceived).getFullYear();
        // Chỉ tự sinh lại mã cho request theo chuẩn mới (R-...) khi đổi khối/năm; giữ nguyên mã cũ REQ-xxx
        if (requestId.startsWith('R-') && (original.block !== draft.block || yearChanged)) {
          requestId = genRequestId(draft.block, draft.dateReceived, prev.filter((r) => r.id !== draft.id));
        }
      }
      return prev.map((r) => (r.id === draft.id ? { ...draft, requestId } : r));
    });
  };

  const removeRequest: RecruitmentContextValue['removeRequest'] = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const requestOptions = useMemo<RequestOption[]>(
    () => requests.map((r) => ({ id: r.requestId, position: r.position, level: r.level, block: r.block })),
    [requests],
  );

  const findRequest = (requestId: string) => requestOptions.find((o) => o.id === requestId);

  const value = useMemo<RecruitmentContextValue>(
    () => ({ requests, requestOptions, findRequest, addRequest, updateRequest, removeRequest }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [requests, requestOptions],
  );

  return <RecruitmentContext.Provider value={value}>{children}</RecruitmentContext.Provider>;
};

export function useRecruitment(): RecruitmentContextValue {
  const ctx = useContext(RecruitmentContext);
  if (!ctx) throw new Error('useRecruitment must be used within a RecruitmentProvider');
  return ctx;
}
