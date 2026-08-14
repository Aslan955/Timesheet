---
name: userstory
description: Dùng khi cần sinh user story sẵn sàng đưa vào backlog từ FR/use case/screen của SRS. `/userstory <feature>` hoặc `/userstory` (chọn feature).
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
argument-hint: "[<feature>]"
---
<!-- Licensed to nguyennam162nvn@gmail.com — Order ZQ6DTFZBW -->

# /userstory — SRS → User Stories‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Goal‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Generate **backlog-draft user stories cần refinement** (KHÔNG tự nhận "dev-ready" — story chưa có AC chốt + rule + dependency thì chưa đạt Definition of Ready) cho sprint backlog. Mỗi US = 1 vertical business slice (persona + capability + benefit thật) + linked FR + UI ref + (placeholder) AC. Numbering scope per-feature folder (us-001, us-002, ...).

> **Nguyên tắc chia story (quan trọng):** trục chia CHÍNH là **smallest end-to-end business outcome** (vertical slice tạo giá trị quan sát được) — screen/actor/FR chỉ là **tín hiệu phụ** gợi ý chỗ cắt, KHÔNG phải trục chính. Screen là thiết kế (presentation), không phải business slice; chia theo screen dễ tạo story không có giá trị độc lập + dependency tuần tự. Xem `## Story split strategy` + mục Pitfalls.

## File model (index pattern, giống `/usecase` + `/ascii-wireframe`)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Mọi metadata không lặp lại per-file. 2 loại file:

| File | Vai trò | Frontmatter |
|------|---------|-------------|
| `userstories/{feature}-story-index.md` | **Master**: frontmatter đầy đủ + bảng Stories (ID/title/persona/FR/screens/priority/**status**/**jira key**/updated) cho toàn bộ stories | FULL (`type: userstory-index`) |
| `userstories/us-{NNN}.md` | **Content**: prose sections (User Story / Context / Linked Requirements / AC inline / UI refs / Error refs / Dependencies / OQs) | **ZERO** frontmatter |

Per-story `status`, `priority`, `jira key` sống ở **bảng index**, KHÔNG ở file us. Url + pushed_at của Jira sống ở `.claude/state/atlassian/sync-state.yaml` (canonical — thay `docs/_shared/jira-map.md` cũ đã migrate/xóa). Changelog của mọi story route về `{feature}-story-index.md` với prefix `[us-NNN]`.

## Constraints‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Hard rules — never violate‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- **L1 approval** trước batch Write.
- **L2 diff khi file đã tồn tại** — update mode tự động (cả `{feature}-story-index.md` + us files).
- **Feature/SRS chưa tồn tại → REFUSE + route `/srs`** (per `feature-bootstrap.md` nhóm B) — không có FR thật thì không split được story, tự bịa sẽ sai; **SRS tồn tại nhưng chưa approved → soft gate warn + proceed**.
- **Story ID `US-{NNN}`** (path scope feature, ID không cần prefix).
- **Continuous numbering** — scan existing max + 1 từ bảng `{feature}-story-index.md` + glob files, never reuse deleted.
- **Auto-detect** UC + screens cho story split strategy.
- **Vietnamese-first**.
- **Index frontmatter đầy đủ** (`type: userstory-index`); us files **zero frontmatter**.
- **Jira key idempotency** đọc từ cột Jira của bảng `{feature}-story-index.md` (KHÔNG còn `jira:` object trên file us). Update mode KHÔNG đụng cột Jira (do `/jira` quản lý).
- **BA conventions** (must follow) — Owner resolution từ memory `user-identity`, no-re-ask rule, IT-BA framing, Vietnamese typography, L1 prose preview. Per @../../rules/ba-conventions.md.

### Pitfalls — easy to get wrong

