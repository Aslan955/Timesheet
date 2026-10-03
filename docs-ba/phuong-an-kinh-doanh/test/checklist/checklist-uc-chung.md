#1. Phân quyền theo vai trò và khối
##1.1. AM và dữ liệu PAKD ngoài khung
[1] [Yes] CHK-phuong-an-kinh-doanh-627 → FR-phuong-an-kinh-doanh-038, NFR-phuong-an-kinh-doanh-007 · Verify AM mở tab "Lịch sử" của dự án đã có thao tác PAKD thì không thấy dòng thao tác PAKD nào (vd "Nộp PAKD", "CFO duyệt PAKD")
[1] [Yes] CHK-phuong-an-kinh-doanh-628 → FR-phuong-an-kinh-doanh-038, NFR-phuong-an-kinh-doanh-007 · Verify AM mở tab "Lịch sử" thì số đếm dòng của tab không tính các dòng thao tác PAKD
[1] [Yes] CHK-phuong-an-kinh-doanh-629 → NFR-phuong-an-kinh-doanh-007 · Verify AM không mở được màn Báo cáo hiệu quả dự án (MH-03)
[1] [Yes] CHK-phuong-an-kinh-doanh-630 → BR-phuong-an-kinh-doanh-001 · Verify SM khối A Xuất Excel danh sách thì file chỉ có dự án thuộc khối A
[1] [Yes] CHK-phuong-an-kinh-doanh-631 → BR-phuong-an-kinh-doanh-001 · Verify Kế toán xem danh sách dự án thấy dự án của mọi khối
[2] [Yes] CHK-phuong-an-kinh-doanh-632 → E-phuong-an-kinh-doanh-018 · Verify Kế toán xem khung PAKD dự án "Chưa có PAKD" ở chế độ chỉ xem không hiện câu báo lỗi quyền nào

#2. Định dạng hiển thị
##2.1. Số, %, tháng, ngày
[2] [Yes] CHK-phuong-an-kinh-doanh-633 → NFR-phuong-an-kinh-doanh-001 · Verify tiền trên khung PAKD và P-04 hiển thị đơn vị VNĐ làm tròn đồng, phân cách nghìn bằng dấu phẩy (vd "1,000,000")
[2] [Yes] CHK-phuong-an-kinh-doanh-634 → NFR-phuong-an-kinh-doanh-001 · Verify % trên khung PAKD hiển thị 1 chữ số thập phân (vd Biên lợi nhuận "25.0%")
[3] [Yes] CHK-phuong-an-kinh-doanh-635 → NFR-phuong-an-kinh-doanh-001 · Verify Σ % mốc ở dòng "TỔNG" Mục 3 hiển thị nguyên số đã cộng (3 mốc 33.33 hiện 99.99)
[3] [Yes] CHK-phuong-an-kinh-doanh-636 → NFR-phuong-an-kinh-doanh-001 · Verify ô tháng trên khung PAKD hiển thị dạng MM/YYYY
[3] [Yes] CHK-phuong-an-kinh-doanh-637 → NFR-phuong-an-kinh-doanh-001 · Verify ngày nộp trên P-04 hiển thị dạng dd/mm/yyyy
[3] [Yes] CHK-phuong-an-kinh-doanh-638 → NFR-phuong-an-kinh-doanh-001 · Verify ô không có giá trị hiển thị "—" (vd Số tháng thực hiện khi chưa đủ tháng)

#3. Loading và phản hồi
##3.1. Toast và trạng thái chờ
[3] [Yes] CHK-phuong-an-kinh-doanh-639 → NFR-phuong-an-kinh-doanh-004 · Verify toast thông báo hiện ở góc trên phải màn hình
[3] [Yes] CHK-phuong-an-kinh-doanh-640 → NFR-phuong-an-kinh-doanh-004 · Verify toast tự ẩn mà không cần người dùng đóng
[3] [No] CHK-phuong-an-kinh-doanh-641 → — · Verify mạng chậm, bấm "Gửi Kế toán duyệt" thì không hiện toast thành công trước khi hệ thống ghi xong
[3] [No] CHK-phuong-an-kinh-doanh-642 → — · Verify mạng chậm khi mở màn chi tiết thì khung PAKD không hiện số liệu của dự án trước đó trong lúc chờ tải

#4. Accessibility cơ bản
##4.1. Bàn phím và nhãn
[3] [No] CHK-phuong-an-kinh-doanh-643 → — · Verify phím Tab di chuyển qua các ô Mục 1 theo đúng thứ tự hiển thị
[3] [No] CHK-phuong-an-kinh-doanh-644 → — · Verify mở P-04 thì tiêu điểm bàn phím nằm trong popup, Tab không nhảy ra màn phía sau
[3] [No] CHK-phuong-an-kinh-doanh-645 → — · Verify các nút chỉ có biểu tượng (÷, ×, ✕) có tên đọc được khi rê chuột tới
[3] [Yes] CHK-phuong-an-kinh-doanh-646 → — · Verify ô bắt buộc ở Mục 1 có nhãn kèm dấu * (vd "Giá trị hợp đồng (VNĐ)*")

