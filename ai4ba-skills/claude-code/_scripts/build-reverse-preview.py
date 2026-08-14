#!/usr/bin/env python3
"""
build-reverse-preview.py — HTML viewer cho BỘ SRS tái lập (họ reverse).

Song sinh build-preview.py, nhưng đọc `docs/_reverse/{feature}/` (output của /reverse-doc và
/code-to-srs) thay vì `docs/{feature}/`. Khác biệt cốt lõi so với /preview:
  - GIỮ cột Nhãn (✅/🔵/🟡) trong mọi bảng (không strip — đây là giá trị của reverse).
  - Banner confidence (parse frontmatter `confidence_summary`) + cảnh báo "CHƯA duyệt".
  - Section Gaps/OQ nổi bật (reverse-gaps.md) + Mục 0 provenance (giữ trong spec).
  - Nhúng _evidence.md (truy vết code→luồng) — CHỈ khi tồn tại (reverse-doc không sinh file này).
  - KHÔNG có wireframe/designs/Figma (reverse không sinh screen).

Usage: python3 _scripts/build-reverse-preview.py <feature> [--out <path>] [--vault <root>]

Tái dùng trọn _viewer_wrapper.py (chrome: nested TOC + mermaid zoom modal + inline svg/img).
"""
import argparse
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _viewer_wrapper import (  # noqa: E402
    build_viewer_html,
    read_optional,
    strip_frontmatter,
    list_glob,
    find_index_file,
    demote_headings,
    sanitize_embedded,
    inline_local_images,
)


def section(title: str, body: str, anchor: str = None) -> str:
    """Bọc 1 section H2 + anchor ổn định (giống build-preview.section)."""
    aid = f'<a id="{anchor}"></a>' if anchor else ""
    return f"## {aid}{title}\n\n{body.strip()}\n\n"


def parse_confidence_summary(spec_text: str) -> str:
    """Lấy chuỗi confidence_summary từ frontmatter spec (vd '✅18 🔵2 🟡11'). '' nếu không có."""
    m = re.search(r'^confidence_summary:\s*["\']?(.+?)["\']?\s*$', spec_text, re.MULTILINE)
    return m.group(1).strip() if m else ""


def parse_status(spec_text: str) -> str:
    m = re.search(r'^status:\s*(\S+)', spec_text, re.MULTILINE)
    return m.group(1).strip() if m else "draft"


