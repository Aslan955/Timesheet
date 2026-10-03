#1. Mở popup P-01 Thêm khách hàng
##1.1. Nội dung popup
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-316 → FR-quan-ly-du-an-kinh-doanh-016 · Verify bấm link "+ Mới" cạnh ô Tên khách hàng mở popup "Thêm khách hàng" có đủ 7 trường Tên khách hàng *, Nội bộ, Mã KH *, Địa chỉ, Email, Số điện thoại, Mô tả
#2. Nhập thông tin khách hàng
##2.1. Ô Mã KH
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-317 → FR-quan-ly-du-an-kinh-doanh-016, BR-quan-ly-du-an-kinh-doanh-027 · Verify gõ "ab1" vào ô Mã KH tự hiển thị "AB1"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-318 → FR-quan-ly-du-an-kinh-doanh-016, BR-quan-ly-du-an-kinh-doanh-027 · Verify gõ "A B1" vào ô Mã KH tự hiển thị "AB1"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-319 → FR-quan-ly-du-an-kinh-doanh-016, BR-quan-ly-du-an-kinh-doanh-027 · Verify gõ ký tự thứ 4 vào ô Mã KH không được nhận
##2.2. Giới hạn độ dài
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-320 → BR-quan-ly-du-an-kinh-doanh-050, FR-quan-ly-du-an-kinh-doanh-016 · Verify Tên khách hàng dài 256 ký tự, bấm Lưu hiện "Tối đa 255 ký tự" dưới ô
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-321 → BR-quan-ly-du-an-kinh-doanh-050 · Verify Mô tả dài 1.001 ký tự, bấm Lưu hiện "Tối đa {n} ký tự" với n là 1.000
#3. Lưu khách hàng
##3.1. Lưu thành công
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-322 → FR-quan-ly-du-an-kinh-doanh-016, BR-quan-ly-du-an-kinh-doanh-034 · Verify nhập hợp lệ, bấm "Lưu" thì khách hàng mới được chọn sẵn ở ô Tên khách hàng của form dự án
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-323 → FR-quan-ly-du-an-kinh-doanh-016 · Verify sau khi lưu, ô Mã khách hàng của form tự điền mã khách hàng mới
[2] [No] CHK-quan-ly-du-an-kinh-doanh-324 → FR-quan-ly-du-an-kinh-doanh-016, BR-quan-ly-du-an-kinh-doanh-034 · Verify khách hàng mới được lưu vào danh mục IMIS đủ các trường Tên, Nội bộ, Mã KH, Địa chỉ, Email, Số điện thoại, Mô tả
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-325 → FR-quan-ly-du-an-kinh-doanh-016, BR-quan-ly-du-an-kinh-doanh-034, NFR-quan-ly-du-an-kinh-doanh-014 · Verify thêm khách hàng ở P-01, bấm "Huỷ" màn tạo dự án, mở lại màn tạo thì khách hàng mới vẫn có trong ô Tên khách hàng
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-326 → BR-quan-ly-du-an-kinh-doanh-027 · Verify để trống Email thì lưu được
##3.2. Phím tắt và đóng popup
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-327 → FR-quan-ly-du-an-kinh-doanh-016 · Verify nhấn Enter khi đang ở ô Tên khách hàng thực hiện Lưu
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-328 → FR-quan-ly-du-an-kinh-doanh-016 · Verify nhấn Enter khi đang ở ô Mô tả không thực hiện Lưu
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-329 → FR-quan-ly-du-an-kinh-doanh-016 · Verify nhấn Esc thì popup đóng mà không thêm khách hàng
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-330 → FR-quan-ly-du-an-kinh-doanh-016 · Verify bấm vào nền ngoài popup thì popup đóng mà không thêm khách hàng
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-331 → FR-quan-ly-du-an-kinh-doanh-016 · Verify bấm "Huỷ" thì popup đóng mà không thêm khách hàng
#4. Kiểm tra dữ liệu
##4.1. Lỗi chặn lưu
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-332 → E-quan-ly-du-an-kinh-doanh-007, BR-quan-ly-du-an-kinh-doanh-027 · Verify bỏ trống Tên khách hàng, bấm Lưu hiện "Nhập tên khách hàng"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-333 → E-quan-ly-du-an-kinh-doanh-008, BR-quan-ly-du-an-kinh-doanh-027 · Verify bỏ trống Mã KH, bấm Lưu hiện "Nhập mã khách hàng"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-334 → E-quan-ly-du-an-kinh-doanh-009, BR-quan-ly-du-an-kinh-doanh-027 · Verify Mã KH chỉ 2 ký tự, bấm Lưu hiện "Mã KH gồm đúng 3 ký tự chữ / số, viết liền, không dấu"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-335 → BR-quan-ly-du-an-kinh-doanh-027 · Verify Mã KH chứa ký tự có dấu "Ă1B", bấm Lưu hiện "Mã KH gồm đúng 3 ký tự chữ / số, viết liền, không dấu"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-336 → E-quan-ly-du-an-kinh-doanh-010, BR-quan-ly-du-an-kinh-doanh-027 · Verify Mã KH trùng mã khách hàng đã có trong danh mục, bấm Lưu hiện "Mã khách hàng đã tồn tại"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-337 → E-quan-ly-du-an-kinh-doanh-010 · Verify sau lỗi mã trùng, đổi sang mã chưa có, bấm Lưu thì lưu thành công
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-338 → E-quan-ly-du-an-kinh-doanh-011, BR-quan-ly-du-an-kinh-doanh-027 · Verify Email nhập "abc@xyz" sai dạng, bấm Lưu hiện "Email không hợp lệ"
##4.2. Thời điểm hiện lỗi
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-339 → BR-quan-ly-du-an-kinh-doanh-027, FR-quan-ly-du-an-kinh-doanh-016 · Verify mở popup, chưa bấm Lưu thì không hiện lỗi nào dù ô bắt buộc đang trống
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-340 → BR-quan-ly-du-an-kinh-doanh-027 · Verify sau lần bấm Lưu đầu, nhập Tên khách hàng thì lỗi "Nhập tên khách hàng" biến mất ngay
##4.3. Cảnh báo trùng tên
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-341 → E-quan-ly-du-an-kinh-doanh-043, BR-quan-ly-du-an-kinh-doanh-027 · Verify Tên khách hàng " công ty abc " trùng khách hàng "Công ty ABC" mã "ABC" thì dưới ô hiện cảnh báo "Đã có khách hàng cùng tên (ABC)"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-342 → E-quan-ly-du-an-kinh-doanh-043, FR-quan-ly-du-an-kinh-doanh-016 · Verify khi có cảnh báo trùng tên, nhập Mã KH khác, bấm Lưu thì vẫn lưu thành công
#5. Lỗi khi ghi vào danh mục IMIS
##5.1. Mã vừa được người khác thêm
[1] [No] CHK-quan-ly-du-an-kinh-doanh-343 → E-quan-ly-du-an-kinh-doanh-010, FR-quan-ly-du-an-kinh-doanh-016, BR-quan-ly-du-an-kinh-doanh-027 · Verify 2 phiên cùng lúc thêm khách hàng cùng Mã KH, phiên lưu sau hiện "Mã khách hàng đã tồn tại"
##5.2. IMIS không ghi được
[1] [No] CHK-quan-ly-du-an-kinh-doanh-344 → E-quan-ly-du-an-kinh-doanh-039, FR-quan-ly-du-an-kinh-doanh-016, BR-quan-ly-du-an-kinh-doanh-034 · Verify giả lập IMIS lỗi khi bấm Lưu hợp lệ thì hiện "Không lưu được khách hàng, vui lòng thử lại"
[2] [No] CHK-quan-ly-du-an-kinh-doanh-345 → E-quan-ly-du-an-kinh-doanh-039 · Verify sau lỗi ghi IMIS, popup P-01 vẫn mở, giữ nguyên dữ liệu đã nhập
[2] [No] CHK-quan-ly-du-an-kinh-doanh-346 → E-quan-ly-du-an-kinh-doanh-039 · Verify sau lỗi ghi IMIS, ô Tên khách hàng của form dự án chưa có khách hàng mới
[2] [No] CHK-quan-ly-du-an-kinh-doanh-347 → E-quan-ly-du-an-kinh-doanh-039 · Verify IMIS hoạt động lại, bấm "Lưu" lần nữa thì lưu thành công
