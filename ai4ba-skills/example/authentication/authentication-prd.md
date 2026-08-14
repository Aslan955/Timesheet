---
type: prd
feature: authentication
status: draft
updated: 2026-07-19
links:
  - docs/authentication/authentication-urd.md
  - docs/authentication/authentication-brd.md
  - docs/authentication/srs/authentication-spec.md
---

# authentication — Product Requirements Document‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Product Overview‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Lớp xác thực nền tảng của app học tiếng Anh **english-ai-demo**: cho phép người học tạo danh tính bền vững bằng email + mật khẩu hoặc Google, xác nhận email, đăng nhập đa thiết bị, khôi phục mật khẩu và quản lý liên kết Google — có bảo vệ chống dò mật khẩu. Đây là điều kiện tiên quyết cho mọi tính năng phụ thuộc danh tính (đồng bộ tiến độ, gate tính năng trả phí).

**Gap neo:** Hiện tại người học dùng ẩn danh, tiến độ gắn thiết bị, không gate được tính năng trả phí → sau feature, người học có tài khoản đã xác nhận, đăng nhập được trên mọi thiết bị với cùng danh tính, và hệ thống nhận diện được người dùng để phục vụ thương mại hóa.

## 2. Goals‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### 2.1 Goals‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
- Người học tạo được tài khoản email đã xác nhận và bắt đầu học nhanh.
- Đăng nhập ổn định, đa thiết bị, không mất tiến độ.
- Google one-tap để giảm rào cản đăng ký.
- Khôi phục mật khẩu an toàn, tự phục vụ.
- Bảo vệ tài khoản khỏi dò mật khẩu và trùng tài khoản.

### 2.2 Non-goals‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
- Đăng nhập Apple/Facebook/SSO/magic link, passkey/sinh trắc học.
- Cảnh báo bảo mật khi đăng nhập lạ (để bản sau).
- Quản lý hồ sơ, subscription/thanh toán, onboarding sau đăng nhập (feature khác).
- Xóa tài khoản, đổi email (không bắt buộc theo PDPA SEA).

## 3. Personas

| Persona | Mô tả (1 dòng) | Nhu cầu chính | Nguồn |
|---------|----------------|---------------|-------|
| Người học | Học tiếng Anh trên web (mobile + desktop), khu vực SEA | Tài khoản ổn định, đồng bộ tiến độ đa thiết bị | UN-001, UN-003, UN-007 |
| Người dùng ưu tiên Google | Muốn vào app nhanh không cần đặt mật khẩu | Đăng ký/đăng nhập một chạm Google | UN-004, UN-005 |
| Người dùng quay lại | Từng dùng, quên mật khẩu | Khôi phục truy cập qua email | UN-006 |

## 4. Capabilities

| ID | Capability | Priority | Rationale (vì sao tier này) | Traces to (UN-* / BO-*) | Bóc ~N story | Done when (product outcome) | Sẵn sàng |
|----|------------|----------|-----------------------------|-------------------------|--------------|-----------------------------|----------|
| CAP-authentication-01 | Đăng ký email + xác nhận email | P0 | Cổng vào bắt buộc, gate nội dung học | UN-001, UN-002 / BO-authentication-01 | ~3 | Người học tạo được tài khoản verified và đăng nhập | ✅ |
| CAP-authentication-02 | Đăng nhập email + remember-me | P0 | Đường vào chính hằng ngày | UN-003, UN-007 / BO-authentication-02 | ~2 | Đăng nhập thành công, tùy chọn duy trì phiên | ✅ |
| CAP-authentication-03 | Đăng ký/đăng nhập Google + auto-link | P0 | Giảm rào cản, chống trùng tài khoản | UN-004, UN-005 / BO-authentication-01, BO-authentication-04 | ~2 | Vào app một chạm, một tài khoản/email | ✅ |
| CAP-authentication-04 | Khôi phục mật khẩu | P0 | Giữ người dùng quay lại | UN-006 / BO-authentication-03 | ~2 | Đặt lại mật khẩu, đăng xuất mọi phiên, đăng nhập lại | ✅ |
| CAP-authentication-05 | Quản lý phiên & gỡ liên kết Google | P0 | Kiểm soát truy cập đa thiết bị | UN-007, UN-008, UN-009 / BO-authentication-02 | ~2 | Đăng nhập đa thiết bị, đăng xuất thiết bị, gỡ Google an toàn | ✅ |
| CAP-authentication-06 | Bảo vệ chống dò mật khẩu | P0 | Bảo vệ tài khoản, chống lạm dụng | UN-010 / BO-authentication-02 | ~2 | Captcha sau 3 lần sai, khóa 24h sau 5 lần sai | ✅ |
| CAP-authentication-07 | Trải nghiệm & an toàn nâng cao (strength meter, device list, captcha đăng ký, xóa unverified) | P1 | Cải thiện an toàn/UX, không chặn ra mắt | UN-010 / BO-authentication-01 | ~3 | Có strength meter, danh sách thiết bị, captcha đăng ký | 🔄 |

