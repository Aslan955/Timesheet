---
name: api-doc
description: Dùng khi cần đọc hiểu + tóm tắt tài liệu API của đối tác (OpenAPI, PDF, URL) thành doc nghiệp vụ dễ hiểu cho BA/QC.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, WebFetch
user-invocable: true
argument-hint: "<source-path|url> [--feature <slug>]"
---
<!-- Licensed to nguyennam162nvn@gmail.com — Order ZQ6DTFZBW -->

# /api-doc — Đọc hiểu & Tóm tắt Tài liệu API‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Goal‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Từ 1 tài liệu API đối tác (file OpenAPI/Swagger `.yaml`/`.json`, PDF, URL trang doc, hoặc markdown), sinh 1 doc tóm tắt __nghiệp vụ__ giúp IT-BA/QC hiểu nhanh "API này cho làm gì, cần gì, trả gì, lỗi nào, ràng buộc gì". __Output duy nhất__: `docs/{feature}/integration/api-summary.md`.

Đây là khâu __hiểu contract__ trong pipeline tích hợp: `/api-assess` (đk) → **`/api-doc`** → `/api-design` (blueprint) → `/api-map` → `/api-checklist` → `/api-test` → `/api-readiness`. Full pipeline + ranh giới: `.claude/rules/api-integration.md`. Họ hàng với `/reverse-doc` (đều ingest tài liệu ngoài → transform vào vault), nhưng phân loại theo *cấu trúc API* thay vì gom theo feature nghiệp vụ.

## Constraints‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Hard rules — never violate‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* __1 output cố định__ — `docs/{feature}/integration/api-summary.md`. File đã tồn tại → tự động chuyển sang update mode (L2 diff), không refuse.
* __IT-BA/QC framing — KHÔNG dump kỹ thuật trần.__ Tóm tắt theo *thao tác nghiệp vụ* ("tạo thanh toán", "tra trạng thái"), KHÔNG liệt kê route/schema/payload thô như tài liệu dev. Auth mô tả *ý nghĩa nghiệp vụ* ("cần đăng ký tài khoản đối tác lấy khóa"), không bàn cơ chế token.
* __Error catalog bắt buộc__ — gom mọi mã lỗi đối tác + ý nghĩa nghiệp vụ. Đây là nguồn cho Error Matrix SRS (`E-{feature}-NNN`).
* __Đối chiếu brainstorm bắt buộc__ — luôn quét `docs/*/brainstorms/*.md` toàn dự án, match nghiệp vụ với API, gap-analysis 2 chiều. __KHÔNG silent pick__ brainstorm — show picker user confirm. Không match nào → ghi callout GAP "chưa có brainstorm phù hợp", KHÔNG bỏ qua âm thầm.
* __L1 approval__ trước Write. __L2 diff__ khi file đã tồn tại (update mode tự động).
* __Phase E auto-verify__ — sau Write, Read lại file, check đủ 7 mục + không còn placeholder.
* __Vietnamese-first__.
* __KHÔNG gọi API__ — chỉ đọc tài liệu (read-only). Test là việc của `/api-test`.

### Pitfalls — easy to get wrong‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* __Source là code dev (SDK README)__ — vẫn tóm tắt được, nhưng warn "tài liệu thiên kỹ thuật, em tóm phần nghiệp vụ; phần SDK/code bỏ qua".
* __OpenAPI lớn (>30 endpoint)__ — hỏi user chỉ tóm nhóm endpoint nào liên quan feature, tránh doc phình.
* __Không có error code rõ trong tài liệu__ — ghi "tài liệu chưa nêu lỗi" vào Mục 4 + thêm OQ Mục 6 (để `/api-test` phát hiện thực tế).
* __URL cần auth để xem__ — WebFetch fail → ask user paste nội dung doc.
* __Đừng bịa endpoint__ — chỉ tóm cái có trong source.
* __Match brainstorm là fuzzy, không exact__ — dựa domain keyword + capability, không bắt buộc cùng `--feature`. Khi nghi ngờ relevance thấp → vẫn đưa vào picker nhưng đánh dấu "(relevance thấp)", để user quyết, KHÔNG tự loại.
* __Không match ≠ skip âm thầm__ — luôn ghi 1 dòng gap ở Mục 6. Đây là tín hiệu nghiệp vụ: API đang tích hợp mà chưa có yêu cầu nào mô tả → rủi ro scope.
* __1 API có thể đối chiếu nhiều brainstorm__ — vd API thanh toán match cả brainstorm "mua gói" lẫn "hoàn tiền". Gộp gap chung 1 bảng Mục 6, ghi rõ gap thuộc brainstorm nào ở cột Ghi chú.
* __Đừng tự sửa brainstorm__ — `/api-doc` chỉ GHI NHẬN gap vào api-summary. Reconcile brainstorm là việc gọi lại `/brainstorm` (tự vào update mode) hoặc `/cr`. Gap nghiêm trọng → gợi ý ở Output report.