- **No FR table** trong SRS — ask user derive from prose, hoặc stop với warn.
- **FR mơ hồ ≠ FR to.** FR quá rộng nhưng rõ nghiệp vụ → split thành nhiều outcome. FR **mơ hồ** (thiếu actor/threshold/rule) → KHÔNG cứ split (dễ tạo story tưởng đúng mà không có quyết định nghiệp vụ) → sinh nháp + đánh OQ trả refinement.
- **Multiple actors trong 1 FR** — chỉ split by actor khi các actor có **mục tiêu/rule thật sự khác**; nếu hành vi giống chỉ tên role khác thì KHÔNG split (per split-strategy: actor là tín hiệu phụ).
- **NFR / cross-cutting requirement** — KHÔNG ép mỗi NFR = 1 story. Attach NFR vào story liên quan (as constraint/AC), HOẶC tạo enabler story, HOẶC ghi thành AC cấp release. Nêu rõ ở OQ nếu chưa quyết được attach vào đâu.
- **Existing story đã push Jira** (cột Jira trong `{feature}-story-index.md` ≠ `—`) — update mode KHÔNG đụng cột Jira/Status, chỉ sửa content us file + các cột mô tả. Jira là việc của `/jira`.
- **Index drift** — nếu glob us-*.md có file không có trong bảng `{feature}-story-index.md` (tạo tay) → warn + đề xuất thêm row. Ngược lại row trỏ tới us file không tồn tại → warn broken link.
- **Screen references missing** — generate story + add OQ "Screen ref TBD" + warning.
- **Numbering gap** (vd us-001, us-003 tồn tại — us-002 deleted) — KHÔNG reuse us-002, continue from us-004.
- **Story numbering scope per-feature**, KHÔNG global — `docs/payment/userstories/us-001.md` và `docs/auth/userstories/us-001.md` cùng tồn tại OK.
- **Feature/SRS hoàn toàn không tồn tại** — refuse + route `/srs {feature}` (không tự tạo feature, không bịa FR). **SRS tồn tại nhưng draft/in-review** — soft gate proceed, flag mỗi story `<!-- built from draft SRS, may need refinement -->`. Đừng gộp 2 case.
- **Hook stale-propagation** sẽ fire khi edit US → mark downstream AC stale (Phase 6).
- **Auto-chain `/ac`** chỉ áp dụng cho stories **vừa tạo trong session này**. Stories cũ (update mode) KHÔNG auto-chain — user gọi `/ac` explicit và nói "sửa lại AC" nếu cần repair.
- **Sửa content story đã push Jira → cảnh báo drift.** Update mode giữ nguyên cột Jira, nhưng **sửa nội dung us file** của story đã có Jira key tạo lệch local ↔ Jira. Khi diff đụng story đã push → warn "story này đã ở Jira {key}, nội dung sẽ lệch cho tới khi re-sync — cân nhắc `/cr` hoặc `/jira` update" trước khi apply.
- **Guardrail chống bịa (bắt buộc):** (1) mỗi story/AC **preserve ID + trích nguồn** (`spec.md#FR-...`); (2) phân biệt rõ **fact từ spec / suy luận hợp lý / open question** — KHÔNG tự quyết business rule còn thiếu, cần draft thì đánh dấu OQ; (3) sau generate tự soi **duplicate** (2 story cùng outcome từ 2 FR liên hệ → dedupe) + **contradiction** (terminology/state/threshold lệch SRS); (4) đánh giá story theo **giá trị hành vi + traceability**, KHÔNG theo "đủ template / đủ câu As-a-user"; (5) người chịu trách nhiệm nghiệp vụ phải review **outcome cuối**.

## Inputs

```
/userstory                  # interactive: pick feature từ menu
/userstory <feature>        # create stories (auto-detect UC + screens, auto-pick split strategy)
```

Có sẵn stories rồi → tự động vào update mode (L2 diff), không cần flag. Muốn tạo cho 1 UC/FR cụ thể — nói bằng lời (vd "chỉ tạo story cho use case login").

**Customization inline** trong L1 prompt (KHÔNG cần flag):
- Scope hẹp 1 FR / 1 UC → user reply trong L1 vd "chỉ FR-payment-002" hoặc "chỉ UC-checkout".
- Override split strategy → user reply "split by screen" / "split by actor". Default skill tự pick.

## Context (dynamic)

Today: !`date +%Y-%m-%d`
Features có SRS: !`for d in docs/*/srs/*-spec.md; do [ -f "$d" ] && dirname "$d" | xargs dirname | xargs basename; done | head -20`
Features có US: !`for d in docs/*/userstories/; do [ -d "$d" ] && dirname "$d" | xargs basename; done | head -10`‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Approach

