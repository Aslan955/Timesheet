---
name: prd
description: Dùng khi cần định nghĩa PRD cấp sản phẩm (toàn dự án) — tầm nhìn, người dùng, giá trị, rồi bóc tách thành danh sách feature. `/prd` hoặc `/prd <mô tả sản phẩm>`. Đây là PRD **toàn sản phẩm** (project-level); khác `/prd-epic` (đặc tả 1 feature/epic) và `/brainstorm` (đào sâu 1 feature).
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
disable-model-invocation: true
argument-hint: "<mô tả sản phẩm> | @<file> | (empty interactive)"
---
<!-- Licensed to nguyennam162nvn@gmail.com — Order ZQ6DTFZBW -->

# /prd — Product Requirements Document (project-level: tầm nhìn + Feature Map)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Goal‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đưa 1 idea sản phẩm mơ hồ → __PRD cấp sản phẩm__ (toàn dự án) + __danh sách tính năng__ bóc tách đúng altitude. Output `docs/_product/prd.md` theo `_templates/prd-product.md`: one-line pitch, problem & why-now, target users (JTBD), value proposition + differentiator, goals/non-goals, capability themes, __luồng người dùng tổng quan__ (hành trình end-to-end general qua sản phẩm, đầu Mục 7), __Feature Map__ (bảng tính năng = nguồn cho `/roadmap` + `/brainstorm`), success metrics + North Star, constraints, risks, open questions.

Đây là level __TRÊN__ `/brainstorm`. `/prd` ra danh sách tính năng + luồng tổng quan từng cái; `/brainstorm <slug>` mới đào sâu chi tiết 1 tính năng. Document của skill này là __project-level PRD__, KHÔNG per-feature.

> **Phân biệt với `/prd-epic`:** `/prd` (skill này) = PRD __toàn sản phẩm__, output `docs/_product/prd.md`, bóc tách nhiều feature. `/prd-epic <feature>` = đặc tả __1 feature/epic__, output `docs/{feature}/{feature}-prd.md`, list capabilities P0/P1/P2 trong feature đó. Hai tầng khác nhau, đừng nhầm.

## Constraints‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Hard rules — never violate‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- __Project-level output__ — `docs/_product/prd.md` (1 file singleton cho cả dự án). KHÔNG per-feature path.
- __Approval L1__ trước Write (prose preview BA-friendly per ba-conventions Mục 5).
- __L2 diff__ khi file đã tồn tại — update mode tự động, không cần flag.
- __Interview hỏi từng nhóm một__ — 6 nhóm (Vision / Users / Value / Features / Scope / Metrics), KHÔNG dồn batch. Wait reply giữa các nhóm. User `skip` nhóm → TBD + open question.
- __No-re-ask rule__ — scan idea seed + previous answers + existing brief (update mode) trước mỗi nhóm, loại câu đã có answer. Per @../../rules/ba-conventions.md Mục 2.
- __Thông tin cấp dự án đọc + ghi vào profile__ — domain sản phẩm, thuật ngữ gọi người dùng cuối, đối thủ, compliance: đọc `docs/_shared/project-profile.md` TRƯỚC khi hỏi (nhóm Users/Scope hay trùng); thiếu thì hỏi rồi đề xuất ghi vào profile để skill sau khỏi hỏi lại. Per @../../rules/project-profile.md.
- __IT-BA framing__ — business language only. CẤM hỏi DB schema / endpoint / SDK / framework. ĐƯỢC hỏi tên dịch vụ + mục đích nghiệp vụ. Per ba-conventions Mục 3.
- __Feature altitude gate (CRITICAL)__ — mỗi feature trong Feature Map PHẢI:
  - Là __verb + object, 1 capability__ ("Lưu phương thức thanh toán", KHÔNG "Thanh toán" — quá to; KHÔNG "Validate CVV" — quá nhỏ, đó là AC/story).
  - __Độc lập deliverable & demo được__.
  - __Map 1 user goal / 1 job__ (test JTBD).
  - __Bóc được 3-15 user story__ — ít hơn ~3 → là story; nhiều hơn ~15-20 → là epic, phải tách.
  - __"One-brainstorm-sized"__ — nếu `/brainstorm` chạy nó ra được 1 bộ flow + screen mạch lạc thì OK. Cần nhiều flow rời rạc không liên quan → tách.
  - Skill tự chấm từng feature theo gate này TRƯỚC khi đưa vào bảng; cái quá to → đề xuất tách, quá nhỏ → đề xuất gộp; trình bày cho user confirm.
