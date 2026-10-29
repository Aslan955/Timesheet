/**
 * PrintDialog — popup "In hợp đồng": chọn mẫu in (template Word) cho từng hợp đồng đã chọn, xem trước trên khổ A4
 * và sửa thông tin NGAY TRÊN BẢN XEM TRƯỚC (bấm vào chữ nền vàng). Phần sửa chỉ áp dụng cho bản in, không đổi hồ sơ hợp đồng.
 * Dữ liệu trộn + tạo file do màn gọi cung cấp (dataOf / onPrint) — popup không phụ thuộc kho hợp đồng.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { AlertTriangle, Check, FileDown, FileSpreadsheet, FileText, Printer, RotateCcw, Undo2, X } from 'lucide-react';
import { DateInput, today } from '../EmployeePage';
import { Btn, erp } from '../erp/Erp';
import { FIELDS, fieldLabel, typeDef, useCatalog, type AppendixTypeDef, type TemplateDef } from './catalog';
import { FIELD_RE, MF_RE, inspectDocx, soThanhChu, type DocLine } from './docx';

export type PrintItem = {
  id: string;
  title: string; // họ tên NLĐ
  sub: string; // số HĐ · loại HĐ
  typeName: string;
  companyId: string;
  defaultTpl: TemplateDef | null;
  attachments: TemplateDef[];
  dataOf: (app?: AppendixTypeDef, appDate?: string) => Record<string, string>;
  /** Trang bản in mặc định (HTML) khi không dùng mẫu Word */
  defaultHtml?: () => string;
};
export type PrintJob = { item: PrintItem; main: TemplateDef | null; extras: TemplateDef[]; app?: AppendixTypeDef; data: Record<string, string>; edited: string[] };

type Cfg = { tpl: string; app: string; appDate: string; kt: Record<string, boolean>; ov: Record<string, string>; wordsManual?: boolean };

/** Các tên trường cùng một dữ liệu trong bộ mẫu — sửa 1 trường thì đổi luôn các trường còn lại. */
const ALIASES = [
  ['Bday', 'Ngày_sinh', 'BOD_text'],
  ['Date_of_Issue', 'Ngày_cấp', 'Ngày_cấp_text'],
  ['Người_đại_diện_ký', 'Người_ký'],
  ['HQCV_tạm_tính', 'HQCV'],
  ['Ngày_áp_dụng_text', 'Ngày_ký_Phụ_lục_điều_chỉnh'],
  ['Họ_và_tên', 'Họ_tên_1'],
  ['Mã_NV', 'DS_Nhân_viênMã_NV_cũ1'],
  ['Contract_start', 'Ngày_bắt_đầu_HD'],
];
const aliasOf = (k: string) => ALIASES.find((g) => g.includes(k)) || [k];
const titleCase = (v: string) => v.toLocaleLowerCase('vi').replace(/(^|\s)(\p{L})/gu, (_m, a: string, b: string) => a + b.toLocaleUpperCase('vi'));
const wordsOf = (salary: string) => {
  const n = Number(salary.replace(/[^\d]/g, ''));
  return salary.trim() && n ? soThanhChu(n) : '';
};
/** Trường suy ra từ trường khác: họ tên IN HOA ↔ họ tên thường; mức lương → bằng chữ. */
const derivedOf = (name: string, v: string, wordsManual: boolean): Record<string, string> => {
  if (name === 'Họ_và_tên' || name === 'Họ_tên_1') return { Họ_và_tên2: titleCase(v) };
  if (name === 'Họ_và_tên2') return { Họ_và_tên: v.toLocaleUpperCase('vi') };
  if (name === 'Lương_Cơ_bản' && !wordsManual) return { LCB_bằng_chữ: wordsOf(v) };
  return {};
};
const OPTIONAL = new Set(['Giấy_ủy_quyền', 'Ghi_chú', 'Mô_tả_công_việc', 'Contract_end', 'Số_tháng_HD', 'Điện_thoại_công_ty', 'Tên_phụ_lục', 'Nội_dung_điều_chỉnh', 'Mã_số_thuế']);
const KIND_PREFIX = { HD: 'Hợp đồng', KT: 'Kèm theo', PL: 'Phụ lục' } as const;

