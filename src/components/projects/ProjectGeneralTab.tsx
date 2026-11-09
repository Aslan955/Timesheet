/**
 * Tab General — bám ProjectGeneralComponent.razor.
 *  - Chế độ xem: thông tin chung (Status chỉ đọc + nguồn, Ngày đóng khi Closed) · Work Order · Tech-stack · Milestones · Description
 *    + nút Request Edit / Approve Edit / Reject Edit / Edit.
 *  - Chế độ sửa / tạo: form, nút Save nằm ở đầu trang (ProjectDetailComponent gọi TabGeneral.Submit()).
 */
import React, { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Btn, erp } from '../erp/Erp';
import { useProjects } from '../../projects/ProjectsContext';
import {
  CUSTOMERS,
  DIVISIONS,
  DOMAINS,
  EditAction,
  PRIORITIES,
  PROJECT_TYPES,
  PROJECT_TYPE_STAFFING,
  QProject,
  S,
  SIZES,
  USERS,
  WORK_ORDERS,
  dmy,
  generalButtons,
  money,
  projectTypeName,
  statusName,
  statusSource,
  svc,
} from '../../projects/projectData';
import { ConfirmDialog } from './ProjectPopups';
import { DetailField, SectionTitle, StatusPill } from './ProjectUi';

// Work Order (VwProposal) giả lập theo mã WO
const woInfo = (wo?: string) =>
  wo
    ? { type: wo.endsWith('3') ? 'Time & Material' : 'Fixed Price', contractNo: `HĐ-${wo.slice(3)}`, approved: '2026-01-10', duration: 9, file: `${wo}.pdf` }
    : null;

const EDIT_CONFIRM: Record<EditAction, string> = {
  requestEdit: 'Are you sure you want to request edit this Project?',
  approveEdit: 'Are you sure you want to approve edit this Project?',
  rejectEdit: 'Are you sure you want to reject edit this Project?',
  edit: '',
};
const EDIT_OK: Record<EditAction, string> = {
  requestEdit: 'Request Edit successfully!',
  approveEdit: 'Approve Edit successfully!',
  rejectEdit: 'Reject Edit successfully!',
  edit: '',
};

