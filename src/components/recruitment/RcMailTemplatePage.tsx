/**
 * Mẫu email tuyển dụng — code thật KHÔNG có màn riêng: template nằm ở bảng NotificationTemplates,
 * sửa qua màn chung Noti Management › NotificationTemplates. Prototype mô phỏng màn đó, lọc sẵn RECRUITMENT_*.
 */
import React, { useState } from 'react';
import { Info, Pencil, Power, RefreshCw } from 'lucide-react';
import { ErpPage, ErpTitleBar, Panel, Btn, erp, Segmented } from '../erp/Erp';
import { Modal, useToast, iconBtn } from '../../marcom/MarcomUi';
import { useRc } from '../../recruitment/rc/RcContext';
import { MailTemplate, norm } from '../../recruitment/rc/rcData';
import { ToneTag } from './rcUi';
import { FormField } from '../onboarding/onbUi';

export const RcMailTemplatePage: React.FC = () => {
  const rc = useRc();
  const { toast, toastNode } = useToast();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'' | 'Active' | 'Inactive'>('');
  const [edit, setEdit] = useState<MailTemplate | null>(null);
  const [mode, setMode] = useState<'raw' | 'preview'>('raw');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rows = rc.templates
    .filter((t) => !q || norm(t.code).includes(norm(q)) || norm(t.name).includes(norm(q)))
    .filter((t) => !status || (status === 'Active') === t.active);

  const save = () => {
    if (!edit) return;
    const e: Record<string, string> = {};
    if (!edit.name.trim()) e.name = 'Template Name is required';
    if (!edit.title.trim()) e.title = 'Title Template is required';
    if (!edit.content.trim()) e.content = 'Content Template is required';
    setErrors(e);
    if (Object.keys(e).length) return;
    rc.saveTemplate(edit);
    toast(`Đã lưu ${edit.code}`);
    setEdit(null);
  };

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['Noti Management', 'NotificationTemplates']}
        title="Mẫu email tuyển dụng"
        notice={
          <div className="flex gap-2 px-4 py-2 bg-[#eef4fb] text-[12.5px] text-[#1e3a5f]">
            <Info size={15} className="text-[#1f5fa8] shrink-0 mt-0.5" />
            <span>
              Code hiện tại không có màn riêng cho mail tuyển dụng — template nằm ở bảng <b>NotificationTemplates</b>, sửa qua màn chung <b>Noti Management › NotificationTemplates</b> (quyền
              NotificationTemplates_Read). Màn này lọc sẵn các mã <code className="font-mono">RECRUITMENT_*</code>. Thân mail còn sửa được ngay lúc gửi (bước “Xem trước” trong popup Gửi mail).
            </span>
          </div>
        }
      />

      <Panel
        title="Templates"
        noPad
        actions={
          <>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Code or name..." className={`${erp.input} h-7 w-52 text-[12px]`} />
            <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={`${erp.input} h-7 w-28 text-[12px] cursor-pointer`}>
              <option value="">All status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <Btn icon={RefreshCw} className="h-7" onClick={() => { setQ(''); setStatus(''); }}>
              Refresh
            </Btn>
          </>
        }
        footer={`${rows.length} template · Channel: Email`}
      >
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                {['Template Code', 'Template Name', 'Channel', 'Parameters', 'Status', 'Actions'].map((h) => (
                  <th key={h} className={`${erp.th} text-left`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.code} className={erp.tr}>
                  <td className={`${erp.td} ${erp.code} whitespace-nowrap`}>{t.code}</td>
                  <td className={erp.td}>{t.name}</td>
                  <td className={erp.td}>{t.channel}</td>
                  <td className={`${erp.td} max-w-[360px] text-[11.5px] text-slate-600`}>{t.parameters || <span className="text-slate-400">—</span>}</td>
                  <td className={erp.td}>{t.active ? <ToneTag tone="green">Active</ToneTag> : <ToneTag tone="gray">Inactive</ToneTag>}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>
                    <button type="button" className={iconBtn} title="Edit" onClick={() => { setEdit({ ...t }); setMode('raw'); setErrors({}); }}>
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      className={iconBtn}
                      title={t.active ? 'Disable' : 'Enable'}
                      onClick={() => { rc.saveTemplate({ ...t, active: !t.active }); toast(`${t.code}: ${t.active ? 'Disabled' : 'Enabled'}`); }}
                    >
                      <Power size={14} className={t.active ? 'text-emerald-600' : 'text-slate-400'} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        width="max-w-3xl"
        title="Edit Template"
        footer={
          <>
            <Btn onClick={() => setEdit(null)}>Cancel</Btn>
            <Btn variant="primary" onClick={save}>
              Save
            </Btn>
          </>
        }
      >
        {edit && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <FormField label="Template Code" required>
              <input value={edit.code} disabled className={`${erp.inputFull} font-mono`} />
            </FormField>
            <FormField label="Template Name" required error={errors.name}>
              <input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} className={erp.inputFull} />
            </FormField>
            <FormField label="Title Template" required error={errors.title} className="col-span-2">
              <input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} className={erp.inputFull} />
            </FormField>
            <FormField label="Content Template" required error={errors.content} className="col-span-2" badge={<Segmented value={mode} onChange={setMode} options={[{ key: 'raw', label: 'Raw HTML' }, { key: 'preview', label: 'Xem Preview' }]} />}>
              {mode === 'raw' ? (
                <textarea rows={10} value={edit.content} onChange={(e) => setEdit({ ...edit, content: e.target.value })} className={`${erp.inputFull} h-auto py-1.5 font-mono text-[12px] resize-y`} />
              ) : (
                <div className="border border-slate-300 rounded-[3px] p-3 min-h-[200px] text-[13px] leading-relaxed [&_ul]:list-disc [&_ul]:pl-5" dangerouslySetInnerHTML={{ __html: edit.content }} />
              )}
            </FormField>
            <FormField label="Parameters" hint="Placeholder dạng {TenBien} trong Title/Content được thay khi gửi" className="col-span-2">
              <input value={edit.parameters} onChange={(e) => setEdit({ ...edit, parameters: e.target.value })} className={erp.inputFull} />
            </FormField>
            <FormField label="Channel">
              <select value={edit.channel} disabled className={erp.inputFull}>
                <option>Email</option>
              </select>
            </FormField>
            <FormField label="Status">
              <label className="inline-flex items-center gap-2 h-8 text-[12.5px] cursor-pointer">
                <input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} className="w-4 h-4 accent-[#1f5fa8]" />
                Active
              </label>
            </FormField>
          </div>
        )}
      </Modal>
      {toastNode}
    </ErpPage>
  );
};
