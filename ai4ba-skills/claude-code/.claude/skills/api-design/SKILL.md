---
name: api-design
description: Dùng khi cần thiết kế Integration Blueprint nghiệp vụ cho 1 feature — cách các hệ thống phối hợp để hoàn thành và duy trì đúng 1 giao dịch nghiệp vụ.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
argument-hint: "[--feature <slug>]"
---
<!-- Licensed to nguyennam162nvn@gmail.com — Order ZQ6DTFZBW -->

# /api-design — Integration Blueprint‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Goal‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Dựng **Integration Blueprint** cho một feature tích hợp: trả lời rõ **các hệ thống phối hợp thế nào để hoàn thành và duy trì đúng một giao dịch nghiệp vụ** — từ lúc ai kích hoạt, gọi đối tác theo chiều nào, nhận kết quả ra sao, đến khi xử lý event trễ/mất/trùng và bàn giao vận hành.

**Output duy nhất**: `docs/{feature}/integration/api-design.md`.

Khác `/api-map`: `/api-map` chỉ truy vết **field API ↔ thông tin hệ thống ↔ UI**. `/api-design` sở hữu bức tranh phối hợp nghiệp vụ: flow, trạng thái, nguồn sự thật, ngoại lệ, reconciliation và trải nghiệm khi đối tác lỗi. `api-map.md` là một phần tham chiếu bên dưới blueprint, phải hội tụ vào blueprint trước `/api-checklist`.

## Constraints‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Hard rules — never violate‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- **1 output cố định** — `docs/{feature}/integration/api-design.md`. File đã tồn tại → tự động chuyển sang update mode (L2 diff), không refuse.
- **Đọc nguồn, không bịa contract hay hành vi đối tác** — dùng `api-summary.md` khi là tích hợp 3rd-party; dùng SRS khi là API nội bộ; dùng `api-map.md` nếu đã có.
- **Phân biệt hai chiều tích hợp**:
  - **outbound**: ứng dụng mình gọi ra đối tác;
  - **inbound**: đối tác gọi vào ứng dụng mình qua webhook.
  
  Đối tác có webhook → blueprint bắt buộc mô tả flow inbound, gồm cả webhook đến trễ, bị mất, trùng hoặc sai thứ tự.
- **BA/PO sở hữu** trigger, kết quả nghiệp vụ, ý nghĩa trạng thái, degraded UX, retry/idempotency cấp nghiệp vụ, reconciliation, manual recovery và SLA/business impact.
- **Không đi vào quyết định dev/architect** như queue/topic cụ thể, thuật toán retry chi tiết, storage, locking, transaction, framework, SDK, endpoint hay cơ chế hạ tầng.
- **Tái dùng sơ đồ chuẩn** — đề xuất **liên kết (link) tới** ít nhất 1 state diagram do `/state` sinh và 1 sequence do `/sequence` sinh (sequence phải có nhánh webhook-miss nếu đối tác dùng webhook). `/api-design` KHÔNG tự chạy 2 skill đó (không có trong allowed-tools) và KHÔNG vẽ tay thay chúng — chỉ gợi ý BA chạy rồi link vào blueprint (`srs/{feature}-states.md`, `srs/{feature}-flows.md`).
- **L1 approval** trước Write. **L2 diff** khi file đã tồn tại (update mode tự động).
- **Cross-link** — frontmatter `links:` trỏ tới nguồn contract/SRS, `api-map.md` nếu có, và các artifact state/sequence liên quan.
- Tuân `@../../rules/api-integration.md`, đặc biệt pipeline `[2] /api-design` → `[3] /api-checklist`, source-of-truth và ranh giới BA ↔ dev.
- **Vietnamese-first** và doc sinh ra chỉ chứa nội dung nghiệp vụ thật, không chèn hướng dẫn cách điền.

### Pitfalls — easy to get wrong‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- **Đừng biến blueprint thành `/api-map`** — bảng field chỉ là evidence hỗ trợ; trọng tâm là hệ thống phối hợp, trạng thái nào được tin và xử lý khi thực tế không như mong đợi.
- **Không chỉ mô tả outbound** — partner có webhook mà thiếu inbound flow là thiếu một nửa tích hợp. Luôn kiểm tra `api-summary.md` xem webhook/callback có tồn tại không.
- **“Đã gửi request” không đồng nghĩa “giao dịch hoàn tất”** — phải nêu trạng thái chờ, nguồn xác nhận cuối cùng và điều user được thấy trong thời gian chờ.
- **Idempotency là outcome nghiệp vụ** — viết “không thu tiền hai lần”, “không tạo hai đơn”, “không cấp quyền trùng”, không yêu cầu dev dùng key, lock hay thuật toán cụ thể.
- **Timeout không tự động là thất bại** — có thể là “chưa rõ kết quả”; nêu cách đối soát trước khi cho user làm lại.
- **Event trùng hoặc sai thứ tự** — không chỉ “bỏ qua”; phải nêu ý nghĩa trạng thái sau cùng, điều kiện bỏ qua/an toàn và khi nào cần recovery.
- **Reconciliation không phải việc kỹ thuật thuần túy** — mô tả đối chiếu điều gì, bao lâu một lần ở mức kỳ vọng nghiệp vụ, ai nhận bàn giao và xử lý kết quả nào.
- **Degraded UX phải trung thực** — không báo thành công khi đối tác chưa xác nhận; cho user biết trạng thái, việc cần làm tiếp và kênh hỗ trợ khi cần.
- **Update mode giữ quyết định cũ** — đọc toàn bộ blueprint hiện có trước khi hỏi; chỉ sửa phần bị tác động, L2 diff cho thay đổi và không hỏi lại điều đã có câu trả lời.
- **Không chặn vì thiếu `/api-map`** — vẫn tạo blueprint từ contract/SRS, nhưng ghi rõ mapping là việc cần hội tụ trước `/api-checklist`.

