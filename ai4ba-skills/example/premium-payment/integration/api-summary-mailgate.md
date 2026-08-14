---
type: api-summary
feature: premium-payment
status: draft
updated: 2026-07-15
links: [_teaching/buoi-6-integrate/mock-mailgate/openapi.yaml, docs/premium-payment/integration/api-map.md]
---

# API Summary — MailGate‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Tóm tắt nghiệp vụ đối tác **MailGate** (email giao dịch). Nguồn: `mock-mailgate/openapi.yaml`.

## 1. Tổng quan‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

MailGate (kiểu SendGrid) gửi email giao dịch cho English app: biên nhận thanh toán, báo thanh toán thất bại, chào mừng Premium. Tài nguyên: templates, messages. Base URL test: `http://localhost:4343` (deploy: `https://mailgate.<domain>`).

**Version pin:** endpoint path `/v1`. Chính sách deprecation + cam kết thông báo thay đổi của MailGate: chưa rõ (OQ, → `/api-readiness`).

## 2. Xác thực‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Bearer key `mg_test_...` — **khác khóa PayGate**. Bài học: tích hợp đa đối tác phải quản lý nhiều khóa riêng.

## 3. Bảng thao tác‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Thao tác | Method / Path | Input chính | Output | Trigger |
|---|---|---|---|---|
| Liệt kê template | `GET /v1/templates` | — | list template + biến bắt buộc | Lúc thiết kế email |
| Gửi email | `POST /v1/messages` | to, template, variables | message (msg_) + status | Sau charge succeeded/failed |
| Tra trạng thái giao | `GET /v1/messages/{id}` | id | message + status | Kiểm tra đã giao chưa |
| Liệt kê email | `GET /v1/messages?limit` | phân trang | list | Đối soát email |

**Template:** `receipt` (biên nhận — biến customer_name/amount/charge_id), `payment_failed` (customer_name/reason), `welcome_premium` (customer_name/plan).
**Trạng thái giao:** `queued/delivered/bounced/failed`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 4. Error catalog‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Mã | HTTP | Ý nghĩa | UI/Xử lý |
|---|---|---|---|
| `invalid_email` | 400 | Email sai định dạng | Validate trước khi gửi |
| `template_not_found` | 400 | Template lạ | Lỗi cấu hình app |
| `missing_field` | 400 | Thiếu to/template | Lỗi phía app |
| `unauthorized` | 401 | Sai khóa | Lỗi cấu hình |
| `rate_limited` | 429 | Gửi quá nhiều | Backoff |
| (status) `bounced` | 201→bounced | Email bị trả về | Tra status; fallback hiện biên nhận trong app |

→ Feed Error Matrix SRS `E-premium-payment-007..009`.

## 5. Ràng buộc

- **"Gửi OK ≠ giao thành công"**: `POST` trả 201 nhưng phải tra `status` mới biết `delivered`/`bounced` (NFR + bài học QC).
- Rate limit 30 req/10s/IP.

## 6. Câu hỏi mở

- [ ] OQ-1: Nếu email `bounced`, có cơ chế gửi lại / thông báo trong app không?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
