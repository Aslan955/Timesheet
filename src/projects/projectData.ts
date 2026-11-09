/**
 * Màn "Quản lý dự án › Dự án" (/Projects) — dữ liệu mẫu + hàm thuần bám code iMIS.
 * Nguồn: ProjectService.cs, ProjectDetailComponent.razor, ProjectsListComponent.razor, ProjectGeneralComponent.razor, imisConsts.cs.
 * Nghiệp vụ mới (chốt 04/11): /Projects KHÔNG đổi trạng thái, KHÔNG tạo dự án mới; bỏ Closing, bỏ Project point; Closed chỉ xem.
 * Dữ liệu mẫu là giả (tên / mã / khách hàng tự đặt).
 */
import { DIVISIONS } from '../business/BusinessProjectContext';

// ---- StatusIds (imisConsts.cs:33) ----
export const S = {
  OPEN: 1,
  APPROVE_BUDGET: 2,
  IN_PROGRESS: 3,
  ON_HOLD: 4,
  CLOSED: 6,
  DRAFT: 8,
  PENDING_INITIAL: 9,
  REJECTED_INITIAL: 10,
  PENDING_BUDGET: 11,
  REJECTED_BUDGET: 12,
  REQUESTED_EDIT: 16,
  APPROVED_EDIT: 17,
  REJECT_EDIT: 23,
} as const;

// StatusIds.InitializedList — mã dự án ở các trạng thái này không có link
export const INITIALIZED_LIST: number[] = [S.DRAFT, S.PENDING_INITIAL, S.REJECTED_INITIAL];

// ---- StatusNames (imisConsts.cs:95) — tên hiển thị trạng thái ----
export const STATUS_NAME: Record<number, string> = {
  0: '',
  [S.OPEN]: 'Open',
  [S.APPROVE_BUDGET]: 'Approve Budget',
  [S.IN_PROGRESS]: 'In Progress',
  [S.ON_HOLD]: 'On-hold',
  [S.CLOSED]: 'Closed',
  [S.DRAFT]: 'Draft',
  [S.PENDING_INITIAL]: 'Pending Initial',
  [S.REJECTED_INITIAL]: 'Rejected Initial',
  [S.PENDING_BUDGET]: 'Pending Budget',
  [S.REJECTED_BUDGET]: 'Rejected Budget',
  [S.REQUESTED_EDIT]: 'Requested edit',
  [S.APPROVED_EDIT]: 'Approved edit',
  [S.REJECT_EDIT]: 'Reject edit',
};
export const statusName = (id: number | null | undefined) => (id == null ? '(null)' : STATUS_NAME[id] ?? String(id));

// Màu StatusComponent (MapStatusColor.cs)
export const STATUS_COLOR: Record<string, string> = {
  Open: '#17a2b8',
  'In Progress': '#00a9e6',
  'On-hold': '#6f42c1',
  Closed: '#28a745',
};

// Tab trạng thái danh sách — đã bỏ Closing
export const LIST_TABS: { id: number; name: string }[] = [
  { id: 0, name: 'All' },
  { id: S.OPEN, name: 'Open' },
  { id: S.IN_PROGRESS, name: 'In Progress' },
  { id: S.ON_HOLD, name: 'On-hold' },
  { id: S.CLOSED, name: 'Closed' },
];

