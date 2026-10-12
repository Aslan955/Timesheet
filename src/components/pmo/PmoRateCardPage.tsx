/**
 * PmoRateCardPage — PMO-17 Rate card & overhead (F7.3). Chỉ Finance được sửa.
 *
 * Bố cục:
 *   - Ma trận Khối × Level: blended rate (VNĐ/giờ) có hiệu lực tại mốc chọn ("Hiệu lực từ"), kèm chênh lệch % so với
 *     phiên bản trước. Sửa = tạo phiên bản mới với ngày hiệu lực mới (nhập ngay trên ma trận); không sửa phiên bản cũ,
 *     không tính lại chi phí quá khứ.
 *   - Import CSV rate card quý: chọn file → xem trước bảng → xác nhận (inline, không popup).
 *   - Overhead % theo khối (OQ-013) sửa inline.
 *   - Ví dụ tính chi phí: giờ × rate × (1 + overhead%).
 * Dữ liệu mẫu từ RATE_CARD / OVERHEAD, lưu trong phiên (STORE cấp module).
 */
import React, { useMemo, useRef, useState } from 'react';
import { Calculator, Check, FilePlus2, FileSpreadsheet, Lock, Percent, Pencil, Table2, Upload, X } from 'lucide-react';
import { KHOI, Khoi, TODAY, addDays, dmy, fmtVnd } from '../../pmo/pmo';
import { LEVELS, Level, OVERHEAD, RATE_CARD, RateRow } from '../../pmo/pmoData';
import { Btn, ErpPage, ErpTitleBar, Panel, Segmented, erp } from '../erp/Erp';

// ==========================================================================
// Lưu trong phiên
// ==========================================================================
interface Version {
  from: string;
  by: string;
  note: string;
}
const STORE = new Map<string, unknown>();
const load = <T,>(k: string, init: () => T): T => (STORE.has(k) ? (STORE.get(k) as T) : init());
const SEED_VERSIONS: Version[] = [
  { from: '2026-04-01', by: 'Lâm Thu Hà', note: 'Rate card quý 2 (import CSV từ Finance)' },
  { from: '2026-07-01', by: 'Lâm Thu Hà', note: 'Rate card quý 3 — điều chỉnh lương 4%' },
];

const SEL = `${erp.input} h-7 text-[12px]`;
const num = (v: number) => Math.round(v).toLocaleString('vi-VN');
const nowHm = () => new Date().toTimeString().slice(0, 5);

type EditRole = 'Finance' | 'Admin' | 'TCT' | 'GĐK';

