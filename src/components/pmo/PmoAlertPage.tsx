/**
 * PmoAlertPage — PMO-13 Trung tâm cảnh báo (F6.4 Cảnh báo & thông báo · Phụ lục B bộ 12 cảnh báo mặc định).
 *
 * Tab "Cảnh báo": dải đếm Mới / Đang xử lý / Đóng / Đỏ / Vàng (bấm để lọc) + bộ lọc một hàng
 *   (Mức · Trạng thái · Rule · Khối · Dự án · chỉ cảnh báo gửi tới vai trò của tôi) + bảng cảnh báo.
 *   Thao tác ngay trên dòng: "Nhận xử lý" (Mới → Đang xử lý, gán vai trò hiện tại), ghi chú inline, "Đóng".
 * Tab "Cài đặt của tôi": bảng 12 rule × kênh In-app / Email / Teams + bật/tắt; rule Đỏ khoá không tắt được;
 *   chọn giờ gửi digest (mặc định 08:00).
 * Trạng thái cảnh báo và cài đặt giữ trong STORE cấp module để không mất khi đổi màn.
 */
import React, { useState } from 'react';
import { Bell, Check, Filter, Lock, Settings, X } from 'lucide-react';
import { KHOI } from '../../pmo/pmo';
import { usePmo } from '../../pmo/PmoContext';
import { ALERTS_SEED, ALERT_RULES, Alert, AlertStatus } from '../../pmo/pmoData';
import { Btn, ErpPage, ErpTitleBar, FolderTabs, Panel, Tag, erp } from '../erp/Erp';
import { RoleSelect } from './PmoBits';

// ==========================================================================
// Trạng thái trong phiên
// ==========================================================================
const STORE = new Map<string, Alert>(ALERTS_SEED.map((a) => [a.id, { ...a }]));
interface ChannelPref {
  on: boolean;
  inapp: boolean;
  email: boolean;
  teams: boolean;
}
const PREFS = new Map<string, ChannelPref>(ALERT_RULES.map((r) => [r.code, { on: true, inapp: true, email: true, teams: r.severity === 'Đỏ' }]));
const DIGEST = { hour: '08:00' };

const SEV_CLS: Record<'Đỏ' | 'Vàng', string> = {
  Đỏ: 'bg-rose-600 text-white border-rose-700',
  Vàng: 'bg-amber-400 text-slate-900 border-amber-500',
};
const STATUS_CLS: Record<AlertStatus, string> = {
  Mới: 'bg-sky-50 text-sky-700 border-sky-200',
  'Đang xử lý': 'bg-amber-50 text-amber-700 border-amber-200',
  Đóng: 'bg-slate-50 text-slate-500 border-slate-200',
};
const SEL = `${erp.input} h-7 text-[12px]`;
const NOW = '2026-10-09 10:05';
const dt = (s: string) => `${s.slice(8, 10)}/${s.slice(5, 7)} ${s.slice(11, 16)}`;
const DIGEST_HOURS = ['07:00', '07:30', '08:00', '08:30', '09:00'];

type TabKey = 'alerts' | 'settings';

