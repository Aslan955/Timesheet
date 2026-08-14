---
type: brd
feature: authentication
status: draft
updated: 2026-07-19
links:
  - docs/authentication/brainstorms/email-and-google-auth.md
  - docs/authentication/authentication-urd.md
---

# authentication — Business Requirements Document‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Executive Summary‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

App học tiếng Anh **english-ai-demo** cần một nền tảng xác thực để biến người dùng ẩn danh thành người học có danh tính bền vững. Không có tài khoản, người học mất tiến độ khi đổi thiết bị và app không thể mở khóa (gate) các tính năng trả phí — hai điều trực tiếp làm giảm giữ chân người dùng và doanh thu. Feature này cung cấp đăng ký/đăng nhập bằng email + mật khẩu và Google, có xác nhận email, khôi phục mật khẩu và bảo vệ chống dò mật khẩu, phục vụ thị trường Đông Nam Á trên nền web responsive. Mục tiêu kinh doanh trọng tâm là tăng tỷ lệ hoàn tất đăng ký và giữ được người học qua nhiều thiết bị, làm bệ đỡ cho việc bán tính năng trả phí sau này.

## 2. Business Problem & Context‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### 2.1 Problem Statement‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| ID | Business Condition | Baseline | Business Impact | Evidence |
|----|--------------------|----------|-----------------|----------|
| BP-authentication-01 | Người học không có danh tính bền vững, mất tiến độ khi đổi/ cài lại thiết bị | Chưa có hệ thống tài khoản | Rời bỏ app, giảm giữ chân, mất người học tiềm năng trả phí | Observed: URD Mục 1 |
| BP-authentication-02 | App không nhận diện được người dùng nên không thể gate tính năng trả phí | 0 khả năng gate paid | Không thể thu tiền từ tính năng cao cấp → chặn dòng doanh thu | Observed: brainstorm Mục 2 |
| BP-authentication-03 | Không có cách khôi phục truy cập khi quên mật khẩu | Chưa có | Mất người dùng quay lại, tăng tải hỗ trợ | Observed: URD UN-006 |

### 2.2 Opportunity & Why Now‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Xác thực là **feature nền tảng bắt buộc phải có trước** thì các tính năng sinh doanh thu (subscription, mua lẻ) và tính năng giữ chân (đồng bộ tiến độ, streak) mới hoạt động được. Xây ngay bây giờ mở khóa toàn bộ lộ trình sản phẩm phía sau; trì hoãn sẽ chặn mọi feature phụ thuộc danh tính. Thị trường mục tiêu (Đông Nam Á) không đòi hỏi tuân thủ GDPR, giúp giảm độ phức tạp và rút ngắn thời gian ra mắt.

### 2.3 Strategic Alignment

Hỗ trợ mục tiêu chiến lược "giữ chân người học và thương mại hóa" bằng cách tạo lớp danh tính mà mọi tính năng trả phí và cá nhân hóa đều dựa vào. Không có nó, các sáng kiến tăng trưởng và doanh thu khác không thể triển khai.

## 3. Current State, Future State & Gap

### 3.1 Current State (AS-IS)

App chưa có tài khoản: người học dùng ẩn danh, tiến độ gắn với thiết bị/trình duyệt. Đổi máy hoặc xóa dữ liệu trình duyệt là mất hết. Không có cách phân biệt người dùng trả phí với miễn phí.

### 3.2 Future State (TO-BE)

Người học tạo tài khoản bằng email hoặc Google, xác nhận email, và đăng nhập trên nhiều thiết bị với cùng danh tính. Tiến độ theo tài khoản (không theo thiết bị). Hệ thống nhận diện người dùng để phục vụ gate tính năng trả phí. Có khôi phục mật khẩu an toàn và bảo vệ chống dò mật khẩu.

### 3.3 Gap

| Gap | Mô tả | Ưu tiên |
|-----|-------|---------|
| Lớp danh tính | Xây đăng ký/đăng nhập email + Google với xác nhận email | Cao |
| Khôi phục truy cập | Luồng quên mật khẩu qua email, đăng xuất mọi phiên sau reset | Cao |
| Bảo vệ tài khoản | Captcha + khóa tạm chống dò mật khẩu | Cao |
| Liên kết đa phương thức | Tự động gộp Google với tài khoản email cùng địa chỉ | Trung bình |

## 4. Stakeholders

