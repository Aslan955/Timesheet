---
type: api-checklist
feature: premium-payment
api_type: 3rd
status: draft
updated: 2026-07-15
links: [docs/premium-payment/integration/api-summary-paygate.md, docs/premium-payment/integration/api-summary-mailgate.md, docs/premium-payment/srs/premium-payment-spec.md, docs/premium-payment/integration/api-design.md]
---

# API Checklist — Premium Payment‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Hiểu API‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

PayGate xử lý customer, thẻ lưu, charge, subscription, refund và event; mock test chạy tại `http://localhost:4242`. MailGate gửi/tra trạng thái email giao dịch tại `http://localhost:4343`.

Hai đối tác dùng hai Bearer key riêng (`PAYGATE_KEY`, `MAILGATE_KEY`), chỉ được giữ phía server. PayGate không có webhook HMAC: app nhận thay đổi trạng thái bằng polling `GET /v1/events`; MailGate cũng cần tra trạng thái message để phát hiện `bounced`.

Endpoint in-scope: customers, payment methods, charges, subscriptions, refunds, events, templates và messages.

## 2. Fixtures‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

<!-- FIX:START -->
| Loại | Tên | Value | Ghi chú |
|---|---|---|---|
| env | PayGate mock base | `http://localhost:4242` | committed |
| env | MailGate mock base | `http://localhost:4343` | committed |
| magic token | `tok_chargeable` | — | charge thành công |
| magic token | `tok_declined` | — | → `402 card_declined` |
| magic token | `tok_insufficient` | — | → `402 insufficient_funds` |
| magic token | `tok_expired` | — | → `402 expired_card` |
| magic token | `tok_cvc_fail` | — | → `402 incorrect_cvc` |
| magic token | `tok_error` | — | → `500 processing_error` |
| plan | Premium plans | `premium_monthly`, `premium_yearly` | lần lượt 99.000đ và 990.000đ |
| known id | customer / payment method / charge | tạo từ các bước trước | dùng cho save-card, subscription, refund |
| known id | subscription | tạo subscription `active` | dùng cho cancel |
| known id | MailGate message | message có trạng thái `bounced` | fixture/seed để tra fallback |
| auth key | `PAYGATE_KEY` | `(bruno/.env)` | KHÔNG ghi value thật |
| auth key | `MAILGATE_KEY` | `(bruno/.env)` | KHÔNG ghi value thật |
| rate limit | PayGate / MailGate | `30 req / 10s / IP` | → `429 rate_limited` |
<!-- FIX:END -->

## 3. Checklist‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

