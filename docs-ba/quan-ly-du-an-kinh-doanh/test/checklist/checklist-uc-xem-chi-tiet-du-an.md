#1. Đầu trang màn chi tiết
##1.1. Nút và meta
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-406 → FR-quan-ly-du-an-kinh-doanh-019 · Verify bấm "← Quay lại" ở màn chi tiết về màn Danh sách dự án
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-407 → FR-quan-ly-du-an-kinh-doanh-019 · Verify meta đầu trang hiện đủ Version vN, Trạng thái, PAKD (phiên bản), Cập nhật dạng dd/mm/yyyy HH:mm với tài khoản SM
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-408 → FR-quan-ly-du-an-kinh-doanh-019, BR-quan-ly-du-an-kinh-doanh-030 · Verify tài khoản AM không thấy mục PAKD trong meta đầu trang
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-409 → FR-quan-ly-du-an-kinh-doanh-019, BR-quan-ly-du-an-kinh-doanh-032, BR-quan-ly-du-an-kinh-doanh-002 · Verify nút "Sửa" hiện với mỗi vai trò AM, SM, GĐK trên dự án ở mỗi trạng thái Chờ duyệt mã, Từ chối mã, Chưa có PAKD, PAKD chờ duyệt, Đang thực hiện, Pending
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-410 → FR-quan-ly-du-an-kinh-doanh-019, BR-quan-ly-du-an-kinh-doanh-032 · Verify nút "Sửa" không hiện trên dự án Kết thúc với mỗi vai trò AM, SM, GĐK
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-411 → FR-quan-ly-du-an-kinh-doanh-019, BR-quan-ly-du-an-kinh-doanh-002, BR-quan-ly-du-an-kinh-doanh-031 · Verify tài khoản Kế toán không thấy nút "Sửa", không vào được chế độ sửa
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-412 → FR-quan-ly-du-an-kinh-doanh-019 · Verify SM mở dự án Chưa có PAKD thấy các nút "Lưu nháp", "Gửi Kế toán duyệt" do khung PAKD cung cấp ở đầu trang
[4] [Yes] CHK-quan-ly-du-an-kinh-doanh-413 → NFR-quan-ly-du-an-kinh-doanh-004 · Verify nút "← Quay lại" nằm bên trái, các nút tác vụ nằm bên phải đầu trang màn chi tiết
#2. Dòng thông báo bước hiện tại
##2.1. Chưa có PAKD
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-414 → BR-quan-ly-du-an-kinh-doanh-041, FR-quan-ly-du-an-kinh-doanh-020 · Verify SM mở dự án Chưa có PAKD thấy dải xanh nhạt "Dự án cần lập phương án kinh doanh (PAKD)." kèm "Hạn lập: {ngày} (còn {n} ngày)"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-415 → BR-quan-ly-du-an-kinh-doanh-041 · Verify GĐK mở dự án Chưa có PAKD có bản V1 bị từ chối thấy "PAKD V1 bị từ chối ({lý do}) — cần lập lại."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-416 → BR-quan-ly-du-an-kinh-doanh-041 · Verify Kế toán mở dự án Chưa có PAKD thấy dải xám "Đang chờ SM / Giám đốc khối lập PAKD (hạn {ngày})."
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-417 → BR-quan-ly-du-an-kinh-doanh-041, BR-quan-ly-du-an-kinh-doanh-046 · Verify AM mở dự án Chưa có PAKD thấy dải xám "Đang chờ SM / GĐK lập PAKD.", không có hạn lập PAKD
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-418 → NFR-quan-ly-du-an-kinh-doanh-007 · Verify số ngày ở dòng thông báo trùng với số ngày ở cột Hạn lập PAKD trên danh sách
##2.2. PAKD chờ duyệt
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-419 → BR-quan-ly-du-an-kinh-doanh-041 · Verify Kế toán mở dự án PAKD chờ duyệt thấy "PAKD V{n} đang chờ Kế toán (CFO) duyệt." kèm nút "Duyệt / Từ chối PAKD"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-420 → BR-quan-ly-du-an-kinh-doanh-041 · Verify mỗi vai trò SM, GĐK mở dự án PAKD chờ duyệt thấy dải xám "Đang chờ Kế toán (CFO) duyệt PAKD V{n}."
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-421 → BR-quan-ly-du-an-kinh-doanh-041 · Verify AM mở dự án PAKD chờ duyệt thấy "Đang chờ Kế toán duyệt PAKD.", không có số phiên bản
##2.3. Đang thực hiện
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-422 → BR-quan-ly-du-an-kinh-doanh-041 · Verify Kế toán mở dự án Đang thực hiện có bản điều chỉnh chờ duyệt thấy nút "Duyệt / Từ chối điều chỉnh"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-423 → BR-quan-ly-du-an-kinh-doanh-041 · Verify mỗi vai trò SM, GĐK mở dự án có bản điều chỉnh chờ thấy "Đang chờ Kế toán (CFO) duyệt bản điều chỉnh PAKD V{n}."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-424 → BR-quan-ly-du-an-kinh-doanh-041 · Verify AM mở dự án có bản điều chỉnh chờ thấy "Đang chờ Kế toán duyệt PAKD."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-425 → BR-quan-ly-du-an-kinh-doanh-041 · Verify SM mở dự án Đang thực hiện không có bản điều chỉnh thấy nút "Sửa PAKD"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-426 → BR-quan-ly-du-an-kinh-doanh-041 · Verify SM mở dự án Đang thực hiện đang có bản điều chỉnh nháp thấy nút "Tiếp tục sửa PAKD"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-427 → BR-quan-ly-du-an-kinh-doanh-041 · Verify GĐK mở dự án Đang thực hiện không có bản điều chỉnh chờ thấy nút "Sửa PAKD" và "Kết thúc dự án"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-428 → BR-quan-ly-du-an-kinh-doanh-041 · Verify Kế toán mở dự án Đang thực hiện không có bản điều chỉnh chờ thấy nút "Kết thúc dự án"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-429 → BR-quan-ly-du-an-kinh-doanh-041 · Verify AM mở dự án Đang thực hiện thấy dòng thông báo chỉ gồm "Dự án đang thực hiện." (không kèm nút)
##2.4. Cảnh báo quá tháng dự kiến ký
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-430 → BR-quan-ly-du-an-kinh-doanh-041 · Verify dự án đã qua tháng dự kiến ký mà chưa có HĐ có thêm chữ đỏ "Quá tháng dự kiến ký MM/YYYY" trên dòng thông báo, với mỗi vai trò AM, SM, GĐK, Kế toán
#3. Khung Mã dự án
##3.1. Mã
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-431 → FR-quan-ly-du-an-kinh-doanh-021 · Verify dự án đã có mã hiện Mã dự án chữ to màu xanh, Mã kinh doanh, Mã sản xuất
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-432 → FR-quan-ly-du-an-kinh-doanh-021 · Verify dự án chưa có mã hiện "Chờ GĐK duyệt" ở Mã dự án, "Tự sinh sau khi GĐK duyệt" ở Mã sản xuất
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-433 → FR-quan-ly-du-an-kinh-doanh-021 · Verify dự án đã có mã tổng, chưa có mã outsource hiện "Chưa có (tối đa 2 mã)"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-434 → FR-quan-ly-du-an-kinh-doanh-021 · Verify dự án chưa có mã tổng hiện "Tạo sau khi được cấp mã" ở mã outsource
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-435 → FR-quan-ly-du-an-kinh-doanh-021 · Verify dự án có 1 mã outsource hiện nhãn "Mã outsource"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-436 → FR-quan-ly-du-an-kinh-doanh-021 · Verify dự án có 2 mã outsource hiện nhãn "Mã outsource 1", "Mã outsource 2"
##3.2. Tên và PM
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-437 → FR-quan-ly-du-an-kinh-doanh-021 · Verify bên phải khung hiện Tên dự án kèm KEY, PM kinh doanh, PM sản xuất, PM outsource
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-438 → FR-quan-ly-du-an-kinh-doanh-021 · Verify dự án chưa có mã hiện PM outsource mặc định của dự án
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-439 → FR-quan-ly-du-an-kinh-doanh-021 · Verify dự án có mã outsource hiện PM riêng của từng mã outsource
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-440 → FR-quan-ly-du-an-kinh-doanh-021, BR-quan-ly-du-an-kinh-doanh-038 · Verify Mã dự án (mã tổng) không có PM đi kèm, PM gắn với Mã KD, Mã SX
#4. Tab Thông tin dự án
##4.1. Thông tin chi tiết
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-441 → FR-quan-ly-du-an-kinh-doanh-024 · Verify lưới chỉ xem hiện đủ Khối, Loại dự án, Tên khách hàng, Mã khách hàng, Thời gian; cột phải Giám đốc kinh doanh, Giám đốc khối, AM, Người tạo, Ghi chú
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-442 → FR-quan-ly-du-an-kinh-doanh-024 · Verify Thời gian hiện dạng "dd/mm/yyyy → dd/mm/yyyy"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-443 → FR-quan-ly-du-an-kinh-doanh-024 · Verify dự án có 2 AM hiện tên 2 AM ngăn bằng dấu phẩy
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-444 → FR-quan-ly-du-an-kinh-doanh-024 · Verify ô Ghi chú trống hiện "—"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-445 → BR-quan-ly-du-an-kinh-doanh-033, FR-quan-ly-du-an-kinh-doanh-017 · Verify PM đã gắn với dự án, nay ngừng hoạt động trong IMIS, vẫn hiện tên đã lưu
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-446 → BR-quan-ly-du-an-kinh-doanh-034 · Verify khách hàng đã gắn với dự án, nay bị xoá trong IMIS, vẫn hiện tên và mã đã lưu
##4.2. Hợp đồng & tài liệu
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-447 → FR-quan-ly-du-an-kinh-doanh-025 · Verify dự án chưa ký hiện nhãn "Chưa ký", dòng "Chưa có thông tin ký hợp đồng", nút "Cập nhật ký hợp đồng"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-448 → FR-quan-ly-du-an-kinh-doanh-025 · Verify dự án đã ký có HĐ hiện "Số {số HĐ} · ký {ngày}", "Thời hạn {từ} → {đến}", nút "Xem / cập nhật hợp đồng"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-449 → FR-quan-ly-du-an-kinh-doanh-025 · Verify dự án dữ liệu cũ đã ký chưa có chi tiết hiện "Chưa có thông tin chi tiết hợp đồng", nút "Bổ sung thông tin HĐ"
##4.3. Khung PAKD theo quyền xem
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-450 → FR-quan-ly-du-an-kinh-doanh-026, BR-quan-ly-du-an-kinh-doanh-030 · Verify mỗi vai trò SM, GĐK, Kế toán mở dự án đã có mã thấy khung PAKD
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-451 → E-quan-ly-du-an-kinh-doanh-026, FR-quan-ly-du-an-kinh-doanh-026, BR-quan-ly-du-an-kinh-doanh-030, BR-quan-ly-du-an-kinh-doanh-046 · Verify AM mở dự án đã có mã thấy khung "Phương án kinh doanh (PAKD)" chỉ có dòng 🔒 "PAKD của dự án chỉ hiển thị với Giám đốc kinh doanh (SM), Giám đốc khối và Kế toán duyệt."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-452 → FR-quan-ly-du-an-kinh-doanh-026, BR-quan-ly-du-an-kinh-doanh-030 · Verify dự án ở mỗi trạng thái Chờ duyệt mã, Từ chối mã không hiện khung PAKD với SM
#5. Khối Số liệu dự án theo tháng
##5.1. Hiển thị
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-453 → FR-quan-ly-du-an-kinh-doanh-044 · Verify khối chỉ có tab "Thực tế (kế toán) ({n} tháng)", không có tab Kế hoạch
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-454 → FR-quan-ly-du-an-kinh-doanh-044 · Verify bảng có tháng nằm ngang dạng T{m}/{yyyy}, chỉ tiêu nằm dọc đủ Doanh thu thực tế, Thu thực tế, Chi thực tế (└ SX, └ KD), Khối lượng công việc
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-455 → FR-quan-ly-du-an-kinh-doanh-044 · Verify cột "Luỹ kế" mỗi chỉ tiêu bằng tổng các tháng
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-456 → FR-quan-ly-du-an-kinh-doanh-044 · Verify số liệu trải hơn 1 năm thì có ô chọn năm, chọn năm 2026 cột tổng đổi thành "Năm 2026"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-457 → FR-quan-ly-du-an-kinh-doanh-044 · Verify số liệu chỉ trong 1 năm thì không có ô chọn năm
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-458 → FR-quan-ly-du-an-kinh-doanh-044 · Verify chân khung hiện "ĐVT: VNĐ · KLCV: SP · Chốt số: DT {MM/YYYY} · CP {MM/YYYY} · DTT {MM/YYYY} · KLCV {MM/YYYY}" kèm thông tin lần import
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-459 → FR-quan-ly-du-an-kinh-doanh-044 · Verify dự án chưa có số thực tế hiện "Kế toán chưa import số thực tế"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-460 → FR-quan-ly-du-an-kinh-doanh-044 · Verify khối hiện ở dự án mỗi trạng thái Chưa có PAKD, PAKD chờ duyệt, Đang thực hiện, Pending, Kết thúc
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-461 → FR-quan-ly-du-an-kinh-doanh-044 · Verify dự án ở mỗi trạng thái Chờ duyệt mã, Từ chối mã không có khối Số liệu dự án theo tháng
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-462 → FR-quan-ly-du-an-kinh-doanh-044, BR-quan-ly-du-an-kinh-doanh-046 · Verify tài khoản AM thấy khối Số liệu dự án theo tháng với số thực tế
##5.2. Mở chi tiết sổ kế toán
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-463 → FR-quan-ly-du-an-kinh-doanh-044 · Verify Kế toán bấm con số Thu thực tế khác 0 mở popup chi tiết sổ kế toán P-06
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-464 → FR-quan-ly-du-an-kinh-doanh-044 · Verify con số Thu thực tế bằng 0 không bấm được
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-465 → FR-quan-ly-du-an-kinh-doanh-044 · Verify tài khoản AM bấm con số Thu thực tế khác 0 không mở P-06
#6. Tab Lịch sử
##6.1. Bảng lịch sử
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-466 → FR-quan-ly-du-an-kinh-doanh-027 · Verify bấm tab "Lịch sử (n)" hiện bảng "Lịch sử thay đổi" đủ cột STT, Thời gian, Người thực hiện, Thao tác, Ghi chú
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-467 → FR-quan-ly-du-an-kinh-doanh-027 · Verify dòng lịch sử mới nhất nằm trên đầu bảng
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-468 → FR-quan-ly-du-an-kinh-doanh-027 · Verify cột Thời gian của lịch sử hiện dạng dd/mm/yyyy HH:mm
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-469 → FR-quan-ly-du-an-kinh-doanh-027 · Verify dòng lịch sử không có ghi chú hiện "—" ở cột Ghi chú
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-470 → FR-quan-ly-du-an-kinh-doanh-027, BR-quan-ly-du-an-kinh-doanh-046, BR-quan-ly-du-an-kinh-doanh-036, BR-quan-ly-du-an-kinh-doanh-052 · Verify tài khoản AM không thấy các dòng thao tác PAKD (Lưu nháp PAKD, Nộp PAKD, Gửi điều chỉnh PAKD, Huỷ bản điều chỉnh PAKD, duyệt / từ chối PAKD) trong tab Lịch sử
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-471 → FR-quan-ly-du-an-kinh-doanh-027 · Verify số (n) ở tab "Lịch sử (n)" của AM chỉ đếm các dòng AM được xem
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-472 → BR-quan-ly-du-an-kinh-doanh-052 · Verify SM thấy các dòng thao tác PAKD trong tab Lịch sử
#7. Vai trò và phạm vi khối
##7.1. Vai trò theo tài khoản
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-473 → FR-quan-ly-du-an-kinh-doanh-040 · Verify chuyển từ danh sách sang chi tiết, sang màn tạo, quay lại danh sách, chân khung vẫn hiện "Đang xem với vai trò {vai trò}" đúng vai trò tài khoản
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-474 → FR-quan-ly-du-an-kinh-doanh-040 · Verify không có ô chọn "Vai trò" trên các màn danh sách, chi tiết, tạo
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-475 → FR-quan-ly-du-an-kinh-doanh-040 · Verify tài khoản Kế toán thấy đúng bộ nút, cột, khung của Kế toán theo các BR phân quyền
##7.2. Dự án khối khác
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-476 → BR-quan-ly-du-an-kinh-doanh-053, FR-quan-ly-du-an-kinh-doanh-040 · Verify AM mở trực tiếp đường dẫn chi tiết dự án khối khác bị từ chối, báo "Bạn không có quyền thực hiện thao tác này."
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-477 → BR-quan-ly-du-an-kinh-doanh-053 · Verify GĐK mở trực tiếp đường dẫn chi tiết dự án Chờ duyệt mã khối khác bị từ chối, báo "Bạn không có quyền thực hiện thao tác này."
