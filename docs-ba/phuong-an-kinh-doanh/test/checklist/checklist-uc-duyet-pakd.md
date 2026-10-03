#1. Mở popup P-04 "Duyệt PAKD"
##1.1. Từ danh sách
[1] [Yes] CHK-phuong-an-kinh-doanh-354 → FR-phuong-an-kinh-doanh-035 · Verify Kế toán xem danh sách thấy link "Duyệt" ở cột "Thao tác" của dự án "PAKD chờ duyệt"
[4] [No] CHK-phuong-an-kinh-doanh-355 → FR-phuong-an-kinh-doanh-035 · Verify link "Duyệt" hiển thị chữ đỏ đậm
[1] [Yes] CHK-phuong-an-kinh-doanh-356 → FR-phuong-an-kinh-doanh-029 · Verify bấm link "Duyệt" mở P-04 ngay trên danh sách, không rời màn danh sách
[2] [Yes] CHK-phuong-an-kinh-doanh-357 → FR-phuong-an-kinh-doanh-035 · Verify SM xem danh sách thấy link "Xem" ở cột "Thao tác" của dự án "PAKD chờ duyệt"
[1] [Yes] CHK-phuong-an-kinh-doanh-358 → FR-phuong-an-kinh-doanh-029, BR-phuong-an-kinh-doanh-004 · Verify Kế toán mở P-04 được cho dự án thuộc khối bất kỳ

##1.2. Từ màn chi tiết
[1] [Yes] CHK-phuong-an-kinh-doanh-359 → FR-phuong-an-kinh-doanh-036 · Verify Kế toán mở dự án "PAKD chờ duyệt" thấy dòng thông báo "PAKD V1 đang chờ Kế toán (CFO) duyệt."
[1] [Yes] CHK-phuong-an-kinh-doanh-360 → FR-phuong-an-kinh-doanh-029 · Verify bấm nút "Duyệt / Từ chối PAKD" trên dòng thông báo mở P-04
[2] [Yes] CHK-phuong-an-kinh-doanh-361 → FR-phuong-an-kinh-doanh-029 · Verify dự án "Pending" đang có bản chờ, Kế toán thấy nút "Duyệt / Từ chối PAKD" trên dòng thông báo
[2] [Yes] CHK-phuong-an-kinh-doanh-362 → FR-phuong-an-kinh-doanh-036 · Verify SM mở dự án "PAKD chờ duyệt" thấy dòng thông báo "Đang chờ Kế toán (CFO) duyệt PAKD V1."
[1] [Yes] CHK-phuong-an-kinh-doanh-363 → FR-phuong-an-kinh-doanh-036, NFR-phuong-an-kinh-doanh-007 · Verify AM mở dự án "PAKD chờ duyệt" thấy dòng thông báo "Đang chờ Kế toán duyệt PAKD." không có số phiên bản
[1] [Yes] CHK-phuong-an-kinh-doanh-364 → FR-phuong-an-kinh-doanh-029, BR-phuong-an-kinh-doanh-004 · Verify SM mở dự án "PAKD chờ duyệt" không có link / nút duyệt
[1] [No] CHK-phuong-an-kinh-doanh-365 → BR-phuong-an-kinh-doanh-004, E-phuong-an-kinh-doanh-018 · Verify SM gửi yêu cầu ghi quyết định duyệt bằng đường ngoài giao diện thì bị từ chối "Bạn không có quyền thực hiện thao tác này."

