"""Shared HTML viewer wrapper + MD utilities cho /preview và /export.

Cung cấp:
- build_viewer_html(): HTML chrome thống nhất (nested TOC sidebar + mermaid zoom modal).
- MD parsing utilities: strip_frontmatter, read_optional, list_glob, get_frontmatter_changelog,
  parse_index_descriptions, split_screen_sections, find_uc_screen_refs, inject_inline_screens.

Dùng bởi:
- _scripts/build-export.py
- _scripts/build-preview.py
"""

import base64
import json
import re
from pathlib import Path


# === MD parsing utilities ===

def read_optional(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.is_file() else ""


# === Offline render (cho /export html — KHÔNG phụ thuộc CDN sống) ===
# /preview vẫn dùng CDN client-side (regen tại chỗ, luôn có mạng khi dev). /export gửi cho
# stakeholder qua email → phải mở được offline. Chiến lược: render MD→HTML + mermaid→SVG
# NGAY LÚC BUILD bằng Python (markdown-it-py) + mmdc, nhúng inline vào HTML. Xem
# docs/reports/export-skill-review.md P0 #1.

_MERMAID_FENCE_RE = re.compile(r"```mermaid\n(.*?)\n```", re.DOTALL)


def _mermaid_to_inline_svg(md_content: str, tmp_dir):
    """Đổi mỗi ```mermaid block → SVG inline (render qua mmdc -e svg). Trả (new_md, results)."""
    import os
    import subprocess
    from pathlib import Path as _P
    tmp_dir = _P(tmp_dir)
    tmp_dir.mkdir(parents=True, exist_ok=True)
    results = []
    counter = [0]

    def repl(m):
        counter[0] += 1
        i = counter[0]
        code = m.group(1).strip()
        mmd = tmp_dir / f"mmd-{i:03d}.mmd"
        svg = tmp_dir / f"mmd-{i:03d}.svg"
        mmd.write_text(code, encoding="utf-8")
        try:
            env = os.environ.copy()
            env.setdefault("PUPPETEER_CACHE_DIR", str(_P.home() / ".puppeteer-cache"))
            r = subprocess.run(
                ["mmdc", "-i", str(mmd), "-o", str(svg), "-e", "svg",
                 "-b", "transparent", "--theme", "default"],
                capture_output=True, text=True, timeout=60, env=env)
            if r.returncode == 0 and svg.exists():
                svg_txt = normalize_inline_svg(svg.read_text(encoding="utf-8"))
                results.append((i, True, None))
                # bọc div để CSS .mermaid style + click-zoom bắt được
                return f'\n\n<div class="mermaid">{svg_txt}</div>\n\n'
            results.append((i, False, r.stderr.strip()[:200]))
        except (subprocess.TimeoutExpired, FileNotFoundError) as e:
            results.append((i, False, str(e)))
        # fail → giữ code block để không mất nội dung
        return f"\n\n```\n{code}\n```\n\n"

    return _MERMAID_FENCE_RE.sub(repl, md_content), results


def render_md_offline(md_content: str, tmp_dir):
    """MD → HTML tĩnh (markdown-it-py) + mermaid inline SVG. Dùng cho /export html self-contained.

    Trả (html_body, mermaid_results). KHÔNG cần markdown-it/mermaid CDN runtime ở client.
    """
    md_with_svg, mmd_results = _mermaid_to_inline_svg(md_content, tmp_dir)
    from markdown_it import MarkdownIt
    mdparser = (MarkdownIt("commonmark", {"html": True, "linkify": True, "breaks": False})
                .enable("table").enable("strikethrough"))
    html_body = mdparser.render(md_with_svg)
    return html_body, mmd_results


_IMG_MD_RE = re.compile(r'!\[([^\]]*)\]\(([^)]+)\)')


def normalize_inline_svg(svg: str) -> str:
    """Chuẩn hoá SVG để inline vào HTML KHÔNG bị méo.

    PlantUML/D2 export SVG với `preserveAspectRatio="none"` + width/height cứng (px) +
    `style="width:...px;height:...px"`. Khi CSS ép `max-width:100%` để vừa khung, width co
    lại nhưng `none` kéo giãn không giữ tỉ lệ + height cứng không co theo → ẢNH MÉO. Modal
    (svg-pan-zoom) tự set lại nên hết méo — nhưng inline vẫn méo. Fix tại nguồn:

    - bỏ `preserveAspectRatio="none"` → default `xMidYMid meet` (giữ tỉ lệ).
    - bỏ `width=`/`height=` attribute cứng + width/height trong `style=` → để CSS + viewBox lo.
    - GIỮ `viewBox` (nguồn tỉ lệ thật) — bắt buộc còn để SVG scale đúng.
    - bỏ PI `<?...?>` (xml decl + `<?plantuml 1.x?>` PlantUML chèn GIỮA file) + DOCTYPE —
      không hợp lệ khi inline giữa HTML body.
    """
    svg = re.sub(r'<\?[^>]*\?>', '', svg)
    svg = re.sub(r'<!DOCTYPE[^>]*>', '', svg, flags=re.IGNORECASE)

    m = re.search(r'<svg\b[^>]*>', svg, flags=re.IGNORECASE)
    if not m:
        return svg.strip()
    tag = m.group(0)
    new_tag = tag
    # bỏ preserveAspectRatio="none" (giữ nếu là giá trị khác — hiếm)
    new_tag = re.sub(r'\s+preserveAspectRatio="[^"]*"', '', new_tag, flags=re.IGNORECASE)
    # bỏ width/height attribute cứng (px hoặc số) — CSS + viewBox điều khiển
    new_tag = re.sub(r'\s+(width|height)="[^"]*"', '', new_tag, flags=re.IGNORECASE)
    # trong style=, bỏ khai báo width/height cứng (giữ background... nếu có)
    def _clean_style(sm):
        decls = [d.strip() for d in sm.group(1).split(';') if d.strip()]
        keep = [d for d in decls if not re.match(r'(width|height)\s*:', d, re.IGNORECASE)]
        return f'style="{";".join(keep)}"' if keep else ''
    new_tag = re.sub(r'style="([^"]*)"', _clean_style, new_tag, flags=re.IGNORECASE)
    svg = svg.replace(tag, new_tag, 1)
    return svg.strip()


def inline_local_images(body: str, base_dir: Path) -> str:
    """Inline ảnh local (.svg/.png) trong markdown thành self-contained HTML.

    Lý do: preview.html/export ở feature root (hoặc exports/), còn ảnh nhúng từ flows.md
    (vd swimlane của /activity-swimlane, D2 của /d2-*) trỏ path tương đối với srs/. Nhúng
    nguyên `<img src="rel">` → path vỡ. Giải: đọc file ảnh, embed thẳng vào HTML → self-
    contained, path-proof, offline OK.

    - `.svg` → normalize (bỏ méo) rồi bọc `<div class="mermaid">{svg}</div>` để TÁI DÙNG
      zoom modal (attachMermaidZoom bắt `.mermaid svg`); mermaid.render chỉ chạy `pre.mermaid`
      nên không đụng div này.
    - `.png`/`.jpg`/`.gif` → data URI trong `<img>`.
    - URL http(s)/data: hoặc file không tồn tại → giữ nguyên markdown (không phá).
    """
    def repl(m):
        alt, src = m.group(1), m.group(2).strip()
        if src.startswith(("http://", "https://", "data:")):
            return m.group(0)
        clean = src.split("#")[0].split("?")[0]
        img_path = (base_dir / clean).resolve()
        if not img_path.is_file():
            return m.group(0)
        ext = img_path.suffix.lower()
        try:
            if ext == ".svg":
                svg = normalize_inline_svg(img_path.read_text(encoding="utf-8"))
                return f'\n\n<div class="mermaid" title="{alt}">{svg}</div>\n\n'
            if ext in (".png", ".jpg", ".jpeg", ".gif"):
                data = base64.b64encode(img_path.read_bytes()).decode("ascii")
                mime = "image/jpeg" if ext in (".jpg", ".jpeg") else f"image/{ext[1:]}"
                return (f'\n\n<img class="embedded-img" alt="{alt}" '
                        f'src="data:{mime};base64,{data}">\n\n')
        except Exception:
            return m.group(0)
        return m.group(0)

    return _IMG_MD_RE.sub(repl, body)


# === Dùng CHUNG /preview + /export: nest heading + dọn link/wikilink/img vỡ ===
# (Cả 2 gói tài liệu thành 1 file HTML self-contained nên gặp cùng lỗi: doc con mang
#  `## ...` trùng cấp khung → TOC phẳng; link `.md`/wikilink/`<img>` file khác → vỡ.)

def demote_headings(body: str, levels: int = 1) -> str:
    """Đẩy mọi heading markdown xuống `levels` cấp để nhúng gọn dưới 1 section H2 của
    trang gói. Doc con (spec/erd/flows/states) tự có `## 1. Scope`... trùng cấp với `##`
    khung → TOC phẳng bị đè số (hai '1.', hai '2.'). Demote để chúng thành H3+ con của
    section cha, TOC nest đúng. Cũng BỎ H1 tiêu đề đầu doc con (chỉ lặp tên section cha).
    Giữ nguyên fenced code block. Cap H6."""
    if not isinstance(body, str) or not body:
        return body
    body = re.sub(r"\A\s*#\s+[^\n]+\n+", "", body)
    out, in_fence = [], False
    for ln in body.split("\n"):
        if re.match(r"^\s*```", ln):
            in_fence = not in_fence
            out.append(ln)
            continue
        if not in_fence:
            m = re.match(r"^(#{1,6})(\s)", ln)
            if m:
                new = min(len(m.group(1)) + levels, 6)
                ln = "#" * new + ln[len(m.group(1)):]
        out.append(ln)
    return "\n".join(out)


# Map tên file .md → anchor section trong trang gói (để link "chi tiết ở erd.md" scroll
# tới mục ERD thay vì mở file .md vỡ). Khớp theo hậu tố tên file.
_SECTION_ANCHOR = [
    (re.compile(r"-erd\.md|(?:^|/)erd\.md", re.I), "sec-erd"),
    (re.compile(r"-flows\.md|(?:^|/)flows\.md", re.I), "sec-flows"),
    (re.compile(r"-states\.md|(?:^|/)states\.md", re.I), "sec-states"),
    (re.compile(r"-spec\.md|(?:^|/)spec\.md", re.I), "sec-spec"),
    (re.compile(r"ascii-wireframe|-wireframe", re.I), "sec-wireframes"),
    (re.compile(r"-usecase-index\.md", re.I), "sec-functions"),
]
_UC_FILE_RE = re.compile(r"(?:^|/)(uc-[a-z0-9-]+)\.md", re.I)


def _md_target_anchor(path: str):
    """Trả anchor cho 1 path .md nội bộ, hoặc None nếu không map được. UC file trỏ tới
    ĐÚNG heading UC (id theo slug); còn lại trỏ section. us-NNN.md không map → link bị gỡ."""
    um = _UC_FILE_RE.search(path)
    if um:
        return f"uc-{um.group(1)}"
    for rx, anc in _SECTION_ANCHOR:
        if rx.search(path):
            return anc
    return None


def sanitize_embedded(md: str, feature_dir: Path) -> str:
    """Dọn thứ markdown-it KHÔNG render sạch / link vỡ trong 1 file self-contained:
    1. Wikilink `[[path|display]]` → link section (nếu trỏ file có trong trang) hoặc text.
    2. Link `[text](x.md)` + text trần `erd.md`... → link `#sec-...` (scroll) hoặc gỡ link.
    3. `<img src="rel.svg">` file có thật (trong subfolder usecases/srs) → INLINE thành
       data URI (preview.html ở feature root nên path tương đối vỡ). Dùng data URI trong
       `<img>` — KHÔNG nhúng SVG thô vào DOM (SVG PlantUML thô làm crash markdown-it/mermaid
       client → vỡ TOÀN BỘ layout). File không tồn tại → bỏ thẻ img vỡ.
    """
    def _wiki(m):
        inner = m.group(1)
        path = inner.split("|", 1)[0]
        disp = inner.split("|", 1)[1].strip() if "|" in inner else None
        anc = _md_target_anchor(path)
        if not disp:
            frag = path.split("#")
            disp = frag[1] if len(frag) > 1 else re.sub(r"\.md$", "", frag[0].rstrip("/").split("/")[-1])
            disp = disp.strip()
        return f"[{disp}](#{anc})" if anc else f"**{disp}**"
    md = re.sub(r"\[\[([^\]]+)\]\]", _wiki, md)

    def _mdlink(m):
        text, path = m.group(1), m.group(2)
        if path.startswith(("http://", "https://", "#", "mailto:")):
            return m.group(0)
        anc = _md_target_anchor(path)
        return f"[{text}](#{anc})" if anc else text
    md = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", _mdlink, md)

    def _bare(m):
        fname = m.group(0)
        anc = _md_target_anchor(fname)
        return f"[{fname}](#{anc})" if anc else fname
    md = re.sub(r"(?<![\[`/\w-])(?:erd|flows|states|spec)\.md(?![\w`\]])", _bare, md)

    def _img(m):
        src = m.group(1).strip()
        if src.startswith(("http://", "https://", "data:")):
            return m.group(0)
        alt_m = re.search(r'\balt="([^"]*)"', m.group(0))
        alt = alt_m.group(1) if alt_m else ""
        rel = src.split("#")[0].split("?")[0]
        for base in (feature_dir, feature_dir / "usecases", feature_dir / "srs"):
            img_path = base / rel
            if not img_path.is_file():
                continue
            # File có thật nhưng path TƯƠNG ĐỐI với subfolder → preview.html ở feature root
            # nên `<img src="rel">` vỡ. Inline thành data URI để self-contained + path-proof.
            # KHÔNG nhúng SVG thô vào DOM (SVG PlantUML thô crash render client → vỡ layout).
            ext = img_path.suffix.lower()
            mime = {
                ".svg": "image/svg+xml", ".png": "image/png",
                ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif",
            }.get(ext)
            if not mime:
                return m.group(0)  # ext lạ nhưng file có thật → giữ nguyên thẻ
            try:
                data = base64.b64encode(img_path.read_bytes()).decode("ascii")
            except Exception:
                return m.group(0)
            return (f'<img class="embedded-img" alt="{alt}" '
                    f'src="data:{mime};base64,{data}">')
        return ""  # file không tồn tại → bỏ thẻ img vỡ
    md = re.sub(r'<img\b[^>]*\bsrc="([^"]+)"[^>]*>', _img, md)
    return md


def doc_path(feature_dir: Path, rel: str) -> Path:
    """Resolve doc path per-feature, ho tro ca 2 the he ten:
    '{feature}-{name}' (prefix, tu 2026-07-12) va ten tran (docs demo cu).
    Uu tien ten prefix neu ton tai."""
    parts = rel.split("/")
    prefixed = feature_dir.joinpath(*parts[:-1]) / f"{feature_dir.name}-{parts[-1]}"
    if prefixed.exists():
        return prefixed
    return feature_dir.joinpath(*parts)


def strip_frontmatter(text: str) -> str:
    if text.startswith("---"):
        m = re.match(r"^---\n.*?\n---\n", text, re.DOTALL)
        if m:
            return text[m.end():]
    return text


def list_glob(folder: Path, pattern: str, exclude: set = None) -> list:
    exclude = exclude or set()
    if not folder.is_dir():
        return []
    return sorted(p for p in folder.glob(pattern) if p.name not in exclude)


def find_index_file(folder: Path, suffix: str = "-index.md") -> Path:
    """Tìm file index trong 1 folder domain (usecases/, ascii-wireframe/, ...).

    Tên file index là `{feature}-{domain}-index.md` (naming-conventions.md) — feature
    slug thay đổi theo từng feature nên KHÔNG hard-code tên, glob theo hậu tố `-index.md`
    thay vào đó. Trả về None nếu không tìm thấy hoặc tìm thấy nhiều hơn 1 (ambiguous,
    caller nên coi như "chưa có" thay vì đoán).
    """
    if not folder.is_dir():
        return None
    matches = sorted(folder.glob(f"*{suffix}"))
    return matches[0] if len(matches) == 1 else None


def get_frontmatter_changelog(text: str) -> list:
    """Extract changelog: YAML list entries từ frontmatter."""
    if not text.startswith("---"):
        return []
    m = re.match(r"^---\n(.*?)\n---", text, re.DOTALL)
    if not m:
        return []
    fm = m.group(1)
    entries = []
    in_cl = False
    for line in fm.split("\n"):
        if re.match(r"^changelog:\s*$", line):
            in_cl = True
            continue
        if in_cl:
            m2 = re.match(r"^\s+-\s+(.+)$", line)
            if m2:
                entries.append(m2.group(1))
            elif re.match(r"^[a-zA-Z_]+:", line):
                break
    return entries


def parse_index_descriptions(index_text: str) -> dict:
    """Extract `### {slug}` H3 sections under `## Descriptions` từ _index.md (v2.6.1)."""
    descs = {}
    if not index_text:
        return descs
    body = strip_frontmatter(index_text)
    m = re.search(r"##\s*Descriptions\b[^\n]*\n(.*?)(?=\n##\s|\Z)", body, re.DOTALL)
    if not m:
        return descs
    section_body = m.group(1)
    for sub_m in re.finditer(r"###\s+(\S+)[^\n]*\n(.*?)(?=\n###\s|\Z)", section_body, re.DOTALL):
        slug = sub_m.group(1).strip()
        text = sub_m.group(2).strip()
        # Skip blockquote intro lines starting with ">"
        text = "\n".join(ln for ln in text.split("\n") if not ln.lstrip().startswith(">"))
        descs[slug] = text.strip()
    return descs


def parse_screen_flow_map(index_text: str) -> dict:
    """Extract slug → flow-slug từ bảng Screens trong _index.md (cột 'Thuộc flow').

    Bảng markdown dạng `| # | Slug | Status | Thuộc flow | ... |` — parse theo header
    để tìm đúng vị trí cột 'Thuộc flow' (không hardcode index, cột có thể xê dịch).
    """
    flow_map = {}
    if not index_text:
        return flow_map
    body = strip_frontmatter(index_text)
    m = re.search(r"##\s*Screens\b[^\n]*\n(.*?)(?=\n##\s|\Z)", body, re.DOTALL)
    if not m:
        return flow_map
    lines = [ln for ln in m.group(1).split("\n") if ln.strip().startswith("|")]
    if len(lines) < 2:
        return flow_map
    headers = [h.strip().lower() for h in lines[0].strip("|").split("|")]
    slug_idx = next((i for i, h in enumerate(headers) if "slug" in h), None)
    flow_idx = next((i for i, h in enumerate(headers) if "flow" in h), None)
    if slug_idx is None or flow_idx is None:
        return flow_map
    for line in lines[2:]:
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) <= max(slug_idx, flow_idx):
            continue
        slug = re.sub(r"[`\[\]]", "", cells[slug_idx]).split("(")[0].strip()
        flow_cell = cells[flow_idx]
        flow_slug_m = re.search(r"([a-z0-9-]+)\.md", flow_cell) or re.search(r"^([a-z0-9-]+)$", flow_cell)
        if slug and flow_slug_m:
            flow_map[slug] = flow_slug_m.group(1)
    return flow_map


