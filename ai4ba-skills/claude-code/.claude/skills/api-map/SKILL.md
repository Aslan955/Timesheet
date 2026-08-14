---
name: api-map
description: Dùng khi cần lập bảng mapping field 3 tầng (API field ↔ system entity ↔ UI field) cho 1 feature tích hợp API.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
user-invocable: true
argument-hint: "[--feature <slug>]"
---
<!-- Licensed to nguyennam162nvn@gmail.com — Order ZQ6DTFZBW -->

# /api-map — Mapping API ↔ System ↔ UI‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Goal‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Dựng **bảng truy vết field 3 tầng** cho 1 feature tích hợp: mỗi field API trả về → thông tin gì trong hệ thống → hiển thị ở đâu trên màn hình → biến đổi/validation gì. **Output duy nhất**: `docs/{feature}/integration/api-map.md`.

Là tư duy traceability (họ hàng `/gap`) nhưng trace **field** thay vì FR↔US↔AC. Giá trị: (1) làm `/wireframe-ascii` dựng được màn hình từ cột "UI field"; (2) cho QC nguồn viết test case "API trả X thì UI hiện Y"; (3) phát hiện gap sớm.

> **Vị trí trong pipeline (Mục 2 `api-integration.md`):** `/api-map` là **field-mapping — 1 THÀNH PHẦN của Integration Blueprint** (`/api-design`), KHÔNG phải nhánh mồ côi. Nó lo tầng *field* (data A vào thuộc tính nào, hiện ở đâu); blueprint lo tầng *orchestration* (hệ thống phối hợp thế nào — state/webhook/retry/reconciliation). Có thể chạy song song về thực thi, NHƯNG phải **hội tụ vào blueprint TRƯỚC khi chốt `/api-checklist`** (field mapping ảnh hưởng trực tiếp validation/enum/transformation test). Chưa có `api-design.md` → vẫn chạy được, nhưng gợi ý `/api-design` để gắn field-map vào bức tranh tích hợp tổng.

## Constraints‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Hard rules — never violate‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* **1 output cố định** — `docs/{feature}/integration/api-map.md`. File đã tồn tại → tự động chuyển sang update mode (L2 diff), không refuse.
* **Đọc nguồn, không bịa field** — mọi row phải truy về `api-summary.md` (API) + `srs/{feature}-erd.md` (system) + screen specs (UI) nếu có.
* **Gap detection bắt buộc** — flag field API chưa có chỗ hiển thị + UI cần field API không cung cấp.
* **IT-BA framing** — cột "biến đổi" mô tả nghiệp vụ ("chia 100 → định dạng tiền", "map `succeeded` → 'Đã kích hoạt'"), KHÔNG bàn kiểu dữ liệu DB.
* **L1 approval** trước Write. **L2 diff** khi file đã tồn tại (update mode tự động).
* **Cross-link** — frontmatter `links:` trỏ tới `api-summary.md` + `srs/{feature}-erd.md` + screens liên quan.
* **Vietnamese-first**.

### Pitfalls — easy to get wrong‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* **Chưa có ERD/screens** — vẫn map được 2 tầng (API ↔ UI đề xuất), cột system ghi `—` + note. Không block.
* **Field lồng nhau** (object trong object) — flatten bằng dot path (`error.code`), không vẽ cây.
* **Enum field** (status) — liệt kê từng giá trị → nhãn UI tương ứng trong cột biến đổi (đây là phần quan trọng nhất cho UI).
* **Đừng im lặng bỏ gap** — gap là giá trị chính của skill; luôn nêu ở Mục 3 kể cả khi user không hỏi.
* **Update mode giữ row cũ** — file đã tồn tại chỉ thêm/sửa row liên quan, L2 diff cho phần thay đổi.

## Inputs

```
/api-map                          # interactive: pick feature nếu mơ hồ
/api-map --feature premium-payment
```

`--feature` không bắt buộc — auto-detect từ ngữ cảnh (feature đang làm dở), mơ hồ mới hỏi picker. `api-map.md` đã tồn tại → tự động vào update mode, muốn sửa thì gọi lại skill và nói cần đổi gì.

## Context (dynamic)

Today: !`date +%Y-%m-%d`
api-summary có sẵn: !`for d in docs/*/integration/api-summary.md; do [ -f "$d" ] && echo "$d"; done | head -10`
ERD/screens của features: !`for d in docs/*/srs/*-erd.md; do [ -f "$d" ] && echo "$d"; done | head -10`

