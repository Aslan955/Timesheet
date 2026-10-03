#1. Quyền lưu P-03
##1.1. Vai trò lưu hợp đồng
[1] [Yes] CHK-phuong-an-kinh-doanh-566 → BR-phuong-an-kinh-doanh-041 · Verify SM khối dự án lưu P-03 thành công
[2] [Yes] CHK-phuong-an-kinh-doanh-567 → BR-phuong-an-kinh-doanh-041 · Verify GĐK khối dự án lưu P-03 thành công
[1] [Yes] CHK-phuong-an-kinh-doanh-568 → BR-phuong-an-kinh-doanh-041 · Verify Kế toán lưu P-03 của dự án thuộc khối bất kỳ thành công
[1] [Yes] CHK-phuong-an-kinh-doanh-569 → BR-phuong-an-kinh-doanh-041 · Verify AM mở P-03 ở chế độ chỉ xem, không có nút lưu
[1] [No] CHK-phuong-an-kinh-doanh-570 → FR-phuong-an-kinh-doanh-037, BR-phuong-an-kinh-doanh-041, E-phuong-an-kinh-doanh-018 · Verify AM gửi yêu cầu lưu P-03 bằng đường ngoài giao diện thì bị từ chối "Bạn không có quyền thực hiện thao tác này."
[1] [Yes] CHK-phuong-an-kinh-doanh-571 → FR-phuong-an-kinh-doanh-037, BR-phuong-an-kinh-doanh-032 · Verify dự án "Kết thúc" thì Kế toán mở P-03 ở chế độ chỉ xem, không lưu được

#2. Nhánh (a) — đã có PAKD được duyệt
##2.1. Sinh bản điều chỉnh chờ duyệt
[1] [Yes] CHK-phuong-an-kinh-doanh-572 → FR-phuong-an-kinh-doanh-041, BR-phuong-an-kinh-doanh-032, BR-phuong-an-kinh-doanh-025 · Verify dự án có V1 đã duyệt, chưa có bản điều chỉnh, lưu P-03 với số HĐ khác PAKD thì cột "Phiên bản PAKD" hiển thị "V2, chờ CFO"
[1] [Yes] CHK-phuong-an-kinh-doanh-573 → FR-phuong-an-kinh-doanh-041, BR-phuong-an-kinh-doanh-037 · Verify sau lưu P-03 nhánh (a), khung PAKD hiển thị bản điều chỉnh với nhãn "Chờ duyệt V2"
[1] [Yes] CHK-phuong-an-kinh-doanh-574 → FR-phuong-an-kinh-doanh-041, BR-phuong-an-kinh-doanh-032 · Verify bản điều chỉnh sinh từ P-03 có Mục 1 Tình trạng "Đã ký", Số hợp đồng, Ngày ký trên hợp đồng, Ngày ký thực tế, Giá trị hợp đồng theo hợp đồng vừa lưu
[2] [Yes] CHK-phuong-an-kinh-doanh-575 → FR-phuong-an-kinh-doanh-041, BR-phuong-an-kinh-doanh-032 · Verify hợp đồng có thời hạn 04/2027 – 09/2027 thì bản điều chỉnh có Bắt đầu 04/2027, Kết thúc 09/2027
[3] [Yes] CHK-phuong-an-kinh-doanh-576 → BR-phuong-an-kinh-doanh-032 · Verify hợp đồng trống ngày ký thì bản điều chỉnh giữ Ngày ký trên hợp đồng cũ của PAKD
[3] [Yes] CHK-phuong-an-kinh-doanh-577 → BR-phuong-an-kinh-doanh-032 · Verify hợp đồng trống thời hạn thì bản điều chỉnh giữ Bắt đầu / Kết thúc cũ
[3] [Yes] CHK-phuong-an-kinh-doanh-578 → BR-phuong-an-kinh-doanh-032 · Verify hợp đồng giá trị 0 thì bản điều chỉnh giữ Giá trị hợp đồng cũ
[1] [Yes] CHK-phuong-an-kinh-doanh-579 → FR-phuong-an-kinh-doanh-041 · Verify sau lưu P-03 nhánh (a), cột "Giá trị hợp đồng dự kiến" của dự án giữ theo bản đang áp dụng
[1] [Yes] CHK-phuong-an-kinh-doanh-580 → BR-phuong-an-kinh-doanh-032, BR-phuong-an-kinh-doanh-016 · Verify PAKD áp dụng Chưa ký, chưa có khoản mục có giá trị, lưu P-03 thì bản điều chỉnh có kế hoạch chi phí theo tháng sinh từ các giai đoạn có "Từ"
[2] [Yes] CHK-phuong-an-kinh-doanh-581 → FR-phuong-an-kinh-doanh-041, FR-phuong-an-kinh-doanh-038 · Verify bản điều chỉnh sinh từ P-03 thì tab "Lịch sử" có dòng "Gửi điều chỉnh PAKD V2 (theo hợp đồng)" với người thực hiện là người lưu P-03
[2] [Yes] CHK-phuong-an-kinh-doanh-582 → FR-phuong-an-kinh-doanh-041 · Verify P-04 của bản điều chỉnh sinh từ P-03 hiển thị Người nộp là người đã lưu P-03
[1] [Yes] CHK-phuong-an-kinh-doanh-583 → FR-phuong-an-kinh-doanh-041, BR-phuong-an-kinh-doanh-032 · Verify bản điều chỉnh sinh từ P-03 không đạt kiểm tra gửi vẫn ở "Chờ CFO" (cột hiển thị "V2, chờ CFO"), không thành bản nháp
[1] [Yes] CHK-phuong-an-kinh-doanh-584 → FR-phuong-an-kinh-doanh-041 · Verify bản điều chỉnh sinh từ P-03 không đạt kiểm tra gửi thì hợp đồng vẫn được lưu (P-03 hiển thị thông tin mới)
[2] [No] CHK-phuong-an-kinh-doanh-585 → FR-phuong-an-kinh-doanh-041, BR-phuong-an-kinh-doanh-044 · Verify bản điều chỉnh sinh từ P-03 có bản chụp nội dung lúc nộp gắn với V2
[1] [No] CHK-phuong-an-kinh-doanh-586 → FR-phuong-an-kinh-doanh-041, NFR-phuong-an-kinh-doanh-011 · Verify 2 người lưu P-03 cùng lúc cho dự án đã có PAKD duyệt thì chỉ sinh 1 bản điều chỉnh, số phiên bản không trùng