- __Feature Map = user kể + AI đề xuất chênh lệch__ — sau Nhóm 4, skill PHẢI đối chiếu danh sách user kể với feature ứng viên tự suy ra từ Nhóm 1-3 (JTBD/problem/bối cảnh); JTBD chưa được phủ → đề xuất thêm (user duyệt từng cái) hoặc ghi non-goal/OQ, KHÔNG để rơi im lặng. User không kể được tính năng → dùng danh sách suy luận làm điểm khởi đầu, không bế tắc.
- __Luồng người dùng tổng quan (đầu Mục 7)__ — hành trình end-to-end GENERAL (5-8 bước, mỗi bước gắn feature) để đọc 30 giây hiểu sản phẩm hỗ trợ user gì. Không nhánh error/màn hình chi tiết — việc của `/user-flow` per-feature.
- __Slug per feature__ — kebab-case ASCII, max 30 chars, sẽ thành `docs/{slug}/` folder khi brainstorm. Per naming-conventions.
- __Cột "Chi tiết hóa"__ — khi tạo mới mọi feature mặc định `⬜ chưa`. Skill tự dò `docs/{slug}/brainstorms/*.md` đã tồn tại → set `🔄`/`✅` cho đúng hiện trạng. Muốn chỉnh tay 1 feature, chỉ cần __nói bằng lời__ (vd "đánh dấu payment đã chi tiết", "payment giờ đang làm dở", "authentication xong rồi") — skill tự hiểu ý định, parse ra slug + status rồi cập nhật (KHÔNG cần cú pháp flag).
- __Feature Map 2 tầng: bảng index + mini-brief__ — bảng chỉ giữ cột planning (`# / Tính năng / Slug / Theme / Persona / MoSCoW / Phụ thuộc / Chi tiết hóa`). Dưới bảng, MỖI feature 1 sub-section `### 7.{n} {tên} — {slug}` (mini-brief 10-15 dòng): __mô tả 3-5 câu__ (gộp what + why + outcome thành đoạn prose), __Phục vụ job__ (feature này phủ JTBD/outcome nào ở Mục 3 — trace nhu cầu; feature hạ tầng như tài khoản thì ghi "feature nền" + hỗ trợ ai), __Phạm vi v1__ (làm gì) + __Chưa làm__ (để sau / non-goal riêng của feature), __Luồng chính__ 3-6 bước đánh số, __Rủi ro chính__ (1 rủi ro nghiệp vụ riêng, khác Mục 10 cấp sản phẩm) + __Đo thành công__ (1 chỉ số feature-level, khác North Star), __OQ riêng__ (ref `OQ-n` ở Mục 11 — chỉ ghi nếu có, không bịa). `/roadmap` đọc Phụ thuộc từ bảng + Rủi ro/Đo thành công từ mini-brief. Thiếu thông tin → `TBD [NEEDS CLARIFICATION: <gợi ý cần hỏi gì>]` + OQ, KHÔNG "TBD" trơn, KHÔNG để trống im lặng.
- __Mini-brief KHÔNG lấn tầng dưới__ — không capability P0/P1/P2 (việc của `/prd-epic`), không flow chi tiết màn hình/error path (việc của `/brainstorm` + `/user-flow`), không FR/AC. Mức chi tiết chuẩn: stakeholder đọc xong hiểu feature là gì, ranh giới v1 ở đâu, chạy thế nào ở mức 3-6 bước.
- __Doc sạch, không meta-text__ — doc sinh ra KHÔNG chứa text hướng dẫn cho người viết: blockquote giải thích section là gì, khối "Cách điền", công thức pitch, chú thích 3 mức Evidence, legend cột Chi tiết hóa... Mọi hướng dẫn đó sống ở SKILL.md này; template chỉ có cấu trúc + placeholder; doc chỉ có nội dung nghiệp vụ thật.
- __Vietnamese-first__ default, auto-detect từ seed. Muốn tiếng Anh thì nói "viết bằng tiếng Anh". Frontmatter tối giản (type/status/updated/links).
- __File đã tồn tại__ → tự động chuyển sang update mode (L2 diff), không refuse.
- __Backward-compat với brief cũ (schema bảng-rộng, mọi thông tin nằm trong row)__ — KHÔNG tự migrate toàn bộ Feature Map cũ sang 2 tầng. Chỉ áp schema mới (bảng index gọn + mini-brief) khi: (a) tạo brief mới hoàn toàn, hoặc (b) user thêm feature mới vào brief cũ (feature mới có row gọn + mini-brief riêng, row cũ giữ nguyên). User muốn chuyển toàn bộ brief cũ sang 2 tầng thì nói rõ ("chuyển Feature Map sang mini-brief") — lúc đó bóc từng row thành mini-brief qua L2 diff, thông tin thiếu (phạm vi v1, luồng chi tiết) hỏi bổ sung, không bịa.
- __Phase E — resolve OQs__ sau Write per @../../rules/resolve-oqs.md (brief là gốc cấp sản phẩm — own OQs only, không inherit upstream).

