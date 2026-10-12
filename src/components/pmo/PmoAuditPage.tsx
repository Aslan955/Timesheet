/**
 * PmoAuditPage — PMO-19 Audit log & truy vết dữ liệu (F12.3).
 *
 * Bố cục: thanh lọc một hàng (người, đối tượng, loại sự kiện, khoảng thời gian từ–đến, tìm) → bảng log
 * (thời điểm, người, đối tượng, mã đối tượng, hành động, trước → sau, IP), phân trang 25 dòng.
 * Bấm mã đối tượng → xem timeline của đúng đối tượng đó (dải "Lịch sử của …" + nút bỏ lọc).
 * "Xuất CSV" theo bộ lọc hiện tại. Log bất biến: không có thao tác sửa/xoá nào trên màn này.
 */
import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Filter, History, Lock, ScrollText, X } from 'lucide-react';
import { dmy } from '../../pmo/pmo';
import { AUDIT_LOG, AuditEntry } from '../../pmo/pmoData';
import { Btn, ErpPage, ErpTitleBar, Panel, Tag, erp } from '../erp/Erp';

const ENTITIES: AuditEntry['entity'][] = ['Hợp đồng', 'Phân bổ giá trị', 'Nghiệm thu/ECV', 'Gate', 'CR', 'Rate card', 'Allocation', 'Điều chuyển', 'Timesheet', 'Cấu hình'];
const ENTITY_CLS: Record<AuditEntry['entity'], string> = {
  'Hợp đồng': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Phân bổ giá trị': 'bg-slate-50 text-slate-700 border-slate-200',
  'Nghiệm thu/ECV': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Gate: 'bg-violet-50 text-violet-700 border-violet-200',
  CR: 'bg-sky-50 text-sky-700 border-sky-200',
  'Rate card': 'bg-rose-50 text-rose-700 border-rose-200',
  Allocation: 'bg-teal-50 text-teal-700 border-teal-200',
  'Điều chuyển': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Timesheet: 'bg-amber-50 text-amber-700 border-amber-200',
  'Cấu hình': 'bg-zinc-100 text-zinc-700 border-zinc-300',
};
const PAGE = 25;
const SEL = `${erp.input} h-7 text-[12px]`;
const atText = (at: string) => `${dmy(at.slice(0, 10))} ${at.slice(11)}`;

const FilterCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex items-center gap-1.5 min-w-0">
    <span className="text-[12px] text-slate-600 whitespace-nowrap">{label}</span>
    {children}
  </label>
);