def split_screen_sections(flow_body: str, slug: str) -> tuple:
    """Extract (wireframe_block, description_table) cho 1 screen cụ thể từ file
    `{flow-slug}.md` gộp nhiều screen (v2.7 — gộp theo flow, thay v2.6.1 1-file/screen).

    Mỗi screen là 1 block `## Screen: {slug} — {tên}` với 2 sub-section
    `### Wireframe (ASCII)` + `### Screen description`. Demote heading để giữ TOC
    hierarchy (UC = H3, screen sub-sections = H5).
    """
    block_m = re.search(
        rf"##\s*Screen:\s*{re.escape(slug)}\b[^\n]*\n(.*?)(?=\n##\s*Screen:|\Z)",
        flow_body, re.DOTALL
    )
    if not block_m:
        return "", ""
    block = block_m.group(1)
    demoted = re.sub(r"^### ", "##### ", block, flags=re.MULTILINE)
    m1 = re.search(r"#####\s+Wireframe[^\n]*\n(.*?)(?=\n#####\s+Screen description|\Z)", demoted, re.DOTALL)
    m2 = re.search(r"#####\s+Screen description[^\n]*\n(.*?)(?=\n#####\s|\Z)", demoted, re.DOTALL)
    wireframe = m1.group(1).strip() if m1 else demoted.strip()
    desc_table = m2.group(1).strip() if m2 else ""
    return wireframe, desc_table


