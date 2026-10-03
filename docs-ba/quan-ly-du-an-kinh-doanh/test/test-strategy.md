---
type: test-strategy
feature: quan-ly-du-an-kinh-doanh
status: draft
updated: 2026-10-03
links:
  - docs/quan-ly-du-an-kinh-doanh/srs/quan-ly-du-an-kinh-doanh-spec.md
---

# Test Strategy — quan-ly-du-an-kinh-doanh

## Durable

| Trường | Giá trị |
|--------|---------|
| Môi trường | UAT — địa chỉ chưa có, chờ dự án cấp |
| Nguồn dữ liệu | Dữ liệu mẫu QA dựng theo precondition từng case, gồm đủ vai trò GĐK / SM / AM / Kế toán / BOD và ≥ 2 khối |
| Xử lý nguồn thiếu | OQ + blocked, không giả định expected / wording |
| Thiết bị | Desktop Chrome; responsive = cửa sổ hẹp không vỡ layout |
| Ngưỡng NFR | Ngoài profile — NFR định lượng (thời gian phản hồi, số người đồng thời, quy mô dữ liệu) để excluded-approved |
| Ngôn ngữ | Vietnamese |

## Per-run

| Trường | Giá trị |
|--------|---------|
| Mục đích | UAT (người dùng nghiệp vụ nghiệm thu) |
| Baseline | Toàn bộ SRS to-be 2026-10-03 sau Phase H |
| Profile | Core-functional |
