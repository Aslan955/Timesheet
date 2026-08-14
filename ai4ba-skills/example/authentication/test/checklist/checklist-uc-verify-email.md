#1. Truy cập xác minh‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##1.1. Liên kết xác nhận‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[2] [Yes] CHK-authentication-021 → FR-authentication-005 · Mở liên kết xác nhận hợp lệ; kiểm tra trang kết quả xác minh tải thành công.

#2. Xác nhận email‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##2.1. Luồng thành công‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[1] [No] CHK-authentication-022 → FR-authentication-005 · Dùng liên kết xác nhận chưa dùng còn hiệu lực; kiểm tra trạng thái tài khoản chuyển thành đã xác minh.
[1] [No] CHK-authentication-023 → FR-authentication-005 · Dùng liên kết xác nhận hợp lệ; kiểm tra mã thông báo được đánh dấu là đã dùng.
[2] [Yes] CHK-authentication-024 → FR-authentication-005 · Dùng liên kết xác nhận hợp lệ; kiểm tra thông báo thành công được hiển thị.
[2] [Yes] CHK-authentication-025 → FR-authentication-005 · Dùng liên kết xác nhận hợp lệ; kiểm tra đích đến đăng nhập được cung cấp.

#3. Xử lý xác thực và lỗi‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##3.1. Liên kết không hợp lệ
[1] [Yes] CHK-authentication-026 → FR-authentication-006, E-authentication-006 · Mở liên kết xác nhận sau 24 giờ; kiểm tra kết quả liên kết hết hạn xuất hiện.
[1] [Yes] CHK-authentication-027 → FR-authentication-006, E-authentication-006 · Mở lại liên kết xác nhận đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện.
##3.2. Giới hạn gửi lại
[2] [Yes] CHK-authentication-028 → FR-authentication-007 · Mở trạng thái đã gửi xác nhận; kiểm tra nút gửi lại hiển thị.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[1] [No] CHK-authentication-029 → FR-authentication-007 · Yêu cầu gửi lại được phép; kiểm tra email xác nhận mới được gửi đi.
[1] [No] CHK-authentication-030 → FR-authentication-007 · Yêu cầu gửi lại được phép; kiểm tra liên kết mới có thời hạn hiệu lực 24 giờ.
[2] [Yes] CHK-authentication-031 → FR-authentication-007, E-authentication-007 · Yêu cầu gửi lại hai lần trong vòng 60 giây; kiểm tra lỗi thời gian chờ xuất hiện.
[2] [Yes] CHK-authentication-032 → FR-authentication-007, E-authentication-007 · Yêu cầu gửi lại sau năm lần gửi trong một ngày; kiểm tra lỗi giới hạn hằng ngày xuất hiện.
[3] [Yes] CHK-authentication-033 → FR-authentication-007, E-authentication-007 · Kích hoạt thời gian chờ gửi lại; kiểm tra gợi ý thời gian chờ còn lại được hiển thị.

#4. Bảo mật cơ bản
##4.1. Dùng một lần
[1] [Yes] CHK-authentication-034 → FR-authentication-006, E-authentication-006 · Dùng một mã thông báo xác nhận từ thiết bị thứ hai sau khi đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện.

#5. Khả năng truy cập cơ bản
##5.1. Bàn phím
[3] [Yes] CHK-authentication-035 → NFR-authentication-009 · Điều hướng kết quả xác minh bằng Tab; kiểm tra nút gửi lại nhận tiêu điểm bàn phím.

#6. Trường hợp biên
##6.1. Cổng truy cập
[1] [Yes] CHK-authentication-036 → BR-authentication-001 · Thử mở nội dung học tập được bảo vệ trước khi xác minh; kiểm tra quyền truy cập bị từ chối.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