export const PmoRateCardPage: React.FC<{ onNavigate?: (item: string) => void }> = () => {
  const [rates, setRatesRaw] = useState<RateRow[]>(() => load('rates', () => RATE_CARD.map((r) => ({ ...r }))));
  const [versions, setVersionsRaw] = useState<Version[]>(() => load('versions', () => SEED_VERSIONS));
  const [overhead, setOverheadRaw] = useState<Record<Khoi, number>>(() => load('overhead', () => ({ ...OVERHEAD })));
  const persist = (r: RateRow[], v: Version[]) => {
    setRatesRaw(r);
    setVersionsRaw(v);
    STORE.set('rates', r);
    STORE.set('versions', v);
  };

  const [who, setWho] = useState<EditRole>('Finance');
  const canEdit = who === 'Finance';
  const [msg, setMsg] = useState('');
  const flash = (s: string) => {
    setMsg(s);
    window.setTimeout(() => setMsg(''), 3500);
  };

  const vDates = useMemo(() => [...new Set(rates.map((r) => r.effectiveFrom))].sort(), [rates]);
  const currentV = [...vDates].reverse().find((d) => d <= TODAY) || vDates[0];
  const [at, setAt] = useState(currentV);
  const prevOf = (d: string) => [...vDates].reverse().find((x) => x < d) || '';
  const rateAt = (k: Khoi, lv: Level, d: string) =>
    rates.filter((r) => r.khoi === k && r.level === lv && r.effectiveFrom <= d).sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom))[0]?.rate || 0;

  // Tạo phiên bản mới (inline trên ma trận)
  const [newMode, setNewMode] = useState(false);
  const [newFrom, setNewFrom] = useState('');
  const [newNote, setNewNote] = useState('');
  const [grid, setGrid] = useState<Record<string, string>>({});
  const latest = vDates[vDates.length - 1];
  const newErr = !newFrom
    ? 'Nhập ngày hiệu lực'
    : newFrom <= TODAY
      ? 'Ngày hiệu lực phải sau hôm nay — không sửa quá khứ'
      : newFrom <= latest
        ? `Phải sau phiên bản mới nhất (${dmy(latest)})`
        : Object.values(grid).some((v) => !(Number(v) > 0))
          ? 'Rate phải là số dương'
          : '';
  const startNew = () => {
    const base = latest;
    setGrid(Object.fromEntries(KHOI.flatMap((k) => LEVELS.map((lv) => [`${k}|${lv}`, String(rateAt(k, lv, base))]))));
    // Gợi ý đầu quý kế tiếp nếu còn sau phiên bản mới nhất
    setNewFrom('2027-01-01' > latest && '2027-01-01' > TODAY ? '2027-01-01' : '');
    setNewNote('');
    setNewMode(true);
    setImp(null);
  };
  const saveNew = () => {
    if (newErr) return;
    const changed: RateRow[] = [];
    KHOI.forEach((k) =>
      LEVELS.forEach((lv) => {
        const v = Math.round(Number(grid[`${k}|${lv}`]));
        if (v !== rateAt(k, lv, latest)) changed.push({ khoi: k, level: lv, rate: v, effectiveFrom: newFrom });
      }),
    );
    if (!changed.length) {
      flash('Không có ô nào thay đổi — chưa tạo phiên bản');
      return;
    }
    persist([...rates, ...changed], [...versions, { from: newFrom, by: 'Finance (bạn)', note: newNote.trim() || `Sửa tay ${changed.length} ô` }]);
    setNewMode(false);
    setAt(newFrom);
    flash(`Đã tạo phiên bản hiệu lực ${dmy(newFrom)} · ${changed.length} ô thay đổi · ghi audit`);
  };

  // Import CSV quý
  const fileRef = useRef<HTMLInputElement>(null);
  const [imp, setImp] = useState<{ file: string; from: string; rows: { khoi: Khoi; level: Level; rate: number; cur: number }[] } | null>(null);
  const loadImport = (file: string) => {
    const from = latest < '2027-01-01' ? '2027-01-01' : addDays(latest, 92);
    const rows = KHOI.flatMap((k, ki) =>
      LEVELS.map((lv, li) => {
        const cur = rateAt(k, lv, latest);
        const bump = k === 'BFSI' && lv === 'Senior' ? 1.14 : 1 + ((ki + li) % 4) * 0.01 + 0.02;
        return { khoi: k, level: lv, rate: Math.round((cur * bump) / 1000) * 1000, cur };
      }),
    );
    setImp({ file, from, rows });
    setNewMode(false);
  };
  const impErr = imp ? (imp.from <= TODAY ? 'Ngày hiệu lực phải sau hôm nay' : imp.from <= latest ? `Phải sau ${dmy(latest)}` : '') : '';
  const confirmImport = () => {
    if (!imp || impErr) return;
    persist(
      [...rates, ...imp.rows.map((r) => ({ khoi: r.khoi, level: r.level, rate: r.rate, effectiveFrom: imp.from }))],
      [...versions, { from: imp.from, by: 'Finance (bạn)', note: `Import ${imp.file} · ${imp.rows.length} dòng` }],
    );
    setAt(imp.from);
    flash(`Đã nhập ${imp.rows.length} rate hiệu lực ${dmy(imp.from)} · ghi audit`);
    setImp(null);
  };

  // Overhead
  const [ohEdit, setOhEdit] = useState<Khoi | null>(null);
  const [ohDraft, setOhDraft] = useState('');
  const ohErr = ohEdit && !(Number(ohDraft) >= 0 && Number(ohDraft) <= 60) ? 'Từ 0 đến 60%' : '';
  const saveOh = () => {
    if (!ohEdit || ohErr) return;
    const next = { ...overhead, [ohEdit]: Number(ohDraft) };
    setOverheadRaw(next);
    STORE.set('overhead', next);
    flash(`Overhead ${ohEdit}: ${overhead[ohEdit]}% → ${Number(ohDraft)}% · ghi audit ${nowHm()}`);
    setOhEdit(null);
  };

  // Ví dụ tính
  const [exK, setExK] = useState<Khoi>('BFSI');
  const [exL, setExL] = useState<Level>('Senior');
  const [exH, setExH] = useState('40');
  const exRate = rateAt(exK, exL, TODAY);
  const exHours = Math.max(0, Number(exH) || 0);
  const exBase = exHours * exRate;
  const exOh = exBase * (overhead[exK] / 100);

  const prev = prevOf(at);
  const ver = versions.find((v) => v.from === at);

  return (
    <ErpPage>
      <ErpTitleBar
        crumbs={['PMO', 'Quản trị', 'Rate card & overhead']}
        title="Rate card & overhead"
        actions={
          <>
            {msg && <span className="text-[12px] text-emerald-700">{msg}</span>}
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Vai trò
              <select value={who} onChange={(e) => (setWho(e.target.value as EditRole), setNewMode(false), setImp(null), setOhEdit(null))} className={SEL}>
                <option>Finance</option>
                <option>Admin</option>
                <option>TCT</option>
                <option>GĐK</option>
              </select>
            </label>
          </>
        }
        meta={[
          { label: 'Phiên bản', value: vDates.length },
          { label: 'Đang hiệu lực', value: `từ ${dmy(currentV)}` },
          { label: 'Đơn vị', value: 'VNĐ / giờ (blended)' },
          { label: 'Quyền', value: canEdit ? <span className="text-emerald-700">Finance — được sửa</span> : <span className="text-slate-500">{who === 'TCT' ? 'Xem tổng' : 'Chỉ xem'}</span> },
        ]}
      />

      <Panel
        title="Rate card · Khối × Level"
        icon={Table2}
        noPad
        actions={
          newMode ? undefined : (
            <>
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
                Hiệu lực từ
                <select value={at} onChange={(e) => setAt(e.target.value)} className={SEL}>
                  {vDates.map((d) => (
                    <option key={d} value={d}>
                      {dmy(d)}
                      {d === currentV ? ' (hiện tại)' : d > TODAY ? ' (sắp tới)' : ''}
                    </option>
                  ))}
                </select>
              </label>
              <Btn className="h-7" icon={canEdit ? Upload : Lock} onClick={() => fileRef.current?.click()} disabled={!canEdit}>
                Import CSV quý
              </Btn>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => (e.target.files?.[0] && loadImport(e.target.files[0].name), (e.target.value = ''))} />
              <Btn variant="primary" className="h-7" icon={canEdit ? FilePlus2 : Lock} onClick={startNew} disabled={!canEdit || !!imp}>
                Tạo phiên bản mới
              </Btn>
            </>
          )
        }
        footer="Đổi rate không tính lại quá khứ: chi phí đã khoá theo tuần giữ rate tại thời điểm log. Rate = blended gross + phúc lợi theo level × khối (OQ-012); PMO không nhận lương cá nhân. Nếu HR chưa có API (OQ-011) → import CSV hằng quý."
      >
        {newMode && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-1.5 bg-[#eaf2fc] border-b border-slate-200">
            <span className="text-[12px] font-bold text-[#1e3a5f]">Phiên bản mới</span>
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Hiệu lực từ *
              <input type="date" value={newFrom} min={addDays(latest > TODAY ? latest : TODAY, 1)} onChange={(e) => setNewFrom(e.target.value)} className={SEL} />
            </label>
            <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
              Ghi chú
              <input value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="vd Rate quý 1/2027" className={`${SEL} w-56`} />
            </label>
            {newErr && <span className="text-[11.5px] text-rose-600">{newErr}</span>}
            <span className="ml-auto inline-flex gap-1">
              <Btn variant="success" className="h-7" icon={Check} onClick={saveNew} disabled={!!newErr}>
                Lưu phiên bản
              </Btn>
              <Btn className="h-7" icon={X} onClick={() => setNewMode(false)}>
                Huỷ
              </Btn>
            </span>
          </div>
        )}
        {!newMode && !imp && (
          <div className="px-3 py-1 bg-[#f3f6fa] border-b border-slate-200 text-[12px] text-slate-600">
            Phiên bản <b>{dmy(at)}</b>
            {ver && (
              <>
                {' '}
                · {ver.by} · {ver.note}
              </>
            )}
            {prev ? <> · so với phiên bản {dmy(prev)}</> : ' · phiên bản đầu tiên'}
          </div>
        )}

        {imp ? (
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-1.5 bg-[#eaf2fc] border-b border-slate-200 text-[12px]">
              <FileSpreadsheet size={13} className="text-[#1f5fa8]" />
              <span className="font-mono">{imp.file}</span>
              <span>
                {imp.rows.length} dòng · <b className="text-emerald-700">{imp.rows.length} hợp lệ</b> · <b className="text-amber-700">{imp.rows.filter((r) => r.rate / r.cur - 1 > 0.1).length} cần kiểm tra (Δ &gt; 10%)</b>
              </span>
              <label className="flex items-center gap-1.5 text-slate-600">
                Hiệu lực từ *
                <input type="date" value={imp.from} onChange={(e) => setImp({ ...imp, from: e.target.value })} className={SEL} />
              </label>
              {impErr && <span className="text-[11.5px] text-rose-600">{impErr}</span>}
              <span className="ml-auto inline-flex gap-1">
                <Btn variant="success" className="h-7" icon={Check} onClick={confirmImport} disabled={!!impErr}>
                  Xác nhận nhập
                </Btn>
                <Btn className="h-7" icon={X} onClick={() => setImp(null)}>
                  Huỷ
                </Btn>
              </span>
            </div>
            <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
              <table className={`${erp.table} min-w-[640px]`}>
                <thead className="sticky top-0">
                  <tr>
                    <th className={`${erp.th} border-t-0 border-l-0 w-12`}>#</th>
                    <th className={`${erp.th} border-t-0 w-20`}>Khối</th>
                    <th className={`${erp.th} border-t-0 text-left w-24`}>Level</th>
                    <th className={`${erp.th} border-t-0 text-right`}>Rate hiện tại</th>
                    <th className={`${erp.th} border-t-0 text-right`}>Rate trong file</th>
                    <th className={`${erp.th} border-t-0 text-right w-20`}>Δ</th>
                    <th className={`${erp.th} border-t-0 border-r-0 text-left`}>Kiểm tra</th>
                  </tr>
                </thead>
                <tbody>
                  {imp.rows.map((r, i) => {
                    const d = (r.rate / r.cur - 1) * 100;
                    const warn = d > 10;
                    return (
                      <tr key={i} className={warn ? 'bg-amber-50' : erp.tr}>
                        <td className={`${erp.td} border-l-0 ${erp.num} text-slate-500`}>{i + 2}</td>
                        <td className={`${erp.td} text-center font-semibold`}>{r.khoi}</td>
                        <td className={erp.td}>{r.level}</td>
                        <td className={`${erp.td} ${erp.num} text-slate-500`}>{num(r.cur)}</td>
                        <td className={`${erp.td} ${erp.num} font-semibold`}>{num(r.rate)}</td>
                        <td className={`${erp.td} ${erp.num} ${warn ? 'text-amber-700 font-bold' : 'text-slate-600'}`}>+{d.toFixed(1)}%</td>
                        <td className={`${erp.td} border-r-0 text-[11.5px] ${warn ? 'text-amber-700' : 'text-emerald-700'}`}>{warn ? 'Tăng > 10% — xác nhận với HR' : 'Hợp lệ'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`${erp.table} min-w-[860px]`}>
              <thead>
                <tr>
                  <th className={`${erp.th} border-t-0 border-l-0 text-left w-24`}>Khối</th>
                  {LEVELS.map((lv, i) => (
                    <th key={lv} className={`${erp.th} border-t-0 text-right ${i === LEVELS.length - 1 ? 'border-r-0' : ''}`}>
                      {lv}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KHOI.map((k) => (
                  <tr key={k} className={erp.tr}>
                    <td className={`${erp.td} border-l-0 font-bold text-[#1e3a5f]`}>{k}</td>
                    {LEVELS.map((lv, i) => {
                      const last = i === LEVELS.length - 1 ? 'border-r-0' : '';
                      if (newMode) {
                        const key = `${k}|${lv}`;
                        const base = rateAt(k, lv, latest);
                        const v = Number(grid[key]);
                        const d = base ? (v / base - 1) * 100 : 0;
                        return (
                          <td key={lv} className={`${erp.td} ${last} py-1`}>
                            <input
                              value={grid[key]}
                              onChange={(e) => setGrid({ ...grid, [key]: e.target.value.replace(/[^\d]/g, '') })}
                              className={`${erp.input} h-7 text-[12px] w-full text-right tabular-nums ${v !== base ? 'border-[#1f5fa8] bg-[#f5f9ff] font-semibold' : ''}`}
                            />
                            {v !== base && v > 0 && (
                              <span className={`block text-right text-[10.5px] ${d > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                                {d > 0 ? '+' : ''}
                                {d.toFixed(1)}% · cũ {num(base)}
                              </span>
                            )}
                          </td>
                        );
                      }
                      const cur = rateAt(k, lv, at);
                      const old = prev ? rateAt(k, lv, prev) : 0;
                      const d = old ? (cur / old - 1) * 100 : 0;
                      return (
                        <td key={lv} className={`${erp.td} ${erp.num} ${last}`}>
                          <span className="font-semibold text-slate-800">{num(cur)}</span>
                          {old > 0 && (
                            <span className={`ml-1.5 text-[10.5px] ${d > 0.05 ? 'text-rose-700' : d < -0.05 ? 'text-emerald-700' : 'text-slate-400'}`}>
                              {d > 0.05 ? '+' : ''}
                              {d.toFixed(1)}%
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Lịch sử phiên bản */}
        <div className="border-t border-slate-200 px-3 py-1.5 text-[11.5px] text-slate-600 flex flex-wrap gap-x-4 gap-y-0.5">
          <b className="text-[#1e3a5f]">Lịch sử phiên bản:</b>
          {[...versions].reverse().map((v) => (
            <span key={v.from}>
              <button type="button" className="text-[#1f5fa8] hover:underline cursor-pointer tabular-nums" onClick={() => (setNewMode(false), setImp(null), setAt(v.from))}>
                {dmy(v.from)}
              </button>{' '}
              · {v.by} · {v.note}
            </span>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 items-start">
        <Panel
          title="Overhead % theo khối"
          icon={Percent}
          noPad
          footer="OQ-013: overhead phân bổ theo % cost nhân sự, khác nhau theo khối; áp cùng một quy tắc cho cả 7 khối để so sánh công bằng. Thay đổi áp từ tuần kế tiếp, không tính lại tuần đã khoá."
        >
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${erp.th} border-t-0 border-l-0 text-left w-24`}>Khối</th>
                <th className={`${erp.th} border-t-0 text-right w-32`}>Overhead %</th>
                <th className={`${erp.th} border-t-0 text-left`}>Ví dụ trên 100 tr cost nhân sự</th>
                <th className={`${erp.th} border-t-0 border-r-0 w-36`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {KHOI.map((k) => {
                const editing = ohEdit === k;
                return (
                  <tr key={k} className={editing ? 'bg-[#eaf2fc]' : erp.tr}>
                    <td className={`${erp.td} border-l-0 font-bold text-[#1e3a5f]`}>{k}</td>
                    <td className={`${erp.td} ${erp.num}`}>
                      {editing ? (
                        <>
                          <input
                            autoFocus
                            value={ohDraft}
                            onChange={(e) => setOhDraft(e.target.value.replace(/[^\d.]/g, ''))}
                            onKeyDown={(e) => (e.key === 'Enter' ? saveOh() : e.key === 'Escape' ? setOhEdit(null) : null)}
                            className={`${erp.input} h-7 text-[12px] w-20 text-right ${ohErr ? 'border-rose-400' : ''}`}
                          />
                          {ohErr && <span className="block text-[11px] text-rose-600">{ohErr}</span>}
                        </>
                      ) : (
                        <span className="font-semibold">{overhead[k]}%</span>
                      )}
                    </td>
                    <td className={`${erp.td} text-slate-600 tabular-nums`}>+{num((100 * (editing ? Number(ohDraft) || 0 : overhead[k])) / 100)} tr overhead</td>
                    <td className={`${erp.td} border-r-0 text-center`}>
                      {editing ? (
                        <div className="inline-flex gap-1">
                          <Btn variant="success" className="h-6! px-2! text-[11px]!" icon={Check} onClick={saveOh} disabled={!!ohErr}>
                            Lưu
                          </Btn>
                          <Btn className="h-6! px-2! text-[11px]!" onClick={() => setOhEdit(null)}>
                            Huỷ
                          </Btn>
                        </div>
                      ) : (
                        <Btn className="h-6! px-2! text-[11px]!" icon={canEdit ? Pencil : Lock} onClick={() => (setOhEdit(k), setOhDraft(String(overhead[k])))} disabled={!canEdit || !!ohEdit}>
                          Sửa
                        </Btn>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>

        <Panel title="Ví dụ tính chi phí" icon={Calculator} footer="Cost = Σ giờ timesheet × rate (level tại thời điểm log, khối gốc của người) × (1 + overhead% khối). Người điều chuyển liên khối: cost tính vào dự án nhận, rate theo khối gốc.">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
                Khối gốc
                <select value={exK} onChange={(e) => setExK(e.target.value as Khoi)} className={SEL}>
                  {KHOI.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </label>
              <span className="flex items-center gap-1.5 text-[12px] text-slate-600">
                Level
                <Segmented<Level> options={LEVELS.map((l) => ({ key: l, label: l }))} value={exL} onChange={setExL} />
              </span>
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
                Số giờ
                <input value={exH} onChange={(e) => setExH(e.target.value.replace(/[^\d.]/g, ''))} className={`${SEL} w-20 text-right`} />
              </label>
            </div>
            <table className={erp.table}>
              <tbody>
                <tr>
                  <td className={`${erp.td} bg-[#f3f6fa] text-slate-600 w-[46%]`}>Rate hiện hành ({exK} · {exL})</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmtVnd(exRate)} / giờ</td>
                </tr>
                <tr>
                  <td className={`${erp.td} bg-[#f3f6fa] text-slate-600`}>Cost nhân sự = {exHours} giờ × {num(exRate)}</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmtVnd(exBase)}</td>
                </tr>
                <tr>
                  <td className={`${erp.td} bg-[#f3f6fa] text-slate-600`}>Overhead {overhead[exK]}%</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmtVnd(exOh)}</td>
                </tr>
                <tr className={erp.totalRow}>
                  <td className={erp.td}>Cost = giờ × rate × (1 + {overhead[exK]}%)</td>
                  <td className={`${erp.td} ${erp.num}`}>{fmtVnd(exBase + exOh)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </ErpPage>
  );
};
