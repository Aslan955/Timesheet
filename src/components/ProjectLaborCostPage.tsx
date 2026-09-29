/**
 * ProjectLaborCostPage — "Chi phí nhân công dự án".
 *
 * Nhân viên log timesheet trên Jira (số giờ / ngày / dự án). Hệ thống phân bổ
 * toàn bộ chi phí lương kỳ của NV (Lương + CP BHXH + CPCĐ) cho các dự án theo
 * tỷ trọng giờ đã log → chi phí nhân công thực tế của từng dự án, tổng hợp
 * theo KHỐI (khối của dự án) và theo TỪNG THÁNG.
 * Công thức & đọc file: xem src/finance/laborCost.ts.
 *
 * Khối của dự án: lấy từ Kế hoạch thu chi; bổ sung/ghi đè bằng sheet "DuAn"
 * khi nhập file hoặc chọn trực tiếp trên bảng.
 *
 * Tab: Khối × Tháng · Theo dự án · Theo nhân viên · Cảnh báo.
 */
import React, { useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Upload,
  FileSpreadsheet,
  Info,
  X,
  AlertTriangle,
  UserX,
  Clock,
  Wallet,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  ChevronRight,
  FolderX,
} from 'lucide-react';
import { Breadcrumb, StatGrid, DataTable, Column } from './DataTable';
import { useFinancePlans } from '../finance/FinancePlanContext';
import {
  LaborDataset,
  LaborResult,
  ManualAllocation,
  ProjectResult,
  EmployeeResult,
  HOURS_PER_DAY,
  NO_KHOI,
  computeLaborCost,
  filterByKhoi,
  aggregateResults,
  monthlyMatrix,
  parseLaborWorkbook,
  datasetPeriods,
  periodsOf,
  periodLabel,
  buildTemplate,
  buildReport,
  sampleDataset,
} from '../finance/laborCost';

const BASE_KHOIS = ['G1', 'G2', 'G3', 'G4', 'BFSI', 'GPDV'];
// Bảng màu phân loại (đã kiểm CVD) — gán theo thứ tự khối cố định, không theo thứ hạng
const SERIES = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948'];
const NO_KHOI_COLOR = '#a8a29e';
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

const r0 = (n: number) => Math.round(n);
const r2 = (n: number) => Math.round(n * 100) / 100;
const vnd = (n: number) => Math.round(n).toLocaleString('vi-VN');
const million = (n: number) => `${(n / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tr`;
const mil1 = (n: number) => (n ? (n / 1e6).toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : '–');
const pct = (n: number) => `${(n * 100).toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%`;
const resultsOf = (o: Record<string, LaborResult>): LaborResult[] => Object.keys(o).sort().map((k) => o[k]);
const ym = (year: number, m: number) => `${year}-${String(m).padStart(2, '0')}`;

type Tab = 'overview' | 'project' | 'employee' | 'warning';
type Warn = { kind: 'noSalary' | 'unallocated' | 'under' | 'over' | 'pending' | 'noKhoi'; key: string; name: string; detail: string; period: string };

