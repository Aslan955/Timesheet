#!/usr/bin/env python3
"""
Build stakeholder export package for 1 feature.

Usage: python3 _scripts/build-export.py <feature> --format md|html|pdf|docx [--out <path>]

Flow:
  1. Read source MD files (URD/BRD/PRD/spec/erd/flows/states/UCs/screens).
  2. Compose normalized markdown package (8 sections).
  3. Output based on format:
     - md:   write .md as-is
     - html: wrap with _viewer_wrapper (mermaid CDN client-side)
     - pdf:  pre-render mermaid via mmdc → PNG, pandoc → PDF (xelatex)
     - docx: pre-render mermaid via mmdc → PNG, pandoc → DOCX

Tool requirements:
  - md, html: python3 only
  - pdf:      mmdc + pandoc + xelatex (texlive)
  - docx:     mmdc + pandoc
"""

import argparse
import os
import re
import shutil
import subprocess
import sys
import zipfile
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
    get_frontmatter_changelog,
    parse_index_descriptions,
    parse_screen_flow_map,
    inject_inline_screens,
    inline_local_images,
    render_md_offline,
    demote_headings,
    sanitize_embedded,
)


def section(title: str, body: str) -> str:
    return f"## {title}\n\n{body.strip()}\n\n"


def compose_md(feature: str, vault: Path) -> tuple:
    """Compose 8-section markdown package. Returns (md_content, today_str)."""
    feature_dir = vault / "docs" / feature
    today = date.today().isoformat()

    if not feature_dir.is_dir():
        sys.exit(f"❌ Feature folder không tồn tại: {feature_dir}")

    urd = read_optional(doc_path(feature_dir, "urd.md"))
    brd = read_optional(doc_path(feature_dir, "brd.md"))
    prd = read_optional(doc_path(feature_dir, "prd.md"))
    spec = read_optional(doc_path(feature_dir, "srs/spec.md"))
    erd = read_optional(doc_path(feature_dir, "srs/erd.md"))
    flows = read_optional(doc_path(feature_dir, "srs/flows.md"))
    states = read_optional(doc_path(feature_dir, "srs/states.md"))
    uc_index_path = find_index_file(feature_dir / "usecases")
    uc_index = read_optional(uc_index_path) if uc_index_path else ""
    uc_diagram = read_optional(feature_dir / "usecases" / "diagram.md")
    screen_index_path = find_index_file(feature_dir / "ascii-wireframe")
    screen_index = read_optional(screen_index_path) if screen_index_path else ""
    brainstorm_files = list_glob(feature_dir / "brainstorms", "*.md")
    uc_files = list_glob(feature_dir / "usecases", "uc-*.md")
    screen_index_name = screen_index_path.name if screen_index_path else None
    screen_files = list_glob(feature_dir / "ascii-wireframe", "*.md",
                              exclude={screen_index_name} if screen_index_name else set())
    us_files = list_glob(feature_dir / "userstories", "us-*.md")
    traceability = read_optional(vault / "docs" / "_shared" / "traceability.md")

    # API test evidence — path co-located với checklist (test/api/) hoặc legacy (integration/)
    api_checklist_path = find_index_file(feature_dir / "test" / "api") or find_index_file(feature_dir / "integration")
    api_checklist = read_optional(feature_dir / "test" / "api" / "api-checklist.md") or ""
    api_tests_path = None
    for candidate in [feature_dir / "test" / "api" / "api-tests.md", feature_dir / "integration" / "api-tests.md"]:
        if candidate.is_file():
            api_tests_path = candidate
            break
    api_tests = read_optional(api_tests_path) if api_tests_path else ""
    api_map = read_optional(feature_dir / "integration" / "api-map.md") or read_optional(feature_dir / "test" / "api" / "api-map.md")
    api_summaries = list_glob(feature_dir / "integration", "api-summary*.md") + list_glob(feature_dir / "test" / "api", "api-summary*.md")

    # BPMN — index + .bpmn process list (link only, XML không nhúng vào MD)
    bpmn_index_path = find_index_file(feature_dir / "bpmn")
    bpmn_index = read_optional(bpmn_index_path) if bpmn_index_path else ""
    bpmn_files = list_glob(feature_dir / "bpmn", "*.bpmn")

    # D2 diagrams — 3 folder khả dĩ per naming-conventions (d2/, d2-erd/, d2-architect/), nhúng PNG nếu có
    d2_folders = [feature_dir / "d2", feature_dir / "d2-erd", feature_dir / "d2-architect"]
    d2_pngs = []
    for d2_dir in d2_folders:
        if d2_dir.is_dir():
            d2_pngs.extend(sorted(d2_dir.glob("*.png")))

    # UI test checklist/cases — path cố định theo naming-conventions
    ui_checklist_path = find_index_file(feature_dir / "test" / "checklist")
    ui_checklist = read_optional(ui_checklist_path) if ui_checklist_path else ""
    ui_testcases_path = find_index_file(feature_dir / "test" / "testcases")
    ui_testcases = read_optional(ui_testcases_path) if ui_testcases_path else ""

    # User guide — project-level docs/userguide/, không per-feature; match qua frontmatter scope
    userguide_files = []
    userguide_dir = vault / "docs" / "userguide"
    if userguide_dir.is_dir():
        for f in sorted(userguide_dir.glob("*.md")):
            text = read_optional(f)
            if f"scope: feature:{feature}" in text or re.search(rf"scope:\s*feature:{re.escape(feature)}\b", text):
                userguide_files.append(f)

    # 1. Executive Summary
    if urd:
        summary_src = strip_frontmatter(urd).split("\n## ")[0]
    elif brainstorm_files:
        bs = read_optional(brainstorm_files[0])
        summary_src = strip_frontmatter(bs).split("\n## ")[0]
    else:
        summary_src = f"_Feature **{feature}** — chưa có URD/BRD/PRD._"

    # 2. Included Documents
    uc_index_label = f"usecases/{uc_index_path.name}" if uc_index_path else "usecases/_index.md"
    screen_index_label = f"ascii-wireframe/{screen_index_path.name}" if screen_index_path else "ascii-wireframe/_index.md"
    included = []
    for label, val in [("urd.md", urd), ("brd.md", brd), ("prd.md", prd),
                       ("srs/spec.md", spec), ("srs/erd.md", erd),
                       ("srs/flows.md", flows), ("srs/states.md", states),
                       (uc_index_label, uc_index),
                       ("usecases/diagram.md", uc_diagram),
                       (screen_index_label, screen_index)]:
        if val:
            included.append(f"- `docs/{feature}/{label}`")
    for f in uc_files: included.append(f"- `docs/{feature}/usecases/{f.name}`")
    for f in screen_files: included.append(f"- `docs/{feature}/ascii-wireframe/{f.name}`")
    if api_checklist: included.append(f"- `docs/{feature}/{'test/api' if (feature_dir / 'test' / 'api').is_dir() else 'integration'}/api-checklist.md`")
    if api_tests_path: included.append(f"- `docs/{api_tests_path.relative_to(vault / 'docs')}`")
    if api_map: included.append(f"- `docs/{feature}/{'integration' if (feature_dir / 'integration' / 'api-map.md').is_file() else 'test/api'}/api-map.md`")
    for f in api_summaries: included.append(f"- `docs/{feature}/{f.parent.name}/{f.name}`")
    if bpmn_index: included.append(f"- `docs/{feature}/bpmn/{bpmn_index_path.name}`")
    for f in bpmn_files: included.append(f"- `docs/{feature}/bpmn/{f.name}`")
    for f in d2_pngs: included.append(f"- `docs/{feature}/{f.parent.name}/{f.name}`")
    if ui_checklist: included.append(f"- `docs/{feature}/test/checklist/{ui_checklist_path.name}`")
    if ui_testcases: included.append(f"- `docs/{feature}/test/testcases/{ui_testcases_path.name}`")
    for f in userguide_files: included.append(f"- `docs/userguide/{f.name}`")

    changelogs = []
    for name, src in [("SRS spec", spec), ("Use cases index", uc_index), ("Screens index", screen_index)]:
        if src:
            cl = get_frontmatter_changelog(src)
            if cl:
                changelogs.append((name, cl))

    included_block = "\n".join(included) + "\n\n"
    if changelogs:
        included_block += "**Changelog references:**\n\n"
        for name, entries in changelogs:
            included_block += f"\n_{name}:_\n"
            for e in entries[:5]:
                included_block += f"- {e}\n"

    # Doc con nhúng dưới `### {tên}` → demote_headings để `## ...` nội bộ thành H4+ (nest
    # đúng cấp, TOC hết phẳng/đè số — trước đây export có ~207 H2 vì không demote).
    # 3. Requirements
    req_parts = []
    if urd: req_parts.append("### URD\n\n" + demote_headings(strip_frontmatter(urd)))
    if brd: req_parts.append("### BRD\n\n" + demote_headings(strip_frontmatter(brd)))
    if prd: req_parts.append("### PRD\n\n" + demote_headings(strip_frontmatter(prd)))
    if not req_parts:
        req_parts.append("_⚠ Chưa có URD/BRD/PRD._")
    requirements = "\n\n---\n\n".join(req_parts)
    # spec_body nằm dưới `### SRS Spec` (H3) trong template → demote để Mục 1/2/3... của spec thành H4.
    spec_body = demote_headings(strip_frontmatter(spec)) if spec else "_⚠ SRS spec chưa có._"

    # 4. Stories
    if us_files:
        stories = "\n\n---\n\n".join(demote_headings(strip_frontmatter(read_optional(f))) for f in us_files)
    else:
        stories = "_⚠ Chưa có user stories._"

    # 5. Use Cases (with inline screens)
    screen_descriptions = parse_index_descriptions(screen_index) if screen_index else {}
    screen_flow_map = parse_screen_flow_map(screen_index) if screen_index else {}
    uc_parts = []
    if uc_index:
        uc_parts.append('### <a id="sec-functions"></a>Use Cases Index (master)\n\n' + demote_headings(strip_frontmatter(uc_index)))
    if uc_diagram:
        uc_parts.append("### Use Case Diagram\n\n" + demote_headings(strip_frontmatter(uc_diagram)))
    for f in uc_files:
        body = strip_frontmatter(read_optional(f))
        body = inject_inline_screens(body, feature_dir, screen_descriptions, screen_flow_map)
        # tiêu đề UC = H3 + anchor id theo slug (link CRUD/traceability scroll tới đúng UC)
        uc_parts.append(f'### <a id="uc-{f.stem}"></a>{f.stem}\n\n' + demote_headings(body))
    usecases_block = "\n\n---\n\n".join(uc_parts) if uc_parts else "_Chưa có UCs._"

    # 6. Diagrams + Wireframes — anchor id ổn định (sec-erd/flows/states) để link nội bộ
    # "chi tiết ở erd.md" (đã đổi thành #sec-erd) scroll tới đúng đây.
    diag_parts = []
    if erd: diag_parts.append('### <a id="sec-erd"></a>ERD\n\n' + demote_headings(strip_frontmatter(erd)))
    if flows: diag_parts.append('### <a id="sec-flows"></a>System Flows\n\n' + demote_headings(strip_frontmatter(flows)))
    if states: diag_parts.append('### <a id="sec-states"></a>State Diagrams\n\n' + demote_headings(strip_frontmatter(states)))
    if screen_index:
        diag_parts.append(
            "### Screens Index\n\n" + demote_headings(strip_frontmatter(screen_index))
            + "\n\n> _Full content per screen embed inline trong UC Mục f._"
        )
    proto_html = doc_path(feature_dir, "html-design/prototype.html")
    if proto_html.is_file():
        diag_parts.append(f"### HTML Prototype\n\n→ [Open prototype.html](../{feature}/html-design/prototype.html)")
    diagrams_block = "\n\n---\n\n".join(diag_parts) if diag_parts else "_Chưa có diagrams._"

    # 7. OQs / Risks
    oq_parts = []
    for src_name, src_text in [("brainstorm", "\n\n".join(read_optional(f) for f in brainstorm_files)),
                                ("URD", urd), ("BRD", brd), ("PRD", prd), ("SRS spec", spec)]:
        if not src_text:
            continue
        for s in re.split(r"\n(?=##\s)", strip_frontmatter(src_text)):
            if re.match(r"^##\s*\d*\.?\s*(open questions|risks|h\.)", s, re.IGNORECASE):
                oq_parts.append(f"**Từ {src_name}:**\n\n{s}")
    for f in uc_files:
        body = strip_frontmatter(read_optional(f))
        for s in re.split(r"\n(?=##\s)", body):
            if re.match(r"^##\s*h\.", s, re.IGNORECASE):
                oq_parts.append(f"**Từ {f.stem}:**\n\n{s}")
    oqs = "\n\n---\n\n".join(oq_parts) if oq_parts else "_Không phát hiện OQ._"

    # 8. Traceability
    trace_body = strip_frontmatter(traceability) if traceability else \
        f"_⚠ traceability.md chưa có. Chạy `/gap --scope feature --feature {feature}`._"

    # 9. API Test Evidence
    api_parts = []
    for f in api_summaries:
        api_parts.append(f"### API Summary — {f.stem}\n\n" + strip_frontmatter(read_optional(f)))
    if api_checklist:
        api_parts.append("### API Checklist\n\n" + strip_frontmatter(api_checklist))
    if api_map:
        api_parts.append("### API Field Mapping\n\n" + strip_frontmatter(api_map))
    if api_tests:
        api_parts.append("### API Test Cases + Run Evidence\n\n" + strip_frontmatter(api_tests))
    api_evidence_block = "\n\n---\n\n".join(api_parts) if api_parts else "_Feature không tích hợp API bên ngoài, hoặc chưa chạy `/api-checklist` + `/api-test`._"

    # 10. BPMN Process Diagrams (index + link .bpmn; XML không nhúng — mở qua editor/viewer)
    bpmn_parts = []
    if bpmn_index:
        bpmn_parts.append("### BPMN Index\n\n" + strip_frontmatter(bpmn_index))
    for f in bpmn_files:
        bpmn_parts.append(f"- `{f.name}` → import Camunda/Bizagi/draw.io, hoặc mở `{feature}-bpmn-editor.html` để xem/sửa trực quan.")
    bpmn_block = "\n\n".join(bpmn_parts) if bpmn_parts else "_Feature không có quy trình BPMN, hoặc chưa chạy `/bpmn`._"

    # 11. D2 Diagrams (native PNG embed — d2/, d2-erd/, d2-architect/)
    d2_parts = []
    for png in d2_pngs:
        rel = f"../{feature}/{png.parent.name}/{png.name}"
        d2_parts.append(f"### {png.stem}\n\n![{png.stem}]({rel})")
    d2_block = "\n\n---\n\n".join(d2_parts) if d2_parts else "_Feature không có D2 diagram (activity/ERD/architecture), hoặc chưa chạy `/d2-activity`, `/d2-erd`, `/d2-architect`._"

    # 12. UI Test Checklist & Cases
    ui_test_parts = []
    if ui_checklist:
        ui_test_parts.append("### Test Checklist\n\n" + strip_frontmatter(ui_checklist))
    if ui_testcases:
        ui_test_parts.append("### Test Cases\n\n" + strip_frontmatter(ui_testcases))
    ui_test_block = "\n\n---\n\n".join(ui_test_parts) if ui_test_parts else "_Chưa chạy `/test-checklist` + `/test-cases` cho feature này._"

    # 13. User Guide (link — project-level docs/userguide/, không nhúng full nội dung vì có thể rất dài)
    if userguide_files:
        ug_lines = [f"- [{f.stem}](../userguide/{f.name})" for f in userguide_files]
        userguide_block = "Cẩm nang vận hành liên quan feature này (xem file gốc để đọc đầy đủ, không nhúng vào package để tránh phình dung lượng):\n\n" + "\n".join(ug_lines)
    else:
        userguide_block = f"_Chưa có user guide scope `feature:{feature}`, hoặc chưa chạy `/userguide`._"

    title = feature.replace("-", " ").title()
    # Cover page: 1 khối đầu tài liệu, style riêng qua class `.cover` (CSS in PDF/HTML thêm
    # break-after:page). Đứng trước mọi section — cảm giác "gói chuyên nghiệp". Xem P1 #3.
    cover = f"""<div class="cover">

# {title}

## Gói tài liệu nghiệp vụ (BA Export Package)

**Feature:** `{feature}`
**Ngày xuất:** {today}
**Phạm vi:** 1 feature — toàn bộ tài liệu BA đã có

</div>
"""
    package = f"""---
type: export-package
scope: feature
feature: {feature}
status: generated
updated: {today}
---

{cover}

# Export Package: {title}

> Generated: {today}
> Scope: feature

{section("1. Executive Summary", summary_src)}
{section("2. Included Documents", included_block)}
{section("3. Requirements Summary", requirements)}

### <a id="sec-spec"></a>SRS Spec

{spec_body}

{section("4. User Stories & Acceptance Criteria", stories)}
{section("5. Use Cases", usecases_block)}
{section("6. Diagrams / Wireframes", diagrams_block)}
{section("7. Open Questions / Risks", oqs)}
{section("8. Traceability Snapshot", trace_body)}
{section("9. API Test Evidence", api_evidence_block)}
{section("10. BPMN Process Diagrams", bpmn_block)}
{section("11. D2 Diagrams", d2_block)}
{section("12. UI Test Checklist & Cases", ui_test_block)}
{section("13. User Guide", userguide_block)}
"""
    # Dọn link vỡ: wikilink [[]] → text, link .md → nhảy nội bộ (#sec / #uc-*), <img> file
    # không tồn tại → bỏ. Export là 1 file gói nên link tới file .md khác vô nghĩa (trước có
    # 12 link .md vỡ). Anchor #sec-* khớp id `<a id>` mà build_viewer_html/section gán.
    package = sanitize_embedded(package, feature_dir)
    return package, today