def _flatten_html(fragment: str) -> str:
    """Làm phẳng 1 fragment HTML để markdown-it render như HTML BLOCK (không phải code).

    markdown-it coi dòng thụt ≥4 space là indented code block → HTML wireframe (thụt sâu
    12-16 space trong file gốc) bị hiển thị dưới dạng code text thay vì render UI. Fix:
    bỏ newline + thụt đầu dòng, ghép về ÍT dòng phẳng (mỗi tag không thụt) → markdown-it
    nhận diện là raw HTML block và pass-through.
    """
    # bỏ newline + gộp khoảng trắng thụt giữa các tag; giữ 1 space giữa text tokens
    flat = re.sub(r">\s+<", "><", fragment)          # xoá whitespace giữa 2 tag
    flat = re.sub(r"\n\s*", " ", flat).strip()        # phần còn lại: newline+indent → 1 space
    return flat


def extract_scoped_wireframe_css(html_text: str) -> str:
    """Trích nguyên `<style>` của file HTML wireframe rồi SCOPE mọi rule dưới `.wf-embed`
    → nhúng vào preview mà font-size/spacing GIỐNG 100% bản /wireframe-html gốc, KHÔNG
    kế thừa/đè bởi CSS body của preview (nguyên nhân "font-size bị đổi" khi viết lại CSS tay).

    - Prefix mỗi selector bằng `.wf-embed ` (trừ @media/@keyframes/from-to/reset `*`).
    - Bỏ rule `body{...}` và `*{...}` (reset toàn cục — không được đụng preview).
    """
    m = re.search(r"<style>(.*?)</style>", html_text, re.DOTALL)
    if not m:
        return ""
    css = m.group(1)
    out = []
    # tách theo block `selector { ... }` (bỏ qua @media lồng — hiếm trong wireframe template)
    for rule in re.finditer(r"([^{}]+)\{([^{}]*)\}", css):
        sel_raw, body = rule.group(1).strip(), rule.group(2).strip()
        if not sel_raw or sel_raw.startswith("@") or sel_raw in ("from", "to"):
            continue
        selectors = []
        for sel in sel_raw.split(","):
            sel = sel.strip()
            if not sel:
                continue
            # bỏ reset toàn cục để không đụng preview
            if sel in ("*", "body", "html", ":root"):
                continue
            selectors.append(f".wf-embed {sel}")
        if selectors:
            out.append(", ".join(selectors) + " { " + body + " }")
    if not out:
        return ""
    return "<style>\n" + "\n".join(out) + "\n</style>"