#2. Nội dung P-04 dạng lần đầu
##2.1. Thông tin hiển thị
[2] [Yes] CHK-phuong-an-kinh-doanh-366 → FR-phuong-an-kinh-doanh-030 · Verify P-04 của phiên bản V1 có tiêu đề "CFO duyệt PAKD — V1"
[1] [Yes] CHK-phuong-an-kinh-doanh-367 → FR-phuong-an-kinh-doanh-030 · Verify P-04 lần đầu hiển thị đủ Dự án "{mã} — {tên}", Người nộp / ngày nộp, Doanh thu PAKD (VNĐ), Chi phí kế hoạch (VNĐ), LN gộp kế hoạch (VNĐ), Kế hoạch theo tháng
[1] [Yes] CHK-phuong-an-kinh-doanh-368 → FR-phuong-an-kinh-doanh-030 · Verify Doanh thu PAKD trên P-04 lấy từ nội dung PAKD đang chờ duyệt (dự án chưa có số liệu PAKD)
[2] [Yes] CHK-phuong-an-kinh-doanh-369 → FR-phuong-an-kinh-doanh-030 · Verify Doanh thu 1,000,000,000, Chi phí 700,000,000 thì LN gộp kế hoạch hiển thị "300,000,000 (30.0%)"
[2] [Yes] CHK-phuong-an-kinh-doanh-370 → FR-phuong-an-kinh-doanh-030 · Verify PAKD đang chờ sinh 6 tháng kế hoạch thì dòng Kế hoạch theo tháng hiển thị "6 tháng"
[2] [Yes] CHK-phuong-an-kinh-doanh-371 → FR-phuong-an-kinh-doanh-030 · Verify PAKD đang chờ không sinh tháng nào thì dòng Kế hoạch theo tháng hiển thị "Chưa import"
[2] [Yes] CHK-phuong-an-kinh-doanh-372 → FR-phuong-an-kinh-doanh-030 · Verify PAKD đang chờ không sinh tháng nào vẫn bấm Duyệt thành công
[3] [Yes] CHK-phuong-an-kinh-doanh-373 → FR-phuong-an-kinh-doanh-030 · Verify ô Ý kiến có gợi ý "Ý kiến phê duyệt / lý do từ chối"
[3] [Yes] CHK-phuong-an-kinh-doanh-374 → FR-phuong-an-kinh-doanh-030 · Verify P-04 lần đầu có chú thích "Kế toán (CFO) duyệt → PAKD được duyệt, dự án chuyển "Đang thực hiện". Từ chối → trả về GĐK lập phiên bản mới."
[3] [Yes] CHK-phuong-an-kinh-doanh-375 → FR-phuong-an-kinh-doanh-030 · Verify P-04 có đủ 3 nút "Huỷ", "Từ chối", "Duyệt"

##2.2. Cảnh báo lệch hợp đồng trên P-04
[1] [Yes] CHK-phuong-an-kinh-doanh-376 → FR-phuong-an-kinh-doanh-030, BR-phuong-an-kinh-doanh-018, E-phuong-an-kinh-doanh-015 · Verify dự án đã có hợp đồng lệch doanh thu bản đang chờ 5% thì P-04 hiện dòng "Giá trị HĐ hiện có {x} — lệch {z%} ⚠" trước khi bấm Duyệt
[2] [Yes] CHK-phuong-an-kinh-doanh-377 → FR-phuong-an-kinh-doanh-030 · Verify dự án có hợp đồng lệch đúng 2% thì P-04 không có dòng cảnh báo lệch
[2] [Yes] CHK-phuong-an-kinh-doanh-378 → FR-phuong-an-kinh-doanh-030 · Verify dự án chưa có hợp đồng thì P-04 không có dòng cảnh báo lệch
[2] [Yes] CHK-phuong-an-kinh-doanh-379 → FR-phuong-an-kinh-doanh-030, E-phuong-an-kinh-doanh-015 · Verify P-04 đang có dòng cảnh báo lệch vẫn bấm Duyệt thành công