# === Mermaid pre-render (cho PDF/DOCX) ===

MERMAID_RE = re.compile(r"^```mermaid\n(.+?)\n```$", re.MULTILINE | re.DOTALL)


def prerender_mermaid(md_content: str, assets_dir: Path) -> tuple:
    """
    Replace mỗi ```mermaid block bằng ![](assets/diagram-NNN.png).
    Render qua mmdc. Return (new_md, list of (idx, ok, error_msg)).
    """
    assets_dir.mkdir(parents=True, exist_ok=True)
    results = []
    counter = [0]

    def replace_block(match):
        counter[0] += 1
        idx = counter[0]
        code = match.group(1).strip()
        mmd_path = assets_dir / f"diagram-{idx:03d}.mmd"
        png_path = assets_dir / f"diagram-{idx:03d}.png"
        mmd_path.write_text(code, encoding="utf-8")
        try:
            env = os.environ.copy()
            # puppeteer cache dir for mmdc — default ~/.cache/puppeteer may be root-owned
            env.setdefault("PUPPETEER_CACHE_DIR", str(Path.home() / ".puppeteer-cache"))
            result = subprocess.run(
                # -s 3: scale ×3 → PNG nét cao, không nhòe khi in giấy / zoom trong Word.
                # (mermaid-cli best practice — xem docs/reports/export-skill-review.md P0 #2.)
                ["mmdc", "-i", str(mmd_path), "-o", str(png_path),
                 "-w", "1400", "-s", "3", "-b", "white", "--theme", "default"],
                capture_output=True, text=True, timeout=60, env=env,
            )
            if result.returncode == 0 and png_path.exists():
                results.append((idx, True, None))
                # Use relative path so pandoc finds it from output dir
                rel = png_path.relative_to(assets_dir.parent.parent)
                return f"![Diagram {idx}]({rel})"
            else:
                err = result.stderr.strip()[:200]
                results.append((idx, False, err))
                return f"\n_⚠ Diagram {idx} render failed: {err}_\n\n```\n{code}\n```\n"
        except (subprocess.TimeoutExpired, FileNotFoundError) as e:
            results.append((idx, False, str(e)))
            return f"\n_⚠ Diagram {idx} render failed: {e}_\n\n```\n{code}\n```\n"

    new_md = MERMAID_RE.sub(replace_block, md_content)
    return new_md, results