### Pitfalls — easy to get wrong‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- **Folder `docs/_product/` chưa tồn tại** lần đầu — tạo khi Write, không cần hỏi (project-level, underscore prefix giống `_shared`/`_research`).
- __Feature user kể quá to__ (vd "thanh toán") — KHÔNG nhét nguyên vào bảng. Tách ("chọn phương thức", "lưu thẻ", "xử lý hoàn tiền") + giải thích lý do tách cho user. Đây là __cảnh báo + đề xuất tách, chờ xác nhận__ — KHÔNG tự động biến đổi cấu trúc mà không hỏi; user vẫn có thể giữ nguyên nếu khăng khăng (ghi rõ risk to trong report).
- __Feature quá nhỏ__ (vd "nút đăng xuất") — gộp vào feature lớn hơn (authentication) hoặc note là AC, không phải feature.
- __Theme ≠ feature__ — đừng cho theme vào Feature Map như 1 row. Theme gom ở Mục 6.
- __Slug collision với folder đã có__ — nếu `docs/{slug}/` tồn tại, reuse slug đó + set cột chi tiết hóa theo brainstorm thực tế.
- __User chỉ muốn cấu trúc hóa nhanh__ — vẫn hỏi đủ 6 nhóm nhưng chấp nhận nhiều TBD; đánh dấu rõ trong report.
- __KHÔNG tự chạy /roadmap hay /brainstorm__ — chỉ recommend. User chủ động chạy.
- __Phase F auto-review chạy MẶC ĐỊNH__ (như `/prd-epic`, `/brd`) — spawn 3 agent, tự fix safe + tự quyết business decision hợp lý (đánh 🔶). User chỉ review output cuối; nói "khỏi review" mới skip. KHÔNG hỏi "có muốn review không" trước khi chạy.
- __Ranh giới /prd ↔ /brd (đứng đúng vai IT-BA/PO):__ `/prd` product-level giữ value proposition ĐỊNH TÍNH (Mục 4) + success metric business-outcome (Mục 8) + risk register (Mục 10, cùng khuôn Tầm quan trọng/Khả năng/Hậu quả/Cách phòng với BRD). KHÔNG làm cost-benefit / rough ROI / cost driver — đó là việc `/brd` (cost-benefit định tính). KHÔNG làm NPV/DCF/investment gate — đó là business case riêng (sponsor/finance). User khai giá trị kinh doanh chi tiết khi chạy `/prd` → ghi nhận ở value proposition mức định tính, gợi ý "phần cost-benefit đầy đủ để `/brd` làm", KHÔNG nhét phân tích tài chính vào PRD sản phẩm.
- __@author__ (cho activity log) resolve qua memory `user-identity`, đừng để TBD. KHÔNG có field owner trong frontmatter.
- __Hook stale-propagation__ không áp cho `_product/` (underscore filtered như `_shared`) — không lo cascade nhầm.
- __Update mode với brief cũ schema bảng-rộng__ — KHÔNG tự bóc row cũ thành mini-brief. Feature mới thêm vào lần chạy này dùng schema 2 tầng; row cũ giữ nguyên cho tới khi user chủ động yêu cầu chuyển ("chuyển Feature Map sang mini-brief").
- __Update mode với brief cũ chưa có Luồng người dùng tổng quan__ — khác 3 cột (không đụng data cũ): journey chỉ là 1 sub-section thêm mới, KHÔNG sửa row nào. Skill ĐƯỢC đề xuất bổ sung journey trong lần update (draft từ Feature Map hiện có), trình qua L2 diff cho user duyệt — user `n` thì thôi.
- __Evidence không phải điểm số__ — chỉ 3 mức định tính (Giả định / Tín hiệu gián tiếp / Dữ liệu trực tiếp), KHÔNG bịa ra thang điểm phức tạp hơn. Phần lớn risk ở Mục 10 chỉ có "Giả định" ở giai đoạn đầu — bình thường, không phải lỗi.
- **`TBD [NEEDS CLARIFICATION: ...]` — gợi ý ngắn (≤1 câu), nêu đúng thứ cần hỏi**, vd `TBD [NEEDS CLARIFICATION: xác nhận feature nào phải xong trước khi build cái này]`, KHÔNG viết chung chung "TBD [NEEDS CLARIFICATION: cần làm rõ thêm]". Marker này chỉ dùng trong Feature Map (cột Phụ thuộc của bảng + các phần Rủi ro chính/Đo thành công/Phạm vi v1 của mini-brief) — các mục khác của brief vẫn dùng TBD + OQ như cũ (không đổi toàn bộ quy ước activity-log/OQ hiện có).
- __Constitution Check ≠ Quality checklist__ — Constitution Check (Phase C bước 6) chỉ verify FORMAT/NAMING bất biến (slug hợp lệ, author resolve, env note đúng format) và skill __tự sửa im lặng__ khi rõ ràng sai — KHÔNG hỏi user về việc này. Quality checklist (bước 7) verify NỘI DUNG nghiệp vụ (pitch đủ ý, feature altitude, metrics) và __fail thì hỏi thêm user__ — 2 bước khác mục đích, đừng gộp chung hoặc đảo ngược (đừng hỏi user "slug này có đúng kebab-case không", và đừng tự ý sửa "one-line pitch" của user mà không hỏi).
- __Đề xuất thêm ≠ bịa scope__ — feature suy luận (Nhóm 4 bước inference) chỉ được derive từ câu trả lời Nhóm 1-3 của chính user (job/problem/bối cảnh đã khai) hoặc là feature "ngầm bắt buộc" hiển nhiên (tài khoản, onboarding); KHÔNG bê checklist ngành vào hàng loạt. Mỗi đề xuất phải trace về 1 câu trả lời cụ thể; user bỏ thì ghi non-goal/OQ rồi thôi, không nài.
- __Luồng người dùng tổng quan phải GENERAL__ — 5-8 bước, mỗi bước 1 dòng, chỉ để người đọc PRD hiểu nhanh sản phẩm hỗ trợ user làm gì. KHÔNG vẽ nhánh error/edge, KHÔNG liệt kê màn hình — đó là việc của `/user-flow` per-feature sau này. Journey dài quá 8 bước → dấu hiệu đang tả chi tiết sai tầng, rút gọn lại.
- __Tầm quan trọng ≠ Hậu quả (đừng nhầm 2 cột Mục 10):__ "Tầm quan trọng" = giả định này có phải trụ cột của sản phẩm không (sai thì cả hướng đi lung lay). "Hậu quả" = tác động nghiệp vụ KHI rủi ro xảy ra. Vd giả định "khách chịu chờ < 4h" có tầm quan trọng Cao (là trụ cột value prop) — độc lập với hậu quả cụ thể khi khách bỏ đi. Dùng cặp Tầm-quan-trọng×Evidence để ưu tiên rủi ro nào cần chú ý trước, KHÔNG để thiết kế experiment.
- __Guardrail vs input — phân biệt khi CHỌN chỉ số (hướng dẫn nội bộ cho skill, KHÔNG viết vào PRD):__ input là đòn bẩy muốn tăng để đẩy North Star; guardrail là chỉ số không được để tệ đi khi tối ưu (North Star = tốc độ duyệt → guardrail = tỷ lệ duyệt sai). Cả hai giữ ở mức business outcome nghiệp vụ, KHÔNG phải chỉ số kỹ thuật/monitoring. Không có guardrail rõ → ghi "không có" + lý do, không bịa. Trong file PRD chỉ điền chỉ số + số thật vào bảng Mục 8; KHÔNG chèn định nghĩa/giải thích guardrail-input vào nhãn cột hay ô bảng (doc sạch per ba-conventions Mục 0).

