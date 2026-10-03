#1. Mở hộp Từ chối mã
##1.1. Hộp lý do
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-373 → FR-quan-ly-du-an-kinh-doanh-041 · Verify GĐK bấm "Từ chối mã" mở hộp "Từ chối mã dự án" có ô lý do
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-374 → FR-quan-ly-du-an-kinh-doanh-041 · Verify bấm Huỷ ở hộp "Từ chối mã dự án" thì dự án giữ "Chờ duyệt mã"
#2. Từ chối thành công
##2.1. Kết quả từ chối
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-375 → FR-quan-ly-du-an-kinh-doanh-041, BR-quan-ly-du-an-kinh-doanh-042 · Verify nhập lý do, xác nhận thì dự án chuyển sang "Từ chối mã"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-376 → FR-quan-ly-du-an-kinh-doanh-041, BR-quan-ly-du-an-kinh-doanh-042 · Verify dự án Từ chối mã vẫn chưa có mã, cột Hạn lập PAKD hiện "—"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-377 → FR-quan-ly-du-an-kinh-doanh-041, BR-quan-ly-du-an-kinh-doanh-052, BR-quan-ly-du-an-kinh-doanh-036 · Verify tab Lịch sử có dòng "Từ chối mã" ghi chú đúng lý do đã nhập, người thực hiện "{người dùng} ({vai trò})"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-378 → FR-quan-ly-du-an-kinh-doanh-041 · Verify sau khi từ chối hiện thông báo "Đã từ chối mã dự án {tên}"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-379 → BR-quan-ly-du-an-kinh-doanh-014 · Verify từ chối mã không làm thay đổi Version của dự án
[4] [No] CHK-quan-ly-du-an-kinh-doanh-380 → BR-quan-ly-du-an-kinh-doanh-001 · Verify nhãn trạng thái "Từ chối mã" hiển thị màu đỏ trên danh sách
#3. Kiểm tra lý do
##3.1. Lý do bắt buộc
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-381 → E-quan-ly-du-an-kinh-doanh-028 · Verify xác nhận khi ô lý do trống thì ô viền đỏ kèm chữ đỏ "Vui lòng nhập lý do từ chối."
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-382 → E-quan-ly-du-an-kinh-doanh-028, FR-quan-ly-du-an-kinh-doanh-041 · Verify xác nhận khi ô lý do trống thì dự án không bị từ chối, giữ "Chờ duyệt mã"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-383 → FR-quan-ly-du-an-kinh-doanh-041, BR-quan-ly-du-an-kinh-doanh-050 · Verify lý do chỉ gồm khoảng trắng bị coi như trống, hiện "Vui lòng nhập lý do từ chối."
##3.2. Độ dài lý do
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-384 → FR-quan-ly-du-an-kinh-doanh-041 · Verify lý do dài đúng 1.000 ký tự được chấp nhận
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-385 → BR-quan-ly-du-an-kinh-doanh-050 · Verify lý do dài 1.001 ký tự hiện "Tối đa {n} ký tự" với n là 1.000
#4. Lỗi khi từ chối
##4.1. Dữ liệu đã đổi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-386 → FR-quan-ly-du-an-kinh-doanh-041 · Verify GĐK từ chối dự án vừa được phiên khác duyệt mã thì dự án không bị từ chối, giữ trạng thái vừa được duyệt
[2] [No] CHK-quan-ly-du-an-kinh-doanh-387 → E-quan-ly-du-an-kinh-doanh-030 · Verify sau lỗi dữ liệu đã đổi, ô lý do từ chối giữ nguyên nội dung đang nhập
##4.2. Ghi không trọn vẹn
[1] [No] CHK-quan-ly-du-an-kinh-doanh-388 → FR-quan-ly-du-an-kinh-doanh-041, NFR-quan-ly-du-an-kinh-doanh-014 · Verify giả lập lỗi ghi giữa chừng khi từ chối thì dự án giữ "Chờ duyệt mã"
[2] [No] CHK-quan-ly-du-an-kinh-doanh-389 → E-quan-ly-du-an-kinh-doanh-037 · Verify sau lỗi ghi không trọn vẹn, hộp lý do giữ nội dung đã nhập