def split_html_screen_sections(html_text: str, slug: str) -> tuple:
    """Extract (wireframe_html, desc_table_html) cho 1 screen từ file HTML wireframe
    `html-wireframe/{flow-slug}.html` (output /wireframe-html).

    - Wireframe: block `<div class="wf-screen" ...>...</div>` mà `wf-screen-label` khớp slug,
      BỌC trong `<div class="wf-embed">` để CSS gốc (đã scope) áp đúng.
    - Desc table: các `<tr>` thuộc screen đó, cũng bọc `.wf-embed`.

    Trả ("","") nếu không tìm thấy → caller fallback sang ASCII.
    """
    # 1) wireframe block: mọi <div class="wf-screen" ...> ... </div> (tới wf-screen-label đóng)
    wf_html = ""
    for blk in re.finditer(
        r'<div class="wf-screen"[^>]*>.*?<div class="wf-screen-label">(.*?)</div>\s*</div>',
        html_text, re.DOTALL
    ):
        label = re.sub(r"<[^>]+>", "", blk.group(1)).strip()
        # label bắt đầu bằng slug (có thể kèm badge "chung ...")
        if label.split()[0:1] == [slug] or label.startswith(slug):
            wf_html = _flatten_html('<div class="wf-embed">' + blk.group(0) + '</div>')
            break

    # 2) desc rows cho screen: từ header khớp slug tới header kế / hết tbody
    desc_html = ""
    hdr = re.search(
        rf'(<tr class="wf-desc-screen-header">\s*<td[^>]*>\s*Screen\s*\d+:\s*{re.escape(slug)}\b.*?)'
        rf'(?=<tr class="wf-desc-screen-header">|</tbody>)',
        html_text, re.DOTALL
    )
    if hdr:
        head = ('<div class="wf-embed"><table class="wf-desc-table"><thead><tr><th>#</th><th>Items</th>'
                '<th>Control type</th><th>Data type</th><th>Description</th></tr></thead><tbody>')
        desc_html = _flatten_html(head + hdr.group(1) + "</tbody></table></div>")

    return wf_html, desc_html


def find_uc_screen_refs(uc_body: str) -> list:
    """Find ascii-wireframe wikilinks trong UC Mục f. Returns [(slug, display)]."""
    refs = []
    m = re.search(
        r"##\s*[a-z]?\.?\s*[Ff]\.?\s+[Ss]creens?[^\n]*\n(.*?)(?=\n##\s|\Z)",
        uc_body, re.DOTALL
    )
    if not m:
        m = re.search(r"##\s*[^\n]*screens?\s+involved[^\n]*\n(.*?)(?=\n##\s|\Z)", uc_body, re.DOTALL | re.IGNORECASE)
    if not m:
        return refs
    section = m.group(1)
    for link_m in re.finditer(
        r"\[\[[^\]|]*?ascii-wireframe/([^\]|]+?)(?:\.md)?(?:\|([^\]]+))?\]\]",
        section
    ):
        slug = link_m.group(1).strip()
        display = (link_m.group(2) or slug).strip()
        refs.append((slug, display))
    return refs


