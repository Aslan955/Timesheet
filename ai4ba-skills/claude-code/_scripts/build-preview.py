#!/usr/bin/env python3
"""
Build preview.html cho 1 feature — active work viewer.

Usage: python3 _scripts/build-preview.py <feature> [--out <path>]

Flow (v2.7 — shared wrapper):
  1. Read source MD files trong docs/{feature}/ + shared docs docs/_shared/.
  2. Compose 1 large MD content:
       1. Tổng quan nhanh (summary at-a-glance — counts + ID list parse từ srs/spec.md)
       2. Giới thiệu & Mô tả chung (từ docs/_shared/: system-overview/definitions/conventions/operating-env)
       3. SRS Spec (full) · 4. ERD · 5. Flows · 6. States · 7. Functions (inline screens) · 8. Screens · 9. Designs · 10. Open Questions.
  3. Pass MD content qua shared _viewer_wrapper.build_viewer_html() → nested TOC + mermaid zoom modal.
  4. Write docs/{feature}/{feature}-preview.html.

Khác /export: preview KHÔNG có Executive Summary / Stories+AC / Traceability — chỉ focus
content cần xem khi đang làm việc. KHÔNG còn URD/BRD/PRD (preview là để làm việc SRS, không
phải xem lại requirements docs — bỏ 2026-07-16).

Open Questions: thay vì để rải rác trong từng section (spec, mỗi UC, ...), build gom hết
về 1 section "9. Open Questions (tổng hợp)" ở cuối, group theo nguồn. Section OQ inline trong
mỗi block bị strip khỏi HTML (placeholder '(none)' bị bỏ luôn). File MD gốc KHÔNG bị đụng.
"""

import argparse
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _viewer_wrapper import (  # noqa: E402
    doc_path,
    build_viewer_html,
    read_optional,
    strip_frontmatter,
    list_glob,
    find_index_file,
    parse_index_descriptions,
    parse_screen_flow_map,
    inject_inline_screens,
    inline_local_images,
    extract_scoped_wireframe_css,
    demote_headings,
    sanitize_embedded,
)


def parse_order(md_path: Path) -> int:
    """Extract `order: NN` từ frontmatter (legacy). Default 999."""
    try:
        with md_path.open(encoding="utf-8") as f:
            in_fm = False
            for line in f:
                line = line.rstrip("\n")
                if line == "---":
                    if not in_fm:
                        in_fm = True
                        continue
                    break
                if in_fm:
                    m = re.match(r"^order:\s*(\d+)", line)
                    if m:
                        return int(m.group(1))
    except Exception:
        pass
    return 999


def list_ordered(folder: Path, pattern: str, exclude: set = None) -> list:
    exclude = exclude or set()
    if not folder.is_dir():
        return []
    files = [p for p in folder.glob(pattern) if p.name not in exclude]
    return sorted(files, key=lambda p: (parse_order(p), p.name))


def section(title: str, body: str, anchor: str = None) -> str:
    # anchor ổn định (id HTML) để link nội bộ `#sec-erd` scroll tới đúng mục (JS TOC gán
    # id động sec-N, KHÔNG dùng cho link .md → cần id cố định này). `<a id>` đặt trong
    # heading để markdown-it giữ (raw inline HTML), không phá auto-id của TOC.
    aid = f'<a id="{anchor}"></a>' if anchor else ""
    return f"## {aid}{title}\n\n{body.strip()}\n\n"


# demote_headings + sanitize_embedded chuyển sang _viewer_wrapper.py (dùng chung /export) —
# import ở đầu file.

# Heading "Open Questions" ở bất kỳ level, optional numbering "10." / "h." / "h)" prefix.
OQ_HEADING_RE = re.compile(
    r"^(#{1,6})[ \t]*(?:[0-9A-Za-z]{1,3}[.)][ \t]*)?Open Questions\b[^\n]*$",
    re.IGNORECASE | re.MULTILINE,
)
# Placeholder rỗng kiểu "- [ ] (none)" / "(none)" → bỏ khi gom.
NONE_ITEM_RE = re.compile(r"^[-*]?\s*(?:\[[ xX~]\])?\s*\(?none\)?\.?$", re.IGNORECASE)


def extract_open_questions(body: str, label: str, sink: list) -> str:
    """Loại bỏ mọi section 'Open Questions' khỏi body, gom (label, content) vào sink.

    Trả về body đã xoá OQ section (để render inline sạch). Section chỉ chứa
    placeholder '(none)' / rỗng thì bỏ qua khỏi sink (không gom).
    KHÔNG đụng tới file MD gốc — chỉ thao tác trên chuỗi đang compose.
    """
    matches = list(OQ_HEADING_RE.finditer(body))
    if not matches:
        return body
    ranges = []
    for m in matches:
        level = len(m.group(1))
        rest = body[m.end():]
        end_rel = len(rest)
        # Section kết thúc ở heading kế tiếp có level <= level OQ.
        for hm in re.finditer(r"^(#{1,6})[ \t]", rest, re.MULTILINE):
            if len(hm.group(1)) <= level:
                end_rel = hm.start()
                break
        content = rest[:end_rel].strip()
        ranges.append((m.start(), m.end() + end_rel))
        real_lines = [
            ln for ln in content.split("\n")
            if ln.strip() and not NONE_ITEM_RE.match(ln.strip())
        ]
        if real_lines:
            sink.append((label, "\n".join(real_lines).strip()))
    # Rebuild body bỏ các range OQ.
    parts = []
    prev = 0
    for s, e in ranges:
        parts.append(body[prev:s])
        prev = e
    parts.append(body[prev:])
    cleaned = "".join(parts)
    # Dọn separator '---' lửng + blank lines dư sau khi cắt section cuối.
    cleaned = re.sub(r"\n-{3,}[ \t]*\n?\s*$", "\n", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).rstrip() + "\n"
    return cleaned


