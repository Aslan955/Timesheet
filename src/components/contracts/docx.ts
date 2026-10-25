/**
 * docx.ts — đọc / ghi file Word (.docx) ngay trên trình duyệt, không cần thư viện ngoài.
 *  - unzip / zip: đọc file zip (nén deflate hoặc không nén), ghi zip không nén (Word mở bình thường).
 *  - mergeDocx: trộn trường {{ten_truong}} trong document / header / footer (kể cả khi Word tách 1 trường ra nhiều đoạn chữ).
 *  - inspectDocx: liệt kê các trường trộn + nội dung đoạn văn để xem trước.
 *  - buildDocx: tạo file .docx đơn giản (dùng cho file mẫu).
 *  - soThanhChu: đọc số tiền bằng chữ.
 */
export type ZipEntry = { name: string; data: Uint8Array };
const td = new TextDecoder();
const te = new TextEncoder();

const inflateRaw = async (u: Uint8Array): Promise<Uint8Array> => {
  const stream = new Blob([u as BlobPart]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
};

export async function unzip(buf: ArrayBuffer | Uint8Array): Promise<ZipEntry[]> {
  const u = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  const dv = new DataView(u.buffer, u.byteOffset, u.byteLength);
  let e = -1;
  for (let i = u.length - 22; i >= Math.max(0, u.length - 65557); i--)
    if (dv.getUint32(i, true) === 0x06054b50) {
      e = i;
      break;
    }
  if (e < 0) throw new Error('File không đúng định dạng Word (.docx)');
  const n = dv.getUint16(e + 10, true);
  let p = dv.getUint32(e + 16, true);
  const out: ZipEntry[] = [];
  for (let k = 0; k < n; k++) {
    if (dv.getUint32(p, true) !== 0x02014b50) throw new Error('File .docx bị hỏng');
    const method = dv.getUint16(p + 10, true);
    const csize = dv.getUint32(p + 20, true);
    const nlen = dv.getUint16(p + 28, true);
    const xlen = dv.getUint16(p + 30, true);
    const clen = dv.getUint16(p + 32, true);
    const off = dv.getUint32(p + 42, true);
    const name = td.decode(u.subarray(p + 46, p + 46 + nlen));
    p += 46 + nlen + xlen + clen;
    if (name.endsWith('/')) continue;
    const start = off + 30 + dv.getUint16(off + 26, true) + dv.getUint16(off + 28, true);
    const raw = u.subarray(start, start + csize);
    if (method === 0) out.push({ name, data: raw.slice() });
    else if (method === 8) out.push({ name, data: await inflateRaw(raw) });
    else throw new Error(`Kiểu nén ${method} không hỗ trợ`);
  }
  return out;
}

const CRC_T = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
const crc32 = (u: Uint8Array) => {
  let c = 0xffffffff;
  for (let i = 0; i < u.length; i++) c = CRC_T[(c ^ u[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

/** Ghi zip (không nén). */
export function zip(entries: ZipEntry[]): Uint8Array {
  const d = new Date();
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
  const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let off = 0;
  for (const e of entries) {
    const name = te.encode(e.name);
    const crc = crc32(e.data);
    const sz = e.data.length;
    const lh = new Uint8Array(30 + name.length);
    const v = new DataView(lh.buffer);
    v.setUint32(0, 0x04034b50, true);
    v.setUint16(4, 20, true);
    v.setUint16(6, 0x0800, true);
    v.setUint16(8, 0, true);
    v.setUint16(10, time, true);
    v.setUint16(12, date, true);
    v.setUint32(14, crc, true);
    v.setUint32(18, sz, true);
    v.setUint32(22, sz, true);
    v.setUint16(26, name.length, true);
    lh.set(name, 30);
    parts.push(lh, e.data);
    const ch = new Uint8Array(46 + name.length);
    const w = new DataView(ch.buffer);
    w.setUint32(0, 0x02014b50, true);
    w.setUint16(4, 20, true);
    w.setUint16(6, 20, true);
    w.setUint16(8, 0x0800, true);
    w.setUint16(12, time, true);
    w.setUint16(14, date, true);
    w.setUint32(16, crc, true);
    w.setUint32(20, sz, true);
    w.setUint32(24, sz, true);
    w.setUint16(28, name.length, true);
    w.setUint32(42, off, true);
    ch.set(name, 46);
    central.push(ch);
    off += lh.length + sz;
  }
  const cdSize = central.reduce((s, c) => s + c.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, off, true);
  const all = [...parts, ...central, eocd];
  const out = new Uint8Array(all.reduce((s, c) => s + c.length, 0));
  let p = 0;
  all.forEach((c) => (out.set(c, p), (p += c.length)));
  return out;
}

// ==========================================================================
// Trộn trường: (1) trường Word MERGEFIELD «Tên_trường» (file trộn thư của Word) · (2) văn bản {{Tên_trường}}
// ==========================================================================
const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const XML_NS = 'http://www.w3.org/XML/1998/namespace';
/** {{Tên_trường}} — tên gồm chữ (kể cả tiếng Việt có dấu), số, gạch dưới. */
export const FIELD_RE = /\{\{\s*([\p{L}\p{N}_]+)\s*\}\}/gu;
/** Đánh dấu vị trí trường Word trong văn bản xem trước. */
export const MF_RE = /([^]+)/g;
const MERGE_PARTS = /^word\/(document|header\d*|footer\d*|footnotes|endnotes)\.xml$/;
const nfc = (s: string) => s.normalize('NFC');
/** Tên trường của mã lệnh Word: ' MERGEFIELD Họ_và_tên \* MERGEFORMAT ' → 'Họ_và_tên'. */
const mergeName = (instr: string): string | null => {
  // tên dừng ở khoảng trắng hoặc dấu \ của phần định dạng (vd 'MERGEFIELD Lương_Cơ_bản\#,###,##0')
  const m = instr.match(/^\s*MERGEFIELD\s+(?:"([^"]+)"|([^\s\\]+))/i);
  return m ? nfc((m[1] ?? m[2]).trim()) : null;
};

/** Đoạn văn chứa node — bỏ qua các node thuộc đoạn văn lồng bên trong (vd hộp văn bản). */
const ownP = (n: Node): Element | null => {
  let x = n.parentNode;
  while (x && !(x.nodeType === 1 && (x as Element).localName === 'p' && (x as Element).namespaceURI === W)) x = x.parentNode;
  return x as Element | null;
};
const paras = (doc: Document) => Array.from(doc.getElementsByTagNameNS(W, 'p'));
const textsOf = (p: Element) => Array.from(p.getElementsByTagNameNS(W, 't')).filter((t) => ownP(t) === p);
const kids = (el: Element, name: string) => Array.from(el.childNodes).filter((n): n is Element => n.nodeType === 1 && (n as Element).localName === name);
const runText = (r: Element) =>
  Array.from(r.childNodes)
    .filter((n): n is Element => n.nodeType === 1)
    .map((n) => (n.localName === 't' ? n.textContent || '' : n.localName === 'tab' ? '\t' : n.localName === 'br' || n.localName === 'cr' ? '\n' : ''))
    .join('');

type Fld = { name: string | null; nodes: Element[]; fmt: Element | null; result: string };
type Seg = string | Fld;
/** Duyệt 1 đoạn văn → chữ thường + trường Word (trường phức hợp fldChar begin…separate…end, hoặc trường đơn fldSimple). */
function walk(p: Element): Seg[] {
  const items: Element[] = [];
  const visit = (el: Element) => {
    for (const c of Array.from(el.childNodes)) {
      if (c.nodeType !== 1) continue;
      const e = c as Element;
      if (e.localName === 'p') continue;
      if (e.localName === 'r' || e.localName === 'fldSimple') items.push(e);
      else visit(e);
    }
  };
  visit(p);
  const out: Seg[] = [];
  const stack: { f: Fld; instr: string; phase: 'instr' | 'result' }[] = [];
  for (const el of items) {
    const outer = stack[0];
    if (el.localName === 'fldSimple') {
      const runs = Array.from(el.getElementsByTagNameNS(W, 'r'));
      const res = runs.map(runText).join('');
      if (outer) {
        outer.f.nodes.push(el);
        if (outer.phase === 'result') outer.f.result += res;
      } else out.push({ name: mergeName(el.getAttributeNS(W, 'instr') || el.getAttribute('w:instr') || ''), nodes: [el], fmt: runs[0] || null, result: res });
      continue;
    }
    const type = kids(el, 'fldChar')[0]?.getAttributeNS(W, 'fldCharType') || kids(el, 'fldChar')[0]?.getAttribute('w:fldCharType');
    if (!outer && type !== 'begin') {
      out.push(runText(el));
      continue;
    }
    if (type === 'begin') {
      if (outer) outer.f.nodes.push(el);
      stack.push({ f: { name: null, nodes: [el], fmt: null, result: '' }, instr: '', phase: 'instr' });
      continue;
    }
    outer.f.nodes.push(el);
    const cur = stack[stack.length - 1];
    if (type === 'separate') cur.phase = 'result';
    else if (type === 'end') {
      const done = stack.pop()!;
      if (!stack.length) out.push({ ...done.f, name: mergeName(done.instr) });
    } else if (kids(el, 'instrText').length) {
      if (stack.length === 1 && cur.phase === 'instr') cur.instr += kids(el, 'instrText').map((x) => x.textContent || '').join('');
    } else if (outer.phase === 'result') {
      outer.f.result += runText(el);
      if (!outer.f.fmt && kids(el, 't').length) outer.f.fmt = el;
    }
  }
  if (stack.length) out.push(stack[0].f.result); // trường kéo dài sang đoạn khác: giữ nguyên
  return out;
}

/** Thêm chữ vào run (xuống dòng → <w:br/>). */
const fillRun = (doc: Document, r: Element, text: string) => {
  text.split('\n').forEach((ln, i) => {
    if (i) r.appendChild(doc.createElementNS(W, 'w:br'));
    const t = doc.createElementNS(W, 'w:t');
    t.setAttributeNS(XML_NS, 'xml:space', 'preserve');
    t.textContent = ln;
    r.appendChild(t);
  });
};

function mergeXml(xml: string, data: Record<string, string>): string {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  for (const p of paras(doc)) {
    // (1) trường Word MERGEFIELD → thay bằng chữ, giữ định dạng của phần hiển thị «...»
    for (const s of walk(p)) {
      if (typeof s === 'string' || !s.name || !(s.name in data)) continue;
      const first = s.nodes[0];
      const fmt = s.fmt || s.nodes.find((n) => n.localName === 'r');
      const nr = doc.createElementNS(W, 'w:r');
      const rPr = fmt ? kids(fmt, 'rPr')[0] : undefined;
      if (rPr) nr.appendChild(rPr.cloneNode(true));
      fillRun(doc, nr, data[s.name]);
      first.parentNode!.insertBefore(nr, first);
      s.nodes.forEach((n) => n.parentNode?.removeChild(n));
    }
    // (2) {{Tên_trường}} gõ trong văn bản (kể cả khi Word tách ra nhiều đoạn chữ)
    const ts = textsOf(p);
    if (!ts.length) continue;
    const texts = ts.map((t) => t.textContent || '');
    const full = texts.join('');
    if (!full.includes('{{')) continue;
    const ms = [...full.matchAll(FIELD_RE)].filter((m) => nfc(m[1]) in data);
    if (!ms.length) continue;
    // xử lý từ cuối về đầu → vị trí các trường phía trước không bị lệch
    for (const m of ms.reverse()) {
      const s = m.index!;
      const e = s + m[0].length;
      const lens = texts.map((x) => x.length);
      let a = 0;
      let placed = false;
      for (let i = 0; i < texts.length; i++) {
        const b = a + lens[i];
        if (b > s && a < e) {
          const cutA = Math.max(s, a) - a;
          const cutB = Math.min(e, b) - a;
          texts[i] = texts[i].slice(0, cutA) + (placed ? '' : data[nfc(m[1])] ?? '') + texts[i].slice(cutB);
          placed = true;
        }
        a = b;
      }
    }
    ts.forEach((t, i) => {
      if (t.textContent === texts[i]) return;
      t.setAttributeNS(XML_NS, 'xml:space', 'preserve');
      const lines = texts[i].split('\n');
      t.textContent = lines[0];
      let ref: Node = t;
      for (const ln of lines.slice(1)) {
        const br = doc.createElementNS(W, 'w:br');
        const nt = doc.createElementNS(W, 'w:t');
        nt.setAttributeNS(XML_NS, 'xml:space', 'preserve');
        nt.textContent = ln;
        ref.parentNode!.insertBefore(br, ref.nextSibling);
        br.parentNode!.insertBefore(nt, br.nextSibling);
        ref = nt;
      }
    });
  }
  return new XMLSerializer().serializeToString(doc);
}

/** Bỏ liên kết nguồn dữ liệu trộn thư (file Excel) — nếu không Word sẽ hỏi chạy lệnh SQL khi mở file. */
const stripMailMerge = (e: ZipEntry): ZipEntry =>
  e.name === 'word/settings.xml'
    ? { name: e.name, data: te.encode(td.decode(e.data).replace(/<w:mailMerge>[\s\S]*?<\/w:mailMerge>/, '')) }
    : e.name === 'word/_rels/settings.xml.rels'
      ? { name: e.name, data: te.encode(td.decode(e.data).replace(/<Relationship\b[^>]*(mailMergeSource|recipientData)[^>]*\/>/g, '')) }
      : e;

/** Trộn dữ liệu vào file Word mẫu → file Word mới (chữ thường, không còn trường). Trường không có dữ liệu được giữ nguyên. */
export async function mergeDocx(tpl: Uint8Array, data: Record<string, string>): Promise<Uint8Array> {
  const es = await unzip(tpl);
  const d: Record<string, string> = {};
  Object.entries(data).forEach(([k, v]) => (d[nfc(k)] = v));
  return zip(es.map((e) => stripMailMerge(MERGE_PARTS.test(e.name) ? { name: e.name, data: te.encode(mergeXml(td.decode(e.data), d)) } : e)));
}

export type DocLine = { text: string; center?: boolean; right?: boolean; bold?: boolean; table?: boolean };
export type FieldUse = { name: string; kind: 'word' | 'text' };
/** Đọc trường trộn (trường Word + {{...}}) và các đoạn văn để xem trước. Vị trí trường Word được đánh dấu bằng MF_RE. */
export async function inspectDocx(bytes: Uint8Array): Promise<{ fields: string[]; uses: FieldUse[]; lines: DocLine[]; mailMerge: boolean }> {
  const es = await unzip(bytes);
  const main = es.find((e) => e.name === 'word/document.xml');
  if (!main) throw new Error('File không có nội dung văn bản Word (thiếu word/document.xml)');
  const uses = new Map<string, FieldUse>();
  let lines: DocLine[] = [];
  for (const e of es.filter((x) => MERGE_PARTS.test(x.name))) {
    const doc = new DOMParser().parseFromString(td.decode(e.data), 'application/xml');
    if (doc.getElementsByTagName('parsererror').length) throw new Error(`Không đọc được ${e.name}`);
    for (const p of paras(doc)) {
      const segs = walk(p);
      segs.forEach((s) => typeof s !== 'string' && s.name && !uses.has(s.name) && uses.set(s.name, { name: s.name, kind: 'word' }));
      const text = segs.map((s) => (typeof s === 'string' ? s : s.name ? `${s.name}` : s.result)).join('');
      for (const m of text.matchAll(FIELD_RE)) if (!uses.has(nfc(m[1]))) uses.set(nfc(m[1]), { name: nfc(m[1]), kind: 'text' });
      if (e === main) {
        const jc = Array.from(p.getElementsByTagNameNS(W, 'jc')).find((x) => ownP(x) === p)?.getAttributeNS(W, 'val');
        const b = Array.from(p.getElementsByTagNameNS(W, 'b')).some((x) => ownP(x) === p && x.getAttributeNS(W, 'val') !== '0' && x.getAttributeNS(W, 'val') !== 'false');
        let inTbl = false;
        for (let x = p.parentNode; x; x = x.parentNode) if ((x as Element).localName === 'tbl') inTbl = true;
        lines.push({ text, center: jc === 'center', right: jc === 'right' || jc === 'end', bold: b, table: inTbl });
      }
    }
  }
  if (lines.length > 600) lines = lines.slice(0, 600);
  const settings = es.find((e) => e.name === 'word/settings.xml');
  return { fields: [...uses.keys()], uses: [...uses.values()], lines, mailMerge: !!settings && td.decode(settings.data).includes('<w:mailMerge>') };
}

// ==========================================================================
// Tạo file .docx đơn giản (file mẫu)
// ==========================================================================
export type BuildPara = { t: string; b?: boolean; i?: boolean; c?: boolean; r?: boolean; j?: boolean; sz?: number; after?: number; u?: boolean };
export type BuildBlock = BuildPara | { cols: BuildPara[][] };
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pXml = (p: BuildPara): string =>
  // nhiều dòng → mỗi dòng 1 đoạn (tránh dòng bị giãn chữ khi căn đều)
  p.t.includes('\n')
    ? p.t
        .split('\n')
        .map((ln, i, arr) => pXml({ ...p, t: ln, after: i === arr.length - 1 ? p.after : 0 }))
        .join('')
    : `<w:p><w:pPr>${p.c ? '<w:jc w:val="center"/>' : p.r ? '<w:jc w:val="right"/>' : p.j ? '<w:jc w:val="both"/>' : ''}<w:spacing w:after="${p.after ?? 60}"/></w:pPr><w:r><w:rPr>${p.b ? '<w:b/>' : ''}${p.i ? '<w:i/>' : ''}${p.u ? '<w:u w:val="single"/>' : ''}${
        p.sz ? `<w:sz w:val="${p.sz}"/><w:szCs w:val="${p.sz}"/>` : ''
      }</w:rPr><w:t xml:space="preserve">${esc(p.t)}</w:t></w:r></w:p>`;
export function buildDocx(blocks: BuildBlock[]): Uint8Array {
  const body = blocks
    .map((bl) =>
      'cols' in bl
        ? `<w:tbl><w:tblPr><w:tblW w:w="5000" w:type="pct"/><w:tblLook w:val="0000"/></w:tblPr><w:tblGrid>${bl.cols.map(() => '<w:gridCol w:w="4600"/>').join('')}</w:tblGrid><w:tr>${bl.cols
            .map((col) => `<w:tc><w:tcPr><w:tcW w:w="${Math.floor(5000 / bl.cols.length)}" w:type="pct"/></w:tcPr>${col.map(pXml).join('') || '<w:p/>'}</w:tc>`)
            .join('')}</w:tr></w:tbl>`
        : pXml(bl),
    )
    .join('');
  const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="${W}"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1701" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="${W}"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="26"/><w:szCs w:val="26"/><w:lang w:val="vi-VN"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="60" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults></w:styles>`;
  const ct = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;
  const drels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
  return zip([
    { name: '[Content_Types].xml', data: te.encode(ct) },
    { name: '_rels/.rels', data: te.encode(rels) },
    { name: 'word/document.xml', data: te.encode(doc) },
    { name: 'word/_rels/document.xml.rels', data: te.encode(drels) },
    { name: 'word/styles.xml', data: te.encode(styles) },
  ]);
}

export const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const downloadBytes = (data: Uint8Array, name: string, type = DOCX_MIME) => {
  const url = URL.createObjectURL(new Blob([data as BlobPart], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

// ==========================================================================
// Đọc số bằng chữ (tiếng Việt)
// ==========================================================================
const DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const read3 = (n: number, full: boolean) => {
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const u = n % 10;
  const out: string[] = [];
  if (h || full) out.push(`${DIGITS[h]} trăm`);
  if (t > 1) out.push(`${DIGITS[t]} mươi`);
  else if (t === 1) out.push('mười');
  else if ((h || full) && u) out.push('lẻ');
  if (u) out.push(t > 1 && u === 1 ? 'mốt' : t >= 1 && u === 5 ? 'lăm' : DIGITS[u]);
  return out.join(' ');
};
export const soThanhChu = (value: number) => {
  let n = Math.round(Math.abs(value));
  if (!n) return 'Không đồng';
  const units = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ'];
  const groups: number[] = [];
  while (n > 0) {
    groups.push(n % 1000);
    n = Math.floor(n / 1000);
  }
  const words: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) {
    if (!groups[i]) continue;
    words.push(read3(groups[i], i < groups.length - 1) + units[i]);
  }
  const s = words.join(' ').replace(/\s+/g, ' ').trim();
  return `${s.charAt(0).toUpperCase()}${s.slice(1)} đồng`;
};
