/**
 * PmoPortfolioPage — PMO-02 Portfolio khối (F1.2 + F6.3) và PMO-04 Portfolio TCT (F6.3).
 *
 * scope='khoi': thẻ tổng hợp của khối + bảng dự án (health, phase, %ECV vs plan, margin, PM, cảnh báo).
 * scope='tct' : thẻ 7 khối so sánh (ECV vs plan, margin, phân bố health, cảnh báo) → bấm thẻ lọc bảng dự án theo khối.
 * Bấm dòng dự án → mở Project Cockpit. Bộ lọc gọn một hàng.
 */
import React, { useMemo, useState } from 'react';
import { Building2, Filter, LayoutGrid } from 'lucide-react';
import { Health, HEALTH_DOT, HEALTH_LABEL, KHOI, PHASES, PmoProject, dmy, fmtTy, marginOf, pct, rand } from '../../pmo/pmo';
import { usePmo } from '../../pmo/PmoContext';
import { ErpPage, ErpTitleBar, Panel, erp } from '../erp/Erp';
import { HealthBadge, PhaseStrip, RoleSelect, TypeTag } from './PmoBits';

const FilterCell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex items-center gap-1.5 min-w-0">
    <span className="text-[12px] text-slate-600 whitespace-nowrap">{label}</span>
    {children}
  </label>
);
const SEL = `${erp.input} h-7 text-[12px]`;

/** Số liệu tổng hợp một nhóm dự án (khối hoặc toàn TCT). */
const summarize = (ps: PmoProject[], key: string) => {
  const ecv = ps.reduce((s, p) => s + p.ecv, 0);
  const ecvPlan = ps.reduce((s, p) => s + p.ecvPlan, 0);
  const cost = ps.reduce((s, p) => s + p.costUsed, 0);
  const contract = ps.reduce((s, p) => s + p.contractValue, 0);
  const mix: Record<Health, number> = { green: 0, yellow: 0, red: 0 };
  ps.forEach((p) => mix[p.health]++);
  return {
    n: ps.length,
    contract,
    ecv,
    ecvPlan,
    ecvVsPlan: ecvPlan ? (ecv / ecvPlan - 1) * 100 : 0,
    margin: ecv ? ((ecv - cost) / ecv) * 100 : 0,
    mix,
    alerts: ps.reduce((s, p) => s + p.alertsOpen, 0),
    utilization: Math.round(78 + rand(key, 'util') * 18), // mẫu: từ allocation (F8.1)
  };
};

