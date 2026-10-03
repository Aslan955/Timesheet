#1. Điều kiện chuyển Pending
##1.1. Dự án quá hạn
[1] [No] CHK-quan-ly-du-an-kinh-doanh-721 → FR-quan-ly-du-an-kinh-doanh-036, BR-quan-ly-du-an-kinh-doanh-011 · Verify dự án Chưa có PAKD có hạn lập PAKD nhỏ hơn hôm nay được tác vụ hằng ngày chuyển sang "Pending"
[1] [No] CHK-quan-ly-du-an-kinh-doanh-722 → BR-quan-ly-du-an-kinh-doanh-011 · Verify dự án PAKD chờ duyệt có hạn nhỏ hơn hôm nay được chuyển sang "Pending"
[1] [No] CHK-quan-ly-du-an-kinh-doanh-723 → BR-quan-ly-du-an-kinh-doanh-011 · Verify tác vụ chạy đúng ngày hạn không chuyển dự án Chưa có PAKD sang "Pending"
[1] [No] CHK-quan-ly-du-an-kinh-doanh-724 → BR-quan-ly-du-an-kinh-doanh-011, BR-quan-ly-du-an-kinh-doanh-005 · Verify dự án đã bị Kế toán từ chối PAKD, hạn gốc đã qua được chuyển sang "Pending"
[2] [No] CHK-quan-ly-du-an-kinh-doanh-725 → BR-quan-ly-du-an-kinh-doanh-011 · Verify dự án Đang thực hiện có hạn đã qua không bị chuyển "Pending"
[2] [No] CHK-quan-ly-du-an-kinh-doanh-726 → BR-quan-ly-du-an-kinh-doanh-011, BR-quan-ly-du-an-kinh-doanh-042 · Verify dự án ở mỗi trạng thái Chờ duyệt mã, Từ chối mã không bị chuyển "Pending"
[2] [No] CHK-quan-ly-du-an-kinh-doanh-727 → NFR-quan-ly-du-an-kinh-doanh-007 · Verify tác vụ chạy 00:30 giờ Việt Nam ngày D+1 chuyển "Pending" dự án có hạn ngày D
##1.2. Kiểm lại tại lúc chuyển
[1] [No] CHK-quan-ly-du-an-kinh-doanh-728 → FR-quan-ly-du-an-kinh-doanh-036, BR-quan-ly-du-an-kinh-doanh-011 · Verify dự án vừa được Kế toán duyệt PAKD trong lúc tác vụ đang chạy thì tác vụ bỏ qua dự án đó
#2. Kết quả chuyển Pending
##2.1. Ngày đóng và lịch sử
[1] [No] CHK-quan-ly-du-an-kinh-doanh-729 → FR-quan-ly-du-an-kinh-doanh-036, NFR-quan-ly-du-an-kinh-doanh-015 · Verify dự án hạn 10/03/2026 chuyển Pending có ngày đóng 11/03/2026 hiện ở cột Hạn lập PAKD
[1] [No] CHK-quan-ly-du-an-kinh-doanh-730 → FR-quan-ly-du-an-kinh-doanh-036, BR-quan-ly-du-an-kinh-doanh-052, BR-quan-ly-du-an-kinh-doanh-036 · Verify dự án đã có bản PAKD nộp chuyển Pending có lịch sử người thực hiện "Hệ thống", thao tác "Tự động chuyển Pending", ghi chú "Quá 30 ngày (hạn {dd/mm/yyyy}) PAKD chưa được Kế toán duyệt"
[2] [No] CHK-quan-ly-du-an-kinh-doanh-731 → FR-quan-ly-du-an-kinh-doanh-036 · Verify dự án chưa có PAKD chuyển Pending có lịch sử ghi chú "Quá 30 ngày (hạn {dd/mm/yyyy}) chưa có PAKD"
[2] [No] CHK-quan-ly-du-an-kinh-doanh-732 → BR-quan-ly-du-an-kinh-doanh-014 · Verify chuyển Pending không làm thay đổi Version của dự án
#3. Vận hành tác vụ hằng ngày
##3.1. Lỡ ngày, chạy lại, lỗi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-733 → FR-quan-ly-du-an-kinh-doanh-036, NFR-quan-ly-du-an-kinh-doanh-015 · Verify tác vụ không chạy 2 ngày, lần chạy sau chuyển mọi dự án đã quá hạn sang "Pending" với ngày đóng = hạn + 1
[1] [No] CHK-quan-ly-du-an-kinh-doanh-734 → FR-quan-ly-du-an-kinh-doanh-036, NFR-quan-ly-du-an-kinh-doanh-015 · Verify chạy lại tác vụ trong cùng ngày không tạo dòng lịch sử "Tự động chuyển Pending" thứ hai
[2] [No] CHK-quan-ly-du-an-kinh-doanh-735 → FR-quan-ly-du-an-kinh-doanh-036, NFR-quan-ly-du-an-kinh-doanh-015 · Verify tác vụ hoàn tất trước 06:00 giờ Việt Nam
[2] [No] CHK-quan-ly-du-an-kinh-doanh-736 → FR-quan-ly-du-an-kinh-doanh-036, NFR-quan-ly-du-an-kinh-doanh-015 · Verify giả lập tác vụ lỗi thì bộ phận vận hành nhận cảnh báo
[2] [No] CHK-quan-ly-du-an-kinh-doanh-737 → NFR-quan-ly-du-an-kinh-doanh-016 · Verify lỗi của tác vụ hằng ngày được ghi nhận tra soát