##2.3. Điểm chưa đạt kiểm tra gửi
[1] [Yes] CHK-phuong-an-kinh-doanh-380 → FR-phuong-an-kinh-doanh-030, BR-phuong-an-kinh-doanh-024, E-phuong-an-kinh-doanh-023 · Verify bản lần đầu Chưa ký đang chờ được cập nhật theo hợp đồng thành Đã ký với tổng % mốc 0 thì P-04 hiện khối "Chưa đạt kiểm tra gửi:" có dòng "Tổng % các mốc nghiệm thu phải bằng 100% (hiện 0%)"
[2] [Yes] CHK-phuong-an-kinh-doanh-381 → FR-phuong-an-kinh-doanh-030, E-phuong-an-kinh-doanh-023 · Verify P-04 đang có khối "Chưa đạt kiểm tra gửi:" vẫn bấm Duyệt thành công
[2] [Yes] CHK-phuong-an-kinh-doanh-382 → FR-phuong-an-kinh-doanh-030 · Verify bản đang chờ đạt đủ bộ kiểm tra gửi thì P-04 không có khối "Chưa đạt kiểm tra gửi:"

##2.4. Đóng popup
[2] [Yes] CHK-phuong-an-kinh-doanh-383 → FR-phuong-an-kinh-doanh-030 · Verify bấm "Huỷ" thì P-04 đóng và phiên bản vẫn "V1, chờ CFO"
[3] [Yes] CHK-phuong-an-kinh-doanh-384 → FR-phuong-an-kinh-doanh-030 · Verify bấm nút ✕ thì P-04 đóng, không lưu gì
[3] [Yes] CHK-phuong-an-kinh-doanh-385 → FR-phuong-an-kinh-doanh-030 · Verify bấm ra nền mờ ngoài P-04 thì popup đóng, không lưu gì

#3. P-04 — PAKD đã cập nhật theo hợp đồng sau khi nộp
##3.1. Nhãn và so sánh với bản chụp
[1] [Yes] CHK-phuong-an-kinh-doanh-386 → FR-phuong-an-kinh-doanh-043 · Verify phiên bản lần đầu có dấu cập nhật theo hợp đồng thì P-04 hiện nhãn "Cập nhật theo hợp đồng sau khi nộp"
[1] [Yes] CHK-phuong-an-kinh-doanh-387 → FR-phuong-an-kinh-doanh-043 · Verify P-04 của phiên bản có dấu hiện phần so sánh bản chụp lúc nộp với nội dung hiện tại đủ 8 trường Tình trạng, Số HĐ, Ngày ký, Giá trị HĐ, Bắt đầu / Kết thúc, Doanh thu, Chi phí, LN gộp
[1] [Yes] CHK-phuong-an-kinh-doanh-388 → FR-phuong-an-kinh-doanh-043 · Verify Duyệt phiên bản có dấu thì cột "Giá trị hợp đồng dự kiến" của dự án theo doanh thu của nội dung hiện tại, không theo bản chụp

##3.2. Nội dung đổi khi P-04 đang mở
[1] [No] CHK-phuong-an-kinh-doanh-389 → FR-phuong-an-kinh-doanh-043, FR-phuong-an-kinh-doanh-031, E-phuong-an-kinh-doanh-019 · Verify P-04 đang mở, P-03 được lưu lần nữa làm đổi bản đang chờ, Kế toán bấm Duyệt thì bị từ chối với thông báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại."
[1] [No] CHK-phuong-an-kinh-doanh-390 → FR-phuong-an-kinh-doanh-043, E-phuong-an-kinh-doanh-019 · Verify sau thông báo dữ liệu vừa đổi trên P-04, popup nạp lại theo nội dung mới và giữ Ý kiến đang nhập
[2] [No] CHK-phuong-an-kinh-doanh-391 → FR-phuong-an-kinh-doanh-043, FR-phuong-an-kinh-doanh-032 · Verify P-04 đang mở, nội dung bản chờ đổi, Kế toán bấm Từ chối thì không ghi quyết định và hiện thông báo dữ liệu vừa đổi

