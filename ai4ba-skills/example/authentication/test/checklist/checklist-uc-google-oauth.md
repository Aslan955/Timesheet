#1. Truy cập Google OAuth‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##1.1. Truy cập‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[2] [Yes] CHK-authentication-057 → FR-authentication-012 · Kiểm tra nút đăng nhập bằng Google hiển thị trên màn hình đăng nhập.
[2] [Yes] CHK-authentication-058 → FR-authentication-012 · Chọn đăng nhập bằng Google; kiểm tra điều hướng đến màn hình chấp thuận của Google.

#2. Hoàn tất OAuth‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##2.1. Tài khoản mới‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[2] [Yes] CHK-authentication-059 → FR-authentication-012 · Hoàn tất chấp thuận của Google bằng email Google đã xác minh; kiểm tra không yêu cầu trường hồ sơ bổ sung.
[1] [No] CHK-authentication-060 → FR-authentication-013, BR-authentication-009 · Hoàn tất chấp thuận của Google bằng email mới; kiểm tra trạng thái tài khoản được tạo là đã xác minh.
[1] [Yes] CHK-authentication-061 → FR-authentication-012 · Hoàn tất chấp thuận của Google bằng email mới; kiểm tra điều hướng vào ứng dụng.
#3. Xử lý xác thực và lỗi‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##3.1. Callback thất bại
[1] [Yes] CHK-authentication-065 → FR-authentication-015, E-authentication-008 · Hủy chấp thuận của Google; kiểm tra quay lại màn hình đăng nhập.
[1] [Yes] CHK-authentication-066 → FR-authentication-015, E-authentication-008 · Mô phỏng callback Google thất bại; kiểm tra thông báo lỗi Google xuất hiện.
[1] [No] CHK-authentication-067 → FR-authentication-015 · Mô phỏng callback Google thất bại; kiểm tra không có tài khoản chưa hoàn chỉnh nào được lưu.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[2] [Yes] CHK-authentication-068 → E-authentication-008 · Mở trạng thái lỗi Google; kiểm tra có tùy chọn thử lại hiển thị.

#4. Bảo mật cơ bản
##4.1. Nhật ký kiểm toán
[2] [No] CHK-authentication-069 → NFR-authentication-008 · Tự động liên kết Google với tài khoản hiện có; kiểm tra một sự kiện kiểm toán bất biến được ghi lại mà không chứa mật khẩu.

#5. Khả năng truy cập cơ bản
##5.1. Bàn phím
[3] [Yes] CHK-authentication-070 → NFR-authentication-009 · Điều hướng màn hình đăng nhập bằng Tab; kiểm tra nút đăng nhập bằng Google nhận tiêu điểm bàn phím.

#6. Trường hợp biên
##6.1. Email hiện có
[1] [No] CHK-authentication-062 → FR-authentication-014, BR-authentication-003 · Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra liên kết nhà cung cấp Google được tạo.
[1] [No] CHK-authentication-063 → FR-authentication-014, BR-authentication-002 · Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra không có tài khoản thứ hai được tạo.
[1] [Yes] CHK-authentication-064 → FR-authentication-014, BR-authentication-003 · Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra không yêu cầu mật khẩu cũ.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