def build_oq_section(open_questions: list) -> str:
    """Render section Open Questions tổng hợp, group theo nguồn."""
    if not open_questions:
        return "_Không còn câu hỏi mở — tất cả đã resolved (hoặc các mục đều `(none)`)._"
    out = [
        "> Gom từ các mục **Open Questions** rải rác trong tài liệu (SRS spec, từng function, ...). "
        "Nội dung gốc vẫn nằm nguyên trong file MD — đây chỉ là bản tổng hợp để dễ đọc.\n"
    ]
    for label, content in open_questions:
        out.append(f"### {label}\n\n{content}\n")
    return "\n".join(out)


# Heading "Flows (tóm tắt ...)" trong spec.md — bất kỳ level, optional numbering "7." / "g." / "g)".
FLOWS_SUMMARY_HEADING_RE = re.compile(
    r"^(#{1,6})[ \t]*(?:[0-9A-Za-z]{1,3}[.)][ \t]*)?Flows\b[^\n]*$",
    re.IGNORECASE | re.MULTILINE,
)


def strip_flows_doc_chrome(flows_body: str) -> str:
    """Bỏ H1 '# ... — Flows' + blockquote intro của flows.md để nhúng vào spec.

    flows_body đã strip_frontmatter. Trả về phần các '## Flow: ...' sections,
    demote 1 level (## → ###) để nằm gọn dưới heading Flows trong spec.
    """
    body = flows_body.strip()
    # Bỏ H1 đầu file (# ... — Flows).
    body = re.sub(r"\A#\s+[^\n]*\n+", "", body)
    # Bỏ blockquote intro liền sau (> ...).
    body = re.sub(r"\A(?:>[^\n]*\n)+\s*", "", body)
    body = body.strip()
    # Demote mọi heading 1 level để '## Flow:' thành '### Flow:' (gọn dưới heading Flows).
    body = re.sub(r"^(#{1,5})([ \t])", r"\1#\2", body, flags=re.MULTILINE)
    return body


def replace_flows_summary_in_spec(spec_body: str, flows_body: str):
    """Thay nội dung mục 'Flows (tóm tắt...)' trong spec bằng full flows.md.

    Trả về (new_spec_body, replaced: bool). KHÔNG đụng file MD gốc — chỉ chuỗi
    đang compose. Heading được đổi tiêu đề thành 'Flows' (bỏ '(tóm tắt — chi tiết...)'),
    giữ numbering prefix gốc nếu có. Nếu không tìm thấy heading → trả về nguyên,
    replaced=False (caller sẽ render section System Flows riêng như cũ).
    """
    m = FLOWS_SUMMARY_HEADING_RE.search(spec_body)
    if not m or not flows_body:
        return spec_body, False
    level = len(m.group(1))
    heading_line = m.group(0)
    # Giữ numbering prefix (vd "7.") nếu có, thay tiêu đề thành "Flows".
    num_m = re.match(r"^#{1,6}[ \t]*([0-9A-Za-z]{1,3}[.)])[ \t]*", heading_line)
    prefix = (num_m.group(1) + " ") if num_m else ""
    new_heading = f"{'#' * level} {prefix}Flows"
    # Tìm range thân section: tới heading kế tiếp có level <= level.
    rest = spec_body[m.end():]
    end_rel = len(rest)
    for hm in re.finditer(r"^(#{1,6})[ \t]", rest, re.MULTILINE):
        if len(hm.group(1)) <= level:
            end_rel = hm.start()
            break
    flows_content = strip_flows_doc_chrome(flows_body)
    intro = ("> Sequence diagram chi tiết cho từng flow (nguồn: `srs/flows.md`).\n\n")
    replacement = f"{new_heading}\n\n{intro}{flows_content}\n\n"
    new_body = spec_body[:m.start()] + replacement + rest[end_rel:]
    return new_body, True


