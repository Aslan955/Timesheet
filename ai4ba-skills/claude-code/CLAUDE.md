# {Project Name} — BA Workspace‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
> Mọi doc per-feature dưới `docs/{feature}/`. URD/BRD/PRD/SRS đều scope feature (không còn singleton). File tên-cố-định mang prefix `{feature}-` (vd `{feature}-spec.md`) — tránh trùng basename giữa features. Frontmatter tối giản: `type`/`feature`/`status`/`updated`/`links` (KHÔNG created/owner/changelog). Lịch sử thay đổi sống ở `docs/_shared/changelog.md` (1 log tập trung).

## What lives here‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Path | Purpose |
|------|---------|
| `docs/` | All BA deliverables (URD, BRD, PRD, SRS, user stories, use cases, meetings, wireframes, exports) |
| `.claude/skills/` | User-invocable `/commands` (`/prd`, `/urd`, `/brd`, `/prd-epic`, `/srs`, `/sequence`, `/erd`, `/user-flow`, `/wireframe-ascii`, ...) |
| `.claude/agents/` | Specialized review personas (`@senior-ba`, `@uxui-reviewer`, ...) — Phase 4+ |
| `.claude/hooks/` | Auto-changelog, session-init, status-transition (Phase 4+), post-edit-stale (Phase 6+) |
| `.claude/rules/` | Naming, status lifecycle, changelog, approval-gate, agent conventions, __diagram-correctness__ (gate "vẽ đúng" cho 11 skill diagram) |
| `_templates/` | Note templates referenced by skills |

## Folder structure‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
{project-root}/
├── CLAUDE.md
├── README.md
├── .gitignore
├── .claude/
│   ├── settings.json
│   ├── hooks/         (session-init, auto-changelog, status-transition, post-edit-stale)
│   ├── rules/         (naming-conventions, status-lifecycle, changelog, approval-gate, agent-conventions, review-format)
│   ├── skills/        (urd, brd, prd, srs, sequence, erd, user-flow, wireframe-ascii, meet, brainstorm, reverse-doc, ...)
│   └── agents/        (senior-ba, po-reviewer, pm-reviewer, uxui-reviewer, qa-reviewer, tech-reviewer, change-tracker, gap-analyst)
├── _templates/        (urd, brd, prd, srs-spec, diagram-sequence, diagram-erd, wireframe-figma-links, ...)
└── docs/
    ├── _shared/                       ← project-level shared
    │   ├── project-profile.md         ← bối cảnh dự án tích lũy (domain/thuật ngữ user/đối thủ/compliance) — skill thiếu thông tin thì hỏi rồi ghi vào đây, skill sau reuse (rule project-profile.md)
    │   ├── definitions.md
    │   ├── operating-environment.md
    │   ├── conventions.md
    │   ├── system-overview.md
    │   ├── screen-patterns.md
    │   ├── traceability.md            ← AUTO from /gap (Phase 4)
    │   ├── staleness.md              ← hook post-edit-stale append-only log
    │   └── changelog.md               ← hook auto-changelog append-only (lịch sử thay đổi TOÀN vault)
    ├── _product/                       ← PROJECT-LEVEL product planning (trên feature-level)
    │   ├── prd.md                     ← PRD sản phẩm (project-level, KHÔNG prefix feature): Vision + Feature Map (output /prd project-level). Mỗi feature row có cột "Chi tiết hóa" ⬜/🔄/✅
    │   └── roadmap.md                 ← Now/Next/Later + MoSCoW/RICE-lite (output /roadmap, đọc _product/prd.md)
    ├── _reverse/                       ← PROJECT-LEVEL reverse-documentation (output /reverse-doc, tách khỏi doc chính)
    │   ├── reverse-plan.json          ← manifest máy-đọc-được: list feature + sources[] + status (resumable)
    │   └── {feature}/                 ← mỗi feature 1 folder: bộ SRS tái lập từ nguồn
    │       ├── {feature}-reverse-spec.md  ← SRS 12 Mục + cột Nguồn/Nhãn + Mục 0 provenance (status: draft cứng)
    │       ├── reverse-sources.md     ← danh mục nguồn (file/loại/ngày/confidence/encoding)
    │       └── reverse-gaps.md        ← OQ + Gap + Conflict + Inferred (mọi thứ-chưa-chắc, thay vì hỏi user)
    ├── {feature-slug}/                ← MỌI feature có folder riêng
    │   ├── brainstorms/{idea}.md
    │   ├── {feature}-urd.md                     ← User Requirements (per-feature)
    │   ├── {feature}-brd.md                     ← Business Requirements (per-feature)
    │   ├── {feature}-prd.md                     ← Product Requirements (per-feature)
    │   ├── srs/
    │   │   ├── {feature}-spec.md                ← FR/NFR/BR/Error Matrix backlog + index. FULL frontmatter (type/feature/status/updated/links).
    │   │   ├── {feature}-flows.md               ← Sequence + Activity diagrams (1 file gộp, mỗi flow 1 section). Slim frontmatter (type/feature/updated only).
    │   │   ├── {feature}-states.md              ← State diagrams (1 file gộp per entity). Slim frontmatter.
    │   │   ├── {feature}-erd.md                 ← Mermaid erDiagram. Slim frontmatter.
    │   │   └── {feature}-userflow.md            ← User flow mermaid (happy/error/edge) + chia flow. Nguồn chung cho ascii-wireframe/ + html-wireframe/. Output /user-flow, chạy TRƯỚC wireframe.
    │   ├── usecases/                  ← Use cases (fully-dressed Cockburn) — index master (gồm ma trận truy vết) + UC files + diagram
    │   │   ├── {feature}-usecase-index.md  ← Master metadata + bảng Use cases = ma trận UC↔FR↔Screen↔Error↔OQ (slug/level/status/actor/FR/screens/errors/OQ/priority) + Actors + Diagram (svg) + Relationships. KHÔNG còn file traceability riêng
    │   │   ├── {feature}-usecase-diagram.puml/.svg      ← Use case diagram (visual scope). Ảnh nhúng trong {feature}-usecase-index.md (KHÔNG có .md wrapper riêng). Output của /usecase-diagram
    │   │   └── uc-{function-slug}.md  ← Zero frontmatter, fully-dressed: Scope/Level/Trigger/Preconditions/Minimal+Success Guarantee/Main Success Scenario/Extensions/Related Requirements
    │   ├── ascii-wireframe/              ← Screen content (gộp theo flow) + master metadata index. Output /wireframe-ascii, đọc srs/{feature}-userflow.md để chia flow
    │   │   ├── {feature}-wireframe-index.md  ← Master metadata: status/thuộc-flow/links/designs+used-by table cho TOÀN BỘ screens
    │   │   └── {flow-slug}.md         ← Zero frontmatter, gộp N screens/flow — mỗi screen 1 block `## Screen: {slug}` với 2 sub-section (Wireframe ASCII / Screen description table 4 cols, `• `+`<br>` format)
    │   ├── html-design/{feature}-prototype.html ← Clickable HTML prototype self-contained, CHẠY NHƯ APP THẬT (state-driven, persist localStorage) + menu điều hướng NỔI (TOC + sơ đồ luồng, KHÔNG sidebar/iframe) + design tokens 2 lớp theme per-section + lớp GÓP Ý ghim-lên-element (mặc định có; `no-comment` để tắt) (output /prototype-html, đọc docs/design.md + primary_device từ userflow + chia flow từ userflow Mục 3)