def inject_inline_screens(uc_body: str, feature_dir: Path, descriptions: dict, flow_map: dict = None) -> str:
    """Inject inline screens sau UC Mục f, GROUP tuần tự:
       1) Tất cả wireframes (all screens) → đọc visual flow trước
       2) Sau đó tất cả Element descriptions (tables)

    Screens gộp theo flow (`ascii-wireframe/{flow-slug}.md` chứa N screens) —
    cần `flow_map` (slug → flow-slug, từ parse_screen_flow_map) để biết file nào chứa screen nào.
    """
    refs = find_uc_screen_refs(uc_body)
    if not refs:
        return uc_body

    flow_map = flow_map or {}
    wf_items = []
    desc_items = []
    ascii_body_cache = {}
    html_body_cache = {}
    css_injected = set()   # flow-slug đã chèn scoped CSS (chỉ 1 lần/flow)
    css_blocks = []        # scoped CSS gộp, chèn 1 lần đầu combined

    for slug, display in refs:
        purpose = descriptions.get(slug, "_(chưa có description trong file index)_")
        flow_slug = flow_map.get(slug)
        if not flow_slug:
            wf_items.append(f"\n> ⚠ Screen `{slug}` không tìm thấy trong bảng flow của file index.\n")
            continue

        # ƯU TIÊN HTML wireframe (html-wireframe/{flow-slug}.html) — render device thật, đẹp hơn.
        # Không có / không trích được screen đó → FALLBACK ASCII (ascii-wireframe/{flow-slug}.md).
        wireframe, desc_table, src = "", "", None
        if flow_slug not in html_body_cache:
            html_path = feature_dir / "html-wireframe" / f"{flow_slug}.html"
            html_body_cache[flow_slug] = html_path.read_text(encoding="utf-8") if html_path.is_file() else None
        html_body = html_body_cache[flow_slug]
        if html_body:
            h_wf, h_desc = split_html_screen_sections(html_body, slug)
            if h_wf or h_desc:
                wireframe, desc_table, src = h_wf, h_desc, "html"
                # chèn CSS gốc (đã scope .wf-embed) 1 lần/flow → font-size/spacing giống bản gốc
                if flow_slug not in css_injected:
                    scoped = extract_scoped_wireframe_css(html_body)
                    if scoped:
                        css_blocks.append(_flatten_html(scoped))
                    css_injected.add(flow_slug)

        if src is None:  # fallback ASCII
            if flow_slug not in ascii_body_cache:
                ap = feature_dir / "ascii-wireframe" / f"{flow_slug}.md"
                ascii_body_cache[flow_slug] = strip_frontmatter(ap.read_text(encoding="utf-8")) if ap.is_file() else None
            ascii_body = ascii_body_cache[flow_slug]
            if ascii_body is None:
                wf_items.append(f"\n> ⚠ Không có wireframe cho screen `{slug}` (thiếu cả `html-wireframe/{flow_slug}.html` lẫn `ascii-wireframe/{flow_slug}.md`).\n")
                continue
            wireframe, desc_table = split_screen_sections(ascii_body, slug)
            src = "ascii"

        if not wireframe and not desc_table:
            wf_items.append(f"\n> ⚠ Screen `{slug}` không tìm thấy nội dung trong flow `{flow_slug}`.\n")
            continue

        src_tag = "HTML" if src == "html" else "ASCII"
        wf_items.append(f"""
<details class="inline-screen" open>
<summary>📱 <strong>{display}</strong> <code>{slug}</code> <span class="wf-src-tag">{src_tag}</span></summary>

**Mô tả:** {purpose}

{wireframe}

</details>
""")

        if desc_table:
            desc_items.append(f"""
<details class="inline-screen" open>
<summary>📋 <strong>{display}</strong> — elements <code>{slug}</code></summary>

{desc_table}

</details>
""")

    css_prefix = ("\n\n" + "\n".join(css_blocks) + "\n\n") if css_blocks else ""
    combined = css_prefix + "\n\n**🖼 Wireframes (visual sequence):**\n" + "".join(wf_items)
    if desc_items:
        combined += "\n\n---\n\n**📋 Element specifications (tables):**\n" + "".join(desc_items)

    m = re.search(
        r"(##\s*[a-z]?\.?\s*[Ff]\.?\s+[Ss]creens?[^\n]*\n.*?)(?=\n##\s|\Z)",
        uc_body, re.DOTALL
    )
    if not m:
        return uc_body + combined
    insert_at = m.end()
    return uc_body[:insert_at] + combined + uc_body[insert_at:]


# === HTML viewer wrapper ===

