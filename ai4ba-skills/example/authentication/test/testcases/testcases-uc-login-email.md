__STT:__ 35
__Category:__ Truy cập đăng nhập
__Sub-Category:__ Truy cập
__Checklist:__ CHK-authentication-037 — Kiểm tra biểu mẫu đăng nhập bằng email có thể truy cập từ phiên chưa xác thực.
__Ref:__ —
__Priority:__ 2
__Title:__ Kiểm tra biểu mẫu đăng nhập bằng email có thể truy cập từ phiên chưa xác thực
__Description:__ Kiểm chứng: Kiểm tra biểu mẫu đăng nhập bằng email có thể truy cập từ phiên chưa xác thực.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Từ một phiên chưa xác thực, truy cập màn đăng nhập.
__Expected:__ Màn login hiển thị form email/mật khẩu cho phiên chưa xác thực.
__Test Data:__ —

---

__STT:__ 36
__Category:__ Gửi thông tin xác thực
__Sub-Category:__ Luồng thành công
__Checklist:__ CHK-authentication-038 — Gửi thông tin xác thực hợp lệ cho tài khoản đã xác minh và không bị khóa; kiểm tra điều hướng vào ứng dụng.
__Ref:__ FR-authentication-008
__Priority:__ 1
__Title:__ Gửi thông tin xác thực hợp lệ cho tài khoản đã xác minh và không bị khóa; kiểm tra điều hướng vào ứng dụng
__Description:__ Kiểm chứng: Gửi thông tin xác thực hợp lệ cho tài khoản đã xác minh và không bị khóa; kiểm tra điều hướng vào ứng dụng.
__Auto:__ Yes
__Preconditions:__ Tài khoản đã có 5 lần đăng nhập sai liên tiếp (dựng: submit sai mật khẩu 5 lần; nguồn: FR-authentication-026)

__Step:__ 1
__Action:__ Nhập email và mật khẩu đúng của tài khoản đã verified, không bị khóa, rồi gửi form đăng nhập.
__Expected:__ Hệ thống tạo phiên đăng nhập và cho người dùng vào app (FR-authentication-008).
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024!

---

__STT:__ 37
__Category:__ Gửi thông tin xác thực
__Sub-Category:__ Luồng thành công
__Checklist:__ CHK-authentication-039 — Đăng nhập thành công sau các lần thất bại trước đó; kiểm tra bộ đếm lần thử thất bại được đặt lại.
__Ref:__ FR-authentication-008
__Priority:__ 1
__Title:__ Đăng nhập thành công sau các lần thất bại trước đó; kiểm tra bộ đếm lần thử thất bại được đặt lại
__Description:__ Kiểm chứng: Đăng nhập thành công sau các lần thất bại trước đó; kiểm tra bộ đếm lần thử thất bại được đặt lại.
__Auto:__ No
__Preconditions:__ Đã nhận link đặt lại mật khẩu còn hạn (dựng: gửi yêu cầu quên mật khẩu; nguồn: FR-authentication-017)

__Step:__ 1
__Action:__ Nhập email và mật khẩu đúng của tài khoản đã verified, không bị khóa, rồi gửi form đăng nhập sau các lần đăng nhập sai trước đó.
__Expected:__ Hệ thống tạo phiên đăng nhập và cho người dùng vào app (FR-authentication-008). SRS chưa đặc tả điều kiện đặt lại bộ đếm lần đăng nhập sai sau khi đăng nhập thành công [TBD: cần BA cấp wording]
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024!

---

__STT:__ 38
__Category:__ Gửi thông tin xác thực
__Sub-Category:__ Luồng thành công
__Checklist:__ CHK-authentication-040 — Mở biểu mẫu đăng nhập; kiểm tra tùy chọn nhớ đăng nhập mặc định tắt.
__Ref:__ FR-authentication-011
__Priority:__ 2
__Title:__ Mở biểu mẫu đăng nhập; kiểm tra tùy chọn nhớ đăng nhập mặc định tắt
__Description:__ Kiểm chứng: Mở biểu mẫu đăng nhập; kiểm tra tùy chọn nhớ đăng nhập mặc định tắt.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Mở màn đăng nhập và quan sát tùy chọn remember-me.
__Expected:__ Tùy chọn remember-me ở trạng thái tắt mặc định (FR-authentication-011).
__Test Data:__ —

---