│   ├── html-wireframe/            ← HTML wireframe B&W per flow (output của /wireframe-html, đọc srs/{feature}-userflow.md; renderer ngang hàng /wireframe-ascii, đọc lại screen của nhau nếu đã tồn tại)
│   │   ├── {feature}-wireframe-html-index.md  ← Master index: bảng Flows (file/screens/status)
│   │   └── {flow-slug}.html       ← 1 file per flow, screens grid 3/row, HTML element thật, B&W
│   ├── bpmn/                      ← BPMN output per-feature (CHỈ output, engine ở .claude/skills/bpmn/engine/)
│   │   ├── {feature}-bpmn-index.md  ← Master metadata + bảng process (lanes/gateways)
│   │   ├── {process}.ir.json      ← IR nghiệp vụ AI sinh (lanes/nodes/flows). Source of intent. Sửa cái này khi gọi lại /bpmn (tự vào update mode)
│   │   ├── {process}.src.json     ← Source facts (actors/branches/errors trích UC) để semcheck đối chiếu
│   │   ├── {process}.bpmn         ← XML chuẩn OMG (engine sinh từ IR). Import Camunda/Bizagi/draw.io
│   │   └── {feature}-bpmn-editor.html  ← Editor kéo-thả bpmn-js modeler (sửa như bpmn.io + Tải/Lưu .bpmn), dropdown đa-process
│   │   # Engine (dùng chung mọi feature) ở .claude/skills/bpmn/engine/: bpmn-build.mjs + bpmn-layout-{auto,elk}.mjs + bpmn-semcheck.mjs + _viewer_template.html + node_modules
│   │   # Chạy: node .claude/skills/bpmn/engine/bpmn-build.mjs --dir docs/{feature}/bpmn [--verify]
    │   └── userstories/              ← Index pattern giống usecases/ascii-wireframe
    │   │   ├── {feature}-story-index.md  ← Master metadata + status/priority/jira-key  + Stories table
    │   │   └── us-{NNN}.md            ← Zero frontmatter, prose sections (AC inline). Phase 5
    ├── meetings/YYYY-MM-DD-{type}-{slug}.md   ← project-level (cross-feature). /meet ghi 1 file DUY NHẤT ở đây (decisions/blockers/actions gộp table trong note, KHÔNG có file riêng)
    ├── inbox/YYYY-MM-DD-{slug}.md             ← raw capture
    ├── cr/CR-YYYYMMDD-NNN.md                  ← Phase 6 CR (self-contained: Impact Matrix 6 chiều + detailed impact + rollback plan gộp trong record, KHÔNG tách impacts/)
    ├── exports/{date}-{scope}-package.{md|html|pdf|docx}
    └── userguide/                             ← project-level (1 folder cho cả sản phẩm, KHÔNG per-feature). Output /userguide
        ├── {feature}-userguide.html          ← CỬA VÀO duy nhất (double-click mở): docs-style light-only, self-contained
        └── {feature}-userguide/               ← bundle: mọi file phụ gom vào đây, top-level chỉ thấy .html
            ├── index.md                       ← master metadata + bảng Sections (frontmatter type/scope/audience/status)
            ├── data.js                        ← nội dung nhúng cho file .html
            ├── pages/{slug}.md                ← trang cẩm nang zero-frontmatter (Every Page Is Page One)
            └── images/{slug}.png              ← ảnh chụp thật (auto qua Playwright, callout đánh số) hoặc placeholder