export const PROJECT_TYPE_STAFFING = 6; // ProjectTypeIds.Staffing
export const PROJECT_TYPES: { id: number; name: string }[] = [
  { id: 1, name: 'Fixed Price' },
  { id: 2, name: 'Time & Material' },
  { id: 3, name: 'ODC' },
  { id: 4, name: 'Maintenance' },
  { id: 5, name: 'Product' },
  { id: PROJECT_TYPE_STAFFING, name: 'Staffing' },
];
export const PRIORITIES = ['High', 'Medium', 'Low'];
export const SIZES = ['Small', 'Medium', 'Large'];
export { DIVISIONS }; // dùng chung danh mục khối với Dự án kinh doanh
export const DOMAINS = ['Fintech', 'Logistics', 'E-commerce', 'Public sector', 'Healthcare'];
export const CUSTOMERS = ['KH01 - Công ty Mẫu An Phát', 'KH02 - Tập đoàn Demo Bình Minh', 'KH03 - Ngân hàng Thử Nghiệm', 'KH04 - Sở Dữ Liệu Mẫu', 'KH05 - Công ty Giả Lập Sao Việt'];
// USERS[0] = PM demo, cũng là PM KD của vài dự án kinh doanh mẫu; phần sau là PM của dữ liệu Dự án kinh doanh
export const USERS = ['Bùi Quang Minh', 'Lê Thị Bình', 'Phạm Quốc Cường', 'Hoàng Minh Đức', 'Vũ Thu Hà', 'Đặng Gia Huy', 'Đặng Thu Trang', 'Hoàng Gia Bảo', 'Nguyễn Đằng Giang', 'Phạm Hữu Trường', 'Lê Hoài Thanh', 'Nguyễn Thị Huyền', 'Trịnh Văn Long', 'Phí Thị Mai', 'Lý Thu Hà', 'Ngô Bá Khá', 'Mai Văn Tùng', 'Vương Đình Khôi', 'Tạ Minh Châu', 'Trần Minh Đức', 'Vũ Thị Lan'];
export const WORK_ORDERS = ['WO-2025-011', 'WO-2025-024', 'WO-2026-003', 'WO-2026-017'];

// ---- Quyền (PermissionNames.cs) dùng ở màn /Projects ----
export const PERMS = {
  Read: 'Projects.Read',
  Edit: 'Projects.Edit',
  Delete: 'Projects.Delete',
  InternalCreate: 'Projects.InternalCreate',
  RequestEditSubmit: 'Projects.RequestEditSubmit',
  RequestEditApproval: 'Projects.RequestEditApproval',
  ResourcesRead: 'Resources.Read',
  WbsRead: 'WBS.Read',
  BudgetRead: 'Budget.Read',
  ScheduleRead: 'Schedule.Read',
  ConfigurationRead: 'Configuration.Read',
  IssueRead: 'Issue.Read',
  CrCreate: 'CR.Create',
  EffortCostRead: 'EffortCost.Read',
  AnalystReportRead: 'AnalystReport.Read',
  // Thao tác trong tab con
  BudgetSubmit: 'Budget.Submit',
  BudgetApprove: 'Budget.Approve',
  BudgetEdit: 'Budget.Edit',
  ResourcesCreate: 'Resources.Create',
  WbsCreate: 'WBS.Create',
  ScheduleEdit: 'Schedule.Edit',
  ConfigurationEdit: 'Configuration.Edit',
  IssueEdit: 'Issue.Edit',
  CrEdit: 'CR.Edit',
} as const;
export type Perm = (typeof PERMS)[keyof typeof PERMS];

// Nhóm quyền để hiện trên bảng chọn quyền
export const PERM_GROUPS: { title: string; perms: { key: Perm; note?: string }[] }[] = [
  {
    title: 'Dự án',
    perms: [
      { key: PERMS.Read, note: 'Vào màn' },
      { key: PERMS.Edit, note: 'Nút Edit / Save' },
      { key: PERMS.Delete, note: 'Thùng rác (Open)' },
      { key: PERMS.RequestEditSubmit, note: 'Request Edit' },
      { key: PERMS.RequestEditApproval, note: 'Approve / Reject Edit' },
    ],
  },
  {
    title: 'Tab chi tiết',
    perms: [
      { key: PERMS.ResourcesRead },
      { key: PERMS.WbsRead },
      { key: PERMS.BudgetRead },
      { key: PERMS.ScheduleRead },
      { key: PERMS.ConfigurationRead },
      { key: PERMS.IssueRead },
      { key: PERMS.CrCreate, note: 'Tab CR' },
      { key: PERMS.EffortCostRead, note: 'Tab Actual Cost' },
      { key: PERMS.AnalystReportRead },
    ],
  },
  {
    title: 'Thao tác trong tab',
    perms: [
      { key: PERMS.BudgetSubmit, note: 'Submit Budget' },
      { key: PERMS.BudgetApprove, note: 'Approve / Reject Budget; nút Approve CR' },
      { key: PERMS.BudgetEdit },
      { key: PERMS.ResourcesCreate, note: 'Request / Allocation Resource' },
      { key: PERMS.WbsCreate, note: 'WBS Add New' },
      { key: PERMS.ScheduleEdit, note: 'Schedule: cả cột Actions' },
      { key: PERMS.ConfigurationEdit },
      { key: PERMS.IssueEdit, note: 'Issue + Release (UI dùng Issue.Edit)' },
      { key: PERMS.CrEdit },
    ],
  },
];

