---
type: api-map
feature: premium-payment
status: stale
updated: 2026-07-15
links: [docs/premium-payment/integration/api-summary-paygate.md, docs/premium-payment/integration/api-summary-mailgate.md, docs/premium-payment/integration/api-design.md, docs/premium-payment/srs/premium-payment-erd.md, docs/premium-payment/ascii-wireframe/premium-payment-wireframe-index.md]
---

> __Hội tụ:__ field-map này là 1 phần của Integration Blueprint — xem [[docs/premium-payment/integration/api-design.md|api-design.md]] cho orchestration/state/reconciliation (`api-integration.md` Mục 2).

# API Map — PayGate + MailGate ↔ System ↔ UI‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Bảng truy vết field 3 tầng. Cột "UI field" là input cho `/wireframe`. Đã đồng bộ với 6 màn trong `ascii-wireframe/`.

## 1. Charge ↔ Payment ↔ UI‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| API field | System (entity.attr) | UI field (màn hình) | Biến đổi / validation | Ghi chú |
|---|---|---|---|---|
| `charge.id` | Payment.id | Mã giao dịch (payment-result, transaction-history, refund-request) | nguyên | tra cứu / hỗ trợ |
| `charge.status` | Payment.status | Badge trạng thái | succeeded→"Đã kích hoạt"; failed→"Thất bại"; refunded→"Đã hoàn tiền"; pending→"Đang xử lý" | quyết định state UI |
| `charge.amount` | Payment.amount | "Số tiền" | định dạng nghìn → "99.000đ", KHÔNG chia 100 | VND |
| `charge.failure_code` | Payment.failure_code | Thông báo lỗi (payment-result, payment-method) | map sang câu tiếng Việt (xem Mục 4) | chỉ khi failed; phân biệt với `error.code` của response lỗi |
| `charge.created` | Payment.created | "Thời gian" | unix → giờ địa phương | |

__Tra trạng thái lẻ:__ `GET /v1/charges/{id}` dùng ở `transaction-history` (bấm 1 dòng) và `refund-request` (hiển thị giao dịch cần hoàn).

## 2. Danh sách giao dịch (phân trang) ↔ transaction-history‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| API field | System | UI field (màn hình) | Biến đổi / validation | Ghi chú |
|---|---|---|---|---|
| `list.data[]` | Payment[] | Mỗi charge 1 dòng (transaction-history) | render ngày + tên gói + số tiền + badge | nguồn `GET /v1/charges?limit&starting_after` |
| `list.has_more` | — | Nút "Tải thêm" | true → hiện nút; false → ẩn | |
| `starting_after` (input) | — | — | id charge cuối của trang → load tiếp | phân trang cursor |

## 3. Subscription ↔ Customer ↔ UI‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| API field / action | System | UI field (màn hình) | Biến đổi | Ghi chú |
|---|---|---|---|---|
| `subscription.plan` | Subscription.plan | Tên gói (subscription-manage, plan-selection) | premium_monthly→"Gói tháng"; premium_yearly→"Gói năm" | app tự dịch mã→tên (gap 2) |
| `subscription.status` | Subscription.status | Trạng thái gói | active→"Đang hoạt động"; past_due→"Cần thanh toán"; canceled→"Đã hủy" | |
| `subscription.current_period_end` | Subscription.current_period_end | "Gia hạn vào" | unix → ngày | |
| event `charge.failed` | — | Cảnh báo `past_due` (subscription-manage) | hiện khi kỳ thanh toán fail; nhắc cập nhật thẻ trước hạ cấp (3 ngày — BR-002) | nguồn từ polling `GET /v1/events` |
| action `POST /v1/subscriptions/{id}/cancel` | Subscription.status→canceled | Nút "Hủy gói" (subscription-manage) | xác nhận trước khi hủy | |
| `customer.id` / `payment_method.brand` / `payment_method.last4` | Customer.id / PaymentMethod.brand / .last4 | "Visa •••• 4242" (payment-method) | hiện brand + 4 số cuối | KHÔNG hiện full số thẻ |

