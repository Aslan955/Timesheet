__STT:__ 21
__Category:__ Truy cập Google OAuth
__Sub-Category:__ Truy cập
__Checklist:__ CHK-authentication-057 — Kiểm tra nút đăng nhập bằng Google hiển thị trên màn hình đăng nhập.
__Ref:__ FR-authentication-012
__Priority:__ 2
__Title:__ Kiểm tra nút đăng nhập bằng Google hiển thị trên màn hình đăng nhập
__Description:__ Kiểm chứng: Kiểm tra nút đăng nhập bằng Google hiển thị trên màn hình đăng nhập.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Mở màn hình đăng nhập.
__Expected:__ Màn đăng nhập hiển thị nút đăng nhập bằng Google để người dùng chọn luồng đăng nhập/đăng ký Google (FR-authentication-012).
__Test Data:__ —

---

__STT:__ 22
__Category:__ Truy cập Google OAuth
__Sub-Category:__ Truy cập
__Checklist:__ CHK-authentication-058 — Chọn đăng nhập bằng Google; kiểm tra điều hướng đến màn hình chấp thuận của Google.
__Ref:__ FR-authentication-012
__Priority:__ 2
__Title:__ Chọn đăng nhập bằng Google; kiểm tra điều hướng đến màn hình chấp thuận của Google
__Description:__ Kiểm chứng: Chọn đăng nhập bằng Google; kiểm tra điều hướng đến màn hình chấp thuận của Google.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Tại màn hình đăng nhập, chọn nút đăng nhập bằng Google.
__Expected:__ Hệ thống bắt đầu luồng đăng nhập/đăng ký Google để nhận email đã xác thực từ Google (FR-authentication-012). [TBD: cần BA cấp wording cho việc điều hướng tới màn hình chấp thuận của Google]
__Test Data:__ Tài khoản Google đã xác minh: learner@email.com

---

__STT:__ 23
__Category:__ Hoàn tất OAuth
__Sub-Category:__ Tài khoản mới
__Checklist:__ CHK-authentication-059 — Hoàn tất chấp thuận của Google bằng email Google đã xác minh; kiểm tra không yêu cầu trường hồ sơ bổ sung.
__Ref:__ FR-authentication-012
__Priority:__ 2
__Title:__ Hoàn tất chấp thuận của Google bằng email Google đã xác minh; kiểm tra không yêu cầu trường hồ sơ bổ sung
__Description:__ Kiểm chứng: Hoàn tất chấp thuận của Google bằng email Google đã xác minh; kiểm tra không yêu cầu trường hồ sơ bổ sung.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Chọn đăng nhập bằng Google và hoàn tất chấp thuận bằng một tài khoản Google có email đã xác minh.
__Expected:__ Khi Google trả về email đã xác thực, hệ thống xác định người dùng qua email đó theo một luồng chung cho đăng ký và đăng nhập, không yêu cầu thêm trường nào ngoài dữ liệu Google trả về (FR-authentication-012).
__Test Data:__ Tài khoản Google đã xác minh, chưa tồn tại trong hệ thống: new.google@example.com

---

__STT:__ 24
__Category:__ Hoàn tất OAuth
__Sub-Category:__ Tài khoản mới
__Checklist:__ CHK-authentication-060 — Hoàn tất chấp thuận của Google bằng email mới; kiểm tra trạng thái tài khoản được tạo là đã xác minh.
__Ref:__ FR-authentication-013, BR-authentication-009
__Priority:__ 1
__Title:__ Hoàn tất chấp thuận của Google bằng email mới; kiểm tra trạng thái tài khoản được tạo là đã xác minh
__Description:__ Kiểm chứng: Hoàn tất chấp thuận của Google bằng email mới; kiểm tra trạng thái tài khoản được tạo là đã xác minh.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Chọn đăng nhập bằng Google và hoàn tất chấp thuận bằng một email Google đã xác minh chưa tồn tại trong hệ thống.
__Expected:__ Hệ thống tạo tài khoản mới với trạng thái `verified`; tài khoản tạo qua Google được coi là `verified` ngay vì Google đã xác thực email (FR-authentication-013, BR-authentication-009).
__Test Data:__ Tài khoản Google đã xác minh, chưa tồn tại trong hệ thống: new.google@example.com

---

