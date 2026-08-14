---
type: brainstorm
feature: authentication
status: draft
updated: 2026-07-19
links: []
---

# Email + Google Auth — Brainstorm‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Idea Seed‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đăng nhập ứng dụng, hỗ trợ 2 phương thức:
- Email + password (signup + login)
- Google account (signup + login OAuth)

Là foundational auth của app **english-ai-demo** (app học tiếng Anh). User cần account để sync learning progress giữa devices và truy cập paid features.

## 2. Context‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- App học tiếng Anh, cần persistent user identity để:
  - Sync learning progress (vocab học, bài làm, streak) qua nhiều device.
  - Gate paid features (subscription / one-off purchase).
- Đây là **brainstorm đầu tiên** của feature `authentication` — bao gồm cả signup + login flow cho 2 methods.
- Không support Apple Sign-In, Facebook, magic link, SSO (out of scope theo quyết định user).
- **Region: Đông Nam Á** (VN, SG, TH, ID, MY, PH). KHÔNG serve EU/EEA → không cần tuân GDPR; vẫn cần privacy policy đáp ứng PDPA SG/TH + Nghị định 13/2023/NĐ-CP VN.
- **Platform: Responsive webapp** (mobile + desktop browser). KHÔNG có native iOS/Android app.

## 3. User Types (preliminary)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| User Type         | Pain Point                               | Primary Need                                              |
| ----------------- | ---------------------------------------- | --------------------------------------------------------- |
| Free learner      | Mất progress khi đổi máy / reinstall app | Tài khoản nhẹ, signup nhanh để sync                       |
| Paid learner      | Mất quyền paid khi không identify được   | Login ổn định trên nhiều device, không bị log-out bất ngờ |
| Returning user    | Quên password                            | Forgot-password flow đơn giản qua email                   |
| Google-first user | Ngại tạo password mới                    | One-tap Google sign-in/signup                             |

## 4. Capabilities Breakdown‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### P0 — must have
- **Email + password signup** với email verification BẮT BUỘC trước khi dùng app (gate access tới learning content).
- **Email + password login** + remember-me.
- **Email verification flow** — gửi link qua email, expire 24h, resend được (cooldown 60s, max 5 lần/ngày).
- **Google OAuth signup + login** — flow chuẩn OAuth 2.0, không hỏi thêm field nào ngoài những gì Google trả.
- **Forgot password flow** — request reset qua email (link expire 30 phút), set new password, **logout all sessions sau khi reset**.
- **Password policy**: 8-20 ký tự, có chữ thường + chữ in hoa + ký tự đặc biệt; không chứa phần đầu email (local-part).
- **Account linking tự động**: signup email A, sau đó login Google cùng email A → auto-link vào cùng account (không tạo duplicate, không yêu cầu nhập password cũ).
- **Multi-device login** — không giới hạn số device, không session timeout.
- **Remember-me** — persistent login 30 ngày trên device, default OFF.
- **Multi-platform** — Web + Mobile (cùng credential, cùng account).
- **Gỡ liên kết Google** — user có thể gỡ Google khỏi account. Nếu account chưa có password (signup ban đầu qua Google) → BẮT BUỘC tạo password trước khi gỡ (tránh . Sau khi gỡ, vẫn login được bằng email/password.
- **Brute-force protection** — sau 3 lần sai → captcha, sau 5 lần sai → khóa tài khoản 24h (auto-unlock).

### P1 — should have
- Password strength meter real-time khi nhập.
- Device list / "logged-in devices" view + manual logout từng device.
- Captcha cho signup chống bot.

### P2 — nice to have
- Passkey / biometric login (Face ID, fingerprint).
- Security alerts qua email khi login từ device/location lạ.
- Magic link login (passwordless fallback) — note: user đã exclude, để P2 reference.
- Change-password trong khi đang login.

> P0/P1/P2 là tentative; final scope chốt ở `/prd authentication`.

## 5. Core Flows (Happy Path)

### 5.1 Signup Email + Password
1) User mở app → thấy Homepage.
2) Click "Đăng nhập" → ra Login page (form Email/password + nút Google + link "Đăng ký").
3) Click link "Đăng ký" → ra Signup form (email + password).
4) Submit → system validate password policy + check email tồn tại.
5) Nếu email đã có → block, hiện thông báo gợi ý đăng nhập / quên mật khẩu.
6) Nếu OK → tạo tài khoản trạng thái `unverified` + gửi email xác nhận (link 24h).
7) User thấy trang "Đã gửi email xác nhận" + nút Resend.

