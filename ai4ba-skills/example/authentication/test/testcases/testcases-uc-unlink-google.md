__STT:__ 75
__Category:__ Truy cập bảo mật tài khoản
__Sub-Category:__ Truy cập
__Checklist:__ CHK-authentication-091 — Kiểm tra màn hình bảo mật tài khoản có thể truy cập đối với người dùng đã xác thực.
__Ref:__ —
__Priority:__ 2
__Title:__ Kiểm tra màn hình bảo mật tài khoản có thể truy cập đối với người dùng đã xác thực
__Description:__ Kiểm chứng: Kiểm tra màn hình bảo mật tài khoản có thể truy cập đối với người dùng đã xác thực.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Đăng nhập bằng tài khoản đã xác thực, rồi mở màn hình bảo mật tài khoản.
__Expected:__ Người dùng đã xác thực mở được màn hình `account-security`, nơi SRS xác định có chức năng gỡ liên kết Google. [TBD: cần BA cấp wording]
__Test Data:__ —

---

__STT:__ 76
__Category:__ Truy cập bảo mật tài khoản
__Sub-Category:__ Truy cập
__Checklist:__ CHK-authentication-092 — Mở tài khoản đã liên kết Google; kiểm tra nút hủy liên kết hiển thị.
__Ref:__ FR-authentication-023
__Priority:__ 2
__Title:__ Mở tài khoản đã liên kết Google; kiểm tra nút hủy liên kết hiển thị
__Description:__ Kiểm chứng: Mở tài khoản đã liên kết Google; kiểm tra nút hủy liên kết hiển thị.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Đăng nhập tài khoản đã liên kết Google và mở màn hình bảo mật tài khoản.
__Expected:__ Màn hình bảo mật tài khoản cung cấp chức năng gỡ liên kết Google cho tài khoản đang có liên kết Google (FR-authentication-023).
__Test Data:__ Email: learner@email.com / Google: đã liên kết

---

__STT:__ 77
__Category:__ Hủy liên kết bằng mật khẩu
__Sub-Category:__ Luồng thành công
__Checklist:__ CHK-authentication-093 — Hủy liên kết Google khỏi tài khoản có mật khẩu; kiểm tra liên kết nhà cung cấp bị xóa.
__Ref:__ FR-authentication-023
__Priority:__ 1
__Title:__ Hủy liên kết Google khỏi tài khoản có mật khẩu; kiểm tra liên kết nhà cung cấp bị xóa
__Description:__ Kiểm chứng: Hủy liên kết Google khỏi tài khoản có mật khẩu; kiểm tra liên kết nhà cung cấp bị xóa.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Trên màn hình bảo mật tài khoản đã có mật khẩu, thực hiện chức năng gỡ liên kết Google.
__Expected:__ Liên kết Google được gỡ khỏi tài khoản; khả năng đăng nhập bằng email và mật khẩu vẫn được giữ lại (FR-authentication-023).
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024! / Google: đã liên kết

---

__STT:__ 78
__Category:__ Hủy liên kết bằng mật khẩu
__Sub-Category:__ Luồng thành công
__Checklist:__ CHK-authentication-094 — Hủy liên kết Google khỏi tài khoản có mật khẩu; kiểm tra xác nhận thành công xuất hiện.
__Ref:__ FR-authentication-023
__Priority:__ 2
__Title:__ Hủy liên kết Google khỏi tài khoản có mật khẩu; kiểm tra xác nhận thành công xuất hiện
__Description:__ Kiểm chứng: Hủy liên kết Google khỏi tài khoản có mật khẩu; kiểm tra xác nhận thành công xuất hiện.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Trên màn hình bảo mật tài khoản đã có mật khẩu, thực hiện chức năng gỡ liên kết Google.
__Expected:__ Hệ thống hoàn tất việc gỡ liên kết Google và giữ khả năng đăng nhập bằng email/mật khẩu của tài khoản (FR-authentication-023).
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024! / Google: đã liên kết

---

__STT:__ 79
__Category:__ Hủy liên kết bằng mật khẩu
__Sub-Category:__ Luồng thành công
__Checklist:__ CHK-authentication-095 — Đăng nhập bằng email sau khi hủy liên kết Google; kiểm tra quyền truy cập ứng dụng thành công.
__Ref:__ FR-authentication-023
__Priority:__ 1
__Title:__ Đăng nhập bằng email sau khi hủy liên kết Google; kiểm tra quyền truy cập ứng dụng thành công
__Description:__ Kiểm chứng: Đăng nhập bằng email sau khi hủy liên kết Google; kiểm tra quyền truy cập ứng dụng thành công.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Sau khi đã gỡ liên kết Google, gửi form đăng nhập với email và mật khẩu của tài khoản.
__Expected:__ Người dùng vẫn đăng nhập được bằng email/mật khẩu sau khi liên kết Google đã được gỡ, qua đó duy trì quyền truy cập ứng dụng (FR-authentication-023).
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024!