## Approach

1) **Parse args** — `--feature` optional, auto-detect từ ngữ cảnh; mơ hồ → prompt picker.
2) **Đọc nguồn:**
   * **Nguồn field theo lane** (như các skill khác trong họ, `api-integration.md` Mục 3):
     * **3rd-party**: `docs/{feature}/integration/api-summary.md` — lấy field từ bảng thao tác + output. Thiếu → soft gate warn, suggest `/api-doc` trước.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
     * **own API**: `docs/{feature}/srs/{feature}-spec.md` + `srs/{feature}-erd.md` — field từ FR/entity nội bộ (KHÔNG cần api-summary; đó là doc cho API đối tác). Đây là nhánh own, KHÔNG warn thiếu api-summary.
   * `docs/{feature}/srs/{feature}-erd.md` (nếu có) — system entity.attr để map tầng giữa.
   * `docs/{feature}/ascii-wireframe/*.md` (gộp theo flow) + `{feature}-wireframe-index.md` (nếu có) — UI field hiện có, mỗi file chứa nhiều screen (đọc từng screen-section bên trong).
3) **Dựng bảng mapping** — mỗi field API 1 row:
   | API field | Kiểu/nguồn | System entity.attr | UI field (màn hình) | Biến đổi/validation | Ghi chú nghiệp vụ |
   * System chưa có entity → ghi `—` + note "cần bổ sung ERD".
   * UI chưa có chỗ hiện → ghi `(chưa có)` → đây là gap.
4) **Phát hiện gap** — quét 2 chiều:
   * API field không map được sang UI nào → liệt kê "field thừa / chưa dùng".
   * UI field cần dữ liệu mà API không trả → liệt kê "thiếu nguồn".
   * Error code (từ api-summary Mục 4) chưa có UI xử lý → flag.
5) **L1 plan preview** (prose BA-facing) — path + N field map + K gap phát hiện. Apply? (Y/sửa).
6) **Write `api-map.md`** frontmatter chuẩn (`type: api-map`, `feature`, `status`, `updated`, `links: [api-summary, erd, screens...]`). Body:
   * **Mục 1 — Bảng mapping** (per thao tác/endpoint, mỗi cái 1 bảng con).
   * **Mục 2 — Mapping lỗi**: error code → UI xử lý (badge/toast/màn riêng).
   * **Mục 3 — Gap phát hiện**: danh sách + đề xuất xử lý.
   * **Mục 4 — Câu hỏi mở**.
7) **Activity log** — trước Write set env `CLAUDE_SKILL_NAME=/api-map` + `CLAUDE_CHANGELOG_AUTHOR={@author}` + `CLAUDE_CHANGELOG_NOTE=mapping {N} field, {K} gap` (≤80 ký tự); hook ghép cả dòng vào `docs/_shared/changelog.md` — KHÔNG nhét lịch sử vào chính `api-map.md`.
8) **Output report:**
   ```
   ✅ Mapping: docs/{feature}/integration/api-map.md
      Field map: {N} | Gap: {K}

   Next:
     - /api-design --feature {feature}   — HỘI TỤ field-map vào Integration Blueprint TRƯỚC /api-checklist (nếu api-design.md đã có → cập nhật lại; chưa có → chạy để gắn field-map vào bức tranh tích hợp tổng)
     - /wireframe-ascii {feature}   — dựng màn hình từ cột UI field
     - /sequence "<flow>" --feature {feature}     — vẽ luồng tích hợp
     - Xử lý {K} gap ở Mục 3 (nếu có)
   ```

> **Gate hội tụ (`api-integration.md` Mục 2):** `/api-map` KHÔNG phải nhánh mồ côi — field-map ảnh hưởng validation/enum/transformation test, nên phải **hội tụ vào `api-design.md` TRƯỚC khi chốt `/api-checklist`**. Luôn nhắc bước `/api-design` ở Output để BA đóng vòng này.

## Output

`docs/{feature}/integration/api-map.md` — bảng mapping field 3 tầng API ↔ entity ↔ UI (`type: api-map`).

Hội tụ dưới `api-design.md` trước khi chốt `/api-checklist`. Hook tự ghi `docs/_shared/changelog.md`.

## References

* @../../rules/api-integration.md
* @../../rules/approval-gate.md
* @../../rules/feature-bootstrap.md
* @../../rules/ba-conventions.md
* @../../rules/naming-conventions.md
* @../../rules/resolve-oqs.md‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
