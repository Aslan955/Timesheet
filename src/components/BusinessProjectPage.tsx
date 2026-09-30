/**
 * BusinessProjectPage — "Dự án kinh doanh" (PAKD).
 *
 * Bước 1 của luồng kinh doanh mới: khai báo THÔNG TIN DỰ ÁN.
 *   • Danh sách dự án  → xem / tạo mới.
 *   • Form khai báo     → thông tin mã, cơ hội kinh doanh, tài chính tổng.
 *   • Chi tiết dự án    → bố cục theo màn PAKD Detail (mã, thông tin cơ hội, tài chính).
 * Các giai đoạn KH01 → KH05 hiển thị dạng stepper ngang dưới thông tin dự án.
 * Dưới cùng là SỐ LIỆU THEO THÁNG (import Excel — BizMonthlyImportModal), 2 tab: Kế hoạch / Thực tế
 * (kế toán import). Chỉ tiêu (dọc) × tháng (ngang); chỉ Chi tách SX / KD; lọc theo năm.
 *
 * Giao diện: khung kiểu phần mềm kế toán (src/components/erp/Erp.tsx).
 * Dữ liệu: src/business/BusinessProjectContext.tsx. Đơn vị: VNĐ.
 */
import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Save,
  Star,
  X,
  Trash2,
  FileUp,
  History,
  LayoutList,
  AlertCircle,
  Wallet,
  Building2,
  Hash,
  Check,
  Flag,
  Search,
  FileSpreadsheet,
  Table2,
} from 'lucide-react';
import {
  BizPhase,
  BizProject,
  BizProjectInput,
  BizStatus,
  BIZ_STATUSES,
  DIVISIONS,
  PROJECT_TYPES,
  useBusinessProjects,
  plannedCost,
  grossProfit,
  grossMargin,
  nextMasterCode,
  blankPhases,
  BizMonthRow,
  FIN_METRICS,
  FinKind,
  latestActualMonth,
  sumRows,
} from '../business/BusinessProjectContext';
import { BizMonthlyImportModal, fmtMonth } from './BizMonthlyImportModal';
import { LedgerDetailModal, LedgerDrill, drillCls } from './LedgerDetailModal';
import { Btn, ErpPage, ErpTitleBar, FieldTable, FolderTabs, FormRow, KpiBox, Panel, Segmented, Tag, erp } from './erp/Erp';

const CURRENT_USER = 'namnv';
const CRUMBS = ['Project Management', 'Dự án kinh doanh'];

const money = (n: number) => Math.round(n || 0).toLocaleString('en-US');
const num = (n: number) => (n ? Math.round(n).toLocaleString('en-US') : '–');
const dmy = (iso: string) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '—');
const dt = (iso: string) => new Date(iso).toLocaleString('vi-VN');

const STATUS_CLS: Record<BizStatus, string> = {
  'Nháp': 'bg-slate-100 text-slate-600 border-slate-300',
  'Chờ duyệt': 'bg-amber-50 text-amber-700 border-amber-300',
  'Đang triển khai': 'bg-blue-50 text-blue-700 border-blue-300',
  'Hoàn thành': 'bg-emerald-50 text-emerald-700 border-emerald-300',
  'Đóng': 'bg-rose-50 text-rose-700 border-rose-300',
};
const StatusBadge: React.FC<{ status: BizStatus }> = ({ status }) => <Tag cls={STATUS_CLS[status]}>{status}</Tag>;
const KeyBadge = () => (
  <Tag cls="bg-amber-50 text-amber-700 border-amber-300" icon={Star}>
    KEY
  </Tag>
);

type View = { mode: 'list' } | { mode: 'detail'; id: string } | { mode: 'form'; id?: string };

export const BusinessProjectPage: React.FC = () => {
  const { projects, createProject, updateProject, deleteProject, importMonthly } = useBusinessProjects();
  const [view, setView] = useState<View>({ mode: 'list' });
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const current = view.mode !== 'list' && 'id' in view && view.id ? projects.find((p) => p.id === view.id) : undefined;

  return (
    <ErpPage>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-5 right-5 z-[120] bg-[#1e3a5f] text-white px-4 py-2.5 rounded-[4px] shadow-lg border border-[#16304f] flex items-center gap-2 text-[12px] font-semibold max-w-md"
          >
            <Check size={14} className="text-emerald-300 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {view.mode === 'list' && (
        <ProjectList projects={projects} onView={(p) => setView({ mode: 'detail', id: p.id })} onCreate={() => setView({ mode: 'form' })} />
      )}

      {view.mode === 'detail' && current && (
        <ProjectDetail
          project={current}
          onBack={() => setView({ mode: 'list' })}
          onEdit={() => setView({ mode: 'form', id: current.id })}
          onImport={(kind, rows, fileName, summary) => {
            importMonthly(current.id, kind, rows, fileName, CURRENT_USER);
            flash(`${summary} — Version ${current.version + 1}`);
          }}
          onDelete={() => {
            if (!window.confirm(`Xoá dự án "${current.name}"?`)) return;
            deleteProject(current.id);
            setView({ mode: 'list' });
            flash('Đã xoá dự án');
          }}
        />
      )}

      {view.mode === 'form' && (
        <ProjectForm
          initial={current}
          projects={projects}
          onCancel={() => setView(current ? { mode: 'detail', id: current.id } : { mode: 'list' })}
          onSubmit={(data) => {
            if (current) {
              updateProject(current.id, data, CURRENT_USER);
              setView({ mode: 'detail', id: current.id });
              flash(`Đã cập nhật dự án — Version ${current.version + 1}`);
            } else {
              const p = createProject(data, CURRENT_USER);
              setView({ mode: 'detail', id: p.id });
              flash('Đã tạo dự án. Bước tiếp theo: import kế hoạch theo tháng.');
            }
          }}
        />
      )}
    </ErpPage>
  );
};

