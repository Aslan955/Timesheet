---
type: urd
feature: authentication
status: draft
updated: 2026-07-19
links:
  - docs/authentication/brainstorms/email-and-google-auth.md
---

# authentication — User Requirements Document‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Purpose‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cho phép người học của app __english-ai-demo__ tạo và sử dụng một danh tính bền vững để đăng nhập từ nhiều thiết bị, nhờ đó giữ được tiến độ học và truy cập được các tính năng trả phí. Tài liệu này mô tả người dùng cần gì ở luồng xác thực (đăng ký, đăng nhập email/Google, xác nhận email, quên mật khẩu, quản lý liên kết Google), trong bối cảnh nào và kết quả nào có giá trị với họ.

### User Problem & Current Experience‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| User | Current Situation | Problem | User Consequence | Evidence |
|------|-------------------|---------|------------------|----------|
| Người học miễn phí | Dùng app không có tài khoản hoặc phải nhập lại thông tin mỗi thiết bị | Mất tiến độ học khi đổi máy / cài lại app | Học lại từ đầu, mất động lực, rời bỏ app | Observed: brainstorm Mục 3 |
| Người học trả phí | Đổi thiết bị nhưng hệ thống không nhận ra là cùng người | Mất quyền truy cập tính năng đã trả tiền | Cảm thấy bị "mất tiền", mở ticket hỗ trợ | Observed: brainstorm Mục 3 |
| Người dùng quay lại | Quên mật khẩu sau thời gian không dùng | Không đăng nhập lại được, không có cách khôi phục rõ ràng | Bỏ tài khoản, tạo tài khoản mới hoặc rời app | Observed: brainstorm Mục 3 |
| Người ưu tiên Google | Ngại tạo và nhớ thêm một mật khẩu mới | Rào cản khi đăng ký, do dự khi bắt đầu | Không hoàn tất đăng ký | Observed: brainstorm Mục 3 |

## 2. User Types‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Tier | User Type | Context | Primary Goal | Pain Points |
|------|-----------|---------|--------------|-------------|
| primary | Người học (learner) | Học tiếng Anh trên trình duyệt web (mobile + desktop), khu vực Đông Nam Á | Có tài khoản ổn định để đồng bộ tiến độ và dùng tính năng trả phí trên mọi thiết bị | Mất tiến độ khi đổi máy, quên mật khẩu, ngại tạo mật khẩu mới |
| secondary | Người dùng đăng nhập bằng Google | Đã có tài khoản Google, muốn vào app nhanh không cần đặt mật khẩu | Đăng ký/đăng nhập một chạm bằng Google | Không muốn quản lý thêm một mật khẩu |

> Chỉ có một primary user (người học). "Người dùng Google" là cùng một người học nhưng chọn phương thức khác — tách riêng để làm rõ nhu cầu one-tap.

## 3. Scope Boundaries‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### In Scope

* Đăng ký bằng email + mật khẩu, có xác nhận email bắt buộc trước khi dùng nội dung học.
* Đăng nhập bằng email + mật khẩu, có tùy chọn "ghi nhớ đăng nhập".
* Đăng ký / đăng nhập bằng tài khoản Google (một luồng duy nhất).
* Tự động liên kết tài khoản Google với tài khoản email cùng địa chỉ (không tạo trùng).
* Xác nhận email qua link, gửi lại được khi cần.
* Quên mật khẩu: nhận link đặt lại qua email, đặt mật khẩu mới, đăng xuất mọi phiên sau khi đặt lại.
* Gỡ liên kết Google khỏi tài khoản, có ràng buộc phải có mật khẩu trước khi gỡ.
* Đăng nhập nhiều thiết bị đồng thời; đăng xuất thiết bị hiện tại.
* Bảo vệ chống dò mật khẩu (captcha, khóa tạm thời).

### Out of Scope

* Đăng nhập bằng Apple, Facebook, SSO doanh nghiệp, magic link (đăng nhập không mật khẩu).
* Đăng nhập bằng passkey/sinh trắc học, cảnh báo bảo mật khi đăng nhập lạ, danh sách thiết bị (để các bản sau).
* Quản lý hồ sơ (tên hiển thị, avatar), gói/subscription, và luồng onboarding sau đăng nhập (thuộc feature khác).
* Xóa tài khoản và đổi email (không bắt buộc theo PDPA khu vực Đông Nam Á).

## 4. User Needs

