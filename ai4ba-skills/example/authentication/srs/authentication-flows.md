---
type: srs-flows
feature: authentication
updated: 2026-07-17
---

# authentication — Flows‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Sequence diagram cho các flow kỹ thuật của feature authentication. Mỗi flow 1 section. Lifecycle inherit từ `srs/authentication-spec.md`.

## Flow: Đăng ký email + xác nhận email‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Liên quan: FR-authentication-001..007 | Error: E-authentication-001, 002, 006, 007 | Related UC: uc-signup-email, uc-verify-email.

```mermaid
sequenceDiagram
    actor User
    participant Web as Web App
    participant BE as Backend
    participant DB as Database
    participant Mail as Email Service

    User->>Web: Nhập email + mật khẩu, submit
    Web->>Web: Kiểm tra chính sách mật khẩu (real-time)
    alt Mật khẩu không đạt chính sách
        Web-->>User: Lỗi E-authentication-002 inline, không submit
    else Mật khẩu hợp lệ
        Web->>BE: Gửi yêu cầu đăng ký
        BE->>DB: Email đã tồn tại chưa?
        alt Email đã tồn tại
            DB-->>BE: Đã có
            BE-->>Web: Lỗi E-authentication-001
            Web-->>User: Inline error + gợi ý đăng nhập/quên mật khẩu
        else Email chưa có
            DB-->>BE: Chưa có
            BE->>DB: Tạo Account status=unverified
            BE->>DB: Tạo VerificationToken pending, hạn 24h
            BE->>Mail: Gửi email xác nhận (link 24h)
            BE-->>Web: OK
            Web-->>User: Đã gửi email xác nhận + nút Gửi lại
        end
    end

    opt Gửi lại email xác nhận
        User->>Web: Bấm Gửi lại
        Web->>BE: Yêu cầu gửi lại
        alt Trong cooldown 60s hoặc đã đủ 5 lần/ngày
            BE-->>Web: Chặn gửi lại (E-authentication-007)
            Web-->>User: Vui lòng đợi / đã đạt giới hạn ngày
        else Được phép gửi lại
            BE->>DB: Tạo VerificationToken mới hạn 24h
            BE->>Mail: Gửi lại email xác nhận
            BE-->>Web: OK
            Web-->>User: Đã gửi lại + reset cooldown 60s
        end
    end

    Note over User,Mail: Người dùng mở email, bấm link xác nhận
    User->>Web: Bấm link xác nhận
    Web->>BE: Xác minh token
    BE->>DB: Token còn hạn và chưa dùng?
    alt Token hợp lệ
        DB-->>BE: OK
        BE->>DB: Account sang verified, VerificationToken used
        BE-->>Web: Thành công
        Web-->>User: Xác nhận thành công, chuyển sang Login
    else Token hết hạn hoặc đã dùng
        DB-->>BE: Không hợp lệ
        BE-->>Web: Lỗi E-authentication-006
        Web-->>User: Link hết hạn/đã dùng + nút Gửi lại link
    end
```

## Flow: Đăng nhập email + mật khẩu (kèm captcha/khóa)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Liên quan: FR-authentication-008..011, 021, 022, 025, 026, 027 | Error: E-authentication-003, 004, 005 | Related UC: uc-login-email.

```mermaid
sequenceDiagram
    actor User
    participant Web as Web App
    participant BE as Backend
    participant DB as Database

    User->>Web: Nhập email + mật khẩu (tùy chọn remember-me), submit
    Web->>BE: Gửi yêu cầu đăng nhập
    BE->>DB: Đọc Account theo email
    alt Tài khoản đang bị khóa
        BE-->>Web: Lỗi E-authentication-005 (thử lại sau X giờ)
        Web-->>User: Hiện inline error
    else Lỗi mạng khi submit
        BE-->>Web: Lỗi mạng, không tạo phiên
        Note over BE: KHÔNG tăng bộ đếm sai (FR-027)
        Web-->>User: Lỗi kết nối, vui lòng thử lại
    else Email hoặc mật khẩu không khớp
        BE->>DB: Tăng bộ đếm sai liên tiếp +1
        Note over BE: Từ 3 lần sai yêu cầu captcha FR-025, 5 lần khóa 24h FR-026
        BE-->>Web: Lỗi E-authentication-003 (chung, không lộ email)
        Web-->>User: Inline error (kèm captcha nếu sai từ 3 lần)
    else Khớp nhưng chưa verified
        BE-->>Web: Lỗi E-authentication-004
        Web-->>User: Inline error + nút Gửi lại email xác nhận
    else Khớp và đã verified
        BE->>DB: Reset bộ đếm sai, tạo Session active
        Note over BE: remember-me=true thì phiên giữ 30 ngày
        BE-->>Web: OK + phiên
        Web-->>User: Vào app
    end

    opt Đăng xuất thiết bị hiện tại
        User->>Web: Bấm Đăng xuất
        Web->>BE: Thu hồi phiên thiết bị hiện tại
        BE->>DB: Session sang revoked (chỉ thiết bị này, FR-022)
        BE-->>Web: OK
        Web-->>User: Đăng xuất, không ảnh hưởng thiết bị khác
    end
```