<!-- ACL:START -->
| # | API | Dir | Endpoint | Dimension | Scenario | Trigger | HTTP | Expected Result | Ref | P | Auto | Conf |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 3rd:paygate | out | POST /v1/customers | Happy | Tạo customer trước khi lưu thẻ hoặc tạo thuê bao | email hợp lệ | 201 | `id` có tiền tố `cus_`; customer sẵn sàng liên kết payment method/subscription | FR-premium-payment-003; FR-premium-payment-007 | 2 | Yes | 🟢 |
| 2 | 3rd:paygate | out | POST /v1/payment_methods | Happy | Lưu thẻ mới cho customer | `customer` từ #1 + thẻ/token hợp lệ | 201 | `id` có tiền tố `pm_`; payment method gắn với customer để thanh toán thẻ đã lưu | FR-premium-payment-003 | 2 | No | 🟢 |
| 3 | 3rd:paygate | out | POST /v1/charges | Happy | Thanh toán một lần bằng thẻ mới | amount hợp lệ, currency, `source=tok_chargeable`, `Idempotency-Key` mới | 201 | `status=succeeded`; Payment được ghi nhận, Premium được kích hoạt và đủ điều kiện gửi receipt | FR-premium-payment-002; FR-premium-payment-004; BR-premium-payment-001; BR-premium-payment-005 | 1 | Yes | 🟢 |
| 4 | 3rd:paygate | out | POST /v1/charges | Validation | Thiếu trường bắt buộc khi tạo charge | bỏ `source` | 400 | `error.code=missing_field`; không tạo Payment hoặc kích hoạt Premium | FR-premium-payment-002 | 1 | Yes | 🟢 |
| 5 | 3rd:paygate | out | POST /v1/charges | Business error | Thẻ bị từ chối | `source=tok_declined` | 402 | `error.code=card_declined`; hiển thị nhánh “Thử thẻ khác”, không kích hoạt Premium | E-premium-payment-001; FR-premium-payment-005 | 1 | Yes | 🟢 |
| 6 | 3rd:paygate | out | POST /v1/charges | Business error | Thẻ không đủ số dư | `source=tok_insufficient` | 402 | `error.code=insufficient_funds`; hiển thị nhánh số dư không đủ, không kích hoạt Premium | E-premium-payment-002; FR-premium-payment-005 | 1 | Yes | 🟢 |
| 7 | 3rd:paygate | out | POST /v1/charges | Business error | Thẻ hết hạn | `source=tok_expired` | 402 | `error.code=expired_card`; yêu cầu người dùng sửa thẻ, không kích hoạt Premium | E-premium-payment-003; FR-premium-payment-005 | 1 | Yes | 🟢 |
| 8 | 3rd:paygate | out | POST /v1/charges | Business error | Sai CVC | `source=tok_cvc_fail` | 402 | `error.code=incorrect_cvc`; yêu cầu nhập lại CVC, không kích hoạt Premium | E-premium-payment-004; FR-premium-payment-005 | 1 | Yes | 🟢 |
| 9 | 3rd:paygate | out | POST /v1/charges | Business error | PayGate gặp lỗi xử lý tạm thời | `source=tok_error` | 500 | `error.code=processing_error`; app thực hiện retry an toàn, chưa báo thành công hoặc kích hoạt Premium | E-premium-payment-005; FR-premium-payment-005 | 1 | Yes | 🟢 |
| 10 | 3rd:paygate | out | POST /v1/charges | Idempotency | Gọi lặp cùng `Idempotency-Key` và cùng body | gửi 2 request cùng key của #3 | 201 | Không tạo charge/Payment trùng; hai lần gọi tham chiếu cùng kết quả charge | NFR-premium-payment-003 | 1 | No | 🟡 |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| 11 | 3rd:paygate | out | POST /v1/charges | Rate-limit | Vượt ngưỡng request PayGate | gửi hơn 30 request trong 10 giây/IP | 429 | `error.code=rate_limited`; app lập lịch retry backoff, không báo lỗi cứng ngay cho user | E-premium-payment-006; NFR-premium-payment-002 | 2 | No | 🟡 |
| 12 | 3rd:paygate | out | POST /v1/charges | Auth | Khóa PayGate rỗng hoặc sai | thay `PAYGATE_KEY` bằng key không hợp lệ | 401 | `error.code=unauthorized`; không tạo charge, không lộ lỗi cấu hình cho user và có cảnh báo dev | E-premium-payment-007; NFR-premium-payment-004 | 2 | No | 🟡 |
| 13 | 3rd:paygate | out | GET /v1/charges?limit&starting_after | Pagination | Xem lịch sử giao dịch qua cursor | `limit` hợp lệ và `starting_after` của charge trang trước | 200 | Danh sách charge theo cursor; không lặp item giữa các trang và dùng được cho lịch sử giao dịch | FR-premium-payment-010 | 2 | Yes | 🟢 |
| 14 | 3rd:paygate | out | GET /v1/charges/{id} | Not-found | Tra charge không tồn tại | `id=ch_missing` | 404 | `error.code=resource_missing`; app hiển thị không tìm thấy giao dịch, không đổi trạng thái Payment | FR-premium-payment-010 | 2 | Yes | 🟢 |
| 15 | 3rd:paygate | out | POST /v1/subscriptions | Happy | Tạo thuê bao Premium định kỳ | `customer` từ #1 + `plan=premium_monthly` hoặc `premium_yearly` | 201 | `status=active`; subscription có `sub_` và kỳ gia hạn để hiển thị/quản lý | FR-premium-payment-007; BR-premium-payment-004 | 2 | No | 🟢 |
| 16 | 3rd:paygate | out | POST /v1/subscriptions | Validation | Tạo thuê bao với plan không hợp lệ | `customer` hợp lệ + `plan=invalid_plan` | 400 | `error.code=invalid_plan`; không tạo subscription | FR-premium-payment-007; BR-premium-payment-004 | 2 | Yes | 🟢 |
| 17 | 3rd:paygate | out | POST /v1/subscriptions/{id}/cancel | Happy | Hủy thuê bao đang active | `id` từ #15 | 200 | `status=canceled`; trạng thái thuê bao cục bộ được cập nhật để hiển thị kỳ gia hạn/hủy | FR-premium-payment-011 | 2 | No | 🟢 |
| 18 | 3rd:paygate | out | POST /v1/refunds | Happy | Hoàn tiền charge đã thành công | `charge` succeeded từ #3 | 201 | `id` có tiền tố `re_`; charge chuyển `status=refunded`, không hoàn charge failed/đã refunded | FR-premium-payment-012; BR-premium-payment-003 | 3 | No | 🟢 |
| 19 | 3rd:paygate | in | GET /v1/events?type | Inbound-polling | Poll event PayGate thay cho webhook | có event charge/subscription mới; poll lần 1 rồi poll lần 2 với cursor đã lưu | 200 | Event mới được xử lý một lần; cursor cuối được lưu, không bỏ sót/lặp event và cập nhật trạng thái Premium/subscription | FR-premium-payment-004; FR-premium-payment-008; NFR-premium-payment-005 | 1 | No | 🟢 |
| 20 | 3rd:mailgate | out | GET /v1/templates | Happy | Kiểm tra template receipt trước khi gửi | gọi với `MAILGATE_KEY` hợp lệ | 200 | Danh sách có `receipt` cùng biến `customer_name`, `amount`, `charge_id` | FR-premium-payment-006; BR-premium-payment-005 | 2 | Yes | 🟢 |
| 21 | 3rd:mailgate | out | POST /v1/messages | Happy | Gửi biên nhận sau charge succeeded | `to` hợp lệ, `template=receipt`, variables đủ từ charge #3 | 201 | `id` có tiền tố `msg_`, `status=queued`; EmailMessage được ghi nhận sau và chỉ sau charge succeeded | FR-premium-payment-006; BR-premium-payment-005 | 1 | Yes | 🟢 |
| 22 | 3rd:mailgate | out | POST /v1/messages | Validation | Email người nhận sai định dạng | `to=invalid-email`, template hợp lệ | 400 | `error.code=invalid_email`; không tạo EmailMessage gửi đi | E-premium-payment-009 | 2 | Yes | 🟢 |
| 23 | 3rd:mailgate | out | POST /v1/messages | Auth | Khóa MailGate rỗng hoặc sai | thay `MAILGATE_KEY` bằng key không hợp lệ | 401 | `error.code=unauthorized`; không gửi email, không lộ lỗi cấu hình cho user và có cảnh báo dev | E-premium-payment-007; NFR-premium-payment-004 | 2 | No | 🟡 |
| 24 | 3rd:mailgate | out | POST /v1/messages | Rate-limit | Vượt ngưỡng gửi email | gửi hơn 30 request trong 10 giây/IP | 429 | `error.code=rate_limited`; app backoff/retry thay vì coi biên nhận thất bại ngay | E-premium-payment-006; NFR-premium-payment-002 | 3 | No | 🟡 |
| 25 | 3rd:mailgate | in | GET /v1/messages/{id} | Inbound-polling | Tra message đã bị trả về | `id` của fixture message có `status=bounced` | 200 | `status=bounced`; app giữ biên nhận hiển thị trong app làm fallback, không coi email đã giao thành công | E-premium-payment-008; FR-premium-payment-006 | 2 | No | 🟡 |
<!-- ACL:END -->

