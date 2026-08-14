# Use Case: Gỡ liên kết Google‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Scope: authentication · Level: sea-level

## Primary Actor‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Người dùng đã đăng nhập, muốn gỡ liên kết tài khoản Google khỏi tài khoản của mình

## Trigger‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Người dùng vào màn quản lý bảo mật tài khoản và bấm "Gỡ liên kết Google".

## Preconditions‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* Người dùng đã đăng nhập.
* Tài khoản hiện đang có liên kết Google.

## Guarantees‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* __Minimal Guarantee:__ Không để người dùng mất lối vào tài khoản — nếu tài khoản chưa có mật khẩu thì buộc tạo mật khẩu trước khi gỡ.
* __Success Guarantee:__ Liên kết Google được gỡ khỏi tài khoản và người dùng vẫn đăng nhập được bằng email/mật khẩu.

## Main Success Scenario

1) Người dùng bấm "Gỡ liên kết Google" ở màn quản lý bảo mật.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
2) Hệ thống kiểm tra tài khoản đã có mật khẩu.
3) Hệ thống gỡ liên kết Google khỏi tài khoản.
4) Hệ thống xác nhận đã gỡ; người dùng vẫn giữ khả năng đăng nhập bằng email/mật khẩu.

## Extensions

__2a. Tài khoản chưa có mật khẩu (đăng ký gốc qua Google):__
* 2a1. Hệ thống chuyển sang form buộc tạo mật khẩu và hiển thị E-authentication-010.
* 2a2. Người dùng nhập mật khẩu đạt chính sách (8-20 ký tự, đủ hoa/thường/ký tự đặc biệt, không chứa phần đầu email).
* 2a3. Sau khi tạo mật khẩu thành công, hệ thống mới gỡ liên kết Google (quay lại bước 3).

## Related Requirements

* [[../srs/authentication-spec.md#FR-authentication-023|FR-authentication-023]] Gỡ liên kết Google
* [[../srs/authentication-spec.md#FR-authentication-024|FR-authentication-024]] Buộc đặt mật khẩu trước khi gỡ Google
* [[../srs/authentication-spec.md#FR-authentication-003|FR-authentication-003]] Áp chính sách mật khẩu (khi buộc tạo mật khẩu)
* BR-authentication-004 (phải có mật khẩu trước khi gỡ liên kết Google)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
