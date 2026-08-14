**STT:** 55
**Category:** Truy cập đăng ký
**Sub-Category:** Truy cập
**Checklist:** CHK-authentication-001 — Kiểm tra biểu mẫu đăng ký có thể truy cập từ phiên chưa xác thực.
**Ref:** —
**Priority:** 2
**Title:** Kiểm tra biểu mẫu đăng ký có thể truy cập từ phiên chưa xác thực
**Description:** Kiểm chứng: Kiểm tra biểu mẫu đăng ký có thể truy cập từ phiên chưa xác thực.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Từ một phiên chưa xác thực, truy cập form đăng ký.
**Expected:** Form đăng ký mở được khi phiên chưa xác thực. [TBD: cần BA cấp wording]
**Test Data:** —

***

**STT:** 56
**Category:** Nhập thông tin xác thực
**Sub-Category:** Chính sách mật khẩu
**Checklist:** CHK-authentication-002 — Nhập mật khẩu hợp lệ gồm 8 ký tự; kiểm tra trường chấp nhận mật khẩu.
**Ref:** FR-authentication-003
**Priority:** 1
**Title:** Nhập mật khẩu hợp lệ gồm 8 ký tự; kiểm tra trường chấp nhận mật khẩu
**Description:** Kiểm chứng: Nhập mật khẩu hợp lệ gồm 8 ký tự; kiểm tra trường chấp nhận mật khẩu.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Trên form đăng ký, nhập mật khẩu 8 ký tự thỏa chính sách.
**Expected:** Trường mật khẩu chấp nhận giá trị vì có độ dài 8 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt, đồng thời không chứa local-part email (FR-authentication-003).
**Test Data:** Mật khẩu: Hoc2024!

***

**STT:** 57
**Category:** Nhập thông tin xác thực
**Sub-Category:** Chính sách mật khẩu
**Checklist:** CHK-authentication-003 — Nhập mật khẩu hợp lệ gồm 20 ký tự; kiểm tra trường chấp nhận mật khẩu.
**Ref:** FR-authentication-003
**Priority:** 2
**Title:** Nhập mật khẩu hợp lệ gồm 20 ký tự; kiểm tra trường chấp nhận mật khẩu
**Description:** Kiểm chứng: Nhập mật khẩu hợp lệ gồm 20 ký tự; kiểm tra trường chấp nhận mật khẩu.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Trên form đăng ký, nhập mật khẩu 20 ký tự thỏa chính sách.
**Expected:** Trường mật khẩu chấp nhận giá trị vì có độ dài 20 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt, đồng thời không chứa local-part email (FR-authentication-003).
**Test Data:** Mật khẩu: Hocmatkhau2024!Abcde (20 ký tự)

***

**STT:** 58
**Category:** Nhập thông tin xác thực
**Sub-Category:** Chính sách mật khẩu
**Checklist:** CHK-authentication-004 — Nhập mật khẩu gồm 7 ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện.
**Ref:** FR-authentication-003, E-authentication-002
**Priority:** 1
**Title:** Nhập mật khẩu gồm 7 ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện
**Description:** Kiểm chứng: Nhập mật khẩu gồm 7 ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Trên form đăng ký, nhập mật khẩu 7 ký tự vào trường mật khẩu.
**Expected:** Form hiện lỗi inline real-time "Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn" (E-authentication-002).
**Test Data:** Mật khẩu: Hoc24! (7 ký tự)

***

**STT:** 59
**Category:** Nhập thông tin xác thực
**Sub-Category:** Chính sách mật khẩu
**Checklist:** CHK-authentication-005 — Nhập mật khẩu gồm 21 ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện.
**Ref:** FR-authentication-003, E-authentication-002
**Priority:** 1
**Title:** Nhập mật khẩu gồm 21 ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện
**Description:** Kiểm chứng: Nhập mật khẩu gồm 21 ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Trên form đăng ký, nhập mật khẩu 21 ký tự vào trường mật khẩu.
**Expected:** Form hiện lỗi inline real-time "Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn" (E-authentication-002).
**Test Data:** Mật khẩu: Hoclongpassword2024!A (21 ký tự)

