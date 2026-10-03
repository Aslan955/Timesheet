#1. Hiển thị nút Tạo mã outsource
##1.1. Theo vai trò và trạng thái
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-613 → FR-quan-ly-du-an-kinh-doanh-022, BR-quan-ly-du-an-kinh-doanh-008 · Verify mỗi vai trò SM, GĐK, Kế toán thấy nút "Tạo mã outsource (0/2)" ở góc khung Mã dự án của dự án đã có mã, khác Kết thúc
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-614 → FR-quan-ly-du-an-kinh-doanh-022, BR-quan-ly-du-an-kinh-doanh-008 · Verify tài khoản AM không thấy nút "Tạo mã outsource"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-615 → FR-quan-ly-du-an-kinh-doanh-022, BR-quan-ly-du-an-kinh-doanh-008 · Verify dự án Kết thúc không có nút "Tạo mã outsource" với Kế toán
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-616 → FR-quan-ly-du-an-kinh-doanh-022, BR-quan-ly-du-an-kinh-doanh-008 · Verify dự án Chờ duyệt mã không có nút "Tạo mã outsource"
#2. Tạo mã outsource
##2.1. Tạo thành công
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-617 → FR-quan-ly-du-an-kinh-doanh-022, BR-quan-ly-du-an-kinh-doanh-008 · Verify bấm "Tạo mã outsource (0/2)" ở dự án mã "022.688" tạo mã "022.688.3"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-618 → BR-quan-ly-du-an-kinh-doanh-008, FR-quan-ly-du-an-kinh-doanh-022 · Verify bấm tạo lần thứ hai tạo mã "022.688.4"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-619 → FR-quan-ly-du-an-kinh-doanh-022, BR-quan-ly-du-an-kinh-doanh-008 · Verify mã mới có PM bằng PM outsource mặc định của dự án
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-620 → FR-quan-ly-du-an-kinh-doanh-022, BR-quan-ly-du-an-kinh-doanh-052, BR-quan-ly-du-an-kinh-doanh-036 · Verify tab Lịch sử có dòng "Tạo mã outsource" ghi chú "{mã} · PM {tên}", người thực hiện "{người dùng} ({vai trò})"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-621 → FR-quan-ly-du-an-kinh-doanh-022 · Verify dự án không có PM outsource mặc định, tạo mã thì lịch sử ghi chú chỉ "{mã}"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-622 → BR-quan-ly-du-an-kinh-doanh-014, BR-quan-ly-du-an-kinh-doanh-052 · Verify tạo mã outsource không làm thay đổi Version của dự án
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-623 → BR-quan-ly-du-an-kinh-doanh-008 · Verify danh sách mã outsource sắp theo thứ tự mã
##2.2. Giới hạn 2 mã đang có
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-624 → E-quan-ly-du-an-kinh-doanh-021, FR-quan-ly-du-an-kinh-doanh-022 · Verify dự án đã có 2 mã outsource thì nút "Tạo mã outsource (2/2)" mờ, chú thích "Tối đa 2 mã outsource"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-625 → BR-quan-ly-du-an-kinh-doanh-008, E-quan-ly-du-an-kinh-doanh-021 · Verify đã dùng ".3", ".4", xoá ".4" thì tạo tiếp ra ".5", không dùng lại ".4"
#3. Đổi PM và xoá mã outsource
##3.1. Đổi PM
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-626 → FR-quan-ly-du-an-kinh-doanh-023, BR-quan-ly-du-an-kinh-doanh-033 · Verify ô chọn PM của mã outsource liệt kê người có vai trò PM outsource từ danh mục nhân sự IMIS
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-627 → FR-quan-ly-du-an-kinh-doanh-023 · Verify chọn PM khác cho mã outsource thì PM mới được lưu ngay (tải lại màn vẫn hiện PM mới)
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-628 → FR-quan-ly-du-an-kinh-doanh-023, BR-quan-ly-du-an-kinh-doanh-052 · Verify đổi PM mã outsource thì tab Lịch sử có dòng "Cập nhật PM outsource" ghi chú "{mã} · {PM}"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-629 → FR-quan-ly-du-an-kinh-doanh-023 · Verify chọn "— Chọn PM outsource —" thì lịch sử ghi chú "{mã} · bỏ PM"
##3.2. Xoá mã
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-630 → FR-quan-ly-du-an-kinh-doanh-023, BR-quan-ly-du-an-kinh-doanh-008 · Verify bấm thùng rác cạnh mã hiện hộp hỏi xác nhận "Xoá mã outsource {mã}" kèm dấu chấm hỏi và câu "Số này sẽ không được dùng lại."
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-631 → FR-quan-ly-du-an-kinh-doanh-023 · Verify đồng ý xoá thì mã không còn trong khung Mã dự án
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-632 → FR-quan-ly-du-an-kinh-doanh-023, BR-quan-ly-du-an-kinh-doanh-052 · Verify xoá mã thì tab Lịch sử có dòng "Xoá mã outsource" ghi chú "{mã}"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-633 → FR-quan-ly-du-an-kinh-doanh-023 · Verify huỷ hộp xác nhận xoá thì mã giữ nguyên
##3.3. Chỉ xem
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-634 → FR-quan-ly-du-an-kinh-doanh-021, BR-quan-ly-du-an-kinh-doanh-008 · Verify tài khoản AM thấy mã outsource và PM nhưng không có ô chọn PM, không có nút xoá
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-635 → FR-quan-ly-du-an-kinh-doanh-023 · Verify dự án Kết thúc: mã outsource không có ô chọn PM, không có nút xoá với Kế toán
#4. Lỗi và thao tác cùng lúc
##4.1. Tạo khi dữ liệu đã đổi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-636 → FR-quan-ly-du-an-kinh-doanh-022, BR-quan-ly-du-an-kinh-doanh-008 · Verify 2 phiên cùng bấm tạo khi dự án có 1 mã outsource thì chỉ 1 mã mới được tạo, phiên còn lại không tạo được mã
[1] [No] CHK-quan-ly-du-an-kinh-doanh-637 → FR-quan-ly-du-an-kinh-doanh-022 · Verify 2 phiên cùng bấm tạo khi dự án chưa có mã outsource thì 2 mã tạo ra có số khác nhau
[2] [No] CHK-quan-ly-du-an-kinh-doanh-638 → FR-quan-ly-du-an-kinh-doanh-022 · Verify dự án vừa Kết thúc ở phiên khác, bấm "Tạo mã outsource" thì không có mã mới được tạo
[2] [No] CHK-quan-ly-du-an-kinh-doanh-639 → FR-quan-ly-du-an-kinh-doanh-023 · Verify dự án vừa Kết thúc ở phiên khác, đổi PM mã outsource thì PM mới không được lưu
##4.2. Danh mục và ghi không trọn vẹn
[2] [No] CHK-quan-ly-du-an-kinh-doanh-640 → E-quan-ly-du-an-kinh-doanh-038, FR-quan-ly-du-an-kinh-doanh-023 · Verify giả lập IMIS lỗi thì ô chọn PM outsource bị khoá kèm nút "Thử lại"
[1] [No] CHK-quan-ly-du-an-kinh-doanh-641 → FR-quan-ly-du-an-kinh-doanh-022, NFR-quan-ly-du-an-kinh-doanh-014 · Verify giả lập lỗi ghi giữa chừng khi tạo mã thì không có mã mới
[2] [No] CHK-quan-ly-du-an-kinh-doanh-642 → FR-quan-ly-du-an-kinh-doanh-023 · Verify giả lập lỗi ghi giữa chừng khi xoá mã thì mã giữ nguyên
