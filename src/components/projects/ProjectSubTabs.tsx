/**
 * Các tab con của chi tiết dự án (trừ General) — mức "tab có gì": cột, nút, điều kiện hiện nút.
 * Tham số giống code: View = IsEditInfo (Open / Rejected Budget), CanEdit = CanAddTab().
 * Lưu ý code: các tab hiện "Add New" khi !View ⇒ chỉ khi dự án KHÔNG ở Open/Rejected Budget.
 */
import React, { useState } from 'react';
import { Ban, Check, Pencil } from 'lucide-react';
import { Btn, erp } from '../erp/Erp';
import { useProjects } from '../../projects/ProjectsContext';
import { PERMS, QProject, S, TabKey, USERS, canAddTab, dmy, isEditInfo, money, statusName, svc } from '../../projects/projectData';
import { ConfirmDialog } from './ProjectPopups';
import { MiniGrid, StatusPill } from './ProjectUi';

const Note: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="mb-2 text-[11.5px] text-slate-500 italic">{children}</p>;

export const SubTab: React.FC<{ tab: TabKey; p: QProject }> = ({ tab, p }) => {
  const { has, toast } = useProjects();
  const View = isEditInfo(p);
  const CanEdit = canAddTab(p);
  const stub = (what: string) => toast('info', `${what} — popup chỉ dựng khung trong prototype`);
  const act = (name: string) => (w: string) => stub(`${name}: ${w === 'add' ? 'Add New' : w}`);

  switch (tab) {
    case 'resources':
      return <ResourcesTab p={p} View={View} CanEdit={CanEdit} stub={stub} />;
    case 'wbs':
      return (
        <>
          <Note>Add New: !View &amp;&amp; WBS.Create &amp;&amp; CanEdit. Icon Add child / Edit / Delete hiện khi CanEdit HOẶC có quyền (điều kiện !CanEdit &amp;&amp; !HasX).</Note>
          <MiniGrid
            cols={['No.', 'Code', 'Control Account/ Workpackage', 'Complexity', 'Is Function Task', 'Estimate', 'Useable (%)', 'Total', 'Status']}
            rows={[
              ['1', <b key="c">1</b>, 'Phân tích yêu cầu', 'Medium', '', '120', '80', '96', <StatusPill key="s" name="In Progress" />],
              ['2', <span key="c" className="pl-4">1.1</span>, 'Đặc tả use case', 'Simple', '✓', '40', '100', '40', <StatusPill key="s" name="Completed" />],
              ['3', <b key="c">2</b>, 'Phát triển', 'Complex', '', '600', '85', '510', <StatusPill key="s" name="To Do" />],
            ]}
            addNew={!View && has(PERMS.WbsCreate) && CanEdit}
            actions={{ view: true, edit: CanEdit || has(PERMS.WbsCreate), del: CanEdit || has(PERMS.WbsCreate) }}
            footer={
              <>
                <td className={erp.td} colSpan={5}>Sum</td>
                <td className={`${erp.td} ${erp.num}`}>760</td>
                <td className={erp.td} />
                <td className={`${erp.td} ${erp.num}`}>646</td>
                <td className={erp.td} colSpan={2} />
              </>
            }
            onAction={act('WBS')}
          />
        </>
      );
    case 'budget':
      return <BudgetTab p={p} View={View} CanEdit={CanEdit} />;
    case 'schedule':
      return (
        <>
          <Note>Cả cột Actions (kể cả View) chỉ hiện khi có Schedule.Edit; Add New: !View &amp;&amp; Schedule.Edit &amp;&amp; CanEdit.</Note>
          <MiniGrid
            cols={['Milestone', 'PIC', 'Priority', 'Start Date', 'EndDate']}
            rows={[
              [<b key="m">Sprint 1</b>, USERS[2], 'High', '02/03/2026', '16/03/2026'],
              [<span key="m" className="pl-4">Demo khách hàng</span>, USERS[0], 'Medium', '16/03/2026', '16/03/2026'],
            ]}
            addNew={!View && has(PERMS.ScheduleEdit) && CanEdit}
            actions={has(PERMS.ScheduleEdit) ? { view: true, edit: CanEdit, del: CanEdit } : null}
            onAction={act('Schedule')}
          />
        </>
      );
    case 'configuration':
      return (
        <>
          <Note>Không có toolbar / Add New (AddNew() là code chết). Edit / Delete: Configuration.Edit, không xét trạng thái.</Note>
          <MiniGrid
            toolbar={false}
            cols={['#', 'Item', 'Link', 'Version', 'Update Date', 'Note']}
            rows={[
              ['1', 'Jira', <span key="l" className="text-[#1f5fa8] underline">jira.example/PRJ</span>, '', dmy(p.creationTime), ''],
              ['2', 'Sharepoint', <span key="l" className="text-[#1f5fa8] underline">sharepoint.example/prj</span>, '', dmy(p.creationTime), ''],
              ['3', 'Source code', <span key="l" className="text-[#1f5fa8] underline">git.example/prj</span>, 'v1.0', dmy(p.creationTime), ''],
            ]}
            actions={{ view: true, edit: has(PERMS.ConfigurationEdit), del: has(PERMS.ConfigurationEdit) }}
            onAction={act('Configuration')}
          />
        </>
      );
    case 'issue':
      return (
        <>
          <Note>Cột Actions chỉ hiện khi dự án Open / Rejected Budget; Add New: !View &amp;&amp; Issue.Edit (ngược nhau — xem báo cáo).</Note>
          <MiniGrid
            cols={['#', 'Issue ID', 'Issue Description', 'Root Cause', 'Issue Owner', 'Create Date', 'Priority', 'Source', 'Status']}
            rows={[['1', 'ISS-01', 'Chậm môi trường UAT', 'Hạ tầng khách', USERS[0], '12/05/2026', 'High', 'Major', <StatusPill key="s" name="Open" />]]}
            addNew={!View && has(PERMS.IssueEdit)}
            actions={View ? { view: CanEdit, edit: CanEdit && has(PERMS.IssueEdit), del: CanEdit && has(PERMS.IssueEdit) } : null}
            onAction={act('Issue')}
          />
        </>
      );
    case 'cr':
      return (
        <>
          <Note>Cột Actions chỉ khi Open / Rejected Budget. Approve / Reject (CR đang Requested) gác bằng Budget.Approve ở UI, service đòi CR.Approve.</Note>
          <MiniGrid
            cols={['#', 'Description', 'PIC', 'Identifyed Date', 'Type', 'Priority', 'Source', 'Status']}
            rows={[['1', 'Bổ sung báo cáo tồn kho', USERS[2], '20/06/2026', 'Scope', 'Medium', 'Customer', <StatusPill key="s" name="Requested" />]]}
            addNew={!View && has(PERMS.CrEdit) && CanEdit}
            actions={View ? { view: true, edit: has(PERMS.CrEdit), del: has(PERMS.CrEdit) } : null}
            extraActions={View && has(PERMS.BudgetApprove) ? <span className="ml-2 flex gap-1"><Btn icon={Check} onClick={() => stub('CR Approve')}>Approve</Btn><Btn icon={Ban} onClick={() => stub('CR Reject (ghi chú bị bỏ)')}>Reject</Btn></span> : null}
            onAction={act('CR')}
          />
        </>
      );
    case 'release':
      return (
        <>
          <Note>Tab không gác quyền đọc. Add New / Edit / Delete gác bằng Issue.Edit (service đòi ReleaseNote.*). Cột Actions chỉ khi Open / Rejected Budget.</Note>
          <MiniGrid
            cols={['#', 'Feature', 'Sprint', 'Date', 'Criterial', 'Goal', 'Status']}
            rows={[['1', 'Đăng nhập SSO', 'Sprint 2', '30/04/2026', 'Pass UAT', 'Go-live nội bộ', <StatusPill key="s" name="Released" />]]}
            addNew={!View && has(PERMS.IssueEdit) && CanEdit}
            actions={View ? { view: true, edit: has(PERMS.IssueEdit) && CanEdit, del: has(PERMS.IssueEdit) && CanEdit } : null}
            onAction={act('Release')}
          />
        </>
      );
    case 'actualCost': {
      const showAct = p.statusId === S.OPEN || p.statusId === S.REJECTED_BUDGET || p.statusId === S.IN_PROGRESS;
      return (
        <>
          <Note>CanEdit truyền cứng true. Add New: !View &amp;&amp; Projects.Edit. Cột Actions khi Open / Rejected Budget / In Progress (hoặc PMO/Admin).</Note>
          <MiniGrid
            cols={['#', 'Date', 'Actual Cost', 'Created Date', 'Updated Date', 'Note']}
            rows={[
              ['1', '04/2026', <span key="v" className={erp.num}>{money(120_000_000)}</span>, '05/05/2026', '05/05/2026', ''],
              ['2', '05/2026', <span key="v" className={erp.num}>{money(135_500_000)}</span>, '04/06/2026', '06/06/2026', 'Điều chỉnh OT'],
            ]}
            addNew={!View && has(PERMS.Edit)}
            actions={showAct ? { view: true, edit: has(PERMS.Edit), del: has(PERMS.Edit) } : null}
            footer={
              <>
                <td className={erp.td} colSpan={2}>Sum</td>
                <td className={`${erp.td} ${erp.num}`}>{money(255_500_000)}</td>
                <td className={erp.td} colSpan={showAct ? 4 : 3} />
              </>
            }
            onAction={act('Actual Cost')}
          />
        </>
      );
    }
    case 'report':
      return <ReportTab p={p} View={View} CanEdit={CanEdit} stub={stub} />;
    case 'point':
      return <PointTab />;
    default:
      return null;
  }
};

