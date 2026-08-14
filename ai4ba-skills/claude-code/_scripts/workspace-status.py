#!/usr/bin/env python3
"""
workspace-status.py — deterministic status engine, NGUỒN SỐ LIỆU DUY NHẤT cho /dashboard.

Script này ĐẾM/PHÂN LOẠI theo rule cố định — không diễn giải "tại sao chưa xong" bằng văn
xuôi tự nhiên (đó vẫn là việc của skill/LLM đọc JSON rồi viết report cho user). Mọi con số
trên dashboard (status distribution, stale buckets, action items, coverage, pipeline,
freshness, quality) đều tính ở ĐÂY một lần — dashboard chỉ render, không tự đếm lại bằng
prompt (tránh 2 số liệu lệch nhau).

Vì sao tính coverage/pipeline TẠI ĐÂY thay vì đọc `docs/_shared/traceability.md` của /gap:
traceability.md chỉ tồn tại SAU khi user chạy /gap cho từng feature — dashboard phải chạy
được trên vault chưa từng chạy /gap. Nên engine tự parse ID (FR/NFR/BR/E per feature) + `links:`
+ regex ID trong body để tính coverage độc lập. Cùng triết lý deterministic với /gap, nhưng
không phụ thuộc output của nó.

Usage:
  python3 _scripts/workspace-status.py [--feature <slug>] [--vault .]

Output: JSON ra stdout với các khối:
  status_distribution, stale_buckets, open_crs, action_items  (core — như cũ)
  coverage       — per-feature FR↔US↔AC↔test coverage + orphan detection
  pipeline       — per-feature tiến độ qua 7 giai đoạn URD→BRD→PRD→SRS→US→AC→test
  freshness      — điểm 0-100 mỗi doc (tuổi update + stale flag)
  quality        — doc thiếu links, review overdue, open question tồn đọng
  docs, crs, user_stories  (raw lists — như cũ)
"""

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)
EXCLUDE_DIRS = {"_archive", "exports", "node_modules"}

# ID pattern nghiệp vụ (naming-conventions.md Mục ID conventions). Requirement-side IDs mang
# prefix feature (FR-{feature}-NNN); delivery-side (US/AC) scope qua path nên không prefix.
REQ_ID_RE = re.compile(r"\b((?:FR|NFR|BR|E)-[a-z0-9]+(?:-[a-z0-9]+)*-\d{2,})\b")
US_ID_RE = re.compile(r"\bUS-(\d{2,})\b")
AC_ID_RE = re.compile(r"\bAC-(\d{2,})\b")

# 7 giai đoạn pipeline chuẩn (CLAUDE.md luồng đặc tả). Mỗi feature "đi tới đâu" = giai đoạn
# xa nhất có artifact thật. Dùng để vẽ funnel + tính % hoàn thành.
PIPELINE_STAGES = ["urd", "brd", "prd", "srs", "usecase", "userstory", "ac", "test"]

# Types với slim frontmatter (chỉ type/feature/updated, KHÔNG có status) — lifecycle kế thừa
# từ file cha (vd srs-flows kế thừa spec.md). Coi các type này là "draft" mặc định sẽ tạo
# false positive P2 "draft >14d" tràn lan (naming-conventions.md liệt kê rõ các type này).
# LƯU Ý: content-file types (user-story, use-case) có filename pattern rõ (us-*.md, uc-*.md)
# — dùng path match thay vì chỉ tin field `type`, vì đã gặp file *-index.md bị gán nhầm
# type: user-story/use-case (đáng lẽ userstory-index/usecase-index) trong vault thật.
SLIM_FRONTMATTER_TYPES = {
    "srs-flows", "srs-states", "srs-erd", "srs-userflow", "screen",
}
CONTENT_FILE_PATH_RE = re.compile(r"/(us-\d+|uc-[a-z0-9-]+)\.md$")

