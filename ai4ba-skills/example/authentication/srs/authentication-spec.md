---
type: srs
feature: authentication
status: stale
updated: 2026-07-17
links:
  - docs/authentication/brainstorms/email-and-google-auth.md
---

# authentication — Software Requirements Specification‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Scope‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

SRS này cover luồng xác thực nền tảng của app học tiếng Anh __english-ai-demo__ cho khu vực Đông Nam Á (VN, SG, TH, ID, MY, PH), gồm 2 phương thức: đăng ký/đăng nhập bằng email + mật khẩu (kèm xác nhận email bắt buộc, quên mật khẩu, remember-me) và đăng ký/đăng nhập bằng tài khoản Google (OAuth). Cover thêm: tự động liên kết tài khoản trùng email, gỡ liên kết Google, đăng nhập nhiều thiết bị, và bảo vệ chống dò mật khẩu (captcha + khóa tạm).

__KHÔNG cover:__

- Apple Sign-In, Facebook Login, và mọi nhà cung cấp OAuth khác ngoài Google.
- Magic link / đăng nhập không mật khẩu (passwordless).
- SSO doanh nghiệp (SAML/OIDC nội bộ tổ chức).
- Ứng dụng native iOS/Android (chỉ responsive webapp — mobile + desktop browser).
- Xóa tài khoản / đổi địa chỉ email (PDPA SEA không bắt buộc — out of scope theo quyết định brainstorm).
- Quản lý gói trả phí / trạng thái subscription (thuộc feature `onboarding`/billing riêng — auth chỉ xác định danh tính, không xử lý subscription).
- Onboarding sau đăng nhập lần đầu (feature `onboarding` riêng, phát triển sau).

## 2. Actors & Stakeholders‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Actor | Loại (người/hệ thống/ngoài) | Mục tiêu | Trong scope? |
|-------|-----------------------------|----------|--------------|
| Học viên miễn phí (Free learner) | người | Tạo tài khoản nhanh, nhẹ để đồng bộ tiến độ học qua nhiều thiết bị | Có |
| Học viên trả phí (Paid learner) | người | Đăng nhập ổn định trên nhiều thiết bị, không bị đăng xuất bất ngờ để giữ quyền paid | Có |
| Người dùng quay lại (Returning user) | người | Đăng nhập lại; nếu quên mật khẩu thì đặt lại đơn giản qua email | Có |
| Người dùng ưu tiên Google (Google-first user) | người | Đăng ký/đăng nhập một chạm bằng Google, không phải tạo mật khẩu mới | Có |
| Dịch vụ gửi email (transactional) | hệ thống ngoài | Gửi email chứa link xác nhận + link đặt lại mật khẩu tới hộp thư người dùng | Có (dùng theo SLA nhà cung cấp, không đặc tả tích hợp kỹ thuật) |
| Google OAuth | hệ thống ngoài | Xác thực danh tính Google của người dùng và trả email đã xác thực về app | Có (dùng theo điều khoản/hạn mức Google, không đặc tả tích hợp kỹ thuật) |
| Bộ phận vận hành / hỗ trợ | người | Xử lý khiếu nại tài khoản bị khóa, email không tới; theo dõi cảnh báo liên kết Google bất thường | Có (thao tác hỗ trợ ngoài luồng tự động; khóa/mở khóa là tự động 24h) |
| Bộ phận bảo mật / pháp lý | người | Chốt chuẩn lưu trữ mật khẩu + yêu cầu tuân thủ PDPA/Nghị định 13 | Không (nguồn ràng buộc, không thao tác trong luồng — xem Mục 11) |