## Inputs

```
/api-doc <source-path>                           # file .yaml/.json/.pdf/.md local, feature auto-detect
/api-doc <url> --feature <slug>                  # URL trang doc (WebFetch)
```

Ví dụ:
* `/api-doc _teaching/buoi-6-integrate/mock-paygate/openapi.yaml --feature premium-payment`
* `/api-doc https://docs.partner.com/api --feature premium-payment`

`--feature` không bắt buộc — thiếu thì skill tự suy từ ngữ cảnh (feature đang làm dở, tên trong source); mơ hồ mới hỏi picker. `api-summary.md` đã tồn tại → tự động vào update mode, muốn sửa thì gọi lại skill và nói cần đổi gì.

## Context (dynamic)

Today: !`date +%Y-%m-%d`
Features có folder: !`for d in docs/*/; do [ -d "$d" ] && basename "$d"; done | grep -v '^_' | head -20`
Integration docs đã có: !`for d in docs/*/integration/api-summary.md; do [ -f "$d" ] && echo "$d"; done | head -10`
Brainstorms toàn dự án (để đối chiếu nghiệp vụ): !`for f in docs/*/brainstorms/*.md; do [ -f "$f" ] && echo "$f"; done | head -30`

## Approach

1) __Parse args__ — `source` (path hoặc URL) bắt buộc. `--feature` optional — auto-detect từ ngữ cảnh (feature đang làm dở, tên trong source); mơ hồ → prompt picker.
2) __Resolve feature folder__ `docs/{feature}/`. Không tồn tại → ask user confirm tạo (soft gate, vẫn proceed).
3) __Đọc source:__
   * `.yaml`/`.json` (OpenAPI/Swagger) → Read, parse paths + schemas + securitySchemes.
   * `.pdf` → Read (PDF mode).
   * URL → WebFetch.
   * `.md`/paste → Read.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
4) __Trích xuất theo lăng kính nghiệp vụ:__
   * Mỗi endpoint → 1 *thao tác nghiệp vụ* (verb-object: "tạo thanh toán", "tra trạng thái", "hoàn tiền").
   * Auth → loại + ý nghĩa nghiệp vụ + lưu ý vận hành (đăng ký tài khoản, khóa hết hạn...).
   * Mọi response code lỗi → gom vào __Error catalog__.
   * Rate limit / quota / ràng buộc → ghi nhận để feed NFR.
   * Rút ra __danh sách năng lực nghiệp vụ mà API cung cấp__ (vd "thu tiền 1 lần", "thuê bao định kỳ", "hoàn tiền", "tra cứu giao dịch") — đây là input cho bước đối chiếu brainstorm.
5) __Đối chiếu brainstorm + gap analysis__ (BẮT BUỘC — đừng skip):
   * __KG chọn nguồn trước (rẻ hơn scan):__ chạy `node .claude/skills/kg/engine/kg-query.mjs facts {feature}` (và `node .claude/skills/kg/engine/kg-query.mjs explore <ID|key>` nếu concept API đã có key) để lấy danh sách candidate/coverage, rồi VẪN Read đầy đủ prose file đã chọn. Tuân `.claude/rules/kg-usage.md` (3 nghĩa vụ: `--all` khi bị cap · đọc mục "Phải Read tay" · `KG-ERROR` → scan trực tiếp như cũ).
   * __Quét__ `docs/*/brainstorms/*.md` toàn dự án. Read mỗi file lấy: `feature`, Mục 1 Idea Seed, Mục 4 Capabilities (P0/P1/P2). KHÔNG chỉ quét folder `--feature`.
   * __Match theo nghiệp vụ__: so domain keyword của API (từ Mục 1 tóm tắt + danh sách năng lực bước 4) với Idea Seed + Capabilities + tags brainstorm. Rank candidate: brainstorm **cùng `--feature`** = relevance cao nhất, rồi cross-feature cùng domain keyword.
   * __Picker confirm__ (KHÔNG silent pick) — in candidate ranked:
     ```
     Tìm thấy {K} brainstorm có thể cùng nghiệp vụ với API {tên}:
       1. docs/premium-payment/brainstorms/buy-premium.md   (cùng feature — thu tiền, thuê bao)
       2. docs/authentication/brainstorms/email-and-google-auth.md   (cross-feature — verify email)
     Dùng brainstorm nào để đối chiếu gap? (all / 1,2 / none)
     ```
   * __Gap analysis 2 chiều__ trên brainstorm user chọn:
     * *Brainstorm cần → API thiếu*: capability brainstorm yêu cầu mà không có thao tác API tương ứng → ⚠️ gap "API thiếu".
     * *API có → brainstorm chưa lường*: thao tác API tồn tại mà brainstorm chưa nhắc → ➕ "cân nhắc bổ sung scope / hoặc dư".
     * *Ràng buộc lệch*: rate-limit/region/idempotency/khoản phí của API vs giả định brainstorm → ❓ "cần xác nhận" hoặc conflict.
   * __Không match nào__ (user chọn `none` hoặc K=0) → KHÔNG bỏ qua âm thầm: ghi callout GAP ở Mục 6 "⚠️ Chưa tìm thấy brainstorm cùng nghiệp vụ với API {tên} — cần `/brainstorm {feature}` xác nhận yêu cầu trước khi tích hợp, hoặc xác nhận đây là API kỹ thuật thuần."
   * Gap loại "API thiếu" + "cần xác nhận" → đẩy thành OQ ở Mục 7.