| ID | User | Context / Trigger | User Need | Expected Outcome | Importance | Evidence |
|----|------|-------------------|-----------|------------------|------------|----------|
| UN-001 | Người học | Lần đầu vào app, chưa có tài khoản | Tạo được tài khoản nhanh chỉ với email + mật khẩu | Có tài khoản ở trạng thái chờ xác nhận và biết bước tiếp theo | Critical | Confirmed: brainstorm 4/5.1 |
| UN-002 | Người học | Vừa đăng ký xong | Xác nhận email dễ dàng để mở khóa nội dung học | Email được xác nhận và có thể đăng nhập | Critical | Confirmed: brainstorm 5.2 |
| UN-003 | Người học | Đã có tài khoản, quay lại app | Đăng nhập ổn định bằng email + mật khẩu | Vào được app, có thể chọn duy trì đăng nhập | Critical | Confirmed: brainstorm 5.3 |
| UN-004 | Người dùng Google | Muốn bắt đầu không cần mật khẩu | Đăng ký/đăng nhập một chạm bằng Google | Vào app ngay, không phải tạo mật khẩu | High | Confirmed: brainstorm 5.4 |
| UN-005 | Người học | Đã từng đăng ký email, sau đó dùng Google cùng email | Không bị tạo tài khoản trùng | Hai phương thức trỏ về cùng một tài khoản, giữ nguyên tiến độ | High | Confirmed: brainstorm 5.4/6.4 |
| UN-006 | Người dùng quay lại | Quên mật khẩu | Khôi phục quyền truy cập an toàn qua email | Đặt được mật khẩu mới và đăng nhập lại | Critical | Confirmed: brainstorm 5.5 |
| UN-007 | Người học | Dùng nhiều thiết bị (điện thoại + máy tính) | Đăng nhập song song nhiều thiết bị, không bị đăng xuất bất ngờ | Tiến độ đồng bộ, không bị gián đoạn | High | Confirmed: brainstorm 4 |
| UN-008 | Người học | Muốn kết thúc phiên trên thiết bị đang dùng | Đăng xuất thiết bị hiện tại mà không ảnh hưởng thiết bị khác | Chỉ thiết bị hiện tại thoát | Medium | Confirmed: brainstorm 5.6 |
| UN-009 | Người dùng Google | Đăng ký ban đầu bằng Google, muốn tách Google | Gỡ liên kết Google nhưng vẫn giữ quyền đăng nhập | Sau khi tạo mật khẩu, gỡ Google xong vẫn đăng nhập được bằng email | Medium | Confirmed: brainstorm 5.6/D9 |
| UN-010 | Người học | Bị người khác thử đoán mật khẩu | Được bảo vệ khỏi việc dò mật khẩu liên tục | Sau nhiều lần sai, hệ thống chặn tạm và báo rõ | High | Confirmed: brainstorm 4/7.2 |

## 5. Prioritized User Journeys

### Journey 1: Người học tạo tài khoản và mở khóa nội dung học

* __User:__ Người học mới
* __Importance:__ Critical
* __Trigger:__ Lần đầu vào app, chọn "Đăng ký"
* __Expected outcome:__ Có tài khoản đã xác nhận email và đăng nhập được
* __Related needs:__ UN-001, UN-002, UN-003

1. Người học mở app, vào trang đăng nhập, chọn "Đăng ký".
2. Nhập email + mật khẩu và gửi đăng ký.
3. Nhận thông báo "đã gửi email xác nhận" và mở email.
4. Bấm link xác nhận trong email.
5. Thấy thông báo xác nhận thành công, đăng nhập để bắt đầu học.

__Independent verification:__ Người học chưa xác nhận email không vào được nội dung học; sau khi bấm link xác nhận còn hạn và đăng nhập, họ truy cập được nội dung. Kiểm chứng được mà không cần journey nào khác.

### Journey 2: Người dùng vào app một chạm bằng Google

* __User:__ Người dùng ưu tiên Google
* __Importance:__ High
* __Trigger:__ Chọn "Đăng nhập với Google" ở trang đăng nhập
* __Expected outcome:__ Vào app ngay, không cần tạo mật khẩu; nếu đã có tài khoản email cùng địa chỉ thì dùng chung tài khoản
* __Related needs:__ UN-004, UN-005

1. Người dùng chọn "Đăng nhập với Google".
2. Chấp thuận trên màn hình Google.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
3. Quay lại app: nếu email Google chưa có → tạo tài khoản đã xác nhận; nếu đã có → dùng chung tài khoản hiện có.
4. Vào thẳng app chính.

