/**
 * ProjectTracker — "Sổ theo dõi dự án": giá trị hợp đồng ký trong năm so với mục tiêu của từng khối.
 * Hiển thị trên màn danh sách Dự án kinh doanh, ngay dưới thanh lọc Năm / Khối.
 *
 *  • Ô tổng: Giá trị hợp đồng ký năm · Mục tiêu năm · Còn thiếu · Đạt %
 *  • Bảng theo khối: thanh tiến độ (Đã ký | Dự kiến ký còn lại | vạch Mục tiêu),
 *    Mục tiêu · Đã ký · Còn thiếu · Dự kiến ký còn lại · Sau khi ký hết (Dư / Thiếu), dòng Toàn công ty.
 *
 * Đã ký = tổng giá trị HĐ có ngày ký trong năm. Dự kiến ký còn lại = tổng doanh thu PAKD của
 * dự án chưa ký, dự kiến ký trong năm (chưa kết thúc). ĐVT: VNĐ.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Pencil, X, Save, BarChart3 } from 'lucide-react';
import { BizProject, DIVISIONS, signedDate, signedValue, useBusinessProjects } from '../business/BusinessProjectContext';
import { Btn, Panel, erp } from './erp/Erp';

const money = (n: number) => Math.round(n || 0).toLocaleString('en-US');
const pct = (r: number) => `${(r * 100).toFixed(1)}%`;
const SIGNED = '#1f5fa8';
const EXPECTED = '#bcd3f0';

interface Row {
  key: string;
  label: string;
  target: number;
  signed: number;
  expected: number;
}

/** Tính số theo khối cho 1 năm. */
export const trackerRows = (projects: BizProject[], year: string, divisions: string[], targets: Record<string, number>): Row[] =>
  divisions.map((d) => {
    const list = projects.filter((p) => p.division === d);
    const signed = list.filter((p) => signedDate(p).startsWith(year)).reduce((s, p) => s + signedValue(p), 0);
    const expected = list
      .filter((p) => !p.contractSigned && p.status !== 'Kết thúc' && (p.expectedSignDate || '').startsWith(year))
      .reduce((s, p) => s + p.expectedRevenue, 0);
    return { key: d, label: `Khối ${d}`, target: targets[d] || 0, signed, expected };
  });

/** Thanh tiến độ của 1 khối (thang riêng từng dòng: max(mục tiêu, đã ký + dự kiến)):
 *  xanh đậm = đã ký, xanh nhạt = dự kiến ký còn lại, vạch đen = mục tiêu. */
const Bullet: React.FC<{ r: Row }> = ({ r }) => {
  const scale = Math.max(1, r.target, r.signed + r.expected);
  const w = (v: number) => `${Math.min(100, (v / scale) * 100)}%`;
  return (
    <div
      className="relative h-4 bg-slate-100 rounded-[2px]"
      title={`Đã ký ${money(r.signed)} · Dự kiến ký còn lại ${money(r.expected)} · Mục tiêu ${money(r.target)}`}
    >
      <div className="absolute inset-y-0 left-0 rounded-[2px]" style={{ width: w(r.signed + r.expected), background: EXPECTED }} />
      <div className="absolute inset-y-0 left-0 rounded-l-[2px]" style={{ width: w(r.signed), background: SIGNED }} />
      {r.target > 0 && <div className="absolute -top-1 -bottom-1 w-[2px] bg-slate-900" style={{ left: `calc(${w(r.target)} - 1px)` }} />}
    </div>
  );
};