### 5.2 Email Verification
1) User mở email → click verify link.
2) Hệ thống check link còn hạn + chưa dùng → mark account `verified`.
3) User thấy trang "Xác nhận thành công, vui lòng đăng nhập".
4) Phải login lại (không auto-login).

**ASCII Diagram — Signup + Verify:**

```
┌──────────────┐
│ Homepage     │
└──────┬───────┘
       │ click "Đăng nhập"
       ▼
┌──────────────┐
│ Login page   │  (Email/pwd + nút Google + link "Đăng ký")
└──────┬───────┘
       │ click "Đăng ký"
       ▼
┌──────────────────┐
│ Signup form      │
│ - email          │
│ - password       │
└──────┬───────────┘
       │ submit
       ▼
   ┌───────────────────┐
   │ Validate password │ ─NO→ Inline error: "Mật khẩu cần 8-20..."
   │ policy            │
   └───────┬───────────┘
           │ YES
           ▼
   ┌───────────────────┐      YES   ┌──────────────────────┐
   │ Email đã tồn tại? │ ─────────→ │ Block + "Email đã    │
   │                   │            │ được đăng ký..."     │
   └───────┬───────────┘            └──────────────────────┘
           │ NO
           ▼
   ┌───────────────────┐
   │ Tạo account       │
   │ status=unverified │
   └───────┬───────────┘
           │
           ▼
   ┌───────────────────┐
   │ Gửi verify email  │  (link expire 24h)
   └───────┬───────────┘
           ▼
   ┌──────────────────────────────┐
   │ "Đã gửi email xác nhận tới   │
   │ {email}..."  + nút Resend    │
   │ (cooldown 60s, max 5/ngày)   │
   └──────────────────────────────┘

           [user mở email, click link]
                       │
                       ▼
            ┌──────────────────┐
            │ Token còn hạn +  │ ─NO→ "Link hết hạn / đã dùng,
            │ chưa dùng?       │       [Gửi lại link]"
            └────────┬─────────┘
                     │ YES
                     ▼
            ┌──────────────────┐
            │ Mark verified    │
            │ Token = used     │
            └────────┬─────────┘
                     ▼
            ┌──────────────────────────┐
            │ "Xác nhận thành công!    │
            │ Vui lòng đăng nhập."     │
            │ → redirect Login page    │
            └──────────────────────────┘

  [Background] Account unverified > 24h → tự xóa
```

### 5.3 Login Email + Password
1) User vào Login page → nhập email + password → submit.
2) Hệ thống check khớp + check trạng thái `verified` (chưa verify thì chặn).
3) Check số lần fail (≥3 → captcha, ≥5 → lockout 24h).
4) OK → tạo session → vào app. Remember-me default OFF.

### 5.4 Signup / Login Google OAuth
1) User click "Đăng nhập với Google" → redirect Google consent screen.
2) User approve → callback về app.
3) Hệ thống check email Google đã có trong DB chưa.
4) Nếu chưa → tạo account mới `verified` (Google đã xác thực email).
5) Nếu có → auto-link Google vào account hiện hữu, mark verified, login luôn.
6) Không tách signup vs login — Google OAuth chỉ có 1 luồng duy nhất.

**ASCII Diagram — Login Email + Google OAuth:**