const TAB_PERMS: Perm[] = [
  PERMS.ResourcesRead,
  PERMS.WbsRead,
  PERMS.BudgetRead,
  PERMS.ScheduleRead,
  PERMS.ConfigurationRead,
  PERMS.IssueRead,
  PERMS.CrCreate,
  PERMS.EffortCostRead,
  PERMS.AnalystReportRead,
];

// Vai trò mẫu để demo; viewAll = vai trò trong ProjectVisibility.ViewAllRoles (BOD/SM/PQA/Accountant/Admin)
export interface Persona {
  key: string;
  label: string;
  user: string;
  viewAll: boolean;
  perms: Perm[];
}
export const PERSONAS: Persona[] = [
  {
    key: 'pm',
    label: 'PM (gửi yêu cầu)',
    user: 'Bùi Quang Minh',
    viewAll: false,
    perms: [PERMS.Read, PERMS.Edit, PERMS.RequestEditSubmit, ...TAB_PERMS, PERMS.BudgetSubmit, PERMS.ResourcesCreate, PERMS.WbsCreate, PERMS.ScheduleEdit, PERMS.IssueEdit, PERMS.CrEdit],
  },
  {
    key: 'approver',
    label: 'Người duyệt (PMO/BOD)',
    user: 'Lê Thị Bình',
    viewAll: true,
    perms: [PERMS.Read, PERMS.RequestEditApproval, ...TAB_PERMS, PERMS.BudgetApprove, PERMS.ConfigurationEdit],
  },
  {
    key: 'admin',
    label: 'Admin (đủ quyền)',
    user: 'Quản trị hệ thống',
    viewAll: true,
    perms: Object.values(PERMS) as Perm[],
  },
  {
    key: 'viewer',
    label: 'Chỉ xem (Projects.Read)',
    user: 'Vũ Thu Hà',
    viewAll: false,
    perms: [PERMS.Read],
  },
];

// ---- Bản ghi dự án (VwProject + ProjectDto) ----
export interface Milestone {
  name: string;
  date: string;
  note?: string;
}
export interface HistoryRow {
  at: string;
  by: string;
  action: string;
  detail?: string;
}
export interface QProject {
  id: string;
  projectCode: string;
  masterCode?: string;
  oldProjectCode?: string;
  pakdId?: string; // có ⇒ sinh từ màn Dự án kinh doanh (= id dự án kinh doanh trong prototype)
  bizStatus?: string; // trạng thái dự án kinh doanh hiện tại — nguồn của statusId
  jiraKey?: string; // mã Jira đã tạo
  projectName: string;
  pm: string;
  department: string; // DepartmentSignName
  division: string; // OrganizationId (Division)
  customer: string;
  priority: string;
  size: string;
  projectTypeId: number;
  domain: string;
  workOrder?: string;
  targetedCost: number | null; // Development Cost
  bac: number | null;
  actualCost: number | null;
  actualStartDate: string;
  actualEndDate: string;
  plannedComplete: number | null;
  actualCompleted: number | null;
  statusId: number; // ProjectStatusId — /Projects chỉ đọc
  closedDate?: string; // ClosedDate — dự án Closed cũ có thể trống
  legacyPoints?: boolean; // có dữ liệu Project point cũ ⇒ hiện tab chỉ xem
  editStatusId: number | null; // ProjectEditStatusId (không hiện trên UI thật)
  budgetStatusId: number; // ProjectBugestStatusId
  creationTime: string;
  creator: string;
  members: string[]; // ProjectTeam
  programingLanguage?: string;
  framework?: string;
  database?: string;
  hardwareFlatform?: string;
  tool?: string;
  description?: string;
  milestones: Milestone[];
  history: HistoryRow[];
}

export const projectTypeName = (id: number) => PROJECT_TYPES.find((t) => t.id === id)?.name ?? '';