const ResourcesTab: React.FC<{ p: QProject; View: boolean; CanEdit: boolean; stub: (s: string) => void }> = ({ p, View, CanEdit, stub }) => {
  const { has } = useProjects();
  const [type, setType] = useState<1 | 2 | 3>(2);
  const btn = !View && CanEdit && has(PERMS.ResourcesCreate);
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <select value={type} onChange={(e) => setType(Number(e.target.value) as 1 | 2 | 3)} className={`${erp.input} w-40`}>
          <option value={1}>Requested</option>
          <option value={2}>Plan</option>
          <option value={3}>Actual</option>
        </select>
        {btn && type === 1 && <Btn variant="primary" onClick={() => stub('Request Resource')}>Request Resource</Btn>}
        {btn && type === 2 && (
          <>
            <Btn variant="primary" onClick={() => stub('Allocation Resource')}>Allocation Resource</Btn>
            <Btn onClick={() => stub('SyncDevops — "Sync project to DevOps?" (quyền Sync_Devops)')}>SyncDevops</Btn>
          </>
        )}
      </div>
      <Note>Nút chỉ hiện khi !View &amp;&amp; CanEdit (dự án không Open / Rejected Budget và chưa On-hold / Closed).</Note>
      {type === 1 ? (
        <MiniGrid
          toolbar={false}
          cols={['#', 'Request ID', 'Amount', 'Level', 'Project Effort', 'Role', 'Start Date', 'End Date', 'Status']}
          rows={[['1', 'REQ-001', '2', 'Senior', '100%', 'Developer', '01/03/2026', '30/09/2026', <StatusPill key="s" name="Requested" />]]}
          actions={View ? null : { view: true, edit: CanEdit, del: CanEdit }}
          onAction={(w) => stub(`Resource request: ${w}`)}
        />
      ) : (
        <MiniGrid
          toolbar={false}
          cols={[
            '#',
            'Member Name',
            'Type',
            'Department',
            'Role',
            'Level',
            'Billable Effort %',
            'Plan Effort %',
            'Tech Stack',
            'Plan Start Date',
            'Plan End Date',
            ...(type === 3 ? ['Actual Effort %', 'Actual Start Date', 'Actual End Date', 'Jira Status'] : []),
          ]}
          rows={[p.pm, ...p.members, USERS[5]].filter(Boolean).map((u, i) => [
            String(i + 1),
            u,
            'Internal',
            p.department,
            i === 0 ? 'PM' : 'Developer',
            'Middle',
            '100',
            '100',
            '.NET',
            dmy(p.actualStartDate),
            dmy(p.actualEndDate),
            ...(type === 3 ? ['92', dmy(p.actualStartDate), '', 'Active'] : []),
          ])}
          actions={View ? null : { edit: true, del: true }}
          onAction={(w) => stub(`Team member: ${w}`)}
        />
      )}
    </>
  );
};

