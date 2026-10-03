#1. Nút Import thực tế
##1.1. Theo vai trò và trạng thái
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-757 → FR-quan-ly-du-an-kinh-doanh-045, BR-quan-ly-du-an-kinh-doanh-047 · Verify Kế toán thấy nút "Import thực tế" ở khối Số liệu dự án theo tháng của dự án Đang thực hiện
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-758 → FR-quan-ly-du-an-kinh-doanh-045 · Verify mỗi vai trò AM, SM, GĐK không thấy nút "Import thực tế"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-759 → FR-quan-ly-du-an-kinh-doanh-045, BR-quan-ly-du-an-kinh-doanh-047 · Verify dự án Kết thúc không có nút "Import thực tế" với Kế toán
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-760 → FR-quan-ly-du-an-kinh-doanh-045, BR-quan-ly-du-an-kinh-doanh-047 · Verify dự án Pending có nút "Import thực tế", import được
#2. Popup Import 3 bước
##2.1. Tải file mẫu và chọn file
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-761 → FR-quan-ly-du-an-kinh-doanh-045 · Verify bấm "Import thực tế" mở popup "Import số thực tế theo tháng — {mã} · {tên}" có 3 bước
[2] [No] CHK-quan-ly-du-an-kinh-doanh-762 → FR-quan-ly-du-an-kinh-doanh-045 · Verify file mẫu tải ở bước "Tải file mẫu" có các tháng theo thời gian dự án kèm số hiện có
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-763 → FR-quan-ly-du-an-kinh-doanh-045 · Verify chọn file đã điền ở bước "Chọn file đã điền" hiện phần xem trước
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-764 → FR-quan-ly-du-an-kinh-doanh-045 · Verify kéo thả file đã điền vào bước "Chọn file đã điền" hiện phần xem trước
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-765 → FR-quan-ly-du-an-kinh-doanh-045 · Verify phần xem trước hiện số tháng mới, số tháng cập nhật
##2.2. Giới hạn tệp
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-766 → NFR-quan-ly-du-an-kinh-doanh-009 · Verify tệp đúng 20 MB, đúng 50.000 dòng dữ liệu được nhận vào xem trước
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-767 → E-quan-ly-du-an-kinh-doanh-044, NFR-quan-ly-du-an-kinh-doanh-009, FR-quan-ly-du-an-kinh-doanh-045 · Verify tệp 20 MB + 1 byte hiện "File vượt giới hạn cho phép (tối đa 20 MB và 50.000 dòng dữ liệu)."
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-768 → E-quan-ly-du-an-kinh-doanh-044, NFR-quan-ly-du-an-kinh-doanh-009 · Verify tệp có 50.001 dòng dữ liệu hiện "File vượt giới hạn cho phép (tối đa 20 MB và 50.000 dòng dữ liệu)."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-769 → E-quan-ly-du-an-kinh-doanh-044 · Verify tệp vượt giới hạn thì nút "Import thực tế" bị khoá
#3. Kiểm tra tệp import
##3.1. Tệp không đọc được
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-770 → E-quan-ly-du-an-kinh-doanh-031 · Verify chọn tệp .pdf hiện "Chỉ hỗ trợ file .xlsx, .xls, .csv."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-771 → E-quan-ly-du-an-kinh-doanh-031 · Verify chọn tệp .xlsx đặt mật khẩu hiện câu báo bắt đầu "Không đọc được file."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-772 → E-quan-ly-du-an-kinh-doanh-031 · Verify tệp không đọc được thì nút "Import thực tế" bị khoá
##3.2. Sai cấu trúc
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-773 → E-quan-ly-du-an-kinh-doanh-032 · Verify tệp không có dòng tiêu đề "Chỉ tiêu" hiện "Không tìm thấy dòng tiêu đề có ô "Chỉ tiêu". Hãy dùng file mẫu."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-774 → E-quan-ly-du-an-kinh-doanh-032 · Verify dòng tiêu đề không có cột tháng hiện "Dòng tiêu đề không có cột tháng nào (vd 12/2026)."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-775 → E-quan-ly-du-an-kinh-doanh-032 · Verify tệp không có dòng chỉ tiêu hiện "File không có dòng chỉ tiêu nào."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-776 → E-quan-ly-du-an-kinh-doanh-033 · Verify ô tiêu đề tháng "13/2026" hiện "Cột {cột}: "13/2026" không phải tháng hợp lệ (dùng MM/YYYY)."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-777 → E-quan-ly-du-an-kinh-doanh-033 · Verify tháng 03/2026 xuất hiện ở 2 cột hiện "Tháng 03/2026 bị trùng (cột {a} và {b})."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-778 → E-quan-ly-du-an-kinh-doanh-034 · Verify ô số liệu "abc" hiện "Ô {ô} ({MM/YYYY}): "abc" không phải số."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-779 → E-quan-ly-du-an-kinh-doanh-035 · Verify chỉ tiêu "Doanh thu thực tế" xuất hiện ở 2 dòng hiện "Chỉ tiêu "Doanh thu thực tế" bị trùng với dòng {n}."
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-780 → FR-quan-ly-du-an-kinh-doanh-045, E-quan-ly-du-an-kinh-doanh-032, E-quan-ly-du-an-kinh-doanh-033, E-quan-ly-du-an-kinh-doanh-034, E-quan-ly-du-an-kinh-doanh-035 · Verify tệp còn lỗi thì nút "Import thực tế" bị khoá kèm chú thích "Sửa hết lỗi trong file trước khi import"
##3.3. Cảnh báo không chặn
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-781 → E-quan-ly-du-an-kinh-doanh-036 · Verify tệp có tháng ngoài thời gian dự án hiện cảnh báo "Tháng {MM/YYYY} nằm ngoài thời gian dự án."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-782 → E-quan-ly-du-an-kinh-doanh-036 · Verify tệp có giá trị âm hiện cảnh báo "Ô {ô} ({MM/YYYY}) có giá trị âm ({n})."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-783 → E-quan-ly-du-an-kinh-doanh-036 · Verify tệp thiếu dòng "Khối lượng công việc" hiện cảnh báo "Thiếu dòng "Khối lượng công việc" — giữ nguyên số hiện có."
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-784 → E-quan-ly-du-an-kinh-doanh-036, FR-quan-ly-du-an-kinh-doanh-045 · Verify tệp có dòng "Thu thực tế" hiện cảnh báo "Bỏ qua dòng "Thu thực tế" — Thu / Chi thực tế chỉ nhận từ Import sổ kế toán."
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-785 → E-quan-ly-du-an-kinh-doanh-036 · Verify tệp có dòng "Ghi chú" không phải chỉ tiêu hiện cảnh báo "Bỏ qua dòng "Ghi chú" — không phải chỉ tiêu."
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-786 → E-quan-ly-du-an-kinh-doanh-036 · Verify tệp chỉ có cảnh báo, không có lỗi thì nút "Import thực tế" bấm được
#4. Import thành công
##4.1. Ghi số thực tế
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-787 → FR-quan-ly-du-an-kinh-doanh-045, BR-quan-ly-du-an-kinh-doanh-047 · Verify import tệp có Doanh thu thực tế, KLCV tháng 03/2026 thì tab Thực tế hiện đúng số của tháng 03/2026
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-788 → FR-quan-ly-du-an-kinh-doanh-045 · Verify tháng 03/2026 đã có số, import tệp có tháng 03/2026 thì số của tháng 03/2026 được thay bằng số trong tệp
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-789 → FR-quan-ly-du-an-kinh-doanh-045 · Verify tháng 02/2026 đã có số, import tệp không có tháng 02/2026 thì số tháng 02/2026 giữ nguyên
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-790 → FR-quan-ly-du-an-kinh-doanh-045 · Verify popup chỉ có một chế độ "Gộp theo tháng", không có lựa chọn chế độ khác
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-791 → FR-quan-ly-du-an-kinh-doanh-045 · Verify ô trống trong tệp không ghi 0, tháng đó giữ "chưa có số"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-792 → FR-quan-ly-du-an-kinh-doanh-045 · Verify ô có số 0 gõ tường minh được ghi thành 0
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-793 → FR-quan-ly-du-an-kinh-doanh-045 · Verify tệp thiếu dòng KLCV thì số KLCV đã có giữ nguyên sau khi import
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-794 → BR-quan-ly-du-an-kinh-doanh-047, FR-quan-ly-du-an-kinh-doanh-045 · Verify import tệp có dòng Thu thực tế thì số Thu thực tế đã có giữ nguyên
##4.2. Lịch sử và thông báo
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-795 → FR-quan-ly-du-an-kinh-doanh-045, BR-quan-ly-du-an-kinh-doanh-014 · Verify import không làm thay đổi Version của dự án
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-796 → FR-quan-ly-du-an-kinh-doanh-045, BR-quan-ly-du-an-kinh-doanh-052, BR-quan-ly-du-an-kinh-doanh-036 · Verify tab Lịch sử có dòng "Import thực tế Doanh thu / KLCV" ghi chú "{n} tháng: MM/YYYY, …", người thực hiện "{người dùng} ({vai trò})"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-797 → FR-quan-ly-du-an-kinh-doanh-045 · Verify sau khi import hiện thông báo "Đã import thực tế {n} tháng"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-798 → FR-quan-ly-du-an-kinh-doanh-045 · Verify chân khung Số liệu theo tháng hiện "Import từ {tệp} bởi {người} lúc {thời gian}" của lần import vừa xong
[2] [No] CHK-quan-ly-du-an-kinh-doanh-799 → NFR-quan-ly-du-an-kinh-doanh-011 · Verify số tháng bị Import thực tế thay, tệp import gốc được lưu lại
##4.3. Huỷ và chọn lại
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-800 → FR-quan-ly-du-an-kinh-doanh-045 · Verify bấm "Huỷ" ở popup thì đóng popup, số thực tế không đổi
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-801 → FR-quan-ly-du-an-kinh-doanh-045 · Verify bấm "Chọn lại" cho chọn file khác, chưa ghi số
#5. Lỗi khi ghi import
##5.1. Dữ liệu đã đổi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-802 → FR-quan-ly-du-an-kinh-doanh-045 · Verify GĐK kết thúc dự án trong lúc Kế toán đang mở popup, Kế toán bấm "Import thực tế" thì không tháng nào được ghi
##5.2. Ghi không trọn vẹn
[1] [No] CHK-quan-ly-du-an-kinh-doanh-803 → FR-quan-ly-du-an-kinh-doanh-045, NFR-quan-ly-du-an-kinh-doanh-014 · Verify giả lập lỗi ghi giữa chừng khi import 3 tháng thì không tháng nào được ghi
[2] [No] CHK-quan-ly-du-an-kinh-doanh-804 → E-quan-ly-du-an-kinh-doanh-037 · Verify sau lỗi ghi không trọn vẹn, popup giữ tệp đã chọn
[2] [No] CHK-quan-ly-du-an-kinh-doanh-805 → NFR-quan-ly-du-an-kinh-doanh-016 · Verify lỗi import thực tế được ghi nhận tra soát đủ người, thời điểm, dự án, tệp, lỗi