---

__STT:__ 80
__Category:__ Hủy liên kết bằng mật khẩu
__Sub-Category:__ Luồng thành công
__Checklist:__ CHK-authentication-096 — Quay lại bảo mật tài khoản sau khi hủy liên kết Google; kiểm tra nút hủy liên kết không còn.
__Ref:__ FR-authentication-023
__Priority:__ 2
__Title:__ Quay lại bảo mật tài khoản sau khi hủy liên kết Google; kiểm tra nút hủy liên kết không còn
__Description:__ Kiểm chứng: Quay lại bảo mật tài khoản sau khi hủy liên kết Google; kiểm tra nút hủy liên kết không còn.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Sau khi đã gỡ liên kết Google, mở lại màn hình bảo mật tài khoản.
__Expected:__ Tài khoản không còn liên kết Google sau thao tác gỡ liên kết (FR-authentication-023).
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024!

---

__STT:__ 81
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Yêu cầu mật khẩu
__Checklist:__ CHK-authentication-097 — Chọn hủy liên kết trên tài khoản chỉ dùng Google; kiểm tra biểu mẫu bắt buộc đặt mật khẩu xuất hiện.
__Ref:__ FR-authentication-024, E-authentication-010
__Priority:__ 1
__Title:__ Chọn hủy liên kết trên tài khoản chỉ dùng Google; kiểm tra biểu mẫu bắt buộc đặt mật khẩu xuất hiện
__Description:__ Kiểm chứng: Chọn hủy liên kết trên tài khoản chỉ dùng Google; kiểm tra biểu mẫu bắt buộc đặt mật khẩu xuất hiện.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Trên màn hình bảo mật tài khoản chỉ dùng Google, thực hiện chức năng gỡ liên kết Google.
__Expected:__ Hệ thống áp dụng trạng thái "Chuyển sang form buộc tạo mật khẩu trước khi cho gỡ liên kết"; liên kết Google chưa bị gỡ (E-authentication-010).
__Test Data:__ Tài khoản chỉ dùng Google: learner@email.com

---‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__STT:__ 82
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Yêu cầu mật khẩu
__Checklist:__ CHK-authentication-098 — Nhập mật khẩu hợp lệ gồm 8 ký tự vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra mật khẩu được chấp nhận.
__Ref:__ FR-authentication-003, FR-authentication-024
__Priority:__ 1
__Title:__ Nhập mật khẩu hợp lệ gồm 8 ký tự vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra mật khẩu được chấp nhận
__Description:__ Kiểm chứng: Nhập mật khẩu hợp lệ gồm 8 ký tự vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra mật khẩu được chấp nhận.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Tại form buộc tạo mật khẩu, nhập mật khẩu hợp lệ vào trường mật khẩu.
__Expected:__ Mật khẩu được chấp nhận khi dài 8–20 ký tự, có ít nhất một chữ hoa, một chữ thường, một ký tự đặc biệt và không chứa local-part của email; sau đó mới có thể gỡ liên kết Google (FR-authentication-003, FR-authentication-024).
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024!

---

__STT:__ 83
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Yêu cầu mật khẩu
__Checklist:__ CHK-authentication-099 — Nhập mật khẩu không hợp lệ vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra lỗi chính sách nội tuyến xuất hiện.
__Ref:__ FR-authentication-003, E-authentication-002
__Priority:__ 1
__Title:__ Nhập mật khẩu không hợp lệ vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra lỗi chính sách nội tuyến xuất hiện
__Description:__ Kiểm chứng: Nhập mật khẩu không hợp lệ vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra lỗi chính sách nội tuyến xuất hiện.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Tại form buộc tạo mật khẩu, nhập mật khẩu không thỏa chính sách vào trường mật khẩu.
__Expected:__ Form hiện lỗi nội tuyến real-time "Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn" (E-authentication-002).
__Test Data:__ Email: learner@email.com / Mật khẩu: 123

---

__STT:__ 84
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Yêu cầu mật khẩu
__Checklist:__ CHK-authentication-100 — Nhập mật khẩu chứa phần cục bộ của email vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra lỗi chính sách nội tuyến xuất hiện.
__Ref:__ FR-authentication-003, E-authentication-002
__Priority:__ 1
__Title:__ Nhập mật khẩu chứa phần cục bộ của email vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra lỗi chính sách nội tuyến xuất hiện
__Description:__ Kiểm chứng: Nhập mật khẩu chứa phần cục bộ của email vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra lỗi chính sách nội tuyến xuất hiện.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Tại form buộc tạo mật khẩu, nhập mật khẩu có chứa local-part của email vào trường mật khẩu.
__Expected:__ Form hiện lỗi nội tuyến real-time "Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn" (E-authentication-002).
__Test Data:__ Email: learner@email.com / Mật khẩu: Learner2024!

