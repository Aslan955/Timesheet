/**
 * ProcessPage — Phân hệ "Quy trình" › Danh sách quy trình (+ mở màn Thiết lập quy trình).
 * Kế toán / Admin xây quy trình phê duyệt (thanh toán, tạm ứng, phê duyệt dự án…): các bước thực hiện + trường thông tin theo bước.
 * Giao diện theo bộ khung ERP (như màn Dự án kinh doanh): thanh tiêu đề, ô tổng quan, bảng kẻ ô.
 */
import React, { useMemo, useState } from 'react';
import { Copy, Pencil, Plus, Search, Trash2, Workflow, X } from 'lucide-react';
import { ProcIcon } from './ProcIcon';
import { Btn, ErpPage, ErpTitleBar, KpiBox, Panel, erp } from '../erp/Erp';
import {
  ME, PERM_LABEL, PROC_GROUPS, fieldCount, fmtDate, fmtDateTime, nextCode, nowIsoP, uidP, updateProcesses, useProcesses, type Process,
} from './processStore';
import { ProcessEditor } from './ProcessEditor';

const CRUMBS = ['Quy trình', 'Danh sách quy trình'];
type Mode = { kind: 'list' } | { kind: 'edit'; id: string | null; copyOf?: string };

const Switch: React.FC<{ on: boolean; onChange: (v: boolean) => void; title?: string }> = ({ on, onChange, title }) => (
  <button
    type="button"
    title={title}
    onClick={(e) => (e.stopPropagation(), onChange(!on))}
    className={`relative w-9 h-[18px] rounded-full transition-colors cursor-pointer shrink-0 ${on ? 'bg-[#0f8f6c]' : 'bg-slate-300'}`}
  >
    <span className={`absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full shadow transition-all ${on ? 'left-[20px]' : 'left-[2px]'}`} />
  </button>
);

export const ProcessPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>({ kind: 'list' });
  const [toast, setToast] = useState('');
  const flash = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast(''), 3200);
  };
  return (
    <ErpPage>
      {toast && <div className="fixed top-4 right-4 z-[60] rounded-[4px] border border-[#184c88] bg-[#1e3a5f] text-white text-[12.5px] px-4 py-2.5 shadow-xl max-w-[520px]">{toast}</div>}
      {mode.kind === 'list' ? (
        <ProcessList onOpen={(id, copyOf) => setMode({ kind: 'edit', id, copyOf })} flash={flash} />
      ) : (
        <ProcessEditor key={`${mode.id}-${mode.copyOf || ''}`} id={mode.id} copyOf={mode.copyOf} onBack={() => setMode({ kind: 'list' })} flash={flash} />
      )}
    </ErpPage>
  );
};

