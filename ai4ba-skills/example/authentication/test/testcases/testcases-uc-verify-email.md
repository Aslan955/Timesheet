__STT:__ 89
__Category:__ Truy cập xác minh
__Sub-Category:__ Liên kết xác nhận
__Checklist:__ CHK-authentication-021 — Mở liên kết xác nhận hợp lệ; kiểm tra trang kết quả xác minh tải thành công.
__Ref:__ FR-authentication-005
__Priority:__ 2
__Title:__ Mở liên kết xác nhận hợp lệ; kiểm tra trang kết quả xác minh tải thành công
__Description:__ Kiểm chứng: Mở liên kết xác nhận hợp lệ; kiểm tra trang kết quả xác minh tải thành công.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Mở liên kết xác nhận chưa dùng, còn hiệu lực 24 giờ trong email xác nhận.
__Expected:__ Trang `verify-result-success` tải và hiển thị "Xác nhận email thành công! Vui lòng đăng nhập.", rồi chuyển về màn đăng nhập (FR-authentication-005).
__Test Data:__ Liên kết xác nhận chưa dùng, được tạo dưới 24 giờ cho learner@email.com

***

__STT:__ 90
__Category:__ Xác nhận email
__Sub-Category:__ Luồng thành công
__Checklist:__ CHK-authentication-022 — Dùng liên kết xác nhận chưa dùng còn hiệu lực; kiểm tra trạng thái tài khoản chuyển thành đã xác minh.
__Ref:__ FR-authentication-005
__Priority:__ 1
__Title:__ Dùng liên kết xác nhận chưa dùng còn hiệu lực; kiểm tra trạng thái tài khoản chuyển thành đã xác minh
__Description:__ Kiểm chứng: Dùng liên kết xác nhận chưa dùng còn hiệu lực; kiểm tra trạng thái tài khoản chuyển thành đã xác minh.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Mở liên kết xác nhận chưa dùng, còn hiệu lực 24 giờ của tài khoản `unverified`.
__Expected:__ Hệ thống chuyển trạng thái tài khoản từ `unverified` sang `verified` sau khi xử lý liên kết (FR-authentication-005).
__Test Data:__ Tài khoản `unverified`: learner@email.com; liên kết xác nhận chưa dùng, được tạo dưới 24 giờ

***

__STT:__ 91
__Category:__ Xác nhận email
__Sub-Category:__ Luồng thành công
__Checklist:__ CHK-authentication-023 — Dùng liên kết xác nhận hợp lệ; kiểm tra mã thông báo được đánh dấu là đã dùng.
__Ref:__ FR-authentication-005
__Priority:__ 1
__Title:__ Dùng liên kết xác nhận hợp lệ; kiểm tra mã thông báo được đánh dấu là đã dùng
__Description:__ Kiểm chứng: Dùng liên kết xác nhận hợp lệ; kiểm tra mã thông báo được đánh dấu là đã dùng.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Mở liên kết xác nhận chưa dùng, còn hiệu lực 24 giờ và kiểm tra lại trạng thái mã thông báo sau khi xác nhận.
__Expected:__ Hệ thống đánh dấu link xác nhận là đã dùng; mã thông báo có trạng thái `used` và không còn có thể xác nhận lại (FR-authentication-005).
__Test Data:__ Liên kết xác nhận chưa dùng, được tạo dưới 24 giờ cho learner@email.com

***

__STT:__ 92
__Category:__ Xác nhận email
__Sub-Category:__ Luồng thành công
__Checklist:__ CHK-authentication-024 — Dùng liên kết xác nhận hợp lệ; kiểm tra thông báo thành công được hiển thị.
__Ref:__ FR-authentication-005
__Priority:__ 2
__Title:__ Dùng liên kết xác nhận hợp lệ; kiểm tra thông báo thành công được hiển thị
__Description:__ Kiểm chứng: Dùng liên kết xác nhận hợp lệ; kiểm tra thông báo thành công được hiển thị.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Mở liên kết xác nhận chưa dùng, còn hiệu lực 24 giờ trong email xác nhận.
__Expected:__ Trang kết quả hiển thị "Xác nhận email thành công! Vui lòng đăng nhập." (FR-authentication-005).
__Test Data:__ Liên kết xác nhận chưa dùng, được tạo dưới 24 giờ cho learner@email.com