```
┌──────────────┐
│ Login page   │
└──┬───────┬───┘
   │       │
   │       │ click "Đăng nhập với Google"
   │       │
   │       └──────────────────────┐
   │                              ▼
   │                  ┌───────────────────────┐
   │                  │ Redirect to Google    │
   │                  │ consent screen        │
   │                  └───────┬───────────────┘
   │                          │
   │           [user đóng tab │ ↶ no state saved]
   │                          ▼ user approve
   │                  ┌───────────────────────┐  fail
   │                  │ Google callback OK?   │ ────→ "Đăng nhập Google
   │                  └───────┬───────────────┘       thất bại, thử lại"
   │                          │ OK                    (no half-account)
   │                          ▼
   │                  ┌──────────────────────┐
   │                  │ Email Google đã      │
   │                  │ tồn tại trong hệ?    │
   │                  └────┬─────────────┬───┘
   │                   YES │             │ NO
   │                       ▼             ▼
   │             ┌──────────────┐  ┌──────────────┐
   │             │ Auto-link +  │  │ Tạo account  │
   │             │ mark verified│  │ verified     │
   │             └──────┬───────┘  └──────┬───────┘
   │                    └────────┬────────┘
   │                             ▼
   │                    ┌────────────────┐
   │                    │ Login → app    │
   │                    └────────────────┘
   │
   │ submit email + password
   ▼
┌─────────────────────┐
│ Email + password    │ ──NO──→ Counter fail++
│ khớp?               │         "Email hoặc mật khẩu
└──────┬──────────────┘         không đúng"
       │ YES                      │
       ▼                          ▼
┌─────────────────────┐    ┌──────────────────┐
│ Account verified?   │    │ Fail count check │
└──┬──────────────┬───┘    ├──────────────────┤
   │ NO           │ YES    │ ≥3 → captcha     │
   ▼              ▼        │ ≥5 → lockout 24h │
"Tài khoản    ┌──────────┐ │  "Tài khoản tạm  │
chưa xác      │ Account  │ │   khóa..."       │
nhận..."      │ status?  │ └──────────────────┘
[Gửi lại]     └──┬───────┘
              locked? → "Tạm khóa, thử sau Xh"
              else → tạo session → vào app
                     (remember-me 30 ngày nếu tick)
```

### 5.5 Forgot Password
1) User click "Quên mật khẩu" → form nhập email → submit.
2) Hệ thống gửi reset link (30 phút TTL) — luôn hiện thông báo "Nếu email tồn tại trong hệ thống, đã gửi link" (anti-enumeration).
3) User click link → form đặt password mới (nhập 2 lần).
4) Submit → update password + logout all sessions trên mọi device.
5) User thấy trang "Đặt lại thành công" → redirect Login → phải login lại.

**ASCII Diagram — Forgot Password:**

```
┌──────────────┐
│ Login page   │
└──────┬───────┘
       │ click "Quên mật khẩu"
       ▼
┌─────────────────┐
│ Form: nhập email│
└──────┬──────────┘
       │ submit
       ▼
┌────────────────────────┐
│ Email tồn tại?         │
└─────┬─────────────┬────┘
   YES│             │ NO
      ▼             │
┌──────────────┐    │
│ Gửi reset    │    │
│ link         │    │
│ (TTL 30 phút)│    │
└──────┬───────┘    │
       └─────┬──────┘
             ▼
┌──────────────────────────────────┐
│ "Nếu email tồn tại trong hệ      │  (anti-enumeration:
│ thống, đã gửi link đặt lại."     │   cùng wording cho
└──────────────────────────────────┘   cả 2 nhánh)

       [user mở email, click link]
                   │
                   ▼
       ┌──────────────────────┐
       │ Token còn hạn +      │ ─NO→ "Link hết hạn,
       │ chưa dùng?           │      [Quên mật khẩu] lại"
       └──────────┬───────────┘
                  │ YES
                  ▼
       ┌──────────────────────┐
       │ Reset form: nhập     │
       │ password mới 2x      │
       └──────────┬───────────┘
                  │ submit
                  ▼
       ┌──────────────────────┐
       │ Password match policy│ ─NO→ Inline error
       └──────────┬───────────┘
                  │ YES
                  ▼
       ┌──────────────────────┐
       │ Update password      │
       │ Token = used         │
       │ Logout ALL sessions  │
       └──────────┬───────────┘
                  ▼
       ┌──────────────────────────┐
       │ "Đặt lại thành công.     │
       │ Vui lòng đăng nhập lại." │
       │ → redirect Login         │
       └──────────────────────────┘
```

### 5.6 Logout
1) User trigger logout từ menu (vị trí cụ thể chốt ở `/wireframe`).
2) Logout chỉ device hiện tại (không ảnh hưởng device khác).
3) Không confirm dialog.

## 6. System Behavior Deep Dive

### 6.1 Decision Points

