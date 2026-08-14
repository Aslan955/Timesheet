---
type: prd
feature: premium-payment
status: draft
updated: 2026-05-26
links: [docs/premium-payment/premium-payment-urd.md, docs/premium-payment/premium-payment-brd.md, docs/premium-payment/srs/premium-payment-spec.md]
---

# PRD — Thanh toán & gói Premium‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Tổng quan‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cho phép người học mua Premium (1 lần hoặc thuê bao) qua PayGate, nhận email giao dịch qua MailGate, quản lý gói và xem lịch sử.

## 2. Mục tiêu / Non-goals‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Mục tiêu:__ luồng thanh toán mượt, kích hoạt tức thì, minh bạch lỗi, doanh thu lặp lại từ thuê bao.

__Non-goals:__ đa tiền tệ; cổng thanh toán nội địa (Momo/VNPay) — giai đoạn sau; phân tích doanh thu.

## 3. Personas‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Xem URD Mục 2 (Free user, Premium user, CSKH).

## 4. Capabilities‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| ID | Capability | Ưu tiên |
|---|---|---|
| CAP-premium-payment-01 | Chọn gói (one-time / thuê bao tháng / năm) | P0 |
| CAP-premium-payment-02 | Thanh toán bằng thẻ mới qua PayGate | P0 |
| CAP-premium-payment-03 | Màn kết quả + kích hoạt Premium + email biên nhận | P0 |
| CAP-premium-payment-04 | Xử lý lỗi thẻ (declined/insufficient/expired/cvc) | P0 |
| CAP-premium-payment-05 | Lưu thẻ + thanh toán bằng thẻ đã lưu | P1 |
| CAP-premium-payment-06 | Thuê bao tự gia hạn + xử lý sự kiện gia hạn/thất bại | P1 |
| CAP-premium-payment-07 | Lịch sử giao dịch + tra trạng thái | P1 |
| CAP-premium-payment-08 | Quản lý/hủy thuê bao | P1 |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| CAP-premium-payment-09 | Hoàn tiền | P2 |

## 5. User flows

1. __Mua 1 lần:__ chọn gói → nhập thẻ → thanh toán → kết quả → email biên nhận.
2. __Thuê bao:__ chọn gói định kỳ → lưu thẻ → tạo subscription → kích hoạt → email chào mừng.
3. __Gia hạn (async):__ PayGate sinh sự kiện gia hạn → app polling `/v1/events` → cập nhật kỳ → email.
4. __Gia hạn thất bại:__ sự kiện `charge.failed` → email cảnh báo → sau 3 ngày hạ cấp.
5. __Hoàn tiền:__ CSKH/user yêu cầu → app gọi refund → cập nhật trạng thái.

## 6. Release plan

- P0 → MVP Q3 (one-time + xử lý lỗi + email biên nhận).
- P1 → thuê bao + thẻ đã lưu + lịch sử + quản lý gói.
- P2 → hoàn tiền nâng cao.

## 7. Metrics

Bám theo BO-premium-payment-01/02/03 trong BRD.

## 8. Dependencies

- __PayGate__ (cổng thanh toán) — bắt buộc.
- __MailGate__ (email giao dịch) — bắt buộc cho biên nhận/cảnh báo.

## 9. Câu hỏi mở

- [ ] OQ-1: Màn quản lý thuê bao hiển thị lịch sử hóa đơn từng kỳ hay chỉ kỳ hiện tại?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