#3. Nhánh (b), (d) — bản đang chờ duyệt
##3.1. Cập nhật bản đang chờ
[1] [Yes] CHK-phuong-an-kinh-doanh-587 → FR-phuong-an-kinh-doanh-042, BR-phuong-an-kinh-doanh-032 · Verify PAKD lần đầu V1 đang chờ, lưu P-03 với số HĐ khác thì khung hiển thị Mục 1 bản chờ theo hợp đồng mới
[1] [Yes] CHK-phuong-an-kinh-doanh-588 → FR-phuong-an-kinh-doanh-042 · Verify sau lưu P-03 nhánh (b), cột "Phiên bản PAKD" vẫn "V1, chờ CFO" (không sinh phiên bản mới)
[1] [Yes] CHK-phuong-an-kinh-doanh-589 → FR-phuong-an-kinh-doanh-042 · Verify sau lưu P-03 nhánh (b), Kế toán mở P-04 thấy nhãn "Cập nhật theo hợp đồng sau khi nộp"
[2] [Yes] CHK-phuong-an-kinh-doanh-590 → FR-phuong-an-kinh-doanh-042, BR-phuong-an-kinh-doanh-044 · Verify sau lưu P-03 nhánh (b), phần so sánh trên P-04 vẫn hiện Số HĐ lúc nộp (bản chụp không đổi)
[2] [Yes] CHK-phuong-an-kinh-doanh-591 → FR-phuong-an-kinh-doanh-042, FR-phuong-an-kinh-doanh-038 · Verify sau lưu P-03 nhánh (b), tab "Lịch sử" có dòng "Cập nhật PAKD theo hợp đồng" ghi chú "bản đang chờ V1"
[1] [Yes] CHK-phuong-an-kinh-doanh-592 → FR-phuong-an-kinh-doanh-042 · Verify sau lưu P-03 nhánh (b), cột "Giá trị hợp đồng dự kiến" của dự án vẫn "—"
[1] [Yes] CHK-phuong-an-kinh-doanh-593 → FR-phuong-an-kinh-doanh-042, BR-phuong-an-kinh-doanh-032 · Verify bản điều chỉnh V2 đang chờ, lưu P-03 với giá trị HĐ khác thì Mục 1 bản điều chỉnh cập nhật và cột vẫn "V2, chờ CFO"
[2] [Yes] CHK-phuong-an-kinh-doanh-594 → BR-phuong-an-kinh-doanh-032 · Verify dự án "Pending" có PAKD đang chờ, lưu P-03 thì bản đang chờ được cập nhật theo hợp đồng
[1] [No] CHK-phuong-an-kinh-doanh-595 → FR-phuong-an-kinh-doanh-037, BR-phuong-an-kinh-doanh-032 · Verify SM Gửi PAKD trước, P-03 được ghi sau thì P-03 áp nhánh (b): bản vừa gửi được cập nhật và gắn dấu

