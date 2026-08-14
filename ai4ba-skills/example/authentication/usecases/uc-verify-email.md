# Use Case: Xác nhận email qua link‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Scope: authentication · Level: sea-level

## Primary Actor‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Người dùng vừa đăng ký bằng email (tài khoản đang ở trạng thái `unverified`)

## Trigger‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Người dùng bấm link xác nhận trong email đã nhận, hoặc bấm "Gửi lại email xác nhận".

## Preconditions‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- Tài khoản đã được tạo và đang ở trạng thái `unverified`.
- Người dùng đã nhận được email chứa link xác nhận.

## Guarantees‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- __Minimal Guarantee:__ Link đã hết hạn hoặc đã dùng bị từ chối; trạng thái tài khoản không thay đổi ngoài ý muốn.
- __Success Guarantee:__ Tài khoản chuyển sang trạng thái `verified`, link xác nhận được đánh dấu đã dùng, và người dùng được mời đăng nhập.

## Main Success Scenario

1. Người dùng bấm link xác nhận trong email.
2. Hệ thống kiểm tra link còn hạn (trong 24 giờ) và chưa được dùng.
3. Hệ thống chuyển tài khoản sang trạng thái `verified`.
4. Hệ thống đánh dấu link xác nhận đã dùng.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
5. Hệ thống hiển thị "Xác nhận email thành công! Vui lòng đăng nhập." và chuyển về màn đăng nhập.

## Extensions

__2a. Link đã hết hạn hoặc đã được dùng:__
- 2a1. Hệ thống từ chối và hiển thị trang kết quả "Link đã hết hạn hoặc đã được sử dụng" (E-authentication-006).
- 2a2. Hệ thống mời người dùng gửi lại link xác nhận.

__Luồng phụ — Người dùng yêu cầu gửi lại email xác nhận:__
- b1. Người dùng bấm "Gửi lại email xác nhận".
- b2. Nếu còn trong cooldown 60 giây hoặc đã đủ 5 lần/ngày, hệ thống chặn và thông báo thời gian chờ / đã đạt giới hạn ngày (E-authentication-007).
- b3. Nếu được phép, hệ thống tạo link mới hạn 24 giờ, gửi lại email và reset cooldown 60 giây.

__Race — hai thiết bị cùng bấm một link:__
- Thiết bị đầu tiên xác nhận thành công; thiết bị sau nhận E-authentication-006 "Link đã được sử dụng".

## Related Requirements

- [[../srs/authentication-spec.md#FR-authentication-005|FR-authentication-005]] Xác nhận email qua link
- [[../srs/authentication-spec.md#FR-authentication-006|FR-authentication-006]] Chặn link xác nhận hết hạn/đã dùng
- [[../srs/authentication-spec.md#FR-authentication-007|FR-authentication-007]] Gửi lại email xác nhận
- BR-authentication-001 (phải xác nhận email trước khi truy cập nội dung học)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