***

__STT:__ 93
__Category:__ Xác nhận email
__Sub-Category:__ Luồng thành công
__Checklist:__ CHK-authentication-025 — Dùng liên kết xác nhận hợp lệ; kiểm tra đích đến đăng nhập được cung cấp.
__Ref:__ FR-authentication-005
__Priority:__ 2
__Title:__ Dùng liên kết xác nhận hợp lệ; kiểm tra đích đến đăng nhập được cung cấp
__Description:__ Kiểm chứng: Dùng liên kết xác nhận hợp lệ; kiểm tra đích đến đăng nhập được cung cấp.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Mở liên kết xác nhận chưa dùng, còn hiệu lực 24 giờ và theo luồng chuyển tiếp từ trang kết quả thành công.
__Expected:__ Sau khi hiển thị "Xác nhận email thành công! Vui lòng đăng nhập.", trang kết quả chuyển người dùng về màn đăng nhập (FR-authentication-005).
__Test Data:__ Email: learner@email.com / Mật khẩu: Hoc2024! / Liên kết xác nhận chưa dùng, được tạo dưới 24 giờ

***

__STT:__ 94
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Liên kết không hợp lệ
__Checklist:__ CHK-authentication-026 — Mở liên kết xác nhận sau 24 giờ; kiểm tra kết quả liên kết hết hạn xuất hiện.
__Ref:__ FR-authentication-006, E-authentication-006
__Priority:__ 1
__Title:__ Mở liên kết xác nhận sau 24 giờ; kiểm tra kết quả liên kết hết hạn xuất hiện
__Description:__ Kiểm chứng: Mở liên kết xác nhận sau 24 giờ; kiểm tra kết quả liên kết hết hạn xuất hiện.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Mở liên kết xác nhận đã được tạo quá 24 giờ.
__Expected:__ Trang kết quả hiện "Link đã hết hạn hoặc đã được sử dụng. [Gửi lại link xác nhận]" (E-authentication-006).
__Test Data:__ Liên kết xác nhận đã hết hạn (được tạo quá 24 giờ) cho learner@email.com

***

__STT:__ 95
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Liên kết không hợp lệ
__Checklist:__ CHK-authentication-027 — Mở lại liên kết xác nhận đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện.
__Ref:__ FR-authentication-006, E-authentication-006
__Priority:__ 1
__Title:__ Mở lại liên kết xác nhận đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện
__Description:__ Kiểm chứng: Mở lại liên kết xác nhận đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Mở lại liên kết xác nhận đã được dùng để xác nhận tài khoản.
__Expected:__ Trang kết quả hiện "Link đã hết hạn hoặc đã được sử dụng. [Gửi lại link xác nhận]" (E-authentication-006).
__Test Data:__ Liên kết xác nhận có trạng thái `used` cho learner@email.com

***

__STT:__ 96
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Giới hạn gửi lại
__Checklist:__ CHK-authentication-028 — Mở trạng thái đã gửi xác nhận; kiểm tra nút gửi lại hiển thị.
__Ref:__ FR-authentication-007
__Priority:__ 2
__Title:__ Mở trạng thái đã gửi xác nhận; kiểm tra nút gửi lại hiển thị
__Description:__ Kiểm chứng: Mở trạng thái đã gửi xác nhận; kiểm tra nút gửi lại hiển thị.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Hoàn tất gửi email xác nhận và mở trang trạng thái `verify-sent`.
__Expected:__ Trang `verify-sent` hiển thị "Đã gửi email xác nhận tới {email}…" và có nút gửi lại để yêu cầu link xác nhận mới (FR-authentication-007).
__Test Data:__ Email: learner@email.com

---‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__STT:__ 97
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Giới hạn gửi lại
__Checklist:__ CHK-authentication-029 — Yêu cầu gửi lại được phép; kiểm tra email xác nhận mới được gửi đi.
__Ref:__ FR-authentication-007
__Priority:__ 1
__Title:__ Yêu cầu gửi lại được phép; kiểm tra email xác nhận mới được gửi đi
__Description:__ Kiểm chứng: Yêu cầu gửi lại được phép; kiểm tra email xác nhận mới được gửi đi.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Tại trang trạng thái đã gửi xác nhận, bấm nút gửi lại khi đã qua cooldown và chưa đạt giới hạn ngày.
__Expected:__ Hệ thống gửi lại email xác nhận chứa một link mới tới địa chỉ email đã đăng ký (FR-authentication-007).
__Test Data:__ Email: learner@email.com; lần gửi lại thứ 2 trong ngày, cách lần trước trên 60 giây

***

__STT:__ 98
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Giới hạn gửi lại
__Checklist:__ CHK-authentication-030 — Yêu cầu gửi lại được phép; kiểm tra liên kết mới có thời hạn hiệu lực 24 giờ.
__Ref:__ FR-authentication-007
__Priority:__ 1
__Title:__ Yêu cầu gửi lại được phép; kiểm tra liên kết mới có thời hạn hiệu lực 24 giờ
__Description:__ Kiểm chứng: Yêu cầu gửi lại được phép; kiểm tra liên kết mới có thời hạn hiệu lực 24 giờ.
__Auto:__ No
__Preconditions:__ —

__Step:__ 1
__Action:__ Tại trang trạng thái đã gửi xác nhận, bấm nút gửi lại khi đã qua cooldown và kiểm tra link trong email mới.
__Expected:__ Hệ thống gửi một link xác nhận mới; link này có hạn 24 giờ kể từ thời điểm tạo (FR-authentication-007).
__Test Data:__ Email: learner@email.com; lần gửi lại thứ 2 trong ngày, cách lần trước trên 60 giây

***

__STT:__ 99
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Giới hạn gửi lại
__Checklist:__ CHK-authentication-031 — Yêu cầu gửi lại hai lần trong vòng 60 giây; kiểm tra lỗi thời gian chờ xuất hiện.
__Ref:__ FR-authentication-007, E-authentication-007
__Priority:__ 2
__Title:__ Yêu cầu gửi lại hai lần trong vòng 60 giây; kiểm tra lỗi thời gian chờ xuất hiện
__Description:__ Kiểm chứng: Yêu cầu gửi lại hai lần trong vòng 60 giây; kiểm tra lỗi thời gian chờ xuất hiện.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Tại trang trạng thái đã gửi xác nhận, bấm nút gửi lại hai lần; lần thứ hai thực hiện trong vòng 60 giây sau lần đầu.
__Expected:__ Nút gửi lại tạm vô hiệu và hệ thống hiển thị thông báo còn thời gian chờ (E-authentication-007).
__Test Data:__ Email: learner@email.com; lần gửi lại thứ hai trong vòng 60 giây

***

__STT:__ 100
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Giới hạn gửi lại
__Checklist:__ CHK-authentication-032 — Yêu cầu gửi lại sau năm lần gửi trong một ngày; kiểm tra lỗi giới hạn hằng ngày xuất hiện.
__Ref:__ FR-authentication-007, E-authentication-007
__Priority:__ 2
__Title:__ Yêu cầu gửi lại sau năm lần gửi trong một ngày; kiểm tra lỗi giới hạn hằng ngày xuất hiện
__Description:__ Kiểm chứng: Yêu cầu gửi lại sau năm lần gửi trong một ngày; kiểm tra lỗi giới hạn hằng ngày xuất hiện.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Sau khi đã gửi lại email xác nhận 5 lần trong ngày, bấm nút gửi lại thêm một lần.
__Expected:__ Nút gửi lại tạm vô hiệu và hệ thống hiển thị thông báo đã đạt giới hạn ngày (E-authentication-007).
__Test Data:__ Email: learner@email.com; đã có 5 lần gửi lại email xác nhận trong ngày

***