| Stakeholder Role | Interest | Influence | Stakeholder Requirement / Expectation |
|------------------|----------|-----------|----------------------------------------|
| Chủ sản phẩm (Product Owner) | Mở khóa doanh thu + giữ chân | Cao | Đăng nhập ổn định, tỷ lệ hoàn tất đăng ký cao |
| Người học (end-user) | Vào app dễ, không mất tiến độ | Cao | Đăng ký nhanh, đăng nhập đa thiết bị, khôi phục mật khẩu đơn giản |
| Đội vận hành / hỗ trợ | Ít ticket đăng nhập | Trung bình | Wording lỗi rõ ràng, luồng khôi phục tự phục vụ |
| Phụ trách tuân thủ / pháp lý | Đáp ứng PDPA khu vực | Trung bình | Chính sách quyền riêng tư + lưu trữ dữ liệu đúng luật SEA |
| Đội kỹ thuật | Khả thi, an toàn | Trung bình | Chuẩn OAuth, lưu mật khẩu an toàn, chống lạm dụng |

## 5. Business Objectives & Success Measures

| ID | Objective | Baseline | Target | Timeframe | Success Measure |
|----|-----------|----------|--------|-----------|-----------------|
| BO-authentication-01 | Tăng tỷ lệ hoàn tất đăng ký (đã xác nhận email) | Chưa có — đo 2 tuần đầu | ≥ 60% | 1 quý sau ra mắt | Tỷ lệ visitor bắt đầu đăng ký → tài khoản verified |
| BO-authentication-02 | Giữ người học qua nhiều thiết bị | Chưa có | ≥ 95% đăng nhập thiết bị mới thành công | 1 quý sau ra mắt | Tỷ lệ đăng nhập thành công trên thiết bị mới |
| BO-authentication-03 | Giảm mất người dùng do quên mật khẩu | Chưa có | ≥ 80% yêu cầu reset → đăng nhập lại | 1 quý sau ra mắt | Tỷ lệ hoàn tất khôi phục mật khẩu |
| BO-authentication-04 | Tránh trùng tài khoản làm sai dữ liệu người dùng | 0 mong muốn | 0 tài khoản trùng / email | Liên tục | Số ca trùng tài khoản cho một email |

## 6. Business Scope

### 6.1 In Scope

* Đăng ký/đăng nhập bằng email + mật khẩu, có xác nhận email bắt buộc.
* Đăng ký/đăng nhập bằng Google, tự động liên kết với email trùng.
* Khôi phục mật khẩu qua email, đăng xuất mọi phiên sau khi đặt lại.
* Đăng nhập đa thiết bị, đăng xuất thiết bị hiện tại, gỡ liên kết Google.
* Bảo vệ chống dò mật khẩu (captcha, khóa tạm 24 giờ).

### 6.2 Out of Scope

* Đăng nhập Apple/Facebook/SSO/magic link; passkey/sinh trắc học; cảnh báo bảo mật; danh sách thiết bị.
* Quản lý hồ sơ, gói/subscription, onboarding sau đăng nhập (feature khác).
* Xóa tài khoản, đổi email (không bắt buộc theo PDPA SEA).

### 6.3 Assumptions

* Email là định danh duy nhất, dùng chung cho cả email lẫn Google.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
* Dịch vụ gửi email giao dịch sẵn sàng, cấu hình SPF/DKIM/DMARC đúng.
* Cơ sở dữ liệu người dùng/hồ sơ có sẵn hoặc tạo cùng feature này.
* Tự build (không dùng BaaS); thị trường SEA, không phục vụ EU/EEA.

### 6.4 Constraints

* Nền web responsive (không native app) — mobile browser là kênh chính.
* Tuân thủ PDPA (SG/TH) + Nghị định 13/2023/NĐ-CP (VN).
* Chỉ email + mật khẩu khi đăng ký (không đòi số điện thoại/hồ sơ).

### 6.5 Dependencies

* Dịch vụ email giao dịch (verify + reset link).
* Google OAuth (đăng ký nhà cung cấp, cấu hình client).
* Feature onboarding (nhận chuyển tiếp sau đăng nhập lần đầu).

## 7. High-level Business Requirements

| ID | Business Requirement | Business Objective | Priority |
|----|----------------------|--------------------|----------|
| BREQ-authentication-01 | Người học tạo được tài khoản email đã xác nhận trước khi dùng nội dung học | BO-authentication-01 | Cao |
| BREQ-authentication-02 | Người học đăng nhập ổn định trên nhiều thiết bị với cùng tài khoản | BO-authentication-02 | Cao |
| BREQ-authentication-03 | Người dùng khôi phục được quyền truy cập an toàn khi quên mật khẩu | BO-authentication-03 | Cao |
| BREQ-authentication-04 | Google và email cùng địa chỉ trỏ về một tài khoản duy nhất | BO-authentication-04 | Trung bình |
| BREQ-authentication-05 | Hệ thống chống dò mật khẩu để bảo vệ tài khoản người dùng | BO-authentication-02 | Cao |

## 8. Business Rules