export const ProjectLaborCostPage: React.FC = () => {
  const { blocks } = useFinancePlans();
  const [ds, setDs] = useState<LaborDataset>(sampleDataset);

  // ---- Khối của dự án: Kế hoạch thu chi → ghi đè bằng ds.projectKhoi ----
  const planKhoi = useMemo(() => {
    const m: Record<string, string> = {};
    blocks.forEach((b) => b.projects.forEach((p) => p.projectCode && (m[p.projectCode.trim()] = b.khoi)));
    return m;
  }, [blocks]);
  const khoiOf = (code: string) => ds.projectKhoi[code] || planKhoi[code] || NO_KHOI;
  const khoiList = useMemo(() => {
    const s = new Set([...BASE_KHOIS, ...Object.values(planKhoi), ...Object.values(ds.projectKhoi)]);
    return Array.from(s);
  }, [planKhoi, ds.projectKhoi]);
  const colorOf = (k: string) => (k === NO_KHOI ? NO_KHOI_COLOR : SERIES[khoiList.indexOf(k) % SERIES.length]);

  // ---- Kỳ ----
  const allPeriods = useMemo(() => datasetPeriods(ds), [ds]);
  const years = useMemo(() => Array.from(new Set<number>(allPeriods.map((p) => +p.slice(0, 4)))).sort((a, b) => b - a), [allPeriods]);
  const [yearSel, setYear] = useState(2026);
  const year = years.includes(yearSel) ? yearSel : years[0] || yearSel;
  const yearPeriods = allPeriods.filter((p) => p.startsWith(`${year}-`));
  const [khoi, setKhoi] = useState(''); // '' = tất cả khối
  const [monthSel, setMonth] = useState<string>('year'); // 'year' | yyyy-mm
  const month = monthSel === 'year' || yearPeriods.includes(monthSel) ? monthSel : 'year';

  // Kết quả từng tháng (toàn công ty) → lọc khối → cộng dồn
  const monthly = useMemo(() => {
    const out: Record<string, LaborResult> = {};
    yearPeriods.forEach((p) => (out[p] = computeLaborCost(ds, p, khoiOf)));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ds, planKhoi, year, allPeriods]);
  const monthlyK = useMemo(() => {
    const out: Record<string, LaborResult> = {};
    Object.keys(monthly).forEach((p) => (out[p] = filterByKhoi(monthly[p], khoi)));
    return out;
  }, [monthly, khoi]);
  const res = useMemo(
    () => (month === 'year' ? aggregateResults(resultsOf(monthlyK), String(year)) : monthlyK[month] || aggregateResults([], month)),
    [monthlyK, month, year],
  );
  const matrix = useMemo(() => monthlyMatrix(monthlyK, year), [monthlyK, year]);
  const scopeLabel = `${month === 'year' ? `Năm ${year}` : `Tháng ${periodLabel(month)}`}${khoi ? ` · Khối ${khoi}` : ''}`;
  // Số dự án theo khối trong phạm vi tháng / năm đang xem (chưa lọc khối) — cho thanh lọc khối
  const khoiCounts = useMemo(() => {
    const codes = new Map<string, Set<string>>();
    (month === 'year' ? yearPeriods : [month]).forEach((p) =>
      monthly[p]?.projects.forEach((x) => {
        if (!codes.has(x.khoi)) codes.set(x.khoi, new Set());
        codes.get(x.khoi)!.add(x.project);
      }),
    );
    const out: Record<string, number> = {};
    codes.forEach((s, k) => (out[k] = s.size));
    out[''] = new Set(Array.from(codes.values()).flatMap((s) => Array.from(s))).size;
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthly, month, year]);

  const [tab, setTab] = useState<Tab>('overview');
  const [projDetail, setProjDetail] = useState<ProjectResult | null>(null);
  const [empDetail, setEmpDetail] = useState<EmployeeResult | null>(null);
  const [manualFor, setManualFor] = useState<{ username: string; fullName: string; period: string } | null>(null);
  const [toast, setToast] = useState<{ lines: string[]; error?: boolean } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (lines: string[], error = false) => {
    setToast({ lines, error });
    setTimeout(() => setToast(null), 6000);
  };
  const drill = (k: string, p: string | 'year') => {
    setKhoi(k);
    setMonth(p);
    setTab('project');
  };

  // ---- Nhập file (1 file = 1 tháng) ----
  const importFile = async (file: File) => {
    try {
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array', codepage: 65001 });
      const rep = parseLaborWorkbook(wb);
      if (!rep.worklogs && !rep.salaries && !rep.users && !rep.manual && !rep.projectKhoi) return showToast(rep.errors, true);
      const filePeriod = rep.worklogs?.length ? periodsOf(rep.worklogs)[0] : month !== 'year' ? month : yearPeriods[yearPeriods.length - 1] || ym(year, 1);
      const inFile = new Set(rep.worklogs ? periodsOf(rep.worklogs) : []);
      setDs((prev) => ({
        source: file.name,
        // Worklog: thay các tháng có trong file, giữ các tháng khác
        worklogs: rep.worklogs ? [...prev.worklogs.filter((w) => !inFile.has(w.date.slice(0, 7))), ...rep.worklogs] : prev.worklogs,
        salaries: rep.salaries ? { ...prev.salaries, [filePeriod]: rep.salaries } : prev.salaries,
        users: rep.users ? { ...prev.users, [filePeriod]: rep.users } : prev.users,
        manual: rep.manual ? [...prev.manual.filter((m) => m.period !== filePeriod), ...rep.manual.map((m) => ({ ...m, period: filePeriod }))] : prev.manual,
        projectKhoi: { ...prev.projectKhoi, ...(rep.projectKhoi || {}) },
      }));
      if (rep.worklogs?.length) {
        setYear(+filePeriod.slice(0, 4));
        setMonth(filePeriod);
      }
      showToast([`Đã nhập "${file.name}" → tháng ${periodLabel(filePeriod)}`, ...rep.notes, ...rep.errors]);
    } catch {
      showToast(['Không đọc được file. File có thể bị hỏng hoặc đặt mật khẩu.'], true);
    }
  };

  const assignKhoi = (code: string, k: string) => setDs((prev) => ({ ...prev, projectKhoi: { ...prev.projectKhoi, [code]: k } }));

  const saveManual = (username: string, fullName: string, period: string, rows: { project: string; hours: number }[]) => {
    setDs((prev) => ({
      ...prev,
      manual: [
        ...prev.manual.filter((m) => !(m.period === period && m.username === username)),
        ...rows.filter((r) => r.project.trim() && r.hours > 0).map((r): ManualAllocation => ({ period, username, fullName, project: r.project.trim(), hours: r.hours })),
      ],
    }));
    setManualFor(null);
    setEmpDetail(null);
  };

  // ---- Cảnh báo (theo tháng; cả năm = gộp các tháng) ----
  const warnings = useMemo<Warn[]>(() => {
    const w: Warn[] = [];
    const ps = month === 'year' ? yearPeriods : [month];
    ps.forEach((p) => {
      const full = monthly[p];
      const r = monthlyK[p];
      if (!full || !r) return;
      if (!khoi)
        full.unallocated.forEach((s) =>
          w.push({ kind: 'unallocated', key: s.username, name: s.fullName || s.username, period: p, detail: `Có lương ${vnd(s.salary + s.bhxh + s.cpcd)} đ nhưng không log Jira / chưa phân bổ` }),
        );
      r.employees.forEach((e) => {
        const fe = full.employees.find((x) => x.username === e.username)!; // giờ toàn kỳ (mọi khối)
        if (!fe.hasSalary) w.push({ kind: 'noSalary', key: e.username, name: e.fullName, period: p, detail: `Log ${r2(fe.hours)}h nhưng chưa có lương → chi phí = 0` });
        if (fe.pendingWeeks) w.push({ kind: 'pending', key: e.username, name: e.fullName, period: p, detail: `${fe.pendingWeeks} tuần timesheet chưa được duyệt` });
        if (fe.hours < fe.required * 0.9) w.push({ kind: 'under', key: e.username, name: e.fullName, period: p, detail: `Log ${r2(fe.hours)}h / chuẩn ${fe.required}h (${pct(fe.hours / fe.required)}) — lương vẫn phân bổ hết theo giờ đã log` });
        if (fe.hours > fe.required * 1.1) w.push({ kind: 'over', key: e.username, name: e.fullName, period: p, detail: `Log ${r2(fe.hours)}h / chuẩn ${fe.required}h (${pct(fe.hours / fe.required)})` });
      });
    });
    // Dự án chưa gán khối (1 dòng / dự án, cộng dồn chi phí)
    if (!khoi || khoi === NO_KHOI) {
      const agg = new Map<string, number>();
      ps.forEach((p) => monthly[p]?.projects.filter((x) => x.khoi === NO_KHOI).forEach((x) => agg.set(x.project, (agg.get(x.project) || 0) + x.total)));
      agg.forEach((t, code) => w.unshift({ kind: 'noKhoi', key: code, name: code, period: month, detail: `Chưa thuộc khối nào — ${vnd(t)} đ chi phí chưa tính vào khối` }));
    }
    return w;
  }, [monthly, monthlyK, month, khoi, yearPeriods]);
  const critical = warnings.filter((x) => x.kind === 'noSalary' || x.kind === 'unallocated' || x.kind === 'noKhoi').length;

  // ---- Cột bảng ----
  const projCols: Column<ProjectResult>[] = [
    { key: 'project', label: 'Mã dự án', get: (p) => p.project, render: (p) => <span className="font-mono font-bold text-blue-600">{p.project}</span> },
    { key: 'headcount', label: 'Số NV', get: (p) => p.headcount, numeric: true, filterable: false },
    { key: 'hours', label: 'Giờ công', get: (p) => r2(p.hours), numeric: true, total: true, filterable: false },
    { key: 'days', label: 'Ngày công', get: (p) => r2(p.hours / HOURS_PER_DAY), numeric: true, total: true, filterable: false },
    { key: 'mm', label: 'Man-month', get: (p) => r2(p.mm), numeric: true, total: true, filterable: false },
    { key: 'salary', label: 'Lương', get: (p) => r0(p.salary), numeric: true, total: true, filterable: false },
    { key: 'bhxh', label: 'BHXH', get: (p) => r0(p.bhxh), numeric: true, total: true, filterable: false },
    { key: 'cpcd', label: 'CPCĐ', get: (p) => r0(p.cpcd), numeric: true, total: true, filterable: false },
    {
      key: 'total',
      label: 'Tổng chi phí',
      get: (p) => r0(p.total),
      render: (p) => <span className="font-black text-rose-700">{r0(p.total).toLocaleString('en-US')}</span>,
      numeric: true,
      total: true,
      filterable: false,
    },
  ];
  const empCols: Column<EmployeeResult>[] = [
    { key: 'username', label: 'Username', get: (e) => e.username, render: (e) => <span className="font-mono font-bold text-slate-700">{e.username}</span> },
    { key: 'fullName', label: 'Họ tên', get: (e) => e.fullName },
    {
      key: 'hours',
      label: khoi ? `Giờ vào khối ${khoi}` : 'Giờ log',
      get: (e) => r2(e.hours),
      render: (e) => (
        <span>
          {r2(e.hours).toLocaleString('en-US')}
          {e.manualHours > 0 && <span className="ml-1 text-[10px] text-slate-400" title="Có giờ phân bổ thủ công">✎</span>}
        </span>
      ),
      numeric: true,
      total: true,
      filterable: false,
    },
    { key: 'nproj', label: 'Số DA', get: (e) => e.allocations.length, numeric: true, filterable: false },
    {
      key: 'alloc',
      label: 'Phân bổ',
      get: (e) => e.allocations.map((a) => `${a.project} ${pct(a.ratio)}`).join(', '),
      render: (e) => (
        <div className="flex flex-wrap gap-1 max-w-[320px]">
          {e.allocations.slice(0, 3).map((a) => (
            <span key={a.project} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600 whitespace-nowrap">
              {a.project} · {pct(a.ratio)}
            </span>
          ))}
          {e.allocations.length > 3 && <span className="text-[10px] text-slate-400">+{e.allocations.length - 3}</span>}
        </div>
      ),
    },
    {
      key: 'total',
      label: khoi ? `CP tính vào khối ${khoi}` : 'Chi phí lương',
      get: (e) => r0(e.total),
      render: (e) => (e.hasSalary ? r0(e.total).toLocaleString('en-US') : <span className="text-rose-500 text-[11px] font-bold">Thiếu lương</span>),
      numeric: true,
      total: true,
      filterable: false,
    },
  ];

  const monthOptions: [string, string, boolean?][] = [
    ['year', `Cả năm ${year}`],
    ...MONTHS.map((m): [string, string, boolean] => {
      const p = ym(year, m);
      const has = yearPeriods.includes(p);
      return [p, `Tháng ${periodLabel(p)}${has ? '' : ' · chưa có dữ liệu'}`, !has];
    }),
  ];
  const nMonths = resultsOf(monthlyK).filter((r) => r.totals.total > 0).length;

  return (
    <div className="p-4 sm:p-6 bg-slate-50/50 min-h-screen space-y-4 font-sans">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`fixed top-6 right-6 z-[120] px-5 py-3 rounded-2xl shadow-2xl text-xs max-w-md space-y-0.5 ${toast.error ? 'bg-rose-600 text-white' : 'bg-slate-900/95 text-white'}`}
          >
            {toast.lines.map((l, i) => (
              <p key={i} className={i === 0 ? 'font-bold' : 'text-slate-300'}>{l}</p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <Breadcrumb items={['Quản lý dự án', 'Chi phí nhân công dự án']} />
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight -mt-2">Chi Phí Nhân Công Theo Khối &amp; Dự Án</h1>
      </div>

      {/* Bộ lọc + hành động */}
      <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <Select label="Năm" value={String(year)} onChange={(v) => setYear(+v)} options={years.map((y) => [String(y), String(y)])} />
        <Select label="Khối" value={khoi} onChange={setKhoi} options={[['', 'Tất cả khối'], ...khoiList.map((k) => [k, k] as [string, string]), [NO_KHOI, NO_KHOI]]} />
        <Select label="Tháng" value={month} onChange={setMonth} options={monthOptions} />
        <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5">
          <FileSpreadsheet size={13} className="text-emerald-600" /> <strong className="text-slate-700">{ds.source}</strong>
          <span className="text-slate-400">· {yearPeriods.length} tháng có dữ liệu</span>
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          <button onClick={() => XLSX.writeFile(buildTemplate(), 'Mau_ChiPhiNhanCong.xlsx')} className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <Download size={13} /> File mẫu
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importFile(f);
              e.target.value = '';
            }}
          />
          <button onClick={() => fileRef.current?.click()} className="px-3 py-1.5 border border-emerald-200 bg-emerald-50 rounded-xl text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <Upload size={13} /> Nhập dữ liệu tháng
          </button>
          {ds.source !== 'Dữ liệu mẫu' && (
            <button onClick={() => setDs(sampleDataset())} className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer" title="Quay lại dữ liệu mẫu">
              <RotateCcw size={13} />
            </button>
          )}
          <button
            onClick={() => XLSX.writeFile(buildReport(res, { year, rows: matrix }), `ChiPhiNhanCong_${khoi || 'TatCa'}_${month === 'year' ? year : month}.xlsx`)}
            className="px-3.5 py-1.5 bg-[#0fa57c] hover:bg-[#0c8e6b] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <FileSpreadsheet size={14} /> Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="px-4 py-2.5 rounded-2xl border border-blue-100 bg-blue-50/50 text-[11px] text-slate-600 flex items-start gap-2">
        <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-700">CP nhân công dự án (tháng)</strong> = Σ<sub>NV</sub> ( Giờ NV log vào dự án ÷ Tổng giờ NV log trong tháng ) × ( Lương + CP BHXH + CPCĐ của tháng ).
          <strong className="text-slate-700"> CP khối</strong> = tổng CP các dự án thuộc khối — NV làm chéo khối được tính về khối của dự án.
        </span>
      </div>

      <StatGrid
        items={[
          { label: `Tổng CP · ${month === 'year' ? `năm ${year}` : `tháng ${periodLabel(month)}`}`, value: million(res.totals.total), tone: 'success' },
          {
            label: 'Bình quân / tháng',
            value: million(nMonths ? resultsOf(monthlyK).reduce((s, r) => s + r.totals.total, 0) / nMonths : 0),
          },
          { label: 'Dự án · Nhân sự', value: `${res.projects.length} · ${res.employees.length}` },
          { label: 'Cảnh báo', value: `${warnings.length}${critical ? ` (${critical} ảnh hưởng CP)` : ''}`, tone: critical ? 'danger' : warnings.length ? 'warning' : 'default' },
        ]}
      />

      <div className="flex gap-1 border-b border-slate-200">
        {(
          [
            ['overview', 'Khối × Tháng'],
            ['project', `Theo dự án (${res.projects.length})`],
            ['employee', `Theo nhân viên (${res.employees.length})`],
            ['warning', `Cảnh báo (${warnings.length})`],
          ] as [Tab, string][]
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-2 text-xs font-bold border-b-2 -mb-px cursor-pointer ${tab === k ? 'border-[#0fa57c] text-[#0fa57c]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <Overview year={year} rows={matrix} khoiList={khoiList} colorOf={colorOf} single={khoi} active={month === 'year' ? null : +month.slice(5) - 1} onDrill={drill} />
      )}
      {tab === 'project' && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Select label="Năm" value={String(year)} onChange={(v) => setYear(+v)} options={years.map((y) => [String(y), String(y)])} />
            <Select label="Tháng" value={month} onChange={setMonth} options={monthOptions} />
            <Select
              label="Khối"
              value={khoi}
              onChange={setKhoi}
              options={['', ...khoiList, NO_KHOI]
                .filter((k) => k === '' || k === khoi || khoiCounts[k])
                .map((k) => [k, `${k || 'Tất cả khối'} (${khoiCounts[k] || 0})`] as [string, string])}
            />
          </div>
          <DataTable
            rows={res.projects}
            columns={projCols}
            getRowKey={(p) => p.project}
            onRowClick={setProjDetail}
            onView={setProjDetail}
            searchPlaceholder="Tìm mã dự án..."
            exportFileName={`cp-nhan-cong-du-an-${khoi || 'tat-ca'}-${month}`}
            totalLabel={`Tổng: ${res.projects.length} dự án`}
          />
        </>
      )}
      {tab === 'employee' && (
        <>
          <p className="text-[11px] text-slate-500 font-semibold -mb-2">{scopeLabel}</p>
          <DataTable
            rows={res.employees}
            columns={empCols}
            getRowKey={(e) => e.username}
            onRowClick={setEmpDetail}
            onView={setEmpDetail}
            searchPlaceholder="Tìm nhân viên..."
            exportFileName={`cp-nhan-cong-nhan-vien-${khoi || 'tat-ca'}-${month}`}
            totalLabel={`Tổng: ${res.employees.length} nhân viên`}
          />
        </>
      )}
      {tab === 'warning' && (
        <WarningList
          warnings={warnings}
          showPeriod={month === 'year'}
          khoiList={khoiList}
          onAssign={assignKhoi}
          onAllocate={(username, fullName, period) => setManualFor({ username, fullName, period })}
        />
      )}

      {/* Drawer dự án */}
      <AnimatePresence>
        {projDetail && (
          <Drawer title={projDetail.project} subtitle={`Khối ${projDetail.khoi} · ${month === 'year' ? `cả năm ${year}` : `tháng ${periodLabel(month)}`}`} onClose={() => setProjDetail(null)}>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Kpi label="Tổng chi phí" value={`${vnd(projDetail.total)} đ`} strong />
              <Kpi label="Giờ / ngày công" value={`${r2(projDetail.hours)}h · ${r2(projDetail.hours / HOURS_PER_DAY)} ngày`} />
              <Kpi label="Lương · BHXH · CPCĐ" value={`${million(projDetail.salary)} · ${million(projDetail.bhxh)} · ${million(projDetail.cpcd)}`} />
              <Kpi label="Nhân sự · Man-month" value={`${projDetail.headcount} NV · ${r2(projDetail.mm)} MM`} />
            </div>
            {month === 'year' && (
              <MonthBars
                values={MONTHS.map((m) => monthlyK[ym(year, m)]?.projects.find((p) => p.project === projDetail.project)?.total || 0)}
                color={colorOf(projDetail.khoi)}
              />
            )}
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="px-2 py-2 text-left">Nhân viên</th>
                  <th className="px-2 py-2 text-right">Giờ</th>
                  <th className="px-2 py-2 text-right">Chi phí</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projDetail.members.map((a) => (
                  <tr key={a.username}>
                    <td className="px-2 py-1.5">
                      <p className="font-bold text-slate-700">{a.fullName}</p>
                      <p className="text-[10px] font-mono text-slate-400">{a.username}{a.manualHours > 0 && ' · phân bổ thủ công'}</p>
                    </td>
                    <td className="px-2 py-1.5 text-right font-mono">{r2(a.hours)}</td>
                    <td className="px-2 py-1.5 text-right font-mono font-bold">{a.total ? vnd(a.total) : <span className="text-rose-500">0 · thiếu lương</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Drawer>
        )}
      </AnimatePresence>

      {/* Drawer nhân viên */}
      <AnimatePresence>
        {empDetail && (
          <Drawer title={empDetail.fullName} subtitle={`${empDetail.username} · ${scopeLabel}`} onClose={() => setEmpDetail(null)}>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Kpi label={khoi ? `CP vào khối ${khoi}` : 'Chi phí lương'} value={empDetail.hasSalary ? `${vnd(empDetail.total)} đ` : 'Chưa có lương'} strong />
              <Kpi label={khoi ? 'Giờ vào khối' : 'Giờ log / chuẩn'} value={khoi ? `${r2(empDetail.hours)}h` : `${r2(empDetail.hours)}h / ${empDetail.required}h`} />
              <Kpi label="Lương" value={vnd(empDetail.salary)} />
              <Kpi label="BHXH · CPCĐ" value={`${vnd(empDetail.bhxh)} · ${vnd(empDetail.cpcd)}`} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Phân bổ vào dự án</p>
            <div className="space-y-2">
              {empDetail.allocations.map((a) => (
                <div key={a.project}>
                  <div className="flex justify-between text-xs">
                    <span className="font-mono font-bold text-blue-600">
                      {a.project} <span className="text-[10px] text-slate-400 font-sans">{khoiOf(a.project)}</span>
                    </span>
                    <span className="font-mono text-slate-600">
                      {r2(a.hours)}h · {pct(a.ratio)} · <strong className="text-slate-800">{vnd(a.total)}</strong>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${a.ratio * 100}%`, background: colorOf(khoiOf(a.project)) }} />
                  </div>
                  {a.manualHours > 0 && <p className="text-[10px] text-slate-400 mt-0.5">Trong đó {r2(a.manualHours)}h phân bổ thủ công</p>}
                </div>
              ))}
            </div>
            {month !== 'year' && (
              <button
                onClick={() => setManualFor({ username: empDetail.username, fullName: empDetail.fullName, period: month })}
                className="mt-4 w-full py-2 rounded-xl border border-dashed border-slate-300 text-slate-500 hover:border-emerald-400 hover:text-emerald-600 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus size={13} /> Phân bổ thủ công tháng {periodLabel(month)}
              </button>
            )}
          </Drawer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {manualFor && (
          <ManualModal
            who={manualFor}
            initial={ds.manual.filter((m) => m.period === manualFor.period && m.username === manualFor.username)}
            projects={Array.from(new Set(resultsOf(monthly).flatMap((r) => r.projects.map((p) => p.project))))}
            onClose={() => setManualFor(null)}
            onSave={(rows) => saveManual(manualFor.username, manualFor.fullName, manualFor.period, rows)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================================================
// Tab Khối × Tháng: biểu đồ cột chồng + ma trận
// ==========================================================================
const Overview: React.FC<{
  year: number;
  rows: { khoi: string; project: string; months: number[] }[];
  khoiList: string[];
  colorOf: (k: string) => string;
  single: string;
  active: number | null; // tháng đang chọn ở bộ lọc (0-11), null = cả năm
  onDrill: (khoi: string, period: string | 'year') => void;
}> = ({ year, rows, khoiList, colorOf, single, active, onDrill }) => {
  const hl = (i: number) => (active === i ? 'bg-emerald-50 ring-1 ring-inset ring-emerald-200' : '');
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [hover, setHover] = useState<number | null>(null);

  // Tổng theo khối × tháng, thứ tự khối cố định
  const order = [...khoiList, NO_KHOI];
  const byKhoi = order
    .map((k) => {
      const list = rows.filter((r) => r.khoi === k).sort((a, b) => b.months.reduce((x, y) => x + y, 0) - a.months.reduce((x, y) => x + y, 0));
      return { khoi: k, list, months: MONTHS.map((_, i) => list.reduce((s, r) => s + r.months[i], 0)) };
    })
    .filter((x) => x.list.length);
  const colTot = MONTHS.map((_, i) => byKhoi.reduce((s, k) => s + k.months[i], 0));
  const max = Math.max(...colTot, 1);
  const grand = colTot.reduce((a, b) => a + b, 0);
  const H = 200;

  if (!byKhoi.length) return <div className="bg-white rounded-2xl border border-slate-200 py-12 text-center text-xs text-slate-400">Chưa có dữ liệu năm {year}.</div>;

  return (
    <div className="space-y-4">
      {/* Biểu đồ */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
        <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
          <div>
            <h3 className="text-sm font-black text-slate-800">Chi phí nhân công theo tháng — {single ? `Khối ${single}` : 'các khối'} · {year}</h3>
            <p className="text-[11px] text-slate-500">Triệu VNĐ · bấm vào cột để xem chi tiết dự án của tháng</p>
          </div>
          {byKhoi.length > 1 && (
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {byKhoi.map((k) => (
                <span key={k.khoi} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: colorOf(k.khoi) }} /> {k.khoi}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="relative flex items-end gap-2 pl-10" style={{ height: H + 24 }}>
          {/* Lưới */}
          {[0, 0.5, 1].map((t) => (
            <div key={t} className="absolute left-10 right-0 border-t border-slate-100" style={{ bottom: 24 + t * H }}>
              <span className="absolute -left-10 -top-2 w-9 text-right text-[10px] text-slate-400 font-mono">{mil1(max * t) === '–' ? '0' : Math.round((max * t) / 1e6).toLocaleString('vi-VN')}</span>
            </div>
          ))}
          {MONTHS.map((m, i) => {
            const tot = colTot[i];
            return (
              <div
                key={m}
                className="relative flex-1 flex flex-col items-center justify-end h-full cursor-pointer"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onClick={() => tot && onDrill(single, `${year}-${String(m).padStart(2, '0')}`)}
              >
                <div className={`w-full max-w-[44px] flex flex-col-reverse gap-[2px] ${(hover !== null ? hover !== i : active !== null && active !== i) ? 'opacity-40' : ''}`} style={{ height: (tot / max) * H }}>
                  {byKhoi.map((k, ki) =>
                    k.months[i] > 0 ? (
                      <div
                        key={k.khoi}
                        style={{ height: `${(k.months[i] / tot) * 100}%`, background: colorOf(k.khoi) }}
                        className={ki === byKhoi.length - 1 || byKhoi.slice(ki + 1).every((x) => !x.months[i]) ? 'rounded-t-[4px]' : ''}
                      />
                    ) : null,
                  )}
                </div>
                <span className="h-6 flex items-center text-[10px] font-bold text-slate-500">T{m}</span>
                {hover === i && tot > 0 && (
                  <div className="absolute bottom-full mb-2 z-20 bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2 text-[11px] whitespace-nowrap pointer-events-none">
                    <p className="font-black text-slate-800 mb-1">Tháng {m}/{year} · {mil1(tot)} tr</p>
                    {byKhoi
                      .filter((k) => k.months[i])
                      .map((k) => (
                        <p key={k.khoi} className="flex items-center gap-1.5 text-slate-600">
                          <span className="w-2 h-2 rounded-sm" style={{ background: colorOf(k.khoi) }} />
                          {k.khoi}: <span className="font-mono font-bold text-slate-800">{mil1(k.months[i])}</span>
                        </p>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ma trận khối × tháng */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[1100px]">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                <th className="px-3 py-2 text-left sticky left-0 bg-slate-100 z-10 min-w-[200px]">Khối / Dự án</th>
                {MONTHS.map((m) => (
                  <th key={m} className={`px-2 py-2 text-right ${active === m - 1 ? 'bg-emerald-100 text-emerald-700' : ''}`}>T{m}</th>
                ))}
                <th className="px-3 py-2 text-right bg-slate-200/60 text-slate-700">Cả năm</th>
                <th className="px-2 py-2 text-right">Tỷ trọng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {byKhoi.map((k) => {
                const tot = k.months.reduce((a, b) => a + b, 0);
                const isOpen = open.has(k.khoi);
                return (
                  <React.Fragment key={k.khoi}>
                    <tr className="bg-slate-50/60 font-bold hover:bg-slate-100/60">
                      <td className="px-3 py-2 sticky left-0 bg-slate-50 z-10">
                        <button
                          onClick={() => setOpen((s) => (s.has(k.khoi) ? (s.delete(k.khoi), new Set(s)) : new Set(s.add(k.khoi))))}
                          className="flex items-center gap-2 cursor-pointer text-slate-800"
                        >
                          <ChevronRight size={13} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: colorOf(k.khoi) }} />
                          {k.khoi === NO_KHOI ? <span className="text-rose-600">{k.khoi}</span> : `Khối ${k.khoi}`}
                          <span className="text-[10px] font-semibold text-slate-400">{k.list.length} DA</span>
                        </button>
                      </td>
                      {k.months.map((v, i) => (
                        <td key={i} className={`px-2 py-2 text-right font-mono ${hl(i)}`}>
                          {v ? (
                            <button onClick={() => onDrill(k.khoi, `${year}-${String(i + 1).padStart(2, '0')}`)} className="hover:text-[#0fa57c] hover:underline cursor-pointer">
                              {mil1(v)}
                            </button>
                          ) : (
                            <span className="text-slate-300">–</span>
                          )}
                        </td>
                      ))}
                      <td className="px-3 py-2 text-right font-mono font-black bg-slate-100/80">
                        <button onClick={() => onDrill(k.khoi, 'year')} className="hover:text-[#0fa57c] hover:underline cursor-pointer">{mil1(tot)}</button>
                      </td>
                      <td className="px-2 py-2 text-right font-mono text-slate-500">{pct(grand ? tot / grand : 0)}</td>
                    </tr>
                    {isOpen &&
                      k.list.map((r) => {
                        const t = r.months.reduce((a, b) => a + b, 0);
                        return (
                          <tr key={r.project} className="hover:bg-slate-50/60 text-slate-600">
                            <td className="px-3 py-1.5 pl-12 sticky left-0 bg-white z-10 font-mono text-blue-600">{r.project}</td>
                            {r.months.map((v, i) => (
                              <td key={i} className={`px-2 py-1.5 text-right font-mono ${hl(i)}`}>{v ? mil1(v) : <span className="text-slate-300">–</span>}</td>
                            ))}
                            <td className="px-3 py-1.5 text-right font-mono font-bold bg-slate-50/80">{mil1(t)}</td>
                            <td className="px-2 py-1.5 text-right font-mono text-slate-400">{pct(grand ? t / grand : 0)}</td>
                          </tr>
                        );
                      })}
                  </React.Fragment>
                );
              })}
              <tr className="border-t-2 border-slate-300 bg-emerald-50/60 font-black text-emerald-800">
                <td className="px-3 py-2 sticky left-0 bg-emerald-50 z-10">Tổng cộng</td>
                {colTot.map((v, i) => (
                  <td key={i} className={`px-2 py-2 text-right font-mono ${active === i ? 'bg-emerald-100' : ''}`}>{mil1(v)}</td>
                ))}
                <td className="px-3 py-2 text-right font-mono bg-emerald-100/70">{mil1(grand)}</td>
                <td className="px-2 py-2 text-right font-mono">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="px-4 py-2 text-[10px] text-slate-400 border-t border-slate-100">Đơn vị: triệu VNĐ · bấm vào số để xem chi tiết dự án của khối trong tháng / cả năm.</p>
      </div>
    </div>
  );
};

/** Cột nhỏ 12 tháng trong drawer dự án (1 chuỗi — không cần chú thích) */
const MonthBars: React.FC<{ values: number[]; color: string }> = ({ values, color }) => {
  const max = Math.max(...values, 1);
  const [h, setH] = useState<number | null>(null);
  return (
    <div className="mb-4">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Chi phí theo tháng (triệu)</p>
      <div className="flex items-end gap-1 h-20">
        {values.map((v, i) => (
          <div key={i} className="relative flex-1 flex flex-col items-center justify-end h-full" onMouseEnter={() => setH(i)} onMouseLeave={() => setH(null)}>
            <div className="w-full rounded-t-[4px]" style={{ height: `${(v / max) * 100}%`, background: color, opacity: h !== null && h !== i ? 0.5 : 1 }} />
            <span className="text-[9px] text-slate-400 mt-0.5">{i + 1}</span>
            {h === i && (
              <span className="absolute bottom-full mb-1 bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap z-10">
                T{i + 1}: {mil1(v)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================================================
// Thành phần phụ
// ==========================================================================
const Select: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: ([string, string] | [string, string, boolean])[] }> = ({ label, value, onChange, options }) => (
  <label className="flex items-center gap-2">
    <span className="text-xs font-bold text-slate-500">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
    >
      {options.map(([v, l, disabled]) => (
        <option key={v} value={v} disabled={disabled} className={disabled ? 'text-slate-300' : ''}>{l}</option>
      ))}
    </select>
  </label>
);

const WARN_META: Record<Warn['kind'], { label: string; cls: string; icon: React.ReactNode }> = {
  noKhoi: { label: 'Chưa gán khối', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: <FolderX size={13} /> },
  unallocated: { label: 'Chưa phân bổ', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: <UserX size={13} /> },
  noSalary: { label: 'Thiếu lương', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: <Wallet size={13} /> },
  pending: { label: 'Chưa duyệt', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock size={13} /> },
  under: { label: 'Log thiếu giờ', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: <AlertTriangle size={13} /> },
  over: { label: 'Log vượt giờ', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: <AlertTriangle size={13} /> },
};

const WarningList: React.FC<{
  warnings: Warn[];
  showPeriod: boolean;
  khoiList: string[];
  onAssign: (code: string, khoi: string) => void;
  onAllocate: (u: string, n: string, period: string) => void;
}> = ({ warnings, showPeriod, khoiList, onAssign, onAllocate }) => {
  if (!warnings.length) return <div className="bg-white rounded-2xl border border-slate-200 py-10 text-center text-xs text-slate-400">Không có cảnh báo nào.</div>;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
      {warnings.map((w, i) => {
        const m = WARN_META[w.kind];
        return (
          <div key={i} className="px-4 py-2.5 flex items-center gap-3 text-xs">
            <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-black flex items-center gap-1 shrink-0 w-32 ${m.cls}`}>
              {m.icon} {m.label}
            </span>
            {showPeriod && <span className="font-mono text-[11px] text-slate-400 w-16 shrink-0">{w.kind === 'noKhoi' ? '' : periodLabel(w.period)}</span>}
            <span className="font-bold text-slate-700 shrink-0 w-44 truncate">
              {w.kind === 'noKhoi' ? <span className="font-mono text-blue-600">{w.name}</span> : <>{w.name} <span className="font-mono font-normal text-slate-400">{w.key}</span></>}
            </span>
            <span className="text-slate-500 flex-1">{w.detail}</span>
            {w.kind === 'unallocated' && (
              <button onClick={() => onAllocate(w.key, w.name, w.period)} className="px-2.5 py-1 rounded-lg bg-[#0fa57c] text-white text-[11px] font-bold hover:bg-[#0c8e6b] cursor-pointer shrink-0">
                Phân bổ
              </button>
            )}
            {w.kind === 'noKhoi' && (
              <select
                defaultValue=""
                onChange={(e) => e.target.value && onAssign(w.key, e.target.value)}
                className="text-[11px] font-bold rounded-lg px-2 py-1 border border-slate-200 bg-white text-slate-700 outline-none cursor-pointer shrink-0"
              >
                <option value="">Gán khối…</option>
                {khoiList.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            )}
          </div>
        );
      })}
    </div>
  );
};

const Kpi: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <div className={`rounded-xl border px-3 py-2 ${strong ? 'border-emerald-200 bg-emerald-50/60' : 'border-slate-100 bg-slate-50/60'}`}>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
    <p className={`text-xs font-mono mt-0.5 ${strong ? 'font-black text-emerald-700 text-sm' : 'font-bold text-slate-700'}`}>{value}</p>
  </div>
);

const Drawer: React.FC<{ title: string; subtitle: string; onClose: () => void; children: React.ReactNode }> = ({ title, subtitle, onClose, children }) => (
  <div className="fixed inset-0 z-[110] flex justify-end">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/30" />
    <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }} className="relative bg-white w-full max-w-md h-full shadow-2xl z-10 flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-800">{title}</h3>
          <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer">
          <X size={18} />
        </button>
      </div>
      <div className="p-4 overflow-y-auto flex-1">{children}</div>
    </motion.div>
  </div>
);

const ManualModal: React.FC<{
  who: { username: string; fullName: string; period: string };
  initial: ManualAllocation[];
  projects: string[];
  onClose: () => void;
  onSave: (rows: { project: string; hours: number }[]) => void;
}> = ({ who, initial, projects, onClose, onSave }) => {
  const [rows, setRows] = useState(initial.length ? initial.map((m) => ({ project: m.project, hours: m.hours })) : [{ project: '', hours: 0 }]);
  const set = (i: number, patch: Partial<{ project: string; hours: number }>) => setRows((p) => p.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const total = rows.reduce((s, r) => s + (r.hours || 0), 0);
  return (
    <div className="fixed inset-0 z-[115] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl z-10">
        <div className="p-4 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-800">Phân bổ thủ công — {who.fullName}</h3>
          <p className="text-[11px] text-slate-500">
            Tháng {periodLabel(who.period)} · Dùng cho NV không log Jira (hành chính, sale…). Giờ được cộng với giờ Jira khi tính tỷ lệ.
          </p>
        </div>
        <div className="p-4 space-y-2">
          <datalist id="labor-projects">
            {projects.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
          {rows.map((r, i) => (
            <div key={i} className="flex gap-2">
              <input
                list="labor-projects"
                value={r.project}
                onChange={(e) => set(i, { project: e.target.value })}
                placeholder="Mã dự án"
                className="flex-1 text-xs font-mono px-3 py-1.5 rounded-xl bg-white border border-slate-200 outline-none focus:border-emerald-500"
              />
              <input
                inputMode="decimal"
                value={r.hours || ''}
                onChange={(e) => set(i, { hours: Number(e.target.value.replace(',', '.')) || 0 })}
                placeholder="Số giờ"
                className="w-24 text-xs text-right font-mono px-3 py-1.5 rounded-xl bg-white border border-slate-200 outline-none focus:border-emerald-500"
              />
              <button onClick={() => setRows((p) => p.filter((_, j) => j !== i))} className="p-1.5 text-slate-300 hover:text-rose-600 cursor-pointer">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <button onClick={() => setRows((p) => [...p, { project: '', hours: 0 }])} className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer">
              <Plus size={13} /> Thêm dự án
            </button>
            <span className="text-[11px] text-slate-500">
              Tổng: <strong className="font-mono text-slate-700">{r2(total)}h</strong>
            </span>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer">
            Huỷ
          </button>
          <button onClick={() => onSave(rows)} className="px-3.5 py-1.5 bg-[#0fa57c] hover:bg-[#0c8e6b] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer">
            <Save size={14} /> Lưu phân bổ
          </button>
        </div>
      </motion.div>
    </div>
  );
};
