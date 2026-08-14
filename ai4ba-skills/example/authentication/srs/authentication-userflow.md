---
type: srs-userflow
feature: authentication
updated: 2026-07-17
stage: flow-approved
primary_device: desktop
---

# authentication — User Flow‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Nguồn chia flow DUY NHẤT cho feature này. `/wireframe-ascii` và `/wireframe-html` đọc file này để biết flow nào gồm những màn nào — KHÔNG tự chia flow riêng.
>
> Derived từ `srs/authentication-spec.md` (31 FR, Mục 9 Flows, Mục 10 Screens, 10 error codes). Phủ happy / error / edge cases. Device chính: __desktop 1024__ (responsive webapp — form auth căn giữa trong box hẹp ~400px theo `ba-conventions.md` Mục 8).

## 1. User Flow (tổng)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> `[n]` = số màn hình đối chiếu Mục 2. Xanh = happy, đỏ = error, vàng = edge.

```mermaid
flowchart TD
    n0["Bắt đầu:<br/>chưa có phiên"]
    n1["[1] Đăng nhập<br/>(email/password + Google)"]
    n2["[2] Đăng ký<br/>(email + password)"]
    d1{"Kiểm tra<br/>email/password"}
    n8["Vào app<br/>(feature onboarding riêng)"]
    e1["Sai email hoặc<br/>mật khẩu (E-003)"]
    e2["Yêu cầu captcha<br/>(fail ≥3, BR-006)"]
    e3["Khóa tài khoản 24h<br/>(fail ≥5, E-005)"]
    e4["Tài khoản chưa xác nhận<br/>(E-004) + nút gửi lại"]
    d2{"Password đạt<br/>chính sách 8-20?"}
    n3["[3] Đã gửi email<br/>xác nhận (24h)"]
    e5["Inline: password<br/>không đạt policy (E-002)"]
    e6["Email đã được<br/>đăng ký (E-001)"]
    d3{"Token verify<br/>còn hạn + chưa dùng?"}
    n4["[4] Xác nhận email<br/>thành công"]
    n5["[5] Link xác nhận<br/>hết hạn/đã dùng (E-006)"]
    dg{"Google callback<br/>thành công?"}
    e8["Đăng nhập Google<br/>thất bại (E-008)"]
    dlink{"Email Google trùng<br/>tài khoản có sẵn?"}
    n9["Tự liên kết vào<br/>tài khoản đã có (verified)"]
    n10["Tạo tài khoản mới<br/>verified"]
    n6["[6] Quên mật khẩu<br/>— nhập email"]
    nn["Thông báo trung tính:<br/>nếu email tồn tại, đã gửi link"]
    n7["[7] Đặt mật khẩu mới<br/>(nhập 2 lần)"]
    d4{"Reset link còn<br/>hạn 30 phút + chưa dùng?"}
    e9["Link đặt lại hết hạn/<br/>đã dùng (E-009)"]
    n11["[8] Đặt lại thành công<br/>— thu hồi mọi phiên"]
    n12["[9] Bảo mật tài khoản<br/>— gỡ liên kết Google"]
    d5{"Tài khoản đã<br/>có mật khẩu?"}
    n13["Gỡ liên kết Google<br/>thành công"]
    n14["Buộc tạo mật khẩu<br/>trước khi gỡ (E-010)"]

    n0 -->|"có tài khoản"| n1
    n0 -->|"chưa có tài khoản"| n2

    n1 -->|"submit email/password"| d1
    d1 -->|"đúng + verified + không khóa"| n8
    d1 -->|"sai"| e1
    e1 -.->|"fail 1-2 lần"| n1
    e1 -->|"fail ≥3 lần"| e2
    e2 -.->|"fail ≥5 lần"| e3
    d1 -->|"chưa verified"| e4
    e4 -.->|"gửi lại email"| n3
    d1 -->|"lỗi mạng, không tính fail"| n1
    n1 -->|"bấm Google"| dg
    dg -->|"thành công"| dlink
    dg -->|"thất bại/đóng tab"| e8
    e8 -.->|"thử lại"| n1
    dlink -->|"email đã có"| n9
    dlink -->|"email mới"| n10
    n9 --> n8
    n10 --> n8
    n1 -->|"quên mật khẩu?"| n6
    n1 -->|"chưa có tài khoản?"| n2

    n2 -->|"submit"| d2
    d2 -->|"đạt"| n3
    d2 -->|"không đạt"| e5
    e5 -.->|"sửa lại"| n2
    n2 -->|"email đã tồn tại"| e6
    e6 -.->|"đăng nhập/quên MK"| n1
    n3 -->|"click link trong email"| d3
    d3 -->|"hợp lệ, chưa dùng"| n4
    d3 -->|"hết hạn/đã dùng"| n5
    n5 -.->|"gửi lại link"| n3
    n4 -->|"vui lòng đăng nhập"| n1

    n6 -->|"submit email"| nn
    nn -.->|"nếu email tồn tại"| n7
    n7 -->|"submit mật khẩu mới"| d4
    d4 -->|"còn hạn + đạt policy"| n11
    d4 -->|"hết hạn/đã dùng"| e9
    e9 -.->|"quên mật khẩu lại"| n6
    n11 -->|"đăng nhập lại"| n1

    n8 -->|"vào phần bảo mật"| n12
    n12 -->|"bấm gỡ liên kết"| d5
    d5 -->|"đã có mật khẩu"| n13
    d5 -->|"chưa có mật khẩu"| n14
    n14 -.->|"tạo xong mật khẩu"| n13
    n13 --> n12

    classDef happy fill:#d4edda,stroke:#28a745
    classDef error fill:#f8d7da,stroke:#dc3545
    classDef edge fill:#fff3cd,stroke:#ffc107

    class n1,n2,n3,n4,n6,n7,n8,n9,n10,n11,n12,n13 happy
    class e1,e3,e5,e6,e8,e9 error
    class e2,e4,n5,n14,dlink edge
```