```

## Status lifecycle‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Every doc has frontmatter `status` field. Transitions:

```
draft → in-review → revisions → approved → shipped
```

| Transition | Hook trigger |
|------------|--------------|
| `* → in-review` | (future) Notify reviewer agent |
| `* → approved` | Xem tổng hợp qua `/dashboard` (KHÔNG còn `docs/feature-list.md`) |
| `* → shipped` | (future) Trigger `@gap-analyst` consistency check |

See `.claude/rules/status-lifecycle.md` for details.

## Changelog convention‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Lịch sử thay đổi TOÀN vault sống ở __một file duy nhất__: `docs/_shared/changelog.md` — __bảng Markdown__ append-only, hook `auto-changelog.sh` là writer duy nhất. Doc KHÔNG mang `changelog:` frontmatter.

```markdown
| Ngày | Skill | Người | File | Ghi chú |
|---|---|---|---|---|
| 2026-07-12 | /srs | @ba | `docs/payment/srs/payment-spec.md` | initial spec 12 FR |
| 2026-07-13 | /cr | @ba | `docs/payment/srs/payment-spec.md` | applied CR-20260713-001 |
```

1 dòng bảng = 1 sự kiện, append cuối file. Skill set env `CLAUDE_SKILL_NAME`/`CLAUDE_CHANGELOG_NOTE`/`CLAUDE_CHANGELOG_AUTHOR` trước Write/Edit; hook append (tự escape `|` trong Ghi chú, tự dựng header khi file chưa có). Lịch sử 1 feature = `grep "docs/{feature}/" docs/_shared/changelog.md`. See `.claude/rules/changelog.md`.

## Approval gate (HITL)

Mọi skill phải tuân `.claude/rules/approval-gate.md`:

- __L1 Plan preview__ trước Write/Edit ≥1 file: show table `path | action | summary`, user Y/n/select.
- __L2 Diff confirm__ trước Edit file đã tồn tại: show unified diff, user Y/n/edit-prompt.
- __L3 Iterate__ cho output sáng tạo (ASCII wireframe, mermaid diagrams): render → "Đồng ý / Sửa / Hủy", max 3 vòng.

Skill KHÔNG được auto-pick file im lặng. KHÔNG được skip L1 với cớ "đã confirm trước đó".

## Skills shipped

> __55 skill user-invocable__ (`/command`) trong `.claude/skills/` (mỗi skill = 1 folder chứa `SKILL.md`). Ngoài ra có vài __reference skill__ không phải `/command` (nạp bởi skill khác, `user-invocable: false`) — vd `stacks-reference`, `code-explorer` (dùng bởi `/code-to-srs`). Nguồn sự thật là các file `SKILL.md` — bảng dưới là tra-nhanh, giữ đồng bộ khi thêm/bớt skill. Đếm folder: `ls -d .claude/skills/*/ | wc -l` (gồm cả reference skill — hiện 57). Đếm user-invocable: `grep -l "user-invocable: true" .claude/skills/*/SKILL.md | wc -l`.

__Product planning phase (project-level — TRÊN /brainstorm):__

| Slash | Purpose |
|-------|---------|
| `/prd [<mô tả>\|@<file>]` | __PRD cấp sản phẩm__ (project-level). Interview level sản phẩm (6 nhóm: Vision/Users/Value/Features/Scope/Metrics) → bóc tách __Feature Map__ (mỗi feature đúng altitude để brainstorm riêng). Output project-level `docs/_product/prd.md`. Đánh dấu cột Chi tiết hóa bằng lời (vd "đánh dấu payment đã chi tiết") — skill tự hiểu, không cần flag. Đã tồn tại → tự vào update mode. Khác `/prd-epic` (đặc tả 1 feature). |
| `/roadmap` | Đọc Feature Map → xếp ưu tiên (MoSCoW → RICE-lite → dependency) → phân đợt __Now/Next/Later__ hoặc nói "chia theo quý" (không nói rõ → skill hỏi). Output project-level `docs/_product/roadmap.md`. |
| `/discover [<chủ đề>]` | __Điều tra 1 ý tưởng/chủ đề còn phân vân__ trước khi cam kết brainstorm. Làm rõ mục tiêu (hỏi khi mơ hồ) → __opportunity/JTBD__ (job người dùng mình, có bằng chứng nhu cầu không) → đối thủ giải job đó thế nào (spawn `@feature-researcher`; domain + đối thủ đọc từ `docs/_shared/project-profile.md`) → __RICE-lite__ (sorting aid) → khuyến nghị __build/skip/adjust__ + 1-3 phương án feature cỡ-brainstorm. Output `docs/_research/{date}-{slug}.md`. 2 checkpoint HITL. Verdict đứng CUỐI, sau evidence có nhãn [F]/[I]/[R]. KHÔNG bóc Feature Map (việc `/prd`), KHÔNG vẽ flow (việc `/brainstorm`). |

> __Luồng:__ `/prd` (PRD sản phẩm: danh sách tính năng + luồng tổng quan) → `/roadmap` (xếp đợt) → `/discover <chủ đề>` (điều tra 1 dòng Feature Map còn phân vân → build/skip + scope thô) → `/brainstorm <slug>` (đào sâu từng feature; nhận scope thô từ discover làm seed; tự mark `✅ đã chi tiết` ngược lên Feature Map qua L2 diff) → `/urd /brd /prd-epic /srs ...`.

__Specification phase:__

| Slash | Purpose |
|-------|---------|
| `/urd [<feature>]` | Per-feature User Requirements (personas, needs, journeys, success criteria) |
| `/brd [<feature>]` | Per-feature Business Requirements (objectives SMART, ROI, risks, timeline) |
| `/prd-epic [<feature>]` | Per-feature/epic Requirements (capabilities P0/P1/P2, flows, release plan). Khác `/prd` (PRD toàn sản phẩm, project-level) |
| `/srs [<feature>]` | `spec.md` (FR/NFR/BR/Error Matrix/Success Criteria) trước tiên, rồi hỏi __chạy tới tầng nào__ (menu 4 tầng lũy tiến: [1] Core spec · [2] +Models UC/flows/ERD/state · [3] +UX user-flow/wireframe · [4] +Delivery story/AC · [all]). Chạy __tuần tự__, L1 trước mỗi Write (KHÔNG song song hoá sub-agent ghi trước approval). Front-load gaps (đọc upstream dựng nháp, hỏi chỗ thiếu), NFR hỏi bằng outcome nghiệp vụ |
| `/sequence "<desc>" --feature <slug>` | Sequence diagram, output cố định `srs/{feature}-flows.md` |
| `/activity "<desc>" --feature <slug>` | Activity/flowchart diagram (Mermaid), output cố định `srs/{feature}-flows.md` (cùng file sequence) |
| `/activity-swimlane "<desc>" --feature <slug>` | Activity diagram __swimlane THẬT__ (PlantUML `\|Lane\|`) cho quy trình đa vai trò nhiều cross-lane — lane thẳng cột cố định, node nhảy lane theo actor. Source `.puml`+`.svg` trong `srs/`, nhúng ảnh vào `srs/{feature}-flows.md`. Render qua plantuml.com. Khác `/activity` (Mermaid subgraph giả), `/d2-activity` (D2 đẹp nhưng lane xô lệch khi nhiều cross-edge), `/bpmn` (chuẩn OMG) |
| `/bpmn "<desc quy trình>" --feature <slug>` | BPMN 2.0 chuẩn OMG cho quy trình đa vai trò. Kiến trúc 2 lớp: AI đọc UC/SRS → sinh IR JSON nghiệp vụ (`{slug}.ir.json` + `.src.json`) → semcheck (kiểm phủ actor/branch/error) → engine layout tự động (swimlane + routing tránh đè) → `bpmn/{process}.bpmn` (XML chuẩn OMG, import Camunda/Bizagi/draw.io) + `{feature}-bpmn-editor.html` (kéo-thả sửa như bpmn.io). Engine dùng chung ở `.claude/skills/bpmn/engine/`. AI KHÔNG viết XML/toạ độ — chỉ sinh IR đúng nghiệp vụ. Khác `/activity` (Mermaid) — xem `diagram-selection.md` |
| `/state <entity> --feature <slug>` | State diagram, output cố định `srs/{feature}-states.md` |
| `/erd --feature <slug>` | Mermaid ERD, output cố định `srs/{feature}-erd.md` (per-feature only) |
| `/dbdiagram --feature <slug>` | Schema database DBML (`.dbml` import dbdiagram.io/dbdocs.io + `.sql` export). Tầng gần dev nhất họ ERD — kiểu DB thật + enum + index. Output `dbdiagram/{feature}.dbml`. Khác `/erd` (Mermaid inline, type gọn) + `/d2-erd` (D2 hình đẹp) |
| `/usecase-diagram --feature <slug>` | Use case diagram (visual scope), output `usecases/{feature}-usecase-diagram.puml` + `.svg`; ảnh + bảng Actors/Relationships nhúng vào `{feature}-usecase-index.md` (không còn `.md` wrapper). System boundary bắt buộc; include/extend chỉ khi có evidence |
| `/d2-activity "<desc>" --feature <slug>` | Activity/flowchart diagram ĐẸP đứng riêng bằng D2 (layout ELK gọn hơn Mermaid khi nhiều nhánh/swimlane). Khác `/activity` (Mermaid inline `flows.md`, dàn xấu khi nhiều nhánh), `/bpmn` (chuẩn OMG). Cùng họ `/d2-erd`, `/d2-architect` — render.sh chung |
| `/d2-erd --feature <slug>` | ERD đẹp bằng D2 (`sql_table` với PK/FK, layout ELK). Khác `/erd` (Mermaid nhúng inline, type gọn) + `/dbdiagram` (DBML gần dev nhất) |
| `/d2-architect --feature <slug>` | Sơ đồ kiến trúc hệ thống (component/service/DB lồng nhau) bằng D2, layout ELK — đẹp hơn Mermaid cho loại này. Cùng họ `/d2-activity`, `/d2-erd` |
| `/user-flow <feature\|mô tả>` | Nghiệp vụ → user flow mermaid (happy/error/edge) + chia flow (flow-slug + screens/mỗi flow) → @flow-reviewer review → HARD STOP user confirm. Output cố định `srs/{feature}-userflow.md`. __Chạy TRƯỚC__ `/wireframe-ascii` và `/wireframe-html` — nguồn chia flow DUY NHẤT dùng chung cho cả 2 |
| `/wireframe-ascii <feature> [--flow <slug>]` | ASCII wireframe gộp theo flow (lo-fi, KHÔNG emoji trong khung → viền không lệch), đọc `srs/{feature}-userflow.md` (tự chạy `/user-flow` nếu chưa có). Output `ascii-wireframe/{flow-slug}.md` (1 file/flow, N screen/file) + bảng mô tả 5 cột `# / Items / Control type / Data type / Description` (dùng chung html/prototype) |
| `/wireframe-html <feature> [--flow <slug>]` | HTML wireframe B&W per flow, grid 3 screens/row, render element HTML thật. Đọc `srs/{feature}-userflow.md`; renderer ngang hàng `/wireframe-ascii` — đọc lại screen ASCII đã có làm nguồn element nếu tồn tại, không thì tự suy luận từ tài liệu nghiệp vụ. Output `html-wireframe/{flow}.html` + `{feature}-wireframe-html-index.md`, bảng mô tả 5 cột |
| `/figma <feature>` (hỏi tiếp muốn vẽ gì) hoặc `/figma <screen> --feature <slug>` (đủ ý, khỏi hỏi) | Vẽ thật lên Figma qua figma-ui-mcp; tuân design tokens `docs/design.md`. 2 chế độ chọn bằng câu hỏi tự nhiên (không flag): Nhanh (1 vài màn, base state) hoặc Đầy đủ (cả feature, kèm state/error variant + component reuse, tối đa 5 screens/hàng). Hard gate: kết nối Figma plugin + ASCII đã fill + chốt device size (Mục 7) |
| `/prototype-html <feature> [no-comment]` | Clickable HTML prototype multi-screen (hi-fi — bậc cao nhất thang fidelity) __chạy như app thật__: state-driven (render từ store, hành động đổi state thật) + persist localStorage + menu điều hướng NỔI (TOC + sơ đồ luồng, KHÔNG iframe vì app share 1 store) + design tokens 2 lớp (raw palette → semantic, theme per-section transactional=light/marketing=dark) + vỏ chrome neutral tách khỏi app. __Kèm lớp GÓP Ý ghim-lên-element kiểu Figma (mặc định BẬT)__: pin bám element qua 4 tầng neo (data-cmt → id → selector+chữ ký → dò nội dung), lưu chung qua jsonbin để cả nhóm thấy nhau, phân vai admin (`#admin`, thấy Cài đặt + copy link mời) vs reviewer (chỉ góp ý, xoá/copy của mình). Thêm `no-comment` → bản trình chiếu thuần. Cần userflow (chia flow) + ASCII (bảng 5 cột) + `docs/design.md`. Template `_templates/prototype-html-template.html` · lớp góp ý `.claude/skills/prototype-html/assets/comment-layer.js` |
| `/prototype-next <feature>` | Prototype __chạy được bằng Next.js__ — sinh code thật vào `prototype/` (App Router + Tailwind v4 + shadcn), tự build + tự sửa lỗi + tự chạy local + __tự smoke-test luồng__, rồi báo URL. __App shell đầy đủ__ (sidebar/topbar/user menu + route guard client-side) + luồng đúng SRS + dữ liệu mẫu + __Demo Toolbar nổi 4 khối__ (ép lỗi theo mã `E-{feature}-NNN` · nhảy màn theo flow · tài khoản mẫu 1 chạm · reset + độ trễ giả). "Backend giả" = __zustand persist localStorage__ (`skipHydration`), KHÔNG BE/DB/API/MSW. __Kiến trúc máy-làm-phần-tất-định__: 4 engine ở `.claude/skills/prototype-next/engine/` — `proto-extract` (bóc Error Matrix + wording/FR/BR/entity/state/element từ __KG__, sinh sẵn `errors.ts`+`types.ts`, cảnh báo stale + format bảng lạ, KHÔNG im lặng trả rỗng) · `proto-scaffold` (chép boilerplate) · `proto-build` (build + tự sửa lỗi cơ học, dừng khi lỗi lặp lần 2, in `PROTO_URL`) · `proto-smoke` (Playwright kiểm __4 mức tách bạch__: trang tải · element có mặt · luồng đi đúng · __nhánh lỗi đúng wording__ — build xanh KHÔNG phải verify). AI chỉ đọc userflow + use case + design.md. Update mode qua `.demo-manifest.json`. Chỉ ghi trong `prototype/`. Khác `/prototype-html` (1 file HTML gửi kèm được, có lớp góp ý) |

