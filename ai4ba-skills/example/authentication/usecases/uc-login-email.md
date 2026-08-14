# Use Case: Đăng nhập bằng email + mật khẩu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Scope: authentication · Level: sea-level

## Primary Actor‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Người dùng quay lại có tài khoản email đã xác nhận (học viên miễn phí / trả phí)

## Trigger‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Người dùng nhập email + mật khẩu và bấm "Đăng nhập".

## Preconditions‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- Tài khoản tồn tại và đã ở trạng thái `verified`.
- Tài khoản không đang bị khóa (hoặc đã hết thời gian khóa 24 giờ).

## Guarantees‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- **Minimal Guarantee:** Sai thông tin đăng nhập không tiết lộ email nào tồn tại; lỗi mạng không tính vào bộ đếm sai; không tạo phiên nếu chưa xác thực đủ.
- **Success Guarantee:** Hệ thống tạo phiên đăng nhập cho thiết bị hiện tại (30 ngày nếu bật remember-me), bộ đếm sai được reset, và người dùng vào app.

## Main Success Scenario

1. Người dùng nhập email + mật khẩu (tùy chọn bật remember-me) và bấm "Đăng nhập".
2. Hệ thống kiểm tra tài khoản không bị khóa.
3. Hệ thống kiểm tra email + mật khẩu khớp và tài khoản đã `verified`.
4. Hệ thống reset bộ đếm đăng nhập sai của tài khoản.
5. Hệ thống tạo phiên đăng nhập cho thiết bị hiện tại (giữ 30 ngày nếu bật remember-me).
6. Hệ thống đưa người dùng vào app.

## Extensions

**2a. Tài khoản đang bị khóa (≥5 lần sai):**
- 2a1. Hệ thống hiển thị E-authentication-005 "Tài khoản tạm khóa do nhiều lần đăng nhập sai. Vui lòng thử lại sau {X} giờ."
- 2a2. Người dùng chờ tự mở khóa sau 24 giờ.

**3a. Email hoặc mật khẩu không khớp:**‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
- 3a1. Hệ thống hiển thị thông báo chung "Email hoặc mật khẩu không đúng" (E-authentication-003), không lộ email nào tồn tại, và tăng bộ đếm sai +1.
- 3a2. Từ lần sai thứ 3 liên tiếp, hệ thống yêu cầu captcha ở các lần thử tiếp theo (FR-authentication-025).
- 3a3. Đến lần sai thứ 5 liên tiếp, hệ thống khóa tài khoản 24 giờ (FR-authentication-026).

**3b. Tài khoản đúng mật khẩu nhưng chưa `verified`:**
- 3b1. Hệ thống chặn vào app và hiển thị E-authentication-004 "Tài khoản chưa được xác nhận" kèm nút gửi lại email xác nhận.

**3c. Đăng nhập thất bại do lỗi mạng:**
- 3c1. Hệ thống không tạo phiên và không tăng bộ đếm sai (FR-authentication-027); người dùng thử lại.

**Luồng phụ — Đăng nhập nhiều thiết bị:**
- Một tài khoản được phép có phiên đồng thời trên nhiều thiết bị, không giới hạn số lượng và không tự hết hạn (FR-authentication-021).

**Luồng phụ — Đăng xuất thiết bị hiện tại:**
- Người dùng bấm đăng xuất; hệ thống thu hồi phiên của thiết bị hiện tại mà không ảnh hưởng thiết bị khác, không hiện hộp thoại xác nhận (FR-authentication-022).

## Related Requirements

- [[../srs/authentication-spec.md#FR-authentication-008|FR-authentication-008]] Đăng nhập bằng email + mật khẩu
- [[../srs/authentication-spec.md#FR-authentication-009|FR-authentication-009]] Chặn đăng nhập tài khoản chưa xác nhận
- [[../srs/authentication-spec.md#FR-authentication-010|FR-authentication-010]] Thông báo đăng nhập sai chung
- [[../srs/authentication-spec.md#FR-authentication-011|FR-authentication-011]] Remember-me 30 ngày
- [[../srs/authentication-spec.md#FR-authentication-021|FR-authentication-021]] Đăng nhập nhiều thiết bị
- [[../srs/authentication-spec.md#FR-authentication-022|FR-authentication-022]] Đăng xuất thiết bị hiện tại
- [[../srs/authentication-spec.md#FR-authentication-025|FR-authentication-025]] Captcha sau 3 lần sai
- [[../srs/authentication-spec.md#FR-authentication-026|FR-authentication-026]] Khóa tài khoản sau 5 lần sai
- [[../srs/authentication-spec.md#FR-authentication-027|FR-authentication-027]] Không tính lỗi mạng vào bộ đếm sai
- BR-authentication-005 (khóa 24h sau 5 lần sai), BR-authentication-006 (captcha sau 3 lần sai), BR-authentication-011 (lỗi mạng không tính bộ đếm)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