# 5 cột kanban chuẩn (status-lifecycle.md). Map cả status "lạ" của vault demo cũ về cột gần
# nhất để kanban không vỡ (stale không phải cột — nó là cờ overlay, doc stale vẫn nằm ở cột
# lifecycle của nó nhưng gắn badge riêng).
KANBAN_COLS = ["draft", "in-review", "revisions", "approved", "shipped"]
_STATUS_TO_COL = {
    "draft": "draft", "captured": "draft", "in-progress": "draft", "active": "draft",
    "in-review": "in-review", "review": "in-review",
    "revisions": "revisions",
    "approved": "approved", "done": "approved", "processed": "approved",
    "shipped": "shipped",
    "stale": "draft",  # doc stale rơi về draft (cần làm lại) + gắn badge stale riêng
}


def _kanban_col(status: str) -> str:
    return _STATUS_TO_COL.get(status, "draft")


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return ""


def parse_frontmatter(text: str) -> dict:
    """Parse YAML frontmatter bằng regex per-field — KHÔNG cần pyyaml (tránh thêm dependency).

    Chỉ parse scalar fields (key: value) cần cho status engine. List/nested fields (links,
    changelog, jira_keys) không parse ở đây — đủ cho tính distribution/stale/action items.
    """
    m = FRONTMATTER_RE.match(text)
    if not m:
        return {}
    fm = {}
    for line in m.group(1).split("\n"):
        line_m = re.match(r'^(\w+):\s*"?([^"\n]*)"?\s*$', line)
        if line_m:
            key, val = line_m.group(1), line_m.group(2).strip()
            if key not in fm:  # first occurrence only (list items look like nested keys, skip)
                fm[key] = val
    return fm


def days_since(iso_date: str, today: date) -> int:
    try:
        y, mo, d = (int(x) for x in iso_date.split("-"))
        return (today - date(y, mo, d)).days
    except (ValueError, AttributeError):
        return -1  # unknown — caller should treat as "not stale" (safer than false-positive)


def scan_docs(vault: Path, feature_filter: str, today: date) -> list:
    docs_dir = vault / "docs"
    if not docs_dir.is_dir():
        return []
    docs = []
    for path in docs_dir.rglob("*.md"):
        rel = path.relative_to(vault)
        # CR record có lifecycle RIÊNG (proposed/impact-assessed/applied/closed — change-request.md),
        # không phải lifecycle tài liệu (draft→…→shipped). Để lọt vào đây thì kanban xếp CR vào cột
        # "draft" và freshness/stale tính nhầm trên audit record. CR đã có scan_crs() riêng.
        if len(rel.parts) >= 2 and rel.parts[1] == "cr":
            continue
        if any(part in EXCLUDE_DIRS or part.startswith("_") for part in rel.parts[1:-1]):
            # cho phép docs/_shared, docs/_product đọc field cần (traceability) nhưng exclude khỏi
            # kanban/action-item scan chính — giữ đơn giản: skip mọi folder bắt đầu "_" trừ chính docs/
            if not (len(rel.parts) >= 2 and rel.parts[1] in {"_shared", "_product"}):
                continue
        text = read_text(path)
        fm = parse_frontmatter(text)
        if not fm:
            continue
        if feature_filter and fm.get("feature") != feature_filter:
            continue
        updated = fm.get("updated", "")
        doc_type = fm.get("type", "unknown")
        is_slim_type = doc_type in SLIM_FRONTMATTER_TYPES or bool(CONTENT_FILE_PATH_RE.search(str(rel)))
        has_lifecycle = "status" in fm and not is_slim_type
        # Title cho card kanban: H1 đầu tiên; fallback tên file (bỏ đuôi + prefix feature).
        h1 = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
        title = h1.group(1).strip() if h1 else path.stem
        docs.append({
            "path": str(rel),
            "title": title,
            "type": doc_type,
            "feature": fm.get("feature", ""),
            "status": fm.get("status", "draft") if has_lifecycle else None,
            "kanban_col": _kanban_col(fm.get("status", "")) if has_lifecycle else None,
            "has_lifecycle": has_lifecycle,
            "owner": fm.get("owner", ""),
            "updated": updated,
            "priority": fm.get("priority", ""),
            "days_since_update": days_since(updated, today) if updated else -1,
            "is_stale": has_lifecycle and fm.get("status", "") == "stale",
        })
    return docs


