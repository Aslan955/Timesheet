/**
 * RevenuePlanPage — "Khai báo Kế hoạch Thu - Chi của Khối" (A. KẾ HOẠCH).
 *
 * Giám đốc khối lên kế hoạch thu - chi cho TỪNG DỰ ÁN mình phụ trách (1 năm).
 * Mỗi dự án là một khối khai báo gồm:
 *   • Thu dự kiến từng tháng   (12 tháng, cột CẢ NĂM = SUM)
 *   • Chi dự kiến từng tháng   (12 tháng)
 *   • Chênh lệch thu - chi     (tự tính)
 * Cuối bảng có tổng hợp toàn khối. "Thêm dự án" để khai báo dự án tiếp theo.
 *
 * "Thu dự kiến" theo dự án được màn "Cập nhật tài chính dự án" đọc lại
 * (dòng "Doanh thu kế hoạch (PAKD)").
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  History,
  Save,
  Grid,
  ChevronRight,
  X,
  Inbox,
  Building2,
  FolderPlus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  useFinancePlans,
  ProjectPlan,
  BlockPlan,
  MONTHS12,
  zero12,
  sum12,
} from '../finance/FinancePlanContext';

const YEARS = [2025, 2026, 2027];
const CURRENT_USER = 'Trần B';
const fmt = (n: number) => (n ? Math.round(n).toLocaleString('vi-VN') : '–');

const deepProjects = (p: ProjectPlan[]): ProjectPlan[] =>
  p.map((x) => ({
    ...x,
    plannedRevenue: [...(x.plannedRevenue || zero12())],
    revenue: [...x.revenue],
    expense: [...x.expense],
    workloadMonthly: [...(x.workloadMonthly || zero12())],
  }));

const emptyProject = (): ProjectPlan => ({
  projectCode: '',
  projectName: '',
  workload: 0,
  plannedRevenue: zero12(),
  revenue: zero12(),
  expense: zero12(),
  workloadMonthly: zero12(),
});

export const RevenuePlanPage: React.FC = () => {
  const { blocks, editRequests, getBlock, saveBlock } = useFinancePlans();
  const khoiList = useMemo(() => Array.from(new Set(blocks.map((b) => b.khoi))), [blocks]);

  const [khoi, setKhoi] = useState('G1');
  const [year, setYear] = useState(2026);

  // Bản nháp cục bộ đang chỉnh (tách khỏi store cho tới khi Lưu)
  const [projects, setProjects] = useState<ProjectPlan[]>([]);
  const [note, setNote] = useState('');

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2800);
  };
  const [historyOpen, setHistoryOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);

  // Nạp dữ liệu khối/năm vào bản nháp khi đổi lựa chọn
  useEffect(() => {
    const b = getBlock(khoi, year);
    setProjects(b ? deepProjects(b.projects) : []);
    setNote('');
  }, [khoi, year, getBlock]);

  const block: BlockPlan | undefined = getBlock(khoi, year);
  const myRequests = editRequests.filter((r) => r.khoi === khoi && r.status === 'Chờ duyệt');

  // ---- Tổng hợp toàn khối ----
  const planRevTotalByMonth = MONTHS12.map((_, i) => projects.reduce((s, p) => s + (p.plannedRevenue?.[i] || 0), 0));
  const revTotalByMonth = MONTHS12.map((_, i) => projects.reduce((s, p) => s + (p.revenue[i] || 0), 0));
  const expTotalByMonth = MONTHS12.map((_, i) => projects.reduce((s, p) => s + (p.expense[i] || 0), 0));
  const netTotalByMonth = MONTHS12.map((_, i) => revTotalByMonth[i] - expTotalByMonth[i]);

  // ---- Cập nhật ô ----
  type CellKind = 'plannedRevenue' | 'revenue' | 'expense' | 'workloadMonthly';
  const setCell = (pi: number, kind: CellKind, mi: number, v: number) =>
    setProjects((prev) =>
      prev.map((p, i) => (i === pi ? { ...p, [kind]: (p[kind] || zero12()).map((x, j) => (j === mi ? v : x)) } : p)),
    );
  const setField = (pi: number, field: 'projectCode' | 'projectName' | 'workload', v: string | number) =>
    setProjects((prev) => prev.map((p, i) => (i === pi ? { ...p, [field]: v } : p)));

  const addProject = () => setProjects((prev) => [...prev, emptyProject()]);
  const removeProject = (pi: number) => setProjects((prev) => prev.filter((_, i) => i !== pi));

  const handleSave = () => {
    const cleaned = projects.filter(
      (p) => p.projectCode.trim() || p.projectName.trim() || sum12(p.revenue) > 0 || sum12(p.expense) > 0,
    );
    if (cleaned.some((p) => !p.projectCode.trim())) {
      showToast('⚠️ Có dự án chưa nhập Mã dự án.');
      return;
    }
    saveBlock(khoi, year, { projects: cleaned }, `${CURRENT_USER} (GĐ Khối ${khoi})`, note.trim() || undefined);
    showToast('💾 Đã lưu kế hoạch. Thu dự kiến theo dự án sẽ đồng bộ sang màn Cập nhật tài chính.');
    setNote('');
  };

  const colCount = 4 + 12; // Nội dung + Mã dự án + CẢ NĂM + KLCV + 12 tháng

  return (
    <div className="p-4 sm:p-6 bg-slate-50/50 min-h-screen space-y-4 font-sans">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            className="fixed top-6 right-6 z-[120] bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/60 flex items-center gap-3 text-xs font-bold max-w-md"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#0fa57c] animate-ping shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className="pb-2 border-b border-slate-200/80">
        <div className="flex items-center text-xs text-slate-500 gap-1.5 font-medium">
          <Grid size={13} className="text-slate-400" />
          <span>Quản lý dự án</span>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-900 font-bold">Kế hoạch thu - chi của khối</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mt-1">Khai Báo Kế Hoạch Thu - Chi Của Khối</h1>
      </div>

      {/* Khối thông tin + hành động */}
      <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-[auto_220px_auto_120px_1fr_auto] items-center gap-3">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Building2 size={13} /> Tên khối</span>
          <select
            value={khoi}
            onChange={(e) => setKhoi(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
          >
            {khoiList.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <span className="text-xs font-bold text-slate-500">Năm</span>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <div className="text-[11px] text-slate-500 font-semibold">
            Người lập: <strong className="text-slate-700">{CURRENT_USER}</strong> · ĐVT: <strong className="text-slate-700">triệu VNĐ</strong>
            {block && <span className="ml-2 text-slate-400">· Cập nhật: {block.updatedAt}</span>}
          </div>
          <div className="justify-self-end flex items-center gap-2">
            <button onClick={() => setRequestsOpen(true)} className="text-xs font-bold text-blue-600 hover:underline cursor-pointer whitespace-nowrap">
              Yêu cầu sửa của tôi ({myRequests.length}) →
            </button>
            <button onClick={() => setHistoryOpen(true)} className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <History size={13} /> Lịch sử
            </button>
            <button onClick={handleSave} className="px-3.5 py-1.5 bg-[#0fa57c] hover:bg-[#0c8e6b] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95">
              <Save size={14} /> Lưu khai báo
            </button>
          </div>
        </div>
      </div>

      {/* Bảng A. KẾ HOẠCH */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
          <span className="text-xs font-black text-amber-700 uppercase tracking-wider">A. Kế hoạch thu - chi theo dự án</span>
          <button onClick={addProject} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-[11px] font-bold flex items-center gap-1 cursor-pointer">
            <FolderPlus size={12} /> Thêm dự án
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1280px]">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                <th className="px-3 py-3 sticky left-0 bg-slate-100/80 z-10 min-w-[210px]">Nội dung</th>
                <th className="px-3 py-3 min-w-[130px]">Mã dự án</th>
                <th className="px-3 py-3 text-right min-w-[96px] bg-slate-200/60 text-slate-700">CẢ NĂM</th>
                <th className="px-3 py-3 text-right min-w-[96px] bg-indigo-100/70 text-indigo-700" title="Khối lượng công việc">KLCV</th>
                {MONTHS12.map((m) => (
                  <th key={m} className="px-2 py-3 text-right min-w-[70px]">Tháng {m}</th>
                ))}
                <th className="px-2 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {projects.map((p, pi) => {
                return (
                  <React.Fragment key={pi}>
                    {/* --- Header dự án: tên + mã + KLCV --- */}
                    <tr className="bg-amber-50/70 border-y border-amber-200/70">
                      <td className="px-3 py-2 sticky left-0 bg-amber-50/95 z-10">
                        <div className="flex items-center gap-2">
                          <span className="shrink-0 w-6 h-6 rounded-lg bg-amber-500 text-white text-[11px] font-black flex items-center justify-center">{pi + 1}</span>
                          <input
                            value={p.projectName}
                            onChange={(e) => setField(pi, 'projectName', e.target.value)}
                            placeholder="Tên dự án"
                            className="w-full text-xs font-bold px-2 py-1 rounded-md bg-white border border-amber-200 outline-none focus:border-amber-500"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={p.projectCode}
                          onChange={(e) => setField(pi, 'projectCode', e.target.value)}
                          placeholder="Mã dự án"
                          className="w-full text-xs font-mono px-2 py-1 rounded-md bg-white border border-amber-200 outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-black bg-slate-200/50 text-slate-500 text-[11px]">DỰ ÁN {pi + 1}</td>
                      <td className="px-3 py-2 text-right font-mono font-black bg-indigo-50/50 text-indigo-700">{fmt(sum12(p.workloadMonthly || []))}%</td>
                      <td colSpan={12} className="px-3 py-2 text-[11px] text-slate-400 font-semibold">
                        Khai báo thu &amp; chi dự kiến 12 tháng bên dưới
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button onClick={() => removeProject(pi)} className="p-1 text-slate-300 hover:text-rose-600 cursor-pointer" title="Xoá dự án">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>

                    {/* --- Doanh thu dự kiến (nghiệm thu) --- */}
                    <tr className="hover:bg-emerald-50/20">
                      <td className="px-3 py-1.5 sticky left-0 bg-white z-10 pl-11 text-emerald-700 font-bold">Doanh thu dự kiến</td>
                      <td className="px-3 py-1.5 text-slate-300">—</td>
                      <td className="px-3 py-1.5 text-right font-mono font-black bg-emerald-50/70 text-emerald-700">{fmt(sum12(p.plannedRevenue || []))}</td>
                      <td className="px-3 py-1.5 text-center text-slate-300 bg-indigo-50/40">—</td>
                      {(p.plannedRevenue || zero12()).map((v, mi) => (
                        <td key={mi} className="px-1.5 py-1.5">
                          <NumCell value={v} onChange={(nv) => setCell(pi, 'plannedRevenue', mi, nv)} tone="in" />
                        </td>
                      ))}
                      <td />
                    </tr>

                    {/* --- Thu dự kiến từng tháng (dòng tiền thu) --- */}
                    <tr className="hover:bg-emerald-50/30">
                      <td className="px-3 py-1.5 sticky left-0 bg-white z-10 pl-11 text-emerald-700 font-bold">Thu dự kiến</td>
                      <td className="px-3 py-1.5 text-slate-300">—</td>
                      <td className="px-3 py-1.5 text-right font-mono font-black bg-emerald-50/70 text-emerald-700">{fmt(sum12(p.revenue))}</td>
                      <td className="px-3 py-1.5 text-center text-slate-300 bg-indigo-50/40">—</td>
                      {p.revenue.map((v, mi) => (
                        <td key={mi} className="px-1.5 py-1.5">
                          <NumCell value={v} onChange={(nv) => setCell(pi, 'revenue', mi, nv)} tone="in" />
                        </td>
                      ))}
                      <td />
                    </tr>

                    {/* --- Chi dự kiến từng tháng --- */}
                    <tr className="hover:bg-rose-50/30">
                      <td className="px-3 py-1.5 sticky left-0 bg-white z-10 pl-11 text-rose-700 font-bold">Chi dự kiến</td>
                      <td className="px-3 py-1.5 text-slate-300">—</td>
                      <td className="px-3 py-1.5 text-right font-mono font-black bg-rose-50/70 text-rose-700">{fmt(sum12(p.expense))}</td>
                      <td className="px-3 py-1.5 text-center text-slate-300 bg-indigo-50/40">—</td>
                      {p.expense.map((v, mi) => (
                        <td key={mi} className="px-1.5 py-1.5">
                          <NumCell value={v} onChange={(nv) => setCell(pi, 'expense', mi, nv)} tone="out" />
                        </td>
                      ))}
                      <td />
                    </tr>

                    {/* --- Khối lượng công việc theo tháng --- */}
                    <tr className="hover:bg-indigo-50/20 border-b-2 border-slate-200">
                      <td className="px-3 py-1.5 sticky left-0 bg-white z-10 pl-11 text-indigo-700 font-bold">Khối lượng công việc (%)</td>
                      <td className="px-3 py-1.5 text-slate-300">—</td>
                      <td className="px-3 py-1.5 text-right font-mono font-black bg-indigo-50/60 text-indigo-700">{fmt(sum12(p.workloadMonthly || []))}%</td>
                      <td className="px-3 py-1.5 text-center text-slate-300 bg-indigo-50/40">—</td>
                      {(p.workloadMonthly || zero12()).map((v, mi) => (
                        <td key={mi} className="px-1.5 py-1.5">
                          <NumCell value={v} onChange={(nv) => setCell(pi, 'workloadMonthly', mi, nv)} unit="%" />
                        </td>
                      ))}
                      <td />
                    </tr>
                  </React.Fragment>
                );
              })}

              {projects.length === 0 && (
                <tr>
                  <td colSpan={colCount + 1} className="px-3 py-6 text-center text-slate-400 text-[11px]">
                    Chưa có dự án. Bấm “Thêm dự án” để khai báo kế hoạch thu - chi.
                  </td>
                </tr>
              )}

              {/* ===== Tổng hợp toàn khối ===== */}
              {projects.length > 0 && (
                <>
                  <TotalRow label="Tổng doanh thu dự kiến" months={planRevTotalByMonth} tone="rev" />
                  <TotalRow label="Tổng thu dự kiến" months={revTotalByMonth} tone="rev" />
                  <TotalRow label="Tổng chi dự kiến" months={expTotalByMonth} tone="cost" />
                  <tr className="bg-slate-100 border-t-2 border-slate-300 font-black text-indigo-700">
                    <td className="px-3 py-2.5 sticky left-0 bg-slate-100 z-10 text-slate-700">Chênh lệch thu - chi (toàn khối)</td>
                    <td className="px-3 py-2.5" />
                    <td className="px-3 py-2.5 text-right font-mono bg-indigo-50/60">{fmt(sum12(netTotalByMonth))}</td>
                    <td className="px-3 py-2.5" />
                    {netTotalByMonth.map((v, i) => (
                      <td key={i} className={`px-2 py-2.5 text-right font-mono ${v < 0 ? 'text-rose-600' : ''}`}>{fmt(v)}</td>
                    ))}
                    <td />
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Thêm dự án + Ghi chú thay đổi */}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60 space-y-3">
          <button onClick={addProject} className="w-full py-2 rounded-xl border border-dashed border-slate-300 text-slate-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/40 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
            <Plus size={14} /> Thêm dự án phụ trách
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">Ghi chú thay đổi</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Cập nhật kế hoạch quý 2 (lưu vào lịch sử)…"
              className="flex-1 text-xs px-3 py-1.5 rounded-xl bg-white border border-slate-200 outline-none focus:border-blue-500"
            />
            <button onClick={handleSave} className="px-3.5 py-1.5 bg-[#0fa57c] hover:bg-[#0c8e6b] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95">
              <Save size={14} /> Lưu khai báo
            </button>
          </div>
        </div>
      </div>

      {/* ===== MODAL: Lịch sử ===== */}
      <AnimatePresence>
        {historyOpen && (
          <ModalShell onClose={() => setHistoryOpen(false)} title={`Lịch sử khai báo — Khối ${khoi} ${year}`} subtitle="Các lần tạo/cập nhật kế hoạch thu - chi">
            {!block || block.history.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">Chưa có lịch sử.</div>
            ) : (
              <div className="space-y-2">
                {block.history.map((h, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/60">
                    <span className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-black ${h.action === 'Tạo mới' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{h.action}</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-700">{h.by}</p>
                      {h.note && <p className="text-[11px] text-slate-500 mt-0.5">{h.note}</p>}
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{h.at}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ModalShell>
        )}
      </AnimatePresence>

      {/* ===== MODAL: Yêu cầu sửa ===== */}
      <AnimatePresence>
        {requestsOpen && (
          <ModalShell onClose={() => setRequestsOpen(false)} title="Yêu cầu sửa của tôi" subtitle="Các yêu cầu điều chỉnh kế hoạch đang chờ duyệt">
            {myRequests.length === 0 ? (
              <div className="py-8 text-center text-slate-400 flex flex-col items-center gap-2">
                <Inbox size={28} /> <span className="text-xs">Không có yêu cầu nào đang chờ.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {myRequests.map((r) => (
                  <div key={r.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-blue-600 text-xs">{r.projectCode}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-700 border border-amber-200">{r.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">{r.reason}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{r.requestedBy} · {r.at}</p>
                  </div>
                ))}
              </div>
            )}
          </ModalShell>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================================================
// Ô nhập số
// ==========================================================================
const NumCell: React.FC<{ value: number; onChange: (v: number) => void; tone?: 'in' | 'out'; unit?: string }> = ({ value, onChange, tone, unit }) => (
  <div className="relative">
    <input
      inputMode="numeric"
      value={value ? value.toLocaleString('vi-VN') : ''}
      onChange={(e) => {
        const n = Number(e.target.value.replace(/[^\d]/g, ''));
        onChange(isNaN(n) ? 0 : n);
      }}
      placeholder="–"
      className={`w-full text-right font-mono text-xs px-1.5 py-1 rounded-md bg-white border border-slate-200 outline-none focus:border-blue-500 text-slate-800 ${
        unit ? 'pr-4' : ''
      } ${tone === 'in' ? 'focus:bg-emerald-50/50' : tone === 'out' ? 'focus:bg-rose-50/50' : 'focus:bg-blue-50/40'}`}
    />
    {unit && <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none">{unit}</span>}
  </div>
);

// Hàng tổng hợp toàn khối (Tổng thu / Tổng chi)
const TotalRow: React.FC<{ label: string; months: number[]; tone: 'rev' | 'cost'; workload?: number }> = ({ label, months, workload, tone }) => (
  <tr className={`border-y border-slate-200 font-black ${tone === 'rev' ? 'bg-emerald-50/60 text-emerald-800' : 'bg-rose-50/60 text-rose-800'}`}>
    <td className={`px-3 py-2 sticky left-0 z-10 ${tone === 'rev' ? 'bg-emerald-50/95' : 'bg-rose-50/95'}`}>{label}</td>
    <td className="px-3 py-2" />
    <td className="px-3 py-2 text-right font-mono bg-white/50">{fmt(sum12(months))}</td>
    <td className="px-3 py-2 text-right font-mono bg-indigo-50/40 text-indigo-700">{workload != null ? fmt(workload) : '—'}</td>
    {months.map((v, i) => (
      <td key={i} className="px-2 py-2 text-right font-mono">{fmt(v)}</td>
    ))}
    <td />
  </tr>
);

// ==========================================================================
// Modal
// ==========================================================================
const ModalShell: React.FC<{ title: string; subtitle?: string; onClose: () => void; children: React.ReactNode }> = ({ title, subtitle, onClose, children }) => (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 20 }}
      className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
    >
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-800">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>}
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer">
          <X size={18} />
        </button>
      </div>
      <div className="p-5 overflow-y-auto">{children}</div>
    </motion.div>
  </div>
);