export const GeneralView: React.FC<{ p: QProject; onGoEdit: () => void }> = ({ p, onGoEdit }) => {
  const { has, ctx, apply } = useProjects();
  const [confirm, setConfirm] = useState<EditAction | null>(null);
  const btns = generalButtons(p, has);
  const wo = woInfo(p.workOrder);
  const run = (a: EditAction) => {
    const r = a === 'requestEdit' ? svc.requestEdit(p, ctx()) : a === 'approveEdit' ? svc.approveEdit(p, ctx()) : svc.rejectEdit(p, ctx());
    apply(r, EDIT_OK[a]);
  };
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <h3 className="text-[20px] font-semibold text-[#6b778c]">{p.projectName}</h3>
        {btns.map((b) => (
          <Btn key={b.key} variant="primary" icon={b.key === 'edit' ? Pencil : undefined} onClick={() => (b.key === 'edit' ? onGoEdit() : setConfirm(b.key))}>
            {b.label}
          </Btn>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-x-6">
        <div>
          <DetailField label="Project code">{p.projectCode}</DetailField>
          <DetailField label="Work order">{p.workOrder}</DetailField>
          <DetailField label="Project Type">{projectTypeName(p.projectTypeId)}</DetailField>
          <DetailField label="Priority">{p.priority}</DetailField>
          <DetailField label="Size">{p.size}</DetailField>
          <DetailField label="Division">{p.division}</DetailField>
          <DetailField label="Project Manager">{p.pm}</DetailField>
        </div>
        <div>
          <DetailField label="Domain">{p.domain}</DetailField>
          <DetailField label="Start Date">{dmy(p.actualStartDate)}</DetailField>
          <DetailField label="End Date">{dmy(p.actualEndDate)}</DetailField>
          <DetailField label="Customer">{p.customer}</DetailField>
          <DetailField label="Status">
            <StatusPill name={statusName(p.statusId)} />
            <span className="block mt-0.5 text-[11.5px] text-slate-500">{statusSource(p)}</span>
          </DetailField>
          {p.statusId === S.CLOSED && (
            <DetailField label="Ngày đóng">{p.closedDate ? dmy(p.closedDate) : <span className="text-slate-400">— (dữ liệu cũ chưa có ClosedDate)</span>}</DetailField>
          )}
        </div>
      </div>

      <SectionTitle>Work Order</SectionTitle>
      <div className="grid md:grid-cols-2 gap-x-6">
        <div>
          <DetailField label="Type">{wo?.type}</DetailField>
          <DetailField label="Contract No">{wo?.contractNo}</DetailField>
          <DetailField label="Approved Date">{dmy(wo?.approved)}</DetailField>
        </div>
        <div>
          <DetailField label="Development Cost">{p.targetedCost == null ? '' : `${money(p.targetedCost)} VND`}</DetailField>
          <DetailField label="Duration">{wo ? `${wo.duration} Month` : ''}</DetailField>
          <DetailField label="File upload">{wo?.file && <span className="text-[#1f5fa8] underline">{wo.file}</span>}</DetailField>
        </div>
      </div>

      <SectionTitle>Tech-stack</SectionTitle>
      <div className="grid md:grid-cols-2 gap-x-6">
        <div>
          <DetailField label="Programing language">{p.programingLanguage}</DetailField>
          <DetailField label="Database">{p.database}</DetailField>
          <DetailField label="Tool">{p.tool}</DetailField>
        </div>
        <div>
          <DetailField label="Framework">{p.framework}</DetailField>
          <DetailField label="HardwareFlatform">{p.hardwareFlatform}</DetailField>
        </div>
      </div>

      <SectionTitle>Milestones</SectionTitle>
      <MilestoneTable p={p} />

      <SectionTitle>Description</SectionTitle>
      <div className="border border-slate-200 rounded-[3px] p-3 min-h-[60px] text-[13px]" dangerouslySetInnerHTML={{ __html: p.description || '' }} />

      {confirm && <ConfirmDialog message={EDIT_CONFIRM[confirm]} onConfirm={() => run(confirm)} onClose={() => setConfirm(null)} />}
    </div>
  );
};

const MilestoneTable: React.FC<{ p: QProject; onChange?: (m: QProject['milestones']) => void }> = ({ p, onChange }) => (
  <table className={erp.table}>
    <thead>
      <tr>
        <th className={`${erp.th} text-left w-10`}>#</th>
        <th className={`${erp.th} text-left`}>Milestone</th>
        <th className={`${erp.th} text-left w-40`}>Date</th>
        <th className={`${erp.th} text-left`}>Note</th>
        {onChange && (
          <th className={`${erp.th} w-16 text-center`}>
            <button type="button" title="Thêm" onClick={() => onChange([...p.milestones, { name: '', date: '' }])} className="text-[#1f5fa8] cursor-pointer">
              <Plus size={14} />
            </button>
          </th>
        )}
      </tr>
    </thead>
    <tbody>
      {p.milestones.map((m, i) => (
        <tr key={i} className={erp.tr}>
          <td className={erp.td}>{i + 1}</td>
          <td className={erp.td}>{onChange ? <input value={m.name} onChange={(e) => onChange(p.milestones.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} className={`${erp.inputFull} h-7`} /> : m.name}</td>
          <td className={erp.td}>{onChange ? <input type="date" value={m.date} onChange={(e) => onChange(p.milestones.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))} className={`${erp.inputFull} h-7`} /> : dmy(m.date)}</td>
          <td className={erp.td}>{onChange ? <input value={m.note || ''} onChange={(e) => onChange(p.milestones.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)))} className={`${erp.inputFull} h-7`} /> : m.note}</td>
          {onChange && (
            <td className={`${erp.td} text-center`}>
              <button type="button" onClick={() => onChange(p.milestones.filter((_, j) => j !== i))} className="text-slate-400 hover:text-rose-600 cursor-pointer">
                <Trash2 size={13} />
              </button>
            </td>
          )}
        </tr>
      ))}
      {!p.milestones.length && (
        <tr>
          <td colSpan={onChange ? 5 : 4} className="text-center text-slate-400 py-3 border border-slate-200">
            No data to display
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

// [Required] trong ProjectDto (Customer chỉ gắn CSS Required, không validate)
const REQUIRED: { key: keyof QProject; label: string }[] = [
  { key: 'projectName', label: 'Project Name' },
  { key: 'projectCode', label: 'Project Code' },
  { key: 'projectTypeId', label: 'Project Type' },
  { key: 'priority', label: 'Priority' },
  { key: 'size', label: 'Size' },
  { key: 'division', label: 'Division' },
  { key: 'pm', label: 'Project Manager' },
  { key: 'domain', label: 'Domain' },
  { key: 'actualStartDate', label: 'Start Date' },
  { key: 'actualEndDate', label: 'End Date' },
];
export const validateGeneral = (d: QProject) => {
  const e: Record<string, string> = {};
  REQUIRED.forEach((r) => {
    const v = d[r.key];
    if (v === '' || v == null || v === 0) e[r.key as string] = 'Required field.';
  });
  return e;
};

const F: React.FC<{ label: string; req?: boolean; err?: string; span?: string; children: React.ReactNode }> = ({ label, req, err, span = '', children }) => (
  <label className={`block ${span}`}>
    <span className="block text-[12px] text-slate-600 mb-1">
      {label} {req && <span className="text-rose-600">*</span>}
    </span>
    {children}
    {err && <span className="block text-[11px] text-rose-600 mt-0.5">{err}</span>}
  </label>
);

export const GeneralForm: React.FC<{ draft: QProject; setDraft: (p: QProject) => void; errors: Record<string, string> }> = ({ draft: d, setDraft, errors }) => {
  const set = <K extends keyof QProject>(k: K, v: QProject[K]) => setDraft({ ...d, [k]: v });
  const sel = (k: keyof QProject, opts: string[], ph: string) => (
    <select value={String(d[k] ?? '')} onChange={(e) => set(k, e.target.value as never)} className={erp.inputFull}>
      <option value="">{ph}</option>
      {(d[k] && !opts.includes(String(d[k])) ? [String(d[k]), ...opts] : opts).map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
  const txt = (k: keyof QProject, ph: string) => <input value={String(d[k] ?? '')} onChange={(e) => set(k, e.target.value as never)} placeholder={ph} className={erp.inputFull} />;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
      <F label="Project Name" req err={errors.projectName}>
        {txt('projectName', 'Enter Project Name')}
      </F>
      <F label="Project Code" req err={errors.projectCode}>
        {txt('projectCode', 'Enter Project Code')}
      </F>
      <div className="hidden md:block" />
      <F label="Work Order">
        <select
          value={d.workOrder || ''}
          onChange={(e) => {
            // ChangeProposal: lấy mã dự án + Development Cost từ Work Order
            const wo = e.target.value;
            setDraft({ ...d, workOrder: wo, projectCode: wo ? `S.${wo.slice(3, 7)}.WO.${wo.slice(-3)}` : d.projectCode, targetedCost: wo ? 1_500_000_000 : d.targetedCost });
          }}
          className={erp.inputFull}
        >
          <option value="">Choose Work Order</option>
          {WORK_ORDERS.map((w) => (
            <option key={w}>{w}</option>
          ))}
        </select>
      </F>
      <F label="Development Cost">
        <input type="number" value={d.targetedCost ?? ''} onChange={(e) => set('targetedCost', e.target.value === '' ? null : Number(e.target.value))} placeholder="Enter Development Cost" className={erp.inputFull} />
      </F>
      <div className="hidden md:block" />
      <F label="Customer" req>
        {sel('customer', CUSTOMERS, 'Chọn khách hàng...')}
      </F>
      <F label="Project Type" req err={errors.projectTypeId}>
        <select value={d.projectTypeId || ''} onChange={(e) => set('projectTypeId', Number(e.target.value))} className={erp.inputFull}>
          <option value="">Choose Project Type</option>
          {PROJECT_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </F>
      <F label="Priority" req err={errors.priority}>
        {sel('priority', PRIORITIES, 'Choose Project priority')}
      </F>
      <F label="Size" req err={errors.size}>
        {sel('size', SIZES, 'Choose Project Size')}
      </F>
      <F label="Division" req err={errors.division}>
        {sel('division', DIVISIONS, 'Choose Division')}
      </F>
      <F label="Project Manager" req err={errors.pm}>
        {sel('pm', USERS, 'Choose Project Manager')}
      </F>
      <F label="Domain" req err={errors.domain}>
        {sel('domain', DOMAINS, 'Choose Domain')}
      </F>
      <F label="Start Date" req err={errors.actualStartDate}>
        <input type="date" value={d.actualStartDate} onChange={(e) => set('actualStartDate', e.target.value)} className={erp.inputFull} />
      </F>
      <F label="End Date" req err={errors.actualEndDate}>
        <input type="date" value={d.actualEndDate} onChange={(e) => set('actualEndDate', e.target.value)} className={erp.inputFull} />
      </F>
      {d.projectTypeId !== PROJECT_TYPE_STAFFING && (
        <>
          <div className="md:col-span-3 font-bold text-[13px] mt-2 text-slate-700">Tech-stack</div>
          <F label="Programing  language">{txt('programingLanguage', 'Enter Project Name')}</F>
          <F label="Framework">{txt('framework', 'Enter Framework')}</F>
          <F label="Database">{txt('database', 'Enter Database')}</F>
          <F label="Hardware & flatform ">{txt('hardwareFlatform', 'Enter Hardware & flatform ')}</F>
          <F label="Tool">{txt('tool', 'Enter Tool')}</F>
          <div className="md:col-span-3 font-bold text-[13px] mt-2 text-slate-700">Milestones</div>
          <div className="md:col-span-3">
            <MilestoneTable p={d} onChange={(m) => set('milestones', m)} />
          </div>
        </>
      )}
      <F label="Description" span="md:col-span-3">
        <textarea rows={6} value={(d.description || '').replace(/<[^>]+>/g, '')} onChange={(e) => set('description', `<p>${e.target.value}</p>`)} placeholder="Enter Description" className={`${erp.inputFull} h-auto py-1.5`} />
      </F>
    </div>
  );
};