__Capture (Phase 1-2 — not in template yet):__ `/meet`, `/brainstorm`, `/reverse-doc`, `/code-to-srs`, `/reverse-preview`. `/reverse-doc` tái lập __BỘ SRS chuẩn per-feature__ từ nhiều nguồn rời (docx/pdf/ảnh) → gom theo feature → mỗi feature 1 bộ 3 file trong `docs/_reverse/{feature}/`: `{feature}-reverse-spec.md` (SRS 12 Mục + cột Nguồn/Nhãn + Mục 0 provenance, `status: draft` cứng) + `reverse-sources.md` + `reverse-gaps.md` (OQ/Gap/Conflict). Kiến trúc orchestrator + sub-agent read-only per-feature, chạy 1 mạch Phase A→G (NGUỒN = proof, KHÔNG hỏi lại user — chưa rõ → OQ). DỪNG ở output, route `/srs` để hình thức hoá (giữ nhãn confidence). Thay `/legacy` + `/documentation` cũ (đã xóa).

> **`/reverse-preview <feature>`** — HTML viewer cho bộ SRS tái lập (output `/code-to-srs` hoặc `/reverse-doc` trong `docs/_reverse/{feature}/`). Self-contained, mở bằng browser (nested TOC + mermaid zoom). NHẤN MẠNH đặc thù reverse: __giữ cột Nhãn ✅/🔵/🟡__ (khác `/preview` strip nhãn) + __banner confidence__ + __section Gaps/OQ nổi bật__ + **nhúng `_evidence.md`** (chỉ code-to-srs có). Engine `_scripts/build-reverse-preview.py` tái dùng `_viewer_wrapper.py` (chung chrome với `/preview`+`/export`). Output `{feature}-reverse-preview.html`. Nhóm B — feature chưa có bộ reverse → refuse + route `/code-to-srs`|`/reverse-doc`.