_LOCAL_IMG_RE = re.compile(r'!\[([^\]]*)\]\(([^)]+)\)')


def prerender_local_images(md_content: str, assets_dir: Path, base_dir: Path,
                           chrome: str = None) -> tuple:
    """Cho PDF/DOCX: đổi ![](x.svg) local → ![](assets/x.png) để pandoc nhúng được.

    pandoc không render SVG tốt (đặc biệt →DOCX). Chiến lược:
    - Có sẵn `x.png` cạnh `x.svg` (skill /activity-swimlane, /d2-* render kèm PNG) → dùng luôn.
    - Không có PNG → convert SVG qua Chrome headless (screenshot đúng viewBox).
    - PNG có sẵn (`![](x.png)`) → copy vào assets, đổi path.
    - Convert fail → giữ link gốc + note (pandoc có thể vẫn thử nhúng SVG).
    Return (new_md, list of (name, ok, err)).
    """
    assets_dir.mkdir(parents=True, exist_ok=True)
    results = []

    def to_png_via_chrome(svg_path: Path, png_path: Path) -> bool:
        if not chrome:
            return False
        try:
            # đọc viewBox để set window-size đúng tỉ lệ (tránh méo/cắt)
            svg_txt = svg_path.read_text(encoding="utf-8")
            m = re.search(r'viewBox="[\d.]+ [\d.]+ ([\d.]+) ([\d.]+)"', svg_txt)
            w, h = (int(float(m.group(1))), int(float(m.group(2)))) if m else (1400, 1000)
            w = min(max(w, 400), 4000); h = min(max(h, 300), 6000)
            subprocess.run(
                [chrome, "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
                 "--default-background-color=FFFFFFFF", f"--window-size={w},{h}",
                 f"--screenshot={png_path}", f"file://{svg_path.resolve()}"],
                capture_output=True, text=True, timeout=60,
            )
            return png_path.exists() and png_path.stat().st_size > 500
        except (subprocess.TimeoutExpired, FileNotFoundError):
            return False

    def repl(m):
        alt, src = m.group(1), m.group(2).strip()
        if src.startswith(("http://", "https://", "data:")):
            return m.group(0)
        clean = src.split("#")[0].split("?")[0]
        img_path = (base_dir / clean).resolve()
        ext = img_path.suffix.lower()
        if ext not in (".svg", ".png", ".jpg", ".jpeg", ".gif"):
            return m.group(0)
        if not img_path.is_file():
            return m.group(0)
        name = img_path.stem
        if ext in (".png", ".jpg", ".jpeg", ".gif"):
            dst = assets_dir / img_path.name
            dst.write_bytes(img_path.read_bytes())
            results.append((img_path.name, True, None))
            rel = dst.relative_to(assets_dir.parent.parent)
            return f"![{alt}]({rel})"
        # .svg: ưu tiên PNG có sẵn cạnh bên, else convert qua chrome
        sibling_png = img_path.with_suffix(".png")
        dst_png = assets_dir / f"{name}.png"
        if sibling_png.is_file():
            dst_png.write_bytes(sibling_png.read_bytes())
            ok = True
        else:
            ok = to_png_via_chrome(img_path, dst_png)
        if ok:
            results.append((img_path.name, True, None))
            rel = dst_png.relative_to(assets_dir.parent.parent)
            return f"![{alt}]({rel})"
        results.append((img_path.name, False, "no PNG + chrome convert fail"))
        return m.group(0)  # giữ link .svg gốc, pandoc tự xử

    new_md = _LOCAL_IMG_RE.sub(repl, md_content)
    return new_md, results