## 5. Upstream Traceability

| Capability | Traces to (UN-* / BO-*) | Product outcome | Success metric |
|------------|-------------------------|-----------------|----------------|
| CAP-authentication-01 | UN-001, UN-002 / BO-authentication-01 | Tài khoản verified trước khi học | Tỷ lệ hoàn tất đăng ký |
| CAP-authentication-02 | UN-003, UN-007 / BO-authentication-02 | Đăng nhập ổn định đa thiết bị | Tỷ lệ đăng nhập thành công thiết bị mới |
| CAP-authentication-03 | UN-004, UN-005 / BO-authentication-01, BO-authentication-04 | Google one-tap, không trùng tài khoản | Tỷ lệ đăng ký Google; số ca trùng tài khoản |
| CAP-authentication-04 | UN-006 / BO-authentication-03 | Khôi phục truy cập an toàn | Tỷ lệ hoàn tất reset → đăng nhập |
| CAP-authentication-05 | UN-007, UN-008, UN-009 / BO-authentication-02 | Kiểm soát phiên/liên kết | Ticket đăng nhập/khóa tài khoản |
| CAP-authentication-06 | UN-010 / BO-authentication-02 | Tài khoản được bảo vệ | Số vụ dò mật khẩu bị chặn |

## 6. Key Capability Interactions

- **Đăng ký email (CAP-01) → Đăng nhập (CAP-02):** xác nhận email là điều kiện để đăng nhập; tài khoản `unverified` bị chặn ở CAP-02.
- **Google (CAP-03) ↔ Đăng ký email (CAP-01):** email trùng được auto-link thay vì tạo tài khoản mới; đảm bảo một danh tính/email.
- **Khôi phục mật khẩu (CAP-04) → Quản lý phiên (CAP-05):** đặt lại mật khẩu kích hoạt đăng xuất mọi phiên.
- **Gỡ Google (CAP-05) ↔ Đăng ký Google (CAP-03):** tài khoản gốc Google phải tạo mật khẩu (CAP-01) trước khi gỡ, để không mất lối vào.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
- **Bảo vệ dò mật khẩu (CAP-06) → Đăng nhập (CAP-02):** captcha/khóa chèn vào luồng đăng nhập theo số lần sai.

## 7. Success Metrics

| Metric | Baseline | Target | Measurement Method | Timeframe |
|--------|----------|--------|--------------------|-----------|
| Tỷ lệ hoàn tất đăng ký (verified) | Chưa có — đo 2 tuần đầu | ≥ 60% | visitor bắt đầu đăng ký → tài khoản verified | Hàng tháng |
| Đăng nhập thành công thiết bị mới | Chưa có | ≥ 95% | thành công / tổng lượt đăng nhập thiết bị mới | Hàng tháng |
| Hoàn tất khôi phục mật khẩu | Chưa có | ≥ 80% | yêu cầu reset → đăng nhập lại | Hàng tháng |
| Trùng tài khoản / email | 0 mong muốn | 0 | log/ticket trùng tài khoản | Hàng quý |