## 2. Danh sách màn hình‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| [#] | Màn hình | Mục đích | Thuộc flow |
|-----|----------|----------|------------|
| 1 | login | Đăng nhập email/password hoặc qua Google; lối vào đăng ký + quên mật khẩu; các trạng thái E-003/E-004/E-005 + captcha | login-email, google-oauth |
| 2 | signup | Đăng ký tài khoản mới email + password, đo độ mạnh mật khẩu; lỗi E-001/E-002 | signup-verify |
| 3 | verify-sent | Thông báo đã gửi email xác nhận (hạn 24h) + nút gửi lại (cooldown 60s / 5 lần/ngày) | signup-verify |
| 4 | verify-result-success | Xác nhận email thành công → chuyển về login | signup-verify |
| 5 | verify-result-expired | Link xác nhận hết hạn/đã dùng (E-006) + gửi lại link | signup-verify |
| 6 | forgot-password | Nhập email để nhận link đặt lại; thông báo trung tính chống dò tài khoản | forgot-password |
| 7 | reset-password | Đặt mật khẩu mới (nhập 2 lần) sau khi click link còn hạn 30 phút; lỗi E-002/E-009 | forgot-password |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| 8 | reset-result-success | Đặt lại thành công, mọi phiên bị thu hồi → chuyển về login | forgot-password |
| 9 | account-security | Gỡ liên kết Google; buộc tạo mật khẩu nếu chưa có (E-010); danh sách thiết bị (P1) | unlink-google |

## 3. Chia flow‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Flow-slug | Tên flow | Màn hình gồm | Cases phủ |
|-----------|----------|--------------|-----------|
| signup-verify | Đăng ký + xác nhận email | signup → verify-sent → verify-result-success / verify-result-expired | happy (đăng ký + xác nhận thành công), error (password không đạt policy E-002, email đã tồn tại E-001, link hết hạn/đã dùng E-006), edge (resend cooldown 60s max 5/ngày E-007, tài khoản unverified quá 24h tự xóa FR-028) |
| login-email | Đăng nhập email + password | login | happy (đăng nhập thành công, vào app), error (sai email/password E-003, chưa verified E-004, tài khoản khóa E-005), edge (captcha ≥3 lần BR-006, khóa 24h ≥5 lần BR-005, lỗi mạng không tính fail FR-027, remember-me 30 ngày FR-011) |
| google-oauth | Đăng nhập/đăng ký qua Google | login [chung với flow login-email] | happy (tạo tài khoản mới verified FR-013 hoặc tự liên kết vào tài khoản có sẵn FR-014), error (callback thất bại E-008), edge (đóng tab giữa chừng, email Google khác hoàn toàn email cũ → tạo tài khoản riêng) |
| forgot-password | Quên mật khẩu / đặt lại | forgot-password → reset-password → reset-result-success | happy (đặt lại thành công, thu hồi mọi phiên FR-019), error (link hết hạn 30 phút E-009, password mới không đạt policy E-002), edge (anti-enumeration — email không tồn tại vẫn báo trung tính FR-016/BR-008) |
| unlink-google | Gỡ liên kết Google | account-security | happy (gỡ liên kết thành công khi đã có mật khẩu FR-023), edge (tài khoản chưa có mật khẩu → buộc tạo mật khẩu trước E-010/FR-024, bỏ giữa chừng vẫn còn liên kết) |

## 4. Open Questions‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* [ ] OQ-1 (kế thừa từ `spec.md` Mục 12): auto-link Google vào tài khoản email trùng không re-verify quyền sở hữu — rủi ro chiếm tài khoản, cân nhắc P1.
* [ ] OQ-2 (kế thừa từ `spec.md` Mục 12): "ngày" trong quota gửi lại 5 lần/ngày tính theo lịch (00:00 local) hay cửa sổ trượt 24h — ảnh hưởng hiển thị thông báo E-007 ở màn verify-sent.
* [ ] OQ-3 (kế thừa từ `spec.md` Mục 12): điều kiện reset bộ đếm đăng nhập sai (sau login thành công hay tự giảm theo thời gian) — ảnh hưởng logic hiển thị captcha/khóa ở màn login.
* [ ] OQ-4 (kế thừa từ `spec.md` Mục 12): admin disable tài khoản đang đăng nhập chưa có FR/màn hình — ngoài scope userflow hiện tại.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
