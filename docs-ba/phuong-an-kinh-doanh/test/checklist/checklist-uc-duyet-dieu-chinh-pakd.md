#1. Mở P-04 bản điều chỉnh
##1.1. Từ danh sách và màn chi tiết
[1] [Yes] CHK-phuong-an-kinh-doanh-524 → FR-phuong-an-kinh-doanh-035 · Verify Kế toán xem danh sách thấy link "Duyệt điều chỉnh" ở dự án "Đang thực hiện" có bản điều chỉnh chờ duyệt
[1] [Yes] CHK-phuong-an-kinh-doanh-525 → FR-phuong-an-kinh-doanh-029 · Verify bấm link "Duyệt điều chỉnh" mở P-04 ngay trên danh sách
[2] [Yes] CHK-phuong-an-kinh-doanh-526 → FR-phuong-an-kinh-doanh-035 · Verify SM xem danh sách thấy link "Cập nhật" ở dự án có bản điều chỉnh chờ duyệt
[2] [Yes] CHK-phuong-an-kinh-doanh-527 → FR-phuong-an-kinh-doanh-035 · Verify bấm link "Cập nhật" mở màn chi tiết của dự án
[1] [Yes] CHK-phuong-an-kinh-doanh-528 → FR-phuong-an-kinh-doanh-036 · Verify Kế toán mở dự án có bản điều chỉnh chờ thấy dòng thông báo "Bản điều chỉnh PAKD V2 đang chờ Kế toán (CFO) duyệt lại."
[1] [Yes] CHK-phuong-an-kinh-doanh-529 → FR-phuong-an-kinh-doanh-029 · Verify bấm nút "Duyệt / Từ chối điều chỉnh" trên dòng thông báo mở P-04
[2] [Yes] CHK-phuong-an-kinh-doanh-530 → FR-phuong-an-kinh-doanh-036 · Verify SM mở dự án có bản điều chỉnh chờ thấy dòng thông báo "Đang chờ Kế toán (CFO) duyệt bản điều chỉnh PAKD V2."
[1] [Yes] CHK-phuong-an-kinh-doanh-531 → FR-phuong-an-kinh-doanh-036 · Verify AM mở dự án có bản điều chỉnh chờ thấy dòng thông báo "Đang chờ Kế toán duyệt PAKD." không có số phiên bản

#2. Nội dung P-04 dạng bản điều chỉnh
##2.1. So sánh cũ → mới
[2] [Yes] CHK-phuong-an-kinh-doanh-532 → FR-phuong-an-kinh-doanh-030 · Verify P-04 của bản điều chỉnh V2 có tiêu đề "CFO duyệt bản điều chỉnh PAKD — V2"
[1] [Yes] CHK-phuong-an-kinh-doanh-533 → FR-phuong-an-kinh-doanh-030 · Verify bản điều chỉnh đổi Chưa ký sang Đã ký thì P-04 hiện Tình trạng hợp đồng "Chưa ký → Đã ký"
[1] [Yes] CHK-phuong-an-kinh-doanh-534 → FR-phuong-an-kinh-doanh-030 · Verify P-04 hiện Doanh thu, Chi phí kế hoạch, LN gộp dạng giá trị cũ (gạch ngang) → giá trị mới
[2] [Yes] CHK-phuong-an-kinh-doanh-535 → FR-phuong-an-kinh-doanh-030 · Verify LN gộp mới trên P-04 điều chỉnh kèm biên % của bản mới
[2] [Yes] CHK-phuong-an-kinh-doanh-536 → FR-phuong-an-kinh-doanh-030 · Verify bản điều chỉnh mới là Đã ký thì P-04 hiện Số HĐ / ngày ký
[3] [Yes] CHK-phuong-an-kinh-doanh-537 → FR-phuong-an-kinh-doanh-030 · Verify bản điều chỉnh mới là Chưa ký thì P-04 không hiện Số HĐ / ngày ký
[3] [Yes] CHK-phuong-an-kinh-doanh-538 → FR-phuong-an-kinh-doanh-030 · Verify P-04 điều chỉnh có chú thích "Duyệt → áp dụng bản điều chỉnh (doanh thu, chi phí, hợp đồng, kế hoạch theo tháng). Từ chối → giữ bản đang áp dụng, bản điều chỉnh trả về GĐK / SM sửa tiếp."
[2] [Yes] CHK-phuong-an-kinh-doanh-539 → FR-phuong-an-kinh-doanh-030, E-phuong-an-kinh-doanh-015 · Verify dự án có hợp đồng lệch doanh thu bản điều chỉnh 3% thì P-04 điều chỉnh hiện dòng "Giá trị HĐ hiện có {x} — lệch {z%} ⚠"

