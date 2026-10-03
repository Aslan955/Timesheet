#1. Mở popup P-03 Cập nhật ký hợp đồng
##1.1. Mở từ màn chi tiết
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-522 → FR-quan-ly-du-an-kinh-doanh-025 · Verify SM bấm "Cập nhật ký hợp đồng" ở khung Hợp đồng & tài liệu mở popup "Cập nhật ký hợp đồng"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-523 → FR-quan-ly-du-an-kinh-doanh-031 · Verify GĐK bấm "Xem / cập nhật hợp đồng" của dự án đã có HĐ mở P-03 hiện dữ liệu HĐ đã lưu
##1.2. Thông tin đầu popup
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-524 → FR-quan-ly-du-an-kinh-doanh-031 · Verify dòng phụ hiện "{Mã} — {Tên} · Giá trị đã khai báo (Doanh thu dự kiến): {X} VNĐ" với X là Doanh thu dự kiến
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-525 → BR-quan-ly-du-an-kinh-doanh-028, FR-quan-ly-du-an-kinh-doanh-031 · Verify dự án có PAKD đã duyệt: X bằng doanh thu của PAKD đã được Kế toán duyệt
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-526 → BR-quan-ly-du-an-kinh-doanh-028 · Verify dự án chưa có PAKD được duyệt, đang có bản PAKD đang lập: X bằng doanh thu của bản đang lập
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-527 → FR-quan-ly-du-an-kinh-doanh-031 · Verify dự án không có Doanh thu dự kiến: X hiện "—"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-528 → FR-quan-ly-du-an-kinh-doanh-031 · Verify dự án chưa có HĐ: Giá trị hợp đồng mặc định bằng Doanh thu dự kiến
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-529 → FR-quan-ly-du-an-kinh-doanh-031 · Verify dự án chưa có HĐ, không có Doanh thu dự kiến: Giá trị hợp đồng để trống
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-530 → FR-quan-ly-du-an-kinh-doanh-031 · Verify dự án chưa có HĐ: Thời hạn thực hiện Từ–Đến mặc định bằng thời gian dự án
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-531 → FR-quan-ly-du-an-kinh-doanh-033 · Verify dự án chưa có HĐ: chân popup hiện "Lưu sẽ chuyển dự án sang trạng thái "Đã ký""
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-532 → FR-quan-ly-du-an-kinh-doanh-033 · Verify dự án đã có HĐ: chân popup hiện "Cập nhật lần cuối bởi {người} lúc {thời gian}" với người, thời điểm của lần lưu gần nhất
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-533 → FR-quan-ly-du-an-kinh-doanh-033 · Verify dự án chưa có HĐ có nút "Lưu & xác nhận đã ký"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-534 → FR-quan-ly-du-an-kinh-doanh-033 · Verify dự án đã có HĐ có nút "Lưu thay đổi"
##1.3. Chế độ chỉ xem
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-535 → FR-quan-ly-du-an-kinh-doanh-048, BR-quan-ly-du-an-kinh-doanh-049 · Verify AM mở P-03 không có nút lưu, không có nút "Thêm phụ lục", không xoá được dòng phụ lục
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-536 → FR-quan-ly-du-an-kinh-doanh-048, BR-quan-ly-du-an-kinh-doanh-046 · Verify AM mở P-03 thấy dòng phụ chỉ "{Mã} — {Tên}"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-537 → FR-quan-ly-du-an-kinh-doanh-048, BR-quan-ly-du-an-kinh-doanh-046, NFR-quan-ly-du-an-kinh-doanh-010 · Verify AM mở P-03 không thấy bảng đối chiếu "Doanh thu dự kiến ↔ Giá trị hợp đồng", ô Lý do lệch
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-538 → FR-quan-ly-du-an-kinh-doanh-048, BR-quan-ly-du-an-kinh-doanh-039 · Verify AM mở P-03 bấm tên tệp HĐ vẫn mở xem được tệp
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-539 → FR-quan-ly-du-an-kinh-doanh-048, BR-quan-ly-du-an-kinh-doanh-029, FR-quan-ly-du-an-kinh-doanh-025 · Verify Kế toán bấm "Xem / cập nhật hợp đồng" ở dự án Kết thúc mở P-03 chỉ xem, không có nút lưu
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-540 → BR-quan-ly-du-an-kinh-doanh-049, BR-quan-ly-du-an-kinh-doanh-029 · Verify SM bấm "Cập nhật ký hợp đồng" ở dự án Từ chối mã mở P-03 chỉ xem, không có nút lưu
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-541 → BR-quan-ly-du-an-kinh-doanh-029, BR-quan-ly-du-an-kinh-doanh-049 · Verify GĐK lưu P-03 ở dự án Pending thành công, dự án chuyển "Đã ký"
#2. Nhập thông tin hợp đồng
##2.1. Ô nhập
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-542 → FR-quan-ly-du-an-kinh-doanh-031 · Verify gõ chữ cái vào ô Giá trị hợp đồng không được nhận
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-543 → BR-quan-ly-du-an-kinh-doanh-050 · Verify Giá trị hợp đồng 15 chữ số được chấp nhận
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-544 → E-quan-ly-du-an-kinh-doanh-040, FR-quan-ly-du-an-kinh-doanh-031 · Verify Giá trị hợp đồng 16 chữ số, bấm lưu hiện "Tối đa 15 chữ số" dưới ô
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-545 → FR-quan-ly-du-an-kinh-doanh-031 · Verify chọn ngày "Từ" là 10/03/2026 thì bộ chọn ngày "Đến" không cho chọn ngày 09/03/2026
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-546 → BR-quan-ly-du-an-kinh-doanh-050 · Verify Số hợp đồng dài 256 ký tự, bấm lưu hiện "Tối đa 255 ký tự" dưới ô
##2.2. Bảng đối chiếu và lý do lệch
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-547 → FR-quan-ly-du-an-kinh-doanh-031 · Verify bảng đối chiếu "Doanh thu dự kiến ↔ Giá trị hợp đồng" hiện chênh lệch bằng số kèm phần trăm
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-548 → FR-quan-ly-du-an-kinh-doanh-031, BR-quan-ly-du-an-kinh-doanh-028 · Verify Doanh thu dự kiến trống thì bảng đối chiếu hiện "—"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-549 → BR-quan-ly-du-an-kinh-doanh-028 · Verify Doanh thu dự kiến bằng 0 thì bảng đối chiếu hiện "—"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-550 → BR-quan-ly-du-an-kinh-doanh-028 · Verify không có Doanh thu dự kiến, Giá trị HĐ bất kỳ, để trống lý do lệch thì lưu được
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-551 → E-quan-ly-du-an-kinh-doanh-017, BR-quan-ly-du-an-kinh-doanh-028 · Verify Doanh thu dự kiến 100.000.000, Giá trị HĐ 103.000.000 (lệch 3%), lý do trống, bấm lưu hiện "Giá trị hợp đồng khác giá trị đã khai báo — bắt buộc nhập lý do"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-552 → E-quan-ly-du-an-kinh-doanh-017 · Verify lệch quá 2% có lý do trống thì bảng đối chiếu hiện "Lệch"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-553 → BR-quan-ly-du-an-kinh-doanh-028 · Verify Doanh thu dự kiến 100.000.000, Giá trị HĐ 97.000.000 (thấp hơn 3%), lý do trống, bấm lưu hiện lỗi bắt buộc nhập lý do
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-554 → BR-quan-ly-du-an-kinh-doanh-028 · Verify Doanh thu dự kiến 100.000.000, Giá trị HĐ 102.000.000 (lệch đúng 2%), lý do trống thì lưu được
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-555 → BR-quan-ly-du-an-kinh-doanh-028 · Verify Doanh thu dự kiến 100.000.000, Giá trị HĐ 102.000.001 (lệch hơn 2% trên giá trị chưa làm tròn), lý do trống, bấm lưu hiện lỗi bắt buộc nhập lý do
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-556 → FR-quan-ly-du-an-kinh-doanh-031, BR-quan-ly-du-an-kinh-doanh-028 · Verify lệch 1% thì bảng đối chiếu hiện "Lệch 1,0%" màu trung tính
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-557 → BR-quan-ly-du-an-kinh-doanh-028 · Verify lệch 1%, ô lý do mở cho nhập, để trống vẫn lưu được
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-558 → E-quan-ly-du-an-kinh-doanh-017 · Verify lệch quá 2%, lý do chỉ gồm khoảng trắng, bấm lưu hiện lỗi bắt buộc nhập lý do
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-559 → BR-quan-ly-du-an-kinh-doanh-050 · Verify Lý do lệch dài 1.001 ký tự, bấm lưu hiện "Tối đa {n} ký tự" với n là 1.000
#3. Kiểm tra dữ liệu P-03
##3.1. Thông tin bắt buộc
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-560 → E-quan-ly-du-an-kinh-doanh-012, BR-quan-ly-du-an-kinh-doanh-028 · Verify bỏ trống Số hợp đồng, bấm lưu hiện "Nhập số hợp đồng" dưới ô
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-561 → E-quan-ly-du-an-kinh-doanh-013, BR-quan-ly-du-an-kinh-doanh-028 · Verify chưa chọn Ngày ký, bấm lưu hiện "Chọn ngày ký"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-562 → E-quan-ly-du-an-kinh-doanh-014, BR-quan-ly-du-an-kinh-doanh-028 · Verify bỏ trống Giá trị hợp đồng, bấm lưu hiện "Nhập giá trị hợp đồng"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-563 → E-quan-ly-du-an-kinh-doanh-014, BR-quan-ly-du-an-kinh-doanh-028 · Verify Giá trị hợp đồng bằng 0, bấm lưu hiện "Nhập giá trị hợp đồng"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-564 → E-quan-ly-du-an-kinh-doanh-015, BR-quan-ly-du-an-kinh-doanh-028 · Verify bỏ trống ngày "Từ" của Thời hạn thực hiện, bấm lưu hiện "Chọn thời hạn thực hiện"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-565 → E-quan-ly-du-an-kinh-doanh-015 · Verify bỏ trống ngày "Đến" của Thời hạn thực hiện, bấm lưu hiện "Chọn thời hạn thực hiện"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-566 → E-quan-ly-du-an-kinh-doanh-016, BR-quan-ly-du-an-kinh-doanh-028 · Verify nhập tay ngày "Đến" trước ngày "Từ", bấm lưu hiện "Ngày kết thúc phải sau ngày bắt đầu"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-567 → BR-quan-ly-du-an-kinh-doanh-028 · Verify ngày "Đến" bằng ngày "Từ" được chấp nhận, lưu thành công
##3.2. Dải lỗi và thời điểm hiện lỗi
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-568 → E-quan-ly-du-an-kinh-doanh-019 · Verify bỏ trống Số hợp đồng, Ngày ký, bấm lưu hiện dải đỏ "Còn 2 mục chưa hợp lệ: Nhập số hợp đồng; Chọn ngày ký."
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-569 → E-quan-ly-du-an-kinh-doanh-019 · Verify bấm lưu khi còn lỗi thì dự án giữ "Chưa ký"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-570 → BR-quan-ly-du-an-kinh-doanh-027, FR-quan-ly-du-an-kinh-doanh-031 · Verify mở P-03, chưa bấm lưu thì không hiện lỗi nào dù ô bắt buộc trống
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-571 → BR-quan-ly-du-an-kinh-doanh-027 · Verify sau lần bấm lưu đầu, nhập Số hợp đồng thì lỗi "Nhập số hợp đồng" biến mất ngay
#4. Phụ lục điều chỉnh và tệp
##4.1. Phụ lục
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-572 → FR-quan-ly-du-an-kinh-doanh-032 · Verify chưa có phụ lục thì hiện "Chưa có phụ lục điều chỉnh — bấm "Thêm phụ lục" khi có."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-573 → FR-quan-ly-du-an-kinh-doanh-032 · Verify bấm "Thêm phụ lục" thêm 1 dòng có đủ STT, Số phụ lục *, Ngày ký *, Nội dung điều chỉnh, Cập nhật file phụ lục, nút xoá dòng
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-574 → FR-quan-ly-du-an-kinh-doanh-032 · Verify tiêu đề bảng hiện "Phụ lục điều chỉnh (2)" khi có 2 dòng phụ lục
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-575 → FR-quan-ly-du-an-kinh-doanh-032 · Verify bấm thùng rác ở dòng phụ lục bỏ dòng đó khỏi bảng
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-576 → E-quan-ly-du-an-kinh-doanh-018, BR-quan-ly-du-an-kinh-doanh-028 · Verify dòng phụ lục thứ 1 thiếu Số phụ lục, bấm lưu hiện "Phụ lục dòng 1: nhập Số phụ lục và Ngày ký"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-577 → E-quan-ly-du-an-kinh-doanh-018 · Verify dòng phụ lục thứ 2 thiếu Ngày ký, bấm lưu hiện "Phụ lục dòng 2: nhập Số phụ lục và Ngày ký"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-578 → E-quan-ly-du-an-kinh-doanh-018 · Verify dòng phụ lục lỗi có nền đỏ nhạt
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-579 → E-quan-ly-du-an-kinh-doanh-018 · Verify xoá dòng phụ lục đang lỗi, bấm lưu thì lưu thành công
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-580 → BR-quan-ly-du-an-kinh-doanh-050, FR-quan-ly-du-an-kinh-doanh-032 · Verify Số phụ lục dài 256 ký tự, bấm lưu hiện "Tối đa 255 ký tự"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-581 → BR-quan-ly-du-an-kinh-doanh-050 · Verify Nội dung điều chỉnh dài 1.001 ký tự, bấm lưu hiện "Tối đa {n} ký tự" với n là 1.000
##4.2. Tệp hợp đồng và tệp phụ lục
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-582 → FR-quan-ly-du-an-kinh-doanh-031 · Verify chọn nhiều tệp ở ô Tệp tài liệu thì các tệp hiện trong danh sách tệp HĐ
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-583 → BR-quan-ly-du-an-kinh-doanh-051, FR-quan-ly-du-an-kinh-doanh-031 · Verify chọn tệp HĐ lớn hơn 20 MB bị loại kèm câu "Tệp "{tên}" vượt 20 MB"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-584 → BR-quan-ly-du-an-kinh-doanh-051, FR-quan-ly-du-an-kinh-doanh-032 · Verify chọn tệp phụ lục .zip bị loại kèm câu báo không đúng định dạng
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-585 → BR-quan-ly-du-an-kinh-doanh-051 · Verify gỡ tệp HĐ hiện hộp hỏi xác nhận "Gỡ tệp "{tên}"" kèm dấu chấm hỏi
#5. Lưu hợp đồng
##5.1. Lưu lần đầu
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-586 → FR-quan-ly-du-an-kinh-doanh-033, BR-quan-ly-du-an-kinh-doanh-029 · Verify SM nhập hợp lệ, bấm "Lưu & xác nhận đã ký" thì dự án chuyển sang "Đã ký"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-587 → FR-quan-ly-du-an-kinh-doanh-033, BR-quan-ly-du-an-kinh-doanh-014 · Verify lưu HĐ lần đầu thì Version dự án tăng thêm 1
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-588 → FR-quan-ly-du-an-kinh-doanh-033, BR-quan-ly-du-an-kinh-doanh-052, BR-quan-ly-du-an-kinh-doanh-036 · Verify tab Lịch sử có dòng "Ký hợp đồng" ghi chú "HĐ {số} · {n} phụ lục · Version {n+1}", người thực hiện "{người dùng}"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-589 → FR-quan-ly-du-an-kinh-doanh-033 · Verify sau lần lưu đầu hiện thông báo "Đã xác nhận ký hợp đồng {số} — {mã}"
##5.2. Cập nhật HĐ đã có
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-590 → FR-quan-ly-du-an-kinh-doanh-033 · Verify sửa Giá trị HĐ đã có, bấm "Lưu thay đổi" thì tab Lịch sử có dòng "Cập nhật hợp đồng"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-591 → FR-quan-ly-du-an-kinh-doanh-033 · Verify sau khi cập nhật HĐ hiện thông báo "Đã cập nhật hợp đồng {số} — {mã}"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-592 → BR-quan-ly-du-an-kinh-doanh-029 · Verify P-03 không có thao tác bỏ ký, dự án đã ký không quay về "Chưa ký" qua P-03
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-593 → BR-quan-ly-du-an-kinh-doanh-029 · Verify dự án đã ký, SM mở khung PAKD thì lựa chọn "Chưa ký" bị khoá
#6. Đưa thông tin hợp đồng sang PAKD
##6.1. Theo tình trạng PAKD tại lúc lưu
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-594 → BR-quan-ly-du-an-kinh-doanh-029, FR-quan-ly-du-an-kinh-doanh-033 · Verify dự án đã có PAKD được duyệt, chưa có bản điều chỉnh đang mở: lưu HĐ sinh bản điều chỉnh PAKD chờ Kế toán duyệt (Phiên bản PAKD hiện bản mới "chờ CFO")
[2] [No] CHK-quan-ly-du-an-kinh-doanh-595 → BR-quan-ly-du-an-kinh-doanh-029 · Verify bản điều chỉnh sinh từ HĐ vào "Chờ duyệt" kể cả khi không đạt kiểm tra gửi, P-04 liệt kê các điểm chưa đạt
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-596 → BR-quan-ly-du-an-kinh-doanh-029 · Verify dự án có bản PAKD lập lần đầu đang chờ duyệt: lưu HĐ thì P-04 của bản đó hiện nhãn "Cập nhật theo hợp đồng sau khi nộp" kèm so sánh
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-597 → BR-quan-ly-du-an-kinh-doanh-029 · Verify dự án có bản PAKD lập lần đầu đang chờ duyệt: lưu HĐ không sinh thêm phiên bản PAKD
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-598 → BR-quan-ly-du-an-kinh-doanh-029 · Verify dự án chưa có PAKD được duyệt, đang có bản PAKD đang lập: lưu HĐ ghi thông tin HĐ vào Mục 1 của bản đang lập
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-599 → BR-quan-ly-du-an-kinh-doanh-029, FR-quan-ly-du-an-kinh-doanh-033 · Verify dự án có bản điều chỉnh đang chờ Kế toán duyệt: lưu HĐ cập nhật Mục 1 của bản đó, P-04 gắn nhãn "Cập nhật theo hợp đồng sau khi nộp"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-600 → BR-quan-ly-du-an-kinh-doanh-029 · Verify dự án có bản điều chỉnh nháp: lưu HĐ cập nhật Mục 1 của bản nháp, các mục khác SM đang soạn giữ nguyên
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-601 → BR-quan-ly-du-an-kinh-doanh-029 · Verify dự án có bản điều chỉnh bị từ chối chưa huỷ: lưu HĐ không sinh bản điều chỉnh thứ hai
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-602 → BR-quan-ly-du-an-kinh-doanh-029, FR-quan-ly-du-an-kinh-doanh-033 · Verify dự án chưa có bản PAKD nào: lưu HĐ chỉ lưu HĐ, Phiên bản PAKD vẫn "—"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-603 → BR-quan-ly-du-an-kinh-doanh-029 · Verify dự án chưa có PAKD đã lưu HĐ, SM mở khung PAKD lập lần đầu thì Mục 1 nạp sẵn thông tin HĐ
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-604 → BR-quan-ly-du-an-kinh-doanh-029 · Verify cập nhật HĐ chỉ đổi phụ lục (không đổi tình trạng, số HĐ, ngày ký, giá trị, tháng bắt đầu / kết thúc) thì không sinh bản điều chỉnh PAKD
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-605 → BR-quan-ly-du-an-kinh-doanh-029, BR-quan-ly-du-an-kinh-doanh-052 · Verify các nhánh cập nhật Mục 1 có trường khác ghi lịch sử "Cập nhật PAKD theo hợp đồng"
#7. Đóng popup và lỗi khi lưu
##7.1. Đóng không lưu
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-606 → FR-quan-ly-du-an-kinh-doanh-031 · Verify bấm "Huỷ" thì P-03 đóng mà không lưu thay đổi
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-607 → FR-quan-ly-du-an-kinh-doanh-031 · Verify bấm vào nền ngoài P-03 thì popup đóng mà không lưu thay đổi
##7.2. Dữ liệu đã đổi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-608 → FR-quan-ly-du-an-kinh-doanh-033 · Verify Kế toán kết thúc dự án trong lúc SM đang mở P-03, SM bấm lưu thì HĐ không được lưu
[2] [No] CHK-quan-ly-du-an-kinh-doanh-609 → E-quan-ly-du-an-kinh-doanh-030 · Verify sau lỗi dữ liệu đã đổi ở P-03, popup nạp lại, ô Lý do lệch giữ nội dung đang nhập
[2] [No] CHK-quan-ly-du-an-kinh-doanh-610 → FR-quan-ly-du-an-kinh-doanh-033 · Verify tài khoản bị đổi khỏi vai trò SM trong lúc mở P-03, bấm lưu thì hiện "Bạn không có quyền thực hiện thao tác này."
##7.3. Ghi không trọn vẹn
[1] [No] CHK-quan-ly-du-an-kinh-doanh-611 → FR-quan-ly-du-an-kinh-doanh-033, NFR-quan-ly-du-an-kinh-doanh-014, E-quan-ly-du-an-kinh-doanh-037 · Verify giả lập lỗi khi ghi phần sang PAKD thì HĐ, Version, PAKD đều không đổi
[2] [No] CHK-quan-ly-du-an-kinh-doanh-612 → E-quan-ly-du-an-kinh-doanh-037 · Verify sau lỗi ghi không trọn vẹn, P-03 giữ dữ liệu đang nhập
