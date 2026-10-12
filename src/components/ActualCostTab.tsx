/**
 * ActualCostTab — tab "Actual Cost" trên màn chi tiết dự án.
 *
 * Chi phí lương thực tế của dự án theo tháng, tính từ giờ log task (timesheet) của từng thành viên:
 *   Chi phí tính vào dự án = Chi phí công ty của nhân sự trong tháng (lương + BH doanh nghiệp, lấy từ bảng lương)
 *                            × Giờ log vào dự án / Giờ chuẩn tháng (176h).
 * Bảng lương lấy từ module Payroll (kỳ gần nhất có bảng lương nếu tháng đó chưa có).
 * Giờ log / số task: dữ liệu mẫu sinh ổn định theo dự án + tháng (chưa nối Jira / Timesheet thật).
 * ĐVT: VNĐ.
 */
import React, { useMemo, useState } from 'react';
import { Clock3, Coins, Users, Wallet } from 'lucide-react';
import { BizProject, latestActualMonth, monthsBetween } from '../business/BusinessProjectContext';
import { Khoi, PayRow, latestVersion, usePayroll } from '../payroll/PayrollContext';
import { KpiBox, Panel, Tag, erp } from './erp/Erp';

const STD_HOURS = 176;
const ALL = 'all';
const fmt = (n: number) => Math.round(n || 0).toLocaleString('en-US');
const fmtMonth = (m: string) => `${m.slice(5, 7)}/${m.slice(0, 4)}`;
const pct = (r: number | null) => (r === null || !isFinite(r) ? '—' : `${(r * 100).toFixed(0)}%`);

/** Hash ổn định → số 0..1 (sinh dữ liệu mẫu lặp lại được). */
const rand = (...keys: (string | number)[]) => {
  let h = 2166136261;
  for (const ch of keys.join('|')) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (h % 10000) / 10000;
};

export interface MemberCost {
  row: PayRow;
  hours: number;
  tasks: number;
  share: number; // giờ log / giờ chuẩn
  cost: number; // chi phí tính vào dự án
}

/** Thành viên log task vào dự án trong tháng — chọn ổn định từ bảng lương (ưu tiên đúng khối). */
export const monthMembers = (p: BizProject, month: string, roster: PayRow[]): MemberCost[] => {
  const same = roster.filter((r) => r.khoi === (p.division as Khoi));
  const others = roster.filter((r) => r.khoi !== (p.division as Khoi));
  const pool = [...same, ...others];
  const size = Math.min(pool.length, 4 + Math.floor(rand(p.id, 'size') * 5)); // 4..8 người
  const team = pool.filter((r, i) => i < same.length ? rand(p.id, r.code) < 0.8 || i < 3 : false).slice(0, size);
  if (team.length < 4) team.push(...others.filter((r) => !team.includes(r)).slice(0, 4 - team.length));
  return team
    .map((row) => {
      const active = rand(p.id, row.code, month, 'on') > 0.15; // có tháng không log
      if (!active) return null;
      const hours = Math.round((24 + rand(p.id, row.code, month, 'h') * 152) / 0.5) * 0.5; // 24..176h
      const tasks = 2 + Math.floor(rand(p.id, row.code, month, 't') * 22);
      const share = Math.min(1, hours / STD_HOURS);
      return { row, hours, tasks, share, cost: Math.round(row.cost * share) };
    })
    .filter((x): x is MemberCost => !!x)
    .sort((a, b) => b.cost - a.cost);
};