##2.2. Điểm chưa đạt và cập nhật theo hợp đồng
[1] [Yes] CHK-phuong-an-kinh-doanh-540 → FR-phuong-an-kinh-doanh-030, FR-phuong-an-kinh-doanh-041, BR-phuong-an-kinh-doanh-024, E-phuong-an-kinh-doanh-023 · Verify bản điều chỉnh sinh từ P-03 (PAKD áp dụng Chưa ký chuyển Đã ký, tổng % mốc 0) thì P-04 hiện khối "Chưa đạt kiểm tra gửi:" có dòng "Tổng % các mốc nghiệm thu phải bằng 100% (hiện 0%)"
[2] [Yes] CHK-phuong-an-kinh-doanh-541 → E-phuong-an-kinh-doanh-023 · Verify P-04 có khối "Chưa đạt kiểm tra gửi:" Kế toán vẫn Từ chối kèm ý kiến được
[1] [Yes] CHK-phuong-an-kinh-doanh-542 → FR-phuong-an-kinh-doanh-043 · Verify bản điều chỉnh chờ có dấu cập nhật theo hợp đồng thì P-04 hiển thị đủ nhãn "Cập nhật theo hợp đồng sau khi nộp", phần so sánh 8 trường với bản chụp và phần cũ → mới

#3. Kế toán Duyệt bản điều chỉnh
##3.1. Kết quả duyệt điều chỉnh
[1] [Yes] CHK-phuong-an-kinh-doanh-543 → FR-phuong-an-kinh-doanh-031 · Verify Duyệt bản điều chỉnh thì hiện toast "Kế toán đã duyệt bản điều chỉnh PAKD V2 — đã cập nhật số liệu dự án"
[1] [Yes] CHK-phuong-an-kinh-doanh-544 → FR-phuong-an-kinh-doanh-031, BR-phuong-an-kinh-doanh-029 · Verify Duyệt bản điều chỉnh doanh thu 1,200,000,000 thì cột "Giá trị hợp đồng dự kiến" cập nhật 1,200,000,000
[1] [Yes] CHK-phuong-an-kinh-doanh-545 → FR-phuong-an-kinh-doanh-031 · Verify Duyệt bản điều chỉnh thì cột "Phiên bản PAKD" hiển thị "V2, đã duyệt"
[1] [Yes] CHK-phuong-an-kinh-doanh-546 → FR-phuong-an-kinh-doanh-031, BR-phuong-an-kinh-doanh-029 · Verify Duyệt bản điều chỉnh thì khung hiển thị nội dung bản điều chỉnh làm PAKD đang áp dụng, nhãn "Đã duyệt", không còn dải điều chỉnh
[1] [Yes] CHK-phuong-an-kinh-doanh-547 → BR-phuong-an-kinh-doanh-029 · Verify Duyệt bản điều chỉnh thì dự án vẫn "Đang thực hiện"
[2] [Yes] CHK-phuong-an-kinh-doanh-548 → FR-phuong-an-kinh-doanh-031, FR-phuong-an-kinh-doanh-038 · Verify Duyệt bản điều chỉnh thì tab "Lịch sử" có dòng "CFO duyệt điều chỉnh PAKD"
[1] [No] CHK-phuong-an-kinh-doanh-549 → BR-phuong-an-kinh-doanh-029 · Verify Duyệt bản điều chỉnh thì kế hoạch theo tháng của dự án được thay bằng kế hoạch sinh từ bản điều chỉnh
[1] [Yes] CHK-phuong-an-kinh-doanh-550 → FR-phuong-an-kinh-doanh-045 · Verify Duyệt bản điều chỉnh Đã ký khi dự án chưa có hợp đồng thì P-03 hiển thị hợp đồng ban đầu tạo từ bản điều chỉnh
[2] [Yes] CHK-phuong-an-kinh-doanh-551 → FR-phuong-an-kinh-doanh-045 · Verify tạo hợp đồng ban đầu từ bản điều chỉnh thì tab "Lịch sử" có dòng "Tạo hợp đồng từ PAKD V2"
[1] [Yes] CHK-phuong-an-kinh-doanh-552 → FR-phuong-an-kinh-doanh-045 · Verify Duyệt bản điều chỉnh Đã ký khi dự án đã có hợp đồng thì hợp đồng giữ nguyên
[2] [Yes] CHK-phuong-an-kinh-doanh-553 → FR-phuong-an-kinh-doanh-007 · Verify sau Duyệt bản điều chỉnh SM thấy lại nút "Sửa PAKD"
[2] [Yes] CHK-phuong-an-kinh-doanh-554 → BR-phuong-an-kinh-doanh-025 · Verify điều chỉnh tiếp sau khi V2 được duyệt thì lần gửi kế tiếp mang số V3