def parse_screens_table(index_text: str) -> list:
    """Parse '## Screens' table → list of dicts, map cột theo TÊN HEADER (không hard-code
    vị trí). Index có thể có cột 'Thuộc flow' xen giữa (8 cột) → cách cũ đếm-vị-trí đọc
    lệch (figma nhận nhầm 'Used by' → sinh link 'Open Figma' vỡ). Header-aware sửa việc đó."""
    if not index_text:
        return []
    body = strip_frontmatter(index_text)
    m = re.search(r"##\s*Screens\b[^\n]*\n\s*(\|[^\n]+\|)\n\|[-\s:|]+\|\n((?:\|[^\n]+\|\n?)+)",
                  body, re.DOTALL)
    if not m:
        return []
    headers = [h.strip().lower() for h in m.group(1).strip("|").split("|")]
    def idx(*names):
        for n in names:
            for i, h in enumerate(headers):
                if n in h:
                    return i
        return None
    ci = {k: idx(*v) for k, v in {
        "slug": ("slug",), "status": ("status",), "used_by": ("used by", "used-by"),
        "figma": ("figma",), "html": ("html",), "updated": ("updated",),
    }.items()}
    rows = []
    for line in m.group(2).strip().split("\n"):
        cells = [c.strip() for c in line.strip("|").split("|")]
        def g(k, default=""):
            i = ci[k]
            return cells[i] if i is not None and i < len(cells) else default
        slug_link = g("slug")
        sm = re.match(r"\[([^\]]+)\]", slug_link) or re.match(r"`([^`]+)`", slug_link)
        rows.append({
            "slug": sm.group(1) if sm else slug_link,
            "status": g("status"),
            "used_by": g("used_by"),
            "figma": g("figma", "—") or "—",
            "html": g("html", "—") or "—",
            "updated": g("updated"),
        })
    return rows


def build_screens_catalog(screen_index_text: str) -> str:
    """1 BẢNG Screens gộp — merge bảng '## Screens' + section '## Descriptions' của file
    index thành 1 table có thêm cột 'Mô tả'. Trước đây nhúng nguyên index → bảng Screens
    ở trên, list Descriptions rời rạc bên dưới (BA muốn gộp chung). Parse header theo TÊN
    cột (không hard-code vị trí) để chịu được layout khác nhau.
    """
    if not screen_index_text:
        return "_Chưa có file index trong `ascii-wireframe/`._"
    body = strip_frontmatter(screen_index_text)
    m = re.search(r"##\s*Screens\b[^\n]*\n\s*(\|[^\n]+\|)\n\|[-\s:|]+\|\n((?:\|[^\n]+\|\n?)+)", body, re.DOTALL)
    if not m:
        return body  # không parse được → giữ nguyên (fallback an toàn)
    headers = [h.strip() for h in m.group(1).strip("|").split("|")]
    rows = []
    for line in m.group(2).strip().split("\n"):
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) == len(headers):
            rows.append(dict(zip(headers, cells)))
    if not rows:
        return body
    descs = parse_index_descriptions(screen_index_text)   # slug → mô tả

    def _slug(cell):   # bỏ [ ]( ) link, lấy slug trần
        mm = re.match(r"\[([^\]]+)\]", cell) or re.match(r"`([^`]+)`", cell)
        return (mm.group(1) if mm else cell).strip()

    # Cột giữ lại (gọn): #, Slug, Status, Thuộc flow, Used by, + Mô tả (từ Descriptions).
    keep = [h for h in headers if h.lower() not in ("figma", "html", "updated")]
    out = ["| " + " | ".join(keep + ["Mô tả"]) + " |",
           "|" + "|".join(["---"] * (len(keep) + 1)) + "|"]
    slug_col = next((h for h in headers if h.lower() == "slug"), None)
    for r in rows:
        slug = _slug(r.get(slug_col, "")) if slug_col else ""
        desc = descs.get(slug, "").replace("\n", " ").strip() or "—"
        cells = [r.get(h, "") for h in keep]
        out.append("| " + " | ".join(cells + [desc]) + " |")
    # Giữ ghi chú dưới bảng (vd 'Flow google-oauth dùng chung...') nếu có.
    note_m = re.search(r"\n(> [^\n]+(?:\n> [^\n]+)*)", body[m.end():])
    tail = f"\n\n{note_m.group(1)}" if note_m else ""
    return "\n".join(out) + tail


