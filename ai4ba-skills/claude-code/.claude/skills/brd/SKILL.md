---
name: brd
description: Dùng khi cần ghi lý do kinh doanh, mục tiêu, phạm vi, stakeholder, business rule và rủi ro cấp nghiệp vụ cho 1 feature. `/brd <feature>` hoặc `/brd` (chọn feature).
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
argument-hint: "[<feature>]"
---
<!-- Licensed to nguyennam162nvn@gmail.com — Order ZQ6DTFZBW -->

# /brd — Per-feature Business Requirements Document‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Goal‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Produce `docs/{feature}/{feature}-brd.md` trả lời __vì sao doanh nghiệp cần thay đổi này, mục tiêu nghiệp vụ là gì, phạm vi tới đâu và ràng buộc nào phải tuân__. Đây là tài liệu ở tầng __business requirements__ (theo BABOK/IIBA) mà IT-BA/PO tổng hợp — không phải business case đầu tư đầy đủ.

BRD giữ chuỗi truy vết nghiệp vụ:

`Business problem → Objective → Success measure → Scope → Business rule/constraint → Risk`

Doc tập trung business goal, current/future state, scope, stakeholder, business rule và ràng buộc nghiệp vụ. Không chứa user-needs detail (URD), product capabilities/release scope (PRD), system behavior (SRS) hay delivery plan. Không đi sâu financial modeling (NPV, ROI scenarios, options analysis nhiều phương án, investment decision gates) — cost-benefit chỉ ở mức định tính + rough ROI để justify; phân tích đầu tư chi tiết là business case riêng do sponsor/finance sở hữu.

## Constraints (must follow)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Hard rules — never violate‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- __Approval L1__ trước Write/Edit; preview BA-friendly theo `ba-conventions.md`.
- __L2 diff khi file đã tồn tại__ — update mode tự động, preserve user edits, chỉ sửa phần có facts mới.
- __Auto-detect upstream + confirm__ — list ưu tiên `{feature}-urd.md > brainstorms/* > docs/_product/prd.md`; user chọn number/skip/path. Không auto-pick.
- __Read-before-ask bắt buộc__ — đọc full existing BRD và mọi nguồn đã chọn, lập coverage nội bộ rồi chỉ hỏi phần `missing/conflicting`. Không hỏi lại facts đã có.
- __Thông tin cấp dự án đọc + ghi vào profile__ — domain, thị trường, mô hình kinh doanh, compliance áp dụng (hay xuất hiện ở Business Scope/Risks): đọc `docs/_shared/project-profile.md` trước; thiếu thì hỏi rồi đề xuất ghi vào profile. Per @../../rules/project-profile.md.
- __BRD chạy độc lập__ — thiếu URD/brainstorm là soft gate; hỏi đúng business context còn thiếu, không bắt chạy skill upstream.
- __Đúng tầng BRD:__
  - Giữ: business problem/objective, current & future state, gap, business scope, stakeholders & stakeholder requirements, high-level business requirements, business rules, assumptions/constraints/dependencies, risks, success measures, cost-benefit định tính.
  - Chuyển URD: user needs, user journeys chi tiết, user-facing edge cases, persona detail.
  - Chuyển PRD: capabilities, P0/P1/P2, product flows, release feature scope.
  - Chuyển SRS: API/DB/service/SDK, error codes, retry, architecture, technical mitigation.
  - Chuyển project plan: sprint, build sequence, integration/testing task schedule.
  - Chuyển business case: NPV/DCF, options analysis đa phương án, investment decision gates, financial scenario modeling.
- __IT-BA framing__ (per `ba-conventions.md` Mục 3) — mô tả nghiệp vụ, không hỏi/ghi chi tiết kỹ thuật. Dịch vụ ngoài chỉ nêu tên + mục đích nghiệp vụ.
- __Evidence transparency__ — baseline, benefit, cost, target quan trọng phải có source/basis hoặc ghi `Assumption`. Không trình bày inference như fact.
- __Cost-benefit nhẹ, không bịa số__ — trình bày định tính (cost driver + benefit + rough ROI/ưu tiên). Thiếu số liệu → ghi `Chưa có` + OQ; KHÔNG dựng NPV/payback/ROI scenario giả chính xác.
- __Objective ↔ Success measure trace__ — mỗi `BO-{feature}-NN` có ≥1 success measure đo được (baseline nếu có, target, cách đo). Đây là business outcome, không phải KPI dashboard chi tiết.
- __Scope là business boundary__ — process/segment/geography/channel/operating unit; không dùng scope để liệt kê feature/capability sản phẩm.
- __Business rule ≠ technical rule__ — business rule là chính sách/ràng buộc nghiệp vụ (vd "khiếu nại tối đa 5 lần/đơn"), viết ngôn ngữ nghiệp vụ; rule kỹ thuật/validation chi tiết thuộc SRS.
- __Risk là business-facing__ — impact/likelihood/mitigation ở mức nghiệp vụ-vận hành; không mô tả technical mitigation.
- __Vietnamese-first__ — auto-detect từ source; user yêu cầu tiếng Anh thì override.
- __Frontmatter tối giản__ — chỉ `type`, `feature`, `status`, `updated`, `links`.
- __Activity log tập trung__ — resolve `@author` theo `ba-conventions.md`; trước mỗi Write/Edit set `CLAUDE_SKILL_NAME`, `CLAUDE_CHANGELOG_NOTE`, `CLAUDE_CHANGELOG_AUTHOR`; hook là writer duy nhất của `docs/_shared/changelog.md`. Skill không ghi history vào doc.
- __Auto-review + auto-fix mặc định__ — user nói “khỏi review” mới skip.

