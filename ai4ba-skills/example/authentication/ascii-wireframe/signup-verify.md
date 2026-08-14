# Flow: Đăng ký + xác nhận email‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Màn hình: signup → verify-sent → verify-result-success / verify-result-expired. Flow tổng xem `../srs/authentication-userflow.md`. Device: desktop 1024, form căn giữa box hẹp ~400px. Hai trạng thái loại trừ nhau của trang kết quả xác nhận (thành công / hết hạn) tách 2 screen riêng theo `ba-conventions.md` Mục 8.

***

## Screen: signup — Tạo tài khoản mới‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Wireframe (ASCII)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```text
+----------------------------------------------------------------------+
|  english-ai-demo                                                     |
|                  +----------------------------------+                |
|                  |        Tao tai khoan moi          |               |
|                  |  Email                            |               |
|                  |  +-----------------------------+  |               |
|                  |  | ban@email.com               |  |               |
|                  |  +-----------------------------+  |               |
|                  |  Mat khau                         |               |
|                  |  +-----------------------+-----+  |               |
|                  |  | ........              | Hien|  |               |
|                  |  +-----------------------+-----+  |               |
|                  |  Do manh: [====------] Trung binh |               |
|                  |  8-20 ky tu, hoa/thuong/dac biet; |               |
|                  |  khong chua phan dau email        |               |
|                  |  [ captcha chong bot ]            |               |
|                  |  +-----------------------------+  |               |
|                  |  |           Dang ky           |  |               |
|                  |  +-----------------------------+  |               |
|                  |  Da co tai khoan?  Dang nhap      |               |
|                  +----------------------------------+                |
+----------------------------------------------------------------------+
```

### Screen description‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| # | Items | Control type | Data type | Description |
|---|-------|--------------|-----------|-------------|
| 1 | Email | Textbox | Text (email) | • __Mục đích__: định danh tài khoản mới (BR-authentication-002).<br>• __Validation__: bắt buộc; kiểm định dạng email; auto-focus khi tải.<br>• __Error — trùng__: `E-authentication-001` inline "Email này đã được đăng ký. Bạn muốn [đăng nhập] hoặc [quên mật khẩu]?" (FR-002) — chặn tạo tài khoản trùng.<br>• __Placeholder__ "ban@email.com". |
| 2 | Mật khẩu | Textbox (password) | Text | • __Mục đích__: đặt mật khẩu cho phương thức email.<br>• __Validation (FR-003)__: 8-20 ký tự, ≥1 chữ hoa, ≥1 chữ thường, ≥1 ký tự đặc biệt, KHÔNG chứa phần đầu email (local-part ≥3 ký tự, không phân biệt hoa/thường).<br>• __Error__: `E-authentication-002` inline real-time "Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn."<br>• __States__: masked + nút Hiện/Ẩn; validate real-time. |
| 3 | Độ mạnh mật khẩu | Meter | ReadOnly | • __Mục đích__: gợi ý đặt mật khẩu mạnh hơn (FR-029, P1).<br>• __Display__: cập nhật real-time; Yếu/Trung bình/Mạnh (gợi ý, không thay validation cứng FR-003). |
| 4 | Captcha chống bot | Widget | ReadOnly (challenge) | • __Mục đích__: chống đăng ký hàng loạt bằng bot (FR-031, P1).<br>• __Validation__: phải pass mới cho submit.<br>• __Note__: khác captcha login (login hiện sau 3 lần sai). |
| 5 | Đăng ký | Button (Primary) | Click/Submit | • __Mục đích__: tạo tài khoản `unverified` + kích hoạt gửi email xác nhận (FR-001, FR-004).<br>• __Validation__: disabled khi field chưa hợp lệ / captcha chưa pass.<br>• __Navigation success__: gửi email xác nhận link hạn 24h → sang màn `verify-sent`.<br>• __Business rule__: phải xác nhận email trước khi truy cập nội dung học (BR-001).<br>• __Edge__: tài khoản `unverified` quá 24h bị tự xóa (FR-028, BR-010). |
| 6 | Đăng nhập | Link | Navigate | • __Navigation__: sang màn `login`. |

***

## Screen: verify-sent — Đã gửi email xác nhận‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Wireframe (ASCII)

```text
+----------------------------------------------------------------------+
|  english-ai-demo                                                     |
|                  +----------------------------------+                |
|                  |      Kiem tra hop thu cua ban     |               |
|                  |  Da gui email xac nhan toi        |               |
|                  |  ban@email.com                    |               |
|                  |  Bam link trong email de kich     |               |
|                  |  hoat tai khoan. Link co han 24h. |               |
|                  |  Chua nhan duoc email?            |               |
|                  |  +-----------------------------+  |               |
|                  |  |   Gui lai email xac nhan    |  |               |
|                  |  +-----------------------------+  |               |
|                  |  Co the gui lai sau 60 giay       |               |
|                  |  Quay lai  Dang nhap              |               |
|                  +----------------------------------+                |
+----------------------------------------------------------------------+
```

### Screen description

| # | Items | Control type | Data type | Description |
|---|-------|--------------|-----------|-------------|
| 1 | Địa chỉ email đã gửi | Label | ReadOnly | • __Mục đích__: xác nhận email đã gửi tới đúng địa chỉ (FR-004).<br>• __Nội dung__: hiển thị email vừa nhập; nhắc kiểm tra spam. |
| 2 | Ghi chú hạn link | Label | ReadOnly | • __Nội dung__: "Link có hạn 24 giờ" (FR-004). |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| 3 | Gửi lại email xác nhận | Button (Secondary) | Click | • __Mục đích__: gửi lại link mới (FR-007).<br>• __Ràng buộc__: cooldown 60 giây; tối đa 5 lần/ngày.<br>• __States__: enabled → disabled (đếm ngược) → enabled.<br>• __Error__: `E-authentication-007` khi trong cooldown hoặc đủ 5 lần/ngày.<br>• __OQ__: mốc reset quota "5 lần/ngày" (lịch 00:00 hay cửa sổ trượt 24h) chưa chốt — userflow OQ-2. |
| 4 | Đăng nhập | Link | Navigate | • __Navigation__: sang màn `login`. |

***

## Screen: verify-result-success — Xác nhận email thành công

### Wireframe (ASCII)

```text
+----------------------------------------------------------------------+
|  english-ai-demo                                                     |
|                  +----------------------------------+                |
|                  |              [ v ]                |               |
|                  |   Xac nhan email thanh cong!      |               |
|                  |  Tai khoan da duoc kich hoat.     |               |
|                  |  Vui long dang nhap de bat dau.   |               |
|                  |  +-----------------------------+  |               |
|                  |  |      Den trang dang nhap    |  |               |
|                  |  +-----------------------------+  |               |
|                  +----------------------------------+                |
+----------------------------------------------------------------------+
```

### Screen description

| # | Items | Control type | Data type | Description |
|---|-------|--------------|-----------|-------------|
| 1 | Thông báo thành công | Label | ReadOnly | • __Mục đích__: xác nhận link còn hạn + chưa dùng được chấp nhận, tài khoản sang `verified` (FR-005).<br>• __Nội dung__: "Xác nhận email thành công! Vui lòng đăng nhập."<br>• __Trigger__: bấm link xác nhận hợp lệ trong 24h; link đánh dấu đã dùng. |
| 2 | Đến trang đăng nhập | Button (Primary) | Click/Navigate | • __Navigation__: sang màn `login`.<br>• __Edge__: 2 thiết bị cùng bấm 1 link — lần đầu thành công, lần sau rơi "đã dùng" → xem `verify-result-expired`. |

***

## Screen: verify-result-expired — Link xác nhận hết hạn

### Wireframe (ASCII)

```text
+----------------------------------------------------------------------+
|  english-ai-demo                                                     |
|                  +----------------------------------+                |
|                  |              [ ! ]                |               |
|                  |   Link da het han hoac da dung    |               |
|                  |  Link xac nhan nay khong con hop  |               |
|                  |  le. Gui lai link moi de tiep.    |               |
|                  |  +-----------------------------+  |               |
|                  |  |    Gui lai link xac nhan    |  |               |
|                  |  +-----------------------------+  |               |
|                  |  Quay lai  Dang nhap              |               |
|                  +----------------------------------+                |
+----------------------------------------------------------------------+
```

### Screen description

| # | Items | Control type | Data type | Description |
|---|-------|--------------|-----------|-------------|
| 1 | Thông báo hết hạn | Label | ReadOnly | • __Mục đích__: báo link đã quá 24h hoặc đã dùng, bị từ chối (FR-006).<br>• __Error__: `E-authentication-006` "Link đã hết hạn hoặc đã được sử dụng."<br>• __Trigger__: bấm link không còn hợp lệ (gồm thiết bị thứ 2 bấm lại cùng link). |
| 2 | Gửi lại link xác nhận | Button (Primary) | Click | • __Mục đích__: phát hành link mới (FR-007).<br>• __Ràng buộc__: cùng cooldown 60s + tối đa 5 lần/ngày.<br>• __Error__: `E-authentication-007` khi vượt cooldown/giới hạn.<br>• __Navigation success__: gửi lại xong → quay về `verify-sent`. |
| 3 | Đăng nhập | Link | Navigate | • __Navigation__: sang màn `login`. |

## Changelog

* 2026-07-17 | /wireframe-ascii | initial: signup + verify-sent + verify-result-success/expired; tách 2 trạng thái verify-result (Mục 8); policy 8-20 + cấm local-part, resend 60s/5-per-day.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