1. **Resolve feature.** No-arg → interactive picker. Phân biệt 2 case (per `feature-bootstrap.md` nhóm B):
   - **Feature/`srs/{feature}-spec.md` KHÔNG tồn tại** (feature chưa có, hoặc arg gõ sai) → **REFUSE tường minh + route**: "Chưa thể chạy `/userstory` cho `{feature}` — thiếu `srs/{feature}-spec.md` (cần FR để split story). Feature hiện có: {list}. Chạy `/srs {feature}` trước để tạo FR, rồi quay lại." KHÔNG tự tạo feature.
   - **`srs/{feature}-spec.md` tồn tại** nhưng `status: draft/in-review` → soft gate warn + proceed (có FR thật để làm, chỉ chưa approved — flag mỗi story "built from draft SRS").
2. **Read** SRS spec + flows + screens + UCs nếu present.
   - **KG chọn nguồn trước (rẻ hơn scan):** chạy `node .claude/skills/kg/engine/kg-query.mjs coverage {feature}` và `node .claude/skills/kg/engine/kg-query.mjs facts {feature}` để lấy danh sách candidate/coverage, rồi VẪN Read đầy đủ prose file đã chọn. Tuân `.claude/rules/kg-usage.md` (3 nghĩa vụ: `--all` khi bị cap · đọc mục "Phải Read tay" · `KG-ERROR` → scan trực tiếp như cũ).
3. **Story split strategy (default = vertical slice):**
   - **Default `outcome`:** 1 story = 1 smallest end-to-end business outcome (user hoàn thành 1 việc có giá trị quan sát được). Ưu tiên patterns SPIDR/workflow-step/rule-variation — chia theo **hành vi nghiệp vụ**, KHÔNG theo tầng UI/API/DB.
   - Tín hiệu phụ (chỉ gợi ý chỗ cắt, KHÔNG phải trục chính, user có thể override inline ở L1):
     - `fr`: FR/FR-cluster gợi ý ranh giới capability.
     - `actor`: nhiều actor có mục tiêu/rule **thật sự khác** → cắt theo actor (KHÔNG cắt chỉ vì tên role khác mà hành vi giống).
     - `screen`: screen = thiết kế, chỉ dùng khi 1 screen đúng bằng 1 outcome độc lập — mặc định KHÔNG chia theo screen.
   - Mỗi story phải tự đứng vững (independently valuable + testable). Story chỉ là "tạo table / xây endpoint / vẽ UI" = technical task trá hình → gộp vào outcome hoặc đánh dấu enabler.
4. **DoR + INVEST self-check (trước preview).** Với mỗi story nháp, tự soi:
   - **INVEST**: Independent (dependency nhận diện rõ, không chuỗi tuần tự cứng) · Negotiable (không chép nguyên SRS/khóa cứng giải pháp) · **Valuable** (vertical slice có giá trị, không phải technical task) · Estimable (đủ rõ actor/rule/error để ước lượng) · Small (1 iteration, 1 outcome) · Testable (kết quả pass/fail quan sát được). KHÔNG chấm theo từ khóa ("As a…" ≠ có value).
   - **DoR nhẹ**: actor + outcome rõ · business value/lý do ưu tiên rõ · scope + ngoài-scope rõ · dependency/assumption/risk nhận diện.
   - **FR mơ hồ / thiếu value / dependency chưa rõ / không estimate được → KHÔNG cứ thế split.** Sinh story nháp + đánh dấu **Open Question** (trả về refinement), gắn note nguồn "cần làm rõ trước dev". Đừng bịa actor/threshold/permission để lấp khoảng trống — đánh OQ.
   - Phân biệt 3 loại nội dung khi viết: **fact từ spec / suy luận hợp lý / open question** (per Pitfalls guardrail).
5. **Numbering** — scan bảng `{feature}-story-index.md` + glob `docs/{feature}/userstories/us-*.md`, find max NNN, continue.
6. **Preview table** (thêm cột Nguồn để lộ fact vs suy-luận):
   ```
   Planned stories:
   | # | Title | Persona | Covers FRs | Screens | Priority | Nguồn/OQ |
   |---|-------|---------|------------|---------|----------|----------|
   | 001 | Submit login credentials | User | FR-{feature}-001 | login | P0 | fact FR-001 |
   ```