## 3. Functional Requirements (FR)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| ID | Title | Description | Priority | Verify by | Source |
|----|-------|-------------|----------|-----------|--------|
| FR-authentication-001 | Đăng ký bằng email + mật khẩu | Khi người dùng gửi form đăng ký với email + mật khẩu hợp lệ và email chưa tồn tại, hệ thống phải tạo tài khoản ở trạng thái `unverified` | P0 | demo | Brainstorm Mục 4 P0 |
| FR-authentication-002 | Chặn đăng ký email trùng | Nếu email đã tồn tại trong hệ thống khi đăng ký, thì hệ thống phải chặn tạo tài khoản và hiện thông báo gợi ý đăng nhập hoặc quên mật khẩu | P0 | test | Brainstorm Mục 6.1 D1 |
| FR-authentication-003 | Áp chính sách mật khẩu | Khi người dùng nhập mật khẩu, hệ thống phải chấp nhận chỉ khi mật khẩu dài 8-20 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt, và không chứa phần đầu email (local-part, ≥3 ký tự, không phân biệt hoa/thường) | P0 | test | Brainstorm Mục 7.1 |
| FR-authentication-004 | Gửi email xác nhận | Khi tài khoản email được tạo, hệ thống phải gửi email chứa link xác nhận có hạn 24 giờ tới địa chỉ đã đăng ký | P0 | test | Brainstorm Mục 4 P0, Mục 5.1 |
| FR-authentication-005 | Xác nhận email qua link | Khi người dùng bấm link xác nhận còn hạn và chưa dùng, hệ thống phải chuyển tài khoản sang `verified` và đánh dấu link đã dùng | P0 | test | Brainstorm Mục 5.2, 6.3 |
| FR-authentication-006 | Chặn link xác nhận hết hạn/đã dùng | Nếu link xác nhận đã hết hạn hoặc đã được dùng, thì hệ thống phải từ chối và mời người dùng gửi lại link | P0 | test | Brainstorm Mục 6.1 D8 |
| FR-authentication-007 | Gửi lại email xác nhận | Khi người dùng yêu cầu gửi lại email xác nhận, hệ thống phải gửi lại link mới, tôn trọng cooldown 60 giây giữa 2 lần và tối đa 5 lần/ngày | P0 | test | Brainstorm Mục 4 P0, Mục 7.2 |
| FR-authentication-008 | Đăng nhập bằng email + mật khẩu | Khi người dùng gửi email + mật khẩu khớp với tài khoản đã verified và không bị khóa, hệ thống phải tạo phiên đăng nhập và cho vào app | P0 | demo | Brainstorm Mục 5.3 |
| FR-authentication-009 | Chặn đăng nhập tài khoản chưa xác nhận | Nếu tài khoản email đúng mật khẩu nhưng chưa `verified`, thì hệ thống phải chặn vào app và mời gửi lại email xác nhận | P0 | test | Brainstorm Mục 6.1 D4 |
| FR-authentication-010 | Thông báo đăng nhập sai chung | Nếu email hoặc mật khẩu không khớp, thì hệ thống phải hiện thông báo chung "Email hoặc mật khẩu không đúng" (không tiết lộ email nào tồn tại) và tăng bộ đếm sai +1 | P0 | test | Brainstorm Mục 6.1 D3 |
| FR-authentication-011 | Remember-me 30 ngày | Khi người dùng bật remember-me lúc đăng nhập, hệ thống phải giữ phiên đăng nhập 30 ngày trên thiết bị đó; mặc định remember-me tắt | P0 | test | Brainstorm Mục 4 P0, Mục 7.2 |
| FR-authentication-012 | Đăng nhập/đăng ký bằng Google | Khi người dùng chọn đăng nhập bằng Google và Google trả về thành công email đã xác thực, hệ thống phải xác định người dùng qua email đó (1 luồng duy nhất cho cả đăng ký lẫn đăng nhập, không hỏi thêm field ngoài dữ liệu Google trả) | P0 | demo | Brainstorm Mục 5.4 |
| FR-authentication-013 | Tạo tài khoản mới từ Google | Nếu email Google chưa tồn tại trong hệ thống, thì hệ thống phải tạo tài khoản mới ở trạng thái `verified` (Google đã xác thực email) | P0 | test | Brainstorm Mục 5.4, 6.1 D6 |
| FR-authentication-014 | Tự động liên kết Google trùng email | Nếu email Google trùng với một tài khoản đã tồn tại, thì hệ thống phải tự liên kết Google vào tài khoản đó, đánh dấu `verified` và đăng nhập — không tạo tài khoản trùng, không yêu cầu nhập mật khẩu cũ | P0 | test | Brainstorm Mục 4 P0, Mục 6.1 D6 |
| FR-authentication-015 | Xử lý callback Google thất bại | Nếu callback Google thất bại (mạng/lỗi Google/người dùng hủy), thì hệ thống phải hiện "Đăng nhập Google thất bại, thử lại" và không tạo tài khoản dở dang | P0 | test | Brainstorm Mục 5.4, 6.4 |
| FR-authentication-016 | Yêu cầu đặt lại mật khẩu | Khi người dùng gửi email ở form quên mật khẩu, hệ thống phải hiện thông báo trung tính "Nếu email tồn tại trong hệ thống, đã gửi link đặt lại" bất kể email có tồn tại hay không (chống dò tài khoản) | P0 | test | Brainstorm Mục 5.5, 6.1 D7 |
| FR-authentication-017 | Gửi link đặt lại mật khẩu | Khi email quên mật khẩu khớp một tài khoản tồn tại, hệ thống phải gửi email chứa link đặt lại có hạn 30 phút | P0 | test | Brainstorm Mục 5.5, 7.2 |
| FR-authentication-018 | Đặt mật khẩu mới qua link | Khi người dùng bấm link đặt lại còn hạn, chưa dùng, và nhập mật khẩu mới đạt chính sách (nhập 2 lần khớp), hệ thống phải cập nhật mật khẩu và đánh dấu link đã dùng | P0 | test | Brainstorm Mục 5.5 |
| FR-authentication-019 | Đăng xuất mọi phiên sau đặt lại | Khi mật khẩu được đặt lại thành công, hệ thống phải thu hồi mọi phiên đăng nhập trên tất cả thiết bị và buộc người dùng đăng nhập lại | P0 | test | Brainstorm Mục 5.5, 6.1 (OQ-2 resolved) |
| FR-authentication-020 | Chặn link đặt lại hết hạn/đã dùng | Nếu link đặt lại đã hết hạn hoặc đã được dùng, thì hệ thống phải từ chối và mời người dùng yêu cầu link mới qua "Quên mật khẩu" | P0 | test | Brainstorm Mục 6.1 D8 |
| FR-authentication-021 | Đăng nhập nhiều thiết bị | Hệ thống phải cho phép một tài khoản đăng nhập đồng thời trên nhiều thiết bị, không giới hạn số thiết bị và không tự hết hạn phiên | P0 | test | Brainstorm Mục 4 P0 |
| FR-authentication-022 | Đăng xuất thiết bị hiện tại | Khi người dùng chọn đăng xuất, hệ thống phải thu hồi phiên của thiết bị hiện tại mà không ảnh hưởng phiên trên thiết bị khác, không hiện hộp thoại xác nhận | P0 | demo | Brainstorm Mục 5.6 |
| FR-authentication-023 | Gỡ liên kết Google | Khi người dùng gỡ liên kết Google và tài khoản đã có mật khẩu, hệ thống phải gỡ liên kết Google và giữ khả năng đăng nhập bằng email/mật khẩu | P0 | test | Brainstorm Mục 4 P0, Mục 6.1 D9 (OQ-6 resolved) |
| FR-authentication-024 | Buộc đặt mật khẩu trước khi gỡ Google | Nếu người dùng gỡ liên kết Google mà tài khoản chưa có mật khẩu (đăng ký gốc qua Google), thì hệ thống phải buộc tạo mật khẩu đạt chính sách trước, rồi mới gỡ liên kết | P0 | test | Brainstorm Mục 4 P0, Mục 6.1 D9 |
| FR-authentication-025 | Captcha sau 3 lần đăng nhập sai | Khi một tài khoản có từ 3 lần đăng nhập sai liên tiếp, hệ thống phải yêu cầu captcha ở các lần thử tiếp theo | P0 | test | Brainstorm Mục 4 P0, Mục 7.2 |
| FR-authentication-026 | Khóa tài khoản sau 5 lần sai | Khi một tài khoản có từ 5 lần đăng nhập sai liên tiếp, hệ thống phải khóa tài khoản 24 giờ và tự mở khóa sau đó (không cần vận hành can thiệp) | P0 | test | Brainstorm Mục 4 P0, Mục 7.2 |
| FR-authentication-027 | Không tính lỗi mạng vào bộ đếm sai | Nếu một lần đăng nhập thất bại do lỗi mạng (không phải sai mật khẩu), thì hệ thống phải không tăng bộ đếm sai | P1 | test | Brainstorm Mục 6.4 |
| FR-authentication-028 | Tự xóa tài khoản chưa xác nhận | Khi một tài khoản ở trạng thái `unverified` quá 24 giờ, hệ thống phải tự xóa tài khoản đó | P1 | test | Brainstorm Mục 7.2, 6.4 |
| FR-authentication-029 | Đo độ mạnh mật khẩu real-time | Khi người dùng nhập mật khẩu ở form đăng ký/đặt lại, hệ thống nên hiển thị mức độ mạnh của mật khẩu theo thời gian thực | P1 | demo | Brainstorm Mục 4 P1 |
| FR-authentication-030 | Danh sách thiết bị + đăng xuất từ xa | Hệ thống nên cho người dùng xem danh sách thiết bị đang đăng nhập và đăng xuất thủ công từng thiết bị | P1 | demo | Brainstorm Mục 4 P1 |
| FR-authentication-031 | Captcha chống bot khi đăng ký | Hệ thống nên yêu cầu captcha ở form đăng ký để chống đăng ký hàng loạt bằng bot | P1 | test | Brainstorm Mục 4 P1, Mục 9 |

