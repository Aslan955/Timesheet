---
type: test-strategy
feature: bao-cao-hieu-qua-du-an
status: draft
updated: 2026-10-03
links:
  - docs/bao-cao-hieu-qua-du-an/srs/bao-cao-hieu-qua-du-an-spec.md
---

# Test Strategy — bao-cao-hieu-qua-du-an

## Durable

| Hạng mục | Giá trị |
|---|---|
| Môi trường | UAT — địa chỉ chưa có, chờ dự án cấp |
| Nguồn dữ liệu | Dữ liệu mẫu QA dựng theo precondition từng case, gồm đủ vai trò GĐK / SM / AM / Kế toán / BOD và ≥ 2 khối |
| Xử lý nguồn thiếu | Câu hỏi mở (OQ) + obligation `blocked`; không giả định expected / wording |
| Thiết bị | Desktop Chrome |
| Ngưỡng NFR | Ngoài profile (NFR định lượng → excluded-approved) |
| Ngôn ngữ | Vietnamese |

## Per-run

| Hạng mục | Giá trị |
|---|---|
| Mục đích | UAT |
| Baseline | Toàn bộ SRS to-be 2026-10-03 sau Phase H |
| Profile | Core-functional |