## Flow: Đăng ký/đăng nhập bằng Google (OAuth) + tự liên kết‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Liên quan: FR-authentication-012..015 | Error: E-authentication-008 | Related UC: uc-google-oauth.

```mermaid
sequenceDiagram
    actor User
    participant Web as Web App
    participant BE as Backend
    participant Google as Google OAuth
    participant DB as Database

    User->>Web: Bấm "Đăng nhập với Google"
    Web->>Google: Chuyển tới màn hình đồng ý
    Google-->>Web: Người dùng đồng ý, callback
    Web->>BE: Gửi kết quả callback
    BE->>Google: Lấy email đã xác thực
    alt Callback thất bại (mạng/lỗi Google/người dùng hủy)
        Google-->>BE: Lỗi
        BE-->>Web: Lỗi E-authentication-008 (không tạo tài khoản dở dang)
        Web-->>User: Đăng nhập Google thất bại, thử lại
    else Callback thành công
        Google-->>BE: Email đã xác thực
        BE->>DB: Email Google đã có tài khoản chưa?
        alt Email đã có tài khoản
            BE->>DB: Tạo LinkedProvider, đánh dấu verified, ghi nhật ký tự liên kết
            Note over BE,DB: Tự liên kết, không hỏi mật khẩu cũ (FR-014)
        else Email chưa có
            BE->>DB: Tạo Account verified + LinkedProvider (FR-013)
        end
        BE->>DB: Tạo Session active
        BE-->>Web: OK + phiên
        Web-->>User: Đăng nhập, vào app
    end
```

## Flow: Quên mật khẩu — đặt lại + đăng xuất mọi phiên‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Liên quan: FR-authentication-016..020 | Error: E-authentication-002, 009 | BR: BR-authentication-007, 008 | Related UC: uc-forgot-password.

```mermaid
sequenceDiagram
    actor User
    participant Web as Web App
    participant BE as Backend
    participant DB as Database
    participant Mail as Email Service

    User->>Web: Bấm "Quên mật khẩu", nhập email, submit
    Web->>BE: Yêu cầu đặt lại
    BE->>DB: Email tồn tại?
    alt Email tồn tại
        BE->>DB: Tạo ResetToken pending, hạn 30 phút
        BE->>Mail: Gửi email đặt lại
    else Email không tồn tại
        Note over BE: Không gửi gì
    end
    BE-->>Web: Cùng một response (chống dò tài khoản)
    Web-->>User: Nếu email tồn tại, đã gửi link đặt lại

    Note over User,Mail: Người dùng mở email, bấm link đặt lại
    User->>Web: Bấm link đặt lại
    Web->>BE: Xác minh token
    alt Token hết hạn hoặc đã dùng
        BE-->>Web: Lỗi E-authentication-009
        Web-->>User: Link hết hạn, quên mật khẩu lại
    else Token hợp lệ
        BE-->>Web: OK
        Web-->>User: Form nhập mật khẩu mới (2 lần)
        User->>Web: Submit mật khẩu mới
        Web->>Web: Kiểm tra chính sách mật khẩu (E-002 nếu sai)
        Web->>BE: Gửi mật khẩu mới
        BE->>DB: Cập nhật Credential, ResetToken used
        BE->>DB: Thu hồi TOÀN BỘ Session mọi thiết bị (BR-007)
        BE-->>Web: Thành công
        Web-->>User: Đặt lại thành công, đăng nhập lại
    end
```

## Flow: Gỡ liên kết Google (buộc đặt mật khẩu trước nếu chưa có)

Liên quan: FR-authentication-023, 024, 003 | Error: E-authentication-010 | BR: BR-authentication-004 | Related UC: uc-unlink-google.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```mermaid
sequenceDiagram
    actor User
    participant Web as Web App
    participant BE as Backend
    participant DB as Database

    User->>Web: Vào màn bảo mật, bấm "Gỡ liên kết Google"
    Web->>BE: Yêu cầu gỡ liên kết Google
    BE->>DB: Tài khoản đã có mật khẩu chưa?
    alt Chưa có mật khẩu (gốc Google)
        BE-->>Web: Buộc tạo mật khẩu trước (E-authentication-010)
        Web-->>User: Chuyển form tạo mật khẩu
        User->>Web: Nhập mật khẩu đạt chính sách, submit
        Web->>Web: Kiểm tra chính sách mật khẩu (E-002 nếu sai)
        Web->>BE: Gửi mật khẩu mới
        BE->>DB: Tạo Credential (FR-024)
        BE->>DB: Gỡ LinkedProvider Google
        BE-->>Web: Đã gỡ liên kết
        Web-->>User: Đã gỡ Google, vẫn đăng nhập bằng email/mật khẩu
    else Đã có mật khẩu
        BE->>DB: Gỡ LinkedProvider Google (FR-023)
        BE-->>Web: Đã gỡ liên kết
        Web-->>User: Đã gỡ Google, vẫn đăng nhập bằng email/mật khẩu
    end
```


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