const BUDGET_ROWS = [
  { type: 'Labor', desc: 'Chi phí nhân sự', rate: 25_000_000, qty: 30, note: '' },
  { type: 'Outsource', desc: 'Thuê ngoài kiểm thử', rate: 15_000_000, qty: 6, note: '' },
  { type: 'Travel', desc: 'Công tác onsite', rate: 5_000_000, qty: 4, note: 'Dự kiến' },
  { type: 'Other', desc: 'Bản quyền công cụ', rate: 12_000_000, qty: 1, note: '' },
];

const BudgetTab: React.FC<{ p: QProject; View: boolean; CanEdit: boolean }> = ({ p, View, CanEdit }) => {
  const { has, ctx, apply } = useProjects();
  const [confirm, setConfirm] = useState<null | { msg: string; run: () => void }>(null);
  const bs = p.budgetStatusId;
  const sum = BUDGET_ROWS.reduce((s, r) => s + r.rate * r.qty, 0);
  const showEditCol = p.statusId === S.OPEN || p.statusId === S.REJECTED_BUDGET || bs === S.APPROVED_EDIT;
  const ask = (msg: string, run: () => void) => setConfirm({ msg, run });
  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-[12px] text-slate-500">
          ProjectBugestStatusId: <b className="text-slate-700">{statusName(bs)}</b>
        </span>
        {(bs === S.APPROVED_EDIT || bs === S.OPEN || bs === S.REJECTED_BUDGET) && CanEdit && has(PERMS.BudgetSubmit) && (
          <Btn variant="primary" onClick={() => ask('Are you sure you want to Submit this Budget?', () => apply(svc.submitBudget(p, ctx()), 'Approve Budget successfully!'))}>Submit Budget</Btn>
        )}
        {bs === S.PENDING_BUDGET && has(PERMS.BudgetApprove) && (
          <>
            <Btn variant="primary" icon={Check} onClick={() => ask('Are you sure you want to Approve this Budget?', () => apply(svc.approveBudget(p, ctx(), sum), 'Approve Budget successfully!'))}>
              Approve Budget
            </Btn>
            <Btn variant="danger" icon={Ban} onClick={() => ask('Are you sure you want to Reject this Budget?', () => apply(svc.rejectBudget(p, ctx()), 'Reject Budget successfully!'))}>
              Reject Budget
            </Btn>
          </>
        )}
        {bs === S.REQUESTED_EDIT && CanEdit ? (
          <Btn variant="primary" onClick={() => ask('Are you sure you want to approve edit this Project?', () => apply(svc.approveEditBudget(p, ctx()), 'Approve Edit successfully!'))}>Approve Edit</Btn>
        ) : (
          CanEdit && bs === S.APPROVE_BUDGET && <Btn variant="primary" onClick={() => ask('Are you sure you want to request edit this Project?', () => apply(svc.requestEditBudget(p, ctx()), 'Request Edit successfully!'))}>Request Edit</Btn>
        )}
        {bs === S.APPROVED_EDIT && View && <Btn variant="primary" icon={Pencil}>Edit</Btn>}
      </div>
      <Note>Không có Add New: dòng ngân sách sinh sẵn theo loại khi tạo dự án. Submit / Approve / Reject Budget chỉ đổi trạng thái ngân sách, KHÔNG đổi trạng thái dự án; Approve Budget ghi ActualCost = tổng Amount.</Note>
      <MiniGrid
        toolbar={false}
        cols={['#', 'Budget Type', 'Description', 'Rate', 'Estimate/Quantity', 'Amount', 'Note']}
        rows={BUDGET_ROWS.map((r, i) => [String(i + 1), r.type, r.desc, <span key="r" className={erp.num}>{money(r.rate)}</span>, String(r.qty), <span key="a" className={erp.num}>{money(r.rate * r.qty)}</span>, r.note])}
        actions={showEditCol ? { edit: CanEdit || has(PERMS.BudgetEdit) } : null}
        footer={
          <>
            <td className={erp.td} colSpan={5}>Sum</td>
            <td className={`${erp.td} ${erp.num}`}>{money(sum)}</td>
            <td className={erp.td} colSpan={showEditCol ? 2 : 1} />
          </>
        }
      />
      {confirm && <ConfirmDialog message={confirm.msg} onConfirm={confirm.run} onClose={() => setConfirm(null)} />}
    </>
  );
};