## 4. Non-Functional Requirements (NFR)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| ID | Category | Requirement | Priority | Acceptance |
|----|----------|-------------|----------|------------|
| NFR-authentication-001 | performance | Người dùng thấy kết quả sau khi bấm đăng nhập | P0 | 95% trường hợp hiển thị kết quả (vào app hoặc báo lỗi) trong 3 giây |
| NFR-authentication-002 | availability | Dịch vụ xác thực khả dụng để người dùng đăng nhập/đăng ký | P0 | ≥ 99.9% mỗi tháng trong giờ vận hành |
| NFR-authentication-003 | security | Mật khẩu là dữ liệu nhạy cảm | P0 | KHÔNG lưu mật khẩu dạng plaintext và KHÔNG ghi mật khẩu vào log; chuẩn lưu trữ/bảo mật cụ thể do bộ phận bảo mật/pháp lý chốt (xem Mục 11) |
| NFR-authentication-004 | privacy | Tuân thủ luật bảo vệ dữ liệu khu vực Đông Nam Á | P0 | Có chính sách quyền riêng tư đáp ứng PDPA (SG/TH) + Nghị định 13/2023/NĐ-CP (VN) trước khi ra mắt; banner đồng ý cookie; chính sách lưu giữ dữ liệu rõ ràng. KHÔNG áp dụng GDPR (không phục vụ EU) |
| NFR-authentication-005 | security | Chống dò mật khẩu bằng thử lặp | P0 | Sau 3 lần sai liên tiếp yêu cầu captcha; sau 5 lần sai liên tiếp khóa 24 giờ; lỗi mạng không tính vào bộ đếm |
| NFR-authentication-006 | usability | Phiên "ghi nhớ đăng nhập" duy trì đủ lâu để không phiền người dùng đa thiết bị | P0 | Remember-me giữ phiên 30 ngày, mặc định tắt |
| NFR-authentication-007 | security | Chống dò sự tồn tại của tài khoản (account enumeration) | P0 | Thông báo quên mật khẩu và đăng nhập sai đều trung tính, không tiết lộ email nào tồn tại |
| NFR-authentication-008 | compliance | Lưu vết sự kiện xác thực nhạy cảm phục vụ điều tra bảo mật | P1 | Ghi nhật ký (không sửa được) các sự kiện: khóa tài khoản, đặt lại mật khẩu, tự liên kết Google; không chứa mật khẩu; thời hạn lưu giữ do bảo mật/pháp lý chốt |
| NFR-authentication-009 | usability | Màn xác thực dùng được cho người khiếm thị/khuyết tật cơ bản | P1 | Form đăng nhập/đăng ký hỗ trợ điều hướng bàn phím + nhãn cho trình đọc màn hình ở các trường và nút chính |