def scan_features(docs: list) -> list:
    """Feature = có ít nhất 1 doc type urd hoặc srs trong docs đã scan."""
    features = set()
    for d in docs:
        if d["feature"] and d["type"] in ("urd", "srs"):
            features.add(d["feature"])
    return sorted(features)


def scan_crs(vault: Path, feature_filter: str, today: date) -> list:
    cr_dir = vault / "docs" / "cr"
    if not cr_dir.is_dir():
        return []
    crs = []
    for path in sorted(cr_dir.glob("CR-*.md")):
        text = read_text(path)
        fm = parse_frontmatter(text)
        if feature_filter and fm.get("feature") != feature_filter:
            continue
        pending_rebuild = len(re.findall(r"⏳\s*pending", text))
        done_rebuild = len(re.findall(r"✅\s*done", text))
        updated = fm.get("updated", fm.get("created", ""))
        crs.append({
            "id": path.stem,
            "path": str(path.relative_to(vault)),
            "status": fm.get("status", ""),
            "severity": fm.get("severity", ""),
            "feature": fm.get("feature", ""),
            "updated": updated,
            "days_since_update": days_since(updated, today) if updated else -1,
            "artifacts_pending": pending_rebuild,
            "artifacts_done": done_rebuild,
        })
    return crs


def scan_user_stories(vault: Path, feature_filter: str) -> list:
    """US missing AC = has '### AC-' count 0, or body contains TODO placeholder."""
    docs_dir = vault / "docs"
    result = []
    for us_path in docs_dir.glob("*/userstories/us-*.md"):
        feature = us_path.parent.parent.name
        if feature_filter and feature != feature_filter:
            continue
        text = read_text(us_path)
        ac_count = len(re.findall(r"^###\s*AC-", text, re.MULTILINE))
        has_todo = "TODO: run /ac" in text
        result.append({
            "path": str(us_path.relative_to(vault)),
            "feature": feature,
            "ac_count": ac_count,
            "missing_ac": ac_count == 0 or has_todo,
        })
    return result


def compute_stale_buckets(docs: list) -> dict:
    buckets = {"le_7d": 0, "d8_30": 0, "gt_30d": 0}
    for d in docs:
        if not d["is_stale"] or d["days_since_update"] < 0:
            continue
        n = d["days_since_update"]
        if n <= 7:
            buckets["le_7d"] += 1
        elif n <= 30:
            buckets["d8_30"] += 1
        else:
            buckets["gt_30d"] += 1
    return buckets


def compute_status_distribution(docs: list) -> dict:
    dist = {}
    for d in docs:
        if not d["has_lifecycle"]:
            continue  # slim-frontmatter types (srs-flows/erd/states/...) không có status thật
        dist[d["status"]] = dist.get(d["status"], 0) + 1
    return dist


