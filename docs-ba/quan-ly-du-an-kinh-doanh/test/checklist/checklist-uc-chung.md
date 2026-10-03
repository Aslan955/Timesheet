#1. Phân quyền cơ bản theo vai trò và khối
##1.1. Kiểm quyền tại lúc thực hiện
[1] [No] CHK-quan-ly-du-an-kinh-doanh-806 → NFR-quan-ly-du-an-kinh-doanh-013, BR-quan-ly-du-an-kinh-doanh-049 · Verify AM gửi trực tiếp yêu cầu lưu P-03 (không qua nút) bị từ chối, hợp đồng không đổi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-807 → BR-quan-ly-du-an-kinh-doanh-053, NFR-quan-ly-du-an-kinh-doanh-013, NFR-quan-ly-du-an-kinh-doanh-010 · Verify GĐK khối G1 gửi trực tiếp yêu cầu duyệt mã dự án khối G2 bị từ chối, dự án giữ "Chờ duyệt mã"
[1] [No] CHK-quan-ly-du-an-kinh-doanh-808 → NFR-quan-ly-du-an-kinh-doanh-013, BR-quan-ly-du-an-kinh-doanh-010 · Verify Kế toán gửi trực tiếp yêu cầu xoá dự án Chờ duyệt mã bị từ chối, dự án không bị xoá
##1.2. Báo cáo hiệu quả dự án (MH-03)
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-809 → BR-quan-ly-du-an-kinh-doanh-046 · Verify tài khoản AM không thấy menu Báo cáo hiệu quả dự án (MH-03)
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-810 → BR-quan-ly-du-an-kinh-doanh-046 · Verify tài khoản AM mở trực tiếp đường dẫn MH-03 bị từ chối
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-811 → BR-quan-ly-du-an-kinh-doanh-053 · Verify tài khoản SM mở MH-03 chỉ thấy dự án thuộc khối của tài khoản
#2. Thông báo thành công
##2.1. Vị trí và thời gian hiển thị
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-812 → FR-quan-ly-du-an-kinh-doanh-039, NFR-quan-ly-du-an-kinh-doanh-002 · Verify thông báo thành công (vd "Đã xoá dự án") hiện ở góc trên phải màn hình
[3] [No] CHK-quan-ly-du-an-kinh-doanh-813 → FR-quan-ly-du-an-kinh-doanh-039, NFR-quan-ly-du-an-kinh-doanh-002 · Verify thông báo thành công tự ẩn sau 2,5 giây
[2] [No] CHK-quan-ly-du-an-kinh-doanh-814 → E-quan-ly-du-an-kinh-doanh-037 · Verify thao tác lỗi (E-037) không hiện thông báo thành công
#3. Định dạng hiển thị
##3.1. Số, ngày, thời gian
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-815 → NFR-quan-ly-du-an-kinh-doanh-001 · Verify số tiền VNĐ hiển thị số nguyên có dấu phẩy ngăn nghìn, vd "1,000,000"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-816 → NFR-quan-ly-du-an-kinh-doanh-001 · Verify ngày hiển thị dạng dd/mm/yyyy trên MH-02
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-817 → NFR-quan-ly-du-an-kinh-doanh-001 · Verify ô không có dữ liệu hiển thị "—"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-818 → NFR-quan-ly-du-an-kinh-doanh-001 · Verify thời gian ở meta Cập nhật, lịch sử, chân P-03, thông tin lần import hiển thị dạng dd/mm/yyyy HH:mm 24 giờ theo giờ Việt Nam
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-819 → NFR-quan-ly-du-an-kinh-doanh-001 · Verify phần trăm hiển thị 1 chữ số thập phân
#4. Thời gian theo giờ Việt Nam
##4.1. Hôm nay theo Asia/Ho_Chi_Minh
[1] [No] CHK-quan-ly-du-an-kinh-doanh-820 → NFR-quan-ly-du-an-kinh-doanh-007 · Verify GĐK duyệt mã lúc 06:30 giờ Việt Nam ngày D (23:30 UTC ngày D−1) thì ngày cấp mã là ngày D, hạn lập PAKD là D + 30
[2] [No] CHK-quan-ly-du-an-kinh-doanh-821 → NFR-quan-ly-du-an-kinh-doanh-007, FR-quan-ly-du-an-kinh-doanh-004 · Verify mở danh sách lúc 00:30 giờ Việt Nam ngày 01/01 (17:30 UTC ngày 31/12) thì Năm mặc định là năm mới
#5. Trạng thái dự án theo PAKD (điểm nối)
##5.1. Gửi và duyệt PAKD lần đầu
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-822 → FR-quan-ly-du-an-kinh-doanh-038, BR-quan-ly-du-an-kinh-doanh-035 · Verify SM gửi PAKD lần đầu ở dự án Chưa có PAKD thì dự án chuyển "PAKD chờ duyệt"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-823 → BR-quan-ly-du-an-kinh-doanh-035 · Verify dự án PAKD chờ duyệt chưa đồng bộ số liệu PAKD: cột Giá trị hợp đồng dự kiến vẫn "—"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-824 → FR-quan-ly-du-an-kinh-doanh-038, BR-quan-ly-du-an-kinh-doanh-035 · Verify Kế toán duyệt bản PAKD lập lần đầu thì dự án chuyển "Đang thực hiện"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-825 → FR-quan-ly-du-an-kinh-doanh-038, BR-quan-ly-du-an-kinh-doanh-035 · Verify sau khi Kế toán duyệt PAKD, cột Giá trị hợp đồng dự kiến hiện Doanh thu dự kiến của bản được duyệt
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-826 → FR-quan-ly-du-an-kinh-doanh-038, BR-quan-ly-du-an-kinh-doanh-035 · Verify Kế toán từ chối bản PAKD lần đầu thì dự án về "Chưa có PAKD"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-827 → FR-quan-ly-du-an-kinh-doanh-038, BR-quan-ly-du-an-kinh-doanh-005 · Verify sau khi bị từ chối PAKD, hạn lập PAKD giữ hạn gốc
##5.2. Tạo hợp đồng ban đầu từ PAKD
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-828 → FR-quan-ly-du-an-kinh-doanh-038, BR-quan-ly-du-an-kinh-doanh-035 · Verify Kế toán duyệt bản PAKD có tình trạng Đã ký khi dự án chưa có HĐ thì dự án có HĐ ban đầu, nhãn "Đã ký"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-829 → FR-quan-ly-du-an-kinh-doanh-038, BR-quan-ly-du-an-kinh-doanh-014 · Verify tạo HĐ ban đầu từ PAKD làm Version dự án tăng thêm 1
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-830 → FR-quan-ly-du-an-kinh-doanh-038, BR-quan-ly-du-an-kinh-doanh-052, BR-quan-ly-du-an-kinh-doanh-036 · Verify tab Lịch sử có dòng "Tạo hợp đồng từ PAKD V{n}" ghi chú "HĐ {số} · Version {n+1}", người thực hiện là Kế toán duyệt kèm vai trò
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-831 → FR-quan-ly-du-an-kinh-doanh-038, BR-quan-ly-du-an-kinh-doanh-035, BR-quan-ly-du-an-kinh-doanh-029 · Verify Kế toán duyệt bản PAKD Đã ký khi dự án đã có HĐ thì HĐ đã lưu giữ nguyên
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-832 → FR-quan-ly-du-an-kinh-doanh-038, BR-quan-ly-du-an-kinh-doanh-035 · Verify Kế toán duyệt bản PAKD Đã ký lệch HĐ hiện có hơn 2% thì hiển thị cảnh báo lệch theo feature phuong-an-kinh-doanh
##5.3. Bản điều chỉnh
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-833 → FR-quan-ly-du-an-kinh-doanh-038, BR-quan-ly-du-an-kinh-doanh-035 · Verify SM gửi bản điều chỉnh PAKD thì dự án giữ "Đang thực hiện"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-834 → FR-quan-ly-du-an-kinh-doanh-038 · Verify Kế toán duyệt bản điều chỉnh PAKD thì dự án giữ "Đang thực hiện"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-835 → FR-quan-ly-du-an-kinh-doanh-038 · Verify Kế toán từ chối bản điều chỉnh PAKD thì dự án giữ "Đang thực hiện"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-836 → BR-quan-ly-du-an-kinh-doanh-014, BR-quan-ly-du-an-kinh-doanh-052 · Verify thao tác PAKD (gửi, duyệt, từ chối) không làm thay đổi Version của dự án
##5.4. Toàn vẹn quyết định PAKD
[1] [No] CHK-quan-ly-du-an-kinh-doanh-837 → FR-quan-ly-du-an-kinh-doanh-038, NFR-quan-ly-du-an-kinh-doanh-014 · Verify giả lập lỗi ghi giữa chừng khi Kế toán duyệt PAKD thì không có gì được ghi (trạng thái dự án, số liệu, HĐ, PAKD đều không đổi)
#6. Toàn vẹn dữ liệu và thao tác lặp
##6.1. Bấm lặp và cùng lúc
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-838 → NFR-quan-ly-du-an-kinh-doanh-014 · Verify bấm nhanh 2 lần "Lưu thay đổi" ở chế độ sửa chỉ tăng Version thêm đúng 1
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-839 → NFR-quan-ly-du-an-kinh-doanh-014 · Verify bấm nhanh 2 lần "Lưu & xác nhận đã ký" chỉ tạo 1 dòng lịch sử "Ký hợp đồng"
[1] [No] CHK-quan-ly-du-an-kinh-doanh-840 → BR-quan-ly-du-an-kinh-doanh-014, E-quan-ly-du-an-kinh-doanh-030 · Verify 2 phiên cùng lúc lưu sửa thông tin và lưu P-03 trên cùng dự án nhận 2 số Version khác nhau, không trùng
##6.2. Mất kết nối khi lưu
[1] [No] CHK-quan-ly-du-an-kinh-doanh-841 → E-quan-ly-du-an-kinh-doanh-037 · Verify ngắt mạng khi bấm "Lưu thay đổi" thì hiện "Thao tác chưa thực hiện được, vui lòng thử lại"
[1] [No] CHK-quan-ly-du-an-kinh-doanh-842 → NFR-quan-ly-du-an-kinh-doanh-014 · Verify sau lỗi mất kết nối khi lưu, dữ liệu dự án không đổi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-843 → NFR-quan-ly-du-an-kinh-doanh-014 · Verify sau lỗi mất kết nối, bật mạng, bấm lại thì thao tác được ghi đúng một lần
##6.3. Ghi nhận tra soát
[2] [No] CHK-quan-ly-du-an-kinh-doanh-844 → NFR-quan-ly-du-an-kinh-doanh-016, E-quan-ly-du-an-kinh-doanh-037 · Verify mỗi lần ghi không trọn vẹn được ghi nhận tra soát đủ người, thời điểm, dự án, thao tác
[2] [No] CHK-quan-ly-du-an-kinh-doanh-845 → NFR-quan-ly-du-an-kinh-doanh-016 · Verify thao tác bị từ chối do dữ liệu vừa đổi được ghi nhận tra soát đủ người, thời điểm, dự án, thao tác
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-846 → NFR-quan-ly-du-an-kinh-doanh-016 · Verify các tình huống bị từ chối, ghi không trọn vẹn không tạo dòng mới trong tab Lịch sử của dự án
#7. Lưu trữ
##7.1. Lịch sử đầy đủ
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-847 → NFR-quan-ly-du-an-kinh-doanh-011 · Verify dự án đã qua nhiều thao tác vẫn có dòng "Tạo dự án" ở cuối tab Lịch sử
#8. Accessibility cơ bản
##8.1. Bàn phím và nhãn
[3] [No] CHK-quan-ly-du-an-kinh-doanh-848 → — · Verify dùng phím Tab di chuyển lần lượt qua bộ lọc Năm, Khối, Tìm kiếm, Trạng thái, nút "Xuất Excel" theo thứ tự hiển thị
[3] [No] CHK-quan-ly-du-an-kinh-doanh-849 → — · Verify các nút "Cấp mã dự án", "Lưu thay đổi", "Lưu & xác nhận đã ký" kích hoạt được bằng phím Enter khi đang được focus
[3] [No] CHK-quan-ly-du-an-kinh-doanh-850 → — · Verify mỗi ô nhập ở màn tạo dự án, P-01, P-03 có nhãn hiển thị gắn với ô
[3] [No] CHK-quan-ly-du-an-kinh-doanh-851 → — · Verify khi mở hộp xác nhận (Xoá, Kết thúc, Từ chối mã) focus chuyển vào trong hộp
[3] [No] CHK-quan-ly-du-an-kinh-doanh-852 → — · Verify lỗi nhập liệu có dòng chữ dưới ô, không chỉ thể hiện bằng màu đỏ
#9. Responsive cơ bản (Desktop Chrome)
##9.1. Cửa sổ hẹp và rộng
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-853 → NFR-quan-ly-du-an-kinh-doanh-003 · Verify thu hẹp cửa sổ trình duyệt, bảng danh sách cuộn ngang trong khung, trang không vỡ layout
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-854 → NFR-quan-ly-du-an-kinh-doanh-003 · Verify cửa sổ hẹp, lưới Thông tin chi tiết hiển thị 1 cột
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-855 → NFR-quan-ly-du-an-kinh-doanh-003 · Verify cửa sổ rộng, lưới Thông tin chi tiết hiển thị 2 cột
[3] [No] CHK-quan-ly-du-an-kinh-doanh-856 → — · Verify cửa sổ hẹp, popup P-03 vẫn cuộn được tới nút lưu
#10. Loading và mạng chậm
##10.1. Trạng thái đang tải
[3] [No] CHK-quan-ly-du-an-kinh-doanh-857 → — · Verify mạng chậm, màn Danh sách dự án cho người dùng thấy đang tải trước khi dữ liệu xuất hiện
[3] [No] CHK-quan-ly-du-an-kinh-doanh-858 → — · Verify mạng chậm, màn chi tiết không hiện dữ liệu của dự án trước đó trong lúc tải dự án mới
#11. Edge cases điều hướng
##11.1. Back và refresh
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-859 → — · Verify nút Back của trình duyệt ở màn chi tiết quay về màn Danh sách dự án
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-860 → — · Verify tải lại trang (F5) ở màn chi tiết hiển thị dữ liệu mới nhất của dự án
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-861 → — · Verify tải lại trang khi đang ở chế độ sửa thì thay đổi chưa lưu không được ghi (Version giữ nguyên)