## 8. Dependencies

| Dependency | Owner | Status | Needed-by | Impact if Late |
|------------|-------|--------|-----------|----------------|
| Dịch vụ email giao dịch (verify + reset) | Đội kỹ thuật | Chưa xác nhận | CAP-01, CAP-04 | Kẹt luồng đăng ký + khôi phục |
| Google OAuth client (đăng ký + cấu hình) | Đội kỹ thuật | Chưa xác nhận | CAP-03 | Mất phương thức Google |
| Cơ sở dữ liệu người dùng/hồ sơ | Đội kỹ thuật | Giả định có | Tất cả | Chặn toàn bộ feature |
| Feature onboarding (nhận chuyển tiếp) | Product | Phát triển sau | CAP-02, CAP-03 | Người dùng vào thẳng app thay vì onboarding |

## 9. Assumptions & Validation

| Assumption | Impact if Wrong | Validation | Status |
|------------|-----------------|------------|--------|
| Email là định danh duy nhất cho cả 2 phương thức | Auto-link sai, gộp nhầm tài khoản | Xác nhận với kỹ thuật trước khi chốt SRS | Đã đưa vào SRS BR-002 |
| Dịch vụ email đáng tin cậy | Email không tới → kẹt luồng chính | Chọn nhà cung cấp + cấu hình SPF/DKIM/DMARC | Chưa validate |
| Auto-link Google không cần xác minh lại là chấp nhận được | Nguy cơ chiếm tài khoản | Audit log + cân nhắc bước xác minh bản sau | Rủi ro đã ghi nhận |

## 10. Product Risks

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Email xác nhận/đặt lại không tới inbox | Thỉnh thoảng | Cao | Nhà cung cấp uy tín, cấu hình xác thực domain, resend + hỗ trợ | Đội kỹ thuật |
| Google OAuth lỗi cấu hình/quota | Hiếm | Cao | Giám sát, email login làm dự phòng | Đội kỹ thuật |
| Chiếm tài khoản qua auto-link Google | Thỉnh thoảng | Cao | Audit log, cân nhắc xác minh quyền sở hữu ở P1 | Bảo mật |
| Bot đăng ký rác | Thỉnh thoảng | Trung bình | Captcha đăng ký (CAP-07), gate verify email | Product |

## 11. Release & Launch Readiness

### 11.1 Release Horizon

| Horizon | Capabilities | Target | Status |
|---------|--------------|--------|--------|
| Now | CAP-01, CAP-02, CAP-03, CAP-04, CAP-05, CAP-06 | Bản ra mắt cốt lõi (mọi P0) | 🔄 đang xây/tài liệu |
| Next | CAP-07 (strength meter, device list, captcha đăng ký, xóa unverified) | Sau ra mắt cốt lõi | ⬜ |
| Later | Passkey/sinh trắc học, cảnh báo bảo mật đăng nhập lạ | Chưa lên lịch | ⬜ |

### 11.2 Launch Readiness

| Workstream | Must-pass criteria | Status | Guardrail metric (threshold → decision) |
|------------|--------------------|--------|-----------------------------------------|
| Chức năng | Mọi P0 (CAP-01..06) hoạt động đúng SRS | 🔄 | Test P0 pass 100% → mới go-live |
| Bảo mật | Không lưu/log mật khẩu plaintext; captcha/khóa hoạt động | ⬜ | Rà soát bảo mật đạt → go-live |
| Tuân thủ | Chính sách PDPA + lưu giữ dữ liệu sẵn sàng | ⬜ | Pháp lý duyệt → go-live |
| Email/OAuth | Email verify/reset gửi tới được; Google OAuth ổn định | ⬜ | Tỷ lệ gửi email ≥ 98% → go-live |

## 12. Open Questions

*Không còn câu hỏi mở cấp sản phẩm — phạm vi capability và ưu tiên P0/P1 đã chốt từ brainstorm + SRS. Các phụ thuộc (email, OAuth, DB) cần xác nhận trạng thái khi triển khai, đã theo dõi ở Mục 8.*‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
