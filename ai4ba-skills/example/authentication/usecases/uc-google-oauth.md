# Use Case: Đăng ký/đăng nhập bằng Google (OAuth)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Scope: authentication · Level: sea-level

## Primary Actor‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Người dùng ưu tiên Google (chọn đăng nhập/đăng ký một chạm bằng tài khoản Google)

## Stakeholders & Interests‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Stakeholder | Interest |
|-------------|----------|
| Google OAuth | Xác thực danh tính Google của người dùng và trả email đã xác thực về app |
| Bộ phận vận hành / hỗ trợ | Theo dõi cảnh báo tự liên kết Google bất thường (audit) |

## Trigger‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Người dùng bấm "Đăng nhập với Google" ở màn đăng nhập/đăng ký.

## Preconditions‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- Người dùng có tài khoản Google hợp lệ.
- Google OAuth đã được cấu hình và khả dụng.

## Guarantees

- **Minimal Guarantee:** Callback thất bại không tạo tài khoản dở dang; không tạo tài khoản trùng email; không hỏi mật khẩu cũ khi tự liên kết.
- **Success Guarantee:** Người dùng được xác định qua email Google (một luồng duy nhất cho cả đăng ký và đăng nhập), có phiên đăng nhập và vào app; email được coi là đã xác thực.

## Main Success Scenario

1. Người dùng bấm "Đăng nhập với Google".‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
2. Hệ thống chuyển người dùng tới màn hình đồng ý của Google; người dùng đồng ý.
3. Google trả về thành công email đã xác thực của người dùng.
4. Hệ thống xác định người dùng qua email đó (không hỏi thêm field ngoài dữ liệu Google trả).
5. Nếu email chưa tồn tại, hệ thống tạo tài khoản mới ở trạng thái `verified`.
6. Hệ thống tạo phiên đăng nhập và đưa người dùng vào app.

## Extensions

**3a. Callback Google thất bại (mạng / lỗi Google / người dùng hủy):**
- 3a1. Hệ thống trở về màn đăng nhập và hiển thị E-authentication-008 "Đăng nhập Google thất bại. Vui lòng thử lại."
- 3a2. Hệ thống không tạo tài khoản dở dang; người dùng thử lại Google hoặc dùng email/mật khẩu.

**5a. Email Google trùng với một tài khoản đã tồn tại (tự liên kết):**
- 5a1. Hệ thống tự liên kết Google vào tài khoản đã có, đánh dấu `verified` và đăng nhập — không tạo tài khoản trùng, không yêu cầu nhập mật khẩu cũ (FR-authentication-014).
- 5a2. Hệ thống ghi nhật ký sự kiện tự liên kết Google phục vụ điều tra bảo mật (NFR-authentication-008).

## Related Requirements

- [[../srs/authentication-spec.md#FR-authentication-012|FR-authentication-012]] Đăng nhập/đăng ký bằng Google
- [[../srs/authentication-spec.md#FR-authentication-013|FR-authentication-013]] Tạo tài khoản mới từ Google
- [[../srs/authentication-spec.md#FR-authentication-014|FR-authentication-014]] Tự động liên kết Google trùng email
- [[../srs/authentication-spec.md#FR-authentication-015|FR-authentication-015]] Xử lý callback Google thất bại
- BR-authentication-002 (email là định danh duy nhất), BR-authentication-003 (tự liên kết không hỏi mật khẩu cũ), BR-authentication-009 (tài khoản qua Google là `verified` ngay)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
