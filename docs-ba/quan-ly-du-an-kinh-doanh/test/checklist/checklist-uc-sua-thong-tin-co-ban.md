#1. Vào chế độ sửa
##1.1. Bố cục chế độ sửa
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-478 → FR-quan-ly-du-an-kinh-doanh-029 · Verify bấm "Sửa" chuyển màn sang chế độ sửa: bên trái đầu trang "Sửa dự án", đầu trang còn "Huỷ sửa" và "Lưu thay đổi"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-479 → FR-quan-ly-du-an-kinh-doanh-029, FR-quan-ly-du-an-kinh-doanh-020 · Verify chế độ sửa ẩn đủ "← Quay lại", dòng thông báo bước, tab Lịch sử, nút theo bước, "Sửa", "Xoá", "Tạo mã outsource"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-480 → FR-quan-ly-du-an-kinh-doanh-029 · Verify chế độ sửa hiện dải xanh "Đang sửa thông tin dự án. Sửa trực tiếp các ô bên dưới (đổi PM bằng nút Update PM), xong bấm Lưu thay đổi — tạo Version v{n+1}."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-481 → FR-quan-ly-du-an-kinh-doanh-029 · Verify các khung Mã dự án, Thông tin chi tiết, Hợp đồng & tài liệu chuyển thành ô nhập
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-482 → FR-quan-ly-du-an-kinh-doanh-029, BR-quan-ly-du-an-kinh-doanh-032 · Verify dự án đã có mã: Mã dự án, Mã KD, Mã SX chỉ hiển thị, không sửa được
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-483 → FR-quan-ly-du-an-kinh-doanh-029 · Verify dự án có mã outsource hiện "{mã, …} — tạo / sửa ở khối Mã dự án sau khi lưu"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-484 → FR-quan-ly-du-an-kinh-doanh-029 · Verify dự án chưa có mã outsource hiện bắt đầu "Chưa có — " ở chế độ sửa
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-485 → FR-quan-ly-du-an-kinh-doanh-029 · Verify SM ở chế độ sửa vẫn thấy khung PAKD theo quyền xem
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-486 → FR-quan-ly-du-an-kinh-doanh-029 · Verify cuối khung Hợp đồng & tài liệu lặp nút "Huỷ sửa" và "Lưu thay đổi"
##1.2. Ô Khách hàng
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-487 → FR-quan-ly-du-an-kinh-doanh-029, BR-quan-ly-du-an-kinh-doanh-032 · Verify dự án đã có mã: ô Khách hàng bị khoá
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-488 → FR-quan-ly-du-an-kinh-doanh-029 · Verify dự án Chờ duyệt mã: ô Khách hàng chọn được, có link "+ Mới"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-489 → BR-quan-ly-du-an-kinh-doanh-053 · Verify ô Khối ở chế độ sửa của mỗi vai trò GĐK, SM, AM chỉ có khối của tài khoản
#2. Update PM
##2.1. Đổi PM trong chế độ sửa
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-490 → FR-quan-ly-du-an-kinh-doanh-030 · Verify dòng PM kinh doanh hiện tên PM hiện tại kèm nút "Update PM"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-491 → FR-quan-ly-du-an-kinh-doanh-030, BR-quan-ly-du-an-kinh-doanh-033 · Verify bấm "Update PM" hiện ô chọn PM từ danh mục nhân sự IMIS kèm nút × "Huỷ đổi PM"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-492 → FR-quan-ly-du-an-kinh-doanh-030 · Verify chọn PM khác, bấm × "Huỷ đổi PM" thì PM trở về PM cũ
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-493 → BR-quan-ly-du-an-kinh-doanh-033 · Verify PM cũ đã ngừng hoạt động trong IMIS vẫn được giữ khi lưu mà không đổi ô PM
[2] [No] CHK-quan-ly-du-an-kinh-doanh-494 → E-quan-ly-du-an-kinh-doanh-038, FR-quan-ly-du-an-kinh-doanh-029, FR-quan-ly-du-an-kinh-doanh-030 · Verify giả lập IMIS lỗi khi bấm "Update PM" thì ô chọn PM bị khoá kèm nút "Thử lại", dữ liệu đang sửa không mất
#3. Lưu thay đổi
##3.1. Lưu thành công
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-495 → FR-quan-ly-du-an-kinh-doanh-029, BR-quan-ly-du-an-kinh-doanh-014 · Verify sửa Tên dự án, bấm "Lưu thay đổi" thì Version tăng thêm 1
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-496 → FR-quan-ly-du-an-kinh-doanh-029, BR-quan-ly-du-an-kinh-doanh-052, BR-quan-ly-du-an-kinh-doanh-036 · Verify tab Lịch sử có dòng "Cập nhật" ghi chú "Version {n+1}", người thực hiện chỉ "{người dùng}" không kèm vai trò
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-497 → FR-quan-ly-du-an-kinh-doanh-029 · Verify sau khi lưu hiện thông báo "Đã cập nhật thông tin cơ bản — Version {n+1}"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-498 → FR-quan-ly-du-an-kinh-doanh-029 · Verify sau khi lưu, màn về chế độ xem với dữ liệu mới
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-499 → FR-quan-ly-du-an-kinh-doanh-029, BR-quan-ly-du-an-kinh-doanh-032 · Verify lưu sửa không làm đổi trạng thái dự án, không cần Kế toán duyệt
##3.2. Không có thay đổi
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-500 → FR-quan-ly-du-an-kinh-doanh-029, BR-quan-ly-du-an-kinh-doanh-032 · Verify vào chế độ sửa không đổi gì, bấm "Lưu thay đổi" hiện "Không có thay đổi"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-501 → FR-quan-ly-du-an-kinh-doanh-029 · Verify lưu khi không có thay đổi thì không có gì được ghi (Version giữ nguyên, không có dòng lịch sử mới)
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-502 → FR-quan-ly-du-an-kinh-doanh-029 · Verify chỉ thêm khoảng trắng cuối Tên dự án, bấm "Lưu thay đổi" hiện "Không có thay đổi"
##3.3. Tệp trong chế độ sửa
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-503 → FR-quan-ly-du-an-kinh-doanh-029, BR-quan-ly-du-an-kinh-doanh-037, BR-quan-ly-du-an-kinh-doanh-052, BR-quan-ly-du-an-kinh-doanh-051 · Verify thêm 1 tệp, đổi Ghi chú, bấm "Lưu thay đổi" thì tab Lịch sử có thêm dòng "Cập nhật tài liệu đính kèm" ghi chú "Cập nhật tài liệu đính kèm (1 tệp)"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-504 → BR-quan-ly-du-an-kinh-doanh-014, BR-quan-ly-du-an-kinh-doanh-051, FR-quan-ly-du-an-kinh-doanh-029 · Verify chỉ thêm tệp, không đổi trường nào, bấm "Lưu thay đổi" thì Version giữ nguyên
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-505 → FR-quan-ly-du-an-kinh-doanh-029, BR-quan-ly-du-an-kinh-doanh-051 · Verify thêm tệp, gỡ một tệp cũ, bấm "Huỷ sửa" thì danh sách tệp trở về như trước khi sửa
##3.4. Huỷ sửa
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-506 → FR-quan-ly-du-an-kinh-doanh-029 · Verify sửa Tên dự án, bấm "Huỷ sửa" thì màn về chế độ xem, Tên dự án giữ giá trị cũ
#4. Kiểm tra dữ liệu khi lưu
##4.1. Lỗi nhập
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-507 → FR-quan-ly-du-an-kinh-doanh-029, E-quan-ly-du-an-kinh-doanh-001, E-quan-ly-du-an-kinh-doanh-006, BR-quan-ly-du-an-kinh-doanh-026 · Verify xoá trống Tên dự án, bấm "Lưu thay đổi" hiện "Nhập tên dự án" trong dải đỏ "Còn 1 thông tin cần bổ sung: Nhập tên dự án"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-508 → E-quan-ly-du-an-kinh-doanh-005 · Verify đặt ngày kết thúc trước ngày bắt đầu, bấm "Lưu thay đổi" hiện "Ngày kết thúc phải sau ngày bắt đầu"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-509 → FR-quan-ly-du-an-kinh-doanh-029 · Verify Ghi chú dài 1.001 ký tự, bấm "Lưu thay đổi" hiện "Tối đa {n} ký tự" với n là 1.000
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-510 → FR-quan-ly-du-an-kinh-doanh-029 · Verify thêm tệp .exe ở chế độ sửa bị loại kèm câu "Tệp "{tên}" không đúng định dạng (chỉ nhận pdf, doc, docx, xls, xlsx, jpg, png)"
#5. Thay đổi cùng lúc khi đang sửa
##5.1. Chỉ ghi trường đã đổi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-511 → BR-quan-ly-du-an-kinh-doanh-048, FR-quan-ly-du-an-kinh-doanh-029 · Verify 2 phiên cùng sửa 1 dự án, phiên A đổi Tên, phiên B đổi Ghi chú, cả hai lưu thì dự án có cả Tên mới và Ghi chú mới
[1] [No] CHK-quan-ly-du-an-kinh-doanh-512 → BR-quan-ly-du-an-kinh-doanh-048 · Verify tác vụ chuyển dự án sang Pending trong lúc đang sửa, lưu sửa thì dự án vẫn ở Pending
[2] [No] CHK-quan-ly-du-an-kinh-doanh-513 → BR-quan-ly-du-an-kinh-doanh-048 · Verify Kế toán mở lại dự án Pending (hạn mới) trong lúc đang sửa, lưu sửa thì hạn lập PAKD giữ hạn mới
[2] [No] CHK-quan-ly-du-an-kinh-doanh-514 → BR-quan-ly-du-an-kinh-doanh-048 · Verify người khác tạo mã outsource trong lúc đang sửa, lưu sửa thì mã outsource mới vẫn còn
[2] [No] CHK-quan-ly-du-an-kinh-doanh-515 → BR-quan-ly-du-an-kinh-doanh-048 · Verify SM gửi PAKD trong lúc người khác đang sửa thông tin cơ bản, lưu sửa thì PAKD giữ bản vừa gửi
##5.2. Lưu bị từ chối
[1] [No] CHK-quan-ly-du-an-kinh-doanh-516 → FR-quan-ly-du-an-kinh-doanh-029, BR-quan-ly-du-an-kinh-doanh-032 · Verify dự án được Kế toán kết thúc trong lúc đang sửa, bấm "Lưu thay đổi" thì hiện "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại."
[2] [No] CHK-quan-ly-du-an-kinh-doanh-517 → BR-quan-ly-du-an-kinh-doanh-032, FR-quan-ly-du-an-kinh-doanh-029 · Verify sau lỗi dự án vừa Kết thúc, màn nạp lại dự án ở chế độ xem theo dữ liệu mới nhất
[1] [No] CHK-quan-ly-du-an-kinh-doanh-518 → FR-quan-ly-du-an-kinh-doanh-029, BR-quan-ly-du-an-kinh-doanh-032 · Verify GĐK duyệt mã trong lúc AM đang sửa đã đổi Khách hàng, AM bấm "Lưu thay đổi" thì Khách hàng mới không được lưu
[2] [No] CHK-quan-ly-du-an-kinh-doanh-519 → FR-quan-ly-du-an-kinh-doanh-029 · Verify tài khoản bị đổi khỏi vai trò SM trong lúc đang sửa, bấm "Lưu thay đổi" thì hiện "Bạn không có quyền thực hiện thao tác này."
##5.3. Ghi không trọn vẹn
[1] [No] CHK-quan-ly-du-an-kinh-doanh-520 → FR-quan-ly-du-an-kinh-doanh-029, NFR-quan-ly-du-an-kinh-doanh-014 · Verify giả lập lỗi ghi giữa chừng khi lưu sửa thì không có gì được ghi (Version, lịch sử, dữ liệu dự án không đổi)
[2] [No] CHK-quan-ly-du-an-kinh-doanh-521 → E-quan-ly-du-an-kinh-doanh-037 · Verify sau lỗi ghi không trọn vẹn, chế độ sửa giữ nguyên dữ liệu đang sửa