#4. Kế toán Duyệt PAKD lần đầu
##4.1. Kết quả duyệt
[1] [Yes] CHK-phuong-an-kinh-doanh-392 → FR-phuong-an-kinh-doanh-031, BR-phuong-an-kinh-doanh-030 · Verify Kế toán bấm Duyệt khi ô Ý kiến trống thì duyệt thành công
[1] [Yes] CHK-phuong-an-kinh-doanh-393 → FR-phuong-an-kinh-doanh-031 · Verify Duyệt thành công hiện toast "Kế toán đã duyệt PAKD V1 — dự án chuyển "Đang thực hiện""
[1] [Yes] CHK-phuong-an-kinh-doanh-394 → FR-phuong-an-kinh-doanh-031, BR-phuong-an-kinh-doanh-028 · Verify Duyệt lần đầu thì dự án chuyển "Đang thực hiện"
[1] [Yes] CHK-phuong-an-kinh-doanh-395 → FR-phuong-an-kinh-doanh-031 · Verify Duyệt thì cột "Phiên bản PAKD" hiển thị "V1, đã duyệt"
[3] [Yes] CHK-phuong-an-kinh-doanh-396 → FR-phuong-an-kinh-doanh-031, BR-phuong-an-kinh-doanh-031 · Verify phiên bản đã duyệt hiển thị người quyết định là mã vai trò "CFO"
[2] [No] CHK-phuong-an-kinh-doanh-397 → BR-phuong-an-kinh-doanh-031 · Verify phiên bản đã duyệt lưu kèm tài khoản Kế toán đã quyết định để tra cứu
[2] [Yes] CHK-phuong-an-kinh-doanh-398 → FR-phuong-an-kinh-doanh-031, FR-phuong-an-kinh-doanh-038, BR-phuong-an-kinh-doanh-031 · Verify Duyệt có ý kiến "Đồng ý" thì tab "Lịch sử" có dòng "CFO duyệt PAKD" kèm ý kiến, người thực hiện "{tài khoản} (CFO)"
[3] [Yes] CHK-phuong-an-kinh-doanh-399 → BR-phuong-an-kinh-doanh-030 · Verify Duyệt với ý kiến "  Đồng ý  " thì lịch sử ghi ý kiến "Đồng ý" (đã cắt khoảng trắng)
[4] [No] CHK-phuong-an-kinh-doanh-400 → BR-phuong-an-kinh-doanh-030 · Verify phiên bản "Chờ CFO" đã có ý kiến lưu trước, Duyệt không nhập ý kiến thì phiên bản giữ ý kiến cũ
[2] [Yes] CHK-phuong-an-kinh-doanh-401 → BR-phuong-an-kinh-doanh-009, E-phuong-an-kinh-doanh-016 · Verify Biên lợi nhuận bản chờ 15.0% vẫn Duyệt thành công
[1] [Yes] CHK-phuong-an-kinh-doanh-402 → FR-phuong-an-kinh-doanh-031, BR-phuong-an-kinh-doanh-028 · Verify dự án "Pending" có bản chờ, Kế toán Duyệt thì dự án chuyển "Đang thực hiện"