const RowCells: React.FC<{ r: Row; total?: boolean }> = ({ r, total }) => {
  const missing = Math.max(0, r.target - r.signed);
  const after = r.signed + r.expected - r.target;
  return (
    <>
      <td className={`${erp.td} ${total ? 'font-bold' : 'font-semibold'} whitespace-nowrap border-l-0`}>{r.label}</td>
      <td className={`${erp.td} min-w-[180px] w-[24%]`}>
        {!total && <Bullet r={r} />}
        <p className={`text-[11px] text-slate-500 ${total ? '' : 'mt-1'}`}>{r.target ? `Đã ký ${pct(r.signed / r.target)} mục tiêu` : 'Chưa đặt mục tiêu'}</p>
      </td>
      <td className={`${erp.td} ${erp.num}`}>{money(r.target)}</td>
      <td className={`${erp.td} ${erp.num} font-semibold`}>{money(r.signed)}</td>
      <td className={`${erp.td} ${erp.num} ${missing ? 'text-rose-600 font-semibold' : 'text-slate-400'}`}>{money(missing)}</td>
      <td className={`${erp.td} ${erp.num}`}>{money(r.expected)}</td>
      <td className={`${erp.td} ${erp.num} font-semibold border-r-0 ${after >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
        {r.target ? `${after >= 0 ? 'Dư' : 'Thiếu'} ${money(Math.abs(after))}` : '—'}
      </td>
    </>
  );
};

export const ProjectTracker: React.FC<{ projects: BizProject[]; year: string; division: string }> = ({ projects, year, division }) => {
  const { targets, setYearTargets } = useBusinessProjects();
  const [editing, setEditing] = useState(false);
  const yearTargets = targets[year] || {};
  const divisions = division ? [division] : DIVISIONS;
  const rows = trackerRows(projects, year, divisions, yearTargets);
  const total: Row = {
    key: 'all',
    label: division ? `Khối ${division}` : 'Toàn công ty',
    target: rows.reduce((s, r) => s + r.target, 0),
    signed: rows.reduce((s, r) => s + r.signed, 0),
    expected: rows.reduce((s, r) => s + r.expected, 0),
  };
  const missing = Math.max(0, total.target - total.signed);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-3">
      {/* Ô tổng */}
      <div className="bg-white border border-slate-300 border-t-[3px] border-t-[#1f5fa8] rounded-[4px] flex flex-col">
        <div className="px-4 pt-3">
          <p className="text-[12px] font-semibold text-slate-600">
            Giá trị hợp đồng ký năm {year}
            {division && ` · Khối ${division}`}
          </p>
          <p className="text-right text-[26px] font-bold text-[#1e3a5f] tabular-nums leading-tight mt-2 break-all">{money(total.signed)}</p>
          <p className="text-[11px] text-slate-400">VNĐ</p>
        </div>
        <table className="w-full border-collapse text-[13px] mt-3 tabular-nums">
          <tbody>
            {[
              ['Mục tiêu năm', money(total.target), 'font-semibold'],
              ['Còn thiếu', money(missing), missing ? 'text-rose-600 font-bold' : 'text-slate-400'],
              ['Đạt', total.target ? pct(total.signed / total.target) : '—', total.signed >= total.target && total.target ? 'text-emerald-700 font-bold' : 'font-bold'],
              ['Dự kiến ký còn lại', money(total.expected), ''],
            ].map(([k, v, cls]) => (
              <tr key={k}>
                <th className="bg-[#f3f6fa] border-y border-slate-200 px-4 py-1.5 text-left font-medium text-slate-600">{k}</th>
                <td className={`border-y border-slate-200 px-4 py-1.5 text-right ${cls}`}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {total.target > 0 && (
          <div className="px-4 py-3 mt-auto">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, (total.signed / total.target) * 100)}%`, background: SIGNED }} />
            </div>
          </div>
        )}
      </div>

      {/* Theo khối */}
      <Panel
        title={`Theo khối so với mục tiêu năm ${year}`}
        icon={BarChart3}
        noPad
        actions={
          <>
            <span className="flex items-center gap-3 text-[11px] text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[2px]" style={{ background: SIGNED }} /> Đã ký
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[2px]" style={{ background: EXPECTED }} /> Dự kiến ký còn lại
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-[2px] h-3.5 bg-slate-900" /> Mục tiêu
              </span>
            </span>
            <Btn icon={Target} className="h-7" onClick={() => setEditing(true)}>
              Đặt mục tiêu
            </Btn>
          </>
        }
        footer="ĐVT: VNĐ · Đã ký = giá trị HĐ có ngày ký trong năm · Dự kiến ký còn lại = doanh thu PAKD của dự án chưa ký, dự kiến ký trong năm"
      >
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                {['Khối', 'So với mục tiêu', 'Mục tiêu', 'Đã ký', 'Còn thiếu', 'Dự kiến ký còn lại', 'Sau khi ký hết'].map((h, i) => (
                  <th key={h} className={`${erp.th} ${i >= 2 ? 'text-right' : 'text-left'} border-t-0 first:border-l-0 last:border-r-0`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className={erp.tr}>
                  <RowCells r={r} />
                </tr>
              ))}
            </tbody>
            {!division && (
              <tfoot>
                <tr className={erp.totalRow}>
                  <RowCells r={total} total />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Panel>

      <AnimatePresence>
        {editing && (
          <TargetModal
            key="targets"
            year={year}
            initial={yearTargets}
            onClose={() => setEditing(false)}
            onSave={(t) => {
              setYearTargets(year, t);
              setEditing(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/** Đặt mục tiêu giá trị hợp đồng ký của từng khối trong năm. */
const TargetModal: React.FC<{ year: string; initial: Record<string, number>; onClose: () => void; onSave: (t: Record<string, number>) => void }> = ({
  year,
  initial,
  onClose,
  onSave,
}) => {
  const [t, setT] = useState<Record<string, number>>(() => ({ ...initial }));
  const sum = DIVISIONS.reduce((s, d) => s + (t[d] || 0), 0);
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40" />
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.97, opacity: 0, y: 12 }}
        className="relative bg-white w-full max-w-md rounded-[4px] border border-slate-400 shadow-2xl z-10"
      >
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e3a5f] text-white rounded-t-[3px]">
          <h3 className="text-[14px] font-bold flex items-center gap-2">
            <Pencil size={15} /> Mục tiêu giá trị HĐ ký năm {year}
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <table className={erp.table}>
          <thead>
            <tr>
              <th className={`${erp.th} text-left border-t-0 border-l-0`}>Khối</th>
              <th className={`${erp.th} text-right border-t-0 border-r-0`}>Mục tiêu (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {DIVISIONS.map((d) => (
              <tr key={d}>
                <td className={`${erp.td} font-semibold border-l-0`}>Khối {d}</td>
                <td className="border border-slate-200 border-r-0 p-0">
                  <input
                    inputMode="numeric"
                    value={t[d] ? t[d].toLocaleString('en-US') : ''}
                    onChange={(e) => setT((prev) => ({ ...prev, [d]: Number(e.target.value.replace(/[^\d]/g, '')) || 0 }))}
                    placeholder="0"
                    className="w-full h-8 px-2 text-right tabular-nums bg-transparent outline-none focus:bg-[#eaf2fc] focus:ring-1 focus:ring-inset focus:ring-[#1f5fa8]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={erp.totalRow}>
              <td className={`${erp.td} border-l-0`}>Toàn công ty</td>
              <td className={`${erp.td} ${erp.num} border-r-0`}>{money(sum)}</td>
            </tr>
          </tfoot>
        </table>
        <div className="flex justify-end gap-1.5 px-3 py-2 border-t border-slate-300 bg-slate-50 rounded-b-[3px]">
          <Btn onClick={onClose}>Huỷ</Btn>
          <Btn variant="success" icon={Save} onClick={() => onSave(t)}>
            Lưu mục tiêu
          </Btn>
        </div>
      </motion.div>
    </div>
  );
};