### Pitfalls — easy to get wrong‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- __Không có baseline__ — ghi `Chưa có — xác lập bằng {source/method}`, không ép user bịa.
- __BRD ≠ business case__ — nếu user hỏi NPV/ROI đa phương án/quyết định đầu tư → nói rõ đó là business case riêng do sponsor/finance sở hữu, BRD chỉ giữ cost-benefit định tính để justify.
- __Business rule vs technical rule__ — "đơn > 50 triệu cần cấp quản lý duyệt" là business rule; "validate field amount kiểu number" là SRS.
- __Current/Future/Gap là lõi IT-BA__ — đừng bỏ qua; đây là phần phân biệt BRD của BA với brief marketing.
- __Stakeholder requirement__ — ghi kỳ vọng/nhu cầu của từng nhóm stakeholder, không chỉ tên + vai trò.
- __Technical mitigation__ — chuyển SRS; BRD dùng ngôn ngữ nghiệp vụ ("giới hạn quyền duyệt", "cần compliance sign-off").
- __Stakeholder name chưa xác nhận__ — dùng role, không bịa cá nhân.
- __Existing BRD legacy__ — preserve facts, update section được yêu cầu; không migrate docs khác.
- __Hook stale propagation__ tự xử lý downstream; skill không set stale thủ công.

## Inputs

```text
/brd                            # interactive feature picker
/brd <feature>                  # target feature; existing file → update mode
```

Natural-language controls:
- Nguồn khác → tag `@file` hoặc dán nội dung.
- Tiếng Anh → nói “viết bằng tiếng Anh”.
- Bỏ review → nói “khỏi review”.

## Context (dynamic)

Today: !`date +%Y-%m-%d`
Features: !`ls -d docs/*/ 2>/dev/null | xargs -I{} basename {} | head -20`

## Approach

1) __Resolve feature.__ No-arg → picker. Feature mới xử lý theo `feature-bootstrap.md`: prose → derive slug; slug lạ → hỏi mới hay gõ nhầm; tạo folder sau L1.
2) __Resolve author__ cho activity log; không đưa author vào frontmatter.
3) __Read existing first.__ Nếu `docs/{feature}/{feature}-brd.md` tồn tại, đọc toàn bộ và báo update mode.
4) __Detect sources.__ Scan `docs/{feature}/{feature}-urd.md`, `docs/{feature}/brainstorms/*.md`, `docs/_product/prd.md` và user-tagged source; list để user chọn rồi đọc full selected sources.
   - __KG chọn nguồn trước (rẻ hơn scan):__ chạy `node .claude/skills/kg/engine/kg-query.mjs facts {feature}` và `node .claude/skills/kg/engine/kg-query.mjs neighbors <doc-path>` khi có doc mốc để lấy danh sách candidate/coverage, rồi VẪN Read đầy đủ prose file đã chọn. Tuân `.claude/rules/kg-usage.md` (3 nghĩa vụ: `--all` khi bị cap · đọc mục "Phải Read tay" · `KG-ERROR` → scan trực tiếp như cũ).
5) __Build coverage map nội bộ__ với trạng thái `known / inferable / missing / conflicting`:
   - business problem, baseline, business impact;
   - opportunity/why-now, strategic alignment;
   - current state (quy trình/cách làm hiện tại);
   - future state + gap;
   - business objectives + success measures;
   - business scope (in/out) + constraints + dependencies;
   - stakeholders + stakeholder requirements;
   - high-level business requirements;
   - business rules;
   - assumptions;‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
   - risks;
   - cost-benefit định tính;
   - open questions.