#4. Kế toán Từ chối bản điều chỉnh
##4.1. Kết quả từ chối điều chỉnh
[1] [Yes] CHK-phuong-an-kinh-doanh-555 → FR-phuong-an-kinh-doanh-032, E-phuong-an-kinh-doanh-011 · Verify Từ chối bản điều chỉnh khi Ý kiến trống thì hiện "Nhập lý do từ chối"
[1] [Yes] CHK-phuong-an-kinh-doanh-556 → FR-phuong-an-kinh-doanh-032 · Verify Từ chối bản điều chỉnh có ý kiến thì hiện toast "Kế toán đã từ chối bản điều chỉnh PAKD V2 — giữ bản đang áp dụng"
[1] [Yes] CHK-phuong-an-kinh-doanh-557 → FR-phuong-an-kinh-doanh-032, BR-phuong-an-kinh-doanh-029 · Verify Từ chối bản điều chỉnh thì cột "Giá trị hợp đồng dự kiến" giữ theo V1
[1] [Yes] CHK-phuong-an-kinh-doanh-558 → BR-phuong-an-kinh-doanh-029 · Verify Từ chối bản điều chỉnh thì cột "Phiên bản PAKD" hiển thị "V2, từ chối"
[1] [Yes] CHK-phuong-an-kinh-doanh-559 → FR-phuong-an-kinh-doanh-032, BR-phuong-an-kinh-doanh-029 · Verify sau Từ chối bản điều chỉnh, SM mở dự án thấy nhãn "Điều chỉnh bị từ chối" và nội dung bản điều chỉnh còn để sửa tiếp
[1] [Yes] CHK-phuong-an-kinh-doanh-560 → BR-phuong-an-kinh-doanh-029 · Verify Từ chối bản điều chỉnh thì dự án vẫn "Đang thực hiện"
[2] [Yes] CHK-phuong-an-kinh-doanh-561 → FR-phuong-an-kinh-doanh-032, FR-phuong-an-kinh-doanh-038 · Verify Từ chối bản điều chỉnh thì tab "Lịch sử" có dòng "CFO từ chối điều chỉnh PAKD" kèm ý kiến

#5. Quyết định điều chỉnh — cùng lúc và lỗi ghi
##5.1. Dữ liệu vừa đổi, quyền và lỗi ghi
[1] [No] CHK-phuong-an-kinh-doanh-562 → FR-phuong-an-kinh-doanh-031, FR-phuong-an-kinh-doanh-032 · Verify 2 Kế toán cùng quyết định bản điều chỉnh V2 thì chỉ 1 quyết định được ghi, người sau nhận thông báo dữ liệu vừa đổi
[1] [No] CHK-phuong-an-kinh-doanh-563 → FR-phuong-an-kinh-doanh-043 · Verify nội dung bản điều chỉnh đổi (lưu P-03) trong lúc P-04 mở, Kế toán bấm Duyệt thì không ghi, P-04 nạp lại và giữ Ý kiến
[1] [No] CHK-phuong-an-kinh-doanh-564 → BR-phuong-an-kinh-doanh-004 · Verify SM gửi yêu cầu ghi quyết định điều chỉnh bằng đường ngoài giao diện thì bị từ chối "Bạn không có quyền thực hiện thao tác này."
[1] [No] CHK-phuong-an-kinh-doanh-565 → FR-phuong-an-kinh-doanh-031, NFR-phuong-an-kinh-doanh-010 · Verify giả lập lỗi ghi khi Duyệt bản điều chỉnh thì số liệu dự án, PAKD đang áp dụng, phiên bản giữ nguyên và P-04 giữ Ý kiến