__STT:__ 39
__Category:__ Gửi thông tin xác thực
__Sub-Category:__ Luồng thành công
__Checklist:__ CHK-authentication-041 — Đăng nhập khi bật tùy chọn nhớ đăng nhập; kiểm tra phiên thiết bị vẫn hợp lệ trong 30 ngày.
__Ref:__ FR-authentication-011, NFR-authentication-006
__Priority:__ 1
__Title:__ Đăng nhập khi bật tùy chọn nhớ đăng nhập; kiểm tra phiên thiết bị vẫn hợp lệ trong 30 ngày
__Description:__ Kiểm chứng: Đăng nhập khi bật tùy chọn nhớ đăng nhập; kiểm tra phiên thiết bị vẫn hợp lệ trong 30 ngày.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Bật tùy chọn remember-me, nhập email và mật khẩu đúng, rồi gửi form đăng nhập; kiểm tra lại phiên trên cùng thiết bị trong thời hạn 30 ngày.
__Expected:__ Hệ thống giữ phiên đăng nhập trên thiết bị đó trong 30 ngày (FR-authentication-011, NFR-authentication-006).
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024!

---

__STT:__ 40
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Thông tin xác thực không hợp lệ
__Checklist:__ CHK-authentication-042 — Gửi mật khẩu sai cho email hiện có; kiểm tra thông báo chung về thông tin xác thực không hợp lệ xuất hiện.
__Ref:__ FR-authentication-010, E-authentication-003
__Priority:__ 1
__Title:__ Gửi mật khẩu sai cho email hiện có; kiểm tra thông báo chung về thông tin xác thực không hợp lệ xuất hiện
__Description:__ Kiểm chứng: Gửi mật khẩu sai cho email hiện có; kiểm tra thông báo chung về thông tin xác thực không hợp lệ xuất hiện.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Nhập email của tài khoản hiện có cùng mật khẩu sai rồi gửi form đăng nhập.
__Expected:__ Form đăng nhập hiện "Email hoặc mật khẩu không đúng" và tăng bộ đếm sai +1 (E-authentication-003).
__Test Data:__ Email: learner@email.com / Mật khẩu: Sai123!

---

__STT:__ 41
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Thông tin xác thực không hợp lệ
__Checklist:__ CHK-authentication-043 — Gửi email không tồn tại; kiểm tra cùng thông báo chung về thông tin xác thực không hợp lệ xuất hiện.
__Ref:__ FR-authentication-010, NFR-authentication-007
__Priority:__ 1
__Title:__ Gửi email không tồn tại; kiểm tra cùng thông báo chung về thông tin xác thực không hợp lệ xuất hiện
__Description:__ Kiểm chứng: Gửi email không tồn tại; kiểm tra cùng thông báo chung về thông tin xác thực không hợp lệ xuất hiện.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Nhập email không tồn tại cùng một mật khẩu rồi gửi form đăng nhập.
__Expected:__ Form đăng nhập hiện cùng thông báo chung "Email hoặc mật khẩu không đúng", không tiết lộ email nào tồn tại (FR-authentication-010, NFR-authentication-007).
__Test Data:__ Email: unknown@email.com / Mật khẩu: Hoc2024!

---

__STT:__ 42
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Thông tin xác thực không hợp lệ
__Checklist:__ CHK-authentication-044 — Gửi thông tin xác thực không hợp lệ; kiểm tra bộ đếm lần thử thất bại tăng thêm một.
__Ref:__ FR-authentication-010
__Priority:__ 1
__Title:__ Gửi thông tin xác thực không hợp lệ; kiểm tra bộ đếm lần thử thất bại tăng thêm một
__Description:__ Kiểm chứng: Gửi thông tin xác thực không hợp lệ; kiểm tra bộ đếm lần thử thất bại tăng thêm một.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Nhập email của tài khoản hiện có cùng mật khẩu sai rồi gửi form đăng nhập.
__Expected:__ Form đăng nhập hiện "Email hoặc mật khẩu không đúng" và bộ đếm lần đăng nhập sai tăng +1 (FR-authentication-010).
__Test Data:__ Email: learner@email.com / Mật khẩu: Sai123!

---