#4. Nhánh (c) — PAKD đang lập
##4.1. Cập nhật bản đang lập
[1] [Yes] CHK-phuong-an-kinh-doanh-596 → FR-phuong-an-kinh-doanh-037, BR-phuong-an-kinh-doanh-032 · Verify dự án "Chưa có PAKD" đã Lưu nháp PAKD, lưu P-03 với số HĐ khác thì Mục 1 PAKD đang lập theo hợp đồng mới
[1] [Yes] CHK-phuong-an-kinh-doanh-597 → FR-phuong-an-kinh-doanh-037 · Verify sau lưu P-03 nhánh (c), cột "Phiên bản PAKD" vẫn "—" (không sinh phiên bản)
[1] [Yes] CHK-phuong-an-kinh-doanh-598 → FR-phuong-an-kinh-doanh-037 · Verify sau lưu P-03 nhánh (c), cột "Giá trị hợp đồng dự kiến" vẫn "—"
[2] [Yes] CHK-phuong-an-kinh-doanh-599 → FR-phuong-an-kinh-doanh-037, FR-phuong-an-kinh-doanh-038 · Verify sau lưu P-03 nhánh (c), tab "Lịch sử" có dòng "Cập nhật PAKD theo hợp đồng" ghi chú "bản đang lập"
[2] [Yes] CHK-phuong-an-kinh-doanh-600 → FR-phuong-an-kinh-doanh-037, BR-phuong-an-kinh-doanh-032 · Verify dự án bị từ chối đang làm lại, lưu P-03 thì bản đang làm lại được cập nhật và cột vẫn "V1, từ chối"
[2] [Yes] CHK-phuong-an-kinh-doanh-601 → BR-phuong-an-kinh-doanh-032 · Verify PAKD đang lập Chưa ký chưa có khoản mục có giá trị, lưu P-03 thì bản đang lập chuyển Đã ký với kế hoạch chi phí theo tháng sinh từ giai đoạn
[2] [Yes] CHK-phuong-an-kinh-doanh-602 → FR-phuong-an-kinh-doanh-037 · Verify SM đang mở khung, tự lưu P-03 thì khung PAKD tự nạp lại theo hợp đồng mà không hiện thông báo khung vừa được tải lại