| ID | Flow | Khi nào | YES | NO |
|---|---|---|---|---|
| D1 | Signup email | Email đã tồn tại | Block + "Email đã được sử dụng, đăng nhập?" | Tạo account `unverified` + gửi verify |
| D2 | Signup email | Password đáp ứng policy | Tiếp | Inline error realtime |
| D3 | Login email | Email + password khớp | Tiếp D4 | "Email hoặc mật khẩu không đúng" (generic) |
| D4 | Login email | Account đã verified | Cho vào app | Block + "Tài khoản chưa được xác nhận" + nút resend |
| D5 | Login email | Số lần fail vượt threshold | Captcha (≥3) / Lockout 24h (≥5) | Cho thử tiếp |
| D6 | Google OAuth callback | Email Google đã có | Auto-link → login | Tạo account mới `verified` |
| D7 | Forgot password | Email tồn tại | Gửi reset link | (vẫn hiện cùng message — anti-enumeration) |
| D8 | Verify / Reset link | Token còn hạn + chưa dùng | Process | "Link hết hạn / đã dùng, gửi lại?" |
| D9 | Gỡ liên kết Google | Account đã có password (login email/pw được) | Gỡ Google, giữ email/pw login | Buộc user tạo password trước; sau khi tạo xong mới gỡ Google |
| D10 | Sau signup/login thành công | Onboarding đã xong | Vào app chính | Redirect tới onboarding flow (feature riêng, phát triển sau) |

### 6.2 Scenario Matrix

*Không applicable — feature này không có multi-role state matrix (chỉ 1 user dùng 1 flow tại 1 thời điểm).*

### 6.3 State Transitions

| Entity | Từ | Sang | Trigger | Quay lại được? |
|---|---|---|---|---|
| Account | (none) | `unverified` | Signup email thành công | Không |
| Account | (none) | `verified` | Signup Google thành công | Không |
| Account | `unverified` | `verified` | Click verify link còn hạn | Không |
| Account | `verified` | `locked` | Sai password 5 lần | Có (auto-unlock 24h) |
| Account | `locked` | `verified` | 24h trôi qua | Có |
| Verify link | `pending` | `used` | Click thành công | Không |
| Verify link | `pending` | `expired` | Quá 24h | Không |
| Reset link | `pending` | `used` | Reset thành công | Không |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| Reset link | `pending` | `expired` | Quá 30 phút | Không |
| Session | `active` | `revoked` | User logout / Forgot-pw reset (logout all) / Admin disable | Không |

### 6.4 Interrupted Transactions

| Tình huống | Hệ thống còn lại gì | Resume | Cleanup |
|---|---|---|---|
| User đóng browser sau signup, chưa verify | Account `unverified` + verify link trong inbox | Click link cũ trong inbox để verify | Account `unverified` quá 24h → tự xóa |
| User đóng tab giữa Google OAuth | Không có gì lưu (chưa callback) | Bắt đầu lại từ đầu | Không cần |
| Google OAuth callback fail (mạng/lỗi Google) | KHÔNG tạo account dở dang (chỉ tạo khi callback thành công) | "Đăng nhập Google thất bại, thử lại" | — |
| Verify link hết hạn user click | Link `expired` | "Link hết hạn, [Gửi lại]" | Link cũ marked expired |
| User signup email (`unverified`) → sau dùng Google cùng email | Account cũ `unverified` | Auto-link + mark verified luôn | — |
| 2 device cùng click verify link | 1 thành công, 1 báo "đã dùng" | — | — |
| User reset password trong khi device khác đang login | Tất cả session bị revoke | Login lại từ đầu | — |
| User đang login, mạng rớt khi submit | Không tạo session, form data mất | Submit lại | **Lỗi mạng KHÔNG tính vào counter fail** |
| User đang login, admin disable account | Token bị reject ngay lần API call kế (logout ngay) | — | — |
| User gỡ Google nhưng chưa hoàn tất tạo password | Account vẫn link Google (chưa thực sự gỡ) | Quay lại form tạo password để tiếp tục | Không cleanup, user retry |

### 6.5 Other Edge Cases

- **Google email khác hoàn toàn email đã có account**: tạo account mới, không link.
- **Email bounce / không nhận được verification**: resend (cooldown 60s, max 5/ngày) + support contact.
- **Remember-me trên device công cộng**: trách nhiệm user (không hiện cảnh báo); P1 device list cho phép logout từ xa.
- **Password reset trong khi nhiều device đang login**: tất cả bị logout (đã quyết).
- **2 device cùng login bằng password mới**: cùng work song song, không conflict.