__STT:__ 43
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Chưa xác minh và lỗi mạng
__Checklist:__ CHK-authentication-050 — Gửi thông tin xác thực đúng cho tài khoản chưa xác minh; kiểm tra quyền truy cập ứng dụng bị chặn.
__Ref:__ FR-authentication-009, E-authentication-004
__Priority:__ 1
__Title:__ Gửi thông tin xác thực đúng cho tài khoản chưa xác minh; kiểm tra quyền truy cập ứng dụng bị chặn
__Description:__ Kiểm chứng: Gửi thông tin xác thực đúng cho tài khoản chưa xác minh; kiểm tra quyền truy cập ứng dụng bị chặn.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Nhập email và mật khẩu đúng của tài khoản ở trạng thái unverified rồi gửi form đăng nhập.
__Expected:__ Form hiện "Tài khoản chưa được xác nhận. [Gửi lại email xác nhận]" và chặn người dùng vào app (E-authentication-004).
__Test Data:__ Email: unverified@email.com / Mật khẩu: Hoc2024!

---

__STT:__ 44
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Chưa xác minh và lỗi mạng
__Checklist:__ CHK-authentication-051 — Gửi thông tin xác thực đúng cho tài khoản chưa xác minh; kiểm tra nút gửi lại xác nhận xuất hiện.
__Ref:__ FR-authentication-009, E-authentication-004
__Priority:__ 2
__Title:__ Gửi thông tin xác thực đúng cho tài khoản chưa xác minh; kiểm tra nút gửi lại xác nhận xuất hiện
__Description:__ Kiểm chứng: Gửi thông tin xác thực đúng cho tài khoản chưa xác minh; kiểm tra nút gửi lại xác nhận xuất hiện.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Nhập email và mật khẩu đúng của tài khoản ở trạng thái unverified rồi gửi form đăng nhập.
__Expected:__ Form hiện "Tài khoản chưa được xác nhận. [Gửi lại email xác nhận]", gồm tùy chọn gửi lại email xác nhận (E-authentication-004).
__Test Data:__ Email: unverified@email.com / Mật khẩu: Hoc2024!

---‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__STT:__ 45
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Chưa xác minh và lỗi mạng
__Checklist:__ CHK-authentication-052 — Mô phỏng lỗi mạng khi đăng nhập; kiểm tra bộ đếm lần thử thất bại không thay đổi.
__Ref:__ FR-authentication-027, BR-authentication-011
__Priority:__ 1
__Title:__ Mô phỏng lỗi mạng khi đăng nhập; kiểm tra bộ đếm lần thử thất bại không thay đổi
__Description:__ Kiểm chứng: Mô phỏng lỗi mạng khi đăng nhập; kiểm tra bộ đếm lần thử thất bại không thay đổi.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Mô phỏng lỗi mạng khi gửi form đăng nhập bằng email và mật khẩu.
__Expected:__ Lần đăng nhập thất bại do lỗi mạng không làm tăng bộ đếm lần đăng nhập sai (FR-authentication-027, BR-authentication-011).
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024!

---

__STT:__ 46
__Category:__ Bảo mật cơ bản
__Sub-Category:__ Captcha và khóa tài khoản
__Checklist:__ CHK-authentication-045 — Tạo ba lần thử không hợp lệ liên tiếp; kiểm tra captcha hiển thị ở lần thử tiếp theo.
__Ref:__ FR-authentication-025, BR-authentication-006
__Priority:__ 1
__Title:__ Tạo ba lần thử không hợp lệ liên tiếp; kiểm tra captcha hiển thị ở lần thử tiếp theo
__Description:__ Kiểm chứng: Tạo ba lần thử không hợp lệ liên tiếp; kiểm tra captcha hiển thị ở lần thử tiếp theo.
__Auto:__ Yes
__Preconditions:__ Tài khoản đã có 3 lần đăng nhập sai liên tiếp (dựng: submit sai mật khẩu 3 lần; nguồn: FR-authentication-025)

__Step:__ 1
__Action:__ Sau 3 lần đăng nhập sai liên tiếp, thực hiện lần thử đăng nhập tiếp theo.
__Expected:__ Hệ thống yêu cầu captcha ở lần thử đăng nhập tiếp theo (FR-authentication-025, BR-authentication-006).
__Test Data:__ Email: learner@email.com / Mật khẩu: Sai123!

---

__STT:__ 47
__Category:__ Bảo mật cơ bản
__Sub-Category:__ Captcha và khóa tài khoản
__Checklist:__ CHK-authentication-046 — Gửi lần thử tiếp theo mà không hoàn tất captcha; kiểm tra đăng nhập bị chặn.
__Ref:__ FR-authentication-025
__Priority:__ 1
__Title:__ Gửi lần thử tiếp theo mà không hoàn tất captcha; kiểm tra đăng nhập bị chặn
__Description:__ Kiểm chứng: Gửi lần thử tiếp theo mà không hoàn tất captcha; kiểm tra đăng nhập bị chặn.
__Auto:__ Yes
__Preconditions:__ Tài khoản đã có 3 lần đăng nhập sai liên tiếp (dựng: submit sai mật khẩu 3 lần; nguồn: FR-authentication-025)