def build_wireframes_block(feature_dir: Path) -> str:
    """Nhúng THẲNG nội dung wireframe vào preview, theo flow. 2 nguồn:

    - ASCII: `ascii-wireframe/{flow}.md` — khung ASCII (```text) + bảng mô tả 5 cột. Nhúng
      nguyên (markdown), demote heading để nest dưới section Wireframes.
    - HTML: `html-wireframe/{flow}.html` (nếu có) — trích phần <body> render thật (B&W),
      bọc trong <div> để hiện cạnh ASCII. Chỉ lấy markup, KHÔNG lấy <html>/<head>.

    Mỗi flow 1 khối `### Flow: {flow}` với: (a) HTML render (nếu có) rồi (b) ASCII + bảng.
    Không có wireframe nào → trả ''.
    """
    ascii_dir = feature_dir / "ascii-wireframe"
    html_dir = feature_dir / "html-wireframe"
    ascii_files = list_ordered(ascii_dir, "*.md",
                               exclude={p.name for p in ascii_dir.glob("*-index.md")}) if ascii_dir.is_dir() else []
    if not ascii_files and not html_dir.is_dir():
        return ""
    parts = []
    for af in ascii_files:
        flow = af.stem
        body = strip_frontmatter(read_optional(af))
        # Bỏ H1 tiêu đề file (## Flow: ... trùng) + changelog cuối.
        body = re.sub(r"\A\s*#\s+[^\n]+\n+", "", body)
        body = re.sub(r"(?ms)^##\s+Changelog\b.*\Z", "", body).strip()
        chunk = [f"### Flow: {flow}"]
        # HTML wireframe render (nếu có file cùng flow) — nhúng body markup B&W.
        hf = html_dir / f"{flow}.html"
        if hf.is_file():
            html_raw = hf.read_text(encoding="utf-8", errors="ignore")
            bm = re.search(r"<body[^>]*>(.*)</body>", html_raw, re.DOTALL | re.IGNORECASE)
            inner = bm.group(1) if bm else html_raw
            # SCOPE CSS dưới `.wf-embed` (helper chung — bỏ reset toàn cục body/*/:root).
            style = extract_scoped_wireframe_css(html_raw)
            # QUAN TRỌNG: markdown-it coi dòng thụt ≥4 space = code block → render HTML thành
            # TEXT THÔ (`<div>...` hiện nguyên chữ). Và dòng TRỐNG giữa HTML block cắt block.
            # Fix: (1) de-indent mọi dòng (bỏ leading whitespace), (2) bỏ dòng trống bên trong
            # → markdown-it giữ nguyên 1 HTML block liền mạch, render thật.
            block = f'<div class="wf-embed">{style}{inner}</div>'
            block = "\n".join(l.strip() for l in block.split("\n") if l.strip())
            chunk.append(f"\n**HTML wireframe (render):**\n\n{block}\n")
        # ASCII + bảng mô tả.
        chunk.append(f"\n**ASCII wireframe + mô tả:**\n\n{body}")
        parts.append("\n".join(chunk))
    if not parts:
        return ""
    return "\n\n---\n\n".join(parts)


def build_designs_table(screens_rows: list) -> str:
    """Render designs table từ parsed Screens rows."""
    if not screens_rows:
        return "_Chưa có designs._"
    lines = ["| Screen | Status | Figma frame | HTML prototype | Updated |",
             "|---|---|---|---|---|"]
    for r in screens_rows:
        figma = f"[Open Figma]({r['figma']})" if r["figma"] != "—" else "—"
        html = f"[Open](../{r['html']})" if r["html"] != "—" else "—"
        lines.append(f"| `{r['slug']}` | {r['status']} | {figma} | {html} | {r['updated']} |")
    return "\n".join(lines)


# === "Tổng quan nhanh" (summary at a glance) — parse spec tables ===

# Từ khóa nhận diện mỗi loại section trong spec.md (heading level bất kỳ, optional
# numbering "2." / "b." + optional "(FR)" suffix). Dò theo keyword để không phụ thuộc
# tên section chính xác (spec khác nhau: "Functional Requirements" vs "... (FR)").
_SPEC_SECTION_KEYWORDS = {
    "FR": r"Functional Requirements",
    "NFR": r"Non-?Functional Requirements",
    "BR": r"Business Rules",
    "Error": r"Error Matrix",
    "Success": r"Success Criteria",
    "Actors": r"Actors",
    "Screens": r"Screens",
}


def _find_section_body(spec_body: str, keyword_re: str) -> str:
    """Trả về thân 1 section spec (tới heading kế cùng/​cao hơn level). '' nếu không thấy."""
    m = re.search(
        rf"^(#{{1,6}})[ \t]*(?:[0-9A-Za-z]{{1,3}}[.)][ \t]*)?{keyword_re}\b[^\n]*$",
        spec_body, re.IGNORECASE | re.MULTILINE,
    )
    if not m:
        return ""
    level = len(m.group(1))
    rest = spec_body[m.end():]
    end_rel = len(rest)
    for hm in re.finditer(r"^(#{1,6})[ \t]", rest, re.MULTILINE):
        if len(hm.group(1)) <= level:
            end_rel = hm.start()
            break
    return rest[:end_rel]


def _parse_md_table(body: str) -> tuple:
    """Parse markdown table ĐẦU TIÊN trong body. Trả (headers, rows) — rows là list các
    list cell (đã strip). ([], []) nếu không có table."""
    m = re.search(r"(\|[^\n]+\|\n\|[-\s:|]+\|\n((?:\|[^\n]+\|\n?)+))", body)
    if not m:
        return [], []
    lines = [ln for ln in m.group(1).strip().split("\n") if ln.strip().startswith("|")]
    if len(lines) < 3:
        return [], []
    headers = [c.strip() for c in lines[0].strip("|").split("|")]
    rows = []
    for line in lines[2:]:
        cells = [c.strip() for c in line.strip("|").split("|")]
        if cells:
            rows.append(cells)
    return headers, rows


