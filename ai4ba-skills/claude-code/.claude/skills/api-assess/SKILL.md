---
name: api-assess
description: Dùng khi cần đánh giá đối tác/API hoặc cân nhắc build-vs-buy trước khi chọn provider cho 1 feature.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
argument-hint: "[--feature <slug>]"
---
<!-- Licensed to nguyennam162nvn@gmail.com — Order ZQ6DTFZBW -->

# /api-assess — Đánh giá đối tác API‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Goal‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đánh giá __đối tác/API theo góc nhìn nghiệp vụ__ để quyết định chọn/không chọn provider hoặc build-vs-buy __trước khi__ tốn công đọc kỹ contract và kiểm tra tích hợp. __Output duy nhất__: `docs/{feature}/integration/api-assess.md`.

Đây là bước `[0]` có điều kiện trong pipeline tích hợp API: `assess → api-doc → api-design → api-map → api-checklist → api-test → api-readiness`. Dựa trên BABOK 10.49 Vendor Assessment và tư duy Thoughtworks build-vs-buy: BA/PO đánh giá mức phù hợp, năng lực, ràng buộc thương mại và rủi ro phụ thuộc đối tác — __không phải việc thiết kế hay phát triển kỹ thuật__.

## Constraints‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Hard rules — never violate‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* __Chỉ chạy khi có lý do lựa chọn__: chưa chốt provider; có nhiều provider cạnh tranh; đang cân nhắc build-vs-buy; API quyết định phạm vi sản phẩm; hoặc chi phí, SLA, tuân thủ, lock-in là yếu tố lớn.
* __Bỏ qua khi không còn quyền lựa chọn__: đối tác đã ký hợp đồng, hệ sinh thái áp đặt provider, hoặc thay đổi nhỏ trên tích hợp cũ. Nếu ngữ cảnh cho thấy provider đã chốt, hỏi đúng __1 câu xác nhận__: “Provider đã chốt; anh/chị vẫn cần đánh giá để lưu quyết định/rủi ro, hay bỏ qua `/api-assess` và sang `/api-doc`?”
* __1 output cố định__ — `docs/{feature}/integration/api-assess.md`. File đã tồn tại → tự động chuyển sang update mode (L2 diff), không refuse.
* __Feature chưa có__ → áp dụng feature-bootstrap nhóm A: xác nhận điểm vào, derive slug, rồi mới tạo cấu trúc feature cần thiết.
* __Scorecard nhẹ, có evidence__ — mỗi tiêu chí phải có nhãn/điểm, ghi chú và nguồn bằng chứng; không biến tài liệu thành hồ sơ thầu khổng lồ.
* __So sánh nhiều provider__ → dùng bảng cạnh nhau trên cùng một tiêu chí để người đọc thấy trade-off rõ ràng.
* __Verdict phải đứng cuối__ — trình bày evidence, assumption và câu hỏi mở trước; không kết luận trước khi có căn cứ.
* __IT-BA framing__ — mô tả năng lực nghiệp vụ, ảnh hưởng vận hành, trải nghiệm khi dịch vụ lỗi, chi phí và rủi ro phụ thuộc. Không yêu cầu hay suy diễn endpoint, SDK, framework, cấu trúc payload hoặc cách triển khai.
* __Nguồn có phân biệt mức tin cậy__ — thông tin từ tài liệu/hợp đồng chính thức khác với lời chào hàng, review công khai hoặc giả định nội bộ; ghi rõ khi chưa xác minh.
* __L1 approval__ trước Write. __L2 diff__ khi file đã tồn tại (update mode tự động).
* __Cross-link__ — frontmatter `links:` trỏ tới các tài liệu nguồn thực sự đã dùng: URD/BRD/PRD/SRS, proposal/hợp đồng, tài liệu provider hoặc quyết định liên quan.
* Tuân thủ `@../../rules/api-integration.md`, đặc biệt điều kiện chạy bước `[0]`, ranh giới BA ↔ dev và thứ tự pipeline.
* __Vietnamese-first__.