def compute_action_items(docs: list, crs: list, stories: list, today: date) -> list:
    """Nguồn tiêu chí DUY NHẤT — /dashboard đọc list này, không tự suy diễn lại.

    Mỗi item: {priority, category, title, target_path, feature, metric}
    `metric` là số liệu thô (khớp memory feedback_no_reask: reason cần "concrete + số liệu") —
    skill (LLM) tự viết câu "tại sao chưa xong" từ metric này, script không viết văn.
    """
    items = []

    # P0 — stale >30d
    for d in docs:
        if d["is_stale"] and d["days_since_update"] > 30:
            items.append({
                "priority": "P0", "category": "cleanup", "title": f"Stale >30d: {d['path']}",
                "target_path": d["path"], "feature": d["feature"],
                "metric": {"days_stale": d["days_since_update"]},
            })

    # P0 — CR proposed chưa assess
    for cr in crs:
        if cr["status"] == "proposed":
            items.append({
                "priority": "P0", "category": "blocker", "title": f"CR proposed chưa assess: {cr['id']}",
                "target_path": cr["path"], "feature": cr["feature"],
                "metric": {"days_since_update": cr["days_since_update"]},
            })

    # P1 — stale 8-30d
    for d in docs:
        if d["is_stale"] and 8 <= d["days_since_update"] <= 30:
            items.append({
                "priority": "P1", "category": "cleanup", "title": f"Stale {d['days_since_update']}d: {d['path']}",
                "target_path": d["path"], "feature": d["feature"],
                "metric": {"days_stale": d["days_since_update"]},
            })

    # P1 — stuck reviews >7d (status in-review, updated >7d)
    for d in docs:
        if d["has_lifecycle"] and d["status"] == "in-review" and d["days_since_update"] > 7:
            items.append({
                "priority": "P1", "category": "spec", "title": f"Stuck review >7d: {d['path']}",
                "target_path": d["path"], "feature": d["feature"],
                "metric": {"days_in_review": d["days_since_update"]},
            })

    # P1 — US missing AC
    for s in stories:
        if s["missing_ac"]:
            items.append({
                "priority": "P1", "category": "delivery", "title": f"US thiếu AC: {s['path']}",
                "target_path": s["path"], "feature": s["feature"],
                "metric": {"ac_count": s["ac_count"]},
            })

    # P1 — CR applied >7d còn artifacts pending
    for cr in crs:
        if cr["status"] == "applied" and cr["days_since_update"] > 7 and cr["artifacts_pending"] > 0:
            items.append({
                "priority": "P1", "category": "artifact_sync",
                "title": f"CR applied >7d còn {cr['artifacts_pending']} artifact pending: {cr['id']}",
                "target_path": cr["path"], "feature": cr["feature"],
                "metric": {"artifacts_pending": cr["artifacts_pending"], "days_since_apply": cr["days_since_update"]},
            })

    # P2 — draft docs >14d không update (excluding stale — đã tính riêng, và excluding
    # slim-frontmatter types vì chúng không có lifecycle độc lập — xem SLIM_FRONTMATTER_TYPES)
    for d in docs:
        if d["has_lifecycle"] and d["status"] == "draft" and not d["is_stale"] and d["days_since_update"] > 14:
            items.append({
                "priority": "P2", "category": "qa", "title": f"Draft >14d chưa update: {d['path']}",
                "target_path": d["path"], "feature": d["feature"],
                "metric": {"days_since_update": d["days_since_update"]},
            })

    # sort: P0 > P1 > P2 > P3, tie-break: metric days desc (older = more urgent)
    prio_order = {"P0": 0, "P1": 1, "P2": 2, "P3": 3}
    def sort_key(item):
        m = item["metric"]
        days = m.get("days_stale") or m.get("days_since_update") or m.get("days_in_review") or m.get("days_since_apply") or 0
        return (prio_order.get(item["priority"], 9), -days)
    items.sort(key=sort_key)
    return items


# ─────────────────────────────────────────────────────────────────────────────
# Coverage / traceability — parse ID nghiệp vụ, tính FR↔US↔AC↔test + orphan.
# ─────────────────────────────────────────────────────────────────────────────

def _feature_files(vault: Path, feature: str) -> list:
    fdir = vault / "docs" / feature
    if not fdir.is_dir():
        return []
    return [p for p in fdir.rglob("*.md") if p.is_file()]


def _find_spec(vault: Path, feature: str):
    """Chịu CẢ 2 naming: cũ `srs/spec.md` lẫn mới `srs/{feature}-spec.md`."""
    srs = vault / "docs" / feature / "srs"
    for cand in (srs / f"{feature}-spec.md", srs / "spec.md"):
        if cand.is_file():
            return cand
    hits = list(srs.glob("*spec*.md")) if srs.is_dir() else []
    return hits[0] if hits else None