def _extract_id_title(headers: list, rows: list) -> list:
    """Từ (headers, rows) rút [(id, title, priority)] — id = cột 0, title = cột đầu tiên
    KHÔNG phải ID/Priority, priority = cột header chứa 'priority'/'ưu tiên' nếu có.
    Bỏ row đầu rỗng ID."""
    if not rows:
        return []
    lower = [h.lower() for h in headers]
    # cột priority (nếu có)
    prio_idx = next((i for i, h in enumerate(lower)
                     if "priority" in h or "ưu tiên" in h or "uu tien" in h), None)
    # cột title = cột 1 nếu tồn tại và không phải priority, else fallback cột 1.
    title_idx = 1 if len(headers) > 1 else 0
    if title_idx == prio_idx and len(headers) > 2:
        title_idx = 2
    out = []
    for cells in rows:
        if not cells or not cells[0]:
            continue
        _id = re.sub(r"[`\[\]]", "", cells[0]).split("(")[0].strip()
        if not _id or not re.search(r"[A-Za-z]", _id):
            continue
        title = cells[title_idx].strip() if len(cells) > title_idx else ""
        # cắt title cho gọn (chỉ ID list, không phải bảng chi tiết)
        title = re.sub(r"\s+", " ", title)
        if len(title) > 70:
            title = title[:67].rstrip() + "…"
        prio = cells[prio_idx].strip() if (prio_idx is not None and len(cells) > prio_idx) else ""
        out.append((_id, title, prio))
    return out


def build_summary_section(spec: str, screen_index_text: str, feature: str) -> str:
    """Render 'Tổng quan nhanh' — counts line + ID list per type. Defensive: type nào
    không parse được → hiện '—', không crash."""
    if not spec:
        return ("_⚠ `srs/spec.md` chưa có nên chưa dựng được tổng quan. "
                "Chạy `/srs {f}` trước._").replace("{f}", feature)
    spec_body = strip_frontmatter(spec)

    parsed = {}
    for key, kw in _SPEC_SECTION_KEYWORDS.items():
        if key == "Screens":
            continue  # screens lấy từ file index riêng (dưới)
        sec = _find_section_body(spec_body, kw)
        parsed[key] = _extract_id_title(*_parse_md_table(sec)) if sec else []

    # Screens: đếm từ bảng ## Screens của file index ascii-wireframe.
    screen_rows = parse_screens_table(screen_index_text) if screen_index_text else []
    n_screens = len(screen_rows)

    fr = parsed.get("FR", [])
    # P0/P1/... breakdown nếu parse được priority.
    prio_counts = {}
    for _id, _t, p in fr:
        p = p.strip().upper()
        pm = re.search(r"P[0-9]", p)
        if pm:
            prio_counts[pm.group(0)] = prio_counts.get(pm.group(0), 0) + 1
    fr_label = str(len(fr))
    if prio_counts:
        breakdown = " / ".join(f"{k}: {prio_counts[k]}" for k in sorted(prio_counts))
        fr_label = f"{len(fr)} ({breakdown})"

    def _c(key):
        n = len(parsed.get(key, []))
        return str(n) if n else "—"

    # Bảng đếm gọn — mỗi loại 1 hàng, có link nhảy tới section chi tiết bên dưới.
    # KHÔNG list toàn bộ ID ở đây (trước đây nối bằng "·" thành 1 dòng dài, xấu + lặp
    # với bảng chi tiết ở section SRS Spec). Tổng quan = ĐẾM để liếc nhanh, không phải
    # copy lại nội dung. Muốn chi tiết → cuộn xuống "SRS Spec".
    lines = [
        "> Liếc nhanh quy mô SRS. Chi tiết từng mục ở section **SRS Spec** bên dưới.\n",
        "| Loại | Số lượng |",
        "|---|---|",
        f"| Functional Requirements (FR) | {fr_label if fr else '—'} |",
        f"| Non-Functional Requirements (NFR) | {_c('NFR')} |",
        f"| Business Rules (BR) | {_c('BR')} |",
        f"| Error codes | {_c('Error')} |",
        f"| Success Criteria | {_c('Success')} |",
        f"| Actors | {_c('Actors')} |",
        f"| Screens | {n_screens if n_screens else '—'} |",
    ]
    return "\n".join(lines) + "\n"


# === "Giới thiệu & Mô tả chung" (từ docs/_shared/) ===

# Marker của nội dung CHƯA điền (placeholder/meta-text) — theo ba-conventions.md Mục 0.
# Cell/dòng chứa các cụm này = stub, KHÔNG phải nội dung nghiệp vụ thật.
_PLACEHOLDER_MARKERS = re.compile(
    r"\(describe\)|\(mô tả\)|\(mo ta\)|\(TBD\)|initial stub|<describe>|"
    r"update when .* changes|high-level architecture and how main components interact",
    re.IGNORECASE,
)


