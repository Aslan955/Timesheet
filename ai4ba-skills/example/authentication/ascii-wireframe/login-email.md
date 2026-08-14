# Flow: Đăng nhập email + password‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Màn hình thuộc flow này: login. Flow tổng xem `../srs/authentication-userflow.md` Mục 1. Screen `login` cũng được dùng chung bởi flow `google-oauth` (nhánh nghiệp vụ OAuth mô tả ở element "Đăng nhập với Google"). Device: desktop 1024, form căn giữa trong box hẹp ~400px.

---

## Screen: login — Đăng nhập tài khoản‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Wireframe (ASCII)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```text
+----------------------------------------------------------------------+
|  english-ai-demo                                                     |
|                                                                      |
|                  +----------------------------------+                |
|                  |        Dang nhap tai khoan        |               |
|                  |                                   |               |
|                  |  Email                            |               |
|                  |  +-----------------------------+  |               |
|                  |  | ban@email.com               |  |               |
|                  |  +-----------------------------+  |               |
|                  |                                   |               |
|                  |  Mat khau                         |               |
|                  |  +-----------------------+-----+  |               |
|                  |  | ........              | Hien|  |               |
|                  |  +-----------------------+-----+  |               |
|                  |                                   |               |
|                  |  [ ] Ghi nho dang nhap  Quen MK?  |               |
|                  |                                   |               |
|                  |  [ captcha - hien sau 3 lan sai ] |               |
|                  |                                   |               |
|                  |  +-----------------------------+  |               |
|                  |  |          Dang nhap          |  |               |
|                  |  +-----------------------------+  |               |
|                  |                                   |               |
|                  |  ----------  hoac  ------------   |               |
|                  |                                   |               |
|                  |  +-----------------------------+  |               |
|                  |  |  (G)  Dang nhap voi Google  |  |               |
|                  |  +-----------------------------+  |               |
|                  |                                   |               |
|                  |  Chua co tai khoan?  Dang ky      |               |
|                  +----------------------------------+                |
+----------------------------------------------------------------------+
```

### Screen description‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| # | Items | Control type | Data type | Description |
|---|-------|--------------|-----------|-------------|
| 1 | Email | Textbox | Text (email) | • **Mục đích**: định danh tài khoản đăng nhập (email là định danh duy nhất, BR-authentication-002).<br>• **Validation**: bắt buộc; kiểm định dạng email cơ bản. KHÔNG kiểm sự tồn tại của email tại đây (chống account enumeration, NFR-authentication-007).<br>• **States**: default rỗng + auto-focus khi tải; error viền đỏ nếu định dạng sai.<br>• **Placeholder** "ban@email.com".<br>• **Security**: không gợi ý/autocomplete lộ email đã đăng ký. |
| 2 | Mật khẩu | Textbox (password) | Text | • **Mục đích**: xác thực chủ tài khoản.<br>• **Validation**: bắt buộc. Login KHÔNG validate chính sách mật khẩu (8-20/hoa/thường/đặc biệt) — chỉ so khớp với mật khẩu đã lưu; policy chỉ áp ở signup/reset (FR-003).<br>• **States**: masked mặc định, nút "Hiện/Ẩn" toggle hiển thị.<br>• **Security**: mật khẩu không lưu plaintext, không ghi log (NFR-authentication-003). |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| 3 | Ghi nhớ đăng nhập | Checkbox | Boolean | • **Mục đích**: giữ phiên lâu cho người dùng đa thiết bị (FR-authentication-011, NFR-006).<br>• **Default OFF** (mặc định remember-me tắt).<br>• **Navigation/hệ quả**: tick → phiên giữ 30 ngày trên thiết bị đó; không tick → phiên phiên-làm-việc thường. |
| 4 | Quên mật khẩu? | Link | Navigate | • **Mục đích**: lối vào khôi phục mật khẩu.<br>• **Navigation**: sang màn `forgot-password`. |
| 5 | Captcha | Banner/Widget | ReadOnly (challenge) | • **Mục đích**: chống dò mật khẩu bằng thử lặp (NFR-authentication-005).<br>• **Display rule**: chỉ hiện khi tài khoản có ≥3 lần đăng nhập sai liên tiếp (FR-025, BR-authentication-006).<br>• **Validation khi hiện**: bắt buộc pass captcha mới cho submit.<br>• **States**: ẩn (fail 0-2) / hiện (fail ≥3). |
| 6 | Đăng nhập | Button (Primary) | Click/Submit | • **Mục đích**: gửi thông tin đăng nhập, tạo phiên nếu hợp lệ (FR-authentication-008).<br>• **Validation**: disabled khi email/mật khẩu rỗng (và khi captcha hiện mà chưa pass).<br>• **States**: default / submitting ("Đang đăng nhập...", spinner, disabled) / error inline.<br>• **Navigation success**: tài khoản verified + không khóa + khớp → vào app (onboarding là feature riêng).<br>• **Error — sai thông tin**: `E-authentication-003` "Email hoặc mật khẩu không đúng" (thông báo chung, không lộ email nào tồn tại, FR-010); tăng bộ đếm sai +1.<br>• **Error — chưa xác nhận**: `E-authentication-004` "Tài khoản chưa được xác nhận." + nút [Gửi lại email xác nhận] (FR-009).<br>• **Error — bị khóa**: `E-authentication-005` "Tài khoản tạm khóa do nhiều lần đăng nhập sai. Vui lòng thử lại sau {X} giờ." khi ≥5 lần sai → khóa 24h tự mở (FR-026, BR-005).<br>• **Edge — lỗi mạng**: không tăng bộ đếm sai (FR-authentication-027, BR-011); hiển thị lỗi tạm và cho thử lại.<br>• **Performance**: hiển thị kết quả (vào app hoặc lỗi) trong 3 giây ở 95% trường hợp (NFR-001).<br>• **Accessibility**: nút + field có nhãn cho trình đọc màn hình, điều hướng bàn phím (NFR-009). |
| 7 | Đăng nhập với Google | Button (Secondary) | Click | • **Mục đích**: đăng nhập/đăng ký một chạm qua Google, 1 luồng duy nhất không hỏi thêm field (FR-authentication-012).<br>• **Navigation success — email mới**: tạo tài khoản mới ở trạng thái `verified` (Google đã xác thực email, FR-013, BR-009) → vào app.<br>• **Navigation success — email trùng**: tự liên kết Google vào tài khoản đã có, không tạo trùng, không hỏi mật khẩu cũ (FR-014, BR-003) → vào app.<br>• **Error**: `E-authentication-008` "Đăng nhập Google thất bại. Vui lòng thử lại." khi callback lỗi/mạng/người dùng hủy — không tạo tài khoản dở dang (FR-015).<br>• **Edge**: đóng tab consent giữa chừng = coi như thất bại; email Google khác hoàn toàn email cũ → tạo tài khoản riêng (không liên kết). |
| 8 | Đăng ký | Link | Navigate | • **Mục đích**: lối vào tạo tài khoản mới.<br>• **Navigation**: sang màn `signup`. |

## Changelog‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* 2026-07-17 | /wireframe-ascii | initial: screen login (desktop 1024, box hẹp ~400px); phủ E-003/E-004/E-005/E-008, captcha ≥3, khóa ≥5, lỗi mạng không tính fail.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