##4.2. Đồng bộ số liệu vào dự án
[1] [Yes] CHK-phuong-an-kinh-doanh-403 → FR-phuong-an-kinh-doanh-031, BR-phuong-an-kinh-doanh-026, BR-phuong-an-kinh-doanh-027 · Verify Duyệt PAKD doanh thu 1,000,000,000 thì cột "Giá trị hợp đồng dự kiến" của dự án hiển thị 1,000,000,000
[1] [No] CHK-phuong-an-kinh-doanh-404 → BR-phuong-an-kinh-doanh-027, BR-phuong-an-kinh-doanh-008 · Verify Duyệt thì Chi phí SX kế hoạch và Chi phí KD kế hoạch của dự án bằng Chi phí SX / KD của PAKD
[1] [No] CHK-phuong-an-kinh-doanh-405 → BR-phuong-an-kinh-doanh-027 · Verify Duyệt PAKD Đã ký thì cờ "đã ký" của dự án là "đã ký"
[2] [No] CHK-phuong-an-kinh-doanh-406 → BR-phuong-an-kinh-doanh-027 · Verify Duyệt PAKD Đã ký có Ngày ký thực tế thì Ngày dự kiến ký của dự án bằng Ngày ký thực tế
[3] [No] CHK-phuong-an-kinh-doanh-407 → BR-phuong-an-kinh-doanh-027 · Verify Duyệt PAKD Đã ký trống Ngày ký thực tế thì Ngày dự kiến ký của dự án bằng Ngày ký trên HĐ
[3] [No] CHK-phuong-an-kinh-doanh-408 → BR-phuong-an-kinh-doanh-027 · Verify Duyệt PAKD Đã ký trống cả 2 ngày ký thì Ngày dự kiến ký của dự án giữ giá trị cũ
[2] [No] CHK-phuong-an-kinh-doanh-409 → BR-phuong-an-kinh-doanh-027 · Verify Duyệt PAKD Chưa ký dự kiến ký 05/2027 thì Ngày dự kiến ký của dự án là 01/05/2027
[1] [No] CHK-phuong-an-kinh-doanh-410 → BR-phuong-an-kinh-doanh-027 · Verify Duyệt PAKD Đã ký Bắt đầu 03/2027, Kết thúc 12/2027 thì Ngày bắt đầu dự án là 01/03/2027
[2] [No] CHK-phuong-an-kinh-doanh-411 → BR-phuong-an-kinh-doanh-027 · Verify Duyệt PAKD Đã ký Kết thúc 01/2027 thì Ngày kết thúc dự án là 31/01/2027
[2] [No] CHK-phuong-an-kinh-doanh-412 → BR-phuong-an-kinh-doanh-027 · Verify Duyệt PAKD Đã ký Kết thúc 02/2028 thì Ngày kết thúc dự án là 29/02/2028 (năm nhuận)
[1] [No] CHK-phuong-an-kinh-doanh-413 → FR-phuong-an-kinh-doanh-031, BR-phuong-an-kinh-doanh-027 · Verify Duyệt thì kế hoạch theo tháng của dự án được thay toàn bộ bằng kế hoạch sinh từ PAKD, nguồn ghi "PAKD lập trên hệ thống"
[2] [No] CHK-phuong-an-kinh-doanh-414 → BR-phuong-an-kinh-doanh-027 · Verify Duyệt PAKD không sinh tháng nào thì kế hoạch theo tháng cũ của dự án giữ nguyên
[1] [No] CHK-phuong-an-kinh-doanh-415 → BR-phuong-an-kinh-doanh-013 · Verify Duyệt PAKD Đã ký có mốc 30% Thời điểm 04/2027 thì doanh thu tháng 04/2027 trong kế hoạch tháng của dự án bằng giá trị mốc
[2] [No] CHK-phuong-an-kinh-doanh-416 → BR-phuong-an-kinh-doanh-014 · Verify Duyệt PAKD Chưa ký thì kế hoạch tháng của dự án có chi phí chia đều theo giai đoạn, doanh thu và thu bằng 0