# === Tool detection ===

def check_tools(needs: list) -> list:
    """Return list of missing tool names."""
    return [t for t in needs if shutil.which(t) is None]


def install_hints(missing: list) -> str:
    hints = []
    if "mmdc" in missing:
        hints.append("  - mmdc:    npm i -g @mermaid-js/mermaid-cli")
    if "pandoc" in missing:
        hints.append("  - pandoc:  download pkg https://github.com/jgm/pandoc/releases hoặc brew install pandoc")
    if "chrome" in missing:
        hints.append("  - chrome:  install mmdc trước (Chrome bundle qua puppeteer cache ~/.puppeteer-cache)")
    return "\n".join(hints)


def find_chrome() -> str:
    """Locate Chrome binary — prefer puppeteer cache (bundled by mmdc)."""
    candidates = [
        Path.home() / ".puppeteer-cache" / "chrome",
        Path.home() / ".cache" / "puppeteer" / "chrome",
    ]
    for root in candidates:
        if root.is_dir():
            found = list(root.glob("*/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"))
            if not found:
                found = list(root.glob("*/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"))
            if found:
                return str(found[0])
    # System Chrome fallback
    sys_paths = [
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ]
    for p in sys_paths:
        if Path(p).is_file():
            return p
    return None


# === Pandoc conversion ===