type Seed = Partial<QProject> & Pick<QProject, 'id' | 'projectCode' | 'projectName' | 'statusId'>;
const mk = (s: Seed): QProject => ({
  pm: USERS[0],
  department: DIVISIONS[0],
  division: DIVISIONS[0],
  customer: CUSTOMERS[0],
  priority: 'Medium',
  size: 'Medium',
  projectTypeId: 1,
  domain: DOMAINS[0],
  targetedCost: 1_200_000_000,
  bac: 950_000_000,
  actualCost: 420_000_000,
  actualStartDate: '2026-02-01',
  actualEndDate: '2026-12-31',
  plannedComplete: 50,
  actualCompleted: 45,
  editStatusId: null,
  budgetStatusId: S.APPROVE_BUDGET,
  creationTime: '2026-01-15T09:00:00',
  creator: USERS[0],
  members: [],
  programingLanguage: 'C#, TypeScript',
  framework: '.NET 8, React',
  database: 'SQL Server',
  hardwareFlatform: 'Cloud VM',
  tool: 'Jira, Git',
  description: '<p>Dự án mẫu phục vụ prototype.</p>',
  milestones: [
    { name: 'Kick-off', date: '2026-02-01' },
    { name: 'UAT', date: '2026-10-15' },
  ],
  history: [],
  ...s,
});
/** Bản ghi mặc định (dùng cả cho dự án sinh từ Dự án kinh doanh — xem bizLink.ts). */
export const mkProject = mk;

// Chỉ dự án tạo tay / nội bộ cũ (không PakdId). Dự án có PakdId sinh từ dữ liệu Dự án kinh doanh (bizLink.ts).
export const SEED_PROJECTS: QProject[] = [
  // Open
  mk({ id: 'p03', projectCode: 'S.2026.KH02.001', projectName: 'Ứng dụng kho vận Bình Minh', statusId: S.OPEN, budgetStatusId: S.OPEN, editStatusId: S.REQUESTED_EDIT, plannedComplete: 20, actualCompleted: 20, pm: USERS[0], customer: CUSTOMERS[1], domain: DOMAINS[1], creationTime: '2026-09-02T08:30:00' }),
  // In Progress
  mk({ id: 'p04', projectCode: 'S.2025.KH03.004', oldProjectCode: 'S.2024.KH03.017', projectName: 'Core banking mẫu — giai đoạn 2', jiraKey: 'CBK2', statusId: S.IN_PROGRESS, editStatusId: S.APPROVED_EDIT, plannedComplete: 65, actualCompleted: 58, pm: USERS[0], customer: CUSTOMERS[2], priority: 'High', size: 'Large', projectTypeId: 2, creationTime: '2025-11-05T14:00:00' }),
  mk({ id: 'p05', projectCode: 'S.2026.KH04.002', projectName: 'Cổng dữ liệu mở Sở Mẫu', statusId: S.IN_PROGRESS, plannedComplete: 95, actualCompleted: 98, pm: USERS[0], department: DIVISIONS[2], division: DIVISIONS[2], customer: CUSTOMERS[3], domain: DOMAINS[3], creationTime: '2026-03-10T09:00:00' }),
  mk({ id: 'p06', projectCode: 'S.2026.KH05.001', projectName: 'Staffing đội QA Sao Việt', statusId: S.IN_PROGRESS, projectTypeId: PROJECT_TYPE_STAFFING, plannedComplete: 40, actualCompleted: 40, pm: USERS[3], customer: CUSTOMERS[4], creationTime: '2026-04-01T09:00:00', members: [USERS[0]] }),
  mk({ id: 'p08', projectCode: 'S.2026.KH01.003', projectName: 'Ví điện tử thử nghiệm', statusId: S.IN_PROGRESS, budgetStatusId: S.PENDING_BUDGET, plannedComplete: 30, actualCompleted: 36, pm: USERS[4], department: DIVISIONS[1], division: DIVISIONS[1], customer: CUSTOMERS[0], creationTime: '2026-06-18T09:00:00' }),
  // On-hold
  mk({ id: 'p10', projectCode: 'S.2025.KH02.009', projectName: 'Tích hợp ERP mẫu', statusId: S.ON_HOLD, plannedComplete: 50, actualCompleted: 47, pm: USERS[0], customer: CUSTOMERS[1], creationTime: '2025-08-01T09:00:00' }),
  // Closed — p11 trước là Closing; p13, p14 dữ liệu cũ chưa có ClosedDate
  mk({ id: 'p11', projectCode: 'S.2025.KH03.002', projectName: 'App ngân hàng số mẫu', statusId: S.CLOSED, closedDate: '2026-09-30', legacyPoints: true, plannedComplete: 100, actualCompleted: 100, pm: USERS[0], customer: CUSTOMERS[2], creationTime: '2025-04-01T09:00:00' }),
  mk({ id: 'p13', projectCode: 'S.2024.KH01.005', projectName: 'Website giới thiệu An Phát', statusId: S.CLOSED, legacyPoints: true, plannedComplete: 100, actualCompleted: 100, pm: USERS[0], customer: CUSTOMERS[0], actualStartDate: '2024-03-01', actualEndDate: '2024-11-30', creationTime: '2024-02-15T09:00:00' }),
  mk({ id: 'p14', projectCode: 'S.2024.KH04.001', projectName: 'Phần mềm một cửa mẫu', statusId: S.CLOSED, plannedComplete: null, actualCompleted: null, pm: USERS[3], customer: CUSTOMERS[3], actualStartDate: '2024-01-10', actualEndDate: '2024-09-30', creationTime: '2024-01-05T09:00:00' }),
];

