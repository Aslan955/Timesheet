# Use Case: Quên mật khẩu — đặt lại mật khẩu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Scope: authentication · Level: sea-level

## Primary Actor‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Người dùng quay lại quên mật khẩu tài khoản email

## Trigger‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Người dùng bấm "Quên mật khẩu", nhập email và gửi form; sau đó bấm link đặt lại trong email.

## Preconditions‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* Người dùng có quyền truy cập hộp thư của email dùng để đăng ký (nếu tài khoản tồn tại).

## Guarantees‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* __Minimal Guarantee:__ Thông báo sau khi gửi email luôn trung tính (không tiết lộ email nào tồn tại — chống dò tài khoản); link hết hạn/đã dùng bị từ chối.
* __Success Guarantee:__ Mật khẩu được cập nhật, link đặt lại được đánh dấu đã dùng, và mọi phiên đăng nhập trên tất cả thiết bị bị thu hồi buộc đăng nhập lại.

## Main Success Scenario

1. Người dùng nhập email ở form quên mật khẩu và gửi.
2. Hệ thống hiển thị thông báo trung tính "Nếu email tồn tại trong hệ thống, đã gửi link đặt lại" (bất kể email có tồn tại hay không).
3. Nếu email khớp một tài khoản tồn tại, hệ thống gửi email chứa link đặt lại hạn 30 phút.
4. Người dùng bấm link đặt lại còn hạn, chưa dùng.
5. Người dùng nhập mật khẩu mới đạt chính sách, nhập lại 2 lần khớp nhau.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
6. Hệ thống cập nhật mật khẩu và đánh dấu link đặt lại đã dùng.
7. Hệ thống thu hồi mọi phiên đăng nhập trên tất cả thiết bị.
8. Hệ thống hiển thị "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại." và chuyển về màn đăng nhập.

## Extensions

__4a. Link đặt lại đã hết hạn hoặc đã được dùng:__
* 4a1. Hệ thống từ chối và hiển thị "Link đã hết hạn" (E-authentication-009).
* 4a2. Hệ thống mời người dùng yêu cầu link mới qua "Quên mật khẩu".

__5a. Mật khẩu mới không đạt chính sách:__
* 5a1. Hệ thống hiển thị lỗi inline (E-authentication-002); người dùng sửa lại mật khẩu.

## Related Requirements

* [[../srs/authentication-spec.md#FR-authentication-016|FR-authentication-016]] Yêu cầu đặt lại mật khẩu
* [[../srs/authentication-spec.md#FR-authentication-017|FR-authentication-017]] Gửi link đặt lại mật khẩu
* [[../srs/authentication-spec.md#FR-authentication-018|FR-authentication-018]] Đặt mật khẩu mới qua link
* [[../srs/authentication-spec.md#FR-authentication-019|FR-authentication-019]] Đăng xuất mọi phiên sau đặt lại
* [[../srs/authentication-spec.md#FR-authentication-020|FR-authentication-020]] Chặn link đặt lại hết hạn/đã dùng
* BR-authentication-007 (đặt lại thu hồi toàn bộ phiên), BR-authentication-008 (thông báo trung tính chống enumeration)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