def build_viewer_html(title: str, subtitle: str, date: str, md_content: str, regen_cmd: str = None,
                      offline: bool = False, prerendered_html: str = None) -> str:
    """Build self-contained HTML viewer.

    2 chế độ:
    - **online** (mặc định — dùng bởi /preview): markdown-it + mermaid + svg-pan-zoom qua CDN,
      render client-side (regen tại chỗ khi dev, luôn có mạng).
    - **offline=True** (dùng bởi /export html): MD đã render sẵn thành `prerendered_html` (Python
      markdown-it-py) + mermaid đã là SVG inline → KHÔNG nạp CDN nào, mở được không cần mạng.
      Stakeholder nhận file qua email mở offline vẫn thấy đủ. Xem export-skill-review.md P0 #1.

    Cả 2 chế độ chung CSS + TOC/scroll-spy (thuần JS, không CDN) để không drift.
    """
    md_json = json.dumps(md_content if not offline else "", ensure_ascii=False)
    # MD_SOURCE nằm TRONG 1 <script> block. Nếu md_content nhúng HTML có literal `</script>`
    # (vd html-wireframe chứa `<script>...</script>`), HTML parser đóng script SỚM giữa chừng
    # → phần còn lại đổ thành rác → SyntaxError → VỠ TOÀN TRANG. Vô hiệu bằng `<\/script`
    # (hợp lệ trong JS string, browser không coi là thẻ đóng). Cũng chặn `<!--`/`-->` phá.
    md_json = md_json.replace("</script", "<\\/script").replace("<!--", "<\\!--")
    regen_note = regen_cmd or ""
    cdn_scripts = "" if offline else """  <script src="https://cdn.jsdelivr.net/npm/markdown-it@14/dist/markdown-it.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js"></script>
"""

    return f"""<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} — {subtitle}</title>
{cdn_scripts}  <style>
    :root {{
      --color-primary: #FCD535;
      --color-canvas: #ffffff;
      --color-surface: #fafafa;
      --color-surface-strong: #f3f3f5;
      --color-ink: #181a20;
      --color-muted: #707a8a;
      --color-hairline: #eaecef;
      --color-link: #2563eb;
      --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      font-family: var(--font-body);
      color: var(--color-ink);
      background: var(--color-surface);
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }}
    .layout {{
      display: grid;
      grid-template-columns: 280px 1fr;
      min-height: 100vh;
    }}
    aside {{
      position: sticky;
      top: 0;
      align-self: start;
      height: 100vh;
      overflow-y: auto;
      background: var(--color-canvas);
      border-right: 1px solid var(--color-hairline);
      padding: 24px 16px;
    }}
    aside h2 {{ font-size: 14px; text-transform: uppercase; color: var(--color-muted); margin: 0 0 12px; letter-spacing: .03em; }}
    aside nav ol, aside nav ul {{ list-style: none; padding: 0; margin: 0; }}
    .toc-controls {{ display: flex; gap: 6px; margin-bottom: 12px; }}
    .toc-controls button {{
      flex: 1; font-size: 11px; color: var(--color-muted); background: var(--color-surface);
      border: 1px solid var(--color-hairline); border-radius: 6px; padding: 5px 8px; cursor: pointer;
    }}
    .toc-controls button:hover {{ background: var(--color-surface-strong); color: var(--color-ink); }}
    /* TOC nested đa cấp (H2→H3→H4) — thụt lề + cỡ chữ theo cấp. */
    aside nav li.toc-item {{ list-style: none; }}
    aside nav li.toc-item > .toc-row {{ display: flex; align-items: flex-start; border-radius: 6px; }}
    aside nav li.toc-item > .toc-row:hover {{ background: var(--color-surface); }}
    aside nav li.toc-item > .toc-row > a {{ flex: 1; display: block; text-decoration: none; padding: 5px 8px; line-height: 1.4; }}
    aside nav .toc-children {{ margin: 0; padding: 0; }}
    aside nav li.collapsed > .toc-children {{ display: none; }}
    /* Cấp 2 (section chính) */
    aside nav > li.toc-item {{ margin-top: 12px; }}
    aside nav > li.toc-item:first-child {{ margin-top: 0; }}
    aside nav > li.toc-item[data-level="2"] > .toc-row > a {{ font-weight: 600; font-size: 13px; color: var(--color-ink); }}
    aside nav > li.toc-item[data-level="2"].active > .toc-row {{ background: var(--color-primary); }}
    /* Cấp 3 */
    aside nav li.toc-item[data-level="3"] {{ margin-left: 12px; border-left: 2px solid var(--color-hairline); }}
    aside nav li.toc-item[data-level="3"] > .toc-row > a {{ font-size: 12px; color: var(--color-muted); }}
    /* Cấp 4 */
    aside nav li.toc-item[data-level="4"] {{ margin-left: 22px; border-left: 2px solid var(--color-hairline); }}
    aside nav li.toc-item[data-level="4"] > .toc-row > a {{ font-size: 11.5px; color: var(--color-muted); opacity: .9; }}
    aside nav li.toc-item.active > .toc-row > a {{ color: var(--color-ink); font-weight: 600; }}
    aside nav .toggle {{ cursor: pointer; user-select: none; color: var(--color-muted); width: 14px; flex: 0 0 14px; text-align: center; padding-top: 5px; transition: transform .15s; }}
    aside nav .toggle.leaf {{ visibility: hidden; }}
    aside nav li.collapsed > .toc-row > .toggle {{ transform: rotate(-90deg); }}
    main {{ padding: 40px 60px; max-width: 1100px; }}
    main h1 {{ font-size: 32px; border-bottom: 2px solid var(--color-ink); padding-bottom: 12px; }}
    main h2 {{ font-size: 24px; margin-top: 40px; border-bottom: 1px solid var(--color-hairline); padding-bottom: 6px; }}
    main h3 {{ font-size: 18px; margin-top: 28px; color: var(--color-ink); }}
    main h4 {{ font-size: 16px; margin-top: 20px; }}
    main p, main li {{ font-size: 14px; }}
    main code {{ font-family: var(--font-mono); font-size: 13px; background: var(--color-surface); padding: 2px 6px; border-radius: 4px; }}
    main pre {{ background: var(--color-surface); border: 1px solid var(--color-hairline); border-radius: 8px; padding: 16px; overflow-x: auto; font-size: 13px; }}
    main pre.mermaid {{ background: var(--color-canvas); text-align: center; }}
    main .mermaid svg {{ cursor: zoom-in; transition: filter .15s; max-width: 100%; }}
    main img.embedded-img {{ display: block; max-width: 100%; height: auto; margin: 16px auto; }}
    main .mermaid svg:hover {{ filter: drop-shadow(0 0 6px rgba(252, 213, 53, .5)); }}
    main table {{ border-collapse: collapse; width: 100%; margin: 16px 0; font-size: 13px; }}
    main th, main td {{ border: 1px solid var(--color-hairline); padding: 8px 12px; text-align: left; vertical-align: top; }}
    main th {{ background: var(--color-surface); font-weight: 600; }}
    main a {{ color: var(--color-link); text-decoration: none; }}
    main a:hover {{ text-decoration: underline; }}
    main hr {{ border: none; border-top: 1px solid var(--color-hairline); margin: 32px 0; }}
    main blockquote {{ border-left: 4px solid var(--color-primary); margin: 16px 0; padding: 8px 16px; background: var(--color-surface); color: var(--color-muted); }}
    main details.inline-screen {{ border: 1px solid var(--color-hairline); border-radius: 8px; padding: 0; margin: 16px 0; background: var(--color-canvas); overflow: hidden; }}
    main details.inline-screen[open] {{ box-shadow: 0 1px 2px rgba(0,0,0,.04); }}
    main details.inline-screen > summary {{ cursor: pointer; padding: 12px 16px; background: var(--color-surface); font-size: 14px; user-select: none; border-bottom: 1px solid transparent; }}
    main details.inline-screen[open] > summary {{ border-bottom-color: var(--color-hairline); }}
    main details.inline-screen > summary:hover {{ background: var(--color-surface-strong); }}
    main details.inline-screen > summary code {{ background: var(--color-canvas); border: 1px solid var(--color-hairline); }}
    main details.inline-screen > *:not(summary) {{ padding-left: 16px; padding-right: 16px; }}
    main details.inline-screen pre {{ margin: 8px 0; }}
    .wf-src-tag {{ font-size: 10px; font-weight: 700; color: #fff; background: #000; border-radius: 3px; padding: 1px 6px; margin-left: 6px; vertical-align: middle; }}
    /* HTML wireframe embed — CSS chi tiết đến từ style GỐC của file wireframe (scope .wf-embed,
       xem extract_scoped_wireframe_css) nên font-size/spacing GIỐNG bản /wireframe-html. Ở đây chỉ
       reset kế thừa + layout container để không bị body preview đè. */
    main .wf-embed {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #000; font-size: 12px; line-height: 1.4; }}
    main .wf-embed * {{ box-sizing: border-box; }}
    main .wf-embed .wf-screen {{ display: inline-block; vertical-align: top; max-width: 100%; }}
    main .wf-embed .wf-step-badge {{ display: none; }}
    .meta {{ color: var(--color-muted); font-size: 13px; margin-bottom: 24px; }}
    /* Cover page (export) — khối bìa căn giữa, viền dưới ngăn cách với nội dung. */
    main .cover {{ text-align: center; padding: 48px 24px 40px; margin-bottom: 24px; border-bottom: 2px solid var(--color-hairline); }}
    main .cover h1 {{ border: none; font-size: 34px; }}
    main .cover h2 {{ border: none; color: var(--color-muted); font-weight: 500; font-size: 17px; margin-top: 4px; }}
    main .cover p {{ font-size: 15px; line-height: 2; }}

    /* Mermaid zoom modal */
    .mermaid-modal {{
      position: fixed; inset: 0; background: rgba(0,0,0,0.75);
      display: none; align-items: center; justify-content: center;
      z-index: 9999; animation: fadeIn 0.2s ease-out;
    }}
    .mermaid-modal.open {{ display: flex; }}
    .modal-svg {{
      width: 95vw; height: 90vh; border-radius: 8px;
      background: var(--color-canvas); padding: 2rem; box-sizing: border-box;
      overflow: hidden;
    }}
    .modal-svg svg {{ display: block; max-width: none !important; max-height: none !important; width: 100% !important; height: 100% !important; }}
    .modal-toolbar {{
      position: fixed; top: 1rem; right: 1rem; display: flex; gap: 0.5rem; z-index: 10000;
    }}
    .modal-toolbar button {{
      width: 40px; height: 40px; background: var(--color-canvas); border: 1px solid var(--color-hairline);
      border-radius: 6px; font-size: 1.2rem; cursor: pointer; color: var(--color-ink);
    }}
    .modal-toolbar button:hover {{ background: var(--color-surface); }}
    @keyframes fadeIn {{ from {{ opacity: 0 }} to {{ opacity: 1 }} }}

    footer {{ padding: 24px 60px; border-top: 1px solid var(--color-hairline); color: var(--color-muted); font-size: 13px; background: var(--color-canvas); }}
    footer code {{ font-family: var(--font-mono); background: var(--color-surface); padding: 2px 6px; border-radius: 4px; }}

    @media (max-width: 768px) {{
      .layout {{ grid-template-columns: 1fr; }}
      aside {{ position: static; height: auto; border-right: none; border-bottom: 1px solid var(--color-hairline); }}
      main {{ padding: 24px; }}
      footer {{ padding: 16px 24px; }}
    }}
  </style>
</head>
<body>
  <div class="layout">
    <aside>
      <h2>{title}</h2>
      <div class="meta">{subtitle} · {date}</div>
      <nav>
        <div class="toc-controls">
          <button type="button" onclick="setAllTocCollapsed(false)">Expand all</button>
          <button type="button" onclick="setAllTocCollapsed(true)">Collapse all</button>
        </div>
        <ol id="toc"></ol>
      </nav>
    </aside>
    <main id="content">{prerendered_html if offline and prerendered_html else ''}</main>
  </div>

  <!-- Mermaid zoom modal -->
  <div id="mermaid-modal" class="mermaid-modal" onclick="if(event.target===this)closeMermaidModal()">
    <div class="modal-toolbar">
      <button onclick="modalPanZoom && modalPanZoom.zoomIn()" title="Zoom in">＋</button>
      <button onclick="modalPanZoom && modalPanZoom.zoomOut()" title="Zoom out">－</button>
      <button onclick="modalPanZoom && (modalPanZoom.resetZoom(), modalPanZoom.center(), modalPanZoom.fit())" title="Reset">⟲</button>
      <button onclick="closeMermaidModal()" title="Close (ESC)">✕</button>
    </div>
    <div class="modal-svg"></div>
  </div>

  {f'<footer><p>Workflow: edit MD source → save → chạy <code>{regen_note}</code> để regen → refresh browser.</p></footer>' if regen_note else ''}

  <script>
    const OFFLINE = {json.dumps(offline)};
    let modalPanZoom = null;

    // === Markdown parsing (CHỈ online — offline đã render sẵn server-side) ===
    if (!OFFLINE) {{
      const MD_SOURCE = {md_json};
      const md = window.markdownit({{ html: true, linkify: true, breaks: false }});
      const defaultFence = md.renderer.rules.fence.bind(md.renderer.rules);
      md.renderer.rules.fence = (tokens, idx, options, env, slf) => {{
        const token = tokens[idx];
        if (token.info.trim() === 'mermaid') {{
          return `<pre class="mermaid">${{token.content}}</pre>`;
        }}
        return defaultFence(tokens, idx, options, env, slf);
      }};
      document.getElementById('content').innerHTML = md.render(MD_SOURCE);
    }}

    // === Build nested TOC đa cấp (H2 → H3 → H4) theo đúng phân cấp heading ===
    const toc = document.getElementById('toc');
    // Lấy H2/H3/H4 (bỏ heading trong cover page). H4 cho thấy mục con sâu (vd
    // "## Screen: ..." trong wireframe demote thành H4) — TOC nest đúng theo cấp.
    const headings = Array.from(document.querySelectorAll('main h2, main h3, main h4'))
                          .filter(h => !h.closest('.cover'));
    // Stack các <ul> theo cấp: stack[L] = ul chứa item cấp L. Gốc toc = cấp 1 (giữ H2).
    const listStack = {{ 1: toc }};   // toc là <ol> gốc
    let counter = 0;

    headings.forEach((h) => {{
      const level = parseInt(h.tagName[1], 10);   // 2 | 3 | 4
      const id = `sec-${{++counter}}`;
      h.id = id;

      const li = document.createElement('li');
      li.className = 'toc-item';
      li.dataset.level = level;
      const row = document.createElement('div');
      row.className = 'toc-row';
      const toggle = document.createElement('span');
      toggle.className = 'toggle leaf';   // 'leaf' cho tới khi có con
      toggle.textContent = '▾';
      const a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = h.textContent;
      row.appendChild(toggle);
      row.appendChild(a);
      li.appendChild(row);
      const childUl = document.createElement('ul');
      childUl.className = 'toc-children';
      li.appendChild(childUl);

      // Gắn vào parent = ul của cấp NGAY TRÊN đang mở (level-1); không có thì leo lên tiếp.
      let parentUl = null;
      for (let L = level - 1; L >= 1; L--) {{ if (listStack[L]) {{ parentUl = listStack[L]; break; }} }}
      (parentUl || toc).appendChild(li);
      // Parent li không còn là leaf → hiện toggle.
      const parentLi = (parentUl || toc).closest('li.toc-item');
      if (parentLi) parentLi.querySelector(':scope > .toc-row > .toggle').classList.remove('leaf');

      // Cấp hiện tại giờ mở childUl này; xóa mọi cấp sâu hơn khỏi stack.
      listStack[level] = childUl;
      for (let L = level + 1; L <= 6; L++) delete listStack[L];

      toggle.addEventListener('click', (e) => {{
        e.preventDefault(); e.stopPropagation();
        li.classList.toggle('collapsed');
      }});
    }});

    function setAllTocCollapsed(collapsed) {{
      // Chỉ gập/mở các item CÓ con (leaf giữ nguyên).
      toc.querySelectorAll('li.toc-item').forEach(li => {{
        const t = li.querySelector(':scope > .toc-row > .toggle');
        if (t && !t.classList.contains('leaf')) li.classList.toggle('collapsed', collapsed);
      }});
    }}

    // === Click link nội bộ #anchor (TOC LẪN trong nội dung) → cuộn mượt tới mục ===
    // Bắt ở document để phủ cả link "chi tiết ở erd.md" (đã đổi thành #sec-erd) trong
    // content, không chỉ TOC. Anchor có thể là <a id> động (sec-N) hoặc cố định (sec-erd...).
    document.addEventListener('click', (e) => {{
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id) ||
                     document.querySelector(`main [id="${{id}}"]`);
      if (target) {{
        e.preventDefault();
        target.scrollIntoView({{ behavior: 'smooth', block: 'start' }});
        history.replaceState(null, '', '#' + id);
      }}
    }});

    // === Scroll-spy: highlight mục đang xem + mọi tổ tiên của nó ===
    const obs = new IntersectionObserver((entries) => {{
      entries.forEach(entry => {{
        if (entry.isIntersecting) {{
          toc.querySelectorAll('li.active').forEach(el => el.classList.remove('active'));
          const link = toc.querySelector(`a[href="#${{entry.target.id}}"]`);
          if (link) {{
            // Đánh dấu item hiện tại + leo lên mọi cấp cha (nested).
            let li = link.closest('li.toc-item');
            while (li) {{ li.classList.add('active'); li = li.parentElement.closest('li.toc-item'); }}
          }}
        }}
      }});
    }}, {{ rootMargin: '-10% 0px -70% 0px', threshold: 0 }});
    document.querySelectorAll('main h2, main h3, main h4').forEach(h => obs.observe(h));

    // === Mermaid render (CHỈ online) + zoom modal ===
    if (!OFFLINE && window.mermaid) {{
      mermaid.initialize({{ startOnLoad: false, theme: 'default', securityLevel: 'loose' }});
      (async () => {{
        const blocks = Array.from(document.querySelectorAll('pre.mermaid'));
        for (let i = 0; i < blocks.length; i++) {{
          const el = blocks[i];
          const code = el.textContent;
          try {{
            const {{ svg }} = await mermaid.render(`mmd-${{i}}`, code);
            el.innerHTML = svg;
            el.dataset.processed = '1';
          }} catch (err) {{
            console.error(`Mermaid block #${{i}} failed:`, err.message || err);
            el.innerHTML = `<div style="color:#b00;font-family:monospace;font-size:12px;padding:8px;border:1px solid #b00;border-radius:4px;text-align:left;">⚠ Mermaid render lỗi: ${{(err.message||err).toString().split('\\n')[0]}}<br><pre style="white-space:pre-wrap;margin-top:8px;">${{code.replace(/</g,'&lt;')}}</pre></div>`;
          }}
        }}
        attachMermaidZoom();
      }})();
    }} else {{
      // offline: SVG đã inline sẵn server-side, chỉ cần gắn click-zoom.
      attachMermaidZoom();
    }}

    function attachMermaidZoom() {{
      document.querySelectorAll('.mermaid svg, pre.mermaid svg').forEach(svg => {{
        if (svg.dataset.zoomAttached) return;
        svg.dataset.zoomAttached = '1';
        svg.addEventListener('click', () => openMermaidModal(svg));
      }});
    }}

    function openMermaidModal(svg) {{
      const modal = document.getElementById('mermaid-modal');
      const inner = modal.querySelector('.modal-svg');
      const clone = svg.cloneNode(true);
      clone.style.maxWidth = 'none';
      clone.style.maxHeight = 'none';
      clone.setAttribute('width', '100%');
      clone.setAttribute('height', '100%');
      inner.innerHTML = '';
      inner.appendChild(clone);
      modal.classList.add('open');
      // svg-pan-zoom chỉ có online (CDN). Offline: hiển thị to trong modal, không pan/zoom lib
      // (degrade nhẹ — vẫn xem được full diagram, ESC/click nền để đóng).
      if (!OFFLINE && window.svgPanZoom) {{
        requestAnimationFrame(() => {{
          modalPanZoom = svgPanZoom(clone, {{
            zoomEnabled: true, controlIconsEnabled: false,
            fit: true, center: true, minZoom: 0.3, maxZoom: 20,
            zoomScaleSensitivity: 0.3
          }});
        }});
      }}
    }}

    function closeMermaidModal() {{
      const modal = document.getElementById('mermaid-modal');
      if (modalPanZoom) {{ modalPanZoom.destroy(); modalPanZoom = null; }}
      modal.querySelector('.modal-svg').innerHTML = '';
      modal.classList.remove('open');
    }}

    document.addEventListener('keydown', e => {{
      if (e.key === 'Escape' && document.getElementById('mermaid-modal').classList.contains('open')) {{
        closeMermaidModal();
      }}
    }});
  </script>
</body>
</html>
"""