const ReportTab: React.FC<{ p: QProject; View: boolean; CanEdit: boolean; stub: (s: string) => void }> = ({ View, CanEdit, stub }) => {
  const { has } = useProjects();
  const lv = ['Highest', 'High', 'Medium', 'Low', 'Total'];
  return (
    <div className="space-y-4">
      <div>
        <h6 className="font-bold text-[13px] text-slate-700 mb-1">DEFECT INPUT</h6>
        <table className={erp.table}>
          <thead>
            <tr>
              <th className={erp.th} rowSpan={2} />
              <th className={erp.th} colSpan={5}>DEVELOPMENT</th>
              <th className={erp.th} colSpan={5}>UAT</th>
            </tr>
            <tr>
              {[...lv, ...lv].map((x, i) => (
                <th key={i} className={erp.th}>
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tfoot>
            {[
              ['Total', '3', '12', '25', '9', '49', '0', '2', '4', '1', '7'],
              ['Defect Density', '', '', '', '', '1.96', '', '', '', '', ''],
              ['Leakage Rate', '', '', '', '', '', '', '', '', '', '0.28'],
            ].map((r) => (
              <tr key={r[0]}>
                {r.map((c, i) => (
                  <td key={i} className={`${erp.td} ${i ? erp.num : 'font-semibold'}`}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
        <Note>Phần thân bảng (từng dòng defect) đang bị comment trong code; mục SCHEDULE INPUT bị comment toàn bộ.</Note>
      </div>
      <div>
        <h6 className="font-bold text-[13px] text-slate-700 mb-1">REPORT INPUT</h6>
        <MiniGrid
          toolbar={false}
          addNew={has(PERMS.Edit) && CanEdit}
          addLabel="Create"
          extraActions={has(PERMS.Edit) && CanEdit ? undefined : <span className="text-[11px] text-slate-400">Nút Create: Projects.Edit &amp;&amp; CanEdit</span>}
          cols={['Collected Date', '% Planned Complete', '% Actual Complete', 'BAC', 'EV', 'PV', 'AC', 'CPI', 'SPI', 'Issue/Result in Period', 'Explanation/Detail in Period', 'Solution/Note in Period']}
          rows={[['30/06/2026', '50', '45', money(950_000_000), money(427_500_000), money(475_000_000), money(420_000_000), '1.02', '0.90', 'Chậm 1 sprint', 'Thiếu nhân sự QA', 'Bổ sung 1 QA']]}
          actions={View ? null : { edit: has(PERMS.Edit), del: has(PERMS.Edit) }}
          onAction={(w) => stub(`Report input: ${w === 'add' ? 'Create' : w}`)}
        />
      </div>
    </div>
  );
};

interface PointRow {
  metric: string;
  rate: number;
  std: number;
  lcl: number;
  avg: number;
  ucl: number;
  obj: string;
  actual: string;
  point: number | null;
  note: string;
}
const POINT_SEED: PointRow[] = [
  { metric: 'Schedule Variance', rate: 0.25, std: 25, lcl: -5, avg: 0, ucl: 10, obj: '≤ 10%', actual: '6%', point: 22, note: '' },
  { metric: 'Effort Variance', rate: 0.25, std: 25, lcl: -10, avg: 0, ucl: 15, obj: '≤ 15%', actual: '12%', point: 20, note: '' },
  { metric: 'Defect Leakage', rate: 0.2, std: 20, lcl: 0, avg: 0.2, ucl: 0.5, obj: '≤ 0.5', actual: '0.4', point: 15, note: '' },
  { metric: 'Customer Satisfaction', rate: 0.3, std: 30, lcl: 3, avg: 4, ucl: 5, obj: '≥ 4', actual: '4.2', point: 26, note: 'Khảo sát cuối dự án' },
];
const grade = (n: number) => (n < 60 ? 'Fail' : n < 80 ? 'Fair' : n < 90 ? 'Good' : 'Excellent');

// Chỉ hiện khi dự án có dữ liệu điểm cũ ⇒ chỉ xem
const PointTab: React.FC = () => {
  const sum = POINT_SEED.reduce((s, r) => s + (r.point || 0), 0);
  const th = `${erp.th} text-center`;
  return (
    <>
      <Note>Đã bỏ Project point: không nhập điểm. Tab chỉ hiện để xem dữ liệu điểm cũ.</Note>
      <div className="overflow-x-auto">
        <table className={erp.table}>
          <thead>
            <tr>
              <th className={th} rowSpan={2}>Metric</th>
              <th className={th} rowSpan={2}>Rate</th>
              <th className={th} rowSpan={2}>StandardPoint</th>
              <th className={th} colSpan={3}>Metic</th>
              <th className={th}></th>
              <th className={th} colSpan={2}>Actual Result</th>
              <th className={th} rowSpan={2}>Note</th>
            </tr>
            <tr>
              <th className={th}>LCL</th>
              <th className={th}>Average</th>
              <th className={th}>UCL</th>
              <th className={th}>ProjectObjective</th>
              <th className={th}>Actual</th>
              <th className={th}>Point</th>
            </tr>
          </thead>
          <tbody>
            {POINT_SEED.map((r) => (
              <tr key={r.metric} className={erp.tr}>
                <td className={erp.td}>{r.metric}</td>
                <td className={`${erp.td} ${erp.num}`}>{r.rate}</td>
                <td className={`${erp.td} ${erp.num}`}>{r.std}</td>
                <td className={`${erp.td} ${erp.num}`}>{r.lcl}</td>
                <td className={`${erp.td} ${erp.num}`}>{r.avg}</td>
                <td className={`${erp.td} ${erp.num}`}>{r.ucl}</td>
                <td className={erp.td}>{r.obj}</td>
                <td className={erp.td}>{r.actual}</td>
                <td className={`${erp.td} ${erp.num}`}>{r.point}</td>
                <td className={erp.td}>{r.note}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={erp.totalRow}>
              <td className={erp.td} colSpan={8} />
              <td className={`${erp.td} ${erp.num}`}>
                Sum: {sum} - {grade(sum)}
              </td>
              <td className={erp.td} />
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};