__Step:__ 1
__Action:__ Nhập email và mật khẩu đúng, để captcha chưa hoàn tất, rồi gửi form đăng nhập.
__Expected:__ Hệ thống yêu cầu captcha ở các lần thử sau 3 lần đăng nhập sai liên tiếp; khi captcha chưa được hoàn tất, đăng nhập không được thực hiện (FR-authentication-025).
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024!

---

__STT:__ 48
__Category:__ Bảo mật cơ bản
__Sub-Category:__ Captcha và khóa tài khoản
__Checklist:__ CHK-authentication-047 — Tạo năm lần thử không hợp lệ liên tiếp; kiểm tra việc khóa tài khoản được ghi nhận trong 24 giờ.
__Ref:__ FR-authentication-026, BR-authentication-005
__Priority:__ 1
__Title:__ Tạo năm lần thử không hợp lệ liên tiếp; kiểm tra việc khóa tài khoản được ghi nhận trong 24 giờ
__Description:__ Kiểm chứng: Tạo năm lần thử không hợp lệ liên tiếp; kiểm tra việc khóa tài khoản được ghi nhận trong 24 giờ.
__Auto:__ No
__Preconditions:__ Tài khoản đã có 5 lần đăng nhập sai liên tiếp (dựng: submit sai mật khẩu 5 lần; nguồn: FR-authentication-026)

__Step:__ 1
__Action:__ Gửi 5 lần đăng nhập liên tiếp bằng email của cùng tài khoản và mật khẩu sai.
__Expected:__ Sau 5 lần đăng nhập sai liên tiếp, hệ thống khóa tài khoản trong 24 giờ và tự mở khóa sau đó (FR-authentication-026, BR-authentication-005).
__Test Data:__ Email: learner@email.com / Mật khẩu: Sai123!

---

__STT:__ 49
__Category:__ Bảo mật cơ bản
__Sub-Category:__ Captcha và khóa tài khoản
__Checklist:__ CHK-authentication-048 — Gửi thông tin xác thực cho tài khoản bị khóa; kiểm tra thông báo khóa tạm thời xuất hiện.
__Ref:__ FR-authentication-026, E-authentication-005
__Priority:__ 1
__Title:__ Gửi thông tin xác thực cho tài khoản bị khóa; kiểm tra thông báo khóa tạm thời xuất hiện
__Description:__ Kiểm chứng: Gửi thông tin xác thực cho tài khoản bị khóa; kiểm tra thông báo khóa tạm thời xuất hiện.
__Auto:__ Yes
__Preconditions:__ Tài khoản đã có 5 lần đăng nhập sai liên tiếp (dựng: submit sai mật khẩu 5 lần; nguồn: FR-authentication-026)

__Step:__ 1
__Action:__ Nhập email và mật khẩu đúng của tài khoản đang bị khóa rồi gửi form đăng nhập.
__Expected:__ Form hiện "Tài khoản tạm khóa do nhiều lần đăng nhập sai. Vui lòng thử lại sau {X} giờ." (E-authentication-005).
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024!

---

__STT:__ 50
__Category:__ Bảo mật cơ bản
__Sub-Category:__ Captcha và khóa tài khoản
__Checklist:__ CHK-authentication-049 — Chuyển tài khoản bị khóa vượt quá 24 giờ; kiểm tra tài khoản đủ điều kiện đăng nhập trở lại.
__Ref:__ FR-authentication-026
__Priority:__ 2
__Title:__ Chuyển tài khoản bị khóa vượt quá 24 giờ; kiểm tra tài khoản đủ điều kiện đăng nhập trở lại
__Description:__ Kiểm chứng: Chuyển tài khoản bị khóa vượt quá 24 giờ; kiểm tra tài khoản đủ điều kiện đăng nhập trở lại.
__Auto:__ No
__Preconditions:__ Tài khoản đã có 5 lần đăng nhập sai liên tiếp (dựng: submit sai mật khẩu 5 lần; nguồn: FR-authentication-026)