##4.3. Hợp đồng ban đầu từ PAKD
[1] [Yes] CHK-phuong-an-kinh-doanh-417 → FR-phuong-an-kinh-doanh-045, BR-phuong-an-kinh-doanh-045 · Verify Duyệt PAKD Đã ký khi dự án chưa có hợp đồng thì P-03 của dự án hiển thị hợp đồng mới với Số HĐ và Giá trị lấy từ PAKD
[1] [Yes] CHK-phuong-an-kinh-doanh-418 → BR-phuong-an-kinh-doanh-045 · Verify hợp đồng ban đầu tạo từ PAKD Bắt đầu 03/2027, Kết thúc 02/2028 có thời hạn 01/03/2027 → 29/02/2028
[2] [Yes] CHK-phuong-an-kinh-doanh-419 → BR-phuong-an-kinh-doanh-045 · Verify hợp đồng ban đầu có Ngày ký bằng Ngày ký thực tế của PAKD
[3] [Yes] CHK-phuong-an-kinh-doanh-420 → BR-phuong-an-kinh-doanh-045 · Verify PAKD trống Ngày ký thực tế thì hợp đồng ban đầu có Ngày ký bằng Ngày ký trên HĐ
[1] [No] CHK-phuong-an-kinh-doanh-421 → FR-phuong-an-kinh-doanh-045, FR-phuong-an-kinh-doanh-038 · Verify tạo hợp đồng ban đầu từ PAKD thì Version dự án tăng thêm đúng 1
[2] [Yes] CHK-phuong-an-kinh-doanh-422 → FR-phuong-an-kinh-doanh-045, FR-phuong-an-kinh-doanh-038 · Verify tạo hợp đồng ban đầu thì tab "Lịch sử" có dòng "Tạo hợp đồng từ PAKD V1"
[1] [Yes] CHK-phuong-an-kinh-doanh-423 → FR-phuong-an-kinh-doanh-045, BR-phuong-an-kinh-doanh-045 · Verify Duyệt PAKD Đã ký khi dự án đã có hợp đồng thì hợp đồng trên P-03 giữ nguyên, không bị ghi đè
[2] [Yes] CHK-phuong-an-kinh-doanh-424 → FR-phuong-an-kinh-doanh-045 · Verify Duyệt PAKD Chưa ký thì dự án không có hợp đồng mới
[1] [No] CHK-phuong-an-kinh-doanh-425 → FR-phuong-an-kinh-doanh-045, NFR-phuong-an-kinh-doanh-011 · Verify hợp đồng được lưu qua P-03 cùng lúc Kế toán Duyệt thì không tạo thêm hợp đồng từ PAKD và Version chỉ tăng đúng 1 lần

#5. Kế toán Từ chối PAKD lần đầu
##5.1. Ý kiến bắt buộc
[1] [Yes] CHK-phuong-an-kinh-doanh-426 → FR-phuong-an-kinh-doanh-032, BR-phuong-an-kinh-doanh-030, E-phuong-an-kinh-doanh-011 · Verify bấm Từ chối khi ô Ý kiến trống thì hiện chữ đỏ "Nhập lý do từ chối" dưới ô Ý kiến
[2] [Yes] CHK-phuong-an-kinh-doanh-427 → E-phuong-an-kinh-doanh-011 · Verify bấm Từ chối khi ô Ý kiến trống thì ô Ý kiến chuyển thành bắt buộc (*)
[1] [Yes] CHK-phuong-an-kinh-doanh-428 → E-phuong-an-kinh-doanh-011 · Verify bấm Từ chối khi Ý kiến trống thì phiên bản vẫn "V1, chờ CFO" (không lưu)
[2] [Yes] CHK-phuong-an-kinh-doanh-429 → BR-phuong-an-kinh-doanh-047 · Verify ô Ý kiến chỉ gồm khoảng trắng, bấm Từ chối thì hiện "Nhập lý do từ chối"
[2] [Yes] CHK-phuong-an-kinh-doanh-430 → E-phuong-an-kinh-doanh-011 · Verify sau lỗi "Nhập lý do từ chối", nhập ý kiến, bấm Từ chối lại thì từ chối thành công
[2] [Yes] CHK-phuong-an-kinh-doanh-431 → FR-phuong-an-kinh-doanh-032, BR-phuong-an-kinh-doanh-047, E-phuong-an-kinh-doanh-021 · Verify Ý kiến 1.001 ký tự thì hiện chữ đỏ dưới ô Ý kiến "Tối đa {n} ký tự" và không lưu quyết định