## 4. Coverage matrix‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Endpoint | Happy | Validation | Business error | Auth | Not-found | Idempotency | Rate-limit | Pagination | Inbound-polling |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| POST /v1/customers | 1 | — | — | — | — | — | — | — | — |
| POST /v1/payment_methods | 1 | — | — | — | — | — | — | — | — |
| POST /v1/charges | 1 | 1 | 5 | 1 | — | 1 | 1 | — | — |
| GET /v1/charges?limit&starting_after | — | — | — | — | — | — | — | 1 | — |
| GET /v1/charges/{id} | — | — | — | — | 1 | — | — | — | — |
| POST /v1/subscriptions | 1 | 1 | — | — | — | — | — | — | — |
| POST /v1/subscriptions/{id}/cancel | 1 | — | — | — | — | — | — | — | — |
| POST /v1/refunds | 1 | — | — | — | — | — | — | — | — |
| GET /v1/events?type | — | — | — | — | — | — | — | — | 1 |
| GET /v1/templates | 1 | — | — | — | — | — | — | — | — |
| POST /v1/messages | 1 | 1 | — | 1 | — | — | 1 | — | — |
| GET /v1/messages/{id} | — | — | — | — | — | — | — | — | 1 |

## 5. Câu hỏi mở

* [ ] OQ: PayGate xử lý chính xác response của request lặp cùng `Idempotency-Key` thế nào (cùng HTTP/body hay trả dấu hiệu replay riêng)?
* [ ] OQ: Chính sách retry/backoff cụ thể cho `429 rate_limited` và `500 processing_error` là bao nhiêu lần, khoảng chờ thế nào?
* [ ] OQ: Mock MailGate cung cấp fixture hoặc thao tác nào để tạo deterministically một message `bounced`?
* [ ] OQ: Khi MailGate `bounced`, ngoài hiển thị biên nhận trong app có gửi lại email hoặc thông báo người dùng không?
* [ ] OQ: Cơ chế xoay `PAYGATE_KEY` và `MAILGATE_KEY` ở production là gì?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍



<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