***

**STT:** 60
**Category:** Nhập thông tin xác thực
**Sub-Category:** Chính sách mật khẩu
**Checklist:** CHK-authentication-006 — Nhập mật khẩu không có chữ hoa; kiểm tra lỗi chính sách nội tuyến xuất hiện.
**Ref:** FR-authentication-003, E-authentication-002
**Priority:** 1
**Title:** Nhập mật khẩu không có chữ hoa; kiểm tra lỗi chính sách nội tuyến xuất hiện
**Description:** Kiểm chứng: Nhập mật khẩu không có chữ hoa; kiểm tra lỗi chính sách nội tuyến xuất hiện.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Trên form đăng ký, nhập mật khẩu không có chữ hoa vào trường mật khẩu.
**Expected:** Form hiện lỗi inline real-time "Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn" (E-authentication-002).
**Test Data:** Mật khẩu: hoc2024! (không hoa)

***

**STT:** 61
**Category:** Nhập thông tin xác thực
**Sub-Category:** Chính sách mật khẩu
**Checklist:** CHK-authentication-007 — Nhập mật khẩu không có chữ thường; kiểm tra lỗi chính sách nội tuyến xuất hiện.
**Ref:** FR-authentication-003, E-authentication-002
**Priority:** 1
**Title:** Nhập mật khẩu không có chữ thường; kiểm tra lỗi chính sách nội tuyến xuất hiện
**Description:** Kiểm chứng: Nhập mật khẩu không có chữ thường; kiểm tra lỗi chính sách nội tuyến xuất hiện.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Trên form đăng ký, nhập mật khẩu không có chữ thường vào trường mật khẩu.
**Expected:** Form hiện lỗi inline real-time "Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn" (E-authentication-002).
**Test Data:** Mật khẩu: HOC2024! (không thường)

***

**STT:** 62
**Category:** Nhập thông tin xác thực
**Sub-Category:** Chính sách mật khẩu
**Checklist:** CHK-authentication-008 — Nhập mật khẩu không có ký tự đặc biệt; kiểm tra lỗi chính sách nội tuyến xuất hiện.
**Ref:** FR-authentication-003, E-authentication-002
**Priority:** 1
**Title:** Nhập mật khẩu không có ký tự đặc biệt; kiểm tra lỗi chính sách nội tuyến xuất hiện
**Description:** Kiểm chứng: Nhập mật khẩu không có ký tự đặc biệt; kiểm tra lỗi chính sách nội tuyến xuất hiện.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Trên form đăng ký, nhập mật khẩu không có ký tự đặc biệt vào trường mật khẩu.
**Expected:** Form hiện lỗi inline real-time "Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn" (E-authentication-002).
**Test Data:** Mật khẩu: Hoc20240 (không ký tự đặc biệt)

***

**STT:** 63
**Category:** Nhập thông tin xác thực
**Sub-Category:** Chính sách mật khẩu
**Checklist:** CHK-authentication-009 — Nhập mật khẩu chứa phần cục bộ của email có ít nhất ba ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện.
**Ref:** FR-authentication-003, E-authentication-002
**Priority:** 1
**Title:** Nhập mật khẩu chứa phần cục bộ của email có ít nhất ba ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện
**Description:** Kiểm chứng: Nhập mật khẩu chứa phần cục bộ của email có ít nhất ba ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Trên form đăng ký, nhập email rồi nhập mật khẩu có chứa local-part của email (ít nhất 3 ký tự) vào trường mật khẩu.
**Expected:** Form hiện lỗi inline real-time "Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn" (E-authentication-002).
**Test Data:** Email: learner@example.com; Mật khẩu: Learner!1

***