## 5. Business Rules

| ID | Rule | Trigger | Implements FR | Source |
|----|------|---------|---------------|--------|
| BR-authentication-001 | Phải xác nhận email trước khi truy cập nội dung học (gate access) | Người dùng đăng ký email đăng nhập lần đầu | FR-authentication-004, FR-authentication-009 | Brainstorm Mục 4 P0 |
| BR-authentication-002 | Email là định danh duy nhất — một email chỉ có một tài khoản, dùng chung cho cả 2 phương thức | Đăng ký email hoặc callback Google | FR-authentication-002, FR-authentication-014 | Brainstorm Mục 8 |
| BR-authentication-003 | Tài khoản có email trùng với Google được tự liên kết, không tạo trùng và không hỏi mật khẩu cũ | Callback Google với email khớp tài khoản đã có | FR-authentication-014 | Brainstorm Mục 6.1 D6 (OQ-1 resolved) |
| BR-authentication-004 | Phải có mật khẩu trước khi gỡ liên kết Google (tránh mất lối vào tài khoản) | Người dùng gỡ Google khỏi tài khoản chưa có mật khẩu | FR-authentication-024 | Brainstorm Mục 6.1 D9 (OQ-6 resolved) |
| BR-authentication-005 | Khóa tài khoản 24 giờ (tự mở) sau 5 lần đăng nhập sai liên tiếp | Bộ đếm sai của một tài khoản đạt 5 | FR-authentication-026 | Brainstorm Mục 7.2 (OQ-8 resolved) |
| BR-authentication-006 | Yêu cầu captcha sau 3 lần đăng nhập sai liên tiếp | Bộ đếm sai của một tài khoản đạt 3 | FR-authentication-025 | Brainstorm Mục 7.2 (OQ-8 resolved) |
| BR-authentication-007 | Đặt lại mật khẩu thu hồi toàn bộ phiên trên mọi thiết bị | Đặt lại mật khẩu thành công | FR-authentication-019 | Brainstorm Mục 5.5 (OQ-2 resolved) |
| BR-authentication-008 | Cùng thông báo cho cả 2 nhánh quên mật khẩu (email tồn tại hay không) — chống account enumeration | Người dùng gửi email ở form quên mật khẩu | FR-authentication-016 | Brainstorm Mục 5.5, 6.1 D7 |
| BR-authentication-009 | Tài khoản tạo qua Google được coi là `verified` ngay (Google đã xác thực email) | Tạo tài khoản mới từ callback Google | FR-authentication-013 | Brainstorm Mục 5.4 |
| BR-authentication-010 | Tài khoản `unverified` quá 24 giờ bị tự xóa | Tiến trình nền rà tài khoản chưa xác nhận | FR-authentication-028 | Brainstorm Mục 7.2 |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| BR-authentication-011 | Lỗi mạng khi đăng nhập không tính vào bộ đếm sai | Đăng nhập thất bại do lỗi mạng | FR-authentication-027 | Brainstorm Mục 6.4 |

