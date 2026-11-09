/**
 * Cầu nối Dự án kinh doanh → /Projects: mỗi mã đã cấp (KD .1, SX .2, outsource có hiệu lực, bảo hành .3) là 1 Project có PakdId.
 * Mã, trạng thái, ClosedDate, PM lấy thẳng từ BusinessProjectContext (một nguồn sự thật — PROJECTS-STATUS-SIMPLIFY 4.2, D46);
 * phần /Projects tự quản (ngân sách, cờ sửa, % hoàn thành, lịch sử…) giữ ở overlay của ProjectsContext.
 */
import { BizProject, bizStatusLabel, codeClosedDate, codeRecordStatus, jiraOf, liveOutsource } from '../business/BusinessProjectContext';
import { PROJECT_TYPE_STAFFING, QProject, S, mkProject } from './projectData';

const RECORD_TO_ID = { Open: S.OPEN, 'In Progress': S.IN_PROGRESS, 'On-hold': S.ON_HOLD, Closed: S.CLOSED } as const;
const TYPE_ID: Record<string, number> = { 'Fixed Cost': 1, 'Time & Material': 2, ODC: 3, 'Cho thuê lao động': PROJECT_TYPE_STAFFING, 'Nội bộ': 5 };
const MAINTENANCE = 4;
const SYS = 'Hệ thống (Dự án kinh doanh)';

/** Trường /Projects chỉ đọc từ Dự án kinh doanh — overlay không ghi đè. */
export const BIZ_OWNED = ['projectCode', 'masterCode', 'pakdId', 'bizStatus', 'statusId', 'closedDate', 'pm'] as const;

export const bizRowId = (bizId: string, code: string) => `${bizId}:${code}`;

type CodeSpec = { code: string; label: string; pm: string; cost: number; typeId: number; created: string; start: string; end: string };

const codesOf = (p: BizProject): CodeSpec[] => {
  if (!p.masterCode || p.status === 'Chờ duyệt mã') return [];
  const typeId = TYPE_ID[p.projectType] ?? 1;
  const issued = p.codeIssuedAt || p.createdAt.slice(0, 10);
  const out: CodeSpec[] = [];
  if (p.businessCode) out.push({ code: p.businessCode, label: 'KD', pm: p.businessPm, cost: p.plannedBusinessCost, typeId, created: issued, start: p.startDate, end: p.endDate });
  if (p.productionCode) out.push({ code: p.productionCode, label: 'SX', pm: p.productionPm, cost: p.plannedProductionCost, typeId, created: issued, start: p.startDate, end: p.endDate });
  liveOutsource(p)
    .filter((o) => o.state === 'Có hiệu lực')
    .forEach((o) => out.push({ code: o.code, label: `Outsource ${o.code}`, pm: o.pm, cost: 0, typeId, created: (o.decidedAt || o.createdAt).slice(0, 10), start: p.startDate, end: p.endDate }));
  const w = p.warranty;
  if (w?.state === 'Đã cấp mã' && w.code) {
    const start = (w.decidedAt || w.requestedAt).slice(0, 10);
    const end = `${Number(start.slice(0, 4)) + 1}${start.slice(4)}`;
    out.push({ code: w.code, label: 'Bảo hành', pm: w.pm || p.salesDirector, cost: 0, typeId: MAINTENANCE, created: start, start, end });
  }
  return out;
};

/** Project của 1 dự án kinh doanh — phần BIZ_OWNED luôn theo trạng thái hiện tại. */
export const bizRows = (biz: BizProject[]): QProject[] =>
  biz.flatMap((p) =>
    codesOf(p).map((c) =>
      mkProject({
        id: bizRowId(p.id, c.code),
        projectCode: c.code,
        masterCode: p.masterCode,
        pakdId: p.id,
        bizStatus: bizStatusLabel(p.status),
        statusId: RECORD_TO_ID[codeRecordStatus(p, c.code)],
        closedDate: codeClosedDate(p, c.code),
        pm: c.pm,
        jiraKey: jiraOf(p, c.code) === 'Đã tạo' ? c.code : undefined,
        projectName: `${p.name} — ${c.label}`,
        department: p.division,
        division: p.division,
        customer: `${p.customerCode} - ${p.customerName}`,
        projectTypeId: c.typeId,
        targetedCost: c.cost || null,
        bac: null,
        actualCost: 0,
        actualStartDate: c.start,
        actualEndDate: c.end,
        plannedComplete: 0,
        actualCompleted: 0,
        budgetStatusId: S.OPEN,
        creationTime: `${c.created}T09:00:00`,
        creator: SYS,
        history: [{ at: `${c.created}T09:00:00`, by: SYS, action: 'Tạo từ Dự án kinh doanh', detail: `Mã tổng ${p.masterCode}` }],
      }),
    ),
  );
