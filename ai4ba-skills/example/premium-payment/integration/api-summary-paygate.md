---
type: api-summary
feature: premium-payment
status: draft
updated: 2026-07-15
links: [_teaching/buoi-6-integrate/mock-paygate/openapi.yaml, https://paygate.ai4ba.com/, docs/premium-payment/integration/api-map.md]
---

# API Summary — PayGate‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Tóm tắt nghiệp vụ tài liệu đối tác **PayGate** (cổng thanh toán). Nguồn: `mock-paygate/openapi.yaml`.

## 1. Tổng quan‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

PayGate (kiểu Stripe) thu tiền gói Premium — mua 1 lần hoặc thuê bao định kỳ. Tài nguyên: customers, payment_methods, charges, refunds, subscriptions, events. Base URL test: `http://localhost:4242` (deploy: `https://paygate.<domain>`).

**Version pin:** endpoint đang dùng path `/v1` (vd `POST /v1/charges`). Tài liệu tóm tắt cũ có nhắc "PayGate v2" — **cần xác nhận version contract thực tế đang pin** trước go-live (→ `/api-readiness`). Chính sách deprecation của đối tác: chưa rõ (OQ).

## 2. Xác thực‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Bearer key `sk_test_...` trong header `Authorization`. Mỗi môi trường (test/thật) khóa khác nhau. Khóa là bí mật — lưu server, không lộ client.

## 3. Bảng thao tác‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Thao tác | Method / Path | Input chính | Output | Trigger |
|---|---|---|---|---|
| Tạo khách hàng | `POST /v1/customers` | email | customer (cus_) | Trước khi lưu thẻ / thuê bao |
| Lưu thẻ | `POST /v1/payment_methods` | customer, card | payment_method (pm_) | User lưu thẻ |
| Thanh toán 1 lần | `POST /v1/charges` | amount, currency, source/payment_method | charge (ch_) | Mua Premium |
| Tra thanh toán | `GET /v1/charges/{id}` | id | charge + status | Màn gián đoạn |
| Liệt kê thanh toán | `GET /v1/charges?limit&starting_after` | phân trang | list | Lịch sử giao dịch |
| Hoàn tiền | `POST /v1/refunds` | charge | refund (re_) | Yêu cầu hoàn |
| Tạo thuê bao | `POST /v1/subscriptions` | customer, plan | subscription (sub_) | Đăng ký định kỳ |
| Hủy thuê bao | `POST /v1/subscriptions/{id}/cancel` | id | subscription canceled | User hủy |
| Feed sự kiện | `GET /v1/events?type` | lọc type | list event | Polling cập nhật async |
| Tạo sự kiện test | `POST /v1/events/simulate` | type | event | Chỉ để test |

**Trạng thái:** charge `pending/succeeded/failed/refunded`; subscription `active/past_due/canceled`.
**Plan:** `premium_monthly` (99.000đ), `premium_yearly` (990.000đ).
**Token thẻ thử:** `tok_chargeable` (OK), `tok_declined`, `tok_insufficient`, `tok_expired`, `tok_cvc_fail`, `tok_error`.

## 4. Error catalog‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Mã | HTTP | Ý nghĩa | UI đề xuất |
|---|---|---|---|
| `missing_field` | 400 | Thiếu trường bắt buộc (email, amount...) | Validate form trước khi gọi, báo field thiếu |
| `invalid_json` | 400 | Body sai định dạng JSON | Lỗi cấu hình client, không hiện user |
| `invalid_plan` | 400 | Plan không hợp lệ (chỉ `premium_monthly`/`premium_yearly`) | Chỉ cho chọn plan hợp lệ trong UI |
| `card_declined` | 402 | Thẻ bị từ chối | Thử thẻ khác |
| `insufficient_funds` | 402 | Không đủ số dư | Dùng thẻ khác |
| `expired_card` | 402 | Thẻ hết hạn | Cập nhật thẻ |
| `incorrect_cvc` | 402 | Sai CVC | Nhập lại |
| `processing_error` | 500 | Lỗi tạm phía cổng | Retry |
| `rate_limited` | 429 | Quá nhiều request | Backoff, ẩn user |
| `unauthorized` | 401 | Sai khóa | Lỗi cấu hình, không hiện user |
| `resource_missing` | 404 | Không tìm thấy | "Không tìm thấy giao dịch" |

→ Feed Error Matrix SRS `E-premium-payment-001..010`.

## 5. Ràng buộc

* **Rate limit** 30 req/10s/IP → NFR retry/backoff.
* **Idempotency-Key** chống thu trùng → bắt buộc khi tạo charge (NFR-003).
* **Webhook qua polling**: không có callback thật — app poll `GET /v1/events` (NFR-005, lưu con trỏ event cuối).
* **Phân trang** cursor `starting_after` cho list.

## 6. Câu hỏi mở

* [x] OQ-1: Production base URL = `https://paygate.ai4ba.com/` (test base vẫn `http://localhost:4242`). Cơ chế xoay khóa: chưa rõ — giữ mở.
* [ ] OQ-2: Polling interval bao lâu là đủ để không trễ gia hạn? (đề xuất 1 phút)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