## 6. Error Matrix

| Error ID | Title | Trigger | Severity | Related FR | Screen state | Recovery |
|----------|-------|---------|----------|------------|--------------|----------|
| E-authentication-001 | Email đã được đăng ký | Đăng ký với email đã tồn tại | minor | FR-authentication-002 | Form đăng ký hiện lỗi inline "Email này đã được đăng ký. Bạn muốn [đăng nhập] hoặc [quên mật khẩu]?" | Người dùng chuyển sang đăng nhập hoặc quên mật khẩu |
| E-authentication-002 | Mật khẩu không đạt chính sách | Mật khẩu nhập không thỏa 8-20 ký tự / thiếu loại ký tự / chứa local-part email | minor | FR-authentication-003 | Form hiện lỗi inline real-time "Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn" | Người dùng sửa lại mật khẩu |
| E-authentication-003 | Sai email hoặc mật khẩu | Email + mật khẩu không khớp khi đăng nhập | major | FR-authentication-010 | Form đăng nhập hiện "Email hoặc mật khẩu không đúng" (chung, không lộ email nào tồn tại); tăng bộ đếm sai +1 | Người dùng thử lại; captcha xuất hiện từ lần thứ 3 |
| E-authentication-004 | Tài khoản chưa xác nhận | Đăng nhập đúng mật khẩu nhưng tài khoản `unverified` | major | FR-authentication-009 | Form hiện "Tài khoản chưa được xác nhận. [Gửi lại email xác nhận]" | Người dùng bấm gửi lại email xác nhận |
| E-authentication-005 | Tài khoản đang bị khóa | Đăng nhập vào tài khoản đã khóa (≥5 lần sai) | critical | FR-authentication-026 | Form hiện "Tài khoản tạm khóa do nhiều lần đăng nhập sai. Vui lòng thử lại sau {X} giờ." | Chờ tự mở khóa sau 24 giờ; liên hệ hỗ trợ nếu cần |
| E-authentication-006 | Link xác nhận hết hạn/đã dùng | Bấm link xác nhận đã quá 24 giờ hoặc đã dùng | minor | FR-authentication-006 | Trang kết quả hiện "Link đã hết hạn hoặc đã được sử dụng. [Gửi lại link xác nhận]" | Người dùng gửi lại link xác nhận (theo cooldown/giới hạn) |
| E-authentication-007 | Vượt giới hạn gửi lại email | Bấm gửi lại trong 60 giây cooldown hoặc đã đủ 5 lần/ngày | minor | FR-authentication-007 | Nút gửi lại tạm vô hiệu + thông báo còn thời gian chờ / đã đạt giới hạn ngày | Người dùng chờ hết cooldown hoặc thử lại ngày hôm sau |
| E-authentication-008 | Đăng nhập Google thất bại | Callback Google lỗi (mạng/Google/người dùng hủy) | major | FR-authentication-015 | Trở về màn đăng nhập, hiện "Đăng nhập Google thất bại. Vui lòng thử lại." (không có tài khoản dở dang) | Người dùng thử lại Google hoặc dùng email/mật khẩu |
| E-authentication-009 | Link đặt lại mật khẩu hết hạn/đã dùng | Bấm link đặt lại đã quá 30 phút hoặc đã dùng | minor | FR-authentication-020 | Trang kết quả hiện "Link đã hết hạn. [Quên mật khẩu] lại để nhận link mới." | Người dùng yêu cầu link đặt lại mới |
| E-authentication-010 | Gỡ Google khi chưa có mật khẩu | Yêu cầu gỡ Google trên tài khoản chưa có mật khẩu | major | FR-authentication-024 | Chuyển sang form buộc tạo mật khẩu trước khi cho gỡ liên kết | Người dùng tạo mật khẩu đạt chính sách rồi mới gỡ Google |