// ---- Phạm vi xem (ProjectVisibility.ApplyScope, rút gọn): người tạo / PM / thành viên; viewAll thấy hết ----
export const inScope = (p: QProject, persona: Persona) =>
  persona.viewAll || p.creator === persona.user || p.pm === persona.user || p.members.includes(persona.user);

// ---- Đếm tab (GetStatusList) ----
export const statusCounts = (rows: QProject[]) => {
  const m: Record<number, number> = { 0: rows.length };
  LIST_TABS.forEach((t) => t.id && (m[t.id] = rows.filter((p) => p.statusId === t.id).length));
  return m;
};

// ---- Màu dòng (ProjectsListComponent.GetRowColor) ----
export const rowColor = (p: QProject) => {
  const pl = p.plannedComplete;
  const ac = p.actualCompleted;
  if (pl == null || ac == null || ac < pl) return 'red';
  if (pl === ac) return 'black';
  return 'green';
};

// ---- Nguồn trạng thái (hiện cạnh Status ở General; /Projects không có nút đổi trạng thái) ----
export const statusSource = (p: QProject): string => {
  if (!p.pakdId) return 'Dự án tạo tay — giữ nguyên trạng thái';
  const kept = p.statusId === S.CLOSED && p.bizStatus !== 'Đóng' ? ' (mã KD / SX / outsource giữ Closed từ khi Kết thúc — đang giai đoạn bảo hành)' : '';
  return `Trạng thái theo Dự án kinh doanh ${p.masterCode ?? ''}: ${p.bizStatus ?? '—'} ⇒ ${statusName(p.statusId)}${kept}`;
};

// CanAddTab(): khoá sửa ở các tab khi Closed / On-hold (Closed chỉ xem)
export const canAddTab = (p: QProject) => p.statusId !== S.CLOSED && p.statusId !== S.ON_HOLD;

// IsEditInfo: các tab con mở thêm/sửa khi Open hoặc Rejected Budget (tính lúc nạp trang)
export const isEditInfo = (p: QProject) => p.statusId === S.OPEN || p.statusId === S.REJECTED_BUDGET;

// Nút trong tab General (ProjectGeneralComponent.razor:30–51)
export type EditAction = 'approveEdit' | 'rejectEdit' | 'requestEdit' | 'edit';
export const generalButtons = (p: QProject, has: (k: Perm) => boolean): { key: EditAction; label: string }[] => {
  const ce = canAddTab(p);
  const es = p.editStatusId;
  const out: { key: EditAction; label: string }[] = [];
  if (es === S.REQUESTED_EDIT && ce && has(PERMS.RequestEditApproval)) out.push({ key: 'approveEdit', label: 'Approve Edit' }, { key: 'rejectEdit', label: 'Reject Edit' });
  else if (ce && (es == null || es === S.REJECT_EDIT) && has(PERMS.RequestEditSubmit)) out.push({ key: 'requestEdit', label: 'Request Edit' });
  if (ce && es === S.APPROVED_EDIT && has(PERMS.Edit)) out.push({ key: 'edit', label: 'Edit' });
  return out;
};