export const PmoAlertPage: React.FC<{ onNavigate?: (item: string) => void }> = ({ onNavigate }) => {
  const { projects, setFocusId, role, setRole, khoi } = usePmo();
  const [tab, setTab] = useState<TabKey>('alerts');
  const [, setTick] = useState(0);
  const rerender = () => setTick((t) => t + 1);
  const [fSev, setFSev] = useState('');
  const [fStatus, setFStatus] = useState<string>('open');
  const [fRule, setFRule] = useState('');
  const [fKhoi, setFKhoi] = useState<string>(role === 'TCT' ? '' : khoi);
  const [fProj, setFProj] = useState('');
  const [mine, setMine] = useState(false);
  const [msg, setMsg] = useState('');
  const flash = (s: string) => {
    setMsg(s);
    window.setTimeout(() => setMsg(''), 3500);
  };

  const proj = (id: string) => projects.find((p) => p.id === id);
  const rule = (code: string) => ALERT_RULES.find((r) => r.code === code)!;
  const all = [...STORE.values()];
  const scoped = all.filter((a) => {
    const p = proj(a.projectId);
    return (!fKhoi || p?.khoi === fKhoi) && (!fProj || a.projectId === fProj) && (!mine || rule(a.rule).recipients.includes(role));
  });
  const rows = scoped
    .filter(
      (a) =>
        (!fSev || a.severity === fSev) &&
        (!fRule || a.rule === fRule) &&
        (!fStatus || (fStatus === 'open' ? a.status !== 'Đóng' : a.status === fStatus)),
    )
    .sort(
      (a, b) =>
        (a.status === 'Đóng' ? 1 : 0) - (b.status === 'Đóng' ? 1 : 0) ||
        (a.severity === 'Đỏ' ? 0 : 1) - (b.severity === 'Đỏ' ? 0 : 1) ||
        b.openedAt.localeCompare(a.openedAt),
    );
  const cnt = (f: (a: Alert) => boolean) => scoped.filter(f).length;
  const projOpts = projects.filter((p) => !fKhoi || p.khoi === fKhoi);

  const patch = (id: string, ch: Partial<Alert>) => {
    STORE.set(id, { ...STORE.get(id)!, ...ch });
    rerender();
  };
  const take = (a: Alert) => {
    patch(a.id, { status: 'Đang xử lý', handler: `${role} (bạn)` });
    flash(`${a.id} chuyển sang Đang xử lý — người xử lý: ${role}`);
  };
  const close = (a: Alert) => {
    patch(a.id, { status: 'Đóng', note: a.note.trim() || `Đóng thủ công bởi ${role} lúc ${dt(NOW)}` });
    flash(`Đã đóng ${a.id} — ghi audit`);
  };
  const openCockpit = (id: string) => {
    setFocusId(id);
    onNavigate?.('Project Cockpit');
  };

  const setPref = (code: string, ch: Partial<ChannelPref>) => {
    PREFS.set(code, { ...PREFS.get(code)!, ...ch });
    rerender();
  };

  const counter = (label: string, n: number, active: boolean, onClick: () => void, cls = 'text-slate-900') => (
    <button type="button" onClick={onClick} className={`text-left px-3 py-2 min-w-0 cursor-pointer hover:bg-slate-50 ${active ? 'bg-[#eaf2fc]' : ''}`}>
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500 truncate">{label}</p>
      <p className={`text-[17px] font-bold tabular-nums leading-tight ${cls}`}>{n}</p>
    </button>
  );

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', 'Trung tâm cảnh báo']}
        title="Trung tâm cảnh báo"
        actions={
          <>
            {msg && <span className="text-[12px] text-emerald-700 mr-1">{msg}</span>}
            <RoleSelect value={role} onChange={setRole} />
          </>
        }
      />

      <div className="bg-white border border-slate-300 rounded-[4px] overflow-hidden">
        <div className="pt-1.5 bg-[#f3f6fa]">
          <FolderTabs<TabKey>
            tabs={[
              { key: 'alerts', label: `Cảnh báo (${cnt((a) => a.status !== 'Đóng')} mở)`, icon: Bell },
              { key: 'settings', label: 'Cài đặt của tôi', icon: Settings },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>

        {tab === 'alerts' && (
          <>
            <div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-slate-200 border-b border-slate-200">
              {counter('Mới', cnt((a) => a.status === 'Mới'), fStatus === 'Mới', () => setFStatus(fStatus === 'Mới' ? 'open' : 'Mới'), 'text-sky-700')}
              {counter('Đang xử lý', cnt((a) => a.status === 'Đang xử lý'), fStatus === 'Đang xử lý', () => setFStatus(fStatus === 'Đang xử lý' ? 'open' : 'Đang xử lý'), 'text-amber-700')}
              {counter('Đóng', cnt((a) => a.status === 'Đóng'), fStatus === 'Đóng', () => setFStatus(fStatus === 'Đóng' ? 'open' : 'Đóng'), 'text-slate-500')}
              {counter('Đỏ đang mở', cnt((a) => a.severity === 'Đỏ' && a.status !== 'Đóng'), fSev === 'Đỏ', () => setFSev(fSev === 'Đỏ' ? '' : 'Đỏ'), 'text-rose-700')}
              {counter('Vàng đang mở', cnt((a) => a.severity === 'Vàng' && a.status !== 'Đóng'), fSev === 'Vàng', () => setFSev(fSev === 'Vàng' ? '' : 'Vàng'), 'text-amber-600')}
              <div className="px-3 py-2 min-w-0 col-span-3 md:col-span-1">
                <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500 truncate">Digest kế tiếp</p>
                <p className="text-[17px] font-bold tabular-nums leading-tight text-slate-900">{DIGEST.hour} mai</p>
                <p className="text-[11px] text-slate-500 truncate">đỏ gửi ngay, không chờ digest</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
              <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300">
                <Filter size={13} className="text-[#1f5fa8]" /> Lọc
              </span>
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
                Mức
                <select value={fSev} onChange={(e) => setFSev(e.target.value)} className={SEL}>
                  <option value="">Tất cả</option>
                  <option>Đỏ</option>
                  <option>Vàng</option>
                </select>
              </label>
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
                Trạng thái
                <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className={SEL}>
                  <option value="open">Đang mở</option>
                  <option value="">Tất cả</option>
                  <option>Mới</option>
                  <option>Đang xử lý</option>
                  <option>Đóng</option>
                </select>
              </label>
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
                Rule
                <select value={fRule} onChange={(e) => setFRule(e.target.value)} className={`${SEL} max-w-[240px]`}>
                  <option value="">Tất cả</option>
                  {ALERT_RULES.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.code} · {r.condition}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
                Khối
                <select value={fKhoi} onChange={(e) => (setFKhoi(e.target.value), setFProj(''))} className={SEL}>
                  <option value="">Tất cả</option>
                  {KHOI.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
                Dự án
                <select value={fProj} onChange={(e) => setFProj(e.target.value)} className={`${SEL} max-w-[240px]`}>
                  <option value="">Tất cả</option>
                  {projOpts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} · {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600 cursor-pointer">
                <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} className="accent-[#1f5fa8]" />
                Chỉ gửi tới vai trò {role}
              </label>
              {(fSev || fRule || fProj || fStatus !== 'open' || mine) && (
                <button type="button" onClick={() => (setFSev(''), setFRule(''), setFProj(''), setFStatus('open'), setMine(false))} className="text-[12px] text-[#1f5fa8] hover:underline cursor-pointer">
                  Bỏ lọc
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className={`${erp.table} min-w-[1280px]`}>
                <thead>
                  <tr>
                    <th className={`${erp.th} border-t-0 border-l-0 text-left w-16`}>Mã</th>
                    <th className={`${erp.th} border-t-0 text-left w-44`}>Rule · điều kiện</th>
                    <th className={`${erp.th} border-t-0 text-left w-44`}>Dự án</th>
                    <th className={`${erp.th} border-t-0 text-left min-w-[240px]`}>Nội dung</th>
                    <th className={`${erp.th} border-t-0 text-center w-14`}>Mức</th>
                    <th className={`${erp.th} border-t-0 text-center w-24`}>Mở lúc</th>
                    <th className={`${erp.th} border-t-0 text-center w-24`}>Trạng thái</th>
                    <th className={`${erp.th} border-t-0 text-left w-28`}>Người xử lý</th>
                    <th className={`${erp.th} border-t-0 text-left w-40`}>Ghi chú</th>
                    <th className={`${erp.th} border-t-0 border-r-0 text-center w-32`}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => {
                    const p = proj(a.projectId);
                    const r = rule(a.rule);
                    return (
                      <tr key={a.id} className={a.status === 'Đóng' ? 'bg-slate-50/60 text-slate-500' : erp.tr}>
                        <td className={`${erp.td} border-l-0 ${erp.code} align-top`}>{a.id}</td>
                        <td className={`${erp.td} align-top`}>
                          <b className="text-slate-800">{a.rule}</b>
                          <span className="block text-[11.5px] text-slate-600 leading-tight">{r.condition}</span>
                          <span className="block text-[10.5px] text-slate-400">→ {r.recipients}</span>
                        </td>
                        <td className={`${erp.td} align-top`}>
                          <button type="button" onClick={() => openCockpit(a.projectId)} className="text-left text-[#1f5fa8] hover:underline cursor-pointer leading-tight" title="Mở Project Cockpit">
                            <span className="font-mono text-[11.5px]">{a.projectId}</span>
                            <span className="block text-slate-700">{p?.name}</span>
                          </button>
                        </td>
                        <td className={`${erp.td} align-top`}>{a.message}</td>
                        <td className={`${erp.td} align-top text-center`}>
                          <Tag cls={SEV_CLS[a.severity]}>{a.severity}</Tag>
                        </td>
                        <td className={`${erp.td} align-top text-center tabular-nums whitespace-nowrap`}>{dt(a.openedAt)}</td>
                        <td className={`${erp.td} align-top text-center`}>
                          <Tag cls={STATUS_CLS[a.status]}>{a.status}</Tag>
                        </td>
                        <td className={`${erp.td} align-top`}>{a.handler || <span className="text-slate-400">—</span>}</td>
                        <td className={`${erp.td} align-top`}>
                          {a.status === 'Đóng' ? (
                            <span className="text-[11.5px]">{a.note || '—'}</span>
                          ) : (
                            <input
                              value={a.note}
                              onChange={(e) => patch(a.id, { note: e.target.value })}
                              placeholder="Thêm ghi chú…"
                              className={`${erp.input} h-7 text-[12px] w-full`}
                            />
                          )}
                        </td>
                        <td className={`${erp.td} border-r-0 align-top text-center`}>
                          {a.status === 'Mới' && (
                            <Btn variant="primary" className="h-6! px-2! text-[11px]!" icon={Check} onClick={() => take(a)}>
                              Nhận xử lý
                            </Btn>
                          )}
                          {a.status === 'Đang xử lý' && (
                            <Btn className="h-6! px-2! text-[11px]!" icon={X} onClick={() => close(a)} title={a.note.trim() ? '' : 'Chưa có ghi chú — hệ thống ghi "Đóng thủ công"'}>
                              Đóng
                            </Btn>
                          )}
                          {a.status === 'Đóng' && <span className="text-[11px] text-slate-400">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                  {!rows.length && (
                    <tr>
                      <td colSpan={10} className="px-3 py-8 text-center text-slate-400 italic">
                        Không có cảnh báo nào khớp bộ lọc.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-3 py-1.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
              Cảnh báo đóng tự động khi điều kiện hết (vd WP hết blocked, CR đã quyết định). Thông báo gộp vào digest {DIGEST.hour} sáng, trừ cảnh báo đỏ gửi ngay. Số cảnh báo mở
              hiển thị trên Portfolio và Project Cockpit.
            </div>
          </>
        )}

        {tab === 'settings' && (
          <>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
                Giờ gửi digest
                <select value={DIGEST.hour} onChange={(e) => ((DIGEST.hour = e.target.value), rerender())} className={SEL}>
                  {DIGEST_HOURS.map((h) => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
              </label>
              <span className="text-[12px] text-slate-500">Cài đặt cho tài khoản đang đăng nhập (vai trò {role}).</span>
              <Btn variant="primary" className="h-7 ml-auto" icon={Check} onClick={() => flash('Đã lưu cài đặt thông báo cá nhân')}>
                Lưu cài đặt
              </Btn>
            </div>
            <div className="overflow-x-auto">
              <table className={`${erp.table} min-w-[960px]`}>
                <thead>
                  <tr>
                    <th className={`${erp.th} border-t-0 border-l-0 text-left w-16`}>Rule</th>
                    <th className={`${erp.th} border-t-0 text-left`}>Điều kiện</th>
                    <th className={`${erp.th} border-t-0 text-center w-16`}>Mức</th>
                    <th className={`${erp.th} border-t-0 text-left w-48`}>Người nhận mặc định</th>
                    <th className={`${erp.th} border-t-0 text-center w-20`}>Bật</th>
                    <th className={`${erp.th} border-t-0 text-center w-20`}>In-app</th>
                    <th className={`${erp.th} border-t-0 text-center w-20`}>Email</th>
                    <th className={`${erp.th} border-t-0 text-center w-20`}>Teams</th>
                    <th className={`${erp.th} border-t-0 border-r-0 text-center w-28`}>Thời điểm gửi</th>
                  </tr>
                </thead>
                <tbody>
                  {ALERT_RULES.map((r) => {
                    const pr = PREFS.get(r.code)!;
                    const red = r.severity === 'Đỏ';
                    const on = red || pr.on;
                    const box = (k: 'inapp' | 'email' | 'teams', locked = false) => (
                      <td className={`${erp.td} text-center`}>
                        <input
                          type="checkbox"
                          checked={locked ? true : on && pr[k]}
                          disabled={locked || !on}
                          onChange={(e) => setPref(r.code, { [k]: e.target.checked })}
                          className="w-3.5 h-3.5 accent-[#1f5fa8] disabled:opacity-50"
                          title={locked ? 'Cảnh báo đỏ luôn hiện trong ứng dụng' : undefined}
                        />
                      </td>
                    );
                    return (
                      <tr key={r.code} className={on ? erp.tr : 'bg-slate-50 text-slate-400'}>
                        <td className={`${erp.td} border-l-0 ${erp.code}`}>{r.code}</td>
                        <td className={erp.td}>{r.condition}</td>
                        <td className={`${erp.td} text-center`}>
                          <Tag cls={SEV_CLS[r.severity]}>{r.severity}</Tag>
                        </td>
                        <td className={`${erp.td} text-[11.5px]`}>{r.recipients}</td>
                        <td className={`${erp.td} text-center`}>
                          <span className="inline-flex items-center gap-1">
                            <input
                              type="checkbox"
                              checked={on}
                              disabled={red}
                              onChange={(e) => setPref(r.code, { on: e.target.checked })}
                              className="w-3.5 h-3.5 accent-emerald-600 disabled:opacity-60"
                              title={red ? 'Cảnh báo đỏ không tắt được' : undefined}
                            />
                            {red && <Lock size={11} className="text-slate-400" />}
                          </span>
                        </td>
                        {box('inapp', red)}
                        {box('email')}
                        {box('teams')}
                        <td className={`${erp.td} border-r-0 text-center text-[11.5px] whitespace-nowrap`}>
                          {!on ? <span>Tắt</span> : red ? <b className="text-rose-700">Gửi ngay</b> : <span>Digest {DIGEST.hour}</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-3 py-1.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center gap-1.5">
              <Lock size={11} className="shrink-0" />
              Cảnh báo mức Đỏ bị khoá: không tắt được và luôn hiện in-app, gửi ngay không chờ digest; chỉ chọn thêm kênh Email/Teams. Cảnh báo Vàng gộp vào digest {DIGEST.hour} sáng.
            </div>
          </>
        )}
      </div>
    </ErpPage>
  );
};