> **`/code-to-srs` = anh em code-first của `/reverse-doc`.** Cùng đích + cùng hạ tầng (template reverse-srs-*, sub-agent read-only, phase-gate, nhãn 3-claim, provenance, ghi `docs/_reverse/{feature}/`, route `/srs`), khác __DUY NHẤT ở nguồn__: `/reverse-doc` đọc tài liệu (docx/pdf/ảnh), `/code-to-srs` đọc __SOURCE CODE__ (route/controller/service/model/validator/guard/migration). Kích hoạt `/code-to-srs <repo-path>`. Điểm đặc thù: __nhãn bất đối xứng__ — cái code KHẲNG ĐỊNH (validator/constant/guard) = ✅ + cite `file:line`; cái code KHÔNG NÓI (vì sao/cho ai/mục tiêu nghiệp vụ/priority) = 🟡 Inferred + OQ. Giữ IT-BA framing: endpoint/function/bảng chỉ ở cột Nguồn (provenance), KHÔNG phơi ra Mục FR/BR; KHÔNG sinh api-reference.md/data-models.md kỹ thuật (entity đi vào ERD nghiệp vụ). __3 nguồn code đặc thù__ (`stacks-reference` R1/R2/R3): __test__ (bóc boundary/edge/rule-ngược — active ✅ cite test:line / skip 🟡 + gaps, KHÔNG chạy test), __i18n catalog__ (resolve mã khóa → wording lỗi thật), __dead-code/flag__ (route no-caller/`@Deprecated`/`if(false)` → 🟡 + OQ + negative-search). __Repo lớn__: Phase A route-first + GATE-SCOPE (in bảng feature + WARN + hỏi user chọn subset khi >~25 feature/>~1500 file/đa-repo; feature chưa chọn = `deferred`, resumable). Sinh thêm **`_evidence.md`/feature** (truy vết code→luồng, §Cross-repo hops = "điểm nghiệp vụ liên quan luồng nào", cite full-repo-path). Engine đọc-code: reference skill `stacks-reference` (recipe bóc fact theo stack Next/Nest/Supabase/Express/Django/FastAPI/Spring/Laravel/Go) + `code-explorer` (map + cluster feature nghiệp vụ bằng bằng-chứng-gọi-chéo-repo).

__Integration (tích hợp API — họ 7 skill):__ quy trình đưa API đối tác/nội bộ vào app đang chạy + test (own/3rd/mixed) qua Bruno. Thứ tự + rule chung: `.claude/rules/api-integration.md`. Explainer: `explain-skills/api-workflow.md` (bảng quy trình) + `api-family.md` (mối liên quan).

| Slash | Purpose |
|-------|---------|
| `/api-assess --feature <slug>` | __[0] Đánh giá đối tác__ (CÓ ĐIỀU KIỆN — chỉ khi chưa chốt provider / build-vs-buy). Scorecard business-fit/SLA/sandbox/cost/compliance/lock-in → khuyến nghị chọn/không. BABOK Vendor Assessment. Output `integration/api-assess.md`. |
| `/api-doc <source> --feature <slug>` | __[1] Hiểu contract__ API 3rd-party (OpenAPI/PDF/URL) → doc nghiệp vụ + error catalog + version pin. Read-only, KHÔNG gọi API. Output `integration/api-summary.md`. |
| `/api-design --feature <slug>` | __[2] ⭐ Integration Blueprint__ — thiết kế TÍCH HỢP nghiệp vụ (orchestration, state-map, source-of-truth, webhook, retry/idempotency nghiệp vụ, reconciliation, degraded-UX). Cây cầu giữa hiểu-API và test. `/api-map` là 1 phần dưới nó. Output `integration/api-design.md`. |
| `/api-map --feature <slug>` | Bảng mapping field 3 tầng (API ↔ entity ↔ UI). Hội tụ dưới `/api-design` trước `/api-checklist`. Output `integration/api-map.md`. |
| `/api-checklist <mô tả>` | __[3] Discovery__ → outline test (own/3rd/mixed lane + outbound/inbound direction). 🟢/🟡/🔴, 🔴→OQ không bịa. Output `test/api/api-checklist.md`. |
| `/api-test [<METHOD /path>] --feature <slug> [--run]` | __[4] Test Bruno__ — expand checklist → `.bru` chạy được (traceability n–n cùng-intent). Secret chỉ trong `bruno/.env`. Output `test/api/api-tests.md` + `bruno/`. |
| `/api-readiness --feature <slug>` | __[5] Go-live gate__ — cutover/feature-flag/monitoring/rollback/SLA-deprecation + bảng go/no-go. "Test PASS ≠ sẵn sàng prod". Output `integration/api-readiness.md`. |