def md_to_pdf_via_chrome(md_path: Path, pdf_path: Path, chrome: str) -> int:
    """pandoc md → standalone HTML (embed images base64) → Chrome headless → PDF."""
    html_path = md_path.with_suffix(".html")
    css = """
    @page { size: A4; margin: 18mm 16mm; }
    /* Cover page: căn giữa, chiếm gần trọn trang đầu, sang trang mới sau đó. */
    .cover { text-align: center; padding-top: 90mm; page-break-after: always; }
    .cover h1 { font-size: 32pt; border: none; margin-bottom: 8px; }
    .cover h2 { font-size: 15pt; color: #666; border: none; font-weight: 400; margin-top: 0; }
    .cover p { font-size: 12pt; color: #333; line-height: 1.9; }
    body { font-family: -apple-system, "Helvetica Neue", "Arial", sans-serif; line-height: 1.5; font-size: 11pt; color: #222; }
    h1 { font-size: 22pt; border-bottom: 2px solid #333; padding-bottom: 6px; margin-top: 28px; }
    h2 { font-size: 16pt; color: #1a4a8c; margin-top: 24px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
    h3 { font-size: 13pt; color: #333; margin-top: 18px; }
    h4 { font-size: 11pt; color: #555; }
    code, pre { font-family: "SF Mono", "Menlo", "Consolas", monospace; font-size: 9pt; }
    pre { background: #f5f5f5; border: 1px solid #ddd; padding: 8px; border-radius: 4px; overflow-x: auto; white-space: pre-wrap; }
    table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 9.5pt; }
    th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; vertical-align: top; }
    th { background: #f0f0f0; font-weight: 600; }
    img { max-width: 100%; height: auto; page-break-inside: avoid; }
    hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
    blockquote { border-left: 3px solid #1a4a8c; padding-left: 12px; color: #555; margin-left: 0; }
    a { color: #1a4a8c; text-decoration: none; }
    """
    css_path = md_path.parent / "_export-pdf.css"
    css_path.write_text(css, encoding="utf-8")
    # pandoc md → standalone HTML with images embedded as base64
    cmd_html = [
        "pandoc", str(md_path), "-o", str(html_path),
        "--standalone", "--embed-resources",
        "--metadata", "title=Export Package",
        "-c", str(css_path),
        "--toc", "--toc-depth=2",
        "--resource-path=" + str(md_path.parent),
    ]
    r1 = subprocess.run(cmd_html, capture_output=True, text=True)
    if r1.returncode != 0:
        print(f"❌ pandoc → HTML failed:\n{r1.stderr}", file=sys.stderr)
        return r1.returncode
    # Chrome headless print → PDF
    cmd_pdf = [
        chrome, "--headless=new", "--disable-gpu", "--no-sandbox",
        f"--print-to-pdf={pdf_path}",
        "--no-pdf-header-footer",
        f"file://{html_path.resolve()}",
    ]
    r2 = subprocess.run(cmd_pdf, capture_output=True, text=True, timeout=180)
    html_path.unlink(missing_ok=True)
    css_path.unlink(missing_ok=True)
    if r2.returncode != 0:
        print(f"❌ Chrome print → PDF failed:\n{r2.stderr}", file=sys.stderr)
        return r2.returncode
    return 0


