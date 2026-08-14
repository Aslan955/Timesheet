__STT:__ 01
__Category:__ Yêu cầu đặt lại mật khẩu
__Sub-Category:__ Truy cập
__Checklist:__ CHK-authentication-071 — Kiểm tra biểu mẫu quên mật khẩu có thể truy cập từ luồng đăng nhập.
__Ref:__ FR-authentication-016
__Priority:__ 2
__Title:__ Kiểm tra biểu mẫu quên mật khẩu có thể truy cập từ luồng đăng nhập
__Description:__ Kiểm chứng: Kiểm tra biểu mẫu quên mật khẩu có thể truy cập từ luồng đăng nhập.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Ở màn đăng nhập, bấm liên kết "Quên mật khẩu?".
__Expected:__ Chuyển sang màn "Quên mật khẩu" có trường nhập email và nút gửi yêu cầu đặt lại; người dùng đến được form mà không cần đăng nhập trước.
__Test Data:__ —

***

__STT:__ 02
__Category:__ Yêu cầu đặt lại mật khẩu
__Sub-Category:__ Truy cập
__Checklist:__ CHK-authentication-072 — Gửi email của tài khoản tồn tại; kiểm tra thông báo yêu cầu đặt lại trung lập xuất hiện.
__Ref:__ FR-authentication-016, BR-authentication-008
__Priority:__ 1
__Title:__ Gửi email của tài khoản tồn tại; kiểm tra thông báo yêu cầu đặt lại trung lập xuất hiện
__Description:__ Kiểm chứng: Gửi email của tài khoản tồn tại; kiểm tra thông báo yêu cầu đặt lại trung lập xuất hiện.
__Auto:__ Yes
__Preconditions:__ Tài khoản đã tồn tại và verified (dựng: đăng ký + xác nhận email; nguồn: FR-authentication-001)

__Step:__ 1
__Action:__ Nhập email của một tài khoản đã tồn tại rồi bấm gửi yêu cầu đặt lại.
__Expected:__ Màn hiển thị thông báo trung tính "Nếu email tồn tại trong hệ thống, đã gửi link đặt lại" (FR-authentication-016). KHÔNG hiển thị chỉ báo nào cho biết email này có tồn tại.
__Test Data:__ Email: hocvien@email.com

***

__STT:__ 03
__Category:__ Yêu cầu đặt lại mật khẩu
__Sub-Category:__ Truy cập
__Checklist:__ CHK-authentication-073 — Gửi email không tồn tại; kiểm tra cùng thông báo yêu cầu đặt lại trung lập xuất hiện.
__Ref:__ FR-authentication-016, NFR-authentication-007
__Priority:__ 1
__Title:__ Gửi email không tồn tại; kiểm tra cùng thông báo yêu cầu đặt lại trung lập xuất hiện
__Description:__ Kiểm chứng: Gửi email không tồn tại; kiểm tra cùng thông báo yêu cầu đặt lại trung lập xuất hiện.
__Auto:__ Yes
__Preconditions:__ —

__Step:__ 1
__Action:__ Nhập một email KHÔNG tồn tại trong hệ thống rồi bấm gửi yêu cầu đặt lại.
__Expected:__ Màn hiển thị ĐÚNG CÙNG thông báo trung tính "Nếu email tồn tại trong hệ thống, đã gửi link đặt lại" như trường hợp email tồn tại (TC02) — không tiết lộ email nào tồn tại (NFR-authentication-007, chống dò tài khoản). KHÔNG hiện lỗi kiểu "email không tồn tại".
__Test Data:__ Email: unknown@email.com

***

__STT:__ 04
__Category:__ Yêu cầu đặt lại mật khẩu
__Sub-Category:__ Truy cập
__Checklist:__ CHK-authentication-074 — Gửi email của tài khoản tồn tại; kiểm tra email đặt lại được gửi đi.
__Ref:__ FR-authentication-017
__Priority:__ 1
__Title:__ Gửi email của tài khoản tồn tại; kiểm tra email đặt lại được gửi đi
__Description:__ Kiểm chứng: Gửi email của tài khoản tồn tại; kiểm tra email đặt lại được gửi đi.
__Auto:__ No
__Preconditions:__ Tài khoản đã tồn tại và verified (dựng: đăng ký + xác nhận email; nguồn: FR-authentication-001)