### Pitfalls — easy to get wrong‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* __Provider đã chốt__ — không tự tạo assessment chỉ vì pipeline có bước `[0]`; hỏi xác nhận một lần rồi tôn trọng quyết định bỏ qua.
* __Version/deprecation + SLA ở đây là tiêu chí CHỌN (đánh giá một lần để quyết), KHÔNG phải kế hoạch theo dõi vận hành__ — việc theo dõi version đối tác đổi/deprecate + SLA khi chạy thật là của `/api-readiness` (bước [5]). Đừng ghi trùng kế hoạch monitoring vào đây.
* __Không có đủ evidence__ — không ép ra điểm số giả. Dùng `Cần làm rõ`, nêu evidence còn thiếu và tác động tới quyết định.
* __Giá “từ” hoặc review công khai__ — chỉ là tín hiệu tham khảo, không thay cho báo giá/hợp đồng hoặc cam kết SLA.
* __Capability coverage không phải danh sách endpoint__ — đánh giá provider có đáp ứng outcome nghiệp vụ cần thiết hay không; chi tiết contract để `/api-doc`.
* __Integration effort là tương đối__ — diễn đạt theo mức ảnh hưởng đến thời gian, phối hợp, vận hành và thay đổi quy trình; không suy đoán giải pháp kỹ thuật.
* __Compliance không chỉ là logo chứng nhận__ — ghi rõ chứng nhận/ràng buộc áp dụng ở thị trường hoặc dữ liệu nào; thiếu bằng chứng thì để câu hỏi mở.
* __Lock-in phải có đường ra__ — tối thiểu nêu quyền sở hữu dữ liệu, khả năng xuất/chuyển dữ liệu, thời hạn thông báo deprecation và phương án chuyển đổi ở mức nghiệp vụ.
* __Verdict không được đảo vị trí__ — evidence và trade-off phải có trước khuyến nghị; nếu chưa đủ dữ liệu thì verdict là “chưa quyết định”.
* __Update mode giữ dấu vết quyết định__ — không xóa assumption/evidence cũ; ghi rõ điều gì đã thay đổi và vì sao, trình L2 diff trước khi sửa.

## Inputs

```text
/api-assess                           # interactive: pick feature nếu mơ hồ
/api-assess --feature premium-payment
```

`--feature` không bắt buộc — auto-detect từ ngữ cảnh (feature đang làm dở), mơ hồ mới hỏi picker. Có thể cung cấp tên các provider, proposal, link tài liệu, mức ngân sách, ràng buộc tuân thủ hoặc quyết định cần đưa ra.

`api-assess.md` đã tồn tại → tự động vào update mode; đọc đầy đủ file cũ, chỉ hỏi phần chưa có hoặc đã thay đổi, sau đó trình L2 diff.

## Context (dynamic)

Today: !`date +%Y-%m-%d`  
Feature candidates: !`for d in docs/*; do [ -d "$d" ] && [ "$(basename "$d")" != "_shared" ] && echo "$(basename "$d")"; done | head -20`  
Existing assessments: !`for d in docs/*/integration/api-assess.md; do [ -f "$d" ] && echo "$d"; done | head -10`  
Upstream feature docs: !`for d in docs/*/*-{urd,brd,prd}.md docs/*/srs/*-spec.md; do [ -f "$d" ] && echo "$d"; done | head -20`

## Approach

1. __Parse args và kiểm tra điều kiện chạy__ — xác định feature, provider/giải pháp đang cân nhắc và quyết định cần hỗ trợ. Nếu feature chưa có, chạy feature-bootstrap nhóm A. Nếu có dấu hiệu provider đã ký/chốt hoặc không có quyền chọn, hỏi một câu xác nhận có tiếp tục đánh giá hay chuyển sang `/api-doc`.

2. __Đọc bối cảnh nghiệp vụ__:
   * `docs/{feature}/{feature}-urd.md`, `{feature}-brd.md`, `{feature}-prd.md`, `srs/{feature}-spec.md` (nếu có) — hiểu outcome, phạm vi, ưu tiên và ràng buộc của feature.
   * Quyết định, meeting note, proposal, báo giá, hợp đồng hoặc tài liệu provider mà user cung cấp — lấy evidence về giá, SLA, chứng nhận, chính sách phiên bản và điều khoản dữ liệu.
   * File `api-assess.md` hiện có (update mode) — giữ evidence, assumption và quyết định cũ còn hiệu lực; không hỏi lại điều đã trả lời.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

3. __Làm rõ tối thiểu bằng ngôn ngữ nghiệp vụ__ — chỉ hỏi các điểm còn thiếu có thể đổi kết luận: năng lực cần mua/xây, provider đang cân nhắc, thị trường/tuân thủ bắt buộc, khung chi phí, mốc ra mắt, mức chấp nhận gián đoạn và ai có quyền quyết định. User không có đủ dữ liệu → tiếp tục với assumption được gắn nhãn rõ.