// ==========================================================================
// Danh sách
// ==========================================================================
const ProcessList: React.FC<{ onOpen: (id: string | null, copyOf?: string) => void; flash: (m: string) => void }> = ({ onOpen, flash }) => {
  const list = useProcesses();
  const [q, setQ] = useState('');
  const [group, setGroup] = useState('');
  const [status, setStatus] = useState<'' | 'on' | 'off'>('');
  const [confirmDel, setConfirmDel] = useState<Process | null>(null);

  const rows = useMemo(() => {
    const n = q.trim().toLowerCase();
    return list
      .filter((p) => !group || p.group === group)
      .filter((p) => !status || (status === 'on' ? p.active : !p.active))
      .filter((p) => !n || `${p.code} ${p.name} ${p.group} ${p.steps.map((s) => s.name).join(' ')}`.toLowerCase().includes(n))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [list, q, group, status]);

  const nActive = list.filter((p) => p.active).length;
  const nReq = list.reduce((s, p) => s + p.requests, 0);
  const groups = PROC_GROUPS.filter((g) => list.some((p) => p.group === g));

  const toggle = (p: Process, on: boolean) => {
    updateProcesses((l) => l.map((x) => (x.id === p.id ? { ...x, active: on, updatedAt: nowIsoP(), history: [...x.history, { at: nowIsoP(), by: ME, action: on ? 'Áp dụng quy trình' : 'Ngừng áp dụng' }] } : x)));
    flash(on ? `Đã áp dụng quy trình "${p.name}" — nhân viên có quyền đã tạo được đơn` : `Đã ngừng quy trình "${p.name}" — không tạo đơn mới, đơn đang chạy vẫn xử lý tiếp`);
  };
  const remove = (p: Process) => {
    updateProcesses((l) => l.filter((x) => x.id !== p.id));
    setConfirmDel(null);
    flash(`Đã xoá quy trình ${p.code} — ${p.name}`);
  };
  const copy = (p: Process) => {
    const c: Process = {
      ...structuredClone(p),
      id: uidP('p'),
      code: nextCode(list),
      name: `${p.name} (bản sao)`,
      active: false,
      requests: 0,
      createdBy: ME,
      createdAt: nowIsoP(),
      updatedAt: nowIsoP(),
      history: [{ at: nowIsoP(), by: ME, action: `Sao chép từ ${p.code}` }],
    };
    updateProcesses((l) => [c, ...l]);
    flash(`Đã tạo bản sao ${c.code} (đang tắt) — mở để chỉnh sửa`);
    onOpen(c.id);
  };

  const th = `${erp.th} border-t-0 text-left`;
  return (
    <>
      <ErpTitleBar
        crumbs={CRUMBS}
        title="Danh sách quy trình"
        actions={
          <Btn variant="primary" icon={Plus} onClick={() => onOpen(null)}>
            Tạo quy trình
          </Btn>
        }
        notice={
          confirmDel ? (
            <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-rose-50 text-[12.5px] text-rose-700">
              <span className="flex-1 min-w-[240px]">
                Xoá quy trình <b>{confirmDel.code} — {confirmDel.name}</b>? Thao tác không hoàn tác được.
              </span>
              <Btn className="h-7" onClick={() => setConfirmDel(null)}>
                Không xoá
              </Btn>
              <Btn variant="danger" icon={Trash2} className="h-7" onClick={() => remove(confirmDel)}>
                Xoá quy trình
              </Btn>
            </div>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiBox label="Tổng số quy trình" value={list.length} sub={`${groups.length} nhóm quy trình`} onClick={() => setStatus('')} active={!status} />
        <KpiBox label="Đang áp dụng" value={nActive} tone="good" sub="Nhân viên có quyền tạo được đơn" onClick={() => setStatus(status === 'on' ? '' : 'on')} active={status === 'on'} />
        <KpiBox label="Ngừng áp dụng / nháp" value={list.length - nActive} tone={list.length - nActive ? 'bad' : 'neutral'} sub="Không tạo được đơn mới" onClick={() => setStatus(status === 'off' ? '' : 'off')} active={status === 'off'} />
        <KpiBox label="Đơn đã phát sinh" value={nReq.toLocaleString('en-US')} sub="Tổng số đơn theo các quy trình" />
      </div>

      <Panel
        title="Quy trình phê duyệt"
        icon={Workflow}
        noPad
        actions={<span className="text-[12px] text-slate-600">{rows.length} / {list.length} quy trình</span>}
        footer="Bước 1 là người tạo đơn; người xử lý mỗi bước sau do người xử lý bước trước chọn khi chuyển đơn. Quy trình đã có đơn: không xoá được, chỉ ngừng áp dụng."
      >
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-slate-200 bg-[#fafbfd]">
          <div className="relative w-72">
            <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã, tên quy trình, tên bước..." className={`${erp.inputFull} pl-7`} />
          </div>
          <select value={group} onChange={(e) => setGroup(e.target.value)} className={`${erp.input} w-56`}>
            <option value="">Tất cả nhóm quy trình</option>
            {PROC_GROUPS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value as '' | 'on' | 'off')} className={`${erp.input} w-44`}>
            <option value="">Tất cả trạng thái</option>
            <option value="on">Đang áp dụng</option>
            <option value="off">Ngừng áp dụng</option>
          </select>
          {(q || group || status) && (
            <Btn icon={X} className="h-8" onClick={() => (setQ(''), setGroup(''), setStatus(''))}>
              Bỏ lọc
            </Btn>
          )}
        </div>
        <div className="overflow-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${th} border-l-0 w-10 text-center`}>STT</th>
                <th className={th}>Quy trình</th>
                <th className={th}>Nhóm</th>
                <th className={`${th} text-center`}>Phiên bản</th>
                <th className={th}>Các bước thực hiện</th>
                <th className={`${th} text-center`}>Số trường</th>
                <th className={th}>Phân quyền sử dụng</th>
                <th className={`${th} text-right`}>Số đơn</th>
                <th className={th}>Cập nhật</th>
                <th className={`${th} text-center`}>Áp dụng</th>
                <th className={`${th} border-r-0 text-center`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {!rows.length && (
                <tr>
                  <td colSpan={11} className={`${erp.td} text-center text-slate-500 py-8`}>
                    Không có quy trình phù hợp.{' '}
                    <button type="button" className="text-[#1f5fa8] font-semibold hover:underline cursor-pointer" onClick={() => onOpen(null)}>
                      Tạo quy trình
                    </button>
                  </td>
                </tr>
              )}
              {rows.map((p, i) => (
                <tr key={p.id} className={`${erp.tr} cursor-pointer ${!p.active ? 'text-slate-500' : ''}`} onClick={() => onOpen(p.id)}>
                  <td className={`${erp.td} border-l-0 text-center text-slate-500`}>{i + 1}</td>
                  <td className={erp.td}>
                    <span className="flex items-center gap-2 min-w-[220px]">
                      <ProcIcon p={p} />
                      <span className="min-w-0">
                        <span className="block font-semibold text-slate-800 truncate">{p.name}</span>
                        <span className="block text-[11px] text-slate-500">
                          <span className={erp.code}>{p.code}</span>
                          {p.unlimitedSteps && <span className="ml-1.5 text-amber-700">· không giới hạn bước</span>}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className={`${erp.td} whitespace-nowrap`}>{p.group || '—'}</td>
                  <td className={`${erp.td} text-center`}>{p.version}</td>
                  <td className={erp.td}>
                    <span className="flex flex-wrap items-center gap-1 max-w-[420px]">
                      {p.steps.map((s, k) => (
                        <span key={s.id} className="inline-flex items-center gap-1 text-[11.5px]">
                          {k > 0 && <span className="text-slate-300">›</span>}
                          <span className="inline-flex items-center gap-1 rounded-[3px] border border-slate-200 bg-white px-1.5 py-px whitespace-nowrap">
                            <b className="text-[#1f5fa8]">{k + 1}</b> {s.name || <i className="text-slate-400">(chưa đặt tên)</i>}
                          </span>
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className={`${erp.td} text-center`}>{fieldCount(p)}</td>
                  <td className={`${erp.td} whitespace-nowrap`} title={p.permMode === 'units' ? p.permUnits.join(', ') : p.permMode === 'people' ? p.permPeople.join(', ') : ''}>
                    {p.permMode === 'all' ? PERM_LABEL.all : p.permMode === 'units' ? `${p.permUnits.length} phòng ban / khối` : `${p.permPeople.length} nhân viên`}
                  </td>
                  <td className={`${erp.td} ${erp.num}`}>{p.requests ? p.requests.toLocaleString('en-US') : '—'}</td>
                  <td className={`${erp.td} whitespace-nowrap`} title={fmtDateTime(p.updatedAt)}>
                    {fmtDate(p.updatedAt)}
                    <span className="block text-[11px] text-slate-400">{p.createdBy}</span>
                  </td>
                  <td className={`${erp.td} text-center`}>
                    <span className="inline-flex items-center gap-1.5">
                      <Switch on={p.active} onChange={(v) => toggle(p, v)} title={p.active ? 'Đang áp dụng — bấm để ngừng' : 'Đang ngừng — bấm để áp dụng'} />
                    </span>
                  </td>
                  <td className={`${erp.td} border-r-0 text-center whitespace-nowrap`} onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="p-1 rounded text-[#1f5fa8] hover:bg-[#eaf2fc] cursor-pointer" title="Sửa" onClick={() => onOpen(p.id)}>
                      <Pencil size={14} />
                    </button>
                    <button type="button" className="p-1 rounded text-slate-600 hover:bg-slate-100 cursor-pointer" title="Sao chép thành quy trình mới" onClick={() => copy(p)}>
                      <Copy size={14} />
                    </button>
                    <button
                      type="button"
                      className="p-1 rounded text-rose-600 hover:bg-rose-50 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={p.requests > 0}
                      title={p.requests > 0 ? `Đã có ${p.requests} đơn — không xoá được, hãy ngừng áp dụng` : 'Xoá quy trình'}
                      onClick={() => setConfirmDel(p)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
};