## Inputs

```
/prd                                  # interactive: hỏi về sản phẩm
/prd <mô tả sản phẩm>                  # idea text inline
/prd @<file-path>                      # idea từ file (notes, pitch deck export)
```

Ví dụ:
```
/prd
/prd app học tiếng Anh cho người đi làm bận rộn, học 5 phút/ngày
/prd @notes/pitch-2026-06.md
đánh dấu payment đã chi tiết          # nói bằng lời → skill tự cập nhật cột Chi tiết hóa
authentication xong rồi              # tương tự, không cần flag
```

Muốn đổi hành vi mặc định, nói bằng lời trong câu lệnh hoặc câu trả lời tiếp theo:
- `prd.md` đã tồn tại → gọi lại `/prd`, skill tự vào update mode (L2 diff); nói rõ cần đổi gì.
- Viết bằng tiếng Anh → nói "viết bằng tiếng Anh".

## Context (dynamic)

Today: !`date +%Y-%m-%d`
Brief tồn tại: !`test -f docs/_product/prd.md && echo "YES (tự vào update mode)" || echo "chưa có"`
Feature folders đã có: !`ls -d docs/*/ 2>/dev/null | xargs -I{} basename {} | grep -v "^_" | grep -vE "blockers|changes|decisions|exports|impacts|inbox|meetings|guides|images|redoc|userguide" | tr '\n' ' '`

---

## Approach

### Cập nhật cột "Chi tiết hóa" theo lời nói (fast path, KHÔNG interview)

Khi user nói bằng lời ý muốn đổi trạng thái chi tiết hóa của 1 feature (vd "đánh dấu payment đã chi tiết", "payment giờ đang làm dở", "authentication xong rồi") — skill tự hiểu ý định, parse ra `<slug>` + `<status>` từ câu nói (KHÔNG cần cú pháp flag):
1. Read `docs/_product/prd.md`. Không có → báo "Chưa có PRD sản phẩm, chạy `/prd` trước."
2. Tìm row có slug khớp trong Mục 7 Feature Map. Không chắc slug nào (câu mơ hồ) → hỏi lại user chọn feature, KHÔNG đoán.
3. Map status: `chưa`→`⬜ chưa`, `đang`→`🔄 đang brainstorm`, `done`/`✅`→`✅ đã chi tiết (N brainstorm)` (N = đếm `docs/{slug}/brainstorms/*.md`).
4. __Xác nhận gộp (L1+L2 làm 1 — ngoại lệ có chủ đích cho fast-path 1 ô)__: vì chỉ đổi đúng 1 ô, plan và diff trùng nội dung → show 1 lần: "Em đổi cột Chi tiết hóa của `{slug}`: {giá trị cũ} → {giá trị mới}. Apply? (Y/n)". User Y → Edit; set env `CLAUDE_CHANGELOG_NOTE=mark {slug} chi tiết hóa = {status}` (+ `CLAUDE_SKILL_NAME`/`CLAUDE_CHANGELOG_AUTHOR`) trước Edit, hook ghi changelog.md. (Gộp L1+L2 chỉ áp cho fast-path 1-ô này; luồng tạo/update PRD đầy đủ vẫn L1 rồi L2 riêng.)

### Phase A — Resolve & Context (silent)

1. __Resolve idea source:__
   - No arg → hỏi "Anh muốn xây sản phẩm gì? Kể em nghe về tầm nhìn, sản phẩm làm gì, cho ai." Wait.
   - Arg `@path` → Read file.
   - Otherwise → arg as text.
