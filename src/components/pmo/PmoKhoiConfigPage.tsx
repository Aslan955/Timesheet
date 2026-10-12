/**
 * PmoKhoiConfigPage — PMO-18 Cấu hình khối (F1.3 ngưỡng KPI & rule health, F2.1 template checklist phase,
 * F3.4 tỉ lệ WP nền, F7.1 tỉ lệ ECV nội bộ, F9.2 ngưỡng CR hấp thụ).
 *
 * Bố cục: chọn khối (Segmented 7 khối) trên thanh tiêu đề, nút Lưu / Huỷ thay đổi.
 *   a) Ngưỡng 9 KPI: vàng/đỏ sửa inline, so với mặc định PRD (Phụ lục A); "Khôi phục mặc định"; rule health dạng chữ.
 *   b) Tham số khối: ECV nội bộ (70%, tối đa 85% có lý do — OQ-016), WP nền min/max (OQ-019), ngưỡng CR hấp thụ (OQ-017),
 *      độ dài sprint, SLA gate — sửa inline có validate.
 *   c) Template checklist phase P1..P6: sửa / thêm / xoá (xác nhận inline).
 *   d) Rule cảnh báo (Phụ lục B) bật/tắt theo khối — rule mức Đỏ luôn bật (khoá).
 * Bản nháp giữ riêng từng khối; lưu vào STORE cấp module → "Đã lưu · ghi audit".
 */
import React, { useMemo, useState } from 'react';
import { Bell, Check, Gauge, ListChecks, Lock, Plus, RotateCcw, Save, SlidersHorizontal, Trash2, Undo2 } from 'lucide-react';
import { KHOI, KPI_DEFS, Khoi, PHASES, TODAY, dmy, fmtThreshold } from '../../pmo/pmo';
import { ALERT_RULES, KHOI_CONFIG, PHASE_CHECKLIST } from '../../pmo/pmoData';
import { Btn, ErpPage, ErpTitleBar, Panel, Segmented, Tag, erp } from '../erp/Erp';

interface CkItem {
  id: string;
  code: string;
  name: string;
  required: boolean;
}
interface Draft {
  thresholds: Record<string, { yellow: string; red: string }>;
  ecvInternalPct: string;
  ecvReason: string;
  foundationMinPct: string;
  foundationMaxPct: string;
  crAbsorbSpPct: string;
  crMaxPerRelease: string;
  sprintWeeks: string;
  gateSlaDays: string;
  checklist: Record<number, CkItem[]>;
  rules: Record<string, boolean>;
}

let seq = 0;
const uid = () => `ck${++seq}`;
const defaultThresholds = () => Object.fromEntries(KPI_DEFS.map((d) => [d.code, { yellow: String(d.yellow), red: String(d.red) }]));
const defaultChecklist = () => Object.fromEntries(Object.entries(PHASE_CHECKLIST).map(([ph, items]) => [Number(ph), items.map((it) => ({ ...it, id: uid() }))])) as Record<number, CkItem[]>;
const defaultDraft = (k: Khoi): Draft => {
  const c = KHOI_CONFIG.find((x) => x.khoi === k)!;
  return {
    thresholds: Object.fromEntries(Object.entries(c.thresholds).map(([code, t]) => [code, { yellow: String(t.yellow), red: String(t.red) }])),
    ecvInternalPct: String(c.ecvInternalPct),
    ecvReason: '',
    foundationMinPct: String(c.foundationMinPct),
    foundationMaxPct: String(c.foundationMaxPct),
    crAbsorbSpPct: String(c.crAbsorbSpPct),
    crMaxPerRelease: '2',
    sprintWeeks: String(c.sprintWeeks),
    gateSlaDays: String(c.gateSlaDays),
    checklist: defaultChecklist(),
    rules: Object.fromEntries(ALERT_RULES.map((r) => [r.code, true])),
  };
};