def clean_shared_body(body: str, base_dir: Path) -> str:
    """Dọn 1 shared doc trước khi nhúng vào preview (ba-conventions Mục 0 — không đổ meta-text).

    Bỏ: blockquote hướng dẫn (> ...), section 'Change Log' stub, dòng/hàng bảng chỉ chứa
    placeholder '(describe)'/'initial stub', ảnh trỏ file không tồn tại (SVG demo rỗng).
    Trả về body sạch; nếu sau khi dọn còn quá ít nội dung thật → trả '' (caller skip cả doc).
    """
    body = strip_frontmatter(body)
    # Bỏ H1 đầu (tên doc trùng heading section → khỏi lặp 'System Overview' 2 lần).
    body = re.sub(r"\A\s*#\s+[^\n]+\n", "", body)
    lines, out, skip_section = body.split("\n"), [], False
    for ln in lines:
        s = ln.strip()
        # Bỏ hẳn section 'Change Log' (stub, không phải nội dung nghiệp vụ).
        if re.match(r"^#{1,6}\s+(change ?log|lịch sử thay đổi)\b", s, re.IGNORECASE):
            skip_section = True
            continue
        if skip_section:
            if re.match(r"^#{1,6}\s+\S", s):
                skip_section = False   # gặp heading mới → hết vùng changelog
            else:
                continue
        # Bỏ blockquote hướng dẫn (> ...) — chú giải cho người viết, không cho người đọc doc.
        if s.startswith(">"):
            continue
        # Bỏ hàng bảng chỉ toàn placeholder '(describe)' / stub.
        if s.startswith("|") and _PLACEHOLDER_MARKERS.search(s):
            continue
        # Bỏ dòng thường chỉ là placeholder.
        if _PLACEHOLDER_MARKERS.search(s) and len(s) < 120 and not s.startswith("|"):
            continue
        out.append(ln)
    cleaned = "\n".join(out)
    # Bỏ ảnh trỏ file không tồn tại (SVG demo rỗng → khoảng trắng khổng lồ trong preview).
    def _drop_missing_img(m):
        rel = m.group(1)
        if rel.startswith(("http://", "https://", "data:")):
            return m.group(0)
        return m.group(0) if (base_dir / rel).exists() else ""
    cleaned = re.sub(r"!\[[^\]]*\]\(([^)]+)\)", _drop_missing_img, cleaned)
    # Bỏ hàng bảng data rỗng: mọi ô (trừ ô đầu) trống hoặc chỉ dấu — bảng skeleton chưa điền.
    def _keep_table_row(ln):
        s = ln.strip()
        if not (s.startswith("|") and s.endswith("|")):
            return True
        if re.match(r"^\|[\s:|-]+\|$", s):   # dòng separator '|---|' — giữ
            return True
        cells = [c.strip() for c in s.strip("|").split("|")]
        # header (in đậm/tên cột) giữ; data-row mà mọi ô sau ô đầu đều rỗng → bỏ
        if len(cells) >= 2 and all(c == "" for c in cells[1:]):
            return False
        return True
    cleaned = "\n".join(l for l in cleaned.split("\n") if _keep_table_row(l))
    # Bảng chỉ còn header + separator (0 hàng data) → bỏ nguyên cụm bảng đó.
    cleaned = re.sub(r"(?m)^\|[^\n]+\|\n\|[\s:|-]+\|\n(?=\n|\Z)", "", cleaned)
    # Dọn separator '---' lửng (kể cả 2 cái dính nhau) + nhiều dòng trống liên tiếp.
    cleaned = re.sub(r"(?m)^-{3,}\s*$\n(\s*\n)*(?=^-{3,}\s*$)", "", cleaned)
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned).strip()
    cleaned = re.sub(r"(?m)^(-{3,}\s*\n?)+\Z", "", cleaned).strip()
    # Đủ nội dung thật? prose (ngoài heading/bảng/separator) ≥60 ký tự MỚI giữ.
    prose = re.sub(r"(?m)^(#{1,6}\s+.*|(\|.*\|)|-{3,}\s*)$", "", cleaned).strip()
    if len(prose) < 60:
        return ""   # toàn placeholder/skeleton → caller skip cả doc
    return cleaned


def glossary_to_table(body: str) -> str:
    """Glossary dạng list `### {term}` + prose + `**Appears in:**`/`**Aliases:**` khó đọc
    (mỗi term 1 heading + đoạn văn dài) → đổi thành 1 BẢNG `Thuật ngữ | Định nghĩa |
    Xuất hiện ở | Aliases` để quét nhanh (BA yêu cầu). Chỉ áp khi body CÓ ≥2 `### ` term
    dưới `## Glossary`; không khớp → trả None (giữ nguyên)."""
    gm = re.search(r"##\s*Glossary\b[^\n]*\n(.*)$", body, re.DOTALL | re.IGNORECASE)
    seg = gm.group(1) if gm else body
    terms = re.findall(r"(?ms)^###\s+(.+?)\n(.*?)(?=^###\s|\Z)", seg)
    if len(terms) < 2:
        return None
    rows = ["| Thuật ngữ | Định nghĩa | Xuất hiện ở | Aliases |",
            "|---|---|---|---|"]
    for term, blk in terms:
        appears = re.search(r"\*\*Appears in:\*\*\s*(.+)", blk)
        aliases = re.search(r"\*\*Aliases:\*\*\s*(.+)", blk)
        # định nghĩa = phần prose trước 2 dòng meta, gộp 1 dòng.
        defn = re.sub(r"(?s)\*\*(Appears in|Aliases):\*\*.*", "", blk).strip()
        defn = re.sub(r"\s*\n\s*", " ", defn).strip().replace("|", "\\|")
        ap = (appears.group(1).strip() if appears else "—").replace("|", "\\|")
        al = (aliases.group(1).strip() if aliases else "—").replace("|", "\\|")
        rows.append(f"| **{term.strip()}** | {defn} | {ap} | {al} |")
    pre = body[:gm.start(1)] if gm else ""   # giữ heading/blockquote trước Glossary (đã lọc)
    return pre + "\n".join(rows)