__Step:__ 1
__Action:__ Nhập email của tài khoản tồn tại rồi bấm gửi yêu cầu đặt lại; kiểm tra hộp thư của email đó.
__Expected:__ Hệ thống gửi đúng một email đặt lại tới hòm thư của tài khoản, nội dung chứa link đặt lại mật khẩu (FR-authentication-017).
__Test Data:__ Email: hocvien@email.com

***

__STT:__ 05
__Category:__ Yêu cầu đặt lại mật khẩu
__Sub-Category:__ Truy cập
__Checklist:__ CHK-authentication-075 — Gửi email của tài khoản tồn tại; kiểm tra liên kết đặt lại hết hạn sau 30 phút.
__Ref:__ FR-authentication-017
__Priority:__ 1
__Title:__ Gửi email của tài khoản tồn tại; kiểm tra liên kết đặt lại hết hạn sau 30 phút
__Description:__ Kiểm chứng: Gửi email của tài khoản tồn tại; kiểm tra liên kết đặt lại hết hạn sau 30 phút.
__Auto:__ No
__Preconditions:__ Đã nhận link đặt lại mật khẩu còn hạn (dựng: gửi yêu cầu quên mật khẩu; nguồn: FR-authentication-017)

__Step:__ 1
__Action:__ Sau khi nhận link đặt lại, chờ quá 30 phút rồi mở link.
__Expected:__ Link không còn hiệu lực sau đúng 30 phút kể từ lúc phát hành (FR-authentication-017); mở sau mốc đó dẫn tới trang kết quả link hết hạn (xem TC15).
__Test Data:__ Thời gian chờ: > 30 phút

***

__STT:__ 06
__Category:__ Đặt mật khẩu mới
__Sub-Category:__ Đặt lại hợp lệ
__Checklist:__ CHK-authentication-076 — Mở liên kết đặt lại chưa dùng còn hiệu lực; kiểm tra biểu mẫu mật khẩu mới tải thành công.
__Ref:__ FR-authentication-018
__Priority:__ 2
__Title:__ Mở liên kết đặt lại chưa dùng còn hiệu lực; kiểm tra biểu mẫu mật khẩu mới tải thành công
__Description:__ Kiểm chứng: Mở liên kết đặt lại chưa dùng còn hiệu lực; kiểm tra biểu mẫu mật khẩu mới tải thành công.
__Auto:__ Yes
__Preconditions:__ Đã nhận link đặt lại mật khẩu còn hạn, chưa dùng (dựng: gửi yêu cầu quên mật khẩu; nguồn: FR-authentication-017)

__Step:__ 1
__Action:__ Mở link đặt lại còn hạn và chưa dùng.
__Expected:__ Màn đặt mật khẩu mới tải thành công, hiển thị 2 trường nhập mật khẩu mới và xác nhận mật khẩu (FR-authentication-018).
__Test Data:__ —

***

__STT:__ 07
__Category:__ Đặt mật khẩu mới
__Sub-Category:__ Đặt lại hợp lệ
__Checklist:__ CHK-authentication-077 — Nhập các mật khẩu hợp lệ trùng khớp; kiểm tra thao tác gửi được chấp nhận.
__Ref:__ FR-authentication-018
__Priority:__ 2
__Title:__ Nhập các mật khẩu hợp lệ trùng khớp; kiểm tra thao tác gửi được chấp nhận
__Description:__ Kiểm chứng: Nhập các mật khẩu hợp lệ trùng khớp; kiểm tra thao tác gửi được chấp nhận.
__Auto:__ Yes
__Preconditions:__ Đang ở màn đặt mật khẩu mới từ link còn hạn (dựng: mở link đặt lại còn hạn; nguồn: FR-authentication-018)

__Step:__ 1
__Action:__ Nhập mật khẩu mới đạt chính sách ở cả 2 trường (giống nhau) rồi bấm gửi.
__Expected:__ Hệ thống chấp nhận thao tác gửi (không hiện lỗi validation), tiến hành cập nhật mật khẩu (FR-authentication-018).
__Test Data:__ Mật khẩu: Hoc2024!