def compute_coverage(vault: Path, features: list, today: date) -> list:
    """Per-feature: tập FR/NFR/BR/E khai báo ở spec, US nào phủ FR nào (qua links: + ID trong
    body), AC count, test checklist theo UC. Trả về đủ để dashboard vẽ heatmap + orphan table.

    Trạng thái mỗi FR (kiểu OpenFastTrace, thay boolean):
      covered   — có ≥1 US trỏ tới
      uncovered — không US nào trỏ tới (gap thật)
    Orphan US   — US không trỏ tới FR nào (mồ côi ngược).
    """
    result = []
    for feat in features:
        spec = _find_spec(vault, feat)
        fr_ids, nfr_ids, br_ids, e_ids = set(), set(), set(), set()
        if spec:
            spec_text = read_text(spec)
            # chỉ lấy ID định-nghĩa: đứng đầu dòng bảng/heading (### FR-x-001 | | FR-x-001 |)
            for m in REQ_ID_RE.finditer(spec_text):
                _id = m.group(1)
                (fr_ids if _id.startswith("FR-") else
                 nfr_ids if _id.startswith("NFR-") else
                 br_ids if _id.startswith("BR-") else e_ids).add(_id)

        # US files: mỗi US nhắc FR nào + AC count
        us_dir = vault / "docs" / feat / "userstories"
        stories = []
        fr_to_us = {fr: [] for fr in fr_ids}
        for us_path in sorted(us_dir.glob("us-*.md")) if us_dir.is_dir() else []:
            t = read_text(us_path)
            refs = {m.group(1) for m in REQ_ID_RE.finditer(t) if m.group(1).startswith("FR-")}
            ac_n = len(AC_ID_RE.findall(t)) or len(re.findall(r"^###\s*AC-", t, re.MULTILINE))
            us_name = us_path.stem
            stories.append({"id": us_name, "path": str(us_path.relative_to(vault)),
                            "fr_refs": sorted(refs), "ac_count": ac_n,
                            "orphan": len(refs) == 0})
            for fr in refs:
                fr_to_us.setdefault(fr, []).append(us_name)

        # UC files + test checklist per UC (test coverage tín hiệu ở mức UC)
        uc_dir = vault / "docs" / feat / "usecases"
        uc_ids = [p.stem for p in sorted(uc_dir.glob("uc-*.md"))] if uc_dir.is_dir() else []
        test_dir = vault / "docs" / feat / "test"
        tested_uc = set()
        if test_dir.is_dir():
            for tp in test_dir.rglob("*.md"):
                m = re.search(r"(uc-[a-z0-9-]+)", tp.stem)
                if m:
                    tested_uc.add(m.group(1))

        covered = [fr for fr in fr_ids if fr_to_us.get(fr)]
        uncovered = sorted(fr for fr in fr_ids if not fr_to_us.get(fr))
        n_fr = len(fr_ids)
        result.append({
            "feature": feat,
            "fr_total": n_fr,
            "fr_covered": len(covered),
            "fr_uncovered": uncovered,
            "coverage_pct": round(100 * len(covered) / n_fr) if n_fr else None,
            "nfr_total": len(nfr_ids), "br_total": len(br_ids), "e_total": len(e_ids),
            "us_total": len(stories),
            "us_orphan": [s["id"] for s in stories if s["orphan"]],
            "ac_total": sum(s["ac_count"] for s in stories),
            "us_missing_ac": [s["id"] for s in stories if s["ac_count"] == 0],
            "uc_total": len(uc_ids),
            "uc_untested": sorted(set(uc_ids) - tested_uc),
            "stories": stories,
        })
    return result


# ─────────────────────────────────────────────────────────────────────────────
# Pipeline — mỗi feature đi tới giai đoạn nào (URD→…→test) + % hoàn thành.
# ─────────────────────────────────────────────────────────────────────────────