__STT:__ 25
__Category:__ Hoàn tất OAuth
__Sub-Category:__ Tài khoản mới
__Checklist:__ CHK-authentication-061 — Hoàn tất chấp thuận của Google bằng email mới; kiểm tra điều hướng vào ứng dụng.
__Ref:__ FR-authentication-012
__Priority:__ 1
__Title:__ Hoàn tất chấp thuận của Google bằng email mới; kiểm tra điều hướng vào ứng dụng
__Description:__ Kiểm chứng: Hoàn tất chấp thuận của Google bằng email mới; kiểm tra điều hướng vào ứng dụng.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Chọn đăng nhập bằng Google và hoàn tất chấp thuận bằng một email Google đã xác minh chưa tồn tại trong hệ thống.
__Expected:__ Khi Google trả về email đã xác thực, hệ thống hoàn tất luồng nhận diện người dùng qua email đó mà không hỏi thêm field ngoài dữ liệu Google trả về (FR-authentication-012). [TBD: cần BA cấp wording cho màn đích sau khi hoàn tất luồng Google]
__Test Data:__ Tài khoản Google đã xác minh, chưa tồn tại trong hệ thống: new.google@example.com

---

__STT:__ 26
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Callback thất bại
__Checklist:__ CHK-authentication-065 — Hủy chấp thuận của Google; kiểm tra quay lại màn hình đăng nhập.
__Ref:__ FR-authentication-015, E-authentication-008
__Priority:__ 1
__Title:__ Hủy chấp thuận của Google; kiểm tra quay lại màn hình đăng nhập
__Description:__ Kiểm chứng: Hủy chấp thuận của Google; kiểm tra quay lại màn hình đăng nhập.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Chọn đăng nhập bằng Google, sau đó hủy chấp thuận tại Google.
__Expected:__ Hệ thống trở về màn hình đăng nhập và hiển thị "Đăng nhập Google thất bại. Vui lòng thử lại." (E-authentication-008).
__Test Data:__ Tài khoản Google đã xác minh: learner@email.com

---

__STT:__ 27
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Callback thất bại
__Checklist:__ CHK-authentication-066 — Mô phỏng callback Google thất bại; kiểm tra thông báo lỗi Google xuất hiện.
__Ref:__ FR-authentication-015, E-authentication-008
__Priority:__ 1
__Title:__ Mô phỏng callback Google thất bại; kiểm tra thông báo lỗi Google xuất hiện
__Description:__ Kiểm chứng: Mô phỏng callback Google thất bại; kiểm tra thông báo lỗi Google xuất hiện.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Mô phỏng callback Google trả về lỗi sau khi chọn đăng nhập bằng Google.
__Expected:__ Hệ thống trở về màn hình đăng nhập và hiển thị "Đăng nhập Google thất bại. Vui lòng thử lại." (E-authentication-008).
__Test Data:__ Callback Google: lỗi

---‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__STT:__ 28
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Callback thất bại
__Checklist:__ CHK-authentication-067 — Mô phỏng callback Google thất bại; kiểm tra không có tài khoản chưa hoàn chỉnh nào được lưu.
__Ref:__ FR-authentication-015
__Priority:__ 1
__Title:__ Mô phỏng callback Google thất bại; kiểm tra không có tài khoản chưa hoàn chỉnh nào được lưu
__Description:__ Kiểm chứng: Mô phỏng callback Google thất bại; kiểm tra không có tài khoản chưa hoàn chỉnh nào được lưu.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Mô phỏng callback Google thất bại cho một email Google chưa tồn tại trong hệ thống.
__Expected:__ Callback Google thất bại không tạo tài khoản dở dang trong hệ thống (FR-authentication-015).
__Test Data:__ Email Google chưa tồn tại: failed.google@example.com; callback Google: lỗi

---

__STT:__ 29
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Callback thất bại
__Checklist:__ CHK-authentication-068 — Mở trạng thái lỗi Google; kiểm tra có tùy chọn thử lại hiển thị.
__Ref:__ E-authentication-008
__Priority:__ 2
__Title:__ Mở trạng thái lỗi Google; kiểm tra có tùy chọn thử lại hiển thị
__Description:__ Kiểm chứng: Mở trạng thái lỗi Google; kiểm tra có tùy chọn thử lại hiển thị.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Mở trạng thái callback Google thất bại tại luồng đăng nhập bằng Google.
__Expected:__ Hệ thống trở về màn hình đăng nhập và hiển thị "Đăng nhập Google thất bại. Vui lòng thử lại."; người dùng có thể thử lại Google hoặc dùng email/mật khẩu (E-authentication-008).
__Test Data:__ Callback Google: lỗi

---