4. __Thu thập evidence theo nhu cầu__:
   * Ưu tiên tài liệu chính thức, hợp đồng/proposal, trang SLA, bảng giá, chứng nhận và chính sách vòng đời API.
   * Nếu user muốn, có thể gợi ý dùng web search qua sub-agent để tra SLA, pricing và review đối tác; đây là lựa chọn hỗ trợ, __không bắt buộc__.
   * Không biến kết quả web thành sự thật đã xác minh: ghi nguồn, ngày tra cứu và mức độ tin cậy.

5. __Dựng scorecard__ — đánh giá gọn theo các tiêu chí:
   | Tiêu chí | Điểm/nhãn | Ghi chú nghiệp vụ | Evidence |
   |---|---|---|---|
   | Business fit |  |  |  |
   | Capability coverage |  |  |  |
   | Integration effort tương đối |  |  |  |
   | Maturity/reliability (uptime lịch sử, số khách, incident công khai) |  |  |  |
   | SLA/support cam kết |  |  |  |
   | Sandbox/dev-experience (có thử được trước khi cam kết không) |  |  |  |
   | Security/compliance cert |  |  |  |
   | Cost/commercial constraint |  |  |  |
   | Data ownership/portability |  |  |  |
   | Versioning/deprecation policy |  |  |  |
   | Vendor lock-in + exit plan |  |  |  |

   * Một provider: dùng một scorecard, nhãn gợi ý `Phù hợp / Cần làm rõ / Rủi ro cao`.
   * Nhiều provider: dựng bảng so sánh cạnh nhau theo từng tiêu chí; chỉ chấm điểm khi tiêu chí và căn cứ đủ rõ, còn lại dùng nhãn kèm ghi chú.
   * Build-vs-buy: thay provider bằng các phương án `Tự xây` và `Mua/tích hợp`, so sánh trên cùng tiêu chí.

6. __Tổng hợp trade-off và rủi ro__ — nêu năng lực nào được đáp ứng, khoảng trống nào làm thay đổi phạm vi, ràng buộc thương mại/vận hành nào cần xử lý, phương án giảm lock-in và điều kiện cần có để rời provider. Không đề xuất cơ chế kỹ thuật triển khai.

7. __L1 plan preview__ (prose BA-facing) — nêu sẽ tạo mới/cập nhật `docs/{feature}/integration/api-assess.md`, các phương án được so sánh, số evidence đã có, assumption còn treo và câu hỏi cần chốt. Apply? (Y / sửa).

8. **Write `api-assess.md`** với frontmatter chuẩn (`type: api-assess`, `feature`, `status: draft`, `updated`, `links`) — KHÔNG `created`/`owner`/`changelog` (frontmatter diet). Body:
   * __Mục 1 — Bối cảnh và quyết định cần hỗ trợ__
   * __Mục 2 — Phương án đánh giá__
   * __Mục 3 — Scorecard và evidence__
   * __Mục 4 — Trade-off, rủi ro và phương án thoát__
   * __Mục 5 — Assumption và câu hỏi mở__
   * __Mục 6 — Khuyến nghị__: chọn/không chọn/build-vs-buy, điều kiện đi kèm, owner quyết định và bước tiếp theo.

9. __Activity log__ — trước Write/Edit set env `CLAUDE_SKILL_NAME=/api-assess` + `CLAUDE_CHANGELOG_AUTHOR={@author}` + `CLAUDE_CHANGELOG_NOTE=assess {N} phương án, verdict {nhãn}` (≤80 ký tự); hook ghép cả dòng vào `docs/_shared/changelog.md` — không nhét lịch sử vào chính `api-assess.md`.

10. __Output report:__

   ```text
   ✅ Đánh giá đối tác: docs/{feature}/integration/api-assess.md
      Phương án: {N} | Khuyến nghị: {chọn/không chọn/build-vs-buy}

   Next:
     - Chốt {M} câu hỏi mở ở Mục 5
     - /api-doc --feature {feature} — đọc contract của provider được chọn
     - /api-design --feature {feature} — thiết kế tích hợp nghiệp vụ sau khi quyết định được phê duyệt
   ```

## Output

`docs/{feature}/integration/api-assess.md` — scorecard đánh giá đối tác (`type: api-assess`). Bare name trong `integration/` (nhất quán họ api-summary/api-map).

Hook tự ghi 1 dòng vào `docs/_shared/changelog.md`.

## References

* @../../rules/api-integration.md
* @../../rules/approval-gate.md
* @../../rules/feature-bootstrap.md
* @../../rules/ba-conventions.md
* @../../rules/naming-conventions.md
* @../../rules/resolve-oqs.md‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