def compute_pipeline(vault: Path, feature_filter: str) -> list:
    """Với MỌI folder feature (kể cả chưa có urd/srs — khác `scan_features` chặt hơn), đo
    artifact hiện diện ở từng giai đoạn. Funnel dashboard đọc list này.
    """
    docs_dir = vault / "docs"
    if not docs_dir.is_dir():
        return []
    # `guides`/`userguide` là folder tài liệu meta, không phải feature nghiệp vụ → bỏ khỏi funnel.
    skip = {"_shared", "_product", "meetings", "inbox", "cr", "exports", "reports",
            "guides", "userguide"}
    result = []
    for fdir in sorted(docs_dir.iterdir()):
        if not fdir.is_dir() or fdir.name.startswith(".") or fdir.name in skip:
            continue
        feat = fdir.name
        if feat.startswith("_") or (feature_filter and feat != feature_filter):
            continue
        srs = fdir / "srs"
        present = {
            "urd": any(fdir.glob("*-urd.md")) or (fdir / f"{feat}-urd.md").is_file(),
            "brd": any(fdir.glob("*-brd.md")) or (fdir / f"{feat}-brd.md").is_file(),
            "prd": any(fdir.glob("*-prd.md")) or (fdir / f"{feat}-prd.md").is_file(),
            "srs": _find_spec(vault, feat) is not None,
            "usecase": (fdir / "usecases").is_dir() and any((fdir / "usecases").glob("uc-*.md")),
            "userstory": (fdir / "userstories").is_dir() and any((fdir / "userstories").glob("us-*.md")),
            "ac": False,
            "test": (fdir / "test").is_dir() and any((fdir / "test").rglob("*.md")),
        }
        # AC hiện diện = có US nào chứa AC-
        if present["userstory"]:
            for us in (fdir / "userstories").glob("us-*.md"):
                if AC_ID_RE.search(read_text(us)) or re.search(r"^###\s*AC-", read_text(us), re.MULTILINE):
                    present["ac"] = True
                    break
        done = [s for s in PIPELINE_STAGES if present[s]]
        # Bỏ folder chưa có artifact pipeline nào (rỗng, hoặc chỉ brainstorm) — không phải feature
        # đang chạy pipeline, chỉ làm nhiễu funnel. Vẫn giữ nếu có filter feature tường minh.
        if not done and not feature_filter:
            continue
        # giai đoạn xa nhất đạt được (chỉ số cao nhất có artifact)
        furthest = max((PIPELINE_STAGES.index(s) for s in done), default=-1)
        result.append({
            "feature": feat,
            "stages_present": present,
            "stages_done": len(done),
            "furthest_stage": PIPELINE_STAGES[furthest] if furthest >= 0 else None,
            "pct": round(100 * len(done) / len(PIPELINE_STAGES)),
        })
    return result


# ─────────────────────────────────────────────────────────────────────────────
# Freshness — điểm 0-100/doc (Dosu.dev style): tuổi update + stale flag.
# ─────────────────────────────────────────────────────────────────────────────

def compute_freshness(docs: list) -> dict:
    """Điểm 100 = mới toanh, giảm dần theo tuổi `updated`; stale flag phạt nặng.
    Chỉ chấm doc có lifecycle (bỏ slim-frontmatter — chúng inherit từ file cha).
    """
    scored = []
    for d in docs:
        if not d["has_lifecycle"]:
            continue
        n = d["days_since_update"]
        if n < 0:  # không có ngày update — không chấm, coi như unknown
            score = None
        else:
            # -1 điểm/ngày sau 7 ngày ân hạn, sàn 0
            age_penalty = max(0, n - 7)
            score = max(0, 100 - age_penalty)
            if d["is_stale"]:
                score = min(score, 20)  # stale flag ép trần 20
        scored.append({"path": d["path"], "feature": d["feature"],
                       "score": score, "days": n, "is_stale": d["is_stale"]})
    valid = [s["score"] for s in scored if s["score"] is not None]
    return {
        "docs": scored,
        "avg": round(sum(valid) / len(valid)) if valid else None,
        "critical": sorted([s for s in scored if s["score"] is not None and s["score"] < 40],
                           key=lambda s: s["score"]),
    }


# ─────────────────────────────────────────────────────────────────────────────
# Quality — doc thiếu links, review overdue, open questions.
# ─────────────────────────────────────────────────────────────────────────────

