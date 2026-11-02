/**
 * Soạn nội dung có định dạng (mail, box sinh nhật) (đậm, nghiêng, gạch chân, gạch ngang, màu chữ, cỡ chữ, danh sách, căn lề, link).
 * Nội dung lưu dạng HTML đã lọc (chỉ giữ thẻ/kiểu an toàn); nội dung cũ dạng chữ thường tự chuyển sang HTML.
 */
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Baseline, Bold, Check, ChevronDown, Italic, Link2, List, ListOrdered, RemoveFormatting, Strikethrough, Underline } from 'lucide-react';
import { MarcomEmployee, fillTemplate } from './marcomData';
import { useMarcomLang } from './i18n';

/** Kiểu hiển thị chung cho ô soạn và bản xem trước mail (Tailwind reset mất kiểu list/link). */
export const RICH_CLS = '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-[#1f5fa8] [&_a]:underline break-words';
const VAR_CLS = 'px-1 mx-px rounded-[3px] border border-[#b9d3f0] bg-[#eaf2fc] text-[#1f5fa8] font-mono text-[0.85em]';

const KEEP_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'DEL', 'BR', 'DIV', 'P', 'UL', 'OL', 'LI', 'A', 'SPAN', 'FONT']);
const DROP_TAGS = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'HEAD', 'META', 'LINK', 'TITLE', 'SVG', 'MATH', 'TEMPLATE', 'NOSCRIPT', 'IMG', 'VIDEO', 'AUDIO', 'FORM', 'INPUT', 'BUTTON', 'TEXTAREA', 'SELECT']);
const KEEP_STYLES = ['color', 'text-align', 'font-size', 'font-weight', 'font-style', 'text-decoration', 'text-decoration-line'];
const SAFE_HREF = /^(https?:\/\/|mailto:)/i;
const ZWSP = '\u200B';

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Nội dung chữ thường (chưa có thẻ HTML) → HTML, giữ xuống dòng. */
export const toHtml = (body: string) => (/<[a-z][\s\S]*>/i.test(body) ? body : escapeHtml(body).replace(/\n/g, '<br>'));

