#1. Yêu cầu đặt lại mật khẩu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##1.1. Truy cập‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[2] [Yes] CHK-authentication-071 → FR-authentication-016 · Kiểm tra biểu mẫu quên mật khẩu có thể truy cập từ luồng đăng nhập.
[1] [Yes] CHK-authentication-072 → FR-authentication-016, BR-authentication-008 · Gửi email của tài khoản tồn tại; kiểm tra thông báo yêu cầu đặt lại trung lập xuất hiện.
[1] [Yes] CHK-authentication-073 → FR-authentication-016, NFR-authentication-007 · Gửi email không tồn tại; kiểm tra cùng thông báo yêu cầu đặt lại trung lập xuất hiện.
[1] [No] CHK-authentication-074 → FR-authentication-017 · Gửi email của tài khoản tồn tại; kiểm tra email đặt lại được gửi đi.
[1] [No] CHK-authentication-075 → FR-authentication-017 · Gửi email của tài khoản tồn tại; kiểm tra liên kết đặt lại hết hạn sau 30 phút.

#2. Đặt mật khẩu mới‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##2.1. Đặt lại hợp lệ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[2] [Yes] CHK-authentication-076 → FR-authentication-018 · Mở liên kết đặt lại chưa dùng còn hiệu lực; kiểm tra biểu mẫu mật khẩu mới tải thành công.
[2] [Yes] CHK-authentication-077 → FR-authentication-018 · Nhập các mật khẩu hợp lệ trùng khớp; kiểm tra thao tác gửi được chấp nhận.
[1] [Yes] CHK-authentication-078 → FR-authentication-018 · Nhập nội dung xác nhận khác; kiểm tra việc đặt lại mật khẩu bị từ chối.
[1] [Yes] CHK-authentication-079 → FR-authentication-003, E-authentication-002 · Nhập mật khẩu mới không hợp lệ; kiểm tra lỗi chính sách nội tuyến xuất hiện.
[1] [No] CHK-authentication-080 → FR-authentication-018 · Gửi các mật khẩu hợp lệ trùng khớp từ liên kết hợp lệ; kiểm tra thông tin xác thực của tài khoản được cập nhật.
[1] [No] CHK-authentication-081 → FR-authentication-018 · Hoàn tất đặt lại mật khẩu; kiểm tra mã thông báo đặt lại được đánh dấu là đã dùng.
[1] [No] CHK-authentication-082 → FR-authentication-019, BR-authentication-007 · Hoàn tất đặt lại mật khẩu; kiểm tra mọi phiên hiện có bị thu hồi.
[2] [Yes] CHK-authentication-083 → FR-authentication-018 · Hoàn tất đặt lại mật khẩu; kiểm tra thông báo thành công được hiển thị.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[2] [Yes] CHK-authentication-084 → FR-authentication-018 · Hoàn tất đặt lại mật khẩu; kiểm tra đích đến đăng nhập được cung cấp.

#3. Xử lý xác thực và lỗi‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##3.1. Liên kết không hợp lệ
[1] [Yes] CHK-authentication-085 → FR-authentication-020, E-authentication-009 · Mở liên kết đặt lại sau 30 phút; kiểm tra kết quả liên kết hết hạn xuất hiện.
[1] [Yes] CHK-authentication-086 → FR-authentication-020, E-authentication-009 · Mở lại liên kết đặt lại đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện.
[2] [Yes] CHK-authentication-087 → E-authentication-009 · Mở kết quả liên kết đặt lại không hợp lệ; kiểm tra tùy chọn yêu cầu đặt lại mới được cung cấp.

#4. Bảo mật cơ bản
##4.1. Sự kiện nhạy cảm
[2] [No] CHK-authentication-088 → NFR-authentication-008 · Hoàn tất đặt lại mật khẩu; kiểm tra một sự kiện kiểm toán bất biến được ghi lại mà không chứa mật khẩu.

#5. Khả năng truy cập cơ bản
##5.1. Bàn phím và nhãn
[3] [Yes] CHK-authentication-089 → NFR-authentication-009 · Điều hướng biểu mẫu đặt lại bằng Tab; kiểm tra trường mật khẩu mới nhận tiêu điểm bàn phím.

#6. Trường hợp biên
##6.1. Đặt lại trên nhiều thiết bị
[1] [Yes] CHK-authentication-090 → FR-authentication-019 · Đặt lại mật khẩu trên một thiết bị; kiểm tra phiên đang hoạt động trên thiết bị khác bị từ chối.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