def compute_quality(vault: Path, docs: list, feature_filter: str) -> dict:
    """Chỉ số rủi ro dashboard cần: review kẹt quá hạn, doc thiếu truy vết, OQ tồn đọng."""
    # review overdue: status in-review > 7 ngày
    review_overdue = sorted(
        [{"path": d["path"], "feature": d["feature"], "days": d["days_since_update"]}
         for d in docs if d["has_lifecycle"] and d["status"] == "in-review" and d["days_since_update"] > 7],
        key=lambda x: -x["days"])

    # docs thiếu links: doc-type "nặng" (urd/brd/prd/srs) mà frontmatter không có links:
    needs_links = {"urd", "brd", "prd", "srs"}
    missing_links = []
    docs_dir = vault / "docs"
    for d in docs:
        if d["type"] not in needs_links:
            continue
        text = read_text(vault / d["path"])
        m = FRONTMATTER_RE.match(text)
        fm_block = m.group(1) if m else ""
        if "links:" not in fm_block:
            missing_links.append({"path": d["path"], "feature": d["feature"]})

    # open questions: đếm dòng OQ chưa resolve trong toàn feature (spec + usecase-index)
    oq_by_feature = {}
    if docs_dir.is_dir():
        for p in docs_dir.rglob("*.md"):
            rel = p.relative_to(vault)
            if len(rel.parts) < 2 or rel.parts[1].startswith("_"):
                continue
            feat = rel.parts[1]
            if feature_filter and feat != feature_filter:
                continue
            t = read_text(p)
            oq = len(re.findall(r"^-?\s*\[ \].*(?:[Oo]pen [Qq]uestion|OQ[-:])", t, re.MULTILINE))
            oq += len(re.findall(r"^\|\s*OQ-\d+", t, re.MULTILINE))
            if oq:
                oq_by_feature[feat] = oq_by_feature.get(feat, 0) + oq

    return {
        "review_overdue": review_overdue,
        "missing_links": missing_links,
        "open_questions": [{"feature": f, "count": c} for f, c in sorted(oq_by_feature.items())],
        "oq_total": sum(oq_by_feature.values()),
    }


# ─────────────────────────────────────────────────────────────────────────────
# Health — verdict 1 dòng + 4 đèn màu, chấm DETERMINISTIC ở đây để dashboard chỉ tô
# màu, không tự "đoán" đèn (2 lần chạy phải ra cùng verdict). Đây là thứ đứng ĐẦU
# dashboard: liếc phát biết vault ổn hay không.
# ─────────────────────────────────────────────────────────────────────────────

def _light(value, good, warn):
    """value ≥ good → green; ≥ warn → amber; còn lại → red. (Thang thuận: cao = tốt.)"""
    if value is None:
        return "gray"
    return "green" if value >= good else "amber" if value >= warn else "red"


def _light_inv(count, ok, warn):
    """count ≤ ok → green; ≤ warn → amber; còn lại → red. (Thang nghịch: ít = tốt.)"""
    return "green" if count <= ok else "amber" if count <= warn else "red"