**STT:** 64
**Category:** Nhập thông tin xác thực
**Sub-Category:** Chính sách mật khẩu
**Checklist:** CHK-authentication-010 — Nhập mật khẩu; kiểm tra chỉ báo độ mạnh cập nhật theo thời gian thực.
**Ref:** FR-authentication-029
**Priority:** 3
**Title:** Nhập mật khẩu; kiểm tra chỉ báo độ mạnh cập nhật theo thời gian thực
**Description:** Kiểm chứng: Nhập mật khẩu; kiểm tra chỉ báo độ mạnh cập nhật theo thời gian thực.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Trên form đăng ký, lần lượt nhập các mật khẩu có độ mạnh khác nhau vào trường mật khẩu.
**Expected:** Chỉ báo mức độ mạnh của mật khẩu cập nhật theo thời gian thực khi người dùng nhập mật khẩu trên form đăng ký (FR-authentication-029).
**Test Data:** Mật khẩu: Hoc2024!

---‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

**STT:** 65
**Category:** Gửi đăng ký
**Sub-Category:** Luồng thành công
**Checklist:** CHK-authentication-011 — Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra trạng thái tài khoản được tạo là chưa xác minh.
**Ref:** FR-authentication-001
**Priority:** 1
**Title:** Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra trạng thái tài khoản được tạo là chưa xác minh
**Description:** Kiểm chứng: Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra trạng thái tài khoản được tạo là chưa xác minh.
**Auto:** No
**Preconditions:** —

**Step:** 1
**Action:** Trên form đăng ký, nhập email chưa tồn tại và mật khẩu đạt chính sách rồi gửi form.
**Expected:** Hệ thống tạo tài khoản với trạng thái `unverified` khi email và mật khẩu hợp lệ, đồng thời email chưa tồn tại (FR-authentication-001).
**Test Data:** Email: newuser@example.com; Mật khẩu: Hoc2024!

***

**STT:** 66
**Category:** Gửi đăng ký
**Sub-Category:** Luồng thành công
**Checklist:** CHK-authentication-012 — Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra email xác nhận chứa liên kết có hiệu lực 24 giờ được gửi đi.
**Ref:** FR-authentication-004
**Priority:** 1
**Title:** Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra email xác nhận chứa liên kết có hiệu lực 24 giờ được gửi đi
**Description:** Kiểm chứng: Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra email xác nhận chứa liên kết có hiệu lực 24 giờ được gửi đi.
**Auto:** No
**Preconditions:** —

**Step:** 1
**Action:** Trên form đăng ký, nhập email chưa tồn tại và mật khẩu đạt chính sách rồi gửi form; kiểm tra hộp thư của email đã đăng ký.
**Expected:** Sau khi tài khoản được tạo, hệ thống gửi tới địa chỉ đã đăng ký email chứa link xác nhận có hạn 24 giờ (FR-authentication-004).
**Test Data:** Email: newuser@example.com; Mật khẩu: Hoc2024!

***

**STT:** 67
**Category:** Gửi đăng ký
**Sub-Category:** Luồng thành công
**Checklist:** CHK-authentication-013 — Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra màn hình đã gửi xác nhận hiển thị email đã gửi.
**Ref:** FR-authentication-004
**Priority:** 2
**Title:** Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra màn hình đã gửi xác nhận hiển thị email đã gửi
**Description:** Kiểm chứng: Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra màn hình đã gửi xác nhận hiển thị email đã gửi.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Trên form đăng ký, nhập email chưa tồn tại và mật khẩu đạt chính sách rồi gửi form.
**Expected:** Hệ thống gửi email xác nhận chứa link có hạn 24 giờ tới địa chỉ đã đăng ký; SRS không nêu màn hình xác nhận sau khi gửi hoặc việc hiển thị lại địa chỉ email. [TBD: cần BA cấp wording]
**Test Data:** Email: newuser@example.com; Mật khẩu: Hoc2024!

***