__STT:__ 101
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Giới hạn gửi lại
__Checklist:__ CHK-authentication-033 — Kích hoạt thời gian chờ gửi lại; kiểm tra gợi ý thời gian chờ còn lại được hiển thị.
__Ref:__ FR-authentication-007, E-authentication-007
__Priority:__ 3
__Title:__ Kích hoạt thời gian chờ gửi lại; kiểm tra gợi ý thời gian chờ còn lại được hiển thị
__Description:__ Kiểm chứng: Kích hoạt thời gian chờ gửi lại; kiểm tra gợi ý thời gian chờ còn lại được hiển thị.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Bấm nút gửi lại, sau đó quan sát trạng thái nút trong thời gian cooldown 60 giây.
__Expected:__ Nút gửi lại tạm vô hiệu và hệ thống hiển thị thông báo còn thời gian chờ (E-authentication-007).
__Test Data:__ Email: learner@email.com; vừa gửi lại email xác nhận

***

__STT:__ 102
__Category:__ Bảo mật cơ bản
__Sub-Category:__ Dùng một lần
__Checklist:__ CHK-authentication-034 — Dùng một mã thông báo xác nhận từ thiết bị thứ hai sau khi đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện.
__Ref:__ FR-authentication-006, E-authentication-006
__Priority:__ 1
__Title:__ Dùng một mã thông báo xác nhận từ thiết bị thứ hai sau khi đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện
__Description:__ Kiểm chứng: Dùng một mã thông báo xác nhận từ thiết bị thứ hai sau khi đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Dùng liên kết xác nhận trên thiết bị A, rồi mở đúng liên kết đó trên thiết bị B.
__Expected:__ Trên thiết bị B, trang kết quả hiện "Link đã hết hạn hoặc đã được sử dụng. [Gửi lại link xác nhận]" (E-authentication-006).
__Test Data:__ Một liên kết xác nhận chưa dùng cho learner@email.com; trình duyệt/thiết bị A và B

***

__STT:__ 103
__Category:__ Khả năng truy cập cơ bản
__Sub-Category:__ Bàn phím
__Checklist:__ CHK-authentication-035 — Điều hướng kết quả xác minh bằng Tab; kiểm tra nút gửi lại nhận tiêu điểm bàn phím.
__Ref:__ NFR-authentication-009
__Priority:__ 3
__Title:__ Điều hướng kết quả xác minh bằng Tab; kiểm tra nút gửi lại nhận tiêu điểm bàn phím
__Description:__ Kiểm chứng: Điều hướng kết quả xác minh bằng Tab; kiểm tra nút gửi lại nhận tiêu điểm bàn phím.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Tại trang kết quả liên kết hết hạn có "[Gửi lại link xác nhận]", nhấn Tab để điều hướng đến nút này.
__Expected:__ SRS chỉ yêu cầu hỗ trợ điều hướng bàn phím cho form đăng nhập/đăng ký, không quy định khả năng nhận tiêu điểm Tab của nút gửi lại trên trang kết quả xác minh. [TBD: cần BA cấp wording]
__Test Data:__ Liên kết xác nhận đã hết hạn

***

__STT:__ 104
__Category:__ Trường hợp biên
__Sub-Category:__ Cổng truy cập
__Checklist:__ CHK-authentication-036 — Thử mở nội dung học tập được bảo vệ trước khi xác minh; kiểm tra quyền truy cập bị từ chối.
__Ref:__ BR-authentication-001
__Priority:__ 1
__Title:__ Thử mở nội dung học tập được bảo vệ trước khi xác minh; kiểm tra quyền truy cập bị từ chối
__Description:__ Kiểm chứng: Thử mở nội dung học tập được bảo vệ trước khi xác minh; kiểm tra quyền truy cập bị từ chối.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Dùng tài khoản `unverified` để truy cập một nội dung học tập được bảo vệ.
__Expected:__ Hệ thống từ chối quyền truy cập nội dung học tập cho đến khi email của tài khoản được xác nhận (BR-authentication-001).
__Test Data:__ Tài khoản `unverified`: learner@email.com; một URL nội dung học tập được bảo vệ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
