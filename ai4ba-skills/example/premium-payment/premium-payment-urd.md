---
type: urd
feature: premium-payment
status: draft
updated: 2026-05-26
links: [docs/premium-payment/premium-payment-brd.md, docs/premium-payment/premium-payment-prd.md]
---

# URD — Thanh toán & gói Premium‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Người học nâng cấp lên Premium của English app, thanh toán qua cổng đối tác **PayGate**; email biên nhận/thông báo gửi qua **MailGate**. Hỗ trợ mua 1 lần lẫn thuê bao định kỳ.

## 1. Bối cảnh‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

English app có gói Free và Premium (mở khóa bài nâng cao, chấm phát âm không giới hạn, lộ trình cá nhân hóa). Doanh thu Premium đến từ 2 hình thức: mua 1 tháng lẻ hoặc đăng ký thuê bao tự gia hạn (tháng/năm). App không tự xử lý thẻ — uỷ thác cho **PayGate**; mọi email giao dịch gửi qua **MailGate**.

## 2. Người dùng‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Persona | Mô tả | Nhu cầu chính |
|---|---|---|
| Người học Free | Đang dùng bản miễn phí | Nâng cấp nhanh, thấy rõ quyền lợi + kết quả thanh toán |
| Người học Premium | Đã mua | Quản lý gói, gia hạn/hủy, xem lịch sử, yêu cầu hoàn tiền |
| CSKH | Hỗ trợ khách | Tra giao dịch, xử lý hoàn tiền, kiểm tra email đã gửi |

## 3. Nhu cầu người dùng‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

1) Chọn gói (1 tháng / thuê bao tháng / thuê bao năm) và thấy giá rõ ràng.
2) Thanh toán nhanh; nếu đã lưu thẻ thì không nhập lại.
3) Thanh toán xong được kích hoạt Premium ngay + nhận email biên nhận.
4) Khi thẻ bị từ chối, hiểu lý do (hết hạn / không đủ tiền / sai CVC) và biết cách xử lý.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
5) Xem lịch sử giao dịch, tra trạng thái một thanh toán.
6) Quản lý thuê bao: xem ngày gia hạn, hủy gói.
7) Yêu cầu hoàn tiền khi đủ điều kiện.

## 4. Hành trình chính‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

1) Free user → màn chọn gói → nhập/chọn thẻ → thanh toán → màn kết quả (kích hoạt) → nhận email biên nhận.
2) Thuê bao tới kỳ → PayGate tự thu → app nhận sự kiện → gửi email; nếu thất bại → email cảnh báo + hạ cấp sau X ngày.

## 5. Tiêu chí thành công

* Thanh toán thành công kích hoạt Premium trong vài giây.
* Mọi lỗi từ đối tác đều có thông báo nghiệp vụ rõ trên màn hình.
* Email biên nhận/cảnh báo giao đúng người, tra được trạng thái giao.

## 6. Câu hỏi mở

* [ ] OQ-1: Sau bao nhiêu ngày thanh toán định kỳ thất bại thì hạ cấp về Free? (đề xuất 3 ngày)
* [ ] OQ-2: Có cho hoàn tiền theo tỉ lệ (pro-rate) khi hủy giữa kỳ không?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