7. **L1 approval** preview file list + counts (gồm `{feature}-story-index.md` create/update + N us files). Nếu có story đánh OQ (FR mơ hồ) → nêu rõ ở L1 "N story cần refinement trước dev".
8. **Index file** — tạo `userstories/{feature}-story-index.md` từ `_templates/user-story-index.md` nếu chưa có (frontmatter đầy đủ, `type: userstory-index`, owner từ memory). Nếu đã có → append rows vào bảng Stories (giữ rows cũ + cột Jira/Status nguyên trạng). Mỗi story 1 row: ID/title/persona/FR/screens/priority/status=`draft`/jira=`—`/updated.
9. **Generate us files** từ `_templates/user-story.md` (**zero frontmatter**). Body Mục AC: giữ placeholder DRAFT của template (`<!-- DRAFT — run /ac ... -->`). Mục Open Questions: đánh dấu nguồn 🟢 fact / 🔵 suy-luận / 🔴 cần refinement.
10. **Update mode (file đã tồn tại)** — **semantic diff theo từng story** (KHÔNG regenerate toàn file — giữ decision/estimate/comment/Jira key user đã sửa tay): L2 diff per us file + L2 diff bảng `{feature}-story-index.md`. KHÔNG đụng cột Jira (do `/jira` sở hữu). Status trong bảng giữ nguyên trừ khi user đổi explicit.
11. **Activity.log (hook tự ghi)** (KHÔNG vào us file — us zero-frontmatter). Mỗi story: set env `CLAUDE_SKILL_NAME=/userstory` + `CLAUDE_CHANGELOG_AUTHOR={@author}` + `CLAUDE_CHANGELOG_NOTE=[us-NNN] created from FR-{feature}-{NNN}` (≤80 ký tự) trước edit; hook ghép cả dòng.
12. **Auto-chain /ac (default)** — sau khi write thành công, hỏi:
    ```
    ✅ Đã tạo {N} user stories. Generate Acceptance Criteria luôn không?
      Y       → chain /ac {feature} cho stories vừa tạo (recommended)
      n       → skip, để chạy /ac sau (AC placeholder TODO sẽ giữ nguyên)
      <ids>   → chỉ generate AC cho stories cụ thể (vd "us-001,us-003")
    ```
    Y → invoke `/ac` skill inline với scope stories vừa tạo (KHÔNG re-pick feature, KHÔNG re-read SRS — pass context), mode generate mặc định. Vẫn tuân L1+L2 của `/ac`. **AC sinh ở bước này = draft**, cần PO/QA chốt example + rule trước khi coi là AC final.
13. **Coverage check** — gợi ý chạy `/gap {feature}` để dựng ma trận FR/BR/NFR/error → US → AC + phát hiện FR chưa được story nào phủ / US thiếu AC / story trùng outcome. (KHÔNG nhồi ma trận vào skill này — `/gap` là nơi làm traceability cross-doc.)
14. **Output** + next: `/gap {feature}` (check coverage), `/jira {feature} --dry-run` (flag giữ nguyên — cổng an toàn trước khi đẩy Jira thật). (Nếu skip step 12: gợi ý `/ac {feature}`.)

## Output

| File | Nội dung |
|---|---|
| `docs/{feature}/userstories/us-{NNN}.md` | Nội dung story — **zero frontmatter**, prose sections (AC inline) |
| `docs/{feature}/userstories/{feature}-story-index.md` | Master metadata + bảng Stories (ID/persona/FR/screens/priority/status/jira-key) |

Status + priority + jira key sống ở **index**, KHÔNG ở file us. Hook tự ghi `docs/_shared/changelog.md`.

## References

- @../../rules/ba-conventions.md
- @../../rules/approval-gate.md
- @../../rules/kg-usage.md
- @../../rules/naming-conventions.md
- @../../rules/feature-bootstrap.md
- @../../rules/delivery-readiness.md
- @../../rules/changelog.md
- @../../../_templates/user-story-index.md
- @../../../_templates/user-story.md
- @../../../_templates/ac-block.md‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
