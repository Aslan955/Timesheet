#1. Hiển thị bước chờ duyệt mã
##1.1. Nút và dòng thông báo theo vai trò
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-348 → FR-quan-ly-du-an-kinh-doanh-019, FR-quan-ly-du-an-kinh-doanh-028, BR-quan-ly-du-an-kinh-doanh-009 · Verify GĐK của khối mở dự án Chờ duyệt mã thấy nút "Duyệt mã dự án" và "Từ chối mã" ở đầu trang
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-349 → BR-quan-ly-du-an-kinh-doanh-009, FR-quan-ly-du-an-kinh-doanh-041 · Verify mỗi vai trò AM, SM, Kế toán mở dự án Chờ duyệt mã không thấy nút "Duyệt mã dự án", "Từ chối mã"
[4] [Yes] CHK-quan-ly-du-an-kinh-doanh-350 → FR-quan-ly-du-an-kinh-doanh-028 · Verify nút "Duyệt mã dự án" đứng trước nút "Sửa" ở đầu trang
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-351 → BR-quan-ly-du-an-kinh-doanh-041, FR-quan-ly-du-an-kinh-doanh-020 · Verify GĐK thấy dải xanh nhạt "Yêu cầu mở mã dự án đang chờ Giám đốc khối duyệt — bấm Duyệt mã dự án ở góc phải. Duyệt xong hệ thống sinh Mã dự án / Mã KD / Mã SX và bắt đầu đếm 30 ngày lập PAKD."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-352 → BR-quan-ly-du-an-kinh-doanh-041, E-quan-ly-du-an-kinh-doanh-023, FR-quan-ly-du-an-kinh-doanh-020 · Verify mỗi vai trò AM, SM, Kế toán thấy dải xám "Đang chờ Giám đốc khối duyệt mã dự án."
#2. Xác nhận duyệt mã
##2.1. Hộp xác nhận
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-353 → FR-quan-ly-du-an-kinh-doanh-028, BR-quan-ly-du-an-kinh-doanh-009 · Verify bấm "Duyệt mã dự án" hiện hộp xác nhận đúng câu "Duyệt mã cho dự án {tên}" kèm dấu chấm hỏi và câu "Hệ thống sẽ sinh Mã dự án / Mã KD / Mã SX và bắt đầu đếm 30 ngày lập PAKD."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-354 → FR-quan-ly-du-an-kinh-doanh-028 · Verify huỷ hộp xác nhận thì dự án giữ "Chờ duyệt mã"
#3. Duyệt mã thành công
##3.1. Kết quả duyệt
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-355 → FR-quan-ly-du-an-kinh-doanh-028 · Verify đồng ý duyệt thì dự án chuyển sang "Chưa có PAKD"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-356 → FR-quan-ly-du-an-kinh-doanh-028, FR-quan-ly-du-an-kinh-doanh-015, BR-quan-ly-du-an-kinh-doanh-006 · Verify đồng ý duyệt thì dự án có mã tổng theo khách hàng bằng số thứ tự lớn nhất của khách hàng + 1
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-357 → BR-quan-ly-du-an-kinh-doanh-007 · Verify dự án vừa duyệt có Mã KD = mã tổng + ".1", Mã SX = mã tổng + ".2"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-358 → FR-quan-ly-du-an-kinh-doanh-028, BR-quan-ly-du-an-kinh-doanh-005 · Verify dự án vừa duyệt có Hạn lập PAKD "Còn 30 ngày" trên danh sách
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-359 → FR-quan-ly-du-an-kinh-doanh-028, BR-quan-ly-du-an-kinh-doanh-052, BR-quan-ly-du-an-kinh-doanh-036 · Verify tab Lịch sử có dòng "Duyệt mã dự án" ghi chú "Cấp mã {mã} · Hạn lập PAKD: {dd/mm/yyyy}", người thực hiện "{người dùng} ({vai trò})"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-360 → FR-quan-ly-du-an-kinh-doanh-028 · Verify sau khi duyệt hiện thông báo "Đã duyệt — hệ thống cấp mã {mã} (KD {mã}.1 · SX {mã}.2), hạn lập PAKD {dd/mm/yyyy}"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-361 → BR-quan-ly-du-an-kinh-doanh-014, BR-quan-ly-du-an-kinh-doanh-052 · Verify duyệt mã không làm thay đổi Version của dự án
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-362 → FR-quan-ly-du-an-kinh-doanh-026 · Verify sau khi duyệt, SM của dự án thấy khung PAKD ở màn chi tiết
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-363 → FR-quan-ly-du-an-kinh-doanh-020 · Verify sau khi duyệt, dòng thông báo chuyển sang bước lập PAKD
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-364 → FR-quan-ly-du-an-kinh-doanh-044 · Verify sau khi duyệt, mỗi vai trò AM, SM, Kế toán xem dự án thấy khối "Số liệu dự án theo tháng"
#4. Lỗi khi duyệt
##4.1. Hết số thứ tự
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-365 → E-quan-ly-du-an-kinh-doanh-027, FR-quan-ly-du-an-kinh-doanh-028 · Verify khách hàng có mã tổng lớn nhất ".999", GĐK đồng ý duyệt thì hiện "Khách hàng {Mã KH} đã dùng hết số thứ tự 999 — không cấp được mã mới"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-366 → E-quan-ly-du-an-kinh-doanh-027 · Verify sau lỗi hết số thứ tự, dự án giữ "Chờ duyệt mã"
##4.2. Dữ liệu đã đổi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-367 → FR-quan-ly-du-an-kinh-doanh-028, E-quan-ly-du-an-kinh-doanh-030 · Verify 2 phiên GĐK cùng mở 1 dự án Chờ duyệt mã, phiên duyệt sau không sinh thêm mã (lịch sử chỉ có 1 dòng "Duyệt mã dự án")
[2] [No] CHK-quan-ly-du-an-kinh-doanh-368 → E-quan-ly-du-an-kinh-doanh-030 · Verify sau lỗi dữ liệu đã đổi, màn chi tiết tự nạp lại trạng thái mới nhất của dự án
[2] [No] CHK-quan-ly-du-an-kinh-doanh-369 → FR-quan-ly-du-an-kinh-doanh-028 · Verify GĐK duyệt dự án vừa bị xoá ở phiên khác thì thao tác duyệt không được thực hiện, dự án không có mã
[1] [No] CHK-quan-ly-du-an-kinh-doanh-370 → FR-quan-ly-du-an-kinh-doanh-015, BR-quan-ly-du-an-kinh-doanh-006 · Verify 2 yêu cầu cùng khách hàng được 2 phiên GĐK duyệt cùng lúc nhận 2 mã tổng khác nhau
##4.3. Ghi không trọn vẹn
[1] [No] CHK-quan-ly-du-an-kinh-doanh-371 → FR-quan-ly-du-an-kinh-doanh-028, NFR-quan-ly-du-an-kinh-doanh-014 · Verify giả lập lỗi ghi giữa chừng khi duyệt thì dự án giữ "Chờ duyệt mã"
[2] [No] CHK-quan-ly-du-an-kinh-doanh-372 → FR-quan-ly-du-an-kinh-doanh-028 · Verify sau lỗi ghi khi duyệt, lần duyệt lại thành công nhận đúng số thứ tự đã định cho lần lỗi