## 4. Refund ↔ refund-request‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| API field / action | System | UI field (màn hình) | Biến đổi / validation | Ghi chú |
|---|---|---|---|---|
| `charge.id` (input) | Payment.id | "Giao dịch" cần hoàn (refund-request) | lấy từ `GET /v1/charges/{id}` | id/amount/ngày/trạng thái |
| `charge.status` | Payment.status | Điều kiện hoàn | **chỉ cho hoàn khi `succeeded`** (BR-003); `failed`/`refunded` → khóa nút | |
| action `POST /v1/refunds {charge}` | Refund (re_) | Nút "Xác nhận hoàn tiền" | thành công → cập nhật "Đã hoàn tiền" | |
| `refund.status` | Refund.status | Thông báo "Đã hoàn tiền" | refunded → charge.status sang `refunded` | thu hồi Premium (xem gap 6 + OQ-4) |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 5. Mapping lỗi (Error code → UI)

| Mã (đối tác) | UI xử lý | Màn hình | Error Matrix |
|---|---|---|---|
| `card_declined` (402) | "Thẻ bị từ chối" + thử thẻ khác | payment-result | E-001 |
| `insufficient_funds` (402) | "Số dư không đủ" | payment-result | E-002 |
| `expired_card` (402) | "Thẻ đã hết hạn" + sửa thẻ | payment-method | E-003 |
| `incorrect_cvc` (402) | "Sai mã CVC" | payment-method | E-004 |
| `processing_error` (500) | "Hệ thống bận, thử lại" + auto retry | payment-result | E-005 |
| `rate_limited` (429) | retry ngầm, không hiện user | — | E-006 |
| `resource_missing` (404) | "Không tìm thấy giao dịch" | refund-request, transaction-history | E-007 (cần xác nhận SRS) |
| MailGate `bounced` | hiện biên nhận trong app (fallback) | payment-result | E-008 |
| `invalid_email` (400) | validate email trước khi gửi | (nội bộ gửi mail) | E-009 |
| `charge_not_refundable` (400) | "Giao dịch không thể hoàn" | refund-request | E-010 (cần xác nhận SRS) ⚠️ __chưa có trong api-summary-paygate__ (gap 5) |
| `invalid_plan` (400) | chỉ cho chọn plan hợp lệ trong UI | plan-selection | — (config) |
| `missing_field` / `invalid_json` / `unauthorized` (400/401) | lỗi cấu hình client → KHÔNG hiện user | — | — |

## 6. Email (MailGate) ↔ EmailMessage

| API field | System | UI / hành vi | Ghi chú |
|---|---|---|---|
| `message.id` | EmailMessage.id | — | đối soát |
| `message.status` | EmailMessage.status | (nội bộ) "đã gửi biên nhận" | delivered/bounced quyết định fallback |
| `message.template` | EmailMessage.template | — | receipt/payment_failed/welcome_premium |

## 7. Gap phát hiện

1. **`charge.paid` thừa** — trùng `status`, không map UI.
2. __Thiếu nguồn "tên gói" hiển thị__ — API trả `plan` dạng mã (`premium_monthly`); app cần bảng dịch sang tên + giá hiển thị (app tự giữ, không từ API). Áp ở plan-selection + subscription-manage.
3. __MailGate bounce chưa có cơ chế gửi lại__ — cần quyết định nghiệp vụ (OQ api-summary-mailgate).
4. __Lịch sử hóa đơn từng kỳ__ — màn subscription-manage muốn hiện hóa đơn mỗi kỳ, nhưng PayGate chỉ có charges (lọc theo subscription qua app, không có endpoint invoices).
5. **⚠️ `charge_not_refundable` (400) chưa tài liệu hoá** — màn refund-request dùng mã này nhưng error catalog `api-summary-paygate.md` Mục 4 KHÔNG có. Cần: bổ sung vào api-summary + Error Matrix SRS, hoặc xác nhận tên mã thật với PayGate (OQ-3).
6. __⚠️ Thu hồi Premium sau refund chưa rõ trigger__ — refund-request ghi "Premium sẽ bị thu hồi", nhưng chưa xác định app revoke entitlement qua đâu: event `charge.refunded` (polling) hay tức thì sau `POST /v1/refunds`? (OQ-4).

## 8. Câu hỏi mở

* [ ] OQ-1: Hiển thị tên gói + giá lấy từ bảng cứng phía app hay config? (gap 2)
* [ ] OQ-2: Bounce email → gửi lại tự động hay thông báo trong app? (gap 3)
* [ ] OQ-3: `charge_not_refundable` có phải tên mã lỗi thật của PayGate? Bổ sung api-summary + Error Matrix? (gap 5)
* [ ] OQ-4: Sau refund, thu hồi Premium qua event `charge.refunded` (polling) hay ngay sau response refunds? (gap 6)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
