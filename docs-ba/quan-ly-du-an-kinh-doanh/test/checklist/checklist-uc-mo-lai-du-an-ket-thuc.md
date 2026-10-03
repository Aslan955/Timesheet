#1. Hiển thị bước mở lại dự án Kết thúc
##1.1. Dòng thông báo và nút
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-703 → FR-quan-ly-du-an-kinh-doanh-043, BR-quan-ly-du-an-kinh-doanh-041, BR-quan-ly-du-an-kinh-doanh-044 · Verify Kế toán mở dự án Kết thúc thấy dòng thông báo kèm nút "Mở lại dự án"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-704 → FR-quan-ly-du-an-kinh-doanh-043, BR-quan-ly-du-an-kinh-doanh-041 · Verify mỗi vai trò AM, SM, GĐK mở dự án Kết thúc không thấy dòng thông báo bước, không có nút "Mở lại dự án"
#2. Xác nhận mở lại
##2.1. Hộp lý do
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-705 → FR-quan-ly-du-an-kinh-doanh-043, BR-quan-ly-du-an-kinh-doanh-044 · Verify bấm "Mở lại dự án" mở hộp xác nhận có ô lý do mở lại
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-706 → FR-quan-ly-du-an-kinh-doanh-043 · Verify bấm Huỷ ở hộp mở lại thì dự án giữ "Kết thúc"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-707 → E-quan-ly-du-an-kinh-doanh-042 · Verify xác nhận khi ô lý do trống thì ô viền đỏ kèm chữ đỏ "Vui lòng nhập lý do mở lại."
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-708 → E-quan-ly-du-an-kinh-doanh-042 · Verify xác nhận khi ô lý do trống thì dự án không được mở lại, giữ "Kết thúc"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-709 → FR-quan-ly-du-an-kinh-doanh-043 · Verify lý do chỉ gồm khoảng trắng bị coi như trống, hiện "Vui lòng nhập lý do mở lại."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-710 → BR-quan-ly-du-an-kinh-doanh-050, FR-quan-ly-du-an-kinh-doanh-043 · Verify lý do dài 1.001 ký tự hiện "Tối đa {n} ký tự" với n là 1.000
#3. Mở lại thành công
##3.1. Kết quả
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-711 → FR-quan-ly-du-an-kinh-doanh-043, BR-quan-ly-du-an-kinh-doanh-044 · Verify nhập lý do, xác nhận thì dự án về "Đang thực hiện"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-712 → FR-quan-ly-du-an-kinh-doanh-043, BR-quan-ly-du-an-kinh-doanh-044, BR-quan-ly-du-an-kinh-doanh-052, BR-quan-ly-du-an-kinh-doanh-036 · Verify tab Lịch sử có dòng "Mở lại dự án (từ Kết thúc)" ghi chú đúng lý do đã nhập, người thực hiện "{người dùng} ({vai trò})"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-713 → FR-quan-ly-du-an-kinh-doanh-043 · Verify sau khi mở lại hiện thông báo "Đã mở lại dự án {mã}"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-714 → FR-quan-ly-du-an-kinh-doanh-043, BR-quan-ly-du-an-kinh-doanh-014 · Verify mở lại không làm thay đổi Version của dự án
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-715 → FR-quan-ly-du-an-kinh-doanh-043 · Verify sau khi mở lại, SM thấy lại nút "Sửa"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-716 → FR-quan-ly-du-an-kinh-doanh-043 · Verify sau khi mở lại, Kế toán thấy lại nút "Tạo mã outsource"
#4. Lỗi khi mở lại
##4.1. Dữ liệu đã đổi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-717 → FR-quan-ly-du-an-kinh-doanh-043 · Verify 2 phiên Kế toán cùng mở lại 1 dự án Kết thúc, phiên sau không ghi thêm dòng lịch sử "Mở lại dự án (từ Kết thúc)" thứ hai
[2] [No] CHK-quan-ly-du-an-kinh-doanh-718 → E-quan-ly-du-an-kinh-doanh-030 · Verify sau lỗi dữ liệu đã đổi, ô lý do mở lại giữ nội dung đang nhập
##4.2. Ghi không trọn vẹn
[1] [No] CHK-quan-ly-du-an-kinh-doanh-719 → FR-quan-ly-du-an-kinh-doanh-043, NFR-quan-ly-du-an-kinh-doanh-014 · Verify giả lập lỗi ghi giữa chừng khi mở lại thì dự án giữ "Kết thúc"
[2] [No] CHK-quan-ly-du-an-kinh-doanh-720 → FR-quan-ly-du-an-kinh-doanh-043, E-quan-ly-du-an-kinh-doanh-037 · Verify sau lỗi ghi giữa chừng khi mở lại, hộp mở lại giữ lý do đã nhập