export const PmoAuditPage: React.FC<{ onNavigate?: (item: string) => void }> = () => {
  const [actor, setActor] = useState('');
  const [entity, setEntity] = useState('');
  const [action, setAction] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [q, setQ] = useState('');
  const [focusId, setFocusId] = useState('');
  const [page, setPage] = useState(0);

  const actors = useMemo(() => [...new Set(AUDIT_LOG.map((a) => a.actor))].sort((a, b) => a.localeCompare(b, 'vi')), []);
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    const act = action.trim().toLowerCase();
    return AUDIT_LOG.filter(
      (a) =>
        (!focusId || a.entityId === focusId) &&
        (!actor || a.actor === actor) &&
        (!entity || a.entity === entity) &&
        (!act || a.action.toLowerCase().includes(act)) &&
        (!from || a.at.slice(0, 10) >= from) &&
        (!to || a.at.slice(0, 10) <= to) &&
        (!s || `${a.entityId} ${a.action} ${a.before} ${a.after} ${a.actor} ${a.ip}`.toLowerCase().includes(s)),
    );
  }, [actor, entity, action, from, to, q, focusId]);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const pg = Math.min(page, pages - 1);
  const shown = rows.slice(pg * PAGE, pg * PAGE + PAGE);
  const anyFilter = actor || entity || action || from || to || q;
  const reset = (fn: () => void) => {
    fn();
    setPage(0);
  };
  const focusEntry = focusId ? AUDIT_LOG.find((a) => a.entityId === focusId) : undefined;

  const exportCsv = () => {
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const head = ['Mã log', 'Thời điểm', 'Người', 'Đối tượng', 'Mã đối tượng', 'Hành động', 'Trước', 'Sau', 'IP'];
    const lines = rows.map((a) => [a.id, a.at, a.actor, a.entity, a.entityId, a.action, a.before, a.after, a.ip].map(esc).join(','));
    const url = URL.createObjectURL(new Blob(['﻿' + [head.map(esc).join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' }));
    const el = document.createElement('a');
    el.href = url;
    el.download = `audit_log_${focusId ? focusId.replace(/[^\w-]+/g, '_') + '_' : ''}${new Date().toISOString().slice(0, 10)}.csv`;
    el.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', 'Quản trị', 'Audit log']}
        title="Audit log"
        actions={
          <Btn variant="primary" icon={Download} onClick={exportCsv} disabled={!rows.length}>
            Xuất CSV ({rows.length})
          </Btn>
        }
        meta={[
          { label: 'Tổng bản ghi', value: AUDIT_LOG.length.toLocaleString('vi-VN') },
          { label: 'Khớp bộ lọc', value: rows.length.toLocaleString('vi-VN') },
          { label: 'Từ', value: dmy(AUDIT_LOG[AUDIT_LOG.length - 1]?.at.slice(0, 10) || '') },
          { label: 'Đến', value: dmy(AUDIT_LOG[0]?.at.slice(0, 10) || '') },
          {
            label: 'Lưu trữ',
            value: (
              <span className="inline-flex items-center gap-1">
                <Lock size={11} /> bất biến · tối thiểu 5 năm
              </span>
            ),
          },
        ]}
      />

      <Panel
        title={
          <>
            Nhật ký thay đổi <span className="font-normal normal-case text-slate-500 tracking-normal">· {rows.length} dòng</span>
          </>
        }
        icon={ScrollText}
        noPad
        footer="Log bất biến: không sửa, không xoá (kể cả Admin); lưu tối thiểu 5 năm. Ghi các đối tượng trọng yếu: hợp đồng, phân bổ giá trị, nghiệm thu/ECV, gate, CR, rate card, allocation/điều chuyển, timesheet sau khoá, cấu hình. Xuất CSV theo bộ lọc hiện tại."
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
          <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300">
            <Filter size={13} className="text-[#1f5fa8]" /> Lọc
          </span>
          <FilterCell label="Người">
            <select value={actor} onChange={(e) => reset(() => setActor(e.target.value))} className={`${SEL} max-w-[150px]`}>
              <option value="">Tất cả</option>
              {actors.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </FilterCell>
          <FilterCell label="Đối tượng">
            <select value={entity} onChange={(e) => reset(() => setEntity(e.target.value))} className={SEL}>
              <option value="">Tất cả</option>
              {ENTITIES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </FilterCell>
          <FilterCell label="Sự kiện">
            <input value={action} onChange={(e) => reset(() => setAction(e.target.value))} placeholder="vd Duyệt, Từ chối, Mở lại" className={`${SEL} w-36`} />
          </FilterCell>
          <FilterCell label="Từ">
            <input type="date" value={from} max={to || undefined} onChange={(e) => reset(() => setFrom(e.target.value))} className={`${SEL} w-[130px] px-1.5!`} />
          </FilterCell>
          <FilterCell label="Đến">
            <input type="date" value={to} min={from || undefined} onChange={(e) => reset(() => setTo(e.target.value))} className={`${SEL} w-[130px] px-1.5!`} />
          </FilterCell>
          <FilterCell label="Tìm">
            <input value={q} onChange={(e) => reset(() => setQ(e.target.value))} placeholder="Mã, giá trị, IP…" className={`${SEL} w-36`} />
          </FilterCell>
          {anyFilter && (
            <button
              type="button"
              onClick={() => reset(() => (setActor(''), setEntity(''), setAction(''), setFrom(''), setTo(''), setQ('')))}
              className="text-[12px] text-[#1f5fa8] hover:underline cursor-pointer"
            >
              Bỏ lọc
            </button>
          )}
        </div>

        {focusId && (
          <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 bg-[#eaf2fc] border-b border-[#bcd3ee] text-[12px]">
            <History size={13} className="text-[#1f5fa8]" />
            <span>
              Lịch sử của <b className="font-mono text-[#1f5fa8]">{focusId}</b>
              {focusEntry && (
                <>
                  {' '}
                  · <Tag cls={ENTITY_CLS[focusEntry.entity]}>{focusEntry.entity}</Tag>
                </>
              )}{' '}
              · {rows.length} thay đổi, mới nhất trước
            </span>
            <Btn className="h-6! px-2! text-[11px]! ml-auto" icon={X} onClick={() => reset(() => setFocusId(''))}>
              Bỏ lọc đối tượng
            </Btn>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1180px]`}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 w-32`}>Thời điểm</th>
                <th className={`${erp.th} border-t-0 text-left w-40`}>Người</th>
                <th className={`${erp.th} border-t-0 w-32`}>Đối tượng</th>
                <th className={`${erp.th} border-t-0 text-left`}>Mã đối tượng</th>
                <th className={`${erp.th} border-t-0 text-left w-52`}>Hành động</th>
                <th className={`${erp.th} border-t-0 text-left`}>Trước → Sau</th>
                <th className={`${erp.th} border-t-0 border-r-0 w-28`}>IP</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((a) => (
                <tr key={a.id} className={erp.tr}>
                  <td className={`${erp.td} border-l-0 text-center tabular-nums whitespace-nowrap`} title={a.id}>
                    {atText(a.at)}
                  </td>
                  <td className={`${erp.td} whitespace-nowrap`}>{a.actor}</td>
                  <td className={`${erp.td} text-center`}>
                    <Tag cls={ENTITY_CLS[a.entity]}>{a.entity}</Tag>
                  </td>
                  <td className={erp.td}>
                    <button
                      type="button"
                      onClick={() => reset(() => setFocusId(a.entityId))}
                      className="text-left font-mono text-[11.5px] text-[#1f5fa8] hover:underline cursor-pointer"
                      title="Xem lịch sử của đối tượng này"
                    >
                      {a.entityId}
                    </button>
                  </td>
                  <td className={`${erp.td} text-slate-800`}>{a.action}</td>
                  <td className={erp.td}>
                    <span className="text-slate-400 line-through decoration-slate-400">{a.before}</span>
                    <span className="mx-1.5 text-slate-400">→</span>
                    <span className="font-semibold text-slate-900">{a.after}</span>
                  </td>
                  <td className={`${erp.td} border-r-0 text-center font-mono text-[11.5px] text-slate-500`}>{a.ip}</td>
                </tr>
              ))}
              {!shown.length && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-slate-400 italic">
                    Không có bản ghi nào khớp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {rows.length > PAGE && (
          <div className="flex items-center justify-end gap-2 px-3 py-1.5 border-t border-slate-200 text-[12px] text-slate-600">
            <span className="tabular-nums">
              {pg * PAGE + 1}–{Math.min(rows.length, pg * PAGE + PAGE)} / {rows.length}
            </span>
            <Btn className="h-7 px-2" icon={ChevronLeft} onClick={() => setPage(pg - 1)} disabled={pg === 0}>
              Trước
            </Btn>
            <span className="tabular-nums">
              Trang {pg + 1}/{pages}
            </span>
            <Btn className="h-7 px-2" onClick={() => setPage(pg + 1)} disabled={pg >= pages - 1}>
              Sau <ChevronRight size={14} />
            </Btn>
          </div>
        )}
      </Panel>
    </ErpPage>
  );
};
