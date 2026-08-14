#1. Truy cập bảo mật tài khoản‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##1.1. Truy cập‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[2] [Yes] CHK-authentication-091 → — · Kiểm tra màn hình bảo mật tài khoản có thể truy cập đối với người dùng đã xác thực.
[2] [Yes] CHK-authentication-092 → FR-authentication-023 · Mở tài khoản đã liên kết Google; kiểm tra nút hủy liên kết hiển thị.

#2. Hủy liên kết bằng mật khẩu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##2.1. Luồng thành công‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[1] [No] CHK-authentication-093 → FR-authentication-023 · Hủy liên kết Google khỏi tài khoản có mật khẩu; kiểm tra liên kết nhà cung cấp bị xóa.
[2] [Yes] CHK-authentication-094 → FR-authentication-023 · Hủy liên kết Google khỏi tài khoản có mật khẩu; kiểm tra xác nhận thành công xuất hiện.
[1] [Yes] CHK-authentication-095 → FR-authentication-023 · Đăng nhập bằng email sau khi hủy liên kết Google; kiểm tra quyền truy cập ứng dụng thành công.
[2] [Yes] CHK-authentication-096 → FR-authentication-023 · Quay lại bảo mật tài khoản sau khi hủy liên kết Google; kiểm tra nút hủy liên kết không còn.

#3. Xử lý xác thực và lỗi‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
##3.1. Yêu cầu mật khẩu
[1] [Yes] CHK-authentication-097 → FR-authentication-024, E-authentication-010 · Chọn hủy liên kết trên tài khoản chỉ dùng Google; kiểm tra biểu mẫu bắt buộc đặt mật khẩu xuất hiện.
[1] [Yes] CHK-authentication-098 → FR-authentication-003, FR-authentication-024 · Nhập mật khẩu hợp lệ gồm 8 ký tự vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra mật khẩu được chấp nhận.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
[1] [Yes] CHK-authentication-099 → FR-authentication-003, E-authentication-002 · Nhập mật khẩu không hợp lệ vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra lỗi chính sách nội tuyến xuất hiện.
[1] [Yes] CHK-authentication-100 → FR-authentication-003, E-authentication-002 · Nhập mật khẩu chứa phần cục bộ của email vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra lỗi chính sách nội tuyến xuất hiện.

#4. Bảo mật cơ bản
##4.1. Duy trì quyền truy cập tài khoản
[1] [No] CHK-authentication-101 → FR-authentication-024, BR-authentication-004 · Hoàn tất tạo mật khẩu bắt buộc; kiểm tra thông tin xác thực bằng email tồn tại trước khi xóa nhà cung cấp.
[1] [No] CHK-authentication-102 → FR-authentication-024, BR-authentication-004 · Thử xóa nhà cung cấp trước khi tạo mật khẩu; kiểm tra liên kết Google vẫn được lưu.

#5. Khả năng truy cập cơ bản
##5.1. Bàn phím và nhãn
[3] [Yes] CHK-authentication-103 → NFR-authentication-009 · Điều hướng bảo mật tài khoản bằng Tab; kiểm tra nút hủy liên kết nhận tiêu điểm bàn phím.
[3] [Yes] CHK-authentication-104 → NFR-authentication-009 · Kiểm tra trường bắt buộc đặt mật khẩu bằng trình đọc màn hình; kiểm tra trường cung cấp nhãn lập trình.

#6. Trường hợp biên
##6.1. Tài khoản chỉ dùng Google‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