#5. Nhánh (e) — bản điều chỉnh nháp / bị từ chối
##5.1. Cập nhật chính bản điều chỉnh
[1] [Yes] CHK-phuong-an-kinh-doanh-603 → FR-phuong-an-kinh-doanh-046, BR-phuong-an-kinh-doanh-032 · Verify có bản điều chỉnh nháp, lưu P-03 với số HĐ khác thì Mục 1 bản điều chỉnh theo hợp đồng mới
[1] [Yes] CHK-phuong-an-kinh-doanh-604 → FR-phuong-an-kinh-doanh-046 · Verify sau lưu P-03 nhánh (e), phần SM đang soạn ở Mục 3, Mục 4 của bản điều chỉnh giữ nguyên
[1] [Yes] CHK-phuong-an-kinh-doanh-605 → FR-phuong-an-kinh-doanh-046, BR-phuong-an-kinh-doanh-038 · Verify sau lưu P-03 nhánh (e), cột "Phiên bản PAKD" không đổi (không sinh bản điều chỉnh thứ hai, không sinh phiên bản)
[2] [Yes] CHK-phuong-an-kinh-doanh-606 → FR-phuong-an-kinh-doanh-046, BR-phuong-an-kinh-doanh-032 · Verify bản điều chỉnh nháp Chưa ký, lưu P-03 thì bảng giai đoạn giữ nguyên, không bị chuyển sang kế hoạch chi phí theo tháng
[2] [Yes] CHK-phuong-an-kinh-doanh-607 → FR-phuong-an-kinh-doanh-046 · Verify bản điều chỉnh bị từ chối chưa huỷ, lưu P-03 thì Mục 1 cập nhật và nhãn vẫn "Điều chỉnh bị từ chối"
[2] [Yes] CHK-phuong-an-kinh-doanh-608 → FR-phuong-an-kinh-doanh-046, FR-phuong-an-kinh-doanh-038 · Verify sau lưu P-03 nhánh (e), tab "Lịch sử" có dòng "Cập nhật PAKD theo hợp đồng" ghi chú "bản điều chỉnh đang soạn"
[1] [Yes] CHK-phuong-an-kinh-doanh-609 → FR-phuong-an-kinh-doanh-046 · Verify sau lưu P-03 nhánh (e), cột "Giá trị hợp đồng dự kiến" giữ theo bản đang áp dụng

#6. Nhánh (g) và trường hợp không có trường khác
##6.1. Chỉ lưu hợp đồng
[2] [Yes] CHK-phuong-an-kinh-doanh-610 → FR-phuong-an-kinh-doanh-037, BR-phuong-an-kinh-doanh-032 · Verify dự án chưa từng lưu PAKD, lưu P-03 thì chỉ lưu hợp đồng, tab "Lịch sử" không có dòng "Cập nhật PAKD theo hợp đồng"
[1] [Yes] CHK-phuong-an-kinh-doanh-611 → FR-phuong-an-kinh-doanh-041, BR-phuong-an-kinh-doanh-046 · Verify dự án có V1 đã duyệt, lưu P-03 với mọi trường ánh xạ giống PAKD thì không sinh bản điều chỉnh (cột vẫn "V1, đã duyệt")
[2] [Yes] CHK-phuong-an-kinh-doanh-612 → FR-phuong-an-kinh-doanh-042, BR-phuong-an-kinh-doanh-046 · Verify PAKD V1 đang chờ, lưu P-03 với mọi trường ánh xạ giống bản chờ thì P-04 không có nhãn "Cập nhật theo hợp đồng sau khi nộp"
[2] [Yes] CHK-phuong-an-kinh-doanh-613 → FR-phuong-an-kinh-doanh-037, BR-phuong-an-kinh-doanh-046 · Verify PAKD đang lập, lưu P-03 với mọi trường ánh xạ giống bản đang lập thì tab "Lịch sử" không có dòng "Cập nhật PAKD theo hợp đồng"
[3] [Yes] CHK-phuong-an-kinh-doanh-614 → FR-phuong-an-kinh-doanh-046, BR-phuong-an-kinh-doanh-046 · Verify bản điều chỉnh nháp, lưu P-03 với mọi trường ánh xạ giống bản đó thì tab "Lịch sử" không có dòng "Cập nhật PAKD theo hợp đồng"

#7. Lỗi ghi khi đồng bộ
##7.1. Ghi trọn vẹn cùng hợp đồng
[1] [No] CHK-phuong-an-kinh-doanh-615 → FR-phuong-an-kinh-doanh-037, FR-phuong-an-kinh-doanh-041, NFR-phuong-an-kinh-doanh-010 · Verify giả lập lỗi ghi khi lưu P-03 có đồng bộ PAKD thì hợp đồng và PAKD đều không đổi
[2] [No] CHK-phuong-an-kinh-doanh-616 → FR-phuong-an-kinh-doanh-042, FR-phuong-an-kinh-doanh-046 · Verify sau lỗi ghi khi lưu P-03, popup P-03 giữ dữ liệu đang nhập