6) __Ask only missing/conflicting.__ Hỏi 3-8 câu numbered trong 1 batch, business language, ưu tiên dữ kiện ảnh hưởng mục tiêu/phạm vi. Không hỏi lại `known`; `inferable` → dùng phương án hợp lý và gắn Assumption. Follow-up chỉ phần chưa đủ.
7) **Synthesize theo `_templates/brd.md`:**
   - __Executive Summary:__ problem, mục tiêu, phạm vi tóm tắt, giá trị nghiệp vụ, timeline cấp cao.
   - __Business Problem & Context:__ `BP-*` business condition + baseline + impact + evidence; opportunity/why-now; strategic alignment (map OKR/chiến lược).
   - __Current State / Future State / Gap:__ cách làm hiện tại → trạng thái mong muốn → gap chính cần giải (đặc thù IT-BA).
   - __Stakeholders:__ role, interest, influence, stakeholder requirement/expectation; không bịa tên người.
   - __Business Objectives & Success Measures:__ `BO-*` SMART + success measure đo được (baseline/target/cách đo).
   - __Business Scope:__ in-scope/out-of-scope + assumptions + constraints + dependencies.
   - __High-level Business Requirements:__ `BREQ-*` — điều nghiệp vụ cần đạt, ngôn ngữ nghiệp vụ, trace về BO. Không phải FR kỹ thuật.
   - __Business Rules:__ `BR-*` — chính sách/ràng buộc nghiệp vụ (giới hạn, điều kiện, quyền duyệt). Ngôn ngữ nghiệp vụ.
   - __Cost-Benefit (định tính):__ cost driver chính + benefit chính + rough ROI/mức ưu tiên. Không NPV/scenario.
   - __Risks:__ `RISK-*` — likelihood, impact, mitigation nghiệp vụ, owner role.
   - __Open Questions:__ quyết định nghiệp vụ còn treo.
8) __Cost-benefit handling:__
   - Trình bày định tính: cost driver, benefit nghiệp vụ, mức độ ưu tiên/rough ROI.
   - Có số thì ghi kèm basis; thiếu → `Chưa có` + OQ.
   - KHÔNG dựng NPV/payback/financial scenario. Nếu user thực sự cần đầu tư analysis → route "đó là business case riêng".
9) __Quality boundary pass:__ chuyển/viết lại mọi user-needs detail, capability, API/DB/architecture, technical mitigation, delivery task hoặc financial modeling sai tầng.
10) __Quality gate trước L1:__
    - mọi `BO-*` có ≥1 success measure;
    - success measure có cách đo (baseline nếu có + target);
    - có current state, future state và gap;
    - scope có in/out + assumptions + constraints;
    - business rule viết ngôn ngữ nghiệp vụ, không phải validation kỹ thuật;
    - high-level requirement trace về BO;
    - risk có mitigation + owner role;
    - cost-benefit định tính, không có số bịa;
    - không có detail thuộc URD/PRD/SRS/project plan/business case.
    Fail material → hỏi thêm; inferable → mark Assumption.
11) __L1 preview.__ Nêu problem/mục tiêu, số BO/success measure/business requirement/business rule/risk, phạm vi, cost-benefit định tính, assumptions/OQs và activity note. Wait Y/n/sửa.
12) __Write/Update.__ Set activity env rồi Write/Edit `docs/{feature}/{feature}-brd.md`; L2 trước Edit.
13) __Phase E — Resolve Open Questions.__ Theo `resolve-oqs.md`: own + inherited từ brainstorm và `{feature}-urd.md`; one-by-one; cascade scan + L2; hook log mỗi edit.
14) __Phase F — Auto-review + auto-fix.__ Spawn `@senior-ba`, `@po-reviewer`, `@pm-reviewer` song song. Ngoài review-format chung, soi: objective ↔ success measure trace, gap coverage, scope-layer leakage, business-rule vs technical-rule, evidence quality. Tự apply findings hợp lý; auto-decision gắn Assumption và liệt kê dưới `🔶 Quyết định thay user — review lại`. Set activity env trước fixes.
15) __Final report.__ Path; counts BO/success measure/business requirement/business rule/risk; OQ resolved/hold; assumptions pending; review fixes + `🔶`; next `/prd-epic {feature}`.

## Output

`docs/{feature}/{feature}-brd.md` — Business Requirements (`type: brd`). FULL frontmatter.

ID feature-prefixed: `BO-{feature}-NN` (objective), `BR-{feature}-NNN` (business rule).

Hook tự ghi 1 dòng vào `docs/_shared/changelog.md`.

## Quality checklist

Reviewer phải lần theo được:

`BP-* → BO-* → success measure → BREQ-* → BR-* / RISK-*`

- Mỗi objective có success measure đo được; không có objective mồ côi.
- Có current state → future state → gap rõ ràng.
- Business requirement ngôn ngữ nghiệp vụ, trace về objective.
- Business rule là chính sách nghiệp vụ, không phải validation kỹ thuật.
- Cost-benefit định tính, không có "con số bịa".
- Assumption không ẩn trong prose.
- Không có detail thuộc URD/PRD/SRS/project plan/business case.

## References

- @../../rules/feature-bootstrap.md
- @../../rules/ba-conventions.md
- @../../rules/project-profile.md
- @../../rules/approval-gate.md
- @../../rules/kg-usage.md
- @../../rules/naming-conventions.md
- @../../rules/changelog.md
- @../../rules/resolve-oqs.md
- @../../rules/review-format.md
- @../../agents/senior-ba.md
- @../../agents/po-reviewer.md
- @../../agents/pm-reviewer.md
- @../../../_templates/brd.md
- @./references/example-brd.md‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