## 7. Success Criteria

| ID | Outcome nghiệp vụ | Đo bằng | Mốc đạt |
|----|-------------------|---------|---------|
| SC-authentication-01 | Khách hoàn tất đăng ký đến khi tài khoản được xác nhận | Tỷ lệ khách bắt đầu đăng ký → tài khoản đã verified | ≥ 70% |
| SC-authentication-02 | Người đăng ký email hoàn tất bước xác nhận email | Tỷ lệ email xác nhận được bấm trong 24 giờ / tổng email gửi | ≥ 80% |
| SC-authentication-03 | Người dùng đăng nhập thành công không bị vướng | Tỷ lệ lần đăng nhập thành công / tổng lần thử (loại lỗi mạng) | ≥ 95% |
| SC-authentication-04 | Khách chọn Google có trải nghiệm một chạm suôn sẻ | Tỷ lệ luồng Google bắt đầu → vào app thành công | ≥ 90% |
| SC-authentication-05 | Người quên mật khẩu tự khôi phục được, giảm tải hỗ trợ | Tỷ lệ yêu cầu quên mật khẩu → đặt lại thành công | ≥ 85% |

## 8. Data Entities (tóm tắt — chi tiết ở erd.md)

- __Người dùng / Tài khoản (User/Account)__ — email (định danh duy nhất), trạng thái (`unverified`/`verified`/`locked`), ngày tạo, thời điểm khóa (nếu có).
- __Thông tin đăng nhập (Credential)__ — thuộc tài khoản, dạng lưu mật khẩu (không plaintext), thời điểm cập nhật gần nhất; có thể trống nếu tài khoản gốc tạo qua Google chưa đặt mật khẩu.
- __Nhà cung cấp liên kết (LinkedProvider — Google)__ — thuộc tài khoản, loại nhà cung cấp (Google), định danh Google, thời điểm liên kết.
- __Link xác nhận email (VerificationToken)__ — thuộc tài khoản, trạng thái (`pending`/`used`/`expired`), thời điểm tạo, hạn 24 giờ.
- __Link đặt lại mật khẩu (ResetToken)__ — thuộc tài khoản, trạng thái (`pending`/`used`/`expired`), thời điểm tạo, hạn 30 phút.
- __Phiên đăng nhập (Session)__ — thuộc tài khoản, thiết bị, trạng thái (`active`/`revoked`), có phải remember-me (30 ngày), thời điểm tạo.
- __Lần đăng nhập sai (LoginAttempt)__ — thuộc tài khoản, thời điểm, đếm sai liên tiếp (dùng cho ngưỡng captcha 3 / khóa 5); lỗi mạng không ghi vào bộ đếm.

