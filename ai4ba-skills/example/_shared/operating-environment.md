---
type: shared-environment
status: draft
owner: "@ba"
created: 2026-05-09
updated: 2026-06-27
changelog:
  - 2026-06-27 | /update-overview | [env] rewrote from authentication + premium-payment + vocabulary-flashcard docs
  - 2026-05-09 | manual | initial stub
---

# Operating Environment‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Môi trường vận hành dùng chung toàn dự án — app học tiếng Anh __english-ai-demo__. Cập nhật khi đổi nền tảng đích, đối tác tích hợp hoặc phạm vi ngôn ngữ.

## Nền tảng đích‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* __Web responsive__ (desktop + mobile), một codebase phục vụ cả 2.
* Mobile breakpoint nhỏ nhất __375px__ (iPhone SE). Test 2 viewport phổ biến: __375×667__ và __414×896__.
* Tablet: chưa cam kết riêng (responsive web tự co giãn).

## Trình duyệt hỗ trợ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* Chrome, Safari, Firefox, Edge — __2 phiên bản major mới nhất__.
* Mobile: __iOS Safari__ + __Android Chrome__.

## Lưu ý mobile (rút từ test suite authentication)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* Font input __≥16px__ để tránh iOS auto-zoom khi focus.
* Touch target __≥44px__ (nút, link).
* Bàn phím mobile __không che__ field đang focus (auto-scroll khi focus).
* Mọi form __không scroll ngang__ ở viewport mobile.

## Người dùng & ngôn ngữ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* Người dùng chính: __Learner__ học/ôn tiếng Anh (xem [[docs/_shared/definitions.md#Learner-Người-học]]).‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
* Giao diện __tiếng Việt mặc định__. Toàn bộ wording lỗi/thành công/thông tin bằng tiếng Việt (NFR-authentication-005).

## Đối tác tích hợp ngoài

| Đối tác | Vai trò |
|---------|---------|
| __PayGate__ | Thu thẻ một lần (Charge), thuê bao tự gia hạn (Subscription), hoàn tiền (Refund), polling events |
| __MailGate__ | Email giao dịch: biên nhận, cảnh báo thanh toán thất bại, email xác nhận |
| __Google OAuth__ | Đăng nhập/đăng ký bằng tài khoản Google + auto-link theo email |

## Giả định mạng & phiên

* __Online-first.__
* Đăng nhập __đa thiết bị__, không giới hạn số phiên, phiên __không tự hết hạn__.
* Đặt lại mật khẩu thu hồi mọi phiên (BR-authentication-008); đăng xuất chỉ tác động thiết bị hiện tại.

## Bảo mật vận hành

* Khóa đối tác (PayGate/MailGate) lưu ở __secret store phía server__ — KHÔNG nhúng client, KHÔNG log (NFR-premium-payment-004).
* Mật khẩu lưu dạng hash, không bao giờ log plaintext; audit log mọi sự kiện auto-link social (NFR-authentication-001).‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
