---
type: srs-states
feature: authentication
updated: 2026-07-17
---

# authentication — State Diagrams‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Trạng thái + transition của các entity multi-state trong feature __authentication__: Account, VerificationToken, ResetToken, Session. Mỗi entity 1 section.

## State: Account‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Related UC__: uc-signup-email, uc-verify-email, uc-login-email, uc-google-oauth
__Related BR__: BR-authentication-001, 005, 009, 010, 011

States: `unverified`, `verified`, `locked`.

```mermaid
stateDiagram-v2
    [*] --> unverified: Đăng ký email
    [*] --> verified: Đăng ký Google (đã xác thực)
    unverified --> verified: Bấm link xác nhận còn hạn
    unverified --> verified: Tự liên kết Google trùng email
    unverified --> [*]: Quá 24h chưa xác nhận (tự xóa)
    verified --> locked: Sai mật khẩu 5 lần liên tiếp
    locked --> verified: Sau 24h (tự mở khóa)

    note right of locked
        Tự mở khóa sau 24h (BR-005).
        Từ 3 lần sai yêu cầu captcha (BR-006).
        Lỗi mạng KHÔNG tính bộ đếm (BR-011).
    end note
```

__Transitions:__

| Từ | Sang | Trigger | Điều kiện |
|---|---|---|---|
| (none) | unverified | Đăng ký email thành công | Mật khẩu đạt chính sách + email chưa tồn tại |
| (none) | verified | Đăng ký Google thành công | Callback OK, email Google chưa có tài khoản |
| unverified | verified | Bấm link xác nhận | Token còn hạn + chưa dùng |
| unverified | verified | Tự liên kết Google | Email Google trùng tài khoản `unverified` đã có (BR-003) |
| unverified | (xóa) | Tiến trình nền | Quá 24h chưa xác nhận (BR-010) |
| verified | locked | Đăng nhập sai | 5 lần sai liên tiếp (BR-005) |
| locked | verified | Hết thời gian khóa | 24h trôi qua |

__Invalid transitions:__ verified→unverified (không "hủy xác nhận"); locked→unverified (khóa chỉ áp verified); unverified→locked (unverified không đăng nhập được nên không tích bộ đếm sai).

## State: VerificationToken‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Related UC__: uc-verify-email | __Related FR__: FR-005, 006, 007

States: `pending`, `used`, `expired`.

```mermaid
stateDiagram-v2
    [*] --> pending: Gửi email xác nhận
    pending --> used: Bấm link thành công
    pending --> expired: Quá 24h
```

__Invalid transitions:__ used→pending, expired→pending — token đã dùng/hết hạn không tái sử dụng (phải gửi lại tạo token mới).

## State: ResetToken‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Related UC__: uc-forgot-password | __Related FR__: FR-017, 018, 020

States: `pending`, `used`, `expired`.

```mermaid
stateDiagram-v2
    [*] --> pending: Gửi email đặt lại
    pending --> used: Đặt lại mật khẩu thành công
    pending --> expired: Quá 30 phút
```

__Invalid transitions:__ used/expired→pending — phải yêu cầu đặt lại mới.

## State: Session‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Related UC__: uc-login-email, uc-forgot-password | __Related BR__: BR-007 | __Related FR__: FR-019, 021, 022

States: `active`, `revoked`.

```mermaid
stateDiagram-v2
    [*] --> active: Đăng nhập thành công
    active --> revoked: Đăng xuất thiết bị hiện tại
    active --> revoked: Đặt lại mật khẩu (thu hồi mọi phiên)
```

__Transitions:__

| Từ | Sang | Trigger | Điều kiện |
|---|---|---|---|
| active | revoked | Người dùng đăng xuất | Chỉ thu hồi phiên thiết bị hiện tại (FR-022) |
| active | revoked | Đặt lại mật khẩu | Thu hồi TOÀN BỘ phiên mọi thiết bị (BR-007) |

__Invalid transitions:__ revoked→active — phiên đã thu hồi không tái kích hoạt, phải đăng nhập lại. Phiên không tự hết hạn theo thời gian (trừ remember-me hết 30 ngày) và không giới hạn số phiên đồng thời (FR-021).

*Cross-ref: `docs/authentication/srs/authentication-spec.md` Mục 5 Business Rules, Mục 6 Error Matrix.*‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
