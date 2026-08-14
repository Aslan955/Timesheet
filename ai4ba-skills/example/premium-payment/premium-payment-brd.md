---
type: brd
feature: premium-payment
status: draft
updated: 2026-05-26
links: [docs/premium-payment/premium-payment-urd.md, docs/premium-payment/premium-payment-prd.md]
---

# BRD — Thanh toán & gói Premium‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Vấn đề kinh doanh‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

English app có lượng người dùng Free lớn nhưng tỉ lệ chuyển đổi sang trả phí thấp, một phần do chưa có luồng thanh toán mượt + thiếu thuê bao tự gia hạn (mất doanh thu lặp lại).

## 2. Mục tiêu (SMART)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| ID | Mục tiêu | Đo bằng |
|---|---|---|
| BO-premium-payment-01 | Tăng tỉ lệ chuyển đổi Free→Premium lên 5% trong Q3 | funnel chọn gói → thanh toán thành công |
| BO-premium-payment-02 | 40% doanh thu Premium đến từ thuê bao tự gia hạn sau 6 tháng | tỉ trọng subscription vs one-time |
| BO-premium-payment-03 | Tỉ lệ thanh toán thất bại do lỗi UX < 2% | đếm lỗi 4xx phía app (không tính card_declined) |

## 3. Phạm vi‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Trong phạm vi:__ chọn gói, thanh toán 1 lần + thuê bao, lưu thẻ, kết quả + email biên nhận, lịch sử giao dịch, quản lý/hủy thuê bao, hoàn tiền cơ bản, xử lý sự kiện gia hạn/thất bại từ PayGate.

__Ngoài phạm vi:__ nhiều loại tiền tệ (chỉ VND), ví điện tử nội địa (giai đoạn sau), phân tích doanh thu nâng cao.

## 4. Stakeholders‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Vai trò | Quan tâm |
|---|---|
| Product Owner | Tỉ lệ chuyển đổi, doanh thu lặp lại |
| Tài chính/Kế toán | Đối soát giao dịch, hoàn tiền |
| CSKH | Tra cứu, xử lý khiếu nại thanh toán |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| Pháp lý | Điều khoản thuê bao, chính sách hoàn tiền |

## 5. ROI (ước lượng)

* Chi phí: phí cổng PayGate theo % giao dịch + phí MailGate theo email. Công xây dựng ~1 sprint.
* Lợi ích: doanh thu lặp lại từ thuê bao + tăng chuyển đổi nhờ UX tốt.

## 6. Rủi ro

| Rủi ro | Mức | Giảm thiểu |
|---|---|---|
| Phụ thuộc đối tác (PayGate/MailGate downtime) | cao | retry/backoff, polling sự kiện, hàng đợi gửi lại email |
| Thu trùng khi mạng chập chờn | trung bình | dùng Idempotency-Key |
| Email biên nhận không tới (bounce) | trung bình | tra trạng thái giao, fallback hiển thị trong app |
| Tranh chấp hoàn tiền | trung bình | log giao dịch + chính sách rõ |

## 7. Mốc thời gian

* Q3: ra mắt thanh toán 1 lần + thuê bao tháng.
* Q4: thuê bao năm + hoàn tiền pro-rate (tuỳ OQ-2 URD).

## 8. Câu hỏi mở

* [ ] OQ-1: Phí cổng PayGate cụ thể bao nhiêu %? (ảnh hưởng ROI)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