/** Trường số trong file dữ liệu trộn (ô số → mẫu Word có \\# #,##0 tự định dạng). */
const NUM_FIELD = /^(Lương_Cơ_bản|Lương_gốc|Trợ_cấp_|HQCV|Tổng_hỗ_trợ|Tổng_thu_nhập|Mức_hưởng|Số_tháng_HD)/;
const MONEY_FIELD = /^(Lương_Cơ_bản|Lương_gốc|Trợ_cấp_|HQCV|Tổng_hỗ_trợ|Tổng_thu_nhập)/;
/** File Excel dữ liệu trộn: sheet "Du_lieu_tron" — dòng 1 là tên trường (đúng tên MERGEFIELD trong mẫu Word), mỗi hợp đồng 1 dòng;
 *  sheet "Giai_thich" — ý nghĩa từng trường. Dùng làm nguồn dữ liệu Mail Merge trong Word. */
export const exportMergeData = (jobs: PrintJob[]) => {
  const present = new Set(jobs.flatMap((j) => Object.keys(j.data)));
  const keys = [...FIELDS.map((f) => f.key.normalize('NFC')).filter((k) => present.has(k)), ...[...present].filter((k) => !FIELDS.some((f) => f.key.normalize('NFC') === k))];
  const cell = (k: string, v: string) => {
    const n = Number(v.replace(/,/g, '').trim());
    return NUM_FIELD.test(k) && v.trim() && isFinite(n) ? n : v;
  };
  const aoa: (string | number)[][] = [[...keys, 'Mẫu_in', 'Số_trường_đã_sửa']];
  jobs.forEach((j) => aoa.push([...keys.map((k) => cell(k, j.data[k] ?? '')), j.main?.name || 'Bản in mặc định', j.edited.length]));
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  keys.forEach((k, c) => {
    if (!MONEY_FIELD.test(k)) return;
    for (let r = 1; r < aoa.length; r++) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (ws[ref]?.t === 'n') ws[ref].z = '#,##0';
    }
  });
  ws['!cols'] = [...keys, 'Mẫu_in', 'x'].map((k) => ({ wch: Math.min(40, Math.max(12, k.length + 2, ...jobs.map((j) => String(j.data[k] ?? '').length + 2))) }));
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  const info = XLSX.utils.aoa_to_sheet([
    ['Tên trường', 'Ý nghĩa', 'Kiểu dữ liệu'],
    ...keys.map((k) => [k, fieldLabel(k), MONEY_FIELD.test(k) ? 'Số tiền (VNĐ) — trong mẫu Word dùng \\# #,##0 để hiện dấu phân cách' : NUM_FIELD.test(k) ? 'Số' : jobs.some((j) => /^\d{2}\/\d{2}\/\d{4}$/.test(j.data[k] ?? '')) ? 'Ngày (chữ dạng dd/mm/yyyy)' : 'Chữ']),
    [],
    ['Cách dùng: Word → Mailings → Select Recipients → Use an Existing List → chọn file này → sheet Du_lieu_tron.'],
  ]);
  info['!cols'] = [{ wch: 30 }, { wch: 60 }, { wch: 60 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Du_lieu_tron');
  XLSX.utils.book_append_sheet(wb, info, 'Giai_thich');
  const name = `Du_lieu_tron_HD_${today().replace(/-/g, '')}.xlsx`;
  XLSX.writeFile(wb, name);
  return name;
};

const LINES = new Map<string, Promise<DocLine[]>>();
export const PRINT_CSS = `section{page-break-after:always}section:last-child{page-break-after:auto}
.dflt h1{text-align:center;font-size:20px;margin:6px 0 2px}.dflt .c{text-align:center}.dflt .sub{text-align:center;font-style:italic;margin-bottom:16px}.dflt table{width:100%;border-collapse:collapse;margin:4px 0 10px}
.dflt td{padding:3px 4px;vertical-align:top}.dflt td.k{width:200px;color:#333}.dflt h2{font-size:15px;margin:14px 0 4px}.dflt .sig{display:flex;justify-content:space-between;margin-top:36px;text-align:center}.dflt .sig div{width:45%}`;
const escH = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** In trực tiếp (trình duyệt → máy in / lưu PDF) đúng nội dung đang xem trước, gồm phần đã sửa. Mỗi văn bản 1 trang mới.
 *  Dùng iframe ẩn nên không bị chặn cửa sổ bật lên. */
export const printJobsDirect = async (jobs: PrintJob[]) => {
  const re = () => new RegExp(`${MF_RE.source}|${FIELD_RE.source}`, 'gu');
  const fill = (text: string, data: Record<string, string>) => {
    let out = '';
    let last = 0;
    for (const m of text.matchAll(re())) {
      const name = (m[1] ?? m[2]).normalize('NFC');
      out += escH(text.slice(last, m.index)) + (data[name]?.trim() ? escH(data[name]) : '…………………');
      last = m.index! + m[0].length;
    }
    return out + escH(text.slice(last));
  };
  const sections: string[] = [];
  for (const j of jobs) {
    if (!j.main) {
      if (j.item.defaultHtml) sections.push(j.item.defaultHtml());
      continue;
    }
    for (const t of [j.main, ...j.extras]) {
      const lines = await linesOf(t);
      sections.push(
        `<section class="doc">${lines
          .map((l) => (l.text.trim() ? `<p class="${l.center || l.table ? 'c' : l.right ? 'r' : 'j'}${l.bold ? ' b' : ''}">${fill(l.text, j.data)}</p>` : '<div class="gap"></div>'))
          .join('')}</section>`,
      );
    }
  }
  if (!sections.length) return 0;
  const title = jobs.length === 1 ? `In ${jobs[0].item.sub.split(' · ')[0]}` : `In ${jobs.length} hợp đồng`;
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${escH(title)}</title><style>
@page{size:A4;margin:18mm 20mm}body{font-family:'Times New Roman',Times,serif;font-size:13.5pt;line-height:1.5;color:#000;margin:0}
.doc p{margin:0 0 3pt;white-space:pre-wrap}.doc .c{text-align:center}.doc .r{text-align:right}.doc .j{text-align:justify}.doc .b{font-weight:bold}.doc .gap{height:9pt}
${PRINT_CSS}</style></head><body>${sections.join('')}</body></html>`;
  const fr = document.createElement('iframe');
  fr.setAttribute('aria-hidden', 'true');
  fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
  document.body.appendChild(fr);
  await new Promise<void>((ok) => {
    fr.onload = () => ok();
    fr.srcdoc = html;
  });
  const w = fr.contentWindow!;
  w.focus();
  w.print();
  setTimeout(() => fr.remove(), 60_000);
  return sections.length;
};

const linesOf = (t: TemplateDef) => {
  const key = `${t.id}:${t.size}:${t.uploadedAt}`;
  if (!LINES.has(key)) LINES.set(key, inspectDocx(t.data!).then((r) => r.lines));
  return LINES.get(key)!;
};

/** Ô sửa trực tiếp trên bản xem trước — sửa xong bấm Enter / bấm ra ngoài; Esc huỷ. */
const Editable: React.FC<{ name: string; value: string; edited: boolean; empty: boolean; onCommit: (v: string) => void }> = ({ name, value, edited, empty, onCommit }) => (
  <span
    key={`${name}:${value}`}
    contentEditable
    suppressContentEditableWarning
    spellCheck={false}
    data-field={name}
    data-ph="(trống – bấm để nhập)"
    title={`«${fieldLabel(name)}» — bấm để sửa${edited ? ' (đã sửa)' : ''}`}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.currentTarget.blur();
      } else if (e.key === 'Escape') {
        e.stopPropagation(); // Esc chỉ huỷ ô đang sửa, không đóng popup
        e.currentTarget.textContent = value;
        e.currentTarget.blur();
      }
    }}
    onPaste={(e) => {
      e.preventDefault();
      document.execCommand('insertText', false, e.clipboardData.getData('text/plain').replace(/\s*\n\s*/g, ' '));
    }}
    onBlur={(e) => {
      const v = (e.currentTarget.textContent || '').replace(/ /g, ' ');
      if (v !== value) onCommit(v);
    }}
    className={`rounded-sm px-0.5 outline-none cursor-text whitespace-pre-wrap focus:ring-2 focus:ring-[#1f5fa8] focus:bg-white empty:before:content-[attr(data-ph)] empty:before:text-rose-400 empty:before:italic empty:before:text-[12px] ${
      edited ? 'bg-sky-100 border-b-2 border-sky-500' : empty ? 'bg-rose-50 border-b border-dashed border-rose-400' : 'bg-amber-100 hover:bg-amber-200'
    }`}
  >
    {value}
  </span>
);

export const PrintDialog: React.FC<{ items: PrintItem[]; onClose: () => void; onPrint: (jobs: PrintJob[]) => Promise<void>; notify?: (m: string) => void }> = ({ items, onClose, onPrint, notify }) => {
  const cat = useCatalog();
  const [cur, setCur] = useState(items[0]?.id || '');
  const [cfg, setCfg] = useState<Record<string, Cfg>>(() =>
    Object.fromEntries(
      items.map((it) => [it.id, { tpl: it.defaultTpl?.id || '', app: '', appDate: today(), kt: Object.fromEntries(it.attachments.map((t) => [t.id, true])), ov: {} }]),
    ),
  );
  const [docTab, setDocTab] = useState('');
  const [lines, setLines] = useState<DocLine[] | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const paper = useRef<HTMLDivElement>(null);

  const it = items.find((x) => x.id === cur) || items[0];
  const c = cfg[it.id];
  const set = (id: string, fn: (x: Cfg) => Cfg) => setCfg((p) => ({ ...p, [id]: fn(p[id]) }));
  const tplOf = (id: string) => cat.templates.find((t) => t.id === id) || null;

  // Mẫu có thể chọn cho hợp đồng đang xem (theo công ty), chia nhóm
  const options = useMemo(() => {
    const ok = cat.templates.filter((t) => t.active && t.data && (!t.companyId || t.companyId === it.companyId));
    const tid = typeDef(it.typeName)?.id || '';
    return [
      { label: `Mẫu hợp đồng phù hợp (${it.typeName})`, list: ok.filter((t) => t.kind === 'HD' && t.appliesTo.includes(tid)) },
      { label: 'Mẫu hợp đồng khác', list: ok.filter((t) => t.kind === 'HD' && !t.appliesTo.includes(tid)) },
      { label: 'Phụ lục hợp đồng', list: ok.filter((t) => t.kind === 'PL') },
      { label: 'Văn bản kèm theo', list: ok.filter((t) => t.kind === 'KT') },
    ].filter((g) => g.list.length);
  }, [cat.templates, it]);

  const jobOf = (x: PrintItem): PrintJob => {
    const k = cfg[x.id];
    const main = tplOf(k.tpl);
    const apps = main?.kind === 'PL' ? cat.appendix.filter((a) => main.appliesTo.includes(a.id)) : [];
    const app = apps.find((a) => a.id === k.app) || apps[0];
    const extras = main?.kind === 'HD' ? x.attachments.filter((t) => k.kt[t.id]) : [];
    return { item: x, main, extras, app, data: { ...x.dataOf(app, k.appDate), ...k.ov }, edited: Object.keys(k.ov).filter((f) => !ALIASES.some((g) => g.indexOf(f) > 0 && g[0] in k.ov)) };
  };
  const job = jobOf(it);
  const base = useMemo(() => it.dataOf(job.app, c.appDate), [it, job.app, c.appDate]); // eslint-disable-line react-hooks/exhaustive-deps
  const docs = job.main ? [job.main, ...job.extras] : [];
  const doc = docs.find((d) => d.id === docTab) || docs[0] || null;

  useEffect(() => {
    let live = true;
    setErr('');
    setLines(null);
    if (!doc) return;
    linesOf(doc)
      .then((r) => live && setLines(r))
      .catch((e) => live && setErr((e as Error).message));
    return () => {
      live = false;
    };
  }, [doc?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && !(document.activeElement as HTMLElement)?.isContentEditable && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  const commit = (name: string, v: string) =>
    set(it.id, (x) => {
      const ov = { ...x.ov };
      let wordsManual = !!x.wordsManual;
      if (name === 'LCB_bằng_chữ') wordsManual = v !== wordsOf(job.data.Lương_Cơ_bản || '');
      const patch: Record<string, string> = {};
      aliasOf(name).forEach((k) => (patch[k] = v));
      Object.entries(derivedOf(name, v, wordsManual)).forEach(([dk, dv]) => aliasOf(dk).forEach((k) => (patch[k] = dv)));
      for (const [k, pv] of Object.entries(patch)) {
        if (pv === (base[k] ?? '')) delete ov[k];
        else ov[k] = pv;
      }
      return { ...x, ov, wordsManual };
    });
  const reset = (name?: string) =>
    set(it.id, (x) => {
      if (!name) return { ...x, ov: {}, wordsManual: false };
      const ov = { ...x.ov };
      const keys = [...aliasOf(name), ...Object.keys(derivedOf(name, '', false)).flatMap(aliasOf)];
      keys.forEach((k) => delete ov[k]);
      if (name === 'LCB_bằng_chữ' && 'Lương_Cơ_bản' in ov) ov.LCB_bằng_chữ = wordsOf(ov.Lương_Cơ_bản); // về lại "bằng chữ" theo mức lương đang sửa
      return { ...x, ov, wordsManual: name === 'LCB_bằng_chữ' || name === 'Lương_Cơ_bản' ? false : x.wordsManual };
    });
  const jump = (name: string) => {
    const el = aliasOf(name)
      .map((k) => paper.current?.querySelector<HTMLElement>(`[data-field="${CSS.escape(k)}"]`))
      .find(Boolean);
    if (!el) return;
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    setTimeout(() => el.focus(), 250);
  };

  // Trường trong mẫu đang xem + những trường còn trống
  const used = useMemo(() => {
    const s = new Set<string>();
    const re = new RegExp(`${MF_RE.source}|${FIELD_RE.source}`, 'gu');
    (lines || []).forEach((l) => {
      for (const m of l.text.matchAll(re)) s.add((m[1] ?? m[2]).normalize('NFC'));
    });
    return [...s];
  }, [lines]);
  const empty = used.filter((k) => k in job.data && !job.data[k].trim() && !OPTIONAL.has(k));
  const shownEdits = job.edited;

  const render = (text: string) => {
    const out: React.ReactNode[] = [];
    let last = 0;
    const re = new RegExp(`${MF_RE.source}|${FIELD_RE.source}`, 'gu');
    for (const m of text.matchAll(re)) {
      const name = (m[1] ?? m[2]).normalize('NFC');
      out.push(text.slice(last, m.index));
      out.push(
        name in job.data ? (
          <Editable key={`${m.index}:${name}:${job.data[name]}`} name={name} value={job.data[name]} edited={name in c.ov} empty={!job.data[name]} onCommit={(v) => commit(name, v)} />
        ) : (
          <span key={m.index} className="bg-rose-100 text-rose-700 rounded-sm px-0.5" title="Trường không có trong danh sách — không trộn được">
            «{name}»
          </span>
        ),
      );
      last = m.index! + m[0].length;
    }
    out.push(text.slice(last));
    return out;
  };

  const all = items.map(jobOf);
  const fileCount = all.reduce((n, j) => n + (j.main ? 1 + j.extras.length : 0), 0);
  const htmlCount = all.filter((j) => !j.main).length;
  const applyAll = () => {
    const t = tplOf(c.tpl);
    setCfg((p) =>
      Object.fromEntries(
        items.map((x) => {
          const fits = !t || !t.companyId || t.companyId === x.companyId;
          return [x.id, fits ? { ...p[x.id], tpl: c.tpl, app: c.app, appDate: c.appDate } : p[x.id]];
        }),
      ),
    );
  };
  const pageCount = all.reduce((n, j) => n + (j.main ? 1 + j.extras.length : 1), 0);
  const [printing, setPrinting] = useState(false);
  const printNow = async () => {
    setPrinting(true);
    try {
      const n = await printJobsDirect(all);
      notify?.(`Đã mở hộp thoại in: ${n} văn bản của ${all.length} hợp đồng${all.some((j) => j.edited.length) ? ', gồm phần đã sửa trên bản xem trước' : ''}`);
    } catch (e) {
      notify?.(`Không in được: ${(e as Error).message}`);
    } finally {
      setPrinting(false);
    }
  };
  const run = async () => {
    setBusy(true);
    try {
      await onPrint(all);
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const H = 'px-3 py-2 text-[11.5px] font-bold uppercase tracking-wide text-[#1e3a5f] bg-[#f3f6fa] border-y border-slate-200';
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/45 flex items-center justify-center p-3" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-label="In hợp đồng" className="w-[min(1320px,98vw)] h-[94vh] bg-white rounded-[4px] shadow-2xl border border-slate-300 flex flex-col overflow-hidden">
        {/* Tiêu đề */}
        <div className="h-11 shrink-0 flex items-center gap-2 px-4 bg-[#1e3a5f] text-white">
          <Printer size={16} />
          <span className="font-bold text-[14px]">In hợp đồng</span>
          <span className="text-[12px] text-slate-300">· {items.length} hợp đồng đã chọn · chọn mẫu in, xem trước và sửa thông tin trước khi tạo file Word</span>
          <button onClick={onClose} className="ml-auto p-1 rounded hover:bg-white/15 cursor-pointer" title="Đóng (Esc)">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 min-h-0 flex">
          {/* Cột trái: hợp đồng · mẫu in · còn trống · đã sửa */}
          <aside className="w-[310px] shrink-0 border-r border-slate-200 overflow-auto text-[12.5px]">
            <div className={H}>Hợp đồng đã chọn ({items.length})</div>
            <div className="max-h-[220px] overflow-auto">
              {items.map((x) => {
                const j = jobOf(x);
                return (
                  <button
                    key={x.id}
                    onClick={() => (setCur(x.id), setDocTab(''))}
                    className={`w-full text-left px-3 py-2 border-b border-slate-100 cursor-pointer ${x.id === it.id ? 'bg-[#eaf2fc] border-l-[3px] border-l-[#1f5fa8]' : 'hover:bg-slate-50 border-l-[3px] border-l-transparent'}`}
                  >
                    <div className="font-semibold text-slate-800 truncate">{x.title}</div>
                    <div className="text-[11.5px] text-slate-500 truncate">{x.sub}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px]">
                      <span className={`truncate ${j.main ? 'text-[#1f5fa8]' : 'text-amber-700'}`}>{j.main ? j.main.name : 'Bản in mặc định'}</span>
                      {j.edited.length > 0 && <span className="shrink-0 rounded bg-sky-100 text-sky-700 px-1">sửa {j.edited.length}</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className={H}>Mẫu in</div>
            <div className="p-3 space-y-2.5">
              <label className="block">
                <span className="text-slate-600">Loại template</span>
                <select
                  value={c.tpl}
                  onChange={(e) => (set(it.id, (x) => ({ ...x, tpl: e.target.value, app: '' })), setDocTab(''))}
                  className={`${erp.inputFull} mt-1`}
                  data-testid="print-tpl"
                >
                  <option value="">— Bản in mặc định (không dùng mẫu Word) —</option>
                  {options.map((g) => (
                    <optgroup key={g.label} label={g.label}>
                      {g.list.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                          {t.id === it.defaultTpl?.id ? ' (mặc định)' : ''}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>
              {job.main?.kind === 'PL' && (
                <>
                  <label className="block">
                    <span className="text-slate-600">Loại phụ lục</span>
                    <select value={job.app?.id || ''} onChange={(e) => set(it.id, (x) => ({ ...x, app: e.target.value }))} className={`${erp.inputFull} mt-1`}>
                      {cat.appendix
                        .filter((a) => job.main!.appliesTo.includes(a.id))
                        .map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.code} · {a.name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-slate-600">Ngày áp dụng</span>
                    <div className="mt-1">
                      <DateInput value={c.appDate} onChange={(v) => set(it.id, (x) => ({ ...x, appDate: v }))} />
                    </div>
                  </label>
                </>
              )}
              {job.main?.kind === 'HD' && it.attachments.length > 0 && (
                <div>
                  <div className="text-slate-600 mb-1">In kèm</div>
                  {it.attachments.map((t) => (
                    <label key={t.id} className="flex items-start gap-2 py-0.5 cursor-pointer">
                      <input type="checkbox" className="mt-0.5 accent-[#1f5fa8]" checked={!!c.kt[t.id]} onChange={(e) => set(it.id, (x) => ({ ...x, kt: { ...x.kt, [t.id]: e.target.checked } }))} />
                      <span>{t.name}</span>
                    </label>
                  ))}
                </div>
              )}
              {!job.main && <p className="text-[11.5px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">Không dùng mẫu Word → mở bản in mặc định (HTML). Phần sửa trên bản xem trước chỉ áp dụng cho mẫu Word.</p>}
              {items.length > 1 && (
                <Btn className="w-full h-7" icon={Check} onClick={applyAll} title="Dùng mẫu in này cho mọi hợp đồng đã chọn (bỏ qua hợp đồng khác công ty với mẫu)">
                  Áp dụng mẫu này cho cả {items.length} hợp đồng
                </Btn>
              )}
            </div>

            {job.main && (
              <>
                <div className={`${H} flex items-center gap-1.5`}>
                  <AlertTriangle size={12} className={empty.length ? 'text-rose-500' : 'text-slate-400'} /> Còn trống ({empty.length})
                </div>
                <div className="px-3 py-2">
                  {!empty.length ? (
                    <p className="text-[11.5px] text-emerald-700">Đã đủ thông tin trong mẫu đang xem.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {empty.map((k) => (
                        <button key={k} onClick={() => jump(k)} className="rounded border border-rose-200 bg-rose-50 text-rose-700 px-1.5 py-0.5 text-[11.5px] hover:bg-rose-100 cursor-pointer" title="Bấm để nhập trên bản xem trước">
                          {fieldLabel(k)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`${H} flex items-center`}>
                  <span>Đã sửa ({shownEdits.length})</span>
                  {shownEdits.length > 0 && (
                    <button onClick={() => reset()} className="ml-auto normal-case font-semibold text-[11.5px] text-[#1f5fa8] hover:underline cursor-pointer flex items-center gap-1">
                      <RotateCcw size={11} /> Khôi phục tất cả
                    </button>
                  )}
                </div>
                <div className="px-3 py-2 space-y-1.5" data-testid="print-edits">
                  {!shownEdits.length ? (
                    <p className="text-[11.5px] text-slate-500">Bấm vào chữ nền vàng trên bản xem trước để sửa. Phần sửa chỉ dùng cho lần in này, không đổi hồ sơ hợp đồng.</p>
                  ) : (
                    shownEdits.map((k) => (
                      <div key={k} className="group rounded border border-sky-200 bg-sky-50/60 px-2 py-1">
                        <div className="flex items-center gap-1">
                          <button onClick={() => jump(k)} className="font-semibold text-slate-700 hover:text-[#1f5fa8] cursor-pointer truncate text-left">
                            {fieldLabel(k)}
                          </button>
                          <button onClick={() => reset(k)} className="ml-auto text-slate-400 hover:text-rose-600 cursor-pointer" title="Khôi phục giá trị từ hồ sơ">
                            <Undo2 size={12} />
                          </button>
                        </div>
                        <div className="text-[11.5px] text-slate-400 line-through truncate">{base[k] || '(trống)'}</div>
                        <div className="text-[11.5px] text-sky-800 truncate">{c.ov[k] || '(để trống)'}</div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </aside>

          {/* Bản xem trước */}
          <main className="flex-1 min-w-0 flex flex-col bg-[#e9edf2]">
            <div className="h-10 shrink-0 flex items-center gap-1 px-3 bg-white border-b border-slate-200 overflow-x-auto">
              {docs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDocTab(d.id)}
                  title={d.name}
                  className={`h-7 px-3 shrink-0 max-w-[340px] whitespace-nowrap rounded-[3px] text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer border ${
                    d.id === doc?.id ? 'bg-[#1f5fa8] border-[#1f5fa8] text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FileText size={13} className="shrink-0" /> <span className="truncate">{KIND_PREFIX[d.kind]}: {d.name}</span>
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-auto p-5">
              {!doc ? (
                <div className="mx-auto max-w-[560px] mt-16 text-center text-slate-600 bg-white border border-slate-300 rounded p-8">
                  <Printer size={28} className="mx-auto text-slate-400 mb-2" />
                  <p className="font-semibold">Bản in mặc định</p>
                  <p className="text-[12.5px] mt-1">
                    {it.defaultTpl ? 'Đang chọn bản in mặc định.' : `Loại "${it.typeName}" chưa có mẫu Word.`} Chọn một mẫu ở cột bên trái để xem trước và sửa thông tin trước khi in.
                  </p>
                </div>
              ) : err ? (
                <p className="text-rose-600 text-center py-10">{err}</p>
              ) : !lines ? (
                <p className="text-slate-500 text-center py-10">Đang đọc mẫu…</p>
              ) : (
                <div
                  ref={paper}
                  data-testid="print-paper"
                  className="mx-auto w-full max-w-[820px] min-h-[1100px] bg-white shadow-md border border-slate-300 px-16 py-14 text-[14.5px] leading-[1.65] text-slate-900"
                  style={{ fontFamily: "'Times New Roman', Times, serif" }}
                >
                  {lines.map((l, i) =>
                    l.text.trim() ? (
                      <p key={i} className={`whitespace-pre-wrap ${l.center || l.table ? 'text-center' : l.right ? 'text-right' : 'text-justify'} ${l.bold ? 'font-bold' : ''} mb-1`}>
                        {render(l.text)}
                      </p>
                    ) : (
                      <div key={i} className="h-3" />
                    ),
                  )}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Chân */}
        <div className="h-12 shrink-0 flex items-center gap-2 px-4 border-t border-slate-200 bg-[#f7f9fc] text-[12px] text-slate-600">
          <span>
            Sẽ tạo <b>{fileCount}</b> file Word{fileCount > 1 ? ' (nén .zip)' : ''}
            {htmlCount ? ` · ${htmlCount} hợp đồng dùng bản in mặc định` : ''}
          </span>
          <span className="ml-auto text-[11.5px] text-slate-500 whitespace-nowrap hidden lg:block">
            <span className="bg-amber-100 px-1 rounded-sm">Nền vàng</span> bấm để sửa · <span className="bg-sky-100 border-b-2 border-sky-500 px-1">Nền xanh</span> đã sửa ·{' '}
            <span className="bg-rose-50 border-b border-dashed border-rose-400 px-1">Viền đỏ</span> còn trống
          </span>
          <span className="w-3" />
          <Btn onClick={onClose}>Huỷ</Btn>
          <Btn
            icon={FileSpreadsheet}
            onClick={() => {
              const name = exportMergeData(all);
              notify?.(`Đã tải dữ liệu trộn ${name}: ${all.length} hợp đồng${all.some((j) => j.edited.length) ? ', gồm phần đã sửa trên bản xem trước' : ''} — dùng làm nguồn Mail Merge trong Word`);
            }}
            title="Mỗi hợp đồng 1 dòng, mỗi trường trộn 1 cột (tên cột đúng tên trường trong mẫu Word) — dùng cho Mail Merge của Word"
          >
            Tải dữ liệu trộn (Excel)
          </Btn>
          <Btn icon={Printer} disabled={printing} onClick={printNow} title="In trực tiếp ra máy in (hoặc lưu PDF) đúng nội dung đang xem trước, gồm phần đã sửa" data-testid="print-direct">
            {printing ? 'Đang chuẩn bị…' : `In hợp đồng${pageCount > 1 ? ` (${pageCount})` : ''}`}
          </Btn>
          <Btn variant="primary" icon={FileDown} disabled={busy || (!fileCount && !htmlCount)} onClick={run}>
            {busy ? 'Đang tạo file…' : fileCount ? `Tải file Word${fileCount > 1 ? ` (${fileCount})` : ''}` : 'Mở bản in'}
          </Btn>
        </div>
      </div>
    </div>
  );
};