// ==========================================================================
// Danh sách
// ==========================================================================
const ProjectList: React.FC<{
  projects: BizProject[];
  onView: (p: BizProject) => void;
  onCreate: () => void;
}> = ({ projects, onView, onCreate }) => {
  const [q, setQ] = useState('');
  const [division, setDivision] = useState('');
  const [status, setStatus] = useState('');

  const rows = useMemo(() => {
    const n = q.trim().toLowerCase();
    return projects.filter(
      (p) =>
        (!division || p.division === division) &&
        (!status || p.status === status) &&
        (!n || [p.masterCode, p.name, p.customerCode, p.customerName].some((v) => v.toLowerCase().includes(n))),
    );
  }, [projects, q, division, status]);

  const rev = rows.reduce((s, p) => s + p.expectedRevenue, 0);
  const cost = rows.reduce((s, p) => s + plannedCost(p), 0);
  const gp = rev - cost;

  const exportXlsx = () => {
    const data = [
      ['STT', 'Mã Master', 'Tên dự án', 'Khối', 'Loại dự án', 'Mã KH', 'Khách hàng', 'Bắt đầu', 'Kết thúc', 'Doanh thu dự kiến', 'Chi phí kế hoạch', 'LN gộp', 'Version', 'Trạng thái'],
      ...rows.map((p, i) => [i + 1, p.masterCode, p.name, p.division, p.projectType, p.customerCode, p.customerName, dmy(p.startDate), dmy(p.endDate), p.expectedRevenue, plannedCost(p), grossProfit(p), `v${p.version}`, p.status]),
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data), 'DuAn');
    XLSX.writeFile(wb, 'du-an-kinh-doanh.xlsx');
  };

  return (
    <>
      <ErpTitleBar
        crumbs={CRUMBS}
        title="Dự án kinh doanh (PAKD)"
        actions={
          <Btn variant="success" icon={Plus} onClick={onCreate}>
            Tạo dự án
          </Btn>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiBox label="Số dự án" value={rows.length} sub={`${rows.filter((p) => p.isKey).length} dự án KEY`} />
        <KpiBox label="Doanh thu dự kiến (VNĐ)" value={money(rev)} valueText={money(rev)} tone="good" sub="Tổng các dự án đang lọc" />
        <KpiBox label="Chi phí kế hoạch (VNĐ)" value={money(cost)} valueText={money(cost)} tone="bad" sub="Chi SX + Chi KD" />
        <KpiBox label="LN gộp kế hoạch (VNĐ)" value={money(gp)} valueText={money(gp)} sub={`Biên LN gộp ${rev ? ((gp / rev) * 100).toFixed(1) : 0}%`} />
      </div>

      <Panel
        title="Danh sách dự án"
        icon={Table2}
        noPad
        actions={
          <>
            <div className="relative w-64">
              <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm mã, tên dự án, khách hàng..." className={`${erp.inputFull} h-7 pl-7`} />
            </div>
            <select value={division} onChange={(e) => setDivision(e.target.value)} className={`${erp.input} h-7 w-32`}>
              <option value="">Tất cả khối</option>
              {DIVISIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${erp.input} h-7 w-40`}>
              <option value="">Tất cả trạng thái</option>
              {BIZ_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <Btn icon={FileSpreadsheet} onClick={exportXlsx} className="h-7">
              Xuất Excel
            </Btn>
          </>
        }
        footer={`${rows.length} / ${projects.length} dự án · Bấm vào 1 dòng để xem chi tiết`}
      >
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                {['STT', 'Mã Master', 'Tên dự án', 'Khối', 'Loại dự án', 'Khách hàng', 'Thời gian', 'Doanh thu dự kiến', 'Chi phí kế hoạch', 'LN gộp', 'Ver', 'Trạng thái'].map((h, i) => (
                  <th key={h} className={`${erp.th} ${i >= 7 && i <= 9 ? 'text-right' : 'text-left'} ${i === 2 ? 'min-w-[220px]' : i === 5 ? 'min-w-[200px]' : ''} border-t-0 first:border-l-0 last:border-r-0`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p.id} onClick={() => onView(p)} className={`${erp.tr} cursor-pointer`}>
                  <td className={`${erp.td} text-center text-slate-500 border-l-0`}>{i + 1}</td>
                  <td className={`${erp.td} ${erp.code} font-semibold whitespace-nowrap`}>{p.masterCode}</td>
                  <td className={erp.td}>
                    <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                      {p.name} {p.isKey && <KeyBadge />}
                    </span>
                  </td>
                  <td className={`${erp.td} text-center`}>{p.division}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{p.projectType}</td>
                  <td className={erp.td}>
                    <span className="font-mono text-slate-500">{p.customerCode}</span> · {p.customerName}
                  </td>
                  <td className={`${erp.td} whitespace-nowrap text-slate-600`}>
                    {dmy(p.startDate)} → {dmy(p.endDate)}
                  </td>
                  <td className={`${erp.td} ${erp.num}`}>{money(p.expectedRevenue)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{money(plannedCost(p))}</td>
                  <td className={`${erp.td} ${erp.num} ${grossProfit(p) < 0 ? 'text-rose-600' : ''}`}>{money(grossProfit(p))}</td>
                  <td className={`${erp.td} text-center text-slate-500`}>v{p.version}</td>
                  <td className={`${erp.td} border-r-0`}>
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={12} className={`${erp.td} text-center text-slate-400 py-6`}>
                    Không có dự án phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className={erp.totalRow}>
                  <td className={`${erp.td} border-l-0`} colSpan={7}>
                    Tổng cộng ({rows.length} dự án)
                  </td>
                  <td className={`${erp.td} ${erp.num}`}>{money(rev)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{money(cost)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{money(gp)}</td>
                  <td className={`${erp.td} border-r-0`} colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Panel>
    </>
  );
};

// ==========================================================================
// Giai đoạn KH01 → KH05 — stepper ngang
// ==========================================================================
const PhaseStepper: React.FC<{ phases: BizPhase[]; current: string }> = ({ phases, current }) => {
  const curIdx = Math.max(0, phases.findIndex((p) => p.code === current));
  const [sel, setSel] = useState(curIdx);
  const ph = phases[sel] || phases[curIdx];

  return (
    <Panel
      title="Thông tin các giai đoạn (KH01 → KH05)"
      icon={Flag}
      actions={
        <span className="text-[12px] text-slate-600">
          Giai đoạn hiện tại:{' '}
          <strong className="text-[#1f5fa8]">
            {phases[curIdx]?.code} — {phases[curIdx]?.name}
          </strong>
        </span>
      }
    >
      <div className="overflow-x-auto pb-1">
        <ol className="grid min-w-[760px]" style={{ gridTemplateColumns: `repeat(${phases.length}, minmax(0, 1fr))` }}>
          {phases.map((p, i) => {
            const state = i < curIdx ? 'done' : i === curIdx ? 'current' : 'todo';
            return (
              <li key={p.code} className="flex flex-col items-center">
                <div className="relative w-full h-7 flex items-center justify-center">
                  {i > 0 && <span className={`absolute left-0 right-1/2 top-1/2 -translate-y-1/2 h-[2px] ${i <= curIdx ? 'bg-emerald-600' : 'bg-slate-300'}`} />}
                  {i < phases.length - 1 && <span className={`absolute left-1/2 right-0 top-1/2 -translate-y-1/2 h-[2px] ${i < curIdx ? 'bg-emerald-600' : 'bg-slate-300'}`} />}
                  <span
                    className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${
                      state === 'done' ? 'bg-emerald-600 text-white' : state === 'current' ? 'bg-white border-[3px] border-[#1f5fa8] ring-4 ring-[#1f5fa8]/15' : 'bg-white border-2 border-slate-300'
                    }`}
                  >
                    {state === 'done' && <Check size={13} strokeWidth={3} />}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSel(i)}
                  className={`mt-2 mx-1 w-[calc(100%-8px)] text-left rounded-[3px] border px-3 py-2 cursor-pointer ${
                    state === 'current' ? 'border-[#1f5fa8] bg-[#eaf2fc]' : 'border-slate-300 bg-white hover:bg-slate-50'
                  } ${sel === i ? 'outline outline-2 outline-offset-1 outline-[#1f5fa8]/40' : ''}`}
                >
                  <p className={`text-[11px] font-bold ${state === 'todo' ? 'text-slate-400' : state === 'current' ? 'text-[#1f5fa8]' : 'text-emerald-700'}`}>{p.code}</p>
                  <p className="text-[13px] font-semibold text-slate-800 truncate" title={p.name}>
                    {p.name}
                  </p>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {ph && (
        <table className={`${erp.table} mt-3`}>
          <thead>
            <tr>
              {['Giai đoạn', 'Bắt đầu', 'Kết thúc', 'Mục tiêu', 'Đầu ra'].map((h) => (
                <th key={h} className={`${erp.th} text-left`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={`${erp.td} font-semibold whitespace-nowrap`}>
                {ph.code} — {ph.name}
              </td>
              <td className={`${erp.td} whitespace-nowrap`}>{dmy(ph.start)}</td>
              <td className={`${erp.td} whitespace-nowrap`}>{dmy(ph.end)}</td>
              <td className={erp.td}>{ph.objective || '—'}</td>
              <td className={erp.td}>{ph.output || '—'}</td>
            </tr>
          </tbody>
        </table>
      )}
    </Panel>
  );
};

// ==========================================================================
// Số liệu dự án theo tháng — Kế hoạch / Thực tế (import Excel) — ĐVT VNĐ
// ==========================================================================
// Dòng hiển thị: "Chi" = SX + KD, kèm 2 dòng con. `drill`: ở tab Thực tế, bấm con số → xem dòng sổ kế toán.
type FinRow = {
  label: Record<FinKind, string>;
  get: (r: BizMonthRow) => number;
  labelCls: string;
  sub?: boolean;
  drill?: Pick<LedgerDrill, 'kind' | 'part'>;
};
const FIN_ROWS: FinRow[] = [
  { label: { plan: 'Doanh thu dự kiến', actual: 'Doanh thu thực tế' }, get: (r) => r.revenue, labelCls: 'text-emerald-800' },
  { label: { plan: 'Thu dự kiến', actual: 'Thu thực tế' }, get: (r) => r.cashIn, labelCls: 'text-emerald-800', drill: { kind: 'cashIn' } },
  { label: { plan: 'Chi dự kiến', actual: 'Chi thực tế' }, get: (r) => r.costSx + r.costKd, labelCls: 'text-rose-800', drill: { kind: 'cost' } },
  { label: { plan: 'Chi cho dự án sản xuất (SX)', actual: 'Chi cho dự án sản xuất (SX)' }, get: (r) => r.costSx, labelCls: 'text-rose-700', sub: true, drill: { kind: 'cost', part: 'sx' } },
  { label: { plan: 'Chi cho dự án kinh doanh (KD)', actual: 'Chi cho dự án kinh doanh (KD)' }, get: (r) => r.costKd, labelCls: 'text-rose-700', sub: true, drill: { kind: 'cost', part: 'kd' } },
  { label: { plan: 'Khối lượng công việc (SP)', actual: 'Khối lượng công việc (SP)' }, get: (r) => r.workload, labelCls: 'text-indigo-800' },
];

/** Con số trong bảng; có onClick thì bấm được để xem chi tiết sổ kế toán. */
const DrillNum: React.FC<{ value: number; onClick?: (v: number) => void }> = ({ value, onClick }) =>
  onClick && value ? (
    <button type="button" onClick={() => onClick(value)} className={`font-[inherit] ${drillCls}`} title="Xem chi tiết sổ kế toán">
      {num(value)}
    </button>
  ) : (
    <>{num(value)}</>
  );

const KIND_TEXT: Record<FinKind, { tab: string; importBtn: string; empty: string }> = {
  plan: { tab: 'Kế hoạch', importBtn: 'Import kế hoạch', empty: 'Dự án chưa có kế hoạch theo tháng' },
  actual: { tab: 'Thực tế (kế toán)', importBtn: 'Import thực tế', empty: 'Kế toán chưa import số thực tế' },
};

const FinanceSection: React.FC<{
  project: BizProject;
  onImport: (kind: FinKind, rows: BizMonthRow[], fileName: string, summary: string) => void;
}> = ({ project: p, onImport }) => {
  const [kind, setKind] = useState<FinKind>('plan');
  const [showImport, setShowImport] = useState(false);
  const [drill, setDrill] = useState<LedgerDrill | null>(null);
  const data = p[kind];
  const info = kind === 'plan' ? p.planImport : p.actualImport;
  const text = KIND_TEXT[kind];
  const years = useMemo(() => Array.from(new Set(data.map((r) => r.month.slice(0, 4)))).sort(), [data]);
  const [year, setYear] = useState<string>('all');
  const allYears = year === 'all' || !years.includes(year);
  const rows = allYears ? data : data.filter((r) => r.month.startsWith(year));
  const totalLabel = allYears ? (kind === 'plan' ? 'Cả dự án' : 'Luỹ kế') : `Năm ${year}`;
  const cutoff = latestActualMonth([p]);

  const canDrill = (fr: FinRow) => kind === 'actual' && !!fr.drill;
  const openDrill = (fr: FinRow, from: string, to: string, expected: number) =>
    setDrill({ ...fr.drill!, projects: [p], from, to, title: `${p.masterCode} — ${p.name}`, expected });

  const reconcile = [
    { label: 'Doanh thu dự kiến', plan: sumRows(p.plan, 'revenue'), info: p.expectedRevenue, infoLabel: 'Doanh thu dự kiến' },
    { label: 'Chi dự kiến - SX', plan: sumRows(p.plan, 'costSx'), info: p.plannedProductionCost, infoLabel: 'Chi phí sản xuất KH' },
    { label: 'Chi dự kiến - KD', plan: sumRows(p.plan, 'costKd'), info: p.plannedBusinessCost, infoLabel: 'Chi phí kinh doanh KH' },
  ];

  return (
    <Panel
      title="Số liệu dự án theo tháng"
      icon={Table2}
      noPad
      actions={
        data.length > 0 && (
          <Btn variant="success" icon={FileUp} onClick={() => setShowImport(true)} className="h-7">
            {text.importBtn}
          </Btn>
        )
      }
      footer={
        <>
          ĐVT: VNĐ · KLCV: SP
          {kind === 'actual' && cutoff && <> · Chốt số đến {fmtMonth(cutoff)}</>}
          {info && (
            <>
              {' '}
              · Import từ <strong className="text-slate-600">{info.fileName}</strong> bởi {info.by} lúc {dt(info.at)}
            </>
          )}
          {kind === 'actual' && data.length > 0 && <> · Bấm vào con số Thu / Chi thực tế để xem chi tiết sổ kế toán</>}
        </>
      }
    >
      <div className="pt-2 bg-[#f3f6fa]">
        <FolderTabs
          tabs={(['plan', 'actual'] as const).map((k) => ({ key: k, label: `${KIND_TEXT[k].tab} (${p[k].length} tháng)` }))}
          value={kind}
          onChange={setKind}
        />
      </div>

      {data.length === 0 ? (
        <div className="m-3 flex flex-col items-center justify-center text-center py-10 border border-dashed border-slate-300 rounded-[4px] bg-slate-50">
          <FileUp size={26} className="text-slate-400 mb-2" />
          <p className="text-[13px] font-semibold text-slate-700">{text.empty}</p>
          <p className="text-[12px] text-slate-500 mt-1 max-w-md">
            Import file Excel, tháng nằm ngang từ {fmtMonth(p.startDate.slice(0, 7))} → {fmtMonth(p.endDate.slice(0, 7))}; chỉ tiêu nằm dọc:{' '}
            {FIN_METRICS[kind].map((m) => m.label).join(', ')}.
          </p>
          <Btn variant="success" icon={FileUp} onClick={() => setShowImport(true)} className="mt-3">
            {text.importBtn}
          </Btn>
        </div>
      ) : (
        <div className="p-3 space-y-3">
          {kind === 'plan' && (
            <table className={erp.table}>
              <thead>
                <tr>
                  <th className={`${erp.th} text-left`}>Đối chiếu với thông tin dự án</th>
                  <th className={`${erp.th} text-right`}>Tổng kế hoạch tháng</th>
                  <th className={`${erp.th} text-right`}>Thông tin dự án</th>
                  <th className={`${erp.th} text-right`}>Chênh lệch</th>
                  <th className={`${erp.th} text-center`}>Kết quả</th>
                </tr>
              </thead>
              <tbody>
                {reconcile.map((r) => {
                  const diff = Math.round(r.plan - r.info);
                  return (
                    <tr key={r.label} className={erp.tr}>
                      <td className={erp.td}>
                        {r.label} <span className="text-slate-400">↔ {r.infoLabel}</span>
                      </td>
                      <td className={`${erp.td} ${erp.num}`}>{money(r.plan)}</td>
                      <td className={`${erp.td} ${erp.num}`}>{money(r.info)}</td>
                      <td className={`${erp.td} ${erp.num} ${diff ? 'text-amber-700 font-semibold' : 'text-slate-400'}`}>
                        {diff ? `${diff > 0 ? '+' : ''}${money(diff)}` : '0'}
                      </td>
                      <td className={`${erp.td} text-center`}>
                        {diff ? <Tag cls="bg-amber-50 text-amber-700 border-amber-300">Lệch</Tag> : <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-300">Khớp</Tag>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {years.length > 1 && (
            <div className="flex items-center gap-2 text-[12px] text-slate-600">
              <span>Năm:</span>
              <Segmented
                options={[{ key: 'all', label: `Tất cả (${data.length} tháng)` }, ...years.map((y) => ({ key: y, label: y }))]}
                value={allYears ? 'all' : year}
                onChange={setYear}
              />
            </div>
          )}

          <div className="overflow-x-auto border border-slate-300">
            <table className={`${erp.table} [&_td]:border-slate-200`}>
              <thead>
                <tr>
                  <th className={`${erp.th} sticky left-0 z-20 text-left min-w-[240px] border-t-0 border-l-0`}>Chỉ tiêu</th>
                  <th className={`${erp.th} sticky left-[240px] z-20 text-right min-w-[160px] bg-[#dfe6f0] border-t-0`}>{totalLabel}</th>
                  {rows.map((r) => (
                    <th key={r.month} className={`${erp.th} text-right min-w-[130px] border-t-0 last:border-r-0`}>
                      T{+r.month.slice(5, 7)}/{r.month.slice(0, 4)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FIN_ROWS.map((fr) => (
                  <tr key={fr.label.plan} className={erp.tr}>
                    <td className={`${erp.td} sticky left-0 z-10 bg-white border-l-0 ${fr.sub ? 'pl-7 text-[12px]' : 'font-semibold'} ${fr.labelCls}`}>
                      {fr.sub && <span className="text-slate-300 mr-1.5">└</span>}
                      {fr.label[kind]}
                    </td>
                    <td className={`${erp.td} ${erp.num} sticky left-[240px] z-10 bg-[#f6f8fb] ${fr.sub ? 'text-[12px]' : 'font-bold'}`}>
                      <DrillNum
                        value={rows.reduce((s, r) => s + fr.get(r), 0)}
                        onClick={canDrill(fr) ? (v) => openDrill(fr, rows[0].month, rows[rows.length - 1].month, v) : undefined}
                      />
                    </td>
                    {rows.map((r) => (
                      <td key={r.month} className={`${erp.td} ${erp.num} last:border-r-0 ${fr.sub ? 'text-[12px] text-slate-500' : ''}`}>
                        <DrillNum value={fr.get(r)} onClick={canDrill(fr) ? (v) => openDrill(fr, r.month, r.month, v) : undefined} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showImport && (
          <BizMonthlyImportModal
            key="monthly-import"
            kind={kind}
            project={p}
            onClose={() => setShowImport(false)}
            onApply={(rows, fileName, summary) => {
              onImport(kind, rows, fileName, summary);
              setShowImport(false);
              setYear('all');
            }}
          />
        )}
        {drill && <LedgerDetailModal key="ledger-detail" {...drill} onClose={() => setDrill(null)} />}
      </AnimatePresence>
    </Panel>
  );
};

// ==========================================================================
// Chi tiết
// ==========================================================================
const ProjectDetail: React.FC<{
  project: BizProject;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onImport: (kind: FinKind, rows: BizMonthRow[], fileName: string, summary: string) => void;
}> = ({ project: p, onBack, onEdit, onDelete, onImport }) => {
  const [tab, setTab] = useState<'overview' | 'history'>('overview');
  const gp = grossProfit(p);

  return (
    <>
      <ErpTitleBar
        crumbs={[...CRUMBS, p.masterCode]}
        title={
          <>
            {p.name} {p.isKey && <KeyBadge />}
          </>
        }
        actions={
          <>
            <Btn icon={ArrowLeft} onClick={onBack}>
              Quay lại
            </Btn>
            <Btn variant="primary" icon={Pencil} onClick={onEdit}>
              Sửa
            </Btn>
            <Btn variant="danger" icon={Trash2} onClick={onDelete}>
              Xoá
            </Btn>
          </>
        }
        meta={[
          { label: 'Mã Master', value: <span className={erp.code}>{p.masterCode}</span> },
          { label: 'Version', value: `v${p.version}` },
          { label: 'Trạng thái', value: <StatusBadge status={p.status} /> },
          { label: 'Khối', value: p.division },
          { label: 'Cập nhật', value: dt(p.updatedAt) },
        ]}
      />

      <FolderTabs
        tabs={[
          { key: 'overview', label: 'Thông tin dự án', icon: LayoutList },
          { key: 'history', label: `Lịch sử (${p.history.length})`, icon: History },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'overview' && (
        <>
          <Panel title="Mã dự án" icon={Hash} noPad>
            <table className={erp.table}>
              <thead>
                <tr>
                  {['Loại mã', 'Mã', 'PM phụ trách'].map((h) => (
                    <th key={h} className={`${erp.th} text-left border-t-0 first:border-l-0 last:border-r-0`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {[
                  ['Mã Master (mã tổng)', p.masterCode, '—'],
                  ['Mã kinh doanh (PAKD)', p.businessCode, p.businessPm],
                  ['Mã sản xuất', p.productionCode, p.productionPm],
                ].map(([k, c, pm]) => (
                  <tr key={k} className={erp.tr}>
                    <td className={`${erp.td} bg-[#f3f6fa] text-slate-600 w-[30%] border-l-0`}>{k}</td>
                    <td className={`${erp.td} ${erp.code} font-bold`}>{c}</td>
                    <td className={`${erp.td} border-r-0`}>{pm || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Panel title="Thông tin cơ hội kinh doanh" icon={Building2} noPad>
              <FieldTable
                rows={[
                  { label: 'Khối', value: p.division },
                  { label: 'Loại dự án', value: p.projectType },
                  { label: 'Tên khách hàng', value: p.customerName },
                  { label: 'Mã khách hàng', value: <span className="font-mono">{p.customerCode}</span> },
                  { label: 'Giám đốc kinh doanh', value: p.businessDirector },
                  { label: 'Giám đốc bán hàng', value: p.salesDirector },
                  { label: 'Người tạo', value: p.creator },
                  { label: 'AM', value: p.am.join(', ') },
                  { label: 'Thời gian', value: `${dmy(p.startDate)} → ${dmy(p.endDate)}` },
                  ...(p.note ? [{ label: 'Ghi chú', value: p.note }] : []),
                ]}
              />
            </Panel>
            <Panel title="Tài chính (VNĐ)" icon={Wallet} noPad>
              <FieldTable
                labelWidth="50%"
                rows={[
                  { label: 'Doanh thu dự kiến', value: money(p.expectedRevenue), num: true, strong: true },
                  { label: 'Chi phí kế hoạch', value: money(plannedCost(p)), num: true },
                  { label: '   └ Chi phí kinh doanh kế hoạch', value: money(p.plannedBusinessCost), num: true },
                  { label: '   └ Chi phí sản xuất kế hoạch', value: money(p.plannedProductionCost), num: true },
                  {
                    label: 'Lợi nhuận gộp kế hoạch',
                    value: <span className={gp < 0 ? 'text-rose-600' : 'text-emerald-700'}>{money(gp)}</span>,
                    num: true,
                    strong: true,
                  },
                  { label: 'Biên lợi nhuận gộp', value: `${grossMargin(p).toFixed(1)}%`, num: true },
                  {
                    label: 'Hợp đồng',
                    value: p.contractSigned ? <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-300">Đã ký</Tag> : <Tag cls="bg-slate-100 text-slate-600 border-slate-300">Chưa ký</Tag>,
                  },
                ]}
              />
            </Panel>
          </div>

          <PhaseStepper key={p.id + p.version} phases={p.phases} current={p.currentPhase} />
          <FinanceSection project={p} onImport={onImport} />
        </>
      )}

      {tab === 'history' && (
        <Panel title="Lịch sử thay đổi" icon={History} noPad>
          <table className={erp.table}>
            <thead>
              <tr>
                {['STT', 'Thời gian', 'Người thực hiện', 'Thao tác', 'Ghi chú'].map((h) => (
                  <th key={h} className={`${erp.th} text-left border-t-0 first:border-l-0 last:border-r-0`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...p.history].reverse().map((h, i) => (
                <tr key={i} className={erp.tr}>
                  <td className={`${erp.td} text-center text-slate-500 border-l-0 w-12`}>{i + 1}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>{dt(h.at)}</td>
                  <td className={erp.td}>{h.by}</td>
                  <td className={`${erp.td} font-semibold`}>{h.action}</td>
                  <td className={`${erp.td} text-slate-600 border-r-0`}>{h.note || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </>
  );
};

// ==========================================================================
// Form tạo / sửa
// ==========================================================================
const inputCls = erp.inputFull;
/** Ô nhập trong bảng (kiểu bảng tính): không viền, nền đổi khi focus. */
const cellInput = 'w-full h-8 px-2 bg-transparent text-[13px] outline-none focus:bg-[#eaf2fc] focus:ring-1 focus:ring-inset focus:ring-[#1f5fa8]';

const MoneyInput: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <div className="relative">
    <input
      inputMode="numeric"
      value={value ? value.toLocaleString('en-US') : ''}
      onChange={(e) => onChange(Number(e.target.value.replace(/[^\d]/g, '')) || 0)}
      placeholder="0"
      className={`${inputCls} text-right pr-12 tabular-nums`}
    />
    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-400">VNĐ</span>
  </div>
);

const FormGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-2.5">{children}</div>;

const emptyInput = (): BizProjectInput => ({
  name: '',
  isKey: false,
  status: 'Nháp',
  masterCode: '',
  businessCode: '',
  productionCode: '',
  businessPm: '',
  productionPm: '',
  division: '',
  projectType: '',
  customerName: '',
  customerCode: '',
  businessDirector: '',
  salesDirector: '',
  creator: CURRENT_USER,
  am: [],
  startDate: '',
  endDate: '',
  expectedRevenue: 0,
  plannedBusinessCost: 0,
  plannedProductionCost: 0,
  contractSigned: false,
  note: '',
  phases: blankPhases(),
  currentPhase: 'KH01',
});

const toInput = (p: BizProject): BizProjectInput => {
  const { id, version, plan, planImport, actual, actualImport, createdAt, updatedAt, history, ...rest } = p;
  return rest;
};

const ProjectForm: React.FC<{
  initial?: BizProject;
  projects: BizProject[];
  onCancel: () => void;
  onSubmit: (data: BizProjectInput) => void;
}> = ({ initial, projects, onCancel, onSubmit }) => {
  const [f, setF] = useState<BizProjectInput>(() => (initial ? toInput(initial) : emptyInput()));
  const [amText, setAmText] = useState(() => f.am.join(', '));
  // Khi tạo mới, mã Master tự sinh theo mã KH cho tới khi người dùng tự sửa.
  const [autoCode, setAutoCode] = useState(!initial);
  const [touched, setTouched] = useState(false);

  const set = <K extends keyof BizProjectInput>(k: K, v: BizProjectInput[K]) => setF((prev) => ({ ...prev, [k]: v }));

  const setPhase = (i: number, k: keyof BizPhase, v: string) =>
    setF((prev) => ({ ...prev, phases: prev.phases.map((p, j) => (j === i ? { ...p, [k]: v } : p)) }));

  const setMaster = (master: string) =>
    setF((prev) => ({ ...prev, masterCode: master, businessCode: master ? `${master}.1` : '', productionCode: master ? `${master}.2` : '' }));

  const setCustomerCode = (cc: string) => {
    set('customerCode', cc);
    if (autoCode) setMaster(nextMasterCode(projects.filter((p) => p.id !== initial?.id), cc));
  };

  const errors = useMemo(() => {
    const e: Partial<Record<keyof BizProjectInput, string>> = {};
    if (!f.name.trim()) e.name = 'Nhập tên dự án';
    if (!f.customerCode.trim()) e.customerCode = 'Nhập mã khách hàng';
    if (!f.customerName.trim()) e.customerName = 'Nhập tên khách hàng';
    if (!f.division) e.division = 'Chọn khối';
    if (!f.projectType) e.projectType = 'Chọn loại dự án';
    if (!f.masterCode.trim()) e.masterCode = 'Nhập mã Master';
    else if (projects.some((p) => p.id !== initial?.id && p.masterCode === f.masterCode.trim())) e.masterCode = 'Mã Master đã tồn tại';
    if (!f.startDate) e.startDate = 'Chọn ngày bắt đầu';
    if (!f.endDate) e.endDate = 'Chọn ngày kết thúc';
    else if (f.startDate && f.endDate < f.startDate) e.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
    if (!f.expectedRevenue) e.expectedRevenue = 'Nhập doanh thu dự kiến';
    const badPhase = f.phases.find((p) => p.start && p.end && p.end < p.start);
    if (badPhase) e.phases = `${badPhase.code}: ngày kết thúc phải sau ngày bắt đầu`;
    return e;
  }, [f, projects, initial]);

  const errCount = Object.keys(errors).length;
  const err = (k: keyof BizProjectInput) => (touched ? errors[k] : undefined);

  const submit = () => {
    setTouched(true);
    if (errCount) return;
    onSubmit({
      ...f,
      name: f.name.trim(),
      masterCode: f.masterCode.trim(),
      am: amText.split(',').map((s) => s.trim()).filter(Boolean),
    });
  };

  const cost = plannedCost(f);
  const gp = grossProfit(f);

  return (
    <>
      <ErpTitleBar
        crumbs={[...CRUMBS, initial ? `Sửa ${initial.masterCode}` : 'Tạo dự án']}
        title={initial ? `Sửa dự án — ${initial.name}` : 'Khai báo thông tin dự án'}
        actions={
          <>
            <Btn icon={X} onClick={onCancel}>
              Huỷ
            </Btn>
            <Btn variant="success" icon={Save} onClick={submit}>
              {initial ? 'Lưu thay đổi' : 'Tạo dự án'}
            </Btn>
          </>
        }
        meta={initial ? [{ label: 'Version hiện tại', value: `v${initial.version}` }, { label: 'Lưu sẽ tạo', value: `v${initial.version + 1}` }] : undefined}
      />

      {touched && errCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-rose-50 border border-rose-300 text-[12px] font-semibold text-rose-700">
          <AlertCircle size={14} /> Còn {errCount} trường chưa hợp lệ — kiểm tra các ô đánh dấu đỏ.
        </div>
      )}

      <Panel title="Thông tin chung" icon={LayoutList}>
        <FormGrid>
          <FormRow label="Tên dự án" required error={err('name')}>
            <input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="VD: 022.NSG" className={inputCls} />
          </FormRow>
          <FormRow label="Trạng thái">
            <select value={f.status} onChange={(e) => set('status', e.target.value as BizStatus)} className={inputCls}>
              {BIZ_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Dự án KEY">
            <span className="flex items-center gap-2 h-8 text-[13px]">
              <input type="checkbox" checked={f.isKey} onChange={(e) => set('isKey', e.target.checked)} className="w-4 h-4 accent-amber-500" />
              <Star size={13} className="fill-amber-400 text-amber-500" /> Đánh dấu là dự án trọng điểm
            </span>
          </FormRow>
        </FormGrid>
      </Panel>

      <Panel title="Thông tin cơ hội kinh doanh" icon={Building2}>
        <FormGrid>
          <FormRow label="Khối" required error={err('division')}>
            <select value={f.division} onChange={(e) => set('division', e.target.value)} className={inputCls}>
              <option value="">— Chọn khối —</option>
              {DIVISIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Loại dự án" required error={err('projectType')}>
            <select value={f.projectType} onChange={(e) => set('projectType', e.target.value)} className={inputCls}>
              <option value="">— Chọn loại dự án —</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </FormRow>
          <FormRow label="Mã khách hàng" required error={err('customerCode')}>
            <input value={f.customerCode} onChange={(e) => setCustomerCode(e.target.value)} placeholder="VD: 022" className={`${inputCls} font-mono`} />
          </FormRow>
          <FormRow label="Tên khách hàng" required error={err('customerName')}>
            <input value={f.customerName} onChange={(e) => set('customerName', e.target.value)} className={inputCls} />
          </FormRow>
          <FormRow label="Giám đốc kinh doanh">
            <input value={f.businessDirector} onChange={(e) => set('businessDirector', e.target.value)} className={inputCls} />
          </FormRow>
          <FormRow label="Giám đốc bán hàng">
            <input value={f.salesDirector} onChange={(e) => set('salesDirector', e.target.value)} className={inputCls} />
          </FormRow>
          <FormRow label="AM" hint="Nhiều người cách nhau bằng dấu phẩy">
            <input value={amText} onChange={(e) => setAmText(e.target.value)} placeholder="Nguyễn Văn A, Trần Thị B" className={inputCls} />
          </FormRow>
          <FormRow label="Người tạo">
            <input value={f.creator} disabled className={inputCls} />
          </FormRow>
          <FormRow label="Ngày bắt đầu" required error={err('startDate')}>
            <input type="date" value={f.startDate} onChange={(e) => set('startDate', e.target.value)} className={inputCls} />
          </FormRow>
          <FormRow label="Ngày kết thúc" required error={err('endDate')}>
            <input type="date" value={f.endDate} min={f.startDate} onChange={(e) => set('endDate', e.target.value)} className={inputCls} />
          </FormRow>
        </FormGrid>
      </Panel>

      <Panel title="Mã dự án" icon={Hash}>
        <FormGrid>
          <FormRow label="Mã Master" required error={err('masterCode')} hint={autoCode ? 'Tự sinh theo mã khách hàng — có thể sửa' : 'Mã KD = Master.1, Mã SX = Master.2'}>
            <input
              value={f.masterCode}
              onChange={(e) => {
                setAutoCode(false);
                setMaster(e.target.value);
              }}
              placeholder="VD: 022.688"
              className={`${inputCls} font-mono font-bold text-[#1f5fa8]`}
            />
          </FormRow>
          <div className="hidden xl:block" />
          <FormRow label="Mã kinh doanh">
            <input value={f.businessCode} disabled className={`${inputCls} font-mono`} />
          </FormRow>
          <FormRow label="PM kinh doanh">
            <input value={f.businessPm} onChange={(e) => set('businessPm', e.target.value)} className={inputCls} />
          </FormRow>
          <FormRow label="Mã sản xuất">
            <input value={f.productionCode} disabled className={`${inputCls} font-mono`} />
          </FormRow>
          <FormRow label="PM sản xuất">
            <input value={f.productionPm} onChange={(e) => set('productionPm', e.target.value)} className={inputCls} />
          </FormRow>
        </FormGrid>
      </Panel>

      <Panel
        title="Các giai đoạn (KH01 → KH05)"
        icon={Flag}
        noPad
        footer={err('phases') ? <span className="text-rose-600 font-semibold">{err('phases')}</span> : 'Chọn "Hiện tại" để đánh dấu giai đoạn đang thực hiện; các giai đoạn trước đó được coi là đã hoàn thành.'}
      >
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1000px]`}>
            <thead>
              <tr>
                {['Hiện tại', 'Mã', 'Tên giai đoạn', 'Bắt đầu', 'Kết thúc', 'Phụ trách', 'Mục tiêu', 'Đầu ra'].map((h) => (
                  <th key={h} className={`${erp.th} text-left border-t-0 first:border-l-0 last:border-r-0`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {f.phases.map((p, i) => (
                <tr key={p.code} className={f.currentPhase === p.code ? 'bg-[#eaf2fc]' : ''}>
                  <td className={`${erp.td} text-center w-16 border-l-0`}>
                    <input type="radio" name="currentPhase" checked={f.currentPhase === p.code} onChange={() => set('currentPhase', p.code)} className="w-4 h-4 accent-[#1f5fa8] cursor-pointer" />
                  </td>
                  <td className={`${erp.td} ${erp.code} font-bold w-16`}>{p.code}</td>
                  <td className="border border-slate-200 p-0 w-52">
                    <input value={p.name} onChange={(e) => setPhase(i, 'name', e.target.value)} className={cellInput} />
                  </td>
                  <td className="border border-slate-200 p-0 w-36">
                    <input type="date" value={p.start} onChange={(e) => setPhase(i, 'start', e.target.value)} className={cellInput} />
                  </td>
                  <td className="border border-slate-200 p-0 w-36">
                    <input type="date" value={p.end} min={p.start} onChange={(e) => setPhase(i, 'end', e.target.value)} className={cellInput} />
                  </td>
                  <td className="border border-slate-200 p-0 w-44">
                    <input value={p.pic} onChange={(e) => setPhase(i, 'pic', e.target.value)} className={cellInput} />
                  </td>
                  <td className="border border-slate-200 p-0">
                    <input value={p.objective} onChange={(e) => setPhase(i, 'objective', e.target.value)} className={cellInput} />
                  </td>
                  <td className="border border-slate-200 border-r-0 p-0">
                    <input value={p.output} onChange={(e) => setPhase(i, 'output', e.target.value)} className={cellInput} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Tài chính tổng dự án (VNĐ)" icon={Wallet}>
        <FormGrid>
          <FormRow label="Doanh thu dự kiến" required error={err('expectedRevenue')}>
            <MoneyInput value={f.expectedRevenue} onChange={(v) => set('expectedRevenue', v)} />
          </FormRow>
          <FormRow label="Hợp đồng">
            <span className="flex items-center gap-2 h-8 text-[13px]">
              <input type="checkbox" checked={f.contractSigned} onChange={(e) => set('contractSigned', e.target.checked)} className="w-4 h-4 accent-emerald-600" /> Đã ký hợp đồng
            </span>
          </FormRow>
          <FormRow label="Chi phí kinh doanh KH">
            <MoneyInput value={f.plannedBusinessCost} onChange={(v) => set('plannedBusinessCost', v)} />
          </FormRow>
          <FormRow label="Chi phí sản xuất KH">
            <MoneyInput value={f.plannedProductionCost} onChange={(v) => set('plannedProductionCost', v)} />
          </FormRow>
          <FormRow label="Ghi chú" className="xl:col-span-2">
            <textarea value={f.note || ''} onChange={(e) => set('note', e.target.value)} rows={2} className={`${inputCls} h-auto py-1.5`} />
          </FormRow>
        </FormGrid>
        <div className="mt-3 max-w-xl">
          <FieldTable
            labelWidth="55%"
            rows={[
              { label: 'Chi phí kế hoạch (tự tính)', value: money(cost), num: true },
              { label: 'Lợi nhuận gộp kế hoạch (tự tính)', value: <span className={gp < 0 ? 'text-rose-600' : 'text-emerald-700'}>{money(gp)}</span>, num: true, strong: true },
              { label: 'Biên lợi nhuận gộp', value: `${grossMargin(f).toFixed(1)}%`, num: true },
            ]}
          />
        </div>
      </Panel>
    </>
  );
};