type TextFn = (text: string, doc: Document) => Node[];
const cleanNode = (n: Node, doc: Document, onText?: TextFn): Node[] => {
  if (n.nodeType === Node.TEXT_NODE) {
    const text = (n.textContent ?? '').split(ZWSP).join('');
    return onText ? onText(text, doc) : [doc.createTextNode(text)];
  }
  if (n.nodeType !== Node.ELEMENT_NODE) return [];
  const src = n as HTMLElement;
  if (DROP_TAGS.has(src.tagName)) return [];
  const kids = Array.from(src.childNodes).flatMap((c) => cleanNode(c, doc, onText));
  if (!KEEP_TAGS.has(src.tagName)) return kids; // thẻ lạ: bỏ thẻ, giữ chữ
  if (src.tagName === 'A' && !SAFE_HREF.test(src.getAttribute('href') ?? '')) return kids;
  const out = doc.createElement(src.tagName === 'FONT' ? 'span' : src.tagName.toLowerCase());
  KEEP_STYLES.forEach((k) => {
    const v = src.style.getPropertyValue(k);
    if (v && !/url\(|expression/i.test(v)) out.style.setProperty(k, v);
  });
  if (src.tagName === 'FONT' && src.getAttribute('color')) out.style.color = src.getAttribute('color')!;
  if (src.tagName === 'A') {
    out.setAttribute('href', src.getAttribute('href')!);
    out.setAttribute('target', '_blank');
    out.setAttribute('rel', 'noopener noreferrer');
  }
  kids.forEach((k) => out.appendChild(k));
  return [out];
};
const transform = (html: string, onText?: TextFn) => {
  const parsed = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const box = document.createElement('div');
  Array.from(parsed.body.childNodes).flatMap((c) => cleanNode(c, document, onText)).forEach((c) => box.appendChild(c));
  return box.innerHTML;
};
export const sanitizeHtml = (html: string) => transform(html);

/** HTML của thân mail: có nhân sự → điền biến; không có → biến hiện dạng thẻ xanh (chế độ template). */
export const renderMailHtml = (body: string, e?: MarcomEmployee) =>
  transform(toHtml(body), (text, doc) => {
    if (e) return [doc.createTextNode(text.replace(/\{\{\w+\}\}/g, (m) => fillTemplate(m, e)))];
    return text.split(/(\{\{\w+\}\})/g).filter(Boolean).map((part) => {
      if (!/^\{\{\w+\}\}$/.test(part)) return doc.createTextNode(part);
      const chip = doc.createElement('span');
      chip.className = VAR_CLS;
      chip.textContent = part;
      return chip;
    });
  });

export const MailHtml: React.FC<{ body: string; e?: MarcomEmployee }> = ({ body, e }) => (
  <div className={RICH_CLS} dangerouslySetInnerHTML={{ __html: renderMailHtml(body, e) }} />
);

/** Hiển thị nội dung có định dạng không có biến (box sinh nhật). */
export const RichHtml: React.FC<{ html: string; inline?: boolean; className?: string }> = ({ html, inline = false, className = '' }) =>
  React.createElement(inline ? 'span' : 'div', { className: `${RICH_CLS} ${className}`, dangerouslySetInnerHTML: { __html: sanitizeHtml(toHtml(html)) } });

// ---------------------------------------------------------------------------
const COLORS = ['#334155', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#1f5fa8', '#7c3aed', '#db2777'];
const SIZES = [10, 11, 12, 13, 14, 16, 18, 20, 24, 28, 32];
const STATE_CMDS = ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList', 'justifyCenter', 'justifyRight'] as const;

export interface RichTextHandle {
  /** Chèn chữ tại vị trí con trỏ (hoặc cuối nội dung nếu chưa đặt con trỏ). */
  insertText: (text: string) => void;
}

export const RichTextEditor = forwardRef<RichTextHandle, { value: string; onChange: (html: string) => void; compact?: boolean }>(({ value, onChange, compact = false }, handle) => {
  const { tr } = useMarcomLang();
  const ref = useRef<HTMLDivElement>(null);
  const last = useRef<string | null>(null); // HTML vừa phát ra → không ghi đè lại (giữ con trỏ)
  const range = useRef<Range | null>(null);
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [pop, setPop] = useState<'color' | 'size' | 'link' | null>(null);
  const [url, setUrl] = useState('https://');
  const [curSize, setCurSize] = useState<number | null>(null); // cỡ chữ tại con trỏ (px)

  useEffect(() => {
    const el = ref.current;
    if (el && value !== last.current) {
      el.innerHTML = sanitizeHtml(toHtml(value));
      last.current = value;
    }
  }, [value]);

  useEffect(() => {
    const onSel = () => {
      const sel = document.getSelection();
      const el = ref.current;
      if (!sel || !sel.rangeCount || !el || !el.contains(sel.anchorNode)) return;
      range.current = sel.getRangeAt(0).cloneRange();
      setActive(Object.fromEntries(STATE_CMDS.map((c) => [c, document.queryCommandState(c)])));
      const at = sel.anchorNode?.nodeType === Node.TEXT_NODE ? sel.anchorNode.parentElement : (sel.anchorNode as HTMLElement | null);
      setCurSize(at ? Math.round(parseFloat(getComputedStyle(at).fontSize)) : null);
    };
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
  }, []);

  // execCommand('fontSize') chỉ nhận cấp 1–7 → đánh dấu bằng cấp 7 rồi đổi sang cỡ px
  const fixFonts = (px: string) =>
    ref.current?.querySelectorAll<HTMLElement>('font[size="7"]').forEach((f) => {
      const span = document.createElement('span');
      span.style.fontSize = px;
      while (f.firstChild) span.appendChild(f.firstChild);
      f.replaceWith(span);
    });
  const emit = () => {
    const el = ref.current;
    if (!el) return;
    last.current = el.innerHTML;
    onChange(el.innerHTML);
  };
  const restore = () => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const sel = document.getSelection();
    if (!sel) return;
    let r = range.current;
    if (!r || !el.contains(r.startContainer)) {
      r = document.createRange();
      r.selectNodeContents(el);
      r.collapse(false);
    }
    sel.removeAllRanges();
    sel.addRange(r);
  };
  const exec = (cmd: string, arg?: string, css = false) => {
    restore();
    document.execCommand('styleWithCSS', false, String(css));
    document.execCommand(cmd, false, arg);
    emit();
    setPop(null);
  };
  const setSize = (px: string) => {
    restore();
    const sel = document.getSelection();
    if (sel && sel.isCollapsed && sel.rangeCount) {
      // Chưa bôi đen: chèn vùng cỡ mới (giữ chỗ bằng ký tự rỗng) và đặt con trỏ vào trong để chữ gõ tiếp nhận cỡ này
      const span = document.createElement('span');
      span.style.fontSize = px;
      span.textContent = ZWSP;
      const r = sel.getRangeAt(0);
      r.insertNode(span);
      r.setStart(span.firstChild!, 1);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
    } else {
      document.execCommand('styleWithCSS', false, 'false');
      document.execCommand('fontSize', false, '7');
      fixFonts(px);
    }
    setCurSize(parseInt(px, 10));
    emit();
    setPop(null);
  };
  const applyLink = () => {
    const href = url.trim();
    if (!SAFE_HREF.test(href)) return;
    restore();
    const sel = document.getSelection();
    if (sel && sel.isCollapsed) document.execCommand('insertHTML', false, `<a href="${escapeHtml(href)}">${escapeHtml(href)}</a>`);
    else document.execCommand('createLink', false, href);
    emit();
    setPop(null);
  };

  useImperativeHandle(handle, () => ({
    insertText: (text: string) => {
      restore();
      document.execCommand('insertText', false, text);
      emit();
    },
  }));

  const btn = (on: boolean) =>
    `h-7 min-w-7 px-1.5 inline-flex items-center justify-center gap-1 rounded-[3px] text-[12px] cursor-pointer transition-colors ${on ? 'bg-[#dbe9fa] text-[#1f5fa8]' : 'text-slate-600 hover:bg-slate-200/70'}`;
  // onMouseDown chặn mất vùng chọn khi bấm nút trên thanh công cụ
  const Tool: React.FC<{ title: string; on?: boolean; onClick: () => void; children: React.ReactNode }> = ({ title, on = false, onClick, children }) => (
    <button type="button" title={title} aria-pressed={on} onMouseDown={(ev) => ev.preventDefault()} onClick={onClick} className={btn(on)}>
      {children}
    </button>
  );
  const sep = <span className="w-px h-5 bg-slate-300 mx-0.5" />;

  return (
    <div className="border border-slate-300 rounded-[3px] bg-white focus-within:border-[#1f5fa8] focus-within:ring-2 focus-within:ring-[#1f5fa8]/15" data-testid="rich-editor">
      <div className="relative flex flex-wrap items-center gap-0.5 px-1 py-1 border-b border-slate-200 bg-slate-50 rounded-t-[3px]">
        <Tool title={tr('Đậm (Ctrl+B)', 'Bold (Ctrl+B)')} on={active.bold} onClick={() => exec('bold')}>
          <Bold size={14} />
        </Tool>
        <Tool title={tr('Nghiêng (Ctrl+I)', 'Italic (Ctrl+I)')} on={active.italic} onClick={() => exec('italic')}>
          <Italic size={14} />
        </Tool>
        <Tool title={tr('Gạch chân (Ctrl+U)', 'Underline (Ctrl+U)')} on={active.underline} onClick={() => exec('underline')}>
          <Underline size={14} />
        </Tool>
        <Tool title={tr('Gạch ngang', 'Strikethrough')} on={active.strikeThrough} onClick={() => exec('strikeThrough')}>
          <Strikethrough size={14} />
        </Tool>
        {sep}
        <Tool title={tr('Màu chữ', 'Text color')} on={pop === 'color'} onClick={() => setPop(pop === 'color' ? null : 'color')}>
          <Baseline size={14} />
        </Tool>
        <Tool title={tr('Cỡ chữ', 'Font size')} on={pop === 'size'} onClick={() => setPop(pop === 'size' ? null : 'size')}>
          <span className="w-9 text-left tabular-nums" data-testid="rich-size">{curSize ?? (compact ? 14 : 13)}px</span>
          <ChevronDown size={12} />
        </Tool>
        {sep}
        <Tool title={tr('Danh sách dấu chấm', 'Bulleted list')} on={active.insertUnorderedList} onClick={() => exec('insertUnorderedList')}>
          <List size={14} />
        </Tool>
        <Tool title={tr('Danh sách đánh số', 'Numbered list')} on={active.insertOrderedList} onClick={() => exec('insertOrderedList')}>
          <ListOrdered size={14} />
        </Tool>
        {sep}
        <Tool title={tr('Căn trái', 'Align left')} on={!active.justifyCenter && !active.justifyRight} onClick={() => exec('justifyLeft')}>
          <AlignLeft size={14} />
        </Tool>
        <Tool title={tr('Căn giữa', 'Align center')} on={active.justifyCenter} onClick={() => exec('justifyCenter')}>
          <AlignCenter size={14} />
        </Tool>
        <Tool title={tr('Căn phải', 'Align right')} on={active.justifyRight} onClick={() => exec('justifyRight')}>
          <AlignRight size={14} />
        </Tool>
        {sep}
        <Tool title={tr('Chèn link', 'Insert link')} on={pop === 'link'} onClick={() => (setUrl('https://'), setPop(pop === 'link' ? null : 'link'))}>
          <Link2 size={14} />
        </Tool>
        <Tool title={tr('Xoá định dạng', 'Clear formatting')} onClick={() => (exec('removeFormat'), exec('unlink'))}>
          <RemoveFormatting size={14} />
        </Tool>

        {pop === 'color' && (
          <div className="absolute left-1 top-full mt-1 z-20 p-2 bg-white border border-slate-300 rounded-[4px] shadow-lg flex gap-1.5" onMouseDown={(ev) => ev.preventDefault()}>
            {COLORS.map((c, i) => (
              <button
                key={c}
                type="button"
                title={i === 0 ? tr('Màu mặc định', 'Default color') : c}
                onClick={() => exec('foreColor', c, true)}
                className="w-6 h-6 rounded-full border border-white ring-1 ring-slate-300 hover:ring-2 hover:ring-[#1f5fa8] cursor-pointer"
                style={{ background: c }}
              />
            ))}
          </div>
        )}
        {pop === 'size' && (
          <div className="absolute left-32 top-full mt-1 z-20 py-1 w-28 max-h-64 overflow-y-auto bg-white border border-slate-300 rounded-[4px] shadow-lg" onMouseDown={(ev) => ev.preventDefault()}>
            {SIZES.map((n) => (
              <button key={n} type="button" onClick={() => setSize(`${n}px`)} className="w-full flex items-center gap-2 px-2.5 py-0.5 hover:bg-slate-100 text-slate-700 cursor-pointer">
                <Check size={12} className={curSize === n ? 'text-[#1f5fa8]' : 'invisible'} />
                <span style={{ fontSize: Math.min(n, 22) }}>{n}px</span>
              </button>
            ))}
          </div>
        )}
        {pop === 'link' && (
          <div className="absolute right-1 top-full mt-1 z-20 p-2 w-80 bg-white border border-slate-300 rounded-[4px] shadow-lg">
            <div className="flex gap-1.5">
              <input
                autoFocus
                value={url}
                onChange={(ev) => setUrl(ev.target.value)}
                onKeyDown={(ev) => (ev.key === 'Enter' ? (ev.preventDefault(), applyLink()) : ev.key === 'Escape' && setPop(null))}
                placeholder="https://..."
                className="flex-1 h-7 px-2 border border-slate-300 rounded-[3px] text-[12px] outline-none focus:border-[#1f5fa8]"
              />
              <button
                type="button"
                disabled={!SAFE_HREF.test(url.trim())}
                onClick={applyLink}
                className="h-7 px-2.5 rounded-[3px] bg-[#1f5fa8] text-white text-[12px] font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-default"
              >
                {tr('Gắn', 'Apply')}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {tr('Bôi đen chữ trước để gắn link; không bôi đen thì chèn chính đường link. Chỉ nhận http(s):// hoặc mailto:', 'Select text first to link it; with no selection the URL itself is inserted. Only http(s):// or mailto: links.')}
            </p>
          </div>
        )}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        onInput={emit}
        onFocus={() => setPop(null)}
        onPaste={(ev) => {
          ev.preventDefault();
          const html = ev.clipboardData.getData('text/html');
          if (html) document.execCommand('insertHTML', false, sanitizeHtml(html));
          else document.execCommand('insertText', false, ev.clipboardData.getData('text/plain'));
          emit();
        }}
        className={`${compact ? 'min-h-[72px] max-h-[240px] text-[14px]' : 'min-h-[220px] max-h-[420px] text-[13px]'} overflow-y-auto px-2 py-1.5 leading-relaxed text-slate-800 outline-none ${RICH_CLS}`}
      />
    </div>
  );
});
RichTextEditor.displayName = 'RichTextEditor';
