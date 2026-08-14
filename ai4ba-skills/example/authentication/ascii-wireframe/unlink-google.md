# Flow: Gỡ liên kết Google‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Màn hình: account-security. Flow tổng xem `../srs/authentication-userflow.md`. Device: desktop 1024. Trang cài đặt cho người đã đăng nhập (full-content) — nhưng hộp thoại "tạo mật khẩu trước khi gỡ" là dialog hẹp căn giữa (~400px) theo Mục 8.

---

## Screen: account-security — Bảo mật tài khoản‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Wireframe (ASCII)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```text
+----------------------------------------------------------------------+
|  english-ai-demo          Bao mat tai khoan                          |
|                                                                      |
|  Phuong thuc dang nhap                                               |
|  +----------------------------------------------------------------+  |
|  |  Email + mat khau           Da thiet lap                       |  |
|  |  (G) Google (ban@email.com) Da lien ket      [ Go lien ket ]   |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|  Thiet bi dang dang nhap                                             |
|  +----------------------------------------------------------------+  |
|  |  Chrome - Windows - HCM      Hien tai                          |  |
|  |  Safari - iPhone - HN        2 gio truoc     [ Dang xuat ]     |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
|  Dialog (khi tai khoan CHUA co mat khau - E-010):                    |
|                  +----------------------------------+                |
|                  |     Tao mat khau truoc khi go     |               |
|                  |  Tai khoan nay dang nhap bang     |               |
|                  |  Google va chua co mat khau. Hay  |               |
|                  |  tao mat khau de khong mat loi    |               |
|                  |  vao tai khoan.                   |               |
|                  |  Mat khau moi                     |               |
|                  |  +-----------------------------+  |               |
|                  |  | ........                    |  |               |
|                  |  +-----------------------------+  |               |
|                  |  8-20 ky tu, hoa/thuong/dac biet  |               |
|                  |  +-----------------------------+  |               |
|                  |  |   Tao mat khau va go Google |  |               |
|                  |  +-----------------------------+  |               |
|                  |  Huy                              |               |
|                  +----------------------------------+                |
+----------------------------------------------------------------------+
```

### Screen description‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| # | Items | Control type | Data type | Description |
|---|-------|--------------|-----------|-------------|
| 1 | Trạng thái email + mật khẩu | Label | ReadOnly | • __Mục đích__: cho biết tài khoản đã có phương thức email/mật khẩu chưa — quyết định luồng gỡ Google.<br>• __Nội dung__: "Đã thiết lập" nếu có mật khẩu; "Chưa có mật khẩu" nếu tài khoản gốc tạo qua Google (Credential có thể trống). |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| 2 | Gỡ liên kết Google | Button (Secondary/Danger) | Click | • __Mục đích__: gỡ liên kết Google khỏi tài khoản.<br>• __Navigation — đã có mật khẩu__: gỡ ngay, giữ đăng nhập email/mật khẩu (FR-023, không hộp thoại xác nhận).<br>• __Navigation — chưa có mật khẩu__: `E-authentication-010` — mở dialog "Tạo mật khẩu trước khi gỡ" (element #5), KHÔNG gỡ cho tới khi tạo mật khẩu (FR-024, BR-004).<br>• __Business rule__: phải có mật khẩu trước khi gỡ để tránh mất lối vào tài khoản (BR-004).<br>• __Audit__: sự kiện gỡ/tự liên kết Google được ghi vết (NFR-008). |
| 3 | Thiết bị đang đăng nhập | List | ReadOnly | • __Mục đích__: cho người dùng thấy thiết bị đang có phiên (FR-030, P1).<br>• __Nội dung__: mỗi dòng thiết bị + thời điểm; đánh dấu "Hiện tại".<br>• __Note__: đăng nhập nhiều thiết bị không giới hạn, phiên không tự hết hạn (FR-021). |
| 4 | Đăng xuất (mỗi thiết bị) | Button (Secondary) | Click | • __Mục đích__: đăng xuất từ xa một thiết bị (FR-030, P1).<br>• __Hệ quả__: thu hồi phiên thiết bị đó, không ảnh hưởng thiết bị khác (đối chiếu FR-022 cho thiết bị hiện tại). |
| 5 | Dialog: Mật khẩu mới | Textbox (password) | Text | • __Mục đích__: buộc tạo mật khẩu đạt chính sách trước khi gỡ Google (FR-024).<br>• __Validation (FR-003)__: 8-20 ký tự, hoa/thường/ký tự đặc biệt, không chứa phần đầu email.<br>• __Error__: `E-authentication-002` nếu không đạt.<br>• __Display rule__: dialog chỉ mở khi tài khoản chưa có mật khẩu (trigger E-010). |
| 6 | Dialog: Tạo mật khẩu và gỡ Google | Button (Primary) | Click/Submit | • __Mục đích__: đặt mật khẩu rồi mới gỡ Google trong cùng thao tác (FR-024, BR-004).<br>• __Navigation success__: lưu mật khẩu → gỡ Google → giữ đăng nhập email/mật khẩu.<br>• __Edge__: bấm "Hủy" giữa chừng → dialog đóng, KHÔNG gỡ liên kết (Google vẫn còn). |

## Changelog‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- 2026-07-17 | /wireframe-ascii | initial: account-security; gỡ Google có/không mật khẩu (FR-023/024, E-010, BR-004), dialog tạo mật khẩu, danh sách thiết bị + đăng xuất từ xa (P1).‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