6) __L1 plan preview__ (prose BA-facing, không bảng tag) — path + sẽ tóm tắt N thao tác + M mã lỗi + auth gì + đối chiếu {K} brainstorm phát hiện {G} gap (hoặc "không có brainstorm phù hợp → ghi 1 gap"). Apply? (Y/sửa).
7) **Write `api-summary.md`** với frontmatter chuẩn (`type: api-summary`, `feature`, `status: draft`, `updated`, `links: [<source>, <brainstorm paths đã đối chiếu>]`). Body 7 mục:
   * __Mục 1 — Tổng quan__: API gì, đối tác nào, base URL, dùng cho thao tác nghiệp vụ gì. __Ghi rõ VERSION đối tác đang pin__ (header/URL version, vd `v1`, `2024-01`) — để sau này đối tác đổi/deprecate version mà không ai biết thì `/api-readiness` bắt được. Thiếu thông tin version → ghi OQ.
   * __Mục 2 — Xác thực__: loại auth + ý nghĩa nghiệp vụ + lưu ý vận hành.
   * __Mục 3 — Bảng thao tác__: | Thao tác | Method/Path | Input cần | Output trả về | Trigger khi nào |.
   * __Mục 4 — Error catalog__: | Mã lỗi | HTTP | Ý nghĩa nghiệp vụ | Màn hình/hành động đề xuất |.
   * __Mục 5 — Ràng buộc__ (rate-limit, quota, idempotency) → ghi chú "feed NFR".
   * __Mục 6 — Đối chiếu brainstorm & Gap tích hợp__:
     * Dòng đầu liệt kê brainstorm đã đối chiếu (paths) HOẶC callout GAP "chưa có brainstorm phù hợp".
     * Bảng gap: | Yêu cầu nghiệp vụ (brainstorm) | Năng lực API tương ứng | Trạng thái | Ghi chú / Gap |. Trạng thái dùng: ✅ API đáp ứng / ⚠️ API thiếu / ➕ API có, brainstorm chưa lường / ❓ cần xác nhận.
   * __Mục 7 — Câu hỏi mở__ cho `/api-test` / `/api-map` (gồm các gap "API thiếu"/"cần xác nhận" từ Mục 6).
8) __Activity log__ — trước Write set env `CLAUDE_SKILL_NAME=/api-doc` + `CLAUDE_CHANGELOG_AUTHOR={@author}` + `CLAUDE_CHANGELOG_NOTE=tóm tắt {source}, đối chiếu {K} brainstorm ({G} gap)` (≤80 ký tự); hook ghép cả dòng vào `docs/_shared/changelog.md` — KHÔNG nhét lịch sử vào chính `api-summary.md`.
9) __Phase E verify__ — Read lại file, check 7 mục có nội dung thật + frontmatter hợp lệ + không placeholder + Mục 6 có bảng gap hoặc callout no-match. Fail → propose L2 diff fix ngay.
10) __Output report:__
    ```
    ✅ Tóm tắt API: docs/{feature}/integration/api-summary.md
       Thao tác: {N} | Mã lỗi: {M} | Auth: {loại}
       Đối chiếu brainstorm: {K} dùng | Gap phát hiện: {G}{" (⚠️ chưa có brainstorm phù hợp)" nếu no-match}

    Next:
      - /api-test "<METHOD /path>" --feature {feature}   — gọi thử endpoint
      - /api-map --feature {feature}                      — mapping field ra UI
      {- /brainstorm {feature}   — nếu Mục 6 ghi gap "chưa có brainstorm"}
    ```

## Output

`docs/{feature}/integration/api-summary.md` — doc nghiệp vụ tóm tắt contract 3rd-party (`type: api-summary`). Nhiều đối tác → `api-summary-{provider}.md`.

Read-only với API: skill KHÔNG gọi endpoint nào. Hook tự ghi `docs/_shared/changelog.md`.

## References

* @../../rules/api-integration.md
* @../../rules/approval-gate.md
* @../../rules/kg-usage.md
* @../../rules/feature-bootstrap.md
* @../../rules/ba-conventions.md
* @../../rules/naming-conventions.md
* @../../rules/resolve-oqs.md‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
