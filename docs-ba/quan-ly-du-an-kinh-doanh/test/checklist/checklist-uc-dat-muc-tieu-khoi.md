#1. Mở popup P-05
##1.1. Quyền và nội dung popup
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-191 → FR-quan-ly-du-an-kinh-doanh-004 · Verify nút "Đặt mục tiêu" trên bảng ② hiển thị với tài khoản Kế toán
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-192 → FR-quan-ly-du-an-kinh-doanh-004 · Verify nút "Đặt mục tiêu" không hiển thị với mỗi vai trò SM, GĐK
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-193 → FR-quan-ly-du-an-kinh-doanh-004 · Verify đang lọc Năm 2026, bấm "Đặt mục tiêu" mở popup tiêu đề "Mục tiêu giá trị HĐ ký năm 2026"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-194 → FR-quan-ly-du-an-kinh-doanh-004 · Verify đang lọc Năm = Tất cả, bấm "Đặt mục tiêu" mở popup cho năm hiện tại
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-195 → FR-quan-ly-du-an-kinh-doanh-004 · Verify popup gồm đủ 6 khối và dòng "Toàn công ty"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-196 → FR-quan-ly-du-an-kinh-doanh-004 · Verify popup hiển thị mục tiêu hiện có của năm đó ở từng khối
##1.2. Khối có mục tiêu do BOD duyệt
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-197 → FR-quan-ly-du-an-kinh-doanh-004, BR-quan-ly-du-an-kinh-doanh-022 · Verify ô của khối đã có mục tiêu do BOD duyệt bị khoá, không nhập được
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-198 → FR-quan-ly-du-an-kinh-doanh-004 · Verify ô bị khoá hiển thị số BOD duyệt kèm nhãn "Theo BOD duyệt"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-199 → BR-quan-ly-du-an-kinh-doanh-022 · Verify khối có mục tiêu do BOD duyệt không có nút "Xoá mục tiêu"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-200 → FR-quan-ly-du-an-kinh-doanh-004 · Verify khối đang có mục tiêu nhập tay có nút "Xoá mục tiêu" cạnh ô
#2. Nhập mục tiêu
##2.1. Ô số
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-201 → FR-quan-ly-du-an-kinh-doanh-004 · Verify gõ chữ cái vào ô mục tiêu không được nhận
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-202 → FR-quan-ly-du-an-kinh-doanh-004 · Verify gõ "1500000000" ô tự hiển thị "1,500,000,000"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-203 → FR-quan-ly-du-an-kinh-doanh-004 · Verify dòng "Toàn công ty" tự cộng bằng tổng các khối khi nhập
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-204 → FR-quan-ly-du-an-kinh-doanh-004, BR-quan-ly-du-an-kinh-doanh-050 · Verify nhập đúng 15 chữ số được nhận, lưu thành công
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-205 → E-quan-ly-du-an-kinh-doanh-040, FR-quan-ly-du-an-kinh-doanh-004 · Verify nhập 16 chữ số hiện chữ đỏ "Tối đa 15 chữ số" dưới ô
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-206 → E-quan-ly-du-an-kinh-doanh-040 · Verify bấm "Lưu mục tiêu" khi ô có 16 chữ số thì mục tiêu không được lưu
#3. Lưu mục tiêu
##3.1. Lưu thành công
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-207 → FR-quan-ly-du-an-kinh-doanh-004, BR-quan-ly-du-an-kinh-doanh-022 · Verify nhập mục tiêu cho khối G1 chưa có mục tiêu, bấm "Lưu mục tiêu" thì bảng ② hiện mục tiêu mới của G1
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-208 → FR-quan-ly-du-an-kinh-doanh-004 · Verify sau khi lưu, ô ① và % Đạt ở bảng ② tính lại ngay theo mục tiêu mới
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-209 → BR-quan-ly-du-an-kinh-doanh-022 · Verify để trống ô của khối đang có mục tiêu nhập tay, bấm Lưu thì mục tiêu của khối đó giữ nguyên
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-210 → FR-quan-ly-du-an-kinh-doanh-004, BR-quan-ly-du-an-kinh-doanh-022 · Verify nhập 0 cho khối đang có mục tiêu nhập tay, bấm Lưu thì mục tiêu của khối đó giữ nguyên
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-211 → BR-quan-ly-du-an-kinh-doanh-022 · Verify để trống ô của khối chưa có mục tiêu, bấm Lưu thì khối đó vẫn hiện "—" ở % Đạt (không thành mục tiêu 0)
[2] [No] CHK-quan-ly-du-an-kinh-doanh-212 → BR-quan-ly-du-an-kinh-doanh-022, FR-quan-ly-du-an-kinh-doanh-004 · Verify mỗi lần lưu ghi nhật ký mục tiêu khối đủ người thao tác, thời điểm, năm × khối, giá trị cũ → mới
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-213 → BR-quan-ly-du-an-kinh-doanh-022 · Verify BOD phê duyệt mục tiêu khối G1 ở MH-01 sau khi Kế toán đã nhập tay thì bảng ② hiện số BOD duyệt cho G1
##3.2. Đóng không lưu
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-214 → FR-quan-ly-du-an-kinh-doanh-004 · Verify bấm "Huỷ" đóng popup, mục tiêu các khối không đổi
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-215 → FR-quan-ly-du-an-kinh-doanh-004 · Verify bấm vào nền ngoài popup đóng popup, mục tiêu các khối không đổi
#4. Xoá mục tiêu nhập tay
##4.1. Xác nhận xoá
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-216 → FR-quan-ly-du-an-kinh-doanh-004 · Verify bấm "Xoá mục tiêu" của khối G2 năm 2026 hiện hộp hỏi xác nhận đúng câu "Xoá mục tiêu năm 2026 của khối G2" kèm dấu chấm hỏi
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-217 → FR-quan-ly-du-an-kinh-doanh-004, BR-quan-ly-du-an-kinh-doanh-022 · Verify đồng ý xoá thì khối G2 về "chưa có mục tiêu", bảng ② hiện "—" ở % Đạt của G2
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-218 → FR-quan-ly-du-an-kinh-doanh-004 · Verify sau khi xoá mục tiêu, ô ① tính lại ngay
[2] [No] CHK-quan-ly-du-an-kinh-doanh-219 → BR-quan-ly-du-an-kinh-doanh-022 · Verify xoá mục tiêu ghi nhật ký mục tiêu khối với giá trị cũ → trống
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-220 → FR-quan-ly-du-an-kinh-doanh-004 · Verify huỷ hộp xác nhận xoá thì mục tiêu của khối giữ nguyên
#5. Lỗi và thao tác cùng lúc
##5.1. BOD duyệt trong lúc P-05 đang mở
[1] [No] CHK-quan-ly-du-an-kinh-doanh-221 → FR-quan-ly-du-an-kinh-doanh-004, E-quan-ly-du-an-kinh-doanh-030 · Verify BOD duyệt mục tiêu khối G3 trong lúc Kế toán đang nhập G3 ở P-05, bấm Lưu thì hiện "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại."
[1] [No] CHK-quan-ly-du-an-kinh-doanh-222 → FR-quan-ly-du-an-kinh-doanh-004, E-quan-ly-du-an-kinh-doanh-030 · Verify sau lỗi BOD vừa duyệt, mục tiêu khối G3 giữ số BOD duyệt, số Kế toán vừa nhập không được ghi
[2] [No] CHK-quan-ly-du-an-kinh-doanh-223 → E-quan-ly-du-an-kinh-doanh-030 · Verify sau lỗi BOD vừa duyệt, popup P-05 nạp lại mục tiêu mới nhất, ô G3 bị khoá
[2] [No] CHK-quan-ly-du-an-kinh-doanh-224 → FR-quan-ly-du-an-kinh-doanh-004 · Verify bấm "Xoá mục tiêu" của khối vừa được BOD duyệt trong lúc popup mở thì khối giữ mục tiêu BOD duyệt, không bị xoá
##5.2. Ghi không trọn vẹn
[1] [No] CHK-quan-ly-du-an-kinh-doanh-225 → FR-quan-ly-du-an-kinh-doanh-004, E-quan-ly-du-an-kinh-doanh-037 · Verify giả lập lỗi ghi giữa chừng khi Lưu mục tiêu thì hiện "Thao tác chưa thực hiện được, vui lòng thử lại"
[1] [No] CHK-quan-ly-du-an-kinh-doanh-226 → NFR-quan-ly-du-an-kinh-doanh-014, E-quan-ly-du-an-kinh-doanh-037 · Verify sau lỗi ghi giữa chừng khi Lưu mục tiêu, mục tiêu các khối không đổi
[2] [No] CHK-quan-ly-du-an-kinh-doanh-227 → E-quan-ly-du-an-kinh-doanh-037 · Verify sau lỗi ghi không trọn vẹn, popup P-05 vẫn giữ các số đang nhập
