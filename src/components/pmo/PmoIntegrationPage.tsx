/**
 * PmoIntegrationPage — PMO-16 Trung tâm tích hợp (F12.2, F4.1).
 *
 * Bố cục:
 *   hàng 1: thẻ trạng thái 5 connector (Jira, HR, Finance/ERP, SSO, Email/Teams) — OK xanh / Cảnh báo vàng / Lỗi đỏ;
 *           mỗi thẻ có "Test kết nối" (giả lập 1 giây) và "Chạy ngay". Bấm thẻ → mở cấu hình inline ngay bên dưới
 *           (endpoint, lịch, secret ở secret manager; Jira: mapping đối tượng, khoá wp_code, quy tắc xung đột;
 *           HR: import CSV theo mẫu có validate).
 *   hàng 2: mapping dự án PMO ↔ Jira project key (1–1), sửa inline.
 *   hàng 3: nhật ký đồng bộ (lọc hệ thống/trạng thái) + danh sách xung đột chưa xử lý ("Đã xử lý" inline).
 * Không popup. Dữ liệu mẫu, lưu trong phiên (STORE cấp module).
 */
import React, { useMemo, useRef, useState } from 'react';
import { AlertTriangle, Check, Download, FileSpreadsheet, Filter, GitCompare, KeyRound, Link2, Loader2, Pencil, Play, Plug, ScrollText, Upload, Wifi, X } from 'lucide-react';
import { PMO_PROJECTS, TODAY, dmy } from '../../pmo/pmo';
import { INTEGRATIONS, Integration, SYNC_LOGS, SyncLog } from '../../pmo/pmoData';
import { Btn, ErpPage, ErpTitleBar, FormRow, Panel, Tag, erp } from '../erp/Erp';

type Key = Integration['key'];
interface LogRow extends SyncLog {
  id: string;
  resolved?: string;
}
interface Conf {
  endpoint: string;
  schedule: string;
  secret: string;
  extra: string;
}

// ==========================================================================
// Lưu trong phiên
// ==========================================================================
const DEFAULT_CONF: Record<Key, Conf> = {
  Jira: { endpoint: 'https://jira.vtx.vn/rest/api/3', schedule: 'Webhook status + poll mỗi 15 phút', secret: 'vault://pmo/jira/api-token', extra: 'customfield_10231' },
  HR: { endpoint: 'sftp://hr.vtx.vn/export/pmo/', schedule: 'Nhân sự: thứ Hai 22:00 · Rate card: ngày 1 đầu quý', secret: 'vault://pmo/hr/sftp-key', extra: '' },
  'Finance/ERP': { endpoint: 'https://erp.vtx.vn/api/v2', schedule: 'Sự kiện ký HĐ/phụ lục · đối chiếu ECV ngày 1 hằng tháng', secret: 'vault://pmo/erp/client-secret', extra: '' },
  SSO: { endpoint: 'https://login.microsoftonline.com/vtx.vn/v2.0', schedule: 'Thời gian thực (OIDC) · đồng bộ group 30 phút', secret: 'vault://pmo/sso/client-secret', extra: '' },
  'Email/Teams': { endpoint: 'smtp.vtx.vn:587 · https://vtx.webhook.office.com/…', schedule: 'Theo sự kiện · digest 08:00 T2–T6', secret: 'vault://pmo/notify/smtp', extra: '' },
};
const jiraKeyOf = (id: string) => {
  const [k, , seq] = id.split('-');
  return `${k === 'BFSI' ? 'BF' : k === 'GPDV' ? 'GP' : k}${seq}`;
};
const STORE = new Map<string, unknown>();
const load = <T,>(k: string, init: () => T): T => (STORE.has(k) ? (STORE.get(k) as T) : init());

const STATUS_CLS: Record<Integration['status'], { bar: string; tag: string }> = {
  OK: { bar: 'border-t-emerald-600', tag: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'Cảnh báo': { bar: 'border-t-amber-400', tag: 'bg-amber-50 text-amber-700 border-amber-200' },
  Lỗi: { bar: 'border-t-rose-600', tag: 'bg-rose-50 text-rose-700 border-rose-200' },
};
const LOG_CLS: Record<SyncLog['status'], string> = {
  OK: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Lỗi: 'bg-rose-50 text-rose-700 border-rose-200',
  'Xung đột': 'bg-amber-50 text-amber-700 border-amber-200',
};
const SEL = `${erp.input} h-7 text-[12px]`;
const nowHm = () => new Date().toTimeString().slice(0, 5);

const FilterCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex items-center gap-1.5 min-w-0">
    <span className="text-[12px] text-slate-600 whitespace-nowrap">{label}</span>
    {children}
  </label>
);

