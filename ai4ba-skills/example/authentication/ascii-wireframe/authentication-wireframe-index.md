---
type: screen-index
feature: authentication
status: draft
updated: 2026-07-17
links:
  - docs/authentication/srs/authentication-spec.md
  - docs/authentication/srs/authentication-userflow.md
---

# authentication — Screens Index‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Master index cho mọi screens trong feature authentication. Screen content gộp theo flow (1 file/flow, N screens/file) — chia flow theo `srs/authentication-userflow.md`. Metadata + designs + used-by + descriptions tập trung ở file này.
>
> Device chính: __desktop 1024__ (responsive webapp; form auth căn giữa trong box hẹp ~400px theo `ba-conventions.md` Mục 8).
>
> __HTML prototype clickable (hi-fi, chạy như app thật):__ [`../html-design/authentication-prototype.html`](../html-design/authentication-prototype.html) — state-driven, phủ cả 9 màn + logic thật (captcha ≥3 lần sai, khóa ≥5, chính sách mật khẩu, anti-enumeration quên mật khẩu, buộc tạo mật khẩu trước khi gỡ Google). Mở bằng cách double-click file. Deep-link từng màn: `authentication-prototype.html#{slug}` (vd `#login`, `#signup`).
>
> __Figma prototype clickable:__ 13 frame trên Figma (file "Reqwise MCP Test", Page 3) đã nối 22 liên kết click→navigate (Smart Animate) theo Navigation thật — bấm Present trong Figma để chạy. Nối qua op `set_reactions` của reqwise MCP.

## Screens‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| # | Slug | Status | Thuộc flow | Used by | Figma | HTML | Updated |
|---|------|--------|-----------|---------|-------|------|---------|
| 1 | login | draft | login-email | FR-008, FR-010, FR-011, FR-012, FR-025, FR-026, FR-027 | "01 · Login (+1 locked)" | — | 2026-07-20 |
| 2 | signup | draft | signup-verify | FR-001, FR-002, FR-003, FR-029, FR-031 | "02 · Signup (+1 errors)" | — | 2026-07-20 |
| 3 | verify-sent | draft | signup-verify | FR-004, FR-007 | "03 · Verify sent" | — | 2026-07-20 |
| 4 | verify-result-success | draft | signup-verify | FR-005 | "04 · Verify success" | — | 2026-07-20 |
| 5 | verify-result-expired | draft | signup-verify | FR-006, FR-007 | "05 · Verify expired" | — | 2026-07-20 |
| 6 | forgot-password | draft | forgot-password | FR-016, FR-017 | "06 · Forgot password (+1 submitted)" | — | 2026-07-20 |
| 7 | reset-password | draft | forgot-password | FR-003, FR-018, FR-020, FR-029 | "07 · Reset password" | — | 2026-07-20 |
| 8 | reset-result-success | draft | forgot-password | FR-019 | "08 · Reset success" | — | 2026-07-20 |
| 9 | account-security | draft | unlink-google | FR-023, FR-024, FR-030 | "09 · Account security (+1 dialog)" | — | 2026-07-20 |

> Flow `google-oauth` dùng chung screen `login` (không có screen riêng) — xem `login-email.md`; nhánh nghiệp vụ OAuth mô tả trong bảng element của screen login.

__Status values:__ `draft` / `in-review` / `revisions` / `approved` / `shipped`.

## Descriptions‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### login‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
Màn hình đăng nhập bằng email/password kèm remember-me, nút đăng nhập Google, và lối vào đăng ký / quên mật khẩu. Người học thấy khi bấm "Đăng nhập" hoặc khi chưa có phiên hợp lệ; hiển thị captcha từ lần sai thứ 3 và thông báo khóa từ lần sai thứ 5.

### signup‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
Form đăng ký tài khoản mới bằng email + mật khẩu, có thanh đo độ mạnh mật khẩu real-time và captcha chống bot. Người học thấy khi bấm "Đăng ký" từ màn hình đăng nhập.

### verify-sent
Thông báo đã gửi email xác nhận (hạn 24 giờ) tới địa chỉ vừa đăng ký, kèm nút gửi lại có cooldown 60 giây / tối đa 5 lần một ngày. Người học thấy ngay sau khi đăng ký email thành công.

### verify-result-success
Trang kết quả khi người học bấm link xác nhận còn hạn — thông báo xác nhận thành công và mời đăng nhập. Người học thấy sau khi click link verify hợp lệ.

### verify-result-expired
Trang kết quả khi link xác nhận đã hết hạn 24 giờ hoặc đã được dùng (E-006), kèm nút gửi lại link. Người học thấy khi click link verify không còn hợp lệ.

### forgot-password
Form nhập email để yêu cầu link đặt lại mật khẩu, kèm thông báo trung tính chống dò tài khoản (báo giống nhau dù email tồn tại hay không). Người học thấy khi bấm "Quên mật khẩu" từ màn đăng nhập.

### reset-password
Form nhập mật khẩu mới (2 lần khớp) đạt chính sách 8-20 ký tự sau khi click link đặt lại còn hạn 30 phút; có thanh đo độ mạnh. Người học thấy khi mở reset link hợp lệ từ email.

### reset-result-success
Trang xác nhận đặt lại mật khẩu thành công, báo mọi phiên trên các thiết bị đã bị thu hồi và mời đăng nhập lại. Người học thấy sau khi submit mật khẩu mới hợp lệ.

### account-security
Trang bảo mật cho người học đã đăng nhập để gỡ liên kết Google (buộc tạo mật khẩu trước nếu tài khoản chưa có, E-010) và xem danh sách thiết bị đang đăng nhập với đăng xuất từ xa (P1). Người học thấy khi vào phần cài đặt bảo mật.

## Links upstream

* [[docs/authentication/srs/authentication-spec.md|SRS spec]]
* [[docs/authentication/srs/authentication-userflow.md|User flow]]‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