export const ActualCostTab: React.FC<{ project: BizProject }> = ({ project: p }) => {
  const { periods } = usePayroll();
  const cutoff = latestActualMonth([p]) || '2026-08';
  // Các tháng có thể xem: trong thời gian dự án, đến tháng chốt số
  const months = useMemo(() => monthsBetween(p.startDate, p.endDate).filter((m) => m <= cutoff).reverse(), [p.startDate, p.endDate, cutoff]);
  const [month, setMonth] = useState(months[0] || cutoff);

  /** Bảng lương dùng cho tháng: đúng kỳ nếu có, không thì kỳ gần nhất trước đó, không nữa thì kỳ sớm nhất. */
  const rosterFor = (m: string): { rows: PayRow[]; from: string } => {
    const withRows = periods.filter((x) => latestVersion(x)?.rows.length).map((x) => ({ key: `${x.year}-${String(x.month).padStart(2, '0')}`, rows: latestVersion(x)!.rows }));
    withRows.sort((a, b) => a.key.localeCompare(b.key));
    const exact = withRows.find((x) => x.key === m);
    const before = [...withRows].reverse().find((x) => x.key < m);
    const pick = exact || before || withRows[0];
    return pick ? { rows: pick.rows, from: pick.key } : { rows: [], from: '' };
  };

  const isAll = month === ALL;
  const { from: payrollMonth } = rosterFor(isAll ? months[0] : month);
  /** Thành viên của tháng đang chọn; "Tất cả" → gộp theo nhân sự qua các tháng (cộng giờ, task, chi phí; đếm số tháng). */
  const members = useMemo(() => {
    const list = isAll ? months : [month];
    const map = new Map<string, MemberCost & { nMonths: number; companyCost: number }>();
    list.forEach((m) =>
      monthMembers(p, m, rosterFor(m).rows).forEach((x) => {
        const cur = map.get(x.row.code);
        if (!cur) map.set(x.row.code, { ...x, nMonths: 1, companyCost: x.row.cost });
        else map.set(x.row.code, { ...cur, row: x.row, hours: cur.hours + x.hours, tasks: cur.tasks + x.tasks, cost: cur.cost + x.cost, nMonths: cur.nMonths + 1, companyCost: cur.companyCost + x.row.cost });
      }),
    );
    return [...map.values()].sort((a, b) => b.cost - a.cost);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p, month, months, periods]);
  const total = members.reduce((s, m) => s + m.cost, 0);
  const hours = members.reduce((s, m) => s + m.hours, 0);
  const tasks = members.reduce((s, m) => s + m.tasks, 0);
  const inScope = (m: string) => (isAll ? months.includes(m) : m === month);
  const planSx = p.plan.filter((r) => inScope(r.month)).reduce((s, r) => s + (r.costSx || 0), 0);
  const actualSx = p.actual.filter((r) => inScope(r.month)).reduce((s, r) => s + (r.costSx || 0), 0);
  const periodText = isAll ? `Tất cả (${fmtMonth(months[months.length - 1])} → ${fmtMonth(months[0])})` : fmtMonth(month);
  const nMonths = isAll ? months.length : 1;

  // Tổng hợp theo tháng (tất cả tháng xem được) để so sánh
  const byMonth = useMemo(
    () =>
      months.map((m) => {
        const r = rosterFor(m).rows;
        const ms = monthMembers(p, m, r);
        return { m, n: ms.length, hours: ms.reduce((s, x) => s + x.hours, 0), cost: ms.reduce((s, x) => s + x.cost, 0), planSx: p.plan.find((x) => x.month === m)?.costSx || 0 };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [months, p, periods],
  );

  if (!months.length)
    return (
      <Panel title="Actual Cost — chi phí lương theo tháng" icon={Coins}>
        <p className="py-8 text-center text-[12.5px] text-slate-500">Dự án chưa có tháng nào đến kỳ chốt số.</p>
      </Panel>
    );

  return (
    <div className="space-y-3">
      <Panel
        title="Actual Cost — chi phí lương theo tháng"
        icon={Coins}
        actions={
          <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
            Tháng
            <select value={month} onChange={(e) => setMonth(e.target.value)} className={`${erp.input} h-7`}>
              <option value={ALL}>Tất cả tháng</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {fmtMonth(m)}
                </option>
              ))}
            </select>
          </label>
        }
        footer={
          <>
            Chi phí tính vào dự án = Chi phí công ty của nhân sự (lương + BH doanh nghiệp, theo bảng lương {isAll ? 'từng kỳ' : `kỳ ${payrollMonth ? fmtMonth(payrollMonth) : '—'}`}) × Giờ log vào dự án / {STD_HOURS}h chuẩn{isAll ? ', cộng dồn các tháng' : ''}.
            Giờ log và số task lấy từ Timesheet (dữ liệu mẫu). ĐVT: VNĐ.
          </>
        }
      >
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-3">
          <KpiBox label={`Chi phí lương tính vào dự án · ${periodText}`} value={fmt(total)} valueText={fmt(total)} sub={planSx ? `Chi SX kế hoạch${isAll ? ` ${nMonths} tháng` : ' tháng'}: ${fmt(planSx)}` : 'Chưa có chi SX kế hoạch'} badge={planSx ? pct(total / planSx) : undefined} tone={!planSx ? 'neutral' : total <= planSx ? 'good' : 'bad'} />
          <KpiBox label="Thành viên log task" value={String(members.length)} sub={`${tasks} task${isAll ? ` trong ${nMonths} tháng` : ' trong tháng'}`} />
          <KpiBox label="Tổng giờ log vào dự án" value={`${fmt(hours)} h`} sub={`≈ ${(hours / STD_HOURS).toFixed(1)} người-tháng (${STD_HOURS}h/người)`} />
          <KpiBox label="Chi SX thực tế (kế toán)" value={fmt(actualSx)} valueText={fmt(actualSx)} sub={actualSx ? `Lương chiếm ${pct(total / actualSx)} chi SX thực tế` : 'Kế toán chưa import'} />
        </div>

        <div className="overflow-x-auto border border-slate-300 rounded-[3px]">
          <table className={erp.table}>
            <thead>
              <tr>
                {['#', 'Mã NV', 'Họ tên', 'Vị trí', 'Khối', ...(isAll ? ['Số tháng log'] : []), 'Số task', 'Giờ log', 'Chi phí tính vào dự án'].map((h, i) => (
                  <th key={h} className={`${erp.th} border-t-0 first:border-l-0 last:border-r-0 ${i >= 5 ? 'text-right' : i === 0 ? 'text-center' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => (
                <tr key={m.row.code} className={erp.tr}>
                  <td className={`${erp.td} text-center text-slate-500 border-l-0`}>{i + 1}</td>
                  <td className={`${erp.td} font-mono text-[#1f5fa8]`}>{m.row.code}</td>
                  <td className={`${erp.td} font-semibold text-slate-800`}>{m.row.name}</td>
                  <td className={erp.td}>{m.row.title}</td>
                  <td className={erp.td}>
                    <Tag cls={m.row.khoi === p.division ? 'bg-[#eaf2fc] text-[#1f5fa8] border-[#bcd3f0]' : 'bg-amber-50 text-amber-700 border-amber-300'}>{m.row.khoi}</Tag>
                  </td>
                  {isAll && <td className={`${erp.td} ${erp.num}`}>{m.nMonths}</td>}
                  <td className={`${erp.td} ${erp.num}`}>{m.tasks}</td>
                  <td className={`${erp.td} ${erp.num}`}>{m.hours}</td>
                  <td className={`${erp.td} ${erp.num} font-semibold text-rose-700 border-r-0`}>{fmt(m.cost)}</td>
                </tr>
              ))}
              {!members.length && (
                <tr>
                  <td colSpan={isAll ? 9 : 8} className="px-3 py-8 text-center text-slate-400 italic">
                    Không có thành viên nào log task vào dự án trong {isAll ? 'các tháng' : `tháng ${fmtMonth(month)}`}.
                  </td>
                </tr>
              )}
            </tbody>
            {members.length > 0 && (
              <tfoot>
                <tr className={erp.totalRow}>
                  <td colSpan={5} className={`${erp.td} border-l-0`}>
                    TỔNG · {members.length} thành viên
                  </td>
                  {isAll && <td className={`${erp.td} ${erp.num}`}>{nMonths} tháng</td>}
                  <td className={`${erp.td} ${erp.num}`}>{tasks}</td>
                  <td className={`${erp.td} ${erp.num}`}>{hours}</td>
                  <td className={`${erp.td} ${erp.num} border-r-0`}>{fmt(total)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Panel>

      <Panel title="Chi phí lương theo các tháng" icon={Wallet} noPad footer="Bấm vào một tháng để xem chi tiết thành viên ở bảng trên · ĐVT: VNĐ">
        <table className={erp.table}>
          <thead>
            <tr>
              {['Tháng', 'Thành viên', 'Giờ log', 'Chi phí lương tính vào dự án', 'Chi SX kế hoạch', '% so kế hoạch'].map((h, i) => (
                <th key={h} className={`${erp.th} border-t-0 first:border-l-0 last:border-r-0 ${i ? 'text-right' : 'text-left'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {byMonth.map((r) => (
              <tr key={r.m} onClick={() => setMonth(r.m)} className={`${erp.tr} cursor-pointer ${r.m === month ? 'bg-[#eaf2fc] font-semibold' : ''}`}>
                <td className={`${erp.td} border-l-0 tabular-nums`}>
                  <span className="inline-flex items-center gap-1.5">
                    {r.m === month ? <Clock3 size={12} className="text-[#1f5fa8]" /> : <Users size={12} className="text-slate-300" />}
                    {fmtMonth(r.m)}
                  </span>
                </td>
                <td className={`${erp.td} ${erp.num}`}>{r.n}</td>
                <td className={`${erp.td} ${erp.num}`}>{r.hours}</td>
                <td className={`${erp.td} ${erp.num} text-rose-700`}>{fmt(r.cost)}</td>
                <td className={`${erp.td} ${erp.num} text-slate-600`}>{r.planSx ? fmt(r.planSx) : '—'}</td>
                <td className={`${erp.td} ${erp.num} border-r-0 ${r.planSx ? (r.cost <= r.planSx ? 'text-emerald-700' : 'text-rose-600') : 'text-slate-400'}`}>{r.planSx ? pct(r.cost / r.planSx) : '—'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className={erp.totalRow}>
              <td className={`${erp.td} border-l-0`}>TỔNG</td>
              <td className={`${erp.td} ${erp.num}`} />
              <td className={`${erp.td} ${erp.num}`}>{byMonth.reduce((s, r) => s + r.hours, 0)}</td>
              <td className={`${erp.td} ${erp.num}`}>{fmt(byMonth.reduce((s, r) => s + r.cost, 0))}</td>
              <td className={`${erp.td} ${erp.num}`}>{fmt(byMonth.reduce((s, r) => s + r.planSx, 0))}</td>
              <td className={`${erp.td} ${erp.num} border-r-0`}>{pct(byMonth.reduce((s, r) => s + r.planSx, 0) ? byMonth.reduce((s, r) => s + r.cost, 0) / byMonth.reduce((s, r) => s + r.planSx, 0) : null)}</td>
            </tr>
          </tfoot>
        </table>
      </Panel>
    </div>
  );
};