| ID | Business Rule | Rationale |
|----|---------------|-----------|
| BR-authentication-01 | Bắt buộc xác nhận email trước khi truy cập nội dung học | Chống tài khoản rác, đảm bảo email dùng được để liên lạc |
| BR-authentication-02 | Mật khẩu 8-20 ký tự, có chữ hoa + chữ thường + ký tự đặc biệt, không chứa phần đầu email | Cân bằng an toàn và trải nghiệm; giảm rủi ro compromise (CR-20260627-001) |
| BR-authentication-03 | Sau 3 lần sai → captcha; sau 5 lần sai → khóa tạm 24 giờ (tự mở) | Chống dò mật khẩu mà không cần can thiệp thủ công |
| BR-authentication-04 | Đặt lại mật khẩu đăng xuất mọi phiên trên mọi thiết bị | Đảm bảo kẻ chiếm phiên bị loại sau khi chủ tài khoản khôi phục |
| BR-authentication-05 | Thông báo quên mật khẩu trung tính bất kể email có tồn tại (anti-enumeration) | Không để lộ email nào đã đăng ký |
| BR-authentication-06 | Tài khoản đăng ký gốc qua Google phải tạo mật khẩu trước khi gỡ liên kết Google | Tránh khóa người dùng khỏi chính tài khoản của họ |
| BR-authentication-07 | Lỗi mạng khi đăng nhập không tính vào số lần sai | Không phạt oan người dùng vì sự cố kết nối |

## 9. Cost-Benefit (định tính)

### 9.1 Cost Drivers

* Công xây dựng và kiểm thử luồng auth (đăng ký, đăng nhập, verify, reset, OAuth, gỡ liên kết).
* Chi phí dịch vụ email giao dịch và cấu hình Google OAuth.
* Công đảm bảo tuân thủ PDPA (chính sách quyền riêng tư, lưu trữ dữ liệu).
* Vận hành/hỗ trợ ban đầu (xử lý ticket đăng nhập giai đoạn đầu).

### 9.2 Expected Benefits

* Mở khóa toàn bộ tính năng phụ thuộc danh tính (gate trả phí, đồng bộ tiến độ).
* Tăng giữ chân nhờ tiến độ theo tài khoản, không mất khi đổi máy.
* Giảm rào cản đăng ký nhờ Google one-tap → tăng chuyển đổi.
* Giảm tải hỗ trợ nhờ tự khôi phục mật khẩu.

### 9.3 Priority / Rough ROI

Ưu tiên **cao nhất / bắt buộc trước**: đây là điều kiện tiên quyết cho mọi doanh thu và giữ chân. Chi phí ở mức trung bình (một luồng auth chuẩn, tự build), lợi ích chiến lược lớn vì mở khóa cả lộ trình sản phẩm. ROID định tính: rất tích cực — không có auth thì không feature sinh tiền nào chạy được.

## 10. Risks

| ID | Risk | Likelihood | Impact | Mitigation | Owner Role |
|----|------|------------|--------|------------|------------|
| RISK-authentication-01 | Bot đăng ký rác làm sai chỉ số chuyển đổi | Thỉnh thoảng | Trung bình | Captcha cho đăng ký, bắt buộc verify email trước khi vào app | Product Owner |
| RISK-authentication-02 | Email xác nhận/đặt lại không tới inbox | Thỉnh thoảng | Cao | Chọn nhà cung cấp uy tín, cấu hình SPF/DKIM/DMARC, resend + hỗ trợ | Đội kỹ thuật |
| RISK-authentication-03 | Google OAuth lỗi cấu hình/quota chặn đăng nhập | Hiếm | Cao | Giám sát dashboard OAuth; email login luôn là phương án dự phòng | Đội kỹ thuật |
| RISK-authentication-04 | Tự động liên kết Google không xác minh lại quyền sở hữu → nguy cơ chiếm tài khoản | Thỉnh thoảng | Cao | Audit log sự kiện auto-link; cân nhắc thêm bước xác minh ở bản sau | Phụ trách bảo mật |
| RISK-authentication-05 | Lộ dữ liệu / mật khẩu do lưu trữ không an toàn | Hiếm | Cao | Hash thuật toán mạnh (chốt ở /srs), không log plaintext, audit truy cập | Đội kỹ thuật |
| RISK-authentication-06 | Chưa đáp ứng đủ PDPA (SG/TH/VN) khi ra mắt | Thỉnh thoảng | Cao | Hoàn tất chính sách quyền riêng tư + lưu trữ dữ liệu trước launch | Phụ trách tuân thủ |

## 11. Open Questions

*Không còn câu hỏi mở cấp nghiệp vụ — phạm vi, quy tắc và mục tiêu đã được chốt từ brainstorm. Các giả định cần xác nhận (nhà cung cấp email, cơ sở dữ liệu người dùng, xác minh quyền sở hữu khi auto-link) đã ghi ở Mục 6.3 và Mục 10 để theo dõi khi triển khai.*‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