#5. Responsive cơ bản
##5.1. Cửa sổ Chrome hẹp
[3] [No] CHK-phuong-an-kinh-doanh-647 → NFR-phuong-an-kinh-doanh-002 · Verify thu hẹp cửa sổ trình duyệt thì biểu đồ dòng tiền co giãn theo bề rộng khung, nhãn trục và chú thích không chồng nhau
[3] [No] CHK-phuong-an-kinh-doanh-648 → NFR-phuong-an-kinh-doanh-002 · Verify thu hẹp cửa sổ thì biểu đồ và bảng tóm tắt chi phí tự xuống dòng, không tràn khỏi khung
[3] [No] CHK-phuong-an-kinh-doanh-649 → NFR-phuong-an-kinh-doanh-003 · Verify thu hẹp cửa sổ thì bảng Nghiệm thu và bảng Mốc kế hoạch cuộn ngang, không vỡ bố cục
[3] [No] CHK-phuong-an-kinh-doanh-650 → — · Verify thu hẹp cửa sổ thì P-04 vẫn hiển thị đủ nút "Huỷ", "Từ chối", "Duyệt"

#6. Thời điểm "hôm nay" theo giờ Việt Nam
##6.1. Đếm ngày lịch Asia/Ho_Chi_Minh
[2] [No] CHK-phuong-an-kinh-doanh-651 → NFR-phuong-an-kinh-doanh-005 · Verify lúc 06:30 sáng giờ Việt Nam, khung PAKD, dòng thông báo và cột "Hạn lập PAKD" hiển thị cùng số ngày còn lại cho cùng dự án
[3] [No] CHK-phuong-an-kinh-doanh-652 → NFR-phuong-an-kinh-doanh-005 · Verify gửi PAKD lúc 00:30 giờ Việt Nam thì ngày nộp ghi theo ngày lịch Việt Nam

#7. Edge cases
##7.1. Back, refresh, mất mạng
[2] [Yes] CHK-phuong-an-kinh-doanh-653 → FR-phuong-an-kinh-doanh-002 · Verify đang nhập dở khung PAKD (chưa Lưu nháp), bấm Back trình duyệt, mở lại dự án thì khung hiển thị nội dung đã lưu gần nhất
[2] [Yes] CHK-phuong-an-kinh-doanh-654 → FR-phuong-an-kinh-doanh-002 · Verify đang nhập dở khung PAKD, tải lại trang (F5) thì khung hiển thị nội dung đã lưu gần nhất
[2] [No] CHK-phuong-an-kinh-doanh-655 → E-phuong-an-kinh-doanh-020 · Verify ngắt mạng, bấm Lưu nháp thì hiện "Thao tác chưa thực hiện được, vui lòng thử lại"
[3] [Yes] CHK-phuong-an-kinh-doanh-656 → FR-phuong-an-kinh-doanh-019 · Verify dán "02/2027" vào ô tháng thì ô nhận giá trị "02/2027"

#8. Lưu giữ và nhật ký tra soát
##8.1. Lưu giữ vĩnh viễn
[1] [No] CHK-phuong-an-kinh-doanh-657 → NFR-phuong-an-kinh-doanh-008 · Verify dự án đã Kết thúc vẫn tra được đủ phiên bản, ý kiến, bản chụp lúc nộp và lịch sử PAKD

##8.2. Nhật ký tra soát (không có màn xem)
[2] [No] CHK-phuong-an-kinh-doanh-658 → NFR-phuong-an-kinh-doanh-013, E-phuong-an-kinh-doanh-018 · Verify thao tác PAKD bị từ chối vì không đủ quyền được ghi nhận tra soát với người, thời điểm, dự án, thao tác
[2] [No] CHK-phuong-an-kinh-doanh-659 → NFR-phuong-an-kinh-doanh-013, E-phuong-an-kinh-doanh-019 · Verify thao tác bị từ chối vì dữ liệu vừa đổi được ghi nhận tra soát
[2] [No] CHK-phuong-an-kinh-doanh-660 → NFR-phuong-an-kinh-doanh-013, E-phuong-an-kinh-doanh-020 · Verify lần ghi không trọn vẹn được ghi nhận tra soát với người, thời điểm, dự án, thao tác
[3] [No] CHK-phuong-an-kinh-doanh-661 → NFR-phuong-an-kinh-doanh-013 · Verify lỗi của tác vụ xét hằng ngày được ghi nhận tra soát
[2] [No] CHK-phuong-an-kinh-doanh-662 → NFR-phuong-an-kinh-doanh-013 · Verify thao tác bị từ chối quyền không thêm dòng mới vào tab "Lịch sử" của dự án

#9. Ngưỡng cố định toàn công ty
##9.1. Ngưỡng 20% và 2%
[3] [Yes] CHK-phuong-an-kinh-doanh-663 → BR-phuong-an-kinh-doanh-039 · Verify 2 dự án thuộc 2 khối khác nhau cùng Biên lợi nhuận 19.9% đều hiển thị nhãn "! Dưới khung"
[3] [Yes] CHK-phuong-an-kinh-doanh-664 → BR-phuong-an-kinh-doanh-039 · Verify 2 dự án thuộc 2 khối khác nhau cùng lệch hợp đồng 2,5% đều hiển thị cảnh báo lệch
