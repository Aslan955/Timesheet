/**
 * Chi tiết / sửa dự án — bám ProjectDetailComponent.razor + ProjectsController.Detail.
 *  - Xem: không có nút đổi trạng thái (chốt 04/11), DxTabs các tab theo quyền + loại dự án.
 *  - Sửa (edit=true): chỉ khi Projects.Edit + CanAddTab + ProjectEditStatusId = Approved edit; không thì hạ về xem + cảnh báo.
 *  - Không còn màn tạo (/Projects/Create) — dự án mới tạo qua Dự án kinh doanh.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, History, Save } from 'lucide-react';
import { Btn, ErpTitleBar } from '../erp/Erp';
import { useProjects } from '../../projects/ProjectsContext';
import { MSG, PERMS, QProject, S, TabKey, canAddTab, detailTabs, pmSync, statusName, svcUpdate } from '../../projects/projectData';
import { openBizProject } from '../../projects/projectLinks';
import { GeneralForm, GeneralView, validateGeneral } from './ProjectGeneralTab';
import { SubTab } from './ProjectSubTabs';

export const ProjectDetailView: React.FC<{
  id: string;
  edit: boolean;
  onBack: () => void;
  onOpen: (id: string, edit?: boolean) => void;
}> = ({ id, edit, onBack, onOpen }) => {
  const { projects, has, ctx, apply, toast } = useProjects();
  const p = projects.find((x) => x.id === id);

  // CanEnterEditMode(): HasEdit && CanAddTab && APPROVED_EDIT
  const canEnterEdit = !!p && has(PERMS.Edit) && canAddTab(p) && p.editStatusId === S.APPROVED_EDIT;
  const editing = edit && canEnterEdit;
  useEffect(() => {
    if (edit && p && !canEnterEdit) toast('warning', MSG.editNotApproved);
  }, [edit, id]); // eslint-disable-line react-hooks/exhaustive-deps

  const [draft, setDraft] = useState<QProject | undefined>(p);
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => setDraft(p), [id, editing]); // eslint-disable-line react-hooks/exhaustive-deps

  const tabs = useMemo(() => (p ? detailTabs(p, has) : []), [p, has]);
  const [tab, setTab] = useState<TabKey>('general');
  const activeTab = tabs.some((t) => t.key === tab) ? tab : 'general';
  const [showLog, setShowLog] = useState(false);

  if (!p)
    return (
      <div className="bg-white border border-slate-300 rounded-[4px] p-4 space-y-3">
        <div className="px-3 py-2 rounded-[3px] bg-amber-50 border border-amber-200 text-amber-800">Không tìm thấy dự án.</div>
        <Btn onClick={onBack}>Back</Btn>
      </div>
    );

  const save = () => {
    if (!draft) return;
    const e = validateGeneral(draft);
    setErrors(e);
    if (Object.keys(e).length) return toast('error', 'Check your input!');
    const r = svcUpdate(projects, p, draft, ctx());
    if (!apply(r, 'Update a project successfully!') || !r.ok) return;
    // Đổi PM: báo đồng bộ về Dự án kinh doanh / Jira
    const sync = pmSync(p, draft);
    if (sync.bizCode) toast('success', `Đã đồng bộ PM về Dự án kinh doanh ${sync.bizCode}`);
    if (sync.jiraKey) toast('info', `Đã gửi Jira update_pm ${sync.jiraKey}`);
    onOpen(r.project.id);
  };


  return (
    <div className="space-y-3">
      <ErpTitleBar
        crumbs={['Quản lý dự án', 'Projects', p.projectCode]}
        title={p.projectName || p.projectCode}
        actions={
          <>
            {/* Save: Visible="HasEdit" */}
            {editing && has(PERMS.Edit) && (
              <Btn variant="primary" icon={Save} onClick={save}>
                Save
              </Btn>
            )}
            <Btn icon={ArrowLeft} onClick={onBack}>
              Back
            </Btn>
          </>
        }
        meta={
          !editing
            ? [
                { label: 'ProjectStatusId', value: statusName(p.statusId) || '0' },
                { label: 'ProjectEditStatusId', value: statusName(p.editStatusId) },
                { label: 'ProjectBugestStatusId', value: statusName(p.budgetStatusId) },
                { label: 'Jira', value: p.jiraKey || '(chưa tạo)' },
                ...(p.pakdId
                  ? [
                      {
                        label: 'Nguồn',
                        value: (
                          <button type="button" onClick={() => openBizProject(p.pakdId!)} className="text-[#1f5fa8] hover:underline cursor-pointer" title="Mở dự án kinh doanh">
                            Dự án kinh doanh · Mã tổng {p.masterCode}
                          </button>
                        ),
                      },
                    ]
                  : []),
              ]
            : undefined
        }
        notice={
          !editing ? (
            <div className="px-4 py-1.5 bg-slate-50 text-[11px] text-slate-500 flex flex-wrap items-center gap-x-3">
              <span>Dải trên là các cột ẩn trong DB (UI thật không hiện). Màn này không đổi trạng thái dự án.</span>
              {p.statusId === S.CLOSED && <span className="text-slate-600 font-semibold">Dự án Closed — chỉ xem.</span>}
              <button type="button" onClick={() => setShowLog((v) => !v)} className="ml-auto inline-flex items-center gap-1 text-[#1f5fa8] hover:underline cursor-pointer">
                <History size={12} /> Nhật ký thao tác ({p.history.length})
              </button>
            </div>
          ) : undefined
        }
      />

      {showLog && (
        <div className="bg-white border border-slate-300 rounded-[4px] p-3 text-[12px]">
          <p className="font-semibold text-slate-700 mb-1">Nhật ký thao tác (chỉ có ở prototype)</p>
          {p.history.length ? (
            <ul className="space-y-0.5">
              {p.history.map((h, i) => (
                <li key={i}>
                  <span className="text-slate-400">{h.at.replace('T', ' ').slice(0, 16)}</span> · <b>{h.by}</b> · {h.action}
                  {h.detail && <span className="text-slate-500"> — {h.detail}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400">Chưa có thao tác.</p>
          )}
        </div>
      )}

      <div className="bg-white border border-slate-300 rounded-[4px]">
        {!editing && (
          <div className="flex flex-wrap gap-0.5 border-b border-slate-300 px-2 pt-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`h-8 px-4 -mb-px rounded-t-[4px] border text-[12px] cursor-pointer ${activeTab === t.key ? 'bg-white border-slate-300 border-b-white text-[#1f5fa8] font-bold' : 'bg-[#e3e8ef] border-transparent text-slate-600 hover:bg-[#d8dee8]'}`}
              >
                {t.title}
              </button>
            ))}
          </div>
        )}
        <div className="p-5">
          {editing && draft ? (
            <GeneralForm draft={draft} setDraft={setDraft} errors={errors} />
          ) : activeTab === 'general' ? (
            <GeneralView p={p} onGoEdit={() => onOpen(p.id, true)} />
          ) : (
            <SubTab key={activeTab} tab={activeTab} p={p} />
          )}
        </div>
      </div>
    </div>
  );
};