***

__STT:__ 08
__Category:__ Đặt mật khẩu mới
__Sub-Category:__ Đặt lại hợp lệ
__Checklist:__ CHK-authentication-078 — Nhập nội dung xác nhận khác; kiểm tra việc đặt lại mật khẩu bị từ chối.
__Ref:__ FR-authentication-018
__Priority:__ 1
__Title:__ Nhập nội dung xác nhận khác; kiểm tra việc đặt lại mật khẩu bị từ chối
__Description:__ Kiểm chứng: Nhập nội dung xác nhận khác; kiểm tra việc đặt lại mật khẩu bị từ chối.
__Auto:__ Yes
__Preconditions:__ Đang ở màn đặt mật khẩu mới từ link còn hạn (dựng: mở link đặt lại còn hạn; nguồn: FR-authentication-018)

__Step:__ 1
__Action:__ Nhập mật khẩu mới và ô xác nhận KHÁC nhau rồi bấm gửi.
__Expected:__ Hệ thống từ chối đặt lại vì 2 trường không khớp; mật khẩu KHÔNG được cập nhật; người dùng vẫn ở màn đặt mật khẩu để sửa (FR-authentication-018 yêu cầu nhập 2 lần khớp).
__Test Data:__ Mật khẩu: Hoc2024! / Xác nhận: Hoc2025!

***

__STT:__ 09
__Category:__ Đặt mật khẩu mới
__Sub-Category:__ Đặt lại hợp lệ
__Checklist:__ CHK-authentication-079 — Nhập mật khẩu mới không hợp lệ; kiểm tra lỗi chính sách nội tuyến xuất hiện.
__Ref:__ FR-authentication-003, E-authentication-002
__Priority:__ 1
__Title:__ Nhập mật khẩu mới không hợp lệ; kiểm tra lỗi chính sách nội tuyến xuất hiện
__Description:__ Kiểm chứng: Nhập mật khẩu mới không hợp lệ; kiểm tra lỗi chính sách nội tuyến xuất hiện.
__Auto:__ Yes
__Preconditions:__ Đang ở màn đặt mật khẩu mới từ link còn hạn (dựng: mở link đặt lại còn hạn; nguồn: FR-authentication-018)

__Step:__ 1
__Action:__ Nhập mật khẩu mới KHÔNG đạt chính sách (vd quá ngắn / thiếu loại ký tự) rồi rời trường.
__Expected:__ Form hiện lỗi nội tuyến real-time "Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn" (E-authentication-002); nút gửi không cho hoàn tất đặt lại.
__Test Data:__ Mật khẩu: 123

***

__STT:__ 10
__Category:__ Đặt mật khẩu mới
__Sub-Category:__ Đặt lại hợp lệ
__Checklist:__ CHK-authentication-080 — Gửi các mật khẩu hợp lệ trùng khớp từ liên kết hợp lệ; kiểm tra thông tin xác thực của tài khoản được cập nhật.
__Ref:__ FR-authentication-018
__Priority:__ 1
__Title:__ Gửi các mật khẩu hợp lệ trùng khớp từ liên kết hợp lệ; kiểm tra thông tin xác thực của tài khoản được cập nhật
__Description:__ Kiểm chứng: Gửi các mật khẩu hợp lệ trùng khớp từ liên kết hợp lệ; kiểm tra thông tin xác thực của tài khoản được cập nhật.
__Auto:__ No
__Preconditions:__ Đang ở màn đặt mật khẩu mới từ link còn hạn (dựng: mở link đặt lại còn hạn; nguồn: FR-authentication-018)

__Step:__ 1
__Action:__ Từ link hợp lệ, nhập mật khẩu mới đạt chính sách (2 lần khớp) rồi gửi; sau đó thử đăng nhập bằng mật khẩu mới.
__Expected:__ Mật khẩu tài khoản được cập nhật thành mật khẩu mới — đăng nhập bằng mật khẩu mới thành công, mật khẩu cũ không còn dùng được (FR-authentication-018).
__Test Data:__ Mật khẩu mới: Hoc2024!

---‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__STT:__ 11
__Category:__ Đặt mật khẩu mới
__Sub-Category:__ Đặt lại hợp lệ
__Checklist:__ CHK-authentication-081 — Hoàn tất đặt lại mật khẩu; kiểm tra mã thông báo đặt lại được đánh dấu là đã dùng.
__Ref:__ FR-authentication-018
__Priority:__ 1
__Title:__ Hoàn tất đặt lại mật khẩu; kiểm tra mã thông báo đặt lại được đánh dấu là đã dùng
__Description:__ Kiểm chứng: Hoàn tất đặt lại mật khẩu; kiểm tra mã thông báo đặt lại được đánh dấu là đã dùng.
__Auto:__ No
__Preconditions:__ Đã đặt lại mật khẩu thành công từ một link (dựng: mở link còn hạn + đặt mật khẩu mới; nguồn: FR-authentication-018)

__Step:__ 1
__Action:__ Sau khi đặt lại thành công, mở LẠI đúng link đặt lại đó lần nữa.
__Expected:__ Link đã được đánh dấu là đã dùng — mở lại bị từ chối, dẫn tới trang kết quả link hết hạn/đã dùng (E-authentication-009), KHÔNG cho đặt lại mật khẩu lần nữa (FR-authentication-018 đánh dấu link đã dùng).
__Test Data:__ —

***

__STT:__ 12
__Category:__ Đặt mật khẩu mới
__Sub-Category:__ Đặt lại hợp lệ
__Checklist:__ CHK-authentication-082 — Hoàn tất đặt lại mật khẩu; kiểm tra mọi phiên hiện có bị thu hồi.
__Ref:__ FR-authentication-019, BR-authentication-007
__Priority:__ 1
__Title:__ Hoàn tất đặt lại mật khẩu; kiểm tra mọi phiên hiện có bị thu hồi
__Description:__ Kiểm chứng: Hoàn tất đặt lại mật khẩu; kiểm tra mọi phiên hiện có bị thu hồi.
__Auto:__ No
__Preconditions:__ Tài khoản đang đăng nhập trên ≥2 thiết bị (dựng: đăng nhập cùng tài khoản ở 2 phiên; nguồn: FR-authentication-021)

__Step:__ 1
__Action:__ Trên thiết bị A, hoàn tất đặt lại mật khẩu; sau đó thao tác tiếp trên thiết bị B (đang đăng nhập từ trước).
__Expected:__ Mọi phiên đăng nhập trên tất cả thiết bị bị thu hồi sau khi đặt lại thành công — thiết bị B bị buộc đăng nhập lại, không thao tác tiếp được bằng phiên cũ (FR-authentication-019, BR-authentication-007).
__Test Data:__ —

***

__STT:__ 13
__Category:__ Đặt mật khẩu mới
__Sub-Category:__ Đặt lại hợp lệ
__Checklist:__ CHK-authentication-083 — Hoàn tất đặt lại mật khẩu; kiểm tra thông báo thành công được hiển thị.
__Ref:__ FR-authentication-018
__Priority:__ 2
__Title:__ Hoàn tất đặt lại mật khẩu; kiểm tra thông báo thành công được hiển thị
__Description:__ Kiểm chứng: Hoàn tất đặt lại mật khẩu; kiểm tra thông báo thành công được hiển thị.
__Auto:__ Yes
__Preconditions:__ Đang ở màn đặt mật khẩu mới từ link còn hạn (dựng: mở link đặt lại còn hạn; nguồn: FR-authentication-018)

__Step:__ 1
__Action:__ Nhập mật khẩu mới hợp lệ (2 lần khớp) rồi gửi để hoàn tất đặt lại.
__Expected:__ Màn hiển thị thông báo đặt lại thành công, báo cho người dùng biết mật khẩu đã được cập nhật (FR-authentication-018).
__Test Data:__ Mật khẩu: Hoc2024!

***