__Independent verification:__ Sau khi hoàn tất, người dùng ở trong app với đúng một tài khoản duy nhất cho email đó (không sinh tài khoản trùng), quan sát trực tiếp được.

### Journey 3: Người dùng quay lại khôi phục quyền truy cập khi quên mật khẩu

* __User:__ Người dùng quay lại
* __Importance:__ Critical
* __Trigger:__ Chọn "Quên mật khẩu"
* __Expected outcome:__ Đặt lại mật khẩu và đăng nhập lại; các phiên cũ bị đăng xuất
* __Related needs:__ UN-006

1. Người dùng nhập email và gửi yêu cầu đặt lại.
2. Thấy thông báo trung tính (không tiết lộ email có tồn tại hay không).
3. Mở email, bấm link đặt lại còn hạn.
4. Nhập mật khẩu mới hai lần và xác nhận.
5. Đăng nhập lại bằng mật khẩu mới.

__Independent verification:__ Sau khi đặt lại, mật khẩu cũ không còn đăng nhập được và mọi phiên trước đó bị đăng xuất; kiểm chứng bằng cách thử phiên cũ và mật khẩu cũ.

### Journey 4: Người dùng gỡ liên kết Google an toàn

* __User:__ Người dùng đăng ký ban đầu bằng Google
* __Importance:__ Medium
* __Trigger:__ Chọn gỡ liên kết Google trong phần quản lý tài khoản
* __Expected outcome:__ Gỡ được Google nhưng vẫn đăng nhập được bằng email/mật khẩu
* __Related needs:__ UN-009

1. Người dùng chọn gỡ liên kết Google.
2. Nếu tài khoản chưa có mật khẩu, hệ thống yêu cầu tạo mật khẩu trước.
3. Người dùng đặt mật khẩu.
4. Hệ thống gỡ liên kết Google.
5. Người dùng đăng nhập lại được bằng email + mật khẩu.

__Independent verification:__ Sau khi gỡ, người dùng vẫn đăng nhập thành công bằng email/mật khẩu và không còn dùng Google để vào tài khoản đó.

## 6. User Exceptions & Edge Conditions

| Situation | User Impact | Expected User-facing Outcome | Related Journey / Need |
|-----------|-------------|------------------------------|------------------------|
| Đăng ký với email đã tồn tại | Không tạo được tài khoản mới | Thông báo email đã đăng ký, gợi ý đăng nhập hoặc quên mật khẩu | Journey 1 / UN-001 |
| Mật khẩu không đạt yêu cầu | Không gửi được đăng ký | Báo lỗi ngay tại chỗ, nêu rõ yêu cầu mật khẩu | Journey 1 / UN-001 |
| Đăng nhập khi email chưa xác nhận | Bị chặn vào app | Thông báo tài khoản chưa xác nhận + nút gửi lại email | Journey 1 / UN-002 |
| Link xác nhận / đặt lại hết hạn hoặc đã dùng | Không hoàn tất được bước | Thông báo link hết hạn + cách nhận link mới | Journey 1, 3 / UN-002, UN-006 |
| Nhập sai mật khẩu nhiều lần | Bị làm chậm / chặn tạm | Sau 3 lần sai yêu cầu captcha; sau 5 lần khóa tạm 24 giờ, báo rõ thời gian thử lại | Journey 1 / UN-010 |
| Đăng nhập Google thất bại (đóng tab, lỗi Google) | Không vào được | Thông báo đăng nhập Google thất bại, thử lại; không để lại tài khoản dở dang | Journey 2 / UN-004 |
| Quên mật khẩu với email không tồn tại | — | Cùng một thông báo trung tính như email có tồn tại (không tiết lộ) | Journey 3 / UN-006 |
| Đặt lại mật khẩu khi đang đăng nhập ở thiết bị khác | Bị đăng xuất khỏi các thiết bị | Mọi phiên bị đăng xuất, cần đăng nhập lại | Journey 3 / UN-006, UN-007 |
| Rớt mạng khi đang đăng nhập | Không tạo được phiên, mất dữ liệu form | Gửi lại; lỗi mạng không bị tính vào số lần sai | UN-003, UN-010 |
| Không nhận được email xác nhận | Kẹt ở bước xác nhận | Gửi lại (chờ 60 giây giữa 2 lần, tối đa 5 lần/ngày) + có kênh hỗ trợ | Journey 1 / UN-002 |