// HR CSV mẫu + kết quả kiểm tra (giả lập)
const HR_TEMPLATE = 'ma_nv,ho_ten,email,khoi_goc,level,job_role,ngay_hieu_luc\nNV1000,Nguyễn Văn An,annv@vtx.vn,G1,Middle,DEV,2026-10-05\n';
const HR_ERRORS = [
  { line: 7, code: 'NV1013', col: 'level', err: 'Giá trị "Mid" không thuộc danh mục (Fresher/Junior/Middle/Senior/Lead)' },
  { line: 22, code: 'NV1045', col: 'khoi_goc', err: 'Khối "G5" không tồn tại' },
  { line: 41, code: '', col: 'ma_nv', err: 'Thiếu mã nhân viên (bắt buộc)' },
];

export const PmoIntegrationPage: React.FC<{ onNavigate?: (item: string) => void }> = () => {
  const [ints, setIntsRaw] = useState<Integration[]>(() => load('ints', () => INTEGRATIONS.map((x) => ({ ...x }))));
  const setInts = (fn: (x: Integration[]) => Integration[]) =>
    setIntsRaw((cur) => {
      const n = fn(cur);
      STORE.set('ints', n);
      return n;
    });
  const [logs, setLogsRaw] = useState<LogRow[]>(() => load('logs', () => SYNC_LOGS.map((l, i) => ({ ...l, id: `L${i}` }))));
  const setLogs = (fn: (x: LogRow[]) => LogRow[]) =>
    setLogsRaw((cur) => {
      const n = fn(cur);
      STORE.set('logs', n);
      return n;
    });
  const [confs, setConfsRaw] = useState<Record<Key, Conf>>(() => load('confs', () => ({ ...DEFAULT_CONF })));
  const [mapping, setMappingRaw] = useState<Record<string, string>>(() => load('mapping', () => Object.fromEntries(PMO_PROJECTS.map((p) => [p.id, jiraKeyOf(p.id)]))));

  const [open, setOpen] = useState<Key | null>(null);
  const [testing, setTesting] = useState<Key | null>(null);
  const [cardMsg, setCardMsg] = useState<Partial<Record<Key, { ok: boolean; text: string }>>>({});
  const cardFlash = (k: Key, ok: boolean, text: string) => {
    setCardMsg((m) => ({ ...m, [k]: { ok, text } }));
    window.setTimeout(() => setCardMsg((m) => ({ ...m, [k]: undefined })), 4000);
  };
  const [msg, setMsg] = useState('');
  const flash = (s: string) => {
    setMsg(s);
    window.setTimeout(() => setMsg(''), 3500);
  };

  // Cấu hình đang sửa
  const [draft, setDraft] = useState<Conf | null>(null);
  // HR import
  const fileRef = useRef<HTMLInputElement>(null);
  const [hrFile, setHrFile] = useState('');
  const [hrChecking, setHrChecking] = useState(false);
  const [hrChecked, setHrChecked] = useState(false);
  // Mapping Jira
  const [mapEdit, setMapEdit] = useState<string | null>(null);
  const [mapDraft, setMapDraft] = useState('');
  // Nhật ký
  const [fSys, setFSys] = useState('');
  const [fStatus, setFStatus] = useState('');

  const openCard = (k: Key) => {
    if (open === k) {
      setOpen(null);
      setDraft(null);
      return;
    }
    setOpen(k);
    setDraft({ ...confs[k] });
    setHrFile('');
    setHrChecked(false);
  };

  const testConn = (k: Key) => {
    setTesting(k);
    window.setTimeout(() => {
      setTesting(null);
      if (k === 'HR') cardFlash(k, false, 'Thất bại: timeout SFTP sau 30s (hr.vtx.vn:22)');
      else if (k === 'Email/Teams') cardFlash(k, true, 'Kết nối OK · 2 địa chỉ email trả về cần kiểm tra');
      else cardFlash(k, true, `Kết nối OK · ${Math.round(80 + Math.random() * 140)} ms`);
    }, 1000);
  };
  const runNow = (k: Key) => {
    const t = nowHm();
    if (k === 'HR') {
      setInts((cur) => cur.map((x) => (x.key === k ? { ...x, lastRun: t, failStreak: x.failStreak + 1, status: 'Lỗi' } : x)));
      setLogs((cur) => [{ id: `L${Date.now()}`, at: t, system: k, entity: 'nhan_su_w41.csv', direction: '←', status: 'Lỗi', detail: 'Timeout SFTP — chạy tay, vẫn lỗi; dùng import CSV thủ công' }, ...cur]);
      cardFlash(k, false, 'Chạy ngay: lỗi timeout — đã ghi log');
      return;
    }
    const n = Math.round(5 + Math.random() * 60);
    setInts((cur) => cur.map((x) => (x.key === k ? { ...x, lastRun: t, lastOk: t, failStreak: 0, records24h: x.records24h + n, status: x.status === 'Lỗi' ? 'OK' : x.status } : x)));
    setLogs((cur) => [{ id: `L${Date.now()}`, at: t, system: k, entity: 'Chạy tay', direction: k === 'Email/Teams' ? '→' : '←', status: 'OK', detail: `Đồng bộ ${n} bản ghi (admin chạy ngay)` }, ...cur]);
    cardFlash(k, true, `Đã chạy · ${n} bản ghi`);
  };

  const saveConf = () => {
    if (!open || !draft) return;
    const next = { ...confs, [open]: { ...draft } };
    setConfsRaw(next);
    STORE.set('confs', next);
    flash(`Đã lưu cấu hình ${open} · ghi audit`);
  };

  const checkHr = (name: string) => {
    setHrFile(name);
    setHrChecked(false);
    setHrChecking(true);
    window.setTimeout(() => {
      setHrChecking(false);
      setHrChecked(true);
    }, 900);
  };
  const importHr = () => {
    const t = nowHm();
    setLogs((cur) => [{ id: `L${Date.now()}`, at: t, system: 'HR', entity: hrFile, direction: '←', status: 'OK', detail: 'Import CSV thủ công: 46 dòng hợp lệ, bỏ qua 3 dòng lỗi' }, ...cur]);
    setInts((cur) => cur.map((x) => (x.key === 'HR' ? { ...x, status: 'Cảnh báo', failStreak: 0, lastRun: t, lastOk: t, records24h: 46 } : x)));
    setHrChecked(false);
    setHrFile('');
    flash('Đã nhập 46 nhân sự từ CSV · 3 dòng lỗi gửi lại HR');
  };
  const downloadTemplate = () => {
    const url = URL.createObjectURL(new Blob(['﻿' + HR_TEMPLATE], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mau_nhan_su_pmo.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const mapErr = (() => {
    if (mapEdit === null) return '';
    const v = mapDraft.trim().toUpperCase();
    if (!/^[A-Z][A-Z0-9]{1,9}$/.test(v)) return 'Key 2–10 ký tự, chữ in hoa/số, bắt đầu bằng chữ';
    const dup = Object.entries(mapping).find(([pid, k]) => pid !== mapEdit && k === v);
    return dup ? `Key đã gán cho ${dup[0]} (chỉ 1 dự án ↔ 1 Jira project)` : '';
  })();
  const saveMap = () => {
    if (!mapEdit || mapErr) return;
    const next = { ...mapping, [mapEdit]: mapDraft.trim().toUpperCase() };
    setMappingRaw(next);
    STORE.set('mapping', next);
    flash(`Đã đổi mapping ${mapEdit} → ${next[mapEdit]} · ghi audit`);
    setMapEdit(null);
  };

  const shownLogs = useMemo(() => logs.filter((l) => (!fSys || l.system === fSys) && (!fStatus || l.status === fStatus)), [logs, fSys, fStatus]);
  const conflicts = logs.filter((l) => l.status === 'Xung đột');
  const openConflicts = conflicts.filter((l) => !l.resolved);
  const resolve = (id: string) => setLogs((cur) => cur.map((l) => (l.id === id ? { ...l, resolved: `admin · ${dmy(TODAY)} ${nowHm()}` } : l)));

  const cur = open ? ints.find((x) => x.key === open)! : null;

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', 'Quản trị', 'Trung tâm tích hợp']}
        title="Trung tâm tích hợp"
        actions={msg ? <span className="text-[12px] text-emerald-700">{msg}</span> : undefined}
        meta={[
          { label: 'Connector', value: ints.length },
          { label: 'OK', value: <span className="text-emerald-700">{ints.filter((x) => x.status === 'OK').length}</span> },
          { label: 'Cảnh báo', value: <span className="text-amber-700">{ints.filter((x) => x.status === 'Cảnh báo').length}</span> },
          { label: 'Lỗi', value: <span className="text-rose-700">{ints.filter((x) => x.status === 'Lỗi').length}</span> },
          { label: 'Xung đột chưa xử lý', value: <span className={openConflicts.length ? 'text-amber-700' : ''}>{openConflicts.length}</span> },
          { label: 'Dữ liệu tại', value: `${dmy(TODAY)} 09:44` },
        ]}
      />

      {/* Thẻ trạng thái */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-2">
        {ints.map((x) => {
          const c = STATUS_CLS[x.status];
          const m = cardMsg[x.key];
          return (
            <div
              key={x.key}
              onClick={() => openCard(x.key)}
              className={`flex flex-col bg-white border border-t-[3px] ${c.bar} rounded-[4px] min-w-0 cursor-pointer hover:border-slate-400 ${open === x.key ? 'border-[#1f5fa8] ring-2 ring-[#1f5fa8]/30' : 'border-slate-300'}`}
            >
              <div className="flex items-center justify-between gap-2 px-2.5 pt-1.5">
                <span className="text-[14px] font-bold text-[#1e3a5f] flex items-center gap-1.5">
                  <Plug size={13} className="text-[#1f5fa8]" /> {x.key}
                </span>
                <Tag cls={c.tag}>{x.status}</Tag>
              </div>
              <dl className="px-2.5 py-1.5 text-[11.5px] space-y-0.5 tabular-nums">
                {[
                  ['Chiều', x.direction],
                  ['Dữ liệu', x.data],
                  ['Lịch chạy', x.schedule],
                  ['Chạy cuối', x.lastRun],
                  ['OK cuối', x.lastOk],
                  ['Bản ghi 24h', x.records24h.toLocaleString('vi-VN')],
                  ['Chế độ', x.mode],
                ].map(([l, v]) => (
                  <div key={l} className="flex gap-2">
                    <dt className="text-slate-500 w-[72px] shrink-0">{l}</dt>
                    <dd className="text-slate-800 min-w-0 leading-snug">{v}</dd>
                  </div>
                ))}
                <div className="flex gap-2">
                  <dt className="text-slate-500 w-[72px] shrink-0">Lỗi liên tiếp</dt>
                  <dd className={`font-bold ${x.failStreak >= 3 ? 'text-rose-700' : x.failStreak ? 'text-amber-700' : 'text-slate-800'}`}>
                    {x.failStreak}
                    {x.failStreak >= 3 && (
                      <span className="ml-1 inline-flex items-center gap-0.5 font-semibold">
                        <AlertTriangle size={11} /> AL-12 đã báo Admin
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
              <div className="mt-auto border-t border-slate-100 bg-slate-50/70 px-2 py-1.5 space-y-1" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-1">
                  <Btn className="h-6! px-2! text-[11px]!" icon={testing === x.key ? Loader2 : Wifi} onClick={() => testConn(x.key)} disabled={testing === x.key}>
                    {testing === x.key ? 'Đang kiểm tra…' : 'Test kết nối'}
                  </Btn>
                  <Btn className="h-6! px-2! text-[11px]!" icon={Play} onClick={() => runNow(x.key)}>
                    Chạy ngay
                  </Btn>
                </div>
                {m && <p className={`text-[11px] leading-tight ${m.ok ? 'text-emerald-700' : 'text-rose-700'}`}>{m.text}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cấu hình connector (inline) */}
      {open && cur && draft && (
        <Panel
          title={`Cấu hình connector · ${open}`}
          icon={KeyRound}
          actions={
            <>
              <Btn variant="primary" className="h-7" icon={Check} onClick={saveConf}>
                Lưu cấu hình
              </Btn>
              <Btn className="h-7" icon={X} onClick={() => (setOpen(null), setDraft(null))}>
                Đóng
              </Btn>
            </>
          }
          footer="Credential không nằm trong mã nguồn hay CSDL PMO — chỉ lưu tham chiếu tới secret manager. Retry 3 lần (1/5/15 phút); lỗi liên tiếp 3 lần → cảnh báo AL-12."
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-3">
            <div className="space-y-2">
              <FormRow label="URL / endpoint" required>
                <input value={draft.endpoint} onChange={(e) => setDraft({ ...draft, endpoint: e.target.value })} className={`${erp.inputFull} h-7 text-[12px] font-mono`} />
              </FormRow>
              <FormRow label="Lịch chạy" required>
                <input value={draft.schedule} onChange={(e) => setDraft({ ...draft, schedule: e.target.value })} className={`${erp.inputFull} h-7 text-[12px]`} />
              </FormRow>
              <FormRow label="Secret" hint="Không hiển thị giá trị — xoay vòng secret thực hiện trên secret manager">
                <div className="flex items-center gap-2 h-7 px-2 border border-slate-200 bg-slate-50 rounded-[3px] text-[12px] text-slate-600">
                  <KeyRound size={12} className="text-slate-400" />
                  <span>Lưu trong secret manager</span>
                  <span className="font-mono text-slate-500 truncate">{draft.secret}</span>
                </div>
              </FormRow>
              <FormRow label="Chế độ">
                <span className="text-[12px] text-slate-700 leading-7">{cur.mode}</span>
              </FormRow>
            </div>

            {open === 'Jira' && (
              <div className="space-y-2 min-w-0">
                <table className={erp.table}>
                  <thead>
                    <tr>
                      <th className={`${erp.th} text-left`}>PMO (nguồn kế hoạch)</th>
                      <th className={`${erp.th} w-10`}>↔</th>
                      <th className={`${erp.th} text-left`}>Jira (nguồn thực thi)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Feature', 'Epic'],
                      ['WP', 'Story'],
                      ['Release', 'Fix Version'],
                      ['Sprint', 'Sprint'],
                    ].map(([a, b]) => (
                      <tr key={a} className={erp.tr}>
                        <td className={`${erp.td} font-semibold`}>{a}</td>
                        <td className={`${erp.td} text-center text-slate-400`}>↔</td>
                        <td className={erp.td}>{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <FormRow label="Khoá đối chiếu" hint="wp_code ghi vào custom field này; không cho sửa tay trên Jira">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] text-slate-700">wp_code →</span>
                    <input value={draft.extra} onChange={(e) => setDraft({ ...draft, extra: e.target.value })} className={`${erp.input} h-7 text-[12px] font-mono w-44`} />
                  </div>
                </FormRow>
                <table className={erp.table}>
                  <thead>
                    <tr>
                      <th className={`${erp.th} text-left`}>Xung đột (sửa cả hai bên trong 15 phút)</th>
                      <th className={`${erp.th} text-left`}>Giữ bản</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={erp.tr}>
                      <td className={erp.td}>Trường kế hoạch: SP, release, sprint</td>
                      <td className={`${erp.td} font-semibold text-[#1f5fa8]`}>PMO</td>
                    </tr>
                    <tr className={erp.tr}>
                      <td className={erp.td}>Trường thực thi: status, assignee, worklog</td>
                      <td className={`${erp.td} font-semibold text-violet-700`}>Jira</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-[11.5px] text-slate-500">Mọi xung đột ghi conflict_log và hiện ở danh sách bên dưới. Jira project mới tạo từ template chuẩn có sẵn custom field Bug Owner, Bug origin, Phase found, Release, Linked WP.</p>
              </div>
            )}

            {open === 'HR' && (
              <div className="space-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[12px] font-semibold text-[#1e3a5f] flex items-center gap-1">
                    <FileSpreadsheet size={13} className="text-[#1f5fa8]" /> Import CSV nhân sự (OQ-011: chưa có API)
                  </span>
                  <Btn className="h-7 ml-auto" icon={Download} onClick={downloadTemplate}>
                    Tải file mẫu
                  </Btn>
                  <Btn className="h-7" icon={Upload} onClick={() => fileRef.current?.click()}>
                    Chọn file CSV
                  </Btn>
                  <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && checkHr(e.target.files[0].name)} />
                  <button type="button" onClick={() => checkHr('nhan_su_w41.csv')} className="text-[12px] text-[#1f5fa8] hover:underline cursor-pointer">
                    dùng file giả lập
                  </button>
                </div>
                {hrChecking && (
                  <p className="text-[12px] text-slate-600 flex items-center gap-1.5">
                    <Loader2 size={13} className="animate-spin" /> Đang kiểm tra {hrFile}…
                  </p>
                )}
                {hrChecked && (
                  <div className="border border-slate-200 rounded-[3px]">
                    <div className="flex flex-wrap items-center gap-3 px-2 py-1.5 bg-slate-50 border-b border-slate-200 text-[12px]">
                      <span className="font-mono">{hrFile}</span>
                      <span>
                        49 dòng · <b className="text-emerald-700">46 hợp lệ</b> · <b className="text-rose-700">3 lỗi</b>
                      </span>
                    </div>
                    <table className={erp.table}>
                      <thead>
                        <tr>
                          <th className={`${erp.th} border-t-0 border-l-0 w-14`}>Dòng</th>
                          <th className={`${erp.th} border-t-0 w-20`}>Mã NV</th>
                          <th className={`${erp.th} border-t-0 w-24`}>Cột</th>
                          <th className={`${erp.th} border-t-0 border-r-0 text-left`}>Lỗi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {HR_ERRORS.map((e) => (
                          <tr key={e.line} className="bg-rose-50/50">
                            <td className={`${erp.td} border-l-0 ${erp.num}`}>{e.line}</td>
                            <td className={`${erp.td} ${erp.code}`}>{e.code || <span className="text-slate-400">—</span>}</td>
                            <td className={`${erp.td} font-mono text-[11.5px]`}>{e.col}</td>
                            <td className={`${erp.td} border-r-0 text-rose-700`}>{e.err}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex items-center gap-1.5 px-2 py-1.5 border-t border-slate-200">
                      <Btn variant="primary" className="h-7" icon={Check} onClick={importHr}>
                        Nhập 46 dòng hợp lệ
                      </Btn>
                      <Btn className="h-7" onClick={() => (setHrChecked(false), setHrFile(''))}>
                        Huỷ
                      </Btn>
                      <span className="text-[11.5px] text-slate-500">Dòng lỗi không nhập; sửa trong file rồi tải lại.</span>
                    </div>
                  </div>
                )}
                <p className="text-[11.5px] text-slate-500">Nhân sự nhập hằng tuần; rate card nhập hằng quý ở màn Rate card (Finance). PMO không nhận lương cá nhân.</p>
              </div>
            )}

            {open === 'SSO' && (
              <div className="min-w-0">
                <p className="text-[12px] text-slate-600 mb-1">Group mapping (F12.1) — role lấy từ AD group khi đăng nhập:</p>
                <table className={erp.table}>
                  <thead>
                    <tr>
                      <th className={`${erp.th} text-left`}>AD group</th>
                      <th className={`${erp.th} text-left`}>Role PMO</th>
                      <th className={`${erp.th} text-left`}>Phạm vi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['PMO_PM_{KHỐI}', 'PM', 'Dự án được gán trong khối'],
                      ['PMO_GDSX_{KHỐI}', 'GĐSX', 'Khối'],
                      ['PMO_GDK_{KHỐI}', 'GĐK', 'Khối'],
                      ['PMO_TCT', 'TCT', 'Toàn TCT'],
                      ['PMO_FINANCE', 'Finance', 'Toàn TCT'],
                    ].map(([g, r, s]) => (
                      <tr key={g} className={erp.tr}>
                        <td className={`${erp.td} font-mono text-[11.5px]`}>{g}</td>
                        <td className={erp.td}>{r}</td>
                        <td className={erp.td}>{s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {open === 'Finance/ERP' && (
              <ul className="text-[12px] text-slate-600 list-disc pl-4 space-y-0.5">
                <li>Hợp đồng ký trên ERP → tự tạo dự án PMO (F1.1), PM nhận thông báo.</li>
                <li>Phụ lục HĐ từ CR tính phí → cập nhật giá trị HĐ + baseline.</li>
                <li>ECV tháng đối chiếu ngược về ERP ngày 1 hằng tháng để khớp sổ.</li>
              </ul>
            )}
            {open === 'Email/Teams' && (
              <ul className="text-[12px] text-slate-600 list-disc pl-4 space-y-0.5">
                <li>Cảnh báo AL-01…AL-12 gửi theo sự kiện; digest 08:00 T2–T6.</li>
                <li>Email trả về (bounce) được liệt kê trong nhật ký; 2 địa chỉ đang lỗi → trạng thái Cảnh báo.</li>
              </ul>
            )}
          </div>
        </Panel>
      )}

      {/* Mapping dự án ↔ Jira */}
      <Panel
        title={
          <>
            Mapping dự án ↔ Jira project <span className="font-normal normal-case text-slate-500 tracking-normal">· {PMO_PROJECTS.length} dự án</span>
          </>
        }
        icon={Link2}
        noPad
        footer="Quy tắc: 1 dự án PMO ↔ 1 Jira project (hoặc 1 board) — không cho phép nhiều-nhiều để tránh trùng WP. Đổi key sẽ đồng bộ lại toàn bộ WP ở lần chạy kế tiếp."
      >
        <div className="overflow-x-auto max-h-[340px] overflow-y-auto">
          <table className={`${erp.table} min-w-[820px]`}>
            <thead className="sticky top-0 z-10">
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 text-left w-36`}>Mã dự án</th>
                <th className={`${erp.th} border-t-0 text-left`}>Tên dự án</th>
                <th className={`${erp.th} border-t-0 w-16`}>Khối</th>
                <th className={`${erp.th} border-t-0 text-left w-56`}>Jira project key</th>
                <th className={`${erp.th} border-t-0 w-24`}>Board</th>
                <th className={`${erp.th} border-t-0 w-28`}>Sync cuối</th>
                <th className={`${erp.th} border-t-0 border-r-0 w-36`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {PMO_PROJECTS.map((p, i) => {
                const editing = mapEdit === p.id;
                return (
                  <tr key={p.id} className={editing ? 'bg-[#eaf2fc]' : erp.tr}>
                    <td className={`${erp.td} border-l-0 ${erp.code}`}>{p.code}</td>
                    <td className={erp.td}>{p.name}</td>
                    <td className={`${erp.td} text-center`}>{p.khoi}</td>
                    <td className={erp.td}>
                      {editing ? (
                        <>
                          <input
                            autoFocus
                            value={mapDraft}
                            onChange={(e) => setMapDraft(e.target.value.toUpperCase())}
                            onKeyDown={(e) => (e.key === 'Enter' ? saveMap() : e.key === 'Escape' ? setMapEdit(null) : null)}
                            className={`${erp.input} h-7 text-[12px] font-mono w-32 ${mapErr ? 'border-rose-400' : ''}`}
                          />
                          {mapErr && <span className="block text-[11px] text-rose-600 mt-0.5">{mapErr}</span>}
                        </>
                      ) : (
                        <span className="font-mono font-semibold text-violet-700">{mapping[p.id]}</span>
                      )}
                    </td>
                    <td className={`${erp.td} text-center tabular-nums text-slate-600`}>{100 + i * 3}</td>
                    <td className={`${erp.td} text-center tabular-nums`}>{p.lastSync}</td>
                    <td className={`${erp.td} border-r-0 text-center`}>
                      {editing ? (
                        <div className="inline-flex gap-1">
                          <Btn variant="success" className="h-6! px-2! text-[11px]!" icon={Check} onClick={saveMap} disabled={!!mapErr}>
                            Lưu
                          </Btn>
                          <Btn className="h-6! px-2! text-[11px]!" onClick={() => setMapEdit(null)}>
                            Huỷ
                          </Btn>
                        </div>
                      ) : (
                        <Btn className="h-6! px-2! text-[11px]!" icon={Pencil} onClick={() => (setMapEdit(p.id), setMapDraft(mapping[p.id]))} disabled={!!mapEdit}>
                          Sửa
                        </Btn>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-3 items-start">
        {/* Nhật ký đồng bộ */}
        <Panel
          title={
            <>
              Nhật ký đồng bộ <span className="font-normal normal-case text-slate-500 tracking-normal">· {shownLogs.length} dòng hôm nay</span>
            </>
          }
          icon={ScrollText}
          noPad
          footer="Log giữ 90 ngày (integration_log); lưu payload_hash, không lưu nội dung nhạy cảm."
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
            <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300">
              <Filter size={13} className="text-[#1f5fa8]" /> Lọc
            </span>
            <FilterCell label="Hệ thống">
              <select value={fSys} onChange={(e) => setFSys(e.target.value)} className={SEL}>
                <option value="">Tất cả</option>
                {ints.map((x) => (
                  <option key={x.key}>{x.key}</option>
                ))}
              </select>
            </FilterCell>
            <FilterCell label="Trạng thái">
              <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className={SEL}>
                <option value="">Tất cả</option>
                <option>OK</option>
                <option>Lỗi</option>
                <option>Xung đột</option>
              </select>
            </FilterCell>
          </div>
          <div className="overflow-x-auto">
            <table className={`${erp.table} min-w-[720px]`}>
              <thead>
                <tr>
                  <th className={`${erp.th} border-t-0 border-l-0 w-16`}>Giờ</th>
                  <th className={`${erp.th} border-t-0 w-24`}>Hệ thống</th>
                  <th className={`${erp.th} border-t-0 w-10`}>Chiều</th>
                  <th className={`${erp.th} border-t-0 text-left w-44`}>Đối tượng</th>
                  <th className={`${erp.th} border-t-0 w-20`}>Kết quả</th>
                  <th className={`${erp.th} border-t-0 border-r-0 text-left`}>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {shownLogs.map((l) => (
                  <tr key={l.id} className={erp.tr}>
                    <td className={`${erp.td} border-l-0 text-center tabular-nums`}>{l.at}</td>
                    <td className={`${erp.td} text-center`}>{l.system}</td>
                    <td className={`${erp.td} text-center font-bold text-slate-500`} title={l.direction === '←' ? 'Vào PMO' : 'Ra khỏi PMO'}>
                      {l.direction}
                    </td>
                    <td className={`${erp.td} font-mono text-[11.5px]`}>{l.entity}</td>
                    <td className={`${erp.td} text-center`}>
                      <Tag cls={LOG_CLS[l.status]}>{l.status}</Tag>
                    </td>
                    <td className={`${erp.td} border-r-0 text-slate-700`}>
                      {l.detail}
                      {l.resolved && <span className="ml-1.5 text-[11px] text-emerald-700">· đã xử lý</span>}
                    </td>
                  </tr>
                ))}
                {!shownLogs.length && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-slate-400 italic">
                      Không có dòng log nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Xung đột */}
        <Panel
          title={
            <>
              Xung đột chưa xử lý <span className="font-normal normal-case text-slate-500 tracking-normal">· {openConflicts.length}</span>
            </>
          }
          icon={GitCompare}
          noPad
          footer="Hệ thống đã tự áp quy tắc (kế hoạch giữ PMO, thực thi giữ Jira); Admin xác nhận để đóng xung đột."
        >
          <div className="divide-y divide-slate-200">
            {conflicts.map((l) => (
              <div key={l.id} className={`px-3 py-2 ${l.resolved ? 'bg-slate-50' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 tabular-nums">{l.at}</span>
                  <span className="font-mono text-[12px] text-[#1f5fa8]">{l.entity}</span>
                  <span className="ml-auto">
                    {l.resolved ? (
                      <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-200" icon={Check}>
                        Đã xử lý
                      </Tag>
                    ) : (
                      <Btn variant="success" className="h-6! px-2! text-[11px]!" icon={Check} onClick={() => resolve(l.id)}>
                        Đã xử lý
                      </Btn>
                    )}
                  </span>
                </div>
                <p className={`text-[12px] mt-0.5 ${l.resolved ? 'text-slate-500' : 'text-slate-700'}`}>{l.detail}</p>
                {l.resolved && <p className="text-[11px] text-emerald-700">Xác nhận bởi {l.resolved} · ghi audit</p>}
              </div>
            ))}
            {!conflicts.length && <p className="px-3 py-6 text-center text-slate-400 italic text-[12px]">Không có xung đột.</p>}
          </div>
        </Panel>
      </div>
    </ErpPage>
  );
};
