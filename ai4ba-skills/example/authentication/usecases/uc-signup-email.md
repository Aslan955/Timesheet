# Use Case: Đăng ký bằng email + mật khẩu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Scope: authentication · Level: sea-level

## Primary Actor‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Học viên miễn phí / Học viên trả phí (người dùng chưa có tài khoản, chọn đăng ký bằng email)

## Trigger‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Người dùng mở form đăng ký, nhập email + mật khẩu và bấm "Đăng ký".

## Preconditions‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* Người dùng chưa đăng nhập.
* Người dùng có quyền truy cập hộp thư của email dùng để đăng ký.

## Guarantees‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* **Minimal Guarantee:** Không tạo tài khoản trùng email; nếu email đã tồn tại, hệ thống chặn và giữ nguyên tài khoản cũ. Mật khẩu không đạt chính sách thì không tạo tài khoản.
* **Success Guarantee:** Tài khoản được tạo ở trạng thái `unverified`, một email chứa link xác nhận (hạn 24 giờ) được gửi tới địa chỉ đã đăng ký, và người dùng thấy màn "đã gửi email xác nhận".

## Main Success Scenario

1) Người dùng nhập email + mật khẩu vào form đăng ký.
2) Hệ thống kiểm tra mật khẩu đạt chính sách (8-20 ký tự, có chữ hoa, chữ thường, ký tự đặc biệt, không chứa phần đầu email).
3) Hệ thống kiểm tra email chưa tồn tại trong hệ thống.
4) Hệ thống tạo tài khoản mới ở trạng thái `unverified`.
5) Hệ thống tạo link xác nhận hạn 24 giờ và gửi email xác nhận tới địa chỉ đã đăng ký.
6) Hệ thống hiển thị màn "Đã gửi email xác nhận tới {email}" kèm tùy chọn gửi lại.

## Extensions‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

**2a. Mật khẩu không đạt chính sách:**
* 2a1. Hệ thống hiển thị lỗi inline real-time (E-authentication-002) nêu rõ yêu cầu về độ dài, loại ký tự và không chứa phần đầu email.
* 2a2. Không tạo tài khoản; người dùng sửa lại mật khẩu và thử lại.

**3a. Email đã được đăng ký:**
* 3a1. Hệ thống chặn tạo tài khoản và hiển thị lỗi inline (E-authentication-001) gợi ý người dùng đăng nhập hoặc quên mật khẩu.
* 3a2. Người dùng chuyển sang luồng đăng nhập hoặc quên mật khẩu.

**5a. Bị bot chặn ở form đăng ký (P1):**
* 5a1. Hệ thống yêu cầu captcha trước khi cho phép tạo tài khoản (FR-authentication-031).

**Sau 4. Tài khoản `unverified` quá 24 giờ chưa xác nhận:**
* Hệ thống tự xóa tài khoản đó (FR-authentication-028); người dùng phải đăng ký lại nếu muốn tiếp tục.

## Related Requirements

* [[../srs/authentication-spec.md#FR-authentication-001|FR-authentication-001]] Đăng ký bằng email + mật khẩu
* [[../srs/authentication-spec.md#FR-authentication-002|FR-authentication-002]] Chặn đăng ký email trùng
* [[../srs/authentication-spec.md#FR-authentication-003|FR-authentication-003]] Áp chính sách mật khẩu
* [[../srs/authentication-spec.md#FR-authentication-004|FR-authentication-004]] Gửi email xác nhận
* [[../srs/authentication-spec.md#FR-authentication-028|FR-authentication-028]] Tự xóa tài khoản chưa xác nhận
* [[../srs/authentication-spec.md#FR-authentication-029|FR-authentication-029]] Đo độ mạnh mật khẩu real-time (P1)
* [[../srs/authentication-spec.md#FR-authentication-031|FR-authentication-031]] Captcha chống bot khi đăng ký (P1)
* BR-authentication-001 (gate access qua xác nhận email), BR-authentication-002 (email là định danh duy nhất), BR-authentication-010 (tự xóa `unverified` quá 24h)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