## 7. User-side Constraints

* Ngôn ngữ giao diện tiếng Việt (khu vực Đông Nam Á), wording thân thiện, không thuật ngữ kỹ thuật.
* Chạy trên trình duyệt web, cả điện thoại và máy tính; mobile browser là kênh chính — thao tác phải dễ trên màn hình nhỏ.
* Đăng ký chỉ cần email + mật khẩu, không đòi số điện thoại hay hồ sơ.
* Người dùng chịu trách nhiệm khi bật "ghi nhớ đăng nhập" trên thiết bị công cộng (chưa có cảnh báo trong phạm vi này).
* Chính sách quyền riêng tư phải đáp ứng PDPA (SG/TH) + Nghị định 13/2023/NĐ-CP (VN); không phục vụ EU/EEA.

## 8. Assumptions & Validation

| Assumption | Impact if Wrong | Validation Status | Next Action |
|------------|-----------------|-------------------|-------------|
| Email là định danh duy nhất cho tài khoản (cả email lẫn Google dùng email để liên kết) | Auto-link sai người, tạo trùng hoặc gộp nhầm tài khoản | Assumption (từ brainstorm Mục 8) | Xác nhận ở `/brd` / `/prd` trước khi chốt SRS |
| Không cần age-gate / bảo vệ trẻ vị thành niên | Có thể vi phạm quy định nếu có người dùng nhỏ tuổi | Assumption | Kiểm tra lại khi xác định thị trường mục tiêu |
| Dịch vụ gửi email giao dịch sẵn sàng và đáng tin cậy | Email xác nhận/đặt lại không tới → kẹt luồng chính | Assumption | Xác nhận nhà cung cấp email ở `/brd` (rủi ro Vendor) |
| App đã có (hoặc sẽ tạo cùng feature này) cơ sở dữ liệu người dùng/hồ sơ | Thiếu chỗ lưu danh tính → chặn toàn bộ feature | Assumption | Làm rõ ở `/prd` / `/srs` |
| Tự động liên kết Google mà không xác minh lại quyền sở hữu là chấp nhận được về rủi ro | Có nguy cơ chiếm tài khoản nếu email Google trùng | Assumption (rủi ro đã ghi nhận, brainstorm Mục 9) | Cân nhắc thêm bước xác minh ở bản sau; theo dõi báo cáo |

## 9. User Success Criteria

| ID | User Outcome | Baseline | Target | Measurement | Review Period |
|----|--------------|----------|--------|-------------|---------------|
| USC-001 | Người truy cập hoàn tất tạo tài khoản (đã xác nhận email) | Chưa có — xác lập trong 2 tuần đầu sau ra mắt | ≥ 60% khách bắt đầu đăng ký hoàn tất tài khoản đã xác nhận | Tỷ lệ visitor bắt đầu đăng ký → tài khoản verified | Hàng tháng |
| USC-002 | Người học đăng nhập lại thành công trên thiết bị mới mà không mất tiến độ | Chưa có — xác lập sau ra mắt | ≥ 95% lần đăng nhập trên thiết bị mới thành công ngay | Tỷ lệ đăng nhập thành công / tổng lượt đăng nhập trên thiết bị mới | Hàng tháng |
| USC-003 | Người quên mật khẩu khôi phục được quyền truy cập | Chưa có — xác lập sau ra mắt | ≥ 80% yêu cầu đặt lại dẫn tới đăng nhập lại thành công | Tỷ lệ hoàn tất đặt lại mật khẩu → đăng nhập | Hàng tháng |
| USC-004 | Người dùng Google vào app không gặp trùng tài khoản | 0 báo cáo trùng tài khoản mong muốn | 0 tài khoản trùng cho cùng một email | Số ticket/log trùng tài khoản cho một email | Hàng quý |
| USC-005 | Người dùng cảm nhận đăng nhập nhanh | Chưa có — đo qua khảo sát/hỗ trợ | Giảm ticket "không đăng nhập được" theo thời gian | Số ticket hỗ trợ liên quan đăng nhập | Hàng quý |

## 10. Open Questions

*Không còn câu hỏi mở — mọi quyết định phạm vi/nhu cầu đã được chốt ở brainstorm (10 OQ resolved trong các phiên 2026-05-15 và 2026-05-16). Các điểm chưa chắc còn lại đã được ghi ở Mục 8 dưới dạng Assumption để `/brd` và `/prd` xác nhận.*‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
