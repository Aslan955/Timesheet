#1. Nút Xoá theo vai trò và trạng thái
##1.1. Hiển thị
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-659 → FR-quan-ly-du-an-kinh-doanh-034, BR-quan-ly-du-an-kinh-doanh-010, FR-quan-ly-du-an-kinh-doanh-019 · Verify GĐK của khối thấy nút "Xoá" màu đỏ ở đầu trang chi tiết
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-660 → FR-quan-ly-du-an-kinh-doanh-034, BR-quan-ly-du-an-kinh-doanh-010 · Verify mỗi vai trò AM, SM, Kế toán không thấy nút "Xoá"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-661 → FR-quan-ly-du-an-kinh-doanh-034, BR-quan-ly-du-an-kinh-doanh-010, FR-quan-ly-du-an-kinh-doanh-019 · Verify GĐK mở dự án ở mỗi trạng thái Chờ duyệt mã, Từ chối mã: nút "Xoá" bấm được
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-662 → FR-quan-ly-du-an-kinh-doanh-034 · Verify rê chuột vào nút "Xoá" của dự án Chờ duyệt mã hiện chú thích "Xoá yêu cầu mở mã (chưa được Giám đốc khối duyệt)"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-663 → E-quan-ly-du-an-kinh-doanh-020, FR-quan-ly-du-an-kinh-doanh-034 · Verify GĐK mở dự án ở mỗi trạng thái Chưa có PAKD, PAKD chờ duyệt, Đang thực hiện, Pending, Kết thúc: nút "Xoá" mờ, không bấm được
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-664 → E-quan-ly-du-an-kinh-doanh-020 · Verify rê chuột vào nút "Xoá" mờ hiện chú thích "Dự án đã được Giám đốc khối duyệt — không xoá được"
#2. Xác nhận xoá
##2.1. Hộp xoá có lý do
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-665 → FR-quan-ly-du-an-kinh-doanh-034 · Verify bấm "Xoá" hiện hộp hỏi xác nhận "Xoá dự án "{tên}"" kèm dấu chấm hỏi và ô lý do xoá
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-666 → E-quan-ly-du-an-kinh-doanh-024, FR-quan-ly-du-an-kinh-doanh-034 · Verify bấm Huỷ ở hộp xoá thì dự án không bị xoá
##2.2. Lý do xoá
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-667 → E-quan-ly-du-an-kinh-doanh-029 · Verify đồng ý khi ô lý do trống thì ô viền đỏ kèm chữ đỏ "Vui lòng nhập lý do xoá."
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-668 → E-quan-ly-du-an-kinh-doanh-029, FR-quan-ly-du-an-kinh-doanh-034 · Verify đồng ý khi ô lý do trống thì dự án không bị xoá
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-669 → FR-quan-ly-du-an-kinh-doanh-034 · Verify lý do xoá chỉ gồm khoảng trắng bị coi như trống, hiện "Vui lòng nhập lý do xoá."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-670 → BR-quan-ly-du-an-kinh-doanh-050, FR-quan-ly-du-an-kinh-doanh-034 · Verify lý do xoá dài 1.001 ký tự hiện "Tối đa {n} ký tự" với n là 1.000
#3. Xoá thành công
##3.1. Kết quả xoá
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-671 → FR-quan-ly-du-an-kinh-doanh-034 · Verify nhập lý do, đồng ý xoá dự án Chờ duyệt mã thì màn chuyển về danh sách
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-672 → FR-quan-ly-du-an-kinh-doanh-034 · Verify sau khi xoá hiện thông báo "Đã xoá dự án"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-673 → FR-quan-ly-du-an-kinh-doanh-034 · Verify GĐK xoá được dự án Từ chối mã, màn về danh sách
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-674 → FR-quan-ly-du-an-kinh-doanh-034, BR-quan-ly-du-an-kinh-doanh-043 · Verify dự án đã xoá không còn trên danh sách với mọi bộ lọc
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-675 → BR-quan-ly-du-an-kinh-doanh-043 · Verify xoá dự án Chờ duyệt mã không làm thay đổi số nào trên Sổ theo dõi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-676 → FR-quan-ly-du-an-kinh-doanh-034, BR-quan-ly-du-an-kinh-doanh-043, BR-quan-ly-du-an-kinh-doanh-052, NFR-quan-ly-du-an-kinh-doanh-011 · Verify nhật ký xoá ghi đủ người xoá, thời điểm, lý do
[2] [No] CHK-quan-ly-du-an-kinh-doanh-677 → BR-quan-ly-du-an-kinh-doanh-043, NFR-quan-ly-du-an-kinh-doanh-011 · Verify dữ liệu, lịch sử của dự án đã xoá vẫn được giữ, không xoá hẳn
[4] [No] CHK-quan-ly-du-an-kinh-doanh-678 → BR-quan-ly-du-an-kinh-doanh-043 · Verify MH-02 không có thao tác khôi phục dự án đã xoá
#4. Lỗi khi xoá
##4.1. Dữ liệu đã đổi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-679 → FR-quan-ly-du-an-kinh-doanh-034, BR-quan-ly-du-an-kinh-doanh-010 · Verify dự án vừa được duyệt mã ở phiên khác, GĐK đồng ý xoá thì dự án không bị xoá
[2] [No] CHK-quan-ly-du-an-kinh-doanh-680 → E-quan-ly-du-an-kinh-doanh-030 · Verify sau lỗi dữ liệu đã đổi ở hộp xoá, ô lý do xoá giữ nội dung đang nhập
##4.2. Ghi không trọn vẹn
[1] [No] CHK-quan-ly-du-an-kinh-doanh-681 → FR-quan-ly-du-an-kinh-doanh-034, NFR-quan-ly-du-an-kinh-doanh-014 · Verify giả lập lỗi ghi giữa chừng khi xoá thì không có gì được ghi (dự án không bị đánh dấu xoá, không có nhật ký xoá)
[2] [No] CHK-quan-ly-du-an-kinh-doanh-682 → E-quan-ly-du-an-kinh-doanh-037 · Verify sau lỗi ghi không trọn vẹn, hộp xoá giữ lý do đã nhập