__Step:__ 1
__Action:__ Chuyển thời điểm kiểm thử đến sau 24 giờ kể từ khi tài khoản bị khóa, rồi gửi form đăng nhập với email và mật khẩu đúng.
__Expected:__ Hệ thống tự mở khóa tài khoản sau 24 giờ và cho phép đăng nhập trở lại khi thông tin xác thực khớp (FR-authentication-026).
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024!

---

__STT:__ 51
__Category:__ Khả năng truy cập cơ bản
__Sub-Category:__ Bàn phím và nhãn
__Checklist:__ CHK-authentication-056 — Điều hướng biểu mẫu đăng nhập bằng Tab; kiểm tra trường email nhận tiêu điểm bàn phím.
__Ref:__ NFR-authentication-009
__Priority:__ 3
__Title:__ Điều hướng biểu mẫu đăng nhập bằng Tab; kiểm tra trường email nhận tiêu điểm bàn phím
__Description:__ Kiểm chứng: Điều hướng biểu mẫu đăng nhập bằng Tab; kiểm tra trường email nhận tiêu điểm bàn phím.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Mở màn đăng nhập và nhấn phím Tab để điều hướng qua các thành phần của form.
__Expected:__ Form đăng nhập hỗ trợ điều hướng bàn phím; trường email nhận tiêu điểm bàn phím (NFR-authentication-009).
__Test Data:__ —

---

__STT:__ 52
__Category:__ Trường hợp biên
__Sub-Category:__ Phiên đồng thời
__Checklist:__ CHK-authentication-053 — Đăng nhập cùng tài khoản trên thiết bị thứ hai; kiểm tra phiên trên thiết bị đầu tiên vẫn hoạt động.
__Ref:__ FR-authentication-021
__Priority:__ 1
__Title:__ Đăng nhập cùng tài khoản trên thiết bị thứ hai; kiểm tra phiên trên thiết bị đầu tiên vẫn hoạt động
__Description:__ Kiểm chứng: Đăng nhập cùng tài khoản trên thiết bị thứ hai; kiểm tra phiên trên thiết bị đầu tiên vẫn hoạt động.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Đăng nhập cùng một tài khoản trên thiết bị thứ hai, rồi tiếp tục sử dụng phiên đang đăng nhập trên thiết bị thứ nhất.
__Expected:__ Hệ thống cho phép cùng tài khoản đăng nhập đồng thời trên nhiều thiết bị; phiên trên thiết bị thứ nhất vẫn hoạt động (FR-authentication-021).
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024!

---

__STT:__ 53
__Category:__ Trường hợp biên
__Sub-Category:__ Phiên đồng thời
__Checklist:__ CHK-authentication-054 — Chọn đăng xuất trên thiết bị hiện tại; kiểm tra thiết bị đó trở về trạng thái chưa xác thực.
__Ref:__ FR-authentication-022
__Priority:__ 1
__Title:__ Chọn đăng xuất trên thiết bị hiện tại; kiểm tra thiết bị đó trở về trạng thái chưa xác thực
__Description:__ Kiểm chứng: Chọn đăng xuất trên thiết bị hiện tại; kiểm tra thiết bị đó trở về trạng thái chưa xác thực.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Trên thiết bị đang đăng nhập, chọn đăng xuất.
__Expected:__ Hệ thống thu hồi phiên của thiết bị hiện tại; thiết bị trở về trạng thái chưa xác thực và không hiện hộp thoại xác nhận (FR-authentication-022).
__Test Data:__ —

---

__STT:__ 54
__Category:__ Trường hợp biên
__Sub-Category:__ Phiên đồng thời
__Checklist:__ CHK-authentication-055 — Chọn đăng xuất trên một thiết bị; kiểm tra phiên đang hoạt động trên thiết bị khác vẫn sử dụng được.
__Ref:__ FR-authentication-022
__Priority:__ 1
__Title:__ Chọn đăng xuất trên một thiết bị; kiểm tra phiên đang hoạt động trên thiết bị khác vẫn sử dụng được
__Description:__ Kiểm chứng: Chọn đăng xuất trên một thiết bị; kiểm tra phiên đang hoạt động trên thiết bị khác vẫn sử dụng được.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Trên thiết bị thứ nhất đang đăng nhập, chọn đăng xuất; sau đó tiếp tục sử dụng phiên đang hoạt động trên thiết bị thứ hai.
__Expected:__ Hệ thống chỉ thu hồi phiên của thiết bị thứ nhất; phiên đang hoạt động trên thiết bị thứ hai không bị ảnh hưởng và vẫn sử dụng được (FR-authentication-022).
__Test Data:__ —‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