def pandoc_to_docx(md_path: Path, docx_path: Path) -> int:
    cmd = [
        "pandoc", str(md_path), "-o", str(docx_path),
        "--toc", "--toc-depth=2",
        "--resource-path=" + str(md_path.parent),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"❌ Pandoc DOCX failed:\n{result.stderr}", file=sys.stderr)
    return result.returncode


# === Render-and-verify tối thiểu (P0 theo audit report — không cần Playwright/visual-regression
# đầy đủ, chỉ cần bắt file rỗng/vỡ trước khi báo "xong") ===

def verify_pdf(pdf_path: Path) -> list:
    """Đếm trang qua /Count trong Pages tree (field chuẩn PDF, Chrome print-to-pdf luôn ghi) +
    check file size hợp lý theo số trang. Không cần pdfinfo/poppler (không có sẵn trên máy này).
    Trả về list cảnh báo (rỗng = OK)."""
    warnings = []
    try:
        data = pdf_path.read_bytes()
    except OSError as e:
        return [f"Không đọc được file: {e}"]
    if len(data) < 2000:
        warnings.append(f"File quá nhỏ ({len(data)} bytes) — nghi ngờ rỗng/hỏng.")
        return warnings
    m = re.search(rb"/Type\s*/Pages.*?/Count\s+(\d+)", data, re.DOTALL)
    if not m:
        warnings.append("Không tìm thấy /Count trong Pages tree — PDF có thể không chuẩn hoặc rỗng.")
        return warnings
    page_count = int(m.group(1))
    if page_count == 0:
        warnings.append("PDF có 0 trang.")
    elif len(data) / page_count < 1500:
        # Trang có nội dung thật (text + có thể ảnh) hiếm khi <1.5KB/trang trung bình;
        # ngưỡng thấp để tránh false-positive trên package ngắn, chỉ bắt case rõ ràng bất thường.
        warnings.append(f"{page_count} trang nhưng chỉ {len(data)//1024}KB — trung bình <1.5KB/trang, nghi ngờ nhiều trang trắng.")
    return warnings