> __Ranh giới BA↔dev:__ BA sở hữu nghiệp-vụ-tích-hợp (trigger/trạng thái/degraded-UX/retry-idempotency cấp nghiệp vụ/reconciliation/SLA/go-no-go); runner `bruno-runner.mjs` + plumbing là dev-enablement. Own bỏ `[0]+[1]` (nguồn = SRS). Đối tác đã chốt → bỏ `[0]`. Chi tiết: `api-integration.md` + report `docs/reports/2026-07-14-api-integration-flow-review.md`.

__Validation (Phase 4):__

| Slash | Purpose |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
|-------|---------|
| `/gap <feature>` | __Soi tính năng còn THIẾU LUỒNG NGHIỆP VỤ gì__ (vào-được-trạng-thái-không-ra-được, hành động thiếu chiều ngược, nhánh error/edge chưa phủ) — engine `flowgap.mjs` 3 thuật toán xác định trên KG + `@flow-reviewer` đọc prose. Ma trận truy vết là output phụ (`docs/_shared/traceability.md`). `/gap --product` đối chiếu Feature Map ↔ Roadmap. |
| `/ask <câu hỏi\|feature\|ID>` | __Hỏi nghiệp vụ này ĐANG hoạt động thế nào__ — giải thích chi tiết business logic/luồng/rule/edge case từ tài liệu đã có, trả lời __ngay trong chat__ cho IT-BA/PO: TL;DR + __sơ đồ luồng ASCII__ (box-drawing kiểu `/brainstorm`) + prose bám sơ đồ + rule/error (mọi thứ trích `file:line`, chống bịa) + Userflow khi nhiều luồng. Gắn KG (`tour`/`facts`/`explore`/`neighbors` để CHỌN file, prose để KẾT LUẬN). __Read-only, KHÔNG sinh/sửa doc__, miễn approval gate. Khác `/gap` (soi luồng THIẾU) và `/reverse-doc` (tái lập SRS có Write). |
| `/doc-drift <feature> --code <path>` (hoặc `--code fe:<p> be:<p>` đa repo · `--all` toàn hệ) | __Code dev có KHỚP docs BA không__ — so __source code__ (folder/git public, read-only) với bộ docs chính thức `docs/{feature}/` (SRS/FR/BR/Error Matrix/UC) → __1 FILE report read-only__ phân loại __Pass/Missing/Mismatch/Extra/Unverifiable__ + cite `file:line`, bám __từng feature VÀ integration liên feature__ (cạnh A→B: Missing-link/Mismatch-link/Extra-link/Broken-contract + sơ đồ phụ thuộc). Mỗi finding có cột __Hướng xử lý__ gợi ý 📄 sửa docs (route `/cr`) hay 🔧 fix/bổ sung code — __user tự quyết, skill KHÔNG tự sửa gì__. Flow 8 phase có __chống-miss__: A2 lập PLAN checklist + gate, D2 VERIFY tự soi trước report; tách extract (Phase C) khỏi phán (Phase D) chống LLM overcorrection. Tái dùng `code-explorer`+`stacks-reference`. Output `docs/reports/doc-drift/{date}-{feature}-code-drift.md`. Khác `/code-to-srs` (SINH docs mới từ code) và `/gap` (soi thiếu luồng NỘI BỘ docs, không đọc code). |

__Delivery (Phase 5):__

| Slash | Purpose |
|-------|---------|
| `/usecase <feature>` | Generate use cases (Cockburn fully-dressed). 2 mode: __discovery__ (chưa có SRS — viết use case elicitation để khám phá nghiệp vụ, rồi route `/srs`) hoặc __downstream__ (có SRS — trích FR, điền traceability). Tự chọn mode theo SRS có tồn tại. |
| `/userstory [<feature>]` | Per-feature user stories, ID `US-NNN`, soft gate SRS chưa approved |
| `/ac [<feature>]` | Generate/repair/review AC, ID `AC-NNN` per-story, L2 diff |
| `/jira <feature> [--push\|--pull\|--reconcile] \| import <KEY>` | __Đồng bộ 2 chiều__ vault ↔ Jira. No-cờ = inspect drift/conflict (an toàn). Push (chỉ-local-đổi) · pull (chỉ-remote-đổi, status/AC/comment) · reconcile (cả-2-đổi, 5 lựa chọn) · import (epic/story lạ → nháp). Remote preflight chống ghi đè, 3-way compare, HARD GATE stale. Mapping GỘP ở `.claude/state/atlassian/sync-state.yaml`. Xem `.claude/rules/atlassian-sync.md` |
| `/confluence <feature> [--push\|--pull\|--reconcile] \| import <page>` | __Đồng bộ 2 chiều__ vault ↔ Confluence. Cùng mô hình `/jira` nhưng adapter Confluence (page body + page tree). Preflight bằng __content-hash bản vừa fetch__ (KHÔNG dựa version — MCP có thể không expose; version chỉ là hint). Comment → feedback inbox; page __xóa__ → tombstone, page __move__ (còn id) → cập nhật parent KHÔNG tombstone; vùng opaque (macro/attachment) chặn push tới khi BA chọn authoritative. Mermaid render theo định dạng tool THẬT nhận (html-macro/ADF, chi tiết `references/mermaid-adf.md`). Chia sync-state CHUNG với `/jira` |
| `/export <feature> [pdf\|docx\|html]` | Local stakeholder package 1 feature; định dạng nói bằng lời hoặc positional (gộp từ export-docx/html/pdf) |
| `/userguide [<feature> ...]` | __Cẩm nang vận hành__ (operator/end-user manual). Hỏi __viết luồng gì__ + __cập nhật vào cẩm nang gốc hay tách riêng__ + để user input/confirm danh sách luồng (tự dò từ userflow nếu có). Đọc ngược `docs/{feature}/` → mục lục __Diátaxis__ → `@manual-reviewer` gate → __HARD STOP__ chờ `tiếp` → hỏi audience/giọng/độ-chi-tiết → viết từng trang → (tùy chọn) __auto-chụp ảnh thật__ đánh số callout (Playwright, engine `.claude/skills/userguide/engine/`). Output gọn: **1 file `{feature}-userguide.html` lộ ra** (docs-style light-only) + __folder bundle__ `{feature}-userguide/` (index/data/pages/images). Forward-terminal → `/export`. Main, report-first, KHÔNG fork. |