Chi tiết quan hệ + thuộc tính ở `srs/authentication-erd.md` (chạy `/erd --feature authentication`).

## 9. Flows (tóm tắt — chi tiết ở flows.md)

- __Flow 1:__ Đăng ký email + gửi và xác nhận email (signup + verify).
- __Flow 2:__ Đăng nhập bằng email + mật khẩu (kèm ngưỡng captcha/khóa, remember-me).
- __Flow 3:__ Đăng ký/đăng nhập bằng Google OAuth (gồm tạo mới và tự liên kết).
- __Flow 4:__ Quên mật khẩu — yêu cầu link, đặt mật khẩu mới, đăng xuất mọi phiên.
- __Flow 5:__ Gỡ liên kết Google (buộc đặt mật khẩu trước nếu chưa có).

Sequence + activity diagram ở `srs/authentication-flows.md` (chạy `/sequence` và `/activity --feature authentication`).

## 10. Screens (tóm tắt — chi tiết ở ascii-wireframe/)

- __login__ — Form email/mật khẩu + nút Google + link "Đăng ký" + link "Quên mật khẩu"; các trạng thái lỗi E-003/E-004/E-005 + captcha.
- __signup__ — Form email + mật khẩu, đo độ mạnh mật khẩu; lỗi E-001/E-002.
- __verify-sent__ — "Đã gửi email xác nhận tới {email}…" + nút gửi lại (cooldown 60s / giới hạn 5/ngày).
- __verify-result-success__ — "Xác nhận email thành công! Vui lòng đăng nhập." → chuyển về login.
- __verify-result-expired__ — "Link đã hết hạn hoặc đã được sử dụng." + gửi lại link (E-006).
- __forgot-password__ — Form nhập email; sau khi gửi hiện thông báo trung tính chống dò tài khoản.
- __reset-password__ — Form nhập mật khẩu mới 2 lần; lỗi E-002 / E-009.
- __reset-result-success__ — "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại." → chuyển về login.
- __account-security__ — Gỡ liên kết Google; buộc form tạo mật khẩu nếu chưa có (E-010); danh sách thiết bị + đăng xuất từ xa (P1).

Chi tiết mỗi màn ở `ascii-wireframe/{flow-slug}.md` (chạy `/wireframe-ascii`, gộp theo flow). Lưu ý: mỗi trạng thái loại trừ nhau của cùng một màn (verify-result thành công / hết hạn) tách thành screen riêng.

## 11. Constraints, Dependencies & Assumptions

__Constraints (ràng buộc áp đặt — có source/owner):__

| Ràng buộc | Source / Owner |
|-----------|----------------|
| Chỉ phục vụ khu vực Đông Nam Á (VN/SG/TH/ID/MY/PH); KHÔNG phục vụ EU/EEA nên không áp GDPR | Quyết định phạm vi kinh doanh (brainstorm Mục 2, OQ-3) |
| Chính sách quyền riêng tư phải tuân PDPA (SG/TH) + Nghị định 13/2023/NĐ-CP (VN) trước khi ra mắt | Bộ phận pháp lý / tuân thủ |
| Chuẩn lưu trữ và bảo mật mật khẩu (thuật toán, thời hạn lưu vết) do bộ phận bảo mật/pháp lý chốt — SRS chỉ nêu "không plaintext, không log mật khẩu" | Bộ phận bảo mật/pháp lý |
| Chỉ hỗ trợ responsive webapp (mobile + desktop browser); KHÔNG có app native iOS/Android | Quyết định nền tảng (brainstorm Mục 2, OQ-4) |
| Chính sách mật khẩu cố định: 8-20 ký tự, đủ hoa/thường/ký tự đặc biệt, không chứa local-part email | CR-20260627-001 (đã chốt trong brainstorm) |
| Tự xây (self-built), không dùng nền tảng xác thực bên thứ ba (BaaS) | Quyết định kỹ thuật cấp sản phẩm (brainstorm OQ-9) |