**STT:** 68
**Category:** Xử lý xác thực và lỗi
**Sub-Category:** Email đã tồn tại
**Checklist:** CHK-authentication-014 — Gửi email đã đăng ký; kiểm tra lỗi nội tuyến email trùng lặp xuất hiện.
**Ref:** FR-authentication-002, E-authentication-001
**Priority:** 1
**Title:** Gửi email đã đăng ký; kiểm tra lỗi nội tuyến email trùng lặp xuất hiện
**Description:** Kiểm chứng: Gửi email đã đăng ký; kiểm tra lỗi nội tuyến email trùng lặp xuất hiện.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Trên form đăng ký, nhập email đã đăng ký và mật khẩu đạt chính sách rồi gửi form.
**Expected:** Form đăng ký hiện lỗi inline "Email này đã được đăng ký. Bạn muốn [đăng nhập] hoặc [quên mật khẩu]?"; hệ thống chặn tạo tài khoản (E-authentication-001).
**Test Data:** Email: learner@email.com; Mật khẩu: Hoc2024!

***

**STT:** 69
**Category:** Xử lý xác thực và lỗi
**Sub-Category:** Email đã tồn tại
**Checklist:** CHK-authentication-015 — Chọn liên kết khôi phục đăng nhập từ lỗi email trùng lặp; kiểm tra điều hướng đến luồng đăng nhập.
**Ref:** E-authentication-001
**Priority:** 2
**Title:** Chọn liên kết khôi phục đăng nhập từ lỗi email trùng lặp; kiểm tra điều hướng đến luồng đăng nhập
**Description:** Kiểm chứng: Chọn liên kết khôi phục đăng nhập từ lỗi email trùng lặp; kiểm tra điều hướng đến luồng đăng nhập.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Gửi form đăng ký với email đã đăng ký, rồi chọn liên kết [đăng nhập] trong lỗi inline xuất hiện.
**Expected:** Form đăng ký hiện lỗi inline "Email này đã được đăng ký. Bạn muốn [đăng nhập] hoặc [quên mật khẩu]?"; khi chọn [đăng nhập], người dùng được chuyển sang luồng đăng nhập (E-authentication-001).
**Test Data:** Email: learner@email.com; Mật khẩu: Hoc2024!

***

**STT:** 70
**Category:** Bảo mật cơ bản
**Sub-Category:** Bảo vệ khỏi bot
**Checklist:** CHK-authentication-016 — Kích hoạt bảo vệ khỏi bot khi đăng ký; kiểm tra captcha được yêu cầu trước khi gửi.
**Ref:** FR-authentication-031
**Priority:** 2
**Title:** Kích hoạt bảo vệ khỏi bot khi đăng ký; kiểm tra captcha được yêu cầu trước khi gửi
**Description:** Kiểm chứng: Kích hoạt bảo vệ khỏi bot khi đăng ký; kiểm tra captcha được yêu cầu trước khi gửi.
**Auto:** Yes
**Preconditions:** Tài khoản đã có 3 lần đăng nhập sai liên tiếp (dựng: submit sai mật khẩu 3 lần; nguồn: FR-authentication-025)

**Step:** 1
**Action:** Trên form đăng ký, nhập email và mật khẩu đạt chính sách, không hoàn tất captcha rồi gửi form.
**Expected:** Form đăng ký yêu cầu captcha trước khi gửi để chống đăng ký hàng loạt bằng bot (FR-authentication-031).
**Test Data:** Email: newuser@example.com; Mật khẩu: Hoc2024!

***

**STT:** 71
**Category:** Bảo mật cơ bản
**Sub-Category:** Bảo vệ khỏi bot
**Checklist:** CHK-authentication-017 — Kiểm tra nhật ký xác thực sau khi đăng ký; kiểm tra mật khẩu đã gửi không xuất hiện.
**Ref:** NFR-authentication-003
**Priority:** 1
**Title:** Kiểm tra nhật ký xác thực sau khi đăng ký; kiểm tra mật khẩu đã gửi không xuất hiện
**Description:** Kiểm chứng: Kiểm tra nhật ký xác thực sau khi đăng ký; kiểm tra mật khẩu đã gửi không xuất hiện.
**Auto:** No
**Preconditions:** —

