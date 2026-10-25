/** UI nhỏ dùng chung cho các màn Danh mục hợp đồng / Template hợp đồng (bộ khung ERP). */
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { erp } from '../erp/Erp';

export const INPUT = erp.inputFull;
export const LINK = 'inline-flex items-center gap-1 text-[12px] font-semibold text-[#1f5fa8] hover:underline cursor-pointer disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed';
export const ACTIVE_BTN = '!bg-[#eef4fb] !border-[#1f5fa8] !text-[#1f5fa8]';
export const errCls = (e?: string) => (e ? '!border-rose-400 !bg-rose-50/40' : '');
export const ErrText: React.FC<{ e?: string }> = ({ e }) => (e ? <span className="block text-[11px] text-rose-600 mt-0.5">{e}</span> : null);
export const lb = (text: string, req?: boolean, editing = true) => (
  <>
    {text}
    {editing && req && <span className="text-rose-600 ml-0.5">*</span>}
  </>
);
export const ACTIVE_TAG = 'bg-emerald-50 text-emerald-700 border-emerald-300';
export const INACTIVE_TAG = 'bg-slate-100 text-slate-500 border-slate-300';
export const fmtAt = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
export const fileSize = (n: number) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
export const nowIso = () => new Date().toISOString();
export const uid = () => Math.random().toString(36).slice(2, 9);
export const ME = 'hr.lan';

export const useFlash = () => {
  const [msg, setMsg] = useState('');
  const flash = (m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg(''), 3500);
  };
  const node = msg ? <div className="fixed top-4 right-4 z-[60] rounded-[4px] border border-[#184c88] bg-[#1e3a5f] text-white text-[12.5px] px-4 py-2.5 shadow-xl max-w-[560px]">{msg}</div> : null;
  return { flash, toast: node };
};

export const exportSheet = (name: string, sheet: string, head: string[], rows: (string | number)[][]) => {
  const ws = XLSX.utils.aoa_to_sheet([head, ...rows]);
  ws['!cols'] = head.map((h, i) => ({ wch: Math.min(60, Math.max(h.length + 2, ...rows.map((r) => String(r[i] ?? '').length + 2))) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheet);
  XLSX.writeFile(wb, name);
};