## Inputs

```text
/api-design                          # interactive: pick feature nếu mơ hồ
/api-design --feature premium-payment
```

`--feature` không bắt buộc — auto-detect từ ngữ cảnh (feature đang làm dở), mơ hồ mới hỏi picker. Feature chưa có → xử lý theo `feature-bootstrap` nhóm A. `api-design.md` đã tồn tại → tự động vào update mode; muốn sửa thì gọi lại skill và nói phần cần đổi.

## Context (dynamic)

Today: !`date +%Y-%m-%d`
API summaries có sẵn: !`for d in docs/*/integration/api-summary.md; do [ -f "$d" ] && echo "$d"; done | head -10`
Blueprints và mappings có sẵn: !`for d in docs/*/integration/api-design.md docs/*/integration/api-map.md; do [ -f "$d" ] && echo "$d"; done | head -20`
SRS/state/flow của features: !`for d in docs/*/srs/*-spec.md; do [ -f "$d" ] && echo "$d"; done | head -30`

## Approach

1) **Parse args** — `--feature` optional, auto-detect từ ngữ cảnh; mơ hồ → prompt picker. Feature chưa tồn tại → bootstrap theo nhóm A, không tự tạo feature im lặng.

2) **Đọc nguồn và xác định lane tích hợp:**
   - `docs/{feature}/integration/api-summary.md` khi đối tác là 3rd-party — hiểu năng lực, thao tác, trạng thái, lỗi và webhook của đối tác.
   - `docs/{feature}/srs/{feature}-spec.md` khi là API nội bộ — hiểu outcome, business rule, error và trạng thái mong đợi của feature.
   - `docs/{feature}/integration/api-map.md` nếu có — dùng bảng map field để kiểm tra rằng flow và trạng thái có dữ liệu đủ để vận hành.
   - `docs/{feature}/srs/{feature}-flows.md`, `{feature}-states.md`, use case, URD/PRD nếu có — lấy trigger, actor, outcome và ngoại lệ đã chốt.
   - Thiếu nguồn chính → soft gate warn, nêu rõ phần nào chỉ là assumption; suggest `/api-doc` cho đối tác 3rd-party hoặc bổ sung SRS cho API nội bộ.

3) **Xác định một giao dịch nghiệp vụ trung tâm** — nêu rõ:
   - actor hoặc hệ thống nào trigger;
   - điều kiện bắt đầu và kết quả được coi là hoàn tất;
   - hệ thống nào sở hữu từng bước;
   - outbound/inbound nào xảy ra;
   - có webhook, polling hay đồng bộ bất đồng bộ hay không.
   
   Một blueprint có thể có nhiều flow, nhưng mỗi flow phải chỉ ra giao dịch nghiệp vụ mà nó duy trì đúng.

4) **Dựng state mapping và source of truth** — với mỗi trạng thái quan trọng:‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
   - trạng thái nội bộ ↔ trạng thái đối tác;
   - ý nghĩa nghiệp vụ và điều user nhìn thấy;
   - hệ thống nào là source of truth ở trạng thái đó;
   - khi nào trạng thái được xác nhận, tạm chờ hoặc cần đối soát.
   
   Không để hai nguồn sự thật cạnh tranh. Khi partner chưa xác nhận, mô tả rõ trạng thái chờ và cách xử lý thay vì tự kết luận thành công.
   - **Khi hai bên BẤT ĐỒNG** (mình ghi success, đối tác báo failed — hoặc ngược lại): chốt rõ **bên nào là phán quyết cuối** cho từng trạng thái + hành động điều chỉnh (tự động hay thủ công). Đây là quyết định nghiệp vụ, không chỉ "phát hiện chênh lệch".