2. __Detect mode:__ file tồn tại → tự động continuation/update mode (Read full trước khi phỏng vấn tiếp).
3. __Detect language__ từ seed.
4. __@author__ (cho activity log) resolve qua memory `user-identity` per ba-conventions Mục 1. KHÔNG đưa author vào frontmatter.
5. __Scan dự án hiện có__ — `ls docs/*/` để biết feature folder nào đã tồn tại (gắn vào Feature Map + set cột chi tiết hóa cho đúng).

### Phase B — Interview (6 nhóm, one-at-a-time)

> Mỗi nhóm: 1 message, 3-5 câu hỏi, wait reply. Push for specifics. `skip` → TBD + OQ.
> Bộ câu hỏi rút từ Lean Canvas + Working-Backwards (Amazon PR/FAQ) + JTBD + North Star.

__Nhóm 1 — Vision & Problem__
1. Sản phẩm này là gì, tóm 1 câu (giúp ai làm được gì)?
2. Vấn đề cốt lõi đang giải? Ai bị đau nhất?
3. Hôm nay họ giải quyết vấn đề đó bằng cách nào (giải pháp thay thế)?
4. Why now — vì sao làm lúc này (signal thị trường, request, cơ hội)?

__Nhóm 2 — Users & Market__
1. Nhóm người dùng chính là ai? Nhóm phụ? Ai KHÔNG phải người dùng?
2. Họ đang cố hoàn thành "job" gì (kết quả họ muốn, không phải tính năng)?
3. Bối cảnh dùng (lúc nào, ở đâu, áp lực gì — vd trên đường, tranh thủ giờ nghỉ)?

__Nhóm 3 — Value & Differentiator__
1. Giá trị cốt lõi 1 câu là gì?
2. Vì sao người dùng chọn mình thay vì giải pháp đang dùng?
3. Lợi thế khác biệt (cái đối thủ khó sao chép)?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Nhóm 4 — Features (elicitation + decomposition + inference)__

> __Checkpoint trước khi bóc feature (tầng elicitation, KHÔNG ghi vào doc):__ rà nhanh câu trả lời Nhóm 1-3 — đã rõ (a) khách hàng cụ thể là ai, (b) vấn đề cốt lõi họ đau, (c) job họ muốn đạt chưa? Còn mơ hồ (vd "cho mọi người", "giúp làm việc tốt hơn") → quay lại hỏi làm rõ Nhóm 1-2 TRƯỚC, đừng bóc feature từ vấn đề mờ (feature sẽ bịa). Đã rõ → tiếp câu 1.

1. Kể các tính năng anh hình dung sản phẩm sẽ làm (cứ liệt kê thoải mái — chưa hình dung hết cũng không sao, em sẽ đề xuất thêm dựa trên phần anh đã kể ở các nhóm trước)?
2. Tính năng nào là cốt lõi cho v1, cái nào để sau?
3. Nếu bỏ 1 tính năng đi thì giá trị sản phẩm sụp — đó là cái nào?
4. Feature nào phải xong trước feature nào khác (phụ thuộc), hoặc bắt buộc cần hệ thống/dịch vụ ngoài nào?
5. Với mỗi feature: rủi ro nghiệp vụ lớn nhất là gì, và làm sao đo được nó đạt kết quả mong đợi (1 chỉ số cụ thể)?

> Sau nhóm 4: skill làm 3 việc TRƯỚC khi trình bảng nháp Feature Map:
> 1. __Bóc tách__ danh sách user kể → áp __feature altitude gate__. Cái quá to → đề xuất tách thành nhiều feature; quá nhỏ → gộp. Gom theo capability theme.
> 2. __Suy luận bổ sung (inference)__ — tự derive danh sách feature ứng viên từ câu trả lời Nhóm 1-3 (problem, JTBD từng persona, giải pháp thay thế, differentiator, bối cảnh dùng) + các feature "ngầm bắt buộc" mà bối cảnh chỉ ra (vd tài khoản/đăng nhập, onboarding, thông báo nhắc). Đối chiếu với danh sách user kể → phần __chênh lệch__ trình thành mục "Em đề xuất thêm" trong bảng nháp, mỗi cái kèm lý do 1 dòng trace về câu trả lời cụ thể (vd "job {X} của {persona} chưa có feature nào phủ"). User quyết nhận/bỏ từng cái; cái bị bỏ mà là JTBD chưa phủ → ghi vào non-goals hoặc OQ, KHÔNG lặng lẽ quên.
> 3. __User không kể được tính năng__ ("chưa nghĩ ra, em đề xuất đi") — KHÔNG bế tắc: dùng danh sách suy luận ở bước 2 làm bảng khởi đầu, đánh dấu rõ mọi row là đề xuất của AI để user duyệt từng cái.
>
> Trình bày bảng nháp Feature Map (gồm cả mục "Em đề xuất thêm") __kèm bản nháp Luồng người dùng tổng quan__ (5-8 bước general, mỗi bước gắn feature liên quan — giúp user thấy nhanh sản phẩm hỗ trợ gì và các feature nối nhau thế nào) cho user confirm/chỉnh — L3-style iterate nhẹ trên bảng, max 2 vòng; phần đề xuất + luồng tổng quan nằm TRONG vòng iterate này, KHÔNG thêm vòng riêng. Câu 4-5 điền Phụ thuộc (bảng) + Rủi ro chính/Đo thành công (mini-brief) — hỏi gọn theo dạng liệt kê nhanh cho từng feature đã chốt (kể cả feature vừa nhận từ đề xuất), KHÔNG tách thành nhóm phỏng vấn riêng. Cùng lượt liệt kê nhanh đó, hỏi thêm __phạm vi v1__ mỗi feature: "cái gì làm ngay trong v1, cái gì để sau?" → điền Phạm vi v1 / Chưa làm của mini-brief. Feature nào user không trả lời → TBD + OQ, không ép.