__Dependencies (deliverable do bên khác sở hữu):__

| Phụ thuộc | Owner | Blocks nếu chưa sẵn |
|-----------|-------|---------------------|
| Dịch vụ gửi email transactional (đã cấu hình SPF/DKIM/DMARC đúng) | Bộ phận vận hành / nhà cung cấp email | Không gửi được link xác nhận và link đặt lại mật khẩu → chặn cả luồng đăng ký email lẫn quên mật khẩu |
| Google OAuth (đăng ký ứng dụng, hạn mức, cấu hình đúng) | Google | Không đăng nhập/đăng ký bằng Google được; email/mật khẩu vẫn là phương án dự phòng |
| Cơ sở dữ liệu người dùng/hồ sơ (dùng chung với app) | Đội sản phẩm english-ai-demo | Không lưu được tài khoản/phiên nếu chưa sẵn sàng |

> SRS chỉ nêu tên đối tác + mục đích + ràng buộc, KHÔNG đặc tả cách tích hợp kỹ thuật (thuộc tài liệu Integration Spec riêng).

__Assumptions (tin là đúng — nêu hệ quả nếu sai):__

| Giả định | Invalidate nếu sai |
|----------|--------------------|
| Người dùng có quyền truy cập hộp thư email đã đăng ký để bấm link xác nhận/đặt lại | Nếu không nhận được email → không hoàn tất đăng ký/khôi phục; phụ thuộc nặng vào resend + hỗ trợ, có thể mất người dùng mới |
| Email là định danh duy nhất, cả email lẫn Google đều quy về cùng khóa email để liên kết | Nếu một người có nhiều email khác nhau ở email và Google → tạo 2 tài khoản riêng, không tự liên kết được |
| Không có yêu cầu bảo vệ trẻ vị thành niên / cổng độ tuổi cho khu vực này | Nếu luật SEA yêu cầu age-gate → phải bổ sung bước xác minh độ tuổi vào luồng đăng ký |
| Lúc đăng ký chỉ cần email + mật khẩu; tên hiển thị/avatar/ngôn ngữ bổ sung sau | Nếu cần thu thập thêm field bắt buộc lúc đăng ký → mở rộng form + validation, ảnh hưởng tỷ lệ hoàn tất |
| Chấp nhận rủi ro tự liên kết Google mà không xác minh lại quyền sở hữu tài khoản đích | Nếu rủi ro chiếm tài khoản trở nên nghiêm trọng → phải thêm bước xác minh quyền sở hữu (nâng lên trong P1), thay đổi luồng D6 |

> Quyết định kỹ thuật (nền tảng, thuật toán băm, endpoint, cấu trúc dữ liệu vật lý) KHÔNG thuộc SRS của BA — để cho dev/architect ở tài liệu Architecture riêng.

## 12. Open Questions

- [ ] Có cần thêm bước xác minh quyền sở hữu khi tự liên kết Google vào tài khoản email trùng (để giảm rủi ro chiếm tài khoản), hay giữ tự liên kết như hiện tại và chỉ theo dõi qua nhật ký? (rủi ro đã ghi ở Mục 11 Assumptions + brainstorm Mục 9)
- [ ] "Ngày" trong giới hạn gửi lại 5 lần/ngày tính theo lịch (00:00 local) hay theo cửa sổ trượt 24 giờ? [NEEDS CLARIFICATION: định nghĩa mốc reset của quota gửi lại email]
- [ ] Bộ đếm đăng nhập sai (ngưỡng captcha 3 / khóa 5) tính "liên tiếp" reset khi nào — sau một lần đăng nhập thành công, hay có tự giảm theo thời gian? [NEEDS CLARIFICATION: điều kiện reset bộ đếm sai]
- [ ] Khi vận hành/admin vô hiệu hóa (disable) một tài khoản đang đăng nhập, đây có phải hành động trong scope auth không, và nếu có thì ai được phép và ghi vết ở đâu? (brainstorm Mục 6.3 nhắc "Admin disable" nhưng chưa có FR)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
