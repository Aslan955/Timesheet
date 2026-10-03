#1. Hiển thị dự án Pending
##1.1. Dòng thông báo theo vai trò
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-738 → FR-quan-ly-du-an-kinh-doanh-037, BR-quan-ly-du-an-kinh-doanh-041 · Verify Kế toán mở dự án Pending thấy dòng thông báo bắt đầu "Dự án Pending: quá 30 ngày (hạn {ngày})" kèm nút "Mở lại dự án"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-739 → FR-quan-ly-du-an-kinh-doanh-037, BR-quan-ly-du-an-kinh-doanh-041 · Verify Kế toán mở dự án Pending đang có bản PAKD chờ thấy thêm nút "Duyệt / Từ chối PAKD"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-740 → BR-quan-ly-du-an-kinh-doanh-041, E-quan-ly-du-an-kinh-doanh-023 · Verify mỗi vai trò SM, GĐK mở dự án Pending thấy dải xám "Đang chờ Kế toán (CFO) mở lại dự án Pending (quá hạn PAKD {ngày})."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-741 → BR-quan-ly-du-an-kinh-doanh-041 · Verify AM mở dự án Pending thấy dải xám chờ Kế toán mở lại, không kèm ngày
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-742 → BR-quan-ly-du-an-kinh-doanh-012 · Verify mỗi vai trò AM, SM, GĐK không thấy nút "Mở lại dự án" ở dự án Pending
#2. Mở lại dự án Pending
##2.1. Kết quả mở lại
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-743 → FR-quan-ly-du-an-kinh-doanh-037 · Verify Kế toán bấm "Mở lại dự án" thực hiện ngay, không hiện hộp xác nhận
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-744 → FR-quan-ly-du-an-kinh-doanh-037, BR-quan-ly-du-an-kinh-doanh-012 · Verify dự án Pending không có bản PAKD chờ, mở lại thì về "Chưa có PAKD"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-745 → FR-quan-ly-du-an-kinh-doanh-037, BR-quan-ly-du-an-kinh-doanh-012 · Verify dự án Pending có bản PAKD mới nhất đang chờ Kế toán, mở lại thì về "PAKD chờ duyệt"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-746 → FR-quan-ly-du-an-kinh-doanh-037, BR-quan-ly-du-an-kinh-doanh-012, BR-quan-ly-du-an-kinh-doanh-005 · Verify sau khi mở lại, cột Hạn lập PAKD hiện "Còn 30 ngày" (hạn mới = hôm nay + 30)
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-747 → FR-quan-ly-du-an-kinh-doanh-037, BR-quan-ly-du-an-kinh-doanh-012 · Verify sau khi mở lại, cột Hạn lập PAKD không còn ngày đóng
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-748 → FR-quan-ly-du-an-kinh-doanh-037, BR-quan-ly-du-an-kinh-doanh-052 · Verify tab Lịch sử có dòng "Mở lại dự án" ghi chú "Hạn PAKD mới: {dd/mm/yyyy}"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-749 → FR-quan-ly-du-an-kinh-doanh-037 · Verify sau khi mở lại hiện thông báo "Đã mở lại dự án {mã} — hạn lập PAKD {dd/mm/yyyy}"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-750 → BR-quan-ly-du-an-kinh-doanh-014 · Verify mở lại dự án Pending không làm thay đổi Version
#3. Quyết định PAKD khi dự án Pending
##3.1. Duyệt và từ chối
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-751 → FR-quan-ly-du-an-kinh-doanh-038, BR-quan-ly-du-an-kinh-doanh-035 · Verify Kế toán duyệt bản PAKD đang chờ của dự án Pending thì dự án chuyển "Đang thực hiện"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-752 → BR-quan-ly-du-an-kinh-doanh-035 · Verify sau khi Kế toán duyệt PAKD lúc dự án Pending, cột Hạn lập PAKD không còn ngày đóng
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-753 → FR-quan-ly-du-an-kinh-doanh-038, BR-quan-ly-du-an-kinh-doanh-035 · Verify Kế toán từ chối bản PAKD đang chờ của dự án Pending thì dự án giữ "Pending"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-754 → FR-quan-ly-du-an-kinh-doanh-038 · Verify từ chối PAKD lúc dự án Pending không sinh thêm dòng lịch sử "Tự động chuyển Pending"
#4. Lỗi khi mở lại
##4.1. Dữ liệu đã đổi và ghi không trọn vẹn
[1] [No] CHK-quan-ly-du-an-kinh-doanh-755 → FR-quan-ly-du-an-kinh-doanh-037 · Verify Kế toán duyệt PAKD ở phiên khác trong lúc phiên này bấm "Mở lại dự án" thì dự án không được mở lại, giữ trạng thái "Đang thực hiện" vừa duyệt
[1] [No] CHK-quan-ly-du-an-kinh-doanh-756 → FR-quan-ly-du-an-kinh-doanh-037, NFR-quan-ly-du-an-kinh-doanh-014 · Verify giả lập lỗi ghi giữa chừng khi mở lại thì dự án giữ "Pending"