// ---- Tab chi tiết (ProjectDetailComponent.AddTabs, :568–703) ----
export type TabKey = 'general' | 'resources' | 'wbs' | 'budget' | 'schedule' | 'configuration' | 'issue' | 'cr' | 'release' | 'actualCost' | 'report' | 'point';
export const detailTabs = (p: QProject, has: (k: Perm) => boolean): { key: TabKey; title: string }[] => {
  const staffing = p.projectTypeId === PROJECT_TYPE_STAFFING;
  const t: { key: TabKey; title: string }[] = [{ key: 'general', title: 'General' }];
  if (has(PERMS.ResourcesRead)) t.push({ key: 'resources', title: 'Resources' });
  if (!staffing) {
    if (has(PERMS.WbsRead)) t.push({ key: 'wbs', title: 'WBS' });
    if (has(PERMS.BudgetRead)) t.push({ key: 'budget', title: 'Budget' });
    if (has(PERMS.ScheduleRead)) t.push({ key: 'schedule', title: 'Schedule' });
  }
  if (has(PERMS.ConfigurationRead)) t.push({ key: 'configuration', title: 'Configuration' });
  if (has(PERMS.IssueRead)) t.push({ key: 'issue', title: 'Issue' });
  if (has(PERMS.CrCreate)) t.push({ key: 'cr', title: 'CR' });
  if (!staffing) {
    t.push({ key: 'release', title: 'Release' }); // không gác quyền
    if (has(PERMS.EffortCostRead)) t.push({ key: 'actualCost', title: 'Actual Cost' });
    if (has(PERMS.AnalystReportRead)) t.push({ key: 'report', title: 'Analyst & Report' });
  }
  if (p.legacyPoints) t.push({ key: 'point', title: 'Project point' }); // chỉ xem dữ liệu điểm cũ
  return t;
};

// ---- Service (ProjectService.cs) — kiểm quyền [AbpAuthorize] + phạm vi ghi (CheckCanViewProject) ----
export const MSG = {
  actionRejected: 'Thao tác không thực hiện được: dự án nằm ngoài phạm vi của bạn hoặc không tồn tại.',
  bizOwned: 'Dự án sinh từ Dự án kinh doanh — không xoá ở màn này.',
  editNotApproved: 'Dự án chưa được duyệt sửa. Vui lòng gửi yêu cầu sửa và chờ phê duyệt.',
  codeExists: 'Mã dự án đã tồn tại.',
  noAuth: 'Bạn không có quyền thực hiện thao tác này (AbpAuthorize).',
};
export interface Ctx {
  persona: Persona;
  has: (k: Perm) => boolean;
  now: string;
}
export type SvcResult = { ok: true; project: QProject } | { ok: false; message: string };

const auth = (ctx: Ctx, ...any: Perm[]) => any.some((k) => ctx.has(k));
const log = (p: QProject, ctx: Ctx, action: string, detail?: string): QProject => ({
  ...p,
  history: [{ at: ctx.now, by: ctx.persona.user, action, detail }, ...p.history],
});
const guard = (p: QProject, ctx: Ctx, perms: Perm[], fn: () => QProject): SvcResult => {
  if (!auth(ctx, ...perms)) return { ok: false, message: MSG.noAuth };
  if (!inScope(p, ctx.persona)) return { ok: false, message: MSG.actionRejected };
  return { ok: true, project: fn() };
};