##5.2. Kết quả từ chối
[1] [Yes] CHK-phuong-an-kinh-doanh-432 → FR-phuong-an-kinh-doanh-032 · Verify Từ chối có ý kiến thì hiện toast "Kế toán đã từ chối PAKD V1 — trả về GĐK lập lại"
[1] [Yes] CHK-phuong-an-kinh-doanh-433 → FR-phuong-an-kinh-doanh-032, BR-phuong-an-kinh-doanh-028 · Verify Từ chối lần đầu thì dự án "PAKD chờ duyệt" về "Chưa có PAKD"
[1] [Yes] CHK-phuong-an-kinh-doanh-434 → FR-phuong-an-kinh-doanh-032 · Verify Từ chối thì cột "Phiên bản PAKD" hiển thị "V1, từ chối"
[2] [Yes] CHK-phuong-an-kinh-doanh-435 → FR-phuong-an-kinh-doanh-032, FR-phuong-an-kinh-doanh-038 · Verify Từ chối thì tab "Lịch sử" có dòng "CFO từ chối PAKD" kèm ý kiến
[1] [Yes] CHK-phuong-an-kinh-doanh-436 → FR-phuong-an-kinh-doanh-032, BR-phuong-an-kinh-doanh-026 · Verify Từ chối thì cột "Giá trị hợp đồng dự kiến" của dự án vẫn "—"
[1] [Yes] CHK-phuong-an-kinh-doanh-437 → FR-phuong-an-kinh-doanh-032, BR-phuong-an-kinh-doanh-028 · Verify dự án "Pending" có bản chờ, Kế toán Từ chối thì dự án giữ "Pending"
[2] [Yes] CHK-phuong-an-kinh-doanh-438 → FR-phuong-an-kinh-doanh-032, BR-phuong-an-kinh-doanh-028 · Verify Từ chối khi dự án "Pending" thì tab "Lịch sử" không có thêm dòng chuyển trạng thái dự án

#6. Quyết định cùng lúc và lỗi ghi
##6.1. Một phiên bản một quyết định
[1] [No] CHK-phuong-an-kinh-doanh-439 → FR-phuong-an-kinh-doanh-031, NFR-phuong-an-kinh-doanh-011 · Verify 2 Kế toán cùng bấm Duyệt V1 thì chỉ 1 quyết định được ghi (1 dòng lịch sử "CFO duyệt PAKD")
[1] [No] CHK-phuong-an-kinh-doanh-440 → E-phuong-an-kinh-doanh-019 · Verify 2 Kế toán cùng bấm Duyệt V1 thì người bấm sau nhận thông báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại."
[1] [No] CHK-phuong-an-kinh-doanh-441 → FR-phuong-an-kinh-doanh-032 · Verify Kế toán A Duyệt, Kế toán B Từ chối cùng V1 cùng lúc thì chỉ 1 quyết định được ghi
[2] [Yes] CHK-phuong-an-kinh-doanh-442 → NFR-phuong-an-kinh-doanh-011 · Verify bấm Duyệt 2 lần liên tiếp nhanh thì chỉ có 1 dòng lịch sử "CFO duyệt PAKD"

##6.2. Lỗi ghi khi quyết định
[1] [No] CHK-phuong-an-kinh-doanh-443 → FR-phuong-an-kinh-doanh-031, NFR-phuong-an-kinh-doanh-010 · Verify giả lập lỗi ghi khi Duyệt thì phiên bản vẫn "Chờ CFO", số liệu dự án, hợp đồng, Version, lịch sử không đổi
[1] [No] CHK-phuong-an-kinh-doanh-444 → FR-phuong-an-kinh-doanh-031, E-phuong-an-kinh-doanh-020 · Verify sau lỗi ghi khi Duyệt, P-04 giữ Ý kiến đang nhập
[2] [No] CHK-phuong-an-kinh-doanh-445 → NFR-phuong-an-kinh-doanh-010 · Verify bấm Duyệt lại sau lỗi ghi thì duyệt thành công và chỉ có 1 dòng lịch sử "CFO duyệt PAKD"
[1] [No] CHK-phuong-an-kinh-doanh-446 → FR-phuong-an-kinh-doanh-032, NFR-phuong-an-kinh-doanh-010 · Verify giả lập lỗi ghi khi Từ chối thì phiên bản vẫn "Chờ CFO", dự án giữ trạng thái và P-04 giữ Ý kiến