## 7. Validation, Limits & Wording

### 7.1 Validation rules

| Field | Rule |
|---|---|
| Email | Định dạng email hợp lệ; unique trong hệ thống |
| Password | 8-20 ký tự, ≥1 chữ hoa, ≥1 chữ thường, ≥1 ký tự đặc biệt; KHÔNG chứa local-part email (≥3 ký tự, không phân biệt hoa/thường) |

### 7.2 Limits & Quotas (exact values)

| Tham số | Giá trị | Ghi chú |
|---|---|---|
| Verify email link TTL | **24 giờ** | Sau hạn → expired, request resend |
| Reset password link TTL | **30 phút** | Sau hạn → expired |
| Resend cooldown | **60 giây** giữa 2 lần | Áp cho cả verify + reset |
| Resend daily limit | **5 lần/ngày** | Tránh spam inbox |
| Captcha trigger | **≥ 3 lần fail** liên tiếp | Cho 1 account |
| Lockout trigger | **≥ 5 lần fail** liên tiếp | Cho 1 account |
| Lockout duration | **24 giờ** | Auto-unlock, không cần admin |
| Remember-me lifetime | **30 ngày** | Default OFF |
| Account `unverified` cleanup | **> 24 giờ** chưa verify → tự xóa | Background job |

### 7.3 Wording samples (exact strings tiếng Việt)

#### Error messages

| Tình huống | Wording | Code |
|---|---|---|
| Signup: email đã tồn tại | "Email này đã được đăng ký. Bạn muốn [đăng nhập] hoặc [quên mật khẩu]?" | E-? |
| Signup: password yếu | "Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn" | E-? |
| Login: sai email/password | "Email hoặc mật khẩu không đúng" | E-? |
| Login: chưa verify | "Tài khoản chưa được xác nhận. [Gửi lại email xác nhận]" | E-? |
| Login: đang lockout | "Tài khoản tạm khóa do nhiều lần đăng nhập sai. Vui lòng thử lại sau {X} giờ." | E-? |
| Verify link hết hạn | "Link đã hết hạn hoặc đã được sử dụng. [Gửi lại link xác nhận]" | E-? |
| Reset link hết hạn | "Link đã hết hạn. [Quên mật khẩu] lại để nhận link mới." | E-? |
| Google OAuth fail | "Đăng nhập Google thất bại. Vui lòng thử lại." | E-? |

#### Success messages

| Tình huống | Wording |
|---|---|
| Verify email thành công | "Xác nhận email thành công! Vui lòng đăng nhập để tiếp tục." |
| Reset password thành công | "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại." |
| Google OAuth auto-link | "Tài khoản Google đã được liên kết với account email của bạn." |

#### Info / neutral messages

| Tình huống | Wording |
|---|---|
| Signup thành công, chưa verify | "Đã gửi email xác nhận tới {email}. Vui lòng kiểm tra hộp thư để kích hoạt tài khoản." |
| Forgot password submit (anti-enumeration) | "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu." |

*Mã code `E-?` để map sang `srs/spec.md` Error Matrix ở `/srs authentication`.*

## 8. Assumptions

- Email là **primary unique identifier** cho account (cả 2 methods cùng dùng email key để link).
- Không có age-gate / minor protection requirement.
- Region: **Đông Nam Á** (VN, SG, TH, ID, MY, PH). KHÔNG serve EU/EEA.
- Platform: **Responsive webapp** (browser-based, không native iOS/Android app). Mobile browser là kênh chính.
- Không yêu cầu phone number, profile fields lúc signup (chỉ email + password). Display name / avatar / locale add sau.
- Email service (transactional) sẵn sàng dùng.
- App đã có user/profile DB hoặc sẽ tạo cùng feature này.

## 9. Risks

