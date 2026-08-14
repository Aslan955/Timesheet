#1. Truy cập đăng nhập‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##1.1. Truy cập‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[2] [Yes] CHK-authentication-037 → — · Kiểm tra biểu mẫu đăng nhập bằng email có thể truy cập từ phiên chưa xác thực.

#2. Gửi thông tin xác thực‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##2.1. Luồng thành công‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[1] [Yes] CHK-authentication-038 → FR-authentication-008 · Gửi thông tin xác thực hợp lệ cho tài khoản đã xác minh và không bị khóa; kiểm tra điều hướng vào ứng dụng.
[1] [No] CHK-authentication-039 → FR-authentication-008 · Đăng nhập thành công sau các lần thất bại trước đó; kiểm tra bộ đếm lần thử thất bại được đặt lại.
[2] [Yes] CHK-authentication-040 → FR-authentication-011 · Mở biểu mẫu đăng nhập; kiểm tra tùy chọn nhớ đăng nhập mặc định tắt.
[1] [No] CHK-authentication-041 → FR-authentication-011, NFR-authentication-006 · Đăng nhập khi bật tùy chọn nhớ đăng nhập; kiểm tra phiên thiết bị vẫn hợp lệ trong 30 ngày.

#3. Xử lý xác thực và lỗi‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##3.1. Thông tin xác thực không hợp lệ
[1] [Yes] CHK-authentication-042 → FR-authentication-010, E-authentication-003 · Gửi mật khẩu sai cho email hiện có; kiểm tra thông báo chung về thông tin xác thực không hợp lệ xuất hiện.
[1] [Yes] CHK-authentication-043 → FR-authentication-010, NFR-authentication-007 · Gửi email không tồn tại; kiểm tra cùng thông báo chung về thông tin xác thực không hợp lệ xuất hiện.
[1] [No] CHK-authentication-044 → FR-authentication-010 · Gửi thông tin xác thực không hợp lệ; kiểm tra bộ đếm lần thử thất bại tăng thêm một.
##3.2. Chưa xác minh và lỗi mạng
[1] [Yes] CHK-authentication-050 → FR-authentication-009, E-authentication-004 · Gửi thông tin xác thực đúng cho tài khoản chưa xác minh; kiểm tra quyền truy cập ứng dụng bị chặn.
[2] [Yes] CHK-authentication-051 → FR-authentication-009, E-authentication-004 · Gửi thông tin xác thực đúng cho tài khoản chưa xác minh; kiểm tra nút gửi lại xác nhận xuất hiện.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[1] [No] CHK-authentication-052 → FR-authentication-027, BR-authentication-011 · Mô phỏng lỗi mạng khi đăng nhập; kiểm tra bộ đếm lần thử thất bại không thay đổi.

#4. Bảo mật cơ bản
##4.1. Captcha và khóa tài khoản
[1] [Yes] CHK-authentication-045 → FR-authentication-025, BR-authentication-006 · Tạo ba lần thử không hợp lệ liên tiếp; kiểm tra captcha hiển thị ở lần thử tiếp theo.
[1] [Yes] CHK-authentication-046 → FR-authentication-025 · Gửi lần thử tiếp theo mà không hoàn tất captcha; kiểm tra đăng nhập bị chặn.
[1] [No] CHK-authentication-047 → FR-authentication-026, BR-authentication-005 · Tạo năm lần thử không hợp lệ liên tiếp; kiểm tra việc khóa tài khoản được ghi nhận trong 24 giờ.
[1] [Yes] CHK-authentication-048 → FR-authentication-026, E-authentication-005 · Gửi thông tin xác thực cho tài khoản bị khóa; kiểm tra thông báo khóa tạm thời xuất hiện.
[2] [No] CHK-authentication-049 → FR-authentication-026 · Chuyển tài khoản bị khóa vượt quá 24 giờ; kiểm tra tài khoản đủ điều kiện đăng nhập trở lại.

#5. Khả năng truy cập cơ bản
##5.1. Bàn phím và nhãn
[3] [Yes] CHK-authentication-056 → NFR-authentication-009 · Điều hướng biểu mẫu đăng nhập bằng Tab; kiểm tra trường email nhận tiêu điểm bàn phím.

#6. Trường hợp biên
##6.1. Phiên đồng thời
[1] [Yes] CHK-authentication-053 → FR-authentication-021 · Đăng nhập cùng tài khoản trên thiết bị thứ hai; kiểm tra phiên trên thiết bị đầu tiên vẫn hoạt động.
[1] [Yes] CHK-authentication-054 → FR-authentication-022 · Chọn đăng xuất trên thiết bị hiện tại; kiểm tra thiết bị đó trở về trạng thái chưa xác thực.
[1] [Yes] CHK-authentication-055 → FR-authentication-022 · Chọn đăng xuất trên một thiết bị; kiểm tra phiên đang hoạt động trên thiết bị khác vẫn sử dụng được.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