**Testing (UI/browser lane — song song họ API `/api-test`):**

| Slash | Purpose |
|-------|---------|
| `/test-checklist <feature>` | Outline scenario cần test (chưa data chi tiết) để review TRƯỚC khi viết test case đầy đủ. 🟢/🟡/🔴. Output `test/checklist/{feature}-checklist-index.md` + `## Coverage` per-obligation. Khác `/ac` (Given/When/Then per story) và `/api-test` (bảng request data thật) |
| `/test-cases <feature>` | Sinh test case chi tiết __1:1 atomic__ từ checklist gần nhất (bắt buộc có `/test-checklist` trước). Output `test/testcases/{feature}-testcase-index.md`. Là spec chạy được — nguồn cho `/playwright-gen` |
| `/playwright-gen <feature> [--run]` | Codegen script Playwright (`.spec.ts`) chạy được từ test case UI (`/test-cases`) → chạy test. Tầng UI/browser (khác `/api-test` Bruno tầng API). Engine `.claude/scripts/playwright-gen.mjs`. Codegen 1 lần ra artifact bền, KHÔNG phải AI chạy test mỗi lần. Output `test/e2e/{feature}-e2e-index.md` + `specs/{scope}.spec.ts` |

__Maintenance (Phase 6):__

| Slash | Purpose |
|-------|---------|
| `/cr "<change>" --feature <slug>` | Unified change workflow: analyze impact → smart verdict (direct-edit-ok vs formal CR) → L2 diff apply loop → auto-run `/gap`. Subcommands `/cr list\|show\|close\|reject <cr-id>` quản lý records cũ. Merged former `/impact`. |
| `/dashboard [<feature>]` | HTML dashboard self-contained: kanban theo status + __coverage/traceability thật__ (FR↔US↔AC↔test, FR chưa phủ, US mồ côi, UC chưa test) + __pipeline funnel__ (mỗi feature đi tới đâu URD→…→test, % hoàn thành) + __chỉ số chất lượng/rủi ro__ (freshness 0-100/doc, review quá hạn, OQ tồn đọng) + action items ưu tiên + stale chain + open CRs. Charts ECharts, filter/sort List.js, dark mode. Nguồn số liệu deterministic từ `_scripts/workspace-status.py`. (Thay `/health` console — đã bỏ 2026-07-13.) |
| `/update-overview [<target>] [--extract\|--add]` | Manage 6 project-level shared docs trong `docs/_shared/` (definitions/env/conventions/system/patterns/__profile__). Manual add hoặc auto-extract từ feature docs. Target `profile` = xem/sửa chủ động `project-profile.md` (đường chính là skill tự hỏi lazy per rule `project-profile.md`) |
| `/delegate` | Chia việc sang CLI AI khác (Codex/Gemini...) để san tải quota: check quota → chọn model theo việc (dài→Claude, ngắn→Codex) → điều phối đa vòng (decompose, review→fix, debate→arbiter). Gọi `/delegate`, hoặc khi user nhắc @codex/@gemini / "ý kiến thứ hai". Không đụng vault. Xem `.claude/rules/agent-conventions.md` |
| `/kg <command> [<arg>]` | Build/query/verify Knowledge Graph của vault — chọn shortlist file phải đọc (`impact`/`coverage`/`neighbors`), thống kê cấu trúc (`facts`/`counts`), kiểm chất lượng liên kết (`--verify`). Hạ tầng cho `/gap` `/cr` `/dashboard` — KHÔNG thay việc đọc prose (contract 3.4bis, xem `.claude/rules/kg-usage.md`) |

__Agents:__

| Agent | Phase | Domain |
|-------|-------|--------|
| `@senior-ba` | 4 | Completeness, edge cases, ambiguity |
| `@po-reviewer` | 4 | Business value, scope creep, prioritization |
| `@pm-reviewer` | 4 | Cross-feature deps, timeline, roadmap |
| `@uxui-reviewer` | 4 | Screen states, flow consistency |
| `@qa-reviewer` | 4 | AC testability, coverage |
| `@tech-reviewer` | 4 | Feasibility, performance, security |
| `@change-tracker` | 6 | CR impact analysis, apply order |
| `@gap-analyst` | 6 | Traceability, stale chain detection |
| `flow-reviewer` (UX_Reviewer) | — | Review user flow + case coverage (happy/error/edge) + chia flow cho `/user-flow`, trước khi ghi `userflow.md` (chạy trước cả `/wireframe-ascii` và `/wireframe-html`) |

__Gate "vẽ ĐÚNG" cho họ diagram__ (rule: `.claude/rules/diagram-correctness.md`):

> Diagram sai ngữ pháp vẫn render ra ảnh đẹp + exit 0 — nên "có ra ảnh" KHÔNG phải verify. Mỗi skill diagram có gate chặn TRƯỚC khi output thành file người ta tin được. Báo cáo tách __4 mức__: cú pháp · an toàn renderer · ngữ pháp/cấu trúc · __nghiệp vụ (máy không kiểm được, phải tự soi)__.