__Nhóm 5 — Scope & Constraints__
1. Cái gì rõ ràng NẰM NGOÀI phạm vi (non-goals)?
2. Ràng buộc về ngân sách / timeline / team?
3. Ràng buộc tích hợp (tên hệ thống/dịch vụ ngoài) hoặc pháp lý/vùng/compliance?
4. Rủi ro/giả định cấp sản phẩm (không riêng feature nào) — với mỗi cái cho em biết đủ 5 phần: (a) __tầm quan trọng__ — nếu giả định này SAI thì ảnh hưởng tới thành công sản phẩm tới mức nào (cao / vừa / thấp); (b) __căn cứ__ điều này đúng — chỉ là giả định (chưa kiểm chứng), có tín hiệu gián tiếp (feedback rời rạc, đối thủ đã làm), hay đã có dữ liệu trực tiếp (interview/test/usage data); (c) __khả năng__ xảy ra (thường / thỉnh thoảng / hiếm); (d) __hậu quả nghiệp vụ__ nếu xảy ra; (e) __cách phòng__ ở mức nghiệp vụ-vận hành. Phần nào chưa rõ → em ghi TBD + OQ, không đoán bừa.

__Nhóm 6 — Success Metrics__
1. Sau 3 / 6 / 12 tháng, thành công trông như thế nào?
2. Một chỉ số duy nhất cho biết sản phẩm đang đi đúng (North Star) là gì? Với chỉ số đó: __hiện tại đang ở mức nào__ (baseline), __muốn đạt mức nào__ (target), __tới khi nào__ (mốc)? Chưa có số thật → em ghi TBD + OQ.
3. Những đòn bẩy (input) nào tác động chỉ số đó (3-5 cái)? Mỗi cái baseline/target/mốc nếu có.
4. Có chỉ số nào __không được để tệ đi__ khi mình tối ưu North Star không (guardrail — vd tối ưu tốc độ duyệt thì tỷ lệ duyệt sai không được tăng)?

### Phase C — Synthesize + Constitution Check + Quality Gate

1. Synthesize answers → fill `_templates/prd-product.md` (11 mục).
2. __Feature Map (Mục 7) — 2 tầng__: (a) bảng index `# / Tính năng / Slug / Theme / Persona / MoSCoW / Phụ thuộc / Chi tiết hóa` (`⬜`/`🔄`/`✅` theo hiện trạng `docs/{slug}/`); (b) mini-brief `### 7.{n}` per feature: mô tả 3-5 câu (what/why/outcome), Phục vụ job (trace JTBD Mục 3), Phạm vi v1 / Chưa làm, Luồng chính 3-6 bước, Rủi ro chính + Đo thành công, OQ riêng (nếu có).
3. __Luồng người dùng tổng quan (sub-section đầu Mục 7)__ — synthesize từ Nhóm 2 (JTBD, bối cảnh dùng) + Feature Map đã chốt ở vòng iterate: 5-8 bước general end-to-end, mỗi bước 1 dòng + gắn feature liên quan (slug). Mọi feature Must/Should xuất hiện ở ≥1 bước, hoặc ghi chú ngắn vì sao đứng ngoài hành trình chính (vd back-office/admin). Nhiều persona khác hẳn nhau → mỗi persona 1 danh sách ngắn riêng.
4. __Success Metrics (Mục 8)__ — bảng North Star / Input (3-5) / Guardrail, mỗi hàng có baseline + target + mốc thời gian (từ Nhóm 6 câu 2-4). Metric là __business outcome đo được__ (cùng khuôn success measure của BRD), KHÔNG có cột "nguồn đo" kỹ thuật. Thiếu baseline thật → `TBD [NEEDS CLARIFICATION: baseline lấy từ đâu]` + OQ, không bịa số.
5. __Risks & Assumptions (Mục 10)__ — mỗi row có đủ __Tầm quan trọng__ + __Evidence__ (Giả định / Tín hiệu gián tiếp / Dữ liệu trực tiếp) + __Khả năng__ + __Hậu quả nghiệp vụ__ + __Cách phòng__ (nghiệp vụ-vận hành, không mitigation kỹ thuật) lấy từ Nhóm 5 câu 4. Cùng khuôn risk register của BRD. __Cặp Tầm-quan-trọng=Cao + Evidence=Giả định__ là rủi ro cần nêu bật — flag ở final report để user cân nhắc validate trước khi cam kết (dùng importance×evidence để ưu tiên, KHÔNG thiết kế thí nghiệm — đó là PM lean-startup, không phải việc `/prd`).
6. __Constitution Check__ (tự verify format, KHÔNG hỏi user — chỉ tự sửa hoặc tự flag trước khi qua bước 7):
   - [ ] Mọi slug feature: kebab-case, ASCII only, ≤30 chars, không trùng nhau trong bảng (per naming-conventions.md). Vi phạm → skill tự sửa lại slug rồi note trong L1, KHÔNG hỏi lại user chi tiết kỹ thuật này.
   - [ ] Slug trùng `docs/{slug}/` đã tồn tại nhưng nội dung feature khác hẳn folder cũ → flag warning "trùng tên nhưng khác nghiệp vụ, đổi slug?" (khác case reuse hợp lệ ở Pitfalls).
   - [ ] @author (cho activity log) đã resolve từ memory `user-identity` (per ba-conventions Mục 1). Frontmatter KHÔNG chứa owner/created/changelog (đã diet 2026-07-12).
   - [ ] Không câu hỏi nào trong 6 nhóm interview vi phạm IT-BA framing (tự rà lại nếu synthesize có lỡ diễn giải sang ngôn ngữ kỹ thuật — DB/API/SDK — thì viết lại bằng business language trước khi ghi).
   - [ ] Đã set đủ env `CLAUDE_SKILL_NAME` + `CLAUDE_CHANGELOG_AUTHOR` + `CLAUDE_CHANGELOG_NOTE` (≤80 ký tự) trước Write — hook ghi changelog.md (per changelog.md).
   - Vi phạm format (không phải nội dung nghiệp vụ) → skill tự sửa im lặng nếu rõ ràng (vd slug sai kebab-case), chỉ hỏi user nếu ambiguous (vd slug trùng nhưng không chắc có phải cùng feature không).