__STT:__ 14
__Category:__ Đặt mật khẩu mới
__Sub-Category:__ Đặt lại hợp lệ
__Checklist:__ CHK-authentication-084 — Hoàn tất đặt lại mật khẩu; kiểm tra đích đến đăng nhập được cung cấp.
__Ref:__ FR-authentication-018
__Priority:__ 2
__Title:__ Hoàn tất đặt lại mật khẩu; kiểm tra đích đến đăng nhập được cung cấp
__Description:__ Kiểm chứng: Hoàn tất đặt lại mật khẩu; kiểm tra đích đến đăng nhập được cung cấp.
__Auto:__ Yes
__Preconditions:__ Vừa đặt lại mật khẩu thành công (dựng: mở link còn hạn + đặt mật khẩu mới; nguồn: FR-authentication-018)

__Step:__ 1
__Action:__ Ở màn thông báo thành công sau đặt lại, tìm lối vào đăng nhập.
__Expected:__ Màn thành công cung cấp đường dẫn/nút để người dùng đi tới màn đăng nhập bằng mật khẩu mới (do FR-authentication-019 đã thu hồi mọi phiên, buộc đăng nhập lại).
__Test Data:__ —

***

__STT:__ 15
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Liên kết không hợp lệ
__Checklist:__ CHK-authentication-085 — Mở liên kết đặt lại sau 30 phút; kiểm tra kết quả liên kết hết hạn xuất hiện.
__Ref:__ FR-authentication-020, E-authentication-009
__Priority:__ 1
__Title:__ Mở liên kết đặt lại sau 30 phút; kiểm tra kết quả liên kết hết hạn xuất hiện
__Description:__ Kiểm chứng: Mở liên kết đặt lại sau 30 phút; kiểm tra kết quả liên kết hết hạn xuất hiện.
__Auto:__ Yes
__Preconditions:__ Đã nhận link đặt lại mật khẩu (dựng: gửi yêu cầu quên mật khẩu; nguồn: FR-authentication-017)

__Step:__ 1
__Action:__ Mở link đặt lại sau khi đã quá 30 phút kể từ lúc phát hành.
__Expected:__ Trang kết quả hiển thị "Link đã hết hạn. [Quên mật khẩu] lại để nhận link mới." (E-authentication-009); KHÔNG hiển thị form đặt mật khẩu mới (FR-authentication-020).
__Test Data:__ —

***

__STT:__ 16
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Liên kết không hợp lệ
__Checklist:__ CHK-authentication-086 — Mở lại liên kết đặt lại đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện.
__Ref:__ FR-authentication-020, E-authentication-009
__Priority:__ 1
__Title:__ Mở lại liên kết đặt lại đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện
__Description:__ Kiểm chứng: Mở lại liên kết đặt lại đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện.
__Auto:__ Yes
__Preconditions:__ Đã có một link đặt lại đã được dùng để đổi mật khẩu (dựng: đặt lại thành công 1 lần; nguồn: FR-authentication-018)

__Step:__ 1
__Action:__ Mở lại đúng link đặt lại đã dùng trước đó.
__Expected:__ Trang kết quả hiển thị "Link đã hết hạn. [Quên mật khẩu] lại để nhận link mới." (E-authentication-009); KHÔNG hiển thị form đặt mật khẩu mới (FR-authentication-020 chặn link đã dùng).
__Test Data:__ —

***

__STT:__ 17
__Category:__ Xử lý xác thực và lỗi
__Sub-Category:__ Liên kết không hợp lệ
__Checklist:__ CHK-authentication-087 — Mở kết quả liên kết đặt lại không hợp lệ; kiểm tra tùy chọn yêu cầu đặt lại mới được cung cấp.
__Ref:__ E-authentication-009
__Priority:__ 2
__Title:__ Mở kết quả liên kết đặt lại không hợp lệ; kiểm tra tùy chọn yêu cầu đặt lại mới được cung cấp
__Description:__ Kiểm chứng: Mở kết quả liên kết đặt lại không hợp lệ; kiểm tra tùy chọn yêu cầu đặt lại mới được cung cấp.
__Auto:__ Yes
__Preconditions:__ Đang ở trang kết quả link đặt lại hết hạn/đã dùng (dựng: mở link hết hạn hoặc đã dùng; nguồn: E-authentication-009)

__Step:__ 1
__Action:__ Trên trang kết quả link không hợp lệ, tìm lối yêu cầu link mới.
__Expected:__ Trang cung cấp tùy chọn "[Quên mật khẩu] lại để nhận link mới" cho phép người dùng gửi yêu cầu đặt lại mới (E-authentication-009).
__Test Data:__ —

