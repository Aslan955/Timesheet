#1. Cảnh báo đỏ quá tháng dự kiến ký
##1.1. Bật cảnh báo
[1] [No] CHK-phuong-an-kinh-doanh-617 → FR-phuong-an-kinh-doanh-040, BR-phuong-an-kinh-doanh-043 · Verify PAKD đang áp dụng Chưa ký dự kiến ký 05/2027, dự án chưa có hợp đồng, sau lần xét ngày 01/06/2027 thì danh sách hiện chữ đỏ "Quá tháng dự kiến ký 05/2027" dưới tên dự án
[1] [No] CHK-phuong-an-kinh-doanh-618 → FR-phuong-an-kinh-doanh-040, FR-phuong-an-kinh-doanh-036 · Verify dự án quá tháng dự kiến ký chưa có hợp đồng thì dòng thông báo bước của màn chi tiết có chữ đỏ "Quá tháng dự kiến ký 05/2027"
[1] [No] CHK-phuong-an-kinh-doanh-619 → FR-phuong-an-kinh-doanh-040, NFR-phuong-an-kinh-doanh-007 · Verify AM xem danh sách thấy chữ đỏ "Quá tháng dự kiến ký 05/2027" dưới tên dự án, không có số tiền nào
[2] [No] CHK-phuong-an-kinh-doanh-620 → FR-phuong-an-kinh-doanh-040 · Verify AM mở màn chi tiết dự án quá tháng dự kiến ký thấy chữ đỏ "Quá tháng dự kiến ký 05/2027" trên dòng thông báo
[2] [No] CHK-phuong-an-kinh-doanh-621 → BR-phuong-an-kinh-doanh-043 · Verify ngày 31/05/2027 (ngày cuối tháng dự kiến ký) thì dự án chưa có cảnh báo "Quá tháng dự kiến ký"
[2] [No] CHK-phuong-an-kinh-doanh-622 → BR-phuong-an-kinh-doanh-043 · Verify PAKD Chưa ký chưa có Thời điểm dự kiến ký thì dự án không có cảnh báo "Quá tháng dự kiến ký"
[2] [No] CHK-phuong-an-kinh-doanh-623 → NFR-phuong-an-kinh-doanh-012 · Verify tác vụ xét hằng ngày lỡ 2 ngày, lần chạy sau tự bật cảnh báo cho dự án đã quá tháng dự kiến ký
[3] [No] CHK-phuong-an-kinh-doanh-624 → NFR-phuong-an-kinh-doanh-012 · Verify tác vụ xét hằng ngày lỗi thì bộ phận vận hành nhận cảnh báo

##1.2. Gỡ cảnh báo
[1] [Yes] CHK-phuong-an-kinh-doanh-625 → FR-phuong-an-kinh-doanh-040, BR-phuong-an-kinh-doanh-043 · Verify dự án đang có chữ đỏ "Quá tháng dự kiến ký 05/2027", lưu P-03 thì chữ đỏ biến mất ngay ở danh sách
[2] [Yes] CHK-phuong-an-kinh-doanh-626 → FR-phuong-an-kinh-doanh-040 · Verify sau lưu P-03, dòng thông báo bước của màn chi tiết không còn chữ "Quá tháng dự kiến ký"