7. __Quality checklist__ trước L1:
   - [ ] One-line pitch theo đúng công thức (sản phẩm + user + outcome + cách).
   - [ ] Problem có "ai đau" + "why now" cụ thể.
   - [ ] ≥1 persona với JTBD rõ.
   - [ ] Goals VÀ non-goals đều có (non-goals chống scope creep).
   - [ ] Mọi feature pass altitude gate (verb+object, demo được, 3-15 story).
   - [ ] __Coverage JTBD ↔ Feature Map__: mỗi job/persona ở Mục 3 có ≥1 feature phủ, hoặc được ghi rõ ở non-goals/OQ — không job nào rơi im lặng.
   - [ ] __Luồng người dùng tổng quan__: 5-8 bước general, mỗi bước gắn feature; mọi feature Must/Should xuất hiện ≥1 bước hoặc có ghi chú vì sao ngoài hành trình chính.
   - [ ] Mỗi feature có mini-brief đủ 6 phần: mô tả what/why/outcome + Phục vụ job (trace JTBD Mục 3) + Phạm vi v1/Chưa làm + Luồng chính 3-6 bước + Rủi ro chính + Đo thành công (`TBD [NEEDS CLARIFICATION: ...]` chấp nhận được, "TBD" trơn hoặc trống im lặng thì không).
   - [ ] __Trace JTBD ↔ Feature Map 2 chiều__: mỗi mini-brief có "Phục vụ job" trỏ về Mục 3 (hoặc ghi rõ "feature nền"); mỗi job/persona ở Mục 3 được ≥1 feature nhận phủ (khớp coverage check bên dưới).
   - [ ] Mini-brief KHÔNG chứa capability P0/P1/P2, FR/AC, hay flow màn hình chi tiết (đúng altitude — việc của `/prd-epic`/`/brainstorm`).
   - [ ] North Star + 3-5 input metric, mỗi metric có baseline (hoặc `TBD [NEEDS CLARIFICATION]`) + target + mốc thời gian. Metric là business outcome, không phải chỉ số kỹ thuật.
   - [ ] Có ≥1 guardrail metric (chỉ số không được để tệ đi khi tối ưu North Star), hoặc ghi rõ "không có guardrail cần thiết" + lý do.
   - [ ] Mọi risk/assumption ở Mục 10 có đủ Tầm quan trọng + Evidence + Khả năng + Hậu quả nghiệp vụ + Cách phòng (không cột nào để trống; thiếu thật → `TBD [NEEDS CLARIFICATION: ...]` + OQ, không bịa để lấp bảng).
   - [ ] Open questions có ID OQ-N.
   - Fail → in gap + đề xuất hỏi thêm trước proceed.

### Phase D — Approval + Write

1. __L1 plan preview__ (prose BA-friendly per ba-conventions Mục 5):
   > Em sẽ {tạo mới | cập nhật} `docs/_product/prd.md` với:
   > - Tầm nhìn: "{pitch}"
   > - {N} nhóm người dùng, vấn đề cốt lõi: {...}
   > - __{K} tính năng__ bóc tách: {liệt kê tên + ưu tiên ngắn + phụ thuộc chính nếu có} (trong đó {J} do em đề xuất thêm, anh đã duyệt)
   > - Luồng tổng quan: {chuỗi bước chính 1 dòng, vd "đăng ký → chọn mục tiêu → học bài 5' → nhận nhắc → xem tiến độ"}
   > - North Star: {metric}
   > - Câu hỏi mở: {M} câu để dành cho `/roadmap` hoặc `/brainstorm`.
   > - Ghi nhận activity log: "{note}".
   >
   > Apply? (Y / sửa)
