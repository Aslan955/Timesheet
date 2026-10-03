#1. Hiển thị dự án Từ chối mã
##1.1. Dòng thông báo theo người xem
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-390 → BR-quan-ly-du-an-kinh-doanh-041 · Verify mỗi người dùng là người tạo dự án, SM của dự án thấy dòng thông báo bắt đầu "Yêu cầu mở mã bị từ chối: “{lý do}”" với đúng lý do GĐK đã nhập
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-391 → BR-quan-ly-du-an-kinh-doanh-041 · Verify GĐK, Kế toán thấy dải xám "Đang chờ {người tạo} gửi lại yêu cầu mở mã."
##1.2. Nút Gửi lại theo người xem
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-392 → FR-quan-ly-du-an-kinh-doanh-042, FR-quan-ly-du-an-kinh-doanh-019 · Verify người tạo dự án thấy nút "Gửi lại yêu cầu mở mã" ở đầu trang
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-393 → FR-quan-ly-du-an-kinh-doanh-042 · Verify SM của dự án (không phải người tạo) thấy nút "Gửi lại yêu cầu mở mã"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-394 → FR-quan-ly-du-an-kinh-doanh-042 · Verify mỗi người dùng AM khác, SM khác cùng khối, GĐK, Kế toán không thấy nút "Gửi lại yêu cầu mở mã"
#2. Gửi lại yêu cầu mở mã
##2.1. Gửi lại thành công
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-395 → FR-quan-ly-du-an-kinh-doanh-042, BR-quan-ly-du-an-kinh-doanh-042 · Verify người tạo sửa thông tin cơ bản, bấm "Gửi lại yêu cầu mở mã" thì dự án về "Chờ duyệt mã"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-396 → FR-quan-ly-du-an-kinh-doanh-042, BR-quan-ly-du-an-kinh-doanh-052, BR-quan-ly-du-an-kinh-doanh-036 · Verify tab Lịch sử có dòng "Gửi lại yêu cầu mở mã" ghi chú "—", người thực hiện "{người dùng} ({vai trò})"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-397 → FR-quan-ly-du-an-kinh-doanh-042 · Verify sau khi gửi lại hiện thông báo "Đã gửi lại yêu cầu mở mã dự án {tên}"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-398 → BR-quan-ly-du-an-kinh-doanh-052 · Verify gửi lại không làm thay đổi Version của dự án
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-399 → FR-quan-ly-du-an-kinh-doanh-042 · Verify sau khi gửi lại, GĐK của khối thấy lại nút "Duyệt mã dự án" và "Từ chối mã"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-400 → FR-quan-ly-du-an-kinh-doanh-042 · Verify SM của dự án gửi lại thành công, dự án về "Chờ duyệt mã"
##2.2. Thiếu thông tin bắt buộc
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-401 → FR-quan-ly-du-an-kinh-doanh-042, E-quan-ly-du-an-kinh-doanh-006, BR-quan-ly-du-an-kinh-doanh-026 · Verify dự án Từ chối mã dữ liệu cũ thiếu Loại dự án, bấm "Gửi lại yêu cầu mở mã" hiện dải đỏ "Còn 1 thông tin cần bổ sung: Chọn loại dự án"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-402 → FR-quan-ly-du-an-kinh-doanh-042 · Verify gửi lại khi thiếu thông tin bắt buộc thì dự án giữ "Từ chối mã"
#3. Lỗi khi gửi lại
##3.1. Dữ liệu đã đổi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-403 → FR-quan-ly-du-an-kinh-doanh-042 · Verify GĐK xoá yêu cầu trong lúc người tạo đang xem, người tạo bấm gửi lại thì hiện "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại."
[2] [No] CHK-quan-ly-du-an-kinh-doanh-404 → FR-quan-ly-du-an-kinh-doanh-042 · Verify người dùng không còn là SM của dự án tại lúc bấm gửi lại thì hệ thống báo "Bạn không có quyền thực hiện thao tác này."
##3.2. Ghi không trọn vẹn
[1] [No] CHK-quan-ly-du-an-kinh-doanh-405 → FR-quan-ly-du-an-kinh-doanh-042, NFR-quan-ly-du-an-kinh-doanh-014 · Verify giả lập lỗi ghi giữa chừng khi gửi lại thì dự án giữ "Từ chối mã"
