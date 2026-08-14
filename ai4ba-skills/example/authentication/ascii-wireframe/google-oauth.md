# Flow: Đăng nhập/đăng ký qua Google‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Flow này KHÔNG có screen riêng — dùng chung screen `login` (nút "Đăng nhập với Google") ở `login-email.md`. File này ghi nhận nhánh nghiệp vụ OAuth để đối chiếu; xem element #7 của screen login cho chi tiết render + trạng thái.

---

## Nhánh nghiệp vụ (tham chiếu screen login)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Nhánh | Nguồn | Kết quả nghiệp vụ |
|-------|-------|-------------------|
| Callback Google thành công, email mới | FR-authentication-013, BR-authentication-009 | Tạo tài khoản mới ở trạng thái `verified` → vào app |
| Callback Google thành công, email trùng tài khoản có sẵn | FR-authentication-014, BR-authentication-003 | Tự liên kết Google vào tài khoản đã có (không tạo trùng, không hỏi mật khẩu cũ) → vào app |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| Callback Google thất bại (mạng/Google/người dùng hủy) | FR-authentication-015, E-authentication-008 | Về màn login, banner "Đăng nhập Google thất bại. Vui lòng thử lại." — không tạo tài khoản dở dang |
| Edge: đóng tab consent giữa chừng | FR-015 | Coi như thất bại (E-008) |
| Edge: email Google khác hoàn toàn email đã có | Assumption Mục 11 | Tạo tài khoản riêng, không tự liên kết |

> OQ liên quan: auto-link không re-verify quyền sở hữu tài khoản đích — rủi ro chiếm tài khoản (userflow OQ-1 / spec Mục 12). Ghi vết sự kiện tự-liên-kết Google phục vụ điều tra (NFR-authentication-008).

## Changelog‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- 2026-07-17 | /wireframe-ascii | initial: flow google-oauth dùng chung screen login; ghi 5 nhánh nghiệp vụ.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
