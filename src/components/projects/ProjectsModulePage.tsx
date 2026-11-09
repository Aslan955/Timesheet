/**
 * Màn "Quản lý dự án › Dự án" (/Projects) — prototype bám code iMIS hiện tại.
 * Gồm: danh sách (ProjectsComponent + ProjectsListComponent), chi tiết / sửa (ProjectDetailComponent); không còn tạo mới,
 * bộ chọn vai trò + bật/tắt từng quyền để demo nút theo quyền.
 */
import React, { useState } from 'react';
import { Info, KeyRound, RotateCcw, UserCog } from 'lucide-react';
import { Btn, ErpPage, ErpTitleBar } from '../erp/Erp';
import { ProjectsProvider, useProjects } from '../../projects/ProjectsContext';
import { PERMS, PERM_GROUPS, PERSONAS } from '../../projects/projectData';
import { takePending } from '../../projects/projectLinks';
import { ProjectsListView } from './ProjectsListView';
import { ProjectDetailView } from './ProjectDetailView';
import { Toasts } from './ProjectPopups';

type Route = { name: 'list' } | { name: 'detail'; id: string; edit: boolean };

const RoleBar: React.FC = () => {
  const { persona, setPersona, perms, togglePerm, reset } = useProjects();
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-dashed border-amber-300 rounded-[4px] text-[12px]">
      <div className="flex flex-wrap items-center gap-2 px-3 py-1.5">
        <span className="font-semibold text-amber-700">Demo prototype</span>
        <label className="inline-flex items-center h-8 border border-slate-300 rounded-[3px] overflow-hidden">
          <span className="flex items-center gap-1 px-2 text-slate-500">
            <UserCog size={13} /> Vai trò
          </span>
          <select value={persona.key} onChange={(e) => setPersona(e.target.value)} className="h-8 px-1.5 border-l border-slate-300 font-semibold text-[#1e3a5f] outline-none cursor-pointer">
            {PERSONAS.map((p) => (
              <option key={p.key} value={p.key}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <span className="text-slate-500">
          Người dùng: <b className="text-slate-700">{persona.user}</b> · {persona.viewAll ? 'xem tất cả dự án' : 'chỉ dự án mình tạo / PM / thành viên'} · {perms.size} quyền
        </span>
        <Btn icon={KeyRound} onClick={() => setOpen((v) => !v)} className="h-7">
          {open ? 'Ẩn quyền' : 'Chỉnh quyền'}
        </Btn>
        <Btn icon={RotateCcw} onClick={reset} className="h-7 ml-auto" title="Khôi phục dữ liệu mẫu của màn này (dự án có PakdId theo màn Dự án kinh doanh)">
          Dữ liệu mẫu
        </Btn>
      </div>
      {open && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 px-3 py-2 border-t border-slate-200 bg-slate-50">
          {PERM_GROUPS.map((g) => (
            <div key={g.title}>
              <p className="font-semibold text-slate-700 mb-1">{g.title}</p>
              {g.perms.map(({ key, note }) => (
                <label key={key} className="flex items-start gap-1.5 py-0.5 cursor-pointer">
                  <input type="checkbox" className="accent-[#1f5fa8] mt-0.5" checked={perms.has(key)} onChange={() => togglePerm(key)} />
                  <span>
                    <code className="text-[11px] text-[#1f5fa8]">{key}</code>
                    {note && <span className="text-slate-400"> — {note}</span>}
                  </span>
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Inner: React.FC = () => {
  const { has, projects } = useProjects();
  // Mở thẳng chi tiết khi đến từ Dự án kinh doanh (bấm trạng thái mã)
  const [route, setRoute] = useState<Route>(() => {
    const code = takePending('project');
    const p = code ? projects.find((x) => x.projectCode === code) : undefined;
    return p ? { name: 'detail', id: p.id, edit: false } : { name: 'list' };
  });
  const open = (id: string, edit = false) => setRoute({ name: 'detail', id, edit });

  if (!has(PERMS.Read))
    return (
      <>
        <RoleBar />
        <div className="bg-white border border-slate-300 rounded-[4px] p-6 text-center text-slate-500">Không có quyền Projects.Read — menu “Dự án” bị ẩn và controller trả 403.</div>
      </>
    );

  return (
    <>
      <RoleBar />
      {route.name === 'list' && (
        <>
          <ErpTitleBar
            crumbs={['Quản lý dự án', 'Dự án']}
            title="Dự án"
            // Đã chốt 04/11: bỏ nút Create — dự án mới tạo qua Dự án kinh doanh
            notice={
              <div className="px-4 py-1.5 bg-slate-50 text-[12px] text-slate-600 flex items-center gap-1.5">
                <Info size={13} className="text-[#1f5fa8]" /> Tạo dự án mới tại <b>Quản trị dự án &amp; Tài chính › Danh sách dự án</b>.
              </div>
            }
          />
          <ProjectsListView onOpen={(id) => open(id)} />
        </>
      )}
      {route.name === 'detail' && <ProjectDetailView key={`${route.id}-${route.edit}`} id={route.id} edit={route.edit} onBack={() => setRoute({ name: 'list' })} onOpen={open} />}
    </>
  );
};

export const ProjectsModulePage: React.FC = () => (
  <ProjectsProvider>
    <ErpPage>
      <Inner />
    </ErpPage>
    <Toasts />
  </ProjectsProvider>
);