**Step:** 1
**Action:** Đăng ký bằng email và mật khẩu hợp lệ, sau đó kiểm tra nhật ký xác thực tạo bởi luồng đăng ký.
**Expected:** Nhật ký không chứa mật khẩu đã gửi; mật khẩu không được lưu dạng plaintext và không được ghi vào log (NFR-authentication-003).
**Test Data:** Email: newuser@example.com; Mật khẩu: Hoc2024!

***

**STT:** 72
**Category:** Khả năng truy cập cơ bản
**Sub-Category:** Bàn phím và nhãn
**Checklist:** CHK-authentication-018 — Điều hướng biểu mẫu bằng Tab; kiểm tra nút gửi nhận tiêu điểm bàn phím.
**Ref:** NFR-authentication-009
**Priority:** 3
**Title:** Điều hướng biểu mẫu bằng Tab; kiểm tra nút gửi nhận tiêu điểm bàn phím
**Description:** Kiểm chứng: Điều hướng biểu mẫu bằng Tab; kiểm tra nút gửi nhận tiêu điểm bàn phím.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Trên form đăng ký, nhấn Tab lần lượt qua các trường và nút chính đến nút gửi.
**Expected:** Form đăng ký hỗ trợ điều hướng bằng bàn phím; nút gửi nhận tiêu điểm bàn phím (NFR-authentication-009).
**Test Data:** —

***

**STT:** 73
**Category:** Khả năng truy cập cơ bản
**Sub-Category:** Bàn phím và nhãn
**Checklist:** CHK-authentication-019 — Kiểm tra trường mật khẩu bằng trình đọc màn hình; kiểm tra trường cung cấp nhãn lập trình.
**Ref:** NFR-authentication-009
**Priority:** 3
**Title:** Kiểm tra trường mật khẩu bằng trình đọc màn hình; kiểm tra trường cung cấp nhãn lập trình
**Description:** Kiểm chứng: Kiểm tra trường mật khẩu bằng trình đọc màn hình; kiểm tra trường cung cấp nhãn lập trình.
**Auto:** Yes
**Preconditions:** —

**Step:** 1
**Action:** Dùng trình đọc màn hình di chuyển đến trường mật khẩu trên form đăng ký.
**Expected:** Trình đọc màn hình nhận được nhãn lập trình của trường mật khẩu; form đăng ký hỗ trợ nhãn cho trình đọc màn hình ở các trường và nút chính (NFR-authentication-009).
**Test Data:** —

***

**STT:** 74
**Category:** Trường hợp biên
**Sub-Category:** Lưu giữ tài khoản chưa xác minh
**Checklist:** CHK-authentication-020 — Chuyển tài khoản chưa xác minh vượt quá 24 giờ; kiểm tra tài khoản bị xóa.
**Ref:** FR-authentication-028, BR-authentication-010
**Priority:** 2
**Title:** Chuyển tài khoản chưa xác minh vượt quá 24 giờ; kiểm tra tài khoản bị xóa
**Description:** Kiểm chứng: Chuyển tài khoản chưa xác minh vượt quá 24 giờ; kiểm tra tài khoản bị xóa.
**Auto:** No
**Preconditions:** —

**Step:** 1
**Action:** Chuẩn bị tài khoản ở trạng thái `unverified` đã quá 24 giờ, rồi chạy hoặc chờ tiến trình nền rà tài khoản chưa xác nhận.
**Expected:** Hệ thống tự xóa tài khoản có trạng thái `unverified` quá 24 giờ (FR-authentication-028, BR-authentication-010).
**Test Data:** Tài khoản: `unverified`, tuổi tài khoản: >24 giờ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