// ==========================================================================
// Lưu trong phiên: bản đã lưu theo khối + nhật ký lưu
// ==========================================================================
const STORE = new Map<Khoi, Draft>();
const DEFAULTS = new Map<Khoi, Draft>();
const SAVED_AT = new Map<Khoi, string>();
const savedOf = (k: Khoi) => {
  const hit = STORE.get(k) || DEFAULTS.get(k);
  if (hit) return hit;
  const d = defaultDraft(k);
  DEFAULTS.set(k, d);
  return d;
};
const clone = (d: Draft): Draft => JSON.parse(JSON.stringify(d));

const isNum = (s: string) => s.trim() !== '' && !isNaN(Number(s));
const inRange = (s: string, lo: number, hi: number) => isNum(s) && Number(s) >= lo && Number(s) <= hi;
const nowHm = () => new Date().toTimeString().slice(0, 5);
const CELL = `${erp.input} h-7 text-[12px]`;

/** Dòng tham số: nhãn | ô nhập (+ lỗi) | quy tắc. Khai báo ngoài component để ô nhập không mất focus. */
const ParamRow: React.FC<{ label: string; hint: string; err?: string; children: React.ReactNode }> = ({ label, hint, err, children }) => (
  <tr className={erp.tr}>
    <td className={`${erp.td} border-l-0 text-slate-700 font-medium w-[38%]`}>{label}</td>
    <td className={`${erp.td} w-[30%]`}>
      {children}
      {err && <span className="block text-[11px] text-rose-600 mt-0.5">{err}</span>}
    </td>
    <td className={`${erp.td} border-r-0 text-[11.5px] text-slate-500`}>{hint}</td>
  </tr>
);

