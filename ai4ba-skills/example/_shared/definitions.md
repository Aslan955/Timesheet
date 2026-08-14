---
type: shared-definitions
status: draft
owner: "@ba"
created: 2026-05-09
updated: 2026-06-27
changelog:
  - 2026-06-27 | /update-overview | [definitions] added 4 terms: Subscription, Charge, Refund, Lockout
  - 2026-06-24 | /update-overview | [definitions] extracted 12 terms: Learner, PayGate, MailGate, SRS, Flashcard, mức nhớ, CEFR, Premium, Session, OAuth, Onboarding, Deck
  - 2026-05-09 | manual | initial stub
---

# Definitions / Glossary‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Thuật ngữ nghiệp vụ dùng chung toàn dự án. Term mới gặp ở doc nào → thêm vào đây.

## Glossary‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Learner (Người học)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
Người dùng cuối của app — học/ôn tiếng Anh. Là persona chính. Thay cho "User" (dùng "Learner" thống nhất).
**Appears in:** authentication, payment, premium-payment, vocabulary-flashcard
**Aliases:** User, Student (tránh dùng)

### Admin‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
Người dùng có quyền nâng cao (quản trị). Phân biệt với Learner.

### Premium‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
Gói trả phí mở khóa tính năng nâng cao — mua một lần hoặc thuê bao tháng/năm.
**Appears in:** payment, premium-payment, group, vocabulary-flashcard

### PayGate
Cổng thanh toán đối tác (mô hình kiểu Stripe: customers/cards/charges/subscriptions/refunds). App uỷ thác toàn bộ thu thẻ + thuê bao tự gia hạn cho PayGate. Không dùng Sepay/Stripe.
**Appears in:** payment, premium-payment

### MailGate
Dịch vụ gửi email đối tác — biên nhận thanh toán, cảnh báo, email hệ thống.
**Appears in:** payment, premium-payment

### Session (Phiên đăng nhập)
Phiên một thiết bị đã đăng nhập. Không giới hạn số thiết bị, không tự hết hạn. Đặt lại mật khẩu thu hồi mọi phiên (BR-authentication-008); đăng xuất chỉ tác động thiết bị hiện tại.
**Appears in:** authentication, vocabulary-flashcard

### OAuth (Đăng nhập Google)
Đăng nhập bằng tài khoản bên thứ ba (Google). Tự liên kết với tài khoản email trùng (account linking).
**Appears in:** authentication

### Onboarding
Màn thiết lập hiển thị sau khi Learner đăng nhập lần đầu, trước khi vào app chính.
**Appears in:** authentication, vocabulary-flashcard

### Flashcard / Card (Thẻ)
Thẻ lật từ vựng. Vòng đời trạng thái: `learning → review → mastered` theo lịch ôn.
**Appears in:** vocabulary-flashcard, group‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Deck (Bộ thẻ)
Bộ thẻ từ vựng. System deck (do hệ thống cung cấp, Learner clone được) và user deck (tự tạo hoặc import từ file JSON).
**Appears in:** vocabulary-flashcard

### SRS / Spaced Repetition (Lặp lại ngắt quãng)
Thuật toán xếp lịch ôn: hệ thống tự tính interval và sắp thẻ cần ôn theo ngày, dựa trên mức nhớ Learner tự đánh giá.
**Appears in:** vocabulary-flashcard

### Mức nhớ: Nhớ rõ / Nhớ mờ / Chưa nhớ
3 bậc Learner tự chấm sau mỗi lần ôn thẻ:
* **Nhớ rõ** — interval tăng; đạt 7 ngày liên tục → chuyển `review`, ≥30 ngày → `mastered`.
* **Nhớ mờ** — interval hiện tại × 1.5 (tối thiểu 1 ngày).
* **Chưa nhớ** — reset về hôm nay (ôn lại ngay/sáng sớm mai), hạ trạng thái về `learning`.
**Appears in:** vocabulary-flashcard

### CEFR
Khung tham chiếu trình độ tiếng Anh A1–C2. Deck hệ thống phân loại theo mức này (A1–B2 ở MVP).
**Appears in:** vocabulary-flashcard

### Subscription (Thuê bao)
Gói Premium trả phí định kỳ tự gia hạn (tháng/năm) qua PayGate. Khi một lần thu (Charge) của thuê bao thất bại → gửi email cảnh báo, sau 3 ngày hạ về Free. Learner xem kỳ gia hạn + hủy bất cứ lúc nào.
**Appears in:** premium-payment
**Related:** [[docs/_shared/definitions.md#Premium]], [[docs/_shared/definitions.md#Charge]]

### Charge (Lần thu thẻ)
Một lần thu tiền qua thẻ trên PayGate — mua Premium một lần hoặc kỳ gia hạn của thuê bao. Charge `succeeded` thì kích hoạt Premium; `failed` thì hiện màn lỗi theo từng loại lỗi thẻ.
**Appears in:** premium-payment

### Refund (Hoàn tiền)
Trả lại tiền của một Charge đã thu qua PayGate. Đây là tính năng mức ưu tiên thấp (P2).
**Appears in:** premium-payment

### Lockout (Khóa tạm tài khoản)
Cơ chế chống dò mật khẩu: sau ≥5 lần đăng nhập sai, tài khoản bị khóa tạm thời, Learner phải chờ trước khi thử lại. Khác với account `locked` vĩnh viễn do Admin.
**Appears in:** authentication‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