def build_intro_section(vault: Path) -> str:
    """Render section giới thiệu IEEE-830 front-matter từ các shared docs project-level.
    Doc thiếu HOẶC toàn placeholder → skip (không error, không đổ meta-text). Ảnh local inline."""
    shared = vault / "docs" / "_shared"
    sources = [
        ("Definitions / Glossary", "definitions.md"),
        ("Operating Environment", "operating-environment.md"),
        ("Conventions", "conventions.md"),
        ("System Overview", "system-overview.md"),
    ]
    parts = []
    for heading, fname in sources:
        text = read_optional(shared / fname)
        if not text:
            continue
        body = clean_shared_body(text, shared)
        if not body:          # toàn placeholder → bỏ hẳn doc này khỏi preview
            continue
        # Glossary (definitions.md): list term → BẢNG cho dễ đọc.
        if fname == "definitions.md":
            tbl = glossary_to_table(body)
            if tbl:
                parts.append(f"### {heading}\n\n{tbl.strip()}")
                continue
        body = inline_local_images(body, shared)
        # Demote heading còn lại 2 cấp (## → ####) để nằm gọn dưới H3 mỗi nguồn.
        body = re.sub(r"^(#{2,5})([ \t])", r"\1##\2", body, flags=re.MULTILINE)
        parts.append(f"### {heading}\n\n{body.strip()}")
    if not parts:
        return "_Chưa có nội dung shared thật trong `docs/_shared/` (definitions / operating-environment / conventions / system-overview còn là stub)._"
    return "\n\n---\n\n".join(parts)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("feature", help="feature slug")
    parser.add_argument("--out", default=None, help="override output path")
    parser.add_argument("--vault", default=".", help="vault root (default cwd)")
    args = parser.parse_args()

    vault = Path(args.vault).resolve()
    feature = args.feature
    feature_dir = vault / "docs" / feature
    today = date.today().isoformat()

    if not feature_dir.is_dir():
        sys.exit(f"❌ Feature folder không tồn tại: {feature_dir}")

    out_path = Path(args.out) if args.out else feature_dir / f"{feature}-preview.html"

    # === Read sources ===
    # (URD/BRD/PRD bỏ khỏi preview 2026-07-16 — preview để làm việc SRS, không xem lại requirements.)
    spec = read_optional(doc_path(feature_dir, "srs/spec.md"))
    erd = read_optional(doc_path(feature_dir, "srs/erd.md"))
    flows = read_optional(doc_path(feature_dir, "srs/flows.md"))
    states = read_optional(doc_path(feature_dir, "srs/states.md"))
    uc_index_path = find_index_file(feature_dir / "usecases")
    uc_index_text = read_optional(uc_index_path) if uc_index_path else ""
    # Use-case diagram (ảnh + bảng) nay nhúng thẳng trong {feature}-usecase-index.md
    # (không còn file diagram.md wrapper riêng — bỏ 2026-07-13).
    screen_index_path = find_index_file(feature_dir / "ascii-wireframe")
    screen_index_text = read_optional(screen_index_path) if screen_index_path else ""
    uc_files = list_ordered(feature_dir / "usecases", "uc-*.md")

    # === Compose content ===
    title = feature.replace("-", " ").title()
    screen_descriptions = parse_index_descriptions(screen_index_text)
    screen_flow_map = parse_screen_flow_map(screen_index_text)

    # Gom Open Questions từ mọi nguồn → render 1 section duy nhất ở cuối.
    open_questions = []

    # 1. Tổng quan nhanh (summary at a glance — parse spec tables).
    summary_block = build_summary_section(spec, screen_index_text, feature)

    # 2. Giới thiệu & Mô tả chung (từ docs/_shared/ — project-level shared docs).
    intro_block = build_intro_section(vault)

    # 3. SRS Spec
    spec_body = extract_open_questions(strip_frontmatter(spec), "SRS Spec", open_questions) \
        if spec else "_⚠ `srs/spec.md` chưa có. Chạy `/srs {feature}` trước._"

    # Base dir để resolve ảnh local nhúng trong srs/*.md (path tương đối với srs/).
    srs_dir = feature_dir / "srs"

    # 3. ERD
    erd_body = strip_frontmatter(erd) if erd else "_Chưa có ERD._"
    if isinstance(erd_body, str):
        erd_body = inline_local_images(erd_body, srs_dir)

    # 4. Flows
    flows_body = strip_frontmatter(flows) if flows else None
    # Inline ảnh local (vd swimlane .svg của /activity-swimlane) → self-contained,
    # path-proof (preview.html ở feature root, ảnh ở srs/). Làm TRƯỚC mọi nhúng vào spec.
    if flows_body:
        flows_body = inline_local_images(flows_body, srs_dir)

    # Nhúng full flows vào mục "Flows (tóm tắt...)" của spec — thay phần tóm tắt
    # bằng sequence diagram chi tiết tại chỗ. Nếu nhúng được → KHÔNG render
    # section "System Flows" riêng (tránh trùng). File MD gốc giữ nguyên.
    flows_inlined = False
    if isinstance(spec_body, str) and flows_body:
        spec_body, flows_inlined = replace_flows_summary_in_spec(spec_body, flows_body)

    # 5. States
    states_body = strip_frontmatter(states) if states else None
    if states_body:
        states_body = inline_local_images(states_body, srs_dir)

    # 6. Functions — mỗi UC/index 1 khối tiêu đề `## {title}` (H2 gốc → H3 sau demote toàn
    # section). Nội dung con của UC (`## Primary Actor`, `## Trigger`...) phải SÂU HƠN tiêu
    # đề UC → demote content thêm 1 cấp TẠI ĐÂY (## → ###) rồi mới ghép, để sau demote toàn
    # section thành H4 (con của H3 tiêu đề UC). Trước đây dùng `### {title}` + content `##`
    # → sau demote content H3 to hơn tiêu đề H4 (đảo cấp — lỗi BA thấy trên ảnh).
    def _strip_lead_h1(b: str) -> str:
        return re.sub(r"\A\s*#\s+[^\n]+\n+", "", b)
    fn_parts = []
    if uc_index_text:
        idx_body = _strip_lead_h1(extract_open_questions(
            strip_frontmatter(uc_index_text), "Use Cases Index", open_questions))
        fn_parts.append("## Use Cases Index\n\n" + demote_headings(idx_body))
    for f in uc_files:
        body = strip_frontmatter(read_optional(f))
        title_m = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
        heading = title_m.group(1).strip() if title_m else f.stem
        body = extract_open_questions(body, heading, open_questions)
        body = inject_inline_screens(body, feature_dir, screen_descriptions, screen_flow_map)
        # tiêu đề UC = H2 + anchor id theo SLUG (uc-signup-email) để link `uc-signup-email.md`
        # trong CRUD matrix / traceability scroll tới ĐÚNG UC đó, không về đầu section.
        aid = f'<a id="uc-{f.stem}"></a>'
        fn_parts.append(f"## {aid}{heading}\n\n" + demote_headings(_strip_lead_h1(body)))
    functions_block = "\n\n---\n\n".join(fn_parts) if fn_parts else "_Chưa có UCs._"

    # 7. Screens catalog — 1 BẢNG gộp (Screens table + Descriptions → cột 'Mô tả').
    screens_block = build_screens_catalog(screen_index_text)

    # 7b. Wireframes — nhúng THẲNG nội dung wireframe (ASCII + HTML) theo flow.
    wireframes_block = build_wireframes_block(feature_dir)

    # 8. Designs table (từ file index Screens table)
    screens_rows = parse_screens_table(screen_index_text)
    designs_block = build_designs_table(screens_rows)

    # === Build MD content ===
    # Section number LIÊN TỤC (1,2,3...) — Flows inline vào spec thì bỏ section riêng,
    # KHÔNG để lủng số (trước: 4.ERD → 6.State vì thiếu 5). Doc con demote 1 cấp để
    # `## ...` nội bộ thành H3+ con của section cha (TOC hết đè số). summary/intro/OQ
    # đã ở H3, không demote.
    # tuple: (tên, body, demote?, anchor-id ổn định để link .md nội bộ scroll tới)
    sections = [
        ("Tổng quan nhanh", summary_block, False, None),
        ("Giới thiệu & Mô tả chung", intro_block, False, None),
        ("SRS Spec", spec_body, True, "sec-spec"),
        ("ERD", erd_body, True, "sec-erd"),
    ]
    if flows_body and not flows_inlined:
        sections.append(("System Flows", flows_body, True, "sec-flows"))
    if states_body:
        sections.append(("State Diagrams", states_body, True, "sec-states"))
    sections += [
        ("Functions", functions_block, True, "sec-functions"),
        ("Screens (catalog)", screens_block, True, None),
    ]
    if wireframes_block:
        sections.append(("Wireframes", wireframes_block, True, "sec-wireframes"))
    sections += [
        ("Designs", designs_block, False, None),
        ("Open Questions (tổng hợp)", build_oq_section(open_questions), False, "sec-openq"),
    ]
    # flows inline vào spec → link '#sec-flows' trỏ tới spec (chứa Flows). states tương tự nếu skip.
    have = {a for *_, a in sections if a}
    md_parts = [f"# {title} — SRS Preview\n",
                f"> Active work viewer · Generated {today}\n"]
    for i, (name, body, do_demote, anchor) in enumerate(sections, 1):
        md_parts.append(section(f"{i}. {name}", demote_headings(body) if do_demote else body, anchor))

    md_content = "\n".join(md_parts)
    md_content = sanitize_embedded(md_content, feature_dir)

    # === Wrap với shared viewer ===
    html = build_viewer_html(
        title=title,
        subtitle="SRS Preview",
        date=today,
        md_content=md_content,
        regen_cmd=f"python3 _scripts/build-preview.py {feature}",
    )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(html, encoding="utf-8")

    size_kb = out_path.stat().st_size / 1024
    print(f"✅ Preview generated: {out_path}")
    print(f"   Sections: tổng-quan-nhanh · giới-thiệu(_shared) · spec"
          + (" (flows inline ở mục Flows)" if flows_inlined else "")
          + " · erd"
          + (" · flows" if (flows_body and not flows_inlined) else "")
          + (f" · states" if states_body else "")
          + f" · {len(uc_files)} functions · screens · designs · open-questions")
    print(f"   Size: {size_kb:.1f} KB")
    print(f"   Mở browser: double-click {out_path}")


if __name__ == "__main__":
    main()
