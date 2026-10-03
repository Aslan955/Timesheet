---
type: test-strategy
feature: phuong-an-kinh-doanh
status: draft
updated: 2026-10-03
links:
  - docs/phuong-an-kinh-doanh/srs/phuong-an-kinh-doanh-spec.md
---

# Test Strategy — phuong-an-kinh-doanh

## Durable

| Hạng mục | Giá trị |
|---|---|
| Môi trường | UAT — địa chỉ chưa có, chờ dự án cấp |
| Nguồn dữ liệu | Dữ liệu mẫu QA dựng theo precondition từng case, gồm đủ vai trò GĐK / SM / AM / Kế toán / BOD và ≥ 2 khối |
| Xử lý nguồn thiếu | Ghi OQ + để obligation blocked; không giả định expected / wording |
| Thiết bị | Desktop Chrome; responsive = cửa sổ hẹp không vỡ bố cục |
| Ngưỡng NFR | NFR định lượng (thời gian phản hồi, số người dùng đồng thời, quy mô dữ liệu, thời gian tự ẩn toast) ngoài profile |
| Ngôn ngữ | Vietnamese |

## Per-run

| Hạng mục | Giá trị |
|---|---|
| Mục đích | UAT — người dùng nghiệp vụ nghiệm thu |
| Baseline | Toàn bộ SRS to-be 2026-10-03 sau Phase H |
| Profile | Core-functional |
