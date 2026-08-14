---
type: srs
feature: premium-payment
status: draft
updated: 2026-05-26
links: [docs/premium-payment/premium-payment-prd.md, docs/premium-payment/srs/premium-payment-erd.md, docs/premium-payment/srs/premium-payment-flows.md, docs/premium-payment/srs/premium-payment-states.md, docs/premium-payment/integration/api-summary-paygate.md, docs/premium-payment/integration/api-summary-mailgate.md]
---

# SRS — Thanh toán & gói Premium‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Phạm vi kỹ thuật‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

App tích hợp 2 đối tác: **PayGate** (thanh toán: charges, subscriptions, refunds, events) và **MailGate** (email giao dịch). App lưu bản sao nghiệp vụ (Payment, Subscription, EmailMessage) để hiển thị + đối soát.

## 2. Functional Requirements‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| ID | Yêu cầu | Ưu tiên |
|---|---|---|
| FR-premium-payment-001 | Hiển thị danh sách gói (one-time / thuê bao tháng / năm) kèm giá | P0 |
| FR-premium-payment-002 | Nhập thẻ mới và thanh toán 1 lần qua PayGate `POST /v1/charges` | P0 |
| FR-premium-payment-003 | Thanh toán bằng thẻ đã lưu (`payment_method`) | P1 |
| FR-premium-payment-004 | Kích hoạt Premium khi charge `succeeded` | P0 |
| FR-premium-payment-005 | Hiển thị màn kết quả (thành công / từng loại lỗi thẻ) | P0 |
| FR-premium-payment-006 | Gửi email biên nhận qua MailGate template `receipt` sau khi thành công | P0 |
| FR-premium-payment-007 | Tạo thuê bao định kỳ qua `POST /v1/subscriptions` | P1 |
| FR-premium-payment-008 | Polling `GET /v1/events` để cập nhật trạng thái charge/subscription | P1 |
| FR-premium-payment-009 | Khi `charge.failed` của thuê bao: gửi email `payment_failed`, sau 3 ngày hạ cấp Free | P1 |
| FR-premium-payment-010 | Lịch sử giao dịch (list charges, phân trang) + tra trạng thái 1 charge | P1 |
| FR-premium-payment-011 | Quản lý thuê bao: xem kỳ gia hạn, hủy (`/cancel`) | P1 |
| FR-premium-payment-012 | Hoàn tiền qua `POST /v1/refunds` | P2 |

## 3. Non-Functional Requirements‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| ID | Yêu cầu |
|---|---|
| NFR-premium-payment-001 | Phản hồi thanh toán < 3s (P95) |
| NFR-premium-payment-002 | Khi gặp `429 rate_limited` → tự retry với backoff, không báo lỗi cứng cho user ngay |
| NFR-premium-payment-003 | Dùng `Idempotency-Key` cho mọi lần tạo charge để chống thu trùng |
| NFR-premium-payment-004 | Khóa đối tác (PayGate/MailGate) lưu ở secret store phía server; KHÔNG nhúng client, KHÔNG log |
| NFR-premium-payment-005 | Polling sự kiện tối đa mỗi 1 phút; không bỏ sót event (lưu con trỏ event cuối đã xử lý) |

## 4. Business Rules‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| ID | Quy tắc |
|---|---|
| BR-premium-payment-001 | Premium chỉ kích hoạt khi charge `status = succeeded` |
| BR-premium-payment-002 | Thuê bao thanh toán thất bại liên tục 3 ngày → tự hạ cấp về Free |
| BR-premium-payment-003 | Chỉ hoàn tiền charge đang `succeeded` (không hoàn charge `failed`/đã `refunded`) |
| BR-premium-payment-004 | Giá: premium_monthly = 99.000đ; premium_yearly = 990.000đ |
| BR-premium-payment-005 | Email biên nhận gửi sau khi (và chỉ khi) charge `succeeded` |

## 5. Error Matrix

| ID | Nguồn | Mã đối tác (HTTP) | Ý nghĩa nghiệp vụ | Xử lý UI |
|---|---|---|---|---|
| E-premium-payment-001 | PayGate | `card_declined` (402) | Thẻ bị từ chối | Màn kết quả lỗi + "Thử thẻ khác" |
| E-premium-payment-002 | PayGate | `insufficient_funds` (402) | Số dư không đủ | "Số dư không đủ, dùng thẻ khác" |
| E-premium-payment-003 | PayGate | `expired_card` (402) | Thẻ hết hạn | "Thẻ đã hết hạn" + sửa thẻ |
| E-premium-payment-004 | PayGate | `incorrect_cvc` (402) | Sai CVC | "Sai mã CVC" + nhập lại |
| E-premium-payment-005 | PayGate | `processing_error` (500) | Lỗi tạm phía cổng | "Hệ thống bận, thử lại" + auto retry |
| E-premium-payment-006 | PayGate | `rate_limited` (429) | Quá nhiều request | Retry/backoff, ẩn với user |
| E-premium-payment-007 | PayGate/MailGate | `unauthorized` (401) | Sai khóa (lỗi cấu hình) | KHÔNG hiện user; log + cảnh báo dev |
| E-premium-payment-008 | MailGate | `bounced` (status) | Email bị trả về | Tra trạng thái; hiển thị biên nhận trong app làm fallback |
| E-premium-payment-009 | MailGate | `invalid_email` (400) | Email sai định dạng | Bắt validate trước khi gửi |

## 6. Data Entities (cho ERD)

User, Customer, PaymentMethod, Payment, Subscription, Refund, EmailMessage. Chi tiết quan hệ xem [[erd.md]].

## 7. Tham chiếu

- Luồng: [[flows.md]] · Trạng thái: [[states.md]]
- API đối tác: [[../integration/api-summary-paygate.md]], [[../integration/api-summary-mailgate.md]]
- Mapping field: [[../integration/api-map.md]]‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