def build_confidence_banner(spec_text: str, feature: str) -> str:
    """Badge gọn 1 dòng: trạng thái + chỉ số confidence + chú giải nhãn ngắn (KHÔNG meta-text)."""
    conf = parse_confidence_summary(spec_text)
    status = parse_status(spec_text)
    conf_part = f" · **{conf}**" if conf else ""
    return (
        f"> Tái lập (chưa duyệt) · `{status}`{conf_part}  \n"
        f"> Nhãn: ✅ chắc chắn · 🔵 suy đoán · 🟡 cần xác nhận"
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("feature", help="feature slug (trong docs/_reverse/)")
    parser.add_argument("--out", default=None, help="override output path")
    parser.add_argument("--vault", default=".", help="vault root (default cwd)")
    args = parser.parse_args()

    vault = Path(args.vault).resolve()
    feature = args.feature
    feature_dir = vault / "docs" / "_reverse" / feature
    today = date.today().isoformat()

    if not feature_dir.is_dir():
        sys.exit(
            f"❌ Feature reverse không tồn tại: {feature_dir}\n"
            f"   → Chạy /code-to-srs <repo> hoặc /reverse-doc <nguồn> trước."
        )

    spec_path = feature_dir / f"{feature}-reverse-spec.md"
    if not spec_path.is_file():
        sys.exit(
            f"❌ Thiếu file lõi: {spec_path}\n"
            f"   → Bộ reverse chưa đầy đủ. Chạy lại /code-to-srs hoặc /reverse-doc."
        )

    out_path = Path(args.out) if args.out else feature_dir / f"{feature}-reverse-preview.html"
    srs_dir = feature_dir / "srs"

    # === Read sources (tên file reverse) ===
    spec = read_optional(spec_path)
    gaps = read_optional(feature_dir / "reverse-gaps.md")
    sources = read_optional(feature_dir / "reverse-sources.md")
    evidence = read_optional(feature_dir / "_evidence.md")  # optional (chỉ code-to-srs)
    flows = read_optional(srs_dir / f"{feature}-reverse-flows.md")
    states = read_optional(srs_dir / f"{feature}-reverse-states.md")
    erd = read_optional(srs_dir / f"{feature}-reverse-erd.md")
    uc_index_path = find_index_file(feature_dir / "usecases")
    uc_index_text = read_optional(uc_index_path) if uc_index_path else ""
    uc_files = list_glob(feature_dir / "usecases", "uc-*.md")

    title = feature.replace("-", " ").title()

    # === Compose từng khối (GIỮ cột Nhãn — KHÔNG strip OQ/nhãn) ===
    def _strip_lead_h1(b: str) -> str:
        return re.sub(r"\A\s*#\s+[^\n]+\n+", "", b)

    # 1. Banner confidence
    banner = build_confidence_banner(spec, feature)

    # 2. Spec 12 Mục — giữ nguyên (cột Nhãn + Mục 0 provenance). Bỏ H1 lead để không đôi tiêu đề.
    spec_body = _strip_lead_h1(strip_frontmatter(spec)) if spec else "_Thiếu spec._"

    # 3. Diagrams (mermaid + inline ảnh local nếu có)
    def _diag(text):
        if not text:
            return None
        b = _strip_lead_h1(strip_frontmatter(text))
        return inline_local_images(b, srs_dir)

    flows_body = _diag(flows)
    states_body = _diag(states)
    erd_body = _diag(erd)

    # 4. Use cases (index + từng uc-*.md), mỗi cái 1 H2 → demote nội dung.
    fn_parts = []
    if uc_index_text:
        idx_body = _strip_lead_h1(strip_frontmatter(uc_index_text))
        fn_parts.append("## Use cases (index)\n\n" + demote_headings(idx_body))
    for f in uc_files:
        body = strip_frontmatter(read_optional(f))
        m = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
        heading = m.group(1).strip() if m else f.stem
        aid = f'<a id="{f.stem}"></a>'
        fn_parts.append(f"## {aid}{heading}\n\n" + demote_headings(_strip_lead_h1(body)))
    functions_block = "\n\n---\n\n".join(fn_parts) if fn_parts else "_Chưa có use case._"

    # 5. Gaps & Open Questions (nổi bật)
    gaps_body = _strip_lead_h1(strip_frontmatter(gaps)) if gaps else "_Chưa có gaps._"

    # 6. Evidence (chỉ khi có _evidence.md)
    evidence_body = _strip_lead_h1(strip_frontmatter(evidence)) if evidence else None

    # 7. Sources
    sources_body = _strip_lead_h1(strip_frontmatter(sources)) if sources else "_Chưa có danh mục nguồn._"

    # === Build sections (số liên tục) ===
    # tuple: (tên, body, demote?, anchor)
    sections = [
        ("Đặc tả tái lập (spec 12 Mục)", spec_body, True, "sec-spec"),
    ]
    if flows_body:
        sections.append(("Luồng (Flows)", flows_body, True, "sec-flows"))
    if states_body:
        sections.append(("Trạng thái (States)", states_body, True, "sec-states"))
    if erd_body:
        sections.append(("Dữ liệu (ERD)", erd_body, True, "sec-erd"))
    sections.append(("Use cases", functions_block, True, "sec-uc"))
    sections.append(("Gaps & Open Questions", gaps_body, True, "sec-gaps"))
    if evidence_body:
        sections.append(("Truy vết code → luồng (Evidence)", evidence_body, True, "sec-evidence"))
    sections.append(("Danh mục nguồn (Provenance)", sources_body, True, "sec-sources"))

    md_parts = [
        f"# {title} — Reverse SRS Preview\n",
        f"> Bản tái lập từ nguồn · Generated {today}\n\n",
        banner + "\n",
    ]
    for i, (name, body, do_demote, anchor) in enumerate(sections, 1):
        md_parts.append(section(f"{i}. {name}", demote_headings(body) if do_demote else body, anchor))

    md_content = "\n".join(md_parts)
    md_content = sanitize_embedded(md_content, feature_dir)

    # === Wrap shared viewer ===
    html = build_viewer_html(
        title=title,
        subtitle="Reverse SRS Preview",
        date=today,
        md_content=md_content,
        regen_cmd=f"python3 _scripts/build-reverse-preview.py {feature}",
    )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(html, encoding="utf-8")

    size_kb = out_path.stat().st_size / 1024
    n_sec = len(sections)
    has_ev = "có" if evidence_body else "không (reverse-doc)"
    print(f"✅ Reverse preview generated: {out_path}")
    print(f"   Sections: {n_sec} · Evidence: {has_ev} · Size: ~{size_kb:.0f} KB")
    print(f"   Mở: double-click trong Finder/Explorer.")


if __name__ == "__main__":
    main()