2. __Write__ với frontmatter v2. Tạo folder `docs/_product/` nếu chưa có.
3. __Set env trước Write__ (hook ghi changelog.md): `CLAUDE_SKILL_NAME=/prd`, `CLAUDE_CHANGELOG_AUTHOR={@author}`, `CLAUDE_CHANGELOG_NOTE` = mô tả ≤80 ký tự, vd `initial product PRD, {K} features bóc tách, North Star {metric}`. Hook tự ghép `{date} | {skill} | {@author} | {file-path} | {note}` — skill KHÔNG tự viết cả dòng.

### Phase E — Resolve OQs

Per @../../rules/resolve-oqs.md. Brief là gốc cấp sản phẩm → chỉ own OQs (Mục 11), không inherit. Prompt Y/skip/ids → loop 1-by-1 → cascade scan trong brief → L2 diff → activity log (hook).

### Phase F — Auto-review + auto-fix (chạy mặc định, KHÔNG hỏi trước)

Sau Phase E, TỰ ĐỘNG spawn agents song song (`@senior-ba`, `@po-reviewer`, `@pm-reviewer`) với target `docs/_product/prd.md` + rules liên quan, aggregate findings per @../../rules/review-format.md (dedupe, escalation 2+ agents WARNING→BLOCKING). Ngoài review-format chung, soi các chiều đặc thù __product-PRD__ (rút từ rubric BMAD PRD):

- __Unified arc vs wish list__ — feature set có chung 1 mạch giá trị sản phẩm không, hay là danh sách tính năng rời rạc ai đó muốn? Feature lạc mạch → flag.
- __Coverage JTBD ↔ Feature Map__ — mỗi job/persona ở Mục 3 có ≥1 feature "Phục vụ job" phủ (hoặc ghi rõ non-goal/OQ); feature nào không trace về job nào → flag.
- __Journey ↔ feature__ — mỗi bước Luồng tổng quan gắn feature; feature Must/Should đứng ngoài journey mà không có lý do (vd back-office) → flag.
- __Metric validate thesis__ — North Star đo đúng giá trị cốt lõi, không phải chỉ đếm activity; mỗi metric có baseline/target/mốc; có ≥1 guardrail.
- __Risk register đủ__ — mỗi risk có đủ Tầm quan trọng/Evidence/Khả năng/Hậu quả/Cách phòng; cặp Cao+Giả định đã được nêu bật.
- __Feature altitude__ — không feature quá to (>15 story, nên tách) hoặc quá nhỏ (là AC/story, nên gộp).

Phân loại findings 2 nhóm rồi xử lý (per @../../rules/review-format.md + feedback auto-run): __(a) safe fix__ — editorial, consistency nội bộ, bổ sung từ facts user đã chốt ở interview → TỰ APPLY hết, không hỏi; __(b) business decision__ — đổi con số/quyết định user đã chốt, thêm/bớt feature, đổi ưu tiên → TỰ CHỌN phương án hợp lý nhất (ưu tiên nhất quán với facts đã chốt + ít rủi ro nghiệp vụ nhất) và apply luôn, KHÔNG dừng hỏi giữa chừng; đánh dấu từng quyết định này trong final report mục "🔶 Quyết định thay user — review lại". Set env note trước fixes (hook ghi changelog.md): `reviewed by @{agents}: {N} auto-fixed ({M} auto-decided}`. User nói "khỏi review" trong câu lệnh → skip phase này.

### Phase G — Final report

```
✅ PRD sản phẩm: docs/_product/prd.md
   Tính năng bóc tách: {K} ({P0_count} Must, ...)
   Đã có folder: {list features đã ✅/🔄} · Chưa brainstorm: {list ⬜}
   Review: {N} auto-fixed{, M quyết định thay user (🔶 bên dưới)}

{nếu có 🔶:}
🔶 Quyết định thay user — review lại:
  - {mô tả quyết định + lý do chọn phương án đó}

Recommended next:
  - /roadmap                    — xếp thứ tự + phân đợt Now/Next/Later
  - /brainstorm <slug>          — đào sâu 1 tính năng (tự mark ✅ ngược lên brief)
```

## Output

`docs/_product/prd.md` — PRD cấp sản phẩm (project-level singleton, `type: prd-product`). KHÔNG prefix feature.

Gồm Vision + Feature Map (mỗi feature 1 row, có cột "Chi tiết hóa" ⬜/🔄/✅). Folder `docs/_product/` tạo khi Write nếu chưa có.

Hook KHÔNG áp stale-propagation cho `_product/` (underscore filtered như `_shared`).

## References

- @../../rules/ba-conventions.md
- @../../rules/project-profile.md
- @../../rules/approval-gate.md
- @../../rules/naming-conventions.md
- @../../rules/changelog.md
- @../../rules/resolve-oqs.md
- @../../rules/review-format.md
- @../../agents/senior-ba.md
- @../../agents/po-reviewer.md
- @../../agents/pm-reviewer.md
- @../../../_templates/prd-product.md‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