---

__STT:__ 85
__Category:__ Bảo mật cơ bản
__Sub-Category:__ Duy trì quyền truy cập tài khoản
__Checklist:__ CHK-authentication-101 — Hoàn tất tạo mật khẩu bắt buộc; kiểm tra thông tin xác thực bằng email tồn tại trước khi xóa nhà cung cấp.
__Ref:__ FR-authentication-024, BR-authentication-004
__Priority:__ 1
__Title:__ Hoàn tất tạo mật khẩu bắt buộc; kiểm tra thông tin xác thực bằng email tồn tại trước khi xóa nhà cung cấp
__Description:__ Kiểm chứng: Hoàn tất tạo mật khẩu bắt buộc; kiểm tra thông tin xác thực bằng email tồn tại trước khi xóa nhà cung cấp.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Tại form buộc tạo mật khẩu, nhập mật khẩu hợp lệ và hoàn tất tạo mật khẩu trước khi gỡ liên kết Google.
__Expected:__ Thông tin xác thực bằng email/mật khẩu được tạo trước khi liên kết Google được gỡ, để tài khoản vẫn có lối đăng nhập (FR-authentication-024, BR-authentication-004).
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024!

---

__STT:__ 86
__Category:__ Bảo mật cơ bản
__Sub-Category:__ Duy trì quyền truy cập tài khoản
__Checklist:__ CHK-authentication-102 — Thử xóa nhà cung cấp trước khi tạo mật khẩu; kiểm tra liên kết Google vẫn được lưu.
__Ref:__ FR-authentication-024, BR-authentication-004
__Priority:__ 1
__Title:__ Thử xóa nhà cung cấp trước khi tạo mật khẩu; kiểm tra liên kết Google vẫn được lưu
__Description:__ Kiểm chứng: Thử xóa nhà cung cấp trước khi tạo mật khẩu; kiểm tra liên kết Google vẫn được lưu.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Trên tài khoản chỉ dùng Google, thực hiện chức năng gỡ liên kết nhưng không tạo mật khẩu ở form bắt buộc.
__Expected:__ Hệ thống buộc tạo mật khẩu trước khi được gỡ liên kết; vì chưa có mật khẩu, liên kết Google vẫn được giữ lại (FR-authentication-024, BR-authentication-004).
__Test Data:__ Tài khoản chỉ dùng Google: learner@email.com

---

__STT:__ 87
__Category:__ Khả năng truy cập cơ bản
__Sub-Category:__ Bàn phím và nhãn
__Checklist:__ CHK-authentication-103 — Điều hướng bảo mật tài khoản bằng Tab; kiểm tra nút hủy liên kết nhận tiêu điểm bàn phím.
__Ref:__ NFR-authentication-009
__Priority:__ 3
__Title:__ Điều hướng bảo mật tài khoản bằng Tab; kiểm tra nút hủy liên kết nhận tiêu điểm bàn phím
__Description:__ Kiểm chứng: Điều hướng bảo mật tài khoản bằng Tab; kiểm tra nút hủy liên kết nhận tiêu điểm bàn phím.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Trên màn hình bảo mật tài khoản có liên kết Google, nhấn Tab để điều hướng đến chức năng gỡ liên kết Google.
__Expected:__ Chức năng gỡ liên kết Google nhận được tiêu điểm khi điều hướng bằng bàn phím, đáp ứng hỗ trợ điều hướng bàn phím cho nút chính của màn xác thực (NFR-authentication-009).
__Test Data:__ —

---

__STT:__ 88
__Category:__ Khả năng truy cập cơ bản
__Sub-Category:__ Bàn phím và nhãn
__Checklist:__ CHK-authentication-104 — Kiểm tra trường bắt buộc đặt mật khẩu bằng trình đọc màn hình; kiểm tra trường cung cấp nhãn lập trình.
__Ref:__ NFR-authentication-009
__Priority:__ 3
__Title:__ Kiểm tra trường bắt buộc đặt mật khẩu bằng trình đọc màn hình; kiểm tra trường cung cấp nhãn lập trình
__Description:__ Kiểm chứng: Kiểm tra trường bắt buộc đặt mật khẩu bằng trình đọc màn hình; kiểm tra trường cung cấp nhãn lập trình.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Mở form buộc tạo mật khẩu và dùng trình đọc màn hình di chuyển tới trường mật khẩu.
__Expected:__ Trình đọc màn hình nhận diện được nhãn lập trình gắn với trường mật khẩu, đáp ứng yêu cầu nhãn cho trình đọc màn hình ở các trường của form xác thực (NFR-authentication-009).
__Test Data:__ —‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