def verify_docx(docx_path: Path) -> list:
    """DOCX là ZIP — validate cấu trúc + document.xml không rỗng. Không có LibreOffice trên máy
    này nên không render lại thành ảnh; đây là mức tối thiểu bắt file hỏng/rỗng thật sự."""
    warnings = []
    try:
        with zipfile.ZipFile(docx_path) as z:
            bad = z.testzip()
            if bad:
                warnings.append(f"ZIP hỏng tại: {bad}")
                return warnings
            if "word/document.xml" not in z.namelist():
                warnings.append("Thiếu word/document.xml — không phải DOCX hợp lệ.")
                return warnings
            doc_xml = z.read("word/document.xml")
            if len(doc_xml) < 500:
                warnings.append(f"document.xml quá nhỏ ({len(doc_xml)} bytes) — nghi ngờ rỗng.")
            text_runs = len(re.findall(rb"<w:t[ >]", doc_xml))
            if text_runs < 10:
                warnings.append(f"Chỉ {text_runs} text run trong document.xml — nghi ngờ thiếu nội dung.")
    except zipfile.BadZipFile:
        warnings.append("Không phải file ZIP hợp lệ (DOCX hỏng).")
    return warnings


def verify_html(html_path: Path, chrome: str) -> list:
    """Mở qua Chrome headless, dump DOM (xác nhận load được) + đọc console log tìm error thật.
    Chrome ghi console vào stderr khi bật --enable-logging=stderr --v=1 (không cần CDP/Playwright)."""
    warnings = []
    if not chrome:
        return ["Không có Chrome để verify — bỏ qua bước này (không phải lỗi export)."]
    dom_out = html_path.parent / f"_verify-dom-{html_path.stem}.html"
    try:
        result = subprocess.run(
            [chrome, "--headless=new", "--disable-gpu", "--no-sandbox",
             "--enable-logging=stderr", "--v=1", "--virtual-time-budget=5000",
             "--dump-dom", f"file://{html_path.resolve()}"],
            capture_output=True, text=True, timeout=30,
        )
        dom = result.stdout
        if len(dom) < 500:
            warnings.append(f"DOM output quá nhỏ ({len(dom)} bytes) — trang có thể chưa render/rỗng.")
        # Chrome --enable-logging ghi console.log/warn/error CÙNG marker "INFO:CONSOLE" — không phân
        # biệt được level qua stderr (giới hạn thật, cần CDP/Playwright mới tách được). Coi MỌI
        # console message là đáng nghi: package export là văn bản tĩnh, không nên chạy JS log gì cả.
        console_lines = [line for line in result.stderr.split("\n") if "INFO:CONSOLE" in line]
        if console_lines:
            warnings.append(f"{len(console_lines)} console message khi mở HTML (page tĩnh không nên có): " + "; ".join(console_lines[:3])[:300])
    except subprocess.TimeoutExpired:
        warnings.append("Chrome timeout khi mở HTML (>30s) — trang có thể treo/quá nặng.")
    except OSError as e:
        warnings.append(f"Không chạy được Chrome: {e}")
    finally:
        dom_out.unlink(missing_ok=True)
    return warnings


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("feature")
    parser.add_argument("--format", default="md", choices=["md", "html", "pdf", "docx"])
    parser.add_argument("--out", default=None)
    parser.add_argument("--vault", default=".")
    args = parser.parse_args()

    vault = Path(args.vault).resolve()
    feature = args.feature

    # Tool check
    tool_needs = {"md": [], "html": [], "pdf": ["mmdc", "pandoc"],
                  "docx": ["mmdc", "pandoc"]}
    missing = check_tools(tool_needs[args.format])
    # Chrome cần cho PDF (bắt buộc, print engine) và cho verify HTML (tối thiểu, không bắt buộc —
    # thiếu Chrome vẫn export HTML được, chỉ bỏ qua bước verify console error).
    chrome = find_chrome()
    if args.format == "pdf" and not chrome:
        missing.append("chrome")
    if missing:
        print(f"❌ Format `{args.format}` cần tools: {', '.join(missing)}", file=sys.stderr)
        print("Install:\n" + install_hints(missing), file=sys.stderr)
        sys.exit(2)

    # Compose md
    md_content, today = compose_md(feature, vault)
    title = feature.replace("-", " ").title()

    exports_dir = vault / "docs" / "exports"
    exports_dir.mkdir(parents=True, exist_ok=True)
    base = f"{today}-feature-{feature}-package"

    # Always write intermediate md (needed for pdf/docx pre-render)
    md_path = exports_dir / f"{base}.md"

    if args.format == "md":
        out_path = Path(args.out) if args.out else md_path
        out_path.write_text(md_content, encoding="utf-8")
        print(f"✅ Markdown: {out_path} ({len(md_content)//1024} KB)")
        return

    if args.format == "html":
        # HTML export = SELF-CONTAINED THẬT (offline, không CDN sống): render MD→HTML + mermaid→SVG
        # inline ngay lúc build (Python). Stakeholder mở qua email không cần mạng vẫn đủ nội dung.
        # Khác /preview (online CDN, regen tại chỗ). Xem export-skill-review.md P0 #1.
        # 1) Inline ảnh local (.svg/.png) — swimlane PlantUML, D2 — self-contained + hết méo.
        html_md = inline_local_images(md_content, vault / "docs" / feature / "srs")
        # 2) Render MD + mermaid→SVG server-side.
        svg_tmp = exports_dir / f"_tmp-svg-{base}"
        try:
            prerendered, mmd_results = render_md_offline(html_md, svg_tmp)
        finally:
            shutil.rmtree(svg_tmp, ignore_errors=True)
        mmd_ok = sum(1 for _, ok, _ in mmd_results if ok)
        mmd_fail = sum(1 for _, ok, _ in mmd_results if not ok)
        html = build_viewer_html(
            title=title, subtitle="Export Package", date=today,
            md_content="", offline=True, prerendered_html=prerendered,
            regen_cmd=f"python3 _scripts/build-export.py {feature} --format html",
        )
        out_path = Path(args.out) if args.out else exports_dir / f"{base}.html"
        out_path.write_text(html, encoding="utf-8")
        size = out_path.stat().st_size / 1024
        print(f"✅ HTML (self-contained, offline): {out_path} ({size:.1f} KB)")
        if mmd_results:
            print(f"   Mermaid: {mmd_ok} OK, {mmd_fail} failed (fallback code block)")
        print(f"   Mở browser: double-click {out_path} (không cần mạng)")
        warnings = verify_html(out_path, chrome)
        if warnings:
            print("   ⚠ Verify phát hiện vấn đề:")
            for w in warnings:
                print(f"     - {w}")
        else:
            print("   ✓ Verify: DOM load OK, không console error.")
        return

    # PDF/DOCX: pre-render diagrams → write intermediate md with PNG refs → pandoc
    assets_dir = exports_dir / "assets" / f"{today}-feature-{feature}"
    # 1) Ảnh local nhúng (.svg swimlane/D2, .png) → PNG trong assets (pandoc nhúng được).
    #    Ưu tiên PNG có sẵn cạnh .svg; else convert qua Chrome.
    md_content, img_results = prerender_local_images(
        md_content, assets_dir, vault / "docs" / feature / "srs", chrome)
    img_ok = sum(1 for _, ok, _ in img_results if ok)
    img_fail = sum(1 for _, ok, _ in img_results if not ok)
    if img_results:
        print(f"→ Ảnh nhúng (.svg/.png): {img_ok} OK, {img_fail} failed → {assets_dir}/")
        for name, ok, err in img_results:
            if not ok:
                print(f"     ⚠ {name}: {err}")
    # 2) Mermaid fenced blocks → PNG.
    print(f"→ Pre-rendering mermaid → {assets_dir}/")
    md_with_pngs, results = prerender_mermaid(md_content, assets_dir)
    ok_count = sum(1 for _, ok, _ in results if ok)
    fail_count = sum(1 for _, ok, _ in results if not ok)
    print(f"   Mermaid: {ok_count} OK, {fail_count} failed")

    # Write intermediate md (with PNG refs) for pandoc
    intermediate = exports_dir / f"_tmp-{base}.md"
    intermediate.write_text(md_with_pngs, encoding="utf-8")

    try:
        if args.format == "pdf":
            out_path = Path(args.out) if args.out else exports_dir / f"{base}.pdf"
            rc = md_to_pdf_via_chrome(intermediate, out_path, chrome)
        else:  # docx
            out_path = Path(args.out) if args.out else exports_dir / f"{base}.docx"
            rc = pandoc_to_docx(intermediate, out_path)
        if rc == 0:
            size = out_path.stat().st_size / 1024
            print(f"✅ {args.format.upper()}: {out_path} ({size:.1f} KB)")
            print(f"   Assets: {assets_dir} ({ok_count} PNG)")
            if fail_count:
                print(f"   ⚠ {fail_count} diagrams failed render — xem code block fallback trong file.")
            warnings = verify_pdf(out_path) if args.format == "pdf" else verify_docx(out_path)
            if warnings:
                print("   ⚠ Verify phát hiện vấn đề:")
                for w in warnings:
                    print(f"     - {w}")
            else:
                print(f"   ✓ Verify: {args.format.upper()} không rỗng/hỏng.")
        else:
            sys.exit(rc)
    finally:
        intermediate.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
