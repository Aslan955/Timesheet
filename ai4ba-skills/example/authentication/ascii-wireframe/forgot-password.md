# Flow: Quên mật khẩu / đặt lại‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Màn hình: forgot-password → reset-password → reset-result-success. Flow tổng xem `../srs/authentication-userflow.md`. Device: desktop 1024, form căn giữa box hẹp ~400px.

---

## Screen: forgot-password — Quên mật khẩu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Wireframe (ASCII)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```text
+----------------------------------------------------------------------+
|  english-ai-demo                                                     |
|                  +----------------------------------+                |
|                  |           Quen mat khau           |               |
|                  |  Nhap email tai khoan, chung toi  |               |
|                  |  se gui link dat lai mat khau.    |               |
|                  |  Email                            |               |
|                  |  +-----------------------------+  |               |
|                  |  | ban@email.com               |  |               |
|                  |  +-----------------------------+  |               |
|                  |  +-----------------------------+  |               |
|                  |  |      Gui link dat lai       |  |               |
|                  |  +-----------------------------+  |               |
|                  |  Nho mat khau roi?  Dang nhap     |               |
|                  +----------------------------------+                |
+----------------------------------------------------------------------+
```

> Sau khi bấm "Gửi link đặt lại", box đổi sang trạng thái thông báo trung tính (cùng thông báo dù email tồn tại hay không — element #3).

### Screen description‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| # | Items | Control type | Data type | Description |
|---|-------|--------------|-----------|-------------|
| 1 | Email | Textbox | Text (email) | • **Mục đích**: nhận email để phát hành link đặt lại (FR-017).<br>• **Validation**: bắt buộc; kiểm định dạng; auto-focus.<br>• **Security**: KHÔNG báo email tồn tại hay không tại field này (anti-enumeration, NFR-007). |
| 2 | Gửi link đặt lại | Button (Primary) | Click/Submit | • **Mục đích**: yêu cầu gửi email đặt lại.<br>• **Navigation/hệ quả**: sau submit LUÔN hiện thông báo trung tính "Nếu email tồn tại trong hệ thống, đã gửi link đặt lại." bất kể email tồn tại hay không (FR-016, BR-008).<br>• **Backend (ẩn)**: nếu email khớp → gửi link đặt lại hạn 30 phút (FR-017); không khớp → không gửi nhưng thông báo giống hệt. |
| 3 | Thông báo trung tính | Label | ReadOnly | • **Nội dung**: "Nếu email tồn tại trong hệ thống, đã gửi link đặt lại."<br>• **States**: ẩn (trước submit) / hiện (sau submit). |
| 4 | Đăng nhập | Link | Navigate | • **Navigation**: sang màn `login`. |

---

## Screen: reset-password — Đặt mật khẩu mới‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Wireframe (ASCII)

```text
+----------------------------------------------------------------------+
|  english-ai-demo                                                     |
|                  +----------------------------------+                |
|                  |         Dat mat khau moi          |               |
|                  |  Mat khau moi                     |               |
|                  |  +-----------------------+-----+  |               |
|                  |  | ........              | Hien|  |               |
|                  |  +-----------------------+-----+  |               |
|                  |  Do manh: [======----] Manh       |               |
|                  |  Nhap lai mat khau moi            |               |
|                  |  +-----------------------+-----+  |               |
|                  |  | ........              | Hien|  |               |
|                  |  +-----------------------+-----+  |               |
|                  |  +-----------------------------+  |               |
|                  |  |      Dat lai mat khau       |  |               |
|                  |  +-----------------------------+  |               |
|                  +----------------------------------+                |
+----------------------------------------------------------------------+
```

### Screen description‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| # | Items | Control type | Data type | Description |
|---|-------|--------------|-----------|-------------|
| 1 | Mật khẩu mới | Textbox (password) | Text | • **Mục đích**: nhận mật khẩu mới (FR-018).<br>• **Validation (FR-003)**: 8-20 ký tự, đủ hoa/thường/ký tự đặc biệt, không chứa phần đầu email.<br>• **Error**: `E-authentication-002` inline.<br>• **States**: masked + Hiện/Ẩn; validate real-time. |
| 2 | Độ mạnh mật khẩu | Meter | ReadOnly | • **Mục đích**: gợi ý mật khẩu mạnh hơn (FR-029, P1); cập nhật real-time. |
| 3 | Nhập lại mật khẩu mới | Textbox (password) | Text | • **Mục đích**: xác nhận trùng khớp (FR-018 — nhập 2 lần khớp).<br>• **Validation**: bắt buộc khớp field trên; báo lỗi inline nếu không khớp. |
| 4 | Đặt lại mật khẩu | Button (Primary) | Click/Submit | • **Mục đích**: cập nhật mật khẩu + đánh dấu link đã dùng (FR-018).<br>• **Navigation success**: cập nhật + thu hồi mọi phiên trên mọi thiết bị (FR-019, BR-007) → sang `reset-result-success`.<br>• **Error — link hết hạn/đã dùng**: `E-authentication-009` "Link đã hết hạn. [Quên mật khẩu] lại để nhận link mới." (FR-020).<br>• **Precondition**: chỉ mở màn này khi link còn hạn 30 phút + chưa dùng. |

---

## Screen: reset-result-success — Đặt lại thành công

### Wireframe (ASCII)

```text
+----------------------------------------------------------------------+
|  english-ai-demo                                                     |
|                  +----------------------------------+                |
|                  |              [ v ]                |               |
|                  |    Dat lai mat khau thanh cong    |               |
|                  |  Moi phien dang nhap tren cac     |               |
|                  |  thiet bi da duoc dang xuat vi ly |               |
|                  |  do an toan. Vui long dang nhap   |               |
|                  |  lai bang mat khau moi.           |               |
|                  |  +-----------------------------+  |               |
|                  |  |      Den trang dang nhap    |  |               |
|                  |  +-----------------------------+  |               |
|                  +----------------------------------+                |
+----------------------------------------------------------------------+
```

### Screen description

| # | Items | Control type | Data type | Description |
|---|-------|--------------|-----------|-------------|
| 1 | Thông báo thành công | Label | ReadOnly | • **Mục đích**: xác nhận mật khẩu đã đổi + cảnh báo mọi phiên bị thu hồi (FR-019, BR-007).<br>• **Nội dung**: "Đặt lại mật khẩu thành công. Mọi phiên trên các thiết bị đã bị đăng xuất. Vui lòng đăng nhập lại."<br>• **Lý do**: chặn kẻ có phiên cũ tiếp tục truy cập sau khi chủ tài khoản đổi mật khẩu. |
| 2 | Đến trang đăng nhập | Button (Primary) | Click/Navigate | • **Navigation**: sang màn `login`. |

## Changelog

- 2026-07-17 | /wireframe-ascii | initial: forgot-password + reset-password + reset-result-success; anti-enumeration, link reset 30 phút, thu hồi mọi phiên (FR-019), policy 8-20 + cấm local-part.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