| Rủi ro | Khả năng | Hậu quả nghiệp vụ | Cách phòng |
|--------|----------|-------------------|-----------|
| Bot signup spam → fake accounts inflate metrics (Adoption) | thỉnh thoảng | Báo cáo conversion sai → quyết định business dựa trên metric ảo | Captcha cho signup (P1), gate verify email bắt buộc trước khi access app |
| Email không tới inbox (spam/bounce/blacklist) (Vendor) | thỉnh thoảng | User signup không complete → mất user mới, support load tăng vì user complain | Chọn email service uy tín (SPF/DKIM/DMARC config đúng), resend cooldown 60s + max 5/ngày, support email fallback |
| Google OAuth quota / config sai chặn login (Vendor) | hiếm | Toàn bộ nhánh Google login fail → mất 1 method signup chính, giảm conversion | Monitor OAuth dashboard, email login luôn available làm fallback |
| Auto-link Google không re-verify ownership (Compliance/Security) | thỉnh thoảng | Kẻ tấn công có Google email trùng có thể chiếm tài khoản → vi phạm bảo mật, có thể phải bồi thường user | Theo dõi report; cân nhắc thêm bước verify ownership ở P1, audit log auto-link events |
| Weak password policy (Compliance) | thỉnh thoảng | Account bị compromise → user complaint, fail security audit, brand damage | Lockout 5 lần fail + captcha 3 lần; **min 8 ký tự + cấm chứa local-part email (CR-20260627-001, resolved)** |
| Data breach làm leak password hash (Compliance) | hiếm | Vi phạm pháp luật bảo vệ dữ liệu, mất danh tiếng, bồi thường user, có thể bị phạt | Hash thuật toán mạnh (chốt ở `/srs`), audit logging mọi access tới password storage, never log plaintext |
| Multi-device login không có session timeout (Process) | thỉnh thoảng | Account bị truy cập trái phép trên device công cộng → complaint, churn | Device list + manual revoke (P1), email security alert khi login lạ (P2) |
| Compliance PDPA (SG/TH/VN) chưa đáp ứng đủ (Compliance) | thỉnh thoảng | Vi phạm luật bảo vệ dữ liệu địa phương → phạt hành chính, brand damage, có thể bị chặn ở 1 số nước SEA | Privacy policy đáp ứng PDPA SG/TH + Nghị định 13/2023/NĐ-CP VN trước launch; cookie consent banner; data retention policy rõ ràng |

## 10. Success Criteria (preliminary)

- **Signup conversion rate** (visitor → completed account với email verified) — primary metric.
- Phụ (recommended tracking, chưa chốt):
  - Time-to-first-login (signup → first authenticated session).
  - Google vs email signup ratio.
  - Email verification completion rate.
  - Drop-off step trong signup funnel.

*Chốt formal metrics ở `/urd` hoặc `/brd`.*

## 11. Open Questions

**Resolved trong session 2026-05-15:**
- [x] OQ-1 Account linking: auto-link Google vào account email cùng địa chỉ, không yêu cầu re-verify password (risk acceptable, mitigation ở Mục 9).
- [x] OQ-2 Forgot password: **logout all sessions** sau khi reset.
- [x] OQ-5 Verify email link expiry: **24 giờ**.
- [x] OQ-7 Remember-me lifetime: **30 ngày**, default OFF.
- [x] OQ-8 Brute-force threshold: captcha sau 3 lần fail, lockout 24h sau 5 lần fail.

**Resolved trong session 2026-05-16:**
- [x] OQ-3: **Region / compliance** — SEA-only (VN/SG/TH/ID/MY/PH), KHÔNG EU. Cần privacy policy đáp ứng PDPA SG/TH + Nghị định 13/2023/NĐ-CP VN; không cần GDPR. Xóa account + đổi email vẫn out-of-scope (PDPA SEA không bắt buộc).
- [x] OQ-4: **Platform** — Responsive webapp only, không native iOS/Android → không cần lo Apple Sign-In requirement.
- [x] OQ-6: **Account khi gỡ Google link** — vẫn login email/password. Nếu account chưa có password (signup gốc qua Google) → BẮT BUỘC tạo password trước khi gỡ Google.
- [x] OQ-9: **Approach** — tự build (self-built), không dùng BaaS. Timeline/budget chưa cần fix.
- [x] OQ-10: **Paid feature gating** — sau signup/login lần đầu, nếu chưa onboarding → redirect tới onboarding flow (feature `onboarding` riêng, phát triển sau). Auth không xử lý subscription status trực tiếp.

## 12. Next Steps

Sau brainstorm này (sau khi BA approve):
- `/urd authentication` — capture user perspective, personas, journeys.
- `/brd authentication` — business case, success metrics, ROI.
- `/prd authentication` — product scope, capabilities P0/P1/P2 final, flows.

*KHÔNG nhảy thẳng SRS — qua PRD trước.*‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