export const PmoKhoiConfigPage: React.FC<{ onNavigate?: (item: string) => void }> = () => {
  const [khoi, setKhoi] = useState<Khoi>('G3');
  const [drafts, setDrafts] = useState<Record<Khoi, Draft>>(() => Object.fromEntries(KHOI.map((k) => [k, clone(savedOf(k))])) as Record<Khoi, Draft>);
  const [savedTick, setSavedTick] = useState(0);
  const [phase, setPhase] = useState<string>('2');
  const [confirmCk, setConfirmCk] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const flash = (s: string) => {
    setMsg(s);
    window.setTimeout(() => setMsg(''), 4000);
  };

  const d = drafts[khoi];
  const set = (fn: (x: Draft) => Draft) => setDrafts((cur) => ({ ...cur, [khoi]: fn(clone(cur[khoi])) }));
  const dirtyOf = useMemo(() => Object.fromEntries(KHOI.map((k) => [k, JSON.stringify(drafts[k]) !== JSON.stringify(savedOf(k))])) as Record<Khoi, boolean>, [drafts, savedTick]);

  // ---------------- Validate ----------------
  const kpiErr = (code: string) => {
    const def = KPI_DEFS.find((x) => x.code === code)!;
    const t = d.thresholds[code];
    if (!isNum(t.yellow) || !isNum(t.red)) return 'Nhập số';
    const y = Number(t.yellow);
    const r = Number(t.red);
    if (def.higherBetter && !(r < y)) return 'Đỏ phải nhỏ hơn vàng';
    if (!def.higherBetter && !(r > y)) return 'Đỏ phải lớn hơn vàng';
    return '';
  };
  const ecv = Number(d.ecvInternalPct);
  const pErr = {
    ecv: !inRange(d.ecvInternalPct, 50, 85) ? 'Từ 50% đến tối đa 85% (OQ-016)' : ecv > 70 && !d.ecvReason.trim() ? 'Trên 70% phải ghi lý do' : '',
    fmin: !inRange(d.foundationMinPct, 15, 30) ? 'Trong khoảng 15–30%' : '',
    fmax: !inRange(d.foundationMaxPct, 15, 30) ? 'Trong khoảng 15–30%' : isNum(d.foundationMinPct) && Number(d.foundationMaxPct) < Number(d.foundationMinPct) ? 'Tối đa ≥ tối thiểu' : '',
    cr: !inRange(d.crAbsorbSpPct, 1, 10) ? 'Từ 1% đến 10% SP release' : '',
    crN: !inRange(d.crMaxPerRelease, 0, 5) || !Number.isInteger(Number(d.crMaxPerRelease)) ? 'Số nguyên 0–5' : '',
    sprint: !['1', '2', '3', '4'].includes(d.sprintWeeks.trim()) ? '1–4 tuần' : '',
    sla: !inRange(d.gateSlaDays, 1, 5) || !Number.isInteger(Number(d.gateSlaDays)) ? '1–5 ngày làm việc' : '',
  };
  const ckErr = (Object.values(d.checklist) as CkItem[][]).some((items) => items.some((it) => !it.name.trim()));
  const errCount = KPI_DEFS.filter((x) => kpiErr(x.code)).length + Object.values(pErr).filter(Boolean).length + (ckErr ? 1 : 0);

  const save = () => {
    if (errCount) return;
    STORE.set(khoi, clone(d));
    SAVED_AT.set(khoi, `${dmy(TODAY)} ${nowHm()}`);
    setSavedTick((x) => x + 1);
    flash(`Đã lưu cấu hình khối ${khoi} · ghi audit`);
  };
  const discard = () => {
    setDrafts((cur) => ({ ...cur, [khoi]: clone(savedOf(khoi)) }));
    setConfirmCk(null);
  };

  const items = d.checklist[Number(phase)] || [];
  const addItem = () =>
    set((x) => {
      const list = x.checklist[Number(phase)] || [];
      const max = list.reduce((m, it) => Math.max(m, Number(it.code.split('-')[1]) || 0), 0);
      x.checklist[Number(phase)] = [...list, { id: uid(), code: `P${phase}-${String(max + 1).padStart(2, '0')}`, name: '', required: false }];
      return x;
    });

  const pctInput = (key: keyof Draft, w = 'w-16') => (
    <span className="inline-flex items-center gap-1">
      <input value={d[key] as string} onChange={(e) => set((x) => ({ ...x, [key]: e.target.value.replace(/[^\d.]/g, '') }))} className={`${CELL} ${w} text-right tabular-nums`} />
    </span>
  );

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', 'Quản trị', 'Cấu hình khối']}
        title={
          <>
            Cấu hình khối {khoi}
            {dirtyOf[khoi] && <Tag cls="bg-amber-50 text-amber-700 border-amber-200">Chưa lưu</Tag>}
          </>
        }
        actions={
          <>
            {msg && (
              <span className="text-[12px] text-emerald-700 flex items-center gap-1">
                <Check size={13} /> {msg}
              </span>
            )}
            {errCount > 0 && <span className="text-[12px] text-rose-600">{errCount} lỗi cần sửa</span>}
            <Btn icon={Undo2} onClick={discard} disabled={!dirtyOf[khoi]}>
              Huỷ thay đổi
            </Btn>
            <Btn variant="primary" icon={Save} onClick={save} disabled={!dirtyOf[khoi] || errCount > 0}>
              Lưu
            </Btn>
          </>
        }
        meta={[
          {
            label: 'Khối',
            value: (
              <Segmented<Khoi>
                options={KHOI.map((k) => ({ key: k, label: dirtyOf[k] ? `${k} •` : k }))}
                value={khoi}
                onChange={(k) => (setKhoi(k), setConfirmCk(null))}
              />
            ),
          },
          { label: 'Lưu lần cuối', value: SAVED_AT.get(khoi) || 'mặc định PRD' },
          { label: 'Người sửa', value: 'GĐK khối / TCT' },
        ]}
      />

      {/* a) Ngưỡng KPI */}
      <Panel
        title="Ngưỡng 9 KPI"
        icon={Gauge}
        noPad
        actions={
          <Btn className="h-7" icon={RotateCcw} onClick={() => set((x) => ({ ...x, thresholds: defaultThresholds() }))}>
            Khôi phục mặc định
          </Btn>
        }
        footer={
          <>
            <b className="text-slate-700">Rule health (F1.3):</b> <span className="text-rose-700 font-semibold">Đỏ</span> nếu ≥1 KPI đỏ trong nhóm critical (#3 WP Blocked, #6 Budget Burn Δ, #9 Risk Score) hoặc ≥3 KPI đỏ;{' '}
            <span className="text-amber-700 font-semibold">Vàng</span> nếu ≥2 KPI vàng hoặc 1 KPI đỏ ngoài nhóm critical; còn lại <span className="text-emerald-700 font-semibold">Xanh</span>. Ngưỡng mới áp từ lần tính KPI kế tiếp, không tô lại lịch sử.
          </>
        }
      >
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[960px]`}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 w-8`}>#</th>
                <th className={`${erp.th} border-t-0 text-left w-40`}>KPI</th>
                <th className={`${erp.th} border-t-0 text-left`}>Công thức</th>
                <th className={`${erp.th} border-t-0 w-24`}>Hướng</th>
                <th className={`${erp.th} border-t-0 w-24 bg-amber-50`}>Vàng</th>
                <th className={`${erp.th} border-t-0 w-24 bg-rose-50`}>Đỏ</th>
                <th className={`${erp.th} border-t-0 border-r-0 text-left w-44`}>Mặc định PRD</th>
              </tr>
            </thead>
            <tbody>
              {KPI_DEFS.map((def) => {
                const t = d.thresholds[def.code];
                const err = kpiErr(def.code);
                const changed = t.yellow !== String(def.yellow) || t.red !== String(def.red);
                const unit = def.unit === '%' || def.unit === 'pt' ? '%' : '';
                return (
                  <tr key={def.code} className={err ? 'bg-rose-50/50' : changed ? 'bg-[#f5f9ff]' : erp.tr}>
                    <td className={`${erp.td} border-l-0 text-center text-slate-500`}>{def.no}</td>
                    <td className={`${erp.td} font-semibold text-slate-800`}>
                      {def.label}
                      {def.critical && <span className="ml-1 text-[10px] font-bold text-rose-700">CRITICAL</span>}
                    </td>
                    <td className={`${erp.td} text-[11.5px] text-slate-600`}>
                      {def.formula} <span className="text-slate-400">· {def.source}</span>
                    </td>
                    <td className={`${erp.td} text-center text-[11.5px]`}>{def.higherBetter ? 'Cao là tốt' : 'Thấp là tốt'}</td>
                    {(['yellow', 'red'] as const).map((lv) => (
                      <td key={lv} className={`${erp.td} text-center`}>
                        <span className="inline-flex items-center gap-0.5">
                          <span className="text-[11px] text-slate-400">{def.higherBetter ? '<' : def.unit === 'n' ? '≥' : '>'}</span>
                          <input
                            value={t[lv]}
                            onChange={(e) => set((x) => ((x.thresholds[def.code][lv] = e.target.value.replace(/[^\d.-]/g, '')), x))}
                            className={`${CELL} w-14 text-right tabular-nums ${err ? 'border-rose-400' : t[lv] !== String(def[lv]) ? 'border-[#1f5fa8] font-semibold' : ''}`}
                          />
                          <span className="text-[11px] text-slate-400 w-3">{unit}</span>
                        </span>
                      </td>
                    ))}
                    <td className={`${erp.td} border-r-0 text-[11.5px] ${changed ? 'text-slate-500' : 'text-slate-400'}`}>
                      {fmtThreshold(def)}
                      {err && <span className="block text-rose-600 font-semibold">{err}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-start">
        {/* b) Tham số */}
        <Panel title="Tham số khối" icon={SlidersHorizontal} noPad footer="Thay đổi tham số áp cho dự án mới và các mốc kế tiếp của dự án đang chạy; không đổi ECV đã ghi nhận.">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 text-left`}>Tham số</th>
                <th className={`${erp.th} border-t-0 text-left`}>Giá trị</th>
                <th className={`${erp.th} border-t-0 border-r-0 text-left`}>Quy tắc</th>
              </tr>
            </thead>
            <tbody>
              <ParamRow label="Tỉ lệ ECV khi nghiệm thu nội bộ" hint="Mặc định 70%; GĐK điều chỉnh có lý do, tối đa 85% (OQ-016, F7.1)" err={pErr.ecv}>
                {pctInput('ecvInternalPct')} <span className="text-[12px] text-slate-500">%</span>
                {ecv > 70 && (
                  <input
                    value={d.ecvReason}
                    onChange={(e) => set((x) => ({ ...x, ecvReason: e.target.value }))}
                    placeholder="Lý do vượt 70% *"
                    className={`${CELL} w-full mt-1 ${!d.ecvReason.trim() ? 'border-rose-300' : ''}`}
                  />
                )}
              </ParamRow>
              <ParamRow label="WP nền tối thiểu" hint="BFSI/YT 25%, GPDV 20%, G1–G4 15% (OQ-019, F3.4)" err={pErr.fmin}>
                {pctInput('foundationMinPct')} <span className="text-[12px] text-slate-500">% giá trị HĐ</span>
              </ParamRow>
              <ParamRow label="WP nền tối đa" hint="Trần 30%; vượt cần GĐK duyệt bảng phân bổ" err={pErr.fmax}>
                {pctInput('foundationMaxPct')} <span className="text-[12px] text-slate-500">% giá trị HĐ</span>
              </ParamRow>
              <ParamRow label="Ngưỡng CR hấp thụ PM tự duyệt" hint="≤5% SP release, tối đa 2 CR/release (OQ-017, F9.2); vượt → GĐSX" err={pErr.cr || pErr.crN}>
                <span className="inline-flex items-center gap-1 text-[12px] text-slate-500 flex-wrap">
                  ≤ {pctInput('crAbsorbSpPct', 'w-14')} % SP · tối đa {pctInput('crMaxPerRelease', 'w-12')} CR/release
                </span>
              </ParamRow>
              <ParamRow label="Độ dài sprint" hint="Áp cho sprint tạo mới; đồng bộ Jira Sprint" err={pErr.sprint}>
                <select value={d.sprintWeeks} onChange={(e) => set((x) => ({ ...x, sprintWeeks: e.target.value }))} className={CELL}>
                  {[1, 2, 3, 4].map((w) => (
                    <option key={w} value={w}>
                      {w} tuần
                    </option>
                  ))}
                </select>
              </ParamRow>
              <ParamRow label="SLA duyệt gate" hint="Quá SLA → AL-07 cảnh báo người duyệt + cấp trên" err={pErr.sla}>
                {pctInput('gateSlaDays', 'w-14')} <span className="text-[12px] text-slate-500">ngày làm việc</span>
              </ParamRow>
            </tbody>
          </table>
        </Panel>

        {/* d) Rule cảnh báo */}
        <Panel
          title="Rule cảnh báo theo khối"
          icon={Bell}
          noPad
          footer="Rule mức Đỏ bắt buộc, không tắt được. Tắt rule Vàng chỉ áp cho dự án của khối này; cảnh báo đang mở không bị đóng."
        >
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 w-16`}>Mã</th>
                <th className={`${erp.th} border-t-0 text-left`}>Điều kiện</th>
                <th className={`${erp.th} border-t-0 w-14`}>Mức</th>
                <th className={`${erp.th} border-t-0 text-left`}>Người nhận</th>
                <th className={`${erp.th} border-t-0 border-r-0 w-16`}>Bật</th>
              </tr>
            </thead>
            <tbody>
              {ALERT_RULES.map((r) => {
                const red = r.severity === 'Đỏ';
                const on = red || d.rules[r.code];
                return (
                  <tr key={r.code} className={on ? erp.tr : 'bg-slate-50 text-slate-400'}>
                    <td className={`${erp.td} border-l-0 ${erp.code} text-center`}>{r.code}</td>
                    <td className={erp.td}>{r.condition}</td>
                    <td className={`${erp.td} text-center`}>
                      <Tag cls={red ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>{r.severity}</Tag>
                    </td>
                    <td className={`${erp.td} text-[11.5px]`}>{r.recipients}</td>
                    <td className={`${erp.td} border-r-0 text-center`}>
                      {red ? (
                        <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-500" title="Rule đỏ bắt buộc">
                          <Lock size={11} /> Bật
                        </span>
                      ) : (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={on}
                          onClick={() => set((x) => ((x.rules[r.code] = !x.rules[r.code]), x))}
                          className={`relative inline-block w-8 h-4 rounded-full border cursor-pointer align-middle ${on ? 'bg-[#1f5fa8] border-[#184c88]' : 'bg-slate-300 border-slate-400'}`}
                        >
                          <span className={`absolute top-px w-3 h-3 rounded-full bg-white transition-all ${on ? 'left-[17px]' : 'left-px'}`} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </div>

      {/* c) Template checklist */}
      <Panel
        title={
          <>
            Template checklist phase <span className="font-normal normal-case text-slate-500 tracking-normal">· {items.length} mục · {items.filter((i) => i.required).length} bắt buộc</span>
          </>
        }
        icon={ListChecks}
        noPad
        actions={
          <>
            <Segmented<string> options={PHASES.map((p) => ({ key: String(p.no), label: `P${p.no} ${p.name}` }))} value={phase} onChange={(v) => (setPhase(v), setConfirmCk(null))} />
            <Btn variant="primary" className="h-7" icon={Plus} onClick={addItem}>
              Thêm mục
            </Btn>
          </>
        }
        footer="Template áp cho dự án vào phase sau khi lưu; dự án đang ở phase giữ checklist hiện tại. Gate chỉ trình được khi đủ mục bắt buộc (hoặc có lý do cho mục không bắt buộc bỏ trống)."
      >
        <table className={erp.table}>
          <thead>
            <tr>
              <th className={`${erp.th} border-t-0 border-l-0 w-24`}>Mã</th>
              <th className={`${erp.th} border-t-0 text-left`}>Tên mục</th>
              <th className={`${erp.th} border-t-0 w-24`}>Bắt buộc</th>
              <th className={`${erp.th} border-t-0 border-r-0 w-48`}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => {
              const confirming = confirmCk === it.id;
              const upd = (patch: Partial<CkItem>) => set((x) => ((x.checklist[Number(phase)] = x.checklist[Number(phase)].map((y) => (y.id === it.id ? { ...y, ...patch } : y))), x));
              return (
                <tr key={it.id} className={confirming ? 'bg-[#fff5f5]' : erp.tr}>
                  <td className={`${erp.td} border-l-0 ${erp.code} text-center`}>{it.code}</td>
                  <td className={`${erp.td} py-1`}>
                    <input
                      value={it.name}
                      autoFocus={!it.name}
                      onChange={(e) => upd({ name: e.target.value })}
                      placeholder="Tên mục checklist *"
                      className={`${CELL} w-full ${!it.name.trim() ? 'border-rose-300' : 'border-transparent bg-transparent hover:border-slate-300 focus:bg-white'}`}
                    />
                  </td>
                  <td className={`${erp.td} text-center`}>
                    <input type="checkbox" checked={it.required} onChange={(e) => upd({ required: e.target.checked })} className="cursor-pointer" />
                  </td>
                  <td className={`${erp.td} border-r-0 text-center`}>
                    {confirming ? (
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-[11.5px] text-rose-700">Xoá mục?</span>
                        <Btn variant="danger" className="h-6! px-2! text-[11px]!" onClick={() => (set((x) => ((x.checklist[Number(phase)] = x.checklist[Number(phase)].filter((y) => y.id !== it.id)), x)), setConfirmCk(null))}>
                          Xoá
                        </Btn>
                        <Btn className="h-6! px-2! text-[11px]!" onClick={() => setConfirmCk(null)}>
                          Huỷ
                        </Btn>
                      </div>
                    ) : (
                      <Btn variant="danger" className="h-6! px-2! text-[11px]!" icon={Trash2} onClick={() => setConfirmCk(it.id)}>
                        Xoá
                      </Btn>
                    )}
                  </td>
                </tr>
              );
            })}
            {!items.length && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-slate-400 italic">
                  Phase này chưa có mục checklist.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>
    </ErpPage>
  );
};
