#1. Truy cập đăng ký‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##1.1. Truy cập‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[2] [Yes] CHK-authentication-001 → — · Kiểm tra biểu mẫu đăng ký có thể truy cập từ phiên chưa xác thực.

#2. Nhập thông tin xác thực‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##2.1. Chính sách mật khẩu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[1] [Yes] CHK-authentication-002 → FR-authentication-003 · Nhập mật khẩu hợp lệ gồm 8 ký tự; kiểm tra trường chấp nhận mật khẩu.
[2] [Yes] CHK-authentication-003 → FR-authentication-003 · Nhập mật khẩu hợp lệ gồm 20 ký tự; kiểm tra trường chấp nhận mật khẩu.
[1] [Yes] CHK-authentication-004 → FR-authentication-003, E-authentication-002 · Nhập mật khẩu gồm 7 ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện.
[1] [Yes] CHK-authentication-005 → FR-authentication-003, E-authentication-002 · Nhập mật khẩu gồm 21 ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện.
[1] [Yes] CHK-authentication-006 → FR-authentication-003, E-authentication-002 · Nhập mật khẩu không có chữ hoa; kiểm tra lỗi chính sách nội tuyến xuất hiện.
[1] [Yes] CHK-authentication-007 → FR-authentication-003, E-authentication-002 · Nhập mật khẩu không có chữ thường; kiểm tra lỗi chính sách nội tuyến xuất hiện.
[1] [Yes] CHK-authentication-008 → FR-authentication-003, E-authentication-002 · Nhập mật khẩu không có ký tự đặc biệt; kiểm tra lỗi chính sách nội tuyến xuất hiện.
[1] [Yes] CHK-authentication-009 → FR-authentication-003, E-authentication-002 · Nhập mật khẩu chứa phần cục bộ của email có ít nhất ba ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện.
[3] [Yes] CHK-authentication-010 → FR-authentication-029 · Nhập mật khẩu; kiểm tra chỉ báo độ mạnh cập nhật theo thời gian thực.

#3. Gửi đăng ký‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##3.1. Luồng thành công
[1] [No] CHK-authentication-011 → FR-authentication-001 · Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra trạng thái tài khoản được tạo là chưa xác minh.
[1] [No] CHK-authentication-012 → FR-authentication-004 · Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra email xác nhận chứa liên kết có hiệu lực 24 giờ được gửi đi.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[2] [Yes] CHK-authentication-013 → FR-authentication-004 · Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra màn hình đã gửi xác nhận hiển thị email đã gửi.

#4. Xử lý xác thực và lỗi
##4.1. Email đã tồn tại
[1] [Yes] CHK-authentication-014 → FR-authentication-002, E-authentication-001 · Gửi email đã đăng ký; kiểm tra lỗi nội tuyến email trùng lặp xuất hiện.
[2] [Yes] CHK-authentication-015 → E-authentication-001 · Chọn liên kết khôi phục đăng nhập từ lỗi email trùng lặp; kiểm tra điều hướng đến luồng đăng nhập.

#5. Bảo mật cơ bản
##5.1. Bảo vệ khỏi bot
[2] [Yes] CHK-authentication-016 → FR-authentication-031 · Kích hoạt bảo vệ khỏi bot khi đăng ký; kiểm tra captcha được yêu cầu trước khi gửi.
[1] [No] CHK-authentication-017 → NFR-authentication-003 · Kiểm tra nhật ký xác thực sau khi đăng ký; kiểm tra mật khẩu đã gửi không xuất hiện.

#6. Khả năng truy cập cơ bản
##6.1. Bàn phím và nhãn
[3] [Yes] CHK-authentication-018 → NFR-authentication-009 · Điều hướng biểu mẫu bằng Tab; kiểm tra nút gửi nhận tiêu điểm bàn phím.
[3] [Yes] CHK-authentication-019 → NFR-authentication-009 · Kiểm tra trường mật khẩu bằng trình đọc màn hình; kiểm tra trường cung cấp nhãn lập trình.

#7. Trường hợp biên
##7.1. Lưu giữ tài khoản chưa xác minh
[2] [No] CHK-authentication-020 → FR-authentication-028, BR-authentication-010 · Chuyển tài khoản chưa xác minh vượt quá 24 giờ; kiểm tra tài khoản bị xóa.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