export const svc = {
  // RequestEdit :1134 / ApproveEdit :1158 / RejectEdit :1189
  requestEdit: (p: QProject, ctx: Ctx) => guard(p, ctx, [PERMS.RequestEditSubmit], () => log({ ...p, editStatusId: S.REQUESTED_EDIT }, ctx, 'Request Edit', 'gửi mail')),
  approveEdit: (p: QProject, ctx: Ctx) => guard(p, ctx, [PERMS.RequestEditApproval], () => log({ ...p, editStatusId: S.APPROVED_EDIT }, ctx, 'Approve Edit', 'gửi mail')),
  rejectEdit: (p: QProject, ctx: Ctx) => guard(p, ctx, [PERMS.RequestEditApproval], () => log({ ...p, editStatusId: S.REJECT_EDIT }, ctx, 'Reject Edit', 'gửi mail')),
  // Ngân sách không đổi ProjectStatusId (mọi dự án)
  // Budget :1015 RequestApproveBudget
  submitBudget: (p: QProject, ctx: Ctx) =>
    guard(p, ctx, [PERMS.BudgetSubmit], () => log({ ...p, budgetStatusId: S.PENDING_BUDGET }, ctx, 'Submit Budget', 'Budget = Pending Budget · gửi mail')),
  // ApproveBudget :1246 — ActualCost = tổng Amount
  approveBudget: (p: QProject, ctx: Ctx, budgetSum: number) =>
    guard(p, ctx, [PERMS.BudgetApprove], () => log({ ...p, budgetStatusId: S.APPROVE_BUDGET, actualCost: budgetSum }, ctx, 'Approve Budget', `ActualCost = ${money(budgetSum)} · gửi mail`)),
  // RejectBudget :1310
  rejectBudget: (p: QProject, ctx: Ctx) =>
    guard(p, ctx, [PERMS.BudgetApprove], () => log({ ...p, budgetStatusId: S.REJECTED_BUDGET }, ctx, 'Reject Budget', 'Budget = Rejected Budget · gửi mail')),
  // RequestEditBudget :1211 / ApproveEditBudget :1231
  requestEditBudget: (p: QProject, ctx: Ctx) => guard(p, ctx, [PERMS.BudgetSubmit, PERMS.BudgetEdit], () => log({ ...p, budgetStatusId: S.REQUESTED_EDIT }, ctx, 'Request Edit Budget')),
  approveEditBudget: (p: QProject, ctx: Ctx) => guard(p, ctx, [PERMS.BudgetApprove], () => log({ ...p, budgetStatusId: S.APPROVED_EDIT }, ctx, 'Approve Edit Budget')),
  // Delete :816 — Projects.Delete | Bidding.Delete | Projects.InternalCreate
  canDelete: (p: QProject, ctx: Ctx): SvcResult =>
    !auth(ctx, PERMS.Delete, PERMS.InternalCreate)
      ? { ok: false, message: MSG.noAuth }
      : !inScope(p, ctx.persona)
        ? { ok: false, message: MSG.actionRejected }
        : p.pakdId
          ? { ok: false, message: MSG.bizOwned } // 🔶 prototype: mã của dự án kinh doanh không xoá ở /projects
          : { ok: true, project: p },
};

// Đổi PM khi Save: có PakdId ⇒ đồng bộ về Dự án kinh doanh (mã tổng); có mã Jira ⇒ Jira update_pm
export const pmSync = (old: QProject, next: QProject) => {
  const changed = old.pm !== next.pm;
  return {
    bizCode: changed && old.pakdId ? old.masterCode ?? old.pakdId : null,
    jiraKey: changed ? old.jiraKey ?? null : null,
  };
};

// Update :522 — phạm vi → trùng mã → phải APPROVED_EDIT → lưu và xoá cờ sửa; đổi PM ghi thêm dòng đồng bộ
export const svcUpdate = (all: QProject[], old: QProject, next: QProject, ctx: Ctx): SvcResult => {
  if (!auth(ctx, PERMS.Edit)) return { ok: false, message: MSG.noAuth };
  if (!inScope(old, ctx.persona)) return { ok: false, message: MSG.actionRejected };
  if (all.some((x) => x.projectCode === next.projectCode && x.id !== next.id)) return { ok: false, message: MSG.codeExists };
  if (old.editStatusId !== S.APPROVED_EDIT) return { ok: false, message: MSG.editNotApproved };
  const sync = pmSync(old, next);
  let p = log({ ...next, editStatusId: null }, ctx, 'Update', 'ProjectEditStatusId = null');
  if (sync.bizCode) p = log(p, ctx, `Đồng bộ PM về Dự án kinh doanh ${sync.bizCode}`, `PM: ${old.pm} → ${next.pm}`);
  if (sync.jiraKey) p = log(p, ctx, 'Jira update_pm', `${sync.jiraKey}: lead = ${next.pm}`);
  return { ok: true, project: p };
};

// ---- Định dạng ----
export const money = (v: number | null | undefined) => (v == null ? '' : Math.round(v).toLocaleString('vi-VN'));
export const dmy = (iso: string | undefined) => {
  if (!iso) return '';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
};
export const nowIso = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:00`;
};