__STT:__ 30
__Category:__ Bảo mật cơ bản
__Sub-Category:__ Nhật ký kiểm toán
__Checklist:__ CHK-authentication-069 — Tự động liên kết Google với tài khoản hiện có; kiểm tra một sự kiện kiểm toán bất biến được ghi lại mà không chứa mật khẩu.
__Ref:__ NFR-authentication-008
__Priority:__ 2
__Title:__ Tự động liên kết Google với tài khoản hiện có; kiểm tra một sự kiện kiểm toán bất biến được ghi lại mà không chứa mật khẩu
__Description:__ Kiểm chứng: Tự động liên kết Google với tài khoản hiện có; kiểm tra một sự kiện kiểm toán bất biến được ghi lại mà không chứa mật khẩu.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Hoàn tất chấp thuận Google bằng email trùng với một tài khoản hiện có để hệ thống tự liên kết Google.
__Expected:__ Hệ thống ghi một sự kiện tự liên kết Google trong nhật ký không sửa được; nhật ký không chứa mật khẩu (NFR-authentication-008).
__Test Data:__ Tài khoản hiện có và email Google đã xác minh trùng nhau: existing@email.com

---

__STT:__ 31
__Category:__ Khả năng truy cập cơ bản
__Sub-Category:__ Bàn phím
__Checklist:__ CHK-authentication-070 — Điều hướng màn hình đăng nhập bằng Tab; kiểm tra nút đăng nhập bằng Google nhận tiêu điểm bàn phím.
__Ref:__ NFR-authentication-009
__Priority:__ 3
__Title:__ Điều hướng màn hình đăng nhập bằng Tab; kiểm tra nút đăng nhập bằng Google nhận tiêu điểm bàn phím
__Description:__ Kiểm chứng: Điều hướng màn hình đăng nhập bằng Tab; kiểm tra nút đăng nhập bằng Google nhận tiêu điểm bàn phím.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Tại màn hình đăng nhập, nhấn Tab để điều hướng qua các trường và nút chính đến nút đăng nhập bằng Google.
__Expected:__ Form đăng nhập hỗ trợ điều hướng bàn phím; nút đăng nhập bằng Google nhận tiêu điểm bàn phím như một nút chính của màn hình (NFR-authentication-009).
__Test Data:__ —

---

__STT:__ 32
__Category:__ Trường hợp biên
__Sub-Category:__ Email hiện có
__Checklist:__ CHK-authentication-062 — Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra liên kết nhà cung cấp Google được tạo.
__Ref:__ FR-authentication-014, BR-authentication-003
__Priority:__ 1
__Title:__ Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra liên kết nhà cung cấp Google được tạo
__Description:__ Kiểm chứng: Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra liên kết nhà cung cấp Google được tạo.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Hoàn tất chấp thuận Google bằng email trùng với một tài khoản hiện có.
__Expected:__ Hệ thống tự liên kết Google vào tài khoản hiện có, đánh dấu tài khoản `verified` và đăng nhập (FR-authentication-014, BR-authentication-003).
__Test Data:__ Tài khoản hiện có và email Google đã xác minh trùng nhau: existing@email.com

---

__STT:__ 33
__Category:__ Trường hợp biên
__Sub-Category:__ Email hiện có
__Checklist:__ CHK-authentication-063 — Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra không có tài khoản thứ hai được tạo.
__Ref:__ FR-authentication-014, BR-authentication-002
__Priority:__ 1
__Title:__ Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra không có tài khoản thứ hai được tạo
__Description:__ Kiểm chứng: Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra không có tài khoản thứ hai được tạo.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Hoàn tất chấp thuận Google bằng email trùng với một tài khoản hiện có.
__Expected:__ Hệ thống không tạo tài khoản thứ hai: email là định danh duy nhất và một email chỉ có một tài khoản dùng chung cho cả hai phương thức (FR-authentication-014, BR-authentication-002).
__Test Data:__ Tài khoản hiện có và email Google đã xác minh trùng nhau: existing@email.com

---

__STT:__ 34
__Category:__ Trường hợp biên
__Sub-Category:__ Email hiện có
__Checklist:__ CHK-authentication-064 — Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra không yêu cầu mật khẩu cũ.
__Ref:__ FR-authentication-014, BR-authentication-003
__Priority:__ 1
__Title:__ Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra không yêu cầu mật khẩu cũ
__Description:__ Kiểm chứng: Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra không yêu cầu mật khẩu cũ.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Hoàn tất chấp thuận Google bằng email trùng với một tài khoản hiện có.
__Expected:__ Hệ thống tự liên kết Google và đăng nhập vào tài khoản hiện có mà không yêu cầu nhập mật khẩu cũ (FR-authentication-014, BR-authentication-003).
__Test Data:__ Tài khoản hiện có và email Google đã xác minh trùng nhau: existing@email.com‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