| Gate | File | Phủ skill |
|---|---|---|
| Ngữ pháp UML use case | `.claude/skills/usecase-diagram/puml-usecase-lint.mjs` | `/usecase-diagram` — association phải `--`, `..>` chỉ UC↔UC, nhãn đúng `<<include>>`/`<<extend>>`, ngữ pháp đóng + cảnh báo sai hướng |
| Cấu trúc luồng PlantUML | `.claude/skills/activity-swimlane/puml-activity-lint.mjs` | `/activity-swimlane` — `if`/`endif` cân, có `start`+`stop`, nhánh có nhãn |
| Mermaid 3 tầng | `.claude/scripts/mermaid-verify.mjs` | `/sequence` `/activity` `/state` `/erd` `/user-flow` — thêm tầng __ngữ nghĩa__: state mồ côi/thiếu terminal, ERD entity ma + quan hệ không FK, sequence lifeline chưa khai, flowchart quyết định thiếu nhánh/nhánh cụt |
| Đối chiếu 3 bản ERD | `.claude/scripts/erd-consistency.mjs` | `/erd` (canonical) ↔ `/d2-erd` ↔ `/dbdiagram` — bắt drift mà linter đơn-file mù |
| IR nghiệp vụ BPMN | `.claude/skills/bpmn/engine/bpmn-semcheck.mjs` | `/bpmn` — id trùng, đúng 1 start, gateway có nhãn, tới được end (đều hard-fail) |

Chạy lại toàn bộ sau khi sửa gate: `bash .claude/scripts/diagram-gates-selftest.sh` (kiểm 2 chiều: chặn cái sai + không chặn oan cái đúng).

__Hooks (auto-fire on PostToolUse Write/Edit):__

- `auto-changelog.sh` — append 1 dòng sự kiện vào `docs/_shared/changelog.md` (writer duy nhất, dedupe dòng trùng).
- `status-transition.sh` — print suggestion khi `status:` field thay đổi.
- `post-edit-stale.sh` — reverse-graph scan `links:` → mark downstream `status: stale` + log `_shared/staleness.md`.
- `session-init.sh` (SessionStart) — print dashboard counts.

> Hook `auto-commit.sh` đã xóa (2026-07-06) — commit git thực hiện thủ công theo nhu cầu.

__Pattern toàn pipeline:__

- No-arg = interactive feature picker (URD/BRD/PRD/SRS/userstory/ac).
- Auto-detect upstream + confirm trước seed (KHÔNG silent pick).
- Soft gate khi thiếu upstream (warn + proceed) — trừ `/jira --push` (hard gate on stale).
- `context: fork` CHỈ cho skill KHÔNG có HITL (heavy I/O thuần): `/preview` (bundle MD→HTML, không hỏi user). __KHÔNG fork__ mọi skill có HITL thật — `/user-flow` (clarify loop + HARD STOP), `/wireframe-ascii` (L3 iterate), `/wireframe-html` + `/figma` (đều hỏi device qua AskUserQuestion per `ba-conventions.md` Mục 7), `/srs`, `/cr` — vì fork = không có kênh user trả lời prompt → mọi L1/L2/AskUserQuestion/HARD STOP bị auto-skip (root cause bug CR-20260612-001: skill tự apply/Write không hỏi). Skill nào gọi AskUserQuestion phải khai nó trong `allowed-tools`. Phân tích nặng vẫn delegate qua Task sub-agent (không cần fork toàn skill). Xem `cr/SKILL.md`, `srs/SKILL.md`, `user-flow/SKILL.md`.
- L1 plan preview / L2 diff confirm / L3 iterate refine — per `_rules/approval-gate.md`.

## Conventions

- __Filenames__: kebab-case slug (`user-login`, `payment-checkout`, NOT `User_Login`)
- __Wikilinks__: `[[docs/payment/srs/spec|Payment SRS]]` — full path từ vault root, Obsidian + GitHub render
- __Dates__: ISO `YYYY-MM-DD`
- __Mermaid diagrams__: inline ` ```mermaid ` blocks
- __Frontmatter__: YAML tối giản — doc per-feature có `type`, `feature`, `status`, `updated`, `links` (flat list). KHÔNG có `created`/`owner`/`changelog` (diet 2026-07-12 — lịch sử + tác giả sống ở `docs/_shared/changelog.md`)
- __IDs feature-prefixed__ cho cross-aggregate: `FR-{feature}-NNN`, `NFR-{feature}-NNN`, `BR-{feature}-NNN`, `E-{feature}-NNN`, `BO-{feature}-NN`, `CAP-{feature}-NN`. US/AC scope qua path (no feature prefix in ID). See `.claude/rules/naming-conventions.md` Mục ID conventions.
- __Language__: Vietnamese-first; tiếng Anh cũng support; auto-detect từ seed.

## How Claude Code uses this

1. Session start: `.claude/hooks/session-init.sh` → set `$TODAY`, `$PROJECT_NAME`, in status counts (stale items, open CRs, stuck reviews >7d).
2. User invokes skill (vd `/urd payment`) → Claude đọc `.claude/skills/urd/SKILL.md` → tuân Goal + Constraints (Hard rules / Pitfalls) + Approach.
3. Skill scan upstream candidates, ask user pick, ask clarifying questions (numbered list, wait reply).
4. Skill synthesize content → __L1 plan preview__ → user Y/n/select → Write file with frontmatter chuẩn (hook ghi changelog.md).
5. Sau Write/Edit, hooks chạy: `auto-changelog.sh` (fallback), `status-transition.sh`, `post-edit-stale.sh` (Phase 6). Commit git làm thủ công (không còn auto-commit).

## Quick start‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```bash
# 1. Clone or copy this template, rename project root to your project slug
mv ba-vault-template my-project
cd my-project

# 2. Init git
git init && git add . && git commit -m "Initial vault from ba-vault-template"

# 3. (Optional) Open in Obsidian: File → Open vault → select project root

# 4. Open in Claude Code
claude

# 5. Capture idea hoặc start với requirements
> /brainstorm user-login            # capture raw idea (Phase 1-2)
> /urd user-login                   # hoặc straight tới URD (Phase 3)
> /brd user-login                   # business case
> /prd-epic user-login              # feature scope (capabilities P0/P1/P2)
> /srs user-login                   # tech spec (auto folder structure)
> /sequence "User submits credentials..." --feature user-login
> /erd --feature user-login
> /user-flow user-login              # user flow trước khi vẽ wireframe
> /wireframe-ascii user-login        # ASCII gộp theo flow
```



<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