export const PmoPortfolioPage: React.FC<{ scope: 'khoi' | 'tct'; onNavigate?: (item: string) => void }> = ({ scope, onNavigate }) => {
  const { projects, setFocusId, role, setRole, khoi, setKhoi } = usePmo();
  const [khoiFilter, setKhoiFilter] = useState<string>(scope === 'tct' ? '' : khoi);
  const [phase, setPhase] = useState('');
  const [type, setType] = useState('');
  const [health, setHealth] = useState('');
  const [pm, setPm] = useState('');
  const [rank, setRank] = useState<'ecvVsPlan' | 'margin' | 'red' | 'alerts'>('ecvVsPlan');

  const curKhoi = scope === 'khoi' ? khoi : khoiFilter;
  const pool = useMemo(() => (curKhoi ? projects.filter((p) => p.khoi === curKhoi) : projects), [projects, curKhoi]);
  const rows = useMemo(
    () =>
      pool
        .filter((p) => (!phase || String(p.phase) === phase) && (!type || p.type === type) && (!health || p.health === health) && (!pm || p.pm === pm))
        .sort((a, b) => ({ red: 0, yellow: 1, green: 2 }[a.health] - { red: 0, yellow: 1, green: 2 }[b.health] || b.alertsOpen - a.alertsOpen)),
    [pool, phase, type, health, pm],
  );
  const pms = useMemo(() => [...new Set(pool.map((p) => p.pm))].sort(), [pool]);
  const sum = summarize(pool, curKhoi || 'TCT');

  const khoiCards = useMemo(() => {
    const cards = KHOI.map((k) => ({ k, ...summarize(projects.filter((p) => p.khoi === k), k) }));
    const val = (c: (typeof cards)[number]) => (rank === 'ecvVsPlan' ? c.ecvVsPlan : rank === 'margin' ? c.margin : rank === 'red' ? -c.mix.red : -c.alerts);
    return cards.sort((a, b) => val(b) - val(a));
  }, [projects, rank]);

  const open = (p: PmoProject) => {
    setFocusId(p.id);
    onNavigate?.('Project Cockpit');
  };

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', scope === 'tct' ? 'Portfolio Tổng công ty' : 'Portfolio khối']}
        title={scope === 'tct' ? 'Portfolio Tổng công ty · 7 khối' : `Portfolio khối ${khoi}`}
        actions={
          <>
            {scope === 'khoi' && (
              <FilterCell label="Khối">
                <select value={khoi} onChange={(e) => setKhoi(e.target.value)} className={SEL}>
                  {KHOI.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </FilterCell>
            )}
            <RoleSelect value={role} onChange={setRole} />
          </>
        }
      />

      {/* Thẻ 7 khối (TCT) */}
      {scope === 'tct' && (
        <Panel
          title="So sánh 7 khối"
          icon={Building2}
          noPad
          actions={
            <FilterCell label="Xếp hạng theo">
              <select value={rank} onChange={(e) => setRank(e.target.value as typeof rank)} className={SEL}>
                <option value="ecvVsPlan">ECV vs plan</option>
                <option value="margin">Margin</option>
                <option value="red">Ít dự án đỏ</option>
                <option value="alerts">Ít cảnh báo</option>
              </select>
            </FilterCell>
          }
          footer="Bấm thẻ khối để lọc bảng dự án bên dưới; bấm lần nữa để bỏ lọc. Utilization lấy từ allocation (F8.1) — số mẫu."
        >
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-1.5 p-2">
            {khoiCards.map((c, i) => (
              <button
                key={c.k}
                type="button"
                onClick={() => setKhoiFilter(khoiFilter === c.k ? '' : c.k)}
                className={`text-left bg-white border rounded-[4px] px-2.5 py-2 min-w-0 cursor-pointer hover:border-slate-400 ${khoiFilter === c.k ? 'border-[#1f5fa8] ring-2 ring-[#1f5fa8]/30' : 'border-slate-300'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-[#1e3a5f]">{c.k}</span>
                  <span className="text-[10.5px] text-slate-400">#{i + 1} · {c.n} dự án</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {(['red', 'yellow', 'green'] as Health[]).map((h) => (
                    <span key={h} className="inline-flex items-center gap-0.5 text-[11px] text-slate-600" title={HEALTH_LABEL[h]}>
                      <span className={`w-2 h-2 rounded-full ${HEALTH_DOT[h]}`} /> {c.mix[h]}
                    </span>
                  ))}
                </div>
                <dl className="mt-1.5 text-[11px] space-y-0.5 tabular-nums">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">ECV vs plan</dt>
                    <dd className={`font-bold ${c.ecvVsPlan < -10 ? 'text-rose-700' : c.ecvVsPlan < 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {c.ecvVsPlan > 0 ? '+' : ''}
                      {c.ecvVsPlan.toFixed(1)}%
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">ECV quý</dt>
                    <dd className="font-semibold text-slate-800">{fmtTy(c.ecv)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Margin</dt>
                    <dd className={`font-bold ${c.margin < 20 ? 'text-rose-700' : c.margin < 25 ? 'text-amber-700' : 'text-emerald-700'}`}>{c.margin.toFixed(1)}%</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Cảnh báo mở</dt>
                    <dd className={`font-semibold ${c.alerts ? 'text-rose-700' : 'text-slate-800'}`}>{c.alerts}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Utilization</dt>
                    <dd className="font-semibold text-slate-800">{c.utilization}%</dd>
                  </div>
                </dl>
              </button>
            ))}
          </div>
        </Panel>
      )}

      {/* Thẻ tổng hợp khối */}
      {scope === 'khoi' && (
        <div className="bg-white border border-slate-300 rounded-[4px] grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 divide-x divide-slate-200">
          {[
            { l: 'Dự án đang chạy', v: `${sum.n}`, s: `${fmtTy(sum.contract)} VNĐ giá trị HĐ` },
            {
              l: 'Phân bố health',
              v: (
                <span className="flex items-center gap-2 text-[15px]">
                  {(['red', 'yellow', 'green'] as Health[]).map((h) => (
                    <span key={h} className="inline-flex items-center gap-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${HEALTH_DOT[h]}`} /> {sum.mix[h]}
                    </span>
                  ))}
                </span>
              ),
              s: 'đỏ · vàng · xanh',
            },
            { l: 'ECV quý vs plan', v: `${sum.ecvVsPlan > 0 ? '+' : ''}${sum.ecvVsPlan.toFixed(1)}%`, s: `${fmtTy(sum.ecv)} / plan ${fmtTy(sum.ecvPlan)}`, bad: sum.ecvVsPlan < -5 },
            { l: 'Margin dự kiến', v: `${sum.margin.toFixed(1)}%`, s: '(ECV − cost) / ECV', bad: sum.margin < 22 },
            { l: 'Cảnh báo mở', v: `${sum.alerts}`, s: 'AL-01…AL-12', bad: sum.alerts > 0 },
            { l: 'Utilization', v: `${sum.utilization}%`, s: 'allocation tuần này' },
          ].map((c, i) => (
            <div key={i} className="px-3 py-2 min-w-0">
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500 truncate">{c.l}</p>
              <p className={`text-[17px] font-bold tabular-nums leading-tight ${c.bad ? 'text-rose-700' : 'text-slate-900'}`}>{c.v}</p>
              <p className="text-[11px] text-slate-500 truncate">{c.s}</p>
            </div>
          ))}
        </div>
      )}

      {/* Bộ lọc + bảng */}
      <Panel
        title={
          <>
            Danh sách dự án <span className="font-normal normal-case text-slate-500 tracking-normal">· {rows.length} dự án</span>
          </>
        }
        icon={LayoutGrid}
        noPad
        footer="Sắp xếp mặc định: đỏ → vàng → xanh, rồi theo số cảnh báo. Bấm vào dòng để mở Project Cockpit. Mục tiêu tải ≤2 giây với 200 dự án."
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-1.5 bg-[#f3f6fa] border-b border-slate-200">
          <span className="flex items-center gap-1.5 text-[12px] font-bold text-[#1e3a5f] pr-3 border-r border-slate-300">
            <Filter size={13} className="text-[#1f5fa8]" /> Lọc
          </span>
          {scope === 'tct' && (
            <FilterCell label="Khối">
              <select value={khoiFilter} onChange={(e) => setKhoiFilter(e.target.value)} className={SEL}>
                <option value="">Tất cả</option>
                {KHOI.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </FilterCell>
          )}
          <FilterCell label="Phase">
            <select value={phase} onChange={(e) => setPhase(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              {PHASES.map((ph) => (
                <option key={ph.no} value={ph.no}>
                  P{ph.no} {ph.name}
                </option>
              ))}
            </select>
          </FilterCell>
          <FilterCell label="Loại">
            <select value={type} onChange={(e) => setType(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              <option value="BT">BT · Bình thường</option>
              <option value="QT">QT · Quan trọng</option>
              <option value="CL">CL · Chiến lược</option>
            </select>
          </FilterCell>
          <FilterCell label="Health">
            <select value={health} onChange={(e) => setHealth(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              <option value="red">Đỏ</option>
              <option value="yellow">Vàng</option>
              <option value="green">Xanh</option>
            </select>
          </FilterCell>
          <FilterCell label="PM">
            <select value={pm} onChange={(e) => setPm(e.target.value)} className={SEL}>
              <option value="">Tất cả</option>
              {pms.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </FilterCell>
          {(phase || type || health || pm) && (
            <button type="button" onClick={() => (setPhase(''), setType(''), setHealth(''), setPm(''))} className="text-[12px] text-[#1f5fa8] hover:underline cursor-pointer">
              Bỏ lọc
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1100px]`}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0`}>Mã</th>
                <th className={`${erp.th} border-t-0 text-left`}>Tên dự án</th>
                <th className={`${erp.th} border-t-0 text-left`}>Khách</th>
                <th className={`${erp.th} border-t-0 text-center`}>Loại</th>
                <th className={`${erp.th} border-t-0 text-center`}>Phase</th>
                <th className={`${erp.th} border-t-0 text-center`}>Health</th>
                <th className={`${erp.th} border-t-0 text-right`}>% ECV</th>
                <th className={`${erp.th} border-t-0 text-right`}>vs plan</th>
                <th className={`${erp.th} border-t-0 text-right`}>Margin</th>
                <th className={`${erp.th} border-t-0 text-left`}>PM</th>
                <th className={`${erp.th} border-t-0 text-center`}>Cảnh báo</th>
                <th className={`${erp.th} border-t-0 border-r-0 text-center`}>Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const e = pct(p.ecv, p.contractValue);
                const d = e - pct(p.ecvPlan, p.contractValue);
                const m = marginOf(p);
                return (
                  <tr key={p.id} className={`${erp.tr} cursor-pointer`} onClick={() => open(p)}>
                    <td className={`${erp.td} border-l-0 ${erp.code} whitespace-nowrap`}>{p.code}</td>
                    <td className={`${erp.td} font-semibold text-slate-800 whitespace-nowrap`}>{p.name}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{p.client}</td>
                    <td className={`${erp.td} text-center`}>
                      <TypeTag t={p.type} />
                    </td>
                    <td className={`${erp.td} text-center`}>
                      <span className="inline-flex items-center gap-1.5">
                        <PhaseStrip phase={p.phase} compact />
                      </span>
                    </td>
                    <td className={`${erp.td} text-center`}>
                      <HealthBadge h={p.health} small />
                    </td>
                    <td className={`${erp.td} ${erp.num}`}>{e.toFixed(0)}%</td>
                    <td className={`${erp.td} ${erp.num} font-semibold ${d < -10 ? 'text-rose-700' : d < -3 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {d > 0 ? '+' : ''}
                      {d.toFixed(1)}
                    </td>
                    <td className={`${erp.td} ${erp.num} ${m < p.presaleMargin - 3 ? 'text-rose-700 font-semibold' : ''}`}>{m.toFixed(1)}%</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{p.pm}</td>
                    <td className={`${erp.td} text-center`}>
                      {p.alertsOpen ? <span className="inline-flex min-w-[22px] justify-center px-1.5 rounded-[3px] bg-rose-600 text-white text-[11px] font-bold">{p.alertsOpen}</span> : <span className="text-slate-400">0</span>}
                    </td>
                    <td className={`${erp.td} border-r-0 text-center tabular-nums whitespace-nowrap`}>{dmy('2026-10-09')} {p.lastSync}</td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={12} className="px-3 py-8 text-center text-slate-400 italic">
                    Không có dự án nào khớp bộ lọc.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </ErpPage>
  );
};