5) **Thiết kế happy flow và exception flow bằng ngôn ngữ nghiệp vụ:**
   - đối tác trả thành công;
   - timeout hoặc phản hồi chưa rõ;
   - đối tác từ chối;
   - webhook không đến, đến trùng, đến sai thứ tự hoặc đến muộn;
   - **partial success**: gọi đối tác OK nhưng bước ghi nhận nội bộ fail (tiền trừ mà đơn không tạo) → **hành động bù (compensating action)** nào để đưa về nhất quán;
   - **hủy/hoàn ngược nghiệp vụ** (refund, void, cancel) khi giao dịch đã đi một phần → luồng đảo ngược ở cấp nghiệp vụ;
   - người dùng thao tác lại;
   - reconciliation phát hiện chênh lệch.

   > Mỗi flow tự có **exception set RIÊNG** — feature đa-flow KHÔNG dùng chung 1 bộ exception cho mọi flow.
   
   Nêu timeout/retry theo yêu cầu nghiệp vụ, ví dụ “không thu tiền hai lần”, “không cấp quyền khi chưa có xác nhận”, thay vì nêu thuật toán hay cấu hình hạ tầng.

6) **Xác định vận hành và trải nghiệm suy giảm:**
   - user thấy gì khi đối tác lỗi/chậm;
   - thông điệp, trạng thái chờ, hành động tiếp theo và điều không được hứa sai;
   - khi nào đội vận hành cần can thiệp;
   - thông tin cần bàn giao để recovery;
   - nguyên tắc reconciliation và kết quả xử lý chênh lệch;
   - SLA/SLO kỳ vọng theo tác động nghiệp vụ.

7) **Đề xuất artifact hỗ trợ flow:**
   - `/state <entity> --feature {feature}` cho entity/trạng thái giao dịch quan trọng;
   - `/sequence "<flow>" --feature {feature}` cho luồng phối hợp chính, gồm nhánh webhook-miss nếu áp dụng.
   
   Nếu artifact đã có, link và đối chiếu; nếu chưa có, ghi vào câu hỏi mở hoặc next step, không tự giả định chi tiết kỹ thuật.

8) **L1 plan preview** (prose BA-facing) — nêu file sẽ tạo/cập nhật, các flow nghiệp vụ, số trạng thái được map, các exception/recovery cần chốt và câu hỏi mở còn lại. Apply? (Y / sửa).

9) **Write hoặc update `api-design.md`** với frontmatter chuẩn (`type: api-design`, `feature`, `status: draft`, `updated`, `links`) — KHÔNG `created`/`owner`/`changelog` (frontmatter diet, lịch sử ở changelog.md). Body:
   - **Mục 1 — Phạm vi hệ thống và ownership**.
   - **Mục 2 — Giao dịch nghiệp vụ và trigger/actor theo từng flow**.
   - **Mục 3 — Cách phối hợp**: outbound/inbound, synchronous/asynchronous, webhook/polling.
   - **Mục 4 — Happy flow và exception flow**.
   - **Mục 5 — State mapping và source of truth**.
   - **Mục 6 — Timeout, retry và idempotency nghiệp vụ**.
   - **Mục 7 — Event trùng, sai thứ tự, webhook-miss và reconciliation**.
   - **Mục 8 — Manual recovery, operational handoff và degraded UX**.
   - **Mục 9 — SLA/SLO kỳ vọng**.
   - **Mục 10 — Liên kết `/api-map` và artifact sơ đồ**.
   - **Mục 11 — Assumptions và câu hỏi mở**.

10) **Activity log** — trước Write/Edit set env `CLAUDE_SKILL_NAME=/api-design` + `CLAUDE_CHANGELOG_AUTHOR={@author}` + `CLAUDE_CHANGELOG_NOTE=blueprint {N} flow, {K} open question` (≤80 ký tự); hook ghép cả dòng vào `docs/_shared/changelog.md` — KHÔNG nhét lịch sử vào chính `api-design.md`.

11) **Output report:**

    ```text
    ✅ Integration Blueprint: docs/{feature}/integration/api-design.md
       Flows: {N} | State map: {M} | Open questions: {K}

    Next:
      - /api-map --feature {feature}          — hoàn thiện field mapping nếu chưa có
      - /state <entity> --feature {feature}   — chốt vòng đời trạng thái
      - /sequence "<flow>" --feature {feature} — minh họa flow, gồm webhook-miss
      - /api-checklist --feature {feature}    — chỉ chạy sau khi blueprint + mapping đã hội tụ
    ```

## Output

`docs/{feature}/integration/api-design.md` — Integration Blueprint (`type: api-design`): orchestration, state-map, source-of-truth, webhook, retry/idempotency nghiệp vụ, reconciliation, degraded-UX.

Hook tự ghi 1 dòng vào `docs/_shared/changelog.md`.

## References

- @../../rules/api-integration.md
- @../../rules/approval-gate.md
- @../../rules/feature-bootstrap.md
- @../../rules/ba-conventions.md
- @../../rules/naming-conventions.md
- @../../rules/resolve-oqs.md‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