***

__STT:__ 18
__Category:__ Bảo mật cơ bản
__Sub-Category:__ Sự kiện nhạy cảm
__Checklist:__ CHK-authentication-088 — Hoàn tất đặt lại mật khẩu; kiểm tra một sự kiện kiểm toán bất biến được ghi lại mà không chứa mật khẩu.
__Ref:__ NFR-authentication-008
__Priority:__ 2
__Title:__ Hoàn tất đặt lại mật khẩu; kiểm tra một sự kiện kiểm toán bất biến được ghi lại mà không chứa mật khẩu
__Description:__ Kiểm chứng: Hoàn tất đặt lại mật khẩu; kiểm tra một sự kiện kiểm toán bất biến được ghi lại mà không chứa mật khẩu.
__Auto:__ No
__Preconditions:__ Vừa đặt lại mật khẩu thành công (dựng: mở link còn hạn + đặt mật khẩu mới; nguồn: FR-authentication-018)

__Step:__ 1
__Action:__ Sau khi đặt lại thành công, kiểm tra nhật ký sự kiện xác thực (audit log).
__Expected:__ Có một bản ghi sự kiện "đặt lại mật khẩu" trong nhật ký không sửa được (bất biến); bản ghi KHÔNG chứa giá trị mật khẩu (NFR-authentication-008).
__Test Data:__ —

***

__STT:__ 19
__Category:__ Khả năng truy cập cơ bản
__Sub-Category:__ Bàn phím và nhãn
__Checklist:__ CHK-authentication-089 — Điều hướng biểu mẫu đặt lại bằng Tab; kiểm tra trường mật khẩu mới nhận tiêu điểm bàn phím.
__Ref:__ NFR-authentication-009
__Priority:__ 3
__Title:__ Điều hướng biểu mẫu đặt lại bằng Tab; kiểm tra trường mật khẩu mới nhận tiêu điểm bàn phím
__Description:__ Kiểm chứng: Điều hướng biểu mẫu đặt lại bằng Tab; kiểm tra trường mật khẩu mới nhận tiêu điểm bàn phím.
__Auto:__ Yes
__Preconditions:__ Đang ở màn đặt mật khẩu mới từ link còn hạn (dựng: mở link đặt lại còn hạn; nguồn: FR-authentication-018)

__Step:__ 1
__Action:__ Dùng phím Tab điều hướng qua các trường của form đặt lại mật khẩu.
__Expected:__ Trường mật khẩu mới nhận được tiêu điểm bàn phím theo thứ tự Tab và có nhãn cho trình đọc màn hình (NFR-authentication-009, hỗ trợ điều hướng bàn phím + nhãn).
__Test Data:__ —

***

__STT:__ 20
__Category:__ Trường hợp biên
__Sub-Category:__ Đặt lại trên nhiều thiết bị
__Checklist:__ CHK-authentication-090 — Đặt lại mật khẩu trên một thiết bị; kiểm tra phiên đang hoạt động trên thiết bị khác bị từ chối.
__Ref:__ FR-authentication-019
__Priority:__ 1
__Title:__ Đặt lại mật khẩu trên một thiết bị; kiểm tra phiên đang hoạt động trên thiết bị khác bị từ chối
__Description:__ Kiểm chứng: Đặt lại mật khẩu trên một thiết bị; kiểm tra phiên đang hoạt động trên thiết bị khác bị từ chối.
__Auto:__ Yes
__Preconditions:__ Tài khoản đăng nhập đồng thời trên thiết bị A và B (dựng: đăng nhập cùng tài khoản ở 2 thiết bị; nguồn: FR-authentication-021)

__Step:__ 1
__Action:__ Đặt lại mật khẩu thành công trên thiết bị A, rồi tiếp tục thao tác cần đăng nhập trên thiết bị B.
__Expected:__ Phiên đang hoạt động trên thiết bị B bị từ chối (thu hồi) ngay sau khi đặt lại thành công trên A — thiết bị B buộc đăng nhập lại bằng mật khẩu mới (FR-authentication-019).
__Test Data:__ —‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