def compute_health(coverage, pipeline, freshness, quality, action_items, open_crs):
    """4 đèn + verdict. Mỗi đèn kèm `metric` (số thô) + `detail` (1 câu vì sao) để dashboard
    render thẳng, không diễn giải lại."""
    # 1. Coverage — TB % FR có US phủ (feature đã có FR)
    valid = [c["coverage_pct"] for c in coverage if c["coverage_pct"] is not None]
    avg_cov = round(sum(valid) / len(valid)) if valid else None
    n_uncov = sum(len(c["fr_uncovered"]) for c in coverage)
    cov_light = _light(avg_cov, 85, 60)
    # 2. Tiến độ — TB % pipeline các feature đang chạy
    pcts = [p["pct"] for p in pipeline]
    avg_pct = round(sum(pcts) / len(pcts)) if pcts else None
    prog_light = _light(avg_pct, 75, 40)
    # 3. Độ tươi — freshness TB, nhưng nhiều doc mục thì hạ đèn dù TB cao (đèn không "nói dối":
    # avg 75 mà 15 doc <40 điểm vẫn là vấn đề tồn đọng cần rà).
    n_crit = len(freshness.get("critical", []))
    fresh_light = _light(freshness.get("avg"), 70, 45)
    if fresh_light == "green" and n_crit >= 8:
        fresh_light = "amber"
    # 4. Rủi ro — action P0 + CR treo + review quá hạn (thang nghịch)
    n_p0 = sum(1 for a in action_items if a["priority"] == "P0")
    n_overdue = len(quality.get("review_overdue", []))
    risk_count = n_p0 + len(open_crs) + n_overdue
    risk_light = _light_inv(risk_count, 0, 3)

    lights = [
        {"key": "coverage", "label": "Truy vết (Coverage)", "light": cov_light,
         "metric": f"{avg_cov}%" if avg_cov is not None else "—",
         "detail": (f"{n_uncov} FR chưa có user story phủ" if n_uncov else "Mọi FR đều có US phủ")},
        {"key": "progress", "label": "Tiến độ pipeline", "light": prog_light,
         "metric": f"{avg_pct}%" if avg_pct is not None else "—",
         "detail": f"{len(pipeline)} feature đang chạy, TB {avg_pct}% qua 8 giai đoạn" if avg_pct is not None else "Chưa feature nào có artifact"},
        {"key": "freshness", "label": "Độ tươi tài liệu", "light": fresh_light,
         "metric": f"{freshness.get('avg')}đ" if freshness.get("avg") is not None else "—",
         "detail": f"{n_crit} doc mục (điểm <40) cần rà lại" if n_crit else "Tài liệu còn tươi"},
        {"key": "risk", "label": "Rủi ro / việc gấp", "light": risk_light,
         "metric": str(risk_count),
         "detail": f"{n_p0} việc P0 · {len(open_crs)} CR treo · {n_overdue} review quá hạn"},
    ]

    # Verdict tổng: đèn tệ nhất quyết định (red > amber > green).
    order = {"red": 0, "amber": 1, "green": 2, "gray": 2}
    worst = min((l["light"] for l in lights), key=lambda c: order[c])
    n_red = sum(1 for l in lights if l["light"] == "red")
    n_amber = sum(1 for l in lights if l["light"] == "amber")
    if worst == "red":
        verdict = {"level": "red", "title": "Vault có rủi ro",
                   "summary": f"{n_red} mảng đỏ cần xử lý ngay" + (f", {n_amber} mảng cần chú ý" if n_amber else "")}
    elif worst == "amber":
        verdict = {"level": "amber", "title": "Vault cần chú ý",
                   "summary": f"{n_amber} mảng chưa đạt ngưỡng, chưa có gì đỏ"}
    else:
        verdict = {"level": "green", "title": "Vault ổn định",
                   "summary": "Mọi chỉ số trong ngưỡng an toàn"}
    return {"verdict": verdict, "lights": lights}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--feature", default=None)
    parser.add_argument("--vault", default=".")
    args = parser.parse_args()

    vault = Path(args.vault).resolve()
    today = date.today()

    docs = scan_docs(vault, args.feature, today)
    features = scan_features(docs)
    crs = scan_crs(vault, args.feature, today)
    stories = scan_user_stories(vault, args.feature)

    # Pipeline quét MỌI folder feature (rộng hơn scan_features vốn cần urd/srs). Coverage bám
    # theo cùng danh sách folder này để funnel + heatmap khớp nhau.
    pipeline = compute_pipeline(vault, args.feature)
    all_feature_folders = [p["feature"] for p in pipeline]

    coverage = compute_coverage(vault, all_feature_folders, today)
    freshness = compute_freshness(docs)
    quality = compute_quality(vault, docs, args.feature)
    action_items = compute_action_items(docs, crs, stories, today)
    open_crs = [c for c in crs if c["status"] not in ("closed", "rejected")]
    health = compute_health(coverage, pipeline, freshness, quality, action_items, open_crs)

    output = {
        "generated": today.isoformat(),
        "scope": args.feature or "project",
        "total_docs": len(docs),
        "features": features,                    # feature "chín" (có urd/srs) — như cũ
        "feature_folders": all_feature_folders,  # mọi folder feature (cho pipeline/coverage)
        "health": health,                        # verdict + 4 đèn màu — ĐỨNG ĐẦU dashboard
        "status_distribution": compute_status_distribution(docs),
        "stale_buckets": compute_stale_buckets(docs),
        "open_crs": open_crs,
        "action_items": action_items,
        "coverage": coverage,
        "pipeline": pipeline,
        "freshness": freshness,
        "quality": quality,
        "docs": docs,
        "crs": crs,
        "user_stories": stories,
    }
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
