#1. Nút Kết thúc dự án
##1.1. Hiển thị
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-683 → FR-quan-ly-du-an-kinh-doanh-035, BR-quan-ly-du-an-kinh-doanh-013 · Verify mỗi vai trò GĐK của khối, Kế toán thấy nút "Kết thúc dự án" trên dòng thông báo của dự án Đang thực hiện không có bản điều chỉnh chờ duyệt
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-684 → FR-quan-ly-du-an-kinh-doanh-035, BR-quan-ly-du-an-kinh-doanh-013 · Verify mỗi vai trò SM, AM không thấy nút "Kết thúc dự án"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-685 → FR-quan-ly-du-an-kinh-doanh-035, BR-quan-ly-du-an-kinh-doanh-013 · Verify dự án Đang thực hiện có bản điều chỉnh PAKD chờ Kế toán duyệt không có nút "Kết thúc dự án"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-686 → BR-quan-ly-du-an-kinh-doanh-013 · Verify dự án Chưa có PAKD không có nút "Kết thúc dự án" với GĐK
#2. Xác nhận kết thúc
##2.1. Hộp xác nhận
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-687 → FR-quan-ly-du-an-kinh-doanh-035, BR-quan-ly-du-an-kinh-doanh-013 · Verify bấm "Kết thúc dự án" hiện hộp hỏi "Kết thúc dự án "{tên}"" kèm dấu chấm hỏi
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-688 → FR-quan-ly-du-an-kinh-doanh-035 · Verify dự án không có bản điều chỉnh PAKD nháp, hộp xác nhận không có câu về bản điều chỉnh
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-689 → FR-quan-ly-du-an-kinh-doanh-035, BR-quan-ly-du-an-kinh-doanh-013 · Verify dự án còn bản điều chỉnh PAKD nháp, hộp xác nhận có thêm câu "Dự án còn bản điều chỉnh PAKD chưa gửi — bản này sẽ bị huỷ."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-690 → FR-quan-ly-du-an-kinh-doanh-035 · Verify dự án còn bản điều chỉnh PAKD bị từ chối chưa huỷ, hộp xác nhận có thêm câu "Dự án còn bản điều chỉnh PAKD chưa gửi — bản này sẽ bị huỷ."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-691 → E-quan-ly-du-an-kinh-doanh-025, FR-quan-ly-du-an-kinh-doanh-035 · Verify bấm Huỷ ở hộp xác nhận thì dự án giữ "Đang thực hiện"
#3. Kết thúc thành công
##3.1. Kết quả
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-692 → FR-quan-ly-du-an-kinh-doanh-035 · Verify đồng ý thì dự án chuyển sang "Kết thúc"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-693 → FR-quan-ly-du-an-kinh-doanh-035, BR-quan-ly-du-an-kinh-doanh-052, BR-quan-ly-du-an-kinh-doanh-036 · Verify tab Lịch sử có dòng "Kết thúc dự án" ghi chú "—", người thực hiện "{người dùng} ({vai trò})"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-694 → FR-quan-ly-du-an-kinh-doanh-035 · Verify sau khi kết thúc hiện thông báo "Đã kết thúc dự án"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-695 → FR-quan-ly-du-an-kinh-doanh-035, BR-quan-ly-du-an-kinh-doanh-014 · Verify kết thúc không làm thay đổi Version của dự án
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-696 → BR-quan-ly-du-an-kinh-doanh-013 · Verify kết thúc được dự án chưa ký HĐ (không kiểm điều kiện nghiệp vụ khác)
##3.2. Tự huỷ bản điều chỉnh PAKD
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-697 → FR-quan-ly-du-an-kinh-doanh-035 · Verify kết thúc dự án còn bản điều chỉnh nháp thì Phiên bản PAKD hiện bản PAKD đang áp dụng
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-698 → FR-quan-ly-du-an-kinh-doanh-035, BR-quan-ly-du-an-kinh-doanh-052 · Verify kết thúc dự án còn bản điều chỉnh nháp thì tab Lịch sử có dòng "Huỷ bản điều chỉnh PAKD (Kết thúc dự án)" ngay sau dòng "Kết thúc dự án"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-699 → BR-quan-ly-du-an-kinh-doanh-052 · Verify tài khoản AM không thấy dòng "Huỷ bản điều chỉnh PAKD (Kết thúc dự án)" trong tab Lịch sử
[2] [No] CHK-quan-ly-du-an-kinh-doanh-700 → FR-quan-ly-du-an-kinh-doanh-035, NFR-quan-ly-du-an-kinh-doanh-011 · Verify bản điều chỉnh bị tự huỷ vẫn được lưu lại, không xoá cứng
#4. Lỗi khi kết thúc
##4.1. Dữ liệu đã đổi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-701 → FR-quan-ly-du-an-kinh-doanh-035 · Verify SM gửi bản điều chỉnh PAKD trong lúc Kế toán đang mở hộp xác nhận, Kế toán đồng ý thì dự án không bị kết thúc
##4.2. Ghi không trọn vẹn
[1] [No] CHK-quan-ly-du-an-kinh-doanh-702 → FR-quan-ly-du-an-kinh-doanh-035, NFR-quan-ly-du-an-kinh-doanh-014 · Verify giả lập lỗi ghi giữa chừng khi kết thúc thì không có gì được ghi (dự án giữ "Đang thực hiện", bản điều chỉnh nháp không bị huỷ)
